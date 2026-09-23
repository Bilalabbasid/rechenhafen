import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';",
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
    ];
  },
};

export default nextConfig;
