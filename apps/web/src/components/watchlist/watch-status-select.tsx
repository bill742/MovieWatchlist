"use client";

import { useTransition } from "react";

import type { MediaType, WatchStatus } from "@/types";

import { updateWatchStatus } from "@/lib/actions/watchlist";

const STATUS_LABELS: Record<WatchStatus, string> = {
  dropped: "Dropped",
  want_to_watch: "Want to watch",
  watched: "Watched",
  watching: "Watching",
};

interface Props {
  currentStatus: WatchStatus;
  mediaType: MediaType;
  tmdbId: number;
}

function WatchStatusSelect({ currentStatus, mediaType, tmdbId }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      className="border-input bg-background text-foreground rounded-md border px-2 py-1 text-sm disabled:opacity-50"
      disabled={pending}
      onChange={(e) => {
        const status = e.target.value as WatchStatus;
        startTransition(() => updateWatchStatus(tmdbId, mediaType, status));
      }}
      value={currentStatus}
    >
      {Object.entries(STATUS_LABELS).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}

WatchStatusSelect.displayName = "WatchStatusSelect";

export { WatchStatusSelect };
