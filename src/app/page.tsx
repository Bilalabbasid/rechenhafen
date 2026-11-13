import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { CATEGORIES } from '@/data/categories';
import { ALL_CALCULATORS, getCalculatorsByCategory } from '@/data/calculators';
import { getAllArticles } from '@/data/ratgeber/articles';
import { POPULAR_CALCULATOR_SLUGS, POPULAR_SEARCH_CHIPS } from '@/data/popularSearches';
import SearchBar from '@/components/common/SearchBar';
import CalculatorCard from '@/components/common/CalculatorCard';
import CategoryCard from '@/components/common/CategoryCard';
import { ShieldCheck, CheckCircle2, Zap, ArrowRight, Clock, BookOpen } from 'lucide-react';
import styles from '@/styles/layout.module.css';
import cardsStyles from '@/styles/cards.module.css';
import ratgeberStyles from '@/styles/ratgeber.module.css';
import FaqAccordion from '@/components/calculator/FaqAccordion';
import {
  SITE_LAST_UPDATED,
  LEGAL_VALUES_CHECKED_AT,
  OFFICIAL_SOURCES,
  formatGermanDate,
  getHomeFaqs,
} from '@/data/home';

const HOME_TITLE = 'Kostenlose Online-Rechner 2026 | RechenHafen';
const HOME_DESCRIPTION = `${ALL_CALCULATORS.length} kostenlose Online-Rechner für Deutschland: Brutto-Netto, Steuern, Kredit, BMI, Datum und mehr. Mit Werten für 2026, ohne Login.`;

export const metadata: Metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: 'https://rechenhafen.de/',
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
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
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ['https://rechenhafen.de/og-image.jpg'],
  },
};

export default function HomePage() {
  const totalCalculators = ALL_CALCULATORS.length;

  const popularCalculators = POPULAR_CALCULATOR_SLUGS.map((slug) =>
    ALL_CALCULATORS.find((c) => c.slug === slug)
  ).filter(Boolean);

  // Curated collections
  const taxCalcs = getCalculatorsByCategory('steuern-gehalt').slice(0, 4);
  const financeCalcs = getCalculatorsByCategory('finanzen').slice(0, 4);
  const autoCalcs = getCalculatorsByCategory('auto-verkehr').slice(0, 4);
  const timeCalcs = getCalculatorsByCategory('datum-zeit').slice(0, 4);

  // Curated Ratgeber articles
  const featuredArticles = getAllArticles().slice(0, 3);

  const homeFaqs = getHomeFaqs(totalCalculators);

  // Homepage as a collection page: the popular calculators as an ItemList, plus the real update date.
  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: 'https://rechenhafen.de/',
    inLanguage: 'de-DE',
    dateModified: SITE_LAST_UPDATED,
    isPartOf: { '@type': 'WebSite', name: 'RechenHafen', url: 'https://rechenhafen.de' },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Beliebte Rechner',
      numberOfItems: popularCalculators.length,
      itemListElement: popularCalculators.map((calc, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: calc!.name,
        url: `https://rechenhafen.de/rechner/${calc!.slug}/`,
      })),
    },
  };

  return (
    <div className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema).replace(/</g, '\\u003c') }}
      />
      {/* 1. Hero Section - Focused, 300–400px Desktop */}
      <section className={styles.heroSection}>
        <div className={styles.heroEyebrow}>
          Über {totalCalculators} praktische Online-Rechner
        </div>

        <h1 className={styles.heroTitle}>
          Kostenlose Online-Rechner für Deutschland
        </h1>

        <p className={styles.heroText}>
          Alle Rechner an einem Ort: Steuern, Gehalt, Finanzen, Alltag, Gesundheit, Auto und Wohnen.
          Mit den Werten für 2026, ohne Login, berechnet direkt in Ihrem Browser.
        </p>

        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0 0 var(--space-4)' }}>
          Zuletzt aktualisiert: <time dateTime={SITE_LAST_UPDATED}>{formatGermanDate(SITE_LAST_UPDATED)}</time>
          {' · '}Steuer- und Sozialversicherungswerte 2026 geprüft am{' '}
          <time dateTime={LEGAL_VALUES_CHECKED_AT}>{formatGermanDate(LEGAL_VALUES_CHECKED_AT)}</time>
        </p>

        {/* Large Central Search Input */}
        <div className={styles.heroSearchBox}>
          <SearchBar
            variant="hero"
            placeholder="Rechner suchen, z. B. Brutto-Netto, Prozent, BMI ..."
          />
        </div>

        {/* Quick Search Chips */}
        <div className={styles.quickChipsRow}>
          <span className={styles.quickChipsLabel}>
            Häufig gesucht:
          </span>
          {POPULAR_SEARCH_CHIPS.map((chip) => (
            <Link
              key={chip.slug}
              href={`/rechner/${chip.slug}/`}
              className={styles.quickChip}
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Beliebte Rechner Section */}
      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderLeft}>
            <h2 className={styles.sectionTitle}>
              Beliebte Rechner
            </h2>
            <p className={styles.sectionSubtitle}>
              Schnell zu den wichtigsten und am häufigsten genutzten Rechnern.
            </p>
          </div>
          <Link href="/rechner/" className={styles.sectionCta}>
            <span>Alle {totalCalculators} Rechner entdecken</span>
            <ArrowRight size={14} />
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

      {/* 3. Rechner nach Kategorie Section (Visually Distinct Collection Tiles) */}
      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderLeft}>
            <h2 className={styles.sectionTitle}>
              Rechner nach Kategorie
            </h2>
            <p className={styles.sectionSubtitle}>
              Entdecken Sie spezialisierte Werkzeuge nach Fachbereichen und Lebenslagen.
            </p>
          </div>
          <Link href="/rechner/" className={styles.sectionCta}>
            <span>{CATEGORIES.length} Kategorien</span>
            <ArrowRight size={14} />
          </Link>
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
      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderLeft}>
            <h2 className={styles.sectionTitle}>
              Themenschwerpunkte im Fokus
            </h2>
            <p className={styles.sectionSubtitle}>
              Die beliebtesten Themenbereiche für Alltag, Finanzen, Steuern und Beruf im schnellen Überblick.
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-5)'
        }}>
          {/* Steuern & Gehalt */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Steuern & Gehalt</h3>
              <Link href="/steuern-gehalt/" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>Alle ansehen →</Link>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', margin: '0 0 var(--space-4)', lineHeight: 1.45 }}>
              Berechnungen gemäß Programmablaufplan des BMF und Sozialversicherungsrecht (2025/2026).
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
              {taxCalcs.map((c) => (
                <Link
                  key={c.slug}
                  href={`/rechner/${c.slug}/`}
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-surface-subtle)',
                    textDecoration: 'none'
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{c.shortName || c.name}</span>
                  <span style={{ color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 600 }}>Öffnen →</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Finanzen */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Finanzen & Vorsorge</h3>
              <Link href="/finanzen/" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>Alle ansehen →</Link>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', margin: '0 0 var(--space-4)', lineHeight: 1.45 }}>
              Zinsen, Kredite, Tilgungspläne, Sparraten und langfristiger Vermögensaufbau.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
              {financeCalcs.map((c) => (
                <Link
                  key={c.slug}
                  href={`/rechner/${c.slug}/`}
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-surface-subtle)',
                    textDecoration: 'none'
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{c.shortName || c.name}</span>
                  <span style={{ color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 600 }}>Öffnen →</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Auto & Mobilität */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Auto & Mobilität</h3>
              <Link href="/auto-verkehr/" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>Alle ansehen →</Link>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', margin: '0 0 var(--space-4)', lineHeight: 1.45 }}>
              Spritkosten, Pendlerpauschale, Kraftstoffverbrauch und realistische Fahrtzeit.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
              {autoCalcs.map((c) => (
                <Link
                  key={c.slug}
                  href={`/rechner/${c.slug}/`}
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-surface-subtle)',
                    textDecoration: 'none'
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{c.shortName || c.name}</span>
                  <span style={{ color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 600 }}>Öffnen →</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Datum & Zeit */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Datum & Zeit</h3>
              <Link href="/datum-zeit/" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>Alle ansehen →</Link>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', margin: '0 0 var(--space-4)', lineHeight: 1.45 }}>
              Arbeitstage, Fristen, Altersberechnung und Zeitspannen im deutschen Kalender.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
              {timeCalcs.map((c) => (
                <Link
                  key={c.slug}
                  href={`/rechner/${c.slug}/`}
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-surface-subtle)',
                    textDecoration: 'none'
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{c.shortName || c.name}</span>
                  <span style={{ color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 600 }}>Öffnen →</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Ratgeber & Magazin (Distinct Article Cards) */}
      {featuredArticles.length > 0 && (
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderLeft}>
              <h2 className={styles.sectionTitle}>
                Ratgeber & Fachwissen
              </h2>
              <p className={styles.sectionSubtitle}>
                Verständliche Erklärungen zu rechtlichen Grundlagen, Berechnungen und Fallstricken.
              </p>
            </div>
            <Link href="/ratgeber/" className={styles.sectionCta}>
              <span>Alle Ratgeber lesen</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className={ratgeberStyles.hubGrid} style={{ marginBottom: 0 }}>
            {featuredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/ratgeber/${article.slug}/`}
                className={ratgeberStyles.articleCard}
              >
                <div>
                  <div className={ratgeberStyles.cardCategory}>{article.categoryName}</div>
                  <h3 className={ratgeberStyles.cardTitle}>{article.title}</h3>
                  <p className={ratgeberStyles.cardExcerpt}>{article.summary}</p>
                </div>

                <div className={ratgeberStyles.cardFooter}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} /> {article.readingTimeMin} Min. Lesezeit
                  </span>
                  <span className={ratgeberStyles.cardReadMore}>
                    Beitrag lesen <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 6. Trust & Quality Assurance Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 'var(--space-6)',
        padding: 'var(--space-8) 0',
        marginBottom: 'var(--space-12)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            flexShrink: 0
          }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              Lokale Berechnung im Browser
            </strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, display: 'block' }}>
              Keine Eingaben verlassen Ihren Webbrowser. Maximale Datensicherheit für private Finanzen und Gehaltsdaten.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            flexShrink: 0
          }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              Aktuelle Gesetzeswerte 2026
            </strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, display: 'block' }}>
              Gesetzliche und steuerliche Rechner basieren auf aktuellen amtlichen Primärquellen (wie EStG, BMF-Vorgaben und SGB) für das jeweilige Berechnungsjahr.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            flexShrink: 0
          }}>
            <Zap size={22} />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              Sofortige Echtzeit-Ergebnisse
            </strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, display: 'block' }}>
              Berechnung erfolgt unmittelbar beim Tippen ohne Ladezeiten, Registrierung oder Paywalls.
            </span>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <FaqAccordion faqs={homeFaqs} />

      {/* 8. Official sources */}
      <section className={styles.sectionBlock} aria-labelledby="quellen-heading">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderLeft}>
            <h2 id="quellen-heading" className={styles.sectionTitle}>
              Amtliche Quellen
            </h2>
            <p className={styles.sectionSubtitle}>
              Auf diesen Quellen beruhen die Steuer-, Gehalts- und Sozialversicherungsrechner.{' '}
              <Link href="/methodik/">So rechnen wir</Link>.
            </p>
          </div>
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {OFFICIAL_SOURCES.map((src) => (
            <li key={src.url} style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              <a href={src.url} target="_blank" rel="noopener" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                {src.name}
              </a>
              {': '}
              {src.usedFor}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
