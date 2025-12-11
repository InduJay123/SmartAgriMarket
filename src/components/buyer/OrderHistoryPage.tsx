import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Eye, Calendar } from 'lucide-react';
import type { Product } from '../../@types/Product';

interface Order {
  id: number;
  product: Product;
  quantity: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
  deliveryDetails: {
    fullName: string;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    notes?: string;
  };
}

const statusConfig = {
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  confirmed: { label: 'Confirmed', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  shipped: { label: 'Shipped', className: 'bg-purple-100 text-purple-800 border-purple-200' },
  delivered: { label: 'Delivered', className: 'bg-green-100 text-green-800 border-green-200' },
};

export default function OrdersHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedOrders = localStorage.getItem('farmfresh_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center gap-2">
            <button
              className="flex items-center gap-2 text-gray-700 hover:text-black"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h18v18H3V3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">No Orders Yet</h1>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Browse Products
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            className="flex items-center gap-2 text-gray-700 hover:text-black"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="font-bold text-lg">My Orders</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">Order History</h2>
          <p className="text-gray-500">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status];
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Product Image */}
                  <img
                    src={order.product.image_url || order.product.crop?.image || '/placeholder.svg'}
                    alt={order.product.crop?.crop_name}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />

                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold truncate">{order.product.crop?.crop_name}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold border ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mb-2">
                      {order.quantity} {order.product.unit} • Sold by {order.product.farmer?.name || "Unknown"}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5" />
                        {order.deliveryDetails.city || "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Price & View Button */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 mt-2 sm:mt-0">
                    <p className="text-xl font-bold text-green-800">₹{order.total.toLocaleString()}</p>
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded flex items-center gap-1 hover:bg-gray-200"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Detail Modal */}
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-black"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={24} />
              </button>
              <h2 className="text-xl font-bold mb-4">{selectedOrder.product.crop?.crop_name}</h2>
              <p><strong>Quantity:</strong> {selectedOrder.quantity} {selectedOrder.product.unit}</p>
              <p><strong>Total:</strong> ₹{selectedOrder.total.toLocaleString()}</p>
              <p><strong>Status:</strong> {statusConfig[selectedOrder.status].label}</p>
              <p className="mt-2"><strong>Delivery Address:</strong> {selectedOrder.deliveryDetails.address}, {selectedOrder.deliveryDetails.city}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );

  function handleViewOrder(order: Order) {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }
}
