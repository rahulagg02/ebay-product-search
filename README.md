# eBay Product Search

This is a small full-stack application I built that lets users search for products using the eBay Browse API.

The goal was to keep things simple, clean, and production-minded — especially around API integration, security, and structuring the backend properly.

---

## What it does

* Lets users search for products (e.g. "iphone")
* Shows results with title, price, condition, image, and link to eBay
* Supports:

  * price filtering (min / max)
  * condition filtering (New / Used)
  * pagination
* Includes loading + error states for a smoother experience

---

## Tech Stack

I used:

* **Next.js (App Router)** for both frontend and backend
* **React + TypeScript**
* **Tailwind CSS** for styling
* **Vitest** for basic unit tests

---

## How it works (high level)

The flow is pretty straightforward:

1. User enters a search query in the UI
2. Frontend calls my backend endpoint: `/api/search`
3. Backend:

   * fetches (or reuses) an OAuth token from eBay
   * calls the eBay Browse API
   * normalizes the response
4. Clean data is sent back to the frontend and rendered

I added a normalization layer so the frontend isn’t tied directly to eBay’s raw response shape.

---

## eBay API details

* Uses OAuth 2.0 (Client Credentials flow)
* Access tokens are cached in memory and reused until expiry
* Credentials are handled only on the backend (never exposed to the client)

Endpoint used:

```
GET /buy/browse/v1/item_summary/search
```

---

## Running locally

### 1. Install dependencies

```bash
npm install
```

### 2. Add environment variables

Create a `.env.local` file:

```env
EBAY_CLIENT_ID=your_client_id
EBAY_CLIENT_SECRET=your_client_secret
EBAY_ENVIRONMENT=production
```

> `.env.local` is ignored in git

### 3. Start the app

```bash
npm run dev
```

Open http://localhost:3000

---

## Running tests

```bash
npm run test
```

I added a couple of unit tests for:

* response normalization
* API input validation

---

## API endpoint

`GET /api/search`

Supports:

* `q` → search query
* `offset` → pagination
* `limit` → number of results
* `minPrice`, `maxPrice` → price filtering
* `condition` → NEW / USED

---

## Sandbox vs Production

I initially tried using the eBay Sandbox environment, but the Browse API was returning internal errors.

The same implementation worked fine with Production credentials, so I used Production for this project.

---

## Tradeoffs

* Used in-memory caching for tokens instead of something persistent (kept it simple for this scope)
* UI is intentionally minimal — focused more on functionality than design polish
* No global state management since the app is small

---

## What I’d improve with more time

* Infinite scroll instead of page-based pagination
* Better filtering (categories, brands, etc.)
* Caching search results to reduce API calls
* More robust error handling / retries
* Integration tests for API routes
* Mobile responsiveness improvements

---

## Notes

One thing I paid attention to was keeping the backend clean:

* separated API logic (`lib/ebay.ts`)
* added a normalization layer (`lib/normalize.ts`)
* kept credentials secure

---

## (Optional) Live Demo

If deployed:

```
https://your-app.vercel.app
```

---

## Author

Rahul Aggarwal
