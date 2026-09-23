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

export const ALL_CALCULATORS: CalculatorDefinition[] = [
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

  // 2. Fülle mit weiteren Rechnern derselben Subkategorie auf
  if (calc.subcategory) {
    for (const c of ALL_CALCULATORS) {
      if (c.subcategory === calc.subcategory && !addedSlugs.has(c.slug)) {
        result.push(c);
        addedSlugs.add(c.slug);
        if (result.length >= limit) return result;
      }
    }
  }

  // 3. Fülle mit Rechnern derselben Hauptkategorie auf
  for (const c of ALL_CALCULATORS) {
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
