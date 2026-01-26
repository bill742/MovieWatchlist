import type { Metadata } from "next";
import { cache } from "react";
import { headers } from "next/headers";
import Image from "next/image";

import type { Genre, Movie } from "@/types";

// Get movie ID from headers
async function getMovieId(): Promise<string | null> {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");
  const id = pathname ? pathname.split("/").pop() : null;
  return id || null;
}

// Cached function to fetch movie data - automatically deduplicated by React
const getMovie = cache(async (id: string): Promise<Movie | null> => {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: process.env.NEXT_PUBLIC_API_KEY || "",
      },
    };

    const movieRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${id}?language=en-US`,
      options
    );

    if (!movieRes.ok) {
      return null;
    }

    const movie: Movie = await movieRes.json();
    return movie;
  } catch {
    return null;
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const id = await getMovieId();

  if (!id) {
    return {
      title: "Movie Not Found - Movie Watchlist",
      description: "The requested movie could not be found.",
    };
  }

  const movie = await getMovie(id);

  if (!movie) {
    return {
      title: "Movie Not Found - Movie Watchlist",
      description: "The requested movie could not be found.",
    };
  }

  return {
    title: `${movie.title} (${movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"}) - Movie Watchlist`,
    description:
      movie.overview ||
      `Watch ${movie.title} and discover more information about this film.`,
    alternates: {
      canonical: `/movies/${id}`,
    },
  };
}

const SingleMovie = async () => {
  const id = await getMovieId();

  if (!id) {
    return (
      <main className="container mx-auto p-6">
        <h1 className="mb-4 text-2xl font-bold">Movie not found</h1>
        <p>
          The movie you&apos;re looking for doesn&apos;t exist or the URL is
          invalid.
        </p>
      </main>
    );
  }

  const movie = await getMovie(id);

  if (!movie) {
    return (
      <main className="container mx-auto p-6">
        <h1 className="mb-4 text-2xl font-bold">Movie not found</h1>
        <p>
          The requested movie could not be found or failed to load from the
          database.
        </p>
      </main>
    );
  }

  return (
    <div
      style={{
        backgroundImage: `url("${process.env.NEXT_PUBLIC_API_IMAGE_PATH}original${movie.backdrop_path}")`,
      }}
      className="relative flex h-screen flex-col items-center bg-cover bg-top"
    >
      <div className="absolute top-20 flex flex-row gap-x-4 bg-white/30 backdrop-blur-sm dark:bg-black/50">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_IMAGE_PATH}w500${movie.poster_path}`}
          alt={movie.title}
          width={185}
          height={278}
        />

        <div className="p-4 text-white dark:text-neutral-100">
          <h1 className="mb-4 text-2xl font-semibold">{movie.title}</h1>
          <p className="mb-4">
            {movie.release_date
              ? ` (${new Date(movie.release_date).getFullYear()})`
              : ""}
            {movie.genres && movie.genres.length > 0
              ? ` - ${movie.genres.map((genre: Genre) => genre.name).join(", ")}`
              : ""}
            {movie.runtime ? ` - ${movie.runtime} min` : ""}
          </p>
          <p>{movie.overview}</p>
        </div>
      </div>
    </div>
  );
};

export default SingleMovie;
