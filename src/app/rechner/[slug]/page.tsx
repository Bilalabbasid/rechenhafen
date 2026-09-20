import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ALL_CALCULATORS, getCalculatorBySlug, getRelatedCalculators } from '@/data/calculators';
import { getCategoryBySlug } from '@/data/categories';
import Breadcrumbs from '@/components/calculator/Breadcrumbs';
import CalculatorRunner from '@/components/calculator/CalculatorRunner';
import FormulaBox from '@/components/calculator/FormulaBox';
import FaqAccordion from '@/components/calculator/FaqAccordion';
import RelatedCalculators from '@/components/calculator/RelatedCalculators';
import styles from '@/styles/layout.module.css';
import { ShieldCheck, Info } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_CALCULATORS.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);

  if (!calc) {
    return {
      title: 'Rechner nicht gefunden | RechenHafen',
    };
  }

  const canonicalUrl = `https://rechenhafen.de/rechner/${calc.slug}/`;

  return {
    title: calc.metaTitle,
    description: calc.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: calc.metaTitle,
      description: calc.metaDescription,
      url: canonicalUrl,
      siteName: 'RechenHafen',
      locale: 'de_DE',
      type: 'website',
    },
  };
}

export default async function CalculatorPage({ params }: PageProps) {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);

  if (!calc) {
    notFound();
  }

  const category = getCategoryBySlug(calc.category);
  const relatedCalculators = getRelatedCalculators(calc, 6);

  const breadcrumbs = [
    ...(category ? [{ label: category.name, href: `/${category.slug}/` }] : []),
    { label: calc.shortName || calc.name },
  ];

  // Structured Data (SoftwareApplication)
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: calc.name,
    description: calc.metaDescription,
    url: `https://rechenhafen.de/rechner/${calc.slug}/`,
    applicationCategory: 'CalculatorApplication',
    operatingSystem: 'All',
    browserRequirements: 'Erfordert aktiviertes JavaScript. Funktioniert in allen modernen Webbrowsern.',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'EUR',
    },
  };

  return (
    <div className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Header section */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
          {category && (
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '2px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
            }}>
              {category.name}
            </span>
          )}
          {calc.subcategory && (
            <span style={{
              fontSize: '0.8rem',
              padding: '2px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-surface-hover)',
              color: 'var(--color-text-secondary)',
            }}>
              {calc.subcategory}
            </span>
          )}
          {calc.isTimeSensitive && calc.timeSensitiveMeta && (
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: '#ecfdf5',
              color: '#065f46',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ShieldCheck size={12} /> Stand: {calc.timeSensitiveMeta.year} (geprüft)
            </span>
          )}
        </div>

        <h1 style={{
          fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
          fontWeight: 800,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          margin: '0 0 var(--space-3)',
          color: 'var(--color-text-primary)'
        }}>
          {calc.h1}
        </h1>

        <p style={{
          fontSize: '1.05rem',
          lineHeight: 1.6,
          color: 'var(--color-text-secondary)',
          margin: 0,
          maxWidth: '780px'
        }}>
          {calc.shortDescription}
        </p>
      </div>

      {/* Main Interactive Calculator Runner */}
      <CalculatorRunner slug={calc.slug} />

      {/* Formula & Explanation */}
      <FormulaBox formula={calc.formula} formulaExplanation={calc.formulaExplanation} />

      {/* Worked Example */}
      {calc.workedExample && (
        <section style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          margin: 'var(--space-8) 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
            <Info size={18} style={{ color: 'var(--color-primary)' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
              {calc.workedExample.title}
            </h2>
          </div>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--color-text-secondary)', margin: '0 0 var(--space-3)' }}>
            {calc.workedExample.description}
          </p>
          <div style={{
            display: 'inline-block',
            padding: '6px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}>
            Ergebnis: {calc.workedExample.resultSummary || calc.workedExample.result}
          </div>
        </section>
      )}

      {/* Editorial Content: Intro & Details */}
      {(calc.content?.intro || calc.content?.details) && (
        <section style={{ margin: 'var(--space-8) 0', lineHeight: 1.7, color: 'var(--color-text-secondary)', fontSize: '0.975rem' }}>
          {calc.content.intro && (
            <p style={{ marginBottom: 'var(--space-4)' }}>{calc.content.intro}</p>
          )}
          {calc.content.details && (
            <p style={{ marginBottom: 'var(--space-4)' }}>{calc.content.details}</p>
          )}
        </section>
      )}

      {/* Frequently Asked Questions */}
      {calc.faqs && calc.faqs.length > 0 && (
        <FaqAccordion faqs={calc.faqs} />
      )}

      {/* Related Calculators */}
      <RelatedCalculators
        calculators={relatedCalculators}
        categoryName={category?.name}
        categorySlug={category?.slug}
      />
    </div>
  );
}
