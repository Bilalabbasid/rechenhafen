import { CalculationResult, CalculatorDefinition } from '@/types/calculator';
import { formatNumber } from '@/lib/formatters';
import { calculateCylinder, calculateRectangle } from '@/lib/calculators/geometrie';
import { EXTRA_BAUEN_GEOMETRIE } from '../extra/bauenGeometrie';
import { PageContentMap } from './types';

// ---------------------------------------------------------------------------
// Alle Zahlen in Tabellen, Schritten und Antworten werden beim Laden mit der
// calculate-Funktion des jeweiligen Rechners berechnet. Umgerechnet wird hier
// nur die Eingabe (z. B. Füllhöhe → Mittelpunktswinkel), nie das Ergebnis.
// ---------------------------------------------------------------------------

type Engine = (inputs: Record<string, any>) => CalculationResult;

function engineOf(list: CalculatorDefinition[], slug: string): Engine {
  const def = list.find((c) => c.slug === slug);
  if (!def) throw new Error(`page-content/geometrie: Rechner "${slug}" nicht gefunden`);
  return (inputs) => def.calculate(inputs);
}

/** Numeric result by id (primary or secondary); throws on missing or non-finite values. */
function num(r: CalculationResult, id: string): number {
  const raw = r.primary.id === id ? r.primary.value : r.secondary?.find((s) => s.id === id)?.value;
  const v = Number(raw);
  if (raw === undefined || !Number.isFinite(v)) throw new Error(`page-content/geometrie: Ergebnis "${id}" fehlt oder ist ungültig`);
  return v;
}

const f = (v: number, digits = 2) => formatNumber(v, digits);
const fx = (v: number, digits = 2) => formatNumber(v, digits, digits);
const toDeg = (rad: number) => (rad * 180) / Math.PI;

function table(head: string[], rows: string[][]): string {
  return [
    `| ${head.join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...rows.map((r) => `| ${r.join(' | ')} |`),
  ].join('\n');
}

const rohr = engineOf(EXTRA_BAUEN_GEOMETRIE, 'hohlzylinder-rohr-rechner');
const segment = engineOf(EXTRA_BAUEN_GEOMETRIE, 'kreissegment-rechner');
const winkel = engineOf(EXTRA_BAUEN_GEOMETRIE, 'bogenmass-grad-rechner');
const kugel = engineOf(EXTRA_BAUEN_GEOMETRIE, 'kugel-oberflaeche-rechner');
const trapez = engineOf(EXTRA_BAUEN_GEOMETRIE, 'trapez-flaeche-rechner');
const sechseck = engineOf(EXTRA_BAUEN_GEOMETRIE, 'sechseck-polygon-rechner');
const kegel = engineOf(EXTRA_BAUEN_GEOMETRIE, 'kegel-volumen-rechner');
const parallelogramm = engineOf(EXTRA_BAUEN_GEOMETRIE, 'parallelogramm-rechner');
const goldenerSchnitt = engineOf(EXTRA_BAUEN_GEOMETRIE, 'goldener-schnitt-rechner');
const zylinder: Engine = calculateCylinder;
const rechteck: Engine = calculateRectangle;

// ---------------------------------------------------------------------------
// Hohlzylinder / Rohr
// ---------------------------------------------------------------------------
const rohrMasse: Array<[string, number, number, string]> = [
  ['Stahl-Gewinderohr DN 15 (½ Zoll), 21,3 × 2,6', 21.3, 2.6, 'steel'],
  ['Stahl-Gewinderohr DN 25 (1 Zoll), 33,7 × 3,2', 33.7, 3.2, 'steel'],
  ['Stahlrohr 60,3 × 2,9', 60.3, 2.9, 'steel'],
  ['Edelstahl-Handlauf 42,4 × 2', 42.4, 2, 'stainless'],
  ['Kupferrohr 15 × 1', 15, 1, 'copper'],
  ['Kupferrohr 22 × 1', 22, 1, 'copper'],
  ['Aluminiumrohr 40 × 2', 40, 2, 'aluminum'],
  ['PVC-Rohr 110 × 3,2', 110, 3.2, 'pvc'],
];
const rohrTabelle = table(
  ['Rohr (Außen-Ø × Wand in mm)', 'Innen-Ø', 'Gewicht je Meter', 'Wasserinhalt je Meter'],
  rohrMasse.map(([label, D, s, material]) => {
    const r = rohr({ outerDiameterMm: D, wallThicknessMm: s, lengthM: 1, material });
    return [label, `${f(num(r, 'innerDiameter'), 1)} mm`, `${fx(num(r, 'weight'))} kg`, `${fx(num(r, 'innerVol'), 3)} l`];
  })
);
const warmLeitung = rohr({ outerDiameterMm: 15, wallThicknessMm: 1, lengthM: 12, material: 'copper' });
const warmLiter = num(warmLeitung, 'innerVol');
const warmSekunden = (warmLiter / 6) * 60;
const heizLeitung = rohr({ outerDiameterMm: 22, wallThicknessMm: 1, lengthM: 40, material: 'copper' });
const stange6m = rohr({ outerDiameterMm: 33.7, wallThicknessMm: 3.2, lengthM: 6, material: 'steel' });
const rundstahl = rohr({ outerDiameterMm: 20, wallThicknessMm: 10, lengthM: 1, material: 'steel' });
const gefuellt = rohr({ outerDiameterMm: 60.3, wallThicknessMm: 2.9, lengthM: 3, material: 'steel' });
const gefuelltRohr = num(gefuellt, 'weight');
const gefuelltWasser = num(gefuellt, 'innerVol');

// ---------------------------------------------------------------------------
// Kreissegment
// ---------------------------------------------------------------------------
const tankAnteile = [10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90];
const tankTabelle = table(
  ['Füllhöhe (in % des Durchmessers)', 'Mittelpunktswinkel α', 'Inhalt (in % des Tankvolumens)'],
  tankAnteile.map((p) => {
    const alpha = toDeg(2 * Math.acos(1 - (2 * p) / 100));
    const r = segment({ radius: 100, angleAlpha: alpha });
    const anteil = (num(r, 'segmentArea') / (Math.PI * 100 * 100)) * 100;
    return [`${p} %`, `${f(alpha, 1)}°`, `${f(anteil, 1)} %`];
  })
);
const tankAlpha = toDeg(2 * Math.acos(1 - 45 / 60));
const tankSeg = segment({ radius: 60, angleAlpha: tankAlpha });
const tankSegFlaeche = num(tankSeg, 'segmentArea');
const tankLiter = (tankSegFlaeche * 250) / 1000;
const tankGesamt = num(zylinder({ radius: 60, height: 250 }), 'volume') / 1000;

const bogenRadius = (120 * 120) / 4 / (2 * 30) + 30 / 2; // (s²/4 + h²) / (2h)
const bogenAlpha = toDeg(2 * Math.asin(120 / (2 * bogenRadius)));
const bogen = segment({ radius: bogenRadius, angleAlpha: bogenAlpha });
const torte = segment({ radius: 13, angleAlpha: 30 });
const kanteAlpha = toDeg(300 / 200);
const kante = segment({ radius: 200, angleAlpha: kanteAlpha });
const gross = segment({ radius: 10, angleAlpha: 240 });
const klein = segment({ radius: 10, angleAlpha: 120 });

// ---------------------------------------------------------------------------
// Bogenmaß / Grad / Gon
// ---------------------------------------------------------------------------
const winkelListe: Array<[number, string]> = [
  [1, 'π/180'], [30, 'π/6'], [45, 'π/4'], [60, 'π/3'], [90, 'π/2'],
  [120, '2π/3'], [180, 'π'], [270, '3π/2'], [360, '2π'],
];
const winkelTabelle = table(
  ['Grad', 'Bogenmaß exakt', 'Bogenmaß dezimal', 'Gon'],
  winkelListe.map(([d, exakt]) => {
    const r = winkel({ angleVal: d, unit: 'deg' });
    return [`${d}°`, exakt, `${fx(num(r, 'rad'), 4)} rad`, `${f(num(r, 'gon'), 4)} gon`];
  })
);
const sin30Grad = Math.sin(num(winkel({ angleVal: 30, unit: 'deg' }), 'rad'));
const sin30Rad = Math.sin(num(winkel({ angleVal: 30, unit: 'rad' }), 'rad'));
const gon30 = winkel({ angleVal: 30, unit: 'gon' });
const sin30Gon = Math.sin(num(gon30, 'rad'));
const gps = winkel({ angleVal: 51 + 30 / 60 + 26 / 3600, unit: 'deg' });
const radViertel = num(winkel({ angleVal: 90, unit: 'deg' }), 'rad');

// ---------------------------------------------------------------------------
// Kugel
// ---------------------------------------------------------------------------
const kugelListe: Array<[number, string]> = [
  [4, 'Tischtennisball-Größe'],
  [10, 'Beispiel'],
  [22, 'etwa Fußballgröße'],
  [30, 'Gartenkugel'],
  [65, 'Gymnastikball'],
  [100, '1-Meter-Kugel'],
];
const kugelTabelle = table(
  ['Durchmesser', 'Typisches Objekt', 'Volumen', 'Oberfläche', 'Oberfläche je Liter'],
  kugelListe.map(([d, label]) => {
    const r = kugel({ inputType: 'diameter', inputValue: d });
    const liter = num(r, 'volume') / 1000;
    const o = num(r, 'surface');
    return [`${d} cm`, label, `${f(liter, 3)} l`, `${f(o, 0)} cm²`, `${f(o / liter, 0)} cm²`];
  })
);
const fussballUmfang = kugel({ inputType: 'diameter', inputValue: 69 / Math.PI });
const schale = kugel({ inputType: 'diameter', inputValue: 50 });
const gartenkugel = kugel({ inputType: 'diameter', inputValue: 30 });
const stahlkugel = kugel({ inputType: 'diameter', inputValue: 10 });
const einLiter = kugel({ inputType: 'volume', inputValue: 1000 });

// ---------------------------------------------------------------------------
// Rechteck
// ---------------------------------------------------------------------------
const formen36: Array<[number, number]> = [[6, 6], [9, 4], [12, 3], [18, 2], [36, 1]];
const rechteckTabelle = table(
  ['Seiten a × b', 'Fläche', 'Umfang', 'Diagonale', 'Seitenverhältnis'],
  formen36.map(([a, b]) => {
    const r = rechteck({ lengthA: a, widthB: b });
    return [`${a} m × ${b} m`, `${f(num(r, 'area'))} m²`, `${f(num(r, 'perimeter'))} m`, `${fx(num(r, 'diagonal'))} m`, `${f(num(r, 'ratio'))} : 1`];
  })
);
const raum = rechteck({ lengthA: 5.2, widthB: 3.8 });
const nische = rechteck({ lengthA: 2.0, widthB: 1.5 });
const lFlaeche = num(raum, 'area') + num(nische, 'area');
const lUmfang = num(raum, 'perimeter') + 2 * 1.5;
const sockel = lUmfang - 0.9;
const wandBrutto = num(rechteck({ lengthA: lUmfang, widthB: 2.5 }), 'area');
const tuer = num(rechteck({ lengthA: 0.9, widthB: 2.0 }), 'area');
const fenster = num(rechteck({ lengthA: 1.2, widthB: 1.4 }), 'area');
const wandNetto = wandBrutto - tuer - fenster;
const grundstueck = rechteck({ lengthA: 20, widthB: 600 / 20 });
const tisch = rechteck({ lengthA: 1.2, widthB: 0.8 });

// ---------------------------------------------------------------------------
// Trapez
// ---------------------------------------------------------------------------
const walmGrat = Math.sqrt(5 * 5 + 4 * 4);
const walmTrapez = num(trapez({ sideA: 12, sideC: 4, heightH: 5, sideB: walmGrat, sideD: walmGrat }), 'area');
const walmDreieck = num(trapez({ sideA: 8, sideC: 0, heightH: 5, sideB: walmGrat, sideD: walmGrat }), 'area');
const walmGesamt = 2 * walmTrapez + 2 * walmDreieck;
const graben = num(trapez({ sideA: 1.0, sideC: 0.4, heightH: 0.8, sideB: 0.85, sideD: 0.85 }), 'area');
const grabenM3 = graben * 15;
const schenkelStandard = Math.sqrt(5 * 5 + ((12 - 8) / 2) ** 2);
const trapezHoehe = (2 * 450) / (28 + 17);
const trapezProbe = num(trapez({ sideA: 28, sideC: 17, heightH: trapezHoehe, sideB: 21, sideD: 21 }), 'area');

// ---------------------------------------------------------------------------
// Sechseck
// ---------------------------------------------------------------------------
const plattenKanten = [5, 10, 15, 20];
const sechseckTabelle = table(
  ['Kantenlänge a', 'Schlüsselweite (flach–flach)', 'Eckmaß (Ecke–Ecke)', 'Fläche je Platte', 'Platten pro m² (ohne Fuge)'],
  plattenKanten.map((a) => {
    const r = sechseck({ sideA: a });
    const flaeche = num(r, 'area');
    return [`${a} cm`, `${f(num(r, 'wrenchSize'), 1)} cm`, `${f(2 * num(r, 'circumradius'), 1)} cm`, `${f(flaeche, 1)} cm²`, f(10000 / flaeche, 1)];
  })
);
const hochbeet = sechseck({ sideA: 300 / 2 });
const hochbeetM2 = num(hochbeet, 'area') / 10000;
const hochbeetLiter = hochbeetM2 * 0.4 * 1000;
const sw16 = sechseck({ sideA: 16 / Math.sqrt(3) });
const sw17 = sechseck({ sideA: 17 / Math.sqrt(3) });

// ---------------------------------------------------------------------------
// Kegel
// ---------------------------------------------------------------------------
const haufenR = 940 / (2 * Math.PI);
const haufenS = 420 / 2;
const haufenH = Math.sqrt(haufenS * haufenS - haufenR * haufenR);
const haufen = kegel({ radius: haufenR, height: haufenH });
const haufenM3 = num(haufen, 'volume') / 1_000_000;
const haufenTonnen = haufenM3 * 1.6;
const hut = kegel({ radius: 6, height: 8 });
const hutS = num(hut, 'slantHeight');
const hutWinkel = (360 * 6) / hutS;
const trichter = kegel({ radius: 10, height: 15 });
const trichterS = num(trichter, 'slantHeight');
const trichterWinkel = (360 * 10) / trichterS;
const tuete = kegel({ radius: 2.5, height: 12 });
const oeffnung = 2 * toDeg(Math.atan(6 / 8));

// ---------------------------------------------------------------------------
// Parallelogramm
// ---------------------------------------------------------------------------
const rahmenWinkel = [90, 89, 88, 87, 85];
const rahmenTabelle = table(
  ['Winkel α', 'Lange Diagonale e', 'Kurze Diagonale f', 'Differenz e − f', 'Fläche'],
  rahmenWinkel.map((w) => {
    const r = parallelogramm({ sideA: 200, sideB: 120, angleDeg: w });
    const e = num(r, 'diagonalE');
    const fd = num(r, 'diagonalF');
    return [`${w}°`, `${fx(e, 1)} cm`, `${fx(fd, 1)} cm`, `${fx(e - fd, 1)} cm`, `${f(num(r, 'area') / 10000, 3)} m²`];
  })
);
const rahmen89 = parallelogramm({ sideA: 200, sideB: 120, angleDeg: 89 });
const rahmen89Diff = num(rahmen89, 'diagonalE') - num(rahmen89, 'diagonalF');
const schiefWinkel = [90, 75, 60, 45, 30];
const schiefBasis = num(parallelogramm({ sideA: 10, sideB: 6, angleDeg: 90 }), 'area');
const schiefTabelle = table(
  ['Winkel α', 'Höhe h_a', 'Fläche', 'Anteil an a · b'],
  schiefWinkel.map((w) => {
    const r = parallelogramm({ sideA: 10, sideB: 6, angleDeg: w });
    return [`${w}°`, `${fx(num(r, 'heightA'))} cm`, `${fx(num(r, 'area'))} cm²`, `${f((num(r, 'area') / schiefBasis) * 100, 1)} %`];
  })
);
const ausHoehe = toDeg(Math.asin(4.5 / 6));
const ausHoeheProbe = parallelogramm({ sideA: 10, sideB: 6, angleDeg: ausHoehe });

// ---------------------------------------------------------------------------
// Goldener Schnitt
// ---------------------------------------------------------------------------
const goldListe: Array<[number, string, string]> = [
  [80, 'cm', 'Bild mit Passepartout: Motivkante'],
  [180, 'cm', 'Regal: Lage eines Fachbodens'],
  [300, 'cm', 'Beet: Grenze zwischen zwei Pflanzzonen'],
  [1200, 'px', 'Webseite: Inhalt und Seitenleiste'],
  [6000, 'px', 'Fotobreite (z. B. 6.000 × 4.000 px)'],
];
const goldTabelle = table(
  ['Gesamtmaß', 'Major (≈ 61,8 %)', 'Minor (≈ 38,2 %)', 'Anwendung'],
  goldListe.map(([total, unit, use]) => {
    const r = goldenerSchnitt({ calcMode: 'total', inputLength: total });
    return [`${f(total, 0)} ${unit}`, `${f(num(r, 'major'), 1)} ${unit}`, `${f(num(r, 'minor'), 1)} ${unit}`, use];
  })
);
const phi = num(goldenerSchnitt({ calcMode: 'total', inputLength: 100 }), 'ratio');
const fibo: Array<[number, number]> = [[2, 3], [3, 5], [5, 8], [8, 13], [13, 21], [21, 34]];
const fiboTabelle = table(
  ['Verhältnis', 'Dezimal', 'Abweichung von Φ'],
  fibo.map(([a, b]) => [`${a} : ${b}`, fx(b / a, 4), `${f(Math.abs(b / a / phi - 1) * 100, 2)} %`])
);
const fotoBreite = goldenerSchnitt({ calcMode: 'total', inputLength: 6000 });
const fotoHoehe = goldenerSchnitt({ calcMode: 'total', inputLength: 4000 });
const tischplatte = goldenerSchnitt({ calcMode: 'minor', inputLength: 90 });

// ---------------------------------------------------------------------------
// Zylinder
// ---------------------------------------------------------------------------
const behaelter: Array<[string, number, number]> = [
  ['Aufstellpool', 305, 65],
  ['Aufstellpool', 366, 80],
  ['Aufstellpool', 457, 95],
  ['Stahlwandpool', 350, 110],
  ['Regentonne', 60, 90],
  ['Betonring (Schacht)', 100, 100],
];
const zylinderTabelle = table(
  ['Behälter (Beispielmaße)', 'Innen-Ø', 'Füllhöhe', 'Inhalt', 'Liter je cm Füllhöhe'],
  behaelter.map(([label, d, h]) => {
    const r = zylinder({ radius: d / 2, height: h });
    const liter = num(r, 'volume') / 1000;
    return [label, `${d} cm`, `${h} cm`, `${f(liter, 0)} l (${fx(liter / 1000)} m³)`, `${fx(num(r, 'baseArea') / 1000)} l`];
  })
);
const tonneRichtig = num(zylinder({ radius: 30, height: 90 }), 'volume') / 1000;
const tonneFalsch = num(zylinder({ radius: 60, height: 90 }), 'volume') / 1000;
const zielHoehe = 300000 / (Math.PI * 30 * 30);
const zielProbe = num(zylinder({ radius: 30, height: zielHoehe }), 'volume') / 1000;
const poolWand = zylinder({ radius: 183, height: 91 });

export const GEOMETRIE_PAGE_CONTENT: PageContentMap = {
  'hohlzylinder-rohr-rechner': {
    sections: [
      {
        title: 'Gewicht und Wasserinhalt pro Meter für gängige Rohrmaße',
        content: `Die Tabelle zeigt, was der Rechner für je 1 m Rohr ausgibt. Die Wandstärken sind Beispiele; Rohre gleicher Außenmaße gibt es in mehreren Wandstärken, maßgeblich ist das Datenblatt Ihres Rohrs.\n\n${rohrTabelle}\n\nKatalogwerte der Hersteller liegen oft einige Prozent daneben: Durchmesser und Wand haben Fertigungstoleranzen, verzinkte Rohre tragen zusätzlich eine Zinkschicht, und Legierungen weichen von den Standarddichten des Rechners (Stahl 7,85, Edelstahl 7,95, Kupfer 8,96 kg/dm³) leicht ab.`,
      },
      {
        title: 'Drei Alltagsfragen, die das Innenvolumen beantwortet',
        content: `- **Warum kommt das Warmwasser so spät?** 12 m Kupferrohr 15 × 1 zwischen Speicher und Bad enthalten ${f(warmLiter, 2)} Liter. Bei einem Beispiel-Durchfluss von 6 Liter pro Minute fließen also rund ${f(warmSekunden, 0)} Sekunden abgekühltes Wasser aus dem Hahn, bevor warmes ankommt.\n- **Wie viel Wasser braucht die Heizung beim Befüllen?** 40 m Kupferrohr 22 × 1 fassen ${f(num(heizLeitung, 'innerVol'), 1)} Liter; Heizkörper und Kessel kommen dazu.\n- **Wie schwer ist die Lieferung?** Eine 6-m-Stange Gewinderohr DN 25 wiegt ${f(num(stange6m, 'weight'), 1)} kg, zehn Stangen also rund ${f(10 * num(stange6m, 'weight'), 0)} kg. Das hilft beim Abschätzen der Zuladung von Auto oder Anhänger.`,
      },
    ],
    faqs: [
      {
        question: 'Soll ich die Nennweite DN oder den Außendurchmesser eingeben?',
        answer: 'Immer den gemessenen Außendurchmesser. Die Nennweite ist nur eine gerundete Größenbezeichnung: Ein Stahl-Gewinderohr DN 25 (1 Zoll) hat 33,7 mm Außendurchmesser, nicht 25 mm. Kupfer- und Kunststoffrohre werden dagegen direkt nach Außendurchmesser × Wandstärke benannt, etwa 15 × 1 oder 110 × 3,2. Messen Sie im Zweifel mit dem Messschieber am Rohrende.',
      },
      {
        question: 'Kann ich auch das Gewicht von Rundstahl oder Vollmaterial berechnen?',
        answer: `Ja. Setzen Sie die Wandstärke auf den halben Außendurchmesser, dann ist der Innendurchmesser 0 und der Rechner behandelt das Teil als Vollzylinder. Ein Rundstahl mit 20 mm Durchmesser wiegt so ${fx(num(rundstahl, 'weight'))} kg pro Meter.`,
      },
      {
        question: 'Wie schwer ist ein Rohr, wenn es mit Wasser gefüllt ist?',
        answer: `Zählen Sie Rohrgewicht und Innenvolumen zusammen, denn 1 Liter Wasser wiegt rund 1 kg. Ein 3 m langes Stahlrohr 60,3 × 2,9 wiegt leer ${f(gefuelltRohr, 1)} kg und fasst ${f(gefuelltWasser, 1)} Liter, gefüllt also etwa ${f(gefuelltRohr + gefuelltWasser, 1)} kg. Mit diesem Wert wählen Sie Halterungen und Abstände aus; die zulässige Last steht in den Angaben des Schellenherstellers.`,
      },
    ],
  },

  'kreissegment-rechner': {
    sections: [
      {
        title: 'Füllstand im liegenden Zylindertank: Peilhöhe in Prozent umrechnen',
        content: `Bei einem liegenden Tank ist der Querschnitt der Flüssigkeit ein Kreissegment. Aus der Füllhöhe h und dem Radius r ergibt sich der Mittelpunktswinkel α = 2 · arccos(1 − h / r). Mit diesem Winkel liefert der Rechner die Segmentfläche, und deren Anteil an der Kreisfläche ist der Füllgrad:\n\n${tankTabelle}\n\nAn der Tabelle sehen Sie, warum ein Peilstab mit gleichmäßiger Skala in die Irre führt: In der Mitte steigt der Inhalt pro Zentimeter am stärksten, unten und oben am schwächsten.\n\n**Rechenweg für einen Tank mit 1,20 m Durchmesser, 2,50 m Länge und 45 cm Füllhöhe:**\n1. r = 60 cm, α = 2 · arccos(1 − 45 / 60) = ${f(tankAlpha, 2)}°\n2. Radius 60 und Winkel ${f(tankAlpha, 2)} eingeben: Kreissegment-Fläche ${f(tankSegFlaeche, 0)} cm²\n3. Mal Tanklänge 250 cm: ${f(tankLiter, 0)} Liter von ${f(tankGesamt, 0)} Liter Gesamtinhalt\n\nTanks mit gewölbten Böden fassen etwas mehr als der reine Zylinder. Liegt eine Peiltabelle des Herstellers vor, gilt diese.`,
      },
      {
        title: 'Rundbogen aus Breite und Stichhöhe berechnen',
        content: `Bei Torbögen, Rundbogenfenstern oder geschwungenen Beetkanten kennen Sie meist nicht Radius und Winkel, sondern die Spannweite (Sehne s) und die Stichhöhe h in der Mitte. Daraus folgen r = (s²/4 + h²) / (2h) und α = 2 · arcsin(s / (2r)).\n\nBeispiel: Ein Bogen über einer 120 cm breiten Öffnung mit 30 cm Stich hat r = ${f(bogenRadius, 2)} cm und α = ${f(bogenAlpha, 2)}°. Der Rechner ergibt dafür eine Bogenlänge von ${f(num(bogen, 'arcLength'), 1)} cm (so lang muss eine biegsame Leiste oder Kantenschutzschiene sein) und ${f(num(bogen, 'segmentArea'), 0)} cm² Fläche im Bogenfeld, etwa für Glas oder Putz. Als Kontrolle zeigt die Sehnenlänge wieder ${f(num(bogen, 'chordLength'), 1)} cm.`,
      },
    ],
    faqs: [
      {
        question: 'Wie lang ist der Rand eines Tortenstücks?',
        answer: `Teilen Sie 360° durch die Zahl der Stücke. Bei einer Torte mit 26 cm Durchmesser und 12 Stücken ist α = 30°, r = 13 cm. Jedes Stück hat dann ${f(num(torte, 'arcLength'), 2)} cm Rand und ${f(num(torte, 'sectorArea'), 1)} cm² Oberfläche.`,
      },
      {
        question: 'Wie finde ich den Winkel, wenn ich Radius und Bogenlänge kenne?',
        answer: `α = Bogenlänge / Radius · 180° / π. Eine 3 m lange Rasenkante am Rand eines runden Beets mit 2 m Radius umschließt ${f(kanteAlpha, 2)}°. Mit diesem Winkel ergibt der Rechner eine Sektorfläche von ${f(num(kante, 'sectorArea') / 10000, 2)} m², etwa für die Menge an Mulch oder Rasensaat.`,
      },
      {
        question: 'Was zeigt der Rechner bei einem Winkel über 180°?',
        answer: `Dann ist das Kreissegment der größere Teil des Kreises. Bei r = 10 cm und α = 240° beträgt die Segmentfläche ${f(num(gross, 'segmentArea'))} cm². Zusammen mit dem kleinen Segment des Restwinkels 120° (${f(num(klein, 'segmentArea'))} cm²) ergibt das genau die Kreisfläche π · 10² ≈ ${f(Math.PI * 100)} cm².`,
      },
    ],
  },

  'bogenmass-grad-rechner': {
    sections: [
      {
        title: 'Wichtige Winkel in Grad, Bogenmaß und Gon',
        content: `Diese Werte tauchen in Schulaufgaben, Formelsammlungen und Programmcode immer wieder auf. Die Spalte „exakt“ ist die Schreibweise, die Lehrkräfte meist erwarten; der Rechner zeigt das Bogenmaß dezimal und zusätzlich als Vielfaches von π.\n\n${winkelTabelle}\n\nMerkhilfe: 180° entsprechen π. Für jede andere Umrechnung teilen Sie den Gradwert durch 180 und hängen π an, also 45° = 45/180 · π = π/4.`,
      },
      {
        title: 'Der häufigste Fehler: falscher Winkelmodus',
        content: `Taschenrechner, Tabellenprogramme und Programmiersprachen rechnen mit einem festgelegten Winkelmaß. Wer 30 eintippt und 30 Grad meint, bekommt sonst ein falsches Ergebnis:\n\n- **Modus DEG (Grad):** sin(30) = ${f(sin30Grad, 4)}, so wie erwartet.\n- **Modus RAD (Bogenmaß):** sin(30) = ${f(sin30Rad, 4)}, weil 30 als 30 Radiant gelesen wird.\n- **Modus GRAD:** Auf vielen Taschenrechnern steht GRAD für Gon, nicht für Grad. 30 gon sind ${f(num(gon30, 'deg'), 2)}°, sin ergibt dort ${f(sin30Gon, 4)}.\n\nIn Excel und LibreOffice erwarten SIN, COS und TAN immer Bogenmaß. Richtig ist =SIN(BOGENMASS(30)); die Gegenrichtung erledigt die Funktion GRAD. Auch Math.sin in JavaScript und math.sin in Python arbeiten mit Radiant.`,
      },
    ],
    faqs: [
      {
        question: 'Wie rechne ich Grad, Minuten und Sekunden in Dezimalgrad um?',
        answer: `Minuten durch 60 und Sekunden durch 3.600 teilen und addieren. Aus der Koordinate 51° 30′ 26″ wird 51 + 30/60 + 26/3.600 = ${f(num(gps, 'deg'), 4)}°, im Bogenmaß ${f(num(gps, 'rad'), 4)} rad. Diese Dezimalschreibweise verlangen die meisten Kartendienste und Navigationsgeräte.`,
      },
      {
        question: 'Wie hängen Bogenmaß und Bogenlänge zusammen?',
        answer: `Die Bogenlänge ist Radius mal Winkel im Bogenmaß: b = r · α. Ein Rad mit 35 cm Radius, das sich um 90° (${f(radViertel, 4)} rad) dreht, rollt ${f(35 * radViertel, 2)} cm weit. Mit Grad funktioniert diese einfache Formel nicht; dort braucht es den Faktor π/180.`,
      },
      {
        question: 'Wofür wird Gon verwendet?',
        answer: 'Vor allem im Vermessungswesen. Der rechte Winkel hat 100 gon, der Vollkreis 400 gon, sodass sich Richtungen dezimal ohne Minuten und Sekunden notieren lassen. 1 gon entspricht 0,9°, und 1° sind rund 1,1111 gon.',
      },
    ],
  },

  'kugel-oberflaeche-rechner': {
    sections: [
      {
        title: 'Volumen und Oberfläche bekannter Kugelgrößen',
        content: `Die Werte stammen aus dem Rechner (Eingabe: Durchmesser). Die letzte Spalte zeigt, wie viel Oberfläche auf jeden Liter Inhalt kommt:\n\n${kugelTabelle}\n\nJe größer die Kugel, desto weniger Oberfläche hat sie im Verhältnis zum Inhalt. Verdoppeln Sie den Durchmesser, wächst die Oberfläche auf das Vierfache, das Volumen aber auf das Achtfache. Deshalb kühlen kleine Kugeln, etwa Kartoffeln oder Eiskugeln, schneller ab als große.`,
      },
      {
        title: 'Kugeln im Alltag messen: Umfang, Halbkugel, Anstrich',
        content: `- **Durchmesser nicht messbar?** Legen Sie ein Maßband um die dickste Stelle. Durchmesser = Umfang / π. Ein Ball mit 69 cm Umfang hat ${f(num(fussballUmfang, 'diameter'), 2)} cm Durchmesser, ${f(num(fussballUmfang, 'volume') / 1000, 2)} Liter Volumen und ${f(num(fussballUmfang, 'surface'), 0)} cm² Oberfläche.\n- **Halbkugel:** Pflanzschalen, Kuppelzelte und Schüsseln sind oft Halbkugeln. Das Volumen ist die Hälfte des Rechnerergebnisses: Eine Schale mit 50 cm Innendurchmesser fasst ${f(num(schale, 'volume') / 2000, 1)} Liter Erde.\n- **Anstrich oder Beschichtung:** Für Farbe zählt die Oberfläche. Eine Gartenkugel mit 30 cm Durchmesser hat ${f(num(gartenkugel, 'surface') / 10000, 3)} m²; den Verbrauch pro m² nennt das Etikett der Farbe.`,
      },
    ],
    faqs: [
      {
        question: 'Wie schwer ist eine Kugel aus Stahl?',
        answer: `Volumen mal Dichte. Eine Vollkugel aus Stahl mit 10 cm Durchmesser hat ${f(num(stahlkugel, 'volume'), 1)} cm³. Mit 7,85 g/cm³ wiegt sie ${f((num(stahlkugel, 'volume') * 7.85) / 1000, 2)} kg. Für Holz oder Kunststoff setzen Sie die Dichte des jeweiligen Materials ein.`,
      },
      {
        question: 'Wie groß ist eine Kugel mit genau 1 Liter Inhalt?',
        answer: `Wählen Sie im Rechner „Volumen“ und geben Sie 1.000 cm³ ein. Ergebnis: Radius ${f(num(einLiter, 'radius'), 2)} cm, Durchmesser ${f(num(einLiter, 'diameter'), 2)} cm. Ein Würfel mit gleichem Inhalt hat dagegen 10 cm Kantenlänge.`,
      },
    ],
  },

  rechteckrechner: {
    sections: [
      {
        title: 'Gleiche Fläche, anderer Umfang: wichtig für Zaun und Rasenkante',
        content: `Fünf Rechtecke mit jeweils 36 m², berechnet mit diesem Rechner:\n\n${rechteckTabelle}\n\nDie Fläche bleibt gleich, der Umfang wächst mit jedem schmaleren Format. Für ein Beet von 36 m² brauchen Sie als Quadrat 24 m Einfassung, als 18 × 2 m schon 40 m. Wer Zaun, Kantensteine oder Sockelleisten kauft, sollte deshalb immer den Umfang ausrechnen und nicht von der Fläche ausgehen.`,
      },
      {
        title: 'Zimmer ausmessen: L-Form, Sockelleisten und Wandfläche',
        content: `Nicht rechteckige Räume zerlegen Sie in Rechtecke und rechnen jedes einzeln. Beispiel: Raum 5,20 × 3,80 m mit einer Nische von 2,00 × 1,50 m an der langen Seite, Raumhöhe 2,50 m.\n\n1. **Bodenfläche:** ${f(num(raum, 'area'), 2)} m² + ${f(num(nische, 'area'), 2)} m² = ${f(lFlaeche, 2)} m²\n2. **Umfang:** Rechteck ${f(num(raum, 'perimeter'), 2)} m plus zweimal die Nischentiefe 1,50 m = ${f(lUmfang, 2)} m. Ohne Tür (0,90 m) bleiben ${f(sockel, 2)} m Sockelleiste.\n3. **Wandfläche:** Umfang × Raumhöhe = ${f(wandBrutto, 2)} m², abzüglich Tür (${f(tuer, 2)} m²) und Fenster 1,20 × 1,40 m (${f(fenster, 2)} m²) = ${f(wandNetto, 2)} m² zum Streichen oder Tapezieren.\n\nFür die Wohnfläche nach Wohnflächenverordnung gelten Sonderregeln, etwa für Dachschrägen; dafür gibt es den [Wohnflächen-Rechner](/rechner/wohnflaeche-din-rechner/).`,
      },
    ],
    faqs: [
      {
        question: 'Wie berechne ich die zweite Seite, wenn Fläche und eine Seite bekannt sind?',
        answer: `Fläche durch bekannte Seite teilen. Ein Grundstück mit 600 m² und 20 m Straßenfront ist 600 / 20 = 30 m tief. Gibt man 20 und 30 ein, bestätigt der Rechner ${f(num(grundstueck, 'area'), 0)} m² und zeigt eine Diagonale von ${f(num(grundstueck, 'diagonal'), 2)} m.`,
      },
      {
        question: 'Wie rechne ich Zentimeter mal Zentimeter in Quadratmeter um?',
        answer: `Am einfachsten rechnen Sie die Seiten vorher in Meter um. Ein Tisch mit 120 × 80 cm hat 1,2 × 0,8 m = ${f(num(tisch, 'area'), 2)} m². Rechnet man in Zentimetern, kommen 9.600 cm² heraus; die müssen durch 10.000 geteilt werden, nicht durch 100. Das ist der häufigste Umrechnungsfehler bei Flächen.`,
      },
    ],
  },

  'trapez-flaeche-rechner': {
    sections: [
      {
        title: 'Walmdach: Dachfläche aus Trapezen und Dreiecken',
        content: `Ein Walmdach besteht aus zwei Trapezen an den Längsseiten und zwei Dreiecken an den Giebelseiten. Beispiel: Haus 12 × 8 m, alle Dachflächen gleich steil, First 4 m lang, Dachflächenhöhe von der Traufe bis zum First (entlang der Schräge gemessen) 5 m.\n\n1. **Trapez:** a = 12, c = 4, h = 5 ergibt ${f(walmTrapez, 2)} m², zweimal vorhanden: ${f(2 * walmTrapez, 2)} m²\n2. **Walmdreieck:** Grundseite 8 m, Höhe 5 m ergibt ${f(walmDreieck, 2)} m², zweimal: ${f(2 * walmDreieck, 2)} m²\n3. **Gesamt:** ${f(walmGesamt, 2)} m² ohne Dachüberstand\n\nProbe: Die Grundfläche von 96 m² geteilt durch den Kosinus der Neigung (waagerecht 4 m, schräg 5 m, also 4/5) ergibt ebenfalls ${f(96 / (4 / 5), 0)} m². Der Rechner zeigt cm an, rechnet aber mit jeder Längeneinheit: Geben Sie Meter ein, ist das Ergebnis in Quadratmetern. Für Dächer mit Überstand und Gauben hilft der [Dachflächen-Rechner](/rechner/dachflaeche-rechner/).`,
      },
      {
        title: 'Graben und Böschung: Querschnitt mal Länge',
        content: `Gräben für Drainage, Leitungen oder Fundamente sind im Querschnitt meist Trapeze: unten die schmale Sohle, oben die breitere Öffnung. Ein Graben mit 0,40 m Sohle, 1,00 m oberer Breite und 0,80 m Tiefe hat ${f(graben, 2)} m² Querschnitt. Auf 15 m Länge fallen damit ${f(grabenM3, 2)} m³ Aushub an.\n\nGelöster Boden nimmt mehr Raum ein als im gewachsenen Zustand. Planen Sie Container und Abfuhr deshalb großzügiger als das reine Grabenvolumen; tiefe Gräben müssen nach den Arbeitsschutzregeln geböscht oder verbaut werden.`,
      },
    ],
    faqs: [
      {
        question: 'Wie lang sind die Schenkel eines gleichschenkligen Trapezes?',
        answer: `Jeder Schenkel ist die Hypotenuse eines rechtwinkligen Dreiecks aus Höhe h und Überstand (a − c) / 2: Schenkel = √(h² + ((a − c)/2)²). Bei a = 12 cm, c = 8 cm und h = 5 cm sind das √29 = ${f(schenkelStandard, 2)} cm; die Voreinstellung des Rechners nutzt gerundet 5,4 cm. Ein Schenkel kürzer als die Höhe ist geometrisch unmöglich; der Rechner prüft das nicht, sondern addiert die Eingaben nur zum Umfang.`,
      },
      {
        question: 'Wie berechne ich die Höhe, wenn Fläche und beide Grundseiten bekannt sind?',
        answer: `Formel umstellen: h = 2 · A / (a + c). Ein trapezförmiges Grundstück mit 450 m² und parallelen Grenzen von 28 m und 17 m ist ${f(trapezHoehe, 2)} m tief. Mit diesen Werten zeigt der Rechner wieder ${f(trapezProbe, 0)} m² an.`,
      },
    ],
  },

  'sechseck-polygon-rechner': {
    sections: [
      {
        title: 'Sechseckplatten und Wabenfliesen: Stück pro Quadratmeter',
        content: `Sechseckige Fliesen, Pflastersteine und Rasenwaben schließen lückenlos aneinander. Wie viele Sie brauchen, folgt direkt aus der Fläche einer Platte:\n\n${sechseckTabelle}\n\nDie Fugen verringern die Stückzahl etwas. Am Rand fallen dafür Zuschnitte an, die sich selten wiederverwenden lassen; wie viel Reserve sinnvoll ist, hängt vom Verlegemuster und der Raumform ab.`,
      },
      {
        title: 'Welches Maß haben Sie gemessen? Kante, Schlüsselweite oder Eckmaß',
        content: `Händler geben Sechsecke unterschiedlich an. Der Rechner braucht die Kantenlänge a, die Sie aus jedem der drei Maße ableiten können:\n\n- **Kantenlänge:** eine einzelne Seite, direkt eingeben\n- **Schlüsselweite** (Abstand zweier paralleler Seiten): a = Schlüsselweite / √3\n- **Eckmaß** (Abstand zweier gegenüberliegender Ecken): a = Eckmaß / 2\n\nBeispiel Hochbeet: Ein sechseckiges Beet mit 3,00 m Eckmaß hat a = 1,50 m und eine Grundfläche von ${f(hochbeetM2, 2)} m². Bei 40 cm Füllhöhe passen ${f(hochbeetLiter, 0)} Liter Erde hinein.`,
      },
    ],
    faqs: [
      {
        question: 'Ist M10 bei einer Sechskantschraube die Seitenlänge?',
        answer: `Nein. M10 bezeichnet den Gewindedurchmesser von 10 mm. Der Schraubenkopf hat je nach Norm Schlüsselweite 16 oder 17 mm. Daraus ergibt sich eine Kantenlänge von ${f(num(sw16, 'circumradius'), 2)} mm (SW 16) beziehungsweise ${f(num(sw17, 'circumradius'), 2)} mm (SW 17); der Rechner bestätigt mit diesen Kanten die Schlüsselweiten ${f(num(sw16, 'wrenchSize'), 1)} und ${f(num(sw17, 'wrenchSize'), 1)} mm.`,
      },
      {
        question: 'Gilt der Rechner auch für Fünfecke oder Achtecke?',
        answer: 'Nein, er rechnet nur das regelmäßige Sechseck. Für ein beliebiges regelmäßiges Vieleck mit n Ecken gilt A = n · a² / (4 · tan(180° / n)). Ein Fünfeck hat damit etwa 1,720 · a², ein Achteck etwa 4,828 · a². Beim Achteck mit 1 m Kantenlänge, etwa einem Pavillon, sind das 4,83 m².',
      },
    ],
  },

  'kegel-volumen-rechner': {
    sections: [
      {
        title: 'Schüttkegel ausmessen, ohne auf den Haufen zu steigen',
        content: `Bei einem Kies-, Sand- oder Mulchhaufen kommt man an die Höhe in der Mitte kaum heran. Messen Sie stattdessen außen:\n\n1. **Umfang am Fuß** mit dem Maßband, Beispiel 9,40 m. Radius r = Umfang / (2π) = ${f(haufenR, 1)} cm.\n2. **Über die Spitze** von Fuß zu Fuß messen, Beispiel 4,20 m. Die Hälfte ist die Mantellinie s = 210 cm.\n3. **Höhe** h = √(s² − r²) = ${f(haufenH, 1)} cm.\n4. Radius und Höhe in den Rechner: ${f(num(haufen, 'volume'), 0)} cm³, also ${f(haufenM3, 2)} m³. Die Mantellinie im Ergebnis zeigt zur Kontrolle wieder ${f(num(haufen, 'slantHeight'), 0)} cm.\n\nMit dem Richtwert von etwa 1,6 t/m³ für losen Kies 16/32 sind das rund ${f(haufenTonnen, 1)} t; die Schüttdichte laut Lieferschein geht vor. Echte Haufen sind selten perfekte Kegel, rechnen Sie daher mit einer Abweichung von einigen Prozent. Gewicht für andere Materialien liefert der [Kies- und Splitt-Rechner](/rechner/kies-splitt-rechner/).`,
      },
      {
        title: 'Kegelmantel zuschneiden: Partyhut, Trichter, Blechhaube',
        content: `Rollt man den Mantel eines Kegels flach aus, entsteht ein Kreisausschnitt mit dem Radius s (Mantellinie) und dem Winkel θ = 360° · r / s.\n\n- **Partyhut** mit r = 6 cm und h = 8 cm: s = ${f(hutS, 2)} cm, Ausschnittwinkel ${f(hutWinkel, 1)}°. Die Fläche des Zuschnitts entspricht der Mantelfläche von ${f(num(hut, 'mantle'), 1)} cm².\n- **Trichter** mit 20 cm Öffnung und 15 cm Tiefe: s = ${f(trichterS, 2)} cm, Ausschnittwinkel ${f(trichterWinkel, 1)}°, Mantelfläche ${f(num(trichter, 'mantle'), 0)} cm².\n\nZeichnen Sie mit einer Schnur der Länge s einen Kreisbogen, tragen Sie den Winkel mit dem Geodreieck ab und geben Sie 1 bis 2 cm Klebe- oder Falzlasche dazu.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel passt in eine kegelförmige Spitztüte?',
        answer: `Eine Tüte mit 5 cm Öffnungsdurchmesser (r = 2,5 cm) und 12 cm Tiefe fasst ${f(num(tuete, 'volume'), 1)} cm³, also rund ${f(num(tuete, 'volume'), 0)} ml. Ein gleich großer Becher mit geraden Wänden fasst dreimal so viel.`,
      },
      {
        question: 'Wie berechne ich den Öffnungswinkel eines Kegels?',
        answer: `Öffnungswinkel = 2 · arctan(r / h). Beim Kegel mit r = 6 cm und h = 8 cm sind das ${f(oeffnung, 2)}°. Der Winkel ist wichtig bei Trichtern und Silos: Je spitzer, desto besser rutscht das Material nach.`,
      },
      {
        question: 'Was mache ich, wenn der Kegel oben abgeschnitten ist?',
        answer: 'Eimer, Blumentöpfe und Lampenschirme haben oben und unten einen Kreis, aber keine Spitze. Das ist ein Kegelstumpf, und dafür gibt es eine eigene Formel mit beiden Radien. Rechnen Sie solche Formen mit dem [Kegelstumpf-Rechner](/rechner/stumpf-kegel-rechner/).',
      },
    ],
  },

  'parallelogramm-rechner': {
    sections: [
      {
        title: 'Rahmen auf Rechtwinkligkeit prüfen: Diagonalen vergleichen',
        content: `Ein Rahmen, der nicht ganz rechtwinklig ist, ist ein Parallelogramm. Das betrifft Terrassen-Unterkonstruktionen, Schalungen, Gartenhaus-Grundrisse und Regale, die sich verschoben haben. Bei einem Rechteck sind beide Diagonalen gleich lang; schon kleine Winkelfehler machen sie ungleich. Werte für einen Rahmen von 200 × 120 cm:\n\n${rahmenTabelle}\n\nSchon 1° Abweichung macht ${f(rahmen89Diff, 1)} cm Unterschied zwischen den Diagonalen, die Fläche ändert sich dagegen kaum. Messen Sie deshalb beim Aufbau beide Diagonalen und schieben Sie den Rahmen, bis die Maße gleich sind.`,
      },
      {
        title: 'Warum die Seite b nicht die Höhe ist',
        content: `Die Fläche hängt von der senkrechten Höhe ab, und die schrumpft mit dem Winkel. Seiten 10 und 6 cm bei verschiedenen Winkeln:\n\n${schiefTabelle}\n\nBei 30° ist die Fläche nur noch halb so groß wie beim Rechteck mit denselben Seiten. Wer bei einer schrägen Fläche, etwa einem Grundstück oder einer schief zugeschnittenen Platte, einfach Seite mal Seite rechnet, überschätzt die Fläche.`,
      },
    ],
    faqs: [
      {
        question: 'Wie berechne ich den Winkel, wenn ich Höhe und Seite kenne?',
        answer: `α = arcsin(h_a / b). Bei b = 6 cm und gemessener Höhe h_a = 4,5 cm ist α = ${f(ausHoehe, 2)}°. Mit a = 10 cm ergibt der Rechner dann eine Fläche von ${f(num(ausHoeheProbe, 'area'), 2)} cm², also genau a · h_a.`,
      },
      {
        question: 'Sind Raute und Rechteck auch Parallelogramme?',
        answer: 'Ja, beide sind Sonderfälle. Beim Rechteck sind alle Winkel 90°, bei der Raute sind alle vier Seiten gleich lang, beim Quadrat gilt beides. Für eine Raute können Sie hier a = b eingeben; kennen Sie nur ihre Diagonalen, ist der [Raute-Rechner](/rechner/rhombus-raute-rechner/) einfacher.',
      },
    ],
  },

  'goldener-schnitt-rechner': {
    sections: [
      {
        title: 'Typische Maße im Goldenen Schnitt',
        content: `Der Teilungspunkt liegt beim Major-Maß, gemessen von einem Ende. Weil man von links oder rechts messen kann, gibt es auf jeder Strecke zwei mögliche Punkte.\n\n${goldTabelle}\n\nBeim Regal bedeutet das: Ein Fachboden ${f(num(goldenerSchnitt({ calcMode: 'total', inputLength: 180 }), 'minor'), 1)} cm unter der Oberkante oder ebenso weit über dem Boden teilt die Höhe im Goldenen Schnitt.`,
      },
      {
        title: 'Fibonacci-Zahlen als Faustregel',
        content: `Ohne Taschenrechner kommen Sie mit Verhältnissen aufeinanderfolgender Fibonacci-Zahlen nah an Φ heran. Ab 8 : 13 liegt die Abweichung unter einem halben Prozent, was mit bloßem Auge nicht zu unterscheiden ist:\n\n${fiboTabelle}\n\nDass berühmte Bauwerke oder Gemälde bewusst nach dem Goldenen Schnitt angelegt wurden, lässt sich in vielen Fällen nicht belegen. Als Gestaltungshilfe funktioniert die Proportion trotzdem, so wie die einfachere Drittel-Regel.`,
      },
    ],
    faqs: [
      {
        question: 'Wo liegen die Linien des Goldenen Schnitts auf einem Foto mit 6.000 × 4.000 Pixeln?',
        answer: `Senkrecht bei ${f(num(fotoBreite, 'minor'), 0)} px und ${f(num(fotoBreite, 'major'), 0)} px vom linken Rand, waagerecht bei ${f(num(fotoHoehe, 'minor'), 0)} px und ${f(num(fotoHoehe, 'major'), 0)} px von oben. Die Drittel-Regel setzt die Linien bei 2.000 und 4.000 px beziehungsweise 1.333 und 2.667 px, also deutlich weiter außen.`,
      },
      {
        question: 'Wie berechne ich ein goldenes Rechteck?',
        answer: `Die lange Seite ist die kurze Seite mal Φ. Wählen Sie im Rechner „Minor gegeben“ und geben Sie die kurze Seite ein. Eine Tischplatte mit 90 cm Tiefe sollte demnach ${f(num(tischplatte, 'major'), 1)} cm lang sein.`,
      },
    ],
  },

  zylinderrechner: {
    sections: [
      {
        title: 'Wasserinhalt von Pools, Regentonnen und Schachtringen',
        content: `Für runde Behälter geben Sie den halben Innendurchmesser als Radius und die tatsächliche Füllhöhe als Höhe ein, jeweils in Zentimetern. Dann ist das Volumen in cm³ gleich Milliliter, durch 1.000 geteilt ergibt es Liter. Die Maße in der Tabelle sind Beispiele:\n\n${zylinderTabelle}\n\nDie letzte Spalte ist praktisch für Markierungen: Bei der Regentonne entspricht jeder Zentimeter Wasserstand ${f(num(zylinder({ radius: 30, height: 1 }), 'baseArea') / 1000, 2)} Litern, beim großen Aufstellpool ${f(num(zylinder({ radius: 228.5, height: 1 }), 'baseArea') / 1000, 0)} Litern. Damit lässt sich aus dem Wasserstand ablesen, wie viel nachgefüllt oder verbraucht wurde.`,
      },
      {
        title: 'Typische Fehler beim Zylindervolumen',
        content: `- **Durchmesser statt Radius eingegeben:** Das Ergebnis wird viermal zu groß. Eine Regentonne mit 60 cm Durchmesser und 90 cm Füllhöhe fasst ${f(tonneRichtig, 0)} Liter; mit 60 als Radius zeigt der Rechner ${f(tonneFalsch, 0)} Liter.\n- **Außenmaß statt Innenmaß:** Bei dicken Wänden, etwa Betonringen, zählt nur der Innendurchmesser.\n- **Wandhöhe statt Füllhöhe:** Pools werden nie bis zum Rand gefüllt; messen Sie den geplanten Wasserstand.\n- **Liegender Behälter:** Bei einem liegenden Tank ist der Füllstand nicht proportional zur Höhe. Dafür gibt es den [Kreissegment-Rechner](/rechner/kreissegment-rechner/).`,
      },
    ],
    faqs: [
      {
        question: 'Wie hoch muss ein runder Behälter für eine bestimmte Literzahl sein?',
        answer: `Höhe = Volumen / (π · r²), alles in Zentimetern. Sollen 300 Liter (300.000 cm³) in eine Tonne mit 60 cm Innendurchmesser passen, braucht sie ${f(zielHoehe, 1)} cm Füllhöhe. Mit dieser Höhe zeigt der Rechner ${f(zielProbe, 0)} Liter.`,
      },
      {
        question: 'Wie viel Folie oder Vlies brauche ich für Wand und Boden eines runden Pools?',
        answer: `Die Wand entspricht der Mantelfläche, der Boden der Grundfläche. Ein Pool mit 366 cm Durchmesser und 91 cm Wandhöhe hat ${f(num(poolWand, 'lateral') / 10000, 2)} m² Wand und ${f(num(poolWand, 'baseArea') / 10000, 2)} m² Boden. Für Überlappungen und den Rand oben kommt beim Zuschnitt etwas dazu.`,
      },
    ],
  },
};
