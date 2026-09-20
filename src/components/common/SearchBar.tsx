'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Calculator } from 'lucide-react';
import styles from '@/styles/search.module.css';

interface SearchResult {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
}

interface Props {
  placeholder?: string;
  onSelect?: () => void;
  className?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  placeholder = 'Rechner suchen (z.B. Zinseszins, Sprit, Alter, MwSt)...',
  onSelect,
  className,
  autoFocus = false,
}: Props) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const q = query.toLowerCase().trim();
    // Synonym mapping
    let searchTerms = [q];
    if (q.includes('sprit') || q.includes('benzin') || q.includes('diesel')) {
      searchTerms.push('spritkosten', 'kraftstoff', 'pendler');
    }
    if (q.includes('auto') || q.includes('kfz') || q.includes('wagen')) {
      searchTerms.push('spritkosten', 'pendlerpauschale', 'elektroauto', 'fahrzeit');
    }
    if (q.includes('alter') || q.includes('geburt') || q.includes('wie alt')) {
      searchTerms.push('altersrechner', 'alter-in-tagen', 'geburtstag');
    }
    if (q.includes('zins') || q.includes('anlage') || q.includes('sparen')) {
      searchTerms.push('zinseszins', 'sparrechner', 'sparziel', 'etf');
    }
    if (q.includes('kredit') || q.includes('darlehen') || q.includes('schulden')) {
      searchTerms.push('kreditrechner', 'tilgungsrechner', 'sondertilgung');
    }
    if (q.includes('strom') || q.includes('energie') || q.includes('watt')) {
      searchTerms.push('stromkosten', 'standby', 'gaskosten', 'led');
    }
    if (q.includes('steuer') || q.includes('mwst') || q.includes('ust')) {
      searchTerms.push('mwst-rechner', 'pendlerpauschale');
    }

    // Dynamic import oder direkte Suche aus Registry
    import('@/data/calculators').then(({ ALL_CALCULATORS }) => {
      const matched = ALL_CALCULATORS.filter((calc) => {
        const text = `${calc.name} ${calc.shortDescription} ${calc.searchKeywords.join(' ')} ${calc.category}`.toLowerCase();
        return searchTerms.some((term) => text.includes(term));
      }).slice(0, 8);

      setResults(
        matched.map((m) => ({
          id: m.id,
          slug: m.slug,
          name: m.name,
          categoryName: m.category,
        }))
      );
      setIsOpen(matched.length > 0);
    });
  }, [query]);

  // Schließen bei Klick außerhalb
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    if (onSelect) onSelect();
    router.push(`/rechner/${slug}/`);
  };

  return (
    <div ref={containerRef} className={`${styles.searchContainer} ${className || ''}`}>
      <div className={styles.inputWrapper}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setResults.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          aria-label="Rechner suchen"
          className={styles.searchInput}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className={styles.clearBtn}
            aria-label="Eingabe löschen"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className={styles.resultsDropdown}>
          <div className={styles.resultsHeader}>Gefundene Rechner</div>
          <ul className={styles.resultsList}>
            {results.map((res) => (
              <li key={res.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(res.slug)}
                  className={styles.resultItem}
                >
                  <Calculator size={16} className={styles.resultIcon} />
                  <div className={styles.resultText}>
                    <span className={styles.resultName}>{res.name}</span>
                    <span className={styles.resultCategory}>{res.categoryName}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isOpen && query.trim().length > 1 && results.length === 0 && (
        <div className={styles.resultsDropdown}>
          <div style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Keine passenden Rechner für „{query}“ gefunden.
          </div>
        </div>
      )}
    </div>
  );
}
