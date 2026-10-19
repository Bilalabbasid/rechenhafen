'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bookmark, Clock, X, Trash2, ArrowRight } from 'lucide-react';
import {
  getFavoriteSlugs,
  removeFavoriteCalculator,
  getRecentCalculators,
  clearRecentCalculators,
  RecentCalculatorItem,
} from '@/lib/storage/favorites';
import styles from '@/styles/layout.module.css';

let searchIndexPromise: Promise<Record<string, string>> | undefined;

function getCalculatorNamesMap(): Promise<Record<string, string>> {
  if (!searchIndexPromise) {
    searchIndexPromise = import('@/data/searchIndex').then(({ SEARCH_INDEX }) => {
      const map: Record<string, string> = {};
      for (const item of SEARCH_INDEX) {
        map[item.slug] = item.name;
      }
      return map;
    });
  }
  return searchIndexPromise;
}

export default function SavedCalculatorsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<RecentCalculatorItem[]>([]);
  const [nameMap, setNameMap] = useState<Record<string, string>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  const refreshData = () => {
    setFavorites(getFavoriteSlugs());
    setRecents(getRecentCalculators());
  };

  useEffect(() => {
    refreshData();
    getCalculatorNamesMap().then(setNameMap).catch(() => {});

    const handleFavChange = () => refreshData();
    const handleRecentChange = () => refreshData();

    window.addEventListener('rechenhafen_favorites_changed', handleFavChange);
    window.addEventListener('rechenhafen_recent_changed', handleRecentChange);

    return () => {
      window.removeEventListener('rechenhafen_favorites_changed', handleFavChange);
      window.removeEventListener('rechenhafen_recent_changed', handleRecentChange);
    };
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleRemoveFavorite = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavoriteCalculator(slug);
    setFavorites((prev) => prev.filter((s) => s !== slug));
  };

  const handleClearRecents = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearRecentCalculators();
    setRecents([]);
  };

  const getDisplayName = (slug: string): string => {
    if (nameMap[slug]) return nameMap[slug];
    // Fallback formatted from slug
    return slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const totalCount = favorites.length;

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={styles.moreButton}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '7px 10px',
          position: 'relative',
        }}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Gemerkte Rechner (${totalCount} gespeichert)`}
        title="Gemerkte und zuletzt verwendete Rechner anzeigen"
      >
        <Bookmark size={16} />
        <span className="hide-on-mobile" style={{ fontSize: '0.85rem' }}>Gemerkt</span>
        {totalCount > 0 && (
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              borderRadius: '999px',
              padding: '1px 6px',
              lineHeight: 1.2,
            }}
          >
            {totalCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Gemerkte und zuletzt verwendete Rechner"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 'clamp(280px, 90vw, 360px)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl, 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1))',
            padding: '14px',
            zIndex: 1000,
            maxHeight: '85vh',
            overflowY: 'auto',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--color-border)',
              marginBottom: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Gemerkte Rechner
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Nur in diesem Browser gespeichert.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Fenster schließen"
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
                borderRadius: '4px',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Section: Favorites */}
          <div style={{ marginBottom: '16px' }}>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Bookmark size={13} style={{ color: 'var(--color-primary)' }} />
              <span>Favoriten ({favorites.length})</span>
            </div>

            {favorites.length === 0 ? (
              <div
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-text-secondary)',
                  padding: '10px',
                  backgroundColor: 'var(--color-surface-hover)',
                  borderRadius: 'var(--radius-md)',
                  lineHeight: 1.4,
                }}
              >
                Noch keine Rechner gemerkt. Klicken Sie auf einer Rechnerseite auf »Rechner merken«, um ihn hier für schnellen Zugriff zu speichern.
              </div>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {favorites.map((slug) => (
                  <li
                    key={slug}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--color-surface-hover)',
                      borderRadius: 'var(--radius-md)',
                      padding: '6px 10px',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <Link
                      href={`/rechner/${slug}/`}
                      onClick={() => setIsOpen(false)}
                      style={{
                        fontSize: '0.825rem',
                        fontWeight: 500,
                        color: 'var(--color-text-primary)',
                        textDecoration: 'none',
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginRight: '8px',
                      }}
                      title={getDisplayName(slug)}
                    >
                      {getDisplayName(slug)}
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveFavorite(slug, e)}
                      title="Aus Gemerkten entfernen"
                      aria-label={`${getDisplayName(slug)} aus Gemerkten entfernen`}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px',
                        cursor: 'pointer',
                        color: 'var(--color-text-muted)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Section: Recently Used */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <Clock size={13} />
                <span>Zuletzt verwendet</span>
              </div>
              {recents.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearRecents}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '2px 4px',
                    fontSize: '0.7rem',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Verlauf leeren
                </button>
              )}
            </div>

            {recents.length === 0 ? (
              <div
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-text-muted)',
                  fontStyle: 'italic',
                }}
              >
                Noch keine kürzlichen Berechnungen in diesem Browser.
              </div>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {recents.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/rechner/${item.slug}/`}
                      onClick={() => setIsOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        fontSize: '0.825rem',
                        color: 'var(--color-text-secondary)',
                        textDecoration: 'none',
                        borderRadius: 'var(--radius-md)',
                      }}
                      className="hover-bg"
                    >
                      <span
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginRight: '8px',
                        }}
                      >
                        {getDisplayName(item.slug)}
                      </span>
                      <ArrowRight size={12} style={{ flexShrink: 0, opacity: 0.6 }} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
