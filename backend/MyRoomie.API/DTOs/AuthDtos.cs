using System.ComponentModel.DataAnnotations;

namespace MyRoomie.API.DTOs;

public class RegisterRequestDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = "tenant"; // landlord | tenant

    public string? Phone { get; set; }
    public string? Area { get; set; }
    public string? Rooms { get; set; }
    public string? Description { get; set; }
    public string? Budget { get; set; }
    public string? Intro { get; set; }
}

public class LoginRequestDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = "tenant";
}

public class VerifyOtpRequestDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, StringLength(6, MinimumLength = 6)]
    public string Code { get; set; } = string.Empty;
}

public class ResendOtpRequestDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
}

public class UserDto
{
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Area { get; set; }
    public string? Rooms { get; set; }
    public string? Description { get; set; }
    public string? Budget { get; set; }
    public string? Intro { get; set; }
}

public class AuthResponseDto
{
    public UserDto User { get; set; } = new();
    public string Token { get; set; } = string.Empty;
}

public class RegisterResponseDto
{
    public string Message { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    /// <summary>Số giây còn lại trước khi có thể gửi lại OTP</summary>
    public int ResendCooldownSeconds { get; set; } = 60;
}

public class ApiErrorDto
{
    public string Message { get; set; } = string.Empty;
    public string? Code { get; set; }
}
