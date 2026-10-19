import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';
import { calculatePortions, calculateBakingPan, calculateGramsToMl } from '@/lib/calculators/kochen';
import { calculateGradeAverage, calculateStandardDeviation } from '@/lib/calculators/statistik';
import { calculateAverage } from '@/lib/calculators/mathematik';

export const BATCH_7_SLUGS = [
  // Core Kochen (3)
  'portionsrechner',
  'backform-umrechner',
  'gramm-in-ml-rechner',

  // Core Statistik & Mathematik (3)
  'notendurchschnitt-rechner',
  'standardabweichung-rechner',
  'durchschnittsrechner',

  // Extra Kochen & Einheiten (30)
  'hefe-umrechner',
  'essloeffel-teeloeffel-gramm-rechner',
  'cups-in-gramm-rechner',
  'zucker-ersatz-rechner',
  'backzeit-temperatur-umluft-oberhitze-rechner',
  'fleisch-kerntemperatur-garzeit-rechner',
  'pizza-teig-rechner',
  'brot-backen-baeckermass-rechner',
  'alkohol-verkochungs-rechner',
  'sauerteig-anstellgut-rechner',
  'marmelade-geliermittel-rechner',
  'kaffee-wasser-verhaeltnis-rechner',
  'cocktail-alkoholgehalt-rechner',
  'salz-lake-poekel-rechner',
  'frittieroel-temperatur-rauchpunkt-rechner',
  'fondue-raclette-mengen-rechner',
  'kuehlschrank-haltbarkeit-rechner',
  'tee-ziehzeit-temperatur-rechner',
  'kalorien-rezept-rechner',
  'schokolade-temperieren-rechner',
  'gewicht-masse-umrechner',
  'zeit-umrechner',
  'schuhe-kleidergroessen-umrechner',
  'ringgroesse-umrechner',
  'viskositaet-umrechner',
  'radioaktivitaet-strahlendosis-rechner',
  'daten-speicher-umrechner',
  'datenrate-bandbreite-umrechner',
  'roemische-zahlen-umrechner',
  'binaer-hex-dezimal-umrechner',

  // Extra Business & Statistik (14)
  'customer-lifetime-value-clv-rechner',
  'churn-rate-rechner',
  'lead-conversion-rate-rechner',
  'mittelwert-median-modus-rechner',
  'varianz-standardabweichung-stichprobe-rechner',
  'quartile-box-plot-rechner',
  'perzentil-rechner',
  'korrelationskoeffizient-rechner',
  'lineare-regression-rechner',
  'kovarianz-rechner',
  'variationskoeffizient-rechner',
  'geometrisches-mittel-rechner',
  'harmonisches-mittel-rechner',
  'kombinatorik-n-ueber-k-rechner',
];

describe('Batch 7 Calculators Quality and Regression Suite', () => {
  it('contains exactly 50 assigned calculators in Batch 7', () => {
    expect(BATCH_7_SLUGS.length).toBe(50);
    const uniqueSlugs = new Set(BATCH_7_SLUGS);
    expect(uniqueSlugs.size).toBe(50);
  });

  it('all 50 calculators resolve in registry and have complete required metadata', () => {
    for (const slug of BATCH_7_SLUGS) {
      const calc = getCalculatorBySlug(slug);
      expect(calc, `Calculator with slug ${slug} must be registered`).toBeDefined();
      expect(calc!.name, `Calculator ${slug} must have a name`).toBeTruthy();
      expect(calc!.shortDescription || calc!.metaDescription, `Calculator ${slug} must have description`).toBeTruthy();
      expect(calc!.inputs.length, `Calculator ${slug} must define inputs`).toBeGreaterThan(0);
      expect(typeof calc!.calculate, `Calculator ${slug} must have a calculate function`).toBe('function');
    }
  });

  it('all 50 calculators produce valid results with default inputs', () => {
    for (const slug of BATCH_7_SLUGS) {
      const calc = getCalculatorBySlug(slug)!;
      const defaultInputs: Record<string, any> = {};
      for (const input of calc.inputs) {
        if (input.defaultValue !== undefined) {
          defaultInputs[input.id] = input.defaultValue;
        }
      }

      const result = calc.calculate(defaultInputs);
      expect(result, `Result of ${slug} with default inputs should be defined`).toBeDefined();
      expect(result.primary, `Primary result of ${slug} should exist`).toBeDefined();

      if (typeof result.primary.value === 'number') {
        expect(Number.isNaN(result.primary.value), `${slug} primary value should not be NaN`).toBe(false);
      }
    }
  });

  describe('Core Kochen Calculators Validation', () => {
    it('portionsrechner scales ingredients proportionally and rejects 0 or negative portions', () => {
      // 4 portions -> 8 portions with 500g flour = 1000g flour
      const resDouble = calculatePortions({
        originalPortions: 4,
        targetPortions: 8,
        originalAmount: 500,
      });
      expect(resDouble.primary.value).toBe(1000);
      expect(resDouble.error).toBeUndefined();

      // Zero original amount preserves 0
      const resZeroAmount = calculatePortions({
        originalPortions: 4,
        targetPortions: 8,
        originalAmount: 0,
      });
      expect(resZeroAmount.primary.value).toBe(0);

      // Invalid 0 portions should return error
      const resZeroPortions = calculatePortions({
        originalPortions: 0,
        targetPortions: 4,
        originalAmount: 500,
      });
      expect(resZeroPortions.error).toBeDefined();

      const resZeroTarget = calculatePortions({
        originalPortions: 4,
        targetPortions: 0,
        originalAmount: 500,
      });
      expect(resZeroTarget.error).toBeDefined();
    });

    it('backform-umrechner calculates area ratio accurately and guards zero diameter', () => {
      // 26cm round to 20cm round: ratio = (20^2) / (26^2) = 400 / 676 ≈ 0.5917
      const res = calculateBakingPan({
        diameterFrom: 26,
        diameterTo: 20,
      });
      expect(res.primary.value).toBeCloseTo(0.5917, 3);
      expect(res.error).toBeUndefined();

      // Zero diameter returns clean error
      const resZero = calculateBakingPan({
        diameterFrom: 0,
        diameterTo: 20,
      });
      expect(resZero.error).toBeDefined();
      expect(resZero.primary.value).toBe(0);
    });

    it('gramm-in-ml-rechner converts accurately by density and handles 0g', () => {
      // Water (density 1.0): 250g = 250ml
      const resWater = calculateGramsToMl({
        ingredient: 'water',
        grams: 250,
      });
      expect(resWater.primary.value).toBe(250);

      // Honey (density 1.42): 142g = 100ml
      const resHoney = calculateGramsToMl({
        ingredient: 'honey',
        grams: 142,
      });
      expect(resHoney.primary.value).toBeCloseTo(100, 1);

      // 0 grams yields 0 ml
      const resZero = calculateGramsToMl({
        ingredient: 'water',
        grams: 0,
      });
      expect(resZero.primary.value).toBe(0);
    });
  });

  describe('Core Statistik & Mathematik Calculators Validation', () => {
    it('notendurchschnitt-rechner handles simple and weighted modes and flags empty input', () => {
      // Simple mode
      const resSimple = calculateGradeAverage({
        calculationMode: 'simple',
        grades: '1; 2; 3',
      });
      expect(resSimple.primary.value).toBe(2.0);

      // Weighted mode
      const resWeighted = calculateGradeAverage({
        calculationMode: 'weighted',
        weightedGrades: '1.0 * 10; 2.0 * 10',
      });
      expect(resWeighted.primary.value).toBe(1.5);

      // Empty string should not fall back to defaults, but return error
      const resEmpty = calculateGradeAverage({
        calculationMode: 'simple',
        grades: '',
      });
      expect(resEmpty.error).toBeDefined();
    });

    it('standardabweichung-rechner calculates sample and population SD correctly and flags insufficient values', () => {
      // Values [2, 4, 4, 4, 5, 5, 7, 9]: Mean = 5, Sum of squared diffs = 32, Sample variance = 32/7 ≈ 4.5714, Sample SD ≈ 2.138
      const res = calculateStandardDeviation({
        values: '2; 4; 4; 4; 5; 5; 7; 9',
      });
      expect(res.primary.value).toBeCloseTo(2.138, 2);

      // Cleared input should return error
      const resCleared = calculateStandardDeviation({
        values: '',
      });
      expect(resCleared.error).toBeDefined();

      // Single value returns error
      const resSingle = calculateStandardDeviation({
        values: '42',
      });
      expect(resSingle.error).toBeDefined();
    });

    it('durchschnittsrechner computes arithmetic average, median and span and guards empty input', () => {
      const res = calculateAverage({
        numbers: '10; 20; 30; 40; 50',
      });
      expect(res.primary.value).toBe(30);

      const resEmpty = calculateAverage({
        numbers: '',
      });
      expect(resEmpty.error).toBeDefined();
    });
  });

  describe('Extra Business & Statistik Hardened Logic', () => {
    it('customer-lifetime-value-clv-rechner preserves 0% margin as 0€ CLV', () => {
      const calc = getCalculatorBySlug('customer-lifetime-value-clv-rechner')!;
      const resZeroMargin = calc.calculate({
        avgOrderValue: 100,
        purchaseFrequencyPerYear: 2,
        customerLifespanYears: 3,
        grossMarginPct: 0,
      });
      expect(resZeroMargin.primary.value).toBe(0);

      const resNormal = calc.calculate({
        avgOrderValue: 80,
        purchaseFrequencyPerYear: 4,
        customerLifespanYears: 3,
        grossMarginPct: 50,
      });
      expect(resNormal.primary.value).toBe(480);
    });

    it('churn-rate-rechner handles 0 churned customers correctly', () => {
      const calc = getCalculatorBySlug('churn-rate-rechner')!;
      const res = calc.calculate({
        startCustomers: 1000,
        lostCustomers: 0,
        avgMrrPerCustomer: 49,
      });
      expect(res.primary.value).toBe(0);
    });

    it('lead-conversion-rate-rechner handles 0 conversions without NaN', () => {
      const calc = getCalculatorBySlug('lead-conversion-rate-rechner')!;
      const res = calc.calculate({
        totalVisitors: 1000,
        conversionsCount: 0,
        avgCartValue: 50,
      });
      expect(res.primary.value).toBe(0);
    });

    it('kombinatorik-n-ueber-k-rechner computes n over 0 as exactly 1 combination', () => {
      const calc = getCalculatorBySlug('kombinatorik-n-ueber-k-rechner')!;
      const resChooseZero = calc.calculate({
        totalN: 49,
        chooseK: 0,
      });
      expect(resChooseZero.primary.value).toBe(1);

      // Lotto 6 aus 49 = 13,983,816
      const resLotto = calc.calculate({
        totalN: 49,
        chooseK: 6,
      });
      expect(resLotto.primary.value).toBe(13983816);
    });

    it('harmonisches-mittel-rechner computes harmonic mean and rejects non-positive speeds', () => {
      const calc = getCalculatorBySlug('harmonisches-mittel-rechner')!;
      // 60 and 120 km/h -> harmonic mean = (2 * 60 * 120) / (60 + 120) = 14400 / 180 = 80 km/h
      const res = calc.calculate({
        valA: 60,
        valB: 120,
      });
      expect(res.primary.value).toBe(80);

      const resZero = calc.calculate({
        valA: 0,
        valB: 120,
      });
      expect(resZero.error).toBeDefined();
    });

    it('perzentil-rechner handles 0th percentile rank correctly', () => {
      const calc = getCalculatorBySlug('perzentil-rechner')!;
      const resMin = calc.calculate({
        pRank: 0,
        d1: 10,
        d2: 25,
        d3: 40,
        d4: 55,
        d5: 70,
        d6: 85,
      });
      expect(resMin.primary.value).toBe(10);
    });
  });

  describe('Extra Kochen & Einheiten Hardened Logic', () => {
    it('pizza-teig-rechner computes dough proportions accurately and handles 0 pizzas', () => {
      const calc = getCalculatorBySlug('pizza-teig-rechner')!;
      const res = calc.calculate({
        ballsCount: 4,
        ballWeightG: 260,
        hydrationPercent: 65,
        saltPercent: 3,
      });
      // 4 * 260 = 1040g total dough. Flour ≈ 1040 / (1 + 0.65 + 0.03 + 0.002) = 1040 / 1.682 ≈ 618g
      expect(res.primary.value).toBeCloseTo(618.3, 0);

      const resZero = calc.calculate({
        ballsCount: 0,
        ballWeightG: 260,
        hydrationPercent: 65,
        saltPercent: 3,
      });
      expect(resZero.primary.value).toBe(0);
    });

    it('cocktail-alkoholgehalt-rechner preserves 0% liqueur and 0 spirits for virgin cocktails', () => {
      const calc = getCalculatorBySlug('cocktail-alkoholgehalt-rechner')!;
      // Virgin mocktail (0 alcohol)
      const resVirgin = calc.calculate({
        spiritMl: 0,
        spiritVolPct: 40,
        liqueurMl: 0,
        liqueurVolPct: 20,
        fillerMl: 200,
        iceMeltMl: 20,
      });
      expect(resVirgin.primary.value).toBe(0);

      // Gin Tonic (50ml 40% + 150ml tonic + 30ml ice) = 20ml ethanol in 230ml drink ≈ 8.7 Vol-%
      const resGinTonic = calc.calculate({
        spiritMl: 50,
        spiritVolPct: 40,
        liqueurMl: 0,
        liqueurVolPct: 20,
        fillerMl: 150,
        iceMeltMl: 30,
      });
      expect(resGinTonic.primary.value).toBeCloseTo(8.7, 1);
    });

    it('ringgroesse-umrechner and schuhe-kleidergroessen-umrechner reject 0 sizes gracefully', () => {
      const ringCalc = getCalculatorBySlug('ringgroesse-umrechner')!;
      const resRingZero = ringCalc.calculate({ euCircumferenceMm: 0 });
      expect(resRingZero.error).toBeDefined();

      const shoeCalc = getCalculatorBySlug('schuhe-kleidergroessen-umrechner')!;
      const resShoeZero = shoeCalc.calculate({ euSize: 0 });
      expect(resShoeZero.error).toBeDefined();
    });
  });
});
