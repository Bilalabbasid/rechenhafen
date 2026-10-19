import { ALL_CALCULATORS } from './calculators';

export interface SearchItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  keywords: string[];
}

/**
 * Dynamically generated search index covering all published calculators from ALL_CALCULATORS.
 */
export const SEARCH_INDEX: SearchItem[] = ALL_CALCULATORS.map((calc) => ({
  id: calc.id,
  slug: calc.slug,
  name: calc.name,
  category: calc.category,
  keywords: calc.searchKeywords || [],
}));
