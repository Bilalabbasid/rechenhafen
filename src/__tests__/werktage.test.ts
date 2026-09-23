import { describe, it, expect } from 'vitest';
import { calculateWorkdaysAndHolidays, calculateWorkdays } from '@/lib/calculators/datumZeit';

describe('Werktage- & Arbeitstage-Rechner Engine', () => {
  describe('1. Gesetzliche Werktage nach BGB (§ 3 BUrlG, Mo–Sa)', () => {
    it('calculates 24 Werktage for February 2026 (28 calendar days, 4 Sundays)', () => {
      const res = calculateWorkdaysAndHolidays({
        startDate: '2026-02-01',
        endDate: '2026-02-28',
        workweek: 'mo-sa',
        excludeHolidays: true,
      });

      expect(res.primary.value).toBe(24);
      expect(res.primary.label).toBe('Gesetzliche Werktage (Mo–Sa)');
      expect(res.secondary?.find((s) => s.id === 'totalDays')?.value).toBe(28);
      expect(res.secondary?.find((s) => s.id === 'sundays')?.value).toBe(4);
      expect(res.secondary?.find((s) => s.id === 'saturdays')?.value).toBe(4);
    });
  });

  describe('2. Arbeitstage (Mo–Fr) & Bundesland-Feiertagsberechnung', () => {
    it('computes 21 Arbeitstage in January 2026 bundesweit (Neujahr deducted)', () => {
      const res = calculateWorkdaysAndHolidays({
        startDate: '2026-01-01',
        endDate: '2026-01-31',
        workweek: 'mo-fr',
        excludeHolidays: true,
        federalState: 'bundesweit',
      });

      // 31 Kalendertage: 22 Mo-Fr Tage - 1 Feiertag (Neujahr Do) = 21 Arbeitstage
      expect(res.primary.value).toBe(21);
      expect(res.primary.label).toBe('Arbeitstage (Mo–Fr)');
      expect(res.secondary?.find((s) => s.id === 'holidaysOnWorkdays')?.value).toBe(1);
    });

    it('computes 20 Arbeitstage in Bayern (BY) in January 2026 (Heilige Drei Könige also deducted)', () => {
      const res = calculateWorkdaysAndHolidays({
        startDate: '2026-01-01',
        endDate: '2026-01-31',
        workweek: 'mo-fr',
        excludeHolidays: true,
        federalState: 'BY',
      });

      // In Bayern sind 01.01. (Do) und 06.01. (Di) Feiertage -> 22 - 2 = 20 Arbeitstage
      expect(res.primary.value).toBe(20);
      expect(res.secondary?.find((s) => s.id === 'holidaysOnWorkdays')?.value).toBe(2);
    });

    it('computes 21 Arbeitstage in Berlin (BE) in January 2026 (Hl. Drei Könige is no holiday in BE)', () => {
      const res = calculateWorkdaysAndHolidays({
        startDate: '2026-01-01',
        endDate: '2026-01-31',
        workweek: 'mo-fr',
        excludeHolidays: true,
        federalState: 'BE',
      });

      expect(res.primary.value).toBe(21);
      expect(res.secondary?.find((s) => s.id === 'holidaysOnWorkdays')?.value).toBe(1);
    });
  });

  describe('3. Crucial Edge Case: No Double Subtraction of Weekend Holidays', () => {
    it('does NOT double-subtract a Saturday holiday under Mo–Fr workweek', () => {
      // 03.10.2026 (Tag der Deutschen Einheit) fällt auf einen Samstag!
      // Oktober 2026: 31 Tage, 22 Montage-Freitage, 5 Samstage, 4 Sonntage.
      const resMoFr = calculateWorkdaysAndHolidays({
        startDate: '2026-10-01',
        endDate: '2026-10-31',
        workweek: 'mo-fr',
        excludeHolidays: true,
        federalState: 'bundesweit',
      });

      // Da der 03.10. auf einen Samstag fällt und Samstage bei Mo–Fr ohnehin frei sind,
      // darf er die 22 Arbeitstage NICHT auf 21 reduzieren!
      expect(resMoFr.primary.value).toBe(22);
      expect(resMoFr.secondary?.find((s) => s.id === 'holidaysOnWorkdays')?.value).toBe(0);
      expect(resMoFr.secondary?.find((s) => s.id === 'holidaysOnFreeDays')?.value).toBe(1);
    });

    it('DOES subtract Saturday holiday under Mo–Sa Werktage workweek', () => {
      // Bei Mo–Sa Werktagen ist der Samstag regulär ein Werktag -> Der 03.10.2026 mindert das Ergebnis!
      const resMoSa = calculateWorkdaysAndHolidays({
        startDate: '2026-10-01',
        endDate: '2026-10-31',
        workweek: 'mo-sa',
        excludeHolidays: true,
        federalState: 'bundesweit',
      });

      // 22 Mo-Fr + 5 Sa = 27 Tage - 1 Feiertag (03.10. Sa) = 26 Werktage
      expect(resMoSa.primary.value).toBe(26);
      expect(resMoSa.secondary?.find((s) => s.id === 'holidaysOnWorkdays')?.value).toBe(1);
      expect(resMoSa.secondary?.find((s) => s.id === 'holidaysOnFreeDays')).toBeUndefined();
    });
  });

  describe('4. Boundary Inclusions & Custom Workweeks', () => {
    it('handles boundary inclusion options correctly', () => {
      // 01.06.2026 (Mo) bis 05.06.2026 (Fr)
      const resBoth = calculateWorkdaysAndHolidays({
        startDate: '2026-06-01',
        endDate: '2026-06-05',
        workweek: 'mo-fr',
        includeBoundary: 'both',
        excludeHolidays: false,
      });
      expect(resBoth.primary.value).toBe(5);

      const resStartOnly = calculateWorkdaysAndHolidays({
        startDate: '2026-06-01',
        endDate: '2026-06-05',
        workweek: 'mo-fr',
        includeBoundary: 'startOnly',
        excludeHolidays: false,
      });
      expect(resStartOnly.primary.value).toBe(4);

      const resNeither = calculateWorkdaysAndHolidays({
        startDate: '2026-06-01',
        endDate: '2026-06-05',
        workweek: 'mo-fr',
        includeBoundary: 'neither',
        excludeHolidays: false,
      });
      expect(resNeither.primary.value).toBe(3);
    });

    it('calculates custom 3-day workweek (Mo, Mi, Fr)', () => {
      // 01.06.2026 (Mo) bis 07.06.2026 (So)
      const resCustom = calculateWorkdaysAndHolidays({
        startDate: '2026-06-01',
        endDate: '2026-06-07',
        workweek: 'custom',
        includeMonday: true,
        includeTuesday: false,
        includeWednesday: true,
        includeThursday: false,
        includeFriday: true,
        includeSaturday: false,
        includeSunday: false,
        excludeHolidays: false,
      });

      expect(resCustom.primary.value).toBe(3);
      expect(resCustom.primary.label).toBe('Berechnete Tage');
    });
  });
});
