"use client";

import { ViewTransition, startTransition, useEffect, useState } from "react";

import { HeroBanner } from "@/components/hero/hero-banner";

import {
  getMovie,
  getMovieTrailer,
  getNowPlayingMovies,
  getTrendingMovies,
  getUpcomingMovies,
} from "@/data/loaders";
import { useRegion } from "@/lib/region-context";
import type { FeaturedItem, Movie } from "@/types";

import { MediaListSkeleton } from "../skeletons/media-list-skeleton";
import { MovieList } from "./movie-list";

function MovieFetcher() {
  const { region } = useRegion();
  const [featured, setFeatured] = useState<{
    item: FeaturedItem;
    trailerKey: string | null;
  } | null>(null);
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

        let featuredResult: typeof featured = null;
        if (trendingData && trendingData.length > 0) {
          const featuredMovie = trendingData[0];
          // Fetch the full movie record for overview (trending endpoint may omit it)
          const fullMovie = await getMovie(String(featuredMovie.id));
          const movie = fullMovie ?? featuredMovie;
          const trailerKey = await getMovieTrailer(String(movie.id));
          featuredResult = {
            item: {
              backdrop_path: movie.backdrop_path,
              id: movie.id,
              media_type: "movie",
              overview: movie.overview,
              title: movie.title,
            },
            trailerKey,
          };
        }

        startTransition(() => {
          setFeatured(featuredResult);
          setNowPlayingMovies(nowPlayingData.slice(0, 12));
          setUpcomingMovies(upcomingData.slice(0, 12));
          setLoading(false);
        });
      } catch {
        startTransition(() => {
          setFeatured(null);
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
        <MediaListSkeleton />
      </ViewTransition>
    );
  }

  return (
    <ViewTransition key="content" default="none" enter="slide-up">
      <div className="space-y-16">
        {featured && (
          <HeroBanner item={featured.item} trailerKey={featured.trailerKey} />
        )}
        <MovieList movies={nowPlayingMovies} heading="Now Playing" />
        <MovieList movies={upcomingMovies} heading="Upcoming Releases" />
      </div>
    </ViewTransition>
  );
}

MovieFetcher.displayName = "MovieFetcher";

export { MovieFetcher };
