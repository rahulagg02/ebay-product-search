import { NextRequest, NextResponse } from "next/server";
import { searchEbay } from "@/lib/ebay";
import { normalizeEbayResponse } from "@/lib/normalize";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q")?.trim();
    const offset = Number(request.nextUrl.searchParams.get("offset") || "0");
    const limit = Number(request.nextUrl.searchParams.get("limit") || "50");
    const minPrice = request.nextUrl.searchParams.get("minPrice")?.trim() || "";
    const maxPrice = request.nextUrl.searchParams.get("maxPrice")?.trim() || "";
    const condition = request.nextUrl.searchParams.get("condition")?.trim() || "";

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required." },
        { status: 400 }
      );
    }

    if (Number.isNaN(offset) || offset < 0) {
      return NextResponse.json(
        { error: "Offset must be a non-negative number." },
        { status: 400 }
      );
    }

    if (Number.isNaN(limit) || limit < 1 || limit > 200) {
      return NextResponse.json(
        { error: "Limit must be between 1 and 200." },
        { status: 400 }
      );
    }

    const ebayData = await searchEbay({
      query,
      offset,
      limit,
      minPrice,
      maxPrice,
      condition,
    });

    const normalized = normalizeEbayResponse(ebayData, query);

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("API route error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to fetch eBay results right now.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}