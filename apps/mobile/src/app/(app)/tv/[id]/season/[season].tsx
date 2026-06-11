import { useCallback, useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import type { TVEpisode, TVSeason } from "@moviewatchlist/shared";

import {
  getWatchedEpisodes,
  markEpisodeWatched,
  unmarkEpisodeWatched,
} from "@/lib/episodes";
import { tmdb } from "@/lib/tmdb";

export default function SeasonScreen() {
  const { id, season } = useLocalSearchParams<{ id: string; season: string }>();
  const showId = Number(id);
  const seasonNumber = Number(season);

  const [data, setData] = useState<TVSeason | null>(null);
  const [watched, setWatched] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<Set<number>>(new Set());

  useEffect(() => {
    let active = true;
    Promise.all([
      tmdb.getTVSeason(id, season),
      getWatchedEpisodes(showId, seasonNumber),
    ]).then(([seasonResult, watchedNumbers]) => {
      if (!active) return;
      setData(seasonResult);
      setWatched(new Set(watchedNumbers));
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id, season, seasonNumber, showId]);

  const toggle = useCallback(
    async (episodeNumber: number) => {
      const isWatched = watched.has(episodeNumber);

      // Optimistic update; revert on failure.
      setWatched((prev) => {
        const next = new Set(prev);
        if (isWatched) next.delete(episodeNumber);
        else next.add(episodeNumber);
        return next;
      });
      setPending((prev) => new Set(prev).add(episodeNumber));

      try {
        if (isWatched) {
          await unmarkEpisodeWatched(showId, seasonNumber, episodeNumber);
        } else {
          await markEpisodeWatched(showId, seasonNumber, episodeNumber);
        }
      } catch {
        setWatched((prev) => {
          const next = new Set(prev);
          if (isWatched) next.add(episodeNumber);
          else next.delete(episodeNumber);
          return next;
        });
      } finally {
        setPending((prev) => {
          const next = new Set(prev);
          next.delete(episodeNumber);
          return next;
        });
      }
    },
    [seasonNumber, showId, watched],
  );

  const renderEpisode = useCallback(
    ({ item }: { item: TVEpisode }) => {
      const still = tmdb.imageUrl(item.still_path, "w300");
      const isWatched = watched.has(item.episode_number);
      const isPending = pending.has(item.episode_number);

      return (
        <View className="flex-row gap-3 px-4 py-3">
          <View className="h-16 w-28 overflow-hidden rounded-lg bg-neutral-800">
            {still ? (
              <Image
                cachePolicy="memory-disk"
                contentFit="cover"
                source={{ uri: still }}
                style={{ height: "100%", width: "100%" }}
              />
            ) : null}
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-white" numberOfLines={2}>
              {item.episode_number}. {item.name}
            </Text>
            {item.air_date ? (
              <Text className="mt-1 text-xs text-neutral-500">
                {item.air_date}
              </Text>
            ) : null}
          </View>
          <Pressable
            accessibilityLabel={
              isWatched ? "Mark as unwatched" : "Mark as watched"
            }
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isWatched }}
            className="h-8 w-8 items-center justify-center self-center rounded-full border"
            disabled={isPending}
            onPress={() => toggle(item.episode_number)}
            style={{
              backgroundColor: isWatched ? "#ffffff" : "transparent",
              borderColor: isWatched ? "#ffffff" : "#525252",
            }}
          >
            {isPending ? (
              <ActivityIndicator color={isWatched ? "#000000" : "#ffffff"} />
            ) : isWatched ? (
              <Text className="text-base font-bold text-black">✓</Text>
            ) : null}
          </Pressable>
        </View>
      );
    },
    [pending, toggle, watched],
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-950">
        <Stack.Screen options={{ headerShown: true, title: "" }} />
        <ActivityIndicator color="#ffffff" />
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-950 px-6">
        <Stack.Screen options={{ headerShown: true, title: "Not found" }} />
        <Text className="text-center text-neutral-400">
          We couldn&apos;t load this season.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-950">
      <Stack.Screen options={{ headerShown: true, title: data.name }} />
      <FlatList
        contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
        data={data.episodes}
        keyExtractor={(episode) => String(episode.id)}
        renderItem={renderEpisode}
      />
    </View>
  );
}
