import { describe, it, expect } from 'vitest';
import { calculateFuelCost, calculateTripExpenses } from '@/lib/calculators/auto';
import { calculateBruttoNetto } from '@/lib/calculators/steuernGehalt';
import { AUTO_CALCULATORS } from '@/data/calculators/auto';
import { STEUERN_GEHALT_CALCULATORS } from '@/data/calculators/steuernGehalt';
import { HAUSHALT_CALCULATORS } from '@/data/calculators/haushalt';
import { EXTRA_WOHNEN_HAUSHALT } from '@/data/calculators/extra/wohnenHaushalt';
import { EXTRA_BAUEN_GEOMETRIE } from '@/data/calculators/extra/bauenGeometrie';
import { EXTRA_AUTO_ARBEIT } from '@/data/calculators/extra/autoArbeit';

describe('Audit Improvements: 8 Scoped Calculators', () => {
  // 1. Spritkostenrechner
  describe('1. Spritkostenrechner (/rechner/spritkostenrechner/)', () => {
    const calc = AUTO_CALCULATORS.find((c) => c.slug === 'spritkostenrechner');

    it('calculates independent regression example: 100 km, 6 l/100km, 1.80 €/l = 10.80 €', () => {
      expect(calc).toBeDefined();
      const output = calc!.calculate({
        distance: 100,
        consumption: 6,
        pricePerLiter: 1.80,
      });

      expect(output.primary.value).toBeCloseTo(10.80, 2);
      const liters = output.secondary?.find((s: any) => s.id === 'totalLiters');
      expect(liters?.value).toBeCloseTo(6, 4);
    });

    it('correctly preserves 0 km distance and 0 €/l price without error', () => {
      const zeroDist = calc!.calculate({ distance: 0, consumption: 6, pricePerLiter: 1.80 });
      expect(zeroDist.primary.value).toBe(0);

      const zeroPrice = calc!.calculate({ distance: 100, consumption: 6, pricePerLiter: 0 });
      expect(zeroPrice.primary.value).toBe(0);
    });

    it('has calculator metadata cross-linking to fahrtkostenrechner', () => {
      expect(calc?.relatedSlugs).toContain('fahrtkostenrechner');
    });
  });

  // 2. Brutto-Netto-Rechner
  describe('2. Brutto-Netto-Rechner (/rechner/brutto-netto-rechner/)', () => {
    it('calculates exact 2026 BMF payroll tax with § 39b Vorsorgepauschale for 3.800 € gross', () => {
      const result2026 = calculateBruttoNetto({
        grossSalary: 3800,
        taxClass: '1',
        children: '0',
        age: 30,
        taxYear: '2026',
        federalState: 'other',
        churchTax: 'no',
        healthInsuranceType: 'statutory',
        kvZusatzbeitrag: 2.5,
      });

      // BMF 2026 PAP verification for 3.800 € monthly gross:
      // Tax: 483.50 €
      // Net: 2497.60 €
      expect(result2026.primary.value).toBeCloseTo(2497.60, 2);
      const taxItem = result2026.secondary?.find((s: any) => s.id === 'lohnsteuer');
      expect(taxItem?.value).toBeCloseTo(483.50, 2);
    });

    it('calculates 2025 BMF payroll tax for 3.800 € gross aligning with the 2025 worked example (~2489 € net)', () => {
      const result2025 = calculateBruttoNetto({
        grossSalary: 3800,
        taxClass: '1',
        children: '0',
        age: 30,
        taxYear: '2025',
        federalState: 'other',
        churchTax: 'no',
        healthInsuranceType: 'statutory',
        kvZusatzbeitrag: 2.5,
      });

      // In 2025 with Grundfreibetrag 12.096 € and RV 9.3%, Lohnsteuer is 491.75 €, Netto is 2.489,35 €
      expect(result2025.primary.value).toBeCloseTo(2489.35, 1);
      const taxItem = result2025.secondary?.find((s: any) => s.id === 'lohnsteuer');
      expect(taxItem?.value).toBeCloseTo(491.75, 1);
    });
  });

  // 3. Gasverbrauch-Rechner
  describe('3. Gasverbrauch-Rechner (/rechner/gasverbrauch-kwh-m3-rechner/)', () => {
    const calc = EXTRA_WOHNEN_HAUSHALT.find((c) => c.slug === 'gasverbrauch-kwh-m3-rechner');

    it('calculates independent regression example: 1.000 m³ × 10.8 kWh/m³ × 0.95 = 10.260 kWh', () => {
      expect(calc).toBeDefined();
      const output = calc!.calculate({
        inputMode: 'volume',
        gasCubicMeters: 1000,
        brennwert: 10.8,
        zustandszahl: 0.95,
        gasPricePerKwh: 10.0,
      });

      expect(output.primary.value).toBe(10260);
      // Cost should be 10.260 * 0.10 = 1.026 € (Arbeitspreis)
      const costItem = output.secondary?.find((s: any) => s.id === 'consumptionCost');
      expect(costItem?.value).toBe(1026);
    });

    it('correctly calculates difference between meter readings', () => {
      const output = calc!.calculate({
        inputMode: 'readings',
        meterReadingOld: 14000,
        meterReadingNew: 15000,
        brennwert: 10.8,
        zustandszahl: 0.95,
        gasPricePerKwh: 10.0,
      });

      expect(output.primary.value).toBe(10260);
    });
  });

  // 4. Gaskostenrechner
  describe('4. Gaskostenrechner (/rechner/gaskostenrechner/)', () => {
    const calc = HAUSHALT_CALCULATORS.find((c) => c.slug === 'gaskostenrechner');

    it('calculates independent regression example: 12.000 kWh × 0.10 €/kWh + 120 €/yr = 1.320 €/yr (110 €/mo)', () => {
      expect(calc).toBeDefined();
      const output = calc!.calculate({
        inputType: 'kwh',
        annualKwh: 12000,
        pricePerKwh: 0.10,
        priceUnit: 'eur',
        basePrice: 120,
        basePricePeriod: 'yearly',
      });

      expect(output.primary.value).toBe(1320);
      const monthlyAvg = output.secondary?.find((s: any) => s.id === 'monthlyPayment');
      expect(monthlyAvg?.value).toBe(110);
      const varCost = output.secondary?.find((s: any) => s.id === 'workCost');
      expect(varCost?.value).toBe(1200);
      const fixedCost = output.secondary?.find((s: any) => s.id === 'baseCost');
      expect(fixedCost?.value).toBe(120);
    });

    it('preserves fixed charge when consumption is 0', () => {
      const output = calc!.calculate({
        inputType: 'kwh',
        annualKwh: 0,
        pricePerKwh: 0.10,
        priceUnit: 'eur',
        basePrice: 15,
        basePricePeriod: 'monthly',
      });

      // 0 kWh * 0.10 + 15 * 12 = 180 €
      expect(output.primary.value).toBe(180);
    });
  });

  // 5. Kies- und Splittrechner
  describe('5. Kies- & Splitt-Rechner (/rechner/kies-splitt-rechner/)', () => {
    const calc = EXTRA_BAUEN_GEOMETRIE.find((c) => c.slug === 'kies-splitt-rechner');

    it('calculates independent regression example: 30 m² × 0.05 m = 1.5 m³; +10% allowance = 1.65 m³; @ 1.5 t/m³ = 2.475 t', () => {
      expect(calc).toBeDefined();
      const output = calc!.calculate({
        calcMode: 'area_depth',
        area: 30,
        depth: 5,
        materialType: 'grit_2_5',
        compaction: 10,
      });

      expect(output.primary.value).toBe(2.475);
      const volNet = output.secondary?.find((s: any) => s.id === 'baseVolume');
      expect(volNet?.value).toBe(1.5);
      const volGross = output.secondary?.find((s: any) => s.id === 'totalVolume');
      expect(volGross?.value).toBe(1.65);
      const allowanceM3 = output.secondary?.find((s: any) => s.id === 'allowanceVol');
      expect(allowanceM3?.value).toBe(0.15);
      const bags = output.secondary?.find((s: any) => s.id === 'bigbags');
      expect(bags?.value).toBe(3); // 2.475 t -> 3 Big Bags
    });
  });

  // 6. Fahrtkostenrechner
  describe('6. Fahrtkostenrechner (/rechner/fahrtkostenrechner/)', () => {
    it('calculates independent regression example with tolls, parking, allowance, 3 people', () => {
      // 450 km, 6.5 l/100km, 1.75 €/l, 20 € tolls, 10 € parking, 0.05 €/km allowance, 3 people:
      // Fuel: 29.25 litres
      // Fuel cost: 51.1875 €
      // Additional vehicle cost: 22.50 €
      // Total: 103.6875 € -> 103.69 €
      // Per person: 34.5625 € -> 34.56 €
      const result = calculateTripExpenses({
        distance: 450,
        consumption: 6.5,
        pricePerLiter: 1.75,
        tollCosts: 20,
        parkingCosts: 10,
        vehicleAllowancePerKm: 0.05,
        passengers: 3,
      });

      expect(result.primary.value).toBeCloseTo(103.6875, 4);
      const costPerPerson = result.secondary?.find((s: any) => s.id === 'costPerPerson');
      expect(costPerPerson?.value).toBeCloseTo(34.5625, 4);

      const fuelLiters = result.secondary?.find((s: any) => s.id === 'fuelLitres');
      expect(fuelLiters?.value).toBeCloseTo(29.25, 4);

      const fuelCost = result.secondary?.find((s: any) => s.id === 'fuelCost');
      expect(fuelCost?.value).toBeCloseTo(51.1875, 4);

      const vehicleCost = result.secondary?.find((s: any) => s.id === 'vehicleCost');
      expect(vehicleCost?.value).toBeCloseTo(22.50, 4);
    });

    it('calculates with all optional costs at zero', () => {
      const result = calculateTripExpenses({
        distance: 450,
        consumption: 6.5,
        pricePerLiter: 1.75,
        tollCosts: 0,
        parkingCosts: 0,
        vehicleAllowancePerKm: 0,
        passengers: 3,
      });

      expect(result.primary.value).toBeCloseTo(51.1875, 4);
      const costPerPerson = result.secondary?.find((s: any) => s.id === 'costPerPerson');
      expect(costPerPerson?.value).toBeCloseTo(17.0625, 4);
    });

    it('has repaired non-truncated meta title', () => {
      const calc = AUTO_CALCULATORS.find((c) => c.slug === 'fahrtkostenrechner');
      expect(calc?.metaTitle).toBe('Fahrtkostenrechner: Kosten berechnen & aufteilen');
    });
  });

  // 7. Mautrechner
  describe('7. Autobahn-Mautrechner (/rechner/autobahn-maut-rechner-vignette/)', () => {
    const calc = EXTRA_AUTO_ARBEIT.find((c) => c.slug === 'autobahn-maut-rechner-vignette');

    it('calculates 10-day Austria vignette (12.80 €) + Brenner round-trip (24.00 €) = 36.80 €', () => {
      expect(calc).toBeDefined();
      const output = calc!.calculate({
        countryRoute: 'at_brenner',
      });

      expect(output.primary.value).toBe(36.80);
    });

    it('calculates Austria 10-day vignette alone (12.80 €)', () => {
      const output = calc!.calculate({
        countryRoute: 'at_10days',
      });

      expect(output.primary.value).toBe(12.80);
    });

    it('explicitly documents limited geographic coverage (kein europaweiter Routenplaner)', () => {
      expect(calc?.content?.details).toContain('kein europaweiter Routenplaner');
    });
  });

  // 8. Treppenstufen-Rechner
  describe('8. Treppenstufen-Rechner (/rechner/treppen-stufen-rechner/)', () => {
    const calc = EXTRA_BAUEN_GEOMETRIE.find((c) => c.slug === 'treppen-stufen-rechner');

    it('calculates independent regression example: 280 cm rise / 16 risers = 17.5 cm riser, 28 cm tread, 15 treads, 4.20 m run', () => {
      expect(calc).toBeDefined();
      const output = calc!.calculate({
        calcMode: 'fixed_risers',
        floorHeight: 280,
        customRisersCount: 16,
        stepFormulaConstant: 63,
      });

      expect(output.primary.value).toBe(16); // 16 Steigungen
      const stepH = output.secondary?.find((s: any) => s.id === 'stepHeight');
      expect(stepH?.value).toBe(17.5); // 17.5 cm
      const treadD = output.secondary?.find((s: any) => s.id === 'treadDepth');
      expect(treadD?.value).toBe(28); // 28 cm
      const treads = output.secondary?.find((s: any) => s.id === 'treadsCount');
      expect(treads?.value).toBe(15); // 15 Trittstufen
      const runL = output.secondary?.find((s: any) => s.id === 'runLength');
      expect(runL?.value).toBe(4.20); // 4.20 m
    });

    it('has complete, non-truncated metaDescription without trailing "und."', () => {
      expect(calc?.metaDescription).not.toMatch(/und\.\s*$/);
      expect(calc?.metaDescription).toContain('Stufenhöhe');
    });
  });

  // 9. SEO Metadata Verification for all 8 calculators
  describe('9. Search Metadata Quality & Single Brand Suffix Verification', () => {
    const scopedSlugs = [
      'spritkostenrechner',
      'brutto-netto-rechner',
      'gasverbrauch-kwh-m3-rechner',
      'gaskostenrechner',
      'kies-splitt-rechner',
      'fahrtkostenrechner',
      'autobahn-maut-rechner-vignette',
      'treppen-stufen-rechner',
    ];

    const expectedTitles: Record<string, string> = {
      'spritkostenrechner': 'Spritkostenrechner: Benzinkosten für Ihre Fahrt',
      'brutto-netto-rechner': 'Brutto-Netto-Rechner 2026: Was bleibt vom Gehalt?',
      'gasverbrauch-kwh-m3-rechner': 'Gasverbrauch berechnen: Zählerstände & m³ in kWh',
      'gaskostenrechner': 'Gaskostenrechner: Jahreskosten & Monatsdurchschnitt',
      'kies-splitt-rechner': 'Splittrechner: Wie viel Splitt brauche ich?',
      'fahrtkostenrechner': 'Fahrtkostenrechner: Kosten berechnen & aufteilen',
      'autobahn-maut-rechner-vignette': 'Mautrechner: Österreich, Schweiz & Brenner',
      'treppen-stufen-rechner': 'Treppenrechner: Stufenhöhe & Stufenanzahl berechnen',
    };

    const allScoped = [
      ...AUTO_CALCULATORS,
      ...STEUERN_GEHALT_CALCULATORS,
      ...HAUSHALT_CALCULATORS,
      ...EXTRA_WOHNEN_HAUSHALT,
      ...EXTRA_BAUEN_GEOMETRIE,
      ...EXTRA_AUTO_ARBEIT,
    ];

    for (const slug of scopedSlugs) {
      it(`verifies metaTitle and metaDescription for ${slug}`, () => {
        const calc = allScoped.find((c) => c.slug === slug);
        expect(calc).toBeDefined();

        // 1. Title matches candidate and has reasonable length
        expect(calc?.metaTitle).toBe(expectedTitles[slug]);
        expect(calc?.metaTitle.length).toBeGreaterThan(20);
        expect(calc?.metaTitle.length).toBeLessThanOrEqual(65);

        // 2. No hardcoded brand suffix in definition
        expect(calc?.metaTitle).not.toMatch(/\s*[|–-]\s*RechenHafen/i);

        // 3. Rendered title with template has exactly one brand suffix and fits within SERP limit
        const renderedTitle = `${calc?.metaTitle} | RechenHafen`;
        const brandOccurrences = (renderedTitle.match(/RechenHafen/g) || []).length;
        expect(brandOccurrences).toBe(1);
        expect(renderedTitle.length).toBeLessThanOrEqual(75);

        // 4. Description is natural German, between 120 and 175 characters, no trailing punctuation errors
        expect(calc?.metaDescription).toBeDefined();
        expect(calc?.metaDescription?.length).toBeGreaterThanOrEqual(120);
        expect(calc?.metaDescription?.length).toBeLessThanOrEqual(175);
        expect(calc?.metaDescription).not.toMatch(/und\.\s*$/);
        expect(calc?.metaDescription).not.toContain('exakt');
        expect(calc?.metaDescription).not.toContain('beste');
      });
    }
  });
});

