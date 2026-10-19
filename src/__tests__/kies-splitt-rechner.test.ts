import { describe, it, expect } from 'vitest';
import { ALL_CALCULATORS } from '@/data/calculators';

describe('Kies- & Splitt-Rechner (kies-splitt-rechner)', () => {
  const calc = ALL_CALCULATORS.find((c) => c.slug === 'kies-splitt-rechner')!;

  it('exists in the registry with valid metadata and 3 calculation modes', () => {
    expect(calc).toBeDefined();
    expect(calc.slug).toBe('kies-splitt-rechner');
    const modeInput = calc.inputs.find((i) => i.id === 'calcMode');
    expect(modeInput?.options?.length).toBe(3);
  });

  it('calculates 30 m² at 5 cm with 0 % allowance (1.50 m³ base, 2.25 t at 1.50 t/m³)', () => {
    const res = calc.calculate({
      calcMode: 'area_depth',
      area: 30,
      depth: 5,
      materialType: 'grit_2_5',
      compaction: 0,
    });

    const baseVol = res.secondary?.find((s) => s.id === 'baseVolume');
    const allowanceVol = res.secondary?.find((s) => s.id === 'allowanceVol');
    const totalVol = res.secondary?.find((s) => s.id === 'totalVolume');

    expect(baseVol?.value).toBe(1.50);
    expect(allowanceVol?.value).toBe(0.00);
    expect(totalVol?.value).toBe(1.50);
    expect(res.primary.value).toBe(2.25);
    expect(res.primary.formattedValue).toContain('2,25 Tonnen');
  });

  it('calculates known volume 2 m³ at 1.50 t/m³ to exactly 3.00 tonnes', () => {
    const res = calc.calculate({
      calcMode: 'volume_to_weight',
      knownVolumeM3: 2.0,
      materialType: 'grit_2_5',
    });

    expect(res.primary.value).toBe(3.00);
    expect(res.primary.formattedValue).toBe('3 Tonnen');
    const volSec = res.secondary?.find((s) => s.id === 'volume');
    expect(volSec?.value).toBe(2.0);
  });

  it('calculates known weight 3 tonnes at 1.50 t/m³ to exactly 2.00 m³', () => {
    const res = calc.calculate({
      calcMode: 'weight_to_volume',
      knownWeightTonnes: 3.0,
      materialType: 'grit_2_5',
    });

    expect(res.primary.value).toBe(2.00);
    expect(res.primary.formattedValue).toBe('2 m³');
    const weightSec = res.secondary?.find((s) => s.id === 'tonnesInput');
    expect(weightSec?.value).toBe(3.0);
  });

  it('supports custom density input correctly', () => {
    const res = calc.calculate({
      calcMode: 'volume_to_weight',
      knownVolumeM3: 2.0,
      materialType: 'custom',
      customDensity: 1.65,
    });

    expect(res.primary.value).toBe(3.30);
    expect(res.primary.formattedValue).toBe('3,3 Tonnen');
  });

  it('separates base volume and allowance cleanly when compaction is applied', () => {
    const res = calc.calculate({
      calcMode: 'area_depth',
      area: 30,
      depth: 5,
      materialType: 'crushed_0_32',
      compaction: 15,
    });

    const baseVol = res.secondary?.find((s) => s.id === 'baseVolume');
    const allowanceVol = res.secondary?.find((s) => s.id === 'allowanceVol');
    const totalVol = res.secondary?.find((s) => s.id === 'totalVolume');

    expect(baseVol?.value).toBe(1.50);
    expect(allowanceVol?.value).toBe(0.225);
    expect(totalVol?.value).toBe(1.725);
    expect(res.primary.value).toBe(3.105);
  });

  describe('Independent acceptance examples', () => {
    it('30 m² × 0.05 m = 1.5 m³ at 1.50 t/m³ = 2.25 tonnes', () => {
      const res = calc.calculate({
        calcMode: 'area_depth',
        area: 30,
        depth: 5,
        materialType: 'grit_2_5',
        compaction: 0,
      });
      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(2.25);
      expect(res.secondary?.find((s) => s.id === 'baseVolume')?.value).toBe(1.5);
    });

    it('2 m³ at 1.60 t/m³ (gravel) = 3.2 tonnes', () => {
      const res = calc.calculate({
        calcMode: 'volume_to_weight',
        knownVolumeM3: 2.0,
        materialType: 'gravel_16_32',
      });
      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(3.2);
      expect(res.primary.formattedValue).toContain('3,2 Tonnen');
    });

    it('3 tonnes at 1.50 t/m³ = 2 m³', () => {
      const res = calc.calculate({
        calcMode: 'weight_to_volume',
        knownWeightTonnes: 3.0,
        materialType: 'grit_2_5',
      });
      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(2.0);
      expect(res.primary.formattedValue).toBe('2 m³');
    });
  });

  describe('Validation and custom density error handling', () => {
    it('rejects blank, zero, negative, or nonnumeric custom density without falling back to 1.50', () => {
      const resEmpty = calc.calculate({
        calcMode: 'volume_to_weight',
        knownVolumeM3: 2.0,
        materialType: 'custom',
        customDensity: '',
      });
      expect(resEmpty.error).toBeDefined();
      expect(resEmpty.error).toContain('individuelle Schüttdichte');

      const resZero = calc.calculate({
        calcMode: 'volume_to_weight',
        knownVolumeM3: 2.0,
        materialType: 'custom',
        customDensity: 0,
      });
      expect(resZero.error).toBeDefined();
      expect(resZero.error).toContain('positive Zahl größer als 0');

      const resNeg = calc.calculate({
        calcMode: 'volume_to_weight',
        knownVolumeM3: 2.0,
        materialType: 'custom',
        customDensity: -1.2,
      });
      expect(resNeg.error).toBeDefined();

      const resNan = calc.calculate({
        calcMode: 'volume_to_weight',
        knownVolumeM3: 2.0,
        materialType: 'custom',
        customDensity: 'ungültig',
      });
      expect(resNan.error).toBeDefined();
    });

    it('rejects missing or zero active quantities in all modes', () => {
      const resAreaMissing = calc.calculate({ calcMode: 'area_depth', area: '', depth: 5 });
      expect(resAreaMissing.error).toBeDefined();

      const resDepthZero = calc.calculate({ calcMode: 'area_depth', area: 20, depth: 0 });
      expect(resDepthZero.error).toBeDefined();

      const resVolMissing = calc.calculate({ calcMode: 'volume_to_weight', knownVolumeM3: 0 });
      expect(resVolMissing.error).toBeDefined();

      const resWeightMissing = calc.calculate({ calcMode: 'weight_to_volume', knownWeightTonnes: 0 });
      expect(resWeightMissing.error).toBeDefined();
    });
  });
});
