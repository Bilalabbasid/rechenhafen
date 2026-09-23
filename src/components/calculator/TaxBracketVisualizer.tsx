'use client';

import React from 'react';
import styles from '@/styles/calculator.module.css';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { getTaxConfig } from '@/data/regulated/tax';

interface Props {
  taxableIncome: number;
  taxYear?: string;
  isSplitting?: boolean;
}

export default function TaxBracketVisualizer({
  taxableIncome,
  taxYear = '2026',
  isSplitting = false,
}: Props) {
  const config = getTaxConfig(taxYear);
  const effectiveIncome = isSplitting ? taxableIncome / 2 : taxableIncome;

  const zones = [
    {
      id: 'zone1',
      name: 'Zone 1: Grundfreibetrag',
      range: `0 € – ${formatCurrency(config.grundfreibetrag)}`,
      rate: '0 %',
      min: 0,
      max: config.grundfreibetrag,
      color: '#10b981', // green
    },
    {
      id: 'zone2',
      name: 'Zone 2: Erste Progression',
      range: `${formatCurrency(config.grundfreibetrag + 1)} – ${formatCurrency(config.zone2Limit)}`,
      rate: '14 % – 24 %',
      min: config.grundfreibetrag,
      max: config.zone2Limit,
      color: '#3b82f6', // blue
    },
    {
      id: 'zone3',
      name: 'Zone 3: Zweite Progression',
      range: `${formatCurrency(config.zone2Limit + 1)} – ${formatCurrency(config.zone3Limit)}`,
      rate: '24 % – 42 %',
      min: config.zone2Limit,
      max: config.zone3Limit,
      color: '#f59e0b', // amber
    },
    {
      id: 'zone4',
      name: 'Zone 4: Spitzensteuersatz',
      range: `${formatCurrency(config.zone3Limit + 1)} – ${formatCurrency(config.zone4Limit)}`,
      rate: '42 %',
      min: config.zone3Limit,
      max: config.zone4Limit,
      color: '#ef4444', // red
    },
    {
      id: 'zone5',
      name: 'Zone 5: Reichensteuer',
      range: `ab ${formatCurrency(config.zone5Limit)}`,
      rate: '45 %',
      min: config.zone5Limit,
      max: 500000,
      color: '#881337', // dark red
    },
  ];

  // Bestimme aktive Zone
  const currentZoneIndex = zones.findIndex(
    (z) => effectiveIncome >= z.min && (effectiveIncome <= z.max || z.id === 'zone5')
  );

  return (
    <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--color-text-primary)' }}>
        Progressiver Einkommensteuertarif ({config.year})
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
        Das deutsche Steuersystem besteuert Einkommen stufenweise progressiv (§ 32a EStG). Ein höherer Steuersatz gilt <strong>nur für den darüberliegenden Betrag</strong>, niemals für Ihr gesamtes Einkommen.
      </p>

      {/* Visueller Progressionsbalken */}
      <div style={{ display: 'flex', height: '28px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 'var(--space-3)', border: '1px solid var(--color-border)' }}>
        {zones.map((zone, idx) => {
          const isActive = idx === currentZoneIndex;
          return (
            <div
              key={zone.id}
              style={{
                flex: idx === 0 ? 1.5 : idx === 1 ? 1.2 : idx === 2 ? 2.5 : idx === 3 ? 3 : 1.5,
                backgroundColor: zone.color,
                opacity: isActive ? 1 : 0.45,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 700,
                position: 'relative',
                transition: 'opacity 0.2s ease',
              }}
              title={`${zone.name} (${zone.rate})`}
            >
              {zone.rate}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-6px',
                    width: '0',
                    height: '0',
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderBottom: '6px solid var(--color-primary)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Zonen-Übersicht */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', fontSize: '0.8rem' }}>
        {zones.map((zone, idx) => {
          const isActive = idx === currentZoneIndex;
          return (
            <div
              key={zone.id}
              style={{
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isActive ? 'var(--color-primary-light)' : 'var(--color-surface-subtle)',
                border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--color-border-subtle)',
              }}
            >
              <div style={{ fontWeight: 600, color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>
                {zone.name}
              </div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{zone.range}</div>
              <div style={{ fontWeight: 700, color: zone.color, marginTop: '2px' }}>{zone.rate}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 'var(--space-3)', padding: '10px 12px', background: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
        💡 <strong>Grenzsteuersatz vs. Durchschnittssteuersatz:</strong> Der <em>Grenzsteuersatz</em> gibt an, wie viel Cent Steuer auf jeden zusätzlichen verdienten Euro fällig werden. Der <em>Durchschnittssteuersatz</em> (tatsächliche Steuerquote) liegt wegen des Grundfreibetrags und der Progressionszonen stets spürbar darunter.
      </div>
    </div>
  );
}
