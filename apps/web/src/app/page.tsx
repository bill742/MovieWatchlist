import { ContentTabs } from "@/components/home/content-tabs";

import { getProfile } from "@/lib/actions/profile";
import { RegionProvider } from "@/lib/region-context";
import { DEFAULT_REGION } from "@/types";

export default async function Home() {
  // Scoped to this route rather than the root layout: the browse rows are the
  // only thing that reads it, so other pages skip the profile lookup.
  const profile = await getProfile();

  return (
    <div className="space-y-12 py-8">
      <RegionProvider region={profile?.region ?? DEFAULT_REGION}>
        <ContentTabs />
      </RegionProvider>
    </div>
  );
}
