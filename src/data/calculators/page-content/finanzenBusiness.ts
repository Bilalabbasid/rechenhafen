import { PageContentMap } from './types';
import { CalculationResult } from '@/types/calculator';
import { EXTRA_FINANZEN_KREDIT } from '../extra/finanzenKredit';
import { EXTRA_BUSINESS_STATISTIK } from '../extra/businessStatistik';
import { LEGAL_VALUES_2026 } from '@/legal/de';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters';
import { calculateVat, calculateMargin } from '@/lib/calculators/business';
import { calculateDiscount } from '@/lib/calculators/moreCalculators';
import { calculateCompoundInterest } from '@/lib/calculators/finanzen';

// Alle Zahlen dieser Seiten kommen aus denselben calculate-Funktionen wie die Rechner selbst
// bzw. aus den geprüften Rechtswerten in src/legal/de/2026.ts.
const L = LEGAL_VALUES_2026;
const eur = (v: number) => formatCurrency(v);
const eur0 = (v: number) => `${formatNumber(Math.round(v), 0)} €`;
const pct = (v: number, digits = 2) => formatPercent(v, digits);
const num = (v: number, digits = 0) => formatNumber(v, digits);
const prim = (r: CalculationResult): number => Number(r.primary.value);
const sec = (r: CalculationResult, id: string): number => Number(r.secondary?.find((x) => x.id === id)?.value ?? 0);
const row = (cells: Array<string | number>) => `| ${cells.join(' | ')} |`;
const table = (head: string[], rows: Array<Array<string | number>>) =>
  [row(head), row(head.map(() => '---')), ...rows.map(row)].join('\n');

const calc = (slug: string) => {
  const c = [...EXTRA_FINANZEN_KREDIT, ...EXTRA_BUSINESS_STATISTIK].find((x) => x.slug === slug);
  if (!c) throw new Error(`page-content/finanzenBusiness: Rechner ${slug} fehlt`);
  return (inputs: Record<string, any>) => c.calculate(inputs) as CalculationResult;
};

// Steuerwerte
const PAUSCH_SINGLE = L.sparerPauschbetragSingle.value;
const PAUSCH_MARRIED = L.sparerPauschbetragMarried.value;
const CAPITAL_TAX = L.kapitalertragsteuerSatz.value * (1 + L.solzRate.value); // 26,375 %
const TEILFREI_AKTIEN = 0.3; // § 20 Abs. 1 Satz 1 InvStG (Aktienteilfreistellung)
const MWST = L.mwstNormalsatz.value;
// Basiszins für die Vorabpauschale 2026: 3,20 % (BMF-Schreiben vom 13.01.2026, Wert der Bundesbank zum 02.01.2026)
const BASISZINS_2026 = 3.2;
// Aktueller Rentenwert ab 01.07.2026: 42,52 € (DRV, Pressemitteilung vom 05.03.2026; vorher 40,79 €)
const RENTENWERT_2026 = 42.52;
const RENTENWERT_VORHER = 40.79;
// Kranken- und Pflegeversicherung der Rentner: halber allgemeiner Satz + halber Ø-Zusatzbeitrag, Pflege voll
const KV_RENTNER = (L.beitragssatzKrankenversicherungAllgemein.value + L.zusatzbeitragKrankenversicherungDurchschnitt.value) / 2;
const PV_MIT_KIND = L.beitragssatzPflegeversicherung.value;
const PV_KINDERLOS = PV_MIT_KIND + L.pflegeZuschlagKinderlos.value;
// Freiwillig gesetzlich versicherte Selbstständige (allgemeiner Satz mit Krankengeld) tragen den Beitrag allein
const KV_SELBST = L.beitragssatzKrankenversicherungAllgemein.value + L.zusatzbeitragKrankenversicherungDurchschnitt.value;

// ---------- Thesaurierend vs. ausschüttend ----------
const thesCalc = calc('thesaurierend-vs-ausschuettend-rechner');
const THES_ROWS = [10, 20, 30].map((y) => {
  const reinvest = prim(thesCalc({ monthlyRate: 300, years: y, growthRate: 5, dividendRate: 2 }));
  const spent = prim(thesCalc({ monthlyRate: 300, years: y, growthRate: 5, dividendRate: 0 }));
  return { y, reinvest, spent, diff: reinvest - spent };
});
const THES_30 = THES_ROWS.find((r) => r.y === 30)!;
const VP_FUND = 20000;
const VP_BASIS = VP_FUND * (BASISZINS_2026 / 100) * 0.7;
const VP_TAXABLE = VP_BASIS * (1 - TEILFREI_AKTIEN);
const VP_TAX = VP_TAXABLE * CAPITAL_TAX;
const ETF_FREE_SINGLE = PAUSCH_SINGLE / (1 - TEILFREI_AKTIEN);
const ETF_FREE_MARRIED = PAUSCH_MARRIED / (1 - TEILFREI_AKTIEN);

// ---------- Ewige Rente ----------
const ewigCalc = calc('ewige-rente-rechner');
const ewig = (monthly: number, rate: number) => prim(ewigCalc({ monthlyIncome: monthly, netReturn: rate }));
const EWIG_RATES = [2, 3, 4, 5];
const EWIG_ROWS = [1000, 1500, 2000, 3000].map((m) => [eur0(m), ...EWIG_RATES.map((r) => eur0(ewig(m, r)))]);
const EWIG_GROSS_INTEREST = 4;
const EWIG_NET_INTEREST = EWIG_GROSS_INTEREST * (1 - CAPITAL_TAX);
const EWIG_NET_ETF = EWIG_GROSS_INTEREST * (1 - CAPITAL_TAX * (1 - TEILFREI_AKTIEN));
const EWIG_NOMINAL = ewig(2500, 3.5);
const EWIG_REAL = ewig(2500, 1.5);

// ---------- Dividendenrendite ----------
const divCalc = calc('dividendenrendite-rechner');
const DIV_PRICES = [80, 100, 120, 160, 240];
const DIV_ROWS = DIV_PRICES.map((p) => [eur(p), pct(prim(divCalc({ sharePrice: p, dividend: 4.8, sharesCount: 50 })))]);
const DIV_ANNUAL = sec(divCalc({ sharePrice: 120, dividend: 4.8, sharesCount: 50 }), 'annual');
const DIV_TAX = DIV_ANNUAL * CAPITAL_TAX;
const DIV_500 = divCalc({ sharePrice: 100, dividend: 4, sharesCount: 1500 });
const DIV_500_CAPITAL = 100 * 1500;

// ---------- Verdopplungszeit ----------
const dblCalc = calc('verdopplungszeit-rechner');
const dbl = (r: number) => dblCalc({ interestRate: r, initialAmount: 10000 });
const DBL_ROWS = [1, 2, 3, 4, 5, 6, 8, 10, 12].map((r) => {
  const res = dbl(r);
  return [pct(r, 0), num(prim(res), 2), num(72 / r, 2), num(70 / r, 2), res.primary.formattedValue ?? ''];
});
const DBL_INFL = prim(dbl(2));
const DBL_REAL_RATE = (1.04 / 1.02 - 1) * 100;
const DBL_REAL = prim(dbl(DBL_REAL_RATE));
const DBL_NOMINAL_4 = prim(dbl(4));
const DBL_3 = dbl(3);

// ---------- Gold ----------
const goldCalc = calc('gold-rendite-rechner');
const GOLD_OZ = 31.1035;
const GOLD_1 = goldCalc({ weightGram: GOLD_OZ, buyPrice: 55, currentPrice: 75 });
const GOLD_2 = goldCalc({ weightGram: GOLD_OZ * 2, buyPrice: 55, currentPrice: 75 });
const GOLD_SPREAD_SELL = 75 * 0.97; // Beispiel: Händler-Ankaufspreis 3 % unter dem Bewertungspreis
const GOLD_SPREAD = goldCalc({ weightGram: GOLD_OZ, buyPrice: 55, currentPrice: GOLD_SPREAD_SELL });
const GOLD_TOTAL_RET = sec(GOLD_1, 'ret');
const GOLD_PA_3Y = (Math.pow(1 + GOLD_TOTAL_RET / 100, 1 / 3) - 1) * 100;
const GOLD_PA_8Y = (Math.pow(1 + GOLD_TOTAL_RET / 100, 1 / 8) - 1) * 100;

// ---------- Rentenlücke ----------
const gapCalc = calc('rentenluecke-rechner');
const GAP_ROWS = [30, 35, 40, 45].map((ep) => {
  const gross = ep * RENTENWERT_2026;
  const r = gapCalc({ desiredNet: 2400, expectedPension: gross });
  return [num(ep), eur(gross), eur(sec(r, 'netPension')), eur(prim(r))];
});
const GAP_EP_FOR_1600 = 1600 / RENTENWERT_2026;
const GAP_KVPV_KIND = KV_RENTNER + PV_MIT_KIND;
const GAP_KVPV_OHNE = KV_RENTNER + PV_KINDERLOS;
const GAP_DEFAULT = gapCalc({ desiredNet: 2400, expectedPension: 1600 });
const GAP_DEFAULT_VALUE = prim(GAP_DEFAULT);
const GAP_KVPV_1600 = 1600 * GAP_KVPV_KIND;
const GAP_CAPITAL_3 = ewig(GAP_DEFAULT_VALUE, 3);
const GAP_CAPITAL_4 = ewig(GAP_DEFAULT_VALUE, 4);

// ---------- Finanzielle Freiheit ----------
const fireCalc = calc('finanzielle-freiheit-rechner');
const fire = (exp: number, swr: number, cur = 0) => fireCalc({ monthlyExpenses: exp, withdrawalRate: swr, currentAssets: cur });
const FIRE_SWR = [3, 3.5, 4];
const FIRE_ROWS = [1500, 2000, 2500, 3000].map((m) => [eur0(m), ...FIRE_SWR.map((s) => eur0(prim(fire(m, s))))]);
const FIRE_DEFAULT = fire(2200, 3.5, 60000);
const FIRE_2000_4 = prim(fire(2000, 4));
const FIRE_2000_35 = prim(fire(2000, 3.5));
const FIRE_BRIDGE = prim(fire(2200 - 1200, 3.5));
const FIRE_PER_EURO = prim(fire(2201, 3.5)) - prim(fire(2200, 3.5));

// ---------- Depotgebühren ----------
const depotCalc = calc('depotgebuehren-rechner');
const depot = (p: number, ter: number, custody: number, years: number, gross = 7) =>
  depotCalc({ portfolioVal: p, ter, custodyFee: custody, years, grossReturn: gross });
const DEPOT_ROWS = [0.1, 0.2, 0.5, 1.0, 1.5, 2.0].map((t) => {
  const r = depot(40000, t, 0, 20);
  return [pct(t), eur0(sec(r, 'withCosts')), eur0(prim(r)), pct((prim(r) / sec(r, 'withoutCosts')) * 100, 1)];
});
const DEPOT_FIX_BIG_RES = depot(40000, 0, 50, 20);
const DEPOT_FIX_BIG_SHARE = (prim(DEPOT_FIX_BIG_RES) / sec(DEPOT_FIX_BIG_RES, 'withoutCosts')) * 100;
const DEPOT_FIX_SMALL = depot(5000, 0, 50, 20);
const DEPOT_FIX_SMALL_SHARE = (prim(DEPOT_FIX_SMALL) / sec(DEPOT_FIX_SMALL, 'withoutCosts')) * 100;
const DEPOT_100K_1PCT = prim(depot(100000, 1, 0, 30));
const DEPOT_100K_02PCT = prim(depot(100000, 0.2, 0, 30));

// ---------- Freistellungsauftrag ----------
const fsaCalc = calc('freistellungsauftrag-rechner');
const FSA_ROWS = [500, 1000, 1500, 2500, 5000].map((g) => {
  const s = fsaCalc({ annualGains: g, status: 'single', churchTax: false });
  const m = fsaCalc({ annualGains: g, status: 'married', churchTax: false });
  return [eur0(g), eur(prim(s)), eur(sec(s, 'due')), eur(prim(m)), eur(sec(m, 'due'))];
});

// ---------- Lagerumschlag ----------
const lagerCalc = calc('lagerumschlagshaeufigkeit-rechner');
const lager = (cogs: number, inv: number) => lagerCalc({ costOfGoodsSold: cogs, avgInventoryValue: inv });
const LAGER_ROWS = [50000, 75000, 100000, 150000, 200000].map((i) => {
  const r = lager(600000, i);
  return [eur0(i), num(prim(r), 2), `${num(sec(r, 'duration'), 0)} Tage`];
});
const LAGER_FREED = 100000 - 75000;
const LAGER_FREED_COST = LAGER_FREED * 0.08; // Beispielsatz 8 % für Zins- und Lagerkosten
const LAGER_WRONG = prim(lager(900000, 100000));
const LAGER_RIGHT = prim(lager(600000, 100000));
const LAGER_365 = 365 / LAGER_RIGHT;

// ---------- Deckungsbeitrag ----------
const dbCalc = calc('deckungsbeitrag-rechner');
const db = (p: number, kv: number, q: number, kf: number) => dbCalc({ pricePerUnit: p, variableCostPerUnit: kv, unitsSold: q, fixedCostsTotal: kf });
const DB_PRICE_ROWS = [40, 45, 50, 55, 60].map((p) => {
  const r = db(p, 20, 1000, 20000);
  return [eur(p), eur(sec(r, 'unitDb')), pct(sec(r, 'dbRatio'), 1), eur0(sec(r, 'operatingResult')), `${num(sec(r, 'bepUnits'))} Stück`];
});
const DB_ZUSATZ = db(35, 20, 200, 0);
const DB_ZUSATZ_LOW = db(18, 20, 200, 0);
const DB_BASE = db(50, 20, 1000, 20000);
const DB_RATIO = sec(DB_BASE, 'dbRatio');
const DB_BEP_REVENUE = 20000 / (DB_RATIO / 100);

// ---------- Liquiditätsgrade ----------
const liqCalc = calc('liquiditaetsgrad-rechner');
const liq = (cash: number, rec: number, inv: number, liab: number) =>
  liqCalc({ cashAndBanks: cash, shortTermReceivables: rec, inventories: inv, shortTermLiabilities: liab });
const LIQ_CASES: Array<[string, CalculationResult]> = [
  ['Ausgangslage (Werte aus dem Rechner)', liq(30000, 70000, 60000, 80000)],
  ['20.000 € Lieferantenschulden aus Bankguthaben bezahlt', liq(10000, 70000, 60000, 60000)],
  ['Kunde zahlt 30.000 € Forderung', liq(60000, 40000, 60000, 80000)],
  ['Ware für 20.000 € auf Ziel eingekauft', liq(30000, 70000, 80000, 100000)],
];
const LIQ_ROWS = LIQ_CASES.map(([label, r]) => [label, pct(sec(r, 'l1'), 1), pct(prim(r), 1), pct(sec(r, 'l3'), 1)]);
const LIQ_PAID = LIQ_CASES[1][1];

// ---------- Stundensatz ----------
const hourCalc = calc('stundensatz-kalkulation-freiberufler-rechner');
const hour = (net: number, exp: number, off: number, ratio: number) =>
  hourCalc({ desiredNetAnnual: net, businessExpensesAnnual: exp, vacationAndSickDays: off, billableRatioPct: ratio });
const HOUR_DEFAULT = hour(45000, 12000, 45, 60);
const HOUR_RATE = prim(HOUR_DEFAULT);
const HOUR_GROSS_NEED = 45000 * 1.65;
const HOUR_ROWS = [50, 60, 70, 80].map((a) => {
  const r = hour(45000, 12000, 45, a);
  return [pct(a, 0), `${num(sec(r, 'billableHoursDisplay'))} h`, eur(prim(r)), eur0(sec(r, 'dailyRate'))];
});
const HOUR_75 = hour(45000, 12000, 45, 75);

// ---------- Skonto ----------
const skCalc = calc('skonto-jahreszins-rechner');
const sk = (pctSk: number, days: number, net: number, credit = 9.5, invoice = 5000) =>
  skCalc({ invoiceGross: invoice, skontoPercent: pctSk, skontoDays: days, netDays: net, creditInterestPct: credit });
const SK_TERMS: Array<[number, number]> = [[10, 30], [14, 30], [10, 60]];
const SK_ROWS = [1, 2, 3].map((s) => [pct(s, 0), ...SK_TERMS.map(([d, n]) => pct(prim(sk(s, d, n)), 1))]);
const SK_TYPICAL = sk(2, 10, 30);
const SK_TYPICAL_RATE = prim(SK_TYPICAL);
const SK_SAVING = sec(SK_TYPICAL, 'savingsEuro');
const SK_NET = sec(SK_TYPICAL, 'netBenefit');
const SK_INTEREST = SK_SAVING - SK_NET;
const SK_LONG = sk(1, 10, 90, 9.5);
const SK_VAT_GROSS = 5000;
const SK_VAT_CORRECTION = (SK_VAT_GROSS * 0.02 * MWST) / (1 + MWST);

// ---------- Cashflow ----------
const cfCalc = calc('cashflow-rechner');
const cf = (ni: number, afa: number, prov: number) => cfCalc({ netIncome: ni, depreciation: afa, changeProvisions: prov, revenue: 500000 });
const CF_CASES: Array<[string, number, number, number]> = [
  ['Gewinnjahr (Beispiel des Rechners)', 60000, 35000, 10000],
  ['Verlustjahr mit hohen Abschreibungen', -20000, 35000, 0],
  ['Rückstellung wird aufgelöst', 60000, 35000, -15000],
];
const CF_ROWS = CF_CASES.map(([label, ni, afa, prov]) => {
  const r = cf(ni, afa, prov);
  return [label, eur0(ni), eur0(afa), eur0(prov), eur0(prim(r)), pct(sec(r, 'margin'), 1)];
});
const CF_BASE = prim(cf(60000, 35000, 10000));
const CF_LOSS = prim(cf(-20000, 35000, 0));
const CF_RECEIVABLES_UP = 40000;
const CF_NET_DEBT = 420000;

// ---------- AfA linear / degressiv ----------
const afaCalc = calc('abschreibung-linear-degressiv-rechner');
const afaYear = (cost: number, life: number, method: string) => prim(afaCalc({ assetCost: cost, usefulLifeYears: life, afaMethod: method }));
const afaRate = (life: number, method: string) => sec(afaCalc({ assetCost: 10000, usefulLifeYears: life, afaMethod: method }), 'rate');
const AFA_COST = 50000;
const AFA_LIFE = 10;
const AFA_LINEAR = afaYear(AFA_COST, AFA_LIFE, 'linear');
// Degressiver Plan: jedes Jahr Satz × Restbuchwert; Wechsel zu linear (Restbuchwert ÷ Restnutzungsdauer), sobald das mehr ergibt (§ 7 Abs. 3 EStG)
const AFA_PLAN = (() => {
  const rows: Array<{ year: number; used: number; switchedNow: boolean; book: number }> = [];
  let book = AFA_COST;
  let switched = false;
  for (let year = 1; year <= AFA_LIFE; year++) {
    const deg = afaYear(book, AFA_LIFE, 'degressive30');
    const lin = afaYear(book, AFA_LIFE - year + 1, 'linear');
    const switchedNow = !switched && lin > deg;
    if (switchedNow) switched = true;
    const used = switched ? lin : deg;
    book -= used;
    rows.push({ year, used, switchedNow, book: Math.abs(book) < 0.005 ? 0 : book });
  }
  return rows;
})();
const AFA_SWITCH = AFA_PLAN.find((r) => r.switchedNow)!;
const AFA_ROWS = AFA_PLAN.map((r) => [
  `${r.year}${r.switchedNow ? ' (Wechsel)' : ''}`,
  eur(AFA_LINEAR),
  eur(r.used),
  eur(r.book),
]);
const AFA_DEG_3Y = AFA_PLAN.slice(0, 3).reduce((s, r) => s + r.used, 0);
const AFA_CAR = 36000;
const AFA_CAR_MONTHS = 4; // Anschaffung im September: September bis Dezember
const AFA_CAR_LIN = (afaYear(AFA_CAR, 6, 'linear') * AFA_CAR_MONTHS) / 12;
const AFA_CAR_DEG = (afaYear(AFA_CAR, 6, 'degressive30') * AFA_CAR_MONTHS) / 12;
const AFA_CAR_DEG_Y2 = afaYear(AFA_CAR - AFA_CAR_DEG, 6, 'degressive30');

// ---------- Rabatt ----------
const disc = (price: number, rate: number) => calculateDiscount({ originalPrice: price, discountPercent: rate });
const RAB_RATES = [10, 15, 20, 25, 30, 40, 50];
const RAB_ROWS = RAB_RATES.map((rate) => {
  const a = disc(79.99, rate);
  const b = disc(249, rate);
  return [`${rate} %`, eur(prim(a)), eur(sec(a, 'saved')), eur(prim(b)), eur(sec(b, 'saved'))];
});
const RAB_STEP1 = prim(disc(120, 20));
const RAB_STEP2 = prim(disc(RAB_STEP1, 10));
const RAB_SINGLE30 = prim(disc(120, 30));
const RAB_COMBINED = (1 - RAB_STEP2 / 120) * 100;
const RAB_SALE = 59.99;
const RAB_ORIG = Math.round((RAB_SALE / (1 - 0.25)) * 100) / 100;
const RAB_ORIG_CHECK = prim(disc(RAB_ORIG, 25));
const RAB_FROM_OLD = 149;
const RAB_FROM_NEW = 119;
const RAB_FROM_RATE = ((RAB_FROM_OLD - RAB_FROM_NEW) / RAB_FROM_OLD) * 100;
const RAB_FROM_CHECK = prim(disc(RAB_FROM_OLD, RAB_FROM_RATE));
const RAB_VAT_GROSS = prim(calculateVat({ amount: 100, direction: 'netToGross', vatRate: '19' }));
const RAB_VAT_A = prim(disc(RAB_VAT_GROSS, 20));
const RAB_VAT_B = prim(calculateVat({ amount: prim(disc(100, 20)), direction: 'netToGross', vatRate: '19' }));

// ---------- Mehrwertsteuer ----------
const vatOut = (gross: number, rate: string) => calculateVat({ amount: gross, direction: 'grossToNet', vatRate: rate });
const MWST_GROSS = [10, 50, 100, 250, 1000];
const MWST_ROWS = MWST_GROSS.map((g) => {
  const r19 = vatOut(g, '19');
  const r7 = vatOut(g, '7');
  return [eur(g), eur(prim(r19)), eur(sec(r19, 'vatAmount')), eur(prim(r7)), eur(sec(r7, 'vatAmount'))];
});
const MWST_FOOD = vatOut(46, '7');
const MWST_DRINKS = vatOut(14, '19');
const MWST_RESTAURANT_TAX = sec(MWST_FOOD, 'vatAmount') + sec(MWST_DRINKS, 'vatAmount');
const MWST_ALL19 = sec(vatOut(60, '19'), 'vatAmount');
const MWST_RECEIPT = sec(vatOut(119, '19'), 'vatAmount');
const MWST_PERCENT = num(L.mwstNormalsatz.value * 100);
const MWST_REDUCED = num(L.mwstErmaessigt.value * 100);

// ---------- Churn-Rate ----------
const churnCalc = calc('churn-rate-rechner');
const churn = (start: number, lost: number) => churnCalc({ startCustomers: start, lostCustomers: lost, avgMrrPerCustomer: 49 });
const CHURN_ROWS = [1, 2, 3, 5, 8].map((m) => {
  const r = churn(1000, m * 10);
  const annual = sec(r, 'annualChurn');
  return [pct(m, 0), pct(annual, 1), `${num(sec(r, 'avgLifespan'), 1)} Monate`, num(1000 * (1 - annual / 100))];
});
const CHURN_BASE = churn(1000, 30);
const CHURN_NAIVE = prim(CHURN_BASE) * 12;
const CHURN_WRONG_DENOM = prim(churn(1200, 30));
const CHURN_FROM_ANNUAL = (1 - Math.pow(1 - 0.2, 1 / 12)) * 100;
const CHURN_FROM_ANNUAL_CHECK = sec(churn(1000, CHURN_FROM_ANNUAL * 10), 'annualChurn');

// ---------- Zinseszins ----------
const zz = (inputs: Record<string, any>) =>
  calculateCompoundInterest({ compoundFrequency: '12', depositTiming: 'end', dynamicIncrease: 0, ...inputs });
const ZZ_DATA = [10, 20, 30, 40].map((years) => {
  const r = zz({ initialAmount: 0, monthlyContribution: 100, annualRate: 5, years });
  return { years, r, interest: sec(r, 'totalInterest'), share: (sec(r, 'totalInterest') / prim(r)) * 100 };
});
const ZZ_ROWS = ZZ_DATA.map(({ years, r, interest, share }) => [`${years} Jahre`, eur0(sec(r, 'totalDeposits')), eur0(prim(r)), eur0(interest), pct(share, 0)]);
const ZZ_FIRST = ZZ_DATA[0];
const ZZ_CROSS = ZZ_DATA.find((d) => d.share > 50)!;
const ZZ_EARLY = zz({ initialAmount: 0, monthlyContribution: 150, annualRate: 5, years: 35 });
const ZZ_LATE = zz({ initialAmount: 0, monthlyContribution: 150, annualRate: 5, years: 25 });
const ZZ_LATE_DOUBLE = zz({ initialAmount: 0, monthlyContribution: 300, annualRate: 5, years: 25 });
const ZZ_LATE_DYN = zz({ initialAmount: 0, monthlyContribution: 150, annualRate: 5, years: 25, dynamicIncrease: 3 });
const ZZ_ONCE = [2, 3, 5].map((rate) => ({ rate, r: zz({ initialAmount: 10000, monthlyContribution: 0, annualRate: rate, years: 10, compoundFrequency: '1' }) }));
const ZZ_END = zz({ initialAmount: 10000, monthlyContribution: 150, annualRate: 5, years: 15 });
const ZZ_START = zz({ initialAmount: 10000, monthlyContribution: 150, annualRate: 5, years: 15, depositTiming: 'start' });

// ---------- Marge ----------
// Rabatt auf den Verkaufspreis: neue Marge und nötige Mehrmenge für denselben Rohertrag
const MARGE_EK = 60;
const MARGE_VK = 100;
const margeAt = (vk: number) => calculateMargin({ mode: 'fromPrices', purchasePrice: MARGE_EK, sellingPrice: vk });
const MARGE_BASE_PROFIT = sec(margeAt(MARGE_VK), 'grossProfit');
const MARGE_ROWS = [0, 5, 10, 15, 20].map((d) => {
  const r = margeAt(MARGE_VK * (1 - d / 100));
  const profit = sec(r, 'grossProfit');
  return [d === 0 ? 'ohne Rabatt' : pct(d, 0), eur(MARGE_VK * (1 - d / 100)), eur(profit), pct(prim(r), 2), `+${num((MARGE_BASE_PROFIT / profit - 1) * 100, 0)} %`];
});

// ---------- Rentabilität ----------
// Gleiches Unternehmen, Gewinn vor Zinsen 104.000 €, 400.000 € Eigen- und 600.000 € Fremdkapital, steigender Kreditzins
const rentCalc = calc('umsatzrentabilitaet-rechner');
const RENT_EBIT = 104000;
const RENT_FK = 600000;
const RENT_ROWS = [2, 4, 6, 8, 10.4, 12].map((rate) => {
  const interest = RENT_FK * (rate / 100);
  const r = rentCalc({ profit: RENT_EBIT - interest, revenue: 1000000, equity: 400000, debt: RENT_FK, interestExpense: interest });
  return [pct(rate, 1), eur0(RENT_EBIT - interest), pct(sec(r, 'roe'), 1), pct(sec(r, 'roa'), 1)];
});

export const FINANZEN_BUSINESS_PAGE_CONTENT: PageContentMap = {
  'thesaurierend-vs-ausschuettend-rechner': {
    sections: [
      {
        title: 'Wiederanlegen oder ausgeben: Wo der Unterschied wirklich entsteht',
        content:
          `Ob der Fonds selbst thesauriert oder Sie die Ausschüttungen sofort zurück ins Depot stecken, ist vor Steuern gleichwertig. Einen großen Unterschied macht dagegen, ob die Ausschüttungen ausgegeben werden. Sparplan mit 300 € im Monat, 5 % Kursplus und 2 % Ausschüttung pro Jahr (Beispielwerte):\n\n` +
          table(['Jahre', 'Ausschüttung bleibt im Depot', 'Ausschüttung wird ausgegeben', 'Unterschied im Depot'],
            THES_ROWS.map((r) => [r.y, eur0(r.reinvest), eur0(r.spent), eur0(r.diff)])) +
          `\n\nNach 30 Jahren liegen ${eur0(THES_30.diff)} weniger im Depot, wenn die Ausschüttungen jedes Jahr verbraucht werden. Die Spalte „ausgegeben“ entspricht dem Rechner mit 0 % Ausschüttungsrendite. Steuern sind in keiner Spalte enthalten.`,
      },
      {
        title: 'Vorabpauschale 2026 an einem Beispiel',
        content:
          `Für 2026 gilt ein Basiszins von ${pct(BASISZINS_2026)} (BMF-Schreiben vom 13. Januar 2026). Ein thesaurierender Aktien-ETF ist am 1. Januar 2026 ${eur0(VP_FUND)} wert:\n\n` +
          `- **Basisertrag:** ${eur0(VP_FUND)} × ${pct(BASISZINS_2026)} × 70 % = ${eur(VP_BASIS)}. Ist der Fonds im Jahr mindestens so viel gestiegen, ist das die Vorabpauschale.\n` +
          `- **Teilfreistellung:** 30 % bleiben bei Aktienfonds steuerfrei, steuerpflichtig sind ${eur(VP_TAXABLE)}.\n` +
          `- **Steuer:** Ist Ihr Sparer-Pauschbetrag schon ausgeschöpft, zieht die Bank Anfang Januar 2027 ${eur(VP_TAX)} Abgeltungsteuer und Soli ein. Sonst verbraucht die Vorabpauschale nur einen Teil des Freibetrags.\n` +
          '- **Kein Doppelbesteuern:** Beim späteren Verkauf werden die bereits angesetzten Vorabpauschalen vom Veräußerungsgewinn abgezogen.\n\n' +
          'Hat der Fonds im Jahr an Wert verloren, fällt keine Vorabpauschale an. Im Kaufjahr vermindert sie sich um ein Zwölftel für jeden vollen Monat vor dem Kauf.',
      },
    ],
    faqs: [
      {
        question: 'Wie viel Ausschüttung eines Aktien-ETFs bleibt durch den Sparer-Pauschbetrag steuerfrei?',
        answer: `Wegen der Teilfreistellung zählen nur 70 % der Ausschüttung eines Aktienfonds als Ertrag. Der Pauschbetrag von ${eur0(PAUSCH_SINGLE)} deckt deshalb bis zu ${eur(ETF_FREE_SINGLE)} Ausschüttungen, bei Zusammenveranlagung (${eur0(PAUSCH_MARRIED)}) bis zu ${eur(ETF_FREE_MARRIED)}, sofern Sie keine anderen Kapitalerträge haben.`,
      },
      {
        question: 'Was passiert, wenn für die Vorabpauschale kein Geld auf dem Verrechnungskonto ist?',
        answer: 'Die Bank zieht die Steuer Anfang Januar von einem Konto ein, das Sie bei ihr führen. Haben Sie dort einen Dispo, darf sie auch diesen nutzen, sofern Sie vorher nicht widersprochen haben (§ 44 Abs. 1 EStG). Reicht beides nicht, meldet sie den Fehlbetrag dem Finanzamt, und die Steuer wird über Ihre Steuererklärung nachgefordert. Ein kleines Guthaben zum Jahreswechsel erspart diesen Umweg.',
      },
    ],
  },

  'ewige-rente-rechner': {
    sections: [
      {
        title: 'Kapitalbedarf für eine ewige Rente nach Nettorendite',
        content:
          'So viel Vermögen braucht es, damit allein die Erträge die Monatsrente zahlen und das Kapital unangetastet bleibt:\n\n' +
          table(['Monatsrente', ...EWIG_RATES.map((r) => `${pct(r, 0)} netto`)], EWIG_ROWS) +
          '\n\nJeder Prozentpunkt weniger Rendite erhöht den Bedarf stark: Halbiert sich die Rendite, verdoppelt sich das nötige Kapital.',
      },
      {
        title: 'Welche Rendite Sie eintragen sollten',
        content:
          `Der Rechner erwartet die Rendite **nach Steuern**. Oberhalb des Sparer-Pauschbetrags werden aus ${pct(EWIG_GROSS_INTEREST, 0)} Zinsen netto ${pct(EWIG_NET_INTEREST)}, aus ${pct(EWIG_GROSS_INTEREST, 0)} Ausschüttung eines Aktien-ETFs dank Teilfreistellung ${pct(EWIG_NET_ETF)} (ohne Kirchensteuer).\n\n` +
          `Soll die Rente ihre Kaufkraft behalten, muss ein Teil des Ertrags im Depot bleiben. Ziehen Sie dafür die erwartete Inflation von der Nettorendite ab. Beispiel für ${eur0(2500)} im Monat: Mit ${pct(3.5, 1)} Nettorendite reichen ${eur0(EWIG_NOMINAL)}. Rechnen Sie mit 2 % Inflation, also ${pct(1.5, 1)} real, sind es ${eur0(EWIG_REAL)}.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel Geld braucht man, um von 1.000 € Zinsen im Monat zu leben?',
        answer: `Bei ${pct(3, 0)} Nettorendite sind es ${eur0(ewig(1000, 3))}, bei ${pct(4, 0)} noch ${eur0(ewig(1000, 4))}. Das Kapital bleibt dabei erhalten. Wer es über die Jahre aufbrauchen darf, kommt mit deutlich weniger aus; das rechnet ein Entnahmeplan, nicht die ewige Rente.`,
      },
      {
        question: 'Ist die ewige Rente dasselbe wie die 4-%-Regel?',
        answer: 'Nein. Die ewige Rente entnimmt nur den Ertrag, das Kapital bleibt nominal stehen. Bei der 4-%-Regel wird die Entnahme jedes Jahr an die Inflation angepasst, und das Depot darf in schwachen Jahren schrumpfen; Ziel ist nur, dass es rund 30 Jahre reicht.',
      },
    ],
  },

  'dividendenrendite-rechner': {
    sections: [
      {
        title: 'Persönliche Dividendenrendite: Kaufkurs statt Börsenkurs eintragen',
        content:
          'Tragen Sie in das Feld Aktienkurs Ihren eigenen Einstandskurs ein, zeigt der Rechner die Rendite auf Ihr eingesetztes Geld (Yield on Cost). Dieselbe Dividende von 4,80 € je Aktie bei verschiedenen Kursen:\n\n' +
          table(['Kurs bzw. Kaufkurs', 'Dividendenrendite'], DIV_ROWS) +
          '\n\nSo lesen Sie die Tabelle: Wer zu 80 € gekauft hat und heute bei 120 € steht, erhält auf sein Geld 6 %, ein Neukäufer nur 4 %. Für die Entscheidung, ob Sie heute noch kaufen oder halten, zählt der aktuelle Kurs.',
      },
      {
        title: 'Was von der Dividende netto ankommt',
        content:
          `Im Standardbeispiel fließen ${eur(DIV_ANNUAL)} brutto im Jahr. Ist Ihr Sparer-Pauschbetrag (${eur0(PAUSCH_SINGLE)} bzw. ${eur0(PAUSCH_MARRIED)}) schon von anderen Erträgen belegt, behält die Bank ${eur(DIV_TAX)} Abgeltungsteuer und Soli ein, ausgezahlt werden ${eur(DIV_ANNUAL - DIV_TAX)}. Bei Kirchenmitgliedschaft wird es etwas weniger.\n\n` +
          '- **Ausländische Aktien:** Zusätzlich kann Quellensteuer im Herkunftsland anfallen. Sie wird nur teilweise angerechnet; den Rest müssen Sie gegebenenfalls im Ausland zurückfordern.\n' +
          '- **Ex-Tag:** Die Dividende erhält, wer die Aktie spätestens am Handelstag vor dem Ex-Tag gekauft hat. Am Ex-Tag fällt der Kurs in der Regel ungefähr um die Dividende; ein Kauf kurz vorher bringt also keinen Gratisgewinn.',
      },
    ],
    faqs: [
      {
        question: 'Wie viel Kapital braucht man für 500 € Dividende im Monat?',
        answer: `Bei einer Dividendenrendite von 4 % sind es ${eur0(DIV_500_CAPITAL)}: 1.500 Aktien zu 100 € mit je 4 € Dividende bringen ${eur(sec(DIV_500, 'annual'))} im Jahr, im Schnitt ${eur(sec(DIV_500, 'monthly'))} im Monat. Das ist brutto, vor Abgeltungsteuer, und Dividenden können gekürzt werden.`,
      },
      {
        question: 'Wird die Dividendenrendite mit der Dividende des letzten oder des nächsten Jahres berechnet?',
        answer: 'Finanzportale nutzen meist die zuletzt gezahlte Dividende, manche eine Schätzung für das laufende Jahr. Beides kann deutlich abweichen, etwa nach einer Kürzung. Tragen Sie in den Rechner die Dividende ein, mit der Sie selbst rechnen wollen, und rechnen Sie Quartals- oder Halbjahreszahlungen auf das ganze Jahr hoch.',
      },
    ],
  },

  'verdopplungszeit-rechner': {
    sections: [
      {
        title: 'Exakte Verdopplungszeit, 72er- und 70er-Regel im Vergleich',
        content:
          table(['Zins p. a.', 'Exakt (Jahre)', '72 ÷ Zins', '70 ÷ Zins', 'Anzeige im Rechner'], DBL_ROWS) +
          '\n\nUnter 4 % liegt die 70er-Regel näher am exakten Wert, zwischen 6 und 10 % die 72er-Regel. Für Zinssätze ab etwa 12 % unterschätzen beide Faustregeln die Dauer leicht.',
      },
      {
        title: 'Verdopplung rückwärts: Wann sich die Kaufkraft halbiert',
        content:
          `Die gleiche Formel gilt für steigende Preise. Bei 2 % Inflation verdoppeln sich die Preise in ${num(DBL_INFL, 1)} Jahren, ein Euro kauft dann nur noch halb so viel.\n\n` +
          `Wer real rechnen will, setzt den Realzins ein: (1 + Zins) ÷ (1 + Inflation) − 1. Aus 4 % Zins und 2 % Inflation werden ${pct(DBL_REAL_RATE)}. Nominal verdoppelt sich das Geld nach ${num(DBL_NOMINAL_4, 1)} Jahren, an Kaufkraft erst nach ${num(DBL_REAL, 1)} Jahren.`,
      },
    ],
    faqs: [
      {
        question: 'Wann verdoppeln sich 10.000 € bei 3 % Zinsen?',
        answer: `Nach ${num(prim(DBL_3), 2)} Jahren, also nach ${Math.floor(Math.round(prim(DBL_3) * 12) / 12)} Jahren und ${Math.round(prim(DBL_3) * 12) % 12} Monaten. Dann sind aus 10.000 € genau ${eur0(sec(DBL_3, 'doubled'))} geworden, wenn die Zinsen jedes Jahr mitverzinst werden und nichts entnommen wird. Steuern auf die Zinsen verlängern die Dauer, sobald der Sparer-Pauschbetrag überschritten ist.`,
      },
      {
        question: 'Gilt die Verdopplungszeit auch für einen Sparplan?',
        answer: 'Nein. Die Formel beschreibt eine Einmalanlage. Bei einem Sparplan ist jede Rate unterschiedlich lange angelegt, das Gesamtvermögen wächst vor allem durch die Einzahlungen. Dafür eignet sich ein Sparplan- oder Zinseszinsrechner mit monatlicher Rate.',
      },
    ],
  },

  'gold-rendite-rechner': {
    sections: [
      {
        title: 'Steuer beim Goldverkauf: Haltefrist und 1.000-€-Freigrenze',
        content:
          'Physisches Gold ist für Privatanleger kein Kapitalvermögen, sondern ein „anderes Wirtschaftsgut“ nach § 23 EStG. Das hat drei Folgen:\n\n' +
          '- **Mehr als ein Jahr gehalten:** Der Gewinn ist steuerfrei, egal wie hoch.\n' +
          `- **Innerhalb eines Jahres verkauft:** Der Gewinn wird mit Ihrem persönlichen Steuersatz versteuert. Liegt der Gesamtgewinn aus solchen Verkäufen im Kalenderjahr unter 1.000 €, bleibt er steuerfrei. Das ist eine Freigrenze: Im Beispiel des Rechners bleiben ${eur(prim(GOLD_1))} Gewinn mit einer Unze frei, mit zwei Unzen wären die vollen ${eur(prim(GOLD_2))} steuerpflichtig.\n` +
          '- **Verlust innerhalb eines Jahres:** Er lässt sich nur mit Gewinnen aus privaten Veräußerungsgeschäften verrechnen, nicht mit Zinsen, Dividenden oder Lohn.',
      },
      {
        title: 'Gesamtrendite richtig einordnen',
        content:
          `Der Rechner zeigt die Gesamtrendite ohne Zeitbezug. Die ${pct(GOLD_TOTAL_RET)} aus dem Beispiel entsprechen über 3 Jahre ${pct(GOLD_PA_3Y)} pro Jahr, über 8 Jahre nur ${pct(GOLD_PA_8Y)} pro Jahr.\n\n` +
          `Tragen Sie als aktuellen Preis den Ankaufspreis Ihres Händlers ein, nicht den Börsenkurs, denn zu diesem Preis verkaufen Sie wirklich. Liegt er im Beispiel 3 % unter dem Bewertungspreis (${eur(GOLD_SPREAD_SELL)} statt 75 € je Gramm), sinkt der Gewinn von ${eur(prim(GOLD_1))} auf ${eur(prim(GOLD_SPREAD))}. Alle Preise hier sind Beispielwerte, keine aktuellen Kurse.`,
      },
    ],
    faqs: [
      {
        question: 'Zahlt man beim Goldkauf Mehrwertsteuer?',
        answer: 'Nicht auf Anlagegold (§ 25c UStG). Dazu zählen Barren und Plättchen mit mindestens 995 Tausendstel Feingehalt sowie Münzen mit mindestens 900 Tausendstel, die nach 1800 geprägt wurden, im Ursprungsland gesetzliches Zahlungsmittel sind oder waren und üblicherweise höchstens 80 % über dem Goldwert verkauft werden. Schmuck und Sammlermünzen fallen nicht darunter.',
      },
      {
        question: 'Muss ich steuerfreie Goldgewinne in der Steuererklärung angeben?',
        answer: 'Gewinne nach mehr als einem Jahr Haltedauer sind nicht steuerbar und gehören nicht in die Steuererklärung. Bewahren Sie Kaufbelege trotzdem auf, damit Sie Kaufdatum und Kaufpreis nachweisen können, falls das Finanzamt nachfragt oder Sie innerhalb der Frist verkaufen.',
      },
    ],
  },

  'rentenluecke-rechner': {
    sections: [
      {
        title: 'Von Rentenpunkten zur Rentenlücke',
        content:
          `Die gesetzliche Bruttorente ergibt sich vereinfacht aus Entgeltpunkten × aktuellem Rentenwert. Der Rentenwert beträgt seit 1. Juli 2026 ${eur(RENTENWERT_2026)} (vorher ${eur(RENTENWERT_VORHER)}). Ein Entgeltpunkt entspricht einem Jahr mit Durchschnittsverdienst. Rentenlücke bei 2.400 € Wunsch-Netto, Regelaltersrente ohne Abschläge:\n\n` +
          table(['Entgeltpunkte', 'Bruttorente', 'Netto (Schätzung des Rechners)', 'Rentenlücke pro Monat'], GAP_ROWS) +
          `\n\nFür die 1.600 € aus dem Standardbeispiel sind heute rund ${num(GAP_EP_FOR_1600, 1)} Entgeltpunkte nötig. Ihre eigenen Punkte stehen in der Renteninformation der Deutschen Rentenversicherung.`,
      },
      {
        title: 'Was in den 82 % des Rechners steckt',
        content:
          `Der Rechner setzt die Nettorente pauschal mit 82 % der Bruttorente an. Davon entfallen 2026 bereits ${pct(GAP_KVPV_KIND * 100)} auf Kranken- und Pflegeversicherung (mit Kindern; kinderlos ${pct(GAP_KVPV_OHNE * 100)}), bei 1.600 € Rente also ${eur(GAP_KVPV_1600)}. Der Rest der Pauschale steht für die Einkommensteuer.\n\n` +
          'Ob tatsächlich Steuer anfällt, hängt vom Rentenbeginn (2026: 84 % der Rente steuerpflichtig) und von weiteren Einkünften ab: Miete, Betriebsrente oder Einkünfte des Ehepartners. Wer nur eine kleine gesetzliche Rente bezieht, zahlt oft keine Steuer und hat damit eine kleinere Lücke, als der Rechner zeigt. Wer zusätzliche Einkünfte hat, sollte eher mit weniger als 82 % rechnen.',
      },
    ],
    faqs: [
      {
        question: 'Wie viel Kapital braucht man, um eine Rentenlücke zu schließen?',
        answer: `Für die ${eur(GAP_DEFAULT_VALUE)} Lücke aus dem Standardbeispiel sind ohne Kapitalverzehr ${eur0(GAP_CAPITAL_3)} bei 3 % Nettorendite nötig, bei 4 % ${eur0(GAP_CAPITAL_4)}. Wird das Kapital bis zum Lebensende aufgebraucht, reicht deutlich weniger. Den genauen Betrag liefert der Ewige-Rente-Rechner mit Ihren Werten.`,
      },
      {
        question: 'Steigt die gesetzliche Rente bis zum Rentenbeginn noch?',
        answer: `Ja, der Rentenwert wird jedes Jahr zum 1. Juli angepasst, zuletzt um 4,24 % auf ${eur(RENTENWERT_2026)}. Gleichzeitig steigen aber auch Ihre Lebenshaltungskosten. Wenn Sie Wunschrente und Rente in heutigen Euro eintragen, bleiben beide Seiten vergleichbar.`,
      },
    ],
  },

  'finanzielle-freiheit-rechner': {
    sections: [
      {
        title: 'FIRE-Zahl nach Ausgaben und Entnahmerate',
        content:
          table(['Ausgaben pro Monat', ...FIRE_SWR.map((s) => `${pct(s, 1)} Entnahme`)], FIRE_ROWS) +
          `\n\nIm Standardbeispiel (2.200 € Ausgaben, 3,5 %) liegt das Ziel bei ${eur0(prim(FIRE_DEFAULT))}; mit 60.000 € Startvermögen sind ${pct(sec(FIRE_DEFAULT, 'progress'), 1)} geschafft. Jeder Euro, den Sie dauerhaft pro Monat weniger ausgeben, senkt die FIRE-Zahl bei 3,5 % Entnahme um ${eur(FIRE_PER_EURO)}.`,
      },
      {
        title: 'Was die Formel für Deutschland nicht abdeckt',
        content:
          '- **Steuern:** Entnahmen aus dem Depot enthalten Kursgewinne, auf die Abgeltungsteuer anfällt. Planen Sie die Ausgaben inklusive dieser Steuer ein.\n' +
          '- **Krankenversicherung:** Ohne Arbeitgeber zahlen Sie die Beiträge selbst. Freiwillig gesetzlich Versicherte zahlen Beiträge nach ihrer gesamten wirtschaftlichen Leistungsfähigkeit, also auch auf Kapitalerträge.\n' +
          `- **Gesetzliche Rente:** Ab dem Rentenalter sinkt der Bedarf aus dem Depot. Würde eine spätere Rente zum Beispiel 1.200 € der 2.200 € Ausgaben decken, brauchen Sie für die Zeit danach nur Kapital für 1.000 € im Monat, bei 3,5 % rund ${eur0(FIRE_BRIDGE)}. Bis zum Rentenbeginn muss das Depot die volle Summe tragen.`,
      },
    ],
    faqs: [
      {
        question: 'Wie hoch ist die FIRE-Zahl bei 2.000 € Ausgaben im Monat?',
        answer: `Mit der klassischen 4-%-Regel ${eur0(FIRE_2000_4)} (25-fache Jahresausgaben), mit vorsichtigeren 3,5 % ${eur0(FIRE_2000_35)}. Die Zahl gilt für Ausgaben in heutigen Euro, die Entnahme wird jedes Jahr an die Inflation angepasst.`,
      },
      {
        question: 'Warum rechnen viele Frührentner mit weniger als 4 % Entnahme?',
        answer: 'Die 4-%-Regel stammt aus US-Daten und wurde für 30 Jahre Ruhestand getestet. Wer mit 45 aufhört, braucht das Geld oft 40 bis 50 Jahre; dazu kommen deutsche Steuern und Depotkosten. Eine niedrigere Rate erhöht das Zielvermögen, verringert aber das Risiko, dass das Geld vorzeitig ausgeht.',
      },
    ],
  },

  'depotgebuehren-rechner': {
    sections: [
      {
        title: 'TER-Vergleich: 40.000 € über 20 Jahre',
        content:
          'Einmalanlage von 40.000 €, 7 % Bruttorendite pro Jahr (Beispielwert), keine Depotgebühr:\n\n' +
          table(['TER p. a.', 'Endvermögen mit Kosten', 'Kostenverlust', 'Anteil am Endwert ohne Kosten'], DEPOT_ROWS) +
          '\n\nVergleichen Sie zwei Fonds, lesen Sie die TER im Basisinformationsblatt nach und tragen Sie beide nacheinander ein. Ein teurerer Fonds muss den Kostenabstand jedes Jahr durch bessere Anlageentscheidungen aufholen, nur um gleichzuziehen.',
      },
      {
        title: 'Feste Depotgebühr: Bei kleinen Depots besonders teuer',
        content:
          `Eine feste Gebühr kostet in Euro immer gleich viel, egal wie groß das Depot ist. Beispiel 50 € Depotführung pro Jahr über 20 Jahre bei 7 % Rendite: Sowohl bei 40.000 € als auch bei 5.000 € Anlage fehlen am Ende ${eur0(prim(DEPOT_FIX_SMALL))}. Beim großen Depot sind das ${pct(DEPOT_FIX_BIG_SHARE, 1)} des möglichen Endwerts, beim kleinen ${pct(DEPOT_FIX_SMALL_SHARE, 1)}.\n\n` +
          'Prüfen Sie im Preis- und Leistungsverzeichnis Ihrer Bank auch Kosten, die der Rechner nicht erfasst: Ordergebühren je Sparplanausführung, Fremdspesen von Börsenplätzen und Ausgabeaufschläge.',
      },
    ],
    faqs: [
      {
        question: 'Was kostet 1 % TER bei 100.000 € über 30 Jahre?',
        answer: `Bei 7 % Bruttorendite gehen ${eur0(DEPOT_100K_1PCT)} an Endvermögen verloren. Mit 0,2 % TER wären es ${eur0(DEPOT_100K_02PCT)}. Der Unterschied entsteht größtenteils durch den entgangenen Zinseszins, nicht durch die direkt gezahlten Gebühren.`,
      },
      {
        question: 'Ist die TER in der veröffentlichten Fondsrendite schon abgezogen?',
        answer: 'Ja. Die laufenden Kosten werden laufend dem Fondsvermögen entnommen, die ausgewiesene Wertentwicklung ist bereits nach TER. Tragen Sie im Rechner deshalb als Bruttorendite die Rendite des zugrunde liegenden Index oder Marktes ein, nicht die Fondsrendite, sonst ziehen Sie die Kosten doppelt ab.',
      },
    ],
  },

  'freistellungsauftrag-rechner': {
    sections: [
      {
        title: 'Ersparnis und Steuer nach Höhe der Kapitalerträge',
        content:
          'Berechnet mit dem Rechner, ohne Kirchensteuer:\n\n' +
          table(['Kapitalerträge pro Jahr', 'Ersparnis Single', 'Steuer Single', 'Ersparnis Paar', 'Steuer Paar'], FSA_ROWS) +
          `\n\nMehr als ${eur(PAUSCH_SINGLE * CAPITAL_TAX)} (Single) bzw. ${eur(PAUSCH_MARRIED * CAPITAL_TAX)} (Paar) lassen sich über den Freistellungsauftrag nicht sparen; darüber hinaus wird jeder Euro Ertrag mit ${pct(CAPITAL_TAX * 100, 3)} besteuert.`,
      },
      {
        title: 'So verteilen Sie den Freibetrag auf mehrere Banken',
        content:
          '1. **Erträge je Bank schätzen:** Zinsen, Dividenden, Fondsausschüttungen und Vorabpauschalen des kommenden Jahres.\n' +
          '2. **Teilfreistellung berücksichtigen:** Bei Aktienfonds zählen nur 70 % der Ausschüttung, bei Mischfonds je nach Aktienquote mehr.\n' +
          '3. **Freibetrag zuteilen:** Die Summe aller Aufträge darf den Pauschbetrag nicht übersteigen. Die Bank braucht dafür Ihre Steuer-Identifikationsnummer.\n' +
          '4. **Unterjährig anpassen:** Freistellungsaufträge lassen sich jederzeit ändern. Herabsetzen können Sie einen Auftrag aber höchstens bis auf den Betrag, den die Bank im laufenden Jahr schon verbraucht hat.\n\n' +
          `Liegt Ihr gesamtes Einkommen unter dem Grundfreibetrag (2026: ${eur0(L.grundfreibetrag.value)}), können Sie beim Finanzamt eine Nichtveranlagungs-Bescheinigung beantragen. Dann zieht die Bank auch über den Pauschbetrag hinaus keine Steuer ab.`,
      },
    ],
    faqs: [
      {
        question: 'Brauchen Kinder einen eigenen Freistellungsauftrag?',
        answer: `Ja. Jedes Kind hat einen eigenen Sparer-Pauschbetrag von ${eur0(PAUSCH_SINGLE)}. Die Eltern erteilen den Freistellungsauftrag für das Kinderkonto oder -depot, die Steuer-ID des Kindes ist dafür nötig. Ohne Auftrag behält die Bank auch beim Kind Abgeltungsteuer ein.`,
      },
      {
        question: 'Gilt der Freistellungsauftrag auch für Gewinne aus Gold oder Kryptowährungen?',
        answer: 'Nein. Gewinne aus physischem Gold und aus Kryptowährungen sind keine Kapitalerträge, sondern private Veräußerungsgeschäfte. Sie sind nach mehr als einem Jahr Haltedauer steuerfrei, innerhalb eines Jahres gilt die Freigrenze von 1.000 € nach § 23 EStG. Der Freistellungsauftrag bei der Bank spielt dafür keine Rolle.',
      },
    ],
  },

  'lagerumschlagshaeufigkeit-rechner': {
    sections: [
      {
        title: 'Was ein kleineres Lager bewirkt',
        content:
          'Gleicher Jahres-Wareneinsatz von 600.000 €, unterschiedlich hoher Durchschnittsbestand:\n\n' +
          table(['Ø Lagerbestand', 'Umschläge pro Jahr', 'Ø Lagerdauer'], LAGER_ROWS) +
          `\n\nSinkt der Bestand von 100.000 € auf 75.000 €, werden ${eur0(LAGER_FREED)} Kapital frei. Rechnen Sie mit einem Beispielsatz von 8 % für Zinsen, Lagerfläche, Versicherung und Schwund, spart das rund ${eur0(LAGER_FREED_COST)} im Jahr, vorausgesetzt, die Lieferfähigkeit leidet nicht.`,
      },
      {
        title: 'Typische Fehler beim Berechnen',
        content:
          `- **Umsatz statt Wareneinsatz:** Wer Verkaufspreise ins erste Feld einträgt, aber den Bestand zu Einstandspreisen bewertet, bläht die Kennzahl auf. Mit 900.000 € Umsatz statt 600.000 € Wareneinsatz zeigt der Rechner ${num(LAGER_WRONG, 2)} statt ${num(LAGER_RIGHT, 2)} Umschläge.\n` +
          '- **Nur den Inventurstichtag nehmen:** Der Bestand zum Jahresende ist oft niedriger als unterm Jahr. Besser ist (Anfangsbestand + 12 Monatsendbestände) ÷ 13, mindestens aber (Anfangsbestand + Endbestand) ÷ 2.\n' +
          '- **Alles in einen Topf:** Ein Durchschnitt über das ganze Sortiment versteckt Ladenhüter. Rechnen Sie für Warengruppen getrennt.',
      },
    ],
    faqs: [
      {
        question: 'Welcher Lagerumschlag ist gut?',
        answer: 'Das hängt von der Branche ab: Frische Lebensmittel drehen sich viel öfter als Ersatzteile oder Möbel. Aussagekräftig ist der Vergleich mit Ihren Vorjahren und mit Betrieben derselben Branche, nicht ein allgemeiner Zielwert.',
      },
      {
        question: 'Warum rechnet der Rechner mit 360 statt 365 Tagen?',
        answer: `Das kaufmännische Jahr hat 360 Tage, so rechnen auch viele Lehrbücher. Mit 365 Tagen ergäbe sich bei ${num(LAGER_RIGHT, 0)} Umschlägen eine Lagerdauer von ${num(LAGER_365, 1)} statt 60 Tagen. Wichtig ist, für Vergleiche immer dieselbe Basis zu verwenden.`,
      },
    ],
  },

  'deckungsbeitrag-rechner': {
    sections: [
      {
        title: 'Wie stark der Preis auf Gewinn und Gewinnschwelle wirkt',
        content:
          'Variable Kosten 20 € je Stück, 1.000 Stück Absatz, 20.000 € Fixkosten:\n\n' +
          table(['Preis', 'Stück-DB', 'DB-Quote', 'Betriebsergebnis', 'Break-even'], DB_PRICE_ROWS) +
          '\n\nEin um 10 % niedrigerer Preis (45 statt 50 €) halbiert hier den Gewinn, weil der gesamte Preisnachlass vom Deckungsbeitrag abgeht. Rabatte müssen deshalb über deutlich mehr Absatz zurückverdient werden.',
      },
      {
        title: 'Zusatzauftrag annehmen? Die Rechnung mit dem Deckungsbeitrag',
        content:
          `Ein Kunde bietet für 200 zusätzliche Stück nur 35 €. Die Fixkosten sind durch das Stammgeschäft schon gedeckt, die Kapazität ist frei. Tragen Sie Preis 35 €, variable Kosten 20 €, Menge 200 und Fixkosten 0 € ein: Der Auftrag bringt ${eur(sec(DB_ZUSATZ, 'operatingResult'))} zusätzlichen Gewinn.\n\n` +
          `Bei 18 € Preis wäre der Deckungsbeitrag negativ, jeder Auftrag würde ${eur(-sec(DB_ZUSATZ_LOW, 'operatingResult'))} kosten. Prüfen Sie vor der Zusage zudem, ob der niedrige Preis Stammkunden bekannt wird und dort Rabattforderungen auslöst.`,
      },
    ],
    faqs: [
      {
        question: 'Wie berechnet man den Break-even-Umsatz mit der DB-Quote?',
        answer: `Fixkosten ÷ DB-Quote. Im Standardbeispiel: 20.000 € ÷ ${pct(DB_RATIO, 0)} = ${eur(DB_BEP_REVENUE)} Umsatz. Das entspricht den ${num(sec(DB_BASE, 'bepUnits'))} Stück, die der Rechner als Gewinnschwelle ausgibt (aufgerundet auf ganze Stück).`,
      },
      {
        question: 'Was ist der Unterschied zwischen Deckungsbeitrag und Rohertrag?',
        answer: 'Der Rohertrag zieht vom Umsatz nur den Wareneinsatz ab. Der Deckungsbeitrag zieht alle variablen Kosten ab, also auch Verpackung, Versand, Provisionen oder Zahlungsgebühren, die mit jedem Stück anfallen. Deshalb ist er meist niedriger und zeigt besser, was ein Verkauf wirklich zur Fixkostendeckung beiträgt.',
      },
    ],
  },

  'liquiditaetsgrad-rechner': {
    sections: [
      {
        title: 'Wie einzelne Buchungen die Liquiditätsgrade verändern',
        content:
          table(['Situation', '1. Grad', '2. Grad', '3. Grad'], LIQ_ROWS) +
          `\n\nAuffällig: Wer kurz vor dem Bilanzstichtag Lieferanten aus dem Bankguthaben bezahlt, verschlechtert den 1. Grad, verbessert aber den 2. Grad auf ${pct(prim(LIQ_PAID), 1)} und den 3. Grad auf ${pct(sec(LIQ_PAID, 'l3'), 1)}. Banken kennen diesen Effekt und schauen deshalb auf mehrere Stichtage.`,
      },
      {
        title: 'Faustregeln und ihre Grenzen',
        content:
          '| Kennzahl | Übliche Faustregel |\n| --- | --- |\n| 1. Grad (Cash Ratio) | 20 bis 30 % |\n| 2. Grad (Quick Ratio) | mindestens 100 % |\n| 3. Grad (Current Ratio) | 150 bis 200 % |\n\n' +
          'Die Werte stammen aus der Lehrbuchpraxis und sind keine gesetzlichen Grenzen. Die Kennzahlen zeigen einen Stichtag und sagen nichts darüber, wann Forderungen eingehen oder Verbindlichkeiten fällig werden. Eine freie Kreditlinie fehlt ganz. Ob ein Unternehmen zahlungsunfähig ist (§ 17 InsO), wird nicht mit diesen Quoten geprüft, sondern mit einem Finanzstatus und einem Finanzplan für die nächsten Wochen.',
      },
    ],
    faqs: [
      {
        question: 'Kann eine sehr hohe Liquidität schlecht sein?',
        answer: 'Ja. Liegt der 1. Grad dauerhaft weit über der Faustregel, liegt viel Geld fast unverzinst auf dem Konto. Ein sehr hoher 3. Grad kann auf ein aufgeblähtes Lager oder schleppend zahlende Kunden hindeuten. Prüfen Sie dann Lagerumschlag und Forderungslaufzeit.',
      },
      {
        question: 'Zählt eine ungenutzte Kreditlinie zu den flüssigen Mitteln?',
        answer: 'Nein, in die Liquiditätsgrade gehen nur Kasse und Bankguthaben aus der Bilanz ein. Für die eigene Planung ist die freie Linie trotzdem wichtig: Notieren Sie sie neben den Kennzahlen, damit Sie die tatsächliche Zahlungsreserve sehen.',
      },
    ],
  },

  'stundensatz-kalkulation-freiberufler-rechner': {
    sections: [
      {
        title: 'Die Rechenkette des Rechners Schritt für Schritt',
        content:
          `Mit den Standardwerten (45.000 € Wunsch-Netto, 12.000 € Betriebsausgaben, 45 freie Tage, 60 % Auslastung):\n\n` +
          `1. **Bruttobedarf:** 45.000 € × 1,65 = ${eur0(HOUR_GROSS_NEED)}. Der Faktor ist eine Pauschale für Einkommensteuer, Kranken- und Pflegeversicherung und Altersvorsorge.\n` +
          `2. **Umsatzbedarf:** + 12.000 € Betriebsausgaben = ${eur0(sec(HOUR_DEFAULT, 'totalRev'))}.\n` +
          '3. **Arbeitstage:** 260 Werktage − 45 freie Tage = 215 Tage à 8 Stunden.\n' +
          `4. **Abrechenbare Stunden:** 215 × 8 × 60 % = ${num(sec(HOUR_DEFAULT, 'billableHoursDisplay'))} Stunden.\n` +
          `5. **Stundensatz:** ${eur0(sec(HOUR_DEFAULT, 'totalRev'))} ÷ ${num(sec(HOUR_DEFAULT, 'billableHoursDisplay'))} h = ${eur(HOUR_RATE)} netto.\n\n` +
          table(['Auslastung', 'Abrechenbare Stunden', 'Stundensatz', 'Tagessatz (8 h)'], HOUR_ROWS),
      },
      {
        title: 'Wann Sie den Faktor 1,65 anpassen sollten',
        content:
          `Als freiwillig gesetzlich versicherte Selbstständige zahlen Sie den Krankenkassenbeitrag allein: ${pct(KV_SELBST * 100, 1)} (allgemeiner Satz mit Krankengeldanspruch plus Ø-Zusatzbeitrag 2026) und ${pct(PV_MIT_KIND * 100, 1)} Pflegeversicherung, kinderlos ${pct((PV_MIT_KIND + L.pflegeZuschlagKinderlos.value) * 100, 1)}. Dazu kommen Altersvorsorge und Einkommensteuer.\n\n` +
          '- **Höheres Wunsch-Netto:** Die Steuerprogression steigt, der Faktor sollte eher höher liegen.\n' +
          '- **Rentenversicherungspflichtig** (z. B. Lehrkräfte, Hebammen, Künstler über die KSK mit eigenen Regeln): Die Pflichtbeiträge sind vorgegeben, rechnen Sie sie gezielt ein.\n' +
          '- **Gewinn- und Risikoaufschlag:** Der Rechner kalkuliert ohne Puffer für Auftragsflauten oder Forderungsausfälle. Ein Aufschlag auf das Ergebnis ist sinnvoll.',
      },
    ],
    faqs: [
      {
        question: 'Muss ich auf den Stundensatz noch Umsatzsteuer aufschlagen?',
        answer: `Ja, der Rechner zeigt Nettosätze. Bei ${pct(MWST * 100, 0)} Umsatzsteuer stellen Sie aus ${eur(HOUR_RATE)} brutto ${eur(HOUR_RATE * (1 + MWST))} in Rechnung und führen die Differenz ans Finanzamt ab. Als Kleinunternehmer nach § 19 UStG (Vorjahresumsatz höchstens 25.000 €, laufendes Jahr höchstens 100.000 €) weisen Sie keine Umsatzsteuer aus.`,
      },
      {
        question: 'Wie viele Stunden kann ich als Freiberufler im Jahr abrechnen?',
        answer: `Bei 215 Arbeitstagen à 8 Stunden und 60 % Auslastung sind es ${num(sec(HOUR_DEFAULT, 'billableHoursDisplay'))} Stunden, bei 75 % ${num(sec(HOUR_75, 'billableHoursDisplay'))} Stunden. Wer langfristig bei einem Kunden arbeitet, erreicht eher hohe Werte; wer viele kleine Projekte akquiriert, eher niedrige.`,
      },
    ],
  },

  'skonto-jahreszins-rechner': {
    sections: [
      {
        title: 'Effektiver Jahreszins gängiger Skontobedingungen',
        content:
          table(['Skonto', ...SK_TERMS.map(([d, n]) => `${d} Tage / ${n} Tage netto`)], SK_ROWS) +
          `\n\nDie häufigste Kondition „2 % Skonto bei Zahlung in 10 Tagen, 30 Tage netto“ entspricht ${pct(SK_TYPICAL_RATE, 2)} Jahreszins. Je kürzer der Abstand zwischen Skontofrist und Zahlungsziel, desto teurer ist es, das Skonto verfallen zu lassen.`,
      },
      {
        title: 'Rechenweg: Skonto mit dem Kontokorrent bezahlen',
        content:
          `Rechnung über 5.000 €, 2 % Skonto in 10 Tagen, 30 Tage netto, Kontokorrent zu 9,5 %:\n\n` +
          `1. **Skonto:** 5.000 € × 2 % = ${eur(SK_SAVING)}, zu zahlen sind ${eur(5000 - SK_SAVING)}.\n` +
          `2. **Zinsen für 20 Tage:** ${eur(5000 - SK_SAVING)} × 9,5 % × 20 ÷ 360 = ${eur(SK_INTEREST)}.\n` +
          `3. **Vorteil:** ${eur(SK_SAVING)} − ${eur(SK_INTEREST)} = ${eur(SK_NET)}.\n\n` +
          `Kippen kann die Rechnung bei sehr niedrigem Skonto und langem Zahlungsziel: Bei 1 % Skonto, 10 Tagen und 90 Tagen netto liegt der Skonto-Jahreszins nur bei ${pct(prim(SK_LONG), 2)}, und die Kontokorrentzinsen übersteigen die Ersparnis um ${eur(-sec(SK_LONG, 'netBenefit'))}. Dann ist es günstiger, das Zahlungsziel auszunutzen.`,
      },
    ],
    faqs: [
      {
        question: 'Muss ich nach einem Skontoabzug die Vorsteuer korrigieren?',
        answer: `Ja. Skonto mindert nachträglich das Entgelt, deshalb sinkt auch die abziehbare Vorsteuer (§ 17 UStG). Bei einer Bruttorechnung über ${eur(SK_VAT_GROSS)} mit ${pct(MWST * 100, 0)} Umsatzsteuer und 2 % Skonto verringert sich die Vorsteuer um ${eur(SK_VAT_CORRECTION)}. Buchhaltungsprogramme erledigen das meist automatisch über ein Skontokonto.`,
      },
      {
        question: 'Darf ich Skonto abziehen, wenn ich nach Ablauf der Skontofrist zahle?',
        answer: 'Nein. Skonto ist an die vereinbarte Frist gebunden. Zahlen Sie später, schulden Sie den vollen Rechnungsbetrag, und der Lieferant kann den Restbetrag nachfordern. Wann die Frist beginnt, etwa ab Rechnungsdatum oder Wareneingang, ergibt sich aus den Zahlungsbedingungen.',
      },
    ],
  },

  'cashflow-rechner': {
    sections: [
      {
        title: 'Drei Fälle mit der Praktikerformel',
        content:
          table(['Fall', 'Jahresüberschuss', 'Abschreibungen', 'Rückstellungen', 'Cashflow', 'Cashflow-Marge'], CF_ROWS) +
          `\n\nDer zweite Fall zeigt, warum der Cashflow neben dem Gewinn gelesen werden sollte: Trotz ${eur0(20000)} Verlust fließen ${eur0(CF_LOSS)} Geld aus dem laufenden Geschäft zu, weil die Abschreibungen keine Auszahlung sind. Dauerhaft reicht das aber nicht, denn die abgeschriebenen Anlagen müssen irgendwann ersetzt werden.`,
      },
      {
        title: 'Was die Praktikerformel nicht zeigt',
        content:
          `Die Formel ignoriert Veränderungen im Umlaufvermögen. Steigen die offenen Kundenforderungen im Jahr um ${eur0(CF_RECEIVABLES_UP)}, ist dieses Geld noch nicht eingegangen: Aus den ${eur0(CF_BASE)} des Beispiels werden tatsächlich nur ${eur0(CF_BASE - CF_RECEIVABLES_UP)}. Dasselbe gilt für ein wachsendes Lager.\n\n` +
          `Banken nutzen den Cashflow oft für den dynamischen Verschuldungsgrad: (Verbindlichkeiten − flüssige Mittel) ÷ Cashflow. Mit ${eur0(CF_NET_DEBT)} Nettoverschuldung und ${eur0(CF_BASE)} Cashflow ergibt das ${num(CF_NET_DEBT / CF_BASE, 1)} Jahre, die das Unternehmen theoretisch für die Entschuldung bräuchte.`,
      },
    ],
    faqs: [
      {
        question: 'Kann der Cashflow positiv sein, obwohl das Unternehmen Verlust macht?',
        answer: `Ja, wenn die Abschreibungen größer sind als der Verlust. Im Beispiel mit ${eur0(20000)} Jahresfehlbetrag und ${eur0(35000)} Abschreibungen ergibt die Praktikerformel ${eur0(CF_LOSS)}. Das Unternehmen verdient dann Geld, aber nicht genug, um seine Anlagen später aus eigener Kraft zu erneuern.`,
      },
      {
        question: 'Woher bekomme ich die Werte für den Rechner?',
        answer: 'Jahresüberschuss und Abschreibungen stehen in der Gewinn- und Verlustrechnung, bei Einnahmenüberschussrechnern in der Anlage EÜR (Gewinn und AfA). Die Veränderung der langfristigen Rückstellungen ergibt sich aus dem Vergleich zweier Bilanzen. Kleine Betriebe ohne Bilanz tragen dort 0 € ein.',
      },
    ],
  },

  'abschreibung-linear-degressiv-rechner': {
    sections: [
      {
        title: 'Abschreibungsplan: 50.000-€-Maschine, 10 Jahre Nutzungsdauer',
        content:
          `Linear stehen jedes Jahr ${eur(AFA_LINEAR)} als Betriebsausgabe an. Degressiv mit ${pct(afaRate(AFA_LIFE, 'degressive30'), 0)} wird jedes Jahr der Restbuchwert mit demselben Satz abgeschrieben, bis der lineare Betrag auf die Restnutzungsdauer größer ist:\n\n` +
          table(['Jahr', 'Linear', 'Degressiv 30 % mit Wechsel', 'Restbuchwert degressiv'], AFA_ROWS) +
          `\n\nIn den ersten drei Jahren setzen Sie degressiv ${eur0(AFA_DEG_3Y)} ab, linear nur ${eur0(AFA_LINEAR * 3)}. Ab Jahr ${AFA_SWITCH.year} lohnt der Wechsel: Der Restbuchwert wird dann gleichmäßig auf die verbleibenden ${AFA_LIFE - AFA_SWITCH.year + 1} Jahre verteilt. Insgesamt wird bei beiden Methoden genau der Kaufpreis abgeschrieben, die degressive AfA zieht den Steuervorteil nur nach vorn.`,
      },
      {
        title: 'Anschaffung im laufenden Jahr: nur die Monate ab dem Kauf zählen',
        content:
          'Der Rechner zeigt die AfA eines vollen Jahres. Im Anschaffungsjahr kürzt § 7 Abs. 1 Satz 4 EStG den Betrag um ein Zwölftel für jeden vollen Monat vor dem Kaufmonat. Das gilt für beide Methoden.\n\n' +
          `Beispiel: Pkw für ${eur0(AFA_CAR)} netto, Nutzungsdauer laut AfA-Tabelle 6 Jahre, angeschafft im September. Abgeschrieben werden 4 von 12 Monaten:\n\n` +
          `- **Linear:** ${eur0(afaYear(AFA_CAR, 6, 'linear'))} × 4/12 = ${eur(AFA_CAR_LIN)} im ersten Jahr\n` +
          `- **Degressiv:** Der dreifache lineare Satz wären 50 %, gedeckelt auf ${pct(afaRate(6, 'degressive30'), 0)}. ${eur0(afaYear(AFA_CAR, 6, 'degressive30'))} × 4/12 = ${eur(AFA_CAR_DEG)}; im zweiten Jahr dann ${pct(afaRate(6, 'degressive30'), 0)} von ${eur(AFA_CAR - AFA_CAR_DEG)} = ${eur(AFA_CAR_DEG_Y2)}\n\n` +
          'Wer im Dezember kauft, bekommt also nur 1/12 der Jahres-AfA. Ein Kauf „noch schnell vor Silvester“ senkt den Gewinn deshalb weniger, als viele erwarten.',
      },
    ],
    faqs: [
      {
        question: 'Welche degressive AfA gilt für Anschaffungen im Jahr 2026?',
        answer: `Für bewegliche Wirtschaftsgüter, die nach dem 30. Juni 2025 und vor dem 1. Januar 2028 angeschafft werden, erlaubt § 7 Abs. 2 EStG höchstens das Dreifache des linearen Satzes und maximal 30 %. Bei 10 Jahren Nutzungsdauer sind das ${pct(afaRate(10, 'degressive30'), 0)}, bei 20 Jahren ${pct(afaRate(20, 'degressive30'), 0)}, bei 5 Jahren greift die Obergrenze von ${pct(afaRate(5, 'degressive30'), 0)}. Gebäude und immaterielle Wirtschaftsgüter wie Software sind ausgeschlossen. Die Variante mit 20 % betrifft nur Käufe zwischen April und Dezember 2024.`,
      },
      {
        question: 'Darf ich von der degressiven zur linearen AfA wechseln und wieder zurück?',
        answer: `Von degressiv zu linear ja, umgekehrt nicht (§ 7 Abs. 3 EStG). Nach dem Wechsel wird der Restbuchwert gleichmäßig auf die Restnutzungsdauer verteilt. Im Beispiel der Maschine sind das ab Jahr ${AFA_SWITCH.year} jeweils ${eur(AFA_SWITCH.used)} pro Jahr. Wer einmal linear begonnen hat, bleibt für dieses Wirtschaftsgut bei linear.`,
      },
    ],
    workedExamples: [
      {
        title: 'Beispiel: Maschine für 50.000 € mit degressiver AfA (Kauf 2026)',
        description: `10 Jahre Nutzungsdauer, dreifacher linearer Satz = 30 %. Erstes volles Jahr: 50.000 € × 30 % = ${eur(afaYear(AFA_COST, AFA_LIFE, 'degressive30'))}, zweites Jahr: 30 % vom Restbuchwert = ${eur(AFA_PLAN[1].used)}.`,
        inputs: { assetCost: 50000, usefulLifeYears: 10, afaMethod: 'degressive30' },
        resultSummary: `${eur(afaYear(AFA_COST, AFA_LIFE, 'degressive30'))} AfA im ersten vollen Jahr`,
      },
    ],
  },

  rabattrechner: {
    sections: [
      {
        title: 'Rabatt-Tabelle für zwei typische Preise',
        content:
          table(['Rabatt', 'Endpreis bei 79,99 €', 'Ersparnis', 'Endpreis bei 249,00 €', 'Ersparnis'], RAB_ROWS) +
          '\n\nKopfrechnen mit Zehnteln: 10 % sind der Preis mit dem Komma eine Stelle nach links, 20 % das Doppelte davon, 5 % die Hälfte. 25 % ist ein Viertel, 50 % die Hälfte.',
      },
      {
        title: 'Doppelrabatt, Rückrechnung und Rabattsatz aus zwei Preisen',
        content:
          `**Zwei Rabatte nacheinander:** 20 % Sale auf 120 € ergeben ${eur(RAB_STEP1)}. Gibt die Kasse darauf weitere 10 %, zahlen Sie ${eur(RAB_STEP2)}. Das sind insgesamt ${pct(RAB_COMBINED, 0)} und nicht 30 %, denn bei 30 % auf einmal läge der Preis bei ${eur(RAB_SINGLE30)}. Im Rechner geben Sie den zweiten Rabatt deshalb mit dem ersten Endpreis als neuem Ursprungspreis ein.\n\n` +
          `**Ursprungspreis zurückrechnen:** Ein Artikel kostet nach 25 % Rabatt ${eur(RAB_SALE)}. Der alte Preis ist ${eur(RAB_SALE)} ÷ 0,75 = ${eur(RAB_ORIG)}. Probe im Rechner: ${eur(RAB_ORIG)} minus 25 % = ${eur(RAB_ORIG_CHECK)}.\n\n` +
          `**Rabattsatz aus altem und neuem Preis:** (${eur0(RAB_FROM_OLD)} − ${eur0(RAB_FROM_NEW)}) ÷ ${eur0(RAB_FROM_OLD)} × 100 = ${pct(RAB_FROM_RATE, 2)}. Diesen Wert können Sie als Rabatt eintragen, der Rechner liefert dann wieder ${eur(RAB_FROM_CHECK)}.`,
      },
    ],
    faqs: [
      {
        question: 'Auf welchen Preis bezieht sich ein Rabatt mit durchgestrichenem Preis?',
        answer: 'Wirbt ein Händler gegenüber Verbrauchern mit einer Preisermäßigung, muss er nach § 11 PAngV den niedrigsten Gesamtpreis angeben, den er in den 30 Tagen vor der Ermäßigung verlangt hat. War ein Artikel vor zwei Wochen schon günstiger, ist dieser Preis die Bezugsgröße. Ausnahmen gelten für individuelle Preisnachlässe und für verderbliche Ware, die wegen drohenden Verderbs reduziert wird.',
      },
      {
        question: 'Wird der Rabatt vor oder nach der Mehrwertsteuer abgezogen?',
        answer: `Für das Ergebnis ist das egal. 100 € netto plus ${MWST_PERCENT} % Mehrwertsteuer ergeben ${eur(RAB_VAT_GROSS)}, davon 20 % Rabatt sind ${eur(RAB_VAT_A)}. Ziehen Sie die 20 % zuerst vom Nettopreis ab und schlagen dann die Steuer auf, landen Sie ebenfalls bei ${eur(RAB_VAT_B)}. Für Verbraucher reicht es deshalb, den Rabatt vom angezeigten Bruttopreis zu rechnen.`,
      },
    ],
  },

  'mwst-rechner': {
    sections: [
      {
        title: 'Enthaltene Mehrwertsteuer in gängigen Bruttobeträgen',
        content:
          table(['Brutto', `Netto (${MWST_PERCENT} %)`, `MwSt (${MWST_PERCENT} %)`, `Netto (${MWST_REDUCED} %)`, `MwSt (${MWST_REDUCED} %)`], MWST_ROWS) +
          `\n\nAls Merkhilfe: In jedem Bruttobetrag mit ${MWST_PERCENT} % stecken rund 15,97 % Steuer (19/119), bei ${MWST_REDUCED} % rund 6,54 % (7/107).`,
      },
      {
        title: 'Restaurantrechnung 2026: zwei Steuersätze auf einem Beleg',
        content:
          `Seit dem 1. Januar 2026 gilt für Speisen in der Gastronomie dauerhaft der ermäßigte Satz von ${MWST_REDUCED} %, Getränke bleiben bei ${MWST_PERCENT} %. Auf einer Rechnung über 46 € Essen und 14 € Getränke (brutto) stecken deshalb:\n\n` +
          `- **Speisen:** 46 € ÷ 1,07 = ${eur(prim(MWST_FOOD))} netto, ${eur(sec(MWST_FOOD, 'vatAmount'))} Steuer\n` +
          `- **Getränke:** 14 € ÷ 1,19 = ${eur(prim(MWST_DRINKS))} netto, ${eur(sec(MWST_DRINKS, 'vatAmount'))} Steuer\n` +
          `- **Zusammen:** ${eur(MWST_RESTAURANT_TAX)} Umsatzsteuer statt ${eur(MWST_ALL19)}, wenn alles mit ${MWST_PERCENT} % belegt wäre\n\n` +
          'Rechnen Sie gemischte Belege also nie mit einem einzigen Satz. Für Geschäftsessen, bei denen Sie die Vorsteuer ziehen, muss die Rechnung beide Sätze getrennt ausweisen.',
      },
    ],
    faqs: [
      {
        question: 'Was muss auf einer Kleinbetragsrechnung bis 250 € stehen?',
        answer: `Nach § 33 UStDV reichen bei einem Gesamtbetrag bis 250 € brutto: Name und Anschrift des Verkäufers, Ausstellungsdatum, Menge und Art der Ware oder Leistung, der Bruttobetrag und der Steuersatz. Der Steuerbetrag muss nicht extra ausgewiesen sein. Sie rechnen ihn selbst heraus: Bei einem Beleg über 119 € mit ${MWST_PERCENT} % sind das ${eur(MWST_RECEIPT)} Vorsteuer.`,
      },
      {
        question: 'Ist ein Umsatz mit 0 % Umsatzsteuer dasselbe wie ein steuerfreier Umsatz?',
        answer: 'Nein. Beim Nullsteuersatz, etwa für Photovoltaikanlagen bis 30 kWp nach § 12 Abs. 3 UStG, fällt keine Steuer an, der Verkäufer darf die Vorsteuer aus seinen Einkäufen aber trotzdem abziehen. Bei steuerfreien Umsätzen, zum Beispiel ärztlichen Heilbehandlungen, ist der Vorsteuerabzug dagegen in der Regel ausgeschlossen. Für den Käufer ist der Preis in beiden Fällen ohne Umsatzsteuer.',
      },
    ],
  },

  'churn-rate-rechner': {
    sections: [
      {
        title: 'Was eine monatliche Churn-Rate über das Jahr bedeutet',
        content:
          'Ausgangspunkt sind 1.000 Kunden ohne Neukunden. Die Jahres-Churn-Rate rechnet der Rechner mit 1 − (1 − Monats-Churn)¹²:\n\n' +
          table(['Monats-Churn', 'Jahres-Churn', 'Ø Kundenlebensdauer', 'Kunden nach 12 Monaten'], CHURN_ROWS) +
          '\n\nDie Lebensdauer ist ein Durchschnitt unter der Annahme, dass die Abwanderung jeden Monat gleich bleibt. In der Praxis kündigen viele Kunden in den ersten Monaten, wer länger bleibt, bleibt oft lange. Vergleichen Sie deshalb zusätzlich Kohorten nach Startmonat.',
      },
      {
        title: 'Drei häufige Rechenfehler',
        content:
          `- **Neukunden in den Nenner nehmen:** Wer zu den 1.000 Startkunden die 200 Neukunden des Monats addiert, erhält bei 30 Kündigungen nur ${pct(CHURN_WRONG_DENOM, 1)} statt ${pct(prim(CHURN_BASE), 1)}. In den Nenner gehört nur der Bestand zu Monatsbeginn.\n` +
          `- **Monatswert mal 12:** 3 % × 12 = ${pct(CHURN_NAIVE, 0)}. Weil jeden Monat nur noch die verbliebenen Kunden kündigen können, sind es tatsächlich ${pct(sec(CHURN_BASE, 'annualChurn'), 1)}.\n` +
          '- **Kündigungseingang statt Vertragsende zählen:** Ein im März gekündigter Jahresvertrag, der im Dezember endet, gehört in den Dezember. Sonst springt die Quote in Monaten mit vielen Kündigungsschreiben, obwohl der Umsatz noch fließt.',
      },
    ],
    faqs: [
      {
        question: 'Wie rechne ich eine jährliche Churn-Rate in eine monatliche um?',
        answer: `Mit Monats-Churn = 1 − (1 − Jahres-Churn)^(1/12). Aus 20 % pro Jahr werden so ${pct(CHURN_FROM_ANNUAL, 2)} pro Monat, nicht 20 % ÷ 12 = 1,67 %. Probe im Rechner: ${num(CHURN_FROM_ANNUAL * 10, 1)} Kündigungen bei 1.000 Kunden ergeben wieder ${pct(CHURN_FROM_ANNUAL_CHECK, 1)} im Jahr.`,
      },
      {
        question: 'Wie viele Neukunden brauche ich, um bei 3 % Churn nicht zu schrumpfen?',
        answer: `Bei 1.000 Kunden genau so viele, wie kündigen: 30 pro Monat. Bei 49 € Monatsumsatz je Kunde ersetzen sie ${eur(sec(CHURN_BASE, 'lostMrr'))} wegfallenden Umsatz. Wächst der Kundenstamm, steigt die Zahl mit: Bei 2.000 Kunden und gleicher Quote sind es schon 60 Neukunden, nur um den Bestand zu halten.`,
      },
    ],
  },

  zinseszinsrechner: {
    sections: [
      {
        title: '100 € im Monat bei 5 %: wie der Zinsanteil mit der Laufzeit wächst',
        content:
          'Monatliche Zinsgutschrift, Einzahlung am Monatsende, kein Startkapital:\n\n' +
          table(['Laufzeit', 'Eingezahlt', 'Endkapital', 'davon Zinsen', 'Zinsanteil am Endkapital'], ZZ_ROWS) +
          `\n\nNach ${ZZ_FIRST.years} Jahren machen die Zinsen erst ${pct(ZZ_FIRST.share, 0)} des Guthabens aus. Bei ${ZZ_CROSS.years} Jahren Laufzeit stammt schon mehr als die Hälfte aus Zinsen und Zinseszinsen, obwohl die monatliche Rate nie gestiegen ist. Die 5 % sind eine Annahme: Tagesgeld bringt meist weniger, Aktienfonds schwanken und haben keinen festen Zins.`,
      },
      {
        title: 'Zehn Jahre später anfangen: was das kostet',
        content:
          `Alle mit 5 % Zins und monatlicher Gutschrift:\n\n` +
          `- **150 € über 35 Jahre:** ${eur0(sec(ZZ_EARLY, 'totalDeposits'))} eingezahlt, ${eur0(prim(ZZ_EARLY))} Endkapital\n` +
          `- **150 € über 25 Jahre:** ${eur0(sec(ZZ_LATE, 'totalDeposits'))} eingezahlt, ${eur0(prim(ZZ_LATE))} Endkapital\n` +
          `- **300 € über 25 Jahre:** ${eur0(sec(ZZ_LATE_DOUBLE, 'totalDeposits'))} eingezahlt, ${eur0(prim(ZZ_LATE_DOUBLE))} Endkapital\n` +
          `- **150 € über 25 Jahre mit 3 % Sparratendynamik:** ${eur0(sec(ZZ_LATE_DYN, 'totalDeposits'))} eingezahlt, ${eur0(prim(ZZ_LATE_DYN))} Endkapital\n\n` +
          'Wer zehn Jahre später startet, muss die Sparrate verdoppeln, um ungefähr auf das Ergebnis des frühen Sparers zu kommen, und zahlt dafür deutlich mehr eigenes Geld ein. Die Dynamik-Option im Rechner bildet ab, dass die Rate mit dem Gehalt mitwächst.',
      },
    ],
    faqs: [
      {
        question: 'Wie viel Zinsen bringen 10.000 € in 10 Jahren?',
        answer: `Bei jährlicher Zinsgutschrift und ohne weitere Einzahlungen: ${ZZ_ONCE.map(({ rate, r }) => `${pct(rate, 0)} ergeben ${eur(sec(r, 'totalInterest'))}`).join(', ')} Zinsen vor Steuern. Bei monatlicher Gutschrift ist es etwas mehr, weil die Zinsen schon im Laufe des Jahres mitverzinst werden.`,
      },
      {
        question: 'Was ist der Unterschied zwischen vorschüssiger und nachschüssiger Einzahlung?',
        answer: `Vorschüssig wird die Rate am Monatsanfang eingezahlt und verzinst sich im selben Monat schon mit, nachschüssig erst am Monatsende. Mit den Standardwerten (10.000 € Start, 150 € monatlich, 5 %, 15 Jahre) ergibt das ${eur(prim(ZZ_START))} statt ${eur(prim(ZZ_END))}, also ${eur(prim(ZZ_START) - prim(ZZ_END))} mehr. Sparpläne mit Ausführung zu Monatsbeginn entsprechen der vorschüssigen Variante.`,
      },
    ],
  },

  'marge-rechner': {
    sections: [
      {
        title: 'Was ein Rabatt von der Marge übrig lässt',
        content: [
          `Ein Artikel kostet ${eur(MARGE_EK)} im Einkauf und ${eur(MARGE_VK)} im Verkauf (netto). Jeder Rabatt geht voll vom Rohgewinn ab, der Einkaufspreis bleibt gleich:`,
          table(['Rabatt', 'Verkaufspreis', 'Rohgewinn', 'Marge', 'Nötige Mehrmenge'], MARGE_ROWS),
          `Die letzte Spalte zeigt, wie viel mehr Stück Sie verkaufen müssen, um denselben Rohgewinn in Euro zu erreichen wie ohne Rabatt. Bei ${pct(prim(margeAt(MARGE_VK)), 0)} Ausgangsmarge verlangt ein Nachlass von 10 % bereits ${num((MARGE_BASE_PROFIT / sec(margeAt(MARGE_VK * 0.9), 'grossProfit') - 1) * 100, 0)} % mehr Absatz, einer von 20 % ${num((MARGE_BASE_PROFIT / sec(margeAt(MARGE_VK * 0.8), 'grossProfit') - 1) * 100, 0)} % mehr. ` +
            'Je niedriger die Ausgangsmarge, desto teurer wird jeder Rabattpunkt. Prüfen Sie Aktionspreise deshalb mit dem Modus „Marge aus Einkaufs- und Verkaufspreis“, bevor Sie sie ankündigen.',
        ].join('\n\n'),
      },
    ],
  },

  'umsatzrentabilitaet-rechner': {
    sections: [
      {
        title: 'Wann der Hebel kippt: gleiches Unternehmen, steigende Kreditzinsen',
        content: [
          `Ein Unternehmen erwirtschaftet ${eur0(RENT_EBIT)} vor Zinsen bei 1 Mio. € Umsatz, 400.000 € Eigenkapital und ${eur0(RENT_FK)} Fremdkapital. Nur der Zins auf das Fremdkapital ändert sich:`,
          table(['Kreditzins', 'Gewinn nach Zinsen', 'Eigenkapitalrendite', 'Gesamtkapitalrendite'], RENT_ROWS),
          'Die Gesamtkapitalrendite bleibt in jeder Zeile gleich, weil die Zinsen wieder hinzugerechnet werden. Die Eigenkapitalrendite fällt dagegen mit jedem Zinsschritt. Bei 10,4 % Kreditzins entspricht sie genau der Gesamtkapitalrendite, darüber liegt sie unter ihr: Ab diesem Punkt drückt jeder geliehene Euro die Rendite der Eigentümer. Für eine Finanzierungsentscheidung vergleichen Sie also den Zins des neuen Kredits mit der Gesamtkapitalrendite, nicht mit der Umsatzrendite.',
        ].join('\n\n'),
      },
    ],
  },
};
