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
 * `enableCacheInterception` serves a cached ISR page without invoking
 * NextServer at all, which is most of the work a cached hit was still doing.
 * Two constraints, both fine here: it does not support PPR, which this app does
 * not use, and it consults the tag cache to decide whether a path is stale.
 *
 * There is no tag cache, deliberately — along with `queue` and `cachePurge`,
 * those serve on-demand revalidation, and the only `revalidatePath` calls here
 * target /profile and /watchlist, which are dynamic and never cached. Nothing
 * invalidates the detail pages by tag; they revalidate on a timer, which the
 * default queue handles through the WORKER_SELF_REFERENCE binding in
 * wrangler.jsonc. Add a tag cache before introducing revalidateTag, or the
 * intercepted responses will not know they are stale.
 *
 * Middleware is unaffected: it matches only /watchlist, /profile and
 * /auth/callback, all dynamic, so interception never has a cached response to
 * return ahead of it.
 */
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, {
    mode: "long-lived",
  }),
  enableCacheInterception: true,
});
