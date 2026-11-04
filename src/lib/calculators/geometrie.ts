import { CalculationResult } from '@/types/calculator';
import { formatNumber } from '@/lib/formatters';

const CIRCLE_UNITS = ['mm', 'cm', 'dm', 'm', 'km'];

type CircleQuantity = 'radius' | 'diameter' | 'circumference' | 'area';

const CIRCLE_NAMES: Record<CircleQuantity, { label: string; name: string; nominative: string }> = {
  radius: { label: 'Radius r', name: 'den Radius', nominative: 'Der Radius' },
  diameter: { label: 'Durchmesser d', name: 'den Durchmesser', nominative: 'Der Durchmesser' },
  circumference: { label: 'Umfang U', name: 'den Umfang', nominative: 'Der Umfang' },
  area: { label: 'Flächeninhalt A', name: 'die Fläche', nominative: 'Die Fläche' },
};

/** Welcher Wert als Hauptergebnis erscheint – jeweils die typische Frage zum gegebenen Startwert. */
const CIRCLE_PRIMARY: Record<CircleQuantity, CircleQuantity> = {
  radius: 'area',
  diameter: 'circumference',
  circumference: 'diameter',
  area: 'radius',
};

function readCircleNumber(raw: unknown): number {
  if (typeof raw === 'number') return raw;
  let s = String(raw ?? '').trim().replace(/\s/g, '');
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  if (!/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(s)) return NaN;
  return Number(s);
}

function fmtCircle(x: number): string {
  return formatNumber(x, Math.abs(x) < 1 ? 4 : 2);
}

/**
 * Kreis aus einer beliebigen Startgröße: givenType = radius | diameter | circumference | area,
 * givenValue = Zahlenwert, unit = mm | cm | dm | m | km (optional, Standard cm).
 */
function calculateCircleFromAnyValue(inputs: Record<string, any>): CalculationResult {
  const givenType: CircleQuantity = (['radius', 'diameter', 'circumference', 'area'] as const).includes(inputs.givenType)
    ? inputs.givenType
    : 'radius';
  const unit: string = CIRCLE_UNITS.includes(inputs.unit) ? inputs.unit : 'cm';
  const u2 = `${unit}²`;
  const primaryId = CIRCLE_PRIMARY[givenType];
  const fail = (message: string): CalculationResult => ({
    primary: { id: primaryId, label: CIRCLE_NAMES[primaryId].label, value: 0, formattedValue: '–' },
    error: message,
  });

  const raw = inputs.givenValue;
  if (raw === undefined || raw === null || String(raw).trim() === '') {
    return fail(`Bitte geben Sie ${CIRCLE_NAMES[givenType].name} ein.`);
  }
  const value = readCircleNumber(raw);
  if (!Number.isFinite(value)) return fail('Bitte geben Sie eine gültige Zahl ein.');
  if (value <= 0) return fail(`${CIRCLE_NAMES[givenType].nominative} muss größer als 0 sein.`);

  let r: number;
  const steps: string[] = [];
  if (givenType === 'diameter') {
    r = value / 2;
    steps.push(`Radius: r = d / 2 = ${fmtCircle(value)} / 2 = ${fmtCircle(r)} ${unit}`);
  } else if (givenType === 'circumference') {
    r = value / (2 * Math.PI);
    steps.push(
      `Durchmesser: d = U / π = ${fmtCircle(value)} / ${formatNumber(Math.PI, 5)} = ${fmtCircle(2 * r)} ${unit}`,
      `Radius: r = d / 2 = ${fmtCircle(r)} ${unit}`,
    );
  } else if (givenType === 'area') {
    r = Math.sqrt(value / Math.PI);
    steps.push(`Radius: r = √(A / π) = √(${fmtCircle(value)} / ${formatNumber(Math.PI, 5)}) = √${fmtCircle(value / Math.PI)} = ${fmtCircle(r)} ${unit}`);
  } else {
    r = value;
  }

  const d = 2 * r;
  const circumference = givenType === 'circumference' ? value : 2 * Math.PI * r;
  const area = givenType === 'area' ? value : Math.PI * r * r;
  if (![r, d, circumference, area].every(Number.isFinite) || !(r > 0) || !(area > 0)) {
    return fail('Der Wert ist zu groß oder zu klein für eine sinnvolle Berechnung. Bitte wählen Sie eine passendere Einheit.');
  }

  if (givenType === 'radius') steps.push(`Durchmesser: d = 2 · r = 2 · ${fmtCircle(r)} = ${fmtCircle(d)} ${unit}`);
  if (givenType !== 'circumference') {
    steps.push(`Umfang: U = 2 · π · r = π · d = ${formatNumber(Math.PI, 5)} · ${fmtCircle(d)} = ${fmtCircle(circumference)} ${unit}`);
  }
  if (givenType !== 'area') {
    steps.push(`Fläche: A = π · r² = ${formatNumber(Math.PI, 5)} · ${fmtCircle(r)}² = ${formatNumber(Math.PI, 5)} · ${fmtCircle(r * r)} = ${fmtCircle(area)} ${u2}`);
  }

  const items: Record<CircleQuantity, { id: string; label: string; value: number; formattedValue: string }> = {
    radius: { id: 'radius', label: 'Radius (r)', value: r, formattedValue: `${fmtCircle(r)} ${unit}` },
    diameter: { id: 'diameter', label: 'Durchmesser (d)', value: d, formattedValue: `${fmtCircle(d)} ${unit}` },
    circumference: { id: 'circumference', label: 'Kreisumfang (U)', value: circumference, formattedValue: `${fmtCircle(circumference)} ${unit}` },
    area: { id: 'area', label: 'Flächeninhalt (A)', value: area, formattedValue: `${fmtCircle(area)} ${u2}` },
  };
  const order: CircleQuantity[] = ['circumference', 'area', 'diameter', 'radius'];

  return {
    primary: { ...items[primaryId], highlight: true },
    secondary: [
      ...order.filter((k) => k !== primaryId).map((k) => items[k]),
      { id: 'formulaCircum', label: 'Umfangsformel', value: 'U = 2 · π · r = π · d', formattedValue: 'U = 2 · π · r = π · d' },
      { id: 'formulaArea', label: 'Flächenformel', value: 'A = π · r²', formattedValue: 'A = π · r²' },
    ],
    calculationSteps: steps,
    summaryText: `Ein Kreis mit dem Radius ${fmtCircle(r)} ${unit} (Durchmesser ${fmtCircle(d)} ${unit}) hat den Umfang ${fmtCircle(circumference)} ${unit} und den Flächeninhalt ${fmtCircle(area)} ${u2}.`,
  };
}

/**
 * Kreisrechner. Mit `givenType`/`givenValue` (und optional `unit`) lässt sich von Radius, Durchmesser,
 * Umfang oder Fläche ausgehen; ohne diese Eingaben gilt das bisherige Verhalten (nur `radius` in cm).
 */
export function calculateCircle(inputs: Record<string, any>): CalculationResult {
  if (inputs.givenType !== undefined || inputs.givenValue !== undefined) {
    return calculateCircleFromAnyValue(inputs);
  }
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
