import React from 'react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/calculator/Breadcrumbs';
import styles from '@/styles/layout.module.css';
import { SITE_OWNER } from '@/config/site-owner';

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum und rechtliche Hinweise zu RechenHafen.',
  alternates: {
    canonical: 'https://rechenhafen.de/impressum/',
  },
};

export default function ImpressumPage() {
  const imp = SITE_OWNER.impressum;
  return (
    <div className={styles.container}>
      <Breadcrumbs items={[{ label: 'Impressum', href: '/impressum/' }]} />

      <article style={{ maxWidth: '800px', margin: '0 auto var(--space-12)', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
          Impressum
        </h1>
        {imp.name && (
          <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
            Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG) und § 18 Abs. 2 Medienstaatsvertrag (MStV)
          </p>
        )}

        {imp.name && (
        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Diensteanbieter &amp; Betreiber der Website
          </h2>
          <p>
            {imp.name && (<><strong>{imp.name}</strong><br /></>)}
            {imp.street && (<>{imp.street}<br /></>)}
            {imp.city && (<>{imp.city}<br /></>)}
            {SITE_OWNER.contactEmail && (
              <>E-Mail: <a href={`mailto:${SITE_OWNER.contactEmail}`} style={{ color: 'var(--color-primary)' }}>{SITE_OWNER.contactEmail}</a><br /></>
            )}
            Website: https://rechenhafen.de
          </p>
          {imp.register && (
            <p style={{ marginTop: 'var(--space-2)' }}>
              <strong>Registereintrag:</strong><br />
              {imp.register}
            </p>
          )}
          {imp.vatId && (
            <p style={{ marginTop: 'var(--space-2)' }}>
              <strong>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:</strong><br />
              {imp.vatId}
            </p>
          )}
        </section>
        )}

        {imp.responsiblePerson && (
          <section style={{ marginBottom: 'var(--space-6)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Verantwortlich für redaktionelle Inhalte
            </h2>
            <p>
              Verantwortlich gemäß § 18 Abs. 2 MStV:<br />
              <strong>{imp.responsiblePerson}</strong><br />
              {imp.responsibleAddress || [imp.street, imp.city].filter(Boolean).join(', ')}
            </p>
          </section>
        )}

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Haftung für Inhalte &amp; Berechnungen
          </h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
            Alle Online-Rechner und Ratgebertexte auf RechenHafen wurden mit größter Sorgfalt und anhand amtlicher Quellen (z. B. BMF, Bundesgesetze, DIN-Normen) implementiert und regelmäßig aktualisiert.
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
