"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { MovieList } from "@/components/movies/movie-list";
import { useRegion } from "@/lib/region-context";
import type { Movie } from "@/types";

export function SearchResults() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("term") || "";

  const { region } = useRegion();
  const [movieResults, setMovieResults] = useState<Movie[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!searchTerm) {
        setMovieResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: process.env.NEXT_PUBLIC_API_KEY || "",
          },
        } as const;

        const url = `https://api.themoviedb.org/3/search/movie?language=en-US&query=${encodeURIComponent(
          searchTerm
        )}&page=1&include_adult=false`;

        const searchResultsRes = await fetch(url, options);
        const searchResultsData = await searchResultsRes.json();
        setMovieResults(searchResultsData.results?.slice(0, 12) || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [region, searchTerm]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-lg">Searching for {searchTerm}...</div>
      </div>
    );
  }

  return (
    <>
      <MovieList
        movies={movieResults}
        heading={`Search results for ${searchTerm}`}
      />
    </>
  );
}
