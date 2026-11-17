import React from 'react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/calculator/Breadcrumbs';
import styles from '@/styles/layout.module.css';
import { SITE_OWNER } from '@/config/site-owner';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description:
    'Datenschutzerklärung von RechenHafen: Ihre Rechner-Eingaben bleiben in Ihrem Browser. Hinweise zu Hosting, Werbung mit Google AdSense und Google Analytics (nur mit Einwilligung).',
  alternates: {
    canonical: 'https://rechenhafen.de/datenschutz/',
  },
};

const h2Style: React.CSSProperties = { fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' };
const sectionStyle: React.CSSProperties = { marginBottom: 'var(--space-6)' };
const linkStyle: React.CSSProperties = { color: 'var(--color-primary)' };

export default function DatenschutzPage() {
  return (
    <div className={styles.container}>
      <Breadcrumbs items={[{ label: 'Datenschutz', href: '/datenschutz/' }]} />

      <article style={{ maxWidth: '800px', margin: '0 auto var(--space-12)', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
          Datenschutzerklärung
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
          Informationen über die Verarbeitung personenbezogener Daten nach der DSGVO und dem TDDDG
        </p>

        <section style={sectionStyle}>
          <h2 style={h2Style}>1. Auf einen Blick</h2>
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderLeft: '4px solid var(--color-primary)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-md)',
              margin: 'var(--space-4) 0',
            }}
          >
            <strong>Ihre Eingaben bleiben bei Ihnen.</strong> Alle Berechnungen laufen in Ihrem Browser. Was Sie in einen
            Rechner eingeben (z. B. Gehalt, Kreditbetrag, Körpergröße oder Gewicht) und das Ergebnis werden weder an uns
            noch an Google oder andere Dritte übertragen und nirgends gespeichert.
          </div>
          <p>Daneben werden beim Besuch dieser Website folgende Daten verarbeitet:</p>
          <ul>
            <li>
              <strong>Hosting:</strong> Beim Abruf jeder Seite verarbeitet unser Hoster technisch notwendige Verbindungsdaten
              (Abschnitt 3).
            </li>
            <li>
              <strong>Werbung:</strong> Wir finanzieren die Website über Google AdSense. Google setzt dafür Cookies und
              verarbeitet Daten wie IP-Adresse und Geräteinformationen (Abschnitt 5).
            </li>
            <li>
              <strong>Reichweitenmessung:</strong> Google Analytics nutzen wir nur, wenn Sie zustimmen (Abschnitt 6).
            </li>
            <li>
              <strong>Lokale Speicherung:</strong> Favoriten, zuletzt genutzte Rechner und Ihre Cookie-Entscheidung werden
              nur in Ihrem Browser gespeichert (Abschnitt 4).
            </li>
          </ul>
          <p>Alle Rechner können Sie vollständig nutzen, auch wenn Sie alle Einwilligungen ablehnen.</p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>2. Verantwortliche Stelle</h2>
          <p>
            Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist der Betreiber der Website rechenhafen.de.
            {SITE_OWNER.impressum.name && (<><br />{SITE_OWNER.impressum.name}</>)}
            {SITE_OWNER.impressum.street && (<><br />{SITE_OWNER.impressum.street}</>)}
            {SITE_OWNER.impressum.city && (<><br />{SITE_OWNER.impressum.city}</>)}
            {SITE_OWNER.contactEmail && (
              <><br />E-Mail: <a href={`mailto:${SITE_OWNER.contactEmail}`} style={linkStyle}>{SITE_OWNER.contactEmail}</a></>
            )}
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>3. Hosting und Server-Logdateien</h2>
          <p>
            Die Website wird bei Vercel Inc. (USA) gehostet. Beim Aufruf einer Seite übermittelt Ihr Browser automatisch
            Daten, die der Hoster technisch bedingt verarbeitet:
          </p>
          <ul>
            <li>IP-Adresse</li>
            <li>Browsertyp und Browserversion, verwendetes Betriebssystem</li>
            <li>aufgerufene Seite und Referrer-URL (zuvor besuchte Seite)</li>
            <li>Datum und Uhrzeit der Anfrage</li>
          </ul>
          <p>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der sicheren und
            störungsfreien Auslieferung der Website, etwa zur Abwehr von Angriffen. Dabei können Daten in die USA übermittelt
            werden. Ihre Rechner-Eingaben sind in diesen Daten nicht enthalten.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>4. Speicherung in Ihrem Browser</h2>
          <p>Folgende Angaben speichert die Website im lokalen Speicher (localStorage) Ihres Browsers:</p>
          <ul>
            <li>Ihre Favoriten (Liste der markierten Rechner)</li>
            <li>zuletzt genutzte Rechner (Name des Rechners und Zeitpunkt, keine Eingaben oder Ergebnisse)</li>
            <li>Ihre Entscheidung zur Reichweitenmessung</li>
          </ul>
          <p>
            Diese Angaben verlassen Ihr Gerät nicht. Sie dienen nur den von Ihnen genutzten Funktionen und sind daher nach
            § 25 Abs. 2 Nr. 2 TDDDG ohne Einwilligung zulässig. Sie können sie jederzeit löschen, indem Sie die Websitedaten
            in Ihrem Browser entfernen oder im Menü „Gemerkt“ auf „Verlauf leeren“ klicken.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>5. Werbung mit Google AdSense</h2>
          <p>
            Wir binden Werbeanzeigen von Google AdSense ein. Anbieter ist die Google Ireland Limited, Gordon House, Barrow
            Street, Dublin 4, Irland. Damit finanzieren wir das kostenlose Angebot.
          </p>
          <p>
            Google und seine Partner setzen dafür Cookies und ähnliche Technologien ein und lesen sie aus. Dabei werden unter
            anderem Ihre IP-Adresse, Geräte- und Browserinformationen, die aufgerufene Seite sowie Interaktionen mit Anzeigen
            verarbeitet, um Anzeigen auszuliefern, ihre Wirkung zu messen und Betrug zu verhindern. Mit Ihrer Einwilligung
            können Anzeigen auch auf Ihre Interessen zugeschnitten werden (personalisierte Werbung). Ebenfalls nur mit Ihrer
            Einwilligung dürfen Google und seine Partner laut Einwilligungsfenster auch genaue Standortdaten verwenden.
          </p>
          <p>
            Ihre Einwilligung holen wir über das Einwilligungsfenster von Google ein, das beim ersten Besuch erscheint
            (Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Sie ist freiwillig und kann jederzeit über den
            Link zu den Datenschutzeinstellungen auf der Seite widerrufen werden. Lehnen Sie ab, können weiterhin
            nicht personalisierte Anzeigen erscheinen; Google verwendet dann nach eigenen Angaben keine Cookies für
            personalisierte Werbung. Ihre Auswahl speichert Google höchstens 390 Tage lang in einem Cookie namens
            „FCCDCF“, damit das Fenster nicht bei jedem Besuch erneut erscheint.
          </p>
          <p>
            Google kann Daten auch an Server der Google LLC in den USA übermitteln. Google LLC ist nach dem EU-US Data Privacy
            Framework zertifiziert. Weitere Informationen:{' '}
            <a href="https://policies.google.com/technologies/partner-sites?hl=de" style={linkStyle} target="_blank" rel="noopener noreferrer">
              Wie Google Daten von Websites und Apps von Partnern verwendet
            </a>
            . Ihre Werbeeinstellungen bei Google verwalten Sie unter{' '}
            <a href="https://myadcenter.google.com/" style={linkStyle} target="_blank" rel="noopener noreferrer">
              Mein Anzeigencenter
            </a>
            .
          </p>
          <p>Ihre Rechner-Eingaben und Ergebnisse werden nicht an Google übermittelt.</p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>6. Reichweitenmessung mit Google Analytics 4 (nur mit Einwilligung)</h2>
          <p>
            Wenn Sie im Hinweisfenster „Datenschutz & Reichweitenmessung“ zustimmen, nutzen wir Google Analytics 4 (Anbieter:
            Google Ireland Limited, Adresse siehe oben), um zu verstehen, welche Rechner genutzt werden. Ohne Ihre Zustimmung
            wird Google Analytics nicht geladen.
          </p>
          <p>
            Übermittelt werden Seitenaufrufe und Nutzungsereignisse wie „Rechner geöffnet“ oder „Ergebnis berechnet“ mit dem
            Namen des Rechners, nie Ihre Eingaben oder Ergebnisse. Die IP-Adresse wird gekürzt; Google Signals und die Nutzung
            der Daten für Werbung sind deaktiviert. Google Analytics setzt Cookies, mit denen wiederkehrende Besuche erkannt
            werden.
          </p>
          <p>
            Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Sie können sie jederzeit
            über den Link „Cookie-Einstellungen“ im Seitenfuß widerrufen. Zur Übermittlung in die USA gilt das in Abschnitt 5
            Gesagte.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>7. Ihre Rechte</h2>
          <p>
            Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der
            Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch gegen Verarbeitungen auf Grundlage
            berechtigter Interessen (Art. 21). Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft
            widerrufen (Art. 7 Abs. 3). Außerdem können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren
            (Art. 77 DSGVO).
          </p>
          <p>
            Da wir Ihre Rechner-Eingaben nicht erhalten und keine Nutzerkonten führen, liegen bei uns in der Regel keine Daten
            vor, die wir Ihrer Person zuordnen können. Zu Daten, die Google als eigener bzw. gemeinsam Verantwortlicher
            verarbeitet, können Sie sich auch direkt an Google wenden.
          </p>
        </section>
      </article>
    </div>
  );
}
