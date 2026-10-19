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
});
