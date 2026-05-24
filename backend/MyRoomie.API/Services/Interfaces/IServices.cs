using MyRoomie.API.Entities;

namespace MyRoomie.API.Services.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}

public interface IEmailService
{
    Task SendOtpEmailAsync(string toEmail, string toName, string otpCode);
}

public interface IAuthService
{
    /// <summary>Đăng ký user mới, gửi OTP xác thực email.</summary>
    Task<(bool Success, string Message)> RegisterAsync(
        string email, string password, string name, string role,
        string? phone, string? area, string? rooms,
        string? description, string? budget, string? intro);

    /// <summary>Xác thực OTP → trả JWT nếu thành công.</summary>
    Task<(bool Success, string Message, DTOs.AuthResponseDto? Result)> VerifyOtpAsync(
        string email, string code);

    /// <summary>Gửi lại OTP (rate limit 60s).</summary>
    Task<(bool Success, string Message)> ResendOtpAsync(string email);

    /// <summary>Đăng nhập → trả JWT.</summary>
    Task<(bool Success, string Message, DTOs.AuthResponseDto? Result)> LoginAsync(
        string email, string password, string role);
}
