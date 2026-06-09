import type { Metadata } from "next";

import { getProfile, updateProfile } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: `Profile - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
};

const REGIONS = [
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
];

const THEMES = [
  { label: "System default", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
] as const;

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <div className="py-8">
      <h1 className="mb-6 text-2xl font-semibold">Profile</h1>
      <form action={updateProfile} className="max-w-sm space-y-6">
        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <select
            className="border-input bg-background text-foreground w-full rounded-md border px-3 py-2 text-sm"
            defaultValue={profile?.region ?? "US"}
            id="region"
            name="region"
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
            className="border-input bg-background text-foreground w-full rounded-md border px-3 py-2 text-sm"
            defaultValue={profile?.theme ?? "system"}
            id="theme"
            name="theme"
          >
            {THEMES.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit">Save preferences</Button>
      </form>
    </div>
  );
}
