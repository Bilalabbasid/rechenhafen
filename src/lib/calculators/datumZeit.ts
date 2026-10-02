import { CalculationResult, ResultItem } from '@/types/calculator';
import { formatNumber, formatDateDe } from '@/lib/formatters';
import { getGermanHolidays, FederalState, FEDERAL_STATES } from '@/lib/holidays';
import {
  calculateCalendarDiff,
  calculateTagerechner,
  calculateTageBisWeihnachten,
  dateToDayNumber,
  dayNumberToDate,
  formatDateGerman,
  getBerlinTodayParts,
  getGermanWeekday,
  getISOWeekFromParts,
  parseDateParts,
} from '@/lib/calculators/dateMath';

export { calculateTagerechner, calculateTageBisWeihnachten };

export function calculateAge(inputs: Record<string, any>): CalculationResult {
  if (inputs.birthDate === undefined || inputs.birthDate === null || String(inputs.birthDate).trim() === '') {
    return {
      primary: { id: 'years', label: 'Exaktes Alter', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie Ihr Geburtsdatum ein.',
    };
  }

  const birthParts = parseDateParts(inputs.birthDate);
  if (!birthParts) {
    return {
      primary: { id: 'years', label: 'Exaktes Alter', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie ein gültiges Geburtsdatum ein (z. B. TT.MM.JJJJ oder JJJJ-MM-TT). Ungültige oder unmögliche Kalendertage (wie der 29. Februar in Nicht-Schaltjahren) werden nicht akzeptiert.',
    };
  }

  const targetParts = inputs.targetDate && String(inputs.targetDate).trim() !== ''
    ? parseDateParts(inputs.targetDate)
    : getBerlinTodayParts();

  if (!targetParts) {
    return {
      primary: { id: 'years', label: 'Exaktes Alter', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie ein gültiges Vergleichsdatum (Stichtag) ein.',
    };
  }

  const birthDayNum = dateToDayNumber(birthParts.year, birthParts.month, birthParts.day);
  const targetDayNum = dateToDayNumber(targetParts.year, targetParts.month, targetParts.day);

  if (targetDayNum < birthDayNum) {
    return {
      primary: { id: 'years', label: 'Exaktes Alter', value: 0, formattedValue: '-' },
      error: 'Das Vergleichsdatum darf nicht vor dem Geburtsdatum liegen.',
    };
  }

  const diff = calculateCalendarDiff(birthParts, targetParts, false);
  if (!diff) {
    return {
      primary: { id: 'years', label: 'Exaktes Alter', value: 0, formattedValue: '-' },
      error: 'Fehler bei der Berechnung der kalendarischen Altersdifferenz.',
    };
  }

  const years = diff.years;
  const months = diff.months;
  const days = diff.days;
  const totalDays = diff.totalDays;
  const totalWeeks = diff.totalWeeks;
  const totalMonths = years * 12 + months;
  const totalHours = totalDays * 24;

  // Next birthday calculation with leap year safety (29. Februar)
  let nextBdayYear = targetParts.year;
  let nextBdayDay = birthParts.day;
  const nextBdayMonth = birthParts.month;
  if (birthParts.month === 2 && birthParts.day === 29 && !isLeapYear(nextBdayYear)) {
    nextBdayDay = 28;
  }
  let nextBdayDayNum = dateToDayNumber(nextBdayYear, nextBdayMonth, nextBdayDay);
  if (nextBdayDayNum < targetDayNum) {
    nextBdayYear += 1;
    let bDay = birthParts.day;
    if (birthParts.month === 2 && birthParts.day === 29 && !isLeapYear(nextBdayYear)) {
      bDay = 28;
    }
    nextBdayDayNum = dateToDayNumber(nextBdayYear, nextBdayMonth, bDay);
  }
  const daysUntilNext = nextBdayDayNum - targetDayNum;

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
  if (inputs.birthDate === undefined || inputs.birthDate === null || String(inputs.birthDate).trim() === '') {
    return {
      primary: { id: 'days', label: 'Alter in Tagen', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie ein Geburtsdatum ein.',
    };
  }
  const birthParts = parseDateParts(inputs.birthDate);
  if (!birthParts) {
    return {
      primary: { id: 'days', label: 'Alter in Tagen', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie ein gültiges Geburtsdatum ein.',
    };
  }

  let targetParts = getBerlinTodayParts();
  if (inputs.targetDate !== undefined && inputs.targetDate !== null && String(inputs.targetDate).trim() !== '') {
    const parsedTarget = parseDateParts(inputs.targetDate);
    if (!parsedTarget) {
      return {
        primary: { id: 'days', label: 'Alter in Tagen', value: 0, formattedValue: '-' },
        error: 'Bitte geben Sie ein gültiges Vergleichsdatum (Stichtag) ein.',
      };
    }
    targetParts = parsedTarget;
  }

  const birthDayNum = dateToDayNumber(birthParts.year, birthParts.month, birthParts.day);
  const targetDayNum = dateToDayNumber(targetParts.year, targetParts.month, targetParts.day);

  if (targetDayNum < birthDayNum) {
    return {
      primary: { id: 'days', label: 'Alter in Tagen', value: 0, formattedValue: '-' },
      error: 'Das Vergleichsdatum (Stichtag) darf nicht vor dem Geburtsdatum liegen.',
    };
  }

  const days = targetDayNum - birthDayNum;
  const hours = days * 24;
  const minutes = hours * 60;
  const weeks = Math.floor(days / 7);

  return {
    primary: {
      id: 'days',
      label: 'Alter in Tagen',
      value: days,
      formattedValue: `${formatNumber(days, 0)} Tage`,
      highlight: true,
    },
    secondary: [
      { id: 'hours', label: 'Äquivalent in Stunden (24 h/Tag)', value: hours, formattedValue: `${formatNumber(hours, 0)} Stunden` },
      { id: 'minutes', label: 'Äquivalent in Minuten (1.440 min/Tag)', value: minutes, formattedValue: `${formatNumber(minutes, 0)} Minuten` },
      { id: 'weeks', label: 'Vollendete Lebenswochen', value: weeks, formattedValue: `${formatNumber(weeks, 0)} Wochen` },
    ],
    summaryText: `Vom ${formatDateGerman(birthParts)} bis zum Stichtag (${formatDateGerman(targetParts)}) sind genau ${formatNumber(days, 0)} Kalendertage vergangen. Hinweis: Die Angaben zu Stunden (${formatNumber(hours, 0)} Std.) und Minuten (${formatNumber(minutes, 0)} Min.) sind rechnerische Tagesäquivalente, da ohne genaue Geburtsuhrzeit volle Kalendertage zugrunde gelegt werden.`,
  };
}

export function calculateDateDifference(inputs: Record<string, any>): CalculationResult {
  const includeEndDay = inputs.includeEndDay === true || inputs.includeEndDay === 'true';
  const outputUnit = inputs.outputUnit || 'days';

  const diff = calculateCalendarDiff(
    inputs.startDate || '2026-01-01',
    inputs.endDate || '2026-12-31',
    includeEndDay
  );

  if (!diff) {
    return {
      primary: { id: 'diff', label: 'Differenz', value: 0, formattedValue: '0 Tage' },
      error: 'Ungültige Datumsangaben.',
    };
  }

  const totalDays = diff.totalDays;
  const totalWeeks = diff.totalWeeks;
  const remDays = diff.remDays;
  const years = diff.years;
  const months = diff.months;
  const days = diff.days;
  const totalMonths = years * 12 + months;
  const totalHours = totalDays * 24;

  const startFormatted = formatDateGerman(diff.rawStart);
  const endFormatted = formatDateGerman(diff.rawEnd);

  let primaryVal = totalDays;
  let primaryLabel = 'Tage';
  let primaryFormatted = `${formatNumber(totalDays, 0)} Tage`;

  if (outputUnit === 'detailed') {
    primaryLabel = 'Detaillierte Zeitspanne';
    primaryFormatted = `${years} Jahre, ${months} Monate, ${days} Tage`;
  } else if (outputUnit === 'weeks') {
    primaryLabel = 'Wochen';
    primaryVal = totalWeeks;
    primaryFormatted = `${formatNumber(totalWeeks, 0)} Wochen (${remDays} Resttage)`;
  } else if (outputUnit === 'months') {
    primaryLabel = 'Monate';
    primaryVal = totalMonths;
    primaryFormatted = `ca. ${formatNumber(totalMonths, 0)} Monate`;
  } else if (outputUnit === 'years') {
    const decYears = totalDays / 365.25;
    primaryLabel = 'Jahre';
    primaryVal = parseFloat(decYears.toFixed(2));
    primaryFormatted = `${formatNumber(primaryVal, 2)} Jahre`;
  }

  return {
    primary: {
      id: 'diff',
      label: primaryLabel,
      value: primaryVal,
      formattedValue: primaryFormatted,
      highlight: true,
    },
    secondary: [
      { id: 'totalDays', label: 'Tage gesamt', value: totalDays, formattedValue: `${formatNumber(totalDays, 0)} Tage` },
      { id: 'detailed', label: 'Kalendarische Spanne', value: totalDays, formattedValue: `${years} J, ${months} M, ${days} T` },
      { id: 'weeks', label: 'Wochen & Tage', value: totalWeeks, formattedValue: `${totalWeeks} Wochen und ${remDays} Tage` },
      { id: 'hours', label: 'Stunden gesamt', value: totalHours, formattedValue: `${formatNumber(totalHours, 0)} Std.` },
    ],
    summaryText: `Zwischen dem ${startFormatted} und dem ${endFormatted} liegen ${formatNumber(totalDays, 0)} Tage (${years} Jahre, ${months} Monate und ${days} Tage).${includeEndDay ? ' (inklusive Endtag)' : ''}`,
  };
}

export function calculateWorkdaysAndHolidays(inputs: Record<string, any>): CalculationResult {
  const startStr = inputs.startDate || '2026-02-01';
  const endStr = inputs.endDate || '2026-02-28';
  const start = new Date(startStr);
  const end = new Date(endStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      primary: { id: 'error', label: 'Fehler', value: 0, formattedValue: 'Ungültiges Datum' },
      error: 'Bitte geben Sie ein gültiges Start- und Enddatum ein.',
    };
  }

  const isReversed = end < start;
  const dStart = isReversed ? new Date(end) : new Date(start);
  const dEnd = isReversed ? new Date(start) : new Date(end);

  const boundary = inputs.includeBoundary || 'both';
  const workweek = inputs.workweek || 'mo-sa'; // Default: Mo–Sa für Werktage, Mo–Fr für Arbeitstage
  const excludeHolidays = inputs.excludeHolidays !== false && inputs.excludeHolidays !== 'false';
  const federalState: FederalState = inputs.federalState || 'bundesweit';

  // Aktive Tage (0 = Sonntag, 1 = Montag, ..., 6 = Samstag)
  const activeDays = new Set<number>();
  if (workweek === 'mo-fr') {
    activeDays.add(1).add(2).add(3).add(4).add(5);
  } else if (workweek === 'mo-sa') {
    activeDays.add(1).add(2).add(3).add(4).add(5).add(6);
  } else {
    // Custom
    if (inputs.includeMonday !== false && inputs.includeMonday !== 'false') activeDays.add(1);
    if (inputs.includeTuesday !== false && inputs.includeTuesday !== 'false') activeDays.add(2);
    if (inputs.includeWednesday !== false && inputs.includeWednesday !== 'false') activeDays.add(3);
    if (inputs.includeThursday !== false && inputs.includeThursday !== 'false') activeDays.add(4);
    if (inputs.includeFriday !== false && inputs.includeFriday !== 'false') activeDays.add(5);
    if (inputs.includeSaturday === true || inputs.includeSaturday === 'true') activeDays.add(6);
    if (inputs.includeSunday === true || inputs.includeSunday === 'true') activeDays.add(0);
  }

  // Feiertage für alle Kalenderjahre im Zeitraum laden
  const holidaysMap = new Map<string, string>();
  if (excludeHolidays) {
    for (let y = dStart.getFullYear(); y <= dEnd.getFullYear(); y++) {
      const yearHolidays = getGermanHolidays(y, federalState);
      for (const [k, v] of yearHolidays.entries()) {
        holidaysMap.set(k, v);
      }
    }
  }

  let totalCalendarDays = 0;
  let workdays = 0;
  let saturdays = 0;
  let sundays = 0;
  let holidaysOnWorkdays = 0;
  let holidaysOnFreeDays = 0;

  const cur = new Date(dStart);
  while (cur <= dEnd) {
    const isStartDay = cur.getTime() === dStart.getTime();
    const isEndDay = cur.getTime() === dEnd.getTime();

    let countThisDay = true;
    if (boundary === 'startOnly' && isEndDay && dStart.getTime() !== dEnd.getTime()) countThisDay = false;
    if (boundary === 'endOnly' && isStartDay && dStart.getTime() !== dEnd.getTime()) countThisDay = false;
    if (boundary === 'neither' && (isStartDay || isEndDay) && dStart.getTime() !== dEnd.getTime()) countThisDay = false;

    if (countThisDay) {
      totalCalendarDays++;
      const dayOfWeek = cur.getDay(); // 0 = So, 6 = Sa
      if (dayOfWeek === 6) saturdays++;
      if (dayOfWeek === 0) sundays++;

      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, '0');
      const d = String(cur.getDate()).padStart(2, '0');
      const dateKey = `${y}-${m}-${d}`;

      const isHoliday = holidaysMap.has(dateKey);
      const isRegularWorkday = activeDays.has(dayOfWeek);

      if (isHoliday) {
        if (isRegularWorkday) {
          holidaysOnWorkdays++;
        } else {
          // Feiertag fiel auf einen ohnehin freien Tag (z. B. Samstag oder Sonntag)
          holidaysOnFreeDays++;
        }
      }

      // Ein Tag zählt NUR DANN als Arbeits-/Werktag, wenn er ein aktiver Wochentag UND KEIN Feiertag ist
      if (isRegularWorkday && !isHoliday) {
        workdays++;
      }
    }

    cur.setDate(cur.getDate() + 1);
  }

  const hoursPerDay = parseFloat(inputs.hoursPerDay) || 0;
  const totalHours = hoursPerDay > 0 ? workdays * hoursPerDay : 0;

  // Primäre Benennung
  let primaryLabel = 'Berechnete Tage';
  let unitName = 'Tage';
  if (workweek === 'mo-sa') {
    primaryLabel = 'Gesetzliche Werktage (Mo–Sa)';
    unitName = 'Werktage';
  } else if (workweek === 'mo-fr') {
    primaryLabel = 'Arbeitstage (Mo–Fr)';
    unitName = 'Arbeitstage';
  }

  const secondary = [
    { id: 'totalDays', label: 'Kalendertage gesamt', value: totalCalendarDays, formattedValue: `${totalCalendarDays} Tage` },
    { id: 'calculatedWorkdays', label: primaryLabel, value: workdays, formattedValue: `${workdays} ${unitName}` },
    { id: 'saturdays', label: 'Samstage', value: saturdays, formattedValue: `${saturdays} Tage` },
    { id: 'sundays', label: 'Sonntage', value: sundays, formattedValue: `${sundays} Tage` },
  ];

  if (excludeHolidays) {
    secondary.push({
      id: 'holidaysOnWorkdays',
      label: 'Gesetzliche Feiertage (an Arbeitstagen)',
      value: holidaysOnWorkdays,
      formattedValue: `${holidaysOnWorkdays} Tage`,
    });
    if (holidaysOnFreeDays > 0) {
      secondary.push({
        id: 'holidaysOnFreeDays',
        label: 'Feiertage am Wochenende / freien Tagen',
        value: holidaysOnFreeDays,
        formattedValue: `${holidaysOnFreeDays} Tage (nicht doppelt abgezogen)`,
      });
    }
  }

  if (totalHours > 0) {
    secondary.push({
      id: 'totalHours',
      label: `Arbeitsstunden (${hoursPerDay} Std./Tag)`,
      value: totalHours,
      formattedValue: `${formatNumber(totalHours, 1)} Std.`,
    });
  }

  const stateName = FEDERAL_STATES.find((s) => s.code === federalState)?.name || 'Bundesweit';
  let summary = `Im Zeitraum vom ${formatDateDe(dStart)} bis ${formatDateDe(dEnd)} (${totalCalendarDays} Kalendertage) gibt es ${workdays} ${unitName}.`;
  if (excludeHolidays && holidaysOnWorkdays > 0) {
    summary += ` Dabei wurden ${holidaysOnWorkdays} gesetzliche Feiertage (${stateName}) berücksichtigt.`;
  }
  if (holidaysOnFreeDays > 0) {
    summary += ` ${holidaysOnFreeDays} Feiertag(e) fielen auf ohnehin arbeitsfreie Tage und minderten das Ergebnis nicht doppelt.`;
  }

  return {
    primary: {
      id: 'workdays',
      label: primaryLabel,
      value: workdays,
      formattedValue: `${workdays} ${unitName}`,
      highlight: true,
    },
    secondary,
    summaryText: summary,
  };
}

export function calculateWorkdays(inputs: Record<string, any>): CalculationResult {
  // Arbeitstage-Rechner: Standardmäßig Mo–Fr
  return calculateWorkdaysAndHolidays({
    workweek: 'mo-fr',
    ...inputs,
  });
}

export function calculateDateAdd(inputs: Record<string, any>): CalculationResult {
  if (inputs.startDate === undefined || inputs.startDate === null || String(inputs.startDate).trim() === '') {
    return {
      primary: { id: 'resultDate', label: 'Zieldatum', value: '', formattedValue: '-' },
      error: 'Bitte geben Sie ein Ausgangsdatum ein.',
    };
  }
  const baseParts = parseDateParts(inputs.startDate);
  if (!baseParts) {
    return {
      primary: { id: 'resultDate', label: 'Zieldatum', value: '', formattedValue: '-' },
      error: 'Bitte geben Sie ein gültiges Ausgangsdatum ein.',
    };
  }

  if (inputs.days === undefined || inputs.days === null || String(inputs.days).trim() === '') {
    return {
      primary: { id: 'resultDate', label: 'Zieldatum', value: '', formattedValue: '-' },
      error: 'Bitte geben Sie die Anzahl der Tage ein.',
    };
  }
  const rawDays = Number(inputs.days);
  if (isNaN(rawDays) || !Number.isInteger(rawDays) || rawDays < 0) {
    return {
      primary: { id: 'resultDate', label: 'Zieldatum', value: '', formattedValue: '-' },
      error: 'Bitte geben Sie eine ganze Zahl von Tagen (mindestens 0) ein.',
    };
  }

  const operation = inputs.operation || 'add';
  const dayDelta = operation === 'subtract' ? -rawDays : rawDays;

  const baseDayNum = dateToDayNumber(baseParts.year, baseParts.month, baseParts.day);
  const targetDayNum = baseDayNum + dayDelta;
  const targetParts = dayNumberToDate(targetDayNum);

  const weekdayName = getGermanWeekday(targetParts.year, targetParts.month, targetParts.day);
  const kw = getISOWeekFromParts(targetParts.year, targetParts.month, targetParts.day);
  const pad = (n: number) => (n < 10 ? '0' + n : String(n));
  const targetIso = `${targetParts.year}-${pad(targetParts.month)}-${pad(targetParts.day)}`;
  const targetFormatted = formatDateGerman(targetParts);
  const baseFormatted = formatDateGerman(baseParts);

  return {
    primary: {
      id: 'resultDate',
      label: 'Berechnetes Datum',
      value: targetIso,
      formattedValue: targetFormatted,
      highlight: true,
    },
    secondary: [
      { id: 'weekday', label: 'Wochentag', value: weekdayName, formattedValue: weekdayName },
      { id: 'delta', label: 'Verschiebung', value: dayDelta, formattedValue: `${dayDelta >= 0 ? '+' : ''}${dayDelta} Tage` },
      { id: 'calendarWeek', label: 'Kalenderwoche', value: kw, formattedValue: `KW ${kw}` },
    ],
    summaryText: `${baseFormatted} ${dayDelta >= 0 ? 'plus' : 'minus'} ${rawDays} Tage ergibt ${weekdayName}, den ${targetFormatted}.`,
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

export function calculateArbeitszeit(inputs: Record<string, any>): CalculationResult {
  const time1 = (inputs.startTime || '08:00').toString().trim();
  const time2 = (inputs.endTime || '16:30').toString().trim();

  // Validate time format (HH:MM or H:MM)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  if (!timeRegex.test(time1) || !timeRegex.test(time2)) {
    return {
      primary: { id: 'duration', label: 'Netto-Arbeitszeit', value: 0, formattedValue: '0 Std. 0 Min.' },
      error: 'Bitte geben Sie gültige Uhrzeiten für Arbeitsbeginn und Arbeitsende im Format HH:MM ein.',
    };
  }

  // Parse pause minutes: support array 'pauses', individual 'pause1..4', or 'pauseMinutes'
  let pauseList: number[] = [];
  if (Array.isArray(inputs.pauses)) {
    pauseList = inputs.pauses.map((p: any) => typeof p === 'number' ? p : parseFloat(p));
  } else if (inputs.pause1 !== undefined || inputs.pause2 !== undefined || inputs.pause3 !== undefined || inputs.pause4 !== undefined) {
    if (inputs.pause1 !== undefined && inputs.pause1 !== '') pauseList.push(parseFloat(inputs.pause1));
    if (inputs.pause2 !== undefined && inputs.pause2 !== '') pauseList.push(parseFloat(inputs.pause2));
    if (inputs.pause3 !== undefined && inputs.pause3 !== '') pauseList.push(parseFloat(inputs.pause3));
    if (inputs.pause4 !== undefined && inputs.pause4 !== '') pauseList.push(parseFloat(inputs.pause4));
  } else if (inputs.pauseMinutes !== undefined && inputs.pauseMinutes !== '') {
    pauseList = [parseFloat(inputs.pauseMinutes)];
  } else {
    pauseList = [0];
  }

  // Check for NaN or negative breaks
  for (const p of pauseList) {
    if (isNaN(p) || p < 0) {
      return {
        primary: { id: 'duration', label: 'Netto-Arbeitszeit', value: 0, formattedValue: '0 Std. 0 Min.' },
        error: 'Pausenzeiten dürfen nicht negativ oder ungültig sein.',
      };
    }
  }

  const totalPause = pauseList.reduce((acc, curr) => acc + curr, 0);

  // Parse target hours (default 8 if not specified, or explicit null)
  let targetHours: number | null = null;
  if (inputs.targetHours !== undefined && inputs.targetHours !== null && inputs.targetHours !== '') {
    const parsedTarget = parseFloat(inputs.targetHours);
    if (isNaN(parsedTarget) || parsedTarget < 0 || parsedTarget > 24) {
      return {
        primary: { id: 'duration', label: 'Netto-Arbeitszeit', value: 0, formattedValue: '0 Std. 0 Min.' },
        error: 'Bitte geben Sie eine gültige Sollarbeitszeit zwischen 0 und 24 Stunden an.',
      };
    }
    targetHours = parsedTarget;
  }

  const [h1, m1] = time1.split(':').map((v: string) => parseInt(v, 10));
  const [h2, m2] = time2.split(':').map((v: string) => parseInt(v, 10));

  let totalMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
  const isOvernight = totalMinutes <= 0;
  if (isOvernight) {
    totalMinutes += 24 * 60; // Automatic overnight handling (ends on next day)
  }

  if (totalPause > totalMinutes) {
    return {
      primary: { id: 'duration', label: 'Netto-Arbeitszeit', value: 0, formattedValue: '0 Std. 0 Min.' },
      error: `Die gesamte Pausenzeit (${totalPause} Min.) darf nicht länger als die Bruttoarbeitszeit (${Math.floor(totalMinutes / 60)} Std. ${totalMinutes % 60} Min.) sein.`,
    };
  }

  const effectiveMinutes = Math.max(0, totalMinutes - totalPause);
  const effHours = Math.floor(effectiveMinutes / 60);
  const effRemainingMin = effectiveMinutes % 60;
  const decimalHours = effectiveMinutes / 60;
  const grossHours = totalMinutes / 60;

  // Legal break guidance (§ 4 ArbZG):
  // - More than 6 to 9 hours: at least 30 minutes break
  // - More than 9 hours: at least 45 minutes break
  let warningMessage: string | undefined;
  if (grossHours > 9 && totalPause < 45) {
    warningMessage = `Hinweis zur Orientierung, keine Rechtsberatung: Gemäß § 4 ArbZG ist bei mehr als 9 Stunden Arbeitszeit eine Ruhepause von mindestens 45 Minuten gesetzlich vorgeschrieben (aktuelle Pause: ${totalPause} Min.).`;
  } else if (grossHours > 6 && grossHours <= 9 && totalPause < 30) {
    warningMessage = `Hinweis zur Orientierung, keine Rechtsberatung: Gemäß § 4 ArbZG ist bei mehr als 6 bis 9 Stunden Arbeitszeit eine Ruhepause von mindestens 30 Minuten gesetzlich vorgeschrieben (aktuelle Pause: ${totalPause} Min.).`;
  }

  if (decimalHours > 10) {
    const maxHourNote = `Hinweis zur Orientierung (§ 3 ArbZG): Die werktägliche Arbeitszeit darf 10 Stunden grundsätzlich nicht überschreiten (aktuelle Nettozeit: ${formatNumber(decimalHours, 2)} Std.).`;
    warningMessage = warningMessage ? `${warningMessage} ${maxHourNote}` : maxHourNote;
  }

  const secondary: ResultItem[] = [
    {
      id: 'grossMinutes',
      label: 'Bruttoarbeitszeit',
      value: grossHours,
      formattedValue: `${Math.floor(totalMinutes / 60)} Std. ${totalMinutes % 60} Min. (${formatNumber(grossHours, 2)} Std.)`,
    },
    {
      id: 'pause',
      label: 'Gesamte Pausenzeit',
      value: totalPause,
      formattedValue: `${totalPause} Min. (${formatNumber(totalPause / 60, 2)} Std.)`,
    },
    {
      id: 'decimal',
      label: 'Nettoarbeitszeit (Dezimal)',
      value: decimalHours,
      formattedValue: `${formatNumber(decimalHours, 2, 2)} Std.`,
      highlight: true,
    },
  ];

  if (targetHours !== null) {
    secondary.push({
      id: 'targetHours',
      label: 'Sollarbeitszeit',
      value: targetHours,
      formattedValue: `${formatNumber(targetHours, 2)} Std.`,
    });

    const overtimeHours = decimalHours - targetHours;
    let formattedDiff = '';
    if (overtimeHours > 0.001) {
      formattedDiff = `+${formatNumber(overtimeHours, 2, 2)} Std. (Überstunden)`;
    } else if (overtimeHours < -0.001) {
      formattedDiff = `${formatNumber(overtimeHours, 2, 2)} Std. (Minusstunden)`;
    } else {
      formattedDiff = '0,00 Std. (Ausgeglichen)';
    }
    secondary.push({
      id: 'overtime',
      label: 'Überstunden / Minusstunden',
      value: overtimeHours,
      formattedValue: formattedDiff,
    });
  }

  if (isOvernight) {
    secondary.push({
      id: 'shiftType',
      label: 'Schichtart',
      value: 'overnight',
      formattedValue: 'Nachtschicht / Folgetag (+1 Tag)',
      helpText: 'Arbeitsende liegt am Folgetag nach Mitternacht.',
    });
  }

  secondary.push({
    id: 'disclaimer',
    label: 'Rechtlicher Hinweis',
    value: 0,
    formattedValue: 'Orientierungshilfe nach ArbZG; Tarifverträge & Betriebsvereinbarungen können abweichen.',
  });

  let summary = `Zwischen ${time1} Uhr und ${time2} Uhr${isOvernight ? ' (Folgetag)' : ''} beträgt Ihre Bruttoanwesenheit ${Math.floor(totalMinutes / 60)} Std. ${totalMinutes % 60} Min. Nach Abzug von ${totalPause} Min. Pause verbleiben genau ${effHours} Std. ${effRemainingMin} Min. Nettoarbeitszeit (${formatNumber(decimalHours, 2)} Industriestunden).`;
  if (targetHours !== null) {
    const diff = decimalHours - targetHours;
    summary += diff >= 0
      ? ` Gegenüber der vereinbarten Sollarbeitszeit (${formatNumber(targetHours, 2)} Std.) haben Sie ${formatNumber(diff, 2)} Überstunden geleistet.`
      : ` Gegenüber der vereinbarten Sollarbeitszeit (${formatNumber(targetHours, 2)} Std.) verbleiben ${formatNumber(Math.abs(diff), 2)} Minusstunden.`;
  }

  return {
    primary: {
      id: 'duration',
      label: 'Netto-Arbeitszeit',
      value: decimalHours,
      formattedValue: `${effHours} Std. ${effRemainingMin} Min.`,
      highlight: true,
    },
    secondary,
    summaryText: summary,
    warning: warningMessage,
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
