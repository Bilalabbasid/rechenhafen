import { CalculatorDefinition } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';

// Heizölverbrauch-Rechner: Modellannahmen in Litern Heizöl je m² Wohnfläche und Jahr.
// Werden für Berechnung UND Beispieltabelle verwendet.
const HEATING_OIL_L_PER_SQM = { modern: 8, standard: 14, unrenovated: 22 } as const;
const heatingOilCost = (liters: number, price: number) => (liters === 0 || price === 0 ? 0 : Math.round(liters * price * 100) / 100);

function buildHeatingOilQuickReference(): string {
  const examplePrice = 1.05;
  const rows = [100, 140, 180]
    .map((area) => {
      const cells = (['modern', 'standard', 'unrenovated'] as const).map((k) => {
        const liters = area * HEATING_OIL_L_PER_SQM[k];
        return `${formatNumber(liters, 0)} l (${formatCurrency(heatingOilCost(liters, examplePrice))})`;
      });
      return `| ${area} m² | ${cells.join(' | ')} |`;
    })
    .join('\n');
  const exLiters = 140 * HEATING_OIL_L_PER_SQM.standard;
  return [
    '`Heizölverbrauch = Wohnfläche × angenommener Verbrauch in Liter pro m² und Jahr`',
    `Beispiel: 140 m² × ${HEATING_OIL_L_PER_SQM.standard} l/m² pro Jahr = ${formatNumber(exLiters, 0)} Liter pro Jahr. Bei ${formatCurrency(examplePrice)} je Liter: ${formatNumber(exLiters, 0)} × ${formatCurrency(examplePrice)} = ${formatCurrency(heatingOilCost(exLiters, examplePrice))} pro Jahr.`,
    `**Beispielszenarien** (Liter pro Jahr, in Klammern Kosten bei ${formatCurrency(examplePrice)}/l):`,
    `| Wohnfläche | Gut gedämmt (${HEATING_OIL_L_PER_SQM.modern} l/m²) | Teilsaniert (${HEATING_OIL_L_PER_SQM.standard} l/m²) | Unsaniert (${HEATING_OIL_L_PER_SQM.unrenovated} l/m²) |\n| --- | --- | --- | --- |\n${rows}`,
    'Die Werte 8, 14 und 22 l/m² sind vereinfachte Modellannahmen des Rechners, keine gemessenen Durchschnittswerte. Der Beispielpreis ist kein aktueller Marktpreis – tragen Sie Ihren eigenen Literpreis ein. Ihren tatsächlichen Verbrauch ermitteln Sie am genauesten über Tankstände und Liefermengen.',
  ].join('\n\n');
}

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
      { id: 'warmRent', label: 'Monatliche Warmmiete (Bruttomiete inkl. Nebenkosten)', type: 'number', defaultValue: 950, min: 0, step: 25, unit: '€' },
      { id: 'defectPct', label: 'Minderungssatz laut Urteilen / Minderungstabelle', type: 'number', defaultValue: 20, min: 0, max: 100, step: 1, unit: '%' },
      { id: 'defectDays', label: 'Dauer des Mangels im Monat (Tage)', type: 'number', defaultValue: 30, min: 0, max: 31, step: 1, unit: 'Tage', helpText: 'Abrechnungskonvention: Im deutschen Mietrecht wird der Abrechnungsmonat einheitlich mit 30 Tagen berechnet (§ 536 BGB / BGH).' },
    ],
    calculate: (inputs) => {
      const warmStr = String(inputs.warmRent ?? inputs.monthlyRent ?? '').trim();
      const pctStr = String(inputs.defectPct ?? inputs.reductionPercent ?? '').trim();
      const daysStr = String(inputs.defectDays ?? inputs.days ?? '').trim();

      if (warmStr === '') {
        return {
          primary: { id: 'reduction', label: 'Errechnete Mietminderung', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie die monatliche Warmmiete ein.',
        };
      }
      if (pctStr === '') {
        return {
          primary: { id: 'reduction', label: 'Errechnete Mietminderung', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie den Minderungssatz in % ein (0 % falls keine Minderung anfällt).',
        };
      }
      if (daysStr === '') {
        return {
          primary: { id: 'reduction', label: 'Errechnete Mietminderung', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie die Dauer des Mangels in Tagen ein (0 bis 30 Tage).',
        };
      }

      const warm = parseFloat(warmStr.replace(',', '.'));
      const pct = parseFloat(pctStr.replace(',', '.'));
      const days = parseInt(daysStr, 10);

      if (isNaN(warm) || isNaN(pct) || isNaN(days) || warm < 0 || pct < 0 || days < 0) {
        return {
          primary: { id: 'reduction', label: 'Errechnete Mietminderung', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie gültige Zahlenwerte ein (Warmmiete, Minderungssatz und Tage dürfen nicht negativ sein).',
        };
      }

      const fullMonthReduction = warm * (pct / 100);
      const actualReduction = (days > 0 && pct > 0) ? (fullMonthReduction * days) / 30 : 0;
      const reducedRent = warm - actualReduction;
      const dailySaving = (days > 0 && actualReduction > 0) ? actualReduction / days : 0;

      return {
        primary: { id: 'reduction', label: 'Errechnete Mietminderung', value: actualReduction, formattedValue: formatCurrency(actualReduction), highlight: true },
        secondary: [
          { id: 'reducedRent', label: 'Geminderte Restmiete', value: reducedRent, formattedValue: formatCurrency(reducedRent) },
          { id: 'dailySaving', label: 'Minderung pro Tag', value: dailySaving, formattedValue: formatCurrency(dailySaving) },
        ],
        summaryText: actualReduction === 0
          ? `Bei einem Minderungssatz von ${formatPercent(pct, 0)} über ${days} Tage beträgt die Mietminderung 0,00 €. Die monatliche Miete verbleibt unverändert bei ${formatCurrency(warm)}.`
          : `Bei einem Minderungssatz von ${formatPercent(pct, 0)} über ${days} Tage mindert sich Ihre Monatsmiete um ${formatCurrency(actualReduction)} auf ${formatCurrency(reducedRent)}.`,
        directAnswer: actualReduction === 0
          ? `Bei ${formatCurrency(warm)} Warmmiete und ${formatPercent(pct, 0)} Minderung für ${days} Tage beträgt die Mietminderung ${formatCurrency(0)}. Die Miete bleibt bei ${formatCurrency(warm)}.`
          : `Bei ${formatCurrency(warm)} Warmmiete und ${formatPercent(pct, 0)} Minderung für ${days} Tage beträgt die Mietminderung ${formatCurrency(actualReduction)}. Die geminderte Monatsmiete beträgt ${formatCurrency(reducedRent)}.`,
        qualifications: [
          'Berechnungsgrundlage ist nach ständiger BGH-Rechtsprechung (BGH VIII ZR 225/03) die Bruttowarmmiete.',
          'Monats-/Tageskonvention: Der Kalendermonat wird juristisch einheitlich mit 30 Tagen berechnet (§ 536 BGB / BGH VIII ZR 296/09).',
        ],
        basisSummary: [
          { label: 'Warmmiete', value: formatCurrency(warm) },
          { label: 'Minderungssatz', value: formatPercent(pct, 0) },
          { label: 'Ausfalltage', value: `${days} von 30 Tagen` },
        ],
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
      { id: 'startRent', label: 'Anfangs-Kaltmiete', type: 'number', defaultValue: 750, min: 0, step: 25, unit: '€', helpText: 'Anfangs-Kaltmiete in Euro (z. B. 0 € bei mietfreier Anfangsüberlassung).' },
      { id: 'increaseAmount', label: 'Mieterhöhung je Staffel (Betrag in Euro)', type: 'number', defaultValue: 35, min: 0, step: 5, unit: '€', helpText: 'Vereinbarter Erhöhungsbetrag je Staffel in Euro. Bei 0 € bleibt die Miete unverändert.' },
      { id: 'intervalMonths', label: 'Staffelabstand in Monaten (mindestens 12 Monate)', type: 'number', defaultValue: 12, min: 12, max: 60, step: 12, unit: 'Monate' },
      { id: 'totalYears', label: 'Betrachtungszeitraum in Jahren', type: 'number', defaultValue: 5, min: 1, max: 15, step: 1, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const startRaw = inputs.startRent;
      const incRaw = inputs.increaseAmount;
      const intervalRaw = inputs.intervalMonths;
      const yearsRaw = inputs.totalYears ?? inputs.years;

      const startStr = startRaw !== undefined && startRaw !== null ? String(startRaw).trim() : '';
      const incStr = incRaw !== undefined && incRaw !== null ? String(incRaw).trim() : '';
      const intervalStr = intervalRaw !== undefined && intervalRaw !== null ? String(intervalRaw).trim() : '';
      const yearsStr = yearsRaw !== undefined && yearsRaw !== null ? String(yearsRaw).trim() : '';

      const start = startStr !== '' ? parseFloat(startStr.replace(',', '.')) : 750;
      const inc = incStr !== '' ? parseFloat(incStr.replace(',', '.')) : 35;
      const interval = intervalStr !== '' ? parseInt(intervalStr, 10) : 12;
      const years = yearsStr !== '' ? parseInt(yearsStr, 10) : 5;

      if (isNaN(start) || isNaN(inc) || isNaN(interval) || isNaN(years) || start < 0 || inc < 0 || interval < 12 || years < 1) {
        return {
          primary: { id: 'endRent', label: 'Kaltmiete nach Laufzeit', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie gültige Werte ein (Staffelabstand mindestens 12 Monate nach § 557a BGB).',
        };
      }

      const stepsCount = Math.floor((years * 12) / interval);
      const endRent = start + (stepsCount * inc);
      const pctIncrease = start > 0 ? ((endRent - start) / start) * 100 : 0;

      const breakdownRows = [];
      for (let y = 1; y <= years; y++) {
        const passedIntervals = Math.floor((y * 12) / interval);
        const rentAtYear = start + (passedIntervals * inc);
        breakdownRows.push({
          period: `Jahr ${y}`,
          values: {
            year: `Jahr ${y}`,
            rent: formatCurrency(rentAtYear),
            increase: formatCurrency(rentAtYear - start),
          },
        });
      }

      return {
        primary: { id: 'endRent', label: `Kaltmiete nach ${years} Jahren`, value: endRent, formattedValue: formatCurrency(endRent), highlight: true },
        secondary: [
          { id: 'totalIncrease', label: 'Gesamte Mietsteigerung', value: endRent - start, formattedValue: formatCurrency(endRent - start) },
          { id: 'percentIncrease', label: 'Steigerung in Prozent', value: pctIncrease, formattedValue: formatPercent(pctIncrease, 1) },
          { id: 'stepsCount', label: 'Anzahl Mieterhöhungen', value: stepsCount, formattedValue: `${stepsCount} Staffeln` },
        ],
        breakdown: {
          columns: [
            { key: 'year', label: 'Jahr' },
            { key: 'rent', label: 'Monatliche Kaltmiete' },
            { key: 'increase', label: 'Gesamterhöhung' },
          ],
          rows: breakdownRows,
        },
        summaryText: `Nach ${years} Jahren und ${stepsCount} Staffeln steigt Ihre Kaltmiete von ${formatCurrency(start)} auf ${formatCurrency(endRent)} (${formatPercent(pctIncrease, 1)} Zuwachs).`,
        directAnswer: inc === 0
          ? `Bei 0,00 € Staffelbetrag bleibt die Kaltmiete nach ${years} Jahren und ${stepsCount} Intervallen unverändert bei ${formatCurrency(endRent)}.`
          : `Nach ${years} Jahren und ${stepsCount} Staffeln à ${formatCurrency(inc)} steigt die Kaltmiete von ${formatCurrency(start)} auf ${formatCurrency(endRent)} (+${formatCurrency(endRent - start)}).`,
        qualifications: [
          'Mathematische Projektion der Mietentwicklung über den gewählten Zeitraum.',
          'Rechtlicher Rahmen (§ 557a BGB): Eine rechtswirksame Staffelmietvereinbarung verlangt bezifferte Beträge und Mindestabstände von einem Jahr.',
        ],
        basisSummary: [
          { label: 'Anfangsmiete', value: formatCurrency(start) },
          { label: 'Erhöhungsbetrag', value: `${formatCurrency(inc)} / Staffel` },
          { label: 'Staffelintervall', value: `${interval} Monate` },
          { label: 'Laufzeit', value: `${years} Jahre (${stepsCount} Staffeln)` },
        ],
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
      { id: 'currentRent', label: 'Aktuelle monatliche Kaltmiete', type: 'number', defaultValue: 850, min: 0, step: 25, unit: '€', helpText: 'Bisherige Nettokaltmiete in Euro.' },
      { id: 'oldVpi', label: 'Alter Indexstand (bei Vertragsbeginn / letzter Erhöhung)', type: 'number', defaultValue: 105.8, min: 1, max: 300, step: 0.1, helpText: 'Basis-Indexwert des Statistischen Bundesamtes (Destatis).' },
      { id: 'newVpi', label: 'Neuer Indexstand (aktueller VPI Destatis)', type: 'number', defaultValue: 118.5, min: 1, max: 300, step: 0.1, helpText: 'Aktueller VPI-Stand zum Anpassungszeitpunkt.' },
    ],
    calculate: (inputs) => {
      const rentRaw = inputs.currentRent;
      const oldRaw = inputs.oldVpi;
      const newRaw = inputs.newVpi;

      const rentStr = rentRaw !== undefined && rentRaw !== null ? String(rentRaw).trim() : '';
      const oldStr = oldRaw !== undefined && oldRaw !== null ? String(oldRaw).trim() : '';
      const newStr = newRaw !== undefined && newRaw !== null ? String(newRaw).trim() : '';

      const rent = rentStr !== '' ? parseFloat(rentStr.replace(',', '.')) : 850;
      const oldI = oldStr !== '' ? parseFloat(oldStr.replace(',', '.')) : 105.8;
      const newI = newStr !== '' ? parseFloat(newStr.replace(',', '.')) : 118.5;

      if (isNaN(rent) || isNaN(oldI) || isNaN(newI) || rent < 0 || oldI <= 0 || newI <= 0) {
        return {
          primary: { id: 'newRent', label: 'Neue zulässige Kaltmiete', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie gültige Werte ein (Alter und neuer VPI müssen größer als 0 sein).',
        };
      }

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
        directAnswer: `Bei einem VPI-Anstieg von ${formatNumber(oldI, 1)} auf ${formatNumber(newI, 1)} (${formatPercent(pctChange, 2)}) ändert sich die Kaltmiete von ${formatCurrency(rent)} um ${formatCurrency(diff)} auf ${formatCurrency(newRent)} monatlich.`,
        basisSummary: [
          { label: 'Bisherige Kaltmiete', value: formatCurrency(rent) },
          { label: 'Alter VPI-Stand', value: formatNumber(oldI, 1) },
          { label: 'Neuer VPI-Stand', value: formatNumber(newI, 1) },
          { label: 'Veränderung', value: formatPercent(pctChange, 2) },
        ],
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
      { id: 'fullArea', label: 'Voll anrechenbare Grundfläche (über 2 Meter Höhe)', type: 'number', defaultValue: 65, min: 0, step: 1, unit: 'm²', helpText: 'Räume mit lichter Raumhöhe ab 2,00 m (100 % Anrechnung).' },
      { id: 'slopedArea', label: 'Fläche mit lichter Höhe zwischen 1 m und 2 m (50 % Anrechnung)', type: 'number', defaultValue: 14, min: 0, step: 1, unit: 'm²', helpText: 'Dachschrägenbereiche zwischen 1,00 m und 1,99 m lichter Höhe.' },
      { id: 'balconyArea', label: 'Balkon- / Terrassengrundfläche (üblicherweise 25 % Anrechnung)', type: 'number', defaultValue: 8, min: 0, step: 0.5, unit: 'm²', helpText: 'Grundfläche von Balkonen, Loggien, Dachgärten und Terrassen.' },
    ],
    calculate: (inputs) => {
      const fullRaw = inputs.fullArea;
      const slopedRaw = inputs.slopedArea;
      const balconyRaw = inputs.balconyArea;

      const fullStr = fullRaw !== undefined && fullRaw !== null ? String(fullRaw).trim() : '';
      const slopedStr = slopedRaw !== undefined && slopedRaw !== null ? String(slopedRaw).trim() : '';
      const balconyStr = balconyRaw !== undefined && balconyRaw !== null ? String(balconyRaw).trim() : '';

      const full = fullStr !== '' ? parseFloat(fullStr.replace(',', '.')) : 65;
      const sloped = slopedStr !== '' ? parseFloat(slopedStr.replace(',', '.')) : 14;
      const balcony = balconyStr !== '' ? parseFloat(balconyStr.replace(',', '.')) : 8;

      if (isNaN(full) || isNaN(sloped) || isNaN(balcony) || full < 0 || sloped < 0 || balcony < 0) {
        return {
          primary: { id: 'totalWohnflaeche', label: 'Rechtssichere Wohnfläche nach WoFlV', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie gültige Flächenwerte ein (Flächen dürfen nicht negativ sein).',
        };
      }

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
        directAnswer: `Aus ${formatNumber(full, 2)} m² Vollfläche, ${formatNumber(sloped, 2)} m² Schrägen (zu 50 %) und ${formatNumber(balcony, 2)} m² Balkon (zu 25 %) ergibt sich eine anrechenbare Wohnfläche von ${formatNumber(totalWohnflaeche, 2)} m².`,
        basisSummary: [
          { label: 'Vollfläche (> 2 m)', value: `${formatNumber(full, 2)} m²` },
          { label: 'Dachschräge (1-2 m)', value: `${formatNumber(sloped, 2)} m² (angerechnet: ${formatNumber(countedSloped, 2)} m²)` },
          { label: 'Balkon / Terrasse', value: `${formatNumber(balcony, 2)} m² (angerechnet: ${formatNumber(countedBalcony, 2)} m²)` },
          { label: 'Grundfläche gesamt', value: `${formatNumber(totalGroundArea, 2)} m²` },
        ],
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
      { id: 'propertyValue', label: 'Festgestellter Grundsteuerwert (Finanzamt-Bescheid)', type: 'number', defaultValue: 280000, min: 0, step: 5000, unit: '€', helpText: 'Vom Finanzamt im Grundsteuerwertbescheid festgestellter Wert.' },
      { id: 'measureRate', label: 'Steuermesszahl (z. B. 0,031 % = 0,31 ‰ für Wohnen)', type: 'number', defaultValue: 0.031, min: 0, max: 0.1, step: 0.001, unit: '%', helpText: 'Gesetzliche Steuermesszahl in % (z. B. 0,031 % für Wohnimmobilien im Bundesmodell).' },
      { id: 'hebesatz', label: 'Hebesatz der Gemeinde (Grundsteuer B)', type: 'number', defaultValue: 480, min: 0, max: 1500, step: 10, unit: '%', helpText: 'Kommunaler Hebesatz der zuständigen Stadt oder Gemeinde in %.' },
    ],
    calculate: (inputs) => {
      const valRaw = inputs.propertyValue;
      const messRaw = inputs.measureRate;
      const hebeRaw = inputs.hebesatz;

      const valStr = valRaw !== undefined && valRaw !== null ? String(valRaw).trim() : '';
      const messStr = messRaw !== undefined && messRaw !== null ? String(messRaw).trim() : '';
      const hebeStr = hebeRaw !== undefined && hebeRaw !== null ? String(hebeRaw).trim() : '';

      const val = valStr !== '' ? parseFloat(valStr.replace(',', '.')) : 280000;
      const mess = (messStr !== '' ? parseFloat(messStr.replace(',', '.')) : 0.031) / 100;
      const hebe = (hebeStr !== '' ? parseFloat(hebeStr.replace(',', '.')) : 480) / 100;

      if (isNaN(val) || isNaN(mess) || isNaN(hebe) || val < 0 || mess < 0 || hebe < 0) {
        return {
          primary: { id: 'grundsteuerYear', label: 'Jährliche Grundsteuer', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie gültige Werte ein (Grundsteuerwert, Messzahl und Hebesatz dürfen nicht negativ sein).',
        };
      }

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
        summaryText: `Bei einem Grundsteuerwert von ${formatCurrency(val)} und einem Hebesatz von ${formatPercent(hebe * 100, 0)} beträgt die Grundsteuer ${formatCurrency(grundsteuerYear)} im Jahr (${formatCurrency(grundsteuerQuarter)} pro Quartal).`,
        directAnswer: `Bei einem Grundsteuerwert von ${formatCurrency(val)}, Steuermesszahl ${formatPercent(mess * 100, 3)} und Hebesatz ${formatPercent(hebe * 100, 0)} beträgt die jährliche Grundsteuer ${formatCurrency(grundsteuerYear)} (${formatCurrency(grundsteuerQuarter)} pro Quartal).`,
        basisSummary: [
          { label: 'Grundsteuerwert', value: formatCurrency(val) },
          { label: 'Steuermessbetrag', value: formatCurrency(messbetrag) },
          { label: 'Hebesatz', value: formatPercent(hebe * 100, 0) },
        ],
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
      { id: 'salePrice', label: 'Erzielter Verkaufspreis', type: 'number', defaultValue: 420000, min: 0, step: 10000, unit: '€', helpText: 'Tatsächlich erzielter Veräußerungserlös der Immobilie.' },
      { id: 'purchaseCost', label: 'Ursprüngliche Anschaffungs-/Herstellungskosten inkl. Nebenkosten', type: 'number', defaultValue: 310000, min: 0, step: 10000, unit: '€', helpText: 'Ursprünglicher Kaufpreis zuzüglich Anschaffungsnebenkosten und nachträglicher Herstellungskosten.' },
      { id: 'claimedDepreciation', label: 'In Vorjahren steuerlich geltend gemachte AfA', type: 'number', defaultValue: 25000, min: 0, step: 1000, unit: '€', helpText: 'In Vorjahren steuerlich geltend gemachte AfA (0 € falls keine AfA in Anspruch genommen wurde).' },
      { id: 'taxRate', label: 'Persönlicher Grenzsteuersatz', type: 'number', defaultValue: 42, min: 0, max: 45, step: 1, unit: '%', helpText: 'Persönlicher Grenzsteuersatz in Prozent (0 % bei Grundfreibetrag/steuerfreiem Einkommen).' },
    ],
    calculate: (inputs) => {
      const saleRaw = inputs.salePrice;
      const buyRaw = inputs.purchaseCost;
      const afaRaw = inputs.claimedDepreciation;
      const rateRaw = inputs.taxRate;

      const saleStr = saleRaw !== undefined && saleRaw !== null ? String(saleRaw).trim() : '';
      const buyStr = buyRaw !== undefined && buyRaw !== null ? String(buyRaw).trim() : '';
      const afaStr = afaRaw !== undefined && afaRaw !== null ? String(afaRaw).trim() : '';
      const rateStr = rateRaw !== undefined && rateRaw !== null ? String(rateRaw).trim() : '';

      const sale = saleStr !== '' ? parseFloat(saleStr.replace(',', '.')) : 420000;
      const buy = buyStr !== '' ? parseFloat(buyStr.replace(',', '.')) : 310000;
      const afa = afaStr !== '' ? parseFloat(afaStr.replace(',', '.')) : 25000;
      const rate = (rateStr !== '' ? parseFloat(rateStr.replace(',', '.')) : 42) / 100;

      if (isNaN(sale) || isNaN(buy) || isNaN(afa) || isNaN(rate) || sale < 0 || buy < 0 || afa < 0 || rate < 0) {
        return {
          primary: { id: 'taxAmount', label: 'Voraussichtliche Spekulationssteuer', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie gültige Werte ein (Beträge und Steuersatz dürfen nicht negativ sein).',
        };
      }

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
        directAnswer: taxableProfit === 0
          ? `Bei einem Verkaufspreis von ${formatCurrency(sale)} und einem steuerlichen Buchwert von ${formatCurrency(bookValue)} entsteht kein steuerpflichtiger Gewinn. Es fällt keine Spekulationssteuer an.`
          : `Bei ${formatCurrency(sale)} Verkaufspreis und ${formatCurrency(bookValue)} Restbuchwert (Kosten ${formatCurrency(buy)} abzüglich ${formatCurrency(afa)} AfA) beträgt der steuerpflichtige Gewinn ${formatCurrency(taxableProfit)}. Bei ${formatPercent(rate * 100, 0)} Steuersatz fallen ${formatCurrency(taxAmount)} Spekulationssteuer an.`,
        basisSummary: [
          { label: 'Verkaufspreis', value: formatCurrency(sale) },
          { label: 'Anschaffungskosten', value: formatCurrency(buy) },
          { label: 'Geltend gemachte AfA', value: formatCurrency(afa) },
          { label: 'Restbuchwert', value: formatCurrency(bookValue) },
          { label: 'Grenzsteuersatz', value: formatPercent(rate * 100, 0) },
        ],
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
      { id: 'purchasePrice', label: 'Immobilienkaufpreis', type: 'number', defaultValue: 350000, min: 0, step: 10000, unit: '€', helpText: 'Beurkundeter Kaufpreis der Immobilie in Euro.' },
      { id: 'totalBrokerPct', label: 'Gesamtprovision inkl. MwSt. (üblich 7,14 % bzw. 3,57 % je Partei)', type: 'number', defaultValue: 7.14, min: 0, max: 15, step: 0.01, unit: '%', helpText: 'Gesamte Maklerprovision in Prozent (0 % bei provisionsfreiem Kauf).' },
    ],
    calculate: (inputs) => {
      const priceRaw = inputs.purchasePrice;
      const pctRaw = inputs.totalBrokerPct;

      const priceStr = priceRaw !== undefined && priceRaw !== null ? String(priceRaw).trim() : '';
      const pctStr = pctRaw !== undefined && pctRaw !== null ? String(pctRaw).trim() : '';

      const price = priceStr !== '' ? parseFloat(priceStr.replace(',', '.')) : 350000;
      const totalPct = pctStr !== '' ? parseFloat(pctStr.replace(',', '.')) : 7.14;

      if (isNaN(price) || isNaN(totalPct) || price < 0 || totalPct < 0) {
        return {
          primary: { id: 'buyerShare', label: 'Anteil Käufer (inkl. 19 % MwSt.)', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie gültige Werte ein (Kaufpreis und Provision dürfen nicht negativ sein).',
        };
      }

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
        directAnswer: totalCost === 0
          ? `Bei einem Provisionssatz von 0 % fällt keine Maklercourtage an.`
          : `Bei einem Kaufpreis von ${formatCurrency(price)} und ${formatPercent(totalPct, 2)} Gesamtprovision betragen die Maklerkosten für Käufer und Verkäufer jeweils ${formatCurrency(buyerShare)} (Gesamt: ${formatCurrency(totalCost)}).`,
        basisSummary: [
          { label: 'Kaufpreis', value: formatCurrency(price) },
          { label: 'Gesamtprovisionssatz', value: formatPercent(totalPct, 2) },
          { label: 'Halbteilung je Partei', value: formatPercent(totalPct / 2, 2) },
        ],
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
      { id: 'purchasePrice', label: 'Beurkundeter Immobilienkaufpreis', type: 'number', defaultValue: 320000, min: 0, step: 5000, unit: '€', helpText: 'Beurkundeter Kaufpreis der Immobilie in Euro.' },
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
      const priceRaw = inputs.purchasePrice;
      const priceStr = priceRaw !== undefined && priceRaw !== null ? String(priceRaw).trim() : '';
      const price = priceStr !== '' ? parseFloat(priceStr.replace(',', '.')) : 320000;

      if (isNaN(price) || price < 0) {
        return {
          primary: { id: 'tax', label: 'Zu zahlende Grunderwerbsteuer', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie einen gültigen Kaufpreis ein.',
        };
      }

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
        directAnswer: `Bei einem Kaufpreis von ${formatCurrency(price)} beträgt die Grunderwerbsteuer im ausgewählten Bundesland (${formatPercent(rate * 100, 1)}) genau ${formatCurrency(tax)}. Der Gesamtbetrag inklusive Steuer beläuft sich auf ${formatCurrency(price + tax)}.`,
        basisSummary: [
          { label: 'Kaufpreis', value: formatCurrency(price) },
          { label: 'Grunderwerbsteuersatz', value: formatPercent(rate * 100, 1) },
          { label: 'Gesamtsumme inkl. Steuer', value: formatCurrency(price + tax) },
        ],
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
      { id: 'purchasePrice', label: 'Immobilienkaufpreis', type: 'number', defaultValue: 300000, min: 0, step: 10000, unit: '€', helpText: 'Beurkundeter Immobilienkaufpreis in Euro.' },
      { id: 'mortgageAmount', label: 'Eingetragene Grundschuld für Bankdarlehen', type: 'number', defaultValue: 250000, min: 0, step: 10000, unit: '€', helpText: 'Eingetragene Grundschuld in Euro (0 € für Barzahler / Barkauf ohne Darlehensabsicherung).' },
    ],
    calculate: (inputs) => {
      const priceRaw = inputs.purchasePrice;
      const mortgageRaw = inputs.mortgageAmount;

      const priceStr = priceRaw !== undefined && priceRaw !== null ? String(priceRaw).trim() : '';
      const mortgageStr = mortgageRaw !== undefined && mortgageRaw !== null ? String(mortgageRaw).trim() : '';

      const price = priceStr !== '' ? parseFloat(priceStr.replace(',', '.')) : 300000;
      const mortgage = mortgageStr !== '' ? parseFloat(mortgageStr.replace(',', '.')) : 250000;

      if (isNaN(price) || isNaN(mortgage) || price < 0 || mortgage < 0) {
        return {
          primary: { id: 'totalCost', label: 'Gesamte Notar- & Grundbuchkosten', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie gültige Beträge ein (Kaufpreis und Grundschuld dürfen nicht negativ sein).',
        };
      }

      // Notargebühren Kaufvertrag ca. 1,0 % - 1,2 %
      const notaryDeed = price * 0.0105;
      // Grundbuchgebühren Kauf (Auflassung + Eigentumsumschreibung) ca. 0,5 %
      const landRegistryDeed = price * 0.0045;
      // Grundschuldbestellung Notar + Grundbuch ca. 0,4 % der Grundschuld
      const mortgageCost = mortgage * 0.004;
      const totalCost = notaryDeed + landRegistryDeed + mortgageCost;
      const pctOfPrice = price > 0 ? (totalCost / price) * 100 : 0;
      return {
        primary: { id: 'totalCost', label: 'Gesamte Notar- & Grundbuchkosten', value: totalCost, formattedValue: formatCurrency(totalCost), highlight: true },
        secondary: [
          { id: 'notaryShare', label: 'Notargebühren (Beurkundung & Betreuung)', value: notaryDeed + (mortgageCost * 0.6), formattedValue: formatCurrency(notaryDeed + (mortgageCost * 0.6)) },
          { id: 'registryShare', label: 'Grundbuchamtsgebühren (Eigentum & Grundschuld)', value: landRegistryDeed + (mortgageCost * 0.4), formattedValue: formatCurrency(landRegistryDeed + (mortgageCost * 0.4)) },
          { id: 'pctOfPrice', label: 'Anteil am Kaufpreis', value: pctOfPrice, formattedValue: formatPercent(pctOfPrice, 2) },
        ],
        summaryText: `Für Notar und Grundbuchamt fallen ca. ${formatCurrency(totalCost)} an (ca. ${formatPercent(pctOfPrice, 2)} des Kaufpreises).`,
        directAnswer: mortgage === 0
          ? `Bei einem Kaufpreis von ${formatCurrency(price)} ohne Grundschuldeintragung (Barkauf) fallen für Notar und Grundbuch ca. ${formatCurrency(totalCost)} an (ca. ${formatPercent(pctOfPrice, 2)} des Kaufpreises).`
          : `Bei einem Kaufpreis von ${formatCurrency(price)} und ${formatCurrency(mortgage)} Grundschuld fallen für Notar und Grundbuch ca. ${formatCurrency(totalCost)} an (${formatCurrency(notaryDeed + (mortgageCost * 0.6))} Notar, ${formatCurrency(landRegistryDeed + (mortgageCost * 0.4))} Grundbuch).`,
        basisSummary: [
          { label: 'Kaufpreis', value: formatCurrency(price) },
          { label: 'Eingetragene Grundschuld', value: formatCurrency(mortgage) },
          { label: 'Anteil am Kaufpreis', value: formatPercent(pctOfPrice, 2) },
        ],
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
      { id: 'livingArea', label: 'Wohnfläche in m²', type: 'number', defaultValue: 90, min: 0, max: 1000, step: 5, unit: 'm²', helpText: 'Wohnfläche des Objekts in m².' },
      { id: 'reconstructionCost', label: 'Herstellungskosten pro m² Wohnfläche', type: 'number', defaultValue: 2400, min: 0, max: 10000, step: 100, unit: '€/m²', helpText: 'Geschätzte Neubau- bzw. Erstellungskosten pro m².' },
      { id: 'buildingAgeYears', label: 'Alter der Immobilie (Jahre)', type: 'number', defaultValue: 25, min: 0, max: 150, step: 5, unit: 'Jahre', helpText: 'Gebäudealter in Jahren seit Fertigstellung.' },
    ],
    calculate: (inputs) => {
      const areaRaw = inputs.livingArea;
      const costRaw = inputs.reconstructionCost;
      const ageRaw = inputs.buildingAgeYears;

      const areaStr = areaRaw !== undefined && areaRaw !== null ? String(areaRaw).trim() : '';
      const costStr = costRaw !== undefined && costRaw !== null ? String(costRaw).trim() : '';
      const ageStr = ageRaw !== undefined && ageRaw !== null ? String(ageRaw).trim() : '';

      const area = areaStr !== '' ? parseFloat(areaStr.replace(',', '.')) : 90;
      const cost = costStr !== '' ? parseFloat(costStr.replace(',', '.')) : 2400;
      const age = ageStr !== '' ? parseInt(ageStr, 10) : 25;

      if (isNaN(area) || isNaN(cost) || isNaN(age) || area < 0 || cost < 0 || age < 0) {
        return {
          primary: { id: 'yearlyTotal', label: 'Empfohlene Rücklage pro Jahr', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie gültige Werte ein (Wohnfläche, Kosten und Alter dürfen nicht negativ sein).',
        };
      }

      // Peterssche Formel: Innerhalb von 80 Jahren fallen das 1,5-fache der Herstellungskosten für Instandhaltung an.
      // Davon entfallen ca. 70 % auf das Gemeinschaftseigentum.
      // Jährlich = (Herstellungskosten × 1,5 × 0,7) / 80 Jahre
      const yearlyPerSqm = (cost * 1.5 * 0.70) / 80;
      const yearlyTotal = yearlyPerSqm * area;
      const monthlyTotal = yearlyTotal / 12;
      const monthlyPerSqm = area > 0 ? monthlyTotal / area : 0;
      return {
        primary: { id: 'yearlyTotal', label: 'Empfohlene Rücklage pro Jahr', value: yearlyTotal, formattedValue: formatCurrency(yearlyTotal), highlight: true },
        secondary: [
          { id: 'monthlyTotal', label: 'Monatliche Rücklage', value: monthlyTotal, formattedValue: formatCurrency(monthlyTotal) },
          { id: 'monthlyPerSqm', label: 'Monatlich pro m² Wohnfläche', value: monthlyPerSqm, formattedValue: `${formatNumber(monthlyPerSqm, 2)} €/m²` },
          { id: 'yearlyPerSqm', label: 'Jährlich pro m²', value: yearlyPerSqm, formattedValue: `${formatNumber(yearlyPerSqm, 2)} €/m²` },
        ],
        summaryText: `Nach der Petersschen Formel sollten Sie für ${area} m² monatlich ${formatCurrency(monthlyTotal)} (${formatNumber(monthlyPerSqm, 2)} €/m²) als Instandhaltungsrücklage ansparen.`,
        directAnswer: `Für ein ${age} Jahre altes Objekt mit ${area} m² und ${formatCurrency(cost)}/m² Herstellungskosten empfiehlt die Peterssche Formel eine Rücklage von ${formatCurrency(yearlyTotal)} pro Jahr (${formatCurrency(monthlyTotal)} monatlich bzw. ${formatNumber(monthlyPerSqm, 2)} €/m²).`,
        basisSummary: [
          { label: 'Wohnfläche', value: `${area} m²` },
          { label: 'Herstellungskosten/m²', value: formatCurrency(cost) },
          { label: 'Jährliche Rate pro m²', value: `${formatNumber(yearlyPerSqm, 2)} €/m²` },
        ],
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
      { id: 'modernizationCosts', label: 'Gesamte Modernisierungskosten der Wohnung', type: 'number', defaultValue: 25000, min: 0, step: 500, unit: '€', helpText: 'Gesamtaufwand der Modernisierungsmaßnahme in Euro.' },
      { id: 'maintenanceShare', label: 'Darin enthaltener ersparter Erhaltungsaufwand (Instandhaltung)', type: 'number', defaultValue: 6000, min: 0, step: 500, unit: '€', helpText: 'Ersparter Erhaltungsaufwand in Euro (0 € bei reiner Modernisierungsmaßnahme ohne Instandhaltungsanteil).' },
      { id: 'livingArea', label: 'Wohnfläche der Wohnung in m²', type: 'number', defaultValue: 75, min: 1, step: 5, unit: 'm²', helpText: 'Wohnfläche der betroffenen Mietwohnung.' },
      { id: 'currentRentSqm', label: 'Bisherige Miete pro m²', type: 'number', defaultValue: 8.50, min: 0, max: 50, step: 0.5, unit: '€/m²', helpText: 'Bisherige Nettokaltmiete pro Quadratmeter.' },
    ],
    calculate: (inputs) => {
      const grossRaw = inputs.modernizationCosts;
      const maintRaw = inputs.maintenanceShare;
      const areaRaw = inputs.livingArea;
      const rentSqmRaw = inputs.currentRentSqm;

      const grossStr = grossRaw !== undefined && grossRaw !== null ? String(grossRaw).trim() : '';
      const maintStr = maintRaw !== undefined && maintRaw !== null ? String(maintRaw).trim() : '';
      const areaStr = areaRaw !== undefined && areaRaw !== null ? String(areaRaw).trim() : '';
      const rentSqmStr = rentSqmRaw !== undefined && rentSqmRaw !== null ? String(rentSqmRaw).trim() : '';

      const grossCost = grossStr !== '' ? parseFloat(grossStr.replace(',', '.')) : 25000;
      const maint = maintStr !== '' ? parseFloat(maintStr.replace(',', '.')) : 6000;
      const area = areaStr !== '' ? parseFloat(areaStr.replace(',', '.')) : 75;
      const currentRentSqm = rentSqmStr !== '' ? parseFloat(rentSqmStr.replace(',', '.')) : 8.50;

      if (isNaN(grossCost) || isNaN(maint) || isNaN(area) || isNaN(currentRentSqm) || grossCost < 0 || maint < 0 || area <= 0 || currentRentSqm < 0) {
        return {
          primary: { id: 'actualMonthlyIncrease', label: 'Zulässige monatliche Mieterhöhung', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie gültige Werte ein (Wohnfläche muss größer als 0 sein).',
        };
      }

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
        directAnswer: `Von ${formatCurrency(grossCost)} Modernisierungskosten sind nach Abzug von ${formatCurrency(maint)} Erhaltungsaufwand netto ${formatCurrency(eligibleCosts)} umlagefähig. Die zulässige Mieterhöhung beträgt ${formatCurrency(actualMonthlyIncrease)} monatlich (${formatNumber(actualIncreasePerSqm, 2)} €/m², Kappung: max. ${formatNumber(maxCapPerSqm, 2)} €/m²).`,
        basisSummary: [
          { label: 'Gesamtkosten', value: formatCurrency(grossCost) },
          { label: 'Instandhaltungsanteil', value: formatCurrency(maint) },
          { label: 'Umlagefähige Kosten', value: formatCurrency(eligibleCosts) },
          { label: 'Kappungsgrenze', value: `${formatNumber(maxCapPerSqm, 2)} €/m²` },
        ],
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
      { id: 'depositAmount', label: 'Eingezahlte Mietkaution (max. 3 Kaltmieten)', type: 'number', defaultValue: 1800, min: 0, step: 50, unit: '€', helpText: 'Ursprünglich geleisteter Kautionsbetrag in Euro.' },
      { id: 'rentalYears', label: 'Mietdauer in Jahren', type: 'number', defaultValue: 6, min: 0, max: 60, step: 1, unit: 'Jahre', helpText: 'Dauer des Mietverhältnisses in vollen oder angebrochenen Jahren.' },
      { id: 'avgInterestRate', label: 'Durchschnittlicher Sparzins p.a.', type: 'number', defaultValue: 1.2, min: 0, max: 15, step: 0.1, unit: '%', helpText: 'Durchschnittlicher Sparzins p.a. (0 % bei Nullzinsphasen).' },
    ],
    calculate: (inputs) => {
      const depRaw = inputs.depositAmount;
      const yearsRaw = inputs.rentalYears;
      const rateRaw = inputs.avgInterestRate;

      const depStr = depRaw !== undefined && depRaw !== null ? String(depRaw).trim() : '';
      const yearsStr = yearsRaw !== undefined && yearsRaw !== null ? String(yearsRaw).trim() : '';
      const rateStr = rateRaw !== undefined && rateRaw !== null ? String(rateRaw).trim() : '';

      const dep = depStr !== '' ? parseFloat(depStr.replace(',', '.')) : 1800;
      const years = yearsStr !== '' ? parseInt(yearsStr, 10) : 6;
      const rate = (rateStr !== '' ? parseFloat(rateStr.replace(',', '.')) : 1.2) / 100;

      if (isNaN(dep) || isNaN(years) || isNaN(rate) || dep < 0 || years < 0 || rate < 0) {
        return {
          primary: { id: 'totalAmount', label: 'Gesamtrückzahlung bei Auszug', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie gültige Werte ein (Kaution, Laufzeit und Zinssatz dürfen nicht negativ sein).',
        };
      }

      const totalAmount = dep * Math.pow(1 + rate, years);
      const totalInterest = totalAmount - dep;
      return {
        primary: { id: 'totalAmount', label: 'Gesamtrückzahlung bei Auszug', value: totalAmount, formattedValue: formatCurrency(totalAmount), highlight: true },
        secondary: [
          { id: 'totalInterest', label: 'Erwirtschafteter Zinseszins', value: totalInterest, formattedValue: formatCurrency(totalInterest) },
          { id: 'depInitial', label: 'Ursprüngliche Kaution', value: dep, formattedValue: formatCurrency(dep) },
        ],
        summaryText: `Nach ${years} Jahren Mietzeit erhalten Sie Ihre Kaution von ${formatCurrency(dep)} plus ${formatCurrency(totalInterest)} Zinsen zurück (Summe: ${formatCurrency(totalAmount)}).`,
        directAnswer: totalInterest === 0
          ? `Bei ${years} Jahren Mietzeit und 0,00 % Zinsen beläuft sich der Auszahlungsbetrag unverändert auf ${formatCurrency(dep)}.`
          : `Nach ${years} Jahren Mietzeit zu durchschnittlich ${formatPercent(rate * 100, 2)} Zinsen beträgt der Kautionsanspruch ${formatCurrency(totalAmount)} (ursprüngliche Kaution ${formatCurrency(dep)} zzgl. ${formatCurrency(totalInterest)} Zinseszins).`,
        basisSummary: [
          { label: 'Eingezahlte Kaution', value: formatCurrency(dep) },
          { label: 'Mietdauer', value: `${years} Jahre` },
          { label: 'Zinssatz p.a.', value: formatPercent(rate * 100, 2) },
        ],
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
      { id: 'livingArea', label: 'Wohnungsgröße in m²', type: 'number', defaultValue: 80, min: 0, max: 400, step: 5, unit: 'm²', helpText: 'Wohnfläche der Eigentumswohnung in m².' },
      { id: 'avgHausgeldPerSqm', label: 'Durchschnittliches Hausgeld pro m² (üblich 3,50 € - 5,50 €)', type: 'number', defaultValue: 4.20, min: 0, max: 15, step: 0.1, unit: '€/m²', helpText: 'Gesamthausgeld je m² Wohnfläche laut Wirtschaftsplan.' },
      { id: 'apportionablePct', label: 'Auf Mieter umlagefähiger Anteil (Heizung, Müll etc.)', type: 'number', defaultValue: 65, min: 0, max: 100, step: 5, unit: '%', helpText: 'Auf Mieter umlagefähiger Anteil in Prozent (0 % bei reinen Eigentümerkosten oder Leerstand).' },
    ],
    calculate: (inputs) => {
      const areaRaw = inputs.livingArea;
      const rateRaw = inputs.avgHausgeldPerSqm;
      const appPctRaw = inputs.apportionablePct;

      const areaStr = areaRaw !== undefined && areaRaw !== null ? String(areaRaw).trim() : '';
      const rateStr = rateRaw !== undefined && rateRaw !== null ? String(rateRaw).trim() : '';
      const appPctStr = appPctRaw !== undefined && appPctRaw !== null ? String(appPctRaw).trim() : '';

      const area = areaStr !== '' ? parseFloat(areaStr.replace(',', '.')) : 80;
      const rate = rateStr !== '' ? parseFloat(rateStr.replace(',', '.')) : 4.20;
      const appPct = (appPctStr !== '' ? parseFloat(appPctStr.replace(',', '.')) : 65) / 100;

      if (isNaN(area) || isNaN(rate) || isNaN(appPct) || area < 0 || rate < 0 || appPct < 0) {
        return {
          primary: { id: 'totalMonthly', label: 'Monatliches Gesamthausgeld', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie gültige Werte ein (Werte dürfen nicht negativ sein).',
        };
      }

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
        directAnswer: `Bei ${area} m² Wohnfläche und ${formatCurrency(rate)}/m² Hausgeld beträgt die monatliche Vorauszahlung ${formatCurrency(totalMonthly)} (${formatCurrency(totalMonthly * 12)} p.a.). Davon sind ${formatCurrency(apportionable)} (${formatPercent(appPct * 100, 0)}) auf den Mieter umlagefähig und ${formatCurrency(ownerShare)} vom Eigentümer zu tragen.`,
        basisSummary: [
          { label: 'Wohnfläche', value: `${area} m²` },
          { label: 'Hausgeld-Satz', value: `${formatCurrency(rate)}/m²` },
          { label: 'Umlagefähiger Anteil', value: formatPercent(appPct * 100, 0) },
        ],
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
      { id: 'totalCost', label: 'Gesamtkaufpreis inkl. Erwerbsnebenkosten', type: 'number', defaultValue: 380000, min: 0, step: 10000, unit: '€', helpText: 'Kaufpreis zuzüglich aller Anschaffungsnebenkosten in Euro.' },
      { id: 'landSharePct', label: 'Grundstücksanteil (nicht abschreibbar, üblich 20 % - 30 %)', type: 'number', defaultValue: 25, min: 0, max: 80, step: 1, unit: '%', helpText: 'Grundstücksanteil in % (0 % bei Erbbaurecht / reinem Gebäudekauf).' },
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
      { id: 'taxRate', label: 'Persönlicher Grenzsteuersatz', type: 'number', defaultValue: 42, min: 0, max: 45, step: 1, unit: '%', helpText: 'Persönlicher Grenzsteuersatz in % (0 % bei steuerfreiem Einkommen).' },
    ],
    calculate: (inputs) => {
      const totalRaw = inputs.totalCost;
      const landRaw = inputs.landSharePct;
      const taxRateRaw = inputs.taxRate;

      const totalStr = totalRaw !== undefined && totalRaw !== null ? String(totalRaw).trim() : '';
      const landStr = landRaw !== undefined && landRaw !== null ? String(landRaw).trim() : '';
      const taxRateStr = taxRateRaw !== undefined && taxRateRaw !== null ? String(taxRateRaw).trim() : '';

      const total = totalStr !== '' ? parseFloat(totalStr.replace(',', '.')) : 380000;
      const landPct = (landStr !== '' ? parseFloat(landStr.replace(',', '.')) : 25) / 100;
      const taxRate = (taxRateStr !== '' ? parseFloat(taxRateStr.replace(',', '.')) : 42) / 100;

      if (isNaN(total) || isNaN(landPct) || isNaN(taxRate) || total < 0 || landPct < 0 || landPct > 1 || taxRate < 0) {
        return {
          primary: { id: 'yearlyTaxSaving', label: 'Jährliche Steuerersparnis durch AfA', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie gültige Werte ein (Grundstücksanteil darf maximal 100 % betragen).',
        };
      }

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
        directAnswer: `Bei einem Gesamtkaufpreis von ${formatCurrency(total)} und ${formatPercent(landPct * 100, 0)} Grundstücksanteil beträgt der abschreibbare Gebäudewert ${formatCurrency(buildingValue)}. Bei ${formatPercent(rate * 100, 1)} AfA und ${formatPercent(taxRate * 100, 0)} Grenzsteuersatz ergibt sich eine jährliche Steuerersparnis von ca. ${formatCurrency(yearlyTaxSaving)} (${formatCurrency(yearlyAfa)} AfA pro Jahr).`,
        basisSummary: [
          { label: 'Gesamtkaufpreis', value: formatCurrency(total) },
          { label: 'Grundstücksanteil', value: formatPercent(landPct * 100, 0) },
          { label: 'Gebäudeanteil', value: formatCurrency(buildingValue) },
          { label: 'AfA-Satz p.a.', value: formatPercent(rate * 100, 1) },
          { label: 'Grenzsteuersatz', value: formatPercent(taxRate * 100, 0) },
        ],
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
    metaTitle: 'Mietrendite Rechner – Brutto- und Nettorendite berechnen',
    metaDescription: 'Ermitteln Sie die Rentabilität einer Anlageimmobilie: Bruttomietrendite und exakte Nettomietrendite unter Einbezug aller Nebenkosten und Rücklagen.',
    h1: 'Mietrendite Rechner – Brutto- und Nettorendite für Vermieter',
    shortDescription: 'Vergleicht Brutto- und Nettomietrendite zur objektiven Bewertung von Kapitalanlage-Immobilien mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['mietrendite rechner', 'bruttomietrendite formel', 'nettomietrendite berechnen', 'immobilie rendite kapitalanlage'],
    inputs: [
      { id: 'purchasePrice', label: 'Immobilienkaufpreis', type: 'number', defaultValue: 250000, min: 0, step: 5000, unit: '€', helpText: 'Reiner Immobilienkaufpreis ohne Erwerbsnebenkosten.' },
      { id: 'closingCosts', label: 'Kaufnebenkosten (Grunderwerbsteuer, Notar, Makler)', type: 'number', defaultValue: 25000, min: 0, step: 1000, unit: '€', helpText: 'Kaufnebenkosten in Euro (0 € bei provisions- und gebührenfreiem Erwerb).' },
      { id: 'monthlyColdRent', label: 'Monatliche Kaltmiete', type: 'number', defaultValue: 950, min: 0, step: 25, unit: '€', helpText: 'Monatlich erzielbare Nettokaltmiete.' },
      { id: 'yearlyNonApportionable', label: 'Jährliche nicht umlegbare Kosten (Verwaltung & Rücklage)', type: 'number', defaultValue: 1400, min: 0, step: 100, unit: '€', helpText: 'Nicht umlagefähige Kosten pro Jahr in Euro (0 € falls keine Verwaltung/Rücklage).' },
    ],
    calculate: (inputs) => {
      const priceRaw = inputs.purchasePrice;
      const closingRaw = inputs.closingCosts;
      const rentRaw = inputs.monthlyColdRent;
      const nonAppRaw = inputs.yearlyNonApportionable;

      const priceStr = priceRaw !== undefined && priceRaw !== null ? String(priceRaw).trim() : '';
      const closingStr = closingRaw !== undefined && closingRaw !== null ? String(closingRaw).trim() : '';
      const rentStr = rentRaw !== undefined && rentRaw !== null ? String(rentRaw).trim() : '';
      const nonAppStr = nonAppRaw !== undefined && nonAppRaw !== null ? String(nonAppRaw).trim() : '';

      const price = priceStr !== '' ? parseFloat(priceStr.replace(',', '.')) : 250000;
      const closing = closingStr !== '' ? parseFloat(closingStr.replace(',', '.')) : 25000;
      const rent = rentStr !== '' ? parseFloat(rentStr.replace(',', '.')) : 950;
      const nonApp = nonAppStr !== '' ? parseFloat(nonAppStr.replace(',', '.')) : 1400;

      if (isNaN(price) || isNaN(closing) || isNaN(rent) || isNaN(nonApp) || price < 0 || closing < 0 || rent < 0 || nonApp < 0) {
        return {
          primary: { id: 'netYield', label: 'Nettomietrendite', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie gültige Werte ein (Beträge dürfen nicht negativ sein).',
        };
      }

      const totalInvestment = price + closing;
      const yearlyGrossRent = rent * 12;
      const yearlyNetRent = yearlyGrossRent - nonApp;
      const grossYield = price > 0 ? (yearlyGrossRent / price) * 100 : 0;
      const netYield = totalInvestment > 0 ? (yearlyNetRent / totalInvestment) * 100 : 0;
      const multiplier = yearlyGrossRent > 0 ? price / yearlyGrossRent : 0;
      return {
        primary: { id: 'netYield', label: 'Nettomietrendite', value: netYield, formattedValue: formatPercent(netYield, 2), highlight: true },
        secondary: [
          { id: 'grossYield', label: 'Bruttomietrendite', value: grossYield, formattedValue: formatPercent(grossYield, 2) },
          { id: 'multiplier', label: 'Kaufpreisfaktor (Vervielfältiger)', value: multiplier, formattedValue: multiplier > 0 ? `${formatNumber(multiplier, 1)}x` : '–' },
          { id: 'yearlyNetRent', label: 'Netto-Mieteinnahmen pro Jahr', value: yearlyNetRent, formattedValue: formatCurrency(yearlyNetRent) },
        ],
        summaryText: `Die Immobilie erzielt eine Bruttomietrendite von ${formatPercent(grossYield, 2)} und eine realistische Nettomietrendite von ${formatPercent(netYield, 2)} nach allen Nebenkosten.`,
        directAnswer: `Bei ${formatCurrency(price)} Kaufpreis und ${formatCurrency(closing)} Nebenkosten beträgt die Gesamtinvestition ${formatCurrency(totalInvestment)}. Bei ${formatCurrency(rent)} Monatsmiete beläuft sich die Bruttomietrendite auf ${formatPercent(grossYield, 2)} und die Nettomietrendite (nach ${formatCurrency(nonApp)} nicht umlagefähigen Kosten) auf ${formatPercent(netYield, 2)}.`,
        basisSummary: [
          { label: 'Gesamtinvestition', value: formatCurrency(totalInvestment) },
          { label: 'Jahreskaltmiete', value: formatCurrency(yearlyGrossRent) },
          { label: 'Reinertrag netto', value: formatCurrency(yearlyNetRent) },
          { label: 'Bruttomietrendite', value: formatPercent(grossYield, 2) },
        ],
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
      { id: 'remainingDebt', label: 'Aktuelle Restschuld des Darlehens', type: 'number', defaultValue: 180000, min: 0, step: 5000, unit: '€', helpText: 'Noch offene Darlehens-Restschuld zum Kündigungstermin.' },
      { id: 'contractRate', label: 'Vereinbarter Darlehenszins p.a.', type: 'number', defaultValue: 4.2, min: 0, step: 0.1, unit: '%', helpText: 'Im Darlehensvertrag fest vereinbarter Sollzins.' },
      { id: 'reinvestmentRate', label: 'Aktuelle Wiederanlage-Rendite (z. B. Bundesanleihen)', type: 'number', defaultValue: 2.4, min: 0, step: 0.1, unit: '%', helpText: 'Aktuelle Wiederanlage-Rendite (0 % bei Null- oder Negativzinsphasen).' },
      { id: 'remainingYears', label: 'Restliche Zinsbindungszeit in Jahren (max. 10 Jahre)', type: 'number', defaultValue: 4, min: 0, max: 10, step: 0.5, unit: 'Jahre', helpText: 'Verbleibende Jahre bis zum Ende der Zinsbindung (höchstens 10 Jahre nach § 489 BGB).' },
    ],
    calculate: (inputs) => {
      const debtRaw = inputs.remainingDebt;
      const contractRaw = inputs.contractRate;
      const reinvestRaw = inputs.reinvestmentRate;
      const yearsRaw = inputs.remainingYears;

      const debtStr = debtRaw !== undefined && debtRaw !== null ? String(debtRaw).trim() : '';
      const contractStr = contractRaw !== undefined && contractRaw !== null ? String(contractRaw).trim() : '';
      const reinvestStr = reinvestRaw !== undefined && reinvestRaw !== null ? String(reinvestRaw).trim() : '';
      const yearsStr = yearsRaw !== undefined && yearsRaw !== null ? String(yearsRaw).trim() : '';

      const debt = debtStr !== '' ? parseFloat(debtStr.replace(',', '.')) : 180000;
      const contract = contractStr !== '' ? parseFloat(contractStr.replace(',', '.')) : 4.2;
      const reinvest = reinvestStr !== '' ? parseFloat(reinvestStr.replace(',', '.')) : 2.4;
      const years = yearsStr !== '' ? parseFloat(yearsStr.replace(',', '.')) : 4;

      if (isNaN(debt) || isNaN(contract) || isNaN(reinvest) || isNaN(years) || debt < 0 || contract < 0 || reinvest < 0 || years < 0) {
        return {
          primary: { id: 'compensation', label: 'Geschätzte Vorfälligkeitsentschädigung', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie gültige Werte ein (Werte dürfen nicht negativ sein).',
        };
      }

      const interestDiff = Math.max(0, contract - reinvest);
      // Zinsverschlechterungsschaden grob geschätzt (unter Berücksichtigung ersparter Risiko- und Verwaltungskosten ca. 0,15 %)
      const netDiff = Math.max(0, interestDiff - 0.15);
      const compensation = debt * (netDiff / 100) * years * 0.90; // Barwert-Abzinsung ca. 90%
      const pctOfDebt = debt > 0 ? (compensation / debt) * 100 : 0;
      return {
        primary: { id: 'compensation', label: 'Geschätzte Vorfälligkeitsentschädigung', value: compensation, formattedValue: formatCurrency(compensation), highlight: true },
        secondary: [
          { id: 'interestDiff', label: 'Zinsdifferenz p.a.', value: interestDiff, formattedValue: formatPercent(interestDiff, 2) },
          { id: 'pctOfDebt', label: 'Anteil an der Restschuld', value: pctOfDebt, formattedValue: formatPercent(pctOfDebt, 2) },
        ],
        summaryText: `Bei einer Zinsdifferenz von ${formatPercent(interestDiff, 2)} und ${years} Jahren Restlaufzeit verlangt die Bank voraussichtlich ca. ${formatCurrency(compensation)} Entschädigung.`,
        directAnswer: compensation === 0
          ? `Bei einer Zinsdifferenz von 0,00 % (oder Marktzins über Vertragszins) entsteht der Bank kein Zinsschaden. Es fällt voraussichtlich keine Vorfälligkeitsentschädigung an.`
          : `Bei ${formatCurrency(debt)} Restschuld, ${formatPercent(interestDiff, 2)} Zinsdifferenz und ${years} Jahren Restzinsbindung beträgt die geschätzte Bankentschädigung ca. ${formatCurrency(compensation)} (${formatPercent(pctOfDebt, 2)} der Restschuld).`,
        basisSummary: [
          { label: 'Restschuld', value: formatCurrency(debt) },
          { label: 'Vertragszins vs. Wiederanlage', value: `${formatPercent(contract, 2)} vs. ${formatPercent(reinvest, 2)}` },
          { label: 'Restzinsbindung', value: `${years} Jahre` },
        ],
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
      { id: 'originalPrice', label: 'Neupreis der Einbauküche / Möbel (Rechnung)', type: 'number', defaultValue: 6000, min: 0, step: 100, unit: '€', helpText: 'Ursprünglicher Anschaffungspreis laut Beleg in Euro.' },
      { id: 'ageYears', label: 'Alter in Jahren', type: 'number', defaultValue: 4, min: 0, max: 40, step: 0.5, unit: 'Jahre', helpText: 'Alter in Jahren (0 Jahre bei sofort übernommener Neuausstattung).' },
      { id: 'totalLifespan', label: 'Angenommene Gesamtnutzungsdauer (Küche üblich 15-20 Jahre)', type: 'number', defaultValue: 15, min: 1, max: 40, step: 1, unit: 'Jahre', helpText: 'Angenommene wirtschaftliche Nutzungsdauer laut AfA-Tabelle.' },
    ],
    calculate: (inputs) => {
      const origRaw = inputs.originalPrice;
      const ageRaw = inputs.ageYears;
      const lifeRaw = inputs.totalLifespan;

      const origStr = origRaw !== undefined && origRaw !== null ? String(origRaw).trim() : '';
      const ageStr = ageRaw !== undefined && ageRaw !== null ? String(ageRaw).trim() : '';
      const lifeStr = lifeRaw !== undefined && lifeRaw !== null ? String(lifeRaw).trim() : '';

      const orig = origStr !== '' ? parseFloat(origStr.replace(',', '.')) : 6000;
      const age = ageStr !== '' ? parseFloat(ageStr.replace(',', '.')) : 4;
      const life = lifeStr !== '' ? parseFloat(lifeStr.replace(',', '.')) : 15;

      if (isNaN(orig) || isNaN(age) || isNaN(life) || orig < 0 || age < 0 || life <= 0) {
        return {
          primary: { id: 'zeitwert', label: 'Empfohlener Zeitwert (Faire Abstandszahlung)', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie gültige Werte ein (Nutzungsdauer muss größer als 0 sein).',
        };
      }

      // Nach gängiger Rechtsprechung: Im ersten Jahr Wertverlust ca. 24 %, danach lineare Abschreibung des Restwerts
      let zeitwert = 0;
      if (age === 0) {
        zeitwert = orig;
      } else if (age <= 1) {
        zeitwert = orig * (1 - (age * 0.24));
      } else {
        const valAfterYear1 = orig * 0.76;
        const remainingYears = Math.max(1, life - 1);
        const yearlyDep = valAfterYear1 / remainingYears;
        zeitwert = Math.max(0, valAfterYear1 - ((age - 1) * yearlyDep));
      }

      const depTotal = orig - zeitwert;
      const pctRemaining = orig > 0 ? (zeitwert / orig) * 100 : 0;
      return {
        primary: { id: 'zeitwert', label: 'Empfohlener Zeitwert (Faire Abstandszahlung)', value: zeitwert, formattedValue: formatCurrency(zeitwert), highlight: true },
        secondary: [
          { id: 'depreciationTotal', label: 'Bisheriger Wertverlust', value: depTotal, formattedValue: formatCurrency(depTotal) },
          { id: 'pctRemaining', label: 'Verbleibender Restwert', value: pctRemaining, formattedValue: formatPercent(pctRemaining, 1) },
        ],
        summaryText: `Nach ${age} Jahren beträgt der faire Zeitwert der ursprünglich ${formatCurrency(orig)} teuren Anschaffung noch ${formatCurrency(zeitwert)} (${formatPercent(pctRemaining, 1)} des Neupreises).`,
        directAnswer: `Bei einem Neupreis von ${formatCurrency(orig)} und einer Gesamtnutzungsdauer von ${life} Jahren beläuft sich der faire Zeitwert nach ${age} Jahren auf ${formatCurrency(zeitwert)} (Wertverlust: ${formatCurrency(depTotal)} bzw. ${formatPercent(100 - pctRemaining, 1)}).`,
        basisSummary: [
          { label: 'Neupreis', value: formatCurrency(orig) },
          { label: 'Alter des Objekts', value: `${age} Jahre` },
          { label: 'Nutzungsdauer', value: `${life} Jahre` },
          { label: 'Restwertanteil', value: formatPercent(pctRemaining, 1) },
        ],
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
    relatedSlugs: ['mietkaution-zinsen-rechner', 'warmmiete-rechner', 'mietbelastungsquote-rechner'],
  },

  {
    id: 'warmmiete-rechner',
    slug: 'warmmiete-rechner',
    name: 'Warmmiete-Rechner (Warmmiete berechnen)',
    shortName: 'Warmmiete berechnen',
    category: 'wohnen-immobilien',
    subcategory: 'Miete & Mietrecht',
    metaTitle: 'Warmmiete berechnen: Kaltmiete, Nebenkosten & Heizung',
    metaDescription: 'Warmmiete berechnen: Ermitteln Sie die monatliche und jährliche Warmmiete aus Kaltmiete, kalten Nebenkosten und Heizkosten mit Formel & Aufschlüsselung.',
    h1: 'Warmmiete berechnen',
    shortDescription: 'Berechnet die monatliche und jährliche Warmmiete aus Kaltmiete, kalten Betriebskosten und Heizkosten transparent nach der Betriebskostenverordnung.',
    searchKeywords: [
      'warmmiete berechnen',
      'warmmiete rechner',
      'warmmiete formel',
      'kaltmiete in warmmiete umrechnen',
      'nebenkosten warmmiete berechnen',
      'bruttowarmmiete rechner',
      'kaltmiete betriebskosten heizkosten',
    ],
    inputs: [
      {
        id: 'calculationMode',
        label: 'Berechnungsrichtung',
        type: 'select',
        defaultValue: 'warm_from_components',
        options: [
          { value: 'warm_from_components', label: 'Modus 1: Warmmiete berechnen (Kaltmiete + Nebenkosten + Heizung)' },
          { value: 'cold_from_warm', label: 'Modus 2: Kaltmiete aus Warmmiete aufschlüsseln (nach Betriebskostenspiegel)' },
        ],
      },
      // Modus 1 Inputs
      {
        id: 'coldRentInput',
        label: 'Kaltmiete pro Monat',
        type: 'number',
        defaultValue: 750,
        min: 0,
        max: 50000,
        step: 25,
        unit: '€',
        helpText: 'Vereinbarte Nettokaltmiete für die Wohnraumnutzung ohne Nebenkosten.',
        dependsOn: { field: 'calculationMode', value: 'warm_from_components' },
      },
      {
        id: 'operatingCosts',
        label: 'Betriebskosten / kalte Nebenkosten pro Monat',
        type: 'number',
        defaultValue: 150,
        min: 0,
        max: 10000,
        step: 10,
        unit: '€',
        helpText: 'Müllabfuhr, Grundsteuer, Hausmeister, Sachversicherungen, Wasser/Abwasser etc.',
        dependsOn: { field: 'calculationMode', value: 'warm_from_components' },
      },
      {
        id: 'heatingCosts',
        label: 'Heizkosten pro Monat',
        type: 'number',
        defaultValue: 120,
        min: 0,
        max: 10000,
        step: 10,
        unit: '€',
        helpText: 'Monatliche Vorauszahlung für Heizung und zentrale Warmwasserbereitung.',
        dependsOn: { field: 'calculationMode', value: 'warm_from_components' },
      },
      {
        id: 'otherOperatingCosts',
        label: 'Sonstige umlagefähige Kosten (optional)',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 5000,
        step: 5,
        unit: '€',
        helpText: 'Zusätzliche umlagefähige Betriebskosten nach § 2 Nr. 17 BetrKV (z. B. Gartenpflege, Fahrstuhl, Treppenhausreinigung).',
        dependsOn: { field: 'calculationMode', value: 'warm_from_components' },
      },
      {
        id: 'livingAreaMode1',
        label: 'Wohnfläche in m² (optional)',
        type: 'number',
        defaultValue: 70,
        min: 10,
        max: 500,
        step: 5,
        unit: 'm²',
        helpText: 'Ermöglicht den direkten Quadratmeter-Kostenvergleich (€/m² warm & kalt).',
        dependsOn: { field: 'calculationMode', value: 'warm_from_components' },
      },
      // Modus 2 Inputs
      {
        id: 'warmRent',
        label: 'Monatliche Warmmiete (in €)',
        type: 'number',
        defaultValue: 1020,
        min: 50,
        max: 50000,
        step: 25,
        unit: '€',
        helpText: 'Gesamte an den Vermieter zu überweisende monatliche Miete.',
        dependsOn: { field: 'calculationMode', value: 'cold_from_warm' },
      },
      {
        id: 'livingArea',
        label: 'Wohnfläche in m²',
        type: 'number',
        defaultValue: 70,
        min: 15,
        max: 300,
        step: 5,
        unit: 'm²',
        dependsOn: { field: 'calculationMode', value: 'cold_from_warm' },
      },
      {
        id: 'utilPerSqm',
        label: 'Geschätzte Nebenkosten pro m² (DMB ca. 3,10 €)',
        type: 'number',
        defaultValue: 3.10,
        min: 1.0,
        max: 8.0,
        step: 0.1,
        unit: '€/m²',
        helpText: 'Bundesweiter Durchschnitt laut Betriebskostenspiegel des Deutschen Mieterbunds.',
        dependsOn: { field: 'calculationMode', value: 'cold_from_warm' },
      },
    ],
    calculate: (inputs) => {
      const mode = inputs.calculationMode || 'warm_from_components';

      if (mode === 'cold_from_warm' || (inputs.warmRent !== undefined && inputs.coldRentInput === undefined && inputs.calculationMode !== 'warm_from_components')) {
        const warm = parseFloat(inputs.warmRent) || 1020;
        const area = parseFloat(inputs.livingArea) || 70;
        const rate = parseFloat(inputs.utilPerSqm) || 3.10;
        const utilities = area * rate;
        const coldRent = Math.max(0, warm - utilities);
        const coldRentPerSqm = area > 0 ? coldRent / area : 0;
        const warmPerSqm = area > 0 ? warm / area : 0;
        const warmYearly = warm * 12;

        return {
          primary: { id: 'coldRent', label: 'Errechnete Kaltmiete (Nettomiete)', value: coldRent, formattedValue: formatCurrency(coldRent), highlight: true },
          secondary: [
            { id: 'warmRent', label: 'Warmmiete pro Monat', value: warm, formattedValue: formatCurrency(warm) },
            { id: 'warmRentYearly', label: 'Warmmiete pro Jahr', value: warmYearly, formattedValue: formatCurrency(warmYearly) },
            { id: 'utilities', label: 'Geschätzte Nebenkostenvorauszahlung', value: utilities, formattedValue: formatCurrency(utilities) },
            { id: 'coldRentPerSqm', label: 'Kaltmiete pro m²', value: coldRentPerSqm, formattedValue: `${formatNumber(coldRentPerSqm, 2)} €/m²` },
            { id: 'warmRentPerSqm', label: 'Warmmiete pro m²', value: warmPerSqm, formattedValue: `${formatNumber(warmPerSqm, 2)} €/m²` },
            { id: 'utilPct', label: 'Anteil der Nebenkosten an der Warmmiete', value: warm > 0 ? (utilities / warm) * 100 : 0, formattedValue: formatPercent(warm > 0 ? (utilities / warm) * 100 : 0, 1) },
          ],
          directAnswer: `Bei einer Warmmiete von ${formatCurrency(warm)} für ${area} m² Wohnfläche entfallen bei ca. ${formatNumber(rate, 2)} €/m² Nebenkosten rund ${formatCurrency(utilities)} auf Nebenkosten und rechnerisch ${formatCurrency(coldRent)} auf die reine Nettokaltmiete.`,
          basisSummary: [
            { label: 'Berechnungsmodus', value: 'Kaltmiete aus Warmmiete aufschlüsseln' },
            { label: 'Monatliche Warmmiete', value: formatCurrency(warm) },
            { label: 'Wohnfläche', value: `${area} m²` },
            { label: 'Nebenkostensatz pro m²', value: `${formatNumber(rate, 2)} €/m²` },
          ],
          summaryText: `Bei ${formatCurrency(warm)} Warmmiete für ${area} m² entfallen ca. ${formatCurrency(utilities)} auf Nebenkosten und ${formatCurrency(coldRent)} auf die reine Nettokaltmiete (${formatNumber(coldRentPerSqm, 2)} €/m²).`,
        };
      }

      // Modus 1: Warmmiete berechnen
      const cold = Math.max(0, parseFloat(inputs.coldRentInput) || 0);
      const coldUtils = Math.max(0, parseFloat(inputs.operatingCosts) || 0);
      const heating = Math.max(0, parseFloat(inputs.heatingCosts) || 0);
      const otherCosts = Math.max(0, parseFloat(inputs.otherOperatingCosts) || 0);
      const area = Math.max(0, parseFloat(inputs.livingAreaMode1) || 0);

      const totalUtilities = coldUtils + heating + otherCosts;
      const warmRent = cold + totalUtilities;
      const warmRentYearly = warmRent * 12;
      const warmPerSqm = area > 0 ? warmRent / area : 0;
      const coldPerSqm = area > 0 ? cold / area : 0;
      const utilPct = warmRent > 0 ? (totalUtilities / warmRent) * 100 : 0;

      const secondaryItems = [
        {
          id: 'coldRent',
          label: 'Kaltmiete',
          value: cold,
          formattedValue: formatCurrency(cold),
          helpText: 'Reine Grundmiete ohne Nebenkosten',
        },
        {
          id: 'operatingCosts',
          label: 'Kalte Nebenkosten',
          value: coldUtils,
          formattedValue: formatCurrency(coldUtils),
          helpText: 'Müll, Grundsteuer, Hausmeister, Wasser/Abwasser',
        },
        {
          id: 'heatingCosts',
          label: 'Heizkosten',
          value: heating,
          formattedValue: formatCurrency(heating),
          helpText: 'Vorauszahlung für Heizung und Warmwasser',
        },
        ...(otherCosts > 0 ? [{
          id: 'otherOperatingCosts',
          label: 'Sonstige umlagefähige Kosten',
          value: otherCosts,
          formattedValue: formatCurrency(otherCosts),
          helpText: 'Sonstige Betriebskosten nach § 2 Nr. 17 BetrKV',
        }] : []),
        {
          id: 'warmRentYearly',
          label: 'Warmmiete pro Jahr',
          value: warmRentYearly,
          formattedValue: formatCurrency(warmRentYearly),
          highlight: true,
          helpText: '12 Monats-Warmmieten als jährliche Gesamtsumme',
        },
        {
          id: 'totalUtilities',
          label: 'Gesamte Nebenkosten pro Monat',
          value: totalUtilities,
          formattedValue: formatCurrency(totalUtilities),
        },
        ...(area > 0 ? [
          {
            id: 'warmRentPerSqm',
            label: 'Warmmiete pro m²',
            value: warmPerSqm,
            formattedValue: `${formatNumber(warmPerSqm, 2)} €/m²`,
          },
          {
            id: 'coldRentPerSqm',
            label: 'Kaltmiete pro m²',
            value: coldPerSqm,
            formattedValue: `${formatNumber(coldPerSqm, 2)} €/m²`,
          },
        ] : []),
        {
          id: 'utilPct',
          label: 'Anteil der Nebenkosten an der Warmmiete',
          value: utilPct,
          formattedValue: formatPercent(utilPct, 1),
        },
      ];

      return {
        primary: {
          id: 'warmRent',
          label: 'Warmmiete pro Monat',
          value: warmRent,
          formattedValue: formatCurrency(warmRent),
          highlight: true,
          helpText: 'Gesamte monatliche Zahlungsverpflichtung (Kaltmiete + kalte Nebenkosten + Heizkosten)',
        },
        secondary: secondaryItems,
        directAnswer: `Aus ${formatCurrency(cold)} Kaltmiete, ${formatCurrency(coldUtils)} kalten Nebenkosten und ${formatCurrency(heating)} Heizkosten${otherCosts > 0 ? ` sowie ${formatCurrency(otherCosts)} sonstigen Betriebskosten` : ''} ergibt sich eine monatliche Warmmiete von ${formatCurrency(warmRent)} (${formatCurrency(warmRentYearly)} pro Jahr).`,
        qualifications: [
          'Warmmiete = Kaltmiete + kalte Nebenkosten + Heizkosten.',
          'Die genaue Zusammensetzung richtet sich nach dem Mietvertrag und der jährlichen Betriebskostenabrechnung.',
          'Haushaltsstrom und Internet sind in der Warmmiete üblicherweise nicht enthalten und müssen separat bezahlt werden.',
        ],
        calculationSteps: [
          `Kalte Nebenkosten + Heizkosten${otherCosts > 0 ? ' + Sonstige Kosten' : ''} = ${formatCurrency(coldUtils)} + ${formatCurrency(heating)}${otherCosts > 0 ? ` + ${formatCurrency(otherCosts)}` : ''} = ${formatCurrency(totalUtilities)} monatliche Nebenkosten`,
          `Warmmiete pro Monat = ${formatCurrency(cold)} Kaltmiete + ${formatCurrency(totalUtilities)} Nebenkosten = ${formatCurrency(warmRent)}`,
          `Warmmiete pro Jahr = ${formatCurrency(warmRent)} × 12 Monate = ${formatCurrency(warmRentYearly)}`,
          area > 0 ? `Warmmiete pro m² = ${formatCurrency(warmRent)} ÷ ${area} m² = ${formatNumber(warmPerSqm, 2)} €/m² (${formatNumber(coldPerSqm, 2)} €/m² Kaltmiete)` : '',
        ].filter(Boolean),
        basisSummary: [
          { label: 'Berechnungsmodus', value: 'Warmmiete aus Kaltmiete & Nebenkosten berechnen' },
          { label: 'Kaltmiete pro Monat', value: formatCurrency(cold) },
          { label: 'Kalte Nebenkosten pro Monat', value: formatCurrency(coldUtils) },
          { label: 'Heizkosten pro Monat', value: formatCurrency(heating) },
          ...(otherCosts > 0 ? [{ label: 'Sonstige umlagefähige Kosten', value: formatCurrency(otherCosts) }] : []),
          ...(area > 0 ? [{ label: 'Wohnfläche', value: `${area} m²` }] : []),
        ],
        summaryText: `Bei einer Kaltmiete von ${formatCurrency(cold)}, kalten Nebenkosten von ${formatCurrency(coldUtils)} und Heizkosten von ${formatCurrency(heating)}${otherCosts > 0 ? ` sowie ${formatCurrency(otherCosts)} sonstigen Kosten` : ''} beträgt die Warmmiete ${formatCurrency(warmRent)} pro Monat bzw. ${formatCurrency(warmRentYearly)} pro Jahr.`,
      };
    },
    formula: 'Warmmiete = Kaltmiete + kalte Nebenkosten + Heizkosten',
    formulaExplanation: 'Die Warmmiete (Bruttomiete) ergibt sich aus der reinen Nettokaltmiete zuzüglich der monatlichen Vorauszahlungen für kalte Betriebskosten sowie Heizung und Warmwasser nach der Betriebskostenverordnung (BetrKV).',
    workedExample: {
      title: 'Beispiel: 750 € Kaltmiete, 150 € kalte Nebenkosten und 120 € Heizkosten für 70 m²',
      inputValues: [
        { label: 'Kaltmiete pro Monat', value: '750 €' },
        { label: 'Kalte Nebenkosten', value: '150 €' },
        { label: 'Heizkosten pro Monat', value: '120 €' },
        { label: 'Wohnfläche', value: '70 m²' },
      ],
      steps: [
        'Nebenkosten gesamt = 150 € kalte Nebenkosten + 120 € Heizkosten = 270 €',
        'Warmmiete pro Monat = 750 € Kaltmiete + 270 € Nebenkosten = 1.020,00 €',
        'Warmmiete pro Jahr = 1.020 € × 12 Monate = 12.240,00 €',
        'Quadratmeterpreis = 1.020 € ÷ 70 m² = 14,57 €/m² warm (10,71 €/m² kalt)',
      ],
      result: '1.020,00 € monatliche Warmmiete (12.240,00 € Warmmiete pro Jahr)',
    },
    content: {
      intro: 'Die monatliche Warmmiete beziffert den Gesamtbetrag, den Sie als Mieter jeden Monat an den Vermieter überweisen. Mit unserem Warmmiete-Rechner ermitteln Sie Ihre Warmmiete transparent aus Kaltmiete, kalten Nebenkosten und Heizkosten – inklusive jährlicher Gesamtsumme und Quadratmeterpreisen. Die exakte Zusammensetzung hängt stets vom Mietvertrag und der jährlichen Betriebskostenabrechnung ab.',
      details: 'Formel: Warmmiete = Kaltmiete + kalte Nebenkosten + Heizkosten. Die Kaltmiete (Nettomiete) vergütet ausschließlich die Raumnutzung und dient als Referenz für Mietspiegel und Mietpreisbremse. Die Nebenkostenvorauszahlung umfasst kalte Betriebskosten (Müll, Grundsteuer, Hausmeister, Wasser/Abwasser) sowie Heizungs- und Warmwasserkosten gemäß der Betriebskostenverordnung (BetrKV). Prüfen Sie mit dem [Mietbelastungsquote Rechner](/rechner/mietbelastungsquote-rechner/) auch, ob die Miete zu Ihrem Gehalt passt, kalkulieren Sie Kaufnebenkosten mit dem [Kaufnebenkosten Rechner](/rechner/kaufnebenkosten-rechner/) oder vergleichen Sie Optionen im [Mietbudget Rechner](/rechner/mietbudget-rechner/).',
    },
    faqs: [
      {
        question: 'Wie berechnet man die Warmmiete genau?',
        answer: 'Die Grundformel lautet: Warmmiete = Kaltmiete + kalte Nebenkosten + Heizkosten. Addieren Sie zur vereinbarten Nettokaltmiete die Vorauszahlungen für kalte Betriebskosten und die Heiz- und Warmwasserkosten laut Mietvertrag.',
      },
      {
        question: 'Was ist der Unterschied zwischen Warmmiete und Kaltmiete?',
        answer: 'Die Kaltmiete (Nettomiete) ist der reine Preis für die Überlassung der Wohnräume. Die Warmmiete (Bruttomiete) umfasst zusätzlich alle laufenden kalten Betriebskosten sowie die Heiz- und Warmwasserkosten, die monatlich als Abschlag an den Vermieter gezahlt werden.',
      },
      {
        question: 'Welche Kosten gehören zu den kalten Nebenkosten?',
        answer: 'Zu den kalten Betriebskosten nach § 2 BetrKV zählen unter anderem Grundsteuer, Müllabfuhr, Wasser und Abwasser, Sach- und Haftpflichtversicherungen des Gebäudes, Straßenreinigung, Hausmeisterdienst und Gartenpflege.',
      },
      {
        question: 'Ist Haushaltsstrom in der Warmmiete enthalten?',
        answer: 'Nein, Haushaltsstrom für Lampen, Haushaltsgeräte und Elektronik ist fast nie Teil der Warmmiete. Mieter schließen hierfür einen separaten Liefervertrag mit einem Stromanbieter ab. Lediglich der Allgemeinstrom für Treppenhausbeleuchtung und Aufzug ist in den Betriebskosten enthalten.',
      },
      {
        question: 'Warum weicht die tatsächliche Jahresabrechnung von der Warmmiete ab?',
        answer: 'Die in der Warmmiete enthaltenen Nebenkosten sind in der Regel monatliche Vorauszahlungen. Einmal jährlich rechnet der Vermieter die tatsächlichen Kosten ab (Betriebskostenabrechnung). Bei Mehr- oder Minderverbrauch an Wärme oder gestiegenen Preisen kommt es zu einer Nachzahlung oder einem Guthaben.',
      },
    ],
    relatedSlugs: ['mietbelastungsquote-rechner', 'mietbudget-rechner', 'kaufnebenkosten-rechner', 'untermiete-rechner', 'stromkostenrechner', 'heizkostenvergleich-rechner'],
    trustMeta: {
      lastReviewed: '2026-10-07',
      sourceName: 'Betriebskostenverordnung (BetrKV) & Deutscher Mieterbund',
      legalBasis: '§ 556 BGB, § 2 BetrKV',
    },
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
      { id: 'totalWarmRent', label: 'Gesamte Warmmiete der Wohnung', type: 'number', defaultValue: 1200, min: 0, step: 25, unit: '€', helpText: 'Vollständige Warmmiete der Wohnung in Euro.' },
      { id: 'totalApartmentArea', label: 'Gesamtwohnfläche der Wohnung in m²', type: 'number', defaultValue: 80, min: 1, step: 5, unit: 'm²', helpText: 'Gesamtwohnfläche der gesamten Wohnung laut Mietvertrag.' },
      { id: 'subletRoomArea', label: 'Größe des untervermieteten Zimmers in m²', type: 'number', defaultValue: 20, min: 0, step: 1, unit: 'm²', helpText: 'Exklusiv vom Untermieter genutzte Zimmerfläche in m².' },
      { id: 'furnishingSurcharge', label: 'Monatlicher Möblierungs- & WLAN-Zuschlag', type: 'number', defaultValue: 40, min: 0, step: 5, unit: '€', helpText: 'Monatlicher Möblierungs- & Pauschalzuschlag in Euro (0 € bei unmöblierter Vermietung).' },
    ],
    calculate: (inputs) => {
      const rentRaw = inputs.totalWarmRent;
      const totalAreaRaw = inputs.totalApartmentArea;
      const roomAreaRaw = inputs.subletRoomArea;
      const surchargeRaw = inputs.furnishingSurcharge;

      const rentStr = rentRaw !== undefined && rentRaw !== null ? String(rentRaw).trim() : '';
      const totalAreaStr = totalAreaRaw !== undefined && totalAreaRaw !== null ? String(totalAreaRaw).trim() : '';
      const roomAreaStr = roomAreaRaw !== undefined && roomAreaRaw !== null ? String(roomAreaRaw).trim() : '';
      const surchargeStr = surchargeRaw !== undefined && surchargeRaw !== null ? String(surchargeRaw).trim() : '';

      const totalRent = rentStr !== '' ? parseFloat(rentStr.replace(',', '.')) : 1200;
      const totalArea = totalAreaStr !== '' ? parseFloat(totalAreaStr.replace(',', '.')) : 80;
      const roomArea = roomAreaStr !== '' ? parseFloat(roomAreaStr.replace(',', '.')) : 20;
      const surcharge = surchargeStr !== '' ? parseFloat(surchargeStr.replace(',', '.')) : 40;

      if (isNaN(totalRent) || isNaN(totalArea) || isNaN(roomArea) || isNaN(surcharge) || totalRent < 0 || totalArea <= 0 || roomArea < 0 || surcharge < 0) {
        return {
          primary: { id: 'totalSubRent', label: 'Empfohlene Warm-Untermiete', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie gültige Werte ein (Gesamtwohnfläche muss größer als 0 sein).',
        };
      }

      // Modell: Untermieter nutzt Zimmer exklusiv + halben Anteil an Restfläche (Küche, Bad, Flur)
      const commonArea = Math.max(0, totalArea - (roomArea * 2));
      const subRatio = Math.min(1, (roomArea + (commonArea / 2)) / totalArea);
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
        directAnswer: `Für das ${roomArea} m² große Zimmer in einer ${totalArea} m² Wohnung (Warmmiete ${formatCurrency(totalRent)}) beträgt der flächenanteilige Mietanteil ${formatCurrency(baseSubRent)} (${formatPercent(subRatio * 100, 1)} Flächennutzung). Zuzüglich ${formatCurrency(surcharge)} Zuschlag ergibt sich eine empfohlene Gesamt-Untermiete von ${formatCurrency(totalSubRent)} monatlich.`,
        basisSummary: [
          { label: 'Gesamtwohnfläche', value: `${totalArea} m²` },
          { label: 'Zimmerfläche', value: `${roomArea} m²` },
          { label: 'Gesamtmiete der Wohnung', value: formatCurrency(totalRent) },
          { label: 'Zuschläge', value: formatCurrency(surcharge) },
        ],
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
    relatedSlugs: ['warmmiete-rechner', 'mietminderung-rechner', 'mietkaution-zinsen-rechner'],
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
      { id: 'landValue', label: 'Bodenwert des Baugrundstücks', type: 'number', defaultValue: 180000, min: 0, step: 5000, unit: '€', helpText: 'Bodenrichtwert bzw. Verkehrswert des Grundstücks in Euro.' },
      { id: 'interestRate', label: 'Erbbauzins-Satz p.a. (üblich 3 % bis 5 %)', type: 'number', defaultValue: 4.0, min: 0, max: 15.0, step: 0.1, unit: '%', helpText: 'Vereinbarter jährlicher Zinssatz in Prozent.' },
      { id: 'leaseYears', label: 'Laufzeit des Erbbaurechts in Jahren', type: 'number', defaultValue: 99, min: 1, max: 199, step: 1, unit: 'Jahre', helpText: 'Gesamtlaufzeit des Erbbaurechtsvertrags.' },
    ],
    calculate: (inputs) => {
      const landRaw = inputs.landValue;
      const rateRaw = inputs.interestRate;
      const yearsRaw = inputs.leaseYears;

      const landStr = landRaw !== undefined && landRaw !== null ? String(landRaw).trim() : '';
      const rateStr = rateRaw !== undefined && rateRaw !== null ? String(rateRaw).trim() : '';
      const yearsStr = yearsRaw !== undefined && yearsRaw !== null ? String(yearsRaw).trim() : '';

      const land = landStr !== '' ? parseFloat(landStr.replace(',', '.')) : 180000;
      const rate = (rateStr !== '' ? parseFloat(rateStr.replace(',', '.')) : 4.0) / 100;
      const years = yearsStr !== '' ? parseInt(yearsStr, 10) : 99;

      if (isNaN(land) || isNaN(rate) || isNaN(years) || land < 0 || rate < 0 || years < 1) {
        return {
          primary: { id: 'yearly', label: 'Jährlicher Erbbauzins', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie gültige Werte ein (Laufzeit muss mindestens 1 Jahr betragen).',
        };
      }

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
        directAnswer: `Bei einem Grundstücksbodenwert von ${formatCurrency(land)} und einem Erbbauzinssatz von ${formatPercent(rate * 100, 1)} beläuft sich der Erbbauzins auf ${formatCurrency(yearly)} im Jahr bzw. ${formatCurrency(monthly)} monatlich (Summe über ${years} Jahre: ${formatCurrency(totalOverTerm)}).`,
        basisSummary: [
          { label: 'Bodenwert', value: formatCurrency(land) },
          { label: 'Zinssatz p.a.', value: formatPercent(rate * 100, 1) },
          { label: 'Vertragslaufzeit', value: `${years} Jahre` },
        ],
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
      { id: 'purchasePrice', label: 'Kaufpreis der Immobilie (ohne Nebenkosten)', type: 'number', defaultValue: 280000, min: 0, step: 5000, unit: '€', helpText: 'Kaufpreis der Immobilie ohne Kaufnebenkosten.' },
      { id: 'yearlyRent', label: 'Jahres-Nettokaltmiete', type: 'number', defaultValue: 11200, min: 0, step: 100, unit: '€', helpText: 'Gesamte Netto-Kaltmieteinnahmen pro Kalenderjahr.' },
    ],
    calculate: (inputs) => {
      const priceRaw = inputs.purchasePrice;
      const rentRaw = inputs.yearlyRent;

      const priceStr = priceRaw !== undefined && priceRaw !== null ? String(priceRaw).trim() : '';
      const rentStr = rentRaw !== undefined && rentRaw !== null ? String(rentRaw).trim() : '';

      const price = priceStr !== '' ? parseFloat(priceStr.replace(',', '.')) : 280000;
      const rent = rentStr !== '' ? parseFloat(rentStr.replace(',', '.')) : 11200;

      if (isNaN(price) || isNaN(rent) || price < 0 || rent < 0) {
        return {
          primary: { id: 'factor', label: 'Kaufpreisfaktor (Vervielfältiger)', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie gültige Zahlenwerte ein (Kaufpreis und Jahresmiete dürfen nicht negativ sein).',
        };
      }

      const factor = rent > 0 ? price / rent : 0;
      const yieldPct = price > 0 ? (rent / price) * 100 : 0;
      let rating = 'Sehr günstig / Hohe Rendite';
      if (rent === 0) rating = 'Keine Mieteinnahmen / Leerstand';
      else if (factor > 30) rating = 'Teuer / Niedrige Mietrendite';
      else if (factor > 24) rating = 'Marktüblich in guten Lagen';
      else if (factor > 18) rating = 'Solide Rentabilität';
      return {
        primary: { id: 'factor', label: 'Kaufpreisfaktor (Vervielfältiger)', value: factor, formattedValue: factor > 0 ? `${formatNumber(factor, 1)}x` : '–', highlight: true },
        secondary: [
          { id: 'yieldPct', label: 'Bruttomietrendite', value: yieldPct, formattedValue: formatPercent(yieldPct, 2) },
          { id: 'monthlyRent', label: 'Monatliche Kaltmiete', value: rent / 12, formattedValue: formatCurrency(rent / 12) },
          { id: 'rating', label: 'Marktbewertung', value: 0, formattedValue: rating },
        ],
        summaryText: rent > 0
          ? `Ein Faktor von ${formatNumber(factor, 1)} bedeutet, dass der Kaufpreis ${formatNumber(factor, 1)} Jahreskaltmieten entspricht (entspricht ${formatPercent(yieldPct, 2)} Bruttorendite).`
          : `Bei einer Jahreskaltmiete von 0,00 € kann kein Kaufpreisfaktor ermittelt werden.`,
        directAnswer: rent > 0
          ? `Bei einem Kaufpreis von ${formatCurrency(price)} und einer Jahresnettokaltmiete von ${formatCurrency(rent)} (${formatCurrency(rent / 12)}/Monat) beträgt der Kaufpreisfaktor ${formatNumber(factor, 1)}x. Die rechnerische Bruttomietrendite liegt bei ${formatPercent(yieldPct, 2)} (${rating}).`
          : `Bei 0,00 € Jahreskaltmiete erzielt die Immobilie aktuell keine Mietrendite.`,
        basisSummary: [
          { label: 'Kaufpreis', value: formatCurrency(price) },
          { label: 'Jahresnettokaltmiete', value: formatCurrency(rent) },
          { label: 'Kaufpreisfaktor', value: factor > 0 ? `${formatNumber(factor, 1)}x` : '–' },
          { label: 'Bruttomietrendite', value: formatPercent(yieldPct, 2) },
        ],
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
      { id: 'powerWatts', label: 'Leistungsaufnahme des Geräts in Watt', type: 'number', defaultValue: 150, min: 0, step: 5, unit: 'W' },
      { id: 'hoursPerDay', label: 'Nutzungsdauer pro Tag in Stunden', type: 'number', defaultValue: 4, min: 0.1, max: 24, step: 0.5, unit: 'Std./Tag' },
      { id: 'usageDays', label: 'Nutzungstage im Betrachtungszeitraum', type: 'number', defaultValue: 365, min: 1, max: 365, step: 1, unit: 'Tage', helpText: 'z. B. 30 Tage für einen Monat, 365 Tage für ein ganzes Jahr oder 10 Tage für temporäre Heizgeräte' },
      { id: 'electricityPrice', label: 'Strompreis in Cent pro kWh', type: 'number', defaultValue: 36, min: 5, max: 90, step: 0.5, unit: 'ct/kWh' },
    ],
    calculate: (inputs) => {
      if (inputs.powerWatts === undefined || inputs.powerWatts === null || String(inputs.powerWatts).trim() === '') {
        return {
          primary: { id: 'costPeriod', label: 'Stromkosten im Zeitraum', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie die Leistungsaufnahme des Geräts in Watt ein.',
        };
      }
      if (inputs.hoursPerDay === undefined || inputs.hoursPerDay === null || String(inputs.hoursPerDay).trim() === '') {
        return {
          primary: { id: 'costPeriod', label: 'Stromkosten im Zeitraum', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie die tägliche Nutzungsdauer in Stunden ein.',
        };
      }
      if (inputs.electricityPrice === undefined || inputs.electricityPrice === null || String(inputs.electricityPrice).trim() === '') {
        return {
          primary: { id: 'costPeriod', label: 'Stromkosten im Zeitraum', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie den Strompreis in Cent pro kWh ein.',
        };
      }

      const wattsStr = String(inputs.powerWatts).trim();
      const hoursStr = String(inputs.hoursPerDay).trim();
      const priceStr = String(inputs.electricityPrice).trim();
      const daysStr = inputs.usageDays !== undefined && inputs.usageDays !== null && String(inputs.usageDays).trim() !== ''
        ? String(inputs.usageDays).trim()
        : '365';

      const watts = parseFloat(wattsStr.replace(',', '.'));
      const hours = parseFloat(hoursStr.replace(',', '.'));
      const days = parseFloat(daysStr.replace(',', '.'));
      const priceCent = parseFloat(priceStr.replace(',', '.'));

      if (isNaN(watts) || isNaN(hours) || isNaN(days) || isNaN(priceCent)) {
        return {
          primary: { id: 'costPeriod', label: 'Stromkosten im Zeitraum', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Bitte geben Sie gültige Zahlenwerte ein.',
        };
      }

      if (watts < 0 || hours < 0 || days <= 0 || priceCent < 0) {
        return {
          primary: { id: 'costPeriod', label: 'Stromkosten im Zeitraum', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Leistung, Stunden und Strompreis dürfen nicht negativ sein. Die Nutzungstage müssen mindestens 1 betragen.',
        };
      }

      const kwhPerHour = watts / 1000;
      const kwhPerDay = kwhPerHour * hours;
      const totalKwhPeriod = kwhPerDay * days;
      const costPeriod = (totalKwhPeriod * priceCent) / 100;
      const costPerHour = (kwhPerHour * priceCent) / 100;
      const costPerDay = (kwhPerDay * priceCent) / 100;

      const isFullYear = days === 365;
      const periodLabel = isFullYear ? 'Stromkosten pro Jahr (365 Tage)' : `Stromkosten für ${days} Nutzungstage`;

      return {
        primary: {
          id: 'costPeriod',
          label: periodLabel,
          value: costPeriod,
          formattedValue: formatCurrency(costPeriod),
          highlight: true,
        },
        secondary: [
          { id: 'totalKwhPeriod', label: `Stromverbrauch (${days} Tage)`, value: totalKwhPeriod, formattedValue: `${formatNumber(totalKwhPeriod, 1)} kWh` },
          { id: 'costPerHour', label: 'Kosten pro Betriebsstunde', value: costPerHour, formattedValue: `${formatCurrency(costPerHour)} / Std.` },
          { id: 'costPerDay', label: 'Kosten pro Nutzungstag', value: costPerDay, formattedValue: `${formatCurrency(costPerDay)} / Tag` },
          { id: 'costYearExtrapolated', label: 'Hochrechnung auf 365 Tage', value: costPerDay * 365, formattedValue: formatCurrency(costPerDay * 365) },
        ],
        summaryText: `Dein Gerät verbraucht bei ${formatNumber(watts, 0)} Watt und täglich ${formatNumber(hours, 1)} Stunden Nutzung in ${days} Tagen insgesamt ${formatNumber(totalKwhPeriod, 1)} kWh. Bei ${formatNumber(priceCent, 1)} Cent/kWh kostet das ${formatCurrency(costPeriod)}.`,
        directAnswer: `Dein Gerät verbraucht bei ${formatNumber(watts, 0)} Watt und täglich ${formatNumber(hours, 1)} Stunden Nutzung in ${days} Tagen insgesamt ${formatNumber(totalKwhPeriod, 1)} kWh. Bei ${formatNumber(priceCent, 1)} Cent/kWh kostet das ${formatCurrency(costPeriod)}.`,
        qualifications: [
          'Nur reine Verbrauchskosten; ohne Grundpreis des Stromversorgers.',
          'Schätzung bei durchgehend voller Leistung; Thermostate oder Ruhemodi können den tatsächlichen Verbrauch reduzieren.',
          isFullYear
            ? 'Berechnet für ein volles Kalenderjahr (365 Nutzungstage).'
            : `Berechnet für exakt ${days} Nutzungstage (keine Zwangshochrechnung auf das Gesamtjahr).`,
        ],
        calculationSteps: [
          `${formatNumber(watts / 1000, 2)} kW × ${formatNumber(hours, 1)} Stunden pro Tag × ${days} Tage = ${formatNumber(totalKwhPeriod, 1)} kWh`,
          `${formatNumber(totalKwhPeriod, 1)} kWh × ${formatCurrency(priceCent / 100, 2)}/kWh = ${formatCurrency(costPeriod)}`,
        ],
        basisSummary: [
          { label: 'Leistung des Geräts', value: `${formatNumber(watts, 0)} Watt` },
          { label: 'Nutzung pro Tag', value: `${formatNumber(hours, 1)} Stunden` },
          { label: 'Nutzungstage', value: `${days} Tage` },
          { label: 'Strompreis', value: `${formatNumber(priceCent, 1)} Cent/kWh` },
        ],
      };
    },
    formula: 'Kosten = (Watt × Stunden/Tag × Nutzungstage / 1000) × Strompreis in €',
    formulaExplanation: 'Watt dividiert durch 1.000 ergibt Kilowatt (kW). Multipliziert mit den Betriebsstunden, den tatsächlichen Nutzungstagen und dem Arbeitspreis je kWh erhält man die Gesamtkosten ohne pauschale Zwangshochrechnung auf 365 Tage.',
    workedExample: {
      title: 'Beispiel 1: 150-Watt Fernseher 4 Stunden täglich an 365 Tagen bei 36 ct/kWh',
      inputValues: [{ label: 'Leistung', value: '150 Watt' }, { label: 'Betriebszeit', value: '4 Std./Tag' }, { label: 'Nutzungstage', value: '365 Tage' }, { label: 'Strompreis', value: '36 ct/kWh' }],
      steps: ['Täglich: 150 W × 4 h = 600 Wh = 0,6 kWh/Tag', '365 Tage: 0,6 kWh × 365 = 219 kWh', 'Kosten: 219 kWh × 0,36 € = 78,84 €'],
      result: '78,84 € Stromkosten pro Jahr',
    },
    workedExamples: [
      {
        title: 'Beispiel 1: 150-Watt Fernseher 4 Stunden täglich an 365 Tagen bei 36 ct/kWh',
        description: 'Täglich: 0,6 kWh. Jährlich (365 Tage): 219 kWh. Kosten: 78,84 € pro Jahr.',
        inputs: { powerWatts: 150, hoursPerDay: 4, usageDays: 365, electricityPrice: 36 },
        resultSummary: '78,84 € pro Jahr (219 kWh)',
      },
      {
        title: 'Beispiel 2: 2.000-Watt Heizlüfter 2 Stunden täglich an genau 30 Tagen bei 35 ct/kWh',
        description: 'Täglich: 2.000 W × 2 h = 4 kWh/Tag. 30 Tage: 4 kWh × 30 = 120 kWh. Kosten: 120 kWh × 0,35 € = 42,00 €.',
        inputs: { powerWatts: 2000, hoursPerDay: 2, usageDays: 30, electricityPrice: 35 },
        resultSummary: '42,00 € für 30 Tage (120 kWh, 0,70 €/Std.)',
      },
    ],
    content: {
      intro: 'Dieser Gerätekostenrechner beziffert die laufenden Kosten einzelner Verbraucher (Waschmaschine, PC, Backofen, Heizlüfter) pro Nutzung, Tag, Monat und Jahr. Eine detaillierte Beispielrechnung mit Kosten pro Stunde und Monat für Heizgeräte finden Sie in unserem Ratgeber [Heizlüfter mit 2000 Watt: Kosten pro Stunde und Monat](/ratgeber/heizluefter-2000-watt-stromkosten/).',
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
    name: 'Gasverbrauch Rechner (m³ in kWh & Gaskosten)',
    shortName: 'Gasverbrauch berechnen',
    category: 'haushalt-energie',
    subcategory: 'Heizung & Gas',
    metaTitle: 'Gasverbrauch berechnen: Zählerstände & m³ in kWh',
    metaDescription: 'Rechnen Sie Gaszählerstände oder Kubikmeter (m³) über Brennwert und Zustandszahl in Kilowattstunden (kWh) um – für Ihren konkreten Ablesezeitraum ohne Grundgebühr.',
    h1: 'Gasverbrauch berechnen: m³ in kWh & Gaskosten Rechner',
    shortDescription: 'Wandelt abgelesene Kubikmeter (m³) vom Gaszähler in Kilowattstunden (kWh) um und kalkuliert Ihre monatlichen und jährlichen Gaskosten.',
    searchKeywords: [
      'gasverbrauch berechnen',
      'gasverbrauch m3 in kwh rechner',
      'gaszaehler umrechnen formel',
      'brennwert zustandszahl gas',
      'gaskosten berechnen kwh',
      'm3 in kwh gas',
    ],
    inputs: [
      {
        id: 'inputMode',
        label: 'Berechnungsgrundlage',
        type: 'select',
        defaultValue: 'volume',
        options: [
          { value: 'volume', label: 'Verbrauchtes Gasvolumen direkt in m³ (aus Abrechnung oder Zählerdifferenz)' },
          { value: 'readings', label: 'Aus 2 Zählerständen berechnen (Zählerstand alt & neu)' },
        ],
      },
      { id: 'gasCubicMeters', label: 'Verbrauchtes Gasvolumen in Kubikmetern (m³)', type: 'number', defaultValue: 1200, min: 0, step: 10, unit: 'm³', helpText: 'Wird bei Auswahl „Verbrauchtes Gasvolumen“ direkt herangezogen.' },
      { id: 'meterReadingOld', label: 'Alter Zählerstand in m³ (Vorablesung)', type: 'number', defaultValue: 7250, min: 0, step: 10, unit: 'm³', helpText: 'Zählerstand zu Beginn des Zeitraums (nur bei „Aus 2 Zählerständen“).' },
      { id: 'meterReadingNew', label: 'Neuer Zählerstand in m³ (Aktuelle Ablesung)', type: 'number', defaultValue: 8450, min: 0, step: 10, unit: 'm³', helpText: 'Aktueller Zählerstand am Ende des Zeitraums.' },
      { id: 'brennwert', label: 'Brennwert Hs in kWh/m³ (laut Gasrechnung)', type: 'number', defaultValue: 10.8, min: 8, max: 13, step: 0.1, unit: 'kWh/m³', helpText: 'Üblich: 10,2 bis 11,5 kWh/m³ bei H-Gas, 8,5 bis 10,0 bei L-Gas' },
      { id: 'zustandszahl', label: 'Zustandszahl z (laut Gasrechnung)', type: 'number', defaultValue: 0.95, min: 0.8, max: 1.1, step: 0.01, helpText: 'Berücksichtigt Höhenlage, Druck und Temperatur (üblich: ca. 0,90 bis 0,97)' },
      { id: 'gasPricePerKwh', label: 'Arbeitspreis in Cent pro kWh', type: 'number', defaultValue: 11.0, min: 0, max: 35, step: 0.1, unit: 'ct/kWh', helpText: 'Reiner Arbeitspreis laut Gastarif (ohne Grundpreis)' },
    ],
    calculate: (inputs) => {
      const mode = inputs.inputMode || 'volume';
      const bwStr = String(inputs.brennwert ?? '').trim();
      const zStr = String(inputs.zustandszahl ?? '').trim();
      const priceStr = String(inputs.gasPricePerKwh ?? '').trim();

      const bw = bwStr !== '' ? parseFloat(bwStr.replace(',', '.')) : 10.8;
      const z = zStr !== '' ? parseFloat(zStr.replace(',', '.')) : 0.95;
      const price = priceStr !== '' ? parseFloat(priceStr.replace(',', '.')) : 11.0;

      let m3 = 0;
      if (mode === 'readings') {
        const oldStr = String(inputs.meterReadingOld ?? '').trim();
        const newStr = String(inputs.meterReadingNew ?? '').trim();
        if (oldStr === '' || newStr === '') {
          return {
            primary: { id: 'kwh', label: 'Energieverbrauch in Kilowattstunden', value: 0, formattedValue: '–' },
            secondary: [],
            error: 'Bitte geben Sie sowohl den alten als auch den neuen Zählerstand ein.',
          };
        }
        const oldReading = parseFloat(oldStr.replace(',', '.'));
        const newReading = parseFloat(newStr.replace(',', '.'));
        if (isNaN(oldReading) || isNaN(newReading)) {
          return {
            primary: { id: 'kwh', label: 'Energieverbrauch in Kilowattstunden', value: 0, formattedValue: '–' },
            secondary: [],
            error: 'Bitte geben Sie gültige Zahlenwerte für beide Zählerstände ein.',
          };
        }
        if (newReading < oldReading) {
          return {
            primary: { id: 'kwh', label: 'Energieverbrauch in Kilowattstunden', value: 0, formattedValue: '–' },
            secondary: [],
            error: `Der neue Zählerstand (${formatNumber(newReading, 0)} m³) darf nicht kleiner sein als der alte Zählerstand (${formatNumber(oldReading, 0)} m³). Bei einem Zählerwechsel müssen alter und neuer Zähler separat abgerechnet werden.`,
          };
        }
        m3 = newReading - oldReading;
      } else {
        const m3Str = String(inputs.gasCubicMeters ?? '').trim();
        if (m3Str === '') {
          return {
            primary: { id: 'kwh', label: 'Energieverbrauch in Kilowattstunden', value: 0, formattedValue: '–' },
            secondary: [],
            error: 'Bitte geben Sie das verbrauchte Gasvolumen in m³ ein.',
          };
        }
        m3 = parseFloat(m3Str.replace(',', '.'));
        if (isNaN(m3) || m3 < 0) {
          return {
            primary: { id: 'kwh', label: 'Energieverbrauch in Kilowattstunden', value: 0, formattedValue: '–' },
            secondary: [],
            error: 'Das Gasvolumen darf nicht negativ sein.',
          };
        }
      }

      if (isNaN(bw) || isNaN(z) || isNaN(price) || bw <= 0 || z <= 0 || price < 0) {
        return {
          primary: { id: 'kwh', label: 'Energieverbrauch in Kilowattstunden', value: 0, formattedValue: '–' },
          secondary: [],
          error: 'Brennwert und Zustandszahl müssen größer als 0 sein. Der Arbeitspreis darf nicht negativ sein.',
        };
      }

      const kwh = m3 * bw * z;
      const consumptionCost = (kwh * price) / 100;
      const costPerM3 = m3 > 0 ? consumptionCost / m3 : (bw * z * price) / 100;
      const reference100Kwh = 100 * bw * z;

      return {
        primary: {
          id: 'kwh',
          label: 'Energieverbrauch in Kilowattstunden',
          value: kwh,
          formattedValue: `${formatNumber(kwh, 0)} kWh`,
          highlight: true,
        },
        secondary: [
          { id: 'consumedM3', label: 'Verbrauchtes Gasvolumen', value: m3, formattedValue: `${formatNumber(m3, 0)} m³` },
          {
            id: 'consumptionCost',
            label: 'Reine Verbrauchskosten (ohne Grundpreis)',
            value: consumptionCost,
            formattedValue: formatCurrency(consumptionCost),
            helpText: 'Reine verbrauchsabhängige Kosten (kWh × Arbeitspreis). Feste monatliche Grundpreise Ihres Versorgers sind hierin nicht enthalten.',
          },
          { id: 'reference100Kwh', label: 'Energiegehalt je 100 m³ Gas', value: reference100Kwh, formattedValue: `${formatNumber(reference100Kwh, 0)} kWh` },
          { id: 'costPerM3', label: 'Effektiver Arbeitspreis pro m³', value: costPerM3, formattedValue: `${formatCurrency(costPerM3, 3)} / m³` },
        ],
        summaryText: `${formatNumber(m3, 0)} m³ Gas entsprechen ${formatNumber(kwh, 0)} kWh thermischer Energie (Brennwert: ${formatNumber(bw, 1)} kWh/m³, z-Zahl: ${formatNumber(z, 2)}). Bei ${formatNumber(price, 1)} ct/kWh Arbeitspreis betragen die reinen Verbrauchskosten ${formatCurrency(consumptionCost)} (ohne Grundpreis).`,
        directAnswer: `Aus ${formatNumber(m3, 0)} m³ Erdgas entstehen bei Brennwert ${formatNumber(bw, 1)} kWh/m³ und Zustandszahl ${formatNumber(z, 2)} genau ${formatNumber(kwh, 0)} kWh thermische Energie. Bei ${formatNumber(price, 1)} ct/kWh entspricht das reinen Verbrauchskosten von ${formatCurrency(consumptionCost)} (ohne Grundpreis).`,
        qualifications: [
          'Reine verbrauchsabhängige Energiekosten; feste monatliche Grundgebühren des Gasversorgers sind hierin nicht enthalten.',
          'Der errechnete Verbrauch gilt exakt für den individuellen Ablesezeitraum zwischen den beiden Zählerständen und darf nicht unüberlegt auf ein ganzes Jahr hochgerechnet werden (Gasverbrauch ist stark saisonal).',
          'Brennwert und Zustandszahl variieren je nach Gasnetzgebiet und Höhenlage; die exakten Abrechnungsfaktoren finden Sie auf Ihrer Gasrechnung.',
        ],
        calculationSteps: [
          mode === 'readings' && inputs.meterReadingNew !== undefined && inputs.meterReadingOld !== undefined
            ? `Gasvolumen = ${formatNumber(parseFloat(String(inputs.meterReadingNew).replace(',', '.')), 0)} m³ − ${formatNumber(parseFloat(String(inputs.meterReadingOld).replace(',', '.')), 0)} m³ = ${formatNumber(m3, 0)} m³`
            : `Gasvolumen = ${formatNumber(m3, 0)} m³`,
          `Thermische Energie = ${formatNumber(m3, 0)} m³ × ${formatNumber(bw, 2)} kWh/m³ × ${formatNumber(z, 4)} = ${formatNumber(kwh, 0)} kWh`,
          `Reine Verbrauchskosten = ${formatNumber(kwh, 0)} kWh × ${formatCurrency(price / 100, 3)}/kWh = ${formatCurrency(consumptionCost)} (ohne Grundpreis)`,
        ],
        basisSummary: [
          { label: 'Ermitteltes Gasvolumen', value: `${formatNumber(m3, 0)} m³` },
          { label: 'Brennwert (Hs)', value: `${formatNumber(bw, 2)} kWh/m³` },
          { label: 'Zustandszahl (z)', value: `${formatNumber(z, 4)}` },
          { label: 'Arbeitspreis', value: `${formatNumber(price, 1)} ct/kWh` },
          { label: 'Grundpreis', value: 'Nicht enthalten (siehe Gaskostenrechner)' },
        ],
      };
    },
    formula: 'Energie (kWh) = Kubikmeter (m³) × Brennwert × Zustandszahl (z)',
    formulaExplanation: 'Gaszähler messen das reine Betriebsvolumen in Kubikmetern (m³). Die thermische Abrechnung in Kilowattstunden (kWh) erfolgt nach DVGW-Arbeitsblatt G 685 über Brennwert und Zustandszahl. Die ausgewiesenen Kosten sind reine Verbrauchskosten (kWh × Arbeitspreis) ohne Berücksichtigung der verbrauchsunabhängigen Grundgebühr.',
    workedExample: {
      title: 'Beispiel 1: 1.000 m³ bei 10,8 kWh/m³ Brennwert und Zustandszahl 0,95',
      description: 'Verbrauchtes Gasvolumen: 1.000 m³. Brennwert: 10,8 kWh/m³, Zustandszahl: 0,95, Arbeitspreis: 11,0 ct/kWh.\n- Thermische Energie: 1.000 m³ × 10,8 kWh/m³ × 0,95 = 10.260 kWh\n- Reine Verbrauchskosten: 10.260 kWh × 0,11 €/kWh = 1.128,60 € (ohne Grundpreis)',
      inputValues: [{ label: 'Gasvolumen', value: '1.000 m³' }, { label: 'Brennwert Hs', value: '10,8 kWh/m³' }, { label: 'Zustandszahl z', value: '0,95' }, { label: 'Arbeitspreis', value: '11,0 ct/kWh' }],
      steps: ['Gasvolumen = 1.000 m³', 'Energie = 1.000 m³ × 10,8 × 0,95 = 10.260 kWh', 'Verbrauchskosten = 10.260 kWh × 0,11 €/kWh = 1.128,60 € (ohne Grundpreis)'],
      result: '10.260 kWh Energie (1.128,60 € reine Verbrauchskosten)',
      resultSummary: '10.260 kWh Energie (1.128,60 € reine Verbrauchskosten, exkl. Grundpreis)',
    },
    workedExamples: [
      {
        title: 'Beispiel 1: 1.000 m³ bei 10,8 kWh/m³ Brennwert und Zustandszahl 0,95',
        description: '1.000 m³ × 10,8 kWh/m³ × 0,95 = 10.260 kWh thermische Energie. Bei 11,0 ct/kWh betragen die reinen Verbrauchskosten 1.128,60 € (ohne Grundpreis).',
        inputs: { inputMode: 'volume', gasCubicMeters: 1000, brennwert: 10.8, zustandszahl: 0.95, gasPricePerKwh: 11.0 },
        resultSummary: '10.260 kWh (1.128,60 € reine Verbrauchskosten)',
      },
      {
        title: 'Beispiel 2: Zählerablesung (7.250 m³ auf 8.450 m³) bei 10,8 Brennwert, 0,95 z-Zahl & 11 ct/kWh',
        description: 'Zählerdifferenz: 8.450 − 7.250 = 1.200 m³. Thermische Energie: 1.200 m³ × 10,8 × 0,95 = 12.312 kWh. Reine Verbrauchskosten bei 11 ct/kWh: 1.354,32 € (feste Grundpreise des Versorgers kommen separat hinzu).',
        inputs: { inputMode: 'readings', meterReadingOld: 7250, meterReadingNew: 8450, brennwert: 10.8, zustandszahl: 0.95, gasPricePerKwh: 11.0 },
        resultSummary: '12.312 kWh (1.354,32 € reine Verbrauchskosten)',
      },
    ],
    content: {
      intro: 'Mit unserem kostenlosen Gasverbrauch-Rechner wandeln Sie abgelesene Kubikmeter (m³) Ihres Gaszählers physikalisch exakt in thermische Energie in Kilowattstunden (kWh) und die reinen Verbrauchskosten um. Gaszähler erfassen das Gasvolumen in Kubikmetern, Energieversorger rechnen die gelieferte Wärmemenge jedoch in Kilowattstunden ab. Für die vollständige Jahresabrechnung inklusive monatlicher Grundgebühren und Abschlagsplanung steht Ihnen unser [Gaskostenrechner](/rechner/gaskostenrechner/) zur Verfügung.',
      details: 'Die Umrechnung von Kubikmetern in Kilowattstunden erfolgt nach DVGW-Arbeitsblatt G 685 mit der Formel: Energie (kWh) = Volumen (m³) × Brennwert (Hs) × Zustandszahl (z). Der Brennwert beziffert den Energiegehalt (bei H-Gas meist 10,2 bis 11,5 kWh/m³, bei L-Gas ca. 8,5 bis 10,0 kWh/m³). Die Zustandszahl z bereinigt das Gasvolumen um Temperatur und den barometrischen Höhendruck Ihres Wohnorts (typisch ca. 0,90 bis 0,97). Wichtig: Die hier berechneten Kosten sind reine Verbrauchskosten des Arbeitspreises und enthalten keinen Grundpreis. Zudem spiegelt das Ergebnis genau den Zeitraum zwischen den beiden Ablesungen wider. Da rund 70 bis 80 % des Gasbedarfs auf das Winterhalbjahr entfallen, darf ein kürzerer Ablesezeitraum (z. B. ein Einzelmonat) nicht einfach linear auf ein ganzes Jahr hochgerechnet werden.',
    },
    faqs: [
      { question: 'Enthält das Ergebnis des Gasverbrauch-Rechners den Grundpreis?', answer: 'Nein. Dieser Rechner ermittelt die reinen verbrauchsabhängigen Kosten aus verbrauchten Kilowattstunden und Arbeitspreis. Feste monatliche Zähler- und Bereitstellungsgebühren Ihres Versorgers sind nicht enthalten. Nutzen Sie für die Gesamtkosten inklusive Grundpreis unseren [Gaskostenrechner](/rechner/gaskostenrechner/).' },
      { question: 'Darf ich eine Monatsablesung einfach mit 12 multiplizieren, um den Jahresverbrauch zu schätzen?', answer: 'Nein, das führt zu massiven Fehlern. Der Gasverbrauch zur Raumheizung ist extrem saisonabhängig: 70 bis 80 Prozent des Jahresgases werden zwischen Oktober und März verbraucht, während in den Sommermonaten fast nur Warmwasser anfällt. Ein Wintermonat mal 12 würde den Jahresverbrauch maßlos überschätzen, ein Sommermonat mal 12 drastisch unterschätzen.' },
      { question: 'Was bedeuten Brennwert (Hs) und Zustandszahl (z)?', answer: 'Der Brennwert (Hs in kWh/m³) gibt an, wie viel nutzbare Wärmeenergie in einem Normkubikmeter Gas enthalten ist. Die Zustandszahl (z) gleicht den lokalen Gasdruck und die Umgebungstemperatur an Ihrer Abnahmestelle an den Normzustand an. Beide Faktoren sind amtlich geprüft und stehen auf Ihrer Jahresabrechnung.' },
      { question: 'Bietet RechenHafen Live-Tarife oder einen Gaspreis-Vergleich an?', answer: 'Nein. RechenHafen bietet transparente, datenschutzfreundliche Berechnungswerkzeuge für Ihre persönlichen Rechnungs- und Zählerdaten, betreibt jedoch keinen kommerziellen Tarifvergleich mit Live-Marktdaten.' },
    ],
    relatedSlugs: ['gaskostenrechner', 'heizkostenvergleich-rechner', 'oelheizung-verbrauch-rechner', 'stromkostenrechner', 'waermepumpe-stromkosten-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'DVGW Regelwerk Arbeitsblatt G 685 & BDEW',
      sourceUrl: 'https://www.bdew.de',
      lastVerified: '2026-01-20',
    },
    trustMeta: {
      methodology: 'Thermische Gasabrechnung gemäß DVGW-Arbeitsblatt G 685 (Gasabrechnung).',
      assumptions: ['Arbeitspreis ohne Grundpreis; für Gesamtjahreskosten ist der jährliche Grundpreis des Versorgers hinzuzurechnen.'],
      limitations: ['Geringfügige monatliche Brennwertschwankungen des Netzbetreibers werden über den Jahresmittelwert abgerechnet.'],
      sourceName: 'Bundesverband der Energie- und Wasserwirtschaft (BDEW)',
      sourceUrl: 'https://www.bdew.de',
      lastReviewed: '2026-01-20',
    },
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
      const wp = inputs.modulePowerWp !== undefined && inputs.modulePowerWp !== '' ? Math.max(0, parseFloat(inputs.modulePowerWp) || 0) : 850;
      const cost = inputs.systemCost !== undefined && inputs.systemCost !== '' ? Math.max(0, parseFloat(inputs.systemCost) || 0) : 450;
      const ownPct = inputs.ownConsumptionPct !== undefined && inputs.ownConsumptionPct !== '' ? Math.max(0, Math.min(100, parseFloat(inputs.ownConsumptionPct) || 0)) / 100 : 0.75;
      const priceCent = inputs.electricityPrice !== undefined && inputs.electricityPrice !== '' ? Math.max(0, parseFloat(inputs.electricityPrice) || 0) : 36;
      // In Deutschland ca. 850 bis 1000 kWh Ertrag pro kWp je nach Ausrichtung
      const yearlyGenerationKwh = (wp / 1000) * 880;
      const usedKwh = yearlyGenerationKwh * ownPct;
      const yearlySaving = (usedKwh * priceCent) / 100;
      const amortYears = yearlySaving > 0 ? cost / yearlySaving : 0;
      return {
        primary: { id: 'yearlySaving', label: 'Jährliche Stromkostenersparnis', value: yearlySaving, formattedValue: formatCurrency(yearlySaving), highlight: true },
        secondary: [
          { id: 'amortYears', label: 'Amortisationszeit', value: amortYears, formattedValue: yearlySaving > 0 ? `ca. ${formatNumber(amortYears, 1)} Jahre` : 'Nicht amortisierbar' },
          { id: 'yearlyGenerationKwh', label: 'Solarstrom-Erzeugung pro Jahr', value: yearlyGenerationKwh, formattedValue: `${formatNumber(yearlyGenerationKwh, 0)} kWh` },
          { id: 'usedKwh', label: 'Selbst genutzter Strom', value: usedKwh, formattedValue: `${formatNumber(usedKwh, 0)} kWh` },
        ],
        summaryText: `Ihr Balkonkraftwerk erzeugt ca. ${formatNumber(yearlyGenerationKwh, 0)} kWh Strom. Bei ${formatPercent(ownPct * 100, 0)} Eigenverbrauch sparen Sie jährlich ${formatCurrency(yearlySaving)}${yearlySaving > 0 ? ` – bezahlt in ${formatNumber(amortYears, 1)} Jahren.` : '.'}`,
        directAnswer: yearlySaving > 0
          ? `Ein Balkonkraftwerk mit ${formatNumber(wp, 0)} Wp Modulleistung spart jährlich ca. ${formatCurrency(yearlySaving)} bei einer Amortisationszeit von rund ${formatNumber(amortYears, 1)} Jahren.`
          : 'Bei den gewählten Parametern ergibt sich keine jährliche Stromkostenersparnis.',
        basisSummary: [
          { label: 'Modulleistung', value: `${formatNumber(wp, 0)} Wp` },
          { label: 'Anschaffungspreis', value: formatCurrency(cost) },
          { label: 'Eigenverbrauch', value: formatPercent(ownPct * 100, 0) },
          { label: 'Strompreis', value: `${formatNumber(priceCent, 1)} ct/kWh` },
        ],
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
      const kwp = inputs.peakPowerKwp !== undefined && inputs.peakPowerKwp !== '' ? Math.max(0, parseFloat(inputs.peakPowerKwp) || 0) : 10;
      const cost = inputs.totalCost !== undefined && inputs.totalCost !== '' ? Math.max(0, parseFloat(inputs.totalCost) || 0) : 15500;
      const demand = inputs.householdDemandKwh !== undefined && inputs.householdDemandKwh !== '' ? Math.max(0, parseFloat(inputs.householdDemandKwh) || 0) : 4500;
      const selfPct = inputs.selfConsumptionPct !== undefined && inputs.selfConsumptionPct !== '' ? Math.max(0, Math.min(100, parseFloat(inputs.selfConsumptionPct) || 0)) / 100 : 0.35;
      const feedInPrice = (inputs.feedInTariffCent !== undefined && inputs.feedInTariffCent !== '' ? Math.max(0, parseFloat(inputs.feedInTariffCent) || 0) : 8.03) / 100;
      const gridPrice = (inputs.gridPriceCent !== undefined && inputs.gridPriceCent !== '' ? Math.max(0, parseFloat(inputs.gridPriceCent) || 0) : 36) / 100;
      const totalGen = kwp * 950; // ca. 950 kWh pro kWp im D-Schnitt
      const selfConsumed = totalGen * selfPct;
      const fedIn = Math.max(0, totalGen - selfConsumed);
      const savedGridCost = selfConsumed * gridPrice;
      const feedInRevenue = fedIn * feedInPrice;
      const totalYearlyBenefit = savedGridCost + feedInRevenue;
      const amortYears = totalYearlyBenefit > 0 ? cost / totalYearlyBenefit : 0;
      const autarkyPct = demand > 0 ? Math.min(100, (selfConsumed / demand) * 100) : 0;
      return {
        primary: { id: 'totalYearlyBenefit', label: 'Jährlicher finanzieller Ertrag (Ersparnis + Einspeisung)', value: totalYearlyBenefit, formattedValue: formatCurrency(totalYearlyBenefit), highlight: true },
        secondary: [
          { id: 'amortYears', label: 'Amortisationszeit', value: amortYears, formattedValue: totalYearlyBenefit > 0 ? `ca. ${formatNumber(amortYears, 1)} Jahre` : 'Nicht amortisierbar' },
          { id: 'savedGridCost', label: 'Eingesparte Stromkosten', value: savedGridCost, formattedValue: formatCurrency(savedGridCost) },
          { id: 'feedInRevenue', label: 'Einspeisevergütung Netzbetreiber', value: feedInRevenue, formattedValue: formatCurrency(feedInRevenue) },
          { id: 'autarkyPct', label: 'Autarkiegrad im Haushalt', value: autarkyPct, formattedValue: formatPercent(autarkyPct, 1) },
        ],
        summaryText: `Ihre ${formatNumber(kwp, 1)} kWp Anlage erwirtschaftet jährlich ca. ${formatCurrency(totalYearlyBenefit)} (${formatCurrency(savedGridCost)} Ersparnis + ${formatCurrency(feedInRevenue)} Einspeisevergütung). Die Anlage amortisiert sich in ca. ${totalYearlyBenefit > 0 ? `${formatNumber(amortYears, 1)} Jahren` : 'n/a'}.`,
        directAnswer: totalYearlyBenefit > 0
          ? `Ihre ${formatNumber(kwp, 1)} kWp PV-Anlage erzielt einen finanziellen Gesamtnutzen von ca. ${formatCurrency(totalYearlyBenefit)} pro Jahr (Amortisation in rund ${formatNumber(amortYears, 1)} Jahren).`
          : 'Bei den gewählten Parametern ergibt sich kein messbarer Jahresnutzen.',
        basisSummary: [
          { label: 'Anlagengröße', value: `${formatNumber(kwp, 1)} kWp` },
          { label: 'Investition', value: formatCurrency(cost) },
          { label: 'Eigenverbrauch', value: formatPercent(selfPct * 100, 0) },
          { label: 'Bezugsstrompreis', value: `${formatNumber(gridPrice * 100, 1)} ct/kWh` },
          { label: 'Einspeisevergütung', value: `${formatNumber(feedInPrice * 100, 2)} ct/kWh` },
        ],
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
      const heat = inputs.heatDemandKwh !== undefined && inputs.heatDemandKwh !== '' ? Math.max(0, parseFloat(inputs.heatDemandKwh) || 0) : 16000;
      const jaz = inputs.jaz !== undefined && inputs.jaz !== '' ? Math.max(0.1, parseFloat(inputs.jaz) || 0.1) : 3.5;
      const price = inputs.heatElectricityPriceCent !== undefined && inputs.heatElectricityPriceCent !== '' ? Math.max(0, parseFloat(inputs.heatElectricityPriceCent) || 0) : 28;
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
        summaryText: `Für ${formatNumber(heat, 0)} kWh Wärme benötigt die Wärmepumpe bei JAZ ${formatNumber(jaz, 1)} ca. ${formatNumber(electricityKwh, 0)} kWh Strom. Das ergibt jährliche Heizkosten von ${formatCurrency(yearlyCost)}.`,
        directAnswer: `Für ${formatNumber(heat, 0)} kWh Nutzwärme entstehen jährliche Heizstromkosten von ca. ${formatCurrency(yearlyCost)} (${formatCurrency(monthlyCost)} pro Monat) bei einer JAZ von ${formatNumber(jaz, 1)}.`,
        basisSummary: [
          { label: 'Wärmebedarf', value: `${formatNumber(heat, 0)} kWh` },
          { label: 'Jahresarbeitszahl (JAZ)', value: formatNumber(jaz, 2) },
          { label: 'Heizstrompreis', value: `${formatNumber(price, 1)} ct/kWh` },
        ],
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
    name: 'Heizkostenvergleich-Rechner (Wärmepumpe, Gas, Öl, Pellets, Fernwärme)',
    shortName: 'Heizkostenvergleich',
    category: 'haushalt-energie',
    subcategory: 'Heizung & Gas',
    metaTitle: 'Heizkostenvergleich Rechner – Wärmepumpe, Gas, Öl, Pellets & Fernwärme',
    metaDescription: 'Vergleichen Sie die jährlichen Brennstoffkosten, Wartungsausgaben und CO2-Emissionen moderner Heizsysteme bei identischem Nutzwärmebedarf.',
    h1: 'Heizkostenvergleich Rechner – Heizsysteme, Kosten & CO2 vergleichen',
    shortDescription: 'Vergleicht die jährlichen Brennstoff- und Betriebskosten sowie die CO2-Emissionen von Wärmepumpe, Gas, Öl, Pellets und Fernwärme bei gleichem Nutzwärmebedarf.',
    searchKeywords: ['heizkostenvergleich rechner', 'waermepumpe vs gasheizung kosten', 'heizoel pellets vergleich kwh', 'fernwaerme kosten vergleich', 'co2 heizung vergleich'],
    inputs: [
      { id: 'heatDemandKwh', label: 'Jährlicher Nutzwärmebedarf des Gebäudes in kWh', type: 'number', defaultValue: 18000, min: 1000, max: 200000, step: 1000, unit: 'kWh' },
      { id: 'gasPriceCent', label: 'Gaspreis in Cent pro kWh (Brennwertbezogen)', type: 'number', defaultValue: 11.0, min: 4, max: 35, step: 0.5, unit: 'ct/kWh' },
      { id: 'oilPricePerLiter', label: 'Heizölpreis in Euro pro Liter', type: 'number', defaultValue: 1.05, min: 0.5, max: 3.0, step: 0.05, unit: '€/Liter' },
      { id: 'pelletPricePerTon', label: 'Holzpellets Preis in Euro pro Tonne', type: 'number', defaultValue: 320, min: 150, max: 800, step: 10, unit: '€/t' },
      { id: 'heatPumpJaz', label: 'Wärmepumpe Jahresarbeitszahl (JAZ)', type: 'number', defaultValue: 3.6, min: 1.5, max: 6.0, step: 0.1 },
      { id: 'heatPumpPowerPrice', label: 'Wärmepumpenstrom-Tarif in Cent pro kWh', type: 'number', defaultValue: 28, min: 15, max: 55, step: 1, unit: 'ct/kWh' },
      { id: 'districtHeatingPriceCent', label: 'Fernwärmepreis in Cent pro kWh', type: 'number', defaultValue: 12.5, min: 5, max: 35, step: 0.5, unit: 'ct/kWh' },
      { id: 'includeMaintenance', label: 'Jährliche Schornsteinfeger- & Wartungskosten einbeziehen', type: 'boolean', defaultValue: false },
    ],
    calculate: (inputs) => {
      const demand = inputs.heatDemandKwh !== undefined && inputs.heatDemandKwh !== '' ? Math.max(0, parseFloat(inputs.heatDemandKwh) || 0) : 18000;
      const gasCent = inputs.gasPriceCent !== undefined && inputs.gasPriceCent !== '' ? Math.max(0, parseFloat(inputs.gasPriceCent) || 0) : 11.0;
      const oilLiter = inputs.oilPricePerLiter !== undefined && inputs.oilPricePerLiter !== '' ? Math.max(0, parseFloat(inputs.oilPricePerLiter) || 0) : 1.05;
      const pelletTon = inputs.pelletPricePerTon !== undefined && inputs.pelletPricePerTon !== '' ? Math.max(0, parseFloat(inputs.pelletPricePerTon) || 0) : 320;
      const jaz = inputs.heatPumpJaz !== undefined && inputs.heatPumpJaz !== '' ? Math.max(0.1, parseFloat(inputs.heatPumpJaz) || 0.1) : 3.6;
      const wpCent = inputs.heatPumpPowerPrice !== undefined && inputs.heatPumpPowerPrice !== '' ? Math.max(0, parseFloat(inputs.heatPumpPowerPrice) || 0) : 28;
      const fwCent = inputs.districtHeatingPriceCent !== undefined && inputs.districtHeatingPriceCent !== '' ? Math.max(0, parseFloat(inputs.districtHeatingPriceCent) || 0) : 12.5;
      const withMaint = Boolean(inputs.includeMaintenance);

      // Wartungspauschalen pro Jahr
      const maintWp = withMaint ? 100 : 0;
      const maintGas = withMaint ? 180 : 0;
      const maintOil = withMaint ? 240 : 0;
      const maintPellet = withMaint ? 300 : 0;
      const maintFw = withMaint ? 50 : 0;

      // 1. Wärmepumpe (Strombedarf = Nutzwärme / JAZ)
      const wpPowerKwh = demand / jaz;
      const wpEnergyCost = (wpPowerKwh * wpCent) / 100;
      const wpTotal = wpEnergyCost + maintWp;
      // Emissionen: UBA Strommix 2025 (344 g CO2/kWh Erzeugung, 410 g CO2e/kWh Well-to-Wheel)
      const wpCo2Tonnes = (wpPowerKwh * 0.410) / 1000;

      // 2. Gasbrennwert (Nutzungsgrad ca. 92% bezogen auf Ho)
      const gasBrennstoffKwh = demand / 0.92;
      const gasEnergyCost = (gasBrennstoffKwh * gasCent) / 100;
      const gasTotal = gasEnergyCost + maintGas;
      // Emissionen: 240 g CO2e/kWh inkl. Vorkette
      const gasCo2Tonnes = (gasBrennstoffKwh * 0.240) / 1000;

      // 3. Öl-Brennwert (ca. 10 kWh/l Heizwert, Nutzungsgrad ca. 88%)
      const oilLiters = demand / (10 * 0.88);
      const oilEnergyCost = oilLiters * oilLiter;
      const oilTotal = oilEnergyCost + maintOil;
      // Emissionen: 3,10 kg CO2e/l inkl. Vorkette
      const oilCo2Tonnes = (oilLiters * 3.10) / 1000;

      // 4. Holzpellets (ca. 4.900 kWh/Tonne, Nutzungsgrad ca. 90%)
      const pelletTons = demand / (4900 * 0.90);
      const pelletEnergyCost = pelletTons * pelletTon;
      const pelletTotal = pelletEnergyCost + maintPellet;
      // Emissionen: Fossile Vorkette 0,027 kg CO2e/kWh (biogenes CO2 neutral)
      const pelletCo2Tonnes = ((demand / 0.90) * 0.027) / 1000;

      // 5. Fernwärme (Übergabewirkungsgrad ca. 98%)
      const fwKwh = demand / 0.98;
      const fwEnergyCost = (fwKwh * fwCent) / 100;
      const fwTotal = fwEnergyCost + maintFw;
      // Emissionen: Bundesweiter Fernwärmemix ca. 0,160 kg CO2e/kWh
      const fwCo2Tonnes = (fwKwh * 0.160) / 1000;

      return {
        primary: {
          id: 'wpCost',
          label: 'Kosten Wärmepumpe pro Jahr',
          value: wpTotal,
          formattedValue: formatCurrency(wpTotal),
          highlight: true,
          helpText: withMaint ? 'Inklusive 100 € jährlicher Wartungspauschale.' : 'Reine Strombetriebskosten.',
        },
        secondary: [
          { id: 'gasCost', label: 'Kosten Gasheizung', value: gasTotal, formattedValue: formatCurrency(gasTotal) },
          { id: 'fwCost', label: 'Kosten Fernwärme', value: fwTotal, formattedValue: formatCurrency(fwTotal) },
          { id: 'pelletCost', label: 'Kosten Pelletheizung', value: pelletTotal, formattedValue: formatCurrency(pelletTotal) },
          { id: 'oilCost', label: 'Kosten Ölheizung', value: oilTotal, formattedValue: formatCurrency(oilTotal) },
        ],
        breakdown: {
          columns: [
            { key: 'system', label: 'Heizsystem' },
            { key: 'fuelCost', label: 'Brennstoff / Strom' },
            { key: 'maintenance', label: 'Wartung / Schornsteinfeger' },
            { key: 'total', label: 'Gesamtkosten / Jahr' },
            { key: 'emissions', label: 'Treibhausgase (CO₂e/Jahr)' },
          ],
          rows: [
            {
              period: 1,
              values: {
                system: `Wärmepumpe (JAZ ${formatNumber(jaz, 1)})`,
                fuelCost: formatCurrency(wpEnergyCost),
                maintenance: formatCurrency(maintWp),
                total: formatCurrency(wpTotal),
                emissions: `${formatNumber(wpCo2Tonnes, 2)} t CO₂e`,
              },
            },
            {
              period: 2,
              values: {
                system: 'Pelletheizung (modern)',
                fuelCost: formatCurrency(pelletEnergyCost),
                maintenance: formatCurrency(maintPellet),
                total: formatCurrency(pelletTotal),
                emissions: `${formatNumber(pelletCo2Tonnes, 2)} t CO₂e`,
              },
            },
            {
              period: 3,
              values: {
                system: 'Fernwärme (Übergabestation)',
                fuelCost: formatCurrency(fwEnergyCost),
                maintenance: formatCurrency(maintFw),
                total: formatCurrency(fwTotal),
                emissions: `${formatNumber(fwCo2Tonnes, 2)} t CO₂e`,
              },
            },
            {
              period: 4,
              values: {
                system: 'Gas-Brennwertkessel',
                fuelCost: formatCurrency(gasEnergyCost),
                maintenance: formatCurrency(maintGas),
                total: formatCurrency(gasTotal),
                emissions: `${formatNumber(gasCo2Tonnes, 2)} t CO₂e`,
              },
            },
            {
              period: 5,
              values: {
                system: 'Öl-Brennwertkessel',
                fuelCost: formatCurrency(oilEnergyCost),
                maintenance: formatCurrency(maintOil),
                total: formatCurrency(oilTotal),
                emissions: `${formatNumber(oilCo2Tonnes, 2)} t CO₂e`,
              },
            },
          ],
        },
        directAnswer: `Bei einem Nutzwärmebedarf von ${formatNumber(demand, 0)} kWh verursacht die Wärmepumpe jährlich ca. ${formatCurrency(wpTotal)} (${formatNumber(wpCo2Tonnes, 2)} t CO₂e), verglichen mit ${formatCurrency(fwTotal)} (Fernwärme), ${formatCurrency(pelletTotal)} (Pellets), ${formatCurrency(gasTotal)} (Gas) und ${formatCurrency(oilTotal)} (Öl).`,
        summaryText: `Bei ${formatNumber(demand, 0)} kWh Nutzwärmebedarf liegen die jährlichen Gesamtkosten bei ca. ${formatCurrency(wpTotal)} (Wärmepumpe), ${formatCurrency(fwTotal)} (Fernwärme), ${formatCurrency(pelletTotal)} (Pellets), ${formatCurrency(gasTotal)} (Gas) und ${formatCurrency(oilTotal)} (Öl).`,
        basisSummary: [
          { label: 'Nutzwärmebedarf', value: `${formatNumber(demand, 0)} kWh` },
          { label: 'Wärmepumpenstrom', value: `${formatNumber(wpCent, 1)} ct/kWh bei JAZ ${formatNumber(jaz, 1)}` },
          { label: 'Gaspreis', value: `${formatNumber(gasCent, 1)} ct/kWh` },
          { label: 'Fernwärmepreis', value: `${formatNumber(fwCent, 1)} ct/kWh` },
          { label: 'Heizölpreis', value: `${formatCurrency(oilLiter)}/l` },
          { label: 'Pelletpreis', value: `${formatCurrency(pelletTon)}/t` },
          { label: 'Wartungskosten', value: withMaint ? 'Einbezogen (Pauschalwerte)' : 'Nicht einbezogen (reine Brennstoffkosten)' },
        ],
        calculationSteps: [
          `Wärmepumpe: (${formatNumber(demand, 0)} kWh ÷ ${formatNumber(jaz, 1)}) × ${formatNumber(wpCent, 1)} ct = ${formatCurrency(wpEnergyCost)} Strom + ${formatCurrency(maintWp)} Wartung = ${formatCurrency(wpTotal)}`,
          `Fernwärme: (${formatNumber(demand, 0)} kWh ÷ 0,98) × ${formatNumber(fwCent, 1)} ct = ${formatCurrency(fwEnergyCost)} Wärme + ${formatCurrency(maintFw)} Wartung = ${formatCurrency(fwTotal)}`,
          `Gas-Brennwert: (${formatNumber(demand, 0)} kWh ÷ 0,92) × ${formatNumber(gasCent, 1)} ct = ${formatCurrency(gasEnergyCost)} Gas + ${formatCurrency(maintGas)} Wartung = ${formatCurrency(gasTotal)}`,
          `Holzpellets: (${formatNumber(demand, 0)} kWh ÷ (4.900 kWh/t × 0,90)) = ${formatNumber(pelletTons, 2)} t × ${formatCurrency(pelletTon)} = ${formatCurrency(pelletEnergyCost)} + ${formatCurrency(maintPellet)} Wartung = ${formatCurrency(pelletTotal)}`,
          `Öl-Brennwert: (${formatNumber(demand, 0)} kWh ÷ (10 kWh/l × 0,88)) = ${formatNumber(oilLiters, 0)} l × ${formatCurrency(oilLiter)} = ${formatCurrency(oilEnergyCost)} + ${formatCurrency(maintOil)} Wartung = ${formatCurrency(oilTotal)}`,
        ],
        qualifications: [
          'Emissionen werden einheitlich auf Well-to-Wheel Lebenszyklus-Basis (CO₂e inkl. Vorkette nach UBA GEMIS) verglichen.',
          'Anschaffungs- und Investitionskosten (Heizungstausch) sind in diesem jährlichen Betriebs- und Verbrauchskostenvergleich nicht enthalten.',
          'Wärmepumpen mit zertifiziertem 100% Ökostrom emittieren im Betrieb 0 g direkte Emissionen und ca. 0,12 t CO₂e/Jahr in der Anlagenvorkette.',
        ],
      };
    },
    formula: 'Jahreskosten = (Nutzwärmebedarf / Jahresnutzungsgrad) × Brennstoffpreis + Wartung',
    formulaExplanation: 'Der Nutzwärmebedarf wird über den feuerungstechnischen Nutzungsgrad bzw. die Jahresarbeitszahl (JAZ) in den tatsächlichen Endenergiebedarf umgerechnet und mit den Tarifpreisen sowie CO₂e-Emissionsfaktoren multipliziert.',
    workedExample: {
      title: 'Beispiel: 18.000 kWh Nutzwärmebedarf im Einfamilienhaus',
      description: 'Vergleich der jährlichen Energiekosten zwischen Wärmepumpe (JAZ 3,6 bei 28 ct), Fernwärme (12,5 ct), Gas (11 ct), Pellets (320 €/t) und Öl (1,05 €/l).',
      inputs: { heatDemandKwh: 18000, gasPriceCent: 11, oilPricePerLiter: 1.05, pelletPricePerTon: 320, heatPumpJaz: 3.6, heatPumpPowerPrice: 28, districtHeatingPriceCent: 12.5, includeMaintenance: false },
      resultSummary: 'Wärmepumpe: ca. 1.400,00 € (spart ca. 752 € ggü. Gas und 746 € ggü. Öl)',
    },
    content: {
      intro: 'Dieser Systemvergleich stellt die jährlichen Brennstoff- und Betriebskosten sowie die Treibhausgasemissionen von fünf gängigen Heiztechnologien (Wärmepumpe, Fernwärme, Holzpellets, Gasbrennwert, Ölbrennwert) transparent gegenüber.',
      details: 'Der Rechner normiert die Brennstoffpreise auf den realen Nutzwärmebedarf des Gebäudes unter Berücksichtigung des Wirkungsgrads und der Jahresarbeitszahl. Die Treibhausgase werden auf einheitlicher Lebenszyklusbasis (Well-to-Wheel nach UBA GEMIS) verglichen.',
    },
    faqs: [
      { question: 'Wie wird Nutzwärme in Brennstoffbedarf umgerechnet?', answer: 'Der Nutzwärmebedarf ist die Wärmeenergie, die tatsächlich den Wohnräumen zugutekommt. Da jede Heizung Wandlungs- und Abgasverluste aufweist, muss mehr Energie zugeführt werden: Gasbrennwert arbeitet mit ca. 92 % Jahresnutzungsgrad, Ölbrennwert mit ca. 88 %, moderne Pelletkessel mit ca. 90 % und Fernwärme-Übergabestationen mit ca. 98 %. Bei einer Wärmepumpe wird Umweltwärme genutzt: Eine JAZ von 3,6 erzeugt aus 1 kWh Strom 3,6 kWh Nutzwärme.' },
      { question: 'Wie entwickelt sich der CO₂-Preis für fossile Heizungen?', answer: 'Nach dem Brennstoffemissionshandelsgesetz (BEHG) steigt der nationale CO₂-Preis 2026 im Korridor von 55 bis 65 € pro Tonne. Ab 2027 greift der europäische Emissionshandel ETS-2, wodurch sich fossile Brennstoffe wie Gas und Heizöl schrittweise weiter verteuern.' },
      { question: 'Welche Fördermittel gibt es für den Umstieg auf erneuerbare Heizungen?', answer: 'Über die Bundesförderung für effiziente Gebäude (KfW-Programm 458) erhalten selbstnutzende Eigentümer beim Tausch einer alten fossilen Heizung gegen eine Wärmepumpe oder Biomasseheizung bis zu 70 % der förderfähigen Kosten bezuschusst (Grundförderung 30 % + Klimageschwindigkeitsbonus 20 % + Einkommensbonus 30 %, maximal gedeckelt).' },
    ],
    relatedSlugs: ['gaskostenrechner', 'gasverbrauch-kwh-m3-rechner', 'oelheizung-verbrauch-rechner', 'pelletheizung-verbrauch-rechner', 'waermepumpe-stromkosten-rechner', 'co2-preis-rechner'],
    trustMeta: {
      methodology: 'Physikalische Wirkungsgradberechnung auf Nutzwärmebasis und UBA-Lebenszyklus-Emissionsfaktoren (GEMIS)',
      sourceName: 'Umweltbundesamt (UBA) & Bundesverband Wärmepumpe (BWP)',
      lastReviewed: '2026-10-21',
    },
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
      const p = inputs.persons !== undefined && inputs.persons !== '' ? Math.max(0, parseInt(inputs.persons, 10) || 0) : 3;
      const mins = inputs.showerMinutesPerPerson !== undefined && inputs.showerMinutesPerPerson !== '' ? Math.max(0, parseFloat(inputs.showerMinutesPerPerson) || 0) : 7;
      const kw = inputs.powerKw !== undefined && inputs.powerKw !== '' ? Math.max(0, parseFloat(inputs.powerKw) || 0) : 21;
      const priceCent = inputs.electricityPrice !== undefined && inputs.electricityPrice !== '' ? Math.max(0, parseFloat(inputs.electricityPrice) || 0) : 36;
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
        directAnswer: `Die jährlichen Warmwasserkosten für ${p} ${p === 1 ? 'Person' : 'Personen'} betragen ca. ${formatCurrency(yearlyCost)} (${formatCurrency(costPerShower)} pro Duschgang).`,
        basisSummary: [
          { label: 'Personen', value: `${p}` },
          { label: 'Duschdauer pro Tag', value: `${formatNumber(mins, 1)} Min.` },
          { label: 'Leistung Durchlauferhitzer', value: `${formatNumber(kw, 0)} kW` },
          { label: 'Strompreis', value: `${formatNumber(priceCent, 1)} ct/kWh` },
        ],
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
      const oldKwh = inputs.oldConsumptionKwh !== undefined && inputs.oldConsumptionKwh !== '' ? Math.max(0, parseFloat(inputs.oldConsumptionKwh) || 0) : 320;
      const newKwh = inputs.newConsumptionKwh !== undefined && inputs.newConsumptionKwh !== '' ? Math.max(0, parseFloat(inputs.newConsumptionKwh) || 0) : 115;
      const price = inputs.newAppliancePrice !== undefined && inputs.newAppliancePrice !== '' ? Math.max(0, parseFloat(inputs.newAppliancePrice) || 0) : 650;
      const electricityCent = inputs.electricityPrice !== undefined && inputs.electricityPrice !== '' ? Math.max(0, parseFloat(inputs.electricityPrice) || 0) : 36;
      const oldCost = (oldKwh * electricityCent) / 100;
      const newCost = (newKwh * electricityCent) / 100;
      const yearlySaving = oldCost - newCost;
      const amortYears = yearlySaving > 0 ? (price > 0 ? price / yearlySaving : 0) : 999;
      return {
        primary: { id: 'yearlySaving', label: 'Jährliche Stromkostenersparnis', value: yearlySaving, formattedValue: formatCurrency(yearlySaving), highlight: true },
        secondary: [
          { id: 'oldCost', label: 'Bisherige Stromkosten pro Jahr', value: oldCost, formattedValue: formatCurrency(oldCost) },
          { id: 'newCost', label: 'Stromkosten des Neugeräts pro Jahr', value: newCost, formattedValue: formatCurrency(newCost) },
          { id: 'amortYears', label: 'Amortisation des Neukaufs', value: amortYears, formattedValue: price === 0 ? 'Bereits bezahlt / 0 Jahre' : (yearlySaving > 0 ? `ca. ${formatNumber(amortYears, 1)} Jahre` : 'Keine Amortisation') },
        ],
        summaryText: `Das Neugerät spart jährlich ${formatNumber(oldKwh - newKwh, 0)} kWh Strom ein. Sie sparen dadurch ${formatCurrency(yearlySaving)} pro Jahr${price > 0 && yearlySaving > 0 ? ` und amortisieren den Kauf in ${formatNumber(amortYears, 1)} Jahren` : ''}.`,
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
      const kwh = inputs.kwhPerWash !== undefined && inputs.kwhPerWash !== '' ? Math.max(0, parseFloat(inputs.kwhPerWash) || 0) : 0.85;
      const liters = inputs.waterPerWashLiters !== undefined && inputs.waterPerWashLiters !== '' ? Math.max(0, parseFloat(inputs.waterPerWashLiters) || 0) : 50;
      const weekly = inputs.washesPerWeek !== undefined && inputs.washesPerWeek !== '' ? Math.max(0, parseInt(inputs.washesPerWeek, 10) || 0) : 4;
      const detergent = inputs.detergentCost !== undefined && inputs.detergentCost !== '' ? Math.max(0, parseFloat(inputs.detergentCost) || 0) : 0.22;
      const eleCent = inputs.electricityPrice !== undefined && inputs.electricityPrice !== '' ? Math.max(0, parseFloat(inputs.electricityPrice) || 0) : 36;
      const waterM3 = inputs.waterPricePerM3 !== undefined && inputs.waterPricePerM3 !== '' ? Math.max(0, parseFloat(inputs.waterPricePerM3) || 0) : 4.80;
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
      const weekly = inputs.cyclesPerWeek !== undefined && inputs.cyclesPerWeek !== '' ? Math.max(0, parseInt(inputs.cyclesPerWeek, 10) || 0) : 3;
      const priceCent = inputs.electricityPrice !== undefined && inputs.electricityPrice !== '' ? Math.max(0, parseFloat(inputs.electricityPrice) || 0) : 36;
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
      const kwh = inputs.kwhPerCycle !== undefined && inputs.kwhPerCycle !== '' ? Math.max(0, parseFloat(inputs.kwhPerCycle) || 0) : 0.82;
      const liters = inputs.waterPerCycleLiters !== undefined && inputs.waterPerCycleLiters !== '' ? Math.max(0, parseFloat(inputs.waterPerCycleLiters) || 0) : 10;
      const weekly = inputs.cyclesPerWeek !== undefined && inputs.cyclesPerWeek !== '' ? Math.max(0, parseInt(inputs.cyclesPerWeek, 10) || 0) : 5;
      const tab = inputs.tabCost !== undefined && inputs.tabCost !== '' ? Math.max(0, parseFloat(inputs.tabCost) || 0) : 0.15;
      const eleCent = inputs.electricityPrice !== undefined && inputs.electricityPrice !== '' ? Math.max(0, parseFloat(inputs.electricityPrice) || 0) : 36;
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
      const pWatts = inputs.screenPowerWatts !== undefined && inputs.screenPowerWatts !== '' ? Math.max(0, parseFloat(inputs.screenPowerWatts) || 0) : 120;
      const hours = inputs.dailyHours !== undefined && inputs.dailyHours !== '' ? Math.max(0, parseFloat(inputs.dailyHours) || 0) : 4;
      const sWatts = inputs.standbyWatts !== undefined && inputs.standbyWatts !== '' ? Math.max(0, parseFloat(inputs.standbyWatts) || 0) : 1.0;
      const priceCent = inputs.electricityPrice !== undefined && inputs.electricityPrice !== '' ? Math.max(0, parseFloat(inputs.electricityPrice) || 0) : 36;
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
      const count = inputs.lampCount !== undefined && inputs.lampCount !== '' ? Math.max(0, parseInt(inputs.lampCount, 10) || 0) : 10;
      const oldW = inputs.oldWatts !== undefined && inputs.oldWatts !== '' ? Math.max(0, parseFloat(inputs.oldWatts) || 0) : 60;
      const newW = inputs.newWatts !== undefined && inputs.newWatts !== '' ? Math.max(0, parseFloat(inputs.newWatts) || 0) : 8;
      const hours = inputs.burnHoursPerDay !== undefined && inputs.burnHoursPerDay !== '' ? Math.max(0, parseFloat(inputs.burnHoursPerDay) || 0) : 3.5;
      const priceCent = inputs.electricityPrice !== undefined && inputs.electricityPrice !== '' ? Math.max(0, parseFloat(inputs.electricityPrice) || 0) : 36;
      const savedWattsPerLamp = Math.max(0, oldW - newW);
      const savedKwhYear = (savedWattsPerLamp * hours * 365 * count) / 1000;
      const yearlySaving = (savedKwhYear * priceCent) / 100;
      const pctSaved = oldW > 0 ? (savedWattsPerLamp / oldW) * 100 : 0;
      return {
        primary: { id: 'yearlySaving', label: 'Jährliche Stromersparnis', value: yearlySaving, formattedValue: formatCurrency(yearlySaving), highlight: true },
        secondary: [
          { id: 'savedKwhYear', label: 'Eingesparter Strom pro Jahr', value: savedKwhYear, formattedValue: `${formatNumber(savedKwhYear, 0)} kWh` },
          { id: 'pctSaved', label: 'Energieersparnis Beleuchtung', value: pctSaved, formattedValue: formatPercent(pctSaved, 0) },
          { id: 'saving5Years', label: 'Ersparnis über 5 Jahre', value: yearlySaving * 5, formattedValue: formatCurrency(yearlySaving * 5) },
        ],
        summaryText: `Durch den Tausch von ${count} Lampen sparen Sie ${formatPercent(pctSaved, 0)} Beleuchtungsstrom ein. Das spart jährlich ${formatCurrency(yearlySaving)} (${formatNumber(savedKwhYear, 0)} kWh).`,
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
    metaTitle: 'Wasserverbrauch Rechner – Kosten & m³ pro Person berechnen',
    metaDescription: 'Wasserverbrauch und Kosten für Haushalte kostenlos berechnen: Kubikmeter (m³), Liter pro Tag, verbrauchsabhängige Gebühren und monatlicher Durchschnitt.',
    h1: 'Wasserverbrauch Rechner – Kosten & Kubikmeter (m³) berechnen',
    shortDescription: 'Schätzt den jährlichen Wasserverbrauch in m³ und Litern sowie die Gebühren für Trink- und Schmutzwasser basierend auf Haushaltsgröße und örtlichen Tarifen.',
    searchKeywords: ['wasserverbrauch rechner haushalt', 'wasserkosten pro person durchschnitt', 'abwasserkosten kubikmeter rechner', 'wasserverbrauch m3 in liter', 'wasserverbrauch berechnen kostenlos'],
    inputs: [
      {
        id: 'persons',
        label: 'Personen im Haushalt',
        type: 'number',
        defaultValue: 3,
        min: 1,
        max: 50,
        step: 1,
        unit: 'Personen',
        helpText: 'Positive ganze Zahl (mindestens 1 Person)',
      },
      {
        id: 'dailyLitersPerPerson',
        label: 'Täglicher Wasserverbrauch pro Person in Litern',
        type: 'number',
        defaultValue: 125,
        min: 0,
        max: 1000,
        step: 5,
        unit: 'Liter/Tag',
        helpText: 'Bundesweiter Richtwert: ca. 125 bis 128 Liter pro Kopf und Tag (Quelle: BDEW 2024 / Destatis)',
      },
      {
        id: 'freshWaterPrice',
        label: 'Trinkwasserpreis pro m³ (Frischwasser in €)',
        type: 'number',
        defaultValue: 2.10,
        min: 0,
        max: 25,
        step: 0.05,
        unit: '€/m³',
        helpText: 'Arbeitspreis für Trinkwasser laut Abrechnung (0,00 € z. B. bei eigenem Brunnen)',
      },
      {
        id: 'wasteWaterPrice',
        label: 'Schmutzwassergebühr / Abwasserpreis pro m³ (in €)',
        type: 'number',
        defaultValue: 2.70,
        min: 0,
        max: 25,
        step: 0.05,
        unit: '€/m³',
        helpText: 'Kanalgebühr für Schmutzwasser laut Bescheid (0,00 € z. B. bei Versickerung/Klärgrube)',
      },
      {
        id: 'fixedFeeYear',
        label: 'Jährlicher Zählergrundpreis / Bereitstellungsgebühr (optional in €)',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 500,
        step: 5,
        unit: '€/Jahr',
        helpText: 'Feste jährliche Zählergebühr Ihres Versorgers (0 € falls unbekannt oder im Kubikmeterpreis enthalten)',
      },
    ],
    calculate: (inputs: Record<string, any>) => {
      if (inputs.persons === undefined || inputs.persons === null || String(inputs.persons).trim() === '') {
        return {
          primary: { id: 'totalYearlyCost', label: 'Geschätzte jährliche Wasserkosten', value: 0, formattedValue: '–' },
          error: 'Bitte geben Sie die Anzahl der Personen im Haushalt ein.',
        };
      }
      const rawP = String(inputs.persons).trim().replace(',', '.');
      const pNum = Number(rawP);
      if (!Number.isFinite(pNum) || pNum < 1 || !Number.isInteger(pNum)) {
        return {
          primary: { id: 'totalYearlyCost', label: 'Geschätzte jährliche Wasserkosten', value: 0, formattedValue: '–' },
          error: 'Bitte geben Sie die Personenzahl als positive ganze Zahl ein (z. B. 1, 2, 3 Personen; Bruchteile sind nicht zulässig).',
        };
      }
      const p = pNum;

      if (inputs.dailyLitersPerPerson === undefined || inputs.dailyLitersPerPerson === null || String(inputs.dailyLitersPerPerson).trim() === '') {
        return {
          primary: { id: 'totalYearlyCost', label: 'Geschätzte jährliche Wasserkosten', value: 0, formattedValue: '–' },
          error: 'Bitte geben Sie den täglichen Pro-Kopf-Wasserverbrauch an (0 Liter bei Leerstand).',
        };
      }
      const rawLiters = String(inputs.dailyLitersPerPerson).trim().replace(',', '.');
      const liters = parseFloat(rawLiters);
      if (!Number.isFinite(liters) || liters < 0) {
        return {
          primary: { id: 'totalYearlyCost', label: 'Geschätzte jährliche Wasserkosten', value: 0, formattedValue: '–' },
          error: 'Der tägliche Wasserverbrauch darf nicht negativ sein.',
        };
      }

      if (inputs.freshWaterPrice === undefined || inputs.freshWaterPrice === null || String(inputs.freshWaterPrice).trim() === '') {
        return {
          primary: { id: 'totalYearlyCost', label: 'Geschätzte jährliche Wasserkosten', value: 0, formattedValue: '–' },
          error: 'Bitte geben Sie den Trinkwasserpreis pro Kubikmeter an (0,00 € falls keine Gebühr anfällt).',
        };
      }
      const rawFresh = String(inputs.freshWaterPrice).trim().replace(',', '.');
      const freshP = parseFloat(rawFresh);
      if (!Number.isFinite(freshP) || freshP < 0) {
        return {
          primary: { id: 'totalYearlyCost', label: 'Geschätzte jährliche Wasserkosten', value: 0, formattedValue: '–' },
          error: 'Der Trinkwasserpreis darf nicht negativ sein.',
        };
      }

      if (inputs.wasteWaterPrice === undefined || inputs.wasteWaterPrice === null || String(inputs.wasteWaterPrice).trim() === '') {
        return {
          primary: { id: 'totalYearlyCost', label: 'Geschätzte jährliche Wasserkosten', value: 0, formattedValue: '–' },
          error: 'Bitte geben Sie die Schmutzwassergebühr pro Kubikmeter an (0,00 € falls keine Gebühr anfällt).',
        };
      }
      const rawWaste = String(inputs.wasteWaterPrice).trim().replace(',', '.');
      const wasteP = parseFloat(rawWaste);
      if (!Number.isFinite(wasteP) || wasteP < 0) {
        return {
          primary: { id: 'totalYearlyCost', label: 'Geschätzte jährliche Wasserkosten', value: 0, formattedValue: '–' },
          error: 'Die Schmutzwassergebühr darf nicht negativ sein.',
        };
      }

      let fixedFee = 0;
      if (inputs.fixedFeeYear !== undefined && inputs.fixedFeeYear !== null && String(inputs.fixedFeeYear).trim() !== '') {
        const rawFixed = String(inputs.fixedFeeYear).trim().replace(',', '.');
        const parsedFixed = parseFloat(rawFixed);
        if (!Number.isFinite(parsedFixed) || parsedFixed < 0) {
          return {
            primary: { id: 'totalYearlyCost', label: 'Geschätzte jährliche Wasserkosten', value: 0, formattedValue: '–' },
            error: 'Die feste Jahresgebühr darf nicht negativ sein.',
          };
        }
        fixedFee = parsedFixed;
      }

      const totalDailyLiters = p * liters;
      const totalYearlyLiters = totalDailyLiters * 365;
      const totalYearlyM3 = totalYearlyLiters / 1000;
      const combinedPriceM3 = Number((freshP + wasteP).toFixed(4));
      const variableYearlyCost = Number((totalYearlyM3 * combinedPriceM3).toFixed(4));
      const totalYearlyCost = Number((variableYearlyCost + fixedFee).toFixed(4));
      const monthlyAverageCost = Number((totalYearlyCost / 12).toFixed(4));
      const costPerPersonYear = Number((totalYearlyCost / p).toFixed(4));

      return {
        primary: {
          id: 'totalYearlyCost',
          label: 'Geschätzte jährliche Wasserkosten (Frisch- & Abwasser)',
          value: totalYearlyCost,
          formattedValue: formatCurrency(totalYearlyCost),
          highlight: true,
        },
        secondary: [
          {
            id: 'totalYearlyM3',
            label: 'Jahreswasserverbrauch in m³',
            value: totalYearlyM3,
            formattedValue: `${formatNumber(totalYearlyM3, 2)} m³ (${formatNumber(totalYearlyLiters, 0)} Liter)`,
          },
          {
            id: 'monthlyCost',
            label: 'Rechnerischer Monatsdurchschnitt (Kosten ÷ 12)',
            value: monthlyAverageCost,
            formattedValue: formatCurrency(monthlyAverageCost),
          },
          {
            id: 'variableCost',
            label: 'Verbrauchsabhängige Kosten (m³)',
            value: variableYearlyCost,
            formattedValue: formatCurrency(variableYearlyCost),
          },
          {
            id: 'fixedFeeSec',
            label: 'Fester Jahresgrundpreis (Zählergebühr)',
            value: fixedFee,
            formattedValue: formatCurrency(fixedFee),
          },
          {
            id: 'costPerPerson',
            label: 'Kosten pro Person im Jahr',
            value: costPerPersonYear,
            formattedValue: formatCurrency(costPerPersonYear),
          },
        ],
        summaryText: `Ein ${p}-Personen-Haushalt mit angenommenen ${formatNumber(liters, 0)} Litern pro Kopf und Tag verbraucht ca. ${formatNumber(totalYearlyM3, 2)} m³ Wasser im Jahr. Bei ${formatCurrency(combinedPriceM3)}/m³ (Trinkwasser ${formatCurrency(freshP)} + Abwasser ${formatCurrency(wasteP)})${fixedFee > 0 ? ` und ${formatCurrency(fixedFee)} festem Grundpreis` : ''} ergeben sich geschätzte Gesamtkosten von ${formatCurrency(totalYearlyCost)} pro Jahr (rechnerischer Monatsdurchschnitt: ca. ${formatCurrency(monthlyAverageCost)}).`,
        directAnswer: `Für ${p} Personen mit ${formatNumber(liters, 0)} l/Tag beträgt der geschätzte Jahresverbrauch ca. ${formatNumber(totalYearlyM3, 2)} m³. Die jährlichen Wasserkosten belaufen sich bei ${formatCurrency(combinedPriceM3)}/m³${fixedFee > 0 ? ` zzgl. ${formatCurrency(fixedFee)} Grundgebühr` : ''} auf ca. ${formatCurrency(totalYearlyCost)} (ca. ${formatCurrency(monthlyAverageCost)} pro Monat im rechnerischen Durchschnitt).`,
        qualifications: [
          'Modellschätzung: Der Rechner schätzt Ihren Verbrauch aus Haushaltsgröße und täglichem Pro-Kopf-Verbrauch. Die tatsächlichen Gebühren hängen von Ihrem örtlichen Versorger und dem echten Zählerstand ab.',
          'Enthaltene Kosten: Berechnet werden der Frischwasserbezug (Trinkwasser), die Schmutzwassergebühr (Kanalisation) und der optional angegebene Zählergrundpreis.',
          'Nicht enthaltene Kosten: Niederschlagswassergebühren (gesplittete Abwassergebühr nach versiegelter Grundstücksfläche) sowie Energiekosten für die Warmwasserbereitung (z. B. Strom, Gas oder Fernwärme für Boiler und Heizungsanlage) sind nicht enthalten.',
        ],
        calculationSteps: [
          `Tagesverbrauch: ${p} Personen × ${formatNumber(liters, 0)} l/Tag = ${formatNumber(totalDailyLiters, 0)} Liter/Tag`,
          `Jahresverbrauch in Kubikmetern: ${formatNumber(totalDailyLiters, 0)} l/Tag × 365 Tage ÷ 1.000 = ${formatNumber(totalYearlyM3, 3)} m³/Jahr`,
          `Verbrauchsgebühr je m³: ${formatCurrency(freshP)} (Frischwasser) + ${formatCurrency(wasteP)} (Abwasser) = ${formatCurrency(combinedPriceM3)}/m³`,
          `Verbrauchsabhängige Kosten: ${formatNumber(totalYearlyM3, 3)} m³ × ${formatCurrency(combinedPriceM3)} = ${formatCurrency(variableYearlyCost)}`,
          ...(fixedFee > 0 ? [`Gesamtkosten inklusive Grundgebühr: ${formatCurrency(variableYearlyCost)} + ${formatCurrency(fixedFee)} = ${formatCurrency(totalYearlyCost)}`] : []),
          `Rechnerischer Monatsdurchschnitt: ${formatCurrency(totalYearlyCost)} ÷ 12 Monate = ${formatCurrency(monthlyAverageCost)}/Monat`,
        ],
      };
    },
    formula: 'Jahreswasserkosten = (Personen × Liter/Tag × 365 ÷ 1.000) × (Frischwasserpreis + Abwasserpreis) + Jahresgrundpreis',
    formulaExplanation: 'Multipliziert den jährlichen Kubikmeterbedarf aus Personenzahl und täglichem Richtwert mit den kommunalen Frisch- und Abwassertarifen zuzüglich eventueller fester Zählergrundpreise.',
    workedExample: {
      title: 'Beispiel: 3 Personen mit 125 Liter/Tag bei 4,80 €/m³ Gesamtgebühr',
      description: 'Der Rechner schätzt Ihren Verbrauch aus Haushaltsgröße und täglichem Pro-Kopf-Verbrauch. Die tatsächlichen Gebühren hängen von Ihrem örtlichen Versorger ab. Kosten für die Erwärmung des Wassers sind nicht enthalten.',
      inputValues: [
        { label: 'Personen im Haushalt', value: '3 Personen' },
        { label: 'Täglicher Pro-Kopf-Verbrauch', value: '125 l/Tag' },
        { label: 'Trinkwasserpreis', value: '2,10 €/m³' },
        { label: 'Schmutzwassergebühr', value: '2,70 €/m³' },
        { label: 'Fester Jahresgrundpreis', value: '0,00 €' },
      ],
      steps: [
        'Tagesverbrauch im Haushalt: 3 Personen × 125 Liter/Tag = 375 Liter/Tag',
        'Jahresverbrauch in Kubikmetern: 375 Liter/Tag × 365 Tage ÷ 1.000 = 136,875 m³/Jahr',
        'Kombinierter Kubikmeterpreis: 2,10 €/m³ + 2,70 €/m³ = 4,80 €/m³',
        'Verbrauchsabhängige Jahreskosten: 136,875 m³ × 4,80 €/m³ = 657,00 €/Jahr',
        'Rechnerischer Monatsdurchschnitt: 657,00 € ÷ 12 Monate = 54,75 €/Monat',
      ],
      result: '657,00 € jährliche Wasserkosten (rechnerischer Monatsdurchschnitt: 54,75 €)',
    },
    content: {
      intro: 'Der Rechner schätzt Ihren Verbrauch aus Haushaltsgröße und täglichem Pro-Kopf-Verbrauch. Die tatsächlichen Gebühren hängen von Ihrem örtlichen Versorger ab. Kosten für die Erwärmung des Wassers sind nicht enthalten. Nach Daten der BDEW-Wasserstatistik (2024) sowie des Statistischen Bundesamtes (Destatis 2022) verbraucht eine Person in Deutschland durchschnittlich ca. 125 bis 128 Liter Trinkwasser pro Tag.',
      details: 'Ein Kubikmeter (m³) entspricht genau 1.000 Litern Wasser. Die Jahresrechnung der Stadtwerke oder des Wasserverbands setzt sich aus zwei Teilen zusammen: dem Frischwasserbezug (Trinkwasser) und der Schmutzwassergebühr (Kanalisation). Beide Gebührenarten werden pro bezogenem Kubikmeter berechnet. Feste Zählergrundpreise und Zählermieten fallen unabhängig vom Verbrauch an. Nicht in diesem Rechner enthalten sind gesplittete Niederschlagswassergebühren für versiegelte Dach- und Hofflächen sowie die Energie für die Warmwasserbereitung.',
      sections: [
        {
          title: 'Liter versus Kubikmeter (m³): Wie wird gerechnet?',
          content: 'Im Alltag erfassen wir Wasser oft in Litern (z. B. 40 bis 60 Liter für einen Duschvorgang oder 5 Liter für einen Spülgang). Der Wasserzähler im Keller misst das Volumen jedoch in vollen Kubikmetern (m³). Die Umrechnung ist denkbar einfach: 1.000 Liter entsprechen genau 1 m³ Wasser. Verbraucht ein 3-Personen-Haushalt 125 Liter pro Kopf und Tag, sind das 375 Liter täglich bzw. 136.875 Liter im Jahr – das entspricht 136,88 m³ auf der Abrechnung.',
        },
        {
          title: 'Geschätzter Modellverbrauch versus gemessener Zählerstand',
          content: 'Dieser Rechner liefert eine Orientierung anhand von Durchschnittswerten. Ihr realer Verbrauch kann deutlich abweichen: Sparsame Duschköpfe, moderne Spartasten am WC und effiziente Waschmaschinen senken den Bedarf auf 90 bis 100 Liter pro Tag. Ausgedehnte Wannenbäder, häufiges Gießen im Garten oder Poolbefüllungen im Sommer können den Verbrauch auf über 160 Liter pro Kopf steigern. Für eine exakte Abrechnung sind stets die abgelesenen Zählerstände auf Ihrer Wasseruhr maßgeblich.',
        },
        {
          title: 'Welche Gebühren sind enthalten – und welche nicht?',
          content: 'Dieser Rechner erfasst die beiden verbrauchsabhängigen Hauptbestandteile der Wasserabrechnung: den Mengenpreis für Frischwasser und die Schmutzwassergebühr für das in die Kanalisation eingeleitete Abwasser. Optional können Sie die feste jährliche Grund- oder Zählergebühr einrechnen.\n\nNicht enthalten sind:\n- **Niederschlagswassergebühr (Regenwasser):** Wird von Kommunen nach der versiegelten Grundstücksfläche (m²) berechnet, nicht nach Kubikmetern Trinkwasser.\n- **Warmwasserkosten (Heizenergie):** Die Erwärmung von Dusch- und Badewasser erfordert erhebliche Energiemengen (Gas, Strom, Heizöl oder Fernwärme). Diese Kosten erscheinen auf der Heizkostenabrechnung oder Stromrechnung, nicht auf der Wasserabrechnung.',
        },
        {
          title: 'Wo finden Sie Ihre individuellen Tarife?',
          content: 'Die genauen Preise für Frisch- und Abwasser finden Sie auf der Jahresabrechnung Ihres regionalen Wasserversorgers bzw. im Abwassergebührenbescheid Ihrer Stadt oder Gemeinde. Typischerweise bewegen sich die Preise in Deutschland zwischen 1,50 € und 3,00 € je m³ für Trinkwasser und zwischen 1,80 € und 4,50 € je m³ für Schmutzwasser. Bei den meisten Versorgern fallen zudem 30 bis 120 € feste Zählergebühr pro Jahr an.',
        },
      ],
    },
    faqs: [
      {
        question: 'Wie hoch ist der durchschnittliche Wasserverbrauch pro Person in Deutschland?',
        answer: 'Nach Erhebungen des Bundesverbandes der Energie- und Wasserwirtschaft (BDEW 2024) sowie des Statistischen Bundesamtes (Destatis 2022) liegt der tägliche Trinkwasserverbrauch bei rund 125 bis 128 Litern pro Person. Auf ein volles Jahr gerechnet entspricht das ca. 45 bis 47 Kubikmetern (m³) pro Kopf.',
      },
      {
        question: 'Warum ist die Abwassergebühr oft teurer als das Trinkwasser?',
        answer: 'Der Betrieb, die Instandhaltung und die Modernisierung von Kanalnetzen, Regenrückhaltebecken und Kläranlagen mit mehrstufigen Reinigungsverfahren sind extrem kapitalintensiv. Die Kommunen müssen diese Kosten über die Schmutzwassergebühr kostendeckend auf die verbrauchten Kubikmeter umlegen.',
      },
      {
        question: 'Sind Warmwasserkosten im Wasserverbrauch-Rechner enthalten?',
        answer: 'Nein. Dieser Rechner ermittelt reine Wasser- und Abwassergebühren. Die thermische Energie zur Erwärmung des Wassers (z. B. durch Durchlauferhitzer, Gastherme oder Wärmepumpe) verursacht separate Energiekosten, die in der Heizkostenabrechnung oder Stromrechnung ausgewiesen werden.',
      },
      {
        question: 'Wie kann man die Wasserkosten im Haushalt am wirksamsten senken?',
        answer: 'Die größten Einsparpotenziale bieten Sparduschköpfe (reduzieren den Durchfluss von ca. 14–16 l/min auf 6–8 l/min), Spartasten an der Toilettenspülung (spart bis zu 5 Liter pro Spülgang) sowie die vollständige Beladung von Wasch- und Spülmaschinen mit dem Eco-Programm.',
      },
    ],
    relatedSlugs: ['warmwasserkosten-rechner', 'waschmaschine-kosten-rechner', 'spuelmaschine-kosten-rechner', 'stromkosten-geraete-rechner'],
  },

  {
    id: 'oelheizung-verbrauch-rechner',
    slug: 'oelheizung-verbrauch-rechner',
    name: 'Heizölverbrauch schätzen: Wohnfläche und Dämmzustand',
    shortName: 'Heizölverbrauch berechnen',
    category: 'haushalt-energie',
    subcategory: 'Heizung & Gas',
    metaTitle: 'Heizölverbrauch berechnen: Liter pro m², Jahr & Kosten',
    metaDescription: 'Heizölverbrauch aus Wohnfläche und Gebäudezustand schätzen: Liter pro Jahr, angenommener Verbrauch pro m² und jährliche Heizölkosten mit Ihrem eigenen Literpreis.',
    h1: 'Heizölverbrauch berechnen: Liter pro Jahr und Heizölkosten',
    shortDescription: 'Geben Sie die beheizte Wohnfläche, den Gebäudezustand und Ihren Heizölpreis ein. Der Rechner schätzt daraus den Verbrauch in Litern pro Jahr und die jährlichen Heizölkosten (Wohnfläche × angenommener Verbrauch von 8, 14 oder 22 l/m²). Das Ergebnis ist eine Modellschätzung, kein gemessener Verbrauch.',
    searchKeywords: ['heizoelverbrauch rechner', 'wie viel heizoel pro qm', 'heizoelverbrauch berechnen', 'heizoelbedarf einfamilienhaus', 'heizölverbrauch pro m2', 'heizölkosten berechnen', 'wie viel heizöl brauche ich'],
    inputs: [
      { id: 'livingArea', label: 'Beheizte Wohnfläche in m²', type: 'number', defaultValue: 140, min: 0, max: 600, step: 10, unit: 'm²' },
      {
        id: 'insulationStandard',
        label: 'Energetischer Zustand / Dämmung (Modellannahme)',
        type: 'select',
        defaultValue: 'standard',
        options: [
          { value: 'modern', label: 'Gut gedämmt / Neubau (Modellannahme: ca. 8 Liter Öl/m²a)' },
          { value: 'standard', label: 'Teilsaniert / Standard 90er (Modellannahme: ca. 14 Liter Öl/m²a)' },
          { value: 'unrenovated', label: 'Altbau unsaniert vor 1980 (Modellannahme: ca. 22 Liter Öl/m²a)' },
        ],
      },
      { id: 'oilPricePerLiter', label: 'Heizölpreis in Euro pro Liter', type: 'number', defaultValue: 1.05, min: 0, max: 2.5, step: 0.05, unit: '€/l' },
    ],
    calculate: (inputs) => {
      if (inputs.livingArea === '' || inputs.livingArea === null) {
        return {
          primary: { id: 'totalCost', label: 'Geschätzte jährliche Heizölkosten', value: 0, formattedValue: '-' },
          error: 'Bitte geben Sie die beheizte Wohnfläche in Quadratmetern ein.',
        };
      }
      if (inputs.oilPricePerLiter === '' || inputs.oilPricePerLiter === null) {
        return {
          primary: { id: 'totalCost', label: 'Geschätzte jährliche Heizölkosten', value: 0, formattedValue: '-' },
          error: 'Bitte geben Sie den Heizölpreis in Euro pro Liter ein.',
        };
      }

      const rawArea = inputs.livingArea !== undefined ? inputs.livingArea : 140;
      const area = typeof rawArea === 'number' ? rawArea : parseFloat(String(rawArea).replace(',', '.'));

      if (isNaN(area)) {
        return {
          primary: { id: 'totalCost', label: 'Geschätzte jährliche Heizölkosten', value: 0, formattedValue: '-' },
          error: 'Bitte geben Sie eine gültige Zahl für die Wohnfläche ein.',
        };
      }
      if (area < 0) {
        return {
          primary: { id: 'totalCost', label: 'Geschätzte jährliche Heizölkosten', value: 0, formattedValue: '-' },
          error: 'Die beheizte Wohnfläche darf nicht negativ sein.',
        };
      }

      const rawPrice = inputs.oilPricePerLiter !== undefined ? inputs.oilPricePerLiter : 1.05;
      const price = typeof rawPrice === 'number' ? rawPrice : parseFloat(String(rawPrice).replace(',', '.'));

      if (isNaN(price)) {
        return {
          primary: { id: 'totalCost', label: 'Geschätzte jährliche Heizölkosten', value: 0, formattedValue: '-' },
          error: 'Bitte geben Sie einen gültigen Heizölpreis als Zahl ein.',
        };
      }
      if (price < 0) {
        return {
          primary: { id: 'totalCost', label: 'Geschätzte jährliche Heizölkosten', value: 0, formattedValue: '-' },
          error: 'Der Heizölpreis darf nicht negativ sein.',
        };
      }

      const type = inputs.insulationStandard || 'standard';
      let litersPerSqm: number = HEATING_OIL_L_PER_SQM.standard;
      if (type === 'modern') litersPerSqm = HEATING_OIL_L_PER_SQM.modern;
      if (type === 'unrenovated') litersPerSqm = HEATING_OIL_L_PER_SQM.unrenovated;

      // Zero stays zero
      const totalLiters = area === 0 ? 0 : area * litersPerSqm;
      const totalCost = heatingOilCost(totalLiters, price);

      return {
        primary: { id: 'totalCost', label: 'Geschätzte jährliche Heizölkosten', value: totalCost, formattedValue: formatCurrency(totalCost), highlight: true },
        secondary: [
          { id: 'totalLiters', label: 'Geschätzter Heizölbedarf pro Jahr', value: totalLiters, formattedValue: `ca. ${formatNumber(totalLiters, 0)} Liter` },
          { id: 'litersPerSqm', label: 'Angenommener Verbrauch pro m²', value: litersPerSqm, formattedValue: `${litersPerSqm} l/m² pro Jahr (Modellannahme)` },
          { id: 'monthlyCost', label: 'Monatlicher Richtwert (Kosten ÷ 12)', value: totalCost / 12, formattedValue: formatCurrency(totalCost / 12) },
          { id: 'kwhEquivalent', label: 'Rechnerischer Brennstoff-Energiegehalt (Heizwert Hi)', value: totalLiters * 10, formattedValue: `ca. ${formatNumber(totalLiters * 10, 0)} kWh` },
        ],
        calculationSteps: [
          `${formatNumber(area, 2)} m² × ${litersPerSqm} l/m² pro Jahr = ${formatNumber(totalLiters, 0)} Liter pro Jahr`,
          `${formatNumber(totalLiters, 0)} Liter × ${formatCurrency(price)}/l = ${formatCurrency(totalCost)} pro Jahr`,
          `${formatCurrency(totalCost)} ÷ 12 = ${formatCurrency(totalCost / 12)} pro Monat`,
        ],
        summaryText: `Für ${area} m² Wohnfläche schätzt das Modell ca. ${formatNumber(totalLiters, 0)} Liter Heizöl im Jahr. Bei einem Preis von ${formatCurrency(price)}/Liter entspricht das rechnerisch ${formatCurrency(totalCost)}.`,
      };
    },
    formula: 'Heizölverbrauch = Wohnfläche × Literbedarf pro m²; Kosten = Liter × Literpreis',
    formulaExplanation: 'Ein Liter leichtes Heizöl (EL) besitzt einen Brennstoff-Energiegehalt (Heizwert Hi) von etwa 10 Kilowattstunden (kWh); der Brennwert Hs inklusive Kondensationswärme liegt bei ca. 10,6 kWh/l. Die Faktoren von 8, 14 und 22 Litern je m² und Jahr sind vereinfachte Modellannahmen zur Orientierung für den Brennstoffbedarf (ohne Kesselwirkungsgrad- und Leitungsverluste).',
    workedExample: {
      title: 'Beispiel: 140 m² Wohnfläche bei 14 Liter/m²a und 1,05 €/Liter',
      description: 'Bei 140 m² beheizter Wohnfläche und einem angenommenen Verbrauch von 14 Litern je m² und Jahr ergeben sich 1.960 Liter Heizöl. Mit einem beispielhaften Preis von 1,05 €/Liter sind das 2.058,00 € pro Jahr beziehungsweise 171,50 € im rechnerischen Monatsdurchschnitt. Der Verbrauch ist eine Modellschätzung; der Preis ist kein aktueller Marktpreis.',
      inputValues: [{ label: 'Wohnfläche', value: '140 m²' }, { label: 'Bedarf/m²', value: '14 Liter' }, { label: 'Ölpreis', value: '1,05 €/l' }],
      steps: [
        '140 m² × 14 Liter/m²/Jahr = 1.960 Liter/Jahr',
        '1.960 Liter × 1,05 €/Liter = 2.058,00 €/Jahr',
        '2.058,00 € ÷ 12 Monate = 171,50 €/Monat',
      ],
      result: '2.058,00 € jährliche Heizölkosten (ca. 171,50 €/Monat)',
    },
    quickReference: [
      {
        title: 'Heizölverbrauch pro m²: so rechnet der Rechner',
        content: buildHeatingOilQuickReference(),
      },
    ],
    content: {
      intro: 'Dieser Rechner schätzt den jährlichen Heizölbedarf und die ungefähren Brennstoffkosten anhand der Wohnfläche und modellhafter Verbrauchswerte für verschiedene Dämmzustände. Wenn Sie bereits konkrete Tankfüllstände und Lieferbelege vorliegen haben, nutzen Sie für die exakte Mengenbilanz unseren Ratgeber [Heizölverbrauch berechnen: Tankstände statt Liefermenge](/ratgeber/heizoelverbrauch-aus-tankstand-berechnen/).',
      sections: [
        {
          title: 'Wie wird der Heizölverbrauch geschätzt?',
          content: 'Der Rechner multipliziert die beheizte Wohnfläche mit dem gewählten Verbrauchswert in Litern je Quadratmeter und Jahr. Das Ergebnis ist eine grobe Schätzung, keine Messung Ihres tatsächlichen Verbrauchs.\n\nRechenbeispiel: Bei 140 m² und einem angenommenen Verbrauch von 14 Litern je m² ergeben sich 1.960 Liter pro Jahr. Mit einem selbst eingetragenen Preis von 1,05 € je Liter wären das 2.058 € im Jahr. Beide Werte sind Beispielannahmen, keine aktuellen Preis- oder Verbrauchsempfehlungen.',
        },
        {
          title: 'Wie ermittle ich meinen tatsächlichen Heizölverbrauch?',
          content: 'Wenn Anfangsbestand, Liefermengen und Endbestand für denselben Zeitraum bekannt sind, lässt sich der Verbrauch aus der Tankbilanz bestimmen:\n\n`Verbrauch = Anfangsbestand + Liefermengen − Endbestand`\n\nBeispiel: 1.500 Liter Anfangsbestand + 2.000 Liter Lieferung − 1.200 Liter Endbestand = 2.300 Liter Verbrauch. Wie genau das Ergebnis ist, hängt auch davon ab, wie zuverlässig die Tankstände gemessen wurden.',
        },
        {
          title: 'Warum kann der tatsächliche Verbrauch abweichen?',
          content: 'Witterung, Raumtemperatur, Dämmung, Heizungszustand und Warmwasserbereitung beeinflussen den Verbrauch. Vergleichen Sie möglichst vollständige Jahre. Ein kalter Wintermonat lässt sich nicht einfach auf zwölf Monate hochrechnen.',
        },
        {
          title: 'Tatsächlichen Verbrauch über Tankstände berechnen',
          content: 'Dieser Rechner liefert eine flächenbasierte Modellschätzung. Wie Sie Ihren realen Jahresverbrauch aus Tankbeständen und Lieferbelegen nachvollziehen, erfahren Sie in unserem Ratgeber [Heizölverbrauch berechnen: Tankstände statt Liefermenge](/ratgeber/heizoelverbrauch-aus-tankstand-berechnen/). Die Genauigkeit hängt von der präzisen Ablesung der Tankfüllstände und lückenlosen Liefernachweisen ab.',
        },
      ],
      details: '1 Liter leichtes Heizöl (EL) besitzt einen Energiegehalt (Heizwert Hi) von rund 10,0 kWh (Brennwert Hs ca. 10,6 kWh/l). Die im Rechner hinterlegten Faktoren (8, 14 und 22 Liter je m² und Jahr) sind unverbindliche Modellannahmen für den Brennstoffbedarf und keine Messwerte eines konkreten Gebäudes. Der Rechner ermittelt den Brennstoffeinsatz, nicht die nutzbare thermische Raumwärme.',
    },
    faqs: [
      { question: 'Wie wirkt sich die CO₂-Abgabe auf den Heizölpreis aus?', answer: 'Auf Heizöl fällt nach dem BEHG eine CO₂-Abgabe an, die im Literpreis des Brennstoffhändlers bereits enthalten ist.' },
      { question: 'Wann dürfen alte Ölheizungen nach dem GEG noch betrieben werden?', answer: 'Bestehende Ölheizungen dürfen weiter betrieben und repariert werden; Standard-Heizkessel (keine Brennwert- oder Niedertemperaturtechnik) müssen jedoch nach 30 Jahren Betrieb stillgelegt werden (§ 72 GEG).' },
    ],
    relatedSlugs: ['heizkostenvergleich-rechner', 'gaskostenrechner', 'gasverbrauch-kwh-m3-rechner', 'waermepumpe-stromkosten-rechner'],
    trustMeta: {
      lastReviewed: '2026-10-25',
    },
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
      const demand = inputs.heatDemandKwh !== undefined && inputs.heatDemandKwh !== '' ? Math.max(0, parseFloat(inputs.heatDemandKwh) || 0) : 18000;
      const pricePerTon = inputs.pelletPricePerTon !== undefined && inputs.pelletPricePerTon !== '' ? Math.max(0, parseFloat(inputs.pelletPricePerTon) || 0) : 320;
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
        directAnswer: `Für ${formatNumber(demand, 0)} kWh Heizenergie werden ca. ${formatNumber(tonsNeeded, 2)} Tonnen Holzpellets mit jährlichen Brennstoffkosten von ${formatCurrency(totalCost)} benötigt.`,
        basisSummary: [
          { label: 'Wärmebedarf', value: `${formatNumber(demand, 0)} kWh` },
          { label: 'Pelletpreis', value: `${formatCurrency(pricePerTon)}/t` },
          { label: 'Nutzwärme pro kg', value: '4,4 kWh (90 % Wirkungsgrad)' },
        ],
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
      const hours = inputs.hoursPerDay !== undefined && inputs.hoursPerDay !== '' ? Math.max(0, parseFloat(inputs.hoursPerDay) || 0) : 6;
      const days = inputs.summerDays !== undefined && inputs.summerDays !== '' ? Math.max(0, parseInt(inputs.summerDays, 10) || 0) : 35;
      const priceCent = inputs.electricityPrice !== undefined && inputs.electricityPrice !== '' ? Math.max(0, parseFloat(inputs.electricityPrice) || 0) : 36;
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
      const consumption = inputs.consumptionKwhPer100Km !== undefined && inputs.consumptionKwhPer100Km !== '' ? Math.max(0, parseFloat(inputs.consumptionKwhPer100Km) || 0) : 18.5;
      const km = inputs.yearlyMileageKm !== undefined && inputs.yearlyMileageKm !== '' ? Math.max(0, parseFloat(inputs.yearlyMileageKm) || 0) : 15000;
      const homeCent = inputs.homePowerPriceCent !== undefined && inputs.homePowerPriceCent !== '' ? Math.max(0, parseFloat(inputs.homePowerPriceCent) || 0) : 32;
      const publicCent = inputs.publicPriceCent !== undefined && inputs.publicPriceCent !== '' ? Math.max(0, parseFloat(inputs.publicPriceCent) || 0) : 59;
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
    metaTitle: 'CO2-Kostenaufteilung Rechner – Stufenmodell Vermieter & Mieter',
    metaDescription: 'Ermitteln Sie die gesetzliche Aufteilung der CO2-Kosten für Gas, Heizöl & Fernwärme nach dem 10-Stufenmodell des CO2KostAufG mit Ausnahmeregelungen.',
    h1: 'CO2-Kostenaufteilung Rechner – Gesetzliches Stufenmodell nach CO2KostAufG',
    shortDescription: 'Berechnet die Aufteilung der CO2-Heizkosten zwischen Mieter und Vermieter nach dem 10-Stufen-Modell gemäß Kohlendioxidkostenaufteilungsgesetz.',
    searchKeywords: ['co2 kostenaufteilung rechner', 'co2kostaufg 10 stufenmodell', 'co2 preis vermieter mieter anteil', 'kohlendioxidkostenaufteilungsgesetz', 'heizkostenabrechnung co2 anteil'],
    inputs: [
      {
        id: 'co2CostTotal',
        label: 'CO2-Kosten der Wohnung laut Heizkostenabrechnung in Euro',
        type: 'number',
        defaultValue: 140,
        min: 0,
        max: 5000,
        step: 1,
        unit: '€',
        helpText: 'Der auf Ihre Wohnung entfallende CO₂-Kostenbetrag, der vom Vermieter bzw. Messdienstleister auf der Heizkostenabrechnung ausgewiesen ist.',
      },
      {
        id: 'co2EmissionKgPerSqm',
        label: 'Spezifischer CO2-Ausstoß des Gebäudes (in kg CO₂/m² Wohnfläche im Jahr)',
        type: 'number',
        defaultValue: 28,
        min: 0,
        max: 150,
        step: 0.5,
        unit: 'kg/m²a',
        helpText: 'Maßgeblicher Wert für die Stufeneinstufung. Dieser Wert bezieht sich stets auf das Gesamtgebäude und steht auf der Abrechnung.',
      },
      {
        id: 'livingArea',
        label: 'Wohnfläche der Wohnung in m²',
        type: 'number',
        defaultValue: 80,
        min: 10,
        max: 500,
        step: 1,
        unit: 'm²',
        helpText: 'Fläche der Mietwohnung zur Plausibilitätsprüfung des Anteils.',
      },
      {
        id: 'billingMonths',
        label: 'Dauer des Abrechnungszeitraums in Monaten',
        type: 'number',
        defaultValue: 12,
        min: 1,
        max: 12,
        step: 1,
        unit: 'Monate',
        helpText: 'Regulär 12 Monate. Bei unterjährigem Ein-/Auszug wird die Einstufung auf ein volles Kalenderjahr hochgerechnet.',
      },
      {
        id: 'statutoryExemption',
        label: 'Gesetzliche Ausnahmeregelung (§ 9 CO2KostAufG)',
        type: 'select',
        defaultValue: 'none',
        options: [
          { value: 'none', label: 'Keine Ausnahme (Reguläres 10-Stufenmodell)' },
          { value: 'heritage', label: 'Denkmalschutz / Sanierungsbeschränkung (§ 9 Abs. 1: Vermieteranteil halbiert)' },
          { value: 'district_mandate', label: 'Anschluss- & Benutzungszwang Fernwärme (§ 9 Abs. 2: Vermieteranteil entfällt)' },
        ],
      },
    ],
    calculate: (inputs) => {
      if (inputs.co2CostTotal === undefined || inputs.co2CostTotal === null || String(inputs.co2CostTotal).trim() === '') {
        return {
          primary: { id: 'landlordShare', label: 'Kostenanteil Vermieter', value: 0, formattedValue: '-' },
          error: 'Bitte geben Sie den CO₂-Kostenbetrag aus der Abrechnung an.',
        };
      }

      const total = parseFloat(String(inputs.co2CostTotal).replace(',', '.'));
      if (isNaN(total) || total < 0) {
        return {
          primary: { id: 'landlordShare', label: 'Kostenanteil Vermieter', value: 0, formattedValue: '-' },
          error: 'Die CO₂-Kosten dürfen nicht negativ sein (0 € ist zulässig).',
        };
      }

      const rawKg = inputs.co2EmissionKgPerSqm !== undefined && inputs.co2EmissionKgPerSqm !== null && String(inputs.co2EmissionKgPerSqm).trim() !== ''
        ? parseFloat(String(inputs.co2EmissionKgPerSqm).replace(',', '.'))
        : 28;

      if (isNaN(rawKg) || rawKg < 0) {
        return {
          primary: { id: 'landlordShare', label: 'Kostenanteil Vermieter', value: 0, formattedValue: '-' },
          error: 'Der spezifische CO₂-Ausstoß darf nicht negativ sein.',
        };
      }

      const area = inputs.livingArea !== undefined && inputs.livingArea !== null && String(inputs.livingArea).trim() !== ''
        ? Math.max(1, parseFloat(String(inputs.livingArea).replace(',', '.')) || 80)
        : 80;

      const months = inputs.billingMonths !== undefined && inputs.billingMonths !== null && String(inputs.billingMonths).trim() !== ''
        ? Math.min(12, Math.max(1, parseInt(String(inputs.billingMonths), 10) || 12))
        : 12;

      const exemption = String(inputs.statutoryExemption || 'none');

      // Jahreshochrechnung bei unterjähriger Mietdauer (§ 5 Abs. 3 CO2KostAufG)
      const annualizedKg = months < 12 ? (rawKg * 12) / months : rawKg;

      // 10-Stufenmodell nach Anlage zu § 5 Abs. 1 CO2KostAufG:
      let baseLandlordPct = 0;
      let stepNumber = 1;
      let stepRange = '< 12 kg CO₂/m²a';

      if (annualizedKg < 12) {
        baseLandlordPct = 0.00;
        stepNumber = 1;
        stepRange = '< 12 kg CO₂/m²a (sehr effizient / Niedrigenergie)';
      } else if (annualizedKg < 17) {
        baseLandlordPct = 0.10;
        stepNumber = 2;
        stepRange = '12 bis < 17 kg CO₂/m²a';
      } else if (annualizedKg < 22) {
        baseLandlordPct = 0.20;
        stepNumber = 3;
        stepRange = '17 bis < 22 kg CO₂/m²a';
      } else if (annualizedKg < 27) {
        baseLandlordPct = 0.30;
        stepNumber = 4;
        stepRange = '22 bis < 27 kg CO₂/m²a';
      } else if (annualizedKg < 32) {
        baseLandlordPct = 0.40;
        stepNumber = 5;
        stepRange = '27 bis < 32 kg CO₂/m²a';
      } else if (annualizedKg < 37) {
        baseLandlordPct = 0.50;
        stepNumber = 6;
        stepRange = '32 bis < 37 kg CO₂/m²a';
      } else if (annualizedKg < 42) {
        baseLandlordPct = 0.60;
        stepNumber = 7;
        stepRange = '37 bis < 42 kg CO₂/m²a';
      } else if (annualizedKg < 47) {
        baseLandlordPct = 0.70;
        stepNumber = 8;
        stepRange = '42 bis < 47 kg CO₂/m²a';
      } else if (annualizedKg < 52) {
        baseLandlordPct = 0.80;
        stepNumber = 9;
        stepRange = '47 bis < 52 kg CO₂/m²a';
      } else {
        baseLandlordPct = 0.95;
        stepNumber = 10;
        stepRange = '≥ 52 kg CO₂/m²a (sehr sanierungsbedürftig)';
      }

      // Berücksichtigung gesetzlicher Ausnahmen nach § 9 CO2KostAufG
      let effectiveLandlordPct = baseLandlordPct;
      let exemptionNote = '';

      if (exemption === 'heritage') {
        effectiveLandlordPct = baseLandlordPct * 0.5;
        exemptionNote = 'Vermieteranteil nach § 9 Abs. 1 CO2KostAufG halbiert (Denkmalschutz / rechtliche Sanierungshindernisse).';
      } else if (exemption === 'district_mandate') {
        effectiveLandlordPct = 0;
        exemptionNote = 'Vermieteranteil nach § 9 Abs. 2 CO2KostAufG entfallen (öffentlich-rechtlicher Anschluss- und Benutzungszwang).';
      }

      const tenantPct = 1 - effectiveLandlordPct;
      const landlordShare = total * effectiveLandlordPct;
      const tenantShare = total * tenantPct;

      return {
        primary: {
          id: 'landlordShare',
          label: 'Kostenanteil Vermieter',
          value: landlordShare,
          formattedValue: formatCurrency(landlordShare),
          highlight: true,
          helpText: `Entspricht ${formatPercent(effectiveLandlordPct * 100, 1)} der Gesamtkosten von ${formatCurrency(total)}.`,
        },
        secondary: [
          {
            id: 'tenantShare',
            label: 'Kostenanteil Mieter',
            value: tenantShare,
            formattedValue: formatCurrency(tenantShare),
            helpText: `Entspricht ${formatPercent(tenantPct * 100, 1)} der Gesamtkosten.`,
          },
          {
            id: 'landlordPct',
            label: 'Vermieter-Anteil nach Stufe',
            value: effectiveLandlordPct * 100,
            formattedValue: formatPercent(effectiveLandlordPct * 100, 0),
          },
          {
            id: 'tenantPct',
            label: 'Mieter-Anteil nach Stufe',
            value: tenantPct * 100,
            formattedValue: formatPercent(tenantPct * 100, 0),
          },
          {
            id: 'stepDisplay',
            label: 'Gesetzliche Einstufung',
            value: stepNumber,
            formattedValue: `Stufe ${stepNumber} von 10 (${formatPercent(effectiveLandlordPct * 100, 0)} Vermieter)`,
            helpText: stepRange,
          },
          {
            id: 'specificEmission',
            label: 'Gebäude-Emissionswert',
            value: annualizedKg,
            formattedValue: `${formatNumber(annualizedKg, 1)} kg CO₂/m²a`,
            helpText: months < 12 ? `Aus ${formatNumber(rawKg, 1)} kg in ${months} Monaten aufs Gesamtjahr hochgerechnet.` : 'Jahreswert des Gebäudes.',
          },
        ],
        directAnswer: `Von den ${formatCurrency(total)} CO₂-Kosten muss der Vermieter ${formatCurrency(landlordShare)} (${formatPercent(effectiveLandlordPct * 100, 1)}) übernehmen und der Mieter ${formatCurrency(tenantShare)} (${formatPercent(tenantPct * 100, 1)}).`,
        summaryText: `Bei einem spezifischen CO₂-Ausstoß von ${formatNumber(annualizedKg, 1)} kg/m²a fällt das Gebäude in Stufe ${stepNumber} des CO2KostAufG. Der Vermieter trägt ${formatCurrency(landlordShare)} (${formatPercent(effectiveLandlordPct * 100, 1)}) und der Mieter ${formatCurrency(tenantShare)} (${formatPercent(tenantPct * 100, 1)}) der CO₂-Kosten.`,
        basisSummary: [
          { label: 'CO2-Kosten der Wohnung', value: formatCurrency(total) },
          { label: 'Spezifischer Gebäude-Ausstoß', value: `${formatNumber(annualizedKg, 1)} kg CO₂/m²a (Stufe ${stepNumber})` },
          { label: 'Abrechnungsdauer', value: `${months} Monate` },
          { label: 'Gesetzliche Ausnahme', value: exemption === 'none' ? 'Keine (Regulär)' : (exemption === 'heritage' ? '§ 9 Abs. 1 (Halbierung)' : '§ 9 Abs. 2 (Befreiung)') },
        ],
        calculationSteps: [
          months < 12
            ? `Jahreshochrechnung (§ 5 Abs. 3): ${formatNumber(rawKg, 1)} kg/m² × (12 ÷ ${months}) = ${formatNumber(annualizedKg, 1)} kg CO₂/m²a`
            : `Spezifischer Gebäude-Emissionswert: ${formatNumber(annualizedKg, 1)} kg CO₂/m²a`,
          `Stufenzuordnung nach § 5 Anlage: ${stepRange} → Basis-Vermieteranteil: ${formatPercent(baseLandlordPct * 100, 0)}`,
          exemption !== 'none'
            ? `Ausnahmeregelung (§ 9): ${exemptionNote} → Effektiver Vermieteranteil: ${formatPercent(effectiveLandlordPct * 100, 1)}`
            : `Effektiver Vermieteranteil: ${formatPercent(effectiveLandlordPct * 100, 0)}, Mieteranteil: ${formatPercent(tenantPct * 100, 0)}`,
          `Vermieter-Kosten: ${formatCurrency(total)} × ${formatPercent(effectiveLandlordPct * 100, 1)} = ${formatCurrency(landlordShare)}`,
          `Mieter-Kosten: ${formatCurrency(total)} × ${formatPercent(tenantPct * 100, 1)} = ${formatCurrency(tenantShare)}`,
        ],
        qualifications: [
          'Gilt ausschließlich für Wohngebäude. Für Nichtwohngebäude (Gewerberäume) gilt nach § 8 CO2KostAufG eine gesetzliche 50:50-Pauschalaufteilung.',
          'Die Stufeneinstufung muss nach § 5 Abs. 1 stets auf den Emissionsdaten des Gesamtgebäudes basieren, nicht auf den individuellen Heizgewohnheiten einzelner Mieter.',
          'Vertragliche Klauseln im Mietvertrag, die den Mieter über das CO2KostAufG hinaus belasten, sind nach § 3 CO2KostAufG unwirksam.',
        ],
      };
    },
    formula: 'Vermieteranteil = Gesamt-CO2-Kosten × Stufen-Prozentsatz nach § 5 CO2KostAufG',
    formulaExplanation: 'Das 10-Stufen-Modell staffelt den Vermieteranteil von 0 % (bei < 12 kg CO₂/m²a) bis 95 % (bei ≥ 52 kg CO₂/m²a). Bei Denkmalschutz oder Fernwärmezwang greifen Minderungstatbestände nach § 9.',
    workedExample: {
      title: 'Beispiel: 140,00 € CO2-Kosten bei 28 kg CO2/m²a Gebäudeausstoß',
      description: 'Mit 28 kg/m²a fällt das Wohngebäude in Stufe 5 (27 bis < 32 kg CO₂/m²a). Gesetzlicher Verteilschlüssel: 40 % Vermieter, 60 % Mieter.',
      inputs: { co2CostTotal: 140, co2EmissionKgPerSqm: 28, livingArea: 80, billingMonths: 12, statutoryExemption: 'none' },
      resultSummary: 'Vermieter: 56,00 € (40 %) / Mieter: 84,00 € (60 %)',
    },
    workedExamples: [
      {
        title: 'Beispiel 1: Reguläres Mehrfamilienhaus (Stufe 5)',
        description: '140,00 € CO₂-Kosten bei 28 kg CO₂/m²a. Vermieter: 140 € × 0,40 = 56,00 €. Mieter: 140 € × 0,60 = 84,00 €.',
        inputs: { co2CostTotal: 140, co2EmissionKgPerSqm: 28, livingArea: 80, billingMonths: 12, statutoryExemption: 'none' },
        resultSummary: 'Vermieter: 56,00 € / Mieter: 84,00 €',
      },
      {
        title: 'Beispiel 2: Denkmalgeschütztes Gebäude (§ 9 Abs. 1 Halbierung)',
        description: '200,00 € CO₂-Kosten bei 45 kg CO₂/m²a (regulär Stufe 8: 70 % Vermieter). Durch Denkmalschutz wird der Vermieteranteil halbiert (35 % Vermieter, 65 % Mieter).',
        inputs: { co2CostTotal: 200, co2EmissionKgPerSqm: 45, livingArea: 80, billingMonths: 12, statutoryExemption: 'heritage' },
        resultSummary: 'Vermieter: 70,00 € (35 %) / Mieter: 130,00 € (65 %)',
      },
    ],
    content: {
      intro: 'Das Kohlendioxidkostenaufteilungsgesetz (CO2KostAufG) regelt die verbindliche Verteilung der CO₂-Zertifikatskosten für Erdgas, Heizöl und Fernwärme zwischen Vermietern und Mietern über ein 10-Stufen-Modell.',
      details: 'Die gesetzliche Einstufung richtet sich nach dem spezifischen Kohlendioxidausstoß des gesamten Gebäudes je Quadratmeter Wohnfläche und Jahr. Je energieeffizienter das Gebäude saniert ist, desto geringer ist der Vermieteranteil (bei unter 12 kg CO₂/m²a trägt der Mieter 100 %). Bei unsanierten Altbauten mit hohem Heizbedarf übernimmt der Vermieter bis zu 95 % der CO₂-Kosten.',
    },
    faqs: [
      { question: 'Woher stammen die Werte für den CO₂-Ausstoß und die CO₂-Kosten?', answer: 'Brennstofflieferanten (Gas-, Öl- und Fernwärmeversorger) sind nach § 3 CO2KostAufG gesetzlich verpflichtet, die gelieferte Brennstoffmenge, den spezifischen Emissionsfaktor, die Gesamtemissionen in kg sowie den auf den CO₂-Preis entfallenden Rechnungsbetrag transparent auf der Rechnung auszuweisen. Der Vermieter muss diese Angaben in die jährliche Heizkostenabrechnung übernehmen.' },
      { question: 'Gilt das 10-Stufen-Modell auch für Gewerbe- und Büromieten?', answer: 'Nein. Für Nichtwohngebäude gilt nach § 8 CO2KostAufG eine gesetzliche 50:50-Halbteilung der CO₂-Kosten zwischen Vermieter und Mieter, solange kein gesetzliches Stufenmodell für Nichtwohngebäude in Kraft tritt.' },
      { question: 'Was gilt bei Denkmalschutz oder Fernwärme-Anschlusszwang?', answer: 'Nach § 9 CO2KostAufG wird der Vermieteranteil um 50 % gekürzt, wenn rechtliche Vorgaben wie Denkmalschutzauflagen oder Erhaltungsverordnungen wesentliche energetische Sanierungsmaßnahmen an der Gebäudehülle verhindern. Bei einem behördlichen Anschluss- und Benutzungszwang an ein Fernwärmenetz entfällt der Vermieteranteil vollständig.' },
      { question: 'Darf der Vermieter die CO₂-Kostenaufteilung vertraglich abbedingen?', answer: 'Nein. Nach § 3 Abs. 4 CO2KostAufG sind Vereinbarungen im Mietvertrag unwirksam, die zum Nachteil des Mieters von den gesetzlichen Aufteilungsvorschriften abweichen.' },
    ],
    relatedSlugs: ['gaskostenrechner', 'gasverbrauch-kwh-m3-rechner', 'oelheizung-verbrauch-rechner', 'warmmiete-rechner', 'heizkostenvergleich-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Kohlendioxidkostenaufteilungsgesetz (CO2KostAufG)',
      sourceUrl: 'https://www.gesetze-im-internet.de/co2kostaufg/',
      lastVerified: '2026-03-15',
    },
    trustMeta: {
      methodology: 'Offizielles 10-Stufenmodell nach Anlage zu § 5 Abs. 1 CO2KostAufG inklusive Hochrechnung für unterjährige Zeiträume (§ 5 Abs. 3) und Sonderkürzungen (§ 9)',
      sourceName: 'Bundesministerium für Wirtschaft und Klimaschutz (BMWK) / CO2KostAufG',
      lastReviewed: '2026-10-21',
    },
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
      const adults = inputs.adults !== undefined && inputs.adults !== '' ? Math.max(0, parseInt(inputs.adults, 10) || 0) : 2;
      const kids = inputs.children !== undefined && inputs.children !== '' ? Math.max(0, parseInt(inputs.children, 10) || 0) : 1;
      const style = inputs.lifestyle || 'standard';
      let adultRate = 310;
      let childRate = 190;
      if (style === 'thrifty') { adultRate = 220; childRate = 135; }
      if (style === 'bio') { adultRate = 420; childRate = 260; }
      const totalMonth = (adults * adultRate) + (kids * childRate);
      const weekly = (totalMonth * 12) / 52;
      const daily = totalMonth / 30;
      const totalPersons = adults + kids;
      const perPerson = totalPersons > 0 ? totalMonth / totalPersons : 0;
      return {
        primary: { id: 'totalMonth', label: 'Empfohlenes monatliches Lebensmittelbudget', value: totalMonth, formattedValue: formatCurrency(totalMonth), highlight: true },
        secondary: [
          { id: 'weekly', label: 'Budget pro Woche (Wocheneinkauf)', value: weekly, formattedValue: formatCurrency(weekly) },
          { id: 'daily', label: 'Budget pro Tag', value: daily, formattedValue: formatCurrency(daily) },
          { id: 'perPerson', label: 'Durchschnitt pro Kopf / Monat', value: perPerson, formattedValue: formatCurrency(perPerson) },
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
      const val = inputs.endenergieKwh !== undefined && inputs.endenergieKwh !== '' ? Math.max(0, parseFloat(inputs.endenergieKwh) || 0) : 115;
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
        directAnswer: `Das Gebäude erreicht mit einem Endenergiekennwert von ${formatNumber(val, 1)} kWh/(m²·a) die Energieeffizienzklasse ${klasse}.`,
        basisSummary: [
          { label: 'Endenergie-Kennwert', value: `${formatNumber(val, 1)} kWh/(m²·a)` },
          { label: 'Einstufungsgrundlage', value: 'Gebäudeenergiegesetz (GEG) Anlage 10' },
        ],
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
