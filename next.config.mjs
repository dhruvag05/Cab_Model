/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Increase memory limits for webpack
    config.performance = {
      ...config.performance,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
      hints: false,
    };
    
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    
    return config;
  },
  experimental: {
    serverActions: true,
  },
  // Add memory optimization settings
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;