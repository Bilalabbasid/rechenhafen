import { CalculationResult } from '@/types/calculator';
import { formatNumber } from '@/lib/formatters';

/**
 * Parst Zahleneingaben sicher und unterstützt deutsches Dezimalkomma.
 * Gibt null zurück bei leerem String oder ungültigem Text (kein stiller Fallback auf 1).
 */
export function parseUnitNumber(val: any): number | null {
  if (val === undefined || val === null) return null;
  const str = String(val).trim();
  if (str === '') return null;
  let cleanStr = str;
  if (str.includes('.') && str.includes(',')) {
    cleanStr = str.replace(/\./g, '').replace(',', '.');
  } else if (str.includes(',')) {
    cleanStr = str.replace(',', '.');
  }
  const num = parseFloat(cleanStr);
  if (isNaN(num) || !isFinite(num)) return null;
  return num;
}

/**
 * Adaptive deutsche Zahlenformatierung für Einheitenumrechnungen:
 * - Ganze Zahlen ohne Nachkommastellen
 * - Keine überflüssigen Nullen am Ende
 * - Ausreichend Präzision für kleine/große Werte bis maxDecimals
 */
export function formatAdaptiveUnit(val: number, maxDecimals: number = 6): string {
  if (val === 0) return '0';
  if (!isFinite(val) || isNaN(val)) return '-';

  if (Number.isInteger(val)) {
    return formatNumber(val, 0, 0);
  }

  const fixed = val.toFixed(maxDecimals);
  const parts = fixed.split('.');
  const trimmedDec = parts[1] ? parts[1].replace(/0+$/, '') : '';
  const numDecimals = trimmedDec.length;

  return formatNumber(val, numDecimals, numDecimals);
}

/**
 * Formatiert Sekunden in eine lesbare deutsche Zeitspanne
 * (z. B. 90.061 s -> "1 Tag, 1 Stunde, 1 Minute und 1 Sekunde").
 * Normalisiert Überträge sauber.
 */
export function formatHumanReadableDuration(totalSeconds: number): string {
  if (totalSeconds === 0) return '0 Sekunden';
  if (!isFinite(totalSeconds) || isNaN(totalSeconds)) return '-';

  const isNeg = totalSeconds < 0;
  let sec = Math.abs(Math.round(totalSeconds));

  const days = Math.floor(sec / 86400);
  sec %= 86400;
  const hours = Math.floor(sec / 3600);
  sec %= 3600;
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${formatNumber(days, 0, 0)} ${days === 1 ? 'Tag' : 'Tage'}`);
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'Stunde' : 'Stunden'}`);
  if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'Minute' : 'Minuten'}`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds} ${seconds === 1 ? 'Sekunde' : 'Sekunden'}`);

  let res = '';
  if (parts.length === 1) {
    res = parts[0];
  } else if (parts.length === 2) {
    res = `${parts[0]} und ${parts[1]}`;
  } else {
    const last = parts.pop();
    res = `${parts.join(', ')} und ${last}`;
  }

  return isNeg ? `minus ${res}` : res;
}

// =========================================================================
// 1. GENERISCHER LÄNGENUMRECHNER (/rechner/laengen-umrechner/)
// =========================================================================
export function calculateLengthConversion(inputs: Record<string, any>): CalculationResult {
  const val = parseUnitNumber(inputs.value);
  if (val === null) {
    return {
      primary: { id: 'result', label: 'Ergebnis', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie einen gültigen Längenwert ein.',
    };
  }

  const fromUnit = inputs.fromUnit || 'in';
  const toUnit = inputs.toUnit || 'cm';

  // Exakte NIST-Faktoren mit Meter (m) als mathematischer Basis
  const toMeters: Record<string, number> = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    in: 0.0254,      // 1 Zoll / Inch = exakt 0,0254 m = 2,54 cm (NIST)
    ft: 0.3048,      // 1 international foot = exakt 0,3048 m (NIST)
    yd: 0.9144,      // 1 yard = exakt 0,9144 m (NIST)
    mi: 1609.344,    // 1 international mile = exakt 1.609,344 m (NIST)
    nm: 1852,        // 1 Seemeile = exakt 1.852 m (völkerrechtlich fixiert)
  };

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

  const unitSymbols: Record<string, string> = {
    mm: 'mm',
    cm: 'cm',
    m: 'm',
    km: 'km',
    in: 'in',
    ft: 'ft',
    yd: 'yd',
    mi: 'mi',
    nm: 'NM',
  };

  const fromFactor = toMeters[fromUnit] ?? 1;
  const toFactor = toMeters[toUnit] ?? 1;

  // Unverfälschte interne Präzision
  const meters = val * fromFactor;
  const result = meters / toFactor;

  // Alle relevanten Einheiten auf einen Blick
  const secondaryList = [
    // Rückwärtskompatible IDs für bestehende Batch-Tests
    { id: 'inMeters', label: 'In Metern (m)', value: meters, formattedValue: `${formatAdaptiveUnit(meters, 6)} m` },
    { id: 'inCm', label: 'In Zentimetern (cm)', value: meters * 100, formattedValue: `${formatAdaptiveUnit(meters * 100, 4)} cm` },
    { id: 'inKm', label: 'In Kilometern (km)', value: meters / 1000, formattedValue: `${formatAdaptiveUnit(meters / 1000, 6)} km` },
    { id: 'inFt', label: 'In Fuß (ft)', value: meters / 0.3048, formattedValue: `${formatAdaptiveUnit(meters / 0.3048, 4)} ft` },
    // Weitere Einheiten
    { id: 'in_mm', label: 'In Millimetern (mm)', value: meters * 1000, formattedValue: `${formatAdaptiveUnit(meters * 1000, 2)} mm` },
    { id: 'in_in', label: 'In Zoll / Inch (in)', value: meters / 0.0254, formattedValue: `${formatAdaptiveUnit(meters / 0.0254, 4)} in` },
    { id: 'in_yd', label: 'In Yard (yd)', value: meters / 0.9144, formattedValue: `${formatAdaptiveUnit(meters / 0.9144, 4)} yd` },
    { id: 'in_mi', label: 'In Meilen (mi)', value: meters / 1609.344, formattedValue: `${formatAdaptiveUnit(meters / 1609.344, 6)} mi` },
    { id: 'in_nm', label: 'In Seemeilen (NM)', value: meters / 1852, formattedValue: `${formatAdaptiveUnit(meters / 1852, 6)} NM` },
  ];

  return {
    primary: {
      id: 'result',
      label: `Ergebnis in ${unitLabels[toUnit] || toUnit}`,
      value: result,
      formattedValue: `${formatAdaptiveUnit(result, 6)} ${unitSymbols[toUnit] || toUnit}`,
      highlight: true,
    },
    secondary: secondaryList,
    summaryText: `${formatAdaptiveUnit(val, 4)} ${unitLabels[fromUnit] || fromUnit} entsprechen genau ${formatAdaptiveUnit(result, 6)} ${unitLabels[toUnit] || toUnit}.`,
  };
}

// =========================================================================
// 2. ZOLL ↔ CM RECHNER (/rechner/zoll-in-cm-rechner/)
// =========================================================================
export function calculateZollCmConversion(inputs: Record<string, any>): CalculationResult {
  const isCmInput = inputs.lastEdited === 'cm';

  let inchVal: number | null = null;
  let cmVal: number | null = null;

  if (isCmInput) {
    cmVal = parseUnitNumber(inputs.cm !== undefined ? inputs.cm : inputs.value);
    if (cmVal === null) {
      return {
        primary: { id: 'inches', label: 'Länge in Zoll', value: 0, formattedValue: '-' },
        error: 'Bitte geben Sie einen gültigen Wert in Zentimetern ein.',
      };
    }
    inchVal = cmVal / 2.54;
  } else {
    inchVal = parseUnitNumber(inputs.inches !== undefined ? inputs.inches : inputs.value);
    if (inchVal === null) {
      return {
        primary: { id: 'cm', label: 'Länge in Zentimetern', value: 0, formattedValue: '-' },
        error: 'Bitte geben Sie einen gültigen Wert in Zoll ein.',
      };
    }
    cmVal = inchVal * 2.54;
  }

  const mmVal = cmVal * 10;
  const mVal = cmVal / 100;

  // 16:9 Display Berechnung (Diagonale d = cmVal):
  // d = sqrt(16² + 9²) * x = sqrt(337) * x ≈ 18.35756 * x
  const x = cmVal / Math.sqrt(337);
  const width16_9 = 16 * x;
  const height16_9 = 9 * x;
  const displayAreaCm2 = width16_9 * height16_9;
  const displayAreaM2 = displayAreaCm2 / 10000;

  if (isCmInput) {
    return {
      primary: {
        id: 'inches',
        label: 'Länge in Zoll / Inch',
        value: inchVal,
        formattedValue: `${formatAdaptiveUnit(inchVal, 4)} in (Zoll)`,
        highlight: true,
      },
      secondary: [
        { id: 'cm', label: 'Zentimeter (cm)', value: cmVal, formattedValue: `${formatAdaptiveUnit(cmVal, 4)} cm` },
        { id: 'width16_9', label: 'Bildschirmbreite bei 16:9', value: width16_9, formattedValue: `${formatAdaptiveUnit(width16_9, 1)} cm` },
        { id: 'height16_9', label: 'Bildschirmhöhe bei 16:9', value: height16_9, formattedValue: `${formatAdaptiveUnit(height16_9, 1)} cm` },
        { id: 'area', label: 'Displayfläche ca.', value: displayAreaM2, formattedValue: `${formatAdaptiveUnit(displayAreaM2, 2)} m² (${formatNumber(displayAreaCm2, 0, 0)} cm²)` },
        { id: 'mm', label: 'Millimeter (mm)', value: mmVal, formattedValue: `${formatAdaptiveUnit(mmVal, 1)} mm` },
        { id: 'm', label: 'Meter (m)', value: mVal, formattedValue: `${formatAdaptiveUnit(mVal, 4)} m` },
      ],
      summaryText: `${formatAdaptiveUnit(cmVal, 2)} cm entsprechen exakt ${formatAdaptiveUnit(inchVal, 4)} Zoll (Inch). Ein ${formatAdaptiveUnit(inchVal, 1)}"-Display (16:9) ist ca. ${formatAdaptiveUnit(width16_9, 1)} cm breit und ${formatAdaptiveUnit(height16_9, 1)} cm hoch (ohne Gehäuserahmen).`,
    };
  }

  return {
    primary: {
      id: 'cm',
      label: 'Länge in Zentimetern (cm)',
      value: cmVal,
      formattedValue: `${formatAdaptiveUnit(cmVal, 4)} cm`,
      highlight: true,
    },
    secondary: [
      { id: 'inches', label: 'Zoll / Inch (in)', value: inchVal, formattedValue: `${formatAdaptiveUnit(inchVal, 4)} in (Zoll)` },
      { id: 'width16_9', label: 'Bildschirmbreite bei 16:9', value: width16_9, formattedValue: `${formatAdaptiveUnit(width16_9, 1)} cm` },
      { id: 'height16_9', label: 'Bildschirmhöhe bei 16:9', value: height16_9, formattedValue: `${formatAdaptiveUnit(height16_9, 1)} cm` },
      { id: 'area', label: 'Displayfläche ca.', value: displayAreaM2, formattedValue: `${formatAdaptiveUnit(displayAreaM2, 2)} m² (${formatNumber(displayAreaCm2, 0, 0)} cm²)` },
      { id: 'mm', label: 'Millimeter (mm)', value: mmVal, formattedValue: `${formatAdaptiveUnit(mmVal, 1)} mm` },
      { id: 'm', label: 'Meter (m)', value: mVal, formattedValue: `${formatAdaptiveUnit(mVal, 4)} m` },
    ],
    summaryText: `${formatAdaptiveUnit(inchVal, 2)} Zoll entsprechen exakt ${formatAdaptiveUnit(cmVal, 2)} cm. Ein ${formatAdaptiveUnit(inchVal, 0)}"-Fernseher (16:9) ist ca. ${formatAdaptiveUnit(width16_9, 0)} cm breit und ${formatAdaptiveUnit(height16_9, 0)} cm hoch (ohne Gehäuserahmen).`,
  };
}

// =========================================================================
// 3. MEILEN ↔ KILOMETER RECHNER (/rechner/meilen-km-umrechner/)
// =========================================================================
export function calculateMilesKmConversion(inputs: Record<string, any>): CalculationResult {
  const isKmInput = inputs.lastEdited === 'km';

  let milesVal: number | null = null;
  let kmVal: number | null = null;

  if (isKmInput) {
    kmVal = parseUnitNumber(inputs.km !== undefined ? inputs.km : inputs.value);
    if (kmVal === null) {
      return {
        primary: { id: 'miles', label: 'Entfernung in Meilen', value: 0, formattedValue: '-' },
        error: 'Bitte geben Sie einen gültigen Wert in Kilometern ein.',
      };
    }
    // 1 international mile = exakt 1.609344 km
    milesVal = kmVal / 1.609344;
  } else {
    milesVal = parseUnitNumber(inputs.miles !== undefined ? inputs.miles : inputs.value);
    if (milesVal === null) {
      return {
        primary: { id: 'km', label: 'Entfernung in Kilometern', value: 0, formattedValue: '-' },
        error: 'Bitte geben Sie einen gültigen Wert in Meilen ein.',
      };
    }
    kmVal = milesVal * 1.609344;
  }

  const meters = kmVal * 1000;
  const feet = meters / 0.3048;
  const nauticalMiles = meters / 1852;
  const marathonDistanceKm = 42.195;
  const marathonFraction = (kmVal / marathonDistanceKm) * 100;

  if (isKmInput) {
    return {
      primary: {
        id: 'miles',
        label: 'Entfernung in Meilen (mi)',
        value: milesVal,
        formattedValue: `${formatAdaptiveUnit(milesVal, 6)} mi`,
        highlight: true,
      },
      secondary: [
        { id: 'km', label: 'Kilometer (km)', value: kmVal, formattedValue: `${formatAdaptiveUnit(kmVal, 4)} km` },
        { id: 'meters', label: 'Meter (m)', value: meters, formattedValue: `${formatNumber(meters, 2, 0)} m` },
        { id: 'feet', label: 'Fuß (ft)', value: feet, formattedValue: `${formatNumber(feet, 2, 0)} ft` },
        { id: 'nauticalMiles', label: 'Seemeilen (NM)', value: nauticalMiles, formattedValue: `${formatAdaptiveUnit(nauticalMiles, 4)} NM` },
        { id: 'marathon', label: 'Marathon-Vergleich (42,195 km)', value: marathonFraction, formattedValue: `${formatNumber(marathonFraction, 2, 0)} % eines Marathons` },
      ],
      summaryText: `${formatAdaptiveUnit(kmVal, 4)} Kilometer entsprechen ca. ${formatAdaptiveUnit(milesVal, 6)} Landmeilen (1 Meile = exakt 1,609344 km).`,
    };
  }

  return {
    primary: {
      id: 'km',
      label: 'Entfernung in Kilometern (km)',
      value: kmVal,
      formattedValue: `${formatAdaptiveUnit(kmVal, 6)} km`,
      highlight: true,
    },
    secondary: [
      { id: 'miles', label: 'Meilen (mi)', value: milesVal, formattedValue: `${formatAdaptiveUnit(milesVal, 4)} mi` },
      { id: 'meters', label: 'Meter (m)', value: meters, formattedValue: `${formatNumber(meters, 2, 0)} m` },
      { id: 'feet', label: 'Fuß (ft)', value: feet, formattedValue: `${formatNumber(feet, 2, 0)} ft` },
      { id: 'nauticalMiles', label: 'Seemeilen (NM)', value: nauticalMiles, formattedValue: `${formatAdaptiveUnit(nauticalMiles, 4)} NM` },
      { id: 'marathon', label: 'Marathon-Vergleich (42,195 km)', value: marathonFraction, formattedValue: `${formatNumber(marathonFraction, 2, 0)} % eines Marathons` },
    ],
    summaryText: `${formatAdaptiveUnit(milesVal, 4)} Meilen entsprechen exakt ${formatAdaptiveUnit(kmVal, 6)} Kilometern (1 Meile = 1,609344 km).`,
  };
}

// =========================================================================
// 4. ZEIT-UMRECHNER (/rechner/zeit-umrechner/)
// =========================================================================
export function calculateTimeConversion(inputs: Record<string, any>): CalculationResult {
  const val = parseUnitNumber(inputs.value !== undefined ? inputs.value : inputs.inputValue);
  if (val === null) {
    return {
      primary: { id: 'result', label: 'Ergebnis', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie einen gültigen Zeitwert ein.',
    };
  }

  const fromUnit = inputs.fromUnit || inputs.inputUnit || 'hours';
  const toUnit = inputs.toUnit || 'minutes';

  // Exakte Zeit-Definitionen mit Sekunde (s) als Basis
  // Umrechnungsjahr = 365,25 Tage (Julianisches Jahr / Standard-Umrechnungskonvention)
  const toSeconds: Record<string, number> = {
    seconds: 1,
    minutes: 60,
    hours: 3600,
    days: 86400,
    weeks: 604800,
    years: 31557600, // 365.25 d × 86.400 s = 31.557.600 s
  };

  const unitLabels: Record<string, string> = {
    seconds: 'Sekunden (s)',
    minutes: 'Minuten (min)',
    hours: 'Stunden (h)',
    days: 'Tage (d)',
    weeks: 'Wochen (w)',
    years: 'Jahre (365,25 d)',
  };

  const unitSymbols: Record<string, string> = {
    seconds: 's',
    minutes: 'min',
    hours: 'h',
    days: 'Tage',
    weeks: 'Wochen',
    years: 'Jahre',
  };

  const fromFactor = toSeconds[fromUnit] ?? 3600;
  const toFactor = toSeconds[toUnit] ?? 60;

  const totalSeconds = val * fromFactor;
  const result = totalSeconds / toFactor;

  const humanStr = formatHumanReadableDuration(totalSeconds);

  const seconds = totalSeconds;
  const minutes = totalSeconds / 60;
  const hours = totalSeconds / 3600;
  const days = totalSeconds / 86400;
  const weeks = totalSeconds / 604800;
  const years = totalSeconds / 31557600;

  return {
    primary: {
      id: toUnit,
      label: `Ergebnis in ${unitLabels[toUnit] || toUnit}`,
      value: result,
      formattedValue: `${formatAdaptiveUnit(result, 6)} ${unitSymbols[toUnit] || toUnit}`,
      highlight: true,
    },
    secondary: [
      { id: 'human', label: 'Zusammengesetzte Zeit', value: totalSeconds, formattedValue: humanStr },
      { id: 'seconds', label: 'Sekunden (s)', value: seconds, formattedValue: `${formatNumber(seconds, 2, 0)} s` },
      { id: 'minutes', label: 'Minuten (min)', value: minutes, formattedValue: `${formatNumber(minutes, 4, 0)} min` },
      { id: 'hours', label: 'Stunden (h)', value: hours, formattedValue: `${formatNumber(hours, 4, 0)} h` },
      { id: 'days', label: 'Tage (d)', value: days, formattedValue: `${formatNumber(days, 4, 0)} Tage` },
      { id: 'weeks', label: 'Wochen (w)', value: weeks, formattedValue: `${formatNumber(weeks, 6, 0)} Wochen` },
      { id: 'years', label: 'Jahre (365,25 d)', value: years, formattedValue: `${formatAdaptiveUnit(years, 6)} Jahre` },
    ],
    summaryText: `${formatAdaptiveUnit(val, 4)} ${unitLabels[fromUnit] || fromUnit} entsprechen ${formatAdaptiveUnit(result, 6)} ${unitLabels[toUnit] || toUnit} bzw. ${humanStr}.`,
  };
}

// =========================================================================
// 5. TEMPERATUR-UMRECHNER
// =========================================================================
export function calculateTemperatureConversion(inputs: Record<string, any>): CalculationResult {
  const val = parseUnitNumber(inputs.value !== undefined && inputs.value !== '' && inputs.value !== null ? inputs.value : 25);
  const from = inputs.fromUnit || 'C'; // 'C', 'F', 'K'
  const to = inputs.toUnit || 'F';

  if (val === null) {
    return {
      primary: { id: 'temp', label: 'Temperatur', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie einen gültigen Zahlenwert für die Temperatur ein.',
    };
  }

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

  const toLabel = to === 'K' ? 'Kelvin (K)' : `Grad ${to === 'C' ? 'Celsius' : 'Fahrenheit'} (°${to})`;
  const toFormatted = to === 'K' ? `${formatNumber(result, 2)} K` : `${formatNumber(result, 2)} °${to}`;
  const fromFormatted = from === 'K' ? `${formatNumber(val, 1)} K` : `${formatNumber(val, 1)} °${from}`;

  return {
    primary: {
      id: 'temp',
      label: `Temperatur in ${toLabel}`,
      value: result,
      formattedValue: toFormatted,
      highlight: true,
    },
    secondary: [
      { id: 'celsius', label: 'In Grad Celsius', value: celsius, formattedValue: `${formatNumber(celsius, 2)} °C` },
      { id: 'fahrenheit', label: 'In Grad Fahrenheit', value: fahrenheit, formattedValue: `${formatNumber(fahrenheit, 2)} °F` },
      { id: 'kelvin', label: 'In Kelvin (SI-Basiseinheit)', value: kelvin, formattedValue: `${formatNumber(kelvin, 2)} K` },
      { id: 'waterState', label: 'Aggregatzustand von Wasser bei 1 atm', value: celsius <= 0 ? 'Gefroren (Eis)' : celsius >= 100 ? 'Gasförmig (Dampf)' : 'Flüssig', formattedValue: celsius <= 0 ? 'Gefroren (Eis)' : celsius >= 100 ? 'Gasförmig (Dampf)' : 'Flüssig' },
    ],
    summaryText: `${fromFormatted} entsprechen ${toFormatted} (${formatNumber(celsius, 1)} °C / ${formatNumber(fahrenheit, 1)} °F / ${formatNumber(kelvin, 2)} K).`,
  };
}

