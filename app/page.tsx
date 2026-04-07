"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import ProductGrid from "@/components/ProductGrid";
import Filters from "@/components/Filters";
import { Product, SearchFilters } from "@/lib/types";

type SearchApiResponse = {
  query: string;
  total: number;
  items: Product[];
  error?: string;
};

const PAGE_SIZE = 50;

export default function Home() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    minPrice: "",
    maxPrice: "",
    condition: "",
  });

  const performSearch = async (
    searchQuery: string,
    currentPage: number,
    currentFilters: SearchFilters
  ) => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      setItems([]);
      setTotal(0);
      setError("");
      setSearched(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSearched(true);

      const offset = currentPage * PAGE_SIZE;
      const params = new URLSearchParams({
        q: trimmedQuery,
        offset: String(offset),
        limit: String(PAGE_SIZE),
      });

      if (currentFilters.minPrice) params.set("minPrice", currentFilters.minPrice);
      if (currentFilters.maxPrice) params.set("maxPrice", currentFilters.maxPrice);
      if (currentFilters.condition) params.set("condition", currentFilters.condition);

      const response = await fetch(`/api/search?${params.toString()}`);
      const data: SearchApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setItems([]);
      setTotal(0);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setItems([]);
      setTotal(0);
      setError("");
      setSearched(false);
      return;
    }

    const timeout = setTimeout(() => {
      performSearch(trimmedQuery, page, filters);
    }, 500);

    return () => clearTimeout(timeout);
  }, [query, page, filters]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(0);
  };

  const handleFilterChange = (nextFilters: SearchFilters) => {
    setFilters(nextFilters);
    setPage(0);
  };

  const handleManualSearch = () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setItems([]);
      setTotal(0);
      setError("Please enter a product keyword.");
      setSearched(false);
      return;
    }

    setPage(0);
    performSearch(trimmedQuery, 0, filters);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            eBay Product Search
          </h1>
          <p className="mt-2 text-gray-600">
            Search for products and browse relevant eBay listings.
          </p>
        </div>

        <SearchBar
          query={query}
          onQueryChange={handleQueryChange}
          onSearch={handleManualSearch}
          loading={loading}
        />

        <Filters filters={filters} onChange={handleFilterChange} />

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && searched && !error && items.length === 0 && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 text-gray-600">
            No results found.
          </div>
        )}

        {loading && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 text-gray-600">
            Loading results...
          </div>
        )}

        {!loading && items.length > 0 && (
          <>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600">
                Showing {items.length} results out of {total}.
              </p>
              <p className="text-sm text-gray-600">
                Page {page + 1}
                {totalPages ? ` of ${totalPages}` : ""}
              </p>
            </div>

            <div className="mt-4">
              <ProductGrid items={items} />
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0 || loading}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={loading || (page + 1) * PAGE_SIZE >= total}
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}