import type { Metadata } from "next";
import Link from "next/link";

import { BookMarked } from "lucide-react";

import {
  type WatchlistEntry,
  WatchlistView,
} from "@/components/watchlist/watchlist-view";

import { getMovie } from "@/data/loaders";
import { getTVShow } from "@/data/tv-loaders";
import { getWatchlistItems } from "@/lib/actions/watchlist";
import { requireUser } from "@/lib/auth";
import type { WatchlistItem } from "@/types";

export const metadata: Metadata = {
  title: `My Watchlist - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
};

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
      const shared = {
        id: item.id,
        mediaType: item.media_type,
        status: item.status,
        tmdbId: item.tmdb_id,
      };

      if (item.media_type === "tv") {
        const show = await getTVShow(id);

        return show
          ? {
              ...shared,
              date: show.first_air_date ?? null,
              href: `/tv/${show.id}`,
              posterPath: show.poster_path,
              title: show.name,
            }
          : null;
      }

      const movie = await getMovie(id);

      return movie
        ? {
            ...shared,
            date: movie.release_date ?? null,
            href: `/movies/${movie.id}`,
            posterPath: movie.poster_path,
            title: movie.title,
          }
        : null;
    })
  );

  return resolved.filter((entry): entry is WatchlistEntry => entry !== null);
}

export default async function WatchlistPage() {
  await requireUser("/watchlist");

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
      <WatchlistView entries={entries} />
    </div>
  );
}
