"use client";

import { ViewTransition, startTransition, useEffect, useState } from "react";

import { HeroBanner } from "@/components/hero/hero-banner";

import {
  getNowPlayingMovies,
  getTrendingMovies,
  getUpcomingMovies,
} from "@/data/loaders";
import { useRegion } from "@/lib/region-context";
import type { Movie } from "@/types";

import MovieListSkeleton from "../skeletons/movie-list-skeleton";
import { MovieList } from "./movie-list";

export function MovieFetcher() {
  const { region } = useRegion();
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchMovies = async () => {
      try {
        const [trendingData, nowPlayingData, upcomingData] = await Promise.all([
          getTrendingMovies(),
          getNowPlayingMovies(region),
          getUpcomingMovies(region),
        ]);

        if (!nowPlayingData)
          throw new Error("Failed to fetch now playing movies");
        if (!upcomingData) throw new Error("Failed to fetch upcoming movies");

        startTransition(() => {
          if (trendingData && trendingData.length > 0) {
            setFeaturedMovie(trendingData[0]);
          }
          setNowPlayingMovies(nowPlayingData.slice(0, 12));
          setUpcomingMovies(upcomingData.slice(0, 12));
          setLoading(false);
        });
      } catch {
        startTransition(() => {
          setNowPlayingMovies([]);
          setUpcomingMovies([]);
          setLoading(false);
        });
      }
    };

    fetchMovies();
  }, [region]);

  if (loading) {
    return (
      <ViewTransition key="skeleton" default="none" exit="slide-down">
        <MovieListSkeleton />
      </ViewTransition>
    );
  }

  return (
    <ViewTransition key="content" default="none" enter="slide-up">
      <div className="space-y-16">
        {featuredMovie && <HeroBanner movie={featuredMovie} />}
        <MovieList movies={nowPlayingMovies} heading="Now Playing" />
        <MovieList movies={upcomingMovies} heading="Upcoming Releases" />
      </div>
    </ViewTransition>
  );
}
