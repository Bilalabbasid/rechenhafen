import { CalculationResult, ResultItem } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent, formatDateDe } from '@/lib/formatters';

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
    directAnswer: `Eine Warmmiete von ${formatCurrency(warmRent)} entspricht ${formatPercent(ratio, 1)} Ihres Haushaltsnettoeinkommens von ${formatCurrency(netIncome)}. Bewertung nach der 30-%-Regel: ${assessment}.`,
    basisSummary: [
      { label: 'Monatliches Haushaltsnettoeinkommen', value: formatCurrency(netIncome) },
      { label: 'Monatliche Warmmiete', value: formatCurrency(warmRent) },
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
  if (inputs.purchasePrice === undefined || inputs.purchasePrice === null || String(inputs.purchasePrice).trim() === '') {
    return {
      primary: { id: 'netYield', label: 'Nettomietrendite', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie den Kaufpreis ein.',
    };
  }
  const purchasePrice = parseFloat(inputs.purchasePrice);
  if (isNaN(purchasePrice) || purchasePrice <= 0) {
    return {
      primary: { id: 'netYield', label: 'Nettomietrendite', value: 0, formattedValue: '-' },
      error: 'Der Kaufpreis muss größer als 0 € sein.',
    };
  }

  if (inputs.monthlyRentCold === undefined || inputs.monthlyRentCold === null || String(inputs.monthlyRentCold).trim() === '') {
    return {
      primary: { id: 'netYield', label: 'Nettomietrendite', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die monatliche Kaltmiete ein.',
    };
  }
  const monthlyRentCold = parseFloat(inputs.monthlyRentCold);
  if (isNaN(monthlyRentCold) || monthlyRentCold <= 0) {
    return {
      primary: { id: 'netYield', label: 'Nettomietrendite', value: 0, formattedValue: '-' },
      error: 'Die monatliche Kaltmiete muss größer als 0 € sein.',
    };
  }

  const purchaseFees = inputs.purchaseFees !== undefined && inputs.purchaseFees !== null && String(inputs.purchaseFees).trim() !== ''
    ? parseFloat(inputs.purchaseFees)
    : 0;
  if (isNaN(purchaseFees) || purchaseFees < 0) {
    return {
      primary: { id: 'netYield', label: 'Nettomietrendite', value: 0, formattedValue: '-' },
      error: 'Die Kaufnebenkosten dürfen nicht negativ sein.',
    };
  }

  const annualNonRecoverableCosts = inputs.annualNonRecoverableCosts !== undefined && inputs.annualNonRecoverableCosts !== null && String(inputs.annualNonRecoverableCosts).trim() !== ''
    ? parseFloat(inputs.annualNonRecoverableCosts)
    : 0;
  if (isNaN(annualNonRecoverableCosts) || annualNonRecoverableCosts < 0) {
    return {
      primary: { id: 'netYield', label: 'Nettomietrendite', value: 0, formattedValue: '-' },
      error: 'Die nicht umlegbaren Betriebskosten dürfen nicht negativ sein.',
    };
  }

  const totalInvestment = purchasePrice + purchaseFees;
  const annualGrossRent = monthlyRentCold * 12;

  // Bruttomietrendite = (Jahreskaltmiete / Kaufpreis) * 100
  const grossYield = (annualGrossRent / purchasePrice) * 100;

  // Nettomietrendite = ((Jahreskaltmiete - Bewirtschaftungskosten) / Gesamtinvestition) * 100
  const netAnnualIncome = annualGrossRent - annualNonRecoverableCosts;
  const netYield = (netAnnualIncome / totalInvestment) * 100;
  const factor = purchasePrice / annualGrossRent;

  const summaryText = purchaseFees === 0 && annualNonRecoverableCosts === 0
    ? `Unter der Annahme von 0,00 € Kaufnebenkosten und 0,00 € nicht umlegbaren Bewirtschaftungskosten beläuft sich die Gesamtinvestition auf ${formatCurrency(totalInvestment)}. Die Brutto- und Nettomietrendite betragen jeweils ${formatPercent(netYield, 2)} (Kaufpreisfaktor ${formatNumber(factor, 1)}). Hinweis: Beim regulären Immobilienerwerb fallen auch ohne Makler gesetzliche Grunderwerbsteuer, Notar- und Grundbuchkosten an.`
    : `Die Liegenschaft erzielt eine Bruttomietrendite von ${formatPercent(grossYield, 2)} (Faktor ${formatNumber(factor, 1)}). Unter Berücksichtigung von ${formatCurrency(purchaseFees)} Nebenkosten (Gesamtinvestition: ${formatCurrency(totalInvestment)}) und ${formatCurrency(annualNonRecoverableCosts)} nicht umlegbaren Jahreskosten beträgt die reale Nettomietrendite ${formatPercent(netYield, 2)}.`;

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
      { id: 'totalInvestment', label: 'Gesamtinvestition (Kaufpreis + Nebenkosten)', value: totalInvestment, formattedValue: formatCurrency(totalInvestment) },
      { id: 'factor', label: 'Kaufpreisfaktor (Vervielfältiger)', value: factor, formattedValue: `${formatNumber(factor, 1)} ×` },
      { id: 'annualRent', label: 'Jahreskaltmiete', value: annualGrossRent, formattedValue: formatCurrency(annualGrossRent) },
      { id: 'netIncome', label: 'Reiner Jahresreinertrag', value: netAnnualIncome, formattedValue: formatCurrency(netAnnualIncome) },
    ],
    summaryText,
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

function parseIsoDate(str: any): { year: number; month: number; day: number } | null {
  if (!str || typeof str !== 'string') return null;
  const match = str.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
}

export function calculateMieterhoehung(inputs: Record<string, any>): CalculationResult {
  const increaseType = inputs.increaseType || 'vergleichsmiete';

  if (increaseType === 'staffelmiete') {
    return {
      primary: {
        id: 'increaseType',
        label: 'Mieterhöhungstyp',
        value: 'Staffelmiete (§ 557a BGB)',
        formattedValue: 'Staffelmiete (§ 557a BGB)',
        highlight: true,
      },
      warning: 'Keine Anwendung von § 558 BGB: Während der Laufzeit einer Staffelmiete sind Mieterhöhungen bis zur Vergleichsmiete gesetzlich ausgeschlossen (§ 557a Abs. 2 BGB).',
      summaryText: 'Für Staffelmieten gilt § 558 BGB (Kappungsgrenze & Vergleichsmiete) nicht. Erhöhungen richten sich ausschließlich nach den im Mietvertrag vereinbarten Festbeträgen und Zeitpunkten. Nutzen Sie unseren spezialisierten Staffelmiete-Rechner (/rechner/staffelmiete-rechner/).',
      secondary: [
        { id: 'note', label: 'Hinweis', value: 'Sonderregelung', formattedValue: 'Staffelmiete schließt § 558 BGB aus' },
        { id: 'rechnerLink', label: 'Passender Rechner', value: '/rechner/staffelmiete-rechner/', formattedValue: 'Zum Staffelmiete-Rechner' },
      ],
    };
  }

  if (increaseType === 'indexmiete') {
    return {
      primary: {
        id: 'increaseType',
        label: 'Mieterhöhungstyp',
        value: 'Indexmiete (§ 557b BGB)',
        formattedValue: 'Indexmiete (§ 557b BGB)',
        highlight: true,
      },
      warning: 'Keine Anwendung von § 558 BGB: Eine Indexmiete richtet sich nach dem Verbraucherpreisindex (VPI) und schließt Mieterhöhungen nach Vergleichsmiete aus (§ 557b Abs. 2 BGB).',
      summaryText: 'Bei einem Indexmietvertrag (§ 557b BGB) ist die Nettokaltmiete an die Entwicklung der Lebenshaltungskosten (VPI) gekoppelt. Nutzen Sie unseren spezialisierten Indexmiete-Rechner (/rechner/indexmiete-rechner/).',
      secondary: [
        { id: 'note', label: 'Hinweis', value: 'Sonderregelung', formattedValue: 'Indexmiete schließt § 558 BGB aus' },
        { id: 'rechnerLink', label: 'Passender Rechner', value: '/rechner/indexmiete-rechner/', formattedValue: 'Zum Indexmiete-Rechner' },
      ],
    };
  }

  if (increaseType === 'modernisierung') {
    return {
      primary: {
        id: 'increaseType',
        label: 'Mieterhöhungstyp',
        value: 'Modernisierungsmieterhöhung (§ 559 BGB)',
        formattedValue: 'Modernisierungsumlage (§ 559 BGB)',
        highlight: true,
      },
      warning: 'Keine Anwendung von § 558 BGB: Modernisierungsmieterhöhungen unterliegen gesonderten Regelungen (Umlage von max. 8 % der Kosten jährlich, Kappung bei 2 bzw. 3 €/m²).',
      summaryText: 'Bauliche Modernisierungen berechtigen Vermieter zur Umlage von bis zu 8 % der aufgewendeten Kosten nach § 559 BGB. Sie unterliegen nicht der 3-Jahres-Kappungsgrenze der Vergleichsmiete. Nutzen Sie unseren Modernisierungsumlage-Rechner (/rechner/modernisierungsumlage-rechner/).',
      secondary: [
        { id: 'note', label: 'Hinweis', value: 'Sonderregelung', formattedValue: 'Modernisierung unterliegt § 559 BGB' },
        { id: 'rechnerLink', label: 'Passender Rechner', value: '/rechner/modernisierungsumlage-rechner/', formattedValue: 'Zum Modernisierungsumlage-Rechner' },
      ],
    };
  }

  if (increaseType === 'betriebskosten') {
    return {
      primary: {
        id: 'increaseType',
        label: 'Mieterhöhungstyp',
        value: 'Betriebskostenanpassung (§ 560 BGB)',
        formattedValue: 'Betriebskosten (§ 560 BGB)',
        highlight: true,
      },
      summaryText: 'Die Anpassung von Vorauszahlungen oder Pauschalen für Nebenkosten nach § 560 BGB betrifft nicht die Nettokaltmiete und fällt nicht unter die Kappungsgrenze nach § 558 BGB.',
      secondary: [
        { id: 'note', label: 'Hinweis', value: 'Nebenkosten', formattedValue: 'Erfordert formelle Nebenkostenabrechnung' },
      ],
    };
  }

  if (increaseType === 'unsicher') {
    return {
      primary: {
        id: 'increaseType',
        label: 'Mieterhöhungstyp',
        value: 'Prüfung erforderlich',
        formattedValue: 'Erhöhungsgrund klären',
        highlight: true,
      },
      summaryText: 'Prüfen Sie Ihr Mieterhöhungsschreiben: Beruft sich der Vermieter auf die ortsübliche Vergleichsmiete (z. B. Mietspiegel oder 3 Vergleichswohnungen), wählen Sie oben "Anpassung an die ortsübliche Vergleichsmiete (§ 558 BGB)".',
      secondary: [
        { id: 'note', label: 'Erste Schritte', value: 'Mietvertrag & Schreiben prüfen', formattedValue: 'Rechtsgrundlage im Schreiben ermitteln' },
      ],
    };
  }

  // --- STANDARD CASE: § 558 BGB ---
  const currentRent = parseFloat(inputs.currentRent);
  const entryMode = inputs.entryMode || 'amount';
  let proposedRent = parseFloat(inputs.proposedRent);
  if (entryMode === 'percent') {
    const pct = parseFloat(inputs.proposedPercent) || 0;
    proposedRent = Math.round(((currentRent || 0) * (1 + pct / 100)) * 100) / 100;
  }

  const rentThreeYearsAgo = parseFloat(inputs.rentThreeYearsAgo);
  const rawComparable = parseFloat(inputs.comparableRent);
  const comparableRent = !isNaN(rawComparable) && rawComparable > 0 ? rawComparable : 0;
  const capRate = parseFloat(inputs.kappungsgrenze) === 15 ? 15 : 20;

  if (isNaN(currentRent) || currentRent <= 0) {
    return {
      primary: { id: 'ceiling', label: 'Rechnerische Obergrenze nach Ihren Angaben', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie Ihre aktuelle monatliche Nettokaltmiete ein.',
    };
  }

  if (isNaN(proposedRent) || proposedRent <= 0) {
    return {
      primary: { id: 'ceiling', label: 'Rechnerische Obergrenze nach Ihren Angaben', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die vorgeschlagene neue Nettokaltmiete an.',
    };
  }

  // Cap ceiling based on rent 3 years ago
  const baseRent3Years = !isNaN(rentThreeYearsAgo) && rentThreeYearsAgo > 0 ? rentThreeYearsAgo : currentRent;
  const capCeiling = Math.round((baseRent3Years * (1 + capRate / 100)) * 100) / 100;

  // Numerical ceilings
  let lowerCeiling = capCeiling;
  let hasMissingComparable = false;

  if (comparableRent > 0) {
    lowerCeiling = Math.min(capCeiling, comparableRent);
  } else {
    hasMissingComparable = true;
    lowerCeiling = capCeiling;
  }

  // Differences
  const maxIncreaseAmount = Math.max(0, Math.round((lowerCeiling - currentRent) * 100) / 100);
  const excessAmount = Math.max(0, Math.round((proposedRent - lowerCeiling) * 100) / 100);
  const isExceeding = excessAmount > 0.01;

  // Date and timing checks (§ 558 Abs. 1 & § 558b BGB)
  const timingWarnings: string[] = [];
  let considerationEndFormatted = 'Nicht berechnet (Datum fehlt)';
  let earliestPaymentFormatted = 'Nicht berechnet (Datum fehlt)';

  const demandDateParts = parseIsoDate(inputs.demandReceivedDate);
  const lastIncreaseParts = parseIsoDate(inputs.lastIncreaseDate);

  if (demandDateParts) {
    const receiptYear = demandDateParts.year;
    const receiptMonth = demandDateParts.month;

    // 2nd month following:
    let consYear = receiptYear;
    let consMonth = receiptMonth + 2;
    if (consMonth > 12) {
      consYear += Math.floor((consMonth - 1) / 12);
      consMonth = ((consMonth - 1) % 12) + 1;
    }
    const lastDayCons = new Date(consYear, consMonth, 0).getDate();
    const consEndDate = new Date(consYear, consMonth - 1, lastDayCons);
    considerationEndFormatted = formatDateDe(consEndDate);

    // 3rd month following (payment month):
    let payYear = receiptYear;
    let payMonth = receiptMonth + 3;
    if (payMonth > 12) {
      payYear += Math.floor((payMonth - 1) / 12);
      payMonth = ((payMonth - 1) % 12) + 1;
    }
    const earliestPayDate = new Date(payYear, payMonth - 1, 1);
    earliestPaymentFormatted = formatDateDe(earliestPayDate);

    if (lastIncreaseParts) {
      const demandDate = new Date(demandDateParts.year, demandDateParts.month - 1, demandDateParts.day);
      const lastIncDate = new Date(lastIncreaseParts.year, lastIncreaseParts.month - 1, lastIncreaseParts.day);

      // 1. Wartefrist: frühestens 1 Jahr nach letzter Erhöhung geltend machen (§ 558 Abs. 1 Satz 1 BGB)
      const earliestDemandDate = new Date(lastIncreaseParts.year + 1, lastIncreaseParts.month - 1, lastIncreaseParts.day);
      const waitingPeriodPassed = demandDate.getTime() >= earliestDemandDate.getTime();
      if (!waitingPeriodPassed) {
        timingWarnings.push(
          `Wartefrist verletzt (§ 558 Abs. 1 Satz 1 BGB): Das Erhöhungsverlangen ging am ${formatDateDe(demandDate)} zu, frühestens zulässig wäre der ${formatDateDe(earliestDemandDate)} (12 Monate nach letzter Erhöhung).`
        );
      }

      // 2. 15-Monate-Frist bei Wirksamwerden (§ 558 Abs. 1 Satz 2 BGB):
      let req15Year = lastIncreaseParts.year;
      let req15Month = lastIncreaseParts.month + 15;
      if (req15Month > 12) {
        req15Year += Math.floor((req15Month - 1) / 12);
        req15Month = ((req15Month - 1) % 12) + 1;
      }
      const earliest15Date = new Date(req15Year, req15Month - 1, lastIncreaseParts.day);
      const fifteenMonthsPassed = earliestPayDate.getTime() >= earliest15Date.getTime();

      if (!fifteenMonthsPassed) {
        timingWarnings.push(
          `15-Monate-Sperrfrist beachten (§ 558 Abs. 1 Satz 2 BGB): Bei Zahlung zum ${formatDateDe(earliestPayDate)} wäre die Miete noch nicht seit 15 Monaten unverändert. Die Miete darf frühestens ab dem ${formatDateDe(earliest15Date)} steigen.`
        );
      }
    }
  }

  // Tenancy start check
  if (inputs.tenancyStartDate) {
    const tenancyParts = parseIsoDate(inputs.tenancyStartDate);
    if (tenancyParts && demandDateParts) {
      const tenDate = new Date(tenancyParts.year, tenancyParts.month - 1, tenancyParts.day);
      const demDate = new Date(demandDateParts.year, demandDateParts.month - 1, demandDateParts.day);
      const monthsSinceTenancy = (demDate.getFullYear() - tenDate.getFullYear()) * 12 + (demDate.getMonth() - tenDate.getMonth());
      if (monthsSinceTenancy < 12) {
        timingWarnings.push(
          `Mietvertragsbeginn liegt weniger als 12 Monate zurück (${formatDateDe(tenDate)}). Ein Mieterhöhungsverlangen nach § 558 BGB ist erst 12 Monate nach Mietbeginn zulässig.`
        );
      }
    }
  }

  const secondary: ResultItem[] = [
    {
      id: 'currentRent',
      label: 'Bisherige Nettokaltmiete',
      value: currentRent,
      formattedValue: formatCurrency(currentRent),
    },
    {
      id: 'proposedRent',
      label: 'Vorgeschlagene Nettokaltmiete',
      value: proposedRent,
      formattedValue: formatCurrency(proposedRent),
    },
    {
      id: 'capCeiling',
      label: `Kappungsgrenze (${capRate} % auf Miete vor 3 Jahren)`,
      value: capCeiling,
      formattedValue: `${formatCurrency(capCeiling)} (Basis vor 3 Jahren: ${formatCurrency(baseRent3Years)})`,
    },
    {
      id: 'comparableRent',
      label: 'Ortsübliche Vergleichsmiete (Mietspiegel)',
      value: comparableRent,
      formattedValue: comparableRent > 0 ? formatCurrency(comparableRent) : 'Nicht angegeben (vorläufig)',
    },
    {
      id: 'maxIncrease',
      label: 'Rechnerischer Erhöhungsspielraum',
      value: maxIncreaseAmount,
      formattedValue: `${formatCurrency(maxIncreaseAmount)} (+${formatPercent(currentRent > 0 ? (maxIncreaseAmount / currentRent) * 100 : 0, 1)})`,
    },
    {
      id: 'excessAmount',
      label: 'Überschreitung der Obergrenze',
      value: excessAmount,
      formattedValue: isExceeding ? formatCurrency(excessAmount) : 'Keine Überschreitung',
      highlight: isExceeding,
    },
    {
      id: 'considerationEnd',
      label: 'Überlegungsfrist Mieter (§ 558b Abs. 2 BGB)',
      value: considerationEndFormatted,
      formattedValue: considerationEndFormatted,
    },
    {
      id: 'earliestPayment',
      label: 'Frühestmöglicher Zahlungsbeginn (§ 558b Abs. 1 BGB)',
      value: earliestPaymentFormatted,
      formattedValue: earliestPaymentFormatted,
    },
  ];

  let warning: string | undefined;
  if (isExceeding && timingWarnings.length > 0) {
    warning = `Die Forderung (${formatCurrency(proposedRent)}) übersteigt die Obergrenze um ${formatCurrency(excessAmount)}/Monat. Zudem bestehen Fristkonflikte: ${timingWarnings.join(' ')}`;
  } else if (isExceeding) {
    warning = `Die geforderte Miete (${formatCurrency(proposedRent)}) liegt um ${formatCurrency(excessAmount)}/Monat über der rechnerischen Obergrenze (${formatCurrency(lowerCeiling)}).`;
  } else if (timingWarnings.length > 0) {
    warning = `Fristenhinweis nach § 558 BGB: ${timingWarnings.join(' ')}`;
  } else if (hasMissingComparable) {
    warning = 'Hinweis: Es wurde keine ortsübliche Vergleichsmiete angegeben. Die rechnerische Obergrenze basiert vorläufig allein auf der 3-Jahres-Kappungsgrenze.';
  }

  const primaryCeiling = lowerCeiling;
  const summary = `Rechnerische Obergrenze nach Ihren Angaben: ${formatCurrency(primaryCeiling)} (Kappungsgrenze: ${formatCurrency(capCeiling)}${comparableRent > 0 ? `, Vergleichsmiete: ${formatCurrency(comparableRent)}` : ''}). ${isExceeding ? `Die Forderung von ${formatCurrency(proposedRent)} übersteigt diesen Wert um ${formatCurrency(excessAmount)} monatlich.` : `Die geforderte Miete von ${formatCurrency(proposedRent)} liegt innerhalb dieser rechnerischen Grenze.`}`;

  return {
    primary: {
      id: 'ceiling',
      label: 'Rechnerische Obergrenze nach Ihren Angaben',
      value: primaryCeiling,
      formattedValue: formatCurrency(primaryCeiling),
      highlight: true,
    },
    secondary,
    summaryText: summary,
    warning,
  };
}

