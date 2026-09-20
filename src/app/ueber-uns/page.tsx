import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/calculator/Breadcrumbs';
import styles from '@/styles/layout.module.css';
import { Anchor, ShieldCheck, Cpu, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Über uns | RechenHafen – Alle Rechner an einem Ort',
  description: 'Erfahren Sie mehr über RechenHafen: Unsere Mission für präzise, werbefreie und datenschutzfreundliche Online-Rechner für Deutschland.',
  alternates: {
    canonical: 'https://rechenhafen.de/ueber-uns/',
  },
};

export default function UeberUnsPage() {
  return (
    <div className={styles.container}>
      <Breadcrumbs items={[{ label: 'Über uns' }]} />

      <article style={{ maxWidth: '800px', margin: '0 auto var(--space-12)', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
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
          <p style={{ fontSize: '1.2rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '8px' }}>
            RechenHafen – Alle Rechner an einem Ort.
          </p>
        </div>

        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Unsere Mission: Sichere Orientierung im Zahlenmeer
          </h2>
          <p>
            Im Alltag, im Beruf und bei privaten Lebensentscheidungen begegnen uns unzählige Zahlen: Wie viel Netto bleibt vom Brutto? Wie hoch ist die reale Mietrendite meiner Immobilie? Wann amortisiert sich das Balkonkraftwerk? Welche Wandfarbenmenge muss ich für das Wohnzimmer kaufen?
          </p>
          <p>
            Oftmals sind bestehende Rechner im Internet mit unübersichtlicher Werbung überladen, veraltet oder erfordern die Eingabe privater Kontaktdaten. <strong>RechenHafen</strong> wurde geschaffen, um einen verlässlichen Hafen zu bieten: eine moderne, blitzschnelle Plattform mit hunderten spezialisierten Rechnern, die vollständig kostenfrei, transparent und ohne Datenspeicherung funktionieren.
          </p>
        </section>

        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-4)',
          margin: 'var(--space-8) 0'
        }}>
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
            <Cpu size={24} style={{ color: 'var(--color-primary)', marginBottom: '8px' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 4px' }}>Moderne Technologie</h3>
            <p style={{ fontSize: '0.85rem', margin: 0 }}>Gebaut mit Next.js und optimiert für moderne Endgeräte. 100 % lokale Berechnungen direkt im Browser ohne Wartezeit.</p>
          </div>
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
            <Award size={24} style={{ color: 'var(--color-primary)', marginBottom: '8px' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 4px' }}>Deutsche Standards</h3>
            <p style={{ fontSize: '0.85rem', margin: 0 }}>Formeln abgestimmt auf deutsche Gesetze, DIN-Normen und anerkannte wissenschaftliche Modelle.</p>
          </div>
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
            <ShieldCheck size={24} style={{ color: 'var(--color-primary)', marginBottom: '8px' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 4px' }}>Absolute Privatsphäre</h3>
            <p style={{ fontSize: '0.85rem', margin: 0 }}>Keine Speicherung Ihrer Eingaben. Was Sie rechnen, bleibt ausschließlich auf Ihrem Gerät.</p>
          </div>
        </section>

        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Transparenz & ständige Prüfung
          </h2>
          <p>
            Zu jedem Rechner stellen wir die zugrunde liegende mathematische Formel, eine verständliche Erklärung des Rechenwegs und ein konkretes Anwendungsbeispiel bereit. So können Sie jedes Resultat eigenständig nachvollziehen.
          </p>
          <p>
            Erfahren Sie mehr über unsere redaktionellen Prüfverfahren auf unserer Seite zur <Link href="/methodik/" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Berechnungsmethodik</Link>.
          </p>
        </section>
      </article>
    </div>
  );
}
