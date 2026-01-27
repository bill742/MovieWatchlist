"use client";

import { useEffect, useState } from "react";

import { MovieList } from "./movie-list";
import { Loader } from "@/components/ui/loader";

import { useRegion } from "@/lib/region-context";
import { getNowPlayingMovies, getUpcomingMovies } from "@/data/loaders";
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
        const nowPlayingData = await getNowPlayingMovies(region);
        if (!nowPlayingData) {
          throw new Error("Failed to fetch now playing movies");
        }
        setNowPlayingMovies(nowPlayingData?.slice(0, 12) || []);

        const upcomingData = await getUpcomingMovies(region);
        if (!upcomingData) {
          throw new Error("Failed to fetch upcoming movies");
        }
        setUpcomingMovies(upcomingData?.slice(0, 12) || []);
      } catch {
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
    return <Loader message="Loading movies..." size="sm" />;
  }

  return (
    <>
      <MovieList movies={nowPlayingMovies} heading="Now Playing" />
      <MovieList movies={upcomingMovies} heading="Upcoming Releases" />
    </>
  );
}
