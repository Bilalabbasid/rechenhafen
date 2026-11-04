import { CalculationResult, ResultItem } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';
import { GERMAN_DATA_2026 } from '@/data/regulated/2026';

export function calculateFuelCost(inputs: Record<string, any>): CalculationResult {
  if (inputs.distance === undefined || inputs.distance === null || String(inputs.distance).trim() === '') {
    return {
      primary: { id: 'cost', label: 'Spritkosten', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die Fahrstrecke in Kilometern ein.',
    };
  }
  const distance = parseFloat(inputs.distance);
  if (isNaN(distance) || distance < 0) {
    return {
      primary: { id: 'cost', label: 'Spritkosten', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie eine gültige Fahrstrecke ab 0 km ein.',
    };
  }

  if (inputs.consumption === undefined || inputs.consumption === null || String(inputs.consumption).trim() === '') {
    return {
      primary: { id: 'cost', label: 'Spritkosten', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie den Kraftstoffverbrauch auf 100 km ein.',
    };
  }
  const consumption = parseFloat(inputs.consumption);
  if (isNaN(consumption) || consumption <= 0) {
    return {
      primary: { id: 'cost', label: 'Spritkosten', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie einen positiven Durchschnittsverbrauch über 0 l/100km an.',
    };
  }

  if (inputs.pricePerLiter === undefined || inputs.pricePerLiter === null || String(inputs.pricePerLiter).trim() === '') {
    return {
      primary: { id: 'cost', label: 'Spritkosten', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie den Kraftstoffpreis pro Liter ein.',
    };
  }
  const pricePerLiter = parseFloat(inputs.pricePerLiter);
  if (isNaN(pricePerLiter) || pricePerLiter < 0) {
    return {
      primary: { id: 'cost', label: 'Spritkosten', value: 0, formattedValue: '-' },
      error: 'Der Kraftstoffpreis darf nicht negativ sein.',
    };
  }

  const rawTrips = inputs.tripsCount !== undefined && inputs.tripsCount !== null && String(inputs.tripsCount).trim() !== ''
    ? Number(inputs.tripsCount)
    : 1;
  if (isNaN(rawTrips) || rawTrips < 1 || !Number.isInteger(rawTrips)) {
    return {
      primary: { id: 'cost', label: 'Spritkosten', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die Anzahl der Fahrten als positive ganze Zahl (mindestens 1) an.',
    };
  }
  const tripsCount = rawTrips;

  const rawPassengers = inputs.passengers !== undefined && inputs.passengers !== null && String(inputs.passengers).trim() !== ''
    ? Number(inputs.passengers)
    : 1;
  if (isNaN(rawPassengers) || rawPassengers < 1 || !Number.isInteger(rawPassengers)) {
    return {
      primary: { id: 'cost', label: 'Spritkosten', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die Personenzahl als ganze Zahl an (mindestens 1 Person inklusive Fahrer).',
    };
  }
  const passengers = rawPassengers;

  const tripType = inputs.tripType || 'single'; // 'single' vs 'roundtrip'

  // Optionale Nebenkosten (aus dem früheren Fahrtkostenrechner übernommen).
  // includeExtraCosts === false (Schalter im Formular aus) ignoriert alle Nebenkosten-Felder.
  const extrasSwitch = inputs.includeExtraCosts;
  const extrasEnabled = !(extrasSwitch === false || extrasSwitch === 'false' || extrasSwitch === 'no');
  const readOptional = (raw: unknown): number | null => {
    if (!extrasEnabled || raw === undefined || raw === null || String(raw).trim() === '') return 0;
    const n = parseFloat(String(raw).replace(',', '.'));
    return Number.isFinite(n) && n >= 0 ? n : null;
  };
  const tollPerTrip = readOptional(inputs.tollCosts);
  const parkingPerTrip = readOptional(inputs.parkingCosts);
  const wearPerKm = readOptional(inputs.vehicleAllowancePerKm);
  const tripsPerMonth = readOptional(inputs.tripsPerMonth);
  const extrasError = (msg: string): CalculationResult => ({
    primary: { id: 'cost', label: 'Spritkosten', value: 0, formattedValue: '-' },
    error: msg,
  });
  if (tollPerTrip === null) return extrasError('Die Maut- und Vignettenkosten dürfen nicht negativ sein.');
  if (parkingPerTrip === null) return extrasError('Die Parkgebühren dürfen nicht negativ sein.');
  if (wearPerKm === null) return extrasError('Die Verschleißpauschale pro km darf nicht negativ sein.');
  if (tripsPerMonth === null || !Number.isInteger(tripsPerMonth)) {
    return extrasError('Bitte geben Sie die Fahrten pro Monat als ganze Zahl ab 0 an.');
  }

  // Effektive Strecke pro Fahrt
  const effectiveDistancePerTrip = tripType === 'roundtrip' ? distance * 2 : distance;
  const totalKm = effectiveDistancePerTrip * tripsCount;

  // Kraftstoffbedarf & Kosten
  const litersPerTrip = (effectiveDistancePerTrip * consumption) / 100;
  const totalLiters = litersPerTrip * tripsCount;
  const costPerTrip = litersPerTrip * pricePerLiter;
  const fuelCostTotal = costPerTrip * tripsCount;
  const costPerKm = effectiveDistancePerTrip > 0 ? costPerTrip / effectiveDistancePerTrip : 0;
  const costPer100Km = (consumption * pricePerLiter);

  // Nebenkosten: Maut & Parken je Fahrt, Verschleiß je gefahrenem km
  const wearPerTrip = effectiveDistancePerTrip * wearPerKm;
  const extrasPerTrip = tollPerTrip + parkingPerTrip + wearPerTrip;
  const hasExtras = extrasPerTrip > 0;
  const tripCostTotal = costPerTrip + extrasPerTrip;
  const totalCost = tripCostTotal * tripsCount;
  const costPerPerson = totalCost / passengers;

  const secondary: Array<{ id: string; label: string; value: any; formattedValue: string; helpText?: string }> = [];
  if (hasExtras) {
    secondary.push(
      { id: 'fuelCost', label: 'davon Spritkosten', value: fuelCostTotal, formattedValue: formatCurrency(fuelCostTotal), helpText: `${formatNumber(totalLiters, 2)} Liter × ${formatCurrency(pricePerLiter)}/l` },
      { id: 'tollCosts', label: 'davon Maut & Vignette', value: tollPerTrip * tripsCount, formattedValue: formatCurrency(tollPerTrip * tripsCount) },
      { id: 'parkingCosts', label: 'davon Parkgebühren', value: parkingPerTrip * tripsCount, formattedValue: formatCurrency(parkingPerTrip * tripsCount) },
      {
        id: 'vehicleCost',
        label: 'davon Verschleiß (ohne Sprit)',
        value: wearPerTrip * tripsCount,
        formattedValue: formatCurrency(wearPerTrip * tripsCount),
        helpText: wearPerKm > 0 ? `${formatCurrency(wearPerKm)}/km × ${formatNumber(totalKm, 1)} km für Reifen, Wartung und Wertverlust` : 'Keine Verschleißpauschale angesetzt.',
      },
      { id: 'totalCostPerKm', label: 'Fahrtkosten pro km (inkl. Nebenkosten)', value: totalKm > 0 ? totalCost / totalKm : 0, formattedValue: `${formatCurrency(totalKm > 0 ? totalCost / totalKm : 0, 3)} / km` },
    );
  }
  secondary.push(
    { id: 'costPerKm', label: 'Kraftstoffkosten pro Kilometer', value: costPerKm, formattedValue: `${formatCurrency(costPerKm, 3)} / km` },
    { id: 'costPer100Km', label: 'Kosten pro 100 km', value: costPer100Km, formattedValue: formatCurrency(costPer100Km) },
    { id: 'totalLiters', label: 'Kraftstoffbedarf gesamt', value: totalLiters, formattedValue: `${formatNumber(totalLiters, 2)} Liter` },
    { id: 'totalKm', label: 'Fahrstrecke gesamt', value: totalKm, formattedValue: `${formatNumber(totalKm, 1)} km` },
  );

  if (passengers > 1) {
    secondary.unshift({
      id: 'costPerPerson',
      label: `Kosten pro Person (${passengers} Personen inkl. Fahrer)`,
      value: costPerPerson,
      formattedValue: formatCurrency(costPerPerson),
    });
  }

  if (tripsPerMonth > 0) {
    const monthly = tripCostTotal * tripsPerMonth;
    secondary.push(
      {
        id: 'monthlyTrips',
        label: `Kosten pro Monat (${tripsPerMonth} ${tripsPerMonth === 1 ? 'Fahrt' : 'Fahrten'})`,
        value: monthly,
        formattedValue: formatCurrency(monthly),
        helpText: passengers > 1 ? `${formatCurrency(monthly / passengers)} pro Person` : undefined,
      },
      { id: 'yearlyTrips', label: `Kosten pro Jahr (${tripsPerMonth * 12} Fahrten)`, value: monthly * 12, formattedValue: formatCurrency(monthly * 12) },
    );
  }

  // Pendel-Hochrechnung (tägliche Hin- & Rückfahrt) ohne Doppelmultiplikation mit tripsCount
  const dailyCommuteKm = tripType === 'roundtrip' ? effectiveDistancePerTrip : distance * 2;
  const monthlyCost = (dailyCommuteKm * consumption / 100 * pricePerLiter) * 21;
  const yearlyCost = (dailyCommuteKm * consumption / 100 * pricePerLiter) * 220;
  secondary.push(
    { id: 'monthlyCommute', label: 'Spritkosten monatlich bei täglichem Pendeln (21 Arbeitstage, hin und zurück)', value: monthlyCost, formattedValue: formatCurrency(monthlyCost) },
    { id: 'yearlyCommute', label: 'Spritkosten jährlich bei 220 Pendeltagen (hin und zurück)', value: yearlyCost, formattedValue: formatCurrency(yearlyCost) },
  );

  let labelText = tripType === 'roundtrip' ? 'Spritkosten (Hin- und Rückfahrt)' : 'Spritkosten (Einfache Fahrt)';
  if (hasExtras) {
    labelText = tripType === 'roundtrip' ? 'Fahrtkosten (Hin- und Rückfahrt)' : 'Fahrtkosten (Einfache Fahrt)';
  }
  if (tripsCount > 1) {
    labelText = `Gesamtkosten für ${tripsCount} Fahrten`;
  }

  let summary = `Für eine Strecke von ${formatNumber(effectiveDistancePerTrip, 1)} km (${tripType === 'roundtrip' ? 'Hin- und Rückfahrt' : 'einfache Fahrt'}) fallen bei ${formatCurrency(pricePerLiter)} je Liter Spritkosten in Höhe von ${formatCurrency(costPerTrip)} an (${formatCurrency(costPerKm, 3)}/km).`;
  if (hasExtras) {
    const parts: string[] = [];
    if (tollPerTrip > 0) parts.push(`${formatCurrency(tollPerTrip)} Maut`);
    if (parkingPerTrip > 0) parts.push(`${formatCurrency(parkingPerTrip)} Parken`);
    if (wearPerTrip > 0) parts.push(`${formatCurrency(wearPerTrip)} Verschleiß`);
    summary += ` Mit ${parts.join(', ')} kostet eine Fahrt insgesamt ${formatCurrency(tripCostTotal)}.`;
  }
  if (passengers > 1) {
    summary += ` Bei ${passengers} Personen im Fahrzeug (Fahrer und Mitfahrer) beträgt der faire Anteil ${formatCurrency(costPerPerson)} pro Person.`;
  }

  return {
    primary: {
      id: 'cost',
      label: labelText,
      value: totalCost,
      formattedValue: formatCurrency(totalCost),
      highlight: true,
    },
    secondary,
    summaryText: summary,
  };
}

export function calculateTripExpenses(inputs: Record<string, any>): CalculationResult {
  if (inputs.distance === undefined || inputs.distance === null || String(inputs.distance).trim() === '') {
    return {
      primary: { id: 'totalCost', label: 'Gesamte Fahrtkosten', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die gesamte Reisedistanz in Kilometern ein.',
    };
  }
  const distance = parseFloat(String(inputs.distance).replace(',', '.'));
  if (isNaN(distance) || distance < 0) {
    return {
      primary: { id: 'totalCost', label: 'Gesamte Fahrtkosten', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie eine gültige Reisedistanz ab 0 km ein.',
    };
  }

  if (inputs.consumption === undefined || inputs.consumption === null || String(inputs.consumption).trim() === '') {
    return {
      primary: { id: 'totalCost', label: 'Gesamte Fahrtkosten', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie den Kraftstoffverbrauch in l/100 km ein.',
    };
  }
  const consumption = parseFloat(String(inputs.consumption).replace(',', '.'));
  if (isNaN(consumption) || consumption <= 0) {
    return {
      primary: { id: 'totalCost', label: 'Gesamte Fahrtkosten', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie einen positiven Kraftstoffverbrauch größer als 0 l/100km an.',
    };
  }

  if (inputs.pricePerLiter === undefined || inputs.pricePerLiter === null || String(inputs.pricePerLiter).trim() === '') {
    return {
      primary: { id: 'totalCost', label: 'Gesamte Fahrtkosten', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie den Kraftstoffpreis pro Liter ein.',
    };
  }
  const pricePerLiter = parseFloat(String(inputs.pricePerLiter).replace(',', '.'));
  if (isNaN(pricePerLiter) || pricePerLiter < 0) {
    return {
      primary: { id: 'totalCost', label: 'Gesamte Fahrtkosten', value: 0, formattedValue: '-' },
      error: 'Der Kraftstoffpreis darf nicht negativ sein (0 € ist zulässig).',
    };
  }

  let tollCosts = 0;
  if (inputs.tollCosts !== undefined && inputs.tollCosts !== null && String(inputs.tollCosts).trim() !== '') {
    tollCosts = parseFloat(String(inputs.tollCosts).replace(',', '.'));
    if (isNaN(tollCosts) || tollCosts < 0) {
      return {
        primary: { id: 'totalCost', label: 'Gesamte Fahrtkosten', value: 0, formattedValue: '-' },
        error: 'Die Mautkosten dürfen nicht negativ sein.',
      };
    }
  }

  let parkingCosts = 0;
  if (inputs.parkingCosts !== undefined && inputs.parkingCosts !== null && String(inputs.parkingCosts).trim() !== '') {
    parkingCosts = parseFloat(String(inputs.parkingCosts).replace(',', '.'));
    if (isNaN(parkingCosts) || parkingCosts < 0) {
      return {
        primary: { id: 'totalCost', label: 'Gesamte Fahrtkosten', value: 0, formattedValue: '-' },
        error: 'Die Parkkosten dürfen nicht negativ sein.',
      };
    }
  }

  let vehicleAllowancePerKm = 0;
  if (inputs.vehicleAllowancePerKm !== undefined && inputs.vehicleAllowancePerKm !== null && String(inputs.vehicleAllowancePerKm).trim() !== '') {
    vehicleAllowancePerKm = parseFloat(String(inputs.vehicleAllowancePerKm).replace(',', '.'));
    if (isNaN(vehicleAllowancePerKm) || vehicleAllowancePerKm < 0) {
      return {
        primary: { id: 'totalCost', label: 'Gesamte Fahrtkosten', value: 0, formattedValue: '-' },
        error: 'Die zusätzliche Fahrzeug-Verschleißpauschale darf nicht negativ sein.',
      };
    }
  }

  const rawPassengers = inputs.passengers !== undefined && inputs.passengers !== null && String(inputs.passengers).trim() !== ''
    ? parseInt(String(inputs.passengers), 10)
    : 1;
  if (isNaN(rawPassengers) || rawPassengers < 1) {
    return {
      primary: { id: 'totalCost', label: 'Gesamte Fahrtkosten', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die Anzahl der Reisenden als ganze Zahl (mindestens 1 Person inklusive Fahrer) an.',
    };
  }
  const passengers = rawPassengers;

  // Berechnung mit voller mathematischer Fließkommagenauigkeit (Rundung erst bei der Ausgabe)
  const fuelLitres = (distance * consumption) / 100;
  const fuelCost = fuelLitres * pricePerLiter;
  const vehicleCost = distance * vehicleAllowancePerKm;
  const totalCost = fuelCost + tollCosts + parkingCosts + vehicleCost;
  const perPerson = totalCost / passengers;
  const costPerKm = distance > 0 ? totalCost / distance : 0;

  const secondary: Array<{ id: string; label: string; value: any; formattedValue: string; highlight?: boolean; helpText?: string }> = [
    {
      id: 'costPerPerson',
      label: `Kosten pro Person (${passengers} ${passengers === 1 ? 'Person' : 'Personen inkl. Fahrer'})`,
      value: perPerson,
      formattedValue: formatCurrency(perPerson),
      highlight: true,
      helpText: 'Gesamtkosten geteilt durch die Anzahl aller Mitfahrenden inklusive Fahrer.',
    },
    {
      id: 'fuelCost',
      label: 'Tatsächliche Spritkosten',
      value: fuelCost,
      formattedValue: formatCurrency(fuelCost),
      helpText: `${formatNumber(distance, 1)} km × ${formatNumber(consumption, 1)} l/100km × ${formatCurrency(pricePerLiter)}/l`,
    },
    {
      id: 'fuelLitres',
      label: 'Benötigte Kraftstoffmenge',
      value: fuelLitres,
      formattedValue: `${formatNumber(fuelLitres, 2)} Liter`,
    },
    {
      id: 'tollCosts',
      label: 'Maut & Vignetten (tatsächliche Ausgabe)',
      value: tollCosts,
      formattedValue: formatCurrency(tollCosts),
      helpText: tollCosts > 0 ? 'Erfasste reale Mautgebühren der gesamten Route.' : 'Keine Mautkosten erfasst.',
    },
    {
      id: 'parkingCosts',
      label: 'Parkgebühren (tatsächliche Ausgabe)',
      value: parkingCosts,
      formattedValue: formatCurrency(parkingCosts),
      helpText: parkingCosts > 0 ? 'Erfasste reale Parkgebühren der Reise.' : 'Keine Parkgebühren erfasst.',
    },
    {
      id: 'vehicleCost',
      label: 'Zusätzliche Fahrzeugkosten (geschätzter Verschleiß, ohne Sprit)',
      value: vehicleCost,
      formattedValue: formatCurrency(vehicleCost),
      helpText: vehicleAllowancePerKm > 0
        ? `${formatCurrency(vehicleAllowancePerKm, 2)}/km × ${formatNumber(distance, 1)} km für Reifen, Inspektion und Wertverlust (keine Kraftstoffkosten enthalten).`
        : 'Keine zusätzliche Kilometerpauschale angesetzt (nur reine Auslagen).',
    },
    {
      id: 'costPerKm',
      label: 'Reisekosten pro gefahrenem Kilometer',
      value: costPerKm,
      formattedValue: `${formatCurrency(costPerKm, 3)} / km`,
    },
  ];

  let summary = `Für die ${formatNumber(distance, 1)} km lange Fahrt entstehen Gesamtkosten von ${formatCurrency(totalCost)} (davon ${formatCurrency(fuelCost)} für ${formatNumber(fuelLitres, 2)} Liter Sprit`;
  if (tollCosts > 0) summary += `, ${formatCurrency(tollCosts)} Maut`;
  if (parkingCosts > 0) summary += `, ${formatCurrency(parkingCosts)} Parken`;
  if (vehicleCost > 0) summary += `, ${formatCurrency(vehicleCost)} Fahrzeugverschleiß`;
  summary += ').';

  if (passengers > 1) {
    summary += ` Bei ${passengers} Personen im Fahrzeug beträgt der Anteil ${formatCurrency(perPerson)} pro Person.`;
  }

  return {
    primary: {
      id: 'totalCost',
      label: 'Gesamte Fahrtkosten der Reise',
      value: totalCost,
      formattedValue: formatCurrency(totalCost),
      highlight: true,
    },
    secondary,
    summaryText: summary,
  };
}

export function calculateCommuterAllowance(inputs: Record<string, any>): CalculationResult {
  const rawDist = inputs.distanceKm !== undefined && inputs.distanceKm !== null && String(inputs.distanceKm).trim() !== ''
    ? parseInt(String(inputs.distanceKm), 10)
    : 25;
  const rawWorkdays = inputs.workdays !== undefined && inputs.workdays !== null && String(inputs.workdays).trim() !== ''
    ? parseInt(String(inputs.workdays), 10)
    : 220;
  const homeOfficeDays = Math.max(0, parseInt(inputs.homeOfficeDays || '0', 10));
  const transportMode = inputs.transportMode || 'car'; // 'car' vs 'public'

  if (isNaN(rawDist) || rawDist < 0 || isNaN(rawWorkdays) || rawWorkdays < 0) {
    return {
      primary: { id: 'totalAllowance', label: 'Steuerliche Entfernungspauschale (pro Jahr)', value: 0, formattedValue: '0,00 €' },
      error: 'Bitte gültige Werte ab 0 für einfache Entfernung und Arbeitstage angeben.',
    };
  }

  if (rawDist === 0 || rawWorkdays === 0) {
    return {
      primary: {
        id: 'totalAllowance',
        label: 'Steuerliche Entfernungspauschale (pro Jahr)',
        value: 0,
        formattedValue: '0,00 €',
        highlight: true,
      },
      secondary: [
        { id: 'effectiveDays', label: 'Anerkannte Fahrt-Tage', value: 0, formattedValue: '0 Tage' },
        { id: 'perDay', label: 'Pauschale pro Pendeltag', value: 0, formattedValue: '0,00 €' },
      ],
      summaryText: 'Bei 0 km einfacher Entfernung zur ersten Tätigkeitsstätte oder 0 Pendeltagen fällt keine Entfernungspauschale an.',
    };
  }

  const distanceKm = rawDist;
  const workdays = rawWorkdays;

  const effectiveWorkdays = Math.max(0, workdays - homeOfficeDays);

  const rateFirst20 = GERMAN_DATA_2026.pendlerpauschale_standard.value; // 0.30 €
  const rateFrom21 = GERMAN_DATA_2026.pendlerpauschale_fernpendler.value; // 0.38 €

  const kmFirst20 = Math.min(20, distanceKm);
  const kmOver20 = Math.max(0, distanceKm - 20);

  const allowancePerDay = (kmFirst20 * rateFirst20) + (kmOver20 * rateFrom21);
  let totalAllowancePerYear = allowancePerDay * effectiveWorkdays;

  let isCapped = false;
  if (transportMode === 'public' && totalAllowancePerYear > 4500) {
    totalAllowancePerYear = 4500;
    isCapped = true;
  }

  return {
    primary: {
      id: 'totalAllowance',
      label: 'Steuerliche Entfernungspauschale (pro Jahr)',
      value: totalAllowancePerYear,
      formattedValue: formatCurrency(totalAllowancePerYear),
      highlight: true,
    },
    secondary: [
      { id: 'effectiveDays', label: 'Anerkannte Fahrt-Tage (abzgl. Homeoffice)', value: effectiveWorkdays, formattedValue: `${effectiveWorkdays} Tage` },
      { id: 'perDay', label: 'Pauschale pro tatsächlichem Pendeltag', value: allowancePerDay, formattedValue: formatCurrency(allowancePerDay) },
      { id: 'rate20', label: 'Kilometer 1 bis 20 (0,30 €/km)', value: kmFirst20 * rateFirst20, formattedValue: formatCurrency(kmFirst20 * rateFirst20) },
      { id: 'rateOver20', label: 'Kilometer ab 21 (0,38 €/km)', value: kmOver20 * rateFrom21, formattedValue: formatCurrency(kmOver20 * rateFrom21) },
      { id: 'modeNotice', label: 'Verkehrsmittel & Höchstbetrag', value: transportMode === 'public' ? (isCapped ? 'Auf 4.500 € gedeckelt' : 'ÖPNV (max. 4.500 €)') : 'PKW (ohne Obergrenze)', formattedValue: transportMode === 'public' ? (isCapped ? '4.500 € Obergrenze greift' : 'ÖPNV / Fahrgemeinschaft') : 'Eigener PKW (unbegrenzt)' },
    ],
    summaryText: `Bei einer einfachen Strecke von ${distanceKm} km zur Arbeitsstätte und ${effectiveWorkdays} Pendeltagen im Jahr beträgt die Entfernungspauschale ${formatCurrency(totalAllowancePerYear)} als Werbungskosten.${isCapped ? ' (Auf die gesetzliche ÖPNV-Höchstgrenze von 4.500 € begrenzt).' : ''}`,
  };
}

export function calculateEVCharging(inputs: Record<string, any>): CalculationResult {
  const distance = inputs.distance !== undefined && inputs.distance !== '' ? parseFloat(inputs.distance) : 100;
  const consumptionKwh = inputs.consumptionKwh !== undefined && inputs.consumptionKwh !== '' ? parseFloat(inputs.consumptionKwh) : 18.0; // kWh / 100km
  const pricePerKwh = inputs.pricePerKwh !== undefined && inputs.pricePerKwh !== '' ? parseFloat(inputs.pricePerKwh) : GERMAN_DATA_2026.strompreis_durchschnitt.value; // default 0.38 €
  const batterySize = inputs.batterySize !== undefined && inputs.batterySize !== '' ? parseFloat(inputs.batterySize) : 60; // kWh

  if (isNaN(distance) || distance <= 0 || isNaN(consumptionKwh) || consumptionKwh <= 0 || isNaN(pricePerKwh) || pricePerKwh < 0) {
    return {
      primary: { id: 'cost', label: 'Ladekosten', value: 0, formattedValue: '0,00 €' },
      error: 'Bitte positive Werte für Strecke und Verbrauch angeben (Strompreis darf nicht negativ sein).',
    };
  }

  const kwhNeeded = (distance * consumptionKwh) / 100;
  const cost = kwhNeeded * pricePerKwh;
  const costPer100Km = consumptionKwh * pricePerKwh;
  const costPerKm = costPer100Km / 100;
  const fullChargeCost = batterySize * pricePerKwh;
  const theoreticalRange = (batterySize / consumptionKwh) * 100;

  return {
    primary: {
      id: 'costPer100',
      label: 'Stromkosten pro 100 km',
      value: costPer100Km,
      formattedValue: formatCurrency(costPer100Km),
      highlight: true,
    },
    secondary: [
      { id: 'tripCost', label: `Kosten für gewählte Strecke (${formatNumber(distance)} km)`, value: cost, formattedValue: formatCurrency(cost) },
      { id: 'costPerKm', label: 'Kosten pro Kilometer', value: costPerKm, formattedValue: `${formatCurrency(costPerKm, 3)} / km` },
      { id: 'fullCharge', label: `Volle Ladung (${formatNumber(batterySize)} kWh Akku)`, value: fullChargeCost, formattedValue: formatCurrency(fullChargeCost) },
      { id: 'range', label: 'Rechnerische Reichweite mit vollem Akku', value: theoreticalRange, formattedValue: `${formatNumber(theoreticalRange, 0)} km` },
    ],
    summaryText: `Bei einem Strompreis von ${formatCurrency(pricePerKwh)}/kWh und einem Verbrauch von ${formatNumber(consumptionKwh, 1)} kWh/100 km kostet das Fahren mit dem Elektroauto ${formatCurrency(costPer100Km)} je 100 km (${formatCurrency(costPerKm, 3)} pro km).`,
  };
}

export function calculateTravelTime(inputs: Record<string, any>): CalculationResult {
  const distance = inputs.distance !== undefined && inputs.distance !== '' ? parseFloat(inputs.distance) : 350;
  const speed = inputs.speed !== undefined && inputs.speed !== '' ? parseFloat(inputs.speed) : 100; // km/h
  const breakMinutes = inputs.breakMinutes !== undefined && inputs.breakMinutes !== ''
    ? Math.max(0, parseInt(String(inputs.breakMinutes), 10) || 0)
    : 30;

  if (isNaN(distance) || distance <= 0 || isNaN(speed) || speed <= 0) {
    return {
      primary: { id: 'time', label: 'Fahrtzeit', value: 0, formattedValue: '0 Std.' },
      error: 'Distanz und Geschwindigkeit müssen größer als 0 sein.',
    };
  }

  const drivingHoursDecimal = distance / speed;
  const totalMinutes = Math.round(drivingHoursDecimal * 60) + breakMinutes;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    primary: {
      id: 'totalTime',
      label: 'Gesamte Reisedauer (inkl. Pause)',
      value: totalMinutes,
      formattedValue: `${hours} Std. ${minutes} Min.`,
      highlight: true,
    },
    secondary: [
      { id: 'pureDriving', label: 'Reine Fahrzeit', value: drivingHoursDecimal, formattedValue: `${Math.floor(drivingHoursDecimal)} Std. ${Math.round((drivingHoursDecimal % 1) * 60)} Min.` },
      { id: 'breaks', label: 'Eingeplante Pausen', value: breakMinutes, formattedValue: `${breakMinutes} Minuten` },
      { id: 'speed', label: 'Durchschnittstempo', value: speed, formattedValue: `${formatNumber(speed, 0)} km/h` },
    ],
    summaryText: `Für eine Strecke von ${formatNumber(distance, 0)} km bei durchschnittlich ${formatNumber(speed, 0)} km/h benötigen Sie ${hours} Stunden und ${minutes} Minuten Reisezeit.`,
  };
}

// ==========================================
// KRAFTSTOFFVERBRAUCH: Tankmethode + Einheiten umrechnen
// ==========================================
// Exakte Einheitendefinitionen: 1 US-Gallone = 3,785411784 l, 1 UK-Gallone = 4,54609 l, 1 Meile = 1,609344 km
const LITERS_PER_US_GALLON = 3.785411784;
const LITERS_PER_UK_GALLON = 4.54609;
const KM_PER_MILE = 1.609344;
/** l/100 km × MPG (US) = 235,2145… */
export const MPG_US_FACTOR = (100 * LITERS_PER_US_GALLON) / KM_PER_MILE;
/** l/100 km × MPG (UK) = 282,4809… */
export const MPG_UK_FACTOR = (100 * LITERS_PER_UK_GALLON) / KM_PER_MILE;

type FuelUnit = 'l100km' | 'kml' | 'usmpg' | 'ukmpg';

function toL100km(value: number, unit: FuelUnit): number {
  if (unit === 'usmpg') return MPG_US_FACTOR / value;
  if (unit === 'ukmpg') return MPG_UK_FACTOR / value;
  if (unit === 'kml') return 100 / value;
  return value;
}

function fuelUnitItems(l100km: number): Record<FuelUnit, ResultItem> {
  const kml = 100 / l100km;
  const us = MPG_US_FACTOR / l100km;
  const uk = MPG_UK_FACTOR / l100km;
  return {
    l100km: { id: 'l100km', label: 'Liter pro 100 km', value: l100km, formattedValue: `${formatNumber(l100km, 2)} l/100 km` },
    kml: { id: 'kml', label: 'Kilometer pro Liter', value: kml, formattedValue: `${formatNumber(kml, 2)} km/l` },
    usmpg: { id: 'usmpg', label: 'Meilen pro Gallone (US)', value: us, formattedValue: `${formatNumber(us, 1)} MPG (US)` },
    ukmpg: { id: 'ukmpg', label: 'Meilen pro Gallone (UK)', value: uk, formattedValue: `${formatNumber(uk, 1)} MPG (UK)` },
  };
}

function joinDe(parts: string[]): string {
  return parts.length <= 1 ? parts.join('') : `${parts.slice(0, -1).join(', ')} und ${parts[parts.length - 1]}`;
}

function readPositive(raw: unknown): number | null | 'missing' {
  if (raw === undefined || raw === null || String(raw).trim() === '') return 'missing';
  const n = typeof raw === 'number' ? raw : parseFloat(String(raw).replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function calculateFuelConsumption(inputs: Record<string, any>): CalculationResult {
  const mode = inputs.mode === 'umrechnen' ? 'umrechnen' : 'tanken';

  if (mode === 'umrechnen') {
    const unit: FuelUnit = (['l100km', 'kml', 'usmpg', 'ukmpg'] as const).includes(inputs.inputUnit) ? inputs.inputUnit : 'l100km';
    const value = readPositive(inputs.inputValue);
    if (value === 'missing' || value === null) {
      return {
        primary: { id: 'l100km', label: 'Verbrauch', value: 0, formattedValue: '-' },
        error: value === 'missing' ? 'Bitte geben Sie einen Verbrauchswert ein.' : 'Bitte geben Sie einen Verbrauchswert größer als 0 ein.',
      };
    }
    const l100km = toL100km(value, unit);
    const items = fuelUnitItems(l100km);
    // Primär: bei Eingabe in l/100 km das US-MPG-Ergebnis, sonst der europäische Wert l/100 km
    const primaryUnit: FuelUnit = unit === 'l100km' ? 'usmpg' : 'l100km';
    const order: FuelUnit[] = ['l100km', 'kml', 'usmpg', 'ukmpg'];
    return {
      primary: { ...items[primaryUnit], highlight: true },
      secondary: order.filter((u) => u !== primaryUnit && u !== unit).map((u) => items[u]),
      summaryText: `${items[unit].formattedValue} entsprechen ${joinDe(order.filter((u) => u !== unit).map((u) => String(items[u].formattedValue)))}.`,
    };
  }

  const dist = readPositive(inputs.distanceKm);
  const liters = readPositive(inputs.litersFueled);
  if (dist === 'missing' || liters === 'missing') {
    return {
      primary: { id: 'cons', label: 'Verbrauch', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie gefahrene Kilometer und getankte Liter ein.',
    };
  }
  if (dist === null || liters === null) {
    return {
      primary: { id: 'cons', label: 'Verbrauch', value: 0, formattedValue: '-' },
      error: 'Bitte gültige Werte größer als 0 für Kilometer und getankte Liter angeben.',
    };
  }
  const consumption = (liters / dist) * 100;
  const items = fuelUnitItems(consumption);
  const secondary: ResultItem[] = [
    { id: 'kmPerLiter', label: 'Reichweite pro Liter Kraftstoff', value: dist / liters, formattedValue: `${formatNumber(dist / liters, 2)} km/l` },
    { id: 'distance', label: 'Gefahrene Strecke', value: dist, formattedValue: `${formatNumber(dist, 0)} km` },
    items.usmpg,
    items.ukmpg,
  ];
  return {
    primary: { id: 'cons', label: 'Durchschnittsverbrauch', value: consumption, formattedValue: `${formatNumber(consumption, 2)} l/100 km`, highlight: true },
    secondary,
    summaryText: `Ihr Fahrzeug verbraucht real ${formatNumber(consumption, 2)} Liter auf 100 Kilometer. Mit einem Liter Kraftstoff kommen Sie ${formatNumber(dist / liters, 2)} km weit (${items.usmpg.formattedValue}).`,
  };
}

// ==========================================
// DIENSTWAGEN: 1-%-Regelung + Vergleich mit Fahrtenbuch
// ==========================================
// Sätze nach § 6 Abs. 1 Nr. 4 Satz 2 EStG und § 8 Abs. 2 Satz 3 EStG (unverändert aus dem bisherigen Dienstwagen-Rechner)
const DIENSTWAGEN_RATES: Record<string, { privat: number; weg: number; label: string }> = {
  combustion: { privat: 0.01, weg: 0.0003, label: 'Verbrenner' },
  hybrid: { privat: 0.005, weg: 0.00015, label: 'Plug-in-Hybrid' },
  electric: { privat: 0.0025, weg: 0.000075, label: 'Elektroauto' },
  // Reine E-Autos über der Preisgrenze fallen unter die 0,5-%-Regel (§ 6 Abs. 1 Nr. 4 Satz 2 Nr. 3 EStG)
  electricOverCap: { privat: 0.005, weg: 0.00015, label: 'Elektroauto über der Preisgrenze' },
};
/** Bruttolistenpreis-Grenze für die 0,25-%-Regel bei Anschaffung ab 01.07.2025 (vorher 70.000 €). */
export const E_DIENSTWAGEN_PREISGRENZE = 100000;
/** Grobe Netto-Schätzung des bisherigen Rechners: Grenzsteuersatz + ca. 20 % Sozialabgaben auf den geldwerten Vorteil */
const DIENSTWAGEN_SV_SCHAETZUNG = 0.2;

export function calculateDienstwagen(inputs: Record<string, any>): CalculationResult {
  const rawPrice = parseFloat(String(inputs.grossListPrice ?? '').replace(',', '.'));
  const roundedPrice = Number.isFinite(rawPrice) ? Math.floor(rawPrice / 100) * 100 : NaN;
  if (inputs.carDriveType === 'electric' && roundedPrice > E_DIENSTWAGEN_PREISGRENZE) {
    const result = calculateDienstwagenCore({ ...inputs, carDriveType: 'electricOverCap' });
    if (!result.error) {
      const note = `Der Bruttolistenpreis liegt über ${formatCurrency(E_DIENSTWAGEN_PREISGRENZE)}. Für reine Elektroautos über dieser Grenze gilt die 0,5-%-Regel statt 0,25 % – so ist hier gerechnet.`;
      result.warning = result.warning ? `${note} ${result.warning}` : note;
    }
    return result;
  }
  return calculateDienstwagenCore(inputs);
}

function calculateDienstwagenCore(inputs: Record<string, any>): CalculationResult {
  const fail = (msg: string): CalculationResult => ({
    primary: { id: 'totalBenefit', label: 'Monatlicher geldwerter Vorteil (brutto)', value: 0, formattedValue: '-' },
    error: msg,
  });
  const readNonNegative = (raw: unknown, fallback: number): number | null => {
    if (raw === undefined || raw === null || String(raw).trim() === '') return fallback;
    const n = typeof raw === 'number' ? raw : parseFloat(String(raw).replace(',', '.'));
    return Number.isFinite(n) && n >= 0 ? n : null;
  };

  const blpRaw = readPositive(inputs.grossListPrice);
  if (blpRaw === 'missing') return fail('Bitte geben Sie den Bruttolistenpreis des Fahrzeugs ein.');
  if (blpRaw === null) return fail('Der Bruttolistenpreis muss größer als 0 € sein.');
  // Bruttolistenpreis wird auf volle 100 € abgerundet
  const blp = Math.floor(blpRaw / 100) * 100;

  const kmRaw = readNonNegative(inputs.distanceWorkKm, 0);
  if (kmRaw === null) return fail('Die Entfernung zur Arbeit darf nicht negativ sein.');
  const km = Math.floor(kmRaw); // nur volle Entfernungskilometer

  const taxPct = readNonNegative(inputs.taxRate, 38);
  if (taxPct === null || taxPct > 100) return fail('Bitte geben Sie einen Grenzsteuersatz zwischen 0 und 100 % ein.');
  const taxRate = taxPct / 100;
  const netFactor = taxRate + DIENSTWAGEN_SV_SCHAETZUNG;

  const type = DIENSTWAGEN_RATES[inputs.carDriveType] ? inputs.carDriveType : 'combustion';
  const rates = DIENSTWAGEN_RATES[type];

  const privateBenefit = blp * rates.privat;
  const commuteBenefit = blp * rates.weg * km;
  const totalBenefit = privateBenefit + commuteBenefit;
  const netCost = totalBenefit * netFactor;
  const onePctYearly = totalBenefit * 12;

  const baseItems: ResultItem[] = [
    { id: 'netCost', label: 'Geschätzter Netto-Gehaltsabzug pro Monat', value: netCost, formattedValue: formatCurrency(netCost), helpText: `Grenzsteuersatz ${formatNumber(taxPct, 1)} % + ca. 20 % Sozialabgaben auf den geldwerten Vorteil (grobe Schätzung).` },
    { id: 'privateBenefit', label: `Anteil reine Privatnutzung (${formatNumber(rates.privat * 100, 2)} %)`, value: privateBenefit, formattedValue: formatCurrency(privateBenefit) },
    { id: 'commuteBenefit', label: `Anteil Fahrten Wohnung–Arbeit (${formatNumber(rates.weg * 100, 4)} % × ${km} km)`, value: commuteBenefit, formattedValue: formatCurrency(commuteBenefit) },
    { id: 'annualBenefit', label: 'Geldwerter Vorteil pro Jahr', value: onePctYearly, formattedValue: formatCurrency(onePctYearly) },
  ];
  if (blp !== blpRaw) {
    baseItems.push({ id: 'blpRounded', label: 'Angesetzter Bruttolistenpreis (abgerundet auf volle 100 €)', value: blp, formattedValue: formatCurrency(blp) });
  }

  const compare = inputs.compareLogbook === true || inputs.compareLogbook === 'true' || inputs.compareLogbook === 'yes';
  if (!compare) {
    return {
      primary: { id: 'totalBenefit', label: 'Monatlicher geldwerter Vorteil (brutto)', value: totalBenefit, formattedValue: formatCurrency(totalBenefit), highlight: true },
      secondary: baseItems,
      summaryText: `Bei ${formatCurrency(blp)} Bruttolistenpreis und ${km} km Arbeitsweg erhöht sich Ihr Steuerbrutto monatlich um ${formatCurrency(totalBenefit)}. Das kostet Sie netto ca. ${formatCurrency(netCost)} im Monat.`,
    };
  }

  // --- Vergleich mit der Fahrtenbuchmethode (§ 8 Abs. 2 Satz 4 EStG) ---
  const costs = readPositive(inputs.yearlyActualCarCosts);
  if (costs === 'missing' || costs === null) return fail('Bitte geben Sie die jährlichen Gesamtkosten des Fahrzeugs (größer als 0 €) ein.');
  const totalKm = readPositive(inputs.totalYearlyKm);
  if (totalKm === 'missing' || totalKm === null) return fail('Bitte geben Sie die Jahresfahrleistung in km (größer als 0) ein.');
  const privPct = readNonNegative(inputs.privateSharePct, 0);
  if (privPct === null || privPct > 100) return fail('Der Anteil der Privatfahrten muss zwischen 0 und 100 % liegen.');
  const workDays = readNonNegative(inputs.workDays, 220);
  if (workDays === null || workDays > 366) return fail('Bitte geben Sie die Arbeitstage mit Fahrt zur Arbeit zwischen 0 und 366 an.');

  const privateKm = totalKm * (privPct / 100);
  const commuteKm = workDays * 2 * kmRaw; // tatsächlich gefahrene Kilometer (hin und zurück)
  const taxableKm = privateKm + commuteKm;
  if (taxableKm > totalKm + 1e-9) {
    return fail(`Privatfahrten (${formatNumber(privateKm, 0)} km) und Arbeitsweg (${formatNumber(commuteKm, 0)} km) ergeben mehr als die Jahresfahrleistung von ${formatNumber(totalKm, 0)} km. Bitte prüfen Sie Ihre Angaben.`);
  }
  const costPerKm = costs / totalKm;
  const logbookYearly = costPerKm * taxableKm;
  const taxableShare = (taxableKm / totalKm) * 100;

  // Kostendeckelung: Der pauschale Wert darf die Gesamtkosten des Fahrzeugs nicht übersteigen
  const isCapped = onePctYearly > costs;
  const onePctEffective = isCapped ? costs : onePctYearly;

  const diff = onePctEffective - logbookYearly; // > 0: Fahrtenbuch günstiger
  const absDiff = Math.abs(diff);
  const winner = absDiff < 0.005 ? 'gleich' : diff > 0 ? 'fahrtenbuch' : 'pauschale';
  const netSaving = absDiff * netFactor;
  const winnerLabel = winner === 'fahrtenbuch' ? 'Fahrtenbuch' : winner === 'pauschale' ? '1-%-Regelung' : 'beide Methoden gleich';

  const summary =
    winner === 'gleich'
      ? `Beide Methoden führen zu einem geldwerten Vorteil von ${formatCurrency(logbookYearly)} pro Jahr.`
      : winner === 'fahrtenbuch'
        ? `Günstiger ist das Fahrtenbuch: Der geldwerte Vorteil sinkt von ${formatCurrency(onePctEffective)} auf ${formatCurrency(logbookYearly)} pro Jahr. Das spart geschätzt ${formatCurrency(netSaving)} netto im Jahr (${formatCurrency(netSaving / 12)} im Monat).`
        : `Günstiger ist die 1-%-Regelung: Sie versteuern ${formatCurrency(onePctEffective)} statt ${formatCurrency(logbookYearly)} pro Jahr und sparen sich zusätzlich das Fahrtenbuch. Vorteil netto ca. ${formatCurrency(netSaving)} im Jahr.`;

  const secondary: ResultItem[] = [
    {
      id: 'onePctYearly',
      label: '1-%-Regelung: geldwerter Vorteil pro Jahr',
      value: onePctEffective,
      formattedValue: formatCurrency(onePctEffective),
      helpText: isCapped ? `Pauschal ${formatCurrency(onePctYearly)}, gedeckelt auf die Gesamtkosten (Kostendeckelung).` : `${formatCurrency(totalBenefit)} × 12 Monate`,
    },
    {
      id: 'logbookYearly',
      label: 'Fahrtenbuch: geldwerter Vorteil pro Jahr',
      value: logbookYearly,
      formattedValue: formatCurrency(logbookYearly),
      helpText: `${formatCurrency(costPerKm, 3)}/km × ${formatNumber(taxableKm, 0)} km (privat + Arbeitsweg)`,
    },
    { id: 'netSaving', label: 'Geschätzte Netto-Ersparnis der günstigeren Methode pro Jahr', value: netSaving, formattedValue: formatCurrency(netSaving) },
    { id: 'taxableShare', label: 'Privater Nutzungsanteil (inkl. Arbeitsweg)', value: taxableShare, formattedValue: formatPercent(taxableShare, 1) },
    { id: 'costPerKm', label: 'Gesamtkosten pro km', value: costPerKm, formattedValue: `${formatCurrency(costPerKm, 3)} / km` },
    { id: 'privateKm', label: 'Privatfahrten pro Jahr', value: privateKm, formattedValue: `${formatNumber(privateKm, 0)} km` },
    { id: 'commuteKm', label: 'Fahrten Wohnung–Arbeit pro Jahr (hin und zurück)', value: commuteKm, formattedValue: `${formatNumber(commuteKm, 0)} km` },
    { id: 'totalBenefit', label: '1-%-Regelung: geldwerter Vorteil pro Monat', value: totalBenefit, formattedValue: formatCurrency(totalBenefit) },
    ...baseItems.filter((i) => i.id !== 'annualBenefit'),
  ];

  return {
    primary: {
      id: 'cheaperMethod',
      label: winner === 'gleich' ? 'Ergebnis: beide Methoden gleich' : `Günstiger ist: ${winnerLabel} (Differenz beim geldwerten Vorteil pro Jahr)`,
      value: absDiff,
      formattedValue: formatCurrency(absDiff),
      highlight: true,
    },
    secondary,
    summaryText: summary,
    warning: isCapped
      ? `Die 1-%-Pauschale (${formatCurrency(onePctYearly)}) liegt über den Gesamtkosten des Fahrzeugs (${formatCurrency(costs)}). Versteuert werden dann höchstens die Gesamtkosten.`
      : undefined,
  };
}

// CO?-Rechner f?r Autofahrten: Engine liegt zusammen mit den ?brigen CO?-Engines in co2.ts
export { calculateCarCO2 } from './co2';
