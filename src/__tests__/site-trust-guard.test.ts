import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { ALL_CALCULATORS } from '@/data/calculators';
import { INDEXABLE_CALCULATOR_SLUGS } from '@/data/seo/indexable-calculators';
import sitemap from '@/app/sitemap';

const SRC = path.resolve(__dirname, '..');

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === '__tests__' ? [] : walk(p);
    return /\.(ts|tsx)$/.test(e.name) ? [p] : [];
  });
}

describe('site trust guard', () => {
  it('ships no "[FILL: …]" placeholder text in app code', () => {
    const offenders = walk(SRC)
      .filter((f) => !f.endsWith(path.join('config', 'site-owner.ts')))
      .filter((f) => fs.readFileSync(f, 'utf-8').includes('[FILL'));
    expect(offenders).toEqual([]);
  });

  it('ships no invented company, street or e-mail (only via config/site-owner.ts)', () => {
    const offenders = walk(SRC)
      .filter((f) => !f.endsWith(path.join('config', 'site-owner.ts')))
      .filter((f) => /Musterstra(ß|ss)e|Musterstadt|RechenHafen Digital|[a-z]+@rechenhafen\.de/.test(fs.readFileSync(f, 'utf-8')));
    expect(offenders).toEqual([]);
  });

  it('never invents a default "Stand" date on calculator pages', () => {
    const page = fs.readFileSync(path.join(SRC, 'app', 'rechner', '[slug]', 'page.tsx'), 'utf-8');
    expect(page).not.toMatch(/\|\|\s*'20\d\d-\d\d-\d\d'/);
  });
});

describe('indexable calculator allowlist', () => {
  const liveSlugs = new Set(ALL_CALCULATORS.map((c) => c.slug));

  it('only lists calculators that actually exist', () => {
    const unknown = [...INDEXABLE_CALCULATOR_SLUGS].filter((s) => !liveSlugs.has(s));
    expect(unknown).toEqual([]);
  });

  it('sitemap contains exactly the indexable calculators', () => {
    const calcUrls = sitemap()
      .map((e) => e.url)
      .filter((u) => /\/rechner\/[^/]+\/$/.test(u))
      .map((u) => u.split('/').slice(-2, -1)[0]);
    expect(new Set(calcUrls)).toEqual(new Set([...INDEXABLE_CALCULATOR_SLUGS]));
  });
});

describe('retired calculators', () => {
  it('are gone from the live registry and the sitemap, and every one has a working 301 target', async () => {
    const { RETIRED_CALCULATORS } = await import('@/data/seo/retired-calculators');
    const { getCalculatorBySlug } = await import('@/data/calculators');
    const { CATEGORIES } = await import('@/data/categories');
    const nextConfig = (await import('../../next.config')).default;
    const redirects = await nextConfig.redirects!();
    const sitemapUrls = new Set(sitemap().map((e) => e.url));
    const categoryPaths = new Set(CATEGORIES.map((c) => `/${c.slug}/`));

    for (const [slug, target] of Object.entries(RETIRED_CALCULATORS)) {
      expect(getCalculatorBySlug(slug), slug).toBeUndefined();
      expect(sitemapUrls.has(`https://rechenhafen.de/rechner/${slug}/`), slug).toBe(false);
      expect(INDEXABLE_CALCULATOR_SLUGS.has(slug), slug).toBe(false);

      // A target may carry a preset query (e.g. ?mode=until) so visitors land in the right mode.
      const targetSlug = target.match(/^\/rechner\/([^/?]+)\/(?:\?[a-zA-Z]+=[a-z0-9]+)?$/)?.[1];
      if (targetSlug) expect(getCalculatorBySlug(targetSlug), `${slug} -> ${target}`).toBeDefined();
      else expect(categoryPaths.has(target), `${slug} -> ${target}`).toBe(true);

      for (const src of [`/rechner/${slug}`, `/rechner/${slug}/`]) {
        const r = redirects.find((x) => x.source === src);
        expect(r?.destination, src).toBe(target);
        expect(r && 'permanent' in r && r.permanent, src).toBe(true);
      }
    }
  });

  it('no live calculator links to a retired one via relatedSlugs', async () => {
    const { isCalculatorRetired } = await import('@/data/seo/retired-calculators');
    const offenders = ALL_CALCULATORS.flatMap((c) =>
      c.relatedSlugs.filter((s) => isCalculatorRetired(s)).map((s) => `${c.slug} -> ${s}`),
    );
    expect(offenders).toEqual([]);
  });
});

describe('redirect hygiene', () => {
  it('has no redirect chains: no destination is itself a redirect source', async () => {
    const nextConfig = (await import('../../next.config')).default;
    const redirects = await nextConfig.redirects!();
    const sources = new Set(redirects.map((r) => r.source.replace(/\/$/, '')));
    const chains = redirects
      .filter((r) => r.destination.startsWith('/') && sources.has(r.destination.split('?')[0].replace(/\/$/, '')))
      .map((r) => `${r.source} -> ${r.destination}`);
    expect(chains).toEqual([]);
  });
});
