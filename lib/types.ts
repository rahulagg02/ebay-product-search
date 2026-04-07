export type Product = {
  id: string;
  title: string;
  price: string;
  currency: string;
  condition: string;
  image: string | null;
  itemWebUrl: string;
};

export type SearchResponse = {
  query: string;
  total: number;
  items: Product[];
};

export type SearchFilters = {
  minPrice: string;
  maxPrice: string;
  condition: string;
};