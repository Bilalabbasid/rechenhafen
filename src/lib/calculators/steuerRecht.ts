import { CalculationResult, ResultItem } from '@/types/calculator';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { getTaxConfig } from '@/data/regulated/tax';
import { computeEStSingle, computeSolZ } from '@/lib/calculators/steuernGehalt';

function readNumber(raw: unknown): number | null {
  if (raw === undefined || raw === null || raw === '') return null;
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
  const n = parseFloat(String(raw).trim().replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

const round2 = (x: number) => Math.round(x * 100) / 100;

// ---------------------------------------------------------------------------
// Pfändungsrechner (§ 850c ZPO)
// ---------------------------------------------------------------------------

/**
 * Monatliche Pfändungsfreigrenzen nach § 850c ZPO, bekannt gemacht im Bundesgesetzblatt
 * (Pfändungsfreigrenzenbekanntmachung). Sie ändern sich jedes Jahr zum 1. Juli.
 */
export const PFAENDUNGSFREIGRENZEN = {
  '2026': {
    label: 'ab 1. Juli 2026',
    validFrom: '2026-07-01',
    grundbetrag: 1587.4,
    ersteUnterhaltspflicht: 597.42,
    weitereUnterhaltspflicht: 332.83,
    vollPfaendbarAb: 4866.3,
  },
  '2025': {
    label: '1. Juli 2025 bis 30. Juni 2026',
    validFrom: '2025-07-01',
    grundbetrag: 1555.0,
    ersteUnterhaltspflicht: 585.23,
    weitereUnterhaltspflicht: 326.04,
    vollPfaendbarAb: 4766.99,
  },
} as const;

/** Pfändbarer Anteil des Mehrbetrags je Zahl der Unterhaltspflichten (§ 850c Abs. 3 ZPO). */
const PFAENDBARER_ANTEIL = [0.7, 0.5, 0.4, 0.3, 0.2, 0.1];

export function pfaendungsFreibetrag(period: keyof typeof PFAENDUNGSFREIGRENZEN, dependents: number): number {
  const t = PFAENDUNGSFREIGRENZEN[period];
  const n = Math.min(Math.max(0, Math.floor(dependents)), 5);
  return round2(t.grundbetrag + (n >= 1 ? t.ersteUnterhaltspflicht : 0) + Math.max(0, n - 1) * t.weitereUnterhaltspflicht);
}

export function calculatePfaendung(inputs: Record<string, any>): CalculationResult {
  const period: keyof typeof PFAENDUNGSFREIGRENZEN = inputs.period === '2025' ? '2025' : '2026';
  const t = PFAENDUNGSFREIGRENZEN[period];
  const net = readNumber(inputs.netIncome);
  const dependentsRaw = readNumber(inputs.dependents) ?? 0;
  const fail = (error: string): CalculationResult => ({
    primary: { id: 'pfaendbar', label: 'Pfändbarer Betrag', value: 0, formattedValue: '-' },
    error,
  });

  if (net === null) return fail('Bitte geben Sie Ihr monatliches Nettoeinkommen ein.');
  if (net < 0) return fail('Das Nettoeinkommen darf nicht negativ sein.');
  if (dependentsRaw < 0) return fail('Die Zahl der Unterhaltspflichten darf nicht negativ sein.');

  const n = Math.min(Math.floor(dependentsRaw), 5);
  const freibetrag = pfaendungsFreibetrag(period, n);
  const share = PFAENDBARER_ANTEIL[n];

  // Bis zur Vollpfändungsgrenze: Einkommen auf volle 10 € abrunden, vom Mehrbetrag über dem Freibetrag ist der Anteil pfändbar.
  const capped = Math.min(net, t.vollPfaendbarAb);
  const rounded = Math.floor(capped / 10) * 10;
  const partBelowCap = rounded > freibetrag ? round2((rounded - freibetrag) * share) : 0;
  // Was über der Vollpfändungsgrenze liegt, ist voll pfändbar.
  const overCap = net > t.vollPfaendbarAb ? round2(net - t.vollPfaendbarAb) : 0;
  const pfaendbar = round2(partBelowCap + overCap);
  const unpfaendbar = round2(net - pfaendbar);

  const secondary: ResultItem[] = [
    { id: 'unpfaendbar', label: 'Bleibt Ihnen (unpfändbar)', value: unpfaendbar, formattedValue: formatCurrency(unpfaendbar) },
    { id: 'freibetrag', label: `Pfändungsfreigrenze bei ${n} Unterhaltspflicht${n === 1 ? '' : 'en'}`, value: freibetrag, formattedValue: formatCurrency(freibetrag) },
    { id: 'anteil', label: 'Davon pfändbar: Anteil des Mehrbetrags', value: share * 100, formattedValue: formatPercent(share * 100, 0) },
    { id: 'vollPfaendbarAb', label: 'Voll pfändbar ist Einkommen über', value: t.vollPfaendbarAb, formattedValue: formatCurrency(t.vollPfaendbarAb) },
  ];
  if (overCap > 0) {
    secondary.push({ id: 'overCap', label: 'Davon voll pfändbarer Teil über der Grenze', value: overCap, formattedValue: formatCurrency(overCap) });
  }

  const summaryText =
    pfaendbar === 0
      ? `Bei ${formatCurrency(net)} netto und ${n} Unterhaltspflicht${n === 1 ? '' : 'en'} ist nichts pfändbar (Freigrenze ${formatCurrency(freibetrag)}, Werte ${t.label}).`
      : `Bei ${formatCurrency(net)} netto und ${n} Unterhaltspflicht${n === 1 ? '' : 'en'} sind ${formatCurrency(pfaendbar)} im Monat pfändbar. Ihnen bleiben ${formatCurrency(unpfaendbar)} (Werte ${t.label}).`;

  return {
    primary: { id: 'pfaendbar', label: 'Pfändbarer Betrag pro Monat', value: pfaendbar, formattedValue: formatCurrency(pfaendbar), highlight: true },
    secondary,
    summaryText,
  };
}

// ---------------------------------------------------------------------------
// Ehegattensplitting (§ 32a Abs. 5 EStG)
// ---------------------------------------------------------------------------

export function calculateSplittingvorteil(inputs: Record<string, any>): CalculationResult {
  const taxYear = inputs.taxYear === '2025' ? '2025' : '2026';
  const config = getTaxConfig(taxYear);
  const a = readNumber(inputs.incomeA);
  const b = readNumber(inputs.incomeB);
  const fail = (error: string): CalculationResult => ({
    primary: { id: 'vorteil', label: 'Splittingvorteil', value: 0, formattedValue: '-' },
    error,
  });

  if (a === null || b === null) return fail('Bitte geben Sie für beide Partner das zu versteuernde Einkommen ein (0 € ist möglich).');
  if (a < 0 || b < 0) return fail('Das zu versteuernde Einkommen darf nicht negativ sein.');

  const estA = computeEStSingle(a, config);
  const estB = computeEStSingle(b, config);
  const solA = computeSolZ(estA, false, config);
  const solB = computeSolZ(estB, false, config);
  const separate = estA + solA + estB + solB;

  const joint = Math.floor(a + b);
  const estJoint = computeEStSingle(Math.floor(joint / 2), config) * 2;
  const solJoint = computeSolZ(estJoint, true, config);
  const together = estJoint + solJoint;

  const vorteil = round2(Math.max(0, separate - together));

  return {
    primary: { id: 'vorteil', label: `Splittingvorteil ${taxYear} pro Jahr`, value: vorteil, formattedValue: formatCurrency(vorteil), highlight: true },
    secondary: [
      { id: 'vorteilMonat', label: 'Splittingvorteil pro Monat', value: vorteil / 12, formattedValue: formatCurrency(vorteil / 12) },
      { id: 'together', label: 'Steuer bei Zusammenveranlagung (Splittingtarif)', value: together, formattedValue: formatCurrency(together), helpText: `Einkommensteuer ${formatCurrency(estJoint)} + Soli ${formatCurrency(solJoint)}` },
      { id: 'separate', label: 'Steuer bei Einzelveranlagung (beide Grundtarif)', value: separate, formattedValue: formatCurrency(separate), helpText: `Partner 1: ${formatCurrency(estA + solA)}, Partner 2: ${formatCurrency(estB + solB)}` },
      { id: 'joint', label: 'Gemeinsames zu versteuerndes Einkommen', value: joint, formattedValue: formatCurrency(joint) },
    ],
    summaryText:
      vorteil === 0
        ? `Bei gleich hohen Einkommen (${formatCurrency(a)} und ${formatCurrency(b)}) bringt das Ehegattensplitting ${taxYear} keinen Vorteil.`
        : `Mit ${formatCurrency(a)} und ${formatCurrency(b)} zu versteuerndem Einkommen sparen Sie ${taxYear} durch das Ehegattensplitting ${formatCurrency(vorteil)} Einkommensteuer und Soli im Jahr (${formatCurrency(vorteil / 12)} im Monat).`,
  };
}
