import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import StarRating from "./StarRating";

interface Review {
  id: string;
  author: string;
  authorId?: string;
  avatar: string;
  date: string;
  rating: number;
  text: string;
}

interface ReviewCardProps {
  review: Review;
  delay?: number;
}

export default function ReviewCard({ review, delay = 0 }: ReviewCardProps) {
  const { i18n } = useTranslation();

  const formattedDate = new Date(review.date).toLocaleDateString(
    i18n.language === "vi" ? "vi-VN" : "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass rounded-2xl p-4 space-y-3"
    >
      <div className="flex items-start gap-3">
        <img
          src={review.avatar}
          alt={review.author}
          className="w-10 h-10 rounded-xl object-cover bg-primary/10 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-text">{review.author}</div>
              <div className="text-xs text-text-muted">{formattedDate}</div>
            </div>
            <StarRating rating={review.rating} size={14} />
          </div>
        </div>
      </div>
      <p className="text-sm text-text-light leading-relaxed">"{review.text}"</p>
    </motion.div>
  );
}
