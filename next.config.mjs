/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    
    return config;
  },
  // Ensure proper handling of browser-specific code
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;