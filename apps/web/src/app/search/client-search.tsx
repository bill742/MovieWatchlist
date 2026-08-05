"use client";

import { ViewTransition, startTransition, useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import { MediaList } from "@/components/media/media-list";
import { SkeletonCardList } from "@/components/skeletons/skeleton-card-list";

import { getSearchResults } from "@/data/client-loaders";
import type { MediaCardItem, MultiSearchItem } from "@/types";

/** /search/multi carries title/release_date for film and name/first_air_date for TV. */
function toMediaCardItem(item: MultiSearchItem): MediaCardItem {
  return {
    date: item.release_date ?? item.first_air_date ?? null,
    id: item.id,
    media_type: item.media_type,
    poster_path: item.poster_path,
    title: item.title ?? item.name ?? "Untitled",
    vote_average: item.vote_average,
  };
}

function ClientSearch() {
  const searchParams = useSearchParams();
  const term = searchParams.get("term");
  const [searchResults, setSearchResults] = useState<MultiSearchItem[]>([]);
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
        <MediaList
          items={searchResults.map(toMediaCardItem)}
          heading={`Results for "${term}"`}
        />
      </div>
    </ViewTransition>
  );
}

ClientSearch.displayName = "ClientSearch";

export { ClientSearch };
