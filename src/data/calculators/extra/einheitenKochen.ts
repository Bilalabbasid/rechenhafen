import { CalculatorDefinition } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';

export const EXTRA_EINHEITEN_KOCHEN: CalculatorDefinition[] = [
  {
    id: "gewicht-masse-umrechner",
    slug: "gewicht-masse-umrechner",
    name: "Gewicht Umrechner (kg, g, Pfund lbs, Unzen oz & Tonnen)",
    shortName: "Gewicht Umrechner",
    category: "einheiten",
    subcategory: "Masse & Gewicht",
    metaTitle: "Gewicht Umrechner – Kilogramm, Gramm, Pfund (lbs) & Unzen (oz)",
    metaDescription: "Rechnen Sie Gewichte sekundenschnell um zwischen Kilogramm (kg), Gramm (g), Milligramm (mg), Tonnen (t), englischen Pfund (lbs) und Unzen (oz).",
    h1: "Gewicht Umrechner – kg, g, lbs & oz präzise umrechnen",
    shortDescription: "Konvertiert Gewichtseinheiten zwischen metrischem und angloamerikanischem System.",
    searchKeywords: ["gewicht umrechner kg in lbs","pfund in kilogramm umrechnen formel","unzen oz in gramm umrechner","tonnen in kilogramm berechnen"],
    inputs: [
          {
                "id": "inputValue",
                "label": "Gewichtswert",
                "type": "number",
                "defaultValue": 10,
                "min": 0.000001,
                "max": 1000000000,
                "step": 0.1,
                "unit": "Masse"
          },
          {
                "id": "inputUnit",
                "label": "Ausgangseinheit",
                "type": "select",
                "defaultValue": "kg",
                "options": [
                      {
                            "value": "kg",
                            "label": "Kilogramm (kg)"
                      },
                      {
                            "value": "g",
                            "label": "Gramm (g)"
                      },
                      {
                            "value": "mg",
                            "label": "Milligramm (mg)"
                      },
                      {
                            "value": "t",
                            "label": "Tonne (t = 1.000 kg)"
                      },
                      {
                            "value": "lbs",
                            "label": "Englisches Pfund (lb / lbs = 0,45359 kg)"
                      },
                      {
                            "value": "oz",
                            "label": "Unze (oz = 28,3495 g)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const val = Number(inputs.inputValue) || 0;
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
        summaryText: val + ' ' + String(unit || '').toUpperCase() + ' entsprechen genau ' + formatNumber(kg, 3) + ' kg (' + formatNumber(g, 1) + ' g, ' + formatNumber(lbs, 2) + ' lbs oder ' + formatNumber(oz, 1) + ' oz).',
      };
    },
    formula: "1 lb = 0,45359237 kg; 1 oz = 28,3495 g; 1 t = 1.000 kg",
    formulaExplanation: "Das internationale Avoirdupois-Pfund ist seit 1959 völkerrechtlich exakt auf 0,45359237 Kilogramm festgelegt.",
    workedExample: {
          "title": "Beispiel: 150 lbs Körpergewicht in Kilogramm umrechnen",
          "inputValues": [
                {
                      "label": "Gewicht",
                      "value": "150 lbs"
                }
          ],
          "steps": [
                "kg = 150 × 0,453592 = 68,04 kg"
          ],
          "result": "68,04 kg"
    },
    faqs: [
          {
                "question": "Was ist der Unterschied zwischen deutschem Pfund und englischem Pound?",
                "answer": "Das umgangssprachliche deutsche Pfund beträgt genau 500 Gramm (0,5 kg). Das englische Pound (lb) ist leichter und wiegt exakt 453,59 Gramm."
          },
          {
                "question": "Was ist eine Feinunze (oz tr)?",
                "answer": "Im Edelmetallhandel (Gold, Silber) gilt die Feinunze (Troy Ounce): Sie wiegt exakt 31,1035 Gramm und ist schwerer als die gewöhnliche Handelsunze (28,35 g)."
          }
    ],
    relatedSlugs: ["laengen-umrechner","volumen-umrechner","kraft-umrechner"],
  },
  {
    id: "druck-umrechner",
    slug: "druck-umrechner",
    name: "Druck Umrechner (bar, PSI, Pascal, hPa, mbar & Torr)",
    shortName: "Druck Umrechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: "Druck Umrechner – bar, PSI, Pascal (Pa), hPa & Torr umrechnen",
    metaDescription: "Rechnen Sie Druckeinheiten exakt um zwischen bar, Millibar (mbar), Pascal (Pa), Hektopascal (hPa), PSI (Pound-force per square inch) und Torr/mmHg.",
    h1: "Druck Umrechner – bar, PSI, Pascal & mbar sofort umrechnen",
    shortDescription: "Konvertiert bar, PSI, Pascal, hPa und Torr.",
    searchKeywords: ["druck umrechner bar psi","psi in bar umrechnen formel reifendruck","pascal in bar hpa mbar","bar in torr mmhg rechner"],
    inputs: [
          {
                "id": "inputValue",
                "label": "Druckwert",
                "type": "number",
                "defaultValue": 2.5,
                "min": 0.000001,
                "max": 100000000,
                "step": 0.1,
                "unit": "Druck"
          },
          {
                "id": "inputUnit",
                "label": "Ausgangseinheit",
                "type": "select",
                "defaultValue": "bar",
                "options": [
                      {
                            "value": "bar",
                            "label": "Bar (bar)"
                      },
                      {
                            "value": "psi",
                            "label": "Pounds per square inch (PSI)"
                      },
                      {
                            "value": "pa",
                            "label": "Pascal (Pa = N/m²)"
                      },
                      {
                            "value": "hpa",
                            "label": "Hektopascal / mbar (hPa)"
                      },
                      {
                            "value": "mpa",
                            "label": "Megapascal (MPa = N/mm²)"
                      },
                      {
                            "value": "torr",
                            "label": "Torr / mmHg"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const val = Number(inputs.inputValue) || 0;
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
        summaryText: val + ' ' + String(unit || '').toUpperCase() + ' entsprechen genau ' + formatNumber(bar, 3) + ' bar bzw. ' + formatNumber(psi, 2) + ' PSI (' + formatNumber(hpa, 0) + ' hPa).',
      };
    },
    formula: "1 bar = 100.000 Pa = 14,5038 PSI; 1 PSI ≈ 0,068947 bar; 1 bar = 750,06 Torr",
    formulaExplanation: "Ein Bar entspricht annähernd dem durchschnittlichen atmosphärischen Luftdruck der Erde auf Meereshöhe (Standardatmosphäre = 1,01325 bar = 1.013,25 hPa).",
    workedExample: {
          "title": "Beispiel: 32 PSI Autoreifendruck in bar umrechnen",
          "inputValues": [
                {
                      "label": "Reifendruck",
                      "value": "32 PSI"
                }
          ],
          "steps": [
                "bar = 32 / 14,5038 ≈ 2,206 bar"
          ],
          "result": "2,21 bar Reifendruck"
    },
    faqs: [
          {
                "question": "Was bedeutet der Unterschied zwischen absolutem Druck und Relativdruck?",
                "answer": "Relativdruck (wie beim Manometer an der Tankstelle) misst die Druckdifferenz zum umgebenden Atmosphärendruck (1 bar). Absoluter Druck = Relativdruck + Atmosphärendruck."
          },
          {
                "question": "Warum ist 1 Hektopascal gleich 1 Millibar?",
                "answer": "1 Hekto = 100 (100 Pa). 1 Bar = 100.000 Pa, somit ist 1 Millibar (1/1.000 Bar) = 100 Pa. Daher gilt exakt: 1 hPa = 1 mbar."
          }
    ],
    relatedSlugs: ["temperatur-umrechner","kraft-umrechner","geschwindigkeit-umrechner"],
  },
  {
    id: "geschwindigkeit-umrechner",
    slug: "geschwindigkeit-umrechner",
    name: "Geschwindigkeit Umrechner (km/h, m/s, mph & Knoten)",
    shortName: "Geschwindigkeit Umrechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: "Geschwindigkeit Umrechner – km/h, m/s, mph (Meilen) & Knoten umrechnen",
    metaDescription: "Rechnen Sie Geschwindigkeiten sekundenschnell um zwischen km/h, Meter pro Sekunde (m/s), Meilen pro Stunde (mph), Seemeilen/Knoten (kn) und Mach.",
    h1: "Geschwindigkeit Umrechner – km/h, m/s, mph & Knoten ermitteln",
    shortDescription: "Konvertiert km/h in m/s, Meilen pro Stunde und Seemeilen-Knoten.",
    searchKeywords: ["geschwindigkeit umrechnen kmh ms formel","mph in kmh umrechnen meilen pro stunde","knoten in kmh seemeilen umrechner","meter pro sekunde in kmh teilen 3 6"],
    inputs: [
          {
                "id": "inputValue",
                "label": "Geschwindigkeitswert",
                "type": "number",
                "defaultValue": 100,
                "min": 0,
                "max": 100000,
                "step": 1,
                "unit": "Tempo"
          },
          {
                "id": "inputUnit",
                "label": "Ausgangseinheit",
                "type": "select",
                "defaultValue": "kmh",
                "options": [
                      {
                            "value": "kmh",
                            "label": "Kilometer pro Stunde (km/h)"
                      },
                      {
                            "value": "ms",
                            "label": "Meter pro Sekunde (m/s)"
                      },
                      {
                            "value": "mph",
                            "label": "Meilen pro Stunde (mph)"
                      },
                      {
                            "value": "kn",
                            "label": "Knoten (kn = Seemeilen/h)"
                      },
                      {
                            "value": "mach",
                            "label": "Mach (Schallgeschwindigkeit in Luft ca. 20°C)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const val = Number(inputs.inputValue) || 0;
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
        summaryText: val + ' ' + String(unit || '').toUpperCase() + ' entsprechen ' + formatNumber(kmh, 1) + ' km/h, ' + formatNumber(ms, 2) + ' m/s, ' + formatNumber(mph, 1) + ' mph und ' + formatNumber(kn, 1) + ' Knoten.',
      };
    },
    formula: "km/h = m/s × 3,6; m/s = km/h / 3,6; 1 mph = 1,609344 km/h; 1 Knoten = 1,852 km/h",
    formulaExplanation: "Der Umrechnungsfaktor 3,6 ergibt sich mathematisch exakt aus dem Verhältnis von 3.600 Sekunden pro Stunde und 1.000 Metern pro Kilometer.",
    workedExample: {
          "title": "Beispiel: 60 mph Tempolimit in den USA in km/h",
          "inputValues": [
                {
                      "label": "Tempo",
                      "value": "60 mph"
                }
          ],
          "steps": [
                "km/h = 60 × 1,609344 = 96,56 km/h"
          ],
          "result": "96,56 km/h"
    },
    faqs: [
          {
                "question": "Wie rechnet man im Kopf schnell km/h in m/s um?",
                "answer": "Teilen Sie durch 4 und addieren Sie 10 %: 100 km/h / 4 = 25; 25 + 2,5 = 27,5 m/s (exakter Wert: 27,78 m/s)."
          },
          {
                "question": "Was ist ein Knoten in der Schifffahrt?",
                "answer": "Ein Knoten entspricht einer Geschwindigkeit von einer Seemeile (1.852 Meter) pro Stunde. Der Begriff stammt vom Auswerfen einer Messleine mit Knoten ins Meer."
          }
    ],
    relatedSlugs: ["laengen-umrechner","kraftstoffverbrauch-umrechner","zeit-umrechner"],
  },
  {
    id: "volumen-umrechner",
    slug: "volumen-umrechner",
    name: "Volumen Umrechner (Liter, ml, m³, Gallonen & Fluid Ounces)",
    shortName: "Volumen Umrechner",
    category: "einheiten",
    subcategory: "Raummaße & Hohlmaße",
    metaTitle: "Volumen Umrechner – Liter (l), Milliliter (ml), m³ & US Gallons",
    metaDescription: "Rechnen Sie Hohlmaße und Raummaße um zwischen Liter, Milliliter, Kubikmeter (m³), US-Gallonen, UK-Gallonen, Fluid Ounces (fl oz) und Kubikfuß.",
    h1: "Volumen Umrechner – Liter, m³, Gallonen & fl oz berechnen",
    shortDescription: "Konvertiert Liter, Kubikmeter, Gallonen und flüssige Unzen.",
    searchKeywords: ["volumen umrechner liter m3 gallonen","us gallon in liter umrechnen formel","kubikmeter in liter m3","fluid ounces fl oz in ml"],
    inputs: [
          {
                "id": "inputValue",
                "label": "Volumenwert",
                "type": "number",
                "defaultValue": 10,
                "min": 0.000001,
                "max": 1000000000,
                "step": 0.1,
                "unit": "Volumen"
          },
          {
                "id": "inputUnit",
                "label": "Ausgangseinheit",
                "type": "select",
                "defaultValue": "l",
                "options": [
                      {
                            "value": "l",
                            "label": "Liter (l = dm³)"
                      },
                      {
                            "value": "ml",
                            "label": "Milliliter (ml = cm³)"
                      },
                      {
                            "value": "m3",
                            "label": "Kubikmeter (m³ = 1.000 l)"
                      },
                      {
                            "value": "usgal",
                            "label": "US Gallone (gal ≈ 3,785 l)"
                      },
                      {
                            "value": "ukgal",
                            "label": "UK Gallone imperial (gal ≈ 4,546 l)"
                      },
                      {
                            "value": "floz",
                            "label": "US Fluid Ounce (fl oz ≈ 29,57 ml)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const val = Number(inputs.inputValue) || 0;
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
        summaryText: val + ' ' + String(unit || '').toUpperCase() + ' entsprechen genau ' + formatNumber(liters, 2) + ' Litern (' + formatNumber(m3, 3) + ' m³ bzw. ' + formatNumber(usgal, 2) + ' US-Gallonen).',
      };
    },
    formula: "1 m³ = 1.000 l; 1 US gal = 3,78541 l; 1 UK gal = 4,54609 l; 1 US fl oz = 29,5735 ml",
    formulaExplanation: "Ein Liter ist definiert als genau ein Kubikdezimeter (1 dm³ = 0,001 m³).",
    workedExample: {
          "title": "Beispiel: 5 US-Gallonen Benzin in Liter umrechnen",
          "inputValues": [
                {
                      "label": "Volumen",
                      "value": "5 US Gallonen"
                }
          ],
          "steps": [
                "Liter = 5 × 3,78541 = 18,93 Liter"
          ],
          "result": "18,93 Liter"
    },
    faqs: [
          {
                "question": "Wie viele Liter passen in einen Kubikmeter?",
                "answer": "Exakt 1.000 Liter passen in einen Kubikmeter Wasser (1 m³ = 1.000 l = 1 Tonne Wasser bei 4°C)."
          },
          {
                "question": "Was ist der Unterschied zwischen US Gallon und UK Imperial Gallon?",
                "answer": "Die britische Gallone (Imperial Gallon = 4,546 l) ist ca. 20 % größer als die US-Gallone (3,785 l)."
          }
    ],
    relatedSlugs: ["gewicht-masse-umrechner","laengen-umrechner","gramm-in-ml-rechner"],
  },
  {
    id: "flaeche-umrechner",
    slug: "flaeche-umrechner",
    name: "Flächen Umrechner (m², km², Hektar ha, Ar & Acres)",
    shortName: "Flächen Umrechner",
    category: "einheiten",
    subcategory: "Geometrische Maße",
    metaTitle: "Flächen Umrechner – Quadratmeter (m²), Hektar (ha), Ar & Acres",
    metaDescription: "Rechnen Sie Flächenmaße präzise um zwischen Quadratmetern (m²), Quadratkilometern (km²), Hektar (ha), Ar (a), Acres und Quadratfuß (sq ft).",
    h1: "Flächen Umrechner – m², Hektar, Ar & Acres sofort umrechnen",
    shortDescription: "Konvertiert Quadratmeter, Hektar, Ar und angloamerikanische Acres.",
    searchKeywords: ["flaechen umrechner m2 hektar","hektar in quadratmeter umrechnen 10000","ar in m2 umrechner","acre in hektar quadratmeter"],
    inputs: [
          {
                "id": "inputValue",
                "label": "Flächenwert",
                "type": "number",
                "defaultValue": 1,
                "min": 0.000001,
                "max": 1000000000,
                "step": 0.1,
                "unit": "Fläche"
          },
          {
                "id": "inputUnit",
                "label": "Ausgangseinheit",
                "type": "select",
                "defaultValue": "ha",
                "options": [
                      {
                            "value": "ha",
                            "label": "Hektar (ha = 10.000 m²)"
                      },
                      {
                            "value": "m2",
                            "label": "Quadratmeter (m²)"
                      },
                      {
                            "value": "km2",
                            "label": "Quadratkilometer (km²)"
                      },
                      {
                            "value": "a",
                            "label": "Ar (a = 100 m²)"
                      },
                      {
                            "value": "acre",
                            "label": "Acre (ac ≈ 4.046,86 m²)"
                      },
                      {
                            "value": "sqft",
                            "label": "Quadratfuß (sq ft ≈ 0,0929 m²)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const val = Number(inputs.inputValue) || 0;
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
        summaryText: val + ' ' + String(unit || '').toUpperCase() + ' entsprechen genau ' + formatNumber(m2, 1) + ' m² (' + formatNumber(ha, 2) + ' ha bzw. ' + formatNumber(acre, 2) + ' Acres).',
      };
    },
    formula: "1 ha = 10.000 m² = 100 Ar; 1 km² = 100 ha = 1.000.000 m²; 1 Acre ≈ 4.046,86 m²",
    formulaExplanation: "Ein Hektar entspricht einem Quadrat von 100 Metern Kantenlänge (100 m × 100 m = 10.000 m²). Ein Fußballfeld hat meist etwa 0,7 Hektar.",
    workedExample: {
          "title": "Beispiel: 2,5 Hektar Ackerland in Quadratmeter umrechnen",
          "inputValues": [
                {
                      "label": "Fläche",
                      "value": "2,5 ha"
                }
          ],
          "steps": [
                "m² = 2,5 × 10.000 = 25.000 m²"
          ],
          "result": "25.000 m²"
    },
    faqs: [
          {
                "question": "Wie groß ist 1 Ar?",
                "answer": "1 Ar entspricht exakt 100 Quadratmetern (ein Quadrat von 10 m × 10 m). 100 Ar ergeben 1 Hektar."
          },
          {
                "question": "Wie viele Quadratmeter hat ein Acre?",
                "answer": "Ein US/UK Acre entspricht historisch der Fläche, die ein Ochsengespann an einem Tag pflügen konnte, heute normiert auf exakt 4.046,856 Quadratmeter (ca. 0,405 ha)."
          }
    ],
    relatedSlugs: ["laengen-umrechner","volumen-umrechner","dachflaeche-rechner"],
  },
  {
    id: "energie-arbeit-umrechner",
    slug: "energie-arbeit-umrechner",
    name: "Energie & Arbeit Umrechner (Joule, kWh, kcal & BTU)",
    shortName: "Energie Umrechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: "Energie Umrechner – Joule (J), Kilowattstunden (kWh), kcal & BTU",
    metaDescription: "Rechnen Sie Energie und mechanische Arbeit um zwischen Joule (J), Kilojoule (kJ), Kilowattstunden (kWh), Kilokalorien (kcal) und British Thermal Units (BTU).",
    h1: "Energie Umrechner – Joule, kWh, kcal & BTU berechnen",
    shortDescription: "Konvertiert Joule in kWh, Kilokalorien und BTU.",
    searchKeywords: ["energie umrechner joule kwh formel","kwh in joule megajoule umrechnen","kilokalorien in kwh berechnen heizung","btu in wattstunden joule rechner"],
    inputs: [
          {
                "id": "inputValue",
                "label": "Energiewert",
                "type": "number",
                "defaultValue": 100,
                "min": 0.000001,
                "max": 100000000000,
                "step": 1,
                "unit": "Energie"
          },
          {
                "id": "inputUnit",
                "label": "Ausgangseinheit",
                "type": "select",
                "defaultValue": "kwh",
                "options": [
                      {
                            "value": "kwh",
                            "label": "Kilowattstunden (kWh)"
                      },
                      {
                            "value": "j",
                            "label": "Joule (J = Ws = N·m)"
                      },
                      {
                            "value": "kj",
                            "label": "Kilojoule (kJ)"
                      },
                      {
                            "value": "mj",
                            "label": "Megajoule (MJ)"
                      },
                      {
                            "value": "kcal",
                            "label": "Kilokalorien (kcal)"
                      },
                      {
                            "value": "btu",
                            "label": "British Thermal Unit (BTU)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const val = Number(inputs.inputValue) || 0;
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
        summaryText: val + ' ' + String(unit || '').toUpperCase() + ' entsprechen genau ' + formatNumber(kwh, 3) + ' kWh (' + formatNumber(mj, 2) + ' MJ bzw. ' + formatNumber(kcal, 0) + ' kcal).',
      };
    },
    formula: "1 kWh = 3,6 MJ = 3.600.000 J; 1 kcal = 4.184 J; 1 BTU ≈ 1.055 J",
    formulaExplanation: "Eine Kilowattstunde entspricht der Energie, die ein Gerät mit einer Leistung von 1.000 Watt genau eine Stunde lang aufnimmt oder abgibt (1.000 W × 3.600 s = 3.600.000 Ws).",
    workedExample: {
          "title": "Beispiel: 2.000 kcal Tagesbedarf in Kilowattstunden (kWh)",
          "inputValues": [
                {
                      "label": "Energie",
                      "value": "2.000 kcal"
                }
          ],
          "steps": [
                "Joule = 2.000 × 4.184 = 8.368.000 J",
                "kWh = 8.368.000 / 3.600.000 = 2,324 kWh"
          ],
          "result": "2,32 kWh (entspricht der Dauerleistung einer 100W-Lampe für fast 24h)"
    },
    faqs: [
          {
                "question": "Wie hängen Leistung (Watt) und Energie (Joule/kWh) zusammen?",
                "answer": "Leistung ist Energie pro Zeit: 1 Watt = 1 Joule pro Sekunde. Energie = Leistung × Zeit (1 W × 1 h = 1 Wh = 3.600 J)."
          },
          {
                "question": "Was ist 1 BTU?",
                "answer": "1 British Thermal Unit ist die Wärmemenge, die benötigt wird, um ein englisches Pfund Wasser um 1 Grad Fahrenheit zu erwärmen (ca. 1.055 Joule)."
          }
    ],
    relatedSlugs: ["leistung-umrechner","stromkostenrechner","kalorien-rezept-rechner"],
  },
  {
    id: "leistung-umrechner",
    slug: "leistung-umrechner",
    name: "Leistung Umrechner (kW, PS Pferdestärke, Watt & HP)",
    shortName: "Leistung Umrechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: "Leistung Umrechner – kW in PS, Watt & mechanische Horsepower (hp)",
    metaDescription: "Rechnen Sie Motor- und Heizleistung exakt um zwischen Kilowatt (kW), DIN-Pferdestärke (PS), Watt (W) und angloamerikanischen Horsepower (hp).",
    h1: "Leistung Umrechner – kW in PS & Horsepower präzise umrechnen",
    shortDescription: "Konvertiert Kilowatt (kW) in Pferdestärken (PS) und Watt.",
    searchKeywords: ["leistung umrechner kw in ps formel 1 36","ps in kw umrechnen auto","horsepower hp in kw rechner","watt in kilowatt pferdestaerke"],
    inputs: [
          {
                "id": "inputValue",
                "label": "Leistungswert",
                "type": "number",
                "defaultValue": 150,
                "min": 0.001,
                "max": 10000000,
                "step": 1,
                "unit": "Leistung"
          },
          {
                "id": "inputUnit",
                "label": "Ausgangseinheit",
                "type": "select",
                "defaultValue": "ps",
                "options": [
                      {
                            "value": "ps",
                            "label": "DIN-Pferdestärke (PS = 0,73549875 kW)"
                      },
                      {
                            "value": "kw",
                            "label": "Kilowatt (kW = 1.000 W)"
                      },
                      {
                            "value": "w",
                            "label": "Watt (W = J/s)"
                      },
                      {
                            "value": "hp",
                            "label": "Mechanical Horsepower imperial (hp ≈ 0,7457 kW)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const val = Number(inputs.inputValue) || 0;
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
        summaryText: val + ' ' + String(unit || '').toUpperCase() + ' entsprechen genau ' + formatNumber(kw, 2) + ' kW bzw. ' + formatNumber(ps, 1) + ' PS (' + formatNumber(hp, 1) + ' hp).',
      };
    },
    formula: "1 kW ≈ 1,35962 PS; 1 PS = 735,49875 Watt; 1 hp ≈ 1,01387 PS",
    formulaExplanation: "1 DIN-PS ist die Leistung, die benötigt wird, um eine Masse von 75 Kilogramm in einer Sekunde gegen die Erdschwere um einen Meter anzuheben (75 kg · 9,80665 m/s² · 1 m = 735,5 Watt).",
    workedExample: {
          "title": "Beispiel: 150 PS Automotor in kW umrechnen",
          "inputValues": [
                {
                      "label": "Leistung",
                      "value": "150 PS"
                }
          ],
          "steps": [
                "kW = 150 × 0,735499 = 110,32 kW"
          ],
          "result": "110,32 kW"
    },
    faqs: [
          {
                "question": "Was ist der Unterschied zwischen PS und HP?",
                "answer": "Metrische PS (DIN) basieren auf 75 kg·m/s = 735,5 Watt. Angloamerikanische HP (Imperial Horsepower) basieren auf 550 ft·lb/s = 745,7 Watt. 100 PS entsprechen ca. 98,6 HP."
          },
          {
                "question": "Warum steht in Fahrzeugpapieren nur noch kW?",
                "answer": "Seit der EU-Richtlinie 80/181/EWG ist das Kilowatt (kW) die gesetzliche Primäreinheit für Leistung im Fahrzeugschein. PS darf nur noch als zusätzliche Angabe verwendet werden."
          }
    ],
    relatedSlugs: ["energie-arbeit-umrechner","drehmoment-umrechner","stromkostenrechner"],
  },
  {
    id: "daten-speicher-umrechner",
    slug: "daten-speicher-umrechner",
    name: "Datenspeicher Umrechner (Byte, KB, MB, GB, TB & Kibibyte)",
    shortName: "Datenspeicher Umrechner",
    category: "einheiten",
    subcategory: "Informatik & Digital",
    metaTitle: "Datenspeicher Umrechner – Byte, KB, MB, GB, TB, PB & KiB, GiB",
    metaDescription: "Rechnen Sie Speicherkapazitäten um: Dezimal (1.000er Basis: KB, MB, GB, TB) und Binär (1.024er Basis: KiB, MiB, GiB, TiB) inklusive Bit-Umrechnung.",
    h1: "Datenspeicher Umrechner – Byte, MB, GB & TB präzise umrechnen",
    shortDescription: "Konvertiert Byte in KB, MB, GB, TB nach Dezimal- und Binärstandard.",
    searchKeywords: ["daten speicher umrechner gigabyte terabyte","gb in mb umrechnen 1024 oder 1000","kibibyte mebibyte gibibyte rechner","byte in bit umrechnen"],
    inputs: [
          {
                "id": "inputValue",
                "label": "Speichergröße",
                "type": "number",
                "defaultValue": 100,
                "min": 0.001,
                "max": 1000000000000,
                "step": 1,
                "unit": "Daten"
          },
          {
                "id": "inputUnit",
                "label": "Ausgangseinheit",
                "type": "select",
                "defaultValue": "gb",
                "options": [
                      {
                            "value": "gb",
                            "label": "Gigabyte (GB – 10⁹ Byte)"
                      },
                      {
                            "value": "mb",
                            "label": "Megabyte (MB – 10⁶ Byte)"
                      },
                      {
                            "value": "tb",
                            "label": "Terabyte (TB – 10¹² Byte)"
                      },
                      {
                            "value": "gib",
                            "label": "Gibibyte (GiB – 1.024³ Byte / Windows)"
                      },
                      {
                            "value": "byte",
                            "label": "Byte (B)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const val = Number(inputs.inputValue) || 0;
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
        summaryText: val + ' ' + String(unit || '').toUpperCase() + ' entsprechen ' + formatNumber(gb, 2) + ' GB dezimal (Herstellerangabe) bzw. ' + formatNumber(gib, 2) + ' GiB im Betriebssystem Windows.',
      };
    },
    formula: "Dezimal (SI): 1 GB = 1.000 MB = 10⁹ Byte; Binär (IEC): 1 GiB = 1.024 MiB = 2³⁰ Byte",
    formulaExplanation: "Festplattenhersteller verkaufen Speicher in Dezimal-GB (1 GB = 1.000.000.000 Byte). Windows rechnet jedoch binär in 1.024er-Schritten (GiB), weshalb eine 1-TB-Festplatte unter Windows nur als ca. 931 GB angezeigt wird.",
    workedExample: {
          "title": "Beispiel: Warum zeigt eine 1 TB Festplatte nur 931 GB an?",
          "inputValues": [
                {
                      "label": "Speicher",
                      "value": "1.000 GB"
                }
          ],
          "steps": [
                "Bytes = 1.000.000.000.000 Byte",
                "GiB = 1.000.000.000.000 / 1.024³ = 931,32 GiB"
          ],
          "result": "931,32 GiB nutzbare Kapazität in Windows"
    },
    faqs: [
          {
                "question": "Was ist der Unterschied zwischen Bit und Byte?",
                "answer": "1 Byte besteht immer aus genau 8 Bits. Ein Bit kann den Zustand 0 oder 1 annehmen, ein Byte kann 256 verschiedene Zustände (0 bis 255) darstellen."
          },
          {
                "question": "Was bedeutet KiB, MiB und GiB?",
                "answer": "Das sind die offiziellen IEC-Binärpräfixe: Kibi (1.024), Mebi (1.024²), Gibi (1.024³). Sie verhindern Verwechslungen mit den metrischen Dezimalpräfixen Kilo, Mega und Giga."
          }
    ],
    relatedSlugs: ["datenrate-bandbreite-umrechner","binaer-hex-dezimal-umrechner","zeit-umrechner"],
  },
  {
    id: "datenrate-bandbreite-umrechner",
    slug: "datenrate-bandbreite-umrechner",
    name: "Datenrate- & Downloadzeit-Rechner (Mbit/s in MB/s & Download-Dauer)",
    shortName: "Downloadzeit-Rechner",
    category: "einheiten",
    subcategory: "Informatik & Digital",
    metaTitle: "Downloadzeit Rechner – Mbit/s in MB/s umrechnen & Download-Dauer",
    metaDescription: "Berechnen Sie die echte Downloadzeit für Spiele, Filme und Backups nach Dateigröße (GB) und Internet-Bandbreite (z. B. DSL 50, Glasfaser 250 Mbit/s, Gigabit).",
    h1: "Downloadzeit Rechner – Wie lange dauert mein Download?",
    shortDescription: "Berechnet Downloadzeit aus Bandbreite (Mbit/s) und Dateigröße (GB).",
    searchKeywords: ["downloadzeit rechner wie lange dauert download","mbits in mbs umrechnen faktor 8","glasfaser download dauer spiel 100 gb","dsl geschwindigkeit megabyte pro sekunde"],
    inputs: [
          {
                "id": "fileSizeGb",
                "label": "Dateigröße (z. B. Spiel, Film, Update)",
                "type": "number",
                "defaultValue": 50,
                "min": 0.1,
                "max": 10000,
                "step": 1,
                "unit": "GB"
          },
          {
                "id": "bandwidthMbits",
                "label": "Download-Geschwindigkeit (Mbit/s)",
                "type": "select",
                "defaultValue": "100",
                "options": [
                      {
                            "value": "16",
                            "label": "DSL 16 (16 Mbit/s – ca. 2,0 MB/s)"
                      },
                      {
                            "value": "50",
                            "label": "VDSL 50 (50 Mbit/s – ca. 6,25 MB/s)"
                      },
                      {
                            "value": "100",
                            "label": "VDSL / Kabel 100 (100 Mbit/s – ca. 12,5 MB/s)"
                      },
                      {
                            "value": "250",
                            "label": "Supervectoring 250 (250 Mbit/s – ca. 31,25 MB/s)"
                      },
                      {
                            "value": "1000",
                            "label": "Gigabit Glasfaser 1.000 (1.000 Mbit/s – ca. 125 MB/s)"
                      }
                ]
          },
          {
                "id": "overheadLoss",
                "label": "Protokoll-Overhead & Netzwerkauslastung",
                "type": "number",
                "defaultValue": 10,
                "min": 0,
                "max": 30,
                "step": 1,
                "unit": "%"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const sizeGb = Number(inputs.fileSizeGb) || 0;
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
      };
    },
    formula: "Downloadzeit (s) = (Dateigröße in MB) / (Bandbreite in Mbit/s / 8 × Overheadfaktor)",
    formulaExplanation: "Internet-Provider werben mit Megabit (Mbit/s). Downloads zeigen Browser und Launcher jedoch in Megabyte (MB/s) an. Da 1 Byte aus 8 Bits besteht, muss die Provider-Zahl immer durch 8 geteilt werden.",
    workedExample: {
          "title": "Beispiel: 50 GB Spiel mit 100 Mbit/s Leitung herunterladen",
          "inputValues": [
                {
                      "label": "Größe",
                      "value": "50 GB (50.000 MB)"
                },
                {
                      "label": "Speed",
                      "value": "100 Mbit/s"
                }
          ],
          "steps": [
                "MB/s = 100 / 8 = 12,5 MB/s (mit 10 % Verlust: 11,36 MB/s)",
                "Zeit = 50.000 / 11,36 = 4.401 Sekunden ≈ 73 Minuten"
          ],
          "result": "ca. 1 Stunde und 13 Minuten"
    },
    faqs: [
          {
                "question": "Warum erreiche ich beim Download selten die volle Mbit/s-Zahl?",
                "answer": "WLAN-Verluste, Server-Auslastung des Anbieters, andere Geräte im Heimnetzwerk und TCP/IP-Protokoll-Overhead (ca. 5-10 %) reduzieren die praktische Transferrate."
          },
          {
                "question": "Was ist der Unterschied zwischen Upload und Download?",
                "answer": "Download ist die Geschwindigkeit beim Herunterladen aus dem Internet (z. B. Netflix-Stream). Upload ist die Geschwindigkeit beim Hochladen (z. B. Backup in die Cloud, Videoanruf)."
          }
    ],
    relatedSlugs: ["daten-speicher-umrechner","zeit-umrechner","stromkostenrechner"],
  },
  {
    id: "drehmoment-umrechner",
    slug: "drehmoment-umrechner",
    name: "Drehmoment Umrechner (Nm in ft-lb, in-lb & kpm)",
    shortName: "Drehmoment Umrechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: "Drehmoment Umrechner – Newtonmeter (Nm) in ft-lb, in-lb & kpm",
    metaDescription: "Rechnen Sie Drehmomente für Drehmomentschlüssel und Kfz um: Newtonmeter (Nm), Foot-Pounds (ft-lb / lbf-ft), Inch-Pounds (in-lb) und Kilopondmeter (kpm).",
    h1: "Drehmoment Umrechner – Nm, ft-lb & in-lb präzise umrechnen",
    shortDescription: "Konvertiert Newtonmeter in Foot-Pounds für Werkzeug und Kraftfahrzeuge.",
    searchKeywords: ["drehmoment umrechner nm in ft lb","newtonmeter in foot pounds umrechnen","drehmomentschluessel tabelle nm in lb","drehmoment kpm newtonmeter"],
    inputs: [
          {
                "id": "inputValue",
                "label": "Drehmomentwert",
                "type": "number",
                "defaultValue": 120,
                "min": 0.01,
                "max": 100000,
                "step": 1,
                "unit": "Drehmoment"
          },
          {
                "id": "inputUnit",
                "label": "Ausgangseinheit",
                "type": "select",
                "defaultValue": "nm",
                "options": [
                      {
                            "value": "nm",
                            "label": "Newtonmeter (Nm = N·m)"
                      },
                      {
                            "value": "ftlb",
                            "label": "Foot-Pounds (ft-lb / lbf·ft)"
                      },
                      {
                            "value": "inlb",
                            "label": "Inch-Pounds (in-lb)"
                      },
                      {
                            "value": "kpm",
                            "label": "Kilopondmeter (kpm)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const val = Number(inputs.inputValue) || 0;
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
        summaryText: val + ' ' + String(unit || '').toUpperCase() + ' entsprechen genau ' + formatNumber(nm, 2) + ' Nm bzw. ' + formatNumber(ftlb, 2) + ' ft-lb.',
      };
    },
    formula: "1 Nm ≈ 0,737562 ft-lb; 1 ft-lb ≈ 1,35582 Nm; 1 kpm ≈ 9,80665 Nm",
    formulaExplanation: "Drehmoment ist das Produkt aus Hebelarm r und senkrecht angreifender Kraft F (M = F · r). 1 Newtonmeter ist die Hebelwirkung von 1 Newton Kraft an einem Hebel von 1 Meter.",
    workedExample: {
          "title": "Beispiel: Radmuttern anziehen mit 120 Nm in ft-lb",
          "inputValues": [
                {
                      "label": "Drehmoment",
                      "value": "120 Nm"
                }
          ],
          "steps": [
                "ft-lb = 120 / 1,35582 = 88,51 ft-lb"
          ],
          "result": "88,5 ft-lb"
    },
    faqs: [
          {
                "question": "Mit wie viel Nm zieht man Alufelgen beim Auto fest?",
                "answer": "Bei den meisten PKW liegt das vorgeschriebene Anzugsdrehmoment für Radschrauben bei Alufelgen zwischen 110 und 140 Nm (siehe Fahrzeughandbuch)."
          },
          {
                "question": "Muss ein Drehmomentschlüssel nach der Benutzung entspannt werden?",
                "answer": "Ja! Mechanische Drehmomentschlüssel müssen nach der Arbeit immer auf den kleinsten Einstellwert zurückgedreht werden, damit die interne Feder nicht ermüdet und ungenau wird."
          }
    ],
    relatedSlugs: ["leistung-umrechner","kraft-umrechner","reifen-abrollumfang-rechner"],
  },
  {
    id: "kraft-umrechner",
    slug: "kraft-umrechner",
    name: "Kraft Umrechner (Newton N, Kilonewton kN, Kilopond kp & lbf)",
    shortName: "Kraft Umrechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: "Kraft Umrechner – Newton (N), Kilonewton (kN), Kilopond (kp) & lbf",
    metaDescription: "Rechnen Sie physikalische Kräfte und Zugkräfte um: Newton (N), Kilonewton (kN), Meganewton (MN), Kilopond (kp), Pound-force (lbf) und Dyn (dyn).",
    h1: "Kraft Umrechner – Newton, kN, Kilopond & Pound-force",
    shortDescription: "Konvertiert physikalische Kräfte zwischen Newton, kN und lbf.",
    searchKeywords: ["kraft umrechner newton kilonewton kn","kilonewton in tonnen umrechnen fahrstuhllast","kilopond kp in newton n","pound force lbf in newton rechner"],
    inputs: [
          {
                "id": "inputValue",
                "label": "Kraftwert",
                "type": "number",
                "defaultValue": 10,
                "min": 0.0001,
                "max": 1000000000,
                "step": 0.5,
                "unit": "Kraft"
          },
          {
                "id": "inputUnit",
                "label": "Ausgangseinheit",
                "type": "select",
                "defaultValue": "kn",
                "options": [
                      {
                            "value": "kn",
                            "label": "Kilonewton (kN = 1.000 N)"
                      },
                      {
                            "value": "n",
                            "label": "Newton (N = kg·m/s²)"
                      },
                      {
                            "value": "mn",
                            "label": "Meganewton (MN = 10⁶ N)"
                      },
                      {
                            "value": "kp",
                            "label": "Kilopond (kp = 9,80665 N)"
                      },
                      {
                            "value": "lbf",
                            "label": "Pound-force (lbf ≈ 4,4482 N)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const val = Number(inputs.inputValue) || 0;
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
        summaryText: val + ' ' + String(unit || '').toUpperCase() + ' entsprechen genau ' + formatNumber(kn, 2) + ' kN (' + formatNumber(n, 0) + ' N). Dies entspricht der Gewichtskraft von ca. ' + formatNumber(tonnesWeight, 2) + ' Tonnen.',
      };
    },
    formula: "1 N = 1 kg × m/s²; 1 kN = 1.000 N; 1 kp = 9,80665 N; 1 lbf ≈ 4,44822 N",
    formulaExplanation: "1 Newton ist die Kraft, die einem ruhenden Körper der Masse 1 Kilogramm eine Beschleunigung von 1 m/s² erteilt. Auf der Erde entspricht eine Masse von 100 Gramm ungefähr 1 Newton Gewichtskraft.",
    workedExample: {
          "title": "Beispiel: 10 kN Bruchlast eines Kletterseils in Tonnen",
          "inputValues": [
                {
                      "label": "Kraft",
                      "value": "10 kN"
                }
          ],
          "steps": [
                "Masse = 10.000 N / 9,81 m/s² = 1.019,4 kg ≈ 1,02 Tonnen"
          ],
          "result": "1,02 Tonnen Belastbarkeit"
    },
    faqs: [
          {
                "question": "Warum wird im Bauwesen mit kN statt mit kg gerechnet?",
                "answer": "Weil Bauwerke wie Decken und Brücken Kräften (Gewichtskräfte, Windlast, Erdbeben) widerstehen müssen. 1 kN entspricht in der Praxis der Gewichtskraft von ca. 100 kg."
          },
          {
                "question": "Was war das Kilopond?",
                "answer": "Das Kilopond (kp) war die historische Krafteinheit vor Einführung des SI-Systems: 1 kp war definiert als die Gewichtskraft von 1 kg Masse auf Meereshöhe."
          }
    ],
    relatedSlugs: ["druck-umrechner","drehmoment-umrechner","baugrund-tragfaehigkeit-rechner"],
  },
  {
    id: "kraftstoffverbrauch-umrechner",
    slug: "kraftstoffverbrauch-umrechner",
    name: "Spritverbrauch Umrechner (l/100km in MPG US & UK)",
    shortName: "Verbrauch Umrechner",
    category: "einheiten",
    subcategory: "Fahrzeuge & Mobilität",
    metaTitle: "Spritverbrauch Umrechner – l/100km in MPG (US & UK) umrechnen",
    metaDescription: "Rechnen Sie den Kraftstoffverbrauch um zwischen Litern pro 100 Kilometer (l/100km), US Miles per Gallon (MPG), UK Imperial MPG und km pro Liter.",
    h1: "Spritverbrauch Umrechner – l/100km in MPG umrechnen",
    shortDescription: "Konvertiert l/100km in US- und UK-Miles-per-Gallon (MPG).",
    searchKeywords: ["spritverbrauch umrechner l 100km in mpg","miles per gallon in liter pro 100 km","us mpg in liter umrechnen","kraftstoffverbrauch rechner umrechnung"],
    inputs: [
          {
                "id": "inputValue",
                "label": "Verbrauchswert",
                "type": "number",
                "defaultValue": 6.5,
                "min": 0.1,
                "max": 100,
                "step": 0.1,
                "unit": "Verbrauch"
          },
          {
                "id": "inputUnit",
                "label": "Ausgangseinheit",
                "type": "select",
                "defaultValue": "l100km",
                "options": [
                      {
                            "value": "l100km",
                            "label": "Liter pro 100 km (l/100km – Europa)"
                      },
                      {
                            "value": "usmpg",
                            "label": "US Miles per Gallon (MPG US)"
                      },
                      {
                            "value": "ukmpg",
                            "label": "UK Miles per Gallon (MPG UK Imperial)"
                      },
                      {
                            "value": "kml",
                            "label": "Kilometer pro Liter (km/l)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const val = Number(inputs.inputValue) || 0;
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
        summaryText: val + ' ' + String(unit || '').toUpperCase() + ' entsprechen genau ' + formatNumber(l100km, 2) + ' l/100km (' + formatNumber(usmpg, 1) + ' US MPG bzw. ' + formatNumber(kml, 2) + ' km pro Liter).',
      };
    },
    formula: "US MPG = 235,215 / (l/100km); l/100km = 235,215 / US MPG; km/l = 100 / (l/100km)",
    formulaExplanation: "Während in Kontinentaleuropa der Verbrauch pro feste Distanz (Liter auf 100 km) gemessen wird, misst man im angloamerikanischen Raum die erreichte Distanz pro Volumeneinheit (Meilen pro Gallone).",
    workedExample: {
          "title": "Beispiel: Ein US-Auto mit 30 MPG in l/100km umrechnen",
          "inputValues": [
                {
                      "label": "Verbrauch",
                      "value": "30 US MPG"
                }
          ],
          "steps": [
                "l/100km = 235,215 / 30 = 7,84 l/100km"
          ],
          "result": "7,84 l/100km"
    },
    faqs: [
          {
                "question": "Bedeutet ein höherer MPG-Wert mehr oder weniger Verbrauch?",
                "answer": "Umgekehrt als in Europa: Ein HÖHERER MPG-Wert bedeutet besseren Wirkungsgrad, da Sie mit einer Gallone weiter fahren können! Bei l/100km ist ein niedriger Wert besser."
          },
          {
                "question": "Warum unterscheidet sich US MPG von UK MPG?",
                "answer": "Weil die britische Imperial Gallon (4,55 l) größer ist als die US Liquid Gallon (3,79 l). Daher hat dasselbe Auto in Großbritannien eine um ca. 20 % höhere MPG-Zahl."
          }
    ],
    relatedSlugs: ["spritkostenrechner","geschwindigkeit-umrechner","volumen-umrechner"],
  },
  {
    id: "roemische-zahlen-umrechner",
    slug: "roemische-zahlen-umrechner",
    name: "Römische Zahlen Umrechner (Dezimal in Römisch & Römisch in Dezimal)",
    shortName: "Römische Zahlen",
    category: "einheiten",
    subcategory: "Zahlensysteme",
    metaTitle: "Römische Zahlen Umrechner – Arabische Zahlen 1–3999 in Römisch",
    metaDescription: "Konvertieren Sie arabische Dezimalzahlen (1 bis 3999) in römische Ziffern (I, V, X, L, C, D, M) mit Subtraktionsregel und detaillierter Zusammensetzung.",
    h1: "Römische Zahlen Umrechner – Arabisch in Römisch sofort umrechnen",
    shortDescription: "Wandelt Dezimalzahlen in römische Ziffern um.",
    searchKeywords: ["roemische zahlen umrechner dezimal","arabische zahlen in roemische ziffern umwandeln","roemische zahlen tabelle m d c l x v i","jahr 2026 roemische zahlen mmxxvi"],
    inputs: [
          {
                "id": "decimalNumber",
                "label": "Dezimalzahl (1 bis 3.999)",
                "type": "number",
                "defaultValue": 2026,
                "min": 1,
                "max": 3999,
                "step": 1,
                "unit": ""
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const num = Math.min(3999, Math.max(1, Math.round(Number(inputs.decimalNumber) || 1)));
      
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
      };
    },
    formula: "M = 1000, D = 500, C = 100, L = 50, X = 10, V = 5, I = 1 (mit Subtraktionsregel IV=4, IX=9, XL=40, XC=90, CD=400, CM=900)",
    formulaExplanation: "Römische Zahlen sind ein additives Zahlsystem mit Subtraktionsregel: Steht ein kleineres Zeichen vor einem größeren (z. B. IX), wird es abgezogen (10 - 1 = 9).",
    workedExample: {
          "title": "Beispiel: Das Jahr 2026 in römischen Ziffern",
          "inputValues": [
                {
                      "label": "Zahl",
                      "value": "2026"
                }
          ],
          "steps": [
                "2000 = MM",
                "20 = XX",
                "6 = VI",
                "Zusammen = MMXXVI"
          ],
          "result": "MMXXVI"
    },
    faqs: [
          {
                "question": "Gibt es eine römische Ziffer für die Null?",
                "answer": "Nein, das römische Zahlensystem kennt keine Ziffer für Null. Im Mittelalter wurde gelegentlich das lateinische Wort \"nulla\" (nichts) verwendet."
          },
          {
                "question": "Warum gibt es keine Zahlen über 3.999 im Standard-System?",
                "answer": "Da nach den klassischen Regeln ein Buchstabe maximal dreimal hintereinander stehen darf (MMM = 3000), endet das Standardsystem bei MMMCMXCIX (3.999)."
          }
    ],
    relatedSlugs: ["binaer-hex-dezimal-umrechner","zeit-umrechner","daten-speicher-umrechner"],
  },
  {
    id: "binaer-hex-dezimal-umrechner",
    slug: "binaer-hex-dezimal-umrechner",
    name: "Binär & Hexadezimal Umrechner (Dezimal, Dual & Hex-Code)",
    shortName: "Binär & Hex Umrechner",
    category: "einheiten",
    subcategory: "Zahlensysteme",
    metaTitle: "Binär & Hexadezimal Umrechner – Dezimal, Binär (Dual) & Hex",
    metaDescription: "Rechnen Sie Zahlen um zwischen Dezimalsystem (Basis 10), Binärsystem / Dualsystem (Basis 2), Hexadezimalsystem (Basis 16) und Oktalsystem (Basis 8).",
    h1: "Binär & Hexadezimal Umrechner – Zahlensysteme umrechnen",
    shortDescription: "Konvertiert Zahlen zwischen Dezimal, Binär, Hexadezimal und Oktal.",
    searchKeywords: ["binaer umrechner dualsystem dezimal in binaer","hexadezimal in dezimal umrechnen hex rechner","binaer hex oktal umrechner basis 2 8 16","dezimal in dualzahl umwandeln"],
    inputs: [
          {
                "id": "decimalNumber",
                "label": "Ganze positive Zahl (Dezimal)",
                "type": "number",
                "defaultValue": 255,
                "min": 0,
                "max": 2147483647,
                "step": 1,
                "unit": ""
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const num = Math.max(0, Math.round(Number(inputs.decimalNumber) || 0));
      
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
      };
    },
    formula: "Dezimal = Σ (Ziffer × Basis^Position); Hexadezimal: 0-9, A(10), B(11), C(12), D(13), E(14), F(15)",
    formulaExplanation: "Jede Hexadezimalstelle entspricht exakt 4 Binärstellen (Nibble/Halbbyte), weshalb Hexadezimalzahlen in der Informatik die bevorzugte kompakte Schreibweise für Binärdaten sind.",
    workedExample: {
          "title": "Beispiel: Die Zahl 255 (maximaler 8-Bit-Wert)",
          "inputValues": [
                {
                      "label": "Dezimal",
                      "value": "255"
                }
          ],
          "steps": [
                "Binär = 1111 1111 (8 Einsen)",
                "Hexadezimal = FF (15 × 16¹ + 15 × 16⁰ = 240 + 15 = 255)"
          ],
          "result": "Binär: 11111111, Hex: 0xFF"
    },
    faqs: [
          {
                "question": "Warum nutzen Computer das Binärsystem?",
                "answer": "Weil elektronische Transistoren zuverlässig zwei physikalische Zustände darstellen können: Strom an (1) oder Strom aus (0)."
          },
          {
                "question": "Wo begegnen einem Hexadezimalzahlen im Alltag?",
                "answer": "Bei HTML/CSS-Farbcodes (#FF5733), MAC-Adressen von Netzwerkadaptern und IPv6-Internetadressen."
          }
    ],
    relatedSlugs: ["daten-speicher-umrechner","roemische-zahlen-umrechner","datenrate-bandbreite-umrechner"],
  },
  {
    id: "zoll-in-cm-rechner",
    slug: "zoll-in-cm-rechner",
    name: "Zoll-in-cm-Rechner (Inch & Diagonale für TV & Smartphones)",
    shortName: "Zoll-in-cm-Rechner",
    category: "einheiten",
    subcategory: "Geometrische Maße",
    metaTitle: "Zoll in cm Rechner – Inch in Zentimeter & TV-Bildschirmdiagonale",
    metaDescription: "Rechnen Sie Zoll (Inch) in Zentimeter und Millimeter um. Inklusive Bildschirm-Rechner für TVs und Handys: Breite und Höhe im 16:9 Format.",
    h1: "Zoll in cm Rechner – Inch in cm & Bildschirmmaße berechnen",
    shortDescription: "Konvertiert Zoll (Inch) in cm und ermittelt Maße von 16:9 Displays.",
    searchKeywords: ["zoll in cm rechner inch umrechnen","fernseher zoll in cm bildschirmdiagonale","display breite hoehe 16 zu 9 zoll","1 zoll wieviel cm 2 54"],
    inputs: [
          {
                "id": "inches",
                "label": "Zoll / Inch (\")",
                "type": "number",
                "defaultValue": 55,
                "min": 0.1,
                "max": 500,
                "step": 0.5,
                "unit": "Zoll"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const inch = Number(inputs.inches) || 0;
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
        summaryText: inch + ' Zoll entsprechen exakt ' + formatNumber(cm, 2) + ' cm. Ein ' + inch + '"-Fernseher (16:9) ist ca. ' + formatNumber(width16_9, 0) + ' cm breit und ' + formatNumber(height16_9, 0) + ' cm hoch.',
      };
    },
    formula: "1 Zoll (Inch) = exakt 2,54 cm = 25,4 mm; cm = Zoll × 2,54",
    formulaExplanation: "Seit 1959 ist das internationale Zoll per Definition an das metrische System gekoppelt: Genau 1 Inch = 25,4 mm.",
    workedExample: {
          "title": "Beispiel: 55-Zoll-Fernseher Bildschirmmaße",
          "inputValues": [
                {
                      "label": "Diagonale",
                      "value": "55 Zoll"
                }
          ],
          "steps": [
                "Diagonale in cm = 55 × 2,54 = 139,7 cm",
                "Breite (16:9) = 139,7 × 0,8716 = 121,8 cm",
                "Höhe (16:9) = 139,7 × 0,4903 = 68,5 cm"
          ],
          "result": "139,7 cm Diagonale (122 × 69 cm)"
    },
    faqs: [
          {
                "question": "Welcher Sitzabstand empfiehlt sich für einen 55- oder 65-Zoll-4K-Fernseher?",
                "answer": "Bei 4K/UHD-Auflösung empfiehlt sich ein Sitzabstand vom ca. 1,5-fachen der Bildschirmdiagonale: Für 55 Zoll (140 cm) ca. 2,1 Meter, für 65 Zoll (165 cm) ca. 2,5 Meter."
          },
          {
                "question": "Gilt die Zoll-Formel auch für Rohre und Reifen?",
                "answer": "Ja, das Zollmaß (25,4 mm) gilt für alle technischen Anwendungen, z. B. 19-Zoll-Felgen, 1/2-Zoll-Wasserrohre oder 28-Zoll-Fahrradreifen."
          }
    ],
    relatedSlugs: ["laengen-umrechner","rechteckrechner","daten-speicher-umrechner"],
  },
  {
    id: "zeit-umrechner",
    slug: "zeit-umrechner",
    name: "Zeit Umrechner (Sekunden, Minuten, Stunden, Tage & Wochen)",
    shortName: "Zeit Umrechner",
    category: "einheiten",
    subcategory: "Alltag & Kalender",
    metaTitle: "Zeit Umrechner – Sekunden, Minuten, Stunden, Tage & Wochen",
    metaDescription: "Rechnen Sie Zeiteinheiten präzise um: Sekunden, Minuten, Stunden, Tage, Wochen und Jahre inklusive Dezimalstunden in Stunden und Minuten.",
    h1: "Zeit Umrechner – Sekunden, Stunden, Tage & Wochen umrechnen",
    shortDescription: "Konvertiert Zeiteinheiten und Dezimalstunden.",
    searchKeywords: ["zeit umrechner sekunden minuten stunden tage","stunden in sekunden umrechnen 3600","dezimalstunden in stunden und minuten","tage in stunden umrechnen rechner"],
    inputs: [
          {
                "id": "inputValue",
                "label": "Zeitwert",
                "type": "number",
                "defaultValue": 36,
                "min": 0,
                "max": 1000000000,
                "step": 0.5,
                "unit": "Zeit"
          },
          {
                "id": "inputUnit",
                "label": "Ausgangseinheit",
                "type": "select",
                "defaultValue": "hours",
                "options": [
                      {
                            "value": "hours",
                            "label": "Stunden (h)"
                      },
                      {
                            "value": "minutes",
                            "label": "Minuten (min)"
                      },
                      {
                            "value": "seconds",
                            "label": "Sekunden (s)"
                      },
                      {
                            "value": "days",
                            "label": "Tage (d = 24 h)"
                      },
                      {
                            "value": "weeks",
                            "label": "Wochen (w = 7 Tage)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const val = Number(inputs.inputValue) || 0;
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
        summaryText: val + ' ' + String(unit || '').toUpperCase() + ' entsprechen genau ' + formatNumber(hours, 2) + ' Stunden, ' + formatNumber(minutes, 0) + ' Minuten bzw. ' + formatNumber(s, 0) + ' Sekunden (' + humanStr + ').',
      };
    },
    formula: "1 min = 60 s; 1 h = 3.600 s; 1 d = 24 h = 86.400 s; 1 w = 7 d = 168 h",
    formulaExplanation: "Unser Zeitsystem basiert historisch auf dem sexagesimalen Zahlensystem (Basis 60) der alten Babylonier für Stunden, Minuten und Sekunden.",
    workedExample: {
          "title": "Beispiel: 7,5 Arbeitsstunden in Minuten und Sekunden",
          "inputValues": [
                {
                      "label": "Stunden",
                      "value": "7,5 h"
                }
          ],
          "steps": [
                "Minuten = 7,5 × 60 = 450 Minuten",
                "Sekunden = 450 × 60 = 27.000 Sekunden"
          ],
          "result": "450 Minuten = 27.000 Sekunden (7 Std. 30 Min.)"
    },
    faqs: [
          {
                "question": "Wie rechnet man 8,75 Stunden in Stunden und Minuten um?",
                "answer": "Die 8 bleibt erhalten. Die Dezimalstellen multipliziert man mit 60: 0,75 × 60 = 45 Minuten. Ergebnis: 8 Stunden und 45 Minuten."
          },
          {
                "question": "Wie viele Sekunden hat ein ganzes Jahr?",
                "answer": "Ein normales Jahr mit 365 Tagen hat 31.536.000 Sekunden (365 × 86.400). Ein Schaltjahr hat 31.622.400 Sekunden."
          }
    ],
    relatedSlugs: ["arbeitszeitrechner","urlaubstage-rechner","datenrate-bandbreite-umrechner"],
  },
  {
    id: "dichte-umrechner",
    slug: "dichte-umrechner",
    name: "Dichte Umrechner (g/cm³, kg/m³, kg/l & lb/cu ft)",
    shortName: "Dichte Umrechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: "Dichte Umrechner – g/cm³ in kg/m³, kg/l & lb/cu ft umrechnen",
    metaDescription: "Rechnen Sie physikalische Dichten um zwischen Gramm pro Kubikzentimeter (g/cm³), Kilogramm pro Kubikmeter (kg/m³), kg pro Liter und Pounds per cubic foot.",
    h1: "Dichte Umrechner – g/cm³, kg/m³ & kg/l präzise umrechnen",
    shortDescription: "Konvertiert Dichteeinheiten zwischen metrischen und angloamerikanischen Werten.",
    searchKeywords: ["dichte umrechner g cm3 in kg m3","spezifisches gewicht dichte wasser 1 g cm3","dichte umrechnen kg pro liter","density converter lb cu ft"],
    inputs: [
          {
                "id": "inputValue",
                "label": "Dichtewert",
                "type": "number",
                "defaultValue": 1,
                "min": 0.0001,
                "max": 100000,
                "step": 0.01,
                "unit": "Dichte"
          },
          {
                "id": "inputUnit",
                "label": "Ausgangseinheit",
                "type": "select",
                "defaultValue": "gcm3",
                "options": [
                      {
                            "value": "gcm3",
                            "label": "Gramm pro Kubikzentimeter (g/cm³ = kg/l)"
                      },
                      {
                            "value": "kgm3",
                            "label": "Kilogramm pro Kubikmeter (kg/m³)"
                      },
                      {
                            "value": "lbcuft",
                            "label": "Pounds per cubic foot (lb/cu ft)"
                      },
                      {
                            "value": "lbcuin",
                            "label": "Pounds per cubic inch (lb/cu in)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const val = Number(inputs.inputValue) || 0;
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
        summaryText: val + ' ' + String(unit || '').toUpperCase() + ' entsprechen genau ' + formatNumber(gcm3, 3) + ' g/cm³ bzw. ' + formatNumber(kgm3, 0) + ' kg/m³ (' + formatNumber(lbcuft, 1) + ' lb/cu ft).',
      };
    },
    formula: "1 g/cm³ = 1.000 kg/m³ = 1 kg/l = 62,428 lb/cu ft; ρ = m / V",
    formulaExplanation: "Dichte beschreibt das Verhältnis der Masse eines Körpers zu seinem Volumen. Wasser bei 4°C hat per Definition eine Dichte von exakt 1,000 g/cm³ (1.000 kg/m³).",
    workedExample: {
          "title": "Beispiel: Stahldichte 7.850 kg/m³ in g/cm³",
          "inputValues": [
                {
                      "label": "Dichte",
                      "value": "7.850 kg/m³"
                }
          ],
          "steps": [
                "g/cm³ = 7.850 / 1.000 = 7,85 g/cm³"
          ],
          "result": "7,85 g/cm³"
    },
    faqs: [
          {
                "question": "Warum schwimmt Eis auf flüssigem Wasser?",
                "answer": "Wegen der Dichteanomalie des Wassers: Eis hat bei 0°C eine Dichte von ca. 0,917 g/cm³ und ist somit leichter als flüssiges Wasser (ca. 1,000 g/cm³)."
          },
          {
                "question": "Welches Metall hat die höchste Dichte?",
                "answer": "Osmium hat mit 22,59 g/cm³ die höchste Dichte aller chemischen Elemente, dicht gefolgt von Iridium (22,56 g/cm³) und Platin (21,45 g/cm³)."
          }
    ],
    relatedSlugs: ["gewicht-masse-umrechner","volumen-umrechner","kies-splitt-rechner"],
  },
  {
    id: "drehzahl-umfangsgeschwindigkeit-rechner",
    slug: "drehzahl-umfangsgeschwindigkeit-rechner",
    name: "Drehzahl- & Schnittgeschwindigkeits-Rechner (U/min, RPM in m/s & m/min)",
    shortName: "Drehzahl & Schnitt",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: "Drehzahl Rechner – RPM, Umfangs- & Schnittgeschwindigkeit v = π·d·n",
    metaDescription: "Berechnen Sie die Schnittgeschwindigkeit und Umfangsgeschwindigkeit v in m/min und m/s aus Werkzeugdurchmesser d (mm) und Drehzahl n (U/min / RPM) für Bohren und Fräsen.",
    h1: "Drehzahl Rechner – Schnittgeschwindigkeit & RPM berechnen",
    shortDescription: "Ermittelt Schnittgeschwindigkeit und Umfangsgeschwindigkeit aus Drehzahl.",
    searchKeywords: ["drehzahl rechner schnittgeschwindigkeit formel","rpm in m s umrechnen durchmesser","v pi d n durch 1000 schnittgeschwindigkeit bohren","umfangsgeschwindigkeit berechnen"],
    inputs: [
          {
                "id": "diameterMm",
                "label": "Werkzeug- / Raddurchmesser (d)",
                "type": "number",
                "defaultValue": 125,
                "min": 0.1,
                "max": 5000,
                "step": 1,
                "unit": "mm"
          },
          {
                "id": "rpm",
                "label": "Drehzahl (n)",
                "type": "number",
                "defaultValue": 6000,
                "min": 1,
                "max": 200000,
                "step": 100,
                "unit": "U/min (RPM)"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const dMm = Number(inputs.diameterMm) || 0;
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
      };
    },
    formula: "v = (π × d × n) / 1.000 (m/min); v (m/s) = v / 60; ω = 2π × (n / 60)",
    formulaExplanation: "In der Zerspanungstechnik (Bohren, Fräsen, Drehen, Schleifen) ist die Schnittgeschwindigkeit v_c die entscheidende Größe zur Bestimmung der Standzeit und Spanabnahme.",
    workedExample: {
          "title": "Beispiel: Winkelschleifer 125 mm Trennscheibe bei 11.000 U/min",
          "inputValues": [
                {
                      "label": "Durchmesser",
                      "value": "125 mm"
                },
                {
                      "label": "Drehzahl",
                      "value": "11.000 RPM"
                }
          ],
          "steps": [
                "v = (π × 125 × 11.000) / 1.000 = 4.319,7 m/min",
                "v in m/s = 4.319,7 / 60 ≈ 72,0 m/s (Zulässig: max. 80 m/s)"
          ],
          "result": "72,0 m/s Umfangsgeschwindigkeit"
    },
    faqs: [
          {
                "question": "Warum ist die maximale Umfangsgeschwindigkeit bei Schleifscheiben begrenzt?",
                "answer": "Trenn- und Schruppscheiben dürfen meist mit maximal 80 m/s betrieben werden, da bei höheren Drehzahlen die Fliehkräfte das Scheibengefüge sprengen können."
          },
          {
                "question": "Wie berechnet man die ideale Drehzahl für Bohrer in Stahl?",
                "answer": "Formel: n = (v_c × 1.000) / (π × d). Bei HSS-Bohrern in Baustahl rechnet man mit einer Schnittgeschwindigkeit v_c von ca. 25 bis 30 m/min."
          }
    ],
    relatedSlugs: ["geschwindigkeit-umrechner","drehmoment-umrechner","leistung-umrechner"],
  },
  {
    id: "beleuchtungsstaerke-lux-lumen-rechner",
    slug: "beleuchtungsstaerke-lux-lumen-rechner",
    name: "Lux- & Lumen-Rechner (Beleuchtungsstärke für Wohn- & Arbeitsräume)",
    shortName: "Lux- & Lumen-Rechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: "Lux & Lumen Rechner – Beleuchtungsstärke (lx) & Lichtstrom (lm)",
    metaDescription: "Berechnen Sie den benötigten Lichtstrom in Lumen nach Raumfläche in m² und Beleuchtungsstärke nach DIN EN 12464 (Küche 300 lx, Büro 500 lx, Wohnzimmer 100 lx).",
    h1: "Lux & Lumen Rechner – Wie viele Lumen brauche ich pro Raum?",
    shortDescription: "Berechnet den Lumen-Bedarf nach Raumfläche und DIN EN 12464.",
    searchKeywords: ["lux in lumen umrechnen formel","wieviel lumen pro m2 wohnzimmer kueche buero","beleuchtungsstaerke din en 12464 lux","lumen watt led rechner"],
    inputs: [
          {
                "id": "roomAreaM2",
                "label": "Raumfläche",
                "type": "number",
                "defaultValue": 20,
                "min": 1,
                "max": 1000,
                "step": 1,
                "unit": "m²"
          },
          {
                "id": "roomType",
                "label": "Raumnutzung & empfohlene Beleuchtungsstärke",
                "type": "select",
                "defaultValue": "living",
                "options": [
                      {
                            "value": "living",
                            "label": "Wohnzimmer / Schlafzimmer (Grundlicht ca. 100 Lux)"
                      },
                      {
                            "value": "kitchen",
                            "label": "Küche / Badezimmer / Flur (ca. 250 bis 300 Lux)"
                      },
                      {
                            "value": "office",
                            "label": "Homeoffice / Schreibtisch DIN EN 12464 (min. 500 Lux)"
                      },
                      {
                            "value": "workshop",
                            "label": "Werkstatt / Feinarbeit (ca. 750 bis 1.000 Lux)"
                      }
                ]
          },
          {
                "id": "efficiencyLmW",
                "label": "LED-Lichtausbeute (Lumen pro Watt)",
                "type": "number",
                "defaultValue": 100,
                "min": 50,
                "max": 200,
                "step": 10,
                "unit": "lm/W"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const a = Number(inputs.roomAreaM2) || 0;
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
      };
    },
    formula: "Lumen (lm) = (Fläche in m² × Beleuchtungsstärke in Lux) / Nutzungsgrad; 1 Lux = 1 Lumen / m²",
    formulaExplanation: "Lumen beziffert die gesamte von einer Lampe abgestrahlte Lichtmenge. Lux beziffert, wie viel von diesem Licht tatsächlich auf einer Fläche (z. B. auf dem Schreibtisch) ankommt.",
    workedExample: {
          "title": "Beispiel: 20 m² Homeoffice mit 500 Lux nach DIN EN 12464",
          "inputValues": [
                {
                      "label": "Fläche",
                      "value": "20 m²"
                },
                {
                      "label": "Ziel",
                      "value": "500 Lux"
                }
          ],
          "steps": [
                "Lichtstrom = (20 m² × 500 lx) / 0,65 ≈ 15.385 Lumen",
                "LED-Leistung (100 lm/W) = ca. 154 Watt aufgeteilt auf mehrere Lichtquellen"
          ],
          "result": "ca. 15.000 Lumen"
    },
    faqs: [
          {
                "question": "Wie viele Lumen hat eine klassische alte 60-Watt-Glühbirne?",
                "answer": "Eine alte 60-Watt-Glühlampe erzeugte ca. 806 Lumen. Eine moderne LED erreicht dieselbe Helligkeit bereits mit nur ca. 7 bis 9 Watt Stromverbrauch."
          },
          {
                "question": "Welche Lichtfarbe (Farbtemperatur) eignet sich für welchen Raum?",
                "answer": "Warmweiß (2.700K) sorgt für Gemütlichkeit im Wohn- und Schlafzimmer. Neutralweiß (4.000K) fördert die Konzentration in Küche, Bad und Homeoffice. Tageslichtweiß (>5.300K) eignet sich für Werkstätten."
          }
    ],
    relatedSlugs: ["leistung-umrechner","energie-arbeit-umrechner","stromkostenrechner"],
  },
  {
    id: "elektrische-ladung-kapazitaet-rechner",
    slug: "elektrische-ladung-kapazitaet-rechner",
    name: "Akku-Kapazitäts- & Ladungs-Rechner (mAh, Ah in Wh & Coulomb)",
    shortName: "Akku Kapazität-Rechner",
    category: "einheiten",
    subcategory: "Informatik & Digital",
    metaTitle: "Akku Kapazität Rechner – mAh in Wh, Wattstunden & Coulomb umrechnen",
    metaDescription: "Rechnen Sie die Akkukapazität um zwischen Milliamperestunden (mAh), Amperestunden (Ah), Wattstunden (Wh) nach Akkuspannung (3,7V Li-Ion, 12V Blei, 48V E-Bike) und Coulomb.",
    h1: "Akku Kapazität Rechner – mAh in Wh & Wattstunden ermitteln",
    shortDescription: "Konvertiert mAh und Ah in Wattstunden (Wh) nach Zellenspannung.",
    searchKeywords: ["mah in wh umrechnen formel akku powerbank","amperestunden in wattstunden rechner 12v 3 7v","akku kapazitaet coulomb berechnen","powerbank flugzeug grenze 100 wh"],
    inputs: [
          {
                "id": "capacityMah",
                "label": "Kapazität in Milliamperestunden (mAh)",
                "type": "number",
                "defaultValue": 10000,
                "min": 1,
                "max": 10000000,
                "step": 100,
                "unit": "mAh"
          },
          {
                "id": "voltageV",
                "label": "Akkuspannung (Nennspannung)",
                "type": "select",
                "defaultValue": "3.7",
                "options": [
                      {
                            "value": "3.7",
                            "label": "3,7 V (Standard Li-Ion / Smartphone / Powerbank)"
                      },
                      {
                            "value": "3.85",
                            "label": "3,85 V (High-Voltage Li-Polymer)"
                      },
                      {
                            "value": "1.2",
                            "label": "1,2 V (NiMH Akku AA / AAA)"
                      },
                      {
                            "value": "12.0",
                            "label": "12,0 V (Autobatterie / Blei-Gel)"
                      },
                      {
                            "value": "36.0",
                            "label": "36,0 V (Standard E-Bike Akku)"
                      },
                      {
                            "value": "48.0",
                            "label": "48,0 V (Großer E-Bike / Solarspeicher)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const mah = Number(inputs.capacityMah) || 0;
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
      };
    },
    formula: "Wh = (mAh / 1.000) × Volt; Ah = mAh / 1.000; 1 Coulomb = 1 A × 1 s",
    formulaExplanation: "Erst durch Multiplikation der Ladung (Ah) mit der elektrischen Spannung (V) erhält man den echten physikalischen Energieinhalt in Wattstunden (Wh).",
    workedExample: {
          "title": "Beispiel: 20.000 mAh Smartphone-Powerbank (3,7 V Li-Ion)",
          "inputValues": [
                {
                      "label": "Kapazität",
                      "value": "20.000 mAh"
                },
                {
                      "label": "Spannung",
                      "value": "3,7 V"
                }
          ],
          "steps": [
                "Ah = 20.000 / 1.000 = 20 Ah",
                "Wh = 20 Ah × 3,7 V = 74,0 Wh (unter dem 100 Wh Flugzeuglimit)"
          ],
          "result": "74,0 Wh"
    },
    faqs: [
          {
                "question": "Darf ich eine 20.000-mAh-Powerbank ins Flugzeug mitnehmen?",
                "answer": "Ja! Eine 20.000 mAh Li-Ion Powerbank hat 74 Wh. Die internationale IATA-Grenze für Handgepäck liegt bei 100 Wh (ohne Anmeldung) bzw. maximal 160 Wh mit Airline-Genehmigung."
          },
          {
                "question": "Warum schrumpft die Nutzkapazität beim Laden eines Handys?",
                "answer": "Weil die 3,7V der Akkuzelle auf 5V USB hochkonvertiert und im Smartphone wieder heruntergeregelt werden müssen. Dabei entstehen ca. 15 % bis 25 % Umwandlungsverluste."
          }
    ],
    relatedSlugs: ["energie-arbeit-umrechner","leistung-umrechner","stromkostenrechner"],
  },
  {
    id: "radioaktivitaet-strahlendosis-rechner",
    slug: "radioaktivitaet-strahlendosis-rechner",
    name: "Radioaktivitäts- & Strahlendosis-Rechner (Bq, Ci, Sievert & Gray)",
    shortName: "Strahlendosis-Rechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: "Strahlendosis Rechner – Sievert (Sv), Becquerel (Bq), Gray (Gy) & Curie",
    metaDescription: "Rechnen Sie ionisierende Strahlung um: Aktivität (Becquerel Bq, Curie Ci), Energiedosis (Gray Gy, Rad) und Äquivalentdosis (Sievert Sv, Millisievert mSv, Rem).",
    h1: "Strahlendosis Rechner – Becquerel, Sievert & Gray umrechnen",
    shortDescription: "Konvertiert Aktivität (Bq/Ci) und Äquivalentdosis (Sv/mSv/rem).",
    searchKeywords: ["radioaktivitaet umrechner becquerel curie","sievert in millisievert mikrosievert umrechnen","gray in sievert strahlendosis rechner","natuerliche strahlenbelastung deutschland msv"],
    inputs: [
          {
                "id": "inputValue",
                "label": "Dosiswert",
                "type": "number",
                "defaultValue": 2.1,
                "min": 0.000001,
                "max": 1000000,
                "step": 0.1,
                "unit": "Dosis"
          },
          {
                "id": "inputUnit",
                "label": "Ausgangseinheit (Äquivalentdosis)",
                "type": "select",
                "defaultValue": "msv",
                "options": [
                      {
                            "value": "msv",
                            "label": "Millisievert (mSv = 0,001 Sv)"
                      },
                      {
                            "value": "usv",
                            "label": "Mikrosievert (µSv = 10⁻⁶ Sv)"
                      },
                      {
                            "value": "sv",
                            "label": "Sievert (Sv)"
                      },
                      {
                            "value": "rem",
                            "label": "Rem (rem = 0,01 Sv)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const val = Number(inputs.inputValue) || 0;
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
        summaryText: val + ' ' + String(unit || '').toUpperCase() + ' entsprechen ' + formatNumber(msv, 3) + ' mSv (' + formatNumber(usv, 1) + ' µSv). ' + comparison + '.',
      };
    },
    formula: "1 Sv = 1.000 mSv = 1.000.000 µSv = 100 rem; 1 Bq = 1 Zerfall/s; 1 Ci = 3,7 × 10¹⁰ Bq",
    formulaExplanation: "Becquerel (Bq) misst die Aktivität der Quelle. Gray (Gy) misst die absorbierte physikalische Energiedosis (J/kg). Sievert (Sv) bewertet die biologische Schadwirkung auf menschliches Gewebe.",
    workedExample: {
          "title": "Beispiel: CT-Scan des Brustkorbs mit 7 mSv in Mikrosievert",
          "inputValues": [
                {
                      "label": "Dosis",
                      "value": "7 mSv"
                }
          ],
          "steps": [
                "µSv = 7 × 1.000 = 7.000 µSv (entspricht ca. 3 Jahren natürlicher Hintergrundstrahlung)"
          ],
          "result": "7.000 µSv"
    },
    faqs: [
          {
                "question": "Wie hoch ist die natürliche Strahlenbelastung in Deutschland?",
                "answer": "Im Bundesdurchschnitt liegt die natürliche Strahlenexposition bei rund 2,1 Millisievert (mSv) pro Jahr, hauptsächlich verursacht durch Radon in Gebäuden, kosmische Strahlung und Nahrung."
          },
          {
                "question": "Was ist das Bananen-Äquivalent?",
                "answer": "Bananen enthalten natürlich vorkommendes radioaktives Kalium-40. Der Verzehr einer Banane führt zu einer Dosis von ca. 0,1 Mikrosievert (0,0001 mSv)."
          }
    ],
    relatedSlugs: ["energie-arbeit-umrechner","zeit-umrechner","gewicht-masse-umrechner"],
  },
  {
    id: "viskositaet-umrechner",
    slug: "viskositaet-umrechner",
    name: "Viskosität Umrechner (Dynamische mPa·s / cP & Kinematische cSt)",
    shortName: "Viskosität Umrechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: "Viskosität Umrechner – mPa·s in Centipoise (cP) & Stokes (cSt)",
    metaDescription: "Rechnen Sie Viskositäten von Flüssigkeiten, Ölen und Farben um: Dynamische Viskosität (Pa·s, mPa·s, Centipoise cP) und kinematische Viskosität (mm²/s, Centistokes cSt).",
    h1: "Viskosität Umrechner – mPa·s, Centipoise & Centistokes",
    shortDescription: "Konvertiert dynamische (mPa·s, cP) und kinematische Viskosität (cSt).",
    searchKeywords: ["viskositaet umrechner mpa s centipoise cp","kinematische viskositaet centistokes cst mm2 s","viskositaet motoroel getriebeoel wasser","pascal sekunden in centipoise umrechnen"],
    inputs: [
          {
                "id": "inputValue",
                "label": "Viskositätswert",
                "type": "number",
                "defaultValue": 100,
                "min": 0.001,
                "max": 100000000,
                "step": 1,
                "unit": "Viskosität"
          },
          {
                "id": "inputUnit",
                "label": "Ausgangseinheit (Dynamische Viskosität)",
                "type": "select",
                "defaultValue": "mpas",
                "options": [
                      {
                            "value": "mpas",
                            "label": "Millipascalsekunden (mPa·s = cP)"
                      },
                      {
                            "value": "pas",
                            "label": "Pascalsekunden (Pa·s = 1.000 mPa·s)"
                      },
                      {
                            "value": "cp",
                            "label": "Centipoise (cP)"
                      },
                      {
                            "value": "poise",
                            "label": "Poise (P = 100 cP)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const val = Number(inputs.inputValue) || 0;
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
        summaryText: val + ' ' + String(unit || '').toUpperCase() + ' entsprechen ' + formatNumber(mpas, 1) + ' mPa·s (exakt gleich ' + formatNumber(cp, 1) + ' Centipoise). ' + example + '.',
      };
    },
    formula: "1 mPa·s = 1 cP (Centipoise); 1 Pa·s = 1.000 mPa·s = 10 Poise; ν = η / ρ",
    formulaExplanation: "Viskosität ist das Maß für die Zähflüssigkeit eines Fluids. Je höher die Viskosität, desto dickflüssiger ist das Material und desto langsamer fließt es.",
    workedExample: {
          "title": "Beispiel: Honig mit 1,2 Pa·s in mPa·s und Centipoise",
          "inputValues": [
                {
                      "label": "Viskosität",
                      "value": "1,2 Pa·s"
                }
          ],
          "steps": [
                "mPa·s = 1,2 × 1.000 = 1.200 mPa·s",
                "Centipoise = 1.200 cP"
          ],
          "result": "1.200 mPa·s (1.200 cP)"
    },
    faqs: [
          {
                "question": "Warum ist 1 mPa·s gleich 1 cP?",
                "answer": "Weil 1 Poise = 0,1 Pa·s = 100 mPa·s definiert ist. 1 Centipoise (1/100 Poise) ist somit exakt gleich 1 mPa·s."
          },
          {
                "question": "Was ist der Unterschied zwischen newtonschen und nicht-newtonschen Flüssigkeiten?",
                "answer": "Bei newtonschen Fluiden (wie Wasser oder Öl) bleibt die Viskosität bei Bewegung konstant. Nicht-newtonsche Fluide (wie Ketchup oder Zahnpasta) werden bei Scherung dünnflüssiger (Thixotropie)."
          }
    ],
    relatedSlugs: ["dichte-umrechner","druck-umrechner","temperatur-umrechner"],
  },
  {
    id: "schuhe-kleidergroessen-umrechner",
    slug: "schuhe-kleidergroessen-umrechner",
    name: "Schuhgrößen Umrechner (EU, US, UK & Fußlänge in cm)",
    shortName: "Schuhgrößen Umrechner",
    category: "einheiten",
    subcategory: "Alltag & Kleidung",
    metaTitle: "Schuhgrößen Umrechner – EU in US, UK & Fußlänge (Mondopoint cm)",
    metaDescription: "Rechnen Sie Schuhgrößen für Damen, Herren und Kinder um: Deutsche/EU-Größe (35 bis 48), US Men, US Women, UK-Größe und Fußlänge in cm (Mondopoint).",
    h1: "Schuhgrößen Umrechner – EU, US, UK & cm sofort ermitteln",
    shortDescription: "Konvertiert Schuhgrößen zwischen EU, US, UK und Fußlänge in cm.",
    searchKeywords: ["schuhgroessen umrechner eu in us uk","schuhgroesse us herren damen tabelle","fusslaenge in schuhgroesse cm mondopoint","deutsche schuhgroesse 42 us"],
    inputs: [
          {
                "id": "euSize",
                "label": "EU / Deutsche Schuhgröße",
                "type": "number",
                "defaultValue": 42,
                "min": 20,
                "max": 52,
                "step": 0.5,
                "unit": "EU"
          },
          {
                "id": "gender",
                "label": "Zielgruppe",
                "type": "select",
                "defaultValue": "men",
                "options": [
                      {
                            "value": "men",
                            "label": "Herren / Unisex"
                      },
                      {
                            "value": "women",
                            "label": "Damen"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const eu = Number(inputs.euSize) || 42;
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
      };
    },
    formula: "Fußlänge (cm) ≈ (EU - 1,5) × 2/3; US Men ≈ (EU - 31,5) × 0,75 + 0,5",
    formulaExplanation: "Das kontinentaleuropäische Schuhgrößensystem basiert auf dem Pariser Stich (1 Stich = 2/3 cm ≈ 6,67 mm). Das britische und US-amerikanische System basiert auf Gerstenkörnern (Barleycorn = 1/3 Zoll).",
    workedExample: {
          "title": "Beispiel: Deutsche Schuhgröße 42 für Herren",
          "inputValues": [
                {
                      "label": "EU Größe",
                      "value": "42"
                },
                {
                      "label": "Zielgruppe",
                      "value": "Herren"
                }
          ],
          "steps": [
                "UK = (42 - 31,5) × 0,75 = 8,0",
                "US Men = 8,0 + 0,5 = 8,5",
                "Fußlänge = (40,5 × 2) / 3 = 27,0 cm"
          ],
          "result": "US 8.5 / UK 8.0 (27,0 cm Fußlänge)"
    },
    faqs: [
          {
                "question": "Wie misst man seine Fußlänge richtig?",
                "answer": "Stellen Sie sich am späten Nachmittag auf ein Blatt Papier an eine Wand, markieren Sie die längste Zehe mit einem Stift und messen Sie den Abstand zur Wand in Zentimetern."
          },
          {
                "question": "Warum fallen Laufschuhe oft kleiner aus?",
                "answer": "Da sich der Fuß beim Laufen nach vorne schiebt und durch die Durchblutung anschwillt, wählt man Laufschuhe in der Regel eine bis anderthalb Nummern größer als Straßenschuhe."
          }
    ],
    relatedSlugs: ["laengen-umrechner","zoll-in-cm-rechner","gewicht-masse-umrechner"],
  },
  {
    id: "papierformat-din-rechner",
    slug: "papierformat-din-rechner",
    name: "Papierformat-DIN-Rechner (DIN A0 bis A8 Maße & Blattgewicht in Gramm)",
    shortName: "Papierformat DIN",
    category: "einheiten",
    subcategory: "Geometrische Maße",
    metaTitle: "Papierformat Rechner – DIN A0 bis A8 Maße (mm, cm) & Blattgewicht",
    metaDescription: "Berechnen Sie die exakten Abmessungen in Millimetern und Zentimetern für DIN A4, A3, A5 etc. nach DIN 476 / ISO 216 sowie das Blattgewicht nach Grammatur (80g, 120g/m²).",
    h1: "Papierformat Rechner – DIN A Maße & Briefgewicht berechnen",
    shortDescription: "Berechnet DIN A0 bis A8 Abmessungen in mm und Blattgewicht.",
    searchKeywords: ["papierformat din rechner din a4 maße mm cm","din a3 din a5 masse tabelle","briefgewicht berechnen blattanzahl 80g m2","seitenverhaeltnis wurzel 2 din papier"],
    inputs: [
          {
                "id": "dinFormat",
                "label": "DIN-A Format",
                "type": "select",
                "defaultValue": "a4",
                "options": [
                      {
                            "value": "a0",
                            "label": "DIN A0 (841 × 1.189 mm – 1 m²)"
                      },
                      {
                            "value": "a1",
                            "label": "DIN A1 (594 × 841 mm)"
                      },
                      {
                            "value": "a2",
                            "label": "DIN A2 (420 × 594 mm)"
                      },
                      {
                            "value": "a3",
                            "label": "DIN A3 (297 × 420 mm)"
                      },
                      {
                            "value": "a4",
                            "label": "DIN A4 (210 × 297 mm – Standard)"
                      },
                      {
                            "value": "a5",
                            "label": "DIN A5 (148 × 210 mm – Notizbuch)"
                      },
                      {
                            "value": "a6",
                            "label": "DIN A6 (105 × 148 mm – Postkarte)"
                      },
                      {
                            "value": "a7",
                            "label": "DIN A7 (74 × 105 mm)"
                      }
                ]
          },
          {
                "id": "grammage",
                "label": "Papiergewicht (Grammatur)",
                "type": "number",
                "defaultValue": 80,
                "min": 40,
                "max": 600,
                "step": 10,
                "unit": "g/m²"
          },
          {
                "id": "sheetCount",
                "label": "Anzahl Blätter",
                "type": "number",
                "defaultValue": 1,
                "min": 1,
                "max": 5000,
                "step": 1,
                "unit": "Blatt"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const fmt = inputs.dinFormat;
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
        summaryText: String(fmt || 'A4').toUpperCase() + ' misst genau ' + wMm + ' × ' + hMm + ' mm. ' + sheets + ' Blatt (' + gM2 + ' g/m²) wiegen ca. ' + formatNumber(totalWeightG, 1) + ' Gramm.',
      };
    },
    formula: "Breite / Höhe = 1 : √2 ≈ 1 : 1,4142; Fläche A0 = genau 1 m²; A4 = 1/16 m²",
    formulaExplanation: "Das DIN-A-Format (nach Walter Porstmann, 1922) zeichnet sich dadurch aus, dass sich beim Halbieren der langen Seite wieder exakt dasselbe Seitenverhältnis von 1 zu Wurzel 2 ergibt.",
    workedExample: {
          "title": "Beispiel: 3 Blatt DIN A4 (80 g/m²) in einem Briefumschlag",
          "inputValues": [
                {
                      "label": "Format",
                      "value": "DIN A4"
                },
                {
                      "label": "Grammatur",
                      "value": "80 g/m²"
                },
                {
                      "label": "Blätter",
                      "value": "3 Blatt"
                }
          ],
          "steps": [
                "1 Blatt A4 = 80 g / 16 = 5,0 g",
                "3 Blätter = 15,0 g (+ 4 g Briefumschlag = 19,0 g)",
                "Passt unter die 20g-Grenze für einen Standardbrief"
          ],
          "result": "15 g Papiergewicht (Standardbrief portofrei)"
    },
    faqs: [
          {
                "question": "Wie viele Blätter DIN A4 darf man im Standardbrief verschicken?",
                "answer": "Ein Standardbrief der Deutschen Post darf inklusive Umschlag (ca. 4 bis 5 g) maximal 20 Gramm wiegen. Bei 80g-Papier passen somit bis zu 3 gefaltete Blätter in den Umschlag."
          },
          {
                "question": "Was ist der Unterschied zwischen DIN A, DIN B und DIN C?",
                "answer": "DIN A ist das Papierformat (A4). DIN C ist das Briefumschlagformat (C4, C6), in das ungedruckte A-Bögen genau hineinpassen. DIN B ist das Zwischenformat für Schnellhefter und Mappen."
          }
    ],
    relatedSlugs: ["gewicht-masse-umrechner","flaeche-umrechner","laengen-umrechner"],
  },
  {
    id: "ringgroesse-umrechner",
    slug: "ringgroesse-umrechner",
    name: "Ringgröße Umrechner (EU-Umfang in mm, US, UK & Durchmesser)",
    shortName: "Ringgrößen Umrechner",
    category: "einheiten",
    subcategory: "Alltag & Kleidung",
    metaTitle: "Ringgröße Umrechner – EU-Umfang (48–70) in US, UK & Innendurchmesser",
    metaDescription: "Rechnen Sie Ringgrößen um: Deutsche Größe / Innenumfang in Millimetern (z. B. 54 = 54 mm), Innendurchmesser in mm (d = Umfang / π), US-Größe und UK-Ringgröße.",
    h1: "Ringgröße Umrechner – Innenumfang & Durchmesser bestimmen",
    shortDescription: "Konvertiert Ringgrößen zwischen EU-Umfang, Durchmesser, US und UK.",
    searchKeywords: ["ringgroesse umrechnen tabelle mm","ringgroesse 54 in durchmesser","us ringgroesse in deutsche ringgroesse","ring innenumfang messen"],
    inputs: [
          {
                "id": "euCircumferenceMm",
                "label": "EU Ringgröße / Innenumfang (mm)",
                "type": "number",
                "defaultValue": 54,
                "min": 40,
                "max": 76,
                "step": 1,
                "unit": "mm"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const circ = Number(inputs.euCircumferenceMm) || 54;
      
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
      };
    },
    formula: "Innendurchmesser (mm) = EU-Ringgröße (mm) / π; US ≈ (Innendurchmesser in mm - 11,63) / 0,8128",
    formulaExplanation: "In Deutschland und den meisten europäischen Ländern entspricht die offizielle Ringgröße exakt dem inneren Ringumfang in Millimetern (Größe 54 = 54 mm Innenumfang).",
    workedExample: {
          "title": "Beispiel: Ringgröße 54 (häufige Damengröße)",
          "inputValues": [
                {
                      "label": "EU Größe",
                      "value": "54"
                }
          ],
          "steps": [
                "Innendurchmesser = 54 / π = 54 / 3,14159 ≈ 17,2 mm",
                "US-Größe ≈ 6,8 bis 7,0",
                "UK-Größe ≈ N"
          ],
          "result": "17,2 mm Durchmesser (US 7)"
    },
    faqs: [
          {
                "question": "Wie messe ich die Ringgröße heimlich für einen Verlobungsring?",
                "answer": "Nehmen Sie einen gut passenden Ring des Partners und messen Sie mit einem Messschieber oder Lineal den inneren Durchmesser auf den Millimeter genau. Multiplizieren Sie mit 3,14 für die EU-Größe."
          },
          {
                "question": "Wann sind Finger dicker?",
                "answer": "Finger sind im Sommer bei Hitze und am Abend deutlich dicker als morgens bei Kälte. Messen Sie die Ringgröße daher idealerweise am späten Nachmittag bei normaler Zimmertemperatur."
          }
    ],
    relatedSlugs: ["kreis-umfang-rechner","laengen-umrechner","zoll-in-cm-rechner"],
  },
  {
    id: "dezibel-schalldruck-umrechner",
    slug: "dezibel-schalldruck-umrechner",
    name: "Dezibel- & Schalldruck-Rechner (dB, Lautstärke & Pascal Pa)",
    shortName: "Dezibel-Rechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: "Dezibel Rechner – dB Schalldruckpegel, Pascal (Pa) & Lautstärke",
    metaDescription: "Berechnen Sie den Schalldruckpegel L_p in Dezibel dB(A) aus Schalldruck in Pascal (Pa) und ermitteln Sie die physikalische Energie- und Lautstärkeverdopplung (+3 dB / +10 dB).",
    h1: "Dezibel Rechner – Schallpegel dB, Schalldruck & Lautstärke",
    shortDescription: "Berechnet Schalldruckpegel in Dezibel und vergleicht Lärmquellen.",
    searchKeywords: ["dezibel rechner schallpegel db a","lautstaerkeverdopplung 3 db 10 db","schalldruck pascal in dezibel berechnen","laerm tabelle dezibel fluestern duese"],
    inputs: [
          {
                "id": "dbValue",
                "label": "Schallpegel in dB(A)",
                "type": "number",
                "defaultValue": 60,
                "min": 0,
                "max": 194,
                "step": 1,
                "unit": "dB"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const db = Number(inputs.dbValue) || 0;
      
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
      };
    },
    formula: "L_p = 20 × log₁₀(p / p₀); p₀ = 20 µPa (Hörschwelle); +3 dB = doppelte Schallenergie; +10 dB = doppelte empfundene Lautstärke",
    formulaExplanation: "Da das menschliche Gehör Schallintensitäten von 1 bis 1.000.000.000.000 verarbeiten kann, wird die Lautstärke auf einer logarithmischen Dezibel-Skala gemessen.",
    workedExample: {
          "title": "Beispiel: Zwei identische 60-dB-Schallquellen gleichzeitig",
          "inputValues": [
                {
                      "label": "Pegel",
                      "value": "60 dB"
                }
          ],
          "steps": [
                "Verdopplung der Schallenergie = +3 dB",
                "Gesamtpegel = 60 + 3 = 63 dB(A)"
          ],
          "result": "63 dB (nicht 120 dB!)"
    },
    faqs: [
          {
                "question": "Was ist der Unterschied zwischen +3 dB und +10 dB?",
                "answer": "+3 dB bedeutet eine Verdoppelung der physikalischen Schallleistung (z. B. zwei Maschinen statt einer). +10 dB empfindet das menschliche Ohr subjektiv als doppelt so laut."
          },
          {
                "question": "Ab welcher Lautstärke drohen Gehörschäden?",
                "answer": "Dauerhafter Lärm ab 85 dB(A) am Arbeitsplatz erfordert nach den Unfallverhütungsvorschriften Gehörschutz. Ab 120 dB(A) liegt die Schmerzschwelle des Gehörs."
          }
    ],
    relatedSlugs: ["druck-umrechner","leistung-umrechner","energie-arbeit-umrechner"],
  },
  {
    id: "hefe-umrechner",
    slug: "hefe-umrechner",
    name: "Hefe-Rechner (Frische Hefe in Trockenhefe & Vorteig umrechnen)",
    shortName: "Hefe-Rechner",
    category: "kochen-backen",
    subcategory: "Backzutaten",
    metaTitle: "Hefe Rechner – Frische Hefe in Trockenhefe umrechnen (1 Würfel = 42g)",
    metaDescription: "Rechnen Sie frische Hefe in Trockenhefe und umgekehrt um: Faustformel 1 Würfel frische Hefe (42 g) = 2 Beutel Trockenhefe (14 g) für 1 kg Mehl.",
    h1: "Hefe Rechner – Frische Hefe in Trockenhefe & Mehlmenge",
    shortDescription: "Konvertiert frische Hefe in Trockenhefe und berechnet die Hefe nach Mehlmenge.",
    searchKeywords: ["hefe umrechner frisch in trockenhefe","1 wuerfel hefe wieviel trockenhefe 42g","trockenhefe in frische hefe umrechnen","hefemenge pro 500g mehl pizza brot"],
    inputs: [
          {
                "id": "inputValue",
                "label": "Menge Hefe",
                "type": "number",
                "defaultValue": 1,
                "min": 0.1,
                "max": 500,
                "step": 0.5,
                "unit": "Einheit"
          },
          {
                "id": "inputUnit",
                "label": "Ausgangs-Einheit",
                "type": "select",
                "defaultValue": "cube",
                "options": [
                      {
                            "value": "cube",
                            "label": "Würfel frische Hefe (1 Würfel = 42 g)"
                      },
                      {
                            "value": "freshG",
                            "label": "Gramm frische Hefe (g)"
                      },
                      {
                            "value": "dryBags",
                            "label": "Päckchen Trockenhefe (1 Pck. = 7 g)"
                      },
                      {
                            "value": "dryG",
                            "label": "Gramm Trockenhefe (g)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const val = Number(inputs.inputValue) || 0;
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
      };
    },
    formula: "Verhältnis: 1 g Trockenhefe = 3 g frische Hefe; 1 Würfel frisch (42 g) = 2 Päckchen trocken (14 g)",
    formulaExplanation: "Da Trockenhefe das entzogene Wasser fehlt, ist ihre Triebkraft dreimal so konzentriert wie die von frischer Blockhefe.",
    workedExample: {
          "title": "Beispiel: Rezept verlangt 1/2 Würfel frische Hefe",
          "inputValues": [
                {
                      "label": "Menge",
                      "value": "0,5 Würfel (21 g)"
                }
          ],
          "steps": [
                "Trockenhefe = 21 g / 3 = 7 g",
                "Entspricht genau 1 Päckchen Trockenhefe"
          ],
          "result": "1 Päckchen Trockenhefe (7 g)"
    },
    faqs: [
          {
                "question": "Muss Trockenhefe angerührt werden?",
                "answer": "Nein, moderne Trockenhefe kann direkt trocken unter das Mehl gemischt werden. Frische Hefe löst man am besten vorher in handwarmem Wasser oder Milch (max. 38°C) mit etwas Zucker auf."
          },
          {
                "question": "Ab welcher Temperatur stirbt Hefe ab?",
                "answer": "Hefezellen sterben ab ca. 45°C unwiderruflich ab. Verwenden Sie beim Anrühren niemals kochendes oder zu heißes Wasser."
          }
    ],
    relatedSlugs: ["pizza-teig-rechner","brot-backen-baeckermass-rechner","sauerteig-anstellgut-rechner"],
  },
  {
    id: "essloeffel-teeloeffel-gramm-rechner",
    slug: "essloeffel-teeloeffel-gramm-rechner",
    name: "Esslöffel- & Teelöffel-in-Gramm-Rechner (EL, TL in g)",
    shortName: "EL & TL in Gramm",
    category: "kochen-backen",
    subcategory: "Küchenmaße",
    metaTitle: "Esslöffel & Teelöffel in Gramm Rechner – EL & TL in g für Zucker, Mehl & Öl",
    metaDescription: "Rechnen Sie Esslöffel (EL) und Teelöffel (TL) in Gramm um für Mehl, Zucker, Salz, Olivenöl, Butter, Backpulver, Honig und Kakaopulver.",
    h1: "Esslöffel & Teelöffel in Gramm Rechner – Zutaten ohne Waage wiegen",
    shortDescription: "Wandelt Esslöffel und Teelöffel in Gramm für beliebige Backzutaten um.",
    searchKeywords: ["essloeffel in gramm rechner zucker mehl","teeloeffel in gramm el tl tabelle","1 el mehl wieviel gramm zucker","1 tl salz backpulver gramm wiegen"],
    inputs: [
          {
                "id": "spoonsCount",
                "label": "Anzahl Löffel",
                "type": "number",
                "defaultValue": 3,
                "min": 0.25,
                "max": 50,
                "step": 0.5,
                "unit": "Löffel"
          },
          {
                "id": "spoonType",
                "label": "Löffelart",
                "type": "select",
                "defaultValue": "elHeaped",
                "options": [
                      {
                            "value": "elLevel",
                            "label": "Esslöffel (EL gestrichen ≈ 15 ml)"
                      },
                      {
                            "value": "elHeaped",
                            "label": "Esslöffel (EL gehäuft)"
                      },
                      {
                            "value": "tlLevel",
                            "label": "Teelöffel (TL gestrichen ≈ 5 ml)"
                      },
                      {
                            "value": "tlHeaped",
                            "label": "Teelöffel (TL gehäuft)"
                      }
                ]
          },
          {
                "id": "ingredient",
                "label": "Zutat",
                "type": "select",
                "defaultValue": "sugar",
                "options": [
                      {
                            "value": "sugar",
                            "label": "Haushaltszucker (gestr. EL 15g, gehäuft 20g / TL 5g)"
                      },
                      {
                            "value": "flour",
                            "label": "Weizenmehl (gestr. EL 10g, gehäuft 15g / TL 4g)"
                      },
                      {
                            "value": "salt",
                            "label": "Speisesalz (gestr. EL 18g, gehäuft 22g / TL 6g)"
                      },
                      {
                            "value": "oil",
                            "label": "Speiseöl / Olivenöl (gestr. EL 14g / TL 5g)"
                      },
                      {
                            "value": "butter",
                            "label": "Butter weich (gestr. EL 15g, gehäuft 20g / TL 5g)"
                      },
                      {
                            "value": "honey",
                            "label": "Honig (gestr. EL 20g, gehäuft 25g / TL 7g)"
                      },
                      {
                            "value": "bakingPowder",
                            "label": "Backpulver / Natron (gestr. EL 12g / gestr. TL 4g)"
                      },
                      {
                            "value": "cocoa",
                            "label": "Kakaopulver (gestr. EL 8g, gehäuft 12g / TL 3g)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const count = Number(inputs.spoonsCount) || 0;
      const sType = String(inputs.spoonType || 'elLevel');
      const ing = String(inputs.ingredient || 'sugar');
      
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
      
      const weightsMap: Record<string, any> = weights;
      const gramPerSpoon = (weightsMap[ing] && weightsMap[ing][sType]) || 15;
      const totalGrams = count * gramPerSpoon;
      
      return {
        primary: { id: 'grams', label: 'Gewicht in Gramm (g)', value: totalGrams, formattedValue: formatNumber(totalGrams, 1) + ' g', highlight: true },
        secondary: [
          { id: 'perSpoon', label: 'Gewicht pro Löffel', value: gramPerSpoon, formattedValue: formatNumber(gramPerSpoon, 1) + ' g/Löffel' },
          { id: 'mlVol', label: 'Flüssigkeitsvolumen ca.', value: String(sType || '').startsWith('el') ? count * 15 : count * 5, formattedValue: (String(sType || '').startsWith('el') ? count * 15 : count * 5) + ' ml' },
        ],
        summaryText: count + ' ' + (sType.includes('el') ? 'Esslöffel' : 'Teelöffel') + ' dieser Zutat wiegen genau ' + formatNumber(totalGrams, 1) + ' Gramm.',
      };
    },
    formula: "Gewicht (g) = Anzahl Löffel × Zutatendichte je Löffelart",
    formulaExplanation: "Ein gestrichener Esslöffel fasst normiert genau 15 ml Flüssigkeit, ein Teelöffel genau 5 ml (3 TL = 1 EL). Das Gewicht hängt von der Schüttdichte der Zutat ab.",
    workedExample: {
          "title": "Beispiel: 3 gehäufte Esslöffel Mehl abmessen",
          "inputValues": [
                {
                      "label": "Menge",
                      "value": "3 gehäufte EL"
                },
                {
                      "label": "Zutat",
                      "value": "Weizenmehl"
                }
          ],
          "steps": [
                "1 gehäufter EL Mehl = ca. 15 g",
                "3 EL × 15 g = 45 g Mehl"
          ],
          "result": "45 g Mehl"
    },
    faqs: [
          {
                "question": "Wie viele Teelöffel passen in einen Esslöffel?",
                "answer": "Genau 3 Teelöffel entsprechen dem Volumen eines Esslöffels (1 TL = 5 ml, 1 EL = 15 ml)."
          },
          {
                "question": "Was wiegt 1 Prise Salz?",
                "answer": "Eine Prise Salz (zwischen Daumen und Zeigefinger) wiegt je nach Fingergröße etwa 0,3 bis 0,5 Gramm."
          }
    ],
    relatedSlugs: ["cups-in-gramm-rechner","gramm-in-ml-rechner","portionsrechner"],
  },
  {
    id: "cups-in-gramm-rechner",
    slug: "cups-in-gramm-rechner",
    name: "US-Cups-in-Gramm-Rechner (Amerikanische Cup-Maße in Gramm)",
    shortName: "Cups in Gramm",
    category: "kochen-backen",
    subcategory: "Küchenmaße",
    metaTitle: "Cups in Gramm Rechner – US Cups in g für Mehl, Zucker & Butter",
    metaDescription: "Rechnen Sie amerikanische Rezepte um: US Cups in Gramm für Mehl (125g), Kristallzucker (200g), braunen Zucker (220g), Butter (227g), Haferflocken und Kakao.",
    h1: "Cups in Gramm Rechner – Amerikanische Cups in Gramm wiegen",
    shortDescription: "Wandelt US Cups in Gramm nach Zutat für US-Backrezepte um.",
    searchKeywords: ["cups in gramm rechner us cups mehl zucker","1 cup mehl in gramm wieviel","1 cup butter in gramm 227g","amerikanischer cup umrechner backen"],
    inputs: [
          {
                "id": "cupsAmount",
                "label": "Anzahl Cups",
                "type": "number",
                "defaultValue": 1,
                "min": 0.125,
                "max": 20,
                "step": 0.125,
                "unit": "Cups"
          },
          {
                "id": "ingredient",
                "label": "Zutat",
                "type": "select",
                "defaultValue": "flour",
                "options": [
                      {
                            "value": "flour",
                            "label": "Weizenmehl All-Purpose (1 Cup ≈ 125 g)"
                      },
                      {
                            "value": "sugarWhite",
                            "label": "Weißer Kristallzucker (1 Cup ≈ 200 g)"
                      },
                      {
                            "value": "sugarBrown",
                            "label": "Brauner Zucker / Packed (1 Cup ≈ 220 g)"
                      },
                      {
                            "value": "sugarPowder",
                            "label": "Puderzucker / Confectioners (1 Cup ≈ 120 g)"
                      },
                      {
                            "value": "butter",
                            "label": "Butter (1 Cup = 2 Sticks = 227 g)"
                      },
                      {
                            "value": "oats",
                            "label": "Haferflocken (1 Cup ≈ 90 g)"
                      },
                      {
                            "value": "chocolateChips",
                            "label": "Schokodrops / Chocolate Chips (1 Cup ≈ 175 g)"
                      },
                      {
                            "value": "liquids",
                            "label": "Flüssigkeiten (Milch, Wasser, Öl – 1 Cup ≈ 240 ml)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const cups = Number(inputs.cupsAmount) || 0;
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
      
      const cupWeightsMap: Record<string, any> = cupWeights;
      const gPerCup = cupWeightsMap[ing] || 125;
      const totalGrams = cups * gPerCup;
      const mlVolume = cups * 236.588; // 1 US Legal Cup = ca. 240 ml, Customary = 236.6 ml
      
      return {
        primary: { id: 'grams', label: 'Gewicht in Gramm (g)', value: totalGrams, formattedValue: formatNumber(totalGrams, 1) + ' g', highlight: true },
        secondary: [
          { id: 'volumeMl', label: 'Flüssigkeitsvolumen (ml)', value: mlVolume, formattedValue: formatNumber(mlVolume, 0) + ' ml' },
          { id: 'perCup', label: 'Dichte je 1 Cup', value: gPerCup, formattedValue: gPerCup + ' g / Cup' },
        ],
        summaryText: cups + ' Cup(s) dieser Zutat entsprechen genau ' + formatNumber(totalGrams, 1) + ' Gramm (Volumen ca. ' + formatNumber(mlVolume, 0) + ' ml).',
      };
    },
    formula: "Gewicht (g) = Cups × Zutatengewicht pro Cup; 1 US Cup = ca. 236,6 ml",
    formulaExplanation: "Ein US-Cup ist ein reines Volumenmaß (ca. 240 ml). Da 240 ml lockeres Mehl viel leichter sind als 240 ml kompakter Zucker, wiegt ein Cup Mehl nur 125 g, während ein Cup Zucker 200 g wiegt.",
    workedExample: {
          "title": "Beispiel: US-Brownie-Rezept mit 1,5 Cups braunem Zucker und 1 Cup Mehl",
          "inputValues": [
                {
                      "label": "Brauner Zucker",
                      "value": "1,5 Cups"
                },
                {
                      "label": "Mehl",
                      "value": "1 Cup"
                }
          ],
          "steps": [
                "Brauner Zucker = 1,5 × 220 g = 330 g",
                "Mehl = 1 × 125 g = 125 g"
          ],
          "result": "330 g brauner Zucker und 125 g Mehl"
    },
    faqs: [
          {
                "question": "Was ist 1 Stick of Butter in US-Rezepten?",
                "answer": "In den USA wird Butter in Stangen (\"Sticks\") verkauft. 1 Stick Butter entspricht genau 1/2 Cup = 8 Esslöffel = 113,4 Gramm. Ein ganzes deutsches Butterstück (250 g) entspricht ca. 2,2 Sticks."
          },
          {
                "question": "Was bedeutet \"packed brown sugar\"?",
                "answer": "Bei braunem Zucker bedeutet \"packed\", dass der feuchte Zucker mit dem Löffel fest in den Cup gedrückt werden muss, bis keine Hohlräume mehr vorhanden sind."
          }
    ],
    relatedSlugs: ["essloeffel-teeloeffel-gramm-rechner","gramm-in-ml-rechner","portionsrechner"],
  },
  {
    id: "zucker-ersatz-rechner",
    slug: "zucker-ersatz-rechner",
    name: "Zuckerersatz-Rechner (Erythrit, Xylit, Stevia & Honig)",
    shortName: "Zuckerersatz-Rechner",
    category: "kochen-backen",
    subcategory: "Ernährung & Diät",
    metaTitle: "Zuckerersatz Rechner – Zucker in Erythrit, Xylit & Stevia umrechnen",
    metaDescription: "Rechnen Sie Haushaltszucker um in Erythrit (70 % Süßkraft), Birkenzucker/Xylit (100 %), Honig, Stevia und Agavendicksaft inklusive Kalorieneinsparung.",
    h1: "Zuckerersatz Rechner – Süßkraft & Kalorieneinsparung berechnen",
    shortDescription: "Ermittelt die Menge von Erythrit, Xylit, Honig und Stevia als Zuckerersatz.",
    searchKeywords: ["zuckerersatz rechner erythrit xylit","zucker in birkenzucker umrechnen 1 zu 1","erythrit suesskraft 70 prozent berechnen","zucker durch honig ersetzen backen"],
    inputs: [
          {
                "id": "sugarGrams",
                "label": "Zuckermenge im Originalrezept",
                "type": "number",
                "defaultValue": 100,
                "min": 1,
                "max": 2000,
                "step": 10,
                "unit": "g Zucker"
          },
          {
                "id": "substitute",
                "label": "Gewünschte Zuckeralternative",
                "type": "select",
                "defaultValue": "erythrit",
                "options": [
                      {
                            "value": "erythrit",
                            "label": "Erythrit (ca. 70 % Süßkraft, 0 kcal – Faktor 1,3 bis 1,4)"
                      },
                      {
                            "value": "xylit",
                            "label": "Xylit / Birkenzucker (100 % Süßkraft, 40 % weniger kcal – 1:1)"
                      },
                      {
                            "value": "honey",
                            "label": "Honig (ca. 120 % Süßkraft, feucht – ca. 80 g je 100 g Zucker)"
                      },
                      {
                            "value": "agave",
                            "label": "Agavendicksaft (ca. 125 % Süßkraft – ca. 75 g je 100 g Zucker)"
                      },
                      {
                            "value": "stevia",
                            "label": "Stevia Pulver/Streusüße 1:1 (kalorienfrei)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const sugarG = Number(inputs.sugarGrams) || 0;
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
        summaryText: 'Für ' + sugarG + ' g Haushaltszucker benötigen Sie ' + subGrams + ' g ' + (String(sub || '').toUpperCase()) + '. Dadurch sparen Sie rund ' + Math.round(savedKcal) + ' kcal ein!',
      };
    },
    formula: "Erythrit = Zucker × 1,35; Xylit = Zucker × 1,0; Honig = Zucker × 0,80; Eingesparte kcal = (Zucker × 4) - (Ersatz × kcal)",
    formulaExplanation: "Da Erythrit nur etwa 70 % der Süßkraft von Kristallzucker besitzt, muss man ca. 130 bis 140 g Erythrit verwenden, um 100 g Zucker geschmacklich zu ersetzen.",
    workedExample: {
          "title": "Beispiel: Kuchen mit 150 g Zucker auf Erythrit umstellen",
          "inputValues": [
                {
                      "label": "Zucker",
                      "value": "150 g"
                },
                {
                      "label": "Ersatz",
                      "value": "Erythrit"
                }
          ],
          "steps": [
                "Erythrit = 150 × 1,35 = 202,5 g ≈ 200 g",
                "Eingespart: 150 g Zucker = 600 kcal -> 0 kcal mit Erythrit"
          ],
          "result": "200 g Erythrit (600 kcal gespart)"
    },
    faqs: [
          {
                "question": "Ist Xylit giftig für Hunde?",
                "answer": "JA, LEBENSGEFÄHRLICH! Xylit (Birkenzucker) führt bei Hunden schon in kleinsten Mengen zu einer massiven Insulinausschüttung, schwerem Schock und akutem Leberversagen. Halten Sie Xylit-Gebäck streng von Haustieren fern!"
          },
          {
                "question": "Karameillisiert Erythrit beim Backen wie Zucker?",
                "answer": "Nein, Erythrit karamellisiert nicht und bräunt das Gebäck kaum. Zudem kann es bei höherer Dosierung einen leicht kühlen Nachgeschmack auf der Zunge hinterlassen."
          }
    ],
    relatedSlugs: ["kalorien-rezept-rechner","cups-in-gramm-rechner","portionsrechner"],
  },
  {
    id: "backzeit-temperatur-umluft-oberhitze-rechner",
    slug: "backzeit-temperatur-umluft-oberhitze-rechner",
    name: "Backofen Umrechner (Umluft in Ober-/Unterhitze & Gasstufe)",
    shortName: "Backofen Umrechner",
    category: "kochen-backen",
    subcategory: "Backzutaten",
    metaTitle: "Backofen Umrechner – Umluft in Ober-/Unterhitze & Gasstufe umrechnen",
    metaDescription: "Rechnen Sie Backofentemperaturen um: Umluft / Heißluft zu Ober-/Unterhitze (Faustregel: 20°C Unterschied) inklusive Backzeitanpassung und Gasbackofen-Stufen 1–8.",
    h1: "Backofen Umrechner – Umluft & Ober-/Unterhitze anpassen",
    shortDescription: "Wandelt Backtemperatur und Backzeit zwischen Umluft und Ober-/Unterhitze um.",
    searchKeywords: ["backofen umrechner umluft in ober unterhitze","temperatur heissluft oberhitze 20 grad weniger","gasbackofen stufe temperatur tabelle","backzeit anpassen umluft heissluft"],
    inputs: [
          {
                "id": "temperature",
                "label": "Temperatur im Rezept",
                "type": "number",
                "defaultValue": 180,
                "min": 50,
                "max": 300,
                "step": 5,
                "unit": "°C"
          },
          {
                "id": "sourceMode",
                "label": "Rezeptangabe bezieht sich auf",
                "type": "select",
                "defaultValue": "topBottom",
                "options": [
                      {
                            "value": "topBottom",
                            "label": "Ober-/Unterhitze (im Rezept angegeben)"
                      },
                      {
                            "value": "convection",
                            "label": "Umluft / Heißluft (im Rezept angegeben)"
                      }
                ]
          },
          {
                "id": "bakeTimeMins",
                "label": "Backzeit im Rezept",
                "type": "number",
                "defaultValue": 45,
                "min": 5,
                "max": 240,
                "step": 5,
                "unit": "Minuten"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const temp = Number(inputs.temperature) || 180;
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
      };
    },
    formula: "Umluft = Ober-/Unterhitze - 20 °C; Gasstufe ≈ (Oberhitze °C - 120) / 20; Backzeit Umluft ≈ 90 % der Ober-/Unterhitze-Zeit",
    formulaExplanation: "Da der Ventilator bei Umluft die heiße Luft kontinuierlich und direkt an das Backgut bläst, ist die Wärmeübertragung wesentlich effizienter als bei stehender Luft.",
    workedExample: {
          "title": "Beispiel: Kuchenrezept verlangt 180 °C Ober-/Unterhitze für 50 Minuten",
          "inputValues": [
                {
                      "label": "Rezept",
                      "value": "180 °C Ober-/Unterhitze"
                },
                {
                      "label": "Zeit",
                      "value": "50 Minuten"
                }
          ],
          "steps": [
                "Umluft-Temperatur = 180 - 20 = 160 °C",
                "Umluft-Backzeit = 50 × 0,90 = 45 Minuten"
          ],
          "result": "160 °C Umluft für ca. 45 Minuten"
    },
    faqs: [
          {
                "question": "Wann sollte man Ober-/Unterhitze statt Umluft bevorzugen?",
                "answer": "Für empfindliche Biskuitböden, Soufflés, Brandteig (Windbeutel) und Käsekuchen ist Ober-/Unterhitze besser geeignet, da der Luftstrom bei Umluft das Gebäck austrocknen oder ungleichmäßig aufgehen lassen kann."
          },
          {
                "question": "Kann man bei Umluft auf mehreren Blechen gleichzeitig backen?",
                "answer": "Ja! Das ist der größte Vorteil von Umluft: Durch die gleichmäßige Hitzeverteilung können 2 bis 3 Bleche Plätzchen oder Pizzen problemlos gleichzeitig gebacken werden."
          }
    ],
    relatedSlugs: ["temperatur-umrechner","backform-umrechner","pizza-teig-rechner"],
  },
  {
    id: "fleisch-kerntemperatur-garzeit-rechner",
    slug: "fleisch-kerntemperatur-garzeit-rechner",
    name: "Fleisch-Kerntemperatur- & Garzeit-Rechner (Rind, Schwein & Geflügel)",
    shortName: "Kerntemperatur-Rechner",
    category: "kochen-backen",
    subcategory: "Fleisch & Fisch",
    metaTitle: "Kerntemperatur Rechner – Rind, Schwein, Hähnchen, Lamm & Roastbeef",
    metaDescription: "Finden Sie die perfekte Kerntemperatur und Garzeit für Rindersteak, Roastbeef, Schweinebraten, Pulled Pork, Hähnchen und Lammkeule nach Garstufen.",
    h1: "Kerntemperatur Rechner – Perfekte Garstufe für Braten & Steak",
    shortDescription: "Ermittelt Ziel-Kerntemperatur und Garzeit nach Fleischart und Garstufe.",
    searchKeywords: ["kerntemperatur fleisch tabelle rechner","roastbeef kerntemperatur medium 56 grad","schweinebraten kerntemperatur garzeit rechner","haehnchen gefluegel kerntemperatur sicher"],
    inputs: [
          {
                "id": "meatType",
                "label": "Fleischart & Zuschnitt",
                "type": "select",
                "defaultValue": "beefRoast",
                "options": [
                      {
                            "value": "beefSteak",
                            "label": "Rindersteak / Filet (Kurzgebraten)"
                      },
                      {
                            "value": "beefRoast",
                            "label": "Roastbeef / Rinderbraten (Niedriggaren)"
                      },
                      {
                            "value": "porkRoast",
                            "label": "Schweinebraten / Krustenbraten"
                      },
                      {
                            "value": "pulledPork",
                            "label": "Pulled Pork (Schweinenacken Smoker/Ofen)"
                      },
                      {
                            "value": "poultry",
                            "label": "Geflügel (Hähnchen, Pute – durchgegart)"
                      },
                      {
                            "value": "lamb",
                            "label": "Lammkeule / Lammkarree"
                      }
                ]
          },
          {
                "id": "doneness",
                "label": "Garstufe",
                "type": "select",
                "defaultValue": "medium",
                "options": [
                      {
                            "value": "rare",
                            "label": "Rare / Blutig (ca. 48-52 °C)"
                      },
                      {
                            "value": "mediumRare",
                            "label": "Medium Rare / Rosa Kern (ca. 53-56 °C – Steak-Favorit)"
                      },
                      {
                            "value": "medium",
                            "label": "Medium / Zartrosa (ca. 57-60 °C)"
                      },
                      {
                            "value": "wellDone",
                            "label": "Well Done / Vollständig durchgegart (ab 68-75 °C)"
                      }
                ]
          },
          {
                "id": "weightKg",
                "label": "Fleischgewicht",
                "type": "number",
                "defaultValue": 1.5,
                "min": 0.2,
                "max": 10,
                "step": 0.1,
                "unit": "kg"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const meat = inputs.meatType;
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
      };
    },
    formula: "Garzeit ≈ Fleischgewicht (kg) × Spezifische Min./kg; Messung an der dicksten Fleischstelle",
    formulaExplanation: "Ein Bratenthermometer muss stets an der dicksten Stelle des Fleischstücks platziert werden, ohne dabei Knochen zu berühren, da Knochen Hitze schneller leiten.",
    workedExample: {
          "title": "Beispiel: 1,5 kg Roastbeef Niedriggaren auf Medium Rare (55 °C)",
          "inputValues": [
                {
                      "label": "Fleisch",
                      "value": "Roastbeef 1,5 kg"
                },
                {
                      "label": "Garstufe",
                      "value": "Medium Rare"
                }
          ],
          "steps": [
                "Zielkerntemperatur = 55 °C",
                "Ofentemperatur = 110 °C",
                "Dauer: 1,5 kg × 80 Min. ≈ 120 Minuten (2 Stunden)"
          ],
          "result": "55 °C Kerntemperatur (ca. 2 Stunden Garzeit)"
    },
    faqs: [
          {
                "question": "Warum muss Fleisch nach dem Braten ruhen?",
                "answer": "Beim Garen drängt der Fleischsaft ins Zentrum des Fleisches. Während der 5-10 Minuten Ruhezeit entspannen sich die Muskelfasern und der Saft verteilt sich wieder gleichmäßig, sodass er beim Anschnitt nicht ausläuft."
          },
          {
                "question": "Ab welcher Kerntemperatur ist Geflügel sicher gegen Salmonellen?",
                "answer": "Geflügel muss an allen Stellen eine Mindestkerntemperatur von 72 bis 75 °C für mindestens 2 Minuten erreichen, um Salmonellen zuverlässig abzutöten."
          }
    ],
    relatedSlugs: ["backzeit-temperatur-umluft-oberhitze-rechner","portionsrechner","salz-lake-poekel-rechner"],
  },
  {
    id: "pizza-teig-rechner",
    slug: "pizza-teig-rechner",
    name: "Pizzateig-Rechner (Hydratation 60–70 %, Mehl, Wasser & Hefe)",
    shortName: "Pizzateig-Rechner",
    category: "kochen-backen",
    subcategory: "Backzutaten",
    metaTitle: "Pizza Teig Rechner – Neapolitanische Pizza Teigausbeute & Hydratation",
    metaDescription: "Berechnen Sie die exakten Zutaten für echten neapolitanischen Pizzateig nach Ballenanzahl, Ballengewicht (z. B. 260 g), Teighydratation (Wassergehalt 60-70 %) und Reifezeit.",
    h1: "Pizza Teig Rechner – Mehl, Wasser, Hefe & Salz für Neapel-Pizza",
    shortDescription: "Berechnet Pizzateig-Zutaten nach Hydratation und Ballenanzahl.",
    searchKeywords: ["pizza teig rechner neapolitanisch hydratation","pizzateig mehl wasser hefe salz berechnen","ballengewicht pizza 260g","pizzateig fuehrung reifezeit hefe gramm"],
    inputs: [
          {
                "id": "ballsCount",
                "label": "Anzahl Pizzen / Teigballen",
                "type": "number",
                "defaultValue": 4,
                "min": 1,
                "max": 100,
                "step": 1,
                "unit": "Pizzen"
          },
          {
                "id": "ballWeightG",
                "label": "Gewicht pro Teigballen",
                "type": "number",
                "defaultValue": 260,
                "min": 180,
                "max": 400,
                "step": 10,
                "unit": "g"
          },
          {
                "id": "hydrationPercent",
                "label": "Hydratation (Wasseranteil bezogen auf Mehl)",
                "type": "number",
                "defaultValue": 65,
                "min": 55,
                "max": 80,
                "step": 1,
                "unit": "%"
          },
          {
                "id": "saltPercent",
                "label": "Salzgehalt bezogen auf Mehl",
                "type": "number",
                "defaultValue": 3,
                "min": 2,
                "max": 4,
                "step": 0.1,
                "unit": "%"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const count = Number(inputs.ballsCount) || 4;
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
      };
    },
    formula: "Mehl = Gesamtteig / (1 + Hydratation + Salzfaktor + Hefefaktor); Wasser = Mehl × Hydratation",
    formulaExplanation: "In der neapolitanischen Pizza-Tradition (AVPN) werden alle Zutaten als Prozentsatz der Mehlmenge (Bäckerprozente) angegeben. Eine Hydratation von 65 % bedeutet 650 g Wasser auf 1.000 g Mehl.",
    workedExample: {
          "title": "Beispiel: 4 neapolitanische Pizzen à 260 g mit 65 % Hydratation",
          "inputValues": [
                {
                      "label": "Ballen",
                      "value": "4 Stück à 260 g (1.040 g Teig)"
                },
                {
                      "label": "Wasser",
                      "value": "65 %"
                },
                {
                      "label": "Salz",
                      "value": "3 %"
                }
          ],
          "steps": [
                "Teilungsfaktor = 1 + 0,65 + 0,03 + 0,002 = 1,682",
                "Mehl = 1.040 / 1,682 = 618 g",
                "Wasser = 618 × 0,65 = 402 g",
                "Salz = 618 × 0,03 = 18,5 g"
          ],
          "result": "618 g Mehl, 402 g Wasser, 18,5 g Salz, ca. 1,2 g Hefe"
    },
    faqs: [
          {
                "question": "Welches Mehl eignet sich am besten für neapolitanische Pizza?",
                "answer": "Italienisches Weizenmehl vom Typ \"Tipo 00\" mit hohem Proteingehalt (W-Wert 280 bis 320, ca. 12-14 % Eiweiß) bildet ein dehnbares Glutengerüst für große Luftblasen im Rand (Cornicione)."
          },
          {
                "question": "Warum benötigt man für 24 Stunden Teigruhe so wenig Hefe?",
                "answer": "Bei langer, kühler Stück- und Stockgare (z. B. im Kühlschrank) haben die Hefebakterien viel Zeit, sich langsam zu vermehren. Dadurch wird der Teig extrem bekömmlich und aromatisch."
          }
    ],
    relatedSlugs: ["hefe-umrechner","brot-backen-baeckermass-rechner","sauerteig-anstellgut-rechner"],
  },
  {
    id: "brot-backen-baeckermass-rechner",
    slug: "brot-backen-baeckermass-rechner",
    name: "Bäckerprozente-Rechner (Bäckermaß für Brot & Teigausbeute TA)",
    shortName: "Bäckerprozente-Rechner",
    category: "kochen-backen",
    subcategory: "Backzutaten",
    metaTitle: "Bäckerprozente Rechner – Bäckermaß, Teigausbeute (TA) & Zutaten berechnen",
    metaDescription: "Berechnen Sie Brotteige nach professionellen Bäckerprozenten (Mehl = 100 %) und Teigausbeute (TA 160 bis TA 180) für Mehl, Wasser, Hefe, Salz und Sauerteig.",
    h1: "Bäckerprozente Rechner – Teigausbeute (TA) & Rezeptskalierung",
    shortDescription: "Berechnet Brotrezepte nach Bäckerprozenten bezogen auf 100 % Mehl.",
    searchKeywords: ["baeckerprozente rechner brot backen","teigausbeute ta berechnen formel ta 170","baeckermath zutaten mehl 100 prozent","brotteig zutaten rechner sauerteig"],
    inputs: [
          {
                "id": "targetLoafG",
                "label": "Gewünschtes Gesamtgewicht des Teiglings",
                "type": "number",
                "defaultValue": 1000,
                "min": 300,
                "max": 10000,
                "step": 50,
                "unit": "g Teig"
          },
          {
                "id": "hydrationPercent",
                "label": "Flüssigkeitsanteil / Wasser (z. B. 70 % = TA 170)",
                "type": "number",
                "defaultValue": 70,
                "min": 50,
                "max": 90,
                "step": 1,
                "unit": "%"
          },
          {
                "id": "saltPercent",
                "label": "Salzanteil (Standard 2,0 %)",
                "type": "number",
                "defaultValue": 2,
                "min": 1,
                "max": 3.5,
                "step": 0.1,
                "unit": "%"
          },
          {
                "id": "sourdoughPercent",
                "label": "Sauerteiganteil / Anstellgut bezogen auf Mehl",
                "type": "number",
                "defaultValue": 20,
                "min": 0,
                "max": 50,
                "step": 5,
                "unit": "%"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const totalG = Number(inputs.targetLoafG) || 1000;
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
      };
    },
    formula: "Bäckerprozente: Zutat (%) = (Gewicht Zutat / Gewicht Mehl) × 100; Teigausbeute TA = (Teigmasse / Mehlmasse) × 100",
    formulaExplanation: "Im Bäckermaß ist die Gesamtmehlmenge immer die 100%-Basis. Eine Teigausbeute (TA) von 170 bedeutet, dass auf 100 Teile Mehl genau 70 Teile Wasser kommen.",
    workedExample: {
          "title": "Beispiel: 1.000 g Brotlaib mit TA 170 (70 % Wasser, 2 % Salz, 20 % Sauerteig)",
          "inputValues": [
                {
                      "label": "Teiggewicht",
                      "value": "1.000 g"
                },
                {
                      "label": "TA",
                      "value": "170 (70 %)"
                }
          ],
          "steps": [
                "Summe = 100 % + 70 % + 2 % + 20 % = 192 %",
                "Mehl = 1.000 g / 1,92 = 521 g",
                "Wasser = 521 × 0,70 = 365 g",
                "Sauerteig = 521 × 0,20 = 104 g",
                "Salz = 521 × 0,02 = 10,4 g"
          ],
          "result": "521 g Mehl, 365 g Wasser, 104 g Sauerteig, 10,4 g Salz"
    },
    faqs: [
          {
                "question": "Was bedeutet eine hohe Teigausbeute (z. B. TA 175)?",
                "answer": "Je höher die Teigausbeute, desto weicher und saftiger ist der Teig und desto länger bleibt das gebackene Brot frisch. Sehr weiche Teige (hohe TA) erfordern jedoch Dehnen und Falten."
          },
          {
                "question": "Warum wiegen Bäcker Wasser in Gramm statt Millilitern?",
                "answer": "Da 1 Gramm Wasser bei Küchentemperatur exakt 1 Milliliter entspricht, ist das Wiegen auf der digitalen Küchenwaage viel präziser als das Ablesen am Messbecher."
          }
    ],
    relatedSlugs: ["pizza-teig-rechner","sauerteig-anstellgut-rechner","hefe-umrechner"],
  },
  {
    id: "alkohol-verkochungs-rechner",
    slug: "alkohol-verkochungs-rechner",
    name: "Alkohol-Verkochungs-Rechner (Restalkohol in Saucen & Schmorgerichten)",
    shortName: "Alkohol verkochen",
    category: "kochen-backen",
    subcategory: "Kochen & Garen",
    metaTitle: "Alkohol Verkochen Rechner – Restalkohol nach Kochzeit berechnen (USDA)",
    metaDescription: "Berechnen Sie, wie viel Alkohol beim Kochen mit Wein oder Bier wirklich verdampft. Wissenschaftliche Werte nach USDA-Studie: Restalkohol nach 15 bis 120 Minuten Köcheln.",
    h1: "Alkohol Verkochen Rechner – Wie viel Restalkohol bleibt im Essen?",
    shortDescription: "Berechnet den verbleibenden Restalkoholgehalt in Gerichten nach Kochzeit.",
    searchKeywords: ["alkohol verkochen rechner usda tabelle","wieviel restalkohol nach 30 minuten kochen rotwein","verkocht alkohol vollstaendig schmorgericht","sauce mit wein fuer kinder schwangere restalkohol"],
    inputs: [
          {
                "id": "alcoholMl",
                "label": "Zugegebene Alkoholmenge (z. B. Rotwein, Weißwein, Bier)",
                "type": "number",
                "defaultValue": 250,
                "min": 10,
                "max": 2000,
                "step": 25,
                "unit": "ml"
          },
          {
                "id": "volPercent",
                "label": "Alkoholgehalt des Getränks",
                "type": "number",
                "defaultValue": 13,
                "min": 1,
                "max": 80,
                "step": 0.5,
                "unit": "Vol.-%"
          },
          {
                "id": "cookingMethod",
                "label": "Zubereitungsart & Kochzeit (nach USDA Nutrient Data)",
                "type": "select",
                "defaultValue": "simmer30",
                "options": [
                      {
                            "value": "flambee",
                            "label": "Flambieren (kurz angezündet – ca. 75 % Restalkohol)"
                      },
                      {
                            "value": "stir15",
                            "label": "Kurz aufgekocht / 15 Min. köcheln (ca. 40 % Restalkohol)"
                      },
                      {
                            "value": "simmer30",
                            "label": "30 Minuten leicht köcheln (ca. 35 % Restalkohol)"
                      },
                      {
                            "value": "simmer60",
                            "label": "1 Stunde köcheln (ca. 25 % Restalkohol)"
                      },
                      {
                            "value": "simmer120",
                            "label": "2 Stunden Schmorgericht (ca. 10 % Restalkohol)"
                      },
                      {
                            "value": "simmer150",
                            "label": "Über 2,5 Stunden geschmort (ca. 5 % Restalkohol)"
                      }
                ]
          },
          {
                "id": "portionsCount",
                "label": "Anzahl Portionen des Gerichts",
                "type": "number",
                "defaultValue": 4,
                "min": 1,
                "max": 20,
                "step": 1,
                "unit": "Portionen"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const ml = Number(inputs.alcoholMl) || 0;
      const vol = Number(inputs.volPercent) || 0;
      const portions = Number(inputs.portionsCount) || 4;
      
      // Reines Ethanol in Gramm (Dichte Ethanol ≈ 0.789 g/ml):
      // Reines Alkoholvolumen: ml * (vol / 100)
      const pureAlcoholMl = ml * (vol / 100);
      const pureAlcoholGramsInitial = pureAlcoholMl * 0.789;
      
      let retentionRate = 0.35; // 30 Min.
      if (inputs.cookingMethod === 'flambee') retentionRate = 0.75;
      else if (inputs.cookingMethod === 'stir15') retentionRate = 0.40;
      else if (inputs.cookingMethod === 'simmer60') retentionRate = 0.25;
      else if (inputs.cookingMethod === 'simmer120') retentionRate = 0.10;
      else if (inputs.cookingMethod === 'simmer150') retentionRate = 0.05;
      
      const remainingAlcoholGrams = pureAlcoholGramsInitial * retentionRate;
      const remainingPerPortionG = remainingAlcoholGrams / portions;
      // Zum Vergleich: 1 kleines Glas Bier (0.2l 5%) hat ca. 8g reinen Alkohol
      const beerGlassEquiv = remainingPerPortionG / 8.0;
      
      return {
        primary: { id: 'remainingGrams', label: 'Verbleibender Restalkohol gesamt', value: remainingAlcoholGrams, formattedValue: formatNumber(remainingAlcoholGrams, 1) + ' g reiner Alkohol', highlight: true },
        secondary: [
          { id: 'perPortion', label: 'Restalkohol pro Portion', value: remainingPerPortionG, formattedValue: formatNumber(remainingPerPortionG, 2) + ' g je Portion' },
          { id: 'retentionPct', label: 'Verbliebener Prozentanteil', value: retentionRate * 100, formattedValue: (retentionRate * 100) + ' % des Alkohols' },
          { id: 'safetyHint', label: 'Eignung für Kinder & Schwangere', value: 0, formattedValue: remainingPerPortionG < 0.2 ? 'Spuren (vergleichbar mit reifem Fruchtsaft)' : 'Nicht empfohlen für Schwangere & Kinder' },
        ],
        summaryText: 'Von ursprünglich ' + formatNumber(pureAlcoholGramsInitial, 1) + ' g Alkohol verbleiben nach dem Garen noch rund ' + formatNumber(remainingAlcoholGrams, 1) + ' g (' + (retentionRate * 100) + ' %) im Essen – das sind ca. ' + formatNumber(remainingPerPortionG, 2) + ' g pro Portion.',
      };
    },
    formula: "Restalkohol = Zugegebene Menge × Vol.-% × 0,789 × Rückhaltefaktor (nach USDA-Studie)",
    formulaExplanation: "Entgegen dem weit verbreiteten Mythos verkocht Alkohol beim Kochen keineswegs vollständig. Selbst nach 2 Stunden Schmoren verbleiben noch ca. 10 % des ursprünglichen Alkohols im Gericht.",
    workedExample: {
          "title": "Beispiel: 250 ml Rotwein (13 Vol.-%) in 4 Portionen Gulasch, 2 Stunden geschmort",
          "inputValues": [
                {
                      "label": "Wein",
                      "value": "250 ml"
                },
                {
                      "label": "Alkohol",
                      "value": "13 Vol.-%"
                },
                {
                      "label": "Kochzeit",
                      "value": "2 Stunden (10 % Rest)"
                }
          ],
          "steps": [
                "Ausgangsalkohol = 250 × 0,13 × 0,789 = 25,6 g reines Ethanol",
                "Rest nach 2h = 25,6 g × 0,10 = 2,56 g gesamt",
                "Pro Portion (bei 4 Portionen) = 2,56 / 4 = 0,64 g Alkohol"
          ],
          "result": "0,64 g reiner Alkohol pro Portion"
    },
    faqs: [
          {
                "question": "Verkocht Alkohol beim Flambieren?",
                "answer": "Nein, beim kurzen Flambieren verbrennt fast nur der Alkoholdampf an der Oberfläche. Rund 75 % des gesamten Alkohols verbleiben in der Speise."
          },
          {
                "question": "Dürfen Kinder Gerichte essen, die mit Wein gekocht wurden?",
                "answer": "Aus toxikologischer Sicht ist die Dosis nach langem Schmoren gering, Suchtexperten und Kinderärzte raten jedoch ab, um Kinder nicht frühzeitig an den typischen Weingeschmack zu gewöhnen."
          }
    ],
    relatedSlugs: ["cocktail-alkoholgehalt-rechner","fleisch-kerntemperatur-garzeit-rechner","portionsrechner"],
  },
  {
    id: "eiweiss-eigelb-ersatz-rechner",
    slug: "eiweiss-eigelb-ersatz-rechner",
    name: "Ei-Ersatz-Rechner (Vegane Alternativen für Backen & Kochen)",
    shortName: "Ei-Ersatz-Rechner",
    category: "kochen-backen",
    subcategory: "Ernährung & Diät",
    metaTitle: "Ei-Ersatz Rechner – Eier vegan ersetzen beim Backen & Kochen",
    metaDescription: "Berechnen Sie die optimale Menge an Ei-Ersatz für 1 bis 10 Eier: Apfelmark (60 bis 80 g), reife Banane (1/2 Stk.), Chiasamen, gemahlene Leinsamen oder Seidentofu.",
    h1: "Ei-Ersatz Rechner – Vegane Alternativen für Rührkuchen & Waffeln",
    shortDescription: "Ermittelt Mengenangaben für pflanzliche Ei-Alternativen beim Backen.",
    searchKeywords: ["ei ersatz rechner vegan backen","1 ei ersetzen durch apfelmus banane chiasamen","veganer eiersatz rührkuchen menge","leinsamen eiersatz verhaeltnis wasser"],
    inputs: [
          {
                "id": "eggsCount",
                "label": "Anzahl zu ersetzender Eier (Größe M)",
                "type": "number",
                "defaultValue": 2,
                "min": 1,
                "max": 12,
                "step": 1,
                "unit": "Eier"
          },
          {
                "id": "subType",
                "label": "Bevorzugter Ei-Ersatz",
                "type": "select",
                "defaultValue": "applesauce",
                "options": [
                      {
                            "value": "applesauce",
                            "label": "Apfelmark / Apfelmus (saftig für Rührkuchen – 60 bis 80 g je Ei)"
                      },
                      {
                            "value": "banana",
                            "label": "Reife Banane püriert (für süße Kuchen/Pancakes – 1/2 Banane je Ei)"
                      },
                      {
                            "value": "flaxseed",
                            "label": "Leinsamen-Ei / Chia-Ei (1 EL gemahlen + 3 EL Wasser je Ei)"
                      },
                      {
                            "value": "silkenTofu",
                            "label": "Seidentofu püriert (neutral für Quiches/Kuchen – 60 g je Ei)"
                      },
                      {
                            "value": "aquafaba",
                            "label": "Aquafaba / Kichererbsenwasser (für Eischnee/Baiser – 3 EL je Eiweiß)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const count = Number(inputs.eggsCount) || 1;
      const sub = inputs.subType;
      
      let amountStr = '';
      let unitStr = '';
      let tip = '';
      
      if (sub === 'applesauce') {
        amountStr = (count * 70) + ' g';
        tip = 'Macht Rührteige wunderbar saftig. Ideal für Schoko- und Gewürzkuchen; kein Eigengeschmack spürbar.';
      } else if (sub === 'banana') {
        amountStr = (count * 0.5) + ' Banane(n) (ca. ' + (count * 50) + ' g)';
        tip = 'Sehr reife Banane mit der Gabel zerdrücken. Bringt Eigensüße mit – Zuckermenge im Teig evtl. leicht reduzieren!';
      } else if (sub === 'flaxseed') {
        amountStr = (count * 1) + ' EL gemahlene Leinsamen + ' + (count * 3) + ' EL warmes Wasser';
        tip = 'Leinsamen mit Wasser verrühren und 10 Minuten quellen lassen, bis eine gelartige Masse entsteht (hervorragende Bindung).';
      } else if (sub === 'silkenTofu') {
        amountStr = (count * 60) + ' g pürierter Seidentofu';
        tip = 'Perfekt für dichte Teige, Käsekuchen, Tartes und herzhafte Aufläufe, da völlig geschmacksneutral.';
      } else if (sub === 'aquafaba') {
        amountStr = (count * 3) + ' EL Kichererbsenwasser (ca. ' + (count * 45) + ' ml)';
        tip = 'Mit etwas Weinstein oder Zitronensaft aufschlagen wie echten Eischnee für Macarons, Mousse au Chocolat und Baiser.';
      }
      
      return {
        primary: { id: 'subAmount', label: 'Benötigte Ersatzmenge', value: count, formattedValue: amountStr, highlight: true },
        secondary: [
          { id: 'tip', label: 'Praxistipp zur Zubereitung', value: 0, formattedValue: tip },
          { id: 'standardEggs', label: 'Entspricht Hühnereiern', value: count, formattedValue: count + ' Ei(er) Größe M (ca. ' + (count * 55) + ' g)' },
        ],
        summaryText: 'Um ' + count + ' Ei(er) zu ersetzen, benötigen Sie ' + amountStr + '. ' + tip,
      };
    },
    formula: "1 Ei (M) ≈ 70 g Apfelmark ≈ 1/2 Banane ≈ 1 EL Leinsamen + 3 EL Wasser ≈ 60 g Seidentofu",
    formulaExplanation: "Hühnereier erfüllen beim Backen mehrere Funktionen: Bindung (Emulgator Lezithin im Eigelb), Feuchtigkeit und Triebkraft. Je nach Gebäckart eignet sich ein anderer Ersatz am besten.",
    workedExample: {
          "title": "Beispiel: Vegane Waffeln mit Ersatz für 2 Eier",
          "inputValues": [
                {
                      "label": "Eier",
                      "value": "2 Eier (Größe M)"
                },
                {
                      "label": "Ersatz",
                      "value": "Apfelmark"
                }
          ],
          "steps": [
                "2 Eier × 70 g Apfelmark = 140 g Apfelmark",
                "Teig wie gewohnt mit 1 TL extra Backpulver anrühren"
          ],
          "result": "140 g Apfelmark (ca. 4-5 gehäufte Esslöffel)"
    },
    faqs: [
          {
                "question": "Was ist Aquafaba?",
                "answer": "Aquafaba ist das dickflüssige Kochwasser von Kichererbsen (oder Bohnen aus der Dose). Aufgrund seiner Eiweiß- und Stärkestruktur lässt es sich wie echter Eischnee steif schlagen."
          },
          {
                "question": "Kann man mit Bananen-Ei auch Biskuit backen?",
                "answer": "Nein, für lockeren Biskuit eignen sich schwere Fruchtpürees nicht. Hier nutzt man besser aufgeschlagenes Aquafaba oder spezielles Ei-Ersatzpulver auf Lupinen-/Stärkebasis."
          }
    ],
    relatedSlugs: ["zucker-ersatz-rechner","cups-in-gramm-rechner","portionsrechner"],
  },
  {
    id: "wasser-reis-verhaeltnis-rechner",
    slug: "wasser-reis-verhaeltnis-rechner",
    name: "Reiskoch-Rechner (Wasser-Reis-Verhältnis & Garzeit nach Reissorte)",
    shortName: "Reiskoch-Rechner",
    category: "kochen-backen",
    subcategory: "Kochen & Garen",
    metaTitle: "Reis kochen Rechner – Wasser-Reis-Verhältnis nach Quellmethode berechnen",
    metaDescription: "Berechnen Sie die perfekte Wassermenge und Kochzeit für Basmatireis (1:1,5), Jasminreis (1:1,25), Vollkornreis (1:2) und Milchreis nach der Quellmethode.",
    h1: "Reis kochen Rechner – Perfektes Wasser-Reis-Verhältnis ermitteln",
    shortDescription: "Berechnet die genaue Wassermenge und Garzeit für alle Reissorten.",
    searchKeywords: ["reis kochen verhaeltnis wasser reis","quellmethode reis wasser berechnen","basmati reis wasser menge gramm ml","naturreis vollstreis garzeit wasser"],
    inputs: [
          {
                "id": "riceGrams",
                "label": "Reismenge (ungekocht)",
                "type": "number",
                "defaultValue": 200,
                "min": 50,
                "max": 2000,
                "step": 25,
                "unit": "g Reis"
          },
          {
                "id": "riceType",
                "label": "Reissorte",
                "type": "select",
                "defaultValue": "basmati",
                "options": [
                      {
                            "value": "basmati",
                            "label": "Basmati-Reis (Verhältnis 1 : 1,5 – ca. 12-15 Min.)"
                      },
                      {
                            "value": "jasmine",
                            "label": "Jasmin-Reis / Duftreis (Verhältnis 1 : 1,3 – ca. 12-14 Min.)"
                      },
                      {
                            "value": "wholegrain",
                            "label": "Vollkornreis / Naturreis (Verhältnis 1 : 2,0 – ca. 35-45 Min.)"
                      },
                      {
                            "value": "sushi",
                            "label": "Sushireis / Rundkorn (Verhältnis 1 : 1,2 – ca. 15 Min. + Dämpfen)"
                      },
                      {
                            "value": "risotto",
                            "label": "Risotto-Reis (Arborio/Carnaroli – Verhältnis 1 : 3,0 Brühe)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const riceG = Number(inputs.riceGrams) || 200;
      const type = inputs.riceType;
      
      let waterRatio = 1.5;
      let cookMins = 14;
      let tip = 'Vor dem Kochen 2-3 Mal gründlich mit kaltem Wasser waschen, bis das Wasser klar bleibt.';
      
      if (type === 'jasmine') {
        waterRatio = 1.3;
        cookMins = 13;
        tip = 'Nicht zu viel Wasser verwenden, damit Jasminreis schön klebrig und aromatisch bleibt.';
      } else if (type === 'wholegrain') {
        waterRatio = 2.0;
        cookMins = 40;
        tip = 'Vollkornreis behält den Keimling und die Silberhaut und braucht daher deutlich mehr Wasser und Garzeit.';
      } else if (type === 'sushi') {
        waterRatio = 1.2;
        cookMins = 15;
        tip = 'Nach dem Kochen 10 Min. bei geschlossenem Deckel ruhen lassen, danach vorsichtig mit Sushi-Essig würzen.';
      } else if (type === 'risotto') {
        waterRatio = 3.0;
        cookMins = 20;
        tip = 'Heiße Brühe kellenweise unter ständigem Rühren nachgießen, bis der Reis cremig mit bissfestem Kern ist.';
      }
      
      const waterMl = Math.round(riceG * waterRatio);
      const saltG = Math.round((riceG / 100) * 1.5); // ca. 1.5 g Salz je 100g Reis
      const cookedWeightG = Math.round(riceG * (1 + (waterRatio * 0.9)));
      const portions = Math.max(1, Math.round(riceG / 65)); // ca. 60-70g Beilage p.P.
      
      return {
        primary: { id: 'waterMl', label: 'Benötigtes Wasser / Flüssigkeit', value: waterMl, formattedValue: waterMl + ' ml (g)', highlight: true },
        secondary: [
          { id: 'cookTime', label: 'Garzeit bei geringer Hitze', value: cookMins, formattedValue: cookMins + ' Minuten (mit Deckel)' },
          { id: 'saltG', label: 'Empfohlenes Salz', value: saltG, formattedValue: 'ca. ' + saltG + ' g (1 gestr. TL)' },
          { id: 'cookedYield', label: 'Ergibt gekochten Reis', value: cookedWeightG, formattedValue: 'ca. ' + cookedWeightG + ' g (für ca. ' + portions + ' Personen)' },
        ],
        summaryText: 'Für ' + riceG + ' g Reis benötigen Sie genau ' + waterMl + ' ml Wasser und ca. ' + saltG + ' g Salz. Bei geschlossenem Deckel auf kleinster Stufe ca. ' + cookMins + ' Minuten sanft köcheln lassen.',
      };
    },
    formula: "Wassermenge (ml) = Reismenge (g) × Sortenspezifisches Verhältnis (1,2 bis 2,0)",
    formulaExplanation: "Bei der Quellmethode verdampft kaum Wasser, da der Topfdeckel stets geschlossen bleibt. Der Reis nimmt die gesamte Flüssigkeit und die Nährstoffe vollständig auf.",
    workedExample: {
          "title": "Beispiel: 200 g Basmatireis für 3 Personen kochen",
          "inputValues": [
                {
                      "label": "Reis",
                      "value": "200 g"
                },
                {
                      "label": "Sorte",
                      "value": "Basmati (1:1,5)"
                }
          ],
          "steps": [
                "Wasser = 200 g × 1,5 = 300 ml Wasser",
                "1 Mal aufkochen, dann Deckel drauf und 12-14 Min. auf kleinster Stufe ziehen lassen"
          ],
          "result": "300 ml Wasser (ergibt ca. 500 g lockeren Reis)"
    },
    faqs: [
          {
                "question": "Warum sollte man Reis vor dem Kochen waschen?",
                "answer": "Durch das Waschen wird überschüssige Oberflächenstärke entfernt. Dadurch klebt der Reis nach dem Kochen nicht klumpig zusammen, sondern bleibt wunderbar körnig und locker."
          },
          {
                "question": "Darf man beim Reis kochen den Deckel anheben?",
                "answer": "Nein! Wenn der Deckel vor Ablauf der Garzeit geöffnet wird, entweicht der notwendige heiße Dampf und der Reis gart ungleichmäßig oder brennt am Boden an."
          }
    ],
    relatedSlugs: ["portionsrechner","nudeln-rohmaerk-gewicht-rechner","gramm-in-ml-rechner"],
  },
  {
    id: "nudeln-rohmaerk-gewicht-rechner",
    slug: "nudeln-rohmaerk-gewicht-rechner",
    name: "Nudelportions-Rechner (Trocken- vs. Gekocht-Gewicht & Portionsgröße)",
    shortName: "Nudelportions-Rechner",
    category: "kochen-backen",
    subcategory: "Kochen & Garen",
    metaTitle: "Nudeln Rechner – Rohgewicht in gekochtes Gewicht & Portionen pro Person",
    metaDescription: "Berechnen Sie, wie viel Gramm trockene Nudeln gekocht ergeben (Faktor ca. 2,3) und wie viel Gramm Pasta Sie pro Person für Vorspeise oder Hauptgericht brauchen.",
    h1: "Nudeln Rechner – Nudelportionen & Gekochtes Gewicht berechnen",
    shortDescription: "Ermittelt Nudelgewicht trocken vs. gekocht und Portionsgrößen.",
    searchKeywords: ["nudeln rechner trocken gekocht gewicht faktor","wieviel gramm nudeln pro person hauptgericht","nudelportionen berechnen kinder erwachsene","spaghetti menge gramm pro person"],
    inputs: [
          {
                "id": "personsCount",
                "label": "Anzahl Personen",
                "type": "number",
                "defaultValue": 4,
                "min": 1,
                "max": 50,
                "step": 1,
                "unit": "Personen"
          },
          {
                "id": "mealType",
                "label": "Mahlzeiten-Art",
                "type": "select",
                "defaultValue": "mainDish",
                "options": [
                      {
                            "value": "mainDish",
                            "label": "Hauptgericht / normaler Hunger (ca. 100 bis 125 g p.P.)"
                      },
                      {
                            "value": "bigHunger",
                            "label": "Großer Hunger / Sportler (ca. 150 g p.P.)"
                      },
                      {
                            "value": "sideDish",
                            "label": "Beilage / Vorspeise (ca. 60 bis 80 g p.P.)"
                      },
                      {
                            "value": "kids",
                            "label": "Kinderportion (ca. 50 bis 60 g p.P.)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const persons = Number(inputs.personsCount) || 1;
      const meal = inputs.mealType;
      
      let dryPerPersonG = 110;
      if (meal === 'bigHunger') dryPerPersonG = 150;
      else if (meal === 'sideDish') dryPerPersonG = 70;
      else if (meal === 'kids') dryPerPersonG = 55;
      
      const totalDryG = persons * dryPerPersonG;
      // Trockene Nudeln saugen ca. das 1.2- bis 1.4-fache ihres Eigengewichts an Wasser auf:
      // Faktor gekocht ≈ 2.25 bis 2.30
      const cookedWeightG = Math.round(totalDryG * 2.28);
      // Faustregel Wasser & Salz: Pro 100g Nudeln = 1 Liter Wasser und 10g Salz
      const waterLiters = Math.max(1.5, Math.ceil((totalDryG / 100) * 1.0));
      const saltG = Math.round(waterLiters * 10);
      
      return {
        primary: { id: 'dryPasta', label: 'Benötigte Trockennudeln', value: totalDryG, formattedValue: totalDryG + ' g (ca. ' + formatNumber(totalDryG / 500, 1) + ' Packungen à 500g)', highlight: true },
        secondary: [
          { id: 'cookedPasta', label: 'Ergibt gekochte Pasta ca.', value: cookedWeightG, formattedValue: formatNumber(cookedWeightG, 0) + ' g gekocht' },
          { id: 'waterReq', label: 'Kochwasser (1l je 100g Nudeln)', value: waterLiters, formattedValue: waterLiters + ' Liter Wasser' },
          { id: 'saltReq', label: 'Salzmenge für Kochwasser', value: saltG, formattedValue: saltG + ' g Salz (10g / Liter)' },
        ],
        summaryText: 'Für ' + persons + ' Personen benötigen Sie ' + totalDryG + ' g trockene Nudeln (' + dryPerPersonG + ' g p.P.). Beim Kochen saugen sie Wasser auf und ergeben ca. ' + formatNumber(cookedWeightG, 0) + ' g fertige Pasta.',
      };
    },
    formula: "Gekochte Nudeln ≈ Trockengewicht × 2,28; Wasser = 1 l je 100 g; Salz = 10 g je Liter Wasser",
    formulaExplanation: "Hartweizengrieß-Nudeln verdoppeln bis verdreifachen ihr Gewicht beim Kochen \"al dente\" durch die Quellung der Stärke.",
    workedExample: {
          "title": "Beispiel: Nudeln für 4 Erwachsene als Hauptgericht",
          "inputValues": [
                {
                      "label": "Personen",
                      "value": "4"
                },
                {
                      "label": "Hunger",
                      "value": "Normal (110 g)"
                }
          ],
          "steps": [
                "Trockengewicht = 4 × 110 g = 440 g (fast 1 Paket à 500 g)",
                "Gekochtes Gewicht = 440 × 2,28 ≈ 1.000 g Pasta",
                "Wasser = 4 bis 5 Liter Wasser mit 40 g Salz"
          ],
          "result": "440 g Trockennudeln (ca. 1 kg gekocht)"
    },
    faqs: [
          {
                "question": "Sollte man Öl ins Nudelwasser geben?",
                "answer": "Nein! Öl schwimmt nur auf dem Wasser und legt sich beim Abgießen wie ein Film um die Nudeln. Dadurch kann die Nudeloberfläche die Sauce später viel schlechter aufnehmen."
          },
          {
                "question": "Sollte man Nudeln nach dem Kochen mit kaltem Wasser abschrecken?",
                "answer": "Nein, niemals abschrecken (außer bei kaltem Nudelsalat)! Das Abschrecken spült die wertvolle Oberflächenstärke ab, die für die Saucenbindung unverzichtbar ist."
          }
    ],
    relatedSlugs: ["portionsrechner","wasser-reis-verhaeltnis-rechner","kalorien-rezept-rechner"],
  },
  {
    id: "sauerteig-anstellgut-rechner",
    slug: "sauerteig-anstellgut-rechner",
    name: "Sauerteig-Rechner (Anstellgut füttern & Sauerteigführung 1:1:1)",
    shortName: "Sauerteig-Rechner",
    category: "kochen-backen",
    subcategory: "Backzutaten",
    metaTitle: "Sauerteig Rechner – Anstellgut füttern & Sauerteigführung 1:1:1",
    metaDescription: "Berechnen Sie die exakten Mehl- und Wassermengen zur Sauerteig-Führung nach gewünschter Sauerteigmenge und Fütterungsverhältnis (1:1:1, 1:2:2 oder 1:5:5).",
    h1: "Sauerteig Rechner – Anstellgut füttern & Sauerteigmenge berechnen",
    shortDescription: "Berechnet Mehl, Wasser und Anstellgut zur Sauerteig-Herstellung.",
    searchKeywords: ["sauerteig rechner anstellgut fuettern","sauerteig fuehrung verhaeltnis 1 zu 1 zu 1","roggensauerteig weizensauerteig menge mehl wasser","anstellgut auffrischen gramm rechner"],
    inputs: [
          {
                "id": "desiredSourdoughG",
                "label": "Benötigte Sauerteigmenge laut Rezept",
                "type": "number",
                "defaultValue": 200,
                "min": 20,
                "max": 2000,
                "step": 10,
                "unit": "g Sauerteig"
          },
          {
                "id": "feedingRatio",
                "label": "Fütterungs-Verhältnis (Anstellgut : Mehl : Wasser)",
                "type": "select",
                "defaultValue": "1_1_1",
                "options": [
                      {
                            "value": "1_1_1",
                            "label": "1 : 1 : 1 (Klassisch – schnelle Reife in ca. 4-6 Stunden)"
                      },
                      {
                            "value": "1_2_2",
                            "label": "1 : 2 : 2 (Mittlere Reife in ca. 6-8 Stunden)"
                      },
                      {
                            "value": "1_5_5",
                            "label": "1 : 5 : 5 (Sehr milde Führung über Nacht / ca. 10-12 Stunden)"
                      }
                ]
          },
          {
                "id": "reserveG",
                "label": "Zusätzliche Reserve für nächstes Anstellgut",
                "type": "number",
                "defaultValue": 30,
                "min": 10,
                "max": 100,
                "step": 5,
                "unit": "g Reserve"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const targetG = Number(inputs.desiredSourdoughG) || 200;
      const reserveG = Number(inputs.reserveG) || 30;
      const totalToProduceG = targetG + reserveG;
      
      let ratioParts = 3; // 1:1:1
      let starterPart = 1;
      let flourPart = 1;
      let waterPart = 1;
      
      if (inputs.feedingRatio === '1_2_2') {
        starterPart = 1;
        flourPart = 2;
        waterPart = 2;
        ratioParts = 5;
      } else if (inputs.feedingRatio === '1_5_5') {
        starterPart = 1;
        flourPart = 5;
        waterPart = 5;
        ratioParts = 11;
      }
      
      const onePartG = totalToProduceG / ratioParts;
      const starterG = Math.round(onePartG * starterPart);
      const flourG = Math.round(onePartG * flourPart);
      const waterG = Math.round(onePartG * waterPart);
      const actualTotal = starterG + flourG + waterG;
      
      return {
        primary: { id: 'starter', label: 'Benötigtes Anstellgut (Starter)', value: starterG, formattedValue: starterG + ' g Anstellgut', highlight: true },
        secondary: [
          { id: 'flour', label: 'Mehl (Roggen- oder Weizenvollkorn)', value: flourG, formattedValue: flourG + ' g Mehl', highlight: true },
          { id: 'water', label: 'Handwarmes Wasser (ca. 30-35 °C)', value: waterG, formattedValue: waterG + ' g (ml) Wasser', highlight: true },
          { id: 'totalProduced', label: 'Ergibt aktiven Sauerteig', value: actualTotal, formattedValue: actualTotal + ' g (' + targetG + ' g fürs Brot + ' + reserveG + ' g Reserve)' },
        ],
        summaryText: 'Mischen Sie ' + starterG + ' g Anstellgut mit ' + flourG + ' g Mehl und ' + waterG + ' g handwarmem Wasser. Ergibt ' + actualTotal + ' g reifen Sauerteig (' + targetG + ' g fürs Rezept, ' + reserveG + ' g zurück ins Glas als Reserve).',
      };
    },
    formula: "Teile = Anstellgut + Mehl + Wasser; Einzelgewicht = Gesamtmenge / Summe der Teile",
    formulaExplanation: "Die Sauerteig-Hydratation beträgt bei Standardführung (1:1:1) exakt 100 % (TA 200), da Mehl und Wasser zu gleichen Teilen zugegeben werden.",
    workedExample: {
          "title": "Beispiel: 200 g Sauerteig fürs Brot + 30 g Reserve nach 1:1:1",
          "inputValues": [
                {
                      "label": "Zielmenge",
                      "value": "230 g gesamt"
                },
                {
                      "label": "Verhältnis",
                      "value": "1:1:1 (3 Teile)"
                }
          ],
          "steps": [
                "1 Teil = 230 g / 3 ≈ 77 g",
                "77 g Anstellgut + 77 g Mehl + 77 g Wasser = 231 g Sauerteig"
          ],
          "result": "je 77 g Anstellgut, Mehl und Wasser"
    },
    faqs: [
          {
                "question": "Wann ist der Sauerteig backbereit (Peak)?",
                "answer": "Der Sauerteig ist backbereit, wenn er sein Volumen verdoppelt bis verdreifacht hat, eine kuppelförmige Oberfläche mit vielen Bläschen zeigt und kurz vor dem Wiederabsinken steht."
          },
          {
                "question": "Wie übersteht Anstellgut den Urlaub?",
                "answer": "Gut gefüttert hält sich Anstellgut im Schraubglas im Kühlschrank problemlos 2 bis 3 Wochen. Für längere Pausen kann man ihn dünn auf Backpapier verstreichen, trocknen und als Trockensauerteig jahrelang aufbewahren."
          }
    ],
    relatedSlugs: ["brot-backen-baeckermass-rechner","pizza-teig-rechner","hefe-umrechner"],
  },
  {
    id: "marmelade-geliermittel-rechner",
    slug: "marmelade-geliermittel-rechner",
    name: "Marmeladen- & Gelierzucker-Rechner (1:1, 2:1 & 3:1 Gelierzucker)",
    shortName: "Marmelade-Rechner",
    category: "kochen-backen",
    subcategory: "Einkochen & Haltbarkeit",
    metaTitle: "Marmelade Rechner – Gelierzucker 1:1, 2:1, 3:1 & Gläseranzahl berechnen",
    metaDescription: "Berechnen Sie die benötigte Menge Gelierzucker (1:1, 2:1 oder 3:1) nach Fruchtgewicht in Gramm, Zitronensaft-Zugabe und die Anzahl benötigter Schraubgläser.",
    h1: "Marmelade Rechner – Gelierzucker nach Fruchtgewicht ermitteln",
    shortDescription: "Berechnet Gelierzucker und Gläseranzahl für Marmelade und Konfitüre.",
    searchKeywords: ["marmelade rechner gelierzucker 1 zu 1 2 zu 1 3 zu 1","wieviel gelierzucker fuer 1 kg erdbeeren","marmeladenglaeser anzahl berechnen","gelierprobe zitronensaeure marmelade"],
    inputs: [
          {
                "id": "fruitGrams",
                "label": "Vorbereitete Früchte (geputzt & entsteint)",
                "type": "number",
                "defaultValue": 1000,
                "min": 100,
                "max": 20000,
                "step": 50,
                "unit": "g Früchte"
          },
          {
                "id": "sugarType",
                "label": "Gelierzucker-Verhältnis",
                "type": "select",
                "defaultValue": "2_1",
                "options": [
                      {
                            "value": "2_1",
                            "label": "Gelierzucker 2:1 (Fruchtig-süß – 500 g Zucker auf 1.000 g Frucht – Empfehlung)"
                      },
                      {
                            "value": "3_1",
                            "label": "Gelierzucker 3:1 (Sehr fruchtig, weniger süß – 333 g Zucker auf 1.000 g Frucht)"
                      },
                      {
                            "value": "1_1",
                            "label": "Gelierzucker 1:1 (Klassisch süß, extrem lange haltbar – 1.000 g Zucker auf 1.000 g Frucht)"
                      }
                ]
          },
          {
                "id": "jarSizeMl",
                "label": "Fassungsvermögen der Marmeladengläser",
                "type": "select",
                "defaultValue": "250",
                "options": [
                      {
                            "value": "200",
                            "label": "Kleine Gläser (200 ml)"
                      },
                      {
                            "value": "250",
                            "label": "Standardgläser (250 ml)"
                      },
                      {
                            "value": "350",
                            "label": "Große Gläser (350 ml)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const fruitG = Number(inputs.fruitGrams) || 0;
      const sugarType = inputs.sugarType;
      
      let sugarFactor = 0.5; // 2:1
      if (sugarType === '1_1') sugarFactor = 1.0;
      else if (sugarType === '3_1') sugarFactor = 1 / 3;
      
      const sugarG = Math.round(fruitG * sugarFactor);
      const lemonJuiceMl = Math.round((fruitG / 1000) * 20); // 1-2 EL je kg
      // Gesamtmasse vor Kochverlust:
      const rawTotalG = fruitG + sugarG;
      // Kochverlust durch Verdampfen ca. 8-10 %:
      const finalJamG = Math.round(rawTotalG * 0.92);
      
      const jarMl = Number(inputs.jarSizeMl) || 250;
      // Dichte Marmelade ca. 1.25 g/ml (Zucker erhöht Dichte)
      const jamVolumeMl = finalJamG / 1.25;
      const jarsCount = Math.ceil(jamVolumeMl / jarMl);
      
      return {
        primary: { id: 'sugarAmount', label: 'Benötigter Gelierzucker (' + (String(sugarType || '2_1').replace('_', ':')) + ')', value: sugarG, formattedValue: sugarG + ' g Gelierzucker', highlight: true },
        secondary: [
          { id: 'jars', label: 'Benötigte Schraubgläser (à ' + jarMl + ' ml)', value: jarsCount, formattedValue: jarsCount + ' Gläser' },
          { id: 'lemon', label: 'Zitronensaft / Zitronensäure', value: lemonJuiceMl, formattedValue: 'ca. ' + lemonJuiceMl + ' ml (1-2 EL)' },
          { id: 'yield', label: 'Fertige Marmeladenmenge ca.', value: finalJamG, formattedValue: formatNumber(finalJamG, 0) + ' g' },
        ],
        summaryText: 'Für ' + fruitG + ' g Früchte benötigen Sie ' + sugarG + ' g Gelierzucker ' + (String(sugarType || '2_1').replace('_', ':')) + ' und ca. ' + lemonJuiceMl + ' ml Zitronensaft. Ergibt rund ' + jarsCount + ' Gläser à ' + jarMl + ' ml.',
      };
    },
    formula: "2:1 Zucker = Fruchtgewicht / 2; 3:1 Zucker = Fruchtgewicht / 3; Gläser = (Gesamtmasse / 1,25) / Glasvolumen",
    formulaExplanation: "Gelierzucker 2:1 und 3:1 enthält zusätzlich pflanzliches Pektin (aus Äpfeln oder Zitrusfrüchten) und Zitronensäure, damit die Marmelade trotz geringerem Zuckergehalt zuverlässig geliert.",
    workedExample: {
          "title": "Beispiel: 1.500 g Erdbeeren mit 2:1 Gelierzucker",
          "inputValues": [
                {
                      "label": "Früchte",
                      "value": "1.500 g"
                },
                {
                      "label": "Zucker",
                      "value": "2:1"
                }
          ],
          "steps": [
                "Gelierzucker = 1.500 / 2 = 750 g Zucker",
                "Marmelade ca. 2.070 g -> ca. 7 Gläser à 250 ml"
          ],
          "result": "750 g Gelierzucker (7 Gläser)"
    },
    faqs: [
          {
                "question": "Wie funktioniert die Gelierprobe richtig?",
                "answer": "Geben Sie nach 4 Minuten sprudelndem Kochen 1 Teelöffel heiße Marmelade auf einen eiskalten Teller aus dem Tiefkühlfach. Wird die Masse nach 1 Minute fest, ist die Marmelade fertig!"
          },
          {
                "question": "Muss man heiße Marmeladengläser auf den Kopf stellen?",
                "answer": "Nein, nach heutigem Stand der Hygiene ist das nicht nötig und kann sogar Schadstoffe aus dem Deckelgummi lösen. Gründlich sterilisierte Gläser und heißes Einfüllen genügen völlig für ein Vakuum."
          }
    ],
    relatedSlugs: ["kuehlschrank-haltbarkeit-rechner","portionsrechner","zucker-ersatz-rechner"],
  },
  {
    id: "kaffee-wasser-verhaeltnis-rechner",
    slug: "kaffee-wasser-verhaeltnis-rechner",
    name: "Kaffee-Rechner (Kaffeemehl nach Tassenanzahl & Brühverhältnis)",
    shortName: "Kaffee-Rechner",
    category: "kochen-backen",
    subcategory: "Getränke",
    metaTitle: "Kaffee Rechner – Golden Cup Ratio Kaffeemehl in Gramm nach Tassen berechnen",
    metaDescription: "Berechnen Sie das optimale Verhältnis von Kaffeemehl zu Wasser nach SCA Golden Cup Standard (60 g Kaffee auf 1 Liter Wasser) für Filterkaffee, French Press und V60.",
    h1: "Kaffee Rechner – Wie viel Kaffeepulver brauche ich pro Tasse?",
    shortDescription: "Berechnet Kaffeemehl in Gramm nach Tassenanzahl und Brühmethode.",
    searchKeywords: ["kaffee rechner kaffeemehl gramm pro tasse","golden cup ratio sca 60g pro liter","french press kaffee menge berechnen","filterkaffee wieviel kaffeepulver pro tasse"],
    inputs: [
          {
                "id": "cupsCount",
                "label": "Anzahl Kaffeetassen",
                "type": "number",
                "defaultValue": 4,
                "min": 1,
                "max": 30,
                "step": 1,
                "unit": "Tassen"
          },
          {
                "id": "cupSizeMl",
                "label": "Tassengröße",
                "type": "select",
                "defaultValue": "150",
                "options": [
                      {
                            "value": "125",
                            "label": "Kleine Kaffeetasse (125 ml – Kaffeemaschinen-Norm)"
                      },
                      {
                            "value": "150",
                            "label": "Standard Kaffeetasse (150 ml)"
                      },
                      {
                            "value": "250",
                            "label": "Großer Kaffeebecher / Mug (250 ml)"
                      }
                ]
          },
          {
                "id": "strength",
                "label": "Gewünschte Kaffeestärke (Brew Ratio)",
                "type": "select",
                "defaultValue": "standard",
                "options": [
                      {
                            "value": "mild",
                            "label": "Mild (ca. 55 g Kaffee / 1.000 ml Wasser – Verhältnis 1:18)"
                      },
                      {
                            "value": "standard",
                            "label": "Ausgewogen / SCA Golden Cup (60 g / 1.000 ml – Verhältnis 1:16,7)"
                      },
                      {
                            "value": "strong",
                            "label": "Kräftig (ca. 65 g Kaffee / 1.000 ml – Verhältnis 1:15)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const cups = Number(inputs.cupsCount) || 1;
      const cupMl = Number(inputs.cupSizeMl) || 150;
      const totalWaterMl = cups * cupMl;
      
      let ratioGPerLiter = 60; // SCA Golden Cup
      if (inputs.strength === 'mild') ratioGPerLiter = 55;
      else if (inputs.strength === 'strong') ratioGPerLiter = 65;
      
      const coffeeGrams = (totalWaterMl / 1000) * ratioGPerLiter;
      const spoonsCount = Math.round((coffeeGrams / 7) * 10) / 10; // Kaffeelot / gehäufter EL ca. 7g
      
      return {
        primary: { id: 'coffeeG', label: 'Benötigtes Kaffeemehl', value: coffeeGrams, formattedValue: formatNumber(coffeeGrams, 1) + ' g', highlight: true },
        secondary: [
          { id: 'waterMl', label: 'Gesamte Wassermenge', value: totalWaterMl, formattedValue: totalWaterMl + ' ml (' + formatNumber(totalWaterMl / 1000, 2) + ' Liter)' },
          { id: 'coffeeSpoons', label: 'Kaffeelote / gehäufte EL (ca. 7g)', value: spoonsCount, formattedValue: 'ca. ' + spoonsCount + ' Lote' },
          { id: 'waterTemp', label: 'Optimale Wassertemperatur', value: 94, formattedValue: '92 °C bis 96 °C (nicht kochend!)' },
        ],
        summaryText: 'Für ' + cups + ' Tassen Kaffee (' + totalWaterMl + ' ml Wasser) benötigen Sie exakt ' + formatNumber(coffeeGrams, 1) + ' g frisch gemahlenes Kaffeemehl (ca. ' + spoonsCount + ' Kaffeelote).',
      };
    },
    formula: "Kaffeemehl (g) = (Wassermenge in ml / 1.000) × Brühverhältnis (55 bis 65 g/l)",
    formulaExplanation: "Die Specialty Coffee Association (SCA) empfiehlt die \"Golden Cup Ratio\" von 60 Gramm Kaffee pro 1.000 ml Wasser für eine ideale Extraktion von 18 % bis 22 % der Aromastoffe.",
    workedExample: {
          "title": "Beispiel: 4 Standard-Tassen (à 150 ml = 600 ml Wasser) nach Golden Cup Ratio",
          "inputValues": [
                {
                      "label": "Tassen",
                      "value": "4 (600 ml)"
                },
                {
                      "label": "Stärke",
                      "value": "Golden Cup (60 g/l)"
                }
          ],
          "steps": [
                "Kaffee = 0,6 Liter × 60 g/l = 36 g Kaffeemehl",
                "Entspricht ca. 5 Kaffeeloten"
          ],
          "result": "36,0 g Kaffeemehl"
    },
    faqs: [
          {
                "question": "Warum sollte Kaffeewasser nicht kochend heiß sein?",
                "answer": "Kochendes Wasser (100°C) verbrennt die feinen Kaffeearomen und löst übermäßig viele Bitterstoffe und Gerbsäuren. Warten Sie nach dem Aufkochen ca. 45 bis 60 Sekunden, bis das Wasser 92-96°C hat."
          },
          {
                "question": "Wie fein sollte der Kaffee für die French Press gemahlen werden?",
                "answer": "Für die French Press benötigt man einen groben Mahlgrad (wie Meersalz), damit das Kaffeepulver nicht durch das Metallsieb rutscht und der Kaffee nicht überextrahiert."
          }
    ],
    relatedSlugs: ["tee-ziehzeit-temperatur-rechner","essloeffel-teeloeffel-gramm-rechner","portionsrechner"],
  },
  {
    id: "cocktail-alkoholgehalt-rechner",
    slug: "cocktail-alkoholgehalt-rechner",
    name: "Cocktail-Alkoholgehalt-Rechner (Vol.-% & Gramm reiner Alkohol)",
    shortName: "Cocktail-Rechner",
    category: "kochen-backen",
    subcategory: "Getränke",
    metaTitle: "Cocktail Alkoholgehalt Rechner – Vol.-% & Promille-Potenzial berechnen",
    metaDescription: "Berechnen Sie den exakten Alkoholgehalt (Vol.-% und Gramm reiner Alkohol) von Cocktails und Longdrinks nach Spirituosen (Gin, Wodka, Rum), Likören, Saft und Schmelzwasser.",
    h1: "Cocktail Rechner – Wie stark ist mein Drink wirklich?",
    shortDescription: "Berechnet den Alkoholgehalt in Vol.-% und Gramm für Cocktails.",
    searchKeywords: ["cocktail alkoholgehalt rechner vol prozent","wieviel alkohol hat ein gin tonic aperol spritz","cocktail reine gramm alkohol berechnen","schmelzwasser eiswuerfel cocktail verduennung"],
    inputs: [
          {
                "id": "spiritMl",
                "label": "Basis-Spirituose (z. B. Gin, Wodka, Rum 40 Vol.-%)",
                "type": "number",
                "defaultValue": 50,
                "min": 0,
                "max": 250,
                "step": 5,
                "unit": "ml"
          },
          {
                "id": "spiritVolPct",
                "label": "Alkoholgehalt Spirituose",
                "type": "number",
                "defaultValue": 40,
                "min": 15,
                "max": 80,
                "step": 0.5,
                "unit": "Vol.-%"
          },
          {
                "id": "liqueurMl",
                "label": "Likör / Wermut (z. B. Aperol, Triple Sec 15-20 Vol.-%)",
                "type": "number",
                "defaultValue": 0,
                "min": 0,
                "max": 150,
                "step": 5,
                "unit": "ml"
          },
          {
                "id": "liqueurVolPct",
                "label": "Alkoholgehalt Likör",
                "type": "number",
                "defaultValue": 20,
                "min": 10,
                "max": 50,
                "step": 0.5,
                "unit": "Vol.-%"
          },
          {
                "id": "fillerMl",
                "label": "Alkoholfreier Filler (Tonic, Cola, Saft, Soda)",
                "type": "number",
                "defaultValue": 150,
                "min": 0,
                "max": 500,
                "step": 10,
                "unit": "ml"
          },
          {
                "id": "iceMeltMl",
                "label": "Schmelzwasser durch Eiswürfel ca.",
                "type": "number",
                "defaultValue": 30,
                "min": 0,
                "max": 100,
                "step": 5,
                "unit": "ml"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const sMl = Number(inputs.spiritMl) || 0;
      const sVol = Number(inputs.spiritVolPct) || 0;
      const lMl = Number(inputs.liqueurMl) || 0;
      const lVol = Number(inputs.liqueurVolPct) || 0;
      const fMl = Number(inputs.fillerMl) || 0;
      const iceMl = Number(inputs.iceMeltMl) || 0;
      
      const pureEthanolMl = (sMl * (sVol / 100)) + (lMl * (lVol / 100));
      const totalDrinkVolumeMl = sMl + lMl + fMl + iceMl;
      
      const volPercentFinal = totalDrinkVolumeMl > 0 ? (pureEthanolMl / totalDrinkVolumeMl) * 100 : 0;
      const pureGrams = pureEthanolMl * 0.789;
      
      // Vergleich mit Bier (0.33l 5% = ca. 13g) oder Wein (0.2l 12% = ca. 19g)
      const beerBottles = pureGrams / 13.0;
      
      return {
        primary: { id: 'finalVol', label: 'Alkoholgehalt des fertigen Drinks', value: volPercentFinal, formattedValue: formatNumber(volPercentFinal, 1) + ' Vol.-%', highlight: true },
        secondary: [
          { id: 'pureAlcohol', label: 'Reiner Alkohol im Glas', value: pureGrams, formattedValue: formatNumber(pureGrams, 1) + ' g Ethanol' },
          { id: 'drinkSize', label: 'Gesamtvolumen des Drinks', value: totalDrinkVolumeMl, formattedValue: totalDrinkVolumeMl + ' ml' },
          { id: 'beerEquiv', label: 'Entspricht etwa Bier (0,33l Flaschen)', value: beerBottles, formattedValue: 'ca. ' + formatNumber(beerBottles, 1) + ' Flaschen Bier' },
        ],
        summaryText: 'Ihr Cocktail (Gesamtvolumen ' + totalDrinkVolumeMl + ' ml) hat einen Alkoholgehalt von ca. ' + formatNumber(volPercentFinal, 1) + ' Vol.-% und enthält ' + formatNumber(pureGrams, 1) + ' g reinen Alkohol (entspricht ca. ' + formatNumber(beerBottles, 1) + ' Flaschen Bier).',
      };
    },
    formula: "Vol.-% = (Σ (Menge_i × Vol%_i)) / Gesamtvolumen; Reiner Alkohol (g) = Reines Ethanol (ml) × 0,789",
    formulaExplanation: "Eiswürfel kühlen den Drink nicht nur, sondern verwässern ihn beim Rühren oder Shaken ganz bewusst um ca. 20 bis 40 ml Schmelzwasser, was den Cocktail harmonisch abrundet.",
    workedExample: {
          "title": "Beispiel: Klassischer Gin Tonic (50 ml Gin 40% + 150 ml Tonic + 30 ml Schmelzwasser)",
          "inputValues": [
                {
                      "label": "Gin",
                      "value": "50 ml (40 %)"
                },
                {
                      "label": "Tonic",
                      "value": "150 ml"
                },
                {
                      "label": "Eis",
                      "value": "30 ml Schmelzwasser"
                }
          ],
          "steps": [
                "Ethanol = 50 × 0,40 = 20 ml reines Ethanol",
                "Gesamtvolumen = 50 + 150 + 30 = 230 ml",
                "Vol.-% = (20 / 230) × 100 = 8,7 Vol.-%"
          ],
          "result": "8,7 Vol.-% (15,8 g reiner Alkohol)"
    },
    faqs: [
          {
                "question": "Wie viel Schmelzwasser entsteht beim Shaken eines Cocktails?",
                "answer": "Beim kräftigen Shaken mit Eis schmelzen pro Drink etwa 25 bis 35 ml Wasser. Profi-Barkeeper berechnen diese Verdünnung fest in ihre Rezepturen ein."
          },
          {
                "question": "Wie viel reiner Alkohol gilt für Erwachsene als risikoarm?",
                "answer": "Nach den Leitlinien der DGE sollten gesunde Frauen maximal 10 bis 12 g Alkohol pro Tag (ca. 1 kleines Bier oder 1 kleines Glas Wein) und gesunde Männer maximal 20 bis 24 g Alkohol pro Tag trinken, mit mindestens zwei alkoholfreien Tagen pro Woche."
          }
    ],
    relatedSlugs: ["alkohol-verkochungs-rechner","promillerechner","portionsrechner"],
  },
  {
    id: "salz-lake-poekel-rechner",
    slug: "salz-lake-poekel-rechner",
    name: "Salzlake- & Pökel-Rechner (Lakegehalt in % & Nasspökeln)",
    shortName: "Salzlake-Rechner",
    category: "kochen-backen",
    subcategory: "Einkochen & Haltbarkeit",
    metaTitle: "Salzlake Rechner – Salzgehalt in % für Räuchern, Fermentieren & Pökeln",
    metaDescription: "Berechnen Sie die exakte Salzmenge in Gramm nach Wasservolumen (Liter) und gewünschter Lakekonzentration (z. B. 2-3 % Fermentation, 5-8 % Räucherfisch, 10-15 % Schinken).",
    h1: "Salzlake Rechner – Exakte Salzmenge für Lake & Fermentation",
    shortDescription: "Berechnet Salzmenge nach Wasservolumen und Prozentgehalt der Lake.",
    searchKeywords: ["salzlake rechner gramm salz pro liter wasser","poekellake prozent berechnen schinken","forelle raeuchern salzlake 5 bis 7 prozent","gemuese fermentieren salzgehalt 2 prozent"],
    inputs: [
          {
                "id": "waterLiters",
                "label": "Wassermenge",
                "type": "number",
                "defaultValue": 3,
                "min": 0.5,
                "max": 50,
                "step": 0.5,
                "unit": "Liter"
          },
          {
                "id": "purpose",
                "label": "Verwendungszweck & Konzentration",
                "type": "select",
                "defaultValue": "fishSmoke",
                "options": [
                      {
                            "value": "ferment",
                            "label": "Gemüse fermentieren (Sauerkraut, Kimchi – ca. 2,0 bis 2,5 %)"
                      },
                      {
                            "value": "brinePoultry",
                            "label": "Wet Brining Geflügel / Grillfleisch (ca. 4,0 bis 5,0 %)"
                      },
                      {
                            "value": "fishSmoke",
                            "label": "Forelle / Fisch räuchern (ca. 6,0 bis 7,0 % – ca. 12 Std.)"
                      },
                      {
                            "value": "fishQuick",
                            "label": "Fisch Schnell-Lake (ca. 10,0 % – ca. 2 Std.)"
                      },
                      {
                            "value": "porkCure",
                            "label": "Schinken / Kasseler nasspökeln (ca. 12,0 bis 14,0 %)"
                      }
                ]
          },
          {
                "id": "customPercent",
                "label": "Exakte Salzkonzentration (in %)",
                "type": "number",
                "defaultValue": 6,
                "min": 0.5,
                "max": 25,
                "step": 0.5,
                "unit": "%"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const waterL = Number(inputs.waterLiters) || 1;
      const pct = Number(inputs.customPercent) || 6.0;
      
      // Nach Definition der Massenprozent-Lake:
      // Salz (g) = (Wassermenge in g * Prozent) / (100 - Prozent)
      // bzw. in der Küchenpraxis oft: Gramm Salz = Wasser (ml) * (Prozent / 100)
      const waterG = waterL * 1000;
      const saltGrams = Math.round(waterG * (pct / 100));
      const totalLakeWeightG = waterG + saltGrams;
      const spoonsCount = Math.round((saltGrams / 18) * 10) / 10; // ca. 18g je gestr. EL
      
      return {
        primary: { id: 'saltAmount', label: 'Benötigte Salzmenge', value: saltGrams, formattedValue: saltGrams + ' g Salz', highlight: true },
        secondary: [
          { id: 'waterAmount', label: 'Wasser', value: waterL, formattedValue: waterL + ' Liter (' + waterG + ' g)' },
          { id: 'spoons', label: 'Entspricht Esslöffeln Salz', value: spoonsCount, formattedValue: 'ca. ' + spoonsCount + ' gestr. EL' },
          { id: 'densityHint', label: 'Gesamtmasse der Salzlake', value: totalLakeWeightG, formattedValue: formatNumber(totalLakeWeightG / 1000, 2) + ' kg' },
        ],
        summaryText: 'Für ' + waterL + ' Liter Wasser bei ' + pct + ' % Salzkonzentration benötigen Sie genau ' + saltGrams + ' g Salz (ca. ' + spoonsCount + ' Esslöffel).',
      };
    },
    formula: "Salz (g) = Wasservolumen (ml) × (Konzentration % / 100)",
    formulaExplanation: "Für eine 6%-ige Lake lösen Sie genau 60 Gramm Salz pro 1 Liter Wasser auf. Bei unjodiertem Meersalz oder Steinsalz löst sich das Salz rückstandsfrei auf.",
    workedExample: {
          "title": "Beispiel: 3 Liter 6%-ige Salzlake zum Forellenräuchern",
          "inputValues": [
                {
                      "label": "Wasser",
                      "value": "3 Liter"
                },
                {
                      "label": "Lake",
                      "value": "6 %"
                }
          ],
          "steps": [
                "Salz = 3.000 ml × 0,06 = 180 g Salz",
                "Forellen ca. 10 bis 12 Stunden vollständig bedeckt in die kühle Lake einlegen"
          ],
          "result": "180 g Salz (ca. 10 Esslöffel)"
    },
    faqs: [
          {
                "question": "Welches Salz eignet sich am besten zum Pökeln und Räuchern?",
                "answer": "Reines Steinsalz oder Meersalz ohne Jod, Fluorid und Rieselhilfen. Rieselhilfen können die Lake trüben und dem Räuchergut einen bitteren Beigeschmack verleihen."
          },
          {
                "question": "Was bewirkt das Brining (Einlegen in Salzlake) bei Hähnchen oder Pute?",
                "answer": "Das Salz verändert durch Osmose die Proteinstruktur im Fleisch, sodass das Geflügel beim Braten oder Grillen bis zu 40 % mehr Fleischsaft bindet und extrem saftig bleibt."
          }
    ],
    relatedSlugs: ["fleisch-kerntemperatur-garzeit-rechner","kuehlschrank-haltbarkeit-rechner","portionsrechner"],
  },
  {
    id: "frittieroel-temperatur-rauchpunkt-rechner",
    slug: "frittieroel-temperatur-rauchpunkt-rechner",
    name: "Frittieröl- & Rauchpunkt-Rechner (Öl-Hitzebeständigkeit & Braten)",
    shortName: "Rauchpunkt & Öl",
    category: "kochen-backen",
    subcategory: "Kochen & Garen",
    metaTitle: "Rauchpunkt Rechner – Speiseöle, Rauchpunkt (°C) & Frittiertemperatur",
    metaDescription: "Finden Sie den Rauchpunkt und die maximale Erhitzbarkeit für Rapsöl, Olivenöl, Butterschmalz, Sonnenblumenöl, Kokosöl und Erdnussöl für Braten und Frittieren.",
    h1: "Rauchpunkt Rechner – Welches Speiseöl eignet sich zum Braten?",
    shortDescription: "Ermittelt den Rauchpunkt und die Hitzestabilität von Speiseölen.",
    searchKeywords: ["rauchpunkt speiseoele tabelle rechner","welches oel zum scharfen anbraten rapsolivenoel","frittieroel temperatur 175 grad acrylarmid","butterschmalz rauchpunkt grad"],
    inputs: [
          {
                "id": "oilType",
                "label": "Speiseöl / Speisefett",
                "type": "select",
                "defaultValue": "ghee",
                "options": [
                      {
                            "value": "ghee",
                            "label": "Butterschmalz / Ghee (Rauchpunkt ca. 205 °C – Ideal zum Braten)"
                      },
                      {
                            "value": "refinedRapeseed",
                            "label": "Raffiniertes Rapsöl (Rauchpunkt ca. 204 °C – Geschmacksneutral)"
                      },
                      {
                            "value": "virginOlive",
                            "label": "Natives Olivenöl extra (Rauchpunkt ca. 160 bis 180 °C – Sanftes Dünsten)"
                      },
                      {
                            "value": "refinedOlive",
                            "label": "Raffiniertes Olivenöl (Rauchpunkt ca. 210 °C – Mediterranes Braten)"
                      },
                      {
                            "value": "peanut",
                            "label": "Erdnussöl raffiniert (Rauchpunkt ca. 230 °C – Ideal für Wok & Fritteuse)"
                      },
                      {
                            "value": "coconut",
                            "label": "Kokosfett / Kokosöl nativ (Rauchpunkt ca. 185 bis 200 °C)"
                      },
                      {
                            "value": "butter",
                            "label": "Klassische Butter (Rauchpunkt ca. 150 °C – Geringe Hitze)"
                      }
                ]
          },
          {
                "id": "plannedTemp",
                "label": "Geplante Gar- / Pfannentemperatur",
                "type": "number",
                "defaultValue": 180,
                "min": 100,
                "max": 280,
                "step": 5,
                "unit": "°C"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const oil = inputs.oilType;
      const planT = Number(inputs.plannedTemp) || 180;
      
      let smokePoint = 205;
      let suitability = 'Sehr gut geeignet zum scharfen Anbraten';
      
      if (oil === 'refinedRapeseed') { smokePoint = 204; suitability = 'Sehr gutes, hitzestabiles Allround-Öl mit gesunden Omega-3-Fettsäuren.'; }
      else if (oil === 'virginOlive') { smokePoint = 175; suitability = 'Nur für sanftes Braten, Dünsten und Salate geeignet; nicht überhitzen!'; }
      else if (oil === 'refinedOlive') { smokePoint = 210; suitability = 'Hohe Hitzestabilität für mediterrane Fleisch- und Fischgerichte.'; }
      else if (oil === 'peanut') { smokePoint = 230; suitability = 'Extrem hitzebeständig; die erste Wahl für Wok-Gerichte und Frittieren.'; }
      else if (oil === 'coconut') { smokePoint = 190; suitability = 'Gut hitzestabil für asiatische Gerichte und Currys.'; }
      else if (oil === 'butter') { smokePoint = 150; suitability = 'Milcheiweiß verbrennt schnell. Nur für sanftes Anschwitzen auf kleiner Stufe geeignet.'; }
      
      const isSafe = planT <= smokePoint;
      const tempBuffer = smokePoint - planT;
      
      return {
        primary: { id: 'smokePoint', label: 'Rauchpunkt des Fettes', value: smokePoint, formattedValue: smokePoint + ' °C', highlight: true },
        secondary: [
          { id: 'safetyCheck', label: 'Temperatur im sicheren Bereich?', value: isSafe ? 1 : 0, formattedValue: isSafe ? 'Ja (noch ' + tempBuffer + ' °C Sicherheitsabstand)' : 'GEFAHR: Öl raucht und bildet Giftstoffe!' },
          { id: 'suitability', label: 'Kulinarische Empfehlung', value: 0, formattedValue: suitability },
          { id: 'deepFryIdeal', label: 'Ideale Frittiertemperatur', value: 175, formattedValue: '170 °C bis 175 °C (max. 180 °C wegen Acrylamid)' },
        ],
        summaryText: 'Dieses Fett hat einen Rauchpunkt von ' + smokePoint + ' °C. Bei Ihrer Pfannentemperatur von ' + planT + ' °C ist das Fett ' + (isSafe ? 'vollkommen sicher und stabil.' : 'NICHT geeignet! Bitte Hitze reduzieren oder ein hitzestabileres Öl wählen.'),
      };
    },
    formula: "Sicherer Bereich: Pfannentemperatur < Rauchpunkt; Acrylamid-Prävention: Fritteuse max. 175 °C",
    formulaExplanation: "Wird der Rauchpunkt überschritten, zersetzen sich die Fettsäuren und es entsteht giftiges, stechend riechendes Acrolein (Glycerin-Abbauprodukt). Rauch in der Pfanne ist immer ein Warnsignal!",
    workedExample: {
          "title": "Beispiel: Steak scharf anbraten bei 200 °C mit nativem Olivenöl vs. Butterschmalz",
          "inputValues": [
                {
                      "label": "Temperatur",
                      "value": "200 °C"
                }
          ],
          "steps": [
                "Natives Olivenöl raucht bereits ab ca. 175 °C (ungeeignet)",
                "Butterschmalz raucht erst ab 205 °C (perfekt sicher)"
          ],
          "result": "Butterschmalz oder Erdnussöl verwenden"
    },
    faqs: [
          {
                "question": "Warum verbrennt normale Butter so schnell in der Pfanne?",
                "answer": "Butter besteht zu ca. 16 % aus Wasser und enthält Milcheiweiß und Milchzucker. Das Eiweiß verbrennt bereits ab ca. 150 °C und wird schwarz und bitter. Butterschmalz ist geklärtes, reines Butterfett und verträgt 205 °C!"
          },
          {
                "question": "Wie entsorgt man altes Frittieröl umweltgerecht?",
                "answer": "Niemals in den Abfluss oder die Toilette gießen, da das Fett erkaltet und Rohre verstopft! Füllen Sie erkaltetes Öl in eine alte Plastikflasche und werfen Sie diese in den Restmüll."
          }
    ],
    relatedSlugs: ["backzeit-temperatur-umluft-oberhitze-rechner","fleisch-kerntemperatur-garzeit-rechner","temperatur-umrechner"],
  },
  {
    id: "fondue-raclette-mengen-rechner",
    slug: "fondue-raclette-mengen-rechner",
    name: "Raclette- & Fondue-Mengen-Rechner (Käse, Fleisch & Beilagen p.P.)",
    shortName: "Raclette & Fondue",
    category: "kochen-backen",
    subcategory: "Kochen & Garen",
    metaTitle: "Raclette & Fondue Rechner – Käse- & Fleischmenge pro Person berechnen",
    metaDescription: "Berechnen Sie die perfekten Mengen für Silvester & Feiern: Raclettekäse (200 bis 250 g p.P.), Fleisch (200 bis 250 g p.P.), Pellkartoffeln, Baguette und Dips nach Gästeanzahl.",
    h1: "Raclette & Fondue Rechner – Einkaufsmenge für Party & Silvester",
    shortDescription: "Ermittelt Käse-, Fleisch- und Beilagenmengen pro Person.",
    searchKeywords: ["raclette mengen rechner wieviel kaese pro person 200g","fondue fleischmenge pro person 250g","raclette zutaten einkaufsliste berechnen silvester","kartoffeln baguette pro person raclette"],
    inputs: [
          {
                "id": "adultsCount",
                "label": "Anzahl Erwachsene",
                "type": "number",
                "defaultValue": 6,
                "min": 1,
                "max": 50,
                "step": 1,
                "unit": "Erwachsene"
          },
          {
                "id": "kidsCount",
                "label": "Anzahl Kinder (essen ca. halbe Portion)",
                "type": "number",
                "defaultValue": 2,
                "min": 0,
                "max": 20,
                "step": 1,
                "unit": "Kinder"
          },
          {
                "id": "eventStyle",
                "label": "Menü-Typ",
                "type": "select",
                "defaultValue": "racletteClassic",
                "options": [
                      {
                            "value": "racletteClassic",
                            "label": "Klassisches Raclette (viel Käse ca. 220 g p.P. + Beilagen)"
                      },
                      {
                            "value": "racletteMeat",
                            "label": "Raclette mit Tischgrill (ca. 180 g Käse + 150 g Fleisch p.P.)"
                      },
                      {
                            "value": "meatFondue",
                            "label": "Fleisch-Fondue Fett/Brühe (ca. 250 g Fleisch p.P.)"
                      },
                      {
                            "value": "cheeseFondue",
                            "label": "Schweizer Käsefondue (ca. 220 g Käse + 200 g Brot p.P.)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const adults = Number(inputs.adultsCount) || 1;
      const kids = Number(inputs.kidsCount) || 0;
      const totalEaters = adults + (kids * 0.5);
      const style = inputs.eventStyle;
      
      let cheesePerPersonG = 220;
      let meatPerPersonG = 0;
      let potatoesPerPersonG = 200;
      let breadPerPersonG = 100;
      
      if (style === 'racletteMeat') {
        cheesePerPersonG = 180;
        meatPerPersonG = 150;
        potatoesPerPersonG = 150;
      } else if (style === 'meatFondue') {
        cheesePerPersonG = 0;
        meatPerPersonG = 250;
        potatoesPerPersonG = 150;
        breadPerPersonG = 120;
      } else if (style === 'cheeseFondue') {
        cheesePerPersonG = 220;
        meatPerPersonG = 0;
        potatoesPerPersonG = 100;
        breadPerPersonG = 200; // Weißbrotwürfel
      }
      
      const totalCheeseG = Math.round(totalEaters * cheesePerPersonG);
      const totalMeatG = Math.round(totalEaters * meatPerPersonG);
      const totalPotatoesG = Math.round(totalEaters * potatoesPerPersonG);
      const totalBaguettes = Math.ceil((totalEaters * breadPerPersonG) / 250); // 250g Stange
      
      return {
        primary: { id: 'cheese', label: style === 'meatFondue' ? 'Fleisch Gesamtmenge' : 'Raclette- / Fonduekäse Gesamt', value: style === 'meatFondue' ? totalMeatG : totalCheeseG, formattedValue: (style === 'meatFondue' ? totalMeatG : totalCheeseG) + ' g (' + formatNumber((style === 'meatFondue' ? totalMeatG : totalCheeseG) / 1000, 2) + ' kg)', highlight: true },
        secondary: [
          { id: 'meat', label: 'Fleisch für Tischgrill / Fondue', value: totalMeatG, formattedValue: totalMeatG > 0 ? totalMeatG + ' g (' + formatNumber(totalMeatG / 1000, 2) + ' kg)' : 'Nicht ausgewählt' },
          { id: 'potatoes', label: 'Pellkartoffeln (Drillinge / festkochend)', value: totalPotatoesG, formattedValue: totalPotatoesG + ' g (' + formatNumber(totalPotatoesG / 1000, 2) + ' kg)' },
          { id: 'baguettes', label: 'Baguette-Stangen (à 250 g)', value: totalBaguettes, formattedValue: totalBaguettes + ' Stange(n)' },
          { id: 'eaters', label: 'Berechnungsgrundlage Esser', value: totalEaters, formattedValue: totalEaters + ' Vollportionen' },
        ],
        summaryText: 'Für ' + adults + ' Erwachsene und ' + kids + ' Kinder (' + totalEaters + ' Portionen) benötigen Sie ca. ' + (style === 'meatFondue' ? formatNumber(totalMeatG / 1000, 2) + ' kg Fleisch' : formatNumber(totalCheeseG / 1000, 2) + ' kg Käse') + ', ' + formatNumber(totalPotatoesG / 1000, 2) + ' kg Kartoffeln und ' + totalBaguettes + ' Baguettes.',
      };
    },
    formula: "Käse = Portionen × 200 bis 250 g; Fleisch = Portionen × 200 bis 250 g; Kartoffeln = Portionen × 150 bis 200 g",
    formulaExplanation: "Bei reinen Käse-Events plant man 200 bis 250 g Käse pro Erwachsenem. Bei kombiniertem Tischgrill teilt sich die Menge gleichmäßig auf Käse und Fleisch auf.",
    workedExample: {
          "title": "Beispiel: 6 Erwachsene zum klassischen Raclette-Abend",
          "inputValues": [
                {
                      "label": "Personen",
                      "value": "6 Erwachsene"
                },
                {
                      "label": "Menü",
                      "value": "Klassisches Raclette"
                }
          ],
          "steps": [
                "Käse = 6 × 220 g = 1.320 g Raclettekäse",
                "Kartoffeln = 6 × 200 g = 1.200 g Pellkartoffeln",
                "Brot = 6 × 100 g = 600 g Baguette (ca. 2-3 Stangen)"
          ],
          "result": "ca. 1,3 kg Käse, 1,2 kg Kartoffeln, 3 Baguettes"
    },
    faqs: [
          {
                "question": "Wie viele Scheiben Raclettekäse sind 200 Gramm?",
                "answer": "Eine Standardscheibe abgepackter Raclettekäse wiegt etwa 25 bis 30 Gramm. 200 Gramm entsprechen somit ca. 7 bis 8 Käsescheiben pro Person."
          },
          {
                "question": "Welcher Käse eignet sich neben original Schweizer Raclettekäse?",
                "answer": "Gouda mittelalt, milder Bergkäse, Cheddar oder Gorgonzola eignen sich hervorragend für Pfännchen-Variationen, da sie ebenfalls wunderbar schmelzen."
          }
    ],
    relatedSlugs: ["portionsrechner","fleisch-kerntemperatur-garzeit-rechner","nudeln-rohmaerk-gewicht-rechner"],
  },
  {
    id: "kuehlschrank-haltbarkeit-rechner",
    slug: "kuehlschrank-haltbarkeit-rechner",
    name: "Kühlschrank-Haltbarkeits-Rechner (Lagerdauer geöffneter Lebensmittel)",
    shortName: "Kühlschrank Haltbarkeit",
    category: "kochen-backen",
    subcategory: "Einkochen & Haltbarkeit",
    metaTitle: "Kühlschrank Haltbarkeit Rechner – Wie lange halten geöffnete Lebensmittel?",
    metaDescription: "Finden Sie die empfohlene Kühlschrank-Haltbarkeit in Tagen für Hackfleisch, Geflügel, geöffnete Milch, gekochte Reste, Eier und angebrochene Gläser.",
    h1: "Kühlschrank Haltbarkeit Rechner – Haltbarkeitsdauer & Lagertipps",
    shortDescription: "Ermittelt Haltbarkeitstage im Kühlschrank (2-7 °C) und Einfrierzeiten.",
    searchKeywords: ["kuehlschrank haltbarkeit rechner geoffnet tage","hackfleisch wie lange haltbar kuehlschrank 1 tag","gekochte reste wieviele tage im kuehlschrank","haltbarkeit milch geoffnet verbrauchen"],
    inputs: [
          {
                "id": "foodType",
                "label": "Lebensmittelkategorie",
                "type": "select",
                "defaultValue": "cookedLeftovers",
                "options": [
                      {
                            "value": "mincedMeat",
                            "label": "Rohes Hackfleisch / Mett (Sehr leicht verderblich)"
                      },
                      {
                            "value": "rawPoultry",
                            "label": "Rohes Geflügelfleisch (Hähnchen, Pute)"
                      },
                      {
                            "value": "rawBeef",
                            "label": "Rohes Rindfleisch / Braten am Stück"
                      },
                      {
                            "value": "cookedLeftovers",
                            "label": "Gekochte Essensreste (Suppen, Pasta, Auflauf)"
                      },
                      {
                            "value": "openedMilk",
                            "label": "Geöffnete Milch / Pflanzendrink"
                      },
                      {
                            "value": "openedJam",
                            "label": "Geöffnete Marmelade / Konfitüre"
                      },
                      {
                            "value": "rawEggs",
                            "label": "Frische rohe Eier (mit Schale)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const food = inputs.foodType;
      
      let maxDays = 3;
      let zone = 'Mittleres Fach (ca. 4-5 °C)';
      let freezeMonths = 3;
      let tip = 'In luftdichter Dose aufbewahren und vor dem Verzehr auf über 70 °C erhitzen.';
      
      if (food === 'mincedMeat') {
        maxDays = 1;
        zone = 'Kälteste Zone über dem Gemüsefach (unterste Glasplatte ca. 2 °C)';
        freezeMonths = 2;
        tip = 'Muss am Kauftag zubereitet werden! Durch die große Oberfläche vermehren sich Keime explosionsartig.';
      } else if (food === 'rawPoultry') {
        maxDays = 2;
        zone = 'Kälteste Zone über dem Gemüsefach (ca. 2 °C)';
        freezeMonths = 6;
        tip = 'Ausgetretenen Fleischsaft sofort entsorgen, Hände und Schneidebrett heiß mit Seife waschen.';
      } else if (food === 'rawBeef') {
        maxDays = 4;
        zone = 'Kälteste Zone (ca. 2 °C)';
        freezeMonths = 12;
        tip = 'Rindfleisch am Stück verdirbt deutlich langsamer als Geflügel oder Hackfleisch.';
      } else if (food === 'openedMilk') {
        maxDays = 5;
        zone = 'Mittleres Fach oder Türfach (ca. 4-7 °C)';
        freezeMonths = 0;
        tip = 'Geöffnete Milch nicht im warmen Zimmer stehen lassen; pasteurisierte Milch wird nach 4-5 Tagen sauer.';
      } else if (food === 'openedJam') {
        maxDays = 60;
        zone = 'Oberes Fach oder Kühlschranktür (ca. 6-8 °C)';
        freezeMonths = 0;
        tip = 'Immer mit sauberem Löffel entnehmen! Verhindert das Eintragen von Schimmelsporen.';
      } else if (food === 'rawEggs') {
        maxDays = 28;
        zone = 'Oberes Türfach (ca. 6-8 °C)';
        freezeMonths = 0;
        tip = 'Frische Eier müssen erst ab dem 18. Tag nach dem Legen in den Kühlschrank, halten dort aber viele Wochen.';
      }
      
      return {
        primary: { id: 'days', label: 'Empfohlene Lagerdauer im Kühlschrank', value: maxDays, formattedValue: maxDays === 1 ? 'Max. 1 Tag (am Kauftag verbrauchen)' : 'ca. ' + maxDays + ' Tage', highlight: true },
        secondary: [
          { id: 'zone', label: 'Optimaler Kühlschrank-Bereich', value: 0, formattedValue: zone },
          { id: 'freeze', label: 'Im Gefrierfach haltbar (-18 °C)', value: freezeMonths, formattedValue: freezeMonths > 0 ? 'ca. ' + freezeMonths + ' Monate' : 'Einfrieren nicht empfohlen' },
          { id: 'hygieneTip', label: 'Wichtiger Hygiene-Hinweis', value: 0, formattedValue: tip },
        ],
        summaryText: 'Dieses Lebensmittel ist im Kühlschrank ' + (maxDays === 1 ? 'maximal 1 Tag' : 'ca. ' + maxDays + ' Tage') + ' haltbar (' + zone + '). ' + tip,
      };
    },
    formula: "Lagerung bei 2 °C bis 7 °C; Kälteste Zone = Glasplatte direkt über dem Gemüsefach (ca. 2 °C)",
    formulaExplanation: "Warme Luft steigt im Kühlschrank nach oben: Das oberste Fach hat ca. 8 °C, die Glasplatte über dem Gemüsefach nur ca. 2 °C. Leicht verderbliche Fleisch- und Fischwaren gehören zwingend ganz nach unten.",
    workedExample: {
          "title": "Beispiel: Gekochte Nudeln oder Suppenreste aufbewahren",
          "inputValues": [
                {
                      "label": "Lebensmittel",
                      "value": "Gekochte Reste"
                }
          ],
          "steps": [
                "Reste innerhalb von 2 Stunden nach dem Kochen abkühlen lassen",
                "In einer verschlossenen Glas- oder Frischhaltedose im mittleren Fach lagern",
                "Binnen 2 bis maximal 3 Tagen aufbrauchen"
          ],
          "result": "ca. 3 Tage Haltbarkeit"
    },
    faqs: [
          {
                "question": "Wie erkennt man, ob ein Ei noch frisch ist?",
                "answer": "Der Wassertest: Legen Sie das Ei in ein Glas kaltes Wasser. Bleibt es am Boden liegen, ist es frisch. Richtet es sich schräg auf, ist es älter aber essbar. Schwimmt es an der Oberfläche, hat sich zu viel Fäulnisgas gebildet -> nicht mehr essen!"
          },
          {
                "question": "Darf man heiße Speisen direkt in den Kühlschrank stellen?",
                "answer": "Nein, heiße Speisen erwärmen das gesamte Kühlschrankinnere und gefährden andere Lebensmittel. Lassen Sie Töpfe erst auf Zimmertemperatur abkühlen."
          }
    ],
    relatedSlugs: ["marmelade-geliermittel-rechner","fleisch-kerntemperatur-garzeit-rechner","salz-lake-poekel-rechner"],
  },
  {
    id: "tee-ziehzeit-temperatur-rechner",
    slug: "tee-ziehzeit-temperatur-rechner",
    name: "Tee-Ziehzeit- & Temperatur-Rechner (Grüner, Schwarzer & Kräutertee)",
    shortName: "Tee Ziehzeit-Rechner",
    category: "kochen-backen",
    subcategory: "Getränke",
    metaTitle: "Tee Ziehzeit Rechner – Wassertemperatur (°C) & Ziehdauer nach Teesorte",
    metaDescription: "Finden Sie die perfekte Wassertemperatur und Ziehzeit für Grünen Tee (70-80 °C, 2 Min.), Schwarzen Tee (95 °C, 3 Min.), Weißen Tee, Kräutertee und Früchtetee (100 °C, 8 Min.).",
    h1: "Tee Ziehzeit Rechner – Temperatur & Ziehdauer für besten Geschmack",
    shortDescription: "Ermittelt Wassertemperatur und Ziehzeit nach Teesorte.",
    searchKeywords: ["tee ziehzeit rechner wassertemperatur grad","gruener tee temperatur 70 grad nicht bitter","schwarzer tee ziehzeit 3 minuten anregend","kraeutertee sprudelnd kochend ziehen lassen"],
    inputs: [
          {
                "id": "teaType",
                "label": "Teesorte",
                "type": "select",
                "defaultValue": "green",
                "options": [
                      {
                            "value": "green",
                            "label": "Grüner Tee (Sencha, Bancha – 70 bis 80 °C, ca. 2 Min.)"
                      },
                      {
                            "value": "matcha",
                            "label": "Matcha / Gyokuro (Sehr edel – 60 bis 65 °C)"
                      },
                      {
                            "value": "white",
                            "label": "Weißer Tee (Pai Mu Tan – 75 bis 80 °C, ca. 3-4 Min.)"
                      },
                      {
                            "value": "black",
                            "label": "Schwarzer Tee (Darjeeling, Earl Grey – 90 bis 95 °C, ca. 3-4 Min.)"
                      },
                      {
                            "value": "oolong",
                            "label": "Oolong Tee (halbfermentiert – 80 bis 90 °C, ca. 3 Min.)"
                      },
                      {
                            "value": "herbal",
                            "label": "Kräutertee / Kamille / Minze (100 °C sprudelnd kochend, 6-8 Min.)"
                      },
                      {
                            "value": "fruit",
                            "label": "Früchtetee (100 °C sprudelnd kochend, 8-10 Min.)"
                      }
                ]
          },
          {
                "id": "waterAmountMl",
                "label": "Wassermenge",
                "type": "number",
                "defaultValue": 250,
                "min": 100,
                "max": 2000,
                "step": 50,
                "unit": "ml"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const tea = inputs.teaType;
      const waterMl = Number(inputs.waterAmountMl) || 250;
      
      let temp = 75;
      let brewMins = 2;
      let teaGramsPerLiter = 12; // ca. 2-3g je Tasse (250ml)
      let effect = 'Harmonisch, feinherb, reich an Antioxidantien';
      
      if (tea === 'matcha') {
        temp = 65;
        brewMins = 0; // Aufschlagen mit Bambusbesen
        effect = 'Extrem reich an Koffein und L-Theanin; wird mit dem Chasen schaumig geschlagen.';
      } else if (tea === 'white') {
        temp = 75;
        brewMins = 3.5;
        effect = 'Sehr mild, samtig und blumig; verträgt mehrfache Aufgüsse.';
      } else if (tea === 'black') {
        temp = 95;
        brewMins = 3;
        effect = 'Nach 3 Min. anregend (Koffein gelöst); ab 5 Min. beruhigend für den Magen, aber bitterer (Gerbstoffe).';
      } else if (tea === 'oolong') {
        temp = 85;
        brewMins = 3;
        effect = 'Traditionell in vielen kurzen Aufgüssen genossen (Gong Fu Cha).';
      } else if (tea === 'herbal') {
        temp = 100;
        brewMins = 7;
        effect = 'Zwingend mit 100 °C kochendem Wasser aufgießen, um ein sicheres Lebensmittel zu erhalten!';
      } else if (tea === 'fruit') {
        temp = 100;
        brewMins = 9;
        effect = 'Benötigt langes Ziehen für vollen Fruchtgeschmack und schöne Färbung.';
      }
      
      const teaLeavesGrams = Math.round((waterMl / 1000) * teaGramsPerLiter * 10) / 10;
      const teabagsEquiv = Math.ceil(teaLeavesGrams / 2.0); // ca. 2g je Beutel
      
      return {
        primary: { id: 'brewTime', label: 'Optimale Ziehzeit', value: brewMins, formattedValue: brewMins > 0 ? brewMins + ' Minuten' : 'Sofort schaumig schlagen (Matcha)', highlight: true },
        secondary: [
          { id: 'temperature', label: 'Optimale Wassertemperatur', value: temp, formattedValue: temp + ' °C' },
          { id: 'teaLeaves', label: 'Teeblätter-Menge', value: teaLeavesGrams, formattedValue: formatNumber(teaLeavesGrams, 1) + ' g (ca. ' + teabagsEquiv + ' Beutel bzw. TL)' },
          { id: 'effectInfo', label: 'Geschmack & Wirkung', value: 0, formattedValue: effect },
        ],
        summaryText: 'Für ' + waterMl + ' ml Wasser benötigen Sie ca. ' + formatNumber(teaLeavesGrams, 1) + ' g Teeblätter. Wasser auf ' + temp + ' °C temperieren und ' + (brewMins > 0 ? brewMins + ' Minuten' : 'schaumig schlagen') + '. ' + effect,
      };
    },
    formula: "Tee (g) = (Wasservolumen / 1.000) × 12 g; Echte Tees (Camellia sinensis): 60 bis 90 °C; Kräuter/Früchte: 100 °C",
    formulaExplanation: "Grüner und weißer Tee enthalten empfindliche Aminosäuren und Polyphenole, die bei über 80 °C zerstört werden und den Tee extrem bitter machen.",
    workedExample: {
          "title": "Beispiel: Eine Kanne Grüner Tee (750 ml)",
          "inputValues": [
                {
                      "label": "Wasser",
                      "value": "750 ml"
                },
                {
                      "label": "Tee",
                      "value": "Grüner Tee"
                }
          ],
          "steps": [
                "Wasser nach dem Kochen ca. 6 bis 8 Minuten auf 75 °C abkühlen lassen",
                "Teemenge = 0,75 × 12 g = 9 g Teeblätter (ca. 3-4 Teelöffel)",
                "Genau 2 Minuten ziehen lassen"
          ],
          "result": "75 °C Wassertemperatur, 2 Minuten Ziehzeit"
    },
    faqs: [
          {
                "question": "Wie lange dauert es, bis kochendes Wasser auf 80 °C abkühlt?",
                "answer": "Ein frisch gekochter Wasserkocher (1 Liter Wasser mit geöffnetem Deckel) benötigt bei Zimmertemperatur etwa 6 bis 8 Minuten, um von 100 °C auf ca. 75-80 °C abzukühlen."
          },
          {
                "question": "Warum muss Kräutertee mit kochendem Wasser aufgegossen werden?",
                "answer": "Kräuter- und Früchtetees sind getrocknete Naturprodukte, die Sporen und Keime enthalten können. Nur sprudelnd kochendes Wasser (100 °C) und mindestens 5 Minuten Ziehzeit garantieren mikrobiologische Sicherheit."
          }
    ],
    relatedSlugs: ["kaffee-wasser-verhaeltnis-rechner","temperatur-umrechner","zeit-umrechner"],
  },
  {
    id: "kalorien-rezept-rechner",
    slug: "kalorien-rezept-rechner",
    name: "Rezept-Kalorien-Rechner (Gesamtkalorien & Makros pro Portion)",
    shortName: "Rezept-Kalorien-Rechner",
    category: "kochen-backen",
    subcategory: "Ernährung & Diät",
    metaTitle: "Rezept Kalorien Rechner – kcal & Makronährstoffe pro Portion berechnen",
    metaDescription: "Berechnen Sie die Gesamtkalorien (kcal) und Makronährstoffe (Kohlenhydrate, Eiweiß, Fett) eines Rezepts nach Hauptzutaten und Portionen.",
    h1: "Rezept Kalorien Rechner – Nährwerte & Makros pro Portion ermitteln",
    shortDescription: "Berechnet Kalorien und Makros pro Portion für eigene Rezepte.",
    searchKeywords: ["rezept kalorien rechner kcal pro portion berechnen","makros rezept kohlenhydrate eiweiss fett gramm","rezept naehrwerte selbst berechnen online","kalorien pro teller mahlzeit rechner"],
    inputs: [
          {
                "id": "carbsG",
                "label": "Kohlenhydrate gesamt im Rezept",
                "type": "number",
                "defaultValue": 120,
                "min": 0,
                "max": 2000,
                "step": 5,
                "unit": "g KH"
          },
          {
                "id": "proteinG",
                "label": "Eiweiß / Protein gesamt",
                "type": "number",
                "defaultValue": 60,
                "min": 0,
                "max": 1000,
                "step": 5,
                "unit": "g Eiweiß"
          },
          {
                "id": "fatG",
                "label": "Fett gesamt (Öl, Butter, Nüsse)",
                "type": "number",
                "defaultValue": 30,
                "min": 0,
                "max": 1000,
                "step": 5,
                "unit": "g Fett"
          },
          {
                "id": "portionsCount",
                "label": "Anzahl Portionen des Rezepts",
                "type": "number",
                "defaultValue": 3,
                "min": 1,
                "max": 20,
                "step": 1,
                "unit": "Portionen"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const carbs = Number(inputs.carbsG) || 0;
      const protein = Number(inputs.proteinG) || 0;
      const fat = Number(inputs.fatG) || 0;
      const portions = Number(inputs.portionsCount) || 1;
      
      // Energie physiologischer Brennwert nach Atwater:
      // 1 g KH = 4.1 kcal (17 kJ)
      // 1 g Eiweiß = 4.1 kcal (17 kJ)
      // 1 g Fett = 9.3 kcal (37 kJ)
      const totalKcal = (carbs * 4.1) + (protein * 4.1) + (fat * 9.3);
      const totalKj = totalKcal * 4.184;
      
      const kcalPerPortion = totalKcal / portions;
      const carbsPerPortion = carbs / portions;
      const proteinPerPortion = protein / portions;
      const fatPerPortion = fat / portions;
      
      return {
        primary: { id: 'kcalPortion', label: 'Kalorien pro Portion', value: kcalPerPortion, formattedValue: formatNumber(kcalPerPortion, 0) + ' kcal', highlight: true },
        secondary: [
          { id: 'totalKcal', label: 'Gesamtkalorien des Rezepts', value: totalKcal, formattedValue: formatNumber(totalKcal, 0) + ' kcal (' + formatNumber(totalKj, 0) + ' kJ)' },
          { id: 'carbsP', label: 'Kohlenhydrate p.P.', value: carbsPerPortion, formattedValue: formatNumber(carbsPerPortion, 1) + ' g' },
          { id: 'proteinP', label: 'Eiweiß p.P.', value: proteinPerPortion, formattedValue: formatNumber(proteinPerPortion, 1) + ' g' },
          { id: 'fatP', label: 'Fett p.P.', value: fatPerPortion, formattedValue: formatNumber(fatPerPortion, 1) + ' g' },
        ],
        summaryText: 'Das gesamte Rezept liefert ' + formatNumber(totalKcal, 0) + ' kcal. Aufgeteilt auf ' + portions + ' Portionen sind das genau ' + formatNumber(kcalPerPortion, 0) + ' kcal pro Portion (KH: ' + formatNumber(carbsPerPortion, 1) + ' g, EW: ' + formatNumber(proteinPerPortion, 1) + ' g, Fett: ' + formatNumber(fatPerPortion, 1) + ' g).',
      };
    },
    formula: "kcal = (Kohlenhydrate × 4,1) + (Eiweiß × 4,1) + (Fett × 9,3); kcal p.P. = Gesamtkalorien / Portionen",
    formulaExplanation: "Fett hat mit über 9 kcal pro Gramm mehr als doppelt so viel Energie wie Kohlenhydrate und Proteine (je ca. 4,1 kcal/g).",
    workedExample: {
          "title": "Beispiel: Pasta mit Lachs für 2 Personen (160 g KH, 50 g Eiweiß, 25 g Fett)",
          "inputValues": [
                {
                      "label": "KH",
                      "value": "160 g"
                },
                {
                      "label": "Eiweiß",
                      "value": "50 g"
                },
                {
                      "label": "Fett",
                      "value": "25 g"
                },
                {
                      "label": "Portionen",
                      "value": "2"
                }
          ],
          "steps": [
                "Gesamt = (160 × 4,1) + (50 × 4,1) + (25 × 9,3) = 656 + 205 + 232,5 = 1.093,5 kcal",
                "Pro Portion = 1.093,5 / 2 ≈ 547 kcal"
          ],
          "result": "547 kcal pro Portion"
    },
    faqs: [
          {
                "question": "Wie rechnet man Kilokalorien in Kilojoule um?",
                "answer": "Multiplizieren Sie die Kalorienzahl mit 4,184: 1 kcal = 4,184 kJ. 500 kcal entsprechen rund 2.092 kJ."
          },
          {
                "question": "Verändern sich die Kalorien von Nudeln oder Reis beim Kochen?",
                "answer": "Nein, das Nahrungsmittel saugt nur kalorienfreies Wasser auf. 100 g trockene Nudeln (ca. 350 kcal) ergeben gekocht ca. 230 g Pasta, die zusammen immer noch exakt dieselben 350 kcal enthalten."
          }
    ],
    relatedSlugs: ["portionsrechner","nudeln-rohmaerk-gewicht-rechner","zucker-ersatz-rechner"],
  },
  {
    id: "schokolade-temperieren-rechner",
    slug: "schokolade-temperieren-rechner",
    name: "Schokolade-Temperieren-Rechner (Impfmethode & Kuvertüre-Temperaturen)",
    shortName: "Schokolade temperieren",
    category: "kochen-backen",
    subcategory: "Backzutaten",
    metaTitle: "Schokolade temperieren Rechner – Impfmethode, Kuvertüre & Gradzahlen",
    metaDescription: "Berechnen Sie die exakten Temperaturen und Impfmengen (2/3 schmelzen bei 45 °C, 1/3 Impfschokolade bei 27 °C zugeben) für Zartbitter-, Vollmilch- und weiße Kuvertüre.",
    h1: "Schokolade temperieren Rechner – Perfekter Glanz & Knack nach Impfmethode",
    shortDescription: "Ermittelt Impfmengen und Arbeitstemperaturen für Kuvertüre.",
    searchKeywords: ["schokolade temperieren rechner impfmethode","kuvertuere schmelzen temperatur zartbitter vollmilch weiss","schokolade impfen mengenverhaeltnis 2 drittel 1 drittel","pralinen schokolade glanz knack beta kristalle"],
    inputs: [
          {
                "id": "totalChocolateG",
                "label": "Gesamtmenge Schokolade / Kuvertüre",
                "type": "number",
                "defaultValue": 300,
                "min": 50,
                "max": 5000,
                "step": 25,
                "unit": "g"
          },
          {
                "id": "chocType",
                "label": "Schokoladensorte",
                "type": "select",
                "defaultValue": "dark",
                "options": [
                      {
                            "value": "dark",
                            "label": "Zartbitter-Kuvertüre (Schmelzen 45-50 °C, Kühlen 28 °C, Arbeiten 31-32 °C)"
                      },
                      {
                            "value": "milk",
                            "label": "Vollmilch-Kuvertüre (Schmelzen 45 °C, Kühlen 27 °C, Arbeiten 29-30 °C)"
                      },
                      {
                            "value": "white",
                            "label": "Weiße Kuvertüre (Schmelzen 40-45 °C, Kühlen 26 °C, Arbeiten 28-29 °C)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const totalG = Number(inputs.totalChocolateG) || 300;
      const type = inputs.chocType;
      
      // Impfmethode: 2/3 der Schokolade schmelzen, 1/3 fein gehackt unterrühren
      const meltPortionG = Math.round((totalG * 2) / 3);
      const seedPortionG = totalG - meltPortionG;
      
      let meltTemp = '45 °C bis 50 °C';
      let coolTemp = 'ca. 28 °C';
      let workTemp = '31 °C bis 32 °C';
      
      if (type === 'milk') {
        meltTemp = 'ca. 45 °C';
        coolTemp = 'ca. 27 °C';
        workTemp = '29 °C bis 30 °C';
      } else if (type === 'white') {
        meltTemp = '40 °C bis 45 °C (sehr hitzeempfindlich!)';
        coolTemp = 'ca. 26 °C';
        workTemp = '28 °C bis 29 °C';
      }
      
      return {
        primary: { id: 'meltPortion', label: 'Im Wasserbad schmelzen (2/3)', value: meltPortionG, formattedValue: meltPortionG + ' g (bei ' + meltTemp + ')', highlight: true },
        secondary: [
          { id: 'seedPortion', label: 'Fein gehackt zum Impfen einrühren (1/3)', value: seedPortionG, formattedValue: seedPortionG + ' g (bis ' + coolTemp + ' erreicht ist)', highlight: true },
          { id: 'workTemperature', label: 'Optimale Verarbeitungstemperatur', value: 0, formattedValue: workTemp },
          { id: 'crystalType', label: 'Ziel-Kristallform', value: 0, formattedValue: 'Stabile Beta-V-Kristalle (für Glanz & Knack)' },
        ],
        summaryText: 'Schmelzen Sie ' + meltPortionG + ' g Schokolade schonend im Wasserbad auf ' + meltTemp + '. Nehmen Sie die Schüssel vom Wasserbad und rühren Sie die restlichen ' + seedPortionG + ' g gehackte Schokolade ein, bis die Masse auf ' + coolTemp + ' abgekühlt ist. Bei ' + workTemp + ' verarbeiten.',
      };
    },
    formula: "Schmelzanteil = 2/3 des Gesamtgewichts; Impfanteil = 1/3 des Gesamtgewichts",
    formulaExplanation: "Richtiges Vorkristallisieren bildet stabile Beta-V-Kakaobutterkristalle. Dadurch zieht sich die Schokolade beim Erkalten leicht zusammen, löst sich perfekt aus der Form und bekommt einen seidigen Glanz ohne grauen Fettreif.",
    workedExample: {
          "title": "Beispiel: 300 g Zartbitterkuvertüre für Pralinen temperieren",
          "inputValues": [
                {
                      "label": "Menge",
                      "value": "300 g"
                },
                {
                      "label": "Sorte",
                      "value": "Zartbitter"
                }
          ],
          "steps": [
                "200 g (2/3) im warmen Wasserbad auf 48 °C schmelzen",
                "100 g (1/3) feingehackt unterrühren, bis alles geschmolzen ist und 28 °C erreicht sind",
                "Ganz kurz erwärmen auf 31-32 °C Arbeitstemperatur"
          ],
          "result": "200 g schmelzen, 100 g impfen (31-32 °C)"
    },
    faqs: [
          {
                "question": "Was tun, wenn auch nur ein Tropfen Wasser in die geschmolzene Schokolade gelangt?",
                "answer": "Wasser ist der Feind geschmolzener Schokolade! Schon ein kleiner Wassertropfen lässt die Schokolade sofort \"gerinnen\" und zu einer festen, klumpigen Masse erstarren."
          },
          {
                "question": "Was ist der Unterschied zwischen Kuvertüre und normaler Tafelschokolade?",
                "answer": "Kuvertüre enthält gesetzlich mindestens 31 % Kakaobutter (Tafelschokolade meist nur 18-25 %). Durch den höheren Fettgehalt ist Kuvertüre flüssiger und bildet einen viel dünneren, knackigen Überzug."
          }
    ],
    relatedSlugs: ["backzeit-temperatur-umluft-oberhitze-rechner","temperatur-umrechner","cups-in-gramm-rechner"],
  },
];
