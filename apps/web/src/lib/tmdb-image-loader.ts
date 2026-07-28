"use client";

/**
 * Custom `next/image` loader for TMDB images.
 *
 * TMDB already serves pre-generated, CDN-cached renditions at fixed size
 * segments (e.g. `https://image.tmdb.org/t/p/w500/xyz.jpg`). Returning those
 * URLs directly means Vercel's Image Optimization is never invoked, so we are
 * not billed for transformations — TMDB's CDN does the resizing for free.
 *
 * We snap the width `next/image` asks for up to the nearest size TMDB
 * publishes, so each screen gets an appropriately sized file and the generated
 * srcset is genuinely responsive. TMDB accepts these buckets for every image
 * type (poster, backdrop, profile, still) — only widths outside the list, such
 * as `w201`, return 400 — so replacing the size segment never breaks a URL.
 *
 * The size a call site puts in `src` is therefore a hint, not a ceiling: a
 * `w200` src rendered at 300px resolves to `w300` rather than being upscaled
 * by the browser. Anything wider than the largest bucket falls back to
 * `original`. Non-TMDB srcs (e.g. a local /public asset) are returned as-is.
 */

interface TmdbImageLoaderParams {
  quality?: number;
  src: string;
  width: number;
}

// Ascending. https://developer.themoviedb.org/docs/image-basics
const TMDB_WIDTHS = [
  45, 92, 154, 185, 200, 300, 342, 400, 500, 780, 1280,
] as const;

const TMDB_SIZED_PATH = /\/t\/p\/(?:w\d+|original)\//;

function tmdbImageLoader({ src, width }: TmdbImageLoaderParams): string {
  if (!TMDB_SIZED_PATH.test(src)) return src;

  const bucket = TMDB_WIDTHS.find((candidate) => candidate >= width);

  return src.replace(
    TMDB_SIZED_PATH,
    bucket ? `/t/p/w${bucket}/` : "/t/p/original/"
  );
}

export default tmdbImageLoader;
