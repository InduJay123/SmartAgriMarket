import { Star } from "lucide-react";

const StarRating = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (value: number) => void;
}) => {
  const handleClick = (star: number) => {
    // If user clicks the same star again, reset to 0
    if (star === rating) {
      setRating(0);
    } else {
      setRating(star);
    }
  };

  return (
    <div className="flex items-center gap-1 cursor-pointer">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={24}
          className={`transition-colors ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => handleClick(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;
