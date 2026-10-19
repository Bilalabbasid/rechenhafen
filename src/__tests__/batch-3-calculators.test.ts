import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';

export const BATCH_3_SLUGS = [
  // Group 1: Core Wohnen & Immobilien (6)
  'mietbelastungsquote-rechner',
  'kaufnebenkosten-rechner',
  'immobilienrendite-rechner',
  'quadratmeterpreis-rechner',
  'mietbudget-rechner',
  'mieterhoehung-rechner',

  // Group 2: Core Business (1)
  'break-even-rechner',

  // Group 3: Business Statistik (4)
  'deckungsbeitrag-rechner',
  'roi-rechner',
  'roas-rechner',
  'kundengewinnungskosten-cac-rechner',

  // Group 4: Bauen & Geometrie (5)
  'daemmung-u-wert-rechner',
  'regenwasser-zisterne-rechner',
  'brennholz-raummeter-rechner',
  'drainage-gefaelle-rechner',
  'baugrund-tragfaehigkeit-rechner',

  // Group 5: Finanzen & Kredit (5)
  'baufinanzierung-rechner',
  'volltilger-darlehen-rechner',
  'kreditrechner-ohne-eigenkapital',
  'zwischenfinanzierung-rechner',
  'zinsbindung-rechner',

  // Group 6: Extra Wohnen & Haushalt (29)
  'mietminderung-rechner',
  'staffelmiete-rechner',
  'indexmiete-rechner',
  'wohnflaeche-din-rechner',
  'grundsteuer-reform-rechner',
  'spekulationssteuer-immobilien-rechner',
  'maklerprovision-rechner',
  'grunderwerbsteuer-rechner',
  'notar-grundbuch-kosten-rechner',
  'instandhaltungsruecklage-rechner',
  'modernisierungsumlage-rechner',
  'mietkaution-zinsen-rechner',
  'hausgeld-rechner',
  'abschreibung-immobilien-rechner',
  'mietrendite-brutto-netto-rechner',
  'vorfaelligkeitsentschaedigung-baufinanzierung-rechner',
  'abstandszahlung-rechner',
  'warmmiete-rechner',
  'untermiete-rechner',
  'erbbaurecht-erbbauzins-rechner',
  'kaufpreis-faktor-rechner',
  'waermepumpe-stromkosten-rechner',
  'photovoltaik-amortisation-rechner',
  'balkonkraftwerk-ertrag-rechner',
  'heizkostenvergleich-rechner',
  'co2-abgabe-vermieter-mieter-rechner',
  'warmwasserkosten-rechner',
  'pelletheizung-verbrauch-rechner',
  'energieeffizienzklasse-rechner',
];

describe('Batch 3 Calculators Comprehensive QA Suite (50 Calculators)', () => {
  it('contains exactly 50 calculators assigned to Batch 3', () => {
    expect(BATCH_3_SLUGS.length).toBe(50);
  });

  describe('1. Registry Resolution & Metadata Quality', () => {
    for (const slug of BATCH_3_SLUGS) {
      it(`resolves ${slug} with valid metadata and calculation function`, () => {
        const calc = getCalculatorBySlug(slug);
        expect(calc).toBeDefined();
        if (!calc) return;
        expect(calc.id).toBe(slug);
        expect(calc.slug).toBe(slug);
        expect(calc.name.length).toBeGreaterThan(3);
        expect(calc.metaTitle.length).toBeGreaterThan(5);
        expect(calc.metaDescription.length).toBeGreaterThan(20);
        expect(calc.h1.length).toBeGreaterThan(3);
        expect(calc.inputs.length).toBeGreaterThan(0);
        expect(typeof calc.calculate).toBe('function');
      });
    }
  });

  describe('2. Default Calculation Execution & German Formatting', () => {
    for (const slug of BATCH_3_SLUGS) {
      it(`calculates valid default outputs without NaN for ${slug}`, () => {
        const calc = getCalculatorBySlug(slug);
        expect(calc).toBeDefined();
        if (!calc) return;

        const defaultInputs: Record<string, any> = {};
        for (const input of calc.inputs) {
          defaultInputs[input.id] = input.defaultValue;
        }

        const result = calc.calculate(defaultInputs);
        expect(result).toBeDefined();
        expect(result.primary).toBeDefined();
        expect(typeof result.primary.value).toBe('number');
        expect(Number.isNaN(result.primary.value)).toBe(false);
        expect(Number.isFinite(result.primary.value)).toBe(true);
        expect(result.primary.formattedValue).toBeDefined();
        expect(result.primary.formattedValue).not.toContain('NaN');
        expect(result.primary.formattedValue).not.toContain('undefined');

        if (result.secondary) {
          for (const sec of result.secondary) {
            expect(sec.formattedValue).not.toContain('NaN');
            expect(sec.formattedValue).not.toContain('undefined');
          }
        }
      });
    }
  });

  describe('3. High-Confidence Audit Findings & Zero-Value Preservation', () => {
    // Finding #5: quadratmeterpreis-rechner
    it('quadratmeterpreis-rechner validates 0 area gracefully without division-by-zero', () => {
      const calc = getCalculatorBySlug('quadratmeterpreis-rechner')!;
      const resZero = calc.calculate({ totalPrice: 300000, livingArea: 0 });
      expect(resZero.error).toBeDefined();
      expect(resZero.primary.value).toBe(0);

      const resValid = calc.calculate({ totalPrice: 300000, livingArea: 75 });
      expect(resValid.primary.value).toBe(4000);
      expect(resValid.error).toBeUndefined();
    });

    // Finding #6: staffelmiete-rechner
    it('staffelmiete-rechner preserves 0 start rent without false fallback', () => {
      const calc = getCalculatorBySlug('staffelmiete-rechner')!;
      const resZero = calc.calculate({ startRent: 0, increaseAmount: 0, intervalMonths: 12, totalYears: 3 });
      expect(resZero.primary.value).toBe(0);
      expect(resZero.summaryText).toContain('0,00');

      const resStaffel = calc.calculate({ startRent: 0, increaseAmount: 50, intervalMonths: 12, totalYears: 2 });
      expect(resStaffel.primary.value).toBe(100);
    });

    // Finding #7: spekulationssteuer-immobilien-rechner
    it('spekulationssteuer-immobilien-rechner preserves claimedDepreciation = 0 and taxRate = 0', () => {
      const calc = getCalculatorBySlug('spekulationssteuer-immobilien-rechner')!;
      const resZero = calc.calculate({
        purchaseCost: 400000,
        salePrice: 500000,
        claimedDepreciation: 0,
        taxRate: 0,
      });
      // 500k - 400k = 100k gain, at 0% tax rate = 0 tax
      expect(resZero.primary.value).toBe(0);
      expect(resZero.secondary?.find((s) => s.id === 'taxableProfit')?.value).toBe(100000);

      const resLoss = calc.calculate({
        purchaseCost: 500000,
        salePrice: 400000,
        claimedDepreciation: 0,
        taxRate: 42,
      });
      expect(resLoss.primary.value).toBe(0);
      expect(resLoss.secondary?.find((s) => s.id === 'taxableProfit')?.value).toBe(0);
    });

    // break-even-rechner: zero variable costs preserved
    it('break-even-rechner supports 0 variable costs for digital products and guards price <= variableCost', () => {
      const calc = getCalculatorBySlug('break-even-rechner')!;
      const resDigital = calc.calculate({ fixedCosts: 10000, pricePerUnit: 50, variableCostPerUnit: 0 });
      expect(resDigital.primary.value).toBe(200); // 10000 / 50 = 200 units
      expect(resDigital.error).toBeUndefined();

      const resDeficit = calc.calculate({ fixedCosts: 10000, pricePerUnit: 20, variableCostPerUnit: 30 });
      expect(resDeficit.error).toBeDefined();
      expect(resDeficit.primary.value).toBe(0);
    });

    // deckungsbeitrag-rechner: 0 variable costs
    it('deckungsbeitrag-rechner preserves 0 variable costs', () => {
      const calc = getCalculatorBySlug('deckungsbeitrag-rechner')!;
      const res = calc.calculate({ pricePerUnit: 100, variableCostPerUnit: 0, unitsSold: 50, fixedCostsTotal: 2000 });
      expect(res.primary.value).toBe(5000); // 50 * 100
      expect(res.secondary?.find((s) => s.id === 'unitDb')?.value).toBe(100);
      expect(res.secondary?.find((s) => s.id === 'dbRatio')?.value).toBe(100);
    });

    // roas-rechner & roi-rechner: division guards
    it('roas-rechner and roi-rechner guard against zero ad spend / cost', () => {
      const roasCalc = getCalculatorBySlug('roas-rechner')!;
      const roasRes = roasCalc.calculate({ revenue: 5000, adSpend: 0 });
      expect(roasRes.error).toBeDefined();

      const roiCalc = getCalculatorBySlug('roi-rechner')!;
      const roiRes = roiCalc.calculate({ gain: 10000, cost: 0 });
      expect(roiRes.error).toBeDefined();
    });

    // kundengewinnungskosten-cac-rechner: zero customers guard
    it('kundengewinnungskosten-cac-rechner guards against 0 new customers', () => {
      const calc = getCalculatorBySlug('kundengewinnungskosten-cac-rechner')!;
      const res = calc.calculate({ marketingCosts: 5000, salesCosts: 3000, newCustomers: 0 });
      expect(res.error).toBeDefined();
      expect(res.primary.value).toBe(0);
    });

    // daemmung-u-wert-rechner: zero thickness validation
    it('daemmung-u-wert-rechner guards against 0 insulation thickness', () => {
      const calc = getCalculatorBySlug('daemmung-u-wert-rechner')!;
      const res = calc.calculate({ thickness: 0, wlg: '035', component: 'wall' });
      expect(res.error).toBeDefined();
      expect(res.primary.value).toBe(0);
    });

    // notar-grundbuch-kosten-rechner: cash buyers
    it('notar-grundbuch-kosten-rechner preserves mortgageAmount = 0 for cash buyers', () => {
      const calc = getCalculatorBySlug('notar-grundbuch-kosten-rechner')!;
      const resCash = calc.calculate({ purchasePrice: 400000, mortgageAmount: 0 });
      const resFinanced = calc.calculate({ purchasePrice: 400000, mortgageAmount: 300000 });
      expect(Number(resCash.primary.value)).toBeLessThan(Number(resFinanced.primary.value));
      expect(Number(resCash.secondary?.find((s) => s.id === 'registryShare')?.value)).toBeGreaterThan(0);
    });

    // instandhaltungsruecklage-rechner: 0 area handled
    it('instandhaltungsruecklage-rechner handles 0 area without error or division-by-zero', () => {
      const calc = getCalculatorBySlug('instandhaltungsruecklage-rechner')!;
      const res = calc.calculate({ livingArea: 0, reconstructionCost: 2400, buildingAgeYears: 25 });
      expect(res.primary.value).toBe(0);
      expect(res.secondary?.find((s) => s.id === 'monthlyPerSqm')?.value).toBe(0);
    });

    // modernisierungsumlage-rechner: maintenanceShare = 0 preserved
    it('modernisierungsumlage-rechner preserves maintenanceShare = 0 without false fallback', () => {
      const calc = getCalculatorBySlug('modernisierungsumlage-rechner')!;
      const resZero = calc.calculate({ modernizationCost: 20000, maintenanceShare: 0, totalArea: 100, apartmentArea: 100 });
      const resMaint = calc.calculate({ modernizationCost: 20000, maintenanceShare: 5000, totalArea: 100, apartmentArea: 100 });
      expect(Number(resZero.primary.value)).toBeGreaterThan(Number(resMaint.primary.value));
    });

    // mietkaution-zinsen-rechner: 0% interest preserved
    it('mietkaution-zinsen-rechner preserves 0% interest rate during low-interest phase', () => {
      const calc = getCalculatorBySlug('mietkaution-zinsen-rechner')!;
      const res = calc.calculate({ depositAmount: 2000, avgInterestRate: 0, rentalYears: 5 });
      expect(res.primary.value).toBe(2000); // full deposit returned
      expect(res.secondary?.find((s) => s.id === 'totalInterest')?.value).toBe(0); // 0 interest earned
    });

    // abschreibung-immobilien-rechner: 0% land share (Erbbaurecht) & 0% tax rate
    it('abschreibung-immobilien-rechner preserves 0% land share (Erbbaurecht) and 0% tax rate', () => {
      const calc = getCalculatorBySlug('abschreibung-immobilien-rechner')!;
      const res = calc.calculate({ totalCost: 500000, landSharePct: 0, afaType: 'newBuild', taxRate: 0 });
      expect(res.primary.value).toBe(0); // 0 tax saving with 0% tax rate
      expect(res.secondary?.find((s) => s.id === 'yearlyAfa')?.value).toBe(15000); // 3% of 500k
    });

    // mietrendite-brutto-netto-rechner: 0 closing costs & non-apportionable
    it('mietrendite-brutto-netto-rechner preserves 0 closing costs and non-apportionable costs', () => {
      const calc = getCalculatorBySlug('mietrendite-brutto-netto-rechner')!;
      const res = calc.calculate({ purchasePrice: 300000, closingCosts: 0, monthlyColdRent: 1000, yearlyNonApportionable: 0 });
      expect(res.primary.value).toBe(4.0);
      expect(res.secondary?.find((s) => s.id === 'grossYield')?.value).toBe(4.0);
    });

    // balkonkraftwerk-ertrag-rechner: 0 savings amortisation guard
    it('balkonkraftwerk-ertrag-rechner handles 0 savings without Infinity', () => {
      const calc = getCalculatorBySlug('balkonkraftwerk-ertrag-rechner')!;
      const res = calc.calculate({ modulePowerWp: 0, systemCost: 500, ownConsumptionPct: 0, electricityPrice: 0 });
      expect(res.primary.value).toBe(0);
      expect(Number.isFinite(res.secondary?.find((s) => s.id === 'amortYears')?.value)).toBe(true);
      expect(res.secondary?.find((s) => s.id === 'amortYears')?.formattedValue).toBe('Nicht amortisierbar');
    });

    // photovoltaik-amortisation-rechner: 0 benefit amortisation guard
    it('photovoltaik-amortisation-rechner handles 0 benefit without Infinity', () => {
      const calc = getCalculatorBySlug('photovoltaik-amortisation-rechner')!;
      const res = calc.calculate({ peakPowerKwp: 0, totalCost: 15000, householdDemandKwh: 0, selfConsumptionPct: 0, feedInTariffCent: 0, gridPriceCent: 0 });
      expect(res.primary.value).toBe(0);
      expect(Number.isFinite(res.secondary?.find((s) => s.id === 'amortYears')?.value)).toBe(true);
      expect(res.secondary?.find((s) => s.id === 'amortYears')?.formattedValue).toBe('Nicht amortisierbar');
    });

    // waermepumpe-stromkosten-rechner: JAZ <= 0 guarded
    it('waermepumpe-stromkosten-rechner guards JAZ <= 0 against division by zero', () => {
      const calc = getCalculatorBySlug('waermepumpe-stromkosten-rechner')!;
      const res = calc.calculate({ heatDemandKwh: 15000, jaz: 0, heatElectricityPriceCent: 28 });
      expect(Number.isFinite(res.primary.value)).toBe(true);
      expect(res.primary.value).toBeGreaterThan(0);
    });

    // heizkostenvergleich-rechner: JAZ <= 0 guarded
    it('heizkostenvergleich-rechner guards JAZ <= 0 against division by zero', () => {
      const calc = getCalculatorBySlug('heizkostenvergleich-rechner')!;
      const res = calc.calculate({ heatDemandKwh: 18000, gasPriceCent: 11, oilPricePerLiter: 1.05, pelletPricePerTon: 320, heatPumpJaz: 0, heatPumpPowerPrice: 28 });
      expect(Number.isFinite(res.primary.value)).toBe(true);
    });

    // warmwasserkosten-rechner: 0 persons / 0 minutes
    it('warmwasserkosten-rechner handles 0 persons or 0 minutes gracefully', () => {
      const calc = getCalculatorBySlug('warmwasserkosten-rechner')!;
      const res = calc.calculate({ persons: 0, showerMinutesPerPerson: 0, powerKw: 21, electricityPrice: 36 });
      expect(res.primary.value).toBe(0);
      expect(res.secondary?.find((s) => s.id === 'costPerShower')?.value).toBe(0);
    });

    // co2-abgabe-vermieter-mieter-rechner: 0 kg emission / 0 cost
    it('co2-abgabe-vermieter-mieter-rechner handles 0 kg emission (Stufe 1, 0% landlord)', () => {
      const calc = getCalculatorBySlug('co2-abgabe-vermieter-mieter-rechner')!;
      const res = calc.calculate({ livingArea: 80, co2CostTotal: 100, co2EmissionKgPerSqm: 0 });
      expect(res.primary.value).toBe(0); // landlord share is 0
      expect(res.secondary?.find((s) => s.id === 'tenantShare')?.value).toBe(100);
      expect(res.secondary?.find((s) => s.id === 'landlordPct')?.value).toBe(0);
    });

    // energieeffizienzklasse-rechner: 0 kWh/m²a
    it('energieeffizienzklasse-rechner categorizes 0 kWh/m²a as Klasse A+', () => {
      const calc = getCalculatorBySlug('energieeffizienzklasse-rechner')!;
      const res = calc.calculate({ endenergieKwh: 0 });
      expect(res.primary.formattedValue).toBe('Klasse A+');
    });
  });
});
