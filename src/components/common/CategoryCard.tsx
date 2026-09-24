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
      <div className={styles.catTopRow}>
        <div className={styles.catIconBox} aria-hidden="true">
          <CategoryIcon name={iconName} size={20} />
        </div>
        <span className={styles.catCountBadge}>
          {calculatorCount} Rechner
        </span>
      </div>

      <h3 className={styles.catTitle}>{name}</h3>
      <p className={styles.catDesc}>{description}</p>

      <div className={styles.catBottomRow}>
        <span className={styles.catExploreText}>Kategorie entdecken</span>
        <span className={styles.catArrow} aria-hidden="true">→</span>
      </div>
    </Link>
  );
}
