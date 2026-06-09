import { createTmdbClient } from "@moviewatchlist/shared";

// Framework-agnostic TMDB client, wired to Expo's public env vars. Mirrors the
// web app's NEXT_PUBLIC_* TMDB config (key is intentionally client-exposed for
// now; the server-side proxy is a separate future task per PLAN.md).
export const tmdb = createTmdbClient({
  baseUrl: process.env.EXPO_PUBLIC_TMDB_API_URL!,
  bearerToken: process.env.EXPO_PUBLIC_TMDB_API_KEY!,
  imageBase: process.env.EXPO_PUBLIC_TMDB_IMAGE_PATH!,
});
