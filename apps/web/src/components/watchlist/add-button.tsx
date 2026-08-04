"use client";

import { useTransition } from "react";

import { BookMarked, BookPlus } from "lucide-react";

import type { MediaType, WatchlistItem } from "@/types";

import { addToWatchlist, removeFromWatchlist } from "@/lib/actions/watchlist";
import { Button } from "@/components/ui/button";

interface Props {
  existingItem?: Pick<WatchlistItem, "status"> | null;
  isLoggedIn: boolean;
  mediaType: MediaType;
  tmdbId: number;
}

function AddToWatchlistButton({
  existingItem,
  isLoggedIn,
  mediaType,
  tmdbId,
}: Props) {
  const [pending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return null;
  }

  const isInWatchlist = !!existingItem;

  const handleClick = () => {
    startTransition(async () => {
      if (isInWatchlist) {
        await removeFromWatchlist(tmdbId, mediaType);
      } else {
        await addToWatchlist(tmdbId, mediaType);
      }
    });
  };

  return (
    <Button
      aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
      disabled={pending}
      onClick={handleClick}
      size="sm"
      variant={isInWatchlist ? "default" : "outline"}
    >
      {isInWatchlist ? (
        <BookMarked className="mr-1.5 h-4 w-4" />
      ) : (
        <BookPlus className="mr-1.5 h-4 w-4" />
      )}
      {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
    </Button>
  );
}

AddToWatchlistButton.displayName = "AddToWatchlistButton";

export { AddToWatchlistButton };
