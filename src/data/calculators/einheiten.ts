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
    metaDescription: 'Längeneinheiten sofort umrechnen: Meter, Zentimeter, Millimeter, Kilometer, Zoll (Inch), Fuß, Yard, Meilen und Seemeilen nach exakten NIST-Normen.',
    h1: 'Längenumrechner – Maßeinheiten präzise umrechnen',
    shortDescription: 'Wandelt Längenmaße zwischen metrischem und imperialem Maßsystem um mit präziser Formelberechnung, Einheiten-Tausch und allen Ergebnissen auf einen Blick.',
    searchKeywords: ['längenumrechner', 'zoll in cm umrechnen', 'inch in cm rechner', 'fuß in meter', 'meilen in km', 'seemeilen umrechnen'],
    inputs: [
      { id: 'value', label: 'Eingabewert', type: 'number', defaultValue: 1, step: 0.1 },
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
      { question: 'Wie lang ist eine Seemeile (Nautische Meile NM)?', answer: 'Eine Seemeile ist völkerrechtlich auf exakt 1.852 Meter definiert; sie entsprach ursprünglich einer Bogenminute (1/60 Grad) auf einem Meridian der Erdkugel.' },
      { question: 'Sind Zoll und Inch dasselbe Maß?', answer: 'Ja. „Inch“ ist die englische Bezeichnung und „Zoll“ die traditionelle deutsche Übersetzung für dieselbe Längeneinheit (Einheitenzeichen in oder \"). 1 Zoll entspricht exakt 2,54 cm.' },
      { question: 'Wie rechnet man Kilometer in Meilen um?', answer: 'Teilen Sie die Kilometer durch 1,609344 oder multiplizieren Sie mit ca. 0,621371. Beispiel: 100 km ÷ 1,609344 ≈ 62,14 Meilen.' },
      { question: 'Wie rechne ich Fuß in Meter um?', answer: '1 Fuß (Foot) entspricht exakt 0,3048 Metern (30,48 cm). 6 Fuß Körpergröße entsprechen somit 6 × 0,3048 = 1,8288 Metern (ca. 1,83 m).' },
    ],
    relatedSlugs: ['zoll-in-cm-rechner', 'meilen-km-umrechner', 'geschwindigkeit-umrechner', 'temperatur-umrechner', 'gewicht-masse-umrechner'],
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
    metaTitle: 'Temperatur-Umrechner – Celsius, Fahrenheit',
    metaDescription: 'Rechnen Sie Temperaturen zwischen Grad Celsius, Fahrenheit und Kelvin um. Inklusive Umrechnungsformeln und Siedepunkten.',
    h1: 'Temperatur-Umrechner (°C, °F & Kelvin)',
    shortDescription: 'Wandelt Temperaturwerte zwischen Celsius, Fahrenheit und Kelvin um mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['temperatur umrechner', 'celsius in fahrenheit rechner', 'fahrenheit in celsius formel', 'kelvin umrechnen'],
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
    formula: '°F = °C × 1,8 + 32 | °C = (°F - 32) / 1,8 | K = °C + 273,15',
    formulaExplanation: 'Im Gegensatz zu anderen Maßeinheiten erfordert die Temperaturumrechnung neben einer Skalierung auch eine Nullpunktverschiebung (Offset 32 bzw. 273,15).',
    workedExample: {
      title: 'Beispiel: 25 °C (Zimmertemperatur)',
      description: '25 × 1,8 + 32 = 77,00 °F.',
      inputs: { value: 25, fromUnit: 'C', toUnit: 'F' },
      resultSummary: '77,00 °F',
    },
    content: {
      intro: 'Dieser Temperaturrechner transformiert Werte exakt zwischen Grad Celsius (°C), Fahrenheit (°F) und der thermodynamischen Basiseinheit Kelvin (K).',
      details: 'Formeln: Fahrenheit = (Celsius · 1,8) + 32; Celsius = (Fahrenheit - 32) / 1,8; Kelvin = Celsius + 273,15. Am absoluten Nullpunkt bei 0 Kelvin (-273,15 °C) stoppt jede thermische Teilchenbewegung.',
    },
    faqs: [
      { question: 'Bei welcher Temperatur sind Celsius und Fahrenheit zahlenmäßig identisch?', answer: 'Bei exakt -40 Grad: -40 °C entspricht genau -40 °F, da (-40 × 1,8) + 32 = -72 + 32 = -40.' },
      { question: 'Warum nutzt die Wissenschaft die Kelvin-Skala ohne Gradzeichen?', answer: 'Weil Kelvin eine absolute thermodynamische Einheit ist (keine relative Skala wie Celsius mit willkürlichem Gefrierpunkt von Wasser); negative Kelvin-Temperaturen existieren im Reellen nicht.' },
    ],
    relatedSlugs: ['schokolade-temperieren-rechner', 'laengen-umrechner', 'gewicht-masse-umrechner'],
  },
];
