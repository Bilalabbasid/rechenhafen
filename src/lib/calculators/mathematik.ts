import { CalculationResult } from '@/types/calculator';
import { formatNumber, formatPercent } from '@/lib/formatters';

export function calculatePercentage(inputs: Record<string, any>): CalculationResult {
  const mode = inputs.mode || 'partOf'; // 'partOf', 'change', 'base'
  const p = parseFloat(inputs.percent) || 0;
  const base = parseFloat(inputs.base) || 0;

  if (mode === 'partOf') {
    const result = (p / 100) * base;
    return {
      primary: {
        id: 'result',
        label: `${formatPercent(p)} von ${formatNumber(base)}`,
        value: result,
        formattedValue: formatNumber(result),
        highlight: true,
      },
      secondary: [
        { id: 'sum', label: 'Grundwert + Prozentwert', value: base + result, formattedValue: formatNumber(base + result) },
        { id: 'diff', label: 'Grundwert - Prozentwert', value: base - result, formattedValue: formatNumber(base - result) },
        { id: 'factor', label: 'Multiplikationsfaktor', value: p / 100, formattedValue: formatNumber(p / 100, 4) },
      ],
      summaryText: `${formatPercent(p)} von ${formatNumber(base)} entsprechen exakt ${formatNumber(result)}.`,
    };
  }

  // Fallback direct calculation
  const part = (p / 100) * base;
  return {
    primary: { id: 'result', label: 'Prozentwert', value: part, formattedValue: formatNumber(part), highlight: true },
    summaryText: `${p} % von ${base} ist ${part}.`,
  };
}

export function calculatePercentChange(inputs: Record<string, any>): CalculationResult {
  const val1 = parseFloat(inputs.oldValue) || 0;
  const val2 = parseFloat(inputs.newValue) || 0;

  if (val1 === 0) {
    return {
      primary: { id: 'change', label: 'Veränderung', value: 0, formattedValue: 'Nicht definiert' },
      error: 'Der Ausgangswert darf nicht null sein, da sonst keine prozentuale Veränderung berechnet werden kann (Division durch 0).',
    };
  }

  const absDiff = val2 - val1;
  const relChange = (absDiff / Math.abs(val1)) * 100;
  const factor = val2 / val1;
  const isIncrease = absDiff > 0;

  return {
    primary: {
      id: 'relChange',
      label: isIncrease ? 'Prozentuale Steigerung' : 'Prozentuale Senkung',
      value: relChange,
      formattedValue: `${relChange >= 0 ? '+' : ''}${formatNumber(relChange, 2)} %`,
      highlight: true,
    },
    secondary: [
      { id: 'absDiff', label: 'Absolute Differenz', value: absDiff, formattedValue: `${absDiff >= 0 ? '+' : ''}${formatNumber(absDiff, 2)}` },
      { id: 'factor', label: 'Änderungsfaktor', value: factor, formattedValue: `${formatNumber(factor, 4)} ×` },
      { id: 'newShare', label: 'Neuer Wert in % des alten', value: (val2 / val1) * 100, formattedValue: `${formatNumber((val2 / val1) * 100, 2)} %` },
    ],
    summaryText: `Der Wert hat sich von ${formatNumber(val1)} auf ${formatNumber(val2)} um ${formatNumber(Math.abs(absDiff), 2)} verändert. Das entspricht einer ${isIncrease ? 'Steigerung' : 'Senkung'} von ${formatNumber(Math.abs(relChange), 2)} %.`,
  };
}

export function calculateBaseValue(inputs: Record<string, any>): CalculationResult {
  const part = parseFloat(inputs.part) || 0;
  const percent = parseFloat(inputs.percent) || 0;

  if (percent === 0) {
    return {
      primary: { id: 'base', label: 'Grundwert', value: 0, formattedValue: '0' },
      error: 'Der Prozentsatz darf nicht null sein (Division durch 0).',
    };
  }

  const base = part / (percent / 100);
  return {
    primary: {
      id: 'base',
      label: 'Grundwert (100 %)',
      value: base,
      formattedValue: formatNumber(base),
      highlight: true,
    },
    secondary: [
      { id: 'part', label: 'Gegebener Prozentwert', value: part, formattedValue: formatNumber(part) },
      { id: 'percent', label: 'Gegebener Prozentsatz', value: percent, formattedValue: formatPercent(percent) },
      { id: 'factor', label: 'Formel', value: 'W / (p / 100)', formattedValue: `${formatNumber(part)} / (${formatNumber(percent)} / 100)` },
    ],
    summaryText: `Wenn ${formatNumber(part)} genau ${formatPercent(percent)} entsprechen, beträgt der vollständige Grundwert (100 %) genau ${formatNumber(base)}.`,
  };
}

export function calculateRuleOfThree(inputs: Record<string, any>): CalculationResult {
  const a1 = parseFloat(inputs.a1) || 1;
  const b1 = parseFloat(inputs.b1) || 1;
  const a2 = parseFloat(inputs.a2) || 1;
  const isIndirect = inputs.type === 'indirect'; // antiproportional

  if (a1 === 0) {
    return {
      primary: { id: 'b2', label: 'Ergebnis', value: 0, formattedValue: '0' },
      error: 'Der Ausgangswert A1 darf nicht null sein.',
    };
  }

  // Direkt: a1 -> b1, a2 -> (b1 / a1) * a2
  // Indirekt (antiproportional): a1 * b1 = a2 * b2 -> b2 = (a1 * b1) / a2
  let b2 = 0;
  if (isIndirect) {
    if (a2 === 0) {
      return {
        primary: { id: 'b2', label: 'Ergebnis', value: 0, formattedValue: '0' },
        error: 'Beim antiproportionalen Dreisatz darf A2 nicht null sein.',
      };
    }
    b2 = (a1 * b1) / a2;
  } else {
    b2 = (b1 / a1) * a2;
  }

  const unitRate = b1 / a1;

  return {
    primary: {
      id: 'b2',
      label: `Gesuchter Wert (${inputs.labelB || 'Wert B'})`,
      value: b2,
      formattedValue: formatNumber(b2, 2),
      highlight: true,
    },
    secondary: [
      { id: 'type', label: 'Verhältnisart', value: isIndirect ? 'Antiproportional' : 'Proportional (Je mehr, desto mehr)', formattedValue: isIndirect ? 'Antiproportional (Je mehr, desto weniger)' : 'Proportional (Direkt)' },
      { id: 'unitVal', label: 'Wert pro Einheit (1 A entspricht)', value: unitRate, formattedValue: `${formatNumber(unitRate, 4)} B` },
    ],
    summaryText: isIndirect
      ? `Antiproportional: Wenn ${a1} Einheiten zu ${b1} führen, entsprechen ${a2} Einheiten dem Wert ${formatNumber(b2, 2)}.`
      : `Proportional: Wenn ${a1} Einheiten zu ${b1} führen, entsprechen ${a2} Einheiten dem Wert ${formatNumber(b2, 2)}.`,
  };
}

export function calculateAverage(inputs: Record<string, any>): CalculationResult {
  const rawInput = String(inputs.numbers || '10; 20; 30; 40; 50');
  const numbers = rawInput
    .split(/[;, \n]+/)
    .map((s) => s.trim().replace(',', '.'))
    .filter((s) => s.length > 0)
    .map(Number)
    .filter((n) => Number.isFinite(n));

  if (numbers.length === 0) {
    return {
      primary: { id: 'avg', label: 'Mittelwert', value: 0, formattedValue: '0' },
      error: 'Bitte geben Sie mindestens eine Zahl ein (z.B. durch Komma, Semikolon oder Leerzeichen getrennt).',
    };
  }

  const sum = numbers.reduce((acc, val) => acc + val, 0);
  const avg = sum / numbers.length;
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const range = max - min;

  // Median
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  return {
    primary: {
      id: 'avg',
      label: 'Arithmetisches Mittel (Durchschnitt)',
      value: avg,
      formattedValue: formatNumber(avg, 2),
      highlight: true,
    },
    secondary: [
      { id: 'median', label: 'Median (Zentralwert)', value: median, formattedValue: formatNumber(median, 2) },
      { id: 'count', label: 'Anzahl der Werte', value: numbers.length, formattedValue: `${numbers.length}` },
      { id: 'sum', label: 'Gesamtsumme', value: sum, formattedValue: formatNumber(sum, 2) },
      { id: 'min', label: 'Minimum', value: min, formattedValue: formatNumber(min, 2) },
      { id: 'max', label: 'Maximum', value: max, formattedValue: formatNumber(max, 2) },
      { id: 'span', label: 'Spannweite', value: range, formattedValue: formatNumber(range, 2) },
    ],
    summaryText: `Der Durchschnitt von ${numbers.length} Zahlen beträgt ${formatNumber(avg, 2)}. Der Median liegt bei ${formatNumber(median, 2)}, die Summe aller Werte ist ${formatNumber(sum, 2)}.`,
  };
}

export function calculatePythagoras(inputs: Record<string, any>): CalculationResult {
  const a = parseFloat(inputs.sideA) || 0;
  const b = parseFloat(inputs.sideB) || 0;
  const c = parseFloat(inputs.sideC) || 0;
  const target = inputs.target || 'c'; // 'c' (hypotenuse) or 'a' or 'b' (cathetus)

  if (target === 'c') {
    if (a <= 0 || b <= 0) {
      return { primary: { id: 'c', label: 'Hypotenuse c', value: 0, formattedValue: '0' }, error: 'Kathete a und Kathete b müssen größer als 0 sein.' };
    }
    const resC = Math.sqrt(a * a + b * b);
    return {
      primary: { id: 'c', label: 'Hypotenuse c', value: resC, formattedValue: formatNumber(resC, 3), highlight: true },
      secondary: [
        { id: 'formula', label: 'Berechnungsformel', value: 'c = √(a² + b²)', formattedValue: `√(${formatNumber(a)}² + ${formatNumber(b)}²)` },
        { id: 'area', label: 'Flächeninhalt des Dreiecks', value: (a * b) / 2, formattedValue: `${formatNumber((a * b) / 2, 2)} Einheiten²` },
        { id: 'perimeter', label: 'Umfang des Dreiecks', value: a + b + resC, formattedValue: `${formatNumber(a + b + resC, 2)} Einheiten` },
      ],
      summaryText: `Im rechtwinkligen Dreieck mit Katheten a = ${formatNumber(a)} und b = ${formatNumber(b)} ist die Hypotenuse c = ${formatNumber(resC, 3)}.`,
    };
  } else {
    // Missing cathetus
    const hyp = c;
    const cat = target === 'a' ? b : a;
    if (hyp <= cat || hyp <= 0 || cat <= 0) {
      return { primary: { id: 'res', label: 'Kathete', value: 0, formattedValue: '0' }, error: 'Die Hypotenuse c muss stets länger als die gegebene Kathete sein.' };
    }
    const resCat = Math.sqrt(hyp * hyp - cat * cat);
    return {
      primary: { id: 'res', label: target === 'a' ? 'Kathete a' : 'Kathete b', value: resCat, formattedValue: formatNumber(resCat, 3), highlight: true },
      secondary: [
        { id: 'area', label: 'Flächeninhalt', value: (resCat * cat) / 2, formattedValue: `${formatNumber((resCat * cat) / 2, 2)} Einheiten²` },
        { id: 'perimeter', label: 'Umfang', value: resCat + cat + hyp, formattedValue: `${formatNumber(resCat + cat + hyp, 2)} Einheiten` },
      ],
      summaryText: `Die fehlende Kathete beträgt ${formatNumber(resCat, 3)}.`,
    };
  }
}

export function calculateGcdLcm(inputs: Record<string, any>): CalculationResult {
  const a = Math.abs(parseInt(inputs.num1 || '12', 10));
  const b = Math.abs(parseInt(inputs.num2 || '18', 10));

  if (!Number.isFinite(a) || !Number.isFinite(b) || a === 0 || b === 0) {
    return {
      primary: { id: 'gcd', label: 'ggT', value: 0, formattedValue: '0' },
      error: 'Bitte geben Sie zwei ganze Zahlen ungleich null ein.',
    };
  }

  const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
  const gcdVal = gcd(a, b);
  const lcmVal = (a * b) / gcdVal;

  return {
    primary: {
      id: 'gcd',
      label: `Größter gemeinsamer Teiler (ggT)`,
      value: gcdVal,
      formattedValue: `${gcdVal}`,
      highlight: true,
    },
    secondary: [
      { id: 'lcm', label: `Kleinstes gemeinsames Vielfaches (kgV)`, value: lcmVal, formattedValue: `${lcmVal}` },
      { id: 'divA', label: `${a} geteilt durch ggT`, value: a / gcdVal, formattedValue: `${a / gcdVal}` },
      { id: 'divB', label: `${b} geteilt durch ggT`, value: b / gcdVal, formattedValue: `${b / gcdVal}` },
    ],
    summaryText: `Für die Zahlen ${a} und ${b} ist der ggT = ${gcdVal} und das kgV = ${lcmVal}.`,
  };
}

export function calculateRoot(inputs: Record<string, any>): CalculationResult {
  const radikand = parseFloat(inputs.value) || 0;
  const degree = parseInt(inputs.degree || '2', 10);

  if (radikand < 0 && degree % 2 === 0) {
    return {
      primary: { id: 'root', label: 'Wurzel', value: 0, formattedValue: 'Nicht reell' },
      error: 'Aus negativen Zahlen kann im reellen Zahlenbereich keine gerade Wurzel gezogen werden.',
    };
  }

  const result = radikand >= 0 ? Math.pow(radikand, 1 / degree) : -Math.pow(Math.abs(radikand), 1 / degree);

  return {
    primary: {
      id: 'root',
      label: `${degree}. Wurzel aus ${formatNumber(radikand)}`,
      value: result,
      formattedValue: formatNumber(result, 4),
      highlight: true,
    },
    secondary: [
      { id: 'squared', label: 'Quadrat des Werts', value: Math.pow(radikand, 2), formattedValue: formatNumber(Math.pow(radikand, 2)) },
      { id: 'sqrt', label: 'Quadratwurzel (√x)', value: radikand >= 0 ? Math.sqrt(radikand) : 0, formattedValue: radikand >= 0 ? formatNumber(Math.sqrt(radikand), 4) : '-' },
      { id: 'cbrt', label: 'Kubikwurzel (³√x)', value: Math.cbrt(radikand), formattedValue: formatNumber(Math.cbrt(radikand), 4) },
    ],
    summaryText: `Die ${degree}. Wurzel aus ${formatNumber(radikand)} beträgt gerundet ${formatNumber(result, 4)}.`,
  };
}
