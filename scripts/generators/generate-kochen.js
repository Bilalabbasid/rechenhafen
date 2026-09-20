const fs = require('fs');
const path = require('path');

const calcs = [
  {
    id: 'hefe-umrechner',
    slug: 'hefe-umrechner',
    name: 'Hefe Rechner (Frische Hefe in Trockenhefe & Vorteig umrechnen)',
    shortName: 'Hefe Rechner',
    category: 'kochen-backen',
    subcategory: 'Backzutaten',
    metaTitle: 'Hefe Rechner – Frische Hefe in Trockenhefe umrechnen (1 Würfel = 42g)',
    metaDescription: 'Rechnen Sie frische Hefe in Trockenhefe und umgekehrt um: Faustformel 1 Würfel frische Hefe (42 g) = 2 Beutel Trockenhefe (14 g) für 1 kg Mehl.',
    h1: 'Hefe Rechner – Frische Hefe in Trockenhefe & Mehlmenge',
    shortDescription: 'Konvertiert frische Hefe in Trockenhefe und berechnet die Hefe nach Mehlmenge.',
    searchKeywords: ['hefe umrechner frisch in trockenhefe', '1 wuerfel hefe wieviel trockenhefe 42g', 'trockenhefe in frische hefe umrechnen', 'hefemenge pro 500g mehl pizza brot'],
    inputs: [
      { id: 'inputValue', label: 'Menge Hefe', type: 'number', defaultValue: 1, min: 0.1, max: 500, step: 0.5, unit: 'Einheit' },
      {
        id: 'inputUnit',
        label: 'Ausgangs-Einheit',
        type: 'select',
        defaultValue: 'cube',
        options: [
          { value: 'cube', label: 'Würfel frische Hefe (1 Würfel = 42 g)' },
          { value: 'freshG', label: 'Gramm frische Hefe (g)' },
          { value: 'dryBags', label: 'Päckchen Trockenhefe (1 Pck. = 7 g)' },
          { value: 'dryG', label: 'Gramm Trockenhefe (g)' },
        ],
      },
    ],
    calculateCode: `const val = Number(inputs.inputValue) || 0;
const unit = inputs.inputUnit;

// Basis: Gramm frische Hefe
let freshG = val * 42;
if (unit === 'freshG') freshG = val;
else if (unit === 'dryBags') freshG = val * 21; // 1 Pck. (7g) entspricht 21g frischer Hefe
else if (unit === 'dryG') freshG = val * 3; // Verhältnis 3:1

const cubes = freshG / 42;
const dryG = freshG / 3;
const dryBags = dryG / 7;
// Standard: 1 Würfel (42g) reicht für 1.000g Mehl bei Standardteigen
const flourG = freshG * (1000 / 42);

return {
  primary: { id: 'dryBags', label: 'Trockenhefe (Päckchen à 7 g)', value: dryBags, formattedValue: formatNumber(dryBags, 1) + ' Päckchen (' + formatNumber(dryG, 1) + ' g)', highlight: true },
  secondary: [
    { id: 'freshG', label: 'Frische Hefe (Gramm)', value: freshG, formattedValue: formatNumber(freshG, 1) + ' g' },
    { id: 'cubes', label: 'Frische Hefe (Würfel à 42 g)', value: cubes, formattedValue: formatNumber(cubes, 2) + ' Würfel' },
    { id: 'flour', label: 'Standard-Mehlmenge (Faustformel)', value: flourG, formattedValue: 'ca. ' + formatNumber(flourG, 0) + ' g Mehl' },
  ],
  summaryText: val + ' ' + (unit === 'cube' ? 'Würfel Hefe' : 'Einheiten') + ' entsprechen genau ' + formatNumber(freshG, 0) + ' g frischer Hefe bzw. ' + formatNumber(dryG, 1) + ' g Trockenhefe (' + formatNumber(dryBags, 1) + ' Päckchen).',
};`,
    formula: 'Verhältnis: 1 g Trockenhefe = 3 g frische Hefe; 1 Würfel frisch (42 g) = 2 Päckchen trocken (14 g)',
    formulaExplanation: 'Da Trockenhefe das entzogene Wasser fehlt, ist ihre Triebkraft dreimal so konzentriert wie die von frischer Blockhefe.',
    workedExample: {
      title: 'Beispiel: Rezept verlangt 1/2 Würfel frische Hefe',
      inputValues: [{ label: 'Menge', value: '0,5 Würfel (21 g)' }],
      steps: ['Trockenhefe = 21 g / 3 = 7 g', 'Entspricht genau 1 Päckchen Trockenhefe'],
      result: '1 Päckchen Trockenhefe (7 g)',
    },
    faqs: [
      { question: 'Muss Trockenhefe angerührt werden?', answer: 'Nein, moderne Trockenhefe kann direkt trocken unter das Mehl gemischt werden. Frische Hefe löst man am besten vorher in handwarmem Wasser oder Milch (max. 38°C) mit etwas Zucker auf.' },
      { question: 'Ab welcher Temperatur stirbt Hefe ab?', answer: 'Hefezellen sterben ab ca. 45°C unwiderruflich ab. Verwenden Sie beim Anrühren niemals kochendes oder zu heißes Wasser.' },
    ],
    relatedSlugs: ['pizza-teig-rechner', 'brot-backen-baeckermass-rechner', 'sauerteig-anstellgut-rechner'],
  },

  {
    id: 'essloeffel-teeloeffel-gramm-rechner',
    slug: 'essloeffel-teeloeffel-gramm-rechner',
    name: 'Esslöffel & Teelöffel in Gramm Rechner (EL, TL in g)',
    shortName: 'EL & TL in Gramm',
    category: 'kochen-backen',
    subcategory: 'Küchenmaße',
    metaTitle: 'Esslöffel & Teelöffel in Gramm Rechner – EL & TL in g für Zucker, Mehl & Öl',
    metaDescription: 'Rechnen Sie Esslöffel (EL) und Teelöffel (TL) in Gramm um für Mehl, Zucker, Salz, Olivenöl, Butter, Backpulver, Honig und Kakaopulver.',
    h1: 'Esslöffel & Teelöffel in Gramm Rechner – Zutaten ohne Waage wiegen',
    shortDescription: 'Wandelt Esslöffel und Teelöffel in Gramm für beliebige Backzutaten um.',
    searchKeywords: ['essloeffel in gramm rechner zucker mehl', 'teeloeffel in gramm el tl tabelle', '1 el mehl wieviel gramm zucker', '1 tl salz backpulver gramm wiegen'],
    inputs: [
      { id: 'spoonsCount', label: 'Anzahl Löffel', type: 'number', defaultValue: 3, min: 0.25, max: 50, step: 0.5, unit: 'Löffel' },
      {
        id: 'spoonType',
        label: 'Löffelart',
        type: 'select',
        defaultValue: 'elHeaped',
        options: [
          { value: 'elLevel', label: 'Esslöffel (EL gestrichen ≈ 15 ml)' },
          { value: 'elHeaped', label: 'Esslöffel (EL gehäuft)' },
          { value: 'tlLevel', label: 'Teelöffel (TL gestrichen ≈ 5 ml)' },
          { value: 'tlHeaped', label: 'Teelöffel (TL gehäuft)' },
        ],
      },
      {
        id: 'ingredient',
        label: 'Zutat',
        type: 'select',
        defaultValue: 'sugar',
        options: [
          { value: 'sugar', label: 'Haushaltszucker (gestr. EL 15g, gehäuft 20g / TL 5g)' },
          { value: 'flour', label: 'Weizenmehl (gestr. EL 10g, gehäuft 15g / TL 4g)' },
          { value: 'salt', label: 'Speisesalz (gestr. EL 18g, gehäuft 22g / TL 6g)' },
          { value: 'oil', label: 'Speiseöl / Olivenöl (gestr. EL 14g / TL 5g)' },
          { value: 'butter', label: 'Butter weich (gestr. EL 15g, gehäuft 20g / TL 5g)' },
          { value: 'honey', label: 'Honig (gestr. EL 20g, gehäuft 25g / TL 7g)' },
          { value: 'bakingPowder', label: 'Backpulver / Natron (gestr. EL 12g / gestr. TL 4g)' },
          { value: 'cocoa', label: 'Kakaopulver (gestr. EL 8g, gehäuft 12g / TL 3g)' },
        ],
      },
    ],
    calculateCode: `const count = Number(inputs.spoonsCount) || 0;
const sType = inputs.spoonType;
const ing = inputs.ingredient;

// Gewichte pro Löffel in Gramm [elLevel, elHeaped, tlLevel, tlHeaped]
const weights = {
  sugar: { elLevel: 15, elHeaped: 20, tlLevel: 5, tlHeaped: 8 },
  flour: { elLevel: 10, elHeaped: 15, tlLevel: 3.5, tlHeaped: 6 },
  salt: { elLevel: 18, elHeaped: 22, tlLevel: 6, tlHeaped: 9 },
  oil: { elLevel: 14, elHeaped: 14, tlLevel: 4.5, tlHeaped: 4.5 },
  butter: { elLevel: 15, elHeaped: 20, tlLevel: 5, tlHeaped: 8 },
  honey: { elLevel: 20, elHeaped: 25, tlLevel: 7, tlHeaped: 10 },
  bakingPowder: { elLevel: 12, elHeaped: 16, tlLevel: 4, tlHeaped: 6 },
  cocoa: { elLevel: 8, elHeaped: 12, tlLevel: 3, tlHeaped: 5 },
};

const gramPerSpoon = (weights[ing] && weights[ing][sType]) || 15;
const totalGrams = count * gramPerSpoon;

return {
  primary: { id: 'grams', label: 'Gewicht in Gramm (g)', value: totalGrams, formattedValue: formatNumber(totalGrams, 1) + ' g', highlight: true },
  secondary: [
    { id: 'perSpoon', label: 'Gewicht pro Löffel', value: gramPerSpoon, formattedValue: formatNumber(gramPerSpoon, 1) + ' g/Löffel' },
    { id: 'mlVol', label: 'Flüssigkeitsvolumen ca.', value: sType.startsWith('el') ? count * 15 : count * 5, formattedValue: (sType.startsWith('el') ? count * 15 : count * 5) + ' ml' },
  ],
  summaryText: count + ' ' + (sType.includes('el') ? 'Esslöffel' : 'Teelöffel') + ' dieser Zutat wiegen genau ' + formatNumber(totalGrams, 1) + ' Gramm.',
};`,
    formula: 'Gewicht (g) = Anzahl Löffel × Zutatendichte je Löffelart',
    formulaExplanation: 'Ein gestrichener Esslöffel fasst normiert genau 15 ml Flüssigkeit, ein Teelöffel genau 5 ml (3 TL = 1 EL). Das Gewicht hängt von der Schüttdichte der Zutat ab.',
    workedExample: {
      title: 'Beispiel: 3 gehäufte Esslöffel Mehl abmessen',
      inputValues: [{ label: 'Menge', value: '3 gehäufte EL' }, { label: 'Zutat', value: 'Weizenmehl' }],
      steps: ['1 gehäufter EL Mehl = ca. 15 g', '3 EL × 15 g = 45 g Mehl'],
      result: '45 g Mehl',
    },
    faqs: [
      { question: 'Wie viele Teelöffel passen in einen Esslöffel?', answer: 'Genau 3 Teelöffel entsprechen dem Volumen eines Esslöffels (1 TL = 5 ml, 1 EL = 15 ml).' },
      { question: 'Was wiegt 1 Prise Salz?', answer: 'Eine Prise Salz (zwischen Daumen und Zeigefinger) wiegt je nach Fingergröße etwa 0,3 bis 0,5 Gramm.' },
    ],
    relatedSlugs: ['cups-in-gramm-rechner', 'gramm-in-ml-rechner', 'portionsrechner'],
  },

  {
    id: 'cups-in-gramm-rechner',
    slug: 'cups-in-gramm-rechner',
    name: 'US Cups in Gramm Rechner (American Baking Cup Converter)',
    shortName: 'Cups in Gramm',
    category: 'kochen-backen',
    subcategory: 'Küchenmaße',
    metaTitle: 'Cups in Gramm Rechner – US Cups in g für Mehl, Zucker & Butter',
    metaDescription: 'Rechnen Sie amerikanische Rezepte um: US Cups in Gramm für Mehl (125g), Kristallzucker (200g), braunen Zucker (220g), Butter (227g), Haferflocken und Kakao.',
    h1: 'Cups in Gramm Rechner – Amerikanische Cups in Gramm wiegen',
    shortDescription: 'Wandelt US Cups in Gramm nach Zutat für US-Backrezepte um.',
    searchKeywords: ['cups in gramm rechner us cups mehl zucker', '1 cup mehl in gramm wieviel', '1 cup butter in gramm 227g', 'amerikanischer cup umrechner backen'],
    inputs: [
      { id: 'cupsAmount', label: 'Anzahl Cups', type: 'number', defaultValue: 1, min: 0.125, max: 20, step: 0.125, unit: 'Cups' },
      {
        id: 'ingredient',
        label: 'Zutat',
        type: 'select',
        defaultValue: 'flour',
        options: [
          { value: 'flour', label: 'Weizenmehl All-Purpose (1 Cup ≈ 125 g)' },
          { value: 'sugarWhite', label: 'Weißer Kristallzucker (1 Cup ≈ 200 g)' },
          { value: 'sugarBrown', label: 'Brauner Zucker / Packed (1 Cup ≈ 220 g)' },
          { value: 'sugarPowder', label: 'Puderzucker / Confectioners (1 Cup ≈ 120 g)' },
          { value: 'butter', label: 'Butter (1 Cup = 2 Sticks = 227 g)' },
          { value: 'oats', label: 'Haferflocken (1 Cup ≈ 90 g)' },
          { value: 'chocolateChips', label: 'Schokodrops / Chocolate Chips (1 Cup ≈ 175 g)' },
          { value: 'liquids', label: 'Flüssigkeiten (Milch, Wasser, Öl – 1 Cup ≈ 240 ml)' },
        ],
      },
    ],
    calculateCode: `const cups = Number(inputs.cupsAmount) || 0;
const ing = inputs.ingredient;

const cupWeights = {
  flour: 125,
  sugarWhite: 200,
  sugarBrown: 220,
  sugarPowder: 120,
  butter: 227,
  oats: 90,
  chocolateChips: 175,
  liquids: 240,
};

const gPerCup = cupWeights[ing] || 125;
const totalGrams = cups * gPerCup;
const mlVolume = cups * 236.588; // 1 US Legal Cup = ca. 240 ml, Customary = 236.6 ml

return {
  primary: { id: 'grams', label: 'Gewicht in Gramm (g)', value: totalGrams, formattedValue: formatNumber(totalGrams, 1) + ' g', highlight: true },
  secondary: [
    { id: 'volumeMl', label: 'Flüssigkeitsvolumen (ml)', value: mlVolume, formattedValue: formatNumber(mlVolume, 0) + ' ml' },
    { id: 'perCup', label: 'Dichte je 1 Cup', value: gPerCup, formattedValue: gPerCup + ' g / Cup' },
  ],
  summaryText: cups + ' Cup(s) dieser Zutat entsprechen genau ' + formatNumber(totalGrams, 1) + ' Gramm (Volumen ca. ' + formatNumber(mlVolume, 0) + ' ml).',
};`,
    formula: 'Gewicht (g) = Cups × Zutatengewicht pro Cup; 1 US Cup = ca. 236,6 ml',
    formulaExplanation: 'Ein US-Cup ist ein reines Volumenmaß (ca. 240 ml). Da 240 ml lockeres Mehl viel leichter sind als 240 ml kompakter Zucker, wiegt ein Cup Mehl nur 125 g, während ein Cup Zucker 200 g wiegt.',
    workedExample: {
      title: 'Beispiel: US-Brownie-Rezept mit 1,5 Cups braunem Zucker und 1 Cup Mehl',
      inputValues: [{ label: 'Brauner Zucker', value: '1,5 Cups' }, { label: 'Mehl', value: '1 Cup' }],
      steps: ['Brauner Zucker = 1,5 × 220 g = 330 g', 'Mehl = 1 × 125 g = 125 g'],
      result: '330 g brauner Zucker und 125 g Mehl',
    },
    faqs: [
      { question: 'Was ist 1 Stick of Butter in US-Rezepten?', answer: 'In den USA wird Butter in Stangen ("Sticks") verkauft. 1 Stick Butter entspricht genau 1/2 Cup = 8 Esslöffel = 113,4 Gramm. Ein ganzes deutsches Butterstück (250 g) entspricht ca. 2,2 Sticks.' },
      { question: 'Was bedeutet "packed brown sugar"?', answer: 'Bei braunem Zucker bedeutet "packed", dass der feuchte Zucker mit dem Löffel fest in den Cup gedrückt werden muss, bis keine Hohlräume mehr vorhanden sind.' },
    ],
    relatedSlugs: ['essloeffel-teeloeffel-gramm-rechner', 'gramm-in-ml-rechner', 'portionsrechner'],
  },

  {
    id: 'zucker-ersatz-rechner',
    slug: 'zucker-ersatz-rechner',
    name: 'Zuckerersatz Rechner (Erythrit, Xylit, Stevia & Honig)',
    shortName: 'Zuckerersatz Rechner',
    category: 'kochen-backen',
    subcategory: 'Ernährung & Diät',
    metaTitle: 'Zuckerersatz Rechner – Zucker in Erythrit, Xylit & Stevia umrechnen',
    metaDescription: 'Rechnen Sie Haushaltszucker um in Erythrit (70 % Süßkraft), Birkenzucker/Xylit (100 %), Honig, Stevia und Agavendicksaft inklusive Kalorieneinsparung.',
    h1: 'Zuckerersatz Rechner – Süßkraft & Kalorieneinsparung berechnen',
    shortDescription: 'Ermittelt die Menge von Erythrit, Xylit, Honig und Stevia als Zuckerersatz.',
    searchKeywords: ['zuckerersatz rechner erythrit xylit', 'zucker in birkenzucker umrechnen 1 zu 1', 'erythrit suesskraft 70 prozent berechnen', 'zucker durch honig ersetzen backen'],
    inputs: [
      { id: 'sugarGrams', label: 'Zuckermenge im Originalrezept', type: 'number', defaultValue: 100, min: 1, max: 2000, step: 10, unit: 'g Zucker' },
      {
        id: 'substitute',
        label: 'Gewünschte Zuckeralternative',
        type: 'select',
        defaultValue: 'erythrit',
        options: [
          { value: 'erythrit', label: 'Erythrit (ca. 70 % Süßkraft, 0 kcal – Faktor 1,3 bis 1,4)' },
          { value: 'xylit', label: 'Xylit / Birkenzucker (100 % Süßkraft, 40 % weniger kcal – 1:1)' },
          { value: 'honey', label: 'Honig (ca. 120 % Süßkraft, feucht – ca. 80 g je 100 g Zucker)' },
          { value: 'agave', label: 'Agavendicksaft (ca. 125 % Süßkraft – ca. 75 g je 100 g Zucker)' },
          { value: 'stevia', label: 'Stevia Pulver/Streusüße 1:1 (kalorienfrei)' },
        ],
      },
    ],
    calculateCode: `const sugarG = Number(inputs.sugarGrams) || 0;
const sub = inputs.substitute;

let factor = 1.35; // Erythrit
let calPerG = 0; // Erythrit 0 kcal
let liquidReductionMl = 0;

if (sub === 'xylit') {
  factor = 1.0;
  calPerG = 2.4; // 240 kcal / 100g
} else if (sub === 'honey') {
  factor = 0.80;
  calPerG = 3.04;
  liquidReductionMl = sugarG * 0.20; // Flüssigkeit im Rezept um 20% reduzieren
} else if (sub === 'agave') {
  factor = 0.75;
  calPerG = 3.10;
  liquidReductionMl = sugarG * 0.25;
} else if (sub === 'stevia') {
  factor = 1.0;
  calPerG = 0;
}

const subGrams = Math.round(sugarG * factor);
const sugarKcal = sugarG * 4.0; // Haushaltszucker 400 kcal / 100g
const subKcal = subGrams * calPerG;
const savedKcal = Math.max(0, sugarKcal - subKcal);

return {
  primary: { id: 'subGrams', label: 'Benötigte Menge Ersatzstoff', value: subGrams, formattedValue: subGrams + ' g', highlight: true },
  secondary: [
    { id: 'savedCalories', label: 'Eingesparte Kalorien', value: savedKcal, formattedValue: 'ca. ' + Math.round(savedKcal) + ' kcal weniger' },
    { id: 'liquidTip', label: 'Flüssigkeitsanpassung', value: liquidReductionMl, formattedValue: liquidReductionMl > 0 ? 'Flüssigkeit im Teig um ca. ' + Math.round(liquidReductionMl) + ' ml reduzieren' : 'Keine Flüssigkeitsanpassung nötig' },
  ],
  summaryText: 'Für ' + sugarG + ' g Haushaltszucker benötigen Sie ' + subGrams + ' g ' + (sub.toUpperCase()) + '. Dadurch sparen Sie rund ' + Math.round(savedKcal) + ' kcal ein!',
};`,
    formula: 'Erythrit = Zucker × 1,35; Xylit = Zucker × 1,0; Honig = Zucker × 0,80; Eingesparte kcal = (Zucker × 4) - (Ersatz × kcal)',
    formulaExplanation: 'Da Erythrit nur etwa 70 % der Süßkraft von Kristallzucker besitzt, muss man ca. 130 bis 140 g Erythrit verwenden, um 100 g Zucker geschmacklich zu ersetzen.',
    workedExample: {
      title: 'Beispiel: Kuchen mit 150 g Zucker auf Erythrit umstellen',
      inputValues: [{ label: 'Zucker', value: '150 g' }, { label: 'Ersatz', value: 'Erythrit' }],
      steps: ['Erythrit = 150 × 1,35 = 202,5 g ≈ 200 g', 'Eingespart: 150 g Zucker = 600 kcal -> 0 kcal mit Erythrit'],
      result: '200 g Erythrit (600 kcal gespart)',
    },
    faqs: [
      { question: 'Ist Xylit giftig für Hunde?', answer: 'JA, LEBENSGEFÄHRLICH! Xylit (Birkenzucker) führt bei Hunden schon in kleinsten Mengen zu einer massiven Insulinausschüttung, schwerem Schock und akutem Leberversagen. Halten Sie Xylit-Gebäck streng von Haustieren fern!' },
      { question: 'Karameillisiert Erythrit beim Backen wie Zucker?', answer: 'Nein, Erythrit karamellisiert nicht und bräunt das Gebäck kaum. Zudem kann es bei höherer Dosierung einen leicht kühlen Nachgeschmack auf der Zunge hinterlassen.' },
    ],
    relatedSlugs: ['kalorien-rezept-rechner', 'cups-in-gramm-rechner', 'portionsrechner'],
  },

  {
    id: 'backzeit-temperatur-umluft-oberhitze-rechner',
    slug: 'backzeit-temperatur-umluft-oberhitze-rechner',
    name: 'Backofen Umrechner (Umluft in Ober-/Unterhitze & Gasstufe)',
    shortName: 'Backofen Umrechner',
    category: 'kochen-backen',
    subcategory: 'Backzutaten',
    metaTitle: 'Backofen Umrechner – Umluft in Ober-/Unterhitze & Gasstufe umrechnen',
    metaDescription: 'Rechnen Sie Backofentemperaturen um: Umluft / Heißluft zu Ober-/Unterhitze (Faustregel: 20°C Unterschied) inklusive Backzeitanpassung und Gasbackofen-Stufen 1–8.',
    h1: 'Backofen Umrechner – Umluft & Ober-/Unterhitze anpassen',
    shortDescription: 'Wandelt Backtemperatur und Backzeit zwischen Umluft und Ober-/Unterhitze um.',
    searchKeywords: ['backofen umrechner umluft in ober unterhitze', 'temperatur heissluft oberhitze 20 grad weniger', 'gasbackofen stufe temperatur tabelle', 'backzeit anpassen umluft heissluft'],
    inputs: [
      { id: 'temperature', label: 'Temperatur im Rezept', type: 'number', defaultValue: 180, min: 50, max: 300, step: 5, unit: '°C' },
      {
        id: 'sourceMode',
        label: 'Rezeptangabe bezieht sich auf',
        type: 'select',
        defaultValue: 'topBottom',
        options: [
          { value: 'topBottom', label: 'Ober-/Unterhitze (im Rezept angegeben)' },
          { value: 'convection', label: 'Umluft / Heißluft (im Rezept angegeben)' },
        ],
      },
      { id: 'bakeTimeMins', label: 'Backzeit im Rezept', type: 'number', defaultValue: 45, min: 5, max: 240, step: 5, unit: 'Minuten' },
    ],
    calculateCode: `const temp = Number(inputs.temperature) || 180;
const mode = inputs.sourceMode;
const timeMins = Number(inputs.bakeTimeMins) || 45;

let topBottomTemp = temp;
let convectionTemp = temp - 20;
let adaptedTime = timeMins;

if (mode === 'convection') {
  convectionTemp = temp;
  topBottomTemp = temp + 20;
  adaptedTime = Math.round(timeMins * 1.10); // Ober/Unterhitze dauert ca. 10 % länger
} else {
  // Rezept ist Ober/Unterhitze, Ziel ist Umluft
  adaptedTime = Math.round(timeMins * 0.90); // Umluft spart ca. 10 % Backzeit
}

// Gasbackofen Stufen (Faustregel: Stufe 1 ≈ 140°C, jede weitere Stufe +20°C):
// Stufe = (Ober-/Unterhitze - 120) / 20
const gasLevel = Math.max(1, Math.min(8, Math.round((topBottomTemp - 120) / 20)));

return {
  primary: { id: 'targetTemp', label: mode === 'topBottom' ? 'Empfohlene Umluft-Temperatur' : 'Empfohlene Ober-/Unterhitze', value: mode === 'topBottom' ? convectionTemp : topBottomTemp, formattedValue: (mode === 'topBottom' ? convectionTemp : topBottomTemp) + ' °C', highlight: true },
  secondary: [
    { id: 'adaptedTime', label: 'Angepasste Backzeit ca.', value: adaptedTime, formattedValue: adaptedTime + ' Minuten (ca. ' + (mode === 'topBottom' ? '-10 % schneller' : '+10 % länger') + ')' },
    { id: 'gasLevel', label: 'Entsprechende Gasofen-Stufe', value: gasLevel, formattedValue: 'Stufe ' + gasLevel },
    { id: 'topBottomDisplay', label: 'Ober-/Unterhitze', value: topBottomTemp, formattedValue: topBottomTemp + ' °C' },
    { id: 'convectionDisplay', label: 'Umluft / Heißluft', value: convectionTemp, formattedValue: convectionTemp + ' °C' },
  ],
  summaryText: (mode === 'topBottom' ? temp + ' °C Ober-/Unterhitze entsprechen ca. ' + convectionTemp + ' °C Umluft' : temp + ' °C Umluft entsprechen ca. ' + topBottomTemp + ' °C Ober-/Unterhitze') + ' (Backzeit ca. ' + adaptedTime + ' Minuten, Gasofen Stufe ' + gasLevel + ').',
};`,
    formula: 'Umluft = Ober-/Unterhitze - 20 °C; Gasstufe ≈ (Oberhitze °C - 120) / 20; Backzeit Umluft ≈ 90 % der Ober-/Unterhitze-Zeit',
    formulaExplanation: 'Da der Ventilator bei Umluft die heiße Luft kontinuierlich und direkt an das Backgut bläst, ist die Wärmeübertragung wesentlich effizienter als bei stehender Luft.',
    workedExample: {
      title: 'Beispiel: Kuchenrezept verlangt 180 °C Ober-/Unterhitze für 50 Minuten',
      inputValues: [{ label: 'Rezept', value: '180 °C Ober-/Unterhitze' }, { label: 'Zeit', value: '50 Minuten' }],
      steps: ['Umluft-Temperatur = 180 - 20 = 160 °C', 'Umluft-Backzeit = 50 × 0,90 = 45 Minuten'],
      result: '160 °C Umluft für ca. 45 Minuten',
    },
    faqs: [
      { question: 'Wann sollte man Ober-/Unterhitze statt Umluft bevorzugen?', answer: 'Für empfindliche Biskuitböden, Soufflés, Brandteig (Windbeutel) und Käsekuchen ist Ober-/Unterhitze besser geeignet, da der Luftstrom bei Umluft das Gebäck austrocknen oder ungleichmäßig aufgehen lassen kann.' },
      { question: 'Kann man bei Umluft auf mehreren Blechen gleichzeitig backen?', answer: 'Ja! Das ist der größte Vorteil von Umluft: Durch die gleichmäßige Hitzeverteilung können 2 bis 3 Bleche Plätzchen oder Pizzen problemlos gleichzeitig gebacken werden.' },
    ],
    relatedSlugs: ['temperatur-umrechner', 'backform-umrechner', 'pizza-teig-rechner'],
  },

  {
    id: 'fleisch-kerntemperatur-garzeit-rechner',
    slug: 'fleisch-kerntemperatur-garzeit-rechner',
    name: 'Fleisch Kerntemperatur & Garzeit Rechner (Rind, Schwein & Geflügel)',
    shortName: 'Kerntemperatur Rechner',
    category: 'kochen-backen',
    subcategory: 'Fleisch & Fisch',
    metaTitle: 'Kerntemperatur Rechner – Rind, Schwein, Hähnchen, Lamm & Roastbeef',
    metaDescription: 'Finden Sie die perfekte Kerntemperatur und Garzeit für Rindersteak, Roastbeef, Schweinebraten, Pulled Pork, Hähnchen und Lammkeule nach Garstufen.',
    h1: 'Kerntemperatur Rechner – Perfekte Garstufe für Braten & Steak',
    shortDescription: 'Ermittelt Ziel-Kerntemperatur und Garzeit nach Fleischart und Garstufe.',
    searchKeywords: ['kerntemperatur fleisch tabelle rechner', 'roastbeef kerntemperatur medium 56 grad', 'schweinebraten kerntemperatur garzeit rechner', 'haehnchen gefluegel kerntemperatur sicher'],
    inputs: [
      {
        id: 'meatType',
        label: 'Fleischart & Zuschnitt',
        type: 'select',
        defaultValue: 'beefRoast',
        options: [
          { value: 'beefSteak', label: 'Rindersteak / Filet (Kurzgebraten)' },
          { value: 'beefRoast', label: 'Roastbeef / Rinderbraten (Niedriggaren)' },
          { value: 'porkRoast', label: 'Schweinebraten / Krustenbraten' },
          { value: 'pulledPork', label: 'Pulled Pork (Schweinenacken Smoker/Ofen)' },
          { value: 'poultry', label: 'Geflügel (Hähnchen, Pute – durchgegart)' },
          { value: 'lamb', label: 'Lammkeule / Lammkarree' },
        ],
      },
      {
        id: 'doneness',
        label: 'Garstufe',
        type: 'select',
        defaultValue: 'medium',
        options: [
          { value: 'rare', label: 'Rare / Blutig (ca. 48-52 °C)' },
          { value: 'mediumRare', label: 'Medium Rare / Rosa Kern (ca. 53-56 °C – Steak-Favorit)' },
          { value: 'medium', label: 'Medium / Zartrosa (ca. 57-60 °C)' },
          { value: 'wellDone', label: 'Well Done / Vollständig durchgegart (ab 68-75 °C)' },
        ],
      },
      { id: 'weightKg', label: 'Fleischgewicht', type: 'number', defaultValue: 1.5, min: 0.2, max: 10, step: 0.1, unit: 'kg' },
    ],
    calculateCode: `const meat = inputs.meatType;
const done = inputs.doneness;
const weight = Number(inputs.weightKg) || 1.5;

let targetTemp = 58; // °C
let ovenTemp = 120; // °C
let minsPerKg = 60; // Minuten je kg

if (meat === 'beefSteak') {
  ovenTemp = 100;
  minsPerKg = 40;
  if (done === 'rare') targetTemp = 50;
  else if (done === 'mediumRare') targetTemp = 54;
  else if (done === 'medium') targetTemp = 58;
  else targetTemp = 68;
} else if (meat === 'beefRoast') {
  ovenTemp = 110; // Niedrigtemperatur
  minsPerKg = 80;
  if (done === 'rare') targetTemp = 52;
  else if (done === 'mediumRare') targetTemp = 55;
  else if (done === 'medium') targetTemp = 58;
  else targetTemp = 72;
} else if (meat === 'porkRoast') {
  ovenTemp = 160;
  minsPerKg = 70;
  targetTemp = done === 'medium' ? 68 : 75; // Schwein meist mindestens 68-75 °C
} else if (meat === 'pulledPork') {
  ovenTemp = 110;
  minsPerKg = 240; // Sehr langes Smoken
  targetTemp = 92; // Zartes Zerfasern erst ab 90-94 °C
} else if (meat === 'poultry') {
  ovenTemp = 180;
  minsPerKg = 50;
  targetTemp = 75; // Geflügel zwingend min. 75 °C wegen Salmonellengefahr
} else if (meat === 'lamb') {
  ovenTemp = 140;
  minsPerKg = 60;
  targetTemp = done === 'mediumRare' ? 58 : done === 'medium' ? 64 : 74;
}

const totalTimeMins = Math.round(weight * minsPerKg);
const hours = Math.floor(totalTimeMins / 60);
const mins = totalTimeMins % 60;

return {
  primary: { id: 'targetCoreTemp', label: 'Optimale Ziel-Kerntemperatur', value: targetTemp, formattedValue: targetTemp + ' °C', highlight: true },
  secondary: [
    { id: 'estTime', label: 'Geschätzte Gardauer ca.', value: totalTimeMins, formattedValue: (hours > 0 ? hours + ' Std. ' + mins + ' Min.' : mins + ' Min.') },
    { id: 'ovenTemp', label: 'Empfohlene Ofentemperatur', value: ovenTemp, formattedValue: ovenTemp + ' °C' },
    { id: 'restingTime', label: 'Ruhezeit vor dem Anschneiden', value: 10, formattedValue: 'ca. 5 bis 10 Minuten (im Alufolien-Mantel)' },
  ],
  summaryText: 'Für ' + weight + ' kg Fleisch wird eine Kerntemperatur von ' + targetTemp + ' °C empfohlen. Bei ' + ovenTemp + ' °C Ofentemperatur beträgt die Gardauer ca. ' + (hours > 0 ? hours + ' Std. ' + mins + ' Min.' : mins + ' Minuten') + '.',
};`,
    formula: 'Garzeit ≈ Fleischgewicht (kg) × Spezifische Min./kg; Messung an der dicksten Fleischstelle',
    formulaExplanation: 'Ein Bratenthermometer muss stets an der dicksten Stelle des Fleischstücks platziert werden, ohne dabei Knochen zu berühren, da Knochen Hitze schneller leiten.',
    workedExample: {
      title: 'Beispiel: 1,5 kg Roastbeef Niedriggaren auf Medium Rare (55 °C)',
      inputValues: [{ label: 'Fleisch', value: 'Roastbeef 1,5 kg' }, { label: 'Garstufe', value: 'Medium Rare' }],
      steps: ['Zielkerntemperatur = 55 °C', 'Ofentemperatur = 110 °C', 'Dauer: 1,5 kg × 80 Min. ≈ 120 Minuten (2 Stunden)'],
      result: '55 °C Kerntemperatur (ca. 2 Stunden Garzeit)',
    },
    faqs: [
      { question: 'Warum muss Fleisch nach dem Braten ruhen?', answer: 'Beim Garen drängt der Fleischsaft ins Zentrum des Fleisches. Während der 5-10 Minuten Ruhezeit entspannen sich die Muskelfasern und der Saft verteilt sich wieder gleichmäßig, sodass er beim Anschnitt nicht ausläuft.' },
      { question: 'Ab welcher Kerntemperatur ist Geflügel sicher gegen Salmonellen?', answer: 'Geflügel muss an allen Stellen eine Mindestkerntemperatur von 72 bis 75 °C für mindestens 2 Minuten erreichen, um Salmonellen zuverlässig abzutöten.' },
    ],
    relatedSlugs: ['backzeit-temperatur-umluft-oberhitze-rechner', 'portionsrechner', 'salz-lake-poekel-rechner'],
  },

  {
    id: 'pizza-teig-rechner',
    slug: 'pizza-teig-rechner',
    name: 'Pizza Teig Rechner (Hydratation 60–70 %, Mehl, Wasser & Hefe)',
    shortName: 'Pizza Teig Rechner',
    category: 'kochen-backen',
    subcategory: 'Backzutaten',
    metaTitle: 'Pizza Teig Rechner – Neapolitanische Pizza Teigausbeute & Hydratation',
    metaDescription: 'Berechnen Sie die exakten Zutaten für echten neapolitanischen Pizzateig nach Ballenanzahl, Ballengewicht (z. B. 260 g), Teighydratation (Wassergehalt 60-70 %) und Reifezeit.',
    h1: 'Pizza Teig Rechner – Mehl, Wasser, Hefe & Salz für Neapel-Pizza',
    shortDescription: 'Berechnet Pizzateig-Zutaten nach Hydratation und Ballenanzahl.',
    searchKeywords: ['pizza teig rechner neapolitanisch hydratation', 'pizzateig mehl wasser hefe salz berechnen', 'ballengewicht pizza 260g', 'pizzateig fuehrung reifezeit hefe gramm'],
    inputs: [
      { id: 'ballsCount', label: 'Anzahl Pizzen / Teigballen', type: 'number', defaultValue: 4, min: 1, max: 100, step: 1, unit: 'Pizzen' },
      { id: 'ballWeightG', label: 'Gewicht pro Teigballen', type: 'number', defaultValue: 260, min: 180, max: 400, step: 10, unit: 'g' },
      { id: 'hydrationPercent', label: 'Hydratation (Wasseranteil bezogen auf Mehl)', type: 'number', defaultValue: 65, min: 55, max: 80, step: 1, unit: '%' },
      { id: 'saltPercent', label: 'Salzgehalt bezogen auf Mehl', type: 'number', defaultValue: 3.0, min: 2.0, max: 4.0, step: 0.1, unit: '%' },
    ],
    calculateCode: `const count = Number(inputs.ballsCount) || 4;
const ballWeight = Number(inputs.ballWeightG) || 260;
const totalDoughWeight = count * ballWeight;

const hydr = (Number(inputs.hydrationPercent) || 65) / 100;
const saltRate = (Number(inputs.saltPercent) || 3.0) / 100;
// Frische Hefe: ca. 0.15 % bis 0.3 % bei 24h Reife
const yeastRate = 0.002;

// Bäckerformel: Teigmasse = Mehl + Wasser + Salz + Hefe
// Teigmasse = Mehl * (1 + hydr + saltRate + yeastRate)
const flourG = totalDoughWeight / (1 + hydr + saltRate + yeastRate);
const waterG = flourG * hydr;
const saltG = flourG * saltRate;
const freshYeastG = flourG * yeastRate;
const dryYeastG = freshYeastG / 3;

return {
  primary: { id: 'flour', label: 'Mehl (Tipo 00 oder W300)', value: flourG, formattedValue: formatNumber(flourG, 0) + ' g', highlight: true },
  secondary: [
    { id: 'water', label: 'Wasser (kalt)', value: waterG, formattedValue: formatNumber(waterG, 0) + ' g (ml)', highlight: true },
    { id: 'salt', label: 'Meersalz fein', value: saltG, formattedValue: formatNumber(saltG, 1) + ' g' },
    { id: 'freshYeast', label: 'Frische Hefe (für 24h Gare)', value: freshYeastG, formattedValue: formatNumber(freshYeastG, 2) + ' g (trocken: ' + formatNumber(dryYeastG, 2) + ' g)' },
    { id: 'totalDough', label: 'Gesamtteiggewicht', value: totalDoughWeight, formattedValue: totalDoughWeight + ' g (' + count + ' Ballen à ' + ballWeight + ' g)' },
  ],
  summaryText: 'Für ' + count + ' Pizzen à ' + ballWeight + ' g (Hydratation ' + inputs.hydrationPercent + ' %) benötigen Sie ' + formatNumber(flourG, 0) + ' g Mehl, ' + formatNumber(waterG, 0) + ' g Wasser, ' + formatNumber(saltG, 1) + ' g Salz und ' + formatNumber(freshYeastG, 1) + ' g frische Hefe.',
};`,
    formula: 'Mehl = Gesamtteig / (1 + Hydratation + Salzfaktor + Hefefaktor); Wasser = Mehl × Hydratation',
    formulaExplanation: 'In der neapolitanischen Pizza-Tradition (AVPN) werden alle Zutaten als Prozentsatz der Mehlmenge (Bäckerprozente) angegeben. Eine Hydratation von 65 % bedeutet 650 g Wasser auf 1.000 g Mehl.',
    workedExample: {
      title: 'Beispiel: 4 neapolitanische Pizzen à 260 g mit 65 % Hydratation',
      inputValues: [{ label: 'Ballen', value: '4 Stück à 260 g (1.040 g Teig)' }, { label: 'Wasser', value: '65 %' }, { label: 'Salz', value: '3 %' }],
      steps: ['Teilungsfaktor = 1 + 0,65 + 0,03 + 0,002 = 1,682', 'Mehl = 1.040 / 1,682 = 618 g', 'Wasser = 618 × 0,65 = 402 g', 'Salz = 618 × 0,03 = 18,5 g'],
      result: '618 g Mehl, 402 g Wasser, 18,5 g Salz, ca. 1,2 g Hefe',
    },
    faqs: [
      { question: 'Welches Mehl eignet sich am besten für neapolitanische Pizza?', answer: 'Italienisches Weizenmehl vom Typ "Tipo 00" mit hohem Proteingehalt (W-Wert 280 bis 320, ca. 12-14 % Eiweiß) bildet ein dehnbares Glutengerüst für große Luftblasen im Rand (Cornicione).' },
      { question: 'Warum benötigt man für 24 Stunden Teigruhe so wenig Hefe?', answer: 'Bei langer, kühler Stück- und Stockgare (z. B. im Kühlschrank) haben die Hefebakterien viel Zeit, sich langsam zu vermehren. Dadurch wird der Teig extrem bekömmlich und aromatisch.' },
    ],
    relatedSlugs: ['hefe-umrechner', 'brot-backen-baeckermass-rechner', 'sauerteig-anstellgut-rechner'],
  },

  {
    id: 'brot-backen-baeckermass-rechner',
    slug: 'brot-backen-baeckermass-rechner',
    name: 'Bäckerprozente Rechner (Bäckermaß für Brot & Teigausbeute TA)',
    shortName: 'Bäckerprozente Rechner',
    category: 'kochen-backen',
    subcategory: 'Backzutaten',
    metaTitle: 'Bäckerprozente Rechner – Bäckermaß, Teigausbeute (TA) & Zutaten berechnen',
    metaDescription: 'Berechnen Sie Brotteige nach professionellen Bäckerprozenten (Mehl = 100 %) und Teigausbeute (TA 160 bis TA 180) für Mehl, Wasser, Hefe, Salz und Sauerteig.',
    h1: 'Bäckerprozente Rechner – Teigausbeute (TA) & Rezeptskalierung',
    shortDescription: 'Berechnet Brotrezepte nach Bäckerprozenten bezogen auf 100 % Mehl.',
    searchKeywords: ['baeckerprozente rechner brot backen', 'teigausbeute ta berechnen formel ta 170', 'baeckermath zutaten mehl 100 prozent', 'brotteig zutaten rechner sauerteig'],
    inputs: [
      { id: 'targetLoafG', label: 'Gewünschtes Gesamtgewicht des Teiglings', type: 'number', defaultValue: 1000, min: 300, max: 10000, step: 50, unit: 'g Teig' },
      { id: 'hydrationPercent', label: 'Flüssigkeitsanteil / Wasser (z. B. 70 % = TA 170)', type: 'number', defaultValue: 70, min: 50, max: 90, step: 1, unit: '%' },
      { id: 'saltPercent', label: 'Salzanteil (Standard 2,0 %)', type: 'number', defaultValue: 2.0, min: 1.0, max: 3.5, step: 0.1, unit: '%' },
      { id: 'sourdoughPercent', label: 'Sauerteiganteil / Anstellgut bezogen auf Mehl', type: 'number', defaultValue: 20, min: 0, max: 50, step: 5, unit: '%' },
    ],
    calculateCode: `const totalG = Number(inputs.targetLoafG) || 1000;
const waterPct = (Number(inputs.hydrationPercent) || 70) / 100;
const saltPct = (Number(inputs.saltPercent) || 2.0) / 100;
const sdPct = (Number(inputs.sourdoughPercent) || 20) / 100;

// Bäckerprozente: Mehl ist immer 100 % (1.0)
const totalSumPct = 1.0 + waterPct + saltPct + sdPct;

const flourG = totalG / totalSumPct;
const waterG = flourG * waterPct;
const saltG = flourG * saltPct;
const sourdoughG = flourG * sdPct;
const ta = 100 + (waterPct * 100);

return {
  primary: { id: 'flour', label: 'Hauptmehl (100 %)', value: flourG, formattedValue: formatNumber(flourG, 0) + ' g', highlight: true },
  secondary: [
    { id: 'water', label: 'Schüttwasser', value: waterG, formattedValue: formatNumber(waterG, 0) + ' g (ml)', highlight: true },
    { id: 'salt', label: 'Salz', value: saltG, formattedValue: formatNumber(saltG, 1) + ' g' },
    { id: 'sourdough', label: 'Sauerteig / Vorteig', value: sourdoughG, formattedValue: formatNumber(sourdoughG, 0) + ' g' },
    { id: 'taValue', label: 'Teigausbeute (TA)', value: ta, formattedValue: 'TA ' + Math.round(ta) },
  ],
  summaryText: 'Für einen ' + totalG + ' g Teigling bei TA ' + Math.round(ta) + ' benötigen Sie ' + formatNumber(flourG, 0) + ' g Mehl, ' + formatNumber(waterG, 0) + ' g Wasser, ' + formatNumber(sourdoughG, 0) + ' g Sauerteig und ' + formatNumber(saltG, 1) + ' g Salz.',
};`,
    formula: 'Bäckerprozente: Zutat (%) = (Gewicht Zutat / Gewicht Mehl) × 100; Teigausbeute TA = (Teigmasse / Mehlmasse) × 100',
    formulaExplanation: 'Im Bäckermaß ist die Gesamtmehlmenge immer die 100%-Basis. Eine Teigausbeute (TA) von 170 bedeutet, dass auf 100 Teile Mehl genau 70 Teile Wasser kommen.',
    workedExample: {
      title: 'Beispiel: 1.000 g Brotlaib mit TA 170 (70 % Wasser, 2 % Salz, 20 % Sauerteig)',
      inputValues: [{ label: 'Teiggewicht', value: '1.000 g' }, { label: 'TA', value: '170 (70 %)' }],
      steps: ['Summe = 100 % + 70 % + 2 % + 20 % = 192 %', 'Mehl = 1.000 g / 1,92 = 521 g', 'Wasser = 521 × 0,70 = 365 g', 'Sauerteig = 521 × 0,20 = 104 g', 'Salz = 521 × 0,02 = 10,4 g'],
      result: '521 g Mehl, 365 g Wasser, 104 g Sauerteig, 10,4 g Salz',
    },
    faqs: [
      { question: 'Was bedeutet eine hohe Teigausbeute (z. B. TA 175)?', answer: 'Je höher die Teigausbeute, desto weicher und saftiger ist der Teig und desto länger bleibt das gebackene Brot frisch. Sehr weiche Teige (hohe TA) erfordern jedoch Dehnen und Falten.' },
      { question: 'Warum wiegen Bäcker Wasser in Gramm statt Millilitern?', answer: 'Da 1 Gramm Wasser bei Küchentemperatur exakt 1 Milliliter entspricht, ist das Wiegen auf der digitalen Küchenwaage viel präziser als das Ablesen am Messbecher.' },
    ],
    relatedSlugs: ['pizza-teig-rechner', 'sauerteig-anstellgut-rechner', 'hefe-umrechner'],
  },
];

console.log('Building kochen with', calcs.length, 'calculators');
fs.writeFileSync(path.join(__dirname, 'calcs-kochen.json'), JSON.stringify(calcs, null, 2), 'utf8');
console.log('Saved calcs-kochen.json');
