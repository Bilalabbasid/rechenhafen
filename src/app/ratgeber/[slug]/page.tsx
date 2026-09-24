import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllArticles, getArticleBySlug, getRelatedArticles } from '@/data/ratgeber/articles';
import Breadcrumbs from '@/components/calculator/Breadcrumbs';
import CalculatorCta from '@/components/ratgeber/CalculatorCta';
import ArticleFaqAccordion from '@/components/ratgeber/ArticleFaqAccordion';
import TableOfContents from '@/components/ratgeber/TableOfContents';
import styles from '@/styles/ratgeber.module.css';
import {
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Info,
  ExternalLink,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Artikel nicht gefunden | RechenHafen',
    };
  }

  const canonicalUrl = `https://rechenhafen.de/ratgeber/${article.slug}/`;

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: canonicalUrl,
      siteName: 'RechenHafen',
      locale: 'de_DE',
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
    },
  };
}

export default async function RatgeberArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article, 2);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.h1,
    description: article.metaDescription,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: 'de-DE',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://rechenhafen.de/ratgeber/${article.slug}/`,
    },
    author: {
      '@type': 'Organization',
      name: article.author.name,
      url: 'https://rechenhafen.de/ueber-uns/',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RechenHafen',
      url: 'https://rechenhafen.de',
      logo: {
        '@type': 'ImageObject',
        url: 'https://rechenhafen.de/icon.svg',
      },
    },
  };

  const breadcrumbs = [
    { label: 'Ratgeber', href: '/ratgeber/' },
    { label: article.categoryName, href: `/${article.category}/` },
    { label: article.title },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c') }}
      />

      <article>
        {/* Article Hero */}
        <header className={styles.articleHero}>
          <div className="container">
            <Breadcrumbs items={breadcrumbs} />

            <div className={styles.heroMeta} style={{ marginTop: '1rem' }}>
              <span className={styles.categoryBadge}>{article.categoryName}</span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} /> {article.readingTimeMin} Min. Lesezeit
              </span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} /> Aktualisiert am {new Date(article.updatedAt).toLocaleDateString('de-DE')}
              </span>
            </div>

            <h1 className={styles.articleTitle}>{article.h1}</h1>
            <p className={styles.articleSummary}>{article.summary}</p>

            <div className={styles.authorBox}>
              <div className={styles.authorAvatar} aria-hidden="true">
                RH
              </div>
              <div>
                <strong style={{ color: 'var(--color-text-primary)' }}>{article.author.name}</strong>
                <div>{article.author.role}</div>
              </div>
              {article.reviewer && (
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserCheck size={16} color="var(--color-success)" />
                  <span>Geprüft durch {article.reviewer.name}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Layout with Sidebar */}
        <div className="container">
          <div className={styles.articleLayout}>
            {/* Main Column */}
            <div className={styles.mainContent}>
              {/* Key Takeaways */}
              <div className={styles.takeawaysCard}>
                <div className={styles.takeawaysTitle}>
                  <CheckCircle2 size={20} />
                  Das Wichtigste auf einen Blick
                </div>
                <ul className={styles.takeawaysList}>
                  {article.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx}>{takeaway}</li>
                  ))}
                </ul>
              </div>

              {/* Contextual Primary Calculator CTA */}
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <CalculatorCta calc={article.primaryCalculator} />
              </div>

              {/* Article Sections */}
              <div className={styles.prose}>
                {article.sections.map((section) => (
                  <section key={section.id} id={section.id}>
                    <h2>{section.title}</h2>
                    {section.paragraphs?.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}

                    {/* Section Callout */}
                    {section.callout && (
                      <div
                        className={`${styles.callout} ${
                          section.callout.type === 'warning'
                            ? styles.calloutWarning
                            : section.callout.type === 'tip'
                            ? styles.calloutTip
                            : styles.calloutInfo
                        }`}
                      >
                        <div className={styles.calloutTitle}>
                          {section.callout.type === 'warning' && <AlertTriangle size={18} />}
                          {section.callout.type === 'tip' && <Lightbulb size={18} />}
                          {section.callout.type === 'info' && <Info size={18} />}
                          {section.callout.title}
                        </div>
                        <p className={styles.calloutText}>{section.callout.text}</p>
                      </div>
                    )}

                    {/* Section Data Table */}
                    {section.table && (
                      <div className={styles.tableWrapper}>
                        <table className={styles.dataTable}>
                          <thead>
                            <tr>
                              {section.table.headers.map((h, hIdx) => (
                                <th key={hIdx}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.table.rows.map((row, rIdx) => (
                              <tr key={rIdx}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>
                ))}

                {/* Worked Example */}
                <section id="rechenbeispiel">
                  <h2>Praxisbeispiel: Schritt für Schritt nachgerechnet</h2>
                  <div className={styles.workedExampleCard}>
                    <div className={styles.workedExampleHeader}>
                      <BookOpen size={20} />
                      {article.workedExample.title}
                    </div>
                    <p style={{ marginBottom: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>
                      <strong>Ausgangslage:</strong> {article.workedExample.scenario}
                    </p>
                    <div className={styles.workedExampleFormula}>
                      Formel: {article.workedExample.formula}
                    </div>
                    <div className={styles.workedExampleSteps}>
                      {article.workedExample.steps.map((step, sIdx) => (
                        <div key={sIdx} className={styles.exampleStep}>
                          <span className={styles.stepLabel}>{step.label}</span>
                          <span className={styles.stepCalc}>{step.calculation}</span>
                          {step.note && <span className={styles.stepNote}>{step.note}</span>}
                        </div>
                      ))}
                    </div>
                    <div className={styles.exampleResult}>
                      Ergebnis: {article.workedExample.resultSummary}
                    </div>
                  </div>
                </section>

                {/* Common Mistakes */}
                {article.commonMistakes && article.commonMistakes.length > 0 && (
                  <section>
                    <div className={styles.mistakesCard}>
                      <div className={styles.mistakesTitle}>
                        <AlertTriangle size={20} />
                        Häufige Rechenfehler und Irrtümer
                      </div>
                      <div className={styles.mistakesGrid}>
                        {article.commonMistakes.map((m, mIdx) => (
                          <div key={mIdx} className={styles.mistakeItem}>
                            <span className={styles.mistakeWrong}>❌ Häufiger Fehler: {m.mistake}</span>
                            <span className={styles.mistakeRight}>✓ Richtig: {m.correction}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* Secondary Calculator CTA */}
                {article.secondaryCalculators && article.secondaryCalculators.length > 0 && (
                  <section style={{ margin: 'var(--space-8) 0' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>
                      Verwandte Rechner für dieses Thema
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                      {article.secondaryCalculators.map((secCalc) => (
                        <CalculatorCta key={secCalc.slug} calc={secCalc} variant="sidebar" />
                      ))}
                    </div>
                  </section>
                )}

                {/* FAQs */}
                <ArticleFaqAccordion faqs={article.faqs} />

                {/* Official Sources */}
                {article.officialSources && article.officialSources.length > 0 && (
                  <section className={styles.sourcesSection}>
                    <div className={styles.sourcesTitle}>
                      <Info size={16} />
                      Offizielle Quellen, Gesetze & Richtlinien
                    </div>
                    <ul className={styles.sourcesList}>
                      {article.officialSources.map((source, sIdx) => (
                        <li key={sIdx}>
                          {source.url ? (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'inherit', textDecoration: 'underline' }}
                            >
                              <strong>{source.title}</strong>: {source.citation} <ExternalLink size={12} style={{ display: 'inline' }} />
                            </a>
                          ) : (
                            <span>
                              <strong>{source.title}</strong>: {source.citation}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className={styles.sidebar}>
              <TableOfContents sections={article.sections} />

              <CalculatorCta calc={article.primaryCalculator} variant="sidebar" />

              {/* Related Articles Card */}
              {relatedArticles.length > 0 && (
                <div className={styles.tocCard}>
                  <div className={styles.tocTitle}>Passende Ratgeber</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {relatedArticles.map((rel) => (
                      <Link
                        key={rel.slug}
                        href={`/ratgeber/${rel.slug}/`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                          {rel.categoryName}
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text-primary)', marginTop: '2px', lineHeight: 1.35 }}>
                          {rel.title}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
