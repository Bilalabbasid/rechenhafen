import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';
import { GAS_CLUSTER_CONFIG } from '@/components/calculator/GasClusterLinks';
import { getCalc, secondary as sec, fmtDe, expectCleanMetadata, expectScopedSitemapLastmod } from './seo-ctr-helpers';

/**
 * Phase A of the scoped SEO/CTR update: Nudeln, Heizöl, Gaskosten.
 * Copy may change; URLs, calculator maths and table/calculator consistency must not.
 */

const PHASE_A = ['nudeln-rohmaerk-gewicht-rechner', 'oelheizung-verbrauch-rechner', 'gaskostenrechner'];

describe('Phase A: metadata and technical SEO', () => {
  it('keeps URLs and uses clean, unique metadata with a quick reference', () => {
    expectCleanMetadata(PHASE_A);
  });

  it('pins the new titles and H1s', () => {
    expect(getCalc('nudeln-rohmaerk-gewicht-rechner').metaTitle).toBe('Nudeln pro Person: roh & gekocht umrechnen');
    expect(getCalc('nudeln-rohmaerk-gewicht-rechner').h1).toBe('Nudel-Rechner: Menge pro Person und roh/gekocht umrechnen');
    expect(getCalc('oelheizung-verbrauch-rechner').metaTitle).toBe('Heizölverbrauch berechnen: Liter pro m², Jahr & Kosten');
    expect(getCalc('oelheizung-verbrauch-rechner').h1).toBe('Heizölverbrauch berechnen: Liter pro Jahr und Heizölkosten');
    expect(getCalc('gaskostenrechner').metaTitle).toBe('Gaskostenrechner: kWh, m³, Grundpreis & Monatskosten');
    expect(getCalc('gaskostenrechner').h1).toBe('Gaskosten berechnen: Jahreskosten, Grundpreis und Monatsdurchschnitt');
  });

  it('bumps sitemap lastmod only for the changed pages', () => {
    expectScopedSitemapLastmod(PHASE_A);
  });

  it('does not describe the gas monthly average as a supplier Abschlag', () => {
    const gas = getCalc('gaskostenrechner');
    for (const field of [gas.metaTitle, gas.h1, gas.metaDescription, gas.shortDescription]) {
      expect(field).not.toMatch(/Abschlag/);
    }
    expect(JSON.stringify(gas)).not.toContain('verlässliche Richtgröße für Ihre Abschlagszahlung');
  });
});

describe('NUDELN regression', () => {
  const calc = getCalc('nudeln-rohmaerk-gewicht-rechner');

  it('dried default: 4 × 110 g = 440 g → 1.012 g gekocht', () => {
    const defaults = Object.fromEntries(calc.inputs.map((i) => [i.id, i.defaultValue]));
    const res = calc.calculate(defaults);
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(440);
    expect(sec(res, 'cookedPasta')?.value).toBe(1012);
  });

  it('fresh default: 4 × 150 g = 600 g → 900 g gekocht (not identical to dried yield)', () => {
    const res = calc.calculate({ mode: 'portion_plan', factorPreset: 'fresh', personsCount: 4, mealType: 'mainDish' });
    expect(res.primary.value).toBe(600);
    expect(sec(res, 'cookedPasta')?.value).toBe(900);
  });

  it('custom portion: 3 × 95 g dried = 285 g → 656 g gekocht', () => {
    const res = calc.calculate({ mode: 'portion_plan', factorPreset: 'aldente', personsCount: 3, mealType: 'custom', customGramsPerPerson: 95 });
    expect(res.primary.value).toBe(285);
    expect(sec(res, 'cookedPasta')?.value).toBe(Math.round(285 * 2.3));
  });

  it('mode changes: dry→cooked and cooked→dry', () => {
    expect(calc.calculate({ mode: 'dry_to_cooked', factorPreset: 'aldente', dryGrams: 100 }).primary.value).toBe(230);
    expect(calc.calculate({ mode: 'dry_to_cooked', factorPreset: 'fresh', dryGrams: 100 }).primary.value).toBe(150);
    expect(calc.calculate({ mode: 'cooked_to_dry', factorPreset: 'aldente', cookedGrams: 100 }).primary.value).toBe(43);
    expect(calc.calculate({ mode: 'dry_to_cooked', factorPreset: 'soft', dryGrams: 200 }).primary.value).toBe(500);
  });

  it('zero, empty and invalid inputs return an error without a stale value', () => {
    const cases = [
      { mode: 'portion_plan', personsCount: '' },
      { mode: 'portion_plan', personsCount: 0 },
      { mode: 'dry_to_cooked', dryGrams: '' },
      { mode: 'dry_to_cooked', dryGrams: 'abc' },
      { mode: 'cooked_to_dry', cookedGrams: -5 },
      { mode: 'dry_to_cooked', factorPreset: 'custom', customFactor: '' },
    ];
    for (const inputs of cases) {
      const res = calc.calculate({ factorPreset: 'aldente', ...inputs });
      expect(res.error, JSON.stringify(inputs)).toBeTruthy();
      expect(res.primary.value).toBe(0);
      expect(res.primary.formattedValue).toBe('–');
    }
  });

  it('quick reference rows equal the calculator output (1 person and 2–8 persons)', () => {
    const content = calc.quickReference![0].content;
    const meals: Array<[string, string]> = [
      ['Hauptgericht', 'mainDish'],
      ['Großer Hunger', 'bigHunger'],
      ['Beilage / Vorspeise', 'sideDish'],
      ['Kinderportion', 'kids'],
    ];
    for (const [label, meal] of meals) {
      const dry = calc.calculate({ mode: 'portion_plan', factorPreset: 'aldente', personsCount: 1, mealType: meal });
      const fresh = calc.calculate({ mode: 'portion_plan', factorPreset: 'fresh', personsCount: 1, mealType: meal });
      expect(content).toContain(
        `| ${label} | ${dry.primary.value} g → ca. ${sec(dry, 'cookedPasta')?.value} g | ${fresh.primary.value} g → ca. ${sec(fresh, 'cookedPasta')?.value} g |`
      );
    }
    for (const p of [2, 4, 6, 8]) {
      const dry = calc.calculate({ mode: 'portion_plan', factorPreset: 'aldente', personsCount: p, mealType: 'mainDish' });
      const fresh = calc.calculate({ mode: 'portion_plan', factorPreset: 'fresh', personsCount: p, mealType: 'mainDish' });
      expect(content).toContain(
        `| ${p} Personen | ${fmtDe(dry.primary.value as number)} g → ca. ${fmtDe(sec(dry, 'cookedPasta')!.value as number)} g | ${fmtDe(fresh.primary.value as number)} g → ca. ${fmtDe(sec(fresh, 'cookedPasta')!.value as number)} g |`
      );
    }
  });

  it('existing conversion table matches the calculator (e.g. 70 g → 161 g)', () => {
    const table = calc.content!.sections!.find((s) => s.title.startsWith('Umrechnungstabelle'))!.content;
    for (const g of [50, 70, 100, 110, 125, 150, 250, 500]) {
      const res = calc.calculate({ mode: 'dry_to_cooked', factorPreset: 'aldente', dryGrams: g });
      expect(table).toContain(`**${g} g trocken:** ca. ${fmtDe(res.primary.value as number)} g gekocht`);
    }
  });

  it('dropdown labels match the configured portion values', () => {
    const meal = calc.inputs.find((i) => i.id === 'mealType')!;
    expect(meal.options?.find((o) => o.value === 'mainDish')?.label).toContain('110 g');
    expect(meal.conditionalOptions?.[0].options.find((o) => o.value === 'mainDish')?.label).toContain('150 g');
  });
});

describe('HEIZÖL regression', () => {
  const calc = getCalc('oelheizung-verbrauch-rechner');

  it('140 m² × 14 l/m² = 1.960 l; 1.960 l × 1,05 € = 2.058 €', () => {
    const res = calc.calculate({ livingArea: 140, insulationStandard: 'standard', oilPricePerLiter: 1.05 });
    expect(res.error).toBeUndefined();
    expect(sec(res, 'totalLiters')?.value).toBe(1960);
    expect(res.primary.value).toBe(2058);
    expect(sec(res, 'litersPerSqm')?.formattedValue).toBe('14 l/m² pro Jahr (Modellannahme)');
    expect(res.calculationSteps?.[0]).toBe('140 m² × 14 l/m² pro Jahr = 1.960 Liter pro Jahr');
  });

  it('zero price gives zero cost while litres stay unchanged', () => {
    const res = calc.calculate({ livingArea: 140, insulationStandard: 'standard', oilPricePerLiter: 0 });
    expect(res.primary.value).toBe(0);
    expect(sec(res, 'totalLiters')?.value).toBe(1960);
  });

  it('scenario table equals calculator output for every area and condition', () => {
    const content = calc.quickReference![0].content;
    for (const area of [100, 140, 180]) {
      const cells = ['modern', 'standard', 'unrenovated'].map((k) => {
        const res = calc.calculate({ livingArea: area, insulationStandard: k, oilPricePerLiter: 1.05 });
        return `${fmtDe(sec(res, 'totalLiters')!.value as number)} l (${res.primary.formattedValue})`;
      });
      expect(content).toContain(`| ${area} m² | ${cells.join(' | ')} |`);
    }
    expect(content).toContain('Heizölverbrauch = Wohnfläche × angenommener Verbrauch in Liter pro m² und Jahr');
    expect(content).toContain('keine gemessenen Durchschnittswerte');
  });

  it('links to a genuinely related CO₂ calculator from the heating cluster', () => {
    const hrefs = GAS_CLUSTER_CONFIG['oelheizung-verbrauch-rechner'].links.map((l) => l.href);
    expect(hrefs).toContain('/rechner/co2-preis-rechner/');
    expect(getCalculatorBySlug('co2-preis-rechner')).toBeDefined();
  });
});

describe('GAS regression', () => {
  const calc = getCalc('gaskostenrechner');
  const base = { inputType: 'kwh', annualKwh: 12000, priceUnit: 'eur', pricePerKwh: 0.1, basePricePeriod: 'yearly', basePrice: 120 };

  it('12.000 kWh × 0,10 € + 120 € = 1.320 €/Jahr, 110 €/Monat', () => {
    const res = calc.calculate(base);
    expect(res.primary.value).toBeCloseTo(1320, 6);
    expect(sec(res, 'monthlyPayment')?.value).toBeCloseTo(110, 6);
  });

  it('cent unit and monthly base price give the same result', () => {
    const res = calc.calculate({ ...base, priceUnit: 'ct', pricePerKwh: 10, basePricePeriod: 'monthly', basePrice: 10 });
    expect(res.primary.value).toBeCloseTo(1320, 6);
  });

  it('meter-reading mode converts m³ to kWh with Brennwert × Zustandszahl', () => {
    const res = calc.calculate({ ...base, inputType: 'm3', meterOld: 12400, meterNew: 13800, calorificValue: 10.3, stateFactor: 0.95, priceUnit: 'ct', pricePerKwh: 11, basePricePeriod: 'monthly', basePrice: 12 });
    expect(sec(res, 'totalKwh')?.value).toBeCloseTo(1400 * 10.3 * 0.95, 6);
    expect(res.primary.value).toBeCloseTo(1400 * 10.3 * 0.95 * 0.11 + 144, 6);
  });

  it('zero values are allowed, blanks are rejected', () => {
    expect(calc.calculate({ ...base, pricePerKwh: 0, basePrice: 0 }).primary.value).toBe(0);
    expect(calc.calculate({ ...base, annualKwh: 0 }).primary.value).toBeCloseTo(120, 6);
    expect(calc.calculate({ ...base, pricePerKwh: '' }).error).toBeTruthy();
    expect(calc.calculate({ ...base, basePrice: '' }).error).toBeTruthy();
    expect(calc.calculate({ ...base, annualKwh: '' }).error).toBeTruthy();
    expect(calc.calculate({ ...base, inputType: 'm3', meterOld: '', meterNew: '' }).error).toBeTruthy();
  });

  it('quick reference example is produced by the calculator function', () => {
    const content = calc.quickReference![0].content;
    expect(content).toMatch(/12\.000 kWh × 0,10 €\/kWh = 1\.200,00\s€/);
    expect(content).toMatch(/= Jahreskosten \| 1\.320,00\s€/);
    expect(content).toMatch(/÷ 12 = 110,00\s€/);
    expect(content).toContain('kein Abschlag Ihres Versorgers');
  });
});
