import { NextResponse } from "next/server";

import type { Movie } from "@/types";

// TMDB data changes slowly, so cache at the CDN. Without this, routing client
// requests through our own routes would mean one TMDB call per visitor.
const CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=600";

/**
 * Wraps a loader result in a JSON response, turning a failed upstream call
 * into a 502 so the client can distinguish "no results" from "TMDB is down".
 */
export function movieListResponse(
  movies: Movie[] | null,
  errorMessage: string
) {
  if (!movies) {
    return NextResponse.json({ error: errorMessage }, { status: 502 });
  }

  return NextResponse.json(movies, {
    headers: { "Cache-Control": CACHE_CONTROL },
  });
}

/**
 * Reads the `region` query param, falling back to US for anything that isn't
 * an ISO 3166-1 alpha-2 code so untrusted input never reaches the TMDB URL.
 */
export function regionFromRequest(request: Request): string {
  const region = new URL(request.url).searchParams.get("region");

  return region && /^[a-z]{2}$/i.test(region) ? region.toUpperCase() : "US";
}
