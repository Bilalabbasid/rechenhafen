import { CalculationResult } from '@/types/calculator';
import { formatNumber } from '@/lib/formatters';
import { EXTRA_EINHEITEN_KOCHEN } from '../extra/einheitenKochen';
import { PageContentMap } from './types';

// ---------------------------------------------------------------------------
// Alle Zahlen in Tabellen und Antworten kommen aus der calculate-Funktion des
// jeweiligen Rechners (einheitenKochen.ts) und werden beim Laden berechnet.
// ---------------------------------------------------------------------------

type Engine = (inputs: Record<string, any>) => CalculationResult;

function engine(slug: string): Engine {
  const def = EXTRA_EINHEITEN_KOCHEN.find((c) => c.slug === slug);
  if (!def) throw new Error(`page-content/einheiten: Rechner "${slug}" nicht gefunden`);
  return (inputs) => def.calculate(inputs);
}

/** Numeric value of a secondary result by id. */
function val(r: CalculationResult, id: string): number {
  if (r.primary.id === id) return Number(r.primary.value);
  const item = r.secondary?.find((s) => s.id === id);
  if (!item) throw new Error(`page-content/einheiten: Ergebnis "${id}" fehlt`);
  return Number(item.value);
}

/** Formatted (display) value of a secondary result by id. */
function shown(r: CalculationResult, id: string): string {
  if (r.primary.id === id) return String(r.primary.formattedValue ?? r.primary.value);
  const item = r.secondary?.find((s) => s.id === id);
  if (!item) throw new Error(`page-content/einheiten: Ergebnis "${id}" fehlt`);
  return String(item.formattedValue ?? item.value);
}

const n = (v: number, digits = 2) => formatNumber(v, digits);

function table(head: string[], rows: string[][]): string {
  return [
    `| ${head.join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...rows.map((r) => `| ${r.join(' | ')} |`),
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Volumen
// ---------------------------------------------------------------------------
const volumen = engine('volumen-umrechner');
const volRows: Array<[string, number, string]> = [
  ['Schnapsglas (2 cl)', 0.02, 'l'],
  ['Getränkedose', 0.33, 'l'],
  ['Gießkanne', 10, 'l'],
  ['Stahlfass', 200, 'l'],
  ['IBC-Container', 1000, 'l'],
  ['Wasserzähler-Anzeige', 1, 'm3'],
];
const volTable = table(
  ['Behälter / Menge', 'Liter', 'Milliliter = cm³', 'Kubikmeter'],
  volRows.map(([label, v, unit]) => {
    const r = volumen({ inputValue: v, inputUnit: unit });
    return [label, n(val(r, 'liters'), 3), n(val(r, 'ml'), 0), n(val(r, 'm3'), 5)];
  })
);
const volWater = volumen({ inputValue: 45, inputUnit: 'm3' });
const volHubraum = volumen({ inputValue: 1598, inputUnit: 'ml' });
const volUkGal = volumen({ inputValue: 1, inputUnit: 'ukgal' });
const volPool = volumen({ inputValue: 4 * 3 * 1.2, inputUnit: 'm3' });
const volCan = volumen({ inputValue: 12, inputUnit: 'floz' });

// ---------------------------------------------------------------------------
// Energie
// ---------------------------------------------------------------------------
const energie = engine('energie-arbeit-umrechner');
const enRows: Array<[string, number, string]> = [
  ['1 kWh', 1, 'kwh'],
  ['10 kWh', 10, 'kwh'],
  ['100 kWh', 100, 'kwh'],
  ['1.000 kWh', 1000, 'kwh'],
  ['1 MJ', 1, 'mj'],
  ['1.000 kcal', 1000, 'kcal'],
  ['10.000 BTU', 10000, 'btu'],
];
const enTable = table(
  ['Ausgangswert', 'kWh', 'MJ', 'kcal', 'BTU'],
  enRows.map(([label, v, unit]) => {
    const r = energie({ inputValue: v, inputUnit: unit });
    return [label, n(val(r, 'kwh'), 3), n(val(r, 'mj'), 2), n(val(r, 'kcal'), 0), n(val(r, 'btu'), 0)];
  })
);
const enHeater = energie({ inputValue: 2 * 3, inputUnit: 'kwh' });
const enAc9000 = energie({ inputValue: 9000, inputUnit: 'btu' });
const enAc12000 = energie({ inputValue: 12000, inputUnit: 'btu' });
const enGasKwh = 1000 * 0.95 * 11;
const enGas = energie({ inputValue: enGasKwh, inputUnit: 'kwh' });
const enMj = energie({ inputValue: 1, inputUnit: 'mj' });
const enKwh = energie({ inputValue: 1, inputUnit: 'kwh' });

// ---------------------------------------------------------------------------
// Fläche
// ---------------------------------------------------------------------------
const flaeche = engine('flaeche-umrechner');
const flRows: Array<[string, number, string]> = [
  ['100 m²', 100, 'm2'],
  ['500 m²', 500, 'm2'],
  ['1.000 m²', 1000, 'm2'],
  ['1 Hektar', 1, 'ha'],
  ['1 Acre', 1, 'acre'],
  ['1.000 sq ft', 1000, 'sqft'],
  ['1 km²', 1, 'km2'],
];
const flTable = table(
  ['Fläche', 'm²', 'Ar', 'Hektar', 'Acres'],
  flRows.map(([label, v, unit]) => {
    const r = flaeche({ inputValue: v, inputUnit: unit });
    return [label, n(val(r, 'm2'), 2), n(val(r, 'a'), 2), n(val(r, 'ha'), 4), n(val(r, 'acre'), 3)];
  })
);
const flSqft1500 = flaeche({ inputValue: 1500, inputUnit: 'sqft' });
const flSqft1000 = flaeche({ inputValue: 1000, inputUnit: 'sqft' });
const flHa = flaeche({ inputValue: 1, inputUnit: 'ha' });
const flKm2 = flaeche({ inputValue: 1, inputUnit: 'km2' });

// ---------------------------------------------------------------------------
// Strahlendosis
// ---------------------------------------------------------------------------
const strahlung = engine('radioaktivitaet-strahlendosis-rechner');
const HOURS_PER_YEAR = 24 * 365;
const doseRates = [0.05, 0.1, 0.15, 0.2, 0.5, 1];
const doseTable = table(
  ['Anzeige Messgerät', 'pro Tag', 'pro Jahr (8.760 h)', 'Jahresdosis in mSv'],
  doseRates.map((rate) => {
    const day = strahlung({ inputValue: rate * 24, inputUnit: 'usv' });
    const year = strahlung({ inputValue: rate * HOURS_PER_YEAR, inputUnit: 'usv' });
    return [`${n(rate, 2)} µSv/h`, `${n(val(day, 'usv'), 1)} µSv`, `${n(val(year, 'usv'), 0)} µSv`, n(val(year, 'msv'), 2)];
  })
);
const doseMrem = strahlung({ inputValue: 0.1, inputUnit: 'rem' });
const doseOneMrem = strahlung({ inputValue: 0.001, inputUnit: 'rem' });
const dose015 = strahlung({ inputValue: 0.15 * HOURS_PER_YEAR, inputUnit: 'usv' });
const doseLimit = strahlung({ inputValue: 1, inputUnit: 'msv' });

// ---------------------------------------------------------------------------
// Druck
// ---------------------------------------------------------------------------
const druck = engine('druck-umrechner');
const tyreBar = [1.8, 2.0, 2.2, 2.4, 2.5, 2.7, 3.0, 3.5, 4.5, 6.0, 8.0];
const druckTable = table(
  ['bar (Überdruck)', 'PSI', 'kPa'],
  tyreBar.map((b) => {
    const r = druck({ inputValue: b, inputUnit: 'bar' });
    return [n(b, 1), n(val(r, 'psi'), 1), n(val(r, 'hpa') / 10, 0)];
  })
);
const psiList = [30, 35, 40, 50, 65, 100]
  .map((p) => `- ${p} PSI = ${n(druck({ inputValue: p, inputUnit: 'psi' }).primary.value as number, 2)} bar`)
  .join('\n');
const druck25 = druck({ inputValue: 2.5, inputUnit: 'bar' });
const druckAtm = druck({ inputValue: 1013.25, inputUnit: 'hpa' });
const druckWetter = druck({ inputValue: 1013, inputUnit: 'hpa' });
const druckAbs = 2.5 + Number(druckAtm.primary.value);

// ---------------------------------------------------------------------------
// Drehzahl / Umfangsgeschwindigkeit
// ---------------------------------------------------------------------------
const drehzahl = engine('drehzahl-umfangsgeschwindigkeit-rechner');
const DISC_LIMIT_MS = 80;
const rpmFor = (dMm: number, targetMs: number) => targetMs / val(drehzahl({ diameterMm: dMm, rpm: 1 }), 'vms');
const toolRows: Array<[string, number, number]> = [
  ['Trennscheibe 115 mm', 115, 11000],
  ['Trennscheibe 150 mm', 150, 9000],
  ['Trennscheibe 180 mm', 180, 8000],
  ['Kreissägeblatt 190 mm', 190, 5000],
  ['Kreissägeblatt 254 mm', 254, 4000],
  ['Fahrradlaufrad 700 mm', 700, 300],
];
const toolTable = table(
  ['Teil', 'Drehzahl', 'm/s am Rand', 'km/h am Rand', 'Grenze bei 80 m/s'],
  toolRows.map(([label, d, rpm]) => {
    const r = drehzahl({ diameterMm: d, rpm });
    const limit = label.startsWith('Trennscheibe') ? `${n(rpmFor(d, DISC_LIMIT_MS), 0)} U/min` : '–';
    return [label, `${n(rpm, 0)} U/min`, n(val(r, 'vms'), 1), n(val(r, 'vkmh'), 0), limit];
  })
);
const wrongDisc = drehzahl({ diameterMm: 230, rpm: 11000 });
const bikeRpm25 = 25 / val(drehzahl({ diameterMm: 700, rpm: 1 }), 'vkmh');
const small230 = drehzahl({ diameterMm: 115, rpm: 6600 });
const big230 = drehzahl({ diameterMm: 230, rpm: 6600 });

// ---------------------------------------------------------------------------
// Dezibel
// ---------------------------------------------------------------------------
const dezibel = engine('dezibel-schalldruck-umrechner');
const ref60 = val(dezibel({ dbValue: 60 }), 'perceived');
const dbTable = table(
  ['Pegel', 'Schalldruck', 'empfunden ggü. 60 dB', 'Schallenergie ggü. 60 dB'],
  [30, 40, 50, 60, 70, 80, 85, 90, 100, 110, 120].map((db) => {
    const r = dezibel({ dbValue: db });
    const perceived = val(r, 'perceived') / ref60;
    const energy = val(r, 'energy') / val(dezibel({ dbValue: 60 }), 'energy');
    return [
      `${db} dB`,
      `${n(val(r, 'pressure'), val(r, 'pressure') < 0.01 ? 5 : 3)} Pa`,
      perceived < 1 ? `${n(perceived, 3)}-fach` : `${n(perceived, 0)}-fach`,
      energy < 1 ? `${n(energy, 4)}-fach` : `${n(energy, 0)}-fach`,
    ];
  })
);
const db94 = dezibel({ dbValue: 94 });
const distRatio = val(dezibel({ dbValue: 74 }), 'pressure') / val(dezibel({ dbValue: 80 }), 'pressure');
const sum60plus50 = 10 * Math.log10(Math.pow(10, 6) + Math.pow(10, 5));

// ---------------------------------------------------------------------------
// Schuhgrößen (nur die Näherungsformeln des Rechners)
// ---------------------------------------------------------------------------
const schuhe = engine('schuhe-kleidergroessen-umrechner');
const shoeTable = table(
  ['EU', 'UK', 'US Herren', 'US Damen', 'Fußlänge'],
  [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47].map((eu) => {
    const men = schuhe({ euSize: eu, gender: 'men' });
    const women = schuhe({ euSize: eu, gender: 'women' });
    return [String(eu), n(val(men, 'ukSize'), 1), n(val(men, 'usSize'), 1), n(val(women, 'usSize'), 1), `${n(val(men, 'footCm'), 1)} cm`];
  })
);
/** Smallest EU size (0,5 steps) whose foot length from the engine reaches the measured length. */
function euForFoot(cm: number): number {
  for (let eu = 20; eu <= 52; eu += 0.5) {
    if (val(schuhe({ euSize: eu, gender: 'men' }), 'footCm') >= cm - 1e-9) return eu;
  }
  return NaN;
}
/** EU size (0,5 steps) at which the engine returns the given US size. */
function euForUs(us: number, gender: 'men' | 'women'): number {
  for (let eu = 20; eu <= 52; eu += 0.5) {
    if (Math.abs(Number(schuhe({ euSize: eu, gender }).primary.value) - us) < 1e-9) return eu;
  }
  return NaN;
}
const eu265 = euForFoot(26.5);
const eu245 = euForFoot(24.5);
const euUs8Men = euForUs(8, 'men');
const euUs8Women = euForUs(8, 'women');

// ---------------------------------------------------------------------------
// Datenrate / Downloadzeit
// ---------------------------------------------------------------------------
const download = engine('datenrate-bandbreite-umrechner');
const speeds = ['16', '50', '100', '250', '1000'];
const dlTable = table(
  ['Datei', 'DSL 16', 'VDSL 50', '100 Mbit/s', '250 Mbit/s', '1 Gbit/s'],
  [
    ['Update 5 GB', 5],
    ['Film 20 GB', 20],
    ['Spiel 50 GB', 50],
    ['Spiel 150 GB', 150],
  ].map(([label, gb]) => [
    String(label),
    ...speeds.map((s) => shown(download({ fileSizeGb: gb, bandwidthMbits: s, overheadLoss: 10 }), 'duration')),
  ])
);
const dlGig = download({ fileSizeGb: 1, bandwidthMbits: '1000', overheadLoss: 10 });
const dlGigRaw = download({ fileSizeGb: 1, bandwidthMbits: '1000', overheadLoss: 0 });
const dlSpeedtest = download({ fileSizeGb: 1, bandwidthMbits: '92', overheadLoss: 0 });
const dlBackup = download({ fileSizeGb: 1000, bandwidthMbits: '40', overheadLoss: 10 });
const dlBackupFast = download({ fileSizeGb: 1000, bandwidthMbits: '1000', overheadLoss: 10 });
const dlExample = download({ fileSizeGb: 100, bandwidthMbits: '1000', overheadLoss: 10 });

// ---------------------------------------------------------------------------
// Leistung
// ---------------------------------------------------------------------------
const leistung = engine('leistung-umrechner');
const psTable = table(
  ['PS', 'kW', 'hp', 'Watt'],
  [60, 75, 90, 110, 150, 190, 250, 300, 500].map((ps) => {
    const r = leistung({ inputValue: ps, inputUnit: 'ps' });
    return [n(ps, 0), n(val(r, 'kw'), 1), n(val(r, 'hp'), 1), n(val(r, 'watt'), 0)];
  })
);
const kwList = [51, 66, 85, 110, 147, 210]
  .map((kw) => `- ${kw} kW = ${n(val(leistung({ inputValue: kw, inputUnit: 'kw' }), 'ps'), 1)} PS`)
  .join('\n');
const hp300 = leistung({ inputValue: 300, inputUnit: 'hp' });
const hp100 = leistung({ inputValue: 100, inputUnit: 'hp' });
const kw100 = leistung({ inputValue: 100, inputUnit: 'kw' });
const watt2000 = leistung({ inputValue: 2000, inputUnit: 'w' });

// ---------------------------------------------------------------------------
// Drehmoment
// ---------------------------------------------------------------------------
const drehmoment = engine('drehmoment-umrechner');
const nmTable = table(
  ['Nm', 'ft-lb', 'in-lb', 'kpm'],
  [5, 10, 25, 50, 90, 110, 140, 200].map((nm) => {
    const r = drehmoment({ inputValue: nm, inputUnit: 'nm' });
    return [n(nm, 0), n(val(r, 'ftlb'), 1), n(val(r, 'inlb'), 0), n(val(r, 'kpm'), 2)];
  })
);
const ftlbList = [20, 50, 80, 100, 150]
  .map((f) => `- ${f} ft-lb = ${n(drehmoment({ inputValue: f, inputUnit: 'ftlb' }).primary.value as number, 1)} Nm`)
  .join('\n');
const inlb100 = drehmoment({ inputValue: 100, inputUnit: 'inlb' });
const ftlb100 = drehmoment({ inputValue: 100, inputUnit: 'ftlb' });
const kpm12 = drehmoment({ inputValue: 12, inputUnit: 'kpm' });
const ftlb80 = drehmoment({ inputValue: 80, inputUnit: 'ftlb' });
// Verlängerung in Schlüsselachse: M_Schraube = M_eingestellt × (L + E) / L
const EXT_L = 0.4;
const EXT_E = 0.1;
const extSet = 100;
const extReal = (extSet * (EXT_L + EXT_E)) / EXT_L;
const extFix = (extSet * EXT_L) / (EXT_L + EXT_E);

// ---------------------------------------------------------------------------
// Dichte
// ---------------------------------------------------------------------------
const dichte = engine('dichte-umrechner');
const matRows: Array<[string, number]> = [
  ['Benzin (etwa)', 0.74],
  ['Diesel (etwa)', 0.83],
  ['Wasser (4 °C)', 1.0],
  ['Beton (etwa)', 2.4],
  ['Aluminium', 2.7],
  ['Kupfer', 8.96],
];
const matTable = table(
  ['Stoff', 'g/cm³ = kg/l', 'kg/m³', 'lb/ft³'],
  matRows.map(([label, g]) => {
    const r = dichte({ inputValue: g, inputUnit: 'gcm3' });
    return [label, n(val(r, 'gcm3'), 2), n(val(r, 'kgm3'), 0), n(val(r, 'lbcuft'), 1)];
  })
);
const dieselTank = 50 * val(dichte({ inputValue: 0.83, inputUnit: 'gcm3' }), 'gcm3');
const betonM3 = val(dichte({ inputValue: 2.4, inputUnit: 'gcm3' }), 'kgm3');
const lbcuft2 = dichte({ inputValue: 2, inputUnit: 'lbcuft' });
const lbcuft150 = dichte({ inputValue: 150, inputUnit: 'lbcuft' });

// ---------------------------------------------------------------------------
// Viskosität
// ---------------------------------------------------------------------------
const viskositaet = engine('viskositaet-umrechner');
const oilRows: Array<[string, number, number]> = [
  ['Wasser, 20 °C', 1.004, 0.998],
  ['Hydrauliköl ISO VG 32, 40 °C', 32, 0.87],
  ['Hydrauliköl ISO VG 46, 40 °C', 46, 0.87],
  ['Getriebeöl ISO VG 220, 40 °C', 220, 0.89],
];
const oilTable = table(
  ['Flüssigkeit', 'kinematisch (mm²/s = cSt)', 'Dichte angenommen', 'dynamisch (mPa·s = cP)', 'Pa·s'],
  oilRows.map(([label, nu, rho]) => {
    const r = viskositaet({ inputValue: nu * rho, inputUnit: 'mpas' });
    return [label, n(nu, 1), `${n(rho, 3)} g/cm³`, n(val(r, 'mpas'), 1), n(val(r, 'pas'), 4)];
  })
);
const cst100 = viskositaet({ inputValue: 100 * 0.9, inputUnit: 'cp' });
const poise15 = viskositaet({ inputValue: 15, inputUnit: 'poise' });

// ---------------------------------------------------------------------------
// Datenspeicher
// ---------------------------------------------------------------------------
const speicher = engine('daten-speicher-umrechner');
const capRows: Array<[string, number, string]> = [
  ['64 GB', 64, 'gb'],
  ['128 GB', 128, 'gb'],
  ['256 GB', 256, 'gb'],
  ['512 GB', 512, 'gb'],
  ['2 TB', 2, 'tb'],
  ['4 TB', 4, 'tb'],
  ['8 TB', 8, 'tb'],
];
const capTable = table(
  ['Angabe auf der Packung', 'Byte', 'Anzeige Windows', 'Differenz'],
  capRows.map(([label, v, unit]) => {
    const r = speicher({ inputValue: v, inputUnit: unit });
    const gib = val(r, 'gib');
    const shownWin = gib >= 1024 ? `${n(gib / 1024, 2)} TB (${n(gib, 1)} GB)` : `${n(gib, 1)} GB`;
    // Windows zeigt ab 1.024 GiB in „TB“ (eigentlich TiB) an, der Abstand wächst dann auf gut 9 %
    const loss = unit === 'tb' ? 1 - gib / 1024 / val(r, 'tb') : 1 - gib / val(r, 'gb');
    return [label, n(val(r, 'gb') * 1e9, 0), shownWin, `${n(loss * 100, 1)} %`];
  })
);
const cap2tb = speicher({ inputValue: 2, inputUnit: 'tb' });
const ram16 = speicher({ inputValue: 16, inputUnit: 'gib' });

// ---------------------------------------------------------------------------
// Papierformat
// ---------------------------------------------------------------------------
const papier = engine('papierformat-din-rechner');
const formats = ['a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7'];
const paperTable = table(
  ['Format', 'Maße', 'Fläche', '1 Blatt 80 g/m²', '1 Blatt 120 g/m²'],
  formats.map((f) => {
    const r80 = papier({ dinFormat: f, grammage: 80, sheetCount: 1 });
    const r120 = papier({ dinFormat: f, grammage: 120, sheetCount: 1 });
    return [
      f.toUpperCase(),
      String(r80.primary.formattedValue).replace(/ \(.*\)$/, '').replace(/\d{4,}/g, (d) => n(Number(d), 0)),
      `${n(val(r80, 'sheetWeight') / 80, 4)} m²`,
      `${n(val(r80, 'sheetWeight'), 2)} g`,
      `${n(val(r120, 'sheetWeight'), 2)} g`,
    ];
  })
);
/** Max. A4 sheets the engine still classifies with the given letter label. */
function maxSheets(grammage: number, label: string): number {
  let last = 0;
  for (let s = 1; s <= 500; s++) {
    if (shown(papier({ dinFormat: 'a4', grammage, sheetCount: s }), 'letterCheck') === label) last = s;
  }
  return last;
}
const STD = 'Standardbrief bis 20g';
const KOMPAKT = 'Kompaktbrief bis 50g';
const letterRows = table(
  ['Papier', 'Standardbrief (bis 20 g)', 'Kompaktbrief (bis 50 g)'],
  [80, 100, 120].map((g) => [`A4, ${g} g/m²`, `bis ${maxSheets(g, STD)} Blatt`, `bis ${maxSheets(g, KOMPAKT)} Blatt`])
);
const ream80 = papier({ dinFormat: 'a4', grammage: 80, sheetCount: 500 });
const ream100 = papier({ dinFormat: 'a4', grammage: 100, sheetCount: 500 });
const maxStd80 = maxSheets(80, STD);
const a4w = 210 / 25.4;
const a4h = 297 / 25.4;

export const EINHEITEN_PAGE_CONTENT: PageContentMap = {
  'volumen-umrechner': {
    sections: [
      {
        title: 'Liter, Milliliter und Kubikmeter im Haushalt',
        content: `Ein Liter ist ein Würfel mit 10 cm Kantenlänge, also 1 dm³. Ein Milliliter ist genau ein Kubikzentimeter. Damit lassen sich Mengen vom Schnapsglas bis zum Wasserzähler in einer Reihe lesen:\n\n${volTable}`,
      },
      {
        title: 'Wo beim Umrechnen von Volumen Fehler passieren',
        content: `- **Wasserrechnung:** Versorger rechnen in Kubikmetern ab. 45 m³ Jahresverbrauch sind ${n(val(volWater, 'liters'), 0)} Liter. Wer m³ für Liter hält, unterschätzt den Verbrauch um den Faktor 1.000.\n- **Hubraum:** Ein Motor mit 1.598 cm³ hat ${n(val(volHubraum, 'liters'), 3)} Liter Hubraum und wird deshalb als „1,6-Liter-Motor“ bezeichnet.\n- **Gallone ist nicht gleich Gallone:** Eine britische Gallone sind ${n(val(volUkGal, 'usgal'), 3)} US-Gallonen. Verbrauchsangaben in „miles per gallon“ aus Großbritannien und den USA sind daher nicht direkt vergleichbar.\n- **Kubik zählt dreifach:** Zwischen Liter und Kubikmeter liegt der Faktor 1.000, obwohl zwischen Dezimeter und Meter nur der Faktor 10 liegt (10 × 10 × 10).`,
      },
    ],
    faqs: [
      {
        question: 'Wie viele Liter Wasser passen in einen Pool mit 4 × 3 m und 1,2 m Wassertiefe?',
        answer: `Länge × Breite × Tiefe ergibt 4 × 3 × 1,2 = ${n(val(volPool, 'm3'), 1)} m³. Das sind ${n(val(volPool, 'liters'), 0)} Liter. Bei runden oder schrägen Becken rechnen Sie zuerst die Grundfläche aus und multiplizieren dann mit der mittleren Wassertiefe.`,
      },
      {
        question: 'Wie viel Milliliter hat eine 12-oz-Getränkedose aus den USA?',
        answer: `12 US fl oz sind ${n(val(volCan, 'ml'), 1)} ml, also etwas mehr als eine deutsche 0,33-l-Dose. Bei britischen Produkten ist die Imperial-Unze etwas kleiner, das Ergebnis weicht dann um rund 4 % ab.`,
      },
      {
        question: 'Sind 1 Liter und 1 dm³ exakt gleich groß?',
        answer: 'Ja. Seit 1964 ist der Liter als genau ein Kubikdezimeter festgelegt. Die frühere Definition über die Masse von 1 kg Wasser ergab ein um wenige Millionstel größeres Volumen und gilt nicht mehr.',
      },
    ],
  },

  'energie-arbeit-umrechner': {
    sections: [
      {
        title: 'Energieeinheiten im Vergleich: kWh, MJ, kcal und BTU',
        content: `Stromzähler zählen Kilowattstunden, Datenblätter von Brennstoffen nennen oft Megajoule, Lebensmittel Kilokalorien und US-Geräte BTU. Die Tabelle zeigt typische Werte, gerechnet mit den Faktoren dieses Rechners:\n\n${enTable}`,
      },
      {
        title: 'Leistung oder Energie? Drei typische Missverständnisse',
        content: `- **kW und kWh:** Kilowatt ist eine Leistung, Kilowattstunde eine Energiemenge. Ein Heizlüfter mit 2 kW, der 3 Stunden läuft, verbraucht 6 kWh, das sind ${n(val(enHeater, 'mj'), 1)} MJ.\n- **BTU bei Klimageräten:** Die Angabe „9.000 BTU“ meint eigentlich BTU pro Stunde, also eine Kühlleistung. 9.000 BTU sind ${n(val(enAc9000, 'kwh'), 2)} kWh; pro Stunde abgegeben ergibt das ${n(val(enAc9000, 'kwh'), 2)} kW Kälteleistung. Die elektrische Aufnahme des Geräts ist kleiner.\n- **Gas in m³ und kWh:** Der Gaszähler misst Kubikmeter, abgerechnet wird in kWh. Gerechnet wird Kubikmeter × Zustandszahl × Brennwert; beide Werte stehen auf Ihrer Rechnung. Mit angenommenen 0,95 und 11 kWh/m³ werden aus 1.000 m³ genau ${n(enGasKwh, 0)} kWh oder ${n(val(enGas, 'mj'), 0)} MJ.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viele kWh sind 1 Megajoule?',
        answer: `1 MJ sind ${n(val(enMj, 'kwh'), 4)} kWh. Im Kopf teilen Sie den MJ-Wert durch 3,6; umgekehrt ergibt kWh × 3,6 die Megajoule.`,
      },
      {
        question: 'Wie viele Kilokalorien entsprechen einer Kilowattstunde?',
        answer: `1 kWh entspricht ${n(val(enKwh, 'kcal'), 1)} kcal. Rein rechnerisch steckt in einer Kilowattstunde Strom also etwa so viel Energie wie in 860 kcal Nahrung.`,
      },
      {
        question: 'Wie viel kW Kühlleistung hat ein Klimagerät mit 12.000 BTU?',
        answer: `12.000 BTU pro Stunde entsprechen ${n(val(enAc12000, 'kwh'), 2)} kW Kühlleistung. Vergleichen Sie beim Kauf die Kühlleistung in kW mit der Leistungsaufnahme in kW: Das Verhältnis zeigt, wie effizient das Gerät arbeitet.`,
      },
    ],
  },

  'flaeche-umrechner': {
    sections: [
      {
        title: 'Grundstücke, Felder und US-Wohnungen: Flächen auf einen Blick',
        content: `Bei Grundstücken in Deutschland stehen meist Quadratmeter oder Ar im Grundbuch, Landwirte rechnen in Hektar, Immobilienanzeigen aus den USA in Square Feet. So hängen die Einheiten zusammen:\n\n${flTable}`,
      },
      {
        title: 'Typische Fehler bei Flächeneinheiten',
        content: `- **Faktor 100 statt 10:** Bei Flächen quadriert sich der Längenfaktor. 1 m² sind 100 dm² oder 10.000 cm², und 1 km² sind ${n(val(flKm2, 'm2'), 0)} m².\n- **Preise pro m² und pro Hektar:** Ein Preis von 1 € je m² entspricht 10.000 € je Hektar. Wer bei Ackerland die Einheit verwechselt, liegt um den Faktor 10.000 daneben.\n- **Square Feet in Exposés:** Eine US-Wohnung mit 1.500 sq ft hat ${n(val(flSqft1500, 'm2'), 1)} m².`,
      },
    ],
    faqs: [
      {
        question: 'Wie viele Quadratmeter sind 1.000 Square Feet?',
        answer: `1.000 sq ft sind ${n(val(flSqft1000, 'm2'), 2)} m². Als Faustregel teilen Sie Square Feet durch 10,76.`,
      },
      {
        question: 'Wie viele Acres hat ein Hektar?',
        answer: `1 Hektar sind ${n(val(flHa, 'acre'), 3)} Acres. Ein Acre ist also deutlich kleiner als ein Hektar, nämlich gut 40 Ar.`,
      },
    ],
  },

  'radioaktivitaet-strahlendosis-rechner': {
    sections: [
      {
        title: 'Dosisleistung in µSv/h in eine Jahresdosis umrechnen',
        content: `Messgeräte und das Messnetz des Bundesamts für Strahlenschutz (BfS) zeigen eine **Dosisleistung** in Mikrosievert pro Stunde, nicht eine Dosis. Für die Jahresdosis multiplizieren Sie mit 8.760 Stunden:\n\n${doseTable}\n\nNach Angaben des BfS liegt die natürliche Gamma-Ortsdosisleistung in Deutschland je nach Ort zwischen 0,05 und 0,2 µSv/h. Regen kann den Wert kurzzeitig bis auf etwa das Dreifache anheben, weil er Folgeprodukte von Radon aus der Luft auswäscht. Die Ortsdosisleistung erfasst nur die Strahlung von außen; Radon in der Atemluft und Stoffe aus der Nahrung kommen bei der gesamten natürlichen Jahresdosis hinzu.`,
      },
      {
        title: 'Was sich nicht einfach umrechnen lässt',
        content: `- **Becquerel in Sievert:** Bq beschreibt, wie viele Kerne pro Sekunde zerfallen. Welche Dosis daraus entsteht, hängt vom Radionuklid und vom Aufnahmeweg ab (Essen, Einatmen, Bestrahlung von außen). Dafür braucht man einen Dosiskoeffizienten, ein fester Faktor existiert nicht.\n- **Gray in Sievert:** Für Gamma- und Betastrahlung ist 1 Gy etwa 1 Sv. Alphastrahlung wird mit dem Faktor 20 gewichtet, Neutronen je nach Energie unterschiedlich.\n- **rem und mrem aus US-Quellen:** 1 mrem sind ${n(val(doseOneMrem, 'usv'), 0)} µSv, 100 mrem sind ${n(val(doseMrem, 'msv'), 0)} mSv.`,
      },
    ],
    faqs: [
      {
        question: 'Mein Messgerät zeigt 0,15 µSv/h. Ist das auffällig?',
        answer: `Nein, der Wert liegt im natürlichen Bereich von 0,05 bis 0,2 µSv/h, den das BfS für Deutschland angibt. Hochgerechnet auf ein Jahr im Freien wären das ${n(val(dose015, 'msv'), 2)} mSv. Einfache Zählrohre messen zudem mit größerer Unsicherheit als die Sonden des Messnetzes.`,
      },
      {
        question: 'Welcher Grenzwert gilt für die Bevölkerung?',
        answer: `Für Einzelpersonen der Bevölkerung gilt nach § 80 Strahlenschutzgesetz ein Grenzwert von 1 mSv (${n(val(doseLimit, 'usv'), 0)} µSv) effektiver Dosis pro Kalenderjahr. Er betrifft Strahlung aus Anlagen und dem Umgang mit radioaktiven Stoffen. Für natürliche Strahlung gibt es keinen Grenzwert, und medizinische Untersuchungen werden ebenfalls nicht angerechnet.`,
      },
    ],
  },

  'druck-umrechner': {
    sections: [
      {
        title: 'Reifendruck-Tabelle: bar, PSI und kPa',
        content: `Kompressoren an Tankstellen zeigen je nach Hersteller bar, PSI oder kPa. Die Zeilen bis 3,5 bar betreffen Auto und Transporter, die höheren Werte Fahrradreifen:\n\n${druckTable}\n\nUmgekehrt, für Angaben auf US-Reifen und Fahrradmänteln:\n\n${psiList}`,
      },
      {
        title: 'Überdruck, Absolutdruck und Luftdruck im Wetterbericht',
        content: `Ein Reifenfüller misst den **Überdruck** gegenüber der Umgebungsluft. Zeigt er 2,5 bar, herrschen im Reifen absolut etwa ${n(druckAbs, 2)} bar, weil die Atmosphäre mit ${n(Number(druckAtm.primary.value), 5)} bar hinzukommt. Der Luftdruck im Wetterbericht ist dagegen ein Absolutdruck: 1.013 hPa sind ${n(Number(druckWetter.primary.value), 3)} bar oder ${n(val(druckWetter, 'psi'), 1)} PSI.\n\nFür Wasserleitungen und Pumpen hilft eine Faustregel: 1 bar entspricht dem Druck einer etwa 10 m hohen Wassersäule.`,
      },
    ],
    faqs: [
      {
        question: 'Welcher PSI-Wert entspricht 2,5 bar?',
        answer: `2,5 bar sind ${n(val(druck25, 'psi'), 2)} PSI. Am Kompressor stellen Sie also 36 PSI ein, wenn der Hersteller 2,5 bar vorgibt.`,
      },
      {
        question: 'Soll der Reifendruck kalt oder warm gemessen werden?',
        answer: 'Die Herstellerangaben am Tankdeckel oder in der Türsäule gelten für kalte Reifen. Nach längerer Fahrt liegt der gemessene Wert höher; lassen Sie dann keine Luft ab, sondern prüfen Sie nach dem Abkühlen erneut.',
      },
      {
        question: 'Was bedeuten psi, psig und psia?',
        answer: `psig (gauge) ist der Überdruck gegenüber der Umgebung, psia (absolute) der Druck gegenüber Vakuum. Die Differenz ist der Luftdruck, auf Meereshöhe ${n(val(druckAtm, 'psi'), 2)} PSI. Reifendruck wird immer als psig angegeben, auch wenn nur „psi“ dasteht.`,
      },
    ],
  },

  'drehzahl-umfangsgeschwindigkeit-rechner': {
    sections: [
      {
        title: 'Umfangsgeschwindigkeit typischer Werkzeuge und Räder',
        content: `Die Geschwindigkeit am Rand wächst mit dem Durchmesser und mit der Drehzahl. Die letzte Spalte zeigt für Trennscheiben, bei welcher Drehzahl der Rand ${DISC_LIMIT_MS} m/s erreicht, die häufigste Freigabe solcher Scheiben:\n\n${toolTable}`,
      },
      {
        title: 'So prüfen Sie, ob Scheibe und Maschine zusammenpassen',
        content: `1. Auf jeder Trenn- und Schruppscheibe sind die zulässige Umfangsgeschwindigkeit in m/s und die höchste Drehzahl in U/min aufgedruckt.\n2. Die Leerlaufdrehzahl auf dem Typenschild der Maschine darf diese Drehzahl nicht überschreiten.\n3. Niemals eine größere Scheibe auf eine kleine Maschine montieren: Eine 230-mm-Scheibe bei 11.000 U/min liefe mit ${n(val(wrongDisc, 'vms'), 1)} m/s am Rand, weit über jeder Freigabe.\n\nDer Durchmesser wirkt linear: Bei 6.600 U/min läuft eine 115-mm-Scheibe mit ${n(val(small230, 'vms'), 1)} m/s, eine 230-mm-Scheibe mit ${n(val(big230, 'vms'), 1)} m/s. Beim Bohren gilt dasselbe umgekehrt: Halber Bohrerdurchmesser braucht für dieselbe Schnittgeschwindigkeit die doppelte Drehzahl.`,
      },
    ],
    faqs: [
      {
        question: 'Wie oft dreht sich ein Fahrradlaufrad bei 25 km/h?',
        answer: `Bei rund 700 mm Außendurchmesser dreht das Rad mit etwa ${n(bikeRpm25, 0)} U/min. Kleinere Räder drehen bei gleichem Tempo entsprechend schneller.`,
      },
      {
        question: 'Warum haben große Winkelschleifer eine niedrigere Drehzahl?',
        answer: `Weil die Randgeschwindigkeit sonst die Freigabe der Scheibe überschreiten würde. Für ${DISC_LIMIT_MS} m/s darf eine 230-mm-Scheibe höchstens etwa ${n(rpmFor(230, DISC_LIMIT_MS), 0)} U/min drehen, eine 115-mm-Scheibe dagegen etwa ${n(rpmFor(115, DISC_LIMIT_MS), 0)} U/min.`,
      },
    ],
  },

  'dezibel-schalldruck-umrechner': {
    sections: [
      {
        title: 'Pegeltabelle: dB, Schalldruck und Lautstärkeeindruck',
        content: `Die Tabelle setzt jeden Pegel in Bezug zu 60 dB, etwa einem normalen Gespräch. So sehen Sie, wie schnell Energie und Schalldruck mit wenigen Dezibel wachsen:\n\n${dbTable}`,
      },
      {
        title: 'Pegel addieren und Abstand richtig einschätzen',
        content: `- **Mehrere gleiche Quellen:** 2 gleich laute Quellen ergeben +3 dB, 4 Quellen +6 dB, 10 Quellen +10 dB.\n- **Ungleich laute Quellen:** Liegt eine Quelle 10 dB unter der anderen, trägt sie kaum bei: 60 dB und 50 dB ergeben zusammen ${n(sum60plus50, 1)} dB.\n- **Doppelter Abstand:** Bei einer punktförmigen Quelle im Freien sinkt der Pegel um etwa 6 dB, der Schalldruck halbiert sich dabei auf das ${n(distRatio, 2)}-Fache.\n- **dB oder dB(A):** Der Zusatz (A) bedeutet, dass tiefe und sehr hohe Frequenzen wie beim menschlichen Gehör schwächer gewichtet werden. Werte mit und ohne A-Bewertung sind nicht direkt vergleichbar.`,
      },
    ],
    faqs: [
      {
        question: 'Ab welchem Lärmpegel muss der Arbeitgeber Gehörschutz bereitstellen?',
        answer: 'Nach der Lärm- und Vibrations-Arbeitsschutzverordnung muss er ab dem unteren Auslösewert von 80 dB(A) Tages-Lärmexpositionspegel geeigneten Gehörschutz zur Verfügung stellen. Ab dem oberen Auslösewert von 85 dB(A) muss er dafür sorgen, dass der Gehörschutz auch getragen wird. Für Spitzenschalldruck gelten 135 und 137 dB(C).',
      },
      {
        question: 'Wie viel Pascal sind 94 dB?',
        answer: `94 dB entsprechen ${n(val(db94, 'pressure'), 3)} Pa, also fast genau 1 Pascal. Deshalb arbeiten viele Schallkalibratoren mit 94 dB als Prüfpegel.`,
      },
    ],
  },

  'schuhe-kleidergroessen-umrechner': {
    sections: [
      {
        title: 'Schuhgrößen-Tabelle EU, UK und US nach der Formel dieses Rechners',
        content: `Die Werte stammen aus denselben Näherungsformeln, die der Rechner oben verwendet. Hersteller weichen davon oft um eine halbe Größe ab, vor allem bei Sportschuhen:\n\n${shoeTable}`,
      },
      {
        title: 'Fußlänge messen und die passende Größe ablesen',
        content: `1. Messen Sie am Nachmittag oder Abend im Stehen, denn dann sind die Füße am längsten.\n2. Stellen Sie die Ferse an eine Wand, legen Sie ein Blatt Papier darunter und markieren Sie die Spitze des längsten Zehs.\n3. Messen Sie beide Füße und nehmen Sie den größeren Wert.\n4. Suchen Sie in der Tabelle die erste Größe, deren Fußlänge Ihren Messwert erreicht. Bei 24,5 cm ist das nach dieser Formel EU ${n(eu245, 1)}, bei 26,5 cm EU ${n(eu265, 1)}.`,
      },
    ],
    faqs: [
      {
        question: 'Welche EU-Schuhgröße passt bei 26,5 cm Fußlänge?',
        answer: `Nach der Formel des Rechners EU ${n(eu265, 1)}. Liegt Ihr Messwert knapp unter einer Grenze, probieren Sie bei Wanderschuhen und Sneakern eher die größere Größe, weil dort Platz für dickere Socken nötig ist.`,
      },
      {
        question: 'Ist US 8 bei Damen und Herren dieselbe Größe?',
        answer: `Nein. Bei Herren entspricht US 8 nach diesem Rechner etwa EU ${n(euUs8Men, 1)}, bei Damen etwa EU ${n(euUs8Women, 1)}. Damengrößen liegen in der US-Zählung um 1,5 Nummern höher. Achten Sie bei Unisex-Modellen darauf, welche Skala angegeben ist.`,
      },
    ],
  },

  'datenrate-bandbreite-umrechner': {
    sections: [
      {
        title: 'Downloadzeiten nach Tarif und Dateigröße',
        content: `Berechnet mit dem Rechner und seinem Standardwert von 10 % Overhead, der die reine Übertragungszeit um 10 % verlängert. WLAN, ein langsamer Server oder parallele Nutzung im Haushalt verlängern die Zeiten zusätzlich:\n\n${dlTable}`,
      },
      {
        title: 'Mbit/s, MB/s und MiB/s auseinanderhalten',
        content: `- **Mbit/s** nennt der Anbieter im Tarif. **MB/s** zeigen Browser und Spiele-Launcher. Der Faktor ist 8: Ein Speedtest mit 92 Mbit/s bedeutet höchstens ${n(val(dlSpeedtest, 'theoreticalSpeed'), 1)} MB/s.\n- **Gigabit-Anschluss:** 1.000 Mbit/s sind theoretisch ${n(val(dlGigRaw, 'theoreticalSpeed'), 0)} MB/s, mit Overhead eher ${n(val(dlGig, 'effectiveSpeed'), 1)} MB/s. Ältere Festplatten, LAN-Ports mit 100 Mbit/s oder WLAN bremsen oft stärker als die Leitung.\n- **MiB/s:** Manche Programme rechnen binär. 1 MiB/s sind 1,049 MB/s, der Unterschied ist für die Zeitschätzung klein.\n- **Upload getrennt prüfen:** Bei DSL und Kabel ist der Upload meist deutlich langsamer als der Download. Für Cloud-Backups zählt nur der Upload.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel MB/s sind 1 Gbit/s wirklich?',
        answer: `Rechnerisch ${n(val(dlGigRaw, 'theoreticalSpeed'), 0)} MB/s, mit dem Overhead-Zuschlag von 10 % des Rechners etwa ${n(val(dlGig, 'effectiveSpeed'), 1)} MB/s. Ein Gigabyte ist dann in rund ${shown(dlGig, 'duration')} geladen, sofern Gegenstelle und eigenes Netzwerk mithalten.`,
      },
      {
        question: 'Wie lange dauert ein Cloud-Backup von 1 TB?',
        answer: `Mit 40 Mbit/s Upload und 10 % Overhead etwa ${shown(dlBackup, 'duration')}, also mehrere Tage Dauerbetrieb. Mit 1.000 Mbit/s Upload, wie bei manchen Glasfasertarifen, reichen dafür etwa ${shown(dlBackupFast, 'duration')} aus. Planen Sie das erste Voll-Backup daher über Nacht oder am Wochenende ein.`,
      },
    ],
    workedExamples: [
      {
        title: 'Beispiel: 100-GB-Spiel über Glasfaser mit 1 Gbit/s',
        description: 'Ein großes Spiel wird über einen Gigabit-Anschluss geladen; der Rechner schlägt 10 % Overhead auf die Downloadzeit auf.',
        inputValues: [
          { label: 'Größe', value: '100 GB' },
          { label: 'Leitung', value: '1.000 Mbit/s' },
          { label: 'Overhead', value: '10 %' },
        ],
        inputs: { fileSizeGb: 100, bandwidthMbits: '1000', overheadLoss: 10 },
        steps: [
          `1.000 Mbit/s / 8 = ${n(val(dlExample, 'theoreticalSpeed'), 0)} MB/s`,
          `mit 10 % Overhead: 125 / 1,1 = ${n(val(dlExample, 'effectiveSpeed'), 2)} MB/s`,
          `100.000 MB / ${n(val(dlExample, 'effectiveSpeed'), 2)} MB/s = ${n(Number(dlExample.primary.value), 0)} Sekunden`,
        ],
        resultSummary: `ca. ${shown(dlExample, 'duration')}`,
      },
    ],
  },

  'leistung-umrechner': {
    sections: [
      {
        title: 'PS in kW: typische Motorleistungen',
        content: `In der Zulassungsbescheinigung steht die Leistung in Kilowatt (Feld P.2), in Prospekten meist zusätzlich in PS. Die Tabelle zeigt gängige Werte samt US-Horsepower:\n\n${psTable}\n\nUmgekehrt, häufige kW-Werte aus dem Fahrzeugschein:\n\n${kwList}`,
      },
      {
        title: 'PS, hp und Watt: wo die Unterschiede liegen',
        content: `- **PS und hp sind nicht gleich:** Ein US-Motor mit 300 hp hat ${n(val(hp300, 'ps'), 1)} PS. Bei kleinen Motoren fällt der Unterschied kaum auf, bei Sportwagen sind es einige PS.\n- **Elektrogeräte:** Ein Wasserkocher mit 2.000 W hat ${n(val(watt2000, 'kw'), 1)} kW oder ${n(val(watt2000, 'ps'), 1)} PS. Für Stromkosten zählt aber nicht die Leistung allein, sondern Leistung mal Betriebszeit.\n- **Nennleistung ist Spitzenleistung:** Der Wert im Fahrzeugschein gilt bei einer bestimmten Drehzahl. Im Alltag wird er nur selten abgerufen.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel PS hat ein Motor mit 100 kW?',
        answer: `100 kW sind ${n(val(kw100, 'ps'), 1)} PS. Im Kopf multiplizieren Sie kW mit 1,36.`,
      },
      {
        question: 'Sind 100 hp und 100 PS dasselbe?',
        answer: `Fast. 100 hp (mechanical horsepower) sind ${n(val(hp100, 'ps'), 1)} PS bzw. ${n(val(hp100, 'kw'), 2)} kW. Die angloamerikanische Einheit ist also rund 1,4 % größer als die metrische PS.`,
      },
      {
        question: 'Warum steht im Fahrzeugschein kW statt PS?',
        answer: 'Das PS ist in Deutschland keine gesetzliche Einheit mehr. Amtlich wird Leistung in Watt bzw. Kilowatt angegeben; PS erscheint nur noch als zusätzliche Angabe, etwa in Prospekten.',
      },
    ],
  },

  'drehmoment-umrechner': {
    sections: [
      {
        title: 'Umrechnungstabelle für den Drehmomentschlüssel',
        content: `Viele Drehmomentschlüssel haben nur eine Skala. Diese Tabelle hilft, wenn Werkstatthandbuch und Werkzeug unterschiedliche Einheiten verwenden:\n\n${nmTable}\n\nVon Foot-Pounds aus US-Anleitungen in Newtonmeter:\n\n${ftlbList}`,
      },
      {
        title: 'Häufige Fehler beim Anziehen nach Vorgabe',
        content: `- **in-lb und ft-lb verwechselt:** 100 in-lb sind nur ${n(Number(inlb100.primary.value), 1)} Nm, 100 ft-lb dagegen ${n(Number(ftlb100.primary.value), 1)} Nm. Wer die Einheit verwechselt, zieht zwölfmal zu fest oder zu locker an.\n- **kpm aus alten Handbüchern:** Oldtimer-Unterlagen nennen oft Kilopondmeter. 12 kpm sind ${n(Number(kpm12.primary.value), 1)} Nm; mit dem Faktor 10 im Kopf liegen Sie knapp 2 % zu hoch.\n- **Verlängerung am Schlüssel:** Eine Verlängerung in Achsrichtung vergrößert den Hebel. Bei 40 cm Schlüssellänge, 10 cm Verlängerung und 100 Nm Einstellung wirken ${n(extReal, 0)} Nm auf die Schraube. Einstellen müssten Sie ${n(extFix, 0)} Nm.\n- **Klickschlüssel lagern:** Nach der Arbeit auf den kleinsten Skalenwert zurückdrehen, damit die Feder nicht dauerhaft gespannt bleibt.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viele Nm sind 80 ft-lb?',
        answer: `80 ft-lb sind ${n(Number(ftlb80.primary.value), 2)} Nm. Als Faustregel multiplizieren Sie Foot-Pounds mit 1,36.`,
      },
      {
        question: 'Darf man einen Drehmomentschlüssel mit Verlängerung benutzen?',
        answer: `Ja, wenn Sie umrechnen. Das tatsächliche Moment ist eingestellter Wert × (Schlüssellänge + Verlängerung) / Schlüssellänge. Mit 40 cm Schlüssel und 10 cm Verlängerung stellen Sie für 100 Nm an der Schraube nur ${n(extFix, 0)} Nm ein. Gelenk- oder Winkeladapter verfälschen den Wert zusätzlich.`,
      },
    ],
  },

  'dichte-umrechner': {
    sections: [
      {
        title: 'Dichte gängiger Stoffe in drei Einheiten',
        content: `Kraftstoffe und Beton schwanken je nach Sorte und Temperatur, deshalb sind diese Werte als Richtwerte markiert. Metalle wie Aluminium und Kupfer liegen sehr nah an den angegebenen Zahlen:\n\n${matTable}`,
      },
      {
        title: 'Von der Dichte zur Masse',
        content: `Masse = Dichte × Volumen. Praktisch heißt das:\n\n- Ein Tank mit 50 l Diesel wiegt bei etwa 0,83 kg/l rund ${n(dieselTank, 1)} kg, ohne Tank.\n- 1 m³ Normalbeton wiegt bei etwa 2,4 g/cm³ rund ${n(betonM3, 0)} kg, also 2,4 Tonnen. Das zählt beim Anhänger und bei der Statik.\n- **Schüttdichte beachten:** Bei Sand, Kies oder Holzpellets ist die Schüttdichte kleiner als die Dichte des Materials, weil Luft zwischen den Körnern ist. Für das Gewicht einer Ladung zählt die Schüttdichte.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel wiegt ein Liter Diesel?',
        answer: 'Rund 0,83 kg. Der genaue Wert hängt von Sorte und Temperatur ab: Warmer Kraftstoff dehnt sich aus, ein Liter wiegt dann etwas weniger. Benzin ist mit etwa 0,74 kg pro Liter leichter.',
      },
      {
        question: 'Wie rechne ich lb/ft³ aus US-Datenblättern um?',
        answer: `Multiplizieren Sie mit 16,018. Ein Dämmstoff mit 2 lb/ft³ hat ${n(val(lbcuft2, 'kgm3'), 1)} kg/m³, Beton mit 150 lb/ft³ hat ${n(val(lbcuft150, 'kgm3'), 0)} kg/m³.`,
      },
      {
        question: 'Sind g/cm³, kg/l und t/m³ dasselbe?',
        answer: 'Ja, alle drei sind zahlengleich. 7,85 g/cm³ bei Stahl bedeuten auch 7,85 kg pro Liter und 7,85 Tonnen pro Kubikmeter. Nur kg/m³ ist um den Faktor 1.000 größer.',
      },
    ],
  },

  'viskositaet-umrechner': {
    sections: [
      {
        title: 'Kinematische Werte aus dem Datenblatt in mPa·s umrechnen',
        content: `Öldatenblätter nennen meist die **kinematische** Viskosität in mm²/s (cSt), dieser Rechner arbeitet mit der **dynamischen** in mPa·s. Die Brücke ist die Dichte: η in mPa·s = ν in mm²/s × ρ in g/cm³. Die Dichten der Öle sind typische Annahmen:\n\n${oilTable}`,
      },
      {
        title: 'Worauf Sie bei Viskositätsangaben achten sollten',
        content: `- **cSt ist nicht cP:** Beide Zahlen sind nur bei einer Dichte von 1 g/cm³ gleich. Bei Ölen liegt die dynamische Viskosität rund 10 bis 15 % unter dem cSt-Wert.\n- **Temperatur immer mitlesen:** Ein Viskositätswert ohne Temperatur ist wertlos. ISO-VG-Klassen beziehen sich auf 40 °C, SAE-Hochtemperaturwerte bei Motoröl auf 100 °C.\n- **Poise und Pascalsekunde:** 1 Pa·s sind 10 P. 15 Poise aus einer älteren Tabelle sind ${n(val(poise15, 'pas'), 2)} Pa·s oder ${n(val(poise15, 'mpas'), 0)} mPa·s.`,
      },
    ],
    faqs: [
      {
        question: 'Was bedeutet ISO VG 46 bei Hydrauliköl?',
        answer: 'Die Zahl ist die mittlere kinematische Viskosität bei 40 °C in mm²/s. Ein ISO-VG-46-Öl darf zwischen 41,4 und 50,6 mm²/s liegen (±10 %). Die dynamische Viskosität in mPa·s ist wegen der geringeren Dichte etwas kleiner.',
      },
      {
        question: 'Wie rechne ich Centistokes in Centipoise um?',
        answer: `Multiplizieren Sie die cSt mit der Dichte in g/cm³. Ein Öl mit 100 cSt und 0,9 g/cm³ hat ${n(val(cst100, 'cp'), 0)} cP, das sind ${n(val(cst100, 'pas'), 2)} Pa·s.`,
      },
    ],
  },

  'daten-speicher-umrechner': {
    sections: [
      {
        title: 'Gekaufte Kapazität und Anzeige unter Windows',
        content: `Hersteller rechnen mit 1.000er-Schritten, Windows mit 1.024er-Schritten und schreibt trotzdem „GB“. Je größer das Laufwerk, desto größer der scheinbare Verlust:\n\n${capTable}`,
      },
      {
        title: 'Warum noch weniger frei ist, als die Tabelle zeigt',
        content: `- **Dateisystem und Partitionen:** Formatierung, Wiederherstellungsbereiche und bei Smartphones das Betriebssystem belegen zusätzlichen Platz. Diese Lücke ist kein Rechenfehler, sondern echte Belegung.\n- **macOS zählt dezimal:** Seit Mac OS X 10.6 zeigt der Mac Kapazitäten mit 1.000er-Präfixen an. Eine 2-TB-Platte erscheint dort als 2 TB, unter Windows als ${n(val(cap2tb, 'gib') / 1024, 2)} TB.\n- **Arbeitsspeicher ist binär:** 16 GB RAM sind in Wahrheit 16 GiB, also ${n(val(ram16, 'gb'), 2)} Milliarden Byte. Beim RAM rechnen auch Hersteller in Zweierpotenzen.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel Speicher zeigt Windows bei einer 2-TB-Festplatte an?',
        answer: `Etwa ${n(val(cap2tb, 'gib'), 1)} GB bzw. ${n(val(cap2tb, 'gib') / 1024, 2)} TB. Die 2.000.000.000.000 Byte sind vollständig vorhanden, Windows teilt nur durch 1.024³ statt durch 1.000³.`,
      },
      {
        question: 'Zeigt ein Mac mehr Speicher an als ein Windows-PC?',
        answer: 'Er zeigt die gleiche Byte-Menge mit dezimalen Präfixen an, deshalb wirkt die Zahl größer. Wechselt eine externe Festplatte zwischen beiden Systemen, unterscheiden sich die Angaben bei 1 TB um rund 7 %, ohne dass Daten fehlen.',
      },
    ],
  },

  'papierformat-din-rechner': {
    sections: [
      {
        title: 'DIN-A-Formate: Maße, Fläche und Blattgewicht',
        content: `Jedes Format hat die halbe Fläche des vorigen. Das Gewicht eines Blatts ist daher einfach Grammatur × Fläche:\n\n${paperTable}`,
      },
      {
        title: 'Wie viele Blätter passen in welchen Brief?',
        content: `Der Rechner schlägt pauschal 5 g für den Umschlag auf. Damit ergibt sich für gefaltete A4-Blätter:\n\n${letterRows}\n\nSchwere Umschläge, Fensterkuverts aus Karton oder beigelegte Fotos verschieben die Grenze. Neben dem Gewicht gelten bei der Deutschen Post auch Höchstmaße und eine maximale Dicke je Briefart; aktuelle Porti und Maße finden Sie direkt bei der Post.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel wiegt ein Paket mit 500 Blatt A4-Papier?',
        answer: `Bei 80 g/m² wiegen 500 Blatt ${n(val(ream80, 'totalWeight') / 1000, 2)} kg, bei 100 g/m² ${n(val(ream100, 'totalWeight') / 1000, 3)} kg. Verpackung kommt hinzu.`,
      },
      {
        question: 'Wie viele A4-Blätter darf ein Standardbrief enthalten?',
        answer: `Bei 80 g/m² Papier und einem leichten Umschlag bis zu ${maxStd80} Blatt, denn ein Blatt wiegt 5 g und der Standardbrief darf höchstens 20 g wiegen. Ab dem nächsten Blatt brauchen Sie einen Kompaktbrief.`,
      },
      {
        question: 'Wie groß ist DIN A4 in Zoll, und was ist US Letter?',
        answer: `DIN A4 misst ${n(a4w, 2)} × ${n(a4h, 2)} Zoll. Das US-Format Letter ist mit 8,5 × 11 Zoll (215,9 × 279,4 mm) etwas breiter und kürzer. Druckt ein amerikanisches Dokument auf A4, fehlen deshalb gelegentlich Ränder oder die letzte Zeile.`,
      },
    ],
  },
};
