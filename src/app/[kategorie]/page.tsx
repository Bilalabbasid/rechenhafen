import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { CATEGORIES, getCategoryBySlug } from '@/data/categories';
import { getCalculatorsByCategory } from '@/data/calculators';
import Breadcrumbs from '@/components/calculator/Breadcrumbs';
import * as LucideIcons from 'lucide-react';
import styles from '@/styles/layout.module.css';
import compStyles from '@/styles/components.module.css';

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
  const IconComponent = (LucideIcons as any)[cat.iconName] || LucideIcons.Calculator;

  // Group calculators by subcategory
  const subcategoryGroups: Record<string, typeof calculators> = {};
  for (const c of calculators) {
    const sub = c.subcategory || 'Weitere Rechner';
    if (!subcategoryGroups[sub]) {
      subcategoryGroups[sub] = [];
    }
    subcategoryGroups[sub].push(c);
  }

  return (
    <div className={styles.container}>
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: cat.name }]} />

      {/* Header */}
      <div style={{
        padding: 'var(--space-6) 0 var(--space-8)',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: 'var(--space-8)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 'var(--space-4)' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <IconComponent size={28} />
          </div>
          <div>
            <h1 style={{
              fontSize: 'clamp(1.85rem, 4vw, 2.65rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: 0,
              color: 'var(--color-text-primary)'
            }}>
              {cat.name}
            </h1>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              {calculators.length} spezialisierte Online-Rechner
            </span>
          </div>
        </div>

        <p style={{
          fontSize: '1.1rem',
          lineHeight: 1.6,
          color: 'var(--color-text-secondary)',
          maxWidth: '820px',
          margin: 0
        }}>
          {cat.description}
        </p>

        {/* Subcategories pill bar */}
        {cat.subcategories && cat.subcategories.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'var(--space-4)' }}>
            {cat.subcategories.map((sub) => (
              <span
                key={sub}
                style={{
                  fontSize: '0.8rem',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
                  fontWeight: 500
                }}
              >
                {sub}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Grouped Calculators */}
      {Object.entries(subcategoryGroups).map(([subName, calcs]) => (
        <section key={subName} style={{ marginBottom: 'var(--space-10)' }}>
          <h2 style={{
            fontSize: '1.35rem',
            fontWeight: 700,
            marginBottom: 'var(--space-4)',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ width: '4px', height: '18px', background: 'var(--color-primary)', borderRadius: '2px', display: 'inline-block' }}></span>
            {subName}
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>
              ({calcs.length})
            </span>
          </h2>

          <div className={compStyles.relatedGrid}>
            {calcs.map((calc) => (
              <Link
                key={calc.id}
                href={`/rechner/${calc.slug}/`}
                className={compStyles.relatedCard}
              >
                <div className={compStyles.relatedCardHeader}>
                  <LucideIcons.Calculator size={18} className={compStyles.relatedIcon} />
                  <h3 className={compStyles.relatedCardTitle}>{calc.name}</h3>
                </div>
                <p className={compStyles.relatedCardDesc}>{calc.shortDescription}</p>
                <div className={compStyles.relatedCardAction}>
                  <span>Jetzt berechnen</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Fallback if no calculators yet */}
      {calculators.length === 0 && (
        <div style={{ textAlign: 'center', padding: 'var(--space-12) 0' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            In dieser Kategorie stehen in Kürze weitere Rechner bereit.
          </p>
          <Link href="/" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            ← Zurück zur Startseite
          </Link>
        </div>
      )}
    </div>
  );
}
