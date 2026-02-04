import { memo } from "react";

import { MoviePreview } from "./movie-preview";
import type { MovieListProps } from "@/types";

export const MovieList = memo(({ movies, heading }: MovieListProps) => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{heading}</h2>
          <div className="from-primary mt-1 h-1 w-16 rounded-full bg-gradient-to-r to-purple-600" />
        </div>
      </div>

      {movies.length === 0 ? (
        <div className="border-muted-foreground/25 flex min-h-[300px] items-center justify-center rounded-xl border-2 border-dashed">
          <p className="text-muted-foreground">No movies found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <MoviePreview movie={movie} key={movie.id} />
          ))}
        </div>
      )}
    </section>
  );
});

MovieList.displayName = "MovieList";
