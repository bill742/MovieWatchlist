import { cache } from "react";

import { fetchAPI, fetchAPIList } from "@/utils/fetch-apis";
import type { Movie } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const SEARCH_URL = process.env.NEXT_PUBLIC_SEARCH_URL;

// Cached function to fetch movie data - automatically deduplicated by React
export const getMovie = cache(async (id: string): Promise<Movie | null> => {
  if (!BASE_URL) {
    console.error("NEXT_PUBLIC_API_URL is not defined");
    return null;
  }
  const url = `${BASE_URL}/${id}?language=en-US`;

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
  const url = `${BASE_URL}/now_playing?language=en-US&page=1&region=${region}`;
  const nowPlayingRes = await fetchAPIList(url);
  return nowPlayingRes;
};

export const getUpcomingMovies = async (region: string) => {
  if (!BASE_URL) {
    console.error("NEXT_PUBLIC_API_URL is not defined");
    return null;
  }

  const url = `${BASE_URL}/upcoming?language=en-US&page=1&region=${region}`;
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
  if (!SEARCH_URL) {
    console.error("NEXT_PUBLIC_SEARCH_URL is not defined");
    return null;
  }
  const url = `${SEARCH_URL}${term}&include_adult=false&language=en-US&page=1`;
  const searchResults = await fetchAPIList(url);
  return searchResults;
};
