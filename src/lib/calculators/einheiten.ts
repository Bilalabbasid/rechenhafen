import { CalculationResult } from '@/types/calculator';
import { formatNumber } from '@/lib/formatters';

export function calculateLengthConversion(inputs: Record<string, any>): CalculationResult {
  const value = parseFloat(inputs.value) || 1;
  const fromUnit = inputs.fromUnit || 'm';
  const toUnit = inputs.toUnit || 'ft';

  // In Meter als Basis
  const toMeters: Record<string, number> = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    in: 0.0254,      // Zoll
    ft: 0.3048,      // Fuß
    yd: 0.9144,      // Yard
    mi: 1609.344,    // Meile
    nm: 1852,        // Seemeile
  };

  const meters = value * (toMeters[fromUnit] || 1);
  const result = meters / (toMeters[toUnit] || 1);

  const unitLabels: Record<string, string> = {
    mm: 'Millimeter (mm)',
    cm: 'Zentimeter (cm)',
    m: 'Meter (m)',
    km: 'Kilometer (km)',
    in: 'Zoll / Inch (in)',
    ft: 'Fuß (ft)',
    yd: 'Yard (yd)',
    mi: 'Meilen (mi)',
    nm: 'Seemeilen (NM)',
  };

  return {
    primary: {
      id: 'result',
      label: `Ergebnis in ${unitLabels[toUnit] || toUnit}`,
      value: result,
      formattedValue: `${formatNumber(result, 4)} ${toUnit}`,
      highlight: true,
    },
    secondary: [
      { id: 'inMeters', label: 'Basiseinheit in Metern', value: meters, formattedValue: `${formatNumber(meters, 4)} m` },
      { id: 'inCm', label: 'In Zentimetern', value: meters * 100, formattedValue: `${formatNumber(meters * 100, 2)} cm` },
      { id: 'inKm', label: 'In Kilometern', value: meters / 1000, formattedValue: `${formatNumber(meters / 1000, 6)} km` },
      { id: 'inFt', label: 'In Fuß (ft)', value: meters / 0.3048, formattedValue: `${formatNumber(meters / 0.3048, 4)} ft` },
    ],
    summaryText: `${formatNumber(value, 4)} ${unitLabels[fromUnit] || fromUnit} entsprechen genau ${formatNumber(result, 4)} ${unitLabels[toUnit] || toUnit}.`,
  };
}

export function calculateTemperatureConversion(inputs: Record<string, any>): CalculationResult {
  const val = parseFloat(inputs.value) || 20;
  const from = inputs.fromUnit || 'C'; // 'C', 'F', 'K'
  const to = inputs.toUnit || 'F';

  // Nach Celsius
  let celsius = val;
  if (from === 'F') {
    celsius = (val - 32) * (5 / 9);
  } else if (from === 'K') {
    celsius = val - 273.15;
  }

  // Von Celsius zur Zieleinheit
  let result = celsius;
  if (to === 'F') {
    result = celsius * (9 / 5) + 32;
  } else if (to === 'K') {
    result = celsius + 273.15;
  }

  const fahrenheit = celsius * (9 / 5) + 32;
  const kelvin = celsius + 273.15;

  return {
    primary: {
      id: 'temp',
      label: `Temperatur in °${to}`,
      value: result,
      formattedValue: `${formatNumber(result, 2)} °${to}`,
      highlight: true,
    },
    secondary: [
      { id: 'celsius', label: 'In Grad Celsius', value: celsius, formattedValue: `${formatNumber(celsius, 2)} °C` },
      { id: 'fahrenheit', label: 'In Grad Fahrenheit', value: fahrenheit, formattedValue: `${formatNumber(fahrenheit, 2)} °F` },
      { id: 'kelvin', label: 'In Kelvin (SI-Basiseinheit)', value: kelvin, formattedValue: `${formatNumber(kelvin, 2)} K` },
      { id: 'waterState', label: 'Aggregatzustand von Wasser bei 1 atm', value: celsius <= 0 ? 'Gefroren (Eis)' : celsius >= 100 ? 'Gasförmig (Dampf)' : 'Flüssig', formattedValue: celsius <= 0 ? 'Gefroren (Eis)' : celsius >= 100 ? 'Gasförmig (Dampf)' : 'Flüssig' },
    ],
    summaryText: `${formatNumber(val, 1)} °${from} entsprechen ${formatNumber(result, 2)} °${to} (${formatNumber(celsius, 1)} °C / ${formatNumber(fahrenheit, 1)} °F / ${formatNumber(kelvin, 2)} K).`,
  };
}
