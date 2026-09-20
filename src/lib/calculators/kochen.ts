import { CalculationResult } from '@/types/calculator';
import { formatNumber } from '@/lib/formatters';

export function calculatePortions(inputs: Record<string, any>): CalculationResult {
  const originalPortions = parseFloat(inputs.originalPortions) || 4;
  const targetPortions = parseFloat(inputs.targetPortions) || 6;
  const originalAmount = parseFloat(inputs.originalAmount) || 500;
  const unit = inputs.unit || 'g';

  if (originalPortions <= 0 || targetPortions <= 0) {
    return {
      primary: { id: 'amount', label: 'Menge', value: 0, formattedValue: '0' },
      error: 'Portionsangaben müssen größer als 0 sein.',
    };
  }

  const factor = targetPortions / originalPortions;
  const scaledAmount = originalAmount * factor;

  return {
    primary: {
      id: 'scaledAmount',
      label: `Benötigte Menge für ${targetPortions} Portionen`,
      value: scaledAmount,
      formattedValue: `${formatNumber(scaledAmount, 1)} ${unit}`,
      highlight: true,
    },
    secondary: [
      { id: 'factor', label: 'Umrechnungsfaktor', value: factor, formattedValue: `${formatNumber(factor, 3)} ×` },
      { id: 'perPortion', label: 'Menge pro Portion', value: originalAmount / originalPortions, formattedValue: `${formatNumber(originalAmount / originalPortions, 1)} ${unit}` },
    ],
    summaryText: `Um ein Rezept von ${originalPortions} auf ${targetPortions} Portionen anzupassen (Faktor ${formatNumber(factor, 2)}), benötigen Sie ${formatNumber(scaledAmount, 1)} ${unit} statt ${formatNumber(originalAmount, 1)} ${unit}.`,
  };
}

export function calculateBakingPan(inputs: Record<string, any>): CalculationResult {
  const shapeFrom = inputs.shapeFrom || 'round';
  const shapeTo = inputs.shapeTo || 'round';

  const d1 = parseFloat(inputs.diameterFrom) || 26; // 26cm Springform
  const d2 = parseFloat(inputs.diameterTo) || 20;   // 20cm Springform

  if (d1 <= 0 || d2 <= 0) {
    return {
      primary: { id: 'factor', label: 'Faktor', value: 0, formattedValue: '0' },
      error: 'Bitte gültige Backform-Durchmesser eingeben.',
    };
  }

  // Fläche Kreis = π * (d/2)²
  const areaFrom = Math.PI * Math.pow(d1 / 2, 2);
  const areaTo = Math.PI * Math.pow(d2 / 2, 2);
  const factor = areaTo / areaFrom;

  return {
    primary: {
      id: 'panFactor',
      label: 'Umrechnungsfaktor für alle Zutaten',
      value: factor,
      formattedValue: `${formatNumber(factor, 2)} ×`,
      highlight: true,
    },
    secondary: [
      { id: 'areaDiff', label: 'Flächenveränderung', value: (factor - 1) * 100, formattedValue: `${factor >= 1 ? '+' : ''}${formatNumber((factor - 1) * 100, 1)} %` },
      { id: 'areaOriginal', label: `Fläche Ursprungsform (${d1} cm)`, value: areaFrom, formattedValue: `${formatNumber(areaFrom, 1)} cm²` },
      { id: 'areaTarget', label: `Fläche Zielform (${d2} cm)`, value: areaTo, formattedValue: `${formatNumber(areaTo, 1)} cm²` },
    ],
    summaryText: `Beim Wechsel von einer ${d1}-cm-Springform auf eine ${d2}-cm-Springform müssen alle Rezeptzutaten mit dem Faktor ${formatNumber(factor, 2)} multipliziert werden (Fläche verringert/vergrößert sich um ${formatNumber(Math.abs((factor - 1) * 100), 1)} %).`,
  };
}

export function calculateGramsToMl(inputs: Record<string, any>): CalculationResult {
  const grams = parseFloat(inputs.grams) || 200;
  const ingredient = inputs.ingredient || 'flour';

  // Dichten in g/ml (g/cm³)
  const densities: Record<string, { name: string; density: number }> = {
    water: { name: 'Wasser / Milch / Essig', density: 1.0 },
    flour: { name: 'Weizenmehl (Type 405)', density: 0.53 }, // 100g Mehl ca. 188ml
    sugar: { name: 'Haushaltszucker (Kristall)', density: 0.85 },
    icingSugar: { name: 'Puderzucker', density: 0.55 },
    oil: { name: 'Speiseöl / Olivenöl / Rapsöl', density: 0.92 },
    butter: { name: 'Butter (geschmolzen)', density: 0.91 },
    honey: { name: 'Honig / Sirup', density: 1.42 },
    rice: { name: 'Reis (ungekocht)', density: 0.85 },
    oats: { name: 'Haferflocken', density: 0.45 },
  };

  const selected = densities[ingredient] || densities.water;
  const ml = grams / selected.density;

  return {
    primary: {
      id: 'volumeMl',
      label: `Volumen für ${selected.name}`,
      value: ml,
      formattedValue: `${formatNumber(ml, 1)} ml`,
      highlight: true,
    },
    secondary: [
      { id: 'tablespoons', label: 'Entspricht ca. Esslöffeln (15 ml)', value: ml / 15, formattedValue: `ca. ${formatNumber(ml / 15, 1)} EL` },
      { id: 'teaspoons', label: 'Entspricht ca. Teelöffeln (5 ml)', value: ml / 5, formattedValue: `ca. ${formatNumber(ml / 5, 1)} TL` },
      { id: 'densityUsed', label: 'Zugrunde gelegte Dichte', value: selected.density, formattedValue: `${selected.density} g/ml` },
    ],
    summaryText: `${formatNumber(grams, 0)} Gramm ${selected.name} entsprechen aufgrund der spezifischen Zutatendichte von ${selected.density} g/ml genau ${formatNumber(ml, 1)} Millilitern.`,
  };
}
