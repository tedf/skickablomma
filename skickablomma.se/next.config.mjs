/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimera bilder från partner-feeds
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.interflora.se',
      },
      {
        protocol: 'https',
        hostname: '**.cramers.se',
      },
      {
        protocol: 'https',
        hostname: '**.fakeflowers.se',
      },
      {
        protocol: 'https',
        hostname: '**.myperfectday.se',
      },
      {
        protocol: 'https',
        hostname: 'images.adtraction.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.skickablomma.se',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Experimentella features
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // Headers för SEO och säkerhet
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Redirects för gamla URL:er
  async redirects() {
    return [
      {
        source: '/blommor',
        destination: '/buketter',
        permanent: true,
      },
      {
        source: '/blomsterbud',
        destination: '/samma-dag-leverans',
        permanent: true,
      },
    ]
  },

  // Rewrites för clean URLs
  async rewrites() {
    return [
      {
        source: '/api/feed/:partner',
        destination: '/api/feeds/:partner',
      },
    ]
  },
}

export default nextConfig
