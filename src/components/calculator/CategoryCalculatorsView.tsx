'use client';

import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import CalculatorCard from '@/components/common/CalculatorCard';
import cardsStyles from '@/styles/cards.module.css';

interface CalculatorItem {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  shortDescription: string;
  category: string;
  subcategory?: string;
}

interface Props {
  calculators: CalculatorItem[];
  subcategories?: string[];
  categoryName: string;
}

export default function CategoryCalculatorsView({
  calculators,
  subcategories = [],
  categoryName,
}: Props) {
  const [query, setQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');

  const filtered = useMemo(() => {
    let list = calculators;

    if (selectedSubcategory !== 'all') {
      list = list.filter((c) => (c.subcategory || 'Weitere Rechner') === selectedSubcategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter((c) => {
        return (
          c.name.toLowerCase().includes(q) ||
          (c.shortName && c.shortName.toLowerCase().includes(q)) ||
          c.shortDescription.toLowerCase().includes(q)
        );
      });
    }

    return list;
  }, [calculators, selectedSubcategory, query]);

  return (
    <div>
      {/* Category Search & Filter Bar */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)'
      }}>
        {/* Quick Filter Input */}
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)'
            }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`In ${categoryName} suchen...`}
            aria-label={`Rechner in ${categoryName} filtern`}
            style={{
              width: '100%',
              height: '42px',
              paddingLeft: '38px',
              paddingRight: query ? '36px' : '14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface-subtle)',
              fontSize: '0.9rem'
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Filter zurücksetzen"
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Subcategory Pills */}
        {subcategories.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexWrap: 'wrap',
            paddingTop: 'var(--space-1)'
          }}>
            <button
              type="button"
              onClick={() => setSelectedSubcategory('all')}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                border: selectedSubcategory === 'all'
                  ? '1px solid var(--color-primary)'
                  : '1px solid var(--color-border)',
                background: selectedSubcategory === 'all'
                  ? 'var(--color-primary)'
                  : 'var(--color-surface)',
                color: selectedSubcategory === 'all'
                  ? '#ffffff'
                  : 'var(--color-text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.12s ease'
              }}
            >
              Alle ({calculators.length})
            </button>
            {subcategories.map((sub) => {
              const count = calculators.filter((c) => (c.subcategory || 'Weitere Rechner') === sub).length;
              if (count === 0) return null;
              const isSelected = selectedSubcategory === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubcategory(sub)}
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
                  {sub} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-4)',
        fontSize: '0.85rem',
        color: 'var(--color-text-muted)'
      }}>
        <span>
          <strong>{filtered.length}</strong> {filtered.length === 1 ? 'Rechner verfügbar' : 'Rechner verfügbar'}
        </span>
        {(selectedSubcategory !== 'all' || query.trim()) && (
          <button
            type="button"
            onClick={() => {
              setSelectedSubcategory('all');
              setQuery('');
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
            Filter zurücksetzen
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
              categoryName={categoryName}
            />
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-10) var(--space-4)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)'
        }}>
          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
            Kein passender Rechner in dieser Kategorie gefunden.
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
            Setzen Sie Ihren Filter zurück oder nutzen Sie die globale Suche oben.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedSubcategory('all');
              setQuery('');
            }}
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
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
