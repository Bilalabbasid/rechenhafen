import React from 'react';
import Link from 'next/link';
import styles from '@/styles/layout.module.css';
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <Link href="/" className={styles.brand} aria-label="RechenHafen Startseite">
          <div className={styles.brandLogo}>RH</div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>RechenHafen</span>
            <span className={styles.brandTagline}>Alle Rechner an einem Ort</span>
          </div>
        </Link>

        <div className={styles.searchWrapper}>
          <SearchBar />
        </div>

        <nav className={styles.nav} aria-label="Hauptnavigation">
          <Link href="/finanzen/" className={styles.navLink}>Finanzen</Link>
          <Link href="/auto-verkehr/" className={styles.navLink}>Auto & Verkehr</Link>
          <Link href="/arbeit-gehalt/" className={styles.navLink}>Arbeit</Link>
          <Link href="/datum-zeit/" className={styles.navLink}>Datum & Zeit</Link>
          <Link href="/haushalt-energie/" className={styles.navLink}>Energie</Link>
        </nav>
      </div>
    </header>
  );
}
