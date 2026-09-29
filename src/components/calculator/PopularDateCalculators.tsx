import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface Props {
  currentSlug?: string;
}

interface PopularDateLink {
  slug: string;
  name: string;
  shortDesc: string;
  badge?: string;
}

const POPULAR_DATE_CALCULATORS: PopularDateLink[] = [
  {
    slug: 'tage-zwischen-zwei-daten',
    name: 'Tagerechner: Tage zwischen zwei Daten',
    shortDesc: 'Tage, Wochen & Jahre zwischen zwei beliebigen Daten berechnen (bis/seit einem Datum).',
    badge: 'Standard',
  },
  {
    slug: 'tage-bis-weihnachten',
    name: 'Tage bis Weihnachten',
    shortDesc: 'Countdown bis Heiligabend oder zum 1. Weihnachtstag mit automatischem Jahreswechsel.',
    badge: 'Countdown',
  },
  {
    slug: 'arbeitstage-rechner',
    name: 'Arbeitstage-Rechner',
    shortDesc: 'Tatsächliche Arbeitstage (Mo–Fr) für alle 16 Bundesländer inklusive Feiertagen.',
    badge: '5-Tage-Woche',
  },
  {
    slug: 'werktage-rechner',
    name: 'Werktage-Rechner (Mo–Sa)',
    shortDesc: 'Gesetzliche Werktage nach § 3 BUrlG und BGB für Fristen und Mietzahlungen.',
    badge: '6-Tage-Woche',
  },
  {
    slug: 'datum-plus-tage',
    name: 'Datum plus Tage',
    shortDesc: 'Welches Datum ist in X Tagen? Zieldatum und Wochentag sofort ermitteln.',
  },
  {
    slug: 'datum-minus-tage',
    name: 'Datum minus Tage',
    shortDesc: 'Tage von einem Stichtag subtrahieren und historisches Datum bestimmen.',
  },
  {
    slug: 'altersrechner',
    name: 'Altersrechner',
    shortDesc: 'Präzises Alter in Jahren, Monaten, Tagen und Stunden nach Geburtsdatum.',
  },
  {
    slug: 'tage-bis-geburtstag',
    name: 'Tage bis Geburtstag',
    shortDesc: 'Verbleibende Tage, Wochen und Wochentag des nächsten Geburtstags.',
  },
  {
    slug: 'schaltjahr-rechner',
    name: 'Schaltjahr-Rechner',
    shortDesc: 'Prüft jedes Kalenderjahr nach gregorianischen Regeln auf 366 Tage und 29. Februar.',
  },
];

export default function PopularDateCalculators({ currentSlug }: Props) {
  return (
    <section
      style={{
        marginTop: 'var(--space-8)',
        marginBottom: 'var(--space-8)',
        padding: 'clamp(var(--space-4), 4vw, var(--space-6))',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        boxSizing: 'border-box',
      }}
      aria-labelledby="popular-date-calculators-heading"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} style={{ color: 'var(--color-primary)' }} />
          <h2
            id="popular-date-calculators-heading"
            style={{
              fontSize: 'clamp(1.15rem, 3vw, 1.35rem)',
              fontWeight: 700,
              margin: 0,
              color: 'var(--color-text-primary)',
            }}
          >
            Beliebte Datumsrechner
          </h2>
        </div>
        <Link
          href="/datum-zeit/"
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--color-primary)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          Alle Datum- & Zeitrechner <ArrowRight size={14} />
        </Link>
      </div>

      <p
        style={{
          fontSize: '0.925rem',
          lineHeight: 1.5,
          color: 'var(--color-text-secondary)',
          margin: '0 0 var(--space-4)',
        }}
      >
        Die wichtigsten Werkzeuge zur Berechnung von Kalendertagen, Feiertagen, Werktagen und Fristen auf einen Blick:
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 'var(--space-3)',
        }}
      >
        {POPULAR_DATE_CALCULATORS.map((calc) => {
          const isCurrent = currentSlug === calc.slug;
          return (
            <Link
              key={calc.slug}
              href={`/rechner/${calc.slug}/`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                background: isCurrent ? 'var(--color-primary-light)' : 'var(--color-background)',
                border: isCurrent ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'border-color 0.2s, transform 0.15s, background-color 0.2s',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: isCurrent ? 'var(--color-primary)' : 'var(--color-text-primary)',
                      lineHeight: 1.3,
                    }}
                  >
                    {calc.name}
                  </span>
                  {isCurrent ? (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--color-primary)',
                        color: '#ffffff',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Aktuell
                    </span>
                  ) : calc.badge ? (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--color-surface-hover)',
                        color: 'var(--color-text-secondary)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {calc.badge}
                    </span>
                  ) : null}
                </div>
                <p
                  style={{
                    fontSize: '0.825rem',
                    lineHeight: 1.4,
                    color: 'var(--color-text-muted)',
                    margin: 0,
                  }}
                >
                  {calc.shortDesc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
