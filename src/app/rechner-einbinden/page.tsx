import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/calculator/Breadcrumbs';
import EmbedCodeBox from '@/components/embed/EmbedCodeBox';
import { getCalculatorBySlug } from '@/data/calculators';
import { EMBEDDABLE_CALCULATORS, buildEmbedSnippet } from '@/data/embed';
import styles from '@/styles/layout.module.css';

export const metadata: Metadata = {
  title: 'Rechner kostenlos auf Ihrer Website einbinden',
  description:
    'Binden Sie Rechner von RechenHafen kostenlos in Ihren Blog oder Ihre Website ein: Code kopieren, einfügen, fertig – ohne Werbung, ohne Cookies.',
  alternates: { canonical: 'https://rechenhafen.de/rechner-einbinden/' },
};

export default function RechnerEinbindenPage() {
  const items = EMBEDDABLE_CALCULATORS.map((e) => {
    const calc = getCalculatorBySlug(e.slug)!;
    const name = calc.shortName || calc.name;
    return { ...e, calc, name, code: buildEmbedSnippet(e.slug, name, e.height) };
  });

  return (
    <div className={styles.container}>
      <Breadcrumbs items={[{ label: 'Rechner einbinden', href: '/rechner-einbinden/' }]} />
      <article style={{ maxWidth: '820px', margin: '0 auto var(--space-12)', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
          Rechner kostenlos auf Ihrer Website einbinden
        </h1>
        <p>
          Sie schreiben über Hausbau, Backen oder Kochen? Dann können Sie Ihren Leserinnen und Lesern einen unserer Rechner direkt in
          Ihren Artikel einbauen. Kopieren Sie einfach den Code und fügen Sie ihn als HTML-Block ein – zum Beispiel in WordPress über
          den Block „Individuelles HTML“.
        </p>
        <ul>
          <li><strong>Kostenlos</strong> und ohne Anmeldung.</li>
          <li><strong>Ohne Werbung, ohne Cookies, ohne Tracking</strong> – der eingebettete Rechner lädt keine Analyse- oder Werbeskripte.</li>
          <li><strong>Passt sich an:</strong> Die Höhe wächst automatisch mit dem Ergebnis, auf dem Handy wie am Desktop.</li>
          <li>Wir bitten nur darum, den kleinen Quellenhinweis unter dem Rechner stehen zu lassen.</li>
        </ul>

        {items.map((item) => (
          <section key={item.slug} id={item.slug} style={{ margin: 'var(--space-10) 0', scrollMarginTop: '80px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)' }}>
              {item.name}
            </h2>
            <p style={{ margin: '0 0 var(--space-3)' }}>
              {item.calc.shortDescription} Passt zu: {item.audience}.{' '}
              <Link href={`/rechner/${item.slug}/`} style={{ color: 'var(--color-primary)' }}>Zur vollständigen Rechner-Seite</Link>
            </p>
            <EmbedCodeBox code={item.code} label={item.name} />
            <details style={{ marginTop: 'var(--space-3)' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--color-text-primary)' }}>Vorschau anzeigen</summary>
              <iframe
                src={`/embed/${item.slug}/`}
                title={`Vorschau: ${item.name}`}
                width="100%"
                height={item.height}
                loading="lazy"
                style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', marginTop: 'var(--space-3)', maxWidth: '760px' }}
              />
            </details>
          </section>
        ))}

        <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Fragen zur Einbindung</h2>
          <p><strong>Darf ich den Rechner auch kommerziell nutzen?</strong> Ja, auch auf Websites mit Werbung oder Affiliate-Links, solange der Quellenhinweis sichtbar bleibt.</p>
          <p><strong>Was passiert, wenn sich Werte ändern?</strong> Der Rechner wird zentral bei uns aktualisiert. Eingebettete Rechner sind dadurch automatisch auf dem neuesten Stand.</p>
          <p><strong>Funktioniert das ohne das Skript?</strong> Ja. Das kurze Skript passt nur die Höhe automatisch an. Ohne Skript nutzt der Rechner die feste Höhe aus dem Code.</p>
        </section>
      </article>
    </div>
  );
}
