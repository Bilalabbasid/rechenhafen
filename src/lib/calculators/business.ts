import { CalculationResult } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';
import { GERMAN_DATA_2026 } from '@/data/regulated/2026';

export function calculateMargin(inputs: Record<string, any>): CalculationResult {
  const purchasePrice = parseFloat(inputs.purchasePrice) || 50; // Einkaufspreis netto
  const sellingPrice = parseFloat(inputs.sellingPrice) || 100;   // Verkaufspreis netto

  if (purchasePrice <= 0 || sellingPrice <= 0) {
    return {
      primary: { id: 'margin', label: 'Handelsmarge', value: 0, formattedValue: '0 %' },
      error: 'Einkaufs- und Verkaufspreis müssen größer als 0 sein.',
    };
  }

  const grossProfit = sellingPrice - purchasePrice;
  // Handelsspanne (Marge) = (Gewinn / Verkaufspreis) * 100
  const marginPercent = (grossProfit / sellingPrice) * 100;
  // Aufschlagssatz = (Gewinn / Einkaufspreis) * 100
  const markupPercent = (grossProfit / purchasePrice) * 100;

  return {
    primary: {
      id: 'margin',
      label: 'Handelsspanne (Marge auf VK)',
      value: marginPercent,
      formattedValue: formatPercent(marginPercent, 2),
      highlight: true,
    },
    secondary: [
      { id: 'markup', label: 'Kalkulationsaufschlag (auf EK)', value: markupPercent, formattedValue: formatPercent(markupPercent, 2) },
      { id: 'grossProfit', label: 'Rohgewinn pro Stück', value: grossProfit, formattedValue: formatCurrency(grossProfit) },
      { id: 'factor', label: 'Kalkulationsfaktor', value: sellingPrice / purchasePrice, formattedValue: `${formatNumber(sellingPrice / purchasePrice, 2)} ×` },
    ],
    summaryText: `Bei einem Einkaufspreis von ${formatCurrency(purchasePrice)} und Verkaufspreis von ${formatCurrency(sellingPrice)} erzielen Sie ${formatCurrency(grossProfit)} Rohertrag. Das entspricht einer Handelsmarge von ${formatPercent(marginPercent, 2)} bzw. einem Aufschlag von ${formatPercent(markupPercent, 2)} auf den Einkaufspreis.`,
  };
}

export function calculateVat(inputs: Record<string, any>): CalculationResult {
  const amount = parseFloat(inputs.amount) || 100;
  const isGrossInput = inputs.direction === 'grossToNet'; // Bruttopreis gegeben
  const vatRate = parseFloat(inputs.vatRate) || GERMAN_DATA_2026.mwst_regulaer.value; // 19% oder 7%

  if (amount <= 0) {
    return {
      primary: { id: 'vat', label: 'MwSt', value: 0, formattedValue: '0,00 €' },
      error: 'Der Betrag muss positiv sein.',
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
  const fixedCosts = parseFloat(inputs.fixedCosts) || 5000;
  const pricePerUnit = parseFloat(inputs.pricePerUnit) || 50;
  const variableCostPerUnit = parseFloat(inputs.variableCostPerUnit) || 20;

  if (fixedCosts <= 0 || pricePerUnit <= 0) {
    return {
      primary: { id: 'breakEvenUnits', label: 'Gewinnschwelle', value: 0, formattedValue: '0 Stück' },
      error: 'Fixkosten und Verkaufspreis müssen positiv sein.',
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
