import React from 'react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/calculator/Breadcrumbs';
import styles from '@/styles/layout.module.css';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | RechenHafen',
  description: 'Datenschutzerklärung von RechenHafen: Alle Berechnungen erfolgen 100 % lokal in Ihrem Webbrowser. Keine Speicherung persönlicher Finanz- oder Gesundheitsdaten.',
  alternates: {
    canonical: 'https://rechenhafen.de/datenschutz/',
  },
};

export default function DatenschutzPage() {
  return (
    <div className={styles.container}>
      <Breadcrumbs items={[{ label: 'Datenschutz', href: '/datenschutz/' }]} />

      <article style={{ maxWidth: '800px', margin: '0 auto var(--space-12)', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
          Datenschutzerklärung
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
          Informationen über die Verarbeitung personenbezogener Daten nach der DSGVO
        </p>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            1. Datenschutz auf einen Blick: 100 % lokale Berechnung (Client-Side)
          </h2>
          <p>
            Der Schutz Ihrer persönlichen Daten steht bei <strong>RechenHafen</strong> an erster Stelle. Aus diesem Grund ist unsere Plattform nach dem Prinzip <em>„Privacy by Design“</em> aufgebaut:
          </p>
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderLeft: '4px solid var(--color-primary)',
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-md)',
            margin: 'var(--space-4) 0'
          }}>
            <strong>Wichtiges Prinzip:</strong> Sämtliche Berechnungen – egal ob Gehalt, Kreditverbindlichkeiten, Miete oder Gesundheitsdaten (z. B. BMI, Körpergröße) – werden ausschließlich und zu 100 % auf Ihrem Endgerät in JavaScript ausgeführt. Ihre Zahlenwerte werden zu keinem Zeitpunkt an unsere Server übertragen, dort verarbeitet oder in Datenbanken gespeichert.
          </div>
        </section>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            2. Verantwortliche Stelle
          </h2>
          <p>
            Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO):<br />
            RechenHafen Digital<br />
            Musterstraße 42<br />
            20457 Hamburg<br />
            E-Mail: <a href="mailto:datenschutz@rechenhafen.de" style={{ color: 'var(--color-primary)' }}>datenschutz@rechenhafen.de</a>
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            3. Bereitstellung der Website & Server-Log-Dateien
          </h2>
          <p>
            Beim Aufrufen unserer Website werden durch das Hosting-Netzwerk (Vercel Inc.) technisch bedingt Server-Logfiles verarbeitet, die Ihr Browser automatisch an den Server übermittelt:
          </p>
          <ul>
            <li>Browsertyp und Browserversion</li>
            <li>Verwendetes Betriebssystem</li>
            <li>Referrer URL (zuvor besuchte Seite)</li>
            <li>Hostname des zugreifenden Rechners / IP-Adresse (anonymisiert)</li>
            <li>Uhrzeit der Serveranfrage</li>
          </ul>
          <p>
            Die Rechtsgrundlage für diese vorübergehende Speicherung ist Art. 6 Abs. 1 lit. f DSGVO zur Gewährleistung der Betriebssicherheit, DDoS-Abwehr und Auslieferung der statischen Seiten.
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            4. Keine Tracking-Cookies & keine Werbenetzwerke
          </h2>
          <p>
            RechenHafen setzt keine zustimmungspflichtigen Tracking-Cookies, Werbecookies oder invasive Nutzerprofile ein. Die Plattform kann vollständig ohne das Akzeptieren von Cookies genutzt werden. Zur Unterstützung des Hell-/Dunkelmodus (Dark Mode) kann lediglich der standardmäßige Browsermodus (`prefers-color-scheme`) abgefragt werden.
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            5. Ihre Rechte als betroffene Person
          </h2>
          <p>
            Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten (Art. 15 DSGVO), deren Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO) oder Einschränkung der Verarbeitung (Art. 18 DSGVO).
          </p>
          <p>
            Da wir jedoch keine Identifikatoren oder Nutzerdaten aus den Rechnern speichern, existieren in unseren Systemen in der Regel keine verknüpfbaren personenbezogenen Recheneingaben.
          </p>
        </section>
      </article>
    </div>
  );
}
