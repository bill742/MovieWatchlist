import { memo } from "react";

import type { MediaCardItem } from "@/types";

import { MediaCard } from "./media-card";

interface MediaListProps {
  heading: string;
  items: MediaCardItem[];
}

/**
 * Grid of mixed movie and TV results — the counterpart to MovieList and
 * TVShowList for places like search, where both kinds come back together.
 */
const MediaList = memo(({ heading, items }: MediaListProps) => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{heading}</h2>
          <div className="from-primary mt-1 h-1 w-16 rounded-full bg-linear-to-r to-purple-600" />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="border-muted-foreground/25 flex min-h-75 items-center justify-center rounded-xl border-2 border-dashed">
          <p className="text-muted-foreground">No results found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((item) => (
            <MediaCard item={item} key={`${item.media_type}-${item.id}`} />
          ))}
        </div>
      )}
    </section>
  );
});

MediaList.displayName = "MediaList";

export { MediaList };
