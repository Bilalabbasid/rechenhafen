import { CalculationResult } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';

// --- TECHNIK & DIGITAL ---
export function calculateDownloadTime(inputs: Record<string, any>): CalculationResult {
  const sizeMb = parseFloat(inputs.fileSizeMb) || 1000; // 1 GB
  const speedMbps = parseFloat(inputs.internetSpeedMbps) || 50; // 50 Mbit/s DSL

  if (sizeMb <= 0 || speedMbps <= 0) {
    return { primary: { id: 'time', label: 'Downloadzeit', value: 0, formattedValue: '0 Sek.' }, error: 'Ungültige Dateigröße oder Geschwindigkeit.' };
  }

  // 1 Byte = 8 Bit. Datei in Megabit = sizeMb * 8
  const sizeMbit = sizeMb * 8;
  const seconds = sizeMbit / speedMbps;
  const minutes = seconds / 60;
  const hours = minutes / 60;

  let formattedTime = `${formatNumber(seconds, 0)} Sekunden`;
  if (hours >= 1) {
    formattedTime = `${Math.floor(hours)} Std. ${Math.round(minutes % 60)} Min.`;
  } else if (minutes >= 1) {
    formattedTime = `${Math.floor(minutes)} Min. ${Math.round(seconds % 60)} Sek.`;
  }

  return {
    primary: { id: 'time', label: 'Geschätzte Downloadzeit', value: seconds, formattedValue: formattedTime, highlight: true },
    secondary: [
      { id: 'mbps', label: 'Reale Übertragungsrate', value: speedMbps / 8, formattedValue: `${formatNumber(speedMbps / 8, 2)} MB/s` },
      { id: 'sizeGb', label: 'Dateigröße in Gigabyte', value: sizeMb / 1000, formattedValue: `${formatNumber(sizeMb / 1000, 2)} GB` },
      { id: 'tenGigabit', label: 'Dauer bei Gigabit-Glasfaser (1.000 Mbit/s)', value: sizeMbit / 1000, formattedValue: `${formatNumber(sizeMbit / 1000, 1)} Sek.` },
    ],
    summaryText: `Eine ${formatNumber(sizeMb, 0)} MB große Datei lädt mit ${formatNumber(speedMbps, 0)} Mbit/s in ca. ${formattedTime} herunter (Übertragungsrate: ${formatNumber(speedMbps / 8, 2)} Megabyte pro Sekunde).`,
  };
}

export function calculateBatteryLife(inputs: Record<string, any>): CalculationResult {
  const capacityMah = parseFloat(inputs.capacityMah) || 4500; // Smartphone Akku
  const consumptionMa = parseFloat(inputs.consumptionMa) || 300;

  if (capacityMah <= 0 || consumptionMa <= 0) {
    return { primary: { id: 'hours', label: 'Akkulaufzeit', value: 0, formattedValue: '0 Std.' }, error: 'Bitte positive Werte angeben.' };
  }

  // Faustformel mit 15 % Entladungsreserve/Wirkungsgrad: capacity * 0.85 / consumption
  const hours = (capacityMah * 0.85) / consumptionMa;
  const days = hours / 24;

  return {
    primary: { id: 'hours', label: 'Nutzbare Akkulaufzeit', value: hours, formattedValue: `${formatNumber(hours, 1)} Stunden`, highlight: true },
    secondary: [
      { id: 'days', label: 'In Tagen', value: days, formattedValue: `${formatNumber(days, 1)} Tage` },
      { id: 'nominal', label: 'Theoretische Maximallaufzeit (ohne Verlust)', value: capacityMah / consumptionMa, formattedValue: `${formatNumber(capacityMah / consumptionMa, 1)} Std.` },
    ],
    summaryText: `Bei ${formatNumber(capacityMah, 0)} mAh Kapazität und ${formatNumber(consumptionMa, 0)} mA Verbrauch hält der Akku im Schnitt ca. ${formatNumber(hours, 1)} Stunden durch.`,
  };
}

// --- PHYSIK & WISSENSCHAFT ---
export function calculateSpeedDistanceTime(inputs: Record<string, any>): CalculationResult {
  const target = inputs.target || 'distance'; // 'distance', 'speed', 'time'
  const speed = parseFloat(inputs.speedKmh) || 120;
  const distance = parseFloat(inputs.distanceKm) || 240;
  const timeHours = parseFloat(inputs.timeHours) || 2;

  if (target === 'distance') {
    const d = speed * timeHours;
    return {
      primary: { id: 'dist', label: 'Zurückgelegte Strecke', value: d, formattedValue: `${formatNumber(d, 2)} km`, highlight: true },
      secondary: [
        { id: 'inMeters', label: 'In Metern', value: d * 1000, formattedValue: `${formatNumber(d * 1000, 0)} m` },
        { id: 'speedMs', label: 'Geschwindigkeit in m/s', value: speed / 3.6, formattedValue: `${formatNumber(speed / 3.6, 2)} m/s` },
      ],
      summaryText: `Bei ${formatNumber(speed)} km/h legen Sie in ${formatNumber(timeHours)} Stunden eine Strecke von ${formatNumber(d, 2)} km zurück.`,
    };
  } else if (target === 'speed') {
    const s = timeHours > 0 ? distance / timeHours : 0;
    return {
      primary: { id: 'speed', label: 'Durchschnittsgeschwindigkeit', value: s, formattedValue: `${formatNumber(s, 2)} km/h`, highlight: true },
      secondary: [{ id: 'speedMs', label: 'In m/s', value: s / 3.6, formattedValue: `${formatNumber(s / 3.6, 2)} m/s` }],
      summaryText: `Für ${formatNumber(distance)} km in ${formatNumber(timeHours)} Stunden ist eine Geschwindigkeit von ${formatNumber(s, 2)} km/h erforderlich.`,
    };
  } else {
    const t = speed > 0 ? distance / speed : 0;
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    return {
      primary: { id: 'time', label: 'Benötigte Zeit', value: t, formattedValue: `${h} Std. ${m} Min.`, highlight: true },
      secondary: [{ id: 'decHours', label: 'In Dezimalstunden', value: t, formattedValue: `${formatNumber(t, 2)} Std.` }],
      summaryText: `Für ${formatNumber(distance)} km bei ${formatNumber(speed)} km/h beträgt die Fahrzeit ${h} Stunden und ${m} Minuten.`,
    };
  }
}

export function calculateDensity(inputs: Record<string, any>): CalculationResult {
  const massKg = parseFloat(inputs.massKg) || 7.87; // z.B. Eisen
  const volumeDm3 = parseFloat(inputs.volumeDm3) || 1.0; // 1 Liter = 1 dm³

  if (volumeDm3 <= 0 || massKg <= 0) {
    return { primary: { id: 'density', label: 'Dichte', value: 0, formattedValue: '0 kg/m³' }, error: 'Masse und Volumen müssen positiv sein.' };
  }

  // Dichte in kg/dm³ (g/cm³)
  const densityGcm3 = massKg / volumeDm3;
  const densityKgm3 = densityGcm3 * 1000;

  return {
    primary: { id: 'density', label: 'Spezifische Dichte (ρ)', value: densityKgm3, formattedValue: `${formatNumber(densityKgm3, 1)} kg/m³`, highlight: true },
    secondary: [
      { id: 'densityGcm3', label: 'In g/cm³ (kg/l)', value: densityGcm3, formattedValue: `${formatNumber(densityGcm3, 3)} g/cm³` },
      { id: 'waterComp', label: 'Vergleich zu Wasser (1,0 g/cm³)', value: densityGcm3, formattedValue: `${formatNumber(densityGcm3, 2)} × so schwer wie Wasser` },
    ],
    summaryText: `Bei einer Masse von ${formatNumber(massKg, 2)} kg und einem Volumen von ${formatNumber(volumeDm3, 2)} Litern beträgt die Dichte ${formatNumber(densityKgm3, 1)} kg/m³ (${formatNumber(densityGcm3, 3)} g/cm³).`,
  };
}

// --- UMWELT & NACHHALTIGKEIT ---
export function calculateFlightCO2(inputs: Record<string, any>): CalculationResult {
  const distanceKm = parseFloat(inputs.distanceKm) || 2000; // z.B. Mallorca Hin & Rück
  const passengers = parseInt(inputs.passengers || '1', 10);
  const flightClass = inputs.flightClass || 'economy'; // eco vs business

  const factorPerKm = flightClass === 'business' ? 0.38 : 0.23; // kg CO2e pro Personenkilometer inkl. RFI-Faktor
  const co2Kg = distanceKm * factorPerKm * passengers;
  const co2Tonnes = co2Kg / 1000;
  const treesNeeded = Math.ceil(co2Kg / 22); // Ein ausgewachsener Baum bindet ca. 22 kg CO2 pro Jahr

  return {
    primary: { id: 'co2', label: 'Treibhausgasemissionen (CO2e)', value: co2Tonnes, formattedValue: `${formatNumber(co2Tonnes, 2)} Tonnen CO2`, highlight: true },
    secondary: [
      { id: 'kgPerPerson', label: 'Emissionen pro Passagier', value: co2Kg / passengers, formattedValue: `${formatNumber(co2Kg / passengers, 0)} kg CO2` },
      { id: 'trees', label: 'Ausgleich: Bäume zur Kompensation (für 1 Jahr)', value: treesNeeded, formattedValue: `${treesNeeded} Bäume` },
      { id: 'distance', label: 'Gesamte Flugstrecke', value: distanceKm, formattedValue: `${formatNumber(distanceKm, 0)} km` },
    ],
    summaryText: `Für einen Flug über ${formatNumber(distanceKm, 0)} km mit ${passengers} Personen entstehen ca. ${formatNumber(co2Tonnes, 2)} Tonnen CO2-Äquivalente (inklusive Höhendruckeffekt RFI). Ein Baum benötigt ca. ${treesNeeded} Jahre, um diese Menge zu binden.`,
  };
}

// --- BUSINESS: SKONTO & RABATT ---
export function calculateDiscount(inputs: Record<string, any>): CalculationResult {
  const originalPrice = parseFloat(inputs.originalPrice) || 120;
  const discountPercent = parseFloat(inputs.discountPercent) || 20;

  const saved = originalPrice * (discountPercent / 100);
  const finalPrice = originalPrice - saved;

  return {
    primary: { id: 'finalPrice', label: 'Reduzierter Endpreis', value: finalPrice, formattedValue: formatCurrency(finalPrice), highlight: true },
    secondary: [
      { id: 'saved', label: 'Ihre Ersparnis', value: saved, formattedValue: formatCurrency(saved) },
      { id: 'orig', label: 'Ursprungspreis', value: originalPrice, formattedValue: formatCurrency(originalPrice) },
      { id: 'percent', label: 'Rabatt in Prozent', value: discountPercent, formattedValue: formatPercent(discountPercent) },
    ],
    summaryText: `Bei einem Rabatt von ${formatPercent(discountPercent)} auf ${formatCurrency(originalPrice)} sparen Sie ${formatCurrency(saved)}. Der neue Preis beträgt ${formatCurrency(finalPrice)}.`,
  };
}

export function calculateCashDiscount(inputs: Record<string, any>): CalculationResult {
  const invoiceAmount = parseFloat(inputs.invoiceAmount) || 1000;
  const skontoPercent = parseFloat(inputs.skontoPercent) || 2.0; // 2% oder 3% Skonto
  const skontoDays = parseInt(inputs.skontoDays || '10', 10);
  const netDays = parseInt(inputs.netDays || '30', 10);

  const skontoAmount = invoiceAmount * (skontoPercent / 100);
  const payAmount = invoiceAmount - skontoAmount;

  // Effektiver Jahreszins für Skonto: Zins = (Skontosatz / (100 - Skontosatz)) * (360 / (Nettoziel - Skontoziel))
  const daysDiff = Math.max(1, netDays - skontoDays);
  const annualInterestEquivalent = (skontoPercent / (100 - skontoPercent)) * (360 / daysDiff) * 100;

  return {
    primary: { id: 'skontoAmount', label: 'Skonto-Ersparnis', value: skontoAmount, formattedValue: formatCurrency(skontoAmount), highlight: true },
    secondary: [
      { id: 'payAmount', label: `Zahlbetrag bei Zahlung innerhalb von ${skontoDays} Tagen`, value: payAmount, formattedValue: formatCurrency(payAmount) },
      { id: 'effectiveRate', label: 'Effektiver Jahreszinssatz (Kreditvergleich)', value: annualInterestEquivalent, formattedValue: `${formatPercent(annualInterestEquivalent, 1)} p.a.` },
    ],
    summaryText: `Durch die Inanspruchnahme von ${formatPercent(skontoPercent)} Skonto sparen Sie ${formatCurrency(skontoAmount)} und zahlen nur ${formatCurrency(payAmount)}. Dies entspricht einem extrem attraktiven Jahreszins von ${formatPercent(annualInterestEquivalent, 1)} – Skonto ziehen lohnt sich fast immer!`,
  };
}
