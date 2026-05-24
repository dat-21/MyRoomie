namespace MyRoomie.API.Entities;

public class User
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = "tenant"; // landlord | tenant | admin
    public string Status { get; set; } = "pending"; // active | pending | suspended
    public bool IsEmailVerified { get; set; } = false;

    // Common profile fields
    public string? Phone { get; set; }
    public string? Avatar { get; set; }

    // Landlord-specific fields
    public string? Area { get; set; }
    public string? Rooms { get; set; }
    public string? Description { get; set; }

    // Tenant-specific fields
    public string? Budget { get; set; }
    public string? Intro { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
