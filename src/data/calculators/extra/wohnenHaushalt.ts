import { CalculatorDefinition } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';

export const EXTRA_WOHNEN_HAUSHALT: CalculatorDefinition[] = [
  // ==================== WOHNEN & IMMOBILIEN (20 ZUSÄTZLICHE) ====================
  {
    id: 'mietminderung-rechner',
    slug: 'mietminderung-rechner',
    name: 'Mietminderung-Rechner (nach Mietminderungstabelle)',
    shortName: 'Mietminderung',
    category: 'wohnen-immobilien',
    subcategory: 'Miete & Mietrecht',
    metaTitle: 'Mietminderung Rechner – Ersparnis bei Wohnungsmängeln nach...',
    metaDescription: 'Ermitteln Sie die zulässige Mietminderung bei Heizungsausfall, Schimmel, Lärm oder Baustellen nach aktueller Rechtsprechung und BGH-Urteilen.',
    h1: 'Mietminderung Rechner – Mietkürzung bei Wohnungsmängeln berechnen',
    shortDescription: 'Berechnet die Mietminderung auf die Bruttowarmmiete bei Mängeln an der Mietsache (§ 536 BGB).',
    searchKeywords: ['mietminderung rechner', 'mietminderungstabelle schimmel', 'mietminderung heizungsausfall prozent', 'miete mindern paragraph 536 bgb'],
    inputs: [
      { id: 'warmRent', label: 'Monatliche Warmmiete (Bruttomiete inkl. Nebenkosten)', type: 'number', defaultValue: 950, min: 100, step: 25, unit: '€' },
      { id: 'defectPct', label: 'Minderungssatz laut Urteilen / Minderungstabelle', type: 'number', defaultValue: 20, min: 1, max: 100, step: 1, unit: '%' },
      { id: 'defectDays', label: 'Dauer des Mangels im Monat (Tage)', type: 'number', defaultValue: 30, min: 1, max: 31, step: 1, unit: 'Tage' },
    ],
    calculate: (inputs) => {
      const warm = parseFloat(inputs.warmRent) || 950;
      const pct = parseFloat(inputs.defectPct) || 20;
      const days = parseInt(inputs.defectDays, 10) || 30;
      const fullMonthReduction = warm * (pct / 100);
      const actualReduction = (fullMonthReduction * days) / 30;
      const reducedRent = warm - actualReduction;
      return {
        primary: { id: 'reduction', label: 'Errechnete Mietminderung', value: actualReduction, formattedValue: formatCurrency(actualReduction), highlight: true },
        secondary: [
          { id: 'reducedRent', label: 'Geminderte Restmiete', value: reducedRent, formattedValue: formatCurrency(reducedRent) },
          { id: 'dailySaving', label: 'Minderung pro Tag', value: actualReduction / days, formattedValue: formatCurrency(actualReduction / days) },
        ],
        summaryText: `Bei einem Minderungssatz von ${formatPercent(pct, 0)} über ${days} Tage mindert sich Ihre Monatsmiete um ${formatCurrency(actualReduction)} auf ${formatCurrency(reducedRent)}.`,
      };
    },
    formula: 'Mietminderung = Warmmiete × (Minderungssatz / 100) × (Tage des Mangels / 30)',
    formulaExplanation: 'Nach ständiger BGH-Rechtsprechung (BGH VIII ZR 225/03) ist die Bruttowarmmiete die Bemessungsgrundlage für die Mietminderung nach § 536 BGB.',
    workedExample: {
      title: 'Beispiel: 950 € Warmmiete mit 20 % Minderung für 30 Tage',
      inputValues: [{ label: 'Warmmiete', value: '950 €' }, { label: 'Minderungssatz', value: '20 %' }, { label: 'Tage', value: '30 Tage' }],
      steps: ['Minderung = 950 € × 0,20 = 190 €', 'Geminderte Miete = 950 € - 190 € = 760 €'],
      result: '190,00 € Minderung',
    },
    content: {
      intro: 'Bei erheblichen Mängeln der Mietsache (z. B. Heizungsausfall im Winter, Schimmelbefall, Baulärm) haben Mieter nach § 536 BGB ein gesetzliches Recht zur Mietminderung.',
      details: 'Die Minderung errechnet sich taggenau aus der Warmmiete (Bruttomiete inklusive Vorauszahlungen): Minderung = (Warmmiete / 30 Tage) · Minderungsquote · Ausfalltage.',
    },
    faqs: [
      { question: 'Wird die Minderung von der Kaltmiete oder Warmmiete berechnet?', answer: 'Nach ständiger Rechtsprechung des Bundesgerichtshofs (BGH, Az. XII ZR 225/03) ist die Bruttomiete (Warmmiete inklusive Nebenkostenvorauszahlungen) die zwingende Bemessungsgrundlage.' },
      { question: 'Darf man die Miete ohne Mängelanzeige sofort kürzen?', answer: 'Nein, nach § 536c BGB muss der Mangel dem Vermieter unverzüglich schriftlich angezeigt und eine angemessene Frist zur Beseitigung gesetzt werden; erst ab Zugang der Anzeige darf gemindert werden.' },
    ],
    relatedSlugs: ['untermiete-rechner', 'mietbelastungsquote-rechner', 'mietkaution-zinsen-rechner', 'mietrendite-brutto-netto-rechner'],
  },

  {
    id: 'staffelmiete-rechner',
    slug: 'staffelmiete-rechner',
    name: 'Staffelmiete-Rechner (Staffelvereinbarungen nach § 557a BGB)',
    shortName: 'Staffelmiete berechnen',
    category: 'wohnen-immobilien',
    subcategory: 'Miete & Mietrecht',
    metaTitle: 'Staffelmiete Rechner – Zukünftige Mieterhöhungen',
    metaDescription: 'Berechnen Sie die Entwicklung Ihrer Staffelmiete über bis zu 10 Jahre nach § 557a BGB mit festen Beträgen oder prozentualen Steigerungen.',
    h1: 'Staffelmiete Rechner – Staffelmietvertrag & Mietentwicklung kalkulieren',
    shortDescription: 'Simuliert den vertraglich vereinbarten Verlauf von Staffelungsmieten über die Vertragslaufzeit.',
    searchKeywords: ['staffelmiete rechner', 'staffelmietvertrag mieterhoehung', 'staffelmiete prozent oder betrag', 'paragraph 557a bgb'],
    inputs: [
      { id: 'startRent', label: 'Anfangs-Kaltmiete', type: 'number', defaultValue: 750, min: 100, step: 25, unit: '€' },
      { id: 'increaseAmount', label: 'Mieterhöhung je Staffel (Betrag in Euro)', type: 'number', defaultValue: 35, min: 5, step: 5, unit: '€' },
      { id: 'intervalMonths', label: 'Staffelabstand in Monaten (mindestens 12 Monate)', type: 'number', defaultValue: 12, min: 12, max: 60, step: 12, unit: 'Monate' },
      { id: 'totalYears', label: 'Betrachtungszeitraum in Jahren', type: 'number', defaultValue: 5, min: 1, max: 15, step: 1, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const start = parseFloat(inputs.startRent) || 750;
      const inc = parseFloat(inputs.increaseAmount) || 35;
      const interval = parseInt(inputs.intervalMonths, 10) || 12;
      const years = parseInt(inputs.totalYears, 10) || 5;
      const stepsCount = Math.floor((years * 12) / interval);
      const endRent = start + (stepsCount * inc);
      const totalPaid = start * years * 12 + (stepsCount * (stepsCount + 1) / 2) * inc * (interval / 12) * 12;
      return {
        primary: { id: 'endRent', label: `Kaltmiete nach ${years} Jahren`, value: endRent, formattedValue: formatCurrency(endRent), highlight: true },
        secondary: [
          { id: 'totalIncrease', label: 'Gesamte Mietsteigerung', value: endRent - start, formattedValue: formatCurrency(endRent - start) },
          { id: 'percentIncrease', label: 'Steigerung in Prozent', value: ((endRent - start) / start) * 100, formattedValue: formatPercent(((endRent - start) / start) * 100, 1) },
          { id: 'stepsCount', label: 'Anzahl Mieterhöhungen', value: stepsCount, formattedValue: `${stepsCount} Staffeln` },
        ],
        summaryText: `Nach ${years} Jahren und ${stepsCount} Staffeln steigt Ihre Kaltmiete von ${formatCurrency(start)} auf ${formatCurrency(endRent)} (${formatPercent(((endRent - start) / start) * 100, 1)} Zuwachs).`,
      };
    },
    formula: 'Endmiete = Anfangsmiete + (Anzahl Staffeln × Staffelbetrag)',
    formulaExplanation: 'Nach § 557a BGB muss die Miete mindestens ein Jahr lang unverändert bleiben und der Erhöhungsbetrag in einem festen Geldbetrag angegeben werden.',
    workedExample: {
      title: 'Beispiel: 750 € Anfangsmiete mit +35 € alle 12 Monate über 5 Jahre',
      inputValues: [{ label: 'Anfangsmiete', value: '750 €' }, { label: 'Staffelbetrag', value: '35 €' }, { label: 'Laufzeit', value: '5 Jahre' }],
      steps: ['5 Staffeln à 35 € = +175 €', 'Endmiete = 750 € + 175 € = 925 €'],
      result: '925,00 € Kaltmiete',
    },
    content: {
      intro: 'Eine Staffelmiete (§ 557a BGB) legt künftige Mieterhöhungen bereits im Mietvertrag mit festen Geldbeträgen und Zeitpunkten verbindlich fest.',
      details: 'Zwischen zwei Erhöhungsschritten muss mindestens ein Jahr liegen. Während der Laufzeit einer Staffelmiete sind reguläre Mieterhöhungen bis zur ortsüblichen Vergleichsmiete oder wegen Modernisierung gesetzlich ausgeschlossen.',
    },
    faqs: [
      { question: 'Darf die Staffelmiete prozentual formuliert sein?', answer: 'Nein, nach § 557a Abs. 1 BGB muss der jeweilige Erhöhungsbetrag in Euro und Cent beziffert sein; eine Klausel wie "jährlich 3 % mehr" ist unwirksam.' },
      { question: 'Gilt die Mietpreisbremse auch bei Staffelmietverträgen?', answer: 'Ja, jede einzelne Mietstaffel muss bei ihrer Fälligkeit die zu diesem Zeitpunkt geltende Obergrenze der Mietpreisbremse (ortsübliche Vergleichsmiete + max. 10 %) einhalten.' },
    ],
    relatedSlugs: ['modernisierungsumlage-rechner', 'indexmiete-rechner', 'mietbelastungsquote-rechner', 'mietbudget-rechner'],
  },

  {
    id: 'indexmiete-rechner',
    slug: 'indexmiete-rechner',
    name: 'Indexmiete-Rechner (nach Verbraucherpreisindex VPI)',
    shortName: 'Indexmiete berechnen',
    category: 'wohnen-immobilien',
    subcategory: 'Miete & Mietrecht',
    metaTitle: 'Indexmiete Rechner – Mieterhöhung nach VPI Statistisches Bu...',
    metaDescription: 'Ermitteln Sie die exakte Mieterhöhung nach § 557b BGB basierend auf dem Verbraucherpreisindex (VPI) des Statistischen Bundesamtes Destatis.',
    h1: 'Indexmiete Rechner – Mieterhöhung nach Verbraucherpreisindex',
    shortDescription: 'Berechnet die Anpassung der Nettokaltmiete an die Inflation gemäß Indexmietvertrag.',
    searchKeywords: ['indexmiete rechner', 'verbraucherpreisindex miete erhoehung', 'vpi indexmiete formel', 'paragraph 557b bgb rechner'],
    inputs: [
      { id: 'currentRent', label: 'Aktuelle monatliche Kaltmiete', type: 'number', defaultValue: 850, min: 100, step: 25, unit: '€' },
      { id: 'oldVpi', label: 'Alter Indexstand (bei Vertragsbeginn / letzter Erhöhung)', type: 'number', defaultValue: 105.8, min: 50, max: 200, step: 0.1 },
      { id: 'newVpi', label: 'Neuer Indexstand (aktueller VPI Destatis)', type: 'number', defaultValue: 118.5, min: 50, max: 200, step: 0.1 },
    ],
    calculate: (inputs) => {
      const rent = parseFloat(inputs.currentRent) || 850;
      const oldI = parseFloat(inputs.oldVpi) || 105.8;
      const newI = parseFloat(inputs.newVpi) || 118.5;
      const pctChange = ((newI / oldI) - 1) * 100;
      const newRent = rent * (newI / oldI);
      const diff = newRent - rent;
      return {
        primary: { id: 'newRent', label: 'Neue zulässige Kaltmiete', value: newRent, formattedValue: formatCurrency(newRent), highlight: true },
        secondary: [
          { id: 'diff', label: 'Monatlicher Erhöhungsbetrag', value: diff, formattedValue: formatCurrency(diff) },
          { id: 'pctChange', label: 'Indexsteigerung', value: pctChange, formattedValue: formatPercent(pctChange, 2) },
          { id: 'yearlyDiff', label: 'Mehrkosten pro Jahr', value: diff * 12, formattedValue: formatCurrency(diff * 12) },
        ],
        summaryText: `Durch den Anstieg des VPI um ${formatPercent(pctChange, 2)} erhöht sich die Monatskaltmiete um ${formatCurrency(diff)} von ${formatCurrency(rent)} auf ${formatCurrency(newRent)}.`,
      };
    },
    formula: 'Neue Miete = Alte Miete × (Neuer Index / Alter Index)',
    formulaExplanation: 'Prozentuale Steigerung = ((Neuer VPI / Alter VPI) - 1) × 100 nach § 557b BGB.',
    workedExample: {
      title: 'Beispiel: 850 € Kaltmiete bei VPI-Anstieg von 105,8 auf 118,5',
      inputValues: [{ label: 'Bisherige Miete', value: '850 €' }, { label: 'Alter VPI', value: '105,8' }, { label: 'Neuer VPI', value: '118,5' }],
      steps: ['Steigerung = (118,5 / 105,8 - 1) = +12,00 %', 'Neue Miete = 850 € × 1,120038 = 952,03 €'],
      result: '952,03 € neue Kaltmiete',
    },
    content: {
      intro: 'Bei einer Indexmiete (§ 557b BGB) ist die Entwicklung der Kaltmiete an den Verbraucherpreisindex (VPI) des Statistischen Bundesamtes gekoppelt.',
      details: 'Formel: Neue Miete = Alte Miete · (Neuer VPI / Alter VPI). Steigt der Index um 5,2 %, darf der Vermieter die Kaltmiete mit einer schriftlichen Erklärung und einmonatiger Ankündigungsfrist um exakt 5,2 % anheben.',
    },
    faqs: [
      { question: 'Kann die Miete bei einer Indexmiete auch sinken?', answer: 'Ja, sollte der Verbraucherpreisindex in einer Deflationsphase fallen, hat der Mieter nach dem Gesetz einen Rechtsanspruch auf Absenkung der Kaltmiete.' },
      { question: 'Darf der Vermieter neben der Indexerhöhung Modernisierungskosten umlegen?', answer: 'Nur dann, wenn die Modernisierung gesetzlich zwingend vorgeschrieben war (z. B. nach dem Gebäudeenergiegesetz); freiwillige Modernisierungen dürfen bei Indexmiete nicht umgelegt werden.' },
    ],
    relatedSlugs: ['modernisierungsumlage-rechner', 'staffelmiete-rechner', 'mietbelastungsquote-rechner', 'inflationsrechner'],
  },

  {
    id: 'wohnflaeche-din-rechner',
    slug: 'wohnflaeche-din-rechner',
    name: 'Wohnflächenrechner nach WoFlV (Wohnflächenverordnung)',
    shortName: 'Wohnfläche berechnen',
    category: 'wohnen-immobilien',
    subcategory: 'Immobilienkauf & Finanzierung',
    metaTitle: 'Wohnflächenrechner WoFlV – Wohnfläche exakt nach Vorschrift...',
    metaDescription: 'Berechnen Sie die rechtssichere Wohnfläche nach Wohnflächenverordnung (WoFlV) mit Dachschrägen (50 % Anrechnung) und Balkon/Terrasse (25 % bis 50 %).',
    h1: 'Wohnflächenrechner nach WoFlV – Dachschrägen & Balkone anrechnen',
    shortDescription: 'Ermittelt die anrechenbare Wohnfläche nach den rechtlichen Vorgaben der WoFlV.',
    searchKeywords: ['wohnflaechenrechner woflv', 'wohnflaeche berechnen dachschraege', 'balkon flaeche 25 prozent wohnflaeche', 'din 277 wohnflaechenverordnung'],
    inputs: [
      { id: 'fullArea', label: 'Voll anrechenbare Grundfläche (über 2 Meter Höhe)', type: 'number', defaultValue: 65, min: 1, step: 1, unit: 'm²' },
      { id: 'slopedArea', label: 'Fläche mit lichter Höhe zwischen 1 m und 2 m (50 % Anrechnung)', type: 'number', defaultValue: 14, min: 0, step: 1, unit: 'm²' },
      { id: 'balconyArea', label: 'Balkon- / Terrassengrundfläche (üblicherweise 25 % Anrechnung)', type: 'number', defaultValue: 8, min: 0, step: 0.5, unit: 'm²' },
    ],
    calculate: (inputs) => {
      const full = parseFloat(inputs.fullArea) || 65;
      const sloped = parseFloat(inputs.slopedArea) || 14;
      const balcony = parseFloat(inputs.balconyArea) || 8;
      const countedSloped = sloped * 0.5;
      const countedBalcony = balcony * 0.25;
      const totalWohnflaeche = full + countedSloped + countedBalcony;
      const totalGroundArea = full + sloped + balcony;
      return {
        primary: { id: 'totalWohnflaeche', label: 'Rechtssichere Wohnfläche nach WoFlV', value: totalWohnflaeche, formattedValue: `${formatNumber(totalWohnflaeche, 2)} m²`, highlight: true },
        secondary: [
          { id: 'groundArea', label: 'Gesamte Grundfläche (ohne Abzug)', value: totalGroundArea, formattedValue: `${formatNumber(totalGroundArea, 2)} m²` },
          { id: 'slopedDeduction', label: 'Schrägen-Anrechnung (50 %)', value: countedSloped, formattedValue: `${formatNumber(countedSloped, 2)} m²` },
          { id: 'balconyDeduction', label: 'Balkon-Anrechnung (25 %)', value: countedBalcony, formattedValue: `${formatNumber(countedBalcony, 2)} m²` },
        ],
        summaryText: `Aus einer Bruttogrundfläche von ${formatNumber(totalGroundArea, 2)} m² ergibt sich nach WoFlV eine Wohnfläche von ${formatNumber(totalWohnflaeche, 2)} m².`,
      };
    },
    formula: 'Wohnfläche = Vollfläche + (Schrägen 1-2m × 0,5) + (Balkon × 0,25)',
    formulaExplanation: 'Räume unter 1 m Höhe werden zu 0 %, zwischen 1 m und 2 m zu 50 %, und Balkone/Terrassen im Regelfall zu 25 % angesetzt (§§ 3 & 4 WoFlV).',
    workedExample: {
      title: 'Beispiel: 65 m² Vollfläche, 14 m² Schrägen und 8 m² Balkon',
      inputValues: [{ label: 'Vollhöhe', value: '65 m²' }, { label: 'Schräge (1-2 m)', value: '14 m²' }, { label: 'Balkon', value: '8 m²' }],
      steps: ['Schräge: 14 m² × 0,5 = 7 m²', 'Balkon: 8 m² × 0,25 = 2 m²', 'Summe = 65 + 7 + 2 = 74 m²'],
      result: '74,00 m² Wohnfläche',
    },
    content: {
      intro: 'Die Wohnflächenverordnung (WoFlV) regelt in Deutschland rechtssicher, welche Grundflächen von Räumen, Dachschrägen, Balkonen und Terrassen zur offiziellen Wohnfläche zählen.',
      details: 'Flächen mit lichter Raumhöhe ab 2,00 Metern zählen zu 100 %, Höhen zwischen 1,00 und 1,99 Metern zu 50 %, Flächen unter 1,00 Meter Höhe zu 0 %. Balkone und Terrassen werden im Regelfall mit 25 Prozent (in Ausnahmefällen 50 Prozent) angerechnet.',
    },
    faqs: [
      { question: 'Was passiert, wenn die tatsächliche Wohnfläche kleiner ist als im Mietvertrag angegeben?', answer: 'Weicht die Wohnfläche um mehr als 10 Prozent nach unten ab, liegt ein erheblicher Mangel vor: Der Mieter darf die Miete dauerhaft kürzen und zu viel gezahlte Miete der Vorjahre zurückfordern.' },
      { question: 'Zählen Treppen und Abstellräume außerhalb der Wohnung zur Wohnfläche?', answer: 'Nein, Treppen mit mehr als 3 Steigungen sowie Keller-, Wasch- und Trockenräume außerhalb der abgeschlossenen Wohnung zählen nach § 2 WoFlV nicht zur Wohnfläche.' },
    ],
    relatedSlugs: ['grundsteuer-reform-rechner', 'mietbelastungsquote-rechner', 'mietbudget-rechner'],
  },

  {
    id: 'grundsteuer-reform-rechner',
    slug: 'grundsteuer-reform-rechner',
    name: 'Grundsteuer-Rechner (Bundesmodell & Hebesatz)',
    shortName: 'Grundsteuer berechnen',
    category: 'wohnen-immobilien',
    subcategory: 'Immobilienkauf & Finanzierung',
    metaTitle: 'Grundsteuer Rechner – Grundsteuer nach neuer Reform 2025/20...',
    metaDescription: 'Ermitteln Sie Ihre jährliche Grundsteuer B nach der Reform: Grundsteuerwert × Steuermesszahl × kommunaler Hebesatz.',
    h1: 'Grundsteuer Rechner – Reformierte Grundsteuer B berechnen',
    shortDescription: 'Berechnet die neue Grundsteuer nach dem 3-Stufen-Verfahren für Wohngrundstücke mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['grundsteuer rechner', 'grundsteuer reform 2025 2026', 'grundsteuer hebesatz rechner', 'steuermesszahl grundsteuer b'],
    inputs: [
      { id: 'propertyValue', label: 'Festgestellter Grundsteuerwert (Finanzamt-Bescheid)', type: 'number', defaultValue: 280000, min: 10000, step: 5000, unit: '€' },
      { id: 'measureRate', label: 'Steuermesszahl (z. B. 0,031 % = 0,31 ‰ für Wohnen)', type: 'number', defaultValue: 0.031, min: 0.01, max: 0.1, step: 0.001, unit: '%' },
      { id: 'hebesatz', label: 'Hebesatz der Gemeinde (Grundsteuer B)', type: 'number', defaultValue: 480, min: 100, max: 1200, step: 10, unit: '%' },
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.propertyValue) || 280000;
      const mess = (parseFloat(inputs.measureRate) || 0.031) / 100;
      const hebe = (parseFloat(inputs.hebesatz) || 480) / 100;
      const messbetrag = val * mess;
      const grundsteuerYear = messbetrag * hebe;
      const grundsteuerQuarter = grundsteuerYear / 4;
      return {
        primary: { id: 'grundsteuerYear', label: 'Jährliche Grundsteuer', value: grundsteuerYear, formattedValue: formatCurrency(grundsteuerYear), highlight: true },
        secondary: [
          { id: 'grundsteuerQuarter', label: 'Vierteljährliche Zahlung', value: grundsteuerQuarter, formattedValue: formatCurrency(grundsteuerQuarter) },
          { id: 'messbetrag', label: 'Grundsteuermessbetrag', value: messbetrag, formattedValue: formatCurrency(messbetrag) },
          { id: 'monthlyEff', label: 'Monatliche Belastung', value: grundsteuerYear / 12, formattedValue: formatCurrency(grundsteuerYear / 12) },
        ],
        summaryText: `Bei einem Grundsteuerwert von ${formatCurrency(val)} und einem Hebesatz von ${inputs.hebesatz} % beträgt die Grundsteuer ${formatCurrency(grundsteuerYear)} im Jahr (${formatCurrency(grundsteuerQuarter)} pro Quartal).`,
      };
    },
    formula: 'Grundsteuer = Grundsteuerwert × Steuermesszahl × Hebesatz',
    formulaExplanation: 'Dreistufiges Berechnungsverfahren der Grundsteuerreform (§§ 13-15 GrStG).',
    workedExample: {
      title: 'Beispiel: 280.000 € Wert, 0,031 % Messzahl, 480 % Hebesatz',
      inputValues: [{ label: 'Grundsteuerwert', value: '280.000 €' }, { label: 'Messzahl', value: '0,031 %' }, { label: 'Hebesatz', value: '480 %' }],
      steps: ['Messbetrag = 280.000 € × 0,00031 = 86,80 €', 'Grundsteuer = 86,80 € × 4,80 = 416,64 €'],
      result: '416,64 € pro Jahr',
    },
    content: {
      intro: 'Die Grundsteuerreform bewertet ab 2025 alle Grundstücke neu, nachdem das Bundesverfassungsgericht die alten Einheitswerte für verfassungswidrig erklärt hat.',
      details: 'Berechnung im Bundesmodell: Grundsteuer = Grundsteuerwert (festgestellt vom Finanzamt) · Steuermesszahl (z. B. 0,31 ‰ für Wohnen) · Hebesatz der Gemeinde / 100. Manche Länder (Bayern, BW, Hessen) nutzen abweichende Flächen- oder Faktormodelle.',
    },
    faqs: [
      { question: 'Wer legt die Höhe der Grundsteuer letztlich fest?', answer: 'Die jeweilige Stadt oder Gemeinde über ihren kommunalen Hebesatz; sie kann den Hebesatz autonom nach oben oder unten anpassen.' },
      { question: 'Darf die Grundsteuer auf den Mieter umgelegt werden?', answer: 'Ja, nach § 2 Nr. 1 der Betriebskostenverordnung (BetrKV) gehört die laufende Grundsteuer zu den umlagefähigen Betriebskosten und kann in der Nebenkostenabrechnung aufgeführt werden.' },
    ],
    relatedSlugs: ['erbbaurecht-erbbauzins-rechner', 'wohnflaeche-din-rechner', 'grunderwerbsteuer-rechner', 'kaufnebenkosten-rechner', 'hausgeld-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Grundsteuer-Reformgesetze (Bundesmodell & Ländermodelle)',
      sourceUrl: 'https://www.bundesfinanzministerium.de',
      lastVerified: '2026-01-15',
    }
  },

  {
    id: 'spekulationssteuer-immobilien-rechner',
    slug: 'spekulationssteuer-immobilien-rechner',
    name: 'Spekulationssteuer-Rechner (Immobilienverkauf § 23 EStG)',
    shortName: 'Spekulationssteuer Immobilie',
    category: 'wohnen-immobilien',
    subcategory: 'Immobilienkauf & Finanzierung',
    metaTitle: 'Spekulationssteuer Rechner Immobilien – Steuer bei Verkauf...',
    metaDescription: 'Berechnen Sie die Spekulationssteuer beim Verkauf von Immobilien innerhalb der 10-Jahres-Frist nach persönlichem Einkommensteuersatz (§ 23 EStG).',
    h1: 'Spekulationssteuer Rechner – Steuer auf privaten Immobilienverkauf',
    shortDescription: 'Ermittelt den steuerpflichtigen Veräußerungsgewinn und die Einkommensteuer bei Verkauf vor Ablauf von 10 Jahren.',
    searchKeywords: ['spekulationssteuer immobilien rechner', 'paragraph 23 estg immobilienverkauf', '10 jahres frist hausverkauf steuer', 'spekulationsfrist rechner'],
    inputs: [
      { id: 'salePrice', label: 'Erzielter Verkaufspreis', type: 'number', defaultValue: 420000, min: 10000, step: 10000, unit: '€' },
      { id: 'purchaseCost', label: 'Ursprüngliche Anschaffungs-/Herstellungskosten inkl. Nebenkosten', type: 'number', defaultValue: 310000, min: 10000, step: 10000, unit: '€' },
      { id: 'claimedDepreciation', label: 'In Vorjahren steuerlich geltend gemachte AfA', type: 'number', defaultValue: 25000, min: 0, step: 1000, unit: '€' },
      { id: 'taxRate', label: 'Persönlicher Grenzsteuersatz', type: 'number', defaultValue: 42, min: 0, max: 45, step: 1, unit: '%' },
    ],
    calculate: (inputs) => {
      const sale = parseFloat(inputs.salePrice) || 420000;
      const buy = parseFloat(inputs.purchaseCost) || 310000;
      const afa = parseFloat(inputs.claimedDepreciation) || 25000;
      const rate = (parseFloat(inputs.taxRate) || 42) / 100;
      // Gewinn = Verkaufspreis - (Anschaffungskosten - AfA)
      const bookValue = Math.max(0, buy - afa);
      const taxableProfit = Math.max(0, sale - bookValue);
      const taxAmount = taxableProfit * rate;
      const netProfit = (sale - buy) - taxAmount;
      return {
        primary: { id: 'taxAmount', label: 'Voraussichtliche Spekulationssteuer', value: taxAmount, formattedValue: formatCurrency(taxAmount), highlight: true },
        secondary: [
          { id: 'taxableProfit', label: 'Steuerpflichtiger Veräußerungsgewinn', value: taxableProfit, formattedValue: formatCurrency(taxableProfit) },
          { id: 'bookValue', label: 'Steuerlicher Restbuchwert', value: bookValue, formattedValue: formatCurrency(bookValue) },
          { id: 'netProfit', label: 'Reingewinn nach Steuern', value: netProfit, formattedValue: formatCurrency(netProfit) },
        ],
        summaryText: `Bei einem Veräußerungsgewinn von ${formatCurrency(taxableProfit)} fällt bei ${formatPercent(rate * 100, 0)} Steuersatz ca. ${formatCurrency(taxAmount)} Spekulationssteuer an.`,
      };
    },
    formula: 'Gewinn = Verkaufserlös - (Anschaffungskosten - AfA); Steuer = Gewinn × persönlicher Steuersatz',
    formulaExplanation: 'Nach § 23 Abs. 1 Nr. 1 EStG sind Gewinne aus privaten Veräußerungsgeschäften innerhalb von 10 Jahren steuerpflichtig. Die in Anspruch genommene Gebäude-AfA mindert die Anschaffungskosten.',
    workedExample: {
      title: 'Beispiel: Verkauf für 420.000 € nach Kauf für 310.000 € und 25.000 € AfA',
      inputValues: [{ label: 'Verkaufspreis', value: '420.000 €' }, { label: 'Kaufpreis', value: '310.000 €' }, { label: 'AfA', value: '25.000 €' }, { label: 'Grenzsteuersatz', value: '42 %' }],
      steps: ['Restbuchwert = 310.000 € - 25.000 € = 285.000 €', 'Gewinn = 420.000 € - 285.000 € = 135.000 €', 'Steuer = 135.000 € × 0,42 = 56.700 €'],
      result: '56.700,00 € Spekulationssteuer',
    },
    content: {
      intro: 'Gewinne aus dem Verkauf privater Immobilien sind nach § 23 EStG steuerpflichtig, wenn zwischen Anschaffung und Veräußerung weniger als 10 Jahre liegen (Spekulationsfrist).',
      details: 'Verkaufsgewinn = Verkaufspreis - Anschaffungskosten - Notar/Makler - Renovierungskosten der ersten 3 Jahre. Der Gewinn wird mit dem individuellen persönlichen Einkommensteuersatz versteuert.',
    },
    faqs: [
      { question: 'Wann entfällt die 10-Jahres-Frist bei Eigennutzung?', answer: 'Wurde die Immobilie im Jahr des Verkaufs und den beiden vorangegangenen Kalenderjahren durchgehend selbst bewohnt, ist der Verkaufsgewinn auch vor Ablauf von 10 Jahren steuerfrei.' },
      { question: 'Gilt die Spekulationsfrist auch für geerbte Immobilien?', answer: 'Bei einer Erbschaft wird die Haltedauer des Erblassers voll angerechnet: Besaß der Erblasser die Immobilie bereits länger als 10 Jahre, kann der Erbe sofort steuerfrei verkaufen.' },
    ],
    relatedSlugs: ['grunderwerbsteuer-rechner', 'kaufnebenkosten-rechner', 'abschreibung-immobilien-rechner'],
  },

  {
    id: 'maklerprovision-rechner',
    slug: 'maklerprovision-rechner',
    name: 'Maklerprovision-Rechner (50:50 Teilung nach § 656c BGB)',
    shortName: 'Maklerprovision',
    category: 'wohnen-immobilien',
    subcategory: 'Immobilienkauf & Finanzierung',
    metaTitle: 'Maklerprovision Rechner – Maklerkosten für Käufer und Verkä...',
    metaDescription: 'Berechnen Sie die Maklercourtage nach neuem Maklerrecht (§ 656c BGB): Halbteilungsgrundsatz bei Wohnungen und Einfamilienhäusern.',
    h1: 'Maklerprovision Rechner – Courtage für Käufer & Verkäufer',
    shortDescription: 'Ermittelt die Maklercourtage inklusive 19 % Mehrwertsteuer für Käufer und Verkäufer.',
    searchKeywords: ['maklerprovision rechner', 'maklercourtage 3 57 prozent', 'halbteilungsgrundsatz paragraph 656c bgb', 'maklergebuehren hausverkauf'],
    inputs: [
      { id: 'purchasePrice', label: 'Immobilienkaufpreis', type: 'number', defaultValue: 350000, min: 10000, step: 10000, unit: '€' },
      { id: 'totalBrokerPct', label: 'Gesamtprovision inkl. MwSt. (üblich 7,14 % bzw. 3,57 % je Partei)', type: 'number', defaultValue: 7.14, min: 1, max: 10, step: 0.01, unit: '%' },
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.purchasePrice) || 350000;
      const totalPct = parseFloat(inputs.totalBrokerPct) || 7.14;
      const totalCost = price * (totalPct / 100);
      const buyerShare = totalCost / 2;
      const sellerShare = totalCost / 2;
      const netCost = totalCost / 1.19;
      const vat = totalCost - netCost;
      return {
        primary: { id: 'buyerShare', label: 'Anteil Käufer (inkl. 19 % MwSt.)', value: buyerShare, formattedValue: formatCurrency(buyerShare), highlight: true },
        secondary: [
          { id: 'sellerShare', label: 'Anteil Verkäufer (inkl. 19 % MwSt.)', value: sellerShare, formattedValue: formatCurrency(sellerShare) },
          { id: 'totalCost', label: 'Gesamte Maklercourtage', value: totalCost, formattedValue: formatCurrency(totalCost) },
          { id: 'vat', label: 'Darin enthaltene Mehrwertsteuer', value: vat, formattedValue: formatCurrency(vat) },
        ],
        summaryText: `Bei einem Kaufpreis von ${formatCurrency(price)} zahlen Käufer und Verkäufer jeweils ${formatCurrency(buyerShare)} Maklerprovision (Gesamthonorar: ${formatCurrency(totalCost)}).`,
      };
    },
    formula: 'Courtage je Partei = (Kaufpreis × Gesamtprovision in %) / 2',
    formulaExplanation: 'Nach § 656c BGB muss die Maklerprovision beim Kauf von Einfamilienhäusern oder Wohnungen durch Verbraucher paritätisch zwischen Käufer und Verkäufer geteilt werden.',
    workedExample: {
      title: 'Beispiel: 350.000 € Haus mit 7,14 % Gesamtprovision',
      inputValues: [{ label: 'Kaufpreis', value: '350.000 €' }, { label: 'Gesamtprovision', value: '7,14 %' }],
      steps: ['Gesamthonorar = 350.000 € × 0,0714 = 24.990 €', 'Anteil Käufer = 24.990 € / 2 = 12.495 €'],
      result: '12.495,00 € Käuferanteil',
    },
    content: {
      intro: 'Seit dem Gesetz über die Verteilung der Maklerkosten beim Verkauf von Wohnungen und Einfamilienhäusern (§ 656c BGB) gilt das gesetzliche Halbteilungskonsens.',
      details: 'Wird der Makler von beiden Parteien beauftragt, zahlen Käufer und Verkäufer exakt denselben Provisionsanteil. In der Praxis beträgt die Courtage meist je 3,57 Prozent inklusive 19 % Mehrwertsteuer (Gesamtprovision: 7,14 %).',
    },
    faqs: [
      { question: 'Gilt das Bestellerprinzip auch beim Immobilienkauf?', answer: 'Nein, das reine Bestellerprinzip (wer bestellt, zahlt komplett) gilt seit 2015 nur bei der Vermietung von Wohnraum; beim Kauf gilt die 50/50-Kostenteilung nach § 656c BGB.' },
      { question: 'Darf der Makler mit dem Käufer eine höhere Provision vereinbaren als mit dem Verkäufer?', answer: 'Nein, Vereinbarungen, die den Käufer zu einer höheren Provisionszahlung verpflichten als den Verkäufer, sind nach § 656c BGB gesetzlich unwirksam.' },
    ],
    relatedSlugs: ['kaufnebenkosten-rechner', 'grunderwerbsteuer-rechner', 'notar-grundbuch-kosten-rechner'],
  },

  {
    id: 'grunderwerbsteuer-rechner',
    slug: 'grunderwerbsteuer-rechner',
    name: 'Grunderwerbsteuer-Rechner (nach 16 Bundesländern)',
    shortName: 'Grunderwerbsteuer',
    category: 'wohnen-immobilien',
    subcategory: 'Immobilienkauf & Finanzierung',
    metaTitle: 'Grunderwerbsteuer Rechner – Steuersätze aller 16 Bundesländ...',
    metaDescription: 'Berechnen Sie die Grunderwerbsteuer für Bayern (3,5 %), NRW (6,5 %), Hamburg (5,5 %) und alle weiteren deutschen Bundesländer.',
    h1: 'Grunderwerbsteuer Rechner – Bundesland-Steuersätze berechnen',
    shortDescription: 'Ermittelt die exakte Grunderwerbsteuer für Ihren Immobilien- oder Grundstückskauf mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['grunderwerbsteuer rechner', 'grunderwerbsteuersatz bundeslaender 2026', 'grunderwerbsteuer bayern 3 5', 'grunderwerbsteuer sparen'],
    inputs: [
      { id: 'purchasePrice', label: 'Beurkundeter Immobilienkaufpreis', type: 'number', defaultValue: 320000, min: 5000, step: 5000, unit: '€' },
      {
        id: 'state',
        label: 'Bundesland der Immobilie',
        type: 'select',
        defaultValue: 'nrw',
        options: [
          { value: 'by', label: 'Bayern (3,5 %)' },
          { value: 'hb', label: 'Bremen (5,0 %)' },
          { value: 'hh', label: 'Hamburg (5,5 %)' },
          { value: 'bw', label: 'Baden-Württemberg (5,0 %)' },
          { value: 'he', label: 'Hessen (6,0 %)' },
          { value: 'ni', label: 'Niedersachsen (5,0 %)' },
          { value: 'rp', label: 'Rheinland-Pfalz (5,0 %)' },
          { value: 'be', label: 'Berlin (6,0 %)' },
          { value: 'bb', label: 'Brandenburg (6,5 %)' },
          { value: 'nrw', label: 'Nordrhein-Westfalen (6,5 %)' },
          { value: 'sh', label: 'Schleswig-Holstein (6,5 %)' },
          { value: 'sl', label: 'Saarland (6,5 %)' },
          { value: 'sn', label: 'Sachsen (5,5 %)' },
          { value: 'st', label: 'Sachsen-Anhalt (5,0 %)' },
          { value: 'th', label: 'Thüringen (5,0 %)' },
          { value: 'mv', label: 'Mecklenburg-Vorpommern (6,0 %)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.purchasePrice) || 320000;
      const stateRates: Record<string, number> = {
        by: 0.035, hb: 0.05, hh: 0.055, bw: 0.05, he: 0.06, ni: 0.05,
        rp: 0.05, be: 0.06, bb: 0.065, nrw: 0.065, sh: 0.065, sl: 0.065,
        sn: 0.055, st: 0.05, th: 0.05, mv: 0.06,
      };
      const rate = stateRates[inputs.state] || 0.065;
      const tax = price * rate;
      return {
        primary: { id: 'tax', label: 'Zu zahlende Grunderwerbsteuer', value: tax, formattedValue: formatCurrency(tax), highlight: true },
        secondary: [
          { id: 'rate', label: 'Steuersatz des Bundeslandes', value: rate * 100, formattedValue: formatPercent(rate * 100, 1) },
          { id: 'netPrice', label: 'Kaufpreis netto', value: price, formattedValue: formatCurrency(price) },
          { id: 'totalWithTax', label: 'Kaufpreis inkl. Grunderwerbsteuer', value: price + tax, formattedValue: formatCurrency(price + tax) },
        ],
        summaryText: `Bei einem Kaufpreis von ${formatCurrency(price)} beträgt die Grunderwerbsteuer bei einem Steuersatz von ${formatPercent(rate * 100, 1)} exakt ${formatCurrency(tax)}.`,
      };
    },
    formula: 'Grunderwerbsteuer = Kaufpreis × Bundesland-Steuersatz (3,5 % bis 6,5 %)',
    formulaExplanation: 'Die Grunderwerbsteuer ist eine Landessteuer nach dem GrEStG und wird mit Erlass des Steuerbescheids einen Monat nach Bekanntgabe fällig.',
    workedExample: {
      title: 'Beispiel: 320.000 € Immobilie in NRW (6,5 %)',
      inputValues: [{ label: 'Kaufpreis', value: '320.000 €' }, { label: 'Bundesland', value: 'Nordrhein-Westfalen (6,5 %)' }],
      steps: ['Steuer = 320.000 € × 0,065 = 20.800 €'],
      result: '20.800,00 € Grunderwerbsteuer',
    },
    content: {
      intro: 'Die Grunderwerbsteuer fällt beim Erwerb von Grundstücken und Immobilien an und wird von den Bundesländern eigenständig festgesetzt.',
      details: 'Die Steuersätze reichen von 3,5 % (Bayern) über 5,0 % (z. B. Niedersachsen, Baden-Württemberg) bis zu 6,5 % (z. B. NRW, Saarland, Brandenburg). Steuer = Beurkundeter Kaufpreis · Steuersatz.',
    },
    faqs: [
      { question: 'Können Einbauküchen und Möbel die Grunderwerbsteuer senken?', answer: 'Ja, bewegliches Zubehör (Einbauküche, Sauna, Möbel), das im Notarvertrag mit realistischem Zeitwert separat ausgewiesen wird, unterliegt nicht der Grunderwerbsteuer.' },
      { question: 'Wann wird die Grunderwerbsteuer fällig?', answer: 'Das Finanzamt stellt den Steuerbescheid meist 4 bis 8 Wochen nach dem Notartermin zu; die Steuer ist innerhalb eines Monats nach Bekanntgabe fällig. Erst nach Zahlung ergeht die Unbedenklichkeitsbescheinigung für das Grundbuchamt.' },
    ],
    relatedSlugs: ['kaufnebenkosten-rechner', 'notar-grundbuch-kosten-rechner', 'maklerprovision-rechner', 'spekulationssteuer-immobilien-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Grunderwerbsteuergesetze der 16 Bundesländer (GrEStG)',
      sourceUrl: 'https://www.finanzverwaltung.nrw.de',
      lastVerified: '2026-01-15',
    }
  },

  {
    id: 'notar-grundbuch-kosten-rechner',
    slug: 'notar-grundbuch-kosten-rechner',
    name: 'Notar- und Grundbuchkosten-Rechner (nach GNotKG)',
    shortName: 'Notarkosten-Rechner',
    category: 'wohnen-immobilien',
    subcategory: 'Immobilienkauf & Finanzierung',
    metaTitle: 'Notarkosten Rechner Immobilienkauf – Notar-',
    metaDescription: 'Berechnen Sie die anfallenden Notarkosten und Grundbuchamtsgebühren nach GNotKG (ca. 1,5 % bis 2,0 % des Kaufpreises) inklusive Grundschuldbestellung.',
    h1: 'Notar- und Grundbuchkosten Rechner – Kaufvertrag & Grundschuld',
    shortDescription: 'Kalkuliert die gesetzlichen Gebühren für Notarbeurkundung und Grundbucheintragung mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['notarkosten rechner immobilienkauf', 'grundbuchkosten rechner gnotkg', 'notargebuehren grundschuldbestellung', 'nebenkosten hausnotar'],
    inputs: [
      { id: 'purchasePrice', label: 'Immobilienkaufpreis', type: 'number', defaultValue: 300000, min: 10000, step: 10000, unit: '€' },
      { id: 'mortgageAmount', label: 'Eingetragene Grundschuld für Bankdarlehen', type: 'number', defaultValue: 250000, min: 0, step: 10000, unit: '€' },
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.purchasePrice) || 300000;
      const mortgage = parseFloat(inputs.mortgageAmount) || 250000;
      // Notargebühren Kaufvertrag ca. 1,0 % - 1,2 %
      const notaryDeed = price * 0.0105;
      // Grundbuchgebühren Kauf (Auflassung + Eigentumsumschreibung) ca. 0,5 %
      const landRegistryDeed = price * 0.0045;
      // Grundschuldbestellung Notar + Grundbuch ca. 0,4 % der Grundschuld
      const mortgageCost = mortgage * 0.004;
      const totalCost = notaryDeed + landRegistryDeed + mortgageCost;
      return {
        primary: { id: 'totalCost', label: 'Gesamte Notar- & Grundbuchkosten', value: totalCost, formattedValue: formatCurrency(totalCost), highlight: true },
        secondary: [
          { id: 'notaryShare', label: 'Notargebühren (Beurkundung & Betreuung)', value: notaryDeed + (mortgageCost * 0.6), formattedValue: formatCurrency(notaryDeed + (mortgageCost * 0.6)) },
          { id: 'registryShare', label: 'Grundbuchamtsgebühren (Eigentum & Grundschuld)', value: landRegistryDeed + (mortgageCost * 0.4), formattedValue: formatCurrency(landRegistryDeed + (mortgageCost * 0.4)) },
          { id: 'pctOfPrice', label: 'Anteil am Kaufpreis', value: (totalCost / price) * 100, formattedValue: formatPercent((totalCost / price) * 100, 2) },
        ],
        summaryText: `Für Notar und Grundbuchamt fallen ca. ${formatCurrency(totalCost)} an (ca. ${formatPercent((totalCost / price) * 100, 2)} des Kaufpreises).`,
      };
    },
    formula: 'Gebühren nach Gerichts- und Notarkostengesetz (GNotKG)',
    formulaExplanation: 'Die Gebühren sind gesetzlich fest geregelt und hängen vom Geschäftswert ab (Notar ca. 1 %, Grundbuchamt ca. 0,5 % plus Grundschuldeintragung).',
    workedExample: {
      title: 'Beispiel: 300.000 € Kaufpreis mit 250.000 € Grundschuld',
      inputValues: [{ label: 'Kaufpreis', value: '300.000 €' }, { label: 'Grundschuld', value: '250.000 €' }],
      steps: ['Kaufvertrag Notar & Grundbuch ≈ 4.500 €', 'Grundschuldbestellung ≈ 1.000 €', 'Gesamtsumme ≈ 5.500 €'],
      result: 'ca. 5.500,00 € Gesamtgebühren',
    },
    content: {
      intro: 'Notar- und Grundbuchgebühren sind nach dem Gerichts- und Notarkostengesetz (GNotKG) bundesweit gesetzlich einheitlich geregelt.',
      details: 'Für Kaufvertragsentwurf, Beurkundung, Grundbucheintragung (Auflassungsvormerkung und Eigentumsumschreibung) sowie die Eintragung einer Grundschuld fallen in der Summe rund 1,5 bis 2,0 Prozent des Kaufpreises an.',
    },
    faqs: [
      { question: 'Sind Notargebühren verhandelbar?', answer: 'Nein, Notare sind nach § 17 BNotO gesetzlich verpflichtet, exakt die Gebühren nach dem GNotKG abzurechnen; Rabatte oder Gebührenübernahmen sind strafbar.' },
      { question: 'Wer zahlt üblicherweise die Notarkosten beim Immobilienkauf?', answer: 'Nach den Gepflogenheiten im Kaufvertrag trägt der Käufer alle Notar- und Grundbuchkosten des Kaufs und der Grundschuld; der Verkäufer trägt nur Kosten für die Löschung alter, eigener Belastungen.' },
    ],
    relatedSlugs: ['grunderwerbsteuer-rechner', 'maklerprovision-rechner', 'kaufnebenkosten-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Gerichts- und Notarkostengesetz (GNotKG)',
      sourceUrl: 'https://www.gesetze-im-internet.de/gnotkg/',
      lastVerified: '2026-01-15',
    }
  },

  {
    id: 'instandhaltungsruecklage-rechner',
    slug: 'instandhaltungsruecklage-rechner',
    name: 'Instandhaltungsrücklage-Rechner (nach Petersscher Formel)',
    shortName: 'Instandhaltungsrücklage',
    category: 'wohnen-immobilien',
    subcategory: 'Eigentum & Nebenkosten',
    metaTitle: 'Instandhaltungsrücklage Rechner – Peterssche Formel',
    metaDescription: 'Ermitteln Sie die empfohlene jährliche Instandhaltungsrücklage für Eigentumswohnungen und Häuser nach der anerkannten Petersschen Formel.',
    h1: 'Instandhaltungsrücklage Rechner – Peterssche Formel & Rücklagenbedarf',
    shortDescription: 'Berechnet die optimale finanzielle Rücklage für Reparaturen und Modernisierungen von Immobilien.',
    searchKeywords: ['instandhaltungsruecklage rechner', 'peterssche formel immobilien', 'instandhaltungsruecklage weg pro qm', 'instandhaltungsruecklage berechnen'],
    inputs: [
      { id: 'livingArea', label: 'Wohnfläche in m²', type: 'number', defaultValue: 90, min: 20, max: 1000, step: 5, unit: 'm²' },
      { id: 'reconstructionCost', label: 'Herstellungskosten pro m² Wohnfläche', type: 'number', defaultValue: 2400, min: 1000, max: 6000, step: 100, unit: '€/m²' },
      { id: 'buildingAgeYears', label: 'Alter der Immobilie (Jahre)', type: 'number', defaultValue: 25, min: 0, max: 120, step: 5, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const area = parseFloat(inputs.livingArea) || 90;
      const cost = parseFloat(inputs.reconstructionCost) || 2400;
      const age = parseInt(inputs.buildingAgeYears, 10) || 25;
      // Peterssche Formel: Innerhalb von 80 Jahren fallen das 1,5-fache der Herstellungskosten für Instandhaltung an.
      // Davon entfallen ca. 70 % auf das Gemeinschaftseigentum.
      // Jährlich = (Herstellungskosten × 1,5 × 0,7) / 80 Jahre
      const yearlyPerSqm = (cost * 1.5 * 0.70) / 80;
      const yearlyTotal = yearlyPerSqm * area;
      const monthlyTotal = yearlyTotal / 12;
      return {
        primary: { id: 'yearlyTotal', label: 'Empfohlene Rücklage pro Jahr', value: yearlyTotal, formattedValue: formatCurrency(yearlyTotal), highlight: true },
        secondary: [
          { id: 'monthlyTotal', label: 'Monatliche Rücklage', value: monthlyTotal, formattedValue: formatCurrency(monthlyTotal) },
          { id: 'monthlyPerSqm', label: 'Monatlich pro m² Wohnfläche', value: monthlyTotal / area, formattedValue: `${formatNumber(monthlyTotal / area, 2)} €/m²` },
          { id: 'yearlyPerSqm', label: 'Jährlich pro m²', value: yearlyPerSqm, formattedValue: `${formatNumber(yearlyPerSqm, 2)} €/m²` },
        ],
        summaryText: `Nach der Petersschen Formel sollten Sie für ${area} m² monatlich ${formatCurrency(monthlyTotal)} (${formatNumber(monthlyTotal / area, 2)} €/m²) als Instandhaltungsrücklage ansparen.`,
      };
    },
    formula: 'Jährliche Rücklage = (Herstellungskosten × 1,5 × 0,7) / 80 × Wohnfläche',
    formulaExplanation: 'Die Peterssche Formel geht davon aus, dass während einer Nutzungsdauer von 80 Jahren das 1,5-fache der reinen Erstellungskosten für Instandhaltungen aufgewendet werden muss.',
    workedExample: {
      title: 'Beispiel: 90 m² Wohnung bei 2.400 €/m² Baukosten',
      inputValues: [{ label: 'Wohnfläche', value: '90 m²' }, { label: 'Baukosten/m²', value: '2.400 €' }],
      steps: ['Rücklage/m²/Jahr = (2.400 € × 1,5 × 0,70) / 80 = 31,50 €/m²', 'Monatlich gesamt = (31,50 € × 90 m²) / 12 = 236,25 €'],
      result: '236,25 € monatliche Rücklage',
    },
    content: {
      intro: 'Die Instandhaltungsrücklage (Erhaltungsrücklage nach § 19 WEG) sichert Wohnungseigentümergemeinschaften gegen künftige Reparaturen an Dach, Fassade, Heizung und Fenstern ab.',
      details: 'Berechnung nach Petersscher Formel: Jährliche Rücklage = 1,5 · Herstellungskosten/m² · 70 % / 80 Jahre. Das Gesetz über die Wohnungsförderung (§ 28 II. BV) sieht je nach Gebäudealter 7,10 € bis 11,50 € pro m² und Jahr vor.',
    },
    faqs: [
      { question: 'Was geschieht mit der Rücklage bei Verkauf der Wohnung?', answer: 'Der angesparte Anteil der Rücklage geht automatisch auf den Käufer über; er kann dem Verkäufer nicht bar ausgezahlt werden, wird im Kaufvertrag aber gesondert ausgewiesen (grunderwerbsteuerfrei!).' },
      { question: 'Was droht bei einer zu geringen Instandhaltungsrücklage?', answer: 'Steht eine größere Sanierung (z. B. neues Dach für 100.000 €) an, müssen die Eigentümer eine oft schmerzhafte Sonderumlage aus eigenen liquiden Mitteln nachschießen.' },
    ],
    relatedSlugs: ['hausgeld-rechner', 'kaufnebenkosten-rechner', 'mietrendite-brutto-netto-rechner'],
  },

  {
    id: 'modernisierungsumlage-rechner',
    slug: 'modernisierungsumlage-rechner',
    name: 'Modernisierungsumlage-Rechner (max. 8 % nach § 559 BGB)',
    shortName: 'Modernisierungsumlage',
    category: 'wohnen-immobilien',
    subcategory: 'Miete & Mietrecht',
    metaTitle: 'Modernisierungsumlage Rechner – Mieterhöhung nach § 559 BGB...',
    metaDescription: 'Berechnen Sie die zulässige Mieterhöhung nach Modernisierung: Bis zu 8 % der aufgewendeten Kosten abzüglich Instandhaltungsanteil und Kappungsgrenzen.',
    h1: 'Modernisierungsumlage Rechner – Mieterhöhung nach Modernisierung',
    shortDescription: 'Ermittelt die gesetzlich zulässige Mieterhöhung nach § 559 BGB unter Beachtung der Kappungsgrenzen.',
    searchKeywords: ['modernisierungsumlage rechner', 'paragraph 559 bgb mieterhoehung', 'kappungsgrenze modernisierung 3 euro', 'instandhaltung abziehen modernisierung'],
    inputs: [
      { id: 'modernizationCosts', label: 'Gesamte Modernisierungskosten der Wohnung', type: 'number', defaultValue: 25000, min: 500, step: 500, unit: '€' },
      { id: 'maintenanceShare', label: 'Darin enthaltener ersparter Erhaltungsaufwand (Instandhaltung)', type: 'number', defaultValue: 6000, min: 0, step: 500, unit: '€' },
      { id: 'livingArea', label: 'Wohnfläche der Wohnung in m²', type: 'number', defaultValue: 75, min: 15, step: 5, unit: 'm²' },
      { id: 'currentRentSqm', label: 'Bisherige Miete pro m²', type: 'number', defaultValue: 8.50, min: 3, max: 35, step: 0.5, unit: '€/m²' },
    ],
    calculate: (inputs) => {
      const grossCost = parseFloat(inputs.modernizationCosts) || 25000;
      const maint = parseFloat(inputs.maintenanceShare) || 6000;
      const area = parseFloat(inputs.livingArea) || 75;
      const currentRentSqm = parseFloat(inputs.currentRentSqm) || 8.50;
      const eligibleCosts = Math.max(0, grossCost - maint);
      // Gesetzlich max 8 % p.a.
      const yearlyUmlage = eligibleCosts * 0.08;
      const monthlyUmlage = yearlyUmlage / 12;
      const increasePerSqm = monthlyUmlage / area;
      // Kappungsgrenze nach § 559 Abs. 3a BGB: max 3 €/m² innerhalb von 6 Jahren (bzw 2 € bei Miete unter 7 €/m²)
      const maxCapPerSqm = currentRentSqm < 7 ? 2.00 : 3.00;
      const actualIncreasePerSqm = Math.min(increasePerSqm, maxCapPerSqm);
      const actualMonthlyIncrease = actualIncreasePerSqm * area;
      return {
        primary: { id: 'actualMonthlyIncrease', label: 'Zulässige monatliche Mieterhöhung', value: actualMonthlyIncrease, formattedValue: formatCurrency(actualMonthlyIncrease), highlight: true },
        secondary: [
          { id: 'actualIncreasePerSqm', label: 'Mieterhöhung pro m²', value: actualIncreasePerSqm, formattedValue: `${formatNumber(actualIncreasePerSqm, 2)} €/m²` },
          { id: 'eligibleCosts', label: 'Umlagefähiger Netto-Modernisierungsaufwand', value: eligibleCosts, formattedValue: formatCurrency(eligibleCosts) },
          { id: 'uncappedMonthly', label: 'Theoretische Erhöhung ohne Kappungsgrenze', value: monthlyUmlage, formattedValue: formatCurrency(monthlyUmlage) },
        ],
        summaryText: `Von ${formatCurrency(grossCost)} Kosten sind nach Abzug von ${formatCurrency(maint)} Instandhaltung ${formatCurrency(eligibleCosts)} umlagefähig. Die Miete steigt um ${formatCurrency(actualMonthlyIncrease)}/Monat (${formatNumber(actualIncreasePerSqm, 2)} €/m²).`,
      };
    },
    formula: 'Umlage = (Modernisierungskosten - Instandhaltung) × 8 % / 12 (Kappung: max. 3 €/m²)',
    formulaExplanation: 'Nach § 559 BGB darf der Vermieter jährlich bis zu 8 % der für die Wohnung aufgewendeten Kosten auf die Jahresmiete umlegen. Die Kappungsgrenze beträgt maximal 3 Euro pro m² Wohnfläche innerhalb von 6 Jahren.',
    workedExample: {
      title: 'Beispiel: 25.000 € Kosten mit 6.000 € Instandhaltung bei 75 m²',
      inputValues: [{ label: 'Kosten', value: '25.000 €' }, { label: 'Instandhaltung', value: '6.000 €' }, { label: 'Wohnfläche', value: '75 m²' }],
      steps: ['Umlagefähig: 19.000 € × 8 % = 1.520 € pro Jahr', 'Monatlich: 1.520 € / 12 = 126,67 €', 'Pro m²: 126,67 € / 75 m² = 1,69 €/m² (unter 3 € Kappungsgrenze)'],
      result: '126,67 € monatliche Mieterhöhung',
    },
    content: {
      intro: 'Nach § 559 BGB dürfen Vermieter nach baulichen Maßnahmen, die den Gebrauchswert nachhaltig erhöhen oder Endenergie einsparen, einen Teil der Kosten auf die Jahresmiete umlegen.',
      details: 'Der Umlagesatz beträgt maximal 8 Prozent der auf die Wohnung entfallenden Modernisierungskosten pro Jahr. Die monatliche Mieterhöhung ist innerhalb von 6 Jahren auf maximal 3,00 €/m² (bei Mieten unter 7,00 €/m² auf max. 2,00 €/m²) gedeckelt.',
    },
    faqs: [
      { question: 'Dürfen reine Instandhaltungskosten umgelegt werden?', answer: 'Nein, reine Reparatur- und Instandhaltungskosten (Erhaltungsaufwand, der ohnehin fällig gewesen wäre) müssen vor der Umlageberechnung sauber abgezogen werden.' },
      { question: 'Müssen staatliche Fördermittel abgezogen werden?', answer: 'Ja, nach § 559a BGB müssen Zuschüsse (z. B. von BAFA oder KfW) zwingend von den Modernisierungskosten abgezogen werden, bevor der 8-%-Umlagesatz berechnet wird.' },
    ],
    relatedSlugs: ['indexmiete-rechner', 'staffelmiete-rechner', 'mietbelastungsquote-rechner'],
  },

  {
    id: 'mietkaution-zinsen-rechner',
    slug: 'mietkaution-zinsen-rechner',
    name: 'Mietkaution & Zinseszins-Rechner (§ 551 BGB)',
    shortName: 'Mietkaution Zinsen',
    category: 'wohnen-immobilien',
    subcategory: 'Miete & Mietrecht',
    metaTitle: 'Mietkaution Rechner – Zinsen, Zinseszins',
    metaDescription: 'Berechnen Sie die Zinsen und den Endauszahlungsbetrag Ihrer Mietkaution nach § 551 BGB bei Auszug über die Mietdauer.',
    h1: 'Mietkaution Rechner – Kaution, Zinsen & Rückzahlung berechnen',
    shortDescription: 'Ermittelt Zinsertrag und Gesamtrückzahlung der Mietkaution nach § 551 BGB.',
    searchKeywords: ['mietkaution rechner', 'mietkaution zinsen berechnen', 'paragraph 551 bgb kautionszinsen', 'auszahlung mietkaution zinsen'],
    inputs: [
      { id: 'depositAmount', label: 'Eingezahlte Mietkaution (max. 3 Kaltmieten)', type: 'number', defaultValue: 1800, min: 100, step: 50, unit: '€' },
      { id: 'rentalYears', label: 'Mietdauer in Jahren', type: 'number', defaultValue: 6, min: 1, max: 50, step: 1, unit: 'Jahre' },
      { id: 'avgInterestRate', label: 'Durchschnittlicher Sparzins p.a.', type: 'number', defaultValue: 1.2, min: 0.01, max: 10, step: 0.1, unit: '%' },
    ],
    calculate: (inputs) => {
      const dep = parseFloat(inputs.depositAmount) || 1800;
      const years = parseInt(inputs.rentalYears, 10) || 6;
      const rate = (parseFloat(inputs.avgInterestRate) || 1.2) / 100;
      const totalAmount = dep * Math.pow(1 + rate, years);
      const totalInterest = totalAmount - dep;
      return {
        primary: { id: 'totalAmount', label: 'Gesamtrückzahlung bei Auszug', value: totalAmount, formattedValue: formatCurrency(totalAmount), highlight: true },
        secondary: [
          { id: 'totalInterest', label: 'Erwirtschafteter Zinseszins', value: totalInterest, formattedValue: formatCurrency(totalInterest) },
          { id: 'depInitial', label: 'Ursprüngliche Kaution', value: dep, formattedValue: formatCurrency(dep) },
        ],
        summaryText: `Nach ${years} Jahren Mietzeit erhalten Sie Ihre Kaution von ${formatCurrency(dep)} plus ${formatCurrency(totalInterest)} Zinsen zurück (Summe: ${formatCurrency(totalAmount)}).`,
      };
    },
    formula: 'Endbetrag = Kaution × (1 + Zinssatz)^Jahre',
    formulaExplanation: 'Nach § 551 Abs. 3 BGB hat der Vermieter die Mietkaution getrennt von seinem Vermögen zu dem für Spareinlagen mit dreimonatiger Kündigungsfrist üblichen Zinssatz anzulegen. Die Zinsen stehen dem Mieter zu.',
    workedExample: {
      title: 'Beispiel: 1.800 € Kaution über 6 Jahre bei 1,2 % Zinsen',
      inputValues: [{ label: 'Kaution', value: '1.800 €' }, { label: 'Laufzeit', value: '6 Jahre' }, { label: 'Zinssatz', value: '1,2 %' }],
      steps: ['Endwert = 1.800 € × (1,012)^6 = 1.933,48 €', 'Zinsgewinn = 133,48 €'],
      result: '1.933,48 € Auszahlungsbetrag',
    },
    content: {
      intro: 'Vermieter sind nach § 551 Abs. 3 BGB gesetzlich verpflichtet, die Mietkaution getrennt von ihrem eigenen Vermögen bei einer Bank zu dem für Spareinlagen mit dreimonatiger Kündigungsfrist üblichen Zinssatz anzulegen.',
      details: 'Zinsen und Zinseszinsen stehen in voller Höhe dem Mieter zu und erhöhen den Kautionsbetrag, der am Ende des Mietverhältnisses zurückgezahlt werden muss.',
    },
    faqs: [
      { question: 'Wie hoch darf die Mietkaution maximal sein?', answer: 'Nach § 551 Abs. 1 BGB darf die Kaution maximal drei Nettokaltmieten betragen; Nebenkostenvorauszahlungen dürfen nicht eingerechnet werden.' },
      { question: 'Wie lange darf der Vermieter die Kaution nach Auszug einbehalten?', answer: 'Dem Vermieter steht eine angemessene Prüfungs- und Überlegungsfrist von in der Regel 3 bis 6 Monaten zu; ein angemessener Teilbetrag darf bis zur nächsten Nebenkostenabrechnung einbehalten werden.' },
    ],
    relatedSlugs: ['abstandszahlung-rechner', 'mietbelastungsquote-rechner', 'mietminderung-rechner', 'mietbudget-rechner'],
  },

  {
    id: 'hausgeld-rechner',
    slug: 'hausgeld-rechner',
    name: 'Hausgeld-Rechner für Eigentumswohnungen',
    shortName: 'Hausgeld berechnen',
    category: 'wohnen-immobilien',
    subcategory: 'Eigentum & Nebenkosten',
    metaTitle: 'Hausgeld Rechner – Monatliche Kosten für Eigentumswohnungen',
    metaDescription: 'Berechnen Sie das monatliche Hausgeld (Wohngeld) für Eigentumswohnungen aufgeteilt in umlagefähige und nicht umlagefähige Kosten nach WEG.',
    h1: 'Hausgeld Rechner – Kosten für Eigentumswohnungen kalkulieren',
    shortDescription: 'Kalkuliert die monatliche Hausgeldzahlung und trennt Vermieterkosten von Mieterkosten mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['hausgeld rechner', 'wohngeld eigentumswohnung rechner', 'hausgeld pro qm durchschnitt', 'umlagefaehiges hausgeld'],
    inputs: [
      { id: 'livingArea', label: 'Wohnungsgröße in m²', type: 'number', defaultValue: 80, min: 15, max: 400, step: 5, unit: 'm²' },
      { id: 'avgHausgeldPerSqm', label: 'Durchschnittliches Hausgeld pro m² (üblich 3,50 € - 5,50 €)', type: 'number', defaultValue: 4.20, min: 1.5, max: 10, step: 0.1, unit: '€/m²' },
      { id: 'apportionablePct', label: 'Auf Mieter umlagefähiger Anteil (Heizung, Müll etc.)', type: 'number', defaultValue: 65, min: 30, max: 90, step: 5, unit: '%' },
    ],
    calculate: (inputs) => {
      const area = parseFloat(inputs.livingArea) || 80;
      const rate = parseFloat(inputs.avgHausgeldPerSqm) || 4.20;
      const appPct = (parseFloat(inputs.apportionablePct) || 65) / 100;
      const totalMonthly = area * rate;
      const apportionable = totalMonthly * appPct;
      const ownerShare = totalMonthly - apportionable;
      return {
        primary: { id: 'totalMonthly', label: 'Monatliches Gesamthausgeld', value: totalMonthly, formattedValue: formatCurrency(totalMonthly), highlight: true },
        secondary: [
          { id: 'apportionable', label: 'Umlagefähig auf Mieter (Betriebskosten)', value: apportionable, formattedValue: formatCurrency(apportionable) },
          { id: 'ownerShare', label: 'Nicht umlagefähig (Eigentümer-Kosten & Rücklage)', value: ownerShare, formattedValue: formatCurrency(ownerShare) },
          { id: 'yearlyTotal', label: 'Gesamthausgeld pro Jahr', value: totalMonthly * 12, formattedValue: formatCurrency(totalMonthly * 12) },
        ],
        summaryText: `Für Ihre ${area} m² Eigentumswohnung beträgt das Hausgeld monatlich ${formatCurrency(totalMonthly)}. Davon können ca. ${formatCurrency(apportionable)} auf den Mieter umgelegt werden.`,
      };
    },
    formula: 'Hausgeld = Wohnfläche × Satz pro m²; Umlagefähig = Hausgeld × Umlagequote',
    formulaExplanation: 'Das Hausgeld wird im Wirtschaftsplan der WEG festgesetzt. Umlagefähig sind die Betriebskosten nach BetrKV; Verwaltung und Instandhaltungsrücklage verbleiben beim Eigentümer.',
    workedExample: {
      title: 'Beispiel: 80 m² Wohnung bei 4,20 €/m² Hausgeld mit 65 % Umlagefähigkeit',
      inputValues: [{ label: 'Wohnfläche', value: '80 m²' }, { label: 'Satz', value: '4,20 €/m²' }],
      steps: ['Monatlich gesamt = 80 m² × 4,20 € = 336,00 €', 'Umlagefähig auf Mieter = 336 € × 0,65 = 218,40 €', 'Eigentümerlast = 117,60 €'],
      result: '336,00 € monatliches Hausgeld',
    },
    content: {
      intro: 'Das Hausgeld ist der monatliche Vorschuss, den Eigentümer einer Eigentumswohnung an die WEG-Verwaltung für Bewirtschaftung, Nebenkosten und Instandhaltungsrücklage zahlen.',
      details: 'Es unterteilt sich in umlagefähige Betriebskosten (Heizung, Müll, Hausmeister, die an den Mieter weitergereicht werden können) und nicht umlagefähige Verwaltungskosten sowie Zuführungen zur Erhaltungsrücklage.',
    },
    faqs: [
      { question: 'Welche Teile des Hausgelds kann der Eigentümer auf Mieter umlegen?', answer: 'Nur die Kosten nach der Betriebskostenverordnung (§ 2 BetrKV); Verwaltergebühren, Kontoführungsgebühren und die Instandhaltungsrücklage verbleiben immer beim Eigentümer.' },
      { question: 'Wie hoch ist das durchschnittliche Hausgeld pro Quadratmeter?', answer: 'In Deutschland liegt das Hausgeld meist zwischen 3,00 € und 4,50 € pro Quadratmeter Wohnfläche im Monat, abhängig von Gebäudealter, Aufzug und Heizsystem.' },
    ],
    relatedSlugs: ['instandhaltungsruecklage-rechner', 'mietrendite-brutto-netto-rechner', 'grundsteuer-reform-rechner'],
  },

  {
    id: 'abschreibung-immobilien-rechner',
    slug: 'abschreibung-immobilien-rechner',
    name: 'AfA-Rechner Immobilien (Gebäudeabschreibung nach § 7 EStG)',
    shortName: 'Immobilien AfA berechnen',
    category: 'wohnen-immobilien',
    subcategory: 'Immobilienkauf & Finanzierung',
    metaTitle: 'AfA Rechner Immobilien – Gebäudeabschreibung 2 %, 2,5 % ode...',
    metaDescription: 'Berechnen Sie die steuerliche Gebäudeabschreibung (AfA) für vermietete Immobilien: 2 % (ab 1925), 2,5 % (vor 1925) oder 3 % (Neubau ab 2023).',
    h1: 'AfA Rechner Immobilien – Steuerliche Abschreibung berechnen',
    shortDescription: 'Ermittelt die jährliche Steuerersparnis durch Gebäude-AfA für Vermieter und Kapitalanleger.',
    searchKeywords: ['afa rechner immobilien', 'gebaeudeabschreibung 3 prozent neubau', 'gebaeude afa berechnen steuer', 'paragraph 7 absatz 4 estg'],
    inputs: [
      { id: 'totalCost', label: 'Gesamtkaufpreis inkl. Erwerbsnebenkosten', type: 'number', defaultValue: 380000, min: 20000, step: 10000, unit: '€' },
      { id: 'landSharePct', label: 'Grundstücksanteil (nicht abschreibbar, üblich 20 % - 30 %)', type: 'number', defaultValue: 25, min: 5, max: 70, step: 5, unit: '%' },
      {
        id: 'afaType',
        label: 'Baujahr / AfA-Satz nach § 7 Abs. 4 EStG',
        type: 'select',
        defaultValue: 'after1925',
        options: [
          { value: 'newBuild', label: 'Neubau Wohngebäude ab 01.01.2023 (3,0 % p.a.)' },
          { value: 'after1925', label: 'Fertigstellung nach dem 31.12.1924 (2,0 % p.a.)' },
          { value: 'before1925', label: 'Altbau bis 1924 (2,5 % p.a.)' },
        ],
      },
      { id: 'taxRate', label: 'Persönlicher Grenzsteuersatz', type: 'number', defaultValue: 42, min: 14, max: 45, step: 1, unit: '%' },
    ],
    calculate: (inputs) => {
      const total = parseFloat(inputs.totalCost) || 380000;
      const landPct = (parseFloat(inputs.landSharePct) || 25) / 100;
      const taxRate = (parseFloat(inputs.taxRate) || 42) / 100;
      const buildingValue = total * (1 - landPct);
      let rate = 0.02;
      if (inputs.afaType === 'newBuild') rate = 0.03;
      if (inputs.afaType === 'before1925') rate = 0.025;
      const yearlyAfa = buildingValue * rate;
      const yearlyTaxSaving = yearlyAfa * taxRate;
      const monthlyTaxSaving = yearlyTaxSaving / 12;
      return {
        primary: { id: 'yearlyTaxSaving', label: 'Jährliche Steuerersparnis durch AfA', value: yearlyTaxSaving, formattedValue: formatCurrency(yearlyTaxSaving), highlight: true },
        secondary: [
          { id: 'yearlyAfa', label: 'Jährlicher AfA-Abschreibungsbetrag', value: yearlyAfa, formattedValue: formatCurrency(yearlyAfa) },
          { id: 'buildingValue', label: 'Abschreibbare Gebäudesubstanz', value: buildingValue, formattedValue: formatCurrency(buildingValue) },
          { id: 'monthlyTaxSaving', label: 'Monatliche Steuerersparnis', value: monthlyTaxSaving, formattedValue: formatCurrency(monthlyTaxSaving) },
        ],
        summaryText: `Bei einem Gebäudewert von ${formatCurrency(buildingValue)} beträgt die AfA ${formatCurrency(yearlyAfa)}/Jahr (${formatPercent(rate * 100, 1)}). Sie sparen jährlich ca. ${formatCurrency(yearlyTaxSaving)} Einkommensteuer.`,
      };
    },
    formula: 'AfA = Gebäudewert × AfA-Satz (2 %, 2,5 % oder 3 %); Steuerersparnis = AfA × Grenzsteuersatz',
    formulaExplanation: 'Nur das Gebäude nutzt sich ab und kann abgeschrieben werden. Der Bodenwert unterliegt keiner Abnutzung (§ 7 Abs. 4 EStG).',
    workedExample: {
      title: 'Beispiel: 380.000 € Kaufpreis, 25 % Boden, 2 % AfA, 42 % Steuersatz',
      inputValues: [{ label: 'Gesamtkaufpreis', value: '380.000 €' }, { label: 'Bodenanteil', value: '25 %' }, { label: 'AfA-Satz', value: '2,0 %' }],
      steps: ['Gebäudeanteil: 380.000 € × 0,75 = 285.000 €', 'Jährliche AfA: 285.000 € × 0,02 = 5.700 €', 'Steuerersparnis: 5.700 € × 0,42 = 2.394 € pro Jahr'],
      result: '2.394,00 € jährliche Steuerersparnis',
    },
    content: {
      intro: 'Die Absetzung für Abnutzung (AfA nach § 7 Abs. 4 EStG) mindert das steuerpflichtige Einkommen von Vermietern durch die steuerliche Abschreibung des Gebäudewerts.',
      details: 'Seit 2023 fertiggestellte Wohngebäude werden mit linear 3,0 % jährlich abgeschrieben. Für ältere Bestandsbauten (Fertigstellung nach 1924) gilt der Steuersatz von 2,0 % über 50 Jahre. Wichtig: Der Grundstücksanteil (Bodenwert) darf nicht abgeschrieben werden.',
    },
    faqs: [
      { question: 'Wie ermittelt man den Gebäudeanteil für die AfA?', answer: 'Über die offizielle Arbeitshilfe des Bundesfinanzministeriums zur Kaufpreisaufteilung auf Gebäude und Grund und Boden anhand von Bodenrichtwerten und Gebäudeherstellungskosten.' },
      { question: 'Gibt es für energieeffiziente Neubauten eine Sonder-AfA?', answer: 'Ja, für Neubauten mit Effizienzhaus-Standard 40 mit Qualitätssiegel Nachhaltiges Gebäude (QNG) existiert eine degressive AfA bzw. Sonder-AfA nach § 7b EStG.' },
    ],
    relatedSlugs: ['spekulationssteuer-immobilien-rechner', 'mietrendite-brutto-netto-rechner', 'kaufnebenkosten-rechner'],
  },

  {
    id: 'mietrendite-brutto-netto-rechner',
    slug: 'mietrendite-brutto-netto-rechner',
    name: 'Brutto- und Nettomietrendite-Rechner',
    shortName: 'Mietrendite berechnen',
    category: 'wohnen-immobilien',
    subcategory: 'Immobilienkauf & Finanzierung',
    metaTitle: 'Mietrendite Rechner – Brutto- – RechenHafen',
    metaDescription: 'Ermitteln Sie die Rentabilität einer Anlageimmobilie: Bruttomietrendite und exakte Nettomietrendite unter Einbezug aller Nebenkosten und Rücklagen.',
    h1: 'Mietrendite Rechner – Brutto- und Nettorendite für Vermieter',
    shortDescription: 'Vergleicht Brutto- und Nettomietrendite zur objektiven Bewertung von Kapitalanlage-Immobilien mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['mietrendite rechner', 'bruttomietrendite formel', 'nettomietrendite berechnen', 'immobilie rendite kapitalanlage'],
    inputs: [
      { id: 'purchasePrice', label: 'Immobilienkaufpreis', type: 'number', defaultValue: 250000, min: 10000, step: 5000, unit: '€' },
      { id: 'closingCosts', label: 'Kaufnebenkosten (Grunderwerbsteuer, Notar, Makler)', type: 'number', defaultValue: 25000, min: 0, step: 1000, unit: '€' },
      { id: 'monthlyColdRent', label: 'Monatliche Kaltmiete', type: 'number', defaultValue: 950, min: 50, step: 25, unit: '€' },
      { id: 'yearlyNonApportionable', label: 'Jährliche nicht umlegbare Kosten (Verwaltung & Rücklage)', type: 'number', defaultValue: 1400, min: 0, step: 100, unit: '€' },
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.purchasePrice) || 250000;
      const closing = parseFloat(inputs.closingCosts) || 25000;
      const rent = parseFloat(inputs.monthlyColdRent) || 950;
      const nonApp = parseFloat(inputs.yearlyNonApportionable) || 1400;
      const totalInvestment = price + closing;
      const yearlyGrossRent = rent * 12;
      const yearlyNetRent = yearlyGrossRent - nonApp;
      const grossYield = (yearlyGrossRent / price) * 100;
      const netYield = (yearlyNetRent / totalInvestment) * 100;
      const multiplier = price / yearlyGrossRent;
      return {
        primary: { id: 'netYield', label: 'Nettomietrendite', value: netYield, formattedValue: formatPercent(netYield, 2), highlight: true },
        secondary: [
          { id: 'grossYield', label: 'Bruttomietrendite', value: grossYield, formattedValue: formatPercent(grossYield, 2) },
          { id: 'multiplier', label: 'Kaufpreisfaktor (Vervielfältiger)', value: multiplier, formattedValue: `${formatNumber(multiplier, 1)}x` },
          { id: 'yearlyNetRent', label: 'Netto-Mieteinnahmen pro Jahr', value: yearlyNetRent, formattedValue: formatCurrency(yearlyNetRent) },
        ],
        summaryText: `Die Immobilie erzielt eine Bruttomietrendite von ${formatPercent(grossYield, 2)} und eine realistische Nettomietrendite von ${formatPercent(netYield, 2)} nach allen Nebenkosten.`,
      };
    },
    formula: 'Nettomietrendite = (Jahresnettokaltmiete - nicht umlegbare Kosten) / Gesamtkosten × 100',
    formulaExplanation: 'Die Bruttomietrendite berücksichtigt nur Kaufpreis und Kaltmiete. Die Nettomietrendite zeigt die reale Rendite nach Erwerbsnebenkosten, Verwaltung und Instandhaltung.',
    workedExample: {
      title: 'Beispiel: 250.000 € Kaufpreis + 25.000 € Nebenkosten bei 950 € Miete',
      inputValues: [{ label: 'Kaufpreis', value: '250.000 €' }, { label: 'Nebenkosten', value: '25.000 €' }, { label: 'Monatsmiete', value: '950 €' }, { label: 'Nicht umlegbar', value: '1.400 €' }],
      steps: ['Jahreskaltmiete: 950 € × 12 = 11.400 €', 'Bruttorendite: (11.400 € / 250.000 €) × 100 = 4,56 %', 'Reinertrag: 11.400 € - 1.400 € = 10.000 €', 'Nettorendite: (10.000 € / 275.000 €) × 100 = 3,64 %'],
      result: '3,64 % Nettomietrendite',
    },
    content: {
      intro: 'Dieser Vergleichsrechner stellt die simple Bruttomietrendite der realistischen Nettomietrendite gegenüber, um Scheingewinne bei Immobilienangeboten aufzudecken.',
      details: 'Bruttomietrendite = (Jahreskaltmiete / Kaufpreis) · 100. Nettomietrendite = (Jahreskaltmiete - nicht umlagefähige Kosten) / (Kaufpreis + Kaufnebenkosten) · 100. Die Nettorendite liegt typischerweise 1,0 bis 1,5 Prozentpunkte unter der Bruttorendite.',
    },
    faqs: [
      { question: 'Warum preisen Makler fast immer die Bruttomietrendite an?', answer: 'Weil die Bruttorendite deutlich höher wirkt, da sie Kaufnebenkosten (Grunderwerbsteuer, Notar, Makler) und laufende Instandhaltungsaufwendungen verschweigt.' },
      { question: 'Welche Kosten müssen von der Kaltmiete für die Nettorendite abgezogen werden?', answer: 'Verwaltergebühren, Instandhaltungsrücklage, Mietausfallwagnis (typisch 2 %) und Reparaturkosten.' },
    ],
    relatedSlugs: ['kaufpreis-faktor-rechner', 'mietbudget-rechner', 'abschreibung-immobilien-rechner', 'hausgeld-rechner', 'instandhaltungsruecklage-rechner'],
  },

  {
    id: 'vorfaelligkeitsentschaedigung-baufinanzierung-rechner',
    slug: 'vorfaelligkeitsentschaedigung-baufinanzierung-rechner',
    name: 'Vorfälligkeitsentschädigung Baufinanzierung-Rechner (Aktiv-Passiv-Methode)',
    shortName: 'Vorfälligkeitsentschädigung Baufinanzierung',
    category: 'wohnen-immobilien',
    subcategory: 'Immobilienkauf & Finanzierung',
    metaTitle: 'Vorfälligkeitsentschädigung Baufinanzierung Rechner',
    metaDescription: 'Berechnen Sie die Vorfälligkeitsentschädigung für Immobiliardarlehen nach der BGH Aktiv-Passiv-Methode bei vorzeitiger Kündigung.',
    h1: 'Vorfälligkeitsentschädigung Baufinanzierung – BGH-Methode',
    shortDescription: 'Schätzt die Bankenentschädigung bei vorzeitiger Kündigung eines Immobilienkredits nach der anerkannten Aktiv-Passiv-Methode.',
    searchKeywords: ['vorfaelligkeitsentschaedigung baufinanzierung', 'vorfaelligkeitsentschaedigung rechner', 'baufinanzierung vorzeitig kuendigen kosten', 'aktiv passiv methode bgh', 'schadensersatz bank zinsverlust'],
    inputs: [
      { id: 'remainingDebt', label: 'Aktuelle Restschuld des Darlehens', type: 'number', defaultValue: 180000, min: 10000, step: 5000, unit: '€' },
      { id: 'contractRate', label: 'Vereinbarter Darlehenszins p.a.', type: 'number', defaultValue: 4.2, min: 0.5, step: 0.1, unit: '%' },
      { id: 'reinvestmentRate', label: 'Aktuelle Wiederanlage-Rendite (z. B. Bundesanleihen)', type: 'number', defaultValue: 2.4, min: 0, step: 0.1, unit: '%' },
      { id: 'remainingYears', label: 'Restliche Zinsbindungszeit in Jahren (max. 10 Jahre)', type: 'number', defaultValue: 4, min: 0.5, max: 10, step: 0.5, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const debt = parseFloat(inputs.remainingDebt) || 180000;
      const contract = parseFloat(inputs.contractRate) || 4.2;
      const reinvest = parseFloat(inputs.reinvestmentRate) || 2.4;
      const years = parseFloat(inputs.remainingYears) || 4;
      const interestDiff = Math.max(0, contract - reinvest);
      // Zinsverschlechterungsschaden grob geschätzt (unter Berücksichtigung ersparter Risiko- und Verwaltungskosten ca. 0,15 %)
      const netDiff = Math.max(0, interestDiff - 0.15);
      const compensation = debt * (netDiff / 100) * years * 0.90; // Barwert-Abzinsung ca. 90%
      return {
        primary: { id: 'compensation', label: 'Geschätzte Vorfälligkeitsentschädigung', value: compensation, formattedValue: formatCurrency(compensation), highlight: true },
        secondary: [
          { id: 'interestDiff', label: 'Zinsdifferenz p.a.', value: interestDiff, formattedValue: formatPercent(interestDiff, 2) },
          { id: 'pctOfDebt', label: 'Anteil an der Restschuld', value: (compensation / debt) * 100, formattedValue: formatPercent((compensation / debt) * 100, 2) },
        ],
        summaryText: `Bei einer Zinsdifferenz von ${formatPercent(interestDiff, 2)} und ${years} Jahren Restlaufzeit verlangt die Bank voraussichtlich ca. ${formatCurrency(compensation)} Entschädigung.`,
      };
    },
    formula: 'Entschädigung ≈ Restschuld × Zinsdifferenz × Restjahre (Barwertberechnung)',
    formulaExplanation: 'Die Bank berechnet den Zinsschaden nach der BGH-konformen Aktiv-Passiv-Methode: Differenz zwischen Vertragszins und Rendite sicherer Kapitalmarkttitel abzüglich ersparter Verwaltungs- und Risikokosten.',
    workedExample: {
      title: 'Beispiel: 180.000 € Restschuld, 4,2 % Zins, 2,4 % Wiederanlage, 4 Jahre Rest',
      inputValues: [{ label: 'Restschuld', value: '180.000 €' }, { label: 'Vertragszins', value: '4,2 %' }, { label: 'Wiederanlage', value: '2,4 %' }, { label: 'Restlaufzeit', value: '4 Jahre' }],
      steps: ['Zinsdifferenz: 4,2 % - 2,4 % = 1,80 %', 'Bereinigt um Risiko/Kosten ≈ 1,65 %', 'Geschätzter Barwertschaden ≈ 10.600 €'],
      result: 'ca. 10.692,00 € Entschädigung',
    },
    content: {
      intro: 'Kündigen Eigentümer ein Festzinsdarlehen vor Ablauf der Zinsbindung wegen Immobilienverkaufs, berechnet die Bank ihren Zinsschaden nach der vom Bundesgerichtshof (BGH) anerkannten Aktiv-Passiv-Methode.',
      details: 'Die Bank vergleicht die vertraglich vereinbarten Zinsen mit der Wiederanlage der Restsumme in sicheren Pfandbriefen über die Restlaufzeit. Ersparte Verwaltungskosten und Risikoabschläge müssen abgezogen werden.',
    },
    faqs: [
      { question: 'Kann die Vorfälligkeitsentschädigung bei Immobilienverkauf vermieden werden?', answer: 'Ja, wenn der Käufer der Immobilie das bestehende Darlehen zu den alten Konditionen übernimmt (Schuldnerwechsel) und die Bank zustimmt.' },
      { question: 'Darf die Bank nach 10 Jahren noch eine Entschädigung verlangen?', answer: 'Nein, nach § 489 Abs. 1 Nr. 2 BGB steht Darlehensnehmern nach Ablauf von 10 Jahren ein gesetzliches, gebührenfreies Kündigungsrecht mit 6 Monaten Frist zu.' },
    ],
    relatedSlugs: ['kredit-restschuld-stichtag-rechner', 'tilgungsrechner', 'sondertilgungsrechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'BGH-Rechtsprechung zur Aktiv-Passiv-Methode (XI ZR 197/00) & Deutsche Bundesbank',
      sourceUrl: 'https://www.bundesbank.de',
      lastVerified: '2026-01-15',
    },
  },

  {
    id: 'abstandszahlung-rechner',
    slug: 'abstandszahlung-rechner',
    name: 'Abstandszahlung & Zeitwert-Rechner (Küche & Möbel)',
    shortName: 'Abstandszahlung Zeitwert',
    category: 'wohnen-immobilien',
    subcategory: 'Miete & Mietrecht',
    metaTitle: 'Abstandszahlung Rechner – Zeitwert für Einbauküche',
    metaDescription: 'Ermitteln Sie den fairen und rechtssicheren Zeitwert für gebrauchte Küchen und Einrichtungsgegenstände nach linearer AfA und Kölner Tabelle.',
    h1: 'Abstandszahlung Rechner – Zeitwert für Küche & Möbel ermitteln',
    shortDescription: 'Berechnet den realistischen Zeitwert für Möbel und Küchen bei Wohnungsübernahme.',
    searchKeywords: ['abstandszahlung rechner', 'zeitwert einbaukueche berechnen', 'koelner tabelle moebel zeitwert', 'paragraph 4a woblauwg abstand'],
    inputs: [
      { id: 'originalPrice', label: 'Neupreis der Einbauküche / Möbel (Rechnung)', type: 'number', defaultValue: 6000, min: 100, step: 100, unit: '€' },
      { id: 'ageYears', label: 'Alter in Jahren', type: 'number', defaultValue: 4, min: 0, max: 30, step: 0.5, unit: 'Jahre' },
      { id: 'totalLifespan', label: 'Angenommene Gesamtnutzungsdauer (Küche üblich 15-20 Jahre)', type: 'number', defaultValue: 15, min: 3, max: 30, step: 1, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const orig = parseFloat(inputs.originalPrice) || 6000;
      const age = parseFloat(inputs.ageYears) || 4;
      const life = parseFloat(inputs.totalLifespan) || 15;
      // Nach gängiger Rechtsprechung: Im ersten Jahr Wertverlust ca. 24 %, danach lineare Abschreibung des Restwerts
      let zeitwert = 0;
      if (age <= 1) {
        zeitwert = orig * (1 - (age * 0.24));
      } else {
        const valAfterYear1 = orig * 0.76;
        const remainingYears = life - 1;
        const yearlyDep = valAfterYear1 / remainingYears;
        zeitwert = Math.max(0, valAfterYear1 - ((age - 1) * yearlyDep));
      }
      return {
        primary: { id: 'zeitwert', label: 'Empfohlener Zeitwert (Faire Abstandszahlung)', value: zeitwert, formattedValue: formatCurrency(zeitwert), highlight: true },
        secondary: [
          { id: 'depreciationTotal', label: 'Bisheriger Wertverlust', value: orig - zeitwert, formattedValue: formatCurrency(orig - zeitwert) },
          { id: 'pctRemaining', label: 'Verbleibender Restwert', value: (zeitwert / orig) * 100, formattedValue: formatPercent((zeitwert / orig) * 100, 1) },
        ],
        summaryText: `Nach ${age} Jahren beträgt der faire Zeitwert der ursprünglich ${formatCurrency(orig)} teuren Anschaffung noch ${formatCurrency(zeitwert)} (${formatPercent((zeitwert / orig) * 100, 1)} des Neupreises).`,
      };
    },
    formula: 'Zeitwert = Neupreis abzüglich altersüblicher Wertminderung nach Rechtsprechung',
    formulaExplanation: 'Nach § 4a WoVermittG ist eine Vereinbarung über ein Entgelt für Einrichtungsgegenstände unwirksam, soweit das Entgelt in einem auffälligen Missverhältnis zum Wert steht (über 50 % über Zeitwert ist strafbar).',
    workedExample: {
      title: 'Beispiel: 6.000 € Küche nach 4 Jahren bei 15 Jahren Nutzungsdauer',
      inputValues: [{ label: 'Neupreis', value: '6.000 €' }, { label: 'Alter', value: '4 Jahre' }, { label: 'Nutzungsdauer', value: '15 Jahre' }],
      steps: ['Wert nach Jahr 1: 6.000 € × 0,76 = 4.560 €', 'Jahresabschreibung: 4.560 € / 14 = 325,71 €/Jahr', 'Zeitwert nach 4 Jahren = 4.560 € - (3 × 325,71 €) ≈ 3.582,86 €'],
      result: 'ca. 3.582,86 € Zeitwert',
    },
    content: {
      intro: 'Dieser Wertermittler kalkuliert den angemessenen Zeitwert von Möbeln oder Einbauküchen, die vom Vormieter an den Nachmieter übergeben werden.',
      details: 'Nach § 4a Wohnungsvermittlungsgesetz (WoVermG) sind Vereinbarungen unwirksam, wenn das Entgelt in einem auffälligen Missverhältnis zum Wert der Einrichtung steht (mehr als 50 % über dem tatsächlichen Zeitwert).',
    },
    faqs: [
      { question: 'Wie berechnet man den Zeitwert einer Einbauküche fair?', answer: 'Nach der linearen Abschreibung: Anschaffungspreis abzüglich ca. 24 % Wertverlust im ersten Jahr und danach jährlich ca. 8 % über eine Gesamtnutzungsdauer von 10 Jahren.' },
      { question: 'Darf der Vormieter den Mietvertrag an eine Abstandsübernahme koppeln?', answer: 'Nein, nur der Vermieter entscheidet über den Mietvertragsabschluss; Koppelungsgeschäfte durch Vormieter sind rechtlich unzulässig.' },
    ],
    relatedSlugs: ['mietkaution-zinsen-rechner', 'warmmiete-zu-kaltmiete-rechner', 'mietbelastungsquote-rechner'],
  },

  {
    id: 'warmmiete-zu-kaltmiete-rechner',
    slug: 'warmmiete-zu-kaltmiete-rechner',
    name: 'Warmmiete zu Kaltmiete-Rechner (Betriebskostenspiegel)',
    shortName: 'Warmmiete zu Kaltmiete',
    category: 'wohnen-immobilien',
    subcategory: 'Miete & Mietrecht',
    metaTitle: 'Warmmiete zu Kaltmiete Rechner – Nebenkosten',
    metaDescription: 'Rechnen Sie Warmmiete in Kaltmiete oder Kaltmiete in Warmmiete um anhand des bundesweiten Betriebskostenspiegels (durchschnittlich 2,80 € bis 3,60 €/m²).',
    h1: 'Warmmiete zu Kaltmiete Rechner – Nebenkostenanteil ermitteln',
    shortDescription: 'Schlüsselt Bruttowarmmieten in Nettokaltmiete und Nebenkostenvorauszahlung auf mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['warmmiete zu kaltmiete rechner', 'kaltmiete aus warmmiete berechnen', 'betriebskostenspiegel nebenkosten pro qm', 'bruttomiete nettomiete'],
    inputs: [
      { id: 'warmRent', label: 'Monatliche Warmmiete (Bruttomiete)', type: 'number', defaultValue: 1050, min: 100, step: 25, unit: '€' },
      { id: 'livingArea', label: 'Wohnfläche in m²', type: 'number', defaultValue: 70, min: 15, max: 300, step: 5, unit: 'm²' },
      { id: 'utilPerSqm', label: 'Geschätzte Nebenkosten pro m² (Durchschnitt DMB ca. 3,10 €)', type: 'number', defaultValue: 3.10, min: 1.0, max: 6.0, step: 0.1, unit: '€/m²' },
    ],
    calculate: (inputs) => {
      const warm = parseFloat(inputs.warmRent) || 1050;
      const area = parseFloat(inputs.livingArea) || 70;
      const rate = parseFloat(inputs.utilPerSqm) || 3.10;
      const utilities = area * rate;
      const coldRent = Math.max(0, warm - utilities);
      const coldRentPerSqm = coldRent / area;
      return {
        primary: { id: 'coldRent', label: 'Errechnete Kaltmiete (Nettomiete)', value: coldRent, formattedValue: formatCurrency(coldRent), highlight: true },
        secondary: [
          { id: 'utilities', label: 'Nebenkostenvorauszahlung (2. Miete)', value: utilities, formattedValue: formatCurrency(utilities) },
          { id: 'coldRentPerSqm', label: 'Kaltmiete pro m²', value: coldRentPerSqm, formattedValue: `${formatNumber(coldRentPerSqm, 2)} €/m²` },
          { id: 'utilPct', label: 'Anteil der Nebenkosten an Warmmiete', value: (utilities / warm) * 100, formattedValue: formatPercent((utilities / warm) * 100, 1) },
        ],
        summaryText: `Bei ${formatCurrency(warm)} Warmmiete für ${area} m² entfallen ca. ${formatCurrency(utilities)} auf Nebenkosten und ${formatCurrency(coldRent)} auf die reine Nettokaltmiete (${formatNumber(coldRentPerSqm, 2)} €/m²).`,
      };
    },
    formula: 'Kaltmiete = Warmmiete - (Wohnfläche × Nebenkostensatz pro m²)',
    formulaExplanation: 'Der Deutsche Mieterbund (DMB) veröffentlicht regelmäßig den Betriebskostenspiegel für warme und kalte Nebenkosten.',
    workedExample: {
      title: 'Beispiel: 1.050 € Warmmiete für 70 m² bei 3,10 €/m² Nebenkosten',
      inputValues: [{ label: 'Warmmiete', value: '1.050 €' }, { label: 'Wohnfläche', value: '70 m²' }, { label: 'Nebenkosten/m²', value: '3,10 €' }],
      steps: ['Nebenkosten = 70 m² × 3,10 € = 217,00 €', 'Kaltmiete = 1.050 € - 217 € = 833,00 €'],
      result: '833,00 € monatliche Kaltmiete',
    },
    content: {
      intro: 'Dieser Rechner trennt die reine Grundmiete (Kaltmiete) von den kalten Betriebskosten und Heizkostenvorauszahlungen der Warmmiete.',
      details: 'Kaltmiete = Warmmiete - Heizkosten - kalte Betriebskosten. Die Kaltmiete bildet die rechtliche Vergleichsgröße für Mietspiegel und die Begrenzungen der Mietpreisbremse.',
    },
    faqs: [
      { question: 'Darf der Vermieter bei gestiegenen Energiepreisen die Vorauszahlungen anheben?', answer: 'Nach § 560 Abs. 4 BGB darf jede Partei nach einer Abrechnung durch schriftliche Erklärung eine Anpassung der Vorauszahlungen auf eine angemessene Höhe vornehmen.' },
      { question: 'Welche Posten gehören zu den kalten Nebenkosten?', answer: 'Grundsteuer, Wasser/Abwasser, Müllabfuhr, Gebäudeversicherung, Straßenreinigung, Hausmeister, Gartenpflege und Beleuchtung.' },
    ],
    relatedSlugs: ['co2-abgabe-vermieter-mieter-rechner', 'untermiete-rechner', 'abstandszahlung-rechner', 'mietbelastungsquote-rechner', 'mietminderung-rechner', 'stromkostenrechner'],
  },

  {
    id: 'untermiete-rechner',
    slug: 'untermiete-rechner',
    name: 'Untermiete-Rechner (Mietanteil & Untermietzuschlag)',
    shortName: 'Untermiete berechnen',
    category: 'wohnen-immobilien',
    subcategory: 'Miete & Mietrecht',
    metaTitle: 'Untermiete Rechner – Mietanteil für WG-Zimmer',
    metaDescription: 'Berechnen Sie den fairen Mietanteil für Untermieter und WG-Zimmer nach Zimmerfläche, Gemeinschaftsflächen und möglichem Vermieter-Untermietzuschlag.',
    h1: 'Untermiete Rechner – Zimmer-Untervermietung kalkulieren',
    shortDescription: 'Kalkuliert die Untermiete für WG-Zimmer inklusive Gemeinschaftsflächen und Möblierungszuschlag mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['untermiete rechner', 'untermietzuschlag berechnen', 'wg zimmer untermiete qm anteil', 'paragraph 553 bgb untervermietung'],
    inputs: [
      { id: 'totalWarmRent', label: 'Gesamte Warmmiete der Wohnung', type: 'number', defaultValue: 1200, min: 200, step: 25, unit: '€' },
      { id: 'totalApartmentArea', label: 'Gesamtwohnfläche der Wohnung in m²', type: 'number', defaultValue: 80, min: 20, step: 5, unit: 'm²' },
      { id: 'subletRoomArea', label: 'Größe des untervermieteten Zimmers in m²', type: 'number', defaultValue: 20, min: 5, step: 1, unit: 'm²' },
      { id: 'furnishingSurcharge', label: 'Monatlicher Möblierungs- & WLAN-Zuschlag', type: 'number', defaultValue: 40, min: 0, step: 5, unit: '€' },
    ],
    calculate: (inputs) => {
      const totalRent = parseFloat(inputs.totalWarmRent) || 1200;
      const totalArea = parseFloat(inputs.totalApartmentArea) || 80;
      const roomArea = parseFloat(inputs.subletRoomArea) || 20;
      const surcharge = parseFloat(inputs.furnishingSurcharge) || 40;
      // Modell: Untermieter nutzt Zimmer exklusiv + halben Anteil an Restfläche (Küche, Bad, Flur)
      const commonArea = Math.max(0, totalArea - (roomArea * 2));
      const subRatio = (roomArea + (commonArea / 2)) / totalArea;
      const baseSubRent = totalRent * subRatio;
      const totalSubRent = baseSubRent + surcharge;
      return {
        primary: { id: 'totalSubRent', label: 'Empfohlene Warm-Untermiete', value: totalSubRent, formattedValue: formatCurrency(totalSubRent), highlight: true },
        secondary: [
          { id: 'baseSubRent', label: 'Flächenanteil an Warmmiete', value: baseSubRent, formattedValue: formatCurrency(baseSubRent) },
          { id: 'subRatio', label: 'Anteil an Gesamtwohnfläche', value: subRatio * 100, formattedValue: formatPercent(subRatio * 100, 1) },
          { id: 'surcharge', label: 'Möblierungs- & Pauschalzuschlag', value: surcharge, formattedValue: formatCurrency(surcharge) },
        ],
        summaryText: `Für das ${roomArea} m² große Zimmer ergibt sich inklusive Gemeinschaftsnutzung und Zuschlägen eine angemessene Untermiete von ${formatCurrency(totalSubRent)} monatlich.`,
      };
    },
    formula: 'Untermiete = Warmmiete × Nutzungsflächenanteil + Zuschläge',
    formulaExplanation: 'Bei berechtigtem Interesse hat der Mieter nach § 553 BGB einen Anspruch auf Erlaubnis zur Untervermietung. Der Vermieter kann einen angemessenen Untermietzuschlag verlangen.',
    workedExample: {
      title: 'Beispiel: 20 m² Zimmer in 80 m² Wohnung bei 1.200 € Warmmiete',
      inputValues: [{ label: 'Gesamtmiete', value: '1.200 €' }, { label: 'Gesamtfläche', value: '80 m²' }, { label: 'Zimmergröße', value: '20 m²' }],
      steps: ['Reine Zimmerfläche: 25 % der Wohnung', 'Inkl. Küche/Bad anteilig: ca. 37,5 %', 'Anteil: 1.200 € × 0,375 = 450 € + 40 € Zuschlag = 490 €'],
      result: '490,00 € monatliche Untermiete',
    },
    content: {
      intro: 'Dieser Rechner kalkuliert den fairen Mietanteil und die Nebenkostenumlage bei der Untervermietung einzelner Zimmer an Mitbewohner oder Zwischenmieter.',
      details: 'Kostenanteil = Warmmiete · (Zimmerfläche + anteilige Gemeinschaftsfläche) / Gesamtwohnfläche. Für möblierte Zimmer kann ein angemessener Möblierungszuschlag erhoben werden.',
    },
    faqs: [
      { question: 'Benötigt man für die Untervermietung die Erlaubnis des Vermieters?', answer: 'Ja, nach § 553 BGB muss die Erlaubnis eingeholt werden. Bei berechtigtem Interesse (z. B. finanzielle Entlastung, Auslandsaufenthalt) hat der Mieter jedoch einen Rechtsanspruch auf Genehmigung.' },
      { question: 'Müssen Mieteinnahmen aus Untervermietung versteuert werden?', answer: 'Einnahmen aus Untervermietung müssen in der Steuererklärung angegeben werden; die eigene gezahlte Miete für das Zimmer kann jedoch als Werbungskosten voll gegengerechnet werden.' },
    ],
    relatedSlugs: ['warmmiete-zu-kaltmiete-rechner', 'mietminderung-rechner', 'mietkaution-zinsen-rechner'],
  },

  {
    id: 'erbbaurecht-erbbauzins-rechner',
    slug: 'erbbaurecht-erbbauzins-rechner',
    name: 'Erbbauzins-Rechner (Erbbaurecht / Pachtzins)',
    shortName: 'Erbbauzins berechnen',
    category: 'wohnen-immobilien',
    subcategory: 'Immobilienkauf & Finanzierung',
    metaTitle: 'Erbbauzins Rechner – Jährlichen Erbbauzins nach Bodenwert b...',
    metaDescription: 'Ermitteln Sie die jährliche und monatliche Erbbauzinszahlung für Grundstücke bei Erbbaurecht (üblich 3 % bis 5 % des Bodenwerts).',
    h1: 'Erbbauzins Rechner – Erbbaurecht & Pachtzins berechnen',
    shortDescription: 'Berechnet den Erbbauzins auf Basis des Bodenrichtwerts für Erbpacht-Grundstücke mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['erbbauzins rechner', 'erbbaurecht kosten pro jahr', 'erbpacht zins berechnen bodenwert', 'erbbaurechtsgesetz rechner'],
    inputs: [
      { id: 'landValue', label: 'Bodenwert des Baugrundstücks', type: 'number', defaultValue: 180000, min: 10000, step: 5000, unit: '€' },
      { id: 'interestRate', label: 'Erbbauzins-Satz p.a. (üblich 3 % bis 5 %)', type: 'number', defaultValue: 4.0, min: 1.0, max: 8.0, step: 0.1, unit: '%' },
      { id: 'leaseYears', label: 'Laufzeit des Erbbaurechts in Jahren', type: 'number', defaultValue: 99, min: 20, max: 99, step: 1, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const land = parseFloat(inputs.landValue) || 180000;
      const rate = (parseFloat(inputs.interestRate) || 4.0) / 100;
      const years = parseInt(inputs.leaseYears, 10) || 99;
      const yearly = land * rate;
      const monthly = yearly / 12;
      const totalOverTerm = yearly * years;
      return {
        primary: { id: 'yearly', label: 'Jährlicher Erbbauzins', value: yearly, formattedValue: formatCurrency(yearly), highlight: true },
        secondary: [
          { id: 'monthly', label: 'Monatlicher Erbbauzins', value: monthly, formattedValue: formatCurrency(monthly) },
          { id: 'totalOverTerm', label: `Gesamtzins über ${years} Jahre`, value: totalOverTerm, formattedValue: formatCurrency(totalOverTerm) },
        ],
        summaryText: `Bei einem Bodenwert von ${formatCurrency(land)} und ${formatPercent(rate * 100, 1)} Zinssatz zahlen Sie jährlich ${formatCurrency(yearly)} (${formatCurrency(monthly)} pro Monat).`,
      };
    },
    formula: 'Jährlicher Erbbauzins = Bodenwert × Erbbauzinssatz',
    formulaExplanation: 'Das Erbbaurecht nach dem Erbbaurechtsgesetz (ErbbauRG) gewährt das veräußerliche und vererbliche Recht, auf fremdem Grund und Boden ein Bauwerk zu haben.',
    workedExample: {
      title: 'Beispiel: 180.000 € Grundstück zu 4,0 % Erbbauzins',
      inputValues: [{ label: 'Bodenwert', value: '180.000 €' }, { label: 'Zinssatz', value: '4,0 %' }],
      steps: ['Jährlich: 180.000 € × 0,04 = 7.200 €', 'Monatlich: 7.200 € / 12 = 600 €'],
      result: '7.200,00 € pro Jahr (600 €/Monat)',
    },
    content: {
      intro: 'Beim Erbbaurecht (Erbbaurechtsgesetz, ErbbauRG) erwerben Sie ein Gebäude auf einem fremden Grundstück und zahlen dem Grundstückseigentümer dafür einen laufenden Erbbauzins.',
      details: 'Erbbauzins = Grundstückswert · Zinssatz (üblich 3 bis 5 Prozent p.a.). Typische Vertragslaufzeiten betragen 75 bis 99 Jahre. Der Zinssatz ist in der Regel über Wertsicherungsklauseln an den Verbraucherpreisindex gekoppelt.',
    },
    faqs: [
      { question: 'Was geschieht bei Ablauf des Erbbaurechtsvertrags (Heimfall)?', answer: 'Das Eigentum am Gebäude geht auf den Grundstückseigentümer über; dieser muss dem Erbbaurechtsnehmer nach § 27 ErbbauRG eine angemessene Entschädigung (meist mind. 2/3 des Gebäudewerts) zahlen.' },
      { question: 'Warum sind Erbbaurecht-Immobilien im Kaufpreis günstiger?', answer: 'Weil Sie das teure Grundstück nicht kaufen, sondern nur pachten; dadurch sinkt der anfängliche Kaufpreis erheblich, dafür fallen jedoch dauerhafte monatliche Zinsen an.' },
    ],
    relatedSlugs: ['grundsteuer-reform-rechner', 'mietbudget-rechner', 'kaufnebenkosten-rechner'],
  },

  {
    id: 'kaufpreis-faktor-rechner',
    slug: 'kaufpreis-faktor-rechner',
    name: 'Kaufpreisfaktor & Vervielfältiger-Rechner',
    shortName: 'Kaufpreisfaktor berechnen',
    category: 'wohnen-immobilien',
    subcategory: 'Immobilienkauf & Finanzierung',
    metaTitle: 'Kaufpreisfaktor Rechner – Vervielfältiger für Immobilienbew...',
    metaDescription: 'Ermitteln Sie den Kaufpreisfaktor (Vervielfältiger) und die entsprechende Bruttomietrendite zur schnellen Ersteinschätzung von Immobilienangeboten.',
    h1: 'Kaufpreisfaktor Rechner – Immobilien-Vervielfältiger ermitteln',
    shortDescription: 'Berechnet das Verhältnis von Kaufpreis zu Jahresnettokaltmiete mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['kaufpreisfaktor rechner', 'vervielfaeltiger immobilie berechnen', 'maklerfaktor jahresnettokaltmiete', 'faktor 20 oder 25 immobilie'],
    inputs: [
      { id: 'purchasePrice', label: 'Kaufpreis der Immobilie (ohne Nebenkosten)', type: 'number', defaultValue: 280000, min: 10000, step: 5000, unit: '€' },
      { id: 'yearlyRent', label: 'Jahres-Nettokaltmiete', type: 'number', defaultValue: 11200, min: 500, step: 100, unit: '€' },
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.purchasePrice) || 280000;
      const rent = parseFloat(inputs.yearlyRent) || 11200;
      const factor = price / rent;
      const yieldPct = (rent / price) * 100;
      let rating = 'Sehr günstig / Hohe Rendite';
      if (factor > 30) rating = 'Teuer / Niedrige Mietrendite';
      else if (factor > 24) rating = 'Marktüblich in guten Lagen';
      else if (factor > 18) rating = 'Solide Rentabilität';
      return {
        primary: { id: 'factor', label: 'Kaufpreisfaktor (Vervielfältiger)', value: factor, formattedValue: `${formatNumber(factor, 1)}x`, highlight: true },
        secondary: [
          { id: 'yieldPct', label: 'Bruttomietrendite', value: yieldPct, formattedValue: formatPercent(yieldPct, 2) },
          { id: 'monthlyRent', label: 'Monatliche Kaltmiete', value: rent / 12, formattedValue: formatCurrency(rent / 12) },
          { id: 'rating', label: 'Marktbewertung', value: 0, formattedValue: rating },
        ],
        summaryText: `Ein Faktor von ${formatNumber(factor, 1)} bedeutet, dass der Kaufpreis ${formatNumber(factor, 1)} Jahreskaltmieten entspricht (entspricht ${formatPercent(yieldPct, 2)} Bruttorendite).`,
      };
    },
    formula: 'Kaufpreisfaktor = Kaufpreis / Jahresnettokaltmiete; Rendite = 100 / Faktor',
    formulaExplanation: 'Der Kaufpreisfaktor ist eine der schnellsten Daumenregeln der Immobilienwirtschaft: Je niedriger der Faktor, desto schneller amortisiert sich der Kauf durch Mieteinnahmen.',
    workedExample: {
      title: 'Beispiel: 280.000 € Kaufpreis bei 11.200 € Jahreskaltmiete',
      inputValues: [{ label: 'Kaufpreis', value: '280.000 €' }, { label: 'Jahresmiete', value: '11.200 €' }],
      steps: ['Faktor = 280.000 € / 11.200 € = 25,0', 'Bruttorendite = 100 / 25 = 4,00 %'],
      result: 'Faktor 25,0 (4,00 % Rendite)',
    },
    content: {
      intro: 'Der Kaufpreisfaktor (Vervielfältiger) beziffert das Verhältnis von Kaufpreis zu jährlicher Nettokaltmiete und gibt an, nach wie vielen Jahren sich die Immobilie refinanziert.',
      details: 'Faktor = Kaufpreis / Jahresnettokaltmiete. Ein Faktor von 20 entspricht einer Bruttorendite von 5,0 % (100 / Faktor). Faktoren unter 20 gelten als günstig, zwischen 20 und 25 als marktgerecht, über 30 als teuer.',
    },
    faqs: [
      { question: 'Wie rechnet man den Kaufpreisfaktor in Bruttorendite um?', answer: 'Teilen Sie 100 durch den Faktor: Faktor 25 entspricht 100 / 25 = 4,0 % Rendite; Faktor 33 entspricht 100 / 33 = 3,03 % Rendite.' },
      { question: 'Welcher Faktor ist für deutsche Großstädte wie München oder Berlin typisch?', answer: 'In Top-Lagen der Metropolen lagen die Faktoren in den letzten Jahren oft bei 30 bis 38, während in soliden Mittelstädten Faktoren von 18 bis 24 üblich sind.' },
    ],
    relatedSlugs: ['mietrendite-brutto-netto-rechner', 'mietbudget-rechner', 'kaufnebenkosten-rechner'],
  },

  // ==================== HAUSHALT & ENERGIE (21 ZUSÄTZLICHE) ====================
  {
    id: 'stromkosten-geraete-rechner',
    slug: 'stromkosten-geraete-rechner',
    name: 'Stromkosten-Rechner für Elektrogeräte (Watt in Euro)',
    shortName: 'Stromkosten Geräte',
    category: 'haushalt-energie',
    subcategory: 'Strom & Sparen',
    metaTitle: 'Stromkosten Rechner Geräte – Watt in kWh',
    metaDescription: 'Berechnen Sie die Stromkosten einzelner Haushaltsgeräte in Euro pro Tag, Monat und Jahr anhand von Leistungsaufnahme (Watt) und Strompreis.',
    h1: 'Stromkosten Rechner für Geräte – Watt in Euro umrechnen',
    shortDescription: 'Ermittelt den Stromverbrauch und die jährlichen Stromkosten für beliebige Haushaltsgeräte.',
    searchKeywords: ['stromkosten rechner geraete', 'watt in euro umrechnen', 'kwh rechner stromkosten', 'stromverbrauch haushalt berechnen'],
    inputs: [
      { id: 'powerWatts', label: 'Leistungsaufnahme des Geräts in Watt', type: 'number', defaultValue: 150, min: 1, step: 5, unit: 'W' },
      { id: 'hoursPerDay', label: 'Nutzungsdauer pro Tag in Stunden', type: 'number', defaultValue: 4, min: 0.1, max: 24, step: 0.5, unit: 'Std./Tag' },
      { id: 'electricityPrice', label: 'Strompreis in Cent pro kWh', type: 'number', defaultValue: 36, min: 10, max: 90, step: 0.5, unit: 'ct/kWh' },
    ],
    calculate: (inputs) => {
      const watts = parseFloat(inputs.powerWatts) || 150;
      const hours = parseFloat(inputs.hoursPerDay) || 4;
      const priceCent = parseFloat(inputs.electricityPrice) || 36;
      const kwhPerDay = (watts * hours) / 1000;
      const kwhPerYear = kwhPerDay * 365;
      const costYear = (kwhPerYear * priceCent) / 100;
      const costMonth = costYear / 12;
      return {
        primary: { id: 'costYear', label: 'Jährliche Stromkosten', value: costYear, formattedValue: formatCurrency(costYear), highlight: true },
        secondary: [
          { id: 'costMonth', label: 'Monatliche Kosten', value: costMonth, formattedValue: formatCurrency(costMonth) },
          { id: 'kwhPerYear', label: 'Stromverbrauch pro Jahr', value: kwhPerYear, formattedValue: `${formatNumber(kwhPerYear, 1)} kWh` },
          { id: 'costDay', label: 'Kosten pro Tag', value: costYear / 365, formattedValue: formatCurrency(costYear / 365) },
        ],
        summaryText: `Bei ${watts} Watt und ${hours} Stunden täglich verbraucht das Gerät ${formatNumber(kwhPerYear, 1)} kWh im Jahr. Das kostet ca. ${formatCurrency(costYear)} jährlich (${formatCurrency(costMonth)}/Monat).`,
      };
    },
    formula: 'Kosten/Jahr = (Watt × Stunden/Tag × 365 / 1000) × Strompreis in €',
    formulaExplanation: 'Watt dividiert durch 1.000 ergibt Kilowatt (kW). Multipliziert mit den Betriebsstunden und dem Arbeitspreis je kWh erhält man die Gesamtkosten.',
    workedExample: {
      title: 'Beispiel: 150-Watt Fernseher 4 Stunden täglich bei 36 ct/kWh',
      inputValues: [{ label: 'Leistung', value: '150 Watt' }, { label: 'Betriebszeit', value: '4 Std./Tag' }, { label: 'Strompreis', value: '36 ct/kWh' }],
      steps: ['Täglich: 150 W × 4 h = 600 Wh = 0,6 kWh/Tag', 'Jährlich: 0,6 kWh × 365 = 219 kWh', 'Kosten: 219 kWh × 0,36 € = 78,84 €'],
      result: '78,84 € Stromkosten pro Jahr',
    },
    content: {
      intro: 'Dieser Gerätekostenrechner beziffert die laufenden Kosten einzelner Verbraucher (Waschmaschine, PC, Backofen, Heizlüfter) pro Nutzung, Tag, Monat und Jahr.',
      details: 'Kosten = (Leistung in Watt / 1.000) · Betriebsstunden · Strompreis je kWh. Ein Heizlüfter mit 2.000 Watt verursacht bei 35 Cent/kWh pro Betriebsstunde bereits 0,70 Euro Stromkosten.',
    },
    faqs: [
      { question: 'Welches Haushaltsgerät verbraucht im Jahr am meisten Strom?', answer: 'In der Regel Kühl- und Gefriergeräte (durch den Dauerbetrieb 24/7), gefolgt von elektrischer Warmwasserbereitung, Wäschetrocknern und Gaming-PCs.' },
      { question: 'Wie misst man den echten Stromverbrauch einzelner Geräte?', answer: 'Mit einem digitalen Energiekosten-Messgerät für die Steckdose, das die tatsächliche Leistungsaufnahme über mehrere Tage und Betriebszyklen aufzeichnet.' },
    ],
    relatedSlugs: ['klimaanlage-stromkosten-rechner', 'fernseher-stromkosten-rechner', 'stromkostenrechner', 'gasverbrauch-kwh-m3-rechner', 'led-sparrechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'BDEW Bundesverband der Energie- und Wasserwirtschaft',
      sourceUrl: 'https://www.bdew.de',
      lastVerified: '2026-01-20',
    },
  },

  {
    id: 'gasverbrauch-kwh-m3-rechner',
    slug: 'gasverbrauch-kwh-m3-rechner',
    name: 'Gasverbrauch Umrechner (m³ in kWh & Gaskosten)',
    shortName: 'Gasverbrauch m³ in kWh',
    category: 'haushalt-energie',
    subcategory: 'Heizung & Gas',
    metaTitle: 'Gasverbrauch m³ in kWh Umrechner – Formel',
    metaDescription: 'Rechnen Sie Ihren Gaszählerstand von Kubikmetern (m³) in Kilowattstunden (kWh) um: m³ × Brennwert × Zustandszahl (z-Zahl) inklusive Kostenkalkulation.',
    h1: 'Gasverbrauch Umrechner – m³ in kWh & Gaskosten berechnen',
    shortDescription: 'Wandelt abgelesene Kubikmeter vom Gaszähler in verrechnete Kilowattstunden um mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['gasverbrauch m3 in kwh rechner', 'gaszaehler umrechnen formel', 'brennwert zustandszahl gas', 'gaskosten berechnen kwh'],
    inputs: [
      { id: 'gasCubicMeters', label: 'Abgelesener Gasverbrauch in Kubikmetern (m³)', type: 'number', defaultValue: 1200, min: 1, step: 10, unit: 'm³' },
      { id: 'brennwert', label: 'Brennwert (üblich 10,2 bis 11,5 bei H-Gas)', type: 'number', defaultValue: 11.2, min: 8, max: 13, step: 0.1, unit: 'kWh/m³' },
      { id: 'zustandszahl', label: 'Zustandszahl z-Zahl (üblich ca. 0,95)', type: 'number', defaultValue: 0.95, min: 0.8, max: 1.1, step: 0.01 },
      { id: 'gasPricePerKwh', label: 'Gaspreis in Cent pro kWh', type: 'number', defaultValue: 10.5, min: 4, max: 30, step: 0.1, unit: 'ct/kWh' },
    ],
    calculate: (inputs) => {
      const m3 = parseFloat(inputs.gasCubicMeters) || 1200;
      const bw = parseFloat(inputs.brennwert) || 11.2;
      const z = parseFloat(inputs.zustandszahl) || 0.95;
      const price = parseFloat(inputs.gasPricePerKwh) || 10.5;
      const kwh = m3 * bw * z;
      const totalCost = (kwh * price) / 100;
      return {
        primary: { id: 'kwh', label: 'Verbrauch in Kilowattstunden', value: kwh, formattedValue: `${formatNumber(kwh, 0)} kWh`, highlight: true },
        secondary: [
          { id: 'totalCost', label: 'Gesamte Gaskosten', value: totalCost, formattedValue: formatCurrency(totalCost) },
          { id: 'monthlyCost', label: 'Monatlicher Abschlag', value: totalCost / 12, formattedValue: formatCurrency(totalCost / 12) },
          { id: 'costPerM3', label: 'Effektiver Preis pro m³', value: totalCost / m3, formattedValue: formatCurrency(totalCost / m3) },
        ],
        summaryText: `${formatNumber(m3, 0)} m³ Gas entsprechen ca. ${formatNumber(kwh, 0)} kWh Energie. Bei ${formatNumber(price, 1)} ct/kWh betragen die Kosten ${formatCurrency(totalCost)}.`,
      };
    },
    formula: 'Energie (kWh) = Kubikmeter (m³) × Brennwert × Zustandszahl (z)',
    formulaExplanation: 'Gaszähler messen das Betriebsvolumen in m³. Der Energiegehalt variiert nach Temperatur, Höhenlage (Zustandszahl) und Gasqualität (Brennwert).',
    workedExample: {
      title: 'Beispiel: 1.200 m³ mit Brennwert 11,2 und z-Zahl 0,95 bei 10,5 ct/kWh',
      inputValues: [{ label: 'Gasverbrauch', value: '1.200 m³' }, { label: 'Brennwert', value: '11,2' }, { label: 'z-Zahl', value: '0,95' }],
      steps: ['kWh = 1.200 × 11,2 × 0,95 = 12.768 kWh', 'Kosten = 12.768 kWh × 0,105 € = 1.340,64 €'],
      result: '12.768 kWh (1.340,64 € Gaskosten)',
    },
    content: {
      intro: 'Dieser Umrechner transformiert den auf dem Gaszähler abgelesenen Verbrauch in Kubikmetern (m³) in abrechnungsrelevante Kilowattstunden (kWh).',
      details: 'Formel nach DVGW-Arbeitsblatt G 685: Energie (kWh) = Volumen (m³) · Brennwert (Hs) · Zustandszahl (z). Als Faustwert gilt: 1 m³ Erdgas entspricht ca. 10 bis 10,5 kWh Wärmeenergie.',
    },
    faqs: [
      { question: 'Was bedeutet die Zustandszahl (z)?', answer: 'Die Zustandszahl beschreibt das Verhältnis des Gasvolumens im Zähler (abhängig von lokaler Temperatur und barometrischem Höhendruck) zum Normzustand.' },
      { question: 'Wo findet man Brennwert und Zustandszahl?', answer: 'Beide Werte stehen auf jeder jährlichen Gasabrechnung und können auf der Website des örtlichen Gasnetzbetreibers tagesaktuell eingesehen werden.' },
    ],
    relatedSlugs: ['energieeffizienzklasse-rechner', 'co2-abgabe-vermieter-mieter-rechner', 'stromkosten-geraete-rechner', 'waermepumpe-stromkosten-rechner', 'heizkostenvergleich-rechner'],
  },

  {
    id: 'balkonkraftwerk-ertrag-rechner',
    slug: 'balkonkraftwerk-ertrag-rechner',
    name: 'Balkonkraftwerk-Rechner (800 Watt Stecker-Solar)',
    shortName: 'Balkonkraftwerk-Rechner',
    category: 'haushalt-energie',
    subcategory: 'Strom & Sparen',
    metaTitle: 'Balkonkraftwerk Rechner – 800W Ertrag, Ersparnis',
    metaDescription: 'Berechnen Sie den Stromertrag, die jährliche Stromkostenersparnis und die Amortisationszeit für Ihr 800-Watt-Balkonkraftwerk (Stecker-Solaranlage).',
    h1: 'Balkonkraftwerk Rechner – 800 Watt Ertrag & Amortisation',
    shortDescription: 'Ermittelt jährlichen Solarertrag und Geldersparnis für Mini-Photovoltaikanlagen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['balkonkraftwerk rechner', '800 watt balkonkraftwerk ertrag', 'stecker solar ersparnis berechnen', 'amortisation balkonkraftwerk'],
    inputs: [
      { id: 'modulePowerWp', label: 'Modulleistung der Paneele in Watt-Peak', type: 'number', defaultValue: 850, min: 300, max: 1200, step: 50, unit: 'Wp' },
      { id: 'systemCost', label: 'Anschaffungspreis Komplettset inkl. Halterung', type: 'number', defaultValue: 450, min: 200, step: 25, unit: '€' },
      { id: 'ownConsumptionPct', label: 'Eigenverbrauchsanteil (üblich 65 % bis 85 % ohne Speicher)', type: 'number', defaultValue: 75, min: 30, max: 100, step: 5, unit: '%' },
      { id: 'electricityPrice', label: 'Ihr aktueller Haushaltsstrompreis', type: 'number', defaultValue: 36, min: 20, max: 60, step: 1, unit: 'ct/kWh' },
    ],
    calculate: (inputs) => {
      const wp = parseFloat(inputs.modulePowerWp) || 850;
      const cost = parseFloat(inputs.systemCost) || 450;
      const ownPct = (parseFloat(inputs.ownConsumptionPct) || 75) / 100;
      const priceCent = parseFloat(inputs.electricityPrice) || 36;
      // In Deutschland ca. 850 bis 1000 kWh Ertrag pro kWp je nach Ausrichtung
      const yearlyGenerationKwh = (wp / 1000) * 880;
      const usedKwh = yearlyGenerationKwh * ownPct;
      const yearlySaving = (usedKwh * priceCent) / 100;
      const amortYears = cost / yearlySaving;
      return {
        primary: { id: 'yearlySaving', label: 'Jährliche Stromkostenersparnis', value: yearlySaving, formattedValue: formatCurrency(yearlySaving), highlight: true },
        secondary: [
          { id: 'amortYears', label: 'Amortisationszeit', value: amortYears, formattedValue: `ca. ${formatNumber(amortYears, 1)} Jahre` },
          { id: 'yearlyGenerationKwh', label: 'Solarstrom-Erzeugung pro Jahr', value: yearlyGenerationKwh, formattedValue: `${formatNumber(yearlyGenerationKwh, 0)} kWh` },
          { id: 'usedKwh', label: 'Selbst genutzter Strom', value: usedKwh, formattedValue: `${formatNumber(usedKwh, 0)} kWh` },
        ],
        summaryText: `Ihr Balkonkraftwerk erzeugt ca. ${formatNumber(yearlyGenerationKwh, 0)} kWh Strom. Bei ${formatPercent(ownPct * 100, 0)} Eigenverbrauch sparen Sie jährlich ${formatCurrency(yearlySaving)} – bezahlt in ${formatNumber(amortYears, 1)} Jahren.`,
      };
    },
    formula: 'Ersparnis/Jahr = Solarstrom (kWh) × Eigenverbrauchsquote × Strompreis; Amortisation = Kosten / Ersparnis',
    formulaExplanation: 'Nach dem Solarpaket I dürfen Balkonkraftwerke mit bis zu 800 Watt Wechselrichterleistung betrieben und unkompliziert im Marktstammdatenregister angemeldet werden.',
    workedExample: {
      title: 'Beispiel: 850 Wp Anlage für 450 € bei 75 % Eigenverbrauch und 36 ct/kWh',
      inputValues: [{ label: 'Modulleistung', value: '850 Wp' }, { label: 'Kosten', value: '450 €' }, { label: 'Eigenverbrauch', value: '75 %' }],
      steps: ['Ertrag: 0,85 kWp × 880 kWh = 748 kWh', 'Eigenverbrauch: 748 kWh × 0,75 = 561 kWh', 'Ersparnis: 561 kWh × 0,36 € = 201,96 € pro Jahr', 'Amortisation: 450 € / 201,96 € ≈ 2,2 Jahre'],
      result: '201,96 € Ersparnis pro Jahr',
    },
    content: {
      intro: 'Ein Balkonkraftwerk (Stecker-Solargerät bis 800 Watt Wechselrichterleistung) erzeugt direkt nutzbaren Solarstrom für den eigenen Haushaltsbedarf.',
      details: 'Ertrag = Modulleistung in kWp · Globalstrahlung · Ausrichtungsfaktor. Eine 800-Watt-Anlage erzeugt in Deutschland je nach Ausrichtung ca. 600 bis 850 kWh Strom pro Jahr und spart bei hoher Eigenverbrauchsquote 200 bis 300 Euro Stromkosten.',
    },
    faqs: [
      { question: 'Darf man ein Balkonkraftwerk ohne Genehmigung des Vermieters installieren?', answer: 'Nach dem Solarpaket I und der BGB-Mietrechtsreform 2024 gehört die Errichtung eines Balkonkraftwerks zu den privilegierten Maßnahmen: Vermieter dürfen die Zustimmung nur noch aus triftigen Gründen verweigern.' },
      { question: 'Muss ein Balkonkraftwerk beim Netzbetreiber angemeldet werden?', answer: 'Seit dem Solarpaket I genügt eine unbürokratische Registrierung im Marktstammdatenregister der Bundesnetzagentur; eine separate Anmeldung beim Netzbetreiber entfällt.' },
    ],
    relatedSlugs: ['photovoltaik-amortisation-rechner', 'stromkosten-geraete-rechner', 'stromkostenrechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Solarpaket I / VDE 0100-551-1 / EEG',
      sourceUrl: 'https://www.bmwk.de',
      lastVerified: '2026-01-15',
    },
  },

  {
    id: 'photovoltaik-amortisation-rechner',
    slug: 'photovoltaik-amortisation-rechner',
    name: 'Photovoltaik-Rechner (Dachanlage mit Speicher & Einspeisung)',
    shortName: 'PV-Anlage-Rechner',
    category: 'haushalt-energie',
    subcategory: 'Strom & Sparen',
    metaTitle: 'Photovoltaik Rechner – PV-Ertrag, Batteriespeicher',
    metaDescription: 'Berechnen Sie Ertrag, Eigenverbrauchsquote, EEG-Einspeisevergütung und Gesamtrendite einer privaten Dachanlage mit oder ohne Stromspeicher.',
    h1: 'Photovoltaik Rechner – PV-Anlage & Stromspeicher kalkulieren',
    shortDescription: 'Ganzheitliche Wirtschaftlichkeitsrechnung für Photovoltaik-Dachanlagen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['photovoltaik rechner ertrag', 'pv anlage speicher amortisation', 'einspeiseverguetung eeg rechner', 'photovoltaik wirtschaftlichkeit'],
    inputs: [
      { id: 'peakPowerKwp', label: 'Anlagengröße in Kilowatt-Peak (kWp)', type: 'number', defaultValue: 10, min: 3, max: 30, step: 1, unit: 'kWp' },
      { id: 'totalCost', label: 'Investitionskosten komplett inkl. Montage (netto, 0% MwSt.)', type: 'number', defaultValue: 15500, min: 4000, step: 500, unit: '€' },
      { id: 'householdDemandKwh', label: 'Jährlicher Stromverbrauch im Haushalt', type: 'number', defaultValue: 4500, min: 1000, step: 250, unit: 'kWh' },
      { id: 'selfConsumptionPct', label: 'Eigenverbrauchsanteil an PV-Erzeugung (mit Speicher üblich ca. 35 - 45 %)', type: 'number', defaultValue: 35, min: 15, max: 70, step: 5, unit: '%' },
      { id: 'feedInTariffCent', label: 'EEG-Einspeisevergütung in Cent pro kWh', type: 'number', defaultValue: 8.03, min: 5, max: 12, step: 0.1, unit: 'ct/kWh' },
      { id: 'gridPriceCent', label: 'Bezugsstrompreis in Cent pro kWh', type: 'number', defaultValue: 36, min: 20, max: 60, step: 1, unit: 'ct/kWh' },
    ],
    calculate: (inputs) => {
      const kwp = parseFloat(inputs.peakPowerKwp) || 10;
      const cost = parseFloat(inputs.totalCost) || 15500;
      const demand = parseFloat(inputs.householdDemandKwh) || 4500;
      const selfPct = (parseFloat(inputs.selfConsumptionPct) || 35) / 100;
      const feedInPrice = (parseFloat(inputs.feedInTariffCent) || 8.03) / 100;
      const gridPrice = (parseFloat(inputs.gridPriceCent) || 36) / 100;
      const totalGen = kwp * 950; // ca. 950 kWh pro kWp im D-Schnitt
      const selfConsumed = totalGen * selfPct;
      const fedIn = totalGen - selfConsumed;
      const savedGridCost = selfConsumed * gridPrice;
      const feedInRevenue = fedIn * feedInPrice;
      const totalYearlyBenefit = savedGridCost + feedInRevenue;
      const amortYears = cost / totalYearlyBenefit;
      return {
        primary: { id: 'totalYearlyBenefit', label: 'Jährlicher finanzieller Ertrag (Ersparnis + Einspeisung)', value: totalYearlyBenefit, formattedValue: formatCurrency(totalYearlyBenefit), highlight: true },
        secondary: [
          { id: 'amortYears', label: 'Amortisationszeit', value: amortYears, formattedValue: `ca. ${formatNumber(amortYears, 1)} Jahre` },
          { id: 'savedGridCost', label: 'Eingesparte Stromkosten', value: savedGridCost, formattedValue: formatCurrency(savedGridCost) },
          { id: 'feedInRevenue', label: 'Einspeisevergütung Netzbetreiber', value: feedInRevenue, formattedValue: formatCurrency(feedInRevenue) },
          { id: 'autarkyPct', label: 'Autarkiegrad im Haushalt', value: Math.min(100, (selfConsumed / demand) * 100), formattedValue: formatPercent(Math.min(100, (selfConsumed / demand) * 100), 1) },
        ],
        summaryText: `Ihre ${kwp} kWp Anlage erwirtschaftet jährlich ca. ${formatCurrency(totalYearlyBenefit)} (${formatCurrency(savedGridCost)} Ersparnis + ${formatCurrency(feedInRevenue)} Einspeisevergütung). Die Anlage amortisiert sich in ca. ${formatNumber(amortYears, 1)} Jahren.`,
      };
    },
    formula: 'Jahresnutzen = (Eigenverbrauch × Strompreis) + (Einspeisung × Einspeisevergütung)',
    formulaExplanation: 'Photovoltaikanlagen auf Wohngebäuden profitieren in Deutschland von 0 % Mehrwertsteuer und garantierter 20-jähriger EEG-Einspeisevergütung.',
    workedExample: {
      title: 'Beispiel: 10 kWp Anlage für 15.500 € erzeugt 9.500 kWh Strom',
      inputValues: [{ label: 'Größe', value: '10 kWp' }, { label: 'Kosten', value: '15.500 €' }, { label: 'Eigenverbrauch', value: '35 %' }],
      steps: ['Eigenverbrauch: 3.325 kWh × 0,36 € = 1.197,00 €', 'Einspeisung: 6.175 kWh × 0,0803 € = 495,85 €', 'Gesamtnutzen = 1.692,85 € pro Jahr', 'Amortisation: 15.500 € / 1.692,85 € ≈ 9,2 Jahre'],
      result: '1.692,85 € jährlicher Nutzen (9,2 Jahre Amortisation)',
    },
    content: {
      intro: 'Dieser Wirtschaftlichkeitsrechner berechnet die Amortisationsdauer einer Dachanlagen-Photovoltaik inklusive Batteriespeicher, Eigenverbrauch und Einspeisevergütung nach dem EEG.',
      details: 'Amortisationszeit = Anschaffungskosten / jährliche Gesamtersparnis (eingesparte Netzstromkosten + EEG-Einspeisevergütung). Eine typische 10-kWp-Anlage mit Speicher amortisiert sich nach etwa 8 bis 12 Jahren.',
    },
    faqs: [
      { question: 'Wie hoch ist die EEG-Einspeisevergütung für Überschusseinspeisung?', answer: 'Für Neuanlagen bis 10 kWp liegt die gesetzliche Einspeisevergütung bei rund 8 Cent je kWh, garantiert fest über 20 Kalenderjahre plus Inbetriebnahmejahr.' },
      { question: 'Gilt auf Photovoltaikanlagen die Mehrwertsteuerbefreiung?', answer: 'Ja, nach § 12 Abs. 3 UStG gilt für den Kauf und die Installation von PV-Anlagen und Heimspeichern auf Wohngebäuden ein Nullsteuersatz (0 % Mehrwertsteuer).' },
    ],
    relatedSlugs: ['klimaanlage-stromkosten-rechner', 'balkonkraftwerk-ertrag-rechner', 'waermepumpe-stromkosten-rechner', 'e-auto-ladekosten-zuhause-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Erneuerbare-Energien-Gesetz (EEG Vergütungssätze) / Bundesnetzagentur',
      sourceUrl: 'https://www.bundesnetzagentur.de',
      lastVerified: '2026-01-15',
    },
  },

  {
    id: 'waermepumpe-stromkosten-rechner',
    slug: 'waermepumpe-stromkosten-rechner',
    name: 'Wärmepumpen-Rechner (Stromverbrauch & JAZ Jahresarbeitszahl)',
    shortName: 'Wärmepumpe Stromkosten',
    category: 'haushalt-energie',
    subcategory: 'Heizung & Gas',
    metaTitle: 'Wärmepumpen Stromkosten Rechner – JAZ',
    metaDescription: 'Berechnen Sie den jährlichen Stromverbrauch und die Heizkosten einer Wärmepumpe anhand von Heizwärmebedarf und Jahresarbeitszahl (JAZ).',
    h1: 'Wärmepumpen Rechner – Stromverbrauch & Heizkosten berechnen',
    shortDescription: 'Ermittelt Strombedarf und Betriebskosten von Luft-Wasser- und Sole-Wärmepumpen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['waermepumpen stromkosten rechner', 'jahresarbeitszahl jaz berechnen', 'stromverbrauch waermepumpe kwh', 'heizstromtarif waermepumpe'],
    inputs: [
      { id: 'heatDemandKwh', label: 'Jährlicher Heizwärmebedarf des Gebäudes inkl. Warmwasser', type: 'number', defaultValue: 16000, min: 3000, step: 500, unit: 'kWh' },
      { id: 'jaz', label: 'Jahresarbeitszahl (JAZ, üblich 3,0 bis 4,5)', type: 'number', defaultValue: 3.5, min: 2.0, max: 6.0, step: 0.1 },
      { id: 'heatElectricityPriceCent', label: 'Wärmepumpenstrom-Tarif in Cent pro kWh', type: 'number', defaultValue: 28, min: 15, max: 50, step: 1, unit: 'ct/kWh' },
    ],
    calculate: (inputs) => {
      const heat = parseFloat(inputs.heatDemandKwh) || 16000;
      const jaz = parseFloat(inputs.jaz) || 3.5;
      const price = parseFloat(inputs.heatElectricityPriceCent) || 28;
      const electricityKwh = heat / jaz;
      const yearlyCost = (electricityKwh * price) / 100;
      const monthlyCost = yearlyCost / 12;
      return {
        primary: { id: 'yearlyCost', label: 'Jährliche Heizstromkosten', value: yearlyCost, formattedValue: formatCurrency(yearlyCost), highlight: true },
        secondary: [
          { id: 'electricityKwh', label: 'Benötigter Antriebsstrom', value: electricityKwh, formattedValue: `${formatNumber(electricityKwh, 0)} kWh` },
          { id: 'monthlyCost', label: 'Monatliche Kosten', value: monthlyCost, formattedValue: formatCurrency(monthlyCost) },
          { id: 'costPerKwhHeat', label: 'Effektive Wärmekosten', value: (price / jaz), formattedValue: `${formatNumber(price / jaz, 2)} ct/kWh Wärme` },
        ],
        summaryText: `Für ${formatNumber(heat, 0)} kWh Wärme benötigt die Wärmepumpe bei JAZ ${jaz} ca. ${formatNumber(electricityKwh, 0)} kWh Strom. Das ergibt jährliche Heizkosten von ${formatCurrency(yearlyCost)}.`,
      };
    },
    formula: 'Strombedarf (kWh) = Wärmebedarf / JAZ; Heizkosten = Strombedarf × Strompreis',
    formulaExplanation: 'Die Jahresarbeitszahl (JAZ) beziffert das Verhältnis der im Laufe eines Jahres abgegebenen Heizwärme zur aufgenommenen elektrischen Energie.',
    workedExample: {
      title: 'Beispiel: 16.000 kWh Wärmebedarf mit JAZ 3,5 bei 28 ct/kWh Heizstrom',
      inputValues: [{ label: 'Wärmebedarf', value: '16.000 kWh' }, { label: 'JAZ', value: '3,5' }, { label: 'Strompreis', value: '28 ct/kWh' }],
      steps: ['Strombedarf = 16.000 kWh / 3,5 ≈ 4.571 kWh', 'Stromkosten = 4.571 kWh × 0,28 € ≈ 1.280,00 €'],
      result: '1.280,00 € jährliche Stromkosten',
    },
    content: {
      intro: 'Die Stromkosten einer Wärmepumpe hängen direkt vom Gebäude-Wärmebedarf und der Jahresarbeitszahl (JAZ) der Anlage ab.',
      details: 'Strombedarf = Heizwärmebedarf in kWh / Jahresarbeitszahl (JAZ). Bei 15.000 kWh Wärmebedarf und einer JAZ von 3,8 benötigt die Wärmepumpe rund 3.947 kWh Strom pro Jahr. Spezielle Wärmepumpentarife mit Sperrzeiten bieten oft günstigere Kilowattstundenpreise.',
    },
    faqs: [
      { question: 'Was ist der Unterschied zwischen COP und JAZ?', answer: 'Der COP (Coefficient of Performance) ist ein theoretischer Prüfstandswert bei festen Temperaturen (z. B. A2/W35); die JAZ misst die tatsächliche Effizienz der gesamten Anlage über das reale Betriebsjahr.' },
      { question: 'Lohnt sich eine Wärmepumpe auch im ungedämmten Altbau?', answer: 'Ja, sofern die Vorlauftemperatur der Heizkörper an kalten Tagen 55 °C nicht übersteigen muss; eventuell müssen einzelne Heizkörper durch Niedertemperatur-Heizkörper ersetzt werden.' },
    ],
    relatedSlugs: ['energieeffizienzklasse-rechner', 'heizkostenvergleich-rechner', 'gasverbrauch-kwh-m3-rechner', 'photovoltaik-amortisation-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'BDEW / Bundesverband Wärmepumpe (BWP)',
      sourceUrl: 'https://www.waermepumpe.de',
      lastVerified: '2026-01-20',
    },
  },

  {
    id: 'heizkostenvergleich-rechner',
    slug: 'heizkostenvergleich-rechner',
    name: 'Heizkostenvergleich-Rechner (Wärmepumpe, Gas, Öl, Pellets)',
    shortName: 'Heizkostenvergleich',
    category: 'haushalt-energie',
    subcategory: 'Heizung & Gas',
    metaTitle: 'Heizkostenvergleich Rechner – Gas, Öl, Pellets',
    metaDescription: 'Vergleichen Sie die jährlichen Brennstoff- und Heizkosten verschiedener Heizsysteme bei identischem Wärmebedarf Ihres Hauses.',
    h1: 'Heizkostenvergleich Rechner – Heizsysteme & Kosten vergleichen',
    shortDescription: 'Vergleicht die reinen Brennstoff- und Verbrauchskosten verschiedener Heiztechnologien mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['heizkostenvergleich rechner', 'waermepumpe vs gasheizung kosten', 'heizoel pellets vergleich kwh', 'was heizt am guenstigsten'],
    inputs: [
      { id: 'heatDemandKwh', label: 'Jährlicher Heizenergiebedarf in kWh', type: 'number', defaultValue: 18000, min: 3000, step: 1000, unit: 'kWh' },
      { id: 'gasPriceCent', label: 'Gaspreis in Cent pro kWh', type: 'number', defaultValue: 11.0, min: 5, max: 25, step: 0.5, unit: 'ct/kWh' },
      { id: 'oilPricePerLiter', label: 'Heizölpreis in Euro pro Liter', type: 'number', defaultValue: 1.05, min: 0.5, max: 2.0, step: 0.05, unit: '€/Liter' },
      { id: 'pelletPricePerTon', label: 'Holzpellets Preis in Euro pro Tonne', type: 'number', defaultValue: 320, min: 150, max: 600, step: 10, unit: '€/t' },
      { id: 'heatPumpJaz', label: 'Wärmepumpe Jahresarbeitszahl (JAZ)', type: 'number', defaultValue: 3.6, min: 2.0, max: 5.0, step: 0.1 },
      { id: 'heatPumpPowerPrice', label: 'Wärmepumpenstrom-Tarif in Cent pro kWh', type: 'number', defaultValue: 28, min: 15, max: 45, step: 1, unit: 'ct/kWh' },
    ],
    calculate: (inputs) => {
      const demand = parseFloat(inputs.heatDemandKwh) || 18000;
      const gasCent = parseFloat(inputs.gasPriceCent) || 11.0;
      const oilLiter = parseFloat(inputs.oilPricePerLiter) || 1.05;
      const pelletTon = parseFloat(inputs.pelletPricePerTon) || 320;
      const jaz = parseFloat(inputs.heatPumpJaz) || 3.6;
      const wpCent = parseFloat(inputs.heatPumpPowerPrice) || 28;

      // 1. Gas (Nutzungsgrad ca. 92%)
      const gasCost = ((demand / 0.92) * gasCent) / 100;
      // 2. Öl (ca. 10 kWh/Liter, Nutzungsgrad ca. 88%)
      const litersNeeded = demand / (10 * 0.88);
      const oilCost = litersNeeded * oilLiter;
      // 3. Pellets (ca. 4.900 kWh/Tonne, Nutzungsgrad ca. 90%)
      const tonsNeeded = demand / (4900 * 0.90);
      const pelletCost = tonsNeeded * pelletTon;
      // 4. Wärmepumpe
      const wpCost = ((demand / jaz) * wpCent) / 100;

      return {
        primary: { id: 'wpCost', label: 'Kosten Wärmepumpe pro Jahr', value: wpCost, formattedValue: formatCurrency(wpCost), highlight: true },
        secondary: [
          { id: 'gasCost', label: 'Kosten Gasheizung', value: gasCost, formattedValue: formatCurrency(gasCost) },
          { id: 'oilCost', label: 'Kosten Ölheizung', value: oilCost, formattedValue: formatCurrency(oilCost) },
          { id: 'pelletCost', label: 'Kosten Pelletheizung', value: pelletCost, formattedValue: formatCurrency(pelletCost) },
        ],
        summaryText: `Bei ${formatNumber(demand, 0)} kWh Wärmebedarf liegen die jährlichen Kosten bei ca. ${formatCurrency(wpCost)} (Wärmepumpe), ${formatCurrency(pelletCost)} (Pellets), ${formatCurrency(gasCost)} (Gas) und ${formatCurrency(oilCost)} (Öl).`,
      };
    },
    formula: 'Brennstoffkosten = (Wärmebedarf / Wirkungsgrad) × Brennstoffpreis',
    formulaExplanation: 'Wirkungsgrade und Brennwerte bestimmen, wie viel Primärenergie zur Deckung des realen Nutzwärmebedarfs verbrannt werden muss.',
    workedExample: {
      title: 'Beispiel: 18.000 kWh Nutzwärmebedarf',
      inputValues: [{ label: 'Wärmebedarf', value: '18.000 kWh' }, { label: 'Gaspreis', value: '11 ct/kWh' }, { label: 'Wärmepumpenstrom', value: '28 ct/kWh bei JAZ 3,6' }],
      steps: ['Wärmepumpe: (18.000 / 3,6) × 0,28 € = 1.400,00 €', 'Gasheizung: (18.000 / 0,92) × 0,11 € ≈ 2.152,17 €'],
      result: 'Wärmepumpe spart ca. 752 € pro Jahr gegenüber Gas',
    },
    content: {
      intro: 'Dieser Systemvergleich stellt die Vollkosten verschiedener Heizsysteme (Wärmepumpe, Gasbrennwert, Pelletheizung, Fernwärme) inklusive Brennstoff, CO₂-Preis und Wartung gegenüber.',
      details: 'Der Rechner normiert die Brennstoffpreise auf Kosten pro Kilowattstunde Nutzwärme unter Berücksichtigung des feuerungstechnischen Nutzungsgrads der jeweiligen Kessel- und Pumpentechnik.',
    },
    faqs: [
      { question: 'Warum steigen die Heizkosten für fossile Brennstoffe in Zukunft weiter?', answer: 'Durch den gesetzlich steigenden nationalen CO₂-Preis (BEHG) und die künftige Einbindung in das europäische Emissionshandelssystem ETS-2 ab 2027 verteuern sich Gas und Heizöl kontinuierlich.' },
      { question: 'Wie viel Prozent Förderung gibt es für den Heizungstausch?', answer: 'Über die Bundesförderung für effiziente Gebäude (KfW-Programm 458) erhalten selbstnutzende Eigentümer eine Grundförderung von 30 % plus Geschwindigkeitsbonus und Einkommensbonus bis zu maximal 70 % der förderfähigen Kosten.' },
    ],
    relatedSlugs: ['brennholz-raummeter-rechner', 'pelletheizung-verbrauch-rechner', 'waermepumpe-stromkosten-rechner', 'gasverbrauch-kwh-m3-rechner', 'oelheizung-verbrauch-rechner'],
  },

  {
    id: 'warmwasserkosten-rechner',
    slug: 'warmwasserkosten-rechner',
    name: 'Warmwasserkosten-Rechner (Durchlauferhitzer vs. Zentralheizung)',
    shortName: 'Warmwasserkosten berechnen',
    category: 'haushalt-energie',
    subcategory: 'Heizung & Gas',
    metaTitle: 'Warmwasserkosten Rechner – Durchlauferhitzer',
    metaDescription: 'Berechnen Sie die Kosten für warmes Wasser und Duschen: Elektrischer Durchlauferhitzer im Vergleich zur zentralen Warmwasserbereitung über Gas oder Öl.',
    h1: 'Warmwasserkosten Rechner – Durchlauferhitzer vs. Warmwasserspeicher',
    shortDescription: 'Kalkuliert die täglichen und jährlichen Kosten für Dusch- und Warmwasser.',
    searchKeywords: ['warmwasserkosten rechner', 'durchlauferhitzer kosten pro dusche', 'warmwasserbereitung strom gas vergleich', 'duschen kosten berechnen'],
    inputs: [
      { id: 'persons', label: 'Anzahl Personen im Haushalt', type: 'number', defaultValue: 3, min: 1, max: 10, step: 1 },
      { id: 'showerMinutesPerPerson', label: 'Durchschnittliche Duschdauer pro Person und Tag (Minuten)', type: 'number', defaultValue: 7, min: 2, max: 30, step: 1, unit: 'Minuten' },
      { id: 'powerKw', label: 'Leistung des Durchlauferhitzers in kW (üblich 18 bis 24 kW)', type: 'number', defaultValue: 21, min: 11, max: 27, step: 1, unit: 'kW' },
      { id: 'electricityPrice', label: 'Strompreis in Cent pro kWh', type: 'number', defaultValue: 36, min: 20, max: 60, step: 1, unit: 'ct/kWh' },
    ],
    calculate: (inputs) => {
      const p = parseInt(inputs.persons, 10) || 3;
      const mins = parseFloat(inputs.showerMinutesPerPerson) || 7;
      const kw = parseFloat(inputs.powerKw) || 21;
      const priceCent = parseFloat(inputs.electricityPrice) || 36;
      const dailyMinutes = p * mins;
      const dailyHours = dailyMinutes / 60;
      const dailyKwh = dailyHours * kw;
      const costPerShower = (mins / 60) * kw * (priceCent / 100);
      const yearlyCost = dailyKwh * 365 * (priceCent / 100);
      return {
        primary: { id: 'yearlyCost', label: 'Jährliche Stromkosten Warmwasser', value: yearlyCost, formattedValue: formatCurrency(yearlyCost), highlight: true },
        secondary: [
          { id: 'costPerShower', label: 'Kosten für 1x Duschen', value: costPerShower, formattedValue: formatCurrency(costPerShower) },
          { id: 'monthlyCost', label: 'Monatliche Kosten', value: yearlyCost / 12, formattedValue: formatCurrency(yearlyCost / 12) },
          { id: 'yearlyKwh', label: 'Stromverbrauch Warmwasser pro Jahr', value: dailyKwh * 365, formattedValue: `${formatNumber(dailyKwh * 365, 0)} kWh` },
        ],
        summaryText: `Ein 21-kW-Durchlauferhitzer kostet für ${p} Personen bei ${mins} Min. Duschzeit ca. ${formatCurrency(yearlyCost)} Strom im Jahr (${formatCurrency(costPerShower)} pro Duschgang).`,
      };
    },
    formula: 'Kosten = (Duschminuten / 60) × kW-Leistung × Strompreis',
    formulaExplanation: 'Ein vollelektronischer Durchlauferhitzer benötigt während des Zapfens die volle elektrische Leistung zur Erhitzung des Wassers im Durchfluss.',
    workedExample: {
      title: 'Beispiel: 7 Minuten Duschen bei 21 kW und 36 ct/kWh',
      inputValues: [{ label: 'Dauer', value: '7 Minuten' }, { label: 'Leistung', value: '21 kW' }, { label: 'Strompreis', value: '36 ct/kWh' }],
      steps: ['kWh pro Dusche: (7 / 60) × 21 kW = 2,45 kWh', 'Kosten pro Dusche: 2,45 kWh × 0,36 € = 0,88 €'],
      result: '0,88 € pro Duschgang',
    },
    content: {
      intro: 'Die Warmwasserbereitung macht in deutschen Haushalten etwa 12 bis 18 Prozent des gesamten häuslichen Energiebedarfs aus.',
      details: 'Zur Erwärmung von 1 Liter Wasser um 1 Kelvin werden 1,16 Wattstunden Energie benötigt. Um 100 Liter Wasser von 10 °C auf 45 °C Duschtemperatur zu erhitzen, fallen exakt 4,06 kWh Energie an.',
    },
    faqs: [
      { question: 'Ist Duschen mit Durchlauferhitzer teurer als mit Zentralheizung?', answer: 'Ja, da Haushaltsstrom (ca. 35 ct/kWh) etwa drei- bis viermal so viel kostet wie Erdgas oder Wärmepumpenstrom (ca. 9 bis 12 ct/kWh Nutzwärme).' },
      { question: 'Wie viel Energie spart ein Sparduschkopf?', answer: 'Ein wassersparender Duschkopf reduziert den Durchfluss von 12–15 Liter/Minute auf 6–8 Liter/Minute und halbiert damit die Warmwasserkosten beim Duschen ohne Komfortverlust.' },
    ],
    relatedSlugs: ['stromkosten-geraete-rechner', 'wasserverbrauch-haushalt-rechner', 'waermepumpe-stromkosten-rechner'],
  },

  {
    id: 'kuehlschrank-stromkosten-rechner',
    slug: 'kuehlschrank-stromkosten-rechner',
    name: 'Kühlschrank Stromkosten-Rechner (Energieeffizienzklassen)',
    shortName: 'Kühlschrank Stromkosten',
    category: 'haushalt-energie',
    subcategory: 'Strom & Sparen',
    metaTitle: 'Kühlschrank Stromkosten Rechner – Verbrauch',
    metaDescription: 'Berechnen Sie die Stromkosten Ihres Kühlschranks oder Gefrierschranks und vergleichen Sie Altgeräte mit Neugeräten der Klassen A bis E.',
    h1: 'Kühlschrank Stromkosten Rechner – Stromverbrauch & Ersparnis berechnen',
    shortDescription: 'Vergleicht die laufenden Betriebskosten von Altgeräten mit modernen energieeffizienten Kühlschränken.',
    searchKeywords: ['kuehlschrank stromkosten rechner', 'kuehlschrank kwh pro jahr kosten', 'kuehlschrank neukauf amortisation strom', 'energieeffizienzklasse kuehlschrank'],
    inputs: [
      { id: 'oldConsumptionKwh', label: 'Jahresverbrauch des alten / bestehenden Kühlschranks in kWh', type: 'number', defaultValue: 320, min: 50, max: 800, step: 10, unit: 'kWh/Jahr' },
      { id: 'newConsumptionKwh', label: 'Jahresverbrauch des sparsamen Neugeräts in kWh (Klasse A/B/C)', type: 'number', defaultValue: 115, min: 40, max: 300, step: 5, unit: 'kWh/Jahr' },
      { id: 'newAppliancePrice', label: 'Kaufpreis des Neugeräts', type: 'number', defaultValue: 650, min: 150, step: 25, unit: '€' },
      { id: 'electricityPrice', label: 'Strompreis in Cent pro kWh', type: 'number', defaultValue: 36, min: 20, max: 60, step: 1, unit: 'ct/kWh' },
    ],
    calculate: (inputs) => {
      const oldKwh = parseFloat(inputs.oldConsumptionKwh) || 320;
      const newKwh = parseFloat(inputs.newConsumptionKwh) || 115;
      const price = parseFloat(inputs.newAppliancePrice) || 650;
      const electricityCent = parseFloat(inputs.electricityPrice) || 36;
      const oldCost = (oldKwh * electricityCent) / 100;
      const newCost = (newKwh * electricityCent) / 100;
      const yearlySaving = oldCost - newCost;
      const amortYears = yearlySaving > 0 ? price / yearlySaving : 999;
      return {
        primary: { id: 'yearlySaving', label: 'Jährliche Stromkostenersparnis', value: yearlySaving, formattedValue: formatCurrency(yearlySaving), highlight: true },
        secondary: [
          { id: 'oldCost', label: 'Bisherige Stromkosten pro Jahr', value: oldCost, formattedValue: formatCurrency(oldCost) },
          { id: 'newCost', label: 'Stromkosten des Neugeräts pro Jahr', value: newCost, formattedValue: formatCurrency(newCost) },
          { id: 'amortYears', label: 'Amortisation des Neukaufs', value: amortYears, formattedValue: `ca. ${formatNumber(amortYears, 1)} Jahre` },
        ],
        summaryText: `Das Neugerät spart jährlich ${formatNumber(oldKwh - newKwh, 0)} kWh Strom ein. Sie sparen dadurch ${formatCurrency(yearlySaving)} pro Jahr und amortisieren den Kauf in ${formatNumber(amortYears, 1)} Jahren.`,
      };
    },
    formula: 'Ersparnis/Jahr = (Verbrauch Alt - Verbrauch Neu) × Strompreis',
    formulaExplanation: 'Kühlschränke laufen 24 Stunden am Tag an 365 Tagen im Jahr. Ein sparsames Neugerät senkt den Dauerstromverbrauch beträchtlich.',
    workedExample: {
      title: 'Beispiel: Altgerät 320 kWh vs. Neugerät 115 kWh bei 36 ct/kWh',
      inputValues: [{ label: 'Altgerät', value: '320 kWh' }, { label: 'Neugerät', value: '115 kWh' }, { label: 'Strompreis', value: '36 ct/kWh' }],
      steps: ['Einsparung: 320 kWh - 115 kWh = 205 kWh', 'Kostenersparnis: 205 kWh × 0,36 € = 73,80 € pro Jahr'],
      result: '73,80 € Ersparnis pro Jahr',
    },
    content: {
      intro: 'Kühl- und Gefriergeräte laufen ununterbrochen an 365 Tagen im Jahr und gehören daher zu den kontinuierlichen Grundlast-Verbrauchern im Haushalt.',
      details: 'Alte Kühlgeräte der früheren Klasse A oder B verbrauchen oft 250 bis 350 kWh pro Jahr, während moderne Neugeräte der aktuellen Klasse B oder C mit 90 bis 130 kWh auskommen (Einsparung: ca. 60–80 € jährlich).',
    },
    faqs: [
      { question: 'Welche Temperatur ist für den Kühlschrank optimal?', answer: '7 °C im oberen Fach (mittlere Einstellung Stufe 2 oder 3) reicht für optimale Haltbarkeit vollkommen aus; jedes Grad kälter steigert den Stromverbrauch um rund 6 Prozent.' },
      { question: 'Warum treibt Vereisung im Eisfach den Stromverbrauch nach oben?', answer: 'Die Eisschicht wirkt wie eine Isolierung: Der Kältekompressor muss wesentlich länger und härter arbeiten, um die Wärme abzutransportieren (regelmäßiges Abtauen spart bare Münze).' },
    ],
    relatedSlugs: ['stromkosten-geraete-rechner', 'waschmaschine-kosten-rechner', 'trockner-kosten-rechner'],
  },

  {
    id: 'waschmaschine-kosten-rechner',
    slug: 'waschmaschine-kosten-rechner',
    name: 'Waschmaschinen Kosten-Rechner (Strom + Wasser je Waschgang)',
    shortName: 'Waschmaschine Kosten',
    category: 'haushalt-energie',
    subcategory: 'Strom & Sparen',
    metaTitle: 'Waschmaschinen Kosten Rechner – Strom',
    metaDescription: 'Berechnen Sie die exakten Kosten für einen Waschgang (Strom, Frischwasser, Abwasser und Waschmittel) sowie die Jahreskosten Ihrer Waschmaschine.',
    h1: 'Waschmaschinen Kosten Rechner – Kosten pro Waschgang berechnen',
    shortDescription: 'Ermittelt die Gesamtkosten pro Waschladung unter Berücksichtigung von Strom, Wasser und Waschmittel.',
    searchKeywords: ['waschmaschine kosten rechner', 'was kostet ein waschgang strom wasser', 'waschmaschine stromverbrauch 60 grad', 'waschkosten pro jahr'],
    inputs: [
      { id: 'kwhPerWash', label: 'Stromverbrauch pro Waschgang in kWh (z. B. 0,6 bis 1,2 kWh)', type: 'number', defaultValue: 0.85, min: 0.2, max: 3.0, step: 0.05, unit: 'kWh' },
      { id: 'waterPerWashLiters', label: 'Wasserverbrauch pro Waschgang in Litern (ca. 45 - 60 l)', type: 'number', defaultValue: 50, min: 20, max: 100, step: 5, unit: 'Liter' },
      { id: 'washesPerWeek', label: 'Waschgänge pro Woche', type: 'number', defaultValue: 4, min: 1, max: 20, step: 1 },
      { id: 'detergentCost', label: 'Kosten für Waschmittel pro Waschladung', type: 'number', defaultValue: 0.22, min: 0.05, max: 1.0, step: 0.01, unit: '€' },
      { id: 'electricityPrice', label: 'Strompreis in Cent pro kWh', type: 'number', defaultValue: 36, min: 20, max: 60, step: 1, unit: 'ct/kWh' },
      { id: 'waterPricePerM3', label: 'Wasser- & Abwasserpreis pro m³ (1.000 Liter)', type: 'number', defaultValue: 4.80, min: 2, max: 9, step: 0.2, unit: '€/m³' },
    ],
    calculate: (inputs) => {
      const kwh = parseFloat(inputs.kwhPerWash) || 0.85;
      const liters = parseFloat(inputs.waterPerWashLiters) || 50;
      const weekly = parseInt(inputs.washesPerWeek, 10) || 4;
      const detergent = parseFloat(inputs.detergentCost) || 0.22;
      const eleCent = parseFloat(inputs.electricityPrice) || 36;
      const waterM3 = parseFloat(inputs.waterPricePerM3) || 4.80;
      const powerCost = kwh * (eleCent / 100);
      const waterCost = (liters / 1000) * waterM3;
      const costPerWash = powerCost + waterCost + detergent;
      const yearlyWashes = weekly * 52;
      const yearlyCost = costPerWash * yearlyWashes;
      return {
        primary: { id: 'costPerWash', label: 'Kosten pro Waschgang (gesamt)', value: costPerWash, formattedValue: formatCurrency(costPerWash), highlight: true },
        secondary: [
          { id: 'yearlyCost', label: `Gesamtkosten pro Jahr (${yearlyWashes} Wäschen)`, value: yearlyCost, formattedValue: formatCurrency(yearlyCost) },
          { id: 'powerCost', label: 'Davon Stromkosten', value: powerCost, formattedValue: formatCurrency(powerCost) },
          { id: 'waterCost', label: 'Davon Wasser & Abwasser', value: waterCost, formattedValue: formatCurrency(waterCost) },
          { id: 'detergent', label: 'Davon Waschmittel', value: detergent, formattedValue: formatCurrency(detergent) },
        ],
        summaryText: `Ein Waschgang kostet ca. ${formatCurrency(costPerWash)}. Bei ${weekly} Wäschen pro Woche summiert sich dies auf ${formatCurrency(yearlyCost)} im Jahr.`,
      };
    },
    formula: 'Kosten/Waschgang = (kWh × Strompreis) + (Liter / 1.000 × Wasserpreis) + Waschmittel',
    formulaExplanation: 'Den Löwenanteil des Stroms verbraucht die Heizspirale zur Erwärmung des Waschwassers. Waschen bei 30 °C spart rund 60 % Energie gegenüber 60 °C.',
    workedExample: {
      title: 'Beispiel: 0,85 kWh Strom, 50 Liter Wasser bei 36 ct/kWh und 4,80 €/m³ Wasser',
      inputValues: [{ label: 'Strom', value: '0,85 kWh' }, { label: 'Wasser', value: '50 Liter' }, { label: 'Waschmittel', value: '0,22 €' }],
      steps: ['Strom: 0,85 × 0,36 € = 0,31 €', 'Wasser: 0,050 m³ × 4,80 € = 0,24 €', 'Waschmittel: 0,22 €', 'Summe = 0,77 € pro Waschgang'],
      result: '0,77 € pro Waschladung',
    },
    content: {
      intro: 'Dieser Kostenrechner erfasst die Ausgaben pro Waschgang aus Stromverbrauch, Frisch- und Abwasserkosten sowie dem Waschmittel.',
      details: 'Kosten pro Waschgang = (Stromverbrauch in kWh · Strompreis) + (Wasserverbrauch in m³ · Wasserpreis) + Waschmittelpreis (ca. 0,15–0,25 €). Ein 60°C-Waschgang verbraucht fast doppelt so viel Strom wie ein 40°C-Waschgang.',
    },
    faqs: [
      { question: 'Wie viel Strom spart das Eco-40-60-Programm?', answer: 'Eco-Programme waschen mit niedrigerer Temperatur über eine längere Zeitdauer (Aufweicheffekt) und sparen so rund 30 bis 50 Prozent der Heizenergie im Vergleich zum Normalprogramm.' },
      { question: 'Wie viel kostet ein durchschnittlicher Waschgang in Deutschland?', answer: 'Bei modernen Waschmaschinen (Klasse A) kostet eine Ladung Buntwäsche inklusive Strom, Wasser und Waschmittel etwa 0,40 bis 0,60 Euro.' },
    ],
    relatedSlugs: ['trockner-kosten-rechner', 'spuelmaschine-kosten-rechner', 'wasserverbrauch-haushalt-rechner'],
  },

  {
    id: 'trockner-kosten-rechner',
    slug: 'trockner-kosten-rechner',
    name: 'Wäschetrockner-Rechner (Wärmepumpe vs. Kondenstrockner)',
    shortName: 'Trockner Kosten berechnen',
    category: 'haushalt-energie',
    subcategory: 'Strom & Sparen',
    metaTitle: 'Wäschetrockner Rechner – Stromkosten Wärmepumpentrockner vs...',
    metaDescription: 'Berechnen Sie die Stromkosten pro Trocknungsgang und vergleichen Sie den sparsamen Wärmepumpentrockner mit herkömmlichen Kondenstrocknern.',
    h1: 'Wäschetrockner Rechner – Kosten pro Trockengang vergleichen',
    shortDescription: 'Vergleicht den Stromverbrauch moderner Wärmepumpentrockner mit alten Kondenstrocknern mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['waeschetrockner kosten rechner', 'waermepumpentrockner vs kondenstrockner stromkosten', 'trockner stromverbrauch euro', 'kwh pro trockengang'],
    inputs: [
      { id: 'dryerType', label: 'Trockner-Technologie', type: 'select', defaultValue: 'heatpump', options: [
        { value: 'heatpump', label: 'Moderner Wärmepumpentrockner (ca. 1,4 kWh)' },
        { value: 'condenser', label: 'Kondenstrockner / Ablufttrockner (ca. 4,0 kWh)' },
      ]},
      { id: 'cyclesPerWeek', label: 'Trocknungsvorgänge pro Woche', type: 'number', defaultValue: 3, min: 1, max: 15, step: 1 },
      { id: 'electricityPrice', label: 'Strompreis in Cent pro kWh', type: 'number', defaultValue: 36, min: 20, max: 60, step: 1, unit: 'ct/kWh' },
    ],
    calculate: (inputs) => {
      const type = inputs.dryerType || 'heatpump';
      const weekly = parseInt(inputs.cyclesPerWeek, 10) || 3;
      const priceCent = parseFloat(inputs.electricityPrice) || 36;
      const kwhPerCycle = type === 'heatpump' ? 1.4 : 4.0;
      const costPerCycle = kwhPerCycle * (priceCent / 100);
      const yearlyCycles = weekly * 52;
      const yearlyCost = costPerCycle * yearlyCycles;
      const comparisonCost = (type === 'heatpump' ? 4.0 : 1.4) * (priceCent / 100) * yearlyCycles;
      const diff = Math.abs(yearlyCost - comparisonCost);
      return {
        primary: { id: 'costPerCycle', label: 'Stromkosten pro Trockengang', value: costPerCycle, formattedValue: formatCurrency(costPerCycle), highlight: true },
        secondary: [
          { id: 'yearlyCost', label: `Jährliche Stromkosten (${yearlyCycles} Durchläufe)`, value: yearlyCost, formattedValue: formatCurrency(yearlyCost) },
          { id: 'yearlySaving', label: type === 'heatpump' ? 'Ersparnis ggü. Kondenstrockner' : 'Mehrkosten ggü. Wärmepumpentrockner', value: diff, formattedValue: formatCurrency(diff) },
          { id: 'yearlyKwh', label: 'Stromverbrauch pro Jahr', value: kwhPerCycle * yearlyCycles, formattedValue: `${formatNumber(kwhPerCycle * yearlyCycles, 0)} kWh` },
        ],
        summaryText: `Ein Durchlauf kostet ca. ${formatCurrency(costPerCycle)}. Aufs Jahr gerechnet zahlen Sie ${formatCurrency(yearlyCost)} Strom für den Wäschetrockner.`,
      };
    },
    formula: 'Kosten/Jahr = Durchläufe/Woche × 52 × kWh pro Trocknung × Strompreis',
    formulaExplanation: 'Wärmepumpentrockner nutzen die Abwärme im geschlossenen Kreislauf und benötigen rund 60 % bis 70 % weniger Strom als Kondenstrockner mit reinen Heizstäben.',
    workedExample: {
      title: 'Beispiel: 3 Trocknungen pro Woche bei 36 ct/kWh',
      inputValues: [{ label: 'Gerät', value: 'Wärmepumpentrockner (1,4 kWh)' }, { label: 'Wäschen/Woche', value: '3' }],
      steps: ['Pro Durchgang: 1,4 kWh × 0,36 € = 0,50 €', 'Jährlich: 3 × 52 × 0,50 € = 78,00 € (Kondenstrockner: ca. 224,64 €)'],
      result: '78,00 €/Jahr (spart ca. 146 € jährlich)',
    },
    content: {
      intro: 'Wäschetrockner gehören zu den energieintensivsten Haushaltsgeräten; moderne Wärmepumpentrockner verbrauchen jedoch nur einen Bruchteil alter Kondenstrockner.',
      details: 'Ein herkömmlicher Kondenstrockner verbraucht pro Trocknung ca. 3,5 bis 4,5 kWh Strom (ca. 1,30–1,60 €), ein effizienter Wärmepumpentrockner nur ca. 1,2 bis 1,5 kWh (ca. 0,45–0,55 €).',
    },
    faqs: [
      { question: 'Wie funktioniert ein Wärmepumpentrockner?', answer: 'Er nutzt ein geschlossenes Kältemittelsystem: Die Wärme der feuchten Abluft wird nicht an den Raum abgegeben, sondern über die Wärmepumpe zurückgewonnen und erneut zum Heizen genutzt.' },
      { question: 'Wie viel Geld spart man pro Jahr durch den Umstieg auf einen Wärmepumpentrockner?', answer: 'Bei 160 Trocknungszyklen im Jahr spart ein Wärmepumpentrockner rund 120 bis 160 Euro Stromkosten pro Jahr; die Mehrkosten beim Kauf haben sich nach 2 bis 3 Jahren amortisiert.' },
    ],
    relatedSlugs: ['waschmaschine-kosten-rechner', 'spuelmaschine-kosten-rechner', 'stromkosten-geraete-rechner'],
  },

  {
    id: 'spuelmaschine-kosten-rechner',
    slug: 'spuelmaschine-kosten-rechner',
    name: 'Spülmaschinen Kosten-Rechner (Geschirrspüler vs. Handabwasch)',
    shortName: 'Geschirrspüler Kosten',
    category: 'haushalt-energie',
    subcategory: 'Strom & Sparen',
    metaTitle: 'Spülmaschinen Kosten Rechner – Kosten pro Spülgang vs. Hand...',
    metaDescription: 'Berechnen Sie Strom-, Wasser- und Tab-Kosten pro Spülgang und sehen Sie, wie viel Energie und Wasser Sie gegenüber dem Handabwasch sparen.',
    h1: 'Spülmaschinen Kosten Rechner – Spülgang vs. Handabwasch berechnen',
    shortDescription: 'Vergleicht Energie- und Wasserkosten moderner Geschirrspüler mit dem manuellen Abwaschen.',
    searchKeywords: ['spuelmaschine kosten rechner', 'was kostet ein spuelgang geschirrspueler', 'spuelmaschine vs handabwasch vergleich', 'stromverbrauch spuelmaschine kwh'],
    inputs: [
      { id: 'kwhPerCycle', label: 'Stromverbrauch pro Spülgang in kWh (Eco ca. 0,75 - 0,9 kWh)', type: 'number', defaultValue: 0.82, min: 0.4, max: 2.0, step: 0.05, unit: 'kWh' },
      { id: 'waterPerCycleLiters', label: 'Wasserverbrauch pro Spülgang in Litern (ca. 9 - 12 l)', type: 'number', defaultValue: 10, min: 6, max: 25, step: 1, unit: 'Liter' },
      { id: 'cyclesPerWeek', label: 'Spülgänge pro Woche', type: 'number', defaultValue: 5, min: 1, max: 21, step: 1 },
      { id: 'tabCost', label: 'Kosten für Spülmaschinentab / Pulver & Klarspüler', type: 'number', defaultValue: 0.15, min: 0.03, max: 0.6, step: 0.01, unit: '€' },
      { id: 'electricityPrice', label: 'Strompreis in Cent pro kWh', type: 'number', defaultValue: 36, min: 20, max: 60, step: 1, unit: 'ct/kWh' },
    ],
    calculate: (inputs) => {
      const kwh = parseFloat(inputs.kwhPerCycle) || 0.82;
      const liters = parseFloat(inputs.waterPerCycleLiters) || 10;
      const weekly = parseInt(inputs.cyclesPerWeek, 10) || 5;
      const tab = parseFloat(inputs.tabCost) || 0.15;
      const eleCent = parseFloat(inputs.electricityPrice) || 36;
      const powerCost = kwh * (eleCent / 100);
      const waterCost = (liters / 1000) * 4.80; // Standard 4,80 €/m³ Wasser & Abwasser
      const costPerCycle = powerCost + waterCost + tab;
      const yearlyCost = costPerCycle * weekly * 52;
      // Handabwasch verbraucht im Schnitt ca. 45 Liter Warmwasser pro Spülladung
      const handWashCostPerCycle = 0.85;
      const yearlySavingVsHand = (handWashCostPerCycle - costPerCycle) * weekly * 52;
      return {
        primary: { id: 'costPerCycle', label: 'Kosten pro Spülgang', value: costPerCycle, formattedValue: formatCurrency(costPerCycle), highlight: true },
        secondary: [
          { id: 'yearlyCost', label: 'Geschirrspüler-Kosten pro Jahr', value: yearlyCost, formattedValue: formatCurrency(yearlyCost) },
          { id: 'yearlySavingVsHand', label: 'Ersparnis gegenüber Handabwasch', value: yearlySavingVsHand, formattedValue: formatCurrency(yearlySavingVsHand) },
          { id: 'powerShare', label: 'Stromanteil je Spülgang', value: powerCost, formattedValue: formatCurrency(powerCost) },
        ],
        summaryText: `Ein Spülgang kostet ca. ${formatCurrency(costPerCycle)}. Bei ${weekly} Spülgängen wöchentlich sparen Sie gegenüber dem Handabwasch ca. ${formatCurrency(yearlySavingVsHand)} im Jahr.`,
      };
    },
    formula: 'Kosten/Spülgang = (kWh × Strompreis) + (Liter × Wasserpreis) + Spültab',
    formulaExplanation: 'Studien der Universität Bonn belegen, dass eine moderne Geschirrspülmaschine rund 50 % weniger Wasser und 30 % weniger Energie benötigt als das Spülen von Hand.',
    workedExample: {
      title: 'Beispiel: 0,82 kWh Strom, 10 l Wasser, 0,15 € Tab bei 36 ct/kWh',
      inputValues: [{ label: 'Strom', value: '0,82 kWh' }, { label: 'Wasser', value: '10 Liter' }, { label: 'Tab', value: '0,15 €' }],
      steps: ['Strom: 0,82 × 0,36 € = 0,30 €', 'Wasser: 0,01 m³ × 4,80 € = 0,05 €', 'Tab: 0,15 €', 'Summe = 0,50 € pro Spülgang'],
      result: '0,50 € pro Spülgang',
    },
    content: {
      intro: 'Dieser Rechner vergleicht die Gesamtkosten eines Geschirrspülers pro Spülgang mit dem manuellen Abwaschen von Hand im Spülbecken.',
      details: 'Entgegen landläufiger Meinung verbraucht ein moderner Geschirrspüler im Eco-Modus nur 9 bis 11 Liter Wasser und ca. 0,8 kWh Strom – von Hand benötigt man für dieselbe Geschirrmenge meist über 30 bis 40 Liter Warmwasser.',
    },
    faqs: [
      { question: 'Muss man Geschirr vor dem Einräumen unter fließendem Wasser vorspülen?', answer: 'Nein, das Vorspülen verschwendet unnötig warmes Trinkwasser; es genügt vollkommen, grobe Speisereste mit der Gabel in den Müll zu streifen.' },
      { question: 'Warum dauert das Eco-Programm bei der Spülmaschine so lange?', answer: 'Um Strom zu sparen, wird das Wasser weniger stark erhitzt; das Spülmittel benötigt bei niedrigeren Temperaturen mehr Einwirkzeit, um Fette und Eiweiße enzymatisch zu lösen.' },
    ],
    relatedSlugs: ['waschmaschine-kosten-rechner', 'stromkosten-geraete-rechner', 'wasserverbrauch-haushalt-rechner'],
  },

  {
    id: 'fernseher-stromkosten-rechner',
    slug: 'fernseher-stromkosten-rechner',
    name: 'Fernseher Stromkosten-Rechner (OLED vs. LED & Standby)',
    shortName: 'Fernseher Stromkosten',
    category: 'haushalt-energie',
    subcategory: 'Strom & Sparen',
    metaTitle: 'Fernseher Stromkosten Rechner – TV-Stromverbrauch',
    metaDescription: 'Berechnen Sie den Stromverbrauch Ihres Fernsehers (OLED, QLED, LED) pro Stunde, Monat und Jahr inklusive Standby-Stromverschwendung.',
    h1: 'Fernseher Stromkosten Rechner – TV-Verbrauch & Kosten berechnen',
    shortDescription: 'Ermittelt die Stromkosten für Fernsehgeräte verschiedener Größen und Display-Technologien mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['fernseher stromkosten rechner', 'tv stromverbrauch pro stunde', 'oled vs led stromverbrauch kosten', 'fernseher standby kosten'],
    inputs: [
      { id: 'screenPowerWatts', label: 'Leistungsaufnahme im Betrieb in Watt (z. B. 80 bis 200 W)', type: 'number', defaultValue: 120, min: 20, max: 500, step: 10, unit: 'W' },
      { id: 'dailyHours', label: 'Tägliche Nutzungsdauer in Stunden', type: 'number', defaultValue: 4, min: 0.5, max: 24, step: 0.5, unit: 'Std./Tag' },
      { id: 'standbyWatts', label: 'Standby-Verbrauch in Watt', type: 'number', defaultValue: 1.0, min: 0.1, max: 15, step: 0.5, unit: 'W' },
      { id: 'electricityPrice', label: 'Strompreis in Cent pro kWh', type: 'number', defaultValue: 36, min: 20, max: 60, step: 1, unit: 'ct/kWh' },
    ],
    calculate: (inputs) => {
      const pWatts = parseFloat(inputs.screenPowerWatts) || 120;
      const hours = parseFloat(inputs.dailyHours) || 4;
      const sWatts = parseFloat(inputs.standbyWatts) || 1.0;
      const priceCent = parseFloat(inputs.electricityPrice) || 36;
      const activeKwh = (pWatts * hours * 365) / 1000;
      const standbyHours = Math.max(0, 24 - hours);
      const standbyKwh = (sWatts * standbyHours * 365) / 1000;
      const totalKwh = activeKwh + standbyKwh;
      const totalCost = (totalKwh * priceCent) / 100;
      const costPerHour = (pWatts / 1000) * (priceCent / 100);
      return {
        primary: { id: 'totalCost', label: 'Jährliche TV-Stromkosten', value: totalCost, formattedValue: formatCurrency(totalCost), highlight: true },
        secondary: [
          { id: 'costPerHour', label: 'Kosten pro Betriebsstunde', value: costPerHour, formattedValue: `${formatNumber(costPerHour * 100, 1)} Cent/Std.` },
          { id: 'monthlyCost', label: 'Monatliche Kosten', value: totalCost / 12, formattedValue: formatCurrency(totalCost / 12) },
          { id: 'standbyCost', label: 'Davon Standby-Kosten', value: (standbyKwh * priceCent) / 100, formattedValue: formatCurrency((standbyKwh * priceCent) / 100) },
        ],
        summaryText: `Bei ${hours} Stunden TV täglich verbraucht der Fernseher ${formatNumber(totalKwh, 1)} kWh im Jahr. Das entspricht Gesamtkosten von ${formatCurrency(totalCost)} jährlich.`,
      };
    },
    formula: 'Kosten/Jahr = ((Watt_Betrieb × Std_Betrieb + Watt_Standby × Std_Standby) × 365 / 1000) × Strompreis',
    formulaExplanation: 'Große Bildschirme (ab 65 Zoll) und HDR-Inhalte erhöhen die Leistungsaufnahme spürbar.',
    workedExample: {
      title: 'Beispiel: 120 W TV 4 Stunden täglich bei 36 ct/kWh',
      inputValues: [{ label: 'Leistung', value: '120 W' }, { label: 'Betriebszeit', value: '4 Std./Tag' }, { label: 'Strompreis', value: '36 ct/kWh' }],
      steps: ['Betriebsverbrauch: 120 W × 4 h × 365 = 175,2 kWh', 'Kosten: 175,2 kWh × 0,36 € ≈ 63,07 € pro Jahr'],
      result: 'ca. 63,07 € pro Jahr (ca. 4,3 Cent pro Stunde)',
    },
    content: {
      intro: 'Dieser Rechner ermittelt die jährlichen Stromkosten Ihres Fernsehgeräts abhängig von Bildschirmdiagonale, Display-Technologie (OLED, QLED, LED) und Bildhelligkeit (HDR).',
      details: 'Stromverbrauch = Leistung in Watt · tägliche Sehdauer in Stunden · 365 Tage · Strompreis. Ein 65-Zoll-Fernseher mit 120 Watt Leistungsaufnahme verursacht bei 4 Stunden täglichem Betrieb rund 60 Euro Stromkosten pro Jahr.',
    },
    faqs: [
      { question: 'Verbraucht HDR (High Dynamic Range) mehr Strom als Standard-Inhalte (SDR)?', answer: 'Ja, bei HDR-Wiedergabe regeln Hintergrundbeleuchtung und OLED-Pixel auf Spitzenhelligkeiten hoch, was die Leistungsaufnahme oft um 30 bis 60 Prozent steigert.' },
      { question: 'Welche Display-Technologie ist am energieeffizientesten?', answer: 'Standard-LED-LCDs sind meist etwas sparsamer als OLEDs bei hellen Bildern; OLEDs sind hingegen bei dunklen Filmszenen extrem sparsam, da schwarze Pixel komplett abgeschaltet werden.' },
    ],
    relatedSlugs: ['stromkosten-geraete-rechner', 'led-sparrechner', 'kuehlschrank-stromkosten-rechner'],
  },

  {
    id: 'led-sparrechner',
    slug: 'led-sparrechner',
    name: 'LED Spartool (Glühbirne vs. LED Watt & Ersparnis)',
    shortName: 'LED-Rechner',
    category: 'haushalt-energie',
    subcategory: 'Strom & Sparen',
    metaTitle: 'LED Rechner – Ersparnis beim Tausch alter Glühbirnen gegen LED',
    metaDescription: 'Berechnen Sie, wie viel Euro Sie durch den Austausch alter 60W-Glühbirnen oder Halogenstrahler gegen moderne LED-Leuchtmittel sparen.',
    h1: 'LED Spartool – Stromersparnis durch LED-Leuchtmittel berechnen',
    shortDescription: 'Vergleicht den Stromverbrauch traditioneller Glühlampen mit energiesparenden LED-Lampen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['led rechner stromersparnis', 'gluehbirne durch led ersetzen rechner', 'watt vergleich led halogen', 'led amortisation berechnen'],
    inputs: [
      { id: 'lampCount', label: 'Anzahl der ausgetauschten Leuchtmittel', type: 'number', defaultValue: 10, min: 1, max: 100, step: 1 },
      { id: 'oldWatts', label: 'Leistung der alten Lampe in Watt (z. B. 60 W)', type: 'number', defaultValue: 60, min: 15, max: 150, step: 5, unit: 'W' },
      { id: 'newWatts', label: 'Leistung der neuen LED in Watt (z. B. 8 W)', type: 'number', defaultValue: 8, min: 1, max: 30, step: 1, unit: 'W' },
      { id: 'burnHoursPerDay', label: 'Brenndauer pro Tag in Stunden', type: 'number', defaultValue: 3.5, min: 0.5, max: 24, step: 0.5, unit: 'Std./Tag' },
      { id: 'electricityPrice', label: 'Strompreis in Cent pro kWh', type: 'number', defaultValue: 36, min: 20, max: 60, step: 1, unit: 'ct/kWh' },
    ],
    calculate: (inputs) => {
      const count = parseInt(inputs.lampCount, 10) || 10;
      const oldW = parseFloat(inputs.oldWatts) || 60;
      const newW = parseFloat(inputs.newWatts) || 8;
      const hours = parseFloat(inputs.burnHoursPerDay) || 3.5;
      const priceCent = parseFloat(inputs.electricityPrice) || 36;
      const savedWattsPerLamp = oldW - newW;
      const savedKwhYear = (savedWattsPerLamp * hours * 365 * count) / 1000;
      const yearlySaving = (savedKwhYear * priceCent) / 100;
      return {
        primary: { id: 'yearlySaving', label: 'Jährliche Stromersparnis', value: yearlySaving, formattedValue: formatCurrency(yearlySaving), highlight: true },
        secondary: [
          { id: 'savedKwhYear', label: 'Eingesparter Strom pro Jahr', value: savedKwhYear, formattedValue: `${formatNumber(savedKwhYear, 0)} kWh` },
          { id: 'pctSaved', label: 'Energieersparnis Beleuchtung', value: (savedWattsPerLamp / oldW) * 100, formattedValue: formatPercent((savedWattsPerLamp / oldW) * 100, 0) },
          { id: 'saving5Years', label: 'Ersparnis über 5 Jahre', value: yearlySaving * 5, formattedValue: formatCurrency(yearlySaving * 5) },
        ],
        summaryText: `Durch den Tausch von ${count} Lampen sparen Sie ${formatPercent((savedWattsPerLamp / oldW) * 100, 0)} Beleuchtungsstrom ein. Das spart jährlich ${formatCurrency(yearlySaving)} (${formatNumber(savedKwhYear, 0)} kWh).`,
      };
    },
    formula: 'Ersparnis = Lampenanzahl × (Watt_alt - Watt_neu) × Stunden/Tag × 365 / 1000 × Strompreis',
    formulaExplanation: 'LED-Lampen wandeln Energie zu rund 80 % bis 90 % in sichtbares Licht um, während alte Glühbirnen bis zu 95 % als ungenutzte Wärme abgeben.',
    workedExample: {
      title: 'Beispiel: 10 Lampen von 60 W auf 8 W getauscht (3,5 Std./Tag bei 36 ct/kWh)',
      inputValues: [{ label: 'Lampen', value: '10 Stück' }, { label: 'Einsparung', value: '52 W je Lampe' }, { label: 'Brenndauer', value: '3,5 Std.' }],
      steps: ['Wattdifferenz gesamt = 10 × 52 W = 520 W', 'kWh/Jahr = (520 × 3,5 × 365) / 1000 = 664,3 kWh', 'Ersparnis = 664,3 kWh × 0,36 € = 239,15 € pro Jahr'],
      result: '239,15 € Ersparnis jedes Jahr',
    },
    content: {
      intro: 'Dieser Rechner quantifiziert die Strom- und Kostenersparnis beim Austausch eines gesamten Leuchtenbestands im Haus oder Unternehmen gegen LED-Leuchtmittel.',
      details: 'Er berechnet die kumulierte Energieeinsparung, die vermiedenen CO₂-Emissionen und die exakte Amortisationszeit der neuen Leuchtmittel inklusive Beschaffungskosten.',
    },
    faqs: [
      { question: 'Lohnt sich der Austausch von funktionierenden Energiesparlampen gegen LED?', answer: 'Ja, moderne LEDs verbrauchen nochmals etwa 50 % weniger Strom als alte Kompaktleuchtstofflampen, leuchten sofort mit voller Helligkeit und enthalten kein giftiges Quecksilber.' },
      { question: 'Welche Lichtfarbe eignet sich für Wohnräume?', answer: 'Für Wohn- und Schlafzimmer empfiehlt sich Warmweiß (2.700 bis 3.000 Kelvin); für Arbeitszimmer, Küche und Bad Neutralweiß (4.000 Kelvin) zur Steigerung der Konzentration.' },
    ],
    relatedSlugs: ['fernseher-stromkosten-rechner', 'stromkosten-geraete-rechner', 'stromkostenrechner', 'balkonkraftwerk-ertrag-rechner'],
  },

  {
    id: 'wasserverbrauch-haushalt-rechner',
    slug: 'wasserverbrauch-haushalt-rechner',
    name: 'Wasserverbrauch-Rechner für Haushalte (m³ & Kosten)',
    shortName: 'Wasserverbrauch-Rechner',
    category: 'haushalt-energie',
    subcategory: 'Wasser & Abwasser',
    metaTitle: 'Wasserverbrauch Rechner – Wasser- & Abwasserkosten pro Person',
    metaDescription: 'Ermitteln Sie Ihren Wasserverbrauch in Kubikmetern (m³) und Litern sowie die jährlichen Gesamtkosten für Trink- und Abwasser nach Haushaltsgröße.',
    h1: 'Wasserverbrauch Rechner – Trinkwasser- & Abwasserkosten ermitteln',
    shortDescription: 'Berechnet den Wasserverbrauch und die anfallenden Gebühren für Trinkwasser und Kanalisation.',
    searchKeywords: ['wasserverbrauch rechner haushalt', 'wasserkosten pro person durchschnitt', 'abwasserkosten kubikmeter rechner', 'wasserverbrauch m3 in liter'],
    inputs: [
      { id: 'persons', label: 'Personen im Haushalt', type: 'number', defaultValue: 3, min: 1, max: 12, step: 1 },
      { id: 'dailyLitersPerPerson', label: 'Täglicher Wasserverbrauch pro Kopf in Litern (D-Schnitt ca. 125 l)', type: 'number', defaultValue: 125, min: 50, max: 300, step: 5, unit: 'Liter/Tag' },
      { id: 'freshWaterPrice', label: 'Trinkwasserpreis pro m³ (1.000 l)', type: 'number', defaultValue: 2.10, min: 1.0, max: 5.0, step: 0.1, unit: '€/m³' },
      { id: 'wasteWaterPrice', label: 'Schmutzwassergebühr (Abwasser) pro m³', type: 'number', defaultValue: 2.70, min: 1.0, max: 6.0, step: 0.1, unit: '€/m³' },
    ],
    calculate: (inputs) => {
      const p = parseInt(inputs.persons, 10) || 3;
      const liters = parseFloat(inputs.dailyLitersPerPerson) || 125;
      const freshP = parseFloat(inputs.freshWaterPrice) || 2.10;
      const wasteP = parseFloat(inputs.wasteWaterPrice) || 2.70;
      const totalDailyLiters = p * liters;
      const totalYearlyM3 = (totalDailyLiters * 365) / 1000;
      const combinedPriceM3 = freshP + wasteP;
      const totalYearlyCost = totalYearlyM3 * combinedPriceM3;
      return {
        primary: { id: 'totalYearlyCost', label: 'Jährliche Gesamtwasserkosten', value: totalYearlyCost, formattedValue: formatCurrency(totalYearlyCost), highlight: true },
        secondary: [
          { id: 'totalYearlyM3', label: 'Jahresverbrauch in Kubikmetern', value: totalYearlyM3, formattedValue: `${formatNumber(totalYearlyM3, 1)} m³` },
          { id: 'monthlyCost', label: 'Monatliche Kosten', value: totalYearlyCost / 12, formattedValue: formatCurrency(totalYearlyCost / 12) },
          { id: 'costPerPerson', label: 'Kosten pro Person im Jahr', value: totalYearlyCost / p, formattedValue: formatCurrency(totalYearlyCost / p) },
        ],
        summaryText: `Ein ${p}-Personen-Haushalt verbraucht ca. ${formatNumber(totalYearlyM3, 1)} m³ Wasser im Jahr. Bei ${formatCurrency(combinedPriceM3)}/m³ (Wasser + Abwasser) betragen die Gesamtkosten ${formatCurrency(totalYearlyCost)}.`,
      };
    },
    formula: 'Wasserkosten = Personen × Liter/Tag × 365 / 1000 × (Frischwasserpreis + Abwasserpreis)',
    formulaExplanation: 'Das Statistische Bundesamt beziffert den durchschnittlichen Pro-Kopf-Wasserverbrauch in Deutschland auf ca. 125 bis 128 Liter pro Tag.',
    workedExample: {
      title: 'Beispiel: 3 Personen mit 125 Liter/Tag bei 4,80 €/m³ Gesamtgebühr',
      inputValues: [{ label: 'Personen', value: '3' }, { label: 'Verbrauch', value: '125 l/Tag' }, { label: 'Kosten/m³', value: '4,80 €' }],
      steps: ['Verbrauch: 3 × 125 l × 365 = 136.875 l = 136,88 m³', 'Kosten: 136,88 m³ × 4,80 € ≈ 657,00 € pro Jahr'],
      result: '657,00 € jährliche Wasserkosten',
    },
    content: {
      intro: 'Der durchschnittliche Wasserverbrauch liegt in Deutschland bei rund 125 Litern Trinkwasser pro Person und Tag für Duschen, Toilettenspülung, Wäsche und Kochen.',
      details: 'Gesamtwasserkosten setzen sich aus dem Frischwasserbezug und der Abwassergebühr zusammen (bundesweiter Schnitt: ca. 4,00 bis 5,50 € pro Kubikmeter). Ein 3-Personen-Haushalt verbraucht ca. 120 bis 140 m³ Wasser pro Jahr.',
    },
    faqs: [
      { question: 'Welcher Bereich verbraucht im Haushalt das meiste Wasser?', answer: 'Körperpflege (Baden und Duschen) macht rund 36 % des Verbrauchs aus, dicht gefolgt von der Toilettenspülung mit etwa 27 %.' },
      { question: 'Wie viel Wasser spart eine Spartaste an der Toilette?', answer: 'Eine moderne 2-Mengen-Spülung benötigt für das kleine Geschäft nur 3 Liter statt 6 bis 9 Liter beim Vollspülgang – das spart pro Person rund 6.000 bis 8.000 Liter Wasser jährlich.' },
    ],
    relatedSlugs: ['warmwasserkosten-rechner', 'waschmaschine-kosten-rechner', 'spuelmaschine-kosten-rechner'],
  },

  {
    id: 'oelheizung-verbrauch-rechner',
    slug: 'oelheizung-verbrauch-rechner',
    name: 'Heizölverbrauch-Rechner (Liter nach Wohnfläche & Baujahr)',
    shortName: 'Heizölverbrauch berechnen',
    category: 'haushalt-energie',
    subcategory: 'Heizung & Gas',
    metaTitle: 'Heizölverbrauch Rechner – Heizölbedarf in Litern & Tankfüllung',
    metaDescription: 'Berechnen Sie den jährlichen Heizölverbrauch in Litern anhand von Wohnfläche, Dämmzustand und Heizölpreis. Ermitteln Sie die Kosten für den Heizöltank.',
    h1: 'Heizölverbrauch Rechner – Heizölbedarf & Tankkosten berechnen',
    shortDescription: 'Schätzt den jährlichen Heizölbedarf nach Quadratmetern und energetischem Zustand mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['heizoelverbrauch rechner', 'wie viel heizoel pro qm', 'heizoel tankkosten berechnen liter', 'heizoelbedarf einfamilienhaus'],
    inputs: [
      { id: 'livingArea', label: 'Beheizte Wohnfläche in m²', type: 'number', defaultValue: 140, min: 40, max: 600, step: 10, unit: 'm²' },
      {
        id: 'insulationStandard',
        label: 'Energetischer Zustand / Dämmung',
        type: 'select',
        defaultValue: 'standard',
        options: [
          { value: 'modern', label: 'Gut gedämmt / Neubau (ca. 8 Liter Öl/m²a)' },
          { value: 'standard', label: 'Teilsaniert / Standard 90er (ca. 14 Liter Öl/m²a)' },
          { value: 'unrenovated', label: 'Altbau unsaniert vor 1980 (ca. 22 Liter Öl/m²a)' },
        ],
      },
      { id: 'oilPricePerLiter', label: 'Heizölpreis in Euro pro Liter', type: 'number', defaultValue: 1.05, min: 0.5, max: 2.5, step: 0.05, unit: '€/l' },
    ],
    calculate: (inputs) => {
      const area = parseFloat(inputs.livingArea) || 140;
      const type = inputs.insulationStandard || 'standard';
      const price = parseFloat(inputs.oilPricePerLiter) || 1.05;
      let litersPerSqm = 14;
      if (type === 'modern') litersPerSqm = 8;
      if (type === 'unrenovated') litersPerSqm = 22;
      const totalLiters = area * litersPerSqm;
      const totalCost = totalLiters * price;
      return {
        primary: { id: 'totalCost', label: 'Jährliche Heizölkosten', value: totalCost, formattedValue: formatCurrency(totalCost), highlight: true },
        secondary: [
          { id: 'totalLiters', label: 'Heizölbedarf pro Jahr', value: totalLiters, formattedValue: `ca. ${formatNumber(totalLiters, 0)} Liter` },
          { id: 'monthlyCost', label: 'Monatliche Kosten', value: totalCost / 12, formattedValue: formatCurrency(totalCost / 12) },
          { id: 'kwhEquivalent', label: 'Energiegehalt in kWh', value: totalLiters * 10, formattedValue: `ca. ${formatNumber(totalLiters * 10, 0)} kWh` },
        ],
        summaryText: `Für ${area} m² Wohnfläche benötigen Sie ca. ${formatNumber(totalLiters, 0)} Liter Heizöl im Jahr. Bei ${formatCurrency(price)}/Liter entspricht das ${formatCurrency(totalCost)}.`,
      };
    },
    formula: 'Heizölverbrauch = Wohnfläche × Literbedarf pro m²; Kosten = Liter × Literpreis',
    formulaExplanation: 'Ein Liter leichtes Heizöl (EL) besitzt einen Energiegehalt von etwa 10 Kilowattstunden (kWh).',
    workedExample: {
      title: 'Beispiel: 140 m² Wohnfläche bei 14 Liter/m²a und 1,05 €/Liter',
      inputValues: [{ label: 'Wohnfläche', value: '140 m²' }, { label: 'Bedarf/m²', value: '14 Liter' }, { label: 'Ölpreis', value: '1,05 €/l' }],
      steps: ['Verbrauch = 140 m² × 14 l = 1.960 Liter', 'Kosten = 1.960 l × 1,05 € = 2.058,00 € pro Jahr'],
      result: '2.058,00 € jährliche Heizölkosten',
    },
    content: {
      intro: 'Dieser Rechner kalkuliert den jährlichen Heizölverbrauch, Füllstandskosten und die anfallende CO₂-Abgabe für ölbeheizte Wohngebäude.',
      details: '1 Liter leichtes Heizöl (EL) besitzt einen Brennwert von rund 10,0 kWh. Bei einem jährlichen Wärmebedarf von 20.000 kWh werden im Schnitt etwa 2.000 bis 2.200 Liter Heizöl verbraucht.',
    },
    faqs: [
      { question: 'Wie hoch ist die CO₂-Abgabe pro Liter Heizöl?', answer: 'Auf Heizöl fällt nach dem BEHG eine CO₂-Abgabe an, die den Literpreis um derzeit rund 10 bis 13 Cent verteuert.' },
      { question: 'Wann dürfen alte Ölheizungen nach dem GEG noch betrieben werden?', answer: 'Bestehende Ölheizungen dürfen weiter betrieben und repariert werden; Standard-Heizkessel (keine Brennwert- oder Niedertemperaturtechnik) müssen jedoch nach 30 Jahren Betrieb stillgelegt werden (§ 72 GEG).' },
    ],
    relatedSlugs: ['pelletheizung-verbrauch-rechner', 'heizkostenvergleich-rechner', 'gasverbrauch-kwh-m3-rechner', 'waermepumpe-stromkosten-rechner'],
  },

  {
    id: 'pelletheizung-verbrauch-rechner',
    slug: 'pelletheizung-verbrauch-rechner',
    name: 'Pelletheizung-Rechner (Pelletverbrauch & Tonnenbedarf)',
    shortName: 'Pelletverbrauch berechnen',
    category: 'haushalt-energie',
    subcategory: 'Heizung & Gas',
    metaTitle: 'Pelletheizung Rechner – Pelletverbrauch in Tonnen & Kosten',
    metaDescription: 'Ermitteln Sie den Holzpellet-Bedarf in Tonnen und Kilogramm für Ihr Haus sowie die jährlichen Heizkosten im Vergleich zu Öl und Gas.',
    h1: 'Pelletheizung Rechner – Holzpellet-Verbrauch & Kosten berechnen',
    shortDescription: 'Berechnet den Jahresbedarf an Holzpellets aus Heizwärmebedarf oder bisherigem Ölverbrauch.',
    searchKeywords: ['pelletheizung rechner verbrauch', 'holzpellets tonnen pro jahr einfamilienhaus', 'pelletkosten pro tonne', 'pellets statt heizoel umrechnen'],
    inputs: [
      { id: 'heatDemandKwh', label: 'Jährlicher Heizenergiebedarf in kWh (oder bisherige Liter Öl × 10)', type: 'number', defaultValue: 18000, min: 4000, step: 1000, unit: 'kWh' },
      { id: 'pelletPricePerTon', label: 'Pelletpreis pro Tonne (lose Ware inkl. Anlieferung)', type: 'number', defaultValue: 320, min: 180, max: 600, step: 10, unit: '€/t' },
    ],
    calculate: (inputs) => {
      const demand = parseFloat(inputs.heatDemandKwh) || 18000;
      const pricePerTon = parseFloat(inputs.pelletPricePerTon) || 320;
      // 1 kg Pellets = ca. 4,9 kWh Energie. Bei ca. 90 % Wirkungsgrad = ca. 4,4 kWh Nutzwärme je kg.
      const kgNeeded = demand / 4.4;
      const tonsNeeded = kgNeeded / 1000;
      const totalCost = tonsNeeded * pricePerTon;
      const storageVolumeM3 = tonsNeeded * 1.5; // Schüttdichte ca. 650 kg/m³ -> 1 t braucht ca. 1,5 m³
      return {
        primary: { id: 'totalCost', label: 'Jährliche Brennstoffkosten Pellets', value: totalCost, formattedValue: formatCurrency(totalCost), highlight: true },
        secondary: [
          { id: 'tonsNeeded', label: 'Pelletbedarf pro Jahr', value: tonsNeeded, formattedValue: `ca. ${formatNumber(tonsNeeded, 2)} Tonnen` },
          { id: 'monthlyCost', label: 'Monatliche Kosten', value: totalCost / 12, formattedValue: formatCurrency(totalCost / 12) },
          { id: 'storageVolumeM3', label: 'Benötigtes Pelletlager-Volumen', value: storageVolumeM3, formattedValue: `ca. ${formatNumber(storageVolumeM3, 1)} m³` },
        ],
        summaryText: `Für ${formatNumber(demand, 0)} kWh Wärme benötigen Sie ca. ${formatNumber(tonsNeeded, 2)} Tonnen Holzpellets. Bei ${formatCurrency(pricePerTon)}/t betragen die Kosten ${formatCurrency(totalCost)}.`,
      };
    },
    formula: 'Pellets (kg) = Wärmebedarf (kWh) / (4,9 kWh/kg × Wirkungsgrad 0,90)',
    formulaExplanation: 'Zwei Kilogramm Holzpellets (ENplus A1) entsprechen vom Energiegehalt her ziemlich genau einem Liter Heizöl oder einem Kubikmeter Erdgas.',
    workedExample: {
      title: 'Beispiel: 18.000 kWh Wärmebedarf bei 320 € pro Tonne Pellets',
      inputValues: [{ label: 'Wärmebedarf', value: '18.000 kWh' }, { label: 'Pelletpreis', value: '320 €/t' }],
      steps: ['Bedarf = 18.000 / 4,4 ≈ 4.090 kg = 4,09 Tonnen', 'Kosten = 4,09 t × 320 € = 1.308,80 € pro Jahr'],
      result: 'ca. 1.308,80 € pro Jahr (4,09 Tonnen)',
    },
    content: {
      intro: 'Holzpellets sind ein regenerativer Festbrennstoff aus gepressten Holzspänen mit hohem Energiegehalt und stabiler Verbrennungseffizienz.',
      details: '2 Kilogramm genormte Holzpellets (ENplus A1) entsprechen dem Energiegehalt von exakt 1 Liter Heizöl oder 1 m³ Erdgas (ca. 4,9 kWh/kg Heizwert). Pellets unterliegen nicht der nationalen fossilen CO₂-Abgabe.',
    },
    faqs: [
      { question: 'Wie viel Lagerraum benötigt ein Jahresvorrat an Holzpellets?', answer: 'Für ein typisches Einfamilienhaus mit 4 bis 5 Tonnen Jahresbedarf wird ein trockener Lagerraum oder Gewebetank mit ca. 8 bis 10 Kubikmetern Raumvolumen benötigt.' },
      { question: 'Wie stabil ist der Pelletpreis im Vergleich zu Öl und Gas?', answer: 'Da Pellets als Nebenprodukt der regionalen Holzwirtschaft entstehen, sind sie von fossilen Krisen unabhängiger, unterliegen aber witterungs- und baubedingten Marktschwankungen.' },
    ],
    relatedSlugs: ['heizkostenvergleich-rechner', 'oelheizung-verbrauch-rechner', 'waermepumpe-stromkosten-rechner'],
  },

  {
    id: 'klimaanlage-stromkosten-rechner',
    slug: 'klimaanlage-stromkosten-rechner',
    name: 'Klimaanlage Stromkosten-Rechner (Split-Klima & Mobile Geräte)',
    shortName: 'Klimaanlage Stromkosten',
    category: 'haushalt-energie',
    subcategory: 'Strom & Sparen',
    metaTitle: 'Klimaanlage Stromkosten Rechner – Split-Gerät vs. Mobiles K...',
    metaDescription: 'Berechnen Sie die Stromkosten für Klimaanlagen im Sommer: Effiziente Split-Klimaanlage im Vergleich zu mobilen Monoblock-Klimageräten.',
    h1: 'Klimaanlage Stromkosten Rechner – Kühlkosten im Sommer berechnen',
    shortDescription: 'Ermittelt Stromverbrauch und Kosten für Klimageräte an heißen Sommertagen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['klimaanlage stromkosten rechner', 'split klimageraet stromverbrauch euro', 'mobiles klimageraet kosten sommer', 'klimaanlage kwh pro stunde'],
    inputs: [
      {
        id: 'deviceType',
        label: 'Klimaanlagen-Typ',
        type: 'select',
        defaultValue: 'split',
        options: [
          { value: 'split', label: 'Inverter Split-Klimaanlage (ca. 0,6 kWh pro Stunde)' },
          { value: 'mobile', label: 'Mobiles Klimagerät mit Abluftschlauch (ca. 1,2 kWh pro Stunde)' },
        ],
      },
      { id: 'hoursPerDay', label: 'Kühlstunden pro Hitzetag', type: 'number', defaultValue: 6, min: 1, max: 24, step: 1, unit: 'Std./Tag' },
      { id: 'summerDays', label: 'Anzahl heißer Tage im Sommer', type: 'number', defaultValue: 35, min: 5, max: 90, step: 5, unit: 'Tage' },
      { id: 'electricityPrice', label: 'Strompreis in Cent pro kWh', type: 'number', defaultValue: 36, min: 20, max: 60, step: 1, unit: 'ct/kWh' },
    ],
    calculate: (inputs) => {
      const type = inputs.deviceType || 'split';
      const hours = parseFloat(inputs.hoursPerDay) || 6;
      const days = parseInt(inputs.summerDays, 10) || 35;
      const priceCent = parseFloat(inputs.electricityPrice) || 36;
      const kwhPerHour = type === 'split' ? 0.6 : 1.2;
      const costPerHour = kwhPerHour * (priceCent / 100);
      const totalKwh = kwhPerHour * hours * days;
      const totalCost = (totalKwh * priceCent) / 100;
      return {
        primary: { id: 'totalCost', label: 'Stromkosten pro Sommer', value: totalCost, formattedValue: formatCurrency(totalCost), highlight: true },
        secondary: [
          { id: 'costPerHour', label: 'Kosten pro Kühlstunde', value: costPerHour, formattedValue: formatCurrency(costPerHour) },
          { id: 'costPerHotDay', label: 'Kosten an einem Hitzetag', value: costPerHour * hours, formattedValue: formatCurrency(costPerHour * hours) },
          { id: 'totalKwh', label: 'Gesamtstromverbrauch Sommer', value: totalKwh, formattedValue: `${formatNumber(totalKwh, 0)} kWh` },
        ],
        summaryText: `Bei ${days} Sommertagen mit ${hours} Stunden Betrieb kostet die Kühlung ca. ${formatCurrency(totalCost)} (${formatCurrency(costPerHour * hours)} pro Hitzetag).`,
      };
    },
    formula: 'Sommerkosten = kWh/Stunde × Betriebsstunden × Sommertage × Strompreis',
    formulaExplanation: 'Split-Klimageräte sind Wärmepumpen mit SEER-Effizienzwerten von 6 bis 9 und kühlen rund doppelt so sparsam wie mobile Monoblock-Geräte mit Abluftschlauch.',
    workedExample: {
      title: 'Beispiel: Split-Klimagerät 6 Stunden an 35 Sommertagen bei 36 ct/kWh',
      inputValues: [{ label: 'Gerät', value: 'Split-Gerät (0,6 kWh/h)' }, { label: 'Betrieb', value: '6 Std. an 35 Tagen' }],
      steps: ['Verbrauch: 0,6 kWh × 6 h × 35 = 126 kWh', 'Kosten: 126 kWh × 0,36 € = 45,36 € pro Sommer'],
      result: '45,36 € Stromkosten pro Sommer',
    },
    content: {
      intro: 'Dieser Rechner ermittelt die Stromkosten von mobilen Klimageräten und fest installierten Split-Klimaanlagen während sommerlicher Hitzeperioden.',
      details: 'Split-Klimaanlagen erreichen eine Arbeitszahl (SEER) von 6 bis 8 und kühlen hocheffizient (ca. 0,3 bis 0,6 kWh pro Stunde). Mobile Monoblock-Geräte mit Abluftschlauch erreichen nur SEER-Werte um 2,5 und verbrauchen bis zu dreimal so viel Strom.',
    },
    faqs: [
      { question: 'Warum sind mobile Monoblock-Klimageräte mit Schlauch so ineffizient?', answer: 'Der Schlauch transportiert warme Luft durch das gekippte Fenster nach außen; dadurch strömt permanent heiße Außenluft durch Tür- und Fensterspalten in das Zimmer nach.' },
      { question: 'Kann eine moderne Split-Klimaanlage im Winter auch heizen?', answer: 'Ja, moderne Split-Klimageräte sind Luft-Luft-Wärmepumpen: Durch Umkehr des Kältekreislaufs können sie im Übergangsmonaten hocheffizient und kostengünstig heizen.' },
    ],
    relatedSlugs: ['stromkosten-geraete-rechner', 'photovoltaik-amortisation-rechner', 'balkonkraftwerk-ertrag-rechner'],
  },

  {
    id: 'e-auto-ladekosten-zuhause-rechner',
    slug: 'e-auto-ladekosten-zuhause-rechner',
    name: 'E-Auto Ladekosten-Rechner (Wallbox vs. Öffentliche Ladesäule)',
    shortName: 'E-Auto Ladekosten',
    category: 'haushalt-energie',
    subcategory: 'Strom & Sparen',
    metaTitle: 'E-Auto Ladekosten Rechner – Wallbox Zuhause vs. Schnelllade...',
    metaDescription: 'Berechnen Sie die Strom- und Ladekosten für Ihr Elektroauto auf 100 km und pro Jahr: Wallbox zuhause im Vergleich zu öffentlichen Ladesäulen.',
    h1: 'E-Auto Ladekosten Rechner – Ladekosten zuhause & unterwegs',
    shortDescription: 'Vergleicht die Ladekosten an der heimischen Wallbox mit öffentlichen AC- und DC-Ladesäulen.',
    searchKeywords: ['e auto ladekosten rechner', 'was kostet eine akkuladung e auto', 'wallbox stromkosten 100 km', 'oeffentlich laden vs zuhause kosten'],
    inputs: [
      { id: 'consumptionKwhPer100Km', label: 'Durchschnittsverbrauch in kWh pro 100 km (inkl. Ladeverlusten)', type: 'number', defaultValue: 18.5, min: 10, max: 35, step: 0.5, unit: 'kWh/100km' },
      { id: 'yearlyMileageKm', label: 'Jährliche Fahrleistung in km', type: 'number', defaultValue: 15000, min: 1000, step: 1000, unit: 'km' },
      { id: 'homePowerPriceCent', label: 'Strompreis Wallbox Zuhause in Cent pro kWh', type: 'number', defaultValue: 32, min: 15, max: 55, step: 1, unit: 'ct/kWh' },
      { id: 'publicPriceCent', label: 'Öffentlicher Schnelllade-Tarif (DC/HPC) in Cent pro kWh', type: 'number', defaultValue: 59, min: 35, max: 90, step: 1, unit: 'ct/kWh' },
    ],
    calculate: (inputs) => {
      const consumption = parseFloat(inputs.consumptionKwhPer100Km) || 18.5;
      const km = parseFloat(inputs.yearlyMileageKm) || 15000;
      const homeCent = parseFloat(inputs.homePowerPriceCent) || 32;
      const publicCent = parseFloat(inputs.publicPriceCent) || 59;
      const homeCost100 = (consumption * homeCent) / 100;
      const publicCost100 = (consumption * publicCent) / 100;
      const homeYearly = (km / 100) * homeCost100;
      const publicYearly = (km / 100) * publicCost100;
      const yearlySaving = publicYearly - homeYearly;
      return {
        primary: { id: 'homeCost100', label: 'Ladekosten auf 100 km (Zuhause)', value: homeCost100, formattedValue: formatCurrency(homeCost100), highlight: true },
        secondary: [
          { id: 'homeYearly', label: `Jährliche Ladekosten Zuhause (${formatNumber(km, 0)} km)`, value: homeYearly, formattedValue: formatCurrency(homeYearly) },
          { id: 'publicCost100', label: 'Kosten auf 100 km öffentlich (DC)', value: publicCost100, formattedValue: formatCurrency(publicCost100) },
          { id: 'yearlySaving', label: 'Ersparnis durch Wallbox Zuhause', value: yearlySaving, formattedValue: formatCurrency(yearlySaving) },
        ],
        summaryText: `An der eigenen Wallbox zahlen Sie ${formatCurrency(homeCost100)} pro 100 km (öffentlich: ${formatCurrency(publicCost100)}). Bei ${formatNumber(km, 0)} km sparen Sie jährlich ${formatCurrency(yearlySaving)}.`,
      };
    },
    formula: 'Kosten auf 100 km = Verbrauch (kWh/100km) × Strompreis pro kWh',
    formulaExplanation: 'Laden an der eigenen Wallbox ist meist 40 % bis 50 % günstiger als an öffentlichen High-Power-Charging-Stationen (HPC).',
    workedExample: {
      title: 'Beispiel: 18,5 kWh/100 km bei 32 ct/kWh zuhause vs. 59 ct/kWh öffentlich',
      inputValues: [{ label: 'Verbrauch', value: '18,5 kWh/100 km' }, { label: 'Zuhause', value: '32 ct/kWh' }, { label: 'Öffentlich', value: '59 ct/kWh' }],
      steps: ['Zuhause: 18,5 × 0,32 € = 5,92 € / 100 km', 'Öffentlich: 18,5 × 0,59 € = 10,92 € / 100 km', 'Ersparnis bei 15.000 km = 150 × 5,00 € = 750,00 € pro Jahr'],
      result: '5,92 € pro 100 km zuhause (750 € Ersparnis/Jahr)',
    },
    content: {
      intro: 'Dieser Rechner vergleicht die Kosten für das Laden des Elektroautos an der eigenen Wallbox mit einer Photovoltaik-Eigenverbrauchsanlage und dem Netzstromtarif.',
      details: 'Wer Solarstrom vom eigenen Dach lädt (Gestehungskosten ca. 8 bis 11 Cent/kWh), fährt für rund 1,50 bis 2,00 Euro pro 100 Kilometer – bei reinem Netzstrombezug liegen die Kosten bei ca. 5,00 bis 6,50 Euro.',
    },
    faqs: [
      { question: 'Muss eine 11-kW-Wallbox beim Netzbetreiber genehmigt werden?', answer: 'Eine Wallbox mit bis zu 11 kW Ladeleistung ist nach § 19 NAV beim Netzbetreiber anmeldepflichtig, bedarf aber keiner Genehmigung. Erst ab 22 kW ist eine vorherige Genehmigung erforderlich.' },
      { question: 'Was ist PV-Überschussladen?', answer: 'Ein intelligentes Ladesystem regelt die Ladeleistung dynamisch so, dass das Auto nur dann geladen wird, wenn die Solaranlage mehr Strom erzeugt, als das Haus im selben Moment verbraucht.' },
    ],
    relatedSlugs: ['thg-quote-rechner', 'photovoltaik-amortisation-rechner', 'stromkosten-geraete-rechner', 'stromkostenrechner', 'hybrid-auto-kosten-rechner'],
  },

  {
    id: 'co2-abgabe-vermieter-mieter-rechner',
    slug: 'co2-abgabe-vermieter-mieter-rechner',
    name: 'CO2-Kostenaufteilung-Rechner (CO2KostAufG Stufenmodell)',
    shortName: 'CO2-Kostenaufteilung',
    category: 'haushalt-energie',
    subcategory: 'Heizung & Gas',
    metaTitle: 'CO2-Kostenaufteilung Rechner – Stufenmodell Vermieter',
    metaDescription: 'Ermitteln Sie die Aufteilung der CO2-Kosten für Gas und Heizöl zwischen Vermieter und Mieter nach dem 10-Stufenmodell des CO2KostAufG.',
    h1: 'CO2-Kostenaufteilung Rechner – Stufenmodell nach CO2KostAufG',
    shortDescription: 'Berechnet die gesetzliche Aufteilung der CO2-Heizkosten zwischen Mieter und Vermieter.',
    searchKeywords: ['co2 kostenaufteilung rechner', 'co2kostaufg 10 stufenmodell', 'co2 preis vermieter mieter anteil', 'kohlendioxidkostenaufteilungsgesetz'],
    inputs: [
      { id: 'livingArea', label: 'Wohnfläche der Wohnung in m²', type: 'number', defaultValue: 80, min: 20, max: 400, step: 5, unit: 'm²' },
      { id: 'co2CostTotal', label: 'Gesamte CO2-Kosten auf der Heizkostenabrechnung', type: 'number', defaultValue: 140, min: 10, step: 5, unit: '€' },
      { id: 'co2EmissionKgPerSqm', label: 'CO2-Ausstoß in kg pro m² Wohnfläche im Jahr (z. B. 28 kg/m²a)', type: 'number', defaultValue: 28, min: 5, max: 70, step: 1, unit: 'kg/m²a' },
    ],
    calculate: (inputs) => {
      const area = parseFloat(inputs.livingArea) || 80;
      const total = parseFloat(inputs.co2CostTotal) || 140;
      const kg = parseFloat(inputs.co2EmissionKgPerSqm) || 28;

      // 10-Stufenmodell nach Anlage zu § 5 CO2KostAufG:
      // < 12 kg: 0% Vermieter / 100% Mieter
      // 12-17 kg: 10% Vermieter
      // 17-22 kg: 20% Vermieter
      // 22-27 kg: 30% Vermieter
      // 27-32 kg: 40% Vermieter
      // 32-37 kg: 50% Vermieter
      // 37-42 kg: 60% Vermieter
      // 42-47 kg: 70% Vermieter
      // 47-52 kg: 80% Vermieter
      // >= 52 kg: 95% Vermieter
      let landlordPct = 0.40;
      if (kg < 12) landlordPct = 0;
      else if (kg < 17) landlordPct = 0.10;
      else if (kg < 22) landlordPct = 0.20;
      else if (kg < 27) landlordPct = 0.30;
      else if (kg < 32) landlordPct = 0.40;
      else if (kg < 37) landlordPct = 0.50;
      else if (kg < 42) landlordPct = 0.60;
      else if (kg < 47) landlordPct = 0.70;
      else if (kg < 52) landlordPct = 0.80;
      else landlordPct = 0.95;

      const tenantPct = 1 - landlordPct;
      const landlordShare = total * landlordPct;
      const tenantShare = total * tenantPct;

      return {
        primary: { id: 'landlordShare', label: 'Kostenanteil Vermieter', value: landlordShare, formattedValue: formatCurrency(landlordShare), highlight: true },
        secondary: [
          { id: 'tenantShare', label: 'Kostenanteil Mieter', value: tenantShare, formattedValue: formatCurrency(tenantShare) },
          { id: 'landlordPct', label: 'Vermieter-Anteil nach Stufe', value: landlordPct * 100, formattedValue: formatPercent(landlordPct * 100, 0) },
          { id: 'tenantPct', label: 'Mieter-Anteil nach Stufe', value: tenantPct * 100, formattedValue: formatPercent(tenantPct * 100, 0) },
        ],
        summaryText: `Bei ${kg} kg CO2/m²a greift Stufe 5: Der Vermieter übernimmt ${formatPercent(landlordPct * 100, 0)} (${formatCurrency(landlordShare)}) und der Mieter ${formatPercent(tenantPct * 100, 0)} (${formatCurrency(tenantShare)}) der CO2-Kosten.`,
      };
    },
    formula: 'Aufteilung nach 10-Stufenmodell des CO2KostAufG gemäß CO2-Ausstoß pro m²',
    formulaExplanation: 'Je schlechter das Gebäude energetisch isoliert ist (höhere CO2-Emissionen pro m²), desto größer ist der Kostenanteil, den der Vermieter tragen muss.',
    workedExample: {
      title: 'Beispiel: 140 € CO2-Kosten bei 28 kg CO2/m²a',
      inputValues: [{ label: 'Gesamtkosten', value: '140 €' }, { label: 'Emission', value: '28 kg CO2/m²a' }],
      steps: ['Bereich 27 bis 32 kg CO2/m²a = 40 % Vermieter, 60 % Mieter', 'Vermieteranteil: 140 € × 0,40 = 56,00 €', 'Mieteranteil: 140 € × 0,60 = 84,00 €'],
      result: 'Vermieter: 56,00 € / Mieter: 84,00 €',
    },
    content: {
      intro: 'Das Kohlendioxidkostenaufteilungsgesetz (CO2KostAufG) teilt die CO₂-Kosten für Heizöl, Gas und Fernwärme nach einem 10-Stufen-Modell zwischen Vermieter und Mieter auf.',
      details: 'Je schlechter der energetische Zustand des Gebäudes (hoher CO₂-Ausstoß je m² Wohnfläche), desto höher ist der prozentuale Anteil, den der Vermieter selbst tragen muss (bis zu 95 %). Bei Passivhäusern trägt der Mieter die Kosten zu 100 % allein.',
    },
    faqs: [
      { question: 'Wie ermittelt der Vermieter die CO₂-Einstufung des Gebäudes?', answer: 'Anhand der CO₂-Menge aus der Brennstoffrechnung geteilt durch die Wohnfläche. Die Stufentabelle im CO2KostAufG weist den genauen prozentualen Verteilungsschlüssel aus.' },
      { question: 'Darf der Vermieter seinen CO₂-Anteil auf den Mieter abwälzen?', answer: 'Nein, vertragliche Vereinbarungen, die dem Mieter einen höheren CO₂-Kostenanteil auferlegen als gesetzlich vorgeschrieben, sind nach § 3 CO2KostAufG unwirksam.' },
    ],
    relatedSlugs: ['gasverbrauch-kwh-m3-rechner', 'warmmiete-zu-kaltmiete-rechner', 'heizkostenvergleich-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Kohlendioxidkostenaufteilungsgesetz (CO2KostAufG Stufenmodell)',
      sourceUrl: 'https://www.bmwk.de',
      lastVerified: '2026-01-15',
    }
  },

  {
    id: 'lebensmittelbudget-rechner',
    slug: 'lebensmittelbudget-rechner',
    name: 'Lebensmittelbudget & Haushaltsgeld-Rechner',
    shortName: 'Lebensmittelbudget',
    category: 'haushalt-energie',
    subcategory: 'Haushalt & Konsum',
    metaTitle: 'Lebensmittelbudget Rechner – Monatliche Essenskosten',
    metaDescription: 'Berechnen Sie das optimale Haushaltsbudget für Lebensmittel, Getränke und Drogerieartikel nach Haushaltsgröße und Ernährungsstil.',
    h1: 'Lebensmittelbudget Rechner – Essenskosten & Haushaltsgeld planen',
    shortDescription: 'Kalkuliert realistische Monats- und Wochenausgaben für Ernährung und Einkäufe mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['lebensmittelbudget rechner', 'haushaltsgeld wie viel pro monat', 'essenskosten pro person berechnen', 'wocheneinkauf budget'],
    inputs: [
      { id: 'adults', label: 'Anzahl Erwachsene im Haushalt', type: 'number', defaultValue: 2, min: 1, max: 10, step: 1 },
      { id: 'children', label: 'Anzahl Kinder im Haushalt', type: 'number', defaultValue: 1, min: 0, max: 10, step: 1 },
      {
        id: 'lifestyle',
        label: 'Einkaufsstil & Ernährungsweise',
        type: 'select',
        defaultValue: 'standard',
        options: [
          { value: 'thrifty', label: 'Sehr sparsam / Hauptsächlich Discounter (ca. 220 € / Erw.)' },
          { value: 'standard', label: 'Ausgewogen / Mix aus Supermarkt & Discounter (ca. 310 € / Erw.)' },
          { value: 'bio', label: 'Bio / Hoher Frischwaren- & Wochenmarktanteil (ca. 420 € / Erw.)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const adults = parseInt(inputs.adults, 10) || 2;
      const kids = parseInt(inputs.children, 10) || 1;
      const style = inputs.lifestyle || 'standard';
      let adultRate = 310;
      let childRate = 190;
      if (style === 'thrifty') { adultRate = 220; childRate = 135; }
      if (style === 'bio') { adultRate = 420; childRate = 260; }
      const totalMonth = (adults * adultRate) + (kids * childRate);
      const weekly = (totalMonth * 12) / 52;
      const daily = totalMonth / 30;
      return {
        primary: { id: 'totalMonth', label: 'Empfohlenes monatliches Lebensmittelbudget', value: totalMonth, formattedValue: formatCurrency(totalMonth), highlight: true },
        secondary: [
          { id: 'weekly', label: 'Budget pro Woche (Wocheneinkauf)', value: weekly, formattedValue: formatCurrency(weekly) },
          { id: 'daily', label: 'Budget pro Tag', value: daily, formattedValue: formatCurrency(daily) },
          { id: 'perPerson', label: 'Durchschnitt pro Kopf / Monat', value: totalMonth / (adults + kids), formattedValue: formatCurrency(totalMonth / (adults + kids)) },
        ],
        summaryText: `Für ${adults} Erwachsene und ${kids} Kinder empfehlen wir ein Haushaltsbudget von ${formatCurrency(totalMonth)} pro Monat (ca. ${formatCurrency(weekly)} pro Wocheneinkauf).`,
      };
    },
    formula: 'Monatsbudget = (Erwachsene × Satz_Erwachsener) + (Kinder × Satz_Kind)',
    formulaExplanation: 'Basierend auf den statistischen Konsumausgaben privater Haushalte in Deutschland (EVS / Destatis).',
    workedExample: {
      title: 'Beispiel: 2 Erwachsene + 1 Kind (Ausgewogener Einkaufsstil)',
      inputValues: [{ label: 'Erwachsene', value: '2' }, { label: 'Kinder', value: '1' }, { label: 'Stil', value: 'Ausgewogen' }],
      steps: ['Erwachsene: 2 × 310 € = 620 €', 'Kind: 1 × 190 € = 190 €', 'Summe = 810,00 € pro Monat (ca. 187 €/Woche)'],
      result: '810,00 € Monatsbudget',
    },
    content: {
      intro: 'Dieser Haushaltsbudgetrechner ermittelt die monatlichen und wöchentlichen Ausgaben für Ernährung, Supermarkteinkäufe und Drogeriewaren basierend auf der Haushaltsgröße.',
      details: 'Statistisches Bundesamt: Ein Single gibt in Deutschland im Schnitt rund 220 bis 300 € monatlich für Nahrungsmittel und Getränke aus; bei sparsamer Wirtschaftsweise reichen oft 160 bis 200 €.',
    },
    faqs: [
      { question: 'Welche Faustregel gilt für das Wocheneinkaufsbudget pro Person?', answer: 'Als Faustformel gelten ca. 45 bis 65 Euro pro erwachsener Person und Woche für einen ausgewogenen, selbstgekochten Speiseplan.' },
      { question: 'Wie spart man beim Lebensmitteleinkauf am effektivsten?', answer: 'Wochenplan schreiben, zielgerichtet nach Einkaufszettel einkaufen, Saisonware bevorzugen und Lebensmittelverschwendung durch gezieltes Reste-Kochen vermeiden.' },
    ],
    relatedSlugs: ['stromkosten-geraete-rechner', 'spuelmaschine-kosten-rechner', 'notgroschen-rechner'],
  },

  {
    id: 'energieeffizienzklasse-rechner',
    slug: 'energieeffizienzklasse-rechner',
    name: 'Energieeffizienzklasse-Rechner (Gebäude A+ bis H nach GEG)',
    shortName: 'Energieeffizienzklasse',
    category: 'haushalt-energie',
    subcategory: 'Heizung & Gas',
    metaTitle: 'Energieeffizienzklasse Rechner Gebäude – Endenergiebedarf A...',
    metaDescription: 'Ermitteln Sie die Energieeffizienzklasse Ihres Hauses (A+ bis H) anhand des Endenergiebedarfs in kWh/(m²·a) nach Gebäudeenergiegesetz (GEG).',
    h1: 'Energieeffizienzklasse Rechner – Haus-Energieklasse nach GEG ermitteln',
    shortDescription: 'Ordnet den Endenergieverbrauch der offiziellen Energieeffizienzklasse von A+ bis H zu.',
    searchKeywords: ['energieeffizienzklasse rechner haus', 'kwh pro qm energieausweis klasse', 'effizienzklasse a plus bis h', 'gebaeudeenergiegesetz effizienzklassen'],
    inputs: [
      { id: 'endenergieKwh', label: 'Endenergiebedarf / Endenergieverbrauch in kWh/(m²·a)', type: 'number', defaultValue: 115, min: 10, max: 400, step: 5, unit: 'kWh/(m²·a)' },
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.endenergieKwh) || 115;
      let klasse = 'D';
      let description = 'Durchschnittlich gedämmtes Mehrfamilienhaus / teilsaniert';
      if (val < 30) { klasse = 'A+'; description = 'Passivhaus / KfW 40 / Höchster Effizienzstandard'; }
      else if (val < 50) { klasse = 'A'; description = 'KfW 55 Neubau / Sehr geringer Energiebedarf'; }
      else if (val < 75) { klasse = 'B'; description = 'Guter Neubaustandard / KfW 70'; }
      else if (val < 100) { klasse = 'C'; description = 'Gut modernisierter Altbau'; }
      else if (val < 130) { klasse = 'D'; description = 'Teilsaniert / Durchschnittlicher Gebäudebestand'; }
      else if (val < 160) { klasse = 'E'; description = 'Geringfügig modernisiert / Verbesserungsbedarf'; }
      else if (val < 200) { klasse = 'F'; description = 'Umfassend sanierungsbedürftig'; }
      else if (val < 250) { klasse = 'G'; description = 'Hoher Energieverbrauch / Ungedämmter Altbau'; }
      else { klasse = 'H'; description = 'Extrem hoher Verbrauch / Sanierungsdringlichkeit!'; }

      return {
        primary: { id: 'klasse', label: 'Offizielle Energieeffizienzklasse', value: 0, formattedValue: `Klasse ${klasse}`, highlight: true },
        secondary: [
          { id: 'endenergie', label: 'Endenergie-Kennwert', value: val, formattedValue: `${formatNumber(val, 1)} kWh/(m²·a)` },
          { id: 'description', label: 'Gebäudebewertung', value: 0, formattedValue: description },
        ],
        summaryText: `Mit einem Endenergiebedarf von ${formatNumber(val, 1)} kWh/(m²·a) erreicht das Gebäude die Energieeffizienzklasse ${klasse} (${description}).`,
      };
    },
    formula: 'Einstufung nach Anlage 10 des Gebäudeenergiegesetzes (GEG)',
    formulaExplanation: 'Der Energieausweis teilt Wohngebäude in 9 Effizienzklassen von A+ (< 30 kWh/m²a) bis H (> 250 kWh/m²a) ein.',
    workedExample: {
      title: 'Beispiel: 115 kWh/(m²·a) Endenergiebedarf',
      inputValues: [{ label: 'Kennwert', value: '115 kWh/(m²·a)' }],
      steps: ['Bereich 100 bis 130 kWh/(m²·a) entspricht Klasse D', 'Typisch für teilsanierte Bestandsgebäude der 80er/90er Jahre'],
      result: 'Energieeffizienzklasse D',
    },
    content: {
      intro: 'Der Energieeffizienzklasse-Rechner ordnet ein Wohngebäude anhand seines Endenergiebedarfs in kWh/(m²·a) den Klassen A+ bis H des Gebäudeenergiegesetzes (GEG) zu.',
      details: 'Klasse A+ entspricht < 30 kWh/(m²·a), A < 50 kWh/(m²·a), B < 75 kWh/(m²·a). Ab Klasse F (> 160 kWh/(m²·a)) bis H (> 250 kWh/(m²·a)) liegt gravierender Sanierungsbedarf vor.',
    },
    faqs: [
      { question: 'Wo findet man die Energieeffizienzklasse einer Immobilie?', answer: 'Auf Seite 1 des offiziellen Energieausweises (Bedarfs- oder Verbrauchsausweis), der bei Verkauf oder Neuvermietung gesetzlich vorgelegt werden muss.' },
      { question: 'Welche Effizienzklassen drohen bei künftigen EU-Sanierungsvorgaben (EPBD)?', answer: 'Die EU-Gebäuderichtlinie zielt darauf ab, Gebäude mit den schlechtesten Effizienzklassen G und H schrittweise über Sanierungsfahrpläne auf höhere Standards anzuheben.' },
    ],
    relatedSlugs: ['waermepumpe-stromkosten-rechner', 'gasverbrauch-kwh-m3-rechner', 'heizkostenvergleich-rechner'],
  },
];
