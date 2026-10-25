import { describe, it, expect } from 'vitest';
import { ALL_CALCULATORS } from '@/data/calculators';
import { formatMetaTitle } from '@/lib/seo/title';

/**
 * Guards against hard-truncated search snippets. 70 calculator titles used to end in
 * "..." and several descriptions stopped mid-sentence ("... und.", "... zum."), which
 * Google shows verbatim in the results.
 */
describe('Calculator metadata: no truncated titles or descriptions', () => {
  it('no metaTitle or H1 contains a hard truncation ("..." or "…")', () => {
    const offenders = ALL_CALCULATORS.filter((c) => /\.\.\.|…/.test(c.metaTitle) || /\.\.\.|…/.test(c.h1)).map((c) => c.slug);
    expect(offenders).toEqual([]);
  });

  it('no metaDescription ends mid-sentence', () => {
    const dangling = /\b(und|oder|der|die|das|den|dem|des|für|mit|von|zu|zur|zum|inkl|sowie|einer|eines|eine|im|in|bei|auf|nach|aus)\.$/i;
    const offenders = ALL_CALCULATORS.filter((c) => {
      const d = c.metaDescription.trim();
      return dangling.test(d) || !/[.!?)]$/.test(d);
    }).map((c) => `${c.slug}: …${c.metaDescription.slice(-40)}`);
    expect(offenders).toEqual([]);
  });

  it('titles stay unique and reasonably short', () => {
    const titles = ALL_CALCULATORS.map((c) => formatMetaTitle(c.metaTitle));
    expect(new Set(titles).size).toBe(titles.length);
    for (const c of ALL_CALCULATORS) expect(formatMetaTitle(c.metaTitle).length, c.slug).toBeLessThanOrEqual(75);
  });
});
