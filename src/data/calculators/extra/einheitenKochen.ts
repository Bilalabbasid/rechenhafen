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
    metaTitle: 'Gewicht Umrechner – Kilogramm, Gramm, Pfund (lbs) & Unzen (oz)',
    metaDescription: 'Rechnen Sie Gewichte sekundenschnell um zwischen Kilogramm (kg), Gramm (g), Milligramm (mg), Tonnen (t), englischen Pfund (lbs) und Unzen (oz).',
    h1: 'Gewicht Umrechner – kg, g, lbs & oz präzise umrechnen',
    shortDescription: 'Konvertiert Gewichtseinheiten zwischen metrischem und angloamerikanischem System mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Massenkonverter rechnet physikalische Massen zwischen Milligramm, Gramm, Kilogramm, Tonnen sowie imperialen Pfund (lb), Unzen (oz) und Steinen (Stone) um.',
      details: 'Seit dem International Avoirdupois Agreement gilt: 1 englisches Pfund (Pound lb) = exakt 0,45359237 kg. 1 Unze (Ounce oz) = 1/16 lb ≈ 28,3495 Gramm. Das deutsche Apotheker- oder Zollpfund wurde historisch auf genau 500 g gerundet.',
    },
    faqs: [
      { question: 'Was ist der Unterschied zwischen einer Feinunze (Troy Ounce) und einer normalen Unze?', answer: 'Gold und Silber werden in Feinunzen (oz. tr.) gehandelt: 1 Feinunze wiegt exakt 31,1034768 Gramm, während eine gewöhnliche Handelsunze nur ca. 28,35 g wiegt.' },
      { question: 'Was ist der physikalische Unterschied zwischen Masse und Gewichtskraft?', answer: 'Die Masse (in kg) ist überall im Universum unveränderlich; die Gewichtskraft (in Newton) hängt von der lokalen Gravitation ab (auf dem Mond wiegt ein Mensch nur 1/6 so viel wie auf der Erde).' },
    ],
    relatedSlugs: ['papierformat-din-rechner', 'laengen-umrechner', 'volumen-umrechner', 'kraft-umrechner', 'dichte-umrechner'],
  },
  {
    id: "druck-umrechner",
    slug: "druck-umrechner",
    name: "Druck Umrechner (bar, PSI, Pascal, hPa, mbar & Torr)",
    shortName: "Druck Umrechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: 'Druck Umrechner – bar, PSI, Pascal (Pa), hPa & Torr umrechnen',
    metaDescription: 'Rechnen Sie Druckeinheiten exakt um zwischen bar, Millibar (mbar), Pascal (Pa), Hektopascal (hPa), PSI (Pound-force per square inch) und Torr/mmHg.',
    h1: 'Druck Umrechner – bar, PSI, Pascal & mbar sofort umrechnen',
    shortDescription: 'Konvertiert bar, PSI, Pascal, hPa und Torr mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Druckrechner konvertiert Drücke zwischen Pascal (Pa), Bar (bar), technischer Atmosphäre (at), Millimeter Quecksilbersäule (mmHg/Torr) und PSI (Pound-force per square inch).',
      details: '1 bar = 100.000 Pascal = 100 kPa = 1.000 hPa (Standardmaß in der Meteorologie). 1 physikalische Standardatmosphäre (1 atm) = 1.013,25 hPa = 760 mmHg. 1 bar ≈ 14,5038 PSI.',
    },
    faqs: [
      { question: 'Welcher Reifendruck ist in PSI angegeben und was entspricht 32 PSI in Bar?', answer: 'Viele US- und Fahrradreifen nutzen PSI: 32 PSI geteilt durch 14,5038 ergibt ca. 2,21 bar Reifendruck.' },
      { question: 'Was bedeutet der Blutdruckwert "120 zu 80" in echten Druckeinheiten?', answer: 'Es handelt sich um Millimeter Quecksilbersäule (mmHg): 120 mmHg entsprechen ca. 160 hPa oder 0,16 bar Druck.' },
    ],
    relatedSlugs: ['dezibel-schalldruck-umrechner', 'viskositaet-umrechner', 'temperatur-umrechner', 'kraft-umrechner', 'geschwindigkeit-umrechner'],
  },
  {
    id: "geschwindigkeit-umrechner",
    slug: "geschwindigkeit-umrechner",
    name: "Geschwindigkeit Umrechner (km/h, m/s, mph & Knoten)",
    shortName: "Geschwindigkeit Umrechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: 'Geschwindigkeit Umrechner – km/h, m/s, mph',
    metaDescription: 'Rechnen Sie Geschwindigkeiten sekundenschnell um zwischen km/h, Meter pro Sekunde (m/s), Meilen pro Stunde (mph), Seemeilen/Knoten (kn) und Mach.',
    h1: 'Geschwindigkeit Umrechner – km/h, m/s, mph & Knoten ermitteln',
    shortDescription: 'Konvertiert km/h in m/s, Meilen pro Stunde und Seemeilen-Knoten mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Geschwindigkeitsrechner transformiert Werte zwischen km/h, Metern pro Sekunde (m/s), Meilen pro Stunde (mph) und Knoten (Knoten kn, Seemeilen pro Stunde).',
      details: 'Zentrale Faustregel: km/h geteilt durch 3,6 ergibt m/s (z. B. 36 km/h = 10 m/s; 100 km/h ≈ 27,78 m/s). 1 Knoten = 1 Seemeile pro Stunde = 1,852 km/h. 1 mph ≈ 1,609 km/h.',
    },
    faqs: [
      { question: 'Wie schnell ist Mach 1 (Schallgeschwindigkeit)?', answer: 'In trockener Luft bei 20 °C auf Meereshöhe beträgt die Schallgeschwindigkeit ca. 343 m/s bzw. 1.235 km/h.' },
      { question: 'Was bedeutet die Geschwindigkeitsangabe 55 mph auf US-Highways in km/h?', answer: '55 Meilen pro Stunde entsprechen ca. 88,5 km/h.' },
    ],
    relatedSlugs: ['drehzahl-umfangsgeschwindigkeit-rechner', 'laengen-umrechner', 'kraftstoffverbrauch-umrechner', 'zeit-umrechner'],
  },
  {
    id: "volumen-umrechner",
    slug: "volumen-umrechner",
    name: "Volumen Umrechner (Liter, ml, m³, Gallonen & Fluid Ounces)",
    shortName: "Volumen Umrechner",
    category: "einheiten",
    subcategory: "Raummaße & Hohlmaße",
    metaTitle: 'Volumen Umrechner – Liter, Milliliter, m³',
    metaDescription: 'Rechnen Sie Hohlmaße und Raummaße um zwischen Liter, Milliliter, Kubikmeter (m³), US-Gallonen, UK-Gallonen, Fluid Ounces (fl oz) und Kubikfuß.',
    h1: 'Volumen Umrechner – Liter, m³, Gallonen & fl oz berechnen',
    shortDescription: 'Konvertiert Liter, Kubikmeter, Gallonen und flüssige Unzen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Raummaß-Konverter rechnet Kubikmeter, Liter, Milliliter sowie amerikanische Gallonen (US gal), Pints und Flüssigunzen (fl oz) um.',
      details: '1 Kubikmeter (m³) = 1.000 Kubikdezimeter (dm³) = 1.000 Liter. 1 US-Flüssiggallone (Liquid Gallon) = 3,78541 Liter; 1 britische Imperial Gallon = 4,54609 Liter.',
    },
    faqs: [
      { question: 'Wie viel Liter fasst ein US-Öl-Barrel (bbl)?', answer: 'Ein Standard-Rohöl-Barrel fasst exakt 42 US-Gallonen, was genau 158,9873 Litern entspricht.' },
      { question: 'Wie viele Milliliter sind eine amerikanische Flüssigunze (fl. oz.)?', answer: '1 US fluid ounce entspricht ca. 29,57 ml; eine britische Imperial fl oz misst ca. 28,41 ml.' },
    ],
    relatedSlugs: ['gewicht-masse-umrechner', 'laengen-umrechner', 'gramm-in-ml-rechner', 'dichte-umrechner'],
  },
  {
    id: "flaeche-umrechner",
    slug: "flaeche-umrechner",
    name: "Flächen Umrechner (m², km², Hektar ha, Ar & Acres)",
    shortName: "Flächen Umrechner",
    category: "einheiten",
    subcategory: "Geometrische Maße",
    metaTitle: 'Flächen Umrechner – Quadratmeter (m²), Hektar (ha), Ar & Acres',
    metaDescription: 'Rechnen Sie Flächenmaße präzise um zwischen Quadratmetern (m²), Quadratkilometern (km²), Hektar (ha), Ar (a), Acres und Quadratfuß (sq ft).',
    h1: 'Flächen Umrechner – m², Hektar, Ar & Acres sofort umrechnen',
    shortDescription: 'Konvertiert Quadratmeter, Hektar, Ar und angloamerikanische Acres mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Flächenumrechner transformiert Flächenmaße zwischen Quadratmillimetern, Quadratzentimetern, Quadratmetern, Ar, Hektar, Quadratkilometern und angloamerikanischen Acres.',
      details: 'Umrechnungsfaktor bei metrischen Flächen ist stets 100: 1 km² = 100 Hektar (ha); 1 ha = 100 Ar (a); 1 a = 100 Quadratmeter (m²). 1 Acre entspricht ca. 4.046,86 m² (ca. 0,405 Hektar).',
    },
    faqs: [
      { question: 'Wie groß ist ein Hektar im Vergleich zu einem Fußballfeld?', answer: 'Ein Hektar misst exakt 10.000 m² (100 × 100 m); ein Standard-FIFA-Fußballfeld (105 × 68 m = 7.140 m²) entspricht ca. 0,71 Hektar.' },
      { question: 'Wie viele Quadratfuß (sq ft) sind ein Quadratmeter?', answer: '1 m² entspricht ca. 10,764 Quadratfuß (oft in US-Immobilienanzeigen als square feet angegeben).' },
    ],
    relatedSlugs: ['papierformat-din-rechner', 'laengen-umrechner', 'volumen-umrechner', 'dachflaeche-rechner'],
  },
  {
    id: "energie-arbeit-umrechner",
    slug: "energie-arbeit-umrechner",
    name: "Energie & Arbeit Umrechner (Joule, kWh, kcal & BTU)",
    shortName: "Energie Umrechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: 'Energie Umrechner – Joule, Kilowattstunden, kcal',
    metaDescription: 'Rechnen Sie Energie und mechanische Arbeit um zwischen Joule (J), Kilojoule (kJ), Kilowattstunden (kWh), Kilokalorien (kcal) und British Thermal Units.',
    h1: 'Energie Umrechner – Joule, kWh, kcal & BTU berechnen',
    shortDescription: 'Konvertiert Joule in kWh, Kilokalorien und BTU mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Energierechner konvertiert Energie, Arbeit und Wärmemengen zwischen Joule (J), Kilowattstunden (kWh), Kilokalorien (kcal), Wattsekunden und British Thermal Units (BTU).',
      details: '1 Kilowattstunde (kWh) = 3.600.000 Joule = 3,6 Megajoule (MJ). 1 Kilokalorie (kcal) = exakt 4.186,8 Joule (internationale Kalorie). 1 BTU ≈ 1.055 Joule.',
    },
    faqs: [
      { question: 'Wie viel Kilowattstunden Energie stecken in 1.000 Kilokalorien Nahrung?', answer: '1.000 kcal entsprechen exakt 1,163 Kilowattstunden chemischer Energie.' },
      { question: 'Was ist ein Elektronenvolt (eV)?', answer: 'Eine winzige Energieeinheit der Atom- und Teilchenphysik: 1 eV ≈ 1,602 · 10⁻¹⁹ Joule (die kinetische Energie eines Elektrons beim Durchlaufen von 1 Volt Spannung).' },
    ],
    relatedSlugs: ['radioaktivitaet-strahlendosis-rechner', 'elektrische-ladung-kapazitaet-rechner', 'beleuchtungsstaerke-lux-lumen-rechner', 'leistung-umrechner', 'stromkostenrechner', 'kalorien-rezept-rechner'],
  },
  {
    id: "leistung-umrechner",
    slug: "leistung-umrechner",
    name: "Leistung Umrechner (kW, PS Pferdestärke, Watt & HP)",
    shortName: "Leistung Umrechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: 'Leistung Umrechner – kW in PS, Watt',
    metaDescription: 'Rechnen Sie Motor- und Heizleistung exakt um zwischen Kilowatt (kW), DIN-Pferdestärke (PS), Watt (W) und angloamerikanischen Horsepower (hp).',
    h1: 'Leistung Umrechner – kW in PS & Horsepower präzise umrechnen',
    shortDescription: 'Konvertiert Kilowatt (kW) in Pferdestärken (PS) und Watt mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Leistungskonverter rechnet mechanische und elektrische Leistung zwischen Watt (W), Kilowatt (kW), Megawatt (MW) und Pferdestärken (PS / hp) um.',
      details: 'In Deutschland gilt nach DIN 66036: 1 metrische PS = exakt 735,49875 Watt ≈ 0,7355 kW. Umgekehrt entspricht 1 kW exakt 1,35962 PS. Die angloamerikanische Mechanical Horsepower (hp) ist mit ca. 745,7 Watt minimal größer.',
    },
    faqs: [
      { question: 'Wie rechnet man kW im Auto-Fahrzeugschein schnell im Kopf in PS um?', answer: 'Multiplizieren Sie die kW-Zahl mit 1,36 (z. B. 110 kW × 1,36 ≈ 150 PS).' },
      { question: 'Was bedeutet die Einheit Gigawatt (GW)?', answer: '1 Gigawatt entspricht 1.000 Megawatt bzw. 1 Milliarde Watt (entspricht der elektrischen Dauerleistung eines typischen Kernkraftwerksblocks).' },
    ],
    relatedSlugs: ['dezibel-schalldruck-umrechner', 'elektrische-ladung-kapazitaet-rechner', 'beleuchtungsstaerke-lux-lumen-rechner', 'energie-arbeit-umrechner', 'drehmoment-umrechner', 'stromkostenrechner'],
  },
  {
    id: "daten-speicher-umrechner",
    slug: "daten-speicher-umrechner",
    name: "Datenspeicher Umrechner (Byte, KB, MB, GB, TB & Kibibyte)",
    shortName: "Datenspeicher Umrechner",
    category: "einheiten",
    subcategory: "Informatik & Digital",
    metaTitle: 'Datenspeicher Umrechner – Byte, KB, MB, GB, TB, PB & KiB, GiB',
    metaDescription: 'Rechnen Sie Speicherkapazitäten um: Dezimal (1.000er Basis: KB, MB, GB, TB) und Binär (1.024er Basis: KiB, MiB, GiB, TiB) inklusive Bit-Umrechnung.',
    h1: 'Datenspeicher Umrechner – Byte, MB, GB & TB präzise umrechnen',
    shortDescription: 'Konvertiert Byte in KB, MB, GB, TB nach Dezimal- und Binärstandard.',
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
    content: {
      intro: 'Dieser Speichergrößenrechner unterscheidet strikt zwischen binären Präfixen (Kibi-, Mebi-, Gibibyte auf Basis 1024) und dezimalen SI-Präfixen (Kilo-, Mega-, Gigabyte auf Basis 1000).',
      details: 'Festplattenhersteller verkaufen nach Dezimalsystem: 1 TB = 1.000.000.000.000 Byte. Betriebssysteme (Windows) rechnen jedoch binär (1 TiB = 1.024⁴ Byte ≈ 1,0995 · 10¹² Byte). Daher zeigt Windows bei einer 1-TB-Festplatte nur ca. 931 GB an.',
    },
    faqs: [
      { question: 'Was ist der Unterschied zwischen Bit und Byte?', answer: 'Ein Bit ist die kleinste binäre Informationseinheit (0 oder 1); ein Byte besteht aus 8 Bit und kann genau ein ASCII-Schriftzeichen codieren.' },
      { question: 'Was bedeutet GiB vs. GB?', answer: 'GB steht für Gigabyte (10⁹ = 1.000.000.000 Byte nach SI-Standard); GiB steht für Gibibyte (2³⁰ = 1.073.741.824 Byte nach IEC-Norm).' },
    ],
    relatedSlugs: ['datenrate-bandbreite-umrechner', 'binaer-hex-dezimal-umrechner', 'zeit-umrechner'],
  },
  {
    id: "datenrate-bandbreite-umrechner",
    slug: "datenrate-bandbreite-umrechner",
    name: "Datenrate- & Downloadzeit-Rechner (Mbit/s in MB/s & Download-Dauer)",
    shortName: "Downloadzeit-Rechner",
    category: "einheiten",
    subcategory: "Informatik & Digital",
    metaTitle: 'Downloadzeit Rechner – Mbit/s in MB/s umrechnen',
    metaDescription: 'Berechnen Sie die echte Downloadzeit für Spiele, Filme und Backups nach Dateigröße (GB) und Internet-Bandbreite (z. B.',
    h1: 'Downloadzeit Rechner – Wie lange dauert mein Download?',
    shortDescription: 'Berechnet Downloadzeit aus Bandbreite (Mbit/s) und Dateigröße (GB) mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Bandbreitenrechner konvertiert Internet-Übertragungsgeschwindigkeiten zwischen Mbit/s (Megabit pro Sekunde) und realer Downloadgeschwindigkeit in MB/s (Megabyte pro Sekunde).',
      details: 'Da 1 Byte aus 8 Bit besteht, muss die nominelle Leitungsbandbreite durch 8 geteilt werden: Ein Internetanschluss mit 250 Mbit/s lädt Daten maximal mit theoretisch 31,25 Megabyte pro Sekunde (MB/s) herunter.',
    },
    faqs: [
      { question: 'Wie lange dauert der Download eines 50-GB-Spiels bei einer 100-Mbit/s-Leitung?', answer: '100 Mbit/s liefern netto ca. 12,5 MB/s. 50.000 MB geteilt durch 12,5 MB/s = 4.000 Sekunden, also etwa 1 Stunde und 7 Minuten.' },
      { question: 'Warum erreichen Speedtests selten die gebuchte maximale Bandbreite?', answer: 'Durch Netzwerk-Overhead (TCP/IP-Header verbrauchen ca. 5–10 % der Bandbreite), WLAN-Störungen oder Auslastung der Server des Anbieters.' },
    ],
    relatedSlugs: ['daten-speicher-umrechner', 'zeit-umrechner', 'stromkostenrechner'],
  },
  {
    id: "drehmoment-umrechner",
    slug: "drehmoment-umrechner",
    name: "Drehmoment Umrechner (Nm in ft-lb, in-lb & kpm)",
    shortName: "Drehmoment Umrechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: 'Drehmoment Umrechner – Newtonmeter (Nm) in ft-lb, in-lb & kpm',
    metaDescription: 'Rechnen Sie Drehmomente für Drehmomentschlüssel und Kfz um: Newtonmeter (Nm), Foot-Pounds (ft-lb / lbf-ft), Inch-Pounds (in-lb) und Kilopondmeter (kpm).',
    h1: 'Drehmoment Umrechner – Nm, ft-lb & in-lb präzise umrechnen',
    shortDescription: 'Konvertiert Newtonmeter in Foot-Pounds für Werkzeug und Kraftfahrzeuge mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Drehmomentkonverter rechnet Drehmomente zwischen Newtonmetern (Nm), Kilonewtonmetern (kNm) und imperialen Foot-Pounds (ft-lb) um.',
      details: '1 Newtonmeter (Nm) ist das Drehmoment, das eine Kraft von 1 Newton bei einem Hebelarm von 1 Meter erzeugt. 1 Foot-Pound (ft-lb) entspricht ca. 1,3558 Nm; 1 Nm entspricht ca. 0,7376 ft-lb.',
    },
    faqs: [
      { question: 'Mit wie viel Drehmoment zieht man Alufelgen beim Auto an?', answer: 'Bei den meisten PKW liegt das vorgeschriebene Anzugsdrehmoment mit dem Drehmomentschlüssel zwischen 110 und 130 Newtonmetern (Herstellerangaben im Handbuch beachten!).' },
      { question: 'Wie hängt das Drehmoment mit der Motorleistung zusammen?', answer: 'Leistung in kW = (Drehmoment in Nm · Drehzahl in U/min) / 9549. Bei gleicher Drehzahl erzeugt mehr Drehmoment direkt mehr mechanische Leistung.' },
    ],
    relatedSlugs: ['drehzahl-umfangsgeschwindigkeit-rechner', 'leistung-umrechner', 'kraft-umrechner', 'reifen-abrollumfang-rechner'],
  },
  {
    id: "kraft-umrechner",
    slug: "kraft-umrechner",
    name: "Kraft Umrechner (Newton N, Kilonewton kN, Kilopond kp & lbf)",
    shortName: "Kraft Umrechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: 'Kraft Umrechner – Newton, Kilonewton, Kilopond',
    metaDescription: 'Rechnen Sie physikalische Kräfte und Zugkräfte um: Newton (N), Kilonewton (kN), Meganewton (MN), Kilopond (kp), Pound-force (lbf) und Dyn (dyn).',
    h1: 'Kraft Umrechner – Newton, kN, Kilopond & Pound-force',
    shortDescription: 'Konvertiert physikalische Kräfte zwischen Newton, kN und lbf mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser physikalische Kraftrechner transformiert Einheiten zwischen Newton (N), Kilonewton (kN), Dyn und veralteten Einheiten wie Kilopond (kp) und Pound-force (lbf).',
      details: 'Nach dem 2. Newtonschen Axiom (F = m · a) beschleunigt 1 Newton eine Masse von 1 kg um 1 m/s². 1 Kilopond (kp) entspricht der Gewichtskraft von 1 kg auf der Erde: 1 kp = 9,80665 N.',
    },
    faqs: [
      { question: 'Wie viel Newton Gewichtskraft übt eine Tafel Schokolade (100 g) aus?', answer: 'Auf der Erdoberfläche üben 100 Gramm Masse durch die Erdbeschleunigung (g ≈ 9,81 m/s²) eine Schwerkraft von ziemlich genau 1 Newton (ca. 0,981 N) aus.' },
      { question: 'Was hält ein Kletterkarabiner mit der Angabe 24 kN aus?', answer: '24 Kilonewton entsprechen einer Bruchlast von ca. 2.447 kg Gewichtskraft (statisch fast 2,5 Tonnen).' },
    ],
    relatedSlugs: ['druck-umrechner', 'drehmoment-umrechner', 'baugrund-tragfaehigkeit-rechner'],
  },
  {
    id: "kraftstoffverbrauch-umrechner",
    slug: "kraftstoffverbrauch-umrechner",
    name: "Spritverbrauch Umrechner (l/100km in MPG US & UK)",
    shortName: "Verbrauch Umrechner",
    category: "einheiten",
    subcategory: "Fahrzeuge & Mobilität",
    metaTitle: 'Spritverbrauch Umrechner – l/100km in MPG (US & UK) umrechnen',
    metaDescription: 'Rechnen Sie den Kraftstoffverbrauch um zwischen Litern pro 100 Kilometer (l/100km), US Miles per Gallon (MPG), UK Imperial MPG und km pro Liter.',
    h1: 'Spritverbrauch Umrechner – l/100km in MPG umrechnen',
    shortDescription: 'Konvertiert l/100km in US- und UK-Miles-per-Gallon (MPG) mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Verbrauchsrechner transformiert den europäischen Kraftstoffverbrauch in l/100 km in die angloamerikanischen Einheiten MPG (US Miles per Gallon) und UK MPG.',
      details: 'Aufgrund der inversen Relation (l/100 km misst verbrauchten Sprit pro Distanz; MPG misst Reichweite pro Spritmenge) gilt die reziproke Formel: MPG (US) = 235,215 / (l/100 km). Ein Verbrauch von 5 l/100 km entspricht ca. 47,04 US-MPG.',
    },
    faqs: [
      { question: 'Warum sinkt der MPG-Wert, wenn das Auto mehr Sprit verbraucht?', answer: 'Weil MPG angibt, wie viele Meilen man mit einer einzigen Gallone weit fahren kann: Ein sparsameres Fahrzeug fährt weiter und hat daher einen höheren MPG-Wert.' },
      { question: 'Was entspricht ein Verbrauch von 8 Litern auf 100 km in US-MPG?', answer: '235,215 / 8 = 29,40 US-MPG.' },
    ],
    relatedSlugs: ['spritkostenrechner', 'geschwindigkeit-umrechner', 'volumen-umrechner', 'fahrtkostenrechner', 'pendlerpauschale-rechner', 'kraftstoffverbrauch-rechner'],
  },
  {
    id: "roemische-zahlen-umrechner",
    slug: "roemische-zahlen-umrechner",
    name: "Römische Zahlen Umrechner (Dezimal in Römisch & Römisch in Dezimal)",
    shortName: "Römische Zahlen",
    category: "einheiten",
    subcategory: "Zahlensysteme",
    metaTitle: 'Römische Zahlen Umrechner – Arabische Zahlen 1–3999 in Römisch',
    metaDescription: 'Konvertieren Sie arabische Dezimalzahlen (1 bis 3999) in römische Ziffern (I, V, X, L, C, D, M) mit Subtraktionsregel und detaillierter Zusammensetzung.',
    h1: 'Römische Zahlen Umrechner – Arabisch in Römisch sofort umrechnen',
    shortDescription: 'Wandelt Dezimalzahlen in römische Ziffern um mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Zahlenwandler übersetzt arabische Dezimalzahlen (1 bis 3999) in korrekte römische Ziffern (I, V, X, L, C, D, M) und decodiert historische Inschriften.',
      details: 'Die Werte der Grundzeichen lauten: I=1, V=5, X=10, L=50, C=100, D=500, M=1.000. Nach der Subtraktionsregel darf ein kleineres Zeichen vor einem größeren stehen, um 4 (IV), 9 (IX), 40 (XL), 90 (XC), 400 (CD) oder 900 (CM) darzustellen.',
    },
    faqs: [
      { question: 'Wie schreibt man das Jahr 2026 in römischen Zahlen?', answer: 'MMXXVI (M=1000 + M=1000 + X=10 + X=10 + V=5 + I=1 = 2026).' },
      { question: 'Gibt es im römischen Zahlensystem eine Ziffer für die Null?', answer: 'Nein, die antiken Römer kannten kein Zeichen für die Null; das Konzept der Null als Ziffer wurde erst im Mittelalter über das indisch-arabische Zahlensystem in Europa eingeführt.' },
    ],
    relatedSlugs: ['binaer-hex-dezimal-umrechner', 'zeit-umrechner', 'daten-speicher-umrechner', 'hexadezimal-rechner'],
  },
  {
    id: "binaer-hex-dezimal-umrechner",
    slug: "binaer-hex-dezimal-umrechner",
    name: "Binär & Hexadezimal Umrechner (Dezimal, Dual & Hex-Code)",
    shortName: "Binär & Hex Umrechner",
    category: "einheiten",
    subcategory: "Zahlensysteme",
    metaTitle: 'Binär & Hexadezimal Umrechner – Dezimal, Binär (Dual) & Hex',
    metaDescription: 'Rechnen Sie Zahlen um zwischen Dezimalsystem (Basis 10), Binärsystem / Dualsystem (Basis 2), Hexadezimalsystem (Basis 16) und Oktalsystem (Basis 8).',
    h1: 'Binär & Hexadezimal Umrechner – Zahlensysteme umrechnen',
    shortDescription: 'Konvertiert Zahlen zwischen Dezimal, Binär, Hexadezimal und Oktal mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Zahlensystem-Konverter transformiert Zahlenwerte synchron zwischen dem Dezimalsystem (Basis 10), Binärsystem (Basis 2), Oktalsystem (Basis 8) und Hexadezimalsystem (Basis 16).',
      details: 'In der Computertechnik entspricht eine Binärstelle einem Bit. Vier Bits (ein Nibble) lassen sich exakt durch eine einzige Hexadezimalziffer (0–9, A–F) darstellen: Die Binärzahl 1111 1111 entspricht im Hexadezimalsystem FF und dezimal 255.',
    },
    faqs: [
      { question: 'Wie rechnet man die Binärzahl 10110 in eine Dezimalzahl um?', answer: 'Von rechts nach links: (0×1) + (1×2) + (1×4) + (0×8) + (1×16) = 0 + 2 + 4 + 0 + 16 = 22.' },
      { question: 'Wofür wird das Oktalsystem (Basis 8) noch heute genutzt?', answer: 'Vor allem in Linux- und Unix-Dateisystemen zur Vergabe von Zugriffsrechten (z. B. chmod 755 oder 644).' },
    ],
    relatedSlugs: ['hexadezimal-rechner', 'daten-speicher-umrechner', 'roemische-zahlen-umrechner', 'datenrate-bandbreite-umrechner'],
  },
  {
    id: "zoll-in-cm-rechner",
    slug: "zoll-in-cm-rechner",
    name: "Zoll-in-cm-Rechner (Inch & Diagonale für TV & Smartphones)",
    shortName: "Zoll-in-cm-Rechner",
    category: "einheiten",
    subcategory: "Geometrische Maße",
    metaTitle: 'Zoll in cm Rechner – Inch in Zentimeter',
    metaDescription: 'Rechnen Sie Zoll (Inch) in Zentimeter und Millimeter um. Inklusive Bildschirm-Rechner für TVs und Handys: Breite und Höhe im 16:9 Format.',
    h1: 'Zoll in cm Rechner – Inch in cm & Bildschirmmaße berechnen',
    shortDescription: 'Konvertiert Zoll (Inch) in cm und ermittelt Maße von 16:9 Displays.',
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
    content: {
      intro: 'Dieser Längenrechner wandelt Zollmaße (Inch) in Zentimeter um und berechnet die Abmessungen von Bildschirmen, TV-Geräten, Felgen und Werkzeugen.',
      details: '1 Zoll = exakt 2,54 Zentimeter. Die Bildschirmdiagonale eines 65-Zoll-Fernsehers beträgt exakt 65 · 2,54 = 165,1 cm. Bei einem Seitenverhältnis von 16:9 ist das Display ca. 144 cm breit und 81 cm hoch.',
    },
    faqs: [
      { question: 'Wie viel cm sind ein 15-Zoll-Laptop-Display?', answer: '15 Zoll entsprechen einer Bildschirmdiagonale von 15 × 2,54 = 38,1 cm; ein 13,3-Zoll-Display misst 33,78 cm Diagonale.' },
      { question: 'Wie rechnet man Zentimeter im Kopf schnell in Zoll um?', answer: 'Teilen Sie die Zentimeter durch 2,5 (oder verdoppeln Sie und teilen durch 5): 10 cm / 2,5 = ca. 4 Zoll (exakt 3,94 Zoll).' },
    ],
    relatedSlugs: ['schuhe-kleidergroessen-umrechner', 'laengen-umrechner', 'rechteckrechner', 'daten-speicher-umrechner'],
  },
  {
    id: "zeit-umrechner",
    slug: "zeit-umrechner",
    name: "Zeit Umrechner (Sekunden, Minuten, Stunden, Tage & Wochen)",
    shortName: "Zeit Umrechner",
    category: "einheiten",
    subcategory: "Alltag & Kalender",
    metaTitle: 'Zeit Umrechner – Sekunden, Minuten, Stunden, Tage & Wochen',
    metaDescription: 'Rechnen Sie Zeiteinheiten präzise um: Sekunden, Minuten, Stunden, Tage, Wochen und Jahre inklusive Dezimalstunden in Stunden und Minuten.',
    h1: 'Zeit Umrechner – Sekunden, Stunden, Tage & Wochen umrechnen',
    shortDescription: 'Konvertiert Zeiteinheiten und Dezimalstunden mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Zeiteinheiten-Konverter rechnet Zeitspannen deterministisch zwischen Nanosekunden, Millisekunden, Sekunden, Minuten, Stunden, Tagen und Kalenderjahren um.',
      details: '1 Tag = 24 Stunden = 1.440 Minuten = 86.400 Sekunden = 86.400.000 Millisekunden. Ein durchschnittliches julianisches Jahr umfasst exakt 31.557.600 Sekunden.',
    },
    faqs: [
      { question: 'Wie viele Sekunden vergehen in einer Arbeitswoche mit 40 Stunden?', answer: '40 Stunden × 3.600 Sekunden/Stunde = exakt 144.000 Sekunden reine Arbeitszeit.' },
      { question: 'Wie schnell vergeht eine Nanosekunde im Computer?', answer: 'Eine Nanosekunde ist ein Milliardstel einer Sekunde (10⁻⁹ s); das Licht legt in einer Nanosekunde im Vakuum eine Strecke von ca. 30 cm zurück.' },
    ],
    relatedSlugs: ['radioaktivitaet-strahlendosis-rechner', 'arbeitszeitrechner', 'urlaubstage-rechner', 'datenrate-bandbreite-umrechner'],
  },
  {
    id: "dichte-umrechner",
    slug: "dichte-umrechner",
    name: "Dichte Umrechner (g/cm³, kg/m³, kg/l & lb/cu ft)",
    shortName: "Dichte Umrechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: 'Dichte Umrechner – g/cm³ in kg/m³, kg/l & lb/cu ft umrechnen',
    metaDescription: 'Rechnen Sie physikalische Dichten um zwischen Gramm pro Kubikzentimeter (g/cm³), Kilogramm pro Kubikmeter (kg/m³), kg pro Liter und Pounds per cubic foot.',
    h1: 'Dichte Umrechner – g/cm³, kg/m³ & kg/l präzise umrechnen',
    shortDescription: 'Konvertiert Dichteeinheiten zwischen metrischen und angloamerikanischen Werten mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Dichterechner konvertiert Stoffdichten zwischen kg/m³, g/cm³, g/ml, kg/l sowie imperialen pounds per cubic foot (lb/ft³).',
      details: '1 g/cm³ = 1.000 kg/m³ = 1 kg/Liter. Reines flüssiges Wasser besitzt bei 4 °C (Dichteanomalie) seine höchste Dichte von exakt 1.000 kg/m³ (1 g/cm³). Metalle wie Gold erreichen 19,3 g/cm³, Blei 11,3 g/cm³.',
    },
    faqs: [
      { question: 'Warum schwimmt Eis auf flüssigem Wasser?', answer: 'Wegen der Dichteanomalie: Die hexagonale Kristallstruktur von Eis benötigt mehr Raum; Eis hat mit ca. 0,917 g/cm³ eine geringere Dichte als flüssiges Wasser und treibt daher oben.' },
      { question: 'Wie viel wiegt ein 10-Liter-Eimer voll Sand im Vergleich zu Wasser?', answer: 'Wasser wiegt genau 10 kg; trockener Sand hat eine Dichte von ca. 1,6 g/cm³, der Eimer wiegt somit ca. 16 Kilogramm.' },
    ],
    relatedSlugs: ['viskositaet-umrechner', 'gewicht-masse-umrechner', 'volumen-umrechner', 'kies-splitt-rechner'],
  },
  {
    id: "drehzahl-umfangsgeschwindigkeit-rechner",
    slug: "drehzahl-umfangsgeschwindigkeit-rechner",
    name: "Drehzahl- & Schnittgeschwindigkeits-Rechner (U/min, RPM in m/s & m/min)",
    shortName: "Drehzahl & Schnitt",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: 'Drehzahl Rechner – RPM, Umfangs- – RechenHafen',
    metaDescription: 'Berechnen Sie die Schnittgeschwindigkeit und Umfangsgeschwindigkeit v in m/min und m/s aus Werkzeugdurchmesser d (mm) und Drehzahl n (U/min / RPM) für.',
    h1: 'Drehzahl Rechner – Schnittgeschwindigkeit & RPM berechnen',
    shortDescription: 'Ermittelt Schnittgeschwindigkeit und Umfangsgeschwindigkeit aus Drehzahl mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Rechner verknüpft Rotationsdrehzahl in U/min mit dem Außendurchmesser zur Berechnung der Umfangs- und Schnittgeschwindigkeit in m/s für Sägeblätter, Bohrer und Fräser.',
      details: 'Umfangsgeschwindigkeit v = (pi · d · n) / 60. Ein Trennschleifer (Flex) mit 230-mm-Scheibe bei 6.600 U/min erreicht eine Umfangsgeschwindigkeit von ca. 80 m/s (knapp 290 km/h) an den Schleifkörnern.',
    },
    faqs: [
      { question: 'Warum ist die maximale Schnittgeschwindigkeit bei Werkzeugen strikt begrenzt?', answer: 'Überschreitet die Fliehkraft die Festigkeit der Scheibe, kann sie explosionsartig bersten; die Berufsgenossenschaft begrenzt Trennscheiben typisch auf max. 80 m/s.' },
      { question: 'Wie berechnet man die optimale Drehzahl für einen Bohrer in Metall?', answer: 'Drehzahl n = (Schnittgeschwindigkeit v_c in m/min · 1.000) / (pi · Bohrerdurchmesser d in mm).' },
    ],
    relatedSlugs: ['geschwindigkeit-umrechner', 'drehmoment-umrechner', 'leistung-umrechner'],
  },
  {
    id: "beleuchtungsstaerke-lux-lumen-rechner",
    slug: "beleuchtungsstaerke-lux-lumen-rechner",
    name: "Lux- & Lumen-Rechner (Beleuchtungsstärke für Wohn- & Arbeitsräume)",
    shortName: "Lux- & Lumen-Rechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: 'Lux & Lumen Rechner – Beleuchtungsstärke',
    metaDescription: 'Berechnen Sie den benötigten Lichtstrom in Lumen nach Raumfläche in m² und Beleuchtungsstärke nach DIN EN 12464 (Küche 300 lx, Büro 500 lx',
    h1: 'Lux & Lumen Rechner – Wie viele Lumen brauche ich pro Raum?',
    shortDescription: 'Berechnet den Lumen-Bedarf nach Raumfläche und DIN EN 12464 mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser lichttechnische Rechner transformiert den Lichtstrom einer Lampe in Lumen (lm) in die resultierende Beleuchtungsstärke in Lux (lx) auf einer Zielfläche.',
      details: '1 Lux = 1 Lumen pro Quadratmeter (lx = lm / m²). Nach der Arbeitsstättenverordnung (ASR A3.4) sind für normale Büroarbeitsplätze mindestens 500 Lux, für feine technische Zeichnungen mindestens 750 bis 1.000 Lux vorgeschrieben.',
    },
    faqs: [
      { question: 'Wie viel Lux liefert das natürliche Sonnenlicht im Freien?', answer: 'An einem sonnigen Sommertag erreicht die Beleuchtungsstärke bis zu 100.000 Lux; an einem trüben Wintertag ca. 3.000 bis 5.000 Lux; Vollmondlicht liefert nur ca. 0,25 Lux.' },
      { question: 'Wie viele LED-Lumen benötigt man für ein 20 m² großes Wohnzimmer?', answer: 'Für stimmungsvolle Wohnraumbeleuchtung (ca. 150 Lux) werden 150 lx × 20 m² = ca. 3.000 Lumen Gesamtlichtstrom aus verschiedenen Lampen benötigt.' },
    ],
    relatedSlugs: ['leistung-umrechner', 'energie-arbeit-umrechner', 'stromkostenrechner'],
  },
  {
    id: "elektrische-ladung-kapazitaet-rechner",
    slug: "elektrische-ladung-kapazitaet-rechner",
    name: "Akku-Kapazitäts- & Ladungs-Rechner (mAh, Ah in Wh & Coulomb)",
    shortName: "Akku Kapazität-Rechner",
    category: "einheiten",
    subcategory: "Informatik & Digital",
    metaTitle: 'Akku Kapazität Rechner – mAh in Wh, Wattstunden',
    metaDescription: 'Rechnen Sie die Akkukapazität um zwischen Milliamperestunden (mAh), Amperestunden (Ah), Wattstunden (Wh) nach Akkuspannung (3,7V Li-Ion, 12V Blei',
    h1: 'Akku Kapazität Rechner – mAh in Wh & Wattstunden ermitteln',
    shortDescription: 'Konvertiert mAh und Ah in Wattstunden (Wh) nach Zellenspannung mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Elektro-Rechner transformiert Kapazitäten und elektrische Ladungsmengen zwischen Farad (F), Milliamperestunden (mAh), Amperestunden (Ah) und Coulomb (C).',
      details: '1 Coulomb = 1 Amperesekunde (A·s). 1 Amperestunde (Ah) = 3.600 Coulomb. Ein Smartphone-Akku mit 5.000 mAh speichert bei einer Nennspannung von 3,7 Volt eine Energie von 18,5 Wattstunden (Wh).',
    },
    faqs: [
      { question: 'Wie rechnet man mAh in Wattstunden (Wh) für Powerbanks im Flugzeug um?', answer: 'Wattstunden = (Kapazität in mAh · Zellspannung in Volt) / 1.000. Die IATA-Grenze für Handgepäck liegt meist bei 100 Wh (ca. 27.000 mAh bei 3,7 V).' },
      { question: 'Was ist die Einheit Farad bei Kondensatoren?', answer: 'Ein Kondensator hat eine Kapazität von 1 Farad, wenn das Laden mit einer Ladung von 1 Coulomb eine Spannung von 1 Volt erzeugt (C = Q / U).' },
    ],
    relatedSlugs: ['energie-arbeit-umrechner', 'leistung-umrechner', 'stromkostenrechner'],
  },
  {
    id: "radioaktivitaet-strahlendosis-rechner",
    slug: "radioaktivitaet-strahlendosis-rechner",
    name: "Radioaktivitäts- & Strahlendosis-Rechner (Bq, Ci, Sievert & Gray)",
    shortName: "Strahlendosis-Rechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: 'Strahlendosis Rechner – Sievert, Becquerel, Gray',
    metaDescription: 'Rechnen Sie ionisierende Strahlung um: Aktivität (Becquerel Bq, Curie Ci), Energiedosis (Gray Gy, Rad) und Äquivalentdosis (Sievert Sv',
    h1: 'Strahlendosis Rechner – Becquerel, Sievert & Gray umrechnen',
    shortDescription: 'Konvertiert Aktivität (Bq/Ci) und Äquivalentdosis (Sv/mSv/rem) mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Strahlenschutzrechner konvertiert Aktivität in Becquerel (Bq) und biologische Strahlendosen zwischen Sievert (Sv), Millisievert (mSv) und Gray (Gy).',
      details: '1 Becquerel entspricht einem Atomzerfall pro Sekunde. Das Sievert bewertet die biologische Schädigungswirkung auf menschliches Gewebe: Die durchschnittliche natürliche Strahlenbelastung in Deutschland beträgt ca. 2,1 mSv pro Person und Jahr.',
    },
    faqs: [
      { question: 'Wie viel Strahlung verursacht ein Langstreckenflug nach New York?', answer: 'Durch die Höhenstrahlung in 10 bis 12 km Höhe beträgt die Dosis eines Hin- und Rückflugs Frankfurt–New York ca. 0,05 bis 0,10 Millisievert (entspricht etwa einer Röntgenaufnahme der Lunge).' },
      { question: 'Welcher gesetzliche Dosisgrenzwert gilt für beruflich strahlenexponierte Personen?', answer: 'Nach der Strahlenschutzverordnung (StrlSchV) maximal 20 Millisievert pro Kalenderjahr.' },
    ],
    relatedSlugs: ['energie-arbeit-umrechner', 'zeit-umrechner', 'gewicht-masse-umrechner'],
  },
  {
    id: "viskositaet-umrechner",
    slug: "viskositaet-umrechner",
    name: "Viskosität Umrechner (Dynamische mPa·s / cP & Kinematische cSt)",
    shortName: "Viskosität Umrechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: 'Viskosität Umrechner – mPa·s in Centipoise (cP) & Stokes (cSt)',
    metaDescription: 'Rechnen Sie Viskositäten von Flüssigkeiten, Ölen und Farben um: Dynamische Viskosität (Pa·s, mPa·s, Centipoise cP) und kinematische Viskosität (mm²/s',
    h1: 'Viskosität Umrechner – mPa·s, Centipoise & Centistokes',
    shortDescription: 'Konvertiert dynamische (mPa·s, cP) und kinematische Viskosität (cSt) mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Strömungsrechner transformiert die dynamische Viskosität (Pascal-Sekunden Pa·s, Centipoise cP) und kinematische Viskosität (m²/s, Centistokes cSt) von Fluiden und Schmierölen.',
      details: 'Kinematische Viskosität nu = Dynamische Viskosität eta / Dichte rho. Wasser bei 20 °C besitzt eine dynamische Viskosität von ca. 1,0 mPa·s (1 cP); Motoröl 10W-40 liegt bei ca. 100 bis 200 mPa·s.',
    },
    faqs: [
      { question: 'Wie ändert sich die Viskosität von Flüssigkeiten bei Erwärmung?', answer: 'Bei fast allen Flüssigkeiten sinkt die Viskosität bei Erwärmung drastisch (sie werden dünnflüssiger); bei Gasen steigt die Viskosität hingegen bei höherer Temperatur leicht an.' },
      { question: 'Was bedeuten die Zahlen bei Motoröl wie 5W-30?', answer: 'Die Zahl vor dem W (Winter) gibt das Kaltfließverhalten bei Minustemperaturen an; die hintere Zahl die Hochtemperatur-Viskosität bei 100 °C Betriebstemperatur nach SAE J300.' },
    ],
    relatedSlugs: ['dichte-umrechner', 'druck-umrechner', 'temperatur-umrechner'],
  },
  {
    id: "schuhe-kleidergroessen-umrechner",
    slug: "schuhe-kleidergroessen-umrechner",
    name: "Schuhgrößen Umrechner (EU, US, UK & Fußlänge in cm)",
    shortName: "Schuhgrößen Umrechner",
    category: "einheiten",
    subcategory: "Alltag & Kleidung",
    metaTitle: 'Schuhgrößen Umrechner – EU in US, UK',
    metaDescription: 'Rechnen Sie Schuhgrößen für Damen, Herren und Kinder um: Deutsche/EU-Größe (35 bis 48), US Men, US Women, UK-Größe und Fußlänge in cm (Mondopoint).',
    h1: 'Schuhgrößen Umrechner – EU, US, UK & cm sofort ermitteln',
    shortDescription: 'Konvertiert Schuhgrößen zwischen EU, US, UK und Fußlänge in cm.',
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
    content: {
      intro: 'Dieser Größenumrechner gleicht internationale Konfektions- und Schuhgrößen zwischen EU (Paris-Stich), US, UK und Fußlänge in Zentimetern (Mondopoint) ab.',
      details: 'Die europäische Schuhgröße basiert auf dem Pariser Stich (1 Stich = 2/3 cm ≈ 6,67 mm): EU-Größe = (Fußlänge in cm + 1,5 cm Abrollzugabe) · 1,5. Eine Fußlänge von 27 cm entspricht EU-Größe 42.',
    },
    faqs: [
      { question: 'Warum fallen Schuhgrößen verschiedener Hersteller so unterschiedlich aus?', answer: 'Weil Hersteller unterschiedliche Leistenformen verwenden und US/UK-Größen oft mit gerundeten Umrechnungsfaktoren in EU-Größen übersetzen.' },
      { question: 'Was ist das Mondopoint-System?', answer: 'Das internationale ISO-9407-Normsystem für Schuhe (z. B. bei Skischuhen und Bundeswehr): Es gibt schlicht die reale Fußlänge und Fußbreite direkt in Millimetern an.' },
    ],
    relatedSlugs: ['laengen-umrechner', 'zoll-in-cm-rechner', 'gewicht-masse-umrechner'],
  },
  {
    id: "papierformat-din-rechner",
    slug: "papierformat-din-rechner",
    name: "Papierformat-DIN-Rechner (DIN A0 bis A8 Maße & Blattgewicht in Gramm)",
    shortName: "Papierformat DIN",
    category: "einheiten",
    subcategory: "Geometrische Maße",
    metaTitle: 'Papierformat Rechner – DIN A0 bis A8 Maße',
    metaDescription: 'Berechnen Sie die exakten Abmessungen in Millimetern und Zentimetern für DIN A4, A3, A5 etc. nach DIN 476 / ISO 216 sowie das Blattgewicht nach.',
    h1: 'Papierformat Rechner – DIN A Maße & Briefgewicht berechnen',
    shortDescription: 'Berechnet DIN A0 bis A8 Abmessungen in mm und Blattgewicht.',
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
    content: {
      intro: 'Die deutsche Norm DIN 476 (international ISO 216) definiert die Standard-Papierformate der Reihe A mit dem konstanten Seitenverhältnis 1 zu Wurzel aus 2 (1 : 1,414).',
      details: 'Das Ausgangsformat DIN A0 hat eine Fläche von exakt 1 Quadratmeter (841 × 1.189 mm). Durch mittiges Falten entsteht die jeweils nächstkleinere Größe mit exakt identischem Seitenverhältnis (DIN A4 = 210 × 297 mm).',
    },
    faqs: [
      { question: 'Wie viel wiegt ein DIN-A4-Blatt Normalpapier (80 g/m²)?', answer: 'Aus 1 m² (DIN A0) entstehen durch viermaliges Halbieren genau 16 DIN-A4-Blätter. Ein Blatt wiegt: 80 g / 16 = exakt 5,0 Gramm.' },
      { question: 'Welches Format passt in einen Standard-Briefumschlag DIN lang?', answer: 'Ein zweimal horizontal gefaltetes DIN-A4-Blatt (105 × 210 mm) passt exakt in einen DIN-lang-Umschlag (110 × 220 mm).' },
    ],
    relatedSlugs: ['gewicht-masse-umrechner', 'flaeche-umrechner', 'laengen-umrechner'],
  },
  {
    id: "ringgroesse-umrechner",
    slug: "ringgroesse-umrechner",
    name: "Ringgröße Umrechner (EU-Umfang in mm, US, UK & Durchmesser)",
    shortName: "Ringgrößen Umrechner",
    category: "einheiten",
    subcategory: "Alltag & Kleidung",
    metaTitle: 'Ringgröße Umrechner – EU-Umfang in US, UK',
    metaDescription: 'Rechnen Sie Ringgrößen um: Deutsche Größe / Innenumfang in Millimetern (z. B. 54 = 54 mm), Innendurchmesser in mm (d = Umfang / π)',
    h1: 'Ringgröße Umrechner – Innenumfang & Durchmesser bestimmen',
    shortDescription: 'Konvertiert Ringgrößen zwischen EU-Umfang, Durchmesser, US und UK mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Schmuckrechner konvertiert Ringmaße zwischen dem deutschen Innenumfang in Millimetern, dem Innendurchmesser sowie US- und UK-Ringgrößen.',
      details: 'Die deutsche Ringgröße entspricht exakt dem inneren Fingerumfang in Millimetern (Ringgröße 54 = 54 mm Innenumfang). Der Innendurchmesser beträgt d = Umfang / pi (bei Größe 54 entspricht das ca. 17,2 mm).',
    },
    faqs: [
      { question: 'Zu welcher Tageszeit sollte man die Ringgröße am besten messen?', answer: 'Am späten Nachmittag oder Abend bei normaler Zimmertemperatur; morgens oder bei Kälte sind die Finger meist etwas dünner, bei Sommerhitze geschwollen.' },
      { question: 'Wie misst man die Ringgröße heimlich für einen Heiratsantrag?', answer: 'Nehmen Sie einen gut sitzenden Ring der Partnerin und messen Sie mit einem präzisen Messschieber den inneren Durchmesser auf den Zehntelmillimeter genau ab.' },
    ],
    relatedSlugs: ['kreis-umfang-rechner', 'laengen-umrechner', 'zoll-in-cm-rechner'],
  },
  {
    id: "dezibel-schalldruck-umrechner",
    slug: "dezibel-schalldruck-umrechner",
    name: "Dezibel- & Schalldruck-Rechner (dB, Lautstärke & Pascal Pa)",
    shortName: "Dezibel-Rechner",
    category: "einheiten",
    subcategory: "Physik & Mechanik",
    metaTitle: 'Dezibel Rechner – dB Schalldruckpegel, Pascal',
    metaDescription: 'Berechnen Sie den Schalldruckpegel L_p in Dezibel dB(A) aus Schalldruck in Pascal (Pa) und ermitteln Sie die physikalische Energie- und.',
    h1: 'Dezibel Rechner – Schallpegel dB, Schalldruck & Lautstärke',
    shortDescription: 'Berechnet Schalldruckpegel in Dezibel und vergleicht Lärmquellen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Das Dezibel (dB) ist eine logarithmische Maßeinheit für den Schalldruckpegel bezogen auf die menschliche Hörschwelle (20 Mikropascal bei 1.000 Hz).',
      details: 'Schalldruckpegel L_p = 20 · log10(p / p0). Eine Pegelerhöhung um +6 dB verdoppelt den physikalischen Schalldruck; eine Erhöhung um +10 dB wird vom menschlichen Gehör subjektiv als Verdopplung der Lautstärke empfunden.',
    },
    faqs: [
      { question: 'Ab welcher Lautstärke drohen dauerhafte Gehörschäden?', answer: 'Dauerlärm ab 85 dB(A) am Arbeitsplatz erfordert gesetzlichen Gehörschutz; ab 120 dB(A) (z. B. Flugzeugstart, Clubbox) liegt die Schmerzschwelle und es können akute Knalltraumata entstehen.' },
      { question: 'Was ergibt die Summe von zwei identischen 60-dB-Schallquellen?', answer: 'Wegen der logarithmischen Addition verdoppelt sich die Schallleistung: 60 dB + 60 dB = exakt 63 dB (nicht 120 dB!).' },
    ],
    relatedSlugs: ['druck-umrechner', 'leistung-umrechner', 'energie-arbeit-umrechner'],
  },
  {
    id: "hefe-umrechner",
    slug: "hefe-umrechner",
    name: "Hefe-Rechner (Frische Hefe in Trockenhefe & Vorteig umrechnen)",
    shortName: "Hefe-Rechner",
    category: "kochen-backen",
    subcategory: "Backzutaten",
    metaTitle: 'Hefe Rechner – Frische Hefe in Trockenhefe umrechnen',
    metaDescription: 'Rechnen Sie frische Hefe in Trockenhefe und umgekehrt um: Faustformel 1 Würfel frische Hefe (42 g) = 2 Beutel Trockenhefe (14 g) für 1 kg Mehl.',
    h1: 'Hefe Rechner – Frische Hefe in Trockenhefe & Mehlmenge',
    shortDescription: 'Konvertiert frische Hefe in Trockenhefe und berechnet die Hefe nach Mehlmenge.',
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
    content: {
      intro: 'Dieser Hefe-Konverter rechnet zwischen frischer Hefe (Hefewürfel), Trockenhefe und langer kalter Teigführung um.',
      details: 'Verhältnis: 1 Würfel Frischhefe (42 Gramm) entspricht exakt 2 Päckchen Trockenhefe (je 7 Gramm). 1 Päckchen Trockenhefe reicht für 500 g Weizenmehl.',
    },
    faqs: [
      { question: 'Kann man Hefe durch längere Gehzeit drastisch reduzieren?', answer: 'Ja, bei langer kalter Teigführung über Nacht im Kühlschrank (18 bis 24 Stunden) reichen oft 1 bis 2 Gramm Frischhefe auf 500 g Mehl für bekömmliche, aromatische Teige.' },
      { question: 'Wie testet man, ob alte Frischhefe noch Triebkraft besitzt?', answer: 'Lösen Sie die Hefe in etwas lauwarmem Wasser mit einer Prise Zucker auf: Bilden sich nach 10 Minuten deutliche Schaumbläschen, ist die Hefe vital und backfähig.' },
    ],
    relatedSlugs: ['pizza-teig-rechner', 'brot-backen-baeckermass-rechner', 'sauerteig-anstellgut-rechner'],
  },
  {
    id: "essloeffel-teeloeffel-gramm-rechner",
    slug: "essloeffel-teeloeffel-gramm-rechner",
    name: "Esslöffel- & Teelöffel-in-Gramm-Rechner (EL, TL in g)",
    shortName: "EL & TL in Gramm",
    category: "kochen-backen",
    subcategory: "Küchenmaße",
    metaTitle: 'Esslöffel & Teelöffel in Gramm Rechner – EL',
    metaDescription: 'Rechnen Sie Esslöffel (EL) und Teelöffel (TL) in Gramm um für Mehl, Zucker, Salz, Olivenöl, Butter, Backpulver, Honig und Kakaopulver.',
    h1: 'Esslöffel & Teelöffel in Gramm Rechner – Zutaten ohne Waage wiegen',
    shortDescription: 'Wandelt Esslöffel und Teelöffel in Gramm für beliebige Backzutaten um.',
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
    content: {
      intro: 'Dieser Löffelrechner transformiert gestrichene und gehäufte Esslöffel (EL) und Teelöffel (TL) in exakte Gramm-Gewichte für Salz, Zucker, Mehl, Öl und Backpulver.',
      details: 'Volumina nach DIN: 1 gestrichener TL fasst ca. 5 ml; 1 gestrichener EL fasst ca. 15 ml. 1 gestrichener TL Salz wiegt ca. 5 g, Zucker ca. 4 g, Mehl ca. 3 g. 1 EL Öl wiegt ca. 12 g, Honig ca. 20 g.',
    },
    faqs: [
      { question: 'Wie viel wiegt ein gehäufter Esslöffel Mehl?', answer: 'Ein gehäufter EL Mehl bringt etwa 12 bis 15 Gramm auf die Waage (etwa das Doppelte eines glatt gestrichenen Löffels).' },
      { question: 'Wie viel Gramm Backpulver enthält ein normales Tütchen?', answer: 'Ein handelsüblicher Beutel Backpulver in Deutschland wiegt exakt 15 bis 16 Gramm und reicht für 500 g Mehl.' },
    ],
    relatedSlugs: ['cups-in-gramm-rechner', 'gramm-in-ml-rechner', 'portionsrechner'],
  },
  {
    id: "cups-in-gramm-rechner",
    slug: "cups-in-gramm-rechner",
    name: "US-Cups-in-Gramm-Rechner (Amerikanische Cup-Maße in Gramm)",
    shortName: "Cups in Gramm",
    category: "kochen-backen",
    subcategory: "Küchenmaße",
    metaTitle: 'Cups in Gramm Rechner – US Cups in g für Mehl, Zucker & Butter',
    metaDescription: 'Rechnen Sie amerikanische Rezepte um: US Cups in Gramm für Mehl (125g), Kristallzucker (200g), braunen Zucker (220g), Butter (227g)',
    h1: 'Cups in Gramm Rechner – Amerikanische Cups in Gramm wiegen',
    shortDescription: 'Wandelt US Cups in Gramm nach Zutat für US-Backrezepte um.',
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
    content: {
      intro: 'Dieser US-Backrechner übersetzt amerikanische Cup-Volumenmaße in Gramm für Mehl, braunen Zucker, Butter und Haferflocken.',
      details: '1 US Legal Cup = 240 ml (Customary Cup = 236,6 ml). 1 Cup Mehl (All-Purpose Flour) wiegt ca. 125 g; 1 Cup Kristallzucker wiegt 200 g; 1 Cup Butter wiegt 227 g (exakt 2 Sticks à 1/2 Cup).',
    },
    faqs: [
      { question: 'Warum scheitern US-Rezepte oft, wenn man Cups mit dem Messbecher abmisst?', answer: 'Weil Mehl im Cup "gescoopt" (geschaufelt) bis zu 150 g wiegen kann, gelöffelt und abgestrichen aber nur 120 g (Abweichung bis zu 25 % Trockenmasse).' },
      { question: 'Was wiegt 1 Stick Butter in US-Rezepten?', answer: '1 Stick Butter entspricht exakt 1/2 Cup bzw. 8 US-Esslöffeln und wiegt genau 113,4 Gramm.' },
    ],
    relatedSlugs: ['eiweiss-eigelb-ersatz-rechner', 'essloeffel-teeloeffel-gramm-rechner', 'gramm-in-ml-rechner', 'portionsrechner'],
  },
  {
    id: "zucker-ersatz-rechner",
    slug: "zucker-ersatz-rechner",
    name: "Zuckerersatz-Rechner (Erythrit, Xylit, Stevia & Honig)",
    shortName: "Zuckerersatz-Rechner",
    category: "kochen-backen",
    subcategory: "Ernährung & Diät",
    metaTitle: 'Zuckerersatz Rechner – Zucker in Erythrit, Xylit',
    metaDescription: 'Rechnen Sie Haushaltszucker um in Erythrit (70 % Süßkraft), Birkenzucker/Xylit (100 %), Honig, Stevia und Agavendicksaft inklusive Kalorieneinsparung.',
    h1: 'Zuckerersatz Rechner – Süßkraft & Kalorieneinsparung berechnen',
    shortDescription: 'Ermittelt die Menge von Erythrit, Xylit, Honig und Stevia als Zuckerersatz.',
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
    content: {
      intro: 'Dieser Süßungsrechner konvertiert Haushaltszucker (Saccharose) in kalorienarme Alternativen wie Erythrit, Xylit (Birkenzucker), Stevia, Agavendicksaft und Honig.',
      details: 'Süßkraftfaktoren bezogen auf Haushaltszucker (100 %): Xylit 100 % (1:1 Austausch), Erythrit ca. 70 % (benötigt ca. 130 bis 140 g Erythrit für 100 g Zucker), Honig ca. 120 % Süßkraft (80 g Honig ersetzen 100 g Zucker, Flüssigkeit im Teig leicht reduzieren).',
    },
    faqs: [
      { question: 'Welche Nebenwirkungen können Erythrit und Xylit haben?', answer: 'Zuckeralkohole können bei übermäßigem Verzehr abführend wirken; Xylit ist zudem für Hunde und Katzen hochgradig lebensgefährlich giftig.' },
      { question: 'Karadellisiert Erythrit beim Backen wie normaler Zucker?', answer: 'Nein, Erythrit karamellisiert nicht und neigt beim Abkühlen zum Auskristallisieren ("kühler Schmelzeffekt" auf der Zunge).' },
    ],
    relatedSlugs: ['eiweiss-eigelb-ersatz-rechner', 'kalorien-rezept-rechner', 'cups-in-gramm-rechner', 'portionsrechner'],
  },
  {
    id: "backzeit-temperatur-umluft-oberhitze-rechner",
    slug: "backzeit-temperatur-umluft-oberhitze-rechner",
    name: "Backofen Umrechner (Umluft in Ober-/Unterhitze & Gasstufe)",
    shortName: "Backofen Umrechner",
    category: "kochen-backen",
    subcategory: "Backzutaten",
    metaTitle: 'Backofen Umrechner – Umluft in Ober-/Unterhitze',
    metaDescription: 'Rechnen Sie Backofentemperaturen um: Umluft / Heißluft zu Ober-/Unterhitze (Faustregel: 20°C Unterschied) inklusive Backzeitanpassung und.',
    h1: 'Backofen Umrechner – Umluft & Ober-/Unterhitze anpassen',
    shortDescription: 'Wandelt Backtemperatur und Backzeit zwischen Umluft und Ober-/Unterhitze um mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Ofenrechner rechnet Backtemperaturen und Backzeiten zwischen Umluft (Heißluft) und Ober-/Unterhitze verlässlich um.',
      details: 'Faustregel: Umluft = Ober-/Unterhitze minus 20 °C (z. B. 200 °C Ober-/Unterhitze entsprechen 180 °C Umluft). Durch den beschleunigten Wärmetransport per Gebläse verkürzt sich die Backzeit oft zusätzlich um 10 bis 15 Prozent.',
    },
    faqs: [
      { question: 'Wann sollte man Ober-/Unterhitze statt Umluft wählen?', answer: 'Für empfindliche Teige (Biskuit, Soufflés, Brot), da das Umluftgebläse die Teigoberfläche vorzeitig austrocknet und das Aufgehen behindern kann.' },
      { question: 'Kann man bei Umluft mehrere Bleche gleichzeitig backen?', answer: 'Ja, das ist der Hauptvorteil von Umluft: Da die heiße Luft zirkuliert, können 2 bis 3 Bleche auf verschiedenen Einschubebenen gleichmäßig gebacken werden.' },
    ],
    relatedSlugs: ['schokolade-temperieren-rechner', 'frittieroel-temperatur-rauchpunkt-rechner', 'temperatur-umrechner', 'backform-umrechner', 'pizza-teig-rechner'],
  },
  {
    id: "fleisch-kerntemperatur-garzeit-rechner",
    slug: "fleisch-kerntemperatur-garzeit-rechner",
    name: "Fleisch-Kerntemperatur- & Garzeit-Rechner (Rind, Schwein & Geflügel)",
    shortName: "Kerntemperatur-Rechner",
    category: "kochen-backen",
    subcategory: "Fleisch & Fisch",
    metaTitle: 'Kerntemperatur Rechner – Rind, Schwein, Hähnchen, Lamm',
    metaDescription: 'Finden Sie die perfekte Kerntemperatur und Garzeit für Rindersteak, Roastbeef, Schweinebraten, Pulled Pork, Hähnchen und Lammkeule nach Garstufen.',
    h1: 'Kerntemperatur Rechner – Perfekte Garstufe für Braten & Steak',
    shortDescription: 'Ermittelt Ziel-Kerntemperatur und Garzeit nach Fleischart und Garstufe mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Garzeitrechner ermittelt die Ziel-Kerntemperaturen für Rind, Schwein, Geflügel und Lamm mit Einstichthermometer für das perfekte Garergebnis (Rare, Medium, Well Done).',
      details: 'Rindermedaillons Medium: 54–56 °C (Rosa). Schweinefilet: 58–62 °C. Geflügel (Hähnchen, Pute): Aus Hygienegründen (Salmonellen-Abtötung) zwingend durchgaren auf mindestens 72–75 °C Kerntemperatur.',
    },
    faqs: [
      { question: 'Steigt die Kerntemperatur während der Ruhephase nach dem Braten noch an?', answer: 'Ja, durch den Temperaturausgleich zwischen heißer Fleischkruste und dem Kern steigt die Temperatur beim Ruhen in Alufolie noch um 2 bis 4 °C an (vorher aus der Pfanne nehmen!).' },
      { question: 'Wo sticht man das Fleischthermometer korrekt ein?', answer: 'Immer an der dicksten Stelle des Fleischstücks, ohne Knochen oder größere Fettpolster zu berühren, da Knochen Hitze schneller leiten und Messwerte verfälschen.' },
    ],
    relatedSlugs: ['fondue-raclette-mengen-rechner', 'frittieroel-temperatur-rauchpunkt-rechner', 'backzeit-temperatur-umluft-oberhitze-rechner', 'portionsrechner', 'salz-lake-poekel-rechner'],
  },
  {
    id: "pizza-teig-rechner",
    slug: "pizza-teig-rechner",
    name: "Pizzateig-Rechner (Hydratation 60–70 %, Mehl, Wasser & Hefe)",
    shortName: "Pizzateig-Rechner",
    category: "kochen-backen",
    subcategory: "Backzutaten",
    metaTitle: 'Pizza Teig Rechner – Neapolitanische Pizza Teigausbeute',
    metaDescription: 'Berechnen Sie die exakten Zutaten für echten neapolitanischen Pizzateig nach Ballenanzahl, Ballengewicht (z. B.',
    h1: 'Pizza Teig Rechner – Mehl, Wasser, Hefe & Salz für Neapel-Pizza',
    shortDescription: 'Berechnet Pizzateig-Zutaten nach Hydratation und Ballenanzahl mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Teigrechner berechnet die neapolitanische Pizza nach Bäckerprozenten (Hydratation 60–70 %, Mehl Tipo 00, Hefe und Meersalz).',
      details: 'Hydratation = (Wassermenge / Mehlmenge) · 100. Für eine echte Pizza Napoletana werden ca. 60–65 % Wasser, 2,8–3,0 % Salz und minimale Hefemengen (0,1–0,2 % bei 24 Std. Teigruhe) verwendet. Ein Teigling wiegt idealerweise 250 bis 280 Gramm.',
    },
    faqs: [
      { question: 'Warum ist Mehl mit hohem W-Wert (z. B. Caputo Cuoco W > 300) für Pizza wichtig?', answer: 'Der W-Wert misst die Glutenstärke: Nur mehlstarke Weizenmehle können lange Gärzeiten von 24 bis 48 Stunden aushalten, ohne dass das Klebergerüst reißt.' },
      { question: 'Warum gehört in echten neapolitanischen Pizzateig kein Olivenöl?', answer: 'Bei extrem heißen Pizzaöfen (450–500 °C) verbrennt Öl und macht den Teig speckig; Öl wird nur bei Haushaltsöfen (250 °C) für mürbere Krusten empfohlen.' },
    ],
    relatedSlugs: ['hefe-umrechner', 'brot-backen-baeckermass-rechner', 'sauerteig-anstellgut-rechner'],
  },
  {
    id: "brot-backen-baeckermass-rechner",
    slug: "brot-backen-baeckermass-rechner",
    name: "Bäckerprozente-Rechner (Bäckermaß für Brot & Teigausbeute TA)",
    shortName: "Bäckerprozente-Rechner",
    category: "kochen-backen",
    subcategory: "Backzutaten",
    metaTitle: 'Bäckerprozente Rechner – Bäckermaß, Teigausbeute',
    metaDescription: 'Berechnen Sie Brotteige nach professionellen Bäckerprozenten (Mehl = 100 %) und Teigausbeute (TA 160 bis TA 180) für Mehl, Wasser, Hefe',
    h1: 'Bäckerprozente Rechner – Teigausbeute (TA) & Rezeptskalierung',
    shortDescription: 'Berechnet Brotrezepte nach Bäckerprozenten bezogen auf 100 % Mehl mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Die Bäckerprozente (Baker\'s Percentage) setzen alle Rezeptzutaten (Wasser, Salz, Hefe, Sauerteig) ins prozentuale Verhältnis zur Gesamtmehlmenge (Mehl = 100 %).',
      details: 'Beispiel: 1.000 g Mehl (100 %) mit 70 % Hydratation (700 g Wasser), 2 % Salz (20 g Salz) und 20 % Sauerteig (200 g Sauerteig) ergeben 1.920 g Gesamtteigmasse.',
    },
    faqs: [
      { question: 'Was ist der Vorteil von Bäckerprozenten?', answer: 'Rezepte lassen sich blitzschnell auf jedes beliebige Teiggewicht skalieren, und der Bäcker erkennt sofort an den Prozentwerten die Teigausbeute und Teigkonsistenz.' },
      { question: 'Was bedeutet die Teigausbeute (TA)?', answer: 'TA = (Gesamtteiggewicht / Mehlmenge) · 100. Bei 1.000 g Mehl und 650 g Wasser beträgt die TA genau 165 (feste Teige TA 150–160, weiche Teige TA 170–185).' },
    ],
    relatedSlugs: ['pizza-teig-rechner', 'sauerteig-anstellgut-rechner', 'hefe-umrechner'],
  },
  {
    id: "alkohol-verkochungs-rechner",
    slug: "alkohol-verkochungs-rechner",
    name: "Alkohol-Verkochungs-Rechner (Restalkohol in Saucen & Schmorgerichten)",
    shortName: "Alkohol verkochen",
    category: "kochen-backen",
    subcategory: "Kochen & Garen",
    metaTitle: 'Alkohol Verkochen Rechner – Restalkohol nach Kochzeit berec...',
    metaDescription: 'Berechnen Sie, wie viel Alkohol beim Kochen mit Wein oder Bier wirklich verdampft. Wissenschaftliche Werte nach USDA-Studie: Restalkohol nach 15 bis.',
    h1: 'Alkohol Verkochen Rechner – Wie viel Restalkohol bleibt im Essen?',
    shortDescription: 'Berechnet den verbleibenden Restalkoholgehalt in Gerichten nach Kochzeit mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Entgegen der Annahme verkocht Alkohol beim Kochen und Schmoren von Wein- oder Biersaucen nur langsam und bleibt über längere Zeit nachweisbar.',
      details: 'Untersuchungen des US Department of Agriculture (USDA): Nach kurzem Aufkochen (Flambieren) verbleiben ca. 75 % Alkohol; nach 30 Minuten Köcheln noch ca. 35 %; erst nach 2,5 bis 3 Stunden Schmoren sinkt der Restalkohol auf unter 5 Prozent.',
    },
    faqs: [
      { question: 'Dürfen Kinder Gerichte essen, die mit Rotwein abgelöscht wurden?', answer: 'Da auch nach einer Stunde Kochen noch ca. 25 % des Alkohols in der Sauce enthalten sind, sollten Speisen für Kinder, Schwangere oder trockene Alkoholiker alkoholfrei zubereitet werden (z. B. Traubensaft mit Balsamico).' },
      { question: 'Warum verdampft Alkohol im Wasser-Gemisch nicht komplett bei 78 °C?', answer: 'Weil Wasser und Ethanol ein azeotropes Gemisch bilden, dessen Siedepunkt zwischen 78 °C und 100 °C liegt; der Alkohol entweicht nur kontinuierlich gemeinsam mit dem Wasserdampf.' },
    ],
    relatedSlugs: ['cocktail-alkoholgehalt-rechner', 'fleisch-kerntemperatur-garzeit-rechner', 'portionsrechner'],
  },
  {
    id: "eiweiss-eigelb-ersatz-rechner",
    slug: "eiweiss-eigelb-ersatz-rechner",
    name: "Ei-Ersatz-Rechner (Vegane Alternativen für Backen & Kochen)",
    shortName: "Ei-Ersatz-Rechner",
    category: "kochen-backen",
    subcategory: "Ernährung & Diät",
    metaTitle: 'Ei-Ersatz Rechner – Eier vegan ersetzen beim Backen & Kochen',
    metaDescription: 'Berechnen Sie die optimale Menge an Ei-Ersatz für 1 bis 10 Eier: Apfelmark (60 bis 80 g), reife Banane (1/2 Stk.',
    h1: 'Ei-Ersatz Rechner – Vegane Alternativen für Rührkuchen & Waffeln',
    shortDescription: 'Ermittelt Mengenangaben für pflanzliche Ei-Alternativen beim Backen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Rezeptrechner kalkuliert die Aufteilung und den Ersatz von Hühnereiern (Größe M ca. 50 g: 30 g Eiklar, 20 g Eidotter) oder vegane Alternativen (Aquafaba, Leinsamen, Apfelmus).',
      details: '1 ganzes Ei lässt sich beim Backen durch 1 EL geschrotete Leinsamen in 3 EL Wasser (Leinsamen-Ei), 60 g Apfelmus oder eine halbe reife Banane ersetzen. Eischnee lässt sich 1:1 durch aufgeschlagenes Kichererbsenwasser (Aquafaba) ersetzen.',
    },
    faqs: [
      { question: 'Was kann man mit übrig gebliebenem Eiklar machen?', answer: 'Baisers (Meringue), Macarons, Eiweiß-Omelettes zubereiten oder portionsweise in Eiswürfelbehältern einfrieren (aufgetaut normal aufschlagbar).' },
      { question: 'Warum schlägt sich Eischnee nicht steif, wenn Spuren von Eigelb hineingelangen?', answer: 'Das Fett im Eigelb stört die Bildung des stabilen Proteingitters an den Luftbläschen; Schüssel und Rührbesen müssen absolut fettfrei sein.' },
    ],
    relatedSlugs: ['zucker-ersatz-rechner', 'cups-in-gramm-rechner', 'portionsrechner'],
  },
  {
    id: "wasser-reis-verhaeltnis-rechner",
    slug: "wasser-reis-verhaeltnis-rechner",
    name: "Reiskoch-Rechner (Wasser-Reis-Verhältnis & Garzeit nach Reissorte)",
    shortName: "Reiskoch-Rechner",
    category: "kochen-backen",
    subcategory: "Kochen & Garen",
    metaTitle: 'Reis kochen Rechner – Wasser-Reis-Verhältnis nach Quellmeth...',
    metaDescription: 'Berechnen Sie die perfekte Wassermenge und Kochzeit für Basmatireis (1:1,5), Jasminreis (1:1,25), Vollkornreis (1:2) und Milchreis nach der Quellmethode.',
    h1: 'Reis kochen Rechner – Perfektes Wasser-Reis-Verhältnis ermitteln',
    shortDescription: 'Berechnet die genaue Wassermenge und Garzeit für alle Reissorten mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Die Quellmethode gart Reis ohne Nährstoffverlust im geschlossenen Topf mit dem exakt passenden Verhältnis von Reis zu Wasser.',
      details: 'Richtwerte: Weißer Langkornreis (Basmati, Jasmin) = 1 Teil Reis auf 1,5 Teile Wasser. Rundkornreis (Milchreis, Sushi) = 1 : 1,75 bis 2,0. Naturreis (Vollkornreis) = 1 : 2,25 bei ca. 35 bis 45 Minuten Garzeit.',
    },
    faqs: [
      { question: 'Muss man Reis vor dem Kochen waschen?', answer: 'Ja, gründliches Waschen im Sieb spült überschüssige Stärke ab (verhindert klebrigen Matschreis) und reduziert eventuelle anorganische Arsen-Rückstände.' },
      { question: 'Darf man während der Quellmethode den Topfdeckel öffnen?', answer: 'Nein, der heiße Wasserdampf entweicht sofort, wodurch die Temperatur abfällt und das Wasser-Verdampfungsverhältnis gestört wird.' },
    ],
    relatedSlugs: ['portionsrechner', 'nudeln-rohmaerk-gewicht-rechner', 'gramm-in-ml-rechner'],
  },
  {
    id: "nudeln-rohmaerk-gewicht-rechner",
    slug: "nudeln-rohmaerk-gewicht-rechner",
    name: "Nudelportions-Rechner (Trocken- vs. Gekocht-Gewicht & Portionsgröße)",
    shortName: "Nudelportions-Rechner",
    category: "kochen-backen",
    subcategory: "Kochen & Garen",
    metaTitle: 'Nudeln Rechner – Rohgewicht in gekochtes Gewicht',
    metaDescription: 'Berechnen Sie, wie viel Gramm trockene Nudeln gekocht ergeben (Faktor ca. 2,3) und wie viel Gramm Pasta Sie pro Person für Vorspeise oder Hauptgericht.',
    h1: 'Nudeln Rechner – Nudelportionen & Gekochtes Gewicht berechnen',
    shortDescription: 'Ermittelt Nudelgewicht trocken vs. gekocht und Portionsgrößen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Mengenkalkulator berechnet das Trockengewicht von Roh-Nudeln und das fertige Serviergewicht nach dem Kochen im Salzwasser.',
      details: 'Getrocknete Hartweizennudeln nehmen beim Kochen Wasser auf und verdoppeln bis verdreifachen ihr Gewicht (Faktor 2,2 bis 2,5): Aus 100 g trockener Pasta entstehen ca. 220 bis 250 g gekochte Nudeln. Portionsgröße: 80–100 g trocken als Hauptgericht.',
    },
    faqs: [
      { question: 'Wie viel Wasser und Salz benötigt man zum Nudelkochen?', answer: 'Klassische italienische Faustregel: 10-100-1000: 10 Gramm Salz auf 100 Gramm Pasta in 1.000 Milliliter (1 Liter) kochendem Wasser.' },
      { question: 'Wie viel wiegen frische Eierteig-Nudeln nach dem Kochen?', answer: 'Frische Pasta enthält bereits Eigenfeuchte und quillt nur um ca. 50 bis 70 Prozent (Faktor 1,5 bis 1,7); eine Hauptgericht-Portion frische Nudeln beträgt ca. 130 bis 150 Gramm.' },
    ],
    relatedSlugs: ['portionsrechner', 'wasser-reis-verhaeltnis-rechner', 'kalorien-rezept-rechner'],
  },
  {
    id: "sauerteig-anstellgut-rechner",
    slug: "sauerteig-anstellgut-rechner",
    name: "Sauerteig-Rechner (Anstellgut füttern & Sauerteigführung 1:1:1)",
    shortName: "Sauerteig-Rechner",
    category: "kochen-backen",
    subcategory: "Backzutaten",
    metaTitle: 'Sauerteig Rechner – Anstellgut füttern',
    metaDescription: 'Berechnen Sie die exakten Mehl- und Wassermengen zur Sauerteig-Führung nach gewünschter Sauerteigmenge und Fütterungsverhältnis (1:1:1, 1:2:2 oder 1:5:5).',
    h1: 'Sauerteig Rechner – Anstellgut füttern & Sauerteigmenge berechnen',
    shortDescription: 'Berechnet Mehl, Wasser und Anstellgut zur Sauerteig-Herstellung mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Sauerteigrechner steuert die dreistufige oder einstufige Sauerteigführung (Anstellgut, Mehl, Wasser) für Roggen- und Weizensauerteige.',
      details: 'Formel: Sauerteig-Hydratation = (Wasser / Mehl) · 100. Standard-Sauerteig wird meist mit TA 200 (100 % Hydratation, 1:1 Mehl zu Wasser) geführt. Der Sauerteiganteil am Gesamtrezept liegt üblicherweise bei 15 bis 35 Prozent des Gesamtmehls.',
    },
    faqs: [
      { question: 'Wie oft muss man Anstellgut im Kühlschrank füttern?', answer: 'Ein gesundes Anstellgut sollte mindestens alle 7 bis 10 Tage mit gleichen Teilen Mehl und lauwarmem Wasser (z. B. 50 g Mehl + 50 g Wasser auf 10–20 g Anstellgut) aufgefrischt werden.' },
      { question: 'Woran erkennt man, dass der Sauerteig backreif ist?', answer: 'Er hat sein Volumen verdoppelt, riecht angenehm fruchtig-säuerlich und schwimmt beim Wassertest oben auf der Wasseroberfläche (Float-Test).' },
    ],
    relatedSlugs: ['brot-backen-baeckermass-rechner', 'pizza-teig-rechner', 'hefe-umrechner'],
  },
  {
    id: "marmelade-geliermittel-rechner",
    slug: "marmelade-geliermittel-rechner",
    name: "Marmeladen- & Gelierzucker-Rechner (1:1, 2:1 & 3:1 Gelierzucker)",
    shortName: "Marmelade-Rechner",
    category: "kochen-backen",
    subcategory: "Einkochen & Haltbarkeit",
    metaTitle: 'Marmelade Rechner – Gelierzucker 1:1, 2:1, 3:1',
    metaDescription: 'Berechnen Sie die benötigte Menge Gelierzucker (1:1, 2:1 oder 3:1) nach Fruchtgewicht in Gramm, Zitronensaft-Zugabe und die Anzahl benötigter.',
    h1: 'Marmelade Rechner – Gelierzucker nach Fruchtgewicht ermitteln',
    shortDescription: 'Berechnet Gelierzucker und Gläseranzahl für Marmelade und Konfitüre mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Einkochrechner kalkuliert die Frucht- und Zuckermengen für Konfitüren und Gelees bei 1:1, 2:1 oder 3:1 Gelierzucker.',
      details: 'Beim 2:1-Gelierzucker kommen auf 1.000 g vorbereitete Früchte exakt 500 g Gelierzucker. 3:1 verwendet nur 333 g Gelierzucker auf 1 kg Frucht (fruchtiger, aber kürzere Haltbarkeit nach dem Öffnen).',
    },
    faqs: [
      { question: 'Warum benötigt man Zitronensaft beim Marmeladekochen?', answer: 'Pektin benötigt ein saures Milieu (pH-Wert ca. 3,0 bis 3,3), um sein stabiles Geliermolekülgitter auszubilden; zudem intensiviert Säure die Fruchtfarben.' },
      { question: 'Wie funktioniert die Gelierprobe?', answer: 'Geben Sie nach 4 Minuten Kochen einen Teelöffel heiße Marmelade auf einen eiskalten Teller: Wird die Masse innerhalb von 1 bis 2 Minuten fest, ist die Konfitüre fertig.' },
    ],
    relatedSlugs: ['kuehlschrank-haltbarkeit-rechner', 'portionsrechner', 'zucker-ersatz-rechner'],
  },
  {
    id: "kaffee-wasser-verhaeltnis-rechner",
    slug: "kaffee-wasser-verhaeltnis-rechner",
    name: "Kaffee-Rechner (Kaffeemehl nach Tassenanzahl & Brühverhältnis)",
    shortName: "Kaffee-Rechner",
    category: "kochen-backen",
    subcategory: "Getränke",
    metaTitle: 'Kaffee Rechner – Golden Cup Ratio Kaffeemehl in Gramm nach...',
    metaDescription: 'Berechnen Sie das optimale Verhältnis von Kaffeemehl zu Wasser nach SCA Golden Cup Standard (60 g Kaffee auf 1 Liter Wasser) für Filterkaffee',
    h1: 'Kaffee Rechner – Wie viel Kaffeepulver brauche ich pro Tasse?',
    shortDescription: 'Berechnet Kaffeemehl in Gramm nach Tassenanzahl und Brühmethode mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Das Brew-Ratio (Brühverhältnis) nach den Standards der Specialty Coffee Association (SCA) garantiert die optimale Extraktion von Aromastoffen ohne Bitterkeit.',
      details: 'Goldener SCA-Standard: 60 Gramm gemahlener Röstkaffee auf 1.000 Gramm (1 Liter) Wasser (Verhältnis 1:16,6). Für Espresso in der Siebträgermaschine gilt ein Brühverhältnis von 1:2 bis 1:2,5 (z. B. 18 g Kaffeemehl ergeben 36 g flüssigen Espresso in 25–30 Sekunden).',
    },
    faqs: [
      { question: 'Welche Wassertemperatur ist für Filterkaffee optimal?', answer: 'Zwischen 92 °C und 96 °C; kochendes Wasser (100 °C) verbrennt Kaffeebestandteile und löst bittere Gerbstoffe, zu kaltes Wasser (< 90 °C) führt zu säuerlichem, unterextrahiertem Kaffee.' },
      { question: 'Warum wiegt man Kaffee in Gramm statt Esslöffeln?', answer: 'Weil verschiedene Röstungen (helle vs. dunkle Röstung) und Bohnengrößen stark unterschiedliche Schüttdichten aufweisen.' },
    ],
    relatedSlugs: ['tee-ziehzeit-temperatur-rechner', 'essloeffel-teeloeffel-gramm-rechner', 'portionsrechner'],
  },
  {
    id: "cocktail-alkoholgehalt-rechner",
    slug: "cocktail-alkoholgehalt-rechner",
    name: "Cocktail-Alkoholgehalt-Rechner (Vol.-% & Gramm reiner Alkohol)",
    shortName: "Cocktail-Rechner",
    category: "kochen-backen",
    subcategory: "Getränke",
    metaTitle: 'Cocktail Alkoholgehalt Rechner – Vol.-%',
    metaDescription: 'Berechnen Sie den exakten Alkoholgehalt (Vol.-% und Gramm reiner Alkohol) von Cocktails und Longdrinks nach Spirituosen (Gin, Wodka, Rum), Likören',
    h1: 'Cocktail Rechner – Wie stark ist mein Drink wirklich?',
    shortDescription: 'Berechnet den Alkoholgehalt in Vol.-% und Gramm für Cocktails mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Mischungsrechner ermittelt den resultierenden Gesamt-Alkoholgehalt in Volumenprozent (Vol.-%) und die reine Alkoholmasse eines Cocktails.',
      details: 'Alkoholgehalt = Summe(Menge in ml · Vol.-% / 100) / Gesamtvolumen des Drinks. Durch das Schütteln auf Eis schmilzt Schmelzwasser (ca. 25–35 ml Schmelzwasserverdünnung), was den Alkoholgehalt sensorisch abrundet.',
    },
    faqs: [
      { question: 'Wie viel Alkohol hat ein klassischer Gin Tonic?', answer: '40 ml Gin (40 Vol.-%) gemischt mit 160 ml Tonic Water ergibt ca. 8,0 Vol.-% Alkohol im 200-ml-Glas.' },
      { question: 'Was ist der Unterschied zwischen Shaken und Rühren (Stirring)?', answer: 'Klare Spirituosen-Cocktails (Martini, Manhattan) werden gerührt, um die Textur klar und samtig ohne Trübung zu halten; Cocktails mit Zitrussäften oder Sahne werden kräftig geschüttelt.' },
    ],
    relatedSlugs: ['alkohol-verkochungs-rechner', 'promillerechner', 'portionsrechner'],
  },
  {
    id: "salz-lake-poekel-rechner",
    slug: "salz-lake-poekel-rechner",
    name: "Salzlake- & Pökel-Rechner (Lakegehalt in % & Nasspökeln)",
    shortName: "Salzlake-Rechner",
    category: "kochen-backen",
    subcategory: "Einkochen & Haltbarkeit",
    metaTitle: 'Salzlake Rechner – Salzgehalt in % für Räuchern, Fermentieren',
    metaDescription: 'Berechnen Sie die exakte Salzmenge in Gramm nach Wasservolumen (Liter) und gewünschter Lakekonzentration (z. B.',
    h1: 'Salzlake Rechner – Exakte Salzmenge für Lake & Fermentation',
    shortDescription: 'Berechnet Salzmenge nach Wasservolumen und Prozentgehalt der Lake mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Pökelrechner ermittelt die exakte Salzkonzentration (Grad Baumé / Prozent) für Nasspökellaken zur Haltbarmachung von Fleisch, Fisch und Käse.',
      details: 'Salzgehalt in % = (Salzgewicht / Gesamtgewicht aus Wasser + Salz) · 100. Für Schinken und Pastrami werden Laken mit 8 bis 12 % Salzgehalt verwendet; bei Nitritpökelsalz (NPS mit 0,5 % NaNO2) schützt das Nitrit vor Clostridium botulinum.',
    },
    faqs: [
      { question: 'Wie lange muss Fleisch in der Lake reifen?', answer: 'Als Richtwert gilt ca. 1 Tag Pökelzeit pro Zentimeter Fleischdicke an der dicksten Stelle bei konstanter Kühlschranktemperatur von 4 bis 6 °C.' },
      { question: 'Wie viel Salz benötigt man für eine 10-prozentige Pökellake mit 5 Litern Wasser?', answer: 'Auf 5.000 g Wasser kommen 555 Gramm Salz (denn 555 / 5555 ≈ 10,0 %).' },
    ],
    relatedSlugs: ['fleisch-kerntemperatur-garzeit-rechner', 'kuehlschrank-haltbarkeit-rechner', 'portionsrechner'],
  },
  {
    id: "frittieroel-temperatur-rauchpunkt-rechner",
    slug: "frittieroel-temperatur-rauchpunkt-rechner",
    name: "Frittieröl- & Rauchpunkt-Rechner (Öl-Hitzebeständigkeit & Braten)",
    shortName: "Rauchpunkt & Öl",
    category: "kochen-backen",
    subcategory: "Kochen & Garen",
    metaTitle: 'Rauchpunkt Rechner – Speiseöle, Rauchpunkt',
    metaDescription: 'Finden Sie den Rauchpunkt und die maximale Erhitzbarkeit für Rapsöl, Olivenöl, Butterschmalz, Sonnenblumenöl, Kokosöl und Erdnussöl für Braten und.',
    h1: 'Rauchpunkt Rechner – Welches Speiseöl eignet sich zum Braten?',
    shortDescription: 'Ermittelt den Rauchpunkt und die Hitzestabilität von Speiseölen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Frittier-Ratgeber vergleicht die Rauchpunkte verschiedener Speiseöle und Fette und bestimmt die optimale Frittiertemperatur.',
      details: 'Die ideale Frittiertemperatur liegt bei 160 °C bis 175 °C. Oberhalb von 180 °C entsteht bei stärkehaltigen Lebensmitteln (Pommes) gesundheitsschädliches Acrylamid; bei Erreichen des Rauchpunkts zersetzt sich das Öl in giftiges Acrolein.',
    },
    faqs: [
      { question: 'Welche Öle haben den höchsten Rauchpunkt zum Frittieren?', answer: 'Raffiniertes Erdnussöl (ca. 230 °C), raffiniertes Rapsöl (ca. 220 °C) und Kokosfett; kaltgepresste native Öle und Butter eignen sich wegen früher Rauchbildung (< 160 °C) nicht zum Frittieren.' },
      { question: 'Wie erkennt man ohne Thermometer, ob das Frittieröl heiß genug ist?', answer: 'Halten Sie den Stiel eines Holzkochlöffels ins heiße Fett: Steigen sofort gleichmäßige, kleine Bläschen am Holz auf, ist die Temperatur von ca. 170 °C erreicht.' },
    ],
    relatedSlugs: ['backzeit-temperatur-umluft-oberhitze-rechner', 'fleisch-kerntemperatur-garzeit-rechner', 'temperatur-umrechner'],
  },
  {
    id: "fondue-raclette-mengen-rechner",
    slug: "fondue-raclette-mengen-rechner",
    name: "Raclette- & Fondue-Mengen-Rechner (Käse, Fleisch & Beilagen p.P.)",
    shortName: "Raclette & Fondue",
    category: "kochen-backen",
    subcategory: "Kochen & Garen",
    metaTitle: 'Raclette & Fondue Rechner – Käse- – RechenHafen',
    metaDescription: 'Berechnen Sie die perfekten Mengen für Silvester & Feiern: Raclettekäse (200 bis 250 g p.P.), Fleisch (200 bis 250 g p.P.',
    h1: 'Raclette & Fondue Rechner – Einkaufsmenge für Party & Silvester',
    shortDescription: 'Ermittelt Käse-, Fleisch- und Beilagenmengen pro Person mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Mengenplaner kalkuliert Fleisch-, Käse-, Kartoffel- und Beilagenmengen für gesellige Fondue- und Raclette-Abende ohne Reste oder Engpässe.',
      details: 'Pro erwachsener Person kalkuliert man: Käsefondue ca. 200 bis 250 g Käse; Fleischfondue (Chinoise/Fett) ca. 250 bis 300 g Fleisch; Raclette ca. 200 bis 250 g Raclettekäse plus 200 g Kartoffeln und 150 g Beilagen.',
    },
    faqs: [
      { question: 'Welche Käsesorten eignen sich für das klassische Schweizer Fondue Moitié-Moitié?', answer: 'Traditionell zu gleichen Teilen (50/50) reifer Vacherin Fribourgeois AOP und Gruyère AOP, geschmolzen in trockenem Weißwein mit einem Schuss Kirschwasser.' },
      { question: 'Was verhindert, dass Käsefondue gerinnt oder sich Fett absetzt?', answer: 'Ausreichend Säure aus dem Weißwein oder ein Spritzer Zitronensaft sowie ein Teelöffel Speisestärke, die die Emulsion stabil binden.' },
    ],
    relatedSlugs: ['portionsrechner', 'fleisch-kerntemperatur-garzeit-rechner', 'nudeln-rohmaerk-gewicht-rechner'],
  },
  {
    id: "kuehlschrank-haltbarkeit-rechner",
    slug: "kuehlschrank-haltbarkeit-rechner",
    name: "Kühlschrank-Haltbarkeits-Rechner (Lagerdauer geöffneter Lebensmittel)",
    shortName: "Kühlschrank Haltbarkeit",
    category: "kochen-backen",
    subcategory: "Einkochen & Haltbarkeit",
    metaTitle: 'Kühlschrank Haltbarkeit Rechner – Wie lange halten geöffnet...',
    metaDescription: 'Finden Sie die empfohlene Kühlschrank-Haltbarkeit in Tagen für Hackfleisch, Geflügel, geöffnete Milch, gekochte Reste, Eier und angebrochene Gläser.',
    h1: 'Kühlschrank Haltbarkeit Rechner – Haltbarkeitsdauer & Lagertipps',
    shortDescription: 'Ermittelt Haltbarkeitstage im Kühlschrank (2-7 °C) und Einfrierzeiten mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Frischeplaner bestimmt die sichere Haltbarkeit von geöffneten Lebensmitteln, Fleisch, Fisch und Speiseresten bei 4 °C bis 7 °C Kühlschranktemperatur.',
      details: 'Roher Fisch und Hackfleisch müssen am Tag des Einkaufs verzehrt werden. Gekochte Speisereste halten 2 bis 3 Tage in dichten Behältern; geöffnete H-Milch 4 bis 5 Tage; Hartkäse am Stück mehrere Wochen.',
    },
    faqs: [
      { question: 'Welche Zone im Kühlschrank ist die kälteste?', answer: 'Die Glasplatte direkt über dem Gemüsefach (ca. 2 bis 3 °C); hier gehören leicht verderblicher Fisch und Fleisch hin; ganz oben und in der Tür ist es mit 7 bis 9 °C am wärmsten.' },
      { question: 'Darf man heiße Speisen direkt in den Kühlschrank stellen?', answer: 'Nein, heiße Töpfe erwärmen den gesamten Kühlschrankinnenraum und gefährden andere Lebensmittel; Speisen zuerst im kalten Wasserbad auf Raumtemperatur abkühlen lassen.' },
    ],
    relatedSlugs: ['marmelade-geliermittel-rechner', 'fleisch-kerntemperatur-garzeit-rechner', 'salz-lake-poekel-rechner'],
  },
  {
    id: "tee-ziehzeit-temperatur-rechner",
    slug: "tee-ziehzeit-temperatur-rechner",
    name: "Tee-Ziehzeit- & Temperatur-Rechner (Grüner, Schwarzer & Kräutertee)",
    shortName: "Tee Ziehzeit-Rechner",
    category: "kochen-backen",
    subcategory: "Getränke",
    metaTitle: 'Tee Ziehzeit Rechner – Wassertemperatur',
    metaDescription: 'Finden Sie die perfekte Wassertemperatur und Ziehzeit für Grünen Tee (70-80 °C, 2 Min.), Schwarzen Tee (95 °C, 3 Min.',
    h1: 'Tee Ziehzeit Rechner – Temperatur & Ziehdauer für besten Geschmack',
    shortDescription: 'Ermittelt Wassertemperatur und Ziehzeit nach Teesorte mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Teerechner optimiert Wassertemperatur und Ziehdauer für Grüntee, Schwarztee, Weißen Tee, Oolong und Kräuteraufgüsse.',
      details: 'Grüner Tee (Sencha, Gyokuro) verlangt 60 °C bis 75 °C und 1,5 bis 2 Minuten Ziehzeit (kochendes Wasser macht ihn bitter). Schwarzer Tee benötigt 95 °C bis 100 °C für 3 bis 4 Minuten. Kräuter- und Früchtetees müssen zwingend mit sprudelnd kochendem Wasser (100 °C) für 8 bis 10 Minuten aufgegossen werden (Keimabtötung).',
    },
    faqs: [
      { question: 'Warum darf man Früchtetee nicht mit 70 °C aufgießen?', answer: 'Kräuter und Trockenfrüchte sind Naturprodukte, die Sporen enthalten können; das Bundesinstitut für Risikobewertung (BfR) empfiehlt sprudelnd kochendes Wasser zur Keimsicherheit.' },
      { question: 'Wirkt schwarzer Tee nach 5 Minuten Ziehzeit beruhigend?', answer: 'Koffein löst sich in den ersten 2 Minuten vollkommen; danach lösen sich vermehrt Gerbstoffe (Tannine), die das Koffein im Magen-Darm-Trakt langsamer resorbieren lassen und den Geschmack herb machen.' },
    ],
    relatedSlugs: ['kaffee-wasser-verhaeltnis-rechner', 'temperatur-umrechner', 'zeit-umrechner'],
  },
  {
    id: "kalorien-rezept-rechner",
    slug: "kalorien-rezept-rechner",
    name: "Rezept-Kalorien-Rechner (Gesamtkalorien & Makros pro Portion)",
    shortName: "Rezept-Kalorien-Rechner",
    category: "kochen-backen",
    subcategory: "Ernährung & Diät",
    metaTitle: 'Rezept Kalorien Rechner – kcal – RechenHafen',
    metaDescription: 'Berechnen Sie die Gesamtkalorien (kcal) und Makronährstoffe (Kohlenhydrate, Eiweiß, Fett) eines Rezepts nach Hauptzutaten und Portionen.',
    h1: 'Rezept Kalorien Rechner – Nährwerte & Makros pro Portion ermitteln',
    shortDescription: 'Berechnet Kalorien und Makros pro Portion für eigene Rezepte mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Nährwertrechner summiert alle Zutaten eines Rezepts und ermittelt Gesamtkalorien, Makronährstoffe und die Nährwerttabelle pro 100 Gramm und pro Portion.',
      details: 'Formel: Nährwert pro 100 g = (Gesamtnährwert aller Zutaten / Fertiges Gesamtgewicht) · 100. Berücksichtigt den typischen Feuchtigkeits- und Wasserverlust beim Backen und Schmoren.',
    },
    faqs: [
      { question: 'Warum wiegt das fertige Gericht weniger als die Summe der rohen Zutaten?', answer: 'Beim Braten und Backen verdampft Wasser; die Kalorienkonzentration pro 100 Gramm Fertiggericht steigt dadurch an, während die Gesamtkalorienzahl unverändert bleibt.' },
      { question: 'Müssen Gewürze bei der Kalorienberechnung mitgezählt werden?', answer: 'Salz, Pfeffer und getrocknete Kräuter in üblichen Haushaltsmengen haben vernachlässigbar geringe Kalorienwerte; Bratfette und Zucker müssen jedoch grammgenau erfasst werden.' },
    ],
    relatedSlugs: ['portionsrechner', 'nudeln-rohmaerk-gewicht-rechner', 'zucker-ersatz-rechner'],
  },
  {
    id: "schokolade-temperieren-rechner",
    slug: "schokolade-temperieren-rechner",
    name: "Schokolade-Temperieren-Rechner (Impfmethode & Kuvertüre-Temperaturen)",
    shortName: "Schokolade temperieren",
    category: "kochen-backen",
    subcategory: "Backzutaten",
    metaTitle: 'Schokolade temperieren Rechner – Impfmethode, Kuvertüre',
    metaDescription: 'Berechnen Sie die exakten Temperaturen und Impfmengen (2/3 schmelzen bei 45 °C, 1/3 Impfschokolade bei 27 °C zugeben) für Zartbitter-',
    h1: 'Schokolade temperieren Rechner – Perfekter Glanz & Knack nach Impfmethode',
    shortDescription: 'Ermittelt Impfmengen und Arbeitstemperaturen für Kuvertüre mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Das Temperieren von Kuvertüre schmilzt Schokolade kontrolliert, um stabile Kristallformen (Form-V-Kristalle) für knackigen Bruch und seidigen Glanz ohne grauen Fettreif zu erzeugen.',
      details: 'Drei-Stufen-Methode (Zartbitter): 1. Schmelzen auf 45–48 °C (alle alten Kristalle lösen); 2. Abkühlen unter Rühren (Impfen) auf 27–28 °C (Kristallkeime bilden); 3. Wiedererwärmen auf Arbeitstemperatur 31–32 °C (Vollmilch: 29–30 °C, Weiß: 28–29 °C).',
    },
    faqs: [
      { question: 'Was passiert, wenn nur ein einziger Wassertropfen in die geschmolzene Schokolade gelangt?', answer: 'Die Schokolade "stockt" augenblicklich zu einem zähen, klumpigen Teig: Der Zucker löst sich im Wasser und trennt sich vom Kakaofett.' },
      { question: 'Was ist die Impfmethode beim Temperieren?', answer: 'Zwei Drittel der Kuvertüre im Wasserbad schmelzen, von der Hitze nehmen und das restliche feingehackte Drittel kalte Kuvertüre unterrühren, bis die perfekte Arbeitstemperatur erreicht ist.' },
    ],
    relatedSlugs: ['backzeit-temperatur-umluft-oberhitze-rechner', 'temperatur-umrechner', 'cups-in-gramm-rechner'],
  },
];
