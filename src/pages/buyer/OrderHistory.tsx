import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Calendar, Eye } from 'lucide-react';
import axios from 'axios';
import type { Order } from '../../@types/Order';
import OrderDetails from '../../components/buyer/OrderDetails';


function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const buyerId = 1; // You can replace with dynamic ID

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/order/buyer/${buyerId}`);
      setOrders(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpansion = (orderId: number) => {
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
      case 'accepted':
      case 'shipped':
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
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h2>
    </div>

      {orders.map((order) => {
        const isExpanded = expandedOrders.has(order.order_id);

        return (
          <div key={order.order_id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition"
              onClick={() => toggleOrderExpansion(order.order_id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <img 
                    src={order.product_image} 
                    alt="Product"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />                 
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{order.product_name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className='flex flex-wrap gap-4 text-sm text-gray-500'>
                      <p>Quantity: {order.quantity}</p>
                      <p>Sold by: {order.farmer_name}</p>
                    </div>

                    <div className='flex flex-wrap gap-4'>
                      <div className="flex gap-2 text-sm text-gray-500 items-center">
                        <Calendar size={16}/>
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex gap-2 text-sm text-gray-500 items-center">
                        <Package size={16}/>
                        {order.city}
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" gap-4">
                  <div className="flex-1 gap-4 text-right">
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600/">Rs.{order.total_amount}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className='flex items-center gap-2 py-1 px-2 mt-2 font-semibold bg-green-700/90 text-white'>
                      <Eye size={18}/>
                      View Details
                  </button>
                </div>               
              </div>
              
              
            </div>
            {selectedOrder && (
              <OrderDetails
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
              />
            )}
          </div>          
        );
      })}
    </div>
  );
}

export default OrderHistory;
