import { PageContentMap } from './types';
import { CalculationResult } from '@/types/calculator';
import { DATUM_ZEIT_CALCULATORS } from '../datumZeit';
import { EXTRA_DATUM_MATH } from '../extra/datumMath';
import { FEDERAL_STATES, FederalState } from '@/lib/holidays';
import { dateToDayNumber } from '@/lib/calculators/dateMath';
import { formatNumber } from '@/lib/formatters';

// ---------------------------------------------------------------------------
// Helpers: every number below is computed with the calculators' own engines at module load.
// Pages whose engine depends on "today" use fixed reference dates (mostly 01.01.2027), so the
// text does not change from build to build.
// ---------------------------------------------------------------------------
const ALL = [...DATUM_ZEIT_CALCULATORS, ...EXTRA_DATUM_MATH];
function run(slug: string, inputs: Record<string, any>): CalculationResult {
  const calc = ALL.find((c) => c.slug === slug);
  if (!calc || !calc.calculate) throw new Error(`page-content/datum: calculator ${slug} not found`);
  const r = calc.calculate(inputs) as CalculationResult;
  if (r.error) throw new Error(`page-content/datum: ${slug} returned error ${r.error}`);
  return r;
}
function num(r: CalculationResult, id: string): number {
  if (r.primary.id === id) return Number(r.primary.value);
  return Number(r.secondary?.find((s) => s.id === id)?.value ?? NaN);
}
function txt(r: CalculationResult, id: string): string {
  if (r.primary.id === id) return String(r.primary.formattedValue);
  return String(r.secondary?.find((s) => s.id === id)?.formattedValue ?? '');
}
const n0 = (v: number) => formatNumber(v, 0);
const n2 = (v: number) => formatNumber(v, 2, 2);

/** Date shift with the Datum-plus-Tage engine: German date, weekday, KW and ISO value. */
function shift(startIso: string, days: number) {
  const r = run('datum-plus-tage', { operation: days < 0 ? 'subtract' : 'add', startDate: startIso, days: Math.abs(days) });
  return { iso: String(r.primary.value), de: String(r.primary.formattedValue), weekday: txt(r, 'weekday'), kw: num(r, 'calendarWeek') };
}
const weekdayOf = (iso: string) => shift(iso, 0).weekday;
const deDate = (iso: string) => shift(iso, 0).de;
/** Exact age (years/months/days) with the Altersrechner engine. */
function ageAt(birthIso: string, targetIso: string) {
  const r = run('altersrechner', { birthDate: birthIso, targetDate: targetIso });
  return { label: String(r.primary.formattedValue), years: num(r, 'years'), days: num(r, 'totalDays'), untilNext: num(r, 'daysUntilNext') };
}
const daysBetween = (a: string, b: string) => num(run('alter-in-tagen', { birthDate: a, targetDate: b }), 'days');

// ---------------------------------------------------------------------------
// Lebenszeit in Stunden (Stichtag 01.01.2027)
// ---------------------------------------------------------------------------
const LZ_REF = '2027-01-01';
const LZ_AGES = [20, 30, 40, 50, 60, 70, 80];
const LZ_TABLE = LZ_AGES.map((age) => {
  const r = run('lebenszeit-in-stunden', { birthDate: `${2027 - age}-01-01`, targetDate: LZ_REF });
  return `| ${age} Jahre (geb. 01.01.${2027 - age}) | ${txt(r, 'days')} | ${txt(r, 'hours')} | ${txt(r, 'heart')} |`;
}).join('\n');
const LZ_30 = run('lebenszeit-in-stunden', { birthDate: '1997-01-01', targetDate: LZ_REF });
const LZ_30_HOURS = num(LZ_30, 'hours');
const LZ_BIRTH = '2000-01-01';
const lzMilestone = (h: number) => {
  const fullDays = Math.floor(h / 24);
  const restHours = h - fullDays * 24;
  const d = shift(LZ_BIRTH, fullDays);
  return { h, fullDays, restHours, date: d.de, weekday: d.weekday, age: ageAt(LZ_BIRTH, d.iso).label };
};
const LZ_MS = [100000, 250000, 500000].map(lzMilestone);
const LZ_EX = run('lebenszeit-in-stunden', { birthDate: '1985-08-15', targetDate: LZ_REF });

// ---------------------------------------------------------------------------
// Alter in Tagen
// ---------------------------------------------------------------------------
const AT_BIRTH = '1995-05-15';
const AT_TABLE = [5000, 10000, 15000, 20000, 25000, 30000].map((d) => {
  const s = shift(AT_BIRTH, d);
  return `| ${n0(d)}. Lebenstag | ${s.de} | ${s.weekday} | ${ageAt(AT_BIRTH, s.iso).label} |`;
}).join('\n');
const AT_10K = shift(AT_BIRTH, 10000);
const AT_18_JAN = daysBetween('2000-01-01', '2018-01-01');
const AT_18_MAR = daysBetween('2000-03-01', '2018-03-01');
const AT_50 = daysBetween('1977-01-01', '2027-01-01');
const AT_80 = daysBetween('1947-01-01', '2027-01-01');

// ---------------------------------------------------------------------------
// Altersunterschied
// ---------------------------------------------------------------------------
const AU_P1 = '1988-04-12';
const AU_P2 = '1992-09-25';
const AU_RES = run('altersunterschied', { datePerson1: AU_P1, datePerson2: AU_P2 });
const AU_DAYS = num(AU_RES, 'totalDays');
const AU_HALF = shift(AU_P2, AU_DAYS);
const AU_HALF_P1_DAYS = daysBetween(AU_P1, AU_HALF.iso);
const AU_TABLE = [20, 30, 50, 80].map((age) => {
  const stichtag = `${1988 + age}-04-12`;
  const younger = ageAt(AU_P2, stichtag);
  const share = (AU_DAYS / younger.days) * 100;
  return `| ${deDate(stichtag)} | ${age} Jahre | ${younger.label} | ${formatNumber(share, 1)} % |`;
}).join('\n');
const AU_MONTHEND = run('altersunterschied', { datePerson1: '1990-01-31', datePerson2: '1990-03-01' });
const AU_TWINS = run('altersunterschied', { datePerson1: '2026-12-31', datePerson2: '2027-01-01' });
const AU_LEAP = num(run('altersunterschied', { datePerson1: '2000-01-01', datePerson2: '2001-01-01' }), 'totalDays');
const AU_NOLEAP = num(run('altersunterschied', { datePerson1: '2001-01-01', datePerson2: '2002-01-01' }), 'totalDays');

// ---------------------------------------------------------------------------
// Wochenrechner (Kalenderwoche nach ISO 8601)
// ---------------------------------------------------------------------------
const kwOf = (iso: string) => num(run('wochenrechner', { date: iso }), 'kw');
function mondayOfKw1(year: number): string {
  // Montag der KW 1 liegt zwischen dem 29.12. des Vorjahres und dem 04.01.
  for (let off = 0; off < 7; off++) {
    const s = shift(`${year - 1}-12-29`, off);
    if (s.weekday === 'Montag') return s.iso;
  }
  throw new Error('page-content/datum: no Monday found');
}
const WR_TABLE = [2026, 2027, 2028, 2029, 2030, 2031, 2032].map((y) => {
  const mon = mondayOfKw1(y);
  return `| ${y} | ${weekdayOf(`${y}-01-01`)} | ${deDate(mon)} | ${kwOf(`${y}-12-28`)} |`;
}).join('\n');
const WR_53 = Array.from({ length: 21 }, (_, i) => 2020 + i).filter((y) => kwOf(`${y}-12-28`) === 53);
const WR_KW38_MON = shift(mondayOfKw1(2026), 37 * 7);
const WR_KW38_SUN = shift(WR_KW38_MON.iso, 6);
const WR_KW38_CHECK = kwOf(WR_KW38_MON.iso);
const WR_KW2_MON = shift(mondayOfKw1(2027), 7);
const WR_KW2_FRI = shift(WR_KW2_MON.iso, 4);
const WR_EX_DAY = '2026-09-19';
const WR_EX_KW = kwOf(WR_EX_DAY);
const WR_EX_WD = weekdayOf(WR_EX_DAY);
const ISO_WD = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
const WR_EX_WD_NUM = ISO_WD.indexOf(WR_EX_WD) + 1;

// ---------------------------------------------------------------------------
// Dienstjubiläum
// ---------------------------------------------------------------------------
const DJ_TABLE = ['2001-04-01', '2008-02-29', '2010-08-01', '1996-10-15'].map((entry) => {
  const r = run('dienstjubilaeum-rechner', { entryDate: entry });
  return `| ${deDate(entry)} | ${txt(r, 'j10')} | ${txt(r, 'j25')} | ${txt(r, 'j40')} |`;
}).join('\n');
const DJ_ENTRY = '2011-09-01';
const DJ_GAP_DAYS = daysBetween('2020-03-01', '2020-08-30') + 1; // 01.03. bis 30.08.2020 einschließlich
const DJ_NORMAL_25 = txt(run('dienstjubilaeum-rechner', { entryDate: DJ_ENTRY }), 'j25');
const DJ_FICT = shift(DJ_ENTRY, DJ_GAP_DAYS);
const DJ_FICT_25 = txt(run('dienstjubilaeum-rechner', { entryDate: DJ_FICT.iso }), 'j25');
const DJ_25_EVE = shift('2036-09-01', -1).de;

// ---------------------------------------------------------------------------
// Zeitdifferenz (Pausen nach § 4 ArbZG)
// ---------------------------------------------------------------------------
const ZD_ROWS: [string, string, number][] = [
  ['07:00', '13:00', 0],
  ['07:00', '13:15', 0],
  ['08:00', '16:30', 30],
  ['07:00', '17:15', 30],
  ['07:00', '17:30', 45],
  ['22:00', '06:30', 30],
];
const ZD_TABLE = ZD_ROWS.map(([s, e, p]) => {
  const r = run('zeitdifferenz-rechner', { startTime: s, endTime: e, pauseMinutes: p });
  const net = num(r, 'duration');
  const required = net > 9 ? 45 : net > 6 ? 30 : 0;
  const status = required === 0 ? 'keine Pause vorgeschrieben' : p >= required ? `${required} Min. eingehalten` : `${required} Min. nötig – zu kurz`;
  return `| ${s}–${e} Uhr | ${p} Min. | ${txt(r, 'duration')} | ${txt(r, 'decimal')} | ${status} |`;
}).join('\n');
const ZD_MAX = run('zeitdifferenz-rechner', { startTime: '06:00', endTime: '16:45', pauseMinutes: 45 });
const ZD_SAME = run('zeitdifferenz-rechner', { startTime: '08:00', endTime: '08:00', pauseMinutes: 0 });
const ZD_BACK = 7.8;
const ZD_BACK_MIN = Math.round((ZD_BACK % 1) * 60);

// ---------------------------------------------------------------------------
// Alter in Wochen (Baby, Geburt am 15.01.2027)
// ---------------------------------------------------------------------------
const AW_BIRTH = '2027-01-15';
const AW_POINTS: [string, string][] = [
  ['1 Monat', '2027-02-15'],
  ['2 Monate', '2027-03-15'],
  ['3 Monate', '2027-04-15'],
  ['4 Monate', '2027-05-15'],
  ['6 Monate', '2027-07-15'],
  ['9 Monate', '2027-10-15'],
  ['12 Monate', '2028-01-15'],
];
const awRun = (target: string) => run('alter-in-wochen', { birthDate: AW_BIRTH, targetDate: target });
const AW_TABLE = AW_POINTS.map(([label, t]) => {
  const r = awRun(t);
  return `| ${label} | ${deDate(t)} | ${txt(r, 'weeks')} | ${txt(r, 'totalDays')} |`;
}).join('\n');
const AW_6M = awRun('2027-07-15');
const AW_1Y = awRun('2028-01-15');
const AW_80 = run('alter-in-wochen', { birthDate: '1947-01-01', targetDate: '2027-01-01' });
const AW_RUNNING = Math.floor(num(awRun('2027-04-15'), 'totalDays') / 7) + 1;

// ---------------------------------------------------------------------------
// Renteneintritt (Geburtsmonat Juni; Werte aus § 235 SGB VI im Rechner)
// ---------------------------------------------------------------------------
const RE_YEARS = [1958, 1959, 1960, 1961, 1962, 1963, 1964, 1970, 1985];
const RE_TABLE = RE_YEARS.map((y) => {
  const r = run('renteneintritt-rechner', { birthYear: y, birthMonth: 6 });
  return `| ${y} | ${txt(r, 'age')} | ${txt(r, 'rentDate')} |`;
}).join('\n');
const RE_1970 = txt(run('renteneintritt-rechner', { birthYear: 1970, birthMonth: 6 }), 'rentDate');
const RE_1970_FIRST = (() => {
  const [, m, y] = RE_1970.split('.').map(Number);
  const prevM = m === 1 ? 12 : m - 1;
  const prevY = m === 1 ? y - 1 : y;
  return `01.${String(prevM).padStart(2, '0')}.${prevY}`;
})();
const RE_1985 = txt(run('renteneintritt-rechner', { birthYear: 1985, birthMonth: 3 }), 'rentDate');
const RE_ZUSCHLAG_12 = 12 * 0.5;

// ---------------------------------------------------------------------------
// Schaltjahr
// ---------------------------------------------------------------------------
const isLeap = (y: number) => run('schaltjahr-rechner', { year: y }).primary.value === 'Ja';
const SJ_LIST = Array.from({ length: 37 }, (_, i) => 2024 + i).filter(isLeap);
const SJ_TABLE = SJ_LIST.map((y) => `| ${y} | ${weekdayOf(`${y}-02-29`)} |`).join('\n');
const SJ_CENTURIES = [2100, 2200, 2300, 2400].map((y) => `${y}: ${isLeap(y) ? 'Schaltjahr' : 'kein Schaltjahr'}`).join(', ');
const SJ_CYCLE = Array.from({ length: 400 }, (_, i) => 2001 + i).filter(isLeap).length;
const SJ_MEAN = 365 + SJ_CYCLE / 400;
const SJ_2028_WD = weekdayOf('2028-02-29');

// ---------------------------------------------------------------------------
// Altersrechner (Geburt am 15.03.2009)
// ---------------------------------------------------------------------------
const AR_BIRTH = '2009-03-15';
const AR_ROWS: [string, string][] = [
  ['2016-03-14', 'noch geschäftsunfähig (unter 7 Jahren, § 104 BGB)'],
  ['2016-03-15', 'beschränkt geschäftsfähig (§ 106 BGB)'],
  ['2023-03-15', 'strafmündig (§ 19 StGB)'],
  ['2027-03-14', 'noch minderjährig'],
  ['2027-03-15', 'volljährig (§ 2 BGB)'],
];
const AR_TABLE = AR_ROWS.map(([d, meaning]) => `| ${deDate(d)} | ${ageAt(AR_BIRTH, d).label} | ${meaning} |`).join('\n');
const AR_LEAP_28 = ageAt('2000-02-29', '2027-02-28');
const AR_LEAP_01 = ageAt('2000-02-29', '2027-03-01');
const AR_MONTHEND = ageAt('1990-01-31', '2026-03-01');

// ---------------------------------------------------------------------------
// Datum plus Tage (Start Montag, 01.02.2027)
// ---------------------------------------------------------------------------
const DP_START = '2027-02-01';
const DP_TABLE = [7, 14, 30, 60, 90, 180, 365].map((d) => {
  const s = shift(DP_START, d);
  const weekend = s.weekday === 'Samstag' || s.weekday === 'Sonntag';
  return `| + ${d} Tage | ${s.de} | ${s.weekday}${weekend ? ' (Wochenende)' : ''} | KW ${s.kw} |`;
}).join('\n');
const DP_30 = shift('2027-01-31', 30);
const DP_SUN = shift('2026-03-01', 14);
const DP_MON = shift('2026-03-01', 15);
const DP_H1 = dateToDayNumber(2027, 7, 1) - dateToDayNumber(2027, 1, 1);
const DP_H2 = dateToDayNumber(2028, 1, 1) - dateToDayNumber(2027, 7, 1);

// ---------------------------------------------------------------------------
// Arbeitstage nach Bundesland
// ---------------------------------------------------------------------------
const workdays = (year: number, state: FederalState) =>
  num(run('arbeitstage-rechner', { startDate: `${year}-01-01`, endDate: `${year}-12-31`, workweek: 'mo-fr', excludeHolidays: true, federalState: state, hoursPerDay: 8 }), 'workdays');
const AT_STATES = FEDERAL_STATES.filter((s) => s.code !== 'bundesweit');
const AT_ROWS = AT_STATES.map((s) => ({ name: s.name, y26: workdays(2026, s.code), y27: workdays(2027, s.code) }));
const AT_STATE_TABLE = AT_ROWS.map((r) => `| ${r.name} | ${r.y26} | ${r.y27} |`).join('\n');
const AT_FED_26 = workdays(2026, 'bundesweit');
const AT_FED_27 = workdays(2027, 'bundesweit');
const AT_MIN_27 = Math.min(...AT_ROWS.map((r) => r.y27));
const AT_MAX_27 = Math.max(...AT_ROWS.map((r) => r.y27));
const AT_MONFRI_27 = num(run('arbeitstage-rechner', { startDate: '2027-01-01', endDate: '2027-12-31', workweek: 'mo-fr', excludeHolidays: false, federalState: 'bundesweit' }), 'workdays');
const AT_MIN_NAMES = AT_ROWS.filter((r) => r.y27 === AT_MIN_27).map((r) => r.name).join(', ');
const AT_NW = AT_ROWS.find((r) => r.name === 'Nordrhein-Westfalen')!;
const AT_2412 = weekdayOf('2027-12-24');
const AT_3112 = weekdayOf('2027-12-31');

// ---------------------------------------------------------------------------
// Tage bis Geburtstag: Wochentag in den nächsten Jahren (Stichtag jeweils 01.01.)
// ---------------------------------------------------------------------------
const gebNext = (birth: string, year: number) => run('tage-bis-geburtstag', { birthDate: birth, referenceDate: `${year}-01-01` });
const GEB_YEARS = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033];
const GEB_TABLE = GEB_YEARS.map((y) => `| ${y} | ${txt(gebNext('1992-08-14', y), 'nextDate')} | ${txt(gebNext('2000-02-29', y), 'nextDate')} |`).join('\n');
const GEB_VORTAG = run('tage-bis-geburtstag', { birthDate: '1996-10-24', referenceDate: '2027-10-23' });
const GEB_TAG = run('tage-bis-geburtstag', { birthDate: '1996-10-24', referenceDate: '2027-10-24' });
const GEB_NACHTAG = run('tage-bis-geburtstag', { birthDate: '1996-10-24', referenceDate: '2027-10-25' });

// ---------------------------------------------------------------------------
// Alter in Monaten: Wochen und Monate nebeneinander (Geburt 01.01.2026)
// ---------------------------------------------------------------------------
const AIM_BIRTH = '2026-01-01';
const aim = (birth: string, target: string) => run('alter-in-monaten', { birthDate: birth, targetDate: target });
const AIM_WEEKS = [4, 8, 13, 17, 26, 39, 52];
const AIM_TABLE = AIM_WEEKS.map((w) => {
  const d = shift(AIM_BIRTH, w * 7);
  const r = aim(AIM_BIRTH, d.iso);
  return `| ${w} Wochen | ${d.de} | ${txt(r, 'completedMonths')} | ${txt(r, 'runningMonth')} |`;
}).join('\n');
const AIM_13_JAN = aim(AIM_BIRTH, shift(AIM_BIRTH, 91).iso);
const AIM_13_JUL = aim('2026-07-01', shift('2026-07-01', 91).iso);
const AIM_31_ANN = aim('2026-08-31', '2027-02-28');
const AIM_31_VOR = aim('2026-08-31', '2027-02-27');
const AIM_31_MAERZ = aim('2026-08-31', '2027-03-31');

// ---------------------------------------------------------------------------
// Tage bis Weihnachten: Wochentage und Adventssonntage
// ---------------------------------------------------------------------------
const XMAS_YEARS = [2026, 2027, 2028, 2029, 2030];
const advent = (year: number) => {
  const heiligabend = `${year}-12-24`;
  const dn = dateToDayNumber(year, 12, 24);
  const sundayOffset = new Date(dn * 86400000).getUTCDay(); // 0 = Sonntag
  const vierter = shift(heiligabend, -sundayOffset);
  const erster = shift(vierter.iso, -21);
  return { year, heiligabend: weekdayOf(heiligabend), erster, vierter, isSunday: sundayOffset === 0 };
};
const XMAS = XMAS_YEARS.map(advent);
const XMAS_TABLE = XMAS.map((a) => `| ${a.year} | ${a.heiligabend} | ${a.erster.de} | ${a.vierter.de} |`).join('\n');
const XMAS_SUNDAY_YEARS = XMAS.filter((a) => a.isSunday).map((a) => a.year);
const XMAS_2026 = XMAS[0];
const XMAS_2026_DAYS = daysBetween(XMAS_2026.erster.iso, '2026-12-24');

export const DATUM_PAGE_CONTENT: PageContentMap = {
  'lebenszeit-in-stunden': {
    sections: [
      {
        title: 'Gelebte Stunden nach Alter (Stichtag 01.01.2027)',
        content: `Damit die Tabelle nicht jeden Tag andere Zahlen zeigt, ist hier ein fester Stichtag gesetzt: der 01.01.2027. Gerechnet wird wie im Rechner: volle Kalendertage mal 24, Herzschläge mit pauschal 70 pro Minute.\n\n| Alter am Stichtag | Lebenstage | Gelebte Stunden | Geschätzte Herzschläge |\n|---|---|---|---|\n${LZ_TABLE}\n\nJedes Gemeinjahr bringt 8.760 Stunden, ein Schaltjahr 8.784. Deshalb wächst die Stundenzahl nicht exakt linear: Wer zehn Jahre älter ist, hat je nach Zahl der dazwischen liegenden Schalttage 87.648 oder 87.672 Stunden mehr hinter sich.`,
      },
      {
        title: 'Wie belastbar sind Herzschlag- und Atemzug-Zahlen?',
        content: `Die Stundenzahl ist exakt, die Herzschläge und Atemzüge sind dagegen nur eine Größenordnung. Der Rechner setzt dauerhaft 70 Schläge und 14 Atemzüge pro Minute an. Tatsächlich schlägt das Herz im Schlaf langsamer, bei Bewegung schneller, und bei Babys und Kindern liegt der Puls deutlich höher als bei Erwachsenen.\n\nWie stark der angenommene Puls das Ergebnis verschiebt, zeigt das Beispiel einer 30-jährigen Person (${n0(LZ_30_HOURS)} Stunden):\n\n- bei 60 Schlägen pro Minute: ca. ${n0(LZ_30_HOURS * 60 * 60)} Herzschläge\n- bei 70 Schlägen pro Minute (Rechnerwert): ca. ${n0(LZ_30_HOURS * 60 * 70)} Herzschläge\n- bei 80 Schlägen pro Minute: ca. ${n0(LZ_30_HOURS * 60 * 80)} Herzschläge\n\nZwischen 60 und 80 Schlägen liegen also rund ${formatNumber((LZ_30_HOURS * 60 * 20) / 1e6, 0)} Millionen Herzschläge Unterschied. Lesen Sie die Schätzung deshalb als anschauliche Zahl, nicht als medizinischen Messwert.`,
      },
    ],
    faqs: [
      {
        question: 'Wann habe ich 100.000 Stunden gelebt?',
        answer: `100.000 Stunden sind ${n0(LZ_MS[0].fullDays)} Tage und ${LZ_MS[0].restHours} Stunden. Wer am 01.01.2000 um 0 Uhr geboren wurde, erreichte diese Marke am ${LZ_MS[0].date} (${LZ_MS[0].weekday}) um ${LZ_MS[0].restHours} Uhr (Alter: ${LZ_MS[0].age}). Die 250.000. Stunde fällt auf den ${LZ_MS[1].date}, die 500.000. Stunde liegt am ${LZ_MS[2].date} (Alter: ${LZ_MS[2].age}).`,
      },
      {
        question: 'Wie viele Stunden hat ein Jahr?',
        answer: `Ein Gemeinjahr hat 365 × 24 = 8.760 Stunden, ein Schaltjahr 366 × 24 = 8.784 Stunden. Über den 400-jährigen Kalenderzyklus gemittelt sind es 8.765,82 Stunden pro Jahr (365,2425 Tage × 24).`,
      },
      {
        question: 'Warum rechnet der Rechner mit vollen Tagen statt mit meiner Geburtsuhrzeit?',
        answer: 'Ohne Uhrzeit ist nur das Datum bekannt, also zählt der Rechner ganze Kalendertage ab dem Geburtstag. Das Ergebnis kann daher um bis zu 23 Stunden vom „echten“ Wert abweichen. Kennen Sie Ihre Geburtszeit, ziehen Sie die Stunden ab, die am Geburtstag vor der Geburt lagen: Bei Geburt um 15 Uhr sind das 15 Stunden weniger.',
      },
    ],
    workedExamples: [
      {
        title: 'Beispiel: Geboren am 15.08.1985, Stichtag 01.01.2027',
        description: `${txt(LZ_EX, 'days')} × 24 ergeben ${txt(LZ_EX, 'hours')}; bei pauschal 70 Schlägen pro Minute sind das ${txt(LZ_EX, 'heart')}.`,
        inputs: { birthDate: '1985-08-15', targetDate: '2027-01-01' },
        resultSummary: txt(LZ_EX, 'hours'),
      },
    ],
  },

  'alter-in-tagen': {
    sections: [
      {
        title: 'Lebenstag-Meilensteine am Beispiel 15.05.1995',
        content: `Runde Lebenstage sind ein beliebter Anlass zum Feiern – nur steht das Datum in keinem Kalender. Für ein Geburtsdatum am 15.05.1995 ergeben sich diese Termine (Geburtstag = Tag 0, wie im Rechner):\n\n| Meilenstein | Datum | Wochentag | Alter an diesem Tag |\n|---|---|---|---|\n${AT_TABLE}\n\nFür Ihr eigenes Datum geben Sie im Feld Geburtsdatum Ihren Geburtstag ein und im Stichtag probeweise ein Datum – oder Sie nutzen den [Datum-plus-Tage-Rechner](/rechner/datum-plus-tage/) und addieren 10.000 Tage zu Ihrem Geburtsdatum.`,
      },
      {
        title: 'Tag 0 oder Tag 1? So vermeiden Sie den häufigsten Zählfehler',
        content: `Der Rechner zieht das Geburtsdatum vom Stichtag ab. Am Tag nach der Geburt ist ein Mensch damit genau 1 Tag alt, am Geburtstag selbst 0 Tage. Manche Apps und Rechner zählen den Geburtstag als „Tag 1“ mit; ihr Ergebnis liegt dann um genau einen Tag höher, und der 10.000. Tag fällt einen Kalendertag früher.\n\nEin zweiter Stolperstein ist die Zahl der Schalttage. Zwischen zwei Geburtstagen liegen nicht immer gleich viele Tage: Wer am 01.01.2000 geboren ist, war am 18. Geburtstag ${n0(AT_18_JAN)} Tage alt, wer am 01.03.2000 geboren ist, am 18. Geburtstag nur ${n0(AT_18_MAR)} Tage – der Schalttag 29.02.2000 lag nur im ersten Fall im gezählten Zeitraum.`,
      },
    ],
    faqs: [
      {
        question: 'An welchem Datum ist mein 10.000. Lebenstag?',
        answer: `Addieren Sie 10.000 Tage zum Geburtsdatum. Bei Geburt am 15.05.1995 ist das der ${AT_10K.de}, ein ${AT_10K.weekday}. Das Alter beträgt dann rund 27 Jahre und 4,5 Monate, weil 10.000 Tage etwa 27,4 Jahren entsprechen.`,
      },
      {
        question: 'Wie viele Tage hat man mit 50 oder 80 Jahren gelebt?',
        answer: `Mit 50 Jahren sind es je nach Lage der Schalttage etwa 18.262 Tage; vom 01.01.1977 bis zum 01.01.2027 sind es genau ${n0(AT_50)} Tage. Mit 80 Jahren (01.01.1947 bis 01.01.2027) sind es ${n0(AT_80)} Tage.`,
      },
      {
        question: 'Wie rechne ich Lebenstage in Jahre um?',
        answer: 'Teilen Sie die Tage durch 365,2425, die mittlere Länge eines gregorianischen Kalenderjahres. 15.000 Tage ÷ 365,2425 ≈ 41,07 Jahre. Für das genaue Alter in Jahren, Monaten und Tagen ist der Altersrechner besser geeignet, weil er die echten Monatslängen berücksichtigt.',
      },
    ],
  },

  altersunterschied: {
    sections: [
      {
        title: 'Wie sich der Abstand im Laufe des Lebens anfühlt – Beispiel 1988/1992',
        content: `Zwischen dem 12.04.1988 und dem 25.09.1992 liegen ${n0(AU_DAYS)} Tage (${AU_RES.primary.formattedValue}). Dieser Abstand bleibt für immer gleich, sein Gewicht nimmt aber ab. Die Tabelle zeigt das Alter der jüngeren Person an runden Geburtstagen der älteren und den Abstand im Verhältnis zum Alter der jüngeren Person:\n\n| Stichtag | Alter Person 1 | Alter Person 2 | Abstand in % des Alters von Person 2 |\n|---|---|---|---|\n${AU_TABLE}\n\nEin besonderer Tag ist der, an dem die jüngere Person genau halb so alt ist wie die ältere. Das ist immer dann der Fall, wenn die jüngere Person so viele Tage alt ist, wie der Altersabstand beträgt: hier am ${AU_HALF.de}. Person 2 ist dann ${n0(AU_DAYS)} Tage alt, Person 1 ${n0(AU_HALF_P1_DAYS)} Tage. Danach wird das Verhältnis nie wieder 1 zu 2.`,
      },
      {
        title: 'Monatsenden: Warum Rechner um einen Tag abweichen können',
        content: `Die Tagesdifferenz ist eindeutig, die Aufteilung in Jahre, Monate und Tage dagegen nicht immer. Beispiel: 31.01.1990 und 01.03.1990. Einen 31. Februar gibt es nicht. Der Rechner geht vom früheren Datum aus und rundet einen Monat auf das Monatsende ab (31.01. + 1 Monat = 28.02.). Ergebnis: ${AU_MONTHEND.primary.formattedValue}, insgesamt ${txt(AU_MONTHEND, 'totalDays')}. Rechner, die einen Monat erst am gleichen Monatstag als vollendet ansehen, zeigen hier dagegen 29 Tage ohne vollen Monat. Wenn es genau sein muss, etwa für eine Frist, ist die Tageszahl die verlässliche Angabe.`,
      },
    ],
    faqs: [
      {
        question: 'Sind Zwillinge unterschiedlich alt, wenn einer vor und einer nach Mitternacht geboren wurde?',
        answer: `Ja, kalendarisch schon. Kommt ein Zwilling am 31.12.2026 um 23:50 Uhr und der zweite am 01.01.2027 um 0:10 Uhr zur Welt, beträgt der Unterschied laut Rechner ${num(AU_TWINS, 'totalDays') === 1 ? 'einen Tag' : txt(AU_TWINS, 'totalDays')}. Beide haben verschiedene Geburtstage, werden an verschiedenen Tagen volljährig und gehören sogar zu verschiedenen Geburtsjahrgängen.`,
      },
      {
        question: 'Wie viele Tage sind ein Jahr Altersunterschied?',
        answer: `Das hängt davon ab, ob ein 29. Februar dazwischen liegt. Vom 01.01.2000 bis zum 01.01.2001 sind es ${AU_LEAP} Tage, vom 01.01.2001 bis zum 01.01.2002 nur ${AU_NOLEAP} Tage. Beides zählt als genau 1 Jahr Altersunterschied.`,
      },
      {
        question: 'Wann ist eine Person genau halb so alt wie die andere?',
        answer: 'Wenn die jüngere Person so viele Tage alt ist, wie der Altersunterschied in Tagen beträgt. Rechnen Sie dazu den Unterschied in Tagen aus und addieren Sie ihn mit dem Datum-plus-Tage-Rechner zum Geburtsdatum der jüngeren Person. Liegt das Datum in der Vergangenheit, kommt dieser Zeitpunkt nicht wieder.',
      },
    ],
  },

  wochenrechner: {
    sections: [
      {
        title: 'Kalenderwochen 2026 bis 2032 im Überblick',
        content: `Wann KW 1 beginnt und ob ein Jahr 52 oder 53 Kalenderwochen hat, hängt allein vom Wochentag des 1. Januar ab. Die Werte stammen aus dem Rechner:\n\n| Jahr | 1. Januar ist ein | Montag der KW 1 | Anzahl KW |\n|---|---|---|---|\n${WR_TABLE}\n\nDie Regel dahinter: KW 1 ist die Woche, die den 4. Januar enthält (gleichbedeutend: den ersten Donnerstag des Jahres). Ein Jahr hat 53 Kalenderwochen, wenn es mit einem Donnerstag beginnt oder ein Schaltjahr ist, das mit einem Mittwoch beginnt. Der 28. Dezember liegt immer in der letzten KW des Jahres – praktisch, um die Wochenzahl schnell zu prüfen.`,
      },
      {
        title: 'Von der KW zum Datum: Schritt für Schritt',
        content: `Oft ist der umgekehrte Weg gefragt: Ein Lieferant nennt „KW 38“, und Sie brauchen die Tage. So gehen Sie vor:\n\n1. Montag der KW 1 bestimmen (Tabelle oben). Für 2026 ist das der ${deDate(mondayOfKw1(2026))}.\n2. (KW − 1) × 7 Tage addieren: Für KW 38 sind das 37 × 7 = 259 Tage.\n3. Ergebnis: KW 38/2026 beginnt am ${WR_KW38_MON.weekday}, ${WR_KW38_MON.de}, und endet am ${WR_KW38_SUN.weekday}, ${WR_KW38_SUN.de}. Zur Kontrolle liefert der Rechner für den ${WR_KW38_MON.de} die KW ${WR_KW38_CHECK}.\n\nVorsicht an der Jahresgrenze: Um den Jahreswechsel kann ein Datum zur KW 52 oder 53 des Vorjahres oder zur KW 1 des Folgejahres gehören. Geben Sie deshalb bei Terminen immer das Jahr mit an, zum Beispiel „KW 1/2027“.`,
      },
    ],
    faqs: [
      {
        question: 'Welche Jahre haben 53 Kalenderwochen?',
        answer: `Zwischen 2020 und 2040 sind es laut Rechner die Jahre ${WR_53.join(', ')}. Im Schnitt hat etwa jedes fünfte bis sechste Jahr eine KW 53.`,
      },
      {
        question: 'Wie schreibt man Kalenderwochen nach ISO 8601?',
        answer: `Die Norm sieht die Form Jahr-W-Woche vor, also „${WR_EX_DAY.slice(0, 4)}-W${WR_EX_KW}“. Mit Wochentag (1 = Montag bis 7 = Sonntag) wird daraus „${WR_EX_DAY.slice(0, 4)}-W${WR_EX_KW}-${WR_EX_WD_NUM}“ für ${WR_EX_WD}, den ${deDate(WR_EX_DAY)}. Im Alltag ist „KW ${WR_EX_KW}/${WR_EX_DAY.slice(0, 4)}“ üblich.`,
      },
      {
        question: 'Was bedeutet „Lieferung in KW 2/2027“ konkret?',
        answer: `KW 2/2027 läuft von ${WR_KW2_MON.weekday}, ${WR_KW2_MON.de}, bis Sonntag. Wer nur Werktage im Büro meint, rechnet mit ${WR_KW2_MON.de} bis ${WR_KW2_FRI.weekday}, ${WR_KW2_FRI.de}.`,
      },
    ],
  },

  'dienstjubilaeum-rechner': {
    sections: [
      {
        title: 'Jubiläumstermine für typische Eintrittsdaten',
        content: `Die Tabelle zeigt, was der Rechner für einige Eintrittsdaten ausgibt – darunter ein Eintritt am Schalttag, bei dem der Jahrestag in Gemeinjahren auf den 28. Februar gelegt wird:\n\n| Eintrittsdatum | 10 Jahre | 25 Jahre | 40 Jahre |\n|---|---|---|---|\n${DJ_TABLE}\n\nNach den Fristregeln des BGB (§ 187 Abs. 2, § 188 Abs. 2) ist eine Dienstzeit von 25 Jahren mit Ablauf des Vortags vollendet: Bei Eintritt am 01.09.2011 also mit Ablauf des ${DJ_25_EVE}. Gefeiert und im Rechner ausgewiesen wird der Jahrestag des Eintritts, der ${DJ_NORMAL_25}.`,
      },
      {
        title: 'Unterbrechungen einrechnen: So verschiebt sich das Jubiläum',
        content: `Der Rechner geht von einer durchgehenden Beschäftigung aus. Zählt eine Unterbrechung nach Ihrem Tarif- oder Arbeitsvertrag nicht zur Dienstzeit, verschieben Sie das Eintrittsdatum um die Länge der Unterbrechung:\n\n1. Dauer der nicht anrechenbaren Zeit in Tagen ermitteln, z. B. unbezahlter Sonderurlaub vom 01.03. bis 30.08.2020 = ${DJ_GAP_DAYS} Tage (beide Tage eingeschlossen).\n2. Diese Tage zum echten Eintrittsdatum addieren: 01.09.2011 + ${DJ_GAP_DAYS} Tage = ${DJ_FICT.de} (fiktives Eintrittsdatum).\n3. Das fiktive Datum hier eingeben: Das 25-jährige Jubiläum verschiebt sich vom ${DJ_NORMAL_25} auf den ${DJ_FICT_25}.\n\nOb eine Zeit anrechenbar ist, steht im Tarifvertrag, in einer Betriebsvereinbarung oder im Arbeitsvertrag. Im Zweifel gibt die Personalabteilung die maßgebliche Beschäftigungszeit schriftlich an.`,
      },
    ],
    faqs: [
      {
        question: 'Hat man einen gesetzlichen Anspruch auf ein Jubiläumsgeld?',
        answer: 'Nein, ein Gesetz dazu gibt es nicht. Ein Anspruch entsteht nur aus einem Tarifvertrag (etwa dem TVöD), einer Betriebsvereinbarung, dem Arbeitsvertrag oder einer betrieblichen Übung, also wenn der Arbeitgeber eine Zahlung über Jahre vorbehaltlos gewährt hat.',
      },
      {
        question: 'Muss ein Jubiläumsgeld versteuert werden?',
        answer: 'Ja. Jubiläumszuwendungen des Arbeitgebers gehören zum steuerpflichtigen Arbeitslohn und sind in der Regel auch in der Sozialversicherung beitragspflichtig. Vom Bruttobetrag kommt daher spürbar weniger auf dem Konto an.',
      },
      {
        question: 'Zählt ein Wechsel innerhalb des Konzerns als neuer Eintritt?',
        answer: 'Das hängt von der vertraglichen Gestaltung ab. Wird das Arbeitsverhältnis mit einer anderen Konzerngesellschaft neu begründet, beginnt die Betriebszugehörigkeit dort grundsätzlich neu, sofern die Vorzeiten nicht ausdrücklich angerechnet werden. Lassen Sie sich eine Anrechnung im neuen Vertrag schriftlich bestätigen.',
      },
    ],
  },

  'zeitdifferenz-rechner': {
    sections: [
      {
        title: 'Arbeitszeit und Pflichtpausen nach § 4 Arbeitszeitgesetz',
        content: `Wer mit dem Rechner Arbeitszeiten ermittelt, sollte die gesetzlichen Ruhepausen kennen: Bei mehr als 6 Stunden Arbeit sind mindestens 30 Minuten Pause vorgeschrieben, bei mehr als 9 Stunden mindestens 45 Minuten (§ 4 ArbZG). Die Pause darf in Abschnitte von mindestens 15 Minuten geteilt werden, und länger als 6 Stunden am Stück darf niemand ohne Pause arbeiten.\n\n| Zeitraum | Pause | Arbeitszeit netto | Dezimal | Prüfung § 4 ArbZG |\n|---|---|---|---|---|\n${ZD_TABLE}\n\nDie Zeile 07:00–17:15 Uhr zeigt einen typischen Fehler: Mit 30 Minuten Pause bleiben mehr als 9 Stunden Arbeitszeit, also wären 45 Minuten nötig. Zusätzlich gilt die Höchstarbeitszeit nach § 3 ArbZG: 8 Stunden werktäglich, verlängerbar auf 10 Stunden, wenn im Durchschnitt von sechs Monaten oder 24 Wochen 8 Stunden nicht überschritten werden. 06:00–16:45 Uhr mit 45 Minuten Pause ergibt ${txt(ZD_MAX, 'duration')} und damit genau diese Obergrenze.`,
      },
    ],
    faqs: [
      {
        question: 'Brauche ich bei genau 6 Stunden Arbeit eine Pause?',
        answer: 'Nein. Die Pflicht zu 30 Minuten Pause beginnt erst bei mehr als 6 Stunden Arbeitszeit. Schon 6 Stunden und 15 Minuten ohne Pause sind aber unzulässig. Pausen zählen nicht zur Arbeitszeit, deshalb zieht der Rechner sie ab.',
      },
      {
        question: 'Was zeigt der Rechner, wenn Start- und Endzeit gleich sind?',
        answer: `Dann zeigt der Rechner „${txt(ZD_SAME, 'duration')}“. Er deutet eine Endzeit vor der Startzeit als Dienst über Mitternacht, aber keinen ganzen 24-Stunden-Tag. Für Zeiträume über mehrere Tage nutzen Sie besser den Tagerechner und rechnen die Tage in Stunden um.`,
      },
      {
        question: 'Wie wandle ich Industriestunden wieder in Stunden und Minuten um?',
        answer: `Die Nachkommastellen mal 60 ergeben die Minuten. ${formatNumber(ZD_BACK, 2)} Stunden sind 7 Stunden und 0,8 × 60 = ${ZD_BACK_MIN} Minuten, also 7:${ZD_BACK_MIN} Stunden – nicht 7:80.`,
      },
    ],
  },

  'alter-in-wochen': {
    sections: [
      {
        title: 'Babyalter: Monate und Wochen nebeneinander',
        content: `Ärztinnen, Hebammen und Ratgeber wechseln oft zwischen Wochen und Monaten. Für ein Baby, das am 15.01.2027 geboren wurde, zeigt der Rechner diese Werte:\n\n| Alter in Monaten | Datum | Alter in Wochen | Tage gesamt |\n|---|---|---|---|\n${AW_TABLE}\n\nDie Wochenzahlen wachsen nicht gleichmäßig, weil Kalendermonate 28 bis 31 Tage haben. Wer „3 Monate“ mit 12 Wochen gleichsetzt, liegt rund eine Woche daneben.`,
      },
      {
        title: 'Vollendete Woche oder laufende Lebenswoche?',
        content: `Der Rechner gibt die vollendeten Wochen an. Ein Baby, das 12 Wochen und 6 Tage alt ist, befindet sich bereits in der 13. Lebenswoche – die laufende Woche ist immer die vollendete plus eins. Am 15.04.2027 ist das Beispielbaby in seiner ${AW_RUNNING}. Lebenswoche.\n\nNicht verwechseln: Schwangerschaftswochen (z. B. „SSW 12+4“) werden ab dem ersten Tag der letzten Periode gezählt, nicht ab der Geburt oder der Befruchtung. Dafür ist der [Geburtstermin-Rechner](/rechner/geburtstermin-rechner/) gedacht.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viele Wochen alt ist ein Baby mit 6 Monaten?',
        answer: `Etwa 26 Wochen. Beim Beispiel mit Geburt am 15.01.2027 ergibt der Rechner am 15.07.2027 genau ${txt(AW_6M, 'weeks')} (${txt(AW_6M, 'totalDays')}).`,
      },
      {
        question: 'Ist man mit 52 Wochen ein Jahr alt?',
        answer: `Fast. 52 Wochen sind 364 Tage, ein Jahr hat 365 oder 366 Tage. Am ersten Geburtstag (15.01.2028) ist das Beispielbaby ${txt(AW_1Y, 'weeks')} alt.`,
      },
      {
        question: 'Wie viele Wochen hat ein 80-jähriger Mensch gelebt?',
        answer: `Vom 01.01.1947 bis zum 01.01.2027 sind es ${txt(AW_80, 'weeks')} (${txt(AW_80, 'totalDays')}). Rund 4.000 Wochen sind damit eine gute Faustzahl für ein langes Leben.`,
      },
    ],
  },

  'renteneintritt-rechner': {
    sections: [
      {
        title: 'Regelaltersgrenze und Rentenbeginn nach Jahrgang',
        content: `Die Tabelle zeigt die Ergebnisse des Rechners für eine Geburt im Juni (2. bis 30. Juni). Die Altersgrenzen der Jahrgänge 1947 bis 1963 stehen in § 235 Abs. 2 SGB VI, ab Jahrgang 1964 gilt das vollendete 67. Lebensjahr (§ 35 SGB VI).\n\n| Geburtsjahr | Regelaltersgrenze | Rentenbeginn bei Geburt im Juni |\n|---|---|---|\n${RE_TABLE}\n\nWer am 1. Juni geboren ist, beginnt jeweils einen Monat früher. Für Jahrgang 1970 heißt das: Rente ab ${RE_1970_FIRST} statt ab ${RE_1970}.`,
      },
      {
        title: 'Vom Geburtstag zum ersten Rentenmonat: die drei Rechenschritte',
        content: `1. **Altersgrenze bestimmen:** Sie hängt nur vom Geburtsjahr ab (Tabelle oben).\n2. **Tag des Erreichens:** Ein Lebensjahr ist mit Ablauf des Tages vor dem Geburtstag vollendet (§ 187 Abs. 2, § 188 Abs. 2 BGB). Wer am 15.06.1970 geboren ist, vollendet das 67. Lebensjahr mit Ablauf des 14.06.2037; wer am 01.06.1970 geboren ist, schon mit Ablauf des 31.05.2037.\n3. **Rentenbeginn:** Die Rente wird ab dem Kalendermonat gezahlt, zu dessen Beginn alle Voraussetzungen erfüllt sind (§ 99 Abs. 1 SGB VI). Im ersten Fall ist das der ${RE_1970}, im zweiten der ${RE_1970_FIRST}.\n\nZur Regelaltersrente gehört außerdem die allgemeine Wartezeit von 5 Jahren mit anrechenbaren Zeiten. Ob sie erfüllt ist und welche Rente Sie erwarten können, steht in Ihrer Renteninformation der Deutschen Rentenversicherung.`,
      },
    ],
    faqs: [
      {
        question: 'Wann muss ich den Rentenantrag stellen?',
        answer: 'Damit die Rente ab dem frühestmöglichen Monat gezahlt wird, muss der Antrag spätestens bis zum Ende des dritten Kalendermonats nach Erreichen der Altersgrenze gestellt sein. Wer später beantragt, erhält die Rente erst ab dem Monat der Antragstellung (§ 99 Abs. 1 SGB VI).',
      },
      {
        question: 'Was bringt es, über die Regelaltersgrenze hinaus zu arbeiten?',
        answer: `Für jeden Monat, in dem Sie die Regelaltersrente nach Erreichen der Altersgrenze nicht in Anspruch nehmen, erhöht sich die Rente um 0,5 Prozent (§ 77 SGB VI). Wer 12 Monate später startet, erhält dauerhaft ${formatNumber(RE_ZUSCHLAG_12, 0)} % mehr; wer weiter beschäftigt ist und Beiträge zahlt, erwirbt zusätzlich weitere Entgeltpunkte.`,
      },
      {
        question: 'Gilt der Rechner auch für Beamte oder Versorgungswerke?',
        answer: `Nein. Für Beamte gelten eigene Altersgrenzen nach dem Beamtenrecht des Bundes oder des jeweiligen Landes, berufsständische Versorgungswerke haben eigene Satzungen. Der Rechner bildet nur die gesetzliche Rentenversicherung ab – etwa für Jahrgang 1985 mit Geburt im März: Rentenbeginn ${RE_1985}.`,
      },
    ],
  },

  'schaltjahr-rechner': {
    sections: [
      {
        title: 'Schaltjahre von 2024 bis 2060 und der Wochentag des 29. Februar',
        content: `Bis 2060 folgt jedes durch 4 teilbare Jahr als Schaltjahr; die nächste Ausnahme kommt erst mit dem Jahr 2100. Der Wochentag des Schalttags verschiebt sich dabei von Schaltjahr zu Schaltjahr um fünf Tage:\n\n| Schaltjahr | 29. Februar ist ein |\n|---|---|\n${SJ_TABLE}\n\nDie Jahrhundertregel laut Rechner: ${SJ_CENTURIES}. Wer 2100 lebt, erlebt also nach 2096 acht Jahre ohne Schalttag.`,
      },
      {
        title: 'Warum die 400-Jahre-Regel so genau ist',
        content: `In einem 400-jährigen Zyklus (hier 2001 bis 2400) zählt der Rechner ${SJ_CYCLE} Schaltjahre. Daraus ergibt sich eine mittlere Kalenderjahreslänge von 365 + ${SJ_CYCLE}/400 = ${formatNumber(SJ_MEAN, 4)} Tagen. Das Sonnenjahr ist mit rund 365,2422 Tagen nur etwa 0,0003 Tage kürzer – der gregorianische Kalender läuft damit erst in rund 3.200 Jahren um einen ganzen Tag davon.\n\nDer julianische Kalender mit einem Schaltjahr alle 4 Jahre kam dagegen auf 365,25 Tage und lag nach 128 Jahren einen Tag daneben. Genau diese Abweichung von zuletzt zehn Tagen wurde 1582 bei der Kalenderreform gestrichen.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viele Schaltjahre gibt es in 400 Jahren?',
        answer: `${SJ_CYCLE}. Von den 100 durch 4 teilbaren Jahren eines 400-Jahre-Zyklus fallen die drei Jahrhundertjahre weg, die nicht durch 400 teilbar sind (etwa 2100, 2200 und 2300).`,
      },
      {
        question: 'Gilt die Regel auch für Jahre vor 1582?',
        answer: 'Der Rechner wendet die gregorianische Regel auf jedes Jahr an, also auch rückwirkend. Historisch galt vor der Reform der julianische Kalender mit einem Schaltjahr alle 4 Jahre; so war 1500 damals ein Schaltjahr, obwohl der Rechner „Nein“ zeigt. In den evangelischen Gebieten Deutschlands wurde der gregorianische Kalender erst im Jahr 1700 übernommen.',
      },
      {
        question: 'Hat ein Schaltjahr einen Arbeitstag mehr?',
        answer: `Nur wenn der 29. Februar auf Montag bis Freitag fällt. 2028 ist er ein ${SJ_2028_WD}, also gibt es in diesem Jahr einen zusätzlichen Arbeitstag. Bei Monatsgehalt ändert das am Lohn nichts, bei Stundenlohn kann ein Arbeitstag mehr bezahlt werden.`,
      },
    ],
  },

  altersrechner: {
    sections: [
      {
        title: 'Altersgrenzen prüfen: am Vortag oder am Geburtstag?',
        content: `Viele Rechte hängen an einem bestimmten Alter. Nach § 187 Abs. 2 Satz 2 BGB zählt der Geburtstag als erster Tag, das neue Lebensjahr beginnt also um 0 Uhr am Geburtstag. Am Beispiel einer Geburt am 15.03.2009 zeigt der Rechner:\n\n| Stichtag | Alter laut Rechner | Bedeutung |\n|---|---|---|\n${AR_TABLE}\n\nWer prüfen will, ob eine Altersgrenze an einem bestimmten Tag erreicht ist, setzt diesen Tag als Stichtag ein. Zeigt der Rechner genau die geforderte Jahreszahl mit 0 Monaten und 0 Tagen, ist sie an diesem Tag erreicht.`,
      },
    ],
    faqs: [
      {
        question: 'Wie alt ist jemand am 28. Februar, der am 29. Februar geboren wurde?',
        answer: `Im Gemeinjahr ist er am 28.02. noch nicht ein Jahr älter. Für eine Geburt am 29.02.2000 zeigt der Rechner am 28.02.2027: ${AR_LEAP_28.label}, nächster Geburtstag in ${AR_LEAP_28.untilNext === 1 ? 'einem Tag' : `${AR_LEAP_28.untilNext} Tagen`}. Am 01.03.2027 sind es ${AR_LEAP_01.label}.`,
      },
      {
        question: 'Wie viele Resttage kann das Ergebnis höchstens zeigen?',
        answer: 'Die Resttage werden über die Länge des Vormonats gebildet. Ist der Vormonat ein Monat mit 31 Tagen, können bis zu 30 Resttage stehen, bevor ein voller Monat erreicht ist. Mehr als 30 Resttage zeigt der Rechner nie.',
      },
      {
        question: 'Wie rechnet der Rechner, wenn der Geburtstag auf einen 31. fällt?',
        answer: `Hat der Vormonat des Stichtags weniger Tage, wird der Monat am Monatsende als vollendet gezählt. Geburt am 31.01.1990, Stichtag 01.03.2026: ${AR_MONTHEND.label}. Der Monat bis Ende Februar ist voll, der 1. März ist der Resttag.`,
      },
    ],
  },

  'datum-plus-tage': {
    sections: [
      {
        title: 'Typische Fristen ab Montag, 01.02.2027',
        content: `Die Tabelle zeigt, wohin übliche Fristlängen führen, wenn sie am 01.02.2027 beginnen. Gezählt wird wie im Rechner: Der Starttag ist Tag 0, der erste Folgetag Tag 1.\n\n| Frist | Zieldatum | Wochentag | KW |\n|---|---|---|---|\n${DP_TABLE}\n\nFällt das Ende einer gesetzlichen oder vertraglichen Frist auf einen Samstag, Sonntag oder gesetzlichen Feiertag, tritt nach § 193 BGB der nächste Werktag an seine Stelle – das gilt für Fristen, innerhalb derer eine Erklärung abzugeben oder eine Leistung zu bewirken ist. Der Rechner verschiebt nicht automatisch; prüfen Sie den Wochentag im Ergebnis.`,
      },
      {
        title: '30 Tage sind nicht 1 Monat',
        content: `Ob eine Frist in Tagen oder in Monaten bemessen ist, macht einen Unterschied. 31.01.2027 plus 30 Tage ergibt laut Rechner den ${DP_30.de} (${DP_30.weekday}). Eine Monatsfrist ab dem 31.01.2027 endet dagegen am 28.02.2027, weil der Februar keinen 31. hat und die Frist dann mit dem letzten Tag des Monats abläuft (§ 188 Abs. 3 BGB). Lesen Sie deshalb im Vertrag oder Bescheid genau nach: „30 Tage“ rechnen Sie hier, „1 Monat“ nicht.`,
      },
    ],
    faqs: [
      {
        question: 'Was passiert, wenn das Fristende auf einen Sonntag fällt?',
        answer: `Für Fristen nach § 193 BGB verschiebt sich das Ende auf den nächsten Werktag. Beispiel: 01.03.2026 plus 14 Tage ergibt ${DP_SUN.weekday}, den ${DP_SUN.de}; das Fristende ist dann ${DP_MON.weekday}, der ${DP_MON.de}. Ist der Montag ein Feiertag, rückt es einen weiteren Tag nach hinten.`,
      },
      {
        question: 'Wie viele Tage sind 6 Monate?',
        answer: `Zwischen 181 und 184 Tagen. Vom 01.01. bis 01.07.2027 sind es ${DP_H1} Tage, vom 01.07.2027 bis 01.01.2028 dagegen ${DP_H2} Tage, weil die zweite Jahreshälfte mehr 31-Tage-Monate hat.`,
      },
      {
        question: 'Wie rechne ich „10 Tage inklusive heute“?',
        answer: 'Der Rechner zählt den Ausgangstag nicht mit. Soll er mitzählen, geben Sie einen Tag weniger ein: Für 10 Tage einschließlich des Starttags also 9 Tage. Das Ergebnis ist dann der zehnte Tag.',
      },
    ],
  },

  'arbeitstage-rechner': {
    sections: [
      {
        title: 'Arbeitstage 2026 und 2027 nach Bundesland',
        content: `Die Tabelle zeigt die Arbeitstage (Montag bis Freitag) für ganze Kalenderjahre nach Abzug der landesweiten gesetzlichen Feiertage, berechnet mit diesem Rechner. Ohne Feiertage hat 2027 ${AT_MONFRI_27} Tage von Montag bis Freitag; mit nur den 9 bundeseinheitlichen Feiertagen bleiben ${AT_FED_27} (2026: ${AT_FED_26}).\n\n| Bundesland | Arbeitstage 2026 | Arbeitstage 2027 |\n|---|---|---|\n${AT_STATE_TABLE}\n\nNicht enthalten sind Feiertage, die nur in einzelnen Gemeinden gelten: Mariä Himmelfahrt in überwiegend katholischen Gemeinden Bayerns, das Augsburger Friedensfest (nur Stadt Augsburg) und Fronleichnam in einzelnen Gemeinden Sachsens und Thüringens. Wer dort arbeitet, zieht diese Tage selbst ab.`,
      },
      {
        title: 'Vom Kalenderjahr zu Ihren tatsächlichen Arbeitstagen',
        content: `Für Steuererklärung, Jahresplanung oder Teilzeit-Vereinbarungen brauchen Sie meist nicht die Kalender-, sondern Ihre persönlichen Arbeitstage:\n\n1. Arbeitstage des Jahres für Ihr Bundesland ermitteln (Tabelle oder Rechner).\n2. Urlaubstage abziehen. Gesetzlich sind mindestens 24 Werktage vorgeschrieben (§ 3 BUrlG), bei einer 5-Tage-Woche entspricht das 20 Arbeitstagen.\n3. Krankheitstage, Homeoffice-Tage (für die Entfernungspauschale) und Dienstreisetage abziehen.\n\nBeispiel: Nordrhein-Westfalen 2027 mit ${AT_NW.y27} Arbeitstagen, 30 Urlaubstagen und 5 Krankheitstagen ergibt ${AT_NW.y27 - 35} tatsächliche Arbeitstage.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viele Arbeitstage hat das Jahr 2027?',
        answer: `Je nach Bundesland ${AT_MIN_27} bis ${AT_MAX_27} Arbeitstage bei einer 5-Tage-Woche. Am wenigsten sind es in: ${AT_MIN_NAMES}. Grund für die Unterschiede sind die landesrechtlichen Feiertage wie Heilige Drei Könige, Fronleichnam, Reformationstag oder Allerheiligen.`,
      },
      {
        question: 'Wie viele Urlaubstage stehen mir bei einer 4-Tage-Woche gesetzlich zu?',
        answer: 'Der gesetzliche Mindesturlaub von 24 Werktagen bezieht sich auf eine 6-Tage-Woche. Bei 4 Arbeitstagen pro Woche rechnet man 24 × 4 ÷ 6 = 16 Urlaubstage. Tarif- oder Arbeitsvertrag können mehr vorsehen.',
      },
      {
        question: 'Sind Heiligabend und Silvester Arbeitstage?',
        answer: `Ja, der 24. und der 31. Dezember sind keine gesetzlichen Feiertage, der Rechner zählt sie als Arbeitstage. 2027 fallen beide auf einen ${AT_2412 === AT_3112 ? AT_2412 : `${AT_2412} bzw. ${AT_3112}`}. Ob Sie frei haben oder nur einen halben Tag arbeiten, regeln Tarifvertrag, Betriebsvereinbarung oder Arbeitsvertrag.`,
      },
    ],
  },

  'tage-bis-geburtstag': {
    sections: [
      {
        title: 'Auf welchen Wochentag fällt der Geburtstag in den nächsten Jahren?',
        content: `Die Tabelle zeigt den Geburtstag am 14. August und am 29. Februar für die kommenden Jahre, jeweils mit dem Rechner und dem Stichtag 1. Januar ermittelt:\n\n| Jahr | Geburtstag 14.08. | Geburtstag 29.02. (Anzeige) |\n|---|---|---|\n${GEB_TABLE}\n\nVon Jahr zu Jahr rückt der 14. August um einen Wochentag weiter, nach dem Schalttag 2028 und 2032 um zwei. Wer am 29. Februar geboren ist, sieht in Gemeinjahren den 28. Februar, nur 2028 und 2032 den echten Geburtstag. Wollen Sie wissen, wann Ihr Geburtstag wieder auf ein Wochenende fällt, lesen Sie die Spalte einfach von oben nach unten.`,
      },
    ],
    faqs: [
      {
        question: 'Zählt der Countdown den Geburtstag selbst mit?',
        answer: `Nein, gezählt wird die Differenz von heute bis zum Geburtstag. Am Tag davor zeigt der Rechner „${txt(GEB_VORTAG, 'days')}“, am Geburtstag selbst „${txt(GEB_TAG, 'days')}“. Schon am nächsten Morgen beginnt der Countdown für das folgende Jahr, dann sind es wieder ${txt(GEB_NACHTAG, 'days')}.`,
      },
    ],
  },

  'alter-in-monaten': {
    sections: [
      {
        title: 'Alter in Wochen und Monaten nebeneinander',
        content: `In Babyratgebern, auf Beikost-Gläschen und bei Vorsorgeterminen wird das Alter mal in Wochen, mal in Monaten angegeben. Die Tabelle zeigt für ein Kind, das am 01.01.2026 geboren ist, beide Angaben nebeneinander:\n\n| Alter in Wochen | Datum | Vollendete Monate | Laufender Lebensmonat |\n|---|---|---|---|\n${AIM_TABLE}\n\nWochen und Monate decken sich nie genau, und das Ergebnis hängt von den Monatslängen ab. Nach 13 Wochen zeigt der Rechner bei Geburt am 01.01.2026 „${txt(AIM_13_JAN, 'completedMonths')}“, bei Geburt am 01.07.2026 dagegen „${txt(AIM_13_JUL, 'completedMonths')}“. 52 Wochen sind 364 Tage und damit immer etwas weniger als ein Jahr. Lesen Sie deshalb nach, ob eine Angabe in Wochen oder in Monaten gemeint ist.`,
      },
    ],
    faqs: [
      {
        question: 'Wann ist ein am 31. August geborenes Kind 6 Monate alt?',
        answer: `Am 28. Februar, weil der Februar keinen 31. hat. Für die Geburt am 31.08.2026 zeigt der Rechner am 28.02.2027 „${txt(AIM_31_ANN, 'completedMonths')}“, am Tag davor „${txt(AIM_31_VOR, 'completedMonths')}“. Im nächsten Monat gilt wieder der ursprüngliche Tag: Am 31.03.2027 sind es „${txt(AIM_31_MAERZ, 'completedMonths')}“.`,
      },
    ],
  },

  'tage-bis-weihnachten': {
    sections: [
      {
        title: 'Heiligabend und Adventssonntage 2026 bis 2030',
        content: `Der 4. Advent ist der letzte Sonntag vor dem 25. Dezember, der 1. Advent liegt genau drei Wochen davor. Fällt Heiligabend selbst auf einen Sonntag, ist er zugleich der 4. Advent${XMAS_SUNDAY_YEARS.length > 0 ? ` (in diesem Zeitraum ${XMAS_SUNDAY_YEARS.join(' und ')})` : ''}. Die Daten sind mit dem Datumsrechner ermittelt:\n\n| Jahr | Heiligabend | 1. Advent | 4. Advent |\n|---|---|---|---|\n${XMAS_TABLE}\n\nDer Countdown oben zählt Kalendertage, Wochenenden eingeschlossen. Wie viele Arbeitstage bis zum Fest bleiben, hängt außerdem von Ihrem Bundesland und Ihrem Urlaub ab. Den genauen Wert für Ihren Zeitraum liefert der [Arbeitstage-Rechner](/rechner/arbeitstage-rechner/).`,
      },
    ],
    faqs: [
      {
        question: 'Wann ist der 1. Advent 2026?',
        answer: `Am ${XMAS_2026.erster.weekday}, ${XMAS_2026.erster.de}. Der 4. Advent ist der ${XMAS_2026.vierter.de}, Heiligabend fällt 2026 auf einen ${XMAS_2026.heiligabend}. Vom 1. Advent bis Heiligabend sind es ${XMAS_2026_DAYS} Tage, ein Adventskalender mit 24 Türchen beginnt dagegen immer am 1. Dezember.`,
      },
    ],
  },
};
