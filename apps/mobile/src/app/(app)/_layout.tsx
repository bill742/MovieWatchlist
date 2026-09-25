import { useEffect } from "react";
import { Stack } from "expo-router";
import { AppState } from "react-native";

import { syncReminders } from "@/lib/reminders";

export default function AppLayout() {
  // Scheduled reminders only know the dates TMDB had at the last sync, so
  // re-sync whenever the signed-in app opens or comes back to the foreground.
  useEffect(() => {
    syncReminders();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") syncReminders();
    });
    return () => subscription.remove();
  }, []);

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#0a0a0a" },
        headerBackTitle: "Back",
        headerShadowVisible: false,
        headerShown: false,
        headerStyle: { backgroundColor: "#0a0a0a" },
        headerTintColor: "#ffffff",
      }}
    />
  );
}
