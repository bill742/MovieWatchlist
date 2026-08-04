import { ViewTransition } from "react";

import { MoviePageSkeleton } from "@/components/skeletons/movie-page-skeleton";

export default function Loading() {
  return (
    <ViewTransition exit="slide-down">
      <MoviePageSkeleton />
    </ViewTransition>
  );
}
