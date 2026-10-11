'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Award, Clock, CalendarDays, PlusCircle } from 'lucide-react';
import { trackRelatedCalculatorClicked } from '@/lib/analytics/ga4';

interface Props {
  currentSlug: string;
}

export interface DateLinkItem {
  href: string;
  anchorText: string;
  intentBadge: string;
  reason: string;
  icon: 'award' | 'clock' | 'calendar' | 'plus';
}

export const DATE_CLUSTER_CONFIG: Record<string, { introNote: string; links: DateLinkItem[] }> = {
  // 1. Dienstjubiläum-Rechner
  'dienstjubilaeum-rechner': {
    introNote:
      'Passende Zeit- und Datumsrechner: Ermitteln Sie exakte Tage zwischen Stichtagen, addieren Sie Fristen oder berechnen Sie Ihr Lebensalter in Tagen.',
    links: [
      {
        href: '/rechner/tage-zwischen-zwei-daten/',
        anchorText: 'Tage zwischen zwei Daten berechnen',
        intentBadge: 'Datumsdifferenz',
        reason: 'Ermittelt die exakte Zeitspanne in Kalendertagen, Wochen und Monaten zwischen Diensteintritt und einem beliebigen Stichtag.',
        icon: 'calendar',
      },
      {
        href: '/rechner/datum-plus-tage/',
        anchorText: 'Datum plus Tage berechnen',
        intentBadge: 'Fristen & Zukunftsdatum',
        reason: 'Addiert Kalendertage zu einem Datum, um Fristenden (z. B. Probezeit, Kündigungsfristen oder Vertragslaufzeiten) auf den Wochentag genau zu bestimmen.',
        icon: 'plus',
      },
      {
        href: '/rechner/alter-in-tagen/',
        anchorText: 'Alter in Tagen berechnen',
        intentBadge: 'Lebensdauer & Meilensteine',
        reason: 'Zählt die absoluten Kalendertage seit der Geburt und zeigt runde Meilensteine wie den 10.000sten Lebenstag.',
        icon: 'clock',
      },
    ],
  },

  // 2. Alter-in-Tagen-Rechner
  'alter-in-tagen': {
    introNote:
      'Passende Datumsrechner für Zeitspannen und Jubiläen: Messen Sie beliebige Kalenderabstände, ermitteln Sie künftige Zieldaten oder berechnen Sie Dienstjubiläen.',
    links: [
      {
        href: '/rechner/tage-zwischen-zwei-daten/',
        anchorText: 'Tage zwischen zwei Daten berechnen',
        intentBadge: 'Datumsdifferenz',
        reason: 'Berechnet die genaue Spanne in Kalendertagen, Wochen und Jahren zwischen zwei beliebigen Kalenderdaten.',
        icon: 'calendar',
      },
      {
        href: '/rechner/datum-plus-tage/',
        anchorText: 'Datum plus Tage berechnen',
        intentBadge: 'Zukunftsdatum ermitteln',
        reason: 'Addieren Sie eine runde Tageszahl (z. B. 10.000 oder 20.000 Tage) zu Ihrem Geburtsdatum, um das exakte Meilenstein-Datum zu erfahren.',
        icon: 'plus',
      },
      {
        href: '/rechner/dienstjubilaeum-rechner/',
        anchorText: 'Dienstjubiläum im Arbeitsverhältnis berechnen',
        intentBadge: 'Betriebszugehörigkeit',
        reason: 'Ermittelt die offiziellen Stichtage für 10, 25, 40 und 50 Jahre Betriebszugehörigkeit nach Beginn des Beschäftigungsverhältnisses.',
        icon: 'award',
      },
    ],
  },

  // 3. Datum-plus-Tage-Rechner
  'datum-plus-tage': {
    introNote:
      'Ergänzende Datums- und Fristenrechner: Berechnen Sie Abstände zwischen zwei festen Terminen, Dienstjubiläen oder Ihre gelebten Tage.',
    links: [
      {
        href: '/rechner/tage-zwischen-zwei-daten/',
        anchorText: 'Tage zwischen zwei Daten berechnen',
        intentBadge: 'Datumsdifferenz',
        reason: 'Berechnet den exakten Zeitabstand in Kalendertagen zwischen zwei bereits feststehenden Terminen.',
        icon: 'calendar',
      },
      {
        href: '/rechner/dienstjubilaeum-rechner/',
        anchorText: 'Dienstjubiläum im Unternehmen berechnen',
        intentBadge: 'Betriebszugehörigkeit',
        reason: 'Bestimmt das exakte Kalenderdatum für 10-, 25- oder 40-jährige Arbeitsjubiläen ab offiziellem Diensteintritt.',
        icon: 'award',
      },
      {
        href: '/rechner/alter-in-tagen/',
        anchorText: 'Alter in Tagen berechnen',
        intentBadge: 'Lebensdauer in Tagen',
        reason: 'Zählt alle Kalendertage seit der Geburt inklusive Schaltjahren und runden Meilensteintagen.',
        icon: 'clock',
      },
    ],
  },

  // 4. Tage-zwischen-zwei-Daten-Rechner
  'tage-zwischen-zwei-daten': {
    introNote:
      'Spezialisierte Zeitzähler für Fristen, Lebensdauer und Arbeitsjubiläen:',
    links: [
      {
        href: '/rechner/datum-plus-tage/',
        anchorText: 'Datum plus Tage berechnen',
        intentBadge: 'Zukunfts- & Fristenrechnung',
        reason: 'Addiert eine bestimmte Anzahl an Tagen zu einem Startdatum, um das künftige Zieldatum und dessen Wochentag zu ermitteln.',
        icon: 'plus',
      },
      {
        href: '/rechner/dienstjubilaeum-rechner/',
        anchorText: 'Dienstjubiläum nach Eintrittsdatum berechnen',
        intentBadge: 'Betriebszugehörigkeit',
        reason: 'Berechnet das genaue Datum für 10, 25, 40 und 50 Jahre Betriebszugehörigkeit für Ihr Firmenjubiläum.',
        icon: 'award',
      },
      {
        href: '/rechner/alter-in-tagen/',
        anchorText: 'Alter in Tagen berechnen',
        intentBadge: 'Lebensalter & Meilensteine',
        reason: 'Ermittelt die exakte Anzahl der Lebenstage seit der Geburt und berechnet persönliche Jubiläumstage.',
        icon: 'clock',
      },
    ],
  },
};

export default function DateClusterLinks({ currentSlug }: Props) {
  const config = DATE_CLUSTER_CONFIG[currentSlug];
  if (!config) return null;

  const getIcon = (icon: DateLinkItem['icon']) => {
    switch (icon) {
      case 'award':
        return <Award size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />;
      case 'clock':
        return <Clock size={18} style={{ color: '#0284c7', flexShrink: 0 }} />;
      case 'plus':
        return <PlusCircle size={18} style={{ color: '#16a34a', flexShrink: 0 }} />;
      case 'calendar':
      default:
        return <CalendarDays size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />;
    }
  };

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
      aria-labelledby="date-cluster-heading"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
        <Calendar size={22} style={{ color: 'var(--color-primary)' }} />
        <h2
          id="date-cluster-heading"
          style={{
            fontSize: 'clamp(1.15rem, 3vw, 1.35rem)',
            fontWeight: 700,
            margin: 0,
            color: 'var(--color-text-primary)',
          }}
        >
          Weitere Datumsrechner
        </h2>
      </div>

      <p
        style={{
          fontSize: '0.925rem',
          color: 'var(--color-text-secondary)',
          margin: '0 0 var(--space-4)',
          lineHeight: 1.55,
          maxWidth: '820px',
        }}
      >
        {config.introNote}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-3)',
        }}
      >
        {config.links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => trackRelatedCalculatorClicked(item.href.replace(/^\/(rechner|ratgeber)\/|\/$/g, ''), currentSlug)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '14px 16px',
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {getIcon(item.icon)}
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: '#f1f5f9',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                  }}
                >
                  {item.intentBadge}
                </span>
              </div>
              <ArrowRight size={14} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />
            </div>

            <div
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                lineHeight: 1.35,
                marginBottom: '4px',
              }}
            >
              {item.anchorText}
            </div>

            <div
              style={{
                fontSize: '0.825rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.45,
                marginTop: 'auto',
              }}
            >
              {item.reason}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
