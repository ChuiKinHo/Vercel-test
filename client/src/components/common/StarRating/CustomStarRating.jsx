import { useState, useEffect } from "react";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";

const StarRating = ({ initialRating = 0, onRatingChange }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [initialUserRating, setInitialUserRating] = useState(null);

  useEffect(() => {
    setInitialUserRating(initialRating);
    setHoveredRating(0)
  }, [initialRating]);

  const handleRatingClick = (value) => {
    setInitialUserRating(value);
    onRatingChange(value);
  };

  return (
    <div className="flex gap-x-3">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleRatingClick(value)}
          onMouseEnter={() => setHoveredRating(value)}
          onMouseLeave={() => setHoveredRating(0)}
          className="focus:outline-none"
        >
          {value <= (hoveredRating || initialUserRating) ? (
            <StarIconSolid className="size-6 text-yellow-400" />
          ) : (
            <StarIconOutline className="size-6 text-text/30" />
          )}
        </button>
      ))}
    </div>
  );
};

export default StarRating;
