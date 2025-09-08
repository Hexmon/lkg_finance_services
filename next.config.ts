// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      new URL("https://pub-dcebb8dd7f554f2681fa24f286407352.r2.dev/**"),
    ],
  },
};

export default nextConfig;
