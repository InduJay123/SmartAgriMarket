import { useEffect, useState } from 'react';

import { Package, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { Order, OrderItem } from '../../lib/supabase';

interface OrderHistoryProps {
  buyerId: string;
}

function OrderHistory({ buyerId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<{ [key: string]: OrderItem[] }>({});
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setTimeout(() => {
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const buyerOrders = allOrders.filter((order: Order) => order.buyer_id === buyerId);
      setOrders(buyerOrders);

      const itemsMap: { [key: string]: OrderItem[] } = {};
      buyerOrders.forEach((order: Order) => {
        itemsMap[order.id] = [];
      });
      setOrderItems(itemsMap);
      setLoading(false);
    }, 300);
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-600" size={20} />;
      case 'confirmed':
      case 'delivered':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-600" size={20} />;
      default:
        return <Package className="text-gray-600" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <Package size={64} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
        <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order History</h2>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>

      {orders.map((order) => {
        const isExpanded = expandedOrders.has(order.id);
        const items = orderItems[order.id] || [];

        return (
          <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition"
              onClick={() => toggleOrderExpansion(order.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="bg-green-100 p-3 rounded-lg">
                    {getStatusIcon(order.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">Order #{order.id.slice(0, 8)}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      Payment: <span className="font-semibold">{order.payment_method}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">${order.total_amount.toFixed(2)}</p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </button>
                </div>
              </div>

              {order.delivery_address && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Delivery Address:</p>
                  <p className="text-sm text-gray-600">{order.delivery_address}</p>
                </div>
              )}
            </div>

            {isExpanded && items.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <h4 className="font-bold text-gray-900 mb-4">Order Items</h4>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-white rounded-lg p-4">
                      <img
                        src={item.product?.image_url || 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg'}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h5 className="font-bold text-gray-900">{item.product?.name}</h5>
                        <p className="text-sm text-gray-600">
                          ${item.price_at_purchase.toFixed(2)} × {item.quantity} {item.product?.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ${(item.price_at_purchase * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default OrderHistory;
