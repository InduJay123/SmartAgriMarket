import { useState, useEffect } from "react";
import type { Product } from "../../@types/Product";
import { Filter } from "lucide-react";
import { fetchProducts } from "../../api/ProductService";
import ProductPage from "../../components/buyer/ProductPage";
import Cart from "../../components/buyer/Cart";

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

function BuyerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        const normalizedData = data.map((p) => ({
          ...p,
          price: Number(p.price) || 0,
        }));
        setProducts(normalizedData);
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const categories = ["All", "Yala", "Maha"];
  // Add product to cart
  const handleAddToCart = (productId: number) => {
    const product = products.find((p) => p.market_id === productId);
    if (!product) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.market_id === productId);
      if (existing) {
        return prev.map((item) =>
          item.product.market_id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: `cart_${Date.now()}`, product, quantity: 1 }];
    });

    setShowCart(true);
  };

  // Update quantity in cart
  const updateCartQuantity = (itemId: string, quantity: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === itemId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Calculate total
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.product.price || 0) * item.quantity,
    0
  );

  // Reset cart after order
  const handleOrderComplete = () => {
    setCartItems([]);
    setShowCart(false);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden h-64">
        <img
          src="https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        <div className="relative h-full flex flex-col justify-center p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Fresh From Farm</h2>
          <p className="text-gray-100 mb-4">Get the freshest vegetables delivered to your doorstep</p>
          <button className="bg-transparent border border-white text-white w-auto hover:text-green-600 hover:bg-white px-4 py-2 rounded-lg font-semibold w-fit">
            Shop Now
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold">Filter Products</h3>
          <Filter size={20} className="text-gray-500" />
        </div>

        <label className="block text-sm font-medium mb-3">Categories</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat, index) => (
            <button
              key={`${cat}-${index}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedCategory === cat
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product List */}
        <ProductPage
          products={products.filter(
            (p) => selectedCategory === "all" || p.category === selectedCategory
          )}
          addToCart={handleAddToCart}
          loading={loading}
          cartItems={cartItems}
        />

        {/* Cart */}
        <Cart
          cartItems={cartItems}
          showCart={showCart}
          setShowCart={setShowCart}
          updateCartQuantity={updateCartQuantity}
          removeFromCart={removeFromCart}
          cartTotal={cartTotal}
          buyerId="buyer_1"
          onOrderComplete={handleOrderComplete}
        />
      </div>
    </div>
  );
}

export default BuyerDashboard;