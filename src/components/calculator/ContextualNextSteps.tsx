'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Calculator, ChefHat, Hammer, Calendar } from 'lucide-react';
import { trackRelatedCalculatorClicked } from '@/lib/analytics/ga4';

export interface NextStepLink {
  href: string;
  title: string;
  description: string;
  badge?: string;
  type: 'calculator' | 'article';
}

const CONTEXTUAL_RECOMMENDATIONS: Record<string, { heading: string; links: NextStepLink[] }> = {
  'nudeln-rohmaerk-gewicht-rechner': {
    heading: 'Sinnvolle nächste Schritte für Ihr Pastagericht:',
    links: [
      {
        href: '/rechner/portionsrechner/',
        title: 'Portionsrechner',
        description: 'Zutaten und Gesamtportionen exakt für Ihre Gästeanzahl hochskalieren.',
        badge: 'Rechner',
        type: 'calculator',
      },
      {
        href: '/rechner/kalorien-rezept-rechner/',
        title: 'Kalorien-Rezept-Rechner',
        description: 'Nährwerte, Makros und Gesamtkalorien für Nudelgerichte & Saucen berechnen.',
        badge: 'Rechner',
        type: 'calculator',
      },
      {
        href: '/rechner/wasser-reis-verhaeltnis-rechner/',
        title: 'Reis-Wasser-Rechner',
        description: 'Wasser-Reis-Verhältnis & Garzeit für Basmati, Jasmin & Risotto ermitteln.',
        badge: 'Rechner',
        type: 'calculator',
      },
    ],
  },
  'wasser-reis-verhaeltnis-rechner': {
    heading: 'Passende Küchenrechner & Umrechnungen:',
    links: [
      {
        href: '/rechner/portionsrechner/',
        title: 'Portionsrechner',
        description: 'Reismengen als Beilage oder Hauptgericht für mehr Personen anpassen.',
        badge: 'Rechner',
        type: 'calculator',
      },
      {
        href: '/rechner/gramm-in-ml-rechner/',
        title: 'Gramm in Milliliter Rechner',
        description: 'Dichteabhängige Umrechnung von Gramm in Milliliter für Flüssigkeiten & Zutaten.',
        badge: 'Rechner',
        type: 'calculator',
      },
      {
        href: '/rechner/nudeln-rohmaerk-gewicht-rechner/',
        title: 'Nudelportions- & Quellrechner',
        description: 'Trocken- und Gekochtgewicht für Hartweizen- und frische Pasta umrechnen.',
        badge: 'Rechner',
        type: 'calculator',
      },
    ],
  },
  'kies-splitt-rechner': {
    heading: 'Weitere Berechnungen für Ihr Pflaster- & Wegebauprojekt:',
    links: [
      {
        href: '/rechner/pflastersteine-rechner/',
        title: 'Pflasterstein-Rechner',
        description: 'Bedarf an Pflastersteinen, Fugenmaterial und Bettungssplitt nach Fläche berechnen.',
        badge: 'Rechner',
        type: 'calculator',
      },
      {
        href: '/ratgeber/splitt-2-5-gewicht-schuettdichte/',
        title: 'Ratgeber: Splitt 2/5 Schüttdichte & Formeln',
        description: 'Warum 1 m³ Splitt 1,5 t wiegt, Schüttdichte vs. Rohdichte und DIN-Vorgaben.',
        badge: 'Ratgeber',
        type: 'article',
      },
      {
        href: '/rechner/schotter-rechner/',
        title: 'Schotter-Rechner',
        description: 'Frostschutz- und Tragschichtvolumen für Hofeinfahrten und Terrassen ermitteln.',
        badge: 'Rechner',
        type: 'calculator',
      },
    ],
  },
  'alter-in-monaten': {
    heading: 'Vertiefende Alters- & Fristenberechnung:',
    links: [
      {
        href: '/ratgeber/lebensmonate-berechnen/',
        title: 'Ratgeber: Vollendete vs. laufende Monate',
        description: 'Kalendergenaue BGB-Zählweise, Monatsende-Regel und Elterngeldfristen verständlich erklärt.',
        badge: 'Ratgeber',
        type: 'article',
      },
      {
        href: '/rechner/alter-in-tagen/',
        title: 'Alter in Tagen Rechner',
        description: 'Tagesgenaues Lebensalter unter Berücksichtigung aller Schaltjahre berechnen.',
        badge: 'Rechner',
        type: 'calculator',
      },
      {
        href: '/rechner/altersrechner/',
        title: 'Umfassender Altersrechner',
        description: 'Exaktes Alter in Jahren, Monaten, Wochen, Tagen und Stunden aufschlüsseln.',
        badge: 'Rechner',
        type: 'calculator',
      },
    ],
  },
};

interface ContextualNextStepsProps {
  currentSlug: string;
}

export default function ContextualNextSteps({ currentSlug }: ContextualNextStepsProps) {
  const config = CONTEXTUAL_RECOMMENDATIONS[currentSlug];
  if (!config || !config.links || config.links.length === 0) {
    return null;
  }

  const handleClick = (toHref: string) => {
    // Extract target slug from path e.g. /rechner/portionsrechner/ -> portionsrechner
    const parts = toHref.split('/').filter(Boolean);
    const toSlug = parts[parts.length - 1] || toHref;
    trackRelatedCalculatorClicked(currentSlug, toSlug);
  };

  return (
    <div
      style={{
        marginTop: 'var(--space-5)',
        padding: '16px',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
      }}
      aria-label="Kontextbezogene nächste Schritte"
    >
      <div
        style={{
          fontSize: '0.875rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <ArrowRight size={16} style={{ color: 'var(--color-primary)' }} />
        <span>{config.heading}</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '10px',
        }}
      >
        {config.links.map((link, idx) => (
          <Link
            key={idx}
            href={link.href}
            onClick={() => handleClick(link.href)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '12px 14px',
              backgroundColor: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              transition: 'border-color 0.15s ease, transform 0.15s ease',
            }}
            className="hover-lift"
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '4px',
              }}
            >
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                }}
              >
                {link.title}
              </span>
              {link.badge && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: link.type === 'article' ? 'var(--color-surface-hover)' : 'var(--color-primary-subtle)',
                    color: link.type === 'article' ? 'var(--color-text-secondary)' : 'var(--color-primary)',
                    fontWeight: 600,
                  }}
                >
                  {link.badge}
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: '0.78rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              {link.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
