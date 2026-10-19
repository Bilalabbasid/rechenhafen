import { describe, it, expect } from 'vitest';
import { searchCalculators, normalizeGermanText, levenshteinDistance } from '@/lib/search/searchEngine';

describe('Search Relevance & Usability Overhaul', () => {
  describe('Required Search Query Acceptance Criteria', () => {
    it('1. Searching "Erythrit" returns sugar-substitute calculator first', () => {
      const results = searchCalculators('Erythrit');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].slug).toBe('zucker-ersatz-rechner');
      expect(results[0].categoryName).toBe('Kochen & Backen');
    });

    it('2. Searching "wie viel erythrit statt zucker" returns sugar-substitute calculator first and ranks it far above rent or loan calculators', () => {
      const results = searchCalculators('wie viel erythrit statt zucker');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].slug).toBe('zucker-ersatz-rechner');

      // Verify rent and loan calculators do not outrank sugar substitute
      const rentIndex = results.findIndex((r) => r.slug.includes('miet') || r.slug.includes('kredit'));
      if (rentIndex !== -1) {
        expect(rentIndex).toBeGreaterThan(0);
        expect(results[0].score).toBeGreaterThan(results[rentIndex].score * 2);
      }
    });

    it('3. Searching "150 g zucker wieviel erythrit" returns sugar-substitute calculator first', () => {
      const results = searchCalculators('150 g zucker wieviel erythrit');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].slug).toBe('zucker-ersatz-rechner');
    });

    it('4. Searching "erytrit" finds sugar-substitute calculator as a typo match', () => {
      const results = searchCalculators('erytrit');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.slug === 'zucker-ersatz-rechner')).toBe(true);
    });

    it('5. Searching "lebensmonate" returns age-in-months calculator first', () => {
      const results = searchCalculators('lebensmonate');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].slug).toBe('alter-in-monaten');
      expect(results[0].categoryName).toBe('Datum & Zeit');
    });

    it('6. Searching "heizölverbrauch" and "heizoelverbrauch" return equivalent relevant results (oelheizung-verbrauch-rechner first)', () => {
      const umlautResults = searchCalculators('heizölverbrauch');
      const asciiResults = searchCalculators('heizoelverbrauch');

      expect(umlautResults.length).toBeGreaterThan(0);
      expect(asciiResults.length).toBeGreaterThan(0);

      expect(umlautResults[0].slug).toBe('oelheizung-verbrauch-rechner');
      expect(asciiResults[0].slug).toBe('oelheizung-verbrauch-rechner');

      // Both should have identical top score
      expect(umlautResults[0].score).toBe(asciiResults[0].score);
    });

    it('7. Searching "splitt 2/5 gewicht" returns Kies- & Splitt-Rechner first', () => {
      const results = searchCalculators('splitt 2/5 gewicht');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].slug).toBe('kies-splitt-rechner');
      expect(results[0].categoryName).toBe('Bauen & Renovieren');
    });

    it('8. Searching "wie viel miete kann ich mir leisten" returns mietbudget-rechner first', () => {
      const results = searchCalculators('wie viel miete kann ich mir leisten');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].slug).toBe('mietbudget-rechner');
      expect(results[0].categoryName).toBe('Wohnen & Immobilien');
    });

    it('9. Searching "wie viel kredit kann ich mir leisten" returns maximaler-kredit-rechner first', () => {
      const results = searchCalculators('wie viel kredit kann ich mir leisten');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].slug).toBe('maximaler-kredit-rechner');
      expect(results[0].categoryName).toBe('Kredit & Schulden');
    });
  });

  describe('Directional sensitivity and nuance', () => {
    it('ranks "netto in brutto" towards Wunsch-Netto calculator (netto-brutto-rechner)', () => {
      const results = searchCalculators('netto in brutto');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].slug).toBe('netto-brutto-rechner');
    });

    it('ranks "brutto in netto" towards standard Gehaltsrechner (brutto-netto-rechner)', () => {
      const results = searchCalculators('brutto in netto');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].slug).toBe('brutto-netto-rechner');
    });
  });

  describe('Category presentation & formatting', () => {
    it('resolves raw category slugs into readable German category names', () => {
      const results = searchCalculators('bmi');
      expect(results.length).toBeGreaterThan(0);
      // Health category should not be raw 'gesundheit-fitness'
      expect(results[0].categoryName).toBe('Gesundheit & Fitness');
      expect(results[0].category).toBe('gesundheit-fitness');
    });

    it('includes shortDescription in results', () => {
      const results = searchCalculators('zucker erythrit');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].shortDescription).toBeTruthy();
      expect(results[0].shortDescription.length).toBeGreaterThan(10);
    });
  });

  describe('Empty and Unrelated Queries', () => {
    it('returns empty array for empty or whitespace query', () => {
      expect(searchCalculators('')).toEqual([]);
      expect(searchCalculators('   ')).toEqual([]);
    });

    it('returns empty array for unrelated nonsense queries rather than filling with irrelevant calculators', () => {
      const results = searchCalculators('xyzkjh893247923749');
      expect(results).toEqual([]);
    });

    it('contains no duplicate slugs in search results', () => {
      const results = searchCalculators('rechner', { limit: 50 });
      const slugs = results.map((r) => r.slug);
      const uniqueSlugs = new Set(slugs);
      expect(slugs.length).toBe(uniqueSlugs.size);
    });
  });

  describe('German Normalizer & Distance Utilities', () => {
    it('normalizes umlauts and ß symmetrically', () => {
      expect(normalizeGermanText('Heizöl')).toBe('heizoel');
      expect(normalizeGermanText('heizoel')).toBe('heizoel');
      expect(normalizeGermanText('Groß')).toBe('gross');
      expect(normalizeGermanText('grösser')).toBe('groesser');
      expect(normalizeGermanText('Äpfel')).toBe('aepfel');
      expect(normalizeGermanText('Über')).toBe('ueber');
    });

    it('computes Levenshtein distance with transpositions correctly', () => {
      expect(levenshteinDistance('erytrit', 'erythrit')).toBe(1);
      expect(levenshteinDistance('rechenr', 'rechner')).toBe(1); // transposition
      expect(levenshteinDistance('abc', 'abc')).toBe(0);
    });
  });
});
