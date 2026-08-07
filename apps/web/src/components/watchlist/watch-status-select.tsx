"use client";

import { useTransition } from "react";

import { ChevronDown } from "lucide-react";

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
    // As on the profile selects: the native arrow ignores padding-right and
    // sits against the border, so it is suppressed and redrawn inset to match
    // the text's pl-2.
    <div className="relative">
      <select
        aria-label={`Watch status for ${title}`}
        className="border-input bg-background text-foreground peer appearance-none rounded-md border py-1 pr-7 pl-2 text-sm disabled:opacity-50"
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
      <ChevronDown
        aria-hidden
        className="text-muted-foreground pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 peer-disabled:opacity-50"
      />
    </div>
  );
}

WatchStatusSelect.displayName = "WatchStatusSelect";

export { WatchStatusSelect };
