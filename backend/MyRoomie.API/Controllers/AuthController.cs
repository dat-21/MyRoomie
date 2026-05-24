using Microsoft.AspNetCore.Mvc;
using MyRoomie.API.DTOs;
using MyRoomie.API.Services.Interfaces;

namespace MyRoomie.API.Controllers;

[ApiController]
[Route("api/auth")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService auth, ILogger<AuthController> logger)
    {
        _auth = auth;
        _logger = logger;
    }

    /// <summary>Đăng ký tài khoản mới. Gửi OTP xác thực email.</summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(RegisterResponseDto), 200)]
    [ProducesResponseType(typeof(ApiErrorDto), 400)]
    [ProducesResponseType(typeof(ApiErrorDto), 409)]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new ApiErrorDto { Message = "Dữ liệu không hợp lệ.", Code = "VALIDATION_ERROR" });

        var (success, message) = await _auth.RegisterAsync(
            dto.Email, dto.Password, dto.Name, dto.Role,
            dto.Phone, dto.Area, dto.Rooms, dto.Description, dto.Budget, dto.Intro);

        if (!success)
        {
            if (message == "EMAIL_PENDING_VERIFICATION")
                return Conflict(new ApiErrorDto
                {
                    Message = "Email này đã đăng ký nhưng chưa xác thực. Vui lòng kiểm tra hộp thư.",
                    Code = "EMAIL_PENDING_VERIFICATION"
                });

            return Conflict(new ApiErrorDto { Message = message, Code = "EMAIL_TAKEN" });
        }

        return Ok(new RegisterResponseDto
        {
            Message = message,
            Email = dto.Email,
            ResendCooldownSeconds = 60
        });
    }

    /// <summary>Xác thực mã OTP gửi về email. Trả JWT token nếu thành công.</summary>
    [HttpPost("verify-otp")]
    [ProducesResponseType(typeof(AuthResponseDto), 200)]
    [ProducesResponseType(typeof(ApiErrorDto), 400)]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequestDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new ApiErrorDto { Message = "Dữ liệu không hợp lệ." });

        var (success, message, result) = await _auth.VerifyOtpAsync(dto.Email, dto.Code);

        if (!success)
            return BadRequest(new ApiErrorDto { Message = message, Code = "OTP_INVALID" });

        return Ok(result);
    }

    /// <summary>Gửi lại OTP (rate limit: 60 giây/lần).</summary>
    [HttpPost("resend-otp")]
    [ProducesResponseType(200)]
    [ProducesResponseType(typeof(ApiErrorDto), 400)]
    [ProducesResponseType(typeof(ApiErrorDto), 429)]
    public async Task<IActionResult> ResendOtp([FromBody] ResendOtpRequestDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new ApiErrorDto { Message = "Email không hợp lệ." });

        var (success, message) = await _auth.ResendOtpAsync(dto.Email);

        if (!success)
        {
            if (message.Contains("chờ"))
                return StatusCode(429, new ApiErrorDto { Message = message, Code = "RATE_LIMITED" });

            return BadRequest(new ApiErrorDto { Message = message, Code = "RESEND_FAILED" });
        }

        return Ok(new { message });
    }

    /// <summary>Đăng nhập. Trả JWT token nếu thành công.</summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), 200)]
    [ProducesResponseType(typeof(ApiErrorDto), 400)]
    [ProducesResponseType(typeof(ApiErrorDto), 401)]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new ApiErrorDto { Message = "Dữ liệu không hợp lệ." });

        var (success, message, result) = await _auth.LoginAsync(dto.Email, dto.Password, dto.Role);

        if (!success)
        {
            if (message == "EMAIL_NOT_VERIFIED")
                return Unauthorized(new ApiErrorDto
                {
                    Message = "Email chưa được xác thực. Vui lòng kiểm tra hộp thư.",
                    Code = "EMAIL_NOT_VERIFIED"
                });

            return Unauthorized(new ApiErrorDto { Message = message, Code = "LOGIN_FAILED" });
        }

        return Ok(result);
    }
}
