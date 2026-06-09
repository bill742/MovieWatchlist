"use client";

import { useTransition } from "react";

import { X } from "lucide-react";

import type { MediaType } from "@/types";

import { removeFromWatchlist } from "@/lib/actions/watchlist";
import { Button } from "@/components/ui/button";

interface Props {
  mediaType: MediaType;
  tmdbId: number;
}

function RemoveFromWatchlistButton({ mediaType, tmdbId }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      aria-label="Remove from watchlist"
      disabled={pending}
      onClick={() => startTransition(() => removeFromWatchlist(tmdbId, mediaType))}
      size="icon"
      variant="ghost"
    >
      <X className="h-4 w-4" />
    </Button>
  );
}

RemoveFromWatchlistButton.displayName = "RemoveFromWatchlistButton";

export { RemoveFromWatchlistButton };
