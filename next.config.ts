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
  serverExternalPackages: ["@libsql/client"],
};

export default nextConfig;
