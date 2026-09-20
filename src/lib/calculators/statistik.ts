import { CalculationResult } from '@/types/calculator';
import { formatNumber } from '@/lib/formatters';

export function calculateGradeAverage(inputs: Record<string, any>): CalculationResult {
  const gradesInput = String(inputs.grades || '2; 1; 3; 2; 1.5; 2.7');
  const grades = gradesInput
    .split(/[;, \n]+/)
    .map((s) => s.trim().replace(',', '.'))
    .filter((s) => s.length > 0)
    .map(Number)
    .filter((n) => Number.isFinite(n) && n >= 0.7 && n <= 6.0);

  if (grades.length === 0) {
    return {
      primary: { id: 'avg', label: 'Notenschnitt', value: 0, formattedValue: '-' },
      error: 'Bitte mindestens eine gültige Schulnote zwischen 1,0 und 6,0 eingeben.',
    };
  }

  const sum = grades.reduce((acc, g) => acc + g, 0);
  const avg = sum / grades.length;
  const best = Math.min(...grades);
  const worst = Math.max(...grades);

  return {
    primary: {
      id: 'averageGrade',
      label: 'Notendurchschnitt',
      value: avg,
      formattedValue: formatNumber(avg, 2),
      highlight: true,
    },
    secondary: [
      { id: 'count', label: 'Anzahl eingetragener Noten', value: grades.length, formattedValue: `${grades.length} Noten` },
      { id: 'best', label: 'Beste Note', value: best, formattedValue: formatNumber(best, 1) },
      { id: 'worst', label: 'Schlechteste Note', value: worst, formattedValue: formatNumber(worst, 1) },
      { id: 'sum', label: 'Notensumme', value: sum, formattedValue: formatNumber(sum, 2) },
    ],
    summaryText: `Aus ${grades.length} eingetragenen Noten ergibt sich ein Notenschnitt von ${formatNumber(avg, 2)}.`,
  };
}

export function calculateStandardDeviation(inputs: Record<string, any>): CalculationResult {
  const rawInput = String(inputs.values || '12; 15; 18; 11; 19; 14; 16');
  const vals = rawInput
    .split(/[;, \n]+/)
    .map((s) => s.trim().replace(',', '.'))
    .filter((s) => s.length > 0)
    .map(Number)
    .filter((n) => Number.isFinite(n));

  if (vals.length < 2) {
    return {
      primary: { id: 'sd', label: 'Standardabweichung', value: 0, formattedValue: '0' },
      error: 'Zur Berechnung der Stichproben-Standardabweichung werden mindestens zwei Zahlenwerte benötigt.',
    };
  }

  const n = vals.length;
  const mean = vals.reduce((a, b) => a + b, 0) / n;
  // Empirische Stichprobenvarianz (Bessel-Korrektur n-1)
  const sumSquaredDiffs = vals.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  const sampleVariance = sumSquaredDiffs / (n - 1);
  const sampleSd = Math.sqrt(sampleVariance);

  // Populations-Standardabweichung (Teilung durch n)
  const populationVariance = sumSquaredDiffs / n;
  const populationSd = Math.sqrt(populationVariance);

  return {
    primary: {
      id: 'sampleSd',
      label: 'Stichproben-Standardabweichung (s)',
      value: sampleSd,
      formattedValue: formatNumber(sampleSd, 4),
      highlight: true,
    },
    secondary: [
      { id: 'mean', label: 'Arithmetischer Mittelwert (x̄)', value: mean, formattedValue: formatNumber(mean, 4) },
      { id: 'sampleVar', label: 'Stichproben-Varianz (s²)', value: sampleVariance, formattedValue: formatNumber(sampleVariance, 4) },
      { id: 'popSd', label: 'Populations-Standardabweichung (σ)', value: populationSd, formattedValue: formatNumber(populationSd, 4) },
      { id: 'count', label: 'Stichprobenumfang (n)', value: n, formattedValue: `${n} Werte` },
    ],
    summaryText: `Für die ${n} Werte beträgt der Mittelwert ${formatNumber(mean, 2)}, die Standardabweichung der Stichprobe s = ${formatNumber(sampleSd, 4)} und die Varianz s² = ${formatNumber(sampleVariance, 4)}.`,
  };
}

export function calculateOhmsLaw(inputs: Record<string, any>): CalculationResult {
  const target = inputs.target || 'voltage'; // 'voltage' (U), 'current' (I), 'resistance' (R), 'power' (P)
  const u = parseFloat(inputs.voltage) || 230; // Volt
  const i = parseFloat(inputs.current) || 10;  // Ampere
  const r = parseFloat(inputs.resistance) || 23; // Ohm

  let voltage = u;
  let current = i;
  let resistance = r;

  if (target === 'voltage') {
    voltage = current * resistance;
  } else if (target === 'current') {
    current = resistance > 0 ? voltage / resistance : 0;
  } else if (target === 'resistance') {
    resistance = current > 0 ? voltage / current : 0;
  }

  const powerWatts = voltage * current; // P = U * I

  return {
    primary: {
      id: 'primaryResult',
      label: target === 'voltage' ? 'Elektrische Spannung (U)' : (target === 'current' ? 'Stromstärke (I)' : 'Elektrischer Widerstand (R)'),
      value: target === 'voltage' ? voltage : (target === 'current' ? current : resistance),
      formattedValue: target === 'voltage' ? `${formatNumber(voltage, 2)} V` : (target === 'current' ? `${formatNumber(current, 3)} A` : `${formatNumber(resistance, 2)} Ω`),
      highlight: true,
    },
    secondary: [
      { id: 'power', label: 'Elektrische Leistung (P = U · I)', value: powerWatts, formattedValue: `${formatNumber(powerWatts, 2)} W (${formatNumber(powerWatts / 1000, 3)} kW)` },
      { id: 'v', label: 'Spannung (U)', value: voltage, formattedValue: `${formatNumber(voltage, 2)} Volt` },
      { id: 'c', label: 'Stromstärke (I)', value: current, formattedValue: `${formatNumber(current, 3)} Ampere` },
      { id: 'r', label: 'Widerstand (R)', value: resistance, formattedValue: `${formatNumber(resistance, 2)} Ohm` },
    ],
    summaryText: `Nach dem Ohmschen Gesetz (U = R · I) beträgt die elektrische Leistung ${formatNumber(powerWatts, 2)} Watt bei ${formatNumber(voltage, 2)} V und ${formatNumber(current, 3)} A.`,
  };
}
