import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';
import { RETIRED_CALCULATORS } from '@/data/seo/retired-calculators';

describe('Mietbudget absorbs Mietbelastungsquote', () => {
  const calc = getCalculatorBySlug('mietbudget-rechner')!;

  it('the old URL is retired and points here', () => {
    expect(getCalculatorBySlug('mietbelastungsquote-rechner')).toBeUndefined();
    expect(RETIRED_CALCULATORS['mietbelastungsquote-rechner']).toBe('/rechner/mietbudget-rechner/');
  });

  it('without a rent it returns the budget (3.000 € × 30 % = 900 €)', () => {
    const r = calc.calculate({ netIncome: 3000, targetPercent: '30', warmRent: 0 });
    expect(r.error).toBeUndefined();
    expect(Number(r.primary.value)).toBeCloseTo(900, 6);
  });

  it('with a rent it returns the burden ratio and the gap to the budget', () => {
    const r = calc.calculate({ netIncome: 3200, targetPercent: '30', warmRent: 1150 });
    expect(r.error).toBeUndefined();
    expect(r.primary.id).toBe('ratio');
    expect(Number(r.primary.value)).toBeCloseTo((1150 / 3200) * 100, 6); // 35,94 %
    const gap = r.secondary?.find((x) => x.id === 'budgetGap');
    expect(gap?.label).toBe('Über Ihrem Mietbudget');
    expect(Number(gap?.value)).toBeCloseTo(1150 - 960, 6);
    expect(r.directAnswer).toContain('Erhöht');
  });

  it('handles empty, zero and negative input without throwing', () => {
    expect(() => calc.calculate({ netIncome: '', targetPercent: '30', warmRent: '' })).not.toThrow();
    expect(calc.calculate({ netIncome: 0, targetPercent: '30', warmRent: 500 }).error).toBeTruthy();
    const neg = calc.calculate({ netIncome: 3000, targetPercent: '30', warmRent: -100 });
    expect(neg.error).toBeUndefined(); // negative rent is ignored -> budget only
    expect(Number(neg.primary.value)).toBeCloseTo(900, 6);
  });
});

describe('Betonrechner absorbs Beton-Mischungsverhältnis', () => {
  const calc = getCalculatorBySlug('betonrechner')!;

  it('the old URL is retired and points here', () => {
    expect(getCalculatorBySlug('beton-mischungsverhaeltnis-rechner')).toBeUndefined();
    expect(RETIRED_CALCULATORS['beton-mischungsverhaeltnis-rechner']).toBe('/rechner/betonrechner/');
  });

  it('bags mode: 3 × 2 × 0,15 m + 5 % = 0,945 m³ -> 80 bags à 25 kg', () => {
    const r = calc.calculate({ lengthM: 3, widthM: 2, depthCm: 15, reservePercent: '5', supplyMode: 'bags', bagWeightKg: 25 });
    expect(Number(r.primary.value)).toBeCloseTo(0.945, 6);
    expect(r.secondary?.find((x) => x.id === 'bags')?.value).toBe(Math.ceil((0.945 * 2100) / 25));
  });

  it('mix mode C20/25: 0,525 m³ -> 158 kg cement (7 sacks), 945 kg gravel, 87 l water', () => {
    const r = calc.calculate({ lengthM: 2, widthM: 0.5, depthCm: 50, reservePercent: '5', supplyMode: 'mix', mixRatio: 'standard' });
    expect(r.secondary?.find((x) => x.id === 'cementSacks')?.value).toBe(7);
    expect(r.secondary?.find((x) => x.id === 'gravelKg')?.value).toBe(945);
    expect(r.secondary?.find((x) => x.id === 'waterL')?.value).toBe(87);
  });

  it('transport mode shows fresh concrete weight; big volumes get a transport hint in other modes', () => {
    const t = calc.calculate({ lengthM: 5, widthM: 4, depthCm: 20, reservePercent: '0', supplyMode: 'transport' });
    expect(Number(t.primary.value)).toBeCloseTo(4, 6);
    expect(t.warning).toBeUndefined();
    const b = calc.calculate({ lengthM: 5, widthM: 4, depthCm: 20, reservePercent: '0', supplyMode: 'bags', bagWeightKg: 25 });
    expect(b.warning).toContain('Transportbeton');
  });

  it('rejects zero or negative dimensions and tolerates odd inputs', () => {
    expect(calc.calculate({ lengthM: 0, widthM: 2, depthCm: 15, supplyMode: 'bags' }).error).toBeTruthy();
    expect(calc.calculate({ lengthM: 3, widthM: -2, depthCm: 15, supplyMode: 'mix' }).error).toBeTruthy();
    expect(() => calc.calculate({ lengthM: 3, widthM: 2, depthCm: 15, supplyMode: 'mix', mixRatio: 'unknown' })).not.toThrow();
    const noBag = calc.calculate({ lengthM: 3, widthM: 2, depthCm: 15, reservePercent: '0', supplyMode: 'bags', bagWeightKg: 0 });
    expect(noBag.secondary?.find((x) => x.id === 'bags')?.value).toBe(Math.ceil((0.9 * 2100) / 25)); // falls back to 25 kg
  });
});
