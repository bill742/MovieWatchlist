import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { tmdb } from "@/lib/tmdb";

interface PosterCardProps {
  title: string;
  posterPath: string | null;
  onPress: () => void;
  /** Tailwind width class for the card; defaults to a horizontal-row size. */
  widthClassName?: string;
}

function PosterCard({
  onPress,
  posterPath,
  title,
  widthClassName = "w-32",
}: PosterCardProps) {
  const poster = tmdb.imageUrl(posterPath, "w342");

  return (
    <Pressable
      className={`${widthClassName} active:opacity-70`}
      onPress={onPress}
    >
      <View className="aspect-[2/3] w-full overflow-hidden rounded-xl bg-neutral-800">
        {poster ? (
          <Image
            cachePolicy="memory-disk"
            contentFit="cover"
            source={{ uri: poster }}
            style={{ height: "100%", width: "100%" }}
          />
        ) : (
          <View className="flex-1 items-center justify-center px-2">
            <Text
              className="text-center text-xs text-neutral-500"
              numberOfLines={3}
            >
              {title}
            </Text>
          </View>
        )}
      </View>
      <Text className="mt-2 text-sm text-neutral-200" numberOfLines={1}>
        {title}
      </Text>
    </Pressable>
  );
}
PosterCard.displayName = "PosterCard";

export { PosterCard };
