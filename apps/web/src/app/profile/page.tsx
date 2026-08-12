import type { Metadata } from "next";

import { getProfile } from "@/lib/actions/profile";
import { requireUser } from "@/lib/auth";
import { DEFAULT_REGION } from "@/types";

import { PreferencesForm } from "./preferences-form";

export const metadata: Metadata = {
  title: `Profile - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
};

export default async function ProfilePage() {
  await requireUser("/profile");

  const profile = await getProfile();

  return (
    <div className="py-8">
      <h1 className="mb-6 text-2xl font-semibold">Profile</h1>
      <PreferencesForm
        initialRegion={profile?.region ?? DEFAULT_REGION}
        initialTheme={profile?.theme ?? "system"}
      />
    </div>
  );
}
