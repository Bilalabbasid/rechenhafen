import { CalculationResult } from '@/types/calculator';
import { formatNumber } from '@/lib/formatters';
import { calculatePortions, calculateBakingPan } from '@/lib/calculators/kochen';
import { EXTRA_EINHEITEN_KOCHEN } from '../extra/einheitenKochen';
import { PageContentMap } from './types';

// ---------------------------------------------------------------------------
// Alle Zahlen in Tabellen und Antworten stammen aus der calculate-Funktion des
// jeweiligen Rechners (einheitenKochen.ts bzw. lib/calculators/kochen.ts) und
// werden beim Laden des Moduls berechnet. Lebensmittelsicherheit: nur Angaben
// von BfR und Verbraucherzentrale (Kerntemperatur, Lagerung, Kräutertee, Pökeln).
// ---------------------------------------------------------------------------
function run(slug: string, inputs: Record<string, any>): CalculationResult {
  const calc = EXTRA_EINHEITEN_KOCHEN.find((c) => c.slug === slug);
  if (!calc || !calc.calculate) throw new Error(`page-content/kochen: calculator ${slug} not found`);
  return calc.calculate(inputs) as CalculationResult;
}
function num(r: CalculationResult, id: string): number {
  if (r.primary.id === id) return Number(r.primary.value);
  const item = r.secondary?.find((s) => s.id === id);
  if (!item) throw new Error(`page-content/kochen: result ${id} missing`);
  return Number(item.value);
}
function txt(r: CalculationResult, id: string): string {
  if (r.primary.id === id) return String(r.primary.formattedValue);
  const item = r.secondary?.find((s) => s.id === id);
  if (!item) throw new Error(`page-content/kochen: result ${id} missing`);
  return String(item.formattedValue);
}
function table(head: string[], rows: string[][]): string {
  return [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n');
}
const n = (v: number, digits = 2) => formatNumber(v, digits);
const g0 = (v: number) => `${formatNumber(v, 0)} g`;
const g1 = (v: number) => `${formatNumber(v, 1)} g`;

// ---------------------------------------------------------------------------
// Ei-Ersatz
// ---------------------------------------------------------------------------
const egg = (eggsCount: number, subType: string) => run('eiweiss-eigelb-ersatz-rechner', { eggsCount, subType });
const EGG_USE: Record<string, [string, string, string]> = {
  applesauce: ['Apfelmark', 'Rührkuchen, Muffins, Schoko- und Gewürzkuchen', 'Biskuit, Baiser, Gebäck, das knusprig werden soll'],
  banana: ['Reife Banane', 'Pancakes, Bananenbrot, Waffeln', 'Rezepte, in denen man Banane nicht schmecken soll'],
  flaxseed: ['Leinsamen- oder Chia-Ei', 'Vollkornteige, Kekse, Bratlinge, Brownies', 'helle, luftige Kuchen (bindet, lockert aber nicht)'],
  silkenTofu: ['Seidentofu', 'Quiche, Käsekuchen, Tartes, Aufläufe', 'leichte Rührteige (macht sie dicht)'],
  aquafaba: ['Aquafaba (Kichererbsenwasser)', 'Eischnee, Baiser, Mousse', 'Ersatz für ganze Eier in Rührteig'],
};
const EGG_TABLE = table(
  ['Ersatz', 'Menge für 3 Eier', 'Passt gut zu', 'Weniger geeignet für'],
  Object.entries(EGG_USE).map(([k, [name, good, bad]]) => [name, txt(egg(3, k), 'subAmount'), good, bad]),
);
const EGG_AQUA_5 = txt(egg(5, 'aquafaba'), 'subAmount');
const EGG_APPLE_4 = txt(egg(4, 'applesauce'), 'subAmount');
const EGG_FLAX_2 = txt(egg(2, 'flaxseed'), 'subAmount');

// ---------------------------------------------------------------------------
// Kaffee
// ---------------------------------------------------------------------------
const coffee = (cupsCount: number, cupSizeMl: string, strength: string) => run('kaffee-wasser-verhaeltnis-rechner', { cupsCount, cupSizeMl, strength });
const COFFEE_TABLE = table(
  ['Tassen', 'Wasser', 'Mild (55 g/l)', 'Ausgewogen (60 g/l)', 'Kräftig (65 g/l)', 'Lote bei 60 g/l'],
  [
    [2, '150'],
    [4, '125'],
    [4, '150'],
    [6, '150'],
    [8, '125'],
    [10, '125'],
  ].map(([c, s]) => {
    const std = coffee(c as number, s as string, 'standard');
    return [
      `${c} × ${s} ml`,
      `${n(num(std, 'waterMl'), 0)} ml`,
      g1(num(coffee(c as number, s as string, 'mild'), 'coffeeG')),
      g1(num(std, 'coffeeG')),
      g1(num(coffee(c as number, s as string, 'strong'), 'coffeeG')),
      n(num(std, 'coffeeSpoons'), 1),
    ];
  }),
);
const COFFEE_1L = ['mild', 'standard', 'strong'].map((s) => g0(num(coffee(4, '250', s), 'coffeeG')));
const COFFEE_12 = coffee(12, '125', 'standard');
const COFFEE_MUG = coffee(1, '250', 'standard');

// ---------------------------------------------------------------------------
// Backofen Umluft / Ober-Unterhitze
// ---------------------------------------------------------------------------
const oven = (temperature: number, sourceMode: string, bakeTimeMins: number) => run('backzeit-temperatur-umluft-oberhitze-rechner', { temperature, sourceMode, bakeTimeMins });
const OVEN_TABLE = table(
  ['Ober-/Unterhitze', 'Umluft', 'Gasstufe (Richtwert)', '40 Min. werden zu', '60 Min. werden zu'],
  [160, 170, 180, 190, 200, 220].map((t) => {
    const r40 = oven(t, 'topBottom', 40);
    const r60 = oven(t, 'topBottom', 60);
    return [`${t} °C`, `${n(num(r40, 'convectionDisplay'), 0)} °C`, `Stufe ${n(num(r40, 'gasLevel'), 0)}`, `${n(num(r40, 'adaptedTime'), 0)} Min.`, `${n(num(r60, 'adaptedTime'), 0)} Min.`];
  }),
);
const OVEN_180 = oven(180, 'topBottom', 50);
const OVEN_U200 = oven(200, 'convection', 30);

// ---------------------------------------------------------------------------
// Raclette & Fondue
// ---------------------------------------------------------------------------
const party = (adultsCount: number, kidsCount: number, eventStyle: string) => run('fondue-raclette-mengen-rechner', { adultsCount, kidsCount, eventStyle });
const kg = (g: number) => `${n(g / 1000, 2)} kg`;
const PARTY_TABLE = table(
  ['Erwachsene', 'Raclette klassisch: Käse', 'Raclette + Grill: Käse / Fleisch', 'Fleischfondue: Fleisch', 'Käsefondue: Käse / Baguettes'],
  [2, 4, 6, 8, 10].map((a) => {
    const rc = party(a, 0, 'racletteClassic');
    const rm = party(a, 0, 'racletteMeat');
    const mf = party(a, 0, 'meatFondue');
    const cf = party(a, 0, 'cheeseFondue');
    return [String(a), kg(num(rc, 'cheese')), `${kg(num(rm, 'cheese'))} / ${kg(num(rm, 'meat'))}`, kg(num(mf, 'meat')), `${kg(num(cf, 'cheese'))} / ${n(num(cf, 'baguettes'), 0)}`];
  }),
);
const PARTY_10 = party(10, 0, 'racletteClassic');
const PARTY_KIDS = party(6, 3, 'racletteClassic');
const PARTY_MEAT_8 = party(8, 0, 'meatFondue');

// ---------------------------------------------------------------------------
// Marmelade
// ---------------------------------------------------------------------------
const jam = (fruitGrams: number, sugarType: string, jarSizeMl: string) => run('marmelade-geliermittel-rechner', { fruitGrams, sugarType, jarSizeMl });
const JAM_TABLE = table(
  ['Früchte', '1:1 – Marmelade / Gläser à 250 ml', '2:1 – Marmelade / Gläser à 250 ml', '3:1 – Marmelade / Gläser à 250 ml', '2:1 – Gläser à 200 ml'],
  [500, 1000, 1500, 2000, 3000].map((f) => {
    const cell = (t: string) => {
      const r = jam(f, t, '250');
      return `${g0(num(r, 'yield'))} / ${n(num(r, 'jars'), 0)}`;
    };
    return [g0(f), cell('1_1'), cell('2_1'), cell('3_1'), n(num(jam(f, '2_1', '200'), 'jars'), 0)];
  }),
);
const JAM_1KG_21 = jam(1000, '2_1', '250');
const JAM_1KG_31 = jam(1000, '3_1', '250');
const JAM_LEMON_2KG = num(jam(2000, '2_1', '250'), 'lemon');

// ---------------------------------------------------------------------------
// Salzlake
// ---------------------------------------------------------------------------
const brine = (waterLiters: number, purpose: string, customPercent = 6) => run('salz-lake-poekel-rechner', { waterLiters, purpose, customPercent });
const BRINE_PURPOSES: Array<[string, string]> = [
  ['ferment', 'Gemüse fermentieren'],
  ['brinePoultry', 'Geflügel/Grillfleisch einlegen'],
  ['fishSmoke', 'Fisch vor dem Räuchern'],
  ['fishQuick', 'Fisch Schnell-Lake'],
  ['porkCure', 'Nasspökeln'],
];
const BRINE_TABLE = table(
  ['Zweck', 'Prozent', '1 Liter Wasser', '2 Liter', '5 Liter'],
  BRINE_PURPOSES.map(([k, label]) => {
    const r1 = brine(1, k);
    return [label, txt(r1, 'usedPct'), `${txt(r1, 'saltAmount')} (${txt(r1, 'spoons')})`, txt(brine(2, k), 'saltAmount'), txt(brine(5, k), 'saltAmount')];
  }),
);
const BRINE_SHARE_TABLE = table(
  ['Angabe im Rezept', 'Salz auf 1 Liter Wasser (Rechner)', 'Anteil an der fertigen Lake', 'Salz, wenn die Lake selbst x % haben soll'],
  [2, 5, 6, 10, 12].map((p) => {
    const salt = num(brine(1, 'custom', p), 'saltAmount');
    const share = (salt / (1000 + salt)) * 100;
    const forShare = (1000 * p) / (100 - p);
    return [`${p} %`, g0(salt), `${n(share, 1)} %`, g0(forShare)];
  }),
);
const BRINE_FERMENT_1 = txt(brine(1, 'ferment'), 'saltAmount');
const BRINE_FERMENT_15 = txt(brine(1.5, 'ferment'), 'saltAmount');

// ---------------------------------------------------------------------------
// Cocktail
// ---------------------------------------------------------------------------
const drink = (spiritMl: number, spiritVolPct: number, liqueurMl: number, liqueurVolPct: number, fillerMl: number, iceMeltMl: number) =>
  run('cocktail-alkoholgehalt-rechner', { spiritMl, spiritVolPct, liqueurMl, liqueurVolPct, fillerMl, iceMeltMl });
const DRINKS: Array<[string, string, CalculationResult]> = [
  ['Gin Tonic', '4 cl Gin (40 %), 16 cl Tonic, 3 cl Schmelzwasser', drink(40, 40, 0, 20, 160, 30)],
  ['Doppelter Gin Tonic', '8 cl Gin (40 %), 16 cl Tonic, 3 cl Schmelzwasser', drink(80, 40, 0, 20, 160, 30)],
  ['Cuba Libre', '5 cl Rum (40 %), 15 cl Cola, 3 cl Schmelzwasser', drink(50, 40, 0, 20, 150, 30)],
  ['Wodka-Orange', '4 cl Wodka (37,5 %), 20 cl Saft, 2 cl Schmelzwasser', drink(40, 37.5, 0, 20, 200, 20)],
  ['Margarita (Beispiel)', '5 cl Tequila (38 %), 2 cl Orangenlikör (Beispiel 30 %), 2,5 cl Limettensaft, 2,5 cl Schmelzwasser', drink(50, 38, 20, 30, 25, 25)],
];
const DRINK_TABLE = table(
  ['Drink', 'Rezept', 'Volumen', 'Vol.-%', 'Reiner Alkohol'],
  DRINKS.map(([name, recipe, r]) => [name, recipe, `${n(num(r, 'drinkSize'), 0)} ml`, `${n(num(r, 'finalVol'), 1)} %`, g1(num(r, 'pureAlcohol'))]),
);
const DRINK_ICE = [0, 30, 60].map((ice) => drink(50, 40, 0, 20, 150, ice));
const DRINK_CUBA = DRINKS[2][2];
const DRINK_DOUBLE = DRINKS[1][2];
const DRINK_MARGARITA = DRINKS[4][2];

// ---------------------------------------------------------------------------
// Rezept-Kalorien
// ---------------------------------------------------------------------------
const kcal = (carbsG: number, proteinG: number, fatG: number, portionsCount: number) => run('kalorien-rezept-rechner', { carbsG, proteinG, fatG, portionsCount });
// Beispielwerte von Packungen (je 100 g), keine allgemeingültigen Nährwerte
const KC_ITEMS: Array<[string, number, number, number, number]> = [
  ['Nudeln, trocken', 250, 70, 12, 1.5],
  ['Hackfleisch gemischt', 300, 0, 20, 20],
  ['Passierte Tomaten', 500, 4, 1.5, 0.2],
  ['Olivenöl', 15, 0, 0, 100],
  ['Parmesan', 40, 0, 32, 29],
];
const KC_SUM = KC_ITEMS.reduce(
  (acc, [, gram, c, p, f]) => [acc[0] + (gram * c) / 100, acc[1] + (gram * p) / 100, acc[2] + (gram * f) / 100],
  [0, 0, 0],
);
const KC_TABLE = table(
  ['Zutat', 'Menge', 'KH je 100 g', 'Eiweiß je 100 g', 'Fett je 100 g', 'KH / Eiweiß / Fett im Rezept'],
  KC_ITEMS.map(([name, gram, c, p, f]) => [name, g0(gram), g1(c), g1(p), g1(f), `${n((gram * c) / 100, 1)} / ${n((gram * p) / 100, 1)} / ${n((gram * f) / 100, 1)} g`]),
);
const KC_RESULT = kcal(Math.round(KC_SUM[0]), Math.round(KC_SUM[1]), Math.round(KC_SUM[2]), 4);
const KC_TOTAL = num(KC_RESULT, 'totalKcal');
const KC_LMIV = Math.round(KC_SUM[0]) * 4 + Math.round(KC_SUM[1]) * 4 + Math.round(KC_SUM[2]) * 9;
const KC_FINAL_WEIGHT = 1150;
const KC_DEFAULT = kcal(120, 60, 30, 3);
const KC_OIL = num(kcal(0, 0, 10, 1), 'totalKcal');

// ---------------------------------------------------------------------------
// Bäckerprozente
// ---------------------------------------------------------------------------
const bread = (targetLoafG: number, hydrationPercent: number, saltPercent: number, sourdoughPercent: number) =>
  run('brot-backen-baeckermass-rechner', { targetLoafG, hydrationPercent, saltPercent, sourdoughPercent });
const BREAD_TABLE = table(
  ['Sauerteiganteil', 'Hauptmehl', 'Schüttwasser', 'Sauerteig (TA 200)', 'TA laut Rechner', 'TA gesamt inkl. Sauerteig'],
  [0, 10, 20, 30, 40].map((sd) => {
    const r = bread(1000, 70, 2, sd);
    const flour = num(r, 'flour');
    const water = num(r, 'water');
    const sour = num(r, 'sourdough');
    const totalFlour = flour + sour / 2;
    const totalWater = water + sour / 2;
    return [`${sd} %`, g0(flour), g0(water), g0(sour), `TA ${n(num(r, 'taValue'), 0)}`, `TA ${n(100 + (totalWater / totalFlour) * 100, 0)}`];
  }),
);
const BREAD_750 = bread(750, 70, 2, 20);
const BREAD_TA180 = bread(1000, 80, 2, 20);

// ---------------------------------------------------------------------------
// Schokolade temperieren
// ---------------------------------------------------------------------------
const choc = (totalChocolateG: number, chocType: string) => run('schokolade-temperieren-rechner', { totalChocolateG, chocType });
const CHOC_AMOUNTS = table(
  ['Gesamtmenge', 'Schmelzen (2/3)', 'Impfen (1/3)'],
  [150, 200, 300, 500, 1000].map((t) => {
    const r = choc(t, 'dark');
    return [g0(t), g0(num(r, 'meltPortion')), g0(num(r, 'seedPortion'))];
  }),
);
const CHOC_TEMPS = table(
  ['Sorte', 'Schmelzen', 'Mit Impfschokolade abkühlen auf', 'Verarbeiten bei'],
  [
    ['dark', 'Zartbitter'],
    ['milk', 'Vollmilch'],
    ['white', 'Weiß'],
  ].map(([k, name]) => {
    const r = choc(300, k);
    const melt = txt(r, 'meltPortion').replace(/^.*\(bei /, '').replace(/\)$/, '');
    const cool = txt(r, 'seedPortion').replace(/^.*\(bis /, '').replace(/ erreicht ist\)$/, '');
    return [name, melt, cool, txt(r, 'workTemperature')];
  }),
);

// ---------------------------------------------------------------------------
// Sauerteig
// ---------------------------------------------------------------------------
const sour = (desiredSourdoughG: number, feedingRatio: string, reserveG = 30) => run('sauerteig-anstellgut-rechner', { desiredSourdoughG, feedingRatio, reserveG });
const sourCell = (r: CalculationResult) => `${n(num(r, 'starter'), 0)} / ${n(num(r, 'flour'), 0)} / ${n(num(r, 'water'), 0)} g`;
const SOUR_TABLE = table(
  ['Sauerteig fürs Rezept (+30 g Reserve)', '1:1:1 (Anstellgut / Mehl / Wasser)', '1:2:2', '1:5:5'],
  [100, 200, 300, 400, 600].map((t) => [g0(t), sourCell(sour(t, '1_1_1')), sourCell(sour(t, '1_2_2')), sourCell(sour(t, '1_5_5'))]),
);
const SOUR_500 = sour(500, '1_1_1');
const SOUR_500_155 = sour(500, '1_5_5');
const SOUR_RES50 = sour(200, '1_2_2', 50);

// ---------------------------------------------------------------------------
// Kerntemperatur
// ---------------------------------------------------------------------------
const meat = (meatType: string, doneness: string, weightKg: number) => run('fleisch-kerntemperatur-garzeit-rechner', { meatType, doneness, weightKg });
const MEAT_TYPES: Array<[string, string]> = [
  ['beefSteak', 'Rindersteak / Filet'],
  ['beefRoast', 'Roastbeef / Rinderbraten'],
  ['lamb', 'Lammkeule / -karree'],
  ['porkRoast', 'Schweinebraten'],
  ['poultry', 'Geflügel'],
  ['pulledPork', 'Pulled Pork'],
];
const MEAT_TABLE = table(
  ['Fleisch', 'Rare', 'Medium Rare', 'Medium', 'Well Done', 'Ofen', 'Zeit für 1,5 kg'],
  MEAT_TYPES.map(([k, name]) => {
    const t = (d: string) => `${n(num(meat(k, d, 1.5), 'targetCoreTemp'), 0)} °C`;
    const r = meat(k, 'medium', 1.5);
    return [name, t('rare'), t('mediumRare'), t('medium'), t('wellDone'), `${n(num(r, 'ovenTemp'), 0)} °C`, txt(r, 'estTime')];
  }),
);
const MEAT_PORK2 = meat('porkRoast', 'medium', 2);
const MEAT_PULLED3 = meat('pulledPork', 'medium', 3);
const MEAT_ROAST1 = meat('beefRoast', 'mediumRare', 1);
const MEAT_ROAST2 = meat('beefRoast', 'mediumRare', 2);

// ---------------------------------------------------------------------------
// Pizzateig
// ---------------------------------------------------------------------------
const pizza = (ballsCount: number, ballWeightG: number, hydrationPercent: number, saltPercent = 3) => run('pizza-teig-rechner', { ballsCount, ballWeightG, hydrationPercent, saltPercent });
const PIZZA_TABLE = table(
  ['Teig', 'Hydratation', 'Mehl', 'Wasser', 'Salz', 'Frische Hefe (24 h)'],
  [
    [2, 260, 62],
    [4, 260, 60],
    [4, 260, 65],
    [4, 260, 70],
    [6, 250, 65],
    [8, 280, 65],
  ].map(([b, w, h]) => {
    const r = pizza(b, w, h);
    return [`${b} × ${w} g`, `${h} %`, g0(num(r, 'flour')), g0(num(r, 'water')), g1(num(r, 'salt')), `${n(num(r, 'freshYeast'), 2)} g`];
  }),
);
const PIZZA_ONE = pizza(1, 260, 65);
const PIZZA_FLOUR_PER_BALL = num(PIZZA_ONE, 'flour');
const PIZZA_BALLS_500 = Math.floor(500 / PIZZA_FLOUR_PER_BALL);
const PIZZA_DOUGH_500 = (500 / PIZZA_FLOUR_PER_BALL) * 260;
const PIZZA_4 = pizza(4, 260, 65);
const PIZZA_DRY_4 = num(PIZZA_4, 'freshYeast') / 3;

// ---------------------------------------------------------------------------
// Kühlschrank-Haltbarkeit
// ---------------------------------------------------------------------------
const fridge = (foodType: string) => run('kuehlschrank-haltbarkeit-rechner', { foodType });
const FRIDGE_TYPES: Array<[string, string]> = [
  ['mincedMeat', 'Rohes Hackfleisch / Mett'],
  ['rawPoultry', 'Rohes Geflügel'],
  ['rawBeef', 'Rindfleisch am Stück'],
  ['cookedLeftovers', 'Gekochte Reste'],
  ['openedMilk', 'Geöffnete Milch'],
  ['openedJam', 'Geöffnete Konfitüre'],
  ['rawEggs', 'Rohe Eier'],
];
const FRIDGE_TABLE = table(
  ['Lebensmittel', 'Kühlschrank laut Rechner', 'Gefrierfach (−18 °C)'],
  FRIDGE_TYPES.map(([k, name]) => {
    const r = fridge(k);
    return [name, txt(r, 'days'), txt(r, 'freeze')];
  }),
);
const FRIDGE_MINCE_FREEZE = txt(fridge('mincedMeat'), 'freeze');

// ---------------------------------------------------------------------------
// Hefe
// ---------------------------------------------------------------------------
const yeast = (inputValue: number, inputUnit: string) => run('hefe-umrechner', { inputValue, inputUnit });
const YEAST_TABLE = table(
  ['Rezept nennt', 'Frische Hefe', 'Trockenhefe', 'Reicht nach Faustregel für'],
  [
    [0.25, 'cube', '¼ Würfel frische Hefe'],
    [0.5, 'cube', '½ Würfel frische Hefe'],
    [1, 'cube', '1 Würfel frische Hefe'],
    [2, 'cube', '2 Würfel frische Hefe'],
    [1, 'dryBags', '1 Päckchen Trockenhefe'],
    [3, 'dryBags', '3 Päckchen Trockenhefe'],
    [10, 'freshG', '10 g frische Hefe'],
  ].map(([v, u, label]) => {
    const r = yeast(v as number, u as string);
    return [label as string, txt(r, 'freshG'), txt(r, 'dryBags'), txt(r, 'flour').replace('ca. ', '')];
  }),
);
const YEAST_15 = yeast(15, 'freshG');
const YEAST_FOR_500 = yeast(500 / (1000 / 42), 'freshG');
const YEAST_FOR_1500 = yeast(1.5, 'cube');

// ---------------------------------------------------------------------------
// Backform
// ---------------------------------------------------------------------------
const pan = (diameterFrom: number, diameterTo: number) => calculateBakingPan({ diameterFrom, diameterTo });
const PAN_TABLE = table(
  ['Ihre Form', 'Faktor', 'Teigmenge', '200 g Butter werden zu', '4 Eier werden zu'],
  [18, 20, 22, 24, 28, 30].map((d) => {
    const r = pan(26, d);
    const f = Number(r.primary.value);
    return [`${d} cm`, `${n(f, 2)} ×`, txt(r, 'areaDiff'), g0(200 * f), `${n(4 * f, 1)} (≈ ${Math.max(1, Math.round(4 * f))})`];
  }),
);
const PAN_20_26 = pan(20, 26);
const PAN_EGGS_26_20 = 3 * Number(pan(26, 20).primary.value);
const eqDiameter = (l: number, w: number) => 2 * Math.sqrt((l * w) / Math.PI);
const PAN_TRAY_D = eqDiameter(40, 30);
const PAN_TRAY = pan(26, PAN_TRAY_D);
const PAN_SQUARE_D = eqDiameter(24, 24);
const PAN_SQUARE = pan(26, PAN_SQUARE_D);

// ---------------------------------------------------------------------------
// Portionsrechner
// ---------------------------------------------------------------------------
const portions = (originalPortions: number, targetPortions: number, originalAmount: number, unit = 'g') => calculatePortions({ originalPortions, targetPortions, originalAmount, unit });
const PORTION_TABLE = table(
  ['Ziel', 'Faktor', '500 g Mehl', '250 ml Sahne', '3 Eier', '2 EL Öl'],
  [1, 2, 3, 5, 6, 8, 10, 12].map((t) => {
    const f = Number(portions(4, t, 1).secondary![0].value);
    return [
      `${t} Portion${t === 1 ? '' : 'en'}`,
      `${n(f, 3)} ×`,
      g0(Number(portions(4, t, 500).primary.value)),
      `${n(Number(portions(4, t, 250, 'ml').primary.value), 0)} ml`,
      n(Number(portions(4, t, 3, 'Stück').primary.value), 2),
      n(Number(portions(4, t, 2, 'EL').primary.value), 2),
    ];
  }),
);
const PORTION_HALF_EL = Number(portions(4, 2, 3, 'EL').primary.value);
const PORTION_6_TO_4 = portions(6, 4, 750);

// ---------------------------------------------------------------------------
// Cups
// ---------------------------------------------------------------------------
const cups = (cupsAmount: number, ingredient: string, cupType = 'usCustomary') => run('cups-in-gramm-rechner', { cupsAmount, cupType, ingredient });
const CUP_INGREDIENTS: Array<[string, string]> = [
  ['flour', 'Mehl (All-Purpose)'],
  ['sugarWhite', 'Weißer Zucker'],
  ['sugarBrown', 'Brauner Zucker, gepackt'],
  ['sugarPowder', 'Puderzucker'],
  ['butter', 'Butter'],
  ['milk', 'Milch'],
  ['oil', 'Öl'],
  ['oats', 'Haferflocken'],
  ['chocolateChips', 'Schokodrops'],
];
const CUP_TABLE = table(
  ['Zutat', '¼ Cup', '⅓ Cup', '½ Cup', '1 Cup'],
  CUP_INGREDIENTS.map(([k, name]) => [name, ...[0.25, 1 / 3, 0.5, 1].map((c) => g0(num(cups(c, k), 'grams')))]),
);
const CUP_FLOUR_2 = cups(2, 'flour');
const CUP_THIRD_ML = num(cups(1 / 3, 'water'), 'volumeMl');
const CUP_BUTTER_HALF = cups(0.5, 'butter');

// ---------------------------------------------------------------------------
// Tee
// ---------------------------------------------------------------------------
const tea = (teaType: string, waterAmountMl: number) => run('tee-ziehzeit-temperatur-rechner', { teaType, waterAmountMl });
const TEA_TYPES: Array<[string, string]> = [
  ['green', 'Grüner Tee'],
  ['white', 'Weißer Tee'],
  ['oolong', 'Oolong'],
  ['black', 'Schwarzer Tee'],
  ['herbal', 'Kräutertee'],
  ['fruit', 'Früchtetee'],
];
const TEA_TABLE = table(
  ['Sorte', 'Wasser', 'Ziehzeit', 'Tee für 250 ml', 'Tee für 1 Liter'],
  TEA_TYPES.map(([k, name]) => {
    const r = tea(k, 250);
    return [name, `${n(num(r, 'temperature'), 0)} °C`, txt(r, 'brewTime'), g1(num(r, 'teaLeaves')), g1(num(tea(k, 1000), 'teaLeaves'))];
  }),
);
const mix = (hotMl: number, hotC: number, coldMl: number, coldC: number) => (hotMl * hotC + coldMl * coldC) / (hotMl + coldMl);
const TEA_MIX_75 = mix(750, 100, 250, 15);
const TEA_MIX_80 = mix(800, 100, 200, 15);
const TEA_1L = tea('black', 1000);

// ---------------------------------------------------------------------------
// Alkohol beim Kochen
// ---------------------------------------------------------------------------
const booze = (alcoholMl: number, volPercent: number, cookingMethod: string, portionsCount: number) => run('alkohol-verkochungs-rechner', { alcoholMl, volPercent, cookingMethod, portionsCount });
const BOOZE_METHODS: Array<[string, string]> = [
  ['flambee', 'Flambiert'],
  ['stir15', '15 Min. köcheln'],
  ['simmer30', '30 Min. köcheln'],
  ['simmer60', '1 Std. köcheln'],
  ['simmer120', '2 Std. schmoren'],
  ['simmer150', 'über 2,5 Std. schmoren'],
];
const BOOZE_TABLE = table(
  ['Zubereitung', 'Anteil, der bleibt', '250 ml Rotwein (13 %): gesamt / je Portion (4)', '500 ml Bier (5 %): gesamt / je Portion (4)'],
  BOOZE_METHODS.map(([k, name]) => {
    const w = booze(250, 13, k, 4);
    const b = booze(500, 5, k, 4);
    return [name, txt(w, 'retentionPct'), `${g1(num(w, 'remainingGrams'))} / ${n(num(w, 'perPortion'), 2)} g`, `${g1(num(b, 'remainingGrams'))} / ${n(num(b, 'perPortion'), 2)} g`];
  }),
);
const BOOZE_START = 250 * 0.13 * 0.789;
const BOOZE_60 = booze(250, 13, 'simmer60', 4);
const BOOZE_RUM = booze(40, 40, 'flambee', 4);
const BEER_BOTTLE_G = num(run('cocktail-alkoholgehalt-rechner', { spiritMl: 330, spiritVolPct: 5, liqueurMl: 0, liqueurVolPct: 20, fillerMl: 0, iceMeltMl: 0 }), 'pureAlcohol');

export const KOCHEN_PAGE_CONTENT: PageContentMap = {
  'eiweiss-eigelb-ersatz-rechner': {
    sections: [
      {
        title: 'Welcher Ei-Ersatz für welches Gebäck?',
        content: `Kein Ersatz kann alles, was ein Ei kann. Entscheidend ist, welche Aufgabe das Ei im Rezept hat: binden, Feuchtigkeit geben oder Luft halten. Die Mengen stammen aus dem Rechner, die Einordnung aus der Backpraxis:\n\n${EGG_TABLE}\n\nFaustregel: Je mehr Eier ein Rezept braucht, desto schlechter klappt der Austausch. Rührkuchen mit zwei oder drei Eiern gelingen mit Apfelmark oder Leinsamen gut. Biskuit, Brandteig oder Eierlikörkuchen leben dagegen vom Ei als Gerüst, dort ist das Ergebnis mit Ersatz meist flach oder fest.`,
      },
      {
        title: 'So vermeiden Sie die typischen Fehler',
        content: '- **Zu viel Feuchtigkeit:** Apfelmark, Banane und Seidentofu bringen Wasser mit. Der Kuchen braucht dann oft ein paar Minuten länger. Machen Sie die Stäbchenprobe, statt nach Uhr zu backen.\n- **Leinsamen nicht gequollen:** Erst nach rund 10 Minuten Quellzeit entsteht die gelartige Masse, die bindet. Ungequollen bleiben nur Körnchen im Teig.\n- **Aquafaba mit Fett in Berührung:** Wie beim echten Eischnee schlägt sich Kichererbsenwasser nur in einer fettfreien Schüssel steif.\n- **Ersatz mischen:** Für drei Eier können Sie z. B. zwei durch Apfelmark und eines durch ein Leinsamen-Ei ersetzen. Dann wird der Teig saftig und bindet trotzdem.',
      },
    ],
    faqs: [
      {
        question: 'Wie viel Aquafaba brauche ich für den Eischnee aus 5 Eiern?',
        answer: `Der Rechner setzt 3 EL Kichererbsenwasser je Eiweiß an, für 5 Eiweiß also ${EGG_AQUA_5}. Wie viel Flüssigkeit eine Dose Kichererbsen liefert, schwankt; messen Sie nach dem Abgießen nach. Schlagen Sie das Wasser mit etwas Zitronensaft auf, bis es steif ist, und heben Sie den Zucker erst danach langsam unter.`,
      },
      {
        question: 'Wie viel Apfelmark ersetzt 4 Eier im Rührkuchen?',
        answer: `Der Rechner rechnet mit 70 g je Ei, also ${EGG_APPLE_4}. Bei vier Eiern ist das viel Flüssigkeit; ersetzen Sie lieber nur zwei bis drei Eier durch Apfelmark und den Rest durch Leinsamen-Ei, damit der Kuchen nicht speckig wird.`,
      },
      {
        question: 'Funktioniert das Leinsamen-Ei auch mit Chiasamen?',
        answer: `Ja, Sie können Chiasamen im selben Verhältnis nehmen. Für 2 Eier heißt das ${EGG_FLAX_2}. Gemahlene Samen binden besser als ganze, und dunkle Samen sieht man in hellem Teig als Pünktchen.`,
      },
    ],
  },

  'kaffee-wasser-verhaeltnis-rechner': {
    sections: [
      {
        title: 'Kaffeemenge nach Tassen: Tabelle für die Filtermaschine',
        content: `Die Tabelle zeigt, wie viel Kaffeemehl der Rechner für typische Mengen ausgibt. Viele Filtermaschinen haben auf der Wasserskala Tassen zu 125 ml, Kaffeebecher fassen eher 250 ml:\n\n${COFFEE_TABLE}\n\nDie Spalte „Lote“ rechnet mit 7 g je Kaffeelot bzw. gehäuftem Messlöffel. Messlöffel aus Kaffeedosen fassen oft weniger; wiegen Sie einen Löffel Ihres Kaffees einmal ab, dann wissen Sie, was er wirklich bringt.`,
      },
      {
        title: 'Warum am Ende weniger Kaffee in der Kanne ist',
        content: '- **Das Kaffeemehl hält Wasser fest:** Ein Teil des eingefüllten Wassers bleibt im nassen Kaffeesatz. Wer genau 4 volle Tassen haben will, füllt etwas mehr Wasser ein und rechnet die Kaffeemenge für diese größere Wassermenge.\n- **Mahlgrad passt zur Methode:** Für Filterkaffee mittel, für die French Press grob. Zu fein gemahlen läuft die Maschine langsam durch und der Kaffee wird bitter.\n- **Erst das Verhältnis, dann die Bohne:** Schmeckt der Kaffee dünn, erhöhen Sie zuerst die Menge (Stufe „Kräftig“), bevor Sie die Sorte wechseln.',
      },
    ],
    faqs: [
      {
        question: 'Wie viel Kaffeepulver brauche ich für 1 Liter Kaffee?',
        answer: `Je nach Stärke ${COFFEE_1L[0]} (mild), ${COFFEE_1L[1]} (ausgewogen) oder ${COFFEE_1L[2]} (kräftig). Das sind bei 7 g je Lot rund 8 bis 9 gehäufte Messlöffel.`,
      },
      {
        question: 'Wie viel Kaffee für eine volle 12-Tassen-Maschine?',
        answer: `12 Tassen à 125 ml sind ${txt(COFFEE_12, 'waterMl')}. Bei 60 g je Liter braucht es ${txt(COFFEE_12, 'coffeeG')} Kaffeemehl, das sind ${txt(COFFEE_12, 'coffeeSpoons')}.`,
      },
      {
        question: 'Wie viel Kaffee für einen großen Becher?',
        answer: `Für einen Becher mit 250 ml Wasser rechnet der Rechner ${txt(COFFEE_MUG, 'coffeeG')} Kaffeemehl bei 60 g je Liter, also gut zwei gehäufte Lote.`,
      },
    ],
  },

  'backzeit-temperatur-umluft-oberhitze-rechner': {
    sections: [
      {
        title: 'Umrechnungstabelle: Ober-/Unterhitze in Umluft',
        content: `Die gängigen Rezepttemperaturen, umgerechnet mit 20 °C Abzug für Umluft und 10 % kürzerer Backzeit:\n\n${OVEN_TABLE}\n\nDie Gasstufe ist nur ein grober Richtwert. Gasherde unterschiedlicher Hersteller sind verschieden skaliert; die Tabelle in der Bedienungsanleitung Ihres Herdes geht immer vor.`,
      },
      {
        title: 'Wann die 20-Grad-Regel nicht reicht',
        content: '- **Backzeit ist ein Startwert:** Die Minuten aus dem Rechner sind ein Anhaltspunkt. Ob ein Kuchen fertig ist, zeigt die Stäbchenprobe, nicht die Uhr.\n- **Zwei Bleche gleichzeitig:** Mit Umluft möglich, aber mit zwei vollen Blechen dauert es oft länger als mit einem. Tauschen Sie die Bleche nach der Hälfte der Zeit.\n- **Rezept aus dem Internet:** Steht nur „180 Grad“ ohne Heizart, ist meist Ober-/Unterhitze gemeint. Bei Umluft starten Sie dann mit 160 °C.\n- **Ofen heizt anders als angezeigt:** Viele Öfen weichen um einige Grad ab. Ein Backofenthermometer zeigt, ob Ihr Ofen eher zu heiß oder zu kalt ist.',
      },
    ],
    faqs: [
      {
        question: 'Wie viel Grad Umluft sind 180 Grad Ober-/Unterhitze?',
        answer: `${txt(OVEN_180, 'convectionDisplay')}. Aus 50 Minuten Backzeit werden laut Rechner ${txt(OVEN_180, 'adaptedTime')}. Prüfen Sie den Kuchen trotzdem ein paar Minuten früher.`,
      },
      {
        question: 'Das Rezept nennt 200 °C Umluft. Was stelle ich bei Ober-/Unterhitze ein?',
        answer: `${txt(OVEN_U200, 'topBottomDisplay')} Ober-/Unterhitze. Aus 30 Minuten werden ${txt(OVEN_U200, 'adaptedTime')}, weil ohne Gebläse die Wärme langsamer ins Backgut kommt.`,
      },
      {
        question: 'Welche Gasstufe entspricht 180 °C?',
        answer: `Nach der Faustformel des Rechners ${txt(OVEN_180, 'gasLevel')}. Da Gasherde je nach Hersteller anders skaliert sind, gleichen Sie das mit der Temperaturtabelle Ihres Herdes ab.`,
      },
    ],
  },

  'fondue-raclette-mengen-rechner': {
    sections: [
      {
        title: 'Einkaufsmengen nach Personenzahl',
        content: `Mengen für Erwachsene ohne Kinder, berechnet mit den festen Werten pro Person, die der Rechner je Menü verwendet:\n\n${PARTY_TABLE}\n\nKartoffeln und Brot kommen je nach Menü dazu, der Rechner zeigt sie nach Eingabe der Personenzahl mit an. Bei Raclette mit Tischgrill sind die Käse- und Fleischmengen kleiner, weil beides zusammen gegessen wird.`,
      },
      {
        title: 'Hygiene bei Fleischfondue und Raclette',
        content: 'Bei Fondue und Raclette liegt rohes Fleisch stundenlang neben Brot, Salat und Saucen. Das Bundesinstitut für Risikobewertung (BfR) weist darauf hin, dass gerade rohes Geflügel häufig Campylobacter trägt; schon sehr geringe Keimmengen können krank machen. Daraus folgt:\n\n- Fleisch vollständig durchgaren: im Kern mindestens zwei Minuten lang 70 °C (BfR).\n- Rohes Fleisch, vor allem Geflügel, getrennt von Speisen halten, die nicht mehr erhitzt werden.\n- Für rohes und gegartes Fleisch getrennte Teller und Gabeln verwenden; mit der Fonduegabel nicht direkt essen.\n- Hände und Bretter nach Kontakt mit rohem Fleisch gründlich reinigen, bevor Beilagen vorbereitet werden.',
      },
    ],
    faqs: [
      {
        question: 'Wie viel Raclettekäse für 10 Personen?',
        answer: `Beim klassischen Raclette rechnet der Rechner ${txt(PARTY_10, 'cheese')} Käse, dazu ${txt(PARTY_10, 'potatoes')} Kartoffeln und ${txt(PARTY_10, 'baguettes')} Baguette.`,
      },
      {
        question: 'Wie werden Kinder gerechnet?',
        answer: `Jedes Kind zählt als halbe Portion. 6 Erwachsene und 3 Kinder ergeben ${txt(PARTY_KIDS, 'eaters')}; beim klassischen Raclette sind das ${txt(PARTY_KIDS, 'cheese')} Käse. Jugendliche essen oft wie Erwachsene, zählen Sie sie dann lieber voll.`,
      },
      {
        question: 'Wie viel Fleisch für ein Fleischfondue mit 8 Personen?',
        answer: `Der Rechner setzt 250 g Fleisch pro Person an, für 8 Personen also ${txt(PARTY_MEAT_8, 'meat')}. Das gilt für Fondue mit Fett ebenso wie mit Brühe. Gibt es viele Saucen und Beilagen, reicht oft etwas weniger.`,
      },
    ],
  },

  'marmelade-geliermittel-rechner': {
    sections: [
      {
        title: 'Wie viele Gläser ergibt meine Fruchtmenge?',
        content: `Der Rechner zieht vom Gewicht aus Frucht und Gelierzucker rund 8 % für das Verdampfen ab und rechnet mit 1,25 g Marmelade je Milliliter Glasinhalt. So viele volle Gläser kommen heraus (Gläser aufgerundet):\n\n${JAM_TABLE}\n\nStellen Sie ein Glas mehr bereit, als der Rechner angibt. Je nach Frucht und Kochdauer verdampft mehr oder weniger Wasser, und ein halb volles Glas gehört ohnehin zuerst in den Kühlschrank.`,
      },
      {
        title: 'Schritt für Schritt: Konfitüre mit 2:1-Gelierzucker',
        content: `1. **Früchte vorbereiten und erst dann wiegen:** Stiele, Kerne und Steine kommen vorher weg, sonst stimmt das Verhältnis nicht.\n2. **Gelierzucker abwiegen:** Für 1.000 g Früchte sind es bei 2:1 ${txt(JAM_1KG_21, 'sugarAmount')}.\n3. **Zitronensaft zugeben:** Der Rechner nennt ${txt(JAM_1KG_21, 'lemon')}, bei 2 kg Früchten ${n(JAM_LEMON_2KG, 0)} ml.\n4. **Sprudelnd kochen:** Kochzeit nach Packungsangabe, dann die Gelierprobe machen.\n5. **Abfüllen:** Gläser und Deckel heiß ausspülen, bis knapp unter den Rand füllen und sofort verschließen.`,
      },
    ],
    faqs: [
      {
        question: 'Kann ich Gelierzucker durch normalen Zucker ersetzen?',
        answer: 'Nicht eins zu eins. Gelierzucker enthält Pektin und meist Zitronensäure; normaler Haushaltszucker geliert damit allein nicht zuverlässig. Wer mit normalem Zucker kocht, braucht zusätzlich ein Geliermittel und dessen eigene Mengenangabe.',
      },
      {
        question: 'Wie viel Marmelade ergibt 1 kg Obst mit 3:1-Gelierzucker?',
        answer: `Mit ${txt(JAM_1KG_31, 'sugarAmount')} kommen laut Rechner etwa ${txt(JAM_1KG_31, 'yield')} Marmelade heraus, das sind ${txt(JAM_1KG_31, 'jars')} à 250 ml. Mit 2:1 sind es ${txt(JAM_1KG_21, 'yield')} (${txt(JAM_1KG_21, 'jars')}), weil mehr Zucker im Topf landet.`,
      },
    ],
  },

  'salz-lake-poekel-rechner': {
    sections: [
      {
        title: 'Salzmengen je Verwendungszweck',
        content: `Jeder Zweck im Rechner hat eine feste Voreinstellung. Für andere Werte wählen Sie „Eigene Konzentration eingeben“:\n\n${BRINE_TABLE}\n\nDie Esslöffel-Angabe rechnet mit 18 g Salz je gestrichenem Esslöffel. Grobes Salz und Flockensalz wiegen pro Löffel deutlich weniger; nehmen Sie für Laken lieber die Küchenwaage.`,
      },
      {
        title: '„6 % Lake“ – Prozent vom Wasser oder von der ganzen Lake?',
        content: `Rezepte meinen mit der Prozentangabe nicht immer dasselbe. Der Rechner nimmt den Prozentsatz vom Wasser. Manche Anleitungen meinen dagegen den Salzanteil an der fertigen Lake aus Wasser und Salz. Der Unterschied wächst mit dem Salzgehalt:\n\n${BRINE_SHARE_TABLE}\n\nBei 2 % zum Fermentieren spielt das kaum eine Rolle, bei starken Pökellaken schon. Folgen Sie der Rechenweise Ihres Rezepts oder der Anleitung des Pökelsalzes.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel Salz brauche ich für eine 2-%-Lake zum Fermentieren?',
        answer: `Auf 1 Liter Wasser ${BRINE_FERMENT_1}, auf 1,5 Liter ${BRINE_FERMENT_15}. Das Gemüse muss vollständig von der Lake bedeckt sein; was herausragt, kann schimmeln.`,
      },
      {
        question: 'Darf man gepökeltes Fleisch wie Kasseler oder Speck grillen?',
        answer: 'Die Verbraucherzentrale Hamburg rät davon ab: Ab etwa 150 °C bilden sich aus dem Nitrit im Pökelfleisch vermehrt Nitrosamine. Gepökeltes gehört deshalb nicht auf den Grill oder in die heiße Pfanne, sondern wird gekocht oder schonend erwärmt.',
      },
      {
        question: 'Kann ich die Lake ein zweites Mal verwenden?',
        answer: 'Nein. In der Lake landen Fleischsaft und Keime aus dem ersten Durchgang. Die Verbraucherzentrale empfiehlt, Reste von Marinaden, in denen Fleisch lag, sofort sorgfältig zu entsorgen. Setzen Sie für jede Partie eine frische Lake an.',
      },
    ],
  },

  'cocktail-alkoholgehalt-rechner': {
    sections: [
      {
        title: 'Alkoholgehalt bekannter Drinks im Vergleich',
        content: `Gerechnet mit typischen Barmengen (1 cl = 10 ml). Die Werte der Spirituosen sind Beispiele, maßgeblich ist das Etikett Ihrer Flasche:\n\n${DRINK_TABLE}\n\nDer Vergleich zeigt: Ein kurzer Drink wie die Margarita hat einen viel höheren Prozentwert als ein Longdrink. In Gramm reinem Alkohol ist der Abstand viel kleiner, als der Prozentwert vermuten lässt, weil im Longdrink mehr Volumen steckt.`,
      },
      {
        title: 'Eis, Glasgröße und was die Gramm-Zahl aussagt',
        content: `Schmelzwasser verdünnt den Drink, entfernt aber keinen Alkohol. Derselbe Cuba Libre mit 5 cl Rum hat ohne Schmelzwasser ${txt(DRINK_ICE[0], 'finalVol')}, mit 3 cl ${txt(DRINK_ICE[1], 'finalVol')} und mit 6 cl ${txt(DRINK_ICE[2], 'finalVol')}; die Alkoholmenge bleibt jedes Mal ${txt(DRINK_ICE[0], 'pureAlcohol')}.\n\nFür den Körper zählt die Gramm-Zahl, nicht der Prozentwert. Eine 0,33-l-Flasche Bier mit 5 % enthält nach derselben Rechnung ${g1(BEER_BOTTLE_G)} Alkohol; das ist der Vergleichswert, den der Rechner als „Flaschen Bier“ ausgibt. Für die Blutalkoholkonzentration gibt es einen eigenen Promillerechner, dieser Rechner sagt darüber nichts aus.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel Alkohol hat ein Cuba Libre?',
        answer: `Mit 5 cl Rum (40 %), 15 cl Cola und 3 cl Schmelzwasser rund ${txt(DRINK_CUBA, 'finalVol')} und ${txt(DRINK_CUBA, 'pureAlcohol')}. Das entspricht laut Rechner ${txt(DRINK_CUBA, 'beerEquiv')}.`,
      },
      {
        question: 'Wie stark ist ein doppelter Gin Tonic?',
        answer: `Mit 8 cl Gin und 16 cl Tonic kommt der Drink auf ${txt(DRINK_DOUBLE, 'finalVol')} und ${txt(DRINK_DOUBLE, 'pureAlcohol')}, also so viel Alkohol wie ${txt(DRINK_DOUBLE, 'beerEquiv').replace('ca. ', 'etwa ')}.`,
      },
      {
        question: 'Warum ist eine Margarita so viel stärker als ein Longdrink?',
        answer: `Weil kaum alkoholfreie Zutaten dazukommen. Unser Beispiel mit 5 cl Tequila und 2 cl Orangenlikör hat ${txt(DRINK_MARGARITA, 'finalVol')} bei nur ${txt(DRINK_MARGARITA, 'drinkSize')} Volumen.`,
      },
    ],
  },

  'kalorien-rezept-rechner': {
    sections: [
      {
        title: 'So kommen Sie an die Makro-Summen Ihres Rezepts',
        content: `Der Rechner braucht die Gesamtmengen an Kohlenhydraten, Eiweiß und Fett. Die holen Sie sich aus den Nährwerttabellen der Packungen: Wert je 100 g × verwendete Gramm ÷ 100. Beispiel Bolognese für 4 Portionen (Nährwerte sind Beispielwerte von Packungen, nehmen Sie Ihre eigenen):\n\n${KC_TABLE}\n\nSumme gerundet: ${n(Math.round(KC_SUM[0]), 0)} g Kohlenhydrate, ${n(Math.round(KC_SUM[1]), 0)} g Eiweiß, ${n(Math.round(KC_SUM[2]), 0)} g Fett. Der Rechner macht daraus ${txt(KC_RESULT, 'totalKcal')} und ${txt(KC_RESULT, 'kcalPortion')} pro Portion.\n\nWichtig: Nudeln, Reis und Hülsenfrüchte immer mit dem Trockengewicht und den Trocken-Nährwerten eintragen. Das Kochwasser hat keine Kalorien.`,
      },
      {
        title: 'Warum die Packung mit anderen Faktoren rechnet',
        content: `Der Rechner verwendet die klassischen Brennwerte 4,1 kcal je Gramm Kohlenhydrate und Eiweiß und 9,3 kcal je Gramm Fett. Für Nährwertangaben auf Lebensmitteln schreibt die EU-Lebensmittelinformationsverordnung (LMIV) gerundete Faktoren vor: 4 kcal (17 kJ) für Kohlenhydrate und Eiweiß, 9 kcal (37 kJ) für Fett. Für das Bolognese-Beispiel ergibt das ${n(KC_LMIV, 0)} kcal statt ${n(KC_TOTAL, 0)} kcal, rund ${n(((KC_TOTAL - KC_LMIV) / KC_LMIV) * 100, 0)} % weniger.\n\nZwei Dinge fehlen im Rechner ganz: Ballaststoffe (laut LMIV 2 kcal je Gramm) und Alkohol (7 kcal je Gramm), etwa aus Wein in der Sauce. Wer sehr genau rechnen will, addiert diese Posten selbst.`,
      },
    ],
    faqs: [
      {
        question: 'Wie berechne ich die Kalorien pro 100 g meines Gerichts?',
        answer: `Wiegen Sie das fertige Gericht im Topf (ohne Topf). Wiegt die Bolognese aus dem Beispiel ${n(KC_FINAL_WEIGHT, 0)} g, ergibt das ${n(KC_TOTAL, 0)} kcal ÷ ${n(KC_FINAL_WEIGHT, 0)} g × 100 = ${n((KC_TOTAL / KC_FINAL_WEIGHT) * 100, 0)} kcal je 100 g. Dann können Sie auch ungleiche Portionen abwiegen.`,
      },
      {
        question: 'Wie viel machen ein paar Löffel Öl aus?',
        answer: `Mehr, als man denkt: 10 g Fett ergeben im Rechner ${n(KC_OIL, 0)} kcal. Ein Esslöffel Öl wiegt etwa 10 bis 14 g. Deshalb lohnt es sich, Bratfett abzuwiegen statt zu schätzen.`,
      },
      {
        question: 'Was bedeutet das Standardbeispiel im Rechner?',
        answer: `120 g Kohlenhydrate, 60 g Eiweiß und 30 g Fett ergeben ${txt(KC_DEFAULT, 'totalKcal')}; auf 3 Portionen verteilt sind das ${txt(KC_DEFAULT, 'kcalPortion')} pro Teller. Fett liefert davon trotz der kleinsten Grammzahl ${n((num(kcal(0, 0, 30, 1), 'totalKcal') / num(KC_DEFAULT, 'totalKcal')) * 100, 0)} % der Energie.`,
      },
    ],
  },

  'brot-backen-baeckermass-rechner': {
    sections: [
      {
        title: 'Teigausbeute mit Sauerteig: was der Rechner nicht mitzählt',
        content: `Die TA im Ergebnis bezieht sich nur auf Hauptmehl und Schüttwasser. Der Sauerteig selbst besteht aber auch aus Mehl und Wasser, bei TA 200 je zur Hälfte. Rechnet man ihn mit ein, ist der Teig weicher, als die TA im Rechner vermuten lässt. Für einen 1.000-g-Teig mit 70 % Wasser und 2 % Salz:\n\n${BREAD_TABLE}\n\nWenn ein Rezept eine Gesamt-TA nennt, ist meist die rechte Spalte gemeint. Ziehen Sie in diesem Fall etwas Schüttwasser ab, bis die Gesamt-TA passt.`,
      },
      {
        title: 'Vom Wunschbrot zum Rezept in drei Schritten',
        content: '1. **Teiggewicht festlegen:** Beim Backen verdunstet Wasser, das fertige Brot wiegt also weniger als der Teigling. Wiegen Sie Teig und Brot einmal selbst, dann kennen Sie den Verlust in Ihrem Ofen und können das Teiggewicht passend wählen.\n2. **Wassermenge nach Mehl wählen:** Roggen- und Vollkornmehle nehmen mehr Wasser auf als helles Weizenmehl. Anfänger starten mit einem festeren Teig und steigern das Wasser in kleinen Schritten.\n3. **Sauerteig oder Hefe:** Bei 0 % Sauerteig rechnet der Rechner ein reines Hefebrot; die Hefemenge ermitteln Sie dann separat.',
      },
    ],
    faqs: [
      {
        question: 'Wie viel Mehl brauche ich für ein Brot mit 750 g Teig?',
        answer: `Mit 70 % Wasser, 2 % Salz und 20 % Sauerteig: ${txt(BREAD_750, 'flour')} Mehl, ${txt(BREAD_750, 'water')} Wasser, ${txt(BREAD_750, 'sourdough')} Sauerteig und ${txt(BREAD_750, 'salt')} Salz.`,
      },
      {
        question: 'Was bedeutet TA 180 in Gramm?',
        answer: `TA 180 heißt 80 Teile Wasser auf 100 Teile Mehl. Für einen 1.000-g-Teig mit 2 % Salz und 20 % Sauerteig nennt der Rechner ${txt(BREAD_TA180, 'flour')} Mehl und ${txt(BREAD_TA180, 'water')} Wasser. Solche weichen Teige brauchen eine Form oder viel Übung beim Formen.`,
      },
    ],
  },

  'schokolade-temperieren-rechner': {
    sections: [
      {
        title: 'Mengen und Temperaturen auf einen Blick',
        content: `Die Aufteilung nach der Impfmethode für gängige Mengen:\n\n${CHOC_AMOUNTS}\n\nDie Temperaturen, mit denen der Rechner je Sorte arbeitet:\n\n${CHOC_TEMPS}\n\nWeiße und Vollmilch-Kuvertüre enthalten Milchbestandteile und verbrennen schneller. Schmelzen Sie sie besonders langsam und rühren Sie dabei ständig.`,
      },
      {
        title: 'Test und Fehlerbehebung',
        content: '- **Messertest:** Tauchen Sie eine Messerspitze in die Schokolade und legen Sie sie bei Raumtemperatur ab. Wird die Schicht innerhalb weniger Minuten fest und glänzend, ist die Schokolade richtig temperiert.\n- **Bleibt sie weich oder wird streifig:** Die Masse war zu warm. Weitere gehackte Kuvertüre einrühren und erneut abkühlen lassen.\n- **Ist sie zu dick zum Arbeiten:** Ganz kurz erwärmen, aber nicht über die Verarbeitungstemperatur, sonst gehen die Kristalle wieder verloren.\n- **Grauer Schleier nach Tagen:** Das ist Fettreif aus Kakaobutter. Die Schokolade ist essbar, sieht aber nicht mehr schön aus.\n- **Raum zu warm:** In einer Küche über etwa 25 °C wird temperierte Schokolade nur langsam fest.',
      },
    ],
    faqs: [
      {
        question: 'Kann ich normale Tafelschokolade temperieren?',
        answer: 'Ja, aber Kuvertüre ist dafür gemacht: Sie enthält mehr Kakaobutter, ist dünnflüssiger und überzieht Pralinen gleichmäßiger. Tafelschokolade ergibt dickere Schichten und glänzt oft weniger.',
      },
      {
        question: 'Wie viel Impfschokolade brauche ich für 500 g Kuvertüre?',
        answer: `Der Rechner teilt 500 g in ${txt(choc(500, 'dark'), 'meltPortion').replace(/ \(bei.*$/, '')} zum Schmelzen und ${txt(choc(500, 'dark'), 'seedPortion').replace(/ \(bis.*$/, '')} zum Impfen. Nehmen Sie für die Impfschokolade Kuvertüre aus der Packung, denn die ist bereits richtig kristallisiert.`,
      },
    ],
  },

  'sauerteig-anstellgut-rechner': {
    sections: [
      {
        title: 'Mengentabelle für alle drei Fütterungsverhältnisse',
        content: `Jeweils mit 30 g Reserve für das nächste Anstellgut. Die Werte lesen Sie als Anstellgut / Mehl / Wasser:\n\n${SOUR_TABLE}\n\nJe weiter das Verhältnis, desto weniger Anstellgut brauchen Sie und desto länger dauert die Reife. 1:5:5 ist praktisch, wenn der Sauerteig über Nacht stehen soll.`,
      },
      {
        title: 'Worauf es bei der Führung ankommt',
        content: '- **Temperatur:** Die Reifezeiten im Auswahlfeld gelten für normale Raumtemperatur. In einer kühlen Küche dauert es länger, an einem warmen Ort geht es schneller und der Sauerteig wird saurer.\n- **Anstellgut aus dem Kühlschrank:** Nach mehr als einer Woche Pause zuerst einmal auffrischen, bevor Sie damit ein Brot ansetzen.\n- **Mehlsorte:** Füttern Sie mit dem Mehl, das ins Brot soll. Ein Weizen-Anstellgut, das Sie mit Roggenmehl füttern, wird nach einigen Fütterungen zum Roggensauerteig.\n- **Wiegen statt schätzen:** Bei 1:5:5 machen wenige Gramm Anstellgut mehr oder weniger viel aus.',
      },
    ],
    faqs: [
      {
        question: 'Wie viel Anstellgut für 500 g Sauerteig?',
        answer: `Bei 1:1:1 mit 30 g Reserve: ${txt(SOUR_500, 'starter')}, ${txt(SOUR_500, 'flour')} und ${txt(SOUR_500, 'water')}. Mit 1:5:5 reichen ${txt(SOUR_500_155, 'starter')} auf ${txt(SOUR_500_155, 'flour')} und ${txt(SOUR_500_155, 'water')}.`,
      },
      {
        question: 'Kann ich mehr Reserve einplanen?',
        answer: `Ja. Mit 50 g Reserve und 1:2:2 ergibt sich für 200 g Sauerteig: ${txt(SOUR_RES50, 'starter')}, ${txt(SOUR_RES50, 'flour')} und ${txt(SOUR_RES50, 'water')}. Insgesamt entstehen ${txt(SOUR_RES50, 'totalProduced')}.`,
      },
    ],
  },

  'fleisch-kerntemperatur-garzeit-rechner': {
    sections: [
      {
        title: 'Alle Kerntemperaturen des Rechners in einer Tabelle',
        content: `Zielwerte je Fleisch und Garstufe, dazu Ofentemperatur und geschätzte Garzeit für ein Stück von 1,5 kg (Garstufe Medium):\n\n${MEAT_TABLE}\n\nBei Schwein, Geflügel und Pulled Pork ändert die Garstufe wenig oder nichts: Schwein bleibt bei mindestens 70 °C, Geflügel immer bei 75 °C, Pulled Pork braucht über 90 °C, damit es zerfällt.`,
      },
      {
        title: 'Lebensmittelsicherheit: wann 70 °C Pflicht sind',
        content: 'Das Bundesinstitut für Risikobewertung (BfR) und die Verbraucherzentralen empfehlen, Fleisch so zu garen, dass im Kern mindestens zwei Minuten lang 70 °C erreicht werden. Das gilt besonders für:\n\n- **Geflügel:** häufig mit Campylobacter oder Salmonellen belastet.\n- **Hackfleisch:** durch die große Oberfläche ideale Bedingungen für Keime.\n- **Schweinefleisch und frische Bratwurst.**\n\nRosa gebratene Rinder- und Lammstücke sind eine Garstufe für ganze Stücke, kein Hygienewert. Für Schwangere, kleine Kinder, ältere und abwehrgeschwächte Menschen ist durchgegartes Fleisch die sichere Wahl. Messen Sie mit einem Einstichthermometer: Die Farbe des Fleisches allein ist kein verlässliches Zeichen.',
      },
    ],
    faqs: [
      {
        question: 'Wie lange braucht ein 2-kg-Schweinebraten?',
        answer: `Der Rechner schätzt bei ${txt(MEAT_PORK2, 'ovenTemp')} Ofentemperatur ${txt(MEAT_PORK2, 'estTime')} bis ${txt(MEAT_PORK2, 'targetCoreTemp')} Kerntemperatur. Die Zeit ist eine Planungsgröße; fertig ist der Braten, wenn das Thermometer den Zielwert zeigt.`,
      },
      {
        question: 'Wie lange dauert Pulled Pork mit 3 kg?',
        answer: `Laut Rechner etwa ${txt(MEAT_PULLED3, 'estTime')} bei ${txt(MEAT_PULLED3, 'ovenTemp')}, bis ${txt(MEAT_PULLED3, 'targetCoreTemp')} im Kern erreicht sind. Planen Sie Puffer ein: Oft bleibt die Kerntemperatur über Stunden fast stehen, bevor sie weiter steigt.`,
      },
      {
        question: 'Dauert ein doppelt so schwerer Braten doppelt so lange?',
        answer: `Im Rechner ja, er rechnet linear mit dem Gewicht: 1 kg Roastbeef braucht ${txt(MEAT_ROAST1, 'estTime')}, 2 kg brauchen ${txt(MEAT_ROAST2, 'estTime')} In der Praxis zählt aber vor allem die Dicke: Ein langes, flaches Stück wird schneller gar als ein kompaktes gleichen Gewichts. Deshalb entscheidet am Ende das Thermometer.`,
      },
    ],
  },

  'pizza-teig-rechner': {
    sections: [
      {
        title: 'Zutaten für gängige Pizzamengen',
        content: `Mit 3 % Salz und der Hefemenge des Rechners für rund 24 Stunden Teigführung:\n\n${PIZZA_TABLE}\n\n60 bis 65 % Wasser lassen sich auch von Hand gut verarbeiten. Ab 70 % klebt der Teig stark und braucht Übung, eine Teigkarte und nasse Hände. Für die winzigen Hefemengen lohnt eine Feinwaage oder ein Trick: 1 g Hefe in 100 g Wasser auflösen und den passenden Teil davon abwiegen.`,
      },
      {
        title: 'Ablauf für einen Teig mit langer Gare',
        content: '1. Wasser abwiegen, Hefe darin auflösen.\n2. Etwa 90 % des Mehls einrühren, kurz quellen lassen, dann Salz und restliches Mehl zugeben.\n3. Kneten, bis der Teig glatt ist und sich vom Schüsselrand löst.\n4. Abgedeckt reifen lassen; bei kleinen Hefemengen ist ein Teil der Gare im Kühlschrank üblich.\n5. Rechtzeitig vor dem Backen zu Ballen formen und bei Raumtemperatur entspannen lassen.\n6. Im Haushaltsofen auf höchster Stufe mit Pizzastein oder -stahl backen, der gut vorgeheizt ist.',
      },
    ],
    faqs: [
      {
        question: 'Wie viele Pizzen ergeben 500 g Mehl?',
        answer: `Für einen 260-g-Ballen mit 65 % Wasser braucht der Rechner ${g0(PIZZA_FLOUR_PER_BALL)} Mehl. Aus 500 g Mehl werden also ${PIZZA_BALLS_500} Ballen à 260 g, mit etwas Teig übrig. Insgesamt ergibt das ${g0(PIZZA_DOUGH_500)} Teig; für 4 Pizzen wären das kleinere Ballen à ${g0(PIZZA_DOUGH_500 / 4)}.`,
      },
      {
        question: 'Wie viel Trockenhefe statt frischer Hefe?',
        answer: `Ein Drittel der frischen Menge. Für 4 Pizzen à 260 g nennt der Rechner ${txt(PIZZA_4, 'freshYeast').replace(/ \(.*$/, '')} frische Hefe, also rund ${n(PIZZA_DRY_4, 2)} g Trockenhefe.`,
      },
    ],
  },

  'kuehlschrank-haltbarkeit-rechner': {
    sections: [
      {
        title: 'Lagerdauer aller Kategorien im Überblick',
        content: `Die Richtwerte des Rechners setzen eine ununterbrochene Kühlkette und einen richtig eingestellten Kühlschrank voraus:\n\n${FRIDGE_TABLE}\n\nSteht auf der Packung ein **Verbrauchsdatum** („zu verbrauchen bis“), gilt dieses Datum und nicht die Tabelle. Beim **Mindesthaltbarkeitsdatum** („mindestens haltbar bis“) dürfen Sie nach Ablauf prüfen, ob das Lebensmittel noch gut ist.`,
      },
      {
        title: 'Temperaturen, die die Verbraucherzentrale nennt',
        content: '- **Kühlschrank:** höchstens 7 °C einstellen.\n- **Rohes, verpacktes Fleisch:** meist nicht wärmer als 4 °C lagern.\n- **Vorverpacktes Hackfleisch:** teils nur bis 2 °C. Schafft Ihr Kühlschrank das nicht, verbrauchen Sie es am Einkaufstag.\n- **Eier:** nicht in der Tür lagern, dort schwankt die Temperatur beim Öffnen zu stark. Ab dem 18. Tag nach dem Legen sollten Eier gekühlt werden.\n- **Hart gekochte Eier:** mit heiler Schale und nicht abgeschreckt bei 2 bis 6 °C bis zu 4 Wochen, abgeschreckt etwa 2 Wochen.\n\nWelche Zone in Ihrem Gerät die kälteste ist, steht in der Bedienungsanleitung; Geräte mit Umluftkühlung haben fast überall dieselbe Temperatur.',
      },
    ],
    faqs: [
      {
        question: 'Wie lange hält Hackfleisch im Kühlschrank?',
        answer: `Der Rechner sagt: ${txt(fridge('mincedMeat'), 'days')}. Vorverpacktes Hackfleisch darf laut Verbraucherzentrale teils nur bei höchstens 2 °C lagern; gilt das Verbrauchsdatum auf der Packung länger, setzt es genau diese Temperatur voraus. Eingefroren hält es ${FRIDGE_MINCE_FREEZE}.`,
      },
      {
        question: 'Kann man rohe Eier einfrieren?',
        answer: 'Ja, aber nicht in der Schale. Die Verbraucherzentrale empfiehlt, die Eier aufzuschlagen und Eigelb und Eiweiß entweder verquirlt oder getrennt einzufrieren. Aufgetaut eignen sie sich zum Backen und für Rührei.',
      },
      {
        question: 'Wie erwärme ich Reste sicher?',
        answer: 'Reste im Kühlschrank in geschlossenen Behältern aufbewahren und vor dem Essen durch und durch erhitzen, im Kern auf mindestens 70 °C. Erwärmen Sie nur die Menge, die Sie essen, und wärmen Sie Reste nicht mehrmals auf.',
      },
    ],
  },

  'hefe-umrechner': {
    sections: [
      {
        title: 'Umrechnungstabelle für die häufigsten Rezeptangaben',
        content: `Gerechnet mit 1 Würfel = 42 g frische Hefe, 1 Päckchen = 7 g Trockenhefe und dem Verhältnis 3 : 1:\n\n${YEAST_TABLE}\n\nDie letzte Spalte ist die Faustregel „1 Würfel auf 1 kg Mehl“ für normale Hefeteige bei kurzer Gare.`,
      },
      {
        title: 'Wann die Mehl-Faustregel nicht passt',
        content: '- **Reiche Teige:** Hefezopf, Stollen oder Brioche mit viel Butter, Zucker und Eiern bremsen die Hefe. Rezepte nehmen dafür oft mehr Hefe, als die Faustregel ergibt.\n- **Lange, kalte Gare:** Reift der Teig über Nacht im Kühlschrank, reicht ein Bruchteil der Hefe. Die Menge steht dann im Rezept, nicht in der Faustregel.\n- **Trockenhefe einrühren:** Die meisten Trockenhefen im Päckchen werden laut Packung direkt mit dem Mehl vermischt. Frische Hefe lösen Sie dagegen in etwas lauwarmer Flüssigkeit auf.\n- **Zu heiße Flüssigkeit:** Hefe ist ein Lebewesen. Flüssigkeit, die sich am Handgelenk heiß anfühlt, schädigt sie; lauwarm genügt.',
      },
    ],
    faqs: [
      {
        question: 'Wie viel frische Hefe brauche ich für 500 g Mehl?',
        answer: `Nach der Faustregel ${txt(YEAST_FOR_500, 'freshG')}, also ${txt(YEAST_FOR_500, 'cubes')} oder ${txt(YEAST_FOR_500, 'dryBags')} Trockenhefe.`,
      },
      {
        question: 'Wie rechne ich 15 g frische Hefe in Trockenhefe um?',
        answer: `15 g frische Hefe entsprechen ${txt(YEAST_15, 'dryBags')} Trockenhefe. Ein angebrochenes Päckchen verschließen Sie gut und verbrauchen es bald.`,
      },
      {
        question: 'Wie viel Hefe für 1,5 kg Mehl?',
        answer: `${txt(YEAST_FOR_1500, 'cubes')} frische Hefe (${txt(YEAST_FOR_1500, 'freshG')}) oder ${txt(YEAST_FOR_1500, 'dryBags')} Trockenhefe; das reicht laut Faustregel für ${txt(YEAST_FOR_1500, 'flour').replace('ca. ', '')}.`,
      },
    ],
  },

  'backform-umrechner': {
    sections: [
      {
        title: 'Rezept für 26 cm umrechnen: Tabelle',
        content: `Die meisten deutschen Kuchenrezepte sind für eine 26-cm-Springform geschrieben. So ändern sich die Mengen für andere Durchmesser:\n\n${PAN_TABLE}\n\nRunden Sie Eier auf ganze Stücke und gleichen Sie den Rest mit einem Schuss Milch aus. Backpulver und Salz rechnen Sie mit demselben Faktor um wie alle anderen Zutaten.`,
      },
      {
        title: 'Eckige Formen und Backbleche umrechnen',
        content: `Der Rechner arbeitet mit runden Formen. Für eckige Formen rechnen Sie zuerst die Fläche aus (Länge × Breite) und suchen den runden Durchmesser mit gleicher Fläche: d = 2 × √(Fläche ÷ π).\n\n- **Backblech 40 × 30 cm:** 1.200 cm², das entspricht einer runden Form mit ${n(PAN_TRAY_D, 1)} cm. Ein 26-cm-Rezept muss dafür mit ${n(Number(PAN_TRAY.primary.value), 2)} multipliziert werden.\n- **Quadratische Form 24 × 24 cm:** 576 cm², entspricht ${n(PAN_SQUARE_D, 1)} cm rund, Faktor ${n(Number(PAN_SQUARE.primary.value), 2)} gegenüber 26 cm.\n\nKastenformen sind schmal und hoch; dort hilft die Flächenrechnung wenig. Messen Sie bei Kastenformen lieber das Volumen mit Wasser aus und vergleichen Sie es.`,
      },
    ],
    faqs: [
      {
        question: 'Ich habe ein Rezept für 20 cm, aber eine 26-cm-Form. Wie viel mehr Teig?',
        answer: `Faktor ${txt(PAN_20_26, 'panFactor')}, also ${txt(PAN_20_26, 'areaDiff')} Teig. Aus 2 Eiern werden rechnerisch ${n(2 * Number(PAN_20_26.primary.value), 1)}, also 3 bis 4 Eier.`,
      },
      {
        question: 'Wie viele Eier nehme ich, wenn ich ein 26-cm-Rezept mit 3 Eiern in einer 20-cm-Form backe?',
        answer: `Rechnerisch ${n(PAN_EGGS_26_20, 2)} Eier, also 2 Eier. Fehlt dem Teig danach etwas Flüssigkeit, gleichen Sie das mit 1 bis 2 EL Milch aus.`,
      },
    ],
  },

  portionsrechner: {
    sections: [
      {
        title: 'Rezept für 4 Personen umrechnen: Tabelle',
        content: `So ändern sich typische Zutaten, wenn das Rezept für 4 Portionen geschrieben ist:\n\n${PORTION_TABLE}\n\nUnhandliche Werte runden Sie sinnvoll: 0,75 Eier wird zu einem kleinen Ei, 1,5 EL zu 1 EL plus 1½ TL (1 EL = 3 TL).`,
      },
      {
        title: 'Was sich nicht einfach mit dem Faktor rechnen lässt',
        content: '- **Topf und Pfanne:** Doppelte Mengen brauchen mehr Platz. Fleisch in zu voller Pfanne kocht im eigenen Saft, statt zu braten; braten Sie lieber in zwei Durchgängen.\n- **Flüssigkeit beim Schmoren:** Wie viel verdampft, hängt von der Topfoberfläche ab, nicht von der Menge. Bei verdoppelten Schmorgerichten zuerst etwas weniger Flüssigkeit nehmen und bei Bedarf nachgießen.\n- **Backen:** Für Kuchen zählt die Form. Ändert sich die Größe, rechnen Sie mit dem Backform-Umrechner über die Fläche.\n- **Würzen:** Salz, Chili und starke Gewürze zunächst etwas knapper dosieren und zum Schluss abschmecken.',
      },
    ],
    faqs: [
      {
        question: 'Wie halbiere ich 3 EL aus einem Rezept für 4 Personen?',
        answer: `Für 2 Portionen ergibt der Rechner ${n(PORTION_HALF_EL, 1)} EL. Da 1 EL drei Teelöffeln entspricht, nehmen Sie 1 EL und 1½ TL.`,
      },
      {
        question: 'Mein Rezept ist für 6 Personen, ich koche für 4. Was wird aus 750 g?',
        answer: `Faktor ${txt(PORTION_6_TO_4, 'factor')}, also ${txt(PORTION_6_TO_4, 'scaledAmount')}. Die Menge pro Portion bleibt mit ${txt(PORTION_6_TO_4, 'perPortion')} gleich.`,
      },
    ],
  },

  'cups-in-gramm-rechner': {
    sections: [
      {
        title: 'Cup-Tabelle für die häufigsten Backzutaten',
        content: `Gerechnet mit dem US Customary Cup (236,6 ml), der in amerikanischen Rezepten Standard ist. Bruchteile wie ⅓ Cup kommen in US-Rezepten oft vor:\n\n${CUP_TABLE}\n\nDie Grammwerte für Mehl und Zucker sind Durchschnittswerte für gelöffeltes und abgestrichenes Pulver. Wer den Becher direkt in die Mehltüte taucht, hat deutlich mehr Mehl im Cup.`,
      },
      {
        title: 'Weitere US-Maße, die in Rezepten auftauchen',
        content: '- **1 tablespoon (tbsp):** ca. 14,8 ml, entspricht fast unserem Esslöffel (15 ml).\n- **1 teaspoon (tsp):** ca. 4,9 ml, entspricht dem Teelöffel (5 ml).\n- **1 fluid ounce (fl oz):** ca. 29,6 ml; 8 fl oz ergeben einen Cup.\n- **1 ounce (oz):** 28,35 g. Achtung: Das ist ein Gewicht, die fluid ounce ein Volumen.\n- **1 pound (lb):** 453,6 g.\n- **1 stick butter:** ½ Cup, rund 113 g.\n- **Ofentemperatur:** US-Rezepte nennen Grad Fahrenheit. 350 °F sind rund 177 °C, im deutschen Ofen also 175 bis 180 °C Ober-/Unterhitze.',
      },
    ],
    faqs: [
      {
        question: 'Wie viel Gramm sind 2 Cups Mehl?',
        answer: `${txt(CUP_FLOUR_2, 'grams')}, gerechnet mit ${txt(CUP_FLOUR_2, 'perCup')}. Bei britischen oder australischen Rezepten mit 250-ml-Cups etwas mehr.`,
      },
      {
        question: 'Wie messe ich ⅓ Cup ohne Messbecher ab?',
        answer: `⅓ US-Cup sind ${n(CUP_THIRD_ML, 1)} ml. Das sind 5 Esslöffel plus 1 Teelöffel. Für Pulver wie Mehl ist Abwiegen genauer: Nehmen Sie den Grammwert aus der Tabelle.`,
      },
      {
        question: 'Ist ein Cup dasselbe wie eine Tasse?',
        answer: 'Nein. Ein US-Cup hat ca. 236,6 ml, eine deutsche Kaffeetasse eher 125 bis 150 ml. Wer mit der Tasse misst, nimmt deutlich zu wenig. Für ½ Cup Butter nennt der Rechner ' + txt(CUP_BUTTER_HALF, 'grams') + '.',
      },
    ],
  },

  'tee-ziehzeit-temperatur-rechner': {
    sections: [
      {
        title: 'Temperatur, Ziehzeit und Teemenge je Sorte',
        content: `Der Rechner rechnet für alle Sorten mit 12 g Tee je Liter, das sind rund 3 g für eine große Tasse:\n\n${TEA_TABLE}\n\nBei feinem Bruch (z. B. in Teebeuteln) geht die Ziehzeit schneller; großblättrige Tees brauchen eher das obere Ende. Kräuter- und Früchtetee sollen nach dem BfR mindestens 5 Minuten ziehen; die Zeiten des Rechners liegen darüber.`,
      },
      {
        title: 'Die richtige Temperatur ohne Thermometer',
        content: `Gekochtes Wasser lässt sich mit kaltem Wasser gezielt abkühlen. Die Mischtemperatur ergibt sich aus den Anteilen: T = (Menge heiß × 100 °C + Menge kalt × Temperatur kalt) ÷ Gesamtmenge.\n\n- 750 ml kochendes Wasser + 250 ml Leitungswasser mit 15 °C ergeben ${n(TEA_MIX_75, 0)} °C, passend für grünen oder weißen Tee.\n- 800 ml kochendes Wasser + 200 ml mit 15 °C ergeben ${n(TEA_MIX_80, 0)} °C, passend für Oolong.\n\nDie Kanne nimmt ebenfalls etwas Wärme auf, im Ergebnis ist das Wasser also eher ein paar Grad kühler. Für Kräuter- und Früchtetee gilt dagegen: sprudelnd kochend aufgießen. Heißwasserspender mit 80 bis 85 °C reichen dafür laut BfR nicht.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel Tee für eine 1-Liter-Kanne?',
        answer: `${txt(TEA_1L, 'teaLeaves')}. Für schwarzen Tee bei ${txt(TEA_1L, 'temperature')} reichen ${txt(TEA_1L, 'brewTime')} Ziehzeit.`,
      },
      {
        question: 'Darf Kräutertee stundenlang in der Thermoskanne stehen?',
        answer: 'Besser nicht. Kochendes Wasser tötet Keime, aber nicht unbedingt deren Sporen. Das BfR rät deshalb davon ab, aufgegossenen Tee mehrere Stunden warm stehen zu lassen, weil die Sporen dann auskeimen können. Kochen Sie lieber frisch auf.',
      },
    ],
  },

  'alkohol-verkochungs-rechner': {
    sections: [
      {
        title: 'Restalkohol nach Garzeit: Wein- und Biersaucen im Vergleich',
        content: `Gerechnet für 4 Portionen mit den USDA-Rückhaltefaktoren des Rechners. 250 ml Rotwein mit 13 % enthalten zu Beginn ${g1(BOOZE_START)} reinen Alkohol:\n\n${BOOZE_TABLE}\n\nDie USDA-Werte sind Mittelwerte aus Versuchen. Ein breiter Topf ohne Deckel verliert schneller Alkohol als ein hoher, geschlossener Schmortopf; wird der Alkohol nur kurz in kochende Flüssigkeit gegeben und der Topf vom Herd genommen, bleiben laut USDA sogar rund 85 %.`,
      },
      {
        title: 'Typische Situationen in der Küche',
        content: `- **Rumkuchen oder getränkte Tortenböden:** Wird der Alkohol nach dem Backen aufgeträufelt, bleibt er praktisch vollständig im Kuchen. Der Rechner gilt nur für Alkohol, der mitgart.\n- **Flambieren:** Die Flamme sieht spektakulär aus, entfernt aber wenig. Von 4 cl Rum mit 40 % bleiben nach dem Flambieren noch ${g1(num(BOOZE_RUM, 'remainingGrams'))} reiner Alkohol im Gericht.\n- **Zum Vergleich:** Eine 0,33-l-Flasche Bier mit 5 % enthält ${g1(BEER_BOTTLE_G)} Alkohol. Die Gramm-Zahl im Ergebnis zeigt, wie viel davon auf dem Teller landet; für Kinder, Schwangere und Menschen, die keinen Alkohol trinken, ist auch eine kleine Menge zu viel.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel Alkohol bleibt in einer Rotweinsauce nach einer Stunde?',
        answer: `Etwa ein Viertel. Aus 250 ml Rotwein (13 %) werden ${txt(BOOZE_60, 'remainingGrams').replace(' reiner Alkohol', '')} reiner Alkohol im ganzen Gericht, bei 4 Portionen ${txt(BOOZE_60, 'perPortion')}.`,
      },
      {
        question: 'Verdunstet Alkohol im Backofen schneller als im Topf?',
        answer: 'Nicht grundsätzlich. Die USDA-Daten nennen für Gebäck, das 25 Minuten gebacken wird, ohne dass der Alkohol eingerührt ist, rund 45 % verbleibenden Alkohol. Im Inneren eines Kuchens wird es zudem nicht heißer als etwa 100 °C. Ist der Alkohol gut eingerührt, gelten ähnliche Werte wie beim Köcheln.',
      },
    ],
  },
};
