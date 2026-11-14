/**
 * Content and facts for the homepage: update dates, FAQ and official sources.
 * Kept out of page.tsx so tests can check every claim against the real data.
 */
import { LEGAL_VALUES_2026 } from '@/legal/de';
import type { FAQItem } from '@/types/calculator';

/**
 * Date the calculators or their content last really changed (ISO, YYYY-MM-DD).
 * Bump it only when calculators, values or texts change — never just to look fresh.
 * Shown on the homepage, used as dateModified in its schema and as lastModified in the sitemap.
 */
export const SITE_LAST_UPDATED = '2026-11-14';

/** Most recent date on which the 2026 legal values (tax, social security) were checked. */
export const LEGAL_VALUES_CHECKED_AT: string = Object.values(LEGAL_VALUES_2026)
  .map((v) => (v && typeof v === 'object' && 'checkedAt' in v ? String(v.checkedAt) : ''))
  .filter(Boolean)
  .sort()
  .at(-1) as string;

const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

/** '2026-11-13' → '13. November 2026' */
export function formatGermanDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d}. ${MONTHS[m - 1]} ${y}`;
}

const euro = (n: number) => `${n.toLocaleString('de-DE')} €`;

/** Official sources the tax, social security and payroll calculators are built on. */
export const OFFICIAL_SOURCES = [
  {
    name: 'Gesetze im Internet (Bundesministerium der Justiz)',
    url: 'https://www.gesetze-im-internet.de/estg/__32a.html',
    usedFor: 'Einkommensteuertarif nach § 32a EStG, Sozialgesetzbücher und weitere Gesetzestexte',
  },
  {
    name: 'Deutsche Rentenversicherung',
    url: 'https://www.deutsche-rentenversicherung.de/',
    usedFor: 'Beitragssätze und Beitragsbemessungsgrenzen der Rentenversicherung',
  },
  {
    name: 'Minijob-Zentrale',
    url: 'https://www.minijob-zentrale.de/',
    usedFor: 'Abgaben und Grenzen für Minijobs',
  },
] as const;

export function getHomeFaqs(totalCalculators: number): FAQItem[] {
  return [
    {
      question: 'Sind die Rechner auf RechenHafen kostenlos?',
      answer: `Ja. Alle ${totalCalculators} Rechner sind kostenlos und ohne Registrierung nutzbar. Es gibt keine Paywall und kein Konto.`,
    },
    {
      question: 'Werden meine Eingaben gespeichert?',
      answer:
        'Nein. Die Berechnung läuft direkt in Ihrem Browser. Ihre Eingaben wie Gehalt, Gewicht oder Kreditbetrag werden nicht an uns übertragen und nicht gespeichert.',
    },
    {
      question: 'Mit welchen Werten rechnen die Steuer- und Gehaltsrechner?',
      answer: `Standardmäßig mit den gesetzlichen Werten für 2026, zum Beispiel einem Grundfreibetrag von ${euro(LEGAL_VALUES_2026.grundfreibetrag.value)} pro Jahr. Die Werte wurden zuletzt am ${formatGermanDate(LEGAL_VALUES_CHECKED_AT)} geprüft. Wo es sinnvoll ist, lässt sich auch das Jahr 2025 auswählen.`,
    },
    {
      question: 'Wie genau sind die Ergebnisse?',
      answer:
        'Die Rechner folgen den gesetzlichen Formeln. Die Ergebnisse sind trotzdem unverbindliche Orientierungswerte. Verbindlich sind nur Bescheide von Finanzamt, Krankenkasse oder Rentenversicherung. Wie wir rechnen, steht in der [Methodik](/methodik/).',
    },
    {
      question: 'Woher stammen die gesetzlichen Werte?',
      answer:
        'Aus amtlichen Primärquellen: den Gesetzestexten auf gesetze-im-internet.de sowie Angaben der Deutschen Rentenversicherung und der Minijob-Zentrale.',
    },
    {
      question: 'Kann ich einen Rechner auf meiner Website einbinden?',
      answer:
        'Ja, ausgewählte Rechner lassen sich kostenlos per iframe einbinden. Den Code finden Sie unter [Rechner einbinden](/rechner-einbinden/).',
    },
  ];
}
