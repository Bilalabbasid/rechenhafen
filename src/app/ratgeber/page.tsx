import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAllArticles } from '@/data/ratgeber/articles';
import Breadcrumbs from '@/components/calculator/Breadcrumbs';
import styles from '@/styles/ratgeber.module.css';
import { BookOpen, Clock, Calendar, ArrowRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ratgeber & Rechenhilfen – Wissen & Formeln verständlich erklärt | RechenHafen',
  description:
    'Fundierte Ratgeber, gesetzliche Hintergründe und nachvollziehbare Rechenbeispiele zu Finanzen, Steuern, Gehalt, Wohnen, Energie und Arbeitstagen.',
  alternates: {
    canonical: 'https://rechenhafen.de/ratgeber/',
  },
  openGraph: {
    title: 'Ratgeber & Rechenhilfen – Wissen & Formeln verständlich erklärt | RechenHafen',
    description:
      'Fundierte Ratgeber, gesetzliche Hintergründe und nachvollziehbare Rechenbeispiele zu Finanzen, Steuern, Gehalt, Wohnen, Energie und Arbeitstagen.',
    url: 'https://rechenhafen.de/ratgeber/',
    siteName: 'RechenHafen',
    locale: 'de_DE',
    type: 'website',
  },
};

export default function RatgeberHubPage() {
  const articles = getAllArticles();

  const breadcrumbs = [
    { label: 'Ratgeber' },
  ];

  return (
    <>
      <header className={styles.ratgeberHero}>
        <div className="container">
          <Breadcrumbs items={breadcrumbs} />

          <div style={{ marginTop: 'var(--space-6)', maxWidth: '780px' }}>
            <span className={styles.categoryBadge}>
              <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />
              RechenHafen Magazin
            </span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: 'var(--space-3)', marginBottom: 'var(--space-4)', letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
              Ratgeber, Praxiswissen & Rechenformeln
            </h1>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.6, color: 'var(--color-text-secondary)', margin: 0 }}>
              Verstehen Sie die Gesetze, Formeln und Zusammenhänge hinter Ihren Berechnungen. Unsere Fachbeiträge erklären rechtliche Grundlagen verständlich, entkräften weit verbreitete Mythen und führen Sie Schritt für Schritt zum richtigen Rechenergebnis.
            </p>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingBottom: 'var(--space-16)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
            Aktuelle Fachartikel & Anleitungen ({articles.length})
          </h2>
        </div>

        <div className={styles.hubGrid}>
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/ratgeber/${article.slug}/`}
              className={styles.articleCard}
            >
              <div>
                <div className={styles.cardCategory}>{article.categoryName}</div>
                <h3 className={styles.cardTitle}>{article.title}</h3>
                <p className={styles.cardExcerpt}>{article.summary}</p>
              </div>

              <div className={styles.cardFooter}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} /> {article.readingTimeMin} Min.
                </span>
                <span className={styles.cardReadMore}>
                  Artikel lesen <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
