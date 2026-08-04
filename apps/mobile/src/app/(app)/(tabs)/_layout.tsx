import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#737373",
        tabBarStyle: {
          backgroundColor: "#0a0a0a",
          borderTopColor: "#262626",
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Browse" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="watchlist" options={{ title: "Watchlist" }} />
    </Tabs>
  );
}
