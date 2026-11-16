import { PageContentMap } from './types';
import { CalculationResult } from '@/types/calculator';
import { EXTRA_AUTO_ARBEIT } from '../extra/autoArbeit';
import { calculateCommuterAllowance, calculateEVCharging, calculateTravelTime } from '@/lib/calculators/auto';
import { LEGAL_VALUES_2026 } from '@/legal/de';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';
import { calculateCarCO2 } from '@/lib/calculators/co2';
import { CO2_PRICE_2026_CORRIDOR } from '@/data/emissions';

// ---------------------------------------------------------------------------
// Alle Zahlen in Tabellen und Antworten stammen aus der calculate-Funktion des
// jeweiligen Rechners und werden beim Laden des Moduls berechnet.
// ---------------------------------------------------------------------------
function run(slug: string, inputs: Record<string, any>): CalculationResult {
  const calc = EXTRA_AUTO_ARBEIT.find((c) => c.slug === slug);
  if (!calc || !calc.calculate) throw new Error(`page-content/auto: calculator ${slug} not found`);
  return calc.calculate(inputs) as CalculationResult;
}
function num(r: CalculationResult, id: string): number {
  if (r.primary.id === id) return Number(r.primary.value);
  const item = r.secondary?.find((s) => s.id === id);
  if (!item) throw new Error(`page-content/auto: result ${id} missing`);
  return Number(item.value);
}
function txt(r: CalculationResult, id: string): string {
  if (r.primary.id === id) return String(r.primary.formattedValue);
  const item = r.secondary?.find((s) => s.id === id);
  if (!item) throw new Error(`page-content/auto: result ${id} missing`);
  return String(item.formattedValue);
}
function table(head: string[], rows: string[][]): string {
  return [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n');
}
const n = (v: number, digits = 2) => formatNumber(v, digits);
const n1 = (v: number) => formatNumber(v, 1, 1);
const n2 = (v: number) => formatNumber(v, 2, 2);
const eur = (v: number) => formatCurrency(v);
const eur0 = (v: number) => `${formatNumber(v, 0)} €`;

// ---------------------------------------------------------------------------
// Bremsweg
// ---------------------------------------------------------------------------
const brems = (v: number, type: 'normal' | 'emergency') => run('bremsweg-rechner', { speedKmh: v, brakingType: type });
const BR_TABLE = table(
  ['Tempo', 'Reaktionsweg', 'Bremsweg normal', 'Anhalteweg normal', 'Bremsweg Gefahrenbremsung', 'Anhalteweg Gefahrenbremsung'],
  [30, 50, 70, 100, 130].map((v) => {
    const a = brems(v, 'normal');
    const b = brems(v, 'emergency');
    return [`${v} km/h`, `${n1(num(a, 'reactionDist'))} m`, `${n1(num(a, 'brakeDist'))} m`, `${n1(num(a, 'stoppingDist'))} m`, `${n1(num(b, 'brakeDist'))} m`, `${n1(num(b, 'stoppingDist'))} m`];
  }),
);
const ms = (kmh: number) => kmh / 3.6;
const BR_DEC_NORMAL = ms(100) ** 2 / (2 * num(brems(100, 'normal'), 'brakeDist'));
const BR_DEC_EMERG = ms(100) ** 2 / (2 * num(brems(100, 'emergency'), 'brakeDist'));
const BR_REACTION_SEC = num(brems(100, 'normal'), 'reactionDist') / ms(100);
const BR_DISTRACTED_50 = ms(50) * 2;
const BR_REACT_50 = num(brems(50, 'normal'), 'reactionDist');
const BR_STOP_30_E = num(brems(30, 'emergency'), 'stoppingDist');
const BR_STOP_50_E = num(brems(50, 'emergency'), 'stoppingDist');
const BR_50_UNBRAKED = BR_REACT_50 >= BR_STOP_30_E;
const BR_80_N = brems(80, 'normal');
const BR_80_E = brems(80, 'emergency');
const BR_110 = num(brems(110, 'normal'), 'stoppingDist');
const BR_100 = num(brems(100, 'normal'), 'stoppingDist');

// ---------------------------------------------------------------------------
// THG-Quote (nur Beispielprämien, keine Marktpreise)
// ---------------------------------------------------------------------------
const thg = (model: string, years: number, custom = 0) => run('thg-quote-rechner', { payoutModel: model, holdingYears: years, customPremium: custom });
const THG_OWN_EXAMPLE = 70;
const THG_TABLE = table(
  ['Jahre', 'Festprämie (Beispiel 95 €)', 'Variable Prämie (Beispiel 125 €)', `Eigenes Angebot (Beispiel ${THG_OWN_EXAMPLE} €)`],
  [1, 3, 5, 8].map((y) => [String(y), txt(thg('guaranteed', y), 'totalAmount'), txt(thg('variable', y), 'totalAmount'), txt(thg('guaranteed', y, THG_OWN_EXAMPLE), 'totalAmount')]),
);
const THG_GAP_3 = num(thg('variable', 3), 'totalAmount') - num(thg('guaranteed', 3), 'totalAmount');

// ---------------------------------------------------------------------------
// Motorrad
// ---------------------------------------------------------------------------
const MOTO_BASE = { displacementCc: 650, seasonMonths: 8, yearlyMileageKm: 5000, insuranceYearlyFull: 240, fuelConsumptionL100: 4.8, maintenanceYearly: 350 };
const moto = (over: Record<string, any>) => run('motorrad-unterhaltskosten-rechner', { ...MOTO_BASE, ...over });
const MOTO_TAX_TABLE = table(
  ['Hubraum', 'Steuer bei Ganzjahreszulassung', 'Steuer bei 7 Monaten Saison'],
  [125, 250, 500, 650, 800, 1000, 1300].map((cc) => [`${n(cc, 0)} cm³`, txt(moto({ displacementCc: cc, seasonMonths: 12 }), 'seasonTax'), txt(moto({ displacementCc: cc, seasonMonths: 7 }), 'seasonTax')]),
);
const MOTO_YEAR = moto({ seasonMonths: 12 });
const MOTO_SEASON = moto({ seasonMonths: 8 });
const MOTO_SAVING = num(MOTO_YEAR, 'totalCostSeason') - num(MOTO_SEASON, 'totalCostSeason');
const MOTO_PER_KM = num(MOTO_SEASON, 'totalCostSeason') / MOTO_BASE.yearlyMileageKm;
const MOTO_1000_TAX = num(moto({ displacementCc: 1000, seasonMonths: 12 }), 'seasonTax');
const MOTO_1000_SAVING = num(moto({ displacementCc: 1000, seasonMonths: 12 }), 'totalCostSeason') - num(moto({ displacementCc: 1000, seasonMonths: 7 }), 'totalCostSeason');
const MOTO_FUEL_SEASON = txt(MOTO_SEASON, 'fuelCost');

// ---------------------------------------------------------------------------
// Leasingfaktor
// ---------------------------------------------------------------------------
const LEASE_BASE = { monthlyLeasingRate: 320, grossListPrice: 42000, contractMonths: 36, transferCosts: 990 };
const lease = (over: Record<string, any>) => run('leasingfaktor-rechner', { ...LEASE_BASE, downPayment: 0, ...over });
const LEASE_TABLE = table(
  ['Sonderzahlung', 'Leasingfaktor', 'Gesamtleasingfaktor', 'Gesamtkosten 36 Monate', 'Bewertung'],
  [0, 1500, 3000, 5000].map((d) => {
    const r = lease({ downPayment: d });
    return [eur0(d), txt(r, 'leasingFactor'), txt(r, 'totalLeasingFactor'), txt(r, 'totalCostOverTerm'), txt(r, 'rating')];
  }),
);
const LEASE_NET_RATE = 320 / 1.19;
const LEASE_GROSS_F = lease({ transferCosts: 0 });
const LEASE_NET_F = lease({ monthlyLeasingRate: LEASE_NET_RATE, transferCosts: 0 });
const LEASE_ONE = lease({ monthlyLeasingRate: 420, transferCosts: 0 });
const LEASE_DP_DELTA = num(lease({ downPayment: 3000 }), 'totalLeasingFactor') - num(lease({ downPayment: 0 }), 'totalLeasingFactor');

// ---------------------------------------------------------------------------
// Fahrzeit
// ---------------------------------------------------------------------------
const travel = (distance: number, speed: number, breakMinutes = 0) => calculateTravelTime({ distance, speed, breakMinutes });
const FZ_SPEEDS = [80, 100, 120];
const FZ_TABLE = table(
  ['Strecke', ...FZ_SPEEDS.map((s) => `Ø ${s} km/h`)],
  [200, 400, 600, 800].map((d) => [`${n(d, 0)} km`, ...FZ_SPEEDS.map((s) => txt(travel(d, s), 'totalTime'))]),
);
const FZ_NAVI_KM = 520;
const FZ_NAVI_MIN = 5 * 60 + 10;
const FZ_NAVI_SPEED = FZ_NAVI_KM / (FZ_NAVI_MIN / 60);
const FZ_600_110 = num(travel(600, 110), 'totalTime');
const FZ_600_130 = num(travel(600, 130), 'totalTime');
const FZ_500_100 = travel(500, 100, 30);
const FZ_500_120 = travel(500, 120, 30);

// ---------------------------------------------------------------------------
// Anhänger-Stützlast
// ---------------------------------------------------------------------------
const stuetz = (w: number, car = 75, trailer = 100) => run('anhaenger-stuetzlast-rechner', { actualTrailerWeightKg: w, maxCarNoseWeightKg: car, maxTrailerNoseWeightKg: trailer });
const ST_TABLE = table(
  ['Tatsächliches Anhängergewicht', '4 % davon', 'Gesetzliche Mindeststützlast'],
  [300, 450, 625, 750, 1000, 1300, 2000].map((w) => [`${n(w, 0)} kg`, `${n(w * 0.04, 0)} kg`, `${n(num(stuetz(w), 'minRequired'), 0)} kg`]),
);
const ST_CAP_FROM = 25 / 0.04;
const ST_EXAMPLE = stuetz(1300, 80, 100);

// ---------------------------------------------------------------------------
// Fahrgemeinschaft
// ---------------------------------------------------------------------------
const FG_BASE = { distanceOneWayKm: 35, workDaysPerMonth: 19, carConsumptionPer100Km: 6.8, fuelPricePerLiter: 1.8, wearSurchargePerKm: 6 };
const fg = (over: Record<string, any>) => run('fahrgemeinschaft-sprit-rechner', { ...FG_BASE, passengersCount: 3, ...over });
const FG_MONTH_KM = FG_BASE.distanceOneWayKm * 2 * FG_BASE.workDaysPerMonth;
const PBEFG_LIMIT = 0.3;
const fgRow = (people: number, wear: number) => {
  const r = fg({ passengersCount: people, wearSurchargePerKm: wear });
  const paidByPassengersPerKm = (num(r, 'totalMonthlyCost') * (people - 1)) / people / FG_MONTH_KM;
  return { r, paidByPassengersPerKm };
};
const FG_TABLE = table(
  ['Insassen', 'Anteil je Person/Monat (6 ct Verschleiß)', 'Mitfahrer zahlen zusammen je km', 'Anteil je Person/Monat (10 ct Verschleiß)', 'Mitfahrer zahlen zusammen je km'],
  [2, 3, 4, 5].map((p) => {
    const a = fgRow(p, 6);
    const b = fgRow(p, 10);
    return [String(p), txt(a.r, 'costPerPersonMonth'), `${n2(a.paidByPassengersPerKm)} €`, txt(b.r, 'costPerPersonMonth'), `${n2(b.paidByPassengersPerKm)} €`];
  }),
);
const FG_MAX_PER_KM = Math.max(...[2, 3, 4, 5].flatMap((p) => [fgRow(p, 6).paidByPassengersPerKm, fgRow(p, 10).paidByPassengersPerKm]));
const FG_COST_PER_KM = num(fg({}), 'totalMonthlyCost') / FG_MONTH_KM;
// Teilstrecke: Fahrer und A fahren 70 km, B nur 40 km davon mit
const FG_DAY_COST = FG_COST_PER_KM * 70;
const FG_PKM = 70 + 70 + 40;
const FG_SHARE_FULL = (FG_DAY_COST * 70) / FG_PKM;
const FG_SHARE_B = (FG_DAY_COST * 40) / FG_PKM;
const FG_PENDLER = calculateCommuterAllowance({ distanceKm: 35, workdays: 220, homeOfficeDays: 0, transportMode: 'public' });

// ---------------------------------------------------------------------------
// Plug-in-Hybrid (Beispielpreise aus den Vorgabewerten des Rechners)
// ---------------------------------------------------------------------------
const HY_BASE = { electricKwh100Km: 20, fuelLiters100Km: 7.5, powerPriceCent: 34, petrolPriceLiter: 1.78, yearlyMileageKm: 15000 };
const hy = (over: Record<string, any>) => run('hybrid-auto-kosten-rechner', { ...HY_BASE, electricSharePct: 60, ...over });
const HY_TABLE = table(
  ['E-Anteil', 'Kosten je 100 km', 'Energiekosten pro Jahr', 'Ersparnis ggü. reinem Benzinbetrieb'],
  [0, 25, 50, 75, 100].map((s) => {
    const r = hy({ electricSharePct: s });
    return [`${s} %`, txt(r, 'mixedCost100'), txt(r, 'totalYearlyCost'), txt(r, 'yearlySaving')];
  }),
);
const HY_GAS100 = num(hy({}), 'costGas100');
const HY_BREAK_EVEN_CT = (HY_GAS100 / HY_BASE.electricKwh100Km) * 100;
const HY_PUBLIC_CT = 69;
const HY_PUBLIC = hy({ powerPriceCent: HY_PUBLIC_CT, electricSharePct: 100 });
const HY_PUBLIC_60_SAVING = num(hy({ powerPriceCent: HY_PUBLIC_CT, electricSharePct: 60 }), 'yearlySaving');

// ---------------------------------------------------------------------------
// Auto-Gesamtkosten
// ---------------------------------------------------------------------------
const GK_BASE = { purchasePrice: 30000, yearlyMileageKm: 15000, fuelCostPer100Km: 11.5, insuranceYearly: 650, taxYearly: 140, maintenanceYearly: 600 };
const gk = (over: Record<string, any>) => run('auto-gesamtkosten-rechner', { ...GK_BASE, ...over });
const GK_KM_TABLE = table(
  ['Fahrleistung pro Jahr', 'Kosten pro Monat', 'Kosten pro km'],
  [5000, 10000, 15000, 20000, 30000].map((km) => {
    const r = gk({ yearlyMileageKm: km });
    return [`${n(km, 0)} km`, txt(r, 'costPerMonth'), txt(r, 'costPerKm')];
  }),
);
const GK_DEFAULT = gk({});
const GK_TOTAL = num(GK_DEFAULT, 'totalYearly');
const GK_DEPR = num(GK_DEFAULT, 'depreciationShare') * 12;
const GK_FUEL = GK_TOTAL - num(gk({ fuelCostPer100Km: 0 }), 'totalYearly');
const GK_PARTS: Array<[string, number]> = [
  ['Wertverlust (10 % des Kaufpreises)', GK_DEPR],
  ['Kraftstoff', GK_FUEL],
  ['Versicherung', GK_TOTAL - num(gk({ insuranceYearly: 0 }), 'totalYearly')],
  ['Wartung, TÜV, Reifen', GK_TOTAL - num(gk({ maintenanceYearly: 0 }), 'totalYearly')],
  ['Kfz-Steuer', GK_TOTAL - num(gk({ taxYearly: 0 }), 'totalYearly')],
];
const GK_PARTS_TABLE = table(
  ['Posten', 'pro Jahr', 'Anteil'],
  [...GK_PARTS.map(([label, v]) => [label, eur(v), formatPercent((v / GK_TOTAL) * 100, 1)]), ['**Summe**', `**${eur(GK_TOTAL)}**`, '**100 %**']],
);
const WV = (price: number, years: number) => run('auto-wertverlust-rechner', { originalPrice: price, ageYears: years });
const GK_CURVE_4Y = num(WV(30000, 4), 'lossTotal') / 4;
const GK_10K = gk({ yearlyMileageKm: 10000 });

// ---------------------------------------------------------------------------
// Auto-Wertverlust
// ---------------------------------------------------------------------------
const WV_YEARS = [1, 3, 5, 8, 10, 12];
const WV_TABLE = table(
  ['Neupreis', ...WV_YEARS.map((y) => `nach ${y} J.`)],
  [20000, 35000, 50000].map((p) => [eur0(p), ...WV_YEARS.map((y) => eur0(num(WV(p, y), 'remainingValue')))]),
);
const wvPct = (y: number) => num(WV(100, y), 'remainingValue');
const WV_STEP_LIST = [1, 2, 3, 4, 5, 6]
  .map((y) => `- Jahr ${y}: ${n(((y === 1 ? 100 : wvPct(y - 1)) - wvPct(y)), 0)} Prozentpunkte des Neupreises`)
  .join('\n');
const WV_USED_BUY = num(WV(35000, 3), 'remainingValue');
const WV_USED_SELL = num(WV(35000, 7), 'remainingValue');
const WV_NEW_LOSS_4 = num(WV(35000, 4), 'lossTotal');
const WV_10 = WV(35000, 10);
const WV_12 = WV(35000, 12);
const WV_15 = WV(35000, 15);

// ---------------------------------------------------------------------------
// Reifen / Abrollumfang
// ---------------------------------------------------------------------------
const REF = { widthOld: 205, aspectOld: 55, rimOld: 16 };
const tyre = (w: number, a: number, r: number) => run('reifen-abrollumfang-rechner', { ...REF, widthNew: w, aspectNew: a, rimNew: r });
const REF_DIAM = 2 * REF.widthOld * (REF.aspectOld / 100) + REF.rimOld * 25.4;
const TY_SIZES: Array<[number, number, number]> = [[195, 65, 15], [215, 55, 16], [205, 50, 17], [225, 45, 17], [225, 40, 18], [235, 35, 19]];
const TY_TABLE = table(
  ['Reifengröße', 'Abrollumfang', 'Differenz zu 205/55 R16', 'Tacho bei echten 100 km/h', 'Bodenfreiheit'],
  TY_SIZES.map(([w, a, r]) => {
    const res = tyre(w, a, r);
    const lift = (num(res, 'circNew') / Math.PI - REF_DIAM) / 2;
    return [`${w}/${a} R${r}`, txt(res, 'circNew'), txt(res, 'diffCircPct'), txt(res, 'speedShown'), `${lift >= 0 ? '+' : ''}${n1(lift)} mm`];
  }),
);
const TY_215 = tyre(215, 55, 16);
const TY_215_REAL_AT_100 = 100 * (1 + num(TY_215, 'diffCircPct') / 100);
const TY_215_LIFT = (num(TY_215, 'circNew') / Math.PI - REF_DIAM) / 2;

// ---------------------------------------------------------------------------
// Elektroauto-Ladekosten (Strompreise sind Beispielwerte)
// ---------------------------------------------------------------------------
const ev = (consumptionKwh: number, pricePerKwh: number, distance = 100, batterySize = 64) => calculateEVCharging({ distance, consumptionKwh, pricePerKwh, batterySize });
const EV_PRICES = [0.3, 0.38, 0.49, 0.59, 0.69];
const EV_TABLE = table(
  ['Verbrauch', ...EV_PRICES.map((p) => `${n2(p)} €/kWh`)],
  [15, 18, 22].map((c) => [`${c} kWh/100 km`, ...EV_PRICES.map((p) => txt(ev(c, p), 'costPer100'))]),
);
const EV_HOME = 0.38;
const EV_PUBLIC = 0.69;
const EV_YEAR_HOME_ONLY = num(ev(18, EV_HOME, 15000), 'tripCost');
const EV_YEAR_MIX = num(ev(18, EV_HOME, 12000), 'tripCost') + num(ev(18, EV_PUBLIC, 3000), 'tripCost');
const EV_PETROL_100 = 6.5 * 1.75;
const EV_FULL = [40, 60, 77].map((b) => `${b} kWh: ${txt(ev(18, EV_HOME, 100, b), 'fullCharge')}`).join(', ');

// ---------------------------------------------------------------------------
// Promille (rechnerische Spitzenwerte ohne Abbau)
// ---------------------------------------------------------------------------
const prom = (gender: string, kg: number, drink: Record<string, number>, hours = 0.5) =>
  run('promillerechner-widmark', { gender, bodyWeightKg: kg, beerMl: 0, wineMl: 0, spiritsMl: 0, hoursSinceStart: hours, ...drink });
const PR_DRINKS: Array<[string, Record<string, number>]> = [
  ['0,33 l Bier (5 %)', { beerMl: 330 }],
  ['0,5 l Bier (5 %)', { beerMl: 500 }],
  ['0,2 l Wein (12 %)', { wineMl: 200 }],
  ['4 cl Schnaps (40 %)', { spiritsMl: 40 }],
  ['1 l Bier (5 %)', { beerMl: 1000 }],
];
const PR_PEOPLE: Array<[string, string, number]> = [['Frau, 60 kg', 'female', 60], ['Frau, 75 kg', 'female', 75], ['Mann, 70 kg', 'male', 70], ['Mann, 90 kg', 'male', 90]];
const PR_TABLE = table(
  ['Getränk', 'Reinalkohol', ...PR_PEOPLE.map(([label]) => label)],
  PR_DRINKS.map(([label, d]) => [label, txt(prom('male', 80, d), 'pureAlcohol'), ...PR_PEOPLE.map(([, g, kg]) => txt(prom(g, kg, d), 'maxPromille'))]),
);
const PR_1L = prom('male', 80, { beerMl: 1000 });
const PR_1L_TOTAL_H = 0.5 + num(PR_1L, 'hoursUntilSober');

// ---------------------------------------------------------------------------
// Pendlerpauschale 2026
// ---------------------------------------------------------------------------
const pend = (km: number, days = 220, ho = 0) => calculateCommuterAllowance({ distanceKm: km, workdays: days, homeOfficeDays: ho, transportMode: 'car' });
const AN_PAUSCH = LEGAL_VALUES_2026.arbeitnehmerPauschbetrag.value;
const HO_DAYS = 88; // 2 Homeoffice-Tage pro Woche bei 44 Arbeitswochen
const PD_TABLE = table(
  ['Einfache Entfernung', 'Pauschale bei 220 Pendeltagen', `bei 220 Tagen, davon ${HO_DAYS} im Homeoffice`],
  [5, 10, 15, 20, 30, 50].map((km) => {
    const a = num(pend(km), 'totalAllowance');
    const b = num(pend(km, 220, HO_DAYS), 'totalAllowance');
    const mark = (v: number) => `${eur(v)}${v > AN_PAUSCH ? ' ✓' : ''}`;
    return [`${km} km`, mark(a), mark(b)];
  }),
);
const firstKmAbove = (days: number, ho: number) => {
  for (let km = 1; km <= 200; km++) if (num(pend(km, days, ho), 'totalAllowance') > AN_PAUSCH) return km;
  return NaN;
};
const PD_KM_FULL = firstKmAbove(220, 0);
const PD_KM_HO = firstKmAbove(220, HO_DAYS);
const PD_RATE = num(pend(30), 'ratePerKm');
const PD_30 = num(pend(30), 'totalAllowance');
const PD_30_OVER = PD_30 - AN_PAUSCH;
const PD_2025_DAY_30 = 20 * 0.3 + 10 * 0.38; // Rechtslage 2025: 0,30 € für km 1–20, 0,38 € ab km 21
const PD_2026_DAY_30 = num(pend(30), 'perDay');

// ---------------------------------------------------------------------------
// CO₂-Rechner Auto (calculateCarCO2, Rechenweg A/B) und CO₂-Preiskorridor 2026 (§ 10 Abs. 2 BEHG)
// ---------------------------------------------------------------------------
const co2 = (fuelType: string, consumption: number, distanceKm = 15000) =>
  calculateCarCO2({ tripMode: 'annual', distanceKm, fuelType, consumption, method: 'direct' });
const CO2_LEVELS: Record<string, number[]> = {
  benzin: [5, 6, 7, 8, 10],
  diesel: [4, 5, 6, 7, 8],
  electric: [14, 16, 18, 20, 22],
};
const co2Row = (fuel: string, unit: string) =>
  CO2_LEVELS[fuel].map((c) => {
    const r = co2(fuel, c);
    return `${n1(c)} ${unit}: ${n(num(r, 'co2PerKm'), 0)} g/km`;
  });
const CO2_TABLE = table(
  ['Benziner', 'Diesel', 'Elektroauto (Strommix)'],
  [0, 1, 2, 3, 4].map((i) => [co2Row('benzin', 'l')[i], co2Row('diesel', 'l')[i], co2Row('electric', 'kWh')[i]]),
);
const CO2_B7 = co2('benzin', 7);
const CO2_D6 = co2('diesel', 6);
const CO2_B6 = co2('benzin', 6);
const CO2_E18 = co2('electric', 18);
const CO2_BENZIN_FACTOR = num(CO2_B7, 'factorUsed');
const CO2_DIESEL_FACTOR = num(CO2_D6, 'factorUsed');
const CO2_MWST = 1 + LEGAL_VALUES_2026.mwstNormalsatz.value;
const CO2_CT_PER_L = (factor: number, price: number) => (factor * price) / 10; // kg/l × €/t ÷ 1.000 × 100 ct
const CO2_B7_T = num(CO2_B7, 'co2Total');
const CO2_COST_MIN = CO2_B7_T * CO2_PRICE_2026_CORRIDOR.min * CO2_MWST;
const CO2_COST_MAX = CO2_B7_T * CO2_PRICE_2026_CORRIDOR.max * CO2_MWST;

export const AUTO_PAGE_CONTENT: PageContentMap = {
  'bremsweg-rechner': {
    sections: [
      {
        title: 'Anhalteweg-Tabelle von 30 bis 130 km/h',
        content: `Werte nach den Fahrschul-Faustformeln, wie sie der Rechner verwendet:\n\n${BR_TABLE}\n\nDer Reaktionsweg ist bei beiden Bremsarten gleich lang und wächst nur linear mit dem Tempo. Bei 30 km/h ist er bei einer Gefahrenbremsung doppelt so lang wie der eigentliche Bremsweg, bei 130 km/h macht der quadratisch wachsende Bremsweg dagegen den größten Teil des Anhaltewegs aus.`,
      },
      {
        title: 'Was die Faustformeln weglassen',
        content: `Hinter den Formeln stecken feste Annahmen. Rechnet man sie zurück, ergibt sich:\n\n- **Reaktionszeit:** rund ${n2(BR_REACTION_SEC)} Sekunden. Wer aufs Handy schaut, braucht leicht 2 Sekunden; bei 50 km/h wären das ${n1(BR_DISTRACTED_50)} m statt ${n1(BR_REACT_50)} m Reaktionsweg.\n- **Verzögerung Normalbremsung:** etwa ${n1(BR_DEC_NORMAL)} m/s², also ein zügiges, aber kontrolliertes Bremsen.\n- **Verzögerung Gefahrenbremsung:** etwa ${n1(BR_DEC_EMERG)} m/s². Das erreicht ein Pkw mit guten Reifen auf trockenem Asphalt; auf nasser, verschneiter oder vereister Fahrbahn wird der Bremsweg deutlich länger.\n\nNicht enthalten sind außerdem die Ansprechzeit der Bremse, Beladung, Anhängerbetrieb, Reifenzustand und Gefälle. Für die Führerscheinprüfung sind die Formeln richtig, für die Einschätzung einer echten Situation sind sie eine Untergrenze.`,
      },
    ],
    faqs: [
      {
        question: 'Warum macht der Unterschied zwischen Tempo 30 und 50 so viel aus?',
        answer: `Bei einer Gefahrenbremsung steht ein Auto mit 30 km/h nach ${n1(BR_STOP_30_E)} m. Ein Auto mit 50 km/h hat an dieser Stelle ${BR_50_UNBRAKED ? `noch nicht einmal zu bremsen begonnen, weil allein sein Reaktionsweg ${n1(BR_REACT_50)} m beträgt. Es trifft ein Hindernis dort also praktisch ungebremst mit 50 km/h` : 'bereits zu bremsen begonnen, ist aber noch deutlich schneller'}; zum Stehen kommt es erst nach ${n1(BR_STOP_50_E)} m.`,
      },
      {
        question: 'Wie rechnet man den Anhalteweg für die Führerscheinprüfung, zum Beispiel bei 80 km/h?',
        answer: `Reaktionsweg: 8 × 3 = ${n(num(BR_80_N, 'reactionDist'), 0)} m. Bremsweg normal: 8 × 8 = ${n(num(BR_80_N, 'brakeDist'), 0)} m, Anhalteweg also ${n(num(BR_80_N, 'stoppingDist'), 0)} m. Bei einer Gefahrenbremsung halbiert sich nur der Bremsweg auf ${n(num(BR_80_E, 'brakeDist'), 0)} m, der Anhalteweg beträgt dann ${n(num(BR_80_E, 'stoppingDist'), 0)} m.`,
      },
      {
        question: 'Wie viel länger wird der Anhalteweg bei 10 km/h mehr?',
        answer: `Von 100 auf 110 km/h steigt der Anhalteweg bei Normalbremsung von ${n(BR_100, 0)} m auf ${n(BR_110, 0)} m, also um ${n(BR_110 - BR_100, 0)} m oder ${formatPercent(((BR_110 - BR_100) / BR_100) * 100, 0)}, obwohl das Tempo nur um 10 % steigt. Grund ist der quadratisch wachsende Bremsweg.`,
      },
    ],
  },

  'thg-quote-rechner': {
    sections: [
      {
        title: 'So läuft der Verkauf der THG-Quote ab',
        content: `1. **Berechtigung prüfen:** Angerechnet werden nach § 7 der 38. BImSchV reine Batterieelektrofahrzeuge. Maßgeblich ist, wer in der Zulassungsbescheinigung Teil I als Halter steht.\n2. **Anbieter wählen und Zulassungsbescheinigung hochladen:** Der Vermittler bündelt viele Fahrzeuge und verkauft die Mengen an quotenverpflichtete Unternehmen.\n3. **Nur einmal pro Jahr:** Der pauschale Schätzwert darf je Fahrzeug und Verpflichtungsjahr nur einmal angerechnet werden. Nach einem Gebrauchtkauf kann es also sein, dass der Vorbesitzer die Quote für das laufende Jahr schon verkauft hat.\n4. **Auszahlung:** Bei der Festprämie steht der Betrag vorab fest, bei variablen Modellen hängt er vom späteren Verkaufserlös des Anbieters ab.\n\nDie Prämienhöhe ist kein gesetzlicher Betrag; sie ergibt sich aus Angebot und Nachfrage am Quotenmarkt und aus den gesetzlichen Quotenvorgaben, die der Gesetzgeber mehrfach geändert hat.`,
      },
      {
        title: 'Rechenbeispiel: Prämien über mehrere Jahre',
        content: `Alle Beträge sind **Beispielwerte**, keine aktuellen Marktpreise. Tragen Sie für eine echte Rechnung die Prämie aus Ihrem Angebot ins Feld „Prämie laut Ihrem Angebot“ ein.\n\n${THG_TABLE}\n\nÜber drei Jahre bringt die variable Beispielprämie ${eur(THG_GAP_3)} mehr, aber nur wenn der Anbieter tatsächlich so viel erlöst. Bei der Festprämie tragen Sie dieses Risiko nicht.`,
      },
    ],
    faqs: [
      {
        question: 'Bekomme ich die THG-Prämie auch für einen Plug-in-Hybrid?',
        answer: 'Nein. Die Anrechnung über den pauschalen Schätzwert ist in § 7 der 38. BImSchV für reine Batterieelektrofahrzeuge vorgesehen. Hybride fallen nicht darunter, auch Plug-in-Hybride mit E-Kennzeichen nicht.',
      },
      {
        question: 'Kann ich die Quote nach dem Kauf eines gebrauchten E-Autos noch im selben Jahr verkaufen?',
        answer: 'Nur, wenn für dieses Fahrzeug im laufenden Verpflichtungsjahr noch keine Quote angerechnet wurde. Fragen Sie den Vorbesitzer, ob er die Prämie schon beantragt hat; andernfalls lehnt der Anbieter den Antrag in der Regel ab, und Sie können erst im Folgejahr verkaufen.',
      },
    ],
  },

  'motorrad-unterhaltskosten-rechner': {
    sections: [
      {
        title: 'Kfz-Steuer nach Hubraum: Ganzjahr und Saison',
        content: `Die Steuer beträgt 1,84 € je angefangene 25 cm³. Leichtkrafträder bis 125 cm³ sind steuerfrei. Werte aus dem Rechner:\n\n${MOTO_TAX_TABLE}\n\nDie Steuer ist bei Motorrädern im Vergleich zu Versicherung, Sprit und Wartung ein kleiner Posten. Wer über ein Saisonkennzeichen nachdenkt, spart vor allem bei der Versicherung.`,
      },
      {
        title: 'Saisonkennzeichen oder ganzjährig: Rechenbeispiel',
        content: `650er Maschine, 240 € Versicherung im Jahr, 5.000 km, 4,8 l/100 km, 350 € Wartung:\n\n- Ganzjährig zugelassen: **${txt(MOTO_YEAR, 'totalCostSeason')}** pro Jahr\n- Saisonkennzeichen über 8 Monate: **${txt(MOTO_SEASON, 'totalCostSeason')}**\n- Unterschied: ${eur(MOTO_SAVING)}, weil nur Steuer und Versicherung anteilig sinken\n\nUmgelegt auf die 5.000 km kostet jeder Kilometer in der Saisonvariante rund ${n(MOTO_PER_KM * 100, 0)} Cent. Der Rechner setzt den Sprit mit festen 1,80 € je Liter an (hier ${MOTO_FUEL_SEASON}); ist Ihr Literpreis ein anderer, verschiebt sich die Summe entsprechend.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel Kfz-Steuer kostet ein Motorrad mit 1.000 cm³?',
        answer: `1.000 cm³ sind 40 Einheiten zu je 25 cm³, also ${eur(MOTO_1000_TAX)} im Jahr bei ganzjähriger Zulassung. Mit Saisonkennzeichen fällt die Steuer nur für die zugelassenen Monate an.`,
      },
      {
        question: 'Lohnt sich ein Saisonkennzeichen auch bei einem großen Motorrad?',
        answer: `Für eine 1.000er mit sonst gleichen Annahmen (240 € Versicherung im Jahr) spart eine Saison von 7 statt 12 Monaten laut Rechner ${eur(MOTO_1000_SAVING)}. Die Ersparnis wächst mit der Versicherungsprämie; ob Ihr Versicherer den Saisonbeitrag genau anteilig berechnet, zeigt erst das konkrete Angebot.`,
      },
    ],
  },

  'leasingfaktor-rechner': {
    sections: [
      {
        title: 'Wie die Sonderzahlung den Gesamtleasingfaktor verschiebt',
        content: `Beispiel: 320 € Monatsrate, 42.000 € Bruttolistenpreis, 36 Monate, 990 € Überführung. Nur die Sonderzahlung ändert sich:\n\n${LEASE_TABLE}\n\nDer reine Leasingfaktor bleibt gleich, weil er nur die Rate betrachtet. Erst der Gesamtleasingfaktor zeigt, dass jede Sonderzahlung das Angebot teurer macht, solange die Rate nicht im Gegenzug sinkt. Werben Händler mit niedrigen Faktoren, lohnt deshalb immer ein Blick auf Sonderzahlung und Überführung.`,
      },
      {
        title: 'Typischer Fehler: Nettorate und Bruttolistenpreis mischen',
        content: `Gewerbeangebote nennen die Rate meist netto, der Listenpreis wird aber brutto angegeben. Wer beides mischt, rechnet sich das Angebot schön: Eine Bruttorate von 320 € entspricht netto ${eur(LEASE_NET_RATE)}. Bezogen auf 42.000 € brutto ergibt die Nettorate einen Faktor von ${txt(LEASE_NET_F, 'leasingFactor')} statt ${txt(LEASE_GROSS_F, 'leasingFactor')}. Rechnen Sie entweder Rate und Listenpreis beide brutto oder beide netto.`,
      },
    ],
    faqs: [
      {
        question: 'Ist ein Leasingfaktor von 1,0 gut?',
        answer: `Eine Rate von 420 € bei 42.000 € Listenpreis ohne Nebenkosten ergibt genau ${n2(num(LEASE_ONE, 'leasingFactor'))}. Der Rechner ordnet das als „${txt(LEASE_ONE, 'rating')}“ ein: kein Schnäppchen, aber auch kein Ausreißer nach oben.`,
      },
      {
        question: 'Um wie viel erhöht eine Sonderzahlung von 3.000 € den Faktor?',
        answer: `Bei 36 Monaten Laufzeit und 42.000 € Listenpreis um ${n2(LEASE_DP_DELTA)} Punkte, denn die 3.000 € werden rechnerisch mit ${eur(3000 / 36)} pro Monat auf die Rate aufgeschlagen. Bei kürzerer Laufzeit wirkt dieselbe Sonderzahlung noch stärker.`,
      },
      {
        question: 'Sind Mehrkilometer und Inklusivkilometer im Leasingfaktor berücksichtigt?',
        answer: 'Nein. Zwei Angebote mit gleichem Faktor können sehr unterschiedlich teuer werden, wenn eines 10.000 und das andere 15.000 Kilometer im Jahr enthält. Vergleichen Sie Faktoren deshalb nur bei gleicher Laufzeit und gleicher Fahrleistung.',
      },
    ],
  },

  'fahrzeit-rechner': {
    sections: [
      {
        title: 'Fahrzeit-Tabelle ohne Pausen',
        content: `Reine Fahrzeit für typische Strecken bei verschiedenen Durchschnittsgeschwindigkeiten:\n\n${FZ_TABLE}\n\nWichtig: Gemeint ist der Durchschnitt über die gesamte Strecke einschließlich Stadt, Stau und Baustellen, nicht das Tempo auf freier Autobahn.`,
      },
      {
        title: 'Die eigene Durchschnittsgeschwindigkeit aus dem Navi ableiten',
        content: `Das Navi kennt Tempolimits und Verkehrslage meist besser als jede Schätzung. Teilen Sie die Strecke durch die angezeigte Fahrzeit: ${FZ_NAVI_KM} km in 5 Std. 10 Min. ergeben ${n1(FZ_NAVI_SPEED)} km/h. Diesen Wert tragen Sie ein und ergänzen Ihre eigenen Pausen.\n\nSchneller fahren bringt weniger, als es sich anfühlt: 600 km mit durchschnittlich 130 statt 110 km/h sparen ${n(FZ_600_110 - FZ_600_130, 0)} Minuten, und einen so hohen Schnitt hält man über eine lange Strecke selten.`,
      },
    ],
    faqs: [
      {
        question: 'Wie lange fahre ich für 500 km?',
        answer: `Mit durchschnittlich 100 km/h und 30 Minuten Pause brauchen Sie ${txt(FZ_500_100, 'totalTime')}, mit 120 km/h und derselben Pause ${txt(FZ_500_120, 'totalTime')} insgesamt. Bei Ferienverkehr liegt der Schnitt oft deutlich niedriger.`,
      },
      {
        question: 'Welche Durchschnittsgeschwindigkeit soll ich eintragen, wenn ich die Strecke nicht kenne?',
        answer: 'Nehmen Sie die Zeit, die ein Routenplaner für die Strecke angibt, und rechnen Sie daraus den Schnitt aus (Kilometer geteilt durch Stunden). Für reine Landstraßenstrecken liegt er wegen Ortsdurchfahrten fast immer klar unter dem erlaubten Tempo.',
      },
    ],
  },

  'anhaenger-stuetzlast-rechner': {
    sections: [
      {
        title: 'Mindeststützlast nach Anhängergewicht',
        content: `§ 44 Abs. 3 StVZO verlangt mindestens 4 % des tatsächlichen Anhängergewichts, aber nie mehr als 25 kg. Ab ${n(ST_CAP_FROM, 0)} kg Anhängergewicht greift deshalb immer die 25-kg-Grenze:\n\n${ST_TABLE}\n\nDie gesetzliche Untergrenze ist bei schweren Anhängern also sehr niedrig. Für ruhiges Fahrverhalten wird die erlaubte Höchststützlast in der Praxis weitgehend ausgenutzt.`,
      },
      {
        title: 'Wo die Werte stehen und wie Sie beladen',
        content: `- **Zugfahrzeug:** Zulassungsbescheinigung Teil I, Feld 13 („Stützlast in kg“). Die Anhängelast steht in Feld O.1 (gebremst) und O.2 (ungebremst).\n- **Anhängerkupplung:** Typschild an der Kupplung; ist dort ein niedrigerer Wert angegeben, tragen Sie diesen als Wert des Zugfahrzeugs ein.\n- **Anhänger:** Typschild oder Angabe an Deichsel bzw. Auflaufeinrichtung.\n\nBeim Beladen schwere Teile nah über die Achse, eher etwas nach vorn, und die Stützlast danach messen. Beispiel: Wohnwagen mit 1.300 kg, Pkw 80 kg, Deichsel 100 kg: zulässig sind ${txt(ST_EXAMPLE, 'maxAllowed')}, mindestens ${n(num(ST_EXAMPLE, 'minRequired'), 0)} kg; der Rechner empfiehlt ${txt(ST_EXAMPLE, 'recommended').replace('Ideal: ', '')}.`,
      },
    ],
    faqs: [
      {
        question: 'Reichen 25 kg Stützlast für einen schweren Wohnwagen?',
        answer: 'Rechtlich ja, denn § 44 StVZO verlangt nicht mehr als 25 kg. Fahrphysikalisch ist so wenig bei einem großen Wohnwagen aber knapp: Das Gespann reagiert empfindlicher auf Seitenwind und Lenkbewegungen. Deshalb wird die Stützlast meist nahe an den kleineren der beiden Höchstwerte gebracht.',
      },
      {
        question: 'Zählt die Stützlast zur Zuladung des Zugfahrzeugs?',
        answer: 'Ja, sie drückt auf die Kupplung und damit auf das Auto. Bei vollbesetztem und beladenem Fahrzeug kann das zulässige Gesamtgewicht oder die Hinterachslast schneller erreicht sein, als man denkt. Prüfen Sie beides in den Fahrzeugpapieren.',
      },
    ],
  },

  'fahrgemeinschaft-sprit-rechner': {
    sections: [
      {
        title: 'Kostenanteile und die 30-Cent-Grenze',
        content: `Beispiel: 35 km einfache Strecke, 19 Fahrtage, 6,8 l/100 km, 1,80 € je Liter (Beispielpreis). Die Spalte „Mitfahrer zahlen zusammen je km“ zeigt, was beim Fahrer pro gefahrenem Kilometer ankommt:\n\n${FG_TABLE}\n\nNach § 1 Abs. 2 PBefG bleibt die Mitnahme außerhalb des Personenbeförderungsrechts, solange das Gesamtentgelt 30 Cent je Kilometer nicht übersteigt. In allen Zeilen liegt es mit höchstens ${n2(FG_MAX_PER_KM)} € darunter. Knapp wird es erst bei sehr hohem Verschleißzuschlag oder teurem Sprit in einem vollen Auto.`,
      },
      {
        title: 'Steuer: Was Mitfahrer und Fahrer absetzen können',
        content: `Jeder in der Fahrgemeinschaft kann für seine eigene Entfernung zur Arbeit die Entfernungspauschale von ${eur(PD_RATE)} je Kilometer ansetzen, unabhängig davon, wer fährt. Bei 35 km und 220 Arbeitstagen sind das ${txt(FG_PENDLER, 'totalAllowance')}. Für Tage, an denen Sie nur mitfahren, gilt der Höchstbetrag von 4.500 € im Jahr; für Tage mit dem eigenen Auto gilt er nicht. Der Kostenbeitrag, den Mitfahrer zahlen, ist mit der Pauschale abgegolten und kann nicht zusätzlich abgesetzt werden.`,
      },
    ],
    faqs: [
      {
        question: 'Wie teilt man, wenn ein Mitfahrer nur einen Teil der Strecke mitfährt?',
        answer: `Rechnen Sie mit Personenkilometern. Beispiel mit ${n2(FG_COST_PER_KM)} € je km: Fahrer und A fahren täglich 70 km, B steigt unterwegs zu und fährt 40 km mit. Die Tageskosten von ${eur(FG_DAY_COST)} verteilen sich auf ${FG_PKM} Personenkilometer: Fahrer und A tragen je ${eur(FG_SHARE_FULL)}, B ${eur(FG_SHARE_B)}.`,
      },
      {
        question: 'Wir fahren abwechselnd. Muss dann überhaupt Geld fließen?',
        answer: 'Wenn alle ungefähr gleich oft fahren und ähnliche Autos haben, gleichen sich die Kosten von selbst aus. Ein Ausgleich lohnt sich, wenn einer deutlich häufiger fährt oder ein Auto spürbar mehr verbraucht; dann rechnen Sie die Monatskosten je Fahrer mit dem Rechner und verrechnen die Differenz.',
      },
    ],
  },

  'hybrid-auto-kosten-rechner': {
    sections: [
      {
        title: 'Kosten nach elektrischem Fahranteil',
        content: `Mit den Vorgabewerten des Rechners (20 kWh und 7,5 l je 100 km, Beispielpreise 34 ct/kWh und 1,78 €/l, 15.000 km im Jahr):\n\n${HY_TABLE}\n\nJeder Prozentpunkt E-Anteil zählt gleich viel. Wer den Akku nie lädt (0 %), fährt einen schweren Benziner und spart gar nichts.`,
      },
      {
        title: 'Ab welchem Strompreis der E-Modus teurer wird',
        content: `Elektrisch zu fahren lohnt sich nur, solange 100 km mit Strom weniger kosten als mit Benzin. Mit den obigen Werten kosten 100 km Benzinbetrieb ${eur(HY_GAS100)}. Der Strom wird gleich teuer bei ${n1(HY_BREAK_EVEN_CT)} Cent je kWh.\n\nAn öffentlichen Ladesäulen kann dieser Wert überschritten werden: Bei einem Beispielpreis von ${HY_PUBLIC_CT} ct/kWh kosten 100 km elektrisch ${txt(HY_PUBLIC, 'costEl100')}, also mehr als mit Benzin. Ein Plug-in-Hybrid rechnet sich deshalb vor allem mit günstigem Strom zu Hause oder beim Arbeitgeber.`,
      },
    ],
    faqs: [
      {
        question: 'Wie finde ich meinen tatsächlichen elektrischen Fahranteil heraus?',
        answer: 'Viele Plug-in-Hybride zeigen im Bordcomputer oder in der App die elektrisch gefahrenen Kilometer an. Teilen Sie diese durch die Gesamtkilometer: 9.000 elektrische von 15.000 km ergeben 60 %. Ohne solche Anzeige hilft ein Monat mit Notizen zu Ladevorgängen und Strecken.',
      },
      {
        question: 'Lohnt sich ein Plug-in-Hybrid, wenn ich nur öffentlich laden kann?',
        answer: `Oft nicht. Mit ${HY_PUBLIC_CT} ct/kWh als Beispielpreis und 60 % E-Anteil ${HY_PUBLIC_60_SAVING < 0 ? `zeigt der Rechner sogar Mehrkosten von ${eur(-HY_PUBLIC_60_SAVING)} im Jahr` : `zeigt der Rechner nur ${eur(HY_PUBLIC_60_SAVING)} Ersparnis im Jahr`} gegenüber reinem Benzinbetrieb. Mit 34 ct/kWh zu Hause wären es ${txt(hy({}), 'yearlySaving')} Ersparnis.`,
      },
    ],
  },

  'auto-gesamtkosten-rechner': {
    sections: [
      {
        title: 'Woraus sich die Kosten im Standardbeispiel zusammensetzen',
        content: `30.000 € Kaufpreis, 15.000 km, 11,50 € Sprit auf 100 km, 650 € Versicherung, 140 € Steuer, 600 € Wartung:\n\n${GK_PARTS_TABLE}\n\nDer Rechner setzt den Wertverlust pauschal mit 10 % des Kaufpreises an. Für einen Neuwagen ist das in den ersten Jahren eher knapp: Nach der Kurve unseres Wertverlust-Rechners verliert ein 30.000-€-Auto in den ersten vier Jahren im Schnitt ${eur(GK_CURVE_4Y)} pro Jahr statt ${eur(GK_DEPR)}. Bei einem älteren Gebrauchten kann die Pauschale dagegen zu hoch liegen.`,
      },
      {
        title: 'Kosten pro Kilometer nach Fahrleistung',
        content: `Gleiches Auto, nur die Jahreskilometer ändern sich:\n\n${GK_KM_TABLE}\n\nWertverlust, Versicherung, Steuer und Wartung sind im Rechner feste Jahresbeträge. Wer wenig fährt, verteilt sie auf wenige Kilometer, deshalb ist jeder Kilometer dann besonders teuer. Für den Vergleich mit Carsharing oder Bahn ist genau dieser Wert entscheidend.`,
      },
    ],
    faqs: [
      {
        question: 'Was kostet ein Auto im Monat bei 10.000 km im Jahr?',
        answer: `Mit den Vorgabewerten (30.000 € Kaufpreis, 11,50 € je 100 km, 1.390 € Fixkosten) rechnet der Rechner mit ${txt(GK_10K, 'costPerMonth')} im Monat, das sind ${txt(GK_10K, 'costPerKm')}. Ihr eigenes Ergebnis hängt vor allem vom Kaufpreis ab.`,
      },
      {
        question: 'Welche Kosten sind im Ergebnis nicht enthalten?',
        answer: 'Kreditzinsen oder Leasingraten, Parkgebühren, Garage oder Stellplatzmiete, Maut, Vignetten, Wäsche und Pflege. Rechnen Sie diese Beträge pro Monat dazu, wenn sie bei Ihnen regelmäßig anfallen.',
      },
    ],
  },

  'auto-wertverlust-rechner': {
    sections: [
      {
        title: 'Restwert-Tabelle nach Jahren',
        content: `Geschätzter Restwert nach der hinterlegten Durchschnittskurve:\n\n${WV_TABLE}\n\nDer Rechner geht immer vom Neupreis aus. Kilometerstand, Ausstattung, Zustand und Nachfrage nach dem Modell kann er nicht berücksichtigen; für einen Verkaufspreis sind Vergleichsangebote gleicher Modelle oder ein Gutachten genauer.`,
      },
      {
        title: 'Warum die ersten Jahre am teuersten sind',
        content: `Der Verlust pro Jahr, gemessen am Neupreis:\n\n${WV_STEP_LIST}\n\nDaraus folgt eine einfache Rechnung: Wer einen 35.000-€-Wagen nach drei Jahren für ${eur0(WV_USED_BUY)} kauft und mit sieben Jahren für ${eur0(WV_USED_SELL)} verkauft, verliert in vier Jahren ${eur0(WV_USED_BUY - WV_USED_SELL)}. Als Neuwagen hätte derselbe Zeitraum von vier Jahren ${eur0(WV_NEW_LOSS_4)} gekostet.`,
      },
    ],
    faqs: [
      {
        question: 'Was ist ein Auto nach 10 Jahren noch wert?',
        answer: `Nach der Kurve des Rechners noch ${formatPercent(100 - num(WV_10, 'pctLoss'), 0)} des Neupreises, bei 35.000 € also ${txt(WV_10, 'remainingValue')}. Danach sinkt der Wert um zwei Prozentpunkte pro Jahr: nach 12 Jahren ${txt(WV_12, 'remainingValue')}, nach 15 Jahren ${txt(WV_15, 'remainingValue')}. Tiefer als 10 % setzt der Rechner nicht an.`,
      },
      {
        question: 'Wie schätze ich den Wertverlust eines Gebrauchtwagens?',
        answer: 'Geben Sie den ursprünglichen Neupreis ein und rechnen Sie zweimal: einmal mit dem heutigen Alter, einmal mit dem Alter beim geplanten Verkauf. Die Differenz der beiden Restwerte ist der Wertverlust in Ihrer Haltedauer. Ihren tatsächlichen Kaufpreis ersetzt das nicht; lag er über dem Kurvenwert, fällt Ihr Verlust höher aus.',
      },
    ],
  },

  'reifen-abrollumfang-rechner': {
    sections: [
      {
        title: 'Gängige Alternativgrößen zu 205/55 R16',
        content: `Vergleich mit 205/55 R16 als Originalgröße, berechnet mit dem Rechner:\n\n${TY_TABLE}\n\nEine positive Differenz bedeutet einen größeren Umfang: Der Tacho zeigt dann weniger an als mit den alten Reifen. Ob eine Größe für Ihr Auto zulässig ist, steht nicht in dieser Tabelle, sondern in den Fahrzeugpapieren, der Übereinstimmungsbescheinigung oder einer Reifenfreigabe.`,
      },
      {
        title: 'So lesen Sie das Ergebnis',
        content: `- **Differenz Abrollumfang:** um diesen Anteil ändert sich die Strecke je Radumdrehung und damit auch der Kilometerzähler.\n- **Tacho bei echten 100 km/h:** zeigt, wie sich die Anzeige gegenüber den alten Reifen verschiebt. Der Rechner nimmt an, dass der Tacho vorher exakt anzeigte; in der Praxis geht er meist etwas vor, das fängt kleine Verschiebungen auf.\n- **Bodenfreiheit:** ändert sich um die Hälfte der Durchmesserdifferenz. Bei 215/55 R16 statt 205/55 R16 sind das ${n1(TY_215_LIFT)} mm.\n\nMehr als die reine Rechnung zählt der Platz im Radkasten: Breitere Reifen können bei Lenkeinschlag oder Einfedern schleifen.`,
      },
    ],
    faqs: [
      {
        question: 'Wie schnell fahre ich wirklich, wenn der Tacho mit größeren Reifen 100 km/h zeigt?',
        answer: `Mit 215/55 R16 statt 205/55 R16 ist der Umfang ${txt(TY_215, 'diffCircPct')} größer. Zeigte der Tacho vorher exakt an, fahren Sie bei angezeigten 100 km/h nun etwa ${n1(TY_215_REAL_AT_100)} km/h. Wie viel der Tacho ab Werk vorgeht, verrät ein Vergleich mit der GPS-Geschwindigkeit im Navi.`,
      },
      {
        question: 'Ändert sich durch andere Reifen auch der Kilometerstand?',
        answer: 'Ja, im selben Verhältnis wie der Abrollumfang. Bei 2 % größerem Umfang zählt der Kilometerzähler auf 10.000 echten Kilometern rund 200 km zu wenig, weil er Radumdrehungen zählt und nicht die tatsächliche Strecke.',
      },
    ],
  },

  'elektroauto-ladekosten-rechner': {
    sections: [
      {
        title: 'Kosten pro 100 km: Haushaltsstrom und öffentliches Laden',
        content: `Die Strompreise in der Tabelle sind **Beispielwerte**, keine aktuellen Tarife; 0,38 €/kWh ist der Vorgabewert des Rechners. Haushaltstarife liegen meist am unteren Ende, Ad-hoc-Laden an Schnellladesäulen eher am oberen:\n\n${EV_TABLE}\n\nZum Vergleich: Ein Benziner mit 6,5 l/100 km kostet bei einem Beispielpreis von 1,75 €/l ${eur(EV_PETROL_100)} auf 100 km. Wer überwiegend öffentlich zu hohen Preisen lädt, ist mit dem E-Auto also nicht automatisch günstiger unterwegs.`,
      },
      {
        title: 'Jahreskosten mit gemischtem Laden',
        content: `Typisch ist eine Mischung aus Laden zu Hause und unterwegs. Beispiel mit 18 kWh/100 km und 15.000 km im Jahr:\n\n- nur zu Hause zu 0,38 €/kWh: **${eur(EV_YEAR_HOME_ONLY)}**\n- 80 % zu Hause zu 0,38 €/kWh, 20 % öffentlich zu 0,69 €/kWh: **${eur(EV_YEAR_MIX)}**\n\nRechnen Sie die beiden Anteile getrennt mit Ihren eigenen Preisen und Kilometern und addieren Sie sie. Grundgebühren von Ladetarifen kommen gegebenenfalls noch hinzu.`,
      },
    ],
    faqs: [
      {
        question: 'Was kostet eine volle Akkuladung?',
        answer: `Bei 0,38 €/kWh rechnerisch: ${EV_FULL}. Der Wert bezieht sich auf die eingegebene Nettokapazität; Ladeverluste kommen hinzu, dafür lädt man selten von 0 auf 100 %.`,
      },
      {
        question: 'Mit welchem Verbrauch soll ich rechnen: Bordcomputer oder Stromzähler?',
        answer: 'Für die Kosten zählt der Strom, den Sie bezahlen, also der Wert am Zähler oder an der Ladesäule. Der Bordcomputer zeigt nur, was im Akku angekommen ist. Wenn Sie nur den Bordcomputer-Wert kennen, rechnen Sie zur Sicherheit etwas höher.',
      },
    ],
  },

  'promillerechner-widmark': {
    sections: [
      {
        title: 'Promillegrenzen im Straßenverkehr',
        content: `| Wert | Wer / wann | Rechtsfolge |\n| --- | --- | --- |\n| 0,0 ‰ | Fahranfänger in der Probezeit und alle unter 21 Jahren | Alkoholverbot, Ordnungswidrigkeit (§ 24c StVG) |\n| ab 0,3 ‰ | mit Ausfallerscheinungen oder Unfall | relative Fahruntüchtigkeit, Straftat nach § 316 StGB möglich |\n| 0,5 ‰ bzw. 0,25 mg/l Atemalkohol | alle Kfz-Fahrer | Ordnungswidrigkeit (§ 24a StVG), Geldbuße bis 3.000 € |\n| ab 1,1 ‰ | Kfz-Fahrer | absolute Fahruntüchtigkeit nach der Rechtsprechung, Straftat |\n| ab 1,6 ‰ bzw. 0,8 mg/l | alle Fahrzeugführer, auch auf dem Fahrrad | medizinisch-psychologisches Gutachten (MPU) wird angeordnet (§ 13 FeV) |\n\nEntscheidend ist immer der tatsächlich gemessene Wert, nicht das Ergebnis eines Rechners.`,
      },
      {
        title: 'Rechnerische Spitzenwerte und was das Modell nicht weiß',
        content: `Spitzenwerte nach der Widmark-Formel des Rechners, ohne Abbau:\n\n${PR_TABLE}\n\nDie Formel kennt weder Mageninhalt noch Trinkgeschwindigkeit, Medikamente oder den individuellen Abbau. Sie unterstellt außerdem, dass der gesamte Alkohol ins Blut gelangt; tatsächlich schwanken die Werte zwischen Menschen gleichen Gewichts deutlich. Das Ergebnis taugt deshalb, um die Größenordnung zu verstehen, aber **nicht als Test, ob Sie fahren dürfen oder fahrtüchtig sind**. Schon unter 0,5 ‰ kann bei Fahrfehlern eine Straftat vorliegen.`,
      },
    ],
    faqs: [
      {
        question: 'Wie lange dauert es rechnerisch, bis ein Liter Bier abgebaut ist?',
        answer: `Für einen Mann mit 80 kg ergibt der Rechner einen Spitzenwert von ${txt(PR_1L, 'maxPromille')} und rund ${n1(PR_1L_TOTAL_H)} Stunden ab Trinkbeginn bis 0,0 ‰. Bei langsamerem Abbau dauert es länger. Wer am Abend viel getrunken hat, kann am nächsten Morgen noch Restalkohol im Blut haben.`,
      },
      {
        question: 'Was ist der Unterschied zwischen Promille und mg/l?',
        answer: 'Promille beschreiben den Alkohol im Blut, mg/l den Alkohol in der Atemluft. § 24a StVG nennt beide Grenzen nebeneinander: 0,5 ‰ im Blut oder 0,25 mg/l in der Atemluft. Ein Rechner wie dieser schätzt nur den Blutwert.',
      },
    ],
  },

  'pendlerpauschale-rechner': {
    sections: [
      {
        title: 'Pauschale 2026 nach Entfernung und Homeoffice',
        content: `Berechnet mit ${eur(PD_RATE)} je Kilometer ab dem ersten Kilometer. Ein ✓ bedeutet, dass die Pauschale allein den Arbeitnehmer-Pauschbetrag von ${eur0(AN_PAUSCH)} übersteigt:\n\n${PD_TABLE}\n\nOhne Homeoffice wird die Grenze ab ${PD_KM_FULL} km einfacher Strecke überschritten, mit ${HO_DAYS} Homeoffice-Tagen erst ab ${PD_KM_HO} km. Gegenüber 2025, als für die ersten 20 km nur 0,30 € galten, bringen 30 km nun ${eur(PD_2026_DAY_30)} statt ${eur(PD_2025_DAY_30)} pro Pendeltag.`,
      },
      {
        title: 'Was die Pauschale an Steuern spart',
        content: `Die Pauschale ist keine Erstattung, sondern mindert das zu versteuernde Einkommen, und das nur, soweit Ihre Werbungskosten zusammen über ${eur0(AN_PAUSCH)} liegen. Beispiel: 30 km, 220 Tage ergeben ${eur(PD_30)}. Über dem Pauschbetrag liegen ${eur(PD_30_OVER)}. Bei einem angenommenen Grenzsteuersatz von 30 % spart das rund ${eur(PD_30_OVER * 0.3)} Einkommensteuer, ohne Solidaritätszuschlag und Kirchensteuer.\n\nHaben Sie weitere Werbungskosten wie Arbeitsmittel oder Fortbildung, zählen diese zusammen mit der Pauschale. Dann kann sich die Angabe auch bei kürzeren Wegen lohnen.`,
      },
    ],
    faqs: [
      {
        question: 'Ab wie vielen Kilometern lohnt sich die Pendlerpauschale?',
        answer: `Bei 220 Arbeitstagen ohne weitere Werbungskosten ab ${PD_KM_FULL} km einfacher Entfernung, weil erst dann der Pauschbetrag von ${eur0(AN_PAUSCH)} überschritten wird. Mit zwei Homeoffice-Tagen pro Woche verschiebt sich die Schwelle auf ${PD_KM_HO} km.`,
      },
      {
        question: 'Zählen Urlaubs- und Krankheitstage als Arbeitstage?',
        answer: 'Nein. Die Pauschale gibt es nur für Tage, an denen Sie tatsächlich zur ersten Tätigkeitsstätte fahren. Eine Fünftagewoche hat rund 260 Wochentage im Jahr; davon gehen Urlaub, die je nach Bundesland unterschiedlich vielen Feiertage und Krankheitstage ab. Tragen Sie die Zahl ein, die sich daraus für Sie ergibt.',
      },
      {
        question: 'Darf ich einen längeren Weg als den kürzesten ansetzen?',
        answer: 'Ja, wenn er offensichtlich verkehrsgünstiger ist und Sie ihn regelmäßig für die Fahrt zur Arbeit nutzen (§ 9 Abs. 1 Satz 3 Nr. 4 EStG), etwa eine Umgehungsstraße oder Autobahn statt einer staugeplagten Ortsdurchfahrt. Notieren Sie, warum Sie diesen Weg fahren, falls das Finanzamt nachfragt.',
      },
    ],
  },

  'co2-auto-rechner': {
    sections: [
      {
        title: 'Gramm CO₂ pro Kilometer nach Verbrauch',
        content:
          `Direkte Emissionen mit den Faktoren des Rechners (Benzin ${n(CO2_BENZIN_FACTOR, 3)} kg/l, Diesel ${n(CO2_DIESEL_FACTOR, 3)} kg/l, Strommix 2025):\n\n${CO2_TABLE}\n\n` +
          `So lesen Sie die Tabelle: Ein Diesel mit 6 l/100 km (${n(num(CO2_D6, 'co2PerKm'), 0)} g/km) liegt knapp unter einem Benziner mit 7 l (${n(num(CO2_B7, 'co2PerKm'), 0)} g/km), aber über einem Benziner mit 6 l (${n(num(CO2_B6, 'co2PerKm'), 0)} g/km). Pro Liter stößt Diesel mehr aus, entscheidend ist der Verbrauch. Beim E-Auto hängt der Wert am Strommix: Laden Sie überwiegend mit eigenem Solarstrom, liegt er deutlich niedriger als in der Tabelle.`,
      },
      {
        title: 'Was der CO₂-Preis 2026 an der Zapfsäule ausmacht',
        content:
          `Der nationale CO₂-Preis liegt 2026 in einem Korridor von ${eur0(CO2_PRICE_2026_CORRIDOR.min)} bis ${eur0(CO2_PRICE_2026_CORRIDOR.max)} je Tonne (§ 10 Abs. 2 BEHG). Wird er voll an der Tankstelle weitergegeben, steckt rechnerisch so viel im Literpreis:\n\n` +
          table(
            ['Kraftstoff', `bei ${eur0(CO2_PRICE_2026_CORRIDOR.min)}/t`, `bei ${eur0(CO2_PRICE_2026_CORRIDOR.max)}/t`],
            [
              ['Benzin', `${n2(CO2_CT_PER_L(CO2_BENZIN_FACTOR, CO2_PRICE_2026_CORRIDOR.min) * CO2_MWST)} ct/l`, `${n2(CO2_CT_PER_L(CO2_BENZIN_FACTOR, CO2_PRICE_2026_CORRIDOR.max) * CO2_MWST)} ct/l`],
              ['Diesel', `${n2(CO2_CT_PER_L(CO2_DIESEL_FACTOR, CO2_PRICE_2026_CORRIDOR.min) * CO2_MWST)} ct/l`, `${n2(CO2_CT_PER_L(CO2_DIESEL_FACTOR, CO2_PRICE_2026_CORRIDOR.max) * CO2_MWST)} ct/l`],
            ],
          ) +
          `\n\nDie Werte enthalten ${formatPercent(LEGAL_VALUES_2026.mwstNormalsatz.value * 100, 0)} Mehrwertsteuer. Für das Standardbeispiel (15.000 km, 7 l Benzin, ${n(CO2_B7_T, 2)} t CO₂) sind das ${eur0(CO2_COST_MIN)} bis ${eur0(CO2_COST_MAX)} im Jahr. Den CO₂-Preis für andere Brennstoffe rechnet der [CO₂-Preis-Rechner](/rechner/co2-preis-rechner/).`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel CO₂ stößt ein Auto mit 6 Litern Verbrauch aus?',
        answer: `Ein Benziner mit 6 l/100 km kommt auf rund ${n(num(CO2_B6, 'co2PerKm'), 0)} g CO₂ pro Kilometer, ein Diesel mit 6 l auf rund ${n(num(CO2_D6, 'co2PerKm'), 0)} g. Bei 15.000 km im Jahr sind das ${n(num(CO2_B6, 'co2Total'), 2)} bzw. ${n(num(CO2_D6, 'co2Total'), 2)} Tonnen. Ein E-Auto mit 18 kWh/100 km liegt beim Strommix 2025 bei ${n(num(CO2_E18, 'co2PerKm'), 0)} g/km.`,
      },
      {
        question: 'Warum weicht das Ergebnis vom CO₂-Wert im Fahrzeugschein ab?',
        answer: 'Der Wert in der Zulassungsbescheinigung (Feld V.7) stammt aus dem genormten WLTP-Prüfzyklus. Der Rechner nutzt dagegen Ihren tatsächlichen Verbrauch. Wer viel Kurzstrecke, Autobahn mit hohem Tempo oder im Winter fährt, liegt oft über dem Prüfwert. Für die Kfz-Steuer zählt allein der WLTP-Wert, für Ihre persönliche Klimabilanz ist der echte Verbrauch aussagekräftiger.',
      },
    ],
  },
};
