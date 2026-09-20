const fs = require('fs');
const path = require('path');

const calcs = [
  {
    id: 'gewicht-masse-umrechner',
    slug: 'gewicht-masse-umrechner',
    name: 'Gewicht Umrechner (kg, g, Pfund lbs, Unzen oz & Tonnen)',
    shortName: 'Gewicht Umrechner',
    category: 'einheiten',
    subcategory: 'Masse & Gewicht',
    metaTitle: 'Gewicht Umrechner – Kilogramm, Gramm, Pfund (lbs) & Unzen (oz)',
    metaDescription: 'Rechnen Sie Gewichte sekundenschnell um zwischen Kilogramm (kg), Gramm (g), Milligramm (mg), Tonnen (t), englischen Pfund (lbs) und Unzen (oz).',
    h1: 'Gewicht Umrechner – kg, g, lbs & oz präzise umrechnen',
    shortDescription: 'Konvertiert Gewichtseinheiten zwischen metrischem und angloamerikanischem System.',
    searchKeywords: ['gewicht umrechner kg in lbs', 'pfund in kilogramm umrechnen formel', 'unzen oz in gramm umrechner', 'tonnen in kilogramm berechnen'],
    inputs: [
      { id: 'inputValue', label: 'Gewichtswert', type: 'number', defaultValue: 10, min: 0.000001, max: 1000000000, step: 0.1, unit: 'Masse' },
      {
        id: 'inputUnit',
        label: 'Ausgangseinheit',
        type: 'select',
        defaultValue: 'kg',
        options: [
          { value: 'kg', label: 'Kilogramm (kg)' },
          { value: 'g', label: 'Gramm (g)' },
          { value: 'mg', label: 'Milligramm (mg)' },
          { value: 't', label: 'Tonne (t = 1.000 kg)' },
          { value: 'lbs', label: 'Englisches Pfund (lb / lbs = 0,45359 kg)' },
          { value: 'oz', label: 'Unze (oz = 28,3495 g)' },
        ],
      },
    ],
    calculateCode: `const val = Number(inputs.inputValue) || 0;
const unit = inputs.inputUnit;

// Umrechnung auf Basis Kilogramm (kg)
let kg = val;
if (unit === 'g') kg = val / 1000;
else if (unit === 'mg') kg = val / 1000000;
else if (unit === 't') kg = val * 1000;
else if (unit === 'lbs') kg = val * 0.45359237;
else if (unit === 'oz') kg = (val * 28.349523125) / 1000;

const g = kg * 1000;
const lbs = kg / 0.45359237;
const oz = (kg * 1000) / 28.349523125;
const t = kg / 1000;

return {
  primary: { id: 'kg', label: 'Masse in Kilogramm (kg)', value: kg, formattedValue: formatNumber(kg, 4) + ' kg', highlight: true },
  secondary: [
    { id: 'g', label: 'Gramm (g)', value: g, formattedValue: formatNumber(g, 2) + ' g' },
    { id: 'lbs', label: 'Englisches Pfund (lbs)', value: lbs, formattedValue: formatNumber(lbs, 3) + ' lbs' },
    { id: 'oz', label: 'Unzen (oz)', value: oz, formattedValue: formatNumber(oz, 2) + ' oz' },
    { id: 'tonnes', label: 'Tonnen (t)', value: t, formattedValue: formatNumber(t, 6) + ' t' },
  ],
  summaryText: val + ' ' + unit.toUpperCase() + ' entsprechen genau ' + formatNumber(kg, 3) + ' kg (' + formatNumber(g, 1) + ' g, ' + formatNumber(lbs, 2) + ' lbs oder ' + formatNumber(oz, 1) + ' oz).',
};`,
    formula: '1 lb = 0,45359237 kg; 1 oz = 28,3495 g; 1 t = 1.000 kg',
    formulaExplanation: 'Das internationale Avoirdupois-Pfund ist seit 1959 völkerrechtlich exakt auf 0,45359237 Kilogramm festgelegt.',
    workedExample: {
      title: 'Beispiel: 150 lbs Körpergewicht in Kilogramm umrechnen',
      inputValues: [{ label: 'Gewicht', value: '150 lbs' }],
      steps: ['kg = 150 × 0,453592 = 68,04 kg'],
      result: '68,04 kg',
    },
    faqs: [
      { question: 'Was ist der Unterschied zwischen deutschem Pfund und englischem Pound?', answer: 'Das umgangssprachliche deutsche Pfund beträgt genau 500 Gramm (0,5 kg). Das englische Pound (lb) ist leichter und wiegt exakt 453,59 Gramm.' },
      { question: 'Was ist eine Feinunze (oz tr)?', answer: 'Im Edelmetallhandel (Gold, Silber) gilt die Feinunze (Troy Ounce): Sie wiegt exakt 31,1035 Gramm und ist schwerer als die gewöhnliche Handelsunze (28,35 g).' },
    ],
    relatedSlugs: ['laengen-umrechner', 'volumen-umrechner', 'kraft-umrechner'],
  },

  {
    id: 'druck-umrechner',
    slug: 'druck-umrechner',
    name: 'Druck Umrechner (bar, PSI, Pascal, hPa, mbar & Torr)',
    shortName: 'Druck Umrechner',
    category: 'einheiten',
    subcategory: 'Physik & Mechanik',
    metaTitle: 'Druck Umrechner – bar, PSI, Pascal (Pa), hPa & Torr umrechnen',
    metaDescription: 'Rechnen Sie Druckeinheiten exakt um zwischen bar, Millibar (mbar), Pascal (Pa), Hektopascal (hPa), PSI (Pound-force per square inch) und Torr/mmHg.',
    h1: 'Druck Umrechner – bar, PSI, Pascal & mbar sofort umrechnen',
    shortDescription: 'Konvertiert bar, PSI, Pascal, hPa und Torr.',
    searchKeywords: ['druck umrechner bar psi', 'psi in bar umrechnen formel reifendruck', 'pascal in bar hpa mbar', 'bar in torr mmhg rechner'],
    inputs: [
      { id: 'inputValue', label: 'Druckwert', type: 'number', defaultValue: 2.5, min: 0.000001, max: 100000000, step: 0.1, unit: 'Druck' },
      {
        id: 'inputUnit',
        label: 'Ausgangseinheit',
        type: 'select',
        defaultValue: 'bar',
        options: [
          { value: 'bar', label: 'Bar (bar)' },
          { value: 'psi', label: 'Pounds per square inch (PSI)' },
          { value: 'pa', label: 'Pascal (Pa = N/m²)' },
          { value: 'hpa', label: 'Hektopascal / mbar (hPa)' },
          { value: 'mpa', label: 'Megapascal (MPa = N/mm²)' },
          { value: 'torr', label: 'Torr / mmHg' },
        ],
      },
    ],
    calculateCode: `const val = Number(inputs.inputValue) || 0;
const unit = inputs.inputUnit;

// Basis Pascal (Pa):
let pa = val * 100000;
if (unit === 'pa') pa = val;
else if (unit === 'hpa') pa = val * 100;
else if (unit === 'mpa') pa = val * 1000000;
else if (unit === 'psi') pa = val * 6894.757293168;
else if (unit === 'torr') pa = val * 133.322368421;

const bar = pa / 100000;
const psi = pa / 6894.757293168;
const hpa = pa / 100;
const torr = pa / 133.322368421;
const mpa = pa / 1000000;

return {
  primary: { id: 'bar', label: 'Druck in Bar (bar)', value: bar, formattedValue: formatNumber(bar, 4) + ' bar', highlight: true },
  secondary: [
    { id: 'psi', label: 'Pound-force per sq inch (PSI)', value: psi, formattedValue: formatNumber(psi, 2) + ' PSI' },
    { id: 'hpa', label: 'Hektopascal / Millibar (hPa/mbar)', value: hpa, formattedValue: formatNumber(hpa, 1) + ' hPa' },
    { id: 'mpa', label: 'Megapascal (MPa = N/mm²)', value: mpa, formattedValue: formatNumber(mpa, 4) + ' MPa' },
    { id: 'torr', label: 'Torr / mm Quecksilbersäule (mmHg)', value: torr, formattedValue: formatNumber(torr, 1) + ' Torr' },
  ],
  summaryText: val + ' ' + unit.toUpperCase() + ' entsprechen genau ' + formatNumber(bar, 3) + ' bar bzw. ' + formatNumber(psi, 2) + ' PSI (' + formatNumber(hpa, 0) + ' hPa).',
};`,
    formula: '1 bar = 100.000 Pa = 14,5038 PSI; 1 PSI ≈ 0,068947 bar; 1 bar = 750,06 Torr',
    formulaExplanation: 'Ein Bar entspricht annähernd dem durchschnittlichen atmosphärischen Luftdruck der Erde auf Meereshöhe (Standardatmosphäre = 1,01325 bar = 1.013,25 hPa).',
    workedExample: {
      title: 'Beispiel: 32 PSI Autoreifendruck in bar umrechnen',
      inputValues: [{ label: 'Reifendruck', value: '32 PSI' }],
      steps: ['bar = 32 / 14,5038 ≈ 2,206 bar'],
      result: '2,21 bar Reifendruck',
    },
    faqs: [
      { question: 'Was bedeutet der Unterschied zwischen absolutem Druck und Relativdruck?', answer: 'Relativdruck (wie beim Manometer an der Tankstelle) misst die Druckdifferenz zum umgebenden Atmosphärendruck (1 bar). Absoluter Druck = Relativdruck + Atmosphärendruck.' },
      { question: 'Warum ist 1 Hektopascal gleich 1 Millibar?', answer: '1 Hekto = 100 (100 Pa). 1 Bar = 100.000 Pa, somit ist 1 Millibar (1/1.000 Bar) = 100 Pa. Daher gilt exakt: 1 hPa = 1 mbar.' },
    ],
    relatedSlugs: ['temperatur-umrechner', 'kraft-umrechner', 'geschwindigkeit-umrechner'],
  },

  {
    id: 'geschwindigkeit-umrechner',
    slug: 'geschwindigkeit-umrechner',
    name: 'Geschwindigkeit Umrechner (km/h, m/s, mph & Knoten)',
    shortName: 'Geschwindigkeit Umrechner',
    category: 'einheiten',
    subcategory: 'Physik & Mechanik',
    metaTitle: 'Geschwindigkeit Umrechner – km/h, m/s, mph (Meilen) & Knoten umrechnen',
    metaDescription: 'Rechnen Sie Geschwindigkeiten sekundenschnell um zwischen km/h, Meter pro Sekunde (m/s), Meilen pro Stunde (mph), Seemeilen/Knoten (kn) und Mach.',
    h1: 'Geschwindigkeit Umrechner – km/h, m/s, mph & Knoten ermitteln',
    shortDescription: 'Konvertiert km/h in m/s, Meilen pro Stunde und Seemeilen-Knoten.',
    searchKeywords: ['geschwindigkeit umrechnen kmh ms formel', 'mph in kmh umrechnen meilen pro stunde', 'knoten in kmh seemeilen umrechner', 'meter pro sekunde in kmh teilen 3 6'],
    inputs: [
      { id: 'inputValue', label: 'Geschwindigkeitswert', type: 'number', defaultValue: 100, min: 0, max: 100000, step: 1, unit: 'Tempo' },
      {
        id: 'inputUnit',
        label: 'Ausgangseinheit',
        type: 'select',
        defaultValue: 'kmh',
        options: [
          { value: 'kmh', label: 'Kilometer pro Stunde (km/h)' },
          { value: 'ms', label: 'Meter pro Sekunde (m/s)' },
          { value: 'mph', label: 'Meilen pro Stunde (mph)' },
          { value: 'kn', label: 'Knoten (kn = Seemeilen/h)' },
          { value: 'mach', label: 'Mach (Schallgeschwindigkeit in Luft ca. 20°C)' },
        ],
      },
    ],
    calculateCode: `const val = Number(inputs.inputValue) || 0;
const unit = inputs.inputUnit;

// Basis m/s:
let ms = val / 3.6;
if (unit === 'ms') ms = val;
else if (unit === 'mph') ms = val * 0.44704;
else if (unit === 'kn') ms = val * 0.514444;
else if (unit === 'mach') ms = val * 343; // Schallgeschwindigkeit bei 20°C Luft

const kmh = ms * 3.6;
const mph = ms / 0.44704;
const kn = ms / 0.514444;
const mach = ms / 343;

return {
  primary: { id: 'kmh', label: 'Geschwindigkeit in km/h', value: kmh, formattedValue: formatNumber(kmh, 2) + ' km/h', highlight: true },
  secondary: [
    { id: 'ms', label: 'Meter pro Sekunde (m/s)', value: ms, formattedValue: formatNumber(ms, 2) + ' m/s' },
    { id: 'mph', label: 'Meilen pro Stunde (mph)', value: mph, formattedValue: formatNumber(mph, 2) + ' mph' },
    { id: 'kn', label: 'Knoten (Seemeilen/h)', value: kn, formattedValue: formatNumber(kn, 2) + ' kn' },
    { id: 'mach', label: 'Machzahl (Schallgeschwindigkeit)', value: mach, formattedValue: 'Mach ' + formatNumber(mach, 3) },
  ],
  summaryText: val + ' ' + unit.toUpperCase() + ' entsprechen ' + formatNumber(kmh, 1) + ' km/h, ' + formatNumber(ms, 2) + ' m/s, ' + formatNumber(mph, 1) + ' mph und ' + formatNumber(kn, 1) + ' Knoten.',
};`,
    formula: 'km/h = m/s × 3,6; m/s = km/h / 3,6; 1 mph = 1,609344 km/h; 1 Knoten = 1,852 km/h',
    formulaExplanation: 'Der Umrechnungsfaktor 3,6 ergibt sich mathematisch exakt aus dem Verhältnis von 3.600 Sekunden pro Stunde und 1.000 Metern pro Kilometer.',
    workedExample: {
      title: 'Beispiel: 60 mph Tempolimit in den USA in km/h',
      inputValues: [{ label: 'Tempo', value: '60 mph' }],
      steps: ['km/h = 60 × 1,609344 = 96,56 km/h'],
      result: '96,56 km/h',
    },
    faqs: [
      { question: 'Wie rechnet man im Kopf schnell km/h in m/s um?', answer: 'Teilen Sie durch 4 und addieren Sie 10 %: 100 km/h / 4 = 25; 25 + 2,5 = 27,5 m/s (exakter Wert: 27,78 m/s).' },
      { question: 'Was ist ein Knoten in der Schifffahrt?', answer: 'Ein Knoten entspricht einer Geschwindigkeit von einer Seemeile (1.852 Meter) pro Stunde. Der Begriff stammt vom Auswerfen einer Messleine mit Knoten ins Meer.' },
    ],
    relatedSlugs: ['laengen-umrechner', 'kraftstoffverbrauch-umrechner', 'zeit-umrechner'],
  },

  {
    id: 'volumen-umrechner',
    slug: 'volumen-umrechner',
    name: 'Volumen Umrechner (Liter, ml, m³, Gallonen & Fluid Ounces)',
    shortName: 'Volumen Umrechner',
    category: 'einheiten',
    subcategory: 'Raummaße & Hohlmaße',
    metaTitle: 'Volumen Umrechner – Liter (l), Milliliter (ml), m³ & US Gallons',
    metaDescription: 'Rechnen Sie Hohlmaße und Raummaße um zwischen Liter, Milliliter, Kubikmeter (m³), US-Gallonen, UK-Gallonen, Fluid Ounces (fl oz) und Kubikfuß.',
    h1: 'Volumen Umrechner – Liter, m³, Gallonen & fl oz berechnen',
    shortDescription: 'Konvertiert Liter, Kubikmeter, Gallonen und flüssige Unzen.',
    searchKeywords: ['volumen umrechner liter m3 gallonen', 'us gallon in liter umrechnen formel', 'kubikmeter in liter m3', 'fluid ounces fl oz in ml'],
    inputs: [
      { id: 'inputValue', label: 'Volumenwert', type: 'number', defaultValue: 10, min: 0.000001, max: 1000000000, step: 0.1, unit: 'Volumen' },
      {
        id: 'inputUnit',
        label: 'Ausgangseinheit',
        type: 'select',
        defaultValue: 'l',
        options: [
          { value: 'l', label: 'Liter (l = dm³)' },
          { value: 'ml', label: 'Milliliter (ml = cm³)' },
          { value: 'm3', label: 'Kubikmeter (m³ = 1.000 l)' },
          { value: 'usgal', label: 'US Gallone (gal ≈ 3,785 l)' },
          { value: 'ukgal', label: 'UK Gallone imperial (gal ≈ 4,546 l)' },
          { value: 'floz', label: 'US Fluid Ounce (fl oz ≈ 29,57 ml)' },
        ],
      },
    ],
    calculateCode: `const val = Number(inputs.inputValue) || 0;
const unit = inputs.inputUnit;

// Basis Liter:
let liters = val;
if (unit === 'ml') liters = val / 1000;
else if (unit === 'm3') liters = val * 1000;
else if (unit === 'usgal') liters = val * 3.785411784;
else if (unit === 'ukgal') liters = val * 4.54609;
else if (unit === 'floz') liters = (val * 29.5735295625) / 1000;

const ml = liters * 1000;
const m3 = liters / 1000;
const usgal = liters / 3.785411784;
const ukgal = liters / 4.54609;
const floz = (liters * 1000) / 29.5735295625;

return {
  primary: { id: 'liters', label: 'Volumen in Litern (l)', value: liters, formattedValue: formatNumber(liters, 3) + ' Liter', highlight: true },
  secondary: [
    { id: 'm3', label: 'Kubikmeter (m³)', value: m3, formattedValue: formatNumber(m3, 4) + ' m³' },
    { id: 'ml', label: 'Milliliter (ml)', value: ml, formattedValue: formatNumber(ml, 1) + ' ml' },
    { id: 'usgal', label: 'US Gallonen (gal)', value: usgal, formattedValue: formatNumber(usgal, 2) + ' gal' },
    { id: 'floz', label: 'US Fluid Ounces (fl oz)', value: floz, formattedValue: formatNumber(floz, 1) + ' fl oz' },
  ],
  summaryText: val + ' ' + unit.toUpperCase() + ' entsprechen genau ' + formatNumber(liters, 2) + ' Litern (' + formatNumber(m3, 3) + ' m³ bzw. ' + formatNumber(usgal, 2) + ' US-Gallonen).',
};`,
    formula: '1 m³ = 1.000 l; 1 US gal = 3,78541 l; 1 UK gal = 4,54609 l; 1 US fl oz = 29,5735 ml',
    formulaExplanation: 'Ein Liter ist definiert als genau ein Kubikdezimeter (1 dm³ = 0,001 m³).',
    workedExample: {
      title: 'Beispiel: 5 US-Gallonen Benzin in Liter umrechnen',
      inputValues: [{ label: 'Volumen', value: '5 US Gallonen' }],
      steps: ['Liter = 5 × 3,78541 = 18,93 Liter'],
      result: '18,93 Liter',
    },
    faqs: [
      { question: 'Wie viele Liter passen in einen Kubikmeter?', answer: 'Exakt 1.000 Liter passen in einen Kubikmeter Wasser (1 m³ = 1.000 l = 1 Tonne Wasser bei 4°C).' },
      { question: 'Was ist der Unterschied zwischen US Gallon und UK Imperial Gallon?', answer: 'Die britische Gallone (Imperial Gallon = 4,546 l) ist ca. 20 % größer als die US-Gallone (3,785 l).' },
    ],
    relatedSlugs: ['gewicht-masse-umrechner', 'laengen-umrechner', 'gramm-in-ml-rechner'],
  },

  {
    id: 'flaeche-umrechner',
    slug: 'flaeche-umrechner',
    name: 'Flächen Umrechner (m², km², Hektar ha, Ar & Acres)',
    shortName: 'Flächen Umrechner',
    category: 'einheiten',
    subcategory: 'Geometrische Maße',
    metaTitle: 'Flächen Umrechner – Quadratmeter (m²), Hektar (ha), Ar & Acres',
    metaDescription: 'Rechnen Sie Flächenmaße präzise um zwischen Quadratmetern (m²), Quadratkilometern (km²), Hektar (ha), Ar (a), Acres und Quadratfuß (sq ft).',
    h1: 'Flächen Umrechner – m², Hektar, Ar & Acres sofort umrechnen',
    shortDescription: 'Konvertiert Quadratmeter, Hektar, Ar und angloamerikanische Acres.',
    searchKeywords: ['flaechen umrechner m2 hektar', 'hektar in quadratmeter umrechnen 10000', 'ar in m2 umrechner', 'acre in hektar quadratmeter'],
    inputs: [
      { id: 'inputValue', label: 'Flächenwert', type: 'number', defaultValue: 1, min: 0.000001, max: 1000000000, step: 0.1, unit: 'Fläche' },
      {
        id: 'inputUnit',
        label: 'Ausgangseinheit',
        type: 'select',
        defaultValue: 'ha',
        options: [
          { value: 'ha', label: 'Hektar (ha = 10.000 m²)' },
          { value: 'm2', label: 'Quadratmeter (m²)' },
          { value: 'km2', label: 'Quadratkilometer (km²)' },
          { value: 'a', label: 'Ar (a = 100 m²)' },
          { value: 'acre', label: 'Acre (ac ≈ 4.046,86 m²)' },
          { value: 'sqft', label: 'Quadratfuß (sq ft ≈ 0,0929 m²)' },
        ],
      },
    ],
    calculateCode: `const val = Number(inputs.inputValue) || 0;
const unit = inputs.inputUnit;

// Basis m²:
let m2 = val * 10000;
if (unit === 'm2') m2 = val;
else if (unit === 'km2') m2 = val * 1000000;
else if (unit === 'a') m2 = val * 100;
else if (unit === 'acre') m2 = val * 4046.8564224;
else if (unit === 'sqft') m2 = val * 0.09290304;

const ha = m2 / 10000;
const km2 = m2 / 1000000;
const a = m2 / 100;
const acre = m2 / 4046.8564224;
const sqft = m2 / 0.09290304;

return {
  primary: { id: 'm2', label: 'Fläche in Quadratmetern (m²)', value: m2, formattedValue: formatNumber(m2, 2) + ' m²', highlight: true },
  secondary: [
    { id: 'ha', label: 'Hektar (ha)', value: ha, formattedValue: formatNumber(ha, 4) + ' ha' },
    { id: 'a', label: 'Ar (a)', value: a, formattedValue: formatNumber(a, 2) + ' a' },
    { id: 'acre', label: 'Acres (ac)', value: acre, formattedValue: formatNumber(acre, 3) + ' Acres' },
    { id: 'km2', label: 'Quadratkilometer (km²)', value: km2, formattedValue: formatNumber(km2, 6) + ' km²' },
  ],
  summaryText: val + ' ' + unit.toUpperCase() + ' entsprechen genau ' + formatNumber(m2, 1) + ' m² (' + formatNumber(ha, 2) + ' ha bzw. ' + formatNumber(acre, 2) + ' Acres).',
};`,
    formula: '1 ha = 10.000 m² = 100 Ar; 1 km² = 100 ha = 1.000.000 m²; 1 Acre ≈ 4.046,86 m²',
    formulaExplanation: 'Ein Hektar entspricht einem Quadrat von 100 Metern Kantenlänge (100 m × 100 m = 10.000 m²). Ein Fußballfeld hat meist etwa 0,7 Hektar.',
    workedExample: {
      title: 'Beispiel: 2,5 Hektar Ackerland in Quadratmeter umrechnen',
      inputValues: [{ label: 'Fläche', value: '2,5 ha' }],
      steps: ['m² = 2,5 × 10.000 = 25.000 m²'],
      result: '25.000 m²',
    },
    faqs: [
      { question: 'Wie groß ist 1 Ar?', answer: '1 Ar entspricht exakt 100 Quadratmetern (ein Quadrat von 10 m × 10 m). 100 Ar ergeben 1 Hektar.' },
      { question: 'Wie viele Quadratmeter hat ein Acre?', answer: 'Ein US/UK Acre entspricht historisch der Fläche, die ein Ochsengespann an einem Tag pflügen konnte, heute normiert auf exakt 4.046,856 Quadratmeter (ca. 0,405 ha).' },
    ],
    relatedSlugs: ['laengen-umrechner', 'volumen-umrechner', 'dachflaeche-rechner'],
  },

  {
    id: 'energie-arbeit-umrechner',
    slug: 'energie-arbeit-umrechner',
    name: 'Energie & Arbeit Umrechner (Joule, kWh, kcal & BTU)',
    shortName: 'Energie Umrechner',
    category: 'einheiten',
    subcategory: 'Physik & Mechanik',
    metaTitle: 'Energie Umrechner – Joule (J), Kilowattstunden (kWh), kcal & BTU',
    metaDescription: 'Rechnen Sie Energie und mechanische Arbeit um zwischen Joule (J), Kilojoule (kJ), Kilowattstunden (kWh), Kilokalorien (kcal) und British Thermal Units (BTU).',
    h1: 'Energie Umrechner – Joule, kWh, kcal & BTU berechnen',
    shortDescription: 'Konvertiert Joule in kWh, Kilokalorien und BTU.',
    searchKeywords: ['energie umrechner joule kwh formel', 'kwh in joule megajoule umrechnen', 'kilokalorien in kwh berechnen heizung', 'btu in wattstunden joule rechner'],
    inputs: [
      { id: 'inputValue', label: 'Energiewert', type: 'number', defaultValue: 100, min: 0.000001, max: 100000000000, step: 1, unit: 'Energie' },
      {
        id: 'inputUnit',
        label: 'Ausgangseinheit',
        type: 'select',
        defaultValue: 'kwh',
        options: [
          { value: 'kwh', label: 'Kilowattstunden (kWh)' },
          { value: 'j', label: 'Joule (J = Ws = N·m)' },
          { value: 'kj', label: 'Kilojoule (kJ)' },
          { value: 'mj', label: 'Megajoule (MJ)' },
          { value: 'kcal', label: 'Kilokalorien (kcal)' },
          { value: 'btu', label: 'British Thermal Unit (BTU)' },
        ],
      },
    ],
    calculateCode: `const val = Number(inputs.inputValue) || 0;
const unit = inputs.inputUnit;

// Basis Joule (J): 1 kWh = 3.600.000 J
let joule = val * 3600000;
if (unit === 'j') joule = val;
else if (unit === 'kj') joule = val * 1000;
else if (unit === 'mj') joule = val * 1000000;
else if (unit === 'kcal') joule = val * 4184;
else if (unit === 'btu') joule = val * 1055.05585;

const kwh = joule / 3600000;
const kj = joule / 1000;
const mj = joule / 1000000;
const kcal = joule / 4184;
const btu = joule / 1055.05585;

return {
  primary: { id: 'kwh', label: 'Energie in Kilowattstunden (kWh)', value: kwh, formattedValue: formatNumber(kwh, 4) + ' kWh', highlight: true },
  secondary: [
    { id: 'mj', label: 'Megajoule (MJ)', value: mj, formattedValue: formatNumber(mj, 3) + ' MJ' },
    { id: 'kj', label: 'Kilojoule (kJ)', value: kj, formattedValue: formatNumber(kj, 1) + ' kJ' },
    { id: 'kcal', label: 'Kilokalorien (kcal)', value: kcal, formattedValue: formatNumber(kcal, 1) + ' kcal' },
    { id: 'btu', label: 'British Thermal Units (BTU)', value: btu, formattedValue: formatNumber(btu, 1) + ' BTU' },
  ],
  summaryText: val + ' ' + unit.toUpperCase() + ' entsprechen genau ' + formatNumber(kwh, 3) + ' kWh (' + formatNumber(mj, 2) + ' MJ bzw. ' + formatNumber(kcal, 0) + ' kcal).',
};`,
    formula: '1 kWh = 3,6 MJ = 3.600.000 J; 1 kcal = 4.184 J; 1 BTU ≈ 1.055 J',
    formulaExplanation: 'Eine Kilowattstunde entspricht der Energie, die ein Gerät mit einer Leistung von 1.000 Watt genau eine Stunde lang aufnimmt oder abgibt (1.000 W × 3.600 s = 3.600.000 Ws).',
    workedExample: {
      title: 'Beispiel: 2.000 kcal Tagesbedarf in Kilowattstunden (kWh)',
      inputValues: [{ label: 'Energie', value: '2.000 kcal' }],
      steps: ['Joule = 2.000 × 4.184 = 8.368.000 J', 'kWh = 8.368.000 / 3.600.000 = 2,324 kWh'],
      result: '2,32 kWh (entspricht der Dauerleistung einer 100W-Lampe für fast 24h)',
    },
    faqs: [
      { question: 'Wie hängen Leistung (Watt) und Energie (Joule/kWh) zusammen?', answer: 'Leistung ist Energie pro Zeit: 1 Watt = 1 Joule pro Sekunde. Energie = Leistung × Zeit (1 W × 1 h = 1 Wh = 3.600 J).' },
      { question: 'Was ist 1 BTU?', answer: '1 British Thermal Unit ist die Wärmemenge, die benötigt wird, um ein englisches Pfund Wasser um 1 Grad Fahrenheit zu erwärmen (ca. 1.055 Joule).' },
    ],
    relatedSlugs: ['leistung-umrechner', 'stromkostenrechner', 'kalorien-rezept-rechner'],
  },

  {
    id: 'leistung-umrechner',
    slug: 'leistung-umrechner',
    name: 'Leistung Umrechner (kW, PS Pferdestärke, Watt & HP)',
    shortName: 'Leistung Umrechner',
    category: 'einheiten',
    subcategory: 'Physik & Mechanik',
    metaTitle: 'Leistung Umrechner – kW in PS, Watt & mechanische Horsepower (hp)',
    metaDescription: 'Rechnen Sie Motor- und Heizleistung exakt um zwischen Kilowatt (kW), DIN-Pferdestärke (PS), Watt (W) und angloamerikanischen Horsepower (hp).',
    h1: 'Leistung Umrechner – kW in PS & Horsepower präzise umrechnen',
    shortDescription: 'Konvertiert Kilowatt (kW) in Pferdestärken (PS) und Watt.',
    searchKeywords: ['leistung umrechner kw in ps formel 1 36', 'ps in kw umrechnen auto', 'horsepower hp in kw rechner', 'watt in kilowatt pferdestaerke'],
    inputs: [
      { id: 'inputValue', label: 'Leistungswert', type: 'number', defaultValue: 150, min: 0.001, max: 10000000, step: 1, unit: 'Leistung' },
      {
        id: 'inputUnit',
        label: 'Ausgangseinheit',
        type: 'select',
        defaultValue: 'ps',
        options: [
          { value: 'ps', label: 'DIN-Pferdestärke (PS = 0,73549875 kW)' },
          { value: 'kw', label: 'Kilowatt (kW = 1.000 W)' },
          { value: 'w', label: 'Watt (W = J/s)' },
          { value: 'hp', label: 'Mechanical Horsepower imperial (hp ≈ 0,7457 kW)' },
        ],
      },
    ],
    calculateCode: `const val = Number(inputs.inputValue) || 0;
const unit = inputs.inputUnit;

// Basis Kilowatt (kW):
let kw = val;
if (unit === 'ps') kw = val * 0.73549875;
else if (unit === 'w') kw = val / 1000;
else if (unit === 'hp') kw = val * 0.74569987;

const ps = kw / 0.73549875;
const w = kw * 1000;
const hp = kw / 0.74569987;

return {
  primary: { id: 'kw', label: 'Leistung in Kilowatt (kW)', value: kw, formattedValue: formatNumber(kw, 2) + ' kW', highlight: true },
  secondary: [
    { id: 'ps', label: 'Metrische Pferdestärke (PS)', value: ps, formattedValue: formatNumber(ps, 1) + ' PS' },
    { id: 'hp', label: 'Mechanical Horsepower (hp)', value: hp, formattedValue: formatNumber(hp, 1) + ' hp' },
    { id: 'watt', label: 'Watt (W)', value: w, formattedValue: formatNumber(w, 0) + ' W' },
  ],
  summaryText: val + ' ' + unit.toUpperCase() + ' entsprechen genau ' + formatNumber(kw, 2) + ' kW bzw. ' + formatNumber(ps, 1) + ' PS (' + formatNumber(hp, 1) + ' hp).',
};`,
    formula: '1 kW ≈ 1,35962 PS; 1 PS = 735,49875 Watt; 1 hp ≈ 1,01387 PS',
    formulaExplanation: '1 DIN-PS ist die Leistung, die benötigt wird, um eine Masse von 75 Kilogramm in einer Sekunde gegen die Erdschwere um einen Meter anzuheben (75 kg · 9,80665 m/s² · 1 m = 735,5 Watt).',
    workedExample: {
      title: 'Beispiel: 150 PS Automotor in kW umrechnen',
      inputValues: [{ label: 'Leistung', value: '150 PS' }],
      steps: ['kW = 150 × 0,735499 = 110,32 kW'],
      result: '110,32 kW',
    },
    faqs: [
      { question: 'Was ist der Unterschied zwischen PS und HP?', answer: 'Metrische PS (DIN) basieren auf 75 kg·m/s = 735,5 Watt. Angloamerikanische HP (Imperial Horsepower) basieren auf 550 ft·lb/s = 745,7 Watt. 100 PS entsprechen ca. 98,6 HP.' },
      { question: 'Warum steht in Fahrzeugpapieren nur noch kW?', answer: 'Seit der EU-Richtlinie 80/181/EWG ist das Kilowatt (kW) die gesetzliche Primäreinheit für Leistung im Fahrzeugschein. PS darf nur noch als zusätzliche Angabe verwendet werden.' },
    ],
    relatedSlugs: ['energie-arbeit-umrechner', 'drehmoment-umrechner', 'stromkostenrechner'],
  },

  {
    id: 'daten-speicher-umrechner',
    slug: 'daten-speicher-umrechner',
    name: 'Datenspeicher Umrechner (Byte, KB, MB, GB, TB & Kibibyte)',
    shortName: 'Datenspeicher Umrechner',
    category: 'einheiten',
    subcategory: 'Informatik & Digital',
    metaTitle: 'Datenspeicher Umrechner – Byte, KB, MB, GB, TB, PB & KiB, GiB',
    metaDescription: 'Rechnen Sie Speicherkapazitäten um: Dezimal (1.000er Basis: KB, MB, GB, TB) und Binär (1.024er Basis: KiB, MiB, GiB, TiB) inklusive Bit-Umrechnung.',
    h1: 'Datenspeicher Umrechner – Byte, MB, GB & TB präzise umrechnen',
    shortDescription: 'Konvertiert Byte in KB, MB, GB, TB nach Dezimal- und Binärstandard.',
    searchKeywords: ['daten speicher umrechner gigabyte terabyte', 'gb in mb umrechnen 1024 oder 1000', 'kibibyte mebibyte gibibyte rechner', 'byte in bit umrechnen'],
    inputs: [
      { id: 'inputValue', label: 'Speichergröße', type: 'number', defaultValue: 100, min: 0.001, max: 1000000000000, step: 1, unit: 'Daten' },
      {
        id: 'inputUnit',
        label: 'Ausgangseinheit',
        type: 'select',
        defaultValue: 'gb',
        options: [
          { value: 'gb', label: 'Gigabyte (GB – 10⁹ Byte)' },
          { value: 'mb', label: 'Megabyte (MB – 10⁶ Byte)' },
          { value: 'tb', label: 'Terabyte (TB – 10¹² Byte)' },
          { value: 'gib', label: 'Gibibyte (GiB – 1.024³ Byte / Windows)' },
          { value: 'byte', label: 'Byte (B)' },
        ],
      },
    ],
    calculateCode: `const val = Number(inputs.inputValue) || 0;
const unit = inputs.inputUnit;

// Basis Bytes:
let bytes = val * 1000000000;
if (unit === 'byte') bytes = val;
else if (unit === 'mb') bytes = val * 1000000;
else if (unit === 'tb') bytes = val * 1000000000000;
else if (unit === 'gib') bytes = val * Math.pow(1024, 3);

// Dezimal (SI, Festplattenhersteller):
const kb = bytes / 1000;
const mb = bytes / 1000000;
const gb = bytes / 1000000000;
const tb = bytes / 1000000000000;

// Binär (IEC, Windows Betriebssystem):
const mib = bytes / Math.pow(1024, 2);
const gib = bytes / Math.pow(1024, 3);
const tib = bytes / Math.pow(1024, 4);

return {
  primary: { id: 'gb', label: 'Gigabyte dezimal (GB)', value: gb, formattedValue: formatNumber(gb, 3) + ' GB', highlight: true },
  secondary: [
    { id: 'gib', label: 'Gibibyte binär (GiB – echte Windows-Anzeige)', value: gib, formattedValue: formatNumber(gib, 3) + ' GiB' },
    { id: 'mb', label: 'Megabyte (MB)', value: mb, formattedValue: formatNumber(mb, 1) + ' MB' },
    { id: 'tb', label: 'Terabyte (TB)', value: tb, formattedValue: formatNumber(tb, 4) + ' TB' },
    { id: 'bits', label: 'Bits Gesamtanzahl', value: bytes * 8, formattedValue: formatNumber(bytes * 8, 0) + ' Bits' },
  ],
  summaryText: val + ' ' + unit.toUpperCase() + ' entsprechen ' + formatNumber(gb, 2) + ' GB dezimal (Herstellerangabe) bzw. ' + formatNumber(gib, 2) + ' GiB im Betriebssystem Windows.',
};`,
    formula: 'Dezimal (SI): 1 GB = 1.000 MB = 10⁹ Byte; Binär (IEC): 1 GiB = 1.024 MiB = 2³⁰ Byte',
    formulaExplanation: 'Festplattenhersteller verkaufen Speicher in Dezimal-GB (1 GB = 1.000.000.000 Byte). Windows rechnet jedoch binär in 1.024er-Schritten (GiB), weshalb eine 1-TB-Festplatte unter Windows nur als ca. 931 GB angezeigt wird.',
    workedExample: {
      title: 'Beispiel: Warum zeigt eine 1 TB Festplatte nur 931 GB an?',
      inputValues: [{ label: 'Speicher', value: '1.000 GB' }],
      steps: ['Bytes = 1.000.000.000.000 Byte', 'GiB = 1.000.000.000.000 / 1.024³ = 931,32 GiB'],
      result: '931,32 GiB nutzbare Kapazität in Windows',
    },
    faqs: [
      { question: 'Was ist der Unterschied zwischen Bit und Byte?', answer: '1 Byte besteht immer aus genau 8 Bits. Ein Bit kann den Zustand 0 oder 1 annehmen, ein Byte kann 256 verschiedene Zustände (0 bis 255) darstellen.' },
      { question: 'Was bedeutet KiB, MiB und GiB?', answer: 'Das sind die offiziellen IEC-Binärpräfixe: Kibi (1.024), Mebi (1.024²), Gibi (1.024³). Sie verhindern Verwechslungen mit den metrischen Dezimalpräfixen Kilo, Mega und Giga.' },
    ],
    relatedSlugs: ['datenrate-bandbreite-umrechner', 'binaer-hex-dezimal-umrechner', 'zeit-umrechner'],
  },

  {
    id: 'datenrate-bandbreite-umrechner',
    slug: 'datenrate-bandbreite-umrechner',
    name: 'Datenrate & Downloadzeit Rechner (Mbit/s in MB/s & Download-Dauer)',
    shortName: 'Downloadzeit Rechner',
    category: 'einheiten',
    subcategory: 'Informatik & Digital',
    metaTitle: 'Downloadzeit Rechner – Mbit/s in MB/s umrechnen & Download-Dauer',
    metaDescription: 'Berechnen Sie die echte Downloadzeit für Spiele, Filme und Backups nach Dateigröße (GB) und Internet-Bandbreite (z. B. DSL 50, Glasfaser 250 Mbit/s, Gigabit).',
    h1: 'Downloadzeit Rechner – Wie lange dauert mein Download?',
    shortDescription: 'Berechnet Downloadzeit aus Bandbreite (Mbit/s) und Dateigröße (GB).',
    searchKeywords: ['downloadzeit rechner wie lange dauert download', 'mbits in mbs umrechnen faktor 8', 'glasfaser download dauer spiel 100 gb', 'dsl geschwindigkeit megabyte pro sekunde'],
    inputs: [
      { id: 'fileSizeGb', label: 'Dateigröße (z. B. Spiel, Film, Update)', type: 'number', defaultValue: 50, min: 0.1, max: 10000, step: 1, unit: 'GB' },
      {
        id: 'bandwidthMbits',
        label: 'Internet-Geschwindigkeit (Download-Rate)',
        type: 'select',
        defaultValue: '100',
        options: [
          { value: '16', label: 'DSL 16 (16 Mbit/s – ca. 2,0 MB/s)' },
          { value: '50', label: 'VDSL 50 (50 Mbit/s – ca. 6,25 MB/s)' },
          { value: '100', label: 'VDSL / Kabel 100 (100 Mbit/s – ca. 12,5 MB/s)' },
          { value: '250', label: 'Supervectoring 250 (250 Mbit/s – ca. 31,25 MB/s)' },
          { value: '1000', label: 'Gigabit Glasfaser 1.000 (1.000 Mbit/s – ca. 125 MB/s)' },
        ],
      },
      { id: 'overheadLoss', label: 'Protokoll-Overhead & Netzwerkauslastung', type: 'number', defaultValue: 10, min: 0, max: 30, step: 1, unit: '%' },
    ],
    calculateCode: `const sizeGb = Number(inputs.fileSizeGb) || 0;
const speedMbits = Number(inputs.bandwidthMbits) || 100;
const overhead = 1 + ((Number(inputs.overheadLoss) || 0) / 100);

// 1 Byte = 8 Bits -> Effektive MB/s = Speed in Mbit/s / 8
const theoreticalMbs = speedMbits / 8;
const effectiveMbs = theoreticalMbs / overhead;

const totalMegabytes = sizeGb * 1000;
const durationSeconds = totalMegabytes / effectiveMbs;

const minutes = Math.floor(durationSeconds / 60);
const hours = Math.floor(minutes / 60);
const remainingMinutes = minutes % 60;
const remainingSecs = Math.round(durationSeconds % 60);

let durationText = remainingSecs + ' Sekunden';
if (hours > 0) {
  durationText = hours + ' Std. ' + remainingMinutes + ' Min.';
} else if (minutes > 0) {
  durationText = minutes + ' Min. ' + remainingSecs + ' Sek.';
}

return {
  primary: { id: 'duration', label: 'Voraussichtliche Download-Dauer', value: durationSeconds, formattedValue: durationText, highlight: true },
  secondary: [
    { id: 'effectiveSpeed', label: 'Effektive Download-Geschwindigkeit', value: effectiveMbs, formattedValue: formatNumber(effectiveMbs, 2) + ' MB/s' },
    { id: 'theoreticalSpeed', label: 'Theoretisches Maximum', value: theoreticalMbs, formattedValue: formatNumber(theoreticalMbs, 2) + ' MB/s' },
    { id: 'fileSize', label: 'Dateigröße in Megabyte', value: totalMegabytes, formattedValue: formatNumber(totalMegabytes, 0) + ' MB' },
  ],
  summaryText: 'Ein Download von ' + sizeGb + ' GB bei ' + speedMbits + ' Mbit/s Leitung (effektiv ca. ' + formatNumber(effectiveMbs, 1) + ' MB/s) dauert rund ' + durationText + '.',
};`,
    formula: 'Downloadzeit (s) = (Dateigröße in MB) / (Bandbreite in Mbit/s / 8 × Overheadfaktor)',
    formulaExplanation: 'Internet-Provider werben mit Megabit (Mbit/s). Downloads zeigen Browser und Launcher jedoch in Megabyte (MB/s) an. Da 1 Byte aus 8 Bits besteht, muss die Provider-Zahl immer durch 8 geteilt werden.',
    workedExample: {
      title: 'Beispiel: 50 GB Spiel mit 100 Mbit/s Leitung herunterladen',
      inputValues: [{ label: 'Größe', value: '50 GB (50.000 MB)' }, { label: 'Speed', value: '100 Mbit/s' }],
      steps: ['MB/s = 100 / 8 = 12,5 MB/s (mit 10 % Verlust: 11,36 MB/s)', 'Zeit = 50.000 / 11,36 = 4.401 Sekunden ≈ 73 Minuten'],
      result: 'ca. 1 Stunde und 13 Minuten',
    },
    faqs: [
      { question: 'Warum erreiche ich beim Download selten die volle Mbit/s-Zahl?', answer: 'WLAN-Verluste, Server-Auslastung des Anbieters, andere Geräte im Heimnetzwerk und TCP/IP-Protokoll-Overhead (ca. 5-10 %) reduzieren die praktische Transferrate.' },
      { question: 'Was ist der Unterschied zwischen Upload und Download?', answer: 'Download ist die Geschwindigkeit beim Herunterladen aus dem Internet (z. B. Netflix-Stream). Upload ist die Geschwindigkeit beim Hochladen (z. B. Backup in die Cloud, Videoanruf).' },
    ],
    relatedSlugs: ['daten-speicher-umrechner', 'zeit-umrechner', 'stromkostenrechner'],
  },

  {
    id: 'drehmoment-umrechner',
    slug: 'drehmoment-umrechner',
    name: 'Drehmoment Umrechner (Nm in ft-lb, in-lb & kpm)',
    shortName: 'Drehmoment Umrechner',
    category: 'einheiten',
    subcategory: 'Physik & Mechanik',
    metaTitle: 'Drehmoment Umrechner – Newtonmeter (Nm) in ft-lb, in-lb & kpm',
    metaDescription: 'Rechnen Sie Drehmomente für Drehmomentschlüssel und Kfz um: Newtonmeter (Nm), Foot-Pounds (ft-lb / lbf-ft), Inch-Pounds (in-lb) und Kilopondmeter (kpm).',
    h1: 'Drehmoment Umrechner – Nm, ft-lb & in-lb präzise umrechnen',
    shortDescription: 'Konvertiert Newtonmeter in Foot-Pounds für Werkzeug und Kraftfahrzeuge.',
    searchKeywords: ['drehmoment umrechner nm in ft lb', 'newtonmeter in foot pounds umrechnen', 'drehmomentschluessel tabelle nm in lb', 'drehmoment kpm newtonmeter'],
    inputs: [
      { id: 'inputValue', label: 'Drehmomentwert', type: 'number', defaultValue: 120, min: 0.01, max: 100000, step: 1, unit: 'Drehmoment' },
      {
        id: 'inputUnit',
        label: 'Ausgangseinheit',
        type: 'select',
        defaultValue: 'nm',
        options: [
          { value: 'nm', label: 'Newtonmeter (Nm = N·m)' },
          { value: 'ftlb', label: 'Foot-Pounds (ft-lb / lbf·ft)' },
          { value: 'inlb', label: 'Inch-Pounds (in-lb)' },
          { value: 'kpm', label: 'Kilopondmeter (kpm)' },
        ],
      },
    ],
    calculateCode: `const val = Number(inputs.inputValue) || 0;
const unit = inputs.inputUnit;

// Basis Newtonmeter (Nm):
let nm = val;
if (unit === 'ftlb') nm = val * 1.3558179483314;
else if (unit === 'inlb') nm = val * 0.1129848290276;
else if (unit === 'kpm') nm = val * 9.80665;

const ftlb = nm / 1.3558179483314;
const inlb = nm / 0.1129848290276;
const kpm = nm / 9.80665;

return {
  primary: { id: 'nm', label: 'Drehmoment in Newtonmetern (Nm)', value: nm, formattedValue: formatNumber(nm, 2) + ' Nm', highlight: true },
  secondary: [
    { id: 'ftlb', label: 'Foot-Pounds (ft-lb)', value: ftlb, formattedValue: formatNumber(ftlb, 2) + ' ft-lb' },
    { id: 'inlb', label: 'Inch-Pounds (in-lb)', value: inlb, formattedValue: formatNumber(inlb, 1) + ' in-lb' },
    { id: 'kpm', label: 'Kilopondmeter (kpm)', value: kpm, formattedValue: formatNumber(kpm, 2) + ' kpm' },
  ],
  summaryText: val + ' ' + unit.toUpperCase() + ' entsprechen genau ' + formatNumber(nm, 2) + ' Nm bzw. ' + formatNumber(ftlb, 2) + ' ft-lb.',
};`,
    formula: '1 Nm ≈ 0,737562 ft-lb; 1 ft-lb ≈ 1,35582 Nm; 1 kpm ≈ 9,80665 Nm',
    formulaExplanation: 'Drehmoment ist das Produkt aus Hebelarm r und senkrecht angreifender Kraft F (M = F · r). 1 Newtonmeter ist die Hebelwirkung von 1 Newton Kraft an einem Hebel von 1 Meter.',
    workedExample: {
      title: 'Beispiel: Radmuttern anziehen mit 120 Nm in ft-lb',
      inputValues: [{ label: 'Drehmoment', value: '120 Nm' }],
      steps: ['ft-lb = 120 / 1,35582 = 88,51 ft-lb'],
      result: '88,5 ft-lb',
    },
    faqs: [
      { question: 'Mit wie viel Nm zieht man Alufelgen beim Auto fest?', answer: 'Bei den meisten PKW liegt das vorgeschriebene Anzugsdrehmoment für Radschrauben bei Alufelgen zwischen 110 und 140 Nm (siehe Fahrzeughandbuch).' },
      { question: 'Muss ein Drehmomentschlüssel nach der Benutzung entspannt werden?', answer: 'Ja! Mechanische Drehmomentschlüssel müssen nach der Arbeit immer auf den kleinsten Einstellwert zurückgedreht werden, damit die interne Feder nicht ermüdet und ungenau wird.' },
    ],
    relatedSlugs: ['leistung-umrechner', 'kraft-umrechner', 'reifen-rechner'],
  },

  {
    id: 'kraft-umrechner',
    slug: 'kraft-umrechner',
    name: 'Kraft Umrechner (Newton N, Kilonewton kN, Kilopond kp & lbf)',
    shortName: 'Kraft Umrechner',
    category: 'einheiten',
    subcategory: 'Physik & Mechanik',
    metaTitle: 'Kraft Umrechner – Newton (N), Kilonewton (kN), Kilopond (kp) & lbf',
    metaDescription: 'Rechnen Sie physikalische Kräfte und Zugkräfte um: Newton (N), Kilonewton (kN), Meganewton (MN), Kilopond (kp), Pound-force (lbf) und Dyn (dyn).',
    h1: 'Kraft Umrechner – Newton, kN, Kilopond & Pound-force',
    shortDescription: 'Konvertiert physikalische Kräfte zwischen Newton, kN und lbf.',
    searchKeywords: ['kraft umrechner newton kilonewton kn', 'kilonewton in tonnen umrechnen fahrstuhllast', 'kilopond kp in newton n', 'pound force lbf in newton rechner'],
    inputs: [
      { id: 'inputValue', label: 'Kraftwert', type: 'number', defaultValue: 10, min: 0.0001, max: 1000000000, step: 0.5, unit: 'Kraft' },
      {
        id: 'inputUnit',
        label: 'Ausgangseinheit',
        type: 'select',
        defaultValue: 'kn',
        options: [
          { value: 'kn', label: 'Kilonewton (kN = 1.000 N)' },
          { value: 'n', label: 'Newton (N = kg·m/s²)' },
          { value: 'mn', label: 'Meganewton (MN = 10⁶ N)' },
          { value: 'kp', label: 'Kilopond (kp = 9,80665 N)' },
          { value: 'lbf', label: 'Pound-force (lbf ≈ 4,4482 N)' },
        ],
      },
    ],
    calculateCode: `const val = Number(inputs.inputValue) || 0;
const unit = inputs.inputUnit;

// Basis Newton (N):
let n = val * 1000;
if (unit === 'n') n = val;
else if (unit === 'mn') n = val * 1000000;
else if (unit === 'kp') n = val * 9.80665;
else if (unit === 'lbf') n = val * 4.4482216152605;

const kn = n / 1000;
const kp = n / 9.80665;
const lbf = n / 4.4482216152605;
const tonnesWeight = n / 9806.65; // Entsprechende Erd-Gewichtsmasse

return {
  primary: { id: 'kn', label: 'Kraft in Kilonewton (kN)', value: kn, formattedValue: formatNumber(kn, 3) + ' kN', highlight: true },
  secondary: [
    { id: 'n', label: 'Newton (N)', value: n, formattedValue: formatNumber(n, 1) + ' N' },
    { id: 'tonnes', label: 'Entsprechende Masse auf der Erde (g = 9,81 m/s²)', value: tonnesWeight, formattedValue: 'ca. ' + formatNumber(tonnesWeight, 3) + ' Tonnen' },
    { id: 'lbf', label: 'Pound-force (lbf)', value: lbf, formattedValue: formatNumber(lbf, 2) + ' lbf' },
    { id: 'kp', label: 'Kilopond (kp)', value: kp, formattedValue: formatNumber(kp, 2) + ' kp' },
  ],
  summaryText: val + ' ' + unit.toUpperCase() + ' entsprechen genau ' + formatNumber(kn, 2) + ' kN (' + formatNumber(n, 0) + ' N). Dies entspricht der Gewichtskraft von ca. ' + formatNumber(tonnesWeight, 2) + ' Tonnen.',
};`,
    formula: '1 N = 1 kg × m/s²; 1 kN = 1.000 N; 1 kp = 9,80665 N; 1 lbf ≈ 4,44822 N',
    formulaExplanation: '1 Newton ist die Kraft, die einem ruhenden Körper der Masse 1 Kilogramm eine Beschleunigung von 1 m/s² erteilt. Auf der Erde entspricht eine Masse von 100 Gramm ungefähr 1 Newton Gewichtskraft.',
    workedExample: {
      title: 'Beispiel: 10 kN Bruchlast eines Kletterseils in Tonnen',
      inputValues: [{ label: 'Kraft', value: '10 kN' }],
      steps: ['Masse = 10.000 N / 9,81 m/s² = 1.019,4 kg ≈ 1,02 Tonnen'],
      result: '1,02 Tonnen Belastbarkeit',
    },
    faqs: [
      { question: 'Warum wird im Bauwesen mit kN statt mit kg gerechnet?', answer: 'Weil Bauwerke wie Decken und Brücken Kräften (Gewichtskräfte, Windlast, Erdbeben) widerstehen müssen. 1 kN entspricht in der Praxis der Gewichtskraft von ca. 100 kg.' },
      { question: 'Was war das Kilopond?', answer: 'Das Kilopond (kp) war die historische Krafteinheit vor Einführung des SI-Systems: 1 kp war definiert als die Gewichtskraft von 1 kg Masse auf Meereshöhe.' },
    ],
    relatedSlugs: ['druck-umrechner', 'drehmoment-umrechner', 'baugrund-tragfaehigkeit-rechner'],
  },

  {
    id: 'kraftstoffverbrauch-umrechner',
    slug: 'kraftstoffverbrauch-umrechner',
    name: 'Spritverbrauch Umrechner (l/100km in MPG US & UK)',
    shortName: 'Verbrauch Umrechner',
    category: 'einheiten',
    subcategory: 'Fahrzeuge & Mobilität',
    metaTitle: 'Spritverbrauch Umrechner – l/100km in MPG (US & UK) umrechnen',
    metaDescription: 'Rechnen Sie den Kraftstoffverbrauch um zwischen Litern pro 100 Kilometer (l/100km), US Miles per Gallon (MPG), UK Imperial MPG und km pro Liter.',
    h1: 'Spritverbrauch Umrechner – l/100km in MPG umrechnen',
    shortDescription: 'Konvertiert l/100km in US- und UK-Miles-per-Gallon (MPG).',
    searchKeywords: ['spritverbrauch umrechner l 100km in mpg', 'miles per gallon in liter pro 100 km', 'us mpg in liter umrechnen', 'kraftstoffverbrauch rechner umrechnung'],
    inputs: [
      { id: 'inputValue', label: 'Verbrauchswert', type: 'number', defaultValue: 6.5, min: 0.1, max: 100, step: 0.1, unit: 'Verbrauch' },
      {
        id: 'inputUnit',
        label: 'Ausgangseinheit',
        type: 'select',
        defaultValue: 'l100km',
        options: [
          { value: 'l100km', label: 'Liter pro 100 km (l/100km – Europa)' },
          { value: 'usmpg', label: 'US Miles per Gallon (MPG US)' },
          { value: 'ukmpg', label: 'UK Miles per Gallon (MPG UK Imperial)' },
          { value: 'kml', label: 'Kilometer pro Liter (km/l)' },
        ],
      },
    ],
    calculateCode: `const val = Number(inputs.inputValue) || 0;
const unit = inputs.inputUnit;

// Basis l/100km:
let l100km = val;
if (unit === 'usmpg') l100km = 235.214583 / val;
else if (unit === 'ukmpg') l100km = 282.4809363 / val;
else if (unit === 'kml') l100km = 100 / val;

const usmpg = 235.214583 / l100km;
const ukmpg = 282.4809363 / l100km;
const kml = 100 / l100km;

return {
  primary: { id: 'l100km', label: 'Verbrauch in Liter pro 100 km', value: l100km, formattedValue: formatNumber(l100km, 2) + ' l/100km', highlight: true },
  secondary: [
    { id: 'usmpg', label: 'US Miles per Gallon (MPG)', value: usmpg, formattedValue: formatNumber(usmpg, 1) + ' MPG (US)' },
    { id: 'ukmpg', label: 'UK Miles per Gallon (MPG)', value: ukmpg, formattedValue: formatNumber(ukmpg, 1) + ' MPG (UK)' },
    { id: 'kml', label: 'Reichweite pro Liter', value: kml, formattedValue: formatNumber(kml, 2) + ' km/l' },
  ],
  summaryText: val + ' ' + unit.toUpperCase() + ' entsprechen genau ' + formatNumber(l100km, 2) + ' l/100km (' + formatNumber(usmpg, 1) + ' US MPG bzw. ' + formatNumber(kml, 2) + ' km pro Liter).',
};`,
    formula: 'US MPG = 235,215 / (l/100km); l/100km = 235,215 / US MPG; km/l = 100 / (l/100km)',
    formulaExplanation: 'Während in Kontinentaleuropa der Verbrauch pro feste Distanz (Liter auf 100 km) gemessen wird, misst man im angloamerikanischen Raum die erreichte Distanz pro Volumeneinheit (Meilen pro Gallone).',
    workedExample: {
      title: 'Beispiel: Ein US-Auto mit 30 MPG in l/100km umrechnen',
      inputValues: [{ label: 'Verbrauch', value: '30 US MPG' }],
      steps: ['l/100km = 235,215 / 30 = 7,84 l/100km'],
      result: '7,84 l/100km',
    },
    faqs: [
      { question: 'Bedeutet ein höherer MPG-Wert mehr oder weniger Verbrauch?', answer: 'Umgekehrt als in Europa: Ein HÖHERER MPG-Wert bedeutet besseren Wirkungsgrad, da Sie mit einer Gallone weiter fahren können! Bei l/100km ist ein niedriger Wert besser.' },
      { question: 'Warum unterscheidet sich US MPG von UK MPG?', answer: 'Weil die britische Imperial Gallon (4,55 l) größer ist als die US Liquid Gallon (3,79 l). Daher hat dasselbe Auto in Großbritannien eine um ca. 20 % höhere MPG-Zahl.' },
    ],
    relatedSlugs: ['spritrechner', 'geschwindigkeit-umrechner', 'volumen-umrechner'],
  },

  {
    id: 'roemische-zahlen-umrechner',
    slug: 'roemische-zahlen-umrechner',
    name: 'Römische Zahlen Umrechner (Dezimal in Römisch & Römisch in Dezimal)',
    shortName: 'Römische Zahlen',
    category: 'einheiten',
    subcategory: 'Zahlensysteme',
    metaTitle: 'Römische Zahlen Umrechner – Arabische Zahlen 1–3999 in Römisch',
    metaDescription: 'Konvertieren Sie arabische Dezimalzahlen (1 bis 3999) in römische Ziffern (I, V, X, L, C, D, M) mit Subtraktionsregel und detaillierter Zusammensetzung.',
    h1: 'Römische Zahlen Umrechner – Arabisch in Römisch sofort umrechnen',
    shortDescription: 'Wandelt Dezimalzahlen in römische Ziffern um.',
    searchKeywords: ['roemische zahlen umrechner dezimal', 'arabische zahlen in roemische ziffern umwandeln', 'roemische zahlen tabelle m d c l x v i', 'jahr 2026 roemische zahlen mmxxvi'],
    inputs: [
      { id: 'decimalNumber', label: 'Dezimalzahl (1 bis 3.999)', type: 'number', defaultValue: 2026, min: 1, max: 3999, step: 1, unit: '' },
    ],
    calculateCode: `const num = Math.min(3999, Math.max(1, Math.round(Number(inputs.decimalNumber) || 1)));

const lookup = [
  { val: 1000, rom: 'M' },
  { val: 900, rom: 'CM' },
  { val: 500, rom: 'D' },
  { val: 400, rom: 'CD' },
  { val: 100, rom: 'C' },
  { val: 90, rom: 'XC' },
  { val: 50, rom: 'L' },
  { val: 40, rom: 'XL' },
  { val: 10, rom: 'X' },
  { val: 9, rom: 'IX' },
  { val: 5, rom: 'V' },
  { val: 4, rom: 'IV' },
  { val: 1, rom: 'I' },
];

let roman = '';
let n = num;
const breakdown = [];

for (const item of lookup) {
  while (n >= item.val) {
    roman += item.rom;
    breakdown.push(item.rom + ' (' + item.val + ')');
    n -= item.val;
  }
}

return {
  primary: { id: 'roman', label: 'Römische Ziffern', value: num, formattedValue: roman, highlight: true },
  secondary: [
    { id: 'breakdown', label: 'Zusammensetzung', value: 0, formattedValue: breakdown.join(' + ') },
    { id: 'digitsCount', label: 'Anzahl Schriftzeichen', value: roman.length, formattedValue: roman.length + ' Zeichen' },
  ],
  summaryText: 'Die arabische Zahl ' + num + ' lautet in römischen Ziffern: ' + roman + '.',
};`,
    formula: 'M = 1000, D = 500, C = 100, L = 50, X = 10, V = 5, I = 1 (mit Subtraktionsregel IV=4, IX=9, XL=40, XC=90, CD=400, CM=900)',
    formulaExplanation: 'Römische Zahlen sind ein additives Zahlsystem mit Subtraktionsregel: Steht ein kleineres Zeichen vor einem größeren (z. B. IX), wird es abgezogen (10 - 1 = 9).',
    workedExample: {
      title: 'Beispiel: Das Jahr 2026 in römischen Ziffern',
      inputValues: [{ label: 'Zahl', value: '2026' }],
      steps: ['2000 = MM', '20 = XX', '6 = VI', 'Zusammen = MMXXVI'],
      result: 'MMXXVI',
    },
    faqs: [
      { question: 'Gibt es eine römische Ziffer für die Null?', answer: 'Nein, das römische Zahlensystem kennt keine Ziffer für Null. Im Mittelalter wurde gelegentlich das lateinische Wort "nulla" (nichts) verwendet.' },
      { question: 'Warum gibt es keine Zahlen über 3.999 im Standard-System?', answer: 'Da nach den klassischen Regeln ein Buchstabe maximal dreimal hintereinander stehen darf (MMM = 3000), endet das Standardsystem bei MMMCMXCIX (3.999).' },
    ],
    relatedSlugs: ['binaer-hex-dezimal-umrechner', 'zeit-umrechner', 'daten-speicher-umrechner'],
  },

  {
    id: 'binaer-hex-dezimal-umrechner',
    slug: 'binaer-hex-dezimal-umrechner',
    name: 'Binär & Hexadezimal Umrechner (Dezimal, Dual & Hex-Code)',
    shortName: 'Binär & Hex Umrechner',
    category: 'einheiten',
    subcategory: 'Zahlensysteme',
    metaTitle: 'Binär & Hexadezimal Umrechner – Dezimal, Binär (Dual) & Hex',
    metaDescription: 'Rechnen Sie Zahlen um zwischen Dezimalsystem (Basis 10), Binärsystem / Dualsystem (Basis 2), Hexadezimalsystem (Basis 16) und Oktalsystem (Basis 8).',
    h1: 'Binär & Hexadezimal Umrechner – Zahlensysteme umrechnen',
    shortDescription: 'Konvertiert Zahlen zwischen Dezimal, Binär, Hexadezimal und Oktal.',
    searchKeywords: ['binaer umrechner dualsystem dezimal in binaer', 'hexadezimal in dezimal umrechnen hex rechner', 'binaer hex oktal umrechner basis 2 8 16', 'dezimal in dualzahl umwandeln'],
    inputs: [
      { id: 'decimalNumber', label: 'Ganze positive Zahl (Dezimal)', type: 'number', defaultValue: 255, min: 0, max: 2147483647, step: 1, unit: '' },
    ],
    calculateCode: `const num = Math.max(0, Math.round(Number(inputs.decimalNumber) || 0));

const binary = num.toString(2);
const hex = num.toString(16).toUpperCase();
const octal = num.toString(8);

// Binär mit 8-Bit-Gruppierung formatieren:
const paddedBin = binary.padStart(Math.ceil(binary.length / 8) * 8, '0');
const groupedBin = paddedBin.match(/.{1,4}/g)?.join(' ') || binary;

return {
  primary: { id: 'hex', label: 'Hexadezimal (Basis 16)', value: num, formattedValue: '0x' + hex, highlight: true },
  secondary: [
    { id: 'binary', label: 'Binär / Dual (Basis 2)', value: num, formattedValue: groupedBin + ' (binär)' },
    { id: 'octal', label: 'Oktal (Basis 8)', value: num, formattedValue: '0o' + octal },
    { id: 'bitsCount', label: 'Benötigte Bits (Stellen)', value: binary.length, formattedValue: binary.length + ' Bits' },
  ],
  summaryText: 'Die Zahl ' + num + ' lautet im Binärsystem ' + binary + ' (Dual), im Hexadezimalsystem 0x' + hex + ' und im Oktalsystem 0o' + octal + '.',
};`,
    formula: 'Dezimal = Σ (Ziffer × Basis^Position); Hexadezimal: 0-9, A(10), B(11), C(12), D(13), E(14), F(15)',
    formulaExplanation: 'Jede Hexadezimalstelle entspricht exakt 4 Binärstellen (Nibble/Halbbyte), weshalb Hexadezimalzahlen in der Informatik die bevorzugte kompakte Schreibweise für Binärdaten sind.',
    workedExample: {
      title: 'Beispiel: Die Zahl 255 (maximaler 8-Bit-Wert)',
      inputValues: [{ label: 'Dezimal', value: '255' }],
      steps: ['Binär = 1111 1111 (8 Einsen)', 'Hexadezimal = FF (15 × 16¹ + 15 × 16⁰ = 240 + 15 = 255)'],
      result: 'Binär: 11111111, Hex: 0xFF',
    },
    faqs: [
      { question: 'Warum nutzen Computer das Binärsystem?', answer: 'Weil elektronische Transistoren zuverlässig zwei physikalische Zustände darstellen können: Strom an (1) oder Strom aus (0).' },
      { question: 'Wo begegnen einem Hexadezimalzahlen im Alltag?', answer: 'Bei HTML/CSS-Farbcodes (#FF5733), MAC-Adressen von Netzwerkadaptern und IPv6-Internetadressen.' },
    ],
    relatedSlugs: ['daten-speicher-umrechner', 'roemische-zahlen-umrechner', 'datenrate-bandbreite-umrechner'],
  },

  {
    id: 'zoll-in-cm-rechner',
    slug: 'zoll-in-cm-rechner',
    name: 'Zoll in cm Rechner (Inch & Diagonale für TV & Smartphones)',
    shortName: 'Zoll in cm Rechner',
    category: 'einheiten',
    subcategory: 'Geometrische Maße',
    metaTitle: 'Zoll in cm Rechner – Inch in Zentimeter & TV-Bildschirmdiagonale',
    metaDescription: 'Rechnen Sie Zoll (Inch) in Zentimeter und Millimeter um. Inklusive Bildschirm-Rechner für TVs und Handys: Breite und Höhe im 16:9 Format.',
    h1: 'Zoll in cm Rechner – Inch in cm & Bildschirmmaße berechnen',
    shortDescription: 'Konvertiert Zoll (Inch) in cm und ermittelt Maße von 16:9 Displays.',
    searchKeywords: ['zoll in cm rechner inch umrechnen', 'fernseher zoll in cm bildschirmdiagonale', 'display breite hoehe 16 zu 9 zoll', '1 zoll wieviel cm 2 54'],
    inputs: [
      { id: 'inches', label: 'Zoll / Inch (\")', type: 'number', defaultValue: 55, min: 0.1, max: 500, step: 0.5, unit: 'Zoll' },
    ],
    calculateCode: `const inch = Number(inputs.inches) || 0;
// 1 Zoll = exakt 2,54 cm
const cm = inch * 2.54;
const mm = cm * 10;

// Bei 16:9 Display:
// Diagonale d = sqrt(w^2 + h^2) = sqrt((16x)^2 + (9x)^2) = sqrt(256 + 81)x = sqrt(337)x ≈ 18.35756x
const diagCm = cm;
const x = diagCm / Math.sqrt(337);
const width16_9 = 16 * x;
const height16_9 = 9 * x;
const displayAreaCm2 = width16_9 * height16_9;

return {
  primary: { id: 'cm', label: 'Länge in Zentimetern (cm)', value: cm, formattedValue: formatNumber(cm, 2) + ' cm', highlight: true },
  secondary: [
    { id: 'width16_9', label: 'Bildschirmbreite bei 16:9', value: width16_9, formattedValue: formatNumber(width16_9, 1) + ' cm' },
    { id: 'height16_9', label: 'Bildschirmhöhe bei 16:9', value: height16_9, formattedValue: formatNumber(height16_9, 1) + ' cm' },
    { id: 'area', label: 'Displayfläche ca.', value: displayAreaCm2 / 10000, formattedValue: formatNumber(displayAreaCm2 / 10000, 2) + ' m² (' + formatNumber(displayAreaCm2, 0) + ' cm²)' },
    { id: 'mm', label: 'Millimeter (mm)', value: mm, formattedValue: formatNumber(mm, 1) + ' mm' },
  ],
  summaryText: inch + ' Zoll entsprechen exakt ' + formatNumber(cm, 2) + ' cm. Ein ' + inch + '\"-Fernseher (16:9) ist ca. ' + formatNumber(width16_9, 0) + ' cm breit und ' + formatNumber(height16_9, 0) + ' cm hoch.',
};`,
    formula: '1 Zoll (Inch) = exakt 2,54 cm = 25,4 mm; cm = Zoll × 2,54',
    formulaExplanation: 'Seit 1959 ist das internationale Zoll per Definition an das metrische System gekoppelt: Genau 1 Inch = 25,4 mm.',
    workedExample: {
      title: 'Beispiel: 55-Zoll-Fernseher Bildschirmmaße',
      inputValues: [{ label: 'Diagonale', value: '55 Zoll' }],
      steps: ['Diagonale in cm = 55 × 2,54 = 139,7 cm', 'Breite (16:9) = 139,7 × 0,8716 = 121,8 cm', 'Höhe (16:9) = 139,7 × 0,4903 = 68,5 cm'],
      result: '139,7 cm Diagonale (122 × 69 cm)',
    },
    faqs: [
      { question: 'Welcher Sitzabstand empfiehlt sich für einen 55- oder 65-Zoll-4K-Fernseher?', answer: 'Bei 4K/UHD-Auflösung empfiehlt sich ein Sitzabstand vom ca. 1,5-fachen der Bildschirmdiagonale: Für 55 Zoll (140 cm) ca. 2,1 Meter, für 65 Zoll (165 cm) ca. 2,5 Meter.' },
      { question: 'Gilt die Zoll-Formel auch für Rohre und Reifen?', answer: 'Ja, das Zollmaß (25,4 mm) gilt für alle technischen Anwendungen, z. B. 19-Zoll-Felgen, 1/2-Zoll-Wasserrohre oder 28-Zoll-Fahrradreifen.' },
    ],
    relatedSlugs: ['laengen-umrechner', 'rechteckrechner', 'daten-speicher-umrechner'],
  },

  {
    id: 'zeit-umrechner',
    slug: 'zeit-umrechner',
    name: 'Zeit Umrechner (Sekunden, Minuten, Stunden, Tage & Wochen)',
    shortName: 'Zeit Umrechner',
    category: 'einheiten',
    subcategory: 'Alltag & Kalender',
    metaTitle: 'Zeit Umrechner – Sekunden, Minuten, Stunden, Tage & Wochen',
    metaDescription: 'Rechnen Sie Zeiteinheiten präzise um: Sekunden, Minuten, Stunden, Tage, Wochen und Jahre inklusive Dezimalstunden in Stunden und Minuten.',
    h1: 'Zeit Umrechner – Sekunden, Stunden, Tage & Wochen umrechnen',
    shortDescription: 'Konvertiert Zeiteinheiten und Dezimalstunden.',
    searchKeywords: ['zeit umrechner sekunden minuten stunden tage', 'stunden in sekunden umrechnen 3600', 'dezimalstunden in stunden und minuten', 'tage in stunden umrechnen rechner'],
    inputs: [
      { id: 'inputValue', label: 'Zeitwert', type: 'number', defaultValue: 36, min: 0, max: 1000000000, step: 0.5, unit: 'Zeit' },
      {
        id: 'inputUnit',
        label: 'Ausgangseinheit',
        type: 'select',
        defaultValue: 'hours',
        options: [
          { value: 'hours', label: 'Stunden (h)' },
          { value: 'minutes', label: 'Minuten (min)' },
          { value: 'seconds', label: 'Sekunden (s)' },
          { value: 'days', label: 'Tage (d = 24 h)' },
          { value: 'weeks', label: 'Wochen (w = 7 Tage)' },
        ],
      },
    ],
    calculateCode: `const val = Number(inputs.inputValue) || 0;
const unit = inputs.inputUnit;

// Basis Sekunden (s):
let s = val * 3600;
if (unit === 'seconds') s = val;
else if (unit === 'minutes') s = val * 60;
else if (unit === 'days') s = val * 86400;
else if (unit === 'weeks') s = val * 604800;

const minutes = s / 60;
const hours = s / 3600;
const days = s / 86400;
const weeks = s / 604800;

// Zusammengesetzt Tage, Stunden, Minuten:
const wholeDays = Math.floor(days);
const remHours = Math.floor(hours % 24);
const remMins = Math.floor(minutes % 60);
const remSecs = Math.round(s % 60);

const humanStr = wholeDays + ' d, ' + remHours + ' h, ' + remMins + ' min, ' + remSecs + ' s';

return {
  primary: { id: 'hours', label: 'Stunden (dezimal)', value: hours, formattedValue: formatNumber(hours, 2) + ' h', highlight: true },
  secondary: [
    { id: 'human', label: 'Zusammengesetzte Zeit', value: 0, formattedValue: humanStr },
    { id: 'minutes', label: 'Minuten (min)', value: minutes, formattedValue: formatNumber(minutes, 1) + ' min' },
    { id: 'seconds', label: 'Sekunden (s)', value: s, formattedValue: formatNumber(s, 0) + ' s' },
    { id: 'days', label: 'Tage (d)', value: days, formattedValue: formatNumber(days, 3) + ' Tage' },
  ],
  summaryText: val + ' ' + unit.toUpperCase() + ' entsprechen genau ' + formatNumber(hours, 2) + ' Stunden, ' + formatNumber(minutes, 0) + ' Minuten bzw. ' + formatNumber(s, 0) + ' Sekunden (' + humanStr + ').',
};`,
    formula: '1 min = 60 s; 1 h = 3.600 s; 1 d = 24 h = 86.400 s; 1 w = 7 d = 168 h',
    formulaExplanation: 'Unser Zeitsystem basiert historisch auf dem sexagesimalen Zahlensystem (Basis 60) der alten Babylonier für Stunden, Minuten und Sekunden.',
    workedExample: {
      title: 'Beispiel: 7,5 Arbeitsstunden in Minuten und Sekunden',
      inputValues: [{ label: 'Stunden', value: '7,5 h' }],
      steps: ['Minuten = 7,5 × 60 = 450 Minuten', 'Sekunden = 450 × 60 = 27.000 Sekunden'],
      result: '450 Minuten = 27.000 Sekunden (7 Std. 30 Min.)',
    },
    faqs: [
      { question: 'Wie rechnet man 8,75 Stunden in Stunden und Minuten um?', answer: 'Die 8 bleibt erhalten. Die Dezimalstellen multipliziert man mit 60: 0,75 × 60 = 45 Minuten. Ergebnis: 8 Stunden und 45 Minuten.' },
      { question: 'Wie viele Sekunden hat ein ganzes Jahr?', answer: 'Ein normales Jahr mit 365 Tagen hat 31.536.000 Sekunden (365 × 86.400). Ein Schaltjahr hat 31.622.400 Sekunden.' },
    ],
    relatedSlugs: ['arbeitszeitrechner', 'urlaubstage-rechner', 'datenrate-bandbreite-umrechner'],
  },
];

console.log('Building einheiten with', calcs.length, 'calculators');
fs.writeFileSync(path.join(__dirname, 'calcs-einheiten.json'), JSON.stringify(calcs, null, 2), 'utf8');
console.log('Saved calcs-einheiten.json');
