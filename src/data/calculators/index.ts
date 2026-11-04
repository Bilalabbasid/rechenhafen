import { CalculatorDefinition } from '@/types/calculator';
import { DATUM_ZEIT_CALCULATORS } from './datumZeit';
import { MATHEMATIK_CALCULATORS } from './mathematik';
import { FINANZEN_CALCULATORS } from './finanzen';
import { KREDIT_CALCULATORS } from './kredit';
import { AUTO_CALCULATORS } from './auto';
import { WOHNEN_CALCULATORS } from './wohnen';
import { HAUSHALT_CALCULATORS } from './haushalt';
import { ARBEIT_CALCULATORS } from './arbeit';
import { GESUNDHEIT_CALCULATORS } from './gesundheit';
import { FAMILIE_CALCULATORS } from './familie';
import { BAUEN_CALCULATORS } from './bauen';
import { GEOMETRIE_CALCULATORS } from './geometrie';
import { EINHEITEN_CALCULATORS } from './einheiten';
import { KOCHEN_CALCULATORS } from './kochen';
import { BUSINESS_CALCULATORS } from './business';
import { STATISTIK_CALCULATORS } from './statistik';
import { STEUERN_GEHALT_CALCULATORS } from './steuernGehalt';
import { EXTRA_CALCULATORS } from './extra';
import { enrichCalculator } from './enrichment';
import { isCalculatorRetired, RETIRED_CALCULATORS } from '@/data/seo/retired-calculators';
import { isCalculatorIndexable } from '@/data/seo/indexable-calculators';

const RAW_CALCULATORS: CalculatorDefinition[] = [
  ...DATUM_ZEIT_CALCULATORS,
  ...MATHEMATIK_CALCULATORS,
  ...FINANZEN_CALCULATORS,
  ...KREDIT_CALCULATORS,
  ...AUTO_CALCULATORS,
  ...WOHNEN_CALCULATORS,
  ...HAUSHALT_CALCULATORS,
  ...ARBEIT_CALCULATORS,
  ...STEUERN_GEHALT_CALCULATORS,
  ...GESUNDHEIT_CALCULATORS,
  ...FAMILIE_CALCULATORS,
  ...BAUEN_CALCULATORS,
  ...GEOMETRIE_CALCULATORS,
  ...EINHEITEN_CALCULATORS,
  ...KOCHEN_CALCULATORS,
  ...BUSINESS_CALCULATORS,
  ...STATISTIK_CALCULATORS,
  ...EXTRA_CALCULATORS,
];

/** Every calculator definition, including retired ones (used by engine/math tests). */
export const ALL_CALCULATOR_DEFINITIONS: CalculatorDefinition[] = RAW_CALCULATORS.map(enrichCalculator);

/** Live calculators: everything the site renders, lists, searches and links to. */
export const ALL_CALCULATORS: CalculatorDefinition[] = ALL_CALCULATOR_DEFINITIONS.filter(
  (c) => !isCalculatorRetired(c.slug),
).map((c) => ({ ...c, relatedSlugs: liveRelatedSlugs(c) }));

/** Replaces retired related calculators with their redirect target calculator (if any), without duplicates or self-links. */
function liveRelatedSlugs(calc: CalculatorDefinition): string[] {
  const out: string[] = [];
  for (const slug of calc.relatedSlugs) {
    const target = isCalculatorRetired(slug)
      ? RETIRED_CALCULATORS[slug].match(/^\/rechner\/([^/?]+)\/(?:\?.*)?$/)?.[1]
      : slug;
    if (target && target !== calc.slug && !out.includes(target)) out.push(target);
  }
  // Every related link was retired or merged into this page itself: fall back to live
  // calculators of the same subcategory, then category.
  if (out.length === 0) {
    const live = ALL_CALCULATOR_DEFINITIONS.filter((c) => c.slug !== calc.slug && !isCalculatorRetired(c.slug));
    const pool = [
      ...live.filter((c) => calc.subcategory && c.subcategory === calc.subcategory),
      ...live.filter((c) => c.category === calc.category),
    ];
    for (const c of pool) {
      if (!out.includes(c.slug)) out.push(c.slug);
      if (out.length >= 3) break;
    }
  }
  return out;
}

const DEFINITION_MAP = new Map<string, CalculatorDefinition>();
for (const calc of ALL_CALCULATOR_DEFINITIONS) {
  DEFINITION_MAP.set(calc.slug, calc);
  DEFINITION_MAP.set(calc.id, calc);
}

/** Looks up any definition, retired or live. Pages must use getCalculatorBySlug instead. */
export function getCalculatorDefinitionBySlug(slug: string): CalculatorDefinition | undefined {
  return DEFINITION_MAP.get(slug);
}

// Schnelle O(1) Lookup Map
const SLUG_MAP = new Map<string, CalculatorDefinition>();
for (const calc of ALL_CALCULATORS) {
  SLUG_MAP.set(calc.slug, calc);
  SLUG_MAP.set(calc.id, calc);
}

export function getCalculatorBySlug(slug: string): CalculatorDefinition | undefined {
  return SLUG_MAP.get(slug);
}

export function getCalculatorsByCategory(categorySlug: string): CalculatorDefinition[] {
  return ALL_CALCULATORS.filter((c) => c.category === categorySlug);
}

/** Live calculators with indexable pages first, so automatic related links point at pages Google counts. */
const CALCULATORS_INDEXABLE_FIRST: CalculatorDefinition[] = [
  ...ALL_CALCULATORS.filter((c) => isCalculatorIndexable(c.slug)),
  ...ALL_CALCULATORS.filter((c) => !isCalculatorIndexable(c.slug)),
];

export function getRelatedCalculators(calc: CalculatorDefinition, limit = 4): CalculatorDefinition[] {
  const result: CalculatorDefinition[] = [];
  const addedSlugs = new Set<string>([calc.slug]);

  // 1. Priorisiere explizit definierte relatedSlugs
  for (const slug of calc.relatedSlugs) {
    const related = getCalculatorBySlug(slug);
    if (related && !addedSlugs.has(related.slug)) {
      result.push(related);
      addedSlugs.add(related.slug);
      if (result.length >= limit) return result;
    }
  }

  // 2. Fülle mit weiteren Rechnern derselben Subkategorie auf (indexierte Seiten zuerst)
  if (calc.subcategory) {
    for (const c of CALCULATORS_INDEXABLE_FIRST) {
      if (c.subcategory === calc.subcategory && !addedSlugs.has(c.slug)) {
        result.push(c);
        addedSlugs.add(c.slug);
        if (result.length >= limit) return result;
      }
    }
  }

  // 3. Fülle mit Rechnern derselben Hauptkategorie auf (indexierte Seiten zuerst)
  for (const c of CALCULATORS_INDEXABLE_FIRST) {
    if (c.category === calc.category && !addedSlugs.has(c.slug)) {
      result.push(c);
      addedSlugs.add(c.slug);
      if (result.length >= limit) return result;
    }
  }

  return result;
}

export function getAllCalculatorSlugs(): string[] {
  return ALL_CALCULATORS.map((c) => c.slug);
}
