import { memo } from "react";

import type { TVShow } from "@/types";

import { TVPreview } from "./tv-preview";

interface TVShowListProps {
  heading: string;
  shows: TVShow[];
}

const TVShowList = memo(({ heading, shows }: TVShowListProps) => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{heading}</h2>
          <div className="from-primary mt-1 h-1 w-16 rounded-full bg-linear-to-r to-purple-600" />
        </div>
      </div>

      {shows.length === 0 ? (
        <div className="border-muted-foreground/25 flex min-h-75 items-center justify-center rounded-xl border-2 border-dashed">
          <p className="text-muted-foreground">No shows found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {shows.map((show) => (
            <TVPreview key={show.id} show={show} />
          ))}
        </div>
      )}
    </section>
  );
});

TVShowList.displayName = "TVShowList";

export { TVShowList };
