
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 24,
  onRatingChange,
  readonly = false
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  return (
    <div className="star-rating">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const filled = readonly
          ? starValue <= rating
          : starValue <= (hoverRating || rating);

        return (
          <Star
            key={index}
            size={size}
            className={`star ${filled ? 'filled' : 'empty'}`}
            onClick={() => {
              if (!readonly && onRatingChange) {
                onRatingChange(starValue);
              }
            }}
            onMouseEnter={() => {
              if (!readonly) {
                setHoverRating(starValue);
              }
            }}
            onMouseLeave={() => {
              if (!readonly) {
                setHoverRating(0);
              }
            }}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
