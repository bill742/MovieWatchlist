import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DEFAULT_REGION, REGIONS } from "@moviewatchlist/shared";

import { useAuth } from "@/lib/auth-context";
import { getProfile, updateRegion } from "@/lib/profile";

export default function ProfileScreen() {
  const { session, signOut } = useAuth();
  const [region, setRegion] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      getProfile()
        .then((profile) => {
          if (active) setRegion(profile?.region ?? DEFAULT_REGION);
        })
        .catch(() => {
          if (active) setRegion(DEFAULT_REGION);
        });

      return () => {
        active = false;
      };
    }, [])
  );

  async function selectRegion(code: string) {
    const previous = region;
    setRegion(code);
    setSaving(true);
    setError(null);

    try {
      await updateRegion(code);
    } catch {
      // Put the old value back rather than leaving the UI claiming a
      // preference the server never accepted.
      setRegion(previous);
      setError("Could not save your region. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-950" edges={["top"]}>
      <View className="px-4 py-3">
        <Text className="text-2xl font-bold text-white">Profile</Text>
      </View>

      <ScrollView contentContainerClassName="px-4 pb-8">
        <Text className="text-xs uppercase tracking-wide text-neutral-500">
          Signed in as
        </Text>
        <Text className="mt-1 text-base text-white">
          {session?.user.email ?? "—"}
        </Text>

        <Text className="mt-8 text-xs uppercase tracking-wide text-neutral-500">
          Region
        </Text>
        <Text className="mt-1 text-sm text-neutral-400">
          Filters now playing and currently airing releases. Shared with the web
          app.
        </Text>

        {region === null ? (
          <ActivityIndicator className="mt-4" color="#ffffff" />
        ) : (
          <View className="mt-3 overflow-hidden rounded-lg border border-neutral-800">
            {REGIONS.map((option, index) => {
              const selected = option.code === region;

              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  className={`flex-row items-center gap-3 px-4 py-3 ${
                    index > 0 ? "border-t border-neutral-800" : ""
                  } ${selected ? "bg-neutral-800" : ""}`}
                  disabled={saving}
                  key={option.code}
                  onPress={() => selectRegion(option.code)}
                >
                  <Text className="text-lg">{option.flag}</Text>
                  <Text className="flex-1 text-base text-white">
                    {option.label}
                  </Text>
                  {selected && (
                    <Text className="text-sm font-semibold text-white">✓</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        {error && <Text className="mt-3 text-sm text-red-400">{error}</Text>}

        <Pressable
          className="mt-10 items-center rounded-lg border border-neutral-800 px-4 py-3"
          onPress={() => signOut()}
        >
          <Text className="text-base font-semibold text-neutral-300">
            Sign out
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
