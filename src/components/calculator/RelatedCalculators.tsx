import React from 'react';
import Link from 'next/link';
import { CalculatorDefinition } from '@/types/calculator';
import CalculatorCard from '@/components/common/CalculatorCard';
import cardsStyles from '@/styles/cards.module.css';
import { ArrowRight } from 'lucide-react';

interface Props {
  calculators: CalculatorDefinition[];
  categoryName?: string;
  categorySlug?: string;
}

export default function RelatedCalculators({ calculators, categoryName, categorySlug }: Props) {
  if (!calculators || calculators.length === 0) return null;

  return (
    <section
      style={{
        marginTop: 'var(--space-10)',
        marginBottom: 'var(--space-10)',
        borderTop: '1px solid var(--color-border)',
        paddingTop: 'var(--space-8)',
        width: '100%',
      }}
      aria-labelledby="related-heading"
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-6)',
      }}>
        <h2 id="related-heading" style={{
          fontSize: 'clamp(1.2rem, 3vw, 1.45rem)',
          fontWeight: 700,
          margin: 0,
          color: 'var(--color-text-primary)'
        }}>
          Passende Rechner
        </h2>
        {categorySlug && (
          <Link
            href={`/${categorySlug}/`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
              textDecoration: 'none'
            }}
          >
            Alle Rechner in {categoryName || 'dieser Kategorie'} <ArrowRight size={14} />
          </Link>
        )}
      </div>

      <div className={cardsStyles.calculatorGrid}>
        {calculators.map((calc) => (
          <CalculatorCard
            key={calc.id}
            slug={calc.slug}
            name={calc.name}
            shortName={calc.shortName}
            shortDescription={calc.shortDescription}
            category={calc.category}
            categoryName={categoryName}
          />
        ))}
      </div>
    </section>
  );
}
