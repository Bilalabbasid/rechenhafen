import { describe, it, expect } from 'vitest';
import { ALL_CALCULATORS } from '@/data/calculators';
import { CATEGORIES } from '@/data/categories';
import { resolveIcon } from '@/components/common/CalculatorCard';
import { resolveAccent } from '@/lib/ui/categoryAccents';

describe('CalculatorCard icons and accents', () => {
  it('every calculator resolves to an icon component', () => {
    for (const c of ALL_CALCULATORS) expect(resolveIcon(c.slug, c.category), c.slug).toBeTruthy();
  });

  it('every category has its own accent colour', () => {
    const seen = new Set<string>();
    for (const cat of CATEGORIES) {
      const accent = resolveAccent(cat.slug);
      expect(accent.fg, cat.slug).toMatch(/^#[0-9a-f]{6}$/);
      seen.add(accent.fg);
    }
    expect(seen.size).toBe(CATEGORIES.length);
  });

  it('popular calculators on the homepage get distinct, fitting icons', () => {
    const icon = (slug: string) => resolveIcon(slug, ALL_CALCULATORS.find((c) => c.slug === slug)?.category);
    const homepage = ['brutto-netto-rechner', 'prozentrechner', 'tage-zwischen-zwei-daten', 'altersrechner', 'bmi-rechner', 'spritkostenrechner', 'kreditrechner', 'zinseszinsrechner', 'stundenlohnrechner'];
    expect(new Set(homepage.map(icon)).size).toBe(homepage.length);
  });

  it('avoids known keyword collisions', () => {
    const cat = (slug: string) => ALL_CALCULATORS.find((c) => c.slug === slug)?.category;
    expect(resolveIcon('schokolade-temperieren-rechner', cat('schokolade-temperieren-rechner'))).not.toBe(resolveIcon('e-auto-ladekosten-zuhause-rechner'));
    expect(resolveIcon('motorrad-unterhaltskosten-rechner')).not.toBe(resolveIcon('unterhaltsvorschuss-rechner'));
    expect(resolveIcon('mietrendite-brutto-netto-rechner')).not.toBe(resolveIcon('brutto-netto-rechner'));
  });
});
