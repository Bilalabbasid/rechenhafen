import { CalculationResult } from '@/types/calculator';
import { formatNumber, formatDateDe } from '@/lib/formatters';

export function calculateAge(inputs: Record<string, any>): CalculationResult {
  const birthDateStr = inputs.birthDate || '1990-01-01';
  const targetDateStr = inputs.targetDate || new Date().toISOString().split('T')[0];

  const birth = new Date(birthDateStr);
  const target = new Date(targetDateStr);

  if (isNaN(birth.getTime()) || isNaN(target.getTime())) {
    return {
      primary: { id: 'error', label: 'Fehler', value: 0, formattedValue: 'Ungültiges Datum' },
      error: 'Bitte geben Sie gültige Kalenderdaten ein.',
    };
  }

  if (target < birth) {
    return {
      primary: { id: 'error', label: 'Fehler', value: 0, formattedValue: '0 Jahre' },
      error: 'Das Vergleichsdatum darf nicht vor dem Geburtsdatum liegen.',
    };
  }

  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonthDays = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const diffMs = target.getTime() - birth.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalHours = totalDays * 24;

  // Next birthday calculation
  const nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBday < target) {
    nextBday.setFullYear(target.getFullYear() + 1);
  }
  const daysUntilNext = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

  return {
    primary: {
      id: 'years',
      label: 'Exaktes Alter',
      value: years,
      formattedValue: `${years} Jahre, ${months} Monate, ${days} Tage`,
      highlight: true,
    },
    secondary: [
      { id: 'totalDays', label: 'Gesamte Tage', value: totalDays, formattedValue: `${formatNumber(totalDays, 0)} Tage` },
      { id: 'totalWeeks', label: 'Gesamte Wochen', value: totalWeeks, formattedValue: `${formatNumber(totalWeeks, 0)} Wochen` },
      { id: 'totalMonths', label: 'Gesamte Monate', value: totalMonths, formattedValue: `${formatNumber(totalMonths, 0)} Monate` },
      { id: 'totalHours', label: 'Gelebte Stunden', value: totalHours, formattedValue: `${formatNumber(totalHours, 0)} Stunden` },
      { id: 'daysUntilNext', label: 'Tage bis zum nächsten Geburtstag', value: daysUntilNext, formattedValue: `${daysUntilNext} Tage` },
    ],
    summaryText: `Sie sind ${years} Jahre, ${months} Monate und ${days} Tage alt (entspricht ${formatNumber(totalDays, 0)} Tagen). Der nächste Geburtstag ist in ${daysUntilNext} Tagen.`,
  };
}

export function calculateAgeInDays(inputs: Record<string, any>): CalculationResult {
  const birth = new Date(inputs.birthDate || '1995-01-01');
  const target = inputs.targetDate ? new Date(inputs.targetDate) : new Date();

  if (isNaN(birth.getTime()) || isNaN(target.getTime()) || target < birth) {
    return {
      primary: { id: 'days', label: 'Alter in Tagen', value: 0, formattedValue: '0 Tage' },
      error: 'Ungültiges Geburtsdatum oder Vergleichsdatum liegt vor Geburt.',
    };
  }

  const days = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
  const hours = days * 24;
  const minutes = hours * 60;

  return {
    primary: {
      id: 'days',
      label: 'Alter in Tagen',
      value: days,
      formattedValue: `${formatNumber(days, 0)} Tage`,
      highlight: true,
    },
    secondary: [
      { id: 'hours', label: 'Alter in Stunden', value: hours, formattedValue: `${formatNumber(hours, 0)} Std.` },
      { id: 'minutes', label: 'Alter in Minuten', value: minutes, formattedValue: `${formatNumber(minutes, 0)} Min.` },
      { id: 'weeks', label: 'Alter in Wochen', value: Math.floor(days / 7), formattedValue: `${formatNumber(Math.floor(days / 7), 0)} Wochen` },
    ],
    summaryText: `Vom Geburtsdatum bis zum Stichtag sind genau ${formatNumber(days, 0)} Tage vergangen.`,
  };
}

export function calculateDateDifference(inputs: Record<string, any>): CalculationResult {
  const start = new Date(inputs.startDate || '2026-01-01');
  const end = new Date(inputs.endDate || '2026-12-31');

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      primary: { id: 'diff', label: 'Differenz', value: 0, formattedValue: '0 Tage' },
      error: 'Ungültige Datumsangaben.',
    };
  }

  const isReversed = end < start;
  const tStart = isReversed ? end : start;
  const tEnd = isReversed ? start : end;

  const diffMs = tEnd.getTime() - tStart.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const remDays = totalDays % 7;

  let years = tEnd.getFullYear() - tStart.getFullYear();
  let months = tEnd.getMonth() - tStart.getMonth();
  let days = tEnd.getDate() - tStart.getDate();

  if (days < 0) {
    months--;
    const prevMonthDays = new Date(tEnd.getFullYear(), tEnd.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    primary: {
      id: 'days',
      label: 'Gesamttage',
      value: totalDays,
      formattedValue: `${formatNumber(totalDays, 0)} Tage`,
      highlight: true,
    },
    secondary: [
      { id: 'detailed', label: 'Kalendarische Spanne', value: totalDays, formattedValue: `${years} J, ${months} M, ${days} T` },
      { id: 'weeks', label: 'Wochen & Tage', value: totalWeeks, formattedValue: `${totalWeeks} Wochen und ${remDays} Tage` },
      { id: 'hours', label: 'Stunden', value: totalDays * 24, formattedValue: `${formatNumber(totalDays * 24, 0)} Std.` },
    ],
    summaryText: `Zwischen dem ${formatDateDe(start)} und dem ${formatDateDe(end)} liegen ${formatNumber(totalDays, 0)} Tage.`,
  };
}

export function calculateWorkdays(inputs: Record<string, any>): CalculationResult {
  const start = new Date(inputs.startDate || '2026-01-01');
  const end = new Date(inputs.endDate || '2026-01-31');

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      primary: { id: 'workdays', label: 'Arbeitstage', value: 0, formattedValue: '0 Tage' },
      error: 'Ungültige Datumsangaben.',
    };
  }

  const isReversed = end < start;
  const dStart = isReversed ? new Date(end) : new Date(start);
  const dEnd = isReversed ? new Date(start) : new Date(end);

  let workdays = 0;
  let weekendDays = 0;
  let totalDays = 0;

  const cur = new Date(dStart);
  while (cur <= dEnd) {
    const dayOfWeek = cur.getDay(); // 0 = So, 6 = Sa
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
    } else {
      workdays++;
    }
    totalDays++;
    cur.setDate(cur.getDate() + 1);
  }

  const workHours = workdays * (parseFloat(inputs.hoursPerDay) || 8);

  return {
    primary: {
      id: 'workdays',
      label: 'Arbeitstage (Mo–Fr)',
      value: workdays,
      formattedValue: `${workdays} Tage`,
      highlight: true,
    },
    secondary: [
      { id: 'totalDays', label: 'Gesamte Kalendertage', value: totalDays, formattedValue: `${totalDays} Tage` },
      { id: 'weekendDays', label: 'Wochenendtage (Sa/So)', value: weekendDays, formattedValue: `${weekendDays} Tage` },
      { id: 'workHours', label: 'Reguläre Arbeitsstunden', value: workHours, formattedValue: `${formatNumber(workHours, 1)} Std.` },
    ],
    summaryText: `Im gewählten Zeitraum von ${totalDays} Kalendertagen gibt es ${workdays} Arbeitstage (Montag bis Freitag) und ${weekendDays} Wochenendtage.`,
  };
}

export function calculateDateAdd(inputs: Record<string, any>): CalculationResult {
  const base = new Date(inputs.startDate || '2026-01-01');
  const days = parseInt(inputs.days || '0', 10);
  const operation = inputs.operation || 'add';

  if (isNaN(base.getTime())) {
    return {
      primary: { id: 'resultDate', label: 'Zieldatum', value: '', formattedValue: '-' },
      error: 'Ungültiges Basisdatum.',
    };
  }

  const target = new Date(base);
  const dayDelta = operation === 'subtract' ? -Math.abs(days) : Math.abs(days);
  target.setDate(target.getDate() + dayDelta);

  const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const weekdayName = weekdays[target.getDay()];

  return {
    primary: {
      id: 'resultDate',
      label: 'Berechnetes Datum',
      value: target.toISOString().split('T')[0],
      formattedValue: formatDateDe(target),
      highlight: true,
    },
    secondary: [
      { id: 'weekday', label: 'Wochentag', value: weekdayName, formattedValue: weekdayName },
      { id: 'delta', label: 'Verschiebung', value: dayDelta, formattedValue: `${dayDelta >= 0 ? '+' : ''}${dayDelta} Tage` },
      { id: 'calendarWeek', label: 'Kalenderwoche', value: getISOWeek(target), formattedValue: `KW ${getISOWeek(target)}` },
    ],
    summaryText: `${formatDateDe(base)} ${dayDelta >= 0 ? 'plus' : 'minus'} ${Math.abs(days)} Tage ergibt ${weekdayName}, den ${formatDateDe(target)}.`,
  };
}

export function calculateLeapYear(inputs: Record<string, any>): CalculationResult {
  const year = parseInt(inputs.year || '2026', 10);
  if (!Number.isFinite(year) || year < 1) {
    return {
      primary: { id: 'isLeap', label: 'Schaltjahr?', value: 'Nein', formattedValue: 'Nein' },
      error: 'Bitte geben Sie ein gültiges Jahr ein.',
    };
  }

  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInYear = isLeap ? 366 : 365;

  let explanation = '';
  if (isLeap) {
    if (year % 400 === 0) {
      explanation = `Das Jahr ${year} ist durch 400 teilbar und somit ein Schaltjahr.`;
    } else {
      explanation = `Das Jahr ${year} ist durch 4, aber nicht durch 100 teilbar – es ist ein Schaltjahr.`;
    }
  } else {
    if (year % 100 === 0 && year % 400 !== 0) {
      explanation = `Das Jahr ${year} ist zwar durch 4 und 100 teilbar, aber nicht durch 400 (Säkularjahr-Ausnahme).`;
    } else {
      explanation = `Das Jahr ${year} ist nicht ohne Rest durch 4 teilbar.`;
    }
  }

  return {
    primary: {
      id: 'isLeap',
      label: `Ist ${year} ein Schaltjahr?`,
      value: isLeap ? 'Ja' : 'Nein',
      formattedValue: isLeap ? 'Ja (Schaltjahr)' : 'Nein (Gemeinjahr)',
      highlight: true,
    },
    secondary: [
      { id: 'days', label: 'Tage im Jahr', value: daysInYear, formattedValue: `${daysInYear} Tage` },
      { id: 'februaryDays', label: 'Tage im Februar', value: isLeap ? 29 : 28, formattedValue: `${isLeap ? 29 : 28} Tage` },
      { id: 'rule', label: 'Regelbegründung', value: explanation, formattedValue: explanation },
    ],
    summaryText: `Das Jahr ${year} hat ${daysInYear} Tage. ${explanation}`,
  };
}

export function calculateTimeDifference(inputs: Record<string, any>): CalculationResult {
  const time1 = inputs.startTime || '08:00';
  const time2 = inputs.endTime || '16:30';
  const pauseMin = parseFloat(inputs.pauseMinutes) || 0;

  const [h1, m1] = time1.split(':').map((v: string) => parseInt(v, 10) || 0);
  const [h2, m2] = time2.split(':').map((v: string) => parseInt(v, 10) || 0);

  let totalMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60; // Über Mitternacht
  }

  const effectiveMinutes = Math.max(0, totalMinutes - pauseMin);
  const effHours = Math.floor(effectiveMinutes / 60);
  const effRemainingMin = effectiveMinutes % 60;
  const decimalHours = effectiveMinutes / 60;

  return {
    primary: {
      id: 'duration',
      label: 'Effektive Zeitspanne',
      value: decimalHours,
      formattedValue: `${effHours} Std. ${effRemainingMin} Min.`,
      highlight: true,
    },
    secondary: [
      { id: 'decimal', label: 'Industriestunden (Dezimal)', value: decimalHours, formattedValue: `${formatNumber(decimalHours, 2)} Std.` },
      { id: 'totalMinutes', label: 'Gesamtminuten (netto)', value: effectiveMinutes, formattedValue: `${effectiveMinutes} Min.` },
      { id: 'grossMinutes', label: 'Bruttozeit (vor Pause)', value: totalMinutes, formattedValue: `${Math.floor(totalMinutes / 60)} Std. ${totalMinutes % 60} Min.` },
      { id: 'pause', label: 'Abgezogene Pause', value: pauseMin, formattedValue: `${pauseMin} Min.` },
    ],
    summaryText: `Zwischen ${time1} Uhr und ${time2} Uhr (abzüglich ${pauseMin} Min. Pause) verbleiben ${effHours} Stunden und ${effRemainingMin} Minuten (${formatNumber(decimalHours, 2)} Industriestunden).`,
  };
}

export function calculateAgeDifference(inputs: Record<string, any>): CalculationResult {
  const d1 = new Date(inputs.datePerson1 || '1990-05-15');
  const d2 = new Date(inputs.datePerson2 || '1993-11-20');

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    return {
      primary: { id: 'diff', label: 'Altersunterschied', value: 0, formattedValue: '-' },
      error: 'Bitte gültige Geburtsdaten für beide Personen eingeben.',
    };
  }

  const elder = d1 < d2 ? d1 : d2;
  const younger = d1 < d2 ? d2 : d1;
  const elderLabel = d1 < d2 ? 'Person 1 ist älter' : (d1 > d2 ? 'Person 2 ist älter' : 'Beide gleich alt');

  let years = younger.getFullYear() - elder.getFullYear();
  let months = younger.getMonth() - elder.getMonth();
  let days = younger.getDate() - elder.getDate();

  if (days < 0) {
    months--;
    const prevMonthDays = new Date(younger.getFullYear(), younger.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.floor((younger.getTime() - elder.getTime()) / (1000 * 60 * 60 * 24));

  return {
    primary: {
      id: 'ageDiff',
      label: 'Altersunterschied',
      value: years,
      formattedValue: `${years} Jahre, ${months} Monate, ${days} Tage`,
      highlight: true,
    },
    secondary: [
      { id: 'relation', label: 'Verhältnis', value: elderLabel, formattedValue: elderLabel },
      { id: 'totalDays', label: 'Unterschied in Tagen', value: totalDays, formattedValue: `${formatNumber(totalDays, 0)} Tage` },
      { id: 'totalWeeks', label: 'Unterschied in Wochen', value: Math.floor(totalDays / 7), formattedValue: `${formatNumber(Math.floor(totalDays / 7), 0)} Wochen` },
    ],
    summaryText: `Der Altersunterschied beträgt ${years} Jahre, ${months} Monate und ${days} Tage (${formatNumber(totalDays, 0)} Tage). ${elderLabel}.`,
  };
}

export function calculateBirthdayWeekday(inputs: Record<string, any>): CalculationResult {
  const birth = new Date(inputs.birthDate || '1992-08-14');
  if (isNaN(birth.getTime())) {
    return {
      primary: { id: 'weekday', label: 'Wochentag', value: '', formattedValue: '-' },
      error: 'Ungültiges Geburtsdatum.',
    };
  }

  const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const birthWeekday = weekdays[birth.getDay()];

  const today = new Date();
  const currentYear = today.getFullYear();
  const nextBday = new Date(currentYear, birth.getMonth(), birth.getDate());
  if (nextBday < today) {
    nextBday.setFullYear(currentYear + 1);
  }
  const nextWeekday = weekdays[nextBday.getDay()];
  const daysUntil = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return {
    primary: {
      id: 'birthWeekday',
      label: 'Wochentag der Geburt',
      value: birthWeekday,
      formattedValue: birthWeekday,
      highlight: true,
    },
    secondary: [
      { id: 'nextBdayDate', label: 'Nächster Geburtstag', value: formatDateDe(nextBday), formattedValue: formatDateDe(nextBday) },
      { id: 'nextWeekday', label: 'Wochentag nächster Geburtstag', value: nextWeekday, formattedValue: nextWeekday },
      { id: 'daysUntil', label: 'Verbleibende Tage', value: daysUntil, formattedValue: `${daysUntil} Tage` },
    ],
    summaryText: `Sie wurden an einem ${birthWeekday} geboren. Ihr nächster Geburtstag fällt auf einen ${nextWeekday} (in ${daysUntil} Tagen).`,
  };
}

export function calculateISOWeek(inputs: Record<string, any>): CalculationResult {
  const d = inputs.date ? new Date(inputs.date) : new Date();
  if (isNaN(d.getTime())) {
    return {
      primary: { id: 'kw', label: 'Kalenderwoche', value: 0, formattedValue: '-' },
      error: 'Ungültiges Datum.',
    };
  }

  const kw = getISOWeek(d);
  const year = d.getFullYear();
  const quarter = Math.floor(d.getMonth() / 3) + 1;

  return {
    primary: {
      id: 'kw',
      label: 'Kalenderwoche (nach DIN ISO 8601)',
      value: kw,
      formattedValue: `KW ${kw}`,
      highlight: true,
    },
    secondary: [
      { id: 'quarter', label: 'Quartal', value: quarter, formattedValue: `Q${quarter}` },
      { id: 'dayOfYear', label: 'Tag des Jahres', value: getDayOfYear(d), formattedValue: `Tag ${getDayOfYear(d)} von ${isLeapYear(year) ? 366 : 365}` },
    ],
    summaryText: `Der ${formatDateDe(d)} liegt in der Kalenderwoche ${kw} (Quartal Q${quarter}).`,
  };
}

// Helpers
function getISOWeek(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
