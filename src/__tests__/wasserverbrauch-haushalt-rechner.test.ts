import { describe, it, expect } from 'vitest';
import { EXTRA_WOHNEN_HAUSHALT } from '@/data/calculators/extra/wohnenHaushalt';

describe('Wasserverbrauch-Rechner (wasserverbrauch-haushalt-rechner)', () => {
  const calc = EXTRA_WOHNEN_HAUSHALT.find((c) => c.slug === 'wasserverbrauch-haushalt-rechner')!;

  it('exists in registry with updated metadata and 5 validated inputs', () => {
    expect(calc).toBeDefined();
    expect(calc.slug).toBe('wasserverbrauch-haushalt-rechner');
    expect(calc.inputs.length).toBe(5);
    expect(calc.inputs.map((i) => i.id)).toEqual([
      'persons',
      'dailyLitersPerPerson',
      'freshWaterPrice',
      'wasteWaterPrice',
      'fixedFeeYear',
    ]);
  });

  describe('Standard Acceptance Criteria', () => {
    it('calculates standard example: 3 persons × 125 l/day × 365 ÷ 1000 = 136.875 m³, at 2.10 € + 2.70 € = 657,00 €', () => {
      const res = calc.calculate({
        persons: 3,
        dailyLitersPerPerson: 125,
        freshWaterPrice: 2.10,
        wasteWaterPrice: 2.70,
        fixedFeeYear: 0,
      });

      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(657);
      expect(res.primary.formattedValue).toBe('657,00\u00a0€');

      const m3Sec = res.secondary?.find((s) => s.id === 'totalYearlyM3');
      expect(m3Sec?.value).toBe(136.875);
      expect(m3Sec?.formattedValue).toContain('136,88 m³');
      expect(m3Sec?.formattedValue).toContain('136.875 Liter');

      const monthlySec = res.secondary?.find((s) => s.id === 'monthlyCost');
      expect(monthlySec?.label).toContain('Rechnerischer Monatsdurchschnitt');
      expect(monthlySec?.value).toBe(657 / 12);
      expect(monthlySec?.formattedValue).toBe('54,75\u00a0€');
    });

    it('calculates with water 2.10 € and wastewater 0.00 €: 136.875 × 2.10 = 287.4375 € (displayed 287,44 €)', () => {
      const res = calc.calculate({
        persons: 3,
        dailyLitersPerPerson: 125,
        freshWaterPrice: 2.10,
        wasteWaterPrice: 0,
        fixedFeeYear: 0,
      });

      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(287.4375);
      expect(res.primary.formattedValue).toBe('287,44\u00a0€');
    });

    it('calculates with both variable prices zero: 0,00 € variable charges', () => {
      const res = calc.calculate({
        persons: 3,
        dailyLitersPerPerson: 125,
        freshWaterPrice: 0,
        wasteWaterPrice: 0,
        fixedFeeYear: 0,
      });

      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(0);
      expect(res.primary.formattedValue).toBe('0,00\u00a0€');

      const varSec = res.secondary?.find((s) => s.id === 'variableCost');
      expect(varSec?.value).toBe(0);
      expect(varSec?.formattedValue).toBe('0,00\u00a0€');
    });

    it('calculates with annual fixed fee of 120 €: 657 € + 120 € = 777,00 €/year', () => {
      const res = calc.calculate({
        persons: 3,
        dailyLitersPerPerson: 125,
        freshWaterPrice: 2.10,
        wasteWaterPrice: 2.70,
        fixedFeeYear: 120,
      });

      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(777);
      expect(res.primary.formattedValue).toBe('777,00\u00a0€');

      const fixedSec = res.secondary?.find((s) => s.id === 'fixedFeeSec');
      expect(fixedSec?.value).toBe(120);
      expect(fixedSec?.formattedValue).toBe('120,00\u00a0€');

      const monthlySec = res.secondary?.find((s) => s.id === 'monthlyCost');
      expect(monthlySec?.value).toBe(777 / 12);
      expect(monthlySec?.formattedValue).toBe('64,75\u00a0€');
    });

    it('allows legitimate zero consumption (0 liters/day for vacancy)', () => {
      const res = calc.calculate({
        persons: 1,
        dailyLitersPerPerson: 0,
        freshWaterPrice: 2.10,
        wasteWaterPrice: 2.70,
        fixedFeeYear: 60,
      });

      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(60);
      expect(res.primary.formattedValue).toBe('60,00\u00a0€');
    });
  });

  describe('Validation & Edge Cases', () => {
    it('rejects fractional persons (e.g. 2.5 persons) without silent truncation', () => {
      const res = calc.calculate({
        persons: 2.5,
        dailyLitersPerPerson: 125,
        freshWaterPrice: 2.10,
        wasteWaterPrice: 2.70,
      });

      expect(res.error).toBeDefined();
      expect(res.error).toContain('ganze Zahl');
    });

    it('rejects zero or negative persons count', () => {
      const resZero = calc.calculate({ persons: 0, dailyLitersPerPerson: 125, freshWaterPrice: 2.10, wasteWaterPrice: 2.70 });
      expect(resZero.error).toBeDefined();

      const resNeg = calc.calculate({ persons: -2, dailyLitersPerPerson: 125, freshWaterPrice: 2.10, wasteWaterPrice: 2.70 });
      expect(resNeg.error).toBeDefined();
    });

    it('rejects blank inputs (blank is not zero)', () => {
      const resBlankPersons = calc.calculate({ persons: '', dailyLitersPerPerson: 125, freshWaterPrice: 2.10, wasteWaterPrice: 2.70 });
      expect(resBlankPersons.error).toBeDefined();

      const resBlankLiters = calc.calculate({ persons: 3, dailyLitersPerPerson: '', freshWaterPrice: 2.10, wasteWaterPrice: 2.70 });
      expect(resBlankLiters.error).toBeDefined();

      const resBlankFresh = calc.calculate({ persons: 3, dailyLitersPerPerson: 125, freshWaterPrice: '', wasteWaterPrice: 2.70 });
      expect(resBlankFresh.error).toBeDefined();

      const resBlankWaste = calc.calculate({ persons: 3, dailyLitersPerPerson: 125, freshWaterPrice: 2.10, wasteWaterPrice: '' });
      expect(resBlankWaste.error).toBeDefined();
    });

    it('rejects negative prices and negative consumption', () => {
      const resNegLiters = calc.calculate({ persons: 3, dailyLitersPerPerson: -50, freshWaterPrice: 2.10, wasteWaterPrice: 2.70 });
      expect(resNegLiters.error).toBeDefined();

      const resNegFresh = calc.calculate({ persons: 3, dailyLitersPerPerson: 125, freshWaterPrice: -2.10, wasteWaterPrice: 2.70 });
      expect(resNegFresh.error).toBeDefined();

      const resNegWaste = calc.calculate({ persons: 3, dailyLitersPerPerson: 125, freshWaterPrice: 2.10, wasteWaterPrice: -2.70 });
      expect(resNegWaste.error).toBeDefined();

      const resNegFixed = calc.calculate({ persons: 3, dailyLitersPerPerson: 125, freshWaterPrice: 2.10, wasteWaterPrice: 2.70, fixedFeeYear: -50 });
      expect(resNegFixed.error).toBeDefined();
    });
  });
});
