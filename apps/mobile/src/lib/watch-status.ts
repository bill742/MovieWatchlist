import type { WatchStatus } from "@moviewatchlist/shared";

/** Human-readable labels for each watch status. */
export const WATCH_STATUS_LABELS: Record<WatchStatus, string> = {
  dropped: "Dropped",
  want_to_watch: "Want to watch",
  watched: "Watched",
  watching: "Watching",
};

/** Selectable statuses, in the order they should appear in pickers. */
export const WATCH_STATUS_OPTIONS: WatchStatus[] = [
  "want_to_watch",
  "watching",
  "watched",
  "dropped",
];
