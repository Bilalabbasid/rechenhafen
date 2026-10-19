import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';
import {
  calculateAge,
  calculateAgeInDays,
  calculateDateDifference,
  calculateWorkdays,
  calculateDateAdd,
  calculateLeapYear,
  calculateTimeDifference,
  calculateArbeitszeit,
  calculateAgeDifference,
  calculateTageBisWeihnachten,
} from '@/lib/calculators/datumZeit';
import {
  calculatePercentage,
  calculatePercentChange,
  calculateBaseValue,
  calculateRuleOfThree,
  calculatePythagoras,
  calculateGcdLcm,
  calculateRoot,
} from '@/lib/calculators/mathematik';

export const BATCH_8_SLUGS = [
  // Datum, Zeit & Kalender (26)
  'altersrechner',
  'alter-in-tagen',
  'lebenszeit-in-stunden',
  'alter-in-wochen',
  'alter-in-monaten',
  'altersunterschied',
  'geburtstagsrechner',
  'tage-bis-geburtstag',
  'datumsdifferenz',
  'wochen-zwischen-daten',
  'monate-zwischen-daten',
  'kalendertage-rechner',
  'arbeitszeitrechner',
  'tage-zwischen-zwei-daten',
  'tage-bis-weihnachten',
  'arbeitstage-rechner',
  'werktage-rechner',
  'datum-plus-tage',
  'datum-minus-tage',
  'schaltjahr-rechner',
  'wochenrechner',
  'zeitdifferenz-rechner',
  'stundenrechner',
  'countdown-rechner',
  'renteneintritt-rechner',
  'dienstjubilaeum-rechner',

  // Prozent, Dreisatz & Basis-Geometrie (11)
  'prozentrechner',
  'prozentuale-veraenderung',
  'grundwert-rechner',
  'dreisatzrechner',
  'verhaeltnis-rechner',
  'bruchrechner',
  'dreieckrechner',
  'pythagoras-rechner',
  'ggt-rechner',
  'kgv-rechner',
  'quadratwurzel-rechner',

  // Extra Arithmetik & Zahlen (13)
  'prozentualer-unterschied-rechner',
  'prozent-von-prozent-rechner',
  'promillerechner',
  'antiproportionaler-dreisatz-rechner',
  'bruch-in-dezimal-rechner',
  'dezimal-in-bruch-rechner',
  'kubikwurzel-rechner',
  'n-te-wurzel-rechner',
  'zehnerpotenzen-rechner',
  'modulo-rechner',
  'quersumme-rechner',
  'hexadezimal-rechner',
  'teiler-vielfache-rechner',
];

describe('Batch 8 Calculators Quality and Regression Suite', () => {
  it('contains exactly 50 assigned calculators in Batch 8', () => {
    expect(BATCH_8_SLUGS.length).toBe(50);
    const uniqueSlugs = new Set(BATCH_8_SLUGS);
    expect(uniqueSlugs.size).toBe(50);
  });

  it('all 50 calculators resolve in registry and have complete required metadata', () => {
    for (const slug of BATCH_8_SLUGS) {
      const calc = getCalculatorBySlug(slug);
      expect(calc, `Calculator with slug ${slug} must be registered`).toBeDefined();
      expect(calc!.name, `Calculator ${slug} must have a name`).toBeTruthy();
      expect(calc!.shortDescription || calc!.metaDescription, `Calculator ${slug} must have description`).toBeTruthy();
      expect(calc!.inputs.length, `Calculator ${slug} must define inputs`).toBeGreaterThan(0);
      expect(typeof calc!.calculate, `Calculator ${slug} must have a calculate function`).toBe('function');
    }
  });

  it('all 50 calculators produce valid results with default inputs', () => {
    for (const slug of BATCH_8_SLUGS) {
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

  describe('Datum & Zeit Core Calculations', () => {
    it('altersrechner calculates age correctly and handles leap years and invalid order', () => {
      // 1990-05-15 to 2025-05-15 is exactly 35 years
      const res35 = calculateAge({
        birthDate: '1990-05-15',
        targetDate: '2025-05-15',
      });
      expect(res35.primary.value).toBe(35);
      expect(res35.error).toBeUndefined();

      // Leap year: born 2000-02-29 to 2001-02-28 (still 0 full years)
      const resLeap0 = calculateAge({
        birthDate: '2000-02-29',
        targetDate: '2001-02-28',
      });
      expect(resLeap0.primary.value).toBe(0);

      // Target before birth
      const resInvalid = calculateAge({
        birthDate: '2025-01-01',
        targetDate: '2020-01-01',
      });
      expect(resInvalid.error).toBeDefined();

      // Empty birth date
      const resEmpty = calculateAge({
        birthDate: '',
      });
      expect(resEmpty.error).toBeDefined();
    });

    it('alter-in-tagen calculates exact day count', () => {
      // 2024-01-01 to 2024-01-11 is exactly 10 days
      const res = calculateAgeInDays({
        birthDate: '2024-01-01',
        targetDate: '2024-01-11',
      });
      expect(res.primary.value).toBe(10);
      expect(res.error).toBeUndefined();
    });

    it('datumsdifferenz calculates calendar differences', () => {
      // 2024-01-01 to 2024-01-15: 14 days
      const res = calculateDateDifference({
        startDate: '2024-01-01',
        endDate: '2024-01-15',
        includeEndDate: false,
      });
      expect(res.primary.value).toBe(14);
      expect(res.error).toBeUndefined();
    });

    it('schaltjahr-rechner verifies leap year algorithm rules', () => {
      // 2024: leap
      const res2024 = calculateLeapYear({ year: 2024 });
      expect(res2024.primary.value).toBe('Ja');

      // 2025: not leap
      const res2025 = calculateLeapYear({ year: 2025 });
      expect(res2025.primary.value).toBe('Nein');

      // 2000: divisible by 400 -> leap
      const res2000 = calculateLeapYear({ year: 2000 });
      expect(res2000.primary.value).toBe('Ja');

      // 1900: divisible by 100 but not 400 -> not leap
      const res1900 = calculateLeapYear({ year: 1900 });
      expect(res1900.primary.value).toBe('Nein');
    });

    it('arbeitszeitrechner computes net work hours and break deduction', () => {
      // 08:00 to 17:00 (9 hours) - 45 min break (0.75h) = 8.25 hours
      const res = calculateArbeitszeit({
        startTime: '08:00',
        endTime: '17:00',
        pauseMinutes: 45,
      });
      expect(res.primary.value).toBeCloseTo(8.25, 2);
      expect(res.error).toBeUndefined();

      // Zero break
      const resNoBreak = calculateArbeitszeit({
        startTime: '08:00',
        endTime: '16:00',
        pauseMinutes: 0,
      });
      expect(resNoBreak.primary.value).toBe(8);
    });

    it('zeitdifferenz-rechner calculates duration between two timestamps', () => {
      // 09:15 to 11:45 = 2.5 hours (150 minutes)
      const res = calculateTimeDifference({
        startTime: '09:15',
        endTime: '11:45',
      });
      expect(res.primary.value).toBeCloseTo(2.5, 2);
      expect(res.error).toBeUndefined();
    });

    it('tage-bis-weihnachten returns a positive number of days', () => {
      const res = calculateTageBisWeihnachten({});
      expect(res.primary.value).toBeGreaterThanOrEqual(0);
      expect(res.primary.value).toBeLessThanOrEqual(366);
    });

    it('datum-plus-tage adds calendar days correctly', () => {
      const res = calculateDateAdd({
        startDate: '2024-01-01',
        days: 10,
        direction: 'add',
      });
      expect(res.primary.formattedValue).toContain('11.01.2024');
      expect(res.error).toBeUndefined();
    });

    it('altersunterschied calculates difference between two birthdays', () => {
      const res = calculateAgeDifference({
        datePerson1: '1990-01-01',
        datePerson2: '1995-01-01',
      });
      expect(res.primary.value).toBe(5);
      expect(res.error).toBeUndefined();
    });
  });

  describe('Mathematik & Arithmetik Core Calculations', () => {
    it('prozentrechner calculates basic percentage accurately', () => {
      // 15% of 200 = 30
      const res = calculatePercentage({
        percent: 15,
        base: 200,
        mode: 'partOf',
      });
      expect(res.primary.value).toBe(30);
      expect(res.error).toBeUndefined();

      // 0% of 200 = 0
      const resZero = calculatePercentage({
        percent: 0,
        base: 200,
        mode: 'partOf',
      });
      expect(resZero.primary.value).toBe(0);
    });

    it('prozentuale-veraenderung calculates growth and decline', () => {
      // 100 to 125 = +25%
      const resUp = calculatePercentChange({
        oldValue: 100,
        newValue: 125,
      });
      expect(resUp.primary.value).toBe(25);

      // 100 to 75 = -25%
      const resDown = calculatePercentChange({
        oldValue: 100,
        newValue: 75,
      });
      expect(resDown.primary.value).toBe(-25);

      // Division by zero oldValue
      const resZero = calculatePercentChange({
        oldValue: 0,
        newValue: 50,
      });
      expect(resZero.error).toBeDefined();
    });

    it('grundwert-rechner determines original base value', () => {
      // 30 is 15% of 200
      const res = calculateBaseValue({
        part: 30,
        percent: 15,
      });
      expect(res.primary.value).toBe(200);

      // Zero percentage error
      const resZero = calculateBaseValue({
        part: 30,
        percent: 0,
      });
      expect(resZero.error).toBeDefined();
    });

    it('dreisatzrechner calculates proportional rule of three', () => {
      // 3 items = 15 EUR -> 5 items = 25 EUR
      const res = calculateRuleOfThree({
        a1: 3,
        b1: 15,
        a2: 5,
      });
      expect(res.primary.value).toBe(25);

      // Division by zero a1
      const resZero = calculateRuleOfThree({
        a1: 0,
        b1: 15,
        a2: 5,
      });
      expect(resZero.error).toBeDefined();
    });

    it('pythagoras-rechner calculates hypotenuse accurately', () => {
      // a = 3, b = 4 -> c = 5
      const res = calculatePythagoras({
        sideA: 3,
        sideB: 4,
        target: 'c',
      });
      expect(res.primary.value).toBe(5);

      // Zero or negative
      const resZero = calculatePythagoras({
        sideA: 0,
        sideB: 4,
        target: 'c',
      });
      expect(resZero.error).toBeDefined();
    });

    it('ggt-rechner and kgv-rechner compute gcd and lcm with zero validation', () => {
      // gcd(12, 18) = 6, lcm(12, 18) = 36
      const resGcd = calculateGcdLcm({ num1: 12, num2: 18, mode: 'gcd' });
      expect(resGcd.primary.value).toBe(6);

      const lcmItem = resGcd.secondary?.find((item) => item.id === 'lcm');
      expect(lcmItem?.value).toBe(36);

      // Zero inputs reject cleanly
      const resZero = calculateGcdLcm({ num1: 0, num2: 18, mode: 'gcd' });
      expect(resZero.error).toBeDefined();
    });

    it('calculateRoot computes square and nth roots and rejects degree <= 0', () => {
      // sqrt(16) = 4
      const resSqrt = calculateRoot({ value: 16, degree: 2 });
      expect(resSqrt.primary.value).toBe(4);

      // cbrt(27) = 3
      const resCbrt = calculateRoot({ value: 27, degree: 3 });
      expect(resCbrt.primary.value).toBe(3);

      // Degree 0 returns error
      const resDeg0 = calculateRoot({ value: 16, degree: 0 });
      expect(resDeg0.error).toBeDefined();

      // Negative value for even root returns error
      const resNegEven = calculateRoot({ value: -16, degree: 2 });
      expect(resNegEven.error).toBeDefined();
    });
  });

  describe('Hardened Batch 8 Calculators Edge Cases', () => {
    it('bruchrechner preserves 0 inputs and guards zero denominator', () => {
      const calc = getCalculatorBySlug('bruchrechner')!;
      
      // 1/4 + 2/4 = 3/4 = 0.75
      const resNormal = calc.calculate({
        num1: 1,
        den1: 4,
        op: '+',
        num2: 2,
        den2: 4,
      });
      expect(resNormal.primary.formattedValue).toBe('3 / 4');
      expect(resNormal.primary.value).toBe(0.75);

      // 0/4 + 2/5 = 2/5 (num1 = 0 must NOT fall back to default 3)
      const resZeroNum = calc.calculate({
        num1: 0,
        den1: 4,
        op: '+',
        num2: 2,
        den2: 5,
      });
      expect(resZeroNum.primary.formattedValue).toBe('2 / 5');
      expect(resZeroNum.primary.value).toBe(0.4);

      // Zero denominator must trigger error, not Infinity
      const resZeroDen = calc.calculate({
        num1: 1,
        den1: 0,
        op: '+',
        num2: 1,
        den2: 4,
      });
      expect(resZeroDen.error).toBeDefined();

      // Division by zero fraction: (1/2) / (0/1) -> division by zero
      const resDivZero = calc.calculate({
        num1: 1,
        den1: 2,
        op: '/',
        num2: 0,
        den2: 1,
      });
      expect(resDivZero.error).toBeDefined();
    });

    it('verhaeltnis-rechner preserves 0 values and guards zero base', () => {
      const calc = getCalculatorBySlug('verhaeltnis-rechner')!;

      // 16:9 ratio, given width 1920 -> height 1080
      const res = calc.calculate({
        a: 16,
        b: 9,
        c: 1920,
      });
      expect(res.primary.value).toBe(1080);

      // c = 0 -> d = 0 (preserved, not defaulted)
      const resZero = calc.calculate({
        a: 16,
        b: 9,
        c: 0,
      });
      expect(resZero.primary.value).toBe(0);

      // a = 0 -> error
      const resDivZero = calc.calculate({
        a: 0,
        b: 9,
        c: 100,
      });
      expect(resDivZero.error).toBeDefined();
    });

    it('dreieckrechner calculates area from baseG and heightH, rejecting 0', () => {
      const calc = getCalculatorBySlug('dreieckrechner')!;

      // Valid: baseG = 10, heightH = 6 -> area = (10 * 6) / 2 = 30
      const res = calc.calculate({
        baseG: 10,
        heightH: 6,
      });
      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(30);

      // baseG = 0 must trigger error
      const resZero = calc.calculate({
        baseG: 0,
        heightH: 6,
      });
      expect(resZero.error).toBeDefined();
    });

    it('modulo-rechner computes remainder correctly and handles divisor 0', () => {
      const calc = getCalculatorBySlug('modulo-rechner')!;

      // 29 mod 7 = 1
      const res = calc.calculate({ dividend: 29, divisor: 7 });
      expect(res.primary.value).toBe(1);

      // Divisor 0 must return error
      const resZero = calc.calculate({ dividend: 29, divisor: 0 });
      expect(resZero.error).toBeDefined();

      // Negative modulo: -5 mod 3 = 1
      const resNeg = calc.calculate({ dividend: -5, divisor: 3 });
      expect(resNeg.primary.value).toBe(1);
    });

    it('quersumme-rechner calculates digit sum of 0 as 0 without defaulting to 9475', () => {
      const calc = getCalculatorBySlug('quersumme-rechner')!;

      // Quersumme of 0 is 0
      const resZero = calc.calculate({ num: '0' });
      expect(resZero.primary.value).toBe(0);

      // Quersumme of 9475 = 9+4+7+5 = 25
      const res9475 = calc.calculate({ num: '9475' });
      expect(res9475.primary.value).toBe(25);
    });

    it('teiler-vielfache-rechner handles 60 and rejects 0', () => {
      const calc = getCalculatorBySlug('teiler-vielfache-rechner')!;

      // 60 has 12 divisors
      const res60 = calc.calculate({ num: 60 });
      expect(res60.primary.value).toBe(12);
      expect(res60.error).toBeUndefined();

      // 0 must return validation error
      const resZero = calc.calculate({ num: 0 });
      expect(resZero.error).toBeDefined();
    });

    it('hexadezimal-rechner converts hex to decimal and handles valid/invalid input', () => {
      const calc = getCalculatorBySlug('hexadezimal-rechner')!;

      // Hex FF -> Dec 255
      const resHex = calc.calculate({ hexVal: 'FF' });
      expect(resHex.primary.value).toBe(255);

      // Hex 1A -> Dec 26
      const res1A = calc.calculate({ hexVal: '1A' });
      expect(res1A.primary.value).toBe(26);

      // Invalid hex
      const resInv = calc.calculate({ hexVal: 'ZZ' });
      expect(resInv.error).toBeDefined();
    });

    it('zehnerpotenzen-rechner converts scientific notation preserving 0', () => {
      const calc = getCalculatorBySlug('zehnerpotenzen-rechner')!;

      // 2500000 -> 2.5 * 10^6
      const res = calc.calculate({ numberVal: 2500000 });
      expect(res.primary.value).toBe(2500000);
      expect(res.primary.formattedValue).toContain('10^6');

      // numberVal 0 preserves 0
      const resZero = calc.calculate({ numberVal: 0 });
      expect(resZero.primary.value).toBe(0);
      expect(resZero.primary.formattedValue).toContain('0 × 10⁰');
    });

    it('renteneintritt-rechner determines German standard retirement year and age', () => {
      const calc = getCalculatorBySlug('renteneintritt-rechner')!;

      // Born 1970 -> standard retirement at age 67 in 2037
      const res = calc.calculate({ birthYear: 1970, birthMonth: 5 });
      expect(res.primary.value).toBe(2037);
      expect(res.error).toBeUndefined();
    });

    it('antiproportionaler-dreisatz-rechner handles inverse rule of three', () => {
      const calc = getCalculatorBySlug('antiproportionaler-dreisatz-rechner')!;

      // 4 workers take 6 hours -> 8 workers take 3 hours
      const res = calc.calculate({ a1: 4, b1: 6, a2: 8 });
      expect(res.primary.value).toBe(3);

      // a2 = 0 error
      const resZero = calc.calculate({ a1: 4, b1: 6, a2: 0 });
      expect(resZero.error).toBeDefined();
    });
  });
});
