import { cache } from "react";

import { fetchAPI, fetchAPIList } from "@/utils/fetch-apis";
import type { Movie } from "@/types";

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

export const getNowPlayingMovies = async (region: string) => {
  if (!BASE_URL) {
    console.error("NEXT_PUBLIC_API_URL is not defined");
    return null;
  }
  const url = `${BASE_URL}/movie/now_playing?language=en-US&page=1&region=${region}`;
  const nowPlayingRes = await fetchAPIList(url);
  return nowPlayingRes;
};

export const getUpcomingMovies = async (region: string) => {
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
};

export const getSearchResults = async (term: string) => {
  if (!BASE_URL) {
    console.error("NEXT_PUBLIC_API_URL is not defined");
    return null;
  }
  const url = `${BASE_URL}/search/movie?query=${term}&include_adult=false&language=en-US&page=1`;
  const searchResults = await fetchAPIList(url);
  return searchResults;
};

export const getTrendingMovies = cache(async (): Promise<Movie[] | null> => {
  // Get trending movies for the week
  const url = `${BASE_URL}/trending/movie/week?language=en-US`;
  const trendingRes = await fetchAPIList<Movie>(url);
  return trendingRes;
});

/**
 * Fetches movie trailers/videos from TMDB API
 * Prioritizes official trailers, falls back to teasers
 */
export const getMovieTrailer = cache(
  async (movieId: number): Promise<string | null> => {
    try {
      const url = `${BASE_URL}/movie/${movieId}/videos?language=en-US`;

      const response = await fetch(url, {
        headers: {
          accept: "application/json",
          Authorization: process.env.NEXT_PUBLIC_API_KEY || "",
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
