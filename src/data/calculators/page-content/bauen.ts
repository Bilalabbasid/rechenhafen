import { PageContentMap } from './types';
import { CalculationResult } from '@/types/calculator';
import { BAUEN_CALCULATORS } from '../bauen';
import { EXTRA_BAUEN_GEOMETRIE } from '../extra/bauenGeometrie';
import { formatNumber } from '@/lib/formatters';

// ---------------------------------------------------------------------------
// Alle Zahlen in Tabellen und Antworten stammen aus der calculate-Funktion des
// jeweiligen Rechners und werden beim Laden des Moduls berechnet. Materialwerte
// (kg/m², Stück/m²) sind Rechenwerte der Rechner; maßgeblich ist immer das
// Datenblatt des Herstellers.
// ---------------------------------------------------------------------------
function run(slug: string, inputs: Record<string, any>): CalculationResult {
  const calc = [...BAUEN_CALCULATORS, ...EXTRA_BAUEN_GEOMETRIE].find((c) => c.slug === slug);
  if (!calc || !calc.calculate) throw new Error(`page-content/bauen: calculator ${slug} not found`);
  return calc.calculate(inputs) as CalculationResult;
}
function num(r: CalculationResult, id: string): number {
  if (r.primary.id === id) return Number(r.primary.value);
  const item = r.secondary?.find((s) => s.id === id);
  if (!item) throw new Error(`page-content/bauen: result ${id} missing`);
  return Number(item.value);
}
function table(head: string[], rows: string[][]): string {
  return [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n');
}
const n0 = (v: number) => formatNumber(v, 0);
const n1 = (v: number) => formatNumber(v, 1, 1);
const n2 = (v: number) => formatNumber(v, 2, 2);
const n3 = (v: number) => formatNumber(v, 3, 3);

// ---------------------------------------------------------------------------
// Farbmengen (Wandfarbe)
// ---------------------------------------------------------------------------
const FARBE_BASE = { roomLength: 5, roomWidth: 4, roomHeight: 2.5, includeCeiling: 'no', deductOpenings: 'yes', openingDeductionSqm: 5, coats: 2, coveragePerLiter: 7, wasteReservePercent: '10' };
const farbe = (over: Record<string, any>) => run('farbmengen-rechner', { ...FARBE_BASE, ...over });
const FARBE_ROOMS: Array<[string, number, number, number]> = [
  ['Gäste-WC / Abstellraum', 2, 1.5, 1.5],
  ['Kinderzimmer', 3.5, 3, 3],
  ['Schlafzimmer', 4.5, 3.5, 4],
  ['Wohnzimmer', 6, 4.5, 7],
];
const FARBE_TABLE = table(
  ['Raum (2,50 m hoch)', 'Fenster/Türen', 'Wandfläche netto', 'Nur Wände', 'Wände + Decke'],
  FARBE_ROOMS.map(([name, l, b, open]) => {
    const walls = farbe({ roomLength: l, roomWidth: b, openingDeductionSqm: open });
    const all = farbe({ roomLength: l, roomWidth: b, openingDeductionSqm: open, includeCeiling: 'yes' });
    return [`${name} ${formatNumber(l, 1)} × ${formatNumber(b, 1)} m`, `${formatNumber(open, 1)} m²`, `${n1(num(walls, 'netArea'))} m²`, `${n1(num(walls, 'paintLiters'))} l`, `${n1(num(all, 'paintLiters'))} l`];
  }),
);
const FARBE_50 = farbe({ roomLength: 5, roomWidth: 5, openingDeductionSqm: 0 });
const FARBE_50_EXACT = farbe({ roomLength: 5, roomWidth: 5, openingDeductionSqm: 0, wasteReservePercent: '0' });
const FARBE_COV7 = num(farbe({}), 'paintLiters');
const FARBE_COV5 = num(farbe({ coveragePerLiter: 5 }), 'paintLiters');
const FARBE_COV5_B10 = num(farbe({ coveragePerLiter: 5 }), 'buckets10');
const FARBE_COV7_B10 = num(farbe({}), 'buckets10');
const FARBE_CEIL_DIFF = num(farbe({ includeCeiling: 'yes' }), 'paintLiters') - FARBE_COV7;

// ---------------------------------------------------------------------------
// Bodenbelag
// ---------------------------------------------------------------------------
const boden = (l: number, b: number, waste: number, pack = 2.22) => run('bodenbelag-rechner', { length: l, width: b, wastePercent: waste, packSizeSqm: pack });
const BODEN_ROOMS: Array<[number, number]> = [[3, 3], [4, 3.5], [5, 4], [6, 4.5], [7, 5]];
const BODEN_TABLE = table(
  ['Raum', 'Fläche', '5 % Verschnitt', '10 % Verschnitt', '15 % Verschnitt'],
  BODEN_ROOMS.map(([l, b]) => {
    const cell = (w: number) => {
      const r = boden(l, b, w);
      return `${n2(num(r, 'totalSqm'))} m² / ${n0(num(r, 'packs'))} Pak.`;
    };
    return [`${formatNumber(l, 1)} × ${formatNumber(b, 1)} m`, `${n2(l * b)} m²`, cell(5), cell(10), cell(15)];
  }),
);
// L-förmiger Raum: zwei Rechtecke getrennt gerechnet
const BODEN_L1 = boden(4.2, 3.1, 10);
const BODEN_L2 = boden(2.4, 1.8, 10);
const BODEN_L_SEP_PACKS = num(BODEN_L1, 'packs') + num(BODEN_L2, 'packs');
const BODEN_L_SUM_SQM = num(BODEN_L1, 'totalSqm') + num(BODEN_L2, 'totalSqm');
const BODEN_L_JOINT_PACKS = Math.ceil(BODEN_L_SUM_SQM / 2.22);
const BODEN_20 = boden(5, 4, 10);
const BODEN_SKIRT = boden(5, 4, 10);

// ---------------------------------------------------------------------------
// Estrich
// ---------------------------------------------------------------------------
const estrich = (over: Record<string, any>) => run('estrich-rechner', { area: 20, thickness: 50, estrichType: 'ct', sackSize: '25', waste: 5, ...over });
const ESTRICH_TABLE = table(
  ['Dicke', 'Volumen', 'Gewicht', '25-kg-Säcke', '40-kg-Säcke', 'Faustregel Belegreife'],
  [35, 45, 50, 65, 80].map((t) => {
    const r25 = estrich({ thickness: t });
    const r40 = estrich({ thickness: t, sackSize: '40' });
    return [`${t} mm`, `${n2(num(r25, 'volume'))} m³`, `${n2(num(r25, 'weightTonnes'))} t`, n0(num(r25, 'sacks')), n0(num(r40, 'sacks')), `ca. ${n0(num(r25, 'dryingTime'))} Tage`];
  }),
);
const ESTRICH_1M2_45 = estrich({ area: 1, thickness: 45, waste: 0 });
const ESTRICH_1M2_65 = estrich({ area: 1, thickness: 65, waste: 0 });
const ESTRICH_10_40 = estrich({ area: 10, thickness: 40 });
const ESTRICH_CA_50 = estrich({ estrichType: 'ca' });
const ESTRICH_CT_50 = estrich({});

// ---------------------------------------------------------------------------
// Dämmung / U-Wert
// ---------------------------------------------------------------------------
const uwert = (component: string, wlg: string, thickness: number) => run('daemmung-u-wert-rechner', { component, wlg, thickness });
const U_WLGS = ['040', '035', '032', '022'];
const U_TABLE = table(
  ['Dämmdicke', ...U_WLGS.map((w) => `WLG ${w}`)],
  [80, 120, 160, 200, 240].map((t) => [`${t} mm`, ...U_WLGS.map((w) => `${n3(num(uwert('wall', w, t), 'uWert'))}`)]),
);
const U_REQ_TABLE = table(
  ['Wärmeleitgruppe', 'Mindestdicke für 0,24 (Wand, Dach)', 'Mindestdicke für 0,30 (Kellerdecke)'],
  U_WLGS.map((w) => [`WLG ${w}`, `${n0(num(uwert('wall', w, 100), 'reqThickness'))} mm`, `${n0(num(uwert('basement', w, 100), 'reqThickness'))} mm`]),
);
const U_REQ_035 = num(uwert('wall', '035', 100), 'reqThickness');
const U_160 = num(uwert('wall', '035', 160), 'uWert');
const U_200 = num(uwert('wall', '035', 200), 'uWert');
const U_80 = num(uwert('wall', '035', 80), 'uWert');
const U_120 = num(uwert('wall', '035', 120), 'uWert');

// ---------------------------------------------------------------------------
// Mauersteine
// ---------------------------------------------------------------------------
const steine = (format: string, over: Record<string, any> = {}) => run('bausteine-mauerwerk-rechner', { wallLength: 4, wallHeight: 2.5, openingsArea: 0, stoneFormat: format, waste: 5, ...over });
const STEIN_FORMATS: Array<[string, string]> = [
  ['plan24', 'Planstein 24er'],
  ['plan36', 'Planstein 36,5er'],
  ['2df', '2DF (240 × 115 × 113 mm)'],
  ['nf', 'NF (240 × 115 × 71 mm)'],
];
const STEIN_TABLE = table(
  ['Format', 'Steine für 10 m²', 'Mörtel', '25-kg-Säcke Mörtel'],
  STEIN_FORMATS.map(([f, label]) => {
    const r = steine(f);
    const mortar = num(r, 'mortar');
    return [label, `${n0(num(r, 'stones'))} Stück`, `${n0(mortar)} kg`, n0(Math.ceil(mortar / 25))];
  }),
);
const STEIN_2DF_10 = num(steine('2df'), 'stones');
const STEIN_DEFAULT = steine('plan24', { wallLength: 6, wallHeight: 2.5, openingsArea: 3 });
const STEIN_DEFAULT_NET = num(STEIN_DEFAULT, 'netArea');
const STEIN_W5 = num(steine('nf', { wallLength: 8, wallHeight: 2.5 }), 'stones');
const STEIN_W10 = num(steine('nf', { wallLength: 8, wallHeight: 2.5, waste: 10 }), 'stones');

// ---------------------------------------------------------------------------
// Fliesenkleber
// ---------------------------------------------------------------------------
const kleber = (area: number, notch: string, over: Record<string, any> = {}) => run('fliesenkleber-rechner', { area, notch, jointWidth: 3, waste: 10, ...over });
const KLEBER_NOTCHES = ['6', '8', '10', '12'];
const KLEBER_TABLE = table(
  ['Fläche', ...KLEBER_NOTCHES.map((z) => `${z} mm Zahnung`)],
  [5, 10, 25, 40].map((a) => [`${a} m²`, ...KLEBER_NOTCHES.map((z) => {
    const r = kleber(a, z);
    const sacks = num(r, 'adhesiveSacks');
    return `${n1(num(r, 'adhesiveKg'))} kg (${n0(sacks)} ${sacks === 1 ? 'Sack' : 'Säcke'})`;
  })]),
);
// Exakte Fugenformel (Geometrie): Fugenlänge je m² = (a + b) / (a · b); Dichte 1,7 kg/dm³ als Beispielwert
const GROUT_DENSITY = 1700;
const GROUT_ENGINE_PER_M2 = num(kleber(1, '8', { waste: 0 }), 'groutKg');
const GROUT_ROWS: Array<[string, number, number, number]> = [
  ['10 × 10 cm (Mosaik)', 0.1, 0.1, 6],
  ['30 × 30 cm', 0.3, 0.3, 8],
  ['30 × 60 cm', 0.3, 0.6, 9],
  ['60 × 60 cm', 0.6, 0.6, 10],
];
const groutExact = (a: number, b: number, depthMm: number) => ((a + b) / (a * b)) * 0.003 * (depthMm / 1000) * GROUT_DENSITY;
const GROUT_TABLE = table(
  ['Fliese', 'Fliesenstärke = Fugentiefe', 'Fugenlänge je m²', 'Fugenmörtel exakt (3 mm Fuge)', 'Rechner (pauschal)'],
  GROUT_ROWS.map(([label, a, b, d]) => [label, `${d} mm`, `${n1((a + b) / (a * b))} m`, `${n2(groutExact(a, b, d))} kg/m²`, `${n2(GROUT_ENGINE_PER_M2)} kg/m²`]),
);
const KLEBER_BAD_FLOOR = kleber(6, '10');
const KLEBER_BAD_WALL = kleber(22, '6');
const KLEBER_BAD_KG = num(KLEBER_BAD_FLOOR, 'adhesiveKg') + num(KLEBER_BAD_WALL, 'adhesiveKg');

// ---------------------------------------------------------------------------
// Aushub
// ---------------------------------------------------------------------------
const aushub = (l: number, w: number, d: number, soil = 'loam', truck = '18') => run('aushub-erdarbeiten-rechner', { pitLength: l, pitWidth: w, pitDepth: d, soilType: soil, truckCapacity: truck });
const AUSHUB_JOBS: Array<[string, number, number, number]> = [
  ['Mutterboden abtragen (Hausfläche)', 12, 10, 0.3],
  ['Streifenfundament-Graben 40 m', 40, 0.4, 0.8],
  ['Poolgrube', 8, 4, 1.5],
  ['Kellergrube (ohne Böschung)', 12, 10, 2.5],
];
const AUSHUB_TABLE = table(
  ['Vorhaben', 'Maße', 'Festmaß', 'Lose (Lehm)', 'Gewicht', 'Fahrten à 18 t'],
  AUSHUB_JOBS.map(([label, l, w, d]) => {
    const r = aushub(l, w, d);
    return [label, `${formatNumber(l, 1)} × ${formatNumber(w, 1)} × ${formatNumber(d, 2)} m`, `${n1(num(r, 'solidVolume'))} m³`, `${n1(num(r, 'looseVolume'))} m³`, `${n1(num(r, 'tonnes'))} t`, n0(num(r, 'trucks'))];
  }),
);
// Böschung 45°: Grubenoberkante je Seite um die Tiefe größer; Volumen nach Prismatoidformel V = T/6 · (A_unten + 4 · A_Mitte + A_oben)
const BOE_L = 10, BOE_W = 8, BOE_D = 2;
const BOE_VOL = (BOE_D / 6) * (BOE_L * BOE_W + 4 * (BOE_L + BOE_D) * (BOE_W + BOE_D) + (BOE_L + 2 * BOE_D) * (BOE_W + 2 * BOE_D));
const BOE_STRAIGHT = aushub(BOE_L, BOE_W, BOE_D);
const BOE_SLOPED = aushub(BOE_VOL, 1, 1); // Rechner ist linear im Festvolumen
const AUSHUB_1M3 = (['sand', 'loam', 'clay'] as const).map((s) => {
  const r = aushub(1, 1, 1, s);
  return { s, t: num(r, 'tonnes'), loose: num(r, 'looseVolume') };
});

// ---------------------------------------------------------------------------
// Pflastersteine
// ---------------------------------------------------------------------------
const pflaster = (area: number, format: string, over: Record<string, any> = {}) => run('pflastersteine-rechner', { area, stoneFormat: format, beddingDepth: 4, waste: 8, ...over });
const PFL_FORMATS: Array<[string, string]> = [['10x10', '10 × 10 cm'], ['20x10', '20 × 10 cm'], ['20x20', '20 × 20 cm'], ['30x20', '30 × 20 cm']];
const PFL_TABLE = table(
  ['Fläche', ...PFL_FORMATS.map(([, l]) => l), 'Splitt (4 cm)'],
  [12.5, 25, 40, 80].map((a) => [`${formatNumber(a, 1)} m²`, ...PFL_FORMATS.map(([f]) => `${n0(num(pflaster(a, f), 'stones'))} Stk.`), `${n2(num(pflaster(a, '20x10'), 'gritTonnes'))} t`]),
);
const PFL_1M2 = num(pflaster(1, '20x10', { waste: 0 }), 'gritTonnes');
const PFL_1M2_5 = num(pflaster(1, '20x10', { waste: 0, beddingDepth: 5 }), 'gritTonnes');
const PFL_JOINT_STONES = 1 / (0.204 * 0.104); // 20 × 10 cm mit 4 mm Fuge
const PFL_STELL = pflaster(12.5, '20x10');

// ---------------------------------------------------------------------------
// Trockenbau
// ---------------------------------------------------------------------------
const tb = (l: number, cladding: string, board = '2600x600', h = 2.6) => run('trockenbau-gipskarton-rechner', { wallLength: l, wallHeight: h, cladding, boardSize: board, waste: 10 });
const TB_TABLE = table(
  ['Wandlänge (2,60 m hoch)', 'Beplankung', 'Platten 2.600 × 600', 'CW-Ständer', 'UW-Profil', 'Schrauben', 'Spachtel'],
  [2.5, 3.75, 5, 7.5].flatMap((l) => (['single', 'double'] as const).map((c) => {
    const r = tb(l, c);
    return [`${formatNumber(l, 2)} m`, c === 'single' ? 'einfach' : 'doppelt', n0(num(r, 'plates')), n0(num(r, 'cwProfiles')), `${n0(num(r, 'uwProfiles'))} m`, n0(num(r, 'screws')), `${n0(num(r, 'filler'))} kg`];
  })),
);
const TB_10_SINGLE = tb(4, 'single', '2600x600', 2.5);
const TB_10_DOUBLE = tb(4, 'double', '2600x600', 2.5);
const TB_BIG = tb(5, 'double', '2500x1250', 2.5);
const TB_SMALL = tb(5, 'double', '2600x600', 2.5);

// ---------------------------------------------------------------------------
// Fundament
// ---------------------------------------------------------------------------
const fund = (type: string, d1: number, d2: number, depth: number, waste = 10) => run('fundament-rechner', { fundamentType: type, dim1: d1, dim2: d2, depth, waste });
const FUND_JOBS: Array<[string, string, number, number, number]> = [
  ['Gartenmauer, 8 m Streifen', 'strip', 8, 0.3, 0.8],
  ['Doppelstabzaun, 11 Pfosten', 'point', 11, 0.3, 0.8],
  ['Carport, 6 Stützen', 'point', 6, 0.4, 0.8],
  ['Gartenhaus-Platte 3 × 3 m', 'slab', 3, 3, 0.15],
  ['Garage, 20 m Streifen', 'strip', 20, 0.4, 0.8],
];
const FUND_TABLE = table(
  ['Vorhaben', 'Beton', 'Gewicht', '25-kg-Säcke', 'Lieferform laut Rechner'],
  FUND_JOBS.map(([label, type, d1, d2, d]) => {
    const r = fund(type, d1, d2, d);
    const hint = r.secondary?.find((s) => s.id === 'deliveryHint')?.formattedValue ?? '';
    return [label, `${n2(num(r, 'volume'))} m³`, `${n2(num(r, 'weight'))} t`, n0(num(r, 'sacks')), String(hint)];
  }),
);
const FUND_ONE = fund('point', 1, 0.4, 0.8, 0);
const FUND_ONE_ROUND = num(FUND_ONE, 'volume') * Math.PI / 4;
const FUND_15_SACKS = num(fund('slab', 1.5, 1, 1, 0), 'sacks');

// ---------------------------------------------------------------------------
// Zaun
// ---------------------------------------------------------------------------
const zaun = (len: number, corners: number, gates: number, height = '1230') => run('zaun-pfosten-rechner', { fenceLength: len, cornersCount: corners, gatesCount: gates, fenceHeight: height });
const ZAUN_CASES: Array<[number, number, number]> = [[10, 0, 0], [25, 2, 1], [40, 3, 1], [60, 3, 2], [80, 4, 1]];
const ZAUN_TABLE = table(
  ['Zaunlänge', 'Ecken', 'Tore', 'Matten', 'Pfosten', 'Beton 1,23 m hoch', 'Beton 1,83 m hoch'],
  ZAUN_CASES.map(([len, c, g]) => {
    const low = zaun(len, c, g);
    const high = zaun(len, c, g, '1830');
    return [`${len} m`, String(c), String(g), n0(num(low, 'matten')), n0(num(low, 'posts')), `${n0(num(low, 'concrete'))} Säcke`, `${n0(num(high, 'concrete'))} Säcke`];
  }),
);
const ZAUN_SIDE = zaun(8.3, 0, 0);
const ZAUN_SIDE_MATTEN = num(ZAUN_SIDE, 'matten');
const ZAUN_SIDES_MATTEN = 3 * ZAUN_SIDE_MATTEN;
const ZAUN_SIDES_POSTS = 3 * num(ZAUN_SIDE, 'posts') - 2; // zwei Eckpfosten werden geteilt
const ZAUN_TOTAL = zaun(24.9, 2, 0);
const ZAUN_30 = zaun(30, 0, 0);

// ---------------------------------------------------------------------------
// Zisterne
// ---------------------------------------------------------------------------
const zist = (roof: number, cover: string, garden: number, house: string, rain = 750) => run('regenwasser-zisterne-rechner', { roofArea: roof, roofCovering: cover, annualRain: rain, gardenArea: garden, useInHouse: house });
const ZIST_TABLE = table(
  ['Dachfläche', 'Dach', 'Ertrag/Jahr', 'Bedarf/Jahr', 'Zisterne'],
  ([[80, 'tile', 'no'], [120, 'tile', 'no'], [120, 'tile', 'yes'], [120, 'green', 'yes'], [180, 'metal', 'yes']] as Array<[number, string, string]>).map(([roof, cover, house]) => {
    const r = zist(roof, cover, 250, house);
    const coverLabel = cover === 'tile' ? 'Ziegel' : cover === 'green' ? 'Gründach' : 'Blech';
    return [`${roof} m²`, `${coverLabel}${house === 'yes' ? ', Garten + Haus' : ', nur Garten'}`, `${n0(num(r, 'annualYield'))} l`, `${n0(num(r, 'annualDemand'))} l`, `${n0(num(r, 'tankSize'))} l`];
  }),
);
const ZIST_PER_M2 = num(zist(100, 'tile', 0, 'no'), 'annualYield') / 100;
const ZIST_PER_M2_DRY = num(zist(100, 'tile', 0, 'no', 550), 'annualYield') / 100;
const ZIST_GARDEN = zist(120, 'tile', 250, 'no');
const ZIST_HOUSE = zist(120, 'tile', 250, 'yes');

// ---------------------------------------------------------------------------
// Treppe
// ---------------------------------------------------------------------------
const treppe = (h: number, over: Record<string, any> = {}) => run('treppen-stufen-rechner', { calcMode: 'target_height', floorHeight: h, idealStepHeight: 17.5, customRisersCount: 16, stepFormulaConstant: 63, ...over });
const TREPPE_TABLE = table(
  ['Geschosshöhe', 'Steigungen', 'Stufenhöhe s', 'Auftritt a', 'Lauflänge', 'Neigung'],
  [250, 262.5, 275, 280, 300].map((h) => {
    const r = treppe(h);
    return [`${formatNumber(h, 1)} cm`, n0(num(r, 'stepsCount')), `${n2(num(r, 'stepHeight'))} cm`, `${n2(num(r, 'treadDepth'))} cm`, `${n2(num(r, 'runLength'))} m`, `${n1(num(r, 'pitchAngle'))}°`];
  }),
);
const TREPPE_VAR_TABLE = table(
  ['Steigungen bei 280 cm', 'Stufenhöhe', 'Auftritt', 'Lauflänge', 'Neigung'],
  [15, 16, 17].map((k) => {
    const r = treppe(280, { calcMode: 'fixed_risers', customRisersCount: k });
    return [String(k), `${n2(num(r, 'stepHeight'))} cm`, `${n2(num(r, 'treadDepth'))} cm`, `${n2(num(r, 'runLength'))} m`, `${n1(num(r, 'pitchAngle'))}°`];
  }),
);
const TREPPE_275 = treppe(275);
const TREPPE_250 = treppe(250);
const TREPPE_C59 = treppe(280, { stepFormulaConstant: 59 });
const TREPPE_C65 = treppe(280, { stepFormulaConstant: 65 });

// ---------------------------------------------------------------------------
// Gefälle
// ---------------------------------------------------------------------------
const gef = (dist: number, pct: number) => run('drainage-gefaelle-rechner', { distance: dist, calcMode: 'fromPercent', slopePercent: pct });
const gefH = (dist: number, hCm: number) => run('drainage-gefaelle-rechner', { distance: dist, calcMode: 'fromHeight', heightDiffCm: hCm });
const GEF_TABLE = table(
  ['Gefälle', 'Promille', 'cm je Meter', 'Winkel', 'auf 5 m', 'auf 10 m'],
  [0.5, 1, 2, 2.5, 5, 10, 15].map((p) => {
    const r = gef(10, p);
    return [`${formatNumber(p, 1)} %`, `${formatNumber(p * 10, 0)} ‰`, `${n1(num(r, 'cmPerM'))} cm`, `${n2(num(r, 'angleDeg'))}°`, `${n1(num(gef(5, p), 'heightDiff'))} cm`, `${n1(num(r, 'heightDiff'))} cm`];
  }),
);
const GEF_LATTE = num(gef(2, 2), 'heightDiff');
const GEF_MEASURED = gefH(7.5, 12);
const GEF_100 = num(gef(1, 100), 'angleDeg');
const GEF_45DEG_CHECK = num(gef(1, 50), 'angleDeg');

// ---------------------------------------------------------------------------
// Baugrund
// ---------------------------------------------------------------------------
const bau = (load: number, l: number, w: number, soil: string) => run('baugrund-tragfaehigkeit-rechner', { loadKn: load, fundamentLength: l, fundamentWidth: w, soilClass: soil });
const BAU_SOILS: Array<[string, string]> = [['sand', 'Kies/Sand dicht'], ['mediumSand', 'Sand mitteldicht'], ['loamFirm', 'Lehm halbfest'], ['loamSoft', 'Schluff weich']];
const BAU_TABLE = table(
  ['Streifenbreite', 'Bodenpressung', ...BAU_SOILS.map(([, l]) => l)],
  [0.3, 0.4, 0.5, 0.6, 0.8].map((w) => {
    const base = bau(60, 1, w, 'sand');
    return [`${formatNumber(w, 2)} m`, `${n1(num(base, 'sigma'))} kN/m²`, ...BAU_SOILS.map(([s]) => `${n0(num(bau(60, 1, w, s), 'utilization'))} %`)];
  }),
);
const BAU_REQ_WIDTH = 100 / num(bau(100, 1, 1, 'mediumSand'), 'sigmaMax');
const BAU_REQ_WIDTH_SOFT = 100 / num(bau(100, 1, 1, 'loamSoft'), 'sigmaMax');
const BAU_SELF = 2 * 0.8 * 0.8 * 25; // Fundament 2,0 × 0,8 × 0,8 m, Wichte Beton 25 kN/m³ (Rechenwert)
const BAU_WITH_SELF = bau(150 + BAU_SELF, 2, 0.8, 'sand');

// ---------------------------------------------------------------------------
// Holzbalken
// ---------------------------------------------------------------------------
const balken = (span: number, b: number, h: number, e = 0.65, q = 2.5) => run('holz-balken-durchbiegung-rechner', { spanMeters: span, beamWidthCm: b, beamHeightCm: h, beamSpacingM: e, totalLoadKnM2: q });
const BALKEN_HEIGHTS = [16, 18, 20, 22, 24];
const BALKEN_TABLE = table(
  ['Spannweite (Grenze L/300)', ...BALKEN_HEIGHTS.map((h) => `10 × ${h} cm`)],
  [3, 3.5, 4, 4.5, 5].map((s) => [
    `${formatNumber(s, 1)} m (${n1(num(balken(s, 10, 20), 'limit'))} mm)`,
    ...BALKEN_HEIGHTS.map((h) => {
      const r = balken(s, 10, h);
      return `${n1(num(r, 'deflection'))} mm${num(r, 'deflection') <= num(r, 'limit') ? '' : ' ✗'}`;
    }),
  ]),
);
const BALKEN_E65 = num(balken(4.5, 10, 20), 'deflection');
const BALKEN_E50 = num(balken(4.5, 10, 20, 0.5), 'deflection');
const BALKEN_1224 = balken(5, 12, 24);
const BALKEN_W12 = num(balken(4.5, 12, 20), 'deflection');
const BALKEN_H22 = num(balken(4.5, 10, 22), 'deflection');

// ---------------------------------------------------------------------------
// Brennholz
// ---------------------------------------------------------------------------
const holz = (amount: number, unit: string, wood: string) => run('brennholz-raummeter-rechner', { amount, inputUnit: unit, woodType: wood });
const HOLZ_TYPES: Array<[string, string]> = [['beech', 'Buche/Eiche'], ['birch', 'Birke'], ['spruce', 'Fichte/Kiefer']];
const HOLZ_TABLE = table(
  ['Menge', 'entspricht', ...HOLZ_TYPES.map(([, l]) => l)],
  ([[1, 'fm'], [1, 'rm'], [1, 'srm'], [5, 'srm'], [10, 'rm']] as Array<[number, string]>).map(([a, u]) => {
    const r = holz(a, u, 'beech');
    const conv = u === 'fm' ? `${n2(num(r, 'rm'))} RM / ${n2(num(r, 'srm'))} SRM` : u === 'rm' ? `${n2(num(r, 'fm'))} FM / ${n2(num(r, 'srm'))} SRM` : `${n2(num(r, 'fm'))} FM / ${n2(num(r, 'rm'))} RM`;
    return [`${a} ${u.toUpperCase()}`, conv, ...HOLZ_TYPES.map(([w]) => `${n0(num(holz(a, u, w), 'energyKwh'))} kWh`)];
  }),
);
const HOLZ_OIL_PER_RM_BEECH = num(holz(1, 'rm', 'beech'), 'oilEquiv');
const HOLZ_OIL_PER_RM_SPRUCE = num(holz(1, 'rm', 'spruce'), 'oilEquiv');
const HOLZ_RM_FOR_1000L_BEECH = 1000 / HOLZ_OIL_PER_RM_BEECH;
const HOLZ_RM_FOR_1000L_SPRUCE = 1000 / HOLZ_OIL_PER_RM_SPRUCE;
const HOLZ_1RM = holz(1, 'rm', 'beech');
const HOLZ_1RM_SRM_FOR_RM = holz(1, 'srm', 'beech');

// ---------------------------------------------------------------------------
// Putz
// ---------------------------------------------------------------------------
const putz = (area: number, t: number, type: string, sack = '30', waste = 10) => run('putz-rechner', { area, thickness: t, plasterType: type, sackSize: sack, waste });
const PUTZ_TYPES: Array<[string, string]> = [['gypsum', 'Gipsputz'], ['limeCement', 'Kalk-Zement-Putz'], ['cement', 'Zementputz']];
const PUTZ_TABLE = table(
  ['Putzdicke (20 m²)', ...PUTZ_TYPES.map(([, l]) => l)],
  [10, 15, 20].map((t) => [`${t} mm`, ...PUTZ_TYPES.map(([p]) => {
    const r = putz(20, t, p);
    return `${n0(num(r, 'totalKg'))} kg / ${n0(num(r, 'sacks'))} Säcke`;
  })]),
);
const PUTZ_LAIBUNG = (2 * 1.4 + 1.2) * 0.25; // Fenster 1,20 × 1,40 m, 25 cm Laibung, drei Seiten
const PUTZ_10_15 = putz(10, 15, 'limeCement');
const PUTZ_SACK_WATER = num(putz(1, 10, 'limeCement', '30', 0), 'waterReq') / num(putz(1, 10, 'limeCement', '30', 0), 'totalKg') * 30;

// ---------------------------------------------------------------------------
// Fassadenfarbe
// ---------------------------------------------------------------------------
const fassade = (perimeter: number, h: number, open: number, surface: string, coats = '2') => run('fassadenfarbe-rechner', { perimeter, wallHeight: h, openingsArea: open, surface, coats });
const FASS_HOUSES: Array<[string, number, number, number]> = [
  ['Bungalow 12 × 8 m', 40, 3, 24],
  ['Einfamilienhaus 10 × 8 m', 36, 6, 30],
  ['Doppelhaushälfte (3 Außenseiten)', 26, 7, 22],
  ['Mehrfamilienhaus 16 × 12 m', 56, 9, 90],
];
const FASS_TABLE = table(
  ['Haus', 'Netto-Fläche', 'Glatt', '2-mm-Scheibenputz', 'Grober Reibeputz'],
  FASS_HOUSES.map(([label, p, h, o]) => {
    const r = (s: string) => fassade(p, h, o, s);
    const cell = (s: string) => `${n0(num(r(s), 'liters'))} l (${n0(num(r(s), 'buckets10l'))} × 10 l)`;
    return [label, `${n0(num(r('smooth'), 'netArea'))} m²`, cell('smooth'), cell('medium'), cell('rough')];
  }),
);
// Giebel über die mittlere Höhe einrechnen: Haus 10 × 8 m, Traufhöhe 5,5 m, zwei Giebel 8 m breit, 3 m hoch
const FASS_GABLE_AREA = 2 * (8 * 3) / 2;
const FASS_AVG_H = 5.5 + FASS_GABLE_AREA / 36;
const FASS_GABLE = fassade(36, FASS_AVG_H, 30, 'medium');
const FASS_NO_GABLE = fassade(36, 5.5, 30, 'medium');
const FASS_150 = (['smooth', 'medium', 'rough'] as const).map((s) => num(fassade(30, 5, 0, s), 'liters'));
const FASS_PER_M2 = (['smooth', 'medium', 'rough'] as const).map((s) => num(fassade(10, 10, 0, s), 'liters') / 100);

// ---------------------------------------------------------------------------
// Betonrechner: Menge je 10 m² nach Plattendicke (ohne Reserve)
// ---------------------------------------------------------------------------
const beton = (depthCm: number, over: Record<string, any>) =>
  run('betonrechner', { lengthM: 5, widthM: 2, depthCm, reservePercent: '0', ...over });
const BETON_DICKEN = [8, 10, 12, 15, 20, 25];
const BETON_TABLE = table(
  ['Dicke', 'Beton für 10 m²', 'Fertigbeton 25 kg', 'Fertigbeton 40 kg', 'Zement 25 kg (C20/25, selbst gemischt)'],
  BETON_DICKEN.map((d) => {
    const m3 = Number(beton(d, { supplyMode: 'transport' }).primary.value);
    const s25 = num(beton(d, { supplyMode: 'bags', bagWeightKg: 25 }), 'bags');
    const s40 = num(beton(d, { supplyMode: 'bags', bagWeightKg: 40 }), 'bags');
    const zement = num(beton(d, { supplyMode: 'mix', mixRatio: 'standard' }), 'cementSacks');
    return [`${d} cm`, `${n2(m3)} m³`, `${n0(s25)} Säcke`, `${n0(s40)} Säcke`, `${n0(zement)} Säcke`];
  }),
);
const BETON_1M3_FRESH = num(run('betonrechner', { lengthM: 1, widthM: 1, depthCm: 100, reservePercent: '0', supplyMode: 'transport' }), 'freshWeight');
const BETON_1M3_DRY = num(run('betonrechner', { lengthM: 1, widthM: 1, depthCm: 100, reservePercent: '0', supplyMode: 'bags', bagWeightKg: 25 }), 'weight');
const BETON_10_10 = beton(10, { supplyMode: 'bags', bagWeightKg: 25 });
const BETON_10_10_RES = run('betonrechner', { lengthM: 5, widthM: 2, depthCm: 10, reservePercent: '10', supplyMode: 'bags', bagWeightKg: 25 });

// ---------------------------------------------------------------------------
// Kies & Splitt: Gewicht für 10 m² bei Beispiel-Schichtdicken
// ---------------------------------------------------------------------------
const kies = (over: Record<string, any>) => run('kies-splitt-rechner', { compaction: 0, ...over });
const KIES_BEISPIELE: Array<[string, string, number]> = [
  ['Splitt 2/5 (Pflasterbett)', 'grit_2_5', 4],
  ['Kies 16/32 (Zierkies, Wegdecke)', 'gravel_16_32', 5],
  ['Schotter 0/32 (Tragschicht)', 'crushed_0_32', 20],
  ['Sand 0/2 (Fugen- oder Bettungssand)', 'sand_0_2', 3],
  ['Rindenmulch (Beet)', 'bark', 7],
];
const KIES_TABLE = table(
  ['Material', 'Schicht (Beispiel)', 'Volumen für 10 m²', 'Gewicht für 10 m²', 'Rechenwert Schüttdichte'],
  KIES_BEISPIELE.map(([label, mat, depth]) => {
    const r = kies({ calcMode: 'area_depth', area: 10, depth, materialType: mat });
    return [label, `${depth} cm`, `${n2(num(r, 'totalVolume'))} m³`, `${n2(Number(r.primary.value))} t`, `${n2(num(r, 'densityUsed'))} t/m³`];
  }),
);
const KIES_1T = kies({ calcMode: 'weight_to_volume', knownWeightTonnes: 1, materialType: 'grit_2_5' });
const KIES_1T_M3 = Number(KIES_1T.primary.value);

// ---------------------------------------------------------------------------
// Schalungssteine: Bedarf je laufendem Meter Mauer
// ---------------------------------------------------------------------------
const schal = (over: Record<string, any>) =>
  run('schalungssteine-rechner', { wallType: 'straight', wallLength: 1, stoneReserve: 0, concreteReserve: 0, openingsArea: 0, ...over });
const SCHAL_HOEHEN = [0.5, 1, 1.5, 2];
const SCHAL_TABLE = table(
  ['Mauerhöhe', '50 × 25 cm (z. B. Beyhl 24): Steine', 'Füllbeton', '50 × 20 cm (Delfing DP 24): Steine', 'Füllbeton'],
  SCHAL_HOEHEN.map((h) => {
    const b = schal({ wallHeight: h, fillMode: 'preset_beyhl24' });
    const d = schal({ wallHeight: h, fillMode: 'preset_delfing24' });
    return [`${formatNumber(h, 2)} m`, n0(num(b, 'baseStones')), `${n0(num(b, 'concreteBaseM3') * 1000)} l`, n0(num(d, 'baseStones')), `${n0(num(d, 'concreteBaseM3') * 1000)} l`];
  }),
);
const schalProStein = (fillMode: string) => {
  const r = schal({ wallLength: 2, wallHeight: 1, fillMode });
  return (num(r, 'concreteBaseM3') * 1000) / num(r, 'baseStones');
};
const SCHAL_L_BEYHL = schalProStein('preset_beyhl24');
const SCHAL_L_DELFING = schalProStein('preset_delfing24');
const SCHAL_L_BEYHL175 = schalProStein('preset_beyhl175');
const SCHAL_L_DELFING175 = schalProStein('preset_delfing175');

export const BAUEN_PAGE_CONTENT: PageContentMap = {
  'farbmengen-rechner': {
    sections: [
      {
        title: 'Farbbedarf für typische Zimmer',
        content: `Die Tabelle zeigt, was der Rechner für gängige Zimmergrößen mit 2,50 m Raumhöhe ausgibt: zwei Anstriche, 7 m² Ergiebigkeit pro Liter und 10 % Reserve. Die Abzüge für Fenster und Türen sind Beispielwerte.\n\n${FARBE_TABLE}\n\nAuffällig ist, wie stark die Decke ins Gewicht fällt: Im Zimmer mit 5 × 4 m kommen allein durch die Decke ${n1(FARBE_CEIL_DIFF)} Liter dazu. Wer Decke und Wände in unterschiedlichen Farbtönen streicht, sollte beide Mengen getrennt berechnen und getrennt kaufen.`,
      },
      {
        title: 'Die Ergiebigkeit auf dem Eimer richtig einsetzen',
        content: `Die Angabe „m² pro Liter“ bezieht sich auf einen Anstrich auf glattem, gleichmäßig saugendem Untergrund. Auf Raufaser, frischem Putz oder Gipskarton ohne Grundierung wird mehr Farbe verbraucht.\n\n- Für den Raum 5 × 4 m ergibt 7 m²/l rund ${n1(FARBE_COV7)} Liter (${n0(FARBE_COV7_B10)} × 10-Liter-Eimer).\n- Mit 5 m²/l, wie es auf stark saugender Raufaser vorkommen kann, sind es ${n1(FARBE_COV5)} Liter, also ${n1(FARBE_COV5 - FARBE_COV7)} Liter mehr. ${FARBE_COV5_B10 > FARBE_COV7_B10 ? `Dann reichen ${n0(FARBE_COV7_B10)} Eimer nicht mehr, es werden ${n0(FARBE_COV5_B10)}.` : `Die ${n0(FARBE_COV5_B10)} Zehn-Liter-Eimer reichen dann nur noch knapp; für Ausbesserungen bleibt kaum Rest.`}\n- Geben Sie bei Spannen auf dem Etikett („6 bis 8 m²/l“) den unteren Wert ein, wenn der Untergrund rau oder unbehandelt ist.\n\nEin Probeanstrich auf einem Quadratmeter zeigt schnell, ob die Herstellerangabe auf Ihrer Wand hinkommt.`,
      },
    ],
    faqs: [
      { question: 'Wie viel Farbe brauche ich für 50 m² Wand?', answer: `Bei zwei Anstrichen und 7 m²/l sind es rechnerisch ${n1(num(FARBE_50_EXACT, 'paintLiters'))} Liter, mit 10 % Reserve ${n1(num(FARBE_50, 'paintLiters'))} Liter. Ein 10-Liter-Eimer reicht also nicht; kaufen Sie ${n0(num(FARBE_50, 'buckets10'))} Eimer à 10 Liter oder einen 10-Liter- und einen 5-Liter-Eimer.` },
      { question: 'Muss ich die Decke mitrechnen, wenn ich nur einmal darüber rolle?', answer: `Ja, aber mit eigener Anstrichzahl. Der Rechner verwendet für Wände und Decke dieselbe Zahl an Anstrichen. Streichen Sie die Decke nur einmal, rechnen Sie Wände und Decke in zwei Durchgängen: im Beispielraum 5 × 4 m macht die Decke bei zwei Anstrichen ${n1(FARBE_CEIL_DIFF)} Liter aus, bei einem Anstrich die Hälfte.` },
    ],
  },

  'bodenbelag-rechner': {
    sections: [
      {
        title: 'Quadratmeter und Pakete für gängige Raumgrößen',
        content: `Die Werte gelten für Pakete mit 2,22 m² Inhalt, wie sie bei Laminat häufig vorkommen. Der Rechner rundet immer auf volle Pakete auf.\n\n${BODEN_TABLE}\n\nZwischen 5 und 15 % Verschnitt liegen bei großen Räumen schnell zwei Pakete. Bei gerader Verlegung in einem rechteckigen Raum reicht meist der niedrige Wert, für Diagonalverlegung, Schrägen und viele Türzargen ist der höhere sinnvoll.`,
      },
      {
        title: 'Verwinkelte Räume und Flure richtig aufteilen',
        content: `Ein L-förmiges Wohnzimmer oder ein Flur mit Nische lässt sich nicht als ein Rechteck eingeben. Teilen Sie die Fläche in Rechtecke und rechnen Sie jedes Teil einzeln:\n\n- Teil 1: 4,20 × 3,10 m ergibt ${n2(num(BODEN_L1, 'totalSqm'))} m² inklusive 10 % Verschnitt (${n0(num(BODEN_L1, 'packs'))} Pakete).\n- Teil 2: 2,40 × 1,80 m ergibt ${n2(num(BODEN_L2, 'totalSqm'))} m² (${n0(num(BODEN_L2, 'packs'))} Pakete).\n\nEinzeln aufgerundet wären das ${BODEN_L_SEP_PACKS} Pakete. Addiert man die Quadratmeter (${n2(BODEN_L_SUM_SQM)} m²) und rundet erst dann, kommt man auf ${BODEN_L_JOINT_PACKS} Pakete. Wenn die Teilflächen ohne Übergangsprofil durchgehend verlegt werden, genügt die gemeinsame Rundung, weil Reststücke im anderen Teil weiterverwendet werden.\n\nDie Sockelleisten-Angabe des Rechners ist der Raumumfang plus 10 %. Türöffnungen ziehen Sie davon selbst ab.`,
      },
    ],
    faqs: [
      { question: 'Wie viele Pakete Laminat brauche ich für 20 m²?', answer: `Für einen Raum von 5 × 4 m mit 10 % Verschnitt ergibt der Rechner ${n2(num(BODEN_20, 'totalSqm'))} m², bei 2,22 m² je Paket also ${n0(num(BODEN_20, 'packs'))} Pakete. Bei anderem Paketinhalt geben Sie den Wert vom Etikett ein, da sich die Paketzahl sonst verschiebt.` },
      { question: 'Wie viele Meter Sockelleiste brauche ich für ein 5 × 4 m Zimmer?', answer: `Der Umfang beträgt 18 m, mit 10 % Zuschlag für Gehrungsschnitte und Verschnitt gibt der Rechner ${n1(num(BODEN_SKIRT, 'skirting'))} laufende Meter aus. Ziehen Sie für jede Tür die Durchgangsbreite ab, bei einer Standardtür etwa 0,9 m.` },
    ],
  },

  'estrich-rechner': {
    sections: [
      {
        title: 'Materialbedarf und Belegreife für 20 m² Zementestrich',
        content: `Berechnet mit 5 % Zuschlag für Unebenheiten. Die Belegreife ist die Faustregel des Rechners für Zementestrich (eine Woche je Zentimeter bis 4 cm, danach zwei Wochen je weiterem Zentimeter) und ersetzt keine Feuchtemessung.\n\n${ESTRICH_TABLE}\n\nDie Tabelle zeigt, warum dicke Heizestriche Zeitpläne sprengen: Zwischen 45 und 65 mm verdoppelt sich die geschätzte Wartezeit nahezu, obwohl die Materialmenge nur um gut 40 % steigt.`,
      },
      {
        title: 'Zementestrich oder Calciumsulfat-Fließestrich?',
        content: `Der Rechner unterscheidet beide Arten nur über die Dichte: Für 20 m² und 50 mm braucht Zementestrich ${n2(num(ESTRICH_CT_50, 'weightTonnes'))} t, Calciumsulfat-Fließestrich ${n2(num(ESTRICH_CA_50, 'weightTonnes'))} t Material. In der Praxis unterscheiden sie sich stärker:\n\n- **Calciumsulfat-Fließestrich** wird meist vom Fachbetrieb gepumpt und ist in Säcken eher für kleine Flächen üblich. Er ist feuchteempfindlich und gehört nicht in dauerhaft nasse Bereiche.\n- **Zementestrich** ist in Sackware im Baumarkt erhältlich und auch für Keller und Außenbereiche geeignet.\n- Die Trocknungs-Faustregel im Rechner gilt für Zementestrich. Für Calciumsulfatestrich nennt das Produktdatenblatt eigene Werte; vor dem Belegen entscheidet bei beiden die CM-Messung.\n\nPrüfen Sie außerdem die Ergiebigkeit auf dem Sack: Hersteller geben an, wie viele Liter Frischmörtel ein Sack ergibt. Weicht der Wert von der hier angesetzten Dichte ab, gilt der Wert auf dem Sack.`,
      },
    ],
    faqs: [
      { question: 'Wie viel wiegt Estrich pro Quadratmeter – hält das meine Decke aus?', answer: `Bei 45 mm Zementestrich rechnet der Rechner mit ${n0(num(ESTRICH_1M2_45, 'weightTonnes') * 1000)} kg pro m², bei 65 mm mit ${n0(num(ESTRICH_1M2_65, 'weightTonnes') * 1000)} kg pro m². Auf Holzbalkendecken im Altbau ist das eine erhebliche Zusatzlast. Ob die Decke sie trägt, muss ein Statiker prüfen; als leichtere Alternative kommen Trockenestrichplatten in Frage.` },
      { question: 'Wie viele Säcke Estrich brauche ich für 10 m² bei 4 cm?', answer: `Mit 5 % Reserve sind es ${n2(num(ESTRICH_10_40, 'volume'))} m³ bzw. ${n2(num(ESTRICH_10_40, 'weightTonnes'))} t, also ${n0(num(ESTRICH_10_40, 'sacks'))} Säcke à 25 kg. Bei dieser Menge lohnt es sich, die Lieferung auf Palette mit Hebebühne oder Abladeservice zu bestellen.` },
    ],
  },

  'daemmung-u-wert-rechner': {
    sections: [
      {
        title: 'U-Werte nach Dämmdicke und Wärmeleitgruppe',
        content: `Die Werte stammen aus dem Rechner und berücksichtigen nur die Dämmschicht plus Übergangswiderstände (0,17 m²K/W). Angaben in W/(m²·K):\n\n${U_TABLE}\n\nMindestdicke, mit der allein die Dämmschicht den GEG-Höchstwert bei Änderung eines Bauteils erreicht:\n\n${U_REQ_TABLE}\n\nDie Höchstwerte stammen aus Anlage 7 des Gebäudeenergiegesetzes: 0,24 W/(m²·K) für Außenwände, Dachflächen und oberste Geschossdecken, 0,30 W/(m²·K) für Decken und Wände gegen unbeheizte Räume.`,
      },
      {
        title: 'Was die Rechnung vereinfacht',
        content: `Der Rechner betrachtet nur die neue Dämmschicht. Das ist eine Rechnung auf der sicheren Seite, hat aber Grenzen:\n\n- **Bestehende Schichten** wie Mauerwerk, Putz oder Holzschalung erhöhen den Wärmedurchlasswiderstand. Der echte U-Wert der Wand ist deshalb niedriger als hier angezeigt.\n- **Sparren und Holzständer** unterbrechen die Dämmung. Bei Zwischensparrendämmung liegt der U-Wert des ganzen Dachs höher als der Wert der reinen Dämmung.\n- **Flachdächer mit Abdichtung** haben im GEG einen strengeren Wert von 0,20 W/(m²·K), der hier nicht auswählbar ist.\n- **Kellerdecke von oben:** Wird nur der Fußbodenaufbau auf der beheizten Seite erneuert, nennt Anlage 7 einen Höchstwert von 0,50 W/(m²·K).\n- Für mehrere Maßnahmen entfällt die Anforderung, wenn das Bauteil nach dem 31.12.1983 schon unter energiesparrechtlichen Vorschriften errichtet oder erneuert wurde.\n\nFür Förderanträge gelten eigene technische Mindestanforderungen; den verbindlichen Nachweis erstellt der Energieberater.`,
      },
    ],
    faqs: [
      { question: 'Wie dick muss die Dämmung für einen U-Wert von 0,24 sein?', answer: `Mit Dämmstoff der WLG 035 rechnet der Rechner mit mindestens ${n0(U_REQ_035)} mm, wenn nur die Dämmschicht zählt. Weil die vorhandene Wand ebenfalls dämmt, reicht in der Praxis oft etwas weniger; das ergibt die Berechnung des gesamten Wandaufbaus.` },
      { question: 'Lohnt sich dickere Dämmung immer?', answer: `Der Gewinn wird mit jedem Zentimeter kleiner. Von 80 auf 120 mm (WLG 035) sinkt der U-Wert von ${n3(U_80)} auf ${n3(U_120)} W/(m²·K), von 160 auf 200 mm nur noch von ${n3(U_160)} auf ${n3(U_200)} W/(m²·K). Dickere Platten bedeuten außerdem tiefere Fensterlaibungen und längere Dübel.` },
    ],
  },

  'bausteine-mauerwerk-rechner': {
    sections: [
      {
        title: 'Steine und Mörtel für 10 m² Wand nach Format',
        content: `Berechnet für eine Wand von 4,00 × 2,50 m ohne Öffnungen mit 5 % Bruchreserve. Der Mörtel ist ein Rechenwert des Rechners; die Verbrauchsangabe des Herstellers geht vor.\n\n${STEIN_TABLE}\n\nKleinformate brauchen nicht nur mehr Steine, sondern vor allem viel mehr Mörtel und Arbeitszeit: Bei NF werden auf derselben Fläche sechsmal so viele Steine gesetzt wie bei Plansteinen.`,
      },
      {
        title: 'Wanddicke: Wann sich die Steinzahl verdoppelt',
        content: `Die Stückzahlen pro m² beziehen sich auf die Ansichtsfläche der Wand. Bei 2DF und NF geht der Rechner davon aus, dass die Wand so dick ist wie der Stein breit, also 11,5 cm.\n\n- Eine 24 cm dicke Wand aus 2DF- oder NF-Steinen wird im Verband aus Läufern und Bindern gemauert. Dabei liegen über die Wanddicke zwei Steinbreiten nebeneinander, die Steinzahl verdoppelt sich ungefähr: Statt ${STEIN_2DF_10} 2DF-Steinen für 10 m² sind es rund ${STEIN_2DF_10 * 2}.\n- Plansteine gibt es dagegen direkt in Wanddicke (24 cm, 36,5 cm). Hier bleibt die Stückzahl pro m² gleich, nur Gewicht und Dünnbettmörtel steigen.\n- Stürze über Fenstern und Türen, Ringanker und Rollladenkästen ersetzen Steine. Für eine genaue Bestellung ziehen Sie deren Ansichtsfläche wie eine Öffnung ab.`,
      },
    ],
    faqs: [
      { question: 'Wie viele Plansteine brauche ich für eine 6 m lange Wand mit Tür?', answer: `Bei 2,50 m Höhe und 3 m² Abzug für Tür oder Fenster bleiben ${n2(STEIN_DEFAULT_NET)} m² Mauerwerk. Mit 5 % Reserve ergibt das ${n0(num(STEIN_DEFAULT, 'stones'))} Plansteine (24er) und ${n0(num(STEIN_DEFAULT, 'mortar'))} kg Dünnbettmörtel.` },
      { question: 'Wie viel Reserve sollte ich bei Mauerziegeln einplanen?', answer: `Für gerade Wände reichen meist 5 %, bei vielen Ecken, Öffnungen und Schrägen eher 10 %. Für 20 m² NF-Mauerwerk macht das ${n0(STEIN_W10 - STEIN_W5)} Steine Unterschied (${n0(STEIN_W5)} statt ${n0(STEIN_W10)}). Ganze Paletten lassen sich oft zurückgeben; fragen Sie beim Händler vorher nach den Bedingungen.` },
    ],
  },

  'fliesenkleber-rechner': {
    sections: [
      {
        title: 'Kleberbedarf nach Fläche und Zahnung',
        content: `Werte inklusive 10 % Reserve, gerundet auf ganze 25-kg-Säcke. Die Verbrauchswerte je Zahnung sind Richtwerte des Rechners; das Datenblatt des Klebers geht vor.\n\n${KLEBER_TABLE}\n\nEin kleines Bad mit 6 m² Boden (10-mm-Zahnung) und 22 m² Wandfliesen (6-mm-Zahnung) braucht zusammen ${n1(KLEBER_BAD_KG)} kg Kleber. Rechnen Sie Boden und Wand getrennt, weil sich die Zahnung meist unterscheidet.`,
      },
      {
        title: 'Fugenmörtel genauer berechnen',
        content: `Der Rechner setzt pauschal 0,15 kg Fugenmörtel je m² und Millimeter Fugenbreite an. Tatsächlich hängt der Bedarf stark vom Fliesenformat ab, denn kleine Fliesen haben viel mehr Fugenmeter. Die exakte Formel lautet:\n\n**Fugenmörtel (kg/m²) = (Länge + Breite) / (Länge × Breite) × Fugenbreite × Fugentiefe × Dichte**\n\nMit 3 mm Fugenbreite und einer Dichte von 1,7 kg/dm³ als Beispielwert:\n\n${GROUT_TABLE}\n\nBei Mosaik liegt der Bedarf also deutlich über der Pauschale, bei Großformaten deutlich darunter. Die Dichte des Fugenmörtels steht im Datenblatt, häufig mit einem eigenen Verbrauchsrechner des Herstellers.`,
      },
    ],
    faqs: [
      { question: 'Reicht ein 25-kg-Sack Fliesenkleber für ein kleines Bad?', answer: `Meist nicht. Schon 6 m² Bodenfläche mit 10-mm-Zahnung brauchen laut Rechner ${n1(num(KLEBER_BAD_FLOOR, 'adhesiveKg'))} kg; kommen 22 m² Wandfliesen mit 6-mm-Zahnung dazu (${n1(num(KLEBER_BAD_WALL, 'adhesiveKg'))} kg), sind es insgesamt ${n0(Math.ceil(KLEBER_BAD_KG / 25))} Säcke.` },
      { question: 'Warum brauche ich bei Mosaik mehr Fugenmörtel als bei großen Fliesen?', answer: `Weil die Fugenlänge pro Quadratmeter mit kleiner werdender Fliese stark wächst: 10 × 10 cm ergeben 20 m Fuge je m², 60 × 60 cm nur gut 3 m. Bei 3 mm Fugenbreite sind das rechnerisch ${n2(groutExact(0.1, 0.1, 6))} kg/m² gegenüber ${n2(groutExact(0.6, 0.6, 10))} kg/m².` },
    ],
  },

  'aushub-erdarbeiten-rechner': {
    sections: [
      {
        title: 'Aushubmengen typischer Vorhaben (Lehmboden)',
        content: `Berechnet mit Auflockerungsfaktor 1,25 und 1,8 t/m³ Festdichte für Lehm sowie 18 t Nutzlast je Fahrt:\n\n${AUSHUB_TABLE}\n\nSchon der Mutterbodenabtrag unter einem Einfamilienhaus füllt mehrere LKW. Nach § 202 Baugesetzbuch ist ausgehobener Mutterboden in nutzbarem Zustand zu erhalten und vor Vernichtung oder Vergeudung zu schützen. Er wird deshalb getrennt gelagert und nicht mit dem Unterboden abgefahren.`,
      },
      {
        title: 'Böschung und Arbeitsraum vergrößern die Grube',
        content: `Der Rechner geht von senkrechten Grubenwänden aus. Tiefere Baugruben werden aber geböscht oder verbaut, und rund um einen Keller braucht es Arbeitsraum für Abdichtung und Drainage.\n\nBeispiel: Grubensohle 10 × 8 m, 2 m tief, Böschung mit 45° auf allen Seiten. Oben ist die Grube dann 14 × 12 m groß. Das Volumen nach der Prismatoidformel V = T/6 · (A unten + 4 · A Mitte + A oben):\n\n- Senkrecht ausgehoben: ${n1(num(BOE_STRAIGHT, 'solidVolume'))} m³ fest, ${n0(num(BOE_STRAIGHT, 'trucks'))} Fahrten\n- Mit Böschung: ${n1(BOE_VOL)} m³ fest, ${n1(num(BOE_SLOPED, 'looseVolume'))} m³ lose, ${n0(num(BOE_SLOPED, 'trucks'))} Fahrten\n\nDie Böschung bringt hier also rund ${n0((BOE_VOL / num(BOE_STRAIGHT, 'solidVolume') - 1) * 100)} % mehr Aushub. Welcher Böschungswinkel zulässig ist, hängt vom Boden ab und wird vor Ort vom Fachbetrieb festgelegt.`,
      },
    ],
    faqs: [
      { question: 'Wie schwer ist ein Kubikmeter Erde?', answer: `Der Rechner setzt im gewachsenen Zustand ${AUSHUB_1M3.map((x) => `${formatNumber(x.t, 1)} t (${x.s === 'sand' ? 'Sand/Kies' : x.s === 'loam' ? 'Lehm' : 'Ton'})`).join(', ')} an. Nach dem Ausheben verteilt sich dieses Gewicht auf mehr Volumen: Ein Kubikmeter loser Lehm wiegt dann rund ${formatNumber(AUSHUB_1M3[1].t / AUSHUB_1M3[1].loose, 2)} t. Nasser Boden ist schwerer.` },
      { question: 'Wird bei der Entsorgung nach Kubikmetern oder Tonnen abgerechnet?', answer: 'Beides kommt vor. Container werden meist nach Volumen bestellt, Deponien rechnen oft nach Gewicht ab. Für Container zählt deshalb das lose Volumen aus dem Rechner, für Deponierechnungen das Gewicht. Belasteter Boden oder Bauschutt im Aushub wird gesondert behandelt.' },
    ],
  },

  'pflastersteine-rechner': {
    sections: [
      {
        title: 'Steinbedarf nach Fläche und Format',
        content: `Berechnet mit 8 % Verschnitt und 4 cm Splittbett (1,6 t/m³ als Rechenwert):\n\n${PFL_TABLE}\n\nRandsteine, Rasenkantensteine und die Tragschicht aus Schotter sind darin nicht enthalten. Die Schottermenge ermitteln Sie mit dem [Kies- und Splitt-Rechner](/rechner/kies-splitt-rechner/).`,
      },
      {
        title: 'Warum die Herstellerangabe pro m² etwas niedriger ist',
        content: `Der Rechner teilt die Fläche durch das Nennmaß der Steine, also 50 Steine je m² bei 20 × 10 cm. Pflaster wird aber mit Fuge verlegt. Mit 4 mm Fuge belegt ein Stein 20,4 × 10,4 cm, und auf einen Quadratmeter passen nur noch rund ${n1(PFL_JOINT_STONES)} Steine.\n\n- Händler geben Pflaster deshalb meist in m² oder als „Stück je m² inklusive Fuge“ an. Bestellen Sie nach m², nutzen Sie die Bestellfläche inklusive Verschnitt aus dem Rechner.\n- Pflaster wird lagenweise auf Paletten geliefert. Mischen Sie beim Verlegen aus mehreren Paletten, damit Farbunterschiede zwischen Chargen nicht als Flecken sichtbar werden.\n- Der Splitt wird lose eingebaut und abgezogen. Bestellen Sie ihn nach Tonnen; ein Big Bag fasst je nach Lieferant unterschiedlich viel.`,
      },
    ],
    faqs: [
      { question: 'Wie viel Splitt brauche ich pro m² Pflaster?', answer: `Bei 4 cm Bettung rechnet der Rechner mit ${n0(PFL_1M2 * 1000)} kg Splitt je m², bei 5 cm mit ${n0(PFL_1M2_5 * 1000)} kg. Für 40 m² Einfahrt sind das bei 4 cm also gut 2,5 Tonnen.` },
      { question: 'Wie viele Pflastersteine brauche ich für einen PKW-Stellplatz?', answer: `Ein Stellplatz von 2,50 × 5,00 m hat 12,5 m². Mit 8 % Verschnitt ergibt der Rechner ${n2(num(PFL_STELL, 'effectiveArea'))} m² und ${n0(num(PFL_STELL, 'stones'))} Rechteckpflaster 20 × 10 cm sowie ${n2(num(PFL_STELL, 'gritTonnes'))} t Splitt.` },
    ],
  },

  'trockenbau-gipskarton-rechner': {
    sections: [
      {
        title: 'Material für Ständerwände gängiger Länge',
        content: `Werte für 2,60 m Raumhöhe, Einmannplatten 2.600 × 600 mm und 10 % Verschnitt. Die CW-Ständer stehen im Abstand von 60 cm.\n\n${TB_TABLE}\n\nDie Plattenzahl verdoppelt sich mit der zweiten Lage, das Ständerwerk bleibt gleich. Profillängen sind in laufenden Metern angegeben; im Handel gibt es Profile in festen Längen, deshalb fällt beim Zuschnitt weiterer Rest an.`,
      },
      {
        title: 'Was zusätzlich auf die Einkaufsliste gehört',
        content: `Der Rechner deckt Platten, Profile, Schrauben und Spachtel ab. Für eine fertige Wand fehlen noch einige Posten:\n\n- **Türöffnung:** Für eine Tür in der Ständerwand werden verstärkte UA-Profile und ein Sturz aus UW-Profil eingebaut. Die Plattenfläche der Öffnung zieht der Rechner nicht ab; bei einer Tür ist das ungefähr 2 m² pro Seite und Lage.\n- **Dämmung:** Mineralwolle im Ständerfach verbessert den Schallschutz. Sie wird nach der Wandfläche gekauft, also Länge × Höhe.\n- **Anschlussdichtung** unter UW- und an den Rand-CW-Profilen sowie Dübel oder Schrauben für die Befestigung an Boden, Decke und Wand.\n- **Fugendeckstreifen** und Kantenschutzprofile für Außenecken, je nach Spachtelsystem.\n\nIn Feuchträumen kommen imprägnierte Platten und eine Abdichtung im Spritzwasserbereich dazu.`,
      },
    ],
    faqs: [
      { question: 'Wie viele Gipskartonplatten brauche ich für 10 m² Wand?', answer: `Für 4 × 2,50 m mit Einmannplatten (1,56 m²) und 10 % Verschnitt ergibt der Rechner bei einfacher Beplankung auf beiden Seiten ${n0(num(TB_10_SINGLE, 'plates'))} Platten, bei doppelter Beplankung ${n0(num(TB_10_DOUBLE, 'plates'))} Platten.` },
      { question: 'Großformatplatte oder Einmannplatte – was brauche ich weniger?', answer: `Für eine 5 m lange, doppelt beplankte Wand mit 2,50 m Höhe sind es ${n0(num(TB_BIG, 'plates'))} Großformatplatten (2.500 × 1.250 mm) oder ${n0(num(TB_SMALL, 'plates'))} Einmannplatten. Großformate ergeben weniger Fugen und mit 62,5 cm Achsabstand ${n0(num(TB_BIG, 'cwProfiles'))} statt ${n0(num(TB_SMALL, 'cwProfiles'))} CW-Ständer, lassen sich aber kaum allein an die Wand heben.` },
    ],
  },

  'fundament-rechner': {
    sections: [
      {
        title: 'Betonmengen für typische Gartenprojekte',
        content: `Berechnet mit 80 cm Tiefe (Platte 15 cm) und 10 % Zuschlag. Punktfundamente sind quadratisch angesetzt.\n\n${FUND_TABLE}\n\nAb 1,5 m³ schlägt der Rechner Transportbeton vor; die Garage mit 20 m Streifen käme sonst auf ${n0(num(fund('strip', 20, 0.4, 0.8), 'sacks'))} Säcke. Bei Fahrmischern gilt: Zufahrt, Pumpe oder Schubkarren-Weg vorher klären.`,
      },
      {
        title: 'Runde Fundamente und die Frage nach der Statik',
        content: `Wer Punktfundamente mit Schalrohren oder einem Erdbohrer herstellt, bekommt runde Querschnitte. Der Rechner rechnet quadratisch; multiplizieren Sie das Ergebnis mit π/4 ≈ 0,785. Ein Fundament mit 40 cm Kantenlänge und 80 cm Tiefe hat ${n3(num(FUND_ONE, 'volume'))} m³, ein rundes mit 40 cm Durchmesser nur ${n3(FUND_ONE_ROUND)} m³.\n\nDer Rechner ermittelt nur das Betonvolumen. Wie groß ein Fundament sein muss, ob es bewehrt wird und welche Betonfestigkeit nötig ist, hängt von Lasten und Baugrund ab. Für Garagen, Carports, Wintergärten und alle anderen genehmigungspflichtigen oder tragenden Bauteile legt das der Statiker bzw. Tragwerksplaner fest. Für Zaunsysteme und Fertigteile wie Gartenhäuser nennen die Hersteller meist eigene Fundamentmaße in der Montageanleitung.`,
      },
    ],
    faqs: [
      { question: 'Wie viel Beton brauche ich für ein Punktfundament 40 × 40 × 80 cm?', answer: `Ohne Zuschlag ${n3(num(FUND_ONE, 'volume'))} m³ bzw. ${n0(num(FUND_ONE, 'sacks'))} Säcke Trockenbeton à 25 kg. Das Gewicht des Frischbetons liegt bei rund ${n0(num(FUND_ONE, 'weight') * 1000)} kg.` },
      { question: 'Ab wann lohnt sich Transportbeton statt Sackware?', answer: `Der Rechner schlägt Transportbeton ab 1,5 m³ vor. Das entspricht ${n0(FUND_15_SACKS)} Säcken à 25 kg, rund ${n1(FUND_15_SACKS * 25 / 1000)} t Material, das von Hand bewegt und gemischt werden müsste. Darunter ist Sackware mit Mischer meist praktikabel.` },
    ],
  },

  'zaun-pfosten-rechner': {
    sections: [
      {
        title: 'Matten, Pfosten und Beton nach Zaunlänge',
        content: `Torbreite je 1 m, Beton laut Rechner 2 Säcke à 25 kg je Pfosten bis 1,23 m Höhe und 3 Säcke ab 1,63 m:\n\n${ZAUN_TABLE}\n\nTorpfosten sind nicht enthalten, weil sie meist zum Torset gehören. Prüfen Sie beim Kauf, ob das bei Ihrem Tor so ist.`,
      },
      {
        title: 'Bei Ecken jede Seite einzeln rechnen',
        content: `Der Rechner teilt die gesamte Zaunlänge durch 2,50 m. Bei mehreren Seiten kann das zu wenig Matten ergeben, weil jede Seite für sich aufgerundet werden muss.\n\nBeispiel: Drei Seiten mit je 8,30 m.\n\n- Gesamtlänge 24,90 m mit 2 Ecken: Der Rechner liefert ${n0(num(ZAUN_TOTAL, 'matten'))} Matten und ${n0(num(ZAUN_TOTAL, 'posts'))} Pfosten.\n- Seitenweise: Jede Seite braucht ${ZAUN_SIDE_MATTEN} Matten, zusammen ${ZAUN_SIDES_MATTEN} Matten. Pfosten: je Seite ${n0(num(ZAUN_SIDE, 'posts'))}, abzüglich der zwei geteilten Eckpfosten ${ZAUN_SIDES_POSTS}.\n\nDie letzte Matte jeder Seite wird gekürzt. Ein Reststück lässt sich auf einer anderen Seite nur verwenden, wenn es lang genug ist und Sie es selbst zuschneiden. Rechnen Sie daher bei verwinkeltem Verlauf jede Seite mit dem Rechner einzeln und addieren Sie die Ergebnisse.`,
      },
    ],
    faqs: [
      { question: 'Wie viele Doppelstabmatten brauche ich für 30 m Zaun?', answer: `Ohne Tor und Ecken ergibt der Rechner ${n0(num(ZAUN_30, 'matten'))} Matten à 2,50 m und ${n0(num(ZAUN_30, 'posts'))} Pfosten. Bei 1,23 m Höhe kommen ${n0(num(ZAUN_30, 'concrete'))} Säcke Beton dazu.` },
      { question: 'Wie viel Beton brauche ich pro Zaunpfosten?', answer: 'Der Rechner plant 2 Säcke à 25 kg je Pfosten bei Zaunhöhen bis 1,23 m und 3 Säcke bei 1,63 m und 1,83 m, weil hohe Zäune mehr Windlast aufnehmen. Wie tief und breit das Pfostenloch sein soll, steht in der Montageanleitung des Zaunsystems.' },
    ],
  },

  'regenwasser-zisterne-rechner': {
    sections: [
      {
        title: 'Zisternengröße nach Dach und Nutzung',
        content: `Berechnet mit 750 mm Jahresniederschlag und 250 m² Garten:\n\n${ZIST_TABLE}\n\nBei reiner Gartennutzung begrenzt fast immer der Bedarf die Größe, weil schon ein mittleres Dach weit mehr Wasser liefert, als der Garten braucht. Mit Hausnutzung rückt der Ertrag in den Vordergrund: Ein Gründach hält einen großen Teil des Regens zurück und liefert entsprechend weniger.`,
      },
      {
        title: 'So lesen Sie das Ergebnis',
        content: `Der Rechner nimmt den kleineren Wert aus Jahresertrag und Jahresbedarf und hält davon einen Vorrat für 21 Tage vor.\n\n- **Nur Garten:** 120 m² Ziegeldach, 250 m² Garten ergeben ${n0(num(ZIST_GARDEN, 'tankSize'))} Liter. Der Bedarf von ${n0(num(ZIST_GARDEN, 'annualDemand'))} Litern ist kleiner als der Ertrag.\n- **Garten und Haus:** Mit WC und Waschmaschine für 4 Personen steigt der Bedarf auf ${n0(num(ZIST_HOUSE, 'annualDemand'))} Liter, die Zisterne auf ${n0(num(ZIST_HOUSE, 'tankSize'))} Liter.\n\nDer Gartenbedarf fällt fast nur in den Sommermonaten an, also oft dann, wenn wenig Regen nachkommt. Wer viel gießt, ist mit einer Nummer größer besser bedient. Für die Hausnutzung kommen Pumpe, Filter, Nachspeisung mit freiem Auslauf und eine getrennte Leitungsführung dazu.`,
      },
    ],
    faqs: [
      { question: 'Wie viel Regenwasser liefert 1 m² Dach im Jahr?', answer: `Bei 750 mm Niederschlag, Ziegeldach (Beiwert 0,85) und Filterverlust rechnet der Rechner mit ${n0(ZIST_PER_M2)} Litern je m² Dachfläche. In trockeneren Regionen mit 550 mm sind es ${n0(ZIST_PER_M2_DRY)} Liter. Den Niederschlag Ihres Ortes finden Sie beim Deutschen Wetterdienst.` },
      { question: 'Lohnt sich die Hausnutzung zusätzlich zum Garten?', answer: `Mit Hausnutzung wird das Regenwasser das ganze Jahr verbraucht, nicht nur im Sommer. Im Beispiel mit 120 m² Ziegeldach steigt der nutzbare Jahresanteil von ${n0(num(ZIST_GARDEN, 'annualDemand'))} auf ${n0(Math.min(num(ZIST_HOUSE, 'annualDemand'), num(ZIST_HOUSE, 'annualYield')))} Liter. Dafür ist eine zweite, vom Trinkwasser getrennte Leitungsanlage nötig. Fragen Sie vor dem Einbau beim Gesundheitsamt und bei Ihrem Wasserversorger nach, welche Anzeige- und Installationsregeln gelten.` },
    ],
  },

  'treppen-stufen-rechner': {
    sections: [
      {
        title: 'Treppenmaße für übliche Geschosshöhen',
        content: `Berechnet mit 17,5 cm Wunsch-Steigung und Schrittmaß 63 cm:\n\n${TREPPE_TABLE}\n\nDie Lauflänge ist die Grundrisslänge des geraden Laufs ohne Podest. Für die Treppenöffnung in der Decke kommt die nötige Kopffreiheit dazu.`,
      },
      {
        title: 'Platz knapp? So wirkt eine Stufe mehr oder weniger',
        content: `Im Modus „vorgegebene Stufenanzahl“ sehen Sie, wie sich die Treppe verändert. Für 280 cm Geschosshöhe:\n\n${TREPPE_VAR_TABLE}\n\nEine Steigung weniger spart Grundfläche, macht die Treppe aber steiler und die Stufen höher. Eine Steigung mehr verlängert den Lauf. Bei engen Grundrissen lohnt oft eine gewendelte Treppe oder ein Podest statt einer zu steilen geraden Treppe. Die Maße für Ihr Bauvorhaben prüft der Planer anhand der Landesbauordnung.`,
      },
    ],
    faqs: [
      { question: 'Wie lang wird eine gerade Treppe bei 2,75 m Geschosshöhe?', answer: `Der Rechner ergibt ${n0(num(TREPPE_275, 'stepsCount'))} Steigungen à ${n2(num(TREPPE_275, 'stepHeight'))} cm und ${n0(num(TREPPE_275, 'treadsCount'))} Trittstufen mit ${n2(num(TREPPE_275, 'treadDepth'))} cm Auftritt. Die Lauflänge im Grundriss beträgt ${n2(num(TREPPE_275, 'runLength'))} m.` },
      { question: 'Wie viele Stufen hat eine Treppe bei 2,50 m Geschosshöhe?', answer: `Mit 17,5 cm Wunsch-Steigung ergibt der Rechner ${n0(num(TREPPE_250, 'stepsCount'))} Steigungen à ${n2(num(TREPPE_250, 'stepHeight'))} cm. Gekauft bzw. gebaut werden aber nur ${n0(num(TREPPE_250, 'treadsCount'))} Trittstufen, weil der letzte Schritt auf dem oberen Fußboden endet.` },
      { question: 'Was ändert die Schrittmaß-Konstante?', answer: `Sie legt fest, wie lang ein bequemer Schritt angesetzt wird. Bei 280 cm Geschosshöhe ergibt 59 cm einen Auftritt von ${n2(num(TREPPE_C59, 'treadDepth'))} cm und ${n2(num(TREPPE_C59, 'runLength'))} m Lauflänge, 65 cm dagegen ${n2(num(TREPPE_C65, 'treadDepth'))} cm und ${n2(num(TREPPE_C65, 'runLength'))} m. Ohne besonderen Grund bleibt man beim Standardwert 63 cm.` },
    ],
  },

  'drainage-gefaelle-rechner': {
    sections: [
      {
        title: 'Umrechnungstabelle: Prozent, Promille, cm/m und Grad',
        content: `${GEF_TABLE}\n\nProzent und Zentimeter pro Meter sind dasselbe: 2 % bedeuten 2 cm Höhenunterschied je Meter. Promille sind das Zehnfache der Prozentzahl. Der Winkel in Grad ist bei kleinen Gefällen sehr klein und wird auf der Baustelle kaum verwendet.`,
      },
      {
        title: 'Gefälle auf der Baustelle übertragen',
        content: `Für Terrassen, Pflaster und Rohrgräben wird das Gefälle meist mit Richtscheit, Schnur oder Laser übertragen:\n\n- **Richtscheit mit Wasserwaage:** Bei 2 m Latte und 2 % Gefälle legen Sie unter das tiefe Ende einen Klotz von ${n1(GEF_LATTE)} cm. Steht die Libelle dann waagerecht, stimmt das Gefälle.\n- **Schnur:** Spannen Sie die Schnur zwischen zwei Pflöcken und setzen Sie den unteren Punkt um den Höhenunterschied aus dem Rechner tiefer.\n- **Bestehendes Gefälle prüfen:** Messen Sie den Höhenunterschied und stellen Sie den Modus auf „gemessen“. 12 cm auf 7,50 m ergeben ${n2(num(GEF_MEASURED, 'slopePercent'))} %.\n\nMessen Sie immer von einem festen Höhenbezug aus, etwa der Oberkante Fertigfußboden. Kleine Fehler summieren sich auf langen Strecken schnell zu mehreren Zentimetern.`,
      },
    ],
    faqs: [
      { question: 'Ist ein Gefälle von 100 Prozent senkrecht?', answer: `Nein. 100 % bedeuten einen Meter Höhe auf einen Meter Strecke, also einen Winkel von ${n0(GEF_100)}°. Ein senkrechter Verlauf wäre ein unendlich großes Gefälle. 50 % entsprechen ${n1(GEF_45DEG_CHECK)}°.` },
      { question: 'Wie rechne ich Promille in Zentimeter pro Meter um?', answer: 'Teilen Sie die Promille durch 10: 15 ‰ entsprechen 1,5 cm pro Meter bzw. 1,5 %. Geben Sie im Rechner den Prozentwert ein, er zeigt dann direkt den Höhenunterschied für Ihre Strecke.' },
    ],
  },

  'baugrund-tragfaehigkeit-rechner': {
    sections: [
      {
        title: 'Auslastung eines Streifenfundaments nach Breite und Boden',
        content: `Beispiel: 60 kN Last je laufendem Meter Fundament (Fundamentlänge im Rechner 1 m). Die Auslastung bezieht sich auf die festen Rechenwerte des Rechners für jeden Boden:\n\n${BAU_TABLE}\n\nWerte über 100 % zeigen, dass das Fundament für diesen Boden zu schmal ist. Bei Streifenfundamenten rechnet man meist pro laufendem Meter, so wie hier.`,
      },
      {
        title: 'Was der Rechner nicht abbildet',
        content: `Die Rechnung Last durch Fläche ist eine erste Plausibilitätsprüfung, kein Standsicherheitsnachweis. Ob ein Fundament ausreicht, entscheidet der Statiker bzw. Tragwerksplaner auf Grundlage eines Baugrundgutachtens.\n\n- **Feste Grenzwerte:** Die aufnehmbare Sohlspannung hängt nicht nur von der Bodenart ab, sondern auch von Einbindetiefe, Fundamentbreite, Grundwasser und zulässigen Setzungen. Der Rechner verwendet je Boden einen festen Wert.\n- **Mittige Last:** Exzentrische Lasten, Momente und Horizontalkräfte erhöhen die Pressung an einer Kante.\n- **Eigengewicht:** Ein Fundament 2,0 × 0,8 × 0,8 m wiegt mit 25 kN/m³ als Rechenwert ${n0(BAU_SELF)} kN. Zu 150 kN Auflast addiert steigt die Pressung im Beispiel auf ${n1(num(BAU_WITH_SELF, 'sigma'))} kN/m².\n- **Umrechnung:** 1 Tonne Masse entspricht rund 9,81 kN Gewichtskraft; das Eingabefeld rundet auf 10 kN je Tonne.`,
      },
    ],
    faqs: [
      { question: 'Wie breit muss ein Streifenfundament sein?', answer: `Teilen Sie die Last je Meter durch die aufnehmbare Bodenpressung. Bei 100 kN/m und den Rechenwerten des Rechners sind das ${n2(BAU_REQ_WIDTH)} m für mitteldicht gelagerten Sand und ${n2(BAU_REQ_WIDTH_SOFT)} m für weichen Schluff. Die verbindliche Breite legt der Tragwerksplaner fest.` },
      { question: 'Was bedeutet kN/m² bei der Bodenpressung?', answer: 'Kilonewton pro Quadratmeter beschreibt die Kraft, die auf jeden Quadratmeter Fundamentsohle wirkt. 100 kN/m² entsprechen grob 10 Tonnen pro Quadratmeter oder 0,1 N/mm².' },
    ],
  },

  'holz-balken-durchbiegung-rechner': {
    sections: [
      {
        title: 'Durchbiegung nach Spannweite und Balkenhöhe',
        content: `Balkenbreite 10 cm, Achsabstand 65 cm, Flächenlast 2,5 kN/m², E-Modul 11.000 N/mm² (Nadelholz C24). Ein ✗ markiert Werte über der Grenze L/300:\n\n${BALKEN_TABLE}\n\nDie Spannweite geht mit der vierten Potenz ein: Wird der Balken 50 % länger, biegt er sich rund fünfmal so stark durch. Mehr Höhe ist die wirksamste Gegenmaßnahme.`,
      },
      {
        title: 'Grenzen der Rechnung: Wann der Statiker ran muss',
        content: `Der Rechner prüft nur die elastische Anfangsdurchbiegung eines Einfeldträgers unter Gleichlast. Für eine tragende Decke fehlen wesentliche Nachweise:\n\n- **Biegespannung und Schub:** Ein Balken kann die Durchbiegungsgrenze einhalten und trotzdem überlastet sein.\n- **Kriechen:** Holz verformt sich unter Dauerlast weiter. Die Enddurchbiegung liegt deshalb höher als der Wert hier.\n- **Auflager, Schwingungen und Brandschutz** werden nicht betrachtet.\n- **Lastannahmen:** Eigengewicht von Dielen, Schüttung, Estrich und die Nutzlast nach Eurocode 1 legt der Tragwerksplaner fest.\n\nBeim Ausbau eines Dachbodens oder beim Einbringen von Estrich auf eine alte Balkendecke gehört die Statik deshalb immer in die Hände eines Statikers bzw. Tragwerksplaners.`,
      },
    ],
    faqs: [
      { question: 'Was bringt ein geringerer Balkenabstand?', answer: `Jeder Balken trägt dann eine schmalere Lastfläche. Ein Balken 10 × 20 cm über 4,50 m biegt sich bei 65 cm Abstand um ${n1(BALKEN_E65)} mm durch, bei 50 cm Abstand um ${n1(BALKEN_E50)} mm. Zum Vergleich: 12 statt 10 cm Breite ergeben ${n1(BALKEN_W12)} mm, 22 statt 20 cm Höhe ${n1(BALKEN_H22)} mm.` },
      { question: 'Wie stark biegt sich ein Balken 12 × 24 cm auf 5 m durch?', answer: `Bei 65 cm Abstand und 2,5 kN/m² berechnet der Rechner ${n1(num(BALKEN_1224, 'deflection'))} mm. Die Grenze L/300 liegt bei ${n1(num(BALKEN_1224, 'limit'))} mm. Das ist ein Durchbiegungswert, kein Tragfähigkeitsnachweis.` },
    ],
  },

  'brennholz-raummeter-rechner': {
    sections: [
      {
        title: 'Umrechnung und Energiegehalt auf einen Blick',
        content: `Werte aus dem Rechner (Umrechnung 1 FM ≈ 1,43 RM ≈ 2,0 SRM, Energiegehalt je Raummeter als Richtwert für lufttrockenes Holz):\n\n${HOLZ_TABLE}\n\nDie Raummaße hängen davon ab, wie dicht das Holz liegt. Ofenfertig gespaltene Scheite liegen in der Regel dichter als 1-m-Stücke; Händlerangaben können deshalb leicht abweichen.`,
      },
      {
        title: 'Wie viel Holz ersetzt 1.000 Liter Heizöl?',
        content: `Der Rechner setzt 10 kWh je Liter Heizöl an. Ein Raummeter Buche entspricht damit ${n0(HOLZ_OIL_PER_RM_BEECH)} Litern Heizöl, ein Raummeter Fichte ${n0(HOLZ_OIL_PER_RM_SPRUCE)} Litern.\n\n- Für den Energiegehalt von 1.000 Litern Heizöl brauchen Sie rund ${n1(HOLZ_RM_FOR_1000L_BEECH)} RM Buche oder ${n1(HOLZ_RM_FOR_1000L_SPRUCE)} RM Fichte.\n- Das ist der Energiegehalt im Holz, nicht die Wärme im Raum. Wie viel davon ankommt, hängt vom Wirkungsgrad des Ofens ab, den der Hersteller angibt.\n- Nasses Holz liefert deutlich weniger Energie, weil das Wasser erst verdampfen muss. Prüfen Sie die Feuchte mit einem Messgerät an einer frisch gespaltenen Fläche.\n\nFür den Preisvergleich zwischen Angeboten rechnen Sie alle auf dieselbe Einheit um, am besten Festmeter oder kWh.`,
      },
    ],
    faqs: [
      { question: 'Wie viele Schüttraummeter ergibt ein Ster?', answer: `Ein Ster ist ein Raummeter. Laut Rechner entspricht 1 RM ${n2(num(HOLZ_1RM, 'srm'))} SRM und ${n2(num(HOLZ_1RM, 'fm'))} FM. Umgekehrt sind 1 SRM lose geschüttetes Holz nur ${n2(num(HOLZ_1RM_SRM_FOR_RM, 'rm'))} RM gestapelt.` },
      { question: 'Warum ist ein Schüttraummeter billiger als ein Raummeter?', answer: 'Weil in einem Schüttraummeter weniger Holz steckt als in einem gestapelten Raummeter: Zwischen lose geschütteten Scheiten bleibt mehr Luft. Ein scheinbar niedriger Preis pro SRM kann daher pro Festmeter teurer sein. Rechnen Sie Angebote vor dem Vergleich in dieselbe Einheit um.' },
    ],
  },

  'putz-rechner': {
    sections: [
      {
        title: 'Putzbedarf für 20 m² nach Dicke und Putzart',
        content: `Berechnet mit 10 % Verlustzuschlag und 30-kg-Säcken. Die Verbrauchswerte pro mm sind Richtwerte des Rechners; auf dem Sack steht der Verbrauch des konkreten Produkts.\n\n${PUTZ_TABLE}\n\nDie Menge wächst linear mit der Dicke: 20 mm brauchen doppelt so viel Material wie 10 mm. Wer stark unebenes Mauerwerk ausgleichen muss, sollte die Wand vorher mit einer Richtlatte prüfen und die mittlere Dicke ehrlich schätzen.`,
      },
      {
        title: 'Die Putzfläche richtig ermitteln',
        content: `Die Wandfläche allein reicht oft nicht:\n\n- **Fensterlaibungen:** Ein Fenster 1,20 × 1,40 m mit 25 cm tiefer Laibung bringt an drei Seiten ${n2(PUTZ_LAIBUNG)} m² Putzfläche dazu, obwohl die Öffnung selbst abgezogen wird.\n- **Öffnungen:** Fenster und Türen ziehen Sie mit ihrer Fläche ab; kleine Aussparungen wie Steckdosen nicht.\n- **Decken** rechnen Sie getrennt, weil dort oft dünner und mit anderem Material gearbeitet wird.\n- **Kanten und Ecken** erhalten Eckschutzschienen, die vor dem Putzen gesetzt werden.\n\nDie Wassermenge des Rechners (0,25 Liter je kg) ist ein Durchschnittswert. Für einen 30-kg-Sack wären das ${n1(PUTZ_SACK_WATER)} Liter; verbindlich ist die Angabe auf dem Sack.`,
      },
    ],
    faqs: [
      { question: 'Wie viele Säcke Putz brauche ich für 10 m² bei 15 mm?', answer: `Mit Kalk-Zement-Putz und 10 % Reserve sind es ${n0(num(PUTZ_10_15, 'totalKg'))} kg, also ${n0(num(PUTZ_10_15, 'sacks'))} Säcke à 30 kg.` },
      { question: 'Kann ich Putz in einer Lage 25 mm dick auftragen?', answer: 'Das hängt vom Produkt ab. Viele Putze haben eine maximale Lagendicke; darüber muss in zwei Lagen gearbeitet werden, mit Wartezeit dazwischen. Die Grenzwerte stehen im technischen Merkblatt. Für die Menge spielt es keine Rolle, ob Sie in einer oder zwei Lagen putzen.' },
    ],
  },

  'fassadenfarbe-rechner': {
    sections: [
      {
        title: 'Farbmengen für typische Häuser',
        content: `Zwei Anstriche, 5 % Reserve. Hausumfang, mittlere Höhe und Fensterabzug sind Beispielwerte:\n\n${FASS_TABLE}\n\nDer Untergrund verändert die Menge stärker als jede andere Eingabe. Bei grobem Reibeputz braucht dasselbe Haus fast doppelt so viel Farbe wie bei glattem Putz.`,
      },
      {
        title: 'Giebel über die mittlere Höhe einrechnen',
        content: `Der Rechner arbeitet mit Hausumfang und einer durchschnittlichen Fassadenhöhe. Giebeldreiecke rechnen Sie in diese Höhe ein:\n\n1. Fläche eines Giebels = Hausbreite × Giebelhöhe / 2. Bei 8 m Breite und 3 m Giebelhöhe sind das 12 m², bei zwei Giebeln ${n0(FASS_GABLE_AREA)} m².\n2. Teilen Sie die Giebelfläche durch den Hausumfang (36 m) und addieren Sie das Ergebnis zur Traufhöhe: 5,50 m + ${n2(FASS_GABLE_AREA / 36)} m = ${n2(FASS_AVG_H)} m.\n3. Mit dieser Höhe ergibt der Rechner bei 2-mm-Scheibenputz ${n1(num(FASS_GABLE, 'liters'))} Liter statt ${n1(num(FASS_NO_GABLE, 'liters'))} Liter ohne Giebel.\n\nSockel, die einen anderen Anstrich bekommen, und Flächen hinter Vordächern oder Garagen ziehen Sie wie Öffnungen ab.`,
      },
    ],
    faqs: [
      { question: 'Wie viel Fassadenfarbe brauche ich für 150 m²?', answer: `Bei zwei Anstrichen und 5 % Reserve sind es auf glattem Putz ${n0(FASS_150[0])} Liter, auf 2-mm-Scheibenputz ${n0(FASS_150[1])} Liter und auf grobem Reibeputz ${n0(FASS_150[2])} Liter.` },
      { question: 'Wie viele Liter Fassadenfarbe pro m² muss ich rechnen?', answer: `Für zwei Anstriche inklusive Reserve setzt der Rechner ${n2(FASS_PER_M2[0])} l/m² (glatt), ${n2(FASS_PER_M2[1])} l/m² (Scheibenputz) und ${n2(FASS_PER_M2[2])} l/m² (Reibeputz) an. Steht auf dem Gebinde ein anderer Verbrauch, gilt dieser.` },
    ],
  },

  betonrechner: {
    sections: [
      {
        title: 'Beton und Säcke für 10 m² nach Plattendicke',
        content: `Für eine schnelle Einkaufsliste zeigt die Tabelle den Bedarf für 10 m² Fläche ohne Reserve, gerechnet mit den Richtwerten des Rechners (2.100 kg Trockenbeton bzw. 300 kg Zement je m³ C20/25):\n\n${BETON_TABLE}\n\nFür andere Flächen rechnen Sie anteilig: 25 m² brauchen das Zweieinhalbfache. Die Reserve für Verdichtung und Unebenheiten kommt noch dazu. Aus ${n0(num(BETON_10_10, 'bags'))} Säcken für eine 10 cm dicke Platte werden mit 10 % Reserve ${n0(num(BETON_10_10_RES, 'bags'))} Säcke.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel wiegt 1 m³ Beton?',
        answer: `Frisch eingebauter Normalbeton wiegt rund ${formatNumber(BETON_1M3_FRESH / 1000, 1)} Tonnen je Kubikmeter, so rechnet der Rechner im Modus Transportbeton. Für einen Kubikmeter aus Fertigbeton-Säcken setzt er ${n0(BETON_1M3_DRY)} kg Trockenmischung an, weil das Anmachwasser erst auf der Baustelle dazukommt. Wer die Säcke selbst mit dem Anhänger abholt, sollte deshalb vorher die zulässige Zuladung prüfen und notfalls zweimal fahren.`,
      },
    ],
  },

  'kies-splitt-rechner': {
    sections: [
      {
        title: 'Gewicht für 10 m² bei Beispiel-Schichtdicken',
        content: `Die Tabelle zeigt, wie unterschiedlich schwer dieselbe Fläche je nach Material und Schichtdicke wird. Die Schichtdicken sind Beispiele, maßgeblich ist Ihre Planung; gerechnet ist ohne Bestellzuschlag:\n\n${KIES_TABLE}\n\nRindenmulch wird wegen seines geringen Gewichts meist nach Volumen angeboten, Splitt, Kies und Schotter häufig nach Tonnen. Die Schottertragschicht ist mit Abstand der schwerste Posten: Für 10 m² kommen mehrere Tonnen zusammen, solche Mengen lässt man sich besser anliefern.`,
      },
    ],
    faqs: [
      {
        question: 'Für wie viele Quadratmeter reicht eine Tonne Splitt?',
        answer: `Eine Tonne Splitt 2/5 ergibt mit dem Rechenwert ${n2(num(KIES_1T, 'densityUsed'))} t/m³ rund ${n2(KIES_1T_M3)} m³. Bei 3 cm Schichtdicke reicht das für ${formatNumber(KIES_1T_M3 / 0.03, 1)} m², bei 4 cm für ${formatNumber(KIES_1T_M3 / 0.04, 1)} m² und bei 5 cm für ${formatNumber(KIES_1T_M3 / 0.05, 1)} m². Bei einer anderen Schüttdichte laut Lieferschein ändern sich die Werte entsprechend.`,
      },
    ],
  },

  'schalungssteine-rechner': {
    sections: [
      {
        title: 'Steine und Füllbeton je laufendem Meter Mauer',
        content: `Für eine Mauer mit 1 m Länge zeigt die Tabelle den Netto-Bedarf ohne Reserve, getrennt nach Steinformat:\n\n${SCHAL_TABLE}\n\nFür eine längere Mauer multiplizieren Sie mit der Länge in Metern. Die 20 cm hohen Steine brauchen bei gleicher Wandfläche ein Viertel mehr Steine, jeder einzelne fasst aber weniger Beton. Bei Höhen, die kein Vielfaches der Steinhöhe sind, wird die oberste Lage gekürzt; das kostet Verschnitt, den die Steinreserve im Rechner abdecken soll.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel Beton passt in einen Schalungsstein?',
        answer: `Das hängt vom Stein ab. Mit den Herstellerwerten des Rechners sind es bei Beyhl 24 rund ${n0(SCHAL_L_BEYHL)} Liter und bei Beyhl 17,5 rund ${n0(SCHAL_L_BEYHL175)} Liter je Stein. Bei den kleineren Delfing-DP-Steinen im Format 50 × 20 cm ergeben 130 l/m² bzw. 80 l/m² rund ${n0(SCHAL_L_DELFING)} bzw. ${n0(SCHAL_L_DELFING175)} Liter je Stein. Diese Werte helfen beim Abschätzen, wie viele Steine eine Mischerfüllung verfüllt.`,
      },
    ],
  },
};
