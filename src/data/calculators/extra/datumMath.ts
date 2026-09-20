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
    metaTitle: 'Renteneintritt Rechner – Wann kann ich in Rente gehen? (Rente mit 67)',
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
      intro: 'Wann beginnt für Sie die gesetzliche Rente? Die schrittweise Anhebung des Renteneintrittsalters auf 67 Jahre betrifft alle Jahrgänge ab 1947.',
      details: 'Der offizielle Rentenbeginn ist in Deutschland der erste Tag des Monats, der auf den Geburtstag folgt, an dem das erforderliche Lebensalter vollendet wird.',
    },
    faqs: [
      { question: 'Ab welchem Geburtsjahrgang gilt die Rente mit 67 voll?', answer: 'Für alle Personen, die im Jahr 1964 oder später geboren wurden, liegt die Regelaltersgrenze ausnahmslos bei 67 Jahren.' },
    ],
    relatedSlugs: ['altersrechner', 'arbeitstage-rechner', 'lebenszeit-in-stunden'],
  },
  {
    id: 'dienstjubilaeum-rechner',
    slug: 'dienstjubilaeum-rechner',
    name: 'Dienstjubiläum-Rechner (Betriebszugehörigkeit)',
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
      intro: 'Ein Dienstjubiläum markiert einen besonderen Meilenstein im Berufsleben. Im öffentlichen Dienst (TVöD) sowie vielen tariflichen Unternehmen ist es mit Jubiläumsgeld oder Sonderurlaub verknüpft.',
      details: 'Geben Sie Ihr Eintrittsdatum ein, um alle relevanten Jubiläumszeitpunkte (10, 25, 40 und 50 Jahre) auf einen Blick zu sehen.',
    },
    faqs: [
      { question: 'Gibt es nach deutschem Recht einen gesetzlichen Anspruch auf Jubiläumsurlaub?', answer: 'Ein rein gesetzlicher Anspruch existiert nicht. Allerdings regeln viele Tarifverträge (z. B. TVöD) Sonderurlaub und Jubiläumszuwendungen bei 25 und 40 Dienstjahren.' },
    ],
    relatedSlugs: ['arbeitstage-rechner', 'altersrechner', 'werktage-rechner'],
  },

  // ==================== MATHEMATIK (13) ====================
  {
    id: 'prozentualer-unterschied-rechner',
    slug: 'prozentualer-unterschied-rechner',
    name: 'Prozentualer Unterschied-Rechner',
    shortName: 'Prozentualer Unterschied',
    category: 'mathematik',
    subcategory: 'Prozentrechnung',
    metaTitle: 'Prozentualer Unterschied Rechner – Relative Differenz zweier Zahlen',
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
      intro: 'Der prozentuale Unterschied quantifiziert, wie stark sich zwei Messwerte oder Preise im Verhältnis zu ihrer Größenordnung unterscheiden.',
      details: 'Im Gegensatz zur prozentualen Zunahme nutzt der symmetrische Unterschied den Durchschnitt beider Werte.',
    },
    faqs: [
      { question: 'Was ist der Unterschied zur prozentualen Veränderung?', answer: 'Die Veränderung hat eine Richtung (Vorher-Nachher). Der Unterschied vergleicht zwei gleichrangige Werte symmetrisch.' },
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
      intro: 'Wie viel Prozent sind eigentlich 30 % von 40 %? Der Rechner löst zusammengesetzte Quoten sofort.',
      details: 'Das Prinzip entspricht der Wahrscheinlichkeitsrechnung bei stochastischen Pfaden.',
    },
    faqs: [
      { question: 'Warum sind 50 % von 50 % genau 25 %?', answer: 'Weil 0,5 × 0,5 = 0,25 ist. Die Hälfte von 50 % ist 25 %.' },
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
    metaTitle: 'Promillerechner – Promille (‰) in Prozent und Betrag online umrechnen',
    metaDescription: 'Rechnen Sie Promille (Tausendstel) präzise in Prozent, Dezimalzahlen und absolute Beträge um. Schnelle Online-Berechnung.',
    h1: 'Promillerechner (Tausendstel-Rechnung)',
    shortDescription: 'Wandelt Promillewerte (‰) in Prozent und konkrete Zahlenbeträge um.',
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
      intro: 'Promilleangaben begegnen uns bei Versicherungsbeiträgen, juristischen Gebühren und Blutalkoholwerten.',
      details: 'Ein Promille ist der tausendste Teil eines Ganzen: 1 ‰ = 0,001 = 0,1 %.',
    },
    faqs: [
      { question: 'Wie viel Prozent sind 1 Promille?', answer: '1 Promille (‰) entspricht exakt 0,1 Prozent (%).' },
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
      intro: 'Wenn 3 Gärtner 8 Stunden für eine Parkanlage benötigen, wie lange brauchen dann 6 Gärtner? Der antiproportionale Dreisatz löst solche Aufgaben.',
      details: 'Die Grundregel lautet: Verdoppelt sich die eine Größe, halbiert sich die andere Größe.',
    },
    faqs: [
      { question: 'Wann liegt ein antiproportionaler Dreisatz vor?', answer: 'Immer dann, wenn eine Zunahme der ersten Größe zu einer anteiligen Abnahme der zweiten führt (z. B. mehr Arbeiter = weniger Zeit).' },
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
      intro: 'Jeder Bruch lässt sich durch Division des Zählers durch den Nenner in eine Dezimalzahl überführen.',
      details: 'Der Rechner erkennt auch gemischte Brüche und weist das Ergebnis zusätzlich als Prozentsatz aus.',
    },
    faqs: [
      { question: 'Was ist ein periodischer Dezimalbruch?', answer: 'Wenn sich eine Ziffernfolge bei der Division unendlich wiederholt (wie bei 1/3 = 0,333...), spricht man von einer periodischen Dezimalzahl.' },
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
    metaTitle: 'Dezimalzahl in Bruch Rechner – Kommazahlen in gekürzte Brüche umwandeln',
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
      intro: 'Rechnen mit exakten Brüchen verhindert Rundungsfehler. Unser Rechner wandelt jede Dezimalzahl in den kleinstmöglichen Bruch um.',
      details: 'Unterstützt auch unechte Brüche und gemischte Schreibweisen.',
    },
    faqs: [
      { question: 'Wie wandelt man 0,125 in einen Bruch um?', answer: '0,125 hat 3 Nachkommastellen = 125/1000. Gekürzt durch 125 ergibt das exakt 1/8.' },
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
      intro: 'Die Kubikwurzel wird besonders bei Volumenberechnungen von Würfeln oder Kugeln benötigt.',
      details: 'Weil (-a)³ = -(a³), ist die Kubikwurzel auch für negative Zahlen im Reellen definiert.',
    },
    faqs: [
      { question: 'Kann man aus negativen Zahlen die Kubikwurzel ziehen?', answer: 'Ja! Bei ungeraden Wurzelexponenten wie 3 ist ³√(-27) = -3 reell definiert.' },
    ],
    relatedSlugs: ['quadratwurzel-rechner', 'n-te-wurzel-rechner', 'zehnerpotenzen-rechner'],
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
      intro: 'Egal ob 4. Wurzel oder 10. Wurzel: Dieser Rechner löst allgemeine Wurzelgleichungen in Sekundenschnelle.',
      details: 'Mathematisch gilt: ⁿ√x ist die Lösung der Potenzgleichung y^n = x.',
    },
    faqs: [
      { question: 'Was bedeutet die n-te Wurzel als Potenz?', answer: 'Die n-te Wurzel lässt sich als Potenz schreiben: x^(1/n).' },
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
      intro: 'In Naturwissenschaften werden sehr große Zahlen als Zehnerpotenzen dargestellt.',
      details: 'Der Rechner zeigt Mantisse und Exponent übersichtlich an.',
    },
    faqs: [
      { question: 'Was bedeutet 10⁻³?', answer: '10⁻³ = 1 / 1000 = 0,001 (Milli).' },
    ],
    relatedSlugs: ['zehnerpotenzen-rechner', 'n-te-wurzel-rechner', 'zehnerpotenzen-rechner'],
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
      intro: 'Die Modulo-Operation ist ein zentrales Werkzeug in der Informatik und Kryptographie.',
      details: 'Ergänzend zum Restwert weist der Rechner auch den ganzzahligen Quotienten aus.',
    },
    faqs: [
      { question: 'Wo wird Modulo im Alltag verwendet?', answer: 'Bei Uhrzeiten: (10 + 17) mod 24 = 27 mod 24 = 3 Uhr morgens.' },
    ],
    relatedSlugs: ['quersumme-rechner', 'binaer-hex-dezimal-umrechner', 'ggt-rechner'],
  },
  {
    id: 'quersumme-rechner',
    slug: 'quersumme-rechner',
    name: 'Quersumme-Rechner (Iterierte Ziffernsumme)',
    shortName: 'Quersumme',
    category: 'mathematik',
    subcategory: 'Zahlen & Algebra',
    metaTitle: 'Quersumme Rechner – Quersumme & iterierte Quersumme online berechnen',
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
      intro: 'Die Quersumme ist eine der bekanntesten Rechenmethoden, um Teilbarkeit durch 3 oder 9 zu prüfen.',
      details: 'Ist die Quersumme durch 3 teilbar, ist auch die Zahl durch 3 teilbar.',
    },
    faqs: [
      { question: 'Was ist die Quersummenwurzel?', answer: 'Wendet man die Quersummenbildung wiederholt an, bis eine Ziffer übrig bleibt, ist das die Quersummenwurzel.' },
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
    shortDescription: 'Wandelt Hex-Werte in Dezimal-, Binär- und Oktalzahlen um.',
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
      intro: 'Hexadezimalzahlen begegnen uns bei HTML-Farbcodes (#FFFFFF) und IPv6-Adressen.',
      details: 'Ein Byte (8 Bit) lässt sich durch zwei Hexziffern darstellen.',
    },
    faqs: [
      { question: 'Welche Werte haben A bis F?', answer: 'A = 10, B = 11, C = 12, D = 13, E = 14, F = 15.' },
    ],
    relatedSlugs: ['binaer-hex-dezimal-umrechner', 'binaer-hex-dezimal-umrechner', 'modulo-rechner'],
  },
  {
    id: 'teiler-vielfache-rechner',
    slug: 'teiler-vielfache-rechner',
    name: 'Teiler & Vielfache-Rechner',
    shortName: 'Teiler berechnen',
    category: 'mathematik',
    subcategory: 'Zahlen & Algebra',
    metaTitle: 'Teiler & Vielfache Rechner – Alle Teiler einer Zahl online finden',
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
      intro: 'Wie viele Teiler hat eine Zahl und welche sind es? Dieser Rechner listet alle Faktoren auf.',
      details: 'Hat eine Zahl nur genau zwei Teiler, handelt es sich um eine Primzahl.',
    },
    faqs: [
      { question: 'Welche Zahl hat viele Teiler unter 100?', answer: 'Zahlen wie 60, 72, 84, 90 und 96 haben jeweils 12 Teiler.' },
    ],
    relatedSlugs: ['ggt-rechner', 'teiler-vielfache-rechner', 'quersumme-rechner'],
  },
];
