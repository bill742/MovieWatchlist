import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
        protocol: "https",
      },
    ],
  },
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
};

export default nextConfig;
