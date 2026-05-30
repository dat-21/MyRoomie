using MyRoomie.API.DTOs;

namespace MyRoomie.API.Services.Interfaces;

public interface IEkycService
{
    /// <summary>
    /// Bước 1: Quét CCCD — OCR trích xuất thông tin, kiểm tra trùng lặp, khớp tên.
    /// </summary>
    Task<ScanCccdResponse> ScanCccdAsync(string userId, string userName, string imageBase64);

    /// <summary>
    /// Bước 2: So sánh khuôn mặt selfie với ảnh mặt trong CCCD.
    /// Nếu khớp → cập nhật trạng thái eKYC trên Firestore.
    /// </summary>
    Task<VerifyFaceResponse> VerifyFaceAsync(string userId, string sessionId, string selfieBase64);

    /// <summary>
    /// Lấy trạng thái eKYC hiện tại của user.
    /// </summary>
    Task<EkycStatusResponse> GetStatusAsync(string userId);
}
