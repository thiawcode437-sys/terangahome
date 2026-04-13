import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
    unoptimized: false,
  },
  serverExternalPackages: ["@neondatabase/serverless"],
};

export default nextConfig;
