import React from 'react';
import Link from 'next/link';
import { CalculatorDefinition } from '@/types/calculator';
import styles from '@/styles/components.module.css';
import { Calculator, ArrowRight } from 'lucide-react';

interface Props {
  calculators: CalculatorDefinition[];
  categoryName?: string;
  categorySlug?: string;
}

export default function RelatedCalculators({ calculators, categoryName, categorySlug }: Props) {
  if (!calculators || calculators.length === 0) return null;

  return (
    <section className={styles.relatedSection} aria-labelledby="related-heading">
      <div className={styles.relatedHeader}>
        <h2 id="related-heading" className={styles.sectionTitle}>
          Verwandte Online-Rechner
        </h2>
        {categorySlug && (
          <Link href={`/${categorySlug}/`} className={styles.categoryBackLink}>
            Alle Rechner in {categoryName || 'dieser Kategorie'} <ArrowRight size={14} />
          </Link>
        )}
      </div>

      <div className={styles.relatedGrid}>
        {calculators.map((calc) => (
          <Link
            key={calc.id}
            href={`/rechner/${calc.slug}/`}
            className={styles.relatedCard}
          >
            <div className={styles.relatedCardHeader}>
              <Calculator size={18} className={styles.relatedIcon} />
              <h3 className={styles.relatedCardTitle}>{calc.name}</h3>
            </div>
            <p className={styles.relatedCardDesc}>{calc.shortDescription}</p>
            <span className={styles.relatedCardAction}>
              Rechner öffnen <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
