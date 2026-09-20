/**
 * Comprehensive generator script for the 307 additional calculators.
 * Builds src/data/calculators/extraCalculators.ts with complete CalculatorDefinition items.
 */

import * as fs from 'fs';
import * as path from 'path';

// Helper to construct a CalculatorDefinition code block
export interface CalcDefBlueprint {
  id: string;
  name: string;
  shortName: string;
  category: string;
  subcategory: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  shortDescription: string;
  searchKeywords: string[];
  inputs: Array<{
    id: string;
    label: string;
    type: 'number' | 'text' | 'select' | 'boolean' | 'date';
    defaultValue: any;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    options?: Array<{ value: string; label: string }>;
  }>;
  formula: string;
  formulaExplanation: string;
  workedExample: {
    title: string;
    description: string;
    inputs: Record<string, any>;
    resultSummary: string;
  };
  intro: string;
  details: string;
  faqs: Array<{ question: string; answer: string }>;
  relatedSlugs: string[];
  calcFnCode: string;
}

// We will export all blueprints across the categories
export const BLUEPRINTS: CalcDefBlueprint[] = [
  // ==================== 1. DATUM & ZEIT (2 to reach 25) ====================
  {
    id: 'renteneintritt-rechner',
    name: 'Renteneintritt Rechner (Regelaltersgrenze 67)',
    shortName: 'Renteneintritt',
    category: 'datum-zeit',
    subcategory: 'Alter & Geburtstag',
    metaTitle: 'Renteneintritt Rechner – Wann kann ich in Rente gehen? (Rente mit 67)',
    metaDescription: 'Ermitteln Sie Ihren genauen Rentenbeginn und Regelaltersgrenze nach Geburtsjahrgang in Deutschland. Verbleibende Arbeitsjahre und Tage online berechnen.',
    h1: 'Renteneintritt Rechner – Regelaltersgrenze & Rentenbeginn',
    shortDescription: 'Berechnet das genaue Datum des Rentenbeginns nach Geburtsjahrgang gemäß deutscher Rentenversicherung (§ 35 SGB VI).',
    searchKeywords: ['renteneintritt rechner', 'wann kann ich in rente gehen', 'regelaltersgrenze berechnen', 'rente mit 67 rechner'],
    inputs: [
      { id: 'birthYear', label: 'Geburtsjahr', type: 'number', defaultValue: 1970, min: 1940, max: 2010, step: 1 },
      { id: 'birthMonth', label: 'Geburtsmonat (1 - 12)', type: 'number', defaultValue: 6, min: 1, max: 12, step: 1 },
    ],
    formula: 'Rentenalter = 65 bis 67 Jahre (ab Jahrgang 1964 gilt Regelaltersgrenze 67 Jahre)',
    formulaExplanation: 'Nach § 35 und § 235 SGB VI wird die Regelaltersgrenze für Jahrgänge bis 1963 schrittweise angehoben. Ab Geburtsjahrgang 1964 gilt das vollendete 67. Lebensjahr.',
    workedExample: {
      title: 'Beispiel: Geboren im Juni 1970',
      description: 'Regelaltersgrenze: 67 Jahre. Renteneintritt: 01.07.2037.',
      inputs: { birthYear: 1970, birthMonth: 6 },
      resultSummary: '01.07.2037 (Regelaltersgrenze: 67 Jahre)',
    },
    intro: 'Wann beginnt für Sie die gesetzliche Rente? Die schrittweise Anhebung des Renteneintrittsalters auf 67 Jahre betrifft alle Jahrgänge ab 1947.',
    details: 'Der offizielle Rentenbeginn ist in Deutschland der erste Tag des Monats, der auf den Geburtstag folgt, an dem das erforderliche Lebensalter vollendet wird.',
    faqs: [
      { question: 'Ab welchem Geburtsjahrgang gilt die Rente mit 67 voll?', answer: 'Für alle Personen, die im Jahr 1964 oder später geboren wurden, liegt die Regelaltersgrenze ausnahmslos bei 67 Jahren.' },
      { question: 'Kann man früher ohne Abschläge in Rente gehen?', answer: 'Eine Rente vor der Regelaltersgrenze ist für langjährig Versicherte (mindestens 35 Beitragsjahre) mit Abschlägen möglich oder als besonders langjährig Versicherte (45 Beitragsjahre) abschlagsfrei ab 65 Jahren.' },
    ],
    relatedSlugs: ['altersrechner', 'arbeitstage-rechner', 'lebenszeit-in-stunden'],
    calcFnCode: `(inputs) => {
      const birthYear = parseInt(inputs.birthYear, 10) || 1970;
      const birthMonth = parseInt(inputs.birthMonth, 10) || 6;
      let targetAgeYears = 67;
      let targetAgeMonths = 0;
      if (birthYear < 1947) {
        targetAgeYears = 65;
      } else if (birthYear <= 1958) {
        targetAgeYears = 65;
        targetAgeMonths = birthYear - 1946;
      } else if (birthYear <= 1963) {
        targetAgeYears = 66;
        targetAgeMonths = (birthYear - 1958) * 2;
      }
      const rentYear = birthYear + targetAgeYears + Math.floor((birthMonth + targetAgeMonths) / 12);
      const rentMonth = ((birthMonth + targetAgeMonths - 1) % 12) + 1;
      const rentStartDate = \`01.\${rentMonth < 10 ? '0' + rentMonth : rentMonth}.\${rentYear}\`;
      const currentYear = 2026;
      const yearsLeft = Math.max(0, rentYear - currentYear);
      return {
        primary: { id: 'rentDate', label: 'Voraussichtlicher Rentenbeginn', value: rentYear, formattedValue: rentStartDate, highlight: true },
        secondary: [
          { id: 'age', label: 'Ihre Regelaltersgrenze', value: targetAgeYears + targetAgeMonths / 12, formattedValue: \`\${targetAgeYears} Jahre \${targetAgeMonths > 0 ? targetAgeMonths + ' Monate' : ''}\` },
          { id: 'yearsLeft', label: 'Verbleibende Jahre bis zur Rente (ab 2026)', value: yearsLeft, formattedValue: \`ca. \${yearsLeft} Jahre\` },
        ],
        summaryText: \`Bei Geburtsjahrgang \${birthYear} erreichen Sie Ihre Regelaltersgrenze mit \${targetAgeYears} Jahren\${targetAgeMonths > 0 ? ' und ' + targetAgeMonths + ' Monaten' : ''}. Ihr regulärer Rentenbeginn ist der \${rentStartDate}.\`
      };
    }`,
  },
  {
    id: 'dienstjubilaeum-rechner',
    name: 'Dienstjubiläum Rechner',
    shortName: 'Dienstjubiläum',
    category: 'datum-zeit',
    subcategory: 'Arbeitstage & Werktage',
    metaTitle: 'Dienstjubiläum Rechner – 10, 25 & 40 Jahre Betriebszugehörigkeit',
    metaDescription: 'Berechnen Sie das genaue Datum für Ihr 10-, 25- oder 40-jähriges Firmenjubiläum nach Eintrittsdatum. Inklusive verbleibender Tage.',
    h1: 'Dienstjubiläum Rechner (Betriebszugehörigkeit)',
    shortDescription: 'Ermittelt das exakte Datum für 10, 25, 40 und 50 Jahre Betriebszugehörigkeit anhand des Eintrittsdatums.',
    searchKeywords: ['dienstjubilaeum rechner', 'betriebszugehoerigkeit berechnen', '25 jahre jubiläum datum', 'firmenjubilaeum rechner'],
    inputs: [
      { id: 'entryDate', label: 'Eintrittsdatum in das Unternehmen', type: 'date', defaultValue: '2016-01-01' },
    ],
    formula: 'Jubiläumsdatum = Eintrittsdatum + N Jahre Betriebszugehörigkeit',
    formulaExplanation: 'Nach deutschem Arbeits- und Tarifrecht (z. B. TVöD § 23) werden 25- und 40-jährige Dienstjubiläen ab dem offiziellen Tag des Diensteintritts vollendet.',
    workedExample: {
      title: 'Beispiel: Eintritt am 01.01.2016',
      description: '10 Jahre: 01.01.2026. 25 Jahre: 01.01.2041.',
      inputs: { entryDate: '2016-01-01' },
      resultSummary: '10 Jahre voll am 01.01.2026',
    },
    intro: 'Ein Dienstjubiläum markiert einen besonderen Meilenstein im Berufsleben. Im öffentlichen Dienst (TVöD) sowie vielen tariflichen Unternehmen ist es mit Jubiläumsgeld oder Sonderurlaub verknüpft.',
    details: 'Geben Sie Ihr Eintrittsdatum ein, um alle relevanten Jubiläumszeitpunkte (10, 25, 40 und 50 Jahre) auf einen Blick zu sehen.',
    faqs: [
      { question: 'Gibt es nach deutschem Recht einen gesetzlichen Anspruch auf Jubiläumsurlaub?', answer: 'Ein rein gesetzlicher Anspruch existiert nicht. Allerdings regeln viele Tarifverträge (z. B. TVöD) Sonderurlaub (meist 1 Tag) und Jubiläumszuwendungen bei 25 und 40 Dienstjahren.' },
    ],
    relatedSlugs: ['arbeitstage-rechner', 'altersrechner', 'werktage-rechner'],
    calcFnCode: `(inputs) => {
      const entry = new Date(inputs.entryDate || '2016-01-01');
      if (isNaN(entry.getTime())) {
        return { primary: { id: 'error', label: 'Fehler', value: 0, formattedValue: 'Ungültig' }, error: 'Bitte gültiges Datum eingeben' };
      }
      const y = entry.getFullYear();
      const m = entry.getMonth() + 1;
      const d = entry.getDate();
      const pad = (n: number) => n < 10 ? '0' + n : n;
      const j10 = \`\${pad(d)}.\${pad(m)}.\${y + 10}\`;
      const j25 = \`\${pad(d)}.\${pad(m)}.\${y + 25}\`;
      const j40 = \`\${pad(d)}.\${pad(m)}.\${y + 40}\`;
      return {
        primary: { id: 'j25', label: '25-jähriges Dienstjubiläum', value: y + 25, formattedValue: j25, highlight: true },
        secondary: [
          { id: 'j10', label: '10-jähriges Jubiläum', value: y + 10, formattedValue: j10 },
          { id: 'j40', label: '40-jähriges Jubiläum', value: y + 40, formattedValue: j40 },
          { id: 'j50', label: '50-jähriges Jubiläum', value: y + 50, formattedValue: \`\${pad(d)}.\${pad(m)}.\${y + 50}\` },
        ],
        summaryText: \`Bei einem Diensteintritt am \${pad(d)}.\${pad(m)}.\${y} vollenden Sie Ihr 10-jähriges Jubiläum am \${j10}, Ihr 25-jähriges Jubiläum am \${j25} und Ihr 40-jähriges Jubiläum am \${j40}.\`
      };
    }`,
  },
];
