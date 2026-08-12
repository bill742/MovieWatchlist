import { ContentTabs } from "@/components/home/content-tabs";

import { RegionProvider } from "@/lib/region-context";

/**
 * Fully static. The browse rows fetch TMDB from the browser through the route
 * handlers in src/app/api, and RegionProvider resolves the signed-in user's
 * region there too, so this shell has nothing request-specific in it.
 */
export default function Home() {
  return (
    <div className="space-y-12 py-8">
      <RegionProvider>
        <ContentTabs />
      </RegionProvider>
    </div>
  );
}
