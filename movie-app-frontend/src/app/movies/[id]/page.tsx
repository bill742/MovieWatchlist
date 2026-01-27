import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import { Star, Calendar, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { TrailerButton } from "@/components/movies/trailer-button";
import { getMovie } from "@/data/loaders";
import type { Genre } from "@/types";

// Get movie ID from headers
async function getMovieId(): Promise<string | null> {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");
  const id = pathname ? pathname.split("/").pop() : null;
  return id || null;
}

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
    <div className="min-h-screen pb-12">
      {/* Backdrop with gradient */}
      <div className="relative h-[60vh] w-full">
        {movie.backdrop_path && (
          <>
            <Image
              src={`${process.env.NEXT_PUBLIC_API_IMAGE_PATH}original${movie.backdrop_path}`}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
            <div className="from-background via-background/80 to-background/20 absolute inset-0 bg-gradient-to-t" />
          </>
        )}
      </div>

      {/* Content */}
      <div className="relative container -mt-48 space-y-8">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Poster */}
          <div className="shrink-0">
            <div className="relative h-[450px] w-[300px] overflow-hidden rounded-xl shadow-2xl">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_IMAGE_PATH}w500${movie.poster_path}`}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold md:text-5xl">{movie.title}</h1>

              {/* Meta info */}
              <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-4">
                {movie.release_date && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                )}
                {movie.runtime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{movie.runtime} min</span>
                  </div>
                )}
                {movie.vote_average && movie.vote_average > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-foreground font-semibold">
                      {movie.vote_average.toFixed(1)}
                    </span>
                    {movie.vote_count && (
                      <span className="text-sm">
                        ({movie.vote_count.toLocaleString()} votes)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre: Genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Overview */}
            {movie.overview && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {movie.overview}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <TrailerButton movieId={movie.id} movieTitle={movie.title} />
              {/* Features to add later */}
              {/* <Button size="lg" variant="outline" className="gap-2">
                <Bookmark className="h-5 w-5" />
                Add to Watchlist
              </Button>
              <Button size="lg" variant="ghost" className="gap-2">
                <Share2 className="h-5 w-5" />
                Share
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleMovie;
