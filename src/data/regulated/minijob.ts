/**
 * Mindestlohn und Minijob-Grenze nach Gültigkeitszeitraum.
 *
 * Die Minijob-Grenze ist dynamisch (§ 8 Abs. 1a SGB IV): Mindestlohn × 130 / 3, auf volle Euro aufgerundet.
 * Sie entspricht damit 10 Wochenstunden zum Mindestlohn. Der Mindestlohn für 2026 und 2027 ist in der
 * Fünften Mindestlohnanpassungsverordnung festgelegt (13,90 € ab 1.1.2026, 14,60 € ab 1.1.2027).
 *
 * Neue Zeiträume einfach unten anhängen – getMinijobPeriod() wählt automatisch nach dem Datum.
 */
export interface MinijobPeriod {
  /** Erster Gültigkeitstag, YYYY-MM-DD */
  validFrom: string;
  year: number;
  mindestlohn: number;
  grenze: number;
}

export const MINIJOB_PERIODS: readonly MinijobPeriod[] = [
  { validFrom: '2025-01-01', year: 2025, mindestlohn: 12.82, grenze: 556 },
  { validFrom: '2026-01-01', year: 2026, mindestlohn: 13.9, grenze: 603 },
  { validFrom: '2027-01-01', year: 2027, mindestlohn: 14.6, grenze: 633 },
];

/** Wochen pro Monat in der gesetzlichen Formel (13 Wochen / 3 Monate). */
export const WEEKS_PER_MONTH = 13 / 3;

/** Minijob-Grenze aus dem Mindestlohn: × 130 / 3, auf volle Euro aufgerundet (§ 8 Abs. 1a SGB IV). */
export function minijobGrenzeFromMindestlohn(mindestlohn: number): number {
  return Math.ceil(Math.round(mindestlohn * 130 * 100) / 3 / 100);
}

/** Today's date in Germany as YYYY-MM-DD (the switch happens at midnight German time). */
export function todayInGermany(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

/** The period valid on the given day (YYYY-MM-DD), defaulting to today in Germany. */
export function getMinijobPeriod(day: string = todayInGermany()): MinijobPeriod {
  let current = MINIJOB_PERIODS[0];
  for (const p of MINIJOB_PERIODS) if (p.validFrom <= day) current = p;
  return current;
}

export function getMinijobPeriodByYear(year: number): MinijobPeriod | undefined {
  return MINIJOB_PERIODS.find((p) => p.year === year);
}
