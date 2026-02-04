"use client";

import { useEffect, useState } from "react";

import { HeroBanner } from "@/components/hero/hero-banner";
import { Loader } from "@/components/ui/loader";

import {
  getNowPlayingMovies,
  getTrendingMovies,
  getUpcomingMovies,
} from "@/data/loaders";
import { useRegion } from "@/lib/region-context";

import type { Movie } from "@/types";

import { MovieList } from "./movie-list";

export function MovieFetcher() {
  const { region } = useRegion();
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);

      try {
        // Fetch trending movies for hero banner
        const trendingData = await getTrendingMovies();
        if (trendingData && trendingData.length > 0) {
          setFeaturedMovie(trendingData[0]); // Use first trending movie
        }

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
    return <Loader message="Loading movies..." />;
  }

  return (
    <div className="space-y-16">
      {/* Hero Banner */}
      {featuredMovie && <HeroBanner movie={featuredMovie} />}

      {/* Movie Lists */}
      <MovieList movies={nowPlayingMovies} heading="Now Playing" />
      <MovieList movies={upcomingMovies} heading="Upcoming Releases" />
    </div>
  );
}
