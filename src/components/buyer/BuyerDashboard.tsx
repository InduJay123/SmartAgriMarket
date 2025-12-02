import { useState, useEffect } from 'react';
import PriceRangeFilter from './PriceRangeFilter';
import { mockProducts, type CartItem, type Product } from '../../lib/supabase';
import Cart from './Cart';
import { Filter } from 'lucide-react';
import ProductPage from './ProductPage';

const BuyerShop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10]);
  const [maxPrice, setMaxPrice] = useState(10);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const buyerId = 'demo-buyer-id';

  useEffect(() => {
    fetchProducts();
    fetchCartItems();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory, priceRange]);

  const fetchProducts = () => {
    setTimeout(() => {
      setProducts(mockProducts);
      const max = Math.max(...mockProducts.map(p => p.price));
      setMaxPrice(Math.ceil(max));
      setPriceRange([0, Math.ceil(max)]);
      setLoading(false);
    }, 300);
  };

  const fetchCartItems = () => {
    const savedCart = localStorage.getItem(`cart_${buyerId}`);
    if (savedCart) setCartItems(JSON.parse(savedCart));
  };

  const filterProducts = () => {
    let filtered = products;
    if (searchQuery) filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (selectedCategory !== 'all') filtered = filtered.filter(p => p.category === selectedCategory);
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    setFilteredProducts(filtered);
  };

  const addToCart = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cartItems.find(item => item.product_id === productId);
    const updatedCart = existingItem
      ? cartItems.map(item => item.product_id === productId ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cartItems, { id: `cart_${Date.now()}`, buyer_id: buyerId, product_id: productId, quantity: 1, product }];

    setCartItems(updatedCart);
    localStorage.setItem(`cart_${buyerId}`, JSON.stringify(updatedCart));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    const updatedCart = cartItems.map(item => item.id === itemId ? { ...item, quantity } : item);
    setCartItems(updatedCart);
    localStorage.setItem(`cart_${buyerId}`, JSON.stringify(updatedCart));
  };

  const removeFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem(`cart_${buyerId}`, JSON.stringify(updatedCart));
  };

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-6 pt-4">
        <div className="relative rounded-2xl overflow-hidden h-64">
          <img
            src="https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg"
            alt="Fresh vegetables"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
            <div className="relative h-full flex flex-col justify-center p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Fresh From Farm</h2>
                <p className="text-gray-100 mb-4">Get the freshest vegetables delivered to your doorstep</p>
                  <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition w-fit">
                    Shop Now
                  </button>
            </div>
          </div>
        </div>


      {/* Categories & Price Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Filter Products</h3>
          <Filter size={20} className="text-gray-500" />
        </div>

      <div className="space-y-6">
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Categories</label>
  
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedCategory === cat ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>
        <PriceRangeFilter priceRange={priceRange} setPriceRange={setPriceRange} maxPrice={maxPrice} />
      </div>
    </div>
      {/* Products */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : (
        <ProductPage/>
      )}

      {/* Cart */}
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

export default BuyerShop;