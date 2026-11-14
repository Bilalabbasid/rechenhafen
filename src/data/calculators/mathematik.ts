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
  calculateTriangle,
} from '@/lib/calculators/mathematik';
import { formatNumber, formatPercent } from '@/lib/formatters';

const LENGTH_UNIT_OPTIONS = [
  { value: 'mm', label: 'Millimeter (mm)' },
  { value: 'cm', label: 'Zentimeter (cm)' },
  { value: 'dm', label: 'Dezimeter (dm)' },
  { value: 'm', label: 'Meter (m)' },
  { value: 'km', label: 'Kilometer (km)' },
];

/** Zeigt hinter einem Längenfeld die im Feld „Längeneinheit“ (id: unit) gewählte Einheit an. */
const withLengthUnit = (label: string) =>
  LENGTH_UNIT_OPTIONS.map((u) => ({ condition: { field: 'unit', value: u.value }, label, unit: u.value }));

export const MATHEMATIK_CALCULATORS: CalculatorDefinition[] = [
  {
    id: 'prozentrechner',
    slug: 'prozentrechner',
    name: 'Prozentrechner (Prozentwert, Prozentsatz & Grundwert)',
    shortName: 'Prozentrechner',
    category: 'mathematik',
    subcategory: 'Prozentrechnung',
    metaTitle: 'Prozentrechner: Prozent berechnen mit Formel & Rechenweg',
    metaDescription: 'Prozentrechner kostenlos: Prozentwert, Prozentsatz oder Grundwert berechnen und Aufschläge oder Rabatte zurückrechnen – mit Formel und Rechenweg.',
    h1: 'Prozentrechner – Prozent berechnen: Prozentwert, Prozentsatz und Grundwert',
    shortDescription: 'Löst jede Grundaufgabe der Prozentrechnung: Prozentwert, Prozentsatz oder Grundwert gesucht – dazu Aufschläge, Rabatte und der Ursprungswert vor einer Änderung.',
    searchKeywords: [
      'prozentrechner',
      'prozent berechnen',
      'prozentrechnung',
      'prozentwert berechnen',
      'prozentsatz berechnen',
      'grundwert berechnen',
      'grundwert rechner',
      'grundwert berechnen formel',
      '100 prozent berechnen',
      'wie viel prozent von',
      'wie viel prozent sind',
      'prozentrechnung formel',
      'ursprungspreis berechnen',
      'prozent aufschlag berechnen',
      'rabatt in prozent berechnen',
      'prozente berechnen',
      'prozent von berechnen',
      'prozent ausrechnen',
      'prozent rechnen',
      'prozentualen anteil berechnen',
      'prozentanteil berechnen',
    ],
    inputs: [
      {
        id: 'calculationMode',
        label: 'Was möchten Sie berechnen?',
        type: 'select',
        defaultValue: 'partOf',
        options: [
          { value: 'partOf', label: 'Prozentwert: Wie viel sind p % von G?' },
          { value: 'shareOf', label: 'Prozentsatz: W ist wie viel % von G?' },
          { value: 'baseOf', label: 'Grundwert: W sind p % von wie viel?' },
          { value: 'increase', label: 'Wert um p % erhöhen (Aufschlag)' },
          { value: 'decrease', label: 'Wert um p % verringern (Rabatt)' },
          { value: 'baseFromIncreased', label: 'Ursprungswert vor einer Erhöhung um p %' },
          { value: 'baseFromDecreased', label: 'Ursprungswert vor einem Rabatt von p %' },
        ],
      },
      {
        id: 'percent',
        label: 'Prozentsatz p',
        type: 'number',
        defaultValue: 20,
        step: 0.1,
        unit: '%',
        dependsOn: { field: 'calculationMode', value: ['partOf', 'baseOf', 'increase', 'decrease', 'baseFromIncreased', 'baseFromDecreased'] },
      },
      {
        id: 'base',
        label: 'Grundwert G (das Ganze, 100 %)',
        type: 'number',
        defaultValue: 250,
        step: 0.01,
        dependsOn: { field: 'calculationMode', value: ['partOf', 'shareOf', 'increase', 'decrease'] },
      },
      {
        id: 'part',
        label: 'Prozentwert W (der Anteil)',
        type: 'number',
        defaultValue: 50,
        step: 0.01,
        dependsOn: { field: 'calculationMode', value: ['shareOf', 'baseOf'] },
      },
      {
        id: 'finalValue',
        label: 'Wert nach der Änderung',
        type: 'number',
        defaultValue: 300,
        step: 0.01,
        helpText: 'Zum Beispiel der Bruttopreis nach Aufschlag oder der reduzierte Preis nach Rabatt.',
        dependsOn: { field: 'calculationMode', value: ['baseFromIncreased', 'baseFromDecreased'] },
      },
    ],
    calculate: calculatePercentage,
    formula: 'W = G · p / 100   |   p = W / G · 100   |   G = W · 100 / p',
    formulaExplanation: 'Der Grundwert G ist das Ganze (100 %), der Prozentwert W ein Teil davon und der Prozentsatz p gibt an, wie viele Hundertstel dieser Teil ausmacht. Kennen Sie zwei der drei Größen, liefert eine der drei Formeln die dritte.',
    workedExample: {
      title: 'Prozentwert: Wie viel sind 20 % von 250 €?',
      description: 'Gesucht ist der Prozentwert W. Grundwert und Prozentsatz sind bekannt.',
      inputs: { calculationMode: 'partOf', percent: 20, base: 250 },
      steps: ['W = G · p / 100', 'W = 250 € · 20 / 100', 'W = 5.000 / 100 = 50 €'],
      resultSummary: '20 % von 250 € sind 50 €.',
    },
    workedExamples: [
      {
        title: 'Prozentwert: Wie viel sind 20 % von 250 €?',
        description: 'Gesucht ist der Prozentwert W. Grundwert und Prozentsatz sind bekannt.',
        inputs: { calculationMode: 'partOf', percent: 20, base: 250 },
        steps: ['W = G · p / 100', 'W = 250 € · 20 / 100', 'W = 5.000 / 100 = 50 €'],
        resultSummary: '20 % von 250 € sind 50 €.',
      },
      {
        title: 'Prozentsatz: 18 von 24 Aufgaben richtig – wie viel Prozent sind das?',
        description: 'Eine Klassenarbeit hat 24 Aufgaben, 18 davon sind richtig gelöst. Gesucht ist der Prozentsatz p.',
        inputs: { calculationMode: 'shareOf', part: 18, base: 24 },
        steps: ['p = W / G · 100', 'p = 18 / 24 · 100', 'p = 0,75 · 100 = 75 %'],
        resultSummary: '18 von 24 Aufgaben sind 75 %.',
      },
      {
        title: 'Grundwert: 45 € Rabatt sind 15 % – wie teuer war der Artikel?',
        description: 'Der Rabatt (Prozentwert) und der Rabattsatz sind bekannt, gesucht ist der ursprüngliche Preis als Grundwert.',
        inputs: { calculationMode: 'baseOf', part: 45, percent: 15 },
        steps: ['G = W · 100 / p', 'G = 45 € · 100 / 15', 'G = 4.500 / 15 = 300 €'],
        resultSummary: 'Der Artikel kostete ursprünglich 300 €.',
      },
      {
        title: 'Rückwärts rechnen: Nach 20 % Rabatt kostet die Jacke 80 € – was war der alte Preis?',
        description: 'Nach dem Rabatt zahlen Sie noch 80 % des alten Preises. Der reduzierte Preis ist also nicht der Grundwert.',
        inputs: { calculationMode: 'baseFromDecreased', finalValue: 80, percent: 20 },
        steps: ['100 % − 20 % = 80 % des alten Preises', 'G = 80 € · 100 / 80', 'G = 100 €'],
        resultSummary: 'Die Jacke kostete vorher 100 €.',
      },
    ],
    content: {
      intro: 'Mit diesem Prozentrechner lösen Sie alle drei Grundaufgaben der Prozentrechnung: Sie können den Prozentwert, den Prozentsatz oder den Grundwert berechnen. Zusätzlich erhöhen oder senken Sie Werte um einen Prozentsatz und rechnen vom Preis nach Aufschlag oder Rabatt auf den Ursprungswert zurück. Wählen Sie oben aus, was gesucht ist – der Rechner zeigt nur die passenden Eingabefelder und den Rechenweg Schritt für Schritt.',
      sections: [
        {
          title: 'Grundwert, Prozentwert, Prozentsatz: die drei Größen',
          content:
            'Jede Prozentaufgabe dreht sich um dieselben drei Größen:\n\n' +
            '- **Grundwert G** – das Ganze, also 100 %. Beispiel: der ursprüngliche Preis von 250 €.\n' +
            '- **Prozentwert W** – der Anteil vom Ganzen. Beispiel: 50 € Rabatt.\n' +
            '- **Prozentsatz p** – wie viele Hundertstel der Anteil ausmacht. Beispiel: 20 %.\n\n' +
            '„Prozent“ heißt „von Hundert“: 20 % sind 20 Hundertstel, also 0,20. Wer bei einer Textaufgabe zuerst klärt, welche Zahl das Ganze ist, hat die halbe Aufgabe schon gelöst.',
        },
        {
          title: 'Die drei Formeln – und der Dreisatz als Eselsbrücke',
          content:
            'Alle Formeln folgen aus einer Grundgleichung: **W = G · p / 100**. Stellen Sie sie nach der gesuchten Größe um:\n\n' +
            '- Prozentwert: W = G · p / 100 → 20 % von 250 = 250 · 20 / 100 = 50\n' +
            '- Prozentsatz: p = W / G · 100 → 50 von 250 = 50 / 250 · 100 = 20 %\n' +
            '- Grundwert: G = W · 100 / p → 50 sind 20 % von 50 · 100 / 20 = 250\n\n' +
            'Wer Formeln nicht gern auswendig lernt, rechnet mit dem Dreisatz: Wenn 20 % genau 50 sind, ist 1 % gleich 50 / 20 = 2,5. Dann sind 100 % gleich 2,5 · 100 = 250. Diesen Weg zeigt der Rechner bei der Grundwert-Aufgabe mit an. Für andere Verhältnisaufgaben hilft der [Dreisatzrechner](/rechner/dreisatzrechner/).',
        },
        {
          title: 'Vorsicht bei Rabatt, Aufschlag und Mehrwertsteuer',
          content:
            'Der häufigste Fehler: vom falschen Grundwert ausgehen. Nach 20 % Rabatt zahlen Sie noch 80 % des alten Preises. Kostet die Jacke jetzt 80 €, war der alte Preis also 80 / 0,8 = 100 € – und nicht 80 € + 20 % = 96 €.\n\n' +
            'Genauso beim Aufschlag: Ein Bruttopreis von 119 € enthält 19 % Mehrwertsteuer auf den Nettopreis. Netto sind es 119 / 1,19 = 100 €, nicht 119 € − 19 % = 96,39 €. Für diese Rückrechnung gibt es die Modi „Ursprungswert vor einer Erhöhung“ und „Ursprungswert vor einem Rabatt“. Speziell für die Umsatzsteuer eignet sich der [MwSt-Rechner](/rechner/mwst-rechner/), für Preisnachlässe der [Rabattrechner](/rechner/rabattrechner/).\n\n' +
            'Wollen Sie wissen, um wie viel Prozent sich zwei Werte unterscheiden, nutzen Sie den [Rechner für den prozentualen Unterschied](/rechner/prozentualer-unterschied-rechner/). Für Tausendstel statt Hundertstel gibt es den [Promillerechner](/rechner/promillerechner/).',
        },
      ],
    },
    faqs: [
      {
        question: 'Wie rechnet man Prozent aus?',
        answer: 'Teilen Sie den Anteil durch das Ganze und multiplizieren Sie mit 100: p = W / G · 100. Sind zum Beispiel 30 von 120 Schülern krank, sind das 30 / 120 · 100 = 25 %. Wollen Sie umgekehrt wissen, wie viel 25 % von 120 sind, rechnen Sie 120 · 25 / 100 = 30.',
      },
      {
        question: 'Wie berechne ich den Prozentsatz?',
        answer: 'Teilen Sie den Prozentwert durch den Grundwert und nehmen Sie das Ergebnis mal 100: p = W / G · 100. Kostet ein Artikel 80 € und Sie sparen 12 €, beträgt der Rabatt 12 / 80 · 100 = 15 %. Im Rechner wählen Sie dafür „Prozentsatz“.',
      },
      {
        question: 'Wie berechnet man den Prozentwert?',
        answer: 'Multiplizieren Sie den Grundwert mit dem Prozentsatz und teilen Sie durch 100: W = G · p / 100. 19 % Mehrwertsteuer auf 250 € netto sind also 250 · 19 / 100 = 47,50 €. Im Rechner ist das der Modus „Prozentwert“.',
      },
      {
        question: 'Wie berechnet man den Grundwert?',
        answer: 'Der Grundwert ist das Ganze (100 %). Sie berechnen ihn mit G = W · 100 / p, also Prozentwert mal 100 geteilt durch den Prozentsatz. Sind 45 € genau 15 % eines Preises, beträgt der Preis 45 · 100 / 15 = 300 €.',
      },
      {
        question: 'Wie viel Prozent sind 30 von 120?',
        answer: '30 von 120 sind 25 %, denn 30 / 120 = 0,25 und 0,25 · 100 = 25. Im Rechner wählen Sie dafür „Prozentsatz“, tragen 30 als Prozentwert W und 120 als Grundwert G ein.',
      },
      {
        question: 'Wie rechne ich vom reduzierten Preis auf den ursprünglichen Preis zurück?',
        answer: 'Ziehen Sie den Rabatt von 100 % ab und teilen Sie den reduzierten Preis durch diesen Anteil. Bei 25 % Rabatt und einem Preis von 60 € rechnen Sie 60 / 0,75 = 80 €. Den Rabatt einfach wieder aufzuschlagen (60 € + 25 % = 75 €) ist falsch, weil sich die 25 % auf den alten Preis beziehen.',
      },
      {
        question: 'Wie kann man Prozente im Kopf rechnen?',
        answer: 'Zerlegen Sie den Prozentsatz in einfache Teile: 10 % bekommen Sie, indem Sie das Komma um eine Stelle nach links schieben, 1 % mit zwei Stellen, 50 % durch Halbieren. 15 % von 240 sind also 10 % (24) plus 5 % (12), zusammen 36.',
      },
      {
        question: 'Was ist der Unterschied zwischen Prozent und Prozentpunkten?',
        answer: 'Prozentpunkte beschreiben den Abstand zwischen zwei Prozentsätzen, Prozent die relative Veränderung. Steigt ein Zinssatz von 2 % auf 3 %, ist das ein Plus von einem Prozentpunkt, aber eine Steigerung um 50 %.',
      },
    ],
    relatedSlugs: ['prozentualer-unterschied-rechner', 'mwst-rechner', 'rabattrechner', 'dreisatzrechner', 'promillerechner', 'bruchrechner'],
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
      const a = inputs.a !== undefined && inputs.a !== '' ? parseFloat(inputs.a) : 16;
      const b = inputs.b !== undefined && inputs.b !== '' ? parseFloat(inputs.b) : 9;
      const c = inputs.c !== undefined && inputs.c !== '' ? parseFloat(inputs.c) : 1920;
      if (a === 0 || isNaN(a)) return { primary: { id: 'd', label: 'Wert X', value: 0, formattedValue: '0' }, error: 'A darf nicht 0 sein.' };
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
    metaTitle: 'Bruchrechner – Brüche plus, minus, mal & geteilt',
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
      const n1 = parseInt(inputs.num1 !== undefined && inputs.num1 !== '' ? inputs.num1 : '3', 10);
      const d1 = parseInt(inputs.den1 !== undefined && inputs.den1 !== '' ? inputs.den1 : '4', 10);
      const n2 = parseInt(inputs.num2 !== undefined && inputs.num2 !== '' ? inputs.num2 : '2', 10);
      const d2 = parseInt(inputs.den2 !== undefined && inputs.den2 !== '' ? inputs.den2 : '5', 10);
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
    relatedSlugs: ['ggt-rechner', 'kgv-rechner', 'prozentrechner', 'bruch-in-dezimal-rechner', 'dezimal-in-bruch-rechner'],
  },
  {
    id: 'dreieckrechner',
    slug: 'dreieckrechner',
    name: 'Dreieck-Rechner (Fläche, Umfang, Höhen & Winkel)',
    shortName: 'Dreieck berechnen',
    category: 'mathematik',
    subcategory: 'Zahlen & Algebra',
    metaTitle: 'Dreieck berechnen – Flächeninhalt, Umfang, Höhen & Winkel',
    metaDescription: 'Dreieck kostenlos berechnen: aus Grundseite und Höhe, drei Seiten (Heron) oder zwei Seiten und Winkel – mit Höhen, Winkeln, Radien und Rechenweg.',
    h1: 'Dreieck berechnen – Fläche, Umfang, Höhen und Winkel',
    shortDescription: 'Berechnet Flächeninhalt, Umfang, alle drei Höhen, die Winkel sowie Inkreis- und Umkreisradius – aus drei Seiten, aus Grundseite und Höhe oder aus zwei Seiten mit eingeschlossenem Winkel.',
    searchKeywords: [
      'dreieckrechner',
      'dreieck berechnen',
      'dreieck fläche berechnen',
      'flächeninhalt dreieck',
      'dreieck formel grundseite höhe',
      'höhe dreieck berechnen',
      'dreieck umfang berechnen',
      'heron formel',
      'dreieck 3 seiten berechnen',
      'dreieck winkel berechnen',
      'dreieck fläche zwei seiten und winkel',
      'inkreisradius dreieck berechnen',
      'umkreisradius dreieck',
      'dreiecksungleichung',
    ],
    inputs: [
      {
        id: 'given',
        label: 'Gegeben ist …',
        type: 'select',
        defaultValue: 'threeSides',
        options: [
          { value: 'threeSides', label: 'Drei Seiten a, b, c' },
          { value: 'baseHeight', label: 'Grundseite g und Höhe h' },
          { value: 'twoSidesAngle', label: 'Zwei Seiten a, b und der Winkel γ dazwischen' },
        ],
      },
      {
        id: 'sideA',
        label: 'Seite a',
        type: 'number',
        defaultValue: 6,
        min: 0,
        step: 0.1,
        unit: 'cm',
        conditionalLabels: withLengthUnit('Seite a'),
        dependsOn: { field: 'given', value: ['threeSides', 'twoSidesAngle'] },
      },
      {
        id: 'sideB',
        label: 'Seite b',
        type: 'number',
        defaultValue: 8,
        min: 0,
        step: 0.1,
        unit: 'cm',
        conditionalLabels: withLengthUnit('Seite b'),
        dependsOn: { field: 'given', value: ['threeSides', 'twoSidesAngle'] },
      },
      {
        id: 'sideC',
        label: 'Seite c',
        type: 'number',
        defaultValue: 10,
        min: 0,
        step: 0.1,
        unit: 'cm',
        conditionalLabels: withLengthUnit('Seite c'),
        dependsOn: { field: 'given', value: 'threeSides' },
      },
      {
        id: 'angleGamma',
        label: 'Winkel γ zwischen a und b',
        type: 'number',
        defaultValue: 90,
        min: 0,
        max: 180,
        step: 1,
        unit: '°',
        helpText: 'Der Winkel muss von den Seiten a und b eingeschlossen werden, also an der Ecke liegen, an der a und b zusammenstoßen.',
        dependsOn: { field: 'given', value: 'twoSidesAngle' },
      },
      {
        id: 'baseG',
        label: 'Grundseite g',
        type: 'number',
        defaultValue: 10,
        min: 0,
        step: 0.1,
        unit: 'cm',
        conditionalLabels: withLengthUnit('Grundseite g'),
        dependsOn: { field: 'given', value: 'baseHeight' },
      },
      {
        id: 'heightH',
        label: 'Höhe h (senkrecht auf g)',
        type: 'number',
        defaultValue: 6,
        min: 0,
        step: 0.1,
        unit: 'cm',
        conditionalLabels: withLengthUnit('Höhe h (senkrecht auf g)'),
        dependsOn: { field: 'given', value: 'baseHeight' },
      },
      {
        id: 'unit',
        label: 'Längeneinheit',
        type: 'select',
        defaultValue: 'cm',
        options: LENGTH_UNIT_OPTIONS,
      },
    ],
    calculate: calculateTriangle,
    formula: 'A = ½ · g · h   |   A = √(s · (s − a) · (s − b) · (s − c)) mit s = (a + b + c) / 2   |   A = ½ · a · b · sin γ',
    formulaExplanation: 'Welche Formel passt, hängt davon ab, was gegeben ist: Grundseite und Höhe, alle drei Seiten (Satz des Heron) oder zwei Seiten mit dem eingeschlossenen Winkel. Sind die drei Seiten bekannt, folgen die Höhen aus h = 2A / Seite und die Winkel aus dem Kosinussatz.',
    workedExample: {
      title: 'Drei Seiten: a = 6 cm, b = 8 cm, c = 10 cm',
      inputs: { given: 'threeSides', sideA: 6, sideB: 8, sideC: 10, unit: 'cm' },
      steps: [
        'Halber Umfang: s = (6 + 8 + 10) / 2 = 12 cm',
        'Heron: A = √(12 · 6 · 4 · 2) = √576 = 24 cm²',
        'Höhen: h_a = 48 / 6 = 8 cm, h_b = 48 / 8 = 6 cm, h_c = 48 / 10 = 4,8 cm',
        'Winkel: α ≈ 36,87°, β ≈ 53,13°, γ = 90°',
        'Inkreisradius = 24 / 12 = 2 cm, Umkreisradius = 480 / 96 = 5 cm',
      ],
      resultSummary: 'A = 24 cm², Umfang 24 cm, rechtwinklig mit dem rechten Winkel bei C',
    },
    workedExamples: [
      {
        title: 'Drei Seiten: a = 6 cm, b = 8 cm, c = 10 cm',
        description: 'Alle drei Seiten sind bekannt, eine Höhe nicht. Der Satz des Heron liefert die Fläche, daraus folgen Höhen, Winkel und Radien.',
        inputs: { given: 'threeSides', sideA: 6, sideB: 8, sideC: 10, unit: 'cm' },
        steps: [
          'Halber Umfang: s = (6 + 8 + 10) / 2 = 12 cm',
          'Heron: A = √(12 · (12 − 6) · (12 − 8) · (12 − 10)) = √(12 · 6 · 4 · 2) = √576 = 24 cm²',
          'Höhen: h_a = 2 · 24 / 6 = 8 cm, h_b = 2 · 24 / 8 = 6 cm, h_c = 2 · 24 / 10 = 4,8 cm',
          'Winkel mit dem Kosinussatz: α ≈ 36,87°, β ≈ 53,13°, γ = 90°',
          'Inkreisradius = A / s = 24 / 12 = 2 cm, Umkreisradius = a · b · c / (4A) = 480 / 96 = 5 cm',
        ],
        resultSummary: 'A = 24 cm², Umfang 24 cm, rechtwinklig mit dem rechten Winkel bei C',
      },
      {
        title: 'Grundseite und Höhe: g = 10 cm, h = 6 cm',
        description: 'Der Klassiker aus dem Unterricht: Grundseite und die senkrecht darauf stehende Höhe sind gegeben.',
        inputs: { given: 'baseHeight', baseG: 10, heightH: 6, unit: 'cm' },
        steps: ['A = ½ · g · h', 'A = ½ · 10 cm · 6 cm', 'A = 60 cm² / 2 = 30 cm²'],
        resultSummary: 'A = 30 cm². Wäre das Dreieck gleichschenklig, hätte jeder Schenkel √(5² + 6²) ≈ 7,81 cm.',
      },
      {
        title: 'Zwei Seiten und Winkel: a = 5 m, b = 7 m, γ = 60°',
        description: 'Ein dreieckiges Beet: Zwei Kanten sind gemessen, dazu der Winkel zwischen ihnen. Gesucht sind die dritte Seite und die Fläche.',
        inputs: { given: 'twoSidesAngle', sideA: 5, sideB: 7, angleGamma: 60, unit: 'm' },
        steps: [
          'Kosinussatz: c² = 5² + 7² − 2 · 5 · 7 · cos 60° = 25 + 49 − 35 = 39',
          'c = √39 ≈ 6,24 m',
          'Fläche: A = ½ · 5 · 7 · sin 60° ≈ 17,5 · 0,866 ≈ 15,16 m²',
        ],
        resultSummary: 'Dritte Seite c ≈ 6,24 m, Fläche ≈ 15,16 m², Umfang ≈ 18,24 m',
      },
    ],
    content: {
      intro: 'Mit diesem Dreieck-Rechner berechnen Sie jedes Dreieck aus den Angaben, die Sie gerade haben: aus drei Seiten, aus Grundseite und Höhe oder aus zwei Seiten mit dem Winkel dazwischen. Sind alle Seiten bekannt oder berechenbar, erhalten Sie neben Flächeninhalt und Umfang auch alle drei Höhen, die drei Winkel, Inkreis- und Umkreisradius und die Dreiecksart. Der Rechner prüft außerdem, ob es ein Dreieck mit Ihren Seitenlängen überhaupt geben kann.',
      sections: [
        {
          title: 'Drei Wege zur Dreiecksfläche',
          content:
            '**1. Grundseite und Höhe:** A = ½ · g · h. Jedes Dreieck ist genau halb so groß wie das Rechteck mit derselben Grundseite und Höhe. Bei g = 10 cm und h = 6 cm ergibt das 60 cm² / 2 = 30 cm².\n\n' +
            '**2. Drei Seiten (Satz des Heron):** Berechnen Sie zuerst den halben Umfang s = (a + b + c) / 2. Dann gilt A = √(s · (s − a) · (s − b) · (s − c)). Bei 6, 8 und 10 cm ist s = 12 und A = √(12 · 6 · 4 · 2) = √576 = 24 cm². Eine Höhe müssen Sie dafür nicht kennen.\n\n' +
            '**3. Zwei Seiten und der eingeschlossene Winkel:** A = ½ · a · b · sin γ. Die dritte Seite liefert der Kosinussatz: c² = a² + b² − 2ab · cos γ. Ist γ = 90°, wird daraus der Satz des Pythagoras – dafür gibt es auch den [Pythagoras-Rechner](/rechner/pythagoras-rechner/).',
        },
        {
          title: 'Höhen, Winkel, Inkreis und Umkreis aus den drei Seiten',
          content:
            'Kennen Sie die Fläche, bekommen Sie jede Höhe, indem Sie die Flächenformel umstellen: **h_a = 2A / a**, h_b = 2A / b, h_c = 2A / c. Die Höhe auf der längsten Seite ist immer die kürzeste.\n\n' +
            'Die Winkel berechnet der Rechner mit dem Kosinussatz, zum Beispiel cos α = (b² + c² − a²) / (2bc). Zur Kontrolle: Die drei Winkel ergeben zusammen immer 180°. Der größte Winkel liegt stets gegenüber der längsten Seite.\n\n' +
            'Der **Inkreisradius** ist A / s, der **Umkreisradius** ist a · b · c / (4A). Bei einem rechtwinkligen Dreieck ist der Umkreisradius genau die halbe Hypotenuse (Satz des Thales). Ob ein Dreieck spitz-, recht- oder stumpfwinklig ist, sehen Sie unter „Dreiecksart“. Möchten Sie Winkel ins Bogenmaß umrechnen, hilft der [Bogenmaß-Rechner](/rechner/bogenmass-grad-rechner/).',
        },
        {
          title: 'Typische Fehler – und wann es kein Dreieck gibt',
          content:
            '- **Dreiecksungleichung:** Die längste Seite muss kürzer sein als die beiden anderen zusammen. Mit 3 cm, 4 cm und 8 cm lässt sich kein Dreieck zeichnen, weil 3 + 4 = 7 kleiner als 8 ist. Der Rechner meldet das, statt eine falsche Fläche auszugeben.\n' +
            '- **Höhe ist nicht die schräge Seite:** Die Höhe steht immer senkrecht auf der Grundseite. Bei einem stumpfwinkligen Dreieck kann ihr Fußpunkt sogar außerhalb des Dreiecks auf der verlängerten Grundseite liegen.\n' +
            '- **Eingeschlossener Winkel:** Die Formel ½ · a · b · sin γ gilt nur für den Winkel zwischen a und b, nicht für einen der anderen Winkel.\n' +
            '- **Einheiten:** Alle Seiten müssen dieselbe Einheit haben. Die Fläche hat dann die Einheit zum Quadrat, also cm² statt cm.\n\n' +
            'Für Vierecke nutzen Sie den [Rechteck-Rechner](/rechner/rechteckrechner/), den [Trapez-Rechner](/rechner/trapez-flaeche-rechner/) oder den [Parallelogramm-Rechner](/rechner/parallelogramm-rechner/).',
        },
      ],
    },
    faqs: [
      {
        question: 'Wie berechnet man die Fläche eines Dreiecks?',
        answer: 'Am einfachsten mit A = ½ · Grundseite · Höhe. Die Höhe muss dabei senkrecht auf der Grundseite stehen. Bei einer Grundseite von 8 cm und einer Höhe von 5 cm ist die Fläche 8 · 5 / 2 = 20 cm².',
      },
      {
        question: 'Wie berechne ich die Fläche eines Dreiecks nur mit den drei Seiten?',
        answer: 'Mit dem Satz des Heron: Bilden Sie den halben Umfang s = (a + b + c) / 2 und rechnen Sie A = √(s · (s − a) · (s − b) · (s − c)). Für die Seiten 5, 5 und 6 cm ist s = 8 und A = √(8 · 3 · 3 · 2) = √144 = 12 cm².',
      },
      {
        question: 'Wie berechnet man die Höhe eines Dreiecks?',
        answer: 'Berechnen Sie zuerst die Fläche und stellen Sie dann A = ½ · c · h_c nach der Höhe um: h_c = 2A / c. Hat ein Dreieck 24 cm² Fläche und die Seite c = 10 cm, ist h_c = 48 / 10 = 4,8 cm. Sind nur die drei Seiten bekannt, bekommen Sie die Fläche über den Satz des Heron.',
      },
      {
        question: 'Wie erkenne ich, ob es ein Dreieck mit diesen Seiten gibt?',
        answer: 'Prüfen Sie die Dreiecksungleichung: Die beiden kürzeren Seiten müssen zusammen länger sein als die längste Seite. Bei 4, 5 und 10 cm klappt das nicht, denn 4 + 5 = 9 ist kleiner als 10. Sind beide Werte gleich groß, liegen alle Ecken auf einer Linie und die Fläche ist 0.',
      },
      {
        question: 'Wie berechnet man die Winkel eines Dreiecks aus drei Seiten?',
        answer: 'Mit dem Kosinussatz, zum Beispiel cos γ = (a² + b² − c²) / (2ab). Den Winkel liefert dann die Taste cos⁻¹ auf dem Taschenrechner. Den dritten Winkel erhalten Sie am schnellsten über die Winkelsumme: α + β + γ = 180°.',
      },
      {
        question: 'Wie erkenne ich, ob ein Dreieck rechtwinklig ist?',
        answer: 'Ein Dreieck ist genau dann rechtwinklig, wenn die Quadrate der beiden kürzeren Seiten zusammen das Quadrat der längsten Seite ergeben (a² + b² = c²). Bei 6, 8 und 10 cm gilt 36 + 64 = 100, also liegt ein rechter Winkel gegenüber der 10-cm-Seite.',
      },
    ],
    relatedSlugs: ['pythagoras-rechner', 'trapez-flaeche-rechner', 'parallelogramm-rechner', 'rechteckrechner', 'kreisrechner', 'bogenmass-grad-rechner'],
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
    relatedSlugs: ['ohmsches-gesetz-rechner', 'dreisatzrechner', 'pythagoras-rechner', 'geometrisches-mittel-rechner', 'harmonisches-mittel-rechner', 'dreieckrechner'],
  },
  {
    id: 'pythagoras-rechner',
    slug: 'pythagoras-rechner',
    name: 'Satz-des-Pythagoras-Rechner (a² + b² = c²)',
    shortName: 'Pythagoras-Rechner',
    category: 'mathematik',
    subcategory: 'Zahlen & Algebra',
    metaTitle: 'Satz des Pythagoras Rechner – Hypotenuse berechnen',
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
      intro: 'Der Satz des Pythagoras (a² + b² = c²) beschreibt die geometrische Flächenbeziehung an allen rechtwinkligen Dreiecken der euklidischen Geometrie.',
      details: 'Die Hypotenuse c (die dem rechten 90°-Winkel gegenüberliegende längste Seite) berechnet sich durch c = Wurzel(a² + b²). Zur Bestimmung einer Kathete gilt a = Wurzel(c² - b²).',
    },
    faqs: [
      { question: 'Was sind pythagoreische Tripel?', answer: 'Das sind ganzzahlige Seitenlängen, die den Satz exakt erfüllen. Das bekannteste Tripel ist 3, 4, 5 (denn 9 + 16 = 25), gefolgt von 5, 12, 13.' },
      { question: 'Gilt der Satz des Pythagoras auch bei schiefwinkligen Dreiecken?', answer: 'Nein, für allgemeine Dreiecke ohne rechten Winkel gilt der verallgemeinerte Kosinussatz: c² = a² + b² - 2ab · cos(gamma).' },
      { question: 'Wie berechnet man die Hypotenuse?', answer: 'Quadrieren Sie beide Katheten, addieren Sie die Quadrate und ziehen Sie die Wurzel: c = √(a² + b²). Bei a = 3 cm und b = 4 cm ist c = √(9 + 16) = √25 = 5 cm. Die Hypotenuse ist immer die längste Seite und liegt gegenüber dem rechten Winkel.' },
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
    metaTitle: 'ggT Rechner – Größten gemeinsamen Teiler finden',
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
    name: 'Quadratwurzel-Rechner (auch n-te Wurzel)',
    shortName: 'Wurzelrechner',
    category: 'mathematik',
    subcategory: 'Zahlen & Algebra',
    metaTitle: 'Quadratwurzel Rechner – Wurzel ziehen, auch n-te Wurzel',
    metaDescription: 'Quadratwurzel kostenlos berechnen: Wurzel ziehen mit Rechenweg, Probe und vereinfachter Wurzel (√72 = 6·√2) – auf Wunsch auch jede n-te Wurzel.',
    h1: 'Quadratwurzel berechnen – Wurzel ziehen mit Rechenweg',
    shortDescription: 'Zieht die Quadratwurzel aus jeder Zahl, zeigt Probe, Einschachtelung und teilweises Wurzelziehen und berechnet über den Wurzelexponenten n auch die 4., 5. oder jede andere Wurzel.',
    searchKeywords: [
      'quadratwurzel rechner',
      'quadratwurzel berechnen',
      'wurzel ziehen',
      'wurzelrechner',
      'wurzel berechnen',
      'wurzel ziehen online',
      'n-te wurzel',
      'n-te wurzel rechner',
      'nte wurzel berechnen',
      '4 wurzel berechnen',
      'wurzel vereinfachen',
      'teilweise wurzel ziehen',
      'wurzel aus negativer zahl',
    ],
    inputs: [
      { id: 'value', label: 'Zahl unter der Wurzel (Radikand)', type: 'number', defaultValue: 144, step: 1 },
      {
        id: 'degree',
        label: 'Wurzelexponent n (2 = Quadratwurzel)',
        type: 'number',
        defaultValue: 2,
        min: 1,
        max: 100,
        step: 1,
        helpText: 'Lassen Sie n = 2 für die Quadratwurzel. Für die 4. Wurzel tragen Sie 4 ein, für die 5. Wurzel 5 usw.',
      },
    ],
    calculate: calculateRoot,
    formula: '√a = y  ⇔  y² = a (y ≥ 0)   |   ⁿ√a = a^(1/n)',
    formulaExplanation: 'Die Quadratwurzel aus a ist die nicht-negative Zahl, die mit sich selbst multipliziert a ergibt. Allgemein ist die n-te Wurzel aus a die Zahl, die n-mal mit sich selbst multipliziert wieder a ergibt – das entspricht der Potenz a hoch 1/n.',
    workedExample: {
      title: 'Quadratwurzel aus 144',
      inputs: { value: 144, degree: 2 },
      steps: ['Gesucht ist y mit y² = 144.', '12 · 12 = 144', 'Also ist √144 = 12.'],
      resultSummary: '√144 = 12 (exakt)',
    },
    workedExamples: [
      {
        title: 'Quadratwurzel aus 144',
        description: '144 ist eine Quadratzahl, die Wurzel geht also glatt auf.',
        inputs: { value: 144, degree: 2 },
        steps: ['Gesucht ist y mit y² = 144.', '12 · 12 = 144', 'Also ist √144 = 12.'],
        resultSummary: '√144 = 12 (exakt)',
      },
      {
        title: 'Quadratwurzel aus 50 – einschachteln und vereinfachen',
        description: '50 ist keine Quadratzahl. Das Ergebnis ist eine irrationale Zahl mit unendlich vielen Nachkommastellen.',
        inputs: { value: 50, degree: 2 },
        steps: [
          'Einschachteln: 7² = 49 < 50 < 64 = 8², also liegt √50 zwischen 7 und 8.',
          'Teilweise Wurzelziehen: 50 = 25 · 2, also √50 = √25 · √2 = 5 · √2.',
          'Gerundet: √50 ≈ 7,071068',
        ],
        resultSummary: '√50 = 5 · √2 ≈ 7,0711',
      },
      {
        title: '4. Wurzel aus 81',
        description: 'Mit dem Wurzelexponenten n = 4 wird die Zahl gesucht, die viermal mit sich selbst multipliziert 81 ergibt.',
        inputs: { value: 81, degree: 4 },
        steps: ['Gesucht ist y mit y⁴ = 81.', '3 · 3 · 3 · 3 = 81', 'Also ist ⁴√81 = 3. Zur Kontrolle: √(√81) = √9 = 3.'],
        resultSummary: '⁴√81 = 3',
      },
      {
        title: '5. Wurzel aus −32',
        description: 'Bei ungeradem Wurzelexponenten darf die Zahl unter der Wurzel negativ sein.',
        inputs: { value: -32, degree: 5 },
        steps: ['2⁵ = 32, also ist (−2)⁵ = −32.', 'Damit gilt ⁵√(−32) = −2.'],
        resultSummary: '⁵√(−32) = −2',
      },
    ],
    content: {
      intro: 'Mit diesem Quadratwurzel-Rechner ziehen Sie die Wurzel aus jeder Zahl. Neben dem Ergebnis sehen Sie die Probe, zwischen welchen ganzen Zahlen die Wurzel liegt und – wo möglich – die vereinfachte Form wie √72 = 6 · √2. Über das Feld „Wurzelexponent n“ berechnen Sie auch die 4., 5. oder jede andere n-te Wurzel. Lassen Sie n auf 2, erhalten Sie die gewöhnliche Quadratwurzel.',
      sections: [
        {
          title: 'Was bedeutet Wurzelziehen?',
          content:
            'Wurzelziehen ist die Umkehrung des Quadrierens. Die Quadratwurzel aus 49 ist 7, weil 7 · 7 = 49. Die Zahl unter dem Wurzelzeichen heißt **Radikand**.\n\n' +
            'Obwohl auch (−7)² = 49 ist, liefert √49 immer nur die positive Lösung 7. Löst man dagegen die Gleichung x² = 49, gibt es zwei Lösungen: x = 7 und x = −7.\n\n' +
            'Allgemein ist die n-te Wurzel aus a die Zahl, die hoch n wieder a ergibt. In Potenzschreibweise ist ⁿ√a = a^(1/n), die Quadratwurzel also a^(1/2). So rechnen Sie Wurzeln auch auf Taschenrechnern ohne eigene Wurzeltaste aus.',
        },
        {
          title: 'Wurzeln ohne Taschenrechner: einschachteln und vereinfachen',
          content:
            '**Einschachteln:** Suchen Sie die Quadratzahlen direkt unter und über dem Radikanden. Für √50 sind das 49 = 7² und 64 = 8². Also liegt √50 zwischen 7 und 8, und zwar knapp über 7.\n\n' +
            '**Teilweise Wurzelziehen:** Zerlegen Sie den Radikanden in eine Quadratzahl mal einen Rest. 72 = 36 · 2, also √72 = √36 · √2 = 6 · √2. In der Schule wird diese vereinfachte Form oft als exaktes Ergebnis verlangt.\n\n' +
            '**Faustformel:** √a ≈ q + (a − q²) / (2q), wobei q² die nächstkleinere Quadratzahl ist. Für √50: 7 + 1 / 14 ≈ 7,07 – schon auf zwei Nachkommastellen genau.',
        },
        {
          title: 'n-te Wurzeln und negative Zahlen',
          content:
            'Aus einer negativen Zahl gibt es keine reelle Quadratwurzel, denn jede reelle Zahl zum Quadrat ist positiv oder 0. Dasselbe gilt für alle geraden Wurzelexponenten (4, 6, 8 …). Der Rechner meldet in diesem Fall einen Fehler und nennt bei der Quadratwurzel die komplexe Lösung.\n\n' +
            'Bei ungeraden Exponenten (3, 5, 7 …) ist das anders: ⁵√(−32) = −2, weil (−2)⁵ = −32. Für die dritte Wurzel, etwa für die Kantenlänge eines Würfels, gibt es den eigenen [Kubikwurzel-Rechner](/rechner/kubikwurzel-rechner/).\n\n' +
            'Wurzeln brauchen Sie zum Beispiel beim [Satz des Pythagoras](/rechner/pythagoras-rechner/) (c = √(a² + b²)) oder beim [Dreieck-Rechner](/rechner/dreieckrechner/) mit der Heron-Formel. Sehr große oder kleine Zahlen schreiben Sie übersichtlich mit dem [Zehnerpotenzen-Rechner](/rechner/zehnerpotenzen-rechner/).',
        },
      ],
    },
    faqs: [
      {
        question: 'Wie zieht man die Wurzel aus einer Zahl?',
        answer: 'Sie suchen die Zahl, die mit sich selbst multipliziert die gegebene Zahl ergibt: √81 = 9, weil 9 · 9 = 81. Geht die Wurzel nicht glatt auf, schachteln Sie sie zwischen zwei Quadratzahlen ein oder nutzen den Rechner, der das Ergebnis auf 6 Nachkommastellen rundet.',
      },
      {
        question: 'Kann man die Wurzel aus einer negativen Zahl ziehen?',
        answer: 'Eine Quadratwurzel aus einer negativen Zahl gibt es bei den reellen Zahlen nicht, weil jedes Quadrat positiv oder 0 ist. Erst mit den komplexen Zahlen gilt zum Beispiel √(−9) = 3i. Bei ungeraden Wurzeln wie der 3. oder 5. Wurzel ist ein negativer Radikand dagegen erlaubt: ⁵√(−32) = −2.',
      },
      {
        question: 'Wie vereinfacht man eine Wurzel, zum Beispiel √72?',
        answer: 'Zerlegen Sie die Zahl in die größte Quadratzahl mal einen Rest: 72 = 36 · 2. Die Wurzel aus der Quadratzahl ziehen Sie vor die Wurzel: √72 = √36 · √2 = 6 · √2. Der Rechner zeigt diese Form unter „Vereinfachte Wurzel“ an.',
      },
      {
        question: 'Wie berechnet man die n-te Wurzel, zum Beispiel die 4. Wurzel?',
        answer: 'Tragen Sie im Rechner den Wurzelexponenten n = 4 ein. Von Hand rechnen Sie a hoch 1/4, also 16^(1/4) = 2, denn 2 · 2 · 2 · 2 = 16. Die 4. Wurzel ist außerdem die Wurzel aus der Wurzel: √(√16) = √4 = 2.',
      },
      {
        question: 'Warum hat √2 unendlich viele Nachkommastellen?',
        answer: 'Die Wurzel aus einer natürlichen Zahl, die keine Quadratzahl ist, ist immer irrational. Sie lässt sich nicht als Bruch schreiben, deshalb enden und wiederholen sich ihre Nachkommastellen nie. Jeder Taschenrechner zeigt daher nur einen gerundeten Wert wie √2 ≈ 1,414214.',
      },
    ],
    relatedSlugs: ['kubikwurzel-rechner', 'pythagoras-rechner', 'zehnerpotenzen-rechner', 'dreieckrechner', 'bruchrechner'],
  },
];
