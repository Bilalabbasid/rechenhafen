import { describe, it, expect } from 'vitest';
import { ALL_CALCULATORS, getCalculatorBySlug } from '@/data/calculators';
import { CATEGORIES, getCategoryBySlug } from '@/data/categories';
import { getAllArticles, getArticleBySlug } from '@/data/ratgeber/articles';
import { generateMetadata as generateCalcMetadata } from '@/app/rechner/[slug]/page';
import { generateMetadata as generateCatMetadata } from '@/app/[kategorie]/page';
import { generateMetadata as generateRatgeberMetadata } from '@/app/ratgeber/[slug]/page';
import { metadata as homeMetadata } from '@/app/page';
import { metadata as allCalcsMetadata } from '@/app/rechner/page';
import { metadata as ratgeberHubMetadata } from '@/app/ratgeber/page';
import { metadata as ueberUnsMetadata } from '@/app/ueber-uns/page';
import { metadata as impressumMetadata } from '@/app/impressum/page';
import { metadata as datenschutzMetadata } from '@/app/datenschutz/page';
import { metadata as methodikMetadata } from '@/app/methodik/page';
import { metadata as notFoundMetadata } from '@/app/not-found';
import { formatMetaTitle } from '@/lib/seo/title';
import { calculateArbeitszeit } from '@/lib/calculators/datumZeit';

describe('Calculator Quality, Content, and SEO QA Verification', () => {
  // =========================================================================
  // A.1. METADATA TITLE DUPLICATION REGRESSION SUITE
  // =========================================================================
  describe('Metadata Title Duplication Audit', () => {
    it('verifies formatMetaTitle strips trailing brand suffixes correctly', () => {
      expect(formatMetaTitle('KFZ-Steuer-Rechner | RechenHafen')).toBe('KFZ-Steuer-Rechner');
      expect(formatMetaTitle('Spritkostenrechner – RechenHafen')).toBe('Spritkostenrechner');
      expect(formatMetaTitle('Bürgergeld Rechner: Anspruch & Miete | RechenHafen')).toBe(
        'Bürgergeld Rechner: Anspruch & Miete'
      );
      expect(formatMetaTitle('Normaler Titel ohne Suffix')).toBe('Normaler Titel ohne Suffix');
      expect(formatMetaTitle('')).toBe('');
    });

    it('ensures no calculator in ALL_CALCULATORS has hardcoded brand suffix in metaTitle', () => {
      for (const calc of ALL_CALCULATORS) {
        expect(calc.metaTitle).not.toMatch(/\s*[|–-]\s*RechenHafen/i);
      }
    });

    it('ensures no category has hardcoded brand suffix in metaTitle', () => {
      for (const cat of CATEGORIES) {
        expect(cat.metaTitle).not.toMatch(/\s*[|–-]\s*RechenHafen/i);
      }
    });

    it('ensures no ratgeber article has hardcoded brand suffix in metaTitle', () => {
      for (const art of getAllArticles()) {
        expect(art.metaTitle).not.toMatch(/\s*[|–-]\s*RechenHafen/i);
      }
    });

    it('ensures static system page metadata titles do not duplicate brand suffix', () => {
      const template = '%s | RechenHafen';
      const checkTitle = (raw: string | { absolute: string } | undefined) => {
        if (!raw) return '';
        if (typeof raw === 'object' && 'absolute' in raw) {
          return raw.absolute;
        }
        return template.replace('%s', raw);
      };

      const pages = [
        { name: 'Home', title: homeMetadata.title },
        { name: 'All Calculators', title: allCalcsMetadata.title },
        { name: 'Ratgeber Hub', title: ratgeberHubMetadata.title },
        { name: 'Über uns', title: ueberUnsMetadata.title },
        { name: 'Impressum', title: impressumMetadata.title },
        { name: 'Datenschutz', title: datenschutzMetadata.title },
        { name: 'Methodik', title: methodikMetadata.title },
        { name: 'Not Found', title: notFoundMetadata.title },
      ];

      for (const p of pages) {
        const fullTitle = checkTitle(p.title as any);
        const matches = fullTitle.match(/RechenHafen/g) || [];
        expect(
          matches.length,
          `Page ${p.name} title "${fullTitle}" has ${matches.length} occurrences of RechenHafen`
        ).toBe(1);
        expect(fullTitle).not.toContain('RechenHafen | RechenHafen');
        expect(fullTitle).not.toContain('RechenHafen – RechenHafen');
      }
    });

    it('verifies generateMetadata for all 421 calculator routes renders brand suffix exactly once', async () => {
      const template = '%s | RechenHafen';
      for (const calc of ALL_CALCULATORS) {
        const meta = await generateCalcMetadata({ params: Promise.resolve({ slug: calc.slug }) });
        const titleStr = typeof meta.title === 'string' ? meta.title : (meta.title as any)?.absolute || '';
        expect(titleStr).toBeDefined();
        expect(titleStr.length).toBeGreaterThan(0);
        expect(titleStr).not.toMatch(/\s*[|–-]\s*RechenHafen/i);

        const rendered = template.replace('%s', titleStr);
        const occurrences = (rendered.match(/RechenHafen/g) || []).length;
        expect(
          occurrences,
          `Calculator ${calc.slug} title "${rendered}" must contain RechenHafen exactly once`
        ).toBe(1);
        expect(rendered).not.toContain('RechenHafen | RechenHafen');
      }
    });
  });

  // =========================================================================
  // B. ROUTE SMOKE TESTS FOR ALL REGISTERED CALCULATORS
  // =========================================================================
  describe('Calculator Registry & Route Smoke Tests', () => {
    it('discovers all registered calculators from real registry with self-referencing canonicals and exactly one H1', async () => {
      expect(ALL_CALCULATORS.length).toBe(421);

      for (const calc of ALL_CALCULATORS) {
        // Self-referencing canonical
        const meta = await generateCalcMetadata({ params: Promise.resolve({ slug: calc.slug }) });
        expect(meta.alternates?.canonical).toBe(`https://rechenhafen.de/rechner/${calc.slug}/`);

        // Exactly one H1
        expect(calc.h1).toBeDefined();
        expect(calc.h1.trim().length).toBeGreaterThan(0);
        expect(calc.h1).not.toContain('<h1');

        // Inputs exist with default values
        expect(calc.inputs.length).toBeGreaterThan(0);
        for (const input of calc.inputs) {
          expect(input.id).toBeDefined();
          expect(input.label).toBeDefined();
          expect(input.defaultValue).toBeDefined();
        }

        // Server-side pre-calculation execution (SSR)
        const defaults: Record<string, any> = {};
        for (const input of calc.inputs) {
          defaults[input.id] = input.defaultValue;
        }
        const res = calc.calculate(defaults);
        expect(res).toBeDefined();
        expect(res.primary).toBeDefined();
        expect(String(res.primary.value)).not.toContain('NaN');
        expect(String(res.primary.value)).not.toContain('Infinity');
      }
    });
  });

  // =========================================================================
  // C. INDEPENDENT KNOWN-ANSWER TEST FIXTURES
  // =========================================================================
  describe('Independent Known-Answer Test Fixtures', () => {
    // 1. Gaskostenrechner
    it('fixture: Gaskostenrechner matches independent mathematical calculation for kWh and m³', () => {
      const calc = getCalculatorBySlug('gaskostenrechner');
      expect(calc).toBeDefined();

      // Case 1: kWh input (14000 kWh, 0.11 €/kWh, 12 €/month base)
      const resKwh = calc!.calculate({
        inputType: 'kwh',
        amount: 14000,
        pricePerKwh: 0.11,
        basePricePerMonth: 12.0,
      });
      // Independent calculation:
      const expectedWorkCost = 14000 * 0.11; // 1540.00 €
      const expectedBaseCost = 12.0 * 12; // 144.00 €
      const expectedTotal = expectedWorkCost + expectedBaseCost; // 1684.00 €
      expect(resKwh.primary.value).toBe(expectedTotal);
      expect(resKwh.primary.formattedValue).toContain('1.684,00');

      // Case 2: m³ input (1200 m³, calorific 10.3, z 0.95, 0.12 €/kWh, 10 €/month base)
      const resM3 = calc!.calculate({
        inputType: 'm3',
        amount: 1200,
        calorificValue: 10.3,
        stateFactor: 0.95,
        pricePerKwh: 0.12,
        basePricePerMonth: 10.0,
      });
      // Independent calculation:
      const expectedKwh = 1200 * 10.3 * 0.95; // 11742 kWh
      const expectedM3Total = Math.round((expectedKwh * 0.12 + 10.0 * 12) * 100) / 100; // 1409.04 + 120 = 1529.04 €
      expect(resM3.primary.value).toBe(expectedM3Total);
      expect(resM3.primary.formattedValue).toContain('1.529,04');
    });

    // 2. Kreisumfang
    it('fixture: Kreisumfang matches independent trigonometric/pi calculation', () => {
      const calc = getCalculatorBySlug('kreis-umfang-rechner');
      expect(calc).toBeDefined();

      // Case A: radius = 7 cm
      const resR = calc!.calculate({ inputType: 'radius', inputValue: 7 });
      const expectedCircumferenceR = 2 * Math.PI * 7; // ~43.982297 cm
      const expectedAreaR = Math.PI * 7 * 7; // ~153.93804 cm²
      expect(Math.abs(Number(resR.primary.value) - expectedCircumferenceR)).toBeLessThan(0.001);
      expect(resR.primary.formattedValue).toContain('43,98 cm');

      // Case B: diameter = 20 cm
      const resD = calc!.calculate({ inputType: 'diameter', inputValue: 20 });
      const expectedCircumferenceD = Math.PI * 20; // ~62.831853 cm
      expect(Math.abs(Number(resD.primary.value) - expectedCircumferenceD)).toBeLessThan(0.001);
      expect(resD.primary.formattedValue).toContain('62,83 cm');
    });

    // 3. Kalorienbedarf (Mifflin-St Jeor)
    it('fixture: Kalorienbedarf matches independent Mifflin-St Jeor formula', () => {
      const calc = getCalculatorBySlug('kalorienbedarf-rechner');
      expect(calc).toBeDefined();

      // Case A: Male, 32 years, 75 kg, 178 cm, PAL 1.4
      // Formula: 10*75 + 6.25*178 - 5*32 + 5 = 750 + 1112.5 - 160 + 5 = 1707.5 kcal BMR
      // TDEE = 1707.5 * 1.4 = 2390.5 -> 2391 kcal
      const resMale = calc!.calculate({
        gender: 'male',
        age: 32,
        weight: 75,
        height: 178,
        activityLevel: '1.4',
        goal: 'maintain',
        formula: 'mifflin',
      });
      expect(Math.round(Number(resMale.primary.value))).toBe(2391);
      expect(resMale.primary.formattedValue).toContain('2.391 kcal');

      // Case B: Female, 28 years, 60 kg, 165 cm, PAL 1.6
      // Formula: 10*60 + 6.25*165 - 5*28 - 161 = 600 + 1031.25 - 140 - 161 = 1330.25 kcal BMR
      // TDEE = 1330.25 * 1.6 = 2128.4 -> 2128 kcal
      const resFemale = calc!.calculate({
        gender: 'female',
        age: 28,
        weight: 60,
        height: 165,
        activityLevel: '1.6',
        goal: 'maintain',
        formula: 'mifflin',
      });
      expect(Math.round(Number(resFemale.primary.value))).toBe(2128);
      expect(resFemale.primary.formattedValue).toContain('2.128 kcal');
    });

    // 4. Spritkosten
    it('fixture: Spritkosten matches independent fuel calculation', () => {
      const calc = getCalculatorBySlug('spritkostenrechner');
      expect(calc).toBeDefined();

      // 150 km, 6.5 l/100km, 1.80 €/Liter, 1 passenger
      // Liters: 150 / 100 * 6.5 = 9.75 l
      // Cost: 9.75 * 1.80 = 17.55 €
      const res = calc!.calculate({
        distance: 150,
        tripType: 'single',
        consumption: 6.5,
        pricePerLiter: 1.80,
        tripsCount: 1,
        passengers: 1,
      });
      expect(res.primary.value).toBe(17.55);
      expect(res.primary.formattedValue).toMatch(/17,55\s*€/);

      // 200 km, 7.0 l/100km, 1.70 €/Liter, 2 passengers
      // Total cost: 200 / 100 * 7.0 * 1.70 = 23.80 €
      // Per person: 11.90 €
      const resCarpool = calc!.calculate({
        distance: 200,
        tripType: 'single',
        consumption: 7.0,
        pricePerLiter: 1.70,
        tripsCount: 1,
        passengers: 2,
      });
      expect(resCarpool.primary.value).toBe(23.8);
      const perPerson = resCarpool.secondary?.find((s) => s.id === 'costPerPerson');
      expect(perPerson?.value).toBe(11.9);
      expect(perPerson?.formattedValue).toMatch(/11,90\s*€/);
    });

    // 5. Sabbatical
    it('fixture: Sabbatical matches independent salary smoothing model and contains trust disclaimers', () => {
      const calc = getCalculatorBySlug('sabbatical-rechner');
      expect(calc).toBeDefined();

      // 3000 € net, 18 months work, 6 months leave (total 24 months)
      // Ratio: 18 / 24 = 0.75
      // Continuous net: 3000 * 0.75 = 2250.00 €
      // Monthly sacrifice: 3000 - 2250 = 750.00 €
      const res = calc!.calculate({
        regularNet: 3000,
        workMonths: 18,
        leaveMonths: 6,
      });
      expect(res.primary.value).toBe(2250);
      expect(res.primary.formattedValue).toMatch(/2\.250,00\s*€/);

      const sacrifice = res.secondary?.find((s) => s.id === 'monthlySacrifice');
      expect(sacrifice?.value).toBe(750);
      expect(sacrifice?.formattedValue).toMatch(/750,00\s*€/);

      // Check trust & legal disclaimer in summaryText
      expect(res.summaryText).toContain('Wertguthaben nach § 7b SGB IV');
      expect(res.summaryText).not.toContain('bleibt der volle Sozialversicherungsschutz bestehen!');
    });

    // 6. KFZ-Steuer
    it('fixture: KFZ-Steuer matches independent § 9 KraftStG calculation', () => {
      const calc = getCalculatorBySlug('kfz-steuer-rechner');
      expect(calc).toBeDefined();

      // Case A: Benziner 1998 cm³, 135 g/km CO2
      // Base: ceil(1998/100) * 2.00 = 20 * 2.00 = 40.00 €
      // Excess CO2: 135 - 95 = 40 g -> 20 * 2.00 + 20 * 2.20 = 40 + 44 = 84.00 €
      // Total: 40 + 84 = 124.00 €
      const resPetrol = calc!.calculate({
        engineType: 'petrol',
        displacementCc: 1998,
        co2EmissionsGkm: 135,
      });
      expect(resPetrol.primary.value).toBe(124);
      expect(resPetrol.primary.formattedValue).toMatch(/124,00\s*€/);

      // Case B: Diesel 1968 cm³, 145 g/km CO2
      // Base: ceil(1968/100) * 9.50 = 20 * 9.50 = 190.00 €
      // Excess CO2: 145 - 95 = 50 g -> 20*2.00 + 20*2.20 + 10*2.50 = 40 + 44 + 25 = 109.00 €
      // Total: 190 + 109 = 299.00 €
      const resDiesel = calc!.calculate({
        engineType: 'diesel',
        displacementCc: 1968,
        co2EmissionsGkm: 145,
      });
      expect(resDiesel.primary.value).toBe(299);
      expect(resDiesel.primary.formattedValue).toMatch(/299,00\s*€/);

      // Case C: Electric
      const resElectric = calc!.calculate({ engineType: 'electric', displacementCc: 0, co2EmissionsGkm: 0 });
      expect(resElectric.primary.value).toBe(0);
      expect(resElectric.primary.formattedValue).toContain('Steuerbefreit');
    });

    // 7. Schalungssteine
    it('fixture: Schalungssteine matches acceptance fixture for 96 base stones, 101 reserve stones, 1.56 m³ and 1.638 m³ concrete', () => {
      const calc = getCalculatorBySlug('schalungssteine-rechner');
      expect(calc).toBeDefined();

      const defaults = {
        wallLength: 8,
        wallHeight: 1.5,
        fillMode: 'preset_delfing24',
        stoneReserve: 5,
        concreteReserve: 0,
        openingsArea: 0,
      };
      const res0 = calc!.calculate(defaults);

      // 1. Stones: 12 * 8 = 96 base, ceil(96 * 1.05) = 101 reserve
      expect(res0.primary.value).toBe(101);
      expect(res0.primary.formattedValue).toBe('101 Stück');
      const baseStones = res0.secondary?.find((s) => s.id === 'baseStones');
      expect(baseStones?.value).toBe(96);

      // 2. Concrete 0 % reserve: 12 * 0.130 = 1.56 m³
      const concreteSec0 = res0.secondary?.find((s) => s.id === 'concreteM3');
      expect(concreteSec0?.value).toBe(1.56);
      expect(concreteSec0?.formattedValue).toContain('1,56 m³');

      // 3. Concrete 5 % reserve: 1.56 * 1.05 = 1.638 m³ -> display 1,64 m³
      const res5 = calc!.calculate({ ...defaults, concreteReserve: 5 });
      const concreteSec5 = res5.secondary?.find((s) => s.id === 'concreteM3');
      expect(concreteSec5?.value).toBeCloseTo(1.638, 3);
      expect(concreteSec5?.formattedValue).toContain('1,64 m³');

      // 4. Stated values in workedExample match exactly
      expect(calc!.workedExample.result).toContain('101 Steine');
      expect(calc!.workedExample.result).toContain('1,56 m³');
      expect(calc!.workedExample.result).toContain('1,638 m³');
      expect(calc!.workedExample.description).toContain('1,56 m³');
    });

    // 8. Arbeitszeitrechner: required test cases & legal guidance
    it('fixture: Arbeitszeitrechner matches all required test cases (day shift, overnight shift, multiple breaks, validation)', () => {
      const calc = getCalculatorBySlug('arbeitszeitrechner');
      expect(calc).toBeDefined();

      // Required Case 1: 08:00–16:30 with 60 min break = 7 h 30 min / 7.5 hours
      const res1 = calc!.calculate({
        startTime: '08:00',
        endTime: '16:30',
        pauseMinutes: 60,
        targetHours: 8,
      });
      expect(res1.primary.value).toBe(7.5);
      expect(res1.primary.formattedValue).toBe('7 Std. 30 Min.');
      expect(res1.secondary?.find((s) => s.id === 'decimal')?.formattedValue).toBe('7,50 Std.');
      expect(res1.secondary?.find((s) => s.id === 'pause')?.formattedValue).toContain('60 Min.');
      const overtime1 = res1.secondary?.find((s) => s.id === 'overtime');
      expect(overtime1?.value).toBe(-0.5);
      expect(overtime1?.formattedValue).toContain('-0,50 Std.');

      // Required Case 2: 22:00–06:30 with 30 min break = 8 hours
      const res2 = calc!.calculate({
        startTime: '22:00',
        endTime: '06:30',
        pauseMinutes: 30,
        targetHours: 8,
      });
      expect(res2.primary.value).toBe(8);
      expect(res2.primary.formattedValue).toBe('8 Std. 0 Min.');
      expect(res2.secondary?.find((s) => s.id === 'decimal')?.formattedValue).toBe('8,00 Std.');
      const overtime2 = res2.secondary?.find((s) => s.id === 'overtime');
      expect(overtime2?.value).toBe(0);
      expect(overtime2?.formattedValue).toContain('Ausgeglichen');

      // Required Case 3: Multiple breaks sum correctly
      const resMultipleBreaks = calc!.calculate({
        startTime: '08:00',
        endTime: '17:00',
        pauses: [15, 30, 15],
        targetHours: 8,
      });
      // 9h gross - 60 min break = 8h net
      expect(resMultipleBreaks.primary.value).toBe(8);
      expect(resMultipleBreaks.secondary?.find((s) => s.id === 'pause')?.formattedValue).toContain('60 Min.');

      // Also support pause1..pause4 inputs
      const resNamedBreaks = calc!.calculate({
        startTime: '08:00',
        endTime: '17:00',
        pause1: 15,
        pause2: 20,
        pause3: 10,
        targetHours: 8,
      });
      // 9h gross - 45 min break = 8h 15 min (8.25h)
      expect(resNamedBreaks.primary.value).toBe(8.25);
      expect(resNamedBreaks.secondary?.find((s) => s.id === 'pause')?.formattedValue).toContain('45 Min.');

      // Required Case 4: Invalid inputs never display NaN, Infinity, negative hours, or misleading results
      const resInvalid = calc!.calculate({
        startTime: 'invalid',
        endTime: '',
        pauseMinutes: -20,
        targetHours: 'abc',
      });
      expect(resInvalid.primary.value).toBe(0);
      expect(String(resInvalid.primary.formattedValue)).not.toContain('NaN');
      expect(String(resInvalid.primary.formattedValue)).not.toContain('Infinity');
      expect(resInvalid.error).toBeDefined();

      // Break longer than shift error
      const resBreakTooLong = calc!.calculate({
        startTime: '08:00',
        endTime: '12:00', // 4h
        pauseMinutes: 300, // 5h
      });
      expect(resBreakTooLong.primary.value).toBe(0);
      expect(resBreakTooLong.error).toContain('länger als');

      // Legal break warning test: >6h to 9h without sufficient break
      const resZeroBreak = calc!.calculate({
        startTime: '08:00',
        endTime: '17:00', // 9h gross
        pauseMinutes: 0,
      });
      expect(resZeroBreak.warning).toBeDefined();
      expect(resZeroBreak.warning).toContain('§ 4 ArbZG');
      expect(resZeroBreak.warning).toContain('30 Minuten');
      expect(resZeroBreak.warning).toContain('Hinweis zur Orientierung, keine Rechtsberatung');
    });

    // 9. Gaskosten worked examples
    it('fixture: Gaskostenrechner matches worked examples for apartment and house exactly', () => {
      const calc = getCalculatorBySlug('gaskostenrechner');
      expect(calc).toBeDefined();

      // Apartment: 10,000 kWh × 0.10 €/kWh + 10 €/month base = 1,120 €/year
      const resApt = calc!.calculate({
        inputType: 'kwh',
        amount: 10000,
        pricePerKwh: 0.10,
        basePricePerMonth: 10.0,
      });
      expect(resApt.primary.value).toBe(1120);
      expect(resApt.primary.formattedValue).toContain('1.120,00');
      const monthlyApt = resApt.secondary?.find((s) => s.id === 'monthlyPayment');
      expect(monthlyApt?.formattedValue).toContain('93,33');

      // House: 15,000 kWh × 0.10 €/kWh + 12 €/month base = 1,644 €/year
      const resHouse = calc!.calculate({
        inputType: 'kwh',
        amount: 15000,
        pricePerKwh: 0.10,
        basePricePerMonth: 12.0,
      });
      expect(resHouse.primary.value).toBe(1644);
      expect(resHouse.primary.formattedValue).toContain('1.644,00');
      const monthlyHouse = resHouse.secondary?.find((s) => s.id === 'monthlyPayment');
      expect(monthlyHouse?.formattedValue).toContain('137,00');
    });

    // 10. Sabbatical worked example
    it('fixture: Sabbatical matches worked example with 2800 € net, 12m work + 12m leave = 1400 € monthly', () => {
      const calc = getCalculatorBySlug('sabbatical-rechner');
      expect(calc).toBeDefined();

      const res = calc!.calculate({
        regularNet: 2800,
        workMonths: 12,
        leaveMonths: 12,
      });
      expect(res.primary.value).toBe(1400);
      expect(res.primary.formattedValue).toMatch(/1\.400,00\s*€/);
      const sacrifice = res.secondary?.find((s) => s.id === 'monthlySacrifice');
      expect(sacrifice?.value).toBe(1400);
      expect(sacrifice?.formattedValue).toMatch(/1\.400,00\s*€/);
    });

    // 11. Mieterhöhungsrechner
    it('fixture: Mieterhöhungsrechner accurately calculates caps, comparable rents, dates, and excluded increase modes', () => {
      const calc = getCalculatorBySlug('mieterhoehung-rechner');
      expect(calc).toBeDefined();

      // Case A: Prompt worked example (Current 800 €, Rent 3 yrs ago 800 €, Proposed 1000 €, Comparable 950 €, Cap 20%)
      const resA = calc!.calculate({
        increaseType: 'vergleichsmiete',
        currentRent: 800,
        entryMode: 'amount',
        proposedRent: 1000,
        rentThreeYearsAgo: 800,
        comparableRent: 950,
        kappungsgrenze: '20',
        lastIncreaseDate: '2024-01-01',
        demandReceivedDate: '2026-03-15',
      });
      // Cap ceiling: 800 * 1.20 = 960 €
      // Comparable rent: 950 €
      // Lower numerical ceiling: 950 €
      // Excess: 1000 - 950 = 50 €
      expect(resA.primary.value).toBe(950);
      expect(resA.primary.formattedValue).toContain('950,00');
      const excessA = resA.secondary?.find((s) => s.id === 'excessAmount');
      expect(excessA?.value).toBe(50);
      expect(excessA?.formattedValue).toContain('50,00');
      const capA = resA.secondary?.find((s) => s.id === 'capCeiling');
      expect(capA?.value).toBe(960);

      // Case B: 15 % Cap selected (where cap is lower than comparable rent)
      const resB = calc!.calculate({
        increaseType: 'vergleichsmiete',
        currentRent: 800,
        entryMode: 'amount',
        proposedRent: 1000,
        rentThreeYearsAgo: 800,
        comparableRent: 950,
        kappungsgrenze: '15',
        lastIncreaseDate: '2024-01-01',
        demandReceivedDate: '2026-03-15',
      });
      // Cap ceiling: 800 * 1.15 = 920 €
      // Lower ceiling is now 920 € (Cap lower than comparable)
      // Excess: 1000 - 920 = 80 €
      expect(resB.primary.value).toBe(920);
      const excessB = resB.secondary?.find((s) => s.id === 'excessAmount');
      expect(excessB?.value).toBe(80);

      // Case C: Three-year starting rent differs from current rent
      // Current rent is 900 €, but 3 years ago it was 800 € (intermediate increase happened)
      const resC = calc!.calculate({
        increaseType: 'vergleichsmiete',
        currentRent: 900,
        entryMode: 'amount',
        proposedRent: 1000,
        rentThreeYearsAgo: 800,
        comparableRent: 980,
        kappungsgrenze: '20',
      });
      // Cap is calculated on 800 €: 800 * 1.20 = 960 € (NOT 900 * 1.20 = 1080 €)
      expect(resC.primary.value).toBe(960);
      const excessC = resC.secondary?.find((s) => s.id === 'excessAmount');
      expect(excessC?.value).toBe(40); // 1000 - 960 = 40

      // Case D: Proposed rent below numerical ceiling
      const resD = calc!.calculate({
        increaseType: 'vergleichsmiete',
        currentRent: 800,
        entryMode: 'amount',
        proposedRent: 900,
        rentThreeYearsAgo: 800,
        comparableRent: 950,
        kappungsgrenze: '20',
      });
      expect(resD.primary.value).toBe(950);
      const excessD = resD.secondary?.find((s) => s.id === 'excessAmount');
      expect(excessD?.value).toBe(0);
      expect(excessD?.formattedValue).toBe('Keine Überschreitung');

      // Case E: Percentage entry mode (e.g. 15 % increase on 800 € = 920 €)
      const resE = calc!.calculate({
        increaseType: 'vergleichsmiete',
        currentRent: 800,
        entryMode: 'percent',
        proposedPercent: 15,
        rentThreeYearsAgo: 800,
        comparableRent: 950,
        kappungsgrenze: '20',
      });
      const propRentE = resE.secondary?.find((s) => s.id === 'proposedRent');
      expect(propRentE?.value).toBe(920);

      // Case F: Dates across year boundaries & leap years
      // Demand received 2025-11-20:
      // Consideration period ends 2026-01-31 (end of 2nd month)
      // Payment begins 2026-02-01 (1st of 3rd month)
      const resDatesYearBoundary = calc!.calculate({
        increaseType: 'vergleichsmiete',
        currentRent: 800,
        proposedRent: 900,
        rentThreeYearsAgo: 800,
        comparableRent: 950,
        lastIncreaseDate: '2024-05-01',
        demandReceivedDate: '2025-11-20',
      });
      const consDate = resDatesYearBoundary.secondary?.find((s) => s.id === 'considerationEnd');
      expect(consDate?.formattedValue).toBe('31.01.2026');
      const payDate = resDatesYearBoundary.secondary?.find((s) => s.id === 'earliestPayment');
      expect(payDate?.formattedValue).toBe('01.02.2026');

      // Leap year receipt (2024-01-15):
      // Consideration ends 2024-03-31, payment begins 2024-04-01
      const resLeap = calc!.calculate({
        increaseType: 'vergleichsmiete',
        currentRent: 800,
        proposedRent: 900,
        rentThreeYearsAgo: 800,
        comparableRent: 950,
        lastIncreaseDate: '2022-01-01',
        demandReceivedDate: '2024-01-15',
      });
      expect(resLeap.secondary?.find((s) => s.id === 'considerationEnd')?.formattedValue).toBe('31.03.2024');
      expect(resLeap.secondary?.find((s) => s.id === 'earliestPayment')?.formattedValue).toBe('01.04.2024');

      // Case G: Missing comparable rent produces warning and incomplete result
      const resMissingComp = calc!.calculate({
        increaseType: 'vergleichsmiete',
        currentRent: 800,
        proposedRent: 900,
        rentThreeYearsAgo: 800,
        comparableRent: 0,
        kappungsgrenze: '20',
      });
      expect(resMissingComp.warning).toContain('keine ortsübliche Vergleichsmiete angegeben');
      expect(resMissingComp.secondary?.find((s) => s.id === 'comparableRent')?.formattedValue).toContain('Nicht angegeben');

      // Case H: Non-§ 558 increase modes do not run § 558 formula and provide links
      const resStaffel = calc!.calculate({ increaseType: 'staffelmiete' });
      expect(resStaffel.primary.value).toContain('Staffelmiete');
      expect(resStaffel.warning).toContain('Keine Anwendung von § 558 BGB');
      expect(resStaffel.summaryText).toContain('/rechner/staffelmiete-rechner/');

      const resIndex = calc!.calculate({ increaseType: 'indexmiete' });
      expect(resIndex.primary.value).toContain('Indexmiete');
      expect(resIndex.warning).toContain('Keine Anwendung von § 558 BGB');
      expect(resIndex.summaryText).toContain('/rechner/indexmiete-rechner/');

      const resModern = calc!.calculate({ increaseType: 'modernisierung' });
      expect(resModern.primary.value).toContain('Modernisierung');
      expect(resModern.warning).toContain('Keine Anwendung von § 558 BGB');
      expect(resModern.summaryText).toContain('/rechner/modernisierungsumlage-rechner/');
    });

    // 12. Gewerbesteuerrechner
    it('fixture: Gewerbesteuerrechner matches prompt examples for individual and GmbH, rounding and allowances', () => {
      const calc = getCalculatorBySlug('gewerbesteuer-rechner');
      expect(calc).toBeDefined();

      // Case A: Prompt worked example - Einzelunternehmen with 50,000 € Gewerbeertrag, 400 % Hebesatz
      // Rounded: 50,000 €
      // Allowance: 24,500 €
      // Taxable: 25,500 €
      // Steuermessbetrag: 25,500 * 0.035 = 892.50 €
      // Gewerbesteuer: 892.50 * 4 = 3,570.00 €
      const resEinzel = calc!.calculate({
        taxYear: '2026',
        legalForm: 'einzelunternehmen',
        gewerbeertrag: 50000,
        hebesatz: 400,
      });
      expect(resEinzel.primary.value).toBe(3570);
      expect(resEinzel.primary.formattedValue).toMatch(/3\.570,00\s*€/);
      expect(resEinzel.secondary?.find((s) => s.id === 'freibetrag')?.value).toBe(24500);
      expect(resEinzel.secondary?.find((s) => s.id === 'steuermessbetrag')?.value).toBe(892.5);
      const estCredit = resEinzel.secondary?.find((s) => s.id === 'estCreditPotential');
      expect(estCredit?.value).toBe(3570); // 4.0 * 892.5 = 3570

      // Case B: Prompt worked example - GmbH with 50,000 € Gewerbeertrag, 400 % Hebesatz
      // No allowance (0 €)
      // Steuermessbetrag: 50,000 * 0.035 = 1,750.00 €
      // Gewerbesteuer: 1,750.00 * 4 = 7,000.00 €
      const resGmbh = calc!.calculate({
        taxYear: '2026',
        legalForm: 'kapitalgesellschaft',
        gewerbeertrag: 50000,
        hebesatz: 400,
      });
      expect(resGmbh.primary.value).toBe(7000);
      expect(resGmbh.primary.formattedValue).toMatch(/7\.000,00\s*€/);
      expect(resGmbh.secondary?.find((s) => s.id === 'freibetrag')?.value).toBe(0);
      expect(resGmbh.secondary?.find((s) => s.id === 'steuermessbetrag')?.value).toBe(1750);
      // No § 35 EStG credit for corporations
      expect(resGmbh.secondary?.find((s) => s.id === 'estCreditPotential')).toBeUndefined();

      // Case C: Rounding down to full 100 € (§ 11 Abs. 1 Satz 3 GewStG)
      // 50,099 € is rounded to 50,000 €
      const resRounding = calc!.calculate({
        legalForm: 'einzelunternehmen',
        gewerbeertrag: 50099,
        hebesatz: 400,
      });
      expect(resRounding.primary.value).toBe(3570);
      expect(resRounding.secondary?.find((s) => s.id === 'gewerbeertragRounded')?.value).toBe(50000);

      // Case D: Gewerbeertrag below allowance (24,000 € for individual)
      const resBelowAllowance = calc!.calculate({
        legalForm: 'einzelunternehmen',
        gewerbeertrag: 24000,
        hebesatz: 400,
      });
      expect(resBelowAllowance.primary.value).toBe(0);
      expect(resBelowAllowance.primary.formattedValue).toMatch(/0,00\s*€/);
      expect(resBelowAllowance.secondary?.find((s) => s.id === 'taxableErtrag')?.value).toBe(0);

      // Case E: Different user-entered Hebesätze
      // 350 % Hebesatz: 892.50 * 3.5 = 3,123.75 €
      const resHebesatz350 = calc!.calculate({
        legalForm: 'einzelunternehmen',
        gewerbeertrag: 50000,
        hebesatz: 350,
      });
      expect(resHebesatz350.primary.value).toBe(3123.75);

      // 490 % Hebesatz (München): 892.50 * 4.9 = 4,373.25 €
      const resHebesatz490 = calc!.calculate({
        legalForm: 'einzelunternehmen',
        gewerbeertrag: 50000,
        hebesatz: 490,
      });
      expect(resHebesatz490.primary.value).toBe(4373.25);

      // Case F: Statutory warning when Hebesatz < 200 % (§ 16 Abs. 4 Satz 2 GewStG)
      const resLowHebesatz = calc!.calculate({
        legalForm: 'einzelunternehmen',
        gewerbeertrag: 50000,
        hebesatz: 150,
      });
      expect(resLowHebesatz.warning).toContain('Mindesthebesatz');
      expect(resLowHebesatz.warning).toContain('200 %');

      // Case G: Invalid and negative inputs
      const resNegative = calc!.calculate({
        legalForm: 'einzelunternehmen',
        gewerbeertrag: -5000,
        hebesatz: 400,
      });
      expect(resNegative.primary.value).toBe(0);
      expect(String(resNegative.primary.formattedValue)).not.toContain('NaN');
      expect(String(resNegative.primary.formattedValue)).not.toContain('Infinity');

      const resEmpty = calc!.calculate({
        gewerbeertrag: '',
      });
      expect(resEmpty.error).toBeDefined();
    });
  });

  // =========================================================================
  // D. SPECIFIC CONTENT IMPROVEMENTS ON TESTED PAGES
  // =========================================================================
  describe('Content Improvements QA', () => {
    it('verifies Gaskostenrechner includes decision guidance and cross-links without duplicate URL', () => {
      const calc = getCalculatorBySlug('gaskostenrechner');
      expect(calc).toBeDefined();
      expect(calc!.content?.intro).toContain('Welchen Ausgangswert haben Sie zur Hand?');
      expect(calc!.content?.intro).toContain('Ich kenne meinen Verbrauch in kWh');
      expect(calc!.content?.intro).toContain('Ich habe nur den Gaszählerstand in m³');
      expect(calc!.content?.intro).toContain('/rechner/gasverbrauch-kwh-m3-rechner/');
      expect(calc!.content?.details).toContain('m³ → kWh → Euro');

      // Sections
      const sectionTitles = (calc!.content?.sections || []).map((s) => s.title);
      expect(sectionTitles).toContain('Häufige Fehler bei der Gaskostenberechnung');
      expect(sectionTitles).toContain('Warum die monatlichen Kosten im Winter höher sind');
      expect(sectionTitles).toContain('So prüfen Sie Ihre Gasrechnung Schritt für Schritt');

      const allFaqs = calc!.faqs.map((f) => `${f.question} ${f.answer}`).join(' ');
      expect(allFaqs).toContain('Gasabrechnung');
      expect(allFaqs).toContain('Gaskosten');
    });

    it('verifies Dienstfahrrad Rechner has natural non-brand positioning and neutral explanatory JobRad note', () => {
      const calc = getCalculatorBySlug('dienstfahrrad-jobrad-rechner');
      expect(calc).toBeDefined();
      expect(calc!.metaTitle).toBe('JobRad Rechner: Dienstfahrrad-Leasing berechnen');
      expect(calc!.h1).toBe('JobRad Rechner: Dienstfahrrad-Leasing berechnen');
      expect(calc!.content?.intro).toContain('Dieser Rechner wird häufig auch als JobRad-Rechner gesucht. RechenHafen steht in keiner Verbindung zu JobRad.');
      
      // Explanatory reference in FAQs
      const hasJobRadFaq = calc!.faqs.some((f) => f.question.includes('JobRad') || f.answer.includes('JobRad'));
      expect(hasJobRadFaq).toBe(true);

      // Verify no duplicate slug was created
      expect(getCalculatorBySlug('jobrad-rechner')).toBeUndefined();
    });

    it('verifies Ringgröße calculator provides quick-answer FAQ for 70 mm circumference derived from formula', () => {
      const calc = getCalculatorBySlug('ringgroesse-umrechner');
      expect(calc).toBeDefined();
      const faq70 = calc!.faqs.find((f) => f.question.includes('70 mm'));
      expect(faq70).toBeDefined();
      expect(faq70?.answer).toContain('EU-Ringgröße 70');
      expect(faq70?.answer).toContain('22,3 mm');
      expect(faq70?.answer).toContain('US 13');
      expect(faq70?.answer).toContain('UK Z');
    });

    it('verifies Mieterhöhungsrechner metadata, H1, description, kostenlos intro, and contextual links', () => {
      const calc = getCalculatorBySlug('mieterhoehung-rechner');
      expect(calc).toBeDefined();
      expect(calc!.metaTitle).toBe('Mieterhöhungsrechner: Mieterhöhung & Kappungsgrenze prüfen');
      expect(calc!.h1).toBe('Mieterhöhungsrechner: vorgeschlagene Mieterhöhung prüfen');
      expect(calc!.metaDescription).toContain('Kostenloser Rechner für Deutschland');
      expect(calc!.content?.intro).toContain('kostenlosen Mieterhöhungsrechner');
      expect(calc!.content?.details).toContain('/rechner/staffelmiete-rechner/');
      expect(calc!.content?.details).toContain('/rechner/indexmiete-rechner/');
      expect(calc!.content?.details).toContain('/rechner/modernisierungsumlage-rechner/');
      expect(calc!.relatedSlugs).toContain('staffelmiete-rechner');
      expect(calc!.relatedSlugs).toContain('indexmiete-rechner');

      const sectionTitles = (calc!.content?.sections || []).map((s) => s.title);
      expect(sectionTitles).toContain('So funktioniert der Mieterhöhungsrechner');
      expect(sectionTitles).toContain('Was die Kappungsgrenze (15 % oder 20 %) bedeutet');
      expect(sectionTitles).toContain('Warum die Vergleichsmiete oft die niedrigere Obergrenze ist');
      expect(sectionTitles).toContain('Welche Fristen und Ausgangsmieten Sie benötigen');
      expect(sectionTitles).toContain('Was dieser Rechner nicht prüfen kann (Rechtliche Grenzen)');

      const hasMietspiegelFaq = calc!.faqs.some((f) => f.question.includes('Mietspiegel'));
      expect(hasMietspiegelFaq).toBe(true);
    });

    it('verifies Gewerbesteuerrechner metadata, H1, description, kostenlos intro, and contextual links', () => {
      const calc = getCalculatorBySlug('gewerbesteuer-rechner');
      expect(calc).toBeDefined();
      expect(calc!.metaTitle).toBe('Gewerbesteuerrechner: Gewerbesteuer mit Hebesatz berechnen');
      expect(calc!.h1).toBe('Gewerbesteuerrechner für Unternehmen in Deutschland');
      expect(calc!.metaDescription).toContain('Berechne die voraussichtliche Gewerbesteuer');
      expect(calc!.content?.intro).toContain('kostenlosen Gewerbesteuerrechner');
      expect(calc!.content?.details).toContain('/rechner/einkommensteuerrechner/');
      expect(calc!.content?.details).toContain('/rechner/umsatzsteuerrechner/');
      expect(calc!.relatedSlugs).toContain('einkommensteuerrechner');
      expect(calc!.relatedSlugs).toContain('umsatzsteuerrechner');

      const sectionTitles = (calc!.content?.sections || []).map((s) => s.title);
      expect(sectionTitles).toContain('Was der Gewerbeertrag bedeutet (Unterschied zum Gewinn)');
      expect(sectionTitles).toContain('Wie der Hebesatz das Ergebnis verändert');
      expect(sectionTitles).toContain('Einzelunternehmen/Personengesellschaft versus GmbH');
      expect(sectionTitles).toContain('Einkommensteuer-Ermäßigung nach § 35 EStG');

      const hasFreiberuflerFaq = calc!.faqs.some((f) => f.question.includes('Freiberufler'));
      expect(hasFreiberuflerFaq).toBe(true);
    });
  });

  // =========================================================================
  // E. BOUNDARY & INVALID INPUT TESTS
  // =========================================================================
  describe('Boundary and Invalid Input QA', () => {
    it('handles negative, empty, and zero inputs gracefully for key calculators', () => {
      const keySlugs = [
        'gaskostenrechner',
        'kreis-umfang-rechner',
        'kalorienbedarf-rechner',
        'spritkostenrechner',
        'sabbatical-rechner',
        'kfz-steuer-rechner',
        'schalungssteine-rechner',
        'arbeitszeitrechner',
        'mieterhoehung-rechner',
        'gewerbesteuer-rechner',
      ];

      for (const slug of keySlugs) {
        const calc = getCalculatorBySlug(slug);
        expect(calc).toBeDefined();

        // Empty inputs
        const resEmpty = calc!.calculate({});
        expect(resEmpty).toBeDefined();
        expect(String(resEmpty.primary.value)).not.toContain('NaN');
        expect(String(resEmpty.primary.value)).not.toContain('Infinity');

        // Zero inputs
        const zeros: Record<string, any> = {};
        for (const inp of calc!.inputs) {
          if (inp.type === 'number') zeros[inp.id] = 0;
          else if (inp.type === 'select' && inp.options && inp.options.length > 0)
            zeros[inp.id] = inp.options[0].value;
          else zeros[inp.id] = inp.defaultValue;
        }
        const resZero = calc!.calculate(zeros);
        expect(resZero).toBeDefined();
        expect(String(resZero.primary.value)).not.toContain('NaN');
        expect(String(resZero.primary.value)).not.toContain('Infinity');
      }
    });
  });
});
