/**
 * Engines für
 *  - dezimal-in-bruch-rechner (beide Richtungen: Dezimalzahl → Bruch, Bruch → Dezimalzahl, inkl. Perioden)
 *  - prozentualer-unterschied-rechner (prozentuale Veränderung alt → neu + symmetrischer Unterschied)
 */
import type { CalculationResult, ResultItem } from '@/types/calculator';
import { formatNumber } from '@/lib/formatters';

const MINUS = '−';
const OVERLINE = '̅';
const MAX_DIGITS = 30;
const MAX_INT = 1e12;
const PERIOD_SEARCH_LIMIT = 5000;
const PERIOD_DISPLAY_LIMIT = 60;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function gcdBig(a: bigint, b: bigint): bigint {
  let x = a < BigInt(0) ? -a : a;
  let y = b < BigInt(0) ? -b : b;
  while (y !== BigInt(0)) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function gcdNum(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

/** Groups an integer digit string with German thousands separators (1234567 → 1.234.567). */
function groupDigits(intDigits: string): string {
  return intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function signPrefix(negative: boolean): string {
  return negative ? MINUS : '';
}

/** Parses a number-like input (number or string with comma or dot). Returns NaN if invalid/empty. */
export function parseLooseNumber(raw: unknown): number {
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : NaN;
  if (raw === undefined || raw === null) return NaN;
  const s = String(raw).trim().replace(/\s/g, '').replace('−', '-').replace(',', '.');
  if (s === '' || !/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(s)) return NaN;
  return parseFloat(s);
}

function parseInteger(raw: unknown): number | null {
  const n = parseLooseNumber(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return null;
  return n;
}

// ---------------------------------------------------------------------------
// Bruch → Dezimalzahl (lange Division mit Periodenerkennung)
// ---------------------------------------------------------------------------

export interface DecimalExpansion {
  negative: boolean;
  integerPart: string;
  preperiod: string;
  period: string;
  /** true, wenn die Periode innerhalb des Suchlimits nicht gefunden wurde */
  periodTooLong: boolean;
}

/** Long division of |p| / q (q > 0) with detection of the repeating block. */
export function expandFraction(p: number, q: number): DecimalExpansion {
  const negative = p < 0;
  const absP = Math.abs(p);
  const integerPart = String(Math.floor(absP / q));
  let r = absP % q;
  const digits: number[] = [];
  const seen = new Map<number, number>();
  let periodStart = -1;
  while (r !== 0 && digits.length < PERIOD_SEARCH_LIMIT) {
    const prev = seen.get(r);
    if (prev !== undefined) {
      periodStart = prev;
      break;
    }
    seen.set(r, digits.length);
    r *= 10;
    digits.push(Math.floor(r / q));
    r %= q;
  }
  const digitStr = digits.join('');
  if (r === 0) {
    return { negative: negative && absP !== 0, integerPart, preperiod: digitStr, period: '', periodTooLong: false };
  }
  if (periodStart === -1) {
    return { negative, integerPart, preperiod: digitStr, period: '', periodTooLong: true };
  }
  return {
    negative,
    integerPart,
    preperiod: digitStr.slice(0, periodStart),
    period: digitStr.slice(periodStart),
    periodTooLong: false,
  };
}

function formatExpansion(exp: DecimalExpansion, style: 'overline' | 'parens'): string {
  const intPart = groupDigits(exp.integerPart);
  const sign = signPrefix(exp.negative);
  if (!exp.preperiod && !exp.period) return `${sign}${intPart}`;
  if (!exp.period) return `${sign}${intPart},${exp.preperiod}`;
  const periodStr = style === 'overline'
    ? exp.period.split('').map((d) => d + OVERLINE).join('')
    : `(${exp.period})`;
  return `${sign}${intPart},${exp.preperiod}${periodStr}`;
}

function formatMixed(negative: boolean, p: number, q: number): string | null {
  const absP = Math.abs(p);
  if (q === 1 || absP < q) return null;
  const whole = Math.floor(absP / q);
  const rest = absP % q;
  if (rest === 0) return null;
  return `${signPrefix(negative)}${formatNumber(whole, 0)} ${rest}/${q}`;
}

function onlyTwoAndFive(q: number): boolean {
  let n = q;
  while (n % 2 === 0) n /= 2;
  while (n % 5 === 0) n /= 5;
  return n === 1;
}

function errorResult(label: string, message: string): CalculationResult {
  return { primary: { id: 'error', label, value: 0, formattedValue: '–' }, error: message };
}

function calculateFractionToDecimal(inputs: Record<string, any>): CalculationResult {
  const label = 'Dezimalzahl';
  const wholeRaw = inputs.wholeNumber;
  const whole = wholeRaw === undefined || wholeRaw === null || String(wholeRaw).trim() === '' ? 0 : parseInteger(wholeRaw);
  const num = parseInteger(inputs.numerator);
  const den = parseInteger(inputs.denominator);

  if (whole === null) return errorResult(label, 'Die ganze Zahl muss eine ganze Zahl sein (z. B. 2 für 2 1/4).');
  if (num === null || den === null) {
    return errorResult(label, 'Bitte geben Sie Zähler und Nenner als ganze Zahlen ein (z. B. 3 und 4).');
  }
  if (den === 0) return errorResult(label, 'Der Nenner darf nicht 0 sein – durch 0 kann man nicht teilen.');
  if (Math.abs(whole) > MAX_INT || Math.abs(num) > MAX_INT || Math.abs(den) > MAX_INT) {
    return errorResult(label, 'Bitte verwenden Sie Zahlen bis höchstens 1.000.000.000.000.');
  }
  if (whole !== 0 && (num < 0 || den < 0)) {
    return errorResult(label, 'Bei gemischten Zahlen setzen Sie das Minuszeichen bitte nur vor die ganze Zahl (z. B. −2 und 1/4).');
  }

  // Improper fraction P/Q with Q > 0
  let P: number;
  let Q = Math.abs(den);
  if (whole !== 0) {
    P = Math.sign(whole) * (Math.abs(whole) * Q + num);
  } else {
    P = den < 0 ? -num : num;
  }
  P = P || 0; // normalise −0
  if (!Number.isSafeInteger(P)) return errorResult(label, 'Die Zahl ist zu groß für eine exakte Berechnung.');

  const g = gcdNum(P, Q) || 1;
  const p = P / g;
  const q = Q / g;
  const value = p / q;
  const negative = p < 0;

  const exp = expandFraction(p, q);
  const isPeriodic = exp.period.length > 0 || exp.periodTooLong;
  const tooLongToShow = exp.periodTooLong || exp.preperiod.length + exp.period.length > PERIOD_DISPLAY_LIMIT;
  const rounded = `${negative ? MINUS : ''}${formatNumber(Math.abs(value), 10)}`;

  const inputFraction = whole !== 0 ? `${signPrefix(whole < 0)}${formatNumber(Math.abs(whole), 0)} ${num}/${Q}` : `${P < 0 ? MINUS : ''}${Math.abs(num)}/${Q}`;
  const reduced = `${signPrefix(negative)}${Math.abs(p)}/${q}`;
  const mixed = formatMixed(negative, p, q);

  const primaryText = tooLongToShow ? `≈ ${rounded} …` : formatExpansion(exp, 'overline');
  const parensText = tooLongToShow ? '' : formatExpansion(exp, 'parens');

  let typeText: string;
  if (!isPeriodic) {
    typeText = q === 1 ? 'Ganze Zahl' : 'Endliche Dezimalzahl (Nenner nur aus 2 und 5)';
  } else if (exp.periodTooLong) {
    typeText = `Periodisch, Periode länger als ${formatNumber(PERIOD_SEARCH_LIMIT, 0)} Stellen`;
  } else {
    typeText = `Periodisch, Periode „${exp.period.length > 12 ? exp.period.slice(0, 12) + '…' : exp.period}“ (${exp.period.length} ${exp.period.length === 1 ? 'Stelle' : 'Stellen'})${exp.preperiod ? `, Vorperiode „${exp.preperiod}“` : ''}`;
  }

  const secondary: ResultItem[] = [];
  if (isPeriodic) {
    secondary.push({ id: 'rounded', label: 'Gerundet (10 Nachkommastellen)', value, formattedValue: rounded });
  }
  if (parensText && isPeriodic) {
    secondary.push({ id: 'periodNotation', label: 'Schreibweise mit Klammer', value: parensText, formattedValue: parensText });
  }
  secondary.push({ id: 'type', label: 'Art der Dezimalzahl', value: isPeriodic ? 1 : 0, formattedValue: typeText });
  secondary.push({ id: 'pct', label: 'In Prozent', value: value * 100, formattedValue: `${negative ? MINUS : ''}${formatNumber(Math.abs(value * 100), 4)} %` });
  secondary.push({
    id: 'fraction',
    label: g > 1 ? 'Gekürzter Bruch' : 'Bruch',
    value: reduced,
    formattedValue: mixed ? `${reduced} = ${mixed}` : reduced,
    helpText: g > 1 ? `Gekürzt mit ${formatNumber(g, 0)}.` : undefined,
  });

  const steps = [
    whole !== 0
      ? `Gemischte Zahl umwandeln: ${inputFraction} = ${signPrefix(P < 0)}(${formatNumber(Math.abs(whole), 0)} × ${Q} + ${num}) / ${Q} = ${signPrefix(P < 0)}${Math.abs(P)}/${Q}.`
      : `Bruch: ${inputFraction}.`,
    g > 1 ? `Kürzen mit ggT ${formatNumber(g, 0)}: ${reduced}.` : 'Der Bruch ist bereits vollständig gekürzt.',
    `Division: ${Math.abs(p)} ÷ ${q} = ${tooLongToShow ? rounded.replace(MINUS, '') + ' …' : formatExpansion({ ...exp, negative: false }, 'parens')}.`,
  ];
  if (isPeriodic && !exp.periodTooLong) {
    steps.push(`Der Rest wiederholt sich, deshalb wiederholen sich ab hier auch die Ziffern ${exp.period.length > 12 ? exp.period.slice(0, 12) + '…' : exp.period}.`);
  }

  const summaryText = isPeriodic
    ? `${inputFraction} ergibt die periodische Dezimalzahl ${tooLongToShow ? rounded + ' …' : parensText} (gerundet ${rounded}).`
    : `${inputFraction} ergibt genau ${primaryText}.`;

  return {
    primary: { id: 'decimal', label: 'Dezimalzahl', value, formattedValue: primaryText, highlight: true },
    secondary,
    calculationSteps: steps,
    summaryText,
  };
}

// ---------------------------------------------------------------------------
// Dezimalzahl → Bruch (endlich und periodisch)
// ---------------------------------------------------------------------------

export interface ParsedDecimal {
  negative: boolean;
  integerDigits: string;
  preperiod: string;
  period: string;
  /** Periode wurde aus "…" am Ende erkannt */
  periodDetected: boolean;
}

/**
 * Parses "0,75", "-1.25", "0,(3)", "0,1(6)", "0,1666…", "2,142857142857..." into its parts.
 * Returns an error message string if the input cannot be read.
 */
export function parseDecimalInput(raw: unknown): ParsedDecimal | string {
  if (raw === undefined || raw === null || String(raw).trim() === '') {
    return 'Bitte geben Sie eine Dezimalzahl ein (z. B. 0,75).';
  }
  let s = String(raw).trim().replace(/\s/g, '').replace(/[−–]/g, '-');
  let negative = false;
  if (s.startsWith('-') || s.startsWith('+')) {
    negative = s.startsWith('-');
    s = s.slice(1);
  }
  let ellipsis = false;
  if (s.endsWith('…')) {
    ellipsis = true;
    s = s.slice(0, -1);
  } else if (s.endsWith('...')) {
    ellipsis = true;
    s = s.slice(0, -3);
  }
  // Thousands separators: with both "." and "," the dot groups thousands (1.234,5).
  if (s.includes(',') && s.includes('.')) {
    s = s.replace(/\./g, '');
  }
  s = s.replace(',', '.');

  const m = /^(\d*)(?:\.(\d*)(?:\((\d+)\))?)?$/.exec(s);
  if (!m || (!m[1] && !m[2] && !m[3])) {
    return 'Die Eingabe ist keine gültige Dezimalzahl. Beispiele: 0,75 · −1,25 · 0,(3) für 0,333…';
  }
  const integerDigits = (m[1] || '0').replace(/^0+(?=\d)/, '');
  let preperiod = m[2] || '';
  let period = m[3] || '';
  let periodDetected = false;

  if (period && ellipsis) {
    // "0,(3)..." – Klammer hat Vorrang
    ellipsis = false;
  }
  if (ellipsis) {
    const digits = preperiod;
    let found = false;
    for (let p = 1; p <= Math.floor(digits.length / 2); p++) {
      let run = 0;
      for (let i = digits.length - 1; i - p >= 0 && digits[i] === digits[i - p]; i--) run++;
      if (run >= p) {
        const start = digits.length - run - p;
        preperiod = digits.slice(0, start);
        period = digits.slice(start, start + p);
        found = true;
        periodDetected = true;
        break;
      }
    }
    if (!found) {
      return 'Die Periode ist nicht eindeutig. Schreiben Sie sie in Klammern, z. B. 0,(3) für 0,333… oder 0,1(6) für 0,1666…';
    }
  }

  if (/^0+$/.test(period)) {
    period = '';
  }
  if (integerDigits.length + preperiod.length + period.length > MAX_DIGITS) {
    return `Bitte geben Sie höchstens ${MAX_DIGITS} Ziffern ein.`;
  }
  return { negative, integerDigits, preperiod, period, periodDetected };
}

function calculateDecimalToFraction(inputs: Record<string, any>): CalculationResult {
  const label = 'Bruch';
  const raw = inputs.decimalVal;
  const parsed = parseDecimalInput(typeof raw === 'number' ? String(raw) : raw);
  if (typeof parsed === 'string') return errorResult(label, parsed);

  const { integerDigits, preperiod, period } = parsed;
  const ten = BigInt(10);
  const zero = BigInt(0);
  const one = BigInt(1);

  let N: bigint;
  let D: bigint;
  let all = zero;
  let head = zero;
  if (period) {
    all = BigInt(integerDigits + preperiod + period);
    head = BigInt(integerDigits + preperiod);
    N = all - head;
    D = ten ** BigInt(preperiod.length) * (ten ** BigInt(period.length) - one);
  } else {
    N = BigInt(integerDigits + preperiod);
    D = ten ** BigInt(preperiod.length);
  }

  const isZero = N === zero;
  const negative = parsed.negative && !isZero;
  const g = isZero ? D : gcdBig(N, D);
  const p = N / g;
  const q = D / g;
  const value = (negative ? -1 : 1) * (Number(N) / Number(D));

  const sign = signPrefix(negative);
  const reduced = q === one ? `${sign}${p.toString()}` : `${sign}${p.toString()}/${q.toString()}`;

  const decimalNormalized = `${sign}${groupDigits(integerDigits)}${preperiod || period ? ',' : ''}${preperiod}${period ? `(${period})` : ''}`;
  const unreduced = `${sign}${N.toString()}/${D.toString()}`;

  const secondary: ResultItem[] = [];
  if (q !== one && p > q) {
    const whole = p / q;
    const rest = p % q;
    secondary.push({ id: 'mixed', label: 'Gemischte Zahl', value: `${sign}${whole} ${rest}/${q}`, formattedValue: `${sign}${groupDigits(whole.toString())} ${rest.toString()}/${q.toString()}` });
  }
  secondary.push({
    id: 'unreduced',
    label: 'Bruch vor dem Kürzen',
    value: unreduced,
    formattedValue: unreduced,
    helpText: g > one ? `Gekürzt mit ggT ${g.toString()}.` : 'Nicht weiter kürzbar.',
  });
  secondary.push({ id: 'pct', label: 'In Prozent', value: value * 100, formattedValue: `${negative ? MINUS : ''}${formatNumber(Math.abs(value * 100), 4)} %` });
  if (period) {
    const overline = `${sign}${groupDigits(integerDigits)},${preperiod}${period.split('').map((d) => d + OVERLINE).join('')}`;
    secondary.push({ id: 'periodic', label: 'Periodische Dezimalzahl', value: decimalNormalized, formattedValue: overline, helpText: `Periode ${period}${preperiod ? `, Vorperiode ${preperiod}` : ''}.` });
  }

  const steps: string[] = [];
  if (period) {
    const a = preperiod.length;
    const b = period.length;
    steps.push(`Periode erkannt: ${decimalNormalized} (Vorperiode ${a} ${a === 1 ? 'Stelle' : 'Stellen'}, Periode ${b} ${b === 1 ? 'Stelle' : 'Stellen'}).`);
    steps.push(`Formel: (${all.toString()} − ${head.toString()}) / (${a > 0 ? `10^${a} × ` : ''}${'9'.repeat(b)}) = ${N.toString()}/${D.toString()}.`);
  } else if (preperiod) {
    steps.push(`${preperiod.length} Nachkommastellen → Nenner 10^${preperiod.length} = ${D.toString()}: ${N.toString()}/${D.toString()}.`);
  } else {
    steps.push('Ganze Zahl ohne Nachkommastellen → Nenner 1.');
  }
  steps.push(g > one ? `Kürzen mit ggT ${g.toString()}: ${reduced}.` : `Der Bruch ${reduced} ist bereits vollständig gekürzt.`);

  let summaryText = `${decimalNormalized} entspricht dem Bruch ${reduced}.`;
  if (period && /^9+$/.test(period)) {
    summaryText += ` Eine Periode aus Neunen ist genau die nächste Endziffer: ${decimalNormalized} = ${reduced}.`;
  }
  if (parsed.periodDetected) {
    summaryText += ` Die Periode „${period}“ wurde aus den Auslassungspunkten abgeleitet.`;
  }

  return {
    primary: { id: 'fraction', label: g > one ? 'Gekürzter Bruch' : 'Bruch', value, formattedValue: reduced, highlight: true },
    secondary,
    calculationSteps: steps,
    summaryText,
  };
}

/**
 * Dezimalzahl ↔ Bruch. `direction`: 'dec2frac' (Standard) oder 'frac2dec'.
 */
export function calculateDezimalBruch(inputs: Record<string, any>): CalculationResult {
  return inputs.direction === 'frac2dec' ? calculateFractionToDecimal(inputs) : calculateDecimalToFraction(inputs);
}

// ---------------------------------------------------------------------------
// Prozentuale Veränderung & prozentualer Unterschied
// ---------------------------------------------------------------------------

function formatSignedPercent(v: number): string {
  if (v === 0) return '0 %';
  return `${v > 0 ? '+' : MINUS}${formatNumber(Math.abs(v), 2)} %`;
}

function formatSigned(v: number, suffix = ''): string {
  if (v === 0) return `0${suffix}`;
  return `${v > 0 ? '+' : MINUS}${formatNumber(Math.abs(v), 4)}${suffix}`;
}

function fmt(v: number): string {
  return `${v < 0 ? MINUS : ''}${formatNumber(Math.abs(v), 4)}`;
}

/**
 * mode 'change' (Standard): primär die prozentuale Veränderung von A (alt) zu B (neu).
 * mode 'difference': primär der symmetrische prozentuale Unterschied |A − B| / ((|A| + |B|) / 2).
 * arePercentages: Werte sind selbst Prozentsätze → Differenz zusätzlich in Prozentpunkten.
 */
export function calculateProzentVergleich(inputs: Record<string, any>): CalculationResult {
  const mode = inputs.mode === 'difference' ? 'difference' : 'change';
  const arePercentages = inputs.arePercentages === true || inputs.arePercentages === 'true';
  const a = parseLooseNumber(inputs.valA);
  const b = parseLooseNumber(inputs.valB);

  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return errorResult('Ergebnis', 'Bitte geben Sie zwei gültige Zahlen ein (z. B. 80 und 100).');
  }

  const absDiff = b - a;
  const changeDefined = a !== 0;
  const change = changeDefined ? (absDiff / Math.abs(a)) * 100 : a === b ? 0 : NaN;
  const reverseDefined = b !== 0;
  const reverse = reverseDefined ? ((a - b) / Math.abs(b)) * 100 : a === b ? 0 : NaN;
  const meanAbs = (Math.abs(a) + Math.abs(b)) / 2;
  const symmetric = meanAbs === 0 ? 0 : (Math.abs(absDiff) / meanAbs) * 100;
  const mixedSigns = (a < 0 && b > 0) || (a > 0 && b < 0);
  const unitSuffix = arePercentages ? ' %' : '';
  const aText = `${fmt(a)}${unitSuffix}`;
  const bText = `${fmt(b)}${unitSuffix}`;

  const changeText = Number.isFinite(change) ? formatSignedPercent(change) : 'nicht definiert';
  const reverseText = Number.isFinite(reverse) ? formatSignedPercent(reverse) : 'nicht definiert';
  const symmetricText = `${formatNumber(symmetric, 2)} %`;
  const direction = absDiff > 0 ? 'Steigerung' : absDiff < 0 ? 'Abnahme' : 'keine Veränderung';

  const changeItem: ResultItem = {
    id: 'change',
    label: 'Prozentuale Veränderung (alt → neu)',
    value: Number.isFinite(change) ? change : 'nicht definiert',
    formattedValue: changeText,
    helpText: changeDefined ? 'Bezugsgröße ist der alte Wert. Richtung zählt.' : 'Vom Ausgangswert 0 aus ist keine prozentuale Veränderung definiert (Division durch 0).',
  };
  const symmetricItem: ResultItem = {
    id: 'symmetric',
    label: 'Prozentualer Unterschied (symmetrisch)',
    value: symmetric,
    formattedValue: symmetricText,
    helpText: 'Bezugsgröße ist der Mittelwert beider Beträge. Reihenfolge egal.',
  };

  const secondary: ResultItem[] = [mode === 'change' ? symmetricItem : changeItem];
  if (arePercentages) {
    secondary.push({
      id: 'points',
      label: 'Differenz in Prozentpunkten',
      value: absDiff,
      formattedValue: `${formatSigned(absDiff)} ${Math.abs(absDiff) === 1 ? 'Prozentpunkt' : 'Prozentpunkte'}`,
      helpText: 'Absolute Differenz zweier Prozentsätze. Nicht mit der relativen Veränderung in % verwechseln.',
    });
  } else {
    secondary.push({ id: 'absDiff', label: 'Absolute Differenz (neu − alt)', value: absDiff, formattedValue: formatSigned(absDiff) });
  }
  if (changeDefined) {
    const factor = b / a;
    secondary.push({
      id: 'factor',
      label: 'Änderungsfaktor',
      value: factor,
      formattedValue: `${fmt(factor)} ×`,
      helpText: `Der neue Wert beträgt ${formatNumber((b / Math.abs(a)) * 100, 2)} % des alten.`,
    });
  }
  secondary.push({
    id: 'reverse',
    label: 'Rückweg (neu → alt)',
    value: Number.isFinite(reverse) ? reverse : 'nicht definiert',
    formattedValue: reverseText,
    helpText: 'Gleiche Differenz, andere Basis: deshalb ein anderer Prozentwert.',
  });

  const sentences: string[] = [];
  if (!changeDefined && a !== b) {
    sentences.push(`Von ${aText} auf ${bText}: Eine prozentuale Veränderung lässt sich vom Ausgangswert 0 aus nicht berechnen, weil durch 0 geteilt würde. Die absolute ${absDiff > 0 ? 'Zunahme' : 'Abnahme'} beträgt ${formatSigned(absDiff)}${arePercentages ? ' Prozentpunkte' : ''}.`);
  } else if (a === b) {
    sentences.push(`Beide Werte sind gleich (${aText}): keine Veränderung, 0 % Unterschied.`);
  } else if (mode === 'change') {
    sentences.push(`Von ${aText} auf ${bText} ergibt sich eine ${direction} um ${formatNumber(Math.abs(change), 2)} %.`);
    sentences.push(`Der symmetrische Unterschied beträgt ${symmetricText}.`);
  } else {
    sentences.push(`Zwischen ${aText} und ${bText} besteht ein prozentualer Unterschied von ${symmetricText}.`);
    sentences.push(`Als Veränderung von A nach B sind es ${changeText}, von B nach A ${reverseText}.`);
  }
  if (arePercentages && a !== b) {
    sentences.push(`In Prozentpunkten: ${formatSigned(absDiff)} ${Math.abs(absDiff) === 1 ? 'Prozentpunkt' : 'Prozentpunkte'}.`);
  }
  if (mixedSigns) {
    sentences.push('Hinweis: Die Werte haben unterschiedliche Vorzeichen. Prozentangaben sind hier nur eingeschränkt aussagekräftig.');
  }

  const primary: ResultItem = mode === 'change'
    ? {
        id: 'change',
        label: !changeDefined && a !== b ? 'Prozentuale Veränderung' : absDiff > 0 ? 'Prozentuale Steigerung' : absDiff < 0 ? 'Prozentuale Abnahme' : 'Prozentuale Veränderung',
        value: Number.isFinite(change) ? change : 'nicht definiert',
        formattedValue: changeText,
        highlight: true,
        helpText: arePercentages && a !== b
          ? `Relative Veränderung. Absolut sind es ${formatSigned(absDiff)} ${Math.abs(absDiff) === 1 ? 'Prozentpunkt' : 'Prozentpunkte'}.`
          : undefined,
      }
    : { ...symmetricItem, highlight: true, helpText: undefined };

  const steps: string[] = [`Differenz: ${fmt(b)} − ${fmt(a)} = ${formatSigned(absDiff)}.`];
  if (changeDefined) {
    steps.push(`Veränderung: ${formatSigned(absDiff)} ÷ ${formatNumber(Math.abs(a), 4)} × 100 = ${changeText}.`);
  }
  steps.push(`Unterschied: |${formatSigned(absDiff)}| ÷ ((${formatNumber(Math.abs(a), 4)} + ${formatNumber(Math.abs(b), 4)}) ÷ 2) × 100 = ${symmetricText}.`);

  return {
    primary,
    secondary,
    calculationSteps: steps,
    summaryText: sentences.join(' '),
  };
}
