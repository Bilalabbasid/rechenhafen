import { CalculationResult } from '@/types/calculator';
import { formatNumber, formatCurrency } from '@/lib/formatters';
import { GERMAN_DATA_2026 } from '@/data/regulated/2026';

export function calculateFuelCost(inputs: Record<string, any>): CalculationResult {
  const distance = parseFloat(inputs.distance) || 100;
  const consumption = parseFloat(inputs.consumption) || 6.5; // l / 100km
  const pricePerLiter = parseFloat(inputs.pricePerLiter) || 1.75; // € / l
  const tripsCount = parseInt(inputs.tripsCount || '1', 10);

  if (distance <= 0 || consumption <= 0 || pricePerLiter <= 0) {
    return {
      primary: { id: 'cost', label: 'Spritkosten', value: 0, formattedValue: '0,00 €' },
      error: 'Bitte geben Sie positive Werte für Distanz, Verbrauch und Kraftstoffpreis an.',
    };
  }

  // Benötigter Sprit für eine einfache Fahrt
  const litersPerTrip = (distance * consumption) / 100;
  const costPerTrip = litersPerTrip * pricePerLiter;
  const costPerKm = costPerTrip / distance;

  // Gesamtkosten für die eingegebene Anzahl Fahrten
  const totalCost = costPerTrip * tripsCount;
  const totalLiters = litersPerTrip * tripsCount;

  // Monatlich und jährlich bei regelmäßigen Fahrten (z.B. 21 Arbeitstage im Monat)
  const monthlyCost = costPerTrip * 21 * 2; // 21 Tage hin und zurück
  const yearlyCost = costPerTrip * 220 * 2;

  return {
    primary: {
      id: 'costPerTrip',
      label: tripsCount > 1 ? `Gesamtkosten für ${tripsCount} Fahrten` : 'Spritkosten pro Fahrt',
      value: totalCost,
      formattedValue: formatCurrency(totalCost),
      highlight: true,
    },
    secondary: [
      { id: 'costPerKm', label: 'Reine Spritkosten pro Kilometer', value: costPerKm, formattedValue: `${formatCurrency(costPerKm, 3)} / km` },
      { id: 'liters', label: 'Kraftstoffbedarf', value: totalLiters, formattedValue: `${formatNumber(totalLiters, 2)} Liter` },
      { id: 'monthlyCommute', label: 'Monatlich bei täglicher Pendelstrecke (Hin & Zurück)', value: monthlyCost, formattedValue: formatCurrency(monthlyCost) },
      { id: 'yearlyCommute', label: 'Jährlich bei 220 Pendeltagen', value: yearlyCost, formattedValue: formatCurrency(yearlyCost) },
    ],
    summaryText: `Für eine Strecke von ${formatNumber(distance, 1)} km verbraucht Ihr Fahrzeug ${formatNumber(litersPerTrip, 2)} Liter Kraftstoff. Bei ${formatCurrency(pricePerLiter)} je Liter kostet eine Einzelfahrt ${formatCurrency(costPerTrip)} (${formatCurrency(costPerKm, 3)} pro km).`,
  };
}

export function calculateCommuterAllowance(inputs: Record<string, any>): CalculationResult {
  const distanceKm = parseInt(inputs.distanceKm || '25', 10);
  const workdays = parseInt(inputs.workdays || '220', 10);

  if (distanceKm <= 0 || workdays <= 0) {
    return {
      primary: { id: 'allowance', label: 'Entfernungspauschale', value: 0, formattedValue: '0,00 €' },
      error: 'Bitte positive Werte für einfache Entfernung und Arbeitstage angeben.',
    };
  }

  const rateFirst20 = GERMAN_DATA_2026.pendlerpauschale_standard.value; // 0.30 €
  const rateFrom21 = GERMAN_DATA_2026.pendlerpauschale_fernpendler.value; // 0.38 €

  const kmFirst20 = Math.min(20, distanceKm);
  const kmOver20 = Math.max(0, distanceKm - 20);

  const allowancePerDay = (kmFirst20 * rateFirst20) + (kmOver20 * rateFrom21);
  const totalAllowancePerYear = allowancePerDay * workdays;

  return {
    primary: {
      id: 'totalAllowance',
      label: 'Steuerliche Entfernungspauschale (pro Jahr)',
      value: totalAllowancePerYear,
      formattedValue: formatCurrency(totalAllowancePerYear),
      highlight: true,
    },
    secondary: [
      { id: 'perDay', label: 'Pauschale pro Arbeitstag', value: allowancePerDay, formattedValue: formatCurrency(allowancePerDay) },
      { id: 'rate20', label: 'Kilometer 1 bis 20 (0,30 €/km)', value: kmFirst20 * rateFirst20, formattedValue: formatCurrency(kmFirst20 * rateFirst20) },
      { id: 'rateOver20', label: 'Kilometer ab 21 (0,38 €/km)', value: kmOver20 * rateFrom21, formattedValue: formatCurrency(kmOver20 * rateFrom21) },
      { id: 'source', label: 'Rechtsgrundlage', value: '§ 9 Abs. 1 Nr. 4 EStG', formattedValue: 'EStG (Stand 2026)' },
    ],
    summaryText: `Bei einer einfachen Strecke von ${distanceKm} km zur Arbeitsstätte und ${workdays} Arbeitstagen im Jahr können Sie ${formatCurrency(totalAllowancePerYear)} als Werbungskosten geltend machen.`,
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
