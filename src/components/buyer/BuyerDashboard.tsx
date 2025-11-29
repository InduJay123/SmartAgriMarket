import { useState, useEffect } from 'react';

import { ShoppingCart, Search, Filter, Menu, X, User, Heart, TrendingUp } from 'lucide-react';
import ProductGrid from './ProductGrid';
import Cart from './Cart';
import Sidebar from './Sidebar';
import OrderHistory from './OrderHistory';
import BillingInfo from './BillingInfo';
import PriceRangeFilter from './PriceRangeFilter';
import { mockProducts, type CartItem, type Product } from '../../lib/supabase';

type View = 'shop' | 'orders' | 'billing' | 'favorites';

function BuyerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentView, setCurrentView] = useState<View>('shop');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10]);
  const [maxPrice, setMaxPrice] = useState(10);
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    setFilteredProducts(filtered);
  };

  const addToCart = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cartItems.find(item => item.product_id === productId);
    let updatedCart: CartItem[];

    if (existingItem) {
      updatedCart = cartItems.map(item =>
        item.product_id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...cartItems,
        {
          id: `cart_${Date.now()}`,
          buyer_id: buyerId,
          product_id: productId,
          quantity: 1,
          product,
        },
      ];
    }

    setCartItems(updatedCart);
    localStorage.setItem(`cart_${buyerId}`, JSON.stringify(updatedCart));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedCart = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );

    setCartItems(updatedCart);
    localStorage.setItem(`cart_${buyerId}`, JSON.stringify(updatedCart));
  };

  const removeFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem(`cart_${buyerId}`, JSON.stringify(updatedCart));
  };

  const cartTotal = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="bg-gray-50 w-screen">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">SAMMS</h1>
                  <p className="text-xs text-gray-500">Agriculture Market</p>
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

      <div className="mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex gap-6">
          <Sidebar
            currentView={currentView}
            setCurrentView={setCurrentView}
            showMobileMenu={showMobileMenu}
            setShowMobileMenu={setShowMobileMenu}
          />

          <main className="flex-1 min-w-0 pr-28">
            {currentView === 'shop' && (
              <div className="space-y-6 pt-8">
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

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Filter Products</h3>
                    <Filter size={20} className="text-gray-500" />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Categories</label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                              selectedCategory === category
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <PriceRangeFilter
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      maxPrice={maxPrice}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      Available Products ({filteredProducts.length})
                    </h3>
                  </div>

                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-4 text-gray-600">Loading products...</p>
                    </div>
                  ) : (
                    <ProductGrid
                      products={filteredProducts}
                      addToCart={addToCart}
                    />
                  )}
                </div>
              </div>
            )}

            {currentView === 'orders' && <OrderHistory buyerId={buyerId} />}
            {currentView === 'billing' && <BillingInfo buyerId={buyerId} />}
            {currentView === 'favorites' && (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <Heart size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Favorites Yet</h3>
                <p className="text-gray-600">Start adding products to your favorites list</p>
              </div>
            )}
          </main>
        </div>
      </div>

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
}

export default BuyerDashboard;
