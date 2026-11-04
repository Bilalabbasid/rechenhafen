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
