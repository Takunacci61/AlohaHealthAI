import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Add this to handle browser APIs
  experimental: {
    appDir: true,
  },
  // Ensure client-side only rendering for pages using localStorage
  reactStrictMode: true,
  /* config options here */
};

export default nextConfig;
