import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';
import { isLeapYear, calculateAnniversaryDate, parseDateParts } from '@/lib/calculators/dateMath';

describe('Dienstjubiläum-Rechner Regression & Precision Verification', () => {
  const calc = getCalculatorBySlug('dienstjubilaeum-rechner');

  it('calculator definition is registered and valid', () => {
    expect(calc).toBeDefined();
    expect(calc?.id).toBe('dienstjubilaeum-rechner');
    expect(calc?.slug).toBe('dienstjubilaeum-rechner');
    expect(calc?.category).toBe('datum-zeit');
    expect(calc?.inputs).toHaveLength(1);
    expect(calc?.inputs[0].id).toBe('entryDate');
    expect(calc?.inputs[0].defaultValue).toBe('2016-01-01');
  });

  // 1. STANDARD ANNIVERSARY DATES
  describe('Standard Anniversaries (01.10.2000)', () => {
    it('calculates exact jubilees for 01.10.2000: 10, 25, 40, 50 years', () => {
      const res = calc!.calculate({ entryDate: '2000-10-01' });
      expect(res.error).toBeUndefined();

      // 10 years: 01.10.2010
      const j10 = res.secondary?.find((s) => s.id === 'j10');
      expect(j10?.formattedValue).toBe('01.10.2010');

      // 25 years: 01.10.2025 (primary)
      expect(res.primary.formattedValue).toBe('01.10.2025');

      // 40 years: 01.10.2040
      const j40 = res.secondary?.find((s) => s.id === 'j40');
      expect(j40?.formattedValue).toBe('01.10.2040');

      // 50 years: 01.10.2050
      const j50 = res.secondary?.find((s) => s.id === 'j50');
      expect(j50?.formattedValue).toBe('01.10.2050');

      // Summary text contains all dates
      expect(res.summaryText).toContain('01.10.2010');
      expect(res.summaryText).toContain('01.10.2025');
      expect(res.summaryText).toContain('01.10.2040');
      expect(res.summaryText).toContain('01.10.2050');
    });

    it('supports German date format 01.10.2000 as input', () => {
      const res = calc!.calculate({ entryDate: '01.10.2000' });
      expect(res.error).toBeUndefined();
      expect(res.primary.formattedValue).toBe('01.10.2025');
      const j10 = res.secondary?.find((s) => s.id === 'j10');
      expect(j10?.formattedValue).toBe('01.10.2010');
    });
  });

  // 2. LEAP-DAY ANNIVERSARIES (29.02.2000)
  describe('Leap-Day Anniversaries (29.02.2000)', () => {
    it('calculates 10=28.02.2010, 25=28.02.2025, 40=29.02.2040, 50=28.02.2050 for 29.02.2000', () => {
      const res = calc!.calculate({ entryDate: '2000-02-29' });
      expect(res.error).toBeUndefined();

      // 10 years: 28.02.2010 (2010 is not a leap year)
      const j10 = res.secondary?.find((s) => s.id === 'j10');
      expect(j10?.formattedValue).toBe('28.02.2010');

      // 25 years: 28.02.2025 (2025 is not a leap year)
      expect(res.primary.formattedValue).toBe('28.02.2025');

      // 40 years: 29.02.2040 (2040 is a leap year)
      const j40 = res.secondary?.find((s) => s.id === 'j40');
      expect(j40?.formattedValue).toBe('29.02.2040');

      // 50 years: 28.02.2050 (2050 is not a leap year)
      const j50 = res.secondary?.find((s) => s.id === 'j50');
      expect(j50?.formattedValue).toBe('28.02.2050');
    });

    it('documents the leap-day convention in natural German next to the result and in summary', () => {
      const res = calc!.calculate({ entryDate: '2000-02-29' });
      const expectedNotice = 'Bei einem Eintritt am 29. Februar verwenden wir in Nicht-Schaltjahren den 28. Februar als rechnerischen Jahrestag.';

      // Next to the primary result
      expect(res.primary.helpText).toBe(expectedNotice);

      // In the summary text with contractual/tariff guidance
      expect(res.summaryText).toContain(expectedNotice);
      expect(res.summaryText).toContain('Anerkannte Vordienstzeiten');
      expect(res.summaryText).toContain('tarifliche Regelungen');
    });
  });

  // 3. CENTURY LEAP-YEAR HANDLING
  describe('Century Leap-Year Rules (Gregorian Calendar)', () => {
    it('verifies century years divisible by 400 are leap years (2000, 2400) and others are not (1900, 2100)', () => {
      expect(isLeapYear(2000)).toBe(true);
      expect(isLeapYear(2400)).toBe(true);
      expect(isLeapYear(1900)).toBe(false);
      expect(isLeapYear(2100)).toBe(false);
      expect(isLeapYear(2200)).toBe(false);
      expect(isLeapYear(2300)).toBe(false);
    });

    it('calculates 100-year anniversary from 29.02.2000 to non-leap century year 2100 as 28.02.2100', () => {
      const ann100 = calculateAnniversaryDate(2000, 2, 29, 100);
      expect(ann100.formatted).toBe('28.02.2100');
      expect(ann100.isLeapShiftedTo28).toBe(true);
      expect(ann100.isLeapPreserved).toBe(false);
    });

    it('calculates 40-year anniversary from 29.02.1960 to leap century year 2000 as 29.02.2000', () => {
      const ann40 = calculateAnniversaryDate(1960, 2, 29, 40);
      expect(ann40.formatted).toBe('29.02.2000');
      expect(ann40.isLeapPreserved).toBe(true);
      expect(ann40.isLeapShiftedTo28).toBe(false);
    });
  });

  // 4. EMPTY AND INVALID INPUTS
  describe('Empty and Invalid Inputs Handling', () => {
    it('shows exact German error for empty string input', () => {
      const res = calc!.calculate({ entryDate: '' });
      expect(res.error).toBe('Bitte geben Sie ein Eintrittsdatum ein.');
      expect(res.secondary).toBeUndefined();
      expect(res.summaryText).toBeUndefined();
    });

    it('shows exact German error for whitespace input', () => {
      const res = calc!.calculate({ entryDate: '   ' });
      expect(res.error).toBe('Bitte geben Sie ein Eintrittsdatum ein.');
      expect(res.secondary).toBeUndefined();
    });

    it('shows exact German error for undefined input', () => {
      const res = calc!.calculate({});
      expect(res.error).toBe('Bitte geben Sie ein Eintrittsdatum ein.');
    });

    it('shows exact German error for invalid calendar dates (e.g. 29.02.2025 non-leap)', () => {
      const res = calc!.calculate({ entryDate: '2025-02-29' });
      expect(res.error).toBe('Bitte geben Sie ein gültiges Datum ein.');
      expect(res.secondary).toBeUndefined();
    });

    it('shows exact German error for impossible dates like 31.02.2020', () => {
      const res = calc!.calculate({ entryDate: '31.02.2020' });
      expect(res.error).toBe('Bitte geben Sie ein gültiges Datum ein.');
    });

    it('shows exact German error for non-date string', () => {
      const res = calc!.calculate({ entryDate: 'invalid-string' });
      expect(res.error).toBe('Bitte geben Sie ein gültiges Datum ein.');
    });
  });

  // 5. CLEARING AND RESET
  describe('Clearing and Reset Flow', () => {
    it('clearing a previously valid input returns error and does NOT retain old results', () => {
      // 1. Initial valid calculation
      const validRes = calc!.calculate({ entryDate: '2000-02-29' });
      expect(validRes.error).toBeUndefined();
      expect(validRes.primary.formattedValue).toBe('28.02.2025');

      // 2. User clears the input
      const clearedRes = calc!.calculate({ entryDate: '' });
      expect(clearedRes.error).toBe('Bitte geben Sie ein Eintrittsdatum ein.');
      expect(clearedRes.primary.formattedValue).toBe('-');
      expect(clearedRes.secondary).toBeUndefined();
      expect(clearedRes.summaryText).toBeUndefined();
    });

    it('reset restores default date 2016-01-01 and recalculates correctly', () => {
      const defaultDate = calc!.inputs[0].defaultValue;
      expect(defaultDate).toBe('2016-01-01');

      const resetRes = calc!.calculate({ entryDate: defaultDate });
      expect(resetRes.error).toBeUndefined();
      expect(resetRes.primary.formattedValue).toBe('01.01.2041');
      const j10 = resetRes.secondary?.find((s) => s.id === 'j10');
      expect(j10?.formattedValue).toBe('01.01.2026');
    });
  });

  // 6. COPY OUTPUT CONSISTENCY
  describe('Copy Output Consistency', () => {
    it('copied text string matches displayed dates exactly', () => {
      const res = calc!.calculate({ entryDate: '2000-02-29' });
      const name = calc!.name;

      // Recreate the exact copy format used by CalculatorRunner.handleCopyResult
      const primaryStr = `${res.primary.label}: ${res.primary.formattedValue}`;
      let textToCopy = `${name}\n${primaryStr}`;
      const secondaries = res.secondary!;
      const secLines = secondaries.map((s) => `${s.label}: ${s.formattedValue}`);
      textToCopy += `\n\nDetails:\n${secLines.join('\n')}\n\nBerechnet auf RechenHafen.de`;

      expect(textToCopy).toContain('25-jähriges Dienstjubiläum: 28.02.2025');
      expect(textToCopy).toContain('10-jähriges Jubiläum: 28.02.2010');
      expect(textToCopy).toContain('40-jähriges Jubiläum: 29.02.2040');
      expect(textToCopy).toContain('50-jähriges Jubiläum: 28.02.2050');
      expect(textToCopy).not.toContain('29.02.2010');
      expect(textToCopy).not.toContain('29.02.2025');
      expect(textToCopy).not.toContain('29.02.2050');
    });
  });

  // 7. TIMEZONE INDEPENDENCE
  describe('Timezone Independence', () => {
    it('produces identical output regardless of string input format and timezone environment', () => {
      const isoRes = calc!.calculate({ entryDate: '2000-02-29' });
      const deRes = calc!.calculate({ entryDate: '29.02.2000' });

      expect(isoRes.primary.formattedValue).toBe(deRes.primary.formattedValue);
      expect(isoRes.secondary?.map((s) => s.formattedValue)).toEqual(
        deRes.secondary?.map((s) => s.formattedValue)
      );

      // Direct integer parse check
      const parts = parseDateParts('2000-02-29');
      expect(parts).toEqual({ year: 2000, month: 2, day: 29 });
    });
  });
});
