import React from 'react';
import Link from 'next/link';
import {
  Calculator,
  Percent,
  CreditCard,
  Receipt,
  Calendar,
  Car,
  Zap,
  Activity,
  Home,
  Briefcase,
  LucideIcon,
} from 'lucide-react';
import styles from '@/styles/cards.module.css';

interface CalculatorCardProps {
  slug: string;
  name: string;
  shortName?: string;
  shortDescription: string;
  category?: string;
  categoryName?: string;
}

function resolveIcon(slug: string, category?: string): LucideIcon {
  const s = slug.toLowerCase();
  const c = category?.toLowerCase() || '';

  if (s.includes('prozent')) return Percent;
  if (s.includes('gehalt') || s.includes('brutto') || s.includes('netto') || s.includes('lohn') || s.includes('steuer') || c.includes('steuer')) return Receipt;
  if (s.includes('zins') || s.includes('kredit') || s.includes('tilgung') || s.includes('spar') || c.includes('finanz')) return CreditCard;
  if (s.includes('alter') || s.includes('datum') || s.includes('zeit') || s.includes('tag') || c.includes('datum')) return Calendar;
  if (s.includes('sprit') || s.includes('auto') || s.includes('pendler') || s.includes('fahrt') || c.includes('auto')) return Car;
  if (s.includes('strom') || s.includes('energie') || s.includes('watt') || s.includes('gas') || c.includes('energie')) return Zap;
  if (s.includes('bmi') || s.includes('kalorien') || s.includes('gewicht') || c.includes('gesundheit')) return Activity;
  if (s.includes('haus') || s.includes('miet') || s.includes('kaufneben') || c.includes('wohnen')) return Home;
  if (c.includes('arbeit')) return Briefcase;

  return Calculator;
}

export default function CalculatorCard({
  slug,
  name,
  shortName,
  shortDescription,
  category,
  categoryName,
}: CalculatorCardProps) {
  const Icon = resolveIcon(slug, category);
  const displayName = shortName || name;

  return (
    <Link
      href={`/rechner/${slug}/`}
      className={styles.calcCard}
      title={`${displayName} öffnen`}
    >
      <div className={styles.iconWrapper} aria-hidden="true">
        <Icon size={20} />
      </div>

      <h3 className={styles.calcTitle}>{displayName}</h3>

      <p className={styles.calcDesc}>{shortDescription}</p>

      <div className={styles.cardFooter}>
        <span className={styles.categoryBadge}>
          {categoryName || category || 'Rechner'}
        </span>
        <span className={styles.actionIndicator} aria-hidden="true">
          <span className={styles.actionArrow}>→</span>
        </span>
      </div>
    </Link>
  );
}
