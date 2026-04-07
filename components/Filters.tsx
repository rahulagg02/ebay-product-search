import { SearchFilters } from "@/lib/types";

type FiltersProps = {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
};

export default function Filters({ filters, onChange }: FiltersProps) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      <input
        type="number"
        min="0"
        placeholder="Min price"
        value={filters.minPrice}
        onChange={(e) =>
          onChange({ ...filters, minPrice: e.target.value })
        }
        className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-black"
      />

      <input
        type="number"
        min="0"
        placeholder="Max price"
        value={filters.maxPrice}
        onChange={(e) =>
          onChange({ ...filters, maxPrice: e.target.value })
        }
        className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-black"
      />

      <select
        value={filters.condition}
        onChange={(e) =>
          onChange({ ...filters, condition: e.target.value })
        }
        className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-black"
      >
        <option value="">All conditions</option>
        <option value="NEW">New</option>
        <option value="USED">Used</option>
      </select>
    </div>
  );
}