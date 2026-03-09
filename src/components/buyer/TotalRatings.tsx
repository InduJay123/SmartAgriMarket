import { Star } from "lucide-react";

interface AverageStarsProps {
  rating: number;
}

const TotalRatings: React.FC<AverageStarsProps> = ({ rating }) => {
  const rounded = Math.round(rating);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={
            star <= rounded
              ? "fill-yellow-500 text-yellow-500"
              : "text-gray-300"
          }
        />
      ))}
    </div>
  );
};

export default TotalRatings;