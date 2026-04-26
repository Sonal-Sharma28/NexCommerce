import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

import { join } from "node:path";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig: NextConfig = {
  outputFileTracingRoot: join(process.cwd(), "../../"),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "store.storeimages.cdn-apple.com",
      },
      {
        protocol: "https",
        hostname: "*.storeimages.cdn-apple.com",
      },
      {
        protocol: "https",
        hostname: "*.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/socket.io/:path*",
        destination: "http://localhost:5000/socket.io/:path*",
      },
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
};

export default withPWA(nextConfig);
