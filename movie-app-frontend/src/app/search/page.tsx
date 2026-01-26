"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { MovieList } from "@/components/movies/movie-list";
import type { Movie } from "@/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const term = searchParams.get("term");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);

      try {
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: process.env.NEXT_PUBLIC_API_KEY || "",
          },
        };
        const searchResultsRes = await fetch(
          `${process.env.NEXT_PUBLIC_SEARCH_URL}${term}&include_adult=false&language=en-US&page=1`,
          options
        );
        const searchResultsData = await searchResultsRes.json();
        setSearchResults(searchResultsData.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [term]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-lg">Loading search results...</div>
      </div>
    );
  }

  return (
    <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
      <MovieList movies={searchResults} heading={`Results for ${term}`} />
    </main>
  );
}
