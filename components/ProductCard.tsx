import { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex h-48 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-sm text-gray-500">No image available</span>
        )}
      </div>

      <h2 className="line-clamp-2 min-h-[56px] text-lg font-semibold text-gray-900">
        {product.title}
      </h2>

      <p className="mt-3 text-base font-medium text-gray-800">
        {product.price} {product.currency}
      </p>

      <p className="mt-1 text-sm text-gray-600">
        Condition: {product.condition}
      </p>

      <a
        href={product.itemWebUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
      >
        View listing
      </a>
    </div>
  );
}