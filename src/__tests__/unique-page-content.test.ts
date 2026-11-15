import { describe, it, expect } from 'vitest';
import { ALL_CALCULATORS } from '@/data/calculators';
import { PAGE_CONTENT } from '@/data/calculators/page-content';

/**
 * Guards against scaled, templated content: the same paragraph or FAQ on many calculator pages
 * is what Google's helpful-content and spam systems treat as low value.
 */
function pagesPer(texts: Array<[string, string]>) {
  const map = new Map<string, Set<string>>();
  for (const [slug, text] of texts) {
    const key = text.replace(/\s+/g, ' ').trim();
    if (key.length < 60) continue;
    if (!map.has(key)) map.set(key, new Set());
    map.get(key)!.add(slug);
  }
  return [...map.entries()].filter(([, s]) => s.size > 1).map(([t, s]) => `${s.size}× ${[...s].slice(0, 4).join(', ')}: ${t.slice(0, 90)}`);
}

describe('unique content per calculator page', () => {
  it('no FAQ answer is shared by two calculator pages', () => {
    const texts = ALL_CALCULATORS.flatMap((c) => c.faqs.map((f) => [c.slug, f.answer] as [string, string]));
    expect(pagesPer(texts)).toEqual([]);
  });

  it('no content section is shared by two calculator pages', () => {
    const texts = ALL_CALCULATORS.flatMap((c) => (c.content?.sections || []).map((s) => [c.slug, s.content] as [string, string]));
    expect(pagesPer(texts)).toEqual([]);
  });

  it('no generic "verbindlich" FAQ is appended any more', () => {
    const generic = ALL_CALCULATORS.filter((c) => c.faqs.some((f) => f.question === 'Ist das Ergebnis dieses Rechners verbindlich?'));
    expect(generic.map((c) => c.slug)).toEqual([]);
  });

  it('every page-content overlay belongs to a live calculator', () => {
    const live = new Set(ALL_CALCULATORS.map((c) => c.slug));
    expect(Object.keys(PAGE_CONTENT).filter((s) => !live.has(s))).toEqual([]);
  });
});
