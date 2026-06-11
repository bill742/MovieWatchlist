import type {
  CastAndCrew,
  Movie,
  MultiSearchItem,
  TVSeason,
  TVShow,
} from "../types";

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

    getMovieCredits(
      id: number | string,
    ): Promise<{ cast: CastAndCrew[]; crew: CastAndCrew[] } | null> {
      return fetchApi(`${baseUrl}/movie/${id}/credits?language=en-US`);
    },

    getNowPlayingMovies(region: string): Promise<Movie[] | null> {
      return fetchApiList<Movie>(
        `${baseUrl}/movie/now_playing?language=en-US&page=1&region=${region}`,
      );
    },

    getTrendingMovies(): Promise<Movie[] | null> {
      return fetchApiList<Movie>(`${baseUrl}/trending/movie/week?language=en-US`);
    },

    // ─── TV ─────────────────────────────────────────────────────────────────

    getTrendingTV(): Promise<TVShow[] | null> {
      return fetchApiList<TVShow>(`${baseUrl}/trending/tv/week?language=en-US`);
    },

    getOnTheAirTV(region: string): Promise<TVShow[] | null> {
      return fetchApiList<TVShow>(
        `${baseUrl}/tv/on_the_air?language=en-US&page=1&region=${region}`,
      );
    },

    getTVShow(id: number | string): Promise<TVShow | null> {
      return fetchApi<TVShow>(`${baseUrl}/tv/${id}?language=en-US`);
    },

    getTVSeason(
      id: number | string,
      seasonNumber: number | string,
    ): Promise<TVSeason | null> {
      return fetchApi<TVSeason>(
        `${baseUrl}/tv/${id}/season/${seasonNumber}?language=en-US`,
      );
    },

    // ─── Search ─────────────────────────────────────────────────────────────

    /** Multi-search across movies and TV (people are filtered out). */
    async multiSearch(term: string): Promise<MultiSearchItem[] | null> {
      const results = await fetchApiList<MultiSearchItem>(
        `${baseUrl}/search/multi?query=${encodeURIComponent(
          term,
        )}&include_adult=false&language=en-US&page=1`,
      );
      return (
        results?.filter(
          (r) => r.media_type === "movie" || r.media_type === "tv",
        ) ?? null
      );
    },
  };
}

export type TmdbClient = ReturnType<typeof createTmdbClient>;
