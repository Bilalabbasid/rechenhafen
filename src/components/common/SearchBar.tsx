'use client';

import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Calculator, ArrowRight, CornerDownLeft } from 'lucide-react';
import { searchCalculators, SearchResultItem } from '@/lib/search/searchEngine';
import styles from '@/styles/search.module.css';

interface Props {
  placeholder?: string;
  onSelect?: () => void;
  className?: string;
  autoFocus?: boolean;
  variant?: 'default' | 'hero' | 'header';
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
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsListRef = useRef<HTMLUListElement>(null);
  const router = useRouter();
  const searchId = useId();

  // Global Shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        if (query.trim() && results.length > 0) {
          setIsOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [query, results.length]);

  // Search execution using deterministic local search engine
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    const matches = searchCalculators(query, { limit: 8, minScore: 20 });
    setResults(matches);
    setIsOpen(true);
    setSelectedIndex(-1);
  }, [query]);

  // Click outside listener to dismiss suggestions
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
        e.preventDefault();
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

  // Ensure keyboard-selected element scrolls into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsListRef.current) {
      const activeEl = resultsListRef.current.children[selectedIndex] as HTMLElement;
      activeEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Safely highlight matching query tokens in the result name without raw HTML injection
  const renderHighlightedText = (text: string, queryText: string) => {
    if (!queryText.trim()) return text;

    const words = queryText
      .trim()
      .split(/[\s,.-]+/)
      .filter((w) => w.length >= 2)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    if (words.length === 0) return text;

    const regex = new RegExp(`(${words.join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
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

  const listboxId = `search-results-${searchId}`;
  const activeOptionId =
    selectedIndex >= 0 && results[selectedIndex]
      ? `search-option-${searchId}-${results[selectedIndex].id}`
      : undefined;

  return (
    <div
      ref={containerRef}
      className={`${styles.searchContainer} ${
        variant === 'hero' ? styles.heroSearch : variant === 'header' ? styles.headerSearch : ''
      } ${className || ''}`}
    >
      <div className={styles.inputWrapper}>
        <Search
          size={variant === 'hero' ? 20 : variant === 'header' ? 16 : 18}
          className={styles.searchIcon}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          autoFocus={autoFocus}
          maxLength={100}
          onChange={(e) => setQuery(e.target.value.slice(0, 100))}
          onInput={(e) => setQuery((e.target as HTMLInputElement).value.slice(0, 100))}
          onFocus={() => {
            if (query.trim() && (results.length > 0 || query.trim().length > 1)) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Rechner suchen"
          aria-expanded={isOpen && (results.length > 0 || query.trim().length > 1)}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeOptionId}
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
                setResults([]);
                setSelectedIndex(-1);
                inputRef.current?.focus();
              }}
              className={styles.clearBtn}
              aria-label="Eingabe löschen"
            >
              <X size={variant === 'header' ? 14 : 16} />
            </button>
          ) : (
            <kbd className={styles.kbdBadge} aria-hidden="true">
              Strg K
            </kbd>
          )}
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div className={styles.resultsDropdown}>
          <div className={styles.resultsHeader}>
            <span>Gefundene Rechner</span>
            <span className={styles.resultsHeaderHint}>
              <CornerDownLeft size={11} style={{ display: 'inline', marginRight: 3, verticalAlign: -1 }} />
              Eingabe zum Öffnen
            </span>
          </div>
          <ul
            id={listboxId}
            ref={resultsListRef}
            className={styles.resultsList}
            role="listbox"
            aria-label="Suchergebnisse"
          >
            {results.map((res, index) => {
              const isSelected = index === selectedIndex;
              const optionId = `search-option-${searchId}-${res.id}`;
              return (
                <li key={res.id} role="none">
                  <Link
                    id={optionId}
                    href={`/rechner/${res.slug}/`}
                    onClick={() => handleSelect(res.slug)}
                    className={`${styles.resultItem} ${isSelected ? styles.resultItemActive : ''}`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <Calculator size={18} className={styles.resultIcon} aria-hidden="true" />
                    <div className={styles.resultText}>
                      <div className={styles.resultTitleRow}>
                        <span className={styles.resultName}>
                          {renderHighlightedText(res.name, query)}
                        </span>
                        <span className={styles.resultCategory}>{res.categoryName}</span>
                      </div>
                      {res.shortDescription && (
                        <span className={styles.resultDesc}>
                          {res.shortDescription}
                        </span>
                      )}
                    </div>
                    <ArrowRight size={14} className={styles.resultArrow} aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {isOpen && query.trim().length > 1 && results.length === 0 && (
        <div className={styles.resultsDropdown}>
          <div className={styles.emptyState}>
            <p className={styles.emptyText} style={{ marginBottom: '8px' }}>
              Kein passender Rechner gefunden. Versuchen Sie einen kürzeren Suchbegriff oder wählen Sie eine Kategorie.
            </p>
            <div style={{ margin: '12px 0 16px' }}>
              <Link
                href="/rechner/"
                onClick={() => {
                  setIsOpen(false);
                  if (onSelect) onSelect();
                }}
                className={styles.suggestionChip}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  padding: '6px 14px',
                }}
              >
                Zum Rechner-Verzeichnis (alle 421 Rechner) →
              </Link>
            </div>
            <div className={styles.suggestionsTitle}>Beliebte Rechner:</div>
            <div className={styles.suggestionChips}>
              {POPULAR_SUGGESTIONS.map((item) => (
                <Link
                  key={item.slug}
                  href={`/rechner/${item.slug}/`}
                  onClick={() => handleSelect(item.slug)}
                  className={styles.suggestionChip}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
