import { PageContentMap } from './types';
import { CalculationResult } from '@/types/calculator';
import { EXTRA_WOHNEN_HAUSHALT } from '../extra/wohnenHaushalt';
import { calculateElectricityCost, calculateLedSavings } from '@/lib/calculators/haushalt';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';

// ---------------------------------------------------------------------------
// Helpers: every number below is computed with the calculator's own engine at module load.
// Prices (Strom, Pellets, Gas, Öl) are labelled example values, never current market prices.
// ---------------------------------------------------------------------------
function run(slug: string, inputs: Record<string, any>): CalculationResult {
  const calc = EXTRA_WOHNEN_HAUSHALT.find((c) => c.slug === slug);
  if (!calc || !calc.calculate) throw new Error(`page-content/haushalt: calculator ${slug} not found`);
  return calc.calculate(inputs) as CalculationResult;
}
function num(r: CalculationResult, id: string): number {
  if (r.primary.id === id) return Number(r.primary.value);
  const item = r.secondary?.find((s) => s.id === id);
  if (!item) throw new Error(`page-content/haushalt: result ${id} missing`);
  return Number(item.value);
}
function txt(r: CalculationResult, id: string): string {
  if (r.primary.id === id) return String(r.primary.formattedValue);
  const item = r.secondary?.find((s) => s.id === id);
  if (!item) throw new Error(`page-content/haushalt: result ${id} missing`);
  return String(item.formattedValue);
}
function table(head: string[], rows: string[][]): string {
  return [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n');
}
const eur = (v: number) => formatCurrency(v);
const eur0 = (v: number) => `${formatNumber(v, 0)} €`;
const kwhTxt = (v: number) => `${formatNumber(v, 0)} kWh`;
const ctLabel = (c: number) => `${formatNumber(c, 2, 2)} ct/kWh`;
const yearsTxt = (v: number) => `${formatNumber(v, 1)} Jahre`;
const PRICE_CT = [30, 35, 40];

// ---------------------------------------------------------------------------
// Stromkostenrechner (Haushalt)
// ---------------------------------------------------------------------------
const STROM_BASE = 12;
const strom = (kwh: number, price: number, base = STROM_BASE) => calculateElectricityCost({ annualKwh: kwh, pricePerKwh: price, basePricePerMonth: base });
const ST_TABLE = table(
  ['Jahresverbrauch', ...PRICE_CT.map((c) => `${c} ct/kWh`)],
  [1500, 2500, 3500, 4500].map((kwh) => [
    kwhTxt(kwh),
    ...PRICE_CT.map((c) => {
      const r = strom(kwh, c / 100);
      return `${txt(r, 'totalCost')} (${txt(r, 'monthlyAverage')}/Monat)`;
    }),
  ]),
);
const ST_READ_A = 12345;
const ST_READ_B = 13712;
const ST_DAYS = 183;
const ST_YEAR_KWH = Math.round(((ST_READ_B - ST_READ_A) / ST_DAYS) * 365);
const ST_YEAR = strom(ST_YEAR_KWH, 0.35);
const ST_CENT_DIFF = num(strom(2500, 0.36), 'totalCost') - num(strom(2500, 0.35), 'totalCost');
const ST_A = (kwh: number) => num(strom(kwh, 0.35, 12), 'totalCost');
const ST_B = (kwh: number) => num(strom(kwh, 0.40, 0), 'totalCost');
const ST_BREAK_EVEN = (12 * 12) / (0.40 - 0.35);
const ST_EFF = (kwh: number) => (num(strom(kwh, 0.35), 'totalCost') / kwh) * 100;

// ---------------------------------------------------------------------------
// LED-Ersparnis
// ---------------------------------------------------------------------------
const LED_PRICE = 0.35;
const led = (oldW: number, ledW: number, hours: number, count = 1) => calculateLedSavings({ oldWatts: oldW, ledWatts: ledW, bulbCount: count, hoursPerDay: hours, pricePerKwh: LED_PRICE });
const LED_SWAPS: Array<[string, number, number]> = [
  ['Glühlampe 25 W', 25, 3],
  ['Glühlampe 40 W', 40, 5],
  ['Glühlampe 60 W', 60, 8],
  ['Glühlampe 100 W', 100, 13],
  ['Halogen-Spot 50 W', 50, 5],
];
const LED_SWAP_TABLE = table(
  ['Alte Lampe', 'LED (Beispiel)', 'Gesparte kWh/Jahr', 'Ersparnis/Jahr', 'Ersparnis in 5 Jahren'],
  LED_SWAPS.map(([label, o, l]) => {
    const r = led(o, l, 3);
    return [label, `${l} W`, txt(r, 'kwhSaved'), txt(r, 'annualSaved'), txt(r, 'fiveYearSavings')];
  }),
);
const LED_HOURS_TABLE = table(
  ['Brenndauer pro Tag', 'Gesparte kWh/Jahr', 'Ersparnis/Jahr'],
  [0.5, 2, 5, 8].map((h) => {
    const r = led(60, 8, h);
    return [`${formatNumber(h, 1)} Std.`, txt(r, 'kwhSaved'), txt(r, 'annualSaved')];
  }),
);
const LED_CFL = led(11, 8, 3);
const LED_60_3H = num(led(60, 8, 3), 'annualSaved');
const LED_RATIO_100_60 = num(led(100, 13, 3), 'annualSaved') / LED_60_3H;
const LED_EXAMPLE_PRICE = 4;
const LED_PAYBACK_MONTHS = (LED_EXAMPLE_PRICE / LED_60_3H) * 12;

// ---------------------------------------------------------------------------
// Waschmaschine
// ---------------------------------------------------------------------------
const WM_BASE = { waterPerWashLiters: 50, detergentCost: 0.22, waterPricePerM3: 4.8, washesPerWeek: 4 };
const wm = (kwh: number, ct: number, extra: Record<string, any> = {}) => run('waschmaschine-kosten-rechner', { ...WM_BASE, kwhPerWash: kwh, electricityPrice: ct, ...extra });
const WM_TABLE = table(
  ['Strom pro Waschgang', ...PRICE_CT.map((c) => `pro Waschgang bei ${c} ct`), 'pro Jahr bei 35 ct (4 × pro Woche)'],
  [0.5, 0.85, 1.2].map((k) => [
    `${formatNumber(k, 2)} kWh`,
    ...PRICE_CT.map((c) => txt(wm(k, c), 'costPerWash')),
    txt(wm(k, 35), 'yearlyCost'),
  ]),
);
const WM_FULL = num(wm(0.85, 35, { washesPerWeek: 4 }), 'yearlyCost');
const WM_HALF = num(wm(0.85, 35, { washesPerWeek: 8 }), 'yearlyCost');
const WM_OLD_NEW = num(wm(1.0, 35), 'yearlyCost') - num(wm(0.5, 35), 'yearlyCost');
const WM_SINGLE = wm(0.85, 35, { washesPerWeek: 2 });
const WM_FAMILY = wm(0.85, 35, { washesPerWeek: 7 });

// ---------------------------------------------------------------------------
// Wäschetrockner
// ---------------------------------------------------------------------------
const tr = (type: string, ct: number, perWeek = 3) => run('trockner-kosten-rechner', { dryerType: type, cyclesPerWeek: perWeek, electricityPrice: ct });
const TR_TABLE = table(
  ['Strompreis (Beispiel)', 'Wärmepumpe pro Durchgang', 'Wärmepumpe pro Jahr', 'Kondens pro Durchgang', 'Kondens pro Jahr', 'Differenz pro Jahr'],
  PRICE_CT.map((c) => {
    const hp = tr('heatpump', c);
    const co = tr('condenser', c);
    return [`${c} ct/kWh`, txt(hp, 'costPerCycle'), txt(hp, 'yearlyCost'), txt(co, 'costPerCycle'), txt(co, 'yearlyCost'), txt(hp, 'yearlySaving')];
  }),
);
const TR_SURCHARGE = 300;
const TR_PAYBACK = table(
  ['Trocknungen pro Woche', 'Ersparnis pro Jahr', `Aufpreis ${eur0(TR_SURCHARGE)} wieder drin nach`],
  [2, 3, 5].map((w) => {
    const s = num(tr('heatpump', 35, w), 'yearlySaving');
    return [`${w}`, eur(s), yearsTxt(TR_SURCHARGE / s)];
  }),
);
const TR_MONTH_3 = num(tr('heatpump', 35, 3), 'yearlyCost') / 12;
const TR_MONTH_5 = num(tr('heatpump', 35, 5), 'yearlyCost') / 12;

// ---------------------------------------------------------------------------
// Spülmaschine
// ---------------------------------------------------------------------------
const SP_BASE = { kwhPerCycle: 0.82, waterPerCycleLiters: 10, tabCost: 0.15 };
const sp = (perWeek: number, ct: number, extra: Record<string, any> = {}) => run('spuelmaschine-kosten-rechner', { ...SP_BASE, cyclesPerWeek: perWeek, electricityPrice: ct, ...extra });
const SP_TABLE = table(
  ['Spülgänge pro Woche', ...PRICE_CT.map((c) => `pro Jahr bei ${c} ct`)],
  [3, 5, 7].map((w) => [`${w}`, ...PRICE_CT.map((c) => txt(sp(w, c), 'yearlyCost'))]),
);
const SP_DEF = sp(5, 35);
const SP_HAND_VALUE = num(SP_DEF, 'costPerCycle') + num(SP_DEF, 'yearlySavingVsHand') / (5 * 52);
const SP_INTENSIVE = sp(5, 35, { kwhPerCycle: 1.3, tabCost: 0.3 });
const SP_TAB_DIFF = num(sp(5, 35, { tabCost: 0.25 }), 'yearlyCost') - num(sp(5, 35, { tabCost: 0.05 }), 'yearlyCost');
const SP_FULL = num(sp(3, 35), 'yearlyCost');
const SP_HALF = num(sp(6, 35), 'yearlyCost');

// ---------------------------------------------------------------------------
// Warmwasser (Durchlauferhitzer)
// ---------------------------------------------------------------------------
const WW_DT = 28; // 10 °C Kaltwasser auf 38 °C Duschtemperatur
const WH_PER_L_K = 1.163;
const wwKw = (lpm: number, dt = WW_DT) => (lpm * 60 * dt * WH_PER_L_K) / 1000;
const ww = (persons: number, mins: number, kw: number, ct: number) => run('warmwasserkosten-rechner', { persons, showerMinutesPerPerson: mins, powerKw: kw, electricityPrice: ct });
const WW_FLOW_TABLE = table(
  ['Durchfluss', 'Benötigte Leistung', '7-Minuten-Dusche', 'Pro Jahr (1 Person, täglich)'],
  [6, 9, 12].map((lpm) => {
    const kw = wwKw(lpm);
    const r = ww(1, 7, kw, 35);
    return [`${lpm} l/min`, `${formatNumber(kw, 1)} kW`, txt(r, 'costPerShower'), txt(r, 'yearlyCost')];
  }),
);
const WW_KW_9 = wwKw(9);
const WW_DUR_TABLE = table(
  ['Duschdauer', ...PRICE_CT.map((c) => `${c} ct/kWh`)],
  [4, 7, 10].map((m) => [`${m} Minuten`, ...PRICE_CT.map((c) => txt(ww(3, m, WW_KW_9, c), 'yearlyCost'))]),
);
const WW_MINUTE = ww(1, 1, WW_KW_9, 35);
const WW_BATH_L = 150;
const WW_BATH_KWH = (WW_BATH_L * 30 * WH_PER_L_K) / 1000;

// ---------------------------------------------------------------------------
// Pelletheizung
// ---------------------------------------------------------------------------
const PE_PRICE = 350;
const PE_OIL_EFF = 0.85;
const pe = (kwh: number, price = PE_PRICE) => run('pelletheizung-verbrauch-rechner', { heatDemandKwh: kwh, pelletPricePerTon: price });
const PE_TABLE = table(
  ['Bisher Heizöl pro Jahr', 'Nutzwärme (Annahme 85 %)', 'Pellets pro Jahr', 'Lagervolumen', `Kosten bei ${eur0(PE_PRICE)}/t`],
  [1500, 2000, 2500, 3000].map((l) => {
    const heat = l * 10 * PE_OIL_EFF;
    const r = pe(heat);
    return [`${formatNumber(l, 0)} l`, kwhTxt(heat), txt(r, 'tonsNeeded'), txt(r, 'storageVolumeM3'), txt(r, 'totalCost')];
  }),
);
const PE_WRONG = num(pe(2000 * 10), 'tonsNeeded');
const PE_RIGHT = num(pe(2000 * 10 * PE_OIL_EFF), 'tonsNeeded');
const PE_18 = pe(18000);
const PE_SACKS = Math.ceil((num(PE_18, 'tonsNeeded') * 1000) / 15);
const PE_ONE_TON = pe(4400); // 4.400 kWh Nutzwärme = 1.000 kg Pellets im Rechner
const PE_M3_PER_TON = num(PE_ONE_TON, 'storageVolumeM3') / num(PE_ONE_TON, 'tonsNeeded');
const PE_STORE_M3 = 6;

// ---------------------------------------------------------------------------
// Heizkostenvergleich
// ---------------------------------------------------------------------------
const HK_BASE = { gasPriceCent: 11, oilPricePerLiter: 1.05, pelletPricePerTon: 320, heatPumpJaz: 3.6, heatPumpPowerPrice: 28, districtHeatingPriceCent: 12.5, includeMaintenance: false };
const hk = (demand: number, extra: Record<string, any> = {}) => run('heizkostenvergleich-rechner', { ...HK_BASE, heatDemandKwh: demand, ...extra });
const HK_REF = 10000;
const HK_GAS_CT_HEAT = (num(hk(HK_REF), 'gasCost') / HK_REF) * 100;
const HK_JAZ_TABLE = table(
  ['JAZ', 'Wärmepumpe bei 28 ct/kWh Strom', 'Gas-Brennwert bei 11 ct/kWh Gas', 'Strompreis für Gleichstand'],
  [2.5, 3.0, 3.5, 4.0].map((j) => {
    const wpCt = (num(hk(HK_REF, { heatPumpJaz: j }), 'wpCost') / HK_REF) * 100;
    return [formatNumber(j, 1, 1), `${formatNumber(wpCt, 1, 1)} ct je kWh Wärme`, `${formatNumber(HK_GAS_CT_HEAT, 1, 1)} ct je kWh Wärme`, `${formatNumber(HK_GAS_CT_HEAT * j, 1, 1)} ct/kWh`];
  }),
);
const HK_SYSTEMS: Array<[string, string]> = [
  ['Wärmepumpe (JAZ 3,6)', 'wpCost'],
  ['Fernwärme', 'fwCost'],
  ['Pellets', 'pelletCost'],
  ['Gas-Brennwert', 'gasCost'],
  ['Öl-Brennwert', 'oilCost'],
];
const HK_MAINT_TABLE = table(
  ['Heizsystem', 'Wartungspauschale', '12.000 kWh Nutzwärme', '25.000 kWh Nutzwärme'],
  HK_SYSTEMS.map(([label, id]) => {
    const maint = num(hk(12000, { includeMaintenance: true }), id) - num(hk(12000), id);
    return [label, eur0(maint), txt(hk(12000, { includeMaintenance: true }), id), txt(hk(25000, { includeMaintenance: true }), id)];
  }),
);
const HK_GAS_EFF = HK_REF / ((num(hk(HK_REF), 'gasCost') * 100) / HK_BASE.gasPriceCent);
const HK_GAS_BILL = 20000;
const HK_FROM_BILL = HK_GAS_BILL * HK_GAS_EFF;
function hkEmission(r: CalculationResult, startsWith: string): string {
  const row = r.breakdown?.rows?.find((x: any) => String(x.values?.system ?? '').startsWith(startsWith));
  return String(row?.values?.emissions ?? '');
}
const HK_18 = hk(18000);

// ---------------------------------------------------------------------------
// Wärmepumpe Stromkosten
// ---------------------------------------------------------------------------
const wp = (heat: number, jaz: number, ct = 28) => run('waermepumpe-stromkosten-rechner', { heatDemandKwh: heat, jaz, heatElectricityPriceCent: ct });
const WP_DEMANDS = [12000, 16000, 20000];
const WP_TABLE = table(
  ['JAZ', ...WP_DEMANDS.map((d) => `${formatNumber(d, 0)} kWh Wärme`)],
  [2.5, 3.0, 3.5, 4.0, 4.5].map((j) => [
    formatNumber(j, 1, 1),
    ...WP_DEMANDS.map((d) => {
      const r = wp(d, j);
      return `${txt(r, 'electricityKwh')} · ${txt(r, 'yearlyCost')}`;
    }),
  ]),
);
const WP_HEAT_METER = 14200;
const WP_POWER_METER = 4100;
const WP_OWN_JAZ = WP_HEAT_METER / WP_POWER_METER;
const WP_OWN = wp(WP_HEAT_METER, WP_OWN_JAZ);
const WP_CUT_25_40 = (1 - num(wp(16000, 4.0), 'yearlyCost') / num(wp(16000, 2.5), 'yearlyCost')) * 100;
const WP_JAZ_DIFF = num(wp(16000, 3.0), 'yearlyCost') - num(wp(16000, 3.5), 'yearlyCost');
const WP_TARIFF_DIFF = num(wp(16000, 3.5, 36), 'yearlyCost') - num(wp(16000, 3.5, 28), 'yearlyCost');

// ---------------------------------------------------------------------------
// Balkonkraftwerk
// ---------------------------------------------------------------------------
const BK_COST = 450;
const bk = (pct: number, ct: number, wpk = 800) => run('balkonkraftwerk-ertrag-rechner', { modulePowerWp: wpk, systemCost: BK_COST, ownConsumptionPct: pct, electricityPrice: ct });
const BK_TABLE = table(
  ['Eigenverbrauch', ...PRICE_CT.map((c) => `${c} ct/kWh`)],
  [50, 65, 80].map((p) => [formatPercent(p, 0), ...PRICE_CT.map((c) => {
    const r = bk(p, c);
    return `${txt(r, 'yearlySaving')} (${formatNumber(num(r, 'amortYears'), 1)} J.)`;
  })]),
);
const BK_GEN_800 = num(bk(75, 36), 'yearlyGenerationKwh');
const BK_DEF = bk(75, 36, 850);
const BK_SURPLUS = num(BK_DEF, 'yearlyGenerationKwh') - num(BK_DEF, 'usedKwh');

// ---------------------------------------------------------------------------
// Photovoltaik (Dachanlage)
// ---------------------------------------------------------------------------
const PV_BASE = { peakPowerKwp: 10, totalCost: 15500, householdDemandKwh: 4500, feedInTariffCent: 7.7, gridPriceCent: 36 };
const pv = (self: number, extra: Record<string, any> = {}) => run('photovoltaik-amortisation-rechner', { ...PV_BASE, selfConsumptionPct: self, ...extra });
const PV_TABLE = table(
  ['Eigenverbrauch', 'Gesparte Stromkosten', 'Einspeisevergütung', 'Nutzen pro Jahr', 'Amortisation', 'Autarkiegrad'],
  [20, 30, 40, 50, 60].map((s) => {
    const r = pv(s);
    return [formatPercent(s, 0), txt(r, 'savedGridCost'), txt(r, 'feedInRevenue'), txt(r, 'totalYearlyBenefit'), txt(r, 'amortYears'), txt(r, 'autarkyPct')];
  }),
);
const PV_GAP_CT = PV_BASE.gridPriceCent - PV_BASE.feedInTariffCent;
const PV_STORAGE_GAIN = num(pv(60), 'totalYearlyBenefit') - num(pv(30), 'totalYearlyBenefit');
const PV_35 = pv(35);

// ---------------------------------------------------------------------------
// Energieeffizienzklasse
// ---------------------------------------------------------------------------
const EK_AREA = 150;
const ek = (kennwert: number) => run('energieeffizienzklasse-rechner', { endenergieKwh: kennwert });
const EK_TABLE = table(
  ['Verbrauch pro Jahr', 'Kennwert', 'Klasse'],
  [4500, 9000, 13500, 18000, 22500, 30000, 33000, 40000].map((kwh) => {
    const k = kwh / EK_AREA;
    return [kwhTxt(kwh), `${formatNumber(k, 1)} kWh/(m²·a)`, String(ek(k).primary.formattedValue)];
  }),
);
const EK_130 = String(ek(130).primary.formattedValue);
const EK_131 = String(ek(130.5).primary.formattedValue);

// ---------------------------------------------------------------------------
// Lebensmittelbudget
// ---------------------------------------------------------------------------
const lb = (adults: number, children: number, lifestyle: string) => run('lebensmittelbudget-rechner', { adults, children, lifestyle });
// Destatis, Laufende Wirtschaftsrechnungen 2024: Nahrungsmittel, Getränke und Tabakwaren je Haushalt und Monat
const LWR_2024: Record<number, number> = { 1: 270, 2: 505, 3: 653, 4: 759 };
const LB_HOUSEHOLDS: Array<[string, number, number]> = [
  ['1 Erwachsener', 1, 0],
  ['2 Erwachsene', 2, 0],
  ['2 Erwachsene + 1 Kind', 2, 1],
  ['2 Erwachsene + 2 Kinder', 2, 2],
];
const LB_TABLE = table(
  ['Haushalt', 'Sehr sparsam', 'Ausgewogen', 'Bio', 'Destatis LWR 2024 (gleiche Personenzahl)'],
  LB_HOUSEHOLDS.map(([label, a, k]) => [
    label,
    txt(lb(a, k, 'thrifty'), 'totalMonth'),
    txt(lb(a, k, 'standard'), 'totalMonth'),
    txt(lb(a, k, 'bio'), 'totalMonth'),
    eur0(LWR_2024[a + k]),
  ]),
);
const LB_2_STD = lb(2, 0, 'standard');
const LB_2_THRIFTY = lb(2, 0, 'thrifty');
const LB_FAMILY = lb(2, 1, 'standard');
const LB_FAMILY_WEEK = num(LB_FAMILY, 'weekly');

// ---------------------------------------------------------------------------
// Gasverbrauch m³ in kWh (11 ct/kWh ist ein Beispiel-Arbeitspreis, kein Marktpreis)
// ---------------------------------------------------------------------------
const GV_PRICE = 11;
const gv = (m3: number, bw: number, z: number) =>
  run('gasverbrauch-kwh-m3-rechner', { inputMode: 'volume', gasCubicMeters: m3, brennwert: bw, zustandszahl: z, gasPricePerKwh: GV_PRICE });
const GV_M3 = 1200;
const GV_CASES: Array<[string, number, number]> = [
  ['L-Gas, Lage im Tiefland', 9.8, 0.96],
  ['L-Gas, Mittelgebirge', 9.8, 0.9],
  ['H-Gas, niedriger Brennwert', 10.4, 0.95],
  ['H-Gas, Standardwerte des Rechners', 10.8, 0.95],
  ['H-Gas, hoher Brennwert', 11.4, 0.95],
];
const GV_TABLE = table(
  ['Netzgebiet (Beispiel)', 'Brennwert', 'Zustandszahl', 'kWh aus 1.200 m³', 'Arbeitspreis-Kosten'],
  GV_CASES.map(([label, bw, z]) => {
    const r = gv(GV_M3, bw, z);
    return [label, `${formatNumber(bw, 1, 1)} kWh/m³`, formatNumber(z, 2, 2), kwhTxt(num(r, 'kwh')), eur(num(r, 'consumptionCost'))];
  }),
);
const GV_MIN = num(gv(GV_M3, 9.8, 0.9), 'kwh');
const GV_MAX = num(gv(GV_M3, 11.4, 0.95), 'kwh');
const GV_READ = run('gasverbrauch-kwh-m3-rechner', { inputMode: 'readings', meterReadingOld: 4815, meterReadingNew: 5962, brennwert: 10.8, zustandszahl: 0.95, gasPricePerKwh: GV_PRICE });
const GV_KWH_PER_M3 = num(gv(100, 10.8, 0.95), 'reference100Kwh') / 100;
const GV_PLAN_KWH = 12000;
const GV_PLAN_M3 = GV_PLAN_KWH / GV_KWH_PER_M3;
const GV_HS_HI = 1.11; // Verhältnis Brennwert/Heizwert bei Erdgas, physikalischer Richtwert

export const HAUSHALT_PAGE_CONTENT: PageContentMap = {
  stromkostenrechner: {
    sections: [
      {
        title: 'Jahreskosten bei 1.500 bis 4.500 kWh und drei Beispielpreisen',
        content:
          `Berechnet mit ${eur(STROM_BASE)} Grundpreis pro Monat. Die Arbeitspreise 30, 35 und 40 ct/kWh sind Beispielwerte, keine aktuellen Marktpreise – maßgeblich ist der Preis in Ihrem Vertrag oder auf der letzten Jahresabrechnung.\n\n${ST_TABLE}\n\n` +
          'In Klammern steht der rechnerische Monatsdurchschnitt. Liegt Ihr Abschlag deutlich darunter, ist eine Nachzahlung wahrscheinlich; liegt er deutlich darüber, können Sie beim Versorger eine Anpassung beantragen.',
      },
      {
        title: 'Jahresverbrauch aus zwei Zählerständen hochrechnen',
        content:
          'Wer keine Jahresabrechnung zur Hand hat, liest den Zähler zweimal ab und rechnet auf 365 Tage hoch:\n\n' +
          `1. Erster Zählerstand am 1. April: ${formatNumber(ST_READ_A, 0)} kWh\n` +
          `2. Zweiter Zählerstand am 1. Oktober (${ST_DAYS} Tage später): ${formatNumber(ST_READ_B, 0)} kWh\n` +
          `3. Verbrauch im Zeitraum: ${formatNumber(ST_READ_B - ST_READ_A, 0)} kWh, also ${formatNumber((ST_READ_B - ST_READ_A) / ST_DAYS, 2)} kWh pro Tag\n` +
          `4. Hochgerechnet auf ein Jahr: rund ${kwhTxt(ST_YEAR_KWH)}\n\n` +
          `Mit 35 ct/kWh (Beispiel) und ${eur(STROM_BASE)} Grundpreis ergibt das ${txt(ST_YEAR, 'totalCost')} im Jahr. Achtung: Sommermonate liegen bei vielen Haushalten unter dem Jahresschnitt, weil weniger Licht brennt. Eine Hochrechnung aus April bis Oktober fällt deshalb eher zu niedrig aus – bei Wärmepumpe oder Nachtspeicherheizung sogar deutlich.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel kostet 1 Cent mehr pro Kilowattstunde im Jahr?',
        answer: `Genau Ihren Jahresverbrauch in Cent: Bei 2.500 kWh sind 36 statt 35 ct/kWh ${eur(ST_CENT_DIFF)} mehr pro Jahr, bei 4.000 kWh entsprechend 40 €. Der Grundpreis bleibt davon unberührt.`,
      },
      {
        question: 'Lohnt sich ein Stromtarif ohne Grundpreis?',
        answer: `Nur bei kleinem Verbrauch. Beispiel: Tarif A mit 35 ct/kWh und 12 € Grundpreis gegen Tarif B mit 40 ct/kWh ohne Grundpreis. Bei 1.500 kWh kostet A ${eur(ST_A(1500))} und B ${eur(ST_B(1500))}, bei 4.000 kWh kostet A ${eur(ST_A(4000))} und B ${eur(ST_B(4000))}. Gleich teuer sind beide bei ${kwhTxt(ST_BREAK_EVEN)} (144 € Grundpreis ÷ 5 ct Preisunterschied).`,
      },
      {
        question: 'Was kostet eine Kilowattstunde inklusive Grundpreis wirklich?',
        answer: `Teilen Sie die Jahreskosten durch den Verbrauch. Bei 35 ct/kWh Arbeitspreis und 12 € Grundpreis zahlt ein Haushalt mit 1.500 kWh effektiv ${formatNumber(ST_EFF(1500), 1)} ct je kWh, ein Haushalt mit 4.500 kWh nur ${formatNumber(ST_EFF(4500), 1)} ct, weil sich der Grundpreis auf mehr Kilowattstunden verteilt.`,
      },
    ],
  },

  'led-ersparnis-rechner': {
    sections: [
      {
        title: 'Ersparnis je Lampe bei 3 Stunden Licht am Tag',
        content:
          `Pro Lampe, 3 Stunden Brenndauer täglich, Strompreis 35 ct/kWh als Beispielwert. Die LED-Leistungen sind typische Beispiele; maßgeblich ist, dass die LED mindestens den Lumenwert der alten Lampe erreicht.\n\n${LED_SWAP_TABLE}\n\n` +
          `Die Ersparnis wächst linear mit der Wattdifferenz: Wer eine 100-Watt-Birne ersetzt, spart pro Stunde das ${formatNumber(LED_RATIO_100_60, 1)}-Fache dessen, was der Tausch einer 60-Watt-Birne bringt.`,
      },
      {
        title: 'Welche Lampen sich zuerst lohnen: die Brenndauer entscheidet',
        content:
          `Dieselbe 60-W-Glühlampe, ersetzt durch eine 8-W-LED, bei unterschiedlicher Nutzung (35 ct/kWh):\n\n${LED_HOURS_TABLE}\n\n` +
          'Tauschen Sie zuerst die Lampen, die abends stundenlang brennen – Wohnzimmer, Küche, Flur mit Dauerlicht. Die Lampe im Abstellraum bringt auch als LED kaum etwas. Tragen Sie im Rechner deshalb nicht alle Lampen mit derselben Brenndauer ein, sondern rechnen Sie Gruppen getrennt: oft genutzte und selten genutzte Leuchten.',
      },
    ],
    faqs: [
      {
        question: 'Lohnt sich der Tausch alter Energiesparlampen gegen LEDs?',
        answer: `Finanziell kaum. Eine Kompaktleuchtstofflampe mit z. B. 11 W gegen eine 8-W-LED spart bei 3 Stunden täglich nur ${txt(LED_CFL, 'kwhSaved')} und ${txt(LED_CFL, 'annualSaved')} im Jahr (35 ct/kWh). Sinnvoll ist der Tausch, wenn die alte Lampe defekt ist oder lange braucht, bis sie hell wird.`,
      },
      {
        question: 'Sind die Kosten für die neuen LED-Lampen eingerechnet?',
        answer: `Nein, der Rechner zeigt nur die Stromersparnis. Die Amortisation rechnen Sie selbst: Kaufpreis ÷ Ersparnis pro Jahr. Beispiel: Kostet eine LED ${eur0(LED_EXAMPLE_PRICE)} und ersetzt sie eine 60-W-Glühlampe mit 3 Stunden täglich, spart sie ${eur(LED_60_3H)} im Jahr und hat sich nach rund ${formatNumber(LED_PAYBACK_MONTHS, 0)} Monaten bezahlt gemacht.`,
      },
    ],
  },

  'waschmaschine-kosten-rechner': {
    sections: [
      {
        title: 'Kosten pro Waschgang nach Stromverbrauch und Strompreis',
        content:
          'Den Stromverbrauch Ihrer Maschine finden Sie auf dem Energielabel: Angegeben ist der Verbrauch für 100 Waschzyklen im Eco-40-60-Programm. Teilen Sie den Wert durch 100 – aus 52 kWh/100 Zyklen werden 0,52 kWh pro Waschgang. Kochwäsche und Kurzprogramme mit hoher Temperatur liegen darüber.\n\n' +
          `Gerechnet mit 50 Litern Wasser, 4,80 €/m³ Wasser und Abwasser und 0,22 € Waschmittel; die Strompreise sind Beispielwerte:\n\n${WM_TABLE}`,
      },
      {
        title: 'Halb volle Trommel: doppelte Kosten für dieselbe Wäsche',
        content:
          `Strom, Wasser und Waschmittel fallen pro Waschgang an, fast unabhängig davon, wie voll die Trommel ist. Wer dieselbe Wäschemenge statt in 4 vollen in 8 halb vollen Ladungen wäscht, zahlt mit den Werten oben (0,85 kWh, 35 ct/kWh) ${eur(WM_HALF)} statt ${eur(WM_FULL)} im Jahr. Viele Maschinen haben zwar eine Mengenautomatik, sparen bei halber Beladung aber nur einen Teil des Wassers und Stroms – im Rechner tragen Sie dann den geringeren Verbrauch pro Waschgang ein.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel spart eine sparsamere Waschmaschine pro Jahr?',
        answer: `Braucht das alte Gerät 1,0 kWh und das neue 0,5 kWh pro Waschgang, sind das bei 4 Wäschen pro Woche und 35 ct/kWh ${eur(WM_OLD_NEW)} weniger im Jahr. Ein Neukauf nur wegen des Stroms rechnet sich damit selten; wenn ohnehin ein Ersatz ansteht, lohnt der Blick aufs Label.`,
      },
      {
        question: 'Was kostet das Wäschewaschen im Jahr für Single und Familie?',
        answer: `Mit 0,85 kWh, 50 Litern, 0,22 € Waschmittel und 35 ct/kWh: bei 2 Wäschen pro Woche ${txt(WM_SINGLE, 'yearlyCost')}, bei 7 Wäschen pro Woche ${txt(WM_FAMILY, 'yearlyCost')} im Jahr.`,
      },
    ],
  },

  'trockner-kosten-rechner': {
    sections: [
      {
        title: 'Wärmepumpen- und Kondenstrockner bei 30, 35 und 40 ct/kWh',
        content:
          `3 Trocknungen pro Woche (156 im Jahr), Verbrauch laut Rechner 1,4 kWh (Wärmepumpe) bzw. 4,0 kWh (Kondens- oder Ablufttrockner). Die Strompreise sind Beispielwerte:\n\n${TR_TABLE}\n\n` +
          'Die Differenz wächst mit jedem Durchgang. Wer selten trocknet, spart mit einem Wärmepumpentrockner wenige Euro, wer täglich trocknet, ein Vielfaches.',
      },
      {
        title: 'Wann sich der Aufpreis eines Wärmepumpentrockners bezahlt macht',
        content:
          `Angenommen, der Wärmepumpentrockner kostet ${eur0(TR_SURCHARGE)} mehr als ein Kondenstrockner (Beispielwert – vergleichen Sie die tatsächlichen Preise). Bei 35 ct/kWh:\n\n${TR_PAYBACK}\n\n` +
          'So rechnen Sie selbst: Aufpreis ÷ „Ersparnis ggü. Kondenstrockner" aus dem Ergebnis. Tragen Sie dafür Ihre realistische Zahl an Trocknungen ein – im Sommer trocknet bei vielen Haushalten die Leine.',
      },
    ],
    faqs: [
      {
        question: 'Gilt das neue Energielabel auch für Wäschetrockner?',
        answer: 'Ja. Seit dem 1. Juli 2025 tragen neue Haushaltswäschetrockner nach der Verordnung (EU) 2023/2534 ein Label mit der Skala A bis G statt der früheren Klassen A+++ bis D. Ein Gerät mit altem „A+++" ist deshalb nicht direkt mit einem neuen „A" vergleichbar – vergleichen Sie den angegebenen Energieverbrauch.',
      },
      {
        question: 'Was kostet ein Wärmepumpentrockner im Monat?',
        answer: `Mit 1,4 kWh pro Durchgang und 35 ct/kWh: rund ${eur(TR_MONTH_3)} pro Monat bei 3 Trocknungen pro Woche und ${eur(TR_MONTH_5)} bei 5 Trocknungen pro Woche.`,
      },
    ],
  },

  'spuelmaschine-kosten-rechner': {
    sections: [
      {
        title: 'Jahreskosten nach Spülgängen und Strompreis',
        content:
          `Gerechnet mit 0,82 kWh, 10 Litern Wasser und 0,15 € für Tab und Klarspüler pro Spülgang; Wasser und Abwasser setzt der Rechner fest mit 4,80 €/m³ an. Die Strompreise sind Beispielwerte:\n\n${SP_TABLE}\n\n` +
          'Mehr als die Hälfte der Kosten pro Spülgang entfällt auf den Strom, das Wasser macht nur wenige Cent aus. Wer sparen will, setzt deshalb beim Programm an, nicht beim Wasser.',
      },
      {
        title: 'So lesen Sie den Vergleich mit dem Handabwasch',
        content:
          `Die Zeile „Ersparnis gegenüber Handabwasch" vergleicht Ihre Kosten pro Spülgang mit einem fest hinterlegten Pauschalwert von ${eur(SP_HAND_VALUE)} pro Ladung. Dieser Wert ändert sich nicht, wenn Sie einen anderen Strompreis eintragen.\n\n` +
          `- Mit den Werten oben (5 Spülgänge, 35 ct/kWh) zeigt der Rechner ${txt(SP_DEF, 'yearlySavingVsHand')} Ersparnis pro Jahr.\n` +
          `- Mit Intensivprogramm (1,3 kWh) und teurem Tab (0,30 €) sinkt sie auf ${txt(SP_INTENSIVE, 'yearlySavingVsHand')}.\n\n` +
          'Wie viel der Abwasch von Hand tatsächlich kostet, hängt stark davon ab, ob Sie unter fließendem Wasser oder im gefüllten Becken spülen. Der Vergleich ist deshalb eine grobe Orientierung, keine Messung.',
      },
    ],
    faqs: [
      {
        question: 'Wie viel machen die Spülmaschinentabs im Jahr aus?',
        answer: `Bei 5 Spülgängen pro Woche liegen zwischen einem Tab für 0,05 € und einem für 0,25 € ${eur(SP_TAB_DIFF)} im Jahr – oft mehr als der Unterschied zwischen zwei Strompreisen.`,
      },
      {
        question: 'Lohnt es sich, die Spülmaschine halb voll laufen zu lassen?',
        answer: `Nein, ein Spülgang kostet fast gleich viel, egal wie voll. Wer dasselbe Geschirr statt in 3 vollen in 6 halb vollen Ladungen pro Woche spült, zahlt mit den Werten oben ${eur(SP_HALF)} statt ${eur(SP_FULL)} im Jahr.`,
      },
      {
        question: 'Wo finde ich den Stromverbrauch meiner Spülmaschine?',
        answer: 'Auf dem Energielabel steht der Verbrauch für 100 Spülgänge im Eco-Programm. Teilen Sie ihn durch 100: Aus 75 kWh/100 Zyklen werden 0,75 kWh pro Spülgang. Für andere Programme nennt die Bedienungsanleitung meist eigene Verbrauchswerte.',
      },
    ],
  },

  'warmwasserkosten-rechner': {
    sections: [
      {
        title: 'Welche Leistung der Durchlauferhitzer beim Duschen wirklich braucht',
        content:
          'Der Rechner nimmt an, dass die eingetragene Leistung während der ganzen Dusche voll anliegt. Ein elektronischer Durchlauferhitzer zieht aber nur so viel Strom, wie nötig ist, um das durchfließende Wasser zu erwärmen. Die nötige Leistung ergibt sich aus Durchfluss × Temperaturerhöhung × 1,163 Wh je Liter und Kelvin.\n\n' +
          `Für eine Erwärmung von 10 °C auf 38 °C (${WW_DT} K) und 35 ct/kWh als Beispielpreis:\n\n${WW_FLOW_TABLE}\n\n` +
          'Tragen Sie deshalb nicht die Maximalleistung vom Typenschild ein, wenn Sie mit Sparbrause duschen, sondern die Leistung aus der Tabelle, die zu Ihrem Durchfluss passt. Den Durchfluss messen Sie mit einem Eimer und einer Stoppuhr.',
      },
      {
        title: 'Duschdauer: Jahreskosten für einen 3-Personen-Haushalt',
        content: `Jede Person duscht einmal täglich, ${formatNumber(WW_KW_9, 1)} kW Leistung (9 l/min). Die Strompreise sind Beispielwerte:\n\n${WW_DUR_TABLE}`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel kostet eine Minute Duschen mit dem Durchlauferhitzer?',
        answer: `Bei 9 Litern pro Minute und 28 K Erwärmung braucht der Durchlauferhitzer rund ${formatNumber(WW_KW_9, 1)} kW. Eine Minute kostet dann bei 35 ct/kWh ${txt(WW_MINUTE, 'costPerShower')}; jede Minute weniger pro Person und Tag spart im Jahr ${txt(WW_MINUTE, 'yearlyCost')}.`,
      },
      {
        question: 'Was kostet ein Vollbad, wenn das Wasser elektrisch erhitzt wird?',
        answer: `Für ${WW_BATH_L} Liter Badewasser von 10 °C auf 40 °C sind rechnerisch ${formatNumber(WW_BATH_KWH, 1)} kWh nötig (${WW_BATH_L} × 30 K × 1,163 Wh). Bei 35 ct/kWh sind das ${eur((WW_BATH_KWH * 35) / 100)} pro Bad, ohne Verluste in der Leitung.`,
      },
    ],
  },

  'pelletheizung-verbrauch-rechner': {
    sections: [
      {
        title: 'Vom bisherigen Heizölverbrauch auf Pellets umrechnen',
        content:
          'Der Rechner erwartet die Nutzwärme, also die Wärme, die tatsächlich im Haus ankommt. Ein Liter Heizöl enthält rund 10 kWh, der alte Ölkessel hat davon aber nur einen Teil als Wärme abgegeben. Für die Tabelle ist ein Nutzungsgrad von 85 % angenommen; bei einem sehr alten Kessel kann er niedriger liegen. Pelletpreis: Beispielwert, kein aktueller Marktpreis.\n\n' +
          `${PE_TABLE}\n\n` +
          `Wer stattdessen Liter × 10 direkt einträgt, rechnet die Verluste des alten Kessels doppelt: Bei 2.000 Litern ergeben sich dann ${formatNumber(PE_WRONG, 2)} statt ${formatNumber(PE_RIGHT, 2)} Tonnen Pellets.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viele 15-kg-Säcke Pellets braucht man im Jahr?',
        answer: `Bei 18.000 kWh Wärmebedarf rechnet der Rechner mit ${txt(PE_18, 'tonsNeeded')}, das sind ${formatNumber(PE_SACKS, 0)} Säcke à 15 kg. Sackware lohnt sich deshalb vor allem für kleine Heizlasten oder Pelletöfen; für ein Einfamilienhaus ist lose Ware per Silowagen üblicher.`,
      },
      {
        question: 'Wie viele Tonnen Pellets passen in mein Lager?',
        answer: `Der Rechner setzt rund ${formatNumber(PE_M3_PER_TON, 2)} m³ je Tonne an (Schüttdichte etwa 650 kg/m³). Ein Lager mit ${PE_STORE_M3} m³ reinem Pelletvolumen fasst also gut ${formatNumber(PE_STORE_M3 / PE_M3_PER_TON, 1)} Tonnen. Schrägböden und Leerräume abziehen – der Rauminhalt des Kellers ist nicht das nutzbare Volumen.`,
      },
    ],
  },

  'heizkostenvergleich-rechner': {
    sections: [
      {
        title: 'Ab welchem Strompreis die Wärmepumpe günstiger heizt als Gas',
        content:
          'Entscheidend sind die Kosten je Kilowattstunde Wärme: Bei der Wärmepumpe Strompreis ÷ JAZ, beim Gas-Brennwertkessel Gaspreis ÷ Nutzungsgrad (im Rechner 92 %). Die Preise 28 ct/kWh Strom und 11 ct/kWh Gas sind die Vorbelegung des Rechners und Beispielwerte, keine aktuellen Marktpreise.\n\n' +
          `${HK_JAZ_TABLE}\n\n` +
          'Die letzte Spalte zeigt, bis zu welchem Wärmepumpenstrompreis die Wärmepumpe bei 11 ct/kWh Gas noch gleichzieht. Eine schlechte JAZ im unsanierten Haus kann den Kostenvorteil also aufzehren, eine gute JAZ verträgt auch einen höheren Strompreis.',
      },
      {
        title: 'Gesamtkosten mit Wartung bei 12.000 und 25.000 kWh',
        content:
          `Mit eingeschalteter Option „Schornsteinfeger- & Wartungskosten" rechnet der Rechner feste Pauschalen pro Jahr dazu. Preise wie in der Vorbelegung (Beispielwerte):\n\n${HK_MAINT_TABLE}\n\n` +
          'Bei kleinem Wärmebedarf fallen die Pauschalen stärker ins Gewicht: Im gut gedämmten Haus können sie den Abstand zwischen den Systemen deutlich verschieben. Die Pauschalen sind Annahmen des Rechners; Ihre tatsächlichen Wartungs- und Schornsteinfegerkosten stehen auf den letzten Rechnungen.',
      },
    ],
    faqs: [
      {
        question: 'Welchen Wärmebedarf trage ich ein, wenn ich nur meine Gasrechnung habe?',
        answer: `Rechnen Sie den Gasverbrauch in kWh mit dem Nutzungsgrad des Rechners in Nutzwärme um: Aus ${kwhTxt(HK_GAS_BILL)} Gas werden ${kwhTxt(HK_FROM_BILL)} Nutzwärme (× ${formatNumber(HK_GAS_EFF, 2)}). Tragen Sie diesen Wert ein, ergibt die Gaszeile wieder Ihre bisherigen Gas-Arbeitskosten – und alle anderen Systeme sind auf derselben Basis vergleichbar.`,
      },
      {
        question: 'Warum hat die Pelletheizung im Vergleich so wenig CO₂?',
        answer: `Der Rechner zählt das CO₂ aus der Holzverbrennung nicht mit, weil es beim Wachsen der Bäume gebunden wurde, und erfasst nur die fossile Vorkette (Herstellung, Transport). Bei 18.000 kWh ergibt das ${hkEmission(HK_18, 'Pellet')} für Pellets gegenüber ${hkEmission(HK_18, 'Gas')} für Gas. Feinstaub und die Frage, wie nachhaltig das Holz gewonnen wurde, bildet die Zahl nicht ab.`,
      },
    ],
  },

  'waermepumpe-stromkosten-rechner': {
    sections: [
      {
        title: 'Stromverbrauch und Kosten nach Jahresarbeitszahl',
        content:
          `Jede Zelle zeigt Strombedarf · Jahreskosten bei 28 ct/kWh Wärmepumpenstrom (Beispielpreis, kein aktueller Tarif):\n\n${WP_TABLE}\n\n` +
          `Die JAZ wirkt stärker als viele erwarten: Von JAZ 2,5 auf 4,0 sinken die Stromkosten um ${formatNumber(WP_CUT_25_40, 1)} %. Niedrige Vorlauftemperaturen, großzügige Heizflächen und ein korrekt eingestellter Heizstab verbessern die JAZ – ein hoher Wärmebedarf allein lässt sich dagegen nur durch Dämmung senken.`,
      },
      {
        title: 'Die JAZ der eigenen Anlage nachrechnen',
        content:
          'Herstellerangaben und Prüfstandswerte (COP) liegen oft über dem, was eine Anlage im echten Betrieb schafft. So ermitteln Sie Ihre tatsächliche JAZ:\n\n' +
          '1. Zählerstände von Wärmemengenzähler und separatem Wärmepumpen-Stromzähler am selben Tag notieren.\n' +
          '2. Nach genau 12 Monaten erneut ablesen.\n' +
          `3. JAZ = abgegebene Wärme ÷ verbrauchter Strom, z. B. ${formatNumber(WP_HEAT_METER, 0)} kWh ÷ ${formatNumber(WP_POWER_METER, 0)} kWh = ${formatNumber(WP_OWN_JAZ, 2)}.\n\n` +
          `Mit diesen Werten zeigt der Rechner ${txt(WP_OWN, 'electricityKwh')} Strom und ${txt(WP_OWN, 'yearlyCost')} bei 28 ct/kWh. Läuft der Heizstab über denselben Zähler, steckt sein Verbrauch bereits in der JAZ – genau so soll es sein.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel kostet eine um 0,5 schlechtere Jahresarbeitszahl?',
        answer: `Bei 16.000 kWh Wärmebedarf und 28 ct/kWh kostet JAZ 3,0 statt 3,5 rund ${eur(WP_JAZ_DIFF)} mehr Strom pro Jahr.`,
      },
      {
        question: 'Lohnt sich ein eigener Wärmepumpentarif?',
        answer: `Der Arbeitspreis ist bei solchen Tarifen oft niedriger als beim Haushaltsstrom. Mit Beispielwerten (16.000 kWh Wärme, JAZ 3,5) spart ein Tarif mit 28 statt 36 ct/kWh ${eur(WP_TARIFF_DIFF)} im Jahr. Davon gehen ein eventueller zweiter Grundpreis und die Kosten für einen separaten Zähler ab, die der Rechner nicht enthält.`,
      },
    ],
  },

  'balkonkraftwerk-ertrag-rechner': {
    sections: [
      {
        title: 'Ersparnis einer 800-Wp-Anlage nach Eigenverbrauch und Strompreis',
        content:
          `Rechnerischer Ertrag bei 800 Wp: ${kwhTxt(BK_GEN_800)} pro Jahr. Anschaffung ${eur0(BK_COST)} (Beispielwert); in Klammern die Amortisationszeit. Die Strompreise sind Beispielwerte:\n\n${BK_TABLE}\n\n` +
          'Den größten Hebel haben Sie beim Eigenverbrauch: Geräte wie Waschmaschine oder Spülmaschine tagsüber laufen lassen erhöht den Anteil, der Ihre Stromrechnung tatsächlich senkt.\n\n' +
          '**Grenze des Rechners:** Er rechnet die Modulleistung linear hoch. Bei mehr als 800 Wp Modulfläche begrenzt der 800-W-Wechselrichter die Mittagsspitzen; der zusätzliche Ertrag entsteht dann vor allem morgens, abends und bei Bewölkung. Für große Modulfelder fällt das Ergebnis deshalb etwas zu hoch aus.',
      },
    ],
    faqs: [
      {
        question: 'Wie viel Modulleistung darf ein Balkonkraftwerk haben?',
        answer: 'Für die vereinfachte Registrierung als Steckersolargerät im Marktstammdatenregister gelten bis zu 2.000 W installierte Modulleistung und höchstens 800 W (800 VA) Wechselrichterleistung. Darüber wird die Anlage wie eine normale Solaranlage registriert.',
      },
      {
        question: 'Bekomme ich Geld für den Strom, den ich nicht selbst verbrauche?',
        answer: `Im Normalfall nicht. Mit den Vorgabewerten (850 Wp, 75 % Eigenverbrauch) fließen rund ${kwhTxt(BK_SURPLUS)} im Jahr unvergütet ins Netz; der Rechner setzt diesen Anteil mit 0 € an. Seit dem Solarpaket I entfällt die Meldung beim Netzbetreiber nur, wenn keine Einspeisevergütung beansprucht wird.`,
      },
    ],
  },

  'photovoltaik-amortisation-rechner': {
    sections: [
      {
        title: 'Was der Eigenverbrauch bei einer 10-kWp-Anlage ausmacht',
        content:
          `10 kWp für 15.500 €, 4.500 kWh Haushaltsverbrauch, 36 ct/kWh Netzstrom (Beispielpreis) und ${ctLabel(PV_BASE.feedInTariffCent)} Einspeisevergütung:\n\n${PV_TABLE}\n\n` +
          `Jede selbst verbrauchte Kilowattstunde ist in diesem Beispiel ${formatNumber(PV_GAP_CT, 1)} ct mehr wert als eine eingespeiste. Deshalb verkürzen Speicher, Wärmepumpe oder E-Auto die Amortisation – vorausgesetzt, ihre eigenen Kosten werden in die Investition eingerechnet.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel Mehrnutzen bringt ein Batteriespeicher pro Jahr?',
        answer: `Steigt der Eigenverbrauch durch einen Speicher z. B. von 30 % auf 60 % (Beispielwerte), bringt die Anlage oben ${eur(PV_STORAGE_GAIN)} mehr pro Jahr. Diesen Betrag multipliziert mit der erwarteten Nutzungsdauer des Speichers sollten Sie mit seinem Preis vergleichen.`,
      },
      {
        question: 'Muss ich die Einspeisevergütung versteuern?',
        answer: 'Für viele private Anlagen nicht: Nach § 3 Nr. 72 EStG sind Einnahmen aus Photovoltaikanlagen auf, an oder in Gebäuden bis 30 kW (peak) je Wohn- oder Gewerbeeinheit steuerfrei, höchstens 100 kW (peak) je Steuerpflichtigem.',
      },
      {
        question: 'Was ist der Unterschied zwischen Eigenverbrauchsquote und Autarkiegrad?',
        answer: `Die Eigenverbrauchsquote sagt, welcher Anteil des Solarstroms im Haus bleibt; der Autarkiegrad, welcher Anteil Ihres Strombedarfs aus der Anlage kommt. Bei 35 % Eigenverbrauch der 10-kWp-Anlage sind das ${formatNumber(num(PV_35, 'savedGridCost') / 0.36, 0)} kWh – bei 4.500 kWh Bedarf ein Autarkiegrad von ${txt(PV_35, 'autarkyPct')}.`,
      },
    ],
  },

  'energieeffizienzklasse-rechner': {
    sections: [
      {
        title: 'Kennwert aus dem eigenen Verbrauch überschlagen',
        content:
          `Kennwert = Endenergie pro Jahr ÷ Gebäudenutzfläche. Beispiel für ein Haus mit ${EK_AREA} m² Gebäudenutzfläche:\n\n${EK_TABLE}\n\n` +
          'Das ist nur eine Überschlagsrechnung. Ein Verbrauchsausweis nutzt die Werte mehrerer Jahre und bereinigt sie um die Witterung, ein Bedarfsausweis berechnet den Wert aus Bauteilen und Anlagentechnik. Wichtig ist die richtige Fläche: Die Gebäudenutzfläche ist meist größer als die Wohnfläche – wer durch die Wohnfläche teilt, landet zu schlecht.',
      },
    ],
    faqs: [
      {
        question: 'Liegt ein Kennwert von genau 130 kWh/(m²·a) in Klasse D oder E?',
        answer: `In Klasse D. Nach Anlage 10 des Gebäudemodernisierungsgesetzes gilt jede Klasse bis einschließlich ihres Grenzwerts: 130 kWh/(m²·a) ergibt ${EK_130}, schon 130,5 kWh/(m²·a) ergibt ${EK_131}.`,
      },
      {
        question: 'Ist die Effizienzklasse des Hauses dasselbe wie das Energielabel auf Geräten?',
        answer: 'Nein. Die Gebäudeklassen A+ bis H stehen im Energieausweis und beziehen sich auf den Endenergiekennwert pro Quadratmeter. Das EU-Energielabel für Kühlgeräte, Waschmaschinen, Geschirrspüler und Fernseher nutzt seit März 2021 eine eigene Skala von A bis G; Lampen folgten im September 2021.',
      },
      {
        question: 'Warum zeigen Bedarfs- und Verbrauchsausweis für dasselbe Haus unterschiedliche Klassen?',
        answer: 'Der Bedarfsausweis rechnet mit Normbedingungen, unabhängig davon, wer im Haus wohnt. Der Verbrauchsausweis beruht auf tatsächlich abgerechneten Mengen – sparsames oder großzügiges Heizen der Bewohner verschiebt den Wert deshalb nach oben oder unten.',
      },
    ],
  },

  'lebensmittelbudget-rechner': {
    sections: [
      {
        title: 'Rechner-Werte im Vergleich zu den Ausgaben laut Statistischem Bundesamt',
        content:
          `Monatsbudget laut Rechner für drei Einkaufsstile, daneben die durchschnittlichen Ausgaben für Nahrungsmittel, Getränke und Tabakwaren nach den Laufenden Wirtschaftsrechnungen (LWR) 2024 von Destatis für Haushalte mit derselben Personenzahl:\n\n${LB_TABLE}\n\n` +
          '**So lesen Sie den Vergleich:** Die Destatis-Werte sind Durchschnitte über alle Haushalte dieser Größe, egal ob mit Kindern oder nur Erwachsenen, und enthalten auch alkoholische Getränke und Tabak. Restaurant- und Kantinenessen ist nicht enthalten. Wer oft auswärts isst, gibt im Supermarkt weniger aus und kann mit einem niedrigeren Satz planen.',
      },
    ],
    faqs: [
      {
        question: 'Wie viel kostet Essen pro Person und Tag?',
        answer: `Für 2 Erwachsene ergibt der Rechner im Stil „ausgewogen" ${txt(LB_2_STD, 'daily')} pro Tag, also ${eur(num(LB_2_STD, 'daily') / 2)} je Person; im Stil „sehr sparsam" ${eur(num(LB_2_THRIFTY, 'daily') / 2)} je Person. Der Rechner verteilt das Monatsbudget dabei auf 30 Tage.`,
      },
      {
        question: 'Wie teile ich das Monatsbudget auf die Wocheneinkäufe auf?',
        answer: `Der Wochenwert im Ergebnis ist Monatsbudget × 12 ÷ 52. Bei ${txt(LB_FAMILY, 'totalMonth')} für 2 Erwachsene und 1 Kind sind das ${eur(LB_FAMILY_WEEK)} pro Woche. Monate mit fünf Einkaufswochen brauchen dann ${eur(LB_FAMILY_WEEK * 5)}, Monate mit vier nur ${eur(LB_FAMILY_WEEK * 4)} – legen Sie den Rest aus kurzen Monaten für die langen zurück.`,
      },
    ],
  },

  'gasverbrauch-kwh-m3-rechner': {
    sections: [
      {
        title: 'Dieselben 1.200 m³, unterschiedliche Kilowattstunden',
        content:
          `Wie viel Energie in einem Kubikmeter steckt, hängt vom Netzgebiet ab. Gerechnet mit ${formatNumber(GV_PRICE, 0)} ct/kWh als Beispielpreis:\n\n${GV_TABLE}\n\n` +
          `Zwischen dem niedrigsten und dem höchsten Fall liegen ${kwhTxt(GV_MAX - GV_MIN)}, obwohl der Zähler exakt dasselbe Volumen zeigt. Deshalb rechnen Versorger in kWh ab und nicht in m³. Vergleichen Sie Ihren Verbrauch mit Nachbarn oder früheren Wohnungen immer in kWh, sonst vergleichen Sie unterschiedliche Gasqualitäten.`,
      },
      {
        title: 'Zählerstand ablesen und mit der Abrechnung vergleichen',
        content:
          '1. **Zählerstand notieren:** Beim üblichen Balgengaszähler zählen nur die Ziffern vor dem Komma (meist schwarz). Die Stellen dahinter (meist rot) sind Bruchteile eines Kubikmeters.\n' +
          '2. **Zählernummer prüfen:** Sie muss mit der Nummer auf der Rechnung übereinstimmen, sonst wird womöglich der Zähler einer anderen Wohnung abgerechnet.\n' +
          `3. **Differenz bilden:** Von 4.815 auf 5.962 m³ sind es ${formatNumber(num(GV_READ, 'consumedM3'), 0)} m³. Mit Brennwert 10,8 und Zustandszahl 0,95 aus der Rechnung ergibt das ${txt(GV_READ, 'kwh')}.\n` +
          '4. **Mit der Rechnung vergleichen:** Kleine Abweichungen entstehen, weil der Netzbetreiber einen über den Zeitraum gemittelten Abrechnungsbrennwert ansetzt. Große Unterschiede deuten auf einen geschätzten Zählerstand oder einen Ablesefehler hin.\n\n' +
          `Umgekehrt lässt sich ein Ziel in Zählerstände übersetzen: Wer im Jahr höchstens ${kwhTxt(GV_PLAN_KWH)} verbrauchen will, darf bei ${formatNumber(GV_KWH_PER_M3, 2)} kWh je m³ rund ${formatNumber(GV_PLAN_M3, 0)} m³ verbrauchen. Notieren Sie den Zählerstand monatlich, dann sehen Sie früh, ob der Winter das Budget sprengt.`,
      },
    ],
    faqs: [
      {
        question: 'Was ist der Unterschied zwischen Brennwert und Heizwert beim Gas?',
        answer: `Der Brennwert (Hs) enthält auch die Wärme, die beim Kondensieren des Wasserdampfs im Abgas frei wird, der Heizwert (Hi) nicht. Bei Erdgas ist der Brennwert rund ${formatNumber((GV_HS_HI - 1) * 100, 0)} % höher. Abgerechnet wird nach Brennwert. Wirkungsgrade von Heizkesseln werden dagegen oft auf den Heizwert bezogen, deshalb stehen in Datenblättern von Brennwertkesseln Werte über 100 %.`,
      },
      {
        question: 'Warum weicht meine eigene Umrechnung von den kWh auf der Gasrechnung ab?',
        answer: 'Meist aus einem von drei Gründen: Der Versorger hat einen Zählerstand geschätzt statt abgelesen, der Abrechnungszeitraum beginnt oder endet an einem anderen Tag als Ihre Ablesung, oder der Brennwert hat sich während des Zeitraums geändert und wird anteilig gewichtet. Prüfen Sie die Ablesedaten auf der Rechnung und rechnen Sie mit genau diesen Zählerständen und Faktoren nach.',
      },
    ],
  },
};
