import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';
import retired from '@/data/seo/retired-calculators.json';
import {
  addMonthsClamped,
  berlinLocalToUtcMs,
  calculateCalendarSpan,
  calculateTageBisGeburtstag,
  calculateTagerechner,
  dateToDayNumber,
  dayNumberToDate,
  getBerlinTodayParts,
  splitCountdown,
} from '@/lib/calculators/dateMath';
import { calculateDezimalBruch, calculateProzentVergleich, parseDecimalInput } from '@/lib/calculators/bruchProzent';
import type { CalculationResult } from '@/types/calculator';

const RETIRED = new Set(Object.keys(retired as Record<string, string>));
const sec = (res: CalculationResult, id: string) => res.secondary?.find((s) => s.id === id);

// ===========================================================================
// 1. Tagerechner (tage-zwischen-zwei-daten) ← wochen-/monate-zwischen-daten, countdown-rechner
// ===========================================================================
describe('Tagerechner: weeks, months, countdown', () => {
  it('01.01.2026 → 30.06.2026: 180 days = 25 weeks 5 days = 5 months 29 days', () => {
    const res = calculateTagerechner({ mode: 'between', startDate: '2026-01-01', endDate: '2026-06-30' });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(180);
    expect(sec(res, 'weeksBreakdown')?.formattedValue).toBe('25 Wochen und 5 Tage');
    expect(sec(res, 'monthsBreakdown')?.formattedValue).toBe('5 Monate und 29 Tage');
    expect(sec(res, 'calendarBreakdown')?.formattedValue).toBe('0 Jahre, 5 Monate und 29 Tage');
    expect(sec(res, 'hoursMinutes')?.formattedValue).toBe('4.320 Std. · 259.200 Min.');
    expect(sec(res, 'periodDirection')?.formattedValue).toBe('Do 01.01.2026 → Di 30.06.2026');
    expect(res.summaryText).toContain('25 Wochen und 5 Tagen');
  });

  it('15.01.2026 → 15.10.2026 is exactly 9 months (273 days, 39 weeks)', () => {
    const res = calculateTagerechner({ mode: 'between', startDate: '2026-01-15', endDate: '2026-10-15' });
    expect(res.primary.value).toBe(273);
    expect(sec(res, 'monthsBreakdown')?.formattedValue).toBe('9 Monate und 0 Tage');
    expect(sec(res, 'weeksBreakdown')?.formattedValue).toBe('39 Wochen und 0 Tage');
  });

  it('handles month ends: 31.01. → 28.02. = 1 month, 31.01. → 01.03. = 1 month 1 day (never negative)', () => {
    const feb = calculateTagerechner({ mode: 'between', startDate: '2026-01-31', endDate: '2026-02-28' });
    expect(feb.primary.value).toBe(28);
    expect(sec(feb, 'monthsBreakdown')?.formattedValue).toBe('1 Monat und 0 Tage');

    const mar = calculateTagerechner({ mode: 'between', startDate: '2026-01-31', endDate: '2026-03-01' });
    expect(mar.primary.value).toBe(29);
    expect(sec(mar, 'monthsBreakdown')?.formattedValue).toBe('1 Monat und 1 Tag');

    // Leap year: 30.01.2024 + 1 Monat = 29.02.2024, then 1 day
    const leap = calculateTagerechner({ mode: 'between', startDate: '2024-01-30', endDate: '2024-03-01' });
    expect(leap.primary.value).toBe(31);
    expect(sec(leap, 'monthsBreakdown')?.formattedValue).toBe('1 Monat und 1 Tag');
  });

  it('long span 01.03.1960 → 05.10.2050 = 90 years, 7 months, 4 days', () => {
    const res = calculateTagerechner({ mode: 'between', startDate: '1960-03-01', endDate: '2050-10-05' });
    expect(res.primary.value).toBe(33090);
    expect(sec(res, 'calendarBreakdown')?.formattedValue).toBe('90 Jahre, 7 Monate und 4 Tage');
    expect(sec(res, 'monthsBreakdown')?.formattedValue).toBe('1.087 Monate und 4 Tage');
  });

  it('inclusive counting: 01.01. – 31.01.2026 with Starttag = 31 days = 1 full month', () => {
    const res = calculateTagerechner({ mode: 'between', startDate: '2026-01-01', endDate: '2026-01-31', includeStartDay: true });
    expect(res.primary.value).toBe(31);
    expect(sec(res, 'monthsBreakdown')?.formattedValue).toBe('1 Monat und 0 Tage');
    expect(res.summaryText).toContain('Start- und Endtag mitgezählt');
  });

  it('reversed dates are measured from the earlier date', () => {
    const res = calculateTagerechner({ mode: 'between', startDate: '2026-03-01', endDate: '2026-01-01' });
    expect(res.primary.value).toBe(59);
    expect(sec(res, 'monthsBreakdown')?.formattedValue).toBe('2 Monate und 0 Tage');
  });

  it('same day gives 0 days and 0 months', () => {
    const res = calculateTagerechner({ mode: 'between', startDate: '2026-05-15', endDate: '2026-05-15' });
    expect(res.primary.value).toBe(0);
    expect(sec(res, 'monthsBreakdown')?.formattedValue).toBe('0 Monate und 0 Tage');
  });

  it('until mode adds a countdown in days/hours/minutes from now; since mode does not', () => {
    const today = getBerlinTodayParts();
    const until = calculateTagerechner({ mode: 'until', endDate: '2050-10-05', targetTime: '18:30' });
    expect(until.error).toBeUndefined();
    const days = dateToDayNumber(2050, 10, 5) - dateToDayNumber(today.year, today.month, today.day);
    expect(until.primary.value).toBe(days);
    const cd = sec(until, 'countdownNow');
    expect(cd).toBeDefined();
    expect(cd?.formattedValue).toMatch(/^[\d.]+ Tage, \d+ Std\., \d+ Min\.$/);
    expect(cd?.helpText).toContain('05.10.2050, 18:30 Uhr');

    const past = calculateTagerechner({ mode: 'until', endDate: '2020-01-01' });
    expect(sec(past, 'countdownNow')?.formattedValue).toBe('Zeitpunkt erreicht');

    const since = calculateTagerechner({ mode: 'since', startDate: '2020-01-01' });
    expect(sec(since, 'countdownNow')).toBeUndefined();
  });

  it('rejects invalid dates and times with German messages (no throw)', () => {
    expect(calculateTagerechner({ mode: 'between', startDate: '2026-02-30', endDate: '2026-03-01' }).error).toContain('gültige');
    expect(calculateTagerechner({ mode: 'until', endDate: '2027-01-01', targetTime: '25:00' }).error).toContain('Uhrzeit');
  });

  it('calendar span is consistent for every pair of dates (start + months + days = end)', () => {
    const base = dateToDayNumber(2023, 12, 25);
    for (let i = 0; i < 120; i += 1) {
      for (let j = i; j < i + 430; j += 7) {
        const a = dayNumberToDate(base + i);
        const b = dayNumberToDate(base + j);
        const span = calculateCalendarSpan(a, b);
        expect(span.days).toBeGreaterThanOrEqual(0);
        const anchor = addMonthsClamped(a, span.totalMonths);
        expect(dateToDayNumber(anchor.year, anchor.month, anchor.day) + span.days).toBe(base + j);
        const nextAnchor = addMonthsClamped(a, span.totalMonths + 1);
        expect(dateToDayNumber(nextAnchor.year, nextAnchor.month, nextAnchor.day)).toBeGreaterThan(base + j);
      }
    }
  });

  it('countdown helpers are DST-aware for Europe/Berlin', () => {
    // 29.03.2026 03:00 MESZ = 01:00 UTC; 25.10.2026 12:00 MEZ = 11:00 UTC
    expect(berlinLocalToUtcMs(2026, 3, 29, 3, 0)).toBe(Date.UTC(2026, 2, 29, 1, 0));
    expect(berlinLocalToUtcMs(2026, 10, 25, 12, 0)).toBe(Date.UTC(2026, 9, 25, 11, 0));
    expect(berlinLocalToUtcMs(2026, 7, 1, 0, 0)).toBe(Date.UTC(2026, 5, 30, 22, 0));
    // Night of the spring change has only 23 hours
    const from = berlinLocalToUtcMs(2026, 3, 28, 12, 0);
    const to = berlinLocalToUtcMs(2026, 3, 29, 12, 0);
    expect(splitCountdown(to, from).totalHours).toBe(23);

    const cd = splitCountdown(Date.UTC(2026, 0, 2, 2, 3), Date.UTC(2026, 0, 1, 0, 0));
    expect(cd).toMatchObject({ reached: false, days: 1, hours: 2, minutes: 3, totalHours: 26 });
    expect(splitCountdown(0, 1).reached).toBe(true);
  });
});

// ===========================================================================
// 2. Tage bis Geburtstag ← geburtstagsrechner
// ===========================================================================
describe('Tage bis Geburtstag: countdown, weekday, age', () => {
  it('24.10.1996 on 05.11.2026: 353 days to Sunday 24.10.2027, turns 31, born on a Thursday', () => {
    const res = calculateTageBisGeburtstag({ birthDate: '1996-10-24', referenceDate: '2026-11-05' });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(353);
    expect(res.primary.formattedValue).toBe('353 Tage');
    expect(sec(res, 'nextDate')?.formattedValue).toBe('Sonntag, 24.10.2027');
    expect(sec(res, 'ageNext')?.value).toBe(31);
    expect(sec(res, 'currentAge')?.value).toBe(30);
    expect(sec(res, 'weeks')?.formattedValue).toBe('50 Wochen und 3 Tage');
    expect(sec(res, 'birthWeekday')?.formattedValue).toBe('Donnerstag, 24.10.1996');
    expect(sec(res, 'roundBirthday')?.formattedValue).toBe('40. am Freitag, 24.10.2036');
    expect(sec(res, 'roundBirthday')?.helpText).toBe('In 3.641 Tagen.');
  });

  it('29.02. birthday in a non-leap year: 28.02. shown, legal age from 01.03.', () => {
    const res = calculateTageBisGeburtstag({ birthDate: '2000-02-29', referenceDate: '2026-11-05' });
    expect(res.primary.value).toBe(115);
    expect(sec(res, 'nextDate')?.formattedValue).toBe('Sonntag, 28.02.2027');
    expect(sec(res, 'ageNext')?.value).toBe(27);
    expect(sec(res, 'birthWeekday')?.formattedValue).toBe('Dienstag, 29.02.2000');
    expect(sec(res, 'legalAgeDate')?.formattedValue).toBe('Montag, 01.03.2027');
    expect(res.summaryText).toContain('kein Schaltjahr');
  });

  it('29.02. birthday in a leap year uses 29.02. without legal note', () => {
    const res = calculateTageBisGeburtstag({ birthDate: '2000-02-29', referenceDate: '2027-12-01' });
    expect(res.primary.value).toBe(90);
    expect(sec(res, 'nextDate')?.formattedValue).toBe('Dienstag, 29.02.2028');
    expect(sec(res, 'legalAgeDate')).toBeUndefined();
  });

  it('birthday today', () => {
    const res = calculateTageBisGeburtstag({ birthDate: '1986-11-05', referenceDate: '2026-11-05' });
    expect(res.primary.value).toBe(0);
    expect(res.primary.formattedValue).toBe('Heute ist Ihr Geburtstag!');
    expect(sec(res, 'ageNext')?.value).toBe(40);
    expect(sec(res, 'currentAge')?.value).toBe(40);
    expect(sec(res, 'roundBirthday')?.helpText).toBe('Das ist heute!');
    expect(res.summaryText).toContain('Sie werden 40 Jahre alt');
  });

  it('birthday tomorrow and new-born edge cases', () => {
    const tomorrow = calculateTageBisGeburtstag({ birthDate: '1990-12-31', referenceDate: '2026-12-30' });
    expect(tomorrow.primary.formattedValue).toBe('1 Tag');

    const newborn = calculateTageBisGeburtstag({ birthDate: '2026-11-05', referenceDate: '2026-11-05' });
    expect(newborn.primary.value).toBe(365);
    expect(sec(newborn, 'ageNext')?.value).toBe(1);
    expect(sec(newborn, 'currentAge')?.formattedValue).toBe('0 Jahre');
  });

  it('errors: empty, impossible date, future birth date', () => {
    expect(calculateTageBisGeburtstag({ birthDate: '' }).error).toContain('Geburtsdatum');
    expect(calculateTageBisGeburtstag({ birthDate: '2023-02-29' }).error).toContain('gültiges');
    expect(calculateTageBisGeburtstag({ birthDate: '2030-01-01', referenceDate: '2026-11-05' }).error).toContain('Zukunft');
  });

  it('works with the real today (no referenceDate)', () => {
    const res = calculateTageBisGeburtstag({ birthDate: '1996-10-24' });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBeGreaterThanOrEqual(0);
    expect(res.primary.value).toBeLessThanOrEqual(365);
  });
});

// ===========================================================================
// 3. Dezimalzahl ↔ Bruch ← bruch-in-dezimal-rechner
// ===========================================================================
describe('Dezimalzahl in Bruch (dec2frac)', () => {
  const d2f = (decimalVal: unknown) => calculateDezimalBruch({ direction: 'dec2frac', decimalVal });

  it.each([
    ['0,75', '3/4', 0.75],
    ['0.75', '3/4', 0.75],
    [0.75, '3/4', 0.75],
    ['2,125', '17/8', 2.125],
    ['-0,4', '−2/5', -0.4],
    ['−1,25', '−5/4', -1.25],
    ['0,(3)', '1/3', 1 / 3],
    ['0,333...', '1/3', 1 / 3],
    ['0,333…', '1/3', 1 / 3],
    ['0,1(6)', '1/6', 1 / 6],
    ['0,1666…', '1/6', 1 / 6],
    ['0,(142857)', '1/7', 1 / 7],
    ['0,142857142857…', '1/7', 1 / 7],
    ['0,(9)', '1', 1],
    ['1.234,5', '2469/2', 1234.5],
    ['0', '0', 0],
    ['5', '5', 5],
    ['-0', '0', 0],
  ])('%s → %s', (input, fraction, value) => {
    const res = d2f(input);
    expect(res.error).toBeUndefined();
    expect(res.primary.formattedValue).toBe(fraction);
    expect(res.primary.value as number).toBeCloseTo(value, 10);
  });

  it('shows mixed number, unreduced fraction and periodic form', () => {
    const res = d2f('2,125');
    expect(sec(res, 'mixed')?.formattedValue).toBe('2 1/8');
    expect(sec(res, 'unreduced')?.formattedValue).toBe('2125/1000');
    expect(sec(res, 'unreduced')?.helpText).toBe('Gekürzt mit ggT 125.');

    const neg = d2f('-1,25');
    expect(sec(neg, 'mixed')?.formattedValue).toBe('−1 1/4');

    const per = d2f('0,1(6)');
    expect(sec(per, 'periodic')?.formattedValue).toBe('0,16̅');
    expect(per.calculationSteps?.join(' ')).toContain('(16 − 1) / (10^1 × 9) = 15/90');

    expect(d2f('0,(9)').summaryText).toContain('Periode aus Neunen');
  });

  it('rejects invalid input with German messages', () => {
    expect(d2f('').error).toContain('Bitte geben Sie eine Dezimalzahl');
    expect(d2f('abc').error).toContain('keine gültige Dezimalzahl');
    expect(d2f('1,2,3').error).toContain('keine gültige Dezimalzahl');
    expect(d2f('0,12...').error).toContain('Periode ist nicht eindeutig');
    expect(d2f('0,' + '1'.repeat(40)).error).toContain('höchstens 30 Ziffern');
  });

  it('parser detects pre-period and period from trailing dots', () => {
    expect(parseDecimalInput('0,1231231…')).toMatchObject({ preperiod: '', period: '123', periodDetected: true });
    expect(parseDecimalInput('3,41666…')).toMatchObject({ integerDigits: '3', preperiod: '41', period: '6' });
  });
});

describe('Bruch in Dezimalzahl (frac2dec)', () => {
  const f2d = (numerator: unknown, denominator: unknown, wholeNumber: unknown = 0) =>
    calculateDezimalBruch({ direction: 'frac2dec', numerator, denominator, wholeNumber });

  it('periodic decimals are marked (5/6 = 0,8(3), 1/3, 22/7)', () => {
    const r = f2d(5, 6);
    expect(r.error).toBeUndefined();
    expect(r.primary.formattedValue).toBe('0,83̅');
    expect(sec(r, 'periodNotation')?.formattedValue).toBe('0,8(3)');
    expect(sec(r, 'rounded')?.formattedValue).toBe('0,8333333333');
    expect(r.primary.value as number).toBeCloseTo(5 / 6, 12);

    expect(sec(f2d(1, 3), 'periodNotation')?.formattedValue).toBe('0,(3)');
    expect(sec(f2d(22, 7), 'periodNotation')?.formattedValue).toBe('3,(142857)');
  });

  it('terminating decimals, mixed and negative numbers', () => {
    const r = f2d(3, 8);
    expect(r.primary.formattedValue).toBe('0,375');
    expect(sec(r, 'type')?.formattedValue).toContain('Endliche');

    const mixed = f2d(3, 8, -2);
    expect(mixed.primary.formattedValue).toBe('−2,375');
    expect(mixed.primary.value).toBe(-2.375);

    expect(f2d(3, -4).primary.formattedValue).toBe('−0,75');
    expect(f2d('1', '4', '2').primary.formattedValue).toBe('2,25');
    expect(f2d(0, 5).primary.formattedValue).toBe('0');
    expect(sec(f2d(6, 4), 'fraction')?.formattedValue).toBe('3/2 = 1 1/2');
  });

  it('very long periods are shown rounded', () => {
    const r = f2d(1, 97);
    expect(r.error).toBeUndefined();
    expect(String(r.primary.formattedValue).startsWith('≈ 0,0103092784')).toBe(true);
    expect(sec(r, 'type')?.formattedValue).toContain('96 Stellen');
  });

  it('rejects zero denominators, non-integers and bad mixed signs', () => {
    expect(f2d(1, 0).error).toContain('Nenner darf nicht 0');
    expect(f2d(1.5, 4).error).toContain('ganze Zahlen');
    expect(f2d('', 4).error).toContain('ganze Zahlen');
    expect(f2d(-3, 8, 2).error).toContain('Minuszeichen');
    expect(f2d(1, 4, 1.5).error).toContain('ganze Zahl');
  });
});

// ===========================================================================
// 4. Prozentuale Veränderung & Unterschied ← prozentuale-veraenderung
// ===========================================================================
describe('Prozentuale Veränderung & Unterschied', () => {
  it('default view answers the change: 80 → 100 = +25 %, symmetric 22,22 %, back −20 %', () => {
    const res = calculateProzentVergleich({ valA: 80, valB: 100 });
    expect(res.error).toBeUndefined();
    expect(res.primary.label).toBe('Prozentuale Steigerung');
    expect(res.primary.value).toBe(25);
    expect(res.primary.formattedValue).toBe('+25 %');
    expect(sec(res, 'symmetric')?.value as number).toBeCloseTo(22.2222, 3);
    expect(sec(res, 'symmetric')?.formattedValue).toBe('22,22 %');
    expect(sec(res, 'reverse')?.formattedValue).toBe('−20 %');
    expect(sec(res, 'absDiff')?.formattedValue).toBe('+20');
    expect(sec(res, 'factor')?.formattedValue).toBe('1,25 ×');
  });

  it('decrease: 250.000 → 190.000 = −24 %', () => {
    const res = calculateProzentVergleich({ mode: 'change', valA: '250000', valB: '190000' });
    expect(res.primary.label).toBe('Prozentuale Abnahme');
    expect(res.primary.value as number).toBeCloseTo(-24, 10);
    expect(res.primary.formattedValue).toBe('−24 %');
    expect(res.summaryText).toContain('Abnahme um 24 %');
  });

  it('percentage values: 2 % → 3 % = +50 % and +1 Prozentpunkt', () => {
    const res = calculateProzentVergleich({ valA: 2, valB: 3, arePercentages: true });
    expect(res.primary.value).toBe(50);
    expect(sec(res, 'points')?.formattedValue).toBe('+1 Prozentpunkt');
    expect(sec(res, 'absDiff')).toBeUndefined();
    expect(res.primary.helpText).toContain('+1 Prozentpunkt.');
  });

  it('difference mode: 450 vs 500 = 10,53 %, change both ways shown', () => {
    const res = calculateProzentVergleich({ mode: 'difference', valA: 450, valB: 500 });
    expect(res.primary.id).toBe('symmetric');
    expect(res.primary.formattedValue).toBe('10,53 %');
    expect(sec(res, 'change')?.formattedValue).toBe('+11,11 %');
    expect(sec(res, 'reverse')?.formattedValue).toBe('−10 %');
    // symmetric: order does not matter
    const swapped = calculateProzentVergleich({ mode: 'difference', valA: 500, valB: 450 });
    expect(swapped.primary.value).toBeCloseTo(res.primary.value as number, 12);
  });

  it('change from 0 is not defined, but the result still shows absolute and symmetric values', () => {
    const res = calculateProzentVergleich({ valA: 0, valB: 50 });
    expect(res.error).toBeUndefined();
    expect(res.primary.formattedValue).toBe('nicht definiert');
    expect(sec(res, 'symmetric')?.value).toBe(200);
    expect(res.summaryText).toContain('Ausgangswert 0');

    const both = calculateProzentVergleich({ valA: 0, valB: 0 });
    expect(both.primary.value).toBe(0);
    expect(both.summaryText).toContain('keine Veränderung');

    const toZero = calculateProzentVergleich({ valA: 100, valB: 0 });
    expect(toZero.primary.value).toBe(-100);
    expect(sec(toZero, 'reverse')?.formattedValue).toBe('nicht definiert');
  });

  it('negative values use the absolute base; mixed signs get a hint', () => {
    expect(calculateProzentVergleich({ valA: -50, valB: -25 }).primary.value).toBe(50);
    const mixed = calculateProzentVergleich({ valA: -10, valB: 10 });
    expect(mixed.primary.value).toBe(200);
    expect(mixed.summaryText).toContain('unterschiedliche Vorzeichen');
  });

  it('rejects missing or invalid numbers', () => {
    expect(calculateProzentVergleich({ valA: '', valB: 5 }).error).toContain('gültige Zahlen');
    expect(calculateProzentVergleich({ valA: 'abc', valB: 5 }).error).toContain('gültige Zahlen');
    expect(calculateProzentVergleich({ valA: '1,5', valB: '3' }).primary.value).toBe(100);
  });
});

// ===========================================================================
// 5. Page definitions: content quality, SEO limits, links to live calculators only
// ===========================================================================
const TARGETS = {
  'tage-zwischen-zwei-daten': ['wochen zwischen zwei daten', 'monate zwischen zwei daten', 'countdown rechner'],
  'tage-bis-geburtstag': ['geburtstagsrechner', 'geburtstag rechner', 'an welchem wochentag geboren'],
  'dezimal-in-bruch-rechner': ['bruch in dezimalzahl', 'dezimalzahl in bruch'],
  'prozentualer-unterschied-rechner': ['prozentuale veränderung berechnen', 'prozentualer unterschied rechner'],
} as const;

const FORBIDDEN = [/präzise Formelberechnung/i, /verlässliche(n)? Ergebnisse?(n)?/i, /für Ihre Planung/i, /umfassend/i, /ultimativ/i, /im Handumdrehen/i, /\bdu\b/i, /\bdein/i];

describe('Merged target pages', () => {
  for (const [slug, keywords] of Object.entries(TARGETS)) {
    describe(slug, () => {
      const calc = getCalculatorBySlug(slug)!;

      it('is live and not retired', () => {
        expect(calc).toBeDefined();
        expect(RETIRED.has(slug)).toBe(false);
      });

      it('has SEO metadata within limits', () => {
        expect(calc.metaTitle.length).toBeLessThanOrEqual(60);
        expect(calc.metaTitle).not.toContain('RechenHafen');
        expect(calc.metaDescription.length).toBeLessThanOrEqual(155);
        expect(calc.metaDescription.toLowerCase()).toContain('kostenlos');
        for (const kw of keywords) expect(calc.searchKeywords).toContain(kw);
      });

      it('has examples, FAQs and sections', () => {
        expect(calc.workedExamples?.length ?? 0).toBeGreaterThanOrEqual(2);
        expect(calc.faqs.length).toBeGreaterThanOrEqual(4);
        expect(calc.faqs.length).toBeLessThanOrEqual(6);
        expect(calc.content?.sections?.length ?? 0).toBeGreaterThanOrEqual(2);
        expect(calc.content?.sections?.length ?? 0).toBeLessThanOrEqual(4);
      });

      it('uses no forbidden filler phrases and no du-form', () => {
        const text = JSON.stringify({
          t: calc.metaTitle, d: calc.metaDescription, h: calc.h1, s: calc.shortDescription,
          c: calc.content, f: calc.faqs, w: calc.workedExamples, fe: calc.formulaExplanation,
        });
        for (const re of FORBIDDEN) expect(text, String(re)).not.toMatch(re);
      });

      it('links only to live calculators', () => {
        for (const rel of calc.relatedSlugs) {
          expect(RETIRED.has(rel), `${rel} is retired`).toBe(false);
          expect(getCalculatorBySlug(rel), `${rel} must exist`).toBeDefined();
        }
        const text = JSON.stringify(calc.content) + JSON.stringify(calc.faqs);
        for (const m of text.matchAll(/\/rechner\/([a-z0-9-]+)\//g)) {
          expect(RETIRED.has(m[1]), `${m[1]} is retired`).toBe(false);
          expect(getCalculatorBySlug(m[1]), `${m[1]} must exist`).toBeDefined();
        }
      });

      it('computes default inputs without error', () => {
        const defaults: Record<string, unknown> = {};
        for (const input of calc.inputs) defaults[input.id] = input.defaultValue;
        const res = calc.calculate(defaults);
        expect(res.error).toBeUndefined();
        if (typeof res.primary.value === 'number') expect(Number.isNaN(res.primary.value)).toBe(false);
      });
    });
  }

  it('worked examples of the deterministic calculators match the engine', () => {
    const bruch = getCalculatorBySlug('dezimal-in-bruch-rechner')!;
    const expected = ['3/4', '1/6', '17/8', '0,83̅', '−2,375'];
    bruch.workedExamples!.forEach((ex, i) => {
      expect(bruch.calculate(ex.inputs!).primary.formattedValue).toBe(expected[i]);
    });

    const pct = getCalculatorBySlug('prozentualer-unterschied-rechner')!;
    const pctExpected = ['+25 %', '−24 %', '+50 %', '10,53 %'];
    pct.workedExamples!.forEach((ex, i) => {
      expect(pct.calculate(ex.inputs!).primary.formattedValue).toBe(pctExpected[i]);
    });

    const tage = getCalculatorBySlug('tage-zwischen-zwei-daten')!;
    const ex3 = tage.workedExamples!.find((e) => e.title?.includes('01.01.2026 bis 30.06.2026'))!;
    expect(tage.calculate(ex3.inputs!).primary.value).toBe(180);
    const ex4 = tage.workedExamples!.find((e) => e.title?.includes('Monatsende'))!;
    expect(sec(tage.calculate(ex4.inputs!), 'monthsBreakdown')?.formattedValue).toBe('1 Monat und 1 Tag');
  });

  it('target inputs expose the merged functionality', () => {
    const tage = getCalculatorBySlug('tage-zwischen-zwei-daten')!;
    expect(tage.inputs.find((i) => i.id === 'targetTime')?.dependsOn).toEqual({ field: 'mode', value: 'until' });
    expect(tage.inputs.find((i) => i.id === 'includeStartDay')).toBeDefined();

    const bruch = getCalculatorBySlug('dezimal-in-bruch-rechner')!;
    expect(bruch.inputs.find((i) => i.id === 'direction')?.options?.map((o) => o.value)).toEqual(['dec2frac', 'frac2dec']);

    const pct = getCalculatorBySlug('prozentualer-unterschied-rechner')!;
    expect(pct.inputs.find((i) => i.id === 'mode')?.defaultValue).toBe('change');
  });

  it('the merged sources stay retired', () => {
    for (const s of ['wochen-zwischen-daten', 'monate-zwischen-daten', 'countdown-rechner', 'geburtstagsrechner', 'bruch-in-dezimal-rechner', 'prozentuale-veraenderung']) {
      expect(RETIRED.has(s), s).toBe(true);
    }
  });
});

describe('calculateCalendarDiff month-end fix (Altersrechner and other callers)', () => {
  it('never returns negative days when the start day does not exist in the previous month', async () => {
    const { calculateCalendarDiff } = await import('@/lib/calculators/dateMath');
    const r = calculateCalendarDiff('2026-01-31', '2026-03-01');
    expect(r).not.toBeNull();
    expect([r!.years, r!.months, r!.days]).toEqual([0, 1, 1]);
    for (const [a, b] of [['2025-03-31', '2025-05-01'], ['2024-01-30', '2024-03-01'], ['2023-12-31', '2024-03-01']]) {
      const x = calculateCalendarDiff(a, b)!;
      expect(x.days).toBeGreaterThanOrEqual(0);
      expect(x.months).toBeGreaterThanOrEqual(0);
    }
  });

  it('keeps all ordinary results unchanged (e.g. 29.02. birthday on 28.02.)', async () => {
    const { calculateCalendarDiff } = await import('@/lib/calculators/dateMath');
    const r = calculateCalendarDiff('2000-02-29', '2001-02-28')!;
    expect([r.years, r.months, r.days]).toEqual([0, 11, 30]);
    const s = calculateCalendarDiff('1990-05-15', '2026-11-05')!;
    expect([s.years, s.months, s.days]).toEqual([36, 5, 21]);
  });
});
