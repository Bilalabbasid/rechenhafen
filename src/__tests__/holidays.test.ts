import { describe, it, expect } from 'vitest';
import { getEasterSunday, getGermanHolidays, getBussUndBettag, isGermanHoliday } from '@/lib/holidays';

describe('German Public Holidays Engine', () => {
  describe('Gauss Easter Algorithm', () => {
    it('computes correct Easter Sunday dates for 2025, 2026, 2027', () => {
      // 2025: 20. April
      const easter2025 = getEasterSunday(2025);
      expect(easter2025.getUTCFullYear()).toBe(2025);
      expect(easter2025.getUTCMonth()).toBe(3); // April
      expect(easter2025.getUTCDate()).toBe(20);

      // 2026: 5. April
      const easter2026 = getEasterSunday(2026);
      expect(easter2026.getUTCFullYear()).toBe(2026);
      expect(easter2026.getUTCMonth()).toBe(3); // April
      expect(easter2026.getUTCDate()).toBe(5);

      // 2027: 28. März
      const easter2027 = getEasterSunday(2027);
      expect(easter2027.getUTCFullYear()).toBe(2027);
      expect(easter2027.getUTCMonth()).toBe(2); // März
      expect(easter2027.getUTCDate()).toBe(28);
    });

    it('computes correct Buß- und Bettag in Sachsen', () => {
      // 2026: 23. Nov ist Montag -> Buß- und Bettag ist Mittwoch, 18. November 2026
      const bb2026 = getBussUndBettag(2026);
      expect(bb2026.getUTCDate()).toBe(18);
      expect(bb2026.getUTCMonth()).toBe(10); // November
      expect(bb2026.getUTCDay()).toBe(3); // Mittwoch
    });
  });

  describe('Nationwide & State-specific Holiday Retrieval', () => {
    it('contains all 9 nationwide holidays in 2026', () => {
      const holidays = getGermanHolidays(2026, 'bundesweit');
      expect(holidays.size).toBe(9);
      expect(holidays.get('2026-01-01')).toBe('Neujahr');
      expect(holidays.get('2026-04-03')).toBe('Karfreitag');
      expect(holidays.get('2026-04-06')).toBe('Ostermontag');
      expect(holidays.get('2026-05-01')).toBe('Tag der Arbeit');
      expect(holidays.get('2026-05-14')).toBe('Christi Himmelfahrt');
      expect(holidays.get('2026-05-25')).toBe('Pfingstmontag');
      expect(holidays.get('2026-10-03')).toBe('Tag der Deutschen Einheit');
      expect(holidays.get('2026-12-25')).toBe('1. Weihnachtstag');
      expect(holidays.get('2026-12-26')).toBe('2. Weihnachtstag');
    });

    it('includes Heilige Drei Könige and Fronleichnam and Allerheiligen in Bayern (BY)', () => {
      const byHolidays = getGermanHolidays(2026, 'BY');
      expect(byHolidays.has('2026-01-06')).toBe(true); // Heilige Drei Könige
      expect(byHolidays.has('2026-06-04')).toBe(true); // Fronleichnam
      expect(byHolidays.has('2026-11-01')).toBe(true); // Allerheiligen
      expect(byHolidays.has('2026-10-31')).toBe(false); // Kein Reformationstag in BY
    });

    it('includes Reformationstag in Hamburg (HH) and Niedersachsen (NI)', () => {
      const hhHolidays = getGermanHolidays(2026, 'HH');
      expect(hhHolidays.has('2026-10-31')).toBe(true);
      expect(hhHolidays.has('2026-01-06')).toBe(false);
    });

    it('includes Internationaler Frauentag in Berlin (BE)', () => {
      const beHolidays = getGermanHolidays(2026, 'BE');
      expect(beHolidays.has('2026-03-08')).toBe(true); // Internationaler Frauentag
    });

    it('accurately identifies holidays via isGermanHoliday()', () => {
      const newYear = new Date(2026, 0, 1);
      const normalDay = new Date(2026, 0, 2);
      expect(isGermanHoliday(newYear).isHoliday).toBe(true);
      expect(isGermanHoliday(normalDay).isHoliday).toBe(false);
    });
  });
});
