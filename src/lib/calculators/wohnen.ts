import { CalculationResult } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';

export function calculateRentBurden(inputs: Record<string, any>): CalculationResult {
  const netIncome = parseFloat(inputs.netIncome) || 3000;
  const warmRent = parseFloat(inputs.warmRent) || 900;

  if (netIncome <= 0) {
    return {
      primary: { id: 'ratio', label: 'Mietbelastungsquote', value: 0, formattedValue: '0 %' },
      error: 'Das monatliche Haushaltsnettoeinkommen muss positiv sein.',
    };
  }

  const ratio = (warmRent / netIncome) * 100;
  const remaining = netIncome - warmRent;

  let assessment = 'Optimal (unter 30 %)';
  if (ratio > 40) {
    assessment = 'Kritisch hoch (über 40 % des Einkommens)';
  } else if (ratio > 30) {
    assessment = 'Erhöht (zwischen 30 % und 40 %)';
  }

  return {
    primary: {
      id: 'ratio',
      label: 'Mietbelastungsquote',
      value: ratio,
      formattedValue: formatPercent(ratio, 1),
      highlight: true,
    },
    secondary: [
      { id: 'assessment', label: 'Einschätzung (30%-Faustregel)', value: assessment, formattedValue: assessment },
      { id: 'remainingIncome', label: 'Verbleibendes Einkommen nach Miete', value: remaining, formattedValue: formatCurrency(remaining) },
      { id: 'recommendedMaxRent', label: 'Empfohlene Maximalmiete (30 %)', value: netIncome * 0.3, formattedValue: formatCurrency(netIncome * 0.3) },
    ],
    summaryText: `Ihre Warmmiete von ${formatCurrency(warmRent)} macht ${formatPercent(ratio, 1)} Ihres monatlichen Nettoeinkommens von ${formatCurrency(netIncome)} aus. Es verbleiben ${formatCurrency(remaining)} für Lebenshaltung, Sparen und Freizeit. Bewertung: ${assessment}.`,
  };
}

const STATE_TRANSFER_TAX: Record<string, number> = {
  BY: 3.5,
  BW: 5.0,
  HB: 5.0,
  NI: 5.0,
  RP: 5.0,
  TH: 5.0,
  HH: 5.5,
  SN: 5.5,
  BE: 6.0,
  HE: 6.0,
  MV: 6.0,
  ST: 6.0,
  BB: 6.5,
  NW: 6.5,
  SL: 6.5,
  SH: 6.5,
};

const STATE_NAMES: Record<string, string> = {
  BY: 'Bayern (3,5 %)',
  BW: 'Baden-Württemberg (5,0 %)',
  BE: 'Berlin (6,0 %)',
  BB: 'Brandenburg (6,5 %)',
  HB: 'Bremen (5,0 %)',
  HH: 'Hamburg (5,5 %)',
  HE: 'Hessen (6,0 %)',
  MV: 'Mecklenburg-Vorpommern (6,0 %)',
  NI: 'Niedersachsen (5,0 %)',
  NW: 'Nordrhein-Westfalen (6,5 %)',
  RP: 'Rheinland-Pfalz (5,0 %)',
  SL: 'Saarland (6,5 %)',
  SN: 'Sachsen (5,5 %)',
  ST: 'Sachsen-Anhalt (6,0 %)',
  SH: 'Schleswig-Holstein (6,5 %)',
  TH: 'Thüringen (5,0 %)',
};

export function calculatePropertyPurchaseFees(inputs: Record<string, any>): CalculationResult {
  const purchasePrice = parseFloat(inputs.purchasePrice) || 350000;
  const stateCode = inputs.federalState as string;
  let stateRate = 5.0;
  if (stateCode && STATE_TRANSFER_TAX[stateCode] !== undefined) {
    stateRate = STATE_TRANSFER_TAX[stateCode];
  } else if (inputs.transferTaxRate !== undefined) {
    stateRate = parseFloat(inputs.transferTaxRate) || 5.0;
  }

  const notaryRate = parseFloat(inputs.notaryRate) || 1.5; // Notar ca. 1.5%
  const landRegistryRate = parseFloat(inputs.landRegistryRate) || 0.5; // Grundbuchamt ca. 0.5%
  
  let realtorRate = 3.57;
  if (inputs.realtorOption === 'none') {
    realtorRate = 0;
  } else if (inputs.realtorRate !== undefined) {
    realtorRate = parseFloat(inputs.realtorRate);
    if (isNaN(realtorRate)) realtorRate = 3.57;
  }

  if (purchasePrice <= 0) {
    return {
      primary: { id: 'totalFees', label: 'Kaufnebenkosten', value: 0, formattedValue: '0,00 €' },
      error: 'Bitte geben Sie einen positiven Kaufpreis an.',
    };
  }

  const transferTax = purchasePrice * (stateRate / 100);
  const notaryFees = purchasePrice * (notaryRate / 100);
  const landRegistryFees = purchasePrice * (landRegistryRate / 100);
  const realtorFees = purchasePrice * (realtorRate / 100);

  const totalFees = transferTax + notaryFees + landRegistryFees + realtorFees;
  const totalCost = purchasePrice + totalFees;
  const feesPercent = (totalFees / purchasePrice) * 100;

  const stateName = stateCode && STATE_NAMES[stateCode] ? STATE_NAMES[stateCode] : `${formatPercent(stateRate)}`;

  return {
    primary: {
      id: 'totalFees',
      label: 'Gesamte Kaufnebenkosten',
      value: totalFees,
      formattedValue: formatCurrency(totalFees),
      highlight: true,
    },
    secondary: [
      { id: 'totalCost', label: 'Gesamtkosten (Kaufpreis + Nebenkosten)', value: totalCost, formattedValue: formatCurrency(totalCost) },
      { id: 'transferTax', label: `Grunderwerbsteuer (${stateName})`, value: transferTax, formattedValue: formatCurrency(transferTax) },
      { id: 'notary', label: `Notarkosten (${formatPercent(notaryRate)})`, value: notaryFees, formattedValue: formatCurrency(notaryFees) },
      { id: 'landRegistry', label: `Grundbucheintrag (${formatPercent(landRegistryRate)})`, value: landRegistryFees, formattedValue: formatCurrency(landRegistryFees) },
      { id: 'realtor', label: `Maklerprovision (${formatPercent(realtorRate)})`, value: realtorFees, formattedValue: formatCurrency(realtorFees) },
      { id: 'feesPercent', label: 'Nebenkostenanteil am Kaufpreis', value: feesPercent, formattedValue: formatPercent(feesPercent, 2) },
    ],
    summaryText: `Bei einem Immobilienkaufpreis von ${formatCurrency(purchasePrice)} fallen in ${stateCode ? STATE_NAMES[stateCode]?.split(' ')[0] : 'diesem Bundesland'} ca. ${formatCurrency(totalFees)} (${formatPercent(feesPercent, 1)}) an Kaufnebenkosten an. Die Gesamtinvestition beläuft sich auf ${formatCurrency(totalCost)}.`,
  };
}

export function calculateRentalYield(inputs: Record<string, any>): CalculationResult {
  const purchasePrice = parseFloat(inputs.purchasePrice) || 250000;
  const purchaseFees = parseFloat(inputs.purchaseFees) || 25000;
  const monthlyRentCold = parseFloat(inputs.monthlyRentCold) || 850;
  const annualNonRecoverableCosts = parseFloat(inputs.annualNonRecoverableCosts) || 1200; // Verwaltung, Instandhaltungsrücklage

  const totalInvestment = purchasePrice + purchaseFees;
  const annualGrossRent = monthlyRentCold * 12;

  if (purchasePrice <= 0 || annualGrossRent <= 0) {
    return {
      primary: { id: 'netYield', label: 'Nettomietrendite', value: 0, formattedValue: '0 %' },
      error: 'Bitte positive Werte für Kaufpreis und Kaltmiete eingeben.',
    };
  }

  // Bruttomietrendite = (Jahreskaltmiete / Kaufpreis) * 100
  const grossYield = (annualGrossRent / purchasePrice) * 100;

  // Nettomietrendite = ((Jahreskaltmiete - Bewirtschaftungskosten) / Gesamtinvestition) * 100
  const netAnnualIncome = annualGrossRent - annualNonRecoverableCosts;
  const netYield = (netAnnualIncome / totalInvestment) * 100;
  const factor = purchasePrice / annualGrossRent;

  return {
    primary: {
      id: 'netYield',
      label: 'Nettomietrendite (p.a.)',
      value: netYield,
      formattedValue: formatPercent(netYield, 2),
      highlight: true,
    },
    secondary: [
      { id: 'grossYield', label: 'Bruttomietrendite (p.a.)', value: grossYield, formattedValue: formatPercent(grossYield, 2) },
      { id: 'factor', label: 'Kaufpreisfaktor (Vervielfältiger)', value: factor, formattedValue: `${formatNumber(factor, 1)} ×` },
      { id: 'annualRent', label: 'Jahreskaltmiete', value: annualGrossRent, formattedValue: formatCurrency(annualGrossRent) },
      { id: 'netIncome', label: 'Reiner Jahresreinertrag', value: netAnnualIncome, formattedValue: formatCurrency(netAnnualIncome) },
    ],
    summaryText: `Die Liegenschaft erzielt eine Bruttomietrendite von ${formatPercent(grossYield, 2)} (Faktor ${formatNumber(factor, 1)}). Nach Abzug der nicht umlegbaren Kosten und unter Berücksichtigung der Nebenkosten beträgt die reale Nettomietrendite ${formatPercent(netYield, 2)}.`,
  };
}

export function calculatePricePerSquareMeter(inputs: Record<string, any>): CalculationResult {
  const totalPrice = parseFloat(inputs.totalPrice) || 320000;
  const livingArea = parseFloat(inputs.livingArea) || 85;

  if (livingArea <= 0) {
    return {
      primary: { id: 'priceSqm', label: 'Quadratmeterpreis', value: 0, formattedValue: '0,00 €/m²' },
      error: 'Die Wohnfläche muss größer als 0 m² sein.',
    };
  }

  const pricePerSqm = totalPrice / livingArea;

  return {
    primary: {
      id: 'pricePerSqm',
      label: 'Preis pro Quadratmeter',
      value: pricePerSqm,
      formattedValue: `${formatCurrency(pricePerSqm)} / m²`,
      highlight: true,
    },
    secondary: [
      { id: 'totalPrice', label: 'Gesamtbetrag', value: totalPrice, formattedValue: formatCurrency(totalPrice) },
      { id: 'livingArea', label: 'Wohnfläche', value: livingArea, formattedValue: `${formatNumber(livingArea, 1)} m²` },
    ],
    summaryText: `Bei einem Gesamtpreis von ${formatCurrency(totalPrice)} und ${formatNumber(livingArea, 1)} m² Wohnfläche beträgt der Quadratmeterpreis ${formatCurrency(pricePerSqm)} pro m².`,
  };
}

export function calculateRentBudget(inputs: Record<string, any>): CalculationResult {
  const netIncome = parseFloat(inputs.netIncome) || 3000;
  const targetPercent = parseFloat(inputs.targetPercent) || 30;

  if (netIncome <= 0) {
    return {
      primary: { id: 'maxRent', label: 'Maximal empfohlene Warmmiete', value: 0, formattedValue: '0,00 €' },
      error: 'Bitte geben Sie ein positives Nettoeinkommen an.',
    };
  }

  const maxWarmRent = netIncome * (targetPercent / 100);
  const remaining = netIncome - maxWarmRent;
  const conservativeRent = netIncome * 0.25;
  const hardCeilingRent = netIncome * 0.40;
  const estimatedColdRent = maxWarmRent * 0.75; // ca. 25% Nebenkosten/Heizung

  return {
    primary: {
      id: 'maxRent',
      label: `Empfohlenes Mietbudget (${formatPercent(targetPercent, 0)})`,
      value: maxWarmRent,
      formattedValue: formatCurrency(maxWarmRent),
      highlight: true,
    },
    secondary: [
      { id: 'remaining', label: 'Verbleibendes Netto für Lebenshaltung', value: remaining, formattedValue: formatCurrency(remaining) },
      { id: 'coldRentEst', label: 'Geschätzte Kaltmiete (bei ca. 25 % NK)', value: estimatedColdRent, formattedValue: formatCurrency(estimatedColdRent) },
      { id: 'conservative', label: 'Sparsam (25 % des Einkommens)', value: conservativeRent, formattedValue: formatCurrency(conservativeRent) },
      { id: 'hardCeiling', label: 'Schmerzgrenze (40 % Höchstlimit)', value: hardCeilingRent, formattedValue: formatCurrency(hardCeilingRent) },
    ],
    summaryText: `Bei einem Nettoeinkommen von ${formatCurrency(netIncome)} und einer Mietquote von ${formatPercent(targetPercent, 0)} beträgt Ihr maximales monatliches Warmmiet-Budget ${formatCurrency(maxWarmRent)}. Nach Abzug der Miete verbleiben Ihnen ${formatCurrency(remaining)} für alle weiteren Lebenshaltungskosten.`,
  };
}

