import { MediaCard } from "@/components/media/media-card";
import type { TVShow } from "@/types";

export function TVPreview({ show }: { show: TVShow }) {
  return (
    <MediaCard
      item={{
        date: show.first_air_date,
        id: show.id,
        media_type: "tv",
        poster_path: show.poster_path,
        title: show.name,
        vote_average: show.vote_average,
      }}
    />
  );
}
