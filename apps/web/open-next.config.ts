import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";

/**
 * Cloudflare adapter config.
 *
 * ISR pages persist to R2. Without an incremental cache they were re-rendered
 * in the Worker on every request, which made `export const revalidate` on the
 * detail pages decorative — the pages were correct but nothing was reused.
 *
 * R2 rather than KV: KV is eventually consistent and the adapter's docs advise
 * against it for caching. The static-assets cache is read-only, so it cannot
 * hold pages rendered on demand, and `generateStaticParams` returns [] — none
 * of the detail pages are prerendered at build time.
 *
 * The regional cache sits in front of R2 so a hit is served from the colo
 * rather than a bucket round trip. `long-lived` is the documented mode for an
 * app that revalidates: ISR responses are reused for up to 30 minutes and
 * refreshed in the background.
 *
 * Deliberately not configured: `tagCache`, `queue`, and `cachePurge`. Those
 * matter for on-demand revalidation, and the only `revalidatePath` calls here
 * target /profile and /watchlist, which are dynamic and never cached. The
 * detail pages revalidate on a timer, which the default queue handles through
 * the WORKER_SELF_REFERENCE binding in wrangler.jsonc.
 *
 * `enableCacheInterception` is also off. It would let cached responses return
 * before the full routing stack runs, cutting Worker time further, but it
 * interacts with middleware and this migration has produced enough surprises —
 * worth trying separately, once the cache is proven.
 */
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, {
    mode: "long-lived",
  }),
});
