import { describe, it, expect } from 'vitest';
import { EMISSION_FACTORS, getFactor } from '@/data/emissions';
import {
  calculateElectricityCO2,
  calculateCommutingCO2,
  calculateCarbonPrice,
} from '@/lib/calculators/co2';
import { calculateCarCO2 } from '@/lib/calculators/auto';
import { getCalculatorBySlug, ALL_CALCULATORS } from '@/data/calculators';
import { getAllArticles, getArticleBySlug } from '@/data/ratgeber/articles';
import { loadCalculatorEngine } from '@/lib/calculators/dynamic-loader';
import sitemap from '@/app/sitemap';

describe('CO2 Calculator Cluster Verification Suite', () => {
  describe('1. Shared Versioned Emissions Factor Registry', () => {
    it('contains all required factors with rigorous metadata', () => {
      const keys = [
        'strom_mix_de_generation_2025',
        'strom_mix_de_lifecycle_2025',
        'strom_oekostrom_lifecycle',
        'verkehr_pkw_durchschnitt',
        'verkehr_bahn_fernverkehr',
        'verkehr_bahn_nahverkehr',
        'verkehr_linienbus',
        'brennstoff_benzin_direkt',
        'brennstoff_diesel_direkt',
        'brennstoff_erdgas_direkt',
      ] as const;

      for (const k of keys) {
        const factor = getFactor(k);
        expect(factor).toBeDefined();
        expect(factor!.value).toBeGreaterThan(0);
        expect(factor!.unit).toBeDefined();
        expect(factor!.geographicCoverage).toContain('DE');
        expect(factor!.referenceYear).toBeGreaterThanOrEqual(2023);
        expect(factor!.sourceUrl).toMatch(/^https:\/\//);
        expect(['CO2', 'CO2e']).toContain(factor!.gasType);
        expect(['direct_combustion', 'energy_generation', 'lifecycle']).toContain(factor!.boundary);
        expect(['estimated', 'provisional', 'final', 'statutory']).toContain(factor!.status);
        expect(new Date(factor!.verificationDate).toString()).not.toBe('Invalid Date');
      }
    });

    it('verifies official UBA 2025 estimate of 344 g CO2/kWh published in March 2026', () => {
      const ubaFactor = EMISSION_FACTORS.strom_mix_de_generation_2025;
      expect(ubaFactor.value).toBe(344);
      expect(ubaFactor.unit).toBe('g/kWh');
      expect(ubaFactor.boundary).toBe('energy_generation');
      expect(ubaFactor.gasType).toBe('CO2');
      expect(ubaFactor.referenceYear).toBe(2025);
      expect(ubaFactor.status).toBe('estimated');
    });

    it('does not assign zero lifecycle emissions to green electricity', () => {
      const greenFactor = EMISSION_FACTORS.strom_oekostrom_lifecycle;
      expect(greenFactor.value).toBeGreaterThan(0);
      expect(greenFactor.value).toBe(25);
      expect(greenFactor.gasType).toBe('CO2e');
      expect(greenFactor.boundary).toBe('lifecycle');
    });
  });

  describe('2. Electricity CO2 Calculator (/rechner/co2-strom-rechner/)', () => {
    it('matches exact prompt specification: 2,500 kWh × 344 g/kWh ÷ 1,000 = 860 kg CO2', () => {
      const res = calculateElectricityCO2({
        consumptionKwh: 2500,
        period: 'year',
        tariffType: 'grid_2025',
      });

      expect(res.error).toBeUndefined();
      // Primary is in tonnes when >= 1 tonne, or in kg
      expect(res.secondary?.find((s) => s.id === 'totalKg')?.value).toBe(860);
      expect(res.directAnswer).toContain('860 kg CO2');
      expect(res.calculationSteps?.some((s) => s.includes('2.500 kWh × 344 g/kWh ÷ 1.000 = 860'))).toBe(true);
    });

    it('handles decimal comma and custom factors', () => {
      const res = calculateElectricityCO2({
        consumptionKwh: '1250,5',
        tariffType: 'custom',
        customFactorGrams: '400,2',
      });
      expect(res.error).toBeUndefined();
      const expectedKg = (1250.5 * 400.2) / 1000;
      expect(res.secondary?.find((s) => s.id === 'totalKg')?.value).toBeCloseTo(expectedKg, 2);
    });

    it('allows 0 kWh as a valid input and does not fallback to default', () => {
      const res = calculateElectricityCO2({ consumptionKwh: 0 });
      expect(res.error).toBeUndefined();
      expect(res.secondary?.find((s) => s.id === 'totalKg')?.value).toBe(0);
    });

    it('pauses and returns error for empty or negative inputs', () => {
      const emptyRes = calculateElectricityCO2({ consumptionKwh: '' });
      expect(emptyRes.error).toBeDefined();
      expect(emptyRes.primary.formattedValue).toBe('-');

      const negRes = calculateElectricityCO2({ consumptionKwh: -100 });
      expect(negRes.error).toBeDefined();
    });

    it('supports lifecycle mode with 410 g CO2e/kWh', () => {
      const res = calculateElectricityCO2({
        consumptionKwh: 2000,
        tariffType: 'grid_lifecycle',
      });
      expect(res.secondary?.find((s) => s.id === 'totalKg')?.value).toBe(820);
      expect(res.primary.formattedValue).toContain('CO2e');
    });
  });

  describe('3. Commuting CO2 Calculator (/rechner/co2-pendeln-rechner/)', () => {
    it('matches exact prompt specification: 20 km × 2 × 180 d = 7,200 km; 7,200 × 164 g = 1,180.8 kg; 7,200 × 44 g = 316.8 kg', () => {
      const res = calculateCommutingCO2({
        oneWayDistanceKm: 20,
        commutingDays: 180,
        primaryMode: 'car_average',
        comparisonMode: 'train_long',
      });

      expect(res.error).toBeUndefined();
      const compKg = res.secondary?.find((s) => s.id === 'compEmissions')?.value;
      const totalKm = res.secondary?.find((s) => s.id === 'totalKm')?.value;
      const savings = res.secondary?.find((s) => s.id === 'savings')?.value;

      expect(totalKm).toBe(7200);
      // Primary: 7,200 * 164 / 1,000 = 1,180.8 kg = 1.1808 t
      expect(res.primary.value).toBeCloseTo(1.1808, 2);
      expect(compKg).toBeCloseTo(316.8, 1);
      // Savings: 1,180.8 - 316.8 = 864.0 kg
      expect(savings).toBeCloseTo(864.0, 1);
    });

    it('supports separate route lengths for transit vs car', () => {
      const res = calculateCommutingCO2({
        oneWayDistanceKm: 25,
        differentComparisonDistance: true,
        comparisonDistanceKm: 32, // railway is 32 km
        commutingDays: 200,
        primaryMode: 'car_average',
        comparisonMode: 'train_long',
      });

      expect(res.error).toBeUndefined();
      // Primary: 25 * 2 * 200 = 10,000 km * 164 g = 1,640 kg = 1.64 t
      // Comp: 32 * 2 * 200 = 12,800 km * 44 g = 563.2 kg
      const compKg = res.secondary?.find((s) => s.id === 'compEmissions')?.value;
      expect(res.primary.value).toBeCloseTo(1.64, 2);
      expect(compKg).toBeCloseTo(563.2, 1);
    });

    it('does NOT divide per-passenger factor by occupancy a second time', () => {
      // Carpool of 2 uses half of vehicle total: 164 / 2 = 82 g/Pkm
      // In car_diesel with cons=5.5 l, 2 occupants:
      // ((5.5 * 3.24 * 1000) / 100) / 2 = 178.2 / 2 = 89.1 g/Pkm
      const res = calculateCommutingCO2({
        oneWayDistanceKm: 10,
        commutingDays: 100,
        primaryMode: 'car_diesel',
        carConsumption: 5.5,
        carOccupancy: 2,
      });
      // 10 * 2 * 100 = 2,000 km * 89.1 g / 1,000 = 178.2 kg
      expect(res.primary.value).toBeCloseTo(178.2, 1);
    });

    it('calculates homeoffice savings correctly', () => {
      const res = calculateCommutingCO2({
        oneWayDistanceKm: 20,
        commutingDays: 180,
        primaryMode: 'car_average',
        homeofficeDaysPerWeek: 1, // 36 days less
      });
      // 36 days * 40 km = 1,440 km saved * 164 g = 236.16 kg saved
      const hoSavings = res.secondary?.find((s) => s.id === 'homeofficeSaving')?.value;
      expect(hoSavings).toBeCloseTo(236.16, 1);
    });
  });

  describe('4. Fuel Carbon Price Calculator (/rechner/co2-preis-rechner/)', () => {
    it('calculates gas carbon price with EBeV 0.182 kg/kWh, 55 €/t, net and 19% VAT', () => {
      const res = calculateCarbonPrice({
        fuel: 'gas',
        amount: 15000,
        priceYear: '2026_corridor_55',
        includeVat: true,
      });

      expect(res.error).toBeUndefined();
      // 15,000 * 0.182 = 2,730 kg CO2 = 2.73 t
      // Net: 2.73 * 55 = 150.15 €
      // Gross: 150.15 * 1.19 = 178.6785 € (178.68 €)
      const costGross = res.primary.value;
      const costNet = res.secondary?.find((s) => s.id === 'costNet')?.value;
      expect(costNet).toBeCloseTo(150.15, 2);
      expect(costGross).toBeCloseTo(178.68, 2);

      // Surcharge: 178.68 / 15,000 = ~0.0119 € = 1.19 Cent/kWh
      const surcharge = res.secondary?.find((s) => s.id === 'surchargePerUnit')?.value;
      expect(surcharge).toBeDefined();
      expect(Number(surcharge) * 100).toBeCloseTo(1.19, 1);
    });

    it('supports heating oil (Heizöl EL: 2.66 kg CO2/l) and statutory 2024 price (45 €/t)', () => {
      const res = calculateCarbonPrice({
        fuel: 'heizoel',
        amount: 2000,
        priceYear: '2024_festpreis',
        includeVat: true,
      });

      expect(res.error).toBeUndefined();
      // 2,000 l * 2.66 kg = 5,320 kg = 5.32 t
      // Net: 5.32 * 45 = 239.40 €
      // Gross: 239.40 * 1.19 = 284.886 €
      const costNet = res.secondary?.find((s) => s.id === 'costNet')?.value;
      expect(costNet).toBeCloseTo(239.40, 2);
      expect(res.primary.value).toBeCloseTo(284.89, 2);
    });

    it('allows 0 units and does not add carbon price to total bills', () => {
      const res = calculateCarbonPrice({ amount: 0 });
      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(0);
      expect(res.qualifications?.some((q) => q.includes('NICHT Ihre gesamte Heiz- oder Spritrechnung'))).toBe(true);
    });

    it('supports Modus A: known emissions (2,000 kg * 60 €/t = 120 €) preserving user tax basis', () => {
      const res = calculateCarbonPrice({
        calculationMode: 'by_emissions',
        emissionsAmount: 2000,
        emissionsUnit: 'kg',
        pricePerTonne: 60,
      });

      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(120);
      expect(res.directAnswer).toContain('2.000 kg CO₂ (2 Tonnen)');
      expect(res.directAnswer).toContain('120,00');
    });
  });

  describe('5. Existing Page Improvements', () => {
    it('co2-auto-rechner supports trip mode and boundary toggle', () => {
      const annualRes = calculateCarCO2({
        fuelType: 'benzin',
        consumption: 7.0,
        distanceKm: 15000,
        tripMode: 'annual',
        boundary: 'direct',
      });
      expect(annualRes.error).toBeUndefined();
      expect(annualRes.primary.formattedValue).toContain('Tonnen');

      const tripRes = calculateCarCO2({
        fuelType: 'benzin',
        consumption: 7.0,
        distanceKm: 300,
        tripMode: 'single_trip',
        boundary: 'lifecycle',
      });
      expect(tripRes.error).toBeUndefined();
      expect(tripRes.primary.formattedValue).toContain('kg CO2e');
    });

    it('co2-abgabe-vermieter-mieter-rechner handles 10-Stufenmodell, building/dwelling scope, partial-year & § 9 exceptions', () => {
      const calcDef = getCalculatorBySlug('co2-abgabe-vermieter-mieter-rechner');
      expect(calcDef).toBeDefined();

      // Standard residential apartment, 80 m², 100 € cost, 12 months, 12.5 kg/m²a
      const res = calcDef!.calculate({
        co2CostTotal: 100,
        co2EmissionKgPerSqm: 12.5,
        livingArea: 80,
        billingMonths: 12,
        statutoryExemption: 'none',
      });
      expect(res.error).toBeUndefined();
      // 12.5 kg/m²/a -> Stufe 2 (12 bis < 17 kg/m²: Vermieter 10 %, Mieter 90 %)
      expect(res.secondary?.find((s) => s.id === 'stepDisplay')?.formattedValue).toContain('Stufe 2');
      expect(res.primary.value).toBeCloseTo(10, 1);
      expect(res.secondary?.find((s) => s.id === 'tenantShare')?.value).toBeCloseTo(90, 1);

      // § 9 Denkmalschutz cuts landlord share by 50%
      const resHeritage = calcDef!.calculate({
        co2CostTotal: 100,
        co2EmissionKgPerSqm: 12.5,
        livingArea: 80,
        billingMonths: 12,
        statutoryExemption: 'heritage',
      });
      expect(resHeritage.primary.value).toBeCloseTo(5, 1);
      expect(resHeritage.secondary?.find((s) => s.id === 'tenantShare')?.value).toBeCloseTo(95, 1);
    });

    it('heizkostenvergleich-rechner supports Fernwärme, maintenance toggle and lifecycle CO2e comparisons', () => {
      const calcDef = getCalculatorBySlug('heizkostenvergleich-rechner');
      expect(calcDef).toBeDefined();

      const res = calcDef!.calculate({
        heatDemandKwh: 18000,
        includeMaintenance: true,
      });

      expect(res.error).toBeUndefined();
      expect(res.primary.label).toContain('Wärmepumpe');
      // Table includes Fernwärme
      const fernwaermeStep = res.calculationSteps?.find((s) => s.includes('Fernwärme'));
      expect(fernwaermeStep).toBeDefined();
    });
  });

  describe('6. Sitemap, Registry & Dynamic Loader Integrity', () => {
    it('registers all 6 calculators in ALL_CALCULATORS', () => {
      const requiredSlugs = [
        'co2-auto-rechner',
        'co2-abgabe-vermieter-mieter-rechner',
        'heizkostenvergleich-rechner',
        'co2-strom-rechner',
        'co2-pendeln-rechner',
        'co2-preis-rechner',
      ];

      for (const slug of requiredSlugs) {
        const found = getCalculatorBySlug(slug);
        expect(found, `Calculator ${slug} must be registered`).toBeDefined();
        expect(found?.name).toBeDefined();
        expect(found?.inputs.length).toBeGreaterThan(0);
        expect(typeof found?.calculate).toBe('function');
      }
    });

    it('includes both new supporting articles in getAllArticles()', () => {
      const art1 = getArticleBySlug('co2-pro-kwh-strom');
      expect(art1).toBeDefined();
      expect(art1?.primaryCalculator.slug).toBe('co2-strom-rechner');
      expect(art1?.coverIllustration?.src).toBe('/images/ratgeber/co2-strom-kwh-berechnung-formel.svg');

      const art2 = getArticleBySlug('co2-arbeitsweg-auto-bahn');
      expect(art2).toBeDefined();
      expect(art2?.primaryCalculator.slug).toBe('co2-pendeln-rechner');
      expect(art2?.coverIllustration?.src).toBe('/images/ratgeber/co2-pendeln-verkehrsmittel-vergleich.svg');
    });

    it('dynamically loads engines for all 6 calculators via loadCalculatorEngine', async () => {
      const slugs = [
        'co2-auto-rechner',
        'co2-pendeln-rechner',
        'co2-strom-rechner',
        'co2-preis-rechner',
        'co2-abgabe-vermieter-mieter-rechner',
        'heizkostenvergleich-rechner',
      ];

      for (const slug of slugs) {
        const engine = await loadCalculatorEngine(slug);
        expect(engine, `Dynamic engine for ${slug} must resolve`).not.toBeNull();
        expect(typeof engine).toBe('function');
      }
    });

    it('ensures all 6 calculators and 2 articles appear in sitemap.xml', () => {
      const entries = sitemap();
      const urls = new Set(entries.map((e) => e.url));

      expect(urls.has('https://rechenhafen.de/rechner/co2-strom-rechner/')).toBe(true);
      expect(urls.has('https://rechenhafen.de/rechner/co2-pendeln-rechner/')).toBe(true);
      expect(urls.has('https://rechenhafen.de/rechner/co2-preis-rechner/')).toBe(true);
      expect(urls.has('https://rechenhafen.de/rechner/co2-auto-rechner/')).toBe(true);
      expect(urls.has('https://rechenhafen.de/rechner/co2-abgabe-vermieter-mieter-rechner/')).toBe(true);
      expect(urls.has('https://rechenhafen.de/rechner/heizkostenvergleich-rechner/')).toBe(true);

      expect(urls.has('https://rechenhafen.de/ratgeber/co2-pro-kwh-strom/')).toBe(true);
      expect(urls.has('https://rechenhafen.de/ratgeber/co2-arbeitsweg-auto-bahn/')).toBe(true);
    });
  });
});
