import { useState, useEffect } from 'react';
import { Search, ShoppingCart, TrendingUp, User,  } from 'lucide-react';
import ProductGrid from './ProductGrid';

import PriceRangeFilter from './PriceRangeFilter';
import { mockProducts, type CartItem, type Product } from '../../lib/supabase';
import Cart from './Cart';

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
    <div className="space-y-6 pt-8">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Buyer Portal</h1>
                  <p className="text-xs text-gray-500">Henri's Market</p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for vegetables, fruits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

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

          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </header>


      {/* Categories & Price Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6">
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

        <PriceRangeFilter priceRange={priceRange} setPriceRange={setPriceRange} maxPrice={maxPrice} />
      </div>

      {/* Products */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : (
        <ProductGrid products={filteredProducts} addToCart={addToCart} />
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
