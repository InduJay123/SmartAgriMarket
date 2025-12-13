import { X, CreditCard, Minus, Plus, ArrowLeft, Truck, User, PhoneCall, Phone } from "lucide-react";
import { useState } from "react";
import type { Product } from "../../@types/Product";
import { useNavigate } from "react-router-dom";

interface PlaceOrderProps {
  product: Product | null;
  onClose: () => void;
}

export default function PlaceOrder({ product, onClose }: PlaceOrderProps) {
  const [quantity, setQuantity] = useState(1)
  const navigate = useNavigate;
  if (!product) return null;

  const maxQuantity = product.quantity ?? 1;
  const subtotal = product.price * quantity;
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const total = subtotal + deliveryFee;

  const inc = () => {
    if (quantity < maxQuantity) setQuantity(quantity + 1);
  };

  const dec = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handlePlaceOrder = () => {
  if (!product) return;

 const newOrder = {
  id: Date.now(),
  product: {
    id: product.id,
    crop_name: product.crop?.crop_name,
    unit: product.unit,
    price: product.price,
    farmer: { name: product.farmer?.name },
  },
  quantity,
  total,
  status: 'pending',
  createdAt: new Date().toISOString(),
  deliveryDetails: {
    fullName,
    phone,
    address,
    city,
  },
};


  const savedOrders = JSON.parse(localStorage.getItem('farmfresh_orders') || '[]');

// Keep last 50 orders only
const updatedOrders = [newOrder, ...savedOrders].slice(0, 50);
  localStorage.setItem("farmfresh_orders", JSON.stringify(updatedOrders));

  // Redirect to order history page
  window.location.href = "/orders";
};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      
       <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </header>
      <div className="bg-gray-50 w-[95%] max-w-5xl max-h-[95vh] overflow-y-auto rounded-xl shadow-xl p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-600 hover:text-black"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h1 className="text-xl font-display font-bold text-foreground mb-8 animate-fade-in">
          Complete Your Order
        </h1>
        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDE FORM */}
          <div className="lg:col-span-2 space-y-4 overflow-y-auto pr-3">

            {/* Product Summary */}
            <div className="bg-white shadow-sm rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Product Details</h3>

              <div className="flex gap-4">
                <img
                  src={product.image_url || product.crop?.image || "/placeholder.svg"}
                  className="w-20 h-20 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <h4 className="font-bold text-lg">{product.crop?.crop_name}</h4>
                  <p className="text-sm text-gray-600">Sold by: {product.farmer?.name} </p>
                  <p className="text-lg font-bold text-green-700">
                    Rs.{product.price.toFixed(2)}/{product.unit}
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mt-4 flex items-center justify-between bg-white border px-2 py-1 rounded-lg">
                <span className="font-medium">Quantity</span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={dec}
                    className="p-2 border-gray-300 bg-gray-50 rounded-xl hover:bg-gray-100 disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} />
                  </button>

                  <span className="w-16 text-center text-lg font-bold">
                    {quantity} {product.unit}
                  </span>

                  <button
                    onClick={inc}
                    className="p-2 border-gray-300 bg-gray-50 rounded-xl hover:bg-gray-100 disabled:opacity-50"
                    disabled={quantity >= maxQuantity}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-right text-gray-500 mt-2">
                Max available: {maxQuantity} {product.unit}
              </p>
            </div>

            {/* Full Name + Phone */}
            <div className="bg-white shadow-sm p-4">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Truck className="text-green-800"/> Delivery Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <label className="font-medium text-sm flex items-center gap-2"><User size={16}/> Full Name *</label>
                <input
                  type="text"
                  className="w-full mt-1 px-4 py-1 rounded-lg border bg-gray-50 placeholder:text-sm"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="font-medium text-sm flex items-center gap-2"><Phone size={16}/> Phone *</label>
                <input
                  type="text"
                  className="w-full mt-1 px-4 py-1 rounded-lg border bg-gray-50 placeholder:text-sm"
                  placeholder="+94 71 234 5678"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-2">
              <label className="font-medium text-sm">✉️ Email Address</label>
              <input
                type="email"
                className="w-full mt-1 px-4 py-1 rounded-lg border bg-gray-50 placeholder:text-sm"
                placeholder="your@email.com"
              />
            </div>

            {/* Address */}
            <div className="mb-2">
              <label className="font-medium text-sm">📍 Delivery Address *</label>
              <textarea
                className="w-full mt-1 px-4 py-1 rounded-lg border bg-gray-50 placeholder:text-sm"
                placeholder="House number, street, landmark..."
                rows={3}
              ></textarea>
            </div>

            {/* City + State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <label className="font-medium text-sm">City *</label>
                <input
                  className="w-full mt-1 px-4 py-1 rounded-lg border bg-gray-50 placeholder:text-sm"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="font-medium text-sm">State</label>
                <input
                  className="w-full mt-1 px-4 py-1 rounded-lg border bg-gray-50 placeholder:text-sm"
                  placeholder="Enter state"
                />
              </div>
            </div>

            {/* Pincode */}
            <div className="mb-2">
              <label className="font-medium text-sm">PIN Code *</label>
              <input
                className="w-full mt-1 px-4 py-1 rounded-lg border bg-gray-50 placeholder:text-sm"
                placeholder="Enter PIN code"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="font-medium text-sm">Delivery Notes (Optional)</label>
              <textarea
                className="w-full mt-1 px-4 py-1 rounded-lg border bg-gray-50 placeholder:text-sm"
                placeholder="Any instructions for the rider..."
                rows={3}
              ></textarea>
            </div>
            </div>
          </div>

          {/* RIGHT SIDE — SUMMARY */}
          <div className="bg-white shadow-sm rounded-xl p-6 h-max sticky top-6 self-start">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              📄 Order Summary
            </h3>

            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal ({quantity} {product.unit})</span>
                <span className="font-semibold">Rs.{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold">
                  {deliveryFee === 0 ? "FREE" : `Rs.${deliveryFee.toFixed(2)}`}
                </span>
              </div>

              {deliveryFee > 0 && (
                <p className="text-xs text-green-800/90">Free delivery above Rs.500</p>
              )}

              <hr className="my-3" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-green-800/90">Rs.{total.toFixed(2)}</span>
              </div>
            </div>

            <button
                onClick={handlePlaceOrder}
              className="w-full bg-green-800/90 text-white font-semibold py-2 rounded-lg mt-6 flex items-center justify-center gap-2 hover:bg-green-700"
            >
              <CreditCard size={18} />
              Place Order
            </button>

            <p className="text-center text-xs text-gray-500 mt-3">
              By placing this order, you agree to our terms and conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
