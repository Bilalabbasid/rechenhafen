import { CalculatorDefinition } from '@/types/calculator';
import {
  calculateCircle,
  calculateCylinder,
  calculateRectangle,
} from '@/lib/calculators/geometrie';
import { formatNumber } from '@/lib/formatters';

export const GEOMETRIE_CALCULATORS: CalculatorDefinition[] = [
  {
    id: 'kreisrechner',
    slug: 'kreisrechner',
    name: 'Kreisrechner (Fläche, Umfang, Durchmesser & Radius)',
    shortName: 'Kreis berechnen',
    category: 'geometrie',
    subcategory: '2D-Flächen & Umfang',
    metaTitle: 'Kreisrechner – Radius, Durchmesser, Fläche & Umfang',
    metaDescription: 'Berechnen Sie Radius, Durchmesser, Kreisfläche und Kreisumfang aus einem beliebigen bekannten Wert mit Formel und Rechenweg.',
    h1: 'Kreisrechner – Alle Kreiswerte aus einer Angabe berechnen',
    shortDescription: 'Ermittelt Radius, Durchmesser, Flächeninhalt und Kreisumfang aus einer einzigen beliebigen Eingabegröße mit Rechenweg.',
    searchKeywords: ['kreisrechner', 'kreisfläche berechnen', 'umfang kreis formel', 'kreis radius berechnen pi'],
    inputs: [
      { id: 'radius', label: 'Kreisradius (r) in cm', type: 'number', defaultValue: 6.0, min: 0.01, step: 0.1, unit: 'cm' },
    ],
    calculate: calculateCircle,
    formula: 'Fläche A = π × r² | Umfang U = 2 × π × r',
    formulaExplanation: 'Multiplikation des quadrierten Radius mit der mathematischen Konstante Pi (π ≈ 3,14159...).',
    workedExample: {
      title: 'Beispiel: Kreis mit Radius r = 6 cm',
      description: 'Fläche A = π × 36 ≈ 113,10 cm². Umfang U = 2 × π × 6 ≈ 37,70 cm.',
      inputs: { radius: 6.0 },
      resultSummary: 'A = 113,10 cm² | U = 37,70 cm',
    },
    content: {
      intro: 'Dieser Kreisrechner berechnet Flächeninhalt, Umfang, Durchmesser und Radius eines ebenen Kreises über die Kreiszahl Pi (pi ≈ 3,14159265).',
      details: 'Fundamentale Formeln: Fläche A = pi · r², Umfang U = 2 · pi · r = pi · d. Wird der Radius eines Kreises verdoppelt, vervierfacht sich dessen Flächeninhalt.',
    },
    faqs: [
      { question: 'Wie berechnet man den Radius, wenn nur die Fläche bekannt ist?', answer: 'Man teilt den Flächeninhalt durch Pi und zieht aus dem Zwischenergebnis die Quadratwurzel: r = Wurzel(A / pi).' },
      { question: 'Woher stammt die Kreiszahl Pi?', answer: 'Pi ist das konstante Verhältnis des Umfangs eines beliebigen Kreises zu seinem Durchmesser, eine irrationale und transzendente mathematische Konstante.' },
    ],
    relatedSlugs: ['goldener-schnitt-rechner', 'ellipse-flaeche-rechner', 'zylinderrechner', 'rechteckrechner', 'pythagoras-rechner'],
  },
  {
    id: 'zylinderrechner',
    slug: 'zylinderrechner',
    name: 'Zylinder-Rechner (Volumen, Oberfläche & Mantelfläche)',
    shortName: 'Zylinder berechnen',
    category: 'geometrie',
    subcategory: '3D-Körper & Volumen',
    metaTitle: 'Zylinder Rechner – Zylindervolumen & Oberfläche',
    metaDescription: 'Ermitteln Sie Volumen (in cm³ und Litern), Mantelfläche und Gesamtoberfläche eines Zylinders aus Radius und Höhe.',
    h1: 'Zylinder Rechner – Volumen & Oberfläche berechnen',
    shortDescription: 'Berechnet Volumen, Füllmenge in Litern und Oberfläche von Rundkörpern und Zylindern.',
    searchKeywords: ['zylinderrechner', 'zylindervolumen berechnen formel', 'oberfläche zylinder rechner', 'volumen zylinder liter'],
    inputs: [
      { id: 'radius', label: 'Radius der Grundfläche (r)', type: 'number', defaultValue: 5.0, min: 0.1, step: 0.1, unit: 'cm' },
      { id: 'height', label: 'Höhe des Zylinders (h)', type: 'number', defaultValue: 15.0, min: 0.1, step: 0.5, unit: 'cm' },
    ],
    calculate: calculateCylinder,
    formula: 'Volumen V = π × r² × h | Oberfläche O = 2πr² + 2πrh',
    formulaExplanation: 'Grundfläche (Kreis) mal Höhe ergibt das Volumen. Die Mantelfläche ist ein abgewickeltes Rechteck mit den Maßen (2πr) × h.',
    workedExample: {
      title: 'Beispiel: Zylinder mit r = 5 cm und h = 15 cm',
      description: 'Volumen: ca. 1.178,10 cm³ (1,18 Liter). Oberfläche: ca. 628,32 cm².',
      inputs: { radius: 5.0, height: 15.0 },
      resultSummary: 'V = 1,18 Liter',
    },
    content: {
      intro: 'Der Zylinderrechner ermittelt Rauminhalt (Volumen), Mantelfläche und gesamte Oberfläche gerader Kreiszylinder (Tanks, Rohre, Dosen).',
      details: 'Volumen V = pi · r² · h. Mantelfläche M = 2 · pi · r · h. Gesamtoberfläche O = 2 · pi · r² + 2 · pi · r · h. 1 Kubikdezimeter (dm³) Zylindervolumen entspricht exakt einem Liter Flüssigkeit.',
    },
    faqs: [
      { question: 'Wie berechnet man das Fassungsvermögen einer Regentonne in Litern?', answer: 'Messen Sie Innenradius r und Füllhöhe h in Dezimetern (dm): Das berechnete Volumen in dm³ entspricht direkt der Literzahl (z. B. r=3 dm, h=8 dm -> V ≈ 226 Liter).' },
      { question: 'Was ist ein gleichseitiger Zylinder?', answer: 'Ein Zylinder, dessen Höhe h exakt seinem Durchmesser d (h = 2r) entspricht; er besitzt das minimale Oberflächen-zu-Volumen-Verhältnis aller Kreiszylinder.' },
    ],
    relatedSlugs: ['stumpf-kegel-rechner', 'torus-volumen-rechner', 'prisma-volumen-rechner', 'kreisrechner', 'rechteckrechner', 'betonrechner'],
  },
  {
    id: 'rechteckrechner',
    slug: 'rechteckrechner',
    name: 'Rechteck-Rechner (Fläche, Umfang & Diagonale)',
    shortName: 'Rechteck berechnen',
    category: 'geometrie',
    subcategory: '2D-Flächen & Umfang',
    metaTitle: 'Rechteck Rechner – Flächeninhalt (A), Umfang (U) & Diagonale',
    metaDescription: 'Rechteckflächen online berechnen: Länge und Breite eingeben und sofort Fläche, Umfang und Diagonale ermitteln.',
    h1: 'Rechteck Rechner – Fläche & Diagonale berechnen',
    shortDescription: 'Berechnet Flächeninhalt, Umfang und Diagonale von Rechtecken und Quadraten mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['rechteckrechner', 'rechteck fläche berechnen', 'umfang rechteck formel', 'diagonale rechteck berechnen'],
    inputs: [
      { id: 'lengthA', label: 'Länge (Seite a)', type: 'number', defaultValue: 8.0, step: 0.1, unit: 'm' },
      { id: 'widthB', label: 'Breite (Seite b)', type: 'number', defaultValue: 4.5, step: 0.1, unit: 'm' },
    ],
    calculate: calculateRectangle,
    formula: 'Fläche A = a × b | Umfang U = 2 × (a + b) | Diagonale d = √(a² + b²)',
    formulaExplanation: 'Fläche ergibt sich aus dem Produkt beider Seiten. Die Diagonale folgt dem Satz des Pythagoras.',
    workedExample: {
      title: 'Beispiel: Rechteck 8m × 4,5m',
      description: 'Fläche: 36,00 m². Umfang: 25,00 m. Diagonale: ca. 9,18 m.',
      inputs: { lengthA: 8.0, widthB: 4.5 },
      resultSummary: 'A = 36,00 m²',
    },
    content: {
      intro: 'Dieser Rechteckrechner ermittelt Flächeninhalt, Umfang und die Diagonale (Satz des Pythagoras) rechtwinkliger Vierecke.',
      details: 'Fläche A = a · b; Umfang U = 2 · (a + b); Diagonale d = Wurzel(a² + b²). Das Rechteck mit dem größten Flächeninhalt bei gegebenem Umfang ist stets das regelmäßige Quadrat (a = b).',
    },
    faqs: [
      { question: 'Wie berechnet man die Diagonale eines 4 × 3 Meter großen Raumes?', answer: 'd = Wurzel(4² + 3²) = Wurzel(16 + 9) = Wurzel(25) = 5,00 Meter (klassisches 3-4-5-Dreieck zur Prüfung rechter Winkel auf Baustellen).' },
      { question: 'Wie rechnet man Quadratmeter in Hektar um?', answer: 'Ein Hektar umfasst genau 10.000 Quadratmeter (z. B. ein quadratisches Grundstück mit 100 × 100 Metern Seitenlänge).' },
    ],
    relatedSlugs: ['goldener-schnitt-rechner', 'kreisrechner', 'pythagoras-rechner', 'farbmengen-rechner', 'bodenbelag-rechner'],
  },
];
