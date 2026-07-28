import type { Movie } from "@/types";

/**
 * Browser-side counterparts to src/data/loaders.ts.
 *
 * Client components can't call the loaders directly — those hold the TMDB
 * token and are marked `server-only`. These hit our own route handlers under
 * /api instead, and return the same `Movie[] | null` shape.
 */
async function fetchMovies(path: string): Promise<Movie[] | null> {
  try {
    const response = await fetch(path);

    if (!response.ok) {
      console.error(
        `API request failed: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const result: Movie[] = await response.json();
    return result;
  } catch (error) {
    console.error("API fetch error:", error);
    return null;
  }
}

export function getTrendingMovies(): Promise<Movie[] | null> {
  return fetchMovies("/api/movies/trending");
}

export function getNowPlayingMovies(region: string): Promise<Movie[] | null> {
  return fetchMovies(
    `/api/movies/now-playing?region=${encodeURIComponent(region)}`
  );
}

export function getUpcomingMovies(region: string): Promise<Movie[] | null> {
  return fetchMovies(
    `/api/movies/upcoming?region=${encodeURIComponent(region)}`
  );
}

export function getSearchResults(term: string): Promise<Movie[] | null> {
  return fetchMovies(`/api/search?term=${encodeURIComponent(term)}`);
}
