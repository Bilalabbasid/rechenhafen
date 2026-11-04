import { formatDateGerman } from '@/lib/calculators/dateMath';

/**
 * RechenHafen Formatierungs-Helfer
 * Einheitliche deutsche Zahlen-, Währungs-, Prozent- und Datumsformatierung.
 */

export function formatNumber(
  value: number | undefined | null,
  maximumFractionDigits: number = 2,
  minimumFractionDigits: number = 0
): string {
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return '0';
  }
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Like formatNumber, but a small non-zero value never collapses to "0": it keeps at least two
 * significant digits (e.g. 0.000025 bar instead of 0 bar). Use for unit conversions.
 */
export function formatMeasure(
  value: number | undefined | null,
  maximumFractionDigits: number = 2,
  minimumFractionDigits: number = 0
): string {
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return '0';
  }
  const abs = Math.abs(value);
  let digits = maximumFractionDigits;
  if (abs > 0 && abs < 1) {
    digits = Math.min(12, Math.max(maximumFractionDigits, Math.ceil(-Math.log10(abs)) + 1));
  }
  return formatNumber(value, digits, Math.min(minimumFractionDigits, digits));
}

export function formatCurrency(
  value: number | undefined | null,
  maximumFractionDigits: number = 2
): string {
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return '0,00 €';
  }
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits,
  }).format(value);
}

export function formatPercent(
  value: number | undefined | null,
  maximumFractionDigits: number = 2
): string {
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return '0 %';
  }
  return `${formatNumber(value, maximumFractionDigits, 0)} %`;
}

export function formatDateDe(dateInput: Date | string | undefined | null): string {
  if (!dateInput) return '';
  return formatDateGerman(dateInput);
}

export function parseGermanNumber(val: string | number): number {
  if (typeof val === 'number') return val;
  if (!val || typeof val !== 'string') return 0;
  // Entferne Tausendertrennpunkte und ersetze Komma durch Punkt
  const normalized = val.trim().replace(/\./g, '').replace(',', '.');
  const num = parseFloat(normalized);
  return Number.isFinite(num) ? num : 0;
}
