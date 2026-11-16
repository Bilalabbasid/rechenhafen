import { CalculationResult, ResultItem } from '@/types/calculator';
import { formatNumber } from '@/lib/formatters';

function readNumber(raw: unknown): number | null {
  if (raw === undefined || raw === null || raw === '') return null;
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
  const n = parseFloat(String(raw).trim().replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

/** Up to 4 decimals, no trailing zeros, no "-0". */
export function fmt(x: number): string {
  const r = Math.round(x * 1e4) / 1e4;
  return formatNumber(Object.is(r, -0) ? 0 : r, 4);
}

/** Signed term for formulas: "+ 3" / "− 3". */
function signed(x: number): string {
  return x < 0 ? `− ${fmt(-x)}` : `+ ${fmt(x)}`;
}

/** Signed x-term without a redundant 1: "+ x" / "− x" / "+ 3x". */
function signedX(x: number): string {
  if (x === 1) return '+ x';
  if (x === -1) return '− x';
  return `${signed(x)}x`;
}

/** Leading x²-term without a redundant 1: "x²" / "−x²" / "3x²". */
function leadX2(a: number): string {
  if (a === 1) return 'x²';
  if (a === -1) return '−x²';
  return `${fmt(a)}x²`;
}

/**
 * pq-Formel: x² + px + q = 0  →  x₁,₂ = −p/2 ± √((p/2)² − q)
 * Mode 'abc' normalises ax² + bx + c = 0 by dividing through a.
 */
export function calculatePqFormel(inputs: Record<string, any>): CalculationResult {
  const mode = inputs.mode === 'abc' ? 'abc' : 'pq';
  const fail = (error: string): CalculationResult => ({
    primary: { id: 'solutions', label: 'Lösungen', value: 0, formattedValue: '-' },
    error,
  });

  let a = 1;
  let p: number;
  let q: number;
  let equation: string;
  const steps: string[] = [];

  if (mode === 'abc') {
    const ra = readNumber(inputs.a);
    const rb = readNumber(inputs.b);
    const rc = readNumber(inputs.c);
    if (ra === null || rb === null || rc === null) return fail('Bitte geben Sie a, b und c ein (0 ist für b und c erlaubt).');
    if (ra === 0) return fail('a darf nicht 0 sein – sonst ist die Gleichung nicht quadratisch, sondern linear.');
    a = ra;
    p = rb / ra;
    q = rc / ra;
    equation = `${leadX2(ra)} ${signedX(rb)} ${signed(rc)} = 0`;
    steps.push(`Normalform herstellen: durch a = ${fmt(ra)} teilen → x² ${signedX(p)} ${signed(q)} = 0`);
  } else {
    const rp = readNumber(inputs.p);
    const rq = readNumber(inputs.q);
    if (rp === null || rq === null) return fail('Bitte geben Sie p und q ein (0 ist erlaubt).');
    p = rp;
    q = rq;
    equation = `x² ${signedX(p)} ${signed(q)} = 0`;
  }

  const half = -p / 2;
  const D = (p / 2) ** 2 - q; // Diskriminante der Normalform
  const scale = Math.max(1, (p / 2) ** 2, Math.abs(q));
  const isZero = Math.abs(D) < 1e-12 * scale;

  steps.push(`p = ${fmt(p)}, q = ${fmt(q)}`);
  steps.push(`Diskriminante: D = (p/2)² − q = (${fmt(p / 2)})² − (${fmt(q)}) = ${fmt(D)}`);

  // Scheitelpunkt der Parabel y = a·x² + b·x + c
  const vertexY = -a * D;
  const vertex = `S(${fmt(half)} | ${fmt(vertexY)})`;
  const secondary: ResultItem[] = [
    { id: 'discriminant', label: 'Diskriminante D = (p/2)² − q', value: D, formattedValue: fmt(D) },
    { id: 'pq', label: 'p und q (Normalform)', value: `${fmt(p)}; ${fmt(q)}`, formattedValue: `p = ${fmt(p)}, q = ${fmt(q)}` },
    { id: 'vertex', label: 'Scheitelpunkt der Parabel', value: vertex, formattedValue: vertex },
  ];

  if (isZero) {
    steps.push(`D = 0 → genau eine (doppelte) Lösung: x = −p/2 = ${fmt(half)}`);
    secondary.push({ id: 'factor', label: 'Faktorisierte Form', value: '', formattedValue: `${a === 1 ? '' : fmt(a) + ' · '}(x ${signed(-half)})²` });
    return {
      primary: { id: 'solutions', label: 'Lösung (doppelte Nullstelle)', value: half, formattedValue: `x = ${fmt(half)}`, highlight: true },
      secondary,
      calculationSteps: steps,
      summaryText: `Die Gleichung ${equation} hat genau eine Lösung: x = ${fmt(half)} (doppelte Nullstelle, D = 0).`,
    };
  }

  if (D < 0) {
    const im = Math.sqrt(-D);
    steps.push(`D < 0 → keine reelle Lösung, die Parabel schneidet die x-Achse nicht.`);
    secondary.push({ id: 'complex', label: 'Komplexe Lösungen', value: '', formattedValue: `x = ${fmt(half)} ± ${fmt(im)}i` });
    return {
      primary: { id: 'solutions', label: 'Lösungen', value: 'keine', formattedValue: 'Keine reelle Lösung', highlight: true },
      secondary,
      calculationSteps: steps,
      summaryText: `Die Gleichung ${equation} hat keine reelle Lösung, weil die Diskriminante negativ ist (D = ${fmt(D)}). Komplex: x = ${fmt(half)} ± ${fmt(im)}i.`,
    };
  }

  const root = Math.sqrt(D);
  const x1 = half + root;
  const x2 = half - root;
  steps.push(`x₁,₂ = −p/2 ± √D = ${fmt(half)} ± √${fmt(D)} = ${fmt(half)} ± ${fmt(root)}`);
  steps.push(`x₁ = ${fmt(x1)}, x₂ = ${fmt(x2)}`);
  steps.push(`Probe (Satz von Vieta): x₁ + x₂ = ${fmt(x1 + x2)} = −p, x₁ · x₂ = ${fmt(x1 * x2)} = q`);
  secondary.push({ id: 'factor', label: 'Faktorisierte Form', value: '', formattedValue: `${a === 1 ? '' : fmt(a) + ' · '}(x ${signed(-x1)}) · (x ${signed(-x2)})` });

  return {
    primary: { id: 'solutions', label: 'Lösungen', value: x1, formattedValue: `x₁ = ${fmt(x1)}   x₂ = ${fmt(x2)}`, highlight: true },
    secondary: [
      { id: 'x1', label: 'x₁', value: x1, formattedValue: fmt(x1) },
      { id: 'x2', label: 'x₂', value: x2, formattedValue: fmt(x2) },
      ...secondary,
    ],
    calculationSteps: steps,
    summaryText: `Die Gleichung ${equation} hat zwei Lösungen: x₁ = ${fmt(x1)} und x₂ = ${fmt(x2)} (D = ${fmt(D)}).`,
  };
}
