import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BookMarked } from "lucide-react";

import { getWatchlistItems } from "@/lib/actions/watchlist";
import { getMovie } from "@/data/loaders";
import { WatchStatusSelect } from "@/components/watchlist/watch-status-select";
import { RemoveFromWatchlistButton } from "@/components/watchlist/remove-button";

export const metadata: Metadata = {
  title: `My Watchlist - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
};

export default async function WatchlistPage() {
  const items = await getWatchlistItems();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <BookMarked className="text-muted-foreground h-12 w-12" />
        <h1 className="text-xl font-semibold">Your watchlist is empty</h1>
        <p className="text-muted-foreground text-sm">
          Browse movies and add them to your watchlist.
        </p>
        <Link className="text-sm underline" href="/">
          Discover movies
        </Link>
      </div>
    );
  }

  const movies = await Promise.all(
    items
      .filter((i) => i.media_type === "movie")
      .map(async (item) => {
        const movie = await getMovie(String(item.tmdb_id));
        return movie ? { item, movie } : null;
      }),
  ).then((results) => results.filter(Boolean) as NonNullable<Awaited<ReturnType<typeof getMovie>> extends null ? never : { item: typeof items[number]; movie: NonNullable<Awaited<ReturnType<typeof getMovie>>> }>[]);

  return (
    <div className="py-8">
      <h1 className="mb-6 text-2xl font-semibold">My Watchlist</h1>
      <p className="text-muted-foreground mb-6 text-sm">
        {items.length} item{items.length !== 1 ? "s" : ""}
      </p>
      <ul className="divide-border divide-y">
        {movies.map(({ item, movie }) => (
          <li key={item.id} className="flex items-center gap-4 py-4">
            <Link href={`/movies/${movie.id}`} className="shrink-0">
              <Image
                alt={movie.title}
                className="rounded object-cover"
                height={90}
                src={
                  movie.poster_path
                    ? `${process.env.NEXT_PUBLIC_API_IMAGE_PATH}w92${movie.poster_path}`
                    : "/placeholder-poster.png"
                }
                width={60}
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/movies/${movie.id}`}>
                <p className="truncate font-medium hover:underline">{movie.title}</p>
              </Link>
              {movie.release_date && (
                <p className="text-muted-foreground text-sm">
                  {new Date(movie.release_date).getFullYear()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <WatchStatusSelect
                tmdbId={movie.id}
                mediaType="movie"
                currentStatus={item.status}
              />
              <RemoveFromWatchlistButton tmdbId={movie.id} mediaType="movie" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
