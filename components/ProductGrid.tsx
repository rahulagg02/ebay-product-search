import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

type ProductGridProps = {
  items: Product[];
};

export default function ProductGrid({ items }: ProductGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ProductCard key={item.id} product={item} />
      ))}
    </div>
  );
}