import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/quick-prime-tech/**", // Secures it to your specific account
      },
    ],
    // Optional: Boost quality globally
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    formats: ["image/avif", "image/webp"],
    qualities: [100, 75, 95],
  },
  allowedDevOrigins: ["lz62klsuhtff7kjv2ytqb3e74u.srv.us"],
};

export default nextConfig;
