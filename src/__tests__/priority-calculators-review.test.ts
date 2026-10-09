import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';

describe('Priority Calculators Manual Quality & Boundary Review', () => {
  const PRIORITY_SLUGS = [
    'gaskostenrechner',
    'dienstfahrrad-jobrad-rechner',
    'schalungssteine-rechner',
    'kfz-steuer-rechner',
    'spritkostenrechner',
    'kinderzuschlag-kiz-rechner',
    'buergergeld-anspruch-rechner',
    'renten-brutto-netto-rechner',
    'kapitalertragsteuer-rechner',
    'stromkosten-geraete-rechner',
  ];

  it('all 10 priority calculators exist in the registry', () => {
    for (const slug of PRIORITY_SLUGS) {
      const calc = getCalculatorBySlug(slug);
      expect(calc, `Calculator ${slug} should exist`).toBeDefined();
    }
  });

  describe('1. Empty values handling', () => {
    it('returns structured validation errors or safe fallbacks without NaN/crashing on empty inputs', () => {
      for (const slug of PRIORITY_SLUGS) {
        const calc = getCalculatorBySlug(slug)!;
        const emptyInputs: Record<string, any> = {};
        for (const input of calc.inputs) {
          emptyInputs[input.id] = '';
        }
        const result = calc.calculate(emptyInputs);
        expect(result).toBeDefined();
        if (result.error) {
          expect(typeof result.error).toBe('string');
          expect(result.error.length).toBeGreaterThan(0);
        } else if (result.primary) {
          const val = String(result.primary.value);
          expect(val.includes('NaN')).toBe(false);
          expect(val.includes('Infinity')).toBe(false);
        }
      }
    });
  });

  describe('2. Zero values handling', () => {
    it('handles zero values cleanly and logically for optional/zero-able fields', () => {
      // 1. gaskostenrechner: 0 kWh gives 0 EUR or base price only
      const gas = getCalculatorBySlug('gaskostenrechner')!;
      const gasRes = gas.calculate({ inputType: 'kwh', annualKwh: 0, pricePerKwh: 0.10, basePricePerMonth: 10 });
      expect(gasRes.error).toBeUndefined();
      expect(gasRes.primary.value).toBe(120); // 12 months * 10 EUR base fee

      // 2. dienstfahrrad-jobrad-rechner: 0 employer subsidy is normal scenario
      const jobrad = getCalculatorBySlug('dienstfahrrad-jobrad-rechner')!;
      const jobradRes = jobrad.calculate({
        bikePrice: 3000,
        monthlyGrossSalary: 3500,
        taxClass: '1',
        churchTax: 'none',
        employerSubsidy: 0,
        inspectionIncluded: false,
      });
      expect(jobradRes.error).toBeUndefined();
      expect(String(jobradRes.primary.value)).not.toContain('NaN');

      // 3. schalungssteine-rechner: 0 openings and 0% reserve
      const stein = getCalculatorBySlug('schalungssteine-rechner')!;
      const steinRes = stein.calculate({
        wallType: 'straight',
        wallLength: 5,
        wallHeight: 1.5,
        fillMode: 'preset_delfing24',
        stoneReserve: 0,
        concreteReserve: 0,
      });
      expect(steinRes.error).toBeUndefined();
      expect(steinRes.primary.value).toBeGreaterThan(0);

      // 4. kfz-steuer-rechner: 0 CO2 WLTP for clean/electric vehicles
      const kfz = getCalculatorBySlug('kfz-steuer-rechner')!;
      const kfzRes = kfz.calculate({
        firstRegistration: 'from_2021',
        engineType: 'petrol',
        displacementCc: 1500,
        co2EmissionsGkm: 0,
      });
      expect(kfzRes.error).toBeUndefined();
      expect(kfzRes.primary.value).toBeGreaterThan(0);

      // 5. spritkostenrechner: 0 km distance
      const sprit = getCalculatorBySlug('spritkostenrechner')!;
      const spritRes = sprit.calculate({ distance: 0, consumption: 7, pricePerLiter: 1.80, passengers: 1 });
      expect(spritRes.error).toBeUndefined();
      expect(spritRes.primary.value).toBe(0);

      // 6. kinderzuschlag-kiz-rechner: 0 income is below minimum threshold -> 0 KiZ, Bürgergeld priority note
      const kiz = getCalculatorBySlug('kinderzuschlag-kiz-rechner')!;
      const kizRes = kiz.calculate({
        childrenCount: 1,
        parentsGrossIncome: 0,
        warmRentMonthly: 600,
      });
      expect(kizRes.error).toBeUndefined();
      expect(kizRes.primary.value).toBe(0);
      expect(kizRes.basisSummary).toBeDefined();

      // 7. buergergeld-anspruch-rechner: 0 earned income
      const bg = getCalculatorBySlug('buergergeld-anspruch-rechner')!;
      const bgRes = bg.calculate({
        householdType: 'single',
        coldRent: 400,
        heatingCosts: 80,
        grossEarnedIncome: 0,
        netEarnedIncome: 0,
        otherIncome: 0,
      });
      expect(bgRes.error).toBeUndefined();
      expect(bgRes.primary.value).toBeGreaterThan(0);

      // 8. renten-brutto-netto-rechner: 0 pension
      const rente = getCalculatorBySlug('renten-brutto-netto-rechner')!;
      const renteRes = rente.calculate({
        grossPension: 0,
        retirementYear: 2026,
        healthInsuranceRate: 14.6,
        careInsuranceRate: 4.0,
      });
      expect(renteRes.error).toBeUndefined();
      expect(renteRes.primary.value).toBe(0);

      // 9. kapitalertragsteuer-rechner: 0 income -> 0 tax
      const kap = getCalculatorBySlug('kapitalertragsteuer-rechner')!;
      const kapRes = kap.calculate({
        capitalIncome: 0,
        maritalStatus: 'single',
        usedAllowance: 0,
        churchState: 'none',
      });
      expect(kapRes.error).toBeUndefined();
      expect(kapRes.primary.value).toBe(0);

      // 10. stromkosten-geraete-rechner: 0 Watt device -> 0 cost
      const strom = getCalculatorBySlug('stromkosten-geraete-rechner')!;
      const stromRes = strom.calculate({
        powerWatts: 0,
        hoursPerDay: 4,
        usageDays: 365,
        electricityPrice: 36,
      });
      expect(stromRes.error).toBeUndefined();
      expect(stromRes.primary.value).toBe(0);
    });
  });

  describe('3. Default/example values calculation', () => {
    it('executes realistic default calculations without errors', () => {
      for (const slug of PRIORITY_SLUGS) {
        const calc = getCalculatorBySlug(slug)!;
        const defaults: Record<string, any> = {};
        for (const input of calc.inputs) {
          defaults[input.id] = input.defaultValue;
        }
        const res = calc.calculate(defaults);
        expect(res.error, `Calc ${slug} had error on default inputs`).toBeUndefined();
        expect(res.primary, `Calc ${slug} missing primary result`).toBeDefined();
        expect(typeof res.primary.value).toBe('number');
        expect(Number.isFinite(res.primary.value)).toBe(true);
      }
    });
  });

  describe('4. Extreme but valid values', () => {
    it('handles upper realistic boundaries cleanly', () => {
      // High gas: 150,000 kWh
      const gas = getCalculatorBySlug('gaskostenrechner')!;
      const gasRes = gas.calculate({ inputType: 'kwh', annualKwh: 150000, pricePerKwh: 0.12, basePricePerMonth: 25 });
      expect(gasRes.error).toBeUndefined();
      expect(gasRes.primary.value).toBeGreaterThan(15000);

      // High bike: 20,000 EUR
      const jobrad = getCalculatorBySlug('dienstfahrrad-jobrad-rechner')!;
      const jobradRes = jobrad.calculate({
        bikePrice: 20000,
        monthlyGrossSalary: 8500,
        taxClass: '1',
        churchTax: 'none',
        employerSubsidy: 100,
        inspectionIncluded: true,
      });
      expect(jobradRes.error).toBeUndefined();
      expect(jobradRes.primary.value).toBeGreaterThan(0);

      // High capital gains: 5,000,000 EUR
      const kap = getCalculatorBySlug('kapitalertragsteuer-rechner')!;
      const kapRes = kap.calculate({
        capitalIncome: 5000000,
        maritalStatus: 'single',
        usedAllowance: 1000,
        churchState: 'by',
      });
      expect(kapRes.error).toBeUndefined();
      expect(kapRes.primary.value).toBeGreaterThan(1000000);
    });
  });

  describe('5. Assumptions and user input transparency', () => {
    it('clearly communicates inputs or calculation basis in the result or summary', () => {
      for (const slug of PRIORITY_SLUGS) {
        const calc = getCalculatorBySlug(slug)!;
        const defaults: Record<string, any> = {};
        for (const input of calc.inputs) {
          defaults[input.id] = input.defaultValue;
        }
        const res = calc.calculate(defaults);
        // Either basisSummary, details list, breakdown items, summaryText, or secondary items must be present
        const hasBasis = !!res.basisSummary && res.basisSummary.length > 0;
        const hasDetails = !!res.details && res.details.length > 0;
        const hasBreakdown = !!res.breakdown?.rows && res.breakdown.rows.length > 0;
        const hasSummaryText = !!res.summaryText && res.summaryText.length > 0;
        const hasSecondary = !!res.secondary && res.secondary.length > 0;
        expect(
          hasBasis || hasDetails || hasBreakdown || hasSummaryText || hasSecondary,
          `Calculator ${slug} should provide transparency on inputs/assumptions in output`
        ).toBe(true);
      }
    });
  });

  describe('6. Current legal/financial sources and Stand date', () => {
    it('has trustMeta or timeSensitiveMeta or legalFootnotes for official calculations', () => {
      const legalFinancialSlugs = [
        'gaskostenrechner',
        'dienstfahrrad-jobrad-rechner',
        'kfz-steuer-rechner',
        'kinderzuschlag-kiz-rechner',
        'buergergeld-anspruch-rechner',
        'renten-brutto-netto-rechner',
        'kapitalertragsteuer-rechner',
        'stromkosten-geraete-rechner',
      ];

      for (const slug of legalFinancialSlugs) {
        const calc = getCalculatorBySlug(slug)!;
        const hasTrustMeta = !!calc.trustMeta;
        const hasTimeSensitiveMeta = !!calc.timeSensitiveMeta;
        const hasLegalFootnotes = !!calc.legalFootnotes && calc.legalFootnotes.length > 0;
        const hasLegalInContent = !!(calc.content as any)?.lawReference || !!(calc.content as any)?.lastReviewed;

        expect(
          hasTrustMeta || hasTimeSensitiveMeta || hasLegalFootnotes || hasLegalInContent,
          `Calculator ${slug} must specify current legal/financial source and Stand date`
        ).toBe(true);
      }
    });
  });
});
