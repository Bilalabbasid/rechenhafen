import { describe, it, expect } from 'vitest';
import { EXTRA_EINHEITEN_KOCHEN } from '@/data/calculators/extra/einheitenKochen';

describe('Nudeln-Rechner (nudeln-rohmaerk-gewicht-rechner)', () => {
  const pastaCalc = EXTRA_EINHEITEN_KOCHEN.find((c) => c.slug === 'nudeln-rohmaerk-gewicht-rechner');

  it('exists with expected URL and updated accessible title & description', () => {
    expect(pastaCalc).toBeDefined();
    expect(pastaCalc?.slug).toBe('nudeln-rohmaerk-gewicht-rechner');
    expect(pastaCalc?.name).toBe('Nudeln umrechnen: trocken, gekocht & Portionen');
    expect(pastaCalc?.metaTitle).toBe('Nudeln umrechnen: trocken, gekocht & Portionen');
    expect(pastaCalc?.metaDescription).toContain('Trockene und gekochte Nudeln umrechnen oder Portionen planen');
    expect(pastaCalc?.metaDescription).toContain('anpassbarem Quellfaktor');
  });

  it('supports the 3 required modes in inputs definition', () => {
    const modeInput = pastaCalc?.inputs.find((i) => i.id === 'mode');
    expect(modeInput).toBeDefined();
    const modeValues = modeInput?.options?.map((o) => o.value);
    expect(modeValues).toContain('portion_plan');
    expect(modeValues).toContain('dry_to_cooked');
    expect(modeValues).toContain('cooked_to_dry');
  });

  describe('Conversion factor accuracy', () => {
    it('under explicitly selected factor of 2.3: 100 g dry -> 230 g cooked', () => {
      const res = pastaCalc?.calculate({
        mode: 'dry_to_cooked',
        dryGrams: 100,
        factorPreset: 'custom',
        customFactor: 2.3,
      });

      expect(res?.error).toBeUndefined();
      expect(res?.primary.value).toBe(230);
      expect(res?.primary.formattedValue).toContain('230 g gekocht');
      expect(res?.secondary?.find((s) => s.id === 'appliedFactor')?.formattedValue).toBe('Faktor 2,3');
    });

    it('under explicitly selected factor of 2.3: 230 g cooked -> 100 g dry', () => {
      const res = pastaCalc?.calculate({
        mode: 'cooked_to_dry',
        cookedGrams: 230,
        factorPreset: 'custom',
        customFactor: 2.3,
      });

      expect(res?.error).toBeUndefined();
      expect(res?.primary.value).toBe(100);
      expect(res?.primary.formattedValue).toContain('100 g trocken');
    });

    it('changing factor updates both directions consistently (e.g. fresh pasta factor 1.5)', () => {
      // 100 g dry -> 150 g cooked
      const resDry = pastaCalc?.calculate({
        mode: 'dry_to_cooked',
        dryGrams: 100,
        factorPreset: 'fresh',
      });
      expect(resDry?.primary.value).toBe(150);

      // 150 g cooked -> 100 g dry
      const resCooked = pastaCalc?.calculate({
        mode: 'cooked_to_dry',
        cookedGrams: 150,
        factorPreset: 'fresh',
      });
      expect(resCooked?.primary.value).toBe(100);
    });

    it('rejects invalid, zero, or negative conversion factors', () => {
      const resZero = pastaCalc?.calculate({
        mode: 'dry_to_cooked',
        dryGrams: 100,
        factorPreset: 'custom',
        customFactor: 0,
      });
      expect(resZero?.error).toBeDefined();
      expect(resZero?.error).toContain('größer als 0');

      const resNeg = pastaCalc?.calculate({
        mode: 'dry_to_cooked',
        dryGrams: 100,
        factorPreset: 'custom',
        customFactor: -1.5,
      });
      expect(resNeg?.error).toBeDefined();

      const resNan = pastaCalc?.calculate({
        mode: 'dry_to_cooked',
        dryGrams: 100,
        factorPreset: 'custom',
        customFactor: 'abc',
      });
      expect(resNan?.error).toBeDefined();
    });

    it('rejects invalid or zero gram inputs appropriately', () => {
      const resEmptyDry = pastaCalc?.calculate({
        mode: 'dry_to_cooked',
        dryGrams: '',
      });
      expect(resEmptyDry?.error).toBeDefined();

      const resZeroDry = pastaCalc?.calculate({
        mode: 'dry_to_cooked',
        dryGrams: 0,
      });
      expect(resZeroDry?.error).toBeDefined();

      const resEmptyCooked = pastaCalc?.calculate({
        mode: 'cooked_to_dry',
        cookedGrams: -50,
      });
      expect(resEmptyCooked?.error).toBeDefined();
    });
  });

  describe('Portion planning mode', () => {
    it('calculates portion for 4 persons with 110 g dry pasta and 10-100-1000 water rule', () => {
      const res = pastaCalc?.calculate({
        mode: 'portion_plan',
        personsCount: 4,
        mealType: 'mainDish',
        factorPreset: 'aldente',
      });

      expect(res?.error).toBeUndefined();
      expect(res?.primary.value).toBe(440); // 4 * 110 = 440 g
      expect(res?.primary.formattedValue).toContain('440 g');

      // 440 * 2.3 = 1012 g (no weird decimals like 1003.2)
      const cookedSec = res?.secondary?.find((s) => s.id === 'cookedPasta');
      expect(cookedSec?.value).toBe(1012);

      // Water: 440 / 100 = 4.4 liters (not silently jumped to 5 liters without explanation)
      const waterSec = res?.secondary?.find((s) => s.id === 'waterReq');
      expect(waterSec?.value).toBe(4.4);
      expect(waterSec?.formattedValue).toContain('4,4 Liter');

      // Salt: 4.4 * 10 = 44 g
      const saltSec = res?.secondary?.find((s) => s.id === 'saltReq');
      expect(saltSec?.value).toBe(44);

      // Topf-Empfehlung in qualifications
      expect(res?.qualifications?.[0]).toContain('Topfvolumen');
    });

    it('supports custom grams per person', () => {
      const res = pastaCalc?.calculate({
        mode: 'portion_plan',
        personsCount: 2,
        mealType: 'custom',
        customGramsPerPerson: 85,
        factorPreset: 'aldente',
      });

      expect(res?.primary.value).toBe(170); // 2 * 85 = 170 g
      expect(res?.directAnswer).toContain('170 g');
    });
  });
});
