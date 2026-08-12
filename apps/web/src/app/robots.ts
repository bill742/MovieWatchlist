import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://movie-watchlist.com";

/**
 * There was no robots.txt at all, so crawlers were free to walk every
 * /movies/[id], /tv/[id] and /cast-and-crew/[id] URL TMDB exposes — each one a
 * fresh render against the plan's function allowance.
 *
 * The detail pages are CDN-cached now, so crawling them is far cheaper, but
 * they are still bulk TMDB data with no reason to be indexed. /api and /search
 * are disallowed because they are unbounded: every distinct query string is a
 * new uncacheable render.
 */
function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        disallow: [
          "/api/",
          "/search",
          "/watchlist",
          "/profile",
          "/login",
          "/signup",
          "/auth/",
          "/movies/",
          "/tv/",
          "/cast-and-crew/",
        ],
        userAgent: "*",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

export default robots;
