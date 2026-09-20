const fs = require('fs');
const path = require('path');

const calcs = [
  {
    id: 'dreieck-flaeche-rechner',
    slug: 'dreieck-flaeche-rechner',
    name: 'Dreieck Rechner (Fläche, Umfang & Heron-Formel)',
    shortName: 'Dreieck Rechner',
    category: 'geometrie',
    subcategory: 'Ebene Figuren',
    metaTitle: 'Dreieck Rechner – Fläche berechnen nach Grundseite/Höhe & 3 Seiten',
    metaDescription: 'Berechnen Sie die Dreiecksfläche über Grundseite und Höhe (A = 1/2 g h) oder über alle 3 Seiten nach dem Satz des Heron inklusive Umfang.',
    h1: 'Dreieck Rechner – Flächeninhalt & Umfang für jedes Dreieck',
    shortDescription: 'Berechnet Flächeninhalt und Umfang für beliebige Dreiecke.',
    searchKeywords: ['dreieck flaeche rechner', 'heron formel rechner 3 seiten', 'dreiecksflaeche berechnen grundseite hoehe', 'dreieck umfang formel'],
    inputs: [
      {
        id: 'calcMethod',
        label: 'Berechnungsmethode',
        type: 'select',
        defaultValue: 'baseHeight',
        options: [
          { value: 'baseHeight', label: 'Grundseite (g) & Höhe (h)' },
          { value: 'threeSides', label: '3 Seiten (a, b, c nach Heron)' },
        ],
      },
      { id: 'sideA', label: 'Grundseite g / Seite a', type: 'number', defaultValue: 10, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'sideB_or_h', label: 'Höhe h / Seite b', type: 'number', defaultValue: 6, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'sideC', label: 'Seite c (nur bei 3 Seiten)', type: 'number', defaultValue: 8, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
    ],
    calculateCode: `const method = inputs.calcMethod;
const a = Number(inputs.sideA) || 0;
const b = Number(inputs.sideB_or_h) || 0;
const c = Number(inputs.sideC) || 0;

let area = 0;
let perimeter = 0;

if (method === 'baseHeight') {
  // A = 0.5 * g * h
  area = 0.5 * a * b;
  perimeter = a + (2 * Math.sqrt(Math.pow(a / 2, 2) + Math.pow(b, 2))); // Näherung gleichschenklig
} else {
  // Satz des Heron
  const s = (a + b + c) / 2;
  const radikand = s * (s - a) * (s - b) * (s - c);
  area = radikand > 0 ? Math.sqrt(radikand) : 0;
  perimeter = a + b + c;
}

return {
  primary: { id: 'area', label: 'Flächeninhalt des Dreiecks', value: area, formattedValue: formatNumber(area, 2) + ' cm²', highlight: true },
  secondary: [
    { id: 'perimeter', label: method === 'threeSides' ? 'Umfang (a + b + c)' : 'Umfang (gleichschenklig genähert)', value: perimeter, formattedValue: formatNumber(perimeter, 2) + ' cm' },
    { id: 'methodUsed', label: 'Verwendete Formel', value: 0, formattedValue: method === 'baseHeight' ? 'A = 1/2 · g · h' : 'Heron-Formel √(s(s-a)(s-b)(s-c))' },
  ],
  summaryText: 'Der Flächeninhalt des Dreiecks beträgt ' + formatNumber(area, 2) + ' cm² bei einem Umfang von ' + formatNumber(perimeter, 2) + ' cm.',
};`,
    formula: 'A = 1/2 × g × h bzw. A = √(s × (s - a) × (s - b) × (s - c)) mit s = (a + b + c) / 2',
    formulaExplanation: 'Der Satz des Heron ermöglicht die exakte Flächenberechnung eines Dreiecks allein aus der Kenntnis seiner drei Seitenlängen, ohne vorherige Höhenberechnung.',
    workedExample: {
      title: 'Beispiel: Dreieck mit a = 10 cm, b = 6 cm, c = 8 cm (rechtwinklig)',
      inputValues: [{ label: 'a', value: '10 cm' }, { label: 'b', value: '6 cm' }, { label: 'c', value: '8 cm' }],
      steps: ['s = (10 + 6 + 8) / 2 = 12 cm', 'A = √(12 × (12-10) × (12-6) × (12-8)) = √(12 × 2 × 6 × 4) = √576 = 24 cm²'],
      result: '24 cm² Fläche',
    },
    faqs: [
      { question: 'Wann gilt die Dreiecksungleichung?', answer: 'Drei Strecken bilden nur dann ein Dreieck, wenn die Summe zweier beliebiger Seiten stets strikt größer ist als die dritte Seite (a + b > c).' },
      { question: 'Wie berechnet man die Höhe im gleichseitigen Dreieck?', answer: 'Im gleichseitigen Dreieck mit Seitenlänge a gilt: h = (a / 2) × √3 ≈ 0,866 × a.' },
    ],
    relatedSlugs: ['kreisrechner', 'rechteckrechner', 'satz-des-pythagoras-rechner'],
  },

  {
    id: 'kreis-umfang-rechner',
    slug: 'kreis-umfang-rechner',
    name: 'Kreisumfang Rechner (Umfang, Radius, Durchmesser & Fläche)',
    shortName: 'Kreisumfang Rechner',
    category: 'geometrie',
    subcategory: 'Ebene Figuren',
    metaTitle: 'Kreisumfang Rechner – Umfang U = 2πr, Durchmesser d & Kreisfläche',
    metaDescription: 'Berechnen Sie Kreisumfang, Kreisfläche, Radius und Durchmesser mit der Kreiszahl Pi (π). Sofortige Umrechnung bei Eingabe einer beliebigen Größe.',
    h1: 'Kreisumfang Rechner – Umfang U = 2 · π · r & Durchmesser ermitteln',
    shortDescription: 'Berechnet Kreisumfang, Durchmesser und Fläche aus dem Radius.',
    searchKeywords: ['kreisumfang rechner formel', 'umfang kreis durchmesser pi', 'kreisumfang u 2 pi r berechnen', 'kreis flaeche umfang umrechnen'],
    inputs: [
      {
        id: 'inputType',
        label: 'Eingegebene Größe',
        type: 'select',
        defaultValue: 'radius',
        options: [
          { value: 'radius', label: 'Radius (r)' },
          { value: 'diameter', label: 'Durchmesser (d)' },
          { value: 'circumference', label: 'Umfang (U)' },
        ],
      },
      { id: 'inputValue', label: 'Wert der gewählten Größe', type: 'number', defaultValue: 10, min: 0.01, max: 10000, step: 0.1, unit: 'cm' },
    ],
    calculateCode: `const type = inputs.inputType;
const val = Number(inputs.inputValue) || 0;

let r = val;
if (type === 'diameter') r = val / 2;
else if (type === 'circumference') r = val / (2 * Math.PI);

const d = 2 * r;
const u = 2 * Math.PI * r;
const a = Math.PI * Math.pow(r, 2);

return {
  primary: { id: 'circumference', label: 'Kreisumfang (U)', value: u, formattedValue: formatNumber(u, 2) + ' cm', highlight: true },
  secondary: [
    { id: 'area', label: 'Kreisfläche (A)', value: a, formattedValue: formatNumber(a, 2) + ' cm²' },
    { id: 'diameter', label: 'Durchmesser (d)', value: d, formattedValue: formatNumber(d, 2) + ' cm' },
    { id: 'radius', label: 'Radius (r)', value: r, formattedValue: formatNumber(r, 2) + ' cm' },
  ],
  summaryText: 'Ein Kreis mit Radius ' + formatNumber(r, 2) + ' cm hat einen Umfang von ' + formatNumber(u, 2) + ' cm und eine Kreisfläche von ' + formatNumber(a, 2) + ' cm².',
};`,
    formula: 'U = 2 × π × r = π × d; A = π × r²',
    formulaExplanation: 'Die Kreiszahl Pi (π ≈ 3,14159) beschreibt das feste Verhältnis zwischen dem Umfang eines jeden Kreises und seinem Durchmesser.',
    workedExample: {
      title: 'Beispiel: Kreis mit Durchmesser d = 10 cm',
      inputValues: [{ label: 'Durchmesser', value: '10 cm' }],
      steps: ['Radius r = 10 / 2 = 5 cm', 'Umfang U = π × 10 cm ≈ 31,42 cm', 'Fläche A = π × 5² ≈ 78,54 cm²'],
      result: 'U = 31,42 cm, A = 78,54 cm²',
    },
    faqs: [
      { question: 'Wie berechnet man den Durchmesser aus dem Umfang?', answer: 'Teilen Sie den Umfang einfach durch Pi: d = U / π. Bei einem Umfang von 31,4 cm ist der Durchmesser genau 10 cm.' },
      { question: 'Was ist der Unterschied zwischen Radius und Durchmesser?', answer: 'Der Radius reicht vom Mittelpunkt bis zum Kreisrand. Der Durchmesser ist die längste Sehne durch den Mittelpunkt und genau doppelt so lang wie der Radius (d = 2r).' },
    ],
    relatedSlugs: ['kreisrechner', 'kugel-oberflaeche-rechner', 'kreissegment-rechner'],
  },

  {
    id: 'kegel-volumen-rechner',
    slug: 'kegel-volumen-rechner',
    name: 'Kegel Rechner (Volumen, Mantelfläche & Oberfläche)',
    shortName: 'Kegel Rechner',
    category: 'geometrie',
    subcategory: 'Körper',
    metaTitle: 'Kegel Rechner – Volumen V = 1/3πr²h, Mantelfläche & Oberfläche berechnen',
    metaDescription: 'Berechnen Sie das Volumen eines Kreiskegels (V = 1/3 · π · r² · h), die Mantellinie s, die Mantelfläche M und die Gesamtoberfläche O nach Radius und Höhe.',
    h1: 'Kegel Rechner – Volumen, Mantellinie & Oberfläche ermitteln',
    shortDescription: 'Berechnet Volumen, Mantelfläche und Gesamtoberfläche eines Kegels.',
    searchKeywords: ['kegel rechner volumen formel', 'kegel mantelflaeche oberflaeche berechnen', 'mantellinie s kegel pythagoras', 'kreiskegel volumen 1 drittel pi r2 h'],
    inputs: [
      { id: 'radius', label: 'Grundkreis-Radius (r)', type: 'number', defaultValue: 6, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'height', label: 'Kegelhöhe (h)', type: 'number', defaultValue: 8, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
    ],
    calculateCode: `const r = Number(inputs.radius) || 0;
const h = Number(inputs.height) || 0;

// Mantellinie s = sqrt(r^2 + h^2)
const s = Math.sqrt(Math.pow(r, 2) + Math.pow(h, 2));
// Volumen V = (1/3) * pi * r^2 * h
const v = (1 / 3) * Math.PI * Math.pow(r, 2) * h;
// Mantelfläche M = pi * r * s
const m = Math.PI * r * s;
// Grundfläche G = pi * r^2
const g = Math.PI * Math.pow(r, 2);
// Gesamtoberfläche O = G + M
const o = g + m;

return {
  primary: { id: 'volume', label: 'Kegelvolumen (V)', value: v, formattedValue: formatNumber(v, 2) + ' cm³', highlight: true },
  secondary: [
    { id: 'surface', label: 'Gesamtoberfläche (O)', value: o, formattedValue: formatNumber(o, 2) + ' cm²' },
    { id: 'mantle', label: 'Mantelfläche (M)', value: m, formattedValue: formatNumber(m, 2) + ' cm²' },
    { id: 'slantHeight', label: 'Mantellinie (s)', value: s, formattedValue: formatNumber(s, 2) + ' cm' },
  ],
  summaryText: 'Der Kegel hat ein Volumen von ' + formatNumber(v, 2) + ' cm³ (' + formatNumber(v / 1000, 3) + ' Liter) und eine Gesamtoberfläche von ' + formatNumber(o, 2) + ' cm² (Mantellinie s = ' + formatNumber(s, 2) + ' cm).',
};`,
    formula: 'V = 1/3 × π × r² × h; s = √(r² + h²); M = π × r × s; O = π × r × (r + s)',
    formulaExplanation: 'Ein Kegel hat exakt ein Drittel des Volumens eines Zylinders mit gleichem Radius und gleicher Höhe.',
    workedExample: {
      title: 'Beispiel: Kegel mit r = 6 cm und h = 8 cm',
      inputValues: [{ label: 'Radius', value: '6 cm' }, { label: 'Höhe', value: '8 cm' }],
      steps: ['s = √(6² + 8²) = √(36 + 64) = √100 = 10 cm', 'V = 1/3 × π × 36 × 8 = 96 × π ≈ 301,59 cm³', 'M = π × 6 × 10 = 60 × π ≈ 188,50 cm²', 'O = π × 6 × (6 + 10) = 96 × π ≈ 301,59 cm²'],
      result: 'V = 301,59 cm³, O = 301,59 cm²',
    },
    faqs: [
      { question: 'Wie verhält sich das Kegelvolumen zum Zylindervolumen?', answer: 'Das Kegelvolumen ist genau 1/3 des Zylindervolumens mit gleicher Grundfläche und Höhe. Drei gefüllte Kegel passen exakt in einen Zylinder.' },
      { question: 'Was ist ein schiefer Kegel?', answer: 'Bei einem schiefen Kegel steht die Spitze nicht senkrecht über dem Mittelpunkt des Grundkreises. Die Volumenformel V = 1/3 · G · h (nach dem Prinzip von Cavalieri) gilt jedoch unverändert!' },
    ],
    relatedSlugs: ['zylinderrechner', 'kugel-oberflaeche-rechner', 'pyramide-volumen-rechner'],
  },

  {
    id: 'hohlzylinder-rohr-rechner',
    slug: 'hohlzylinder-rohr-rechner',
    name: 'Hohlzylinder & Rohr Rechner (Volumen, Wandstärke & Materialgewicht)',
    shortName: 'Rohr & Hohlzylinder',
    category: 'geometrie',
    subcategory: 'Körper',
    metaTitle: 'Hohlzylinder Rechner – Rohr-Volumen, Wandstärke & Gewicht in kg',
    metaDescription: 'Berechnen Sie das Materialvolumen, Innen-/Außenvolumen und Gewicht eines Hohlzylinders oder Metallrohrs nach Außendurchmesser, Wandstärke, Länge und Materialdichte.',
    h1: 'Hohlzylinder Rechner – Rohrvolumen & Gewicht berechnen',
    shortDescription: 'Ermittelt Materialvolumen und Gewicht von Rohren und zylindrischen Hülsen.',
    searchKeywords: ['hohlzylinder rechner volumen formel', 'rohr gewicht berechnen stahl kupfer', 'wandstaerke hohlzylinder pi r2', 'rohrvolumen berechnen'],
    inputs: [
      { id: 'outerDiameterMm', label: 'Außendurchmesser (D)', type: 'number', defaultValue: 60, min: 1, max: 2000, step: 1, unit: 'mm' },
      { id: 'wallThicknessMm', label: 'Wandstärke (s)', type: 'number', defaultValue: 5, min: 0.1, max: 500, step: 0.5, unit: 'mm' },
      { id: 'lengthM', label: 'Rohrlänge (L)', type: 'number', defaultValue: 2.0, min: 0.01, max: 50, step: 0.1, unit: 'm' },
      {
        id: 'material',
        label: 'Material & Dichte',
        type: 'select',
        defaultValue: 'steel',
        options: [
          { value: 'steel', label: 'Stahl / Eisen (ca. 7,85 kg/dm³)' },
          { value: 'stainless', label: 'Edelstahl V2A / V4A (ca. 7,95 kg/dm³)' },
          { value: 'aluminum', label: 'Aluminium (ca. 2,70 kg/dm³)' },
          { value: 'copper', label: 'Kupfer (ca. 8,96 kg/dm³)' },
          { value: 'pvc', label: 'PVC Kunststoff (ca. 1,40 kg/dm³)' },
        ],
      },
    ],
    calculateCode: `const D_mm = Number(inputs.outerDiameterMm) || 0;
const s_mm = Number(inputs.wallThicknessMm) || 0;
const l_m = Number(inputs.lengthM) || 0;

const d_inner_mm = Math.max(0, D_mm - (2 * s_mm));
const R_cm = (D_mm / 2) / 10;
const r_cm = (d_inner_mm / 2) / 10;
const l_cm = l_m * 100;

// Material-Querschnittsfläche in cm²: A = pi * (R^2 - r^2)
const areaSectionCm2 = Math.PI * (Math.pow(R_cm, 2) - Math.pow(r_cm, 2));
const materialVolCm3 = areaSectionCm2 * l_cm;
const materialVolDm3 = materialVolCm3 / 1000; // Liter / dm³

// Innenvolumen (Füllvolumen des Rohrs)
const innerVolLiters = (Math.PI * Math.pow(r_cm, 2) * l_cm) / 1000;

let density = 7.85;
if (inputs.material === 'stainless') density = 7.95;
else if (inputs.material === 'aluminum') density = 2.70;
else if (inputs.material === 'copper') density = 8.96;
else if (inputs.material === 'pvc') density = 1.40;

const weightKg = materialVolDm3 * density;

return {
  primary: { id: 'weight', label: 'Rohrgewicht (Materialmasse)', value: weightKg, formattedValue: formatNumber(weightKg, 2) + ' kg', highlight: true },
  secondary: [
    { id: 'materialVol', label: 'Materialvolumen', value: materialVolDm3, formattedValue: formatNumber(materialVolDm3, 3) + ' dm³ (Liter)' },
    { id: 'innerVol', label: 'Innenvolumen (Füllvolumen)', value: innerVolLiters, formattedValue: formatNumber(innerVolLiters, 2) + ' Liter' },
    { id: 'innerDiameter', label: 'Innendurchmesser (d)', value: d_inner_mm, formattedValue: formatNumber(d_inner_mm, 1) + ' mm' },
  ],
  summaryText: 'Ein ' + l_m + ' m langes Rohr (D ' + D_mm + ' mm, Wandstärke ' + s_mm + ' mm) wiegt ca. ' + formatNumber(weightKg, 2) + ' kg und fasst ' + formatNumber(innerVolLiters, 2) + ' Liter Flüssigkeit.',
};`,
    formula: 'V_Material = π × (R² - r²) × L; Masse = V_Material × Dichte; Innendurchmesser d = D - 2s',
    formulaExplanation: 'Das Materialvolumen eines Hohlzylinders ergibt sich durch Subtraktion des inneren Zylinderhohlraums vom äußeren Gesamtzylinder.',
    workedExample: {
      title: 'Beispiel: Stahlrohr Ø 60,3 mm, Wand 3,2 mm, 6 Meter lang',
      inputValues: [{ label: 'Außen-Ø', value: '60,3 mm' }, { label: 'Wand', value: '3,2 mm' }, { label: 'Länge', value: '6 m' }],
      steps: ['Innen-Ø = 60,3 - 6,4 = 53,9 mm', 'Fläche = π × (3,015² - 2,695²) = 5,74 cm²', 'Volumen = 5,74 × 600 cm = 3.444 cm³ = 3,44 dm³', 'Gewicht = 3,44 dm³ × 7,85 kg/dm³ = 27,04 kg'],
      result: '27,04 kg (4,51 kg pro Meter)',
    },
    faqs: [
      { question: 'Wie berechnet man das Metergewicht eines Stahlrohrs?', answer: 'Faustformel für Stahlrohre: Metergewicht (kg/m) ≈ (Außendurchmesser in mm - Wandstärke in mm) × Wandstärke in mm × 0,02466.' },
      { question: 'Wie viel Wasser passt in ein Heizungsrohr?', answer: 'Das Füllvolumen pro Meter beträgt: V = π × (Innendurchmesser in dm / 2)² × 10 Liter. Ein 22-mm-Rohr mit 1 mm Wand (20 mm innen) fasst ca. 0,31 Liter Wasser pro Meter.' },
    ],
    relatedSlugs: ['zylinderrechner', 'kegel-volumen-rechner', 'quader-volumen-rechner'],
  },

  {
    id: 'pyramide-volumen-rechner',
    slug: 'pyramide-volumen-rechner',
    name: 'Pyramide Rechner (Volumen, Mantelfläche & Kantenlänge)',
    shortName: 'Pyramide Rechner',
    category: 'geometrie',
    subcategory: 'Körper',
    metaTitle: 'Pyramide Rechner – Volumen V = 1/3a²h, Mantelfläche & Oberfläche berechnen',
    metaDescription: 'Berechnen Sie das Volumen einer regelmäßigen quadratischen Pyramide (V = 1/3 · a² · h), die Seitenhöhe h_a, die Kantenlänge s und die Mantelfläche M.',
    h1: 'Pyramide Rechner – Quadratische Pyramide berechnen',
    shortDescription: 'Berechnet Volumen, Seitenkante, Mantelfläche und Gesamtoberfläche.',
    searchKeywords: ['pyramide rechner volumen formel', 'quadratische pyramide oberflaeche berechnen', 'seitenhoehe ha pyramide pythagoras', 'kantenlaenge s pyramide berechnen'],
    inputs: [
      { id: 'baseA', label: 'Grundkante (a)', type: 'number', defaultValue: 10, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'heightH', label: 'Körperhöhe (h)', type: 'number', defaultValue: 12, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
    ],
    calculateCode: `const a = Number(inputs.baseA) || 0;
const h = Number(inputs.heightH) || 0;

// Volumen V = (1/3) * a^2 * h
const v = (1 / 3) * Math.pow(a, 2) * h;
// Seitenhöhe der Dreiecksflächen: h_a = sqrt(h^2 + (a/2)^2)
const ha = Math.sqrt(Math.pow(h, 2) + Math.pow(a / 2, 2));
// Seitenkante s: s = sqrt(h_a^2 + (a/2)^2) = sqrt(h^2 + a^2 / 2)
const s = Math.sqrt(Math.pow(ha, 2) + Math.pow(a / 2, 2));
// Mantelfläche M = 4 * (1/2 * a * h_a) = 2 * a * h_a
const m = 2 * a * ha;
// Grundfläche G = a^2
const g = Math.pow(a, 2);
// Gesamtoberfläche O = G + M
const o = g + m;

return {
  primary: { id: 'volume', label: 'Pyramidenvolumen (V)', value: v, formattedValue: formatNumber(v, 2) + ' cm³', highlight: true },
  secondary: [
    { id: 'surface', label: 'Gesamtoberfläche (O)', value: o, formattedValue: formatNumber(o, 2) + ' cm²' },
    { id: 'mantle', label: 'Mantelfläche (4 Dreiecke)', value: m, formattedValue: formatNumber(m, 2) + ' cm²' },
    { id: 'slantHeight', label: 'Seitenflächenhöhe (h_a)', value: ha, formattedValue: formatNumber(ha, 2) + ' cm' },
    { id: 'edgeLength', label: 'Länge der Seitenkante (s)', value: s, formattedValue: formatNumber(s, 2) + ' cm' },
  ],
  summaryText: 'Die quadratische Pyramide hat ein Volumen von ' + formatNumber(v, 2) + ' cm³, eine Mantelfläche von ' + formatNumber(m, 2) + ' cm² und eine Kantenlänge von ' + formatNumber(s, 2) + ' cm.',
};`,
    formula: 'V = 1/3 × a² × h; h_a = √(h² + (a/2)²); M = 2 × a × h_a; O = a² + M',
    formulaExplanation: 'Genau wie beim Kegel beträgt das Volumen einer Pyramide exakt ein Drittel des umschriebenen Quaders (V = 1/3 · Grundfläche · Höhe).',
    workedExample: {
      title: 'Beispiel: Pyramide mit Grundkante a = 10 cm und Höhe h = 12 cm',
      inputValues: [{ label: 'Grundkante a', value: '10 cm' }, { label: 'Höhe h', value: '12 cm' }],
      steps: ['V = 1/3 × 10² × 12 = 400 cm³', 'h_a = √(12² + 5²) = √(144 + 25) = √169 = 13 cm', 'M = 2 × 10 × 13 = 260 cm²', 'O = 100 + 260 = 360 cm²'],
      result: 'V = 400 cm³, O = 360 cm²',
    },
    faqs: [
      { question: 'Wie groß sind die Maße der Cheops-Pyramide?', answer: 'Die Cheops-Pyramide in Gizeh hatte ursprünglich eine Basiskante von ca. 230,3 Metern und eine Höhe von ca. 146,6 Metern, was einem Volumen von fast 2,6 Millionen m³ entspricht.' },
      { question: 'Was ist ein regelmäßiges Tetraeder?', answer: 'Ein Tetraeder ist eine dreiseitige Pyramide, deren vier Flächen aus identischen gleichseitigen Dreiecken bestehen. Alle Kanten sind gleich lang.' },
    ],
    relatedSlugs: ['kegel-volumen-rechner', 'quader-volumen-rechner', 'dreieck-flaeche-rechner'],
  },

  {
    id: 'trapez-flaeche-rechner',
    slug: 'trapez-flaeche-rechner',
    name: 'Trapez Rechner (Flächeninhalt, Mittellinie & Umfang)',
    shortName: 'Trapez Rechner',
    category: 'geometrie',
    subcategory: 'Ebene Figuren',
    metaTitle: 'Trapez Rechner – Fläche A = ((a+c)/2) · h & Mittellinie m berechnen',
    metaDescription: 'Berechnen Sie den Flächeninhalt eines Trapezes über die parallelen Grundseiten a und c, die Höhe h und die Mittellinie m = (a + c) / 2 inklusive Umfang.',
    h1: 'Trapez Rechner – Flächeninhalt & Mittellinie für jedes Trapez',
    shortDescription: 'Berechnet Flächeninhalt und Mittellinie für beliebige Trapeze.',
    searchKeywords: ['trapez rechner flaeche formel', 'trapezflaeche berechnen a c 2 mal h', 'mittellinie m trapez formel', 'trapez umfang berechnen'],
    inputs: [
      { id: 'sideA', label: 'Längere Grundseite (a)', type: 'number', defaultValue: 12, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'sideC', label: 'Kürzere parallele Seite (c)', type: 'number', defaultValue: 8, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'heightH', label: 'Höhe zwischen a und c (h)', type: 'number', defaultValue: 5, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'sideB', label: 'Schenkel links (b – für Umfang)', type: 'number', defaultValue: 6, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'sideD', label: 'Schenkel rechts (d – für Umfang)', type: 'number', defaultValue: 6, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
    ],
    calculateCode: `const a = Number(inputs.sideA) || 0;
const c = Number(inputs.sideC) || 0;
const h = Number(inputs.heightH) || 0;
const b = Number(inputs.sideB) || 0;
const d = Number(inputs.sideD) || 0;

// Mittellinie m = (a + c) / 2
const m = (a + c) / 2;
// Fläche A = m * h = ((a + c) / 2) * h
const area = m * h;
// Umfang U = a + b + c + d
const u = a + b + c + d;

return {
  primary: { id: 'area', label: 'Flächeninhalt des Trapezes (A)', value: area, formattedValue: formatNumber(area, 2) + ' cm²', highlight: true },
  secondary: [
    { id: 'median', label: 'Mittellinie (m = (a+c)/2)', value: m, formattedValue: formatNumber(m, 2) + ' cm' },
    { id: 'perimeter', label: 'Umfang (U = a + b + c + d)', value: u, formattedValue: formatNumber(u, 2) + ' cm' },
  ],
  summaryText: 'Das Trapez hat einen Flächeninhalt von ' + formatNumber(area, 2) + ' cm² bei einer Mittellinie von ' + formatNumber(m, 2) + ' cm und einem Umfang von ' + formatNumber(u, 2) + ' cm.',
};`,
    formula: 'A = ((a + c) / 2) × h = m × h; m = (a + c) / 2; U = a + b + c + d',
    formulaExplanation: 'Ein Trapez lässt sich gedanklich durch Halbieren und Umklappen in ein flächengleiches Rechteck der Länge m = (a+c)/2 und der Höhe h verwandeln.',
    workedExample: {
      title: 'Beispiel: Trapez mit a = 12 cm, c = 8 cm und Höhe h = 5 cm',
      inputValues: [{ label: 'a', value: '12 cm' }, { label: 'c', value: '8 cm' }, { label: 'h', value: '5 cm' }],
      steps: ['m = (12 + 8) / 2 = 10 cm', 'A = 10 cm × 5 cm = 50 cm²'],
      result: '50 cm² Flächeninhalt',
    },
    faqs: [
      { question: 'Wann ist ein Trapez gleichschenklig?', answer: 'Ein Trapez ist gleichschenklig, wenn die beiden nicht-parallelen Schenkel b und d gleich lang sind. Dann sind auch die Basiswinkel und die beiden Diagonalen exakt gleich groß.' },
      { question: 'Was ist ein rechtwinkliges Trapez?', answer: 'In einem rechtwinkligen Trapez steht einer der beiden Schenkel senkrecht auf den Grundseiten a und c, sodass dieser Schenkel identisch mit der Höhe h ist.' },
    ],
    relatedSlugs: ['parallelogramm-rechner', 'dreieck-flaeche-rechner', 'rechteckrechner'],
  },

  {
    id: 'parallelogramm-rechner',
    slug: 'parallelogramm-rechner',
    name: 'Parallelogramm Rechner (Fläche, Umfang & Höhen)',
    shortName: 'Parallelogramm Rechner',
    category: 'geometrie',
    subcategory: 'Ebene Figuren',
    metaTitle: 'Parallelogramm Rechner – Fläche A = a · h_a, Umfang & Winkel berechnen',
    metaDescription: 'Berechnen Sie den Flächeninhalt eines Parallelogramms (A = a · h_a = a · b · sin(α)), den Umfang (U = 2a + 2b) und die Diagonalen e und f.',
    h1: 'Parallelogramm Rechner – Flächeninhalt, Umfang & Diagonalen',
    shortDescription: 'Berechnet Flächeninhalt, Umfang und Diagonalen eines Parallelogramms.',
    searchKeywords: ['parallelogramm rechner flaeche formel', 'parallelogramm umfang 2a plus 2b', 'parallelogramm flaeche a mal ha', 'diagonalen parallelogramm kosinussatz'],
    inputs: [
      { id: 'sideA', label: 'Grundseite (a)', type: 'number', defaultValue: 10, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'sideB', label: 'Zweite Seite (b)', type: 'number', defaultValue: 6, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'angleDeg', label: 'Innenwinkel Alpha (α)', type: 'number', defaultValue: 60, min: 1, max: 179, step: 1, unit: '°' },
    ],
    calculateCode: `const a = Number(inputs.sideA) || 0;
const b = Number(inputs.sideB) || 0;
const alphaDeg = Number(inputs.angleDeg) || 60;

const alphaRad = (alphaDeg * Math.PI) / 180;
const betaDeg = 180 - alphaDeg;
const betaRad = (betaDeg * Math.PI) / 180;

// Höhe h_a = b * sin(alpha)
const ha = b * Math.sin(alphaRad);
// Höhe h_b = a * sin(alpha)
const hb = a * Math.sin(alphaRad);

// Fläche A = a * ha = a * b * sin(alpha)
const area = a * ha;
// Umfang U = 2 * (a + b)
const u = 2 * (a + b);

// Diagonalen nach Kosinussatz:
// e = sqrt(a^2 + b^2 - 2ab*cos(beta)) = sqrt(a^2 + b^2 + 2ab*cos(alpha))
const diagE = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) + (2 * a * b * Math.cos(alphaRad)));
const diagF = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) - (2 * a * b * Math.cos(alphaRad)));

return {
  primary: { id: 'area', label: 'Flächeninhalt (A)', value: area, formattedValue: formatNumber(area, 2) + ' cm²', highlight: true },
  secondary: [
    { id: 'perimeter', label: 'Umfang (U = 2a + 2b)', value: u, formattedValue: formatNumber(u, 2) + ' cm' },
    { id: 'heightA', label: 'Höhe zur Seite a (h_a)', value: ha, formattedValue: formatNumber(ha, 2) + ' cm' },
    { id: 'diagonalE', label: 'Lange Diagonale (e)', value: Math.max(diagE, diagF), formattedValue: formatNumber(Math.max(diagE, diagF), 2) + ' cm' },
    { id: 'diagonalF', label: 'Kurze Diagonale (f)', value: Math.min(diagE, diagF), formattedValue: formatNumber(Math.min(diagE, diagF), 2) + ' cm' },
  ],
  summaryText: 'Das Parallelogramm hat eine Fläche von ' + formatNumber(area, 2) + ' cm², einen Umfang von ' + formatNumber(u, 2) + ' cm und eine Höhe h_a von ' + formatNumber(ha, 2) + ' cm.',
};`,
    formula: 'A = a × h_a = a × b × sin(α); U = 2 × (a + b); h_a = b × sin(α)',
    formulaExplanation: 'Gegenüberliegende Seiten und Winkel in einem Parallelogramm sind exakt gleich groß. Die beiden benachbarten Winkel ergänzen sich immer zu 180°.',
    workedExample: {
      title: 'Beispiel: Parallelogramm a = 10 cm, b = 6 cm, α = 60°',
      inputValues: [{ label: 'a', value: '10 cm' }, { label: 'b', value: '6 cm' }, { label: 'α', value: '60°' }],
      steps: ['h_a = 6 × sin(60°) = 6 × 0,866 = 5,196 cm', 'A = 10 × 5,196 = 51,96 cm²', 'U = 2 × (10 + 6) = 32 cm'],
      result: 'A = 51,96 cm², U = 32 cm',
    },
    faqs: [
      { question: 'Was ist die Parallelogrammgleichung?', answer: 'Die Parallelogrammgleichung besagt, dass die Summe der Quadrate über den vier Seiten gleich der Summe der Quadrate der beiden Diagonalen ist: 2(a² + b²) = e² + f².' },
      { question: 'Ist jedes Rechteck ein Parallelogramm?', answer: 'Ja, ein Rechteck ist ein spezielles Parallelogramm, bei dem alle vier Innenwinkel genau 90° betragen.' },
    ],
    relatedSlugs: ['trapez-flaeche-rechner', 'rhombus-raute-rechner', 'rechteckrechner'],
  },

  {
    id: 'rhombus-raute-rechner',
    slug: 'rhombus-raute-rechner',
    name: 'Raute Rechner (Rhombus Fläche nach Diagonalen e & f)',
    shortName: 'Raute Rechner',
    category: 'geometrie',
    subcategory: 'Ebene Figuren',
    metaTitle: 'Raute Rechner – Rhombus Fläche A = (e · f) / 2, Umfang & Seite berechnen',
    metaDescription: 'Berechnen Sie Flächeninhalt einer Raute (A = (e · f) / 2), die Seitenlänge a, den Umfang (U = 4a) und den Inkreisradius aus den Diagonalen e und f.',
    h1: 'Raute Rechner – Flächeninhalt, Seitenlänge & Umfang eines Rhombus',
    shortDescription: 'Berechnet Fläche, Umfang und Seitenlänge einer Raute aus den Diagonalen.',
    searchKeywords: ['raute rechner flaeche diagonalen e f', 'rhombus flaeche formel 1 halbe e mal f', 'seitenlaenge raute berechnen pythagoras', 'umfang raute 4a'],
    inputs: [
      { id: 'diagE', label: 'Erste Diagonale (e)', type: 'number', defaultValue: 12, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'diagF', label: 'Zweite Diagonale (f)', type: 'number', defaultValue: 8, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
    ],
    calculateCode: `const e = Number(inputs.diagE) || 0;
const f = Number(inputs.diagF) || 0;

// Fläche A = (e * f) / 2
const area = (e * f) / 2;
// Seitenlänge a nach Pythagoras: a = sqrt((e/2)^2 + (f/2)^2)
const a = Math.sqrt(Math.pow(e / 2, 2) + Math.pow(f / 2, 2));
// Umfang U = 4 * a
const u = 4 * a;
// Inkreisradius r = A / (2 * a) = (e * f) / (4 * a)
const rIn = a > 0 ? (e * f) / (4 * a) : 0;
// Höhe h = A / a
const h = a > 0 ? area / a : 0;

return {
  primary: { id: 'area', label: 'Flächeninhalt der Raute (A)', value: area, formattedValue: formatNumber(area, 2) + ' cm²', highlight: true },
  secondary: [
    { id: 'sideA', label: 'Seitenlänge (a)', value: a, formattedValue: formatNumber(a, 2) + ' cm' },
    { id: 'perimeter', label: 'Umfang (U = 4a)', value: u, formattedValue: formatNumber(u, 2) + ' cm' },
    { id: 'inradius', label: 'Inkreisradius (r)', value: rIn, formattedValue: formatNumber(rIn, 2) + ' cm' },
    { id: 'height', label: 'Rautenhöhe (h)', value: h, formattedValue: formatNumber(h, 2) + ' cm' },
  ],
  summaryText: 'Die Raute hat eine Fläche von ' + formatNumber(area, 2) + ' cm², eine Seitenlänge von ' + formatNumber(a, 2) + ' cm und einen Umfang von ' + formatNumber(u, 2) + ' cm.',
};`,
    formula: 'A = (e × f) / 2; a = √((e/2)² + (f/2)²); U = 4 × a; r_In = (e × f) / (4 × a)',
    formulaExplanation: 'In einer Raute stehen die beiden Diagonalen senkrecht aufeinander und halbieren sich gegenseitig. Dadurch zerlegen sie die Raute in vier kongruente rechtwinklige Dreiecke.',
    workedExample: {
      title: 'Beispiel: Raute mit Diagonalen e = 12 cm und f = 8 cm',
      inputValues: [{ label: 'e', value: '12 cm' }, { label: 'f', value: '8 cm' }],
      steps: ['A = (12 × 8) / 2 = 48 cm²', 'a = √(6² + 4²) = √(36 + 16) = √52 ≈ 7,21 cm', 'U = 4 × 7,21 = 28,84 cm'],
      result: 'A = 48 cm², a = 7,21 cm',
    },
    faqs: [
      { question: 'Stehen die Diagonalen in jeder Raute senkrecht aufeinander?', answer: 'Ja, das ist das zentrale geometrische Kennzeichen jeder Raute: e und f schneiden sich stets im 90°-Winkel und halbieren zugleich die Innenwinkel.' },
      { question: 'Ist ein Quadrat auch eine Raute?', answer: 'Ja, ein Quadrat ist eine spezielle Raute, bei der alle vier Innenwinkel 90° betragen (und somit beide Diagonalen exakt gleich lang sind).' },
    ],
    relatedSlugs: ['parallelogramm-rechner', 'trapez-flaeche-rechner', 'dreieck-flaeche-rechner'],
  },

  {
    id: 'kugel-oberflaeche-rechner',
    slug: 'kugel-oberflaeche-rechner',
    name: 'Kugel Rechner (Volumen V = 4/3πr³ & Oberfläche O = 4πr²)',
    shortName: 'Kugel Rechner',
    category: 'geometrie',
    subcategory: 'Körper',
    metaTitle: 'Kugel Rechner – Kugelvolumen V = 4/3πr³ & Kugeloberfläche berechnen',
    metaDescription: 'Berechnen Sie Kugelvolumen (V = 4/3 · π · r³), Kugeloberfläche (O = 4 · π · r²), Durchmesser und Kreisumfang nach Radius oder Durchmesser.',
    h1: 'Kugel Rechner – Kugelvolumen & Kugeloberfläche berechnen',
    shortDescription: 'Berechnet Kugelvolumen, Oberfläche und Umfang aus dem Radius.',
    searchKeywords: ['kugel rechner volumen formel 4 drittel pi r3', 'kugeloberflaeche berechnen 4 pi r2', 'kugel volumen radius durchmesser', 'kugelumfang grosskreis berechnen'],
    inputs: [
      {
        id: 'inputType',
        label: 'Eingegebene Dimension',
        type: 'select',
        defaultValue: 'radius',
        options: [
          { value: 'radius', label: 'Radius (r)' },
          { value: 'diameter', label: 'Durchmesser (d)' },
          { value: 'volume', label: 'Volumen (V)' },
        ],
      },
      { id: 'inputValue', label: 'Wert', type: 'number', defaultValue: 10, min: 0.1, max: 10000, step: 0.1, unit: 'cm bzw. cm³' },
    ],
    calculateCode: `const type = inputs.inputType;
const val = Number(inputs.inputValue) || 0;

let r = val;
if (type === 'diameter') r = val / 2;
else if (type === 'volume') r = Math.cbrt((3 * val) / (4 * Math.PI));

const d = 2 * r;
// V = (4/3) * pi * r^3
const v = (4 / 3) * Math.PI * Math.pow(r, 3);
// O = 4 * pi * r^2
const o = 4 * Math.PI * Math.pow(r, 2);
// Umfang des Großkreises: U = 2 * pi * r
const u = 2 * Math.PI * r;

return {
  primary: { id: 'volume', label: 'Kugelvolumen (V)', value: v, formattedValue: formatNumber(v, 2) + ' cm³ (' + formatNumber(v / 1000, 3) + ' Liter)', highlight: true },
  secondary: [
    { id: 'surface', label: 'Kugeloberfläche (O)', value: o, formattedValue: formatNumber(o, 2) + ' cm²' },
    { id: 'diameter', label: 'Kugeldurchmesser (d)', value: d, formattedValue: formatNumber(d, 2) + ' cm' },
    { id: 'radius', label: 'Kugelradius (r)', value: r, formattedValue: formatNumber(r, 2) + ' cm' },
    { id: 'perimeter', label: 'Umfang des Äquators (Großkreis)', value: u, formattedValue: formatNumber(u, 2) + ' cm' },
  ],
  summaryText: 'Eine Kugel mit Radius ' + formatNumber(r, 2) + ' cm hat ein Volumen von ' + formatNumber(v, 2) + ' cm³ (' + formatNumber(v / 1000, 2) + ' l) und eine Oberfläche von ' + formatNumber(o, 2) + ' cm².',
};`,
    formula: 'V = 4/3 × π × r³; O = 4 × π × r² = π × d²; U = 2 × π × r',
    formulaExplanation: 'Die Kugel besitzt von allen dreidimensionalen Körpern die kleinste Oberfläche bei gegebenem Volumen, weshalb Wassertropfen und Seifenblasen von Natur aus Kugelform annehmen.',
    workedExample: {
      title: 'Beispiel: Kugel mit Radius r = 10 cm',
      inputValues: [{ label: 'Radius', value: '10 cm' }],
      steps: ['V = 4/3 × π × 10³ = 4.188,79 cm³ (ca. 4,19 Liter)', 'O = 4 × π × 10² = 1.256,64 cm²', 'U = 2 × π × 10 = 62,83 cm'],
      result: 'V = 4.188,79 cm³, O = 1.256,64 cm²',
    },
    faqs: [
      { question: 'Wie verhält sich das Kugelvolumen bei Verdopplung des Radius?', answer: 'Da der Radius in der dritten Potenz (r³) steht, verachtfacht (2³ = 8) sich das Kugelvolumen bei einer Verdoppelung des Radius! Die Oberfläche vervierfacht (2² = 4) sich.' },
      { question: 'Wer entdeckte die Kugelformeln?', answer: 'Archimedes von Syrakus bewies im 3. Jahrhundert v. Chr., dass das Volumen und die Oberfläche einer Kugel genau 2/3 des umbeschriebenen Zylinders betragen.' },
    ],
    relatedSlugs: ['kreisrechner', 'kegel-volumen-rechner', 'zylinderrechner'],
  },

  {
    id: 'quader-volumen-rechner',
    slug: 'quader-volumen-rechner',
    name: 'Quader Rechner (Volumen, Oberfläche & Raumdiagonale)',
    shortName: 'Quader Rechner',
    category: 'geometrie',
    subcategory: 'Körper',
    metaTitle: 'Quader Rechner – Volumen V = a · b · c, Oberfläche & Raumdiagonale',
    metaDescription: 'Berechnen Sie das Quadervolumen (V = a · b · c), die Gesamtoberfläche (O = 2(ab + bc + ca)) und die 3D-Raumdiagonale d = √(a² + b² + c²) nach den Kantenlängen.',
    h1: 'Quader Rechner – Volumen, Oberfläche & Raumdiagonale berechnen',
    shortDescription: 'Berechnet Volumen, Oberfläche und Raumdiagonale eines Quaders.',
    searchKeywords: ['quader rechner volumen a b c', 'quader oberflaeche formel berechnen', 'raumdiagonale quader pythagoras 3d', 'quader kantenlaenge volumen'],
    inputs: [
      { id: 'lengthA', label: 'Länge (a)', type: 'number', defaultValue: 10, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'widthB', label: 'Breite (b)', type: 'number', defaultValue: 6, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'heightC', label: 'Höhe (c)', type: 'number', defaultValue: 4, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
    ],
    calculateCode: `const a = Number(inputs.lengthA) || 0;
const b = Number(inputs.widthB) || 0;
const c = Number(inputs.heightC) || 0;

// Volumen V = a * b * c
const v = a * b * c;
// Oberfläche O = 2 * (a*b + b*c + a*c)
const o = 2 * ((a * b) + (b * c) + (a * c));
// Raumdiagonale d = sqrt(a^2 + b^2 + c^2)
const d = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) + Math.pow(c, 2));
// Gesamte Kantenlänge K = 4 * (a + b + c)
const k = 4 * (a + b + c);

return {
  primary: { id: 'volume', label: 'Quadervolumen (V)', value: v, formattedValue: formatNumber(v, 2) + ' cm³ (' + formatNumber(v / 1000, 3) + ' l)', highlight: true },
  secondary: [
    { id: 'surface', label: 'Gesamtoberfläche (O)', value: o, formattedValue: formatNumber(o, 2) + ' cm²' },
    { id: 'spaceDiag', label: 'Raumdiagonale (d)', value: d, formattedValue: formatNumber(d, 2) + ' cm' },
    { id: 'edges', label: 'Gesamte Kantenlänge (Drahtmodell)', value: k, formattedValue: formatNumber(k, 1) + ' cm' },
  ],
  summaryText: 'Der Quader (' + a + ' × ' + b + ' × ' + c + ' cm) hat ein Volumen von ' + formatNumber(v, 2) + ' cm³, eine Oberfläche von ' + formatNumber(o, 2) + ' cm² und eine Raumdiagonale von ' + formatNumber(d, 2) + ' cm.',
};`,
    formula: 'V = a × b × c; O = 2 × (ab + bc + ca); d = √(a² + b² + c²)',
    formulaExplanation: 'Die Raumdiagonale verbindet zwei gegenüberliegende Ecken durch das Innere des Quaders und lässt sich über den doppelten Satz des Pythagoras ermitteln.',
    workedExample: {
      title: 'Beispiel: Quader mit a = 10 cm, b = 6 cm, c = 4 cm',
      inputValues: [{ label: 'a', value: '10 cm' }, { label: 'b', value: '6 cm' }, { label: 'c', value: '4 cm' }],
      steps: ['V = 10 × 6 × 4 = 240 cm³', 'O = 2 × (60 + 24 + 40) = 2 × 124 = 248 cm²', 'd = √(100 + 36 + 16) = √152 ≈ 12,33 cm'],
      result: 'V = 240 cm³, O = 248 cm², d = 12,33 cm',
    },
    faqs: [
      { question: 'Wann ist ein Quader ein Würfel?', answer: 'Ein Quader ist ein Würfel (Hexaeder), wenn alle drei Kantenlängen gleich lang sind (a = b = c). Dann gilt V = a³ und O = 6a².' },
      { question: 'Wie viele Ecken, Kanten und Flächen hat ein Quader?', answer: 'Ein Quader besitzt genau 8 rechtwinklige Ecken, 12 Kanten und 6 paarweise zueinander parallele und kongruente Rechteckflächen.' },
    ],
    relatedSlugs: ['rechteckrechner', 'pyramide-volumen-rechner', 'zylinderrechner'],
  },

  {
    id: 'prisma-volumen-rechner',
    slug: 'prisma-volumen-rechner',
    name: 'Prisma Rechner (Volumen, Mantelfläche & Dreiecksprisma)',
    shortName: 'Prisma Rechner',
    category: 'geometrie',
    subcategory: 'Körper',
    metaTitle: 'Prisma Rechner – Prisma Volumen V = G · h & Gesamtoberfläche berechnen',
    metaDescription: 'Berechnen Sie das Volumen eines geraden Dreiecksprismas oder allgemeinen Prismas (V = Grundfläche · Höhe), die Mantelfläche und die Gesamtoberfläche O = 2G + M.',
    h1: 'Prisma Rechner – Volumen & Oberfläche für Dreiecksprismen',
    shortDescription: 'Berechnet Volumen, Mantelfläche und Oberfläche von geraden Prismen.',
    searchKeywords: ['prisma rechner volumen formel grundflaeche hoehe', 'dreiecksprisma volumen berechnen', 'prisma oberflaeche 2g plus m', 'mantelflaeche prisma berechnen'],
    inputs: [
      { id: 'baseAreaG', label: 'Grundfläche des Prismas (G)', type: 'number', defaultValue: 25, min: 0.1, max: 10000, step: 0.1, unit: 'cm²' },
      { id: 'perimeterU', label: 'Umfang der Grundfläche (U)', type: 'number', defaultValue: 22, min: 0.1, max: 10000, step: 0.1, unit: 'cm' },
      { id: 'heightH', label: 'Körperhöhe des Prismas (h)', type: 'number', defaultValue: 15, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
    ],
    calculateCode: `const g = Number(inputs.baseAreaG) || 0;
const u = Number(inputs.perimeterU) || 0;
const h = Number(inputs.heightH) || 0;

// Volumen V = G * h
const v = g * h;
// Mantelfläche M = U * h
const m = u * h;
// Gesamtoberfläche O = 2 * G + M
const o = (2 * g) + m;

return {
  primary: { id: 'volume', label: 'Prismenvolumen (V)', value: v, formattedValue: formatNumber(v, 2) + ' cm³ (' + formatNumber(v / 1000, 3) + ' l)', highlight: true },
  secondary: [
    { id: 'surface', label: 'Gesamtoberfläche (O = 2G + M)', value: o, formattedValue: formatNumber(o, 2) + ' cm²' },
    { id: 'mantle', label: 'Mantelfläche (M = U · h)', value: m, formattedValue: formatNumber(m, 2) + ' cm²' },
  ],
  summaryText: 'Das Prisma hat ein Volumen von ' + formatNumber(v, 2) + ' cm³, eine Mantelfläche von ' + formatNumber(m, 2) + ' cm² und eine Gesamtoberfläche von ' + formatNumber(o, 2) + ' cm².',
};`,
    formula: 'V = G × h; M = U × h; O = 2 × G + M',
    formulaExplanation: 'Ein gerades Prisma entsteht durch das Verschieben einer beliebigen ebenen Grundfläche G entlang einer Höhe h senkrecht zur Grundfläche.',
    workedExample: {
      title: 'Beispiel: Dreiecksprisma mit G = 25 cm², U = 22 cm und Höhe h = 15 cm',
      inputValues: [{ label: 'G', value: '25 cm²' }, { label: 'U', value: '22 cm' }, { label: 'h', value: '15 cm' }],
      steps: ['V = 25 × 15 = 375 cm³', 'M = 22 × 15 = 330 cm²', 'O = 2 × 25 + 330 = 50 + 330 = 380 cm²'],
      result: 'V = 375 cm³, O = 380 cm²',
    },
    faqs: [
      { question: 'Was ist der Unterschied zwischen Zylinder und Prisma?', answer: 'Ein Zylinder hat einen Kreis als Grundfläche, während ein Prisma ein beliebiges Vieleck (Dreieck, Viereck, Sechseck etc.) als Grundfläche besitzt. Die Volumenformel V = G · h ist für beide identisch!' },
      { question: 'Gilt die Formel V = G · h auch für schiefe Prismen?', answer: 'Ja, nach dem Prinzip von Cavalieri gilt V = G · h für alle Prismen, solange h der senkrechte Abstand zwischen Grund- und Deckfläche ist.' },
    ],
    relatedSlugs: ['zylinderrechner', 'quader-volumen-rechner', 'dreieck-flaeche-rechner'],
  },

  {
    id: 'sechseck-polygon-rechner',
    slug: 'sechseck-polygon-rechner',
    name: 'Sechseck Rechner (Regelmäßiges Hexagon Fläche & Inkreis)',
    shortName: 'Sechseck Rechner',
    category: 'geometrie',
    subcategory: 'Ebene Figuren',
    metaTitle: 'Sechseck Rechner – Regelmäßiges Hexagon Fläche A, Umfang & Inkreis',
    metaDescription: 'Berechnen Sie die Fläche eines regelmäßigen Sechsecks (A = (3√3 / 2) · a²), den Umfang (U = 6a), den Inkreisradius r_i und den Umkreisradius r_u = a.',
    h1: 'Sechseck Rechner – Hexagon Flächeninhalt & Inkreis berechnen',
    shortDescription: 'Berechnet Fläche, Umfang, Inkreis- und Umkreisradius eines Sechsecks.',
    searchKeywords: ['sechseck rechner flaeche formel hexagon', 'regelmaessiges sechseck inkreisradius umkreisradius', 'flaecheninhalt sechseck 3 wurzel 3 halbe a2', 'hexagon umfang 6a'],
    inputs: [
      { id: 'sideA', label: 'Seitenlänge des Sechsecks (a)', type: 'number', defaultValue: 8, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
    ],
    calculateCode: `const a = Number(inputs.sideA) || 0;

// Fläche A = (3 * sqrt(3) / 2) * a^2
const area = (3 * Math.sqrt(3) / 2) * Math.pow(a, 2);
// Umfang U = 6 * a
const u = 6 * a;
// Umkreisradius r_u = a
const rU = a;
// Inkreisradius r_i = (sqrt(3) / 2) * a
const rI = (Math.sqrt(3) / 2) * a;
// Schlüsselweite (Abstand gegenüberliegender paralleler Seiten): s = 2 * r_i = sqrt(3) * a
const sWeite = Math.sqrt(3) * a;

return {
  primary: { id: 'area', label: 'Flächeninhalt des Sechsecks (A)', value: area, formattedValue: formatNumber(area, 2) + ' cm²', highlight: true },
  secondary: [
    { id: 'perimeter', label: 'Umfang (U = 6a)', value: u, formattedValue: formatNumber(u, 2) + ' cm' },
    { id: 'inradius', label: 'Inkreisradius (r_i)', value: rI, formattedValue: formatNumber(rI, 2) + ' cm' },
    { id: 'circumradius', label: 'Umkreisradius (r_u = a)', value: rU, formattedValue: formatNumber(rU, 2) + ' cm' },
    { id: 'wrenchSize', label: 'Schlüsselweite (SW = 2 · r_i)', value: sWeite, formattedValue: formatNumber(sWeite, 2) + ' cm' },
  ],
  summaryText: 'Ein regelmäßiges Sechseck mit Seite a = ' + a + ' cm hat einen Flächeninhalt von ' + formatNumber(area, 2) + ' cm² (Umfang ' + u + ' cm, Inkreisradius ' + formatNumber(rI, 2) + ' cm).',
};`,
    formula: 'A = (3 × √3 / 2) × a² ≈ 2,598 × a²; U = 6 × a; r_i = (√3 / 2) × a; r_u = a',
    formulaExplanation: 'Ein regelmäßiges Sechseck besteht aus exakt sechs lückenlos aneinandergereihten, gleichseitigen Dreiecken mit Seitenlänge a.',
    workedExample: {
      title: 'Beispiel: Regelmäßiges Sechseck mit Seite a = 8 cm',
      inputValues: [{ label: 'Seitenlänge a', value: '8 cm' }],
      steps: ['A = (3 × 1,732 / 2) × 8² = 2,598 × 64 = 166,28 cm²', 'U = 6 × 8 = 48 cm', 'Inkreisradius r_i = (√3 / 2) × 8 ≈ 6,93 cm'],
      result: 'A = 166,28 cm², U = 48 cm, r_i = 6,93 cm',
    },
    faqs: [
      { question: 'Warum bauen Bienen sechseckige Waben?', answer: 'Das Sechseck ist mathematisch die geometrische Figur, die eine Fläche mit dem geringstmöglichen Umfang lückenlos parkettiert. Dadurch sparen Bienen maximal Wachs und Energie.' },
      { question: 'Was ist die Schlüsselweite bei einer Sechskantschraube?', answer: 'Die Schlüsselweite (SW) ist der parallele Abstand zweier gegenüberliegender Seiten des Sechskants und entspricht exakt dem doppelten Inkreisradius: SW = a · √3.' },
    ],
    relatedSlugs: ['dreieck-flaeche-rechner', 'kreis-umfang-rechner', 'rechteckrechner'],
  },

  {
    id: 'ellipse-flaeche-rechner',
    slug: 'ellipse-flaeche-rechner',
    name: 'Ellipse Rechner (Fläche A = π · a · b & Ramanujan-Umfang)',
    shortName: 'Ellipse Rechner',
    category: 'geometrie',
    subcategory: 'Ebene Figuren',
    metaTitle: 'Ellipse Rechner – Ellipsenfläche A = πab & Umfang nach Ramanujan',
    metaDescription: 'Berechnen Sie die Fläche einer Ellipse (A = π · a · b), den präzisen Umfang nach der Ramanujan-Formel und die lineare Exzentrizität aus den Halbachsen a und b.',
    h1: 'Ellipse Rechner – Ellipsenfläche, Umfang & Brennpunkte',
    shortDescription: 'Berechnet Flächeninhalt, Umfang und Brennpunkte einer Ellipse.',
    searchKeywords: ['ellipse rechner flaeche formel pi a b', 'ellipsenumfang ramanujan naeherung', 'halbachsen a b ellipse berechnen', 'lineare exzentrizitaet brennpunkt ellipse'],
    inputs: [
      { id: 'axisA', label: 'Große Halbachse (a)', type: 'number', defaultValue: 10, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'axisB', label: 'Kleine Halbachse (b)', type: 'number', defaultValue: 6, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
    ],
    calculateCode: `const a = Math.max(Number(inputs.axisA) || 0, Number(inputs.axisB) || 0);
const b = Math.min(Number(inputs.axisA) || 0, Number(inputs.axisB) || 0);

// Fläche A = pi * a * b
const area = Math.PI * a * b;

// Umfang nach Ramanujan I: U ≈ pi * [3(a + b) - sqrt((3a + b)(a + 3b))]
const hR = Math.pow(a - b, 2) / Math.pow(a + b, 2);
const uRamanujan = Math.PI * (a + b) * (1 + (3 * hR) / (10 + Math.sqrt(4 - 3 * hR)));

// Lineare Exzentrizität (Brennpunktsabstand vom Zentrum): e = sqrt(a^2 - b^2)
const linExz = Math.sqrt(Math.pow(a, 2) - Math.pow(b, 2));
// Numerische Exzentrizität epsilon = e / a (0 = Kreis, 1 = Parabel)
const numExz = a > 0 ? linExz / a : 0;

return {
  primary: { id: 'area', label: 'Ellipsenfläche (A = π · a · b)', value: area, formattedValue: formatNumber(area, 2) + ' cm²', highlight: true },
  secondary: [
    { id: 'perimeter', label: 'Präziser Umfang (Ramanujan II)', value: uRamanujan, formattedValue: formatNumber(uRamanujan, 2) + ' cm' },
    { id: 'focalDist', label: 'Lineare Exzentrizität e (Brennpunkte)', value: linExz, formattedValue: formatNumber(linExz, 2) + ' cm' },
    { id: 'numExz', label: 'Numerische Exzentrizität ε', value: numExz, formattedValue: formatNumber(numExz, 3) },
  ],
  summaryText: 'Die Ellipse mit Halbachsen a = ' + a + ' cm und b = ' + b + ' cm hat einen Flächeninhalt von ' + formatNumber(area, 2) + ' cm² und einen Umfang von ca. ' + formatNumber(uRamanujan, 2) + ' cm.',
};`,
    formula: 'A = π × a × b; U ≈ π(a+b)(1 + 3h / (10 + √(4 - 3h))) mit h = (a-b)²/(a+b)²',
    formulaExplanation: 'Während die Fläche einer Ellipse exakt berechnet werden kann, lässt sich der Umfang einer Ellipse nicht durch elementare Funktionen, sondern nur über elliptische Integrale oder hochpräzise Näherungen (Ramanujan) ermitteln.',
    workedExample: {
      title: 'Beispiel: Ellipse mit a = 10 cm und b = 6 cm',
      inputValues: [{ label: 'a', value: '10 cm' }, { label: 'b', value: '6 cm' }],
      steps: ['A = π × 10 × 6 = 60 × π ≈ 188,50 cm²', 'e = √(10² - 6²) = √(100 - 36) = √64 = 8 cm', 'Umfang nach Ramanujan ≈ 51,05 cm'],
      result: 'A = 188,50 cm², U = 51,05 cm',
    },
    faqs: [
      { question: 'Wo liegen die Brennpunkte einer Ellipse?', answer: 'Die beiden Brennpunkte F1 und F2 liegen symmetrisch auf der Hauptachse im Abstand e = √(a² - b²) vom Zentrum. Für jeden Punkt auf der Ellipse ist die Summe der Abstände zu den beiden Brennpunkten konstant 2a.' },
      { question: 'Was besagt das 1. Keplersche Gesetz?', answer: 'Die Planeten unseres Sonnensystems bewegen sich auf elliptischen Bahnen um die Sonne, wobei die Sonne in einem der beiden Brennpunkte steht.' },
    ],
    relatedSlugs: ['kreis-umfang-rechner', 'kreisrechner', 'rechteckrechner'],
  },

  {
    id: 'kreissegment-rechner',
    slug: 'kreissegment-rechner',
    name: 'Kreissektor & Kreissegment Rechner (Bogenlänge, Sehne & Fläche)',
    shortName: 'Kreissektor & Segment',
    category: 'geometrie',
    subcategory: 'Ebene Figuren',
    metaTitle: 'Kreissektor & Segment Rechner – Bogenlänge, Sehnenlänge & Fläche',
    metaDescription: 'Berechnen Sie Kreissektor (Tortenstück), Bogenlänge b = (α/180)·π·r, Sehnenlänge s = 2r·sin(α/2) und die Kreissegment-Fläche aus Radius und Mittelpunktswinkel.',
    h1: 'Kreissektor & Kreissegment Rechner – Bogenlänge & Teilflächen',
    shortDescription: 'Berechnet Kreissektor, Kreissegment, Bogenlänge und Sehnenlänge.',
    searchKeywords: ['kreissektor rechner flaeche bogenlaenge', 'kreissegment berechnen radius sehne', 'bogenlaenge b alpha 180 pi r', 'sehnenlaenge kreis berechnen formel'],
    inputs: [
      { id: 'radius', label: 'Kreisradius (r)', type: 'number', defaultValue: 10, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'angleAlpha', label: 'Mittelpunktswinkel Alpha (α)', type: 'number', defaultValue: 60, min: 1, max: 360, step: 1, unit: '°' },
    ],
    calculateCode: `const r = Number(inputs.radius) || 0;
const alpha = Number(inputs.angleAlpha) || 0;
const alphaRad = (alpha * Math.PI) / 180;

// Bogenlänge b = (alpha / 180) * pi * r
const b = (alpha / 180) * Math.PI * r;
// Kreissektor-Fläche A_sektor = (alpha / 360) * pi * r^2 = 0.5 * b * r
const aSektor = (alpha / 360) * Math.PI * Math.pow(r, 2);
// Sehnenlänge s = 2 * r * sin(alpha / 2)
const s = 2 * r * Math.sin(alphaRad / 2);
// Dreiecksfläche unter der Sehne: A_dreieck = 0.5 * r^2 * sin(alpha)
const aDreieck = 0.5 * Math.pow(r, 2) * Math.sin(alphaRad);
// Kreissegment-Fläche = A_sektor - A_dreieck
const aSegment = Math.max(0, aSektor - aDreieck);

return {
  primary: { id: 'sectorArea', label: 'Kreissektor-Fläche (Tortenstück)', value: aSektor, formattedValue: formatNumber(aSektor, 2) + ' cm²', highlight: true },
  secondary: [
    { id: 'arcLength', label: 'Kreisbogen-Länge (b)', value: b, formattedValue: formatNumber(b, 2) + ' cm' },
    { id: 'segmentArea', label: 'Kreissegment-Fläche (Abschnitt)', value: aSegment, formattedValue: formatNumber(aSegment, 2) + ' cm²' },
    { id: 'chordLength', label: 'Sehnenlänge (s)', value: s, formattedValue: formatNumber(s, 2) + ' cm' },
  ],
  summaryText: 'Bei Radius ' + r + ' cm und Winkel ' + alpha + '° beträgt die Bogenlänge ' + formatNumber(b, 2) + ' cm, die Sektorfläche ' + formatNumber(aSektor, 2) + ' cm² und das Kreissegment ' + formatNumber(aSegment, 2) + ' cm².',
};`,
    formula: 'b = (α / 180°) × π × r; A_Sektor = (α / 360°) × π × r²; s = 2r × sin(α/2); A_Segment = A_Sektor - A_Dreieck',
    formulaExplanation: 'Ein Kreissektor entspricht einem Kuchenstück vom Mittelpunkt bis zum Rand. Ein Kreissegment entsteht, wenn man die beiden Endpunkte des Bogens durch eine gerade Sehne verbindet.',
    workedExample: {
      title: 'Beispiel: r = 10 cm, Winkel α = 60° (gleichseitiges Dreieck)',
      inputValues: [{ label: 'Radius', value: '10 cm' }, { label: 'Winkel', value: '60°' }],
      steps: ['Bogenlänge b = (60 / 180) × π × 10 = (1/3) × 31,42 = 10,47 cm', 'Sektor A = (60 / 360) × π × 100 = 52,36 cm²', 'Sehne s = 2 × 10 × sin(30°) = 20 × 0,5 = 10,00 cm', 'Segment = 52,36 - (0,5 × 100 × sin(60°)) = 52,36 - 43,30 = 9,06 cm²'],
      result: 'b = 10,47 cm, Sektor = 52,36 cm², Segment = 9,06 cm²',
    },
    faqs: [
      { question: 'Was ist der Unterschied zwischen Sektor und Segment?', answer: 'Der Sektor wird vom Kreisbogen und zwei Radien begrenzt (wie ein Stück Pizza). Das Segment wird vom Kreisbogen und der geraden Sehne begrenzt (wie die abgeschnittene Kappe eines Kreises).' },
      { question: 'Wie berechnet man den Bogen im Bogenmaß (Radiant)?', answer: 'Im Bogenmaß gilt einfach b = r · φ (Winkel im Radiant). Es ist keine Umrechnung über 180° oder Pi nötig.' },
    ],
    relatedSlugs: ['kreis-umfang-rechner', 'kreisrechner', 'dreieck-flaeche-rechner'],
  },

  {
    id: 'bogenmass-grad-rechner',
    slug: 'bogenmass-grad-rechner',
    name: 'Winkelumrechner (Grad, Bogenmaß Radiant & Neugrad Gon)',
    shortName: 'Winkelumrechner',
    category: 'geometrie',
    subcategory: 'Ebene Figuren',
    metaTitle: 'Winkelumrechner – Grad [°], Bogenmaß [rad] & Neugrad [gon] umrechnen',
    metaDescription: 'Rechnen Sie Winkel sekundenschnell um zwischen Altgrad (0°-360°), Bogenmaß Radiant (0-2π rad) und Neugrad Gon (0-400 gon) inklusive Sinus- und Kosinus-Werten.',
    h1: 'Winkelumrechner – Grad, Radiant & Gon präzise umrechnen',
    shortDescription: 'Konvertiert Winkel zwischen Grad (°), Radiant (rad) und Neugrad (gon).',
    searchKeywords: ['winkel umrechnen grad rad radiant', 'bogenmass in grad umrechnen pi', 'neugrad gon grad rechner', 'sinus kosinus winkel berechnen'],
    inputs: [
      { id: 'angleVal', label: 'Winkelwert', type: 'number', defaultValue: 180, min: -3600, max: 3600, step: 1, unit: 'Winkel' },
      {
        id: 'unit',
        label: 'Eingegebene Einheit',
        type: 'select',
        defaultValue: 'deg',
        options: [
          { value: 'deg', label: 'Altgrad / Grad (360° Vollkreis)' },
          { value: 'rad', label: 'Bogenmaß / Radiant (2π rad Vollkreis)' },
          { value: 'gon', label: 'Neugrad / Gon (400 gon Vollkreis)' },
        ],
      },
    ],
    calculateCode: `const val = Number(inputs.angleVal) || 0;
const unit = inputs.unit;

let deg = val;
if (unit === 'rad') deg = (val * 180) / Math.PI;
else if (unit === 'gon') deg = val * 0.9;

const rad = (deg * Math.PI) / 180;
const gon = deg / 0.9;
const sinVal = Math.sin(rad);
const cosVal = Math.cos(rad);

// Pi-Vielfaches:
const piMultiple = rad / Math.PI;

return {
  primary: { id: 'deg', label: 'Winkel in Altgrad (°)', value: deg, formattedValue: formatNumber(deg, 4) + '°', highlight: true },
  secondary: [
    { id: 'rad', label: 'Bogenmaß in Radiant (rad)', value: rad, formattedValue: formatNumber(rad, 4) + ' rad (' + formatNumber(piMultiple, 3) + ' · π)' },
    { id: 'gon', label: 'Neugrad in Gon (gon)', value: gon, formattedValue: formatNumber(gon, 4) + ' gon' },
    { id: 'trig', label: 'Trigonometrie (sin / cos)', value: 0, formattedValue: 'sin = ' + formatNumber(sinVal, 4) + ' | cos = ' + formatNumber(cosVal, 4) },
  ],
  summaryText: val + ' ' + unit.toUpperCase() + ' entsprechen genau ' + formatNumber(deg, 2) + ' Grad, ' + formatNumber(rad, 4) + ' Radiant (' + formatNumber(piMultiple, 2) + ' π) und ' + formatNumber(gon, 2) + ' Gon.',
};`,
    formula: 'rad = deg × (π / 180°); deg = rad × (180° / π); gon = deg / 0,9',
    formulaExplanation: 'Ein Vollkreis hat 360 Altgrad, 400 Gon (Neugrad) und 2π Radiant (ca. 6,283 rad). Radiant ist die offizielle SI-Einheit für ebene Winkel in der Mathematik.',
    workedExample: {
      title: 'Beispiel: 90 Grad (rechter Winkel)',
      inputValues: [{ label: 'Grad', value: '90°' }],
      steps: ['Radiant = 90 × (π / 180) = π / 2 ≈ 1,5708 rad', 'Gon = 90 / 0,9 = 100 gon'],
      result: '1,5708 rad = 100 gon',
    },
    faqs: [
      { question: 'Warum nutzt die höhere Mathematik das Bogenmaß?', answer: 'Im Bogenmaß entsprechen Ableitungen trigonometrischer Funktionen einfachen Ausdrücken ohne Umrechnungsfaktoren: d/dx sin(x) = cos(x) gilt exakt nur, wenn x im Radiant gemessen wird.' },
      { question: 'Wo wird Neugrad (Gon) verwendet?', answer: 'Neugrad wird vor allem im Vermessungswesen (Geodäsie) verwendet, da der rechte Winkel genau 100 Gon beträgt und Dezimalrechnungen stark vereinfacht.' },
    ],
    relatedSlugs: ['kreissegment-rechner', 'dreieck-flaeche-rechner', 'kreis-umfang-rechner'],
  },

  {
    id: 'satz-des-pythagoras-rechner',
    slug: 'satz-des-pythagoras-rechner',
    name: 'Satz des Pythagoras Rechner (a² + b² = c² & Kathetensatz)',
    shortName: 'Pythagoras Rechner',
    category: 'geometrie',
    subcategory: 'Ebene Figuren',
    metaTitle: 'Satz des Pythagoras Rechner – a² + b² = c² Katheten & Hypotenuse',
    metaDescription: 'Berechnen Sie Hypotenuse c oder Kathete a/b im rechtwinkligen Dreieck nach dem Satz des Pythagoras a² + b² = c² inklusive Höhen- und Kathetensatz.',
    h1: 'Satz des Pythagoras Rechner – a² + b² = c² sofort berechnen',
    shortDescription: 'Berechnet Hypotenuse oder Kathete im rechtwinkligen Dreieck.',
    searchKeywords: ['satz des pythagoras rechner formel', 'a2 plus b2 gleich c2 rechner', 'hypotenuse berechnen rechtwinkliges dreieck', 'kathete a b pythagoras formel'],
    inputs: [
      {
        id: 'calcMode',
        label: 'Gesuchte Seite',
        type: 'select',
        defaultValue: 'c',
        options: [
          { value: 'c', label: 'Hypotenuse c gesucht (Katheten a und b gegeben)' },
          { value: 'a', label: 'Kathete a gesucht (Kathete b und Hypotenuse c gegeben)' },
          { value: 'b', label: 'Kathete b gesucht (Kathete a und Hypotenuse c gegeben)' },
        ],
      },
      { id: 'val1', label: 'Erster gegebener Wert', type: 'number', defaultValue: 3, min: 0.1, max: 10000, step: 0.1, unit: 'cm' },
      { id: 'val2', label: 'Zweiter gegebener Wert', type: 'number', defaultValue: 4, min: 0.1, max: 10000, step: 0.1, unit: 'cm' },
    ],
    calculateCode: `const mode = inputs.calcMode;
const v1 = Number(inputs.val1) || 0;
const v2 = Number(inputs.val2) || 0;

let a = 0;
let b = 0;
let c = 0;

if (mode === 'c') {
  a = v1;
  b = v2;
  c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
} else if (mode === 'a') {
  b = v1;
  c = v2;
  a = c > b ? Math.sqrt(Math.pow(c, 2) - Math.pow(b, 2)) : 0;
} else {
  a = v1;
  c = v2;
  b = c > a ? Math.sqrt(Math.pow(c, 2) - Math.pow(a, 2)) : 0;
}

const area = 0.5 * a * b;
const perimeter = a + b + c;
// Höhe auf Hypotenuse c: h_c = (a * b) / c
const hc = c > 0 ? (a * b) / c : 0;

return {
  primary: { id: 'resultSide', label: mode === 'c' ? 'Hypotenuse c' : mode === 'a' ? 'Kathete a' : 'Kathete b', value: mode === 'c' ? c : mode === 'a' ? a : b, formattedValue: formatNumber(mode === 'c' ? c : mode === 'a' ? a : b, 2) + ' cm', highlight: true },
  secondary: [
    { id: 'area', label: 'Dreiecksfläche (A = 1/2 · a · b)', value: area, formattedValue: formatNumber(area, 2) + ' cm²' },
    { id: 'perimeter', label: 'Umfang (U = a + b + c)', value: perimeter, formattedValue: formatNumber(perimeter, 2) + ' cm' },
    { id: 'heightC', label: 'Höhe auf Hypotenuse (h_c)', value: hc, formattedValue: formatNumber(hc, 2) + ' cm' },
  ],
  summaryText: 'Im rechtwinkligen Dreieck mit Katheten ' + formatNumber(a, 2) + ' cm und ' + formatNumber(b, 2) + ' cm beträgt die Hypotenuse ' + formatNumber(c, 2) + ' cm (Fläche ' + formatNumber(area, 2) + ' cm²).',
};`,
    formula: 'c = √(a² + b²); a = √(c² - b²); b = √(c² - a²)',
    formulaExplanation: 'In jedem rechtwinkligen Dreieck ist die Summe der Flächeninhalte der beiden Kathetenquadrate gleich dem Flächeninhalt des Hypotenusenquadrats.',
    workedExample: {
      title: 'Beispiel: Klassisches pythagoreisches Tripel (3, 4, 5)',
      inputValues: [{ label: 'Kathete a', value: '3 cm' }, { label: 'Kathete b', value: '4 cm' }],
      steps: ['c² = 3² + 4² = 9 + 16 = 25', 'c = √25 = 5 cm'],
      result: 'c = 5 cm Hypotenuse',
    },
    faqs: [
      { question: 'Was sind pythagoreische Tripel?', answer: 'Das sind ganzzahlige Lösungen der Gleichung a² + b² = c². Bekannte Tripel sind (3, 4, 5), (5, 12, 13), (8, 15, 17) und (7, 24, 25) sowie deren Vielfache.' },
      { question: 'Gilt der Satz des Pythagoras auch bei stumpfwinkligen Dreiecken?', answer: 'Nein, der Satz des Pythagoras gilt streng nur bei Dreiecken mit genau einem 90°-Winkel. Für allgemeine Dreiecke gilt der verallgemeinerte Kosinussatz c² = a² + b² - 2ab·cos(γ).' },
    ],
    relatedSlugs: ['dreieck-flaeche-rechner', 'sinussatz-kosinussatz-rechner', 'rechteckrechner'],
  },

  {
    id: 'sinussatz-kosinussatz-rechner',
    slug: 'sinussatz-kosinussatz-rechner',
    name: 'Sinussatz & Kosinussatz Rechner (Allgemeines Dreieck lösen)',
    shortName: 'Sinus- & Kosinussatz',
    category: 'geometrie',
    subcategory: 'Ebene Figuren',
    metaTitle: 'Sinussatz & Kosinussatz Rechner – Dreiecksberechnung Seiten & Winkel',
    metaDescription: 'Lösen Sie beliebige Dreiecke mit dem Sinussatz (a/sin(α) = b/sin(β)) und Kosinussatz (c² = a² + b² - 2ab·cos(γ)) nach SSS, SWS, WSW oder SSW.',
    h1: 'Sinussatz & Kosinussatz Rechner – Allgemeines Dreieck berechnen',
    shortDescription: 'Berechnet Seiten und Winkel in beliebigen Dreiecken.',
    searchKeywords: ['sinussatz rechner dreieck a sin alpha', 'kosinussatz rechner c2 a2 b2', 'dreieck aufloesen sws sss', 'innenwinkel dreieck trigonometrie'],
    inputs: [
      { id: 'sideA', label: 'Seite a', type: 'number', defaultValue: 8, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'sideB', label: 'Seite b', type: 'number', defaultValue: 10, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'angleGamma', label: 'Eingeschlossener Winkel Gamma (γ)', type: 'number', defaultValue: 50, min: 1, max: 178, step: 1, unit: '°' },
    ],
    calculateCode: `const a = Number(inputs.sideA) || 0;
const b = Number(inputs.sideB) || 0;
const gammaDeg = Number(inputs.angleGamma) || 0;
const gammaRad = (gammaDeg * Math.PI) / 180;

// Kosinussatz: c = sqrt(a^2 + b^2 - 2ab * cos(gamma))
const c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) - (2 * a * b * Math.cos(gammaRad)));

// Winkel Alpha nach Kosinussatz: cos(alpha) = (b^2 + c^2 - a^2) / (2bc)
const cosAlpha = (Math.pow(b, 2) + Math.pow(c, 2) - Math.pow(a, 2)) / (2 * b * c);
const alphaRad = Math.acos(Math.max(-1, Math.min(1, cosAlpha)));
const alphaDeg = (alphaRad * 180) / Math.PI;

const betaDeg = 180 - gammaDeg - alphaDeg;

// Fläche A = 0.5 * a * b * sin(gamma)
const area = 0.5 * a * b * Math.sin(gammaRad);
const perimeter = a + b + c;

return {
  primary: { id: 'sideC', label: 'Dritte Seite c (Kosinussatz)', value: c, formattedValue: formatNumber(c, 2) + ' cm', highlight: true },
  secondary: [
    { id: 'angleAlpha', label: 'Winkel Alpha (α)', value: alphaDeg, formattedValue: formatNumber(alphaDeg, 1) + '°' },
    { id: 'angleBeta', label: 'Winkel Beta (β)', value: betaDeg, formattedValue: formatNumber(betaDeg, 1) + '°' },
    { id: 'area', label: 'Dreiecksfläche (A)', value: area, formattedValue: formatNumber(area, 2) + ' cm²' },
    { id: 'perimeter', label: 'Umfang (U)', value: perimeter, formattedValue: formatNumber(perimeter, 2) + ' cm' },
  ],
  summaryText: 'Aus a = ' + a + ' cm, b = ' + b + ' cm und γ = ' + gammaDeg + '° folgt c = ' + formatNumber(c, 2) + ' cm, α = ' + formatNumber(alphaDeg, 1) + '°, β = ' + formatNumber(betaDeg, 1) + '° (Fläche ' + formatNumber(area, 2) + ' cm²).',
};`,
    formula: 'c² = a² + b² - 2ab × cos(γ); a / sin(α) = b / sin(β) = c / sin(γ)',
    formulaExplanation: 'Der Kosinussatz ist die Verallgemeinerung des Satzes des Pythagoras für alle Dreiecke. Er kommt zum Einsatz, wenn zwei Seiten und der eingeschlossene Winkel bekannt sind.',
    workedExample: {
      title: 'Beispiel: a = 8 cm, b = 10 cm, γ = 50°',
      inputValues: [{ label: 'a', value: '8 cm' }, { label: 'b', value: '10 cm' }, { label: 'γ', value: '50°' }],
      steps: ['c² = 8² + 10² - 2 × 8 × 10 × cos(50°) = 64 + 100 - 160 × 0,6428 = 61,15', 'c = √61,15 ≈ 7,82 cm'],
      result: 'c = 7,82 cm',
    },
    faqs: [
      { question: 'Wann verwendet man den Sinussatz und wann den Kosinussatz?', answer: 'Den Kosinussatz verwendet man bei SSS (drei Seiten bekannt) und SWS (zwei Seiten und der eingeschlossene Winkel). Den Sinussatz verwendet man bei WSW (eine Seite und zwei Winkel) sowie SSW.' },
      { question: 'Was ist der mehrdeutige Fall beim Sinussatz?', answer: 'Wenn zwei Seiten und ein der kleineren Seite gegenüberliegender Winkel gegeben sind (Ssw), kann es zwei verschiedene Dreiecke (spitzwinklig oder stumpfwinklig) geben.' },
    ],
    relatedSlugs: ['satz-des-pythagoras-rechner', 'dreieck-flaeche-rechner', 'bogenmass-grad-rechner'],
  },

  {
    id: 'vektor-skalarprodukt-rechner',
    slug: 'vektor-skalarprodukt-rechner',
    name: 'Vektor Skalarprodukt Rechner (3D-Vektoren & Schnittwinkel)',
    shortName: 'Skalarprodukt Rechner',
    category: 'geometrie',
    subcategory: 'Vektorrechnung',
    metaTitle: 'Skalarprodukt Rechner – Vektoren 3D, Skalarprodukt & Winkel berechnen',
    metaDescription: 'Berechnen Sie das Skalarprodukt zweier 3D-Vektoren (a · b = ax·bx + ay·by + az·bz), deren Beträge (Längen) und den eingeschlossenen Schnittwinkel in Grad.',
    h1: 'Skalarprodukt Rechner – Skalarprodukt, Vektorbetrag & Schnittwinkel',
    shortDescription: 'Berechnet Skalarprodukt, Betrag und Schnittwinkel zweier 3D-Vektoren.',
    searchKeywords: ['skalarprodukt rechner 3d vektoren', 'vektor schnittwinkel berechnen cosinus', 'betrag vektor laenge sqrt ax2 ay2 az2', 'orthogonale vektoren skalarprodukt null'],
    inputs: [
      { id: 'ax', label: 'Vektor a_x', type: 'number', defaultValue: 2, min: -1000, max: 1000, step: 0.1, unit: '' },
      { id: 'ay', label: 'Vektor a_y', type: 'number', defaultValue: 3, min: -1000, max: 1000, step: 0.1, unit: '' },
      { id: 'az', label: 'Vektor a_z', type: 'number', defaultValue: -1, min: -1000, max: 1000, step: 0.1, unit: '' },
      { id: 'bx', label: 'Vektor b_x', type: 'number', defaultValue: 4, min: -1000, max: 1000, step: 0.1, unit: '' },
      { id: 'by', label: 'Vektor b_y', type: 'number', defaultValue: -2, min: -1000, max: 1000, step: 0.1, unit: '' },
      { id: 'bz', label: 'Vektor b_z', type: 'number', defaultValue: 2, min: -1000, max: 1000, step: 0.1, unit: '' },
    ],
    calculateCode: `const ax = Number(inputs.ax) || 0;
const ay = Number(inputs.ay) || 0;
const az = Number(inputs.az) || 0;
const bx = Number(inputs.bx) || 0;
const by = Number(inputs.by) || 0;
const bz = Number(inputs.bz) || 0;

// Skalarprodukt: a * b = ax*bx + ay*by + az*bz
const dotProduct = (ax * bx) + (ay * by) + (az * bz);

// Beträge:
const magA = Math.sqrt(Math.pow(ax, 2) + Math.pow(ay, 2) + Math.pow(az, 2));
const magB = Math.sqrt(Math.pow(bx, 2) + Math.pow(by, 2) + Math.pow(bz, 2));

// Winkel cos(phi) = (a * b) / (|a| * |b|)
let angleDeg = 0;
if (magA > 0 && magB > 0) {
  const cosPhi = Math.max(-1, Math.min(1, dotProduct / (magA * magB)));
  angleDeg = (Math.acos(cosPhi) * 180) / Math.PI;
}

const isOrthogonal = Math.abs(dotProduct) < 0.000001;

return {
  primary: { id: 'dotProduct', label: 'Skalarprodukt (a · b)', value: dotProduct, formattedValue: formatNumber(dotProduct, 2), highlight: true },
  secondary: [
    { id: 'angle', label: 'Schnittwinkel (φ)', value: angleDeg, formattedValue: formatNumber(angleDeg, 2) + '° (' + (isOrthogonal ? 'orthogonal / senkrecht!' : '') + ')' },
    { id: 'magA', label: 'Betrag / Länge |a|', value: magA, formattedValue: formatNumber(magA, 3) },
    { id: 'magB', label: 'Betrag / Länge |b|', value: magB, formattedValue: formatNumber(magB, 3) },
  ],
  summaryText: 'Das Skalarprodukt beträgt ' + formatNumber(dotProduct, 2) + '. Der Schnittwinkel zwischen Vektor a und b ist ' + formatNumber(angleDeg, 2) + '° (' + (isOrthogonal ? 'Vektoren stehen senkrecht aufeinander' : 'nicht orthogonal') + ').',
};`,
    formula: 'a · b = a_x b_x + a_y b_y + a_z b_z; cos(φ) = (a · b) / (|a| · |b|)',
    formulaExplanation: 'Ist das Skalarprodukt zweier von Null verschiedener Vektoren genau null (a · b = 0), so stehen die beiden Vektoren orthogonal (im 90°-Winkel) zueinander.',
    workedExample: {
      title: 'Beispiel: a = (2, 3, -1) und b = (4, -2, 2)',
      inputValues: [{ label: 'Vektor a', value: '(2, 3, -1)' }, { label: 'Vektor b', value: '(4, -2, 2)' }],
      steps: ['a · b = (2 × 4) + (3 × -2) + (-1 × 2) = 8 - 6 - 2 = 0', 'Da a · b = 0, ist cos(φ) = 0 -> φ = 90°'],
      result: 'Skalarprodukt = 0 (orthogonale Vektoren)',
    },
    faqs: [
      { question: 'Was ist der Unterschied zwischen Skalarprodukt und Kreuzprodukt?', answer: 'Das Skalarprodukt liefert eine einfache Zahl (einen Skalar). Das Kreuzprodukt (Vektorprodukt) liefert einen neuen Vektor, der senkrecht auf beiden Ausgangsvektoren steht.' },
      { question: 'Welche physikalische Bedeutung hat das Skalarprodukt?', answer: 'In der Physik entspricht mechanische Arbeit dem Skalarprodukt aus Kraft- und Wegvektor: W = F · s = |F| · |s| · cos(α).' },
    ],
    relatedSlugs: ['satz-des-pythagoras-rechner', 'sinussatz-kosinussatz-rechner', 'quader-volumen-rechner'],
  },

  {
    id: 'torus-volumen-rechner',
    slug: 'torus-volumen-rechner',
    name: 'Torus Rechner (Volumen & Oberfläche eines Kreisrings / Donuts)',
    shortName: 'Torus Rechner',
    category: 'geometrie',
    subcategory: 'Körper',
    metaTitle: 'Torus Rechner – Donut Volumen V = 2π²Rr² & Oberfläche berechnen',
    metaDescription: 'Berechnen Sie das Volumen eines Torus (V = 2 · π² · R · r²) und seine Oberfläche (O = 4 · π² · R · r) nach dem großen Ringradius R und dem kleinen Rohrradius r.',
    h1: 'Torus Rechner – Volumen & Oberfläche eines Rings ermitteln',
    shortDescription: 'Berechnet Volumen und Oberfläche eines Torus (Kreisrings/Donuts).',
    searchKeywords: ['torus rechner volumen formel 2 pi2 r r2', 'donut oberflaeche berechnen 4 pi2 r r', 'torus grosser kleiner radius', 'guldinsche regel torus'],
    inputs: [
      { id: 'majorRadiusR', label: 'Hauptradius Ringzentrum bis Rohrmitte (R)', type: 'number', defaultValue: 10, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'minorRadiusR', label: 'Querschnitts-Radius des Rohrs (r)', type: 'number', defaultValue: 3, min: 0.05, max: 500, step: 0.1, unit: 'cm' },
    ],
    calculateCode: `const R = Number(inputs.majorRadiusR) || 0;
const r = Math.min(Number(inputs.minorRadiusR) || 0, R); // r darf nicht größer als R sein

// Guldinsche Regel:
// Querschnittsfläche A = pi * r^2
// Schwerpunktlinie U = 2 * pi * R
// Volumen V = A * U = 2 * pi^2 * R * r^2
const v = 2 * Math.pow(Math.PI, 2) * R * Math.pow(r, 2);

// Oberfläche O = (2 * pi * r) * (2 * pi * R) = 4 * pi^2 * R * r
const o = 4 * Math.pow(Math.PI, 2) * R * r;

// Außendurchmesser D = 2 * (R + r)
const outerDiameter = 2 * (R + r);
// Innendurchmesser des Lochs d = 2 * (R - r)
const innerHoleDiameter = 2 * (R - r);

return {
  primary: { id: 'volume', label: 'Torusvolumen (V)', value: v, formattedValue: formatNumber(v, 2) + ' cm³ (' + formatNumber(v / 1000, 3) + ' l)', highlight: true },
  secondary: [
    { id: 'surface', label: 'Torusoberfläche (O)', value: o, formattedValue: formatNumber(o, 2) + ' cm²' },
    { id: 'outerDiameter', label: 'Gesamter Außendurchmesser', value: outerDiameter, formattedValue: formatNumber(outerDiameter, 2) + ' cm' },
    { id: 'innerHole', label: 'Durchmesser des Lochs innen', value: innerHoleDiameter, formattedValue: formatNumber(innerHoleDiameter, 2) + ' cm' },
  ],
  summaryText: 'Der Torus mit Ringradius R = ' + R + ' cm und Rohrradius r = ' + r + ' cm hat ein Volumen von ' + formatNumber(v, 2) + ' cm³ (' + formatNumber(v / 1000, 3) + ' Liter) und eine Oberfläche von ' + formatNumber(o, 2) + ' cm².',
};`,
    formula: 'V = 2π² × R × r²; O = 4π² × R × r (nach den Guldinschen Regeln)',
    formulaExplanation: 'Ein Torus entsteht durch Rotation eines Kreises mit Radius r um eine in der Kreisebene liegende Achse im Abstand R vom Kreismittelpunkt.',
    workedExample: {
      title: 'Beispiel: Donut mit R = 10 cm und r = 3 cm',
      inputValues: [{ label: 'R (Hauptradius)', value: '10 cm' }, { label: 'r (Rohrradius)', value: '3 cm' }],
      steps: ['V = 2 × π² × 10 × 3² = 180 × π² ≈ 1.776,53 cm³', 'O = 4 × π² × 10 × 3 = 120 × π² ≈ 1.184,35 cm²'],
      result: 'V = 1.776,53 cm³, O = 1.184,35 cm²',
    },
    faqs: [
      { question: 'Was sind die Guldinschen Regeln?', answer: 'Die Guldinschen Regeln (nach Paul Guldin) besagen, dass das Volumen eines Rotationskörpers gleich dem Produkt aus erzeugender Fläche und der Länge der Schwerpunktbahn ist: V = A · 2πR.' },
      { question: 'Was passiert, wenn r = R ist?', answer: 'Wenn r = R ist, berührt sich der Innenrand im Zentrum im Nullpunkt (Horn-Torus). Ist r > R, schneidet sich die Geometrie selbst (Spindeltorus).' },
    ],
    relatedSlugs: ['kugel-oberflaeche-rechner', 'zylinderrechner', 'hohlzylinder-rohr-rechner'],
  },

  {
    id: 'stumpf-kegel-rechner',
    slug: 'stumpf-kegel-rechner',
    name: 'Kegelstumpf Rechner (Volumen, Mantelfläche & Eimerinhalt)',
    shortName: 'Kegelstumpf Rechner',
    category: 'geometrie',
    subcategory: 'Körper',
    metaTitle: 'Kegelstumpf Rechner – Volumen V = 1/3πh(R²+Rr+r²) & Mantelfläche',
    metaDescription: 'Berechnen Sie das Volumen eines Kegelstumpfs (V = 1/3 · π · h · (R² + Rr + r²)), die Mantellinie m und die Mantelfläche M für Eimer, Schalen und Trichter.',
    h1: 'Kegelstumpf Rechner – Volumen & Mantelfläche berechnen',
    shortDescription: 'Berechnet Volumen, Mantelfläche und Mantellinie eines Kegelstumpfs.',
    searchKeywords: ['kegelstumpf rechner volumen formel', 'eimervolumen berechnen kegelstumpf', 'mantelflaeche kegelstumpf pi m r r', 'kegelstumpf hoehe radien'],
    inputs: [
      { id: 'radiusBottomR', label: 'Großer Radius unten/oben (R)', type: 'number', defaultValue: 12, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'radiusTopR', label: 'Kleiner Radius oben/unten (r)', type: 'number', defaultValue: 8, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'heightH', label: 'Höhe des Kegelstumpfs (h)', type: 'number', defaultValue: 15, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
    ],
    calculateCode: `const R = Number(inputs.radiusBottomR) || 0;
const r = Number(inputs.radiusTopR) || 0;
const h = Number(inputs.heightH) || 0;

// Volumen V = (1/3) * pi * h * (R^2 + R*r + r^2)
const v = (1 / 3) * Math.PI * h * (Math.pow(R, 2) + (R * r) + Math.pow(r, 2));

// Mantellinie m = sqrt(h^2 + (R - r)^2)
const m = Math.sqrt(Math.pow(h, 2) + Math.pow(R - r, 2));
// Mantelfläche M = pi * (R + r) * m
const mantle = Math.PI * (R + r) * m;
// Gesamtoberfläche (mit beiden Kreisböden): O = M + pi*R^2 + pi*r^2
const o = mantle + (Math.PI * Math.pow(R, 2)) + (Math.PI * Math.pow(r, 2));

return {
  primary: { id: 'volume', label: 'Volumen des Kegelstumpfs (V)', value: v, formattedValue: formatNumber(v, 2) + ' cm³ (' + formatNumber(v / 1000, 2) + ' Liter)', highlight: true },
  secondary: [
    { id: 'mantle', label: 'Mantelfläche (M)', value: mantle, formattedValue: formatNumber(mantle, 2) + ' cm²' },
    { id: 'surface', label: 'Gesamtoberfläche (inkl. beider Böden)', value: o, formattedValue: formatNumber(o, 2) + ' cm²' },
    { id: 'slantLine', label: 'Mantellinie / Seitenlinie (m)', value: m, formattedValue: formatNumber(m, 2) + ' cm' },
  ],
  summaryText: 'Der Kegelstumpf (R = ' + R + ' cm, r = ' + r + ' cm, h = ' + h + ' cm) fasst ca. ' + formatNumber(v / 1000, 2) + ' Liter (' + formatNumber(v, 1) + ' cm³) bei einer Mantelfläche von ' + formatNumber(mantle, 2) + ' cm².',
};`,
    formula: 'V = 1/3 × π × h × (R² + Rr + r²); m = √(h² + (R - r)²); M = π × (R + r) × m',
    formulaExplanation: 'Ein Kegelstumpf entsteht, wenn man von einem großen Kegel die obere Spitze durch einen parallel zur Grundfläche verlaufenden Schnitt abtrennt.',
    workedExample: {
      title: 'Beispiel: 10-Liter-Putzeimer mit R = 14 cm, r = 10 cm, h = 22 cm',
      inputValues: [{ label: 'R (oben)', value: '14 cm' }, { label: 'r (Boden)', value: '10 cm' }, { label: 'h', value: '22 cm' }],
      steps: ['V = 1/3 × π × 22 × (14² + 14×10 + 10²) = (22/3) × π × (196 + 140 + 100) = (22/3) × π × 436 ≈ 10.045 cm³', 'Entspricht ca. 10,05 Litern'],
      result: '10,05 Liter Eimerinhalt',
    },
    faqs: [
      { question: 'Wie misst man das Volumen eines Eimers am besten?', answer: 'Da Eimer meist Kegelstümpfe sind, messen Sie den Durchmesser oben, den Durchmesser am Boden (jeweils durch 2 für den Radius) und die senkrechte Eimerhöhe.' },
      { question: 'Was passiert, wenn R = r ist?', answer: 'Wenn oberer und unterer Radius identisch sind (R = r), wird der Kegelstumpf zu einem geraden Zylinder mit V = π · r² · h.' },
    ],
    relatedSlugs: ['kegel-volumen-rechner', 'zylinderrechner', 'kugel-oberflaeche-rechner'],
  },

  {
    id: 'dreiecks-hoehen-rechner',
    slug: 'dreiecks-hoehen-rechner',
    name: 'Dreiecks Höhen Rechner (Höhen h_a, h_b, h_c & Inkreisradius)',
    shortName: 'Dreiecks-Höhen Rechner',
    category: 'geometrie',
    subcategory: 'Ebene Figuren',
    metaTitle: 'Dreiecks Höhen Rechner – Höhen h_a, h_b, h_c & Inkreis berechnen',
    metaDescription: 'Berechnen Sie alle 3 Höhen eines Dreiecks (h_a, h_b, h_c), den Inkreisradius r und den Umkreisradius R aus den drei Seitenlängen a, b und c.',
    h1: 'Dreiecks Höhen Rechner – Alle 3 Höhen, Inkreis & Umkreis ermitteln',
    shortDescription: 'Berechnet alle 3 Höhen sowie Inkreis und Umkreis aus 3 Seiten.',
    searchKeywords: ['hoehen dreieck rechner ha hb hc', 'inkreisradius dreieck berechnen formel', 'umkreisradius dreieck 3 seiten', 'dreieckshoehen berechnen heron'],
    inputs: [
      { id: 'sideA', label: 'Seite a', type: 'number', defaultValue: 6, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'sideB', label: 'Seite b', type: 'number', defaultValue: 8, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
      { id: 'sideC', label: 'Seite c', type: 'number', defaultValue: 10, min: 0.1, max: 1000, step: 0.1, unit: 'cm' },
    ],
    calculateCode: `const a = Number(inputs.sideA) || 0;
const b = Number(inputs.sideB) || 0;
const c = Number(inputs.sideC) || 0;

// Halber Umfang s
const s = (a + b + c) / 2;
const radikand = s * (s - a) * (s - b) * (s - c);
const area = radikand > 0 ? Math.sqrt(radikand) : 0;

// Höhen: h_a = 2A / a, h_b = 2A / b, h_c = 2A / c
const ha = a > 0 ? (2 * area) / a : 0;
const hb = b > 0 ? (2 * area) / b : 0;
const hc = c > 0 ? (2 * area) / c : 0;

// Inkreisradius r = A / s
const inRadius = s > 0 ? area / s : 0;
// Umkreisradius R = (a * b * c) / (4 * A)
const circumRadius = area > 0 ? (a * b * c) / (4 * area) : 0;

return {
  primary: { id: 'heights', label: 'Höhe auf Seite c (h_c)', value: hc, formattedValue: formatNumber(hc, 2) + ' cm', highlight: true },
  secondary: [
    { id: 'ha', label: 'Höhe auf Seite a (h_a)', value: ha, formattedValue: formatNumber(ha, 2) + ' cm' },
    { id: 'hb', label: 'Höhe auf Seite b (h_b)', value: hb, formattedValue: formatNumber(hb, 2) + ' cm' },
    { id: 'inradius', label: 'Inkreisradius (r = A/s)', value: inRadius, formattedValue: formatNumber(inRadius, 2) + ' cm' },
    { id: 'circumradius', label: 'Umkreisradius (R = abc/4A)', value: circumRadius, formattedValue: formatNumber(circumRadius, 2) + ' cm' },
  ],
  summaryText: 'Für das Dreieck (6, 8, 10 cm) betragen die Höhen: h_a = ' + formatNumber(ha, 2) + ' cm, h_b = ' + formatNumber(hb, 2) + ' cm, h_c = ' + formatNumber(hc, 2) + ' cm (Inkreis r = ' + formatNumber(inRadius, 2) + ' cm).',
};`,
    formula: 'h_a = 2A / a; h_b = 2A / b; h_c = 2A / c; r_In = A / s; R_Um = abc / (4A)',
    formulaExplanation: 'Da die Dreiecksfläche A = 1/2 · a · h_a = 1/2 · b · h_b = 1/2 · c · h_c ist, verhalten sich die Höhen umgekehrt proportional zu den Seitenlängen.',
    workedExample: {
      title: 'Beispiel: Rechtwinkliges Dreieck a = 6 cm, b = 8 cm, c = 10 cm',
      inputValues: [{ label: 'a', value: '6 cm' }, { label: 'b', value: '8 cm' }, { label: 'c', value: '10 cm' }],
      steps: ['Fläche A = 1/2 × 6 × 8 = 24 cm²', 'h_a = 2 × 24 / 6 = 8 cm (= Kathete b)', 'h_b = 2 × 24 / 8 = 6 cm (= Kathete a)', 'h_c = 2 × 24 / 10 = 4,80 cm'],
      result: 'h_a = 8 cm, h_b = 6 cm, h_c = 4,80 cm',
    },
    faqs: [
      { question: 'Schneiden sich die drei Höhenlinien in einem Punkt?', answer: 'Ja, die drei Höhen (bzw. deren Verlängerungen) schneiden sich immer in genau einem Punkt, dem Höhenschnittpunkt H des Dreiecks.' },
      { question: 'Wo liegt der Höhenschnittpunkt bei einem stumpfwinkligen Dreieck?', answer: 'Bei einem stumpfwinkligen Dreieck liegt der Höhenschnittpunkt außerhalb des Dreiecks, da zwei Höhen außerhalb der Dreiecksfläche auf die verlängerten Seiten treffen.' },
    ],
    relatedSlugs: ['dreieck-flaeche-rechner', 'satz-des-pythagoras-rechner', 'sinussatz-kosinussatz-rechner'],
  },

  {
    id: 'goldener-schnitt-rechner',
    slug: 'goldener-schnitt-rechner',
    name: 'Goldener Schnitt Rechner (Major a, Minor b & Phi = 1,618)',
    shortName: 'Goldener Schnitt',
    category: 'geometrie',
    subcategory: 'Ebene Figuren',
    metaTitle: 'Goldener Schnitt Rechner – Major, Minor & Phi (Φ = 1,618) berechnen',
    metaDescription: 'Berechnen Sie die Streckenteilung nach dem Goldenen Schnitt: Gesamtlänge, Major (a = ca. 61,8 %) und Minor (b = ca. 38,2 %) mit der Zahl Phi Φ ≈ 1,6180339.',
    h1: 'Goldener Schnitt Rechner – Harmonische Proportionen & Teilung',
    shortDescription: 'Berechnet Major, Minor und Gesamtstrecke nach dem Goldenen Schnitt.',
    searchKeywords: ['goldener schnitt rechner formel phi', 'major minor berechnen 61 8 prozent', 'goldene proportion architektur kunst', 'goldener schnitt zahl phi 1 618'],
    inputs: [
      {
        id: 'calcMode',
        label: 'Gegebene Größe',
        type: 'select',
        defaultValue: 'total',
        options: [
          { value: 'total', label: 'Gesamtstrecke (a + b) gegeben' },
          { value: 'major', label: 'Längeres Teilstück Major (a) gegeben' },
          { value: 'minor', label: 'Kürzeres Teilstück Minor (b) gegeben' },
        ],
      },
      { id: 'inputLength', label: 'Länge / Maß', type: 'number', defaultValue: 100, min: 0.01, max: 100000, step: 0.1, unit: 'cm/px' },
    ],
    calculateCode: `const val = Number(inputs.inputLength) || 0;
const mode = inputs.calcMode;
const phi = (1 + Math.sqrt(5)) / 2; // ca. 1.6180339887...

let majorA = 0;
let minorB = 0;
let total = 0;

if (mode === 'total') {
  total = val;
  majorA = total / phi; // ca. 61.8 %
  minorB = total - majorA; // ca. 38.2 %
} else if (mode === 'major') {
  majorA = val;
  minorB = majorA / phi;
  total = majorA + minorB;
} else {
  minorB = val;
  majorA = minorB * phi;
  total = majorA + minorB;
}

return {
  primary: { id: 'major', label: 'Major (längerer Teil a ≈ 61,8 %)', value: majorA, formattedValue: formatNumber(majorA, 2), highlight: true },
  secondary: [
    { id: 'minor', label: 'Minor (kürzerer Teil b ≈ 38,2 %)', value: minorB, formattedValue: formatNumber(minorB, 2) },
    { id: 'total', label: 'Gesamtstrecke (a + b)', value: total, formattedValue: formatNumber(total, 2) },
    { id: 'ratio', label: 'Goldenes Verhältnis Φ', value: phi, formattedValue: '1 : ' + formatNumber(phi, 4) },
  ],
  summaryText: 'Bei einer Gesamtlänge von ' + formatNumber(total, 2) + ' teilt der Goldene Schnitt die Strecke in Major a = ' + formatNumber(majorA, 2) + ' (61,8 %) und Minor b = ' + formatNumber(minorB, 2) + ' (38,2 %).',
};`,
    formula: 'a / b = (a + b) / a = Φ = (1 + √5) / 2 ≈ 1,6180339887...',
    formulaExplanation: 'Zwei Teile stehen im Goldenen Schnitt zueinander, wenn sich der größere Teil zum kleineren Teil genauso verhält wie das Ganze zum größeren Teil.',
    workedExample: {
      title: 'Beispiel: Bildbreite 1000 Pixel im Goldenen Schnitt teilen',
      inputValues: [{ label: 'Gesamtbreite', value: '1.000 px' }],
      steps: ['Major a = 1.000 / 1,61803 = 618,03 px', 'Minor b = 1.000 - 618,03 = 381,97 px'],
      result: 'Major = 618 px, Minor = 382 px',
    },
    faqs: [
      { question: 'Wie hängen der Goldene Schnitt und die Fibonacci-Folge zusammen?', answer: 'Teilt man aufeinanderfolgende Fibonacci-Zahlen (1, 1, 2, 3, 5, 8, 13, 21, 34...), konvergiert das Verhältnis gegen Phi: 34/21 ≈ 1,619, 55/34 ≈ 1,6176, 89/55 ≈ 1,61818.' },
      { question: 'Wo begegnet uns der Goldene Schnitt in der Praxis?', answer: 'In der Fotografie (goldene Spirale / Drittelregel), in Webdesigns (Rasteraufteilung), im Kreditkartenformat (Verhältnis 85,6 mm zu 53,98 mm ≈ 1,586) und in der Natur (Sonnenblumenkerne).' },
    ],
    relatedSlugs: ['rechteckrechner', 'kreisrechner', 'dreieck-flaeche-rechner'],
  },
];

console.log('Building geometrie with', calcs.length, 'calculators');
fs.writeFileSync(path.join(__dirname, 'calcs-geometrie.json'), JSON.stringify(calcs, null, 2), 'utf8');
console.log('Saved calcs-geometrie.json');
