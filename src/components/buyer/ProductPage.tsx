import { useEffect, useState } from 'react';
import ProductGrid from './ProductGrid';
import type { Product } from '../../@types/Product';

function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products/')
      .then(res => res.json())
      .then((data: Product[]) => {
        const mapped = data.map(item => ({
    ...item,
    price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
  }));
        console.log("Fetched raw data:", data);       

        setProducts(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const addToCart = (productId: string) => {
    console.log("Added to cart:", productId);
  };

  if (loading) return <p>Loading...</p>;

  return <ProductGrid products={products} addToCart={addToCart} />;
}

export default ProductPage;
