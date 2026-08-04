import { NextResponse } from "next/server";

// TMDB data changes slowly, so cache at the CDN. Without this, routing client
// requests through our own routes would mean one TMDB call per visitor.
const CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=600";

/**
 * Wraps a loader result in a JSON response, turning a failed upstream call
 * into a 502 so the client can distinguish "no results" from "TMDB is down".
 *
 * Loaders that treat null as a legitimate value (a show with no trailer)
 * should wrap it in an object before calling this.
 *
 * `varyByQuery` names the query params that change the response. Netlify's CDN
 * narrows the cache key to Next.js's own internal params, so anything else --
 * `term`, `region` -- is ignored unless declared here, and every caller would
 * share one cache entry for the whole s-maxage window.
 */
export function jsonResponse<T>(
  data: T | null,
  errorMessage: string,
  varyByQuery?: string[]
) {
  if (data === null) {
    return NextResponse.json({ error: errorMessage }, { status: 502 });
  }

  const headers: Record<string, string> = { "Cache-Control": CACHE_CONTROL };

  if (varyByQuery?.length) {
    headers["Netlify-Vary"] = `query=${varyByQuery.join("|")}`;
  }

  return NextResponse.json(data, { headers });
}

/**
 * Reads the `region` query param, falling back to US for anything that isn't
 * an ISO 3166-1 alpha-2 code so untrusted input never reaches the TMDB URL.
 */
export function regionFromRequest(request: Request): string {
  const region = new URL(request.url).searchParams.get("region");

  return region && /^[a-z]{2}$/i.test(region) ? region.toUpperCase() : "US";
}

/** TMDB ids are numeric; reject anything else before it reaches the URL. */
export function isValidId(id: string): boolean {
  return /^\d+$/.test(id);
}

export function invalidIdResponse() {
  return NextResponse.json({ error: "Invalid id" }, { status: 400 });
}
