import { createTmdbClient } from "@moviewatchlist/shared";

// TMDB reads go through the web app's proxy rather than straight to TMDB.
//
// Expo inlines every EXPO_PUBLIC_* value into the shipped bundle, where it can
// be read straight out of a distributed .ipa/.apk — so the app is given no
// TMDB token at all. The proxy holds it server-side and forwards allowlisted
// read-only paths.
//
// The image base still points at TMDB's CDN: those URLs need no credential.
export const tmdb = createTmdbClient({
  baseUrl: process.env.EXPO_PUBLIC_TMDB_PROXY_URL!,
  imageBase: process.env.EXPO_PUBLIC_TMDB_IMAGE_PATH!,
});
