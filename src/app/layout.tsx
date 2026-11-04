import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import CookieConsentBanner from '@/components/common/CookieConsentBanner';
import { AUTHOR_DISPLAY_NAME } from '@/config/site-owner';
import SiteOnly from '@/components/common/SiteOnly';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0284c7',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://rechenhafen.de'),
  title: {
    default: 'RechenHafen – Alle Rechner an einem Ort',
    template: '%s | RechenHafen',
  },
  description:
    'Kostenlose Online-Rechner für Alltag, Finanzen, Steuern, Gesundheit und mehr. Kein Login, keine Paywall.',
  authors: [{ name: AUTHOR_DISPLAY_NAME, url: 'https://rechenhafen.de/ueber-uns/' }],
  creator: 'RechenHafen',
  publisher: 'RechenHafen',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: 'RechenHafen – Alle Rechner an einem Ort',
    description:
      'Kostenlose Online-Rechner für Alltag, Finanzen, Steuern, Gesundheit und mehr. Kein Login, keine Paywall.',
    url: 'https://rechenhafen.de/',
    siteName: 'RechenHafen',
    locale: 'de_DE',
    type: 'website',
    images: [
      {
        url: 'https://rechenhafen.de/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RechenHafen – Kostenlose Online-Rechner',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RechenHafen – Alle Rechner an einem Ort',
    description:
      'Kostenlose Online-Rechner für Alltag, Finanzen, Steuern, Gesundheit und mehr. Kein Login, keine Paywall.',
    images: ['https://rechenhafen.de/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://rechenhafen.de/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RechenHafen',
    alternateName: ['RechenHafen.de', 'Rechenhafen'],
    url: 'https://rechenhafen.de',
    description: 'Alle Rechner an einem Ort. Hunderte präzise deutsche Online-Rechner.',
    inLanguage: 'de-DE',
    publisher: {
      '@type': 'Organization',
      name: 'RechenHafen',
      url: 'https://rechenhafen.de',
      logo: {
        '@type': 'ImageObject',
        url: 'https://rechenhafen.de/icon.svg',
      },
      publishingPrinciples: 'https://rechenhafen.de/methodik/',
    },
  };

  return (
    <html lang="de">
      <head>
        <meta name="google" content="notranslate" />
        <meta name="google-adsense-account" content="ca-pub-4789347477675358" />
        <SiteOnly>
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4789347477675358"
            crossOrigin="anonymous"
          />
        </SiteOnly>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/</g, '\\u003c') }}
        />
      </head>
      <body>
        <SiteOnly>
          <GoogleAnalytics />
          <Header />
        </SiteOnly>
        <main style={{ flex: 1 }}>{children}</main>
        <SiteOnly>
          <Footer />
          <CookieConsentBanner />
        </SiteOnly>
      </body>
    </html>
  );
}
