import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * Cloudflare adapter config.
 *
 * No `incrementalCache` is set yet, which means ISR pages are re-rendered per
 * request rather than persisted — the Worker still runs for every hit on
 * /movies/[id], /tv/[id] and /cast-and-crew/[id]. The prerendered routes (/,
 * robots.txt, sitemap.xml) are served straight from static assets and cost
 * nothing either way.
 *
 * To get the caching those routes were written for, create an R2 bucket,
 * uncomment the `r2_buckets` binding in wrangler.jsonc, and swap the export
 * below for:
 *
 *   import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
 *   export default defineCloudflareConfig({ incrementalCache: r2IncrementalCache });
 *
 * R2 is the recommended store here. KV is eventually consistent and the docs
 * advise against it for caching; the static-assets cache is read-only, so it
 * cannot hold pages rendered on demand — and since generateStaticParams
 * returns [], none of the detail pages are prerendered at build time.
 */
export default defineCloudflareConfig();
