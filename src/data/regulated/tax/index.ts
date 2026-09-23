import { TaxYearConfig } from './types';
import { TAX_CONFIG_2025 } from './2025';
import { TAX_CONFIG_2026 } from './2026';

export * from './types';
export { TAX_CONFIG_2025 } from './2025';
export { TAX_CONFIG_2026 } from './2026';

export const SUPPORTED_TAX_YEARS = [2026, 2025] as const;
export type SupportedTaxYear = (typeof SUPPORTED_TAX_YEARS)[number];

export function getTaxConfig(year?: number | string): TaxYearConfig {
  const parsedYear = typeof year === 'string' ? parseInt(year, 10) : year;
  if (parsedYear === 2025) {
    return TAX_CONFIG_2025;
  }
  // Standardmäßig aktuelles Jahr 2026
  return TAX_CONFIG_2026;
}
