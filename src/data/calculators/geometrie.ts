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
    metaTitle: 'Kreisrechner – Kreisfläche (A), Umfang (U) & Durchmesser berechnen',
    metaDescription: 'Berechnen Sie Fläche und Umfang eines Kreises aus Radius oder Durchmesser. Formeln, Rechenweg & exakte Kreiszahl Pi (π).',
    h1: 'Kreisrechner – Flächeninhalt & Umfang online berechnen',
    shortDescription: 'Ermittelt Kreisfläche, Umfang und Durchmesser aus dem Radius.',
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
      intro: 'Berechnen Sie alle geometrischen Eigenschaften eines Kreises blitzschnell aus dem Radius.',
      details: 'Als Grundform der Geometrie findet die Kreisberechnung in Technik, Handwerk und Alltag ständige Anwendung.',
    },
    faqs: [
      { question: 'Wie hängen Radius und Durchmesser zusammen?', answer: 'Der Durchmesser d ist exakt doppelt so lang wie der Radius r (d = 2 · r).' },
    ],
    relatedSlugs: ['zylinderrechner', 'rechteckrechner', 'pythagoras-rechner'],
  },
  {
    id: 'zylinderrechner',
    slug: 'zylinderrechner',
    name: 'Zylinder-Rechner (Volumen, Oberfläche & Mantelfläche)',
    shortName: 'Zylinder berechnen',
    category: 'geometrie',
    subcategory: '3D-Körper & Volumen',
    metaTitle: 'Zylinder Rechner – Zylindervolumen & Oberfläche online berechnen',
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
      intro: 'Ob Getränkedose, Regentonne, Silo oder Rohrleitung: Der Zylinder ist einer der gebräuchlichsten 3D-Körper in Industrie und Haushalt.',
      details: 'Der Rechner gibt das Volumen sowohl in Kubikzentimetern als auch direkt in Litern an.',
    },
    faqs: [
      { question: 'Wie rechne ich cm³ in Liter um?', answer: '1.000 cm³ (Kubikzentimeter) entsprechen genau 1 Liter (1 dm³).' },
    ],
    relatedSlugs: ['kreisrechner', 'rechteckrechner', 'betonrechner'],
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
    shortDescription: 'Berechnet Flächeninhalt, Umfang und Diagonale von Rechtecken und Quadraten.',
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
      intro: 'Die Rechteckberechnung ist die Grundlage für jede Raum-, Grundstücks- und Materialplanung.',
      details: 'Mit diesem Rechner erfahren Sie sofort die Quadratmeterzahl und die exakte Eck-zu-Eck-Diagonale.',
    },
    faqs: [
      { question: 'Ist jedes Quadrat ein Rechteck?', answer: 'Ja, jedes Quadrat ist ein spezielles Rechteck, bei dem alle vier Seiten exakt gleich lang sind (a = b).' },
    ],
    relatedSlugs: ['kreisrechner', 'pythagoras-rechner', 'farbmengen-rechner', 'bodenbelag-rechner'],
  },
];
