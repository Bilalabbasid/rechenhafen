const fs = require('fs');
const path = require('path');

// Generate 22 Bauen & Renovieren calculators
const calcs = [
  {
    id: 'estrich-rechner',
    slug: 'estrich-rechner',
    name: 'Estrich Rechner (Zementestrich & Fließestrich Bedarf)',
    shortName: 'Estrich Rechner',
    category: 'bauen-renovieren',
    subcategory: 'Rohbau & Boden',
    metaTitle: 'Estrich Rechner – Zementestrich & Fließestrich Materialbedarf berechnen',
    metaDescription: 'Berechnen Sie den Estrichbedarf in m³, Tonnen und 25-kg-/40-kg-Säcken nach Fläche und Einbaudicke (z. B. 45 mm, 60 mm) inklusive Trocknungszeit-Richtwert.',
    h1: 'Estrich Rechner – Materialmenge & Sackanzahl für Zementestrich',
    shortDescription: 'Ermittelt den Estrichbedarf nach Raumfläche und Schichtdicke.',
    searchKeywords: ['estrich rechner sack', 'zementestrich bedarf berechnen', 'fliessestrich menge m2', 'estrich dicke fußbodenheizung'],
    inputs: [
      { id: 'area', label: 'Bodenfläche', type: 'number', defaultValue: 30, min: 1, max: 1000, step: 1, unit: 'm²' },
      { id: 'thickness', label: 'Estrichdicke', type: 'number', defaultValue: 50, min: 20, max: 120, step: 5, unit: 'mm' },
      {
        id: 'estrichType',
        label: 'Estrich-Art & Dichte',
        type: 'select',
        defaultValue: 'ct',
        options: [
          { value: 'ct', label: 'Zementestrich CT (ca. 2.000 kg/m³)' },
          { value: 'ca', label: 'Anhydrit- / Calciumsulfat-Fließestrich CA (ca. 2.100 kg/m³)' },
        ],
      },
      { id: 'sackSize', label: 'Sackgröße', type: 'select', defaultValue: '25', options: [{ value: '25', label: '25 kg Fertigestrich-Sack' }, { value: '40', label: '40 kg Sack' }] },
      { id: 'waste', label: 'Verschnitt & Unebenheitspuffer', type: 'number', defaultValue: 5, min: 0, max: 20, step: 1, unit: '%' },
    ],
    calculateCode: `const a = Number(inputs.area) || 0;
const tMm = Number(inputs.thickness) || 0;
const density = inputs.estrichType === 'ca' ? 2100 : 2000;
const sackKg = Number(inputs.sackSize) || 25;
const waste = 1 + ((Number(inputs.waste) || 0) / 100);

const volumeM3 = a * (tMm / 1000) * waste;
const weightKg = volumeM3 * density;
const sacks = Math.ceil(weightKg / sackKg);
const dryingDays = tMm <= 40 ? tMm * 1 : 40 + (tMm - 40) * 2; // Faustregel Belegreife

return {
  primary: { id: 'sacks', label: 'Benötigte Säcke Fertigestrich', value: sacks, formattedValue: sacks + ' Säcke (' + sackKg + ' kg)', highlight: true },
  secondary: [
    { id: 'volume', label: 'Volumen Einbauestrich', value: volumeM3, formattedValue: formatNumber(volumeM3, 2) + ' m³' },
    { id: 'weightTonnes', label: 'Gesamtgewicht ca.', value: weightKg / 1000, formattedValue: formatNumber(weightKg / 1000, 2) + ' Tonnen' },
    { id: 'dryingTime', label: 'Richtwert Belegreife (Trocknung)', value: dryingDays, formattedValue: 'ca. ' + dryingDays + ' Tage' },
  ],
  summaryText: 'Für ' + a + ' m² Fläche bei ' + tMm + ' mm Schichtdicke benötigen Sie ca. ' + formatNumber(volumeM3, 2) + ' m³ Estrich (' + sacks + ' Säcke à ' + sackKg + ' kg).',
};`,
    formula: 'Volumen = Fläche (m²) × Dicke (m) × Verschnittfaktor; Säcke = (Volumen × Dichte) / Sackgewicht',
    formulaExplanation: 'Bei Zementestrich rechnet man mit ca. 20 kg Trockenmörtel pro m² je 1 cm Schichtdicke. Für Heizestrich auf Dämmung sind in der Regel mindestens 45 mm Überdeckung der Heizrohre vorgeschrieben.',
    workedExample: {
      title: 'Beispiel: 30 m² Wohnzimmer mit 50 mm Zementestrich',
      inputValues: [{ label: 'Fläche', value: '30 m²' }, { label: 'Dicke', value: '50 mm' }, { label: 'Sackgröße', value: '25 kg' }],
      steps: ['Volumen: 30 × 0,050 × 1,05 = 1,575 m³', 'Gewicht: 1,575 m³ × 2.000 kg/m³ = 3.150 kg', 'Säcke: 3.150 / 25 = 126 Säcke'],
      result: '126 Säcke à 25 kg (ca. 3,15 t)',
    },
    faqs: [
      { question: 'Wann ist Zementestrich belegreif für Fliesen oder Parkett?', answer: 'Zementestrich trocknet die ersten 4 cm ca. 1 Woche pro cm, danach 2 Wochen pro weiterem cm. Für Parkett ist eine Restfeuchte von max. 1,8 CM-% (mit Fußbodenheizung) erforderlich.' },
      { question: 'Was ist besser: Zementestrich oder Fließestrich?', answer: 'Fließestrich umschließt Heizrohre blasenfrei und trocknet schneller, ist jedoch feuchteempfindlich und für Nassräume ungeeignet. Zementestrich ist universell und wasserbeständig.' },
    ],
    relatedSlugs: ['betonrechner', 'bodenbelag-rechner', 'fliesenkleber-rechner'],
  },

  {
    id: 'daemmung-u-wert-rechner',
    slug: 'daemmung-u-wert-rechner',
    name: 'Dämmung U-Wert Rechner (Wärmedurchgang & Dämmstoffdicke)',
    shortName: 'U-Wert & Dämmung',
    category: 'bauen-renovieren',
    subcategory: 'Dämmung & Energie',
    metaTitle: 'Dämmung U-Wert Rechner – Dämmstoffdicke & Wärmedurchgangskoeffizient',
    metaDescription: 'Berechnen Sie den U-Wert (W/m²K) und die erforderliche Dämmstärke nach GEG 2024 für WLG 032, WLG 035, WLG 040 an Wand, Dach und Kellerdecke.',
    h1: 'Dämmung U-Wert Rechner – Dämmstärke & Wärmeschutz nach GEG',
    shortDescription: 'Berechnet den U-Wert und die nötige Dämmstoffdicke nach Wärmeleitgruppe.',
    searchKeywords: ['u wert rechner daemmung', 'geg u wert fassade dach', 'daemmstoffdicke berechnen wlg 035', 'waermedurchgangskoeffizient rechner'],
    inputs: [
      {
        id: 'component',
        label: 'Bauteil & gesetzlicher GEG-Maximalwert',
        type: 'select',
        defaultValue: 'wall',
        options: [
          { value: 'wall', label: 'Außenwand Fassade (GEG max. 0,24 W/m²K)' },
          { value: 'roof', label: 'Steildach / oberste Geschossdecke (GEG max. 0,14 W/m²K)' },
          { value: 'basement', label: 'Kellerdecke gegen unbeheizt (GEG max. 0,30 W/m²K)' },
        ],
      },
      {
        id: 'wlg',
        label: 'Wärmeleitgruppe (WLG / Lambda-Wert)',
        type: 'select',
        defaultValue: '035',
        options: [
          { value: '032', label: 'WLG 032 (λ = 0,032 W/mK – Hochleistungsdämmung)' },
          { value: '035', label: 'WLG 035 (λ = 0,035 W/mK – Standard Mineralwolle/EPS)' },
          { value: '040', label: 'WLG 040 (λ = 0,040 W/mK – Holzfaser/Standardwolle)' },
          { value: '022', label: 'WLG 022 (λ = 0,022 W/mK – PIR/PUR Hartschaum)' },
        ],
      },
      { id: 'thickness', label: 'Geplante Dämmstoffdicke', type: 'number', defaultValue: 160, min: 40, max: 400, step: 10, unit: 'mm' },
    ],
    calculateCode: `const tMm = Number(inputs.thickness) || 0;
const tM = tMm / 1000;
const lambda = Number(inputs.wlg) / 1000;
// R_se + R_si ca. 0.17 (Wand), R_daemm = d / lambda
const rThermal = 0.17 + (tM / lambda);
const uWert = 1 / rThermal;

const gegLimit = inputs.component === 'roof' ? 0.14 : inputs.component === 'wall' ? 0.24 : 0.30;
const gegCompliant = uWert <= gegLimit;
// Erforderliche Dicke für GEG:
const rReq = 1 / gegLimit;
const rInsulationReq = Math.max(0, rReq - 0.17);
const reqThicknessMm = Math.ceil(rInsulationReq * lambda * 1000);

return {
  primary: { id: 'uWert', label: 'Erreichter U-Wert der Dämmung', value: uWert, formattedValue: formatNumber(uWert, 3) + ' W/(m²·K)', highlight: true },
  secondary: [
    { id: 'gegCheck', label: 'GEG-Anforderung erfüllt?', value: gegCompliant ? 1 : 0, formattedValue: gegCompliant ? 'Ja (max. ' + formatNumber(gegLimit, 2) + ' W/m²K)' : 'Nein (zu geringe Dämmung)' },
    { id: 'reqThickness', label: 'Mindestdicke für GEG-Konformität', value: reqThicknessMm, formattedValue: reqThicknessMm + ' mm' },
    { id: 'rValue', label: 'Wärmedurchlasswiderstand R', value: rThermal, formattedValue: formatNumber(rThermal, 2) + ' (m²·K)/W' },
  ],
  summaryText: 'Mit ' + tMm + ' mm Dämmstoff (WLG ' + inputs.wlg + ') erreichen Sie einen U-Wert von ' + formatNumber(uWert, 3) + ' W/(m²·K). Gesetzliche GEG-Vorgabe: ' + (gegCompliant ? 'vollständig erfüllt!' : 'nicht erfüllt, mindestens ' + reqThicknessMm + ' mm nötig!'),
};`,
    formula: 'U = 1 / (R_si + d/λ + R_se); R = d / λ',
    formulaExplanation: 'Je kleiner der U-Wert, desto besser ist die Dämmwirkung und desto geringer der winterliche Wärmeverlust des Gebäudes.',
    workedExample: {
      title: 'Beispiel: 160 mm Fassadendämmung WLG 035',
      inputValues: [{ label: 'Bauteil', value: 'Fassade' }, { label: 'Dicke', value: '160 mm' }, { label: 'WLG', value: '035 (λ = 0,035)' }],
      steps: ['R_Dämm = 0,160 / 0,035 = 4,571 m²K/W', 'R_ges = 4,571 + 0,17 = 4,741', 'U = 1 / 4,741 = 0,211 W/(m²K)'],
      result: '0,211 W/(m²K) (GEG max. 0,24 erfüllt)',
    },
    faqs: [
      { question: 'Was bedeutet WLG 035?', answer: 'WLG steht für Wärmeleitgruppe. WLG 035 bedeutet, dass der Dämmstoff eine Wärmeleitfähigkeit von 0,035 Watt pro Meter und Kelvin (W/mK) besitzt. Je niedriger die Zahl, desto schlanker kann die Dämmung sein.' },
      { question: 'Welche Förderung gibt es bei Unterschreiten des GEG-U-Werts?', answer: 'Die KfW und BAFA fördern energetische Sanierungen, wenn der U-Wert die GEG-Mindestanforderungen deutlich übertrifft (z. B. Außenwand U <= 0,20 W/m²K).' },
    ],
    relatedSlugs: ['farbmengen-rechner', 'heizkostenrechner', 'gasverbrauchsrechner'],
  },

  {
    id: 'dachflaeche-rechner',
    slug: 'dachflaeche-rechner',
    name: 'Dachfläche Rechner (Satteldach, Pultdach & Dachneigung)',
    shortName: 'Dachfläche Rechner',
    category: 'bauen-renovieren',
    subcategory: 'Dach & Fassade',
    metaTitle: 'Dachfläche Rechner – Dachflächenberechnung nach Grundfläche & Neigung',
    metaDescription: 'Berechnen Sie die echte Dachfläche für Satteldach, Pultdach und Walmdach nach Grundrissmaßen, Dachneigung in Grad oder Prozent und Dachüberstand.',
    h1: 'Dachfläche Rechner – Echte Dachfläche nach Neigung & Maßen',
    shortDescription: 'Ermittelt die Quadratmeter Dachfläche nach Dachneigung und Grundriss.',
    searchKeywords: ['dachflaeche rechner neigung', 'satteldach flaeche berechnen cosinus', 'dach quadratmeter berechnen dachziegel', 'dachueberstand dachflaeche'],
    inputs: [
      {
        id: 'roofType',
        label: 'Dachform',
        type: 'select',
        defaultValue: 'saddle',
        options: [
          { value: 'saddle', label: 'Satteldach (Giebeldach, 2 Dachhälften)' },
          { value: 'pult', label: 'Pultdach (1 geneigte Dachfläche)' },
        ],
      },
      { id: 'houseLength', label: 'Hauslänge (Giebelseite/Trauflänge)', type: 'number', defaultValue: 10, min: 2, max: 100, step: 0.5, unit: 'm' },
      { id: 'houseWidth', label: 'Hausbreite', type: 'number', defaultValue: 8, min: 2, max: 100, step: 0.5, unit: 'm' },
      { id: 'roofPitchDeg', label: 'Dachneigung in Grad', type: 'number', defaultValue: 35, min: 5, max: 70, step: 1, unit: '°' },
      { id: 'overhang', label: 'Dachüberstand ringsum', type: 'number', defaultValue: 0.5, min: 0, max: 2, step: 0.1, unit: 'm' },
    ],
    calculateCode: `const l = Number(inputs.houseLength) || 0;
const w = Number(inputs.houseWidth) || 0;
const pitch = Number(inputs.roofPitchDeg) || 0;
const over = Number(inputs.overhang) || 0;
const isSaddle = inputs.roofType === 'saddle';

const effectiveLength = l + (2 * over);
const effectiveWidth = w + (2 * over);
const rad = (pitch * Math.PI) / 180;
const cosPitch = Math.cos(rad);

let totalRoofArea = 0;
let rafterLength = 0;

if (isSaddle) {
  // Jede Dachseite überspannt die halbe Breite
  rafterLength = (effectiveWidth / 2) / cosPitch;
  totalRoofArea = 2 * (effectiveLength * rafterLength);
} else {
  // Pultdach überspannt volle Breite
  rafterLength = effectiveWidth / cosPitch;
  totalRoofArea = effectiveLength * rafterLength;
}

const tilesCount = Math.ceil(totalRoofArea * 12); // Ca. 11-13 Dachziegel pro m²

return {
  primary: { id: 'roofArea', label: 'Gesamte Dachfläche', value: totalRoofArea, formattedValue: formatNumber(totalRoofArea, 2) + ' m²', highlight: true },
  secondary: [
    { id: 'rafterLength', label: 'Länge der Dachsparren (Traufe bis First)', value: rafterLength, formattedValue: formatNumber(rafterLength, 2) + ' m' },
    { id: 'tilesCount', label: 'Dachziegel-Bedarf ca. (12 Stk./m²)', value: tilesCount, formattedValue: tilesCount + ' Stück' },
    { id: 'groundArea', label: 'Überdachte Grundfläche', value: effectiveLength * effectiveWidth, formattedValue: formatNumber(effectiveLength * effectiveWidth, 2) + ' m²' },
  ],
  summaryText: 'Die tatsächliche Dachfläche beträgt ' + formatNumber(totalRoofArea, 2) + ' m². Bei Standard-Dachpfannen (ca. 12 Stk./m²) benötigen Sie rund ' + tilesCount + ' Ziegel.',
};`,
    formula: 'Dachfläche = Grundfläche / cos(Neigungswinkel) (plus Dachüberstände)',
    formulaExplanation: 'Da die Dachfläche schräg im Raum steht, teilt man die horizontale Grundfläche durch den Kosinus des Neigungswinkels.',
    workedExample: {
      title: 'Beispiel: Satteldach 10 m × 8 m mit 35° Neigung und 0,5 m Überstand',
      inputValues: [{ label: 'Länge', value: '10 m (+ 1 m Überstand)' }, { label: 'Breite', value: '8 m (+ 1 m Überstand)' }, { label: 'Neigung', value: '35°' }],
      steps: ['Sparrenlänge = (9 / 2) / cos(35°) = 4,5 / 0,8192 = 5,49 m', 'Fläche: 2 × (11 × 5,49) = 120,85 m²'],
      result: '120,85 m² Dachfläche',
    },
    faqs: [
      { question: 'Wie viele Dachpfannen braucht man pro Quadratmeter?', answer: 'Handelsübliche Tondachziegel und Betondachsteine (wie Frankfurter Pfanne) benötigen zwischen 10 und 14 Stück pro m², im Mittel rechnet man mit 12 Stück/m².' },
      { question: 'Wie rechnet man Dachneigung von Prozent in Grad um?', answer: 'Winkel (Grad) = arctan(Prozent / 100) × (180 / π). Ein Dach mit 100 % Steigung entspricht exakt 45° Neigung.' },
    ],
    relatedSlugs: ['daemmung-u-wert-rechner', 'regenwasser-zisterne-rechner', 'farbmengen-rechner'],
  },

  {
    id: 'bausteine-mauerwerk-rechner',
    slug: 'bausteine-mauerwerk-rechner',
    name: 'Mauersteine Rechner (Bedarf nach Wandfläche & Steinformat)',
    shortName: 'Mauersteine Rechner',
    category: 'bauen-renovieren',
    subcategory: 'Rohbau & Boden',
    metaTitle: 'Mauersteine Rechner – Ziegel- & Porenbeton-Bedarf nach Wandfläche',
    metaDescription: 'Berechnen Sie den Bedarf an Mauersteinen (NF, DF, 2DF, Planstein 24er/36er) und Mörtel nach Wandfläche in m² abzüglich Fenster- und Türöffnungen.',
    h1: 'Mauersteine Rechner – Steinanzahl & Mörtelbedarf ermitteln',
    shortDescription: 'Ermittelt die Stückzahl an Mauerziegeln und Mörtel für eine Wand.',
    searchKeywords: ['mauersteine bedarf berechnen', 'ziegelsteine rechner wandflaeche', 'porenbeton planstein stueckzahl m2', 'moertel mauerwerk rechner'],
    inputs: [
      { id: 'wallLength', label: 'Wandlänge', type: 'number', defaultValue: 6, min: 0.5, max: 100, step: 0.1, unit: 'm' },
      { id: 'wallHeight', label: 'Wandhöhe', type: 'number', defaultValue: 2.5, min: 0.5, max: 10, step: 0.05, unit: 'm' },
      { id: 'openingsArea', label: 'Abzug für Fenster & Türen', type: 'number', defaultValue: 3, min: 0, max: 50, step: 0.5, unit: 'm²' },
      {
        id: 'stoneFormat',
        label: 'Steinformat',
        type: 'select',
        defaultValue: 'plan24',
        options: [
          { value: 'plan24', label: 'Planstein 24er (Porenbeton/Kalksandstein, ca. 8 Stk./m²)' },
          { value: 'plan36', label: 'Planstein 36,5er (Außenwand, ca. 8 Stk./m²)' },
          { value: '2df', label: '2DF Ziegel/Kalksandstein (240 × 115 × 113 mm, ca. 32 Stk./m²)' },
          { value: 'nf', label: 'NF Normalformat (240 × 115 × 71 mm, ca. 48 Stk./m²)' },
        ],
      },
      { id: 'waste', label: 'Verschnitt & Bruch', type: 'number', defaultValue: 5, min: 0, max: 15, step: 1, unit: '%' },
    ],
    calculateCode: `const l = Number(inputs.wallLength) || 0;
const h = Number(inputs.wallHeight) || 0;
const open = Number(inputs.openingsArea) || 0;
const gross = l * h;
const netArea = Math.max(0, gross - open);
const waste = 1 + ((Number(inputs.waste) || 0) / 100);

let stonesPerM2 = 8;
let mortarKgPerM2 = 2.5; // Dünnbettmörtel

if (inputs.stoneFormat === '2df') {
  stonesPerM2 = 32;
  mortarKgPerM2 = 18; // Normalmörtel
} else if (inputs.stoneFormat === 'nf') {
  stonesPerM2 = 48;
  mortarKgPerM2 = 25;
} else if (inputs.stoneFormat === 'plan36') {
  stonesPerM2 = 8;
  mortarKgPerM2 = 3.5;
}

const totalStones = Math.ceil(netArea * stonesPerM2 * waste);
const totalMortarKg = Math.ceil(netArea * mortarKgPerM2 * waste);

return {
  primary: { id: 'stones', label: 'Benötigte Mauersteine', value: totalStones, formattedValue: totalStones + ' Stück', highlight: true },
  secondary: [
    { id: 'netArea', label: 'Netto-Wandfläche', value: netArea, formattedValue: formatNumber(netArea, 2) + ' m²' },
    { id: 'mortar', label: 'Mörtelbedarf ca.', value: totalMortarKg, formattedValue: totalMortarKg + ' kg (' + Math.ceil(totalMortarKg / 25) + ' Säcke à 25 kg)' },
  ],
  summaryText: 'Für ' + formatNumber(netArea, 2) + ' m² Mauerwerk benötigen Sie rund ' + totalStones + ' Steine und ' + totalMortarKg + ' kg Mörtel.',
};`,
    formula: 'Steine = Nettofläche (m²) × Steine/m² × Verschnittfaktor',
    formulaExplanation: 'Je größer das Steinformat (z. B. Plansteine im Dünnbettverfahren), desto schneller der Baufortschritt und desto geringer der Mörtelverbrauch.',
    workedExample: {
      title: 'Beispiel: 15 m² Wand mit 2DF-Kalksandsteinen',
      inputValues: [{ label: 'Wandfläche', value: '15 m²' }, { label: 'Format', value: '2DF (32 Stk./m²)' }],
      steps: ['Steine: 15 m² × 32 × 1,05 = 504 Steine', 'Mörtel: 15 m² × 18 kg = 270 kg'],
      result: '504 Steine und 11 Säcke Mörtel (à 25 kg)',
    },
    faqs: [
      { question: 'Was ist der Unterschied zwischen Dünnbettmörtel und Dickbettmörtel?', answer: 'Dünnbettmörtel wird mit 1 bis 3 mm Schichtdicke bei maßhaltigen Plansteinen aufgetragen. Dickbettmörtel gleicht mit 12 mm Fuge Maßtoleranzen klassischer Ziegel aus.' },
      { question: 'Werden Fensteröffnungen bei Mauerarbeiten voll abgezogen?', answer: 'Nach VOB/C ATV DIN 18330 werden Öffnungen bis zu 2,5 m² Einzelfläche bei der Abrechnung übermessen, für die reine Materialbestellung zieht man jedoch die tatsächliche Fläche ab.' },
    ],
    relatedSlugs: ['betonrechner', 'estrich-rechner', 'putz-rechner'],
  },

  {
    id: 'fliesenkleber-rechner',
    slug: 'fliesenkleber-rechner',
    name: 'Fliesenkleber & Fugenmörtel Rechner (kg & Säcke nach m²)',
    shortName: 'Fliesenkleber Rechner',
    category: 'bauen-renovieren',
    subcategory: 'Rohbau & Boden',
    metaTitle: 'Fliesenkleber & Fugenmörtel Rechner – Verbrauch in kg & Säcken',
    metaDescription: 'Berechnen Sie den Bedarf an Fliesenkleber und Fugenbunt nach Quadratmetern, Zahnspachtel-Größe (6, 8, 10, 12 mm) und Fliesenabmessungen.',
    h1: 'Fliesenkleber Rechner – Materialbedarf für Fliesen & Fugen',
    shortDescription: 'Berechnet den Fliesenkleber- und Fugenmörtelbedarf nach Fläche und Zahnung.',
    searchKeywords: ['fliesenkleber rechner verbrauch kg m2', 'fugenmoertel rechner fliesen', 'zahnung fliesenkleber verbrauch', 'flexkleber saecke berechnen'],
    inputs: [
      { id: 'area', label: 'Fliesenfläche', type: 'number', defaultValue: 25, min: 1, max: 500, step: 1, unit: 'm²' },
      {
        id: 'notch',
        label: 'Zahnspachtel-Größe (Zahnung)',
        type: 'select',
        defaultValue: '8',
        options: [
          { value: '6', label: '6 mm Zahnung (Fliesen bis 20×20 cm, ca. 2,4 kg/m²)' },
          { value: '8', label: '8 mm Zahnung (Fliesen bis 30×60 cm, ca. 3,2 kg/m²)' },
          { value: '10', label: '10 mm Zahnung (Großformat bis 60×60 cm, ca. 4,0 kg/m²)' },
          { value: '12', label: '12 mm Zahnung / Mittelbett (Großformat ab 60×120 cm, ca. 5,0 kg/m²)' },
        ],
      },
      { id: 'jointWidth', label: 'Fugenbreite', type: 'number', defaultValue: 3, min: 1, max: 10, step: 0.5, unit: 'mm' },
      { id: 'waste', label: 'Verschnitt & Reserve', type: 'number', defaultValue: 10, min: 0, max: 25, step: 1, unit: '%' },
    ],
    calculateCode: `const a = Number(inputs.area) || 0;
const notch = inputs.notch;
const jointW = Number(inputs.jointWidth) || 3;
const waste = 1 + ((Number(inputs.waste) || 0) / 100);

let kgPerM2 = 3.2;
if (notch === '6') kgPerM2 = 2.4;
else if (notch === '10') kgPerM2 = 4.0;
else if (notch === '12') kgPerM2 = 5.0;

const adhesiveKg = a * kgPerM2 * waste;
const adhesiveSacks = Math.ceil(adhesiveKg / 25);
// Fugenmasse ca. 0.15 kg/m² je mm Fugenbreite
const groutKg = a * (jointW * 0.15) * waste;
const groutSacks = Math.ceil(groutKg / 5);

return {
  primary: { id: 'adhesiveSacks', label: 'Fliesenkleber (25-kg-Säcke)', value: adhesiveSacks, formattedValue: adhesiveSacks + ' Säcke (' + Math.round(adhesiveKg) + ' kg)', highlight: true },
  secondary: [
    { id: 'adhesiveKg', label: 'Fliesenkleber Gesamtgewicht', value: adhesiveKg, formattedValue: formatNumber(adhesiveKg, 1) + ' kg' },
    { id: 'groutKg', label: 'Fugenmörtel Gesamtbedarf', value: groutKg, formattedValue: formatNumber(groutKg, 1) + ' kg (' + groutSacks + ' Säcke à 5 kg)' },
  ],
  summaryText: 'Für ' + a + ' m² benötigen Sie ' + adhesiveSacks + ' Säcke Fliesenkleber (à 25 kg) sowie ca. ' + formatNumber(groutKg, 1) + ' kg Fugenbunt.',
};`,
    formula: 'Kleber = Fläche (m²) × Verbrauch nach Zahnung (kg/m²) × Verschnitt; Fuge = Fläche × Fugenbreite × 0,15 kg',
    formulaExplanation: 'Großformatige Fliesen erfordern eine größere Zahnung und das Buttering-Floating-Verfahren (Kleber auf Untergrund und Fliesenrücken), was den Kleberverbrauch erhöht.',
    workedExample: {
      title: 'Beispiel: 25 m² Bad mit 8-mm-Zahnung',
      inputValues: [{ label: 'Fläche', value: '25 m²' }, { label: 'Zahnung', value: '8 mm (3,2 kg/m²)' }, { label: 'Puffer', value: '10 %' }],
      steps: ['Kleber = 25 × 3,2 × 1,10 = 88 kg', 'Säcke = 88 / 25 = 3,52 -> 4 Säcke à 25 kg'],
      result: '4 Säcke Fliesenkleber (100 kg)',
    },
    faqs: [
      { question: 'Welcher Fliesenkleber eignet sich für Fußbodenheizung?', answer: 'Bei Fußbodenheizungen und auf Holzböden ist zwingend ein flexibler Kleber (Klassifizierung C2 TE S1 oder S2 nach DIN EN 12004) erforderlich, um thermische Spannungen auszugleichen.' },
      { question: 'Wann kann man frisch verlegte Fliesen verfugen?', answer: 'In der Regel nach 24 Stunden Trocknungszeit. Bei Schnellklebern kann bereits nach 3 bis 4 Stunden verfugt werden.' },
    ],
    relatedSlugs: ['bodenbelag-rechner', 'estrich-rechner', 'farbmengen-rechner'],
  },

  {
    id: 'aushub-erdarbeiten-rechner',
    slug: 'aushub-erdarbeiten-rechner',
    name: 'Aushub & Erdarbeiten Rechner (Baugrube m³, Tonnen & LKW-Fahrten)',
    shortName: 'Aushub Rechner',
    category: 'bauen-renovieren',
    subcategory: 'Rohbau & Boden',
    metaTitle: 'Aushub & Erdarbeiten Rechner – Baugrube m³, Auflockerung & LKW',
    metaDescription: 'Berechnen Sie das Erdreich-Aushubvolumen in m³, die Auflockerung (Auflockerungsfaktor 1,2 bis 1,3), das Gewicht in Tonnen und die Anzahl 4-Achs-LKW-Fahrten.',
    h1: 'Aushub Rechner – Erdvolumen, Tonnen & LKW-Entsorgung',
    shortDescription: 'Berechnet Baugrubenaushub, Auflockerung und benötigte LKW-Ladungen.',
    searchKeywords: ['aushub rechner m3 tonnen', 'baugrube aushubvolumen auflockerungsfaktor', 'erdarbeiten lkw fahrten rechner', 'erde ausheben gewicht berechnen'],
    inputs: [
      { id: 'pitLength', label: 'Grubenlänge', type: 'number', defaultValue: 10, min: 1, max: 100, step: 0.5, unit: 'm' },
      { id: 'pitWidth', label: 'Grubenbreite', type: 'number', defaultValue: 8, min: 1, max: 100, step: 0.5, unit: 'm' },
      { id: 'pitDepth', label: 'Aushubtiefe', type: 'number', defaultValue: 1.5, min: 0.2, max: 10, step: 0.1, unit: 'm' },
      {
        id: 'soilType',
        label: 'Bodenart & Auflockerung',
        type: 'select',
        defaultValue: 'loam',
        options: [
          { value: 'sand', label: 'Sand / Kies (Faktor 1,15, Dichte 1,7 t/m³ fest)' },
          { value: 'loam', label: 'Lehm / Mutterboden (Faktor 1,25, Dichte 1,8 t/m³ fest)' },
          { value: 'clay', label: 'Ton / bindiger Boden (Faktor 1,35, Dichte 1,9 t/m³ fest)' },
        ],
      },
      { id: 'truckCapacity', label: 'LKW-Ladekapazität (4-Achser / Sattelkipper)', type: 'select', defaultValue: '18', options: [{ value: '14', label: '3-Achser Kipper (ca. 14 t)' }, { value: '18', label: '4-Achser Kipper (ca. 18 t)' }, { value: '25', label: 'Sattelzug (ca. 25 t)' }] },
    ],
    calculateCode: `const l = Number(inputs.pitLength) || 0;
const w = Number(inputs.pitWidth) || 0;
const d = Number(inputs.pitDepth) || 0;
const solidVolume = l * w * d;

let factor = 1.25;
let solidDensity = 1.8;
if (inputs.soilType === 'sand') { factor = 1.15; solidDensity = 1.7; }
else if (inputs.soilType === 'clay') { factor = 1.35; solidDensity = 1.9; }

const looseVolume = solidVolume * factor;
const totalTonnes = solidVolume * solidDensity;
const truckCap = Number(inputs.truckCapacity) || 18;
const truckLoads = Math.ceil(totalTonnes / truckCap);

return {
  primary: { id: 'looseVolume', label: 'Gelockertes Aushubvolumen (Transportvolumen)', value: looseVolume, formattedValue: formatNumber(looseVolume, 1) + ' m³', highlight: true },
  secondary: [
    { id: 'solidVolume', label: 'Festmaß in der Grube', value: solidVolume, formattedValue: formatNumber(solidVolume, 1) + ' m³' },
    { id: 'tonnes', label: 'Gesamtgewicht des Erdreichs', value: totalTonnes, formattedValue: formatNumber(totalTonnes, 1) + ' Tonnen' },
    { id: 'trucks', label: 'Benötigte LKW-Ladungen (' + truckCap + ' t)', value: truckLoads, formattedValue: truckLoads + ' Fahrten' },
  ],
  summaryText: 'Aus ' + formatNumber(solidVolume, 1) + ' m³ festem Boden entstehen durch Auflockerung ca. ' + formatNumber(looseVolume, 1) + ' m³ loser Aushub (' + formatNumber(totalTonnes, 1) + ' Tonnen, ca. ' + truckLoads + ' LKW-Fahrten).',
};`,
    formula: 'Loses Volumen = Festvolumen (L × B × T) × Auflockerungsfaktor; Tonnen = Festvolumen × Dichte',
    formulaExplanation: 'Beim Ausgraben lockert sich Erdreich auf und vergrößert sein Volumen um 15 % bis 35 %. Dieser Wert ist entscheidend für die Container- und LKW-Disposition.',
    workedExample: {
      title: 'Beispiel: Poolgrube 8 m × 4 m × 1,5 m in Lehmboden',
      inputValues: [{ label: 'Größe', value: '8 m × 4 m × 1,5 m' }, { label: 'Boden', value: 'Lehm (Faktor 1,25, 1,8 t/m³)' }],
      steps: ['Festmaß = 8 × 4 × 1,5 = 48 m³', 'Loses Maß = 48 × 1,25 = 60 m³', 'Gewicht = 48 × 1,8 t = 86,4 t', 'LKW (18 t) = 86,4 / 18 = 5 LKW-Fahrten'],
      result: '60 m³ loser Aushub (86,4 t, 5 LKW)',
    },
    faqs: [
      { question: 'Was kostet die Entsorgung von Erdaushub?', answer: 'Unbelasteter Erdaushub (Bodenklasse Z0) kostet je nach Region und Deponie etwa 15 bis 35 Euro pro Tonne plus Frachtkosten.' },
      { question: 'Muss bei der Baugrube eine Böschung eingeplant werden?', answer: 'Ja, nach DIN 4124 müssen Gruben ab 1,25 m Tiefe abgeböscht (Winkel meist 45° bis 60°) oder verbaut werden, was das Aushubvolumen zusätzlich vergrößert.' },
    ],
    relatedSlugs: ['betonrechner', 'fundament-rechner', 'pflastersteine-rechner'],
  },

  {
    id: 'pflastersteine-rechner',
    slug: 'pflastersteine-rechner',
    name: 'Pflastersteine Rechner (Bedarf nach Fläche, Fugen & Bettungssplitt)',
    shortName: 'Pflastersteine Rechner',
    category: 'bauen-renovieren',
    subcategory: 'Garten & Außenanlagen',
    metaTitle: 'Pflastersteine Rechner – Steinbedarf, Quadratmeter & Bettungssplitt',
    metaDescription: 'Berechnen Sie die benötigte Anzahl Pflastersteine, Fläche in m² mit Verschnitt (5-10 %) und die Menge an Splitt/Sand für das Pflasterbett.',
    h1: 'Pflastersteine Rechner – Pflastersteine & Bettungssplitt berechnen',
    shortDescription: 'Ermittelt Steinanzahl und Splittmenge für Hof, Einfahrt oder Terrasse.',
    searchKeywords: ['pflastersteine rechner quadratmeter', 'pflaster bedarf berechnen einfahrt terrasse', 'splittbett dicke menge berechnen', 'pflaster verschnitt prozent'],
    inputs: [
      { id: 'area', label: 'Zu pflasternde Fläche', type: 'number', defaultValue: 40, min: 1, max: 1000, step: 1, unit: 'm²' },
      {
        id: 'stoneFormat',
        label: 'Pflasterstein-Format (Länge × Breite)',
        type: 'select',
        defaultValue: '20x10',
        options: [
          { value: '20x10', label: 'Rechteckpflaster 20 × 10 cm (50 Stk./m²)' },
          { value: '20x20', label: 'Quadratpflaster 20 × 20 cm (25 Stk./m²)' },
          { value: '30x20', label: 'Großformat 30 × 20 cm (16,7 Stk./m²)' },
          { value: '10x10', label: 'Kleinpflaster 10 × 10 cm (100 Stk./m²)' },
        ],
      },
      { id: 'beddingDepth', label: 'Dicke des Splittbetts', type: 'number', defaultValue: 4, min: 3, max: 6, step: 0.5, unit: 'cm' },
      { id: 'waste', label: 'Verschnitt durch Zuschneiden', type: 'number', defaultValue: 8, min: 0, max: 20, step: 1, unit: '%' },
    ],
    calculateCode: `const a = Number(inputs.area) || 0;
const waste = 1 + ((Number(inputs.waste) || 0) / 100);
const totalAreaWithWaste = a * waste;

let stonesPerM2 = 50;
if (inputs.stoneFormat === '20x20') stonesPerM2 = 25;
else if (inputs.stoneFormat === '30x20') stonesPerM2 = 16.7;
else if (inputs.stoneFormat === '10x10') stonesPerM2 = 100;

const totalStones = Math.ceil(totalAreaWithWaste * stonesPerM2);
const bedM3 = a * (Number(inputs.beddingDepth) / 100);
const gritTonnes = bedM3 * 1.6; // Dichte Brechsand/Splitt ca. 1.6 t/m³

return {
  primary: { id: 'stones', label: 'Benötigte Pflastersteine', value: totalStones, formattedValue: totalStones + ' Stück (' + formatNumber(totalAreaWithWaste, 1) + ' m²)', highlight: true },
  secondary: [
    { id: 'gritTonnes', label: 'Bettungssplitt (2/5 mm Körnung)', value: gritTonnes, formattedValue: formatNumber(gritTonnes, 2) + ' Tonnen (' + formatNumber(bedM3, 2) + ' m³)' },
    { id: 'effectiveArea', label: 'Bestellfläche inkl. Verschnitt', value: totalAreaWithWaste, formattedValue: formatNumber(totalAreaWithWaste, 2) + ' m²' },
  ],
  summaryText: 'Für ' + a + ' m² Fläche benötigen Sie rund ' + totalStones + ' Pflastersteine sowie ca. ' + formatNumber(gritTonnes, 2) + ' Tonnen Bettungssplitt.',
};`,
    formula: 'Steine = Fläche (m²) × Steine/m² × Verschnittfaktor; Splitt = Fläche × Schichthöhe × Dichte (1,6 t/m³)',
    formulaExplanation: 'Bei diagonal verlegtem Pflaster oder vielen Kurvenkanten empfiehlt sich ein Verschnittzuschlag von 10 % bis 12 % anstelle von 5 % bis 8 % bei geradem Verband.',
    workedExample: {
      title: 'Beispiel: 40 m² Hofeinfahrt mit Rechteckpflaster 20×10 cm',
      inputValues: [{ label: 'Fläche', value: '40 m²' }, { label: 'Format', value: '20 × 10 cm (50 Stk./m²)' }, { label: 'Verschnitt', value: '8 %' }],
      steps: ['Fläche mit Verschnitt = 40 × 1,08 = 43,2 m²', 'Steine = 43,2 × 50 = 2.160 Stück', 'Splitt (4 cm) = 40 × 0,04 × 1,6 = 2,56 Tonnen'],
      result: '2.160 Pflastersteine und 2,56 t Splitt',
    },
    faqs: [
      { question: 'Welcher Splitt eignet sich am besten als Pflasterbett?', answer: 'Optimal ist gewaschener Edelsplitt der Körnung 2/5 mm oder Brechsand-Splitt-Gemisch 0/5 mm in einer gleichmäßigen Dicke von 3 bis 5 cm.' },
      { question: 'Wie stabil muss der Unterbau für eine PKW-Einfahrt sein?', answer: 'Für PKW-Befahrung sind 20 bis 30 cm Schotter-Tragschicht (Körnung 0/32 mm Frostschutz), lagenweise verdichtet, zwingend vorgeschrieben.' },
    ],
    relatedSlugs: ['kies-splitt-rechner', 'aushub-erdarbeiten-rechner', 'bodenbelag-rechner'],
  },

  {
    id: 'trockenbau-gipskarton-rechner',
    slug: 'trockenbau-gipskarton-rechner',
    name: 'Trockenbau Gipskarton Rechner (Platten, Profile & Schrauben)',
    shortName: 'Trockenbau Rechner',
    category: 'bauen-renovieren',
    subcategory: 'Ausbau & Wand',
    metaTitle: 'Trockenbau Gipskarton Rechner – Platten, CW/UW-Profile & Schrauben',
    metaDescription: 'Berechnen Sie den Materialbedarf für Trockenbauwände: Gipskartonplatten (2000/2600 × 600/1250 mm), Ständerprofile (CW/UW), Schnellbauschrauben und Spachtelmasse.',
    h1: 'Trockenbau Rechner – Gipskartonplatten, Ständerwerk & Zubehör',
    shortDescription: 'Berechnet Gipskartonplatten, CW/UW-Profile, Schrauben und Spachtelmasse.',
    searchKeywords: ['trockenbau rechner gipskarton', 'staenderwerk cw uw profile berechnen', 'gipskartonplatten stueckzahl m2', 'schnellbauschrauben bedarf trockenbau'],
    inputs: [
      { id: 'wallLength', label: 'Wandlänge', type: 'number', defaultValue: 5, min: 1, max: 50, step: 0.2, unit: 'm' },
      { id: 'wallHeight', label: 'Wandhöhe', type: 'number', defaultValue: 2.6, min: 1.5, max: 5, step: 0.05, unit: 'm' },
      {
        id: 'cladding',
        label: 'Beplankung',
        type: 'select',
        defaultValue: 'double',
        options: [
          { value: 'single', label: 'Einfach beplankt (1 Lage je Seite, 2 m² Platten je m² Wand)' },
          { value: 'double', label: 'Doppelt beplankt (2 Lagen je Seite, Schallschutz, 4 m² je m² Wand)' },
        ],
      },
      {
        id: 'boardSize',
        label: 'Plattenformat',
        type: 'select',
        defaultValue: '2600x600',
        options: [
          { value: '2600x600', label: 'Einmannplatte 2.600 × 600 mm (1,56 m²)' },
          { value: '2000x600', label: 'Kompaktplatte 2.000 × 600 mm (1,20 m²)' },
          { value: '2500x1250', label: 'Großformat 2.500 × 1.250 mm (3,125 m²)' },
        ],
      },
      { id: 'waste', label: 'Verschnittzuschlag', type: 'number', defaultValue: 10, min: 0, max: 20, step: 1, unit: '%' },
    ],
    calculateCode: `const l = Number(inputs.wallLength) || 0;
const h = Number(inputs.wallHeight) || 0;
const wallArea = l * h;
const waste = 1 + ((Number(inputs.waste) || 0) / 100);
const multiplier = inputs.cladding === 'double' ? 4 : 2;

let boardM2 = 1.56;
if (inputs.boardSize === '2000x600') boardM2 = 1.20;
else if (inputs.boardSize === '2500x1250') boardM2 = 3.125;

const totalPlatesArea = wallArea * multiplier * waste;
const platesCount = Math.ceil(totalPlatesArea / boardM2);

// Ständerwerk:
// UW-Profile (Boden & Decke): 2 * Wandlänge
const uwMeters = Math.ceil(l * 2 * 1.05);
// CW-Profile (Ständer alle 62.5 cm + Anfang/Ende):
const cwCount = Math.ceil(l / 0.625) + 1;
const cwMeters = Math.ceil(cwCount * h * 1.05);

// Schrauben: ca. 15-20 Stk./m² Plattenfläche
const screwsCount = Math.ceil(totalPlatesArea * 18);
// Spachtelmasse ca. 0.8 kg/m² Wandfläche (einfach) oder 1.3 kg/m² (doppelt)
const fillerKg = Math.ceil(wallArea * (inputs.cladding === 'double' ? 1.3 : 0.8));

return {
  primary: { id: 'plates', label: 'Gipskartonplatten', value: platesCount, formattedValue: platesCount + ' Platten (' + formatNumber(totalPlatesArea, 1) + ' m²)', highlight: true },
  secondary: [
    { id: 'cwProfiles', label: 'CW-Ständerprofile vertikal', value: cwCount, formattedValue: cwCount + ' Stück (' + cwMeters + ' lfd. Meter)' },
    { id: 'uwProfiles', label: 'UW-Rahmenprofile (Boden/Decke)', value: uwMeters, formattedValue: uwMeters + ' lfd. Meter' },
    { id: 'screws', label: 'Schnellbauschrauben', value: screwsCount, formattedValue: 'ca. ' + screwsCount + ' Stück' },
    { id: 'filler', label: 'Fugenspachtel Masse', value: fillerKg, formattedValue: 'ca. ' + fillerKg + ' kg' },
  ],
  summaryText: 'Für ' + formatNumber(wallArea, 1) + ' m² Trockenbauwand benötigen Sie ' + platesCount + ' Gipskartonplatten, ' + cwCount + ' CW-Profile, ' + uwMeters + ' m UW-Profile und ca. ' + fillerKg + ' kg Spachtel.',
};`,
    formula: 'Platten = Wandfläche × Lagenfaktor (2 oder 4) × Verschnitt / Plattenfläche; CW-Profile = (Länge / 0,625 m) + 1',
    formulaExplanation: 'Der Standard-Achsabstand für Ständerprofile beträgt 62,5 cm (passend zur Plattenbreite von 60 cm bzw. 125 cm). Eine doppelte Beplankung verbessert Brand- und Schallschutz erheblich.',
    workedExample: {
      title: 'Beispiel: 5 m × 2,6 m Trennwand, doppelt beplankt mit 2,6×0,6m Platten',
      inputValues: [{ label: 'Wandmaß', value: '5 m × 2,6 m (13 m²)' }, { label: 'Beplankung', value: 'Doppelt (4-fach)' }, { label: 'Plattengröße', value: '1,56 m²' }],
      steps: ['Plattenfläche = 13 × 4 × 1,10 = 57,2 m²', 'Plattenanzahl = 57,2 / 1,56 = 37 Platten', 'CW-Profile = (5 / 0,625) + 1 = 9 Profile à 2,60 m'],
      result: '37 Gipskartonplatten und 9 CW-Ständer',
    },
    faqs: [
      { question: 'Welche Platten werden in Feuchträumen verwendet?', answer: 'Im Badezimmer müssen grün imprägnierte Gipskartonplatten (Typ GKBI bzw. H2 nach DIN EN 520) verwendet werden, um Schimmel- und Feuchteschäden vorzubeugen.' },
      { question: 'Warum versetzt man die Fugen bei doppelter Beplankung?', answer: 'Durch versetzte Fugen (mindestens 40 cm Versatz) wird Rissbildung verhindert und die Stabilität sowie der Schallschutz der Konstruktion maximiert.' },
    ],
    relatedSlugs: ['farbmengen-rechner', 'daemmung-u-wert-rechner', 'bausteine-mauerwerk-rechner'],
  },

  {
    id: 'fundament-rechner',
    slug: 'fundament-rechner',
    name: 'Fundament Rechner (Streifen-, Punkt- & Plattenfundament Beton)',
    shortName: 'Fundament Rechner',
    category: 'bauen-renovieren',
    subcategory: 'Rohbau & Boden',
    metaTitle: 'Fundament Rechner – Betonbedarf für Streifen-, Punkt- & Plattenfundament',
    metaDescription: 'Berechnen Sie das Betonvolumen in m³ und Tonnen für Streifenfundament (Gartenmauer/Garage), Punktfundament (Carport/Zaun) und Bodenplatte.',
    h1: 'Fundament Rechner – Betonmenge & Frosttiefe berechnen',
    shortDescription: 'Ermittelt das Betonvolumen für Streifen-, Punkt- und Plattenfundamente.',
    searchKeywords: ['fundament rechner beton m3', 'streifenfundament betonmenge berechnen', 'punktfundament carport zaun volumen', 'frostfreie tiefe fundament 80 cm'],
    inputs: [
      {
        id: 'fundamentType',
        label: 'Fundamentart',
        type: 'select',
        defaultValue: 'strip',
        options: [
          { value: 'strip', label: 'Streifenfundament (z. B. Gartenmauer, Garage)' },
          { value: 'point', label: 'Punktfundament (z. B. Pfosten, Carport, Spielturm)' },
          { value: 'slab', label: 'Fundamentplatte / Bodenplatte (z. B. Gartenhaus, Schuppen)' },
        ],
      },
      { id: 'dim1', label: 'Länge / Anzahl Punkte', type: 'number', defaultValue: 10, min: 1, max: 100, step: 0.5, unit: 'm bzw. Stk.' },
      { id: 'dim2', label: 'Breite / Durchmesser', type: 'number', defaultValue: 0.3, min: 0.1, max: 20, step: 0.05, unit: 'm' },
      { id: 'depth', label: 'Fundamenttiefe (Frosttiefe min. 0,80 m empfohlen)', type: 'number', defaultValue: 0.8, min: 0.2, max: 2, step: 0.05, unit: 'm' },
      { id: 'waste', label: 'Mehraushub / Schalungsverlust', type: 'number', defaultValue: 10, min: 0, max: 20, step: 1, unit: '%' },
    ],
    calculateCode: `const type = inputs.fundamentType;
const d1 = Number(inputs.dim1) || 0;
const d2 = Number(inputs.dim2) || 0;
const depth = Number(inputs.depth) || 0;
const waste = 1 + ((Number(inputs.waste) || 0) / 100);

let m3 = 0;
if (type === 'strip') {
  // Länge * Breite * Tiefe
  m3 = d1 * d2 * depth * waste;
} else if (type === 'point') {
  // Anzahl * (Breite * Breite * Tiefe)
  m3 = d1 * (d2 * d2 * depth) * waste;
} else {
  // Platte: Länge * Breite * Dicke
  m3 = d1 * d2 * depth * waste;
}

const tonnes = m3 * 2.35; // Frischbetondichte ca. 2.350 kg/m³
const sacks25kg = Math.ceil((m3 * 2100) / 25);

return {
  primary: { id: 'volume', label: 'Betonvolumen (Einbaumaß)', value: m3, formattedValue: formatNumber(m3, 2) + ' m³', highlight: true },
  secondary: [
    { id: 'weight', label: 'Gesamtgewicht Frischbeton', value: tonnes, formattedValue: formatNumber(tonnes, 2) + ' Tonnen' },
    { id: 'sacks', label: 'Trockenbeton in 25-kg-Säcken', value: sacks25kg, formattedValue: sacks25kg + ' Säcke' },
    { id: 'deliveryHint', label: 'Empfohlene Lieferform', value: 0, formattedValue: m3 >= 1.5 ? 'Transportbeton (Fahrmischer)' : 'Sackware zum Selbstanmischen' },
  ],
  summaryText: 'Für Ihr ' + (type === 'strip' ? 'Streifenfundament' : type === 'point' ? 'Punktfundament' : 'Plattenfundament') + ' benötigen Sie ca. ' + formatNumber(m3, 2) + ' m³ Beton (' + formatNumber(tonnes, 2) + ' t).',
};`,
    formula: 'Volumen = Querschnittsfläche × Länge (bzw. Tiefe) × Sicherheitszuschlag',
    formulaExplanation: 'In Deutschland gilt eine Tiefe von mindestens 80 cm als frostsicher, damit gefrierendes Bodenwasser das Fundament im Winter nicht anhebt und Risse verursacht.',
    workedExample: {
      title: 'Beispiel: 10 m Streifenfundament, 30 cm breit, 80 cm tief',
      inputValues: [{ label: 'Länge', value: '10 m' }, { label: 'Breite', value: '0,3 m' }, { label: 'Tiefe', value: '0,8 m (frostfrei)' }],
      steps: ['Volumen = 10 × 0,3 × 0,8 = 2,4 m³', 'Mit 10 % Toleranz: 2,4 × 1,1 = 2,64 m³ Beton', 'Gewicht = 2,64 × 2,35 = 6,2 Tonnen'],
      result: '2,64 m³ Beton (Transportbeton empfohlen)',
    },
    faqs: [
      { question: 'Ab welchem Betonvolumen lohnt sich ein Fahrmischer?', answer: 'Ab etwa 1,0 bis 1,5 m³ ist Transportbeton meist günstiger, zeitsparender und qualitativ hochwertiger als das mühsame Anmischen von 80+ Säcken Trockenbeton von Hand.' },
      { question: 'Welche Betonklasse benötigt man für ein Außenfundament?', answer: 'Für Außenfundamente mit Frostgefahr empfiehlt sich mindestens Beton der Festigkeitsklasse C20/25 oder C25/30 mit Expositionsklasse XF1.' },
    ],
    relatedSlugs: ['betonrechner', 'estrich-rechner', 'aushub-erdarbeiten-rechner'],
  },

  {
    id: 'schalungssteine-rechner',
    slug: 'schalungssteine-rechner',
    name: 'Schalungssteine Rechner (Steinanzahl, Füllbeton & Bewehrungsstahl)',
    shortName: 'Schalungssteine Rechner',
    category: 'bauen-renovieren',
    subcategory: 'Rohbau & Boden',
    metaTitle: 'Schalungssteine Rechner – Steine, Füllbeton & Bewehrung berechnen',
    metaDescription: 'Berechnen Sie die Anzahl Schalungssteine (17,5er, 24er, 30er), das Verfüllbetonvolumen in m³ und den Bedarf an Baustahl nach Wandmaßen.',
    h1: 'Schalungssteine Rechner – Steine, Füllbeton & Baustahl ermitteln',
    shortDescription: 'Berechnet Schalungssteine und Verfüllbeton für Stützmauern und Poolwände.',
    searchKeywords: ['schalungssteine rechner fuellbeton', 'betonschalungssteine menge stuetzmauer', 'fuellbeton m3 schalungsstein 24er', 'bewehrungsstahl schalungsstein'],
    inputs: [
      { id: 'wallLength', label: 'Mauerlänge', type: 'number', defaultValue: 8, min: 1, max: 100, step: 0.5, unit: 'm' },
      { id: 'wallHeight', label: 'Mauerhöhe', type: 'number', defaultValue: 1.5, min: 0.25, max: 5, step: 0.25, unit: 'm' },
      {
        id: 'stoneWidth',
        label: 'Steinbreite (Wandstärke)',
        type: 'select',
        defaultValue: '24',
        options: [
          { value: '17.5', label: '17,5 cm Breite (ca. 100 l Füllbeton / m²)' },
          { value: '24', label: '24,0 cm Breite (ca. 145 l Füllbeton / m²)' },
          { value: '30', label: '30,0 cm Breite (ca. 195 l Füllbeton / m²)' },
          { value: '36.5', label: '36,5 cm Breite (ca. 240 l Füllbeton / m²)' },
        ],
      },
      { id: 'waste', label: 'Verschnitt für Zuschnitte', type: 'number', defaultValue: 5, min: 0, max: 15, step: 1, unit: '%' },
    ],
    calculateCode: `const l = Number(inputs.wallLength) || 0;
const h = Number(inputs.wallHeight) || 0;
const wallArea = l * h;
const waste = 1 + ((Number(inputs.waste) || 0) / 100);

// Standardmaß Schalungsstein: 50 cm lang, 25 cm hoch -> 8 Steine pro m²
const stonesCount = Math.ceil(wallArea * 8 * waste);

let concretePerM2 = 145; // Liter
if (inputs.stoneWidth === '17.5') concretePerM2 = 100;
else if (inputs.stoneWidth === '30') concretePerM2 = 195;
else if (inputs.stoneWidth === '36.5') concretePerM2 = 240;

const concreteM3 = (wallArea * (concretePerM2 / 1000)) * waste;
// Bewehrungsstahl: 2 horizontale Stäbe je Schicht (alle 25 cm) + Vertikalstäbe alle 25 cm
const layers = Math.ceil(h / 0.25);
const horizontalRebarM = layers * 2 * l;
const verticalRebarM = Math.ceil(l / 0.25) * h;
const totalRebarMeters = Math.ceil((horizontalRebarM + verticalRebarM) * 1.1);

return {
  primary: { id: 'stones', label: 'Benötigte Schalungssteine (50×25 cm)', value: stonesCount, formattedValue: stonesCount + ' Stück', highlight: true },
  secondary: [
    { id: 'concreteM3', label: 'Verfüllbeton Gesamtvolumen', value: concreteM3, formattedValue: formatNumber(concreteM3, 2) + ' m³ (' + Math.ceil(concreteM3 * 2.3) + ' t)' },
    { id: 'rebar', label: 'Bewehrungsstahl (z. B. Torstahl Ø 10 mm)', value: totalRebarMeters, formattedValue: 'ca. ' + totalRebarMeters + ' lfd. Meter' },
    { id: 'wallArea', label: 'Ansichtsfläche der Mauer', value: wallArea, formattedValue: formatNumber(wallArea, 2) + ' m²' },
  ],
  summaryText: 'Für ' + formatNumber(wallArea, 2) + ' m² Wand benötigen Sie ' + stonesCount + ' Schalungssteine, ca. ' + formatNumber(concreteM3, 2) + ' m³ Verfüllbeton und rund ' + totalRebarMeters + ' m Bewehrungsstahl.',
};`,
    formula: 'Steine = Wandfläche × 8 Stk./m²; Füllbeton = Wandfläche × Betonbedarf/m² nach Steinbreite',
    formulaExplanation: 'Schalungssteine werden trocken im Verband aufgesetzt, mit Baustahl bewehrt und anschließend kammerweise mit flüssigem Beton verfüllt.',
    workedExample: {
      title: 'Beispiel: 8 m × 1,5 m Stützmauer mit 24er Schalungssteinen',
      inputValues: [{ label: 'Wandmaß', value: '8 m × 1,5 m (12 m²)' }, { label: 'Steinbreite', value: '24 cm (145 l/m²)' }],
      steps: ['Steine: 12 m² × 8 × 1,05 = 101 Steine', 'Füllbeton: 12 m² × 0,145 m³ × 1,05 = 1,83 m³'],
      result: '101 Schalungssteine und 1,83 m³ Verfüllbeton',
    },
    faqs: [
      { question: 'Wie hoch darf man Schalungssteine auf einmal verfüllen?', answer: 'In der Regel sollten nicht mehr als 3 bis 4 Steinreihen (ca. 75 bis 100 cm Höhe) in einem Durchgang mit Beton verfüllt und verdichtet werden, um ein Bersten der Steine zu vermeiden.' },
      { question: 'Braucht eine Mauer aus Schalungssteinen ein Fundament?', answer: 'Ja, zwingend ein frostsicheres Beton-Streifenfundament (mindestens 80 cm tief), aus dem Anschlussbewehrungseisen in die Schalungssteine ragen.' },
    ],
    relatedSlugs: ['betonrechner', 'fundament-rechner', 'bausteine-mauerwerk-rechner'],
  },

  {
    id: 'fassadenfarbe-rechner',
    slug: 'fassadenfarbe-rechner',
    name: 'Fassadenfarbe Rechner (Farbbedarf in Litern nach m² & Untergrund)',
    shortName: 'Fassadenfarbe Rechner',
    category: 'bauen-renovieren',
    subcategory: 'Dach & Fassade',
    metaTitle: 'Fassadenfarbe Rechner – Farbbedarf in Litern für Hausfassade berechnen',
    metaDescription: 'Berechnen Sie den Bedarf an Fassadenfarbe in Litern für 1 oder 2 Anstriche nach Hausmaßen, Fensterabzügen und Untergrund (Glattputz, Rauputz, Klinker).',
    h1: 'Fassadenfarbe Rechner – Farbmenge für den Außenanstrich ermitteln',
    shortDescription: 'Berechnet den Fassadenfarben-Bedarf nach Wandfläche und Putzart.',
    searchKeywords: ['fassadenfarbe rechner liter', 'hauswand streichen farbmenge berechnen', 'farbverbrauch rauputz liter m2', 'fassadenanstrich liter eimer'],
    inputs: [
      { id: 'perimeter', label: 'Hausumfang (Summe aller Fassadenseiten)', type: 'number', defaultValue: 36, min: 10, max: 200, step: 1, unit: 'm' },
      { id: 'wallHeight', label: 'Durchschnittliche Fassadenhöhe', type: 'number', defaultValue: 6, min: 2, max: 20, step: 0.2, unit: 'm' },
      { id: 'openingsArea', label: 'Abzug für Fenster, Türen & Tore', type: 'number', defaultValue: 30, min: 0, max: 150, step: 1, unit: 'm²' },
      {
        id: 'surface',
        label: 'Untergrund & Putzstruktur',
        type: 'select',
        defaultValue: 'rough',
        options: [
          { value: 'smooth', label: 'Glatter Putz / Voranstrich vorhanden (ca. 160 ml/m² je Anstrich)' },
          { value: 'medium', label: 'Mittlerer Scheibenputz 2 mm (ca. 220 ml/m² je Anstrich)' },
          { value: 'rough', label: 'Grober Reibeputz / stark saugend (ca. 300 ml/m² je Anstrich)' },
        ],
      },
      {
        id: 'coats',
        label: 'Anzahl Anstriche',
        type: 'select',
        defaultValue: '2',
        options: [
          { value: '1', label: '1 Anstrich (nur Auffrischung)' },
          { value: '2', label: '2 Anstriche (Grund- & Deckanstrich – empfohlen)' },
        ],
      },
    ],
    calculateCode: `const p = Number(inputs.perimeter) || 0;
const h = Number(inputs.wallHeight) || 0;
const gross = p * h;
const open = Number(inputs.openingsArea) || 0;
const netArea = Math.max(0, gross - open);

let mlPerM2 = 220;
if (inputs.surface === 'smooth') mlPerM2 = 160;
else if (inputs.surface === 'rough') mlPerM2 = 300;

const coats = Number(inputs.coats) || 2;
const totalLiters = (netArea * (mlPerM2 / 1000) * coats) * 1.05; // 5 % Reserve
const buckets10l = Math.ceil(totalLiters / 10);
const buckets15l = Math.ceil(totalLiters / 15);

return {
  primary: { id: 'liters', label: 'Benötigte Fassadenfarbe', value: totalLiters, formattedValue: formatNumber(totalLiters, 1) + ' Liter', highlight: true },
  secondary: [
    { id: 'buckets10l', label: 'Farbeimer (10-Liter-Gebinde)', value: buckets10l, formattedValue: buckets10l + ' Eimer' },
    { id: 'buckets15l', label: 'Alternativ: 15-Liter-Gebinde', value: buckets15l, formattedValue: buckets15l + ' Eimer' },
    { id: 'netArea', label: 'Reine Anstrichfläche (Netto)', value: netArea, formattedValue: formatNumber(netArea, 1) + ' m²' },
  ],
  summaryText: 'Für ' + formatNumber(netArea, 1) + ' m² Fassadenfläche bei ' + coats + ' Anstrichen benötigen Sie rund ' + formatNumber(totalLiters, 1) + ' Liter Fassadenfarbe (' + buckets10l + ' Eimer à 10 Liter).',
};`,
    formula: 'Farbe (Liter) = Nettofläche (m²) × Verbrauch (l/m²) × Anzahl Anstriche × 1,05',
    formulaExplanation: 'Rauputz hat durch seine Kornstruktur eine bis zu 50 % größere reale Oberfläche als glatte Wände, was den Farbbedarf spürbar steigert.',
    workedExample: {
      title: 'Beispiel: 186 m² Fassade mit 2 mm Scheibenputz (2 Anstriche)',
      inputValues: [{ label: 'Nettofläche', value: '186 m²' }, { label: 'Untergrund', value: 'Mittlerer Putz (0,22 l/m²)' }, { label: 'Anstriche', value: '2' }],
      steps: ['Pro Anstrich = 186 × 0,22 = 40,9 Liter', 'Zwei Anstriche mit Puffer = 40,9 × 2 × 1,05 = 85,9 Liter'],
      result: '86 Liter Fassadenfarbe (9 Eimer à 10 l)',
    },
    faqs: [
      { question: 'Sollte man die Fassade vor dem Streichen grundieren?', answer: 'Ja, stark saugende oder sandende Putze müssen zwingend mit Tiefgrund behandelt werden. Das verfestigt den Untergrund und verhindert fleckige Farbtrocknung.' },
      { question: 'Silikonharz- vs. Silikatfarbe für die Außenwand?', answer: 'Silikonharzfarbe ist stark wasserabweisend und schmutzresistent (Lotus-Effekt). Silikatfarbe verkieselt unlösbar mit mineralischem Putz und ist hoch atmungsaktiv.' },
    ],
    relatedSlugs: ['farbmengen-rechner', 'daemmung-u-wert-rechner', 'dachflaeche-rechner'],
  },

  {
    id: 'parkett-laminat-rechner',
    slug: 'parkett-laminat-rechner',
    name: 'Parkett & Laminat Rechner (Paketanzahl & Verschnitt nach Raummaß)',
    shortName: 'Parkett & Laminat',
    category: 'bauen-renovieren',
    subcategory: 'Rohbau & Boden',
    metaTitle: 'Parkett & Laminat Rechner – Pakete, Quadratmeter & Verschnitt berechnen',
    metaDescription: 'Berechnen Sie den genauen Bedarf an Laminat, Parkett oder Klick-Vinyl: Quadratmeter, Paketanzahl, Verschnitt (5-15 %) und Sockelleisten in Metern.',
    h1: 'Parkett & Laminat Rechner – Paketanzahl & Fußleisten ermitteln',
    shortDescription: 'Ermittelt Quadratmeter, Pakete und Sockelleisten für Bodenbeläge.',
    searchKeywords: ['laminat rechner pakete m2', 'parkett bedarf berechnen verschnitt', 'sockelleisten meter berechnen', 'klick vinyl quadratmeter pakete'],
    inputs: [
      { id: 'roomLength', label: 'Raumlänge', type: 'number', defaultValue: 5.5, min: 1, max: 50, step: 0.1, unit: 'm' },
      { id: 'roomWidth', label: 'Raumbreite', type: 'number', defaultValue: 4.2, min: 1, max: 50, step: 0.1, unit: 'm' },
      { id: 'packSizeM2', label: 'Packungsinhalt in m² laut Hersteller', type: 'number', defaultValue: 2.22, min: 0.5, max: 10, step: 0.01, unit: 'm²' },
      {
        id: 'layingPattern',
        label: 'Verlegemuster & Verschnitt',
        type: 'select',
        defaultValue: 'straight',
        options: [
          { value: 'straight', label: 'Gerade Verlegung / wilder Verband (ca. 7 % Verschnitt)' },
          { value: 'diagonal', label: 'Diagonale Verlegung (ca. 12 % Verschnitt)' },
          { value: 'herringbone', label: 'Fischgrätmuster (ca. 15 % Verschnitt)' },
        ],
      },
      { id: 'doorsCount', label: 'Anzahl Türen (Abzug für Sockelleisten)', type: 'number', defaultValue: 1, min: 0, max: 10, step: 1, unit: 'Stück' },
    ],
    calculateCode: `const l = Number(inputs.roomLength) || 0;
const w = Number(inputs.roomWidth) || 0;
const netArea = l * w;

let wastePercent = 7;
if (inputs.layingPattern === 'diagonal') wastePercent = 12;
else if (inputs.layingPattern === 'herringbone') wastePercent = 15;

const orderArea = netArea * (1 + wastePercent / 100);
const packM2 = Number(inputs.packSizeM2) || 2.22;
const packs = Math.ceil(orderArea / packM2);
const actualBoughtArea = packs * packM2;

// Sockelleisten: Umfang abzüglich ca. 0.9 m je Tür
const doors = Number(inputs.doorsCount) || 0;
const perimeter = 2 * (l + w);
const skirtingM = Math.max(0, perimeter - (doors * 0.9)) * 1.05; // 5 % Gehrungsschnitt-Puffer

return {
  primary: { id: 'packs', label: 'Benötigte Pakete Bodenbelag', value: packs, formattedValue: packs + ' Pakete (' + formatNumber(actualBoughtArea, 2) + ' m²)', highlight: true },
  secondary: [
    { id: 'netArea', label: 'Reine Bodenfläche (Netto)', value: netArea, formattedValue: formatNumber(netArea, 2) + ' m²' },
    { id: 'orderArea', label: 'Mindest-Bedarfsfläche inkl. Verschnitt', value: orderArea, formattedValue: formatNumber(orderArea, 2) + ' m²' },
    { id: 'skirting', label: 'Sockelleisten (inkl. Gehrungsverschnitt)', value: skirtingM, formattedValue: formatNumber(skirtingM, 1) + ' lfd. Meter' },
  ],
  summaryText: 'Für ' + formatNumber(netArea, 2) + ' m² Wohnfläche benötigen Sie ' + packs + ' Pakete (' + formatNumber(actualBoughtArea, 2) + ' m²) sowie ca. ' + formatNumber(skirtingM, 1) + ' m Sockelleisten.',
};`,
    formula: 'Pakete = ceil((Raumlänge × Raumbreite × (1 + Verschnitt/100)) / Packungsinhalt)',
    formulaExplanation: 'Rundungsregel: Bei Bodenbelägen immer auf volle Pakete aufrunden, da angebrochene Dielen vom Verschnitt nicht immer wiederverwendet werden können.',
    workedExample: {
      title: 'Beispiel: 23,1 m² Wohnzimmer, Pakete à 2,22 m² (7 % Verschnitt)',
      inputValues: [{ label: 'Raum', value: '5,5 m × 4,2 m (23,1 m²)' }, { label: 'Packung', value: '2,22 m²' }],
      steps: ['Bedarf = 23,1 × 1,07 = 24,717 m²', 'Pakete = 24,717 / 2,22 = 11,13 -> 12 Pakete', 'Gekauft: 12 × 2,22 = 26,64 m²'],
      result: '12 Pakete Laminat/Parkett',
    },
    faqs: [
      { question: 'Sollte man immer ein Paket Reserve aufbewahren?', answer: 'Ja, unbedingt 1 ungeöffnetes Paket aufheben! Falls nach Jahren ein Wasserschaden oder Kratzer entsteht, ist dieselbe Charge im Handel meist nicht mehr erhältlich.' },
      { question: 'Braucht man eine Dampfsperre unter Laminat?', answer: 'Auf mineralischen Untergründen (wie Beton oder Estrich) ist eine PE-Folie als Dampfbremse unverzichtbar, um den Boden vor aufsteigender Restfeuchte zu schützen.' },
    ],
    relatedSlugs: ['bodenbelag-rechner', 'estrich-rechner', 'farbmengen-rechner'],
  },

  {
    id: 'tapetenrollen-rechner',
    slug: 'tapetenrollen-rechner',
    name: 'Tapeten Rechner (Euro-Rollen Bedarf nach Raumumfang & Rapport)',
    shortName: 'Tapeten Rechner',
    category: 'bauen-renovieren',
    subcategory: 'Ausbau & Wand',
    metaTitle: 'Tapeten Rechner – Rollenbedarf (Euro-Rolle 10,05 × 0,53 m) berechnen',
    metaDescription: 'Berechnen Sie die benötigte Anzahl Tapetenrollen nach Raumumfang, Deckenhöhe, Fensterabzug und Musterversatz (Rapport) für Euro-Rollen.',
    h1: 'Tapeten Rechner – Rollenanzahl für Euro-Normrollen ermitteln',
    shortDescription: 'Berechnet die Anzahl Tapetenrollen nach Raumumfang und Rapport.',
    searchKeywords: ['tapeten rechner rollen bedarf', 'eurorolle tapete berechnen rapport', 'tapetenrollen anzahl raumumfang', 'mustertapete verschnitt berechnen'],
    inputs: [
      { id: 'perimeter', label: 'Raumumfang (Summe aller 4 Wände)', type: 'number', defaultValue: 16, min: 4, max: 100, step: 0.5, unit: 'm' },
      { id: 'roomHeight', label: 'Raumhöhe / Deckenhöhe', type: 'number', defaultValue: 2.5, min: 1.8, max: 5, step: 0.05, unit: 'm' },
      {
        id: 'patternRepeat',
        label: 'Musterversatz (Rapport)',
        type: 'select',
        defaultValue: '0',
        options: [
          { value: '0', label: 'Ansatzfrei / Uni-Tapete (kein Rapport, Verschnitt minimal)' },
          { value: '32', label: 'Kleiner Rapport (z. B. 32 cm Versatz)' },
          { value: '64', label: 'Großer Rapport (z. B. 64 cm Versatz)' },
        ],
      },
      { id: 'openingsCount', label: 'Abzug für Türen & Fenster (in Standardbahnen à 53 cm)', type: 'number', defaultValue: 3, min: 0, max: 15, step: 1, unit: 'Bahnen' },
    ],
    calculateCode: `const p = Number(inputs.perimeter) || 0;
const h = Number(inputs.roomHeight) || 0;
const rapport = (Number(inputs.patternRepeat) || 0) / 100;
const openBahnen = Number(inputs.openingsCount) || 0;

// Standard Euro-Rolle: 10,05 m lang, 0,53 m breit
const rollLength = 10.05;
const rollWidth = 0.53;

// Gesamtanzahl benötigter Bahnen:
const grossBahnen = Math.ceil(p / rollWidth);
const netBahnen = Math.max(1, grossBahnen - openBahnen);

// Schnitthöhe je Bahn (Deckenhöhe + 10 cm Puffer + Rapport)
const cutLength = h + 0.10 + rapport;
// Bahnen pro Rolle:
const bahnenPerRoll = Math.floor(rollLength / cutLength) || 1;
const rolls = Math.ceil(netBahnen / bahnenPerRoll);

return {
  primary: { id: 'rolls', label: 'Benötigte Tapetenrollen (Euro-Rolle)', value: rolls, formattedValue: rolls + ' Rollen (10,05 × 0,53 m)', highlight: true },
  secondary: [
    { id: 'netBahnen', label: 'Anzahl zu klebender Bahnen', value: netBahnen, formattedValue: netBahnen + ' Bahnen' },
    { id: 'bahnenPerRoll', label: 'Verwertbare Bahnen pro Rolle', value: bahnenPerRoll, formattedValue: bahnenPerRoll + ' Bahnen/Rolle' },
    { id: 'pasteBoxes', label: 'Tapetenkleister (Pakete)', value: Math.ceil(rolls / 5), formattedValue: Math.ceil(rolls / 5) + ' Packung(en)' },
  ],
  summaryText: 'Für den Raum (Umfang ' + p + ' m, Höhe ' + h + ' m) benötigen Sie ' + netBahnen + ' Bahnen, was genau ' + rolls + ' Euro-Rollen Tapete entspricht.',
};`,
    formula: 'Rollen = ceil(Bahnen / Bahnen je Rolle); Bahnen je Rolle = floor(10,05 m / (Raumhöhe + 0,10 m + Rapport))',
    formulaExplanation: 'Bei Standard-Deckenhöhen von 2,40 m bis 2,50 m erhält man aus einer Euro-Rolle bei ansatzfreier Tapete exakt 3 bis 4 Bahnen.',
    workedExample: {
      title: 'Beispiel: 16 m Raumumfang, 2,50 m Höhe, ansatzfrei',
      inputValues: [{ label: 'Umfang', value: '16 m' }, { label: 'Höhe', value: '2,50 m' }, { label: 'Rapport', value: 'keiner' }],
      steps: ['Bahnen = 16 / 0,53 = 31 Bahnen (abzgl. 3 für Fenster = 28 Bahnen)', 'Bahnen/Rolle = 10,05 / 2,60 = 3 Bahnen', 'Rollen = 28 / 3 = 9,33 -> 10 Rollen'],
      result: '10 Euro-Rollen Tapete',
    },
    faqs: [
      { question: 'Was ist eine Euro-Normrolle?', answer: 'Die klassische Euro-Rolle (Euronorm) hat eine Standardlänge von 10,05 Metern und eine Breite von 0,53 Metern, was ca. 5,33 m² Gesamtfläche pro Rolle entspricht.' },
      { question: 'Was bedeutet die Anfertigungsnummer / Chargennummer?', answer: 'Beim Tapetenkauf müssen alle Rollen dieselbe Chargennummer aufweisen, da es sonst zu leichten Nuancenunterschieden im Farbton an den Stößen kommen kann.' },
    ],
    relatedSlugs: ['farbmengen-rechner', 'bodenbelag-rechner', 'parkett-laminat-rechner'],
  },

  {
    id: 'brennholz-raummeter-rechner',
    slug: 'brennholz-raummeter-rechner',
    name: 'Brennholz Rechner (Festmeter, Raummeter, Schüttraummeter & Heizwert)',
    shortName: 'Brennholz Rechner',
    category: 'bauen-renovieren',
    subcategory: 'Heizung & Energie',
    metaTitle: 'Brennholz Rechner – Festmeter, Raummeter (RM) & Schüttraummeter (SRM)',
    metaDescription: 'Rechnen Sie Brennholz-Einheiten um: Festmeter (FM), Raummeter (RM) und Schüttraummeter (SRM) inklusive Heizwert in kWh und Öl-/Gas-Äquivalent.',
    h1: 'Brennholz Rechner – Umrechnung FM, RM, SRM & Energiegehalt',
    shortDescription: 'Rechnet Brennholz-Raummaße um und ermittelt den Heizwert in kWh.',
    searchKeywords: ['brennholz umrechner srm rm fm', 'schuettraummeter in raummeter umrechnen', 'heizwert buche fichte kwh raummeter', 'brennholz heizoel aequivalent'],
    inputs: [
      { id: 'amount', label: 'Holzmenge', type: 'number', defaultValue: 5, min: 0.5, max: 100, step: 0.5, unit: 'Einheiten' },
      {
        id: 'inputUnit',
        label: 'Ausgangs-Einheit',
        type: 'select',
        defaultValue: 'srm',
        options: [
          { value: 'srm', label: 'Schüttraummeter (SRM – lose geschüttetes Scheitholz)' },
          { value: 'rm', label: 'Raummeter / Ster (RM – ordentlich aufgeschichtetes 1m-Holz)' },
          { value: 'fm', label: 'Festmeter (FM – reines Holz ohne Zwischenräume)' },
        ],
      },
      {
        id: 'woodType',
        label: 'Holzart & Heizwert',
        type: 'select',
        defaultValue: 'beech',
        options: [
          { value: 'beech', label: 'Buche / Eiche (Hartholz, ca. 2.100 kWh / RM)' },
          { value: 'birch', label: 'Birke (Hartholz, ca. 1.900 kWh / RM)' },
          { value: 'spruce', label: 'Fichte / Kiefer (Nadelholz, ca. 1.500 kWh / RM)' },
        ],
      },
    ],
    calculateCode: `const qty = Number(inputs.amount) || 0;
const unit = inputs.inputUnit;

// Basis-Umrechnungsfaktoren auf Raummeter (RM):
// 1 FM = 1.4 RM = ca. 2.0 SRM
// 1 RM = 0.7 FM = ca. 1.4 SRM
// 1 SRM = 0.5 FM = ca. 0.7 RM
let rm = qty;
let fm = qty * 0.7;
let srm = qty * 1.4;

if (unit === 'srm') {
  rm = qty * 0.71;
  fm = qty * 0.50;
  srm = qty;
} else if (unit === 'fm') {
  rm = qty * 1.43;
  fm = qty;
  srm = qty * 2.0;
}

let kwhPerRm = 2100;
if (inputs.woodType === 'birch') kwhPerRm = 1900;
else if (inputs.woodType === 'spruce') kwhPerRm = 1500;

const totalKwh = rm * kwhPerRm;
const oilEquivalentLiters = totalKwh / 10; // 1 Liter Heizöl ≈ 10 kWh

return {
  primary: { id: 'rm', label: 'Menge in Raummeter (Ster)', value: rm, formattedValue: formatNumber(rm, 2) + ' RM', highlight: true },
  secondary: [
    { id: 'srm', label: 'Entspricht Schüttraummeter (SRM)', value: srm, formattedValue: formatNumber(srm, 2) + ' SRM' },
    { id: 'fm', label: 'Entspricht Festmeter (reine Holzmasse)', value: fm, formattedValue: formatNumber(fm, 2) + ' FM' },
    { id: 'energyKwh', label: 'Energiegehalt ca.', value: totalKwh, formattedValue: formatNumber(totalKwh, 0) + ' kWh' },
    { id: 'oilEquiv', label: 'Heizöl-Äquivalent', value: oilEquivalentLiters, formattedValue: 'ca. ' + formatNumber(oilEquivalentLiters, 0) + ' Liter Öl' },
  ],
  summaryText: qty + ' ' + (unit.toUpperCase()) + ' entsprechen ca. ' + formatNumber(rm, 2) + ' Raummeter bzw. ' + formatNumber(srm, 2) + ' SRM. Der Energiegehalt liegt bei rund ' + formatNumber(totalKwh, 0) + ' kWh.',
};`,
    formula: '1 Festmeter (FM) ≈ 1,4 Raummeter (RM) ≈ 2,0 Schüttraummeter (SRM); 1 SRM ≈ 0,7 RM',
    formulaExplanation: 'Ein Festmeter ist ein kompakter Holzblock von 1 m³, ein Raummeter gestapeltes Scheitholz mit Luftzwischenräumen und ein Schüttraummeter lose geschüttetes Kaminholz.',
    workedExample: {
      title: 'Beispiel: 5 Schüttraummeter (SRM) Buchenbrennholz',
      inputValues: [{ label: 'Menge', value: '5 SRM' }, { label: 'Holz', value: 'Buche' }],
      steps: ['RM = 5 × 0,71 = 3,55 Raummeter', 'Energie = 3,55 RM × 2.100 kWh = 7.455 kWh', 'Entspricht ca. 745 Liter Heizöl'],
      result: '3,55 RM (7.455 kWh Energie)',
    },
    faqs: [
      { question: 'Wie viel Restfeuchte darf Kaminholz haben?', answer: 'Nach § 3 der 1. BImSchV darf Brennholz in Deutschland maximal 20 % Restfeuchte aufweisen (optimal sind unter 18 %), was nach 1 bis 2 Jahren regengeschützter Lagerung erreicht wird.' },
      { question: 'Was ist günstiger: Raummeter oder Schüttraummeter?', answer: 'Scheinbar billige SRM-Preise täuschen oft: 1 SRM enthält etwa 30 % weniger Holz als 1 RM. Vergleichen Sie immer den umgerechneten Preis pro Raummeter oder Festmeter.' },
    ],
    relatedSlugs: ['heizkostenrechner', 'gasverbrauchsrechner', 'stromkostenrechner'],
  },
];

const outputFile = path.join(__dirname, 'generate-bauen-geometrie-part1.js');
console.log('Building part 1 with', calcs.length, 'calculators');
fs.writeFileSync(path.join(__dirname, 'calcs-bauen-part1.json'), JSON.stringify(calcs, null, 2), 'utf8');
console.log('Saved calcs-bauen-part1.json');
