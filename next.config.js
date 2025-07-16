/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // Add domains if you're loading logos, service provider images, etc.
    domains: ['backend-066c.onrender.com'],
  },

  experimental: {
    serverActions: true, // Optional: if you plan to use Server Actions
  },

  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend-066c.onrender.com',
  },

  // Optional if you use backend APIs and need CORS for previews, dev, etc.
  async headers() {
    return [
      {
        source: '/(.*)', // Apply to all routes
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
