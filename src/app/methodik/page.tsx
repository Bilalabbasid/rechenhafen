import React from 'react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/calculator/Breadcrumbs';
import styles from '@/styles/layout.module.css';
import { GERMAN_DATA_2026 } from '@/data/regulated/2026';

export const metadata: Metadata = {
  title: 'Berechnungsmethodik & Datenquellen 2026 | RechenHafen',
  description: 'Transparente Dokumentation unserer Rechenverfahren, DIN-Normen, Rundungsregeln und amtlichen Datenquellen für Deutschland.',
  alternates: {
    canonical: 'https://rechenhafen.de/methodik/',
  },
};

export default function MethodikPage() {
  const regulatedEntries = Object.entries(GERMAN_DATA_2026);

  return (
    <div className={styles.container}>
      <Breadcrumbs items={[{ label: 'Methodik & Datenquellen' }]} />

      <article style={{ maxWidth: '850px', margin: '0 auto var(--space-12)', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
          Berechnungsmethodik & Datenquellen
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)' }}>
          Wie RechenHafen arbeitet: Verlässliche mathematische Modelle, deutsche Rechtsnormen und strikte Qualitätskontrollen.
        </p>

        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            1. Trennung von Rechenlogik und regulierten Rahmendaten
          </h2>
          <p>
            Viele gesetzliche Grenzwerte in Deutschland ändern sich jährlich – etwa Mindestlöhne, Freibeträge, Pauschalen oder Beitragsbemessungsgrenzen. Um sicherzustellen, dass keine veralteten Festwerte in Formeln „fest verdrahtet“ sind, nutzt RechenHafen eine strikt versionierte Rahmendaten-Schicht (aktueller Stand: <strong>2026</strong>).
          </p>
          <p>
            Jeder regulierte Parameter wird mit der gesetzlichen Primärquelle (z. B. Bundesgesetzblatt, Gesetze im Internet, BMF-Schreiben) und dem Datum der letzten manuellen Verifikation dokumentiert.
          </p>
        </section>

        {/* Regulated Data Table */}
        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            Auszug der hinterlegten Referenzwerte 2026
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)'
            }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-hover)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '10px 14px' }}>Parameter</th>
                  <th style={{ padding: '10px 14px' }}>Wert</th>
                  <th style={{ padding: '10px 14px' }}>Gesetz / Primärquelle</th>
                  <th style={{ padding: '10px 14px' }}>Verifiziert</th>
                </tr>
              </thead>
              <tbody>
                {regulatedEntries.map(([key, item]) => (
                  <tr key={key} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{item.description}</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>
                      {item.value} {item.unit || ''}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
                        {item.source}
                      </a>
                    </td>
                    <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>{item.lastVerified}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            2. Rundungsverfahren & Präzision (DIN 1333)
          </h2>
          <p>
            Alle Berechnungen werden intern mit voller 64-Bit-Gleitkommapräzision (IEEE 754) durchgeführt. Erst bei der finalen Ausgabe erfolgt die Rundung nach den kaufmännischen Regeln der <strong>DIN 1333</strong> (Runden auf die nächste Zahl, ab 5 aufrunden).
          </p>
          <p>
            Die Textdarstellung entspricht der deutschen Normung nach <code>Intl.NumberFormat(&apos;de-DE&apos;)</code>:
          </p>
          <ul>
            <li><strong>Dezimaltrennzeichen:</strong> Komma (z. B. <code>12,82 €</code>)</li>
            <li><strong>Tausendertrennzeichen:</strong> Punkt (z. B. <code>1.250.000 €</code>)</li>
            <li><strong>Prozentzeichen:</strong> mit geschütztem Leerzeichen (z. B. <code>19,0 %</code>)</li>
          </ul>
        </section>

        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            3. Automatisierte Audit-Gates & Unit-Tests
          </h2>
          <p>
            Jede Änderung am Rechenkern durchläuft vor der Bereitstellung auf Vercel eine automatische Test-Pipeline:
          </p>
          <ul>
            <li><strong>Vitest Unit-Tests:</strong> Mathematische Randfälle (Schaltjahre, Nulldivisionen, 13-Wochen-Gehaltsformel, Zinseszins).</li>
            <li><strong>Statischer SEO- & Konsistenz-Audit:</strong> Prüfung auf eindeutige Slugs, fehlerfreie interne Verlinkungen und Vollständigkeit der Meta-Beschreibungen.</li>
            <li><strong>Echtzeit-Validierung:</strong> Schutz vor NaN (Not a Number) und unendlichen Werten durch stringente Eingabefilterung.</li>
          </ul>
        </section>
      </article>
    </div>
  );
}
