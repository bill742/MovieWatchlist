import { cache } from "react";

import { fetchAPI, fetchAPIList } from "@/utils/fetch-apis";

import type { CastAndCrew,Movie } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Cached function to fetch movie data - automatically deduplicated by React
export const getMovie = cache(async (id: string): Promise<Movie | null> => {
  if (!BASE_URL) {
    console.error("NEXT_PUBLIC_API_URL is not defined");
    return null;
  }
  const url = `${BASE_URL}/movie/${id}?language=en-US`;

  const movie = await fetchAPI<Movie>(url);

  if (!movie) {
    console.error(`Failed to fetch movie with ID: ${id}`);
  }

  return movie;
});

export const getCastAndCrew = cache(
  async (
    id: string
  ): Promise<{ cast: CastAndCrew[]; crew: CastAndCrew[] } | null> => {
    if (!BASE_URL) {
      console.error("NEXT_PUBLIC_API_URL is not defined");
      return null;
    }
    const url = `${BASE_URL}/movie/${id}/credits?language=en-US`;

    const credits = await fetchAPI<{
      cast: CastAndCrew[];
      crew: CastAndCrew[];
    }>(url);

    if (!credits) {
      console.error(`Failed to fetch credits for movie with ID: ${id}`);
      return null;
    }

    return credits;
  }
);

/**
 * Fetches currently playing movies from TMDB API
 * @param region - ISO 3166-1 country code (e.g., "US", "CA", "GB")
 * @returns Array of movies or null if request fails
 */
export const getNowPlayingMovies = cache(
  async (region: string): Promise<Movie[] | null> => {
    if (!BASE_URL) {
      console.error("NEXT_PUBLIC_API_URL is not defined");
      return null;
    }
    const url = `${BASE_URL}/movie/now_playing?language=en-US&page=1&region=${region}`;
    const nowPlayingRes = await fetchAPIList<Movie>(url);
    return nowPlayingRes;
  }
);

/**
 * Fetches upcoming movies from TMDB API
 * Filters to show only movies releasing tomorrow or later
 * @param region - ISO 3166-1 country code (e.g., "US", "CA", "GB")
 * @returns Array of movies sorted by release date or null if request fails
 */
export const getUpcomingMovies = cache(
  async (region: string): Promise<Movie[] | null> => {
    if (!BASE_URL) {
      console.error("NEXT_PUBLIC_API_URL is not defined");
      return null;
    }

    const url = `${BASE_URL}/movie/upcoming?language=en-US&page=1&region=${region}`;
    const upcomingRes = await fetchAPIList<Movie>(url);

    if (!upcomingRes) {
      return null;
    }

    // Get tomorrow's date (start of day in local timezone)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // Filter movies that have release dates on or after tomorrow
    const filteredMovies = upcomingRes.filter((movie) => {
      if (!movie.release_date) return false;
      const releaseDate = new Date(movie.release_date);
      return releaseDate >= tomorrow;
    });

    // Sort by release date ascending
    filteredMovies.sort((a, b) => {
      const dateA = new Date(a.release_date).getTime();
      const dateB = new Date(b.release_date).getTime();
      return dateA - dateB;
    });

    return filteredMovies;
  }
);

/**
 * Searches for movies by title on TMDB API
 * @param term - Search query string
 * @returns Array of matching movies or null if request fails
 */
export const getSearchResults = cache(
  async (term: string): Promise<Movie[] | null> => {
    if (!BASE_URL) {
      console.error("NEXT_PUBLIC_API_URL is not defined");
      return null;
    }
    const url = `${BASE_URL}/search/movie?query=${term}&include_adult=false&language=en-US&page=1`;
    const searchResults = await fetchAPIList<Movie>(url);

    if (!searchResults) {
      return null;
    }

    return searchResults;
  }
);

/**
 * Fetches trending movies for the current week from TMDB API
 * @returns Array of trending movies or null if request fails
 */
export const getTrendingMovies = cache(async (): Promise<Movie[] | null> => {
  if (!BASE_URL) {
    console.error("NEXT_PUBLIC_API_URL is not defined");
    return null;
  }
  const url = `${BASE_URL}/trending/movie/week?language=en-US`;
  const trendingRes = await fetchAPIList<Movie>(url);
  return trendingRes;
});

/**
 * Fetches movie trailers/videos from TMDB API
 * Prioritizes official trailers, falls back to teasers
 */
export const getMovieTrailer = cache(
  async (movieId: string): Promise<string | null> => {
    try {
      const url = `${BASE_URL}/movie/${movieId}/videos?language=en-US`;

      const response = await fetch(url, {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_API_KEY || "",
          accept: "application/json",
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const videos = data.results || [];

      // Find official trailer (YouTube only)
      const trailer = videos.find(
        (video: {
          site: string;
          type: string;
          official: boolean;
          size: number;
        }) =>
          video.site === "YouTube" &&
          (video.type === "Trailer" || video.type === "Teaser") &&
          video.official === true &&
          video.size === 1080
      );

      return trailer?.key || null;
    } catch {
      return null;
    }
  }
);
