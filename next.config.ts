import type { NextConfig } from 'next';
import retiredCalculators from './src/data/seo/retired-calculators.json';

// Calculators retired for zero search demand (see src/data/seo/retired-calculators.ts)
const retiredCalculatorRedirects = Object.entries(retiredCalculators as Record<string, string>).flatMap(
  ([slug, destination]) => [
    { source: `/rechner/${slug}`, destination, permanent: true },
    { source: `/rechner/${slug}/`, destination, permanent: true },
  ],
);

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
        // Every page except the embeddable calculators (/embed/...) refuses to be framed.
        source: '/((?!embed/).*)',
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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://*.googlesyndication.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: https://*.google-analytics.com https://*.googletagmanager.com https://pagead2.googlesyndication.com https://*.googlesyndication.com; font-src 'self'; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://googleads.g.doubleclick.net; frame-src 'self' https://googleads.g.doubleclick.net https://*.googlesyndication.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';",
          },
        ],
      },
      {
        // Embeddable calculators: may be framed by any site; no ad or tracking sources.
        source: '/embed/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'none'; frame-ancestors *; object-src 'none'; base-uri 'self'; form-action 'self';",
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

      // Doppelter Abfindungsrechner zusammengeführt (gleiche Suchintention, siehe /rechner/abfindungsrechner/)
      {
        source: '/rechner/abfindung-fuenftelregelung-rechner',
        destination: '/rechner/abfindungsrechner/',
        permanent: true,
      },
      // Phase 2: Duplicate Intent Merges (301 Permanent Redirects)
      {
        source: '/rechner/satz-des-pythagoras-rechner',
        destination: '/rechner/pythagoras-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/satz-des-pythagoras-rechner/',
        destination: '/rechner/pythagoras-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/led-sparrechner',
        destination: '/rechner/led-ersparnis-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/led-sparrechner/',
        destination: '/rechner/led-ersparnis-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/minijob-midijob-rechner',
        destination: '/rechner/minijob-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/minijob-midijob-rechner/',
        destination: '/rechner/minijob-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/brutto-stundensatz-freiberufler-rechner',
        destination: '/rechner/stundensatz-kalkulation-freiberufler-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/brutto-stundensatz-freiberufler-rechner/',
        destination: '/rechner/stundensatz-kalkulation-freiberufler-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/varianz-standardabweichung-stichprobe-rechner',
        destination: '/rechner/standardabweichung-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/varianz-standardabweichung-stichprobe-rechner/',
        destination: '/rechner/standardabweichung-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/privatkredit-rechner',
        destination: '/rechner/ratenkreditrechner/',
        permanent: true,
      },
      {
        source: '/rechner/privatkredit-rechner/',
        destination: '/rechner/ratenkreditrechner/',
        permanent: true,
      },
      {
        source: '/rechner/arbeitgeberanteil-sozialversicherung-rechner',
        destination: '/rechner/arbeitgeberkosten-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/arbeitgeberanteil-sozialversicherung-rechner/',
        destination: '/rechner/arbeitgeberkosten-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/e-auto-ladekosten-zuhause-rechner',
        destination: '/rechner/elektroauto-ladekosten-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/e-auto-ladekosten-zuhause-rechner/',
        destination: '/rechner/elektroauto-ladekosten-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/firmenwagen-geldwerter-vorteil-rechner',
        destination: '/rechner/dienstwagen-1-prozent-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/firmenwagen-geldwerter-vorteil-rechner/',
        destination: '/rechner/dienstwagen-1-prozent-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/liquiditaetsreserve-rechner',
        destination: '/finanzen/',
        permanent: true,
      },
      {
        source: '/rechner/liquiditaetsreserve-rechner/',
        destination: '/finanzen/',
        permanent: true,
      },
      {
        source: '/rechner/parkett-laminat-rechner',
        destination: '/rechner/bodenbelag-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/parkett-laminat-rechner/',
        destination: '/rechner/bodenbelag-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/umsatzsteuerrechner',
        destination: '/rechner/mwst-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/umsatzsteuerrechner/',
        destination: '/rechner/mwst-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/schuldentilgungsdauer-rechner',
        destination: '/rechner/ratenkreditrechner/',
        permanent: true,
      },
      {
        source: '/rechner/schuldentilgungsdauer-rechner/',
        destination: '/rechner/ratenkreditrechner/',
        permanent: true,
      },
      {
        source: '/rechner/kredit-restschuld-stichtag-rechner',
        destination: '/rechner/tilgungsrechner/',
        permanent: true,
      },
      {
        source: '/rechner/kredit-restschuld-stichtag-rechner/',
        destination: '/rechner/tilgungsrechner/',
        permanent: true,
      },
      {
        source: '/rechner/datumsdifferenz',
        destination: '/rechner/tage-zwischen-zwei-daten/',
        permanent: true,
      },
      {
        source: '/rechner/datumsdifferenz/',
        destination: '/rechner/tage-zwischen-zwei-daten/',
        permanent: true,
      },
      {
        source: '/rechner/kalendertage-rechner',
        destination: '/rechner/tage-zwischen-zwei-daten/',
        permanent: true,
      },
      {
        source: '/rechner/kalendertage-rechner/',
        destination: '/rechner/tage-zwischen-zwei-daten/',
        permanent: true,
      },
      {
        source: '/rechner/abfindung-fuenftelregelung-rechner/',
        destination: '/rechner/abfindungsrechner/',
        permanent: true,
      },
      {
        source: '/rechner/sparziel-rechner',
        destination: '/rechner/sparrechner/',
        permanent: true,
      },
      {
        source: '/rechner/sparziel-rechner/',
        destination: '/rechner/sparrechner/',
        permanent: true,
      },
      {
        source: '/rechner/autokredit-rechner',
        destination: '/rechner/ratenkreditrechner/',
        permanent: true,
      },
      {
        source: '/rechner/autokredit-rechner/',
        destination: '/rechner/ratenkreditrechner/',
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
        source: '/rechner/warmmiete-berechnen',
        destination: '/rechner/warmmiete-rechner/',
        permanent: true,
      },
      {
        source: '/rechner/warmmiete-berechnen/',
        destination: '/rechner/warmmiete-rechner/',
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
      ...retiredCalculatorRedirects,
    ];
  },
};

export default nextConfig;
