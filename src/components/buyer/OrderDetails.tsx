import { X, Calendar, User, Phone, MapPin, Package, Dot } from "lucide-react";

type Props = {
  order: any;
  onClose: () => void;
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12 || 12;

  return `${day} ${month} ${year} at ${hours}.${minutes} ${ampm}`;
};


export default function OrderDetails({ order, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">Order Details</h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* Order meta */}
        <div className="px-6 py-2 text-xs text-gray-500 flex gap-2">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
             Order ID: ORD-{order.order_id}
            <Dot/>
            {formatDateTime(order.created_at)}
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            {order.status}
          </span>
        </div>

        {/* Product Details */}
        <div className="px-6 py-2 bg-blue-50/40 m-4 rounded-md">
          <h3 className="font-semibold flex items-center gap-2">
            <Package size={18} className="text-green-600"/> Product Details
          </h3>

          <div className="flex gap-4 bg-gray-50 p-4 rounded-lg">
            <img
              src={order.product_image}
              alt="Product"
              className="w-24 h-24 rounded-lg object-cover border"
            />

            <div className="space-y-1">
              <p className="font-bold text-lg">Product: {order.product_name}</p>
              <p className="text-sm text-gray-600">
                Sold by: <span className="font-semibold">{order.farmer_name}</span>
              </p>
              <p className="text-sm">Quantity: {order.quantity} </p>
              <p className="text-green-600 font-bold">
                Rs. {order.price_at_order}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="px-6 py-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <MapPin size={18} /> Delivery Details
          </h3>

          <div className="space-y-3 bg-gray-50 p-4 rounded-lg text-sm">
            <div className="flex gap-2 items-center">
              <User size={16} />
              {order.full_name}
            </div>

            <div className="flex gap-2 items-center">
              <Phone size={16} />
              {order.phone}
            </div>

            <div className="flex gap-2 items-start">
              <MapPin size={16} />
              <p>{order.address}, {order.city}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}