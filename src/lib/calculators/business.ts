import { CalculationResult } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';
import { GERMAN_DATA_2026 } from '@/data/regulated/2026';

function parsePrice(v: unknown): number | null {
  if (v === undefined || v === null || v === '') return null;
  const n = parseFloat(String(v).replace(',', '.'));
  return isNaN(n) ? null : n;
}

/**
 * Marge, Aufschlag und Preiskalkulation.
 * mode 'fromPrices'       – EK und VK gegeben → Marge und Aufschlag
 * mode 'priceFromMargin'  – EK und Zielmarge (auf VK) gegeben → nötiger VK
 * mode 'priceFromMarkup'  – EK und Aufschlag (auf EK) gegeben → VK
 */
export function calculateMargin(inputs: Record<string, any>): CalculationResult {
  const mode = inputs.mode || 'fromPrices';
  const purchasePrice = parsePrice(inputs.purchasePrice) ?? 50; // Einkaufspreis netto
  const fail = (error: string): CalculationResult => ({
    primary: { id: 'margin', label: 'Handelsmarge', value: 0, formattedValue: '-' },
    error,
  });

  if (purchasePrice <= 0) return fail('Der Einkaufspreis muss größer als 0 sein.');

  let sellingPrice: number;
  if (mode === 'priceFromMargin') {
    const target = parsePrice(inputs.targetMargin) ?? 30;
    if (target < 0 || target >= 100) return fail('Die Marge bezieht sich auf den Verkaufspreis und muss zwischen 0 und unter 100 % liegen.');
    sellingPrice = purchasePrice / (1 - target / 100);
  } else if (mode === 'priceFromMarkup') {
    const markup = parsePrice(inputs.markupPercent) ?? 50;
    if (markup < 0) return fail('Der Aufschlag darf nicht negativ sein.');
    sellingPrice = purchasePrice * (1 + markup / 100);
  } else {
    sellingPrice = parsePrice(inputs.sellingPrice) ?? 100; // Verkaufspreis netto
    if (sellingPrice <= 0) return fail('Einkaufs- und Verkaufspreis müssen größer als 0 sein.');
  }

  const grossProfit = sellingPrice - purchasePrice;
  // Handelsspanne (Marge) = Gewinn / Verkaufspreis · 100
  const marginPercent = (grossProfit / sellingPrice) * 100;
  // Aufschlagssatz = Gewinn / Einkaufspreis · 100
  const markupPercent = (grossProfit / purchasePrice) * 100;
  const grossPrice = sellingPrice * 1.19;

  const secondary = [
    { id: 'markup', label: 'Kalkulationsaufschlag (auf EK)', value: markupPercent, formattedValue: formatPercent(markupPercent, 2) },
    { id: 'margin', label: 'Handelsspanne (Marge auf VK)', value: marginPercent, formattedValue: formatPercent(marginPercent, 2) },
    { id: 'grossProfit', label: 'Rohgewinn pro Stück', value: grossProfit, formattedValue: formatCurrency(grossProfit) },
    { id: 'factor', label: 'Kalkulationsfaktor', value: sellingPrice / purchasePrice, formattedValue: `${formatNumber(sellingPrice / purchasePrice, 2)} ×` },
    { id: 'grossPrice', label: 'Verkaufspreis brutto (inkl. 19 % MwSt)', value: grossPrice, formattedValue: formatCurrency(grossPrice) },
  ];

  if (mode === 'fromPrices') {
    return {
      primary: { id: 'margin', label: 'Handelsspanne (Marge auf VK)', value: marginPercent, formattedValue: formatPercent(marginPercent, 2), highlight: true },
      secondary: secondary.filter((x) => x.id !== 'margin'),
      summaryText: `Bei einem Einkaufspreis von ${formatCurrency(purchasePrice)} und Verkaufspreis von ${formatCurrency(sellingPrice)} erzielen Sie ${formatCurrency(grossProfit)} Rohertrag. Das entspricht einer Handelsmarge von ${formatPercent(marginPercent, 2)} bzw. einem Aufschlag von ${formatPercent(markupPercent, 2)} auf den Einkaufspreis.`,
    };
  }

  return {
    primary: { id: 'sellingPrice', label: 'Verkaufspreis netto (VK)', value: sellingPrice, formattedValue: formatCurrency(sellingPrice), highlight: true },
    secondary,
    summaryText: `Für ${mode === 'priceFromMargin' ? `eine Marge von ${formatPercent(marginPercent, 2)}` : `einen Aufschlag von ${formatPercent(markupPercent, 2)}`} auf ${formatCurrency(purchasePrice)} Einkaufspreis müssen Sie für ${formatCurrency(sellingPrice)} netto verkaufen (${formatCurrency(grossPrice)} brutto). Rohgewinn: ${formatCurrency(grossProfit)} pro Stück.`,
  };
}

export function calculateVat(inputs: Record<string, any>): CalculationResult {
  const amount = inputs.amount !== undefined && inputs.amount !== '' && !isNaN(parseFloat(inputs.amount))
    ? parseFloat(inputs.amount)
    : 100;
  const isGrossInput = inputs.direction === 'grossToNet'; // Bruttopreis gegeben
  const vatRate = inputs.vatRate !== undefined && inputs.vatRate !== '' && !isNaN(parseFloat(inputs.vatRate))
    ? parseFloat(inputs.vatRate)
    : GERMAN_DATA_2026.mwst_regulaer.value; // 19% oder 7%

  if (amount < 0) {
    return {
      primary: { id: 'vat', label: 'MwSt', value: 0, formattedValue: '0,00 €' },
      error: 'Der Betrag darf nicht negativ sein.',
    };
  }

  let net = 0;
  let gross = 0;
  let vatAmount = 0;

  if (isGrossInput) {
    // Brutto ist gegeben: Netto = Brutto / (1 + MwSt/100)
    gross = amount;
    net = gross / (1 + vatRate / 100);
    vatAmount = gross - net;
  } else {
    // Netto ist gegeben: Brutto = Netto * (1 + MwSt/100)
    net = amount;
    vatAmount = net * (vatRate / 100);
    gross = net + vatAmount;
  }

  return {
    primary: {
      id: isGrossInput ? 'net' : 'gross',
      label: isGrossInput ? 'Nettobetrag (ohne MwSt.)' : 'Bruttobetrag (inkl. MwSt.)',
      value: isGrossInput ? net : gross,
      formattedValue: formatCurrency(isGrossInput ? net : gross),
      highlight: true,
    },
    secondary: [
      { id: 'vatAmount', label: `Enthaltene Mehrwertsteuer (${formatPercent(vatRate, 0)})`, value: vatAmount, formattedValue: formatCurrency(vatAmount) },
      { id: 'netAmount', label: 'Nettobetrag', value: net, formattedValue: formatCurrency(net) },
      { id: 'grossAmount', label: 'Bruttobetrag', value: gross, formattedValue: formatCurrency(gross) },
      { id: 'law', label: 'Gesetzliche Grundlage', value: 'UStG § 12', formattedValue: 'UStG (Stand 2026)' },
    ],
    summaryText: `${formatCurrency(amount)} (${isGrossInput ? 'Brutto' : 'Netto'}) entsprechen bei ${formatPercent(vatRate, 0)} MwSt. genau ${formatCurrency(net)} netto und ${formatCurrency(gross)} brutto (enthaltene MwSt.: ${formatCurrency(vatAmount)}).`,
  };
}

export function calculateBreakEven(inputs: Record<string, any>): CalculationResult {
  const rawFixed = inputs.fixedCosts !== undefined && inputs.fixedCosts !== null && String(inputs.fixedCosts).trim() !== ''
    ? parseFloat(inputs.fixedCosts)
    : 6000;
  if (isNaN(rawFixed) || rawFixed < 0) {
    return {
      primary: { id: 'breakEvenUnits', label: 'Gewinnschwelle', value: 0, formattedValue: '0 Stück' },
      error: 'Fixkosten dürfen nicht negativ sein.',
    };
  }
  const fixedCosts = rawFixed;

  if (inputs.pricePerUnit === undefined || inputs.pricePerUnit === null || String(inputs.pricePerUnit).trim() === '') {
    return {
      primary: { id: 'breakEvenUnits', label: 'Gewinnschwelle', value: 0, formattedValue: '0 Stück' },
      error: 'Bitte geben Sie den Verkaufspreis pro Stück an.',
    };
  }
  const rawPrice = parseFloat(inputs.pricePerUnit);
  if (isNaN(rawPrice) || rawPrice <= 0) {
    return {
      primary: { id: 'breakEvenUnits', label: 'Gewinnschwelle', value: 0, formattedValue: '0 Stück' },
      error: 'Der Verkaufspreis pro Stück muss größer als 0 € sein.',
    };
  }
  const pricePerUnit = rawPrice;

  const rawVar = inputs.variableCostPerUnit !== undefined && inputs.variableCostPerUnit !== null && String(inputs.variableCostPerUnit).trim() !== ''
    ? parseFloat(inputs.variableCostPerUnit)
    : 30;
  if (isNaN(rawVar) || rawVar < 0) {
    return {
      primary: { id: 'breakEvenUnits', label: 'Gewinnschwelle', value: 0, formattedValue: '0 Stück' },
      error: 'Variable Stückkosten dürfen nicht negativ sein.',
    };
  }
  const variableCostPerUnit = rawVar;

  if (fixedCosts === 0) {
    const cm = pricePerUnit - variableCostPerUnit;
    const cmRatio = (cm / pricePerUnit) * 100;
    return {
      primary: {
        id: 'breakEvenUnits',
        label: 'Gewinnschwelle (Break-Even-Absatz)',
        value: 0,
        formattedValue: '0 Stück',
        highlight: true,
      },
      secondary: [
        { id: 'breakEvenRevenue', label: 'Mindestumsatz zur Kostendeckung', value: 0, formattedValue: '0,00 €' },
        { id: 'cm', label: 'Deckungsbeitrag pro Stück', value: cm, formattedValue: formatCurrency(cm) },
        { id: 'cmRatio', label: 'Deckungsbeitragsquote', value: cmRatio, formattedValue: formatPercent(cmRatio, 1) },
      ],
      summaryText: `Da keine Fixkosten anfallen (0,00 €), ist die Gewinnschwelle ab dem ersten Verkauf gedeckt.`,
    };
  }

  const contributionMargin = pricePerUnit - variableCostPerUnit; // Deckungsbeitrag pro Stück
  if (contributionMargin <= 0) {
    return {
      primary: { id: 'breakEvenUnits', label: 'Gewinnschwelle', value: 0, formattedValue: 'Nicht erreichbar' },
      error: 'Der Deckungsbeitrag ist negativ oder null: Variable Kosten übersteigen den Verkaufspreis.',
    };
  }

  const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin);
  const breakEvenRevenue = breakEvenUnits * pricePerUnit;
  const cmRatio = (contributionMargin / pricePerUnit) * 100;

  return {
    primary: {
      id: 'breakEvenUnits',
      label: 'Gewinnschwelle (Break-Even-Absatz)',
      value: breakEvenUnits,
      formattedValue: `${formatNumber(breakEvenUnits, 0)} Stück`,
      highlight: true,
    },
    secondary: [
      { id: 'breakEvenRevenue', label: 'Mindestumsatz zur Kostendeckung', value: breakEvenRevenue, formattedValue: formatCurrency(breakEvenRevenue) },
      { id: 'cm', label: 'Deckungsbeitrag pro Stück', value: contributionMargin, formattedValue: formatCurrency(contributionMargin) },
      { id: 'cmRatio', label: 'Deckungsbeitragsquote', value: cmRatio, formattedValue: formatPercent(cmRatio, 1) },
    ],
    summaryText: `Bei Fixkosten von ${formatCurrency(fixedCosts)} und einem Deckungsbeitrag von ${formatCurrency(contributionMargin)} pro Stück erreichen Sie die Gewinnschwelle (Break-Even) ab dem Verkauf von ${formatNumber(breakEvenUnits, 0)} Einheiten (Mindestumsatz: ${formatCurrency(breakEvenRevenue)}).`,
  };
}
