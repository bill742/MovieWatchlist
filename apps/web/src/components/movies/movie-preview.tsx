import { MediaCard } from "@/components/media/media-card";
import type { MoviePreviewProps } from "@/types";

export function MoviePreview({ movie }: MoviePreviewProps) {
  return (
    <MediaCard
      item={{
        date: movie.release_date,
        id: movie.id,
        media_type: "movie",
        poster_path: movie.poster_path,
        title: movie.title,
        vote_average: movie.vote_average,
      }}
    />
  );
}
