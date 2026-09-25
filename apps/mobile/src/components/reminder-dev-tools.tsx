import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import {
  listScheduledReminders,
  scheduleTestReminder,
  syncReminders,
} from "@/lib/reminders";

/**
 * Dev-only controls for checking release reminders by hand. Rendered only when
 * `__DEV__`, so none of this reaches a release build.
 */
function ReminderDevTools() {
  const [status, setStatus] = useState<string | null>(null);
  const [scheduled, setScheduled] = useState<string[]>([]);

  async function sendTest() {
    try {
      await scheduleTestReminder(5);
      setStatus(
        "Test reminder fires in 5s — background the app to test the tap.",
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    }
  }

  async function syncAndList() {
    setStatus("Syncing…");
    await syncReminders();
    const pending = await listScheduledReminders();
    setScheduled(
      pending.map(
        ({ date, title }) => `${date?.toLocaleString() ?? "?"} — ${title}`,
      ),
    );
    setStatus(`${pending.length} reminder(s) scheduled.`);
  }

  return (
    <View className="mt-3 gap-2 rounded-lg border border-dashed border-amber-700 p-3">
      <Text className="text-xs uppercase tracking-wide text-amber-500">
        Dev tools
      </Text>
      <View className="flex-row gap-2">
        <Pressable
          accessibilityRole="button"
          className="flex-1 items-center rounded-md bg-neutral-800 px-3 py-2 active:opacity-80"
          onPress={sendTest}
        >
          <Text className="text-sm font-semibold text-white">Test in 5s</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          className="flex-1 items-center rounded-md bg-neutral-800 px-3 py-2 active:opacity-80"
          onPress={syncAndList}
        >
          <Text className="text-sm font-semibold text-white">Sync & list</Text>
        </Pressable>
      </View>
      {status && <Text className="text-sm text-neutral-400">{status}</Text>}
      {scheduled.map((line) => (
        <Text className="text-xs text-neutral-500" key={line}>
          {line}
        </Text>
      ))}
    </View>
  );
}
ReminderDevTools.displayName = "ReminderDevTools";

export { ReminderDevTools };
