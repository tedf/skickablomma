import type { NextConfig } from 'next'

/**
 * Next.js konfiguration för STATIC EXPORT
 * ========================================
 * Denna konfiguration genererar statiska HTML-filer som kan
 * laddas upp till vanliga webbhotell som Websupport, Loopia, etc.
 *
 * Användning:
 * 1. npm run build
 * 2. Ladda upp innehållet i /out till webbhotellet via FTP
 */

const nextConfig: NextConfig = {
  // STATIC EXPORT - genererar HTML-filer i /out mappen
  output: 'export',

  // Trailing slash skapar /buketter/index.html istället för /buketter.html
  // Detta ger snygga URL:er som https://skickablomma.se/buketter/
  trailingSlash: true,

  // Bilder - måste vara unoptimized för static export
  images: {
    unoptimized: true, // Krävs för static export
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
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Experimentella features
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // OBS: headers(), redirects() och rewrites() fungerar INTE med static export
  // Använd .htaccess-filen nedan för dessa funktioner
}

export default nextConfig
