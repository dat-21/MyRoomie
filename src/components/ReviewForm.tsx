import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, Send, Star } from "lucide-react";
import StarRating from "./StarRating";

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, text: string) => void;
  targetName: string;
  targetAvatar?: string;
}

export default function ReviewForm({
  isOpen,
  onClose,
  onSubmit,
  targetName,
  targetAvatar,
}: ReviewFormProps) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSubmit(rating, text);
    setRating(0);
    setText("");
    setIsSubmitting(false);
    onClose();
  };

  const ratingLabels = [
    "",
    t("rating.terrible", "Terrible"),
    t("rating.poor", "Poor"),
    t("rating.okay", "Okay"),
    t("rating.good", "Good"),
    t("rating.excellent", "Excellent"),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md glass-strong rounded-3xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/20 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text font-[family-name:var(--font-family-heading)]">
                {t("rating.writeReview", "Write a Review")}
              </h3>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/60 flex items-center justify-center hover:bg-white/80 transition-colors cursor-pointer border-0"
              >
                <X size={18} className="text-text-muted" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Target User */}
              <div className="flex items-center gap-3">
                {targetAvatar && (
                  <img
                    src={targetAvatar}
                    alt={targetName}
                    className="w-12 h-12 rounded-xl object-cover bg-primary/10"
                  />
                )}
                <div>
                  <div className="text-xs text-text-muted">
                    {t("rating.reviewingLabel", "You are reviewing")}
                  </div>
                  <div className="text-base font-semibold text-text">{targetName}</div>
                </div>
              </div>

              {/* Rating Selection */}
              <div className="text-center">
                <div className="text-sm text-text-muted mb-3">
                  {t("rating.tapToRate", "Tap to rate")}
                </div>
                <div className="flex justify-center mb-2">
                  <StarRating
                    rating={rating}
                    size={32}
                    interactive
                    onChange={setRating}
                  />
                </div>
                {rating > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-medium text-primary"
                  >
                    {ratingLabels[rating]}
                  </motion.div>
                )}
              </div>

              {/* Review Text */}
              <div>
                <label className="text-sm text-text-muted mb-2 block">
                  {t("rating.yourReview", "Your review")} ({t("common.optional", "optional")})
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t(
                    "rating.reviewPlaceholder",
                    "Share your experience with others..."
                  )}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/60 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none placeholder:text-text-muted/60"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/20 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 px-5 py-3 rounded-xl border border-white/40 bg-white/60 text-text text-sm font-medium hover:bg-white/80 transition-colors cursor-pointer"
              >
                {t("common.cancel", "Cancel")}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-lg transition-all cursor-pointer border-0 ${
                  rating === 0 || isSubmitting
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary to-primary-light hover:shadow-xl"
                }`}
              >
                <Send size={16} />
                {isSubmitting
                  ? t("common.submitting", "Submitting...")
                  : t("rating.submitReview", "Submit Review")}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
