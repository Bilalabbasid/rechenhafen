import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { CATEGORIES } from '@/data/categories';
import { ALL_CALCULATORS, getCalculatorsByCategory } from '@/data/calculators';
import SearchBar from '@/components/common/SearchBar';
import * as LucideIcons from 'lucide-react';
import styles from '@/styles/layout.module.css';
import compStyles from '@/styles/components.module.css';

export const metadata: Metadata = {
  title: 'RechenHafen – Alle Rechner an einem Ort | Kostenlose Online-Rechner',
  description: 'Über 400 präzise Online-Rechner für Deutschland: Finanzen, Steuern, Zinsen, Brutto-Netto, Gesundheit, Datum, Geometrie und Alltag. Schnell, verlässlich & kostenlos.',
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
  'zinseszinsrechner',
  'arbeitstage-rechner',
  'stundenlohnrechner',
  'spritkostenrechner',
  'kaufnebenkosten-rechner',
  'tilgungsrechner',
  'bmi-rechner',
  'alter-rechner',
  'mwst-rechner',
  'stromkostenrechner',
];

export default function HomePage() {
  const popularCalculators = POPULAR_SLUGS.map((slug) =>
    ALL_CALCULATORS.find((c) => c.slug === slug)
  ).filter(Boolean);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: 'var(--space-10) 0 var(--space-8)' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '9999px',
          background: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: 'var(--space-4)'
        }}>
          <span>⚓</span> RechenHafen – Alle Rechner an einem Ort
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.25rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          color: 'var(--color-text-primary)',
          margin: '0 auto var(--space-4)',
          maxWidth: '850px'
        }}>
          Präzise Berechnungen für Alltag, Finanzen & Beruf
        </h1>
        <p style={{
          fontSize: '1.15rem',
          lineHeight: 1.6,
          color: 'var(--color-text-secondary)',
          maxWidth: '680px',
          margin: '0 auto var(--space-8)'
        }}>
          Fundierte Formeln nach deutschem Standard – von Pendlerpauschale und Zinseszins bis hin zu Arbeitstagen und Materialbedarf. 100 % kostenlos und ohne Datenspeicherung.
        </p>

        {/* Big Search Bar */}
        <div style={{ maxWidth: '640px', margin: '0 auto var(--space-6)' }}>
          <SearchBar placeholder="Rechner suchen (z. B. Zinseszins, Spritkosten, MwSt, BMI)..." />
        </div>

        {/* Quick Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', maxWidth: '750px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', alignSelf: 'center', marginRight: '4px' }}>Häufig gesucht:</span>
          {popularCalculators.slice(0, 6).map((c) => c && (
            <Link
              key={c.slug}
              href={`/rechner/${c.slug}/`}
              style={{
                fontSize: '0.825rem',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {c.shortName}
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 'var(--space-4)',
        padding: 'var(--space-6) 0',
        marginBottom: 'var(--space-8)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <LucideIcons.ShieldCheck size={22} />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.925rem' }}>100 % Datenschutz</strong>
            <span style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>Alle Berechnungen laufen lokal im Browser</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <LucideIcons.CheckCircle2 size={22} />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.925rem' }}>Aktuelle Rechtslage 2026</strong>
            <span style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>Geprüfte deutsche Grenzwerte & Sätze</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <LucideIcons.Zap size={22} />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.925rem' }}>Echtzeit-Ergebnisse</strong>
            <span style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>Sofortige Resultate ohne Neuladen der Seite</span>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section style={{ marginBottom: 'var(--space-12)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-6)' }}>
          <div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>
              Themenbereiche entdecken
            </h2>
            <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Wählen Sie aus 16 strukturierten Fachkategorien den passenden Rechner
            </p>
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>
            {ALL_CALCULATORS.length} Rechner verfügbar
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-5)'
        }}>
          {CATEGORIES.map((cat) => {
            const IconComponent = (LucideIcons as any)[cat.iconName] || LucideIcons.Calculator;
            const catCalcs = getCalculatorsByCategory(cat.slug);

            return (
              <div
                key={cat.id}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-5)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-3)' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <IconComponent size={22} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
                      <Link href={`/${cat.slug}/`} style={{ color: 'var(--color-text-primary)', textDecoration: 'none' }}>
                        {cat.name}
                      </Link>
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {catCalcs.length} Rechner
                    </span>
                  </div>
                </div>

                <p style={{
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  color: 'var(--color-text-secondary)',
                  margin: '0 0 var(--space-4)',
                  flexGrow: 1
                }}>
                  {cat.description}
                </p>

                {/* Top calculators in this category */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {catCalcs.slice(0, 3).map((c) => (
                      <Link
                        key={c.slug}
                        href={`/rechner/${c.slug}/`}
                        style={{
                          fontSize: '0.825rem',
                          color: 'var(--color-primary)',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>›</span>
                        {c.name}
                      </Link>
                    ))}
                  </div>

                  <div style={{ marginTop: 'var(--space-3)', textAlign: 'right' }}>
                    <Link
                      href={`/${cat.slug}/`}
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--color-text-muted)',
                        textDecoration: 'none'
                      }}
                    >
                      Alle anzeigen →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Calculators Grid */}
      <section style={{ marginBottom: 'var(--space-12)' }}>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>
            Die beliebtesten Rechner im Überblick
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Schnellzugriff auf die am häufigsten genutzten Werkzeuge
          </p>
        </div>

        <div className={compStyles.relatedGrid}>
          {popularCalculators.map((calc) => {
            if (!calc) return null;
            return (
              <Link key={calc.slug} href={`/rechner/${calc.slug}/`} className={compStyles.relatedCard}>
                <div className={compStyles.relatedCardHeader}>
                  <LucideIcons.ArrowUpRight size={18} className={compStyles.relatedIcon} />
                  <h3 className={compStyles.relatedCardTitle}>{calc.name}</h3>
                </div>
                <p className={compStyles.relatedCardDesc}>{calc.shortDescription}</p>
                <div className={compStyles.relatedCardAction}>
                  <span>Rechner starten</span>
                  <span>→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Editorial & Methodology Info */}
      <section style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        marginBottom: 'var(--space-10)'
      }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: 0, marginBottom: 'var(--space-4)' }}>
          Warum RechenHafen? Verlässlichkeit für Ihre Zahlen
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', fontSize: '0.925rem', lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
              Wissenschaftliche & amtliche Formeln
            </h3>
            <p style={{ margin: 0 }}>
              Jeder Rechner auf RechenHafen basiert auf transparenten mathematischen Definitionen, DIN-Normen oder den jeweils gültigen deutschen Bundesgesetzen (z. B. EStG, UStG, PAngV, WoFlV). Sämtliche Formeln sind offen dargelegt.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
              100 % lokal im Browser & datensparsam
            </h3>
            <p style={{ margin: 0 }}>
              Ihre Eingaben – ob Einkommen, Kreditvolumen oder persönliche Gesundheitswerte – verlassen niemals Ihr Gerät. Alle Algorithmen berechnen in Echtzeit direkt in Ihrem Browser.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
              Kontinuierliche Aktualisierung 2026
            </h3>
            <p style={{ margin: 0 }}>
              Regulierte Grenzwerte wie der gesetzliche Mindestlohn, die Pendlerpauschale oder Minijob-Obergrenzen werden versioniert im Quellcode gepflegt und bei gesetzlichen Anpassungen unmittelbar aktualisiert.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
