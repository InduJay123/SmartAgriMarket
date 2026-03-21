import { useEffect, useState } from "react";
import { X, Star } from "lucide-react";
import { getReviews, getReviewSummary } from "../../api/reviews";

interface Review {
  id: number;
  user_name: string;
  profile_image?: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewPopupProps {
  productId: number;
  onClose: () => void;
}

const ReviewPopup = ({ productId, onClose }: ReviewPopupProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [reviewsData, summaryData] = await Promise.all([
        getReviews(productId),
        getReviewSummary(productId),
      ]);

      setReviews(reviewsData);
      setAvg(summaryData.avg);
      setTotal(summaryData.total);
    } catch (err) {
      console.error("Failed to load reviews", err);
    }finally {
      setLoading(false);
    }
};
  fetchData();
}, [productId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative">
        
        {/* Close */}
        <button onClick={onClose} className="absolute right-4 top-4">
          <X />
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold mb-1">Product Reviews</h2>
        <p className="text-sm text-gray-600 mb-4">
          ⭐ {avg} average · {total} reviews
        </p>

        {/* Reviews */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {reviews.length === 0 && (
            <p className="text-gray-500 text-sm">No reviews yet</p>
          )}

          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={review.profile_image || "/avatar.png"}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{review.user_name}</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-700">{review.comment}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewPopup;
