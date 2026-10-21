import { CalculationResult, ResultItem } from '@/types/calculator';
import { formatNumber, formatCurrency } from '@/lib/formatters';
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

  // Effektive Strecke pro Fahrt
  const effectiveDistancePerTrip = tripType === 'roundtrip' ? distance * 2 : distance;
  const totalKm = effectiveDistancePerTrip * tripsCount;

  // Kraftstoffbedarf & Kosten
  const litersPerTrip = (effectiveDistancePerTrip * consumption) / 100;
  const totalLiters = litersPerTrip * tripsCount;
  const costPerTrip = litersPerTrip * pricePerLiter;
  const totalCost = costPerTrip * tripsCount;
  const costPerKm = effectiveDistancePerTrip > 0 ? costPerTrip / effectiveDistancePerTrip : 0;
  const costPer100Km = (consumption * pricePerLiter);
  const costPerPerson = totalCost / passengers;

  const secondary: Array<{ id: string; label: string; value: any; formattedValue: string }> = [
    { id: 'costPerKm', label: 'Kraftstoffkosten pro Kilometer', value: costPerKm, formattedValue: `${formatCurrency(costPerKm, 3)} / km` },
    { id: 'costPer100Km', label: 'Kosten pro 100 km', value: costPer100Km, formattedValue: formatCurrency(costPer100Km) },
    { id: 'totalLiters', label: 'Kraftstoffbedarf gesamt', value: totalLiters, formattedValue: `${formatNumber(totalLiters, 2)} Liter` },
    { id: 'totalKm', label: 'Fahrstrecke gesamt', value: totalKm, formattedValue: `${formatNumber(totalKm, 1)} km` },
  ];

  if (passengers > 1) {
    secondary.unshift({
      id: 'costPerPerson',
      label: `Kosten pro Person (${passengers} Personen inkl. Fahrer)`,
      value: costPerPerson,
      formattedValue: formatCurrency(costPerPerson),
    });
  }

  // Pendel-Hochrechnung (tägliche Hin- & Rückfahrt) ohne Doppelmultiplikation mit tripsCount
  const dailyCommuteKm = tripType === 'roundtrip' ? effectiveDistancePerTrip : distance * 2;
  const monthlyCost = (dailyCommuteKm * consumption / 100 * pricePerLiter) * 21;
  const yearlyCost = (dailyCommuteKm * consumption / 100 * pricePerLiter) * 220;
  secondary.push(
    { id: 'monthlyCommute', label: 'Monatlich bei täglichem Pendeln (21 Arbeitstage Hin & Zurück)', value: monthlyCost, formattedValue: formatCurrency(monthlyCost) },
    { id: 'yearlyCommute', label: 'Jährlich bei 220 Pendeltagen (Hin & Zurück)', value: yearlyCost, formattedValue: formatCurrency(yearlyCost) },
  );

  let labelText = tripType === 'roundtrip' ? 'Spritkosten (Hin- und Rückfahrt)' : 'Spritkosten (Einfache Fahrt)';
  if (tripsCount > 1) {
    labelText = `Gesamtkosten für ${tripsCount} Fahrten`;
  }

  let summary = `Für eine Strecke von ${formatNumber(effectiveDistancePerTrip, 1)} km (${tripType === 'roundtrip' ? 'Hin- und Rückfahrt' : 'einfache Fahrt'}) fallen bei ${formatCurrency(pricePerLiter)} je Liter Spritkosten in Höhe von ${formatCurrency(costPerTrip)} an (${formatCurrency(costPerKm, 3)}/km).`;
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

import { EMISSION_FACTORS } from '@/data/emissions';

export function calculateCarCO2(inputs: Record<string, any>): CalculationResult {
  if (inputs.distanceKm === undefined || inputs.distanceKm === null || String(inputs.distanceKm).trim() === '') {
    return {
      primary: { id: 'co2', label: 'CO2-Ausstoß', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die Fahrstrecke in Kilometern an.',
    };
  }

  const distanceKm = parseFloat(String(inputs.distanceKm).replace(',', '.'));
  if (isNaN(distanceKm) || distanceKm <= 0) {
    return {
      primary: { id: 'co2', label: 'CO2-Ausstoß', value: 0, formattedValue: '-' },
      error: 'Die Fahrstrecke muss eine positive Zahl größer als 0 km sein.',
    };
  }

  const fuelType = String(inputs.fuelType || 'benzin');
  const tripMode = String(inputs.tripMode || 'annual'); // 'annual' | 'single_trip'
  const boundary = String(inputs.boundary || 'direct'); // 'direct' | 'lifecycle'

  let defaultConsumption = 6.8;
  if (fuelType === 'diesel') defaultConsumption = 5.5;
  else if (fuelType.startsWith('electric')) defaultConsumption = 18.0;

  const rawConsumption = inputs.consumption !== undefined && inputs.consumption !== null && String(inputs.consumption).trim() !== ''
    ? parseFloat(String(inputs.consumption).replace(',', '.'))
    : defaultConsumption;

  if (isNaN(rawConsumption) || rawConsumption <= 0) {
    return {
      primary: { id: 'co2', label: 'CO2-Ausstoß', value: 0, formattedValue: '-' },
      error: 'Der Kraftstoff- bzw. Stromverbrauch muss eine positive Zahl sein.',
    };
  }

  const isElectric = fuelType.startsWith('electric');
  const unit = isElectric ? 'kWh' : 'Liter';

  // Determine factor from verified registry
  let factor = EMISSION_FACTORS.brennstoff_benzin_direkt.value; // default: 2.37 kg/l
  let factorName = 'Superbenzin direkte Verbrennung (2,37 kg CO₂/l)';
  let gasType: 'CO2' | 'CO2e' = 'CO2';

  if (fuelType === 'diesel') {
    if (boundary === 'lifecycle') {
      factor = EMISSION_FACTORS.brennstoff_diesel_lifecycle.value; // 3.24
      factorName = 'Diesel Well-to-Wheel (3,24 kg CO₂e/l inkl. Vorkette)';
      gasType = 'CO2e';
    } else {
      factor = EMISSION_FACTORS.brennstoff_diesel_direkt.value; // 2.65
      factorName = 'Diesel direkte Verbrennung (2,65 kg CO₂/l)';
    }
  } else if (fuelType === 'electric_green') {
    factor = EMISSION_FACTORS.strom_oekostrom_lifecycle.value / 1000; // 0.025 kg/kWh
    factorName = 'Ökostrom Lebenszyklus (25 g CO₂e/kWh für PV/Wind-Herstellung)';
    gasType = 'CO2e';
  } else if (isElectric) {
    if (boundary === 'lifecycle') {
      factor = EMISSION_FACTORS.strom_mix_de_lifecycle_2025.value / 1000; // 0.410 kg/kWh
      factorName = 'Deutscher Strommix 2025 Lebenszyklus (410 g CO₂e/kWh inkl. Vorkette)';
      gasType = 'CO2e';
    } else {
      factor = EMISSION_FACTORS.strom_mix_de_generation_2025.value / 1000; // 0.344 kg/kWh
      factorName = 'Deutscher Strommix 2025 Erzeugung (344 g CO₂/kWh Inlandskraftwerke)';
    }
  } else {
    // benzin
    if (boundary === 'lifecycle') {
      factor = EMISSION_FACTORS.brennstoff_benzin_lifecycle.value; // 2.82
      factorName = 'Superbenzin Well-to-Wheel (2,82 kg CO₂e/l inkl. Vorkette)';
      gasType = 'CO2e';
    } else {
      factor = EMISSION_FACTORS.brennstoff_benzin_direkt.value; // 2.37
      factorName = 'Superbenzin direkte Verbrennung (2,37 kg CO₂/l)';
    }
  }

  const totalFuel = (distanceKm * rawConsumption) / 100;
  const totalCO2Kg = totalFuel * factor;
  const co2PerKmGrams = distanceKm > 0 ? (totalCO2Kg / distanceKm) * 1000 : 0;
  const co2Tonnes = totalCO2Kg / 1000;

  const isAnnual = tripMode === 'annual';
  const labelPrefix = isAnnual ? 'Jährlicher CO2-Ausstoß' : 'CO2-Ausstoß der Einzelfahrt';
  const formattedPrimary = isAnnual
    ? (co2Tonnes >= 1 ? `${formatNumber(co2Tonnes, 2)} Tonnen ${gasType}` : `${formatNumber(totalCO2Kg, 1)} kg ${gasType}`)
    : (totalCO2Kg >= 1000 ? `${formatNumber(co2Tonnes, 2)} Tonnen ${gasType} (${formatNumber(totalCO2Kg, 0)} kg)` : `${formatNumber(totalCO2Kg, 1)} kg ${gasType}`);

  const secondary: ResultItem[] = [
    {
      id: 'co2PerKm',
      label: `Spezifische Emissionen pro Kilometer`,
      value: co2PerKmGrams,
      formattedValue: `${formatNumber(co2PerKmGrams, 1)} g ${gasType}/km`,
      highlight: true,
      helpText: 'Tatsächliche Treibhausgas-Emissionen geteilt durch die gefahrene Wegstrecke.',
    },
    {
      id: 'totalFuel',
      label: isAnnual ? `Jahresbedarf an ${unit}` : `Bedarf für diese Fahrt`,
      value: totalFuel,
      formattedValue: `${formatNumber(totalFuel, 1)} ${unit}`,
      helpText: `Berechnet aus ${formatNumber(distanceKm, 0)} km bei ${formatNumber(rawConsumption, 1)} ${unit}/100 km.`,
    },
    {
      id: 'factorUsed',
      label: 'Angewandter Emissionsfaktor',
      value: factor,
      formattedValue: `${formatNumber(factor, 3)} kg ${gasType} pro ${unit}`,
      helpText: factorName,
    },
  ];

  if (isAnnual) {
    secondary.push({
      id: 'monthlyAverage',
      label: 'Monatlicher Durchschnitt',
      value: totalCO2Kg / 12,
      formattedValue: `${formatNumber(totalCO2Kg / 12, 1)} kg ${gasType}/Monat`,
    });
  }

  return {
    primary: {
      id: 'co2Total',
      label: labelPrefix,
      value: isAnnual ? co2Tonnes : totalCO2Kg,
      formattedValue: formattedPrimary,
      highlight: true,
    },
    secondary,
    directAnswer: isAnnual
      ? `Bei ${formatNumber(distanceKm, 0)} km Fahrleistung und ${formatNumber(rawConsumption, 1)} ${unit}/100 km entstehen jährlich ca. ${formatNumber(co2Tonnes, 2)} Tonnen ${gasType} (${formatNumber(co2PerKmGrams, 0)} g/km).`
      : `Für eine Einzelfahrt über ${formatNumber(distanceKm, 0)} km entstehen ca. ${formatNumber(totalCO2Kg, 1)} kg ${gasType} (${formatNumber(co2PerKmGrams, 0)} g/km).`,
    summaryText: isAnnual
      ? `Bei einer Jahresfahrleistung von ${formatNumber(distanceKm, 0)} km und einem Verbrauch von ${formatNumber(rawConsumption, 1)} ${unit}/100 km emittiert Ihr Fahrzeug rund ${formatNumber(co2Tonnes, 2)} Tonnen ${gasType} im Jahr (ca. ${formatNumber(co2PerKmGrams, 0)} g/km).`
      : `Für die Fahrtstrecke von ${formatNumber(distanceKm, 0)} km bei einem Verbrauch von ${formatNumber(rawConsumption, 1)} ${unit}/100 km entstehen rund ${formatNumber(totalCO2Kg, 1)} kg ${gasType} (ca. ${formatNumber(co2PerKmGrams, 0)} g/km).`,
    basisSummary: [
      { label: 'Fahrtart', value: isAnnual ? 'Jährliche Gesamtfahrleistung' : 'Einzelfahrt' },
      { label: 'Strecke', value: `${formatNumber(distanceKm, 0)} km` },
      { label: 'Verbrauch', value: `${formatNumber(rawConsumption, 1)} ${unit}/100 km` },
      { label: 'Emissionsgrenze', value: boundary === 'lifecycle' ? 'Well-to-Wheel (Lebenszyklus inkl. Vorkette)' : 'Direkte Emissionen (Tank-to-Wheel / Kraftwerk)' },
      { label: 'Spezifischer Faktor', value: `${formatNumber(factor, 3)} kg ${gasType}/${unit}` },
    ],
    calculationSteps: [
      `Brennstoff- / Strombedarf: (${formatNumber(distanceKm, 0)} km × ${formatNumber(rawConsumption, 1)} ${unit}) ÷ 100 = ${formatNumber(totalFuel, 2)} ${unit}`,
      `CO2-Ausstoß: ${formatNumber(totalFuel, 2)} ${unit} × ${formatNumber(factor, 3)} kg/${unit} = ${formatNumber(totalCO2Kg, 1)} kg ${gasType}`,
      `Spezifische Emission: (${formatNumber(totalCO2Kg, 1)} kg × 1.000) ÷ ${formatNumber(distanceKm, 0)} km = ${formatNumber(co2PerKmGrams, 1)} g ${gasType}/km`,
    ],
    qualifications: [
      boundary === 'direct' && isElectric
        ? 'Für Elektrofahrzeuge werden die Emissionen der inländischen Stromerzeugung (deutscher Strommix 2025: geschätzt 344 g CO₂/kWh laut UBA) zugrunde gelegt. Am Auspuff entstehen 0 g direkte Emissionen.'
        : (boundary === 'direct'
            ? 'Reine direkte Verbrennungsemissionen des Kraftstoffs im Motor (Tank-to-Wheel). Vorketten wie Ölförderung, Raffinerie und Transport sind nicht enthalten.'
            : 'Well-to-Wheel Bilanz: Berücksichtigt sowohl die Vorkette (Gewinnung, Raffinerie, Transport) als auch die Verbrennung bzw. Kraftwerksverluste.'),
      'Fahrzeugbau, Reifenabrieb und Entsorgung sind nicht eingerechnet. Dieser Wert bildet keine vollständige persönliche Ökobilanz ab.',
    ],
  };
}
