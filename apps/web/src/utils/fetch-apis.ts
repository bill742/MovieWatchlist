import "server-only";

import type { Movie } from "@/types";

/**
 * How long a TMDB response stays fresh in Next's data cache.
 *
 * This matters more than it looks. Since Next 15 `fetch` defaults to
 * `no-store`, and a single uncached fetch opts its whole route into dynamic
 * rendering — which is why every page in this app was server-rendered per
 * request, and why `export const revalidate` on the detail pages did nothing
 * until this was set. An hour is well inside how often TMDB list data moves.
 */
const TMDB_REVALIDATE_SECONDS = 3600;

/**
 * Request options shared by every TMDB call.
 *
 * TMDB_API_KEY is deliberately not prefixed with NEXT_PUBLIC_ — the read
 * access token must stay on the server. Client components reach TMDB through
 * the route handlers in src/app/api instead. The `server-only` import above
 * turns an accidental client import of this module into a build error.
 */
export function tmdbRequestOptions(
  revalidate: number = TMDB_REVALIDATE_SECONDS
): RequestInit {
  return {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_KEY || ""}`,
      accept: "application/json",
    },
    method: "GET",
    next: { revalidate },
  };
}

/**
 * Generic API fetch utility for single resource endpoints
 * @param url - The full URL to fetch from
 * @returns Promise resolving to the fetched data or null on error
 */
export async function fetchAPI<T = Movie>(url: string): Promise<T | null> {
  const options = tmdbRequestOptions();

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      console.error(
        `API request failed: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const result: T = await response.json();
    return result;
  } catch (error) {
    console.error("API fetch error:", error);
    return null;
  }
}

/**
 * API fetch utility for TMDB list endpoints that return paginated results
 * @param url - The full URL to fetch from
 * @returns Promise resolving to array of results or null on error
 */
export async function fetchAPIList<T = Movie>(
  url: string
): Promise<T[] | null> {
  const options = tmdbRequestOptions();

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      console.error(
        `API request failed: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const result: { results: T[] } = await response.json();
    return result.results || [];
  } catch (error) {
    console.error("API fetch error:", error);
    return null;
  }
}
