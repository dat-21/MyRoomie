import { apiRequest } from "./api";
import type {
  EkycStatusResponse,
  ScanCccdResponse,
  VerifyFaceResponse,
} from "../types";

const BASE = "/api/ekyc";

/**
 * Lấy trạng thái eKYC của user hiện tại.
 */
export async function getEkycStatus(): Promise<EkycStatusResponse> {
  return apiRequest<EkycStatusResponse>(`${BASE}/status`, { method: "GET" });
}

/**
 * Bước 1: Gửi ảnh CCCD để OCR và kiểm tra.
 * @param imageBase64 - Ảnh CCCD dạng base64 (có thể là data URI)
 */
export async function scanCccd(imageBase64: string): Promise<ScanCccdResponse> {
  return apiRequest<ScanCccdResponse>(`${BASE}/scan-cccd`, {
    method: "POST",
    body: { imageBase64 },
  });
}

/**
 * Bước 2: Gửi ảnh selfie để so sánh với ảnh mặt trong CCCD.
 * @param selfieBase64 - Ảnh selfie từ camera (base64)
 * @param sessionId   - SessionId từ bước scan-cccd
 */
export async function verifyFace(
  selfieBase64: string,
  sessionId: string
): Promise<VerifyFaceResponse> {
  return apiRequest<VerifyFaceResponse>(`${BASE}/verify-face`, {
    method: "POST",
    body: { selfieBase64, sessionId },
  });
}
