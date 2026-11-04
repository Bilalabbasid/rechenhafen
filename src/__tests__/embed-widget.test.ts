import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';
import { EMBEDDABLE_CALCULATORS, buildEmbedSnippet, isEmbeddable } from '@/data/embed';
import { isCalculatorIndexable } from '@/data/seo/indexable-calculators';
import sitemap from '@/app/sitemap';

describe('embeddable calculator widget', () => {
  it('only offers live, indexed calculators', () => {
    for (const e of EMBEDDABLE_CALCULATORS) {
      expect(getCalculatorBySlug(e.slug), e.slug).toBeDefined();
      expect(isCalculatorIndexable(e.slug), e.slug).toBe(true);
    }
    expect(isEmbeddable('brutto-netto-rechner')).toBe(false);
  });

  it('embed code links back with a visible brand anchor outside the iframe', () => {
    const code = buildEmbedSnippet('schalungssteine-rechner', 'Schalungssteine-Rechner', 980);
    expect(code).toContain('<iframe src="https://rechenhafen.de/embed/schalungssteine-rechner/"');
    expect(code).toContain('<a href="https://rechenhafen.de/rechner/schalungssteine-rechner/">RechenHafen.de</a>');
    expect(code).not.toMatch(/rel="nofollow"/);
    // the height script only trusts messages from rechenhafen.de
    expect(code).toContain('e.origin!=="https://rechenhafen.de"');
  });

  it('allows framing only for /embed/ and keeps every other page unframeable', async () => {
    const nextConfig = (await import('../../next.config')).default;
    const rules = await nextConfig.headers!();
    const siteRule = rules.find((r) => r.source === '/((?!embed/).*)');
    const embedRule = rules.find((r) => r.source === '/embed/:path*');
    expect(siteRule?.headers.find((h) => h.key === 'X-Frame-Options')?.value).toBe('DENY');
    expect(siteRule?.headers.find((h) => h.key === 'Content-Security-Policy')?.value).toContain("frame-ancestors 'none'");
    expect(embedRule?.headers.find((h) => h.key === 'X-Frame-Options')).toBeUndefined();
    const embedCsp = embedRule?.headers.find((h) => h.key === 'Content-Security-Policy')?.value ?? '';
    expect(embedCsp).toContain('frame-ancestors *');
    expect(embedCsp).not.toContain('googlesyndication');
    // the site-wide rule must not match embed paths
    const re = new RegExp('^' + siteRule!.source.replace('/((?!embed/).*)', '/((?!embed/).*)') + '$');
    expect(re.test('/embed/schalungssteine-rechner/')).toBe(false);
    expect(re.test('/rechner/schalungssteine-rechner/')).toBe(true);
  });

  it('lists the Einbinden page in the sitemap but never the embed pages', () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain('https://rechenhafen.de/rechner-einbinden/');
    expect(urls.some((u) => u.includes('/embed/'))).toBe(false);
  });
});
