'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import styles from '@/styles/layout.module.css';
import SearchBar from './SearchBar';

const PRIMARY_NAV_ITEMS = [
  { label: 'Alle Rechner', href: '/rechner/' },
  { label: 'Finanzen', href: '/finanzen/' },
  { label: 'Steuern & Gehalt', href: '/steuern-gehalt/' },
  { label: 'Auto & Verkehr', href: '/auto-verkehr/' },
  { label: 'Wohnen', href: '/wohnen-immobilien/' },
  { label: 'Ratgeber', href: '/ratgeber/' },
];

const MORE_NAV_ITEMS = [
  { label: 'Kredite & Zinsen', href: '/kredit-schulden/' },
  { label: 'Gesundheit & Fitness', href: '/gesundheit/' },
  { label: 'Datum & Zeit', href: '/datum-zeit/' },
  { label: 'Mathematik & Prozent', href: '/mathematik/' },
  { label: 'Arbeit & Gehalt', href: '/arbeit-gehalt/' },
  { label: 'Haushalt & Energie', href: '/haushalt-energie/' },
  { label: 'Bauen & Renovieren', href: '/bauen-renovieren/' },
  { label: 'Familie & Eltern', href: '/familie-schwangerschaft/' },
  { label: 'Geometrie & Flächen', href: '/geometrie/' },
  { label: 'Einheitenumrechner', href: '/einheiten/' },
  { label: 'Kochen & Backen', href: '/kochen-backen/' },
  { label: 'Business & Firma', href: '/business/' },
  { label: 'Statistik & Schule', href: '/statistik-wissenschaft/' },
];

export default function Header() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close menus on route change
  useEffect(() => {
    setIsMoreOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  }, [pathname]);

  // Click outside for More dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Escape key closes menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMoreOpen(false);
        setIsMobileMenuOpen(false);
        setIsMobileSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        {/* Brand Logo & Wordmark (Clutter-free) */}
        <Link href="/" className={styles.brand} aria-label="RechenHafen Startseite">
          <div className={styles.brandLogo} aria-hidden="true">
            RH
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>RechenHafen</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} aria-label="Hauptnavigation">
          {PRIMARY_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Mehr Dropdown */}
          <div ref={moreRef} className={styles.moreWrapper}>
            <button
              type="button"
              className={styles.moreButton}
              onClick={() => setIsMoreOpen((prev) => !prev)}
              aria-expanded={isMoreOpen}
              aria-haspopup="true"
              aria-label="Weitere Kategorien anzeigen"
            >
              <span>Mehr</span>
              <ChevronDown
                size={14}
                style={{
                  transition: 'transform 0.15s ease',
                  transform: isMoreOpen ? 'rotate(180deg)' : 'none',
                }}
              />
            </button>

            {isMoreOpen && (
              <div className={styles.moreDropdown} role="menu">
                {MORE_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={styles.moreItem}
                    role="menuitem"
                    onClick={() => setIsMoreOpen(false)}
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right Header Actions */}
        <div className={styles.headerActions}>
          <div className={styles.headerSearchWrapper}>
            <SearchBar variant="header" placeholder="Rechner suchen..." />
          </div>

          <button
            type="button"
            className={styles.mobileSearchBtn}
            onClick={() => setIsMobileSearchOpen((prev) => !prev)}
            aria-label="Rechner-Suche öffnen"
            aria-expanded={isMobileSearchOpen}
          >
            <Search size={18} />
          </button>

          <button
            type="button"
            className={styles.mobileMenuBtn}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className={styles.mobileSearchOverlay}>
          <SearchBar
            autoFocus
            placeholder="Rechner suchen..."
            onSelect={() => setIsMobileSearchOpen(false)}
          />
        </div>
      )}

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          className={styles.mobileDrawerOverlay}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className={styles.mobileDrawer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.drawerHeader}>
              <div className={styles.drawerTitle}>Kategorien & Navigation</div>
              <button
                type="button"
                className={styles.drawerCloseBtn}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Menü schließen"
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.drawerContent}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <SearchBar
                  placeholder="Rechner suchen..."
                  onSelect={() => setIsMobileMenuOpen(false)}
                />
              </div>

              <div className={styles.drawerSectionTitle}>Hauptkategorien</div>
              <ul className={styles.drawerNavList}>
                {PRIMARY_NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={styles.drawerNavLink}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>{item.label}</span>
                      <ArrowRight size={14} color="var(--color-text-muted)" />
                    </Link>
                  </li>
                ))}
              </ul>

              <div className={styles.drawerSectionTitle}>Weitere Kategorien</div>
              <ul className={styles.drawerNavList}>
                {MORE_NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={styles.drawerNavLink}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>{item.label}</span>
                      <ArrowRight size={14} color="var(--color-text-muted)" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.drawerFooter}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link href="/ueber-uns/" onClick={() => setIsMobileMenuOpen(false)}>Über uns</Link>
                <Link href="/methodik/" onClick={() => setIsMobileMenuOpen(false)}>Methodik</Link>
                <Link href="/datenschutz/" onClick={() => setIsMobileMenuOpen(false)}>Datenschutz</Link>
                <Link href="/impressum/" onClick={() => setIsMobileMenuOpen(false)}>Impressum</Link>
              </div>
              <div>© {new Date().getFullYear()} RechenHafen.de</div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
