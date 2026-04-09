import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    turbo: {
      root: path.resolve(__dirname),
    },
  },
}

export default nextConfig
