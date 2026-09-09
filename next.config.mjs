/** @type {import('next').NextConfig} */
/**
 * Statisk export styrs av miljövariabeln STATIC_EXPORT, inte av att en
 * annan konfigurationsfil kopieras över den här. Den gamla lösningen
 * (`cp next.config.static.ts next.config.ts`) skrev sönder konfigurationen
 * permanent och skrev dessutom till en fil som Next 14 ignorerar.
 *
 *   npm run build          vanligt bygge
 *   npm run build:static   genererar /out för uppladdning via FTP
 *
 * headers(), redirects() och rewrites() fungerar inte vid statisk export.
 * De hanteras då av public/.htaccess i stället.
 */
const isStaticExport = process.env.STATIC_EXPORT === 'true'

const nextConfig = {
  ...(isStaticExport
    ? {
        output: 'export',
        // Ger /buketter/index.html i stället för /buketter.html.
        trailingSlash: true,
      }
    : {}),

  // Optimera bilder från partner-feeds
  images: {
    ...(isStaticExport ? { unoptimized: true } : {}),
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
        destination: '/blombud',
        permanent: true,
      },
      {
        // Transparenssidan flyttad till /om/ enligt siteplanen §3.
        source: '/affiliate',
        destination: '/om/sa-tjanar-vi-pengar',
        permanent: true,
      },

      /*
        De gamla /guide/-sidorna konkurrerade med tillfällessidorna om samma
        sökord. De skrevs före varumärket och innan publiceringsspärren fanns,
        och de passerade den aldrig: de ligger som markdown i content/guides/
        och kontrolleras varken på mikrosvar, platshållare eller spärrade ord.

        Innehållet i dem höll inte heller. Julguiden påstod att man skulle
        beställa senast 20–22 december medan tillfällessidan räknar ut att
        sista ordinarie vardag är onsdag 23 december, och begravningsguiden
        renderade en osatt platshållare rakt ut på en publicerad sida.

        Varje sida som har en riktig ersättare pekas om dit. Filerna ligger
        kvar i git, så inget innehåll är förlorat.
      */
      { source: '/guide/julblommor-guide', destination: '/tillfalle/jul', permanent: true },
      { source: '/guide/begravningsblommor-guide', destination: '/tillfalle/begravning', permanent: true },
      { source: '/guide/alla-hjartans-dag-blommor', destination: '/tillfalle/alla-hjartans-dag', permanent: true },
      { source: '/guide/mors-dag-blommor', destination: '/tillfalle/mors-dag', permanent: true },
      { source: '/guide/student-blommor', destination: '/tillfalle/student', permanent: true },
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
