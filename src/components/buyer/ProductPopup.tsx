import { X, Star, MapPin, Phone, Calendar, ShoppingBag, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "../../api/reviews";
import StarRating from "./StartRating";
import StarDisplay from "./StartDisplay";
import TotalRatings from "./TotalRatings";
import avatar from '../../assets/avatar.svg?url'
import { getBuyerProfile } from "../../api/profile";

interface ProductPopupProps {
  product: any; 
  onClose: () => void;
  onPlaceOrder: (product: any) => void;
}

interface Review {
  id: number;
  user_name: string;
  profile_image: string;
  rating: number;
  comment: string;
}

const ProductPopup:React.FC<ProductPopupProps>  = ({ product, onClose, onPlaceOrder }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentUser, setCurrentUser] = useState<{ fullname: string; profile_image: string } | null>(null);
  const totalReviews = reviews.length;

  const averageRating = totalReviews === 0 ? 0 : (
    reviews.reduce((sum, review) => sum + review.rating, 0) /
    totalReviews
  );
        
  useEffect(() => {
    if (!product?.market_id) return;

    const fetchData = async () => {
      try {
        const data = await getReviews(product.market_id);
        setReviews(data || []);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };
    fetchData();
  }, [product]);

  const handleAddReview = async () => {
    if (!comment) return alert("Please enter a comment");

    const newReview = await addReview(
      product.market_id,
      rating, 
      comment
    );
    if (newReview) {
      setReviews([newReview, ...reviews]);
      setComment("");
      setRating(0); 
    } else {
      alert("Failed to add review");
    }
  };

  useEffect(() => {
  const fetchCurrentUser = async () => {
    try {
      const data = await getBuyerProfile();
      console.log("Fetched user:", data);
      setCurrentUser({
        fullname: data.buyer_details?.fullname || data.username,
        profile_image: data.buyer_details?.profile_image || null
      });

    } catch (err) {
      console.error("Failed to fetch current user:", err);
    }
  };
  fetchCurrentUser();
}, []);
    
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* modal container */}
      <div className="bg-white w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-600 hover:text-black"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold mb-2">Product Details</h2>

        {/* Product Section */}
        <div className="flex gap-4 p-2 rounded-xl bg-gray-50">
          <img
            src={ product.image_url ||
                product.image ||
                product.crop?.image }
            alt={product.name}
            className="w-28 h-28 rounded-lg object-cover"
          />

          <div>
            <h3 className="text-xl font-semibold">{product.crop?.crop_name ?? "Unknown Crop"}</h3>
            <p className="text-sm text-gray-600">{product.crop?.description ?? "No description available"}</p>

            <div className="flex-col items-center gap-6">
              <p className="text-black font-bold mt-2 text-xl">
                Available: <span className="font-bold text-green-700">{product.quantity} kg</span>
              </p>
              <p className="text-black font-bold mt-2 text-lg">
                Rs. {product.price}/{product.unit}
              </p>
            </div>
          </div>
        </div>

        {/* Farmer Section */}
        <h3 className="text-md font-semibold mt-4 mb-2 flex items-center gap-2">
          <span className="text-green-600 text-lg">🧑‍🌾</span> About the Farmer
        </h3>

        <div className="p-4 border rounded-xl bg-gray-50">
          <div className="flex items-center gap-4">
            <img
              src={product.farmer?.profile_image || avatar}
              alt="farmer image"
              className="w-16 h-16 rounded-full object-cover"
            />

            <div>
              <div className="flex-col items-center gap-2">
                <h4 className="font-bold"> {product.farmer?.fullname} </h4>
                <div className="flex items-center gap-1 bg-green-100 px-1 rounded-xl">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  <span className="font-semibold text-green-700">3.2</span>
                </div>
              </div>

              {/* Farmer info icons */}
              <div className="grid grid-cols-2 mt-4 gap-2 text-sm text-gray-700">
                <span className="flex items-center gap-2"><MapPin size={16} /> {product.farmer?.region} </span>
                <span className="flex items-center gap-2"><Calendar size={16} /> Member since {product.farmer?.date_joined ? new Date(product.farmer.date_joined).getFullYear() : "-"}</span>
                <span className="flex items-center gap-2"><Phone size={16} /> {product.farmer?.contact_number} </span>
                <span className="flex items-center gap-2"><ShoppingBag size={16} /> 200 sales</span>
              </div>
            </div>
          </div>

          {/* Badges 
          <div className="flex gap-3 mt-4 flex-wrap">
            {farmer.badges.map((b) => (
              <span
                key={b}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
              >
                {b}
              </span>
            ))}
          </div>*/}
        </div>

        {/* Reviews */}
        <div className="flex flex-wrap items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-yellow-500"/>
            <h3 className="text-md font-semibold mt-4 mb-3">Customer Reviews</h3>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-wrap gap-2">
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>

                <div>
                  <TotalRatings rating={Number(averageRating)} />
                  <p className="text-gray-600 text-sm">
                    {totalReviews} review{totalReviews !== 1 && "s"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      <div>
      <div className="max-h-64 overflow-y-auto">
        {reviews.length === 0 && (
          <p className="text-sm text-gray-500">No reviews yet</p>
        )}

        {reviews.map((review) => (
          <div key={review.id} className="border-b py-2 border-blue-200/80 bg-gray-100/90 rounded-lg px-4 mb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                src={review.profile_image || avatar} 
                alt={review.user_name}
                className="w-10 h-10 rounded-full object-cover mt-1"
                />
                <div>
                  <p className="text-sm font-semibold">{review.user_name}</p>
                  <p className="text-xs">{review.comment}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between">
                
                <StarDisplay rating={review.rating} />
            </div>
            
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t pt-4">     
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-4">         
            <img
              src={currentUser?.profile_image || avatar}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />               
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={currentUser?.fullname|| "Write your review..."}
            className="flex-1 border px-2 rounded-xl"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between mt-2">
          <StarRating rating={rating} setRating={setRating}/>
          <button
              onClick={handleAddReview}
              className="bg-green-900 hover:bg-green-800 text-white p-2 rounded-xl"              
            >
              <Send size={20}/>
            </button>
          </div> 

        </div>
    </div>
        {/*<div className="mt-8">
          <button
            onClick={() => {
              onPlaceOrder(product);  
            }}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
            >
            <span>🧺</span> Place Order
          </button>
        </div>*/}
      </div>
    </div>
  );
}

export default ProductPopup;