import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';

export const BATCH_6_SLUGS = [
  // Gesundheit & Fitness (25)
  'bmi-rechner',
  'kalorienbedarf-rechner',
  'wasserbedarf-rechner',
  'laufpace-rechner',
  'grundumsatz-bmr-rechner',
  'leistungsumsatz-pal-rechner',
  'makronaehrstoff-verteilung-rechner',
  'idealgewicht-creff-rechner',
  'koerperfettanteil-navy-rechner',
  'waist-to-hip-ratio-rechner',
  'waist-to-height-ratio-rechner',
  'maximalpuls-hfmax-rechner',
  'vo2max-cooper-test-rechner',
  'one-rep-max-rechner',
  'schritt-distanz-kalorien-rechner',
  'schlafbedarfs-rechner',
  'nikotin-rauchstopp-ersparnis-rechner',
  'koffein-halbwertszeit-rechner',
  'alkohol-abbau-rechner',
  'intervallfasten-16-8-rechner',
  'proteinbedarf-sportler-rechner',
  'blutdruck-klassifikation-rechner',
  'puls-trainingszonen-rechner',
  'schwimmen-kalorienverbrauch-rechner',
  'radfahren-kalorien-watt-rechner',

  // Familie & Schwangerschaft (25)
  'geburtstermin-rechner',
  'fruchtbare-tage-rechner',
  'elterngeld-basis-plus-rechner',
  'kindergeld-rechner-2026',
  'kinderzuschlag-kiz-rechner',
  'unterhaltsvorschuss-rechner',
  'duesseldorfer-tabelle-rechner',
  'ehegattenunterhalt-trennungsunterhalt-rechner',
  'schwangerschaftswoche-ssw-rechner',
  'mutterschutzfristen-rechner',
  'zykluslaenge-eisprung-rechner',
  'chinesischer-empfaengniskalender-rechner',
  'kindes-endgroesse-rechner',
  'kindersitz-groesse-i-size-rechner',
  'windelbudget-rechner',
  'erstausstattung-baby-rechner',
  'kita-gebuehren-rechner',
  'betreuungsgeld-familiengeld-rechner',
  'taschengeld-empfehlung-rechner',
  'schulbedarfspaket-bu-t-rechner',
  'kinderkrankentage-kinderkrankengeld-rechner',
  'grosselternzeit-rechner',
  'unterhalt-volljaehrige-kinder-rechner',
  'ausbildungsunterhalt-bedarfskontrollbetrag-rechner',
  'kinderbetreuungskosten-absetzen-rechner',
];

describe('Batch 6 Calculators Quality and Regression Suite', () => {
  it('contains exactly 50 calculators in the Batch 6 assignment', () => {
    expect(BATCH_6_SLUGS).toHaveLength(50);
    const uniqueSlugs = new Set(BATCH_6_SLUGS);
    expect(uniqueSlugs.size).toBe(50);
  });

  it('resolves every Batch 6 calculator from registry with comprehensive metadata', () => {
    for (const slug of BATCH_6_SLUGS) {
      const calc = getCalculatorBySlug(slug);
      expect(calc, `Calculator with slug "${slug}" should exist`).toBeDefined();
      if (!calc) continue;

      expect(calc.id).toBeTruthy();
      expect(calc.slug).toBe(slug);
      expect(calc.name).toBeTruthy();
      expect(calc.category).toBeTruthy();
      expect(calc.metaTitle).toBeTruthy();
      expect(calc.metaDescription).toBeTruthy();
      expect(calc.h1).toBeTruthy();
      expect(calc.inputs.length).toBeGreaterThan(0);
      expect(typeof calc.calculate).toBe('function');
    }
  });

  it('calculates valid default outputs without NaN for all 50 calculators', () => {
    for (const slug of BATCH_6_SLUGS) {
      const calc = getCalculatorBySlug(slug);
      expect(calc).toBeDefined();
      if (!calc) continue;

      const defaultInputs: Record<string, any> = {};
      for (const input of calc.inputs) {
        if (input.defaultValue !== undefined) {
          defaultInputs[input.id] = input.defaultValue;
        }
      }

      const result = calc.calculate(defaultInputs);
      expect(result, `Calculator "${slug}" should return a valid result object`).toBeDefined();
      if (result.error) {
        // Some calculators require explicit inputs
        expect(typeof result.error).toBe('string');
      } else {
        expect(result.primary).toBeDefined();
        if (typeof result.primary.value === 'number') {
          expect(Number.isNaN(result.primary.value), `Primary value in "${slug}" should not be NaN`).toBe(false);
          expect(Number.isFinite(result.primary.value), `Primary value in "${slug}" should be finite`).toBe(true);
        }
        expect(result.primary.formattedValue).toBeTruthy();
      }
    }
  });

  describe('Specific Calculations and Edge-Case Hardening', () => {
    it('idealgewicht-creff-rechner has correct id without character corruption', () => {
      const calc = getCalculatorBySlug('idealgewicht-creff-rechner');
      expect(calc?.id).toBe('idealgewicht-creff-rechner');
    });

    it('ehegattenunterhalt preserves netIncomePartner2 = 0 without defaulting to 1200 €', () => {
      const calc = getCalculatorBySlug('ehegattenunterhalt-trennungsunterhalt-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        netIncomePartner1: '3200',
        netIncomePartner2: '0',
      });
      expect(res?.error).toBeUndefined();
      // diff is 3200 - 0 = 3200; (3200 * 3/7 + 3200 * 0.45)/2 = (1371.43 + 1440)/2 = 1405.71
      // capped by 3200 - 1600 = 1600.
      expect(res?.primary.value).toBeCloseTo(1405.71, 1);
    });

    it('schlafbedarfs-rechner preserves wakeHour: 0 (midnight) and wakeMinute: 0', () => {
      const calc = getCalculatorBySlug('schlafbedarfs-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        wakeHour: '0',
        wakeMinute: '0',
        fallAsleepMinutes: '15',
      });
      expect(res?.error).toBeUndefined();
      // Wake at 00:00 (1440 mins). 5 cycles = 450 + 15 = 465 mins before 00:00 -> 16:15
      expect(res?.primary.formattedValue).toContain('16:15');
    });

    it('intervallfasten-16-8-rechner preserves firstMealHour: 0', () => {
      const calc = getCalculatorBySlug('intervallfasten-16-8-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        firstMealHour: '0',
        fastingRatio: '16_8',
      });
      expect(res?.error).toBeUndefined();
      expect(res?.primary.formattedValue).toBe('00:00 Uhr bis 08:00 Uhr');
    });

    it('elterngeld-basis-plus-rechner handles 0 € net income with minimum 300 € Basiselterngeld', () => {
      const calc = getCalculatorBySlug('elterngeld-basis-plus-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        avgNetMonthly: '0',
        hasSiblingsBonus: 'no',
      });
      expect(res?.error).toBeUndefined();
      expect(res?.primary.value).toBe(300);
    });

    it('vo2max-cooper-test-rechner safely handles 0 or 1 meter distance without division-by-zero', () => {
      const calc = getCalculatorBySlug('vo2max-cooper-test-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        distanceMeters: '1',
      });
      expect(res?.error).toBeUndefined();
      expect(Number.isFinite(res?.primary.value)).toBe(true);
      expect(res?.primary.value).toBeGreaterThanOrEqual(10);
    });

    it('one-rep-max-rechner clamps reps safely to avoid division by zero in Brzycki formula', () => {
      const calc = getCalculatorBySlug('one-rep-max-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        liftedWeightKg: '100',
        repsCount: '30',
      });
      expect(res?.error).toBeUndefined();
      expect(Number.isFinite(res?.primary.value)).toBe(true);
      expect(res?.primary.value).toBeGreaterThan(100);
    });

    it('schritt-distanz-kalorien-rechner handles stepsCount = 0 cleanly', () => {
      const calc = getCalculatorBySlug('schritt-distanz-kalorien-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        stepsCount: '0',
        heightCm: '180',
        weightKg: '80',
      });
      expect(res?.error).toBeUndefined();
      expect(res?.primary.value).toBe(0);
    });

    it('nikotin-rauchstopp-ersparnis-rechner preserves cigsPerDay = 0', () => {
      const calc = getCalculatorBySlug('nikotin-rauchstopp-ersparnis-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        cigsPerDay: '0',
        packPrice: '8.5',
        cigsPerPack: '20',
      });
      expect(res?.error).toBeUndefined();
      expect(res?.primary.value).toBe(0);
    });

    it('alkohol-abbau-rechner preserves pureAlcoholGrams = 0', () => {
      const calc = getCalculatorBySlug('alkohol-abbau-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        pureAlcoholGrams: '0',
        gender: 'male',
      });
      expect(res?.error).toBeUndefined();
      expect(res?.primary.value).toBe(0);
    });

    it('windelbudget-rechner preserves costPerDiaper = 0', () => {
      const calc = getCalculatorBySlug('windelbudget-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        diapersPerDayYear1: '7',
        diapersPerDayYear2to3: '5',
        costPerDiaper: '0',
      });
      expect(res?.error).toBeUndefined();
      expect(res?.primary.value).toBe(0);
    });

    it('leistungsumsatz-pal-rechner preserves sportKcalPerDay = 0 without defaulting to 200', () => {
      const calc = getCalculatorBySlug('leistungsumsatz-pal-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        bmrKcal: '1500',
        palLevel: 'office', // 1.4
        sportKcalPerDay: '0',
      });
      expect(res?.error).toBeUndefined();
      // 1500 * 1.4 + 0 = 2100
      expect(res?.primary.value).toBe(2100);
    });

    it('kindergeld-rechner-2026 handles childrenCount = 0 with 0 € output', () => {
      const calc = getCalculatorBySlug('kindergeld-rechner-2026');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        childrenCount: '0',
        taxableIncomeYearly: '60000',
      });
      expect(res?.error).toBeUndefined();
      expect(res?.primary.value).toBe(0);
    });

    it('erstausstattung-baby-rechner preserves hasPresentsBudget = 0', () => {
      const calc = getCalculatorBySlug('erstausstattung-baby-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        equipmentStandard: 'smart_mix', // 1650 gross
        hasPresentsBudget: '0',
      });
      expect(res?.error).toBeUndefined();
      expect(res?.primary.value).toBe(1650);
    });

    it('kita-gebuehren-rechner preserves lunchCateringMonthly = 0', () => {
      const calc = getCalculatorBySlug('kita-gebuehren-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        familyGrossIncome: '60000',
        childAgeCategory: 'kindergarten',
        hoursPerDay: '8',
        lunchCateringMonthly: '0',
      });
      expect(res?.error).toBeUndefined();
      // monthlyGross = 5000; feePct = 0.03; baseFee = 150; lunch = 0; total = 150
      expect(res?.primary.value).toBe(150);
    });

    it('unterhalt-volljaehrige-kinder-rechner handles childOwnIncome = 0 without error', () => {
      const calc = getCalculatorBySlug('unterhalt-volljaehrige-kinder-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        livingArrangement: 'own_household',
        childOwnIncome: '0',
      });
      expect(res?.error).toBeUndefined();
      // 930 - 250 - 0 = 680
      expect(res?.primary.value).toBe(680);
    });

    it('ausbildungsunterhalt-bedarfskontrollbetrag-rechner preserves salary = 0', () => {
      const calc = getCalculatorBySlug('ausbildungsunterhalt-bedarfskontrollbetrag-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        netApprenticeSalary: '0',
        baseChildSupport: '600',
      });
      expect(res?.error).toBeUndefined();
      expect(res?.primary.value).toBe(600);
    });

    it('kinderbetreuungskosten-absetzen-rechner preserves actualCareCostsYearly = 0', () => {
      const calc = getCalculatorBySlug('kinderbetreuungskosten-absetzen-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        actualCareCostsYearly: '0',
        taxRatePct: '35',
      });
      expect(res?.error).toBeUndefined();
      expect(res?.primary.value).toBe(0);
    });

    it('kinderkrankentage-kinderkrankengeld-rechner preserves sickDaysClaimed = 0', () => {
      const calc = getCalculatorBySlug('kinderkrankentage-kinderkrankengeld-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        monthlyNetIncome: '2400',
        sickDaysClaimed: '0',
        parentStatus: 'couple',
      });
      expect(res?.error).toBeUndefined();
      expect(res?.primary.value).toBe(0);
    });

    it('betreuungsgeld-familiengeld-rechner preserves monthsClaimed = 0', () => {
      const calc = getCalculatorBySlug('betreuungsgeld-familiengeld-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        childOrder: 'first_second',
        monthsClaimed: '0',
      });
      expect(res?.error).toBeUndefined();
      expect(res?.secondary?.[0].value).toBe(0); // total payout over 0 months is 0 €
    });

    it('schulbedarfspaket-bu-t-rechner preserves schoolKidsCount = 0', () => {
      const calc = getCalculatorBySlug('schulbedarfspaket-bu-t-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        schoolKidsCount: '0',
      });
      expect(res?.error).toBeUndefined();
      expect(res?.primary.value).toBe(0);
    });

    it('waist-to-hip-ratio-rechner guards against hipCm = 0', () => {
      const calc = getCalculatorBySlug('waist-to-hip-ratio-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        waistCm: '75',
        hipCm: '0',
        gender: 'female',
      });
      expect(res?.error).toBeUndefined();
      expect(Number.isFinite(res?.primary.value)).toBe(true);
    });

    it('waist-to-height-ratio-rechner guards against heightCm = 0', () => {
      const calc = getCalculatorBySlug('waist-to-height-ratio-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        waistCm: '80',
        heightCm: '0',
        ageYears: '30',
      });
      expect(res?.error).toBeUndefined();
      expect(Number.isFinite(res?.primary.value)).toBe(true);
    });

    it('geburtstermin-rechner returns clean validation error on extreme cycle days', () => {
      const calc = getCalculatorBySlug('geburtstermin-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        lastPeriodDate: '2026-05-01',
        cycleLength: '15',
      });
      expect(res?.error).toContain('Zyklusdauer');
    });

    it('bmi-rechner returns clean error on weight = 0', () => {
      const calc = getCalculatorBySlug('bmi-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        weight: '0',
        height: '175',
      });
      expect(res?.error).toBeTruthy();
    });

    it('wasserbedarf-rechner preserves sportsMinutes = 0 on rest days', () => {
      const calc = getCalculatorBySlug('wasserbedarf-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        weight: '70',
        activityLevel: 'sedentary',
        climate: 'moderate',
        sportsMinutes: '0',
      });
      expect(res?.error).toBeUndefined();
      // Baseline 70 * 0.035 = 2.45 L; no sports bonus added
      expect(res?.primary.value).toBeCloseTo(2.45, 2);
    });

    it('laufpace-rechner handles 0 hours cleanly', () => {
      const calc = getCalculatorBySlug('laufpace-rechner');
      expect(calc).toBeDefined();
      const res = calc?.calculate({
        distanceKm: '10',
        hours: '0',
        minutes: '50',
        seconds: '0',
      });
      expect(res?.error).toBeUndefined();
      expect(res?.primary.value).toBe(300); // 300 sec/km
      expect(res?.primary.formattedValue).toBe('5:00 min/km');
    });
  });
});
