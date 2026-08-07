"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { updateProfile } from "@/lib/actions/profile";
import { REGIONS, type Theme } from "@/types";

const THEMES: { label: string; value: Theme }[] = [
  { label: "System default", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

const SELECT_CLASS =
  "border-input bg-background text-foreground w-full rounded-md border px-3 py-2 text-sm";

interface Props {
  initialRegion: string;
  initialTheme: Theme;
}

/**
 * Both selects are controlled, and submission goes through onSubmit rather than
 * the form's `action`. React resets an uncontrolled form once its action
 * resolves, which snapped these back to the values the server had rendered
 * before the save — the new value only appeared after navigating back.
 */
function PreferencesForm({ initialRegion, initialTheme }: Props) {
  const [region, setRegion] = useState(initialRegion);
  const [theme, setTheme] = useState(initialTheme);
  const [status, setStatus] = useState<"error" | "idle" | "saved">("idle");
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        await updateProfile(formData);
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    });
  }

  return (
    <form className="max-w-sm space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="region">Region</Label>
        <select
          className={SELECT_CLASS}
          id="region"
          name="region"
          onChange={(event) => {
            setRegion(event.target.value);
            setStatus("idle");
          }}
          value={region}
        >
          {REGIONS.map(({ code, label }) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
        <p className="text-muted-foreground text-xs">
          Used to filter Now Playing and Upcoming movie releases.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="theme">Theme</Label>
        <select
          className={SELECT_CLASS}
          id="theme"
          name="theme"
          onChange={(event) => {
            setTheme(event.target.value as Theme);
            setStatus("idle");
          }}
          value={theme}
        >
          {THEMES.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled={pending} type="submit">
          {pending ? "Saving…" : "Save preferences"}
        </Button>
        {status === "saved" && (
          <p aria-live="polite" className="text-muted-foreground text-sm">
            Preferences saved
          </p>
        )}
        {status === "error" && (
          <p aria-live="polite" className="text-destructive text-sm">
            Could not save. Try again.
          </p>
        )}
      </div>
    </form>
  );
}

PreferencesForm.displayName = "PreferencesForm";

export { PreferencesForm };
