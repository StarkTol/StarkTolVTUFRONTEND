/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  eslint: {
    // During development, allow production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  images: {
    domains: ['backend-066c.onrender.com', 'localhost'],
  },

  experimental: {
    // ✅ Must be an object, even if empty
    serverActions: {},
  },

  env: {
    // Smart API configuration with auto-detection
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000',
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000/api/v1',
    NEXT_PUBLIC_FALLBACK_API_BASE: process.env.NEXT_PUBLIC_FALLBACK_API_BASE || 'https://backend-066c.onrender.com',
    NEXT_PUBLIC_FALLBACK_BASE_URL: process.env.NEXT_PUBLIC_FALLBACK_BASE_URL || 'https://backend-066c.onrender.com/api/v1',
    NEXT_PUBLIC_AUTO_DETECT_BACKEND: process.env.NEXT_PUBLIC_AUTO_DETECT_BACKEND || 'true',
  },

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
}

module.exports = nextConfig
