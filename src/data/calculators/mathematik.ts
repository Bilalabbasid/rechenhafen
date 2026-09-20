import { CalculatorDefinition } from '@/types/calculator';
import {
  calculatePercentage,
  calculatePercentChange,
  calculateBaseValue,
  calculateRuleOfThree,
  calculateAverage,
  calculatePythagoras,
  calculateGcdLcm,
  calculateRoot,
} from '@/lib/calculators/mathematik';
import { formatNumber, formatPercent } from '@/lib/formatters';

export const MATHEMATIK_CALCULATORS: CalculatorDefinition[] = [
  {
    id: 'prozentrechner',
    slug: 'prozentrechner',
    name: 'Prozentrechner',
    shortName: 'Prozentrechner',
    category: 'mathematik',
    subcategory: 'Prozentrechnung',
    metaTitle: 'Prozentrechner – Prozentwert, Prozentsatz & Grundwert online berechnen',
    metaDescription: 'Kostenloser Online-Prozentrechner: Wie viel sind X % von Y? Prozentuale Veränderungen, Aufschläge und Rabatte schnell und einfach berechnen.',
    h1: 'Prozentrechner – Alle Prozentrechnungen auf einen Blick',
    shortDescription: 'Berechnet den Prozentwert, Prozentsatz, Grundwert und prozentuale Zu- oder Abnahmen.',
    searchKeywords: ['prozentrechner', 'wie viel prozent von', 'prozent berechnen', 'prozentrechnung formel', 'prozentwert berechnen'],
    inputs: [
      { id: 'percent', label: 'Prozentsatz (p)', type: 'number', defaultValue: 19, unit: '%', step: 0.1 },
      { id: 'base', label: 'Grundwert (G)', type: 'number', defaultValue: 250, unit: '€ / Einheiten', step: 0.01 },
    ],
    calculate: (inputs) => calculatePercentage({ ...inputs, mode: 'partOf' }),
    formula: 'Prozentwert (W) = Grundwert (G) × (Prozentsatz (p) / 100)',
    formulaExplanation: 'Der Grundwert stellt das Ganze (100 %) dar. Multipliziert mit dem Hundertstel des Prozentsatzes ergibt sich der gesuchte Anteil (Prozentwert).',
    workedExample: {
      title: 'Beispiel: 19 % von 250 €',
      description: '250 € × (19 / 100) = 47,50 €.',
      inputs: { percent: 19, base: 250 },
      resultSummary: '47,50 € (Gesamtsumme: 297,50 €)',
    },
    content: {
      intro: 'Die Prozentrechnung ist eine der wichtigsten mathematischen Grundlagen des Alltags – ob bei Rabatten im Supermarkt, Gehaltserhöhungen, Zinsen oder Steuern.',
      details: 'Dieser Rechner ermittelt für Sie den exakten Prozentwert sowie die Summe und Differenz zum Ausgangswert.',
      tips: ['Für Rabatte: Ziehen Sie den Prozentwert einfach vom Grundwert ab.', 'Für Preiserhöhungen: Addieren Sie den Prozentwert auf den Grundwert.'],
    },
    faqs: [
      { question: 'Was ist der Unterschied zwischen Prozentwert und Prozentsatz?', answer: 'Der Prozentsatz (p %) ist die relative Verhältniszahl mit dem Prozentzeichen (z.B. 19 %). Der Prozentwert (W) ist der tatsächliche absolute Wert oder Geldbetrag (z.B. 47,50 €).' },
      { question: 'Wie rechnet man Prozent im Kopf?', answer: '10 % entspricht einem Zehntel (Komma um eine Stelle nach links). 1 % entspricht einem Hundertstel (Komma um zwei Stellen nach links). 5 % ist die Hälfte von 10 %.' },
    ],
    relatedSlugs: ['prozentuale-veraenderung', 'grundwert-rechner', 'dreisatzrechner', 'bruchrechner'],
  },
  {
    id: 'prozentuale-veraenderung',
    slug: 'prozentuale-veraenderung',
    name: 'Prozentuale-Veränderung-Rechner',
    shortName: 'Prozentuale Steigerung',
    category: 'mathematik',
    subcategory: 'Prozentrechnung',
    metaTitle: 'Prozentuale Veränderung Rechner – Steigerung & Senkung berechnen',
    metaDescription: 'Berechnen Sie die prozentuale Zunahme oder Abnahme von einem alten auf einen neuen Wert. Inklusive Differenz und Wachstumsfaktor.',
    h1: 'Prozentuale Veränderung berechnen',
    shortDescription: 'Ermittelt die relative Steigerung oder Senkung zwischen zwei Werten in Prozent.',
    searchKeywords: ['prozentuale veränderung rechner', 'prozentuale steigerung berechnen', 'prozentuale senkung', 'zuwachs in prozent'],
    inputs: [
      { id: 'oldValue', label: 'Ursprünglicher Wert (Alt)', type: 'number', defaultValue: 120, step: 0.01 },
      { id: 'newValue', label: 'Neuer Wert (Neu)', type: 'number', defaultValue: 150, step: 0.01 },
    ],
    calculate: calculatePercentChange,
    formula: 'Veränderung (%) = ((Neuer Wert - Alter Wert) / |Alter Wert|) × 100',
    formulaExplanation: 'Die Differenz aus neuem und altem Wert wird durch den alten Wert dividiert und mit 100 multipliziert.',
    workedExample: {
      title: 'Beispiel: Steigerung von 120 auf 150',
      description: 'Differenz: 30. (30 / 120) × 100 = +25,00 % Zuwachs.',
      inputs: { oldValue: 120, newValue: 150 },
      resultSummary: '+25,00 %',
    },
    content: {
      intro: 'Ob Inflation, Umsatzwachstum, Gewichtsveränderung oder Preissteigerungen: Mit diesem Rechner sehen Sie sofort, um wie viel Prozent sich ein Wert verändert hat.',
      details: 'Bei positiven Ergebnissen handelt es sich um ein Wachstum, bei negativen Ergebnissen um eine Verringerung.',
    },
    faqs: [
      { question: 'Ist eine Steigerung von 100 % eine Verdopplung?', answer: 'Ja. Eine Erhöhung um 100 % bedeutet, dass der ursprüngliche Betrag noch einmal hinzukommt – der Wert verdoppelt sich somit (Faktor 2,0).' },
    ],
    relatedSlugs: ['prozentrechner', 'grundwert-rechner', 'dreisatzrechner'],
  },
  {
    id: 'grundwert-rechner',
    slug: 'grundwert-rechner',
    name: 'Grundwert-Rechner',
    shortName: 'Grundwert berechnen',
    category: 'mathematik',
    subcategory: 'Prozentrechnung',
    metaTitle: 'Grundwert Rechner – 100 % Ausgangswert online berechnen',
    metaDescription: 'Ermitteln Sie den Grundwert (100 %), wenn Prozentwert und Prozentsatz bekannt sind. Formel, Rechenweg & einfache Erklärung.',
    h1: 'Grundwert berechnen (G = W / (p/100))',
    shortDescription: 'Ermittelt den 100%-Ausgangswert anhand von gegebenem Anteil und Prozentsatz.',
    searchKeywords: ['grundwert rechner', 'grundwert berechnen formel', '100 prozent berechnen', 'grundwert beispiel'],
    inputs: [
      { id: 'part', label: 'Gegebener Prozentwert (W)', type: 'number', defaultValue: 45, step: 0.01 },
      { id: 'percent', label: 'Dazugehöriger Prozentsatz (p)', type: 'number', defaultValue: 15, unit: '%', step: 0.1 },
    ],
    calculate: calculateBaseValue,
    formula: 'Grundwert (G) = Prozentwert (W) / (Prozentsatz (p) / 100)',
    formulaExplanation: 'Man teilt den Prozentwert durch den Prozentsatz in Dezimalschreibweise.',
    workedExample: {
      title: 'Beispiel: 45 sind 15 % von wie viel?',
      description: '45 / 0,15 = 300.',
      inputs: { part: 45, percent: 15 },
      resultSummary: '300',
    },
    content: {
      intro: 'Wenn Sie wissen, dass ein Teilbetrag einen bestimmten Prozentsatz darstellt, können Sie mit diesem Rechner sofort das Ganze (100 %) ermitteln.',
      details: 'Typisches Beispiel: Wenn 30 € Rabatt 20 % des Preises waren, kostete der Artikel ursprünglich 150 €.',
    },
    faqs: [
      { question: 'Wie berechnet man den Grundwert im Dreisatz?', answer: 'Teilen Sie den bekannten Teilwert durch den Prozentsatz (ergibt 1 %) und multiplizieren Sie das Zwischenergebnis anschließend mit 100.' },
    ],
    relatedSlugs: ['prozentrechner', 'prozentuale-veraenderung', 'dreisatzrechner'],
  },
  {
    id: 'dreisatzrechner',
    slug: 'dreisatzrechner',
    name: 'Dreisatzrechner (Proportional & Antiproportional)',
    shortName: 'Dreisatzrechner',
    category: 'mathematik',
    subcategory: 'Dreisatz & Verhältnisse',
    metaTitle: 'Dreisatzrechner – Einfacher & umgekehrter Dreisatz online',
    metaDescription: 'Lösen Sie jede Dreisatzaufgabe sofort: Proportional (je mehr, desto mehr) und antiproportional (je mehr, desto weniger) mit Schritt-für-Schritt-Rechenweg.',
    h1: 'Dreisatzrechner – Schritt für Schritt lösen',
    shortDescription: 'Berechnet proportionale und antiproportionale Dreisatzaufgaben zuverlässig.',
    searchKeywords: ['dreisatzrechner', 'dreisatz online lösen', 'antiproportionaler dreisatz rechner', 'dreisatz formel'],
    inputs: [
      { id: 'a1', label: 'Ausgangsgröße A (z.B. 4 Arbeiter / 5 Äpfel)', type: 'number', defaultValue: 4 },
      { id: 'b1', label: 'Zugehörige Größe B (z.B. 12 Stunden / 10 Euro)', type: 'number', defaultValue: 12 },
      { id: 'a2', label: 'Neue Größe A (z.B. 6 Arbeiter / 8 Äpfel)', type: 'number', defaultValue: 6 },
      {
        id: 'type',
        label: 'Verhältnisart',
        type: 'select',
        defaultValue: 'direct',
        options: [
          { value: 'direct', label: 'Proportional (Je mehr, desto mehr / z.B. Preis nach Menge)' },
          { value: 'indirect', label: 'Antiproportional (Je mehr, desto weniger / z.B. Arbeiter nach Zeit)' },
        ],
      },
    ],
    calculate: calculateRuleOfThree,
    formula: 'Direkt: X = (B1 / A1) × A2 | Indirekt: X = (A1 × B1) / A2',
    formulaExplanation: 'Beim proportionalen Dreisatz wird auf die Einheit 1 heruntergerechnet und dann hochmultipliziert. Beim antiproportionalen Dreisatz ist das Produkt aus A und B konstant.',
    workedExample: {
      title: 'Beispiel proportional: 5 kg kosten 15 €, was kosten 8 kg?',
      description: '1 kg = 3 €. 8 kg kosten 24 €.',
      inputs: { a1: 5, b1: 15, a2: 8, type: 'direct' },
      resultSummary: '24,00 €',
    },
    content: {
      intro: 'Der Dreisatz ist das universelle Rechenverfahren der Praxis. Er beantwortet Fragen nach dem Motto: Wenn A zu B führt, was entspricht dann C?',
      details: 'Unser Rechner beherrscht sowohl den direkten Dreisatz als auch den indirekten Dreisatz.',
    },
    faqs: [
      { question: 'Woran erkenne ich einen antiproportionalen Dreisatz?', answer: 'Stellen Sie sich die Frage: Wenn Größe A verdoppelt wird, halbiert sich dann Größe B? Typische Beispiele sind Arbeiter und Bauzeit oder Fahrgeschwindigkeit und Reisezeit.' },
    ],
    relatedSlugs: ['prozentrechner', 'verhaeltnis-rechner'],
  },
  {
    id: 'verhaeltnis-rechner',
    slug: 'verhaeltnis-rechner',
    name: 'Verhältnis-Rechner (Proportionen A:B = C:D)',
    shortName: 'Verhältnisrechner',
    category: 'mathematik',
    subcategory: 'Dreisatz & Verhältnisse',
    metaTitle: 'Verhältnis Rechner – Proportionen A:B = C:D online lösen',
    metaDescription: 'Berechnen Sie fehlende Werte in Verhältnissen und Proportionen. Finden Sie den vierten Wert im Seitenverhältnis oder Mischungsverhältnis.',
    h1: 'Verhältnis & Proportionen berechnen (A:B = C:X)',
    shortDescription: 'Löst Verhältnisgleichungen A:B = C:X für Mischungen, Maßstäbe und Bildformate.',
    searchKeywords: ['verhältnis rechner', 'proportionen rechner', 'mischungsverhältnis rechner', 'maßstab rechner'],
    inputs: [
      { id: 'a', label: 'Wert A', type: 'number', defaultValue: 16 },
      { id: 'b', label: 'Wert B', type: 'number', defaultValue: 9 },
      { id: 'c', label: 'Wert C', type: 'number', defaultValue: 1920 },
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a) || 16;
      const b = parseFloat(inputs.b) || 9;
      const c = parseFloat(inputs.c) || 1920;
      if (a === 0) return { primary: { id: 'd', label: 'Wert X', value: 0, formattedValue: '0' }, error: 'A darf nicht 0 sein.' };
      const d = (b * c) / a;
      return {
        primary: { id: 'd', label: 'Berechneter Wert X (D)', value: d, formattedValue: formatNumber(d, 2), highlight: true },
        secondary: [
          { id: 'ratio', label: 'Verhältnis (A : B)', value: a / b, formattedValue: `${formatNumber(a / b, 3)} : 1` },
          { id: 'scaling', label: 'Skalierungsfaktor (C / A)', value: c / a, formattedValue: `${formatNumber(c / a, 2)} ×` },
        ],
        summaryText: `Aus dem Verhältnis ${a} : ${b} ergibt sich bei ${c} der gesuchte Wert ${formatNumber(d, 2)} (${a} : ${b} = ${c} : ${formatNumber(d, 2)}).`,
      };
    },
    formula: 'X = (B × C) / A',
    formulaExplanation: 'Gleichung über Kreuz multiplizieren: A × X = B × C aufgelöst nach X.',
    workedExample: {
      title: 'Beispiel: 16:9 Format bei Breite 1920 Pixel',
      description: '(9 × 1920) / 16 = 1080 Pixel Höhe (Full HD).',
      inputs: { a: 16, b: 9, c: 1920 },
      resultSummary: '1080',
    },
    content: {
      intro: 'Verhältnisgleichungen finden sich überall: Ob bei Bildschirmseitenverhältnissen (16:9), Maßstäben auf Landkarten (1:50.000) oder Mischungen von Beton oder Flüssigkeiten.',
      details: 'Geben Sie drei Werte ein, um den vierten Wert im Gleichgewicht zu berechnen.',
    },
    faqs: [
      { question: 'Wie berechnet man ein Mischungsverhältnis 1:4?', answer: 'Bei 1:4 besteht das Gemisch aus 1 Teil Komponente A und 4 Teilen Komponente B (insgesamt 5 Teile). 1 Liter fertige Mischung enthält also 0,2 Liter A und 0,8 Liter B.' },
    ],
    relatedSlugs: ['dreisatzrechner', 'prozentrechner'],
  },
  {
    id: 'bruchrechner',
    slug: 'bruchrechner',
    name: 'Bruchrechner (Brüche addieren, subtrahieren & kürzen)',
    shortName: 'Bruchrechner',
    category: 'mathematik',
    subcategory: 'Bruchrechnung',
    metaTitle: 'Bruchrechner – Brüche plus, minus, mal, geteilt online rechnen',
    metaDescription: 'Rechnen mit Brüchen: Addieren, subtrahieren, multiplizieren und dividieren mit automatischem Hauptnenner und vollständigem Kürzen.',
    h1: 'Bruchrechner – Brüche einfach online berechnen',
    shortDescription: 'Führt alle Grundrechenarten mit Brüchen durch und gibt das gekürzte Ergebnis sowie die gemischte Zahl aus.',
    searchKeywords: ['bruchrechner', 'brüche addieren rechner', 'brüche multiplizieren rechner', 'brüche kürzen online'],
    inputs: [
      { id: 'num1', label: 'Zähler Bruch 1', type: 'number', defaultValue: 3, step: 1 },
      { id: 'den1', label: 'Nenner Bruch 1', type: 'number', defaultValue: 4, step: 1 },
      {
        id: 'op',
        label: 'Rechenzeichen',
        type: 'select',
        defaultValue: '+',
        options: [
          { value: '+', label: '+ (Addition)' },
          { value: '-', label: '− (Subtraktion)' },
          { value: '*', label: '× (Multiplikation)' },
          { value: '/', label: '÷ (Division)' },
        ],
      },
      { id: 'num2', label: 'Zähler Bruch 2', type: 'number', defaultValue: 2, step: 1 },
      { id: 'den2', label: 'Nenner Bruch 2', type: 'number', defaultValue: 5, step: 1 },
    ],
    calculate: (inputs) => {
      const n1 = parseInt(inputs.num1 || '3', 10);
      const d1 = parseInt(inputs.den1 || '4', 10);
      const n2 = parseInt(inputs.num2 || '2', 10);
      const d2 = parseInt(inputs.den2 || '5', 10);
      const op = inputs.op || '+';

      if (d1 === 0 || d2 === 0) {
        return { primary: { id: 'res', label: 'Ergebnis', value: 0, formattedValue: 'Division durch 0' }, error: 'Ein Nenner darf nicht null sein.' };
      }

      let resN = 0;
      let resD = 1;

      if (op === '+') {
        resN = n1 * d2 + n2 * d1;
        resD = d1 * d2;
      } else if (op === '-') {
        resN = n1 * d2 - n2 * d1;
        resD = d1 * d2;
      } else if (op === '*') {
        resN = n1 * n2;
        resD = d1 * d2;
      } else if (op === '/') {
        if (n2 === 0) return { primary: { id: 'res', label: 'Ergebnis', value: 0, formattedValue: 'Division durch 0' }, error: 'Division durch 0 ist unzulässig.' };
        resN = n1 * d2;
        resD = d1 * n2;
      }

      // Kürzen
      const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
      const div = Math.abs(gcd(resN, resD));
      const sN = resN / div;
      const sD = resD / div;
      const dec = sN / sD;

      return {
        primary: { id: 'fraction', label: 'Gekürzter Bruch', value: dec, formattedValue: `${sN} / ${sD}`, highlight: true },
        secondary: [
          { id: 'decimal', label: 'Als Dezimalzahl', value: dec, formattedValue: formatNumber(dec, 4) },
          { id: 'mixed', label: 'Als gemischte Zahl', value: dec, formattedValue: Math.abs(sN) >= sD ? `${Math.trunc(sN / sD)} ${Math.abs(sN % sD)}/${sD}` : `${sN}/${sD}` },
        ],
        summaryText: `Das Ergebnis der Rechnung ist ${sN}/${sD} (entspricht dezimal ${formatNumber(dec, 4)}).`,
      };
    },
    formula: 'Addition: a/b + c/d = (ad + bc) / bd | Multiplikation: a/b × c/d = (ac) / (bd)',
    formulaExplanation: 'Beim Addieren/Subtrahieren werden die Brüche zunächst gleichnamig gemacht. Beim Multiplizieren rechnet man Zähler mal Zähler und Nenner mal Nenner.',
    workedExample: {
      title: 'Beispiel: 3/4 + 2/5',
      description: 'Hauptnenner ist 20. 15/20 + 8/20 = 23/20 = 1 3/20 (1,15).',
      inputs: { num1: 3, den1: 4, op: '+', num2: 2, den2: 5 },
      resultSummary: '23 / 20 (1,15)',
    },
    content: {
      intro: 'Bruchrechnen leicht gemacht: Unser Bruchrechner löst alle vier Grundrechenarten zwischen zwei beliebigen Brüchen.',
      details: 'Das Ergebnis wird automatisch gekürzt und sowohl als echter Bruch als auch als Dezimalzahl angezeigt.',
    },
    faqs: [
      { question: 'Wie dividiert man zwei Brüche?', answer: 'Man multipliziert den ersten Bruch mit dem Kehrwert des zweiten Bruchs (Zähler und Nenner des zweiten Bruchs vertauschen).' },
    ],
    relatedSlugs: ['ggt-rechner', 'kgv-rechner', 'prozentrechner'],
  },
  {
    id: 'dreieckrechner',
    slug: 'dreieckrechner',
    name: 'Dreieck-Rechner (Flächeninhalt & Umfang)',
    shortName: 'Dreieck berechnen',
    category: 'mathematik',
    subcategory: 'Zahlen & Algebra',
    metaTitle: 'Dreieck Rechner – Flächeninhalt (A) & Umfang online berechnen',
    metaDescription: 'Berechnen Sie die Fläche und den Umfang jedes Dreiecks aus Grundseite und Höhe. Schnelle & präzise Geometrieberechnung.',
    h1: 'Dreieck Rechner – Fläche & Umfang online berechnen',
    shortDescription: 'Ermittelt den Flächeninhalt und Umfang von Dreiecken aus Grundseite und Höhe.',
    searchKeywords: ['dreieckrechner', 'dreieck fläche berechnen', 'dreieck formel grundseite höhe', 'umfang dreieck rechner'],
    inputs: [
      { id: 'baseG', label: 'Grundseite (g) in cm', type: 'number', defaultValue: 10, min: 0.1, step: 0.1, unit: 'cm' },
      { id: 'heightH', label: 'Höhe (h) in cm', type: 'number', defaultValue: 6, min: 0.1, step: 0.1, unit: 'cm' },
    ],
    calculate: (inputs) => {
      const g = parseFloat(inputs.baseG) || 10;
      const h = parseFloat(inputs.heightH) || 6;
      if (g <= 0 || h <= 0) return { primary: { id: 'area', label: 'Fläche', value: 0, formattedValue: '0 cm²' }, error: 'Werte müssen positiv sein.' };
      const area = (g * h) / 2;
      return {
        primary: { id: 'area', label: 'Flächeninhalt (A)', value: area, formattedValue: `${formatNumber(area, 2)} cm²`, highlight: true },
        secondary: [
          { id: 'base', label: 'Grundseite (g)', value: g, formattedValue: `${formatNumber(g, 2)} cm` },
          { id: 'height', label: 'Höhe (h)', value: h, formattedValue: `${formatNumber(h, 2)} cm` },
        ],
        summaryText: `Ein Dreieck mit Grundseite ${formatNumber(g, 2)} cm und Höhe ${formatNumber(h, 2)} cm hat einen Flächeninhalt von ${formatNumber(area, 2)} cm².`,
      };
    },
    formula: 'Fläche A = (Grundseite g × Höhe h) / 2',
    formulaExplanation: 'Ein Dreieck besitzt stets exakt den halben Flächeninhalt eines Rechtecks mit gleicher Grundlinie und Höhe.',
    workedExample: {
      title: 'Beispiel: Grundseite 10 cm, Höhe 6 cm',
      description: '(10 × 6) / 2 = 30 cm².',
      inputs: { baseG: 10, heightH: 6 },
      resultSummary: '30,00 cm²',
    },
    content: {
      intro: 'Berechnen Sie den Flächeninhalt beliebiger Dreiecke zuverlässig aus Grundseite und zugehöriger Höhe.',
      details: 'Die Formel gilt universell für rechtwinklige, gleichschenklige, gleichseitige und ungleichseitige Dreiecke.',
    },
    faqs: [
      { question: 'Gilt die Formel A = (g × h) / 2 für jedes Dreieck?', answer: 'Ja, unabhängig von der Form des Dreiecks ist der Flächeninhalt immer die Hälfte des Produkts aus einer Grundseite und der darauf senkrecht stehenden Höhe.' },
    ],
    relatedSlugs: ['pythagoras-rechner', 'rechteckrechner', 'kreisrechner'],
  },
  {
    id: 'durchschnittsrechner',
    slug: 'durchschnittsrechner',
    name: 'Durchschnittsrechner (Arithmetisches Mittel & Median)',
    shortName: 'Mittelwert berechnen',
    category: 'mathematik',
    subcategory: 'Zahlen & Algebra',
    metaTitle: 'Durchschnittsrechner – Mittelwert, Median & Summe online ermitteln',
    metaDescription: 'Berechnen Sie das arithmetische Mittel (Durchschnitt), den Median, Minimum, Maximum und die Gesamtsumme beliebiger Zahlenreihen.',
    h1: 'Durchschnittsrechner – Mittelwert & Median',
    shortDescription: 'Ermittelt das arithmetische Mittel, den Zentralwert (Median) und Kennzahlen einer Zahlenreihe.',
    searchKeywords: ['durchschnittsrechner', 'mittelwert berechnen', 'median rechner', 'notendurchschnitt rechner online'],
    inputs: [
      { id: 'numbers', label: 'Zahlen eingeben (mit Komma, Semikolon oder Leerzeichen getrennt)', type: 'number', defaultValue: 0, placeholder: 'z.B. 12; 25; 34; 18; 40', helpText: 'Geben Sie Ihre Zahlenfolge ein' },
    ],
    calculate: calculateAverage,
    formula: 'Mittelwert (x̄) = (x₁ + x₂ + ... + xₙ) / n',
    formulaExplanation: 'Die Summe aller Werte wird durch die Anzahl der Werte dividiert.',
    workedExample: {
      title: 'Beispiel: Zahlenreihe 10, 20, 30, 40, 50',
      description: 'Summe = 150. Geteilt durch 5 Werte = Durchschnitt 30.',
      inputs: { numbers: '10; 20; 30; 40; 50' },
      resultSummary: '30,00',
    },
    content: {
      intro: 'Berechnen Sie schnell und zuverlässig den Durchschnitt einer Zahlenreihe.',
      details: 'Zusätzlich zum gewöhnlichen arithmetischen Mittel zeigt Ihnen das Tool auch den Median.',
    },
    faqs: [
      { question: 'Wann ist der Median besser als das arithmetische Mittel?', answer: 'Der Median ist immer dann aussagekräftiger, wenn es extreme Ausreißer gibt – wie etwa beim Einkommen.' },
    ],
    relatedSlugs: ['dreisatzrechner', 'pythagoras-rechner'],
  },
  {
    id: 'pythagoras-rechner',
    slug: 'pythagoras-rechner',
    name: 'Satz-des-Pythagoras-Rechner (a² + b² = c²)',
    shortName: 'Pythagoras-Rechner',
    category: 'mathematik',
    subcategory: 'Zahlen & Algebra',
    metaTitle: 'Satz des Pythagoras Rechner – Hypotenuse & Katheten berechnen',
    metaDescription: 'Rechtwinklige Dreiecke berechnen: Hypotenuse c oder Kathete a/b nach a² + b² = c² online lösen. Inklusive Umfang und Flächeninhalt.',
    h1: 'Satz des Pythagoras Rechner (a² + b² = c²)',
    shortDescription: 'Berechnet die Hypotenuse oder fehlende Kathete im rechtwinkligen Dreieck.',
    searchKeywords: ['pythagoras rechner', 'satz des pythagoras online', 'hypotenuse berechnen', 'kathete berechnen a2 b2 c2'],
    inputs: [
      {
        id: 'target',
        label: 'Gesuchte Seite',
        type: 'select',
        defaultValue: 'c',
        options: [
          { value: 'c', label: 'Hypotenuse c (längste Seite gegenüber dem rechten Winkel)' },
          { value: 'a', label: 'Kathete a' },
          { value: 'b', label: 'Kathete b' },
        ],
      },
      { id: 'sideA', label: 'Seite a', type: 'number', defaultValue: 3, min: 0.01, step: 0.1 },
      { id: 'sideB', label: 'Seite b', type: 'number', defaultValue: 4, min: 0.01, step: 0.1 },
      { id: 'sideC', label: 'Seite c (Hypotenuse)', type: 'number', defaultValue: 5, min: 0.01, step: 0.1 },
    ],
    calculate: calculatePythagoras,
    formula: 'a² + b² = c²  =>  c = √(a² + b²)',
    formulaExplanation: 'In allen rechtwinkligen Dreiecken ist die Summe der Flächeninhalte der Kathetenquadrate gleich dem Flächeninhalt des Hypotenusenquadrats.',
    workedExample: {
      title: 'Beispiel: Katheten a = 3 cm und b = 4 cm',
      description: '3² + 4² = 9 + 16 = 25. √25 = 5 cm.',
      inputs: { target: 'c', sideA: 3, sideB: 4 },
      resultSummary: 'c = 5,000 cm',
    },
    content: {
      intro: 'Der Satz des Pythagoras gehört zu den berühmtesten Lehrsätzen der Mathematik. Er gilt für jedes rechtwinklige Dreieck.',
      details: 'Geben Sie einfach zwei bekannte Seitenlängen ein, und der Rechner ermittelt sofort die dritte Seite.',
    },
    faqs: [
      { question: 'Gilt der Satz des Pythagoras für alle Dreiecke?', answer: 'Nein, er gilt ausschließlich für rechtwinklige Dreiecke.' },
    ],
    relatedSlugs: ['dreieckrechner', 'quadratwurzel-rechner', 'dreisatzrechner'],
  },
  {
    id: 'ggt-rechner',
    slug: 'ggt-rechner',
    name: 'ggT-Rechner (Größter gemeinsamer Teiler)',
    shortName: 'ggT berechnen',
    category: 'mathematik',
    subcategory: 'Zahlen & Algebra',
    metaTitle: 'ggT Rechner – Größten gemeinsamen Teiler zweier Zahlen finden',
    metaDescription: 'Finden Sie den ggT zweier Zahlen nach dem euklidischen Algorithmus online. Schnell, präzise und mit kgV-Ausgabe.',
    h1: 'ggT Rechner – Größter gemeinsamer Teiler',
    shortDescription: 'Ermittelt den größten gemeinsamen Teiler (ggT) und das kleinste gemeinsame Vielfache (kgV).',
    searchKeywords: ['ggt rechner', 'größter gemeinsamer teiler', 'euklidischer algorithmus rechner', 'kgv und ggt'],
    inputs: [
      { id: 'num1', label: 'Erste Zahl (A)', type: 'number', defaultValue: 24, min: 1, step: 1 },
      { id: 'num2', label: 'Zweite Zahl (B)', type: 'number', defaultValue: 36, min: 1, step: 1 },
    ],
    calculate: calculateGcdLcm,
    formula: 'Euklidischer Algorithmus: ggT(a, b) = ggT(b, a mod b)',
    formulaExplanation: 'Der ggT ist die größte natürliche Zahl, durch die sich zwei gegebene Zahlen ohne Rest teilen lassen.',
    workedExample: {
      title: 'Beispiel: 24 und 36',
      description: 'Teiler von 24: 1, 2, 3, 4, 6, 8, 12, 24. Teiler von 36: 1, 2, 3, 4, 6, 9, 12, 18, 36. Der größte gemeinsame ist 12.',
      inputs: { num1: 24, num2: 36 },
      resultSummary: 'ggT = 12 (kgV = 72)',
    },
    content: {
      intro: 'Der größte gemeinsame Teiler (ggT) wird besonders beim Kürzen von Brüchen benötigt.',
      details: 'Unser Rechner ermittelt neben dem ggT zeitgleich auch das kleinste gemeinsame Vielfache (kgV).',
    },
    faqs: [
      { question: 'Was bedeutet es, wenn der ggT zweier Zahlen 1 ist?', answer: 'Zwei Zahlen, deren ggT gleich 1 ist, heißen teilerfremd.' },
    ],
    relatedSlugs: ['kgv-rechner', 'bruchrechner', 'durchschnittsrechner'],
  },
  {
    id: 'kgv-rechner',
    slug: 'kgv-rechner',
    name: 'kgV-Rechner (Kleinstes gemeinsames Vielfaches)',
    shortName: 'kgV berechnen',
    category: 'mathematik',
    subcategory: 'Zahlen & Algebra',
    metaTitle: 'kgV Rechner – Kleinstes gemeinsames Vielfaches online berechnen',
    metaDescription: 'Berechnen Sie das kgV zweier Zahlen online. Unverzichtbar für das Finden des Hauptnenners beim Bruchrechnen.',
    h1: 'kgV Rechner – Kleinstes gemeinsames Vielfaches',
    shortDescription: 'Findet das kleinste gemeinsame Vielfache (kgV) zweier ganzer Zahlen.',
    searchKeywords: ['kgv rechner', 'kleinstes gemeinsames vielfaches', 'hauptnenner finden rechner'],
    inputs: [
      { id: 'num1', label: 'Erste Zahl', type: 'number', defaultValue: 15, min: 1, step: 1 },
      { id: 'num2', label: 'Zweite Zahl', type: 'number', defaultValue: 20, min: 1, step: 1 },
    ],
    calculate: (inputs) => {
      const res = calculateGcdLcm(inputs);
      const lcmItem = res.secondary?.find((s) => s.id === 'lcm');
      return {
        primary: { id: 'kgv', label: 'Kleinstes gemeinsames Vielfaches (kgV)', value: lcmItem?.value || 0, formattedValue: String(lcmItem?.formattedValue || 0), highlight: true },
        secondary: [
          { id: 'gcd', label: 'Größter gemeinsamer Teiler (ggT)', value: res.primary.value, formattedValue: res.primary.formattedValue },
        ],
        summaryText: `Das kgV von ${inputs.num1} und ${inputs.num2} ist ${lcmItem?.formattedValue}.`,
      };
    },
    formula: 'kgV(a, b) = (a × b) / ggT(a, b)',
    formulaExplanation: 'Das Produkt beider Zahlen geteilt durch ihren größten gemeinsamen Teiler ergibt das kgV.',
    workedExample: {
      title: 'Beispiel: 15 und 20',
      description: 'Das kleinste gemeinsame Vielfache ist 60.',
      inputs: { num1: 15, num2: 20 },
      resultSummary: '60',
    },
    content: {
      intro: 'Das kleinste gemeinsame Vielfache (kgV) ist die Basis für das Finden des Hauptnenners beim Bruchrechnen.',
      details: 'Geben Sie zwei beliebige ganze Zahlen ein, um das kgV zu bestimmen.',
    },
    faqs: [
      { question: 'Wofür braucht man das kgV im Alltag?', answer: 'Typische Anwendung: Wenn zwei Buslinien im 15- und 20-Minuten-Takt fahren, treffen sie sich nach 60 Minuten wieder gemeinsam.' },
    ],
    relatedSlugs: ['ggt-rechner', 'bruchrechner', 'prozentrechner'],
  },
  {
    id: 'quadratwurzel-rechner',
    slug: 'quadratwurzel-rechner',
    name: 'Quadratwurzel & Wurzel-Rechner',
    shortName: 'Wurzelrechner',
    category: 'mathematik',
    subcategory: 'Zahlen & Algebra',
    metaTitle: 'Wurzelrechner – Quadratwurzel (√) und n-te Wurzel online ziehen',
    metaDescription: 'Berechnen Sie Quadratwurzeln, Kubikwurzeln und beliebige n-te Wurzeln aus Zahlen online mit hoher Präzision.',
    h1: 'Wurzelrechner – Quadratwurzel & n-te Wurzel',
    shortDescription: 'Zieht Quadratwurzeln und beliebige n-te Wurzeln aus Zahlen.',
    searchKeywords: ['wurzelrechner', 'quadratwurzel rechner', 'wurzel ziehen online', 'dritte wurzel berechnen'],
    inputs: [
      { id: 'value', label: 'Radikand (Zahl unter der Wurzel)', type: 'number', defaultValue: 144, step: 0.01 },
      { id: 'degree', label: 'Wurzelexponent (2 = Quadratwurzel, 3 = Kubikwurzel)', type: 'number', defaultValue: 2, min: 2, max: 10, step: 1 },
    ],
    calculate: calculateRoot,
    formula: 'x = ⁿ√a  =>  xⁿ = a',
    formulaExplanation: 'Die n-te Wurzel aus a ist die Zahl x, die potenziert mit n wieder a ergibt.',
    workedExample: {
      title: 'Beispiel: √144',
      description: '12 × 12 = 144, also ist die Quadratwurzel aus 144 genau 12.',
      inputs: { value: 144, degree: 2 },
      resultSummary: '12,0000',
    },
    content: {
      intro: 'Das Wurzelziehen ist die Umkehrung des Potenzierens.',
      details: 'Unser Wurzelrechner berechnet sowohl Quadratwurzeln als auch beliebige n-te Wurzeln.',
    },
    faqs: [
      { question: 'Kann man die Wurzel aus einer negativen Zahl ziehen?', answer: 'Im Bereich der reellen Zahlen können aus negativen Zahlen keine geraden Wurzeln gezogen werden.' },
    ],
    relatedSlugs: ['pythagoras-rechner', 'prozentrechner', 'dreisatzrechner'],
  },
];
