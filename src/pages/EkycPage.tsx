/**
 * EkycPage — Trang xác thực danh tính điện tử (eKYC) gồm 3 bước:
 * 1. Quét CCCD (upload hoặc chụp camera) → OCR → xác nhận thông tin
 * 2. Chụp ảnh selfie (camera trước) → chụp 1 lần duy nhất
 * 3. So sánh khuôn mặt (InsightFace qua backend) → kết quả
 */

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck, Upload, Camera, Check, ChevronRight,
    RefreshCw, AlertCircle, Loader2, CreditCard, Smile, Award
} from "lucide-react";
import { scanCccd, verifyFace } from "../services/ekyc.service";
import type { CccdInfo, EkycStep } from "../types";

// ─── Component ────────────────────────────────────────────────────────────────
export default function EkycPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState<EkycStep>("cccd");

    // ── Step 1: CCCD ──
    const [cccdImage, setCccdImage]         = useState<string | null>(null);
    const [cccdPreview, setCccdPreview]     = useState<string | null>(null);
    const [cccdInfo, setCccdInfo]           = useState<CccdInfo | null>(null);
    const [sessionId, setSessionId]         = useState<string | null>(null);
    const [cccdLoading, setCccdLoading]     = useState(false);
    const [cccdError, setCccdError]         = useState<string | null>(null);
    const [useCamera, setUseCamera]         = useState(false);
    const cccdFileRef   = useRef<HTMLInputElement>(null);
    const cccdVideoRef  = useRef<HTMLVideoElement>(null);
    const cccdStreamRef = useRef<MediaStream | null>(null);

    // ── Step 2: Selfie ──
    const [selfieCapture, setSelfieCapture] = useState<string | null>(null);
    const [selfieError, setSelfieError]     = useState<string | null>(null);
    const [cameraReady, setCameraReady]     = useState(false);
    const selfieVideoRef  = useRef<HTMLVideoElement>(null);
    const selfieStreamRef = useRef<MediaStream | null>(null);

    // ── Step 3: Result ──
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [verifyMatch, setVerifyMatch]     = useState<boolean | null>(null);
    const [verifySimilarity, setVerifySimilarity] = useState(0);
    const [verifyError, setVerifyError]     = useState<string | null>(null);

    // Tự động verify khi chụp selfie xong và chuyển sang bước result
    useEffect(() => {
        if (selfieCapture && sessionId && step === "result") {
            handleVerifyFace();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selfieCapture, step]);

    // Cleanup camera streams khi unmount
    useEffect(() => {
        return () => {
            stopCccdCamera();
            stopSelfieCamera();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ─── CCCD Camera helpers ──────────────────────────────────────────────────
    const startCccdCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment", width: 1280, height: 720 }
            });
            cccdStreamRef.current = stream;
            if (cccdVideoRef.current) {
                cccdVideoRef.current.srcObject = stream;
            }
            setUseCamera(true);
        } catch {
            setCccdError("Không thể truy cập camera. Vui lòng dùng chức năng tải ảnh lên.");
        }
    };

    const stopCccdCamera = () => {
        cccdStreamRef.current?.getTracks().forEach(t => t.stop());
        cccdStreamRef.current = null;
    };

    const captureCccdFromCamera = () => {
        if (!cccdVideoRef.current) return;
        const canvas = document.createElement("canvas");
        canvas.width  = cccdVideoRef.current.videoWidth;
        canvas.height = cccdVideoRef.current.videoHeight;
        canvas.getContext("2d")!.drawImage(cccdVideoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        setCccdPreview(dataUrl);
        setCccdImage(dataUrl);
        stopCccdCamera();
        setUseCamera(false);
    };

    // ─── CCCD upload ─────────────────────────────────────────────────────────
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const dataUrl = ev.target?.result as string;
            setCccdPreview(dataUrl);
            setCccdImage(dataUrl);
        };
        reader.readAsDataURL(file);
    };

    // ─── CCCD scan ───────────────────────────────────────────────────────────
    const handleScanCccd = async () => {
        if (!cccdImage) return;
        setCccdLoading(true);
        setCccdError(null);
        try {
            const result = await scanCccd(cccdImage);
            if (!result.success || !result.info || !result.sessionId) {
                setCccdError(result.error ?? "Không đọc được CCCD. Hãy chụp lại rõ hơn.");
                return;
            }
            setCccdInfo(result.info);
            setSessionId(result.sessionId);
        } catch (err: any) {
            setCccdError(err?.message ?? "Lỗi kết nối. Thử lại sau.");
        } finally {
            setCccdLoading(false);
        }
    };

    // ─── Go to selfie step ───────────────────────────────────────────────────
    const goToSelfie = () => {
        setStep("liveness"); // reuse step name for routing
        startSelfieCamera();
    };

    // ─── Selfie Camera ──────────────────────────────────────────────────────
    const startSelfieCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: 640, height: 480 }
            });
            selfieStreamRef.current = stream;
            if (selfieVideoRef.current) {
                selfieVideoRef.current.srcObject = stream;
                await selfieVideoRef.current.play();
            }
            setCameraReady(true);
        } catch {
            setSelfieError("Không thể truy cập camera trước. Vui lòng cấp quyền camera.");
        }
    };

    const stopSelfieCamera = () => {
        selfieStreamRef.current?.getTracks().forEach(t => t.stop());
        selfieStreamRef.current = null;
        setCameraReady(false);
    };

    const captureSelfie = () => {
        if (!selfieVideoRef.current) return;
        const canvas = document.createElement("canvas");
        canvas.width  = selfieVideoRef.current.videoWidth;
        canvas.height = selfieVideoRef.current.videoHeight;
        canvas.getContext("2d")!.drawImage(selfieVideoRef.current, 0, 0);
        const selfie = canvas.toDataURL("image/jpeg", 0.92);
        setSelfieCapture(selfie);
        stopSelfieCamera();
        setStep("result");
    };

    // ─── Verify face ─────────────────────────────────────────────────────────
    const handleVerifyFace = async () => {
        if (!selfieCapture || !sessionId) return;
        setVerifyLoading(true);
        setVerifyError(null);
        try {
            const result = await verifyFace(selfieCapture, sessionId);
            setVerifyMatch(result.match);
            setVerifySimilarity(result.similarity);
            if (!result.match) {
                setVerifyError(result.error ?? "Khuôn mặt không khớp với CCCD.");
            }
        } catch (err: any) {
            setVerifyError(err?.message ?? "Lỗi kết nối. Thử lại sau.");
        } finally {
            setVerifyLoading(false);
        }
    };

    // ─── Reset selfie ────────────────────────────────────────────────────────
    const resetSelfie = () => {
        setSelfieCapture(null);
        setSelfieError(null);
        setVerifyMatch(null);
        setVerifyError(null);
        setStep("liveness");
        startSelfieCamera();
    };

    // ─── Step indicator ───────────────────────────────────────────────────────
    const STEPS = [
        { id: "cccd",     icon: CreditCard, label: "Quét CCCD" },
        { id: "liveness", icon: Smile,      label: "Chụp Selfie" },
        { id: "result",   icon: Award,      label: "Kết quả"   },
    ] as const;

    const stepIndex = STEPS.findIndex(s => s.id === step);

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-24 pb-16 px-4">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3">
                        <ShieldCheck size={14} />
                        eKYC — Xác thực danh tính
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 font-[family-name:var(--font-family-heading)]">
                        Xác minh <span className="text-primary">chủ trọ</span>
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">Quy trình 3 bước đơn giản, chỉ mất khoảng 2 phút</p>
                </motion.div>

                {/* Step bar */}
                <div className="flex items-center justify-center gap-0 mb-10">
                    {STEPS.map((s, i) => {
                        const Icon = s.icon;
                        const done   = i < stepIndex;
                        const active = i === stepIndex;
                        return (
                            <div key={s.id} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                                        done   ? "bg-emerald-500 border-emerald-500 text-white"
                                        : active ? "bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-110"
                                        :          "bg-white border-gray-200 text-gray-400"
                                    }`}>
                                        {done ? <Check size={22} className="stroke-[3px]" /> : <Icon size={20} />}
                                    </div>
                                    <span className={`mt-2 text-xs font-semibold ${active ? "text-primary" : done ? "text-emerald-600" : "text-gray-400"}`}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`w-16 h-0.5 mx-1 mb-5 transition-colors ${done ? "bg-emerald-400" : "bg-gray-200"}`} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Step content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                        {/* ═══════════════ STEP 1: CCCD ═══════════════ */}
                        {step === "cccd" && (
                            <div className="p-8 space-y-6">
                                <div className="border-b border-gray-100 pb-4">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <CreditCard size={22} className="text-primary" />
                                        Bước 1: Quét Căn Cước Công Dân
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Chụp hoặc tải lên ảnh mặt trước của CCCD. Đảm bảo ảnh rõ nét, đủ sáng.
                                    </p>
                                </div>

                                {/* Chưa có ảnh → upload / camera options */}
                                {!cccdPreview && !useCamera && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => cccdFileRef.current?.click()}
                                            className="group flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                                        >
                                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                <Upload size={26} className="text-primary" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold text-gray-800 text-sm">Tải ảnh lên</p>
                                                <p className="text-xs text-gray-500 mt-0.5">JPG, PNG tối đa 10MB</p>
                                            </div>
                                        </button>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={cccdFileRef}
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />

                                        <button
                                            onClick={startCccdCamera}
                                            className="group flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer"
                                        >
                                            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                                                <Camera size={26} className="text-indigo-600" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold text-gray-800 text-sm">Chụp camera</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Camera thiết bị</p>
                                            </div>
                                        </button>
                                    </div>
                                )}

                                {/* Camera view để chụp CCCD */}
                                {useCamera && (
                                    <div className="space-y-4">
                                        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
                                            <video
                                                ref={cccdVideoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className="w-full h-full object-cover"
                                            />
                                            {/* ID card frame guide */}
                                            <div className="absolute inset-6 border-2 border-white/60 rounded-xl pointer-events-none">
                                                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg" />
                                                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg" />
                                                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg" />
                                                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg" />
                                            </div>
                                            <p className="absolute bottom-3 left-0 right-0 text-center text-white text-xs font-semibold drop-shadow">
                                                Căn CCCD vào khung — đảm bảo đủ sáng
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => { stopCccdCamera(); setUseCamera(false); }}
                                                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 cursor-pointer"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                onClick={captureCccdFromCamera}
                                                className="flex-[2] py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 cursor-pointer flex items-center justify-center gap-2"
                                            >
                                                <Camera size={16} />
                                                Chụp ngay
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Preview ảnh đã chọn */}
                                {cccdPreview && (
                                    <div className="space-y-4">
                                        <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                                            <img src={cccdPreview} alt="CCCD preview" className="w-full h-auto object-contain max-h-64" />
                                            <button
                                                onClick={() => { setCccdPreview(null); setCccdImage(null); setCccdInfo(null); setCccdError(null); }}
                                                className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full shadow text-gray-600 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                                            >
                                                <RefreshCw size={16} />
                                            </button>
                                        </div>

                                        {/* Thông tin trích xuất */}
                                        {cccdInfo && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-3"
                                            >
                                                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                                                    <Check size={16} className="stroke-[3px]" />
                                                    Đọc CCCD thành công
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    {[
                                                        { label: "Số CCCD",  value: cccdInfo.cccdNumber },
                                                        { label: "Họ tên",   value: cccdInfo.fullName   },
                                                        { label: "Ngày sinh",value: cccdInfo.dateOfBirth },
                                                        { label: "Giới tính",value: cccdInfo.sex         },
                                                        { label: "Quốc tịch",value: cccdInfo.nationality },
                                                        { label: "Hết hạn",  value: cccdInfo.expiryDate  },
                                                    ].filter(f => f.value).map(field => (
                                                        <div key={field.label}>
                                                            <p className="text-gray-500 text-xs">{field.label}</p>
                                                            <p className="text-gray-900 font-semibold">{field.value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Error */}
                                        {cccdError && (
                                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                                                <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                                                <p className="text-red-700 text-sm">{cccdError}</p>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        {!cccdInfo ? (
                                            <button
                                                onClick={handleScanCccd}
                                                disabled={cccdLoading}
                                                className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 transition-all"
                                            >
                                                {cccdLoading ? (
                                                    <><Loader2 size={18} className="animate-spin" /> Đang đọc CCCD...</>
                                                ) : (
                                                    <><Camera size={18} /> Đọc thông tin CCCD</>
                                                )}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={goToSelfie}
                                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 text-white font-bold text-sm hover:opacity-90 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all"
                                            >
                                                Tiếp theo: Chụp ảnh selfie
                                                <ChevronRight size={18} />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ═══════════════ STEP 2: SELFIE (đơn giản — chụp 1 ảnh) ═══════════════ */}
                        {step === "liveness" && (
                            <div className="p-8 space-y-6">
                                <div className="border-b border-gray-100 pb-4">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <Smile size={22} className="text-indigo-600" />
                                        Bước 2: Chụp ảnh khuôn mặt
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Nhìn thẳng vào camera và bấm nút chụp. Đảm bảo khuôn mặt rõ ràng, đủ sáng.
                                    </p>
                                </div>

                                {selfieError && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                                        <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-red-700 text-sm">{selfieError}</p>
                                    </div>
                                )}

                                {/* Camera view */}
                                <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video">
                                    <video
                                        ref={selfieVideoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-full object-cover scale-x-[-1]"
                                    />

                                    {/* Oval face guide */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-48 h-60 rounded-full border-white/50 border-dashed" style={{ borderWidth: 3 }} />
                                    </div>

                                    {/* Instruction overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-center">
                                        <p className="text-white font-bold text-lg">
                                            😊 Nhìn thẳng vào camera
                                        </p>
                                        <p className="text-white/70 text-xs mt-1">
                                            Giữ khuôn mặt trong khung tròn, đảm bảo đủ ánh sáng
                                        </p>
                                    </div>

                                    {/* Loading indicator */}
                                    {!cameraReady && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 gap-3">
                                            <Loader2 size={32} className="animate-spin text-white" />
                                            <p className="text-white text-sm">Đang khởi động camera...</p>
                                        </div>
                                    )}
                                </div>

                                {/* Selfie preview (nếu đã chụp nhưng chưa gửi) */}
                                {selfieCapture && (
                                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                                        <img
                                            src={selfieCapture}
                                            alt="Selfie preview"
                                            className="w-full h-auto object-contain max-h-64 scale-x-[-1]"
                                        />
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => { stopSelfieCamera(); setStep("cccd"); }}
                                        className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        Quay lại
                                    </button>
                                    <button
                                        onClick={captureSelfie}
                                        disabled={!cameraReady}
                                        className="flex-[2] py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-primary text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all"
                                    >
                                        <Camera size={18} />
                                        Chụp ảnh selfie
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ═══════════════ STEP 3: RESULT ═══════════════ */}
                        {step === "result" && (
                            <div className="p-10 text-center space-y-6">
                                {verifyLoading && (
                                    <div className="flex flex-col items-center gap-4 py-8">
                                        <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                        <p className="text-gray-600 font-medium">Đang so sánh khuôn mặt...</p>
                                        <p className="text-gray-400 text-sm">Thường mất 5-15 giây</p>
                                    </div>
                                )}

                                {!verifyLoading && verifyMatch === true && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="space-y-5"
                                    >
                                        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                                            <ShieldCheck size={52} className="text-emerald-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-extrabold text-gray-900">Xác thực thành công! 🎉</h3>
                                            <p className="text-gray-500 mt-2 text-sm">
                                                Khuôn mặt khớp với CCCD.
                                            </p>
                                            <p className="text-gray-500 text-sm mt-1">
                                                Bạn đã có thể đăng phòng trên MyRoomie.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => navigate("/post")}
                                            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 text-white font-bold shadow-lg shadow-primary/30 hover:opacity-90 cursor-pointer transition-all inline-flex items-center gap-2"
                                        >
                                            Đăng phòng ngay
                                            <ChevronRight size={18} />
                                        </button>
                                    </motion.div>
                                )}

                                {!verifyLoading && verifyMatch === false && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="space-y-5"
                                    >
                                        <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                                            <AlertCircle size={52} className="text-red-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-extrabold text-gray-900">Xác thực không thành công</h3>
                                            <p className="text-red-600 mt-2 text-sm font-medium">{verifyError}</p>
                                        </div>
                                        <div className="flex gap-3 justify-center">
                                            <button
                                                onClick={resetSelfie}
                                                className="px-6 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-700 font-semibold text-sm hover:bg-gray-100 cursor-pointer inline-flex items-center gap-2"
                                            >
                                                <RefreshCw size={16} />
                                                Chụp lại selfie
                                            </button>
                                            <button
                                                onClick={() => { setStep("cccd"); setCccdPreview(null); setCccdInfo(null); setSelfieCapture(null); setVerifyMatch(null); }}
                                                className="px-6 py-3 rounded-2xl border border-primary/30 bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 cursor-pointer"
                                            >
                                                Quét lại CCCD
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {!verifyLoading && verifyMatch === null && verifyError && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-left">
                                        <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-red-700 text-sm">{verifyError}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
