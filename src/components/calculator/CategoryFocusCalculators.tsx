import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FocusItem {
  slug: string;
  name: string;
  shortDesc: string;
  badge?: string;
}

const CATEGORY_FOCUS_MAP: Record<string, { title: string; subtitle: string; items: FocusItem[] }> = {
  'haushalt-energie': {
    title: 'Häufig genutzte Energierechner',
    subtitle: 'Direkter Zugriff auf die meistgesuchten Rechner für Strom-, Gas- und Heizkosten:',
    items: [
      {
        slug: 'gaskostenrechner',
        name: 'Gaskostenrechner',
        shortDesc: 'Gasverbrauch in m³ und kWh umrechnen, Jahreskosten und fairen Monatsabschlag berechnen.',
        badge: 'Fokus',
      },
      {
        slug: 'stromkostenrechner',
        name: 'Stromkostenrechner',
        shortDesc: 'Stromverbrauch und Betriebskosten beliebiger Elektrogeräte im Haushalt kalkulieren.',
      },
      {
        slug: 'heizkostenvergleich-rechner',
        name: 'Heizkostenvergleich Rechner',
        shortDesc: 'Vergleich der jährlichen Heizkosten von Wärmepumpe, Gas, Heizöl und Pellets.',
      },
      {
        slug: 'balkonkraftwerk-ertrag-rechner',
        name: 'Balkonkraftwerk Ertrag',
        shortDesc: 'Jährlichen Solarstrom-Ertrag und finanzielle Ersparnis durch Stecker-Solar ermitteln.',
      },
    ],
  },
  'auto-verkehr': {
    title: 'Häufig genutzte Mobilitäts- und Dienstrad-Rechner',
    subtitle: 'Wichtige Rechner für Pendler, Dienstfahrzeuge, Kfz-Steuer und Fahrtkosten:',
    items: [
      {
        slug: 'dienstfahrrad-jobrad-rechner',
        name: 'JobRad & Dienstrad Rechner',
        shortDesc: 'Monatliche Netto-Belastung und Gesamtersparnis bei der 0,25-%-Gehaltsumwandlung berechnen.',
        badge: 'Fokus',
      },
      {
        slug: 'kfz-steuer-rechner',
        name: 'KFZ-Steuer-Rechner',
        shortDesc: 'Genaue Jahressteuer nach Hubraum, Antriebsart und CO2-Ausstoß für Pkw ermitteln.',
      },
      {
        slug: 'pendlerpauschale-rechner',
        name: 'Pendlerpauschale Rechner',
        shortDesc: 'Entfernungspauschale für den einfachen Arbeitsweg steuerlich optimieren.',
      },
      {
        slug: 'spritkostenrechner',
        name: 'Spritkostenrechner',
        shortDesc: 'Reale Fahrtkosten aus Strecke, Kraftstoffpreis und Durchschnittsverbrauch ermitteln.',
      },
    ],
  },
  'bauen-renovieren': {
    title: 'Häufig genutzte Baurechner',
    subtitle: 'Präzise Mengen- und Materialberechnung für Mauerwerk, Beton und Fundamente:',
    items: [
      {
        slug: 'schalungssteine-rechner',
        name: 'Schalungssteine Rechner',
        shortDesc: 'Exakte Stückzahl Schalungssteine, Füllbeton-Volumen (m³) und Bewehrungsstahl für Mauern berechnen.',
        badge: 'Fokus',
      },
      {
        slug: 'betonrechner',
        name: 'Betonrechner',
        shortDesc: 'Verlässliche Kubikmeter- und Tonnageberechnung für Platten, Fundamente und Bauteile.',
      },
      {
        slug: 'fundament-rechner',
        name: 'Fundament Rechner',
        shortDesc: 'Frostfreie Streifen- und Punktfundamente mit Erdaushub und Betonbedarf dimensionieren.',
      },
      {
        slug: 'beton-mischungsverhaeltnis-rechner',
        name: 'Beton-Mischungsverhältnis',
        shortDesc: 'Exakte Anteile von Zement, Sand, Kies und Wasser für Standardmischungen ermitteln.',
      },
    ],
  },
};

interface Props {
  categorySlug: string;
}

export default function CategoryFocusCalculators({ categorySlug }: Props) {
  const config = CATEGORY_FOCUS_MAP[categorySlug];
  if (!config) return null;

  return (
    <section
      style={{
        marginTop: 'var(--space-6)',
        marginBottom: 'var(--space-6)',
        padding: 'clamp(var(--space-4), 3.5vw, var(--space-5))',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
      }}
      aria-labelledby={`focus-heading-${categorySlug}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-1)' }}>
        <Sparkles size={18} style={{ color: 'var(--color-primary)' }} />
        <h2
          id={`focus-heading-${categorySlug}`}
          style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}
        >
          {config.title}
        </h2>
      </div>
      <p style={{ margin: '0 0 var(--space-4)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
        {config.subtitle}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-3)',
        }}
      >
        {config.items.map((item) => (
          <Link
            key={item.slug}
            href={`/rechner/${item.slug}/`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface-hover)',
              border: '1px solid var(--color-border)',
              textDecoration: 'none',
              transition: 'border-color 0.15s ease, transform 0.15s ease',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                  {item.name}
                </span>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                {item.shortDesc}
              </p>
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: 'var(--space-2)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
              }}
            >
              <span>Rechner öffnen</span>
              <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
