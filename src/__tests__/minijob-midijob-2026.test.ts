import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';
import { TAX_CONFIG_2025, TAX_CONFIG_2026 } from '@/data/regulated/tax';
import { GERMAN_DATA_2026 } from '@/data/regulated/2026';
import { calculateMidijob, calculateMinijob } from '@/lib/calculators/steuernGehalt';

/**
 * Regression tests for the 2026 Minijob/Midijob values. Expected numbers are derived
 * independently from the statutory formulas with literal constants, not from the config:
 *  - § 8 Abs. 1a SGB IV: Geringfügigkeitsgrenze = ceil(Mindestlohn × 130 / 3)
 *    Mindestlohn 2026 = 13,90 € (MiLoV5, BGBl. 2025 I Nr. 268) → 603 €
 *  - § 20 Abs. 2a SGB IV: BE AN = OG / (OG − G) × (AE − G), OG = 2.000 €
 *    BE gesamt = F × G + (OG / (OG − G) − G / (OG − G) × F) × (AE − G), F 2026 = 0,6619
 *  - Minijob-Zentrale: RV-Eigenanteil 3,6 %, Arbeitgeber-Pauschalabgaben höchstens 31,17 %
 */
const G = 603;
const OG = 2000;
const F = 0.6619;
// Gesamtsozialversicherungsbeitragssatz 2026 = 42,3 % (die Basis von Faktor F):
// RV 18,6 + ALV 2,6 + KV 14,6 + Ø-Zusatzbeitrag 2,9 (BMG, BAnz AT 10.11.2025 B7) + PV 3,6 (ohne Kinderlosenzuschlag)
const FULL_RATE = 0.186 + 0.026 + 0.146 + 0.029 + 0.036;
const AN_RATE = FULL_RATE / 2;

const beArbeitnehmer = (ae: number) => (OG / (OG - G)) * (ae - G);
const beGesamt = (ae: number) => F * G + (OG / (OG - G) - (G / (OG - G)) * F) * (ae - G);

// § 32a Abs. 1 EStG 2026, nur Zonen 1–2 (reicht bis zvE 17.799 €)
const est2026 = (zvE: number) => {
  const x = Math.floor(zvE);
  if (x <= 12348) return 0;
  if (x > 17799) throw new Error('zvE outside zone 2 — extend the test helper');
  const y = (x - 12348) / 10000;
  return Math.floor((914.51 * y + 1400) * y);
};
const lohnsteuerMonat = (gross: number, sv: number) => est2026(Math.max(0, (gross - sv) * 12 - 1230)) / 12;

const calc = getCalculatorBySlug('minijob-midijob-rechner');
if (!calc) throw new Error('minijob-midijob-rechner not found in registry');
const run = (monthlyGross: number, pensionOptOut: 'keep' | 'exempt' = 'keep') => calc.calculate({ monthlyGross, pensionOptOut });
const secondary = (res: ReturnType<typeof run>, id: string) => Number(res.secondary?.find((s) => s.id === id)?.value);

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

describe('minijob-midijob-rechner (2026)', () => {
  it('602,99 €: Minijob with 3,6 % RV-Eigenanteil and 31,17 % employer flat rate', () => {
    const res = run(602.99);
    expect(res.primary.id).toBe('net');
    expect(Number(res.primary.value)).toBeCloseTo(602.99 * (1 - 0.036), 6);
    expect(secondary(res, 'employerCosts')).toBeCloseTo(602.99 * 0.3117, 6);
    expect(res.secondary?.find((s) => s.id === 'jobType')?.formattedValue).toContain('Minijob');
  });

  it('603,00 €: still a Minijob (limit is inclusive)', () => {
    expect(Number(run(603, 'exempt').primary.value)).toBe(603);
    const keep = run(603, 'keep');
    expect(Number(keep.primary.value)).toBeCloseTo(603 - 21.708, 6);
    expect(secondary(keep, 'rvDeduction')).toBeCloseTo(21.708, 6);
    expect(keep.secondary?.find((s) => s.id === 'jobType')?.formattedValue).toContain('Minijob');
  });

  it('603,01 €: Übergangsbereich starts with an employee base of almost 0 €', () => {
    const res = run(603.01);
    expect(res.secondary?.find((s) => s.id === 'jobType')?.formattedValue).toBe('Übergangsbereich (Midijob)');
    expect(secondary(res, 'beArbeitnehmer')).toBeCloseTo(beArbeitnehmer(603.01), 8);
    expect(secondary(res, 'beArbeitnehmer')).toBeLessThan(0.02);
    expect(secondary(res, 'svDeduction')).toBeCloseTo(beArbeitnehmer(603.01) * AN_RATE, 8);
    // Employer pays the contribution on F × G minus the (tiny) employee share
    expect(secondary(res, 'employerContribution')).toBeCloseTo(beGesamt(603.01) * FULL_RATE - beArbeitnehmer(603.01) * AN_RATE, 6);
    // No cliff for the employee at the Minijob limit (compared with an RV-exempt Minijob)
    expect(Math.abs(Number(res.primary.value) - 603)).toBeLessThan(0.02);
  });

  it.each([604, 850, 1200, 1500, 1999.99])('%s €: employee contribution follows § 20 Abs. 2a SGB IV', (gross) => {
    const res = run(gross);
    const an = beArbeitnehmer(gross) * AN_RATE;
    const ag = beGesamt(gross) * FULL_RATE - an;
    expect(secondary(res, 'beArbeitnehmer')).toBeCloseTo(beArbeitnehmer(gross), 6);
    expect(secondary(res, 'svDeduction')).toBeCloseTo(an, 6);
    expect(secondary(res, 'employerContribution')).toBeCloseTo(ag, 6);
    expect(secondary(res, 'taxEstimate')).toBeCloseTo(lohnsteuerMonat(gross, an), 6);
    expect(Number(res.primary.value)).toBeCloseTo(gross - an - lohnsteuerMonat(gross, an), 6);
  });

  it('850 €: matches the published worked example (353,61 € base, 74,79 € SV, 775,21 € net)', () => {
    // 2.000 / 1.397 × 247 = 353,6149 €; × 21,15 % = 74,7895 €; Lohnsteuer 0 € (zvE unter Grundfreibetrag)
    const res = run(850);
    expect(secondary(res, 'beArbeitnehmer')).toBeCloseTo(353.61, 2);
    expect(secondary(res, 'svDeduction')).toBeCloseTo(74.79, 2);
    expect(Number(res.primary.value)).toBeCloseTo(775.21, 2);
  });

  it('2.000 €: both bases equal the full wage, employer and employee pay equal halves', () => {
    const res = run(2000);
    expect(beGesamt(2000)).toBeCloseTo(2000, 8);
    expect(secondary(res, 'beArbeitnehmer')).toBeCloseTo(2000, 8);
    expect(secondary(res, 'svDeduction')).toBeCloseTo(2000 * AN_RATE, 6);
    expect(secondary(res, 'employerContribution')).toBeCloseTo(2000 * AN_RATE, 6);
  });

  it('2.000,01 €: regular employment with the full employee share and no cliff', () => {
    const res = run(2000.01);
    expect(res.primary.id).toBe('netNormal');
    expect(secondary(res, 'svNormal')).toBeCloseTo(2000.01 * AN_RATE, 6);
    expect(Math.abs(Number(res.primary.value) - Number(run(2000).primary.value))).toBeLessThan(0.05);
  });

  it('shows no outdated limits in page copy', () => {
    const { calculate: _calculate, ...data } = calc;
    const copy = JSON.stringify(data);
    expect(copy).not.toMatch(/\b538\b/);
    expect(copy).not.toMatch(/\b556\b/);
    expect(copy).toContain('603');
    expect(calc.metaTitle).toContain('2026');
    expect(calc.timeSensitiveMeta?.lastVerified).toBe('2026-10-25');
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

  it('midijob-rechner and minijob-midijob-rechner agree on the employee contribution', () => {
    for (const gross of [700, 1200, 1800]) {
      const midi = calculateMidijob({ earnings: gross, taxYear: '2026' });
      const combined = run(gross);
      expect(Number(midi.secondary?.find((s) => s.id === 'anSocial')?.value)).toBeCloseTo(secondary(combined, 'svDeduction'), 8);
    }
  });
});
