import { Image } from "expo-image";
import { Text, View } from "react-native";
import type { Movie } from "@moviewatchlist/shared";

import { tmdb } from "@/lib/tmdb";

function MediaCard({ movie }: { movie: Movie }) {
  const poster = tmdb.imageUrl(movie.poster_path, "w342");

  return (
    <View className="mr-3 w-32">
      <View className="aspect-[2/3] w-full overflow-hidden rounded-xl bg-neutral-800">
        {poster ? (
          <Image
            cachePolicy="memory-disk"
            contentFit="cover"
            source={{ uri: poster }}
            style={{ height: "100%", width: "100%" }}
          />
        ) : null}
      </View>
      <Text className="mt-2 text-sm text-neutral-200" numberOfLines={1}>
        {movie.title}
      </Text>
    </View>
  );
}
MediaCard.displayName = "MediaCard";

export { MediaCard };
