import { Suspense } from "react";

import type { Metadata } from "next";

import { ClientSearch } from "./client-search";
import { SkeletonCardList } from "@/components/skeletons/skeleton-card-list";

type SearchPageProps = {
  searchParams: Promise<{ term?: string }>;
};

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { term } = await searchParams;

  if (!term) {
    return {
      description: `Search for movies on ${process.env.NEXT_PUBLIC_SITE_NAME}.`,
      title: `Search - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    };
  }

  return {
    alternates: {
      canonical: `/search?term=${encodeURIComponent(term)}`,
    },
    description: `Search results for "${term}" on ${process.env.NEXT_PUBLIC_SITE_NAME}.`,
    title: `"${term}" - Search Results - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  };
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="space-y-12 py-8"><SkeletonCardList /></div>}>
      <ClientSearch />
    </Suspense>
  );
}
