import { FC, memo } from "react";
import MoviePreview from "./movie-preview";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

interface MovieListProps {
  movies: Movie[];
  heading: string;
}

const MovieList: FC<MovieListProps> = memo(({ movies, heading }) => {
  return (
    <>
      <h2>{heading}</h2>

      {movies.length === 0 && <p>No movies found</p>}

      <div className="grid grid-cols-1 justify-stretch gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {movies.map((movie) => (
          <MoviePreview movie={movie} key={movie.id} />
        ))}
      </div>
    </>
  );
});

MovieList.displayName = "MovieList";

export default MovieList;
