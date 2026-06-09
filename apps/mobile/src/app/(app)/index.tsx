import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Movie } from "@moviewatchlist/shared";

import { MediaCard } from "@/components/media-card";
import { useAuth } from "@/lib/auth-context";
import { tmdb } from "@/lib/tmdb";

function MovieRow({ movies, title }: { movies: Movie[]; title: string }) {
  if (movies.length === 0) return null;

  return (
    <View className="mb-6">
      <Text className="mb-3 px-4 text-xl font-bold text-white">{title}</Text>
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 16 }}
        data={movies}
        horizontal
        keyExtractor={(movie) => String(movie.id)}
        renderItem={({ item }) => <MediaCard movie={item} />}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

export default function BrowseScreen() {
  const { signOut } = useAuth();
  const [trending, setTrending] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      tmdb.getTrendingMovies(),
      tmdb.getNowPlayingMovies("US"),
    ]).then(([trendingResult, nowPlayingResult]) => {
      if (!active) return;
      setTrending(trendingResult ?? []);
      setNowPlaying(nowPlayingResult ?? []);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-neutral-950" edges={["top"]}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-2xl font-bold text-white">Browse</Text>
        <Pressable onPress={() => signOut()}>
          <Text className="text-sm font-semibold text-neutral-400">
            Sign out
          </Text>
        </Pressable>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#ffffff" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
        >
          <MovieRow movies={trending} title="Trending this week" />
          <MovieRow movies={nowPlaying} title="Now playing" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
