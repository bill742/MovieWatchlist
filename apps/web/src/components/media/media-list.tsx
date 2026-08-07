import { memo } from "react";

import type { MediaCardItem } from "@/types";

import { MediaCard } from "./media-card";

interface MediaListProps {
  emptyMessage?: string;
  heading: string;
  items: MediaCardItem[];
}

/**
 * The one card grid. Takes already-normalized items so it can render movies,
 * TV, or a mix of both; MovieList and TVShowList are thin wrappers over it.
 */
const MediaList = memo(
  ({ emptyMessage = "No results found", heading, items }: MediaListProps) => {
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
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {items.map((item) => (
              // Ids are only unique within a media type, so a film and a show
              // can collide in a mixed list.
              <MediaCard item={item} key={`${item.media_type}-${item.id}`} />
            ))}
          </div>
        )}
      </section>
    );
  }
);

MediaList.displayName = "MediaList";

export { MediaList };
