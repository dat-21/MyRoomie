using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyRoomie.API.DTOs;
using MyRoomie.API.Services.Interfaces;

namespace MyRoomie.API.Controllers;

[ApiController]
[Route("api/ekyc")]
[Authorize]
public class EkycController : ControllerBase
{
    private readonly IEkycService _ekycService;
    private readonly ILogger<EkycController> _logger;

    public EkycController(IEkycService ekycService, ILogger<EkycController> logger)
    {
        _ekycService = ekycService;
        _logger      = logger;
    }

    // ─── Lấy userId từ JWT token ─────────────────────────────────────────────
    private string? GetUserId()   => User.FindFirstValue(ClaimTypes.NameIdentifier)
                                  ?? User.FindFirstValue("sub");
    private string? GetUserName() => User.FindFirstValue(ClaimTypes.Name)
                                  ?? User.FindFirstValue("name");

    // ─── GET /api/ekyc/status ────────────────────────────────────────────────
    /// <summary>Lấy trạng thái eKYC của user hiện tại</summary>
    [HttpGet("status")]
    [ProducesResponseType(typeof(EkycStatusResponse), 200)]
    public async Task<IActionResult> GetStatus()
    {
        var userId = GetUserId();
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        var result = await _ekycService.GetStatusAsync(userId);
        return Ok(result);
    }

    // ─── POST /api/ekyc/scan-cccd ────────────────────────────────────────────
    /// <summary>
    /// Bước 1: Quét CCCD — trích xuất thông tin, kiểm tra trùng lặp, khớp tên.
    /// </summary>
    [HttpPost("scan-cccd")]
    [ProducesResponseType(typeof(ScanCccdResponse), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> ScanCccd([FromBody] ScanCccdRequest request)
    {
        var userId   = GetUserId();
        var userName = GetUserName();

        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(userName))
            return Unauthorized(new { message = "Token không hợp lệ." });

        if (string.IsNullOrWhiteSpace(request.ImageBase64))
            return BadRequest(new { message = "Vui lòng cung cấp ảnh CCCD." });

        _logger.LogInformation("eKYC scan CCCD cho user {UserId}", userId);
        var result = await _ekycService.ScanCccdAsync(userId, userName, request.ImageBase64);

        if (!result.Success)
            return BadRequest(new { message = result.Error });

        return Ok(result);
    }

    // ─── POST /api/ekyc/verify-face ──────────────────────────────────────────
    /// <summary>
    /// Bước 2: Xác thực khuôn mặt — so sánh selfie với ảnh mặt trong CCCD.
    /// </summary>
    [HttpPost("verify-face")]
    [ProducesResponseType(typeof(VerifyFaceResponse), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> VerifyFace([FromBody] VerifyFaceRequest request)
    {
        var userId = GetUserId();
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        if (string.IsNullOrWhiteSpace(request.SelfieBase64))
            return BadRequest(new { message = "Vui lòng cung cấp ảnh selfie." });

        if (string.IsNullOrWhiteSpace(request.SessionId))
            return BadRequest(new { message = "SessionId không hợp lệ." });

        _logger.LogInformation("eKYC verify face cho user {UserId}, session {SessionId}",
            userId, request.SessionId);

        var result = await _ekycService.VerifyFaceAsync(userId, request.SessionId, request.SelfieBase64);

        if (!result.Success)
            return BadRequest(new { message = result.Error });

        return Ok(result);
    }
}
