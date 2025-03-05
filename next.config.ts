import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Eslint config got messed up with nodejs config.
  // Skipping eslint check for this demo.
  eslint: {
    ignoreDuringBuilds: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
    incomingRequests: true,
  },
}

export default nextConfig
