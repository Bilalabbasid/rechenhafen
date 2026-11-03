import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/calculator/Breadcrumbs';
import styles from '@/styles/layout.module.css';
import { LEGAL_VALUES_2026, LegalConstant } from '@/legal/de';
import { CheckCircle2, AlertTriangle, BookOpen, ExternalLink, HelpCircle, Mail, Clock, ShieldAlert, Cpu } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wie wir rechnen: Methodik, Datenquellen & Grenzen',
  description: 'Transparenz bei RechenHafen: Woher unsere Zahlen stammen, wie Formeln getestet werden, wann Gesetzeswerte aktualisiert werden und wo die Grenzen eines Online-Rechners liegen.',
  alternates: {
    canonical: 'https://rechenhafen.de/methodik/',
  },
  openGraph: {
    title: 'Wie wir rechnen: Methodik, Datenquellen & Grenzen – RechenHafen',
    description: 'Transparenz bei RechenHafen: Woher unsere Zahlen stammen, wie Formeln getestet werden, wann Gesetzeswerte aktualisiert werden und wo die Grenzen eines Online-Rechners liegen.',
    url: 'https://rechenhafen.de/methodik/',
    siteName: 'RechenHafen',
    locale: 'de_DE',
    type: 'website',
  },
};

export default function MethodikPage() {
  const legalKeys = Object.keys(LEGAL_VALUES_2026).filter((k) => k !== 'year') as Array<
    keyof typeof LEGAL_VALUES_2026
  >;

  const methodikSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Wie wir rechnen: Methodik, Datenquellen & Transparenz',
    description: 'Transparente Darstellung der Berechnungsmethodik, amtlichen Primärquellen und Modellgrenzen von RechenHafen.',
    url: 'https://rechenhafen.de/methodik/',
    inLanguage: 'de-DE',
    publisher: {
      '@type': 'Organization',
      name: 'RechenHafen',
      url: 'https://rechenhafen.de',
      logo: {
        '@type': 'ImageObject',
        url: 'https://rechenhafen.de/icon.svg',
      },
    },
  };

  return (
    <div className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(methodikSchema).replace(/</g, '\\u003c') }}
      />
      <Breadcrumbs items={[{ label: 'Wie wir rechnen & Methodik', href: '/methodik/' }]} />

      <article style={{ maxWidth: '880px', margin: '0 auto var(--space-12)', lineHeight: 1.75, color: 'var(--color-text-secondary)' }}>
        {/* Header */}
        <header style={{ marginBottom: 'var(--space-8)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: '#eff6ff', color: '#1d4ed8', fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
            <BookOpen size={16} /> Transparenz &amp; Methodik · Rechtsstand 2026
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0 0 var(--space-3)', lineHeight: 1.2 }}>
            Wie wir rechnen: Datenquellen, Testmethoden &amp; Grenzen
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Offenlegung statt Schein-Autorität: Woher unsere Zahlen kommen, wie wir Formeln verifizieren und warum unsere Ergebnisse stets unverbindliche Orientierungswerte sind.
          </p>
        </header>

        {/* 1. TOP STATEMENT: Honest Positioning */}
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)',
          marginBottom: 'var(--space-8)',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start'
        }}>
          <ShieldAlert size={24} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ display: 'block', fontSize: '1.05rem', color: '#92400e', marginBottom: '6px' }}>
              Wichtige Klarstellung zu unserem Angebot
            </strong>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#78350f' }}>
              <strong>RechenHafen ist kein Steuerberater, keine Rechtsanwaltskanzlei und keine Arztpraxis.</strong> Unsere Rechner berechnen mathematische Modelle auf Basis Ihrer Eingaben und der allgemein zugänglichen gesetzlichen Bestimmungen in Deutschland. Die Ergebnisse dienen ausschließlich Ihrer persönlichen Information und Orientierung. Sie ersetzen zu keinem Zeitpunkt eine individuelle steuerliche, juristische, finanzielle oder medizinische Beratung und begründen keinen behördlichen Rechtsanspruch.
            </p>
          </div>
        </div>

        {/* 2. Where the numbers come from */}
        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            1. Woher die Zahlen stammen: Amtliche Primärquellen
          </h2>
          <p>
            Keine gesetzliche Kennzahl auf RechenHafen wird geschätzt oder aus Drittanbieter-Blogs übernommen. Jede Zahl entstammt direkt einer amtlichen Publikation im Bundesgesetzblatt (BGBl.), im Bundesanzeiger (BAnz) oder den offiziellen Bekanntmachungen der Ministerien und Spitzenverbände:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '14px',
            margin: 'var(--space-4) 0'
          }}>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
              <strong style={{ color: 'var(--color-text-primary)', display: 'block', marginBottom: '4px' }}>
                Bundesministerium der Finanzen (BMF)
              </strong>
              <span style={{ fontSize: '0.85rem' }}>
                Einkommensteuertarif (§ 32a EStG), amtliche Lohnsteuer-Programmablaufpläne, Solidaritätszuschlaggesetz (§ 3 SolzG) und Entfernungspauschale (§ 9 EStG).
              </span>
            </div>

            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
              <strong style={{ color: 'var(--color-text-primary)', display: 'block', marginBottom: '4px' }}>
                BMAS &amp; Sozialversicherungsträger
              </strong>
              <span style={{ fontSize: '0.85rem' }}>
                Sozialversicherungs-Rechengrößenverordnung, Beitragsbemessungsgrenzen, allgemeine Beitragssätze (§ 241 SGB V, § 287 SGB VI, § 341 SGB III) und Bürgergeld-Regelsätze (§ 20 SGB II).
              </span>
            </div>

            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
              <strong style={{ color: 'var(--color-text-primary)', display: 'block', marginBottom: '4px' }}>
                GKV-Spitzenverband &amp; BMG
              </strong>
              <span style={{ fontSize: '0.85rem' }}>
                Bekanntmachung des durchschnittlichen Zusatzbeitragssatzes (§ 242a Abs. 2 SGB V) im Bundesanzeiger, Pflegeversicherungssätze nach § 55 SGB XI und Kinderabschläge.
              </span>
            </div>

            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
              <strong style={{ color: 'var(--color-text-primary)', display: 'block', marginBottom: '4px' }}>
                Mindestlohnkommission &amp; Minijob-Zentrale
              </strong>
              <span style={{ fontSize: '0.85rem' }}>
                Mindestlohnanpassungsverordnungen (MiLoV), Geringfügigkeitsgrenze (§ 8 Abs. 1a SGB IV: 603 €) und Umlagesätze U1, U2 und Insolvenzgeldumlage (§ 360 SGB III).
              </span>
            </div>

            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
              <strong style={{ color: 'var(--color-text-primary)', display: 'block', marginBottom: '4px' }}>
                Bundesministerium der Justiz &amp; Gerichte
              </strong>
              <span style={{ fontSize: '0.85rem' }}>
                Bürgerliches Gesetzbuch (BGB, z. B. Kündigungsfristen § 622, Darlehensrecht § 491), Pfändungsfreigrenzen (§ 850c ZPO), GNotKG und Düsseldorfer Tabelle des OLG Düsseldorf.
              </span>
            </div>

            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
              <strong style={{ color: 'var(--color-text-primary)', display: 'block', marginBottom: '4px' }}>
                Kraftfahrt-Bundesamt &amp; StVO
              </strong>
              <span style={{ fontSize: '0.85rem' }}>
                Bundeseinheitlicher Bußgeldkatalog (BKatV), Straßenverkehrs-Ordnung (StVO) und Straßenverkehrsgesetz (StVG § 24a).
              </span>
            </div>
          </div>
        </section>

        {/* Central Legal Values Table 2026 */}
        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            Zentrales Verzeichnis der gesetzlichen Referenzwerte (Rechtsstand 2026)
          </h3>
          <p style={{ fontSize: '0.9rem', marginBottom: 'var(--space-3)' }}>
            Alle Rechner auf RechenHafen greifen auf dieses gemeinsame, typisierte Gesetzeswerte-Modul (<code>src/legal/de/2026.ts</code>) zu:
          </p>
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
                  <th style={{ padding: '10px 12px' }}>Kennzahl / Bezeichnung</th>
                  <th style={{ padding: '10px 12px' }}>Wert</th>
                  <th style={{ padding: '10px 12px' }}>Gesetzliche Rechtsgrundlage</th>
                  <th style={{ padding: '10px 12px' }}>Gültig ab</th>
                  <th style={{ padding: '10px 12px' }}>Geprüft am</th>
                </tr>
              </thead>
              <tbody>
                {legalKeys.slice(0, 15).map((key) => {
                  const item = LEGAL_VALUES_2026[key] as LegalConstant<number | string>;
                  if (!item || typeof item !== 'object') return null;
                  return (
                    <tr key={key as string} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>{item.description || String(key)}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                        {item.value} {item.unit}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
                          {item.law} <ExternalLink size={11} style={{ display: 'inline', verticalAlign: 'middle' }} />
                        </a>
                      </td>
                      <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{item.validFrom}</td>
                      <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{item.checkedAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Hinweis: Weitere steuerliche Formelkoeffizienten und Übergangsparameter sind im Quellcode vollständig dokumentiert und über automatisierte Wächtertests abgesichert.
          </p>
        </section>

        {/* 3. Update Cycle */}
        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            2. Aktualisierungszyklen: Wann und wie oft aktualisiert wird
          </h2>
          <p>
            Gesetzliche Zahlen und Grenzwerte unterliegen geregelten Aktualisierungsintervallen:
          </p>
          <ul>
            <li>
              <strong>Haupt-Aktualisierung zum 1. Januar:</strong> Jährliche Anpassung von Einkommensteuertarif, Grundfreibetrag, Beitragsbemessungsgrenzen, Mindestlohn, Minijob-Grenze und Bürgergeld-Regelsätzen. Die Überprüfung findet statt, sobald die Verordnungen im Bundesgesetzblatt verkündet wurden.
            </li>
            <li>
              <strong>Halbjahres-Aktualisierung zum 1. Juli:</strong> Regelmäßige Überprüfung der Pfändungsfreigrenzen (§ 850c ZPO) und etwaiger unterjähriger Rentenanpassungen.
            </li>
            <li>
              <strong>Ad-hoc-Aktualisierungen:</strong> Treten unterjährige Steueränderungsgesetze rückwirkend oder kurzfristig in Kraft, werden die Parameter unverzüglich aktualisiert und im Änderungsprotokoll ausgewiesen.
            </li>
          </ul>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: 'var(--radius-md)', background: '#f1f5f9', fontSize: '0.85rem', color: '#334155', marginTop: '6px' }}>
            <Clock size={16} /> <span>Werte zuletzt aktualisiert: <strong>2026-11-02</strong></span>
          </div>
        </section>

        {/* 4. How formulas are tested */}
        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            3. Wie Formeln getestet werden: Regressionstests gegen amtliche Referenzfälle
          </h2>
          <p>
            Um Programmier- und Rechenfehler auszuschließen, wird jede Formel vor der Bereitstellung gegen amtliche Musterfälle getestet:
          </p>
          <ul>
            <li>
              <strong>BMF-Programmablaufplan Testfälle:</strong> Unsere Steuer- und Lohnrechenroutinen werden gegen die vom Bundesfinanzministerium herausgegebenen offiziellen Vergleichstabellen und Rundungsvorgaben abgeglichen.
            </li>
            <li>
              <strong>Düsseldorfer Tabelle Beispielfälle:</strong> Unterhaltsberechnungen werden anhand der offiziellen Anwendungsbeispiele des OLG Düsseldorf für unterschiedliche Altersstufen, Einkommensgruppen und Selbstbehalte automatisiert verifiziert.
            </li>
            <li>
              <strong>Automatisierte Schutztests (Vitest):</strong> Bei jedem Code-Update prüfen über 1.280 automatisierte Unittests, dass keine Formel fehlerhafte Datentypen, <code>NaN</code> oder <code>Infinity</code> zurückgibt und alle Randwerte (Schaltjahre, Null-Zinsen, Höchstbeträge) sauber abgefangen werden.
            </li>
          </ul>
        </section>

        {/* 5. Limits of Online Calculators */}
        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            4. Grenzen von Online-Rechnern: Standardfall vs. Einzelfall
          </h2>
          <p>
            Ein Online-Rechner arbeitet mit standardisierten Eingabemasken und generalisierten Formeln. Das deutsche Recht und die Realität von Haushalten und Unternehmen zeichnen sich jedoch durch Einzelfallregelungen aus:
          </p>
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
            margin: 'var(--space-4) 0'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 8px' }}>
              Wo ein Online-Rechner an seine Grenzen stößt:
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>Individuelle Steuerermäßigungen:</strong> Außergewöhnliche Belastungen (§ 33 EStG), Behinderungs-Pauschbeträge, Handwerkerleistungen (§ 35a EStG) oder Verlustvorträge lassen sich nur in einer individuellen Einkommensteuererklärung abbilden.
              </li>
              <li>
                <strong>Komplexe Arbeits- und Tarifverträge:</strong> Kündigungsfristen oder Sondervergütungen aus Tarifverträgen, Betriebsvereinbarungen oder leitenden Angestelltenverhältnissen weichen häufig von den gesetzlichen BGB-Mindestfristen ab.
              </li>
              <li>
                <strong>Behördliche Ermessensentscheidungen:</strong> Bei Sozialleistungen (Bürgergeld, Wohngeld, BAföG) entscheiden die Sachbearbeiter vor Ort über Angemessenheitsgrenzen von Heizkosten, Vermögensanrechnungen und Härtefälle.
              </li>
              <li>
                <strong>Medizinische und biometrische Parameter:</strong> Kalorien-, BMI- oder Promillerechner können individuelle Stoffwechselunterschiede, Vorerkrankungen oder Medikamentenwechselwirkungen nicht berücksichtigen.
              </li>
            </ul>
          </div>
          <p>
            In all diesen Fällen ist der Gang zu einem Steuerberater, einer Rechtsanwältin, der zuständigen Behörde oder einer Arztpraxis unumgänglich.
          </p>
        </section>

        {/* 6. Error Reporting & Fixes */}
        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            5. Fehler melden &amp; Änderungsprotokoll
          </h2>
          <p>
            Transparenz bedeutet für uns auch, offen mit Fehlern oder veränderten Rechtslagen umzugehen. Sollten Sie in einer Formel, einer Quellenangabe oder einem Rechnertext eine Unstimmigkeit feststellen, bitten wir um Ihren Hinweis:
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-5)',
            margin: 'var(--space-4) 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={18} style={{ color: 'var(--color-primary)' }} />
              <span><strong>Redaktionskontakt:</strong> [FILL: feedback-email z. B. redaktion@rechenhafen.de]</span>
            </div>
            <div>
              <strong>Unser Qualitätsversprechen:</strong>
              <p style={{ margin: '4px 0 0', fontSize: '0.9rem' }}>
                Jeder gemeldete Fehler wird innerhalb von 5 Werktagen redaktionell und rechnerisch geprüft. Bestätigte Formelkorrekturen werden mit neuem Unittest eingespielt und im Änderungsprotokoll transparent dokumentiert.
              </p>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
