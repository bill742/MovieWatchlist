import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BookMarked } from "lucide-react";

import { RemoveFromWatchlistButton } from "@/components/watchlist/remove-button";
import { WatchStatusSelect } from "@/components/watchlist/watch-status-select";

import { getMovie } from "@/data/loaders";
import { getTVShow } from "@/data/tv-loaders";
import { getWatchlistItems } from "@/lib/actions/watchlist";
import type { WatchlistItem } from "@/types";

export const metadata: Metadata = {
  title: `My Watchlist - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
};

interface WatchlistEntry {
  date: string | null;
  href: string;
  item: WatchlistItem;
  posterPath: string | null;
  title: string;
}

/**
 * Resolves each saved id against TMDB, normalizing movies and shows into one
 * shape. Entries whose lookup fails are dropped, so the rendered list and the
 * count above it always agree.
 */
async function resolveEntries(
  items: WatchlistItem[]
): Promise<WatchlistEntry[]> {
  const resolved = await Promise.all(
    items.map(async (item): Promise<WatchlistEntry | null> => {
      const id = String(item.tmdb_id);

      if (item.media_type === "tv") {
        const show = await getTVShow(id);

        return show
          ? {
              date: show.first_air_date ?? null,
              href: `/tv/${show.id}`,
              item,
              posterPath: show.poster_path,
              title: show.name,
            }
          : null;
      }

      const movie = await getMovie(id);

      return movie
        ? {
            date: movie.release_date ?? null,
            href: `/movies/${movie.id}`,
            item,
            posterPath: movie.poster_path,
            title: movie.title,
          }
        : null;
    })
  );

  return resolved.filter((entry): entry is WatchlistEntry => entry !== null);
}

export default async function WatchlistPage() {
  const items = await getWatchlistItems();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <BookMarked className="text-muted-foreground h-12 w-12" />
        <h1 className="text-xl font-semibold">Your watchlist is empty</h1>
        <p className="text-muted-foreground text-sm">
          Browse movies and TV shows and add them to your watchlist.
        </p>
        <Link className="text-sm underline" href="/">
          Discover movies and TV
        </Link>
      </div>
    );
  }

  const entries = await resolveEntries(items);

  return (
    <div className="py-8">
      <h1 className="mb-6 text-2xl font-semibold">My Watchlist</h1>
      <p className="text-muted-foreground mb-6 text-sm">
        {entries.length} item{entries.length !== 1 ? "s" : ""}
      </p>
      <ul className="divide-border divide-y">
        {entries.map(({ date, href, item, posterPath, title }) => (
          <li key={item.id} className="flex items-center gap-4 py-4">
            <Link href={href} className="shrink-0">
              <Image
                alt={title}
                className="rounded object-cover"
                height={90}
                src={
                  posterPath
                    ? `${process.env.NEXT_PUBLIC_API_IMAGE_PATH}w92${posterPath}`
                    : "/placeholder-poster.png"
                }
                width={60}
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={href}>
                <p className="truncate font-medium hover:underline">{title}</p>
              </Link>
              {date && (
                <p className="text-muted-foreground text-sm">
                  {new Date(date).getFullYear()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <WatchStatusSelect
                tmdbId={item.tmdb_id}
                mediaType={item.media_type}
                currentStatus={item.status}
                title={title}
              />
              <RemoveFromWatchlistButton
                tmdbId={item.tmdb_id}
                mediaType={item.media_type}
                title={title}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
