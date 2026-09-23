import React from 'react';
import Link from 'next/link';
import styles from '@/styles/layout.module.css';
import { CATEGORIES } from '@/data/categories';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  const popularCategories = CATEGORIES.slice(0, 8);
  const moreCategories = CATEGORIES.slice(8, 16);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.footerBrandCol}>
          <div className={styles.brand}>
            <div className={styles.brandLogo}>RH</div>
            <div className={styles.brandText}>
              <span className={styles.brandName}>RechenHafen</span>
              <span className={styles.brandTagline}>Alle Rechner an einem Ort</span>
            </div>
          </div>
          <p className={styles.footerText}>
            RechenHafen ist die verlässliche deutsche Online-Plattform mit Hunderten präzisen Rechnern für Finanzen, Mobilität, Immobilien, Alltag, Mathematik und Gesundheit.
          </p>
          <div className={styles.privacyBadge}>
            <ShieldCheck size={16} /> 100 % Lokale Berechnung – Keine Eingabedaten verlassen Ihren Browser
          </div>
        </div>

        <div>
          <h4 className={styles.footerColTitle}>Rechner-Bereiche</h4>
          <ul className={styles.footerList}>
            {popularCategories.map((cat) => (
              <li key={cat.id}>
                <Link href={`/${cat.slug}/`} className={styles.footerLink}>
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className={styles.footerColTitle}>Weitere Kategorien</h4>
          <ul className={styles.footerList}>
            {moreCategories.map((cat) => (
              <li key={cat.id}>
                <Link href={`/${cat.slug}/`} className={styles.footerLink}>
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className={styles.footerColTitle}>Plattform & Recht</h4>
          <ul className={styles.footerList}>
            <li><Link href="/rechner/" className={styles.footerLink}>Alle Rechner (Verzeichnis)</Link></li>
            <li><Link href="/ueber-uns/" className={styles.footerLink}>Über RechenHafen</Link></li>
            <li><Link href="/methodik/" className={styles.footerLink}>Methodik & Quellen</Link></li>
            <li><Link href="/impressum/" className={styles.footerLink}>Impressum</Link></li>
            <li><Link href="/datenschutz/" className={styles.footerLink}>Datenschutz</Link></li>
          </ul>
        </div>
      </div>

      <div className={`container ${styles.footerBottom}`}>
        <span>© {new Date().getFullYear()} RechenHafen.de – Alle Rechte vorbehalten.</span>
        <span>Entwickelt und redaktionell gepflegt in Deutschland. Berechnungen erfolgen nach anerkannten Normen und Gesetzen.</span>
      </div>
    </footer>
  );
}
