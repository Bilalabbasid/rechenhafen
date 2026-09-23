import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { CATEGORIES, getCategoryBySlug } from '@/data/categories';
import { getCalculatorsByCategory } from '@/data/calculators';
import Breadcrumbs from '@/components/calculator/Breadcrumbs';
import CategoryIcon from '@/components/common/CategoryIcon';
import CategoryCard from '@/components/common/CategoryCard';
import CategoryCalculatorsView from '@/components/calculator/CategoryCalculatorsView';
import AdSlot from '@/components/common/AdSlot';
import styles from '@/styles/layout.module.css';
import cardsStyles from '@/styles/cards.module.css';

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
      title: 'Kategorie nicht gefunden | RechenHafen',
    };
  }

  const canonicalUrl = `https://rechenhafen.de/${cat.slug}/`;

  return {
    title: cat.metaTitle,
    description: cat.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: cat.metaTitle,
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
