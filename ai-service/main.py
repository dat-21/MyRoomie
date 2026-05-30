"""
MyRoomie AI Service
FastAPI microservice xử lý:
- OCR trích xuất thông tin CCCD (PaddleOCR + VietOCR)
- So sánh khuôn mặt (InsightFace)
"""

import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ocr, face

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ─── Lifespan (startup/shutdown) ──────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Đang khởi động AI Service...")
    # Load models khi startup để tránh cold start mỗi request
    from routers.face import load_face_model
    from routers.ocr import load_ocr_model
    load_face_model()
    load_ocr_model()
    logger.info("✅ AI Service đã sẵn sàng!")
    yield
    logger.info("🛑 AI Service đang tắt...")

# ─── App ────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="MyRoomie AI Service",
    description="Microservice xử lý OCR CCCD và so sánh khuôn mặt cho eKYC",
    version="1.0.0",
    lifespan=lifespan,
)

# ─── CORS ───────────────────────────────────────────────────────────────────
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5021").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ────────────────────────────────────────────────────────────────
app.include_router(ocr.router, prefix="/ocr", tags=["OCR"])
app.include_router(face.router, prefix="/face", tags=["Face"])

# ─── Health check ───────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "service": "MyRoomie AI Service"}

@app.get("/")
async def root():
    return {"message": "MyRoomie AI Service is running", "docs": "/docs"}
