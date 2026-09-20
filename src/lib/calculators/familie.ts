import { CalculationResult } from '@/types/calculator';
import { formatDateDe } from '@/lib/formatters';

export function calculatePregnancyDueDate(inputs: Record<string, any>): CalculationResult {
  const lastPeriodStr = inputs.lastPeriodDate || '2026-01-01';
  const cycleDays = parseInt(inputs.cycleLength || '28', 10);

  const lastPeriod = new Date(lastPeriodStr);
  if (isNaN(lastPeriod.getTime())) {
    return {
      primary: { id: 'dueDate', label: 'Geburtstermin', value: '', formattedValue: '-' },
      error: 'Bitte ein gültiges Datum der letzten Periode angeben.',
    };
  }

  // Erweiterte Naegele-Regel:
  // ET = Erster Tag der letzten Regelblutung + 7 Tage - 3 Monate + 1 Jahr + (Zyklusdauer - 28 Tage)
  // Rechnerisch: + 280 Tage + (Zyklusdauer - 28)
  const daysOffset = 280 + (cycleDays - 28);
  const dueDate = new Date(lastPeriod);
  dueDate.setDate(dueDate.getDate() + daysOffset);

  // Aktueller SSW-Fortschritt
  const today = new Date();
  const diffTime = today.getTime() - lastPeriod.getTime();
  const elapsedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const currentWeeks = Math.floor(elapsedDays / 7);
  const currentExtraDays = elapsedDays % 7;

  let trimester = '1. Trimester (Frühschwangerschaft)';
  if (currentWeeks >= 28) {
    trimester = '3. Trimester';
  } else if (currentWeeks >= 13) {
    trimester = '2. Trimester';
  }

  const daysRemaining = Math.max(0, Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  return {
    primary: {
      id: 'dueDate',
      label: 'Voraussichtlicher Entbindungstermin (ET)',
      value: dueDate.toISOString().split('T')[0],
      formattedValue: formatDateDe(dueDate),
      highlight: true,
    },
    secondary: [
      { id: 'ssw', label: 'Aktuelle Schwangerschaftswoche', value: `${currentWeeks}+${currentExtraDays}`, formattedValue: currentWeeks >= 0 && currentWeeks <= 42 ? `SSW ${currentWeeks + 1} (${currentWeeks}+${currentExtraDays})` : 'Vor Beginn / Überschritten' },
      { id: 'trimester', label: 'Aktuelles Trimester', value: trimester, formattedValue: trimester },
      { id: 'remainingDays', label: 'Verbleibende Tage bis zum Termin', value: daysRemaining, formattedValue: `${daysRemaining} Tage` },
      { id: 'formula', label: 'Medizinische Formel', value: 'Naegele-Regel', formattedValue: 'Erweiterte Naegele-Regel (Zykluskorrektur)' },
    ],
    summaryText: `Nach der erweiterten Naegele-Regel liegt Ihr errechneter Geburtstermin am ${formatDateDe(dueDate)}. Sie befinden sich aktuell in der ${currentWeeks + 1}. SSW (${trimester}).`,
  };
}

export function calculateFertileDays(inputs: Record<string, any>): CalculationResult {
  const lastPeriodStr = inputs.lastPeriodDate || '2026-03-01';
  const cycleDays = parseInt(inputs.cycleLength || '28', 10);

  const lastPeriod = new Date(lastPeriodStr);
  if (isNaN(lastPeriod.getTime()) || cycleDays < 21 || cycleDays > 45) {
    return {
      primary: { id: 'ovulation', label: 'Eisprung', value: '', formattedValue: '-' },
      error: 'Bitte ein gültiges Datum und eine typische Zykluslänge (21–45 Tage) angeben.',
    };
  }

  // Der Eisprung findet typischerweise ca. 14 Tage VOR der nächsten Regel statt:
  const ovulationDayOffset = cycleDays - 14;
  const ovulationDate = new Date(lastPeriod);
  ovulationDate.setDate(ovulationDate.getDate() + ovulationDayOffset);

  // Fruchtbares Fenster: 5 Tage vor dem Eisprung bis 1 Tag nach dem Eisprung
  const fertileStart = new Date(ovulationDate);
  fertileStart.setDate(fertileStart.getDate() - 5);

  const fertileEnd = new Date(ovulationDate);
  fertileEnd.setDate(fertileEnd.getDate() + 1);

  // Nächste Periode
  const nextPeriod = new Date(lastPeriod);
  nextPeriod.setDate(nextPeriod.getDate() + cycleDays);

  return {
    primary: {
      id: 'ovulationDate',
      label: 'Voraussichtlicher Tag des Eisprungs (Ovulation)',
      value: ovulationDate.toISOString().split('T')[0],
      formattedValue: formatDateDe(ovulationDate),
      highlight: true,
    },
    secondary: [
      { id: 'fertileWindow', label: 'Fruchtbare Tage (höchste Wahrscheinlichkeit)', value: 'window', formattedValue: `${formatDateDe(fertileStart)} bis ${formatDateDe(fertileEnd)}` },
      { id: 'nextPeriod', label: 'Voraussichtlicher Beginn nächster Periode', value: formatDateDe(nextPeriod), formattedValue: formatDateDe(nextPeriod) },
      { id: 'disclaimer', label: 'Hinweis', value: 'Orientierung', formattedValue: 'Nicht zur Verhütung geeignet, dient der Zyklusorientierung.' },
    ],
    summaryText: `Ihr nächster Eisprung wird für den ${formatDateDe(ovulationDate)} erwartet. Das fruchtbare Fenster umfasst den Zeitraum vom ${formatDateDe(fertileStart)} bis zum ${formatDateDe(fertileEnd)}.`,
  };
}
