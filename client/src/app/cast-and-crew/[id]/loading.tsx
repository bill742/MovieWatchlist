import { ViewTransition } from "react";

import PersonPageSkeleton from "@/components/skeletons/person-page-skeleton";

export default function Loading() {
  return (
    <ViewTransition exit="slide-down">
      <PersonPageSkeleton />
    </ViewTransition>
  );
}
