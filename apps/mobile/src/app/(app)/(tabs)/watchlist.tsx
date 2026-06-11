import { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { Image } from "expo-image";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { WatchStatus } from "@moviewatchlist/shared";

import { tmdb } from "@/lib/tmdb";
import { getWatchlist } from "@/lib/watchlist";
import { WATCH_STATUS_LABELS } from "@/lib/watch-status";

interface ResolvedItem {
  id: string;
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  status: WatchStatus;
}

async function resolveWatchlist(): Promise<ResolvedItem[]> {
  const items = await getWatchlist();
  const resolved = await Promise.all(
    items.map(async (item) => {
      const details =
        item.media_type === "tv"
          ? await tmdb.getTVShow(item.tmdb_id)
          : await tmdb.getMovie(item.tmdb_id);
      if (!details) return null;
      const title =
        item.media_type === "tv"
          ? (details as { name: string }).name
          : (details as { title: string }).title;
      return {
        id: item.id,
        mediaType: item.media_type,
        posterPath: details.poster_path,
        status: item.status,
        title,
        tmdbId: item.tmdb_id,
      } satisfies ResolvedItem;
    }),
  );
  return resolved.filter((entry): entry is ResolvedItem => entry !== null);
}

export default function WatchlistScreen() {
  const router = useRouter();
  const [items, setItems] = useState<ResolvedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await resolveWatchlist());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  function openItem(item: ResolvedItem) {
    const pathname = item.mediaType === "tv" ? "/tv/[id]" : "/movie/[id]";
    router.push({ params: { id: String(item.tmdbId) }, pathname });
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-950" edges={["top"]}>
      <Text className="px-4 py-3 text-2xl font-bold text-white">
        My Watchlist
      </Text>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#ffffff" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingBottom: 24 }}
          data={items}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View className="items-center px-6 py-20">
              <Text className="mb-2 text-lg font-semibold text-white">
                Your watchlist is empty
              </Text>
              <Text className="text-center text-sm text-neutral-500">
                Browse movies and shows and add them to your watchlist.
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
              refreshing={refreshing}
              tintColor="#ffffff"
            />
          }
          renderItem={({ item }) => {
            const poster = tmdb.imageUrl(item.posterPath, "w185");
            return (
              <Pressable
                className="flex-row items-center gap-3 px-4 py-3 active:opacity-70"
                onPress={() => openItem(item)}
              >
                <View className="h-24 w-16 overflow-hidden rounded-lg bg-neutral-800">
                  {poster ? (
                    <Image
                      cachePolicy="memory-disk"
                      contentFit="cover"
                      source={{ uri: poster }}
                      style={{ height: "100%", width: "100%" }}
                    />
                  ) : null}
                </View>
                <View className="flex-1">
                  <Text
                    className="text-base font-semibold text-white"
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <Text className="mt-1 text-xs uppercase text-neutral-500">
                    {item.mediaType === "tv" ? "TV" : "Movie"}
                  </Text>
                  <View className="mt-2 self-start rounded-full bg-neutral-800 px-2 py-1">
                    <Text className="text-xs text-neutral-300">
                      {WATCH_STATUS_LABELS[item.status]}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
