import { CalculationResult } from '@/types/calculator';
import { formatNumber } from '@/lib/formatters';

export function calculatePaintAmount(inputs: Record<string, any>): CalculationResult {
  const length = parseFloat(inputs.roomLength) || 5;
  const width = parseFloat(inputs.roomWidth) || 4;
  const height = parseFloat(inputs.roomHeight) || 2.5;
  const coats = parseInt(inputs.coats || '2', 10);
  const coveragePerLiter = parseFloat(inputs.coveragePerLiter) || 7.0; // 7 m² pro Liter
  const openingDeductionSqm = parseFloat(inputs.openingDeductionSqm) || 5.0; // Fenster und Türen

  if (length <= 0 || width <= 0 || height <= 0 || coveragePerLiter <= 0) {
    return {
      primary: { id: 'liters', label: 'Farbe', value: 0, formattedValue: '0 Liter' },
      error: 'Bitte positive Raummaße und Deckkraft angeben.',
    };
  }

  // Wandfläche = 2 * (Länge + Breite) * Höhe - Öffnungen
  const grossWallArea = 2 * (length + width) * height;
  const netWallArea = Math.max(0, grossWallArea - openingDeductionSqm);
  const totalPaintArea = netWallArea * coats;

  const litersNeeded = totalPaintArea / coveragePerLiter;
  const buckets10L = Math.ceil(litersNeeded / 10);
  const buckets5L = Math.ceil(litersNeeded / 5);

  return {
    primary: {
      id: 'paintLiters',
      label: 'Benötigte Wandfarbe',
      value: litersNeeded,
      formattedValue: `${formatNumber(litersNeeded, 1)} Liter`,
      highlight: true,
    },
    secondary: [
      { id: 'netArea', label: 'Zu streichende Netto-Wandfläche', value: netWallArea, formattedValue: `${formatNumber(netWallArea, 1)} m²` },
      { id: 'totalAreaCoats', label: `Gesamtfläche bei ${coats} Anstrichen`, value: totalPaintArea, formattedValue: `${formatNumber(totalPaintArea, 1)} m²` },
      { id: 'buckets10', label: 'Empfohlene Gebindegröße (10-Liter-Eimer)', value: buckets10L, formattedValue: `${buckets10L} × 10-Liter-Eimer` },
      { id: 'buckets5', label: 'Alternativ (5-Liter-Eimer)', value: buckets5L, formattedValue: `${buckets5L} × 5-Liter-Eimer` },
    ],
    summaryText: `Für ${formatNumber(netWallArea, 1)} m² Wandfläche benötigen Sie bei ${coats} Anstrichen rund ${formatNumber(litersNeeded, 1)} Liter Wandfarbe (ca. ${buckets10L} Eimer à 10 Liter).`,
  };
}

export function calculateFlooring(inputs: Record<string, any>): CalculationResult {
  const length = parseFloat(inputs.length) || 5;
  const width = parseFloat(inputs.width) || 4;
  const wastePercent = parseFloat(inputs.wastePercent) || 10; // 5-10% Verschnitt
  const packSizeSqm = parseFloat(inputs.packSizeSqm) || 2.22; // m² pro Laminatpaket

  if (length <= 0 || width <= 0) {
    return {
      primary: { id: 'totalSqm', label: 'Bodenfläche', value: 0, formattedValue: '0 m²' },
      error: 'Raumlänge und -breite müssen größer als null sein.',
    };
  }

  const pureArea = length * width;
  const totalAreaWithWaste = pureArea * (1 + wastePercent / 100);
  const packsNeeded = packSizeSqm > 0 ? Math.ceil(totalAreaWithWaste / packSizeSqm) : 0;
  const skirtingMeters = 2 * (length + width) * 1.1; // 10% Verschnitt bei Sockelleisten

  return {
    primary: {
      id: 'totalSqm',
      label: 'Bodenbelag inkl. Verschnitt',
      value: totalAreaWithWaste,
      formattedValue: `${formatNumber(totalAreaWithWaste, 2)} m²`,
      highlight: true,
    },
    secondary: [
      { id: 'pureArea', label: 'Reine Raumfläche', value: pureArea, formattedValue: `${formatNumber(pureArea, 2)} m²` },
      { id: 'waste', label: `Eingerechneter Verschnitt (${formatNumber(wastePercent, 0)} %)`, value: totalAreaWithWaste - pureArea, formattedValue: `+${formatNumber(totalAreaWithWaste - pureArea, 2)} m²` },
      { id: 'packs', label: `Benötigte Pakete (${formatNumber(packSizeSqm, 2)} m²/Paket)`, value: packsNeeded, formattedValue: `${packsNeeded} Pakete` },
      { id: 'skirting', label: 'Sockelleisten (Umfang + 10 %)', value: skirtingMeters, formattedValue: `${formatNumber(skirtingMeters, 1)} lfm` },
    ],
    summaryText: `Für einen Raum von ${formatNumber(pureArea, 2)} m² sollten Sie inklusive ${wastePercent} % Verschnitt mindestens ${formatNumber(totalAreaWithWaste, 2)} m² Bodenbelag (${packsNeeded} Pakete) sowie ca. ${formatNumber(skirtingMeters, 1)} laufende Meter Sockelleisten einplanen.`,
  };
}

export function calculateConcreteVolume(inputs: Record<string, any>): CalculationResult {
  const lengthM = parseFloat(inputs.lengthM) || 4;
  const widthM = parseFloat(inputs.widthM) || 3;
  const depthCm = parseFloat(inputs.depthCm) || 15; // Dicke in Zentimeter
  const bagWeightKg = parseFloat(inputs.bagWeightKg) || 25; // 25kg Sack Fertigbeton

  if (lengthM <= 0 || widthM <= 0 || depthCm <= 0) {
    return {
      primary: { id: 'volume', label: 'Betonvolumen', value: 0, formattedValue: '0 m³' },
      error: 'Bitte positive Maße eingeben.',
    };
  }

  const depthM = depthCm / 100;
  const volumeM3 = lengthM * widthM * depthM;

  // Richtwert für Trockenfertigbeton: ca. 2.000 kg bis 2.200 kg pro m³ fertiger Beton (Durchschnitt 2.100 kg)
  const totalWeightKg = volumeM3 * 2100;
  const bags = Math.ceil(totalWeightKg / bagWeightKg);

  return {
    primary: {
      id: 'volume',
      label: 'Benötigtes Betonvolumen',
      value: volumeM3,
      formattedValue: `${formatNumber(volumeM3, 2)} m³ (${formatNumber(volumeM3 * 1000, 0)} Liter)`,
      highlight: true,
    },
    secondary: [
      { id: 'weight', label: 'Trockenmischung Gesamtgewicht', value: totalWeightKg, formattedValue: `ca. ${formatNumber(totalWeightKg, 0)} kg (${formatNumber(totalWeightKg / 1000, 2)} t)` },
      { id: 'bags', label: `Anzahl Fertigbeton-Säcke (${bagWeightKg} kg)`, value: bags, formattedValue: `${bags} Säcke` },
      { id: 'area', label: 'Grundfläche', value: lengthM * widthM, formattedValue: `${formatNumber(lengthM * widthM, 2)} m²` },
    ],
    summaryText: `Für das Fundament (${lengthM} m × ${widthM} m × ${depthCm} cm) benötigen Sie ${formatNumber(volumeM3, 2)} m³ Beton. Bei Sackware entspricht das etwa ${bags} Säcken à ${bagWeightKg} kg.`,
  };
}
