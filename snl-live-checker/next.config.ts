import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Additional optimizations
  reactStrictMode: true,
  
  // Configure ESLint
  eslint: {
    dirs: ['src'],
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
