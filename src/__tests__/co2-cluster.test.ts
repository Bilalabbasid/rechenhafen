import { describe, it, expect } from 'vitest';
import { EMISSION_FACTORS, getFactor, REMOVED_UNVERIFIED_FACTORS, CO2_PRICE_2026_CORRIDOR } from '@/data/emissions';
import {
  calculateElectricityCO2,
  calculateCommutingCO2,
  calculateCarbonPrice,
  calculateLandlordTenantCO2,
} from '@/lib/calculators/co2';
import { calculateCarCO2 } from '@/lib/calculators/auto';
import { getCalculatorBySlug, ALL_CALCULATORS } from '@/data/calculators';
import { getAllArticles, getArticleBySlug } from '@/data/ratgeber/articles';
import { loadCalculatorEngine } from '@/lib/calculators/dynamic-loader';
import sitemap from '@/app/sitemap';

describe('CO2 Calculator Cluster Comprehensive Regression & Legal Verification Suite', () => {
  describe('1. Shared Emissions Factor Registry (Official Authority Verification)', () => {
    it('contains all required official factors with strict metadata', () => {
      const keys = [
        'strom_mix_de_generation_2025',
        'verkehr_pkw_durchschnitt',
        'verkehr_pkw_benzin',
        'verkehr_pkw_diesel',
        'verkehr_pkw_elektro',
        'verkehr_bahn_nahverkehr',
        'verkehr_bahn_fernverkehr',
        'verkehr_bus_nahverkehr',
        'verkehr_bus_fernverkehr',
        'verkehr_strassenbahn_ubahn',
        'verkehr_pedelec',
        'brennstoff_erdgas_ebev',
        'brennstoff_heizoel_el_ebev',
        'brennstoff_benzin_ebev',
        'brennstoff_diesel_ebev',
        'brennstoff_lpg_ebev_kg',
        'co2_preis_behg_2024',
        'co2_preis_behg_2025',
      ] as const;

      for (const k of keys) {
        const factor = getFactor(k);
        expect(factor, `Factor ${k} must exist in registry`).toBeDefined();
        expect(factor!.value).toBeGreaterThan(0);
        expect(factor!.unit).toBeDefined();
        expect(factor!.geographicCoverage).toContain('DE');
        expect(factor!.referenceYear).toBeGreaterThanOrEqual(2024);
        expect(factor!.sourceUrl).toMatch(/^https:\/\//);
        expect(['CO2', 'CO2e', 'EUR']).toContain(factor!.gasType);
        expect(['direct_combustion', 'energy_generation', 'lifecycle', 'tremod_energy_provision', 'price_statutory']).toContain(factor!.boundary);
        expect(['estimated', 'provisional', 'final', 'statutory']).toContain(factor!.status);
        expect(factor!.verificationDate).toBe('2026-10-29');
      }
    });

    it('verifies official UBA 2025 electricity generation estimate: 344 g CO2/kWh published 23 March 2026', () => {
      const factor = EMISSION_FACTORS.strom_mix_de_generation_2025;
      expect(factor.value).toBe(344);
      expect(factor.unit).toBe('g CO₂/kWh');
      expect(factor.boundary).toBe('energy_generation');
      expect(factor.gasType).toBe('CO2');
      expect(factor.referenceYear).toBe(2025);
      expect(factor.status).toBe('estimated');
      expect(factor.sourceUrl).toContain('umweltbundesamt.de');
    });

    it('verifies official UBA TREMOD 6.71B (10/2025, Bezugsjahr 2024) transit values', () => {
      // Pkw Durchschnitt: 164 g CO2e/Pkm
      expect(EMISSION_FACTORS.verkehr_pkw_durchschnitt.value).toBe(164);
      // Benzin-Pkw: 165 g CO2e/Pkm
      expect(EMISSION_FACTORS.verkehr_pkw_benzin.value).toBe(165);
      // Diesel-Pkw: 175 g CO2e/Pkm
      expect(EMISSION_FACTORS.verkehr_pkw_diesel.value).toBe(175);
      // Elektro-Pkw: 70 g CO2e/Pkm
      expect(EMISSION_FACTORS.verkehr_pkw_elektro.value).toBe(70);
      // Eisenbahn Fernverkehr: 26 g CO2e/Pkm (Auslastung 47%)
      expect(EMISSION_FACTORS.verkehr_bahn_fernverkehr.value).toBe(26);
      // Eisenbahn Nahverkehr: 44 g CO2e/Pkm
      expect(EMISSION_FACTORS.verkehr_bahn_nahverkehr.value).toBe(44);
      // Linienbus Fernverkehr: 30 g CO2e/Pkm (Auslastung 53%)
      expect(EMISSION_FACTORS.verkehr_bus_fernverkehr.value).toBe(30);
      // Linienbus Nahverkehr: 90 g CO2e/Pkm
      expect(EMISSION_FACTORS.verkehr_bus_nahverkehr.value).toBe(90);
      // Straßen-, Stadt- und U-Bahn: 42 g CO2e/Pkm
      expect(EMISSION_FACTORS.verkehr_strassenbahn_ubahn.value).toBe(42);
      // Pedelec: 3 g CO2e/Pkm
      expect(EMISSION_FACTORS.verkehr_pedelec.value).toBe(3);
    });

    it('verifies exact statutory derivations from EBeV 2030 Anlage 2 Teil 4', () => {
      // Erdgas Ho: 3.2508 GJ/MWh * 0.0558 t CO2/GJ = 0.18139464 t/MWh = kg/kWh
      expect(EMISSION_FACTORS.brennstoff_erdgas_ebev.value).toBeCloseTo(0.18139464, 6);
      // Benzin: 0.755 t/1000l * 43.5 GJ/t * 0.0729 t CO2/GJ = 2.39421825 kg CO2/l
      expect(EMISSION_FACTORS.brennstoff_benzin_ebev.value).toBeCloseTo(2.39421825, 6);
      // Diesel / Heizöl EL: 0.845 t/1000l * 42.8 GJ/t * 0.0740 t CO2/GJ = 2.676284 kg CO2/l
      expect(EMISSION_FACTORS.brennstoff_diesel_ebev.value).toBeCloseTo(2.676284, 6);
      expect(EMISSION_FACTORS.brennstoff_heizoel_el_ebev.value).toBeCloseTo(2.676284, 6);
      // LPG: 46.0 GJ/t * 0.0655 t CO2/GJ = 3.013 kg CO2/kg fuel
      expect(EMISSION_FACTORS.brennstoff_lpg_ebev_kg.value).toBeCloseTo(3.013, 3);
      expect(EMISSION_FACTORS.brennstoff_lpg_ebev_kg.unit).toBe('kg CO₂/kg');
    });

    it('verifies BEHG statutory price schedule and 2026 corridor', () => {
      expect(EMISSION_FACTORS.co2_preis_behg_2024.value).toBe(45);
      expect(EMISSION_FACTORS.co2_preis_behg_2025.value).toBe(55);
      expect(CO2_PRICE_2026_CORRIDOR.min).toBe(55);
      expect(CO2_PRICE_2026_CORRIDOR.midpoint).toBe(60);
      expect(CO2_PRICE_2026_CORRIDOR.max).toBe(65);
    });

    it('maintains explicit documentation of removed unverified factors', () => {
      expect(REMOVED_UNVERIFIED_FACTORS.length).toBeGreaterThanOrEqual(4);
      expect(REMOVED_UNVERIFIED_FACTORS.some((f) => f.key.includes('strom_mix_de_lifecycle'))).toBe(true);
      expect(REMOVED_UNVERIFIED_FACTORS.some((f) => f.key.includes('strom_oekostrom'))).toBe(true);
      expect(REMOVED_UNVERIFIED_FACTORS.some((f) => f.key.includes('verkehr_bahn_nahverkehr'))).toBe(true);
    });
  });

  describe('2. Electricity CO2 Calculator (/rechner/co2-strom-rechner/)', () => {
    it('calculates 2,500 kWh × 344 g/kWh ÷ 1,000 = 860 kg CO2 (0.86 Tonnen)', () => {
      const res = calculateElectricityCO2({
        consumptionKwh: 2500,
        period: 'year',
        tariffType: 'uba_2025',
      });

      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(860);
      expect(res.primary.formattedValue).toContain('860 kg CO₂');
      expect(res.secondary?.find((s) => s.id === 'totalTonnes')?.value).toBe(0.86);
      expect(res.directAnswer).toContain('860 kg CO₂');
    });

    it('handles decimal comma and custom factors without NaN', () => {
      const res = calculateElectricityCO2({
        consumptionKwh: '1500,5',
        tariffType: 'custom',
        customFactorGrams: '320,5',
      });
      expect(res.error).toBeUndefined();
      const expectedKg = (1500.5 * 320.5) / 1000;
      expect(res.primary.value).toBeCloseTo(expectedKg, 2);
    });

    it('preserves 0 kWh input without fallback', () => {
      const res = calculateElectricityCO2({ consumptionKwh: 0 });
      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(0);
      expect(res.secondary?.find((s) => s.id === 'totalKg')?.value).toBe(0);
    });

    it('supports comparison consumption scenario', () => {
      const res = calculateElectricityCO2({
        consumptionKwh: 2500,
        compareConsumptionKwh: 1500,
      });
      expect(res.error).toBeUndefined();
      const compSec = res.secondary?.find((s) => s.id === 'comparisonResult');
      expect(compSec).toBeDefined();
      expect(compSec?.value).toBe(516); // 1,500 * 344 / 1,000 = 516 kg
    });
  });

  describe('3. Commuting CO2 Calculator (/rechner/co2-pendeln-rechner/)', () => {
    it('verifies exact UBA TREMOD 2024 commuting scenario: 20 km × 2 × 180 d = 7,200 Pkm', () => {
      const res = calculateCommutingCO2({
        oneWayDistanceKm: 20,
        commutingDays: 180,
        transportMode: 'car_average',
        enableScenarioB: true,
        comparisonMode: 'train_local',
        comparisonDistanceKm: 20,
        comparisonDays: 180,
      });

      expect(res.error).toBeUndefined();
      // Total distance = 7,200 Pkm
      const totalPkm = res.secondary?.find((s) => s.id === 'totalKm')?.value;
      expect(totalPkm).toBe(7200);

      // Pkw: 7,200 * 164 / 1,000 = 1,180.8 kg CO2e
      const pkwKg = res.secondary?.find((s) => s.id === 'emissionsKg')?.value;
      expect(pkwKg).toBeCloseTo(1180.8, 1);

      // Eisenbahn Nahverkehr: 7,200 * 44 / 1,000 = 316.8 kg CO2e
      const trainLocalKg = res.secondary?.find((s) => s.id === 'compEmissions')?.value;
      expect(trainLocalKg).toBeCloseTo(316.8, 1);

      // Difference: 1,180.8 - 316.8 = 864.0 kg CO2e
      const diffKg = res.secondary?.find((s) => s.id === 'savings')?.value;
      expect(diffKg).toBeCloseTo(864.0, 1);
    });

    it('verifies other UBA 2024 transit modes on 7,200 Pkm', () => {
      // Eisenbahn Fernverkehr: 7,200 * 26 / 1,000 = 187.2 kg
      const trainLong = calculateCommutingCO2({
        oneWayDistanceKm: 20,
        commutingDays: 180,
        transportMode: 'train_long',
      });
      expect(trainLong.secondary?.find((s) => s.id === 'emissionsKg')?.value).toBeCloseTo(187.2, 1);

      // Linienbus Nahverkehr: 7,200 * 90 / 1,000 = 648.0 kg
      const busLocal = calculateCommutingCO2({
        oneWayDistanceKm: 20,
        commutingDays: 180,
        transportMode: 'bus_local',
      });
      expect(busLocal.secondary?.find((s) => s.id === 'emissionsKg')?.value).toBeCloseTo(648.0, 1);

      // Linienbus Fernverkehr: 7,200 * 30 / 1,000 = 216.0 kg
      const busLong = calculateCommutingCO2({
        oneWayDistanceKm: 20,
        commutingDays: 180,
        transportMode: 'bus_long',
      });
      expect(busLong.secondary?.find((s) => s.id === 'emissionsKg')?.value).toBeCloseTo(216.0, 1);

      // Straßen-, Stadt- und U-Bahn: 7,200 * 42 / 1,000 = 302.4 kg
      const tram = calculateCommutingCO2({
        oneWayDistanceKm: 20,
        commutingDays: 180,
        transportMode: 'tram_metro',
      });
      expect(tram.secondary?.find((s) => s.id === 'emissionsKg')?.value).toBeCloseTo(302.4, 1);

      // Pedelec: 7,200 * 3 / 1,000 = 21.6 kg
      const pedelec = calculateCommutingCO2({
        oneWayDistanceKm: 20,
        commutingDays: 180,
        transportMode: 'pedelec',
      });
      expect(pedelec.secondary?.find((s) => s.id === 'emissionsKg')?.value).toBeCloseTo(21.6, 1);

      // Fahrrad: 0 kg
      const bike = calculateCommutingCO2({
        oneWayDistanceKm: 20,
        commutingDays: 180,
        transportMode: 'bike_walk',
      });
      expect(bike.secondary?.find((s) => s.id === 'emissionsKg')?.value).toBe(0);
    });

    it('correctly models homeoffice reduction via homeofficeDaysPerWeek', () => {
      const res = calculateCommutingCO2({
        oneWayDistanceKm: 20,
        commutingDays: 180,
        transportMode: 'car_average',
        homeofficeDaysPerWeek: 1, // 36 days less
      });

      // Saved distance: 36 * 40 = 1,440 Pkm * 164 g = 236.16 kg saved
      const hoSavings = res.secondary?.find((s) => s.id === 'homeofficeSaving')?.value;
      expect(hoSavings).toBeCloseTo(236.16, 1);
    });
  });

  describe('4. Fuel Carbon Price Calculator (/rechner/co2-preis-rechner/)', () => {
    it('Mode A: Known emissions (2,000 kg × 60 €/t = 120 €)', () => {
      const res = calculateCarbonPrice({
        calculationMode: 'by_emissions',
        emissionsAmount: 2000,
        emissionsUnit: 'kg',
        pricePerTonne: 60,
        priceTaxStatus: 'user_basis',
      });

      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(120);
      expect(res.directAnswer).toContain('120,00');
    });

    it('Mode B: Natural Gas 15,000 kWh at 2026 corridor midpoint (60 €/t netto)', () => {
      const res = calculateCarbonPrice({
        calculationMode: 'by_fuel',
        fuel: 'gas',
        amount: 15000,
        priceYear: '2026_corridor_60',
        includeVat: true,
      });

      expect(res.error).toBeUndefined();
      // 15,000 * 0.18139464 = 2,720.92 kg CO2 = 2.72092 t CO2
      // Net: 2.72092 * 60 = 163.255 € = 163.26 €
      // Gross: 163.255 * 1.19 = 194.273 € = 194.27 €
      const costGross = res.primary.value;
      const costNet = res.secondary?.find((s) => s.id === 'costNet')?.value;
      expect(costNet).toBeCloseTo(163.26, 1);
      expect(costGross).toBeCloseTo(194.27, 1);
    });

    it('Mode B: LPG input in kg with EBeV factor 3.013 kg CO2/kg', () => {
      const res = calculateCarbonPrice({
        calculationMode: 'by_fuel',
        fuel: 'lpg',
        amount: 1000,
        priceYear: '2026_corridor_60',
        includeVat: false,
      });

      expect(res.error).toBeUndefined();
      // 1,000 kg * 3.013 = 3,013 kg CO2 = 3.013 t
      // Net: 3.013 * 60 = 180.78 €
      expect(res.primary.value).toBeCloseTo(180.78, 1);
    });

    it('preserves 0 amount without error', () => {
      const res = calculateCarbonPrice({ calculationMode: 'by_fuel', amount: 0 });
      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(0);
    });
  });

  describe('5. Car CO2 Calculator (/rechner/co2-auto-rechner/)', () => {
    it('Rechenweg A: Direct combustion (Benzin 7.0 l/100 km, 15,000 km)', () => {
      const res = calculateCarCO2({
        fuelType: 'benzin',
        consumption: 7.0,
        distanceKm: 15000,
        tripMode: 'annual',
        method: 'direct',
      });

      expect(res.error).toBeUndefined();
      // 15,000 * 7 / 100 = 1,050 l * 2.39421825 = 2,513.93 kg CO2 = 2.51 t CO2
      expect(res.primary.value).toBeCloseTo(2.51, 1);
      expect(res.directAnswer).toContain('Rechenweg A');
    });

    it('Rechenweg B: Electric vehicle with 2025 grid mix (18.0 kWh/100 km, 350 km trip)', () => {
      const res = calculateCarCO2({
        fuelType: 'electric',
        consumption: 18.0,
        distanceKm: 350,
        tripMode: 'single_trip',
        method: 'direct',
      });

      expect(res.error).toBeUndefined();
      // 350 * 18 / 100 = 63 kWh * 0.344 kg/kWh = 21.67 kg CO2
      expect(res.primary.value).toBeCloseTo(21.67, 1);
      expect(res.directAnswer).toContain('Rechenweg B');
    });

    it('Rechenweg C: UBA TREMOD passenger-km average for Benzin-Pkw (165 g CO2e/Pkm)', () => {
      const res = calculateCarCO2({
        fuelType: 'benzin',
        distanceKm: 15000,
        tripMode: 'annual',
        method: 'tremod',
      });

      expect(res.error).toBeUndefined();
      // 15,000 * 165 / 1,000 = 2,475 kg = 2.475 t CO2e
      expect(res.primary.value).toBeCloseTo(2.475, 2);
      expect(res.directAnswer).toContain('Szenario C');
    });
  });

  describe('6. Landlord/Tenant CO2 Cost Allocation (/rechner/co2-abgabe-vermieter-mieter-rechner/)', () => {
    it('verifies all 10 statutory steps at annual thresholds according to CO2KostAufG Anlage', () => {
      const testCases = [
        { specific: 0, expectedStep: 1, landlordPct: 0, tenantPct: 100 },
        { specific: 11.99, expectedStep: 1, landlordPct: 0, tenantPct: 100 },
        { specific: 12.00, expectedStep: 2, landlordPct: 10, tenantPct: 90 },
        { specific: 16.99, expectedStep: 2, landlordPct: 10, tenantPct: 90 },
        { specific: 17.00, expectedStep: 3, landlordPct: 20, tenantPct: 80 },
        { specific: 21.99, expectedStep: 3, landlordPct: 20, tenantPct: 80 },
        { specific: 22.00, expectedStep: 4, landlordPct: 30, tenantPct: 70 },
        { specific: 26.99, expectedStep: 4, landlordPct: 30, tenantPct: 70 },
        { specific: 27.00, expectedStep: 5, landlordPct: 40, tenantPct: 60 },
        { specific: 31.99, expectedStep: 5, landlordPct: 40, tenantPct: 60 },
        { specific: 32.00, expectedStep: 6, landlordPct: 50, tenantPct: 50 },
        { specific: 36.99, expectedStep: 6, landlordPct: 50, tenantPct: 50 },
        { specific: 37.00, expectedStep: 7, landlordPct: 60, tenantPct: 40 },
        { specific: 41.99, expectedStep: 7, landlordPct: 60, tenantPct: 40 },
        { specific: 42.00, expectedStep: 8, landlordPct: 70, tenantPct: 30 },
        { specific: 46.99, expectedStep: 8, landlordPct: 70, tenantPct: 30 },
        { specific: 47.00, expectedStep: 9, landlordPct: 80, tenantPct: 20 },
        { specific: 51.99, expectedStep: 9, landlordPct: 80, tenantPct: 20 },
        { specific: 52.00, expectedStep: 10, landlordPct: 95, tenantPct: 5 },
        { specific: 75.00, expectedStep: 10, landlordPct: 95, tenantPct: 5 },
      ];

      for (const tc of testCases) {
        const area = 100;
        const totalKg = tc.specific * area;
        const res = calculateLandlordTenantCO2({
          co2CostTotal: 100,
          co2EmissionsKg: totalKg,
          livingArea: area,
          billingMonths: 12,
          statutoryExemption: 'none',
        });

        expect(res.error).toBeUndefined();
        const stepNum = res.secondary?.find((s) => s.id === 'stepClassification')?.value;
        const landlordPctVal = res.secondary?.find((s) => s.id === 'landlordPct')?.value;
        const tenantPctVal = res.secondary?.find((s) => s.id === 'tenantPct')?.value;

        expect(stepNum, `Specific ${tc.specific} must be step ${tc.expectedStep}`).toBe(tc.expectedStep);
        expect(landlordPctVal).toBeCloseTo(tc.landlordPct, 1);
        expect(tenantPctVal).toBeCloseTo(tc.tenantPct, 1);
        expect(res.primary.value).toBeCloseTo(tc.landlordPct, 1);
      }
    });

    it('verifies proportional threshold scaling for partial-year periods (§ 5 Abs. 1 Satz 4)', () => {
      // In 6 months, thresholds are halved (12 -> 6, 32 -> 16, 37 -> 18.5, 52 -> 26).
      // Area = 80 m2. In 6 months, total emissions = 1,400 kg.
      // Specific period emission = 1,400 / 80 = 17.50 kg/m2.
      // Without scaling, 17.50 would be Stufe 3 (20% landlord).
      // With statutory scaling (6/12), Stufe 6 threshold is [16.0, 18.5).
      // 17.50 kg/m2 correctly falls in Stufe 6 (50% landlord)!
      const res6Mon = calculateLandlordTenantCO2({
        co2CostTotal: 100,
        co2EmissionsKg: 1400,
        livingArea: 80,
        billingMonths: 6,
        statutoryExemption: 'none',
      });

      expect(res6Mon.error).toBeUndefined();
      expect(res6Mon.secondary?.find((s) => s.id === 'stepClassification')?.value).toBe(6);
      expect(res6Mon.secondary?.find((s) => s.id === 'landlordPct')?.value).toBe(50);
      expect(res6Mon.primary.value).toBe(50);
      expect(res6Mon.secondary?.find((s) => s.id === 'tenantShare')?.value).toBe(50);
    });

    it('verifies § 9 Abs. 1 exception: landlord share halved when one category is blocked', () => {
      // 80 m2, 12 months, 2,800 kg CO2 (35 kg/m2 = Stufe 6: normal 50% landlord)
      // With single restriction (e.g. heritage): Landlord share becomes 50% * 0.5 = 25%.
      const res = calculateLandlordTenantCO2({
        co2CostTotal: 100,
        co2EmissionsKg: 2800,
        livingArea: 80,
        billingMonths: 12,
        statutoryExemption: 'single_restriction',
      });

      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(25);
      expect(res.secondary?.find((s) => s.id === 'landlordPct')?.value).toBe(25);
      expect(res.secondary?.find((s) => s.id === 'tenantShare')?.value).toBe(75);
      expect(res.secondary?.find((s) => s.id === 'tenantPct')?.value).toBe(75);
    });

    it('verifies § 9 Abs. 2 exception: no statutory allocation when BOTH categories are blocked', () => {
      const res = calculateLandlordTenantCO2({
        co2CostTotal: 100,
        co2EmissionsKg: 2800,
        livingArea: 80,
        billingMonths: 12,
        statutoryExemption: 'both_restrictions',
      });

      expect(res.error).toBeUndefined();
      expect(res.primary.formattedValue).toContain('Keine Aufteilung');
      expect(res.directAnswer).toContain('§ 9 Abs. 2 CO2KostAufG');
    });

    it('handles zero cost and zero emissions gracefully', () => {
      const resZeroCost = calculateLandlordTenantCO2({
        co2CostTotal: 0,
        co2EmissionsKg: 1000,
        livingArea: 80,
      });
      expect(resZeroCost.error).toBeUndefined();
      expect(resZeroCost.primary.value).toBe(0);

      const resZeroKg = calculateLandlordTenantCO2({
        co2CostTotal: 100,
        co2EmissionsKg: 0,
        livingArea: 80,
      });
      expect(resZeroKg.error).toBeUndefined();
      expect(resZeroKg.primary.value).toBe(0); // Stufe 1: 0% landlord
      expect(resZeroKg.secondary?.find((s) => s.id === 'stepClassification')?.value).toBe(1);
    });

    it('verifies exact Prompt Section 10 worked example: 200 € cost, 2,800 kg CO2, 100 m2, 12 months -> Stufe 5 (40% landlord / 60% tenant) and with § 9(1) (20% landlord / 80% tenant)', () => {
      // Normal without exemption
      const resNormal = calculateLandlordTenantCO2({
        co2CostTotal: 200,
        co2EmissionsKg: 2800,
        livingArea: 100,
        billingMonths: 12,
        statutoryExemption: 'none',
      });

      expect(resNormal.error).toBeUndefined();
      expect(resNormal.secondary?.find((s) => s.id === 'stepClassification')?.value).toBe(5);
      expect(resNormal.secondary?.find((s) => s.id === 'landlordPct')?.value).toBe(40);
      expect(resNormal.secondary?.find((s) => s.id === 'tenantPct')?.value).toBe(60);
      expect(resNormal.primary.value).toBe(80);
      expect(resNormal.secondary?.find((s) => s.id === 'tenantShare')?.value).toBe(120);

      // With § 9(1) exemption
      const resExemption = calculateLandlordTenantCO2({
        co2CostTotal: 200,
        co2EmissionsKg: 2800,
        livingArea: 100,
        billingMonths: 12,
        statutoryExemption: 'single_restriction',
      });

      expect(resExemption.error).toBeUndefined();
      expect(resExemption.secondary?.find((s) => s.id === 'stepClassification')?.value).toBe(5);
      expect(resExemption.secondary?.find((s) => s.id === 'landlordPct')?.value).toBe(20);
      expect(resExemption.secondary?.find((s) => s.id === 'tenantPct')?.value).toBe(80);
      expect(resExemption.primary.value).toBe(40);
      expect(resExemption.secondary?.find((s) => s.id === 'tenantShare')?.value).toBe(160);
    });

    it('verifies exact Prompt Section 11 partial-year test: 6 months, 1,200 kg CO2, 100 m2 -> 12 kg/m2 in [11, 13.5) = Stufe 4 (30% landlord / 70% tenant), 200 € total -> Landlord 60 €, Tenant 140 €', () => {
      const res6Mon = calculateLandlordTenantCO2({
        co2CostTotal: 200,
        co2EmissionsKg: 1200,
        livingArea: 100,
        billingMonths: 6,
        statutoryExemption: 'none',
      });

      expect(res6Mon.error).toBeUndefined();
      // Specific = 1200 / 100 = 12 kg/m2
      // Scaled thresholds: <6, 6-<8.5, 8.5-<11, 11-<13.5 (Stufe 4: Landlord 30%)
      expect(res6Mon.secondary?.find((s) => s.id === 'stepClassification')?.value).toBe(4);
      expect(res6Mon.secondary?.find((s) => s.id === 'landlordPct')?.value).toBe(30);
      expect(res6Mon.secondary?.find((s) => s.id === 'tenantPct')?.value).toBe(70);
      expect(res6Mon.primary.value).toBe(60);
      expect(res6Mon.secondary?.find((s) => s.id === 'tenantShare')?.value).toBe(140);
    });

    it('verifies 3-month partial-year test: 3 months, 600 kg CO2, 100 m2 -> 6 kg/m2 in [5.5, 6.75) = Stufe 4 (30% landlord / 70% tenant), 100 € total -> Landlord 30 €, Tenant 70 €', () => {
      const res3Mon = calculateLandlordTenantCO2({
        co2CostTotal: 100,
        co2EmissionsKg: 600,
        livingArea: 100,
        billingMonths: 3,
        statutoryExemption: 'none',
      });

      expect(res3Mon.error).toBeUndefined();
      // Specific = 600 / 100 = 6 kg/m2
      // Scaled thresholds (3/12 = 0.25): <3 (Stufe 1), 3-<4.25 (Stufe 2), 4.25-<5.5 (Stufe 3), 5.5-<6.75 (Stufe 4: Landlord 30%)
      expect(res3Mon.secondary?.find((s) => s.id === 'stepClassification')?.value).toBe(4);
      expect(res3Mon.secondary?.find((s) => s.id === 'landlordPct')?.value).toBe(30);
      expect(res3Mon.secondary?.find((s) => s.id === 'tenantPct')?.value).toBe(70);
      expect(res3Mon.primary.value).toBe(30);
      expect(res3Mon.secondary?.find((s) => s.id === 'tenantShare')?.value).toBe(70);
    });

    it('rejects invalid area or negative values with actionable errors', () => {
      const resInvalidArea = calculateLandlordTenantCO2({
        co2CostTotal: 100,
        co2EmissionsKg: 1000,
        livingArea: 0,
      });
      expect(resInvalidArea.error).toContain('Wohnfläche');

      const resNegativeCost = calculateLandlordTenantCO2({
        co2CostTotal: -50,
        co2EmissionsKg: 1000,
        livingArea: 80,
      });
      expect(resNegativeCost.error).toContain('negativ');
    });
  });

  describe('7. Heating Comparison Calculator (/rechner/heizkostenvergleich-rechner/)', () => {
    it('compares heating systems without unverified lifecycle columns', () => {
      const calc = getCalculatorBySlug('heizkostenvergleich-rechner');
      expect(calc).toBeDefined();

      const res = calc!.calculate({
        heatDemandKwh: 15000,
        includeMaintenance: true,
      });

      expect(res.error).toBeUndefined();
      expect(res.breakdown?.columns.some((c) => c.key === 'lifecycleCo2')).toBe(false);
      expect(res.breakdown?.columns.some((c) => c.key === 'system')).toBe(true);
      expect(res.breakdown?.columns.some((c) => c.key === 'total')).toBe(true);
    });
  });

  describe('8. Articles and Sitemap Integrity', () => {
    it('resolves all 8 cluster articles in getAllArticles()', () => {
      const expectedSlugs = [
        'co2-pro-kwh-strom',
        'co2-arbeitsweg-auto-bahn',
        'co2-preis-2026-brennstoffe',
        'co2-kosten-vermieter-mieter-2026',
        'co2-ausstoss-auto-kilometer-vergleich',
        'emissionsfaktoren-brennstoffe-erklaert',
        'fernwaerme-co2-faktor-netzunterschiede',
        'waermepumpe-vs-gasheizung-co2-vergleich',
      ];

      for (const slug of expectedSlugs) {
        const article = getArticleBySlug(slug);
        expect(article, `Article ${slug} must be registered`).toBeDefined();
        expect(article?.author.name).toBe('Redaktion RechenHafen');
        expect(article?.reviewer?.name).toBe('Redaktion RechenHafen');
        expect(article?.sections.length).toBeGreaterThanOrEqual(3);
        expect(article?.faqs.length).toBeGreaterThanOrEqual(2);
        expect(article?.officialSources.length).toBeGreaterThanOrEqual(1);
        expect(article?.workedExample).toBeDefined();
      }
    });

    it('verifies that all 6 calculators and 8 articles are present in sitemap.xml', () => {
      const entries = sitemap();
      const urls = new Set(entries.map((e) => e.url));

      const requiredCalculatorUrls = [
        'https://rechenhafen.de/rechner/co2-strom-rechner/',
        'https://rechenhafen.de/rechner/co2-pendeln-rechner/',
        'https://rechenhafen.de/rechner/co2-preis-rechner/',
        'https://rechenhafen.de/rechner/co2-auto-rechner/',
        'https://rechenhafen.de/rechner/co2-abgabe-vermieter-mieter-rechner/',
        'https://rechenhafen.de/rechner/heizkostenvergleich-rechner/',
      ];

      for (const url of requiredCalculatorUrls) {
        expect(urls.has(url), `Calculator URL ${url} must be in sitemap`).toBe(true);
      }

      const requiredArticleUrls = [
        'https://rechenhafen.de/ratgeber/co2-pro-kwh-strom/',
        'https://rechenhafen.de/ratgeber/co2-arbeitsweg-auto-bahn/',
        'https://rechenhafen.de/ratgeber/co2-preis-2026-brennstoffe/',
        'https://rechenhafen.de/ratgeber/co2-kosten-vermieter-mieter-2026/',
        'https://rechenhafen.de/ratgeber/co2-ausstoss-auto-kilometer-vergleich/',
        'https://rechenhafen.de/ratgeber/emissionsfaktoren-brennstoffe-erklaert/',
        'https://rechenhafen.de/ratgeber/fernwaerme-co2-faktor-netzunterschiede/',
        'https://rechenhafen.de/ratgeber/waermepumpe-vs-gasheizung-co2-vergleich/',
      ];

      for (const url of requiredArticleUrls) {
        expect(urls.has(url), `Article URL ${url} must be in sitemap`).toBe(true);
      }
    });

    it('verifies dynamic loader for all 6 CO2 calculators', async () => {
      const slugs = [
        'co2-strom-rechner',
        'co2-pendeln-rechner',
        'co2-preis-rechner',
        'co2-auto-rechner',
        'co2-abgabe-vermieter-mieter-rechner',
        'heizkostenvergleich-rechner',
      ];

      for (const slug of slugs) {
        const engine = await loadCalculatorEngine(slug);
        expect(engine, `Dynamic engine for ${slug} must resolve`).not.toBeNull();
        expect(typeof engine).toBe('function');
      }
    });
  });
});
