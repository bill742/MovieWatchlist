"use client";

import { useEffect, useState } from "react";

import { MovieList } from "./movie-list";

import { useRegion } from "@/lib/region-context";
import type { Movie } from "@/types";

export function MovieFetcher() {
  const { region } = useRegion();
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);

      try {
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: process.env.NEXT_PUBLIC_API_KEY || "",
          },
        };

        // Fetch now playing theatrically released movies
        const nowPlayingRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/now_playing?language=en-US&page=1&region=${region}`,
          options
        );
        const nowPlayingData = await nowPlayingRes.json();
        setNowPlayingMovies(nowPlayingData.results?.slice(0, 12) || []);

        // Fetch upcoming movies
        const upcomingRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/upcoming?language=en-US&page=1&region=${region}&sort_by=release_date.asc`,
          options
        );
        const upcomingData = await upcomingRes.json();
        setUpcomingMovies(upcomingData.results?.slice(0, 12) || []);
      } catch (error) {
        // Silently fail - user sees loading state or empty results
        setNowPlayingMovies([]);
        setUpcomingMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [region]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-lg">Loading movies...</div>
      </div>
    );
  }

  return (
    <>
      <MovieList movies={nowPlayingMovies} heading="Now Playing" />
      <MovieList movies={upcomingMovies} heading="Upcoming Releases" />
    </>
  );
}
