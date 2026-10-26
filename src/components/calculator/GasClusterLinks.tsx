'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, ArrowRight, Gauge, Calculator, BookOpen, Layers, Zap } from 'lucide-react';
import { trackRelatedCalculatorClicked } from '@/lib/analytics/ga4';

interface Props {
  currentSlug: string;
  isRatgeber?: boolean;
}

export interface ClusterLinkItem {
  href: string;
  anchorText: string;
  intentBadge: string;
  badgeType: 'm3' | 'kwh' | 'compare' | 'guide';
  reason: string;
  icon: 'gauge' | 'calc' | 'book' | 'layers' | 'zap' | 'flame';
}

export const GAS_CLUSTER_CONFIG: Record<string, { introNote: string; links: ClusterLinkItem[] }> = {
  // 1. Gaskostenrechner
  'gaskostenrechner': {
    introNote:
      'Passend zu Ihrer Gaskostenberechnung: Nutzen Sie unsere spezialisierten Rechner und Ratgeber je nachdem, ob Sie Zählerstände in m³ oder bereits Kilowattstunden vorliegen haben.',
    links: [
      {
        href: '/ratgeber/gaszaehler-m3-in-kwh-umrechnen/',
        anchorText: 'Gaszähler m³ in kWh umrechnen: Zählerstand richtig berechnen',
        intentBadge: 'Zählerstände in m³',
        badgeType: 'm3',
        reason: 'Schritt-für-Schritt-Anleitung zur thermischen Umrechnung mit Brennwert und Zustandszahl Ihrer Gasabrechnung.',
        icon: 'book',
      },
      {
        href: '/rechner/gasverbrauch-kwh-m3-rechner/',
        anchorText: 'Gasverbrauch Rechner (m³ in kWh)',
        intentBadge: 'Zählerstände in m³',
        badgeType: 'm3',
        reason: 'Wandelt zwei Zählerstände oder Kubikmeter direkt in Kilowattstunden um und ermittelt die reinen Verbrauchskosten.',
        icon: 'gauge',
      },
      {
        href: '/ratgeber/gaskosten-berechnen/',
        anchorText: 'Gaskosten berechnen: Formel, Gasrechnung & Tarife',
        intentBadge: 'kWh-Verbrauch bekannt',
        badgeType: 'kwh',
        reason: 'Erfahren Sie, wie sich Arbeitspreis, Grundpreis und monatlicher Richtwert zusammensetzen und wie Sie Rechnungen prüfen.',
        icon: 'book',
      },
      {
        href: '/rechner/heizkostenvergleich-rechner/',
        anchorText: 'Heizkosten verschiedener Systeme vergleichen',
        intentBadge: 'Alternativen vergleichen',
        badgeType: 'compare',
        reason: 'Stellt Ihre laufenden Erdgaskosten den Kosten von Wärmepumpe, Holzpellets und Heizöl bei gleichem Wärmebedarf gegenüber.',
        icon: 'layers',
      },
      {
        href: '/rechner/oelheizung-verbrauch-rechner/',
        anchorText: 'Heizölverbrauch schätzen',
        intentBadge: 'Alternativen vergleichen',
        badgeType: 'compare',
        reason: 'Schätzt den jährlichen Heizölbedarf und die Brennstoffkosten anhand von Wohnfläche, Dämmzustand und Ihrem Literpreis.',
        icon: 'flame',
      },
      {
        href: '/rechner/stromkostenrechner/',
        anchorText: 'Stromkosten im Haushalt berechnen',
        intentBadge: 'Haushaltsenergie',
        badgeType: 'kwh',
        reason: 'Kalkuliert die jährlichen Stromgesamtkosten und monatlichen Durchschnittskosten aus Arbeitspreis und Grundpreis.',
        icon: 'zap',
      },
    ],
  },

  // 2. Ratgeber: Gaszähler m³ in kWh umrechnen
  'gaszaehler-m3-in-kwh-umrechnen': {
    introNote:
      'Vom abgelesenen Zählerstand zu exakten Heizkosten: Rechnen Sie Ihre Kubikmeter direkt online um oder kalkulieren Sie die Gesamtkosten Ihres Gastarifs.',
    links: [
      {
        href: '/rechner/gasverbrauch-kwh-m3-rechner/',
        anchorText: 'Gasverbrauch Rechner (m³ in kWh)',
        intentBadge: 'Zählerstände in m³',
        badgeType: 'm3',
        reason: 'Geben Sie alten und neuen Zählerstand ein, um die Kubikmeterdifferenz mit den Faktoren Ihrer Rechnung in kWh umzuwandeln.',
        icon: 'gauge',
      },
      {
        href: '/rechner/gaskostenrechner/',
        anchorText: 'Gaskosten aus Verbrauch und Tarif berechnen',
        intentBadge: 'kWh-Verbrauch bekannt',
        badgeType: 'kwh',
        reason: 'Ermittelt jährliche Gesamtgaskosten inklusive Grundpreis und den rechnerischen Monatsdurchschnitt auf Basis Ihrer kWh.',
        icon: 'calc',
      },
      {
        href: '/ratgeber/gaskosten-berechnen/',
        anchorText: 'Gaskosten berechnen: Formel & Gasrechnung',
        intentBadge: 'Hintergründe & Formel',
        badgeType: 'guide',
        reason: 'Detaillierte Erklärung aller Abrechnungsposten inklusive Arbeitspreis, Grundpreis und gesetzlicher Abgaben.',
        icon: 'book',
      },
      {
        href: '/rechner/heizkostenvergleich-rechner/',
        anchorText: 'Heizkosten verschiedener Systeme vergleichen',
        intentBadge: 'Alternativen vergleichen',
        badgeType: 'compare',
        reason: 'Vergleicht Ihren thermischen Energiebedarf mit den laufenden Betriebskosten moderner Wärmepumpen und Pelletheizungen.',
        icon: 'layers',
      },
    ],
  },

  // 3. Gasverbrauch Rechner (m³ in kWh)
  'gasverbrauch-kwh-m3-rechner': {
    introNote:
      'Ergänzende Rechner & Ratgeber: Wandeln Sie Ihren ermittelten Energieverbrauch in Euro-Gesamtkosten um oder vergleichen Sie alternative Heizsysteme.',
    links: [
      {
        href: '/rechner/gaskostenrechner/',
        anchorText: 'Gaskosten aus Verbrauch und Tarif berechnen',
        intentBadge: 'kWh-Verbrauch bekannt',
        badgeType: 'kwh',
        reason: 'Übertragen Sie die ermittelten Kilowattstunden, um Gesamtkosten inklusive festem Monatsgrundpreis zu berechnen.',
        icon: 'calc',
      },
      {
        href: '/ratgeber/gaszaehler-m3-in-kwh-umrechnen/',
        anchorText: 'Gaszähler m³ in kWh umrechnen: Zählerstand richtig berechnen',
        intentBadge: 'Zählerstände in m³',
        badgeType: 'm3',
        reason: 'Hintergrundwissen zu Brennwert (Hs), Zustandszahl (z) und wie Sie typische Ablesefehler am Gaszähler vermeiden.',
        icon: 'book',
      },
      {
        href: '/ratgeber/gaskosten-berechnen/',
        anchorText: 'Gaskosten berechnen: Formel & Gasrechnung',
        intentBadge: 'Hintergründe & Formel',
        badgeType: 'guide',
        reason: 'Erfahren Sie, wie Energieversorger Arbeitspreise und Grundpreise kalkulieren und wie Sie Ihren Monatsabschlag prüfen.',
        icon: 'book',
      },
      {
        href: '/rechner/heizkostenvergleich-rechner/',
        anchorText: 'Heizkosten verschiedener Systeme vergleichen',
        intentBadge: 'Alternativen vergleichen',
        badgeType: 'compare',
        reason: 'Setzt Ihren Gasenergiebedarf in Relation zu den Heizkosten von Wärmepumpe, Holzpellets und Heizöl.',
        icon: 'layers',
      },
      {
        href: '/rechner/oelheizung-verbrauch-rechner/',
        anchorText: 'Heizölverbrauch schätzen',
        intentBadge: 'Alternativen vergleichen',
        badgeType: 'compare',
        reason: 'Schätzt den jährlichen Heizölbedarf und die Brennstoffkosten anhand von Wohnfläche, Dämmzustand und Literpreis.',
        icon: 'flame',
      },
    ],
  },

  // 4. Ratgeber: Gaskosten berechnen
  'gaskosten-berechnen': {
    introNote:
      'Passende Rechenhilfen zu diesem Ratgeber: Wählen Sie das passende Werkzeug je nach vorliegender Datenbasis am Zähler oder auf der Abrechnung.',
    links: [
      {
        href: '/rechner/gaskostenrechner/',
        anchorText: 'Gaskosten aus Verbrauch und Tarif berechnen',
        intentBadge: 'kWh-Verbrauch bekannt',
        badgeType: 'kwh',
        reason: 'Berechnen Sie sofort Ihre Jahresgesamtkosten und den rechnerischen Monatsdurchschnitt aus Arbeitspreis und Grundpreis.',
        icon: 'calc',
      },
      {
        href: '/rechner/gasverbrauch-kwh-m3-rechner/',
        anchorText: 'Gasverbrauch Rechner (m³ in kWh)',
        intentBadge: 'Zählerstände in m³',
        badgeType: 'm3',
        reason: 'Wandelt zwei Zählerstände in Kubikmetern mit Brennwert und Zustandszahl direkt in abrechenbare kWh um.',
        icon: 'gauge',
      },
      {
        href: '/ratgeber/gaszaehler-m3-in-kwh-umrechnen/',
        anchorText: 'Gaszähler m³ in kWh umrechnen: Zählerstand richtig berechnen',
        intentBadge: 'Zählerstände in m³',
        badgeType: 'm3',
        reason: 'Schritt-für-Schritt-Anleitung mit Rechenbeispielen zur thermischen Gasabrechnung nach DVGW G 685.',
        icon: 'book',
      },
      {
        href: '/rechner/heizkostenvergleich-rechner/',
        anchorText: 'Heizkosten verschiedener Systeme vergleichen',
        intentBadge: 'Alternativen vergleichen',
        badgeType: 'compare',
        reason: 'Vergleichen Sie laufende Gaskosten neutral mit den Heizkosten einer Wärmepumpe oder Pelletheizung.',
        icon: 'layers',
      },
      {
        href: '/rechner/oelheizung-verbrauch-rechner/',
        anchorText: 'Heizölverbrauch schätzen',
        intentBadge: 'Alternativen vergleichen',
        badgeType: 'compare',
        reason: 'Schätzt den jährlichen Heizölbedarf und die Brennstoffkosten anhand von Wohnfläche, Dämmzustand und Ihrem Literpreis.',
        icon: 'flame',
      },
    ],
  },

  // 5. Heizkostenvergleich Rechner
  'heizkostenvergleich-rechner': {
    introNote:
      'Vertiefende Rechner für Ihre Heizkosten- und Energieträgeranalyse: Berechnen Sie Detailkosten für Gas, Öl oder Haushaltsstrom.',
    links: [
      {
        href: '/rechner/gaskostenrechner/',
        anchorText: 'Gaskosten aus Verbrauch und Tarif berechnen',
        intentBadge: 'Gas im Detail',
        badgeType: 'kwh',
        reason: 'Ermittelt jährliche Gesamtgaskosten und den rechnerischen Monatsdurchschnitt mit Ihrem konkreten Gastarif.',
        icon: 'calc',
      },
      {
        href: '/rechner/gasverbrauch-kwh-m3-rechner/',
        anchorText: 'Gasverbrauch Rechner (m³ in kWh)',
        intentBadge: 'Zählerstände in m³',
        badgeType: 'm3',
        reason: 'Rechnet Kubikmeter am Gaszähler in Kilowattstunden um, um Ihren tatsächlichen Wärmebedarf genau zu beziffern.',
        icon: 'gauge',
      },
      {
        href: '/rechner/oelheizung-verbrauch-rechner/',
        anchorText: 'Heizölverbrauch schätzen',
        intentBadge: 'Öl im Detail',
        badgeType: 'compare',
        reason: 'Schätzt den jährlichen Heizölbedarf und die Brennstoffkosten anhand von Wohnfläche, Dämmzustand und Ihrem Literpreis.',
        icon: 'flame',
      },
      {
        href: '/ratgeber/gaszaehler-m3-in-kwh-umrechnen/',
        anchorText: 'Gaszähler m³ in kWh umrechnen: Zählerstand richtig berechnen',
        intentBadge: 'Hintergründe & Formel',
        badgeType: 'guide',
        reason: 'Fachratgeber zur thermischen Gasabrechnung nach DVGW-Vorgaben für eine verlässliche Verbrauchsbasis.',
        icon: 'book',
      },
      {
        href: '/rechner/stromkostenrechner/',
        anchorText: 'Stromkosten im Haushalt berechnen',
        intentBadge: 'Haushaltsenergie',
        badgeType: 'kwh',
        reason: 'Kalkuliert Stromkosten für den Haushalt sowie für ergänzende Wärmepumpen-Stromtarife.',
        icon: 'zap',
      },
    ],
  },

  // 6. Stromkostenrechner
  'stromkostenrechner': {
    introNote:
      'Ganzheitliche Energiekosten im Blick: Berechnen Sie neben Ihren Stromkosten auch Ihre Heizenergieausgaben für Erdgas und andere Heizsysteme.',
    links: [
      {
        href: '/rechner/gaskostenrechner/',
        anchorText: 'Gaskosten aus Verbrauch und Tarif berechnen',
        intentBadge: 'Heizenergie Gas',
        badgeType: 'kwh',
        reason: 'Ermittelt jährliche Gaskosten und den rechnerischen Monatsdurchschnitt aus Jahresverbrauch, Arbeitspreis und Grundpreis.',
        icon: 'calc',
      },
      {
        href: '/rechner/gasverbrauch-kwh-m3-rechner/',
        anchorText: 'Gasverbrauch Rechner (m³ in kWh)',
        intentBadge: 'Zählerstände in m³',
        badgeType: 'm3',
        reason: 'Wandelt abgelesene Zählerstände in Kubikmetern (m³) mit Brennwert und Zustandszahl in abrechenbare kWh um.',
        icon: 'gauge',
      },
      {
        href: '/rechner/heizkostenvergleich-rechner/',
        anchorText: 'Heizkosten verschiedener Systeme vergleichen',
        intentBadge: 'Alternativen vergleichen',
        badgeType: 'compare',
        reason: 'Stellt Strom-Wärmepumpenkosten den Heizkosten von Gas-, Öl- und Pelletheizungen transparent gegenüber.',
        icon: 'layers',
      },
      {
        href: '/rechner/stromkosten-geraete-rechner/',
        anchorText: 'Stromkosten-Rechner für Geräte',
        intentBadge: 'Stromfresser aufspüren',
        badgeType: 'kwh',
        reason: 'Berechnet die Kosten einzelner Haushaltsgeräte (z. B. Heizlüfter, TV, Waschmaschine) nach Watt und Nutzungsdauer.',
        icon: 'zap',
      },
    ],
  },

  // 7. Ölheizung Verbrauch Rechner
  'oelheizung-verbrauch-rechner': {
    introNote:
      'Passende Rechner & Ratgeber zu Ihrem Heizölbedarf: Vergleichen Sie Ihre Heizölkosten mit Erdgas und modernen Wärmepumpen.',
    links: [
      {
        href: '/rechner/heizkostenvergleich-rechner/',
        anchorText: 'Heizkosten verschiedener Systeme vergleichen',
        intentBadge: 'Alternativen vergleichen',
        badgeType: 'compare',
        reason: 'Vergleicht Ihre Ölheizungskosten direkt mit laufenden Kosten von Wärmepumpe, Erdgas und Holzpellets.',
        icon: 'layers',
      },
      {
        href: '/rechner/gaskostenrechner/',
        anchorText: 'Gaskosten aus Verbrauch und Tarif berechnen',
        intentBadge: 'Gas-Alternative',
        badgeType: 'kwh',
        reason: 'Kalkuliert die jährlichen Gesamtgaskosten aus Arbeitspreis und Grundpreis, falls Sie einen Umstieg prüfen.',
        icon: 'calc',
      },
      {
        href: '/rechner/gasverbrauch-kwh-m3-rechner/',
        anchorText: 'Gasverbrauch Rechner (m³ in kWh)',
        intentBadge: 'Zählerstände in m³',
        badgeType: 'm3',
        reason: 'Wandelt Kubikmeter am Gaszähler in Kilowattstunden um, um thermische Verbräuche direkt vergleichbar zu machen.',
        icon: 'gauge',
      },
      {
        href: '/ratgeber/gaskosten-berechnen/',
        anchorText: 'Gaskosten berechnen: Formel & Gasrechnung',
        intentBadge: 'Hintergründe & Formel',
        badgeType: 'guide',
        reason: 'Erklärt die Zusammensetzung von Heizkosten aus Arbeits- und Grundpreis sowie CO₂-Kostenkomponenten.',
        icon: 'book',
      },
      {
        href: '/rechner/co2-preis-rechner/',
        anchorText: 'CO₂-Kosten für Heizöl berechnen',
        intentBadge: 'CO₂-Preis',
        badgeType: 'compare',
        reason: 'Schätzt den rechnerischen CO₂-Kostenanteil aus Ihrer Heizölmenge in Litern und einem Preis je Tonne CO₂.',
        icon: 'flame',
      },
    ],
  },

  // 8. Ratgeber: Gasverbrauch berechnen: m³ in kWh umrechnen und Kosten verstehen
  'gasverbrauch-m3-kwh-kosten': {
    introNote:
      'Passende Rechenhilfen und Fachbeiträge: Nutzen Sie unsere spezialisierten Rechner, um Zählerstände umzurechnen, Gesamtkosten zu kalkulieren oder Heizsysteme zu vergleichen.',
    links: [
      {
        href: '/rechner/gasverbrauch-kwh-m3-rechner/',
        anchorText: 'Gasverbrauch Rechner (m³ in kWh)',
        intentBadge: 'Zählerstände in m³',
        badgeType: 'm3',
        reason: 'Wandelt zwei Gaszählerstände in Kubikmetern mit Brennwert und Zustandszahl direkt in Kilowattstunden um.',
        icon: 'gauge',
      },
      {
        href: '/rechner/gaskostenrechner/',
        anchorText: 'Gaskosten aus Verbrauch und Tarif berechnen',
        intentBadge: 'kWh-Verbrauch bekannt',
        badgeType: 'kwh',
        reason: 'Berechnet Ihre jährlichen Gesamtkosten und den rechnerischen Monatsdurchschnitt aus Arbeitspreis und Grundpreis.',
        icon: 'calc',
      },
      {
        href: '/ratgeber/gaszaehler-m3-in-kwh-umrechnen/',
        anchorText: 'Gaszähler m³ in kWh umrechnen: Zählerstand richtig berechnen',
        intentBadge: 'Zählerstände in m³',
        badgeType: 'm3',
        reason: 'Schritt-für-Schritt-Anleitung zur Differenzbildung alter und neuer Gaszählerstände nach DVGW G 685.',
        icon: 'book',
      },
      {
        href: '/ratgeber/gaskosten-berechnen/',
        anchorText: 'Gaskosten berechnen: Formel & Gasrechnung',
        intentBadge: 'Hintergründe & Formel',
        badgeType: 'guide',
        reason: 'Erfahren Sie, wie Arbeitspreis, Grundpreis und gesetzliche Abgaben auf Ihrer Gasrechnung zusammenwirken.',
        icon: 'book',
      },
      {
        href: '/rechner/heizkostenvergleich-rechner/',
        anchorText: 'Heizkosten verschiedener Systeme vergleichen',
        intentBadge: 'Alternativen vergleichen',
        badgeType: 'compare',
        reason: 'Stellt Erdgaskosten den Betriebskosten von Wärmepumpe, Holzpellets und Heizöl neutral gegenüber.',
        icon: 'layers',
      },
      {
        href: '/rechner/stromkostenrechner/',
        anchorText: 'Stromkosten im Haushalt berechnen',
        intentBadge: 'Haushaltsenergie',
        badgeType: 'kwh',
        reason: 'Kalkuliert die jährlichen Stromkosten einzelner Geräte und des gesamten Haushalts.',
        icon: 'zap',
      },
    ],
  },
};

export default function GasClusterLinks({ currentSlug }: Props) {
  const config = GAS_CLUSTER_CONFIG[currentSlug];
  if (!config) return null;

  const getBadgeStyle = (type: ClusterLinkItem['badgeType']) => {
    switch (type) {
      case 'm3':
        return { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' };
      case 'kwh':
        return { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' };
      case 'compare':
        return { background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' };
      case 'guide':
        return { background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe' };
    }
  };

  const getIcon = (icon: ClusterLinkItem['icon']) => {
    switch (icon) {
      case 'gauge':
        return <Gauge size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />;
      case 'calc':
        return <Calculator size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />;
      case 'book':
        return <BookOpen size={18} style={{ color: '#6d28d9', flexShrink: 0 }} />;
      case 'layers':
        return <Layers size={18} style={{ color: '#b45309', flexShrink: 0 }} />;
      case 'zap':
        return <Zap size={18} style={{ color: '#eab308', flexShrink: 0 }} />;
      default:
        return <Flame size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />;
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
      aria-labelledby="gas-cluster-heading"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
        <Flame size={22} style={{ color: 'var(--color-primary)' }} />
        <h2
          id="gas-cluster-heading"
          style={{
            fontSize: 'clamp(1.15rem, 3vw, 1.35rem)',
            fontWeight: 700,
            margin: 0,
            color: 'var(--color-text-primary)',
          }}
        >
          Passende Rechner &amp; Ratgeber
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
                    ...getBadgeStyle(item.badgeType),
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
