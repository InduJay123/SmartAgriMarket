import { useEffect, useState } from 'react';
import { fetchFavourites } from '../../api/favourites';
import type { Product } from '../../@types/Product';
import ProductGrid from '../../components/buyer/ProductGrid';


function FavouritesPage() {
  const [favouriteProducts, setFavouriteProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadFavourites = async () => {
      try {
        const favs = await fetchFavourites();
        setFavouriteProducts(favs);
      } catch (err) {
        console.error(err);
      }
    };
    loadFavourites();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-4xl text-black font-bold px-4 py-2">🔖 Your Favourites</h1>
      <p className="text-md text-gray-500 mb-6 px-4">Keep your frequently used items in one place</p>
      <ProductGrid products={favouriteProducts}  />
    </div>
  );
}

export default FavouritesPage;
