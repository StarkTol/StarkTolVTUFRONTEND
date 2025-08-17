/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Build configuration - ignore errors for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Image optimization
  images: {
    unoptimized: true,
    domains: ['backend-066c.onrender.com', 'localhost'],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE || 'https://backend-066c.onrender.com',
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://backend-066c.onrender.com/api/v1',
    NEXT_PUBLIC_FALLBACK_API_BASE: process.env.NEXT_PUBLIC_FALLBACK_API_BASE || 'https://backend-066c.onrender.com',
    NEXT_PUBLIC_FALLBACK_BASE_URL: process.env.NEXT_PUBLIC_FALLBACK_BASE_URL || 'https://backend-066c.onrender.com/api/v1',
    NEXT_PUBLIC_AUTO_DETECT_BACKEND: process.env.NEXT_PUBLIC_AUTO_DETECT_BACKEND || 'true',
  },

  // CORS Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization',
          },
        ],
      },
    ]
  },

  // Webpack config to fix build issues
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
}

module.exports = nextConfig
