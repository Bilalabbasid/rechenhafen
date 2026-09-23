/**
 * RechenHafen — Gesetzliche Feiertage in Deutschland
 * Exakte Berechnung aller bundesweiten und länderspezifischen Feiertage nach deutschem Recht.
 * Enthält Gaußsche Osterformel für bewegliche Feiertage.
 */

export type FederalState =
  | 'bundesweit'
  | 'BW' // Baden-Württemberg
  | 'BY' // Bayern
  | 'BE' // Berlin
  | 'BB' // Brandenburg
  | 'HB' // Bremen
  | 'HH' // Hamburg
  | 'HE' // Hessen
  | 'MV' // Mecklenburg-Vorpommern
  | 'NI' // Niedersachsen
  | 'NW' // Nordrhein-Westfalen
  | 'RP' // Rheinland-Pfalz
  | 'SL' // Saarland
  | 'SN' // Sachsen
  | 'ST' // Sachsen-Anhalt
  | 'SH' // Schleswig-Holstein
  | 'TH'; // Thüringen

export const FEDERAL_STATES: { code: FederalState; name: string }[] = [
  { code: 'bundesweit', name: 'Bundesweit (nur bundeseinheitliche Feiertage)' },
  { code: 'BW', name: 'Baden-Württemberg' },
  { code: 'BY', name: 'Bayern' },
  { code: 'BE', name: 'Berlin' },
  { code: 'BB', name: 'Brandenburg' },
  { code: 'HB', name: 'Bremen' },
  { code: 'HH', name: 'Hamburg' },
  { code: 'HE', name: 'Hessen' },
  { code: 'MV', name: 'Mecklenburg-Vorpommern' },
  { code: 'NI', name: 'Niedersachsen' },
  { code: 'NW', name: 'Nordrhein-Westfalen' },
  { code: 'RP', name: 'Rheinland-Pfalz' },
  { code: 'SL', name: 'Saarland' },
  { code: 'SN', name: 'Sachsen' },
  { code: 'ST', name: 'Sachsen-Anhalt' },
  { code: 'SH', name: 'Schleswig-Holstein' },
  { code: 'TH', name: 'Thüringen' },
];

/**
 * Berechnet das Osterdatum (Ostersonntag) nach dem Gaußschen Oster-Algorithmus (Gregorianischer Kalender).
 */
export function getEasterSunday(year: number): Date {
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
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = März, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(Date.UTC(year, month - 1, day));
}

function formatDateKey(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number): Date {
  const res = new Date(date.getTime());
  res.setUTCDate(res.getUTCDate() + days);
  return res;
}

/**
 * Gibt den Buß- und Bettag (Mittwoch vor dem 23. November) für ein Jahr zurück (nur in Sachsen gesetzlicher Feiertag).
 */
export function getBussUndBettag(year: number): Date {
  const nov23 = new Date(Date.UTC(year, 10, 23));
  // Wochentag von 23. November: 0 = Sonntag, 1 = Montag, ..., 3 = Mittwoch
  const dayOfWeek = nov23.getUTCDay();
  // Wenn der 23. Nov ein Mittwoch (3) ist, liegt der Buß- und Bettag eine Woche vorher (am 16. Nov).
  // Andernfalls subtrahieren wir bis zum vorherigen Mittwoch.
  let diff = (dayOfWeek - 3 + 7) % 7;
  if (diff === 0) diff = 7;
  return addDays(nov23, -diff);
}

/**
 * Erzeugt die vollständige Liste der gesetzlichen Feiertage für ein Kalenderjahr und Bundesland.
 * Gibt eine Map von 'YYYY-MM-DD' auf Feiertagsbezeichnung zurück.
 */
export function getGermanHolidays(year: number, state: FederalState = 'bundesweit'): Map<string, string> {
  const holidays = new Map<string, string>();
  const easter = getEasterSunday(year);

  const add = (date: Date, name: string) => {
    holidays.set(formatDateKey(date), name);
  };

  // 1. Bundesweite feste Feiertage
  add(new Date(Date.UTC(year, 0, 1)), 'Neujahr');
  add(new Date(Date.UTC(year, 4, 1)), 'Tag der Arbeit');
  add(new Date(Date.UTC(year, 9, 3)), 'Tag der Deutschen Einheit');
  add(new Date(Date.UTC(year, 11, 25)), '1. Weihnachtstag');
  add(new Date(Date.UTC(year, 11, 26)), '2. Weihnachtstag');

  // 2. Bundesweite bewegliche Feiertage (abhängig von Ostern)
  add(addDays(easter, -2), 'Karfreitag');
  add(addDays(easter, 1), 'Ostermontag');
  add(addDays(easter, 39), 'Christi Himmelfahrt');
  add(addDays(easter, 50), 'Pfingstmontag');

  if (state === 'bundesweit') {
    return holidays;
  }

  // 3. Länderspezifische Feiertage

  // Heilige Drei Könige (06. Januar): BW, BY, ST
  if (state === 'BW' || state === 'BY' || state === 'ST') {
    add(new Date(Date.UTC(year, 0, 6)), 'Heilige Drei Könige');
  }

  // Internationaler Frauentag (08. März): BE, MV
  if (state === 'BE' || state === 'MV') {
    add(new Date(Date.UTC(year, 2, 8)), 'Internationaler Frauentag');
  }

  // Fronleichnam (Ostern + 60 Tage): BW, BY, HE, NW, RP, SL (in SN & TH in katholischen Gemeinden)
  if (state === 'BW' || state === 'BY' || state === 'HE' || state === 'NW' || state === 'RP' || state === 'SL') {
    add(addDays(easter, 60), 'Fronleichnam');
  }

  // Mariä Himmelfahrt (15. August): SL (im Saarland landesweit, in BY in kath. Gemeinden)
  if (state === 'SL') {
    add(new Date(Date.UTC(year, 7, 15)), 'Mariä Himmelfahrt');
  }

  // Weltkindertag (20. September): TH
  if (state === 'TH') {
    add(new Date(Date.UTC(year, 8, 20)), 'Weltkindertag');
  }

  // Reformationstag (31. Oktober): BB, HB, HH, MV, NI, SN, ST, SH, TH
  if (
    state === 'BB' ||
    state === 'HB' ||
    state === 'HH' ||
    state === 'MV' ||
    state === 'NI' ||
    state === 'SN' ||
    state === 'ST' ||
    state === 'SH' ||
    state === 'TH'
  ) {
    add(new Date(Date.UTC(year, 9, 31)), 'Reformationstag');
  }

  // Allerheiligen (01. November): BW, BY, NW, RP, SL
  if (state === 'BW' || state === 'BY' || state === 'NW' || state === 'RP' || state === 'SL') {
    add(new Date(Date.UTC(year, 10, 1)), 'Allerheiligen');
  }

  // Buß- und Bettag (Mittwoch vor dem 23. November): SN
  if (state === 'SN') {
    add(getBussUndBettag(year), 'Buß- und Bettag');
  }

  return holidays;
}

/**
 * Prüft, ob ein gegebenes Datum ein gesetzlicher Feiertag ist.
 */
export function isGermanHoliday(date: Date, state: FederalState = 'bundesweit'): { isHoliday: boolean; name?: string } {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const key = `${y}-${m}-${d}`;

  const holidays = getGermanHolidays(y, state);
  if (holidays.has(key)) {
    return { isHoliday: true, name: holidays.get(key) };
  }
  return { isHoliday: false };
}
