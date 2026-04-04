# Cosmic Explorer

Explore the wondrous universe through NASA's Astronomy Picture of the Day (APOD) API.

## Setup Instructions

Retrieve the repository, install dependencies, and spin up a development server in just 4 commands:

```bash
# 1. Clone the repository
git clone https://github.com/sammy-code98/frontned-assessment-samuel-uzor.git cosmic-explorer

# 2. Enter the project directory
cd cosmic-explorer

# 3. Install packages
npm install

# 4. Start the development server (uses DEMO_KEY by default)
npm run dev
```

Visit `http://localhost:3000` via your browser to view the application.

*Note: If you have a custom NASA API Key, you can optionally create an `.env.local` file at the root before starting the server with `NEXT_PUBLIC_NASA_API_KEY=YourKeyHere`.*

## Architecture Decisions

The codebase uses the **Next.js App Router**, leaning towards a **Client-Side Rendering (CSR)** paradigm with **TanStack React Query** handling the data layer.

**Why CSR over SSR?**
During initial development, the deployment server environment exhibited significant network egress restrictions, leading to `ETIMEDOUT` timeouts when Node.js attempted to fetch from `api.nasa.gov`. To ensure absolute uptime and functionality, I migrated all API fetching from Server Components directly into Client Components. This successfully bypassed the network blocker by pushing network requests into the user's browser runtime.

Below is an example of the error encounterd

``` bash
error

34 |   const res = await fetch(url);
     |               ^
  35 |   if (!res.ok) {
  36 |     throw new Error(Failed to fetch APODs: ${res.statusText});
  37 |   } {
  digest: '648839725',
  [cause]: AggregateError: 
      at ignore-listed frames {
    code: 'ETIMEDOUT',
    [errors]: [ [Error], [Error], [Error], [Error] ]
  }
}
 GET / 200 in 776ms (next.js: 16ms, application-code: 761ms)
[browser] Application error: TypeError: fetch failed
    at fetchApodsByRange (lib/apod.ts:34:15)
    at HomePage (app/page.tsx:36:30)
  32 |   console.log([APOD API] Fetching range: ${startDate} to ${endDate});
  33 |
34 |   const res = await fetch(url);
     |               ^
  35 |   if (!res.ok) {
  36 |     throw new Error(Failed to fetch APODs: ${res.statusText});
  37 |   } (app/error.tsx:14:13)
[browser] Application error: TypeError: fetch failed
    at fetchApodsByRange (lib/apod.ts:34:15)
    at HomePage (app/page.tsx:36:30)
  32 |   console.log([APOD API] Fetching range: ${startDate} to ${endDate});
  33 |
34 |   const res = await fetch(url);
     |               ^
  35 |   if (!res.ok) {
  36 |     throw new Error(Failed to fetch APODs: ${res.statusText});
  37 |   } (app/error.tsx:14:13)

  ```

**Directory Structure:**
- `app/` is strictly for structural routing layers and layout bounds.
- `components/apod/` houses domain-specific structural UI pieces.
- `components/ui/` contains generic, highly reusable design blocks (`card.tsx`).
- `lib/` and `hooks/` decouple state, parameters, and fetch logic out of React templates.

## Performance Optimizations

1. **Client-side Caching (React Query):** APOD API responses are aggressively cached. Navigating back and forth between the grid list and a detailed view requires zero redundant network round-trips, ensuring instantaneous transitions.
2. **Debounced Search:** The `useSearch` hook internally uses `useDebounce` to delay executing heavy client-side filtering while the user rapidly typings out search queries, protecting the main thread from locking up.
3. **Optimized Imagery & Defensive Fallbacks:** Thumbnails use Next's `<Image />` component sized defensively using viewport sizing (`sizes="(max-width: 1024px) 100vw, 50vw"`). Furthermore, a custom `onError` event handler watches for broken links/404s and rapidly substitutes an aesthetic local placeholder ensuring the UI layout remains pristine.
4. **Chunked Infinite Pagination:** Rather than requesting years of high-poly imagery in one heavy initial payload, the interface sequentially paginates 30-day chunks intelligently on-demand using `useInfiniteQuery`.

## Trade-offs and Known Limitations

- **SEO Limitations:** Because data-fetching was pushed to the client browser (React Query) to circumvent deployment network timeouts, web crawlers will struggle to index the APOD descriptions. **With more time (and an unrestricted server),** I would leverage Next.js's Server Components and `hydrationData` to pre-fetch and statically render the data server-side.
- **Handling Native `.mp4` URLs:** When the APOD API infrequently returns a raw `.mp4` video string instead of an image URL/IFrame, it currently occasionally triggers a Next.js 500 Optimization Error in the server terminal logs because Next `Image` does not support processing pure video encodings. **With more time**, I would write a comprehensive data-transform layer to cleanly categorize and render these edge-case items differently.

## Bonus Tasks Attempted

**Bonus 1: URL State Syncing**
- **What:** Filter parameters perfectly intertwine with browser URL query parameters without wiping page history.
- **Verify:** Type "nebula" into the search box and select "Images Only". Note the URL changes to `/?query=nebula&mediaType=image`. If you copy that URL and open it in an incognito window, the grid precisely replicates that filtered state.

**Bonus 2: Load More / Infinite Pagination**
- **What:** The APOD API uses strict `start_date` and `end_date` configurations instead of classic `offset`/`limit`. I successfully mapped this pattern into a paginated 'Load More' sequence.
- **Verify:** Scroll to the bottom of the first grid view. Click "Load Older Discoveries" and watch the query hook accurately calculate dates, pull down a new chunk of history seamlessly, and safely halt if attempting to fetch prior to the APOD inception date (June 16, 1995).
