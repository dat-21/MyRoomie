"""
Face Router — So sánh khuôn mặt eKYC
Sử dụng InsightFace (buffalo_l model) để:
- Trích xuất face embedding từ ảnh selfie
- Trích xuất face embedding từ ảnh mặt trong CCCD
- Tính cosine similarity → xác định có phải cùng 1 người không
"""

import io
import base64
import logging
from typing import Optional

import cv2
import numpy as np
from PIL import Image
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter()

# ─── Threshold ────────────────────────────────────────────────────────────────
SIMILARITY_THRESHOLD = 0.4  # Ngưỡng InsightFace (buffalo_l): >= 0.4 là cùng người

# ─── Model singleton ──────────────────────────────────────────────────────────
_face_app = None


def load_face_model():
    """Load InsightFace model (gọi 1 lần khi startup)."""
    global _face_app
    if _face_app is None:
        try:
            from insightface.app import FaceAnalysis
            _face_app = FaceAnalysis(
                name="buffalo_l",
                providers=["CPUExecutionProvider"],
            )
            _face_app.prepare(ctx_id=-1, det_size=(640, 640))
            logger.info("✅ InsightFace (buffalo_l) model đã load xong.")
        except Exception as e:
            logger.error(f"❌ Không thể load InsightFace: {e}")
            _face_app = None


# ─── Schemas ──────────────────────────────────────────────────────────────────
class CompareFaceRequest(BaseModel):
    selfie_base64: str       # Ảnh selfie chụp trực tiếp (base64)
    cccd_face_base64: str    # Ảnh mặt cắt từ CCCD (base64)


class CompareFaceResponse(BaseModel):
    success: bool
    match: bool = False
    similarity: float = 0.0
    error: Optional[str] = None


# ─── Helpers ──────────────────────────────────────────────────────────────────
def decode_base64_image(b64_str: str) -> np.ndarray:
    """Giải mã base64 → numpy array (BGR cho OpenCV)."""
    if "," in b64_str:
        b64_str = b64_str.split(",", 1)[1]
    image_bytes = base64.b64decode(b64_str)
    pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)


def get_face_embedding(img: np.ndarray) -> Optional[np.ndarray]:
    """
    Phát hiện khuôn mặt trong ảnh và trả về embedding vector.
    Trả về None nếu không tìm thấy mặt hoặc tìm thấy > 1 mặt.
    """
    if _face_app is None:
        raise RuntimeError("InsightFace model chưa được load.")
    
    faces = _face_app.get(img)
    
    if not faces:
        return None
    
    # Lấy mặt có diện tích bounding box lớn nhất (mặt chính)
    main_face = max(faces, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))
    return main_face.normed_embedding


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Tính cosine similarity giữa 2 vector embedding."""
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


# ─── Endpoint ─────────────────────────────────────────────────────────────────
@router.post("/compare", response_model=CompareFaceResponse)
async def compare_faces(request: CompareFaceRequest):
    """
    So sánh khuôn mặt selfie với ảnh mặt trong CCCD.
    Trả về similarity score và kết quả match.
    """
    if _face_app is None:
        raise HTTPException(status_code=503, detail="Face model chưa được load. Thử lại sau.")

    # Decode ảnh selfie
    try:
        selfie_img = decode_base64_image(request.selfie_base64)
    except Exception as e:
        return CompareFaceResponse(success=False, error=f"Ảnh selfie không hợp lệ: {str(e)}")

    # Decode ảnh mặt CCCD
    try:
        cccd_img = decode_base64_image(request.cccd_face_base64)
    except Exception as e:
        return CompareFaceResponse(success=False, error=f"Ảnh CCCD không hợp lệ: {str(e)}")

    try:
        # Lấy embedding từ selfie
        selfie_emb = get_face_embedding(selfie_img)
        if selfie_emb is None:
            return CompareFaceResponse(
                success=False,
                error="Không tìm thấy khuôn mặt trong ảnh selfie. Hãy chụp lại với ánh sáng tốt hơn."
            )

        # Lấy embedding từ ảnh CCCD
        cccd_emb = get_face_embedding(cccd_img)
        if cccd_emb is None:
            return CompareFaceResponse(
                success=False,
                error="Không tìm thấy khuôn mặt trong ảnh CCCD. Vui lòng quét lại CCCD."
            )

        # Tính cosine similarity
        similarity = cosine_similarity(selfie_emb, cccd_emb)
        match = similarity >= SIMILARITY_THRESHOLD

        logger.info(f"Face comparison: similarity={similarity:.4f}, match={match}, threshold={SIMILARITY_THRESHOLD}")

        return CompareFaceResponse(
            success=True,
            match=match,
            similarity=round(similarity, 4),
        )

    except Exception as e:
        logger.exception("Lỗi khi so sánh khuôn mặt")
        return CompareFaceResponse(success=False, error=f"Lỗi hệ thống: {str(e)}")
