import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import { Star, Calendar, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { TrailerButton } from "@/components/movies/trailer-button";
import { getMovie, getMovieTrailer, getCastAndCrew } from "@/data/loaders";
import type { Genre } from "@/types";
import { CastAndCrewInfo } from "@/components/movies/cast-and-crew-info";

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

  const castAndCrew = await getCastAndCrew(id);

  const directors = castAndCrew
    ? castAndCrew.crew.filter((member) => member.job === "Director")
    : [];

  // Check if trailer is available
  const trailerKey = await getMovieTrailer(id);

  console.log(movie.vote_average);

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
              {movie.poster_path ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_IMAGE_PATH}w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 300px) 100vw, 300px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-center">
                  <span className="px-4 text-sm text-gray-500">
                    No Image Available
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-6">
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
                {movie.runtime && movie.runtime > 0 ? (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{movie.runtime} min</span>
                  </div>
                ) : null}
                {movie.vote_average && movie.vote_average > 0 ? (
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
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4" />
                    <span className="text-foreground font-semibold">
                      Not rated yet
                    </span>
                  </div>
                )}
              </div>
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre: Genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}

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
              {trailerKey && (
                <TrailerButton
                  movieTitle={movie.title}
                  trailerKey={trailerKey}
                />
              )}
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

            {castAndCrew && castAndCrew.cast.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">
                  {directors.length > 0 ? "Directors" : "Director"}
                </h2>

                {directors.length === 0 && (
                  <p className="font-medium">
                    Director information not available
                  </p>
                )}

                <div className="flex flex-row gap-4">
                  {directors.length > 0 &&
                    directors.map((director) => (
                      <div key={director.id}>
                        <CastAndCrewInfo
                          profile_path={director.profile_path}
                          name={director.name}
                          id={director.id}
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}

            {castAndCrew && castAndCrew.cast.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Top Cast</h2>
                <div className="flex flex-wrap gap-4">
                  {castAndCrew.cast.slice(0, 6).map((castMember) => (
                    <div key={castMember.id} className="w-32">
                      <CastAndCrewInfo
                        profile_path={castMember.profile_path}
                        name={castMember.name}
                        id={castMember.id}
                        character={castMember.character}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleMovie;
