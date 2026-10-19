import { ALL_CALCULATORS } from '@/data/calculators';
import { CATEGORIES, getCategoryBySlug } from '@/data/categories';
import type { CalculatorDefinition } from '@/types/calculator';

export interface SearchableItem {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: string;
  categoryName: string;
  shortDescription: string;
  keywords: string[];
  // Precomputed normalized fields for sub-millisecond search
  normalizedName: string;
  normalizedShortName: string;
  normalizedCategoryName: string;
  normalizedDescription: string;
  normalizedKeywords: string[];
  allWords: Set<string>;
}

export interface SearchResultItem {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: string;
  categoryName: string;
  shortDescription: string;
  score: number;
}

export interface SearchOptions {
  limit?: number;
  minScore?: number;
}

/**
 * Normalizes German text for deterministic, case-insensitive, umlaut-invariant matching.
 * Maps ä->ae, ö->oe, ü->ue, ß->ss, strips accents and punctuation.
 */
export function normalizeGermanText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[éèêë]/g, 'e')
    .replace(/[àâá]/g, 'a')
    .replace(/[^\w\s/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Common German stopwords that carry low semantic distinction in general search queries.
 */
export const GERMAN_STOPWORDS = new Set([
  'wie', 'viel', 'viele', 'wieviel', 'wieviele',
  'was', 'wo', 'wann', 'warum', 'welche', 'welcher', 'welches', 'wer',
  'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr',
  'kann', 'kannst', 'koennen', 'können', 'muss', 'muessen', 'müssen', 'soll', 'sollte', 'sollten',
  'mir', 'mich', 'dir', 'dich', 'sich', 'uns', 'euch', 'ihm', 'ihnen',
  'mein', 'meine', 'meinen', 'meiner', 'meines', 'dein', 'deine', 'sein', 'seine',
  'haben', 'habe', 'hat', 'hatte', 'bin', 'bist', 'ist', 'sind', 'war', 'waren', 'sein',
  'wird', 'werden', 'wurde',
  'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'einer', 'eines',
  'und', 'oder', 'aber', 'denn',
  'fuer', 'für', 'von', 'vom', 'im', 'in', 'zu', 'zum', 'zur', 'mit', 'auf', 'aus', 'nach', 'bei', 'ueber', 'über',
  'rechner', 'berechnen', 'berechnung', 'rechnen',
  'online', 'kostenlos', 'tabelle', 'tool',
]);

/**
 * Calculates Damerau-Levenshtein / Levenshtein distance between two strings.
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const al = a.length;
  const bl = b.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= al; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= bl; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let min = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );

      // Transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        min = Math.min(min, matrix[i - 2][j - 2] + cost);
      }

      matrix[i][j] = min;
    }
  }

  return matrix[al][bl];
}

/**
 * Precomputes search index from ALL_CALCULATORS once.
 */
function buildSearchIndex(): SearchableItem[] {
  return ALL_CALCULATORS.map((calc: CalculatorDefinition) => {
    const cat = getCategoryBySlug(calc.category);
    const categoryName = cat?.name || calc.category;

    const normalizedName = normalizeGermanText(calc.name);
    const normalizedShortName = normalizeGermanText(calc.shortName || '');
    const normalizedCategoryName = normalizeGermanText(categoryName);
    const normalizedDescription = normalizeGermanText(calc.shortDescription || '');
    const normalizedKeywords = (calc.searchKeywords || []).map((kw) => normalizeGermanText(kw));

    const wordSet = new Set<string>();

    const addWordsFromText = (text: string) => {
      // Split on spaces and slashes so "2/5" produces "2/5", "2", "5"
      const tokens = text.split(/[\s,.-]+/).filter((t) => t.length > 0);
      for (const t of tokens) {
        wordSet.add(t);
        if (t.includes('/')) {
          for (const sub of t.split('/')) {
            if (sub) wordSet.add(sub);
          }
        }
      }
    };

    addWordsFromText(normalizedName);
    addWordsFromText(normalizedShortName);
    addWordsFromText(normalizedDescription);
    for (const kw of normalizedKeywords) {
      addWordsFromText(kw);
    }

    return {
      id: calc.id,
      slug: calc.slug,
      name: calc.name,
      shortName: calc.shortName || calc.name,
      category: calc.category,
      categoryName,
      shortDescription: calc.shortDescription || '',
      keywords: calc.searchKeywords || [],
      normalizedName,
      normalizedShortName,
      normalizedCategoryName,
      normalizedDescription,
      normalizedKeywords,
      allWords: wordSet,
    };
  });
}

export const SEARCH_INDEX_ITEMS: SearchableItem[] = buildSearchIndex();

/**
 * Main search function across all published calculators.
 */
export function searchCalculators(
  query: string,
  options: SearchOptions = {}
): SearchResultItem[] {
  const { limit = 8, minScore = 20 } = options;

  const rawQuery = query.trim();
  if (!rawQuery) return [];

  const normalizedQuery = normalizeGermanText(rawQuery);
  if (!normalizedQuery) return [];

  // Extract query tokens (splitting by space, preserve slash tokens like 2/5)
  const rawTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  if (rawTokens.length === 0) return [];

  // Expand tokens with slashed subcomponents if present (e.g. '2/5' -> also '2', '5')
  const allQueryTokens: string[] = [];
  for (const t of rawTokens) {
    allQueryTokens.push(t);
  }

  // Filter content tokens (non-stopwords of length >= 2)
  const contentTokens = allQueryTokens.filter(
    (t) => !GERMAN_STOPWORDS.has(t) && t.length >= 2
  );
  const hasContentTokens = contentTokens.length > 0;
  const effectiveTokens = hasContentTokens ? contentTokens : allQueryTokens;

  const results: SearchResultItem[] = [];

  for (const item of SEARCH_INDEX_ITEMS) {
    let score = 0;

    // 1. Exact match on slug
    if (item.slug === normalizedQuery || item.slug.replace(/-/g, ' ') === normalizedQuery) {
      score += 1500;
    }

    // 2. Exact match on name or shortName
    if (item.normalizedName === normalizedQuery || item.normalizedShortName === normalizedQuery) {
      score += 1200;
    } else if (item.normalizedName.startsWith(normalizedQuery) || item.normalizedShortName.startsWith(normalizedQuery)) {
      score += 700;
    } else if (item.normalizedName.includes(normalizedQuery)) {
      score += 500;
    }

    // 3. Exact phrase match in keywords
    for (const kw of item.normalizedKeywords) {
      if (kw === normalizedQuery) {
        score += 650;
        break;
      } else if (kw.startsWith(normalizedQuery)) {
        score += 450;
        break;
      } else if (kw.includes(normalizedQuery)) {
        score += 350;
        break;
      }
    }

    // 4. Exact phrase match in description
    if (item.normalizedDescription.includes(normalizedQuery)) {
      score += 120;
    }

    // 5. Token-level matching with term specificity
    let contentTokensMatched = 0;
    let anyTokenMatched = false;

    for (const token of allQueryTokens) {
      const isStopword = GERMAN_STOPWORDS.has(token);
      const isContent = !isStopword && token.length >= 2;
      const baseWeight = isStopword ? 3 : 60;

      let matchedInItem = false;

      // Check name / shortName
      if (item.normalizedName.includes(token) || item.normalizedShortName.includes(token)) {
        score += baseWeight * 2.5;
        matchedInItem = true;
      }

      // Check keywords
      let kwMatched = false;
      for (const kw of item.normalizedKeywords) {
        if (kw.includes(token)) {
          kwMatched = true;
          break;
        }
      }
      if (kwMatched) {
        score += baseWeight * 2.0;
        matchedInItem = true;
      }

      // Check wordSet (handles sub-tokens like 2/5 -> 2, 5)
      if (item.allWords.has(token)) {
        score += baseWeight * 1.0;
        matchedInItem = true;
      }

      // Check description (lower weight)
      if (item.normalizedDescription.includes(token)) {
        score += baseWeight * 0.4;
        matchedInItem = true;
      }

      // Check category name
      if (item.normalizedCategoryName.includes(token)) {
        score += baseWeight * 0.3;
        matchedInItem = true;
      }

      // Fallback: Controlled typo matching for non-stopword tokens >= 5 chars
      if (!matchedInItem && isContent && token.length >= 5) {
        for (const word of item.allWords) {
          if (word.length >= 4 && Math.abs(word.length - token.length) <= 1) {
            const dist = levenshteinDistance(token, word);
            if (dist === 1) {
              score += 45; // Typo match bonus (subordinate to exact matches)
              matchedInItem = true;
              break;
            }
          }
        }
      }

      if (matchedInItem) {
        anyTokenMatched = true;
        if (isContent) {
          contentTokensMatched++;
        }
      }
    }

    // 6. Directional Sequence & Origin Alignment
    if (contentTokens.length >= 2) {
      const t1 = contentTokens[0];
      const t2 = contentTokens[1];

      // Check token order in name or slug (e.g. 'brutto' before 'netto' for 'brutto in netto')
      const namePos1 = item.normalizedName.indexOf(t1);
      const namePos2 = item.normalizedName.indexOf(t2);
      if (namePos1 !== -1 && namePos2 !== -1 && namePos1 < namePos2) {
        score += 150;
      }

      const slugPos1 = item.slug.indexOf(t1);
      const slugPos2 = item.slug.indexOf(t2);
      if (slugPos1 !== -1 && slugPos2 !== -1 && slugPos1 < slugPos2) {
        score += 150;
      }

      // Check if title or slug begins with the first requested entity
      if (item.normalizedName.startsWith(t1) || item.slug.startsWith(t1)) {
        score += 100;
      }
    } else if (contentTokens.length === 1) {
      const t1 = contentTokens[0];
      if (item.normalizedName.startsWith(t1) || item.slug.startsWith(t1)) {
        score += 80;
      }
    }

    // 7. Term Specificity & Content Coverage Multiplier
    if (hasContentTokens) {
      const coverage = contentTokensMatched / contentTokens.length;

      if (contentTokensMatched === 0) {
        // Query had discriminative content words (e.g. 'erythrit', 'zucker'),
        // but this calculator matched NONE of them (e.g. rent/loan matching only 'wie'/'viel').
        // Heavily penalize so it cannot outrank or pass threshold!
        score = Math.min(score, 10);
      } else {
        // Full content coverage bonus
        if (coverage === 1.0) {
          score += 400;
        } else if (coverage >= 0.6) {
          score += 150 * coverage;
        }
      }
    }

    if (score >= minScore && anyTokenMatched) {
      results.push({
        id: item.id,
        slug: item.slug,
        name: item.name,
        shortName: item.shortName,
        category: item.category,
        categoryName: item.categoryName,
        shortDescription: item.shortDescription,
        score,
      });
    }
  }

  // Sort descending by score, tiebreak alphabetically by name
  results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.name.localeCompare(b.name, 'de');
  });

  return results.slice(0, limit);
}
