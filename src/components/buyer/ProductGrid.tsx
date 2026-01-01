import { Eye, ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../../@types/Product';
import carbageImg from '../../assets/carbage.png';
import { useEffect, useState } from 'react';
import ProductPopup from './ProductPopup';
import PlaceOrder from './PlaceOrder';
import { fetchFavourites, toggleFavourite } from '../../api/favourites';
import { getReviewSummary } from '../../api/reviews';
import avatar from '../../assets/avatar.svg?url'

interface ProductGridProps {
  products: Product[];

}

function ProductGrid({ products }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const [favourites, setFavourites] = useState<number[]>([]);
  const [productRatings, setProductRatings] = useState<Record<number, { avg: number; total: number }>>({});

  useEffect(() => {
  const loadRatings = async () => {
    const ratings: Record<number, { avg: number; total: number }> = {};

    await Promise.all(
      products.map(async (product) => {
        const res = await getReviewSummary(product.market_id);
        ratings[product.market_id] = res;
      })
    );

    setProductRatings(ratings);
  };

  if (products.length) {
    loadRatings();
  }
}, [products]);


  const openOrderPopup = (product: Product) => {
    setSelectedProduct(null);
    setOrderProduct(product);
  };

  useEffect(() => {
    const loadFavourites = async () => {
      try {
        const favs = await fetchFavourites();
        console.log(favs);
        if (Array.isArray(favs)) {
          setFavourites(favs.map((f: any) => f.market_id));
        } else {
          setFavourites([]);
        }
      } catch (err) {
        console.error(err);
        setFavourites([]);
      }
    };
    loadFavourites();
  }, []);
  
  const handleToggleFavourite = async (productId: number) => {
    try {
      const res = await toggleFavourite(productId);
      setFavourites(prev =>
        prev.includes(productId)
          ? prev.filter(id => id !== productId)
          : [...prev, productId]
      );
      console.log(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
        <p className="text-gray-600">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <div
          key={product.market_id}
          className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
        >
          <div className="relative aspect-square overflow-hidden bg-gray-100 group">
            <img
              src={product.image_url || product.image || product.crop?.image || carbageImg}
              alt={product.crop?.crop_name ?? 'Unknown Crop'}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <button
              onClick={() => handleToggleFavourite(product.market_id)}
              className="absolute top-3 right-3 p-1 hover:border-none rounded-full hover:bg-white/50 transition"
            >
              <Star
                className={
                  favourites.includes(product.market_id)
                    ? 'fill-yellow-500 text-yellow-500 w-6 h-6'
                    : 'text-black w-6 h-6'
                }
              />
            </button>

            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-md">
              <img
                src={product.farmer?.profile_image || avatar}
                alt="farmer image"
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-medium text-foreground"> {product.farmer?.fullname} </span>
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                <span className="text-xs font-semibold text-foreground">
                  {productRatings[product.market_id]?.avg?.toFixed(1) ?? "0.0"}
                </span>
              </div>
            </div>
  
            <p className="text-sm">
              ⭐ {productRatings[product.market_id]?.avg ?? 0}
              <span className="text-gray-500 ml-1">
                ({productRatings[product.market_id]?.total ?? 0} reviews)
              </span>
            </p>

            {product.quantity < 20 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Low Stock
              </div>
            )}
          </div>

          <div className="p-2">
            <div className='flex flex-wrap items-center justify-between'>
              <h3 className="text-lg font-bold text-gray-900">
                {product.crop?.crop_name ?? 'Unknown'}
              </h3>
              <p
                className={`text-xs font-semibold px-2 rounded-xl text-black 
                  ${
                    product.farming_season === "Yala"
                      ? "bg-green-300"
                      : product.farming_season === "Maha"
                      ? "bg-orange-300"
                      : "bg-gray-300"
                  }
                `}
              >
                {product.farming_season ?? "Unknown"}
              </p>

            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.additional_details || 'No description'}
            </p>

            <div className="flex flex-wrap items-center justify-between mb-3">
              <span className="text-2xl font-bold text-gray-900">
                Rs.{product.price}
              </span>

              <span className="text-sm text-gray-500">
                Available:{' '}
                <span className="font-semibold">{product.quantity}</span>/
                {product.unit}
              </span>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => setSelectedProduct(product)}
                disabled={product.quantity === 0}
                className={`w-full py-1.5 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                  product.quantity === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-black/90  active:scale-95'
                }`}
              >
                <Eye size={18} />
                {product.quantity === 0 ? 'Out of Stock' : 'View'}    
              </button>
             
            </div>
          </div>
        </div>
      ))}

      {/* PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <ProductPopup
          product={selectedProduct}        
          /*farmer={product.farmer}
          reviews={product.reviews}*/
          onClose={() => setSelectedProduct(null)}
          onPlaceOrder={(product) => {
            openOrderPopup(product);  
          }}
        />
      )}

      {orderProduct && (
        <PlaceOrder
          product={orderProduct}
          onClose={() => setOrderProduct(null)}
        />
      )}
    </div>

  );
}

export default ProductGrid;