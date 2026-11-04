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
    name: 'Kreisrechner (Umfang, Fläche, Radius & Durchmesser)',
    shortName: 'Kreis berechnen',
    category: 'geometrie',
    subcategory: '2D-Flächen & Umfang',
    metaTitle: 'Kreisrechner – Kreisumfang, Fläche, Radius & Durchmesser',
    metaDescription: 'Kreis kostenlos berechnen: Aus Radius, Durchmesser, Umfang oder Fläche ergeben sich alle anderen Werte – mit Formel U = 2πr = πd und Rechenweg.',
    h1: 'Kreisrechner – Kreisumfang, Fläche, Radius und Durchmesser berechnen',
    shortDescription: 'Starten Sie mit Radius, Durchmesser, Umfang oder Fläche – der Rechner ermittelt alle übrigen Kreiswerte samt Rechenweg, wahlweise in mm, cm, dm, m oder km.',
    searchKeywords: [
      'kreisrechner',
      'kreis berechnen',
      'kreisumfang berechnen',
      'kreisumfang rechner',
      'umfang kreis formel',
      'formel kreisumfang',
      'kreisfläche berechnen',
      'flächeninhalt kreis',
      'durchmesser aus umfang berechnen',
      'radius aus umfang berechnen',
      'radius aus fläche berechnen',
      'kreis radius berechnen pi',
      'umfang kreis durchmesser pi',
    ],
    inputs: [
      {
        id: 'givenType',
        label: 'Bekannt ist …',
        type: 'select',
        defaultValue: 'radius',
        options: [
          { value: 'radius', label: 'Radius r' },
          { value: 'diameter', label: 'Durchmesser d' },
          { value: 'circumference', label: 'Umfang U' },
          { value: 'area', label: 'Fläche A' },
        ],
      },
      {
        id: 'givenValue',
        label: 'Radius r',
        type: 'number',
        defaultValue: 5,
        min: 0,
        step: 0.1,
        conditionalLabels: [
          { condition: { field: 'givenType', value: 'radius' }, label: 'Radius r' },
          { condition: { field: 'givenType', value: 'diameter' }, label: 'Durchmesser d' },
          { condition: { field: 'givenType', value: 'circumference' }, label: 'Umfang U' },
          { condition: { field: 'givenType', value: 'area' }, label: 'Fläche A (Einheit zum Quadrat, z. B. cm²)' },
        ],
      },
      {
        id: 'unit',
        label: 'Längeneinheit',
        type: 'select',
        defaultValue: 'cm',
        options: [
          { value: 'mm', label: 'Millimeter (mm, Fläche in mm²)' },
          { value: 'cm', label: 'Zentimeter (cm, Fläche in cm²)' },
          { value: 'dm', label: 'Dezimeter (dm, Fläche in dm²)' },
          { value: 'm', label: 'Meter (m, Fläche in m²)' },
          { value: 'km', label: 'Kilometer (km, Fläche in km²)' },
        ],
      },
    ],
    calculate: calculateCircle,
    formula: 'Umfang U = 2 · π · r = π · d   |   Fläche A = π · r²   |   r = U / (2π) = √(A / π)',
    formulaExplanation: 'Die Kreiszahl π ≈ 3,14159 ist das Verhältnis von Umfang zu Durchmesser – bei jedem Kreis gleich. Deshalb genügt eine einzige Größe, um alle anderen zu berechnen: Der Rechner bestimmt zuerst den Radius und daraus Durchmesser, Umfang und Fläche.',
    workedExample: {
      title: 'Radius 5 cm: Umfang und Fläche',
      inputs: { givenType: 'radius', givenValue: 5, unit: 'cm' },
      steps: ['d = 2 · 5 cm = 10 cm', 'U = 2 · π · 5 cm ≈ 31,42 cm', 'A = π · 5² = π · 25 ≈ 78,54 cm²'],
      resultSummary: 'U ≈ 31,42 cm, A ≈ 78,54 cm²',
    },
    workedExamples: [
      {
        title: 'Radius 5 cm: Umfang und Fläche',
        description: 'Der Standardfall aus dem Matheunterricht: Der Radius ist gegeben.',
        inputs: { givenType: 'radius', givenValue: 5, unit: 'cm' },
        steps: ['d = 2 · 5 cm = 10 cm', 'U = 2 · π · 5 cm ≈ 31,42 cm', 'A = π · 5² = π · 25 ≈ 78,54 cm²'],
        resultSummary: 'U ≈ 31,42 cm, A ≈ 78,54 cm²',
      },
      {
        title: 'Kreisumfang aus dem Durchmesser: rundes Beet mit 4 m',
        description: 'Ein rundes Gartenbeet misst quer durch die Mitte 4 Meter. Wie viel Beeteinfassung wird gebraucht?',
        inputs: { givenType: 'diameter', givenValue: 4, unit: 'm' },
        steps: ['U = π · d', 'U = 3,14159 · 4 m ≈ 12,57 m', 'Fläche zum Vergleich: A = π · 2² ≈ 12,57 m²'],
        resultSummary: 'Sie brauchen rund 12,57 m Einfassung (plus etwas Verschnitt).',
      },
      {
        title: 'Durchmesser aus dem Umfang: Baumstamm mit 94,2 cm Umfang',
        description: 'Mit dem Maßband lässt sich der Umfang eines Stamms leicht messen, der Durchmesser nicht. Also rückwärts rechnen.',
        inputs: { givenType: 'circumference', givenValue: 94.2, unit: 'cm' },
        steps: ['d = U / π', 'd = 94,2 cm / 3,14159 ≈ 29,98 cm', 'r = d / 2 ≈ 14,99 cm'],
        resultSummary: 'Der Stamm ist knapp 30 cm dick.',
      },
      {
        title: 'Radius aus der Fläche: 50 m² Rasenkreis',
        description: 'Ein kreisrunder Rasen soll 50 m² groß werden. Wie lang muss die Schnur sein, mit der Sie den Kreis abstecken?',
        inputs: { givenType: 'area', givenValue: 50, unit: 'm' },
        steps: ['r = √(A / π)', 'r = √(50 / 3,14159) = √15,92 ≈ 3,99 m'],
        resultSummary: 'Die Schnur muss etwa 3,99 m lang sein.',
      },
    ],
    content: {
      intro: 'Mit diesem Kreisrechner berechnen Sie den Kreisumfang, die Kreisfläche, den Radius und den Durchmesser – egal, welche dieser vier Größen Sie kennen. Wählen Sie aus, was bekannt ist, geben Sie den Wert ein und Sie sehen sofort alle übrigen Werte samt Rechenweg. Die Einheit stellen Sie zwischen Millimeter und Kilometer um.',
      sections: [
        {
          title: 'Kreisumfang berechnen: U = 2 · π · r = π · d',
          content:
            'Der Umfang ist die Länge der Kreislinie. Bei jedem Kreis ist er gut dreimal so lang wie der Durchmesser – genauer π-mal so lang, mit π ≈ 3,14159. Daraus ergeben sich zwei gleichwertige Formeln:\n\n' +
            '- Mit dem Durchmesser: **U = π · d**\n' +
            '- Mit dem Radius: **U = 2 · π · r** (weil d = 2 · r)\n\n' +
            'Beispiel: Radius 5 cm → U = 2 · 3,14159 · 5 cm ≈ 31,42 cm. Ein Fahrradreifen mit 70 cm Durchmesser legt pro Umdrehung π · 70 cm ≈ 2,20 m zurück.',
        },
        {
          title: 'Kreisfläche berechnen: A = π · r²',
          content:
            'Für die Fläche quadrieren Sie zuerst den Radius und multiplizieren dann mit π: Bei r = 5 cm ist A = π · 25 ≈ 78,54 cm². Kennen Sie nur den Durchmesser, halbieren Sie ihn vorher – oder rechnen Sie A = π · d² / 4.\n\n' +
            'Weil der Radius im Quadrat steht, wächst die Fläche schneller als der Umfang: Doppelter Radius heißt doppelter Umfang, aber vierfache Fläche. Für Kreisausschnitte und -abschnitte gibt es den [Kreissegment-Rechner](/rechner/kreissegment-rechner/), für runde Körper den [Zylinder-Rechner](/rechner/zylinderrechner/) und den [Kugel-Rechner](/rechner/kugel-oberflaeche-rechner/).',
        },
        {
          title: 'Rückwärts rechnen: Radius aus Umfang oder Fläche',
          content:
            'Oft lässt sich der Umfang leichter messen als der Durchmesser, etwa bei Baumstämmen, Säulen oder Rohren. Dann stellen Sie die Formel um:\n\n' +
            '- Aus dem Umfang: **d = U / π** und **r = U / (2π)**\n' +
            '- Aus der Fläche: **r = √(A / π)**\n\n' +
            'Beispiel: Ein Stamm hat 94,2 cm Umfang. Dann ist d = 94,2 / 3,14159 ≈ 29,98 cm, also knapp 30 cm.',
        },
        {
          title: 'Worauf Sie achten sollten',
          content:
            '- **Radius und Durchmesser nicht verwechseln:** Setzen Sie in A = π · r² den Durchmesser ein, wird die Fläche viermal zu groß.\n' +
            '- **Einheiten:** Umfang, Radius und Durchmesser haben eine Längeneinheit (cm), die Fläche eine Flächeneinheit (cm²). 1 m² sind 10.000 cm² – zum Umrechnen hilft der [Flächen-Umrechner](/rechner/flaeche-umrechner/).\n' +
            '- **Genauigkeit von π:** Mit 3,14 statt dem genauen Wert weicht das Ergebnis um etwa 0,05 % ab. Für Hausaufgaben genügt das meist, der Rechner verwendet den genauen Wert.\n' +
            '- **Durchmesser richtig messen:** Er verläuft immer durch den Mittelpunkt. Messen Sie an mehreren Stellen und nehmen Sie den größten Wert.',
        },
      ],
    },
    faqs: [
      {
        question: 'Wie berechnet man den Umfang eines Kreises?',
        answer: 'Multiplizieren Sie den Durchmesser mit π: U = π · d. Kennen Sie den Radius, rechnen Sie U = 2 · π · r. Ein Kreis mit 10 cm Durchmesser hat also einen Umfang von etwa 31,42 cm.',
      },
      {
        question: 'Wie berechne ich den Durchmesser, wenn nur der Umfang bekannt ist?',
        answer: 'Teilen Sie den Umfang durch π: d = U / π. Bei 50 cm Umfang ist der Durchmesser 50 / 3,14159 ≈ 15,92 cm. Den Radius erhalten Sie, indem Sie den Durchmesser halbieren.',
      },
      {
        question: 'Wie berechnet man die Fläche eines Kreises?',
        answer: 'Mit A = π · r². Quadrieren Sie also zuerst den Radius und multiplizieren Sie das Ergebnis mit π. Bei r = 3 m ist die Fläche π · 9 ≈ 28,27 m².',
      },
      {
        question: 'Wie berechne ich den Radius aus der Fläche?',
        answer: 'Teilen Sie die Fläche durch π und ziehen Sie aus dem Ergebnis die Wurzel: r = √(A / π). Für eine Fläche von 100 cm² ergibt das √(100 / 3,14159) = √31,83 ≈ 5,64 cm.',
      },
      {
        question: 'Warum wird die Fläche viermal so groß, wenn man den Radius verdoppelt?',
        answer: 'Der Radius steht in der Flächenformel im Quadrat. Aus r wird 2r, aus r² also (2r)² = 4r². Der Umfang dagegen verdoppelt sich nur, weil r dort nicht quadriert wird.',
      },
      {
        question: 'Mit welchem Wert für π soll ich rechnen?',
        answer: 'In der Schule reicht meist π ≈ 3,14; genauer ist 3,14159. Der Rechner nutzt den vollen Wert, deshalb können sich Ihre Ergebnisse von Hand in der zweiten Nachkommastelle leicht unterscheiden. Steht in der Aufgabe kein Wert, verwenden Sie am besten die π-Taste des Taschenrechners.',
      },
    ],
    relatedSlugs: ['zylinderrechner', 'kreissegment-rechner', 'kugel-oberflaeche-rechner', 'dreieckrechner', 'rechteckrechner', 'flaeche-umrechner'],
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
