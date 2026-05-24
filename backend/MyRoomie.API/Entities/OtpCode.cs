namespace MyRoomie.API.Entities;

public class OtpCode
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string UserId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty; // 6-digit numeric
    public DateTime ExpiresAt { get; set; }
    public bool IsUsed { get; set; } = false;
    public string Purpose { get; set; } = "Register"; // Register | ResetPassword
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
