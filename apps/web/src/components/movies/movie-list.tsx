import { memo } from "react";

import { MediaList } from "@/components/media/media-list";

import type { MovieListProps } from "@/types";

const MovieList = memo(({ heading, movies }: MovieListProps) => {
  return (
    <MediaList
      emptyMessage="No movies found"
      heading={heading}
      items={movies.map((movie) => ({
        date: movie.release_date,
        id: movie.id,
        media_type: "movie" as const,
        poster_path: movie.poster_path,
        title: movie.title,
        vote_average: movie.vote_average,
      }))}
    />
  );
});

MovieList.displayName = "MovieList";

export { MovieList };
