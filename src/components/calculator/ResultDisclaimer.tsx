import React from 'react';
import Link from 'next/link';
import { ExternalLink, Info, Scale } from 'lucide-react';
import { DisclaimerType, LegalBasisLink } from '@/types/calculator';

interface ResultDisclaimerProps {
  disclaimerType?: DisclaimerType;
  rechtsstand?: string;
  legalBasis?: LegalBasisLink[];
  assumptions?: string[];
}

const SPECIFIC_DISCLAIMERS: Record<DisclaimerType, string> = {
  steuer:
    'Der Rechner ersetzt keine steuerliche Beratung durch einen Steuerberater oder Lohnsteuerhilfeverein und keinen Steuerbescheid des Finanzamts.',
  'gehalt-sozialversicherung':
    'Maßgeblich für Ihren Lohnabzug ist die Entgeltabrechnung Ihres Arbeitgebers und Ihre elektronischen Lohnsteuerabzugsmerkmale (ELStAM).',
  recht:
    'Diese Berechnung ersetzt keine Rechtsberatung durch eine Rechtsanwältin oder einen Rechtsanwalt.',
  sozialleistung:
    'Rechtsansprüche können nur durch einen schriftlichen Bescheid der zuständigen Behörde begründet werden. Der Rechner berücksichtigt keine individuellen Härtefälle.',
  finanzen:
    'Dies ist keine Anlage-, Kredit- oder Finanzberatung. Konditionen von Banken können abweichen.',
  immobilien:
    'Kaufnebenkosten und Finanzierungskonditionen variieren je nach Bundesland, Bank und Notariat. Die Berechnung ersetzt keine Finanzierungsberatung.',
  gesundheit:
    'Dieser Rechner dient der allgemeinen Information und ersetzt keine ärztliche Untersuchung, Diagnose oder Beratung.',
  schwangerschaft:
    'Die Berechnung basiert auf Standard-Schwangerschaftszyklen. Der tatsächliche Geburtszeitraum kann abweichen; maßgeblich ist die ärztliche Betreuung.',
  'alkohol-verkehr':
    'Rechnerische Blutalkoholwerte sind grobe Näherungen und hängen von Stoffwechsel, Mageninhalt und weiteren Faktoren ab. Fahren Sie niemals unter Alkoholeinfluss.',
  'verkehr-bussgeld':
    'Maßgeblich ist der Bußgeldbescheid der zuständigen Behörde. Toleranzen und Einzelfallumstände können abweichen.',
  bauen:
    'Baurechtliche Vorgaben und Maße sind vor Ort und durch Fachplaner zu prüfen. Der Rechner ersetzt keine statische oder architektonische Planung.',
  allgemein:
    'Für die Richtigkeit der Berechnung und die Eignung für einen bestimmten Zweck wird keine Gewähr übernommen.',
};

export default function ResultDisclaimer({
  disclaimerType = 'allgemein',
  rechtsstand,
  legalBasis = [],
  assumptions = [],
}: ResultDisclaimerProps) {
  const hasLegalBasis = Boolean(rechtsstand || (legalBasis && legalBasis.length > 0));
  const yearText = rechtsstand || '2026';

  const baseSentence = hasLegalBasis
    ? `Dieses Ergebnis ist eine unverbindliche Orientierung. Es beruht ausschließlich auf Ihren Eingaben und den allgemeinen gesetzlichen Regelungen in Deutschland (Rechtsstand ${yearText}). Individuelle Besonderheiten werden nicht berücksichtigt.`
    : 'Dieses Ergebnis ist eine rechnerische Orientierung auf Basis Ihrer Eingaben. Bitte prüfen Sie wichtige Werte vor der Verwendung.';

  const secondSentence = SPECIFIC_DISCLAIMERS[disclaimerType] || SPECIFIC_DISCLAIMERS.allgemein;

  return (
    <aside
      role="note"
      aria-label="Hinweis zur Berechnung und rechtliche Einordnung"
      style={{
        marginTop: 'var(--space-4)',
        marginBottom: 'var(--space-4)',
        padding: '16px 18px',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        fontSize: '14px',
        lineHeight: 1.6,
        color: '#334155',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
        <Info size={18} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 6px', fontWeight: 500, color: '#1e293b' }}>
            {baseSentence}
          </p>
          <p style={{ margin: 0, color: '#475569' }}>
            {secondSentence}
          </p>
        </div>
      </div>

      {assumptions && assumptions.length > 0 && (
        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
          <div style={{ fontWeight: 600, fontSize: '13px', color: '#1e293b', marginBottom: '4px' }}>
            Annahmen dieser Berechnung:
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#475569' }}>
            {assumptions.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '2px' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {legalBasis && legalBasis.length > 0 && (
        <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #cbd5e1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '13px', color: '#1e293b', marginBottom: '4px' }}>
            <Scale size={14} style={{ color: '#059669' }} aria-hidden="true" />
            <span>Rechtsgrundlage ({rechtsstand ? `Stand ${rechtsstand}` : 'Deutschland'}):</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 14px', fontSize: '13px' }}>
            {legalBasis.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#0284c7',
                  textDecoration: 'underline',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{link.label}</span>
                <ExternalLink size={12} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '10px', fontSize: '12px', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
        <span>
          {rechtsstand ? `Rechtsstand: ${rechtsstand}` : 'Standard-Berechnungsmethode'}
        </span>
        <Link
          href="/methodik/"
          style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 500 }}
        >
          Wie wir rechnen & Transparenz
        </Link>
      </div>
    </aside>
  );
}
