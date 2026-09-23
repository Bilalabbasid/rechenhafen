import { CalculationResult } from '@/types/calculator';
import { formatNumber, formatCurrency } from '@/lib/formatters';
import { GERMAN_DATA_2026 } from '@/data/regulated/2026';

export function calculateFuelCost(inputs: Record<string, any>): CalculationResult {
  const distance = parseFloat(inputs.distance) || 100;
  const consumption = parseFloat(inputs.consumption) || 6.5; // l / 100km
  const pricePerLiter = parseFloat(inputs.pricePerLiter) || 1.75; // € / l
  const tripType = inputs.tripType || 'single'; // 'single' vs 'roundtrip'
  const tripsCount = Math.max(1, parseInt(inputs.tripsCount || '1', 10));
  const passengers = Math.max(1, parseInt(inputs.passengers || '1', 10));

  if (distance <= 0 || consumption <= 0 || pricePerLiter <= 0) {
    return {
      primary: { id: 'cost', label: 'Spritkosten', value: 0, formattedValue: '0,00 €' },
      error: 'Bitte geben Sie positive Werte für Distanz, Verbrauch und Kraftstoffpreis an.',
    };
  }

  // Effektive Strecke pro Fahrt
  const effectiveDistancePerTrip = tripType === 'roundtrip' ? distance * 2 : distance;
  const totalKm = effectiveDistancePerTrip * tripsCount;

  // Kraftstoffbedarf
  const litersPerTrip = (effectiveDistancePerTrip * consumption) / 100;
  const totalLiters = litersPerTrip * tripsCount;
  const costPerTrip = litersPerTrip * pricePerLiter;
  const totalCost = costPerTrip * tripsCount;
  const costPerKm = costPerTrip / effectiveDistancePerTrip;
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
      label: `Kosten pro Person (${passengers} Mitfahrer)`,
      value: costPerPerson,
      formattedValue: formatCurrency(costPerPerson),
    });
  }

  // Pendel-Hochrechnung
  const monthlyCost = (distance * 2 * consumption / 100 * pricePerLiter) * 21;
  const yearlyCost = (distance * 2 * consumption / 100 * pricePerLiter) * 220;
  secondary.push(
    { id: 'monthlyCommute', label: 'Monatlich bei täglichem Pendeln (21 Tage Hin & Zurück)', value: monthlyCost, formattedValue: formatCurrency(monthlyCost) },
    { id: 'yearlyCommute', label: 'Jährlich bei 220 Pendeltagen (Hin & Zurück)', value: yearlyCost, formattedValue: formatCurrency(yearlyCost) },
  );

  let labelText = tripType === 'roundtrip' ? 'Spritkosten (Hin- und Rückfahrt)' : 'Spritkosten (Einfache Fahrt)';
  if (tripsCount > 1) {
    labelText = `Gesamtkosten für ${tripsCount} Fahrten`;
  }

  let summary = `Für eine Strecke von ${formatNumber(effectiveDistancePerTrip, 1)} km (${tripType === 'roundtrip' ? 'Hin- und Rückfahrt' : 'einfache Fahrt'}) fallen bei ${formatCurrency(pricePerLiter)} je Liter Spritkosten in Höhe von ${formatCurrency(costPerTrip)} an (${formatCurrency(costPerKm, 3)}/km).`;
  if (passengers > 1) {
    summary += ` Bei ${passengers} Mitfahrern beträgt der Anteil ${formatCurrency(costPerPerson)} pro Person.`;
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

export function calculateCommuterAllowance(inputs: Record<string, any>): CalculationResult {
  const distanceKm = parseInt(inputs.distanceKm || '25', 10);
  const workdays = parseInt(inputs.workdays || '220', 10);
  const homeOfficeDays = Math.max(0, parseInt(inputs.homeOfficeDays || '0', 10));
  const transportMode = inputs.transportMode || 'car'; // 'car' vs 'public'

  if (distanceKm <= 0 || workdays <= 0) {
    return {
      primary: { id: 'allowance', label: 'Entfernungspauschale', value: 0, formattedValue: '0,00 €' },
      error: 'Bitte positive Werte für einfache Entfernung und Arbeitstage angeben.',
    };
  }

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
  const distance = parseFloat(inputs.distance) || 100;
  const consumptionKwh = parseFloat(inputs.consumptionKwh) || 18.0; // kWh / 100km
  const pricePerKwh = parseFloat(inputs.pricePerKwh) || GERMAN_DATA_2026.strompreis_durchschnitt.value; // default 0.38 €
  const batterySize = parseFloat(inputs.batterySize) || 60; // kWh

  if (distance <= 0 || consumptionKwh <= 0 || pricePerKwh <= 0) {
    return {
      primary: { id: 'cost', label: 'Ladekosten', value: 0, formattedValue: '0,00 €' },
      error: 'Bitte positive Werte angeben.',
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
  const distance = parseFloat(inputs.distance) || 350;
  const speed = parseFloat(inputs.speed) || 100; // km/h
  const breakMinutes = parseInt(inputs.breakMinutes || '30', 10);

  if (distance <= 0 || speed <= 0) {
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

export function calculateCarCO2(inputs: Record<string, any>): CalculationResult {
  const distanceKm = parseFloat(inputs.distanceKm) || 15000;
  const fuelType = inputs.fuelType || 'benzin'; // 'benzin', 'diesel', 'electric'
  const consumption = parseFloat(inputs.consumption) || (fuelType === 'diesel' ? 5.5 : (fuelType === 'electric' ? 18 : 6.8));

  let factor = GERMAN_DATA_2026.co2_faktor_benzin.value; // kg CO2 / Liter
  let unit = 'Liter';

  if (fuelType === 'diesel') {
    factor = GERMAN_DATA_2026.co2_faktor_diesel.value;
  } else if (fuelType === 'electric') {
    factor = GERMAN_DATA_2026.co2_faktor_strommix.value;
    unit = 'kWh';
  }

  const totalFuel = (distanceKm * consumption) / 100;
  const totalCO2Kg = totalFuel * factor;
  const co2PerKmGrams = (totalCO2Kg / distanceKm) * 1000;

  return {
    primary: {
      id: 'co2Annual',
      label: 'Jährlicher CO2-Ausstoß',
      value: totalCO2Kg / 1000,
      formattedValue: `${formatNumber(totalCO2Kg / 1000, 2)} Tonnen CO2`,
      highlight: true,
    },
    secondary: [
      { id: 'co2PerKm', label: 'CO2-Emissionen pro Kilometer', value: co2PerKmGrams, formattedValue: `${formatNumber(co2PerKmGrams, 0)} g CO2/km` },
      { id: 'totalFuel', label: `Jahresbedarf an ${unit}`, value: totalFuel, formattedValue: `${formatNumber(totalFuel, 1)} ${unit}` },
      { id: 'factorUsed', label: 'Emissionsfaktor', value: factor, formattedValue: `${factor} kg CO2 pro ${unit}` },
    ],
    summaryText: `Bei einer Fahrleistung von ${formatNumber(distanceKm, 0)} km und einem Verbrauch von ${formatNumber(consumption, 1)} ${unit}/100 km emittiert Ihr Fahrzeug rund ${formatNumber(totalCO2Kg / 1000, 2)} Tonnen CO2 im Jahr (${formatNumber(co2PerKmGrams, 0)} g/km).`,
  };
}
