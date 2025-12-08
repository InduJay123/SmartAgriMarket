import { useState, useEffect } from "react";
import { Menu, User, TrendingUp, ShoppingCart, Search } from "lucide-react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/buyer/Sidebar";
import Cart from "../components/buyer/Cart";
import { type CartItem } from "../lib/supabase";

const BuyerSideBarLayout: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const buyerId = "demo-buyer-id";

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`cart_${buyerId}`);
    if (saved) {
      try {
        const parsed: CartItem[] = JSON.parse(saved).map((item) => ({
          ...item,
          quantity: Number(item.quantity) || 0, // ensure quantity is a number
        }));
        setCartItems(parsed);
      } catch (err) {
        console.error("Failed to parse cart from localStorage:", err);
        setCartItems([]);
      }
    }
  }, [buyerId]);

  // Cart count safely computed
  const cartCount = cartItems.reduce(
    (sum, item) => sum + (item?.quantity || 0),
    0
  );

  // Update quantity
  const updateCartQuantity = (itemId: string, newQty: number) => {
    if (newQty < 1) return;

    const updated = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQty } : item
    );
    setCartItems(updated);
    localStorage.setItem(`cart_${buyerId}`, JSON.stringify(updated));
  };

  // Remove item
  const removeFromCart = (itemId: string) => {
    const updated = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updated);
    localStorage.setItem(`cart_${buyerId}`, JSON.stringify(updated));
  };

  // Cart total
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
    0
  );

  // Refresh cart (after order)
  const fetchCartItems = () => {
    const saved = localStorage.getItem(`cart_${buyerId}`);
    if (saved) {
      const parsed: CartItem[] = JSON.parse(saved).map((item) => ({
        ...item,
        quantity: Number(item.quantity) || 0,
      }));
      setCartItems(parsed);
    } else {
      setCartItems([]);
    }
  };

  return (
    <div className="w-screen bg-gray-50 flex flex-col justify-between">
      {/* NAVBAR */}
      <header className="bg-white shadow-sm sticky top-0 z-40 px-4">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu size={24} />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Buyer Portal</h1>
                  <p className="text-xs text-gray-500">Henrri's Market</p>
                </div>
              </div>
            </div>

            {/* CENTER: SEARCH */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for vegetables, fruits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* RIGHT: Account + Cart */}
            <div className="flex items-center gap-4">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <User size={20} />
                <span className="text-sm font-medium">Account</span>
              </button>

              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <div className="flex flex-1 min-h-0">
        <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
        <main className="flex-1 overflow-auto min-h-0 pl-10 pr-40">
          <Outlet />
        </main>
      </div>

      {/* CART MODAL */}
      <Cart
        cartItems={cartItems}
        showCart={showCart}
        setShowCart={setShowCart}
        updateCartQuantity={updateCartQuantity}
        removeFromCart={removeFromCart}
        cartTotal={cartTotal}
        buyerId={buyerId}
        onOrderComplete={fetchCartItems}
      />
    </div>
  );
};

export default BuyerSideBarLayout;
