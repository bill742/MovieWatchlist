import { Suspense } from "react";

import { Loader } from "@/components/ui/loader";

import ClientSearch from "./client-search";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <>
          <Loader message="Loading search results..." />
        </>
      }
    >
      <ClientSearch />
    </Suspense>
  );
}
