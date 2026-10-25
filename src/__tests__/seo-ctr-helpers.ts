import { expect } from 'vitest';
import { ALL_CALCULATORS, getCalculatorBySlug } from '@/data/calculators';
import sitemap from '@/app/sitemap';
import { CalculatorDefinition } from '@/types/calculator';

/**
 * Shared checks for the scoped SEO/CTR update of six calculator pages
 * (Phase A: Nudeln, Heizöl, Gas; Phase B: Marmelade, Zucker, Zwischenfinanzierung).
 */

export const ALL_SEO_CTR_SLUGS = [
  'nudeln-rohmaerk-gewicht-rechner',
  'oelheizung-verbrauch-rechner',
  'gaskostenrechner',
  'marmelade-geliermittel-rechner',
  'zucker-ersatz-rechner',
  'zwischenfinanzierung-rechner',
];

/**
 * Pages re-verified on the same day outside the SEO/CTR scope: Minijob/Mindestlohn 2026 values, and the
 * 2026 tax config values Ø-Zusatzbeitrag 2,9 %, Kindergeld 259 €, SolZ-Freigrenze 20.350 €, Insolvenzgeldumlage 0,15 %.
 */
export const LASTMOD_2026_10_25_DATA_REVIEW_SLUGS = [
  'minijob-midijob-rechner',
  'minijob-rechner',
  'midijob-rechner',
  'stundenlohnrechner',
  'brutto-netto-rechner',
  'netto-brutto-rechner',
  'einkommensteuerrechner',
  'solidaritaetszuschlag-rechner',
  'sozialabgaben-rechner',
  'arbeitgeberkosten-rechner',
  'kindergeld-rechner-2026',
];

export const getCalc = (slug: string): CalculatorDefinition => {
  const calc = getCalculatorBySlug(slug);
  if (!calc) throw new Error(`missing calculator ${slug}`);
  return calc;
};

export const secondary = (res: ReturnType<CalculatorDefinition['calculate']>, id: string) =>
  res.secondary?.find((s) => s.id === id);

export const fmtDe = (n: number) => new Intl.NumberFormat('de-DE').format(n);

export function expectCleanMetadata(slugs: string[]) {
  const titles = new Set<string>();
  for (const slug of slugs) {
    const calc = getCalc(slug);
    expect(calc.slug).toBe(slug);
    expect(calc.id).toBe(slug);
    for (const field of [calc.metaTitle, calc.metaDescription, calc.h1]) {
      expect(field).not.toMatch(/\.\.\.|…/);
      expect(field).not.toMatch(/\b20\d\d\b/);
      expect(field).not.toMatch(/RechenHafen/i);
    }
    expect(calc.metaTitle.length).toBeLessThanOrEqual(60);
    expect(calc.metaDescription).toMatch(/[.)]$/);
    expect(calc.shortDescription).not.toContain('präziser Formelberechnung und verlässlichen Ergebnissen');
    // Description unique across the whole site
    expect(ALL_CALCULATORS.filter((c) => c.metaDescription === calc.metaDescription)).toHaveLength(1);
    // Quick reference directly under the calculator
    expect(calc.quickReference && calc.quickReference.length > 0, slug).toBe(true);
    expect(calc.quickReference![0].content.length).toBeGreaterThan(200);
    // No Product/Review/Offer style data
    expect(JSON.stringify(calc)).not.toMatch(/aggregateRating|"@type":"(Product|Review|Offer)"/);
    titles.add(calc.metaTitle);
  }
  expect(titles.size).toBe(slugs.length);
}

/** Every page in `slugs` is in the sitemap with today's lastmod; no unrelated page got that lastmod. */
export function expectScopedSitemapLastmod(slugs: string[], date = '2026-10-25') {
  const entries = sitemap();
  const url = (s: string) => `https://rechenhafen.de/rechner/${s}/`;
  const bumped = entries
    .filter((e) => new Date(e.lastModified as Date).toISOString().startsWith(date))
    .map((e) => e.url);
  for (const s of slugs) {
    expect(entries.some((e) => e.url === url(s)), s).toBe(true);
    expect(bumped).toContain(url(s));
  }
  const allowed = [...ALL_SEO_CTR_SLUGS, ...LASTMOD_2026_10_25_DATA_REVIEW_SLUGS].map(url);
  for (const u of bumped) expect(allowed).toContain(u);
}
