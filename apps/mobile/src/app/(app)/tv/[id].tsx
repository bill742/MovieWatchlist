import { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import type { TVShow } from "@moviewatchlist/shared";

import { WatchlistButton } from "@/components/watchlist-button";
import { tmdb } from "@/lib/tmdb";

export default function TVDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [show, setShow] = useState<TVShow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    tmdb.getTVShow(id).then((result) => {
      if (!active) return;
      setShow(result);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-950">
        <Stack.Screen options={{ headerShown: true, title: "" }} />
        <ActivityIndicator color="#ffffff" />
      </View>
    );
  }

  if (!show) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-950 px-6">
        <Stack.Screen options={{ headerShown: true, title: "Not found" }} />
        <Text className="text-center text-neutral-400">
          We couldn&apos;t load this show.
        </Text>
      </View>
    );
  }

  const backdrop = tmdb.imageUrl(show.backdrop_path, "w780");
  const year = show.first_air_date ? show.first_air_date.slice(0, 4) : null;

  return (
    <View className="flex-1 bg-neutral-950">
      <Stack.Screen options={{ headerShown: true, title: show.name }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {backdrop ? (
          <Image
            cachePolicy="memory-disk"
            contentFit="cover"
            source={{ uri: backdrop }}
            style={{ aspectRatio: 16 / 9, width: "100%" }}
          />
        ) : null}

        <View className="px-4 pt-4">
          <Text className="text-2xl font-bold text-white">{show.name}</Text>
          <Text className="mt-1 text-sm text-neutral-400">
            {[
              year,
              `${show.number_of_seasons} season${show.number_of_seasons === 1 ? "" : "s"}`,
              show.vote_average ? `★ ${show.vote_average.toFixed(1)}` : null,
            ]
              .filter(Boolean)
              .join("  ·  ")}
          </Text>

          {show.genres?.length ? (
            <View className="mt-3 flex-row flex-wrap gap-2">
              {show.genres.map((genre) => (
                <View
                  className="rounded-full bg-neutral-800 px-3 py-1"
                  key={genre.id}
                >
                  <Text className="text-xs text-neutral-300">{genre.name}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <View className="mt-5">
            <WatchlistButton mediaType="tv" tmdbId={show.id} />
          </View>

          {show.overview ? (
            <Text className="mt-6 text-base leading-6 text-neutral-200">
              {show.overview}
            </Text>
          ) : null}

          <Text className="mb-3 mt-8 text-lg font-bold text-white">Seasons</Text>
          {show.seasons.map((season) => {
            const poster = tmdb.imageUrl(season.poster_path, "w185");
            return (
              <Pressable
                className="mb-3 flex-row items-center gap-3 active:opacity-70"
                key={season.id}
                onPress={() =>
                  router.push({
                    params: { id, season: String(season.season_number) },
                    pathname: "/tv/[id]/season/[season]",
                  })
                }
              >
                <View className="h-20 w-14 overflow-hidden rounded-lg bg-neutral-800">
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
                  <Text className="text-base font-semibold text-white">
                    {season.name}
                  </Text>
                  <Text className="mt-1 text-xs text-neutral-500">
                    {season.episode_count} episode
                    {season.episode_count === 1 ? "" : "s"}
                  </Text>
                </View>
                <Text className="text-xl text-neutral-600">›</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
