const fs = require('fs');
const path = require('path');

const calcs = [
  {
    id: 'dichte-umrechner',
    slug: 'dichte-umrechner',
    name: 'Dichte Umrechner (g/cm³, kg/m³, kg/l & lb/cu ft)',
    shortName: 'Dichte Umrechner',
    category: 'einheiten',
    subcategory: 'Physik & Mechanik',
    metaTitle: 'Dichte Umrechner – g/cm³ in kg/m³, kg/l & lb/cu ft umrechnen',
    metaDescription: 'Rechnen Sie physikalische Dichten um zwischen Gramm pro Kubikzentimeter (g/cm³), Kilogramm pro Kubikmeter (kg/m³), kg pro Liter und Pounds per cubic foot.',
    h1: 'Dichte Umrechner – g/cm³, kg/m³ & kg/l präzise umrechnen',
    shortDescription: 'Konvertiert Dichteeinheiten zwischen metrischen und angloamerikanischen Werten.',
    searchKeywords: ['dichte umrechner g cm3 in kg m3', 'spezifisches gewicht dichte wasser 1 g cm3', 'dichte umrechnen kg pro liter', 'density converter lb cu ft'],
    inputs: [
      { id: 'inputValue', label: 'Dichtewert', type: 'number', defaultValue: 1.0, min: 0.0001, max: 100000, step: 0.01, unit: 'Dichte' },
      {
        id: 'inputUnit',
        label: 'Ausgangseinheit',
        type: 'select',
        defaultValue: 'gcm3',
        options: [
          { value: 'gcm3', label: 'Gramm pro Kubikzentimeter (g/cm³ = kg/l)' },
          { value: 'kgm3', label: 'Kilogramm pro Kubikmeter (kg/m³)' },
          { value: 'lbcuft', label: 'Pounds per cubic foot (lb/cu ft)' },
          { value: 'lbcuin', label: 'Pounds per cubic inch (lb/cu in)' },
        ],
      },
    ],
    calculateCode: `const val = Number(inputs.inputValue) || 0;
const unit = inputs.inputUnit;

// Basis g/cm³ (identisch mit kg/l und t/m³):
let gcm3 = val;
if (unit === 'kgm3') gcm3 = val / 1000;
else if (unit === 'lbcuft') gcm3 = val * 0.01601846337396;
else if (unit === 'lbcuin') gcm3 = val * 27.67990471019;

const kgm3 = gcm3 * 1000;
const lbcuft = gcm3 / 0.01601846337396;
const kgl = gcm3;

return {
  primary: { id: 'gcm3', label: 'Dichte in g/cm³ (bzw. kg/l)', value: gcm3, formattedValue: formatNumber(gcm3, 4) + ' g/cm³', highlight: true },
  secondary: [
    { id: 'kgm3', label: 'SI-Einheit (kg/m³)', value: kgm3, formattedValue: formatNumber(kgm3, 1) + ' kg/m³' },
    { id: 'lbcuft', label: 'Pounds per cubic foot (lb/ft³)', value: lbcuft, formattedValue: formatNumber(lbcuft, 2) + ' lb/cu ft' },
    { id: 'waterComp', label: 'Vergleich zu flüssigem Wasser (1,0 g/cm³)', value: gcm3, formattedValue: gcm3 > 1.0 ? formatNumber(gcm3, 2) + '-mal schwerer als Wasser (sinkt)' : 'leichter als Wasser (schwimmt)' },
  ],
  summaryText: val + ' ' + unit.toUpperCase() + ' entsprechen genau ' + formatNumber(gcm3, 3) + ' g/cm³ bzw. ' + formatNumber(kgm3, 0) + ' kg/m³ (' + formatNumber(lbcuft, 1) + ' lb/cu ft).',
};`,
    formula: '1 g/cm³ = 1.000 kg/m³ = 1 kg/l = 62,428 lb/cu ft; ρ = m / V',
    formulaExplanation: 'Dichte beschreibt das Verhältnis der Masse eines Körpers zu seinem Volumen. Wasser bei 4°C hat per Definition eine Dichte von exakt 1,000 g/cm³ (1.000 kg/m³).',
    workedExample: {
      title: 'Beispiel: Stahldichte 7.850 kg/m³ in g/cm³',
      inputValues: [{ label: 'Dichte', value: '7.850 kg/m³' }],
      steps: ['g/cm³ = 7.850 / 1.000 = 7,85 g/cm³'],
      result: '7,85 g/cm³',
    },
    faqs: [
      { question: 'Warum schwimmt Eis auf flüssigem Wasser?', answer: 'Wegen der Dichteanomalie des Wassers: Eis hat bei 0°C eine Dichte von ca. 0,917 g/cm³ und ist somit leichter als flüssiges Wasser (ca. 1,000 g/cm³).' },
      { question: 'Welches Metall hat die höchste Dichte?', answer: 'Osmium hat mit 22,59 g/cm³ die höchste Dichte aller chemischen Elemente, dicht gefolgt von Iridium (22,56 g/cm³) und Platin (21,45 g/cm³).' },
    ],
    relatedSlugs: ['gewicht-masse-umrechner', 'volumen-umrechner', 'kies-splitt-rechner'],
  },

  {
    id: 'drehzahl-umfangsgeschwindigkeit-rechner',
    slug: 'drehzahl-umfangsgeschwindigkeit-rechner',
    name: 'Drehzahl & Schnittgeschwindigkeit Rechner (U/min, RPM in m/s & m/min)',
    shortName: 'Drehzahl & Schnitt',
    category: 'einheiten',
    subcategory: 'Physik & Mechanik',
    metaTitle: 'Drehzahl Rechner – RPM, Umfangs- & Schnittgeschwindigkeit v = π·d·n',
    metaDescription: 'Berechnen Sie die Schnittgeschwindigkeit und Umfangsgeschwindigkeit v in m/min und m/s aus Werkzeugdurchmesser d (mm) und Drehzahl n (U/min / RPM) für Bohren und Fräsen.',
    h1: 'Drehzahl Rechner – Schnittgeschwindigkeit & RPM berechnen',
    shortDescription: 'Ermittelt Schnittgeschwindigkeit und Umfangsgeschwindigkeit aus Drehzahl.',
    searchKeywords: ['drehzahl rechner schnittgeschwindigkeit formel', 'rpm in m s umrechnen durchmesser', 'v pi d n durch 1000 schnittgeschwindigkeit bohren', 'umfangsgeschwindigkeit berechnen'],
    inputs: [
      { id: 'diameterMm', label: 'Werkzeug- / Raddurchmesser (d)', type: 'number', defaultValue: 125, min: 0.1, max: 5000, step: 1, unit: 'mm' },
      { id: 'rpm', label: 'Drehzahl (n)', type: 'number', defaultValue: 6000, min: 1, max: 200000, step: 100, unit: 'U/min (RPM)' },
    ],
    calculateCode: `const dMm = Number(inputs.diameterMm) || 0;
const n = Number(inputs.rpm) || 0;

// Schnittgeschwindigkeit v_c in m/min: v = (pi * d * n) / 1000
const vMMin = (Math.PI * dMm * n) / 1000;
// In m/s: v / 60
const vMS = vMMin / 60;
// In km/h:
const vKmh = vMS * 3.6;
// Winkelgeschwindigkeit omega in rad/s: omega = 2 * pi * (n / 60)
const omega = (2 * Math.PI * n) / 60;

return {
  primary: { id: 'vc', label: 'Schnittgeschwindigkeit (v_c)', value: vMMin, formattedValue: formatNumber(vMMin, 1) + ' m/min', highlight: true },
  secondary: [
    { id: 'vms', label: 'Umfangsgeschwindigkeit in m/s', value: vMS, formattedValue: formatNumber(vMS, 2) + ' m/s' },
    { id: 'vkmh', label: 'Umfangsgeschwindigkeit in km/h', value: vKmh, formattedValue: formatNumber(vKmh, 1) + ' km/h' },
    { id: 'omega', label: 'Winkelgeschwindigkeit (ω)', value: omega, formattedValue: formatNumber(omega, 1) + ' rad/s' },
  ],
  summaryText: 'Bei ' + dMm + ' mm Durchmesser und ' + n + ' U/min rotiert der Außenrand mit einer Schnittgeschwindigkeit von ' + formatNumber(vMMin, 1) + ' m/min (' + formatNumber(vMS, 1) + ' m/s bzw. ' + formatNumber(vKmh, 0) + ' km/h).',
};`,
    formula: 'v = (π × d × n) / 1.000 (m/min); v (m/s) = v / 60; ω = 2π × (n / 60)',
    formulaExplanation: 'In der Zerspanungstechnik (Bohren, Fräsen, Drehen, Schleifen) ist die Schnittgeschwindigkeit v_c die entscheidende Größe zur Bestimmung der Standzeit und Spanabnahme.',
    workedExample: {
      title: 'Beispiel: Winkelschleifer 125 mm Trennscheibe bei 11.000 U/min',
      inputValues: [{ label: 'Durchmesser', value: '125 mm' }, { label: 'Drehzahl', value: '11.000 RPM' }],
      steps: ['v = (π × 125 × 11.000) / 1.000 = 4.319,7 m/min', 'v in m/s = 4.319,7 / 60 ≈ 72,0 m/s (Zulässig: max. 80 m/s)'],
      result: '72,0 m/s Umfangsgeschwindigkeit',
    },
    faqs: [
      { question: 'Warum ist die maximale Umfangsgeschwindigkeit bei Schleifscheiben begrenzt?', answer: 'Trenn- und Schruppscheiben dürfen meist mit maximal 80 m/s betrieben werden, da bei höheren Drehzahlen die Fliehkräfte das Scheibengefüge sprengen können.' },
      { question: 'Wie berechnet man die ideale Drehzahl für Bohrer in Stahl?', answer: 'Formel: n = (v_c × 1.000) / (π × d). Bei HSS-Bohrern in Baustahl rechnet man mit einer Schnittgeschwindigkeit v_c von ca. 25 bis 30 m/min.' },
    ],
    relatedSlugs: ['geschwindigkeit-umrechner', 'drehmoment-umrechner', 'leistung-umrechner'],
  },

  {
    id: 'beleuchtungsstaerke-lux-lumen-rechner',
    slug: 'beleuchtungsstaerke-lux-lumen-rechner',
    name: 'Lux & Lumen Rechner (Beleuchtungsstärke für Wohn- & Arbeitsräume)',
    shortName: 'Lux & Lumen Rechner',
    category: 'einheiten',
    subcategory: 'Physik & Mechanik',
    metaTitle: 'Lux & Lumen Rechner – Beleuchtungsstärke (lx) & Lichtstrom (lm)',
    metaDescription: 'Berechnen Sie den benötigten Lichtstrom in Lumen nach Raumfläche in m² und Beleuchtungsstärke nach DIN EN 12464 (Küche 300 lx, Büro 500 lx, Wohnzimmer 100 lx).',
    h1: 'Lux & Lumen Rechner – Wie viele Lumen brauche ich pro Raum?',
    shortDescription: 'Berechnet den Lumen-Bedarf nach Raumfläche und DIN EN 12464.',
    searchKeywords: ['lux in lumen umrechnen formel', 'wieviel lumen pro m2 wohnzimmer kueche buero', 'beleuchtungsstaerke din en 12464 lux', 'lumen watt led rechner'],
    inputs: [
      { id: 'roomAreaM2', label: 'Raumfläche', type: 'number', defaultValue: 20, min: 1, max: 1000, step: 1, unit: 'm²' },
      {
        id: 'roomType',
        label: 'Raumnutzung & empfohlene Beleuchtungsstärke',
        type: 'select',
        defaultValue: 'living',
        options: [
          { value: 'living', label: 'Wohnzimmer / Schlafzimmer (Grundlicht ca. 100 Lux)' },
          { value: 'kitchen', label: 'Küche / Badezimmer / Flur (ca. 250 bis 300 Lux)' },
          { value: 'office', label: 'Homeoffice / Schreibtisch DIN EN 12464 (min. 500 Lux)' },
          { value: 'workshop', label: 'Werkstatt / Feinarbeit (ca. 750 bis 1.000 Lux)' },
        ],
      },
      { id: 'efficiencyLmW', label: 'LED-Lichtausbeute (Lumen pro Watt)', type: 'number', defaultValue: 100, min: 50, max: 200, step: 10, unit: 'lm/W' },
    ],
    calculateCode: `const a = Number(inputs.roomAreaM2) || 0;
const lmW = Number(inputs.efficiencyLmW) || 100;

let luxReq = 100;
if (inputs.roomType === 'kitchen') luxReq = 300;
else if (inputs.roomType === 'office') luxReq = 500;
else if (inputs.roomType === 'workshop') luxReq = 800;

// Bei diffuser Raumbeleuchtung rechnet man mit einem Nutzungsgrad von ca. 0.65 (Wandreflexion etc.)
const utilizationFactor = 0.65;
const totalLumenReq = Math.round((a * luxReq) / utilizationFactor);
const ledWatts = Math.round(totalLumenReq / lmW);
const lampsCount800lm = Math.ceil(totalLumenReq / 806); // 806 lm ≈ klassische 60W Glühbirne

return {
  primary: { id: 'lumen', label: 'Empfohlener Gesamt-Lichtstrom', value: totalLumenReq, formattedValue: formatNumber(totalLumenReq, 0) + ' Lumen (lm)', highlight: true },
  secondary: [
    { id: 'ledWatts', label: 'Elektrische LED-Leistung ca.', value: ledWatts, formattedValue: 'ca. ' + ledWatts + ' Watt' },
    { id: 'standardBulbs', label: 'Entspricht LED-Leuchtmitteln (à 806 lm / 60W)', value: lampsCount800lm, formattedValue: lampsCount800lm + ' Lampen' },
    { id: 'luxLevel', label: 'Ziel-Beleuchtungsstärke', value: luxReq, formattedValue: luxReq + ' Lux (lx = lm/m²)' },
  ],
  summaryText: 'Für ' + a + ' m² Fläche (' + luxReq + ' Lux Ziel) benötigen Sie insgesamt rund ' + formatNumber(totalLumenReq, 0) + ' Lumen Lichtstrom, was ca. ' + ledWatts + ' W moderner LED-Beleuchtung entspricht.',
};`,
    formula: 'Lumen (lm) = (Fläche in m² × Beleuchtungsstärke in Lux) / Nutzungsgrad; 1 Lux = 1 Lumen / m²',
    formulaExplanation: 'Lumen beziffert die gesamte von einer Lampe abgestrahlte Lichtmenge. Lux beziffert, wie viel von diesem Licht tatsächlich auf einer Fläche (z. B. auf dem Schreibtisch) ankommt.',
    workedExample: {
      title: 'Beispiel: 20 m² Homeoffice mit 500 Lux nach DIN EN 12464',
      inputValues: [{ label: 'Fläche', value: '20 m²' }, { label: 'Ziel', value: '500 Lux' }],
      steps: ['Lichtstrom = (20 m² × 500 lx) / 0,65 ≈ 15.385 Lumen', 'LED-Leistung (100 lm/W) = ca. 154 Watt aufgeteilt auf mehrere Lichtquellen'],
      result: 'ca. 15.000 Lumen',
    },
    faqs: [
      { question: 'Wie viele Lumen hat eine klassische alte 60-Watt-Glühbirne?', answer: 'Eine alte 60-Watt-Glühlampe erzeugte ca. 806 Lumen. Eine moderne LED erreicht dieselbe Helligkeit bereits mit nur ca. 7 bis 9 Watt Stromverbrauch.' },
      { question: 'Welche Lichtfarbe (Farbtemperatur) eignet sich für welchen Raum?', answer: 'Warmweiß (2.700K) sorgt für Gemütlichkeit im Wohn- und Schlafzimmer. Neutralweiß (4.000K) fördert die Konzentration in Küche, Bad und Homeoffice. Tageslichtweiß (>5.300K) eignet sich für Werkstätten.' },
    ],
    relatedSlugs: ['leistung-umrechner', 'energie-arbeit-umrechner', 'stromkostenrechner'],
  },

  {
    id: 'elektrische-ladung-kapazitaet-rechner',
    slug: 'elektrische-ladung-kapazitaet-rechner',
    name: 'Akku Kapazität & Ladung Rechner (mAh, Ah in Wh & Coulomb)',
    shortName: 'Akku Kapazität Rechner',
    category: 'einheiten',
    subcategory: 'Informatik & Digital',
    metaTitle: 'Akku Kapazität Rechner – mAh in Wh, Wattstunden & Coulomb umrechnen',
    metaDescription: 'Rechnen Sie die Akkukapazität um zwischen Milliamperestunden (mAh), Amperestunden (Ah), Wattstunden (Wh) nach Akkuspannung (3,7V Li-Ion, 12V Blei, 48V E-Bike) und Coulomb.',
    h1: 'Akku Kapazität Rechner – mAh in Wh & Wattstunden ermitteln',
    shortDescription: 'Konvertiert mAh und Ah in Wattstunden (Wh) nach Zellenspannung.',
    searchKeywords: ['mah in wh umrechnen formel akku powerbank', 'amperestunden in wattstunden rechner 12v 3 7v', 'akku kapazitaet coulomb berechnen', 'powerbank flugzeug grenze 100 wh'],
    inputs: [
      { id: 'capacityMah', label: 'Kapazität in Milliamperestunden (mAh)', type: 'number', defaultValue: 10000, min: 1, max: 10000000, step: 100, unit: 'mAh' },
      {
        id: 'voltageV',
        label: 'Akkuspannung (Nennspannung)',
        type: 'select',
        defaultValue: '3.7',
        options: [
          { value: '3.7', label: '3,7 V (Standard Li-Ion / Smartphone / Powerbank)' },
          { value: '3.85', label: '3,85 V (High-Voltage Li-Polymer)' },
          { value: '1.2', label: '1,2 V (NiMH Akku AA / AAA)' },
          { value: '12.0', label: '12,0 V (Autobatterie / Blei-Gel)' },
          { value: '36.0', label: '36,0 V (Standard E-Bike Akku)' },
          { value: '48.0', label: '48,0 V (Großer E-Bike / Solarspeicher)' },
        ],
      },
    ],
    calculateCode: `const mah = Number(inputs.capacityMah) || 0;
const v = Number(inputs.voltageV) || 3.7;

// Amperestunden Ah:
const ah = mah / 1000;
// Wattstunden Wh = Ah * V
const wh = ah * v;
// Coulomb C = A * s = Ah * 3600
const coulomb = ah * 3600;

const planeAllowed = wh <= 100;

return {
  primary: { id: 'wh', label: 'Energieinhalt in Wattstunden (Wh)', value: wh, formattedValue: formatNumber(wh, 2) + ' Wh', highlight: true },
  secondary: [
    { id: 'ah', label: 'Kapazität in Amperestunden (Ah)', value: ah, formattedValue: formatNumber(ah, 3) + ' Ah' },
    { id: 'coulomb', label: 'Elektrische Ladung in Coulomb (C)', value: coulomb, formattedValue: formatNumber(coulomb, 0) + ' C (A·s)' },
    { id: 'flightCheck', label: 'Handgepäck im Flugzeug erlaubt?', value: planeAllowed ? 1 : 0, formattedValue: planeAllowed ? 'Ja (unter 100 Wh IATA-Limit)' : 'Nur mit Sondergenehmigung (> 100 Wh)' },
  ],
  summaryText: 'Ein Akku mit ' + formatNumber(mah, 0) + ' mAh bei ' + v + ' V speichert genau ' + formatNumber(wh, 2) + ' Wh Energie (' + formatNumber(ah, 2) + ' Ah bzw. ' + formatNumber(coulomb, 0) + ' Coulomb).',
};`,
    formula: 'Wh = (mAh / 1.000) × Volt; Ah = mAh / 1.000; 1 Coulomb = 1 A × 1 s',
    formulaExplanation: 'Erst durch Multiplikation der Ladung (Ah) mit der elektrischen Spannung (V) erhält man den echten physikalischen Energieinhalt in Wattstunden (Wh).',
    workedExample: {
      title: 'Beispiel: 20.000 mAh Smartphone-Powerbank (3,7 V Li-Ion)',
      inputValues: [{ label: 'Kapazität', value: '20.000 mAh' }, { label: 'Spannung', value: '3,7 V' }],
      steps: ['Ah = 20.000 / 1.000 = 20 Ah', 'Wh = 20 Ah × 3,7 V = 74,0 Wh (unter dem 100 Wh Flugzeuglimit)'],
      result: '74,0 Wh',
    },
    faqs: [
      { question: 'Darf ich eine 20.000-mAh-Powerbank ins Flugzeug mitnehmen?', answer: 'Ja! Eine 20.000 mAh Li-Ion Powerbank hat 74 Wh. Die internationale IATA-Grenze für Handgepäck liegt bei 100 Wh (ohne Anmeldung) bzw. maximal 160 Wh mit Airline-Genehmigung.' },
      { question: 'Warum schrumpft die Nutzkapazität beim Laden eines Handys?', answer: 'Weil die 3,7V der Akkuzelle auf 5V USB hochkonvertiert und im Smartphone wieder heruntergeregelt werden müssen. Dabei entstehen ca. 15 % bis 25 % Umwandlungsverluste.' },
    ],
    relatedSlugs: ['energie-arbeit-umrechner', 'leistung-umrechner', 'stromkostenrechner'],
  },

  {
    id: 'radioaktivitaet-strahlendosis-rechner',
    slug: 'radioaktivitaet-strahlendosis-rechner',
    name: 'Radioaktivität & Strahlendosis Rechner (Bq, Ci, Sievert & Gray)',
    shortName: 'Strahlendosis Rechner',
    category: 'einheiten',
    subcategory: 'Physik & Mechanik',
    metaTitle: 'Strahlendosis Rechner – Sievert (Sv), Becquerel (Bq), Gray (Gy) & Curie',
    metaDescription: 'Rechnen Sie ionisierende Strahlung um: Aktivität (Becquerel Bq, Curie Ci), Energiedosis (Gray Gy, Rad) und Äquivalentdosis (Sievert Sv, Millisievert mSv, Rem).',
    h1: 'Strahlendosis Rechner – Becquerel, Sievert & Gray umrechnen',
    shortDescription: 'Konvertiert Aktivität (Bq/Ci) und Äquivalentdosis (Sv/mSv/rem).',
    searchKeywords: ['radioaktivitaet umrechner becquerel curie', 'sievert in millisievert mikrosievert umrechnen', 'gray in sievert strahlendosis rechner', 'natuerliche strahlenbelastung deutschland msv'],
    inputs: [
      { id: 'inputValue', label: 'Dosiswert', type: 'number', defaultValue: 2.1, min: 0.000001, max: 1000000, step: 0.1, unit: 'Dosis' },
      {
        id: 'inputUnit',
        label: 'Ausgangseinheit (Äquivalentdosis)',
        type: 'select',
        defaultValue: 'msv',
        options: [
          { value: 'msv', label: 'Millisievert (mSv = 0,001 Sv)' },
          { value: 'usv', label: 'Mikrosievert (µSv = 10⁻⁶ Sv)' },
          { value: 'sv', label: 'Sievert (Sv)' },
          { value: 'rem', label: 'Rem (rem = 0,01 Sv)' },
        ],
      },
    ],
    calculateCode: `const val = Number(inputs.inputValue) || 0;
const unit = inputs.inputUnit;

// Basis Sievert (Sv):
let sv = val / 1000;
if (unit === 'sv') sv = val;
else if (unit === 'usv') sv = val / 1000000;
else if (unit === 'rem') sv = val * 0.01;

const msv = sv * 1000;
const usv = sv * 1000000;
const rem = sv / 0.01;

// Vergleich mit typischen Dosen:
let comparison = 'Geringe Strahlendosis';
if (msv <= 0.0001) comparison = 'Entspricht etwa dem Essen einer Banane (ca. 0,1 µSv)';
else if (msv <= 0.1) comparison = 'Entspricht einer Zahn-Röntgenaufnahme (ca. 5 µSv)';
else if (msv <= 2.5) comparison = 'Entspricht etwa der natürlichen Jahresdosis in Deutschland (ca. 2,1 mSv/Jahr)';
else if (msv <= 10) comparison = 'Entspricht einem Ganzkörper-CT (ca. 8-10 mSv)';
else if (msv <= 20) comparison = 'Gesetzlicher Jahresgrenzwert für beruflich strahlenexponierte Personen (20 mSv/Jahr)';
else comparison = 'Sehr hohe Dosis (ab 1.000 mSv akute Strahlenkrankheit)';

return {
  primary: { id: 'msv', label: 'Äquivalentdosis in Millisievert (mSv)', value: msv, formattedValue: formatNumber(msv, 4) + ' mSv', highlight: true },
  secondary: [
    { id: 'usv', label: 'Mikrosievert (µSv)', value: usv, formattedValue: formatNumber(usv, 2) + ' µSv' },
    { id: 'sv', label: 'Sievert (Sv)', value: sv, formattedValue: formatNumber(sv, 6) + ' Sv' },
    { id: 'rem', label: 'Rem (historisch)', value: rem, formattedValue: formatNumber(rem, 3) + ' rem' },
    { id: 'context', label: 'Medizinische & alltägliche Einordnung', value: 0, formattedValue: comparison },
  ],
  summaryText: val + ' ' + unit.toUpperCase() + ' entsprechen ' + formatNumber(msv, 3) + ' mSv (' + formatNumber(usv, 1) + ' µSv). ' + comparison + '.',
};`,
    formula: '1 Sv = 1.000 mSv = 1.000.000 µSv = 100 rem; 1 Bq = 1 Zerfall/s; 1 Ci = 3,7 × 10¹⁰ Bq',
    formulaExplanation: 'Becquerel (Bq) misst die Aktivität der Quelle. Gray (Gy) misst die absorbierte physikalische Energiedosis (J/kg). Sievert (Sv) bewertet die biologische Schadwirkung auf menschliches Gewebe.',
    workedExample: {
      title: 'Beispiel: CT-Scan des Brustkorbs mit 7 mSv in Mikrosievert',
      inputValues: [{ label: 'Dosis', value: '7 mSv' }],
      steps: ['µSv = 7 × 1.000 = 7.000 µSv (entspricht ca. 3 Jahren natürlicher Hintergrundstrahlung)'],
      result: '7.000 µSv',
    },
    faqs: [
      { question: 'Wie hoch ist die natürliche Strahlenbelastung in Deutschland?', answer: 'Im Bundesdurchschnitt liegt die natürliche Strahlenexposition bei rund 2,1 Millisievert (mSv) pro Jahr, hauptsächlich verursacht durch Radon in Gebäuden, kosmische Strahlung und Nahrung.' },
      { question: 'Was ist das Bananen-Äquivalent?', answer: 'Bananen enthalten natürlich vorkommendes radioaktives Kalium-40. Der Verzehr einer Banane führt zu einer Dosis von ca. 0,1 Mikrosievert (0,0001 mSv).' },
    ],
    relatedSlugs: ['energie-arbeit-umrechner', 'zeit-umrechner', 'gewicht-masse-umrechner'],
  },

  {
    id: 'viskositaet-umrechner',
    slug: 'viskositaet-umrechner',
    name: 'Viskosität Umrechner (Dynamische mPa·s / cP & Kinematische cSt)',
    shortName: 'Viskosität Umrechner',
    category: 'einheiten',
    subcategory: 'Physik & Mechanik',
    metaTitle: 'Viskosität Umrechner – mPa·s in Centipoise (cP) & Stokes (cSt)',
    metaDescription: 'Rechnen Sie Viskositäten von Flüssigkeiten, Ölen und Farben um: Dynamische Viskosität (Pa·s, mPa·s, Centipoise cP) und kinematische Viskosität (mm²/s, Centistokes cSt).',
    h1: 'Viskosität Umrechner – mPa·s, Centipoise & Centistokes',
    shortDescription: 'Konvertiert dynamische (mPa·s, cP) und kinematische Viskosität (cSt).',
    searchKeywords: ['viskositaet umrechner mpa s centipoise cp', 'kinematische viskositaet centistokes cst mm2 s', 'viskositaet motoroel getriebeoel wasser', 'pascal sekunden in centipoise umrechnen'],
    inputs: [
      { id: 'inputValue', label: 'Viskositätswert', type: 'number', defaultValue: 100, min: 0.001, max: 100000000, step: 1, unit: 'Viskosität' },
      {
        id: 'inputUnit',
        label: 'Ausgangseinheit (Dynamische Viskosität)',
        type: 'select',
        defaultValue: 'mpas',
        options: [
          { value: 'mpas', label: 'Millipascalsekunden (mPa·s = cP)' },
          { value: 'pas', label: 'Pascalsekunden (Pa·s = 1.000 mPa·s)' },
          { value: 'cp', label: 'Centipoise (cP)' },
          { value: 'poise', label: 'Poise (P = 100 cP)' },
        ],
      },
    ],
    calculateCode: `const val = Number(inputs.inputValue) || 0;
const unit = inputs.inputUnit;

// Basis mPa·s (exakt 1:1 identisch mit cP):
let mpas = val;
if (unit === 'pas') mpas = val * 1000;
else if (unit === 'poise') mpas = val * 100;

const pas = mpas / 1000;
const cp = mpas;
const poise = mpas / 100;

// Typische Vergleichsflüssigkeiten:
let example = 'Vergleichbar mit leichtem Motoröl';
if (mpas <= 1.2) example = 'Vergleichbar mit Wasser bei 20°C (ca. 1,0 mPa·s)';
else if (mpas <= 10) example = 'Vergleichbar mit Milch oder leichtem Speiseöl (ca. 3-10 mPa·s)';
else if (mpas <= 150) example = 'Vergleichbar mit Olivenöl (ca. 80 mPa·s) oder SAE 30 Motoröl';
else if (mpas <= 1500) example = 'Vergleichbar mit flüssigem Honig oder Glycerin (ca. 1.000-1.500 mPa·s)';
else if (mpas <= 10000) example = 'Vergleichbar mit Mayonnaise oder Wandfarbe';
else example = 'Vergleichbar mit Erdnussbutter oder Zahnpasta (> 30.000 mPa·s)';

return {
  primary: { id: 'mpas', label: 'Dynamische Viskosität in mPa·s', value: mpas, formattedValue: formatNumber(mpas, 2) + ' mPa·s', highlight: true },
  secondary: [
    { id: 'cp', label: 'Centipoise (cP = mPa·s)', value: cp, formattedValue: formatNumber(cp, 2) + ' cP' },
    { id: 'pas', label: 'Pascalsekunden (Pa·s)', value: pas, formattedValue: formatNumber(pas, 4) + ' Pa·s' },
    { id: 'comparison', label: 'Praktischer Alltagsvergleich', value: 0, formattedValue: example },
  ],
  summaryText: val + ' ' + unit.toUpperCase() + ' entsprechen ' + formatNumber(mpas, 1) + ' mPa·s (exakt gleich ' + formatNumber(cp, 1) + ' Centipoise). ' + example + '.',
};`,
    formula: '1 mPa·s = 1 cP (Centipoise); 1 Pa·s = 1.000 mPa·s = 10 Poise; ν = η / ρ',
    formulaExplanation: 'Viskosität ist das Maß für die Zähflüssigkeit eines Fluids. Je höher die Viskosität, desto dickflüssiger ist das Material und desto langsamer fließt es.',
    workedExample: {
      title: 'Beispiel: Honig mit 1,2 Pa·s in mPa·s und Centipoise',
      inputValues: [{ label: 'Viskosität', value: '1,2 Pa·s' }],
      steps: ['mPa·s = 1,2 × 1.000 = 1.200 mPa·s', 'Centipoise = 1.200 cP'],
      result: '1.200 mPa·s (1.200 cP)',
    },
    faqs: [
      { question: 'Warum ist 1 mPa·s gleich 1 cP?', answer: 'Weil 1 Poise = 0,1 Pa·s = 100 mPa·s definiert ist. 1 Centipoise (1/100 Poise) ist somit exakt gleich 1 mPa·s.' },
      { question: 'Was ist der Unterschied zwischen newtonschen und nicht-newtonschen Flüssigkeiten?', answer: 'Bei newtonschen Fluiden (wie Wasser oder Öl) bleibt die Viskosität bei Bewegung konstant. Nicht-newtonsche Fluide (wie Ketchup oder Zahnpasta) werden bei Scherung dünnflüssiger (Thixotropie).' },
    ],
    relatedSlugs: ['dichte-umrechner', 'druck-umrechner', 'temperatur-umrechner'],
  },

  {
    id: 'schuhe-kleidergroessen-umrechner',
    slug: 'schuhe-kleidergroessen-umrechner',
    name: 'Schuhgrößen Umrechner (EU, US, UK & Fußlänge in cm)',
    shortName: 'Schuhgrößen Umrechner',
    category: 'einheiten',
    subcategory: 'Alltag & Kleidung',
    metaTitle: 'Schuhgrößen Umrechner – EU in US, UK & Fußlänge (Mondopoint cm)',
    metaDescription: 'Rechnen Sie Schuhgrößen für Damen, Herren und Kinder um: Deutsche/EU-Größe (35 bis 48), US Men, US Women, UK-Größe und Fußlänge in cm (Mondopoint).',
    h1: 'Schuhgrößen Umrechner – EU, US, UK & cm sofort ermitteln',
    shortDescription: 'Konvertiert Schuhgrößen zwischen EU, US, UK und Fußlänge in cm.',
    searchKeywords: ['schuhgroessen umrechner eu in us uk', 'schuhgroesse us herren damen tabelle', 'fusslaenge in schuhgroesse cm mondopoint', 'deutsche schuhgroesse 42 us'],
    inputs: [
      { id: 'euSize', label: 'EU / Deutsche Schuhgröße', type: 'number', defaultValue: 42, min: 20, max: 52, step: 0.5, unit: 'EU' },
      {
        id: 'gender',
        label: 'Zielgruppe',
        type: 'select',
        defaultValue: 'men',
        options: [
          { value: 'men', label: 'Herren / Unisex' },
          { value: 'women', label: 'Damen' },
        ],
      },
    ],
    calculateCode: `const eu = Number(inputs.euSize) || 42;
const isMen = inputs.gender === 'men';

// Pariser Stich: 1 EU-Größe = 2/3 cm = 6.67 mm
// Fußlänge in cm ≈ (EU - 2) * (2/3)
const footLengthCm = ((eu - 1.5) * 2) / 3;

// UK Größe: (EU - 33) * 0.75 ca.
// Formel: UK = 3 * Leistenlänge in Zoll - 25
const uk = (eu - 31.5) * 0.75;

// US Men ≈ UK + 0.5 bis 1.0 (meist UK + 0.5)
const usMen = uk + 0.5;
// US Women ≈ US Men + 1.5 (bzw. UK + 2.0)
const usWomen = uk + 2.0;

const usResult = isMen ? usMen : usWomen;

return {
  primary: { id: 'usSize', label: isMen ? 'US Herren Größe' : 'US Damen Größe', value: usResult, formattedValue: 'US ' + formatNumber(usResult, 1), highlight: true },
  secondary: [
    { id: 'ukSize', label: 'UK Größe', value: uk, formattedValue: 'UK ' + formatNumber(uk, 1) },
    { id: 'footCm', label: 'Empfohlene Fußlänge (Mondopoint)', value: footLengthCm, formattedValue: formatNumber(footLengthCm, 1) + ' cm' },
    { id: 'parisPoint', label: 'Pariser Stich (EU-Maß)', value: eu, formattedValue: 'EU ' + eu },
  ],
  summaryText: 'EU-Schuhgröße ' + eu + ' entspricht bei ' + (isMen ? 'Herren' : 'Damen') + ' ca. US ' + formatNumber(usResult, 1) + ', UK ' + formatNumber(uk, 1) + ' und einer Fußlänge von ca. ' + formatNumber(footLengthCm, 1) + ' cm.',
};`,
    formula: 'Fußlänge (cm) ≈ (EU - 1,5) × 2/3; US Men ≈ (EU - 31,5) × 0,75 + 0,5',
    formulaExplanation: 'Das kontinentaleuropäische Schuhgrößensystem basiert auf dem Pariser Stich (1 Stich = 2/3 cm ≈ 6,67 mm). Das britische und US-amerikanische System basiert auf Gerstenkörnern (Barleycorn = 1/3 Zoll).',
    workedExample: {
      title: 'Beispiel: Deutsche Schuhgröße 42 für Herren',
      inputValues: [{ label: 'EU Größe', value: '42' }, { label: 'Zielgruppe', value: 'Herren' }],
      steps: ['UK = (42 - 31,5) × 0,75 = 8,0', 'US Men = 8,0 + 0,5 = 8,5', 'Fußlänge = (40,5 × 2) / 3 = 27,0 cm'],
      result: 'US 8.5 / UK 8.0 (27,0 cm Fußlänge)',
    },
    faqs: [
      { question: 'Wie misst man seine Fußlänge richtig?', answer: 'Stellen Sie sich am späten Nachmittag auf ein Blatt Papier an eine Wand, markieren Sie die längste Zehe mit einem Stift und messen Sie den Abstand zur Wand in Zentimetern.' },
      { question: 'Warum fallen Laufschuhe oft kleiner aus?', answer: 'Da sich der Fuß beim Laufen nach vorne schiebt und durch die Durchblutung anschwillt, wählt man Laufschuhe in der Regel eine bis anderthalb Nummern größer als Straßenschuhe.' },
    ],
    relatedSlugs: ['laengen-umrechner', 'zoll-in-cm-rechner', 'gewicht-masse-umrechner'],
  },

  {
    id: 'papierformat-din-rechner',
    slug: 'papierformat-din-rechner',
    name: 'Papierformat DIN Rechner (DIN A0 bis A8 Maße & Blattgewicht in Gramm)',
    shortName: 'Papierformat DIN',
    category: 'einheiten',
    subcategory: 'Geometrische Maße',
    metaTitle: 'Papierformat Rechner – DIN A0 bis A8 Maße (mm, cm) & Blattgewicht',
    metaDescription: 'Berechnen Sie die exakten Abmessungen in Millimetern und Zentimetern für DIN A4, A3, A5 etc. nach DIN 476 / ISO 216 sowie das Blattgewicht nach Grammatur (80g, 120g/m²).',
    h1: 'Papierformat Rechner – DIN A Maße & Briefgewicht berechnen',
    shortDescription: 'Berechnet DIN A0 bis A8 Abmessungen in mm und Blattgewicht.',
    searchKeywords: ['papierformat din rechner din a4 maße mm cm', 'din a3 din a5 masse tabelle', 'briefgewicht berechnen blattanzahl 80g m2', 'seitenverhaeltnis wurzel 2 din papier'],
    inputs: [
      {
        id: 'dinFormat',
        label: 'DIN-A Format',
        type: 'select',
        defaultValue: 'a4',
        options: [
          { value: 'a0', label: 'DIN A0 (841 × 1.189 mm – 1 m²)' },
          { value: 'a1', label: 'DIN A1 (594 × 841 mm)' },
          { value: 'a2', label: 'DIN A2 (420 × 594 mm)' },
          { value: 'a3', label: 'DIN A3 (297 × 420 mm)' },
          { value: 'a4', label: 'DIN A4 (210 × 297 mm – Standard)' },
          { value: 'a5', label: 'DIN A5 (148 × 210 mm – Notizbuch)' },
          { value: 'a6', label: 'DIN A6 (105 × 148 mm – Postkarte)' },
          { value: 'a7', label: 'DIN A7 (74 × 105 mm)' },
        ],
      },
      { id: 'grammage', label: 'Papiergewicht (Grammatur)', type: 'number', defaultValue: 80, min: 40, max: 600, step: 10, unit: 'g/m²' },
      { id: 'sheetCount', label: 'Anzahl Blätter', type: 'number', defaultValue: 1, min: 1, max: 5000, step: 1, unit: 'Blatt' },
    ],
    calculateCode: `const fmt = inputs.dinFormat;
const gM2 = Number(inputs.grammage) || 80;
const sheets = Number(inputs.sheetCount) || 1;

let wMm = 210;
let hMm = 297;
let fractionOfA0 = 16; // A4 ist 1/16 von A0

if (fmt === 'a0') { wMm = 841; hMm = 1189; fractionOfA0 = 1; }
else if (fmt === 'a1') { wMm = 594; hMm = 841; fractionOfA0 = 2; }
else if (fmt === 'a2') { wMm = 420; hMm = 594; fractionOfA0 = 4; }
else if (fmt === 'a3') { wMm = 297; hMm = 420; fractionOfA0 = 8; }
else if (fmt === 'a4') { wMm = 210; hMm = 297; fractionOfA0 = 16; }
else if (fmt === 'a5') { wMm = 148; hMm = 210; fractionOfA0 = 32; }
else if (fmt === 'a6') { wMm = 105; hMm = 148; fractionOfA0 = 64; }
else if (fmt === 'a7') { wMm = 74; hMm = 105; fractionOfA0 = 128; }

const singleSheetWeightG = gM2 / fractionOfA0;
const totalWeightG = singleSheetWeightG * sheets;

return {
  primary: { id: 'dimensions', label: 'Abmessungen Breite × Höhe', value: wMm, formattedValue: wMm + ' × ' + hMm + ' mm (' + (wMm/10) + ' × ' + (hMm/10) + ' cm)', highlight: true },
  secondary: [
    { id: 'sheetWeight', label: 'Gewicht pro Einzelblatt', value: singleSheetWeightG, formattedValue: formatNumber(singleSheetWeightG, 2) + ' g' },
    { id: 'totalWeight', label: 'Gesamtgewicht (' + sheets + ' Blätter)', value: totalWeightG, formattedValue: formatNumber(totalWeightG, 1) + ' g (' + formatNumber(totalWeightG / 1000, 3) + ' kg)' },
    { id: 'letterCheck', label: 'Porto-Richtwert Deutsche Post', value: 0, formattedValue: (totalWeightG + 5) <= 20 ? 'Standardbrief bis 20g' : (totalWeightG + 5) <= 50 ? 'Kompaktbrief bis 50g' : 'Großbrief bis 500g' },
  ],
  summaryText: fmt.toUpperCase() + ' misst genau ' + wMm + ' × ' + hMm + ' mm. ' + sheets + ' Blatt (' + gM2 + ' g/m²) wiegen ca. ' + formatNumber(totalWeightG, 1) + ' Gramm.',
};`,
    formula: 'Breite / Höhe = 1 : √2 ≈ 1 : 1,4142; Fläche A0 = genau 1 m²; A4 = 1/16 m²',
    formulaExplanation: 'Das DIN-A-Format (nach Walter Porstmann, 1922) zeichnet sich dadurch aus, dass sich beim Halbieren der langen Seite wieder exakt dasselbe Seitenverhältnis von 1 zu Wurzel 2 ergibt.',
    workedExample: {
      title: 'Beispiel: 3 Blatt DIN A4 (80 g/m²) in einem Briefumschlag',
      inputValues: [{ label: 'Format', value: 'DIN A4' }, { label: 'Grammatur', value: '80 g/m²' }, { label: 'Blätter', value: '3 Blatt' }],
      steps: ['1 Blatt A4 = 80 g / 16 = 5,0 g', '3 Blätter = 15,0 g (+ 4 g Briefumschlag = 19,0 g)', 'Passt unter die 20g-Grenze für einen Standardbrief'],
      result: '15 g Papiergewicht (Standardbrief portofrei)',
    },
    faqs: [
      { question: 'Wie viele Blätter DIN A4 darf man im Standardbrief verschicken?', answer: 'Ein Standardbrief der Deutschen Post darf inklusive Umschlag (ca. 4 bis 5 g) maximal 20 Gramm wiegen. Bei 80g-Papier passen somit bis zu 3 gefaltete Blätter in den Umschlag.' },
      { question: 'Was ist der Unterschied zwischen DIN A, DIN B und DIN C?', answer: 'DIN A ist das Papierformat (A4). DIN C ist das Briefumschlagformat (C4, C6), in das ungedruckte A-Bögen genau hineinpassen. DIN B ist das Zwischenformat für Schnellhefter und Mappen.' },
    ],
    relatedSlugs: ['gewicht-masse-umrechner', 'flaeche-umrechner', 'laengen-umrechner'],
  },

  {
    id: 'ringgroesse-umrechner',
    slug: 'ringgroesse-umrechner',
    name: 'Ringgröße Umrechner (EU-Umfang in mm, US, UK & Durchmesser)',
    shortName: 'Ringgrößen Umrechner',
    category: 'einheiten',
    subcategory: 'Alltag & Kleidung',
    metaTitle: 'Ringgröße Umrechner – EU-Umfang (48–70) in US, UK & Innendurchmesser',
    metaDescription: 'Rechnen Sie Ringgrößen um: Deutsche Größe / Innenumfang in Millimetern (z. B. 54 = 54 mm), Innendurchmesser in mm (d = Umfang / π), US-Größe und UK-Ringgröße.',
    h1: 'Ringgröße Umrechner – Innenumfang & Durchmesser bestimmen',
    shortDescription: 'Konvertiert Ringgrößen zwischen EU-Umfang, Durchmesser, US und UK.',
    searchKeywords: ['ringgroesse umrechnen tabelle mm', 'ringgroesse 54 in durchmesser', 'us ringgroesse in deutsche ringgroesse', 'ring innenumfang messen'],
    inputs: [
      { id: 'euCircumferenceMm', label: 'EU Ringgröße / Innenumfang (mm)', type: 'number', defaultValue: 54, min: 40, max: 76, step: 1, unit: 'mm' },
    ],
    calculateCode: `const circ = Number(inputs.euCircumferenceMm) || 54;

// Innendurchmesser d = Umfang / pi
const diameterMm = circ / Math.PI;

// US Ringgröße: US = (Umfang in mm - 36.5) / 2.55 (Näherung)
// Formel: d_inch = diameterMm / 25.4; US = (d_inch - 0.458) / 0.032
const dInch = diameterMm / 25.4;
const usSize = (dInch - 0.458) / 0.032;

// UK Ringgröße (Buchstaben A bis Z):
// A entspricht ca. US 0.5 (ca. 37.8 mm), jeder Buchstabe ca. 0.5 US-Größen
const ukCharCode = Math.round(65 + (usSize * 2) - 1);
let ukLetter = 'M';
if (ukCharCode >= 65 && ukCharCode <= 90) {
  ukLetter = String.fromCharCode(ukCharCode);
} else if (ukCharCode > 90) {
  ukLetter = 'Z+' + (ukCharCode - 90);
}

return {
  primary: { id: 'diameter', label: 'Innendurchmesser des Rings', value: diameterMm, formattedValue: formatNumber(diameterMm, 1) + ' mm', highlight: true },
  secondary: [
    { id: 'usSize', label: 'US Ringgröße', value: usSize, formattedValue: 'US ' + formatNumber(usSize, 1) },
    { id: 'ukSize', label: 'UK Ringgröße (Buchstabe)', value: 0, formattedValue: 'UK ' + ukLetter },
    { id: 'euCirc', label: 'Deutscher Innenumfang', value: circ, formattedValue: circ + ' mm (Größe ' + circ + ')' },
  ],
  summaryText: 'Ringgröße ' + circ + ' entspricht einem Innendurchmesser von ' + formatNumber(diameterMm, 1) + ' mm, einer US-Größe von ca. ' + formatNumber(usSize, 1) + ' und der britischen Größe ' + ukLetter + '.',
};`,
    formula: 'Innendurchmesser (mm) = EU-Ringgröße (mm) / π; US ≈ (Innendurchmesser in mm - 11,63) / 0,8128',
    formulaExplanation: 'In Deutschland und den meisten europäischen Ländern entspricht die offizielle Ringgröße exakt dem inneren Ringumfang in Millimetern (Größe 54 = 54 mm Innenumfang).',
    workedExample: {
      title: 'Beispiel: Ringgröße 54 (häufige Damengröße)',
      inputValues: [{ label: 'EU Größe', value: '54' }],
      steps: ['Innendurchmesser = 54 / π = 54 / 3,14159 ≈ 17,2 mm', 'US-Größe ≈ 6,8 bis 7,0', 'UK-Größe ≈ N'],
      result: '17,2 mm Durchmesser (US 7)',
    },
    faqs: [
      { question: 'Wie messe ich die Ringgröße heimlich für einen Verlobungsring?', answer: 'Nehmen Sie einen gut passenden Ring des Partners und messen Sie mit einem Messschieber oder Lineal den inneren Durchmesser auf den Millimeter genau. Multiplizieren Sie mit 3,14 für die EU-Größe.' },
      { question: 'Wann sind Finger dicker?', answer: 'Finger sind im Sommer bei Hitze und am Abend deutlich dicker als morgens bei Kälte. Messen Sie die Ringgröße daher idealerweise am späten Nachmittag bei normaler Zimmertemperatur.' },
    ],
    relatedSlugs: ['kreis-umfang-rechner', 'laengen-umrechner', 'zoll-in-cm-rechner'],
  },

  {
    id: 'dezibel-schalldruck-umrechner',
    slug: 'dezibel-schalldruck-umrechner',
    name: 'Dezibel & Schalldruck Rechner (dB, Lautstärke & Pascal Pa)',
    shortName: 'Dezibel Rechner',
    category: 'einheiten',
    subcategory: 'Physik & Mechanik',
    metaTitle: 'Dezibel Rechner – dB Schalldruckpegel, Pascal (Pa) & Lautstärke',
    metaDescription: 'Berechnen Sie den Schalldruckpegel L_p in Dezibel dB(A) aus Schalldruck in Pascal (Pa) und ermitteln Sie die physikalische Energie- und Lautstärkeverdopplung (+3 dB / +10 dB).',
    h1: 'Dezibel Rechner – Schallpegel dB, Schalldruck & Lautstärke',
    shortDescription: 'Berechnet Schalldruckpegel in Dezibel und vergleicht Lärmquellen.',
    searchKeywords: ['dezibel rechner schallpegel db a', 'lautstaerkeverdopplung 3 db 10 db', 'schalldruck pascal in dezibel berechnen', 'laerm tabelle dezibel fluestern duese'],
    inputs: [
      { id: 'dbValue', label: 'Schallpegel in dB(A)', type: 'number', defaultValue: 60, min: 0, max: 194, step: 1, unit: 'dB' },
    ],
    calculateCode: `const db = Number(inputs.dbValue) || 0;

// Schalldruck p in Pascal (Pa):
// L_p = 20 * log10(p / p0) mit p0 = 20 µPa = 2 * 10^-5 Pa (Hörschwelle)
// => p = p0 * 10^(L_p / 20)
const p0 = 0.00002;
const soundPressurePa = p0 * Math.pow(10, db / 20);

// Relative Schallenergie gegenüber 0 dB (Faktor 10^(db/10))
const energyRatio = Math.pow(10, db / 10);
// Subjektiv empfundene Lautstärke (Faustregel: +10 dB = doppelte Lautstärke)
const perceivedLoudnessRatio = Math.pow(2, db / 10);

let example = 'Ruhiges Zimmer';
if (db <= 20) example = 'Blätterrauschen / Flüstern (sehr leise)';
else if (db <= 40) example = 'Ruhige Wohnstraße nachts / Bibliothek';
else if (db <= 60) example = 'Normale Unterhaltung / Zimmerlautstärke';
else if (db <= 80) example = 'Lauter Straßenverkehr / Staubsauger';
else if (db <= 90) example = 'Rasenmäher / Baustellenlärm (Gehörschutz empfohlen)';
else if (db <= 110) example = 'Kettensäge / Diskothek / Club';
else if (db <= 130) example = 'Düsenflugzeug in 100m Entfernung (Schmerzgrenze ca. 120-130 dB)';
else example = 'Extrem gesundheitsgefährdend (akutes Knalltrauma)';

return {
  primary: { id: 'pressure', label: 'Effektiver Schalldruck', value: soundPressurePa, formattedValue: formatNumber(soundPressurePa, 4) + ' Pa (N/m²)', highlight: true },
  secondary: [
    { id: 'perceived', label: 'Empfundene Lautstärke (vgl. zu 0 dB)', value: perceivedLoudnessRatio, formattedValue: formatNumber(perceivedLoudnessRatio, 0) + '-fach lauter' },
    { id: 'energy', label: 'Physikalische Schallenergie', value: energyRatio, formattedValue: formatNumber(energyRatio, 0) + '-fache Energie' },
    { id: 'context', label: 'Vergleichbare Lärmquelle', value: 0, formattedValue: example },
  ],
  summaryText: db + ' dB(A) erzeugen einen Schalldruck von ' + formatNumber(soundPressurePa, 4) + ' Pascal. Das entspricht etwa: ' + example + '.',
};`,
    formula: 'L_p = 20 × log₁₀(p / p₀); p₀ = 20 µPa (Hörschwelle); +3 dB = doppelte Schallenergie; +10 dB = doppelte empfundene Lautstärke',
    formulaExplanation: 'Da das menschliche Gehör Schallintensitäten von 1 bis 1.000.000.000.000 verarbeiten kann, wird die Lautstärke auf einer logarithmischen Dezibel-Skala gemessen.',
    workedExample: {
      title: 'Beispiel: Zwei identische 60-dB-Schallquellen gleichzeitig',
      inputValues: [{ label: 'Pegel', value: '60 dB' }],
      steps: ['Verdopplung der Schallenergie = +3 dB', 'Gesamtpegel = 60 + 3 = 63 dB(A)'],
      result: '63 dB (nicht 120 dB!)',
    },
    faqs: [
      { question: 'Was ist der Unterschied zwischen +3 dB und +10 dB?', answer: '+3 dB bedeutet eine Verdoppelung der physikalischen Schallleistung (z. B. zwei Maschinen statt einer). +10 dB empfindet das menschliche Ohr subjektiv als doppelt so laut.' },
      { question: 'Ab welcher Lautstärke drohen Gehörschäden?', answer: 'Dauerhafter Lärm ab 85 dB(A) am Arbeitsplatz erfordert nach den Unfallverhütungsvorschriften Gehörschutz. Ab 120 dB(A) liegt die Schmerzschwelle des Gehörs.' },
    ],
    relatedSlugs: ['druck-umrechner', 'leistung-umrechner', 'energie-arbeit-umrechner'],
  },
];

console.log('Building einheiten part 2 with', calcs.length, 'calculators');
fs.writeFileSync(path.join(__dirname, 'calcs-einheiten-part2.json'), JSON.stringify(calcs, null, 2), 'utf8');
console.log('Saved calcs-einheiten-part2.json');
