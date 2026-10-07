import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: https://*.google-analytics.com https://*.googletagmanager.com; font-src 'self'; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.rechenhafen.de',
          },
        ],
        destination: 'https://rechenhafen.de/:path*',
        permanent: true,
      },

      {
        source: '/rechner/sparziel-rechner',
        destination: '/rechner/spardauer-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/sparziel-rechner/',
        destination: '/rechner/spardauer-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/autokredit-rechner',
        destination: '/rechner/ballonfinanzierung-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/autokredit-rechner/',
        destination: '/rechner/ballonfinanzierung-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/beton-rechner',
        destination: '/rechner/betonrechner/',
        permanent: true,
      },
      {
        source: '/rechner/beton-rechner/',
        destination: '/rechner/betonrechner/',
        permanent: true,
      },
      {
        source: '/rechner/kalorienbedarfrechner',
        destination: '/rechner/kalorienbedarf-rechner/',
        statusCode: 301,
      },
      {
        source: '/rechner/kalorienbedarfrechner/',
        destination: '/rechner/kalorienbedarf-rechner/',
        statusCode: 301,
      },
      {
        source: '/rechner/warmmiete-zu-kaltmiete-rechner',
        destination: '/rechner/warmmiete-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/warmmiete-zu-kaltmiete-rechner/',
        destination: '/rechner/warmmiete-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/tagerechner',
        destination: '/rechner/tage-zwischen-zwei-daten/',
        permanent: true,
      },
      {
        source: '/rechner/tagerechner/',
        destination: '/rechner/tage-zwischen-zwei-daten/',
        permanent: true,
      },
      {
        source: '/rechner/tage-bis-datum',
        destination: '/rechner/tage-zwischen-zwei-daten/?mode=until',
        permanent: true,
      },
      {
        source: '/rechner/tage-bis-datum/',
        destination: '/rechner/tage-zwischen-zwei-daten/?mode=until',
        permanent: true,
      },
      {
        source: '/rechner/tage-seit-datum',
        destination: '/rechner/tage-zwischen-zwei-daten/?mode=since',
        permanent: true,
      },
      {
        source: '/rechner/tage-seit-datum/',
        destination: '/rechner/tage-zwischen-zwei-daten/?mode=since',
        permanent: true,
      },
      {
        source: '/rechner/tage-bis-silvester',
        destination: '/rechner/tage-zwischen-zwei-daten/?preset=silvester&mode=until',
        permanent: true,
      },
      {
        source: '/rechner/tage-bis-silvester/',
        destination: '/rechner/tage-zwischen-zwei-daten/?preset=silvester&mode=until',
        permanent: true,
      },
      {
        source: '/rechner/tage-bis-neujahr',
        destination: '/rechner/tage-zwischen-zwei-daten/?preset=neujahr&mode=until',
        permanent: true,
      },
      {
        source: '/rechner/tage-bis-neujahr/',
        destination: '/rechner/tage-zwischen-zwei-daten/?preset=neujahr&mode=until',
        permanent: true,
      },
      {
        source: '/rechner/tage-bis-ostern',
        destination: '/rechner/tage-zwischen-zwei-daten/?preset=ostern&mode=until',
        permanent: true,
      },
      {
        source: '/rechner/tage-bis-ostern/',
        destination: '/rechner/tage-zwischen-zwei-daten/?preset=ostern&mode=until',
        permanent: true,
      },
      {
        source: '/rechner/warmmiete-rechner',
        destination: '/rechner/warmmiete-zu-kaltmiete-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/warmmiete-rechner/',
        destination: '/rechner/warmmiete-zu-kaltmiete-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/warmmiete-berechnen',
        destination: '/rechner/warmmiete-zu-kaltmiete-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/warmmiete-berechnen/',
        destination: '/rechner/warmmiete-zu-kaltmiete-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/gasverbrauch-rechner',
        destination: '/rechner/gaskostenrechner/',
        permanent: true,
      },
      {
        source: '/rechner/gasverbrauch-rechner/',
        destination: '/rechner/gaskostenrechner/',
        permanent: true,
      },
      {
        source: '/rechner/gaskosten-rechner',
        destination: '/rechner/gaskostenrechner/',
        permanent: true,
      },
      {
        source: '/rechner/gaskosten-rechner/',
        destination: '/rechner/gaskostenrechner/',
        permanent: true,
      },
      {
        source: '/rechner/schalungsstein-rechner',
        destination: '/rechner/schalungssteine-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/schalungsstein-rechner/',
        destination: '/rechner/schalungssteine-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/wie-viel-kredit-bekomme-ich',
        destination: '/rechner/maximaler-kredit-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/wie-viel-kredit-bekomme-ich/',
        destination: '/rechner/maximaler-kredit-rechner/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
