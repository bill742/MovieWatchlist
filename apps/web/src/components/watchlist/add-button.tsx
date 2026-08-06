"use client";

import { useState, useTransition } from "react";

import { BookMarked, BookPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { addToWatchlist, removeFromWatchlist } from "@/lib/actions/watchlist";
import type { MediaType, WatchlistItem } from "@/types";

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

  // Own the state this button changes rather than waiting for the server.
  // Neither revalidatePath on this route nor router.refresh() relabels the
  // button: the refetch it triggers comes back with the pre-click markup, so
  // the click looked like it did nothing until a manual reload.
  const [isInWatchlist, setIsInWatchlist] = useState(!!existingItem);
  const [serverItem, setServerItem] = useState(existingItem);

  // Re-sync if the server does send a new value — navigating back to a page
  // whose row was removed elsewhere, say.
  if (existingItem !== serverItem) {
    setServerItem(existingItem);
    setIsInWatchlist(!!existingItem);
  }

  if (!isLoggedIn) {
    return null;
  }

  const handleClick = () => {
    startTransition(async () => {
      if (isInWatchlist) {
        await removeFromWatchlist(tmdbId, mediaType);
        setIsInWatchlist(false);
      } else {
        await addToWatchlist(tmdbId, mediaType);
        setIsInWatchlist(true);
      }
    });
  };

  return (
    <Button
      aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
      disabled={pending}
      onClick={handleClick}
      // Matches TrailerButton, which sits beside this on both detail pages and
      // defaults to lg. At sm this rendered 32px against its 40px.
      size="lg"
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
