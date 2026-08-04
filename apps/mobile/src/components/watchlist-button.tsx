import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import type { MediaType, WatchStatus } from "@moviewatchlist/shared";

import {
  addToWatchlist,
  getWatchlistStatus,
  removeFromWatchlist,
  updateWatchStatus,
} from "@/lib/watchlist";
import { WATCH_STATUS_LABELS, WATCH_STATUS_OPTIONS } from "@/lib/watch-status";

interface WatchlistButtonProps {
  tmdbId: number;
  mediaType: MediaType;
}

function WatchlistButton({ mediaType, tmdbId }: WatchlistButtonProps) {
  const [status, setStatus] = useState<WatchStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getWatchlistStatus(tmdbId, mediaType)
      .then((next) => active && setStatus(next))
      .catch(() => active && setStatus(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [mediaType, tmdbId]);

  async function onAdd() {
    setBusy(true);
    try {
      await addToWatchlist(tmdbId, mediaType);
      setStatus("want_to_watch");
    } finally {
      setBusy(false);
    }
  }

  async function onSelectStatus(next: WatchStatus) {
    setPickerOpen(false);
    setBusy(true);
    try {
      await updateWatchStatus(tmdbId, mediaType, next);
      setStatus(next);
    } finally {
      setBusy(false);
    }
  }

  async function onRemove() {
    setPickerOpen(false);
    setBusy(true);
    try {
      await removeFromWatchlist(tmdbId, mediaType);
      setStatus(null);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <View className="h-12 items-center justify-center rounded-xl bg-neutral-900">
        <ActivityIndicator color="#ffffff" />
      </View>
    );
  }

  if (status === null) {
    return (
      <Pressable
        className="h-12 items-center justify-center rounded-xl bg-white active:opacity-80"
        disabled={busy}
        onPress={onAdd}
      >
        {busy ? (
          <ActivityIndicator color="#000000" />
        ) : (
          <Text className="text-base font-semibold text-black">
            Add to watchlist
          </Text>
        )}
      </Pressable>
    );
  }

  return (
    <>
      <Pressable
        className="h-12 flex-row items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900 active:opacity-80"
        disabled={busy}
        onPress={() => setPickerOpen(true)}
      >
        {busy ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-base font-semibold text-white">
            {WATCH_STATUS_LABELS[status]}
          </Text>
        )}
      </Pressable>

      <Modal
        animationType="slide"
        onRequestClose={() => setPickerOpen(false)}
        transparent
        visible={pickerOpen}
      >
        <Pressable
          className="flex-1 justify-end bg-black/60"
          onPress={() => setPickerOpen(false)}
        >
          <View className="rounded-t-3xl bg-neutral-900 px-4 pb-10 pt-3">
            <View className="mb-3 self-center h-1 w-10 rounded-full bg-neutral-700" />
            {WATCH_STATUS_OPTIONS.map((option) => (
              <Pressable
                className="flex-row items-center justify-between rounded-xl px-4 py-4 active:bg-neutral-800"
                key={option}
                onPress={() => onSelectStatus(option)}
              >
                <Text className="text-base text-white">
                  {WATCH_STATUS_LABELS[option]}
                </Text>
                {status === option ? (
                  <Text className="text-base text-white">✓</Text>
                ) : null}
              </Pressable>
            ))}
            <Pressable
              className="mt-1 rounded-xl px-4 py-4 active:bg-neutral-800"
              onPress={onRemove}
            >
              <Text className="text-base text-red-400">Remove from watchlist</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
WatchlistButton.displayName = "WatchlistButton";

export { WatchlistButton };
