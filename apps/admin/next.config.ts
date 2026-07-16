import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@portfolio/database", "@portfolio/ai"],
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
