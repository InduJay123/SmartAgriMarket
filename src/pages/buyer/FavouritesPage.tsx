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
        setFavouriteProducts(favs); // backend should return product objects
      } catch (err) {
        console.error(err);
      }
    };
    loadFavourites();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Favourites</h1>
      <ProductGrid products={favouriteProducts}  />
    </div>
  );
}

export default FavouritesPage;
