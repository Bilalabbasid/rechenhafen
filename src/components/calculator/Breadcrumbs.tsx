import React from 'react';
import Link from 'next/link';
import styles from '@/styles/components.module.css';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: Props) {
  const fullItems: BreadcrumbItem[] = [
    { label: 'Startseite', href: '/' },
    ...items,
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: fullItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `https://rechenhafen.de${item.href}` : undefined,
    })),
  };

  return (
    <nav aria-label="Brotkrumennavigation" className={styles.breadcrumbsNav}>
      <ol className={styles.breadcrumbList}>
        {fullItems.map((item, idx) => {
          const isLast = idx === fullItems.length - 1;
          return (
            <li key={idx} className={styles.breadcrumbItem}>
              {idx > 0 && <ChevronRight size={14} className={styles.breadcrumbSeparator} />}
              {isLast || !item.href ? (
                <span className={styles.breadcrumbCurrent} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className={styles.breadcrumbLink}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </nav>
  );
}
