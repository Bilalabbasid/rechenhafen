/**
 * Calculators retired on 5 Nov 2026 because they earned zero Google impressions in the
 * 28-day GSC window (6 Oct – 2 Nov 2026) despite being live the whole time.
 *
 * Kept despite zero impressions because other content depends on them: werktage-rechner,
 * teilzeit-gehaltsrechner, sondertilgungsrechner (primary tools of Ratgeber articles) and
 * indexmiete-rechner (linked from the Mieterhöhung result).
 *
 * Each retired slug 301-redirects to the closest live page (see next.config.ts).
 * Their definitions and engines stay in the codebase (ALL_CALCULATOR_DEFINITIONS) so
 * the math tests keep running and a calculator can be revived by deleting its entry.
 *
 * The mapping lives in JSON so next.config.ts can read it without the TS path aliases.
 */
import retired from './retired-calculators.json';

export const RETIRED_CALCULATORS: Readonly<Record<string, string>> = retired;

export function isCalculatorRetired(slug: string): boolean {
  return Object.prototype.hasOwnProperty.call(RETIRED_CALCULATORS, slug);
}

/** Rewrites an internal link to a retired calculator to its redirect target. */
export function resolveRetiredHref(href: string): string {
  const m = href.match(/^(?:https:\/\/rechenhafen\.de)?\/rechner\/([^/?#]+)\/?([?#].*)?$/);
  if (!m || !isCalculatorRetired(m[1])) return href;
  return RETIRED_CALCULATORS[m[1]];
}
