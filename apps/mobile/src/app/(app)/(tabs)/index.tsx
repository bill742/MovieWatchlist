import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Movie, TVShow } from "@moviewatchlist/shared";

import { PosterCard } from "@/components/poster-card";
import { useAuth } from "@/lib/auth-context";
import { tmdb } from "@/lib/tmdb";

const REGION = "US";

function Row<T>({
  data,
  keyFor,
  posterFor,
  titleFor,
  onPressItem,
  title,
}: {
  data: T[];
  keyFor: (item: T) => string;
  posterFor: (item: T) => string | null;
  titleFor: (item: T) => string;
  onPressItem: (item: T) => void;
  title: string;
}) {
  if (data.length === 0) return null;

  return (
    <View className="mb-6">
      <Text className="mb-3 px-4 text-xl font-bold text-white">{title}</Text>
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 16 }}
        data={data}
        horizontal
        keyExtractor={keyFor}
        renderItem={({ item }) => (
          <View className="mr-3">
            <PosterCard
              onPress={() => onPressItem(item)}
              posterPath={posterFor(item)}
              title={titleFor(item)}
            />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

export default function BrowseScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [trendingTV, setTrendingTV] = useState<TVShow[]>([]);
  const [onTheAir, setOnTheAir] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      tmdb.getTrendingMovies(),
      tmdb.getNowPlayingMovies(REGION),
      tmdb.getTrendingTV(),
      tmdb.getOnTheAirTV(REGION),
    ]).then(([movies, playing, tv, air]) => {
      if (!active) return;
      setTrendingMovies(movies ?? []);
      setNowPlaying(playing ?? []);
      setTrendingTV(tv ?? []);
      setOnTheAir(air ?? []);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  function openMovie(movie: Movie) {
    router.push({ params: { id: String(movie.id) }, pathname: "/movie/[id]" });
  }

  function openTV(show: TVShow) {
    router.push({ params: { id: String(show.id) }, pathname: "/tv/[id]" });
  }

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
          <Row
            data={trendingMovies}
            keyFor={(m) => String(m.id)}
            onPressItem={openMovie}
            posterFor={(m) => m.poster_path}
            title="Trending movies"
            titleFor={(m) => m.title}
          />
          <Row
            data={nowPlaying}
            keyFor={(m) => String(m.id)}
            onPressItem={openMovie}
            posterFor={(m) => m.poster_path}
            title="Now playing"
            titleFor={(m) => m.title}
          />
          <Row
            data={trendingTV}
            keyFor={(s) => String(s.id)}
            onPressItem={openTV}
            posterFor={(s) => s.poster_path}
            title="Trending TV"
            titleFor={(s) => s.name}
          />
          <Row
            data={onTheAir}
            keyFor={(s) => String(s.id)}
            onPressItem={openTV}
            posterFor={(s) => s.poster_path}
            title="On the air"
            titleFor={(s) => s.name}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
