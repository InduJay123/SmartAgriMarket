import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../../@types/Product';
import carbageImg from '../../assets/carbage.png';

interface ProductGridProps {
  products: Product[];
  addToCart: (productId: string) => void;
}

function ProductGrid({ products, addToCart }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-24 h-24 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
        <p className="text-gray-600">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map( product => (
        <div key={product.market_id}
          className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
        >
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <img
              src={product.crop?.image ?? carbageImg }
              alt={product.crop?.crop_name ?? "unknown Crop"}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
              <Star
                size={18}
                className="text-gray-600 hover:text-yellow-500 hover:fill-yellow-500 cursor-pointer transition"
              />
            </div>
            {product.quantity < 20 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Low Stock
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="mb-2">
              <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                {product.category}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{product.crop?.crop_name ?? "unknown"}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.crop?.description || "Unknown"}</p>

            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-gray-900">Rs.{product.price.toFixed(2)}</span>
              <div className="text-sm text-gray-500">
                Stock: <span className="font-semibold text-gray-700">{product.quantity}/{product.unit}</span>
              </div>
            </div>

            <button
              onClick={() => addToCart(product.market_id)}
              disabled={product.quantity === 0}
              className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                product.quantity === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
              }`}
            >
              <ShoppingCart size={18} />
              {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;
