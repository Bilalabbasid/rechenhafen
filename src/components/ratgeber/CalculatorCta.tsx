import React from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight } from 'lucide-react';
import styles from '@/styles/ratgeber.module.css';
import { RatgeberCalculatorLink } from '@/types/ratgeber';

interface CalculatorCtaProps {
  calc: RatgeberCalculatorLink;
  variant?: 'inline' | 'sidebar';
}

export default function CalculatorCta({ calc, variant = 'inline' }: CalculatorCtaProps) {
  const href = `/rechner/${calc.slug}/`;

  if (variant === 'sidebar') {
    return (
      <div className={styles.calcCtaMini}>
        {calc.badge && <span className={styles.categoryBadge}>{calc.badge}</span>}
        <h3 className={styles.calcCtaMiniTitle}>{calc.title}</h3>
        <p className={styles.calcCtaMiniDesc}>{calc.description}</p>
        <Link href={href} className={styles.calcCtaMiniButton}>
          <Calculator size={16} />
          {calc.ctaText}
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.calcCtaCard}>
      <span className={styles.calcCtaBadge}>
        <Calculator size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
        Direkt online berechnen
      </span>
      <h3 className={styles.calcCtaTitle}>{calc.title}</h3>
      <p className={styles.calcCtaDesc}>{calc.description}</p>
      <div>
        <Link href={href} className={styles.calcCtaButton}>
          {calc.ctaText}
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
