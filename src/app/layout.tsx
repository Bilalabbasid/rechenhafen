import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

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
    'RechenHafen ist die führende deutsche Plattform für über 400 präzise Online-Rechner: Finanzen, Zinseszins, Spritkosten, Alter, BMI, Steuern, Bauen und Alltag.',
  keywords: [
    'Online Rechner',
    'Rechner Deutschland',
    'Zinseszinsrechner',
    'Spritkostenrechner',
    'Altersrechner',
    'Prozentrechner',
    'Kreditrechner',
    'Gehaltsrechner',
  ],
  authors: [{ name: 'RechenHafen Redaktion' }],
  creator: 'RechenHafen',
  publisher: 'RechenHafen',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'RechenHafen – Alle Rechner an einem Ort',
    description: 'Hunderte kostenlose deutsche Online-Rechner für Finanzen, Mobilität, Gesundheit und Alltag.',
    url: 'https://rechenhafen.de',
    siteName: 'RechenHafen',
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RechenHafen – Alle Rechner an einem Ort',
    description: 'Präzise deutsche Online-Rechner für Finanzen, Mobilität, Mathematik und Alltag.',
  },
  robots: {
    index: true,
    follow: true,
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
    url: 'https://rechenhafen.de',
    description: 'Alle Rechner an einem Ort. Hunderte präzise deutsche Online-Rechner.',
    inLanguage: 'de-DE',
  };

  return (
    <html lang="de">
      <head>
        <meta name="google" content="notranslate" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/</g, '\\u003c') }}
        />
      </head>
      <body>
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
