"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { MovieList } from "@/components/movies/movie-list";
import { Loader } from "@/components/ui/loader";

import { getSearchResults } from "@/data/loaders";

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
        const searchResultsData = await getSearchResults(term || "");
        setSearchResults(searchResultsData || []);
      } catch {
        // Silently fail - user sees empty results
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [term]);

  if (loading) {
    return <Loader message="Loading search results..." />;
  }

  return (
    <div className="space-y-12 py-8">
      <MovieList movies={searchResults} heading={`Results for "${term}"`} />
    </div>
  );
}
