import { describe, expect, it } from "vitest";
import { normalizeEbayResponse } from "../lib/normalize";

describe("normalizeEbayResponse", () => {
  it("returns normalized items", () => {
    const input = {
      total: 1,
      itemSummaries: [
        {
          itemId: "123",
          title: "iPhone 14",
          price: { value: "699.99", currency: "USD" },
          condition: "New",
          image: { imageUrl: "https://example.com/img.jpg" },
          itemWebUrl: "https://ebay.com/item/123",
        },
      ],
    };

    const result = normalizeEbayResponse(input, "iphone");

    expect(result.query).toBe("iphone");
    expect(result.total).toBe(1);
    expect(result.items[0]).toEqual({
      id: "123",
      title: "iPhone 14",
      price: "699.99",
      currency: "USD",
      condition: "New",
      image: "https://example.com/img.jpg",
      itemWebUrl: "https://ebay.com/item/123",
    });
  });

  it("handles missing fields safely", () => {
    const input = {
      itemSummaries: [{}],
    };

    const result = normalizeEbayResponse(input, "test");

    expect(result.items[0].title).toBe("Untitled item");
    expect(result.items[0].price).toBe("N/A");
    expect(result.items[0].currency).toBe("USD");
    expect(result.items[0].condition).toBe("Unknown");
  });
});