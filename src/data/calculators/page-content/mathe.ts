import { PageContentMap } from './types';
import { CalculationResult, CalculatorDefinition } from '@/types/calculator';
import { formatNumber, formatPercent } from '@/lib/formatters';
import {
  calculateAverage,
  calculateGcdLcm,
  calculatePythagoras,
  calculateRuleOfThree,
} from '@/lib/calculators/mathematik';
import { calculateOhmsLaw, calculateStandardDeviation } from '@/lib/calculators/statistik';
import { MATHEMATIK_CALCULATORS } from '../mathematik';
import { EXTRA_DATUM_MATH } from '../extra/datumMath';
import { EXTRA_BUSINESS_STATISTIK } from '../extra/businessStatistik';

// ---------------------------------------------------------------------------
// Helpers: every number below is produced by the calculators' own engines at module load.
// ---------------------------------------------------------------------------
function engineOf(list: CalculatorDefinition[], slug: string): (inputs: Record<string, any>) => CalculationResult {
  const calc = list.find((c) => c.slug === slug);
  if (!calc) throw new Error(`page-content/mathe: Rechner ${slug} nicht gefunden`);
  return (inputs) => calc.calculate(inputs);
}
const sec = (r: CalculationResult, id: string) => r.secondary?.find((s) => s.id === id);
const num = (r: CalculationResult, id: string) => Number(sec(r, id)?.value ?? NaN);
const f = (v: number, digits = 2) => formatNumber(v, digits).replace('-', '−');
const minus = (text: string) => text.replace(/-(?=\d)/g, '−');
const table = (head: string[], rows: Array<Array<string | number>>) =>
  [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n');

const bruch = engineOf(MATHEMATIK_CALCULATORS, 'bruchrechner');
const kgvEngine = engineOf(MATHEMATIK_CALCULATORS, 'kgv-rechner');
const kubik = engineOf(EXTRA_DATUM_MATH, 'kubikwurzel-rechner');
const zehner = engineOf(EXTRA_DATUM_MATH, 'zehnerpotenzen-rechner');
const modulo = engineOf(EXTRA_DATUM_MATH, 'modulo-rechner');
const quersumme = engineOf(EXTRA_DATUM_MATH, 'quersumme-rechner');
const teiler = engineOf(EXTRA_DATUM_MATH, 'teiler-vielfache-rechner');
const promille = engineOf(EXTRA_DATUM_MATH, 'promillerechner');
const wuerfel = engineOf(EXTRA_BUSINESS_STATISTIK, 'wahrscheinlichkeit-wuerfel-muenze-rechner');
const perzentil = engineOf(EXTRA_BUSINESS_STATISTIK, 'perzentil-rechner');

const ggt = (a: number, b: number) => calculateGcdLcm({ num1: a, num2: b }).primary.value as number;
const kgv = (a: number, b: number) => kgvEngine({ num1: a, num2: b }).primary.value as number;

// ==================== kgV ====================
const KGV_PAIRS: Array<[number, number]> = [[4, 6], [6, 8], [6, 9], [8, 12], [9, 12], [10, 15], [12, 16], [12, 18], [14, 21], [7, 9]];
const kgvRows = KGV_PAIRS.map(([a, b]) => [`${a} und ${b}`, ggt(a, b), kgv(a, b), a * b]);
const kgv1218 = kgv(12, 18);
const multiples18: number[] = [];
for (let m = 18; multiples18.length < 10; m += 18) {
  multiples18.push(m);
  if (m % 12 === 0) break;
}
const kgv46 = kgv(4, 6);
const kgv4610 = kgv(kgv46, 10);
const kgvBus = kgv(12, 20);

// ==================== ggT ====================
const GGT_FRACTIONS: Array<[number, number]> = [[18, 24], [42, 56], [45, 75], [84, 126], [64, 96], [39, 52]];
const ggtRows = GGT_FRACTIONS.map(([z, n]) => {
  const g = ggt(z, n);
  return [`${z}/${n}`, g, `${z / g}/${n / g}`];
});
const ggt84 = calculateGcdLcm({ num1: 84, num2: 126 });
const ggt3045 = ggt(30, 45);
const ggt304575 = ggt(ggt3045, 75);
const stoffGgt = ggt(90, 150);
const ggt1545 = ggt(15, 45);

// ==================== Dreisatz ====================
const ds = (a1: number, b1: number, a2: number, type: 'direct' | 'indirect') =>
  calculateRuleOfThree({ a1, b1, a2, type }).primary.value as number;
const dsHefte = ds(3, 4.5, 7, 'direct');
const dsSprit = ds(100, 6.4, 350, 'direct');
const dsPumpen = ds(5, 12, 3, 'indirect');
const dsPumpenFalsch = ds(5, 12, 3, 'direct');
const dsPferde = ds(8, 15, 12, 'indirect');
const dsLauf = ds(1200, 15, 2000, 'direct');
const dsProzent = ds(120, 100, 18, 'direct');
const dsMaschinenStufe1 = ds(4, 480, 6, 'direct');
const dsMaschinenStufe2 = ds(6, dsMaschinenStufe1, 5, 'direct');
const taxi = (km: number) => 4 + 2.5 * km;

// ==================== Durchschnitt ====================
const avgNoten = calculateAverage({ numbers: '2; 3; 3; 4; 5' });
const avgGehalt = calculateAverage({ numbers: '2400; 2600; 2800; 3000; 12000' });
const avgGerade = calculateAverage({ numbers: '4; 8; 15; 16; 23; 42' });
const avgBisher = calculateAverage({ numbers: '2; 3; 2; 4' });
const zielSchnitt = 2.5;
const fehlendeNote = zielSchnitt * (num(avgBisher, 'count') + 1) - num(avgBisher, 'sum');
const avgProbe = calculateAverage({ numbers: `2; 3; 2; 4; ${f(fehlendeNote, 1)}` });
const harmonisch = 2 / (1 / 60 + 1 / 40);
const klassenSchnitt = (20 * 2.0 + 30 * 3.0) / 50;

// ==================== Kubikwurzel ====================
const kubikZahlen = Array.from({ length: 12 }, (_, i) => i + 1);
const KUBIK_KRUMM = [2, 3, 5, 10, 20, 50, 100, 200, 500];
const cb = (x: number) => kubik({ val: x }).primary.value as number;
const cb200 = cb(200);
const cbSumme = cb(8 + 27);

// ==================== Zehnerpotenzen ====================
const zp = (x: number) => zehner({ numberVal: x }).primary.formattedValue as string;
const lichtjahrKm = 299792.458 * 365.25 * 86400;
const ZEHNER_BEISPIELE: Array<[string, number]> = [
  ['Lichtgeschwindigkeit in m/s', 299792458],
  ['Lichtjahr in km (299.792,458 km/s × 365,25 Tage)', lichtjahrKm],
  ['Mittlere Entfernung Erde–Mond in km', 384400],
  ['0,00045 (z. B. Meter)', 0.00045],
  ['2,5 Mikrometer in Metern', 0.0000025],
];

// ==================== Modulo ====================
const mod = (a: number, b: number) => modulo({ dividend: a, divisor: b });
const modWoche = mod(100, 7);
const WOCHENTAGE = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
const modUhr = mod(22 + 15, 24);
const modMin = mod(157, 60);
const modEier = mod(1000, 6);
const modGerade = mod(2027, 2);
const modNeg = mod(-7, 3);
const modKongruent = mod(17, 12);
const modTR = mod(1234, 17);
const modKlein = mod(5, 8);

// ==================== Promille ====================
const pm = (p: number, base: number) => promille({ promille: p, baseVal: base });
const PROMILLE_STUFEN = [0.1, 0.5, 1, 2.5, 5, 10, 25];
const pmPraemie = (180 / 400000) * 1000;
const pmProbe = pm(pmPraemie, 400000);
const pmFehler = pm(5, 10000);
const pmGefaelle = pm(20, 800);

// ==================== Bruch ====================
const br = (n1: number, d1: number, op: string, n2: number, d2: number) => bruch({ num1: n1, den1: d1, op, num2: n2, den2: d2 });
const brText = (r: CalculationResult) => {
  const mixed = sec(r, 'mixed')?.formattedValue;
  const frac = (r.primary.formattedValue as string).replace(' / ', '/');
  if (frac.endsWith('/1')) return frac.slice(0, -2);
  return mixed && mixed !== frac ? `${frac} = ${mixed}` : frac;
};
const BRUCH_FEHLER: Array<[string, string, CalculationResult]> = [
  ['1/2 + 1/3', '2/5 (Zähler und Nenner einzeln addiert)', br(1, 2, '+', 1, 3)],
  ['3/4 − 1/6', '2/2 = 1', br(3, 4, '-', 1, 6)],
  ['2/3 × 3/4', '6/12 ohne Kürzen stehen gelassen', br(2, 3, '*', 3, 4)],
  ['5/6 ÷ 2/3', '10/18 (den ersten statt den zweiten Bruch umgedreht)', br(5, 6, '/', 2, 3)],
  ['7/8 − 3/4', '4/4', br(7, 8, '-', 3, 4)],
];
const brGemischt = br(7, 3, '+', 7, 4);
const brGanz = br(3, 4, '/', 2, 1);
const brVergleich = br(5, 8, '-', 3, 5);
const brVon = br(3, 5, '*', 40, 1);

// ==================== Quersumme ====================
const qs = (n: number | string) => quersumme({ num: String(n) });
const altQs = (n: number) =>
  String(n)
    .split('')
    .reverse()
    .reduce((acc, d, i) => acc + (i % 2 === 0 ? 1 : -1) * Number(d), 0);
const TEILBARKEIT: Array<[number, string, number, string]> = [
  [2, 'letzte Ziffer gerade (0, 2, 4, 6, 8)', 3578, 'endet auf 8'],
  [3, 'Quersumme durch 3 teilbar', 7452, `Quersumme ${qs(7452).primary.value}`],
  [4, 'letzte zwei Ziffern bilden eine durch 4 teilbare Zahl', 1316, '16 : 4 = 4'],
  [5, 'letzte Ziffer 0 oder 5', 845, 'endet auf 5'],
  [6, 'durch 2 und durch 3 teilbar', 4734, `gerade, Quersumme ${qs(4734).primary.value}`],
  [8, 'letzte drei Ziffern durch 8 teilbar', 25120, '120 : 8 = 15'],
  [9, 'Quersumme durch 9 teilbar', 5373, `Quersumme ${qs(5373).primary.value}`],
  [11, 'alternierende Quersumme durch 11 teilbar', 918082, `alternierend ${f(altQs(918082), 0)}`],
  [25, 'endet auf 00, 25, 50 oder 75', 3475, 'endet auf 75'],
];
for (const [d, , n] of TEILBARKEIT) {
  if (n % d !== 0) throw new Error(`page-content/mathe: Teilbarkeitsbeispiel ${n} nicht durch ${d} teilbar`);
}
const qsIter = (n: number | string) => num(qs(n), 'iter');
const neunerA = qsIter(347);
const neunerB = qsIter(28);
const neunerProdukt = 347 * 28;
const neunerErgebnis = qsIter(neunerProdukt);
const neunerProduktIter = qsIter(neunerA * neunerB);
const neunerDreher = 9761;
const qs2026 = qs(2026);
const qsKomma = qs('-12,75');

// ==================== Teiler ====================
const teilerAnzahl = (n: number) => teiler({ num: n }).primary.value as number;
const TEILER_REICH = [12, 24, 36, 48, 60, 120, 360, 720, 5040];
let maxTeiler = 0;
let maxTeilerZahlen: number[] = [];
for (let n = 1; n < 100; n++) {
  const t = teilerAnzahl(n);
  if (t > maxTeiler) {
    maxTeiler = t;
    maxTeilerZahlen = [n];
  } else if (t === maxTeiler) {
    maxTeilerZahlen.push(n);
  }
}
const teiler60 = teiler({ num: 60 });
const teiler1 = teilerAnzahl(1);

// ==================== Pythagoras ====================
const hyp = (a: number, b: number) => calculatePythagoras({ target: 'c', sideA: a, sideB: b }).primary.value as number;
const kat = (c: number, b: number) => calculatePythagoras({ target: 'a', sideB: b, sideC: c }).primary.value as number;
const leiterHoehe = kat(4, 1);
const tvDiagEinheiten = hyp(16, 9);
const tvDiagCm = 55 * 2.54;
const tvBreite = (tvDiagCm * 16) / tvDiagEinheiten;
const tvHoehe = (tvDiagCm * 9) / tvDiagEinheiten;
const sparren = hyp(4.5, 2.8);
const zollstock = hyp(60, 80);
const schrankDiag = hyp(2.1, 0.6);
const quadratDiag = hyp(10, 10);
const pyFalsch = 3 + 4;
const pyKatheteFalsch = Math.sqrt(4 * 4 + 1 * 1);

// ==================== Perzentil ====================
const PZ_DATA = [10, 25, 40, 55, 70, 85];
const pzInputs = (p: number, data = PZ_DATA) => ({ pRank: p, d1: data[0], d2: data[1], d3: data[2], d4: data[3], d5: data[4], d6: data[5] });
const pzEngine = (p: number, data = PZ_DATA) => perzentil(pzInputs(p, data)).primary.value as number;
const pzExkl = (p: number): number | null => {
  const n = PZ_DATA.length;
  const rank = (p / 100) * (n + 1);
  if (rank < 1 || rank > n) return null;
  const lo = Math.floor(rank);
  if (lo >= n) return PZ_DATA[n - 1];
  return PZ_DATA[lo - 1] + (rank - lo) * (PZ_DATA[lo] - PZ_DATA[lo - 1]);
};
const pzRang = (p: number) => PZ_DATA[Math.ceil((p / 100) * PZ_DATA.length) - 1];
const pzRows = [25, 50, 75, 90].map((p) => {
  const ex = pzExkl(p);
  return [`P${p}`, f(pzEngine(p)), ex === null ? 'nicht definiert (#ZAHL!)' : f(ex), f(pzRang(p))];
});
const pzIqr = pzEngine(75) - pzEngine(25);
const pzAusreisser = pzEngine(90, [10, 25, 40, 55, 70, 185]);

// ==================== Standardabweichung ====================
const SD_INPUT = '12; 15; 18; 11; 19; 14; 16';
const sdRes = calculateStandardDeviation({ values: SD_INPUT });
const sdVals = SD_INPUT.split(';').map((s) => Number(s.trim())).sort((a, b) => a - b);
const sdMean = num(sdRes, 'mean');
const sdS = sdRes.primary.value as number;
const sdVarS = num(sdRes, 'sampleVar');
const sdSigma = num(sdRes, 'popSd');
const sdSumSq = sdVals.reduce((acc, x) => acc + (x - sdMean) ** 2, 0);
const sdRows = sdVals.map((x) => [f(x, 0), f(x - sdMean), f((x - sdMean) ** 2)]);
const sdInnerhalb = sdVals.filter((x) => x >= sdMean - sdS && x <= sdMean + sdS).length;
const sdKonstant = calculateStandardDeviation({ values: '5; 5; 5; 5' }).primary.value as number;

// ==================== Würfel & Münze ====================
const augensummen: Array<[number, number]> = [];
for (let s = 2; s <= 12; s++) {
  let count = 0;
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === s) count++;
  augensummen.push([s, count]);
}
const wRows = [1, 2, 3, 4, 5, 6, 8, 10].map((n) => {
  const r = wuerfel({ diceCount: n });
  const keine = r.details?.find((d) => d.label.startsWith('Gegenwahrscheinlichkeit'));
  const kopf = r.details?.find((d) => d.label.startsWith('Münzwurf'));
  return [n, r.primary.formattedValue as string, keine?.formattedValue as string, kopf?.formattedValue as string];
});
const pasch = (6 / 36) * 100;
const kniffel = (6 / 6 ** 5) * 100;
let wuerfeFuer90 = 1;
while (1 - (5 / 6) ** wuerfeFuer90 < 0.9) wuerfeFuer90++;
const pVor90 = (1 - (5 / 6) ** (wuerfeFuer90 - 1)) * 100;
const pBei90 = (1 - (5 / 6) ** wuerfeFuer90) * 100;
const p4Wuerfe = wuerfel({ diceCount: 4 }).primary.value as number;

// ==================== Ohmsches Gesetz ====================
const OHM_LEISTUNGEN = [100, 500, 1000, 2300, 3680];
const ohmRows = OHM_LEISTUNGEN.map((p) => {
  const i = p / 230;
  const r = calculateOhmsLaw({ target: 'resistance', voltage: 230, current: i });
  return [`${f(p, 0)} W`, `${f(i)} A`, `${f(r.primary.value as number, 1)} Ω`, `${f(num(r, 'power'), 0)} W`];
});
const ledRot = calculateOhmsLaw({ target: 'resistance', voltage: 5 - 2, current: 0.02 });
const ledWeiss = calculateOhmsLaw({ target: 'resistance', voltage: 12 - 3, current: 0.02 });
const ledWeiss470 = calculateOhmsLaw({ target: 'current', voltage: 12 - 3, resistance: 470 });
const sicherung = calculateOhmsLaw({ target: 'resistance', voltage: 230, current: 16 });
const halbeSpannung = calculateOhmsLaw({ target: 'current', voltage: 115, resistance: 46 });
const volleSpannung = calculateOhmsLaw({ target: 'current', voltage: 230, resistance: 46 });

export const MATHE_PAGE_CONTENT: PageContentMap = {
  'kgv-rechner': {
    sections: [
      {
        title: 'kgV-Tabelle für häufige Nennerpaare',
        content: `Diese Nennerpaare tauchen beim Gleichnamigmachen von Brüchen besonders oft auf:\n\n${table(['Zahlen', 'ggT', 'kgV', 'Produkt a · b'], kgvRows)}\n\nNur bei teilerfremden Zahlen wie 7 und 9 ist das Produkt schon das kgV. Sonst ist das Produkt genau um den Faktor ggT zu groß und als Hauptnenner unnötig unhandlich.`,
      },
      {
        title: 'kgV ohne Rechner: die Vielfachenliste der größeren Zahl',
        content: `Für kleine Zahlen ist dieser Weg in Klassenarbeiten am schnellsten, hier für 12 und 18:\n\n- Schreiben Sie die Vielfachen der **größeren** Zahl auf: ${multiples18.join(', ')} …\n- Prüfen Sie jedes Vielfache, ob es durch die kleinere Zahl teilbar ist. 18 : 12 geht nicht auf, ${kgv1218} : 12 = ${kgv1218 / 12}.\n- Das erste passende Vielfache ist das kgV: **${kgv1218}**.\n\nEin häufiger Fehler ist das Verwechseln mit dem ggT. Merkhilfe: Das kgV ist nie kleiner als die größere Zahl, der ggT nie größer als die kleinere.`,
      },
    ],
    faqs: [
      {
        question: 'Wie berechnet man das kgV von drei Zahlen?',
        answer: `Schrittweise: Erst das kgV der ersten beiden Zahlen bilden, dann davon und der dritten Zahl. Für 4, 6 und 10 gilt kgV(4, 6) = ${kgv46} und kgV(${kgv46}, 10) = ${kgv4610}. Probe: ${kgv4610} : 4 = ${kgv4610 / 4}, ${kgv4610} : 6 = ${kgv4610 / 6} und ${kgv4610} : 10 = ${kgv4610 / 10}.`,
      },
      {
        question: 'Was ist das kgV, wenn eine Zahl ein Vielfaches der anderen ist?',
        answer: `Dann ist die größere Zahl selbst das kgV. Für 6 und 18 ergibt der Rechner ${kgv(6, 18)}, denn 18 ist bereits durch 6 teilbar.`,
      },
      {
        question: 'Wann fahren zwei Busse mit unterschiedlichem Takt wieder gleichzeitig ab?',
        answer: `Nach dem kgV der beiden Taktzeiten. Fährt Linie A alle 12 Minuten und Linie B alle 20 Minuten, starten beide nach kgV(12, 20) = ${kgvBus} Minuten wieder zur selben Zeit, bei gemeinsamem Start um 8:00 Uhr also um 9:00 Uhr.`,
      },
    ],
  },

  'ggt-rechner': {
    sections: [
      {
        title: 'Brüche mit dem ggT in einem Schritt kürzen',
        content: `Wer Zähler und Nenner durch ihren ggT teilt, erhält sofort den vollständig gekürzten Bruch:\n\n${table(['Bruch', 'ggT', 'vollständig gekürzt'], ggtRows)}\n\nBei 64/96 müsste man fünfmal hintereinander durch 2 kürzen. Mit dem ggT ${ggt(64, 96)} reicht ein einziger Schritt.`,
      },
      {
        title: 'Rechenweg über Primfaktoren am Beispiel 84 und 126',
        content: `- Zerlegen: 84 = 2 · 2 · 3 · 7 und 126 = 2 · 3 · 3 · 7.\n- Gemeinsame Faktoren markieren, jeden nur so oft, wie er in **beiden** Zahlen vorkommt: 2, 3 und 7.\n- Multiplizieren: 2 · 3 · 7 = **${ggt84.primary.value}**.\n\nProbe: 84 : ${ggt84.primary.value} = ${sec(ggt84, 'divA')?.value} und 126 : ${ggt84.primary.value} = ${sec(ggt84, 'divB')?.value}. Weil ${sec(ggt84, 'divA')?.value} und ${sec(ggt84, 'divB')?.value} keinen gemeinsamen Teiler mehr haben, war es tatsächlich der größte. Bleibt nach der Division noch ein gemeinsamer Teiler übrig, wurde ein Faktor übersehen.`,
      },
    ],
    faqs: [
      {
        question: 'Wie bestimmt man den ggT von drei Zahlen?',
        answer: `Man rechnet paarweise weiter: ggT(30, 45) = ${ggt3045}, danach ggT(${ggt3045}, 75) = ${ggt304575}. Der ggT von 30, 45 und 75 ist also ${ggt304575}.`,
      },
      {
        question: 'In welche größten Quadrate lässt sich ein Rechteck ohne Rest aufteilen?',
        answer: `Die Seitenlänge ist der ggT der beiden Rechteckseiten. Ein Stoffstück von 90 cm × 150 cm lässt sich in Quadrate mit ${stoffGgt} cm Kantenlänge zerschneiden, das ergibt ${90 / stoffGgt} × ${150 / stoffGgt} = ${(90 / stoffGgt) * (150 / stoffGgt)} Stück ohne Verschnitt.`,
      },
      {
        question: 'Kann der ggT größer sein als die kleinere der beiden Zahlen?',
        answer: `Nein. Höchstens ist er gleich der kleineren Zahl, nämlich dann, wenn sie die größere teilt: ggT(15, 45) = ${ggt1545}.`,
      },
    ],
  },

  dreisatzrechner: {
    sections: [
      {
        title: 'Typische Dreisatzaufgaben mit Lösung',
        content: `${table(['Aufgabe', 'Zuordnung', 'Rechnung', 'Ergebnis'], [
          ['3 Hefte kosten 4,50 €. Was kosten 7 Hefte?', 'proportional', '4,50 € : 3 · 7', `${formatNumber(dsHefte, 2, 2)} €`],
          ['6,4 l Benzin auf 100 km. Wie viel auf 350 km?', 'proportional', '6,4 l : 100 · 350', `${f(dsSprit, 1)} l`],
          ['5 Pumpen leeren ein Becken in 12 h. Wie lange brauchen 3 Pumpen?', 'antiproportional', '5 · 12 h : 3', `${f(dsPumpen, 0)} h`],
          ['Futter reicht 8 Pferden 15 Tage. Wie lange reicht es 12 Pferden?', 'antiproportional', '8 · 15 : 12', `${f(dsPferde, 0)} Tage`],
          ['1.200 m in 15 Minuten. Wie lange für 2.000 m im selben Tempo?', 'proportional', '15 min : 1.200 · 2.000', `${f(dsLauf, 0)} min`],
        ])}`,
      },
      {
        title: 'Fehler erkennen, bevor man rechnet',
        content: `- **Einheiten angleichen:** Steht eine Zeit in Minuten und die andere in Stunden, zuerst umrechnen.\n- **Plausibilität prüfen:** Weniger Pumpen brauchen länger. Wer die Pumpenaufgabe proportional rechnet, erhält ${f(dsPumpenFalsch, 1)} h, also weniger Zeit mit weniger Pumpen. Das kann nicht stimmen.\n- **Grundgebühren beachten:** Kostet ein Taxi 4 € Grundgebühr plus 2,50 € je km, zahlt man für 10 km ${f(taxi(10))} €, für 20 km aber ${f(taxi(20))} € und nicht ${f(taxi(10) * 2)} €. Bei einem festen Sockelbetrag ist die Zuordnung nicht proportional, der Dreisatz liefert dann falsche Werte.`,
      },
    ],
    faqs: [
      {
        question: 'Wie löst man Prozentaufgaben mit dem Dreisatz?',
        answer: `Setzen Sie den Grundwert gleich 100 %. Beispiel: 120 € entsprechen 100 %, wie viel Prozent sind 18 €? Im Rechner A = 120, B = 100, neue Größe A = 18, proportional. Ergebnis: ${f(dsProzent)} %.`,
      },
      {
        question: 'Was ist ein zusammengesetzter (doppelter) Dreisatz?',
        answer: `Eine Aufgabe mit zwei veränderten Größen, die man nacheinander in zwei Dreisätzen löst. 4 Maschinen fertigen in 6 Stunden 480 Teile. Wie viele schaffen 6 Maschinen in 5 Stunden? Schritt 1 (Maschinen): 480 : 4 · 6 = ${f(dsMaschinenStufe1, 0)} Teile in 6 h. Schritt 2 (Zeit): ${f(dsMaschinenStufe1, 0)} : 6 · 5 = ${f(dsMaschinenStufe2, 0)} Teile.`,
      },
    ],
    workedExamples: [
      {
        title: 'Beispiel antiproportional: 5 Pumpen brauchen 12 Stunden, wie lange brauchen 3?',
        description: `Das Produkt 5 · 12 = 60 Pumpenstunden bleibt gleich. 60 : 3 = ${f(dsPumpen, 0)} Stunden.`,
        inputs: { a1: 5, b1: 12, a2: 3, type: 'indirect' },
        resultSummary: `${f(dsPumpen)} Stunden`,
      },
    ],
  },

  durchschnittsrechner: {
    sections: [
      {
        title: 'Mittelwert und Median an drei Zahlenreihen',
        content: `${table(['Zahlenreihe', 'Mittelwert', 'Median', 'Spannweite'], [
          ['Noten einer Arbeit: 2; 3; 3; 4; 5', avgNoten.primary.formattedValue as string, f(num(avgNoten, 'median')), f(num(avgNoten, 'span'))],
          ['Monatsgehälter in €: 2.400; 2.600; 2.800; 3.000; 12.000', `${f(avgGehalt.primary.value as number, 0)} €`, `${f(num(avgGehalt, 'median'), 0)} €`, `${f(num(avgGehalt, 'span'), 0)} €`],
          ['Sechs Messwerte: 4; 8; 15; 16; 23; 42', avgGerade.primary.formattedValue as string, f(num(avgGerade, 'median')), f(num(avgGerade, 'span'))],
        ])}\n\nIm Gehaltsbeispiel hebt ein einziges hohes Gehalt den Durchschnitt auf ${f(avgGehalt.primary.value as number, 0)} €, obwohl vier von fünf Personen höchstens 3.000 € verdienen. Bei einer geraden Anzahl von Werten ist der Median der Mittelwert der beiden mittleren Werte, hier von 15 und 16.`,
      },
      {
        title: 'Welche Note brauche ich noch? Den Zielschnitt rückwärts rechnen',
        content: `Bisher stehen die Noten 2, 3, 2 und 4 fest (Summe ${f(num(avgBisher, 'sum'))}). Nach der fünften Arbeit soll der Schnitt ${f(zielSchnitt, 1)} betragen:\n\n- Benötigte Gesamtsumme: ${f(zielSchnitt, 1)} · 5 = ${f(zielSchnitt * 5, 1)}\n- Fehlende Note: ${f(zielSchnitt * 5, 1)} − ${f(num(avgBisher, 'sum'))} = **${f(fehlendeNote, 1)}**\n- Probe im Rechner mit 2; 3; 2; 4; ${f(fehlendeNote, 1)} ergibt ${avgProbe.primary.formattedValue}.\n\nKommt bei dieser Rechnung ein Wert besser als 1 heraus, ist der Zielschnitt mit einer Arbeit nicht mehr erreichbar.`,
      },
    ],
    faqs: [
      {
        question: 'Ist der Durchschnitt immer das arithmetische Mittel?',
        answer: `Im Alltag ja, bei Geschwindigkeiten aber nicht. Fahren Sie hin mit 60 km/h und dieselbe Strecke zurück mit 40 km/h, beträgt die Durchschnittsgeschwindigkeit ${f(harmonisch, 0)} km/h und nicht 50 km/h, weil Sie länger mit dem langsameren Tempo unterwegs sind (harmonisches Mittel).`,
      },
      {
        question: 'Wie berechnet man den Gesamtdurchschnitt aus zwei Klassendurchschnitten?',
        answer: `Jeden Schnitt mit der Schülerzahl gewichten. Klasse A hat 20 Schüler mit Schnitt 2,0, Klasse B 30 Schüler mit Schnitt 3,0: (20 · 2,0 + 30 · 3,0) : 50 = ${f(klassenSchnitt, 1)}. Der einfache Mittelwert 2,5 wäre falsch, weil Klasse B mehr Schüler hat.`,
      },
    ],
  },

  'kubikwurzel-rechner': {
    sections: [
      {
        title: 'Kubikzahlen von 1 bis 12 und Kubikwurzeln krummer Zahlen',
        content: `Die Kubikzahlen sollte man für Klassenarbeiten auswendig kennen, denn ihre Kubikwurzeln gehen glatt auf:\n\n${table(['n', 'n³'], kubikZahlen.map((n) => [n, f(n ** 3, 0)]))}\n\nAlle anderen Zahlen haben eine Kubikwurzel mit unendlich vielen Nachkommastellen:\n\n${table(['x', '³√x (gerundet)'], KUBIK_KRUMM.map((x) => [f(x, 0), f(cb(x), 4)]))}`,
      },
      {
        title: 'Kubikwurzeln schätzen und typische Fehler',
        content: `Für ³√200 suchen Sie die benachbarten Kubikzahlen: 5³ = 125 und 6³ = 216. Das Ergebnis liegt also zwischen 5 und 6, deutlich näher an 6; der Rechner liefert ${f(cb200, 3)}. Ein würfelförmiger Behälter mit 200 Litern (200 dm³) hat damit eine Innenkante von rund ${f(cb200 * 10, 1)} cm.\n\n- Die Kubikwurzel einer Summe ist nicht die Summe der Kubikwurzeln: ³√(8 + 27) = ${f(cbSumme, 3)}, aber ³√8 + ³√27 = 5.\n- Die dritte Wurzel ist nicht ein Drittel der Zahl: ³√27 = 3, 27 : 3 dagegen 9.`,
      },
    ],
    faqs: [
      {
        question: 'Um wie viel wächst die Kantenlänge, wenn sich das Würfelvolumen verdoppelt?',
        answer: `Um den Faktor ³√2 ≈ ${f(cb(2), 4)}, also um gut ${f((cb(2) - 1) * 100, 0)} %. Erst bei achtfachem Volumen verdoppelt sich die Kante, weil ³√8 = 2.`,
      },
      {
        question: 'Wie berechnet man die Kubikwurzel in Excel?',
        answer: 'Mit =A1^(1/3) oder =POTENZ(A1;1/3). Für negative Zahlen liefert Excel damit die Fehlermeldung #ZAHL!. Abhilfe schafft =VORZEICHEN(A1)*ABS(A1)^(1/3), das ergibt für −8 korrekt −2.',
      },
      {
        question: 'Warum ist die Kubikwurzel aus 0,001 größer als die Zahl selbst?',
        answer: `Bei Zahlen zwischen 0 und 1 vergrößert das Wurzelziehen den Wert: ³√0,001 = ${f(cb(0.001), 4)} und ³√0,125 = ${f(cb(0.125), 4)}. Umgekehrt wird 0,1 durch das Hoch-drei-Nehmen kleiner (0,1³ = 0,001).`,
      },
    ],
  },

  'zehnerpotenzen-rechner': {
    sections: [
      {
        title: 'Zehnerpotenzen, Vorsätze und Zahlwörter von Piko bis Tera',
        content: `${table(['Zehnerpotenz', 'Dezimalzahl', 'Vorsatz (Zeichen)', 'Zahlwort'], [
          ['10¹²', '1.000.000.000.000', 'Tera (T)', 'Billion'],
          ['10⁹', '1.000.000.000', 'Giga (G)', 'Milliarde'],
          ['10⁶', '1.000.000', 'Mega (M)', 'Million'],
          ['10³', '1.000', 'Kilo (k)', 'Tausend'],
          ['10²', '100', 'Hekto (h)', 'Hundert'],
          ['10¹', '10', 'Deka (da)', 'Zehn'],
          ['10⁰', '1', '–', 'Eins'],
          ['10⁻¹', '0,1', 'Dezi (d)', 'Zehntel'],
          ['10⁻²', '0,01', 'Zenti (c)', 'Hundertstel'],
          ['10⁻³', '0,001', 'Milli (m)', 'Tausendstel'],
          ['10⁻⁶', '0,000001', 'Mikro (µ)', 'Millionstel'],
          ['10⁻⁹', '0,000000001', 'Nano (n)', 'Milliardstel'],
          ['10⁻¹²', '0,000000000001', 'Piko (p)', 'Billionstel'],
        ])}\n\nVorsicht bei englischen Texten: „billion“ ist die deutsche Milliarde (10⁹), „trillion“ die deutsche Billion (10¹²).`,
      },
      {
        title: 'Beispiele in wissenschaftlicher Schreibweise',
        content: `So gibt der Rechner bekannte Größen aus:\n\n${table(['Größe', 'Zahl', 'Notation'], ZEHNER_BEISPIELE.map(([label, x]) => [label, f(x, x < 1 ? 7 : 1), minus(zp(x))]))}\n\nVor dem Komma der Mantisse steht immer genau eine Ziffer von 1 bis 9. Schreibweisen wie 45 · 10³ sind zwar rechnerisch richtig, aber nicht normiert; korrekt ist 4,5 · 10⁴. Ein negativer Exponent macht die Zahl klein, nicht negativ.`,
      },
    ],
    faqs: [
      {
        question: 'Warum ist 10 hoch 0 gleich 1?',
        answer: 'Beim Teilen von Zehnerpotenzen werden die Exponenten subtrahiert: 10³ : 10³ = 10³⁻³ = 10⁰. Gleichzeitig ist 1.000 : 1.000 = 1. Also muss 10⁰ = 1 sein. Nach derselben Regel ist 10⁻¹ = 1 : 10 = 0,1.',
      },
      {
        question: 'Wie viele Nullen haben Million, Milliarde und Billion?',
        answer: 'Eine Million hat 6 Nullen (10⁶), eine Milliarde 9 (10⁹), eine Billion 12 (10¹²) und eine Billiarde 15 (10¹⁵). Im Deutschen wechseln sich die Endungen -illion und -illiarde in Dreierschritten ab.',
      },
      {
        question: 'Wie schreibt man 3,2 · 10⁻⁴ als normale Dezimalzahl?',
        answer: `Verschieben Sie das Komma um 4 Stellen nach links und füllen Sie mit Nullen auf: 0,00032. Umgekehrt gibt der Rechner für 0,00032 die Notation ${minus(zp(0.00032))} aus.`,
      },
    ],
  },

  'modulo-rechner': {
    sections: [
      {
        title: 'Modulo-Aufgaben aus dem Alltag',
        content: `${table(['Frage', 'Rechnung', 'Ergebnis'], [
          ['Heute ist Montag. Welcher Wochentag ist in 100 Tagen?', `100 mod 7 = ${modWoche.primary.value}`, WOCHENTAGE[modWoche.primary.value as number]],
          ['Es ist 22 Uhr. Wie spät ist es in 15 Stunden?', `37 mod 24 = ${modUhr.primary.value}`, `${modUhr.primary.value} Uhr`],
          ['Wie viele Stunden und Minuten sind 157 Minuten?', `157 mod 60 = ${modMin.primary.value}, Quotient ${num(modMin, 'quotient')}`, `${num(modMin, 'quotient')} h ${modMin.primary.value} min`],
          ['1.000 Eier in 6er-Kartons: wie viele bleiben übrig?', `1000 mod 6 = ${modEier.primary.value}`, `${num(modEier, 'quotient')} volle Kartons, ${modEier.primary.value} Eier übrig`],
          ['Ist 2.027 gerade oder ungerade?', `2027 mod 2 = ${modGerade.primary.value}`, modGerade.primary.value === 0 ? 'gerade' : 'ungerade'],
        ])}`,
      },
      {
        title: 'Negative Zahlen: warum −7 mod 3 hier 2 ergibt',
        content: `Der Rechner folgt der mathematischen Konvention, dass der Rest nie negativ ist (0 ≤ r < b). Für −7 und 3 ergibt sich die Zerlegung ${minus(String(sec(modNeg, 'decomp')?.formattedValue))}, also Rest **${modNeg.primary.value}**.\n\nProgrammiersprachen rechnen hier unterschiedlich: In JavaScript, Java und C liefert -7 % 3 den Wert −1, weil dort zur Null hin gerundet wird. Python (-7 % 3) und Excel (=REST(-7;3)) geben wie dieser Rechner 2 aus. Wer Code prüft, sollte deshalb wissen, welche Variante die Sprache verwendet.`,
      },
    ],
    faqs: [
      {
        question: 'Was bedeutet „kongruent modulo“?',
        answer: `Zwei Zahlen sind kongruent modulo b, wenn sie bei Division durch b denselben Rest lassen. 17 mod 12 = ${modKongruent.primary.value}, also gilt 17 ≡ 5 (mod 12). Auf einer 12-Stunden-Uhr zeigt 17 Uhr deshalb dasselbe wie 5 Uhr.`,
      },
      {
        question: 'Wie rechnet man Modulo mit einem Taschenrechner ohne Mod-Taste?',
        answer: `Teilen, Nachkommastellen abschneiden, zurückmultiplizieren und abziehen. Für 1234 mod 17: 1234 : 17 = 72,58…, also ${num(modTR, 'quotient')}. ${num(modTR, 'quotient')} · 17 = ${num(modTR, 'quotient') * 17}, und 1234 − ${num(modTR, 'quotient') * 17} = ${modTR.primary.value}.`,
      },
      {
        question: 'Was ergibt a mod b, wenn a kleiner als b ist?',
        answer: `Dann ist der Rest die Zahl a selbst, weil b gar nicht hineinpasst: 5 mod 8 = ${modKlein.primary.value} bei einem Quotienten von ${num(modKlein, 'quotient')}.`,
      },
    ],
    workedExamples: [
      {
        title: 'Beispiel mit negativer Zahl: −7 mod 3',
        description: `${minus(String(sec(modNeg, 'decomp')?.formattedValue))}. Der Rest ist ${modNeg.primary.value}, nicht −1.`,
        inputs: { dividend: -7, divisor: 3 },
        resultSummary: `${modNeg.primary.value} (Quotient ${f(num(modNeg, 'quotient'), 0)})`,
      },
    ],
  },

  promillerechner: {
    sections: [
      {
        title: 'Umrechnungstabelle Promille, Prozent und Dezimalzahl',
        content: `Die rechte Spalte zeigt den Anteil an einem Grundwert von 250.000 €, etwa einer Versicherungs- oder Kaufsumme.\n\n${table(['Promille', 'Prozent', 'Dezimalfaktor', 'von 250.000 €'], PROMILLE_STUFEN.map((p) => {
          const r = pm(p, 250000);
          return [`${f(p, 1)} ‰`, sec(r, 'inPct')?.formattedValue as string, f(num(r, 'decimal'), 4), `${f(r.primary.value as number)} €`];
        }))}`,
      },
      {
        title: 'Promillesatz aus Betrag und Grundwert zurückrechnen',
        content: `Kennen Sie nur den Betrag und den Grundwert, teilen Sie beide und multiplizieren mit 1.000. Beispiel: Ein Jahresbeitrag von 180 € bei einer Versicherungssumme von 400.000 € entspricht 180 : 400.000 · 1.000 = **${f(pmPraemie)} ‰**. Die Probe im Rechner mit ${f(pmPraemie)} ‰ von 400.000 ergibt wieder ${f(pmProbe.primary.value as number)} €.\n\nDer häufigste Fehler ist ein vertauschtes Zeichen: 5 % von 10.000 € sind 500 €, 5 ‰ nur ${f(pmFehler.primary.value as number, 0)} €. Wer ‰ und % verwechselt, liegt immer genau um den Faktor 10 daneben.`,
      },
    ],
    faqs: [
      {
        question: 'Wie rechnet man Prozent in Promille um?',
        answer: 'Mit 10 multiplizieren: 2,5 % = 25 ‰ und 0,3 % = 3 ‰. In die Gegenrichtung teilen Sie durch 10, etwa 0,8 ‰ = 0,08 %.',
      },
      {
        question: 'Was bedeutet ein Gefälle von 20 Promille?',
        answer: `20 ‰ heißt 20 mm Höhenunterschied je Meter Länge, also 2 %. Auf 8 Meter (800 cm) ergibt das ${f(pmGefaelle.primary.value as number, 0)} cm Gefälle.`,
      },
      {
        question: 'Wie hängen Promille und ppm zusammen?',
        answer: 'ppm (parts per million) ist ein Millionstel, Promille ein Tausendstel. Daher gilt 1 ‰ = 1.000 ppm und 1 ppm = 0,001 ‰. Kleine Konzentrationen in Wasser oder Luft werden deshalb meist in ppm statt in Promille angegeben.',
      },
    ],
  },

  bruchrechner: {
    sections: [
      {
        title: 'Häufige Fehler beim Bruchrechnen und die richtige Lösung',
        content: `${table(['Aufgabe', 'Typischer Fehler', 'Richtig (Ergebnis des Rechners)'], BRUCH_FEHLER.map(([aufgabe, falsch, r]) => [aufgabe, falsch, brText(r)]))}\n\nDer Grundfehler in den ersten beiden Zeilen ist immer derselbe: Zähler und Nenner werden einzeln verrechnet, obwohl beim Plus- und Minusrechnen nur gleichnamige Brüche zusammengefasst werden dürfen.`,
      },
      {
        title: 'Gemischte Zahlen und ganze Zahlen eingeben',
        content: `Der Rechner arbeitet mit Zähler und Nenner. Gemischte Zahlen wandeln Sie vorher um: Ganze mal Nenner plus Zähler. Aus 2 1/3 wird (2 · 3 + 1)/3 = 7/3, aus 1 3/4 wird 7/4. Die Aufgabe 2 1/3 + 1 3/4 geben Sie also als 7/3 + 7/4 ein und erhalten ${brText(brGemischt)}.\n\nGanze Zahlen schreiben Sie mit Nenner 1 (3 = 3/1). Negative Brüche entstehen, indem Sie das Minuszeichen in den Zähler setzen.`,
      },
    ],
    faqs: [
      {
        question: 'Wie teilt man einen Bruch durch eine ganze Zahl?',
        answer: `Die ganze Zahl als Bruch mit Nenner 1 schreiben und mit dem Kehrwert multiplizieren: 3/4 ÷ 2 = 3/4 × 1/2 = ${brText(brGanz)}. Man kann auch einfach den Nenner mit der Zahl multiplizieren.`,
      },
      {
        question: 'Wie findet man heraus, welcher von zwei Brüchen größer ist?',
        answer: `Ziehen Sie die Brüche voneinander ab. 5/8 − 3/5 ergibt ${brText(brVergleich)}, ein positives Ergebnis, also ist 5/8 größer. Alternativ beide auf den Hauptnenner 40 bringen: 25/40 gegen 24/40.`,
      },
      {
        question: 'Wie berechnet man einen Bruchteil von einer Zahl, etwa 3/5 von 40?',
        answer: `Der Bruch wird mit der Zahl multipliziert: 3/5 × 40/1 = ${brText(brVon)}. Kurz gerechnet: 40 : 5 = 8, dann 8 · 3 = 24.`,
      },
    ],
  },

  'quersumme-rechner': {
    sections: [
      {
        title: 'Teilbarkeitsregeln mit Beispielen',
        content: `${table(['Teiler', 'Regel', 'Beispiel', 'Prüfung'], TEILBARKEIT.map(([d, regel, n, pruefung]) => [d, regel, f(n, 0), pruefung]))}\n\nDie alternierende Quersumme bildet man von rechts: Bei 918.082 rechnet man 2 − 8 + 0 − 8 + 1 − 9 = ${f(altQs(918082), 0)}, und −22 ist durch 11 teilbar. Für 7 gibt es keine vergleichbar einfache Regel, dort ist schriftliches Teilen meist schneller.`,
      },
      {
        title: 'Neunerprobe: Multiplikationen mit der Quersumme kontrollieren',
        content: `Prüfen wir 347 · 28 = ${f(neunerProdukt, 0)}:\n\n- Einstellige Quersumme von 347: ${neunerA}, von 28: ${neunerB}.\n- Diese multiplizieren: ${neunerA} · ${neunerB} = ${neunerA * neunerB}, einstellig ${neunerProduktIter}.\n- Einstellige Quersumme des Ergebnisses ${f(neunerProdukt, 0)}: ${neunerErgebnis}. Beide Werte stimmen überein, die Probe ist bestanden.\n\nDie Neunerprobe hat eine Lücke: Ein Zahlendreher fällt nicht auf. Auch das falsche Ergebnis ${f(neunerDreher, 0)} liefert die einstellige Quersumme ${qsIter(neunerDreher)} und würde die Probe bestehen.`,
      },
    ],
    faqs: [
      {
        question: 'Welche Quersumme hat die Jahreszahl 2026?',
        answer: `2 + 0 + 2 + 6 = ${qs2026.primary.value}, einstellig ${num(qs2026, 'iter')}. Da ${qs2026.primary.value} nicht durch 3 teilbar ist, ist auch 2026 weder durch 3 noch durch 9 teilbar.`,
      },
      {
        question: 'Ändert sich die Quersumme, wenn man die Ziffern vertauscht?',
        answer: `Nein. 7452 und 2547 haben beide die Quersumme ${qs(2547).primary.value}, deshalb sind beide durch 9 teilbar. Genau darum kann die Neunerprobe vertauschte Ziffern nicht erkennen.`,
      },
      {
        question: 'Was macht der Rechner mit Komma oder Minuszeichen?',
        answer: `Er wertet nur die Ziffern aus und ignoriert alle anderen Zeichen. Für −12,75 rechnet er 1 + 2 + 7 + 5 = ${qsKomma.primary.value}. Für Teilbarkeitsregeln sind ohnehin nur ganze Zahlen sinnvoll.`,
      },
    ],
  },

  'teiler-vielfache-rechner': {
    sections: [
      {
        title: 'Zahlen mit besonders vielen Teilern',
        content: `${table(['Zahl', 'Anzahl der Teiler'], TEILER_REICH.map((n) => [f(n, 0), teilerAnzahl(n)]))}\n\nZahlen wie 60 und 360 lassen sich gleichmäßig in sehr viele Teile zerlegen. Eine Stunde mit 60 Minuten teilt sich ganzzahlig in Hälften, Drittel, Viertel, Fünftel, Sechstel, Zehntel, Zwölftel, Fünfzehntel, Zwanzigstel und Dreißigstel.`,
      },
      {
        title: 'Die Teileranzahl aus der Primfaktorzerlegung ablesen',
        content: `Schreiben Sie die Zahl als Produkt von Primzahlpotenzen, erhöhen Sie jeden Exponenten um 1 und multiplizieren Sie:\n\n- 360 = 2³ · 3² · 5¹ → (3 + 1) · (2 + 1) · (1 + 1) = 24 Teiler, der Rechner zählt ${teilerAnzahl(360)}.\n- 72 = 2³ · 3² → 4 · 3 = 12 Teiler, der Rechner zählt ${teilerAnzahl(72)}.\n- 36 = 2² · 3² → 3 · 3 = 9 Teiler, der Rechner zählt ${teilerAnzahl(36)}.\n\nAn der 36 sieht man eine Besonderheit: Nur Quadratzahlen haben eine ungerade Teileranzahl, weil bei ihnen ein Teilerpaar aus zwei gleichen Zahlen besteht (6 · 6).`,
      },
    ],
    faqs: [
      {
        question: 'Was ist der Unterschied zwischen Teilern und Vielfachen?',
        answer: 'Teiler sind die Zahlen, durch die man eine Zahl ohne Rest teilen kann, Vielfache entstehen durch Multiplizieren. Die Zahl 6 hat genau vier Teiler (1, 2, 3, 6), aber unendlich viele Vielfache (6, 12, 18, 24 …). Jede Zahl ist zugleich ihr eigener größter Teiler und ihr kleinstes positives Vielfaches.',
      },
      {
        question: 'Ist 1 eine Primzahl?',
        answer: `Nein. Eine Primzahl hat genau zwei verschiedene Teiler, die 1 und sich selbst. Die 1 hat nur ${teiler1} Teiler, deshalb zählt sie nicht dazu. Die kleinste Primzahl ist 2.`,
      },
      {
        question: 'Welche Zahlen unter 100 haben die meisten Teiler?',
        answer: `${maxTeilerZahlen.slice(0, -1).join(', ')} und ${maxTeilerZahlen[maxTeilerZahlen.length - 1]} haben je ${maxTeiler} Teiler, mehr erreicht keine Zahl unter 100. Bei 60 sind es ${sec(teiler60, 'list')?.formattedValue}.`,
      },
    ],
  },

  'pythagoras-rechner': {
    sections: [
      {
        title: 'Pythagoras im Alltag: drei Aufgaben mit Lösung',
        content: `${table(['Situation', 'gegeben', 'gesucht', 'Ergebnis'], [
          ['Leiter an der Wand', 'Leiter 4 m (Hypotenuse), Fußabstand 1 m', 'Höhe an der Wand', `${f(leiterHoehe, 2)} m`],
          ['Fernseher 55 Zoll, Format 16:9', 'Diagonale 55 · 2,54 cm = 139,7 cm', 'Breite und Höhe', `${f(tvBreite, 1)} cm × ${f(tvHoehe, 1)} cm`],
          ['Dachsparren ohne Überstand', 'halbe Hausbreite 4,5 m, Firsthöhe 2,8 m', 'Sparrenlänge', `${f(sparren, 2)} m`],
        ])}\n\nBeim Fernseher berechnet man zuerst die Diagonale des Seitenverhältnisses: √(16² + 9²) = ${f(tvDiagEinheiten, 3)}. Die echte Diagonale geteilt durch diesen Wert ergibt die Länge einer Einheit, die man mit 16 und mit 9 multipliziert.`,
      },
      {
        title: 'Typische Fehler in Klassenarbeiten',
        content: `- **Hypotenuse falsch zugeordnet:** c ist immer die Seite gegenüber dem rechten Winkel und die längste Seite. Wer bei der Leiter 4 m als Kathete einsetzt, erhält ${f(pyKatheteFalsch, 3)} m statt ${f(leiterHoehe, 3)} m.\n- **Wurzel aus der Summe aufgeteilt:** √(3² + 4²) = 5, nicht 3 + 4 = ${pyFalsch}.\n- **Plus statt minus:** Für eine Kathete wird subtrahiert, a = √(c² − b²).\n- **Gemischte Einheiten:** Alle Seiten vor dem Quadrieren in dieselbe Einheit bringen, also nicht 1,2 m mit 80 cm verrechnen.`,
      },
    ],
    faqs: [
      {
        question: 'Wie prüft man mit dem Zollstock, ob eine Ecke rechtwinklig ist?',
        answer: `Messen Sie von der Ecke 60 cm an der einen und 80 cm an der anderen Wand ab. Beträgt der Abstand zwischen beiden Markierungen genau ${f(zollstock, 0)} cm, ist der Winkel rechtwinklig. Weicht er ab, ist die Ecke spitzer (kürzer) oder stumpfer (länger).`,
      },
      {
        question: 'Passt ein Schrank beim Aufrichten unter die Zimmerdecke?',
        answer: `Entscheidend ist die Diagonale der Seitenansicht aus Höhe und Tiefe. Ein Schrank mit 2,10 m Höhe und 60 cm Tiefe braucht beim Aufrichten √(2,10² + 0,60²) = ${f(schrankDiag, 3)} m Platz. Bei einer Raumhöhe von 2,50 m passt er also.`,
      },
      {
        question: 'Wie lang ist die Diagonale eines Quadrats?',
        answer: `Seitenlänge mal √2. Bei 10 cm Seitenlänge ergibt der Rechner mit a = b = 10 eine Diagonale von ${f(quadratDiag, 3)} cm.`,
      },
    ],
    workedExamples: [
      {
        title: 'Beispiel Kathete: Wie hoch reicht eine 4-m-Leiter bei 1 m Fußabstand?',
        description: `a = √(4² − 1²) = √15 ≈ ${f(leiterHoehe, 3)} m.`,
        inputs: { target: 'a', sideB: 1, sideC: 4 },
        resultSummary: `a = ${f(leiterHoehe, 3)} m`,
      },
    ],
  },

  'perzentil-rechner': {
    sections: [
      {
        title: 'Warum Excel, Statistikprogramme und Lehrbücher unterschiedliche Perzentile liefern',
        content: `Für Perzentile gibt es mehrere gebräuchliche Definitionen. Dieser Rechner interpoliert linear über den Index (p/100) · (n − 1), wie Excel mit QUANTIL.INKL. Für die Beispielreihe 10, 25, 40, 55, 70, 85 ergeben sich je nach Verfahren verschiedene Werte:\n\n${table(['Perzentil', 'dieser Rechner (QUANTIL.INKL)', 'QUANTIL.EXKL', 'Rangmethode ohne Interpolation'], pzRows)}\n\nQUANTIL.EXKL rechnet mit dem Rang (p/100) · (n + 1) und kann bei nur sechs Werten kein 90. Perzentil bilden. Die Rangmethode nimmt den Wert an Position ⌈p/100 · n⌉ der sortierten Reihe. Vergleichen Sie Perzentile deshalb nur, wenn sie mit demselben Verfahren berechnet wurden.`,
      },
      {
        title: 'Quartile, Median und Dezile sind besondere Perzentile',
        content: `- P25 ist das untere Quartil (Q1), P50 der Median, P75 das obere Quartil (Q3).\n- P10, P20 … P90 heißen Dezile.\n- Der Abstand P75 − P25 ist der Interquartilsabstand. Für die Beispielreihe beträgt er ${f(pzEngine(75))} − ${f(pzEngine(25))} = ${f(pzIqr)}; in diesem Bereich liegt die mittlere Hälfte der Werte.`,
      },
    ],
    faqs: [
      {
        question: 'Was ist der Unterschied zwischen Prozent und Perzentil?',
        answer: 'Prozent beschreibt einen Anteil an einer Höchstpunktzahl, das Perzentil die Position innerhalb einer Gruppe. 80 % der Punkte in einem Test können je nach Gruppe das 50. oder das 95. Perzentil sein: entscheidend ist, wie die anderen abgeschnitten haben.',
      },
      {
        question: 'Wie verlässlich ist ein Perzentil bei wenigen Messwerten?',
        answer: `Bei kleinen Reihen hängen die oberen Perzentile stark an einzelnen Werten. Ändert man in der Beispielreihe nur den größten Wert von 85 auf 185, springt P90 von ${f(pzEngine(90))} auf ${f(pzAusreisser)}, während der Median gleich bleibt.`,
      },
    ],
  },

  'standardabweichung-rechner': {
    sections: [
      {
        title: 'Rechenweg Schritt für Schritt an der Beispielreihe',
        content: `Für die sieben Werte ${sdVals.join(', ')} ist der Mittelwert ${f(sdMean)}. Dann werden die Abweichungen quadriert:\n\n${table(['xᵢ', 'xᵢ − x̄', '(xᵢ − x̄)²'], sdRows)}\n\n- Summe der Quadrate: ${f(sdSumSq)}\n- Stichprobenvarianz: ${f(sdSumSq)} : (7 − 1) = ${f(sdVarS, 4)}, Standardabweichung s = √${f(sdVarS, 4)} = **${f(sdS, 4)}**\n- Populationsvarianz: ${f(sdSumSq)} : 7 = ${f(sdSumSq / 7, 4)}, Standardabweichung σ = **${f(sdSigma, 4)}**`,
      },
      {
        title: 'Stichprobe (s) oder Grundgesamtheit (σ): welcher Wert passt?',
        content: `Der Rechner zeigt als Hauptergebnis s (Teilung durch n − 1) und darunter σ (Teilung durch n).\n\n- **σ** verwenden Sie, wenn die Daten die komplette Gruppe sind, über die Sie eine Aussage machen, etwa alle Noten genau einer Klasse.\n- **s** verwenden Sie, wenn die Werte eine Auswahl sind, von der Sie auf eine größere Gruppe schließen, etwa 50 befragte Kunden von vielen tausend.\n\nIn Excel entspricht s der Funktion STABW.S und σ der Funktion STABW.N. Je größer n, desto kleiner wird der Unterschied; bei den sieben Beispielwerten beträgt er ${f(sdS - sdSigma, 4)}.`,
      },
    ],
    faqs: [
      {
        question: `Wie interpretiert man eine Standardabweichung von ${f(sdS)} bei einem Mittelwert von ${f(sdMean)}?`,
        answer: `Der Bereich Mittelwert ± s reicht von ${f(sdMean - sdS)} bis ${f(sdMean + sdS)}. In der Beispielreihe liegen ${sdInnerhalb} der 7 Werte darin. Im Verhältnis zum Mittelwert beträgt die Streuung ${formatPercent((sdS / sdMean) * 100, 1)} (Variationskoeffizient), die Werte schwanken also mäßig.`,
      },
      {
        question: 'Kann die Standardabweichung null oder negativ sein?',
        answer: `Negativ nie, weil sie aus einer Summe von Quadraten entsteht. Null ist sie genau dann, wenn alle Werte gleich sind: Für 5; 5; 5; 5 liefert der Rechner s = ${f(sdKonstant, 0)}.`,
      },
      {
        question: 'Was ist der Unterschied zwischen Varianz und Standardabweichung?',
        answer: `Die Varianz ist das Quadrat der Standardabweichung und hat deshalb eine quadrierte Einheit. Messen Sie Längen in cm, steht die Varianz in cm² (hier ${f(sdVarS, 2)}), die Standardabweichung wieder in cm (${f(sdS, 2)}). Darum lässt sich s direkt mit den Messwerten vergleichen.`,
      },
    ],
  },

  'wahrscheinlichkeit-wuerfel-muenze-rechner': {
    sections: [
      {
        title: 'Augensummen mit zwei Würfeln: alle Wahrscheinlichkeiten',
        content: `${table(['Augensumme', 'günstige Paare von 36', 'Wahrscheinlichkeit'], augensummen.map(([s, c]) => [s, c, `${c}/36 = ${formatPercent((c / 36) * 100, 2)}`]))}\n\nDie Verteilung ist symmetrisch um die 7. Eine 2 (Doppel-Eins) ist genauso selten wie eine 12 (Doppel-Sechs), eine 6 genauso häufig wie eine 8.`,
      },
      {
        title: 'Mindestens eine 6 bei mehreren Würfeln',
        content: `So entwickeln sich die Chancen mit der Zahl der Würfel; die letzte Spalte zeigt zum Vergleich, wie wahrscheinlich es ist, mit einer Münze genauso oft hintereinander Kopf zu werfen:\n\n${table(['Würfel', 'mindestens eine 6', 'keine 6', 'n-mal Kopf in Folge'], wRows)}\n\nAb vier Würfen ist die Chance auf mindestens eine 6 größer als 50 % (${formatPercent(p4Wuerfe, 2)}). Wer die Einzelchancen einfach addiert (4 · 1/6 = 66,7 %), überschätzt sie deutlich; bei sieben Würfen käme man so sogar über 100 %.`,
      },
    ],
    faqs: [
      {
        question: 'Wie wahrscheinlich ist ein Pasch mit zwei Würfeln?',
        answer: `Es gibt 6 Pasch-Kombinationen (1-1 bis 6-6) unter 36 möglichen Paaren, also 6/36 = 1/6 = ${formatPercent(pasch, 2)}. Ein bestimmter Pasch wie die Doppel-Sechs hat nur 1/36 = ${formatPercent((1 / 36) * 100, 2)}.`,
      },
      {
        question: 'Wie wahrscheinlich sind fünf gleiche Augen mit fünf Würfeln in einem Wurf?',
        answer: `Der erste Würfel ist beliebig, die anderen vier müssen passen: 6 günstige von 6⁵ = 7.776 Ergebnissen, also 1/1.296 = ${formatPercent(kniffel, 4)}.`,
      },
      {
        question: 'Wie oft muss man würfeln, um mit 90 % Sicherheit eine 6 zu bekommen?',
        answer: `${wuerfeFuer90}-mal. Nach ${wuerfeFuer90 - 1} Würfen liegt die Chance erst bei ${formatPercent(pVor90, 2)}, nach ${wuerfeFuer90} Würfen bei ${formatPercent(pBei90, 2)}. Rechnung: 1 − (5/6)ⁿ ≥ 0,9.`,
      },
    ],
  },

  'ohmsches-gesetz-rechner': {
    sections: [
      {
        title: 'Strom und Widerstand typischer Geräte an 230 V',
        content: `Aus der Leistung auf dem Typenschild folgt der Strom I = P : U, daraus der Widerstand im Betrieb:\n\n${table(['Leistung', 'Strom', 'Widerstand', 'Kontrolle P = U · I'], ohmRows)}\n\n3.680 W entsprechen genau 16 A, dem Nennstrom üblicher Haushaltssicherungen. Der Widerstand ist ein rechnerischer Wert im Betrieb. Heizdrähte haben kalt deutlich weniger Widerstand, beim Einschalten fließt daher kurz mehr Strom.`,
      },
      {
        title: 'Vorwiderstand für eine LED berechnen',
        content: `Am Widerstand muss die Differenz aus Versorgungsspannung und LED-Spannung abfallen. Typische Durchlassspannungen liegen bei etwa 2 V (rot) und etwa 3 V (weiß, blau); maßgeblich ist das Datenblatt.\n\n- Rote LED an 5 V mit 20 mA: R = (5 V − 2 V) : 0,02 A = **${f(ledRot.primary.value as number, 0)} Ω**, Verlustleistung im Widerstand ${f(num(ledRot, 'power'), 2)} W.\n- Weiße LED an 12 V mit 20 mA: R = 9 V : 0,02 A = ${f(ledWeiss.primary.value as number, 0)} Ω. Diesen Wert gibt es nicht als Normwert, man nimmt den nächstgrößeren E12-Wert 470 Ω. Der Strom sinkt dann auf ${f((ledWeiss470.primary.value as number) * 1000, 1)} mA.\n\nIm Rechner: gesuchte Größe Widerstand, als Spannung die Differenz und als Strom den LED-Strom in Ampere eingeben.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel Leistung darf an einem 16-A-Stromkreis mit 230 V hängen?',
        answer: `Rechnerisch P = 230 V · 16 A = ${f(num(sicherung, 'power'), 0)} W. Alle gleichzeitig betriebenen Geräte an diesem Stromkreis zusammen sollten diesen Wert nicht überschreiten, sonst kann die Sicherung auslösen.`,
      },
      {
        question: 'Was passiert, wenn sich die Spannung bei gleichem Widerstand verdoppelt?',
        answer: `Der Strom verdoppelt sich, die Leistung vervierfacht sich. Bei 46 Ω fließen an 115 V ${f(halbeSpannung.primary.value as number, 1)} A (${f(num(halbeSpannung, 'power'), 1)} W), an 230 V ${f(volleSpannung.primary.value as number, 1)} A (${f(num(volleSpannung, 'power'), 0)} W).`,
      },
      {
        question: 'Gilt das Ohmsche Gesetz für jedes Bauteil?',
        answer: 'Nein. Es gilt nur, solange der Widerstand konstant ist, also für Metalldrähte und Widerstände bei gleichbleibender Temperatur. LEDs und Dioden leiten erst ab ihrer Durchlassspannung und haben keinen festen Widerstand. Glühlampen ändern ihren Widerstand mit der Temperatur stark.',
      },
    ],
  },
};
