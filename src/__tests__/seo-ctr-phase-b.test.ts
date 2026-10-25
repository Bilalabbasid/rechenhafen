import { describe, it, expect } from 'vitest';
import { getCalc, secondary as sec, fmtDe, expectCleanMetadata, expectScopedSitemapLastmod } from './seo-ctr-helpers';

/**
 * Phase B of the scoped SEO/CTR update: Marmelade/Gelierzucker, Zucker/Erythrit, Zwischenfinanzierung.
 * Copy may change; URLs, calculator maths and table/calculator consistency must not.
 */

const PHASE_B = ['marmelade-geliermittel-rechner', 'zucker-ersatz-rechner', 'zwischenfinanzierung-rechner'];

describe('Phase B: metadata and technical SEO', () => {
  it('keeps URLs and uses clean, unique metadata with a quick reference', () => {
    expectCleanMetadata(PHASE_B);
  });

  it('pins the new titles and H1s', () => {
    expect(getCalc('marmelade-geliermittel-rechner').metaTitle).toBe('Gelierzucker-Rechner: 1:1, 2:1 & 3:1 für Marmelade');
    expect(getCalc('marmelade-geliermittel-rechner').h1).toBe('Gelierzucker für Marmelade berechnen');
    expect(getCalc('zucker-ersatz-rechner').metaTitle).toBe('Zucker in Erythrit umrechnen: Verhältnis & Tabelle');
    expect(getCalc('zucker-ersatz-rechner').h1).toBe('Zucker und Erythrit umrechnen');
    expect(getCalc('zwischenfinanzierung-rechner').metaTitle).toBe('Zwischenfinanzierung-Rechner: Zinskosten beim Hauskauf');
    expect(getCalc('zwischenfinanzierung-rechner').h1).toBe('Zwischenfinanzierung berechnen: Zinsen pro Monat und gesamt');
  });

  it('bumps sitemap lastmod only for the changed pages', () => {
    expectScopedSitemapLastmod(PHASE_B);
  });

  it('removes unsourced rate claims and states the finance limitations', () => {
    const zwf = JSON.stringify(getCalc('zwischenfinanzierung-rechner'));
    expect(zwf).not.toContain('1 bis 2 Prozentpunkte');
    expect(zwf).toContain('kein aktueller Marktzins');
    expect(zwf).toContain('keine Finanzierungsberatung');
  });
});

describe('ZUCKER / ERYTHRIT regression (70 % model)', () => {
  const calc = getCalc('zucker-ersatz-rechner');
  const toEry = (g: number) => calc.calculate({ direction: 'sugar_to_sub', sugarGrams: g, substitute: 'erythrit' }).primary.value;
  const toSugar = (g: number) => calc.calculate({ direction: 'erythrit_to_sugar', erythritGrams: g }).primary.value;

  it('matches independent arithmetic', () => {
    expect(toEry(100)).toBe(Math.round(100 / 0.7)); // 142,86 → 143
    expect(toSugar(100)).toBe(70);
    expect(toSugar(60)).toBe(42);
    expect(toEry(150)).toBe(Math.round(150 / 0.7)); // 214,29 → 214
    expect(toSugar(0)).toBe(0);
  });

  it('keeps the other sweeteners', () => {
    const subs = calc.inputs.find((i) => i.id === 'substitute')!.options!.map((o) => o.value);
    expect(subs).toEqual(['erythrit', 'xylit', 'honey', 'agave', 'stevia']);
    expect(calc.calculate({ direction: 'sugar_to_sub', sugarGrams: 100, substitute: 'xylit' }).primary.value).toBe(100);
    expect(calc.calculate({ direction: 'sugar_to_sub', sugarGrams: 100, substitute: 'honey' }).primary.value).toBe(83);
  });

  it('quick reference tables equal the calculator output', () => {
    const content = calc.quickReference![0].content;
    for (const g of [20, 50, 60, 80, 100, 120, 150, 200]) {
      expect(content).toContain(`| ${g} g Erythrit | ${toSugar(g)} g Zucker`);
    }
    for (const g of [50, 100, 120, 150, 200, 250]) {
      expect(content).toContain(`| ${g} g Zucker | ${toEry(g)} g Erythrit`);
    }
    expect(content).toContain('142,86 g');
    expect(content).toContain('214,29 g');
    expect(content).toContain('vergleichen nur die Süße');
  });
});

describe('MARMELADE / GELIERZUCKER regression', () => {
  const calc = getCalc('marmelade-geliermittel-rechner');
  const sugar = (fruit: number, ratio: string) =>
    calc.calculate({ fruitGrams: fruit, sugarType: ratio, jarSizeMl: '250' }).primary.value as number;

  it('supports 1:1, 2:1 and 3:1 with independent arithmetic', () => {
    const ratios = calc.inputs.find((i) => i.id === 'sugarType')!.options!.map((o) => o.value).sort();
    expect(ratios).toEqual(['1_1', '2_1', '3_1']);
    for (const fruit of [500, 750, 1000, 1500, 2000, 1234]) {
      expect(sugar(fruit, '1_1')).toBe(fruit);
      expect(sugar(fruit, '2_1')).toBe(Math.round(fruit / 2));
      expect(sugar(fruit, '3_1')).toBe(Math.round(fruit / 3));
    }
    expect(sugar(1000, '2_1')).toBe(500);
    expect(sugar(1500, '3_1')).toBe(500);
  });

  it('keeps jar, lemon and yield outputs unchanged (1.500 g, 2:1 → 750 g, 7 jars)', () => {
    const res = calc.calculate({ fruitGrams: 1500, sugarType: '2_1', jarSizeMl: '250' });
    expect(res.primary.value).toBe(750);
    expect(sec(res, 'yield')?.value).toBe(Math.round(2250 * 0.92));
    expect(sec(res, 'jars')?.value).toBe(7);
    expect(sec(res, 'lemon')?.value).toBe(30);
  });

  it('ratio table equals the calculator output', () => {
    const content = calc.quickReference![0].content;
    for (const fruit of [500, 750, 1000, 1500, 2000]) {
      expect(content).toContain(`| ${fmtDe(fruit)} g | ${fmtDe(sugar(fruit, '1_1'))} g | ${fmtDe(sugar(fruit, '2_1'))} g | ${fmtDe(sugar(fruit, '3_1'))} g |`);
    }
    expect(content).toContain('Anleitung auf Ihrer Packung');
  });
});

describe('ZWISCHENFINANZIERUNG regression', () => {
  const calc = getCalc('zwischenfinanzierung-rechner');

  it('120.000 € × 5,2 % ÷ 12 = 520 €/Monat; 12 Monate = 6.240 €; endfällig 120.000 €', () => {
    const res = calc.calculate({ loan: 120000, rate: 5.2, months: 12 });
    expect(res.error).toBeUndefined();
    expect(sec(res, 'monthly')?.value).toBeCloseTo(520, 8);
    expect(res.primary.value).toBeCloseTo(6240, 8);
    expect(sec(res, 'bullet')?.value).toBe(120000);
    expect(sec(res, 'totalRepayment')?.value).toBeCloseTo(126240, 8);
  });

  it('independent arithmetic for another case (250.000 €, 4,75 %, 9 Monate)', () => {
    const res = calc.calculate({ loan: 250000, rate: 4.75, months: 9 });
    const monthly = (250000 * 0.0475) / 12;
    expect(sec(res, 'monthly')?.value).toBeCloseTo(monthly, 8);
    expect(res.primary.value).toBeCloseTo(monthly * 9, 8);
  });

  it('0 % is allowed; blank or invalid rate/months no longer fall back silently', () => {
    expect(calc.calculate({ loan: 100000, rate: 0, months: 6 }).primary.value).toBe(0);
    expect(calc.calculate({ loan: 100000, rate: '', months: 6 }).error).toBeTruthy();
    expect(calc.calculate({ loan: 100000, rate: -1, months: 6 }).error).toBeTruthy();
    expect(calc.calculate({ loan: 100000, rate: 5, months: '' }).error).toBeTruthy();
    expect(calc.calculate({ loan: 100000, rate: 5, months: 0 }).error).toBeTruthy();
    expect(calc.calculate({ loan: '', rate: 5, months: 6 }).error).toBeTruthy();
    expect(calc.calculate({ loan: 100000, rate: '4,8', months: 10 }).primary.value).toBeCloseTo(4000, 8);
  });

  it('quick reference example matches the calculator', () => {
    const content = calc.quickReference![0].content;
    for (const m of [6, 12, 18]) {
      const res = calc.calculate({ loan: 120000, rate: 5.2, months: m });
      expect(content).toContain(`| ${m} Monate | ${sec(res, 'monthly')?.formattedValue} | ${res.primary.formattedValue} |`);
    }
  });
});
