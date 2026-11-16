import { CalculatorDefinition } from '@/types/calculator';
import { calculatePfaendung, calculateSplittingvorteil, calculateMinijobStunden, pfaendungsFreibetrag, PFAENDUNGSFREIGRENZEN } from '@/lib/calculators/steuerRecht';
import { getMinijobPeriod, getMinijobPeriodByYear, WEEKS_PER_MONTH } from '@/data/regulated/minijob';
import { formatCurrency } from '@/lib/formatters';

const P = PFAENDUNGSFREIGRENZEN['2026'];
const eur = (n: number) => formatCurrency(n);

// Beispiele werden mit derselben Funktion berechnet wie das Ergebnis im Rechner.
const pf0 = calculatePfaendung({ netIncome: 2000, dependents: 0, period: '2026' });
const pf1 = calculatePfaendung({ netIncome: 2500, dependents: 1, period: '2026' });
const sp = calculateSplittingvorteil({ incomeA: 60000, incomeB: 20000, taxYear: '2026' });
const spOne = calculateSplittingvorteil({ incomeA: 60000, incomeB: 0, taxYear: '2026' });
const spEqual = calculateSplittingvorteil({ incomeA: 40000, incomeB: 40000, taxYear: '2026' });

// Minijob: values follow today's date (calculator pages are regenerated daily), so the switch on 1 January happens by itself.
const MJ = getMinijobPeriod();
const MJ25 = getMinijobPeriodByYear(2025)!;
const MJ26 = getMinijobPeriodByYear(2026)!;
const MJ27 = getMinijobPeriodByYear(2027)!;
const eur0 = (n: number) => `${Math.round(n).toLocaleString('de-DE')} €`;
const floor2 = (x: number) => Math.floor(x * 100 + 1e-9) / 100;
const hrs = (grenze: number, wage: number) => floor2(grenze / wage).toLocaleString('de-DE');
const hrsWeek = (grenze: number, wage: number) => floor2(grenze / wage / WEEKS_PER_MONTH).toLocaleString('de-DE');
const mjExample = calculateMinijobStunden({ year: String(MJ.year), wageType: 'mindestlohn' });
const mjExample15 = calculateMinijobStunden({ year: String(MJ.year), wageType: 'custom', hourlyWage: 15, plannedHoursPerWeek: 10 });

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
      { question: 'Warum soll ich das zu versteuernde Einkommen eingeben und nicht das Brutto?', answer: 'Der Tarif nach § 32a EStG gilt für das zu versteuernde Einkommen. Das ist Ihr Einkommen nach Abzug von Werbungskosten, Sonderausgaben und Freibeträgen. Bei Angestellten liegt es deutlich unter dem Bruttogehalt, vor allem weil Renten-, Kranken- und Pflegeversicherungsbeiträge als Vorsorgeaufwendungen abgezogen werden. Den genauen Wert finden Sie im Steuerbescheid.' },
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
  {
    id: 'minijob-stunden-rechner',
    slug: 'minijob-stunden-rechner',
    name: 'Minijob-Stundenrechner (Wie viele Stunden darf ich arbeiten?)',
    shortName: 'Minijob Stunden',
    category: 'steuern-gehalt',
    subcategory: 'Sonderzahlungen & Minijob',
    metaTitle: `Minijob Stunden ${MJ26.year}/${MJ27.year}: Wie viele Stunden pro Woche?`,
    metaDescription: `Wie viele Stunden darf ich im Minijob arbeiten? ${MJ26.year}: ${eur0(MJ26.grenze)} Grenze, ab 1. Januar ${MJ27.year}: ${eur0(MJ27.grenze)}. Stunden pro Monat und Woche – mit Mindestlohn oder eigenem Stundenlohn.`,
    h1: 'Minijob-Stundenrechner: Wie viele Stunden darf ich im Minijob arbeiten?',
    shortDescription: 'Berechnet, wie viele Stunden pro Monat und Woche in einen Minijob passen – mit Mindestlohn oder Ihrem Stundenlohn.',
    searchKeywords: [
      'minijob stunden',
      'minijob wie viele stunden',
      'minijob wie viele stunden pro woche',
      'wie viele stunden minijob',
      'minijob stunden pro woche',
      'minijob stunden pro monat',
      'minijob 2026 wie viele stunden',
      'minijob 2027 wie viele stunden',
      'minijob grenze 2027',
      'minijobgrenze 2027',
      'minijob stundenrechner',
    ],
    inputs: [
      {
        id: 'year',
        label: 'Zeitraum',
        type: 'select',
        defaultValue: 'auto',
        options: [
          { value: 'auto', label: 'Aktuell (nach heutigem Datum)' },
          { value: String(MJ27.year), label: `${MJ27.year}: ${eur0(MJ27.grenze)} Grenze, ${eur(MJ27.mindestlohn)} Mindestlohn` },
          { value: String(MJ26.year), label: `${MJ26.year}: ${eur0(MJ26.grenze)} Grenze, ${eur(MJ26.mindestlohn)} Mindestlohn` },
          { value: String(MJ25.year), label: `${MJ25.year}: ${eur0(MJ25.grenze)} Grenze, ${eur(MJ25.mindestlohn)} Mindestlohn` },
        ],
      },
      {
        id: 'wageType',
        label: 'Stundenlohn',
        type: 'select',
        defaultValue: 'mindestlohn',
        options: [
          { value: 'mindestlohn', label: 'Gesetzlicher Mindestlohn' },
          { value: 'custom', label: 'Eigener Stundenlohn' },
        ],
      },
      { id: 'hourlyWage', label: 'Ihr Stundenlohn brutto', type: 'number', defaultValue: 15, min: 0.01, max: 200, step: 0.1, unit: '€', dependsOn: { field: 'wageType', value: 'custom' } },
      { id: 'plannedHoursPerWeek', label: 'Geplante Stunden pro Woche (optional)', type: 'number', defaultValue: 0, min: 0, max: 60, step: 0.5, unit: 'h', helpText: 'Prüft, ob Ihre geplanten Wochenstunden in den Minijob passen. 0 = keine Prüfung.' },
    ],
    calculate: calculateMinijobStunden,
    formula: 'Stunden pro Monat = Minijob-Grenze / Stundenlohn   |   Stunden pro Woche = Stunden pro Monat / 4,33',
    formulaExplanation: 'Die Minijob-Grenze ist an den Mindestlohn gekoppelt: Mindestlohn × 130 / 3, auf volle Euro aufgerundet. Das entspricht 10 Wochenstunden zum Mindestlohn. Je höher Ihr Stundenlohn, desto weniger Stunden passen in die Grenze. Für die Woche rechnet das Gesetz mit 13 Wochen pro 3 Monate, also 4,33 Wochen im Monat.',
    workedExample: {
      title: `Beispiel: Mindestlohn ${MJ.year} (${eur(MJ.mindestlohn)})`,
      description: mjExample.summaryText ?? '',
      inputs: { year: String(MJ.year), wageType: 'mindestlohn', plannedHoursPerWeek: 0 },
      resultSummary: `${mjExample.primary.formattedValue} pro Monat`,
    },
    workedExamples: [
      {
        title: `Mindestlohn ${MJ26.year}`,
        description: `${eur0(MJ26.grenze)} Grenze bei ${eur(MJ26.mindestlohn)} pro Stunde.`,
        inputs: { year: String(MJ26.year), wageType: 'mindestlohn', plannedHoursPerWeek: 0 },
        steps: [`${eur0(MJ26.grenze)} / ${eur(MJ26.mindestlohn)} = ${hrs(MJ26.grenze, MJ26.mindestlohn)} Stunden im Monat`, `${hrs(MJ26.grenze, MJ26.mindestlohn)} / 4,33 = ${hrsWeek(MJ26.grenze, MJ26.mindestlohn)} Stunden pro Woche`],
        resultSummary: `${hrs(MJ26.grenze, MJ26.mindestlohn)} Stunden im Monat, rund 10 pro Woche.`,
      },
      {
        title: `Mindestlohn ab 1. Januar ${MJ27.year}`,
        description: `${eur0(MJ27.grenze)} Grenze bei ${eur(MJ27.mindestlohn)} pro Stunde.`,
        inputs: { year: String(MJ27.year), wageType: 'mindestlohn', plannedHoursPerWeek: 0 },
        steps: [`${eur0(MJ27.grenze)} / ${eur(MJ27.mindestlohn)} = ${hrs(MJ27.grenze, MJ27.mindestlohn)} Stunden im Monat`, `${hrs(MJ27.grenze, MJ27.mindestlohn)} / 4,33 = ${hrsWeek(MJ27.grenze, MJ27.mindestlohn)} Stunden pro Woche`],
        resultSummary: `${hrs(MJ27.grenze, MJ27.mindestlohn)} Stunden im Monat – fast genauso viele wie ${MJ26.year}.`,
      },
      {
        title: `15 € Stundenlohn, 10 Stunden pro Woche (${MJ.year})`,
        description: 'Wer mehr als den Mindestlohn verdient, darf weniger Stunden arbeiten.',
        inputs: { year: String(MJ.year), wageType: 'custom', hourlyWage: 15, plannedHoursPerWeek: 10 },
        resultSummary: mjExample15.summaryText ?? '',
      },
    ],
    content: {
      intro: `Im Minijob zählt nicht die Stundenzahl, sondern der Verdienst: Er darf im Durchschnitt höchstens ${eur0(MJ.grenze)} im Monat betragen (Stand ${MJ.year}). Wie viele Stunden Sie arbeiten dürfen, hängt deshalb von Ihrem Stundenlohn ab. Zum Mindestlohn sind es rund 43 Stunden im Monat, also etwa 10 Stunden pro Woche. Der Rechner wählt automatisch die Werte, die heute gelten.`,
      sections: [
        {
          title: 'Minijob-Grenze und Mindestlohn nach Jahr',
          content: [MJ25, MJ26, MJ27]
            .map((p) => `- **${p === MJ27 ? `ab 1. Januar ${p.year}` : p.year}:** ${eur0(p.grenze)} im Monat (${eur0(p.grenze * 12)} im Jahr), Mindestlohn ${eur(p.mindestlohn)} → ${hrs(p.grenze, p.mindestlohn)} Stunden im Monat`)
            .join('\n') +
            '\n\nWeil die Grenze mit dem Mindestlohn steigt, bleibt die mögliche Stundenzahl zum Mindestlohn fast gleich: etwa 43 Stunden im Monat.',
        },
        {
          title: 'Mehr Stunden bei höherem Stundenlohn? Nein, weniger',
          content: `Die Grenze ist ein Eurobetrag. Bei 15 € pro Stunde passen ${MJ.year} nur ${hrs(MJ.grenze, 15)} Stunden in den Monat, bei 20 € nur ${hrs(MJ.grenze, 20)} Stunden. Wer mehr arbeiten möchte, rutscht in den Midijob (Übergangsbereich) mit reduzierten Sozialabgaben – den Nettolohn zeigt der [Midijob-Rechner](/rechner/midijob-rechner/).`,
        },
        {
          title: 'Kurz mehr arbeiten: was erlaubt ist',
          content: 'Ein gelegentliches und nicht vorhersehbares Überschreiten der Grenze ist in bis zu zwei Kalendermonaten im Jahr erlaubt, wenn der Verdienst im jeweiligen Monat höchstens das Doppelte der Grenze beträgt (§ 8 Abs. 1b SGB IV). Typisch ist eine Krankheitsvertretung. Planbare Mehrarbeit wie das Weihnachtsgeschäft zählt nicht dazu.',
        },
      ],
    },
    faqs: [
      { question: `Wie viele Stunden darf ich ${MJ.year} im Minijob arbeiten?`, answer: `Zum Mindestlohn von ${eur(MJ.mindestlohn)} sind es höchstens ${hrs(MJ.grenze, MJ.mindestlohn)} Stunden im Monat, im Schnitt ${hrsWeek(MJ.grenze, MJ.mindestlohn)} Stunden pro Woche. Entscheidend ist der Verdienst von maximal ${eur0(MJ.grenze)} im Monat, nicht die Stundenzahl.` },
      { question: 'Wie viele Stunden pro Woche sind im Minijob erlaubt?', answer: `Eine feste Stundengrenze gibt es nicht. Zum Mindestlohn ergeben sich rund 10 Stunden pro Woche (${MJ26.year}: ${hrsWeek(MJ26.grenze, MJ26.mindestlohn)}, ${MJ27.year}: ${hrsWeek(MJ27.grenze, MJ27.mindestlohn)}). Bei höherem Stundenlohn sind es entsprechend weniger.` },
      { question: `Wie hoch ist die Minijob-Grenze ${MJ27.year}?`, answer: `Ab dem 1. Januar ${MJ27.year} liegt die Minijob-Grenze bei ${eur0(MJ27.grenze)} im Monat und ${eur0(MJ27.grenze * 12)} im Jahr, weil der Mindestlohn auf ${eur(MJ27.mindestlohn)} steigt. Im Jahr ${MJ26.year} gilt eine Grenze von ${eur0(MJ26.grenze)}.` },
      { question: 'Wie wird die Minijob-Grenze berechnet?', answer: `Mindestlohn mal 130, geteilt durch 3, auf volle Euro aufgerundet (§ 8 Abs. 1a SGB IV). Das entspricht 10 Stunden pro Woche zum Mindestlohn. Für ${MJ27.year}: ${eur(MJ27.mindestlohn)} × 130 / 3 = ${eur((MJ27.mindestlohn * 130) / 3)}, aufgerundet ${eur0(MJ27.grenze)}.` },
      { question: 'Muss mein Arbeitgeber die Stunden anpassen, wenn der Mindestlohn steigt?', answer: 'Er muss mindestens den neuen Mindestlohn zahlen. Bleiben die Stunden gleich, steigt Ihr Verdienst. Weil die Minijob-Grenze im selben Schritt mitsteigt, passen zum Mindestlohn trotzdem weiterhin rund 43 Stunden im Monat.' },
      { question: 'Was passiert, wenn ich die Minijob-Grenze überschreite?', answer: 'Dann wird aus dem Minijob ein Midijob mit Beiträgen zur Kranken-, Pflege- und Arbeitslosenversicherung. Ausnahme: Ein gelegentliches, unvorhersehbares Überschreiten in höchstens zwei Monaten im Jahr bis zum Doppelten der Grenze bleibt erlaubt.' },
    ],
    relatedSlugs: ['minijob-rechner', 'midijob-rechner', 'stundenlohnrechner', 'brutto-netto-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: MJ.year,
      source: '§ 8 Abs. 1a SGB IV; Fünfte Mindestlohnanpassungsverordnung (13,90 € ab 1.1.2026, 14,60 € ab 1.1.2027)',
      sourceUrl: 'https://www.gesetze-im-internet.de/sgb_4/__8.html',
      lastVerified: '2026-11-14',
    },
    disclaimerType: 'gehalt-sozialversicherung',
    legalBasis: [{ label: '§ 8 SGB IV', url: 'https://www.gesetze-im-internet.de/sgb_4/__8.html' }],
  },
];
