import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/calculator/Breadcrumbs';
import styles from '@/styles/layout.module.css';
import { GERMAN_DATA_2026 } from '@/data/regulated/2026';
import { ShieldCheck, CheckCircle2, AlertTriangle, BookOpen, ExternalLink, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Berechnungsmethodik, Datenquellen & Transparenz | RechenHafen',
  description: 'Wissenschaftliche und amtliche Methodik von RechenHafen: Formel-Verifikation, DIN 1333 Rundung, 2026-Referenzdaten, Primärquellen und Modellgrenzen.',
  alternates: {
    canonical: 'https://rechenhafen.de/methodik/',
  },
};

export default function MethodikPage() {
  const regulatedEntries = Object.entries(GERMAN_DATA_2026);

  return (
    <div className={styles.container}>
      <Breadcrumbs items={[{ label: 'Methodik & Datenquellen', href: '/methodik/' }]} />

      <article style={{ maxWidth: '880px', margin: '0 auto var(--space-12)', lineHeight: 1.75, color: 'var(--color-text-secondary)' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
            <ShieldCheck size={16} /> Verifizierte Methodik · Stand 2026
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0 0 var(--space-3)', lineHeight: 1.2 }}>
            Berechnungsmethodik, Datenquellen & Verlässlichkeit
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Verlässliche Zahlen statt Black-Box: Wie RechenHafen mathematische Modelle, deutsche Rechtsnormen und amtliche Kennzahlen implementiert, prüft und pflegt.
          </p>
        </div>

        {/* Core Principles */}
        <section style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-8)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 var(--space-3)' }}>
            Grundsätze echter Verlässlichkeit
          </h2>
          <p style={{ margin: '0 0 var(--space-3)', fontSize: '0.95rem' }}>
            Das Vertrauen in eine Rechenplattform basiert nicht auf erfundenen Siegeln, Pseudo-Expertenzitaten oder gekauften Testimonials, sondern auf <strong>reproduzierbarer mathematischer Korrektheit, offengelegten Modellannahmen und transparenten Primärquellen</strong>.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginTop: 'var(--space-4)' }}>
            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-hover)' }}>
              <strong style={{ color: 'var(--color-text-primary)', display: 'block', marginBottom: '4px' }}>✓ 100 % Lokale Berechnung</strong>
              <span style={{ fontSize: '0.85rem' }}>Alle Berechnungen laufen deterministisch im Browser. Keine Übertragung Ihrer persönlichen Zahlen an Server.</span>
            </div>
            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-hover)' }}>
              <strong style={{ color: 'var(--color-text-primary)', display: 'block', marginBottom: '4px' }}>✓ Keine veralteten Hardcodes</strong>
              <span style={{ fontSize: '0.85rem' }}>Gesetzliche Parameter liegen in einer versionierten Konfigurationsschicht (Stand 2026) mit Prüfdatum.</span>
            </div>
            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-hover)' }}>
              <strong style={{ color: 'var(--color-text-primary)', display: 'block', marginBottom: '4px' }}>✓ Deutsche Normen (DIN)</strong>
              <span style={{ fontSize: '0.85rem' }}>Kaufmännische Rundung nach DIN 1333 und standardisierte Lokalisierung nach de-DE.</span>
            </div>
          </div>
        </section>

        {/* Section 1: Development Process */}
        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            1. Wie Rechner bei RechenHafen entwickelt werden
          </h2>
          <p>
            Jeder Rechner auf RechenHafen durchläuft einen mehrstufigen Entwicklungs- und Validierungsprozess:
          </p>
          <ol style={{ paddingLeft: '24px', margin: 'var(--space-3) 0' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Quellen- & Formel-Recherche:</strong> Ermittlung der anerkannten Primärliteratur, Normen oder Gesetzesgrundlagen (z. B. BGB, EStG, WHO-Berichte, DIN-Normen).
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Algorithmische Spezifikation:</strong> Überführung der Formel in deterministischen TypeScript-Code. Definition von Wertebereichen, Min-/Max-Grenzen und Schrittweiten.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Gegenrechnung mit Referenzfällen:</strong> Manuelle Verifikation an amtlichen Musterbeispielen (z. B. BMF-Berechnungsmuster für die Pendlerpauschale, Zinseszins-Referenztabellen der Bundesbank).
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Automatisierte Tests:</strong> Erstellung von Unit-Tests zur Absicherung von Grenzwerten, Nullwerten, Schaltjahren und Extremwerten.
            </li>
          </ol>
        </section>

        {/* Section 2: Verification & Test Pipelines */}
        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            2. Formel-Verifikation & Qualitätskontrolle
          </h2>
          <p>
            Um Rechenfehler, Ausreißer und fehlerhafte Datentypen auszuschließen, verwendet RechenHafen eine automatisierte Continuous-Integration-Pipeline mit dem Test-Framework <strong>Vitest</strong>:
          </p>
          <ul>
            <li><strong>Vermeidung von NaN und Infinity:</strong> Alle Eingaben werden vor der Auswertung typisiert, bereinigt und gegen Nulldivisionen abgesichert. Ungültige Eingaben führen zu aussagekräftigen Fehlerhinweisen statt zu fehlerhaften Zahlen.</li>
            <li><strong>Randwertanalysen:</strong> Prüfung auf Grenzfälle wie negative Zinssätze, Null-Zinsen, 29. Februar in Schaltjahren, Monatsenden mit 28/30/31 Tagen und Zinsbindungen bis 50 Jahre.</li>
            <li><strong>Konsistenzprüfungen:</strong> Automatische Überprüfung, dass alle 405 Rechner eine vollständige Formel, eine Formelerklärung, ein nachvollziehbares Rechenbeispiel und korrekte Meta-Tags besitzen.</li>
          </ul>
        </section>

        {/* Section 3: Time-Sensitive Data & Regulatory Layer */}
        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            3. Pflege regulierter & zeitkritischer Rahmendaten
          </h2>
          <p>
            Gesetzliche Grenzwerte, Freibeträge, Beitragsbemessungsgrenzen und Pauschalen in Deutschland ändern sich regelmäßig zum 1. Januar eines Jahres. Um zu verhindern, dass veraltete Zahlen in Formeln verborgen bleiben, trennt RechenHafen strikt zwischen Rechenalgorithmus und Rahmendaten:
          </p>
          <p>
            Alle regulierten Werte werden zentral in der Datei <code>src/data/regulated/2026/index.ts</code> gepflegt. Jeder Wert ist mit seiner gesetzlichen Primärquelle, der Fundstelle im Bundesgesetzblatt oder amtlichen Schreiben und dem Datum der letzten manuellen Überprüfung versehen.
          </p>
        </section>

        {/* Section 4: Regulated Data Table 2026 */}
        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            Referenzwerte für Deutschland (Stand: 2026)
          </h3>
          <div style={{ overflowX: 'auto', marginBottom: 'var(--space-4)' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.85rem',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)'
            }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-hover)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '10px 12px' }}>Parameter / Bezeichnung</th>
                  <th style={{ padding: '10px 12px' }}>Wert</th>
                  <th style={{ padding: '10px 12px' }}>Gesetzliche Primärquelle</th>
                  <th style={{ padding: '10px 12px' }}>Gültig ab</th>
                  <th style={{ padding: '10px 12px' }}>Verifiziert</th>
                </tr>
              </thead>
              <tbody>
                {regulatedEntries.map(([key, item]) => (
                  <tr key={key} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{item.description}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                      {item.value} {item.unit || ''}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
                        {item.source} <ExternalLink size={11} style={{ display: 'inline', verticalAlign: 'middle' }} />
                      </a>
                    </td>
                    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{item.effectiveFrom}</td>
                    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{item.lastVerified}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Rounding Methodology & Precision */}
        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            4. Rundungsmethodik & Numerische Präzision (DIN 1333)
          </h2>
          <p>
            Um Rundungsfehler und Akkumulationseffekte zu vermeiden, folgt RechenHafen klaren mathematischen Regeln:
          </p>
          <ul>
            <li><strong>Interne Präzision:</strong> Alle Zwischenrechnungen werden mit voller 64-Bit-Gleitkommapräzision (IEEE 754 Floating Point) ohne vorzeitige Rundung durchgeführt.</li>
            <li><strong>Kaufmännische Rundung:</strong> Die Rundung auf Cent-Beträge oder Nachkommastellen erfolgt erst am Ende der Berechnungskette nach der deutschen Norm <strong>DIN 1333</strong> (ab 5 aufrunden, unter 5 abrunden).</li>
            <li><strong>Deutsche DIN-Formatierung:</strong> Formatierung von Zahlen nach <code>Intl.NumberFormat(&apos;de-DE&apos;)</code> mit Komma als Dezimaltrenner (z. B. <code>1.450,50 €</code>) und Punkt als Tausendertrennzeichen.</li>
          </ul>
        </section>

        {/* Section 6: Sources by Domain */}
        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            5. Autorisierte Primärquellen nach Fachbereich
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>Steuern & Abgaben:</strong>
              <p style={{ fontSize: '0.875rem', margin: '6px 0 0' }}>Bundesministerium der Finanzen (BMF), Einkommensteuergesetz (EStG), Umsatzsteuergesetz (UStG), Bundesfinanzhof (BFH).</p>
            </div>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>Arbeitsrecht & Soziales:</strong>
              <p style={{ fontSize: '0.875rem', margin: '6px 0 0' }}>Bürgerliches Gesetzbuch (BGB § 622), Bundesurlaubsgesetz (BUrlG § 11), Bundesministerium für Arbeit und Soziales (BMAS), Minijob-Zentrale.</p>
            </div>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>Finanzen & Kredite:</strong>
              <p style={{ fontSize: '0.875rem', margin: '6px 0 0' }}>Deutsche Bundesbank (Zinsstatistiken), Preisangabenverordnung (PAngV für Effektivzins), Statistisches Bundesamt (Destatis für VPI/Inflation).</p>
            </div>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>Energie & Umwelt:</strong>
              <p style={{ fontSize: '0.875rem', margin: '6px 0 0' }}>Umweltbundesamt (UBA CO₂-Emissionsfaktoren), Bundesverband der Energie- und Wasserwirtschaft (BDEW), Deutscher Wetterdienst (DWD Einstrahlungsdaten).</p>
            </div>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>Gesundheit & Biometrie:</strong>
              <p style={{ fontSize: '0.875rem', margin: '6px 0 0' }}>Weltgesundheitsorganisation (WHO Klassifikationen), Deutsche Gesellschaft für Ernährung (DGE), anerkannte Studienmodelle (Mifflin-St.Jeor, Katch-McArdle, Broca).</p>
            </div>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>Mathematik & Physik:</strong>
              <p style={{ fontSize: '0.875rem', margin: '6px 0 0' }}>DIN-Normen (DIN 1333), Internationales Einheitensystem (SI), klassische euklidische Geometrie und Finanzmathematik (Annuitätenformeln).</p>
            </div>
          </div>
        </section>

        {/* Section 7: Update Process */}
        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            6. Aktualisierungs- und Revisionsprozess
          </h2>
          <p>
            Gesetzliche und wirtschaftliche Rahmenbedingungen unterliegen kontinuierlichen Änderungen. Unser Revisionsprozess ist wie folgt strukturiert:
          </p>
          <ul>
            <li><strong>Jährliche Generalüberprüfung (Dezember/Januar):</strong> Vor jedem Jahreswechsel werden alle steuerlichen, arbeitsrechtlichen und beitragsrechtlichen Grenzwerte anhand der verabschiedeten Bundesgesetze im Bundesgesetzblatt aktualisiert.</li>
            <li><strong>Quartalsweise Markt-Aktualisierung:</strong> Überprüfung variabler Kennzahlen wie bundesweiter Durchschnittsstrompreise, Kraftstoffpreise und Inflationsdaten.</li>
            <li><strong>Versionierte Code-Verwaltung:</strong> Alle Änderungen an Formeln oder Grenzwerten werden im Git-Repository versioniert und automatisiert vor jedem Produktionsbuild validiert.</li>
          </ul>
        </section>

        {/* Section 8: Model Limitations & Disclaimers */}
        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            7. Modellgrenzen & Rechtlicher Hinweis
          </h2>
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            fontSize: '0.9rem',
            color: '#92400e',
            lineHeight: 1.6
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 700 }}>
              <AlertTriangle size={18} /> Grenzen vereinfachter Online-Modellrechnungen
            </div>
            <p style={{ margin: '0 0 8px' }}>
              Online-Rechner arbeiten mit mathematischen Abstraktionen und standardisierten Annahmen, um komplexe Sachverhalte schnell und übersichtlich darzustellen:
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li><strong>Keine Rechts- oder Steuerberatung:</strong> Berechnungen im Bereich Steuern, Gehalt, Recht und Rente dienen der unverbindlichen Erstinformation. Sie ersetzen keine individuelle Beratung durch Steuerberater (§ 1 StBerG), Rechtsanwälte (§ 1 RDG) oder Rentenberater.</li>
              <li><strong>Keine medizinische Diagnose:</strong> Gesundheits- und Fitnessrechner liefern rein statistische Orientierungswerte und stellen keine medizinische Befundung oder Ernährungsberatung dar.</li>
              <li><strong>Zinsänderungs- & Anlagerisiken:</strong> Finanzkalkulationen basieren auf fixen Zins- und Renditeannahmen. Reale Marktentwicklungen, Gebühren von Kreditinstituten und Kursrisiken können abweichen.</li>
            </ul>
          </div>
        </section>
      </article>
    </div>
  );
}
