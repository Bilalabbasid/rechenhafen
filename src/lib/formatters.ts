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
