import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@portfolio/database", "@portfolio/ai"],
  serverExternalPackages: ["pdf-parse"],
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
