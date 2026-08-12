import type { Movie, MultiSearchItem, TVShow } from "@/types";

/**
 * Browser-side counterparts to src/data/loaders.ts and src/data/tv-loaders.ts.
 *
 * Client components can't call the loaders directly — those hold the TMDB
 * token and are marked `server-only`. These hit our own route handlers under
 * /api instead, and return the same shapes as the loaders they mirror.
 */
async function fetchJSON<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(path);

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

/** Trailer routes wrap the key so a missing trailer isn't an error response. */
async function fetchTrailerKey(path: string): Promise<string | null> {
  const result = await fetchJSON<{ key: string | null }>(path);

  return result?.key ?? null;
}

export function getTrendingMovies(): Promise<Movie[] | null> {
  return fetchJSON<Movie[]>("/api/movies/trending");
}

export function getNowPlayingMovies(region: string): Promise<Movie[] | null> {
  return fetchJSON<Movie[]>(
    `/api/movies/now-playing?region=${encodeURIComponent(region)}`
  );
}

export function getReleaseRows(
  region: string
): Promise<{ digital: Movie[]; theatrical: Movie[] } | null> {
  return fetchJSON(`/api/movies/releases?region=${encodeURIComponent(region)}`);
}

export function getUpcomingMovies(region: string): Promise<Movie[] | null> {
  return fetchJSON<Movie[]>(
    `/api/movies/upcoming?region=${encodeURIComponent(region)}`
  );
}

export function getMovie(id: string): Promise<Movie | null> {
  return fetchJSON<Movie>(`/api/movies/${encodeURIComponent(id)}`);
}

export function getMovieTrailer(id: string): Promise<string | null> {
  return fetchTrailerKey(`/api/movies/${encodeURIComponent(id)}/trailer`);
}

export function getSearchResults(
  term: string
): Promise<MultiSearchItem[] | null> {
  return fetchJSON<MultiSearchItem[]>(
    `/api/search?term=${encodeURIComponent(term)}`
  );
}

export function getTrendingTV(): Promise<TVShow[] | null> {
  return fetchJSON<TVShow[]>("/api/tv/trending");
}

export function getOnTheAirTV(region: string): Promise<TVShow[] | null> {
  return fetchJSON<TVShow[]>(
    `/api/tv/on-the-air?region=${encodeURIComponent(region)}`
  );
}

export function getTVShow(id: string): Promise<TVShow | null> {
  return fetchJSON<TVShow>(`/api/tv/${encodeURIComponent(id)}`);
}

export function getTVTrailer(id: string): Promise<string | null> {
  return fetchTrailerKey(`/api/tv/${encodeURIComponent(id)}/trailer`);
}
