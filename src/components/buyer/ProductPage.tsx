import { useState, useMemo } from "react";
import ProductGrid from "./ProductGrid";
import PriceRangeFilter from "./PriceRangeFilter";
import type { Product } from "../../@types/Product";

interface ProductPageProps {
  products: Product[];
  addToCart: (productId: number) => void;
  loading: boolean;
}

function ProductPage({ products, addToCart, loading }: ProductPageProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);

  const maxPrice = useMemo(() => {
    const prices = products.map((p) => p.price);
    const max = prices.length ? Math.max(...prices) : 0;
    if (priceRange[1] === 0) setPriceRange([0, max]);
    return max;
  }, [products]);

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
      ),
    [products, priceRange]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] flex-col">
        <div className="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PriceRangeFilter
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        maxPrice={maxPrice}
      />
      <ProductGrid products={filteredProducts}  addToCart={addToCart} />
    </div>
  );
}

export default ProductPage;
