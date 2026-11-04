import { CalculationResult } from '@/types/calculator';
import { formatNumber, formatPercent } from '@/lib/formatters';

/**
 * Liest eine Zahleneingabe robust ein (auch mit deutschem Dezimalkomma, z. B. "19,5" oder "1.234,5").
 * Gibt NaN zurück, wenn das Feld leer oder keine gültige Zahl ist.
 */
export function readNumberInput(raw: unknown): number {
  if (raw === undefined || raw === null) return NaN;
  if (typeof raw === 'number') return raw;
  let s = String(raw).trim().replace(/\s/g, '');
  if (s === '') return NaN;
  if (s.includes(',')) {
    s = s.replace(/\./g, '').replace(',', '.');
  }
  if (!/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(s)) return NaN;
  return Number(s);
}

const PERCENT_EMPTY_LABELS: Record<string, string> = {
  percent: 'den Prozentsatz p',
  base: 'den Grundwert G',
  part: 'den Prozentwert W',
  finalValue: 'den Wert nach der Änderung',
};

function percentInputError(label: string, message: string): CalculationResult {
  return {
    primary: { id: 'result', label, value: 0, formattedValue: '–' },
    error: message,
  };
}

/** Bis zu 2 Nachkommastellen, bei kleinen Beträgen mehr, damit z. B. 0,0035 nicht als 0 erscheint. */
function fmtPercentValue(x: number): string {
  const abs = Math.abs(x);
  if (abs !== 0 && abs < 0.01) return formatNumber(x, 6);
  return formatNumber(x, 2);
}

/**
 * Prozentrechner: löst alle drei Grundaufgaben (Prozentwert, Prozentsatz, Grundwert)
 * sowie Erhöhung/Senkung und die Rückrechnung auf den Ursprungswert (vermehrter/verminderter Grundwert).
 *
 * Modi (calculationMode bzw. mode):
 * - partOf:            W = G · p / 100            (Eingaben: percent, base)
 * - shareOf:           p = W / G · 100            (Eingaben: part, base; ältere Aufrufer übergeben W als percent)
 * - baseOf:            G = W · 100 / p            (Eingaben: part, percent)
 * - increase/decrease: G · (1 ± p / 100)          (Eingaben: percent, base)
 * - baseFromIncreased: G = E / (1 + p / 100)      (Eingaben: finalValue, percent)
 * - baseFromDecreased: G = E / (1 − p / 100)      (Eingaben: finalValue, percent)
 */
export function calculatePercentage(inputs: Record<string, any>): CalculationResult {
  const mode = inputs.calculationMode || inputs.mode || 'partOf';

  const read = (id: string, label: string): number | CalculationResult => {
    const raw = id === 'part' && mode === 'shareOf' && inputs.part === undefined ? inputs.percent : inputs[id];
    const v = readNumberInput(raw);
    if (raw === undefined || raw === null || String(raw).trim() === '') {
      return percentInputError(label, `Bitte geben Sie ${PERCENT_EMPTY_LABELS[id]} ein.`);
    }
    if (!Number.isFinite(v)) {
      return percentInputError(label, `Bitte geben Sie für ${PERCENT_EMPTY_LABELS[id]} eine gültige Zahl ein.`);
    }
    return v;
  };
  const isErr = (v: number | CalculationResult): v is CalculationResult => typeof v !== 'number';
  const finite = (label: string, ...vals: number[]): CalculationResult | null =>
    vals.every((v) => Number.isFinite(v))
      ? null
      : percentInputError(label, 'Die Zahlen sind zu groß für eine sinnvolle Berechnung. Bitte geben Sie kleinere Werte ein.');

  if (mode === 'shareOf') {
    const label = 'Prozentsatz p';
    const part = read('part', label);
    if (isErr(part)) return part;
    const base = read('base', label);
    if (isErr(base)) return base;
    if (base === 0) {
      return percentInputError(label, 'Der Grundwert G darf nicht 0 sein – durch 0 kann nicht geteilt werden.');
    }
    const percentShare = (part / base) * 100;
    const overflow = finite(label, percentShare);
    if (overflow) return overflow;
    return {
      primary: {
        id: 'result',
        label: `${formatNumber(part)} von ${formatNumber(base)} in Prozent`,
        value: percentShare,
        formattedValue: formatPercent(percentShare, 2),
        highlight: true,
      },
      secondary: [
        { id: 'part', label: 'Prozentwert W (Anteil)', value: part, formattedValue: formatNumber(part) },
        { id: 'base', label: 'Grundwert G (100 %)', value: base, formattedValue: formatNumber(base) },
        { id: 'fraction', label: 'Anteil als Dezimalzahl (W / G)', value: part / base, formattedValue: `${formatNumber(part / base, 4)}` },
        { id: 'remainingShare', label: 'Rest bis 100 %', value: 100 - percentShare, formattedValue: formatPercent(100 - percentShare, 2) },
      ],
      calculationSteps: [
        `Gesucht ist der Prozentsatz: p = W / G · 100`,
        `p = ${formatNumber(part)} / ${formatNumber(base)} · 100`,
        `p = ${formatNumber(part / base, 6)} · 100 = ${formatPercent(percentShare, 2)}`,
      ],
      summaryText: `${formatNumber(part)} sind ${formatPercent(percentShare, 2)} von ${formatNumber(base)}.`,
    };
  }

  if (mode === 'baseOf') {
    const label = 'Grundwert G (100 %)';
    const part = read('part', label);
    if (isErr(part)) return part;
    const percent = read('percent', label);
    if (isErr(percent)) return percent;
    if (percent === 0) {
      return percentInputError(label, 'Der Prozentsatz darf nicht 0 % sein – aus 0 % lässt sich kein Grundwert zurückrechnen.');
    }
    const base = (part * 100) / percent;
    const overflow = finite(label, base);
    if (overflow) return overflow;
    const onePercent = part / percent;
    return {
      primary: { id: 'base', label, value: base, formattedValue: fmtPercentValue(base), highlight: true },
      secondary: [
        { id: 'part', label: 'Prozentwert W', value: part, formattedValue: formatNumber(part) },
        { id: 'percent', label: 'Prozentsatz p', value: percent, formattedValue: formatPercent(percent) },
        { id: 'onePercent', label: '1 % entspricht', value: onePercent, formattedValue: fmtPercentValue(onePercent) },
      ],
      calculationSteps: [
        `Gesucht ist der Grundwert: G = W · 100 / p`,
        `Dreisatz: ${formatPercent(percent)} ≙ ${formatNumber(part)} → 1 % ≙ ${formatNumber(part)} / ${formatNumber(percent)} = ${fmtPercentValue(onePercent)}`,
        `100 % ≙ ${fmtPercentValue(onePercent)} · 100 = ${fmtPercentValue(base)}`,
      ],
      summaryText: `Wenn ${formatNumber(part)} genau ${formatPercent(percent)} sind, beträgt der Grundwert (100 %) ${fmtPercentValue(base)}.`,
    };
  }

  if (mode === 'baseFromIncreased' || mode === 'baseFromDecreased') {
    const increased = mode === 'baseFromIncreased';
    const label = increased ? 'Ursprungswert vor der Erhöhung' : 'Ursprungswert vor der Senkung';
    const finalValue = read('finalValue', label);
    if (isErr(finalValue)) return finalValue;
    const percent = read('percent', label);
    if (isErr(percent)) return percent;
    const factorPercent = increased ? 100 + percent : 100 - percent;
    if (increased && factorPercent <= 0) {
      return percentInputError(label, 'Eine Erhöhung muss größer als −100 % sein. Bitte prüfen Sie den Prozentsatz.');
    }
    if (!increased && factorPercent <= 0) {
      return percentInputError(label, 'Eine Senkung um 100 % oder mehr lässt keinen Rückschluss auf den Ursprungswert zu. Bitte geben Sie einen Prozentsatz unter 100 % ein.');
    }
    const base = (finalValue * 100) / factorPercent;
    const overflow = finite(label, base);
    if (overflow) return overflow;
    const change = finalValue - base;
    return {
      primary: { id: 'base', label, value: base, formattedValue: fmtPercentValue(base), highlight: true },
      secondary: [
        { id: 'finalValue', label: increased ? `Wert nach der Erhöhung (${formatPercent(factorPercent)})` : `Wert nach der Senkung (${formatPercent(factorPercent)})`, value: finalValue, formattedValue: formatNumber(finalValue) },
        { id: 'change', label: increased ? 'Enthaltener Aufschlag' : 'Abgezogener Betrag', value: change, formattedValue: `${change >= 0 ? '+' : ''}${fmtPercentValue(change)}` },
        { id: 'factor', label: 'Teiler (Faktor)', value: factorPercent / 100, formattedValue: formatNumber(factorPercent / 100, 4) },
      ],
      calculationSteps: [
        increased
          ? `Nach einer Erhöhung um ${formatPercent(percent)} entspricht der neue Wert ${formatPercent(factorPercent)} des Ursprungswerts.`
          : `Nach einer Senkung um ${formatPercent(percent)} entspricht der neue Wert ${formatPercent(factorPercent)} des Ursprungswerts.`,
        `G = ${formatNumber(finalValue)} · 100 / ${formatNumber(factorPercent)} = ${fmtPercentValue(base)}`,
        `Probe: ${fmtPercentValue(base)} · ${formatNumber(factorPercent / 100, 4)} = ${formatNumber(finalValue)}`,
      ],
      summaryText: increased
        ? `Vor der Erhöhung um ${formatPercent(percent)} betrug der Wert ${fmtPercentValue(base)}.`
        : `Vor der Senkung um ${formatPercent(percent)} betrug der Wert ${fmtPercentValue(base)}.`,
    };
  }

  const p = read('percent', 'Ergebnis');
  if (isErr(p)) return p;
  const base = read('base', 'Ergebnis');
  if (isErr(base)) return base;

  if (mode === 'increase') {
    // Grundwert um p % erhöhen
    const part = (p / 100) * base;
    const total = base + part;
    const overflow = finite('Neuer Endwert', total);
    if (overflow) return overflow;
    return {
      primary: {
        id: 'result',
        label: `Neuer Endwert (+${formatPercent(p)})`,
        value: total,
        formattedValue: formatNumber(total),
        highlight: true,
      },
      secondary: [
        { id: 'part', label: `Erhöhung / Aufschlag (${formatPercent(p)})`, value: part, formattedValue: `+${formatNumber(part)}` },
        { id: 'base', label: 'Ursprünglicher Grundwert (100 %)', value: base, formattedValue: formatNumber(base) },
        { id: 'factor', label: 'Wachstumsfaktor', value: 1 + (p / 100), formattedValue: `${formatNumber(1 + (p / 100), 4)} ×` },
      ],
      calculationSteps: [
        `Aufschlag: ${formatNumber(base)} · ${formatNumber(p)} / 100 = ${formatNumber(part)}`,
        `Neuer Wert: ${formatNumber(base)} + ${formatNumber(part)} = ${formatNumber(total)}`,
        `Kurzweg: ${formatNumber(base)} · ${formatNumber(1 + p / 100, 4)} = ${formatNumber(total)}`,
      ],
      summaryText: `Wird der Grundwert ${formatNumber(base)} um ${formatPercent(p)} erhöht (+${formatNumber(part)}), ergibt sich der neue Gesamtwert ${formatNumber(total)}.`,
    };
  }

  if (mode === 'decrease') {
    // Grundwert um p % reduzieren (z. B. Rabatt)
    const part = (p / 100) * base;
    const total = base - part;
    const overflow = finite('Neuer Endwert', total);
    if (overflow) return overflow;
    return {
      primary: {
        id: 'result',
        label: `Neuer Endwert (-${formatPercent(p)})`,
        value: total,
        formattedValue: formatNumber(total),
        highlight: true,
      },
      secondary: [
        { id: 'part', label: `Minderung / Rabatt (${formatPercent(p)})`, value: part, formattedValue: `-${formatNumber(part)}` },
        { id: 'base', label: 'Ursprünglicher Grundwert (100 %)', value: base, formattedValue: formatNumber(base) },
        { id: 'factor', label: 'Restfaktor', value: 1 - (p / 100), formattedValue: `${formatNumber(1 - (p / 100), 4)} ×` },
      ],
      calculationSteps: [
        `Abzug: ${formatNumber(base)} · ${formatNumber(p)} / 100 = ${formatNumber(part)}`,
        `Neuer Wert: ${formatNumber(base)} − ${formatNumber(part)} = ${formatNumber(total)}`,
        `Kurzweg: ${formatNumber(base)} · ${formatNumber(1 - p / 100, 4)} = ${formatNumber(total)}`,
      ],
      summaryText: `Wird der Grundwert ${formatNumber(base)} um ${formatPercent(p)} reduziert (-${formatNumber(part)}), verbleibt ein neuer Endwert von ${formatNumber(total)}.`,
    };
  }

  // Standard: partOf ("Wie viel sind p % von G?")
  const result = (p / 100) * base;
  const overflow = finite('Prozentwert W', result);
  if (overflow) return overflow;
  return {
    primary: {
      id: 'result',
      label: `Prozentwert (${formatPercent(p)} von ${formatNumber(base)})`,
      value: result,
      formattedValue: fmtPercentValue(result),
      highlight: true,
    },
    secondary: [
      { id: 'sum', label: 'Grundwert + Prozentwert', value: base + result, formattedValue: formatNumber(base + result) },
      { id: 'diff', label: 'Grundwert − Prozentwert', value: base - result, formattedValue: formatNumber(base - result) },
      { id: 'factor', label: 'Multiplikationsfaktor (p / 100)', value: p / 100, formattedValue: formatNumber(p / 100, 4) },
    ],
    calculationSteps: [
      `Gesucht ist der Prozentwert: W = G · p / 100`,
      `W = ${formatNumber(base)} · ${formatNumber(p)} / 100`,
      `W = ${fmtPercentValue(result)}`,
    ],
    summaryText: `${formatPercent(p)} von ${formatNumber(base)} sind ${fmtPercentValue(result)}.`,
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
  const a1 = inputs.a1 !== undefined && inputs.a1 !== '' ? parseFloat(inputs.a1) : 1;
  const b1 = inputs.b1 !== undefined && inputs.b1 !== '' ? parseFloat(inputs.b1) : 1;
  const a2 = inputs.a2 !== undefined && inputs.a2 !== '' ? parseFloat(inputs.a2) : 1;
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
  const rawInput = inputs.numbers !== undefined ? String(inputs.numbers) : '10; 20; 30; 40; 50';
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
  const a = Math.abs(parseInt(inputs.num1 !== undefined && inputs.num1 !== '' ? inputs.num1 : '12', 10));
  const b = Math.abs(parseInt(inputs.num2 !== undefined && inputs.num2 !== '' ? inputs.num2 : '18', 10));

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

const SUPERSCRIPT_DIGITS = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];

function rootSymbol(n: number): string {
  if (n === 2) return '√';
  if (n === 3) return '∛';
  if (n === 4) return '∜';
  if (Number.isInteger(n) && n > 0) {
    return `${String(n).split('').map((d) => SUPERSCRIPT_DIGITS[Number(d)]).join('')}√`;
  }
  return `ⁿ√`;
}

function rootName(n: number): string {
  if (n === 2) return 'Quadratwurzel';
  if (Number.isInteger(n)) return `${n}. Wurzel`;
  return `Wurzel mit Exponent ${formatNumber(n, 4)}`;
}

/** Zerlegt m (positive ganze Zahl) in außen · ⁿ√innen, z. B. √72 = 6 · √2. */
function splitRadicand(m: number, n: number): { outside: number; inside: number } {
  let outside = 1;
  let inside = 1;
  let rest = m;
  for (let p = 2; p * p <= rest; p++) {
    if (rest % p !== 0) continue;
    let e = 0;
    while (rest % p === 0) {
      rest /= p;
      e++;
    }
    outside *= Math.pow(p, Math.floor(e / n));
    inside *= Math.pow(p, e % n);
  }
  if (rest > 1) {
    if (n === 1) outside *= rest;
    else inside *= rest;
  }
  return { outside, inside };
}

function rootError(message: string, formattedValue = 'Nicht definiert'): CalculationResult {
  return {
    primary: { id: 'root', label: 'Wurzel', value: 0, formattedValue },
    error: message,
  };
}

/**
 * Wurzelrechner: Quadratwurzel (Standard, n = 2) und beliebige n-te Wurzel.
 * Eingaben: value (Radikand), degree (Wurzelexponent n, optional, Standard 2).
 * Ungerade ganzzahlige n erlauben negative Radikanden (⁵√−32 = −2), gerade n nicht.
 */
/**
 * True only if r is exactly the n-th root of abs, checked with integer (BigInt) arithmetic on
 * the decimal representations. A float round-trip (Math.pow(r, n) === abs) is not enough:
 * e.g. Math.cbrt(200) ** 3 === 200 in IEEE doubles although the cube root of 200 is irrational.
 */
function isExactRoot(r: number, n: number, abs: number): boolean {
  if (!Number.isInteger(n) || n < 1 || n > 64) return false;
  const toFraction = (v: number, maxDecimals: number): [bigint, number] | null => {
    const str = v.toFixed(maxDecimals).replace(/0+$/, '').replace(/\.$/, '');
    if (!/^\d+(\.\d+)?$/.test(str) || Number(str) !== v) return null;
    const [int, frac = ''] = str.split('.');
    return [BigInt(int + frac), frac.length];
  };
  const root = toFraction(r, 6); // the result is shown with at most 6 decimals
  const rad = toFraction(abs, 12);
  if (!root || !rad) return false;
  const [k, d] = root;
  const [a, e] = rad;
  // (k / 10^d)^n === a / 10^e  <=>  k^n · 10^e === a · 10^(d·n)
  return k ** BigInt(n) * 10n ** BigInt(e) === a * 10n ** BigInt(d * n);
}

export function calculateRoot(inputs: Record<string, any>): CalculationResult {
  const rawValue = inputs.value;
  if (rawValue === undefined || rawValue === null || String(rawValue).trim() === '') {
    return rootError('Bitte geben Sie die Zahl unter der Wurzel (Radikand) ein.', '–');
  }
  const x = readNumberInput(rawValue);
  if (!Number.isFinite(x)) {
    return rootError('Bitte geben Sie als Radikand eine gültige Zahl ein.', '–');
  }

  const rawDegree = inputs.degree;
  const n = rawDegree === undefined || rawDegree === null || String(rawDegree).trim() === '' ? 2 : readNumberInput(rawDegree);
  if (!Number.isFinite(n) || n <= 0) {
    return rootError('Der Wurzelexponent n muss eine positive Zahl sein (2 = Quadratwurzel, 4 = vierte Wurzel usw.).');
  }
  const nIsInt = Number.isInteger(n);

  if (x < 0) {
    if (!nIsInt) {
      return rootError('Aus negativen Zahlen lässt sich nur mit einem ganzzahligen, ungeraden Wurzelexponenten (3, 5, 7 …) eine reelle Wurzel ziehen.', 'Nicht reell');
    }
    if (n % 2 === 0) {
      const complexHint = n === 2 ? ` Im Bereich der komplexen Zahlen wären die Lösungen ±${formatNumber(Math.sqrt(-x), 6)} · i.` : '';
      return rootError(
        `Aus einer negativen Zahl gibt es keine reelle ${rootName(n)}: Jede reelle Zahl hoch ${n} ist positiv oder 0.${complexHint}`,
        'Nicht reell',
      );
    }
  }

  const abs = Math.abs(x);
  let r = n === 2 ? Math.sqrt(abs) : n === 3 ? Math.cbrt(abs) : Math.pow(abs, 1 / n);
  if (nIsInt) {
    // Gleitkomma-Rundung glätten: 4. Wurzel aus 81 soll exakt 3 ergeben, nicht 2,9999999999999996.
    const rounded = Math.round(r);
    if (rounded > 0 && Math.abs(rounded - r) <= 1e-9 * rounded && Math.pow(rounded, n) === abs) r = rounded;
  }
  const result = x < 0 ? -r : r;
  if (!Number.isFinite(result)) {
    return rootError('Das Ergebnis ist zu groß für eine sinnvolle Darstellung. Bitte wählen Sie einen kleineren Radikanden oder einen größeren Wurzelexponenten.');
  }

  const sym = rootSymbol(n);
  const xStr = formatNumber(x, 10);
  const xTerm = x < 0 ? `(${xStr})` : xStr;
  const resStr = formatNumber(result, 6);
  const exact = nIsInt && isExactRoot(r, n, abs);
  const integerRadicand = Number.isSafeInteger(abs) && abs <= 1e12;

  const secondary: CalculationResult['secondary'] = [];
  const steps: string[] = [];

  steps.push(
    n === 2
      ? `Gesucht ist die Zahl y ≥ 0, für die y² = ${xStr} gilt.`
      : x < 0
        ? `Bei ungeradem Wurzelexponenten ist die Wurzel aus einer negativen Zahl negativ: ${sym}${xTerm} = -${sym}${formatNumber(abs, 10)}.`
        : `Gesucht ist die Zahl y ≥ 0, für die y hoch ${formatNumber(n, 4)} = ${xStr} gilt.`,
  );

  let typeText: string;
  if (exact) {
    typeText = Number.isInteger(r) ? 'Exakt (ganze Zahl)' : 'Exakt';
    steps.push(`Probe: ${formatNumber(r, 10)}${nIsInt && n <= 9 ? SUPERSCRIPT_DIGITS[n] : `^${n}`} = ${formatNumber(abs, 10)} → ${sym}${xTerm} = ${formatNumber(result, 10)}`);
  } else {
    typeText = integerRadicand && nIsInt ? 'Irrationale Zahl, gerundet auf 6 Nachkommastellen' : 'Gerundet auf 6 Nachkommastellen';
    if (nIsInt && n >= 2 && abs >= 1 && abs <= 1e15) {
      let lower = Math.floor(r);
      while (Math.pow(lower, n) > abs) lower--;
      while (Math.pow(lower + 1, n) <= abs) lower++;
      const lowPow = Math.pow(lower, n);
      const highPow = Math.pow(lower + 1, n);
      secondary.push({ id: 'between', label: 'Liegt zwischen', value: lower, formattedValue: `${lower} und ${lower + 1}` });
      steps.push(`Einschachteln: ${formatNumber(lowPow)} < ${formatNumber(abs, 10)} < ${formatNumber(highPow)}, also liegt ${sym}${formatNumber(abs, 10)} zwischen ${lower} und ${lower + 1}.`);
    }
    steps.push(`Ergebnis (gerundet): ${sym}${xTerm} ≈ ${resStr}`);
  }

  secondary.push({ id: 'type', label: 'Art des Ergebnisses', value: exact ? 1 : 0, formattedValue: typeText });

  if (nIsInt && n >= 2 && integerRadicand && abs >= 4 && !exact) {
    const { outside, inside } = splitRadicand(abs, n);
    if (outside > 1 && inside > 1) {
      const sign = x < 0 ? '-' : '';
      const simplified = `${sign}${outside} · ${sym}${inside}`;
      secondary.push({ id: 'simplified', label: 'Vereinfachte Wurzel (teilweise Wurzelziehen)', value: outside, formattedValue: simplified });
      steps.splice(steps.length - 1, 0, `Teilweise Wurzelziehen: ${formatNumber(abs)} = ${formatNumber(Math.pow(outside, n))} · ${inside} und ${sym}${formatNumber(Math.pow(outside, n))} = ${outside}, also ${sym}${xTerm} = ${simplified}`);
    }
  }

  secondary.push({ id: 'power', label: 'Potenzschreibweise', value: 1 / n, formattedValue: `${xTerm}^(1/${formatNumber(n, 4)})` });
  const check = Math.pow(result, n);
  if (Number.isFinite(check)) {
    secondary.push({ id: 'check', label: `Probe: (${resStr})${nIsInt && n <= 9 ? SUPERSCRIPT_DIGITS[n] : `^${formatNumber(n, 4)}`}`, value: check, formattedValue: formatNumber(check, 6) });
  }
  if (n !== 2 && x >= 0) {
    secondary.push({ id: 'sqrt', label: 'Quadratwurzel zum Vergleich (√x)', value: Math.sqrt(x), formattedValue: formatNumber(Math.sqrt(x), 6) });
  }

  return {
    primary: {
      id: 'root',
      label: `${rootName(n)} aus ${xStr} (${sym}${xTerm})`,
      value: result,
      formattedValue: resStr,
      highlight: true,
    },
    secondary,
    calculationSteps: steps,
    summaryText: exact
      ? `Die ${rootName(n)} aus ${xStr} ist genau ${formatNumber(result, 10)}.`
      : `Die ${rootName(n)} aus ${xStr} beträgt gerundet ${resStr}.`,
  };
}

// ---------------------------------------------------------------------------
// Dreieck-Rechner
// ---------------------------------------------------------------------------

const TRIANGLE_UNITS = ['mm', 'cm', 'dm', 'm', 'km'];

/** Längen: 2 Nachkommastellen, unter 1 bis zu 4, damit kleine Dreiecke nicht als 0 erscheinen. */
function fmtLen(x: number): string {
  return formatNumber(x, Math.abs(x) < 1 ? 4 : 2);
}

function fmtDeg(x: number): string {
  return `${formatNumber(x, 2)}°`;
}

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;
const clampCos = (v: number) => Math.min(1, Math.max(-1, v));

function triangleError(message: string): CalculationResult {
  return {
    primary: { id: 'area', label: 'Flächeninhalt A', value: 0, formattedValue: '–' },
    error: message,
  };
}

/**
 * Dreieck-Rechner mit drei Eingabewegen (Eingabe `given`):
 * - baseHeight:    Grundseite g (baseG) und Höhe h (heightH) → A = ½ · g · h
 * - threeSides:    Seiten a, b, c (sideA, sideB, sideC) → Heron, Höhen, Winkel, In- und Umkreisradius
 * - twoSidesAngle: Seiten a, b und eingeschlossener Winkel γ (angleGamma, in Grad) → Kosinussatz, dann wie oben
 * Optional: unit (mm, cm, dm, m, km) für die Beschriftung der Ergebnisse.
 */
export function calculateTriangle(inputs: Record<string, any>): CalculationResult {
  const given: string = ['baseHeight', 'threeSides', 'twoSidesAngle'].includes(inputs.given)
    ? inputs.given
    : inputs.baseG !== undefined || inputs.heightH !== undefined
      ? 'baseHeight'
      : 'threeSides';
  const unit: string = TRIANGLE_UNITS.includes(inputs.unit) ? inputs.unit : 'cm';
  const u2 = `${unit}²`;

  const readPositive = (id: string, name: string, fallback: number): number | CalculationResult => {
    const raw = inputs[id];
    if (raw === undefined) return fallback;
    if (raw === null || String(raw).trim() === '') return triangleError(`Bitte geben Sie ${name} ein.`);
    const v = readNumberInput(raw);
    if (!Number.isFinite(v)) return triangleError(`Bitte geben Sie für ${name} eine gültige Zahl ein.`);
    if (v <= 0) {
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
      return triangleError(`${capitalized} muss größer als 0 sein.`);
    }
    return v;
  };
  const isErr = (v: number | CalculationResult): v is CalculationResult => typeof v !== 'number';

  if (given === 'baseHeight') {
    const g = readPositive('baseG', 'die Grundseite g', 10);
    if (isErr(g)) return g;
    const h = readPositive('heightH', 'die Höhe h', 6);
    if (isErr(h)) return h;
    const area = (g * h) / 2;
    const leg = Math.sqrt((g / 2) ** 2 + h ** 2);
    const isoPerimeter = g + 2 * leg;
    if (![area, leg, isoPerimeter].every(Number.isFinite) || area <= 0) {
      return triangleError('Die Zahlen sind zu groß oder zu klein für eine sinnvolle Berechnung. Bitte prüfen Sie die Eingaben.');
    }
    return {
      primary: { id: 'area', label: 'Flächeninhalt A', value: area, formattedValue: `${fmtLen(area)} ${u2}`, highlight: true },
      secondary: [
        { id: 'base', label: 'Grundseite g', value: g, formattedValue: `${fmtLen(g)} ${unit}` },
        { id: 'height', label: 'Höhe h (senkrecht auf g)', value: h, formattedValue: `${fmtLen(h)} ${unit}` },
        { id: 'rectangle', label: 'Rechteck g · h zum Vergleich (doppelte Fläche)', value: g * h, formattedValue: `${fmtLen(g * h)} ${u2}` },
        { id: 'isoLeg', label: 'Schenkellänge, falls gleichschenklig', value: leg, formattedValue: `${fmtLen(leg)} ${unit}` },
        { id: 'isoPerimeter', label: 'Umfang, falls gleichschenklig', value: isoPerimeter, formattedValue: `${fmtLen(isoPerimeter)} ${unit}` },
      ],
      calculationSteps: [
        'Formel: A = ½ · g · h (ein Dreieck ist halb so groß wie das Rechteck mit derselben Grundseite und Höhe)',
        `A = ½ · ${fmtLen(g)} · ${fmtLen(h)} = ${fmtLen(g * h)} / 2 = ${fmtLen(area)} ${u2}`,
        `Nur falls das Dreieck gleichschenklig ist: Schenkel = √((g/2)² + h²) = √(${fmtLen(g / 2)}² + ${fmtLen(h)}²) = ${fmtLen(leg)} ${unit}`,
      ],
      summaryText: `Ein Dreieck mit der Grundseite ${fmtLen(g)} ${unit} und der Höhe ${fmtLen(h)} ${unit} hat den Flächeninhalt ${fmtLen(area)} ${u2}. Umfang und Winkel hängen von den beiden anderen Seiten ab – dafür wählen Sie „Drei Seiten“.`,
    };
  }

  // Seiten bestimmen
  const a = readPositive('sideA', 'die Seite a', 6);
  if (isErr(a)) return a;
  const b = readPositive('sideB', 'die Seite b', 8);
  if (isErr(b)) return b;

  let c: number;
  let gammaGiven: number | undefined;
  let areaGiven: number | undefined;
  const steps: string[] = [];

  if (given === 'twoSidesAngle') {
    const rawGamma = inputs.angleGamma;
    let gamma = 90;
    if (rawGamma !== undefined) {
      if (rawGamma === null || String(rawGamma).trim() === '') return triangleError('Bitte geben Sie den eingeschlossenen Winkel γ ein.');
      gamma = readNumberInput(rawGamma);
      if (!Number.isFinite(gamma)) return triangleError('Bitte geben Sie für den Winkel γ eine gültige Zahl ein.');
    }
    if (gamma <= 0 || gamma >= 180) {
      return triangleError('Der eingeschlossene Winkel γ muss größer als 0° und kleiner als 180° sein.');
    }
    gammaGiven = gamma;
    const cosG = Math.cos(toRad(gamma));
    const sinG = Math.sin(toRad(gamma));
    const c2 = a * a + b * b - 2 * a * b * cosG;
    c = Math.sqrt(Math.max(0, c2));
    areaGiven = 0.5 * a * b * sinG;
    steps.push(
      `Kosinussatz: c² = a² + b² − 2 · a · b · cos γ = ${fmtLen(a * a)} + ${fmtLen(b * b)} − ${fmtLen(2 * a * b)} · cos ${fmtDeg(gamma)} = ${fmtLen(c2)} → c = ${fmtLen(c)} ${unit}`,
      `Fläche: A = ½ · a · b · sin γ = ½ · ${fmtLen(a)} · ${fmtLen(b)} · sin ${fmtDeg(gamma)} = ${fmtLen(areaGiven)} ${u2}`,
    );
  } else {
    const cc = readPositive('sideC', 'die Seite c', 10);
    if (isErr(cc)) return cc;
    c = cc;
  }

  // Dreiecksungleichung: längste Seite < Summe der beiden anderen
  const [p, q, r] = [a, b, c].sort((x, y) => y - x);
  if (!(q + r > p)) {
    return triangleError(
      `Mit diesen Seitenlängen entsteht kein Dreieck: Die längste Seite (${fmtLen(p)} ${unit}) muss kürzer sein als die Summe der beiden anderen (${fmtLen(r)} + ${fmtLen(q)} = ${fmtLen(q + r)} ${unit}). Diese Regel heißt Dreiecksungleichung.`,
    );
  }

  // Satz des Heron in numerisch stabiler Form (Seiten absteigend sortiert)
  const heronArea = 0.25 * Math.sqrt((p + (q + r)) * (r - (p - q)) * (r + (p - q)) * (p + (q - r)));
  const area = areaGiven ?? heronArea;
  if (!Number.isFinite(area) || !(area > 0)) {
    return triangleError('Die Zahlen sind zu groß oder das Dreieck ist so flach, dass keine sinnvolle Fläche entsteht. Bitte prüfen Sie die Eingaben.');
  }

  const perimeter = a + b + c;
  const s = perimeter / 2;
  const ha = (2 * area) / a;
  const hb = (2 * area) / b;
  const hc = (2 * area) / c;
  const alpha = toDeg(Math.acos(clampCos((b * b + c * c - a * a) / (2 * b * c))));
  let beta: number;
  let gamma: number;
  if (gammaGiven !== undefined) {
    gamma = gammaGiven;
    beta = 180 - alpha - gamma;
  } else {
    beta = toDeg(Math.acos(clampCos((a * a + c * c - b * b) / (2 * a * c))));
    gamma = 180 - alpha - beta;
  }
  const inradius = area / s;
  const circumradius = (a * b * c) / (4 * area);

  if (![perimeter, ha, hb, hc, alpha, beta, gamma, inradius, circumradius].every(Number.isFinite)) {
    return triangleError('Die Zahlen sind zu groß für eine sinnvolle Berechnung. Bitte wählen Sie eine größere Einheit und kleinere Zahlen.');
  }

  // Dreiecksart
  const tol = 1e-9 * p;
  const eq = (x: number, y: number) => Math.abs(x - y) <= tol;
  const sideType = eq(a, b) && eq(b, c)
    ? 'gleichseitig'
    : eq(a, b) || eq(b, c) || eq(a, c)
      ? 'gleichschenklig'
      : 'ungleichseitig';
  const angles = [
    { v: alpha, vertex: 'A' },
    { v: beta, vertex: 'B' },
    { v: gamma, vertex: 'C' },
  ];
  const largest = angles.reduce((m, x) => (x.v > m.v ? x : m), angles[0]);
  let angleType: string;
  if (Math.abs(largest.v - 90) <= 1e-7) angleType = `rechtwinklig (rechter Winkel bei ${largest.vertex})`;
  else if (largest.v > 90) angleType = `stumpfwinklig (stumpfer Winkel bei ${largest.vertex})`;
  else angleType = 'spitzwinklig';
  const typeText = sideType === 'gleichseitig' ? 'gleichseitig (alle Winkel 60°)' : `${angleType}, ${sideType}`;

  if (given === 'threeSides') {
    steps.push(
      `Dreiecksungleichung erfüllt: ${fmtLen(r)} + ${fmtLen(q)} = ${fmtLen(q + r)} > ${fmtLen(p)}`,
      `Halber Umfang: s = (a + b + c) / 2 = (${fmtLen(a)} + ${fmtLen(b)} + ${fmtLen(c)}) / 2 = ${fmtLen(s)} ${unit}`,
      `Satz des Heron: A = √(s · (s − a) · (s − b) · (s − c)) = √(${fmtLen(s)} · ${fmtLen(s - a)} · ${fmtLen(s - b)} · ${fmtLen(s - c)}) = √${fmtLen(s * (s - a) * (s - b) * (s - c))} = ${fmtLen(area)} ${u2}`,
    );
  }
  steps.push(
    `Höhen aus der Fläche (h = 2A / Seite): h_a = ${fmtLen(2 * area)} / ${fmtLen(a)} = ${fmtLen(ha)}; h_b = ${fmtLen(2 * area)} / ${fmtLen(b)} = ${fmtLen(hb)}; h_c = ${fmtLen(2 * area)} / ${fmtLen(c)} = ${fmtLen(hc)} ${unit}`,
    gammaGiven !== undefined
      ? `Winkel: cos α = (b² + c² − a²) / (2 · b · c) → α = ${fmtDeg(alpha)}; β = 180° − α − γ = ${fmtDeg(beta)}`
      : `Winkel (Kosinussatz): cos α = (b² + c² − a²) / (2 · b · c) → α = ${fmtDeg(alpha)}; cos β = (a² + c² − b²) / (2 · a · c) → β = ${fmtDeg(beta)}; γ = 180° − α − β = ${fmtDeg(gamma)}`,
    `Inkreisradius = A / s = ${fmtLen(area)} / ${fmtLen(s)} = ${fmtLen(inradius)} ${unit}; Umkreisradius = a · b · c / (4 · A) = ${fmtLen(circumradius)} ${unit}`,
  );

  const secondary: CalculationResult['secondary'] = [];
  if (given === 'twoSidesAngle') {
    secondary.push({ id: 'sideC', label: 'Seite c (gegenüber γ, Kosinussatz)', value: c, formattedValue: `${fmtLen(c)} ${unit}` });
  }
  secondary.push(
    { id: 'perimeter', label: 'Umfang u = a + b + c', value: perimeter, formattedValue: `${fmtLen(perimeter)} ${unit}` },
    { id: 'ha', label: 'Höhe h_a (auf Seite a)', value: ha, formattedValue: `${fmtLen(ha)} ${unit}` },
    { id: 'hb', label: 'Höhe h_b (auf Seite b)', value: hb, formattedValue: `${fmtLen(hb)} ${unit}` },
    { id: 'hc', label: 'Höhe h_c (auf Seite c)', value: hc, formattedValue: `${fmtLen(hc)} ${unit}` },
    { id: 'alpha', label: 'Winkel α (gegenüber a)', value: alpha, formattedValue: fmtDeg(alpha) },
    { id: 'beta', label: 'Winkel β (gegenüber b)', value: beta, formattedValue: fmtDeg(beta) },
    { id: 'gamma', label: 'Winkel γ (gegenüber c)', value: gamma, formattedValue: fmtDeg(gamma) },
    { id: 'inradius', label: 'Inkreisradius (A / s)', value: inradius, formattedValue: `${fmtLen(inradius)} ${unit}` },
    { id: 'circumradius', label: 'Umkreisradius (a · b · c / 4A)', value: circumradius, formattedValue: `${fmtLen(circumradius)} ${unit}` },
    { id: 'type', label: 'Dreiecksart', value: 0, formattedValue: typeText },
  );

  return {
    primary: { id: 'area', label: 'Flächeninhalt A', value: area, formattedValue: `${fmtLen(area)} ${u2}`, highlight: true },
    secondary,
    calculationSteps: steps,
    summaryText: `Das Dreieck mit a = ${fmtLen(a)} ${unit}, b = ${fmtLen(b)} ${unit} und c = ${fmtLen(c)} ${unit} hat den Flächeninhalt ${fmtLen(area)} ${u2} und den Umfang ${fmtLen(perimeter)} ${unit}. Es ist ${typeText}.`,
  };
}
