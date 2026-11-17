import { describe, it, expect } from 'vitest';
import { CATEGORIES } from '@/data/categories';
import { ALL_CALCULATORS } from '@/data/calculators';
import { CATEGORY_GUIDES } from '@/data/category-guides';

const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
const liveSlugs = new Set(ALL_CALCULATORS.map((c) => c.slug));
// Claims the site cannot back up (no editorial team, not an authority, no legal guarantee)
const OVERCLAIMS = /offiziell|rechtssicher|fachredaktion|redaktionell geprüft|garantiert/i;

describe('category guides', () => {
  it('every category has a guide with questions and FAQs', () => {
    const missing = CATEGORIES.filter((c) => {
      const g = CATEGORY_GUIDES[c.slug];
      return !g || g.questions.length < 5 || g.faqs.length < 2;
    }).map((c) => c.slug);
    expect(missing).toEqual([]);
  });

  it('guides only exist for real categories', () => {
    const cats = new Set(CATEGORIES.map((c) => c.slug));
    expect(Object.keys(CATEGORY_GUIDES).filter((s) => !cats.has(s))).toEqual([]);
  });

  it('every question links to a live calculator, each calculator at most once per guide', () => {
    const problems: string[] = [];
    for (const [cat, g] of Object.entries(CATEGORY_GUIDES)) {
      const seen = new Set<string>();
      for (const q of g.questions) {
        if (!liveSlugs.has(q.slug)) problems.push(`${cat}: ${q.slug} is not a live calculator`);
        if (seen.has(q.slug)) problems.push(`${cat}: ${q.slug} linked twice`);
        seen.add(q.slug);
      }
    }
    expect(problems).toEqual([]);
  });

  it('category FAQ answers are unique and do not repeat calculator FAQs', () => {
    const calcAnswers = new Set(ALL_CALCULATORS.flatMap((c) => (c.faqs || []).map((f) => norm(f.answer))));
    const seen = new Map<string, string>();
    const problems: string[] = [];
    for (const [cat, g] of Object.entries(CATEGORY_GUIDES)) {
      for (const f of g.faqs) {
        const a = norm(f.answer);
        if (calcAnswers.has(a)) problems.push(`${cat}: "${f.question}" repeats a calculator FAQ`);
        if (seen.has(a)) problems.push(`${cat}: "${f.question}" repeats ${seen.get(a)}`);
        seen.set(a, cat);
      }
    }
    expect(problems).toEqual([]);
  });

  it('no overclaims in category texts or guides', () => {
    const texts: string[] = [];
    for (const c of CATEGORIES) texts.push(`${c.slug}: ${c.description} ${c.metaDescription} ${c.introText || ''}`);
    for (const [cat, g] of Object.entries(CATEGORY_GUIDES)) {
      texts.push(`${cat}: ${JSON.stringify(g)}`);
    }
    expect(texts.filter((t) => OVERCLAIMS.test(t)).map((t) => t.slice(0, 60))).toEqual([]);
  });
});
