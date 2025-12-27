import { useEffect, useState } from "react";
import { fetchFarmerOrders } from "../../api/farmer/orders";
import { type Order } from "../../@types/Order";

const FarmerOrders:React.FC = ()  => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // TEMP: until authentication is added
  const farmerId = localStorage.getItem("farmer_id") || 1;

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchFarmerOrders(farmerId);
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [farmerId]);

  if (loading) {
    return <p className="text-center mt-10">Loading orders...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders Received</h1>

      {orders.length === 0 ? (
        <p>No orders received yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Buyer</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id} className="text-center">
                  <td className="p-2 border">
                    <div className="flex items-center gap-2">
                      <img
                        src={order.product_image}
                        alt={order.product_name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <span>{order.product_name}</span>
                    </div>
                  </td>

                  <td className="p-2 border">{order.quantity}</td>
                  <td className="p-2 border">Rs. {order.price_at_order}</td>
                  <td className="p-2 border font-semibold">
                    Rs. {order.total_amount}
                  </td>
                  <td className="p-2 border">{order.full_name}</td>

                  <td className="p-2 border">
                    <span className="px-2 py-1 rounded bg-yellow-200 text-sm">
                      {order.status}
                    </span>
                  </td>

                  <td className="p-2 border">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FarmerOrders;