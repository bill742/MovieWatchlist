"use client";

/**
 * Custom `next/image` loader for TMDB images.
 *
 * TMDB already serves pre-generated, CDN-cached renditions at fixed size
 * segments (e.g. `https://image.tmdb.org/t/p/w500/xyz.jpg`). Returning those
 * URLs directly means Vercel's Image Optimization is never invoked, so we are
 * not billed for transformations — TMDB's CDN does the resizing for free.
 *
 * Each call site already picks an appropriate size (`w92`/`w200`/`w342`/
 * `w500`/`original`, …). We honor that size and only promote to `original`
 * when `next/image` requests a wider render (e.g. for high-DPR screens).
 * `original` is valid for every TMDB image type, so this never produces a
 * broken URL — unlike mapping to an arbitrary `w###`, which 404s for types
 * that don't list that size. Non-TMDB or already-`original` srcs are returned
 * untouched.
 */

interface TmdbImageLoaderParams {
  quality?: number;
  src: string;
  width: number;
}

const TMDB_SIZED_PATH = /\/t\/p\/w(\d+)\//;

function tmdbImageLoader({ src, width }: TmdbImageLoaderParams): string {
  const match = src.match(TMDB_SIZED_PATH);

  // Already `original`, or not a TMDB URL (e.g. a local /public asset).
  if (!match) return src;

  const currentWidth = Number(match[1]);
  if (width > currentWidth) {
    return src.replace(TMDB_SIZED_PATH, "/t/p/original/");
  }

  return src;
}

export default tmdbImageLoader;
