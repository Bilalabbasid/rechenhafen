/**
 * Server-side search over the full calculator registry (route handlers, server components, tests).
 *
 * Do NOT import this file from client components: `@/data/calculators` pulls every calculator
 * engine and all page texts into the browser bundle. Client code uses `clientIndex.ts`, which
 * fetches the small index from /search-index.json.
 */
import { ALL_CALCULATORS } from '@/data/calculators';
import { getCategoryBySlug } from '@/data/categories';
import type { CalculatorDefinition } from '@/types/calculator';
import {
  buildSearchItems,
  searchItems,
  type SearchEntry,
  type SearchableItem,
  type SearchOptions,
  type SearchResultItem,
} from './searchCore';

export {
  normalizeGermanText,
  levenshteinDistance,
  GERMAN_STOPWORDS,
  buildSearchItems,
  searchItems,
} from './searchCore';
export type { SearchEntry, SearchableItem, SearchOptions, SearchResultItem } from './searchCore';

/** Compact index entries for all live calculators (served as /search-index.json). */
export function getSearchEntries(): SearchEntry[] {
  return ALL_CALCULATORS.map((calc: CalculatorDefinition) => {
    const cat = getCategoryBySlug(calc.category);
    return {
      id: calc.id,
      slug: calc.slug,
      name: calc.name,
      shortName: calc.shortName || calc.name,
      category: calc.category,
      categoryName: cat?.name || calc.category,
      shortDescription: calc.shortDescription || '',
      keywords: calc.searchKeywords || [],
    };
  });
}

export const SEARCH_INDEX_ITEMS: SearchableItem[] = buildSearchItems(getSearchEntries());

/**
 * Main search function across all published calculators.
 */
export function searchCalculators(query: string, options: SearchOptions = {}): SearchResultItem[] {
  return searchItems(SEARCH_INDEX_ITEMS, query, options);
}
