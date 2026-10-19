import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';

export const BATCH_5_SLUGS = [
  // Group 1: Core Haushalt & Energie (6)
  'stromkostenrechner',
  'standby-kosten-rechner',
  'gaskostenrechner',
  'led-ersparnis-rechner',
  'stromkosten-geraete-rechner',
  'gasverbrauch-kwh-m3-rechner',

  // Group 2: Extra Haushalt & Wohnen (8)
  'kuehlschrank-stromkosten-rechner',
  'trockner-kosten-rechner',
  'fernseher-stromkosten-rechner',
  'led-sparrechner',
  'oelheizung-verbrauch-rechner',
  'klimaanlage-stromkosten-rechner',
  'e-auto-ladekosten-zuhause-rechner',
  'lebensmittelbudget-rechner',

  // Group 3: Core Auto & Mobilität (6)
  'spritkostenrechner',
  'kraftstoffverbrauch-rechner',
  'pendlerpauschale-rechner',
  'fahrtkostenrechner',
  'elektroauto-ladekosten-rechner',
  'fahrzeit-rechner',

  // Group 4: Extra Auto & Mobilität (17)
  'kfz-steuer-rechner',
  'dienstwagen-1-prozent-rechner',
  'fahrtenbuch-vs-1-prozent-rechner',
  'leasingfaktor-rechner',
  'auto-gesamtkosten-rechner',
  'auto-wertverlust-rechner',
  'bremsweg-rechner',
  'bussgeld-rechner-geschwindigkeit',
  'promillerechner-widmark',
  'anhaenger-stuetzlast-rechner',
  'reifen-abrollumfang-rechner',
  'thg-quote-rechner',
  'dienstfahrrad-jobrad-rechner',
  'fahrgemeinschaft-sprit-rechner',
  'autobahn-maut-rechner-vignette',
  'motorrad-unterhaltskosten-rechner',
  'lkw-maut-deutschland-rechner',

  // Group 5: Core & Extra Einheiten & Physik (13)
  'energie-arbeit-umrechner',
  'leistung-umrechner',
  'elektrische-ladung-kapazitaet-rechner',
  'drehmoment-umrechner',
  'kraft-umrechner',
  'kraftstoffverbrauch-umrechner',
  'geschwindigkeit-umrechner',
  'druck-umrechner',
  'drehzahl-umfangsgeschwindigkeit-rechner',
  'beleuchtungsstaerke-lux-lumen-rechner',
  'ohmsches-gesetz-rechner',
  'dezibel-schalldruck-umrechner',
  'temperatur-umrechner',
];

describe('Batch 5 Calculators Comprehensive QA Suite (50 Calculators)', () => {
  it('contains exactly 50 calculators assigned to Batch 5', () => {
    expect(BATCH_5_SLUGS.length).toBe(50);
  });

  describe('1. Registry Resolution & Metadata Quality', () => {
    for (const slug of BATCH_5_SLUGS) {
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
    for (const slug of BATCH_5_SLUGS) {
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
            if (typeof sec.value === 'number') {
              expect(Number.isNaN(sec.value)).toBe(false);
              expect(Number.isFinite(sec.value)).toBe(true);
            }
            expect(sec.formattedValue).not.toContain('NaN');
            expect(sec.formattedValue).not.toContain('undefined');
          }
        }
      });
    }
  });

  describe('3. Specific Discrepancy, Zero-Value & Edge-Case Verification', () => {
    // Finding 1: stromkostenrechner - basePricePerMonth = 0
    it('stromkostenrechner preserves basePricePerMonth = 0 for pure consumption tariffs', () => {
      const calc = getCalculatorBySlug('stromkostenrechner')!;
      const res = calc.calculate({
        annualKwh: 3000,
        pricePerKwh: 0.30,
        basePricePerMonth: 0,
      });
      expect(res.primary.value).toBe(900); // 3000 * 0.30 = 900 € / yr
    });

    // Finding 2: auto-gesamtkosten-rechner - taxYearly = 0 (EV exemption under § 3d KraftStG)
    it('auto-gesamtkosten-rechner preserves taxYearly = 0 for electric vehicles', () => {
      const calc = getCalculatorBySlug('auto-gesamtkosten-rechner')!;
      const res = calc.calculate({
        purchasePrice: 30000,
        yearlyMileageKm: 15000,
        fuelCostPer100Km: 11.50,
        insuranceYearly: 600,
        taxYearly: 0, // EV tax exemption
        maintenanceYearly: 400,
      });
      // Depreciation: 3000 €/yr. Fuel: 150 * 11.5 = 1725 €/yr. Insurance: 600. Tax: 0. Maint: 400.
      // Total yearly = 5725 €. Monthly = 5725 / 12 = 477.0833 €
      expect(res.primary.value).toBeCloseTo(477.08, 1);

      // Verify zero mileage guard does not produce NaN
      const resZeroKm = calc.calculate({
        purchasePrice: 30000,
        yearlyMileageKm: 0,
        fuelCostPer100Km: 11.50,
        insuranceYearly: 600,
        taxYearly: 0,
        maintenanceYearly: 400,
      });
      const costPerKm = resZeroKm.secondary?.find((s) => s.id === 'costPerKm');
      expect(costPerKm?.value).toBe(0);
    });

    // Finding 3: fahrgemeinschaft-sprit-rechner - wearSurchargePerKm = 0
    it('fahrgemeinschaft-sprit-rechner preserves wearSurchargePerKm = 0 for pure fuel sharing', () => {
      const calc = getCalculatorBySlug('fahrgemeinschaft-sprit-rechner')!;
      const res = calc.calculate({
        distanceOneWayKm: 30,
        workDaysPerMonth: 20,
        carConsumptionPer100Km: 6.0,
        fuelPricePerLiter: 1.80,
        wearSurchargePerKm: 0, // no wear surcharge
        passengersCount: 2,
      });
      // 30 * 2 * 20 = 1200 km.
      // Fuel: 1200 * 0.06 * 1.80 = 129.60 €. Wear: 0 €. Total: 129.60 €
      // Per person monthly (2 people): 64.80 €
      expect(res.primary.value).toBe(64.8);
      const totalMonth = res.secondary?.find((s) => s.id === 'totalMonthlyCost');
      expect(totalMonth?.value).toBe(129.6);
    });

    // Finding 4: lebensmittelbudget-rechner - children = 0 & zero adults guard
    it('lebensmittelbudget-rechner handles children = 0 and zero total persons cleanly', () => {
      const calc = getCalculatorBySlug('lebensmittelbudget-rechner')!;
      // Zero children
      const resZeroKids = calc.calculate({
        adults: 2,
        children: 0,
        lifestyle: 'standard',
      });
      // 2 adults standard (310 € each) = 620 € monthly
      expect(resZeroKids.primary.value).toBe(620);
      const perPerson = resZeroKids.secondary?.find((s) => s.id === 'perPerson');
      expect(perPerson?.value).toBe(310);

      // Edge case: 0 adults and 0 children
      const resZeroTotal = calc.calculate({
        adults: 0,
        children: 0,
        lifestyle: 'standard',
      });
      expect(resZeroTotal.primary.value).toBe(0);
      const perPersonZero = resZeroTotal.secondary?.find((s) => s.id === 'perPerson');
      expect(perPersonZero?.value).toBe(0);
    });

    // Finding 5: kraftstoffverbrauch-umrechner - non-positive inputs guard
    it('kraftstoffverbrauch-umrechner safely guards against zero or negative input values', () => {
      const calc = getCalculatorBySlug('kraftstoffverbrauch-umrechner')!;
      const resZero = calc.calculate({
        inputValue: 0,
        inputUnit: 'l100km',
      });
      expect(resZero.error).toBeDefined();
      expect(resZero.primary.value).toBe(0);
      expect(Number.isFinite(resZero.primary.value)).toBe(true);

      const resValid = calc.calculate({
        inputValue: 7.5,
        inputUnit: 'l100km',
      });
      expect(resValid.error).toBeUndefined();
      expect(resValid.primary.value).toBe(7.5);
      const usmpg = resValid.secondary?.find((s) => s.id === 'usmpg');
      // 235.214583 / 7.5 ≈ 31.36 mpg
      expect(usmpg?.value).toBeCloseTo(31.36, 1);
    });

    // Finding 6: temperatur-umrechner - 0 °C freezing point handling and Kelvin formatting
    it('temperatur-umrechner accurately converts 0 °C to 32 °F and 273.15 K without degree on K', () => {
      const calc = getCalculatorBySlug('temperatur-umrechner')!;
      const resZeroCelsius = calc.calculate({
        value: 0,
        fromUnit: 'C',
        toUnit: 'F',
      });
      // 0 °C -> Fahrenheit = 32 °F
      expect(resZeroCelsius.primary.value).toBe(32);
      expect(resZeroCelsius.primary.formattedValue).toContain('32');

      const kelvinSec = resZeroCelsius.secondary?.find((s) => s.id === 'kelvin');
      expect(kelvinSec?.value).toBe(273.15);
      expect(kelvinSec?.formattedValue).toBe('273,15 K');
      expect(kelvinSec?.formattedValue).not.toContain('°K');
    });

    // Finding 7: kuehlschrank-stromkosten-rechner - newAppliancePrice = 0 amortization
    it('kuehlschrank-stromkosten-rechner handles newAppliancePrice = 0 without defaulting to 650', () => {
      const calc = getCalculatorBySlug('kuehlschrank-stromkosten-rechner')!;
      const res = calc.calculate({
        oldConsumptionKwh: 350,
        newConsumptionKwh: 120,
        electricityPrice: 35,
        newAppliancePrice: 0, // inherited/gifted appliance
      });
      // Savings = (350 - 120) * 0.35 = 80.50 € / yr
      expect(res.primary.value).toBe(80.5);
      const amortSec = res.secondary?.find((s) => s.id === 'amortYears');
      expect(amortSec?.value).toBe(0);
    });

    // Finding 8: fahrzeit-rechner - breakMinutes = 0
    it('fahrzeit-rechner preserves breakMinutes = 0 without adding 30 minutes', () => {
      const calc = getCalculatorBySlug('fahrzeit-rechner')!;
      const res = calc.calculate({
        distance: 120,
        speed: 120,
        breakMinutes: 0,
      });
      // 120 km at 120 km/h with 0 min break = exactly 60 minutes
      expect(res.primary.value).toBe(60);
      const breaksSec = res.secondary?.find((s) => s.id === 'breaks');
      expect(breaksSec?.value).toBe(0);
    });

    // Finding 9: ohmsches-gesetz-rechner - zero voltage/current
    it('ohmsches-gesetz-rechner handles zero values without defaulting to 230 V', () => {
      const calc = getCalculatorBySlug('ohmsches-gesetz-rechner')!;
      const res = calc.calculate({
        calculationMode: 'calc_r',
        voltage: 0,
        current: 5,
        resistance: 0,
        power: 0,
      });
      // R = U / I = 0 / 5 = 0 Ohm
      expect(res.primary.value).toBe(0);
    });

    // Finding 10: standby-kosten-rechner - hoursPerDay = 0
    it('standby-kosten-rechner preserves hoursPerDay = 0 without defaulting to 20 hours', () => {
      const calc = getCalculatorBySlug('standby-kosten-rechner')!;
      const res = calc.calculate({
        totalWatt: 25,
        pricePerKwh: 0.35,
        hoursPerDay: 0,
      });
      expect(res.primary.value).toBe(0);
    });
  });
});
