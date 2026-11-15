import { PageContentMap } from './types';
import { CalculationResult } from '@/types/calculator';
import { EXTRA_GESUNDHEIT_FAMILIE } from '../extra/gesundheitFamilie';
import { formatNumber } from '@/lib/formatters';

// ---------------------------------------------------------------------------
// Helpers: every number below is computed with the calculator's own engine at module load.
// ---------------------------------------------------------------------------
function run(slug: string, inputs: Record<string, any>): CalculationResult {
  const calc = EXTRA_GESUNDHEIT_FAMILIE.find((c) => c.slug === slug);
  if (!calc || !calc.calculate) throw new Error(`page-content/gesundheit: calculator ${slug} not found`);
  return calc.calculate(inputs) as CalculationResult;
}
function num(r: CalculationResult, id: string): number {
  if (r.primary.id === id) return Number(r.primary.value);
  return Number(r.secondary?.find((s) => s.id === id)?.value ?? NaN);
}
function txt(r: CalculationResult, id: string): string {
  if (r.primary.id === id) return String(r.primary.formattedValue);
  return String(r.secondary?.find((s) => s.id === id)?.formattedValue ?? '');
}
const n = formatNumber;
const kcal0 = (v: number) => `${n(v, 0)} kcal`;

// ---------------------------------------------------------------------------
// Schwimmen
// ---------------------------------------------------------------------------
const SW = 'schwimmen-kalorienverbrauch-rechner';
const sw = (w: number, min: number, style: string) => run(SW, { bodyWeightKg: w, durationMinutes: min, strokeStyle: style });
const SW_STYLES: Array<[string, string]> = [
  ['breaststroke_moderate', 'Brust moderat'],
  ['backstroke', 'Rücken'],
  ['breaststroke_fast', 'Brust zügig'],
  ['freestyle_moderate', 'Kraul moderat'],
  ['freestyle_fast', 'Kraul schnell'],
  ['butterfly', 'Delfin / Schmetterling'],
];
const SW_TABLE = SW_STYLES.map(
  ([v, label]) => `| ${label} | ${n(num(sw(60, 30, v), 'met'), 1, 1)} | ${[60, 75, 90].map((w) => kcal0(num(sw(w, 30, v), 'burnedKcal'))).join(' | ')} |`,
).join('\n');
const SW_LAPS_30 = num(sw(72, 30, 'breaststroke_moderate'), 'burnedKcal');
const SW_LAPS_45 = num(sw(72, 45, 'breaststroke_moderate'), 'burnedKcal');
const SW_KM_BRUST = num(sw(72, 30, 'breaststroke_moderate'), 'burnedKcal');
const SW_KM_KRAUL = num(sw(72, 25, 'freestyle_moderate'), 'burnedKcal');
const swMinutesFor = (target: number, style: string) => (target / num(sw(72, 60, style), 'kcalPerHour')) * 60;
const SW_EX = sw(80, 35, 'freestyle_moderate');

// ---------------------------------------------------------------------------
// Makronährstoffe
// ---------------------------------------------------------------------------
const MK = 'makronaehrstoff-verteilung-rechner';
const mk = (kcal: number, goal: string) => run(MK, { targetCalories: kcal, dietGoal: goal });
const MK_GOALS = ['balanced', 'muscle', 'lowcarb', 'keto'];
const mkCell = (kcal: number, goal: string) => {
  const r = mk(kcal, goal);
  return `${n(num(r, 'protGrams'), 0)} / ${n(num(r, 'carbGrams'), 0)} / ${n(num(r, 'fatGrams'), 0)} g`;
};
const MK_TABLE = [1600, 2000, 2500, 3000].map((k) => `| ${n(k, 0)} kcal | ${MK_GOALS.map((g) => mkCell(k, g)).join(' | ')} |`).join('\n');
const MK_BAL = mk(2000, 'balanced');
// Lebensmittel-Etiketten (LMIV, Anhang XIV) rechnen mit 4 kcal je g Eiweiß/Kohlenhydrate und 9 kcal je g Fett.
const MK_PROT_LABEL = (2000 * 0.25) / 4;
const MK_FAT_LABEL = (2000 * 0.25) / 9;
const MK_MUSCLE_2500 = num(mk(2500, 'muscle'), 'protGrams');
const MK_LOWCARB_2000 = num(mk(2000, 'lowcarb'), 'protGrams');
const MK_KETO = [1800, 2000, 2500].map((k) => n(num(mk(k, 'keto'), 'carbGrams'), 0));

// ---------------------------------------------------------------------------
// Schritte
// ---------------------------------------------------------------------------
const ST = 'schritt-distanz-kalorien-rechner';
const st = (steps: number, h: number, w: number) => run(ST, { stepsCount: steps, heightCm: h, weightKg: w });
const ST_TABLE = [155, 165, 175, 185, 195]
  .map((h) => {
    const r = st(10000, h, 70);
    return `| ${h} cm | ${txt(r, 'stepLengthCm')} | ${n(num(r, 'stepsPerKm'), 0)} | ${txt(r, 'distanceKm')} | ${kcal0(num(r, 'burnedKcal'))} |`;
  })
  .join('\n');
const stPerKm = (h: number) => n(num(st(10000, h, 70), 'stepsPerKm'), 0);
const ST_5KM_175 = 5 * num(st(10000, 175, 75), 'stepsPerKm');
const ST_EX = st(6000, 162, 58);

// ---------------------------------------------------------------------------
// Blutdruck
// ---------------------------------------------------------------------------
const BP = 'blutdruck-klassifikation-rechner';
const bp = (s: number, d: number) => txt(run(BP, { systolicMmHg: s, diastolicMmHg: d }), 'category');
const BP_SAMPLES: Array<[number, number]> = [
  [118, 76],
  [127, 83],
  [134, 82],
  [126, 87],
  [148, 88],
  [152, 78],
  [124, 94],
  [166, 98],
  [174, 104],
  [186, 105],
];
const BP_TABLE = BP_SAMPLES.map(([s, d]) => `| ${s} / ${d} mmHg | ${bp(s, d)} |`).join('\n');

// ---------------------------------------------------------------------------
// One-Rep-Max
// ---------------------------------------------------------------------------
const RM = 'one-rep-max-rechner';
const rm = (w: number, reps: number) => run(RM, { liftedWeightKg: w, repsCount: reps });
const RM_REPS = [2, 3, 4, 5, 6, 8, 10, 12, 15];
const RM_TABLE = RM_REPS.map((reps) => {
  const r = rm(100, reps);
  const diff = num(r, 'epley') - num(r, 'brzycki');
  return `| ${reps} | ${txt(r, 'epley')} | ${txt(r, 'brzycki')} | ${n(num(r, 'avg1Rm'), 1)} kg | ${Math.abs(diff) < 0.05 ? '≈ 0' : `${diff > 0 ? '+' : '−'}${n(Math.abs(diff), 1)}`} kg |`;
}).join('\n');
const RM_DIFF_10 = Math.abs(num(rm(100, 10), 'epley') - num(rm(100, 10), 'brzycki'));
const RM_DIFF_15 = num(rm(100, 15), 'brzycki') - num(rm(100, 15), 'epley');
const RM_BASE = num(rm(80, 6), 'avg1Rm');
const round25 = (v: number) => Math.round(v / 2.5) * 2.5;
const RM_PCT_TABLE = [60, 70, 75, 80, 85, 90]
  .map((p) => `| ${p} % | ${n((RM_BASE * p) / 100, 1)} kg | ${n(round25((RM_BASE * p) / 100), 1)} kg |`)
  .join('\n');
const RM_3 = rm(100, 3);
const RM_12 = rm(100, 12);
const RM_20 = rm(50, 20);
const RM_EX = rm(100, 3);

// ---------------------------------------------------------------------------
// Alkoholabbau
// ---------------------------------------------------------------------------
const AL = 'alkohol-abbau-rechner';
const al = (g: number, gender: string) => run(AL, { pureAlcoholGrams: g, gender });
const gramsOf = (ml: number, vol: number) => (ml * vol * 0.8) / 100;
const AL_DRINKS: Array<[string, number, number]> = [
  ['Bier 0,33 l (5 %)', 330, 5],
  ['Bier 0,5 l (5 %)', 500, 5],
  ['Wein 0,2 l (12 %)', 200, 12],
  ['Sekt 0,1 l (11 %)', 100, 11],
  ['Schnaps 2 cl (40 %)', 20, 40],
  ['Longdrink mit 4 cl (40 %)', 40, 40],
];
const AL_TABLE = AL_DRINKS.map(([label, ml, vol]) => {
  const g = gramsOf(ml, vol);
  return `| ${label} | ${n(g, 1)} g | ${n(num(al(g, 'male'), 'hoursNeeded'), 1)} h | ${n(num(al(g, 'female'), 'hoursNeeded'), 1)} h |`;
}).join('\n');
const AL_LITER_M = num(al(gramsOf(1000, 5), 'male'), 'hoursNeeded');
const AL_LITER_F = num(al(gramsOf(1000, 5), 'female'), 'hoursNeeded');
const AL_EX_G = 2 * gramsOf(200, 12);
const AL_EX = al(AL_EX_G, 'female');

// ---------------------------------------------------------------------------
// Intervallfasten
// ---------------------------------------------------------------------------
const IF = 'intervallfasten-16-8-rechner';
const ifw = (start: number, ratio: string) => txt(run(IF, { firstMealHour: start, fastingRatio: ratio }), 'eatingWindow');
const IF_TABLE = [8, 10, 12, 14].map((h) => `| ${h < 10 ? '0' + h : h}:00 Uhr | ${['14_10', '16_8', '18_6'].map((m) => ifw(h, m)).join(' | ')} |`).join('\n');
const IF_EX = run(IF, { firstMealHour: 9, fastingRatio: '14_10' });

// ---------------------------------------------------------------------------
// Radfahren
// ---------------------------------------------------------------------------
const RF = 'radfahren-kalorien-watt-rechner';
const rf = (w: number, min: number, level: string) => run(RF, { bodyWeightKg: w, durationMinutes: min, cyclingIntensity: level });
const RF_LEVELS: Array<[string, string, string]> = [
  ['leisure', 'Gemütlich', 'ca. 15 km/h'],
  ['moderate', 'Moderat / Alltag', 'ca. 16–19 km/h'],
  ['fast', 'Zügig', 'ca. 25 km/h'],
  ['racing', 'Rennrad schnell', 'ca. 30 km/h'],
];
const rfMet = (level: string) => num(rf(75, 60, level), 'burnedPerHour') / 75;
const RF_TABLE = RF_LEVELS.map(
  ([v, label, speed]) => `| ${label} | ${speed} | ${n(rfMet(v), 1, 1)} | ${[60, 75, 90].map((w) => kcal0(num(rf(w, 60, v), 'burnedPerHour'))).join(' | ')} |`,
).join('\n');
// Physik: 1 W über 1 h = 3,6 kJ mechanische Arbeit; 1 kcal = 4,184 kJ; Muskelwirkungsgrad ca. 20–25 %.
const wattKcal = (watt: number, eff: number) => (watt * 3.6) / 4.184 / eff;
const RF_WATT_TABLE = [100, 150, 200, 250]
  .map((w) => `| ${w} W | ${n(w * 3.6, 0)} kJ | ${kcal0(wattKcal(w, 0.25))} | ${kcal0(wattKcal(w, 0.2))} |`)
  .join('\n');
const RF_75 = RF_LEVELS.map(([v]) => kcal0(num(rf(75, 60, v), 'burnedKcal')));
// E-Bike-MET laut Compendium of Physical Activities 2024 (Codes 01080, 01084, 01088)
const EBIKE = [
  ['ohne Motorunterstützung', 6.8],
  ['mit leichter Unterstützung', 6.0],
  ['mit starker Unterstützung', 4.0],
] as const;
const RF_EX = rf(68, 90, 'fast');

// ---------------------------------------------------------------------------
// Proteinbedarf
// ---------------------------------------------------------------------------
const PR = 'proteinbedarf-sportler-rechner';
const pr = (w: number, type: string) => run(PR, { bodyWeightKg: w, activityType: type });
const PR_TYPES = ['sedentary', 'endurance', 'hypertrophy', 'diet_cut'];
const prRange = (w: number, t: string) => txt(pr(w, t), 'range').replace(' g/Tag', ' g');
const PR_TABLE = [55, 65, 75, 85, 95].map((w) => `| ${w} kg | ${PR_TYPES.map((t) => prRange(w, t)).join(' | ')} |`).join('\n');
const PR_70_SED = pr(70, 'sedentary');
const PR_MEAL_60E = num(pr(60, 'endurance'), 'perMeal');
const PR_MEAL_90D = num(pr(90, 'diet_cut'), 'perMeal');
const PR_EX = pr(62, 'endurance');

// ---------------------------------------------------------------------------
// Koffein
// ---------------------------------------------------------------------------
const KF = 'koffein-halbwertszeit-rechner';
const kf = (drink: string, servings: number, hours: number) => run(KF, { drinkType: drink, servingsCount: servings, hoursUntilBed: hours });
const KF_DRINKS = ['filter_coffee', 'double_espresso', 'energy_drink', 'cola'];
const KF_TABLE = [2, 4, 6, 8, 10, 12]
  .map((h) => `| nach ${h} Stunden | ${KF_DRINKS.map((d) => `${n(num(kf(d, 1, h), 'remainingMg'), 0)} mg`).join(' | ')} |`)
  .join('\n');
const kfMg = (drink: string) => num(kf(drink, 1, 1), 'initialMg');
const KF_FILTER = kfMg('filter_coffee');
const KF_ESPRESSO = kfMg('espresso');
const KF_ENERGY = kfMg('energy_drink');
const KF_24H = num(kf('filter_coffee', 1, 24), 'remainingMg');
const KF_EX = kf('energy_drink', 2, 8);

export const GESUNDHEIT_PAGE_CONTENT: PageContentMap = {
  'schwimmen-kalorienverbrauch-rechner': {
    sections: [
      {
        title: 'Kalorien pro 30 Minuten nach Schwimmstil und Körpergewicht',
        content: `So viel gibt der Rechner für eine halbe Stunde reine Schwimmzeit aus:\n\n| Schwimmstil | MET | 60 kg | 75 kg | 90 kg |\n|---|---|---|---|---|\n${SW_TABLE}\n\nBrust zügig und Kraul moderat haben denselben MET-Wert und damit denselben Verbrauch. Das Compendium of Physical Activities, an dessen Durchschnittswerten sich der Rechner orientiert, unterscheidet beim Brust- und Rückenschwimmen nur grob zwischen Freizeittempo (rund 5 MET) und Trainingstempo (rund 10 MET). Die Stufen „Brust zügig“ und „Rücken“ liegen bewusst dazwischen. Wer sehr gemächlich mit dem Kopf über Wasser schwimmt, verbraucht eher weniger als in der Tabelle.`,
      },
      {
        title: 'Von gezählten Bahnen zur richtigen Schwimmdauer',
        content: `Der Rechner fragt nach Minuten, nicht nach Bahnen. So kommen Sie von Ihrer Bahnenzahl zur passenden Eingabe:\n\n1. **Strecke ermitteln:** Bahnen × Beckenlänge. 40 Bahnen im 25-m-Becken sind 1.000 m; im 50-m-Becken genügen dafür 20 Bahnen.\n2. **Eigenes Tempo messen:** Stoppen Sie einmal die Zeit für 100 m, im 25-m-Becken also 4 Bahnen.\n3. **Schwimmzeit ausrechnen:** Strecke in Metern / 100 × Zeit pro 100 m. Bei 3 Minuten pro 100 m dauern 1.000 m genau 30 Minuten.\n4. **Pausen weglassen:** Die MET-Werte gelten für durchgehendes Schwimmen. Die Verschnaufpause am Beckenrand gehört nicht in die Eingabe.\n\nBeispiel mit 72 kg und moderatem Brustschwimmen: 30 Minuten reine Schwimmzeit ergeben ${kcal0(SW_LAPS_30)}. Wer stattdessen die 45 Minuten vom Betreten bis zum Verlassen des Beckens eingibt, erhält ${kcal0(SW_LAPS_45)} – also die Hälfte mehr, als tatsächlich geschwommen wurde.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viele Kalorien verbraucht man bei 1 km Schwimmen?',
        answer: `Das hängt vor allem davon ab, wie lange Sie für den Kilometer brauchen. Bei 72 kg und moderatem Brustschwimmen mit 3 Minuten pro 100 m (30 Minuten) rechnet der Rechner mit ${kcal0(SW_KM_BRUST)}. Wer denselben Kilometer moderat krault und dafür 25 Minuten braucht, kommt auf ${kcal0(SW_KM_KRAUL)}: Der höhere MET-Wert gleicht die kürzere Zeit mehr als aus.`,
      },
      {
        question: 'Wie lange muss ich schwimmen, um 300 kcal zu verbrauchen?',
        answer: `Bei 72 kg Körpergewicht sind es mit moderatem Brustschwimmen etwa ${n(swMinutesFor(300, 'breaststroke_moderate'), 0)} Minuten, mit moderatem Kraulen etwa ${n(swMinutesFor(300, 'freestyle_moderate'), 0)} Minuten und mit schnellem Kraulen etwa ${n(swMinutesFor(300, 'freestyle_fast'), 0)} Minuten – jeweils reine Schwimmzeit ohne Pausen. Schwerere Menschen erreichen den Wert schneller, leichtere brauchen länger.`,
      },
    ],
    workedExamples: [
      {
        title: 'Beispiel: 1.500 m Kraul in 35 Minuten bei 80 kg',
        description: '60 Bahnen im 25-m-Becken in gleichmäßigem, moderatem Kraultempo ohne längere Pausen.',
        inputValues: [
          { label: 'Gewicht', value: '80 kg' },
          { label: 'Dauer', value: '35 Minuten' },
          { label: 'Stil', value: 'Kraul moderat (MET 8,0)' },
        ],
        inputs: { bodyWeightKg: 80, durationMinutes: 35, strokeStyle: 'freestyle_moderate' },
        steps: [`8,0 × 80 kg × 35/60 h = ${n(num(SW_EX, 'burnedKcal'), 1)} kcal`],
        resultSummary: txt(SW_EX, 'burnedKcal'),
      },
    ],
  },

  'makronaehrstoff-verteilung-rechner': {
    sections: [
      {
        title: 'Gramm pro Tag für alle vier Verteilungen',
        content: `Jede Zelle zeigt **Eiweiß / Kohlenhydrate / Fett** in Gramm, berechnet mit den Brennwerten dieses Rechners (4,1 / 4,1 / 9,3 kcal pro Gramm):\n\n| Kalorienziel | Ausgewogen | Muskelaufbau | Low Carb | Keto |\n|---|---|---|---|---|\n${MK_TABLE}\n\nAuffällig ist, wie stark die Eiweißmenge mit dem Kalorienziel mitwächst, weil der Rechner mit festen Prozentanteilen arbeitet. Bei Keto verschiebt sich fast alles zum Fett; die Kohlenhydrate bleiben auch bei 3.000 kcal unter 40 g.`,
      },
      {
        title: 'Warum Ihre Tracking-App andere Grammzahlen zeigt',
        content: `- **Andere Brennwerte:** Nährwerttabellen auf Verpackungen und viele Apps rechnen nach EU-Lebensmittelinformationsverordnung mit 4 kcal pro Gramm Eiweiß und Kohlenhydrate und 9 kcal pro Gramm Fett. Bei 2.000 kcal und ausgewogener Verteilung ergibt das ${n(MK_PROT_LABEL, 0)} g statt ${n(num(MK_BAL, 'protGrams'), 0)} g Eiweiß und ${n(MK_FAT_LABEL, 0)} g statt ${n(num(MK_BAL, 'fatGrams'), 0)} g Fett. Die Abweichung ist klein; bleiben Sie einfach bei einem System.\n- **Eiweiß pro Kilogramm prüfen:** Prozentvorgaben können sehr hohe Mengen ergeben. „Muskelaufbau“ mit 2.500 kcal liefert ${n(MK_MUSCLE_2500, 0)} g Eiweiß, „Low Carb“ schon bei 2.000 kcal ${n(MK_LOWCARB_2000, 0)} g. Teilen Sie das Ergebnis durch Ihr Körpergewicht und vergleichen Sie es mit dem [Proteinbedarf-Rechner](/rechner/proteinbedarf-sportler-rechner/).\n- **Alkohol fehlt:** Alkohol liefert rund 7 kcal pro Gramm, gehört aber zu keinem der drei Makronährstoffe. Wer abends Bier oder Wein trinkt, verbraucht damit einen Teil des Kalorienziels, ohne dass es in der Aufteilung auftaucht.`,
      },
    ],
    faqs: [
      {
        question: 'Wie rechne ich Gramm in Prozent der Kalorien um?',
        answer: 'Gramm × Brennwert pro Gramm / Gesamtkalorien × 100. Mit den Werten dieses Rechners sind 150 g Eiweiß bei 2.000 kcal also 150 × 4,1 = 615 kcal und damit rund 31 % der Tageskalorien. Bei Fett rechnen Sie mit 9,3 statt 4,1.',
      },
      {
        question: 'Wie viele Gramm Kohlenhydrate bleiben bei Keto übrig?',
        answer: `Mit dem Keto-Anteil von 5 % sind es bei 1.800 kcal etwa ${MK_KETO[0]} g, bei 2.000 kcal ${MK_KETO[1]} g und bei 2.500 kcal ${MK_KETO[2]} g pro Tag. Dazu zählen auch die Kohlenhydrate aus Gemüse, Milchprodukten und Nüssen, nicht nur aus Brot, Nudeln oder Süßem.`,
      },
      {
        question: 'Welche Verteilung ist die beste zum Abnehmen?',
        answer: 'Eine allgemein beste Verteilung gibt es nicht. Studien, die Low-Carb- und fettarme Ernährung bei gleicher Kalorienmenge verglichen haben, fanden meist nur geringe Unterschiede. Wählen Sie die Verteilung, die Sie im Alltag dauerhaft durchhalten; wer Vorerkrankungen wie Diabetes hat, sollte größere Umstellungen ärztlich besprechen.',
      },
    ],
  },

  'schritt-distanz-kalorien-rechner': {
    sections: [
      {
        title: '10.000 Schritte nach Körpergröße',
        content: `Die Tabelle zeigt die Schätzung des Rechners für verschiedene Körpergrößen, die Kalorien jeweils für 70 kg Körpergewicht:\n\n| Größe | Schrittlänge | Schritte pro km | Strecke bei 10.000 Schritten | kcal bei 10.000 Schritten |\n|---|---|---|---|---|\n${ST_TABLE}\n\nZwischen 155 und 195 cm Körpergröße liegen bei gleicher Schrittzahl gut 1,5 km Unterschied. Wenn Sie Ihre eigene Schrittlänge ausgemessen haben und sie deutlich abweicht, rechnen Sie die Strecke besser von Hand: Schritte × eigene Schrittlänge.`,
      },
      {
        title: 'Was die Kalorienzahl bedeutet – und was nicht',
        content: `- **Nur der Mehrverbrauch:** Der Faktor von 0,52 kcal pro kg und km entspricht dem zusätzlichen Verbrauch beim Gehen mit knapp 5 km/h gegenüber Ruhe (laut Compendium of Physical Activities rund 3,5 MET, abzüglich 1 MET für den Ruhezustand). Ihren Grundumsatz verbrauchen Sie ohnehin.\n- **Nicht doppelt zählen:** Viele Fitnessarmbänder zeigen den Gesamtverbrauch des Tages inklusive Grundumsatz. Diese Zahl ist deshalb deutlich höher und nicht mit dem Ergebnis hier vergleichbar.\n- **Joggen und Bergauf:** Beim Laufen sind die Schritte länger als beim Gehen, der Rechner unterschätzt dann die Strecke. Treppen und Steigungen erhöhen den Verbrauch, ohne dass sich die Schrittzahl ändert.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viele Schritte sind 1 Kilometer?',
        answer: `Nach der Schrittlängen-Schätzung des Rechners braucht ein Mensch mit 165 cm etwa ${stPerKm(165)} Schritte für einen Kilometer, mit 175 cm etwa ${stPerKm(175)} und mit 185 cm etwa ${stPerKm(185)}. Kleine Schritte beim Bummeln erhöhen die Zahl, zügiges Gehen senkt sie.`,
      },
      {
        question: 'Wie viele Schritte brauche ich für 5 Kilometer?',
        answer: `Bei 175 cm Körpergröße rund ${n(Math.round(ST_5KM_175 / 100) * 100, 0)} Schritte. Größere Menschen kommen mit weniger aus, kleinere brauchen mehr; die Werte pro Kilometer lassen sich einfach mit 5 multiplizieren.`,
      },
    ],
    workedExamples: [
      {
        title: 'Beispiel: 6.000 Schritte bei 162 cm und 58 kg',
        description: 'Ein typischer Bürotag mit Arbeitsweg zu Fuß und einem kurzen Spaziergang in der Mittagspause.',
        inputValues: [
          { label: 'Schritte', value: '6.000' },
          { label: 'Größe', value: '162 cm' },
          { label: 'Gewicht', value: '58 kg' },
        ],
        inputs: { stepsCount: 6000, heightCm: 162, weightKg: 58 },
        steps: [
          `Schrittlänge = 162 × 0,425 = ${txt(ST_EX, 'stepLengthCm')}`,
          `Strecke = 6.000 × ${n(num(ST_EX, 'stepLengthCm') / 100, 4)} m = ${txt(ST_EX, 'distanceKm')}`,
          `Kalorien = ${n(num(ST_EX, 'distanceKm'), 2)} km × 58 kg × 0,52 = ${kcal0(num(ST_EX, 'burnedKcal'))}`,
        ],
        resultSummary: `${txt(ST_EX, 'distanceKm')} und ${txt(ST_EX, 'burnedKcal')}`,
      },
    ],
  },

  'blutdruck-klassifikation-rechner': {
    sections: [
      {
        title: 'Beispielwerte und ihre Einstufung',
        content: `So ordnet der Rechner typische Messwerte nach der ESH-Leitlinie 2023 ein:\n\n| Messung | Einstufung |\n|---|---|\n${BP_TABLE}\n\nEntscheidend ist immer der höher eingestufte Wert. Bei 126/87 wäre der obere Wert normal, der untere aber hoch-normal. Bei 124/94 reicht der untere Wert allein für Grad 1. Liegt nur der obere Wert ab 140 mmHg, spricht die Leitlinie von isolierter systolischer Hypertonie; der Grad richtet sich dann nach dem oberen Wert. Die Einstufung ist keine Diagnose: Dafür braucht es mehrere Messungen an verschiedenen Tagen.`,
      },
      {
        title: 'Zu Hause messen: strengere Grenze und richtige Technik',
        content: `Die Grenzwerte des Rechners gelten für die Messung in der Arztpraxis. Für den Durchschnitt mehrerer Messungen zu Hause gilt laut ESH bereits ab **135/85 mmHg** Bluthochdruck, weil die Werte in Ruhe zu Hause meist niedriger ausfallen. Ein Heim-Mittelwert von 137/84 mmHg, den der Rechner als „${bp(137, 84)}“ einordnet, ist deshalb schon auffällig.\n\nSo messen Sie verlässlich:\n\n1. Vorher 5 Minuten ruhig sitzen, Rücken angelehnt, Beine nicht übereinandergeschlagen.\n2. Manschette am Oberarm auf Herzhöhe, während der Messung nicht sprechen.\n3. Zweimal im Abstand von 1 bis 2 Minuten messen, morgens und abends.\n4. Das über mehrere Tage, am besten eine Woche lang, aufschreiben und den Mittelwert in den Rechner eingeben.\n\nHandgelenkgeräte reagieren empfindlicher auf eine falsche Armhaltung als Oberarmgeräte.`,
      },
    ],
    faqs: [
      {
        question: 'Ab welchem Blutdruck muss ich sofort zum Arzt?',
        answer: 'Werte ab 180 mmHg systolisch oder 110 mmHg diastolisch gehören zur Hypertonie Grad 3 und sollten umgehend ärztlich abgeklärt werden. Kommen Beschwerden wie Brustschmerz, Atemnot, Sehstörungen, Lähmungen, Sprachstörungen oder Verwirrtheit hinzu, wählen Sie den Notruf 112. Ohne Beschwerden zunächst einige Minuten ruhig sitzen und erneut messen.',
      },
      {
        question: 'Warum nennen manche Quellen 120/70 mmHg als neue Grenze?',
        answer: 'Die Leitlinie der European Society of Cardiology (ESC) von 2024 nutzt nur drei Stufen: nicht erhöht unter 120/70, erhöht von 120–139 / 70–89 und Hypertonie ab 140/90 mmHg. Die Grenze für Bluthochdruck ist also gleich geblieben. Dieser Rechner verwendet die feinere Einteilung der ESH-Leitlinie von 2023 mit optimal, normal, hoch-normal und drei Graden.',
      },
      {
        question: 'Ist ein hoher unterer Wert bei normalem oberem Wert bedenklich?',
        answer: `Ja, er zählt genauso. Eine Messung von 124/94 mmHg stuft der Rechner als „${bp(124, 94)}“ ein, weil der diastolische Wert über 90 mmHg liegt. Bestätigt sich ein erhöhter unterer Wert bei wiederholten Messungen, sollte er ärztlich angeschaut werden.`,
      },
    ],
  },

  'one-rep-max-rechner': {
    sections: [
      {
        title: 'Epley und Brzycki im direkten Vergleich',
        content: `Die beiden Formeln liefern je nach Wiederholungszahl unterschiedliche Schätzungen. Die Tabelle zeigt das für ein Trainingsgewicht von 100 kg:\n\n| Wdh. mit 100 kg | Epley | Brzycki | Mittelwert (Hauptergebnis) | Epley minus Brzycki |\n|---|---|---|---|---|\n${RM_TABLE}\n\nBis 9 Wiederholungen schätzt Epley höher. Bei 10 Wiederholungen sind beide praktisch gleich (Unterschied ${RM_DIFF_10 < 0.1 ? 'unter 0,1' : n(RM_DIFF_10, 1)} kg), darüber kippt das Verhältnis: Bei 15 Wiederholungen liegt Brzycki schon ${n(RM_DIFF_15, 1)} kg über Epley. Je weiter die beiden Werte auseinanderliegen, desto unsicherer ist die Schätzung – der Mittelwert ist dann nur ein Kompromiss.`,
      },
      {
        title: 'Vom 1RM zum Trainingsgewicht',
        content: `Aus 6 Wiederholungen mit 80 kg ergibt sich ein geschätztes 1RM von ${n(RM_BASE, 1)} kg. Daraus lassen sich Arbeitsgewichte ableiten, gerundet auf die übliche 2,5-kg-Abstufung:\n\n| Anteil vom 1RM | rechnerisch | gerundet |\n|---|---|---|\n${RM_PCT_TABLE}\n\nTypische Fehler, die das Ergebnis verfälschen:\n\n- **Satz nicht ausgereizt:** Die Formeln setzen voraus, dass kaum noch eine Wiederholung mehr möglich gewesen wäre. Wer nach 6 von möglichen 9 Wiederholungen aufhört, unterschätzt sein 1RM.\n- **Unsaubere Technik:** Halbe Kniebeugen oder abgefederte Bankdrück-Wiederholungen treiben die Zahl künstlich hoch.\n- **Übungen vermischen:** Das 1RM gilt nur für die getestete Übung. Werte aus der Langhantel-Kniebeuge lassen sich nicht auf die Beinpresse übertragen.`,
      },
    ],
    faqs: [
      {
        question: 'Welche Formel ist genauer, Epley oder Brzycki?',
        answer: `Keine ist grundsätzlich genauer; beide sind Schätzformeln. Bei 3 Wiederholungen mit 100 kg ergibt Epley ${txt(RM_3, 'epley')} und Brzycki ${txt(RM_3, 'brzycki')}, bei 12 Wiederholungen ${txt(RM_12, 'epley')} gegenüber ${txt(RM_12, 'brzycki')}. Der Rechner nimmt deshalb den Mittelwert. Am aussagekräftigsten ist ein Vergleich mit Ihren eigenen früheren Ergebnissen nach derselben Methode.`,
      },
      {
        question: 'Kann ich das 1RM auch aus 15 oder 20 Wiederholungen berechnen?',
        answer: `Rechnen ja, verlassen sollten Sie sich darauf nicht. Bei 20 Wiederholungen mit 50 kg schätzt Epley ${txt(RM_20, 'epley')}, Brzycki aber ${txt(RM_20, 'brzycki')}. Bei so vielen Wiederholungen entscheidet vor allem die Kraftausdauer. Für eine brauchbare Schätzung wählen Sie lieber ein Gewicht, das Sie 3 bis 8 Mal sauber bewältigen.`,
      },
    ],
    workedExamples: [
      {
        title: 'Beispiel: Kniebeuge mit 100 kg für 3 Wiederholungen',
        description: 'Ein schwerer Satz nach dem Aufwärmen, bei dem eine vierte Wiederholung gerade nicht mehr sauber möglich gewesen wäre.',
        inputValues: [
          { label: 'Gewicht', value: '100 kg' },
          { label: 'Wiederholungen', value: '3' },
        ],
        inputs: { liftedWeightKg: 100, repsCount: 3 },
        steps: [
          `Epley: 100 × (1 + 3/30) = ${txt(RM_EX, 'epley')}`,
          `Brzycki: 100 / (1,0278 − 0,0278 × 3) = ${txt(RM_EX, 'brzycki')}`,
          `Mittelwert = ${n(num(RM_EX, 'avg1Rm'), 1)} kg`,
        ],
        resultSummary: txt(RM_EX, 'avg1Rm'),
      },
    ],
  },

  'alkohol-abbau-rechner': {
    sections: [
      {
        title: 'Reinalkohol und Abbauzeit typischer Getränke',
        content: `Der Rechner braucht die Alkoholmenge in Gramm. Die Tabelle rechnet gängige Getränke um (Milliliter × Volumenprozent / 100 × 0,8 g/ml) und zeigt die Abbauzeit mit den Rechenwerten von 9 g pro Stunde für Männer und 7 g pro Stunde für Frauen:\n\n| Getränk | Reinalkohol | Abbau Männer | Abbau Frauen |\n|---|---|---|---|\n${AL_TABLE}\n\nDie Zeiten addieren sich: Drei Halbe Bier und ein Schnaps sind zusammen ${n(3 * gramsOf(500, 5) + gramsOf(20, 40), 1)} g. Starkbier, Craft-Beer oder Wein mit 14 % enthalten deutlich mehr Alkohol als die Standardwerte – schauen Sie auf das Etikett.`,
      },
      {
        title: 'Warum das Ergebnis keine Freigabe zum Autofahren ist',
        content: `- **Feste Durchschnittswerte:** Die tatsächliche Abbaurate schwankt von Mensch zu Mensch, im Blut meist zwischen 0,1 und 0,15 Promille pro Stunde. Bei 1,5 Promille dauert der vollständige Abbau damit 10 bis 15 Stunden.\n- **Vorsichtig rechnen:** Zählen Sie die Stunden ab dem letzten Glas, nicht ab dem ersten. So liegen Sie eher auf der sicheren Seite.\n- **Rechtliche Grenzen:** Ab 0,5 Promille im Blut oder 0,25 mg/l in der Atemluft ist Autofahren eine Ordnungswidrigkeit (§ 24a StVG). In der Probezeit und vor dem 21. Geburtstag gilt ein Alkoholverbot am Steuer (§ 24c StVG). Wer wegen Alkohol nicht mehr sicher fahren kann, macht sich auch unterhalb dieser Werte strafbar (§ 316 StGB).\n\nIm Zweifel bleibt das Auto stehen – auch am Morgen danach.`,
      },
    ],
    faqs: [
      {
        question: 'Wie lange dauert es, bis 1 Liter Bier abgebaut ist?',
        answer: `Ein Liter Bier mit 5 % enthält rund ${n(gramsOf(1000, 5), 0)} g Alkohol. Der Rechner kommt damit für Männer auf etwa ${n(AL_LITER_M, 1)} Stunden und für Frauen auf etwa ${n(AL_LITER_F, 1)} Stunden. Das ist eine grobe Schätzung; bei langsamerem Abbau kann es länger dauern.`,
      },
      {
        question: 'Helfen Kaffee, kalte Dusche oder Sport beim Ausnüchtern?',
        answer: 'Nein. Kaffee und kaltes Wasser können wacher machen, senken den Alkoholgehalt im Blut aber nicht. Auch Schwitzen beim Sport scheidet nur einen sehr kleinen Teil aus. Den Großteil baut die Leber in ihrem eigenen Tempo ab, und dafür hilft nur Zeit.',
      },
      {
        question: 'Wie viele Promille baut der Körper pro Stunde ab?',
        answer: 'Meist etwa 0,1 bis 0,15 Promille pro Stunde. Wer um Mitternacht 0,8 Promille hat, ist danach je nach persönlicher Rate erst nach etwa 5,3 bis 8 Stunden wieder bei 0,0 Promille – also frühestens gegen 5:20 Uhr, möglicherweise erst gegen 8:00 Uhr.',
      },
    ],
    workedExamples: [
      {
        title: 'Beispiel: Zwei Gläser Wein am Abend (Frau)',
        description: 'Zwei Gläser Weißwein à 0,2 l mit 12 % Alkohol zum Abendessen.',
        inputValues: [
          { label: 'Alkohol', value: `${n(AL_EX_G, 1)} g (2 × 0,2 l Wein mit 12 %)` },
          { label: 'Geschlecht', value: 'Weiblich' },
        ],
        inputs: { pureAlcoholGrams: AL_EX_G, gender: 'female' },
        steps: [
          `Reinalkohol = 2 × 200 ml × 12 / 100 × 0,8 g/ml = ${n(AL_EX_G, 1)} g`,
          `Abbauzeit = ${n(AL_EX_G, 1)} g / 7 g pro Stunde = ${n(num(AL_EX, 'hoursNeeded'), 1)} Stunden`,
        ],
        resultSummary: txt(AL_EX, 'hoursNeeded'),
      },
    ],
  },

  'intervallfasten-16-8-rechner': {
    sections: [
      {
        title: 'Essensfenster nach Startzeit und Methode',
        content: `Die Tabelle zeigt, was der Rechner bei verschiedenen ersten Mahlzeiten ausgibt:\n\n| Erste Mahlzeit | 14:10 | 16:8 | 18:6 |\n|---|---|---|---|\n${IF_TABLE}\n\nWer gern frühstückt, beginnt um 8:00 Uhr und muss bei 16:8 schon am Nachmittag fertig sein – das passt schlecht zu einem gemeinsamen Abendessen. Wer das Frühstück weglässt und um 12:00 Uhr startet, kann bis 20:00 Uhr essen. Für den Einstieg ist 14:10 leichter durchzuhalten.`,
      },
      {
        title: 'Planung im Alltag – und wer vorsichtig sein sollte',
        content: `- **Halbe Stunden selbst ergänzen:** Der Rechner arbeitet mit vollen Stunden. Beginnen Sie um 12:30 Uhr, geben Sie 12 ein und verschieben Sie Start und Ende jeweils um 30 Minuten.\n- **Feste Termine einplanen:** Legen Sie das Fenster so, dass die Mahlzeit, die Ihnen am wichtigsten ist (Familienessen, Kantine), sicher hineinfällt.\n- **Was Sie essen, zählt weiter:** Das Zeitfenster ersetzt keine ausgewogene Ernährung. Wer in acht Stunden mehr isst als sonst über den ganzen Tag, hat nichts gewonnen.\n- **Ärztliche Rücksprache:** Schwangere und Stillende, Kinder und Jugendliche, Menschen mit Untergewicht oder einer Essstörung in der Vorgeschichte sowie Diabetiker, die Insulin oder blutzuckersenkende Tabletten nehmen, sollten nicht ohne ärztlichen Rat fasten.`,
      },
    ],
    faqs: [
      {
        question: 'Zählt die Schlafenszeit zu den 16 Stunden?',
        answer: 'Ja. Bei einem Essensfenster von 12:00 bis 20:00 Uhr fallen bei acht Stunden Schlaf etwa die Hälfte der 16 Fastenstunden in die Nacht. Bewusst verzichten müssen Sie nur auf das Frühstück und auf Spätsnacks nach 20:00 Uhr.',
      },
      {
        question: 'Wie viele Mahlzeiten passen in das 8-Stunden-Fenster?',
        answer: 'Meist zwei, manchmal drei Mahlzeiten, etwa um 12:00, 16:00 und kurz vor 20:00 Uhr. Wichtig ist, dass die letzte Mahlzeit vor dem Ende des Fensters abgeschlossen ist – „bis 20:00 Uhr“ heißt also fertig gegessen, nicht erst anfangen.',
      },
      {
        question: 'Muss ich jeden Tag fasten?',
        answer: 'Nein, eine feste Pflicht gibt es nicht. Viele halten das Fenster an Werktagen ein und sind am Wochenende flexibler. Wer merkt, dass er sich schlapp fühlt, schlecht schläft oder in der Essenszeit Heißhunger bekommt, kann auf 14:10 zurückgehen.',
      },
    ],
    workedExamples: [
      {
        title: 'Beispiel: Sanfter Einstieg mit 14:10 ab 9:00 Uhr',
        description: 'Frühstück erst im Büro um 9:00 Uhr, Abendessen mit der Familie um 18:00 Uhr.',
        inputValues: [
          { label: 'Erste Mahlzeit', value: '09:00 Uhr' },
          { label: 'Methode', value: '14:10' },
        ],
        inputs: { firstMealHour: 9, fastingRatio: '14_10' },
        steps: ['09:00 Uhr + 10 Stunden = 19:00 Uhr', 'Fasten von 19:00 Uhr bis 09:00 Uhr am Folgetag (14 Stunden)'],
        resultSummary: `Essen ${txt(IF_EX, 'eatingWindow')}`,
      },
    ],
  },

  'radfahren-kalorien-watt-rechner': {
    sections: [
      {
        title: 'Kalorien pro Stunde nach Tempo und Körpergewicht',
        content: `So viel gibt der Rechner für eine Stunde Fahrt aus:\n\n| Stufe | Tempo | MET | 60 kg | 75 kg | 90 kg |\n|---|---|---|---|---|---|\n${RF_TABLE}\n\nDie Tempoangaben sind grobe Orientierung für ebene Strecken ohne starken Wind. Fahren Sie im Stadtverkehr mit vielen Ampelstopps, liegt der Durchschnitt meist eine Stufe tiefer, als das Tachometer beim Rollen anzeigt.`,
      },
      {
        title: 'Watt vom Ergometer oder Powermeter in Kalorien umrechnen',
        content: `Kennen Sie Ihre Durchschnittsleistung, können Sie den Verbrauch physikalisch abschätzen: Ein Watt über eine Stunde sind 3,6 kJ Arbeit an der Kurbel. Da die Muskeln nur etwa 20 bis 25 % der Energie in Bewegung umsetzen, ist der Verbrauch rund vier- bis fünfmal so hoch:\n\n**kcal = Watt × Stunden × 3,6 / 4,184 / Wirkungsgrad**\n\n| Leistung (1 Stunde) | Arbeit | kcal bei 25 % | kcal bei 20 % |\n|---|---|---|---|\n${RF_WATT_TABLE}\n\nFaustregel: Zeigt Ihr Radcomputer die Arbeit in kJ an, entspricht diese Zahl ungefähr den verbrauchten kcal. Wer lieber diesen Rechner nutzt, kann sich am Compendium of Physical Activities 2024 orientieren: 101–125 W auf dem Ergometer entsprechen dort MET 6,8 (Stufe „Moderat“), 151–199 W rund MET 10 (Stufe „Zügig“) und 230–250 W rund MET 12 (Stufe „Rennrad schnell“).`,
      },
    ],
    faqs: [
      {
        question: 'Wie viele Kalorien verbrennt man bei einer Stunde Radfahren?',
        answer: `Bei 75 kg rechnet der Rechner mit ${RF_75[0]} für gemütliches Fahren, ${RF_75[1]} im Alltagstempo, ${RF_75[2]} bei zügiger Fahrt und ${RF_75[3]} auf dem schnellen Rennrad. Leichtere Menschen verbrauchen bei gleichem Tempo weniger, schwerere mehr.`,
      },
      {
        question: 'Verbraucht man auf dem E-Bike weniger Kalorien?',
        answer: `Ja, abhängig von der Unterstützungsstufe. Das Compendium of Physical Activities 2024 nennt für das E-Bike ${EBIKE.map(([l, m]) => `${l} MET ${n(m, 1, 1)}`).join(', ')}. Bei 75 kg und einer Stunde wären das der Reihe nach ${EBIKE.map(([, m]) => kcal0(m * 75)).join(', ')}. Mit starker Unterstützung entspricht das etwa der Stufe „Gemütlich“ dieses Rechners.`,
      },
    ],
    workedExamples: [
      {
        title: 'Beispiel: 90 Minuten zügige Feierabendrunde bei 68 kg',
        description: 'Eine Runde auf dem Trekkingrad mit rund 25 km/h Schnitt auf überwiegend flacher Strecke.',
        inputValues: [
          { label: 'Gewicht', value: '68 kg' },
          { label: 'Dauer', value: '90 Minuten' },
          { label: 'Tempo', value: 'Zügig, ca. 25 km/h (MET 10,0)' },
        ],
        inputs: { bodyWeightKg: 68, durationMinutes: 90, cyclingIntensity: 'fast' },
        steps: [`10,0 × 68 kg × 1,5 h = ${kcal0(num(RF_EX, 'burnedKcal'))}`],
        resultSummary: txt(RF_EX, 'burnedKcal'),
      },
    ],
  },

  'proteinbedarf-sportler-rechner': {
    sections: [
      {
        title: 'Tägliche Eiweißmenge nach Körpergewicht und Stufe',
        content: `Die Tabelle zeigt den Bereich, den der Rechner für jede Stufe ausgibt:\n\n| Gewicht | Kein Sport | Ausdauer | Kraftsport | Diät |\n|---|---|---|---|---|\n${PR_TABLE}\n\nBei „Kein Sport“ entspricht die untere Zahl der DGE-Empfehlung von 0,8 g/kg für Erwachsene von 19 bis unter 65 Jahren, die obere dem Schätzwert von 1,0 g/kg ab 65 Jahren. Das Hauptergebnis liegt genau dazwischen; unter 65 Jahren genügt nach DGE der untere Wert.`,
      },
      {
        title: 'Welches Gewicht Sie eingeben und wie Sie die Menge verteilen',
        content: `- **Bei deutlichem Übergewicht:** Mit dem aktuellen Körpergewicht ergeben die Faktoren eher zu hohe Werte, weil Fettgewebe kaum Eiweiß braucht. Ernährungsfachkräfte rechnen dann oft mit einem Gewicht im Normalbereich.\n- **Stufe ehrlich wählen:** Die Kraftsport-Stufe ist für regelmäßiges, forderndes Training gedacht. Wer zweimal pro Woche locker joggt, ist mit „Ausdauer“ oder „Kein Sport“ realistischer bedient.\n- **Auf den Tag verteilen:** Der Rechner teilt die Tagesmenge auf 4 Mahlzeiten auf. Bei 60 kg und Ausdauersport sind das etwa ${n(PR_MEAL_60E, 0)} g pro Mahlzeit, bei 90 kg in der Diät-Stufe etwa ${n(PR_MEAL_90D, 0)} g. Drei größere Mahlzeiten funktionieren genauso.\n- **Diätphase:** Die Stufe „Diät“ gilt nur, solange Sie bewusst weniger Kalorien essen. Danach reicht wieder der Bereich Ihres Trainings.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel Eiweiß braucht man ab 65 Jahren?',
        answer: `Die DGE gibt für Erwachsene ab 65 Jahren einen Schätzwert von 1,0 g pro kg Körpergewicht und Tag an, statt 0,8 g/kg bei Jüngeren. Für 70 kg sind das 70 g am Tag – das entspricht der Obergrenze, die der Rechner in der Stufe „Kein Sport“ ausgibt (${txt(PR_70_SED, 'range')}).`,
      },
      {
        question: 'Zählt das Eiweiß aus Brot, Nudeln und Gemüse mit?',
        answer: 'Ja. Der Rechner nennt die gesamte Eiweißmenge des Tages, nicht nur die aus Fleisch, Fisch, Milchprodukten oder Shakes. Auch Brot, Hülsenfrüchte, Nudeln und Getreideflocken tragen dazu bei. Eiweißpulver ist eine Möglichkeit, aber keine Voraussetzung.',
      },
    ],
    workedExamples: [
      {
        title: 'Beispiel: Läuferin mit 62 kg',
        description: 'Viermal pro Woche Lauftraining zur Vorbereitung auf einen Halbmarathon.',
        inputValues: [
          { label: 'Gewicht', value: '62 kg' },
          { label: 'Stufe', value: 'Ausdauersport (1,2 – 1,4 g/kg)' },
        ],
        inputs: { bodyWeightKg: 62, activityType: 'endurance' },
        steps: ['Minimum: 62 × 1,2 = 74,4 g', 'Maximum: 62 × 1,4 = 86,8 g', `Mittelwert ≈ ${n(num(PR_EX, 'avgG'), 0)} g, auf 4 Mahlzeiten ≈ ${n(num(PR_EX, 'perMeal'), 0)} g`],
        resultSummary: txt(PR_EX, 'avgG'),
      },
    ],
  },

  'koffein-halbwertszeit-rechner': {
    sections: [
      {
        title: 'Restkoffein nach Stunden für eine Portion',
        content: `Die Tabelle zeigt, wie viel Koffein der Rechner nach einer einzelnen Portion noch im Körper sieht (Halbwertszeit 5 Stunden):\n\n| Zeit nach dem Trinken | Filterkaffee (${n(KF_FILTER, 0)} mg) | Doppelter Espresso (${n(kfMg('double_espresso'), 0)} mg) | Energy Drink (${n(KF_ENERGY, 0)} mg) | Cola (${n(kfMg('cola'), 0)} mg) |\n|---|---|---|---|---|\n${KF_TABLE}\n\nWer um 15:00 Uhr einen doppelten Espresso trinkt und um 23:00 Uhr schlafen geht, hat laut Rechner noch etwa ${n(num(kf('double_espresso', 1, 8), 'remainingMg'), 0)} mg im Körper. Die EFSA weist darauf hin, dass schon 100 mg kurz vor dem Schlafengehen bei manchen Erwachsenen Schlafdauer und Schlafmuster beeinflussen können.`,
      },
      {
        title: 'Die EFSA-Grenzen in Tassen umgerechnet',
        content: `Die Europäische Behörde für Lebensmittelsicherheit (EFSA) hält für gesunde Erwachsene folgende Mengen aus allen Quellen für unbedenklich:\n\n- **Bis 400 mg pro Tag:** etwa ${n(400 / KF_FILTER, 1)} Tassen Filterkaffee à ${n(KF_FILTER, 0)} mg oder ${n(400 / KF_ESPRESSO, 1)} einfache Espressi à ${n(KF_ESPRESSO, 0)} mg.\n- **Bis 200 mg auf einmal:** etwa ${n(200 / KF_FILTER, 1)} Tassen Filterkaffee oder ${n(200 / KF_ENERGY, 1)} Dosen Energy Drink à ${n(KF_ENERGY, 0)} mg.\n- **Schwangere und Stillende:** bis 200 mg pro Tag, verteilt über den Tag.\n\nDie mg-Angaben dieses Rechners sind Durchschnittswerte. Die EFSA selbst nennt für einen Espresso von 60 ml rund 80 mg; Kaffee aus dem Coffeeshop kann deutlich mehr enthalten. Schwarzer Tee, Mate und Schokolade zählen ebenfalls mit.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel Kaffee ist in der Schwangerschaft unbedenklich?',
        answer: `Nach Einschätzung der EFSA bis zu 200 mg Koffein pro Tag aus allen Quellen. Mit den Werten dieses Rechners sind das gut zwei Tassen Filterkaffee à ${n(KF_FILTER, 0)} mg oder drei einfache Espressi à ${n(KF_ESPRESSO, 0)} mg. Weil sich der Abbau in der Schwangerschaft deutlich verlangsamt, unterschätzt der Rechner die Restmenge zur Schlafenszeit dann eher.`,
      },
      {
        question: 'Wann ist Koffein vollständig abgebaut?',
        answer: `Rechnerisch nie ganz, aber nach etwa fünf Halbwertszeiten ist nur noch ein kleiner Rest übrig. Mit 5 Stunden Halbwertszeit sind von einer Tasse Filterkaffee (${n(KF_FILTER, 0)} mg) nach 24 Stunden noch etwa ${n(KF_24H, 0)} mg vorhanden – praktisch ohne Wirkung. Bei langsamem Abbau kann es deutlich länger dauern.`,
      },
    ],
    workedExamples: [
      {
        title: 'Beispiel: Zwei Energy Drinks 8 Stunden vor dem Schlafen',
        description: 'Zwei Dosen à 250 ml am Nachmittag während einer Lernsession, Schlafengehen 8 Stunden später.',
        inputValues: [
          { label: 'Getränk', value: 'Energy Drink (80 mg)' },
          { label: 'Portionen', value: '2' },
          { label: 'Abstand', value: '8 Stunden' },
        ],
        inputs: { drinkType: 'energy_drink', servingsCount: 2, hoursUntilBed: 8 },
        steps: [`Aufgenommen: 2 × 80 mg = ${txt(KF_EX, 'initialMg')}`, `Restmenge = 160 × 0,5^(8/5) ≈ ${n(num(KF_EX, 'remainingMg'), 0)} mg`],
        resultSummary: `${txt(KF_EX, 'remainingMg')} Restkoffein – ${txt(KF_EX, 'sleepImpact')}`,
      },
    ],
  },
};
