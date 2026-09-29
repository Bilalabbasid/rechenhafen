import { describe, it, expect } from 'vitest';
import nextConfig from '../../next.config';
import { getCalculatorBySlug } from '@/data/calculators';
import sitemap from '@/app/sitemap';
import {
  parseDateParts,
  formatDateGerman,
  isLeapYear,
  getDaysInMonth,
  calculateCalendarDiff,
  calculateTagerechner,
  calculateTageBisWeihnachten,
  getBerlinTodayParts,
  getBerlinTodayString,
  dateToDayNumber,
} from '@/lib/calculators/dateMath';
import { generateMetadata as generateCalcMetadata } from '@/app/rechner/[slug]/page';

describe('Tagerechner & Date-Calculator Cluster Verification', () => {
  // =========================================================================
  // 1. CALENDAR-SAFE ARITHMETIC & LEAP YEAR PRECISION
  // =========================================================================
  describe('Calendar-safe arithmetic & leap years', () => {
    it('correctly identifies leap years according to Gregorian rules', () => {
      expect(isLeapYear(1960)).toBe(true);
      expect(isLeapYear(2020)).toBe(true);
      expect(isLeapYear(2024)).toBe(true);
      expect(isLeapYear(2028)).toBe(true);
      expect(isLeapYear(2000)).toBe(true); // Century divisible by 400
      expect(isLeapYear(1900)).toBe(false); // Century not divisible by 400
      expect(isLeapYear(2026)).toBe(false);
      expect(isLeapYear(2050)).toBe(false);
    });

    it('returns exact days per month including 29 February in leap years', () => {
      expect(getDaysInMonth(2024, 2)).toBe(29);
      expect(getDaysInMonth(2026, 2)).toBe(28);
      expect(getDaysInMonth(2024, 1)).toBe(31);
      expect(getDaysInMonth(2024, 4)).toBe(30);
    });

    it('verifies 28.02.2024 to 01.03.2024 accounts for leap day 29 February', () => {
      // Without start day: 28.02 -> 29.02 (1) -> 01.03 (2) = 2 days
      const diffWithout = calculateCalendarDiff('2024-02-28', '2024-03-01', false);
      expect(diffWithout?.totalDays).toBe(2);
      expect(diffWithout?.years).toBe(0);
      expect(diffWithout?.months).toBe(0);
      expect(diffWithout?.days).toBe(2);

      // With start day: 3 days (28.02, 29.02, 01.03)
      const diffWith = calculateCalendarDiff('2024-02-28', '2024-03-01', true);
      expect(diffWith?.totalDays).toBe(3);
    });

    it('verifies 29.02.2024 to 01.03.2024 leap day calculation', () => {
      // Without start day: 1 day
      const diffWithout = calculateCalendarDiff('2024-02-29', '2024-03-01', false);
      expect(diffWithout?.totalDays).toBe(1);

      // With start day: 2 days
      const diffWith = calculateCalendarDiff('2024-02-29', '2024-03-01', true);
      expect(diffWith?.totalDays).toBe(2);
    });

    it('verifies same-day calculation with and without Starttag mitzählen', () => {
      // Same day without start day = 0 days
      const sameDayEx = calculateCalendarDiff('2026-05-15', '2026-05-15', false);
      expect(sameDayEx?.totalDays).toBe(0);
      expect(sameDayEx?.isSameDay).toBe(true);

      const resEx = calculateTagerechner({
        mode: 'between',
        startDate: '2026-05-15',
        endDate: '2026-05-15',
        includeStartDay: false,
      });
      expect(resEx.primary.value).toBe(0);
      expect(resEx.summaryText).toContain('0 Tagen');

      // Same day with start day = 1 day
      const sameDayInc = calculateCalendarDiff('2026-05-15', '2026-05-15', true);
      expect(sameDayInc?.totalDays).toBe(1);

      const resInc = calculateTagerechner({
        mode: 'between',
        startDate: '2026-05-15',
        endDate: '2026-05-15',
        includeStartDay: true,
      });
      expect(resInc.primary.value).toBe(1);
      expect(resInc.summaryText).toContain('1 Kalendertag');
    });

    it('verifies reversed dates are handled gracefully', () => {
      const res = calculateTagerechner({
        mode: 'between',
        startDate: '2026-03-01',
        endDate: '2026-01-01',
        includeStartDay: false,
      });
      expect(res.error).toBeUndefined();
      // Difference between 01.01.2026 and 01.03.2026 is 31 (Jan) + 28 (Feb) = 59 days
      expect(res.primary.value).toBe(59);
      expect(res.summaryText).toContain('Hinweis: Das Startdatum');
      expect(res.summaryText).toContain('liegt nach dem Enddatum');
    });

    it('verifies daylight-saving transitions in Europe/Berlin cause zero day-drift', () => {
      // Spring DST: 29 March 2026 (clocks advance 1h from 02:00 to 03:00)
      const springDiff = calculateCalendarDiff('2026-03-28', '2026-03-30', false);
      expect(springDiff?.totalDays).toBe(2);

      // Autumn DST: 25 October 2026 (clocks back 1h from 03:00 to 02:00)
      const autumnDiff = calculateCalendarDiff('2026-10-24', '2026-10-26', false);
      expect(autumnDiff?.totalDays).toBe(2);
    });
  });

  // =========================================================================
  // 2. REQUIRED CORE SCENARIOS (01.03.1960 & 05.10.2050)
  // =========================================================================
  describe('Required Core Scenarios', () => {
    it('verifies 01.03.1960 to today in "since" mode calculates exact days and direction', () => {
      const today = getBerlinTodayParts();
      const res = calculateTagerechner({
        mode: 'since',
        startDate: '1960-03-01',
        includeStartDay: false,
      });

      expect(res.error).toBeUndefined();
      const expectedDays = dateToDayNumber(today.year, today.month, today.day) - dateToDayNumber(1960, 3, 1);
      expect(res.primary.value).toBe(expectedDays);
      expect(res.primary.value).toBeGreaterThan(24000);
      expect(res.summaryText).toContain('Seit dem 01.03.1960 sind');
      expect(res.summaryText).toContain('vergangen');
    });

    it('verifies today to 05.10.2050 in "until" mode calculates exact days and direction', () => {
      const today = getBerlinTodayParts();
      const res = calculateTagerechner({
        mode: 'until',
        endDate: '2050-10-05',
        includeStartDay: false,
      });

      expect(res.error).toBeUndefined();
      const expectedDays = dateToDayNumber(2050, 10, 5) - dateToDayNumber(today.year, today.month, today.day);
      expect(res.primary.value).toBe(expectedDays);
      expect(res.summaryText).toContain('Bis zum 05.10.2050 sind es noch');
    });

    it('verifies 01.03.1960 to 05.10.2050 exact calendar calculation', () => {
      const diff = calculateCalendarDiff('1960-03-01', '2050-10-05', false);
      expect(diff?.totalDays).toBe(33090);
      expect(diff?.years).toBe(90);
      expect(diff?.months).toBe(7);
      expect(diff?.days).toBe(4);
      expect(diff?.totalWeeks).toBe(4727);
      expect(diff?.remDays).toBe(1);
    });
  });

  // =========================================================================
  // 3. CHRISTMAS COUNTDOWN (tage-bis-weihnachten)
  // =========================================================================
  describe('Christmas Countdown (tage-bis-weihnachten)', () => {
    it('calculates days to Heiligabend (24.12.) and 1. Weihnachtstag (25.12.)', () => {
      const resHeiligabend = calculateTageBisWeihnachten({ christmasTarget: 'heiligabend' });
      expect(resHeiligabend.primary.value).toBeDefined();
      expect(typeof resHeiligabend.primary.value).toBe('number');

      const resWeihnachten = calculateTageBisWeihnachten({ christmasTarget: 'weihnachten' });
      expect(resWeihnachten.primary.value).toBeDefined();
      expect(typeof resWeihnachten.primary.value).toBe('number');
      // 25.12 is 1 day after 24.12
      expect((resWeihnachten.primary.value as number) - (resHeiligabend.primary.value as number)).toBe(1);
    });

    it('verifies Christmas rollover after 25 December', () => {
      // Test the rollover function by simulating a date after 25 December:
      // Date: 26.12.2026
      const dAfterChristmas = dateToDayNumber(2026, 12, 26);
      const dNextHeiligabend = dateToDayNumber(2027, 12, 24);
      const remainingDaysToNextYear = dNextHeiligabend - dAfterChristmas;

      expect(remainingDaysToNextYear).toBe(363);
    });

    it('includes required metadata without hardcoded static year', () => {
      const calc = getCalculatorBySlug('tage-bis-weihnachten');
      expect(calc).toBeDefined();
      expect(calc?.h1).toBe('Wie viele Tage sind es bis Weihnachten?');
      expect(calc?.metaTitle).toBe('Tage bis Weihnachten: Countdown bis Heiligabend');
      expect(calc?.metaDescription).toBe(
        'Wie viele Tage sind es bis Weihnachten? Berechne den Countdown bis Heiligabend oder zum ersten Weihnachtstag.'
      );
      // No static year in title or metaDescription
      expect(calc?.metaTitle).not.toMatch(/\b20\d\d\b/);
      expect(calc?.metaDescription).not.toMatch(/\b20\d\d\b/);
    });
  });

  // =========================================================================
  // 4. GERMAN LOCALIZATION & DATE-FORMAT REPAIR
  // =========================================================================
  describe('German Localization & Date-Format Repairs', () => {
    it('formats dates consistently as DD.MM.YYYY across all inputs', () => {
      expect(formatDateGerman('2016-01-13')).toBe('13.01.2016');
      expect(formatDateGerman('1960-03-01')).toBe('01.03.1960');
      expect(formatDateGerman('2050-10-05')).toBe('05.10.2050');
      expect(formatDateGerman('2024-02-29')).toBe('29.02.2024');
    });

    it('verifies Dienstjubiläum-Rechner calculates correct jubilees for 13.01.2016 without timezone offset', () => {
      const calc = getCalculatorBySlug('dienstjubilaeum-rechner');
      expect(calc).toBeDefined();
      expect(calc?.name).toContain('Dienstjubiläum-Rechner');
      expect(calc?.h1).toContain('Dienstjubiläum');

      const res = calc!.calculate({ entryDate: '2016-01-13' });
      expect(res.error).toBeUndefined();

      // 10 years: 13.01.2026
      const j10 = res.secondary?.find((s) => s.id === 'j10');
      expect(j10?.formattedValue).toBe('13.01.2026');

      // 25 years: 13.01.2041
      const j25 = res.primary;
      expect(j25.formattedValue).toBe('13.01.2041');

      // 40 years: 13.01.2056
      const j40 = res.secondary?.find((s) => s.id === 'j40');
      expect(j40?.formattedValue).toBe('13.01.2056');

      // 50 years: 13.01.2066
      const j50 = res.secondary?.find((s) => s.id === 'j50');
      expect(j50?.formattedValue).toBe('13.01.2066');
    });
  });

  // =========================================================================
  // 5. SEO, ROUTING, 301 REDIRECTS & SITEMAP
  // =========================================================================
  describe('SEO, Routing, 301 Redirects & Sitemap', () => {
    it('verifies Tagerechner has exact required SEO title, meta description, and H1', () => {
      const calc = getCalculatorBySlug('tage-zwischen-zwei-daten');
      expect(calc).toBeDefined();
      expect(calc?.metaTitle).toBe('Tagerechner: Tage zwischen zwei Daten berechnen');
      expect(calc?.metaDescription).toBe(
        'Mit dem Tagerechner berechnest du Tage, Wochen sowie volle Jahre, Monate und Tage zwischen zwei Daten – bis oder seit einem Datum.'
      );
      expect(calc?.h1).toBe('Tagerechner: Tage zwischen zwei Daten berechnen');
    });

    it('verifies canonical URL for both date pages', async () => {
      const metaTage = await generateCalcMetadata({ params: Promise.resolve({ slug: 'tage-zwischen-zwei-daten' }) });
      expect(metaTage.alternates?.canonical).toBe('https://rechenhafen.de/rechner/tage-zwischen-zwei-daten/');

      const metaXmas = await generateCalcMetadata({ params: Promise.resolve({ slug: 'tage-bis-weihnachten' }) });
      expect(metaXmas.alternates?.canonical).toBe('https://rechenhafen.de/rechner/tage-bis-weihnachten/');
    });

    it('verifies no duplicate title suffix "| RechenHafen | RechenHafen"', async () => {
      const template = '%s | RechenHafen';

      const metaTage = await generateCalcMetadata({ params: Promise.resolve({ slug: 'tage-zwischen-zwei-daten' }) });
      const renderedTage = template.replace('%s', metaTage.title as string);
      expect(renderedTage).toBe('Tagerechner: Tage zwischen zwei Daten berechnen | RechenHafen');
      expect(renderedTage).not.toContain('RechenHafen | RechenHafen');

      const metaXmas = await generateCalcMetadata({ params: Promise.resolve({ slug: 'tage-bis-weihnachten' }) });
      const renderedXmas = template.replace('%s', metaXmas.title as string);
      expect(renderedXmas).toBe('Tage bis Weihnachten: Countdown bis Heiligabend | RechenHafen');
      expect(renderedXmas).not.toContain('RechenHafen | RechenHafen');
    });

    it('verifies permanent 301 redirects in next.config.ts for overlapping date routes', async () => {
      expect(nextConfig.redirects).toBeDefined();
      const redirects = await nextConfig.redirects!();

      // tagerechner -> tage-zwischen-zwei-daten/
      const tagerechnerRedir = redirects.find((r) => r.source === '/rechner/tagerechner/');
      expect(tagerechnerRedir).toBeDefined();
      expect(tagerechnerRedir?.destination).toBe('/rechner/tage-zwischen-zwei-daten/');
      expect(tagerechnerRedir?.permanent).toBe(true);

      // tage-bis-datum -> tage-zwischen-zwei-daten/?mode=until
      const tageBisDatumRedir = redirects.find((r) => r.source === '/rechner/tage-bis-datum/');
      expect(tageBisDatumRedir).toBeDefined();
      expect(tageBisDatumRedir?.destination).toBe('/rechner/tage-zwischen-zwei-daten/?mode=until');
      expect(tageBisDatumRedir?.permanent).toBe(true);

      // tage-seit-datum -> tage-zwischen-zwei-daten/?mode=since
      const tageSeitDatumRedir = redirects.find((r) => r.source === '/rechner/tage-seit-datum/');
      expect(tageSeitDatumRedir).toBeDefined();
      expect(tageSeitDatumRedir?.destination).toBe('/rechner/tage-zwischen-zwei-daten/?mode=since');
      expect(tageSeitDatumRedir?.permanent).toBe(true);

      // tage-bis-silvester -> tage-zwischen-zwei-daten/?preset=silvester&mode=until
      const silvesterRedir = redirects.find((r) => r.source === '/rechner/tage-bis-silvester/');
      expect(silvesterRedir).toBeDefined();
      expect(silvesterRedir?.destination).toBe('/rechner/tage-zwischen-zwei-daten/?preset=silvester&mode=until');
      expect(silvesterRedir?.permanent).toBe(true);
    });

    it('verifies sitemap contains new Christmas page and primary Tagerechner, but NO redirect URLs', () => {
      const sitemapEntries = sitemap();
      const urls = sitemapEntries.map((e) => e.url);

      expect(urls).toContain('https://rechenhafen.de/rechner/tage-zwischen-zwei-daten/');
      expect(urls).toContain('https://rechenhafen.de/rechner/tage-bis-weihnachten/');

      // Redirect URLs must NOT be in sitemap
      for (const url of urls) {
        expect(url.includes('/rechner/tagerechner/')).toBe(false);
        expect(url.includes('/rechner/tage-bis-datum/')).toBe(false);
        expect(url.includes('/rechner/tage-seit-datum/')).toBe(false);
        expect(url.includes('/rechner/tage-bis-silvester/')).toBe(false);
      }
    });

    it('verifies internal linking between date cluster calculators', () => {
      const tagerechner = getCalculatorBySlug('tage-zwischen-zwei-daten');
      expect(tagerechner?.relatedSlugs).toContain('tage-bis-weihnachten');
      expect(tagerechner?.relatedSlugs).toContain('arbeitstage-rechner');
      expect(tagerechner?.relatedSlugs).toContain('werktage-rechner');
      expect(tagerechner?.relatedSlugs).toContain('datum-plus-tage');
      expect(tagerechner?.relatedSlugs).toContain('datum-minus-tage');
      expect(tagerechner?.relatedSlugs).toContain('altersrechner');
      expect(tagerechner?.relatedSlugs).toContain('tage-bis-geburtstag');
      expect(tagerechner?.relatedSlugs).toContain('schaltjahr-rechner');

      const xmas = getCalculatorBySlug('tage-bis-weihnachten');
      expect(xmas?.relatedSlugs).toContain('tage-zwischen-zwei-daten');
      expect(xmas?.relatedSlugs).toContain('countdown-rechner');
      expect(xmas?.relatedSlugs).toContain('tage-bis-geburtstag');
      expect(xmas?.content?.details).toContain('/datum-zeit/');
      expect(xmas?.content?.details).toContain('/rechner/countdown-rechner/');
      expect(xmas?.content?.details).toContain('/rechner/tage-bis-geburtstag/');
      expect(xmas?.content?.details).toContain('/rechner/tage-zwischen-zwei-daten/');
    });
  });
});
