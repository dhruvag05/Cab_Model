/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Enhanced memory optimization for webpack
    config.performance = {
      ...config.resolve.fallback,
      maxEntrypointSize: 1024000, // Increased from 512000
      maxAssetSize: 1024000, // Increased from 512000
      hints: false,
    };
    
    // Additional fallbacks for problematic modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      crypto: false,
      stream: false,
      buffer: false,
    };
    
    // Optimize chunk splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    };
    
    return config;
  },
  experimental: {
    serverActions: true,
    optimizeCss: true, // Enable CSS optimization
    optimizePackageImports: ['@radix-ui', '@hookform', '@shadcn'], // Optimize large package imports
  },
  // Enhanced memory optimization settings
  onDemandEntries: {
    maxInactiveAge: 15 * 1000, // Reduced from 25 * 1000
    pagesBufferLength: 1, // Reduced from 2
  },
};

export default nextConfig;