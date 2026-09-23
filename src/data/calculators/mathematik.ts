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
    metaTitle: 'Prozentrechner – Prozentwert, Prozentsatz & Grundwert',
    metaDescription: 'Kostenloser Online-Prozentrechner: Wie viel sind X % von Y? Prozentuale Veränderungen, Aufschläge und Rabatte schnell und einfach berechnen.',
    h1: 'Prozentrechner – Alle Prozentrechnungen auf einen Blick',
    shortDescription: 'Berechnet den Prozentwert, Prozentsatz, Grundwert und prozentuale Zu- oder Abnahmen.',
    searchKeywords: ['prozentrechner', 'wie viel prozent von', 'prozent berechnen', 'prozentrechnung formel', 'prozentwert berechnen'],
    inputs: [
      {
        id: 'calculationMode',
        label: 'Berechnungsart',
        type: 'select',
        defaultValue: 'partOf',
        options: [
          { value: 'partOf', label: 'Wie viel sind X % von Y? (Prozentwert berechnen)' },
          { value: 'increase', label: 'Grundwert um X % erhöhen (+ Aufschlag)' },
          { value: 'decrease', label: 'Grundwert um X % reduzieren (- Rabatt)' },
          { value: 'shareOf', label: 'X ist wie viel Prozent von Y? (Prozentsatz ermitteln)' },
        ],
      },
      { id: 'percent', label: 'Prozentsatz bzw. Wert (X)', type: 'number', defaultValue: 19, step: 0.1 },
      { id: 'base', label: 'Grundwert / Bezugsgröße (Y)', type: 'number', defaultValue: 250, step: 0.01 },
    ],
    calculate: calculatePercentage,
    formula: 'Prozentwert (W) = Grundwert (G) × (Prozentsatz (p) / 100)',
    formulaExplanation: 'Der Grundwert stellt das Ganze (100 %) dar. Multipliziert mit dem Hundertstel des Prozentsatzes ergibt sich der gesuchte Anteil (Prozentwert).',
    workedExample: {
      title: 'Beispiel: 19 % von 250 €',
      description: '250 € × (19 / 100) = 47,50 €.',
      inputs: { percent: 19, base: 250 },
      resultSummary: '47,50 € (Gesamtsumme: 297,50 €)',
    },
    content: {
      intro: 'Der Prozentwert (W) drückt den absoluten Teil eines Ganzen aus, bezogen auf einen Grundwert (G) von 100 Prozent.',
      details: 'Die Grundformel lautet W = G · (p / 100). Im Kopf lässt sich der Prozentwert oft zerlegen: 15 % von 240 € sind 10 % (24 €) plus 5 % (12 €), also 36 €.',
    },
    faqs: [
      { question: 'Wie rechnet man Prozente schnell im Kopf aus?', answer: 'Zerlegen Sie den Prozentsatz in einfache Teilbeträge wie 10 % (Komma um eine Stelle nach links verschieben), 1 % (zwei Stellen) oder 50 % (halbieren).' },
      { question: 'Was ist der Unterschied zwischen Prozentwert und Prozentsatz?', answer: 'Der Prozentsatz (p %) ist die relative Verhältniszahl mit dem Prozentzeichen, während der Prozentwert (W) die konkrete absolute Zahl in Euro, Kilogramm oder Einheiten darstellt.' },
    ],
    relatedSlugs: ['antiproportionaler-dreisatz-rechner', 'prozentualer-unterschied-rechner', 'prozentuale-veraenderung', 'grundwert-rechner', 'dreisatzrechner', 'bruchrechner'],
  },
  {
    id: 'prozentuale-veraenderung',
    slug: 'prozentuale-veraenderung',
    name: 'Prozentuale-Veränderung-Rechner',
    shortName: 'Prozentuale Steigerung',
    category: 'mathematik',
    subcategory: 'Prozentrechnung',
    metaTitle: 'Prozentuale Veränderung Rechner – Steigerung',
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
      intro: 'Die prozentuale Veränderung quantifiziert relative Zuwächse (Inflation, Gehaltssteigerungen) oder Rückgänge bezogen auf den ursprünglichen Ausgangswert.',
      details: 'Die Formel lautet ((Neu - Alt) / |Alt|) · 100. Eine Preiserhöhung von 100 € auf 125 € entspricht +25 %, die Rückkehr von 125 € auf 100 € ist jedoch ein Rückgang um 20 % (Basiseffekt).',
    },
    faqs: [
      { question: 'Warum sind +50 % und anschließende -50 % nicht wieder der Ausgangswert?', answer: 'Wegen des veränderten Grundwerts: Steigt ein Wert von 100 auf 150 (+50 %) und fällt danach um 50 %, verliert er 75 und landet bei 75, nicht bei 100.' },
      { question: 'Was bedeutet ein negatives Ergebnis bei der prozentualen Veränderung?', answer: 'Ein negatives Vorzeichen signalisiert einen prozentualen Rückgang bzw. Wertverlust gegenüber dem Vergleichszeitraum.' },
    ],
    relatedSlugs: ['prozentualer-unterschied-rechner', 'prozentrechner', 'grundwert-rechner', 'dreisatzrechner'],
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
    shortDescription: 'Ermittelt den 100%-Ausgangswert anhand von gegebenem Anteil und Prozentsatz mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
      intro: 'Die Grundwertberechnung rekonstruiert die 100-Prozent-Basis, wenn lediglich ein prozentualer Teilbetrag und dessen Prozentsatz bekannt sind.',
      details: 'Die Formel lautet G = W / (p / 100). Wenn beispielsweise 45 € Rabatt genau 15 % des ursprünglichen Verkaufspreises ausmachen, lag der Ausgangspreis bei 45 / 0,15 = 300 €.',
    },
    faqs: [
      { question: 'Wie berechnet man den Grundwert bei einem reduzierten Preis?', answer: 'Wurde ein Preis um 20 % auf 80 € reduziert, entsprechen die 80 € 80 % des Grundwerts. Der Grundwert lautet: 80 / 0,80 = 100 €.' },
      { question: 'Wie ermittelt man den Nettopreis aus dem Bruttopreis inklusive 19 % MwSt.?', answer: 'Teilen Sie den Bruttopreis durch 1,19 (den Faktor für 119 %), da der Nettopreis den 100-Prozent-Grundwert darstellt.' },
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
    shortDescription: 'Berechnet proportionale und antiproportionale Dreisatzaufgaben zuverlässig mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
      intro: 'Der Dreisatz löst Proportionen in drei Schritten: Ausgangsverhältnis erfassen, auf die Einheit 1 normieren und auf die gesuchte Zielmenge hochrechnen.',
      details: 'Beim proportionalen Dreisatz gilt "Je mehr, desto mehr" (Quotientengleichheit: B1/A1 = B2/A2). Beim antiproportionalen Dreisatz gilt "Je mehr, desto weniger" (Produktgleichheit: A1 · B1 = A2 · B2).',
    },
    faqs: [
      { question: 'Wann liegt ein antiproportionaler Dreisatz vor?', answer: 'Immer dann, wenn das Produkt konstant bleibt: Beispielsweise benötigen 4 Bauarbeiter 10 Tage für eine Mauer (40 Tagewerke); 8 Arbeiter schaffen dieselbe Arbeit in 5 Tagen.' },
      { question: 'Kann man den Dreisatz auch in einer einzigen Formel rechnen?', answer: 'Ja: Gesuchter Wert X = (B1 · A2) / A1 beim direkten Dreisatz. Dies entspricht dem Auflösen einer Verhältnisgleichung über Kreuz.' },
    ],
    relatedSlugs: ['antiproportionaler-dreisatz-rechner', 'prozentrechner', 'verhaeltnis-rechner'],
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
      intro: 'Verhältnisrechnungen (Proportionen A:B = C:D) bestimmen unbekannte Dimensionen in Grafikdesign, Modellbau, Mischungsverhältnissen und Seitenformaten.',
      details: 'Durch Kreuzmultiplikation gilt: Das Produkt der Außenglieder entspricht dem Produkt der Innenglieder (A · D = B · C). Aufgelöst nach der Unbekannten X ergibt sich X = (B · C) / A.',
    },
    faqs: [
      { question: 'Wie berechnet man Pixelmaße für das Seitenverhältnis 16:9?', answer: 'Bei gegebener Breite (z. B. 1920 px) rechnet man: Höhe = 1920 · (9 / 16) = 1080 Pixel (Full HD).' },
      { question: 'Wie skaliert man ein Mischungsverhältnis von 1:4 auf 500 ml Gesamtmenge?', answer: '1 Teil Wirkstoff plus 4 Teile Wasser ergeben 5 Teile insgesamt. Pro Teil: 500 ml / 5 = 100 ml Wirkstoff und 400 ml Wasser.' },
    ],
    relatedSlugs: ['dreisatzrechner', 'prozentrechner', 'prozentuale-veraenderung'],
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
      intro: 'Dieser Rechner führt die Grundrechenarten für Brüche durch, bestimmt den Hauptnenner (kgV) und kürzt das Endergebnis vollständig über den ggT.',
      details: 'Beim Addieren und Subtrahieren müssen Brüche zunächst auf einen gemeinsamen Nenner erweitert werden. Bei der Multiplikation gilt "Zähler mal Zähler, Nenner mal Nenner", bei der Division wird mit dem Kehrwert multipliziert.',
    },
    faqs: [
      { question: 'Wie findet man den kleinsten gemeinsamen Hauptnenner zweier Brüche?', answer: 'Der Hauptnenner ist das kleinste gemeinsame Vielfache (kgV) der beiden Nenner. Bei 1/4 und 1/6 ist das kgV(4, 6) = 12.' },
      { question: 'Warum wird bei der Division durch einen Bruch mit dem Kehrwert multipliziert?', answer: 'Weil das Teilen durch einen Bruchteil a/b logisch gleichbedeutend ist mit der Multiplikation mit dessen Umkehrwert b/a.' },
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
      intro: 'Die Dreiecksberechnung bestimmt Flächeninhalt, Umfang und Höhen beliebiger rechtwinkliger, gleichschenkliger oder unregelmäßiger Dreiecke.',
      details: 'Die fundamentale Flächenformel lautet A = (g · h) / 2. Bei rechtwinkligen Dreiecken dienen die beiden Katheten direkt als Grundseite und Höhe: A = (a · b) / 2.',
    },
    faqs: [
      { question: 'Wie berechnet man die Fläche eines Dreiecks ohne gegebene Höhe?', answer: 'Sind alle drei Seitenlängen a, b und c bekannt, liefert der Satz von Heron die Fläche: A = Wurzel aus [s · (s-a) · (s-b) · (s-c)], wobei s der halbe Umfang (a+b+c)/2 ist.' },
      { question: 'Welche Winkelsumme hat jedes ebene Dreieck?', answer: 'Die Summe aller drei Innenwinkel im euklidischen Dreieck beträgt ausnahmslos exakt 180 Grad (alpha + beta + gamma = 180°).' },
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
    metaTitle: 'Durchschnittsrechner – Mittelwert, Median & Summe',
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
      intro: 'Das arithmetische Mittel summiert alle Messwerte oder Noten und dividiert die Gesamtsumme durch die Anzahl der Stichproben.',
      details: 'Im Unterschied zum Median (Zentralwert) reagiert das arithmetische Mittel empfindlich auf extreme Ausreißer. Bei gewichteten Durchschnitten (z. B. Uniklausuren mit ECTS-Punkten) werden die Noten mit ihren Leistungspunkten multipliziert.',
    },
    faqs: [
      { question: 'Wann sollte man den Median statt des Durchschnitts verwenden?', answer: 'Bei stark verzerrten Verteilungen wie Gehältern oder Vermögen spiegelt der Median die typische Mitte besser wider, da Milliardäre den Durchschnitt künstlich verzerren.' },
      { question: 'Wie berechnet man einen gewichteten Notendurchschnitt?', answer: 'Multiplizieren Sie jede Note mit ihren ECTS-Punkten, summieren Sie diese Produkte und teilen Sie die Summe durch die Gesamtzahl aller ECTS-Punkte.' },
    ],
    relatedSlugs: ['ohmsches-gesetz-rechner', 'dreisatzrechner', 'pythagoras-rechner', 'geometrisches-mittel-rechner', 'harmonisches-mittel-rechner'],
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
    shortDescription: 'Berechnet die Hypotenuse oder fehlende Kathete im rechtwinkligen Dreieck mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
      intro: 'Der Satz des Pythagoras (a² + b² = c²) beschreibt die geometrische Flächenbeziehung an allen rechtwinkligen Dreiecken der euklidischen Geometrie.',
      details: 'Die Hypotenuse c (die dem rechten 90°-Winkel gegenüberliegende längste Seite) berechnet sich durch c = Wurzel(a² + b²). Zur Bestimmung einer Kathete gilt a = Wurzel(c² - b²).',
    },
    faqs: [
      { question: 'Was sind pythagoreische Tripel?', answer: 'Das sind ganzzahlige Seitenlängen, die den Satz exakt erfüllen. Das bekannteste Tripel ist 3, 4, 5 (denn 9 + 16 = 25), gefolgt von 5, 12, 13.' },
      { question: 'Gilt der Satz des Pythagoras auch bei schiefwinkligen Dreiecken?', answer: 'Nein, für allgemeine Dreiecke ohne rechten Winkel gilt der verallgemeinerte Kosinussatz: c² = a² + b² - 2ab · cos(gamma).' },
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
      intro: 'Der größte gemeinsame Teiler (ggT) zweier oder mehrerer ganzer Zahlen ist die größte natürliche Zahl, durch die sich alle Ausgangszahlen ohne Rest teilen lassen.',
      details: 'Der ggT wird historisch und rechnerisch am effizientesten über den Euklidischen Algorithmus (wiederholte Division mit Rest / Modulo) bestimmt und dient dem vollständigen Kürzen von Brüchen.',
    },
    faqs: [
      { question: 'Was bedeutet es, wenn der ggT zweier Zahlen 1 ist?', answer: 'Zwei Zahlen mit ggT = 1 nennt man teilerfremd oder koprim (z. B. 8 und 9 haben außer der 1 keinen gemeinsamen Teiler).' },
      { question: 'Wie funktioniert der Euklidische Algorithmus bei 48 und 18?', answer: '48 mod 18 = 12; 18 mod 12 = 6; 12 mod 6 = 0. Der letzte Rest ungleich 0 ist 6, also ist ggT(48, 18) = 6.' },
    ],
    relatedSlugs: ['kgv-rechner', 'bruchrechner', 'durchschnittsrechner', 'teiler-vielfache-rechner'],
  },
  {
    id: 'kgv-rechner',
    slug: 'kgv-rechner',
    name: 'kgV-Rechner (Kleinstes gemeinsames Vielfaches)',
    shortName: 'kgV berechnen',
    category: 'mathematik',
    subcategory: 'Zahlen & Algebra',
    metaTitle: 'kgV Rechner – Kleinstes gemeinsames Vielfaches',
    metaDescription: 'Berechnen Sie das kgV zweier Zahlen online. Unverzichtbar für das Finden des Hauptnenners beim Bruchrechnen.',
    h1: 'kgV Rechner – Kleinstes gemeinsames Vielfaches',
    shortDescription: 'Findet das kleinste gemeinsame Vielfache (kgV) zweier ganzer Zahlen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
      intro: 'Das kleinste gemeinsame Vielfache (kgV) ist die kleinste positive ganze Zahl, die ein ganzzahliges Vielfaches aller eingegebenen Zahlen darstellt.',
      details: 'Das kgV bildet den optimalen Hauptnenner beim Addieren ungleichnamiger Brüche und verknüpft sich mit dem ggT über den fundamentalen Zusammenhang: kgV(a, b) = (|a · b|) / ggT(a, b).',
    },
    faqs: [
      { question: 'Wie berechnet man das kgV über die Primfaktorzerlegung?', answer: 'Zerlegen Sie alle Zahlen in Primfaktoren und bilden Sie das Produkt aller vorkommenden Primfaktoren in ihrer jeweils höchsten auftretenden Potenz.' },
      { question: 'Wofür wird das kgV in der Praxis benötigt?', answer: 'Zur Taktzeitabstimmung in der Logistik, Ampelschaltungen, Zahnradübersetzungen und zur Bestimmung periodischer Wiederkehrtermine.' },
    ],
    relatedSlugs: ['ggt-rechner', 'bruchrechner', 'prozentrechner', 'teiler-vielfache-rechner'],
  },
  {
    id: 'quadratwurzel-rechner',
    slug: 'quadratwurzel-rechner',
    name: 'Quadratwurzel & Wurzel-Rechner',
    shortName: 'Wurzelrechner',
    category: 'mathematik',
    subcategory: 'Zahlen & Algebra',
    metaTitle: 'Wurzelrechner – Quadratwurzel und n-te Wurzel online ziehen',
    metaDescription: 'Berechnen Sie Quadratwurzeln, Kubikwurzeln und beliebige n-te Wurzeln aus Zahlen online mit hoher Präzision.',
    h1: 'Wurzelrechner – Quadratwurzel & n-te Wurzel',
    shortDescription: 'Zieht Quadratwurzeln und beliebige n-te Wurzeln aus Zahlen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
      intro: 'Die Quadratwurzel einer nicht-negativen Zahl x ist diejenige Zahl y ≥ 0, deren Quadrat (y · y) exakt x ergibt.',
      details: 'Wurzeln aus Nicht-Quadratzahlen (wie Wurzel aus 2 oder 3) sind irrationale Zahlen mit unendlich vielen, nicht-periodischen Nachkommastellen. Numerisch lässt sich die Wurzel über das babylonische Heron-Verfahren approximieren.',
    },
    faqs: [
      { question: 'Warum hat eine Quadratwurzel im Reellen keine negativen Ergebnisse?', answer: 'Die Wurzelfunktion ist auf den reellen Zahlen als Hauptwert definiert und liefert per Konvention immer das nicht-negative Ergebnis.' },
      { question: 'Wie zieht man eine Quadratwurzel im Kopf näherungsweise?', answer: 'Suchen Sie die nächste Quadratzahl. Für Wurzel(50): Die nächste Quadratzahl ist 49 (Wurzel 7). Näherung: 7 + (50 - 49) / (2 × 7) = 7 + 1/14 ≈ 7,07.' },
    ],
    relatedSlugs: ['pythagoras-rechner', 'prozentrechner', 'dreisatzrechner', 'kubikwurzel-rechner'],
  },
];
