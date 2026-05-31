"""
OCR Router — Trích xuất thông tin từ CCCD Việt Nam
Sử dụng: Tesseract OCR (Nhẹ nhàng, tiết kiệm RAM dưới 512MB)
"""

import re
import io
import base64
import unicodedata
import logging
from typing import Optional

import cv2
import numpy as np
from PIL import Image
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter()

# ─── Model singleton ──────────────────────────────────────────────────────────
_ocr_reader = "Tesseract"


def load_ocr_model():
    """Tesseract không cần tải trước mô hình vào RAM."""
    logger.info("✅ Tesseract OCR đã sẵn sàng (chạy qua CLI).")


# ─── Schemas ──────────────────────────────────────────────────────────────────
class ExtractCccdRequest(BaseModel):
    image_base64: str


class CccdInfo(BaseModel):
    cccd_number: str
    full_name: str
    date_of_birth: Optional[str] = None
    sex: Optional[str] = None
    nationality: Optional[str] = None
    place_of_origin: Optional[str] = None
    place_of_residence: Optional[str] = None
    expiry_date: Optional[str] = None
    face_image_base64: Optional[str] = None


class ExtractCccdResponse(BaseModel):
    success: bool
    data: Optional[CccdInfo] = None
    error: Optional[str] = None
    raw_lines: Optional[list[str]] = None


# ─── Image Preprocessing ──────────────────────────────────────────────────────
def preprocess_for_ocr(img: np.ndarray) -> np.ndarray:
    """Tăng chất lượng ảnh trước khi OCR."""
    h, w = img.shape[:2]

    # Upscale nếu ảnh nhỏ
    if w < 1000:
        scale = 1000 / w
        img = cv2.resize(img, None, fx=scale, fy=scale,
                         interpolation=cv2.INTER_CUBIC)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Denoise (Dùng GaussianBlur siêu nhẹ thay cho fastNlMeansDenoising cực kỳ nặng CPU)
    gray = cv2.GaussianBlur(gray, (3, 3), 0)

    # CLAHE (tăng tương phản)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    gray = clahe.apply(gray)

    # Sharpen
    kernel = np.array([[-1, -1, -1],
                       [-1,  9, -1],
                       [-1, -1, -1]])
    gray = cv2.filter2D(gray, -1, kernel)
    gray = np.clip(gray, 0, 255).astype(np.uint8)

    return cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)


# ─── Helpers ──────────────────────────────────────────────────────────────────
def decode_base64_image(b64_str: str) -> np.ndarray:
    if "," in b64_str:
        b64_str = b64_str.split(",", 1)[1]
    image_bytes = base64.b64decode(b64_str)
    pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)


def encode_image_to_base64(img: np.ndarray) -> str:
    _, buffer = cv2.imencode(".jpg", img)
    return base64.b64encode(buffer).decode("utf-8")


def extract_face_from_cccd(img: np.ndarray) -> Optional[str]:
    """
    Trích xuất ảnh khuôn mặt từ CCCD.
    
    Strategy:
    1. Dùng InsightFace để auto-detect mặt trên toàn bộ ảnh CCCD
    2. Nếu detect được → crop vùng mặt với padding
    3. Nếu không detect → fallback crop vùng cố định (góc phải trên)
    """
    try:
        h, w = img.shape[:2]
        
        # Upscale nếu ảnh quá nhỏ (InsightFace cần ảnh đủ lớn)
        work_img = img
        if w < 800:
            scale = 800 / w
            work_img = cv2.resize(img, None, fx=scale, fy=scale,
                                  interpolation=cv2.INTER_CUBIC)

        # Thử dùng InsightFace để auto-detect mặt
        try:
            import routers.face
            if routers.face._face_app is None:
                routers.face.load_face_model()
            if routers.face._face_app is not None:
                faces = routers.face._face_app.get(work_img)
                if faces:
                    # Lấy mặt lớn nhất
                    face = max(faces, key=lambda f: 
                        (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))
                    x1, y1, x2, y2 = [int(c) for c in face.bbox]
                    img_h, img_w = work_img.shape[:2]
                    # Thêm padding 20% xung quanh mặt
                    pad_w = int((x2 - x1) * 0.2)
                    pad_h = int((y2 - y1) * 0.2)
                    x1 = max(0, x1 - pad_w)
                    y1 = max(0, y1 - pad_h)
                    x2 = min(img_w, x2 + pad_w)  
                    y2 = min(img_h, y2 + pad_h)
                    face_crop = work_img[y1:y2, x1:x2]
                    if face_crop.size > 0:
                        logger.info(f"✅ Auto-detect mặt trên CCCD: bbox=({x1},{y1},{x2},{y2})")
                        return encode_image_to_base64(face_crop)
        except Exception as e:
            logger.warning(f"InsightFace detect trên CCCD thất bại: {e}")

        # Fallback: crop vùng cố định (mặt trước CCCD mới)
        # Thử nhiều vùng khác nhau tùy bố cục CCCD
        crop_regions = [
            # CCCD mới (chip) — mặt bên phải
            (0.08, 0.72, 0.58, 0.82),
            # CCCD mới — mặt bên phải (rộng hơn)
            (0.05, 0.75, 0.55, 0.85),
            # CCCD cũ / CMND — mặt bên trái
            (0.15, 0.70, 0.02, 0.35),
        ]
        
        for (y_start, y_end, x_start, x_end) in crop_regions:
            face_region = img[
                int(h * y_start): int(h * y_end),
                int(w * x_start): int(w * x_end),
            ]
            if face_region.size > 0:
                # Kiểm tra xem vùng crop có chứa mặt không
                try:
                    import routers.face
                    if routers.face._face_app is None:
                        routers.face.load_face_model()
                    if routers.face._face_app is not None:
                        test_faces = routers.face._face_app.get(face_region)
                        if test_faces:
                            logger.info(f"✅ Tìm mặt bằng fallback crop: ({y_start},{y_end},{x_start},{x_end})")
                            return encode_image_to_base64(face_region)
                except Exception:
                    pass

        # Cuối cùng: trả về toàn bộ ảnh CCCD — 
        # để InsightFace tự detect khi so sánh
        logger.warning("⚠️ Không crop được mặt riêng, gửi toàn bộ ảnh CCCD")
        return encode_image_to_base64(work_img)
        
    except Exception as e:
        logger.warning(f"Không thể cắt ảnh mặt từ CCCD: {e}")
        return None


# ─── Label detection ──────────────────────────────────────────────────────────
_LABEL_KEYWORDS = [
    "họ và tên", "full name", "họ tên", "ho va ten", "ho ten",
    "ngày sinh", "date of birth", "giới tính", "sex",
    "quốc tịch", "nationality", "nơi thường trú", "place of residence",
    "quê quán", "place of origin", "có giá trị đến", "date of expiry",
    "căn cước công dân", "citizen identity card", "cộng hòa xã hội",
    "socialist republic", "việt nam", "viet nam", "bộ công an",
    "ministry", "identification", "identity",
]


def _is_label_line(text: str) -> bool:
    """True nếu dòng là label header, không phải tên người."""
    t = text.lower().strip()
    for kw in _LABEL_KEYWORDS:
        if kw in t:
            return True
    if re.fullmatch(r"[\d/\-\.\s]+", t):
        return True
    # Dòng quá ngắn (1 từ duy nhất không phải tên)
    if len(t) < 3:
        return True
    return False


def _strip_label_prefix(text: str) -> str:
    """
    Bỏ phần label ở đầu dòng.
    VD: "Họ và tên / Full name: TRỊNH VIỆT HOÀNG" → "TRỊNH VIỆT HOÀNG"
        "Full Name:" → ""
    """
    patterns = [
        r"(?i)^(?:họ\s*và\s*tên\s*/?\s*full\s*name|họ\s*và\s*tên|full\s*name|họ\s*tên)[:\s/]*(.*)$",
    ]
    for p in patterns:
        m = re.match(p, text.strip())
        if m:
            return m.group(1).strip()
    return text.strip()


def _is_vietnamese_name(text: str) -> bool:
    """
    Kiểm tra xem chuỗi có khả năng là tên người Việt không.
    Tên VN: 2-6 từ, chỉ chữ cái Unicode + khoảng trắng, >= 4 ký tự.
    """
    text = text.strip()
    if not text or len(text) < 4:
        return False
    if re.search(r"\d", text):
        return False
    if len(text) > 50:
        return False
    # Chỉ chứa chữ cái (Latin + Vietnamese) và khoảng trắng
    if re.search(r"[^a-zA-ZÀ-ỹĐđ\s]", text):
        return False
    words = text.split()
    if len(words) < 2 or len(words) > 6:
        return False
    return True


def normalize_name_for_compare(name: str) -> str:
    """Bỏ dấu, lowercase, collapse whitespace — dùng để so sánh tên."""
    nfkd = unicodedata.normalize("NFD", name)
    ascii_str = "".join(c for c in nfkd if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", ascii_str.lower().strip())


# ─── Parsing ──────────────────────────────────────────────────────────────────
def parse_cccd_from_ocr_results(results: list) -> tuple[list[str], CccdInfo]:
    """
    Parse thông tin từ kết quả EasyOCR (có bbox).
    
    Strategy:
    1. Sort theo Y (top→bottom) để đảm bảo đúng thứ tự đọc
    2. Tìm dòng label "Họ và tên" → lấy giá trị cùng dòng hoặc dòng kế
    3. Fallback: quét tất cả dòng tìm chuỗi có dạng tên VN viết hoa
    """
    # Sort theo tọa độ Y trung bình
    def y_center(item):
        return sum(p[1] for p in item[0]) / len(item[0])

    sorted_results = sorted(results, key=y_center)

    lines = []
    for item in sorted_results:
        text = item[1].strip() if len(item) >= 2 else ""
        conf = item[2] if len(item) >= 3 else 0.0
        if text and conf > 0.20:
            lines.append(text)

    full_text = "\n".join(lines)
    logger.info(f"📋 OCR lines (sorted, {len(lines)} dòng): {lines}")

    # ── Số CCCD ───────────────────────────────────────────────────────────────
    cccd_number = ""
    cccd_match = re.search(r"\b(\d{9}|\d{12})\b", full_text)
    if cccd_match:
        cccd_number = cccd_match.group(1)

    # ── Họ và tên ─────────────────────────────────────────────────────────────
    name = ""
    name_label_kw = ["họ và tên", "full name", "ho va ten", "họ tên", "ho ten"]

    # Pass 1: Tìm label "Họ và tên" → lấy giá trị
    for i, line in enumerate(lines):
        line_lower = line.lower()
        if not any(kw in line_lower for kw in name_label_kw):
            continue

        # Case A: tên nằm CÙNG dòng với label
        # VD: "Họ và tên / Full name: TRỊNH VIỆT HOÀNG"
        candidate = _strip_label_prefix(line)
        if candidate and not _is_label_line(candidate) \
                and _is_vietnamese_name(candidate):
            name = candidate
            logger.info(f"✅ Tên (cùng dòng label): '{name}'")
            break

        # Case B: tên nằm ở 1-3 dòng kế tiếp
        for j in range(i + 1, min(i + 4, len(lines))):
            next_line = lines[j].strip()
            if _is_label_line(next_line):
                continue
            next_candidate = _strip_label_prefix(next_line)
            if _is_vietnamese_name(next_candidate):
                name = next_candidate
                logger.info(f"✅ Tên (dòng kế #{j}): '{name}'")
                break
            # Thử ghép 2 dòng (tên dài bị wrap)
            if j + 1 < len(lines) and not _is_label_line(lines[j + 1]):
                merged = next_candidate + " " + lines[j + 1].strip()
                if _is_vietnamese_name(merged):
                    name = merged
                    logger.info(f"✅ Tên (ghép 2 dòng): '{name}'")
                    break
        break  # chỉ tìm label đầu tiên

    # Pass 2 fallback: quét tất cả, tìm dòng ALL CAPS giống tên VN
    if not name:
        for line in lines:
            candidate = _strip_label_prefix(line)
            if _is_label_line(line):
                continue
            # Tên trên CCCD luôn viết HOA
            if candidate.isupper() and _is_vietnamese_name(candidate):
                name = candidate
                logger.info(f"✅ Tên (fallback ALL CAPS): '{name}'")
                break

    # Chuẩn hóa Title Case cho tên
    if name:
        name = name.strip().title()

    # ── Ngày sinh ─────────────────────────────────────────────────────────────
    all_dates = re.findall(r"\b(\d{2}/\d{2}/\d{4})\b", full_text)
    dob = all_dates[0] if all_dates else None

    # ── Giới tính ─────────────────────────────────────────────────────────────
    sex = None
    sex_match = re.search(
        r"(?:giới tính|sex)[:\s/]*(nam|nữ|male|female)",
        full_text, re.IGNORECASE
    )
    if sex_match:
        s = sex_match.group(1).lower()
        sex = "Nam" if s in ("nam", "male") else "Nữ"
    else:
        if re.search(r"(?<!\w)nam(?!\w)", full_text, re.IGNORECASE):
            sex = "Nam"
        elif re.search(r"(?<!\w)nữ(?!\w)", full_text, re.IGNORECASE):
            sex = "Nữ"

    # ── Quốc tịch ─────────────────────────────────────────────────────────────
    nationality = "Việt Nam" if re.search(
        r"vi(ệ|e)t\s*nam", full_text, re.IGNORECASE) else None

    # ── Ngày hết hạn ──────────────────────────────────────────────────────────
    expiry_match = re.search(
        r"(?:có giá trị đến|date of expiry|expiry)[:\s/]*(\d{2}/\d{2}/\d{4})",
        full_text, re.IGNORECASE
    )
    expiry = expiry_match.group(1) if expiry_match else (
        all_dates[-1] if len(all_dates) >= 2 else None)

    info = CccdInfo(
        cccd_number=cccd_number,
        full_name=name,
        date_of_birth=dob,
        sex=sex,
        nationality=nationality,
        expiry_date=expiry,
    )
    return lines, info


# ─── Endpoint ─────────────────────────────────────────────────────────────────
@router.post("/extract-cccd", response_model=ExtractCccdResponse)
async def extract_cccd(request: ExtractCccdRequest):
    """
    Nhận ảnh CCCD (base64) → Preprocess → OCR → trích xuất thông tin + ảnh mặt.
    """
    global _ocr_reader
    if _ocr_reader is None:
        load_ocr_model()
    if _ocr_reader is None:
        raise HTTPException(
            status_code=503,
            detail="Không thể tải mô hình OCR (hết bộ nhớ). Thử lại sau.")

    try:
        img = decode_base64_image(request.image_base64)
    except Exception as e:
        return ExtractCccdResponse(
            success=False, error=f"Ảnh không hợp lệ: {str(e)}")

    try:
        # Tiền xử lý ảnh để tăng độ chính xác
        img_processed = preprocess_for_ocr(img)

        import pytesseract
        # Chạy Tesseract OCR trích xuất văn bản tiếng Việt và tiếng Anh
        text_ocr = pytesseract.image_to_string(img_processed, lang="vie+eng")
        lines_raw = [line.strip() for line in text_ocr.split("\n") if line.strip()]

        if not lines_raw:
            return ExtractCccdResponse(
                success=False,
                error="Không nhận diện được văn bản trong ảnh.")

        # Mock kết quả EasyOCR để tái sử dụng hàm parse_cccd_from_ocr_results
        results = [ ( [ [0,0], [0,0], [0,0], [0,0] ], line, 0.99 ) for line in lines_raw ]
        lines, cccd_info = parse_cccd_from_ocr_results(results)

        if not cccd_info.cccd_number:
            return ExtractCccdResponse(
                success=False,
                error="Không tìm thấy số CCCD/CMND. "
                      "Hãy chụp rõ hơn và đảm bảo ánh sáng đủ.",
                raw_lines=lines,
            )

        if not cccd_info.full_name:
            return ExtractCccdResponse(
                success=False,
                error="Đọc được số CCCD nhưng không trích xuất được họ tên. "
                      "Hãy chụp lại rõ nét, đủ sáng, đặc biệt phần Họ và tên.",
                raw_lines=lines,
            )

        # Cắt ảnh mặt từ ảnh GỐC (không phải ảnh đã preprocess)
        cccd_info.face_image_base64 = extract_face_from_cccd(img)

        return ExtractCccdResponse(
            success=True, data=cccd_info, raw_lines=lines)

    except Exception as e:
        logger.exception("Lỗi khi xử lý OCR CCCD")
        return ExtractCccdResponse(
            success=False, error=f"Lỗi hệ thống: {str(e)}")


@router.post("/extract-cccd-debug")
async def extract_cccd_debug(request: ExtractCccdRequest):
    """
    Debug endpoint: trả về toàn bộ kết quả OCR thô kèm bbox.
    Dùng khi cần xem tại sao parse tên bị sai.
    """
    try:
        img = decode_base64_image(request.image_base64)
        img_processed = preprocess_for_ocr(img)
        import pytesseract
        text_ocr = pytesseract.image_to_string(img_processed, lang="vie+eng")
        lines_raw = [line.strip() for line in text_ocr.split("\n") if line.strip()]
        output = [
            {
                "text": line,
                "confidence": 0.99,
                "bbox_y": float(idx),
            }
            for idx, line in enumerate(lines_raw)
        ]
        output.sort(key=lambda x: x["bbox_y"])
        return {"count": len(output), "items": output}
    except Exception as e:
        return {"error": str(e)}
