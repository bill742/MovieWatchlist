import { memo } from "react";

import { MediaList } from "@/components/media/media-list";

import type { TVShow } from "@/types";

interface TVShowListProps {
  heading: string;
  shows: TVShow[];
}

const TVShowList = memo(({ heading, shows }: TVShowListProps) => {
  return (
    <MediaList
      emptyMessage="No shows found"
      heading={heading}
      items={shows.map((show) => ({
        date: show.first_air_date,
        id: show.id,
        media_type: "tv" as const,
        poster_path: show.poster_path,
        title: show.name,
        vote_average: show.vote_average,
      }))}
    />
  );
});

TVShowList.displayName = "TVShowList";

export { TVShowList };
