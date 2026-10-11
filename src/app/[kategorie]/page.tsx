import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { CATEGORIES, getCategoryBySlug } from '@/data/categories';
import { getCalculatorsByCategory } from '@/data/calculators';
import { getArticlesByCategory } from '@/data/ratgeber/articles';
import Breadcrumbs from '@/components/calculator/Breadcrumbs';
import CategoryIcon from '@/components/common/CategoryIcon';
import CategoryCard from '@/components/common/CategoryCard';
import CategoryCalculatorsView from '@/components/calculator/CategoryCalculatorsView';
import PopularDateCalculators from '@/components/calculator/PopularDateCalculators';
import CategoryFocusCalculators from '@/components/calculator/CategoryFocusCalculators';
import AdSlot from '@/components/common/AdSlot';
import styles from '@/styles/layout.module.css';
import cardsStyles from '@/styles/cards.module.css';

import { formatMetaTitle } from '@/lib/seo/title';

interface PageProps {
  params: Promise<{ kategorie: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    kategorie: cat.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { kategorie } = await params;
  const cat = getCategoryBySlug(kategorie);

  if (!cat) {
    return {
      title: 'Kategorie nicht gefunden',
    };
  }

  const canonicalUrl = `https://rechenhafen.de/${cat.slug}/`;
  const cleanTitle = formatMetaTitle(cat.metaTitle);

  return {
    title: cleanTitle,
    description: cat.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: cleanTitle,
      description: cat.metaDescription,
      url: canonicalUrl,
      siteName: 'RechenHafen',
      locale: 'de_DE',
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { kategorie } = await params;
  const cat = getCategoryBySlug(kategorie);

  if (!cat) {
    notFound();
  }

  const calculators = getCalculatorsByCategory(cat.slug);

  // Serializable calculator list
  const serializedCalcs = calculators.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    shortName: c.shortName,
    shortDescription: c.shortDescription,
    category: c.category,
    subcategory: c.subcategory,
  }));

  // Related categories (excluding current)
  const relatedCategories = CATEGORIES.filter((c) => c.slug !== cat.slug).slice(0, 4);

  return (
    <div className={styles.container}>
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: cat.name, href: `/${cat.slug}/` }]} />

      {/* Category Hero Header */}
      <section style={{
        padding: 'var(--space-6) 0 var(--space-6)',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: 'var(--space-6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: 'var(--space-3)' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <CategoryIcon name={cat.iconName} size={24} />
          </div>
          <div>
            <h1 style={{
              fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: 0,
              color: 'var(--color-text-primary)'
            }}>
              {cat.name}
            </h1>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              {calculators.length} {calculators.length === 1 ? 'Online-Rechner' : 'Online-Rechner'} in diesem Bereich
            </span>
          </div>
        </div>

        <p style={{
          fontSize: '1.05rem',
          lineHeight: 1.6,
          color: 'var(--color-text-secondary)',
          maxWidth: '780px',
          margin: 0
        }}>
          {cat.description}
        </p>
      </section>

      {/* Beliebte Datumsrechner auf der Datum & Zeit Themen-Hubseite */}
      {cat.slug === 'datum-zeit' && (
        <PopularDateCalculators />
      )}

      {/* Fokus-Rechner für priorisierte Themenbereiche (Haushalt, Mobilität, Bauen) */}
      <CategoryFocusCalculators categorySlug={cat.slug} />

      {/* Interactive Category Search & Calculators Grid */}
      <CategoryCalculatorsView
        calculators={serializedCalcs}
        subcategories={cat.subcategories}
        categoryName={cat.name}
      />

      {/* Zero-CLS Werbefläche am Ende der Rechnerliste */}
      <div style={{ margin: 'var(--space-8) 0' }}>
        <AdSlot format="top-banner" slotId={`cat-${cat.slug}-bottom`} />
      </div>

      {/* Passende Fachartikel & Ratgeber zur Kategorie */}
      {(() => {
        const catArticles = getArticlesByCategory(cat.slug);
        if (catArticles.length === 0) return null;
        return (
          <section
            style={{
              margin: 'var(--space-8) 0 var(--space-6)',
              padding: 'var(--space-6)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
                  Passende Ratgeber & Fachartikel zu {cat.name}
                </h2>
                <p style={{ margin: '2px 0 0', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  Hintergründe, Praxistipps und Rechenanleitungen unserer Fachredaktion
                </p>
              </div>
              <Link href="/ratgeber/" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                Alle Ratgeber anzeigen →
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'var(--space-4)',
              }}
            >
              {catArticles.map((art) => (
                <Link
                  key={art.slug}
                  href={`/ratgeber/${art.slug}/`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 'var(--space-4)',
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)', marginBottom: '6px', lineHeight: 1.35 }}>
                    {art.title}
                  </strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5, flex: 1 }}>
                    {art.summary.slice(0, 130)}...
                  </p>
                  <span style={{ marginTop: 'var(--space-3)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                    Artikel lesen →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Related Categories */}
      <section style={{
        marginTop: 'var(--space-10)',
        marginBottom: 'var(--space-10)',
        borderTop: '1px solid var(--color-border)',
        paddingTop: 'var(--space-8)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-4)' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
              Weitere passende Themenbereiche
            </h2>
            <p style={{ margin: '2px 0 0', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              Entdecken Sie weitere spezialisierte Online-Rechner
            </p>
          </div>
          <Link href="/rechner/" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)' }}>
            Alle Kategorien →
          </Link>
        </div>

        <div className={cardsStyles.categoryGrid}>
          {relatedCategories.map((rCat) => {
            const count = getCalculatorsByCategory(rCat.slug).length;
            return (
              <CategoryCard
                key={rCat.id}
                slug={rCat.slug}
                name={rCat.name}
                iconName={rCat.iconName}
                description={rCat.description}
                calculatorCount={count}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
