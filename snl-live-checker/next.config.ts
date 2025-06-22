import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static HTML export for easy deployment
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Configure trailing slash for consistency
  trailingSlash: true,
  
  // Configure base path if deploying to subdirectory (optional)
  // basePath: '/snl-live-checker',
  
  // Ensure static files work properly
  distDir: 'out',
  
  // Additional optimizations
  reactStrictMode: true,
  
  // Configure ESLint
  eslint: {
    dirs: ['src'],
  },
};

export default nextConfig;
