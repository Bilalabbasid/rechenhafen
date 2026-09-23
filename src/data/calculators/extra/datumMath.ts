import { CalculatorDefinition } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';

export const EXTRA_DATUM_MATH: CalculatorDefinition[] = [
  // ==================== DATUM & ZEIT (2) ====================
  {
    id: 'renteneintritt-rechner',
    slug: 'renteneintritt-rechner',
    name: 'Renteneintritt-Rechner (Regelaltersgrenze 67)',
    shortName: 'Renteneintritt',
    category: 'datum-zeit',
    subcategory: 'Alter & Geburtstag',
    metaTitle: 'Renteneintritt Rechner – Wann kann ich in Rente gehen?',
    metaDescription: 'Ermitteln Sie Ihren genauen Rentenbeginn und Regelaltersgrenze nach Geburtsjahrgang in Deutschland. Verbleibende Arbeitsjahre und Tage online berechnen.',
    h1: 'Renteneintritt Rechner – Regelaltersgrenze & Rentenbeginn',
    shortDescription: 'Berechnet das genaue Datum des Rentenbeginns nach Geburtsjahrgang gemäß deutscher Rentenversicherung (§ 35 SGB VI).',
    searchKeywords: ['renteneintritt rechner', 'wann kann ich in rente gehen', 'regelaltersgrenze berechnen', 'rente mit 67 rechner'],
    inputs: [
      { id: 'birthYear', label: 'Geburtsjahr', type: 'number', defaultValue: 1970, min: 1940, max: 2010, step: 1 },
      { id: 'birthMonth', label: 'Geburtsmonat (1 - 12)', type: 'number', defaultValue: 6, min: 1, max: 12, step: 1 },
    ],
    calculate: (inputs) => {
      const birthYear = parseInt(inputs.birthYear, 10) || 1970;
      const birthMonth = parseInt(inputs.birthMonth, 10) || 6;
      let targetAgeYears = 67;
      let targetAgeMonths = 0;
      if (birthYear < 1947) targetAgeYears = 65;
      else if (birthYear <= 1958) { targetAgeYears = 65; targetAgeMonths = birthYear - 1946; }
      else if (birthYear <= 1963) { targetAgeYears = 66; targetAgeMonths = (birthYear - 1958) * 2; }
      const rentYear = birthYear + targetAgeYears + Math.floor((birthMonth + targetAgeMonths) / 12);
      const rentMonth = ((birthMonth + targetAgeMonths - 1) % 12) + 1;
      const rentStartDate = `01.${rentMonth < 10 ? '0' + rentMonth : rentMonth}.${rentYear}`;
      const yearsLeft = Math.max(0, rentYear - 2026);
      return {
        primary: { id: 'rentDate', label: 'Voraussichtlicher Rentenbeginn', value: rentYear, formattedValue: rentStartDate, highlight: true },
        secondary: [
          { id: 'age', label: 'Ihre Regelaltersgrenze', value: targetAgeYears + targetAgeMonths / 12, formattedValue: `${targetAgeYears} Jahre ${targetAgeMonths > 0 ? targetAgeMonths + ' Monate' : ''}` },
          { id: 'yearsLeft', label: 'Verbleibende Jahre bis zur Rente (ab 2026)', value: yearsLeft, formattedValue: `ca. ${yearsLeft} Jahre` },
        ],
        summaryText: `Bei Geburtsjahrgang ${birthYear} erreichen Sie Ihre Regelaltersgrenze mit ${targetAgeYears} Jahren${targetAgeMonths > 0 ? ' und ' + targetAgeMonths + ' Monaten' : ''}. Ihr regulärer Rentenbeginn ist der ${rentStartDate}.`,
      };
    },
    formula: 'Rentenalter = 65 bis 67 Jahre (ab Jahrgang 1964 gilt Regelaltersgrenze 67 Jahre)',
    formulaExplanation: 'Nach § 35 und § 235 SGB VI wird die Regelaltersgrenze für Jahrgänge bis 1963 schrittweise angehoben. Ab Geburtsjahrgang 1964 gilt das vollendete 67. Lebensjahr.',
    workedExample: {
      title: 'Beispiel: Geboren im Juni 1970',
      description: 'Regelaltersgrenze: 67 Jahre. Renteneintritt: 01.07.2037.',
      inputs: { birthYear: 1970, birthMonth: 6 },
      resultSummary: '01.07.2037 (Regelaltersgrenze: 67 Jahre)',
    },
    content: {
      intro: 'Die Feststellung des regulären Renteneintrittsalters nach dem Sechsten Buch Sozialgesetzbuch (SGB VI) richtet sich präzise nach dem Geburtsjahrgang des Versicherten.',
      details: 'Nach § 35 und § 235 SGB VI wird die Regelaltersgrenze für Versicherte der Geburtsjahrgänge 1947 bis 1963 schrittweise von 65 auf 67 Jahre angehoben. Für alle ab dem 1. Januar 1964 Geborenen gilt ausnahmslos das vollendete 67. Lebensjahr.',
    },
    faqs: [
      { question: 'Wann kann man abschlagsfrei vor der Regelaltersgrenze in Rente gehen?', answer: 'Als besonders langjährig Versicherter mit mindestens 45 Beitragsjahren kann man bis zu zwei Jahre vor der Regelaltersgrenze ohne Rentenabschläge in den Ruhestand treten.' },
      { question: 'Wie hoch ist der Rentenabschlag bei vorzeitigem Rentenbeginn?', answer: 'Der Abschlag beträgt 0,3 Prozent für jeden Monat, den die Rente vor Erreichen der persönlichen Regelaltersgrenze in Anspruch genommen wird (max. 14,4 % bei 4 Jahren früher).' },
    ],
    relatedSlugs: ['rentenluecke-rechner', 'altersrechner', 'arbeitstage-rechner', 'lebenszeit-in-stunden', 'betriebliche-altersvorsorge-rechner'],
  },
  {
    id: 'dienstjubilaeum-rechner',
    slug: 'dienstjubilaeum-rechner',
    name: 'Dienstjubiläum-Rechner (Betriebszugehörigkeit)',
    shortName: 'Dienstjubiläum',
    category: 'datum-zeit',
    subcategory: 'Arbeitstage & Werktage',
    metaTitle: 'Dienstjubiläum Rechner – 10, 25 – RechenHafen',
    metaDescription: 'Berechnen Sie das genaue Datum für Ihr 10-, 25- oder 40-jähriges Firmenjubiläum nach Eintrittsdatum. Inklusive verbleibender Tage.',
    h1: 'Dienstjubiläum Rechner (Betriebszugehörigkeit)',
    shortDescription: 'Ermittelt das exakte Datum für 10, 25, 40 und 50 Jahre Betriebszugehörigkeit anhand des Eintrittsdatums.',
    searchKeywords: ['dienstjubilaeum rechner', 'betriebszugehoerigkeit berechnen', '25 jahre jubiläum datum', 'firmenjubilaeum rechner'],
    inputs: [
      { id: 'entryDate', label: 'Eintrittsdatum in das Unternehmen', type: 'date', defaultValue: '2016-01-01' },
    ],
    calculate: (inputs) => {
      const entry = new Date(inputs.entryDate || '2016-01-01');
      if (isNaN(entry.getTime())) {
        return { primary: { id: 'error', label: 'Fehler', value: 0, formattedValue: 'Ungültig' }, error: 'Bitte gültiges Datum eingeben' };
      }
      const y = entry.getFullYear();
      const m = entry.getMonth() + 1;
      const d = entry.getDate();
      const pad = (n: number) => (n < 10 ? '0' + n : n);
      const j10 = `${pad(d)}.${pad(m)}.${y + 10}`;
      const j25 = `${pad(d)}.${pad(m)}.${y + 25}`;
      const j40 = `${pad(d)}.${pad(m)}.${y + 40}`;
      return {
        primary: { id: 'j25', label: '25-jähriges Dienstjubiläum', value: y + 25, formattedValue: j25, highlight: true },
        secondary: [
          { id: 'j10', label: '10-jähriges Jubiläum', value: y + 10, formattedValue: j10 },
          { id: 'j40', label: '40-jähriges Jubiläum', value: y + 40, formattedValue: j40 },
          { id: 'j50', label: '50-jähriges Jubiläum', value: y + 50, formattedValue: `${pad(d)}.${pad(m)}.${y + 50}` },
        ],
        summaryText: `Bei einem Diensteintritt am ${pad(d)}.${pad(m)}.${y} vollenden Sie Ihr 10-jähriges Jubiläum am ${j10}, Ihr 25-jähriges Jubiläum am ${j25} und Ihr 40-jähriges Jubiläum am ${j40}.`,
      };
    },
    formula: 'Jubiläumsdatum = Eintrittsdatum + N Jahre Betriebszugehörigkeit',
    formulaExplanation: 'Nach deutschem Arbeits- und Tarifrecht (z. B. TVöD § 23) werden 25- und 40-jährige Dienstjubiläen ab dem offiziellen Tag des Diensteintritts vollendet.',
    workedExample: {
      title: 'Beispiel: Eintritt am 01.01.2016',
      description: '10 Jahre: 01.01.2026. 25 Jahre: 01.01.2041.',
      inputs: { entryDate: '2016-01-01' },
      resultSummary: '10 Jahre voll am 01.01.2026',
    },
    content: {
      intro: 'Dieser Jubiläumsrechner ermittelt die exakten Stichtage für 10-, 25-, 40- und 50-jährige Dienst- und Firmenjubiläen im Arbeitsverhältnis.',
      details: 'Nach deutschem Tarifrecht (z. B. TVöD § 23) wird die Dienstzeit ab dem offiziellen Tag des Diensteintritts berechnet. Unterbrechungen (wie Elternzeit oder Sonderurlaub) können je nach Tarifvertrag ausgenommen sein.',
    },
    faqs: [
      { question: 'Welche Jubiläumszuwendungen sind im öffentlichen Dienst tariflich vorgesehen?', answer: 'Nach dem TVöD erhalten Beschäftigte bei Vollendung einer 25-jährigen Dienstzeit ein Jubiläumsgeld von 350 Euro, bei 40 Jahren 500 Euro sowie einen freien Tag.' },
      { question: 'Zählt die Ausbildungszeit zur Dienstzeit für das Jubiläum?', answer: 'Im öffentlichen Dienst zählt die Ausbildung beim selben Dienstherrn voll zur Dienstzeit; in der Privatwirtschaft hängt dies von der jeweiligen Betriebsvereinbarung ab.' },
    ],
    relatedSlugs: ['arbeitstage-rechner', 'altersrechner', 'werktage-rechner', 'dienstjubilaeum-steuerfrei-rechner'],
  },

  // ==================== MATHEMATIK (13) ====================
  {
    id: 'prozentualer-unterschied-rechner',
    slug: 'prozentualer-unterschied-rechner',
    name: 'Prozentualer Unterschied-Rechner',
    shortName: 'Prozentualer Unterschied',
    category: 'mathematik',
    subcategory: 'Prozentrechnung',
    metaTitle: 'Prozentualer Unterschied Rechner – Relative Differenz zweie...',
    metaDescription: 'Berechnen Sie den prozentualen Unterschied und die relative Abweichung zwischen zwei beliebigen Zahlen schnell & online.',
    h1: 'Prozentualer Unterschied Rechner',
    shortDescription: 'Ermittelt den relativen Unterschied zwischen zwei Zahlen bezogen auf ihren Mittelwert oder Ausgangswert.',
    searchKeywords: ['prozentualer unterschied rechner', 'relative abweichung berechnen', 'differenz in prozent', 'unterschied prozent berechnen'],
    inputs: [
      { id: 'valA', label: 'Erster Wert (A)', type: 'number', defaultValue: 80, step: 1 },
      { id: 'valB', label: 'Zweiter Wert (B)', type: 'number', defaultValue: 100, step: 1 },
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.valA) || 0;
      const b = parseFloat(inputs.valB) || 0;
      const diff = Math.abs(a - b);
      const avg = (a + b) / 2;
      if (avg === 0) return { primary: { id: 'diff', label: 'Unterschied', value: 0, formattedValue: '0 %' }, error: 'Beide Werte dürfen nicht gleichzeitig null sein.' };
      const pctDiff = (diff / Math.abs(avg)) * 100;
      const pctFromA = a !== 0 ? ((b - a) / Math.abs(a)) * 100 : 0;
      return {
        primary: { id: 'pctDiff', label: 'Symmetrischer Unterschied', value: pctDiff, formattedValue: formatPercent(pctDiff, 2), highlight: true },
        secondary: [
          { id: 'absDiff', label: 'Absolute Differenz', value: diff, formattedValue: formatNumber(diff, 2) },
          { id: 'fromA', label: 'Veränderung von A zu B', value: pctFromA, formattedValue: `${pctFromA >= 0 ? '+' : ''}${formatPercent(pctFromA, 2)}` },
        ],
        summaryText: `Zwischen ${formatNumber(a)} und ${formatNumber(b)} besteht ein symmetrischer Unterschied von ${formatPercent(pctDiff, 2)}.`,
      };
    },
    formula: 'Unterschied (%) = (|A - B| / ((A + B) / 2)) × 100',
    formulaExplanation: 'Die relative Differenz bezogen auf den Mittelwert beider Werte ist unabhängig von der Reihenfolge symmetrisch.',
    workedExample: {
      title: 'Beispiel: Wert A = 80, Wert B = 100',
      description: 'Differenz: 20. Mittelwert: 90. Prozentualer Unterschied: 22,22 %.',
      inputs: { valA: 80, valB: 100 },
      resultSummary: '22,22 % Unterschied',
    },
    content: {
      intro: 'Der prozentuale Unterschied vergleicht zwei gleichrangige Größen symmetrisch miteinander, ohne dass eine der beiden a priori als Basis definiert ist.',
      details: 'Die relative Differenz wird durch den Mittelwert beider Zahlen geteilt: |A - B| / ((A + B) / 2) · 100. Dadurch bleibt das prozentuale Ergebnis identisch, egal welche Zahl zuerst genannt wird.',
    },
    faqs: [
      { question: 'Was unterscheidet den prozentualen Unterschied von der prozentualen Veränderung?', answer: 'Die Veränderung bezieht sich strikt auf den alten Ausgangswert (Richtung zählt). Der Unterschied ist richtungsneutral und teilt durch den Mittelwert beider Zahlen.' },
      { question: 'Wann verwendet man die symmetrische Differenz?', answer: 'In Laborvergleichen, Messreihen zweier unabhängiger Sensoren oder beim Preisvergleich zweier Konkurrenzprodukte.' },
    ],
    relatedSlugs: ['prozentrechner', 'prozentuale-veraenderung', 'dreisatzrechner'],
  },
  {
    id: 'prozent-von-prozent-rechner',
    slug: 'prozent-von-prozent-rechner',
    name: 'Prozent von Prozent-Rechner',
    shortName: 'Prozent von Prozent',
    category: 'mathematik',
    subcategory: 'Prozentrechnung',
    metaTitle: 'Prozent von Prozent Rechner – Teilprozentsatz online berechnen',
    metaDescription: 'Wie viel sind 20 % von 50 %? Berechnen Sie Prozent von Prozent und zusammengesetzte Prozentsätze einfach online.',
    h1: 'Prozent von Prozent Rechner',
    shortDescription: 'Multipliziert zwei Prozentsätze zur Ermittlung des resultierenden Gesamtwertes (z. B. 20 % von 30 %).',
    searchKeywords: ['prozent von prozent rechner', 'prozentsatz von prozent berechnen', 'anteil von prozent', 'kaskadierte prozente'],
    inputs: [
      { id: 'pct1', label: 'Erster Prozentsatz (z. B. 20 %)', type: 'number', defaultValue: 20, step: 0.5, unit: '%' },
      { id: 'pct2', label: 'Zweiter Prozentsatz (z. B. 50 %)', type: 'number', defaultValue: 50, step: 0.5, unit: '%' },
      { id: 'baseAmount', label: 'Optionaler Bezugswert (Basisbetrag)', type: 'number', defaultValue: 1000, step: 10, unit: '€' },
    ],
    calculate: (inputs) => {
      const p1 = parseFloat(inputs.pct1) || 0;
      const p2 = parseFloat(inputs.pct2) || 0;
      const base = parseFloat(inputs.baseAmount) || 0;
      const combinedPct = (p1 * p2) / 100;
      const amount = (combinedPct / 100) * base;
      return {
        primary: { id: 'combinedPct', label: 'Resultierender Gesamtprozentsatz', value: combinedPct, formattedValue: formatPercent(combinedPct, 2), highlight: true },
        secondary: [
          { id: 'amount', label: `Betrag von ${formatNumber(base)}`, value: amount, formattedValue: formatNumber(amount, 2) },
          { id: 'factor', label: 'Dezimalfaktor', value: combinedPct / 100, formattedValue: formatNumber(combinedPct / 100, 4) },
        ],
        summaryText: `${formatPercent(p1)} von ${formatPercent(p2)} ergeben genau ${formatPercent(combinedPct, 2)}.`,
      };
    },
    formula: 'Resultierender Prozentsatz = (P1 × P2) / 100',
    formulaExplanation: 'Werden zwei Prozentanteile nacheinander angewandt, werden die Dezimalfaktoren multipliziert.',
    workedExample: {
      title: 'Beispiel: 20 % von 50 % eines 1.000 € Budgets',
      description: '0,20 × 0,50 = 0,10 (10 %). Bezogen auf 1.000 € ergibt dies 100 €.',
      inputs: { pct1: 20, pct2: 50, baseAmount: 1000 },
      resultSummary: '10,00 % (100,00 €)',
    },
    content: {
      intro: 'Die Berechnung von Kaskadenprozenten ermittelt den tatsächlichen Gesamtabschlag bei aufeinanderfolgenden Rabatten oder kumulierten Margen.',
      details: 'Weil Folgeprozente auf den bereits reduzierten Zwischenwert angewendet werden, dürfen sie nicht addiert werden: 20 % Rabatt plus 10 % Extrarabatt ergeben nicht 30 %, sondern 1 - (0,80 · 0,90) = 28 % Gesamtrabatt.',
    },
    faqs: [
      { question: 'Warum ergeben 10 % Skonto und 10 % Händlerrabatt nicht 20 %?', answer: 'Weil das Skonto nur vom bereits um 10 % verminderten Nettobetrag abgezogen wird (0,90 × 0,90 = 0,81, also 19 % Gesamtersparnis).' },
      { question: 'Wie lautet die mathematische Formel für Kaskadenprozente?', answer: 'Gesamtfaktor = (1 - p1/100) · (1 - p2/100). Der Gesamtrabatt beträgt (1 - Gesamtfaktor) · 100.' },
    ],
    relatedSlugs: ['prozentrechner', 'prozentuale-veraenderung', 'promillerechner'],
  },
  {
    id: 'promillerechner',
    slug: 'promillerechner',
    name: 'Promillerechner (‰ in % und Betrag)',
    shortName: 'Promillerechner',
    category: 'mathematik',
    subcategory: 'Prozentrechnung',
    metaTitle: 'Promillerechner – Promille in Prozent und Betrag online umr...',
    metaDescription: 'Rechnen Sie Promille (Tausendstel) präzise in Prozent, Dezimalzahlen und absolute Beträge um. Schnelle Online-Berechnung.',
    h1: 'Promillerechner (Tausendstel-Rechnung)',
    shortDescription: 'Wandelt Promillewerte (‰) in Prozent und konkrete Zahlenbeträge um mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['promillerechner', 'promille in prozent', 'promille berechnen formel', 'tausendstel rechner'],
    inputs: [
      { id: 'promille', label: 'Promillewert (‰)', type: 'number', defaultValue: 5, min: 0, step: 0.1, unit: '‰' },
      { id: 'baseVal', label: 'Grundwert', type: 'number', defaultValue: 10000, step: 100 },
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.promille) || 0;
      const base = parseFloat(inputs.baseVal) || 0;
      const part = (p / 1000) * base;
      const inPct = p / 10;
      return {
        primary: { id: 'part', label: 'Berechneter Promillebetrag', value: part, formattedValue: formatNumber(part, 2), highlight: true },
        secondary: [
          { id: 'inPct', label: 'Entspricht in Prozent', value: inPct, formattedValue: formatPercent(inPct, 2) },
          { id: 'decimal', label: 'Dezimalfaktor', value: p / 1000, formattedValue: formatNumber(p / 1000, 5) },
        ],
        summaryText: `${formatNumber(p, 1)} ‰ von ${formatNumber(base)} entsprechen einem Betrag von ${formatNumber(part, 2)}.`,
      };
    },
    formula: 'Promillewert = (Promillesatz / 1.000) × Grundwert | 1 ‰ = 0,1 %',
    formulaExplanation: 'Promille steht für pro Tausend (lat. pro mille). 10 Promille entsprechen 1 Prozent.',
    workedExample: {
      title: 'Beispiel: 5 ‰ von 10.000 €',
      description: '(5 / 1.000) × 10.000 = 50 € (entspricht 0,5 %).',
      inputs: { promille: 5, baseVal: 10000 },
      resultSummary: '50,00 (0,50 %)',
    },
    content: {
      intro: 'Promille (‰) bezeichnet Teile pro Tausend (1 ‰ = 0,1 % = 0,001) und wird vor allem in der Rechtsmedizin (Blutalkohol), bei Steigungen und Versicherungsprämien verwendet.',
      details: 'Formel: Promillewert = Grundwert · (Promillesatz / 1000). Bei der Blutalkoholkonzentration (BAK nach Widmark) teilt man die aufgenommene reine Alkoholmasse in Gramm durch das reduzierte Körpergewicht.',
    },
    faqs: [
      { question: 'Wie viel Gramm reiner Alkohol sind in einem halben Liter Bier (5 Vol.-%) enthalten?', answer: '500 ml Bier enthalten 25 ml Alkohol. Bei einer Dichte von 0,8 g/ml entspricht dies 20 Gramm reinem Alkohol.' },
      { question: 'Welche Promillegrenzen gelten im deutschen Straßenverkehr?', answer: '0,0 ‰ für Fahranfänger in der Probezeit und unter 21 Jahren (§ 24c StVG); 0,5 ‰ als Ordnungswidrigkeit (§ 24a StVG); ab 1,1 ‰ liegt absolute Fahruntüchtigkeit (§ 316 StGB) vor.' },
    ],
    relatedSlugs: ['prozentrechner', 'prozent-von-prozent-rechner', 'dreisatzrechner'],
  },
  {
    id: 'antiproportionaler-dreisatz-rechner',
    slug: 'antiproportionaler-dreisatz-rechner',
    name: 'Antiproportionaler Dreisatz-Rechner',
    shortName: 'Umgekehrter Dreisatz',
    category: 'mathematik',
    subcategory: 'Dreisatz & Verhältnisse',
    metaTitle: 'Antiproportionaler Dreisatz Rechner – Umgekehrt proportional',
    metaDescription: 'Lösen Sie umgekehrte Dreisatzaufgaben online: Je mehr, desto weniger (z. B. Arbeiter und Arbeitstage, Pumpen und Befüllung).',
    h1: 'Antiproportionaler Dreisatz (Je mehr, desto weniger)',
    shortDescription: 'Berechnet umgekehrt proportionale Zuordnungen, bei denen das Produkt zweier Größen konstant bleibt.',
    searchKeywords: ['antiproportionaler dreisatz rechner', 'umgekehrter dreisatz online', 'je mehr desto weniger rechner', 'dreisatz produktgleich'],
    inputs: [
      { id: 'a1', label: 'Ausgangsgröße 1 (z. B. 4 Arbeiter)', type: 'number', defaultValue: 4, min: 0.1, step: 1 },
      { id: 'b1', label: 'Zugehörige Größe 1 (z. B. 6 Tage)', type: 'number', defaultValue: 6, min: 0.1, step: 0.5 },
      { id: 'a2', label: 'Neue Ausgangsgröße 2 (z. B. 8 Arbeiter)', type: 'number', defaultValue: 8, min: 0.1, step: 1 },
    ],
    calculate: (inputs) => {
      const a1 = parseFloat(inputs.a1) || 1;
      const b1 = parseFloat(inputs.b1) || 1;
      const a2 = parseFloat(inputs.a2) || 1;
      if (a2 <= 0) return { primary: { id: 'res', label: 'Ergebnis', value: 0, formattedValue: '0' }, error: 'Neue Größe muss größer als 0 sein.' };
      const product = a1 * b1;
      const b2 = product / a2;
      return {
        primary: { id: 'res', label: 'Gesuchtes Ergebnis', value: b2, formattedValue: formatNumber(b2, 2), highlight: true },
        secondary: [
          { id: 'product', label: 'Konstantes Gesamtprodukt (A1 × B1)', value: product, formattedValue: formatNumber(product, 2) },
          { id: 'ratio', label: 'Verhältnis der Ausgangsgrößen', value: a2 / a1, formattedValue: `${formatNumber(a2 / a1, 2)} ×` },
        ],
        summaryText: `Wenn ${formatNumber(a1)} Einheiten zu ${formatNumber(b1)} führen, ergeben ${formatNumber(a2)} Einheiten genau ${formatNumber(b2, 2)}.`,
      };
    },
    formula: 'B2 = (A1 × B1) / A2',
    formulaExplanation: 'Bei antiproportionalen Verhältnissen ist das Produkt A1 × B1 konstant (Produktgleichheit).',
    workedExample: {
      title: 'Beispiel: 4 Arbeiter brauchen 6 Tage. Wie lange brauchen 8 Arbeiter?',
      description: '(4 × 6) / 8 = 3 Tage.',
      inputs: { a1: 4, b1: 6, a2: 8 },
      resultSummary: '3,00 (Halbe Zeit bei doppelter Besetzung)',
    },
    content: {
      intro: 'Der antiproportionale (umgekehrte) Dreisatz modelliert Prozesse, bei denen eine Erhöhung der Ursache zu einer proportionalen Verringerung der Wirkung führt.',
      details: 'Die Multiplikation beider Ausgangsgrößen bildet ein konstantes Produkt (Gesamtleistung = Arbeiter · Zeit). Die gesuchte Zeit lautet X = (Arbeiter1 · Zeit1) / Arbeiter2.',
    },
    faqs: [
      { question: 'Was ist ein typisches Beispiel für antiproportionale Zuordnungen?', answer: 'Pumpen, die ein Becken leeren: 2 Pumpen brauchen 6 Stunden (Produkt = 12). 3 Pumpen schaffen es in 12 / 3 = 4 Stunden.' },
      { question: 'Wann versagt das mathematische Modell in der Praxis?', answer: 'Wenn physikalische Grenzen erreicht werden (z. B. behindern sich zu viele Arbeiter auf engem Raum gegenseitig, Gesetz des abnehmenden Ertrags).' },
    ],
    relatedSlugs: ['dreisatzrechner', 'prozentrechner', 'bruchrechner'],
  },
  {
    id: 'bruch-in-dezimal-rechner',
    slug: 'bruch-in-dezimal-rechner',
    name: 'Bruch in Dezimalzahl-Rechner',
    shortName: 'Bruch in Dezimal',
    category: 'mathematik',
    subcategory: 'Bruchrechnung',
    metaTitle: 'Bruch in Dezimalzahl Rechner – Brüche in Kommazahlen umwandeln',
    metaDescription: 'Wandeln Sie Brüche (Zähler / Nenner) in Dezimalzahlen (Kommazahlen) und Prozentwerte online um. Mit periodischer Kennzeichnung.',
    h1: 'Bruch in Dezimalzahl Rechner',
    shortDescription: 'Konvertiert echte und unechte Brüche sowie gemischte Zahlen in Dezimalbrüche.',
    searchKeywords: ['bruch in dezimal rechner', 'bruch in kommazahl umrechnen', 'zaehler nenner in komma', 'bruch dezimalzahl tabelle'],
    inputs: [
      { id: 'numerator', label: 'Zähler', type: 'number', defaultValue: 3, step: 1 },
      { id: 'denominator', label: 'Nenner', type: 'number', defaultValue: 4, min: 1, step: 1 },
      { id: 'wholeNumber', label: 'Ganze Zahl (für gemischte Brüche)', type: 'number', defaultValue: 0, step: 1 },
    ],
    calculate: (inputs) => {
      const num = parseFloat(inputs.numerator) || 0;
      const den = parseFloat(inputs.denominator) || 1;
      const whole = parseFloat(inputs.wholeNumber) || 0;
      if (den === 0) return { primary: { id: 'res', label: 'Dezimalwert', value: 0, formattedValue: '0' }, error: 'Der Nenner darf nicht 0 sein.' };
      const decimal = whole + (num / den);
      return {
        primary: { id: 'decimal', label: 'Dezimalzahl (Kommazahl)', value: decimal, formattedValue: formatNumber(decimal, 4), highlight: true },
        secondary: [
          { id: 'pct', label: 'Als Prozentsatz', value: decimal * 100, formattedValue: formatPercent(decimal * 100, 2) },
          { id: 'fraction', label: 'Bruchdarstellung', value: decimal, formattedValue: `${whole !== 0 ? whole + ' ' : ''}${num}/${den}` },
        ],
        summaryText: `Der Bruch ${whole !== 0 ? whole + ' ' : ''}${num}/${den} entspricht der Dezimalzahl ${formatNumber(decimal, 4)}.`,
      };
    },
    formula: 'Dezimalwert = Ganze Zahl + (Zähler / Nenner)',
    formulaExplanation: 'Der Bruchstrich entspricht dem mathematischen Divisionszeichen: Zähler geteilt durch Nenner.',
    workedExample: {
      title: 'Beispiel: 3/4',
      description: '3 geteilt durch 4 = 0,75 (75 %).',
      inputs: { numerator: 3, denominator: 4, wholeNumber: 0 },
      resultSummary: '0,75 (75 %)',
    },
    content: {
      intro: 'Die Umwandlung eines Bruchs in eine Dezimalzahl erfolgt durch schriftliche Division des Zählers durch den Nenner.',
      details: 'Ist im vollständig gekürzten Nenner nur die Primfaktoren 2 und 5 enthalten, entsteht eine endliche Dezimalzahl (z. B. 3/8 = 0,375). Treten andere Primfaktoren auf (3, 7, etc.), entsteht eine unendliche periodische Dezimalzahl (1/3 = 0,333...).',
    },
    faqs: [
      { question: 'Wie erkennt man vorab, ob ein Bruch eine endliche Dezimalzahl ergibt?', answer: 'Kürzen Sie den Bruch vollständig. Wenn die Primfaktorzerlegung des Nenners ausschließlich aus Zweien und Fünfen besteht, bricht die Dezimalzahl sicher ab.' },
      { question: 'Wie wandelt man 7/8 im Kopf in eine Dezimalzahl um?', answer: 'Erweitern Sie mit 125 auf Tausendstel: 7 × 125 = 875; 8 × 125 = 1000. 875 / 1000 = 0,875.' },
    ],
    relatedSlugs: ['dezimal-in-bruch-rechner', 'bruchrechner', 'prozentrechner'],
  },
  {
    id: 'dezimal-in-bruch-rechner',
    slug: 'dezimal-in-bruch-rechner',
    name: 'Dezimalzahl in Bruch-Rechner',
    shortName: 'Dezimal in Bruch',
    category: 'mathematik',
    subcategory: 'Bruchrechnung',
    metaTitle: 'Dezimalzahl in Bruch Rechner – Kommazahlen in gekürzte Brüc...',
    metaDescription: 'Wandeln Sie Kommazahlen in exakte Brüche mit Zähler und Nenner um. Automatisches Kürzen auf den kleinsten gemeinsamen Nenner.',
    h1: 'Dezimalzahl in Bruch Rechner (mit Kürzen)',
    shortDescription: 'Wandelt Dezimalzahlen in vollständig gekürzte Brüche und gemischte Zahlen um.',
    searchKeywords: ['dezimal in bruch rechner', 'kommazahl in bruch umrechnen', 'dezimalzahl als bruch', 'kommazahl kuerzen bruch'],
    inputs: [
      { id: 'decimalVal', label: 'Dezimalzahl (z. B. 0,75 oder 1,25)', type: 'number', defaultValue: 0.75, step: 0.01 },
    ],
    calculate: (inputs) => {
      const dec = parseFloat(inputs.decimalVal) || 0;
      const sign = dec < 0 ? -1 : 1;
      const absDec = Math.abs(dec);
      const str = absDec.toString();
      const parts = str.split('.');
      let num = 0;
      let den = 1;
      if (parts.length > 1) {
        const decimals = parts[1].length;
        den = Math.pow(10, decimals);
        num = Math.round(absDec * den);
      } else {
        num = Math.round(absDec);
        den = 1;
      }
      function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }
      const g = gcd(num, den);
      const simpNum = (num / g) * sign;
      const simpDen = den / g;
      const whole = Math.floor(Math.abs(simpNum) / simpDen) * sign;
      const remNum = Math.abs(simpNum) % simpDen;
      return {
        primary: { id: 'fraction', label: 'Gekürzter Bruch', value: dec, formattedValue: `${simpNum} / ${simpDen}`, highlight: true },
        secondary: [
          { id: 'mixed', label: 'Gemischte Zahl', value: dec, formattedValue: remNum > 0 && Math.abs(whole) > 0 ? `${whole} ${remNum}/${simpDen}` : `${simpNum}/${simpDen}` },
          { id: 'gcd', label: 'Größter gemeinsamer Teiler (ggT)', value: g, formattedValue: formatNumber(g, 0) },
        ],
        summaryText: `Die Dezimalzahl ${formatNumber(dec, 4)} entspricht dem gekürzten Bruch ${simpNum} / ${simpDen}.`,
      };
    },
    formula: 'Bruch = Zähler / Nenner (gekürzt durch den ggT)',
    formulaExplanation: 'Eine Dezimalzahl mit N Nachkommastellen wird als Bruch mit Nenner 10^N geschrieben und gekürzt.',
    workedExample: {
      title: 'Beispiel: 0,75',
      description: '0,75 = 75/100. Gekürzt mit 25 ergibt 3/4.',
      inputs: { decimalVal: 0.75 },
      resultSummary: '3/4 (vollständig gekürzt)',
    },
    content: {
      intro: 'Dieser Rechner transformiert endliche oder periodische Kommazahlen in exakte, vollständig gekürzte Brüche.',
      details: 'Bei endlichen Dezimalzahlen wird die Zahl mit 10 pro Nachkommastelle erweitert (z. B. 0,75 = 75/100 = 3/4). Bei rein periodischen Zahlen wird der Periodenblock durch Neunen geteilt (0,333... = 3/9 = 1/3).',
    },
    faqs: [
      { question: 'Wie wandelt man 0,125 in einen Bruch um?', answer: '0,125 hat drei Nachkommastellen, also 125/1000. Geteilt durch den ggT 125 ergibt das exakt 1/8.' },
      { question: 'Warum entspricht die Periode 0,999... exakt der ganzen Zahl 1?', answer: 'Weil 1/3 = 0,333... ist. Multipliziert man beide Seiten mit 3, folgt 3 × (1/3) = 1 und 3 × 0,333... = 0,999...; daher ist 0,999... = 1.' },
    ],
    relatedSlugs: ['bruch-in-dezimal-rechner', 'bruchrechner', 'ggt-rechner'],
  },
  {
    id: 'kubikwurzel-rechner',
    slug: 'kubikwurzel-rechner',
    name: 'Kubikwurzel-Rechner (3. Wurzel)',
    shortName: 'Kubikwurzel',
    category: 'mathematik',
    subcategory: 'Zahlen & Algebra',
    metaTitle: 'Kubikwurzel Rechner – Dritte Wurzel (³√x) online berechnen',
    metaDescription: 'Berechnen Sie die Kubikwurzel (3. Wurzel) beliebiger positiver und negativer Zahlen schnell und präzise online.',
    h1: 'Kubikwurzel Rechner (3. Wurzel ³√)',
    shortDescription: 'Ermittelt die Zahl, die dreimal mit sich selbst multipliziert den Ausgangswert ergibt.',
    searchKeywords: ['kubikwurzel rechner', 'dritte wurzel berechnen', '3 wurzel rechner online', 'kubikwurzel ziehen'],
    inputs: [
      { id: 'val', label: 'Radikand (Zahl unter der Wurzel)', type: 'number', defaultValue: 27, step: 1 },
    ],
    calculate: (inputs) => {
      const x = parseFloat(inputs.val) || 0;
      const res = Math.cbrt(x);
      return {
        primary: { id: 'cbrt', label: `³√${formatNumber(x)}`, value: res, formattedValue: formatNumber(res, 4), highlight: true },
        secondary: [
          { id: 'check', label: `Probe: (${formatNumber(res, 2)})³`, value: Math.pow(res, 3), formattedValue: formatNumber(Math.pow(res, 3), 2) },
          { id: 'cubeVolume', label: 'Kantenlänge bei diesem Würfelvolumen', value: res > 0 ? res : 0, formattedValue: res > 0 ? `${formatNumber(res, 2)} cm` : 'Kein positives Volumen' },
        ],
        summaryText: `Die Kubikwurzel aus ${formatNumber(x)} ist exakt ${formatNumber(res, 4)}.`,
      };
    },
    formula: 'y = ³√x  ⇔  y³ = x',
    formulaExplanation: 'Die Kubikwurzel einer Zahl x ist diejenige Zahl y, deren dritte Potenz gleich x ist.',
    workedExample: {
      title: 'Beispiel: Kubikwurzel aus 27',
      description: '3 × 3 × 3 = 27. ³√27 = 3.',
      inputs: { val: 27 },
      resultSummary: '3,00',
    },
    content: {
      intro: 'Die Kubikwurzel (dritte Wurzel) ermittelt die Kantenlänge eines Würfels aus dessen bekanntem Rauminhalt.',
      details: 'Die Kubikwurzel aus V ist diejenige Zahl a, für die a³ = a · a · a = V gilt. Im Gegensatz zur Quadratwurzel ist die Kubikwurzel im Reellen auch für negative Zahlen eindeutig definiert (z. B. dritte Wurzel aus -8 ist -2).',
    },
    faqs: [
      { question: 'Welche Kantenlänge hat ein Würfel mit 1.000 Litern (1 m³) Volumen?', answer: 'Die Kubikwurzel aus 1 ist 1 Meter (bzw. dritte Wurzel aus 1.000 Litern = 10 Dezimeter = 100 cm).' },
      { question: 'Wie berechnet man Kubikwurzeln auf Taschenrechnern ohne Spezialtaste?', answer: 'Nutzen Sie die Potenzfunktion: Die dritte Wurzel aus x entspricht x hoch (1/3) bzw. x^(0,333333).' },
    ],
    relatedSlugs: ['quadratwurzel-rechner', 'n-te-wurzel-rechner', 'zehnerpotenzen-rechner', 'zehnerpotenzen-rechner'],
  },
  {
    id: 'n-te-wurzel-rechner',
    slug: 'n-te-wurzel-rechner',
    name: 'n-te Wurzel-Rechner',
    shortName: 'n-te Wurzel',
    category: 'mathematik',
    subcategory: 'Zahlen & Algebra',
    metaTitle: 'n-te Wurzel Rechner – Beliebige Wurzeln (ⁿ√x) online berechnen',
    metaDescription: 'Berechnen Sie die 4., 5. oder beliebige n-te Wurzel einer Zahl. Präzise Gleitkomma-Berechnung mit Formel & Erklärung.',
    h1: 'n-te Wurzel Rechner (Beliebiger Wurzelexponent)',
    shortDescription: 'Zieht eine Wurzel mit beliebigem ganzzahligem oder gebrochenem Wurzelexponenten n.',
    searchKeywords: ['n-te wurzel rechner', 'beliebige wurzel berechnen', '4 wurzel rechner', 'nte wurzel ziehen formel'],
    inputs: [
      { id: 'radicand', label: 'Radikand (Basis x)', type: 'number', defaultValue: 16, min: 0, step: 1 },
      { id: 'n', label: 'Wurzelexponent (n)', type: 'number', defaultValue: 4, min: 1, step: 1 },
    ],
    calculate: (inputs) => {
      const x = parseFloat(inputs.radicand) || 0;
      const n = parseFloat(inputs.n) || 1;
      if (n === 0) return { primary: { id: 'res', label: 'Ergebnis', value: 0, formattedValue: '0' }, error: 'Der Wurzelexponent darf nicht 0 sein.' };
      if (x < 0 && n % 2 === 0) return { primary: { id: 'res', label: 'Ergebnis', value: 0, formattedValue: 'Nicht definiert' }, error: 'Aus negativen Zahlen kann keine gerade Wurzel gezogen werden.' };
      const res = Math.pow(x, 1 / n);
      return {
        primary: { id: 'res', label: `${formatNumber(n, 0)}-te Wurzel`, value: res, formattedValue: formatNumber(res, 4), highlight: true },
        secondary: [
          { id: 'exp', label: 'Potenzschreibweise', value: 1 / n, formattedValue: `${formatNumber(x)}^${formatNumber(1 / n, 4)}` },
          { id: 'check', label: `Probe: (${formatNumber(res, 2)})^${n}`, value: Math.pow(res, n), formattedValue: formatNumber(Math.pow(res, n), 2) },
        ],
        summaryText: `Die ${formatNumber(n, 0)}-te Wurzel aus ${formatNumber(x)} beträgt ${formatNumber(res, 4)}.`,
      };
    },
    formula: 'y = ⁿ√x = x^(1/n)',
    formulaExplanation: 'Das Ziehen der n-ten Wurzel entspricht dem Potenzieren mit dem Kehrwert des Wurzelexponenten (1/n).',
    workedExample: {
      title: 'Beispiel: 4. Wurzel aus 16',
      description: '16^(1/4) = 2, da 2 × 2 × 2 × 2 = 16.',
      inputs: { radicand: 16, n: 4 },
      resultSummary: '2,00',
    },
    content: {
      intro: 'Die n-te Wurzel verallgemeinert das Wurzelziehen auf beliebige positive ganzzahlige Wurzelexponenten n.',
      details: 'Mathematisch gilt: Die n-te Wurzel aus a ist identisch mit der Potenz a^(1/n). Dies ist fundamental für Zinseszinsberechnungen (Ermittlung des durchschnittlichen geometrischen Wachstums p.a. über n Jahre).',
    },
    faqs: [
      { question: 'Wie berechnet man die jährliche Rendite über 10 Jahre bei Verdopplung des Kapitals?', answer: 'Man zieht die 10. Wurzel aus dem Wachstumsfaktor 2: 2^(1/10) ≈ 1,0718. Das entspricht einer jährlichen Durchschnittsrendite von ca. 7,18 %.' },
      { question: 'Was ist der Unterschied zwischen arithmetischem und geometrischem Mittel?', answer: 'Das geometrische Mittel nutzt das Produkt der Werte unter der n-ten Wurzel und ist das einzig korrekte Maß für Wachstumsraten und Anlagezinsen über Zeit.' },
    ],
    relatedSlugs: ['quadratwurzel-rechner', 'kubikwurzel-rechner', 'zehnerpotenzen-rechner'],
  },
  {
    id: 'zehnerpotenzen-rechner',
    slug: 'zehnerpotenzen-rechner',
    name: 'Zehnerpotenzen-Rechner (Wissenschaftliche Notation)',
    shortName: 'Zehnerpotenzen',
    category: 'mathematik',
    subcategory: 'Zahlen & Algebra',
    metaTitle: 'Zehnerpotenzen Rechner – Wissenschaftliche Notation (10^x)',
    metaDescription: 'Zehnerpotenzen berechnen und Zahlen in wissenschaftliche Notation (z. B. 1,5 × 10⁶) umwandeln. Mit SI-Präfixen wie Kilo, Mega, Giga.',
    h1: 'Zehnerpotenzen & Wissenschaftliche Notation',
    shortDescription: 'Wandelt große und kleine Zahlen in Zehnerpotenzen (10^x) und SI-Vorsätze (Mega, Nano etc.) um.',
    searchKeywords: ['zehnerpotenzen rechner', 'wissenschaftliche notation umrechnen', '10 hoch rechner', 'si praefixe rechner'],
    inputs: [
      { id: 'numberVal', label: 'Zahl zur Umwandlung', type: 'number', defaultValue: 2500000, step: 1000 },
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.numberVal) || 0;
      if (val === 0) return { primary: { id: 'sci', label: 'Notation', value: 0, formattedValue: '0 × 10⁰', highlight: true }, summaryText: 'Die Zahl Null ist 0 × 10⁰.' };
      const exp = Math.floor(Math.log10(Math.abs(val)));
      const mantissa = val / Math.pow(10, exp);
      return {
        primary: { id: 'sci', label: 'Wissenschaftliche Notation', value: val, formattedValue: `${formatNumber(mantissa, 3)} × 10^${exp}`, highlight: true },
        secondary: [
          { id: 'mantissa', label: 'Mantisse', value: mantissa, formattedValue: formatNumber(mantissa, 4) },
          { id: 'exponent', label: 'Zehnerexponent', value: exp, formattedValue: exp.toString() },
        ],
        summaryText: `${formatNumber(val)} wird als ${formatNumber(mantissa, 3)} × 10^${exp} geschrieben.`,
      };
    },
    formula: 'Zahl = a × 10^b  (wobei 1 ≤ |a| < 10 und b ganzzahlig)',
    formulaExplanation: 'In der wissenschaftlichen Schreibweise steht vor dem Komma genau eine von Null verschiedene Ziffer.',
    workedExample: {
      title: 'Beispiel: 2.500.000',
      description: '2.500.000 = 2,5 × 10⁶ (2,5 Mega).',
      inputs: { numberVal: 2500000 },
      resultSummary: '2,5 × 10⁶',
    },
    content: {
      intro: 'Zehnerpotenzen drücken sehr große (Astronomische) oder sehr kleine (Mikrokosmos) Zahlen in kompakter wissenschaftlicher Schreibweise (Scientific Notation) aus.',
      details: 'Positive Exponenten verschieben das Komma nach rechts (10³ = 1.000 Kilo, 10⁶ = 1.000.000 Mega, 10⁹ = Milliarde/Giga). Negative Exponenten verschieben es nach links (10⁻³ = Milli, 10⁻⁶ = Mikro, 10⁻⁹ = Nano).',
    },
    faqs: [
      { question: 'Was bedeutet die Schreibweise 3,5e+06 auf dem Taschenrechner?', answer: 'Das "e+06" steht für "mal 10 hoch 6", also 3,5 × 1.000.000 = 3.500.000.' },
      { question: 'Wie multipliziert man Zahlen in wissenschaftlicher Notation?', answer: 'Multiplizieren Sie die Vorkommazahlen und addieren Sie die Exponenten: (2 · 10⁴) · (3 · 10⁵) = 6 · 10⁹.' },
    ],
    relatedSlugs: ['n-te-wurzel-rechner', 'prozentrechner', 'prozentuale-veraenderung'],
  },
  {
    id: 'modulo-rechner',
    slug: 'modulo-rechner',
    name: 'Modulo-Rechner (Rest bei ganzzahliger Division)',
    shortName: 'Modulo berechnen',
    category: 'mathematik',
    subcategory: 'Zahlen & Algebra',
    metaTitle: 'Modulo Rechner – Restwert (a mod b) online berechnen',
    metaDescription: 'Berechnen Sie den Divisionsrest a mod b für beliebige Zahlen. Ideal für Informatik, Kryptographie und Kalenderarithmetik.',
    h1: 'Modulo Rechner (Divisionsrest a mod b)',
    shortDescription: 'Ermittelt den mathematischen Rest bei der ganzzahligen Division zweier Zahlen.',
    searchKeywords: ['modulo rechner', 'rest berechnen division', 'a mod b rechner', 'divisionsrest formel'],
    inputs: [
      { id: 'dividend', label: 'Dividend (Zahl a)', type: 'number', defaultValue: 29, step: 1 },
      { id: 'divisor', label: 'Divisor / Modul (Zahl b)', type: 'number', defaultValue: 7, min: 1, step: 1 },
    ],
    calculate: (inputs) => {
      const a = parseInt(inputs.dividend, 10) || 0;
      const b = parseInt(inputs.divisor, 10) || 1;
      if (b === 0) return { primary: { id: 'rem', label: 'Rest', value: 0, formattedValue: '0' }, error: 'Division durch Null ist nicht definiert.' };
      const rem = ((a % b) + b) % b;
      const q = Math.floor(a / b);
      return {
        primary: { id: 'rem', label: `${a} mod ${b} (Rest)`, value: rem, formattedValue: rem.toString(), highlight: true },
        secondary: [
          { id: 'quotient', label: 'Ganzzahliger Quotient', value: q, formattedValue: q.toString() },
          { id: 'decomp', label: 'Zerlegungsgleichung', value: rem, formattedValue: `${a} = ${q} × ${b} + ${rem}` },
        ],
        summaryText: `${a} geteilt durch ${b} ergibt ${q} mit Rest ${rem}.`,
      };
    },
    formula: 'a = q × b + r  wobei 0 ≤ r < b  (r = a mod b)',
    formulaExplanation: 'Modulo gibt den Rest r an, der verbleibt, wenn man a ganzzahlig durch b teilt.',
    workedExample: {
      title: 'Beispiel: 29 mod 7',
      description: '29 / 7 = 4 Rest 1, da 4 × 7 = 28 und 29 - 28 = 1.',
      inputs: { dividend: 29, divisor: 7 },
      resultSummary: '1 (Rest 1)',
    },
    content: {
      intro: 'Die Modulo-Operation ermittelt den ganzzahligen Rest, der bei der Division zweier natürlicher Zahlen verbleibt.',
      details: 'Mathematisch gilt für a mod b: a = q · b + r mit 0 ≤ r < b. Modulo-Rechnungen steuern die Wochentagsberechnung (mod 7), 24-Stunden-Uhren (mod 24), Kryptographie (RSA) und Prüfziffernverfahren (IBAN mod 97).',
    },
    faqs: [
      { question: 'Was ergibt 29 mod 7 und warum?', answer: '29 geteilt durch 7 ergibt 4 mit Rest 1 (da 4 × 7 = 28 und 29 - 28 = 1). Das Ergebnis ist 1.' },
      { question: 'Wie wird Modulo bei der IBAN-Prüfung verwendet?', answer: 'Die 2-stellige Prüfziffer einer IBAN wird so berechnet, dass die gesamte umgewandelte Ziffernfolge modulo 97 exakt den Rest 1 ergibt.' },
    ],
    relatedSlugs: ['quersumme-rechner', 'binaer-hex-dezimal-umrechner', 'ggt-rechner', 'hexadezimal-rechner'],
  },
  {
    id: 'quersumme-rechner',
    slug: 'quersumme-rechner',
    name: 'Quersumme-Rechner (Iterierte Ziffernsumme)',
    shortName: 'Quersumme',
    category: 'mathematik',
    subcategory: 'Zahlen & Algebra',
    metaTitle: 'Quersumme Rechner – Quersumme & iterierte Quersumme',
    metaDescription: 'Berechnen Sie die Quersumme, Quersummen-Wurzel und alternierende Quersumme beliebiger ganzer Zahlen. Für Teilbarkeitsregeln 3 & 9.',
    h1: 'Quersumme Rechner (Ziffernsumme)',
    shortDescription: 'Addiert alle Ziffern einer Zahl und ermittelt die einstellige Quersummenwurzel.',
    searchKeywords: ['quersumme rechner', 'quersumme berechnen formel', 'iterierte quersumme', 'teilbarkeitsregel 3 und 9'],
    inputs: [
      { id: 'num', label: 'Ganze Zahl', type: 'text', defaultValue: '9475' },
    ],
    calculate: (inputs) => {
      const cleanStr = (inputs.num || '9475').toString().replace(/[^0-9]/g, '');
      if (!cleanStr) return { primary: { id: 'sum', label: 'Quersumme', value: 0, formattedValue: '0' }, error: 'Bitte Ziffern eingeben.' };
      let sum = 0;
      for (let i = 0; i < cleanStr.length; i++) sum += parseInt(cleanStr[i], 10);
      let iter = sum;
      while (iter >= 10) {
        let s = 0;
        const sStr = iter.toString();
        for (let i = 0; i < sStr.length; i++) s += parseInt(sStr[i], 10);
        iter = s;
      }
      return {
        primary: { id: 'sum', label: 'Quersumme', value: sum, formattedValue: sum.toString(), highlight: true },
        secondary: [
          { id: 'iter', label: 'Einstellige Quersummenwurzel', value: iter, formattedValue: iter.toString() },
          { id: 'div3', label: 'Teilbar durch 3?', value: sum % 3 === 0 ? 1 : 0, formattedValue: sum % 3 === 0 ? 'Ja' : 'Nein' },
        ],
        summaryText: `Die Quersumme von ${cleanStr} beträgt ${sum}.`,
      };
    },
    formula: 'Quersumme = Summe aller einzelnen Ziffern der Zahl',
    formulaExplanation: 'Für die Zahl 9475 ist die Quersumme 9 + 4 + 7 + 5 = 25. Die iterierte Quersumme ist 2 + 5 = 7.',
    workedExample: {
      title: 'Beispiel: Zahl 9475',
      description: '9 + 4 + 7 + 5 = 25. Iteriert: 2 + 5 = 7.',
      inputs: { num: '9475' },
      resultSummary: '25 (iteriert: 7)',
    },
    content: {
      intro: 'Die Quersumme addiert alle einzelnen Ziffern einer Dezimalzahl und liefert mathematische Kriterien für Teilbarkeitsregeln.',
      details: 'Eine Zahl ist genau dann ohne Rest durch 3 teilbar, wenn ihre Quersumme durch 3 teilbar ist. Sie ist durch 9 teilbar, wenn ihre Quersumme durch 9 teilbar ist. Die iterierte Quersumme führt zur einstelligen Quersumme (Neunerrest).',
    },
    faqs: [
      { question: 'Was ist die alternierende Quersumme?', answer: 'Dabei werden die Ziffern von rechts nach links abwechselnd subtrahiert und addiert. Ist das Ergebnis durch 11 teilbar, ist auch die Gesamtzahl durch 11 teilbar.' },
      { question: 'Wie lautet die Quersumme von 48.719?', answer: '4 + 8 + 7 + 1 + 9 = 29. Die einstellige Quersumme (iterierte Quersumme) lautet 2 + 9 = 11 -> 1 + 1 = 2.' },
    ],
    relatedSlugs: ['modulo-rechner', 'teiler-vielfache-rechner', 'kombinatorik-n-ueber-k-rechner'],
  },
  {
    id: 'hexadezimal-rechner',
    slug: 'hexadezimal-rechner',
    name: 'Hexadezimal-Rechner (Hex in Dezimal & Binär)',
    shortName: 'Hexadezimal-Rechner',
    category: 'mathematik',
    subcategory: 'Zahlen & Algebra',
    metaTitle: 'Hexadezimal Rechner – Hexadezimal in Dezimal & Binär umrechnen',
    metaDescription: 'Konvertieren Sie Hexadezimalzahlen (Basis 16) in Dezimalzahlen und Binärcode (Basis 2). Mit Ziffern 0-9 und A-F.',
    h1: 'Hexadezimal Rechner (Basis 16 Umrechnung)',
    shortDescription: 'Wandelt Hex-Werte in Dezimal-, Binär- und Oktalzahlen um mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['hexadezimal rechner', 'hex in dezimal umrechnen', 'hexadezimal binaer', 'basis 16 umrechner'],
    inputs: [
      { id: 'hexVal', label: 'Hexadezimalwert (z. B. FF oder 1A3)', type: 'text', defaultValue: 'FF' },
    ],
    calculate: (inputs) => {
      const hexStr = (inputs.hexVal || 'FF').toString().trim().toUpperCase().replace(/^0X/, '');
      if (!/^[0-9A-F]+$/.test(hexStr)) return { primary: { id: 'dec', label: 'Dezimalwert', value: 0, formattedValue: '0' }, error: 'Ungültige Hexadezimalzahl (0-9, A-F).' };
      const dec = parseInt(hexStr, 16);
      return {
        primary: { id: 'dec', label: 'Dezimalzahl (Basis 10)', value: dec, formattedValue: formatNumber(dec, 0), highlight: true },
        secondary: [
          { id: 'bin', label: 'Binärzahl (Basis 2)', value: dec, formattedValue: dec.toString(2) },
          { id: 'oct', label: 'Oktalzahl (Basis 8)', value: dec, formattedValue: dec.toString(8) },
        ],
        summaryText: `Hex ${hexStr} entspricht im Dezimalsystem ${formatNumber(dec, 0)} und binär ${dec.toString(2)}.`,
      };
    },
    formula: 'Wert = d₀ × 16⁰ + d₁ × 16¹ + d₂ × 16² + ...',
    formulaExplanation: 'Das Hexadezimalsystem nutzt 16 Ziffern: 0 bis 9 und A (10) bis F (15).',
    workedExample: {
      title: 'Beispiel: Hex FF',
      description: '15 × 16¹ + 15 × 16⁰ = 240 + 15 = 255. Binär: 11111111.',
      inputs: { hexVal: 'FF' },
      resultSummary: 'Dezimal 255 | Binär 11111111',
    },
    content: {
      intro: 'Das Hexadezimalsystem (Basis 16) nutzt die Ziffern 0–9 sowie die Buchstaben A–F (für die Dezimalwerte 10–15) zur platzsparenden Darstellung von Binärdaten.',
      details: 'Genau zwei Hexadezimalziffern bilden ein Byte (8 Bit) von 00 bis FF (0 bis 255). Dies ist der weltweite Standard für Web-Farbcodes (#FFFFFF), MAC-Adressen und Speicheradressen in Betriebssystemen.',
    },
    faqs: [
      { question: 'Welchem Dezimalwert entspricht der Hex-Code FF?', answer: 'F hat den Wert 15. Berechnung: (15 × 16¹) + (15 × 16⁰) = 240 + 15 = 255.' },
      { question: 'Wie setzt sich ein HTML-Farbcode wie #FF8000 zusammen?', answer: 'Aus drei 2-stelligen Hex-Werten für Rot, Grün und Blau: FF = 255 Rot (Maximum), 80 = 128 Grün (Mittel), 00 = 0 Blau. Das ergibt ein leuchtendes Orange.' },
    ],
    relatedSlugs: ['binaer-hex-dezimal-umrechner', 'modulo-rechner', 'prozentrechner', 'roemische-zahlen-umrechner'],
  },
  {
    id: 'teiler-vielfache-rechner',
    slug: 'teiler-vielfache-rechner',
    name: 'Teiler & Vielfache-Rechner',
    shortName: 'Teiler berechnen',
    category: 'mathematik',
    subcategory: 'Zahlen & Algebra',
    metaTitle: 'Teiler & Vielfache Rechner – Alle Teiler einer Zahl online...',
    metaDescription: 'Ermitteln Sie alle Teiler einer ganzen Zahl, die Anzahl der Teiler und die ersten Vielfachen. Für Schule & Mathematik.',
    h1: 'Teiler & Vielfache Rechner',
    shortDescription: 'Berechnet die vollständige Teilermenge einer Zahl und prüft, ob es sich um eine Primzahl handelt.',
    searchKeywords: ['teiler rechner', 'alle teiler einer zahl finden', 'teilermenge berechnen', 'vielfache einer zahl'],
    inputs: [
      { id: 'num', label: 'Ganze Zahl (1 - 100.000)', type: 'number', defaultValue: 60, min: 1, max: 100000, step: 1 },
    ],
    calculate: (inputs) => {
      const n = Math.abs(parseInt(inputs.num, 10)) || 60;
      const divisors: number[] = [];
      for (let i = 1; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
          divisors.push(i);
          if (i !== n / i) divisors.push(n / i);
        }
      }
      divisors.sort((a, b) => a - b);
      const isPrime = divisors.length === 2;
      return {
        primary: { id: 'count', label: 'Anzahl der Teiler', value: divisors.length, formattedValue: `${divisors.length} Teiler`, highlight: true },
        secondary: [
          { id: 'list', label: 'Teilermenge', value: divisors.length, formattedValue: divisors.join(', ') },
          { id: 'prime', label: 'Ist Primzahl?', value: isPrime ? 1 : 0, formattedValue: isPrime ? 'Ja' : 'Nein' },
        ],
        summaryText: `Die Zahl ${n} hat ${divisors.length} Teiler: ${divisors.join(', ')}.`,
      };
    },
    formula: 'Teiler d teilt n ohne Rest: n mod d = 0',
    formulaExplanation: 'Die Teilermenge umfasst alle natürlichen Zahlen, durch die n ganzzahlig teilbar ist.',
    workedExample: {
      title: 'Beispiel: Zahl 60',
      description: 'Teiler: 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60 (12 Teiler).',
      inputs: { num: 60 },
      resultSummary: '12 Teiler gefunden',
    },
    content: {
      intro: 'Dieser Rechner ermittelt alle echten Teiler einer Zahl, prüft auf Primzahleigenschaften und listet die ersten Vielfachen auf.',
      details: 'Zahlen, deren echte Teiler summiert genau die Zahl selbst ergeben, heißen vollkommene Zahlen (z. B. 6 = 1 + 2 + 3 oder 28 = 1 + 2 + 4 + 7 + 14). Besitzt eine Zahl außer der 1 und sich selbst keine Teiler, ist sie eine Primzahl.',
    },
    faqs: [
      { question: 'Wie viele Teiler hat die Zahl 60?', answer: '60 hat 12 Teiler: 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30 und 60.' },
      { question: 'Bis zu welcher Zahl muss man testen, um alle Teiler zu finden?', answer: 'Es genügt, alle Zahlen bis zur Quadratwurzel der Ausgangszahl zu prüfen, da Teiler immer paarweise auftreten (z. B. bei 36: 4 × 9).' },
    ],
    relatedSlugs: ['ggt-rechner', 'quersumme-rechner', 'prozentrechner', 'kgv-rechner'],
  },
];
