import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import type { CartItem } from '../../lib/supabase';
import { useState } from 'react';

interface CartProps {
  cartItems: CartItem[];
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  cartTotal: number;
  buyerId: string;
  onOrderComplete: () => void;
}

function Cart({
  cartItems,
  showCart,
  setShowCart,
  updateCartQuantity,
  removeFromCart,
  cartTotal,
  buyerId,
  onOrderComplete,
}: CartProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handleCheckout = () => {
    if (!deliveryAddress.trim()) {
      alert('Please enter a delivery address');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const order = {
        id: `order_${Date.now()}`,
        buyer_id: buyerId,
        total_amount: cartTotal,
        status: 'pending',
        delivery_address: deliveryAddress,
        payment_method: paymentMethod,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));

      localStorage.removeItem(`cart_${buyerId}`);

      alert('Order placed successfully!');
      setDeliveryAddress('');
      setShowCart(false);
      onOrderComplete();
      setIsProcessing(false);
    }, 500);
  };

  if (!showCart) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setShowCart(false)}
      />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <ShoppingBag size={24} className="text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
          </div>
          <button
            onClick={() => setShowCart(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Add some products to get started</p>
              <button
                onClick={() => setShowCart(false)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-gray-50 rounded-xl p-4 hover:shadow-md transition"
                >
                  <img
                    src={item.product?.image_url || 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg'}
                    alt={item.product?.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 mb-1">{item.product?.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      ${item.product?.price.toFixed(2)} / {item.product?.unit}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-gray-100 rounded-l-lg transition"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-gray-100 rounded-r-lg transition"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t bg-white p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address
              </label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your delivery address..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="cash">Cash on Delivery</option>
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-4 border-t">
              <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
              <span className="text-2xl font-bold text-green-600">${cartTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
