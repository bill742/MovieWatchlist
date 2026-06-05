"use client";

import { ViewTransition, startTransition, useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import { MovieList } from "@/components/movies/movie-list";
import SkeletonCardList from "@/components/skeletons/skeleton-card-list";

import { getSearchResults } from "@/data/loaders";
import type { Movie } from "@/types";

export default function ClientSearch() {
  const searchParams = useSearchParams();
  const term = searchParams.get("term");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchSearchResults = async () => {
      try {
        const searchResultsData = await getSearchResults(term || "");
        startTransition(() => {
          setSearchResults(searchResultsData || []);
          setLoading(false);
        });
      } catch {
        startTransition(() => {
          setSearchResults([]);
          setLoading(false);
        });
      }
    };

    fetchSearchResults();
  }, [term]);

  if (loading) {
    return (
      <ViewTransition key="skeleton" default="none" exit="slide-down">
        <div className="space-y-12 py-8">
          <SkeletonCardList />
        </div>
      </ViewTransition>
    );
  }

  return (
    <ViewTransition enter="slide-up" default="none" key="content">
      <div className="space-y-12 py-8">
        <MovieList movies={searchResults} heading={`Results for "${term}"`} />
      </div>
    </ViewTransition>
  );
}
