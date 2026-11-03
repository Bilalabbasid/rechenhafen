import { GermanLegalValues, LegalConstant } from './types';
import { LEGAL_VALUES_2025 } from './2025';
import { LEGAL_VALUES_2026 } from './2026';

export * from './types';
export { LEGAL_VALUES_2025 } from './2025';
export { LEGAL_VALUES_2026 } from './2026';

export const SUPPORTED_LEGAL_YEARS = [2026, 2025] as const;
export type SupportedLegalYear = (typeof SUPPORTED_LEGAL_YEARS)[number];

/**
 * Aktuelle gesetzliche Werte (Standard: 2026)
 */
export const LEGAL_VALUES = LEGAL_VALUES_2026;

/**
 * Holt das Gesetzeswerte-Set für das angegebene Jahr.
 */
export function getLegalValues(year?: number | string): GermanLegalValues {
  const parsedYear = typeof year === 'string' ? parseInt(year, 10) : year;
  if (parsedYear === 2025) {
    return LEGAL_VALUES_2025;
  }
  // Standard: aktuelles Jahr 2026
  return LEGAL_VALUES_2026;
}

/**
 * Hilfsfunktion zum Abruf einer einzelnen gesetzlichen Konstante
 */
export function getLegalConstant<K extends keyof Omit<GermanLegalValues, 'year'>>(
  key: K,
  year?: number | string
): GermanLegalValues[K] {
  const values = getLegalValues(year);
  return values[key];
}
