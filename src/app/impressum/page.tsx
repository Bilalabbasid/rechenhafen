import React from 'react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/calculator/Breadcrumbs';
import styles from '@/styles/layout.module.css';

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum und gesetzliche Anbieterkennzeichnung nach § 5 DDG und § 18 Abs. 2 MStV für RechenHafen.',
  alternates: {
    canonical: 'https://rechenhafen.de/impressum/',
  },
};

export default function ImpressumPage() {
  return (
    <div className={styles.container}>
      <Breadcrumbs items={[{ label: 'Impressum', href: '/impressum/' }]} />

      <article style={{ maxWidth: '800px', margin: '0 auto var(--space-12)', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
          Impressum
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
          Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG) und § 18 Abs. 2 Medienstaatsvertrag (MStV)
        </p>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Diensteanbieter &amp; Betreiber der Website
          </h2>
          <p>
            <strong>[FILL: legal entity or full name]</strong><br />
            [FILL: street + number, postcode, city, country]<br />
            E-Mail: [FILL: contact email, z. B. kontakt@rechenhafen.de]<br />
            Website: https://rechenhafen.de
          </p>
          <p style={{ marginTop: 'var(--space-2)' }}>
            <strong>Registereintrag (falls zutreffend):</strong><br />
            [FILL: company register + number, if a company, z. B. Amtsgericht Musterstadt HRB 12345 / oder: Nicht eingetragen (Einzelunternehmen)]
          </p>
          <p style={{ marginTop: 'var(--space-2)' }}>
            <strong>Umsatzsteuer-Identifikationsnummer (falls vorhanden):</strong><br />
            [FILL: VAT ID, if any, gemäß § 27a UStG, z. B. DE 123456789]
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Verantwortlich für redaktionelle Inhalte
          </h2>
          <p>
            Verantwortlich gemäß § 18 Abs. 2 MStV:<br />
            <strong>[FILL: natural person name]</strong><br />
            [FILL: street + number, postcode, city, country]
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Haftung für Inhalte &amp; Berechnungen
          </h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
            Alle Online-Rechner und Ratgebertexte auf RechenHafen wurden mit größter Sorgfalt und anhand amtlicher Quellen (z. B. BMF, Bundesgesetze, DIN-Normen) implementiert und fortlaufend geprüft.
          </p>
          <p style={{ marginTop: 'var(--space-2)' }}>
            Die bereitgestellten Rechenergebnisse dienen ausschließlich der unverbindlichen Orientierung und allgemeinen Information.
            Sie stellen keine Rechts-, Steuer-, Anlage-, Bau- oder medizinische Beratung dar und können eine individuelle Fachberatung nicht ersetzen.
            Für Entscheidungen, die auf Grundlage der Berechnungsergebnisse getroffen werden, übernehmen wir keine Haftung.
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Haftung für externe Links
          </h2>
          <p>
            Diese Website enthält Verlinkungen zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
            Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.
            Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links unverzüglich entfernen.
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Urheberrecht
          </h2>
          <p>
            Die auf dieser Website erstellten Inhalte, Rechner und Quelltexte unterliegen dem deutschen Urheberrecht.
            Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der vorherigen schriftlichen Zustimmung des Betreibers.
          </p>
        </section>
      </article>
    </div>
  );
}
