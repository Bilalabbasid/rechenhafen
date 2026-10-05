import { CalculationResult, ResultItem } from '@/types/calculator';
import { formatNumber, formatCurrency } from '@/lib/formatters';
import { GERMAN_DATA_2026 } from '@/data/regulated/2026';

export function calculateElectricityCost(inputs: Record<string, any>): CalculationResult {
  // Haushalt-Stromkostenrechner Modus (wenn annualKwh oder basePricePerMonth vorhanden oder kein watts übergeben)
  if (inputs.annualKwh !== undefined || inputs.basePricePerMonth !== undefined || inputs.watts === undefined) {
    if (inputs.annualKwh === undefined || inputs.annualKwh === null || String(inputs.annualKwh).trim() === '') {
      return {
        primary: { id: 'totalCost', label: 'Gesamte Stromkosten pro Jahr', value: 0, formattedValue: '-' },
        error: 'Bitte geben Sie Ihren jährlichen Stromverbrauch in kWh ein.',
      };
    }
    const annualKwh = parseFloat(inputs.annualKwh);
    if (isNaN(annualKwh) || annualKwh < 0) {
      return {
        primary: { id: 'totalCost', label: 'Gesamte Stromkosten pro Jahr', value: 0, formattedValue: '-' },
        error: 'Der Stromverbrauch in kWh darf nicht negativ sein.',
      };
    }

    if (inputs.pricePerKwh === undefined || inputs.pricePerKwh === null || String(inputs.pricePerKwh).trim() === '') {
      return {
        primary: { id: 'totalCost', label: 'Gesamte Stromkosten pro Jahr', value: 0, formattedValue: '-' },
        error: 'Bitte geben Sie den Arbeitspreis pro kWh ein.',
      };
    }
    const pricePerKwh = parseFloat(inputs.pricePerKwh);
    if (isNaN(pricePerKwh) || pricePerKwh < 0) {
      return {
        primary: { id: 'totalCost', label: 'Gesamte Stromkosten pro Jahr', value: 0, formattedValue: '-' },
        error: 'Der Arbeitspreis darf nicht negativ sein.',
      };
    }

    const basePricePerMonth = inputs.basePricePerMonth !== undefined && inputs.basePricePerMonth !== null && String(inputs.basePricePerMonth).trim() !== ''
      ? parseFloat(inputs.basePricePerMonth)
      : 12.0;
    if (isNaN(basePricePerMonth) || basePricePerMonth < 0) {
      return {
        primary: { id: 'totalCost', label: 'Gesamte Stromkosten pro Jahr', value: 0, formattedValue: '-' },
        error: 'Der monatliche Grundpreis darf nicht negativ sein.',
      };
    }

    const workCost = annualKwh * pricePerKwh;
    const annualBaseCost = basePricePerMonth * 12;
    const totalAnnualCost = workCost + annualBaseCost;
    const monthlyAverage = totalAnnualCost / 12;
    const dailyCost = totalAnnualCost / 365;

    return {
      primary: {
        id: 'totalCost',
        label: 'Gesamte Stromkosten pro Jahr',
        value: totalAnnualCost,
        formattedValue: formatCurrency(totalAnnualCost),
        highlight: true,
      },
      secondary: [
        {
          id: 'monthlyAverage',
          label: 'Rechnerischer Monatsdurchschnitt (Orientierung für den Abschlag)',
          value: monthlyAverage,
          formattedValue: formatCurrency(monthlyAverage),
          highlight: true,
          helpText: 'Reine rechnerische Orientierung (Jahreskosten ÷ 12). Der tatsächliche Abschlag Ihres Stromversorgers kann stichtags- oder anbieterbedingt abweichen.',
        },
        {
          id: 'workCost',
          label: 'Reine Verbrauchskosten (Arbeitspreis)',
          value: workCost,
          formattedValue: formatCurrency(workCost),
        },
        {
          id: 'baseCost',
          label: 'Fester Grundpreis pro Jahr',
          value: annualBaseCost,
          formattedValue: `${formatCurrency(annualBaseCost)} (${formatCurrency(basePricePerMonth)}/Monat)`,
        },
        {
          id: 'dailyCost',
          label: 'Durchschnittliche Stromkosten pro Tag',
          value: dailyCost,
          formattedValue: formatCurrency(dailyCost),
        },
        {
          id: 'annualKwh',
          label: 'Jahresverbrauch',
          value: annualKwh,
          formattedValue: `${formatNumber(annualKwh, 0)} kWh`,
        },
      ],
      summaryText: `Bei einem Jahresverbrauch von ${formatNumber(annualKwh, 0)} kWh und einem Arbeitspreis von ${formatCurrency(pricePerKwh, 2)}/kWh betragen die jährlichen Gesamtstromkosten inklusive ${formatCurrency(annualBaseCost)} Grundpreis ${formatCurrency(totalAnnualCost)}. Das entspricht einem monatlichen Durchschnitt von ${formatCurrency(monthlyAverage)}.`,
      directAnswer: `Bei einem Jahresverbrauch von ${formatNumber(annualKwh, 0)} kWh und einem Arbeitspreis von ${formatCurrency(pricePerKwh, 2)}/kWh betragen deine jährlichen Gesamtstromkosten inklusive ${formatCurrency(annualBaseCost)} Grundpreis ${formatCurrency(totalAnnualCost)} (durchschnittlich ${formatCurrency(monthlyAverage)} pro Monat).`,
      qualifications: [
        'Gesamtkosten inklusive des eingegebenen Grundpreises.',
        'Rechnerischer Monatsdurchschnitt (Jahreskosten ÷ 12); der tatsächliche Abschlag des Stromanbieters kann abweichen (z. B. 11 statt 12 Abschläge oder Rundungen).',
      ],
      calculationSteps: [
        `Verbrauchskosten = ${formatNumber(annualKwh, 0)} kWh × ${formatCurrency(pricePerKwh, 2)}/kWh = ${formatCurrency(workCost)}`,
        `Grundpreis = ${formatCurrency(basePricePerMonth)}/Monat × 12 Monate = ${formatCurrency(annualBaseCost)}`,
        `Gesamtkosten = ${formatCurrency(workCost)} + ${formatCurrency(annualBaseCost)} = ${formatCurrency(totalAnnualCost)}`,
        `Monatlicher Richtwert = ${formatCurrency(totalAnnualCost)} ÷ 12 Monate = ${formatCurrency(monthlyAverage)}`,
      ],
      basisSummary: [
        { label: 'Jahresverbrauch', value: `${formatNumber(annualKwh, 0)} kWh` },
        { label: 'Arbeitspreis', value: `${formatCurrency(pricePerKwh, 2)}/kWh` },
        { label: 'Grundpreis', value: `${formatCurrency(basePricePerMonth)}/Monat (${formatCurrency(annualBaseCost)}/Jahr)` },
        { label: 'Betrachtungszeitraum', value: '1 Jahr (365 Tage)' },
      ],
    };
  }

  // Geräte-Modus (Rückwärtskompatibilität für Geräte-Berechnungen mit watts)
  if (inputs.watts === undefined || inputs.watts === null || String(inputs.watts).trim() === '') {
    return {
      primary: { id: 'annualCost', label: 'Stromkosten pro Jahr', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die Leistungsaufnahme des Geräts in Watt ein.',
    };
  }
  const watts = parseFloat(inputs.watts);
  if (isNaN(watts) || watts <= 0) {
    return {
      primary: { id: 'annualCost', label: 'Stromkosten pro Jahr', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie eine gültige Leistung größer als 0 Watt an.',
    };
  }

  const timeVal = inputs.usageTime !== undefined && inputs.usageTime !== '' ? inputs.usageTime : inputs.hoursPerDay;
  if (timeVal === undefined || timeVal === null || String(timeVal).trim() === '') {
    return {
      primary: { id: 'annualCost', label: 'Stromkosten pro Jahr', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die tägliche Nutzungsdauer ein.',
    };
  }
  const rawTime = parseFloat(timeVal);
  if (isNaN(rawTime) || rawTime <= 0) {
    return {
      primary: { id: 'annualCost', label: 'Stromkosten pro Jahr', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie eine gültige Nutzungsdauer größer als 0 an.',
    };
  }

  if (inputs.pricePerKwh === undefined || inputs.pricePerKwh === null || String(inputs.pricePerKwh).trim() === '') {
    return {
      primary: { id: 'annualCost', label: 'Stromkosten pro Jahr', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie den Strompreis pro kWh ein.',
    };
  }
  const pricePerKwh = parseFloat(inputs.pricePerKwh);
  if (isNaN(pricePerKwh) || pricePerKwh < 0) {
    return {
      primary: { id: 'annualCost', label: 'Stromkosten pro Jahr', value: 0, formattedValue: '-' },
      error: 'Der Strompreis darf nicht negativ sein.',
    };
  }

  const timeUnit = inputs.usageTimeUnit || 'hoursPerDay'; // 'hoursPerDay', 'minutesPerDay', 'hoursPerWeek', 'hoursPerYear'

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
  const inputType = inputs.inputType || 'kwh'; // 'kwh' (Mode A) or 'm3' (Mode B)

  let totalKwh = 0;
  let volumeM3 = 0;
  let calorificValue = 10.3;
  let stateFactor = 0.95;
  let conversionFactor = 1;

  if (inputType === 'm3') {
    // Mode B: Meter readings or m³ volume
    if (inputs.meterOld !== undefined && inputs.meterNew !== undefined && String(inputs.meterOld).trim() !== '' && String(inputs.meterNew).trim() !== '') {
      const oldVal = parseFloat(inputs.meterOld);
      const newVal = parseFloat(inputs.meterNew);
      if (isNaN(oldVal) || oldVal < 0) {
        return {
          primary: { id: 'totalAnnualCost', label: 'Geschätzte Gesamtkosten pro Jahr', value: 0, formattedValue: '-' },
          error: 'Bitte geben Sie einen gültigen alten Zählerstand ab 0 m³ ein.',
        };
      }
      if (isNaN(newVal) || newVal < 0) {
        return {
          primary: { id: 'totalAnnualCost', label: 'Geschätzte Gesamtkosten pro Jahr', value: 0, formattedValue: '-' },
          error: 'Bitte geben Sie einen gültigen neuen Zählerstand ab 0 m³ ein.',
        };
      }
      if (newVal < oldVal) {
        return {
          primary: { id: 'totalAnnualCost', label: 'Geschätzte Gesamtkosten pro Jahr', value: 0, formattedValue: '-' },
          error: `Der neue Zählerstand (${formatNumber(newVal, 1)} m³) darf nicht kleiner sein als der alte Zählerstand (${formatNumber(oldVal, 1)} m³). Bei einem Zählerwechsel bitte die Differenz direkt eingeben.`,
        };
      }
      volumeM3 = newVal - oldVal;
    } else if (inputs.amount !== undefined && inputs.amount !== null && String(inputs.amount).trim() !== '') {
      const parsedAmount = parseFloat(inputs.amount);
      if (isNaN(parsedAmount) || parsedAmount < 0) {
        return {
          primary: { id: 'totalAnnualCost', label: 'Geschätzte Gesamtkosten pro Jahr', value: 0, formattedValue: '-' },
          error: 'Bitte geben Sie eine gültige Verbrauchsmenge in m³ ab 0 ein.',
        };
      }
      volumeM3 = parsedAmount;
    } else {
      return {
        primary: { id: 'totalAnnualCost', label: 'Geschätzte Gesamtkosten pro Jahr', value: 0, formattedValue: '-' },
        error: 'Bitte tragen Sie Ihre Zählerstände (alt und neu) oder das verbrauchte Gasvolumen in m³ ein.',
      };
    }

    if (inputs.calorificValue !== undefined && inputs.calorificValue !== null && String(inputs.calorificValue).trim() !== '') {
      calorificValue = parseFloat(inputs.calorificValue);
      if (isNaN(calorificValue) || calorificValue <= 0 || calorificValue < 5 || calorificValue > 25) {
        return {
          primary: { id: 'totalAnnualCost', label: 'Geschätzte Gesamtkosten pro Jahr', value: 0, formattedValue: '-' },
          error: 'Bitte geben Sie einen realistischen Brennwert ein (üblich sind ca. 9,5 bis 12,5 kWh/m³ laut Gasrechnung).',
        };
      }
    }

    if (inputs.stateFactor !== undefined && inputs.stateFactor !== null && String(inputs.stateFactor).trim() !== '') {
      stateFactor = parseFloat(inputs.stateFactor);
      if (isNaN(stateFactor) || stateFactor <= 0 || stateFactor < 0.5 || stateFactor > 1.5) {
        return {
          primary: { id: 'totalAnnualCost', label: 'Geschätzte Gesamtkosten pro Jahr', value: 0, formattedValue: '-' },
          error: 'Bitte geben Sie eine realistische Zustandszahl z ein (üblich sind ca. 0,90 bis 0,98 laut Gasrechnung).',
        };
      }
    }

    conversionFactor = calorificValue * stateFactor;
    totalKwh = volumeM3 * conversionFactor;
  } else {
    // Mode A: Annual usage in kWh
    const rawKwh = inputs.annualKwh !== undefined && inputs.annualKwh !== null && String(inputs.annualKwh).trim() !== ''
      ? inputs.annualKwh
      : inputs.amount;

    if (rawKwh === undefined || rawKwh === null || String(rawKwh).trim() === '') {
      return {
        primary: { id: 'totalAnnualCost', label: 'Geschätzte Gesamtkosten pro Jahr', value: 0, formattedValue: '-' },
        error: 'Bitte geben Sie Ihren Jahresverbrauch in kWh ein.',
      };
    }
    const parsedKwh = parseFloat(rawKwh);
    if (isNaN(parsedKwh) || parsedKwh < 0) {
      return {
        primary: { id: 'totalAnnualCost', label: 'Geschätzte Gesamtkosten pro Jahr', value: 0, formattedValue: '-' },
        error: 'Bitte geben Sie einen gültigen Jahresverbrauch ab 0 kWh ein.',
      };
    }
    totalKwh = parsedKwh;
  }

  // Arbeitspreis ermitteln (in €/kWh)
  if (inputs.pricePerKwh === undefined || inputs.pricePerKwh === null || String(inputs.pricePerKwh).trim() === '') {
    return {
      primary: { id: 'totalAnnualCost', label: 'Geschätzte Gesamtkosten pro Jahr', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie den Arbeitspreis ein.',
    };
  }
  const rawPrice = parseFloat(inputs.pricePerKwh);
  if (isNaN(rawPrice) || rawPrice < 0) {
    return {
      primary: { id: 'totalAnnualCost', label: 'Geschätzte Gesamtkosten pro Jahr', value: 0, formattedValue: '-' },
      error: 'Der Arbeitspreis darf nicht negativ sein (0 € ist zulässig).',
    };
  }
  // Falls Eingabe in Cent (z. B. 10.5 ct/kWh oder >= 1) bzw. Euro (z. B. 0.105 €/kWh)
  let pricePerKwhInEuro = rawPrice;
  if (inputs.priceUnit === 'ct') {
    pricePerKwhInEuro = rawPrice / 100;
  } else if (inputs.priceUnit === 'eur') {
    pricePerKwhInEuro = rawPrice;
  } else {
    // Auto-Erkennung: Werte >= 1 sind ct/kWh (z.B. 10.5 ct), Werte < 1 sind €/kWh (z.B. 0.105 €)
    pricePerKwhInEuro = rawPrice >= 1.0 ? rawPrice / 100 : rawPrice;
  }

  // Grundpreis ermitteln
  const rawBase = inputs.basePrice !== undefined && inputs.basePrice !== null && String(inputs.basePrice).trim() !== ''
    ? inputs.basePrice
    : inputs.basePricePerMonth;

  if (rawBase === undefined || rawBase === null || String(rawBase).trim() === '') {
    return {
      primary: { id: 'totalAnnualCost', label: 'Geschätzte Gesamtkosten pro Jahr', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie den Grundpreis ein (0 € falls kein Grundpreis erhoben wird).',
    };
  }
  const baseValue = parseFloat(rawBase);
  if (isNaN(baseValue) || baseValue < 0) {
    return {
      primary: { id: 'totalAnnualCost', label: 'Geschätzte Gesamtkosten pro Jahr', value: 0, formattedValue: '-' },
      error: 'Der Grundpreis darf nicht negativ sein (0 € ist zulässig).',
    };
  }

  const isYearlyBase = inputs.basePricePeriod === 'yearly';
  const annualBaseCost = isYearlyBase ? baseValue : baseValue * 12;
  const basePricePerMonth = isYearlyBase ? baseValue / 12 : baseValue;

  const workCost = totalKwh * pricePerKwhInEuro;
  const totalAnnualCost = workCost + annualBaseCost;
  const monthlyAdvancePayment = totalAnnualCost / 12;
  const dailyCost = totalAnnualCost / 365;

  const secondary: ResultItem[] = [
    {
      id: 'monthlyPayment',
      label: 'Durchschnittliche Kosten pro Monat (Orientierung)',
      value: monthlyAdvancePayment,
      formattedValue: formatCurrency(monthlyAdvancePayment),
      highlight: true,
      helpText: 'Reine rechnerische Orientierung (Jahreskosten ÷ 12). Der tatsächliche vertragliche Versorgerabschlag kann abweichen (z. B. 11 statt 12 Abschläge oder Rundungen).',
    },
    {
      id: 'workCost',
      label: 'Reine Verbrauchskosten (Arbeitspreis)',
      value: workCost,
      formattedValue: formatCurrency(workCost),
      helpText: `${formatNumber(totalKwh, 0)} kWh × ${formatCurrency(pricePerKwhInEuro, 4)}/kWh`,
    },
    {
      id: 'baseCost',
      label: 'Grundpreis pro Jahr',
      value: annualBaseCost,
      formattedValue: `${formatCurrency(annualBaseCost)} (${formatCurrency(basePricePerMonth)}/Monat)`,
    },
    {
      id: 'totalKwh',
      label: 'Thermisches Energievolumen (Verbrauch)',
      value: totalKwh,
      formattedValue: `${formatNumber(totalKwh, 0)} kWh`,
    },
    {
      id: 'dailyCost',
      label: 'Geschätzte Gaskosten pro Tag',
      value: dailyCost,
      formattedValue: formatCurrency(dailyCost),
    },
  ];

  if (inputType === 'm3') {
    secondary.splice(3, 0, {
      id: 'volumeM3',
      label: 'Abgelesenes Gasvolumen',
      value: volumeM3,
      formattedValue: `${formatNumber(volumeM3, 1)} m³`,
    });
    secondary.push({
      id: 'conversionFactor',
      label: 'Umrechnungsfaktor (Brennwert × Zustandszahl)',
      value: conversionFactor,
      formattedValue: `${formatNumber(conversionFactor, 3)} kWh/m³`,
      helpText: `Brennwert ${formatNumber(calorificValue, 2)} kWh/m³ × Zustandszahl ${formatNumber(stateFactor, 4)}`,
    });
  }

  const breakdownRows = [
    {
      period: 'Verbrauchskosten',
      values: {
        beschreibung: `${formatNumber(totalKwh, 0)} kWh × ${formatCurrency(pricePerKwhInEuro, 4)}/kWh`,
        betrag: formatCurrency(workCost),
      },
    },
    {
      period: 'Grundpreis',
      values: {
        beschreibung: `12 Monate × ${formatCurrency(basePricePerMonth)}/Monat`,
        betrag: formatCurrency(annualBaseCost),
      },
    },
    {
      period: 'Monatlicher Durchschnitt (Ø)',
      values: {
        beschreibung: 'Gesamtkosten auf 12 Monate aufgeteilt',
        betrag: formatCurrency(monthlyAdvancePayment),
      },
    },
    {
      period: 'Tägliche Kosten (Ø)',
      values: {
        beschreibung: 'Gesamtkosten auf 365 Tage aufgeteilt',
        betrag: formatCurrency(dailyCost),
      },
    },
    {
      period: 'Gesamtkosten pro Jahr',
      values: {
        beschreibung: 'Summe aus Arbeitspreis und Grundpreis',
        betrag: formatCurrency(totalAnnualCost),
      },
    },
  ];

  const basisSummaryItems = [
    { label: 'Berechnungsmodus', value: inputType === 'm3' ? 'Modus B: Zählerstände in Kubikmetern (m³)' : 'Modus A: Jahresverbrauch in kWh' },
  ];

  if (inputType === 'm3') {
    if (inputs.meterOld !== undefined && inputs.meterNew !== undefined) {
      basisSummaryItems.push(
        { label: 'Alter Zählerstand', value: `${formatNumber(parseFloat(inputs.meterOld) || 0, 1)} m³` },
        { label: 'Neuer Zählerstand', value: `${formatNumber(parseFloat(inputs.meterNew) || 0, 1)} m³` },
        { label: 'Zählerdifferenz', value: `${formatNumber(volumeM3, 1)} m³` }
      );
    } else {
      basisSummaryItems.push({ label: 'Gasvolumen', value: `${formatNumber(volumeM3, 1)} m³` });
    }
    basisSummaryItems.push(
      { label: 'Brennwert (Hs)', value: `${formatNumber(calorificValue, 2)} kWh/m³` },
      { label: 'Zustandszahl (z)', value: formatNumber(stateFactor, 4) },
      { label: 'Umrechnungsfaktor', value: `${formatNumber(conversionFactor, 3)} kWh/m³` }
    );
  }

  basisSummaryItems.push(
    { label: 'Thermisches Energievolumen', value: `${formatNumber(totalKwh, 0)} kWh` },
    { label: 'Arbeitspreis', value: `${formatNumber(pricePerKwhInEuro * 100, 2)} ct/kWh (${formatCurrency(pricePerKwhInEuro, 4)}/kWh)` },
    { label: 'Grundpreis', value: `${formatCurrency(basePricePerMonth)}/Monat (${formatCurrency(annualBaseCost)}/Jahr)` },
    { label: 'Betrachtungszeitraum', value: '1 Jahr (365 Tage)' }
  );

  return {
    primary: {
      id: 'totalAnnualCost',
      label: 'Geschätzte Gesamtkosten pro Jahr',
      value: totalAnnualCost,
      formattedValue: formatCurrency(totalAnnualCost),
      highlight: true,
      helpText: 'Gesamtsumme aus verbrauchsabhängigem Arbeitspreis und verbrauchsunabhängigem Jahresgrundpreis (inkl. 19 % MwSt.).',
    },
    secondary,
    breakdown: {
      columns: [
        { key: 'beschreibung', label: 'Berechnungsschritt' },
        { key: 'betrag', label: 'Kosten' },
      ],
      rows: breakdownRows,
    },
    summaryText: `Bei einem Gasverbrauch von ${formatNumber(totalKwh, 0)} kWh und einem Arbeitspreis von ${formatNumber(pricePerKwhInEuro * 100, 2)} ct/kWh belaufen sich die reinen Verbrauchskosten auf ${formatCurrency(workCost)}. Zusammen mit dem Grundpreis von ${formatCurrency(annualBaseCost)} ergeben sich geschätzte Jahresgesamtkosten von ${formatCurrency(totalAnnualCost)}. Das entspricht einem rechnerischen Durchschnitt von ca. ${formatCurrency(monthlyAdvancePayment)} pro Monat (${formatCurrency(dailyCost)}/Tag). Hinweis: Reine Orientierung – Ihr tatsächlicher Monatsabschlag des Versorgers kann abweichen.`,
    directAnswer: `Bei ${formatNumber(totalKwh, 0)} kWh Gasverbrauch und ${formatNumber(pricePerKwhInEuro * 100, 2)} ct/kWh Arbeitspreis betragen Ihre jährlichen Gaskosten inklusive ${formatCurrency(annualBaseCost)} Grundpreis geschätzte ${formatCurrency(totalAnnualCost)} (durchschnittlich ca. ${formatCurrency(monthlyAdvancePayment)} pro Monat).`,
    qualifications: [
      'Rechnerischer Monatsdurchschnitt (Jahreskosten ÷ 12): Der tatsächliche monatliche Abschlag Ihres Gasversorgers kann abweichen (z. B. 11 statt 12 Abschläge, Anpassungen nach Vorjahresverbrauch oder stichtagsbezogene Tarifänderungen).',
      'Gesamtkosten inklusive Arbeitspreis, Grundpreis und aller gesetzlichen Steuern (19 % Mehrwertsteuer, CO₂-Preis, Erdgassteuer, Konzessionsabgabe).',
      inputType === 'm3'
        ? `Physikalische Umrechnung nach DVGW-Arbeitsblatt G 685: ${formatNumber(volumeM3, 1)} m³ × Brennwert ${formatNumber(calorificValue, 2)} kWh/m³ × Zustandszahl ${formatNumber(stateFactor, 4)} = ${formatNumber(totalKwh, 0)} kWh.`
        : 'Berechnung basiert direkt auf der thermischen Energiemenge in Kilowattstunden (kWh).',
    ],
    calculationSteps: [
      inputType === 'm3'
        ? `Gasvolumen in thermische Energie: ${formatNumber(volumeM3, 1)} m³ × ${formatNumber(calorificValue, 2)} kWh/m³ × ${formatNumber(stateFactor, 4)} = ${formatNumber(totalKwh, 0)} kWh`
        : `Verbrauchsmenge: ${formatNumber(totalKwh, 0)} kWh`,
      `Verbrauchskosten (Arbeitspreis): ${formatNumber(totalKwh, 0)} kWh × ${formatCurrency(pricePerKwhInEuro, 4)}/kWh = ${formatCurrency(workCost)}`,
      `Bereitstellungskosten (Grundpreis): ${formatCurrency(basePricePerMonth)}/Monat × 12 Monate = ${formatCurrency(annualBaseCost)}`,
      `Geschätzte Gesamtkosten pro Jahr: ${formatCurrency(workCost)} + ${formatCurrency(annualBaseCost)} = ${formatCurrency(totalAnnualCost)}`,
      `Rechnerischer Monatsdurchschnitt: ${formatCurrency(totalAnnualCost)} ÷ 12 Monate = ${formatCurrency(monthlyAdvancePayment)}`,
    ],
    basisSummary: basisSummaryItems,
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
