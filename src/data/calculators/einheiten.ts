import { CalculatorDefinition } from '@/types/calculator';
import {
  calculateLengthConversion,
  calculateMilesKmConversion,
  calculateTemperatureConversion,
} from '@/lib/calculators/einheiten';

export const EINHEITEN_CALCULATORS: CalculatorDefinition[] = [
  {
    id: 'laengen-umrechner',
    slug: 'laengen-umrechner',
    name: 'Längenumrechner (Meter, Zoll, Fuß, Meilen)',
    shortName: 'Längenumrechner',
    category: 'einheiten',
    subcategory: 'Länge & Distanz',
    metaTitle: 'Längenumrechner: Meter, Zentimeter, Zoll, Fuß & Meilen',
    metaDescription: 'Längen kostenlos umrechnen: Meter, Zentimeter, Kilometer, Zoll, Fuß, Yard, Meilen und Seemeilen – mit exakten Faktoren und Tabelle.',
    h1: 'Längenumrechner: Meter, Zoll, Fuß und Meilen umrechnen',
    shortDescription: 'Wandelt Längenmaße zwischen metrischem und imperialem Maßsystem um.',
    searchKeywords: ['längenumrechner', 'zoll in cm umrechnen', 'inch in cm rechner', 'fuß in meter', 'meilen in km', 'km in meilen', 'meilen km umrechner', 'seemeilen umrechnen'],
    inputs: [
      { id: 'value', unitFromField: { field: 'fromUnit', units: {"in": "in", "cm": "cm", "m": "m", "ft": "ft", "km": "km", "mi": "mi", "nm": "NM", "mm": "mm", "yd": "yd"} }, label: 'Eingabewert', type: 'number', defaultValue: 1, step: 0.1 },
      {
        id: 'fromUnit',
        label: 'Ausgangseinheit (Von)',
        type: 'select',
        defaultValue: 'in',
        options: [
          { value: 'in', label: 'Zoll / Inch (in)' },
          { value: 'cm', label: 'Zentimeter (cm)' },
          { value: 'm', label: 'Meter (m)' },
          { value: 'ft', label: 'Fuß (ft)' },
          { value: 'km', label: 'Kilometer (km)' },
          { value: 'mi', label: 'Meilen (mi)' },
          { value: 'nm', label: 'Seemeilen (NM)' },
          { value: 'mm', label: 'Millimeter (mm)' },
          { value: 'yd', label: 'Yard (yd)' },
        ],
      },
      {
        id: 'toUnit',
        label: 'Zieleinheit (Nach)',
        type: 'select',
        defaultValue: 'cm',
        options: [
          { value: 'cm', label: 'Zentimeter (cm)' },
          { value: 'in', label: 'Zoll / Inch (in)' },
          { value: 'm', label: 'Meter (m)' },
          { value: 'ft', label: 'Fuß (ft)' },
          { value: 'km', label: 'Kilometer (km)' },
          { value: 'mi', label: 'Meilen (mi)' },
          { value: 'nm', label: 'Seemeilen (NM)' },
          { value: 'mm', label: 'Millimeter (mm)' },
          { value: 'yd', label: 'Yard (yd)' },
        ],
      },
    ],
    calculate: calculateLengthConversion,
    formula: 'Zielwert = Wert × (Umrechnungsfaktor_Quelle / Umrechnungsfaktor_Ziel)',
    formulaExplanation: 'Exakte NIST-Bezugswerte zur Basiseinheit Meter (m): 1 Zoll = exakt 0,0254 m (2,54 cm) | 1 Fuß = exakt 0,3048 m | 1 Yard = exakt 0,9144 m | 1 Meile = exakt 1.609,344 m | 1 Seemeile = exakt 1.852 m.',
    workedExample: {
      title: 'Beispiel: 55 Zoll (TV-Bildschirmdiagonale)',
      description: '55 in × 2,54 = 139,70 cm.',
      inputs: { value: 55, fromUnit: 'in', toUnit: 'cm' },
      resultSummary: '139,70 cm',
      },
    workedExamples: [
      {
        title: 'Beispiel: 55 Zoll (TV-Bildschirmdiagonale)',
        description: '55 in × 2,54 = 139,70 cm.',
        inputs: { value: 55, fromUnit: 'in', toUnit: 'cm' },
        resultSummary: '139,70 cm',
      },
      {
        title: 'Beispiel: Marathon in Meilen und Kilometern',
        description: 'Ein Marathon ist 26,2 Meilen lang: 26,2 × 1,609344 = 42,16 km.',
        inputs: { value: 26.2, fromUnit: 'mi', toUnit: 'km' },
        resultSummary: '42,16 km',
      },
    ],
    quickReference: [
      {
        title: 'Wichtige Umrechnungsfaktoren auf einen Blick',
        content: `| Von | Nach | Exakter Faktor |
|---|---|---|
| **1 Zoll / Inch (in)** | Zentimeter (cm) | 2,54 cm |
| **1 Zentimeter (cm)** | Zoll / Inch (in) | ≈ 0,393701 in |
| **1 Fuß / Foot (ft)** | Meter (m) | 0,3048 m (30,48 cm) |
| **1 Yard (yd)** | Meter (m) | 0,9144 m |
| **1 Meile (mi)** | Kilometer (km) | 1,609344 km |
| **1 Kilometer (km)** | Meilen (mi) | ≈ 0,621371 mi |
| **1 Seemeile (NM)** | Kilometer (km) | 1,852 km |`,
      },
    ],
    content: {
      intro: 'Dieser Längenkonverter rechnet Längenmaße zwischen dem metrischen SI-System (Millimeter, Zentimeter, Meter, Kilometer) und dem angloamerikanischen Maßsystem (Inch, Fuß, Yard, Meile, Seemeile) um.',
      details: 'Die offizielle völkerrechtliche Definition nach NIST lautet seit dem internationalen Abkommen von 1959: 1 Inch (Zoll) = exakt 25,4 Millimeter. 1 Fuß (Foot) = 12 Zoll = 30,48 cm. 1 Yard = 3 Fuß = 91,44 cm. 1 Landmeile = 1.609,344 Meter. Für nautische und maritime Berechnungen gilt: 1 Seemeile = exakt 1.852 Meter.',
    },
    faqs: [
      { question: 'Wie viele Kilometer sind eine Meile?', answer: 'Eine Landmeile (Statute Mile) entspricht genau 1,609344 Kilometern. Umgekehrt ist ein Kilometer rund 0,621 Meilen. 100 km/h sind also etwa 62 mph.' },
      { question: 'Wie lang ist eine Seemeile (Nautische Meile NM)?', answer: 'Eine Seemeile ist völkerrechtlich auf exakt 1.852 Meter definiert; sie entsprach ursprünglich einer Bogenminute (1/60 Grad) auf einem Meridian der Erdkugel.' },
      { question: 'Sind Zoll und Inch dasselbe Maß?', answer: 'Ja. „Inch“ ist die englische Bezeichnung und „Zoll“ die traditionelle deutsche Übersetzung für dieselbe Längeneinheit (Einheitenzeichen in oder \"). 1 Zoll entspricht exakt 2,54 cm.' },
      { question: 'Wie rechnet man Kilometer in Meilen um?', answer: 'Teilen Sie die Kilometer durch 1,609344 oder multiplizieren Sie mit ca. 0,621371. Beispiel: 100 km ÷ 1,609344 ≈ 62,14 Meilen.' },
      { question: 'Wie rechne ich Fuß in Meter um?', answer: '1 Fuß (Foot) entspricht exakt 0,3048 Metern (30,48 cm). 6 Fuß Körpergröße entsprechen somit 6 × 0,3048 = 1,8288 Metern (ca. 1,83 m).' },
    ],
    relatedSlugs: ['zoll-in-cm-rechner', 'meilen-km-umrechner', 'geschwindigkeit-umrechner', 'temperatur-umrechner', 'gewicht-masse-umrechner', 'schuhe-kleidergroessen-umrechner'],
  },
  {
    id: 'meilen-km-umrechner',
    slug: 'meilen-km-umrechner',
    name: 'Meilen-km-Umrechner (Meilen ↔ Kilometer)',
    shortName: 'Meilen-km-Umrechner',
    category: 'einheiten',
    subcategory: 'Länge & Distanz',
    metaTitle: 'Meilen in km Rechner: Meilen ↔ Kilometer umrechnen',
    metaDescription: 'Meilen und Kilometer sofort umrechnen. 1 Meile = exakt 1,609344 km. Mit km-in-Meilen-Umrechnung, Formel und Tabelle für Reisen, Sport und Strecken.',
    h1: 'Meilen in Kilometer umrechnen – km ↔ Meilen',
    shortDescription: 'Rechnet Meilen (mi) und Kilometer (km) bidirektional und synchronisiert um mit exakter NIST-Definition, Vergleichstabelle für Sport & Reisen sowie Seemeilen-Abgrenzung.',
    searchKeywords: [
      'meilen in km',
      'meilen km',
      'meilen in kilometer',
      'mile in km',
      'miles in km',
      'km in meilen',
      'kilometer in meilen',
      'km to miles',
      'miles to km',
      'meilen umrechnen'
    ],
    inputs: [
      {
        id: 'miles',
        label: 'Meilen (mi)',
        type: 'number',
        defaultValue: 10,
        min: 0,
        step: 0.5,
        unit: 'mi',
      },
      {
        id: 'km',
        label: 'Kilometer (km)',
        type: 'number',
        defaultValue: 16.09344,
        min: 0,
        step: 0.5,
        unit: 'km',
      },
    ],
    calculate: calculateMilesKmConversion,
    formula: 'km = Meilen × 1,609344 | Meilen = km ÷ 1,609344',
    formulaExplanation: '1 internationale Landmeile (Statute Mile) ist seit 1959 völkerrechtlich und nach NIST auf exakt 1.609,344 Meter (1,609344 km) festgelegt. 1 Kilometer entspricht ca. 0,6213711922 Meilen.',
    workedExample: {
      title: 'Beispiel: 10 Meilen auf dem Highway umrechnen',
      inputValues: [
        { label: 'Distanz', value: '10 Meilen' },
      ],
      steps: [
        'Kilometer = 10 Meilen × 1,609344 km/Meile',
        'Ergebnis = 16,09344 km',
      ],
      result: '16,09344 km (ca. 16,1 km)',
    },
    quickReference: [
      {
        title: 'Vergleichstabelle: Meilen in Kilometer & Kilometer in Meilen',
        content: `| Meilen (mi) | Kilometer (km) | Distanz-Kontext |
|---|---|---|
| **1 mi** | 1,609344 km | 1 Meile Grundwert |
| **2 mi** | 3,218688 km | Kurzer Trainingslauf |
| **3 mi** | 4,828032 km | Ca. 5-km-Lauf (3,11 mi) |
| **5 mi** | 8,04672 km | 8 km Distanz |
| **10 mi** | 16,09344 km | Klassischer 10-Meilen-Lauf |
| **13,1 mi** | 21,08241 km | Halbmarathon-Äquivalent in Meilen |
| **26,2 mi** | 42,16481 km | Marathon-Näherung (offiziell 42,195 km ≈ 26,2188 mi) |
| **50 mi** | 80,4672 km | Ultramarathon-Distanz |
| **100 mi** | 160,9344 km | 100-Meilen-Rennen / US-Highway-Distanz |
| **500 mi** | 804,672 km | Langstrecke (z. B. Indianapolis 500) |

| Kilometer (km) | Meilen (mi) | Distanz-Kontext |
|---|---|---|
| **1 km** | ≈ 0,621371 mi | 1 Kilometer Grundwert |
| **5 km** | ≈ 3,106856 mi | 5-km-Volkslauf |
| **10 km** | ≈ 6,213712 mi | 10-km-Straßenlauf |
| **21,0975 km** | ≈ 13,10938 mi | Offizielle Halbmarathon-Distanz |
| **42,195 km** | ≈ 26,21876 mi | Offizielle Marathon-Distanz |
| **50 km** | ≈ 31,06856 mi | 50-km-Ultramarathon |
| **100 km** | ≈ 62,13712 mi | 100-km-Lauf |`,
      },
    ],
    content: {
      intro: 'Dieser Meilen-km-Rechner konvertiert Distanzen zwischen internationalen Landmeilen (Statute Miles) und Kilometern (km) bidirektional. Das Eintippen in ein beliebiges Feld aktualisiert sofort das andere.',
      details: 'Wichtiger Unterschied: Die hier berechnete internationale Meile (1 mi = 1,609344 km) ist die gebräuchliche Landmeile in den USA und Großbritannien. In der Schifffahrt und Luftfahrt wird hingegen die Seemeile (Nautical Mile, NM) verwendet, die exakt 1,852 km misst. Zur Umrechnung von Reisegeschwindigkeiten (mph in km/h) nutzen Sie bitte unseren Geschwindigkeits-Umrechner.',
    },
    faqs: [
      { question: 'Wie viele Kilometer sind 1 Meile?', answer: '1 Meile (Landmeile / Statute Mile) entspricht exakt 1,609344 Kilometern bzw. 1.609,344 Metern.' },
      { question: 'Wie viele Meilen sind 1 km?', answer: '1 Kilometer entspricht ca. 0,6213711922 Meilen (1 ÷ 1,609344).' },
      { question: 'Wie rechne ich Meilen im Kopf schnell in km um?', answer: 'Faustformel: Multiplizieren Sie die Meilenzahl mit 1,6 (oder addieren Sie zur Meilenzahl deren Hälfte und ein Zehntel). Beispiel: 50 Meilen → 50 + 25 + 5 = ca. 80 km (exakt 80,47 km).' },
      { question: 'Wie rechne ich km in Meilen um?', answer: 'Teilen Sie die Kilometer durch 1,609344 oder multiplizieren Sie mit ca. 0,62. Beispiel: 100 km ÷ 1,609344 ≈ 62,14 Meilen.' },
      { question: 'Was ist der Unterschied zwischen Meile und Seemeile?', answer: 'Die normale Landmeile (Statute Mile) ist exakt 1,609344 km lang. Die Seemeile (Nautische Meile NM) wird in der Schiff- und Luftfahrt verwendet und ist mit exakt 1,852 km rund 243 Meter länger.' },
      { question: 'Sind mph und Meilen dasselbe?', answer: 'Nein. Eine Meile (mi) ist eine Längen- bzw. Distanzeinheit (Strecke). „mph“ (miles per hour) ist eine Geschwindigkeitseinheit (Meilen pro Stunde). 60 mph entsprechen ca. 96,56 km/h.' },
    ],
    relatedSlugs: ['laengen-umrechner', 'zoll-in-cm-rechner', 'geschwindigkeit-umrechner', 'spritkostenrechner'],
  },
  {
    id: 'temperatur-umrechner',
    slug: 'temperatur-umrechner',
    name: 'Temperatur-Umrechner (Celsius, Fahrenheit & Kelvin)',
    shortName: 'Temperatur-Umrechner',
    category: 'einheiten',
    subcategory: 'Temperatur',
    metaTitle: 'Celsius in Fahrenheit umrechnen – Temperatur-Umrechner',
    metaDescription: 'Celsius in Fahrenheit, Fahrenheit in Celsius und Kelvin umrechnen: mit Formel, Rechenweg und den wichtigsten Werten für Körpertemperatur und Backofen.',
    h1: 'Temperatur-Umrechner: Celsius in Fahrenheit und Kelvin umrechnen',
    shortDescription: 'Rechnet Temperaturen zwischen Celsius, Fahrenheit und Kelvin um – mit Formel und typischen Werten.',
    searchKeywords: [
      'celsius in fahrenheit',
      'fahrenheit in celsius',
      'temperatur umrechnen',
      'temperatur umrechner',
      'grad celsius in fahrenheit',
      'fahrenheit celsius umrechnung',
      'fahrenheit in celsius formel',
      'celsius in kelvin',
      'kelvin in celsius',
    ],
    inputs: [
      { id: 'value', label: 'Temperaturwert', type: 'number', defaultValue: 25, step: 0.5 },
      {
        id: 'fromUnit',
        label: 'Ausgangsskala',
        type: 'select',
        defaultValue: 'C',
        options: [
          { value: 'C', label: 'Grad Celsius (°C)' },
          { value: 'F', label: 'Grad Fahrenheit (°F)' },
          { value: 'K', label: 'Kelvin (K)' },
        ],
      },
      {
        id: 'toUnit',
        label: 'Zielskala',
        type: 'select',
        defaultValue: 'F',
        options: [
          { value: 'F', label: 'Grad Fahrenheit (°F)' },
          { value: 'C', label: 'Grad Celsius (°C)' },
          { value: 'K', label: 'Kelvin (K)' },
        ],
      },
    ],
    calculate: calculateTemperatureConversion,
    formula: '°F = °C × 1,8 + 32   |   °C = (°F − 32) / 1,8   |   K = °C + 273,15',
    formulaExplanation: 'Anders als bei Länge oder Gewicht reicht bei Temperaturen kein einfacher Faktor: Celsius und Fahrenheit haben verschiedene Nullpunkte. Deshalb wird erst skaliert (× 1,8) und dann verschoben (+ 32). Kelvin hat dieselben Schritte wie Celsius, beginnt aber am absoluten Nullpunkt.',
    workedExample: {
      title: 'Beispiel: 25 °C (Zimmertemperatur) in Fahrenheit',
      description: '25 × 1,8 + 32 = 77 °F.',
      inputs: { value: 25, fromUnit: 'C', toUnit: 'F' },
      resultSummary: '77,00 °F',
    },
    workedExamples: [
      {
        title: 'Celsius in Fahrenheit: 25 °C',
        description: 'Zimmertemperatur in Fahrenheit umrechnen.',
        inputs: { value: 25, fromUnit: 'C', toUnit: 'F' },
        steps: ['°F = 25 × 1,8 + 32', '°F = 45 + 32', '°F = 77'],
        resultSummary: '25 °C sind 77 °F.',
      },
      {
        title: 'Fahrenheit in Celsius: Backofen auf 350 °F',
        description: 'Ein amerikanisches Rezept verlangt 350 °F.',
        inputs: { value: 350, fromUnit: 'F', toUnit: 'C' },
        steps: ['°C = (350 − 32) / 1,8', '°C = 318 / 1,8', '°C ≈ 176,67'],
        resultSummary: '350 °F sind rund 177 °C – stellen Sie den Ofen auf 175 bis 180 °C.',
      },
      {
        title: 'Celsius in Kelvin: 20 °C',
        description: 'Für Physik und Chemie wird in Kelvin gerechnet.',
        inputs: { value: 20, fromUnit: 'C', toUnit: 'K' },
        steps: ['K = 20 + 273,15', 'K = 293,15'],
        resultSummary: '20 °C sind 293,15 K.',
      },
    ],
    content: {
      intro: 'Mit diesem Temperatur-Umrechner rechnen Sie Grad Celsius (°C), Grad Fahrenheit (°F) und Kelvin (K) in beide Richtungen um. Typische Anlässe sind amerikanische Rezepte und Backofenangaben, Wetterberichte aus den USA, Fiebermessen mit Thermometern in Fahrenheit oder Aufgaben in Physik und Chemie.',
      sections: [
        {
          title: 'Celsius in Fahrenheit und zurück: die Formeln',
          content:
            '- **Celsius in Fahrenheit:** °F = °C × 1,8 + 32\n' +
            '- **Fahrenheit in Celsius:** °C = (°F − 32) / 1,8\n' +
            '- **Celsius in Kelvin:** K = °C + 273,15\n' +
            '- **Kelvin in Celsius:** °C = K − 273,15\n\n' +
            'Die Reihenfolge ist wichtig: Bei Fahrenheit in Celsius ziehen Sie zuerst 32 ab und teilen danach durch 1,8. Als Faustformel für den Kopf: Fahrenheit minus 30, dann halbieren. Aus 80 °F werden so etwa 25 °C (genau 26,7 °C).',
        },
        {
          title: 'Wichtige Werte auf einen Blick',
          content:
            '- 0 °C = 32 °F (Wasser gefriert)\n' +
            '- 20 °C = 68 °F (Raumtemperatur)\n' +
            '- 37 °C = 98,6 °F (normale Körpertemperatur)\n' +
            '- 38 °C = 100,4 °F (Fieber)\n' +
            '- 100 °C = 212 °F (Wasser kocht auf Meereshöhe)\n' +
            '- 180 °C = 356 °F (Backofen, Ober-/Unterhitze)\n' +
            '- 0 °F = −17,78 °C\n' +
            '- −273,15 °C = 0 K (absoluter Nullpunkt)',
        },
        {
          title: 'Warum Kelvin kein Gradzeichen hat',
          content:
            'Kelvin ist die SI-Basiseinheit der Temperatur und eine absolute Skala: 0 K ist der absolute Nullpunkt, kälter geht es nicht. Deshalb schreibt man 293,15 K und nicht „Grad Kelvin“. Ein Temperaturunterschied von 1 K ist genau so groß wie 1 °C. Werte unter 0 K gibt es nicht; der Rechner meldet dann einen Fehler.',
        },
      ],
    },
    faqs: [
      { question: 'Wie rechnet man Celsius in Fahrenheit um?', answer: 'Multiplizieren Sie die Celsius-Temperatur mit 1,8 und addieren Sie 32: °F = °C × 1,8 + 32. 30 °C sind also 30 × 1,8 + 32 = 86 °F.' },
      { question: 'Wie rechnet man Fahrenheit in Celsius um?', answer: 'Ziehen Sie 32 ab und teilen Sie durch 1,8: °C = (°F − 32) / 1,8. 100 °F sind (100 − 32) / 1,8 = 37,78 °C.' },
      { question: 'Wie viel Grad Celsius sind 350 Grad Fahrenheit im Backofen?', answer: '350 °F sind 176,67 °C. In deutschen Rezepten entspricht das 175 bis 180 °C Ober-/Unterhitze. 400 °F sind 204,44 °C, also etwa 200 °C.' },
      { question: 'Was ist die normale Körpertemperatur in Fahrenheit?', answer: '37 °C entsprechen 98,6 °F. Ab etwa 38 °C (100,4 °F) spricht man von Fieber.' },
      { question: 'Bei welcher Temperatur sind Celsius und Fahrenheit gleich?', answer: 'Bei −40 Grad: −40 °C sind genau −40 °F, denn −40 × 1,8 + 32 = −72 + 32 = −40.' },
      { question: 'Wie rechnet man Celsius in Kelvin um?', answer: 'Addieren Sie 273,15: K = °C + 273,15. 20 °C sind 293,15 K. Umgekehrt ziehen Sie 273,15 ab: 300 K sind 26,85 °C.' },
    ],
    relatedSlugs: ['backzeit-temperatur-umluft-oberhitze-rechner', 'fleisch-kerntemperatur-garzeit-rechner', 'laengen-umrechner', 'gewicht-masse-umrechner', 'geschwindigkeit-umrechner'],
  },
];
