# MyRoomie AI Service — Dockerfile (Bust cache to download models)
# Dùng Python 3.11 slim để giảm kích thước image

FROM python:3.11-slim

WORKDIR /app

# Cài các system dependencies cho OpenCV, Tesseract OCR
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libglu1-mesa \
    libgl1 \
    libglx-mesa0 \
    curl \
    tesseract-ocr \
    tesseract-ocr-vie \
    tesseract-ocr-eng \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements trước để tận dụng Docker layer cache
COPY requirements.txt .

# Cài Python packages
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Tải sẵn mô hình AI InsightFace (chỉ nạp các modules cần thiết) để cache vào Docker image
RUN python -c "from insightface.app import FaceAnalysis; app = FaceAnalysis(name='buffalo_l', root='/app/models', allowed_modules=['detection', 'recognition']); app.prepare(ctx_id=-1)"

# Copy source code
COPY . .

# Expose port (Railway sẽ set PORT env var tự động)
EXPOSE 8000

# Chạy app
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
