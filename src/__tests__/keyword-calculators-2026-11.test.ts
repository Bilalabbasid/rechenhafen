import { describe, it, expect } from 'vitest';
import { ALL_CALCULATORS, getCalculatorBySlug } from '@/data/calculators';
import { loadCalculatorEngine } from '@/lib/calculators/dynamic-loader';
import { isCalculatorRetired } from '@/data/seo/retired-calculators';
import { PFAENDUNGSFREIGRENZEN, pfaendungsFreibetrag } from '@/lib/calculators/steuerRecht';
import { LEGAL_VALUES_2026 } from '@/legal/de';
import sitemap from '@/app/sitemap';

const run = (slug: string, inputs: Record<string, any>) => getCalculatorBySlug(slug)!.calculate(inputs);

describe('every live calculator can load its engine in the browser', () => {
  it('maps each live slug to a module that really contains it', async () => {
    const missing: string[] = [];
    for (const c of ALL_CALCULATORS) if (!(await loadCalculatorEngine(c.slug))) missing.push(c.slug);
    expect(missing).toEqual([]);
  }, 60000);
});

describe('restored calculators are live, indexable and in the sitemap', () => {
  const urls = new Set(sitemap().map((e) => e.url));
  for (const slug of ['temperatur-umrechner', 'quader-volumen-rechner', 'marge-rechner', 'pfaendungsrechner', 'ehegattensplitting-rechner']) {
    it(slug, () => {
      expect(isCalculatorRetired(slug)).toBe(false);
      expect(getCalculatorBySlug(slug)).toBeDefined();
      expect(urls.has(`https://rechenhafen.de/rechner/${slug}/`)).toBe(true);
    });
  }
});

describe('Temperatur-Umrechner', () => {
  it('converts the textbook values', () => {
    expect(run('temperatur-umrechner', { value: 25, fromUnit: 'C', toUnit: 'F' }).primary.value).toBeCloseTo(77, 6);
    expect(run('temperatur-umrechner', { value: 350, fromUnit: 'F', toUnit: 'C' }).primary.value).toBeCloseTo(176.6667, 3);
    expect(run('temperatur-umrechner', { value: 20, fromUnit: 'C', toUnit: 'K' }).primary.value).toBeCloseTo(293.15, 6);
    expect(run('temperatur-umrechner', { value: -40, fromUnit: 'C', toUnit: 'F' }).primary.value).toBeCloseTo(-40, 6);
  });
  it('rejects temperatures below absolute zero', () => {
    expect(run('temperatur-umrechner', { value: -300, fromUnit: 'C', toUnit: 'F' }).error).toMatch(/absoluten Nullpunkt/);
    expect(run('temperatur-umrechner', { value: 0, fromUnit: 'K', toUnit: 'C' }).error).toBeUndefined();
  });
});

describe('Quader- und Würfel-Rechner', () => {
  it('cuboid 10 × 6 × 4', () => {
    const r = run('quader-volumen-rechner', { body: 'quader', lengthA: 10, widthB: 6, heightC: 4 });
    expect(r.primary.value).toBe(240);
    expect(r.secondary!.find((s) => s.id === 'surface')!.value).toBe(248);
  });
  it('cube ignores width and height', () => {
    const r = run('quader-volumen-rechner', { body: 'wuerfel', lengthA: 5, widthB: 99, heightC: 99 });
    expect(r.primary.value).toBe(125);
    expect(r.secondary!.find((s) => s.id === 'surface')!.value).toBe(150);
  });
  it('rejects zero edges', () => {
    expect(run('quader-volumen-rechner', { body: 'quader', lengthA: 10, widthB: 0, heightC: 4 }).error).toBeDefined();
  });
});

describe('Marge-Rechner', () => {
  it('margin and markup from prices', () => {
    const r = run('marge-rechner', { mode: 'fromPrices', purchasePrice: 40, sellingPrice: 100 });
    expect(r.primary.value).toBeCloseTo(60, 6);
    expect(r.secondary!.find((s) => s.id === 'markup')!.value).toBeCloseTo(150, 6);
  });
  it('selling price for a target margin is not the same as a markup', () => {
    expect(run('marge-rechner', { mode: 'priceFromMargin', purchasePrice: 70, targetMargin: 30 }).primary.value).toBeCloseTo(100, 6);
    expect(run('marge-rechner', { mode: 'priceFromMarkup', purchasePrice: 70, markupPercent: 30 }).primary.value).toBeCloseTo(91, 6);
  });
  it('rejects a margin of 100 % or more', () => {
    expect(run('marge-rechner', { mode: 'priceFromMargin', purchasePrice: 70, targetMargin: 100 }).error).toBeDefined();
  });
  it('old URLs without a mode still work', () => {
    expect(run('marge-rechner', { purchasePrice: 40, sellingPrice: 100 }).primary.value).toBeCloseTo(60, 6);
  });
});

describe('Pfändungsrechner (§ 850c ZPO)', () => {
  it('uses the limits valid from 1 July 2026, also in the legal data', () => {
    expect(PFAENDUNGSFREIGRENZEN['2026']).toMatchObject({ grundbetrag: 1587.4, ersteUnterhaltspflicht: 597.42, weitereUnterhaltspflicht: 332.83, vollPfaendbarAb: 4866.3 });
    expect(LEGAL_VALUES_2026.pfaendungsfreigrenzeGrundbetrag.value).toBe(1587.4);
    expect(pfaendungsFreibetrag('2026', 1)).toBeCloseTo(2184.82, 2);
    expect(pfaendungsFreibetrag('2026', 5)).toBeCloseTo(3516.14, 2);
    expect(pfaendungsFreibetrag('2026', 9)).toBe(pfaendungsFreibetrag('2026', 5));
  });
  it('matches the official table steps (income rounded down to 10 €)', () => {
    expect(run('pfaendungsrechner', { netIncome: 1589.99, dependents: 0, period: '2026' }).primary.value).toBe(0);
    expect(run('pfaendungsrechner', { netIncome: 1590, dependents: 0, period: '2026' }).primary.value).toBeCloseTo(1.82, 2);
    expect(run('pfaendungsrechner', { netIncome: 1560, dependents: 0, period: '2025' }).primary.value).toBeCloseTo(3.5, 2);
    expect(run('pfaendungsrechner', { netIncome: 2000, dependents: 0, period: '2026' }).primary.value).toBeCloseTo(288.82, 2);
    expect(run('pfaendungsrechner', { netIncome: 2500, dependents: 1, period: '2026' }).primary.value).toBeCloseTo(157.59, 2);
  });
  it('income above the cap is fully garnishable', () => {
    const r = run('pfaendungsrechner', { netIncome: 6000, dependents: 0, period: '2026' });
    const belowCap = (4860 - 1587.4) * 0.7;
    expect(r.primary.value).toBeCloseTo(belowCap + (6000 - 4866.3), 1);
  });
});

describe('Ehegattensplitting-Rechner', () => {
  it('equal incomes give no advantage', () => {
    expect(run('ehegattensplitting-rechner', { incomeA: 40000, incomeB: 40000, taxYear: '2026' }).primary.value).toBe(0);
  });
  it('the single earner gets the biggest advantage', () => {
    const one = Number(run('ehegattensplitting-rechner', { incomeA: 60000, incomeB: 0, taxYear: '2026' }).primary.value);
    const two = Number(run('ehegattensplitting-rechner', { incomeA: 60000, incomeB: 20000, taxYear: '2026' }).primary.value);
    expect(one).toBeGreaterThan(two);
    expect(two).toBeGreaterThan(0);
  });
  it('joint tax equals the splitting tariff of the income tax calculator', () => {
    const r = run('ehegattensplitting-rechner', { incomeA: 60000, incomeB: 20000, taxYear: '2026' });
    const est = run('einkommensteuerrechner', { taxableIncome: 80000, tariffType: 'splitting', taxYear: '2026', churchTaxRate: '0' });
    const estPlusSoli = Number(est.primary.value) + Number(est.secondary!.find((s) => s.id === 'solz')!.value);
    expect(Number(r.secondary!.find((s) => s.id === 'together')!.value)).toBeCloseTo(estPlusSoli, 2);
  });
});

describe('keyword pages', () => {
  it('new and changed titles stay specific', () => {
    expect(getCalculatorBySlug('prozentrechner')!.metaTitle).toContain('Prozent berechnen');
    expect(getCalculatorBySlug('mwst-rechner')!.metaTitle).toContain('Umsatzsteuer');
    expect(getCalculatorBySlug('tilgungsrechner')!.metaTitle).toContain('Hypothekenrechner');
    expect(getCalculatorBySlug('temperatur-umrechner')!.metaTitle).toContain('Celsius in Fahrenheit');
  });
});
