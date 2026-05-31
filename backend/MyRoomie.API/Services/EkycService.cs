using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Google.Cloud.Firestore;
using MyRoomie.API.DTOs;
using MyRoomie.API.Services.Interfaces;

namespace MyRoomie.API.Services;

public class EkycService : IEkycService
{
    private readonly FirestoreDb       _firestore;
    private readonly HttpClient        _httpClient;
    private readonly ILogger<EkycService> _logger;

    // Firestore collection names
    private const string UsersCollection      = "users";
    private const string VerifiedCccdCollection = "verified_cccd";
    private const string EkycSessionsCollection = "ekyc_sessions";

    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
    };

    public EkycService(
        FirestoreDb firestore,
        IHttpClientFactory httpClientFactory,
        ILogger<EkycService> logger)
    {
        _firestore  = firestore;
        _httpClient = httpClientFactory.CreateClient("AiService");
        _logger     = logger;
        _staticLogger = logger;
    }

    // ─── Scan CCCD ───────────────────────────────────────────────────────────

    public async Task<ScanCccdResponse> ScanCccdAsync(
        string userId, string userName, string imageBase64)
    {
        // 1. Gọi Python AI service để OCR ảnh CCCD
        AiExtractCccdResponse? aiResult;
        try
        {
            var aiPayload = new AiExtractCccdRequest { ImageBase64 = imageBase64 };
            var response  = await _httpClient.PostAsJsonAsync(
                "/ocr/extract-cccd", aiPayload, _jsonOptions);

            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                _logger.LogError("AI service OCR thất bại: {Status} — {Body}", response.StatusCode, body);
                return new ScanCccdResponse
                {
                    Success = false,
                    Error   = "Dịch vụ AI đang bận. Vui lòng thử lại sau."
                };
            }

            aiResult = await response.Content.ReadFromJsonAsync<AiExtractCccdResponse>(_jsonOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi gọi AI service OCR.");
            return new ScanCccdResponse
            {
                Success = false,
                Error   = "Không thể kết nối tới dịch vụ AI. Thử lại sau."
            };
        }

        if (aiResult is null || !aiResult.Success || aiResult.Data is null)
        {
            _logger.LogWarning(
                "AI OCR kết quả không thành công: aiResult={AiResult}, success={Success}, data={Data}, error={Error}",
                aiResult is not null, aiResult?.Success, aiResult?.Data is not null, aiResult?.Error);
            return new ScanCccdResponse { Success = false, Error = aiResult?.Error ?? "Không đọc được thông tin CCCD." };
        }

        var cccdInfo = aiResult.Data;
        _logger.LogInformation(
            "AI OCR thành công: CCCD={CccdNumber}, Name='{FullName}', DOB={DOB}, Sex={Sex}, Face={HasFace}",
            cccdInfo.CccdNumber, cccdInfo.FullName, cccdInfo.DateOfBirth, cccdInfo.Sex,
            !string.IsNullOrEmpty(cccdInfo.FaceImageBase64));

        // 2. Kiểm tra số CCCD đã được dùng bởi tài khoản khác chưa
        var cccdRef = _firestore.Collection(VerifiedCccdCollection).Document(cccdInfo.CccdNumber);
        var cccdDoc = await cccdRef.GetSnapshotAsync();
        if (cccdDoc.Exists)
        {
            var existingUserId = cccdDoc.GetValue<string>("userId");
            if (existingUserId != userId)
            {
                return new ScanCccdResponse
                {
                    Success = false,
                    Error   = "Số CCCD này đã được sử dụng để xác thực cho một tài khoản khác."
                };
            }
        }

        // 3. So sánh họ tên trên CCCD với tên đăng ký tài khoản
        if (!NamesMatch(cccdInfo.FullName, userName))
        {
            _logger.LogWarning("Tên không khớp: CCCD='{CccdName}' | Account='{AccountName}'",
                cccdInfo.FullName, userName);
            return new ScanCccdResponse
            {
                Success = false,
                Error   = $"Họ tên trên CCCD ({cccdInfo.FullName}) không khớp với tên tài khoản ({userName}). " +
                           "Vui lòng dùng CCCD của chính bạn."
            };
        }

        // 4. Lưu session tạm thời vào Firestore (10 phút TTL)
        if (string.IsNullOrEmpty(cccdInfo.FaceImageBase64))
        {
            return new ScanCccdResponse
            {
                Success = false,
                Error   = "Không nhận diện được ảnh mặt trong CCCD. Hãy chụp lại rõ hơn."
            };
        }

        var sessionId  = Guid.NewGuid().ToString("N");
        var sessionRef = _firestore.Collection(EkycSessionsCollection).Document(sessionId);
        await sessionRef.SetAsync(new Dictionary<string, object>
        {
            ["userId"]           = userId,
            ["cccdNumber"]       = cccdInfo.CccdNumber,
            ["fullName"]         = cccdInfo.FullName,
            ["dateOfBirth"]      = cccdInfo.DateOfBirth ?? "",
            ["sex"]              = cccdInfo.Sex ?? "",
            ["nationality"]      = cccdInfo.Nationality ?? "",
            ["placeOfOrigin"]    = cccdInfo.PlaceOfOrigin ?? "",
            ["placeOfResidence"] = cccdInfo.PlaceOfResidence ?? "",
            ["expiryDate"]       = cccdInfo.ExpiryDate ?? "",
            ["faceImageBase64"]  = cccdInfo.FaceImageBase64,
            ["createdAt"]        = Timestamp.FromDateTime(DateTime.UtcNow),
            ["expiresAt"]        = Timestamp.FromDateTime(DateTime.UtcNow.AddMinutes(10)),
        });

        // 5. Trả về thông tin CCCD (không bao gồm ảnh mặt — bảo mật)
        return new ScanCccdResponse
        {
            Success   = true,
            SessionId = sessionId,
            Info      = new CccdInfoDto
            {
                CccdNumber      = cccdInfo.CccdNumber,
                FullName        = cccdInfo.FullName,
                DateOfBirth     = cccdInfo.DateOfBirth,
                Sex             = cccdInfo.Sex,
                Nationality     = cccdInfo.Nationality,
                PlaceOfOrigin   = cccdInfo.PlaceOfOrigin,
                PlaceOfResidence= cccdInfo.PlaceOfResidence,
                ExpiryDate      = cccdInfo.ExpiryDate,
            }
        };
    }

    // ─── Verify Face ─────────────────────────────────────────────────────────

    public async Task<VerifyFaceResponse> VerifyFaceAsync(
        string userId, string sessionId, string selfieBase64)
    {
        // 1. Lấy session từ Firestore
        var sessionRef = _firestore.Collection(EkycSessionsCollection).Document(sessionId);
        var sessionDoc = await sessionRef.GetSnapshotAsync();

        if (!sessionDoc.Exists)
            return new VerifyFaceResponse { Success = false, Error = "Phiên xác thực không tồn tại hoặc đã hết hạn." };

        // Kiểm tra session có thuộc về user này không
        var sessionUserId = sessionDoc.GetValue<string>("userId");
        if (sessionUserId != userId)
            return new VerifyFaceResponse { Success = false, Error = "Phiên xác thực không hợp lệ." };

        // Kiểm tra session còn hạn không
        var expiresAt = sessionDoc.GetValue<Timestamp>("expiresAt").ToDateTime();
        if (DateTime.UtcNow > expiresAt)
        {
            await sessionRef.DeleteAsync();
            return new VerifyFaceResponse { Success = false, Error = "Phiên xác thực đã hết hạn. Vui lòng quét CCCD lại." };
        }

        var cccdFaceBase64 = sessionDoc.GetValue<string>("faceImageBase64");
        var cccdNumber     = sessionDoc.GetValue<string>("cccdNumber");
        var cccdFullName   = sessionDoc.ContainsField("fullName") ? sessionDoc.GetValue<string>("fullName") : "";
        var cccdDob        = sessionDoc.ContainsField("dateOfBirth") ? sessionDoc.GetValue<string>("dateOfBirth") : "";
        var cccdSex        = sessionDoc.ContainsField("sex") ? sessionDoc.GetValue<string>("sex") : "";
        var cccdNationality = sessionDoc.ContainsField("nationality") ? sessionDoc.GetValue<string>("nationality") : "";
        var cccdOrigin     = sessionDoc.ContainsField("placeOfOrigin") ? sessionDoc.GetValue<string>("placeOfOrigin") : "";
        var cccdResidence  = sessionDoc.ContainsField("placeOfResidence") ? sessionDoc.GetValue<string>("placeOfResidence") : "";
        var cccdExpiry     = sessionDoc.ContainsField("expiryDate") ? sessionDoc.GetValue<string>("expiryDate") : "";

        // 2. Gọi Python AI service để so sánh khuôn mặt
        AiCompareFaceResponse? aiResult;
        try
        {
            var aiPayload = new AiCompareFaceRequest
            {
                SelfieBase64   = selfieBase64,
                CccdFaceBase64 = cccdFaceBase64,
            };
            var response = await _httpClient.PostAsJsonAsync(
                "/face/compare", aiPayload, _jsonOptions);

            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                _logger.LogError("AI service face compare thất bại: {Status} — {Body}", response.StatusCode, body);
                return new VerifyFaceResponse { Success = false, Error = "Dịch vụ AI đang bận. Vui lòng thử lại sau." };
            }

            aiResult = await response.Content.ReadFromJsonAsync<AiCompareFaceResponse>(_jsonOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi gọi AI service face compare.");
            return new VerifyFaceResponse { Success = false, Error = "Không thể kết nối tới dịch vụ AI. Thử lại sau." };
        }

        if (aiResult is null || !aiResult.Success)
            return new VerifyFaceResponse { Success = false, Error = aiResult?.Error ?? "So sánh khuôn mặt thất bại." };

        // 3. Nếu match → cập nhật Firestore
        if (aiResult.Match)
        {
            var now = Timestamp.FromDateTime(DateTime.UtcNow);

            // Cập nhật user document — lưu đầy đủ thông tin eKYC + CCCD
            var userRef = _firestore.Collection(UsersCollection).Document(userId);
            await userRef.UpdateAsync(new Dictionary<string, object>
            {
                ["ekycStatus"]          = "verified",
                ["ekycVerifiedAt"]      = now,
                ["ekycSimilarity"]      = aiResult.Similarity,
                ["cccdNumber"]          = cccdNumber,
                ["cccdFullName"]        = cccdFullName,
                ["cccdDateOfBirth"]     = cccdDob,
                ["cccdSex"]             = cccdSex,
                ["cccdNationality"]     = cccdNationality,
                ["cccdPlaceOfOrigin"]   = cccdOrigin,
                ["cccdPlaceOfResidence"]= cccdResidence,
                ["cccdExpiryDate"]      = cccdExpiry,
            });

            // Ghi nhận CCCD đã được dùng (chặn trùng lặp)
            var cccdRef = _firestore.Collection(VerifiedCccdCollection).Document(cccdNumber);
            await cccdRef.SetAsync(new Dictionary<string, object>
            {
                ["userId"]          = userId,
                ["fullName"]        = cccdFullName,
                ["dateOfBirth"]     = cccdDob,
                ["sex"]             = cccdSex,
                ["nationality"]     = cccdNationality,
                ["placeOfOrigin"]   = cccdOrigin,
                ["placeOfResidence"]= cccdResidence,
                ["expiryDate"]      = cccdExpiry,
                ["similarity"]      = aiResult.Similarity,
                ["verifiedAt"]      = now,
            });

            // Xoá session (không cần nữa)
            await sessionRef.DeleteAsync();

            _logger.LogInformation(
                "eKYC thành công cho user {UserId}: CCCD={CccdNumber}, tên={Name}, similarity={Similarity}",
                userId, cccdNumber, cccdFullName, aiResult.Similarity);
        }

        return new VerifyFaceResponse
        {
            Success    = true,
            Match      = aiResult.Match,
            Similarity = aiResult.Similarity,
        };
    }

    // ─── Get Status ──────────────────────────────────────────────────────────

    public async Task<EkycStatusResponse> GetStatusAsync(string userId)
    {
        var userRef = _firestore.Collection(UsersCollection).Document(userId);
        var userDoc = await userRef.GetSnapshotAsync();

        if (!userDoc.Exists)
            return new EkycStatusResponse { Status = "none" };

        var status = userDoc.ContainsField("ekycStatus")
            ? userDoc.GetValue<string>("ekycStatus")
            : "none";

        string? verifiedAt = null;
        if (status == "verified" && userDoc.ContainsField("ekycVerifiedAt"))
        {
            verifiedAt = userDoc.GetValue<Timestamp>("ekycVerifiedAt")
                                .ToDateTime()
                                .ToString("o");
        }

        return new EkycStatusResponse { Status = status, VerifiedAt = verifiedAt };
    }

    // ─── Helper: so sánh tên (linh hoạt để chấp nhận OCR không hoàn hảo) ──────

    private static bool NamesMatch(string cccdName, string accountName)
    {
        // Bước 1: Normalize — bỏ dấu tiếng Việt, lowercase, trim
        var normCccd    = NormalizeName(cccdName);
        var normAccount = NormalizeName(accountName);

        _staticLogger?.LogInformation(
            "NamesMatch: CCCD='{CccdRaw}' → '{CccdNorm}' | Account='{AccRaw}' → '{AccNorm}'",
            cccdName, normCccd, accountName, normAccount);

        // Match chính xác
        if (normCccd == normAccount)
            return true;

        // Bước 2: So sánh theo từng từ (bỏ qua thứ tự)
        // VD: "trinh viet hoang" vs "hoang viet trinh" → match
        var cccdWords    = normCccd.Split(' ', StringSplitOptions.RemoveEmptyEntries).ToHashSet();
        var accountWords = normAccount.Split(' ', StringSplitOptions.RemoveEmptyEntries).ToHashSet();

        if (cccdWords.SetEquals(accountWords))
            return true;

        // Bước 3: Nếu tất cả từ trong tên ngắn hơn đều có mặt trong tên dài hơn
        // VD: OCR đọc "Viet Hoang" (thiếu họ) → vẫn chấp nhận nếu subset
        var shorter = cccdWords.Count <= accountWords.Count ? cccdWords : accountWords;
        var longer  = cccdWords.Count <= accountWords.Count ? accountWords : cccdWords;
        if (shorter.Count >= 2 && shorter.IsSubsetOf(longer))
            return true;

        // Bước 4: Levenshtein similarity >= 70% (OCR đọc sai 1-2 ký tự)
        var similarity = ComputeSimilarity(normCccd, normAccount);
        _staticLogger?.LogInformation("NamesMatch similarity: {Similarity:P0}", similarity);
        return similarity >= 0.70;
    }

    private static string NormalizeName(string s)
    {
        // Bỏ dấu tiếng Việt
        var nfkd = s.ToLowerInvariant().Normalize(NormalizationForm.FormD);
        var sb   = new StringBuilder();
        foreach (var c in nfkd)
        {
            var cat = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c);
            if (cat != System.Globalization.UnicodeCategory.NonSpacingMark)
                sb.Append(c);
        }
        // Collapse whitespace
        return Regex.Replace(sb.ToString().Trim(), @"\s+", " ");
    }

    /// <summary>
    /// Tính độ tương đồng giữa 2 chuỗi (0.0 – 1.0) dựa trên Levenshtein distance.
    /// </summary>
    private static double ComputeSimilarity(string a, string b)
    {
        if (string.IsNullOrEmpty(a) || string.IsNullOrEmpty(b))
            return 0;

        var maxLen = Math.Max(a.Length, b.Length);
        if (maxLen == 0) return 1.0;

        var distance = LevenshteinDistance(a, b);
        return 1.0 - (double)distance / maxLen;
    }

    private static int LevenshteinDistance(string s, string t)
    {
        var n = s.Length;
        var m = t.Length;
        var d = new int[n + 1, m + 1];

        for (var i = 0; i <= n; i++) d[i, 0] = i;
        for (var j = 0; j <= m; j++) d[0, j] = j;

        for (var i = 1; i <= n; i++)
        for (var j = 1; j <= m; j++)
        {
            var cost = s[i - 1] == t[j - 1] ? 0 : 1;
            d[i, j] = Math.Min(
                Math.Min(d[i - 1, j] + 1, d[i, j - 1] + 1),
                d[i - 1, j - 1] + cost);
        }

        return d[n, m];
    }

    // Static logger reference for static methods (set in constructor)
    private static ILogger<EkycService>? _staticLogger;
}

