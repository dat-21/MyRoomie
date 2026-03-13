import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
  reviewCount?: number;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 16,
  interactive = false,
  onChange,
  showValue = false,
  reviewCount,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }, (_, i) => {
          const value = i + 1;
          const isFilled = value <= displayRating;
          const isHalfFilled = value - 0.5 <= displayRating && value > displayRating;

          return (
            <motion.button
              key={i}
              type="button"
              whileHover={interactive ? { scale: 1.2 } : {}}
              whileTap={interactive ? { scale: 0.9 } : {}}
              onMouseEnter={() => interactive && setHoverRating(value)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              onClick={() => handleClick(value)}
              className={`border-0 bg-transparent p-0 ${
                interactive ? "cursor-pointer" : "cursor-default"
              }`}
              disabled={!interactive}
            >
              <Star
                size={size}
                className={`transition-colors ${
                  isFilled
                    ? "text-gold fill-gold"
                    : isHalfFilled
                    ? "text-gold fill-gold/50"
                    : "text-gray-300"
                } ${interactive && hoverRating >= value ? "text-gold fill-gold" : ""}`}
              />
            </motion.button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-text">{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className="text-sm text-text-muted">({reviewCount})</span>
      )}
    </div>
  );
}
