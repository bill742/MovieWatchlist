import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#0a0a0a" },
        headerShadowVisible: false,
        headerShown: false,
        headerStyle: { backgroundColor: "#0a0a0a" },
        headerTintColor: "#ffffff",
      }}
    />
  );
}
