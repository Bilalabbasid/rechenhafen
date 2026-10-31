import { describe, it, expect } from 'vitest';
import {
  calculateLengthConversion,
  calculateZollCmConversion,
  calculateMilesKmConversion,
  calculateTimeConversion,
  parseUnitNumber,
  formatAdaptiveUnit,
  formatHumanReadableDuration,
} from '@/lib/calculators/einheiten';
import { getCalculatorBySlug } from '@/data/calculators';

describe('Units Converter Cluster Regression Tests', () => {
  describe('1. Parser & Utility Helpers', () => {
    it('parses integers, decimal dots, and German decimal commas correctly', () => {
      expect(parseUnitNumber(10)).toBe(10);
      expect(parseUnitNumber('15.6')).toBe(15.6);
      expect(parseUnitNumber('15,6')).toBe(15.6);
      expect(parseUnitNumber('  42,195  ')).toBe(42.195);
      expect(parseUnitNumber('1.234,5')).toBe(1234.5);
    });

    it('rejects invalid or empty inputs without fallback to 1', () => {
      expect(parseUnitNumber('')).toBeNull();
      expect(parseUnitNumber('   ')).toBeNull();
      expect(parseUnitNumber(null)).toBeNull();
      expect(parseUnitNumber(undefined)).toBeNull();
      expect(parseUnitNumber('abc')).toBeNull();
      expect(parseUnitNumber(NaN)).toBeNull();
    });

    it('formats human readable composite duration correctly with German grammar', () => {
      // 90061s = 1 day (86400s), 1 hour (3600s), 1 minute (60s), 1 second (1s)
      expect(formatHumanReadableDuration(90061)).toBe('1 Tag, 1 Stunde, 1 Minute und 1 Sekunde');
      // 2 days, 3 hours, 4 minutes, 5 seconds
      expect(formatHumanReadableDuration(2 * 86400 + 3 * 3600 + 4 * 60 + 5)).toBe(
        '2 Tage, 3 Stunden, 4 Minuten und 5 Sekunden'
      );
      // 0 seconds
      expect(formatHumanReadableDuration(0)).toBe('0 Sekunden');
    });

    it('formats adaptive units cleanly without trailing zeroes', () => {
      expect(formatAdaptiveUnit(2.54, 4)).toBe('2,54');
      expect(formatAdaptiveUnit(10.0, 4)).toBe('10');
      expect(formatAdaptiveUnit(16.09344, 6)).toBe('16,09344');
    });
  });

  describe('2. Zoll in cm Rechner (/rechner/zoll-in-cm-rechner/)', () => {
    it('calculates 1 in = exactly 2.54 cm', () => {
      const res = calculateZollCmConversion({ inches: 1, lastEdited: 'inches' });
      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(2.54);
      expect(res.primary.formattedValue).toContain('2,54 cm');
    });

    it('calculates 10 in = 25.4 cm', () => {
      const res = calculateZollCmConversion({ inches: 10, lastEdited: 'inches' });
      expect(res.primary.value).toBe(25.4);
      expect(res.primary.formattedValue).toContain('25,4 cm');
    });

    it('calculates 55 in = 139.7 cm', () => {
      const res = calculateZollCmConversion({ inches: 55, lastEdited: 'inches' });
      expect(res.primary.value).toBe(139.7);
      expect(res.primary.formattedValue).toContain('139,7 cm');
      // Check 16:9 screen dimensions: 55 * 16 / sqrt(337) ≈ 121.76 cm, 55 * 9 / sqrt(337) ≈ 68.49 cm
      const widthSec = res.secondary?.find((s) => s.id === 'width16_9');
      const heightSec = res.secondary?.find((s) => s.id === 'height16_9');
      expect(widthSec?.value).toBeCloseTo(121.76, 1);
      expect(heightSec?.value).toBeCloseTo(68.49, 1);
    });

    it('calculates 65 in = 165.1 cm', () => {
      const res = calculateZollCmConversion({ inches: 65, lastEdited: 'inches' });
      expect(res.primary.value).toBe(165.1);
      expect(res.primary.formattedValue).toContain('165,1 cm');
    });

    it('calculates 100 cm ≈ 39.37007874 in (reverse)', () => {
      const res = calculateZollCmConversion({ cm: 100, lastEdited: 'cm' });
      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBeCloseTo(39.37007874, 5);
      expect(res.primary.formattedValue).toContain('39,3701 in');
    });

    it('calculates 2.54 cm = 1 in', () => {
      const res = calculateZollCmConversion({ cm: 2.54, lastEdited: 'cm' });
      expect(res.primary.value).toBeCloseTo(1.0, 6);
      expect(res.primary.formattedValue).toContain('1 in');
    });

    it('handles 0 in = 0 cm', () => {
      const res = calculateZollCmConversion({ inches: 0, lastEdited: 'inches' });
      expect(res.primary.value).toBe(0);
      expect(res.primary.formattedValue).toContain('0 cm');
    });

    it('handles German decimal comma: 15,6 in = 39.624 cm', () => {
      const res = calculateZollCmConversion({ inches: '15,6', lastEdited: 'inches' });
      expect(res.primary.value).toBeCloseTo(39.624, 3);
      expect(res.primary.formattedValue).toContain('39,624 cm');
    });

    it('returns error on empty or invalid inputs', () => {
      const emptyRes = calculateZollCmConversion({ inches: '', lastEdited: 'inches' });
      expect(emptyRes.error).toBeDefined();
      expect(emptyRes.primary.formattedValue).toBe('-');

      const invalidCm = calculateZollCmConversion({ cm: 'invalid', lastEdited: 'cm' });
      expect(invalidCm.error).toBeDefined();
      expect(invalidCm.primary.formattedValue).toBe('-');
    });
  });

  describe('3. Meilen-Kilometer Rechner (/rechner/meilen-km-umrechner/)', () => {
    it('calculates 1 mi = exactly 1.609344 km', () => {
      const res = calculateMilesKmConversion({ miles: 1, lastEdited: 'miles' });
      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(1.609344);
      expect(res.primary.formattedValue).toContain('1,609344 km');
    });

    it('calculates 10 mi = 16.09344 km', () => {
      const res = calculateMilesKmConversion({ miles: 10, lastEdited: 'miles' });
      expect(res.primary.value).toBe(16.09344);
      expect(res.primary.formattedValue).toContain('16,09344 km');
    });

    it('calculates 100 mi = 160.9344 km', () => {
      const res = calculateMilesKmConversion({ miles: 100, lastEdited: 'miles' });
      expect(res.primary.value).toBe(160.9344);
      expect(res.primary.formattedValue).toContain('160,9344 km');
    });

    it('calculates 1 km ≈ 0.6213711922 mi', () => {
      const res = calculateMilesKmConversion({ km: 1, lastEdited: 'km' });
      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBeCloseTo(0.6213711922, 6);
      expect(res.primary.formattedValue).toContain('0,621371 mi');
    });

    it('calculates 5 km ≈ 3.1068559612 mi', () => {
      const res = calculateMilesKmConversion({ km: 5, lastEdited: 'km' });
      expect(res.primary.value).toBeCloseTo(3.1068559612, 6);
    });

    it('calculates 100 km ≈ 62.1371192237 mi', () => {
      const res = calculateMilesKmConversion({ km: 100, lastEdited: 'km' });
      expect(res.primary.value).toBeCloseTo(62.1371192237, 6);
    });

    it('handles 0 mi = 0 km', () => {
      const res = calculateMilesKmConversion({ miles: 0, lastEdited: 'miles' });
      expect(res.primary.value).toBe(0);
      expect(res.primary.formattedValue).toContain('0 km');
    });

    it('handles German decimal comma: 13,1 mi (half marathon approx)', () => {
      const res = calculateMilesKmConversion({ miles: '13,1', lastEdited: 'miles' });
      expect(res.primary.value).toBeCloseTo(21.0824064, 4);
    });

    it('computes official marathon distance (42.195 km) accurately without claiming exactly 26.2 mi', () => {
      const res = calculateMilesKmConversion({ km: 42.195, lastEdited: 'km' });
      // 42.195 / 1.609344 = 26.218757...
      expect(res.primary.value).toBeCloseTo(26.218757, 4);
      expect(res.primary.value).not.toBe(26.2);
    });

    it('includes nautical miles (NM = 1852 m) as secondary comparison', () => {
      const res = calculateMilesKmConversion({ miles: 10, lastEdited: 'miles' });
      // 10 mi = 16093.44 m; NM = 16093.44 / 1852 ≈ 8.68976 NM
      const nmSec = res.secondary?.find((s) => s.id === 'nauticalMiles');
      expect(nmSec?.value).toBeCloseTo(8.68976, 3);
    });

    it('returns error on empty or invalid inputs', () => {
      const emptyRes = calculateMilesKmConversion({ miles: '', lastEdited: 'miles' });
      expect(emptyRes.error).toBeDefined();
      expect(emptyRes.primary.formattedValue).toBe('-');
    });
  });

  describe('4. Zeit Umrechner (/rechner/zeit-umrechner/)', () => {
    it('converts 60 s = 1 min', () => {
      const res = calculateTimeConversion({ value: 60, fromUnit: 'seconds', toUnit: 'minutes' });
      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(1);
      expect(res.primary.formattedValue).toBe('1 min');
    });

    it('converts 3600 s = 1 h', () => {
      const res = calculateTimeConversion({ value: 3600, fromUnit: 'seconds', toUnit: 'hours' });
      expect(res.primary.value).toBe(1);
      expect(res.primary.formattedValue).toBe('1 h');
    });

    it('converts 86400 s = 1 d', () => {
      const res = calculateTimeConversion({ value: 86400, fromUnit: 'seconds', toUnit: 'days' });
      expect(res.primary.value).toBe(1);
      expect(res.primary.formattedValue).toBe('1 Tage');
    });

    it('converts 604800 s = 1 w', () => {
      const res = calculateTimeConversion({ value: 604800, fromUnit: 'seconds', toUnit: 'weeks' });
      expect(res.primary.value).toBe(1);
      expect(res.primary.formattedValue).toBe('1 Wochen');
    });

    it('converts 1 scientific conversion year (365.25 d) = exactly 31,557,600 s', () => {
      const res = calculateTimeConversion({ value: 1, fromUnit: 'years', toUnit: 'seconds' });
      expect(res.primary.value).toBe(31557600);
      expect(res.primary.formattedValue).toContain('31.557.600');

      const resDays = calculateTimeConversion({ value: 1, fromUnit: 'years', toUnit: 'days' });
      expect(resDays.primary.value).toBe(365.25);
    });

    it('converts 365.25 d = 1 year', () => {
      const res = calculateTimeConversion({ value: 365.25, fromUnit: 'days', toUnit: 'years' });
      expect(res.primary.value).toBe(1);
      expect(res.primary.formattedValue).toBe('1 Jahre');
    });

    it('handles German decimal comma: 1,5 h = 90 min = 5400 s', () => {
      const res = calculateTimeConversion({ value: '1,5', fromUnit: 'hours', toUnit: 'minutes' });
      expect(res.primary.value).toBe(90);
      expect(res.primary.formattedValue).toBe('90 min');

      const secOutput = res.secondary?.find((s) => s.id === 'seconds');
      expect(secOutput?.value).toBe(5400);
    });

    it('generates accurate composite human readable string for 90061 s', () => {
      const res = calculateTimeConversion({ value: 90061, fromUnit: 'seconds', toUnit: 'hours' });
      const humanSec = res.secondary?.find((s) => s.id === 'human');
      expect(humanSec?.formattedValue).toBe('1 Tag, 1 Stunde, 1 Minute und 1 Sekunde');
    });

    it('returns error on empty or invalid inputs', () => {
      const emptyRes = calculateTimeConversion({ value: '', fromUnit: 'hours', toUnit: 'minutes' });
      expect(emptyRes.error).toBeDefined();
      expect(emptyRes.primary.formattedValue).toBe('-');
    });
  });

  describe('5. Generic Längenumrechner (/rechner/laengen-umrechner/)', () => {
    it('supports Seemeilen (NM = 1852 m)', () => {
      const res = calculateLengthConversion({ value: 1, fromUnit: 'nm', toUnit: 'km' });
      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(1.852);
      expect(res.primary.formattedValue).toContain('1,852 km');
    });

    it('handles all cross-conversion round trips accurately', () => {
      // cm <-> in
      const inFromCm = calculateLengthConversion({ value: 2.54, fromUnit: 'cm', toUnit: 'in' });
      expect(inFromCm.primary.value).toBeCloseTo(1, 6);

      const cmFromIn = calculateLengthConversion({ value: 1, fromUnit: 'in', toUnit: 'cm' });
      expect(cmFromIn.primary.value).toBe(2.54);

      // km <-> mi
      const miFromKm = calculateLengthConversion({ value: 1.609344, fromUnit: 'km', toUnit: 'mi' });
      expect(miFromKm.primary.value).toBeCloseTo(1, 6);

      const kmFromMi = calculateLengthConversion({ value: 1, fromUnit: 'mi', toUnit: 'km' });
      expect(kmFromMi.primary.value).toBe(1.609344);

      // km <-> in
      const inFromKm = calculateLengthConversion({ value: 1, fromUnit: 'km', toUnit: 'in' });
      // 1000 / 0.0254 ≈ 39370.07874
      expect(inFromKm.primary.value).toBeCloseTo(39370.07874, 3);

      // in <-> mi (1 mi = 63360 in)
      const inFromMi = calculateLengthConversion({ value: 1, fromUnit: 'mi', toUnit: 'in' });
      expect(inFromMi.primary.value).toBeCloseTo(63360, 5);
    });

    it('returns error on invalid input without falling back to 1', () => {
      const res = calculateLengthConversion({ value: 'invalid', fromUnit: 'm', toUnit: 'cm' });
      expect(res.error).toBeDefined();
      expect(res.primary.formattedValue).toBe('-');
    });
  });

  describe('6. Catalog Definitions & Metadata Integrity', () => {
    it('has all 4 calculators properly defined and discoverable in catalog', () => {
      const laengen = getCalculatorBySlug('laengen-umrechner');
      const zoll = getCalculatorBySlug('zoll-in-cm-rechner');
      const meilen = getCalculatorBySlug('meilen-km-umrechner');
      const zeit = getCalculatorBySlug('zeit-umrechner');

      expect(laengen).toBeDefined();
      expect(zoll).toBeDefined();
      expect(meilen).toBeDefined();
      expect(zeit).toBeDefined();
    });

    it('ensures zeit-umrechner has years in its input options matching its content claims', () => {
      const zeit = getCalculatorBySlug('zeit-umrechner')!;
      const fromOptions = zeit.inputs.find((i) => i.id === 'fromUnit')?.options?.map((o) => o.value);
      const toOptions = zeit.inputs.find((i) => i.id === 'toUnit')?.options?.map((o) => o.value);

      expect(fromOptions).toContain('years');
      expect(toOptions).toContain('years');
    });

    it('ensures laengen-umrechner has Seemeilen (nm) in both fromUnit and toUnit', () => {
      const laengen = getCalculatorBySlug('laengen-umrechner')!;
      const fromOptions = laengen.inputs.find((i) => i.id === 'fromUnit')?.options?.map((o) => o.value);
      const toOptions = laengen.inputs.find((i) => i.id === 'toUnit')?.options?.map((o) => o.value);

      expect(fromOptions).toContain('nm');
      expect(toOptions).toContain('nm');
    });

    it('ensures meilen-km-umrechner cross-references geschwindigkeit-umrechner and laengen-umrechner', () => {
      const meilen = getCalculatorBySlug('meilen-km-umrechner')!;
      expect(meilen.relatedSlugs).toContain('laengen-umrechner');
      expect(meilen.relatedSlugs).toContain('geschwindigkeit-umrechner');
    });
  });
});
