import React from 'react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/calculator/Breadcrumbs';
import styles from '@/styles/layout.module.css';

export const metadata: Metadata = {
  title: 'Impressum | RechenHafen',
  description: 'Impressum und gesetzliche Anbieterkennzeichnung nach § 5 DDG für die Website RechenHafen.',
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
          Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)
        </p>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Diensteanbieter & Betreiber der Plattform
          </h2>
          <p>
            <strong>RechenHafen</strong><br />
            Ein Projekt von RechenHafen Digital<br />
            Musterstraße 42<br />
            20457 Hamburg<br />
            Deutschland
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Kontakt
          </h2>
          <p>
            E-Mail: <a href="mailto:kontakt@rechenhafen.de" style={{ color: 'var(--color-primary)' }}>kontakt@rechenhafen.de</a><br />
            Website: <a href="https://rechenhafen.de" style={{ color: 'var(--color-primary)' }}>https://rechenhafen.de</a>
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Verantwortlich für redaktionelle Inhalte
          </h2>
          <p>
            Verantwortlich im Sinne des § 18 Abs. 2 MStV:<br />
            Redaktion RechenHafen<br />
            Musterstraße 42<br />
            20457 Hamburg
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Haftungsausschluss (Disclaimer)
          </h2>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: 'var(--space-4)' }}>
            Haftung für Inhalte
          </h3>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Die Berechnungen auf RechenHafen dienen der unverbindlichen Orientierung und allgemeinen Information. Trotz sorgfältigster Programmierung, Verifikation gegen amtliche Gesetze und kontinuierlicher mathematischer Kontrollen kann keine Gewähr für die absolute Fehlerfreiheit, Vollständigkeit oder Aktualität der Resultate übernommen werden.
          </p>
          <p>
            Die Nutzung der Online-Rechner ersetzt keinesfalls eine professionelle Rechts-, Steuer-, Anlage-, Bau- oder ärztliche Beratung.
          </p>

          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: 'var(--space-4)' }}>
            Haftung für Links
          </h3>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Urheberrecht
          </h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte, Rechenalgorithmen und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </section>
      </article>
    </div>
  );
}
