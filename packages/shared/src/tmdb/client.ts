import type { Movie } from "../types";

// ─── Configuration ────────────────────────────────────────────────────────────

export interface TmdbClientConfig {
  /** TMDB API base URL, e.g. "https://api.themoviedb.org/3". */
  baseUrl: string;
  /** Authorization header value, e.g. "Bearer <token>". */
  bearerToken: string;
  /** TMDB image base, e.g. "https://image.tmdb.org/t/p/". */
  imageBase: string;
}

/**
 * Framework-agnostic TMDB client shared across apps (web + mobile).
 *
 * Deliberately free of any framework coupling: no React `cache()`, no
 * `process.env` reads. Pass config in so each app can wire its own env vars
 * (`NEXT_PUBLIC_*` on web, `EXPO_PUBLIC_*` on mobile). Loaders return `null` on
 * failure rather than throwing — same contract as the web data loaders.
 */
export function createTmdbClient({
  baseUrl,
  bearerToken,
  imageBase,
}: TmdbClientConfig) {
  const headers = {
    Authorization: bearerToken,
    accept: "application/json",
  };

  async function fetchApi<T>(url: string): Promise<T | null> {
    try {
      const response = await fetch(url, { headers, method: "GET" });
      if (!response.ok) {
        console.error(
          `TMDB request failed: ${response.status} ${response.statusText}`,
        );
        return null;
      }
      return (await response.json()) as T;
    } catch (error) {
      console.error("TMDB fetch error:", error);
      return null;
    }
  }

  async function fetchApiList<T>(url: string): Promise<T[] | null> {
    const result = await fetchApi<{ results: T[] }>(url);
    return result?.results ?? null;
  }

  return {
    /** Build a full image URL from a TMDB path, e.g. imageUrl(poster_path, "w500"). */
    imageUrl(path: string | null, size = "w500"): string | null {
      if (!path) return null;
      return `${imageBase}${size}${path}`;
    },

    getMovie(id: number | string): Promise<Movie | null> {
      return fetchApi<Movie>(`${baseUrl}/movie/${id}?language=en-US`);
    },

    getNowPlayingMovies(region: string): Promise<Movie[] | null> {
      return fetchApiList<Movie>(
        `${baseUrl}/movie/now_playing?language=en-US&page=1&region=${region}`,
      );
    },

    getTrendingMovies(): Promise<Movie[] | null> {
      return fetchApiList<Movie>(`${baseUrl}/trending/movie/week?language=en-US`);
    },
  };
}

export type TmdbClient = ReturnType<typeof createTmdbClient>;
