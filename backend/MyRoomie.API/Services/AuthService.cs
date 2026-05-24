using Google.Cloud.Firestore;
using MyRoomie.API.DTOs;
using MyRoomie.API.Entities;
using MyRoomie.API.Services.Interfaces;

namespace MyRoomie.API.Services;

public class AuthService : IAuthService
{
    private readonly FirestoreDb _db;
    private readonly IJwtService _jwt;
    private readonly IEmailService _email;
    private readonly ILogger<AuthService> _logger;

    private const string UsersCollection = "users";
    private const string OtpCollection = "otpCodes";
    private const int OtpExpiryMinutes = 5;
    private const int OtpResendCooldownSeconds = 60;

    public AuthService(
        FirestoreDb db,
        IJwtService jwt,
        IEmailService email,
        ILogger<AuthService> logger)
    {
        _db = db;
        _jwt = jwt;
        _email = email;
        _logger = logger;
    }

    // ─── Register ────────────────────────────────────────────────────────────
    public async Task<(bool Success, string Message)> RegisterAsync(
        string email, string password, string name, string role,
        string? phone, string? area, string? rooms,
        string? description, string? budget, string? intro)
    {
        email = email.ToLowerInvariant().Trim();

        // Validate role
        if (role != "landlord" && role != "tenant")
            return (false, "Vai trò không hợp lệ.");

        // Check email exists
        var existing = await FindUserByEmailAsync(email);
        if (existing is not null)
        {
            if (!existing.IsEmailVerified)
                return (false, "EMAIL_PENDING_VERIFICATION");
            return (false, "Email đã được sử dụng.");
        }

        // Create user
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Name = name,
            Role = role,
            Status = "pending",
            IsEmailVerified = false,
            Phone = phone,
            Area = area,
            Rooms = rooms,
            Description = description,
            Budget = budget,
            Intro = intro,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var userDoc = _db.Collection(UsersCollection).Document(user.Id);
        await userDoc.SetAsync(UserToDict(user));

        // Generate and send OTP
        await GenerateAndSendOtpAsync(user.Id, email, name, "Register");

        _logger.LogInformation("User registered: {Email}", email);
        return (true, "Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP.");
    }

    // ─── Verify OTP ──────────────────────────────────────────────────────────
    public async Task<(bool Success, string Message, AuthResponseDto? Result)> VerifyOtpAsync(
        string email, string code)
    {
        email = email.ToLowerInvariant().Trim();

        var user = await FindUserByEmailAsync(email);
        if (user is null)
            return (false, "Không tìm thấy tài khoản với email này.", null);

        if (user.IsEmailVerified)
            return (false, "Email đã được xác thực trước đó.", null);

        // Find valid OTP
        var otpQuery = _db.Collection(OtpCollection)
            .WhereEqualTo("UserId", user.Id)
            .WhereEqualTo("Purpose", "Register")
            .WhereEqualTo("IsUsed", false)
            .OrderByDescending("CreatedAt")
            .Limit(1);

        var otpSnap = await otpQuery.GetSnapshotAsync();
        if (otpSnap.Count == 0)
            return (false, "Mã OTP không hợp lệ hoặc đã hết hạn.", null);

        var otpDoc = otpSnap.Documents[0];
        var otp = DictToOtp(otpDoc);

        if (otp.Code != code)
            return (false, "Mã OTP không đúng.", null);

        if (otp.ExpiresAt < DateTime.UtcNow)
            return (false, "Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại.", null);

        // Mark OTP as used
        await otpDoc.Reference.UpdateAsync(new Dictionary<string, object>
        {
            ["IsUsed"] = true
        });

        // Activate user
        user.IsEmailVerified = true;
        user.Status = "active";
        user.UpdatedAt = DateTime.UtcNow;

        var userDoc = _db.Collection(UsersCollection).Document(user.Id);
        await userDoc.UpdateAsync(new Dictionary<string, object>
        {
            ["IsEmailVerified"] = true,
            ["Status"] = "active",
            ["UpdatedAt"] = Timestamp.FromDateTime(user.UpdatedAt)
        });

        var token = _jwt.GenerateToken(user);
        _logger.LogInformation("Email verified for: {Email}", email);

        return (true, "Xác thực email thành công!", new AuthResponseDto
        {
            User = MapUserToDto(user),
            Token = token
        });
    }

    // ─── Resend OTP ──────────────────────────────────────────────────────────
    public async Task<(bool Success, string Message)> ResendOtpAsync(string email)
    {
        email = email.ToLowerInvariant().Trim();

        var user = await FindUserByEmailAsync(email);
        if (user is null)
            return (false, "Không tìm thấy tài khoản với email này.");

        if (user.IsEmailVerified)
            return (false, "Email đã được xác thực.");

        // Rate limit: check if last OTP was sent within cooldown
        var lastOtpQuery = _db.Collection(OtpCollection)
            .WhereEqualTo("UserId", user.Id)
            .WhereEqualTo("Purpose", "Register")
            .OrderByDescending("CreatedAt")
            .Limit(1);

        var lastSnap = await lastOtpQuery.GetSnapshotAsync();
        if (lastSnap.Count > 0)
        {
            var lastOtp = DictToOtp(lastSnap.Documents[0]);
            var elapsed = DateTime.UtcNow - lastOtp.CreatedAt;
            if (elapsed.TotalSeconds < OtpResendCooldownSeconds)
            {
                var remaining = (int)(OtpResendCooldownSeconds - elapsed.TotalSeconds);
                return (false, $"Vui lòng chờ {remaining} giây trước khi gửi lại.");
            }

            // Invalidate old OTPs
            await lastSnap.Documents[0].Reference.UpdateAsync(new Dictionary<string, object>
            {
                ["IsUsed"] = true
            });
        }

        await GenerateAndSendOtpAsync(user.Id, email, user.Name, "Register");
        return (true, "Đã gửi lại mã OTP. Vui lòng kiểm tra email.");
    }

    // ─── Login ───────────────────────────────────────────────────────────────
    public async Task<(bool Success, string Message, AuthResponseDto? Result)> LoginAsync(
        string email, string password, string role)
    {
        email = email.ToLowerInvariant().Trim();

        var user = await FindUserByEmailAsync(email);
        if (user is null)
            return (false, "Email hoặc mật khẩu không đúng.", null);

        if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            return (false, "Email hoặc mật khẩu không đúng.", null);

        if (user.Role != role)
            return (false, $"Tài khoản này không phải là {(role == "landlord" ? "Chủ trọ" : "Sinh viên")}.", null);

        if (!user.IsEmailVerified)
            return (false, "EMAIL_NOT_VERIFIED", null);

        if (user.Status == "suspended")
            return (false, "Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ.", null);

        var token = _jwt.GenerateToken(user);
        _logger.LogInformation("User logged in: {Email}", email);

        return (true, "Đăng nhập thành công!", new AuthResponseDto
        {
            User = MapUserToDto(user),
            Token = token
        });
    }

    // ─── Private Helpers ─────────────────────────────────────────────────────

    private async Task<User?> FindUserByEmailAsync(string email)
    {
        var query = _db.Collection(UsersCollection)
            .WhereEqualTo("Email", email)
            .Limit(1);

        var snapshot = await query.GetSnapshotAsync();
        if (snapshot.Count == 0) return null;

        return DictToUser(snapshot.Documents[0]);
    }

    private async Task GenerateAndSendOtpAsync(string userId, string email, string name, string purpose)
    {
        var code = GenerateOtpCode();

        var otp = new OtpCode
        {
            Id = Guid.NewGuid().ToString(),
            UserId = userId,
            Email = email,
            Code = code,
            ExpiresAt = DateTime.UtcNow.AddMinutes(OtpExpiryMinutes),
            IsUsed = false,
            Purpose = purpose,
            CreatedAt = DateTime.UtcNow
        };

        var otpDoc = _db.Collection(OtpCollection).Document(otp.Id);
        await otpDoc.SetAsync(new Dictionary<string, object>
        {
            ["Id"] = otp.Id,
            ["UserId"] = otp.UserId,
            ["Email"] = otp.Email,
            ["Code"] = otp.Code,
            ["ExpiresAt"] = Timestamp.FromDateTime(otp.ExpiresAt),
            ["IsUsed"] = otp.IsUsed,
            ["Purpose"] = otp.Purpose,
            ["CreatedAt"] = Timestamp.FromDateTime(otp.CreatedAt)
        });

        await _email.SendOtpEmailAsync(email, name, code);
    }

    private static string GenerateOtpCode()
    {
        return Random.Shared.Next(100000, 999999).ToString();
    }

    private static UserDto MapUserToDto(User user) => new()
    {
        Email = user.Email,
        Name = user.Name,
        Role = user.Role,
        Status = user.Status,
        Phone = user.Phone,
        Area = user.Area,
        Rooms = user.Rooms,
        Description = user.Description,
        Budget = user.Budget,
        Intro = user.Intro
    };

    private static Dictionary<string, object> UserToDict(User u) => new()
    {
        ["Id"] = u.Id,
        ["Email"] = u.Email,
        ["PasswordHash"] = u.PasswordHash,
        ["Name"] = u.Name,
        ["Role"] = u.Role,
        ["Status"] = u.Status,
        ["IsEmailVerified"] = u.IsEmailVerified,
        ["Phone"] = u.Phone ?? (object)string.Empty,
        ["Area"] = u.Area ?? (object)string.Empty,
        ["Rooms"] = u.Rooms ?? (object)string.Empty,
        ["Description"] = u.Description ?? (object)string.Empty,
        ["Budget"] = u.Budget ?? (object)string.Empty,
        ["Intro"] = u.Intro ?? (object)string.Empty,
        ["CreatedAt"] = Timestamp.FromDateTime(u.CreatedAt),
        ["UpdatedAt"] = Timestamp.FromDateTime(u.UpdatedAt),
    };

    private static User DictToUser(DocumentSnapshot doc)
    {
        return new User
        {
            Id = doc.GetValue<string>("Id"),
            Email = doc.GetValue<string>("Email"),
            PasswordHash = doc.GetValue<string>("PasswordHash"),
            Name = doc.GetValue<string>("Name"),
            Role = doc.GetValue<string>("Role"),
            Status = doc.GetValue<string>("Status"),
            IsEmailVerified = doc.GetValue<bool>("IsEmailVerified"),
            Phone = doc.ContainsField("Phone") ? doc.GetValue<string>("Phone") : null,
            Area = doc.ContainsField("Area") ? doc.GetValue<string>("Area") : null,
            Rooms = doc.ContainsField("Rooms") ? doc.GetValue<string>("Rooms") : null,
            Description = doc.ContainsField("Description") ? doc.GetValue<string>("Description") : null,
            Budget = doc.ContainsField("Budget") ? doc.GetValue<string>("Budget") : null,
            Intro = doc.ContainsField("Intro") ? doc.GetValue<string>("Intro") : null,
            CreatedAt = doc.GetValue<Timestamp>("CreatedAt").ToDateTime(),
            UpdatedAt = doc.GetValue<Timestamp>("UpdatedAt").ToDateTime()
        };
    }

    private static OtpCode DictToOtp(DocumentSnapshot doc)
    {
        return new OtpCode
        {
            Id = doc.GetValue<string>("Id"),
            UserId = doc.GetValue<string>("UserId"),
            Email = doc.GetValue<string>("Email"),
            Code = doc.GetValue<string>("Code"),
            ExpiresAt = doc.GetValue<Timestamp>("ExpiresAt").ToDateTime(),
            IsUsed = doc.GetValue<bool>("IsUsed"),
            Purpose = doc.GetValue<string>("Purpose"),
            CreatedAt = doc.GetValue<Timestamp>("CreatedAt").ToDateTime()
        };
    }
}
