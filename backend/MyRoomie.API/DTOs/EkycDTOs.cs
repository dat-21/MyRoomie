namespace MyRoomie.API.DTOs;

// ─── Scan CCCD ────────────────────────────────────────────────────────────────

public class ScanCccdRequest
{
    /// <summary>Ảnh CCCD dạng base64 (data URI hoặc raw base64)</summary>
    public string ImageBase64 { get; set; } = "";
}

public class CccdInfoDto
{
    public string CccdNumber { get; set; } = "";
    public string FullName   { get; set; } = "";
    public string? DateOfBirth { get; set; }
    public string? Sex         { get; set; }
    public string? Nationality { get; set; }
    public string? PlaceOfOrigin    { get; set; }
    public string? PlaceOfResidence { get; set; }
    public string? ExpiryDate       { get; set; }
    /// <summary>Ảnh mặt cắt từ CCCD (base64) — dùng nội bộ, không trả về FE</summary>
    public string? FaceImageBase64  { get; set; }
}

public class ScanCccdResponse
{
    public bool      Success { get; set; }
    public string?   SessionId { get; set; }   // ID phiên eKYC để dùng ở bước tiếp theo
    public CccdInfoDto? Info  { get; set; }    // Thông tin CCCD (không có face image)
    public string?   Error   { get; set; }
}

// ─── Verify Face ──────────────────────────────────────────────────────────────

public class VerifyFaceRequest
{
    /// <summary>Ảnh selfie chụp trực tiếp từ camera (base64)</summary>
    public string SelfieBase64 { get; set; } = "";
    /// <summary>SessionId trả về từ bước scan-cccd</summary>
    public string SessionId    { get; set; } = "";
}

public class VerifyFaceResponse
{
    public bool    Success    { get; set; }
    public bool    Match      { get; set; }
    public double  Similarity { get; set; }
    public string? Error      { get; set; }
}

// ─── Status ───────────────────────────────────────────────────────────────────

public class EkycStatusResponse
{
    public string Status { get; set; } = "none"; // none | pending | verified | rejected
    public string? VerifiedAt { get; set; }
}

// ─── Internal Python AI Service payloads ─────────────────────────────────────

internal class AiExtractCccdRequest
{
    public string ImageBase64 { get; set; } = "";
}

internal class AiCccdInfo
{
    public string  CccdNumber      { get; set; } = "";
    public string  FullName        { get; set; } = "";
    public string? DateOfBirth     { get; set; }
    public string? Sex             { get; set; }
    public string? Nationality     { get; set; }
    public string? PlaceOfOrigin   { get; set; }
    public string? PlaceOfResidence{ get; set; }
    public string? ExpiryDate      { get; set; }
    public string? FaceImageBase64 { get; set; }
}

internal class AiExtractCccdResponse
{
    public bool        Success { get; set; }
    public AiCccdInfo? Data    { get; set; }
    public string?     Error   { get; set; }
}

internal class AiCompareFaceRequest
{
    public string SelfieBase64   { get; set; } = "";
    public string CccdFaceBase64 { get; set; } = "";
}

internal class AiCompareFaceResponse
{
    public bool   Success    { get; set; }
    public bool   Match      { get; set; }
    public double Similarity { get; set; }
    public string? Error     { get; set; }
}

// ─── Firestore session document ───────────────────────────────────────────────

internal class EkycSession
{
    public string UserId         { get; set; } = "";
    public string CccdNumber     { get; set; } = "";
    public string FullName       { get; set; } = "";
    public string FaceImageBase64{ get; set; } = "";
    public DateTime CreatedAt    { get; set; } = DateTime.UtcNow;
    /// <summary>Session hết hạn sau 10 phút</summary>
    public DateTime ExpiresAt    { get; set; } = DateTime.UtcNow.AddMinutes(10);
}
