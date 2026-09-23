import { CalculationResult } from '@/types/calculator';
import { formatNumber, formatCurrency } from '@/lib/formatters';
import { GERMAN_DATA_2026 } from '@/data/regulated/2026';

export function calculateElectricityCost(inputs: Record<string, any>): CalculationResult {
  const watts = parseFloat(inputs.watts) || 100;
  const rawTime = parseFloat(inputs.usageTime || inputs.hoursPerDay) || 4;
  const timeUnit = inputs.usageTimeUnit || 'hoursPerDay'; // 'hoursPerDay', 'minutesPerDay', 'hoursPerWeek', 'hoursPerYear'
  const pricePerKwh = parseFloat(inputs.pricePerKwh) || GERMAN_DATA_2026.strompreis_durchschnitt.value;

  if (watts <= 0 || rawTime <= 0 || pricePerKwh <= 0) {
    return {
      primary: { id: 'annualCost', label: 'Stromkosten pro Jahr', value: 0, formattedValue: '0,00 €' },
      error: 'Bitte positive Werte für Leistung, Nutzungsdauer und Strompreis angeben.',
    };
  }

  // Effektive Stunden pro Tag berechnen
  let effectiveHoursPerDay = rawTime;
  if (timeUnit === 'minutesPerDay') {
    effectiveHoursPerDay = rawTime / 60;
  } else if (timeUnit === 'hoursPerWeek') {
    effectiveHoursPerDay = rawTime / 7;
  } else if (timeUnit === 'hoursPerYear') {
    effectiveHoursPerDay = rawTime / 365;
  }

  // Täglicher Verbrauch in kWh
  const kwhPerDay = (watts * effectiveHoursPerDay) / 1000;
  const kwhPerYear = kwhPerDay * 365;
  const kwhPerMonth = kwhPerYear / 12;

  const costPerDay = kwhPerDay * pricePerKwh;
  const costPerMonth = kwhPerMonth * pricePerKwh;
  const costPerYear = kwhPerYear * pricePerKwh;

  let unitText = `${formatNumber(rawTime, 1)} Stunden pro Tag`;
  if (timeUnit === 'minutesPerDay') unitText = `${formatNumber(rawTime, 0)} Minuten pro Tag`;
  else if (timeUnit === 'hoursPerWeek') unitText = `${formatNumber(rawTime, 1)} Stunden pro Woche`;
  else if (timeUnit === 'hoursPerYear') unitText = `${formatNumber(rawTime, 0)} Stunden pro Jahr`;

  return {
    primary: {
      id: 'costPerYear',
      label: 'Stromkosten pro Jahr',
      value: costPerYear,
      formattedValue: formatCurrency(costPerYear),
      highlight: true,
    },
    secondary: [
      { id: 'costPerMonth', label: 'Stromkosten pro Monat', value: costPerMonth, formattedValue: formatCurrency(costPerMonth) },
      { id: 'costPerDay', label: 'Stromkosten pro Tag', value: costPerDay, formattedValue: formatCurrency(costPerDay) },
      { id: 'kwhPerYear', label: 'Jahresverbrauch', value: kwhPerYear, formattedValue: `${formatNumber(kwhPerYear, 1)} kWh / Jahr` },
      { id: 'kwhPerMonth', label: 'Monatsverbrauch', value: kwhPerMonth, formattedValue: `${formatNumber(kwhPerMonth, 2)} kWh / Monat` },
      { id: 'kwhPerDay', label: 'Tagesverbrauch', value: kwhPerDay, formattedValue: `${formatNumber(kwhPerDay, 3)} kWh / Tag` },
    ],
    summaryText: `Ein Elektrogerät mit ${formatNumber(watts)} Watt Leistung verursacht bei ${unitText} und einem Strompreis von ${formatCurrency(pricePerKwh)}/kWh jährliche Kosten von ${formatCurrency(costPerYear)} (${formatNumber(kwhPerYear, 1)} kWh).`,
  };
}

export function calculateStandbyCost(inputs: Record<string, any>): CalculationResult {
  const standbyWatts = parseFloat(inputs.standbyWatts) || 25; // Gesamte Standby-Leistung aller Geräte
  const hoursPerDay = parseFloat(inputs.hoursPerDay) || 20;
  const pricePerKwh = parseFloat(inputs.pricePerKwh) || GERMAN_DATA_2026.strompreis_durchschnitt.value;

  if (standbyWatts <= 0) {
    return {
      primary: { id: 'standbyCost', label: 'Standby-Kosten pro Jahr', value: 0, formattedValue: '0,00 €' },
      summaryText: 'Kein Standby-Verbrauch eingegeben.',
    };
  }

  const kwhYear = (standbyWatts * hoursPerDay * 365) / 1000;
  const annualCost = kwhYear * pricePerKwh;
  const monthlyCost = annualCost / 12;

  return {
    primary: {
      id: 'annualCost',
      label: 'Unnötige Standby-Kosten pro Jahr',
      value: annualCost,
      formattedValue: formatCurrency(annualCost),
      highlight: true,
    },
    secondary: [
      { id: 'monthlyCost', label: 'Standby-Kosten monatlich', value: monthlyCost, formattedValue: formatCurrency(monthlyCost) },
      { id: 'wastedKwh', label: 'Verschwendeter Jahresstrom', value: kwhYear, formattedValue: `${formatNumber(kwhYear, 1)} kWh` },
      { id: 'tip', label: 'Spartipp', value: 'Steckerleiste mit Schalter', formattedValue: 'Mit abschaltbaren Steckdosenleisten zu 100 % vermeidbar' },
    ],
    summaryText: `Durch den Standby-Betrieb von Geräten mit insgesamt ${formatNumber(standbyWatts)} Watt verbrauchen Sie im Jahr ${formatNumber(kwhYear, 1)} kWh ungenutzt. Das kostet Sie rund ${formatCurrency(annualCost)} im Jahr.`,
  };
}

export function calculateGasCost(inputs: Record<string, any>): CalculationResult {
  const inputType = inputs.inputType || 'kwh'; // 'kwh' or 'm3'
  const amount = parseFloat(inputs.amount) || 12000;
  const calorificValue = parseFloat(inputs.calorificValue) || 10.3; // Brennwert kWh/m³
  const stateFactor = parseFloat(inputs.stateFactor) || 0.95; // Zustandszahl z
  const pricePerKwh = parseFloat(inputs.pricePerKwh) || GERMAN_DATA_2026.gaspreis_durchschnitt.value;
  const basePricePerMonth = parseFloat(inputs.basePricePerMonth) || 12.0;

  let totalKwh = amount;
  if (inputType === 'm3') {
    // kWh = m³ * Brennwert * Zustandszahl
    totalKwh = amount * calorificValue * stateFactor;
  }

  const workCost = totalKwh * pricePerKwh;
  const annualBaseCost = basePricePerMonth * 12;
  const totalAnnualCost = workCost + annualBaseCost;
  const monthlyAdvancePayment = totalAnnualCost / 12;

  return {
    primary: {
      id: 'totalAnnualCost',
      label: 'Gesamte Gaskosten pro Jahr',
      value: totalAnnualCost,
      formattedValue: formatCurrency(totalAnnualCost),
      highlight: true,
    },
    secondary: [
      { id: 'monthlyPayment', label: 'Empfohlener monatlicher Abschlag', value: monthlyAdvancePayment, formattedValue: formatCurrency(monthlyAdvancePayment) },
      { id: 'totalKwh', label: 'Verbrauch in kWh', value: totalKwh, formattedValue: `${formatNumber(totalKwh, 0)} kWh` },
      { id: 'workCost', label: 'Reine Arbeitspreiskosten', value: workCost, formattedValue: formatCurrency(workCost) },
      { id: 'baseCost', label: 'Grundpreis pro Jahr', value: annualBaseCost, formattedValue: formatCurrency(annualBaseCost) },
    ],
    summaryText: `Bei einem Gasverbrauch von ${formatNumber(totalKwh, 0)} kWh und ${formatCurrency(pricePerKwh)}/kWh Arbeitspreis betragen die jährlichen Gesamtkosten inkl. Grundgebühr ${formatCurrency(totalAnnualCost)}. Der monatliche Abschlag liegt bei ${formatCurrency(monthlyAdvancePayment)}.`,
  };
}

export function calculateLedSavings(inputs: Record<string, any>): CalculationResult {
  const oldWatts = parseFloat(inputs.oldWatts) || 60; // z.B. 60W Glühbirne
  const ledWatts = parseFloat(inputs.ledWatts) || 7;  // z.B. 7W LED
  const bulbCount = parseInt(inputs.bulbCount || '10', 10);
  const hoursPerDay = parseFloat(inputs.hoursPerDay) || 4;
  const pricePerKwh = parseFloat(inputs.pricePerKwh) || GERMAN_DATA_2026.strompreis_durchschnitt.value;

  const savedWattsPerBulb = Math.max(0, oldWatts - ledWatts);
  const totalSavedKwhYear = (savedWattsPerBulb * bulbCount * hoursPerDay * 365) / 1000;
  const annualSavedMoney = totalSavedKwhYear * pricePerKwh;
  const co2SavedKg = totalSavedKwhYear * GERMAN_DATA_2026.co2_faktor_strommix.value;

  return {
    primary: {
      id: 'annualSaved',
      label: 'Jährliche Stromkosten-Ersparnis',
      value: annualSavedMoney,
      formattedValue: formatCurrency(annualSavedMoney),
      highlight: true,
    },
    secondary: [
      { id: 'kwhSaved', label: 'Eingesparter Strom pro Jahr', value: totalSavedKwhYear, formattedValue: `${formatNumber(totalSavedKwhYear, 0)} kWh` },
      { id: 'co2Saved', label: 'CO2-Vermeidung pro Jahr', value: co2SavedKg, formattedValue: `${formatNumber(co2SavedKg, 1)} kg CO2` },
      { id: 'fiveYearSavings', label: 'Ersparnis über 5 Jahre', value: annualSavedMoney * 5, formattedValue: formatCurrency(annualSavedMoney * 5) },
    ],
    summaryText: `Durch den Austausch von ${bulbCount} herkömmlichen Leuchtmitteln (${oldWatts} W) gegen sparsame LEDs (${ledWatts} W) sparen Sie bei ${formatNumber(hoursPerDay)} Std. täglicher Nutzung jährlich ${formatCurrency(annualSavedMoney)} und vermeiden ${formatNumber(co2SavedKg, 1)} kg CO2.`,
  };
}
