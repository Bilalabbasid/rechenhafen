import React from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertCircle, Scale, Leaf, Calculator, ExternalLink } from 'lucide-react';
import { TrustMetadata } from '@/types/calculator';

interface Props {
  category: string;
  timeSensitiveMeta?: {
    year: number;
    source: string;
    sourceUrl?: string;
    lastVerified: string;
  };
  trustMeta?: TrustMetadata;
}

export default function MethodologyBox({ category, timeSensitiveMeta, trustMeta }: Props) {
  const isHealth = category === 'gesundheit-fitness';
  const isLegalOrTax = ['arbeit-gehalt', 'recht-steuern', 'finanzen', 'kredit-schulden'].includes(category);
  const isEnvironmental = ['haushalt-energie', 'energie-umwelt', 'haus-garten'].includes(category);
  const isFinance = ['finanzen', 'kredit-schulden'].includes(category);

  return (
    <section
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'clamp(var(--space-4), 4vw, var(--space-6))',
        margin: 'var(--space-8) 0',
        lineHeight: 1.6,
        overflowWrap: 'break-word',
      }}
      aria-labelledby="methodik-transparenz-heading"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} style={{ color: 'var(--color-primary)' }} />
          <h2 id="methodik-transparenz-heading" style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
            Berechnungsmethodik, Annahmen & Verlässlichkeit
          </h2>
        </div>
        {timeSensitiveMeta && (
          <span style={{
            fontSize: '0.75rem',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            background: '#ecfdf5',
            color: '#065f46',
            fontWeight: 600,
          }}>
            Rechtsstand: {timeSensitiveMeta.year} (geprüft am {timeSensitiveMeta.lastVerified})
          </span>
        )}
      </div>

      {/* Category Specific Trust Guidance */}
      {isHealth && (
        <div style={{
          display: 'flex',
          gap: '10px',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          marginBottom: 'var(--space-4)',
          fontSize: '0.875rem',
          color: '#92400e',
        }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Medizinischer Orientierungshinweis:</strong> Die Berechnung basiert auf anerkannten biometrischen Rechenmodellen (z. B. Richtlinien der Weltgesundheitsorganisation WHO, Mifflin-St.Jeor-Gleichung oder Katch-McArdle-Formel). Die Ergebnisse stellen Näherungswerte zur Orientierung dar und ersetzen keinesfalls eine ärztliche Diagnose, therapeutische Behandlung oder professionelle Ernährungsberatung.
          </div>
        </div>
      )}

      {isLegalOrTax && !isHealth && (
        <div style={{
          display: 'flex',
          gap: '10px',
          background: 'var(--color-surface-hover)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          marginBottom: 'var(--space-4)',
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
        }}>
          <Scale size={18} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-primary)' }} />
          <div>
            <strong>Rechtliche Grundlagen & Gesetzesstand 2026:</strong> Die Berechnungen stützen sich auf die amtlichen Gesetzestexte der Bundesrepublik Deutschland (u. a. BGB, EStG, BUrlG, UStG, PAngV). Die Ergebnisse dienen der unverbindlichen Erstorientierung und ersetzen keine Rechts-, Steuer- oder Rentenberatung im Einzelfall.
          </div>
        </div>
      )}

      {isEnvironmental && (
        <div style={{
          display: 'flex',
          gap: '10px',
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          marginBottom: 'var(--space-4)',
          fontSize: '0.875rem',
          color: '#065f46',
        }}>
          <Leaf size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Emissions- & Energiedaten:</strong> Berechnungen zu CO₂-Einsparungen und Energieverbräuchen orientieren sich an den offiziellen Kennzahlen des Umweltbundesamtes (UBA, z. B. bundesweiter Strommix ca. 380 g CO₂/kWh) und bundesweiten Branchendurchschnitten des BDEW.
          </div>
        </div>
      )}

      {isFinance && (
        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
          <strong>Finanzmathematische Annahmen:</strong>
          <ul style={{ margin: '4px 0 0', paddingLeft: '20px' }}>
            <li>Zinssätze und Renditen werden für den gewählten Zeithorizont als konstant modelliert.</li>
            <li>Zinseszinsberechnungen erfolgen unterjährig monatlich bzw. dekursiv gemäß üblicher Bankpraxis.</li>
            <li>Individuelle Transaktionskosten, Verwahrgebühren oder nach Ende der Zinsbindung geänderte Marktzinsen sind separat einzukalkulieren.</li>
          </ul>
        </div>
      )}

      {/* Specific Trust Metadata if configured */}
      {trustMeta?.methodology && (
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '0 0 var(--space-2)' }}>
          <strong>Verwendete Methodik:</strong> {trustMeta.methodology}
        </p>
      )}

      {trustMeta?.assumptions && trustMeta.assumptions.length > 0 && (
        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
          <strong>Modellannahmen:</strong>
          <ul style={{ margin: '4px 0 0', paddingLeft: '20px' }}>
            {trustMeta.assumptions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      {trustMeta?.limitations && trustMeta.limitations.length > 0 && (
        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
          <strong>Grenzen der Berechnung:</strong>
          <ul style={{ margin: '4px 0 0', paddingLeft: '20px' }}>
            {trustMeta.limitations.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </div>
      )}

      {timeSensitiveMeta && (
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 'var(--space-2) 0' }}>
          <strong>Amtliche Datenquelle:</strong>{' '}
          {timeSensitiveMeta.sourceUrl ? (
            <a href={timeSensitiveMeta.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
              {timeSensitiveMeta.source} <ExternalLink size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
            </a>
          ) : (
            timeSensitiveMeta.source
          )}
        </p>
      )}

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-3)', fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
        Rundung nach <strong>DIN 1333</strong>. Alle Rechenregeln, Prüfpipelines und die vollständige Referenztabelle finden Sie in unserer transparenten{' '}
        <Link href="/methodik/" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          Berechnungsmethodik & Datenquellen 2026 →
        </Link>
      </div>
    </section>
  );
}
