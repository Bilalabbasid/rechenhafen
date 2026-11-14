import { CalculatorDefinition } from '@/types/calculator';
import { calculatePfaendung, calculateSplittingvorteil, pfaendungsFreibetrag, PFAENDUNGSFREIGRENZEN } from '@/lib/calculators/steuerRecht';
import { formatCurrency } from '@/lib/formatters';

const P = PFAENDUNGSFREIGRENZEN['2026'];
const eur = (n: number) => formatCurrency(n);

// Beispiele werden mit derselben Funktion berechnet wie das Ergebnis im Rechner.
const pf0 = calculatePfaendung({ netIncome: 2000, dependents: 0, period: '2026' });
const pf1 = calculatePfaendung({ netIncome: 2500, dependents: 1, period: '2026' });
const sp = calculateSplittingvorteil({ incomeA: 60000, incomeB: 20000, taxYear: '2026' });
const spOne = calculateSplittingvorteil({ incomeA: 60000, incomeB: 0, taxYear: '2026' });
const spEqual = calculateSplittingvorteil({ incomeA: 40000, incomeB: 40000, taxYear: '2026' });

export const STEUER_RECHT_CALCULATORS: CalculatorDefinition[] = [
  {
    id: 'pfaendungsrechner',
    slug: 'pfaendungsrechner',
    name: 'Pfändungsrechner (Pfändungstabelle 2026)',
    shortName: 'Pfändungsrechner',
    category: 'kredit-schulden',
    subcategory: 'Schulden & Pfändung',
    metaTitle: 'Pfändungsrechner 2026 – Pfändungstabelle ab 1. Juli 2026',
    metaDescription: `Pfändungsrechner 2026: Wie viel vom Nettolohn ist pfändbar? Mit den neuen Pfändungsfreigrenzen ab 1. Juli 2026 (${eur(P.grundbetrag)} Grundbetrag) und Unterhaltspflichten.`,
    h1: 'Pfändungsrechner 2026: Wie viel vom Lohn ist pfändbar?',
    shortDescription: 'Berechnet nach § 850c ZPO, wie viel vom monatlichen Nettoeinkommen gepfändet werden darf – mit den Freigrenzen ab 1. Juli 2026.',
    searchKeywords: [
      'pfändungsrechner',
      'pfändungstabelle 2026',
      'pfändungsfreigrenze 2026',
      'pfändungstabelle',
      'lohnpfändung berechnen',
      'pfändbarer betrag berechnen',
      'pfändungsfreibetrag',
      'pfändungsfreigrenze',
      'wie viel darf gepfändet werden',
    ],
    inputs: [
      { id: 'netIncome', label: 'Monatliches Nettoeinkommen', type: 'number', defaultValue: 2000, min: 0, max: 100000, step: 10, unit: '€', helpText: 'Nettolohn nach Steuern und Sozialabgaben, wie er auf der Gehaltsabrechnung steht.' },
      { id: 'dependents', label: 'Unterhaltspflichten (Personen)', type: 'number', defaultValue: 0, min: 0, max: 5, step: 1, helpText: 'Personen, denen Sie tatsächlich Unterhalt zahlen, z. B. Kinder oder Ehepartner. Ab fünf Personen steigt der Freibetrag nicht weiter.' },
      {
        id: 'period',
        label: 'Gültigkeitszeitraum',
        type: 'select',
        defaultValue: '2026',
        options: [
          { value: '2026', label: 'Ab 1. Juli 2026 (aktuell)' },
          { value: '2025', label: '1. Juli 2025 bis 30. Juni 2026' },
        ],
      },
    ],
    calculate: calculatePfaendung,
    formula: 'Pfändbar = (Netto, auf volle 10 € abgerundet − Freigrenze) × Anteil   |   Anteil: 70 % ohne, 50 % bei 1, 40 % bei 2, 30 % bei 3, 20 % bei 4, 10 % ab 5 Unterhaltspflichten',
    formulaExplanation: `Bis zur Pfändungsfreigrenze ist das Einkommen geschützt. Vom Betrag darüber ist nur ein Teil pfändbar, der mit jeder Unterhaltspflicht sinkt (§ 850c Abs. 3 ZPO). Das Nettoeinkommen wird vorher auf volle 10 € abgerundet. Einkommen über ${eur(P.vollPfaendbarAb)} ist voll pfändbar.`,
    workedExample: {
      title: 'Beispiel: 2.000 € netto, keine Unterhaltspflicht',
      description: `Freigrenze ${eur(P.grundbetrag)}. (2.000 € − ${eur(P.grundbetrag)}) × 70 % = ${pf0.primary.formattedValue}.`,
      inputs: { netIncome: 2000, dependents: 0, period: '2026' },
      resultSummary: `${pf0.primary.formattedValue} pfändbar`,
    },
    workedExamples: [
      {
        title: '2.000 € netto, keine Unterhaltspflicht',
        description: 'Ein alleinstehender Arbeitnehmer ohne Unterhaltspflichten.',
        inputs: { netIncome: 2000, dependents: 0, period: '2026' },
        steps: [`Freigrenze: ${eur(P.grundbetrag)}`, `Mehrbetrag: 2.000 € − ${eur(P.grundbetrag)} = ${eur(2000 - P.grundbetrag)}`, `Pfändbar: 70 % davon = ${pf0.primary.formattedValue}`],
        resultSummary: `${pf0.primary.formattedValue} pfändbar, ${eur(2000 - Number(pf0.primary.value))} bleiben.`,
      },
      {
        title: '2.500 € netto, ein Kind',
        description: 'Ein Elternteil zahlt Unterhalt für ein Kind.',
        inputs: { netIncome: 2500, dependents: 1, period: '2026' },
        steps: [
          `Freigrenze: ${eur(P.grundbetrag)} + ${eur(P.ersteUnterhaltspflicht)} = ${eur(pfaendungsFreibetrag('2026', 1))}`,
          `Mehrbetrag: 2.500 € − ${eur(pfaendungsFreibetrag('2026', 1))} = ${eur(2500 - pfaendungsFreibetrag('2026', 1))}`,
          `Pfändbar: 50 % davon = ${pf1.primary.formattedValue}`,
        ],
        resultSummary: `${pf1.primary.formattedValue} pfändbar, ${eur(2500 - Number(pf1.primary.value))} bleiben.`,
      },
    ],
    content: {
      intro: 'Wird Ihr Lohn gepfändet, darf der Gläubiger nicht alles bekommen. Ein Teil Ihres Nettoeinkommens ist nach § 850c ZPO unpfändbar, damit Sie und Ihre Familie davon leben können. Dieser Pfändungsrechner zeigt, welcher Betrag pfändbar ist und wie viel Ihnen bleibt – mit den Pfändungsfreigrenzen, die seit dem 1. Juli 2026 gelten.',
      sections: [
        {
          title: 'Pfändungsfreigrenzen ab 1. Juli 2026',
          content:
            `- **Grundbetrag ohne Unterhaltspflicht:** ${eur(P.grundbetrag)} im Monat (vorher ${eur(PFAENDUNGSFREIGRENZEN['2025'].grundbetrag)})\n` +
            `- **Erste unterhaltsberechtigte Person:** + ${eur(P.ersteUnterhaltspflicht)}\n` +
            `- **Zweite bis fünfte Person:** je + ${eur(P.weitereUnterhaltspflicht)}\n` +
            `- **Voll pfändbar:** Einkommen über ${eur(P.vollPfaendbarAb)} im Monat\n\n` +
            'Die Beträge werden jedes Jahr zum 1. Juli an die Entwicklung des steuerlichen Grundfreibetrags angepasst und im Bundesgesetzblatt bekannt gemacht.',
        },
        {
          title: 'Freigrenze nach Zahl der Unterhaltspflichten',
          content: [0, 1, 2, 3, 4, 5]
            .map((n) => `- ${n === 5 ? '5 und mehr' : n} Unterhaltspflicht${n === 1 ? '' : 'en'}: ${eur(pfaendungsFreibetrag('2026', n))} frei, vom Mehrbetrag ${[70, 50, 40, 30, 20, 10][n]} % pfändbar`)
            .join('\n'),
        },
        {
          title: 'Lohnpfändung und P-Konto sind zwei verschiedene Dinge',
          content:
            'Dieser Rechner betrifft die Pfändung beim Arbeitgeber (Lohnpfändung). Wird dagegen Ihr Girokonto gepfändet, schützt ein Pfändungsschutzkonto (P-Konto) nach § 899 ZPO einen monatlichen Sockelbetrag. Für Unterhaltsschulden und Schulden aus vorsätzlich begangenen unerlaubten Handlungen gelten strengere Regeln (§ 850d und § 850f ZPO); dort legt das Vollstreckungsgericht den Freibetrag fest.',
        },
      ],
    },
    faqs: [
      { question: 'Wie hoch ist die Pfändungsfreigrenze 2026?', answer: `Seit dem 1. Juli 2026 sind ${eur(P.grundbetrag)} netto im Monat unpfändbar, wenn Sie niemandem Unterhalt zahlen. Für die erste unterhaltsberechtigte Person kommen ${eur(P.ersteUnterhaltspflicht)} dazu, für die zweite bis fünfte je ${eur(P.weitereUnterhaltspflicht)}. Bis zum 30. Juni 2026 lag der Grundbetrag bei ${eur(PFAENDUNGSFREIGRENZEN['2025'].grundbetrag)}.` },
      { question: 'Wie viel darf von 2.000 € netto gepfändet werden?', answer: `Ohne Unterhaltspflicht sind ab Juli 2026 ${pf0.primary.formattedValue} pfändbar, denn vom Betrag über der Freigrenze von ${eur(P.grundbetrag)} dürfen 70 % gepfändet werden. Mit einer Unterhaltspflicht liegt die Freigrenze bei ${eur(pfaendungsFreibetrag('2026', 1))}, dann ist von 2.000 € nichts pfändbar.` },
      { question: 'Wer zählt als Unterhaltspflicht?', answer: 'Personen, denen Sie aufgrund einer gesetzlichen Pflicht tatsächlich Unterhalt leisten: Kinder, der Ehe- oder Lebenspartner, frühere Ehepartner oder ein Elternteil nach § 1615l BGB. Hat die Person eigenes Einkommen, kann das Gericht sie auf Antrag des Gläubigers ganz oder teilweise unberücksichtigt lassen.' },
      { question: 'Warum wird das Einkommen auf 10 € abgerundet?', answer: 'So schreibt es § 850c ZPO vor; die amtliche Pfändungstabelle arbeitet deshalb in 10-€-Schritten. Ein Nettolohn von 2.009,99 € wird wie 2.000 € behandelt.' },
      { question: 'Gilt die Pfändungstabelle auch für mein Konto?', answer: 'Nicht direkt. Auf dem Girokonto schützt das Pfändungsschutzkonto (P-Konto) einen monatlichen Grundfreibetrag. Ihre Bank wandelt ein bestehendes Konto auf Antrag kostenlos in ein P-Konto um.' },
      { question: 'Ist das Ergebnis verbindlich?', answer: 'Nein. Der Rechner zeigt den Regelfall nach § 850c ZPO. Den genauen Betrag ermittelt Ihr Arbeitgeber als Drittschuldner. Bei Unterhaltspfändungen, Sonderzahlungen oder Anträgen auf Erhöhung des Freibetrags (§ 850f ZPO) kann er abweichen. Eine Schuldnerberatung hilft kostenlos weiter.' },
    ],
    relatedSlugs: ['brutto-netto-rechner', 'ratenkreditrechner', 'dispozins-rechner', 'kinderzuschlag-kiz-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: '§ 850c ZPO i. V. m. Pfändungsfreigrenzenbekanntmachung 2026 (gültig ab 1. Juli 2026)',
      sourceUrl: 'https://www.gesetze-im-internet.de/zpo/__850c.html',
      lastVerified: '2026-11-14',
    },
    disclaimerType: 'recht',
    legalBasis: [{ label: '§ 850c ZPO', url: 'https://www.gesetze-im-internet.de/zpo/__850c.html' }],
  },
  {
    id: 'ehegattensplitting-rechner',
    slug: 'ehegattensplitting-rechner',
    name: 'Ehegattensplitting-Rechner (Splittingvorteil 2026)',
    shortName: 'Ehegattensplitting',
    category: 'steuern-gehalt',
    subcategory: 'Einkommensteuer',
    metaTitle: 'Ehegattensplitting-Rechner 2026 – Splittingvorteil berechnen',
    metaDescription: 'Ehegattensplitting-Rechner 2026: Wie viel Steuern sparen Ehepaare durch die Zusammenveranlagung? Splittingtarif gegen Einzelveranlagung, mit Soli.',
    h1: 'Ehegattensplitting-Rechner 2026: So viel Steuern spart die Zusammenveranlagung',
    shortDescription: 'Vergleicht die Einkommensteuer von Ehepaaren mit Splittingtarif und Einzelveranlagung und zeigt den Splittingvorteil.',
    searchKeywords: [
      'ehegattensplitting rechner',
      'ehegattensplitting',
      'splittingvorteil berechnen',
      'splittingtabelle 2026',
      'splittingtarif',
      'steuervorteil ehe',
      'zusammenveranlagung rechner',
      'heiraten steuern sparen',
    ],
    inputs: [
      { id: 'incomeA', label: 'Zu versteuerndes Einkommen Partner 1', type: 'number', defaultValue: 60000, min: 0, max: 10000000, step: 1000, unit: '€', helpText: 'Jahresbetrag nach Abzug von Werbungskosten, Sonderausgaben und Freibeträgen – nicht das Bruttogehalt.' },
      { id: 'incomeB', label: 'Zu versteuerndes Einkommen Partner 2', type: 'number', defaultValue: 20000, min: 0, max: 10000000, step: 1000, unit: '€' },
      {
        id: 'taxYear',
        label: 'Steuerjahr',
        type: 'select',
        defaultValue: '2026',
        options: [
          { value: '2026', label: '2026' },
          { value: '2025', label: '2025' },
        ],
      },
    ],
    calculate: calculateSplittingvorteil,
    formula: 'Splittingtarif: ESt = 2 × ESt(gemeinsames zvE / 2)   |   Splittingvorteil = Steuer Einzelveranlagung − Steuer Zusammenveranlagung',
    formulaExplanation: 'Beim Ehegattensplitting (§ 32a Abs. 5 EStG) wird das gemeinsame Einkommen halbiert, die Steuer auf die Hälfte berechnet und verdoppelt. Weil der Tarif progressiv ist, sinkt die Steuer, wenn die Einkommen unterschiedlich hoch sind. Der Rechner vergleicht das mit der Steuer, die beide einzeln nach dem Grundtarif zahlen würden – jeweils inklusive Solidaritätszuschlag.',
    workedExample: {
      title: 'Beispiel: 60.000 € und 20.000 € zu versteuerndes Einkommen (2026)',
      description: sp.summaryText ?? '',
      inputs: { incomeA: 60000, incomeB: 20000, taxYear: '2026' },
      resultSummary: `${sp.primary.formattedValue} Splittingvorteil pro Jahr`,
    },
    workedExamples: [
      {
        title: 'Unterschiedliche Einkommen: 60.000 € und 20.000 €',
        description: 'Ein Partner verdient deutlich mehr als der andere.',
        inputs: { incomeA: 60000, incomeB: 20000, taxYear: '2026' },
        resultSummary: `${sp.primary.formattedValue} Splittingvorteil pro Jahr.`,
      },
      {
        title: 'Alleinverdiener: 60.000 € und 0 €',
        description: 'Nur ein Partner hat Einkommen – hier ist der Vorteil am größten.',
        inputs: { incomeA: 60000, incomeB: 0, taxYear: '2026' },
        resultSummary: `${spOne.primary.formattedValue} Splittingvorteil pro Jahr.`,
      },
      {
        title: 'Gleiche Einkommen: 40.000 € und 40.000 €',
        description: 'Beide verdienen gleich viel.',
        inputs: { incomeA: 40000, incomeB: 40000, taxYear: '2026' },
        resultSummary: `${spEqual.primary.formattedValue} Splittingvorteil – bei gleichem Einkommen bringt das Splitting nichts.`,
      },
    ],
    content: {
      intro: 'Verheiratete und eingetragene Lebenspartner können sich gemeinsam veranlagen lassen und zahlen dann Einkommensteuer nach dem Splittingtarif. Dieser Rechner zeigt, wie viel Steuern Sie dadurch sparen: Er vergleicht die Zusammenveranlagung mit der Einzelveranlagung beider Partner nach dem Grundtarif 2026 oder 2025, jeweils mit Solidaritätszuschlag.',
      sections: [
        {
          title: 'So funktioniert das Ehegattensplitting',
          content:
            'Das zu versteuernde Einkommen beider Partner wird addiert und halbiert. Auf diese Hälfte wird die Einkommensteuer nach dem Grundtarif berechnet und dann verdoppelt. Weil der Steuersatz mit dem Einkommen steigt, zahlt ein Paar mit sehr unterschiedlichen Einkommen so weniger als zwei Einzelpersonen. ' +
            `Bei 60.000 € und 0 € beträgt der Vorteil ${spOne.primary.formattedValue} im Jahr, bei 60.000 € und 20.000 € noch ${sp.primary.formattedValue}. Verdienen beide gleich viel, gibt es keinen Vorteil.`,
        },
        {
          title: 'Steuerklassen ändern die Jahressteuer nicht',
          content:
            'Die Steuerklassen III/V oder IV/IV bestimmen nur, wie viel Lohnsteuer jeden Monat einbehalten wird. Die tatsächliche Einkommensteuer für das Jahr ergibt sich erst mit der Steuererklärung nach dem Splittingtarif. Wer zu wenig Lohnsteuer gezahlt hat, zahlt nach; wer zu viel gezahlt hat, bekommt Geld zurück.',
        },
      ],
    },
    faqs: [
      { question: 'Wie viel bringt das Ehegattensplitting?', answer: `Das hängt vom Unterschied der Einkommen ab. 2026 spart ein Paar mit 60.000 € und 20.000 € zu versteuerndem Einkommen ${sp.primary.formattedValue} im Jahr, ein Alleinverdiener mit 60.000 € sogar ${spOne.primary.formattedValue}. Bei gleich hohen Einkommen ist der Vorteil null.` },
      { question: 'Wer kann das Ehegattensplitting nutzen?', answer: 'Ehepaare und eingetragene Lebenspartner, die nicht dauernd getrennt leben und beide unbeschränkt steuerpflichtig sind (§ 26 EStG). Sie müssen die Zusammenveranlagung wählen; das ist der Normalfall in der Steuererklärung.' },
      { question: 'Gilt das Splitting schon im Jahr der Hochzeit?', answer: 'Ja. Es reicht, wenn die Voraussetzungen an einem Tag im Jahr vorliegen. Wer am 31. Dezember heiratet, kann für das ganze Jahr die Zusammenveranlagung wählen.' },
      { question: 'Was ist der Unterschied zwischen Splittingtabelle und Grundtabelle?', answer: 'Die Grundtabelle gilt für Alleinstehende. Die Splittingtabelle zeigt die Steuer für Ehepaare: Für jedes gemeinsame Einkommen steht dort die doppelte Steuer auf die Hälfte des Einkommens.' },
      { question: 'Ändern die Steuerklassen 3 und 5 etwas am Splittingvorteil?', answer: 'Nein. Steuerklassen regeln nur den monatlichen Lohnsteuerabzug. Die Jahressteuer und damit der Splittingvorteil stehen erst mit der Steuererklärung fest.' },
      { question: 'Warum soll ich das zu versteuernde Einkommen eingeben und nicht das Brutto?', answer: 'Der Tarif nach § 32a EStG gilt für das zu versteuernde Einkommen. Das ist Ihr Einkommen nach Abzug von Werbungskosten, Sonderausgaben und Freibeträgen. Bei Angestellten liegt es meist einige tausend Euro unter dem Bruttogehalt. Den genauen Wert finden Sie im Steuerbescheid.' },
    ],
    relatedSlugs: ['einkommensteuerrechner', 'brutto-netto-rechner', 'kinderzuschlag-kiz-rechner', 'ehegattenunterhalt-trennungsunterhalt-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: '§ 32a Abs. 1 und 5 EStG, §§ 3, 4 SolzG (Tarif 2026 und 2025)',
      sourceUrl: 'https://www.gesetze-im-internet.de/estg/__32a.html',
      lastVerified: '2026-11-14',
    },
    disclaimerType: 'steuer',
    legalBasis: [
      { label: '§ 32a EStG', url: 'https://www.gesetze-im-internet.de/estg/__32a.html' },
      { label: '§ 26 EStG', url: 'https://www.gesetze-im-internet.de/estg/__26.html' },
    ],
  },
];
