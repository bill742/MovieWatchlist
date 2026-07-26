import path from "path";
import type { NextConfig } from "next";

const monorepoRoot = path.join(__dirname, "..");

const nextConfig: NextConfig = {
  images: {
    // Bypass Vercel Image Optimization for TMDB images: the custom loader
    // returns TMDB's own pre-sized CDN URLs, so no transformations are billed.
    // See src/lib/tmdb-image-loader.ts. `remotePatterns` is retained so the
    // config still documents the allowed host and works if the loader is
    // reverted (it is ignored while a custom loader is active).
    loader: "custom",
    loaderFile: "./src/lib/tmdb-image-loader.ts",
    remotePatterns: [
      {
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
        protocol: "https",
      },
    ],
  },
  outputFileTracingRoot: monorepoRoot,
  turbopack: {
    root: monorepoRoot,
  },
};

export default nextConfig;
