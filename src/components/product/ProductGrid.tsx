import type { Product } from "@/types/catalog";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products, prioritize = 0 }: { products: Product[]; prioritize?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < prioritize} />
      ))}
    </div>
  );
}
