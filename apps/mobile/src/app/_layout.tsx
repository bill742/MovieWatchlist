import "../global.css";

import { useEffect, useRef } from "react";
import { Slot, useRouter, useSegments, type Href } from "expo-router";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";

import { AuthProvider, useAuth } from "@/lib/auth-context";
import { reminderUrl } from "@/lib/reminders";

// Show release reminders as a banner even when the app is open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function RootNavigator() {
  const { initializing, session } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      router.replace("/login");
    } else if (session && inAuthGroup) {
      router.replace("/");
    }
  }, [initializing, router, segments, session]);

  // Tapping a release reminder opens that title. Covers a cold start too: the
  // hook reports a tap that launched the app. A tap made while signed out waits
  // here until sign-in completes.
  const lastResponse = Notifications.useLastNotificationResponse();
  const handledResponse = useRef<string | null>(null);

  useEffect(() => {
    if (initializing || !session || !lastResponse) return;
    if (
      lastResponse.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      return;
    }

    const key = `${lastResponse.notification.request.identifier}@${lastResponse.notification.date}`;
    if (handledResponse.current === key) return;
    handledResponse.current = key;

    const url = reminderUrl(lastResponse);
    if (url) router.push(url as Href);
    // Otherwise a relaunch would replay the same tap.
    Notifications.clearLastNotificationResponse();
  }, [initializing, lastResponse, router, session]);

  if (initializing) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-950">
        <ActivityIndicator color="#ffffff" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </AuthProvider>
  );
}
