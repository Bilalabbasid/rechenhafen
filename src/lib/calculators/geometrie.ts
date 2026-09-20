import { CalculationResult } from '@/types/calculator';
import { formatNumber } from '@/lib/formatters';

export function calculateCircle(inputs: Record<string, any>): CalculationResult {
  const radius = parseFloat(inputs.radius) || (parseFloat(inputs.diameter) ? parseFloat(inputs.diameter) / 2 : 5);

  if (radius <= 0) {
    return {
      primary: { id: 'area', label: 'Kreisfläche', value: 0, formattedValue: '0' },
      error: 'Der Radius muss größer als 0 sein.',
    };
  }

  const area = Math.PI * radius * radius;
  const circumference = 2 * Math.PI * radius;
  const diameter = 2 * radius;

  return {
    primary: {
      id: 'area',
      label: 'Flächeninhalt (A)',
      value: area,
      formattedValue: `${formatNumber(area, 2)} cm²`,
      highlight: true,
    },
    secondary: [
      { id: 'circumference', label: 'Umfang (U)', value: circumference, formattedValue: `${formatNumber(circumference, 2)} cm` },
      { id: 'diameter', label: 'Durchmesser (d)', value: diameter, formattedValue: `${formatNumber(diameter, 2)} cm` },
      { id: 'radius', label: 'Radius (r)', value: radius, formattedValue: `${formatNumber(radius, 2)} cm` },
      { id: 'formulaArea', label: 'Flächenformel', value: 'A = π · r²', formattedValue: 'π · r²' },
      { id: 'formulaCircum', label: 'Umfangsformel', value: 'U = 2 · π · r', formattedValue: '2 · π · r' },
    ],
    summaryText: `Ein Kreis mit Radius r = ${formatNumber(radius, 2)} cm hat einen Flächeninhalt von ${formatNumber(area, 2)} cm² und einen Umfang von ${formatNumber(circumference, 2)} cm.`,
  };
}

export function calculateCylinder(inputs: Record<string, any>): CalculationResult {
  const radius = parseFloat(inputs.radius) || 4;
  const height = parseFloat(inputs.height) || 10;

  if (radius <= 0 || height <= 0) {
    return {
      primary: { id: 'volume', label: 'Zylindervolumen', value: 0, formattedValue: '0' },
      error: 'Radius und Höhe müssen größer als null sein.',
    };
  }

  const baseArea = Math.PI * radius * radius;
  const volume = baseArea * height;
  const lateralArea = 2 * Math.PI * radius * height; // Mantelfläche
  const surfaceArea = 2 * baseArea + lateralArea; // Gesamtoberfläche

  return {
    primary: {
      id: 'volume',
      label: 'Volumen (V)',
      value: volume,
      formattedValue: `${formatNumber(volume, 2)} cm³ (${formatNumber(volume / 1000, 3)} Liter)`,
      highlight: true,
    },
    secondary: [
      { id: 'surface', label: 'Gesamte Oberfläche (O)', value: surfaceArea, formattedValue: `${formatNumber(surfaceArea, 2)} cm²` },
      { id: 'lateral', label: 'Mantelfläche (M)', value: lateralArea, formattedValue: `${formatNumber(lateralArea, 2)} cm²` },
      { id: 'baseArea', label: 'Grundfläche (G)', value: baseArea, formattedValue: `${formatNumber(baseArea, 2)} cm²` },
    ],
    summaryText: `Der Zylinder mit Radius r = ${formatNumber(radius, 2)} cm und Höhe h = ${formatNumber(height, 2)} cm fasst ein Volumen von ${formatNumber(volume, 2)} cm³ (${formatNumber(volume / 1000, 3)} Liter) bei einer Gesamtoberfläche von ${formatNumber(surfaceArea, 2)} cm².`,
  };
}

export function calculateRectangle(inputs: Record<string, any>): CalculationResult {
  const a = parseFloat(inputs.lengthA) || 8;
  const b = parseFloat(inputs.widthB) || 5;

  if (a <= 0 || b <= 0) {
    return {
      primary: { id: 'area', label: 'Fläche', value: 0, formattedValue: '0' },
      error: 'Seitenlängen müssen positiv sein.',
    };
  }

  const area = a * b;
  const perimeter = 2 * (a + b);
  const diagonal = Math.sqrt(a * a + b * b);

  return {
    primary: {
      id: 'area',
      label: 'Flächeninhalt (A)',
      value: area,
      formattedValue: `${formatNumber(area, 2)} m²`,
      highlight: true,
    },
    secondary: [
      { id: 'perimeter', label: 'Umfang (U)', value: perimeter, formattedValue: `${formatNumber(perimeter, 2)} m` },
      { id: 'diagonal', label: 'Diagonale (d)', value: diagonal, formattedValue: `${formatNumber(diagonal, 2)} m` },
      { id: 'ratio', label: 'Seitenverhältnis (a : b)', value: a / b, formattedValue: `${formatNumber(a / b, 2)} : 1` },
    ],
    summaryText: `Ein Rechteck mit den Seiten a = ${formatNumber(a, 2)} m und b = ${formatNumber(b, 2)} m hat eine Fläche von ${formatNumber(area, 2)} m² und einen Umfang von ${formatNumber(perimeter, 2)} m.`,
  };
}
