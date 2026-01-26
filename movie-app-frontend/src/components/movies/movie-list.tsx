import { memo } from "react";

import { MoviePreview } from "./movie-preview";
import type { MovieListProps } from "@/types";

export const MovieList = memo(({ movies, heading }: MovieListProps) => {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">{heading}</h2>

      {movies.length === 0 && <p>No movies found</p>}

      <div className="grid grid-cols-1 justify-stretch gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {movies.map((movie) => (
          <MoviePreview movie={movie} key={movie.id} />
        ))}
      </div>
    </section>
  );
});

MovieList.displayName = "MovieList";
