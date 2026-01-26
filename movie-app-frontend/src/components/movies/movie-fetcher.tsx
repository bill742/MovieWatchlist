"use client";

import { useEffect, useState } from "react";
import { useRegion } from "@/lib/region-context";
import MovieList from "./movie-list";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  release_dates: {
    type: number;
  }[];
}

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
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [region]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
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
