import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Star, MessageSquarePlus, ChevronDown } from "lucide-react";
import StarRating from "./StarRating";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";

export interface ProfileReview {
  id: string;
  author: string;
  authorId?: string;
  avatar: string;
  date: string;
  rating: number;
  text: string;
}

interface ProfileRatingsProps {
  reviews: ProfileReview[];
  rating: number;
  reviewCount: number;
  targetName: string;
  targetAvatar?: string;
  canReview?: boolean;
  onAddReview?: (rating: number, text: string) => void;
}

export default function ProfileRatings({
  reviews,
  rating,
  reviewCount,
  targetName,
  targetAvatar,
  canReview = true,
  onAddReview,
}: ProfileRatingsProps) {
  const { t } = useTranslation();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const handleSubmitReview = (newRating: number, text: string) => {
    if (onAddReview) {
      onAddReview(newRating, text);
    }
  };

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, percentage };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-3xl p-6 sm:p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text font-[family-name:var(--font-family-heading)] flex items-center gap-2">
          <Star size={18} className="text-gold fill-gold" />
          {t("profile.ratingsReviews", "Ratings & Reviews")}
        </h2>
        {canReview && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowReviewForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors cursor-pointer border-0"
          >
            <MessageSquarePlus size={14} />
            {t("rating.writeReview", "Write Review")}
          </motion.button>
        )}
      </div>

      {/* Rating Summary */}
      <div className="flex flex-col sm:flex-row gap-6 mb-6 pb-6 border-b border-white/20">
        {/* Overall Rating */}
        <div className="text-center sm:text-left sm:pr-6 sm:border-r sm:border-white/20">
          <div className="text-4xl font-bold text-text font-[family-name:var(--font-family-heading)]">
            {rating > 0 ? rating.toFixed(1) : "-"}
          </div>
          <StarRating rating={rating} size={18} />
          <div className="text-sm text-text-muted mt-1">
            {reviewCount} {reviewCount === 1 ? t("common.review", "review") : t("common.reviews", "reviews")}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-3 text-text-muted">{star}</span>
              <Star size={12} className="text-gold fill-gold" />
              <div className="flex-1 h-2 bg-white/40 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.1 * (5 - star) }}
                  className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full"
                />
              </div>
              <span className="w-8 text-right text-text-muted">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {displayedReviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} delay={index * 0.1} />
          ))}

          {reviews.length > 3 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/40 bg-white/40 text-text text-sm font-medium hover:bg-white/60 transition-colors cursor-pointer"
            >
              {showAllReviews ? (
                <>
                  {t("common.showLess", "Show Less")}
                  <ChevronDown size={16} className="rotate-180" />
                </>
              ) : (
                <>
                  {t("rating.showAllReviews", "Show all {{count}} reviews", { count: reviews.length })}
                  <ChevronDown size={16} />
                </>
              )}
            </motion.button>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Star size={24} className="text-primary" />
          </div>
          <p className="text-text-muted text-sm">
            {t("rating.noReviewsYet", "No reviews yet")}
          </p>
          {canReview && (
            <p className="text-text-muted text-xs mt-1">
              {t("rating.beFirstToReview", "Be the first to leave a review!")}
            </p>
          )}
        </div>
      )}

      {/* Review Form Modal */}
      <ReviewForm
        isOpen={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        onSubmit={handleSubmitReview}
        targetName={targetName}
        targetAvatar={targetAvatar}
      />
    </motion.div>
  );
}
