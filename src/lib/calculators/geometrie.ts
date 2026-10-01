import { CalculationResult } from '@/types/calculator';
import { formatNumber } from '@/lib/formatters';

export function calculateCircle(inputs: Record<string, any>): CalculationResult {
  if (inputs.radius === undefined || inputs.radius === null || String(inputs.radius).trim() === '') {
    return {
      primary: { id: 'area', label: 'Flächeninhalt (A)', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie den Kreisradius ein.',
    };
  }
  const radius = parseFloat(inputs.radius);
  if (isNaN(radius) || radius <= 0) {
    return {
      primary: { id: 'area', label: 'Flächeninhalt (A)', value: 0, formattedValue: '-' },
      error: 'Der Kreisradius muss größer als 0 cm sein.',
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
  if (inputs.radius === undefined || inputs.radius === null || String(inputs.radius).trim() === '') {
    return {
      primary: { id: 'volume', label: 'Volumen (V)', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie den Radius der Grundfläche ein.',
    };
  }
  const radius = parseFloat(inputs.radius);
  if (isNaN(radius) || radius <= 0) {
    return {
      primary: { id: 'volume', label: 'Volumen (V)', value: 0, formattedValue: '-' },
      error: 'Der Radius muss größer als 0 cm sein.',
    };
  }

  if (inputs.height === undefined || inputs.height === null || String(inputs.height).trim() === '') {
    return {
      primary: { id: 'volume', label: 'Volumen (V)', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die Höhe des Zylinders ein.',
    };
  }
  const height = parseFloat(inputs.height);
  if (isNaN(height) || height <= 0) {
    return {
      primary: { id: 'volume', label: 'Volumen (V)', value: 0, formattedValue: '-' },
      error: 'Die Höhe muss größer als 0 cm sein.',
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
  if (inputs.lengthA === undefined || inputs.lengthA === null || String(inputs.lengthA).trim() === '') {
    return {
      primary: { id: 'area', label: 'Flächeninhalt (A)', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die Länge (Seite a) ein.',
    };
  }
  const a = parseFloat(inputs.lengthA);
  if (isNaN(a) || a <= 0) {
    return {
      primary: { id: 'area', label: 'Flächeninhalt (A)', value: 0, formattedValue: '-' },
      error: 'Die Länge (Seite a) muss größer als 0 m sein.',
    };
  }

  if (inputs.widthB === undefined || inputs.widthB === null || String(inputs.widthB).trim() === '') {
    return {
      primary: { id: 'area', label: 'Flächeninhalt (A)', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die Breite (Seite b) ein.',
    };
  }
  const b = parseFloat(inputs.widthB);
  if (isNaN(b) || b <= 0) {
    return {
      primary: { id: 'area', label: 'Flächeninhalt (A)', value: 0, formattedValue: '-' },
      error: 'Die Breite (Seite b) muss größer als 0 m sein.',
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
