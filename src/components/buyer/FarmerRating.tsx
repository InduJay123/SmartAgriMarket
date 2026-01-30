import { useEffect, useState } from "react";
import { getFarmerRatingSummary } from "../../api/reviews";

const FarmerRating = ({ farmerId }: { farmerId: number }) => {
  const [rating, setRating] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const fetchRating = async () => {
      const data = await getFarmerRatingSummary(farmerId);
      if (data) {
        setRating(data.average_rating);
        setTotal(data.total_reviews);
      }
    };

    fetchRating();
  }, [farmerId]);

  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-green-700">
        {rating.toFixed(1)}
      </span>

      {/* Stars */}
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              star <= Math.round(rating)
                ? "text-yellow-400"
                : "text-gray-300"
            }
          >
            ★
          </span>
        ))}
      </div>

      <span className="text-sm text-gray-500">
        ({total})
      </span>
    </div>
  );
};

export default FarmerRating;