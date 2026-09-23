import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { CATEGORIES } from '@/data/categories';
import { ALL_CALCULATORS, getCalculatorsByCategory } from '@/data/calculators';
import SearchBar from '@/components/common/SearchBar';
import CalculatorCard from '@/components/common/CalculatorCard';
import CategoryCard from '@/components/common/CategoryCard';
import { ShieldCheck, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import styles from '@/styles/layout.module.css';
import cardsStyles from '@/styles/cards.module.css';

export const metadata: Metadata = {
  title: 'RechenHafen – Alle Rechner an einem Ort | Kostenlose Online-Rechner',
  description: 'Über 400 präzise Online-Rechner für Deutschland: Steuern, Gehalt, Finanzen, Zinsen, Brutto-Netto, Gesundheit, Datum, Geometrie und Alltag. Schnell, verlässlich & kostenlos.',
  alternates: {
    canonical: 'https://rechenhafen.de/',
  },
  openGraph: {
    title: 'RechenHafen – Alle Rechner an einem Ort',
    description: 'Kostenlose, datenschutzfreundliche Online-Rechner für Alltag, Finanzen, Beruf und Mathematik in Deutschland.',
    url: 'https://rechenhafen.de/',
    siteName: 'RechenHafen',
    locale: 'de_DE',
    type: 'website',
  },
};

const POPULAR_SLUGS = [
  'brutto-netto-rechner',
  'prozentrechner',
  'altersrechner',
  'bmi-rechner',
  'spritkostenrechner',
  'kreditrechner',
  'zinseszinsrechner',
  'stundenlohnrechner',
];

const POPULAR_CHIPS = [
  { label: 'Brutto-Netto', slug: 'brutto-netto-rechner' },
  { label: 'Prozentrechner', slug: 'prozentrechner' },
  { label: 'Altersrechner', slug: 'altersrechner' },
  { label: 'BMI-Rechner', slug: 'bmi-rechner' },
  { label: 'Spritkosten', slug: 'spritkostenrechner' },
  { label: 'Kreditrechner', slug: 'kreditrechner' },
  { label: 'Zinseszins', slug: 'zinseszinsrechner' },
  { label: 'Stundenlohn', slug: 'stundenlohnrechner' },
];

export default function HomePage() {
  const popularCalculators = POPULAR_SLUGS.map((slug) =>
    ALL_CALCULATORS.find((c) => c.slug === slug)
  ).filter(Boolean);

  // Curated collections
  const taxCalcs = getCalculatorsByCategory('steuern-gehalt').slice(0, 4);
  const financeCalcs = getCalculatorsByCategory('finanzen').slice(0, 4);
  const autoCalcs = getCalculatorsByCategory('auto-verkehr').slice(0, 4);
  const timeCalcs = getCalculatorsByCategory('datum-zeit').slice(0, 4);

  return (
    <div className={styles.container}>
      {/* 1. Hero Section - Discovery Focused */}
      <section style={{ textAlign: 'center', padding: 'var(--space-8) 0 var(--space-6)' }}>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 4.5vw, 2.75rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          color: 'var(--color-text-primary)',
          margin: '0 auto var(--space-3)',
          maxWidth: '750px',
        }}>
          Alle Rechner an einem Ort.
        </h1>

        <p style={{
          fontSize: '1.1rem',
          lineHeight: 1.55,
          color: 'var(--color-text-secondary)',
          maxWidth: '640px',
          margin: '0 auto var(--space-6)'
        }}>
          Kostenlose Online-Rechner für Alltag, Finanzen, Gesundheit, Arbeit, Auto und mehr.
        </p>

        {/* Large Central Search Bar */}
        <div style={{ maxWidth: '640px', margin: '0 auto var(--space-4)' }}>
          <SearchBar
            variant="hero"
            placeholder="Rechner suchen, z. B. Brutto Netto, Prozent, BMI ..."
          />
        </div>

        {/* Quick Chips */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px',
          maxWidth: '720px',
          margin: '0 auto'
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginRight: '4px' }}>
            Häufig gesucht:
          </span>
          {POPULAR_CHIPS.map((chip) => (
            <Link
              key={chip.slug}
              href={`/rechner/${chip.slug}/`}
              style={{
                fontSize: '0.8rem',
                fontWeight: 500,
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                transition: 'all 0.12s ease'
              }}
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Beliebte Rechner Section */}
      <section style={{ marginBottom: 'var(--space-10)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 'var(--space-4)',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: 'var(--space-3)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
              Beliebte Rechner
            </h2>
            <p style={{ margin: '2px 0 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Schnellzugriff auf die am häufigsten benötigten Werkzeuge
            </p>
          </div>
          <Link
            href="/rechner/"
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none'
            }}
          >
            Alle 418 Rechner <ArrowRight size={14} />
          </Link>
        </div>

        <div className={cardsStyles.calculatorGrid}>
          {popularCalculators.map((calc) => {
            if (!calc) return null;
            const cat = CATEGORIES.find((c) => c.slug === calc.category);
            return (
              <CalculatorCard
                key={calc.slug}
                slug={calc.slug}
                name={calc.name}
                shortName={calc.shortName}
                shortDescription={calc.shortDescription}
                category={calc.category}
                categoryName={cat?.name}
              />
            );
          })}
        </div>
      </section>

      {/* 3. Kategorien Section */}
      <section style={{ marginBottom: 'var(--space-10)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 'var(--space-4)',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: 'var(--space-3)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
              Kategorien entdecken
            </h2>
            <p style={{ margin: '2px 0 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Strukturierte Fachbereiche mit dynamisch gepflegten Rechenwerkzeugen
            </p>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            17 Kategorien
          </span>
        </div>

        <div className={cardsStyles.categoryGrid}>
          {CATEGORIES.map((cat) => {
            const count = getCalculatorsByCategory(cat.slug).length;
            return (
              <CategoryCard
                key={cat.id}
                slug={cat.slug}
                name={cat.name}
                iconName={cat.iconName}
                description={cat.description}
                calculatorCount={count}
              />
            );
          })}
        </div>
      </section>

      {/* 4. Wichtige Themenschwerpunkte */}
      <section style={{ marginBottom: 'var(--space-10)' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)' }}>
          Häufig genutzte Themenschwerpunkte
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-4)'
        }}>
          {/* Steuern & Gehalt */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Steuern & Gehalt</h3>
              <Link href="/steuern-gehalt/" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Alle ansehen →</Link>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 var(--space-3)' }}>
              BMF-konforme Berechnungen nach deutschem Steuer- und Sozialversicherungsrecht (2025/2026).
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {taxCalcs.map((c) => (
                <Link
                  key={c.slug}
                  href={`/rechner/${c.slug}/`}
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 6px',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none'
                  }}
                >
                  <span>{c.shortName || c.name}</span>
                  <span style={{ color: 'var(--color-primary)', fontSize: '0.75rem' }}>Öffnen</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Finanzen */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Finanzen & Vorsorge</h3>
              <Link href="/finanzen/" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Alle ansehen →</Link>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 var(--space-3)' }}>
              Zinsen, Kredite, Tilgungspläne, Sparraten und Vermögensaufbau.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {financeCalcs.map((c) => (
                <Link
                  key={c.slug}
                  href={`/rechner/${c.slug}/`}
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 6px',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none'
                  }}
                >
                  <span>{c.shortName || c.name}</span>
                  <span style={{ color: 'var(--color-primary)', fontSize: '0.75rem' }}>Öffnen</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Auto & Mobilität */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Auto & Mobilität</h3>
              <Link href="/auto-verkehr/" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Alle ansehen →</Link>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 var(--space-3)' }}>
              Spritkosten, Pendlerpauschale, Kraftstoffverbrauch und Fahrtzeit.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {autoCalcs.map((c) => (
                <Link
                  key={c.slug}
                  href={`/rechner/${c.slug}/`}
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 6px',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none'
                  }}
                >
                  <span>{c.shortName || c.name}</span>
                  <span style={{ color: 'var(--color-primary)', fontSize: '0.75rem' }}>Öffnen</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Datum & Zeit */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Datum & Zeit</h3>
              <Link href="/datum-zeit/" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Alle ansehen →</Link>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 var(--space-3)' }}>
              Arbeitstage, Fristen, Altersberechnung und Zeitspannen im deutschen Kalender.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {timeCalcs.map((c) => (
                <Link
                  key={c.slug}
                  href={`/rechner/${c.slug}/`}
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 6px',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none'
                  }}
                >
                  <span>{c.shortName || c.name}</span>
                  <span style={{ color: 'var(--color-primary)', fontSize: '0.75rem' }}>Öffnen</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust & Quality Assurance Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 'var(--space-4)',
        padding: 'var(--space-6) 0',
        marginBottom: 'var(--space-8)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-subtle)', color: 'var(--color-primary)', flexShrink: 0 }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>100 % Lokale Berechnung</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>
              Keine Eingaben verlassen Ihren Browser. Höchster Datenschutz für sensible Daten.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-subtle)', color: 'var(--color-primary)', flexShrink: 0 }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>Deutsche Gesetzeslage 2026</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>
              Fundiert nach § 32a EStG, SGB und amtlichen Bekanntmachungen gepflegt.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-subtle)', color: 'var(--color-primary)', flexShrink: 0 }}>
            <Zap size={20} />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>Sofortige Ergebnisse</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>
              Echtzeit-Berechnungen ohne Ladezeiten oder Werbeunterbrechungen vor dem Resultat.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
