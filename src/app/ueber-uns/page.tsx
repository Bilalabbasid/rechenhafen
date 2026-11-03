import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/calculator/Breadcrumbs';
import styles from '@/styles/layout.module.css';
import { Anchor, ShieldCheck, Cpu, BookOpen, AlertCircle, RefreshCw, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Über uns – Betreiber, Methodik & Transparenz',
  description: 'Wer hinter RechenHafen steht, wie unsere Online-Rechner nach amtlichen Quellen programmiert und getestet werden, und wie Sie Korrekturen einreichen können.',
  alternates: {
    canonical: 'https://rechenhafen.de/ueber-uns/',
  },
  openGraph: {
    title: 'Über uns – Betreiber, Methodik & Transparenz',
    description: 'Wer hinter RechenHafen steht, wie unsere Online-Rechner nach amtlichen Quellen programmiert und getestet werden, und wie Sie Korrekturen einreichen können.',
    url: 'https://rechenhafen.de/ueber-uns/',
    siteName: 'RechenHafen',
    locale: 'de_DE',
    type: 'website',
  },
};

export default function UeberUnsPage() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Über RechenHafen – Betreiber, Methodik & Transparenz',
    url: 'https://rechenhafen.de/ueber-uns/',
    inLanguage: 'de-DE',
    mainEntity: {
      '@type': 'Organization',
      name: 'RechenHafen',
      url: 'https://rechenhafen.de',
      logo: 'https://rechenhafen.de/icon.svg',
      email: 'kontakt@rechenhafen.de',
      founder: {
        '@type': 'Person',
        name: '[FILL: founder name]',
      },
      sameAs: [
        '[FILL: real profiles if any, z. B. LinkedIn/GitHub/X oder leer lassen]',
      ],
      publishingPrinciples: 'https://rechenhafen.de/ueber-uns/#methodik',
      description: 'Unabhängige deutsche Informationsplattform für verifizierte Online-Rechner auf Basis amtlicher Gesetze, BMF-Standards und DIN-Normen.',
    },
  };

  return (
    <div className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }}
      />
      <Breadcrumbs items={[{ label: 'Über uns', href: '/ueber-uns/' }]} />

      <article style={{ maxWidth: '840px', margin: '0 auto var(--space-12)', lineHeight: 1.75, color: 'var(--color-text-secondary)' }}>
        <header style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            marginBottom: 'var(--space-4)'
          }}>
            <Anchor size={32} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
            Über RechenHafen
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
            Transparente Online-Rechner für Deutschland – datenschutzfreundlich, quellengestützt und nachvollziehbar.
          </p>
        </header>

        {/* 1. Who operates the site */}
        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            Wer hinter RechenHafen steht
          </h2>
          <p>
            RechenHafen wird betrieben von <strong>[FILL: founder name]</strong>.
          </p>
          <p style={{ marginTop: 'var(--space-2)' }}>
            <em>[FILL: founder name + 2–3 sentences of real background, z. B. beruflicher Hintergrund in Softwareentwicklung, Wirtschaftsmathematik oder Datenanalyse, Motivation zur Gründung der Plattform und Vision einer barrierefreien, datenschutzfreundlichen Rechner-Sammlung für Deutschland].</em>
          </p>
          <p style={{ marginTop: 'var(--space-2)' }}>
            <strong>Warum RechenHafen existiert:</strong> Viele bestehende Rechner im deutschsprachigen Internet sind mit aufdringlicher Werbung überladen, verlangen unnötige Kontaktdaten für einfache Rechenergebnisse oder basieren auf veralteten Gesetzesständen. RechenHafen wurde geschaffen, um allen Bürgern, Selbstständigen und Fachkräften eine verlässliche Orientierung zu bieten: kostenlose, transparente Berechnungen direkt im Browser, ohne Datenspeicherung und mit klar nachvollziehbaren Formeln.
          </p>
        </section>

        {/* 2. How calculators are built */}
        <section id="methodik" style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            Wie unsere Rechner entstehen und gepflegt werden
          </h2>
          <p>
            Sorgfalt und Transparenz sind der Kern unserer Arbeit. Jeder Rechner auf RechenHafen durchläuft ein mehrstufiges Entwicklungs- und Testverfahren:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-4)',
            margin: 'var(--space-6) 0'
          }}>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
              <BookOpen size={24} style={{ color: 'var(--color-primary)', marginBottom: '8px' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 6px' }}>
                Amtliche Primärquellen
              </h3>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                Wir stützen Rechenwege nicht auf Sekundärblogs, sondern direkt auf Gesetze (z. B. EStG, SGB, CO2KostAufG), offizielle Programmablaufpläne des Bundesfinanzministeriums (BMF), amtliche Mitteilungen der Deutschen Rentenversicherung (DRV), Destatis sowie anerkannte Normen (DIN 1333 Rundung, DIN 277).
              </p>
            </div>

            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
              <Cpu size={24} style={{ color: 'var(--color-primary)', marginBottom: '8px' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 6px' }}>
                Automatisierte Unit-Tests
              </h3>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                Jede Rechenfunktion ist mit automatisierten Regressionstests abgesichert. Rechenbeispiele und Grenzfälle werden kontinuierlich anhand behördlicher Vergleichsfälle und Berechnungsmuster getestet.
              </p>
            </div>

            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
              <RefreshCw size={24} style={{ color: 'var(--color-primary)', marginBottom: '8px' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 6px' }}>
                Jährlicher Aktualisierungszyklus
              </h3>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                Steuer- und sozialversicherungsrechtliche Parameter (wie Beitragsbemessungsgrenzen, Grundfreibetrag, Zusatzbeiträge zur Pflege- und Krankenversicherung) werden zum Jahreswechsel nach Veröffentlichung im Bundesgesetzblatt planmäßig aktualisiert.
              </p>
            </div>

            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
              <ShieldCheck size={24} style={{ color: 'var(--color-primary)', marginBottom: '8px' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 6px' }}>
                100 % Client-Side &amp; Privatsphäre
              </h3>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                Alle Rechnungen erfolgen rein lokal in Ihrem Webbrowser. Wir erfassen, übertragen oder speichern zu keinem Zeitpunkt Ihre persönlichen Finanz-, Gehalts- oder Gesundheitsdaten.
              </p>
            </div>
          </div>

          <p style={{ fontSize: '0.95rem' }}>
            Detaillierte Erläuterungen zu einzelnen rechtlichen Schwellenwerten und Normen finden Sie auch in unserer <Link href="/methodik/" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>ausführlichen Methodik-Dokumentation</Link>.
          </p>
        </section>

        {/* 3. Error reporting */}
        <section style={{ marginBottom: 'var(--space-8)', background: 'var(--color-surface-subtle)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
            <Mail size={24} style={{ color: 'var(--color-primary)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
              Fehler gefunden? So melden Sie Korrekturen
            </h2>
          </div>
          <p style={{ fontSize: '0.95rem', margin: 0 }}>
            Trotz sorgfältiger Recherche und automatisierter Tests können sich Gesetzesfassungen ändern oder Einzelfall-Konstellationen auftreten. Wenn Ihnen eine Unstimmigkeit, ein veralteter Wert oder ein Rundungsfehler auffällt, freuen wir uns über Ihren Hinweis:
          </p>
          <p style={{ margin: 'var(--space-3) 0 0', fontWeight: 600 }}>
            E-Mail: <a href="mailto:kontakt@rechenhafen.de" style={{ color: 'var(--color-primary)' }}>kontakt@rechenhafen.de</a>
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 'var(--space-2) 0 0' }}>
            Bitte geben Sie die betroffene Rechner-URL sowie die konkreten Eingabewerte an. Jeder Hinweis wird manuell anhand der jeweiligen Primärquelle verifiziert, behoben und im Änderungsprotokoll dokumentiert.
          </p>
        </section>

        {/* 4. Public Korrekturen / Änderungsprotokoll */}
        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            Korrekturen- &amp; Änderungsprotokoll
          </h2>
          <p style={{ fontSize: '0.95rem', marginBottom: 'var(--space-4)' }}>
            Transparenz bedeutet für uns auch, Änderungen und substantielle Korrekturen offen zu dokumentieren:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ borderLeft: '3px solid var(--color-primary)', paddingLeft: 'var(--space-4)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Oktober 2026</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '2px 0 4px' }}>
                Einheitenkonverter &amp; Längen-Umrechner
              </h3>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                Erweiterung des Zeit-Umrechners um das kalendarische Normaljahr (365 Tage / 8.760 h) und Einführung des dedizierten Meilen-Kilometer-Umrechners mit nautischer Seemeile (1.852 m).
              </p>
            </div>

            <div style={{ borderLeft: '3px solid var(--color-primary)', paddingLeft: 'var(--space-4)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>März 2026</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '2px 0 4px' }}>
                CO2KostAufG – Gesetzliche 10-Stufen-Aufteilung Wohngebäude
              </h3>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                Präzisierung des CO₂-Kosten-Aufteilungsrechners auf die amtliche 10-Stufen-Staffel nach Anlage 1 CO2KostAufG, Berücksichtigung der 50:50-Nichtwohngebäude-Regelung nach § 8 und Ausnahmeabzüge nach § 9.
              </p>
            </div>

            <div style={{ borderLeft: '3px solid var(--color-primary)', paddingLeft: 'var(--space-4)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Januar 2026</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '2px 0 4px' }}>
                Steuer- &amp; Sozialversicherungsanpassung 2026
              </h3>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                Aktualisierung des Brutto-Netto-Kerns auf den Grundfreibetrag 2026 (§ 32a EStG), neue Beitragsbemessungsgrenzen für Kranken- und Rentenversicherung sowie den bundesweiten durchschnittlichen Zusatzbeitragssatz.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Legal disclaimers link */}
        <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-6)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Die rechtlichen Pflichtangaben des Diensteanbieters finden Sie im <Link href="/impressum/" style={{ color: 'var(--color-primary)' }}>Impressum</Link>. Einzelheiten zur Datenverarbeitung erläutert unsere <Link href="/datenschutz/" style={{ color: 'var(--color-primary)' }}>Datenschutzerklärung</Link>.
          </p>
        </section>
      </article>
    </div>
  );
}
