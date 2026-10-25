import { describe, it, expect } from 'vitest';
import { ALL_CALCULATORS, getCalculatorBySlug } from '@/data/calculators';
import { calculateAbfindung } from '@/lib/calculators/steuernGehalt';
import sitemap from '@/app/sitemap';
import nextConfig from '../../next.config';
import { CalculatorDefinition } from '@/types/calculator';
import { expectScopedSitemapLastmod } from './seo-ctr-helpers';

/**
 * Ranking-gap work (2026-10-25): Abfindung consolidation, LKW-Maut rates from
 * Anlage 1 BFStrMG, gas m³→kWh reference table.
 */

const get = (slug: string): CalculatorDefinition => {
  const c = getCalculatorBySlug(slug);
  if (!c) throw new Error(`missing ${slug}`);
  return c;
};
const sec = (res: ReturnType<CalculatorDefinition['calculate']>, id: string) => res.secondary?.find((s) => s.id === id);

describe('Abfindung: duplicate consolidated into /rechner/abfindungsrechner/', () => {
  const OLD = 'abfindung-fuenftelregelung-rechner';

  it('permanently redirects the old URL (with and without trailing slash)', async () => {
    const redirects = await nextConfig.redirects!();
    for (const source of [`/rechner/${OLD}`, `/rechner/${OLD}/`]) {
      const r = redirects.find((x) => x.source === source);
      expect(r, source).toBeDefined();
      expect(r!.destination).toBe('/rechner/abfindungsrechner/');
      expect('permanent' in r! && r!.permanent).toBe(true);
    }
  });

  it('removes the duplicate from registry, sitemap and related links', () => {
    expect(getCalculatorBySlug(OLD)).toBeUndefined();
    expect(sitemap().some((e) => e.url.includes(OLD))).toBe(false);
    for (const c of ALL_CALCULATORS) expect(c.relatedSlugs, c.slug).not.toContain(OLD);
    expect(sitemap().some((e) => e.url === 'https://rechenhafen.de/rechner/abfindungsrechner/')).toBe(true);
  });

  it('keeps the verified engine and uses its numbers in example and table', () => {
    const calc = get('abfindungsrechner');
    expect(calc.calculate).toBe(calculateAbfindung);
    const r = calculateAbfindung({ regularIncome: 45000, abfindung: 35000, taxYear: '2026' });
    expect(calc.workedExample.resultSummary).toContain(r.primary.formattedValue);
    const table = calc.quickReference![0].content;
    for (const a of [10000, 20000, 30000, 40000, 50000]) {
      const x = calculateAbfindung({ regularIncome: 45000, abfindung: a, taxYear: '2026' });
      expect(table).toContain(`| ${x.secondary!.find((s) => s.id === 'taxFuenftel')!.formattedValue} | ${x.secondary!.find((s) => s.id === 'taxSavings')!.formattedValue} | ${x.primary.formattedValue} |`);
    }
  });

  it('Fünftelregelung formula matches independent arithmetic on the engine', () => {
    const r = calculateAbfindung({ regularIncome: 45000, abfindung: 35000, taxYear: '2026' });
    const tax = sec(r, 'taxFuenftel')!.value as number;
    expect(r.primary.value).toBeCloseTo(35000 - tax, 6);
    expect(sec(r, 'taxSavings')!.value as number).toBeCloseTo((sec(r, 'taxRegular')!.value as number) - tax, 6);
  });

  it('explains the 2025 payroll change and states what is not included', () => {
    const text = JSON.stringify(get('abfindungsrechner'));
    expect(text).toContain('Seit 2025');
    expect(text).toContain('Einkommensteuererklärung');
    expect(text).toContain('Solidaritätszuschlag');
    expect(get('abfindungsrechner').metaTitle).toBe('Abfindungsrechner 2026: Fünftelregelung, Steuer & Netto');
  });
});

describe('LKW-Maut: rates from Anlage 1 BFStrMG', () => {
  const calc = get('lkw-maut-deutschland-rechner');
  const rate = (weightClass: string, euroClass = 'euro6', co2Class = '1') =>
    sec(calc.calculate({ distanceKm: 100, weightClass, euroClass, co2Class }), 'ratePerKm')!.value as number;

  it('EURO VI / CO₂-Klasse 1: infrastructure + air + noise + CO₂ (ct/km)', () => {
    // Independent sums of the Anlage-1 components
    expect(rate('from3_5to7_5')).toBeCloseTo(5.2 + 1.1 + 1.4 + 7.4, 6); // 15,1
    expect(rate('from7_5to12')).toBeCloseTo(6.6 + 1.5 + 1.6 + 8.0, 6); // 17,7
    expect(rate('from12to18')).toBeCloseTo(10.7 + 1.5 + 1.6 + 10.0, 6); // 23,8
    expect(rate('over18t_upto3axles')).toBeCloseTo(14.1 + 2.2 + 1.6 + 12.4, 6); // 30,3
    expect(rate('over18t_4axles')).toBeCloseTo(15.5 + 2.3 + 1.2 + 13.4, 6); // 32,4
    expect(rate('over18t_5plusaxles')).toBeCloseTo(15.5 + 2.3 + 1.2 + 15.8, 6); // 34,8
  });

  it('older Euro classes and better CO₂ classes', () => {
    expect(rate('over18t_5plusaxles', 'euro5')).toBeCloseTo(15.5 + 6.2 + 1.2 + 16.0, 6); // 38,9
    expect(rate('over18t_upto3axles', 'euro3')).toBeCloseTo(14.1 + 13.4 + 1.6 + 13.8, 6); // 42,9
    expect(rate('from3_5to7_5', 'euro1')).toBeCloseTo(5.2 + 10.2 + 1.4 + 8.0, 6); // 24,8
    expect(rate('over18t_5plusaxles', 'euro6', '4')).toBeCloseTo(15.5 + 2.3 + 1.2 + 7.9, 6); // 26,9
    expect(rate('over18t_4axles', 'euro6', '2')).toBeCloseTo(15.5 + 2.3 + 1.2 + 12.8, 6); // 31,8
  });

  it('350 km Sattelzug 5 Achsen EURO VI = 121,80 €; emission-free = 0 € (exempt until 30.06.2031)', () => {
    expect(calc.calculate({ distanceKm: 350, weightClass: 'over18t_5plusaxles', euroClass: 'euro6', co2Class: '1' }).primary.value).toBeCloseTo(121.8, 6);
    const zero = calc.calculate({ distanceKm: 350, weightClass: 'over18t_5plusaxles', euroClass: 'euro6', co2Class: '5' });
    expect(zero.primary.value).toBe(0);
    expect(JSON.stringify(zero)).toContain('30.06.2031');
  });

  it('rejects blank/invalid distance and maps the legacy selection value', () => {
    expect(calc.calculate({ distanceKm: '', weightClass: 'from12to18' }).error).toBeTruthy();
    expect(calc.calculate({ distanceKm: -5, weightClass: 'from12to18' }).error).toBeTruthy();
    expect(calc.calculate({ distanceKm: 0, weightClass: 'from12to18' }).primary.value).toBe(0);
    expect(rate('over18t_5axles')).toBeCloseTo(34.8, 6);
  });

  it('toll table equals the calculator output and the outdated FAQ claim is gone', () => {
    const table = calc.quickReference![0].content;
    expect(table).toContain('| > 3,5 bis < 7,5 t | 15,1 |');
    expect(table).toContain('| > 18 t, ab 5 Achsen | 34,8 | 34,0 | 33,2 | 26,9 |');
    const text = JSON.stringify(calc);
    expect(text).not.toContain('bis Ende 2025 vollständig von der LKW-Maut befreit');
    expect(text).toContain('30. Juni 2031');
  });
});

describe('Gas m³→kWh reference table', () => {
  const calc = get('gasverbrauch-kwh-m3-rechner');
  it('rows equal the calculator output with the default Brennwert, Zustandszahl and price', () => {
    const table = calc.quickReference![0].content;
    for (const m3 of [100, 500, 1000, 1500, 2000]) {
      const res = calc.calculate({ inputMode: 'volume', gasCubicMeters: m3, brennwert: 10.8, zustandszahl: 0.95, gasPricePerKwh: 11 });
      const kwh = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(res.primary.value as number);
      expect(table).toContain(`| ${new Intl.NumberFormat('de-DE').format(m3)} m³ | ${kwh} kWh | ${sec(res, 'consumptionCost')!.formattedValue} |`);
    }
  });
});

describe('Ranking-gap pages: sitemap lastmod scope', () => {
  it('bumps lastmod only for materially changed pages', () => {
    expectScopedSitemapLastmod(['abfindungsrechner', 'lkw-maut-deutschland-rechner']);
  });
});
