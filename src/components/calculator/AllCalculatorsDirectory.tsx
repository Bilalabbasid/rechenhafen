'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Filter } from 'lucide-react';
import CalculatorCard from '@/components/common/CalculatorCard';
import cardsStyles from '@/styles/cards.module.css';

interface CategoryMeta {
  slug: string;
  name: string;
  count: number;
}

interface DirectoryItem {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  shortDescription: string;
  category: string;
  categoryName: string;
}

interface Props {
  calculators: DirectoryItem[];
  categories: CategoryMeta[];
}

export default function AllCalculatorsDirectory({ calculators, categories }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('all');

  // Available initial letters
  const availableLetters = useMemo(() => {
    const set = new Set<string>();
    for (const c of calculators) {
      const first = (c.shortName || c.name).charAt(0).toUpperCase();
      if (/[A-ZÄÖÜ]/.test(first)) {
        set.add(first);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'de'));
  }, [calculators]);

  // Filtered calculators
  const filtered = useMemo(() => {
    let result = calculators;

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter((c) => c.category === selectedCategory);
    }

    // Filter by Letter
    if (selectedLetter !== 'all') {
      result = result.filter((c) => {
        const first = (c.shortName || c.name).charAt(0).toUpperCase();
        return first === selectedLetter;
      });
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((c) => {
        return (
          c.name.toLowerCase().includes(q) ||
          (c.shortName && c.shortName.toLowerCase().includes(q)) ||
          c.shortDescription.toLowerCase().includes(q) ||
          c.categoryName.toLowerCase().includes(q)
        );
      });
    }

    return result;
  }, [calculators, selectedCategory, selectedLetter, searchQuery]);

  return (
    <div>
      {/* Controls Bar: Search & Filters */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        marginBottom: 'var(--space-8)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Instant Search Bar */}
        <div style={{ position: 'relative', marginBottom: 'var(--space-4)' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)'
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Verzeichnis durchsuchen (z. B. Gehalt, Zinsen, Alter, Sprit)..."
            aria-label="Rechner im Verzeichnis filtern"
            style={{
              width: '100%',
              height: '46px',
              paddingLeft: '42px',
              paddingRight: searchQuery ? '40px' : '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface-subtle)',
              fontSize: '0.95rem'
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Filter zurücksetzen"
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '8px'
          }}>
            <Filter size={13} />
            <span>Nach Kategorie filtern:</span>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            maxHeight: '130px',
            overflowY: 'auto'
          }}>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                border: selectedCategory === 'all'
                  ? '1px solid var(--color-primary)'
                  : '1px solid var(--color-border)',
                background: selectedCategory === 'all'
                  ? 'var(--color-primary)'
                  : 'var(--color-surface)',
                color: selectedCategory === 'all'
                  ? '#ffffff'
                  : 'var(--color-text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.12s ease'
              }}
            >
              Alle ({calculators.length})
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 600 : 500,
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    border: isSelected
                      ? '1px solid var(--color-primary)'
                      : '1px solid var(--color-border)',
                    background: isSelected
                      ? 'var(--color-primary)'
                      : 'var(--color-surface)',
                    color: isSelected
                      ? '#ffffff'
                      : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  {cat.name} ({cat.count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Alphabetical A-Z Filter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          flexWrap: 'wrap',
          borderTop: '1px solid var(--color-border)',
          paddingTop: 'var(--space-3)'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginRight: '4px' }}>
            A–Z:
          </span>
          <button
            type="button"
            onClick={() => setSelectedLetter('all')}
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              border: selectedLetter === 'all' ? '1px solid var(--color-primary)' : '1px solid transparent',
              background: selectedLetter === 'all' ? 'var(--color-primary-light)' : 'transparent',
              color: selectedLetter === 'all' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer'
            }}
          >
            Alle
          </button>
          {availableLetters.map((letter) => {
            const isSelected = selectedLetter === letter;
            return (
              <button
                key={letter}
                type="button"
                onClick={() => setSelectedLetter(isSelected ? 'all' : letter)}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  minWidth: '24px',
                  padding: '2px 4px',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '1px solid var(--color-primary)' : '1px solid transparent',
                  background: isSelected ? 'var(--color-primary-light)' : 'transparent',
                  color: isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-4)',
        fontSize: '0.9rem',
        color: 'var(--color-text-muted)'
      }}>
        <span>
          <strong>{filtered.length}</strong> {filtered.length === 1 ? 'Rechner gefunden' : 'Rechner gefunden'}
        </span>
        {(selectedCategory !== 'all' || selectedLetter !== 'all' || searchQuery.trim()) && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedLetter('all');
              setSearchQuery('');
            }}
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Alle Filter zurücksetzen
          </button>
        )}
      </div>

      {/* Calculator Grid */}
      {filtered.length > 0 ? (
        <div className={cardsStyles.calculatorGrid}>
          {filtered.map((calc) => (
            <CalculatorCard
              key={calc.id}
              slug={calc.slug}
              name={calc.name}
              shortName={calc.shortName}
              shortDescription={calc.shortDescription}
              category={calc.category}
              categoryName={calc.categoryName}
            />
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-12) var(--space-4)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)'
        }}>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-primary)', fontWeight: 600, marginBottom: '8px' }}>
            Kein passender Rechner gefunden.
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
            Passen Sie Ihre Filter an oder durchsuchen Sie alle Kategorien.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedLetter('all');
              setSearchQuery('');
            }}
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Filter zurücksetzen
          </button>
        </div>
      )}
    </div>
  );
}
