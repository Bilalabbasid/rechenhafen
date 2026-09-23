import React from 'react';
import Link from 'next/link';
import CategoryIcon from '@/components/common/CategoryIcon';
import styles from '@/styles/cards.module.css';

interface CategoryCardProps {
  slug: string;
  name: string;
  iconName: string;
  description: string;
  calculatorCount: number;
}

export default function CategoryCard({
  slug,
  name,
  iconName,
  description,
  calculatorCount,
}: CategoryCardProps) {
  return (
    <Link href={`/${slug}/`} className={styles.catCard} title={`Zur Kategorie ${name}`}>
      <div className={styles.catIconBox} aria-hidden="true">
        <CategoryIcon name={iconName} size={22} />
      </div>
      <div className={styles.catContent}>
        <h3 className={styles.catTitle}>{name}</h3>
        <p className={styles.catDesc}>{description}</p>
        <div className={styles.catMeta}>
          <span>{calculatorCount} {calculatorCount === 1 ? 'Rechner' : 'Rechner'}</span>
          <span className={styles.catArrow} aria-hidden="true">→</span>
        </div>
      </div>
    </Link>
  );
}
