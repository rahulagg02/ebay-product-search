import { Product } from "./types";

type EbayItemSummary = {
  itemId?: string;
  title?: string;
  price?: {
    value?: string;
    currency?: string;
  };
  condition?: string;
  image?: {
    imageUrl?: string;
  };
  thumbnailImages?: Array<{
    imageUrl?: string;
  }>;
  itemWebUrl?: string;
};

type EbayBrowseResponse = {
  itemSummaries?: EbayItemSummary[];
  total?: number;
};

export function normalizeEbayResponse(
  data: EbayBrowseResponse,
  query: string
) {
  const items: Product[] = (data.itemSummaries || []).map((item) => ({
    id: item.itemId || crypto.randomUUID(),
    title: item.title || "Untitled item",
    price: item.price?.value || "N/A",
    currency: item.price?.currency || "USD",
    condition: item.condition || "Unknown",
    image: item.image?.imageUrl || item.thumbnailImages?.[0]?.imageUrl || null,
    itemWebUrl: item.itemWebUrl || "#",
  }));

  return {
    query,
    total: data.total || items.length,
    items,
  };
}