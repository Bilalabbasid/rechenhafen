/**
 * RechenHafen Date Math & Calendar-Safe Logic
 *
 * Calendar-safe, timezone-proof date arithmetic for German calculators.
 * Implements strict Europe/Berlin reference, leap year rules, and zero-DST drift.
 */

import type { CalculationResult } from '@/types/calculator';

function formatNumber(num: number, minFrac: number = 0, maxFrac: number = 0): string {
  if (num === undefined || num === null || !Number.isFinite(num)) return '0';
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: minFrac,
    maximumFractionDigits: maxFrac,
  }).format(num);
}

export interface DateParts {
  year: number;
  month: number; // 1 - 12
  day: number; // 1 - 31
}

export const GERMAN_WEEKDAYS = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
] as const;

/**
 * Checks if a given year is a Gregorian leap year.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Returns number of days in a given month (1-12) for a given year.
 */
export function getDaysInMonth(year: number, month: number): number {
  switch (month) {
    case 1: // Januar
    case 3: // März
    case 5: // Mai
    case 7: // Juli
    case 8: // August
    case 10: // Oktober
    case 12: // Dezember
      return 31;
    case 4: // April
    case 6: // Juni
    case 9: // September
    case 11: // November
      return 30;
    case 2: // Februar
      return isLeapYear(year) ? 29 : 28;
    default:
      return 30;
  }
}

/**
 * Safely parses any date string (YYYY-MM-DD or DD.MM.YYYY) or Date object into DateParts.
 * Avoids any timezone shift or UTC-to-local midnight conversion bug.
 */
export function parseDateParts(
  dateInput: string | Date | DateParts | undefined | null
): DateParts | null {
  if (!dateInput) return null;

  if (typeof dateInput === 'object' && 'year' in dateInput && 'month' in dateInput && 'day' in dateInput) {
    if (
      Number.isInteger(dateInput.year) &&
      dateInput.month >= 1 &&
      dateInput.month <= 12 &&
      dateInput.day >= 1 &&
      dateInput.day <= getDaysInMonth(dateInput.year, dateInput.month)
    ) {
      return dateInput;
    }
  }

  if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim();
    // Match ISO YYYY-MM-DD
    const isoMatch = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(trimmed);
    if (isoMatch) {
      const year = parseInt(isoMatch[1], 10);
      const month = parseInt(isoMatch[2], 10);
      const day = parseInt(isoMatch[3], 10);
      if (year > 0 && month >= 1 && month <= 12 && day >= 1 && day <= getDaysInMonth(year, month)) {
        return { year, month, day };
      }
    }

    // Match German DD.MM.YYYY
    const deMatch = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(trimmed);
    if (deMatch) {
      const day = parseInt(deMatch[1], 10);
      const month = parseInt(deMatch[2], 10);
      const year = parseInt(deMatch[3], 10);
      if (year > 0 && month >= 1 && month <= 12 && day >= 1 && day <= getDaysInMonth(year, month)) {
        return { year, month, day };
      }
    }
  }

  if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
    return {
      year: dateInput.getFullYear(),
      month: dateInput.getMonth() + 1,
      day: dateInput.getDate(),
    };
  }

  return null;
}

/**
 * Formats date parts or date string as German date format DD.MM.YYYY
 */
export function formatDateGerman(
  dateInput: string | Date | DateParts | undefined | null
): string {
  const parts = parseDateParts(dateInput);
  if (!parts) return '';
  const pad = (n: number) => (n < 10 ? '0' + n : String(n));
  return `${pad(parts.day)}.${pad(parts.month)}.${parts.year}`;
}

/**
 * Calculates anniversary date given entry date parts and years to add.
 * Calendar-year arithmetic convention:
 * - Preserves day and month where possible.
 * - For a 29 February start date:
 *   - Uses 29 February in leap years.
 *   - Uses 28 February in non-leap years.
 * Completely timezone-independent, operating solely on integer year, month, day.
 */
export function calculateAnniversaryDate(
  year: number,
  month: number,
  day: number,
  yearsToAdd: number
): {
  year: number;
  month: number;
  day: number;
  formatted: string;
  isLeapPreserved: boolean;
  isLeapShiftedTo28: boolean;
} {
  const targetYear = year + yearsToAdd;
  let targetDay = day;
  const targetMonth = month;
  let isLeapPreserved = false;
  let isLeapShiftedTo28 = false;

  if (month === 2 && day === 29) {
    if (isLeapYear(targetYear)) {
      targetDay = 29;
      isLeapPreserved = true;
    } else {
      targetDay = 28;
      isLeapShiftedTo28 = true;
    }
  }

  const pad = (n: number) => (n < 10 ? '0' + n : String(n));
  return {
    year: targetYear,
    month: targetMonth,
    day: targetDay,
    formatted: `${pad(targetDay)}.${pad(targetMonth)}.${targetYear}`,
    isLeapPreserved,
    isLeapShiftedTo28,
  };
}

/**
 * Returns today's date in Europe/Berlin time zone as DateParts.
 */
export function getBerlinTodayParts(): DateParts {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const partsStr = formatter.format(new Date()); // Returns "YYYY-MM-DD"
  const [y, m, d] = partsStr.split('-').map((v) => parseInt(v, 10));
  return { year: y, month: m, day: d };
}

/**
 * Returns today's date string in Europe/Berlin (YYYY-MM-DD).
 */
export function getBerlinTodayString(): string {
  const parts = getBerlinTodayParts();
  const pad = (n: number) => (n < 10 ? '0' + n : String(n));
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

/**
 * Converts DateParts to a continuous integer Day Number (Julian day number reference in UTC).
 * Exactly 86,400,000 ms per day, zero daylight-saving jumps.
 */
export function dateToDayNumber(year: number, month: number, day: number): number {
  return Math.round(Date.UTC(year, month - 1, day) / 86400000);
}

/**
 * Returns the German weekday name for a given date.
 */
export function getGermanWeekday(year: number, month: number, day: number): string {
  const d = new Date(Date.UTC(year, month - 1, day));
  return GERMAN_WEEKDAYS[d.getUTCDay()];
}

/**
 * Computes Easter Sunday (Ostersonntag) for any Gregorian calendar year (Meeus/Jones/Butcher algorithm).
 */
export function getEasterSunday(year: number): DateParts {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { year, month, day };
}

/**
 * Returns the ISO date string (YYYY-MM-DD) for the next upcoming Easter Sunday relative to Berlin today.
 */
export function getUpcomingEasterDateString(refDate?: DateParts): string {
  const ref = refDate || getBerlinTodayParts();
  const easterThisYear = getEasterSunday(ref.year);
  const refDayNum = dateToDayNumber(ref.year, ref.month, ref.day);
  const easterDayNum = dateToDayNumber(easterThisYear.year, easterThisYear.month, easterThisYear.day);

  const target = easterDayNum >= refDayNum ? easterThisYear : getEasterSunday(ref.year + 1);
  const pad = (n: number) => (n < 10 ? '0' + n : String(n));
  return `${target.year}-${pad(target.month)}-${pad(target.day)}`;
}

export interface CalendarDiffResult {
  totalDays: number;
  totalWeeks: number;
  remDays: number;
  years: number;
  months: number;
  days: number;
  isReversed: boolean;
  isSameDay: boolean;
  includeStartDay: boolean;
  earlier: DateParts;
  later: DateParts;
  rawStart: DateParts;
  rawEnd: DateParts;
}

/**
 * Computes exact calendar difference between two dates.
 * Calendar-safe, accounts for leap years, exact month boundaries, and optional start-day inclusion.
 */
export function calculateCalendarDiff(
  startInput: string | Date | DateParts,
  endInput: string | Date | DateParts,
  includeStartDay: boolean = false
): CalendarDiffResult | null {
  const startParts = parseDateParts(startInput);
  const endParts = parseDateParts(endInput);

  if (!startParts || !endParts) return null;

  const startDayNum = dateToDayNumber(startParts.year, startParts.month, startParts.day);
  const endDayNum = dateToDayNumber(endParts.year, endParts.month, endParts.day);

  const isReversed = endDayNum < startDayNum;
  const isSameDay = endDayNum === startDayNum;

  const earlier = isReversed ? endParts : startParts;
  const later = isReversed ? startParts : endParts;

  const rawDayDiff = Math.abs(endDayNum - startDayNum);
  const totalDays = includeStartDay ? rawDayDiff + 1 : rawDayDiff;
  const totalWeeks = Math.floor(totalDays / 7);
  const remDays = totalDays % 7;

  // Calendar breakdown: years, months, days
  let y = later.year - earlier.year;
  let m = later.month - earlier.month;
  let d = later.day - earlier.day;

  if (d < 0) {
    m -= 1;
    const prevMonth = later.month === 1 ? 12 : later.month - 1;
    const prevYear = later.month === 1 ? later.year - 1 : later.year;
    d += getDaysInMonth(prevYear, prevMonth);
  }

  if (m < 0) {
    y -= 1;
    m += 12;
  }

  if (includeStartDay) {
    d += 1;
    const daysInTargetMonth = getDaysInMonth(later.year, later.month);
    if (d > daysInTargetMonth) {
      d -= daysInTargetMonth;
      m += 1;
      if (m >= 12) {
        y += 1;
        m -= 12;
      }
    }
  }

  return {
    totalDays,
    totalWeeks,
    remDays,
    years: y,
    months: m,
    days: d,
    isReversed,
    isSameDay,
    includeStartDay,
    earlier,
    later,
    rawStart: startParts,
    rawEnd: endParts,
  };
}

/**
 * Main Tagerechner Calculation Engine
 * Supports 3 modes:
 *  - 'between': Tage zwischen zwei Daten
 *  - 'until': Tage bis zu einem Datum (Startdatum = heute)
 *  - 'since': Tage seit einem Datum (Enddatum = heute)
 */
export function calculateTagerechner(inputs: Record<string, any>): CalculationResult {
  const mode = inputs.mode || 'between';
  const includeStartDay = inputs.includeStartDay === true || inputs.includeStartDay === 'true' || inputs.includeStartDay === 1;

  const berlinToday = getBerlinTodayParts();
  const berlinTodayStr = getBerlinTodayString();

  let startStr = inputs.startDate;
  let endStr = inputs.endDate;

  if (mode === 'until') {
    startStr = berlinTodayStr;
    endStr = inputs.endDate || inputs.targetDate || `${berlinToday.year}-12-24`;
  } else if (mode === 'since') {
    startStr = inputs.startDate || '1960-03-01';
    endStr = berlinTodayStr;
  } else {
    // between
    startStr = inputs.startDate || '2026-01-01';
    endStr = inputs.endDate || '2026-12-31';
  }

  const diff = calculateCalendarDiff(startStr, endStr, includeStartDay);

  if (!diff) {
    return {
      primary: { id: 'error', label: 'Fehler', value: 0, formattedValue: 'Ungültiges Datum' },
      error: 'Bitte geben Sie gültige Kalenderdaten im Format TT.MM.JJJJ oder JJJJ-MM-TT ein.',
    };
  }

  const startFormatted = formatDateGerman(diff.rawStart);
  const endFormatted = formatDateGerman(diff.rawEnd);
  const daysFormatted = formatNumber(diff.totalDays, 0);

  // Direction explanation sentence
  let directionSentence = '';
  if (diff.isSameDay) {
    directionSentence = includeStartDay
      ? `Start- und Enddatum sind identisch (${startFormatted}). Bei gezähltem Starttag entspricht dies genau 1 Kalendertag.`
      : `Start- und Enddatum sind identisch (${startFormatted}). Ohne Starttag liegt die Zeitspanne bei 0 Tagen.`;
  } else if (mode === 'since') {
    if (diff.isReversed) {
      directionSentence = `Das gewählte Datum ${startFormatted} liegt in der Zukunft: Bis dorthin sind es noch ${daysFormatted} Tage.`;
    } else {
      directionSentence = `Seit dem ${startFormatted} sind ${daysFormatted} Tage vergangen.`;
    }
  } else if (mode === 'until') {
    if (diff.isReversed) {
      directionSentence = `Das Zieldatum ${endFormatted} liegt bereits in der Vergangenheit: Seitdem sind ${daysFormatted} Tage vergangen.`;
    } else {
      directionSentence = `Bis zum ${endFormatted} sind es noch ${daysFormatted} Tage.`;
    }
  } else {
    // between
    if (diff.isReversed) {
      directionSentence = `Hinweis: Das Startdatum (${startFormatted}) liegt nach dem Enddatum (${endFormatted}). Der Rechner hat die Differenz vom früheren zum späteren Datum ermittelt (${daysFormatted} Tage).`;
    } else {
      directionSentence = `Vom ${startFormatted} bis zum ${endFormatted} sind es ${daysFormatted} Tage.`;
    }
  }

  const calendarBreakdown = `${diff.years} ${diff.years === 1 ? 'Jahr' : 'Jahre'}, ${diff.months} ${diff.months === 1 ? 'Monat' : 'Monate'} und ${diff.days} ${diff.days === 1 ? 'Tag' : 'Tage'}`;
  const weeksBreakdown = `${formatNumber(diff.totalWeeks, 0)} ${diff.totalWeeks === 1 ? 'Woche' : 'Wochen'} und ${diff.remDays} ${diff.remDays === 1 ? 'Tag' : 'Tage'}`;

  const startDayNote = includeStartDay
    ? `Starttag (${startFormatted}) mitgezählt: Ja (+1 Tag, beidseitig inklusive)`
    : `Starttag nicht mitgezählt (Standard: Differenz auf Kalendertagsbasis)`;

  const summary = `${directionSentence} Das entspricht ${weeksBreakdown} bzw. ${calendarBreakdown}. (${startDayNote})`;

  return {
    primary: {
      id: 'totalDays',
      label: 'Exakte Kalendertage',
      value: diff.totalDays,
      formattedValue: `${daysFormatted} ${diff.totalDays === 1 ? 'Tag' : 'Tage'}`,
      highlight: true,
    },
    secondary: [
      {
        id: 'calendarBreakdown',
        label: 'Kalendarische Aufteilung',
        value: diff.totalDays,
        formattedValue: calendarBreakdown,
      },
      {
        id: 'weeksBreakdown',
        label: 'Wochen & verbleibende Tage',
        value: diff.totalWeeks,
        formattedValue: weeksBreakdown,
      },
      {
        id: 'startDayCounted',
        label: 'Starttag-Zählung',
        value: includeStartDay ? 1 : 0,
        formattedValue: includeStartDay ? 'Ja (beidseitig inklusive)' : 'Nein (nur Differenztage)',
      },
      {
        id: 'periodDirection',
        label: 'Zeitraum',
        value: diff.totalDays,
        formattedValue: `${startFormatted} → ${endFormatted}`,
      },
    ],
    summaryText: summary,
  };
}

/**
 * Calculation Engine for "Tage bis Weihnachten"
 * Automatically calculates days until upcoming Heiligabend (24.12.) or 1. Weihnachtstag (25.12.).
 * Automatically switches to next year if Christmas in current year has passed.
 */
export function calculateTageBisWeihnachten(inputs: Record<string, any>): CalculationResult {
  const targetType = inputs.christmasTarget === 'weihnachten' || inputs.christmasTarget === '25' ? 'weihnachten' : 'heiligabend';
  const targetDay = targetType === 'weihnachten' ? 25 : 24;
  const targetLabel = targetType === 'weihnachten' ? '1. Weihnachtstag (25. Dezember)' : 'Heiligabend (24. Dezember)';

  const heute = getBerlinTodayParts();
  let targetYear = heute.year;

  // Has Christmas for targetYear already passed?
  const isChristmasPassed = heute.month === 12 && heute.day > targetDay;
  if (isChristmasPassed) {
    targetYear += 1;
  }

  const isTodayChristmas = heute.month === 12 && heute.day === targetDay;

  const targetParts: DateParts = {
    year: targetYear,
    month: 12,
    day: targetDay,
  };

  const todayDayNum = dateToDayNumber(heute.year, heute.month, heute.day);
  const targetDayNum = dateToDayNumber(targetParts.year, targetParts.month, targetParts.day);
  const daysRemaining = targetDayNum - todayDayNum;

  const totalWeeks = Math.floor(daysRemaining / 7);
  const remDays = daysRemaining % 7;

  const weekday = getGermanWeekday(targetParts.year, targetParts.month, targetParts.day);
  const targetDateFormatted = `${targetDay < 10 ? '0' + targetDay : targetDay}.12.${targetYear}`;

  let summaryText = '';
  if (isTodayChristmas) {
    summaryText = `Heute ist ${targetType === 'weihnachten' ? 'der 1. Weihnachtstag' : 'Heiligabend'}! Das Fest ist da – wir wünschen besinnliche und frohe Feiertage!`;
  } else if (isChristmasPassed) {
    summaryText = `${targetLabel} ${heute.year} ist bereits vorüber. Der Countdown schaltet automatisch auf das nächste Fest am ${weekday}, den ${targetDateFormatted} um. Es verbleiben ${formatNumber(daysRemaining, 0)} Tage.`;
  } else {
    summaryText = `Bis zu ${targetLabel} am ${weekday}, den ${targetDateFormatted}, sind es genau ${formatNumber(daysRemaining, 0)} Tage. Das entspricht ${formatNumber(totalWeeks, 0)} vollen Wochen und ${remDays} Tagen.`;
  }

  return {
    primary: {
      id: 'daysRemaining',
      label: isTodayChristmas ? 'Status' : 'Verbleibende Tage bis Weihnachten',
      value: daysRemaining,
      formattedValue: isTodayChristmas ? 'Heute ist Weihnachten!' : `${formatNumber(daysRemaining, 0)} ${daysRemaining === 1 ? 'Tag' : 'Tage'}`,
      highlight: true,
    },
    secondary: [
      {
        id: 'targetDate',
        label: 'Nächster Festtag',
        value: targetYear,
        formattedValue: `${weekday}, ${targetDateFormatted}`,
      },
      {
        id: 'weeksAndDays',
        label: 'Wochen & Tage',
        value: totalWeeks,
        formattedValue: `${formatNumber(totalWeeks, 0)} ${totalWeeks === 1 ? 'Woche' : 'Wochen'} und ${remDays} ${remDays === 1 ? 'Tag' : 'Tage'}`,
      },
      {
        id: 'targetChoice',
        label: 'Gewählter Stichtag',
        value: targetDay,
        formattedValue: targetLabel,
      },
      {
        id: 'rolloverStatus',
        label: 'Kalenderjahr',
        value: targetYear,
        formattedValue: targetYear > heute.year ? `Weihnachten ${targetYear} (Automatischer Jahreswechsel)` : `Weihnachten ${targetYear}`,
      },
    ],
    summaryText,
  };
}
