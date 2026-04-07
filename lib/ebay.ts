type TokenCache = {
  accessToken: string;
  expiresAt: number;
} | null;

let tokenCache: TokenCache = null;

function getBaseUrls() {
  const env = process.env.EBAY_ENVIRONMENT || "sandbox";

  if (env === "production") {
    return {
      authUrl: "https://api.ebay.com/identity/v1/oauth2/token",
      apiUrl: "https://api.ebay.com",
    };
  }

  return {
    authUrl: "https://api.sandbox.ebay.com/identity/v1/oauth2/token",
      apiUrl: "https://api.sandbox.ebay.com",
  };
}

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) {
    return tokenCache.accessToken;
  }

  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing eBay credentials in .env.local");
  }

  const { authUrl } = getBaseUrls();

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const response = await fetch(authUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "https://api.ebay.com/oauth/api_scope",
    }),
    cache: "no-store",
  });

  const rawText = await response.text();

  if (!response.ok) {
    throw new Error(`Token request failed (${response.status}): ${rawText}`);
  }

  const data = JSON.parse(rawText);

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return tokenCache.accessToken;
}

type SearchEbayOptions = {
  query: string;
  offset?: number;
  limit?: number;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
};

export async function searchEbay({
  query,
  offset = 0,
  limit = 50,
  minPrice,
  maxPrice,
  condition,
}: SearchEbayOptions) {
  const token = await getAccessToken();
  const { apiUrl } = getBaseUrls();

  const params = new URLSearchParams();
  params.set("q", query);
  params.set("offset", String(offset));
  params.set("limit", String(limit));

  const filterParts: string[] = [];

  if (minPrice || maxPrice) {
    const min = minPrice || "0";
    const max = maxPrice || "";
    filterParts.push(`price:[${min}..${max}]`);
    filterParts.push("priceCurrency:USD");
  }

  if (condition) {
    filterParts.push(`conditions:{${condition}}`);
  }

  if (filterParts.length > 0) {
    params.set("filter", filterParts.join(","));
  }

  const url = `${apiUrl}/buy/browse/v1/item_summary/search?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const rawText = await response.text();

  if (!response.ok) {
    throw new Error(`Search request failed (${response.status}): ${rawText}`);
  }

  return JSON.parse(rawText);
}