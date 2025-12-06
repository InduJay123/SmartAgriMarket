import { useState, useEffect } from "react";
import ProductPage from "./ProductPage";
import type { Product } from "../../@types/Product";
import { fetchProducts } from "../ProductService";
import { Filter } from "lucide-react";


function BuyerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const handleAddToCart = (productId: number) => {
    console.log("Add product to cart:", productId);
    // Implement your add-to-cart logic here
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="relative rounded-2xl overflow-hidden h-64">
        <img
          src="https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        <div className="relative h-full flex flex-col justify-center p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Fresh From Farm</h2>
          <p className="text-gray-100 mb-4">Get the freshest vegetables delivered to your doorstep</p>
          <button className="bg-transparent border border-white text-white w-auto hover:text-green-600 hover:bg-white px-4 py-2 rounded-lg font-semibold">
            Shop Now
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Filter Products</h3>
          <Filter size={20} className="text-gray-500" />
        </div>

        {/* Categories */}
        <label className="block text-sm font-medium mb-3">Categories</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat, index) => (
            <button
              key={`${cat}-${index}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedCategory === cat
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      <ProductPage
        products={products}
        addToCart={handleAddToCart}
        loading={loading}
      />
    </div>
  </div>
    
  );
}
export default BuyerDashboard;
