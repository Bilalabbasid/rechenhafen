import React from 'react';
import { Metadata } from 'next';
import { ALL_CALCULATORS, getCalculatorsByCategory } from '@/data/calculators';
import { CATEGORIES } from '@/data/categories';
import Breadcrumbs from '@/components/calculator/Breadcrumbs';
import AllCalculatorsDirectory from '@/components/calculator/AllCalculatorsDirectory';
import styles from '@/styles/layout.module.css';

export const metadata: Metadata = {
  title: 'Alle Rechner – Gesamtverzeichnis | RechenHafen',
  description: 'Übersicht über alle 418 kostenlosen Online-Rechner auf RechenHafen. Filtern Sie nach Themen wie Steuern, Finanzen, Alltag, Gesundheit, Auto und Mathematik.',
  alternates: {
    canonical: 'https://rechenhafen.de/rechner/',
  },
  openGraph: {
    title: 'Alle Rechner – Gesamtverzeichnis | RechenHafen',
    description: 'Das vollständige Verzeichnis aller Online-Rechner für Deutschland: Steuern, Finanzen, Gesundheit, Alltag und mehr.',
    url: 'https://rechenhafen.de/rechner/',
    siteName: 'RechenHafen',
    locale: 'de_DE',
    type: 'website',
  },
};

export default function AllCalculatorsPage() {
  // Category counts and metadata
  const categoriesMeta = CATEGORIES.map((cat) => ({
    slug: cat.slug,
    name: cat.name,
    count: getCalculatorsByCategory(cat.slug).length,
  }));

  // Serializable calculator list
  const calculatorsList = ALL_CALCULATORS.map((c) => {
    const cat = CATEGORIES.find((catItem) => catItem.slug === c.category);
    return {
      id: c.id,
      slug: c.slug,
      name: c.name,
      shortName: c.shortName,
      shortDescription: c.shortDescription,
      category: c.category,
      categoryName: cat?.name || c.category,
    };
  });

  return (
    <div className={styles.container}>
      <Breadcrumbs items={[{ label: 'Alle Rechner', href: '/rechner/' }]} />

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '2px 10px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          fontSize: '0.8rem',
          fontWeight: 600,
          marginBottom: 'var(--space-2)'
        }}>
          <span>{ALL_CALCULATORS.length} Online-Rechner verfügbar</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          margin: '0 0 var(--space-2)',
          color: 'var(--color-text-primary)'
        }}>
          Alle Rechner im Überblick
        </h1>

        <p style={{
          fontSize: '1.05rem',
          lineHeight: 1.6,
          color: 'var(--color-text-secondary)',
          maxWidth: '780px',
          margin: 0
        }}>
          Finden Sie schnell den passenden Rechner für Ihre Berechnung. Nutzen Sie das Suchfeld oder filtern Sie gezielt nach Kategorie und Anfangsbuchstaben.
        </p>
      </div>

      <AllCalculatorsDirectory
        calculators={calculatorsList}
        categories={categoriesMeta}
      />
    </div>
  );
}
