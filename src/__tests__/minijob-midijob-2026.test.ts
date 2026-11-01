import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';
import { TAX_CONFIG_2025, TAX_CONFIG_2026 } from '@/data/regulated/tax';
import { GERMAN_DATA_2026 } from '@/data/regulated/2026';
import { calculateMidijob, calculateMinijob } from '@/lib/calculators/steuernGehalt';

/**
 * Regression tests for the 2026 Minijob/Midijob values. Expected numbers are derived
 * independently from the statutory formulas with literal constants:
 *  - § 8 Abs. 1a SGB IV: Geringfügigkeitsgrenze = ceil(Mindestlohn × 130 / 3)
 *    Mindestlohn 2026 = 13,90 € (MiLoV5, BGBl. 2025 I Nr. 268) → 603 €
 *  - § 20 Abs. 2a SGB IV: BE AN = OG / (OG − G) × (AE − G), OG = 2.000 €
 *    BE gesamt = F × G + (OG / (OG − G) − G / (OG − G) × F) × (AE − G), F 2026 = 0,6619
 *  - Minijob-Zentrale: RV-Eigenanteil 3,6 %, Arbeitgeber-Pauschalabgaben höchstens 31,17 %
 */
const G = 603;
const OG = 2000;
const F = 0.6619;
const FULL_RATE = 0.186 + 0.026 + 0.146 + 0.029 + 0.036;
const AN_RATE = FULL_RATE / 2;

const beArbeitnehmer = (ae: number) => (OG / (OG - G)) * (ae - G);
const beGesamt = (ae: number) => F * G + (OG / (OG - G) - (G / (OG - G)) * F) * (ae - G);

describe('2026 Minijob/Midijob statutory values', () => {
  it('derives the 2026 Minijob limit of 603 € from the 13,90 € Mindestlohn', () => {
    expect(Math.ceil((13.9 * 130) / 3)).toBe(603);
    expect(TAX_CONFIG_2026.minijobGrenze).toBe(603);
    expect(GERMAN_DATA_2026.minijob_grenze.value).toBe(603);
    expect(GERMAN_DATA_2026.mindestlohn_stunde.value).toBe(13.9);
  });

  it('keeps 2025 at 556 € (12,82 € Mindestlohn), not the 2024 value of 538 €', () => {
    expect(Math.ceil((12.82 * 130) / 3)).toBe(556);
    expect(TAX_CONFIG_2025.minijobGrenze).toBe(556);
  });

  it('uses Faktor F = 28 % ÷ Gesamtsozialversicherungsbeitragssatz (2026: 42,3 %, 2025: 41,9 %)', () => {
    expect(FULL_RATE * 100).toBeCloseTo(42.3, 10);
    expect(Math.round((28 / 42.3) * 10000) / 10000).toBe(0.6619);
    expect(TAX_CONFIG_2026.midijobFaktorF).toBe(0.6619);
    expect(Math.round((28 / 41.9) * 10000) / 10000).toBe(0.6683);
    expect(TAX_CONFIG_2025.midijobFaktorF).toBe(0.6683);
  });

  it('keeps the Übergangsbereich upper bound at 2.000 €', () => {
    expect(TAX_CONFIG_2026.midijobObergrenze).toBe(2000);
    expect(TAX_CONFIG_2025.midijobObergrenze).toBe(2000);
  });
});

describe('minijob-rechner and midijob-rechner share the 2026 values', () => {
  it('minijob-rechner caps 2026 earnings at 603 € and 2025 earnings at 556 €', () => {
    expect(calculateMinijob({ earnings: 700, rvOptOut: 'yes', taxYear: '2026' }).primary.value).toBe(603);
    expect(calculateMinijob({ earnings: 700, rvOptOut: 'yes', taxYear: '2025' }).primary.value).toBe(556);
  });

  it('minijob-rechner uses the Minijob-Zentrale rates: 31,17 % in 2026 (U1 0,8 %), 31,47 % in 2025 (U1 1,1 %)', () => {
    // 2026: 13 + 15 + 2 + 0,8 + 0,22 + 0,15 = 31,17 %; 603 € × 0,3117 = 187,9551 €
    const res2026 = calculateMinijob({ earnings: 603, rvOptOut: 'no', taxYear: '2026' });
    expect(Number(res2026.primary.value)).toBeCloseTo(603 - 603 * 0.036, 8);
    expect(Number(res2026.secondary?.find((s) => s.id === 'agTotalCosts')?.value)).toBeCloseTo(603 + 187.9551, 8);
    expect(Number(res2026.secondary?.find((s) => s.id === 'agLumpSum')?.value)).toBeCloseTo(187.9551, 8);
    expect(res2026.secondary?.find((s) => s.id === 'agLumpSum')?.label).toBe('AG-Pauschalabgaben (31,17 %)');
    expect(res2026.secondary?.find((s) => s.id === 'rvContribution')?.label).toBe('RV-Eigenanteil (3,6 %)');

    // 2025: 13 + 15 + 2 + 1,1 + 0,22 + 0,15 = 31,47 %; 556 € × 0,3147 = 174,9732 €
    const res2025 = calculateMinijob({ earnings: 556, rvOptOut: 'yes', taxYear: '2025' });
    expect(Number(res2025.secondary?.find((s) => s.id === 'agLumpSum')?.value)).toBeCloseTo(174.9732, 8);
    expect(res2025.secondary?.find((s) => s.id === 'agLumpSum')?.label).toBe('AG-Pauschalabgaben (31,47 %)');
  });

  it('midijob-rechner uses the § 20 Abs. 2a employee base (1.200 € → 854,69 €)', () => {
    const res = calculateMidijob({ earnings: 1200, taxYear: '2026' });
    const reducedBase = Number(res.secondary?.find((s) => s.id === 'reducedBase')?.value);
    const anSocial = Number(res.secondary?.find((s) => s.id === 'anSocial')?.value);
    expect(reducedBase).toBeCloseTo(beArbeitnehmer(1200), 6);
    expect(reducedBase).toBeCloseTo(854.69, 2);
    expect(anSocial).toBeCloseTo(beArbeitnehmer(1200) * AN_RATE, 6);
  });

  it('midijob-rechner 2025 uses G = 556 € (1.200 € → 2.000 / 1.444 × 644)', () => {
    const res = calculateMidijob({ earnings: 1200, taxYear: '2025' });
    const reducedBase = Number(res.secondary?.find((s) => s.id === 'reducedBase')?.value);
    expect(reducedBase).toBeCloseTo((2000 / 1444) * 644, 6);
  });

  it('minijob-rechner metadata is up to date for 2026', () => {
    const minijobCalc = getCalculatorBySlug('minijob-rechner')!;
    expect(minijobCalc).toBeDefined();
    expect(minijobCalc.h1).toContain('Minijob');
    expect(minijobCalc.metaTitle).toContain('603');
    expect(minijobCalc.timeSensitiveMeta?.year).toBe(2026);
  });

  it('midijob-rechner metadata is up to date for 2026', () => {
    const midijobCalc = getCalculatorBySlug('midijob-rechner')!;
    expect(midijobCalc).toBeDefined();
    expect(midijobCalc.h1).toContain('Midijob');
    expect(midijobCalc.timeSensitiveMeta?.year).toBe(2026);
  });
});
