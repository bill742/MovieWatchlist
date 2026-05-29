import { Suspense } from "react";

import type { Metadata } from "next";

import { Loader } from "@/components/ui/loader";

import ClientSearch from "./client-search";

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
    <Suspense fallback={<Loader message="Loading search results..." />}>
      <ClientSearch />
    </Suspense>
  );
}
