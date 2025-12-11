// ProductPopup.jsx
import { X, Star, MapPin, Phone, Calendar, ShoppingBag } from "lucide-react";
import carbageImg from '../../assets/carbage.png';
import type { Product } from "../../@types/Product";

interface ProductPopupProps {
  product: Product;
  onClose: () => void;
  onPlaceOrder: () => void;
}

export default function ProductPopup({ product, onClose, onPlaceOrder }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* modal container */}
      <div className="bg-white w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-600 hover:text-black"
        >
          <X size={26} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold mb-4">Product Details</h2>

        {/* Product Section */}
        <div className="flex gap-4 p-4 rounded-xl bg-gray-50">
          <img
            src={ product.image_url ||
                product.image ||
                product.crop?.image }
            alt={product.name}
            className="w-28 h-28 rounded-lg object-cover"
          />

          <div>
            <h3 className="text-lg font-semibold">{product.crop?.crop_name ?? "Unknown Crop"}</h3>
            <p className="text-sm text-gray-600">{product.crop?.description ?? "No description available"}</p>

            <div className="flex flex-wrap items-center gap-6">
              <p className="text-green-700 font-bold mt-2 text-xl">
                Rs. {product.price}/{product.unit}
              </p>

              <p className="text-sm mt-1">
                Available: <span className="font-bold">{product.quantity} kg</span>
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
              src={carbageImg}
              className="w-16 h-16 rounded-full object-cover"
            />

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold">Helena Ron</h4>
                <div className="flex items-center gap-1 bg-green-100 px-1 rounded-xl">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  <span className="font-semibold text-green-700">3.2</span>
                </div>
              </div>

              <p className="text-sm text-gray-600">Helloo</p>
              {/* Farmer info icons */}
              <div className="grid grid-cols-2 mt-4 gap-2 text-sm text-gray-700">
                <span className="flex items-center gap-2"><MapPin size={16} />galle</span>
                <span className="flex items-center gap-2"><Calendar size={16} /> Member since 2015</span>
                <span className="flex items-center gap-2"><Phone size={16} /> 07012457896</span>
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
        <div className="flex flex-wrap items-center justify-between mt-8">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-yellow-500"/>
            <h3 className="text-md font-semibold mt-4 mb-3">Customer Reviews</h3>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-wrap gap-2">
              <div className="text-2xl font-bold">5.0</div>
              <div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={16} className="fill-yellow-500" />
                  <Star size={16} className="fill-yellow-500" />
                  <Star size={16} className="fill-yellow-500" />
                  <Star size={16} className="fill-yellow-500" />
                  <Star size={16} className="fill-yellow-500" />
                </div>
            <p className="text-gray-600 text-sm">{5} reviews</p>
              </div>
          </div>
            </div>
        </div>

        {/*reviews.map((r) => (
          <div
            key={r.id}
            className="p-3 mb-3 border rounded-xl bg-gray-50 flex gap-3"
          >
            <img src={r.avatar} className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-bold">{r.name}</p>
              <p className="text-yellow-500 flex">
                {"★★★★★".substring(0, r.stars)}
              </p>
              <p className="text-sm">{r.comment}</p>
              <p className="text-xs text-gray-500">{r.date}</p>
            </div>
          </div>
        ))*/}

        <div className="mt-8">
          <button
            onClick={() => {
              onPlaceOrder(product);   // open new popup
            }}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
            >
            <span>🧺</span> Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
