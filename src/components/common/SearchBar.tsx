'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Calculator, ArrowRight, CornerDownLeft } from 'lucide-react';
import styles from '@/styles/search.module.css';

interface SearchResult {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription?: string;
}

interface Props {
  placeholder?: string;
  onSelect?: () => void;
  className?: string;
  autoFocus?: boolean;
  variant?: 'default' | 'hero';
}

const POPULAR_SUGGESTIONS = [
  { name: 'Brutto-Netto', slug: 'brutto-netto-rechner' },
  { name: 'Prozentrechner', slug: 'prozentrechner' },
  { name: 'Zinseszins', slug: 'zinseszinsrechner' },
  { name: 'Altersrechner', slug: 'altersrechner' },
  { name: 'Spritkosten', slug: 'spritkostenrechner' },
  { name: 'BMI-Rechner', slug: 'bmi-rechner' },
];

export default function SearchBar({
  placeholder = 'Rechner suchen, z. B. Brutto Netto, Prozent, BMI ...',
  onSelect,
  className,
  autoFocus = false,
  variant = 'default',
}: Props) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsListRef = useRef<HTMLUListElement>(null);
  const router = useRouter();

  // Global Shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        if (query.trim() && results.length > 0) {
          setIsOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [query, results]);

  // Search logic using lightweight searchIndex
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    const q = query.toLowerCase().trim();
    const tokens = q.split(/\s+/).filter(Boolean);

    // German Synonym expansions
    const searchTerms = [...tokens];
    if (q.includes('gehalt') || q.includes('lohn') || q.includes('brutto') || q.includes('netto')) {
      searchTerms.push('brutto-netto', 'gehaltsrechner', 'nettolohn', 'stundenlohn', 'teilzeit');
    }
    if (q.includes('auto') || q.includes('kfz') || q.includes('sprit') || q.includes('diesel') || q.includes('benzin')) {
      searchTerms.push('spritkosten', 'pendlerpauschale', 'verbrauch', 'fahrzeit');
    }
    if (q.includes('alter') || q.includes('geburt') || q.includes('wie alt')) {
      searchTerms.push('altersrechner', 'alter in tagen', 'geburtstag');
    }
    if (q.includes('steuer') || q.includes('einkommensteuer') || q.includes('solz') || q.includes('mwst') || q.includes('ust')) {
      searchTerms.push('einkommensteuer', 'grenzsteuersatz', 'abfindung', 'umsatzsteuer', 'mwst');
    }
    if (q.includes('zins') || q.includes('kredit') || q.includes('darlehen') || q.includes('sparen')) {
      searchTerms.push('zinseszins', 'kreditrechner', 'tilgungsrechner', 'sparrechner');
    }

    import('@/data/searchIndex').then(({ SEARCH_INDEX }) => {
      // Score and rank matches
      const matched = SEARCH_INDEX.map((item) => {
        const nameLower = item.name.toLowerCase();
        const catLower = item.category.toLowerCase();
        const kwLower = item.keywords.join(' ').toLowerCase();
        let score = 0;

        // Exact name start matches get highest priority
        if (nameLower.startsWith(q)) score += 50;
        else if (nameLower.includes(q)) score += 30;

        // Token matches
        for (const token of tokens) {
          if (nameLower.includes(token)) score += 15;
          if (kwLower.includes(token)) score += 8;
          if (catLower.includes(token)) score += 5;
        }

        // Synonym matches
        for (const term of searchTerms) {
          if (nameLower.includes(term) || kwLower.includes(term)) score += 4;
        }

        return { item, score };
      })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map((entry) => ({
          id: entry.item.id,
          slug: entry.item.slug,
          name: entry.item.name,
          category: entry.item.category,
        }));

      setResults(matched);
      setIsOpen(true);
      setSelectedIndex(-1);
    });
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (slug: string) => {
      setIsOpen(false);
      setQuery('');
      setSelectedIndex(-1);
      if (onSelect) onSelect();
      router.push(`/rechner/${slug}/`);
    },
    [onSelect, router]
  );

  // Keyboard navigation: ArrowDown, ArrowUp, Enter, Escape
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' && results.length > 0) {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex].slug);
      } else if (results.length > 0) {
        handleSelect(results[0].slug);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Ensure active element is scrolled into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsListRef.current) {
      const activeEl = resultsListRef.current.children[selectedIndex] as HTMLElement;
      activeEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Highlight query term in result name
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className={styles.highlightMark}>
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.searchContainer} ${variant === 'hero' ? styles.heroSearch : ''} ${className || ''}`}
    >
      <div className={styles.inputWrapper}>
        <Search size={variant === 'hero' ? 20 : 18} className={styles.searchIcon} aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          autoFocus={autoFocus}
          maxLength={100}
          onChange={(e) => setQuery(e.target.value.slice(0, 100))}
          onFocus={() => {
            if (query.trim() && results.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Rechner suchen"
          aria-expanded={isOpen}
          aria-controls="search-results-list"
          aria-autocomplete="list"
          role="combobox"
          className={styles.searchInput}
        />
        <div className={styles.inputActions}>
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className={styles.clearBtn}
              aria-label="Eingabe löschen"
            >
              <X size={16} />
            </button>
          ) : (
            <kbd className={styles.kbdBadge} aria-hidden="true">
              Strg K
            </kbd>
          )}
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div className={styles.resultsDropdown} role="listbox">
          <div className={styles.resultsHeader}>
            <span>Gefundene Rechner</span>
            <span className={styles.resultsHeaderHint}>
              <CornerDownLeft size={11} style={{ display: 'inline', marginRight: 3, verticalAlign: -1 }} />
              Eingabe zum Öffnen
            </span>
          </div>
          <ul id="search-results-list" ref={resultsListRef} className={styles.resultsList}>
            {results.map((res, index) => {
              const isSelected = index === selectedIndex;
              return (
                <li key={res.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(res.slug)}
                    className={`${styles.resultItem} ${isSelected ? styles.resultItemActive : ''}`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <Calculator size={18} className={styles.resultIcon} aria-hidden="true" />
                    <div className={styles.resultText}>
                      <div className={styles.resultTitleRow}>
                        <span className={styles.resultName}>
                          {renderHighlightedText(res.name, query.trim())}
                        </span>
                        <span className={styles.resultCategory}>{res.category}</span>
                      </div>
                    </div>
                    <ArrowRight size={14} className={styles.resultArrow} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {isOpen && query.trim().length > 1 && results.length === 0 && (
        <div className={styles.resultsDropdown}>
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              Kein passender Rechner für „<strong>{query}</strong>“ gefunden.
            </p>
            <div className={styles.suggestionsTitle}>Beliebte Vorschläge:</div>
            <div className={styles.suggestionChips}>
              {POPULAR_SUGGESTIONS.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => handleSelect(item.slug)}
                  className={styles.suggestionChip}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
