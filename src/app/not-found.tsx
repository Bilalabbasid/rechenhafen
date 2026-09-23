import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { CATEGORIES } from '@/data/categories';
import SearchBar from '@/components/common/SearchBar';
import styles from '@/styles/layout.module.css';
import compStyles from '@/styles/components.module.css';
import { Compass, ArrowRight, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Seite nicht gefunden (404) | RechenHafen',
  description: 'Die aufgerufene Seite konnte leider nicht gefunden werden. Finden Sie den passenden Online-Rechner über unsere Suche oder nach Kategorie.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  const topCategories = CATEGORIES.slice(0, 8);

  return (
    <div className={styles.container} style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
      <div style={{
        maxWidth: '680px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          marginBottom: 'var(--space-4)',
        }}>
          <Compass size={36} />
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          margin: '0 0 var(--space-3)',
          color: 'var(--color-text-primary)',
        }}>
          Seite nicht gefunden (404)
        </h1>

        <p style={{
          fontSize: '1.1rem',
          lineHeight: 1.6,
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-6)',
        }}>
          Der gewünschte Rechner oder die angeforderte Seite existiert nicht oder wurde verschoben.
          Nutzen Sie die Suche oder navigieren Sie direkt zu einer unserer Hauptkategorien.
        </p>

        {/* Suche */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <SearchBar placeholder="Rechner suchen (z. B. Zinseszins, Spritkosten, Alter...)" />
        </div>

        {/* Zur Startseite */}
        <div style={{ marginBottom: 'var(--space-10)' }}>
          <Link
            href="/"
            className={compStyles.primaryBtn}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              padding: '12px 24px',
              fontSize: '1rem',
            }}
          >
            <Home size={18} />
            Zur Startseite zurückkehren
          </Link>
        </div>

        {/* Beliebte Kategorien */}
        <div style={{ textAlign: 'left' }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            marginBottom: 'var(--space-4)',
            color: 'var(--color-text-primary)',
            textAlign: 'center',
          }}>
            Oder entdecken Sie unsere Rechner-Kategorien
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}>
            {topCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}/`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  transition: 'background var(--transition-fast)',
                }}
              >
                <span>{cat.name}</span>
                <ArrowRight size={16} style={{ color: 'var(--color-text-muted)' }} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
