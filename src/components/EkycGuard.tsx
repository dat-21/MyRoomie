import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEkyc } from "../hooks/useEkyc";

interface EkycGuardProps {
  /** Nội dung hiển thị nếu đã xác thực */
  children: React.ReactNode;
}

/**
 * EkycGuard — Wrap quanh các trang yêu cầu eKYC (như PostRoomPage).
 * Nếu chủ trọ chưa xác thực → hiển thị popup yêu cầu xác thực.
 * Nếu đã xác thực → render children bình thường.
 */
export default function EkycGuard({ children }: EkycGuardProps) {
  const { isVerified, isLoading } = useEkyc();
  const navigate = useNavigate();

  // Trong khi đang fetch status → hiển thị skeleton nhỏ
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  // Đã xác thực → cho qua bình thường
  if (isVerified) return <>{children}</>;

  // Chưa xác thực → hiện popup toàn màn hình với backdrop blur
  return (
    <>
      {/* Nội dung bên dưới bị blur */}
      <div className="pointer-events-none select-none filter blur-sm opacity-40 min-h-screen">
        {children}
      </div>

      {/* Popup overlay */}
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal card */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative z-10 max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Top gradient bar */}
            <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />

            <div className="p-8 text-center">
              {/* Icon */}
              <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-5">
                <ShieldAlert size={40} className="text-amber-500" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2 font-[family-name:var(--font-family-heading)]">
                Xác thực danh tính
              </h2>
              <p className="text-gray-500 text-sm mb-1 leading-relaxed">
                Để đảm bảo an toàn cho người thuê phòng,
              </p>
              <p className="text-gray-700 font-semibold text-sm mb-6 leading-relaxed">
                chủ trọ cần hoàn thành <span className="text-amber-600">xác thực CCCD + khuôn mặt</span> trước khi đăng phòng.
              </p>

              {/* Steps preview */}
              <div className="flex items-center justify-center gap-3 mb-7">
                {[
                  { icon: "🪪", label: "Quét CCCD" },
                  { icon: "😊", label: "Liveness" },
                  { icon: "✅", label: "Hoàn tất" },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl mb-1">
                        {step.icon}
                      </div>
                      <span className="text-[10px] text-gray-500 font-medium">{step.label}</span>
                    </div>
                    {i < 2 && <ArrowRight size={14} className="text-gray-300 mb-4" />}
                  </div>
                ))}
              </div>

              {/* Info badge */}
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 mb-7 text-left">
                <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />
                <p className="text-xs text-emerald-700 leading-snug">
                  Thông tin của bạn được <strong>mã hóa</strong> và bảo mật hoàn toàn. 
                  Chỉ mất <strong>~2 phút</strong>.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => window.history.back()}
                  className="flex-1 py-3 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  Hủy bỏ
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/ekyc")}
                  className="flex-[2] py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm transition-all cursor-pointer shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={16} />
                  Xác thực ngay
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </>
  );
}
