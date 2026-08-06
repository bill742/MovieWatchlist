"use client";

import { useTransition } from "react";

import { updateWatchStatus } from "@/lib/actions/watchlist";
import {
  type MediaType,
  WATCH_STATUS_LABELS,
  WATCH_STATUS_OPTIONS,
  type WatchStatus,
} from "@/types";

interface Props {
  currentStatus: WatchStatus;
  mediaType: MediaType;
  /** Title of the row this belongs to, so each select is distinguishable. */
  title: string;
  tmdbId: number;
}

function WatchStatusSelect({ currentStatus, mediaType, title, tmdbId }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      aria-label={`Watch status for ${title}`}
      className="border-input bg-background text-foreground rounded-md border px-2 py-1 text-sm disabled:opacity-50"
      disabled={pending}
      onChange={(e) => {
        const status = e.target.value as WatchStatus;
        startTransition(() => updateWatchStatus(tmdbId, mediaType, status));
      }}
      value={currentStatus}
    >
      {WATCH_STATUS_OPTIONS.map((value) => (
        <option key={value} value={value}>
          {WATCH_STATUS_LABELS[value]}
        </option>
      ))}
    </select>
  );
}

WatchStatusSelect.displayName = "WatchStatusSelect";

export { WatchStatusSelect };
