"use client";

import { useState, useTransition } from "react";

import { useTheme } from "next-themes";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { updateProfile } from "@/lib/actions/profile";
import { REGIONS, THEME_OPTIONS, type Theme } from "@/types";

// The native arrow ignores padding-right and sits against the border, so it is
// suppressed with appearance-none and drawn below instead, inset to match pl-3.
const SELECT_CLASS =
  "border-input bg-background text-foreground w-full appearance-none rounded-md border py-2 pr-9 pl-3 text-sm";

const SELECT_CHEVRON =
  "text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2";

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
  // next-themes owns what the browser actually renders; the profile row only
  // records the preference. Saving has to tell both, or the value persists
  // while the page keeps its old appearance.
  const { setTheme: applyTheme } = useTheme();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        await updateProfile(formData);
        applyTheme(theme);
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
        <div className="relative">
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
          <ChevronDown aria-hidden className={SELECT_CHEVRON} />
        </div>
        <p className="text-muted-foreground text-xs">
          Used to filter Now Playing and Upcoming movie releases.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="theme">Theme</Label>
        <div className="relative">
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
            {THEME_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden className={SELECT_CHEVRON} />
        </div>
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
