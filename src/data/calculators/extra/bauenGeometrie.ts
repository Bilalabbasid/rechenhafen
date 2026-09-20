import { CalculatorDefinition } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';

export const EXTRA_BAUEN_GEOMETRIE: CalculatorDefinition[] = [
  {
    id: "estrich-rechner",
    slug: "estrich-rechner",
    name: "Estrich-Bedarfsrechner (Zementestrich & Fließestrich Bedarf)",
    shortName: "Estrich-Bedarfsrechner",
    category: "bauen-renovieren",
    subcategory: "Rohbau & Boden",
    metaTitle: "Estrich Rechner – Zementestrich & Fließestrich Materialbedarf berechnen",
    metaDescription: "Berechnen Sie den Estrichbedarf in m³, Tonnen und 25-kg-/40-kg-Säcken nach Fläche und Einbaudicke (z. B. 45 mm, 60 mm) inklusive Trocknungszeit-Richtwert.",
    h1: "Estrich Rechner – Materialmenge & Sackanzahl für Zementestrich",
    shortDescription: "Ermittelt den Estrichbedarf nach Raumfläche und Schichtdicke.",
    searchKeywords: ["estrich rechner sack","zementestrich bedarf berechnen","fliessestrich menge m2","estrich dicke fußbodenheizung"],
    inputs: [
          {
                "id": "area",
                "label": "Bodenfläche",
                "type": "number",
                "defaultValue": 30,
                "min": 1,
                "max": 1000,
                "step": 1,
                "unit": "m²"
          },
          {
                "id": "thickness",
                "label": "Estrichdicke",
                "type": "number",
                "defaultValue": 50,
                "min": 20,
                "max": 120,
                "step": 5,
                "unit": "mm"
          },
          {
                "id": "estrichType",
                "label": "Estrich-Art & Dichte",
                "type": "select",
                "defaultValue": "ct",
                "options": [
                      {
                            "value": "ct",
                            "label": "Zementestrich CT (ca. 2.000 kg/m³)"
                      },
                      {
                            "value": "ca",
                            "label": "Anhydrit- / Calciumsulfat-Fließestrich CA (ca. 2.100 kg/m³)"
                      }
                ]
          },
          {
                "id": "sackSize",
                "label": "Sackgröße",
                "type": "select",
                "defaultValue": "25",
                "options": [
                      {
                            "value": "25",
                            "label": "25 kg Fertigestrich-Sack"
                      },
                      {
                            "value": "40",
                            "label": "40 kg Sack"
                      }
                ]
          },
          {
                "id": "waste",
                "label": "Verschnitt & Unebenheitspuffer",
                "type": "number",
                "defaultValue": 5,
                "min": 0,
                "max": 20,
                "step": 1,
                "unit": "%"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const a = Number(inputs.area) || 0;
      const tMm = Number(inputs.thickness) || 0;
      const density = inputs.estrichType === 'ca' ? 2100 : 2000;
      const sackKg = Number(inputs.sackSize) || 25;
      const waste = 1 + ((Number(inputs.waste) || 0) / 100);
      
      const volumeM3 = a * (tMm / 1000) * waste;
      const weightKg = volumeM3 * density;
      const sacks = Math.ceil(weightKg / sackKg);
      const dryingDays = tMm <= 40 ? tMm * 1 : 40 + (tMm - 40) * 2; // Faustregel Belegreife
      
      return {
        primary: { id: 'sacks', label: 'Benötigte Säcke Fertigestrich', value: sacks, formattedValue: sacks + ' Säcke (' + sackKg + ' kg)', highlight: true },
        secondary: [
          { id: 'volume', label: 'Volumen Einbauestrich', value: volumeM3, formattedValue: formatNumber(volumeM3, 2) + ' m³' },
          { id: 'weightTonnes', label: 'Gesamtgewicht ca.', value: weightKg / 1000, formattedValue: formatNumber(weightKg / 1000, 2) + ' Tonnen' },
          { id: 'dryingTime', label: 'Richtwert Belegreife (Trocknung)', value: dryingDays, formattedValue: 'ca. ' + dryingDays + ' Tage' },
        ],
        summaryText: 'Für ' + a + ' m² Fläche bei ' + tMm + ' mm Schichtdicke benötigen Sie ca. ' + formatNumber(volumeM3, 2) + ' m³ Estrich (' + sacks + ' Säcke à ' + sackKg + ' kg).',
      };
    },
    formula: "Volumen = Fläche (m²) × Dicke (m) × Verschnittfaktor; Säcke = (Volumen × Dichte) / Sackgewicht",
    formulaExplanation: "Bei Zementestrich rechnet man mit ca. 20 kg Trockenmörtel pro m² je 1 cm Schichtdicke. Für Heizestrich auf Dämmung sind in der Regel mindestens 45 mm Überdeckung der Heizrohre vorgeschrieben.",
    workedExample: {
          "title": "Beispiel: 30 m² Wohnzimmer mit 50 mm Zementestrich",
          "inputValues": [
                {
                      "label": "Fläche",
                      "value": "30 m²"
                },
                {
                      "label": "Dicke",
                      "value": "50 mm"
                },
                {
                      "label": "Sackgröße",
                      "value": "25 kg"
                }
          ],
          "steps": [
                "Volumen: 30 × 0,050 × 1,05 = 1,575 m³",
                "Gewicht: 1,575 m³ × 2.000 kg/m³ = 3.150 kg",
                "Säcke: 3.150 / 25 = 126 Säcke"
          ],
          "result": "126 Säcke à 25 kg (ca. 3,15 t)"
    },
    faqs: [
          {
                "question": "Wann ist Zementestrich belegreif für Fliesen oder Parkett?",
                "answer": "Zementestrich trocknet die ersten 4 cm ca. 1 Woche pro cm, danach 2 Wochen pro weiterem cm. Für Parkett ist eine Restfeuchte von max. 1,8 CM-% (mit Fußbodenheizung) erforderlich."
          },
          {
                "question": "Was ist besser: Zementestrich oder Fließestrich?",
                "answer": "Fließestrich umschließt Heizrohre blasenfrei und trocknet schneller, ist jedoch feuchteempfindlich und für Nassräume ungeeignet. Zementestrich ist universell und wasserbeständig."
          }
    ],
    relatedSlugs: ["betonrechner","bodenbelag-rechner","fliesenkleber-rechner"],
  },
  {
    id: "daemmung-u-wert-rechner",
    slug: "daemmung-u-wert-rechner",
    name: "Dämmung-U-Wert-Rechner (Wärmedurchgang & Dämmstoffdicke)",
    shortName: "U-Wert & Dämmung",
    category: "bauen-renovieren",
    subcategory: "Dämmung & Energie",
    metaTitle: "Dämmung U-Wert Rechner – Dämmstoffdicke & Wärmedurchgangskoeffizient",
    metaDescription: "Berechnen Sie den U-Wert (W/m²K) und die erforderliche Dämmstärke nach GEG 2024 für WLG 032, WLG 035, WLG 040 an Wand, Dach und Kellerdecke.",
    h1: "Dämmung U-Wert Rechner – Dämmstärke & Wärmeschutz nach GEG",
    shortDescription: "Berechnet den U-Wert und die nötige Dämmstoffdicke nach Wärmeleitgruppe.",
    searchKeywords: ["u wert rechner daemmung","geg u wert fassade dach","daemmstoffdicke berechnen wlg 035","waermedurchgangskoeffizient rechner"],
    inputs: [
          {
                "id": "component",
                "label": "Bauteil & gesetzlicher GEG-Maximalwert",
                "type": "select",
                "defaultValue": "wall",
                "options": [
                      {
                            "value": "wall",
                            "label": "Außenwand Fassade (GEG max. 0,24 W/m²K)"
                      },
                      {
                            "value": "roof",
                            "label": "Steildach / oberste Geschossdecke (GEG max. 0,14 W/m²K)"
                      },
                      {
                            "value": "basement",
                            "label": "Kellerdecke gegen unbeheizt (GEG max. 0,30 W/m²K)"
                      }
                ]
          },
          {
                "id": "wlg",
                "label": "Wärmeleitgruppe (WLG / Lambda-Wert)",
                "type": "select",
                "defaultValue": "035",
                "options": [
                      {
                            "value": "032",
                            "label": "WLG 032 (λ = 0,032 W/mK – Hochleistungsdämmung)"
                      },
                      {
                            "value": "035",
                            "label": "WLG 035 (λ = 0,035 W/mK – Standard Mineralwolle/EPS)"
                      },
                      {
                            "value": "040",
                            "label": "WLG 040 (λ = 0,040 W/mK – Holzfaser/Standardwolle)"
                      },
                      {
                            "value": "022",
                            "label": "WLG 022 (λ = 0,022 W/mK – PIR/PUR Hartschaum)"
                      }
                ]
          },
          {
                "id": "thickness",
                "label": "Geplante Dämmstoffdicke",
                "type": "number",
                "defaultValue": 160,
                "min": 40,
                "max": 400,
                "step": 10,
                "unit": "mm"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const tMm = Number(inputs.thickness) || 0;
      const tM = tMm / 1000;
      const lambda = (Number(inputs.wlg) || 35) / 1000;
      // R_se + R_si ca. 0.17 (Wand), R_daemm = d / lambda
      const rThermal = 0.17 + (lambda > 0 ? (tM / lambda) : 0);
      const uWert = 1 / rThermal;
      
      const gegLimit = inputs.component === 'roof' ? 0.14 : inputs.component === 'wall' ? 0.24 : 0.30;
      const gegCompliant = uWert <= gegLimit;
      // Erforderliche Dicke für GEG:
      const rReq = 1 / gegLimit;
      const rInsulationReq = Math.max(0, rReq - 0.17);
      const reqThicknessMm = Math.ceil(rInsulationReq * lambda * 1000);
      
      return {
        primary: { id: 'uWert', label: 'Erreichter U-Wert der Dämmung', value: uWert, formattedValue: formatNumber(uWert, 3) + ' W/(m²·K)', highlight: true },
        secondary: [
          { id: 'gegCheck', label: 'GEG-Anforderung erfüllt?', value: gegCompliant ? 1 : 0, formattedValue: gegCompliant ? 'Ja (max. ' + formatNumber(gegLimit, 2) + ' W/m²K)' : 'Nein (zu geringe Dämmung)' },
          { id: 'reqThickness', label: 'Mindestdicke für GEG-Konformität', value: reqThicknessMm, formattedValue: reqThicknessMm + ' mm' },
          { id: 'rValue', label: 'Wärmedurchlasswiderstand R', value: rThermal, formattedValue: formatNumber(rThermal, 2) + ' (m²·K)/W' },
        ],
        summaryText: 'Mit ' + tMm + ' mm Dämmstoff (WLG ' + inputs.wlg + ') erreichen Sie einen U-Wert von ' + formatNumber(uWert, 3) + ' W/(m²·K). Gesetzliche GEG-Vorgabe: ' + (gegCompliant ? 'vollständig erfüllt!' : 'nicht erfüllt, mindestens ' + reqThicknessMm + ' mm nötig!'),
      };
    },
    formula: "U = 1 / (R_si + d/λ + R_se); R = d / λ",
    formulaExplanation: "Je kleiner der U-Wert, desto besser ist die Dämmwirkung und desto geringer der winterliche Wärmeverlust des Gebäudes.",
    workedExample: {
          "title": "Beispiel: 160 mm Fassadendämmung WLG 035",
          "inputValues": [
                {
                      "label": "Bauteil",
                      "value": "Fassade"
                },
                {
                      "label": "Dicke",
                      "value": "160 mm"
                },
                {
                      "label": "WLG",
                      "value": "035 (λ = 0,035)"
                }
          ],
          "steps": [
                "R_Dämm = 0,160 / 0,035 = 4,571 m²K/W",
                "R_ges = 4,571 + 0,17 = 4,741",
                "U = 1 / 4,741 = 0,211 W/(m²K)"
          ],
          "result": "0,211 W/(m²K) (GEG max. 0,24 erfüllt)"
    },
    faqs: [
          {
                "question": "Was bedeutet WLG 035?",
                "answer": "WLG steht für Wärmeleitgruppe. WLG 035 bedeutet, dass der Dämmstoff eine Wärmeleitfähigkeit von 0,035 Watt pro Meter und Kelvin (W/mK) besitzt. Je niedriger die Zahl, desto schlanker kann die Dämmung sein."
          },
          {
                "question": "Welche Förderung gibt es bei Unterschreiten des GEG-U-Werts?",
                "answer": "Die KfW und BAFA fördern energetische Sanierungen, wenn der U-Wert die GEG-Mindestanforderungen deutlich übertrifft (z. B. Außenwand U <= 0,20 W/m²K)."
          }
    ],
    relatedSlugs: ["farbmengen-rechner","heizkostenvergleich-rechner","gaskostenrechner"],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Gebäudeenergiegesetz (GEG § 48 und Anlage 7)',
      sourceUrl: 'https://www.bmwsb.bund.de',
      lastVerified: '2026-01-15',
    }
  },
  {
    id: "dachflaeche-rechner",
    slug: "dachflaeche-rechner",
    name: "Dachflächen-Rechner (Satteldach, Pultdach & Dachneigung)",
    shortName: "Dachflächen-Rechner",
    category: "bauen-renovieren",
    subcategory: "Dach & Fassade",
    metaTitle: "Dachfläche Rechner – Dachflächenberechnung nach Grundfläche & Neigung",
    metaDescription: "Berechnen Sie die echte Dachfläche für Satteldach, Pultdach und Walmdach nach Grundrissmaßen, Dachneigung in Grad oder Prozent und Dachüberstand.",
    h1: "Dachfläche Rechner – Echte Dachfläche nach Neigung & Maßen",
    shortDescription: "Ermittelt die Quadratmeter Dachfläche nach Dachneigung und Grundriss.",
    searchKeywords: ["dachflaeche rechner neigung","satteldach flaeche berechnen cosinus","dach quadratmeter berechnen dachziegel","dachueberstand dachflaeche"],
    inputs: [
          {
                "id": "roofType",
                "label": "Dachform",
                "type": "select",
                "defaultValue": "saddle",
                "options": [
                      {
                            "value": "saddle",
                            "label": "Satteldach (Giebeldach, 2 Dachhälften)"
                      },
                      {
                            "value": "pult",
                            "label": "Pultdach (1 geneigte Dachfläche)"
                      }
                ]
          },
          {
                "id": "houseLength",
                "label": "Hauslänge (Giebelseite/Trauflänge)",
                "type": "number",
                "defaultValue": 10,
                "min": 2,
                "max": 100,
                "step": 0.5,
                "unit": "m"
          },
          {
                "id": "houseWidth",
                "label": "Hausbreite",
                "type": "number",
                "defaultValue": 8,
                "min": 2,
                "max": 100,
                "step": 0.5,
                "unit": "m"
          },
          {
                "id": "roofPitchDeg",
                "label": "Dachneigung in Grad",
                "type": "number",
                "defaultValue": 35,
                "min": 5,
                "max": 70,
                "step": 1,
                "unit": "°"
          },
          {
                "id": "overhang",
                "label": "Dachüberstand ringsum",
                "type": "number",
                "defaultValue": 0.5,
                "min": 0,
                "max": 2,
                "step": 0.1,
                "unit": "m"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const l = Number(inputs.houseLength) || 0;
      const w = Number(inputs.houseWidth) || 0;
      const pitch = Number(inputs.roofPitchDeg) || 0;
      const over = Number(inputs.overhang) || 0;
      const isSaddle = inputs.roofType === 'saddle';
      
      const effectiveLength = l + (2 * over);
      const effectiveWidth = w + (2 * over);
      const rad = (pitch * Math.PI) / 180;
      const cosPitch = Math.cos(rad);
      
      let totalRoofArea = 0;
      let rafterLength = 0;
      
      if (isSaddle) {
        // Jede Dachseite überspannt die halbe Breite
        rafterLength = (effectiveWidth / 2) / cosPitch;
        totalRoofArea = 2 * (effectiveLength * rafterLength);
      } else {
        // Pultdach überspannt volle Breite
        rafterLength = effectiveWidth / cosPitch;
        totalRoofArea = effectiveLength * rafterLength;
      }
      
      const tilesCount = Math.ceil(totalRoofArea * 12); // Ca. 11-13 Dachziegel pro m²
      
      return {
        primary: { id: 'roofArea', label: 'Gesamte Dachfläche', value: totalRoofArea, formattedValue: formatNumber(totalRoofArea, 2) + ' m²', highlight: true },
        secondary: [
          { id: 'rafterLength', label: 'Länge der Dachsparren (Traufe bis First)', value: rafterLength, formattedValue: formatNumber(rafterLength, 2) + ' m' },
          { id: 'tilesCount', label: 'Dachziegel-Bedarf ca. (12 Stk./m²)', value: tilesCount, formattedValue: tilesCount + ' Stück' },
          { id: 'groundArea', label: 'Überdachte Grundfläche', value: effectiveLength * effectiveWidth, formattedValue: formatNumber(effectiveLength * effectiveWidth, 2) + ' m²' },
        ],
        summaryText: 'Die tatsächliche Dachfläche beträgt ' + formatNumber(totalRoofArea, 2) + ' m². Bei Standard-Dachpfannen (ca. 12 Stk./m²) benötigen Sie rund ' + tilesCount + ' Ziegel.',
      };
    },
    formula: "Dachfläche = Grundfläche / cos(Neigungswinkel) (plus Dachüberstände)",
    formulaExplanation: "Da die Dachfläche schräg im Raum steht, teilt man die horizontale Grundfläche durch den Kosinus des Neigungswinkels.",
    workedExample: {
          "title": "Beispiel: Satteldach 10 m × 8 m mit 35° Neigung und 0,5 m Überstand",
          "inputValues": [
                {
                      "label": "Länge",
                      "value": "10 m (+ 1 m Überstand)"
                },
                {
                      "label": "Breite",
                      "value": "8 m (+ 1 m Überstand)"
                },
                {
                      "label": "Neigung",
                      "value": "35°"
                }
          ],
          "steps": [
                "Sparrenlänge = (9 / 2) / cos(35°) = 4,5 / 0,8192 = 5,49 m",
                "Fläche: 2 × (11 × 5,49) = 120,85 m²"
          ],
          "result": "120,85 m² Dachfläche"
    },
    faqs: [
          {
                "question": "Wie viele Dachpfannen braucht man pro Quadratmeter?",
                "answer": "Handelsübliche Tondachziegel und Betondachsteine (wie Frankfurter Pfanne) benötigen zwischen 10 und 14 Stück pro m², im Mittel rechnet man mit 12 Stück/m²."
          },
          {
                "question": "Wie rechnet man Dachneigung von Prozent in Grad um?",
                "answer": "Winkel (Grad) = arctan(Prozent / 100) × (180 / π). Ein Dach mit 100 % Steigung entspricht exakt 45° Neigung."
          }
    ],
    relatedSlugs: ["daemmung-u-wert-rechner","regenwasser-zisterne-rechner","farbmengen-rechner"],
  },
  {
    id: "bausteine-mauerwerk-rechner",
    slug: "bausteine-mauerwerk-rechner",
    name: "Mauerstein-Bedarfsrechner (Bedarf nach Wandfläche & Steinformat)",
    shortName: "Mauerstein-Bedarfsrechner",
    category: "bauen-renovieren",
    subcategory: "Rohbau & Boden",
    metaTitle: "Mauersteine Rechner – Ziegel- & Porenbeton-Bedarf nach Wandfläche",
    metaDescription: "Berechnen Sie den Bedarf an Mauersteinen (NF, DF, 2DF, Planstein 24er/36er) und Mörtel nach Wandfläche in m² abzüglich Fenster- und Türöffnungen.",
    h1: "Mauersteine Rechner – Steinanzahl & Mörtelbedarf ermitteln",
    shortDescription: "Ermittelt die Stückzahl an Mauerziegeln und Mörtel für eine Wand.",
    searchKeywords: ["mauersteine bedarf berechnen","ziegelsteine rechner wandflaeche","porenbeton planstein stueckzahl m2","moertel mauerwerk rechner"],
    inputs: [
          {
                "id": "wallLength",
                "label": "Wandlänge",
                "type": "number",
                "defaultValue": 6,
                "min": 0.5,
                "max": 100,
                "step": 0.1,
                "unit": "m"
          },
          {
                "id": "wallHeight",
                "label": "Wandhöhe",
                "type": "number",
                "defaultValue": 2.5,
                "min": 0.5,
                "max": 10,
                "step": 0.05,
                "unit": "m"
          },
          {
                "id": "openingsArea",
                "label": "Abzug für Fenster & Türen",
                "type": "number",
                "defaultValue": 3,
                "min": 0,
                "max": 50,
                "step": 0.5,
                "unit": "m²"
          },
          {
                "id": "stoneFormat",
                "label": "Steinformat",
                "type": "select",
                "defaultValue": "plan24",
                "options": [
                      {
                            "value": "plan24",
                            "label": "Planstein 24er (Porenbeton/Kalksandstein, ca. 8 Stk./m²)"
                      },
                      {
                            "value": "plan36",
                            "label": "Planstein 36,5er (Außenwand, ca. 8 Stk./m²)"
                      },
                      {
                            "value": "2df",
                            "label": "2DF Ziegel/Kalksandstein (240 × 115 × 113 mm, ca. 32 Stk./m²)"
                      },
                      {
                            "value": "nf",
                            "label": "NF Normalformat (240 × 115 × 71 mm, ca. 48 Stk./m²)"
                      }
                ]
          },
          {
                "id": "waste",
                "label": "Verschnitt & Bruch",
                "type": "number",
                "defaultValue": 5,
                "min": 0,
                "max": 15,
                "step": 1,
                "unit": "%"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const l = Number(inputs.wallLength) || 0;
      const h = Number(inputs.wallHeight) || 0;
      const open = Number(inputs.openingsArea) || 0;
      const gross = l * h;
      const netArea = Math.max(0, gross - open);
      const waste = 1 + ((Number(inputs.waste) || 0) / 100);
      
      let stonesPerM2 = 8;
      let mortarKgPerM2 = 2.5; // Dünnbettmörtel
      
      if (inputs.stoneFormat === '2df') {
        stonesPerM2 = 32;
        mortarKgPerM2 = 18; // Normalmörtel
      } else if (inputs.stoneFormat === 'nf') {
        stonesPerM2 = 48;
        mortarKgPerM2 = 25;
      } else if (inputs.stoneFormat === 'plan36') {
        stonesPerM2 = 8;
        mortarKgPerM2 = 3.5;
      }
      
      const totalStones = Math.ceil(netArea * stonesPerM2 * waste);
      const totalMortarKg = Math.ceil(netArea * mortarKgPerM2 * waste);
      
      return {
        primary: { id: 'stones', label: 'Benötigte Mauersteine', value: totalStones, formattedValue: totalStones + ' Stück', highlight: true },
        secondary: [
          { id: 'netArea', label: 'Netto-Wandfläche', value: netArea, formattedValue: formatNumber(netArea, 2) + ' m²' },
          { id: 'mortar', label: 'Mörtelbedarf ca.', value: totalMortarKg, formattedValue: totalMortarKg + ' kg (' + Math.ceil(totalMortarKg / 25) + ' Säcke à 25 kg)' },
        ],
        summaryText: 'Für ' + formatNumber(netArea, 2) + ' m² Mauerwerk benötigen Sie rund ' + totalStones + ' Steine und ' + totalMortarKg + ' kg Mörtel.',
      };
    },
    formula: "Steine = Nettofläche (m²) × Steine/m² × Verschnittfaktor",
    formulaExplanation: "Je größer das Steinformat (z. B. Plansteine im Dünnbettverfahren), desto schneller der Baufortschritt und desto geringer der Mörtelverbrauch.",
    workedExample: {
          "title": "Beispiel: 15 m² Wand mit 2DF-Kalksandsteinen",
          "inputValues": [
                {
                      "label": "Wandfläche",
                      "value": "15 m²"
                },
                {
                      "label": "Format",
                      "value": "2DF (32 Stk./m²)"
                }
          ],
          "steps": [
                "Steine: 15 m² × 32 × 1,05 = 504 Steine",
                "Mörtel: 15 m² × 18 kg = 270 kg"
          ],
          "result": "504 Steine und 11 Säcke Mörtel (à 25 kg)"
    },
    faqs: [
          {
                "question": "Was ist der Unterschied zwischen Dünnbettmörtel und Dickbettmörtel?",
                "answer": "Dünnbettmörtel wird mit 1 bis 3 mm Schichtdicke bei maßhaltigen Plansteinen aufgetragen. Dickbettmörtel gleicht mit 12 mm Fuge Maßtoleranzen klassischer Ziegel aus."
          },
          {
                "question": "Werden Fensteröffnungen bei Mauerarbeiten voll abgezogen?",
                "answer": "Nach VOB/C ATV DIN 18330 werden Öffnungen bis zu 2,5 m² Einzelfläche bei der Abrechnung übermessen, für die reine Materialbestellung zieht man jedoch die tatsächliche Fläche ab."
          }
    ],
    relatedSlugs: ["betonrechner","estrich-rechner","putz-rechner"],
  },
  {
    id: "fliesenkleber-rechner",
    slug: "fliesenkleber-rechner",
    name: "Fliesenkleber- & Fugenmörtel-Rechner (kg & Säcke nach m²)",
    shortName: "Fliesenkleber-Rechner",
    category: "bauen-renovieren",
    subcategory: "Rohbau & Boden",
    metaTitle: "Fliesenkleber & Fugenmörtel Rechner – Verbrauch in kg & Säcken",
    metaDescription: "Berechnen Sie den Bedarf an Fliesenkleber und Fugenbunt nach Quadratmetern, Zahnspachtel-Größe (6, 8, 10, 12 mm) und Fliesenabmessungen.",
    h1: "Fliesenkleber Rechner – Materialbedarf für Fliesen & Fugen",
    shortDescription: "Berechnet den Fliesenkleber- und Fugenmörtelbedarf nach Fläche und Zahnung.",
    searchKeywords: ["fliesenkleber rechner verbrauch kg m2","fugenmoertel rechner fliesen","zahnung fliesenkleber verbrauch","flexkleber saecke berechnen"],
    inputs: [
          {
                "id": "area",
                "label": "Fliesenfläche",
                "type": "number",
                "defaultValue": 25,
                "min": 1,
                "max": 500,
                "step": 1,
                "unit": "m²"
          },
          {
                "id": "notch",
                "label": "Zahnspachtel-Größe (Zahnung)",
                "type": "select",
                "defaultValue": "8",
                "options": [
                      {
                            "value": "6",
                            "label": "6 mm Zahnung (Fliesen bis 20×20 cm, ca. 2,4 kg/m²)"
                      },
                      {
                            "value": "8",
                            "label": "8 mm Zahnung (Fliesen bis 30×60 cm, ca. 3,2 kg/m²)"
                      },
                      {
                            "value": "10",
                            "label": "10 mm Zahnung (Großformat bis 60×60 cm, ca. 4,0 kg/m²)"
                      },
                      {
                            "value": "12",
                            "label": "12 mm Zahnung / Mittelbett (Großformat ab 60×120 cm, ca. 5,0 kg/m²)"
                      }
                ]
          },
          {
                "id": "jointWidth",
                "label": "Fugenbreite",
                "type": "number",
                "defaultValue": 3,
                "min": 1,
                "max": 10,
                "step": 0.5,
                "unit": "mm"
          },
          {
                "id": "waste",
                "label": "Verschnitt & Reserve",
                "type": "number",
                "defaultValue": 10,
                "min": 0,
                "max": 25,
                "step": 1,
                "unit": "%"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const a = Number(inputs.area) || 0;
      const notch = inputs.notch;
      const jointW = Number(inputs.jointWidth) || 3;
      const waste = 1 + ((Number(inputs.waste) || 0) / 100);
      
      let kgPerM2 = 3.2;
      if (notch === '6') kgPerM2 = 2.4;
      else if (notch === '10') kgPerM2 = 4.0;
      else if (notch === '12') kgPerM2 = 5.0;
      
      const adhesiveKg = a * kgPerM2 * waste;
      const adhesiveSacks = Math.ceil(adhesiveKg / 25);
      // Fugenmasse ca. 0.15 kg/m² je mm Fugenbreite
      const groutKg = a * (jointW * 0.15) * waste;
      const groutSacks = Math.ceil(groutKg / 5);
      
      return {
        primary: { id: 'adhesiveSacks', label: 'Fliesenkleber (25-kg-Säcke)', value: adhesiveSacks, formattedValue: adhesiveSacks + ' Säcke (' + Math.round(adhesiveKg) + ' kg)', highlight: true },
        secondary: [
          { id: 'adhesiveKg', label: 'Fliesenkleber Gesamtgewicht', value: adhesiveKg, formattedValue: formatNumber(adhesiveKg, 1) + ' kg' },
          { id: 'groutKg', label: 'Fugenmörtel Gesamtbedarf', value: groutKg, formattedValue: formatNumber(groutKg, 1) + ' kg (' + groutSacks + ' Säcke à 5 kg)' },
        ],
        summaryText: 'Für ' + a + ' m² benötigen Sie ' + adhesiveSacks + ' Säcke Fliesenkleber (à 25 kg) sowie ca. ' + formatNumber(groutKg, 1) + ' kg Fugenbunt.',
      };
    },
    formula: "Kleber = Fläche (m²) × Verbrauch nach Zahnung (kg/m²) × Verschnitt; Fuge = Fläche × Fugenbreite × 0,15 kg",
    formulaExplanation: "Großformatige Fliesen erfordern eine größere Zahnung und das Buttering-Floating-Verfahren (Kleber auf Untergrund und Fliesenrücken), was den Kleberverbrauch erhöht.",
    workedExample: {
          "title": "Beispiel: 25 m² Bad mit 8-mm-Zahnung",
          "inputValues": [
                {
                      "label": "Fläche",
                      "value": "25 m²"
                },
                {
                      "label": "Zahnung",
                      "value": "8 mm (3,2 kg/m²)"
                },
                {
                      "label": "Puffer",
                      "value": "10 %"
                }
          ],
          "steps": [
                "Kleber = 25 × 3,2 × 1,10 = 88 kg",
                "Säcke = 88 / 25 = 3,52 -> 4 Säcke à 25 kg"
          ],
          "result": "4 Säcke Fliesenkleber (100 kg)"
    },
    faqs: [
          {
                "question": "Welcher Fliesenkleber eignet sich für Fußbodenheizung?",
                "answer": "Bei Fußbodenheizungen und auf Holzböden ist zwingend ein flexibler Kleber (Klassifizierung C2 TE S1 oder S2 nach DIN EN 12004) erforderlich, um thermische Spannungen auszugleichen."
          },
          {
                "question": "Wann kann man frisch verlegte Fliesen verfugen?",
                "answer": "In der Regel nach 24 Stunden Trocknungszeit. Bei Schnellklebern kann bereits nach 3 bis 4 Stunden verfugt werden."
          }
    ],
    relatedSlugs: ["bodenbelag-rechner","estrich-rechner","farbmengen-rechner"],
  },
  {
    id: "aushub-erdarbeiten-rechner",
    slug: "aushub-erdarbeiten-rechner",
    name: "Aushub- & Erdarbeiten-Rechner (Baugrube m³, Tonnen & LKW-Fahrten)",
    shortName: "Aushub-Rechner",
    category: "bauen-renovieren",
    subcategory: "Rohbau & Boden",
    metaTitle: "Aushub & Erdarbeiten Rechner – Baugrube m³, Auflockerung & LKW",
    metaDescription: "Berechnen Sie das Erdreich-Aushubvolumen in m³, die Auflockerung (Auflockerungsfaktor 1,2 bis 1,3), das Gewicht in Tonnen und die Anzahl 4-Achs-LKW-Fahrten.",
    h1: "Aushub Rechner – Erdvolumen, Tonnen & LKW-Entsorgung",
    shortDescription: "Berechnet Baugrubenaushub, Auflockerung und benötigte LKW-Ladungen.",
    searchKeywords: ["aushub rechner m3 tonnen","baugrube aushubvolumen auflockerungsfaktor","erdarbeiten lkw fahrten rechner","erde ausheben gewicht berechnen"],
    inputs: [
          {
                "id": "pitLength",
                "label": "Grubenlänge",
                "type": "number",
                "defaultValue": 10,
                "min": 1,
                "max": 100,
                "step": 0.5,
                "unit": "m"
          },
          {
                "id": "pitWidth",
                "label": "Grubenbreite",
                "type": "number",
                "defaultValue": 8,
                "min": 1,
                "max": 100,
                "step": 0.5,
                "unit": "m"
          },
          {
                "id": "pitDepth",
                "label": "Aushubtiefe",
                "type": "number",
                "defaultValue": 1.5,
                "min": 0.2,
                "max": 10,
                "step": 0.1,
                "unit": "m"
          },
          {
                "id": "soilType",
                "label": "Bodenart & Auflockerung",
                "type": "select",
                "defaultValue": "loam",
                "options": [
                      {
                            "value": "sand",
                            "label": "Sand / Kies (Faktor 1,15, Dichte 1,7 t/m³ fest)"
                      },
                      {
                            "value": "loam",
                            "label": "Lehm / Mutterboden (Faktor 1,25, Dichte 1,8 t/m³ fest)"
                      },
                      {
                            "value": "clay",
                            "label": "Ton / bindiger Boden (Faktor 1,35, Dichte 1,9 t/m³ fest)"
                      }
                ]
          },
          {
                "id": "truckCapacity",
                "label": "LKW-Ladekapazität (4-Achser / Sattelkipper)",
                "type": "select",
                "defaultValue": "18",
                "options": [
                      {
                            "value": "14",
                            "label": "3-Achser Kipper (ca. 14 t)"
                      },
                      {
                            "value": "18",
                            "label": "4-Achser Kipper (ca. 18 t)"
                      },
                      {
                            "value": "25",
                            "label": "Sattelzug (ca. 25 t)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const l = Number(inputs.pitLength) || 0;
      const w = Number(inputs.pitWidth) || 0;
      const d = Number(inputs.pitDepth) || 0;
      const solidVolume = l * w * d;
      
      let factor = 1.25;
      let solidDensity = 1.8;
      if (inputs.soilType === 'sand') { factor = 1.15; solidDensity = 1.7; }
      else if (inputs.soilType === 'clay') { factor = 1.35; solidDensity = 1.9; }
      
      const looseVolume = solidVolume * factor;
      const totalTonnes = solidVolume * solidDensity;
      const truckCap = Number(inputs.truckCapacity) || 18;
      const truckLoads = Math.ceil(totalTonnes / truckCap);
      
      return {
        primary: { id: 'looseVolume', label: 'Gelockertes Aushubvolumen (Transportvolumen)', value: looseVolume, formattedValue: formatNumber(looseVolume, 1) + ' m³', highlight: true },
        secondary: [
          { id: 'solidVolume', label: 'Festmaß in der Grube', value: solidVolume, formattedValue: formatNumber(solidVolume, 1) + ' m³' },
          { id: 'tonnes', label: 'Gesamtgewicht des Erdreichs', value: totalTonnes, formattedValue: formatNumber(totalTonnes, 1) + ' Tonnen' },
          { id: 'trucks', label: 'Benötigte LKW-Ladungen (' + truckCap + ' t)', value: truckLoads, formattedValue: truckLoads + ' Fahrten' },
        ],
        summaryText: 'Aus ' + formatNumber(solidVolume, 1) + ' m³ festem Boden entstehen durch Auflockerung ca. ' + formatNumber(looseVolume, 1) + ' m³ loser Aushub (' + formatNumber(totalTonnes, 1) + ' Tonnen, ca. ' + truckLoads + ' LKW-Fahrten).',
      };
    },
    formula: "Loses Volumen = Festvolumen (L × B × T) × Auflockerungsfaktor; Tonnen = Festvolumen × Dichte",
    formulaExplanation: "Beim Ausgraben lockert sich Erdreich auf und vergrößert sein Volumen um 15 % bis 35 %. Dieser Wert ist entscheidend für die Container- und LKW-Disposition.",
    workedExample: {
          "title": "Beispiel: Poolgrube 8 m × 4 m × 1,5 m in Lehmboden",
          "inputValues": [
                {
                      "label": "Größe",
                      "value": "8 m × 4 m × 1,5 m"
                },
                {
                      "label": "Boden",
                      "value": "Lehm (Faktor 1,25, 1,8 t/m³)"
                }
          ],
          "steps": [
                "Festmaß = 8 × 4 × 1,5 = 48 m³",
                "Loses Maß = 48 × 1,25 = 60 m³",
                "Gewicht = 48 × 1,8 t = 86,4 t",
                "LKW (18 t) = 86,4 / 18 = 5 LKW-Fahrten"
          ],
          "result": "60 m³ loser Aushub (86,4 t, 5 LKW)"
    },
    faqs: [
          {
                "question": "Was kostet die Entsorgung von Erdaushub?",
                "answer": "Unbelasteter Erdaushub (Bodenklasse Z0) kostet je nach Region und Deponie etwa 15 bis 35 Euro pro Tonne plus Frachtkosten."
          },
          {
                "question": "Muss bei der Baugrube eine Böschung eingeplant werden?",
                "answer": "Ja, nach DIN 4124 müssen Gruben ab 1,25 m Tiefe abgeböscht (Winkel meist 45° bis 60°) oder verbaut werden, was das Aushubvolumen zusätzlich vergrößert."
          }
    ],
    relatedSlugs: ["betonrechner","fundament-rechner","pflastersteine-rechner"],
  },
  {
    id: "pflastersteine-rechner",
    slug: "pflastersteine-rechner",
    name: "Pflasterstein-Rechner (Bedarf nach Fläche, Fugen & Bettungssplitt)",
    shortName: "Pflasterstein-Rechner",
    category: "bauen-renovieren",
    subcategory: "Garten & Außenanlagen",
    metaTitle: "Pflastersteine Rechner – Steinbedarf, Quadratmeter & Bettungssplitt",
    metaDescription: "Berechnen Sie die benötigte Anzahl Pflastersteine, Fläche in m² mit Verschnitt (5-10 %) und die Menge an Splitt/Sand für das Pflasterbett.",
    h1: "Pflastersteine Rechner – Pflastersteine & Bettungssplitt berechnen",
    shortDescription: "Ermittelt Steinanzahl und Splittmenge für Hof, Einfahrt oder Terrasse.",
    searchKeywords: ["pflastersteine rechner quadratmeter","pflaster bedarf berechnen einfahrt terrasse","splittbett dicke menge berechnen","pflaster verschnitt prozent"],
    inputs: [
          {
                "id": "area",
                "label": "Zu pflasternde Fläche",
                "type": "number",
                "defaultValue": 40,
                "min": 1,
                "max": 1000,
                "step": 1,
                "unit": "m²"
          },
          {
                "id": "stoneFormat",
                "label": "Pflasterstein-Format (Länge × Breite)",
                "type": "select",
                "defaultValue": "20x10",
                "options": [
                      {
                            "value": "20x10",
                            "label": "Rechteckpflaster 20 × 10 cm (50 Stk./m²)"
                      },
                      {
                            "value": "20x20",
                            "label": "Quadratpflaster 20 × 20 cm (25 Stk./m²)"
                      },
                      {
                            "value": "30x20",
                            "label": "Großformat 30 × 20 cm (16,7 Stk./m²)"
                      },
                      {
                            "value": "10x10",
                            "label": "Kleinpflaster 10 × 10 cm (100 Stk./m²)"
                      }
                ]
          },
          {
                "id": "beddingDepth",
                "label": "Dicke des Splittbetts",
                "type": "number",
                "defaultValue": 4,
                "min": 3,
                "max": 6,
                "step": 0.5,
                "unit": "cm"
          },
          {
                "id": "waste",
                "label": "Verschnitt durch Zuschneiden",
                "type": "number",
                "defaultValue": 8,
                "min": 0,
                "max": 20,
                "step": 1,
                "unit": "%"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const a = Number(inputs.area) || 0;
      const waste = 1 + ((Number(inputs.waste) || 0) / 100);
      const totalAreaWithWaste = a * waste;
      
      let stonesPerM2 = 50;
      if (inputs.stoneFormat === '20x20') stonesPerM2 = 25;
      else if (inputs.stoneFormat === '30x20') stonesPerM2 = 16.7;
      else if (inputs.stoneFormat === '10x10') stonesPerM2 = 100;
      
      const totalStones = Math.ceil(totalAreaWithWaste * stonesPerM2);
      const bedM3 = a * (Number(inputs.beddingDepth) / 100);
      const gritTonnes = bedM3 * 1.6; // Dichte Brechsand/Splitt ca. 1.6 t/m³
      
      return {
        primary: { id: 'stones', label: 'Benötigte Pflastersteine', value: totalStones, formattedValue: totalStones + ' Stück (' + formatNumber(totalAreaWithWaste, 1) + ' m²)', highlight: true },
        secondary: [
          { id: 'gritTonnes', label: 'Bettungssplitt (2/5 mm Körnung)', value: gritTonnes, formattedValue: formatNumber(gritTonnes, 2) + ' Tonnen (' + formatNumber(bedM3, 2) + ' m³)' },
          { id: 'effectiveArea', label: 'Bestellfläche inkl. Verschnitt', value: totalAreaWithWaste, formattedValue: formatNumber(totalAreaWithWaste, 2) + ' m²' },
        ],
        summaryText: 'Für ' + a + ' m² Fläche benötigen Sie rund ' + totalStones + ' Pflastersteine sowie ca. ' + formatNumber(gritTonnes, 2) + ' Tonnen Bettungssplitt.',
      };
    },
    formula: "Steine = Fläche (m²) × Steine/m² × Verschnittfaktor; Splitt = Fläche × Schichthöhe × Dichte (1,6 t/m³)",
    formulaExplanation: "Bei diagonal verlegtem Pflaster oder vielen Kurvenkanten empfiehlt sich ein Verschnittzuschlag von 10 % bis 12 % anstelle von 5 % bis 8 % bei geradem Verband.",
    workedExample: {
          "title": "Beispiel: 40 m² Hofeinfahrt mit Rechteckpflaster 20×10 cm",
          "inputValues": [
                {
                      "label": "Fläche",
                      "value": "40 m²"
                },
                {
                      "label": "Format",
                      "value": "20 × 10 cm (50 Stk./m²)"
                },
                {
                      "label": "Verschnitt",
                      "value": "8 %"
                }
          ],
          "steps": [
                "Fläche mit Verschnitt = 40 × 1,08 = 43,2 m²",
                "Steine = 43,2 × 50 = 2.160 Stück",
                "Splitt (4 cm) = 40 × 0,04 × 1,6 = 2,56 Tonnen"
          ],
          "result": "2.160 Pflastersteine und 2,56 t Splitt"
    },
    faqs: [
          {
                "question": "Welcher Splitt eignet sich am besten als Pflasterbett?",
                "answer": "Optimal ist gewaschener Edelsplitt der Körnung 2/5 mm oder Brechsand-Splitt-Gemisch 0/5 mm in einer gleichmäßigen Dicke von 3 bis 5 cm."
          },
          {
                "question": "Wie stabil muss der Unterbau für eine PKW-Einfahrt sein?",
                "answer": "Für PKW-Befahrung sind 20 bis 30 cm Schotter-Tragschicht (Körnung 0/32 mm Frostschutz), lagenweise verdichtet, zwingend vorgeschrieben."
          }
    ],
    relatedSlugs: ["kies-splitt-rechner","aushub-erdarbeiten-rechner","bodenbelag-rechner"],
  },
  {
    id: "trockenbau-gipskarton-rechner",
    slug: "trockenbau-gipskarton-rechner",
    name: "Trockenbau-Gipskarton-Rechner (Platten, Profile & Schrauben)",
    shortName: "Trockenbau-Rechner",
    category: "bauen-renovieren",
    subcategory: "Ausbau & Wand",
    metaTitle: "Trockenbau Gipskarton Rechner – Platten, CW/UW-Profile & Schrauben",
    metaDescription: "Berechnen Sie den Materialbedarf für Trockenbauwände: Gipskartonplatten (2000/2600 × 600/1250 mm), Ständerprofile (CW/UW), Schnellbauschrauben und Spachtelmasse.",
    h1: "Trockenbau Rechner – Gipskartonplatten, Ständerwerk & Zubehör",
    shortDescription: "Berechnet Gipskartonplatten, CW/UW-Profile, Schrauben und Spachtelmasse.",
    searchKeywords: ["trockenbau rechner gipskarton","staenderwerk cw uw profile berechnen","gipskartonplatten stueckzahl m2","schnellbauschrauben bedarf trockenbau"],
    inputs: [
          {
                "id": "wallLength",
                "label": "Wandlänge",
                "type": "number",
                "defaultValue": 5,
                "min": 1,
                "max": 50,
                "step": 0.2,
                "unit": "m"
          },
          {
                "id": "wallHeight",
                "label": "Wandhöhe",
                "type": "number",
                "defaultValue": 2.6,
                "min": 1.5,
                "max": 5,
                "step": 0.05,
                "unit": "m"
          },
          {
                "id": "cladding",
                "label": "Beplankung",
                "type": "select",
                "defaultValue": "double",
                "options": [
                      {
                            "value": "single",
                            "label": "Einfach beplankt (1 Lage je Seite, 2 m² Platten je m² Wand)"
                      },
                      {
                            "value": "double",
                            "label": "Doppelt beplankt (2 Lagen je Seite, Schallschutz, 4 m² je m² Wand)"
                      }
                ]
          },
          {
                "id": "boardSize",
                "label": "Plattenformat",
                "type": "select",
                "defaultValue": "2600x600",
                "options": [
                      {
                            "value": "2600x600",
                            "label": "Einmannplatte 2.600 × 600 mm (1,56 m²)"
                      },
                      {
                            "value": "2000x600",
                            "label": "Kompaktplatte 2.000 × 600 mm (1,20 m²)"
                      },
                      {
                            "value": "2500x1250",
                            "label": "Großformat 2.500 × 1.250 mm (3,125 m²)"
                      }
                ]
          },
          {
                "id": "waste",
                "label": "Verschnittzuschlag",
                "type": "number",
                "defaultValue": 10,
                "min": 0,
                "max": 20,
                "step": 1,
                "unit": "%"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const l = Number(inputs.wallLength) || 0;
      const h = Number(inputs.wallHeight) || 0;
      const wallArea = l * h;
      const waste = 1 + ((Number(inputs.waste) || 0) / 100);
      const multiplier = inputs.cladding === 'double' ? 4 : 2;
      
      let boardM2 = 1.56;
      if (inputs.boardSize === '2000x600') boardM2 = 1.20;
      else if (inputs.boardSize === '2500x1250') boardM2 = 3.125;
      
      const totalPlatesArea = wallArea * multiplier * waste;
      const platesCount = Math.ceil(totalPlatesArea / boardM2);
      
      // Ständerwerk:
      // UW-Profile (Boden & Decke): 2 * Wandlänge
      const uwMeters = Math.ceil(l * 2 * 1.05);
      // CW-Profile (Ständer alle 62.5 cm + Anfang/Ende):
      const cwCount = Math.ceil(l / 0.625) + 1;
      const cwMeters = Math.ceil(cwCount * h * 1.05);
      
      // Schrauben: ca. 15-20 Stk./m² Plattenfläche
      const screwsCount = Math.ceil(totalPlatesArea * 18);
      // Spachtelmasse ca. 0.8 kg/m² Wandfläche (einfach) oder 1.3 kg/m² (doppelt)
      const fillerKg = Math.ceil(wallArea * (inputs.cladding === 'double' ? 1.3 : 0.8));
      
      return {
        primary: { id: 'plates', label: 'Gipskartonplatten', value: platesCount, formattedValue: platesCount + ' Platten (' + formatNumber(totalPlatesArea, 1) + ' m²)', highlight: true },
        secondary: [
          { id: 'cwProfiles', label: 'CW-Ständerprofile vertikal', value: cwCount, formattedValue: cwCount + ' Stück (' + cwMeters + ' lfd. Meter)' },
          { id: 'uwProfiles', label: 'UW-Rahmenprofile (Boden/Decke)', value: uwMeters, formattedValue: uwMeters + ' lfd. Meter' },
          { id: 'screws', label: 'Schnellbauschrauben', value: screwsCount, formattedValue: 'ca. ' + screwsCount + ' Stück' },
          { id: 'filler', label: 'Fugenspachtel Masse', value: fillerKg, formattedValue: 'ca. ' + fillerKg + ' kg' },
        ],
        summaryText: 'Für ' + formatNumber(wallArea, 1) + ' m² Trockenbauwand benötigen Sie ' + platesCount + ' Gipskartonplatten, ' + cwCount + ' CW-Profile, ' + uwMeters + ' m UW-Profile und ca. ' + fillerKg + ' kg Spachtel.',
      };
    },
    formula: "Platten = Wandfläche × Lagenfaktor (2 oder 4) × Verschnitt / Plattenfläche; CW-Profile = (Länge / 0,625 m) + 1",
    formulaExplanation: "Der Standard-Achsabstand für Ständerprofile beträgt 62,5 cm (passend zur Plattenbreite von 60 cm bzw. 125 cm). Eine doppelte Beplankung verbessert Brand- und Schallschutz erheblich.",
    workedExample: {
          "title": "Beispiel: 5 m × 2,6 m Trennwand, doppelt beplankt mit 2,6×0,6m Platten",
          "inputValues": [
                {
                      "label": "Wandmaß",
                      "value": "5 m × 2,6 m (13 m²)"
                },
                {
                      "label": "Beplankung",
                      "value": "Doppelt (4-fach)"
                },
                {
                      "label": "Plattengröße",
                      "value": "1,56 m²"
                }
          ],
          "steps": [
                "Plattenfläche = 13 × 4 × 1,10 = 57,2 m²",
                "Plattenanzahl = 57,2 / 1,56 = 37 Platten",
                "CW-Profile = (5 / 0,625) + 1 = 9 Profile à 2,60 m"
          ],
          "result": "37 Gipskartonplatten und 9 CW-Ständer"
    },
    faqs: [
          {
                "question": "Welche Platten werden in Feuchträumen verwendet?",
                "answer": "Im Badezimmer müssen grün imprägnierte Gipskartonplatten (Typ GKBI bzw. H2 nach DIN EN 520) verwendet werden, um Schimmel- und Feuchteschäden vorzubeugen."
          },
          {
                "question": "Warum versetzt man die Fugen bei doppelter Beplankung?",
                "answer": "Durch versetzte Fugen (mindestens 40 cm Versatz) wird Rissbildung verhindert und die Stabilität sowie der Schallschutz der Konstruktion maximiert."
          }
    ],
    relatedSlugs: ["farbmengen-rechner","daemmung-u-wert-rechner","bausteine-mauerwerk-rechner"],
  },
  {
    id: "fundament-rechner",
    slug: "fundament-rechner",
    name: "Fundament-Beton-Rechner (Streifen-, Punkt- & Plattenfundament Beton)",
    shortName: "Fundament-Beton-Rechner",
    category: "bauen-renovieren",
    subcategory: "Rohbau & Boden",
    metaTitle: "Fundament Rechner – Betonbedarf für Streifen-, Punkt- & Plattenfundament",
    metaDescription: "Berechnen Sie das Betonvolumen in m³ und Tonnen für Streifenfundament (Gartenmauer/Garage), Punktfundament (Carport/Zaun) und Bodenplatte.",
    h1: "Fundament Rechner – Betonmenge & Frosttiefe berechnen",
    shortDescription: "Ermittelt das Betonvolumen für Streifen-, Punkt- und Plattenfundamente.",
    searchKeywords: ["fundament rechner beton m3","streifenfundament betonmenge berechnen","punktfundament carport zaun volumen","frostfreie tiefe fundament 80 cm"],
    inputs: [
          {
                "id": "fundamentType",
                "label": "Fundamentart",
                "type": "select",
                "defaultValue": "strip",
                "options": [
                      {
                            "value": "strip",
                            "label": "Streifenfundament (z. B. Gartenmauer, Garage)"
                      },
                      {
                            "value": "point",
                            "label": "Punktfundament (z. B. Pfosten, Carport, Spielturm)"
                      },
                      {
                            "value": "slab",
                            "label": "Fundamentplatte / Bodenplatte (z. B. Gartenhaus, Schuppen)"
                      }
                ]
          },
          {
                "id": "dim1",
                "label": "Länge / Anzahl Punkte",
                "type": "number",
                "defaultValue": 10,
                "min": 1,
                "max": 100,
                "step": 0.5,
                "unit": "m bzw. Stk."
          },
          {
                "id": "dim2",
                "label": "Breite / Durchmesser",
                "type": "number",
                "defaultValue": 0.3,
                "min": 0.1,
                "max": 20,
                "step": 0.05,
                "unit": "m"
          },
          {
                "id": "depth",
                "label": "Fundamenttiefe (Frosttiefe min. 0,80 m empfohlen)",
                "type": "number",
                "defaultValue": 0.8,
                "min": 0.2,
                "max": 2,
                "step": 0.05,
                "unit": "m"
          },
          {
                "id": "waste",
                "label": "Mehraushub / Schalungsverlust",
                "type": "number",
                "defaultValue": 10,
                "min": 0,
                "max": 20,
                "step": 1,
                "unit": "%"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const type = inputs.fundamentType;
      const d1 = Number(inputs.dim1) || 0;
      const d2 = Number(inputs.dim2) || 0;
      const depth = Number(inputs.depth) || 0;
      const waste = 1 + ((Number(inputs.waste) || 0) / 100);
      
      let m3 = 0;
      if (type === 'strip') {
        // Länge * Breite * Tiefe
        m3 = d1 * d2 * depth * waste;
      } else if (type === 'point') {
        // Anzahl * (Breite * Breite * Tiefe)
        m3 = d1 * (d2 * d2 * depth) * waste;
      } else {
        // Platte: Länge * Breite * Dicke
        m3 = d1 * d2 * depth * waste;
      }
      
      const tonnes = m3 * 2.35; // Frischbetondichte ca. 2.350 kg/m³
      const sacks25kg = Math.ceil((m3 * 2100) / 25);
      
      return {
        primary: { id: 'volume', label: 'Betonvolumen (Einbaumaß)', value: m3, formattedValue: formatNumber(m3, 2) + ' m³', highlight: true },
        secondary: [
          { id: 'weight', label: 'Gesamtgewicht Frischbeton', value: tonnes, formattedValue: formatNumber(tonnes, 2) + ' Tonnen' },
          { id: 'sacks', label: 'Trockenbeton in 25-kg-Säcken', value: sacks25kg, formattedValue: sacks25kg + ' Säcke' },
          { id: 'deliveryHint', label: 'Empfohlene Lieferform', value: 0, formattedValue: m3 >= 1.5 ? 'Transportbeton (Fahrmischer)' : 'Sackware zum Selbstanmischen' },
        ],
        summaryText: 'Für Ihr ' + (type === 'strip' ? 'Streifenfundament' : type === 'point' ? 'Punktfundament' : 'Plattenfundament') + ' benötigen Sie ca. ' + formatNumber(m3, 2) + ' m³ Beton (' + formatNumber(tonnes, 2) + ' t).',
      };
    },
    formula: "Volumen = Querschnittsfläche × Länge (bzw. Tiefe) × Sicherheitszuschlag",
    formulaExplanation: "In Deutschland gilt eine Tiefe von mindestens 80 cm als frostsicher, damit gefrierendes Bodenwasser das Fundament im Winter nicht anhebt und Risse verursacht.",
    workedExample: {
          "title": "Beispiel: 10 m Streifenfundament, 30 cm breit, 80 cm tief",
          "inputValues": [
                {
                      "label": "Länge",
                      "value": "10 m"
                },
                {
                      "label": "Breite",
                      "value": "0,3 m"
                },
                {
                      "label": "Tiefe",
                      "value": "0,8 m (frostfrei)"
                }
          ],
          "steps": [
                "Volumen = 10 × 0,3 × 0,8 = 2,4 m³",
                "Mit 10 % Toleranz: 2,4 × 1,1 = 2,64 m³ Beton",
                "Gewicht = 2,64 × 2,35 = 6,2 Tonnen"
          ],
          "result": "2,64 m³ Beton (Transportbeton empfohlen)"
    },
    faqs: [
          {
                "question": "Ab welchem Betonvolumen lohnt sich ein Fahrmischer?",
                "answer": "Ab etwa 1,0 bis 1,5 m³ ist Transportbeton meist günstiger, zeitsparender und qualitativ hochwertiger als das mühsame Anmischen von 80+ Säcken Trockenbeton von Hand."
          },
          {
                "question": "Welche Betonklasse benötigt man für ein Außenfundament?",
                "answer": "Für Außenfundamente mit Frostgefahr empfiehlt sich mindestens Beton der Festigkeitsklasse C20/25 oder C25/30 mit Expositionsklasse XF1."
          }
    ],
    relatedSlugs: ["betonrechner","estrich-rechner","aushub-erdarbeiten-rechner"],
  },
  {
    id: "schalungssteine-rechner",
    slug: "schalungssteine-rechner",
    name: "Schalungsstein-Rechner (Steinanzahl, Füllbeton & Bewehrungsstahl)",
    shortName: "Schalungsstein-Rechner",
    category: "bauen-renovieren",
    subcategory: "Rohbau & Boden",
    metaTitle: "Schalungssteine Rechner – Steine, Füllbeton & Bewehrung berechnen",
    metaDescription: "Berechnen Sie die Anzahl Schalungssteine (17,5er, 24er, 30er), das Verfüllbetonvolumen in m³ und den Bedarf an Baustahl nach Wandmaßen.",
    h1: "Schalungssteine Rechner – Steine, Füllbeton & Baustahl ermitteln",
    shortDescription: "Berechnet Schalungssteine und Verfüllbeton für Stützmauern und Poolwände.",
    searchKeywords: ["schalungssteine rechner fuellbeton","betonschalungssteine menge stuetzmauer","fuellbeton m3 schalungsstein 24er","bewehrungsstahl schalungsstein"],
    inputs: [
          {
                "id": "wallLength",
                "label": "Mauerlänge",
                "type": "number",
                "defaultValue": 8,
                "min": 1,
                "max": 100,
                "step": 0.5,
                "unit": "m"
          },
          {
                "id": "wallHeight",
                "label": "Mauerhöhe",
                "type": "number",
                "defaultValue": 1.5,
                "min": 0.25,
                "max": 5,
                "step": 0.25,
                "unit": "m"
          },
          {
                "id": "stoneWidth",
                "label": "Steinbreite (Wandstärke)",
                "type": "select",
                "defaultValue": "24",
                "options": [
                      {
                            "value": "17.5",
                            "label": "17,5 cm Breite (ca. 100 l Füllbeton / m²)"
                      },
                      {
                            "value": "24",
                            "label": "24,0 cm Breite (ca. 145 l Füllbeton / m²)"
                      },
                      {
                            "value": "30",
                            "label": "30,0 cm Breite (ca. 195 l Füllbeton / m²)"
                      },
                      {
                            "value": "36.5",
                            "label": "36,5 cm Breite (ca. 240 l Füllbeton / m²)"
                      }
                ]
          },
          {
                "id": "waste",
                "label": "Verschnitt für Zuschnitte",
                "type": "number",
                "defaultValue": 5,
                "min": 0,
                "max": 15,
                "step": 1,
                "unit": "%"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const l = Number(inputs.wallLength) || 0;
      const h = Number(inputs.wallHeight) || 0;
      const wallArea = l * h;
      const waste = 1 + ((Number(inputs.waste) || 0) / 100);
      
      // Standardmaß Schalungsstein: 50 cm lang, 25 cm hoch -> 8 Steine pro m²
      const stonesCount = Math.ceil(wallArea * 8 * waste);
      
      let concretePerM2 = 145; // Liter
      if (inputs.stoneWidth === '17.5') concretePerM2 = 100;
      else if (inputs.stoneWidth === '30') concretePerM2 = 195;
      else if (inputs.stoneWidth === '36.5') concretePerM2 = 240;
      
      const concreteM3 = (wallArea * (concretePerM2 / 1000)) * waste;
      // Bewehrungsstahl: 2 horizontale Stäbe je Schicht (alle 25 cm) + Vertikalstäbe alle 25 cm
      const layers = Math.ceil(h / 0.25);
      const horizontalRebarM = layers * 2 * l;
      const verticalRebarM = Math.ceil(l / 0.25) * h;
      const totalRebarMeters = Math.ceil((horizontalRebarM + verticalRebarM) * 1.1);
      
      return {
        primary: { id: 'stones', label: 'Benötigte Schalungssteine (50×25 cm)', value: stonesCount, formattedValue: stonesCount + ' Stück', highlight: true },
        secondary: [
          { id: 'concreteM3', label: 'Verfüllbeton Gesamtvolumen', value: concreteM3, formattedValue: formatNumber(concreteM3, 2) + ' m³ (' + Math.ceil(concreteM3 * 2.3) + ' t)' },
          { id: 'rebar', label: 'Bewehrungsstahl (z. B. Torstahl Ø 10 mm)', value: totalRebarMeters, formattedValue: 'ca. ' + totalRebarMeters + ' lfd. Meter' },
          { id: 'wallArea', label: 'Ansichtsfläche der Mauer', value: wallArea, formattedValue: formatNumber(wallArea, 2) + ' m²' },
        ],
        summaryText: 'Für ' + formatNumber(wallArea, 2) + ' m² Wand benötigen Sie ' + stonesCount + ' Schalungssteine, ca. ' + formatNumber(concreteM3, 2) + ' m³ Verfüllbeton und rund ' + totalRebarMeters + ' m Bewehrungsstahl.',
      };
    },
    formula: "Steine = Wandfläche × 8 Stk./m²; Füllbeton = Wandfläche × Betonbedarf/m² nach Steinbreite",
    formulaExplanation: "Schalungssteine werden trocken im Verband aufgesetzt, mit Baustahl bewehrt und anschließend kammerweise mit flüssigem Beton verfüllt.",
    workedExample: {
          "title": "Beispiel: 8 m × 1,5 m Stützmauer mit 24er Schalungssteinen",
          "inputValues": [
                {
                      "label": "Wandmaß",
                      "value": "8 m × 1,5 m (12 m²)"
                },
                {
                      "label": "Steinbreite",
                      "value": "24 cm (145 l/m²)"
                }
          ],
          "steps": [
                "Steine: 12 m² × 8 × 1,05 = 101 Steine",
                "Füllbeton: 12 m² × 0,145 m³ × 1,05 = 1,83 m³"
          ],
          "result": "101 Schalungssteine und 1,83 m³ Verfüllbeton"
    },
    faqs: [
          {
                "question": "Wie hoch darf man Schalungssteine auf einmal verfüllen?",
                "answer": "In der Regel sollten nicht mehr als 3 bis 4 Steinreihen (ca. 75 bis 100 cm Höhe) in einem Durchgang mit Beton verfüllt und verdichtet werden, um ein Bersten der Steine zu vermeiden."
          },
          {
                "question": "Braucht eine Mauer aus Schalungssteinen ein Fundament?",
                "answer": "Ja, zwingend ein frostsicheres Beton-Streifenfundament (mindestens 80 cm tief), aus dem Anschlussbewehrungseisen in die Schalungssteine ragen."
          }
    ],
    relatedSlugs: ["betonrechner","fundament-rechner","bausteine-mauerwerk-rechner"],
  },
  {
    id: "fassadenfarbe-rechner",
    slug: "fassadenfarbe-rechner",
    name: "Fassadenfarben-Rechner (Farbbedarf in Litern nach m² & Untergrund)",
    shortName: "Fassadenfarben-Rechner",
    category: "bauen-renovieren",
    subcategory: "Dach & Fassade",
    metaTitle: "Fassadenfarbe Rechner – Farbbedarf in Litern für Hausfassade berechnen",
    metaDescription: "Berechnen Sie den Bedarf an Fassadenfarbe in Litern für 1 oder 2 Anstriche nach Hausmaßen, Fensterabzügen und Untergrund (Glattputz, Rauputz, Klinker).",
    h1: "Fassadenfarbe Rechner – Farbmenge für den Außenanstrich ermitteln",
    shortDescription: "Berechnet den Fassadenfarben-Bedarf nach Wandfläche und Putzart.",
    searchKeywords: ["fassadenfarbe rechner liter","hauswand streichen farbmenge berechnen","farbverbrauch rauputz liter m2","fassadenanstrich liter eimer"],
    inputs: [
          {
                "id": "perimeter",
                "label": "Hausumfang (Summe aller Fassadenseiten)",
                "type": "number",
                "defaultValue": 36,
                "min": 10,
                "max": 200,
                "step": 1,
                "unit": "m"
          },
          {
                "id": "wallHeight",
                "label": "Durchschnittliche Fassadenhöhe",
                "type": "number",
                "defaultValue": 6,
                "min": 2,
                "max": 20,
                "step": 0.2,
                "unit": "m"
          },
          {
                "id": "openingsArea",
                "label": "Abzug für Fenster, Türen & Tore",
                "type": "number",
                "defaultValue": 30,
                "min": 0,
                "max": 150,
                "step": 1,
                "unit": "m²"
          },
          {
                "id": "surface",
                "label": "Untergrund & Putzstruktur",
                "type": "select",
                "defaultValue": "rough",
                "options": [
                      {
                            "value": "smooth",
                            "label": "Glatter Putz / Voranstrich vorhanden (ca. 160 ml/m² je Anstrich)"
                      },
                      {
                            "value": "medium",
                            "label": "Mittlerer Scheibenputz 2 mm (ca. 220 ml/m² je Anstrich)"
                      },
                      {
                            "value": "rough",
                            "label": "Grober Reibeputz / stark saugend (ca. 300 ml/m² je Anstrich)"
                      }
                ]
          },
          {
                "id": "coats",
                "label": "Anzahl Anstriche",
                "type": "select",
                "defaultValue": "2",
                "options": [
                      {
                            "value": "1",
                            "label": "1 Anstrich (nur Auffrischung)"
                      },
                      {
                            "value": "2",
                            "label": "2 Anstriche (Grund- & Deckanstrich – empfohlen)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const p = Number(inputs.perimeter) || 0;
      const h = Number(inputs.wallHeight) || 0;
      const gross = p * h;
      const open = Number(inputs.openingsArea) || 0;
      const netArea = Math.max(0, gross - open);
      
      let mlPerM2 = 220;
      if (inputs.surface === 'smooth') mlPerM2 = 160;
      else if (inputs.surface === 'rough') mlPerM2 = 300;
      
      const coats = Number(inputs.coats) || 2;
      const totalLiters = (netArea * (mlPerM2 / 1000) * coats) * 1.05; // 5 % Reserve
      const buckets10l = Math.ceil(totalLiters / 10);
      const buckets15l = Math.ceil(totalLiters / 15);
      
      return {
        primary: { id: 'liters', label: 'Benötigte Fassadenfarbe', value: totalLiters, formattedValue: formatNumber(totalLiters, 1) + ' Liter', highlight: true },
        secondary: [
          { id: 'buckets10l', label: 'Farbeimer (10-Liter-Gebinde)', value: buckets10l, formattedValue: buckets10l + ' Eimer' },
          { id: 'buckets15l', label: 'Alternativ: 15-Liter-Gebinde', value: buckets15l, formattedValue: buckets15l + ' Eimer' },
          { id: 'netArea', label: 'Reine Anstrichfläche (Netto)', value: netArea, formattedValue: formatNumber(netArea, 1) + ' m²' },
        ],
        summaryText: 'Für ' + formatNumber(netArea, 1) + ' m² Fassadenfläche bei ' + coats + ' Anstrichen benötigen Sie rund ' + formatNumber(totalLiters, 1) + ' Liter Fassadenfarbe (' + buckets10l + ' Eimer à 10 Liter).',
      };
    },
    formula: "Farbe (Liter) = Nettofläche (m²) × Verbrauch (l/m²) × Anzahl Anstriche × 1,05",
    formulaExplanation: "Rauputz hat durch seine Kornstruktur eine bis zu 50 % größere reale Oberfläche als glatte Wände, was den Farbbedarf spürbar steigert.",
    workedExample: {
          "title": "Beispiel: 186 m² Fassade mit 2 mm Scheibenputz (2 Anstriche)",
          "inputValues": [
                {
                      "label": "Nettofläche",
                      "value": "186 m²"
                },
                {
                      "label": "Untergrund",
                      "value": "Mittlerer Putz (0,22 l/m²)"
                },
                {
                      "label": "Anstriche",
                      "value": "2"
                }
          ],
          "steps": [
                "Pro Anstrich = 186 × 0,22 = 40,9 Liter",
                "Zwei Anstriche mit Puffer = 40,9 × 2 × 1,05 = 85,9 Liter"
          ],
          "result": "86 Liter Fassadenfarbe (9 Eimer à 10 l)"
    },
    faqs: [
          {
                "question": "Sollte man die Fassade vor dem Streichen grundieren?",
                "answer": "Ja, stark saugende oder sandende Putze müssen zwingend mit Tiefgrund behandelt werden. Das verfestigt den Untergrund und verhindert fleckige Farbtrocknung."
          },
          {
                "question": "Silikonharz- vs. Silikatfarbe für die Außenwand?",
                "answer": "Silikonharzfarbe ist stark wasserabweisend und schmutzresistent (Lotus-Effekt). Silikatfarbe verkieselt unlösbar mit mineralischem Putz und ist hoch atmungsaktiv."
          }
    ],
    relatedSlugs: ["farbmengen-rechner","daemmung-u-wert-rechner","dachflaeche-rechner"],
  },
  {
    id: "parkett-laminat-rechner",
    slug: "parkett-laminat-rechner",
    name: "Parkett- & Laminat-Rechner (Paketanzahl & Verschnitt nach Raummaß)",
    shortName: "Parkett & Laminat",
    category: "bauen-renovieren",
    subcategory: "Rohbau & Boden",
    metaTitle: "Parkett & Laminat Rechner – Pakete, Quadratmeter & Verschnitt berechnen",
    metaDescription: "Berechnen Sie den genauen Bedarf an Laminat, Parkett oder Klick-Vinyl: Quadratmeter, Paketanzahl, Verschnitt (5-15 %) und Sockelleisten in Metern.",
    h1: "Parkett & Laminat Rechner – Paketanzahl & Fußleisten ermitteln",
    shortDescription: "Ermittelt Quadratmeter, Pakete und Sockelleisten für Bodenbeläge.",
    searchKeywords: ["laminat rechner pakete m2","parkett bedarf berechnen verschnitt","sockelleisten meter berechnen","klick vinyl quadratmeter pakete"],
    inputs: [
          {
                "id": "roomLength",
                "label": "Raumlänge",
                "type": "number",
                "defaultValue": 5.5,
                "min": 1,
                "max": 50,
                "step": 0.1,
                "unit": "m"
          },
          {
                "id": "roomWidth",
                "label": "Raumbreite",
                "type": "number",
                "defaultValue": 4.2,
                "min": 1,
                "max": 50,
                "step": 0.1,
                "unit": "m"
          },
          {
                "id": "packSizeM2",
                "label": "Packungsinhalt in m² laut Hersteller",
                "type": "number",
                "defaultValue": 2.22,
                "min": 0.5,
                "max": 10,
                "step": 0.01,
                "unit": "m²"
          },
          {
                "id": "layingPattern",
                "label": "Verlegemuster & Verschnitt",
                "type": "select",
                "defaultValue": "straight",
                "options": [
                      {
                            "value": "straight",
                            "label": "Gerade Verlegung / wilder Verband (ca. 7 % Verschnitt)"
                      },
                      {
                            "value": "diagonal",
                            "label": "Diagonale Verlegung (ca. 12 % Verschnitt)"
                      },
                      {
                            "value": "herringbone",
                            "label": "Fischgrätmuster (ca. 15 % Verschnitt)"
                      }
                ]
          },
          {
                "id": "doorsCount",
                "label": "Anzahl Türen (Abzug für Sockelleisten)",
                "type": "number",
                "defaultValue": 1,
                "min": 0,
                "max": 10,
                "step": 1,
                "unit": "Stück"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const l = Number(inputs.roomLength) || 0;
      const w = Number(inputs.roomWidth) || 0;
      const netArea = l * w;
      
      let wastePercent = 7;
      if (inputs.layingPattern === 'diagonal') wastePercent = 12;
      else if (inputs.layingPattern === 'herringbone') wastePercent = 15;
      
      const orderArea = netArea * (1 + wastePercent / 100);
      const packM2 = Number(inputs.packSizeM2) || 2.22;
      const packs = Math.ceil(orderArea / packM2);
      const actualBoughtArea = packs * packM2;
      
      // Sockelleisten: Umfang abzüglich ca. 0.9 m je Tür
      const doors = Number(inputs.doorsCount) || 0;
      const perimeter = 2 * (l + w);
      const skirtingM = Math.max(0, perimeter - (doors * 0.9)) * 1.05; // 5 % Gehrungsschnitt-Puffer
      
      return {
        primary: { id: 'packs', label: 'Benötigte Pakete Bodenbelag', value: packs, formattedValue: packs + ' Pakete (' + formatNumber(actualBoughtArea, 2) + ' m²)', highlight: true },
        secondary: [
          { id: 'netArea', label: 'Reine Bodenfläche (Netto)', value: netArea, formattedValue: formatNumber(netArea, 2) + ' m²' },
          { id: 'orderArea', label: 'Mindest-Bedarfsfläche inkl. Verschnitt', value: orderArea, formattedValue: formatNumber(orderArea, 2) + ' m²' },
          { id: 'skirting', label: 'Sockelleisten (inkl. Gehrungsverschnitt)', value: skirtingM, formattedValue: formatNumber(skirtingM, 1) + ' lfd. Meter' },
        ],
        summaryText: 'Für ' + formatNumber(netArea, 2) + ' m² Wohnfläche benötigen Sie ' + packs + ' Pakete (' + formatNumber(actualBoughtArea, 2) + ' m²) sowie ca. ' + formatNumber(skirtingM, 1) + ' m Sockelleisten.',
      };
    },
    formula: "Pakete = ceil((Raumlänge × Raumbreite × (1 + Verschnitt/100)) / Packungsinhalt)",
    formulaExplanation: "Rundungsregel: Bei Bodenbelägen immer auf volle Pakete aufrunden, da angebrochene Dielen vom Verschnitt nicht immer wiederverwendet werden können.",
    workedExample: {
          "title": "Beispiel: 23,1 m² Wohnzimmer, Pakete à 2,22 m² (7 % Verschnitt)",
          "inputValues": [
                {
                      "label": "Raum",
                      "value": "5,5 m × 4,2 m (23,1 m²)"
                },
                {
                      "label": "Packung",
                      "value": "2,22 m²"
                }
          ],
          "steps": [
                "Bedarf = 23,1 × 1,07 = 24,717 m²",
                "Pakete = 24,717 / 2,22 = 11,13 -> 12 Pakete",
                "Gekauft: 12 × 2,22 = 26,64 m²"
          ],
          "result": "12 Pakete Laminat/Parkett"
    },
    faqs: [
          {
                "question": "Sollte man immer ein Paket Reserve aufbewahren?",
                "answer": "Ja, unbedingt 1 ungeöffnetes Paket aufheben! Falls nach Jahren ein Wasserschaden oder Kratzer entsteht, ist dieselbe Charge im Handel meist nicht mehr erhältlich."
          },
          {
                "question": "Braucht man eine Dampfsperre unter Laminat?",
                "answer": "Auf mineralischen Untergründen (wie Beton oder Estrich) ist eine PE-Folie als Dampfbremse unverzichtbar, um den Boden vor aufsteigender Restfeuchte zu schützen."
          }
    ],
    relatedSlugs: ["bodenbelag-rechner","estrich-rechner","farbmengen-rechner"],
  },
  {
    id: "tapetenrollen-rechner",
    slug: "tapetenrollen-rechner",
    name: "Tapeten-Bedarfsrechner (Euro-Rollen Bedarf nach Raumumfang & Rapport)",
    shortName: "Tapeten-Bedarfsrechner",
    category: "bauen-renovieren",
    subcategory: "Ausbau & Wand",
    metaTitle: "Tapeten Rechner – Rollenbedarf (Euro-Rolle 10,05 × 0,53 m) berechnen",
    metaDescription: "Berechnen Sie die benötigte Anzahl Tapetenrollen nach Raumumfang, Deckenhöhe, Fensterabzug und Musterversatz (Rapport) für Euro-Rollen.",
    h1: "Tapeten Rechner – Rollenanzahl für Euro-Normrollen ermitteln",
    shortDescription: "Berechnet die Anzahl Tapetenrollen nach Raumumfang und Rapport.",
    searchKeywords: ["tapeten rechner rollen bedarf","eurorolle tapete berechnen rapport","tapetenrollen anzahl raumumfang","mustertapete verschnitt berechnen"],
    inputs: [
          {
                "id": "perimeter",
                "label": "Raumumfang (Summe aller 4 Wände)",
                "type": "number",
                "defaultValue": 16,
                "min": 4,
                "max": 100,
                "step": 0.5,
                "unit": "m"
          },
          {
                "id": "roomHeight",
                "label": "Raumhöhe / Deckenhöhe",
                "type": "number",
                "defaultValue": 2.5,
                "min": 1.8,
                "max": 5,
                "step": 0.05,
                "unit": "m"
          },
          {
                "id": "patternRepeat",
                "label": "Musterversatz (Rapport)",
                "type": "select",
                "defaultValue": "0",
                "options": [
                      {
                            "value": "0",
                            "label": "Ansatzfrei / Uni-Tapete (kein Rapport, Verschnitt minimal)"
                      },
                      {
                            "value": "32",
                            "label": "Kleiner Rapport (z. B. 32 cm Versatz)"
                      },
                      {
                            "value": "64",
                            "label": "Großer Rapport (z. B. 64 cm Versatz)"
                      }
                ]
          },
          {
                "id": "openingsCount",
                "label": "Abzug für Türen & Fenster (in Standardbahnen à 53 cm)",
                "type": "number",
                "defaultValue": 3,
                "min": 0,
                "max": 15,
                "step": 1,
                "unit": "Bahnen"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const p = Number(inputs.perimeter) || 0;
      const h = Number(inputs.roomHeight) || 0;
      const rapport = (Number(inputs.patternRepeat) || 0) / 100;
      const openBahnen = Number(inputs.openingsCount) || 0;
      
      // Standard Euro-Rolle: 10,05 m lang, 0,53 m breit
      const rollLength = 10.05;
      const rollWidth = 0.53;
      
      // Gesamtanzahl benötigter Bahnen:
      const grossBahnen = Math.ceil(p / rollWidth);
      const netBahnen = Math.max(1, grossBahnen - openBahnen);
      
      // Schnitthöhe je Bahn (Deckenhöhe + 10 cm Puffer + Rapport)
      const cutLength = h + 0.10 + rapport;
      // Bahnen pro Rolle:
      const bahnenPerRoll = Math.floor(rollLength / cutLength) || 1;
      const rolls = Math.ceil(netBahnen / bahnenPerRoll);
      
      return {
        primary: { id: 'rolls', label: 'Benötigte Tapetenrollen (Euro-Rolle)', value: rolls, formattedValue: rolls + ' Rollen (10,05 × 0,53 m)', highlight: true },
        secondary: [
          { id: 'netBahnen', label: 'Anzahl zu klebender Bahnen', value: netBahnen, formattedValue: netBahnen + ' Bahnen' },
          { id: 'bahnenPerRoll', label: 'Verwertbare Bahnen pro Rolle', value: bahnenPerRoll, formattedValue: bahnenPerRoll + ' Bahnen/Rolle' },
          { id: 'pasteBoxes', label: 'Tapetenkleister (Pakete)', value: Math.ceil(rolls / 5), formattedValue: Math.ceil(rolls / 5) + ' Packung(en)' },
        ],
        summaryText: 'Für den Raum (Umfang ' + p + ' m, Höhe ' + h + ' m) benötigen Sie ' + netBahnen + ' Bahnen, was genau ' + rolls + ' Euro-Rollen Tapete entspricht.',
      };
    },
    formula: "Rollen = ceil(Bahnen / Bahnen je Rolle); Bahnen je Rolle = floor(10,05 m / (Raumhöhe + 0,10 m + Rapport))",
    formulaExplanation: "Bei Standard-Deckenhöhen von 2,40 m bis 2,50 m erhält man aus einer Euro-Rolle bei ansatzfreier Tapete exakt 3 bis 4 Bahnen.",
    workedExample: {
          "title": "Beispiel: 16 m Raumumfang, 2,50 m Höhe, ansatzfrei",
          "inputValues": [
                {
                      "label": "Umfang",
                      "value": "16 m"
                },
                {
                      "label": "Höhe",
                      "value": "2,50 m"
                },
                {
                      "label": "Rapport",
                      "value": "keiner"
                }
          ],
          "steps": [
                "Bahnen = 16 / 0,53 = 31 Bahnen (abzgl. 3 für Fenster = 28 Bahnen)",
                "Bahnen/Rolle = 10,05 / 2,60 = 3 Bahnen",
                "Rollen = 28 / 3 = 9,33 -> 10 Rollen"
          ],
          "result": "10 Euro-Rollen Tapete"
    },
    faqs: [
          {
                "question": "Was ist eine Euro-Normrolle?",
                "answer": "Die klassische Euro-Rolle (Euronorm) hat eine Standardlänge von 10,05 Metern und eine Breite von 0,53 Metern, was ca. 5,33 m² Gesamtfläche pro Rolle entspricht."
          },
          {
                "question": "Was bedeutet die Anfertigungsnummer / Chargennummer?",
                "answer": "Beim Tapetenkauf müssen alle Rollen dieselbe Chargennummer aufweisen, da es sonst zu leichten Nuancenunterschieden im Farbton an den Stößen kommen kann."
          }
    ],
    relatedSlugs: ["farbmengen-rechner","bodenbelag-rechner","parkett-laminat-rechner"],
  },
  {
    id: "brennholz-raummeter-rechner",
    slug: "brennholz-raummeter-rechner",
    name: "Brennholz- & Raummeter-Rechner (Festmeter, Raummeter, Schüttraummeter & Heizwert)",
    shortName: "Brennholz- & Raummeter-Rechner",
    category: "bauen-renovieren",
    subcategory: "Heizung & Energie",
    metaTitle: "Brennholz Rechner – Festmeter, Raummeter (RM) & Schüttraummeter (SRM)",
    metaDescription: "Rechnen Sie Brennholz-Einheiten um: Festmeter (FM), Raummeter (RM) und Schüttraummeter (SRM) inklusive Heizwert in kWh und Öl-/Gas-Äquivalent.",
    h1: "Brennholz Rechner – Umrechnung FM, RM, SRM & Energiegehalt",
    shortDescription: "Rechnet Brennholz-Raummaße um und ermittelt den Heizwert in kWh.",
    searchKeywords: ["brennholz umrechner srm rm fm","schuettraummeter in raummeter umrechnen","heizwert buche fichte kwh raummeter","brennholz heizoel aequivalent"],
    inputs: [
          {
                "id": "amount",
                "label": "Holzmenge",
                "type": "number",
                "defaultValue": 5,
                "min": 0.5,
                "max": 100,
                "step": 0.5,
                "unit": "Einheiten"
          },
          {
                "id": "inputUnit",
                "label": "Ausgangs-Einheit",
                "type": "select",
                "defaultValue": "srm",
                "options": [
                      {
                            "value": "srm",
                            "label": "Schüttraummeter (SRM – lose geschüttetes Scheitholz)"
                      },
                      {
                            "value": "rm",
                            "label": "Raummeter / Ster (RM – ordentlich aufgeschichtetes 1m-Holz)"
                      },
                      {
                            "value": "fm",
                            "label": "Festmeter (FM – reines Holz ohne Zwischenräume)"
                      }
                ]
          },
          {
                "id": "woodType",
                "label": "Holzart & Heizwert",
                "type": "select",
                "defaultValue": "beech",
                "options": [
                      {
                            "value": "beech",
                            "label": "Buche / Eiche (Hartholz, ca. 2.100 kWh / RM)"
                      },
                      {
                            "value": "birch",
                            "label": "Birke (Hartholz, ca. 1.900 kWh / RM)"
                      },
                      {
                            "value": "spruce",
                            "label": "Fichte / Kiefer (Nadelholz, ca. 1.500 kWh / RM)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const qty = Number(inputs.amount) || 0;
      const unit = inputs.inputUnit;
      
      // Basis-Umrechnungsfaktoren auf Raummeter (RM):
      // 1 FM = 1.4 RM = ca. 2.0 SRM
      // 1 RM = 0.7 FM = ca. 1.4 SRM
      // 1 SRM = 0.5 FM = ca. 0.7 RM
      let rm = qty;
      let fm = qty * 0.7;
      let srm = qty * 1.4;
      
      if (unit === 'srm') {
        rm = qty * 0.71;
        fm = qty * 0.50;
        srm = qty;
      } else if (unit === 'fm') {
        rm = qty * 1.43;
        fm = qty;
        srm = qty * 2.0;
      }
      
      let kwhPerRm = 2100;
      if (inputs.woodType === 'birch') kwhPerRm = 1900;
      else if (inputs.woodType === 'spruce') kwhPerRm = 1500;
      
      const totalKwh = rm * kwhPerRm;
      const oilEquivalentLiters = totalKwh / 10; // 1 Liter Heizöl ≈ 10 kWh
      
      return {
        primary: { id: 'rm', label: 'Menge in Raummeter (Ster)', value: rm, formattedValue: formatNumber(rm, 2) + ' RM', highlight: true },
        secondary: [
          { id: 'srm', label: 'Entspricht Schüttraummeter (SRM)', value: srm, formattedValue: formatNumber(srm, 2) + ' SRM' },
          { id: 'fm', label: 'Entspricht Festmeter (reine Holzmasse)', value: fm, formattedValue: formatNumber(fm, 2) + ' FM' },
          { id: 'energyKwh', label: 'Energiegehalt ca.', value: totalKwh, formattedValue: formatNumber(totalKwh, 0) + ' kWh' },
          { id: 'oilEquiv', label: 'Heizöl-Äquivalent', value: oilEquivalentLiters, formattedValue: 'ca. ' + formatNumber(oilEquivalentLiters, 0) + ' Liter Öl' },
        ],
        summaryText: qty + ' ' + (String(unit || 'SRM').toUpperCase()) + ' entsprechen ca. ' + formatNumber(rm, 2) + ' Raummeter bzw. ' + formatNumber(srm, 2) + ' SRM. Der Energiegehalt liegt bei rund ' + formatNumber(totalKwh, 0) + ' kWh.',
      };
    },
    formula: "1 Festmeter (FM) ≈ 1,4 Raummeter (RM) ≈ 2,0 Schüttraummeter (SRM); 1 SRM ≈ 0,7 RM",
    formulaExplanation: "Ein Festmeter ist ein kompakter Holzblock von 1 m³, ein Raummeter gestapeltes Scheitholz mit Luftzwischenräumen und ein Schüttraummeter lose geschüttetes Kaminholz.",
    workedExample: {
          "title": "Beispiel: 5 Schüttraummeter (SRM) Buchenbrennholz",
          "inputValues": [
                {
                      "label": "Menge",
                      "value": "5 SRM"
                },
                {
                      "label": "Holz",
                      "value": "Buche"
                }
          ],
          "steps": [
                "RM = 5 × 0,71 = 3,55 Raummeter",
                "Energie = 3,55 RM × 2.100 kWh = 7.455 kWh",
                "Entspricht ca. 745 Liter Heizöl"
          ],
          "result": "3,55 RM (7.455 kWh Energie)"
    },
    faqs: [
          {
                "question": "Wie viel Restfeuchte darf Kaminholz haben?",
                "answer": "Nach § 3 der 1. BImSchV darf Brennholz in Deutschland maximal 20 % Restfeuchte aufweisen (optimal sind unter 18 %), was nach 1 bis 2 Jahren regengeschützter Lagerung erreicht wird."
          },
          {
                "question": "Was ist günstiger: Raummeter oder Schüttraummeter?",
                "answer": "Scheinbar billige SRM-Preise täuschen oft: 1 SRM enthält etwa 30 % weniger Holz als 1 RM. Vergleichen Sie immer den umgerechneten Preis pro Raummeter oder Festmeter."
          }
    ],
    relatedSlugs: ["heizkostenvergleich-rechner","gaskostenrechner","stromkostenrechner"],
  },
  {
    id: "putz-rechner",
    slug: "putz-rechner",
    name: "Putz- & Mörtel-Rechner (Innen- & Außenputz kg, Säcke & Ergiebigkeit)",
    shortName: "Putz- & Mörtel-Rechner",
    category: "bauen-renovieren",
    subcategory: "Ausbau & Wand",
    metaTitle: "Putz Rechner – Innenputz & Außenputz Sackanzahl & kg berechnen",
    metaDescription: "Berechnen Sie den Putzmörtel-Bedarf in kg und 25-kg-/30-kg-Säcken für Gipsputz, Kalk-Zement-Putz und Zementputz nach Wandfläche und Auftragsdicke.",
    h1: "Putz Rechner – Putzbedarf & Sackanzahl für Wand & Decke",
    shortDescription: "Ermittelt den Mörtelbedarf für Verputzarbeiten nach Fläche und Putzdicke.",
    searchKeywords: ["putz rechner verbrauch kg m2","kalk zement putz saecke berechnen","gipsputz bedarf wandflaeche","putzmörtel dicke berechnen"],
    inputs: [
          {
                "id": "area",
                "label": "Zu verputzende Wandfläche",
                "type": "number",
                "defaultValue": 35,
                "min": 1,
                "max": 1000,
                "step": 1,
                "unit": "m²"
          },
          {
                "id": "thickness",
                "label": "Mittlere Putzdicke",
                "type": "number",
                "defaultValue": 12,
                "min": 5,
                "max": 35,
                "step": 1,
                "unit": "mm"
          },
          {
                "id": "plasterType",
                "label": "Putzart",
                "type": "select",
                "defaultValue": "limeCement",
                "options": [
                      {
                            "value": "gypsum",
                            "label": "Gipsputz / Innen (ca. 10 kg/m² je 10 mm Dicke)"
                      },
                      {
                            "value": "limeCement",
                            "label": "Kalk-Zement-Putz / Bad & Außen (ca. 13 kg/m² je 10 mm Dicke)"
                      },
                      {
                            "value": "cement",
                            "label": "Zementputz / Sockel & Keller (ca. 15 kg/m² je 10 mm Dicke)"
                      }
                ]
          },
          {
                "id": "sackSize",
                "label": "Sackgröße",
                "type": "select",
                "defaultValue": "30",
                "options": [
                      {
                            "value": "25",
                            "label": "25 kg Sack"
                      },
                      {
                            "value": "30",
                            "label": "30 kg Sack"
                      }
                ]
          },
          {
                "id": "waste",
                "label": "Spritzverlust & Ausgleich",
                "type": "number",
                "defaultValue": 10,
                "min": 0,
                "max": 20,
                "step": 1,
                "unit": "%"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const a = Number(inputs.area) || 0;
      const tMm = Number(inputs.thickness) || 0;
      const sackKg = Number(inputs.sackSize) || 30;
      const waste = 1 + ((Number(inputs.waste) || 0) / 100);
      
      let baseKgPer10mm = 13;
      if (inputs.plasterType === 'gypsum') baseKgPer10mm = 10;
      else if (inputs.plasterType === 'cement') baseKgPer10mm = 15;
      
      const kgPerM2 = (baseKgPer10mm / 10) * tMm;
      const totalKg = a * kgPerM2 * waste;
      const sacks = Math.ceil(totalKg / sackKg);
      
      return {
        primary: { id: 'sacks', label: 'Benötigte Säcke Trockenmörtel', value: sacks, formattedValue: sacks + ' Säcke (' + sackKg + ' kg)', highlight: true },
        secondary: [
          { id: 'totalKg', label: 'Gesamtgewicht Trockenputz', value: totalKg, formattedValue: formatNumber(totalKg, 1) + ' kg (' + formatNumber(totalKg / 1000, 2) + ' t)' },
          { id: 'waterReq', label: 'Wasserbedarf beim Anmischen ca.', value: totalKg * 0.25, formattedValue: 'ca. ' + Math.round(totalKg * 0.25) + ' Liter' },
        ],
        summaryText: 'Für ' + a + ' m² Wandfläche bei ' + tMm + ' mm Putzdicke benötigen Sie ca. ' + formatNumber(totalKg, 0) + ' kg Trockenmörtel (' + sacks + ' Säcke à ' + sackKg + ' kg).',
      };
    },
    formula: "Mörtel (kg) = Fläche (m²) × (Putzdicke in mm / 10) × Spezifischer Verbrauch × 1,10",
    formulaExplanation: "Ein Puffer von 10 % fängt Spritzverluste und das Ausfüllen von Fugen und Unebenheiten im Mauerwerk zuverlässig ab.",
    workedExample: {
          "title": "Beispiel: 35 m² Kellerwand mit 12 mm Kalk-Zement-Putz",
          "inputValues": [
                {
                      "label": "Fläche",
                      "value": "35 m²"
                },
                {
                      "label": "Dicke",
                      "value": "12 mm"
                },
                {
                      "label": "Sack",
                      "value": "30 kg"
                }
          ],
          "steps": [
                "Verbrauch: 35 × (12/10) × 13 kg × 1,10 = 600,6 kg",
                "Säcke: 600,6 / 30 = 20,02 -> 21 Säcke"
          ],
          "result": "21 Säcke à 30 kg (ca. 600 kg)"
    },
    faqs: [
          {
                "question": "Welcher Putz eignet sich am besten für Nassräume?",
                "answer": "Im Badezimmer und in Feuchträumen ist wasserabweisender Kalk-Zement-Putz oder reiner Zementputz vorgeschrieben. Gipsputz verliert bei dauerhafter Durchfeuchtung seine Festigkeit."
          },
          {
                "question": "Braucht Mauerwerk vor dem Verputzen einen Vorspritzmörtel?",
                "answer": "Bei stark saugendem oder ungleichmäßigem Mauerwerk verbessert ein zementärer Spritzbewurf die Haftung und verhindert das vorzeitige Verdursten des Putzes."
          }
    ],
    relatedSlugs: ["bausteine-mauerwerk-rechner","farbmengen-rechner","estrich-rechner"],
  },
  {
    id: "zaun-pfosten-rechner",
    slug: "zaun-pfosten-rechner",
    name: "Zaun- & Pfosten-Rechner (Doppelstabmatten & Pfostenanzahl)",
    shortName: "Zaun & Pfosten",
    category: "bauen-renovieren",
    subcategory: "Garten & Außenanlagen",
    metaTitle: "Zaun Rechner – Doppelstabmatten, Pfosten & Ruck-Zuck-Beton berechnen",
    metaDescription: "Berechnen Sie die Anzahl Doppelstabmatten (2,50 m Normlänge), Zaunpfosten, Eckpfosten und Säcke Ruck-Zuck-Beton nach Gesamt-Zaunlänge und Zaunhöhe.",
    h1: "Zaun Rechner – Doppelstabmatten, Pfosten & Betonbedarf",
    shortDescription: "Ermittelt Mattenanzahl, Pfosten und Beton für Doppelstabmattenzäune.",
    searchKeywords: ["zaun rechner doppelstabmatten","zaunpfosten anzahl berechnen","beton fuer zaunpfosten ruck zuck beton","zaunlaenge mattenanzahl"],
    inputs: [
          {
                "id": "fenceLength",
                "label": "Gesamtlänge des Zauns",
                "type": "number",
                "defaultValue": 25,
                "min": 2,
                "max": 200,
                "step": 0.5,
                "unit": "m"
          },
          {
                "id": "cornersCount",
                "label": "Anzahl Ecken (90° Richtungswechsel)",
                "type": "number",
                "defaultValue": 2,
                "min": 0,
                "max": 20,
                "step": 1,
                "unit": "Ecken"
          },
          {
                "id": "gatesCount",
                "label": "Anzahl Gartentore / Pforten (z. B. 1,00 m Breite)",
                "type": "number",
                "defaultValue": 1,
                "min": 0,
                "max": 5,
                "step": 1,
                "unit": "Tore"
          },
          {
                "id": "fenceHeight",
                "label": "Zaunhöhe",
                "type": "select",
                "defaultValue": "1230",
                "options": [
                      {
                            "value": "1030",
                            "label": "1,03 m Höhe (Standard Vorgarten)"
                      },
                      {
                            "value": "1230",
                            "label": "1,23 m Höhe (Garten standard)"
                      },
                      {
                            "value": "1630",
                            "label": "1,63 m Höhe (Sichtschutz)"
                      },
                      {
                            "value": "1830",
                            "label": "1,83 m Höhe (hoher Sichtschutz)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const totalLen = Number(inputs.fenceLength) || 0;
      const corners = Number(inputs.cornersCount) || 0;
      const gates = Number(inputs.gatesCount) || 0;
      // Jedes Tor spart ca. 1.0 m Zaunmatte ein
      const fenceNetLength = Math.max(0, totalLen - (gates * 1.0));
      
      // Doppelstabmatten haben standardmäßig 2,50 m Achsmaß
      const matten = Math.ceil(fenceNetLength / 2.50);
      // Pfosten = Anzahl Matten + 1 (Startpfosten) + Torelemente
      const standardPosts = Math.max(0, matten + 1 - corners);
      const cornerPosts = corners;
      const totalPosts = standardPosts + cornerPosts;
      
      // Beton: ca. 2 bis 3 Säcke à 25 kg Ruck-Zuck-Beton pro Pfostenloch
      const concreteSacksPerPost = Number(inputs.fenceHeight) >= 1630 ? 3 : 2;
      const totalConcreteSacks = totalPosts * concreteSacksPerPost;
      
      return {
        primary: { id: 'matten', label: 'Benötigte Doppelstabmatten (2,50 m)', value: matten, formattedValue: matten + ' Matten', highlight: true },
        secondary: [
          { id: 'posts', label: 'Zaunpfosten Gesamtanzahl', value: totalPosts, formattedValue: totalPosts + ' Pfosten (' + cornerPosts + ' Eckpfosten + ' + standardPosts + ' Standardpfosten)' },
          { id: 'concrete', label: 'Ruck-Zuck-Beton (25-kg-Säcke)', value: totalConcreteSacks, formattedValue: totalConcreteSacks + ' Säcke (' + (totalConcreteSacks * 25) + ' kg)' },
          { id: 'height', label: 'Ausgewählte Mattenhöhe', value: Number(inputs.fenceHeight) / 1000, formattedValue: formatNumber(Number(inputs.fenceHeight) / 1000, 2) + ' m' },
        ],
        summaryText: 'Für ' + totalLen + ' m Zaunverlauf benötigen Sie ' + matten + ' Doppelstabmatten, ' + totalPosts + ' Pfosten und ' + totalConcreteSacks + ' Säcke Zaunbaubeton.',
      };
    },
    formula: "Matten = ceil((Zaunlänge - Torbreiten) / 2,50 m); Pfosten = Matten + 1",
    formulaExplanation: "Genormte Doppelstabmatten sind exakt 2.510 mm breit. Das Achsmaß von Pfostenmitte zu Pfostenmitte beträgt bei fachgerechter Montage genau 2,52 m.",
    workedExample: {
          "title": "Beispiel: 25 m Gartenzaun mit 2 Ecken und 1 Tor (1,0 m)",
          "inputValues": [
                {
                      "label": "Zaunlänge",
                      "value": "25 m"
                },
                {
                      "label": "Tore",
                      "value": "1 Tor (1 m)"
                },
                {
                      "label": "Ecken",
                      "value": "2"
                }
          ],
          "steps": [
                "Reine Mattenlänge = 25 - 1 = 24 m",
                "Matten = 24 / 2,5 = 9,6 -> 10 Matten",
                "Pfosten = 10 + 1 = 11 Pfosten (2 Eckpfosten + 9 Normal)",
                "Beton = 11 × 2 = 22 Säcke Ruck-Zuck-Beton"
          ],
          "result": "10 Matten, 11 Pfosten, 22 Säcke Beton"
    },
    faqs: [
          {
                "question": "Was bedeutet die Bezeichnung 6/5/6 oder 8/6/8 bei Doppelstabmatten?",
                "answer": "Sie bezeichnet die Drahtstärken in Millimetern: Zwei waagerechte Drähte (z. B. 6 mm) schließen einen senkrechten Draht (z. B. 5 mm) ein. 8/6/8 ist die besonders stabile Industrieausführung."
          },
          {
                "question": "Muss Ruck-Zuck-Beton vorgemischt werden?",
                "answer": "Nein, Schnelltrockenbeton wird trocken schichtweise ins Erdloch geschüttet und mit Wasser begossen, ohne zeitaufwendiges Anrühren in der Mischmaschine."
          }
    ],
    relatedSlugs: ["fundament-rechner","betonrechner","pflastersteine-rechner"],
  },
  {
    id: "regenwasser-zisterne-rechner",
    slug: "regenwasser-zisterne-rechner",
    name: "Regenwasser-Zisternen-Rechner (Tankgröße nach DIN 1989)",
    shortName: "Zisternengröße",
    category: "bauen-renovieren",
    subcategory: "Garten & Außenanlagen",
    metaTitle: "Zisternen Rechner – Optimale Zisternengröße in Litern nach DIN 1989",
    metaDescription: "Berechnen Sie das ideale Zisternenvolumen nach Dachfläche, Bedachungsart (Ziegel/Gründach), Jahresniederschlag und Verwendungszweck (Gartenbewässerung, WC, Waschmaschine).",
    h1: "Zisternen Rechner – Ideales Tankvolumen für Regenwassernutzung",
    shortDescription: "Berechnet die optimale Zisternengröße nach Dachfläche und Niederschlag.",
    searchKeywords: ["zisternengroesse berechnen din 1989","regenwasser zisterne rechner liter","dachflaeche zisterne groesse","gartenbewaesserung zisterne volumen"],
    inputs: [
          {
                "id": "roofArea",
                "label": "Projizierte Dachfläche",
                "type": "number",
                "defaultValue": 120,
                "min": 20,
                "max": 1000,
                "step": 5,
                "unit": "m²"
          },
          {
                "id": "roofCovering",
                "label": "Dacheindeckung (Abflussbeiwert)",
                "type": "select",
                "defaultValue": "tile",
                "options": [
                      {
                            "value": "tile",
                            "label": "Tondachziegel / Betondachsteine / Schiefer (Beiwert 0,85)"
                      },
                      {
                            "value": "metal",
                            "label": "Blechdach / Zink / Glas (Beiwert 0,90)"
                      },
                      {
                            "value": "flat",
                            "label": "Kiesdach / Bitumen-Flachdach (Beiwert 0,60)"
                      },
                      {
                            "value": "green",
                            "label": "Gründach extensiv (Beiwert 0,40)"
                      }
                ]
          },
          {
                "id": "annualRain",
                "label": "Jährlicher Niederschlag (Bundesdurchschnitt ca. 750 mm)",
                "type": "number",
                "defaultValue": 750,
                "min": 450,
                "max": 1800,
                "step": 25,
                "unit": "mm (l/m²)"
          },
          {
                "id": "gardenArea",
                "label": "Zu bewässernde Gartenfläche",
                "type": "number",
                "defaultValue": 250,
                "min": 0,
                "max": 2000,
                "step": 25,
                "unit": "m²"
          },
          {
                "id": "useInHouse",
                "label": "Hausnutzung (WC-Spülung & Waschmaschine)",
                "type": "select",
                "defaultValue": "no",
                "options": [
                      {
                            "value": "no",
                            "label": "Nur Gartenbewässerung"
                      },
                      {
                            "value": "yes",
                            "label": "Garten + WC-Spülung & Waschmaschine (4 Personen)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const roof = Number(inputs.roofArea) || 0;
      const rain = Number(inputs.annualRain) || 750;
      const garden = Number(inputs.gardenArea) || 0;
      
      let runOff = 0.85;
      if (inputs.roofCovering === 'metal') runOff = 0.90;
      else if (inputs.roofCovering === 'flat') runOff = 0.60;
      else if (inputs.roofCovering === 'green') runOff = 0.40;
      
      const filterCoeff = 0.90; // Schmutzfilter-Wirkungsgrad
      // Jährlicher Regenwasserertrag in Litern:
      const annualYield = roof * rain * runOff * filterCoeff;
      
      // Bedarf:
      // Garten: ca. 60 Liter / m² pro Jahr
      let annualDemand = garden * 60;
      if (inputs.useInHouse === 'yes') {
        // 4 Personen: WC (24 l/Tag) + Waschen (10 l/Tag) = 34 l/Person/Tag * 4 * 365 = ca. 50.000 Liter
        annualDemand += 49640;
      }
      
      // Relevanter Jahreswert = min(Ertrag, Bedarf)
      const relevantAnnualVolume = Math.min(annualYield, annualDemand);
      // Nach DIN 1989: Speichergröße = Relevanter Jahreswert × (21 Tage / 365 Tage)
      const optimalVolumeLiters = Math.round((relevantAnnualVolume * 21) / 365);
      const roundedTankLiters = Math.ceil(optimalVolumeLiters / 500) * 500;
      
      return {
        primary: { id: 'tankSize', label: 'Empfohlenes Zisternenvolumen', value: roundedTankLiters, formattedValue: formatNumber(roundedTankLiters, 0) + ' Liter (' + formatNumber(roundedTankLiters / 1000, 1) + ' m³)', highlight: true },
        secondary: [
          { id: 'annualYield', label: 'Jährlicher Regenwasserertrag', value: annualYield, formattedValue: formatNumber(annualYield, 0) + ' Liter/Jahr' },
          { id: 'annualDemand', label: 'Jährlicher Wasserbedarf', value: annualDemand, formattedValue: formatNumber(annualDemand, 0) + ' Liter/Jahr' },
          { id: 'safetyDays', label: 'Berechnungsgrundlage Trockenzeitpuffer', value: 21, formattedValue: '21 Tage Speichervorrat (DIN 1989)' },
        ],
        summaryText: 'Ihr Dach liefert ca. ' + formatNumber(annualYield, 0) + ' Liter Regenwasser pro Jahr. Für einen 21-Tage-Sicherheitsvorrat wird ein Tankvolumen von ' + roundedTankLiters + ' Litern empfohlen.',
      };
    },
    formula: "Speichervolumen = min(Ertrag, Bedarf) × (21 / 365); Ertrag = Dachfläche × Niederschlag × Abflussbeiwert × Filterfaktor",
    formulaExplanation: "DIN 1989 empfiehlt einen Vorrat für 21 Trockentage. Eine zu große Zisterne läuft selten über, was jedoch zur Selbstreinigung der Oberfläche (Schwimmschichtabscheidung) wichtig ist.",
    workedExample: {
          "title": "Beispiel: 120 m² Ziegeldach, 750 mm Regen, 250 m² Garten",
          "inputValues": [
                {
                      "label": "Dach",
                      "value": "120 m²"
                },
                {
                      "label": "Regen",
                      "value": "750 mm"
                },
                {
                      "label": "Garten",
                      "value": "250 m²"
                }
          ],
          "steps": [
                "Ertrag = 120 × 750 × 0,85 × 0,90 = 68.850 Liter",
                "Gartenbedarf = 250 m² × 60 l = 15.000 Liter",
                "Speicher = 15.000 × (21 / 365) = 863 Liter -> mind. 1.500 l empfohlen"
          ],
          "result": "1.500 bis 3.000 Liter Zisterne"
    },
    faqs: [
          {
                "question": "Was ist besser: Betonzisterne oder Kunststoffzisterne?",
                "answer": "Betonzisternen sind extrem formstabil, PKW-befahrbar und neutralisieren durch den Kalk im Beton sauren Regen. Kunststofftanks (PE) sind leichter zu transportieren und einzubauen."
          },
          {
                "question": "Kann man Regenwasser für die Waschmaschine nutzen?",
                "answer": "Ja, Regenwasser ist kalkfrei. Dadurch verkalkt die Waschmaschine nicht, und es wird bis zu 50 % weniger Waschmittel benötigt."
          }
    ],
    relatedSlugs: ["dachflaeche-rechner","fundament-rechner","aushub-erdarbeiten-rechner"],
  },
  {
    id: "treppen-stufen-rechner",
    slug: "treppen-stufen-rechner",
    name: "Treppenstufen-Rechner (DIN 18065) (Schrittmaßregel 2s + a = 63 cm nach DIN 18065)",
    shortName: "Treppen-Rechner",
    category: "bauen-renovieren",
    subcategory: "Ausbau & Wand",
    metaTitle: "Treppenstufen Rechner – Steigung & Auftritt berechnen nach DIN 18065",
    metaDescription: "Berechnen Sie die Stufenanzahl, Steigungshöhe (s), Auftrittstiefe (a) und Treppenlänge nach der Schrittmaßregel (2s + a = 63 cm) und Treppensteigungswinkel.",
    h1: "Treppen Rechner – Stufenanzahl, Steigung & Auftritt nach Schrittmaß",
    shortDescription: "Berechnet Stufenanzahl, Steigung und Auftritt nach der DIN 18065.",
    searchKeywords: ["treppen rechner schrittmassregel","stufenhoehe berechnen 2s plus a","treppenstufen anzahl auftritt din 18065","treppenlauf laenge geschosshoehe"],
    inputs: [
          {
                "id": "floorHeight",
                "label": "Geschosshöhe (Oberkante Fertigfußboden zu Fertigfußboden)",
                "type": "number",
                "defaultValue": 270,
                "min": 50,
                "max": 500,
                "step": 1,
                "unit": "cm"
          },
          {
                "id": "idealStepHeight",
                "label": "Angestrebte ideale Stufenhöhe",
                "type": "number",
                "defaultValue": 17.5,
                "min": 14,
                "max": 21,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "stepFormulaConstant",
                "label": "Schrittmaß nach DIN (Standard 63 cm)",
                "type": "number",
                "defaultValue": 63,
                "min": 59,
                "max": 65,
                "step": 0.5,
                "unit": "cm"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const h = Number(inputs.floorHeight) || 0;
      const idealS = Number(inputs.idealStepHeight) || 17.5;
      const stepConst = Number(inputs.stepFormulaConstant) || 63;
      
      // Stufenanzahl (Steigungen):
      const stepsCount = Math.round(h / idealS);
      const actualStepHeight = h / stepsCount;
      // Schrittmaßregel: 2 * s + a = 63 cm => a = 63 - 2 * s
      const actualTreadDepth = stepConst - (2 * actualStepHeight);
      
      // Lauflänge (ohne obersten Austritt): (stepsCount - 1) * a
      const runLength = (stepsCount - 1) * actualTreadDepth;
      // Steigungswinkel: tan(alpha) = h / runLength
      const angleRad = Math.atan(h / runLength);
      const angleDeg = (angleRad * 180) / Math.PI;
      
      const isComfortable = actualStepHeight >= 16 && actualStepHeight <= 18.5 && actualTreadDepth >= 26 && actualTreadDepth <= 30;
      
      return {
        primary: { id: 'stepsCount', label: 'Anzahl der Steigungen (Stufen)', value: stepsCount, formattedValue: stepsCount + ' Steigungen (' + (stepsCount - 1) + ' Trittstufen)', highlight: true },
        secondary: [
          { id: 'stepHeight', label: 'Exakte Stufenhöhe (Steigung s)', value: actualStepHeight, formattedValue: formatNumber(actualStepHeight, 2) + ' cm' },
          { id: 'treadDepth', label: 'Stufenauftritt (Tiefe a)', value: actualTreadDepth, formattedValue: formatNumber(actualTreadDepth, 2) + ' cm' },
          { id: 'runLength', label: 'Treppen-Lauflänge Grundriss', value: runLength / 100, formattedValue: formatNumber(runLength / 100, 2) + ' m' },
          { id: 'pitchAngle', label: 'Treppen-Neigungswinkel', value: angleDeg, formattedValue: formatNumber(angleDeg, 1) + '° (' + (isComfortable ? 'bequeme Treppe' : 'Normgrenze') + ')' },
        ],
        summaryText: 'Bei ' + h + ' cm Geschosshöhe planen Sie mit ' + stepsCount + ' Steigungen à ' + formatNumber(actualStepHeight, 2) + ' cm Höhe und ' + formatNumber(actualTreadDepth, 2) + ' cm Auftrittstiefe (Lauflänge ' + formatNumber(runLength / 100, 2) + ' m).',
      };
    },
    formula: "Schrittmaß: 2 × s + a = 63 cm; Stufenanzahl = round(Geschosshöhe / Wunschsteigung)",
    formulaExplanation: "Die Schrittmaßregel basiert auf der menschlichen Schrittlänge beim Gehen (ca. 63 cm). Beim Treppensteigen verdoppelt sich der Höhenaufwand gegenüber der Vorwärtsbewegung.",
    workedExample: {
          "title": "Beispiel: 270 cm Geschosshöhe mit Ziel 17,5 cm Steigung",
          "inputValues": [
                {
                      "label": "Geschosshöhe",
                      "value": "270 cm"
                },
                {
                      "label": "Zielsteigung",
                      "value": "17,5 cm"
                }
          ],
          "steps": [
                "Stufenanzahl = 270 / 17,5 = 15,43 -> 15 Stufen",
                "Exakte Steigung s = 270 / 15 = 18,00 cm",
                "Auftritt a = 63 - (2 × 18,00) = 27,00 cm",
                "Lauflänge = 14 × 27 cm = 378 cm (3,78 m)"
          ],
          "result": "15 Steigungen (s = 18 cm, a = 27 cm)"
    },
    faqs: [
          {
                "question": "Welche Steigung ist nach DIN 18065 für Wohnhaustreppen zulässig?",
                "answer": "In baurechtlich notwendigen Treppen für Einfamilienhäuser gilt eine Steigung von 14 bis 20 cm und ein Auftritt von 23 bis 37 cm. Als Idealmaß gelten 17 cm Steigung und 29 cm Auftritt."
          },
          {
                "question": "Wie viel Durchgangshöhe (Kopffreiheit) ist vorgeschrieben?",
                "answer": "Die lichte Durchgangshöhe senkrecht über der Treppenlauflinie muss an jeder Stelle mindestens 2,00 Meter betragen."
          }
    ],
    relatedSlugs: ["parkett-laminat-rechner","estrich-rechner","bodenbelag-rechner"],
  },
  {
    id: "kies-splitt-rechner",
    slug: "kies-splitt-rechner",
    name: "Kies- & Splitt-Rechner (Menge in Tonnen & m³ nach Schütthöhe)",
    shortName: "Kies & Splitt",
    category: "bauen-renovieren",
    subcategory: "Garten & Außenanlagen",
    metaTitle: "Kies & Splitt Rechner – Bedarf in Tonnen & m³ für Garten & Hof berechnen",
    metaDescription: "Berechnen Sie das Gewicht in Tonnen und Volumen in m³ für Kies, Splitt, Schotter oder Rindenmulch nach Fläche in m² und Einbauhöhe.",
    h1: "Kies & Splitt Rechner – Tonnen & Schüttvolumen berechnen",
    shortDescription: "Ermittelt das Gewicht und Schüttvolumen von Kies, Splitt und Schotter.",
    searchKeywords: ["kies rechner tonnen m3","splitt bedarf berechnen terrasse","schotter gewicht volumen dichte","zierkies menge quadratmeter"],
    inputs: [
          {
                "id": "area",
                "label": "Fläche",
                "type": "number",
                "defaultValue": 30,
                "min": 1,
                "max": 1000,
                "step": 1,
                "unit": "m²"
          },
          {
                "id": "depth",
                "label": "Schütthöhe / Schichtdicke",
                "type": "number",
                "defaultValue": 5,
                "min": 2,
                "max": 50,
                "step": 0.5,
                "unit": "cm"
          },
          {
                "id": "materialType",
                "label": "Material & Rohdichte",
                "type": "select",
                "defaultValue": "grit",
                "options": [
                      {
                            "value": "gravel",
                            "label": "Kies / Rollkies 16/32 (Dichte ca. 1,60 t/m³)"
                      },
                      {
                            "value": "grit",
                            "label": "Splitt / Edelsplitt 2/5 (Dichte ca. 1,55 t/m³)"
                      },
                      {
                            "value": "crushed",
                            "label": "Schotter / Frostschutz 0/32 verdichtet (Dichte ca. 1,85 t/m³)"
                      },
                      {
                            "value": "bark",
                            "label": "Rindenmulch (Dichte ca. 0,40 t/m³)"
                      }
                ]
          },
          {
                "id": "compaction",
                "label": "Verdichtungs- / Setzungszuschlag",
                "type": "number",
                "defaultValue": 10,
                "min": 0,
                "max": 25,
                "step": 1,
                "unit": "%"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const a = Number(inputs.area) || 0;
      const dM = (Number(inputs.depth) || 0) / 100;
      const comp = 1 + ((Number(inputs.compaction) || 0) / 100);
      
      const volumeM3 = a * dM * comp;
      
      let density = 1.55;
      if (inputs.materialType === 'gravel') density = 1.60;
      else if (inputs.materialType === 'crushed') density = 1.85;
      else if (inputs.materialType === 'bark') density = 0.40;
      
      const totalTonnes = volumeM3 * density;
      const bigBags = Math.ceil(totalTonnes / 1.0); // 1-Tonnen-Big-Bag
      
      return {
        primary: { id: 'tonnes', label: 'Benötigtes Materialgewicht', value: totalTonnes, formattedValue: formatNumber(totalTonnes, 2) + ' Tonnen', highlight: true },
        secondary: [
          { id: 'volume', label: 'Einbauvolumen inkl. Setzung', value: volumeM3, formattedValue: formatNumber(volumeM3, 2) + ' m³' },
          { id: 'bigbags', label: 'Lieferung in Big Bags (à 1.000 kg)', value: bigBags, formattedValue: bigBags + ' Big Bag(s)' },
          { id: 'sacks25', label: 'Alternativ: 25-kg-Säcke', value: Math.ceil((totalTonnes * 1000) / 25), formattedValue: Math.ceil((totalTonnes * 1000) / 25) + ' Säcke' },
        ],
        summaryText: 'Für ' + a + ' m² Fläche bei ' + inputs.depth + ' cm Schütthöhe benötigen Sie ca. ' + formatNumber(volumeM3, 2) + ' m³ Material (' + formatNumber(totalTonnes, 2) + ' Tonnen).',
      };
    },
    formula: "Gewicht (t) = Fläche (m²) × Schütthöhe (m) × Verdichtungsfaktor × Schüttdichte (t/m³)",
    formulaExplanation: "Beim Rütteln oder natürlichen Setzen durch Regen verdichtet sich Schotter und Splitt um 10 % bis 15 %, was bei der Bestellmenge berücksichtigt werden muss.",
    workedExample: {
          "title": "Beispiel: 30 m² Gartenweg mit 5 cm Edelsplitt (10 % Setzung)",
          "inputValues": [
                {
                      "label": "Fläche",
                      "value": "30 m²"
                },
                {
                      "label": "Höhe",
                      "value": "5 cm"
                },
                {
                      "label": "Material",
                      "value": "Splitt (1,55 t/m³)"
                }
          ],
          "steps": [
                "Volumen = 30 × 0,05 × 1,10 = 1,65 m³",
                "Gewicht = 1,65 m³ × 1,55 t/m³ = 2,56 Tonnen"
          ],
          "result": "2,56 Tonnen Splitt (3 Big Bags)"
    },
    faqs: [
          {
                "question": "Wie dick sollte Zierkies im Garten aufgeschüttet werden?",
                "answer": "Als Daumenregel gilt die doppelte Korngröße: Bei Kies 16/32 mm empfiehlt sich eine Schütthöhe von mindestens 5 bis 6 cm, damit das darunterliegende Unkrautvlies nicht durchscheint."
          },
          {
                "question": "Braucht man ein Unkrautvlies unter Kiesflächen?",
                "answer": "Ja, ein Geotextil-Unkrautvlies verhindert das Durchwachsen von Wurzeln und sorgt dafür, dass die Kieselsteine nicht im darunterliegenden Erdreich versinken."
          }
    ],
    relatedSlugs: ["pflastersteine-rechner","aushub-erdarbeiten-rechner","fundament-rechner"],
  },
  {
    id: "drainage-gefaelle-rechner",
    slug: "drainage-gefaelle-rechner",
    name: "Drainage- & Gefälle-Rechner (Prozent, cm/m & Höhenunterschied)",
    shortName: "Gefälle-Rechner",
    category: "bauen-renovieren",
    subcategory: "Rohbau & Boden",
    metaTitle: "Gefälle Rechner – Steigung in Prozent, Promille & cm pro Meter berechnen",
    metaDescription: "Berechnen Sie das Gefälle von Terrassen (min. 2 %), Abwasserrohren nach DIN EN 12056 (1-2 cm/m) und Garagenauffahrten nach Länge und Höhenunterschied.",
    h1: "Gefälle Rechner – Gefälle in %, cm/m & Höhenunterschied ermitteln",
    shortDescription: "Berechnet Gefälle in Prozent, Grad und Höhenunterschied in Zentimetern.",
    searchKeywords: ["gefaelle rechner prozent cm m","terrasse gefaelle berechnen 2 prozent","abwasserrohr gefaelle din 12056","hoehenunterschied laenge gefaelle"],
    inputs: [
          {
                "id": "distance",
                "label": "Horizontale Strecke / Rohrlänge",
                "type": "number",
                "defaultValue": 10,
                "min": 0.5,
                "max": 200,
                "step": 0.5,
                "unit": "m"
          },
          {
                "id": "calcMode",
                "label": "Berechnungsmodus",
                "type": "select",
                "defaultValue": "fromPercent",
                "options": [
                      {
                            "value": "fromPercent",
                            "label": "Gefälle vorgegeben (Höhenunterschied berechnen)"
                      },
                      {
                            "value": "fromHeight",
                            "label": "Höhenunterschied gemessen (Gefälle berechnen)"
                      }
                ]
          },
          {
                "id": "slopePercent",
                "label": "Gefälle (z. B. 2 % für Terrasse, 1,5 % für Abwasser)",
                "type": "number",
                "defaultValue": 2,
                "min": 0.1,
                "max": 50,
                "step": 0.1,
                "unit": "%"
          },
          {
                "id": "heightDiffCm",
                "label": "Höhenunterschied (nur bei Modus \"gemessen\")",
                "type": "number",
                "defaultValue": 20,
                "min": 0.5,
                "max": 500,
                "step": 0.5,
                "unit": "cm"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const dist = Number(inputs.distance) || 0;
      const mode = inputs.calcMode;
      
      let slopePct = Number(inputs.slopePercent) || 2;
      let hCm = Number(inputs.heightDiffCm) || 20;
      
      if (mode === 'fromPercent') {
        // h = dist (m) * (slopePct / 100) in Metern -> in cm:
        hCm = dist * slopePct;
      } else {
        // slopePct = (hCm / 100) / dist * 100 = hCm / dist
        slopePct = hCm / dist;
      }
      
      const cmPerMeter = slopePct;
      const angleDeg = Math.atan((slopePct / 100)) * (180 / Math.PI);
      
      return {
        primary: { id: 'heightDiff', label: 'Höhenunterschied (Gefällehöhe)', value: hCm, formattedValue: formatNumber(hCm, 1) + ' cm', highlight: true },
        secondary: [
          { id: 'slopePercent', label: 'Gefälle in Prozent', value: slopePct, formattedValue: formatNumber(slopePct, 2) + ' %' },
          { id: 'cmPerM', label: 'Gefälle pro Meter Strecke', value: cmPerMeter, formattedValue: formatNumber(cmPerMeter, 2) + ' cm/m' },
          { id: 'angleDeg', label: 'Neigungswinkel', value: angleDeg, formattedValue: formatNumber(angleDeg, 2) + '°' },
        ],
        summaryText: 'Über eine Strecke von ' + dist + ' m ergibt ein Gefälle von ' + formatNumber(slopePct, 2) + ' % (' + formatNumber(cmPerMeter, 2) + ' cm/m) einen Gesamthöhenunterschied von ' + formatNumber(hCm, 1) + ' cm.',
      };
    },
    formula: "Gefälle (%) = (Höhenunterschied in m / Strecke in m) × 100; Höhenunterschied (cm) = Strecke (m) × Gefälle (%)",
    formulaExplanation: "Ein Gefälle von 2 % bedeutet genau 2 cm Höhenunterschied pro 1 Meter Lauflänge.",
    workedExample: {
          "title": "Beispiel: 4 Meter Terrassentiefe mit 2 % Gefälle vom Haus weg",
          "inputValues": [
                {
                      "label": "Strecke",
                      "value": "4 m"
                },
                {
                      "label": "Gefälle",
                      "value": "2 %"
                }
          ],
          "steps": [
                "Gefälle pro Meter = 2 cm/m",
                "Gesamtabfall = 4 m × 2 cm/m = 8 cm"
          ],
          "result": "8 cm Höhenunterschied"
    },
    faqs: [
          {
                "question": "Warum benötigt eine Terrasse mindestens 2 % Gefälle?",
                "answer": "Damit Regenwasser zügig vom Haus wegfließt, sich keine Pfützen bilden und im Winter kein gefrierendes Wasser Fliesen absprengt oder Terrassendielen vermosen lässt."
          },
          {
                "question": "Wie viel Gefälle muss ein Abwasserrohr im Haus haben?",
                "answer": "Nach DIN EN 12056 beträgt das empfohlene Gefälle für Schmutzwasserleitungen 1 bis 2 cm pro Meter (1 % bis 2 %). Zu viel Gefälle (> 5 %) führt dazu, dass Wasser abfließt, Feststoffe aber liegen bleiben."
          }
    ],
    relatedSlugs: ["pflastersteine-rechner","regenwasser-zisterne-rechner","fundament-rechner"],
  },
  {
    id: "baugrund-tragfaehigkeit-rechner",
    slug: "baugrund-tragfaehigkeit-rechner",
    name: "Baugrund- & Bodenpressungs-Rechner (Fundamentbelastung nach DIN 1054)",
    shortName: "Bodenpressung-Rechner",
    category: "bauen-renovieren",
    subcategory: "Rohbau & Boden",
    metaTitle: "Bodenpressung Rechner – Baugrund-Tragfähigkeit & Fundamentfläche DIN 1054",
    metaDescription: "Berechnen Sie die vorhandene Bodenpressung (kN/m²) unter Fundamenten und vergleichen Sie diese mit der zulässigen Bodenpressung nach DIN 1054.",
    h1: "Baugrund Rechner – Bodenpressung & Tragfähigkeit berechnen",
    shortDescription: "Ermittelt die Bodenpressung unter Fundamenten und prüft die Tragfähigkeit.",
    searchKeywords: ["bodenpressung rechner din 1054","baugrund tragfaehigkeit kn m2","fundamentbelastung berechnen","zulaessige bodenpressung tabelle"],
    inputs: [
          {
                "id": "loadKn",
                "label": "Auflast auf das Fundament (inkl. Eigengewicht)",
                "type": "number",
                "defaultValue": 150,
                "min": 10,
                "max": 5000,
                "step": 10,
                "unit": "kN (ca. t × 10)"
          },
          {
                "id": "fundamentLength",
                "label": "Fundamentlänge",
                "type": "number",
                "defaultValue": 2,
                "min": 0.3,
                "max": 20,
                "step": 0.1,
                "unit": "m"
          },
          {
                "id": "fundamentWidth",
                "label": "Fundamentbreite",
                "type": "number",
                "defaultValue": 0.8,
                "min": 0.2,
                "max": 10,
                "step": 0.05,
                "unit": "m"
          },
          {
                "id": "soilClass",
                "label": "Bodenart nach Bodengutachten",
                "type": "select",
                "defaultValue": "sand",
                "options": [
                      {
                            "value": "sand",
                            "label": "Kies / Sand dicht gelagert (zulässig ca. 300 kN/m²)"
                      },
                      {
                            "value": "mediumSand",
                            "label": "Sand mitteldicht gelagert (zulässig ca. 200 kN/m²)"
                      },
                      {
                            "value": "loamFirm",
                            "label": "Lehm / Ton halbfest bis fest (zulässig ca. 180 kN/m²)"
                      },
                      {
                            "value": "loamSoft",
                            "label": "Schluff / weicher Lehm (zulässig ca. 100 kN/m²)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const fKn = Number(inputs.loadKn) || 0;
      const l = Number(inputs.fundamentLength) || 0;
      const w = Number(inputs.fundamentWidth) || 0;
      const area = l * w;
      
      // Bodenpressung sigma = F / A
      const sigma = area > 0 ? fKn / area : 0;
      
      let sigmaMax = 300;
      if (inputs.soilClass === 'mediumSand') sigmaMax = 200;
      else if (inputs.soilClass === 'loamFirm') sigmaMax = 180;
      else if (inputs.soilClass === 'loamSoft') sigmaMax = 100;
      
      const utilization = (sigma / sigmaMax) * 100;
      const isSafe = sigma <= sigmaMax;
      
      return {
        primary: { id: 'sigma', label: 'Vorhandene Bodenpressung σ', value: sigma, formattedValue: formatNumber(sigma, 1) + ' kN/m²', highlight: true },
        secondary: [
          { id: 'utilization', label: 'Auslastung des Baugrunds', value: utilization, formattedValue: formatNumber(utilization, 1) + ' % (' + (isSafe ? 'sicher' : 'Überlastung!') + ')' },
          { id: 'sigmaMax', label: 'Zulässige Bodenpressung σ_zul', value: sigmaMax, formattedValue: sigmaMax + ' kN/m²' },
          { id: 'fundamentArea', label: 'Fundament-Auflagefläche', value: area, formattedValue: formatNumber(area, 2) + ' m²' },
        ],
        summaryText: 'Die Belastung erzeugt eine Bodenpressung von ' + formatNumber(sigma, 1) + ' kN/m². Der Baugrund wird zu ' + formatNumber(utilization, 1) + ' % ausgelastet (' + (isSafe ? 'statisch im sicheren Bereich' : 'Achtung: Fundamentfläche vergrößern!') + ').',
      };
    },
    formula: "Bodenpressung σ = Last F (kN) / Fundamentfläche A (m²) <= σ_zul",
    formulaExplanation: "Übersteigt die tatsächliche Bodenpressung die Tragfähigkeit des Bodens, kann es zu ungleichmäßigen Setzungen, Schiefstellung und Rissen im Mauerwerk kommen.",
    workedExample: {
          "title": "Beispiel: 150 kN Last auf 2,0 m × 0,8 m Fundament in dichtem Sand",
          "inputValues": [
                {
                      "label": "Last",
                      "value": "150 kN"
                },
                {
                      "label": "Fläche",
                      "value": "1,6 m²"
                },
                {
                      "label": "Boden",
                      "value": "Sand (300 kN/m²)"
                }
          ],
          "steps": [
                "σ = 150 kN / 1,6 m² = 93,75 kN/m²",
                "Auslastung = 93,75 / 300 = 31,3 % (vollständig sicher)"
          ],
          "result": "93,8 kN/m² (ausreichende Standsicherheit)"
    },
    faqs: [
          {
                "question": "Wie rechnet man Tonnen in Kilonewton (kN) um?",
                "answer": "1 Tonne Masse entspricht auf der Erde einer Gewichtskraft von ca. 9,81 kN, in der Praxis rechnet man überschlägig mit: 1 Tonne ≈ 10 kN."
          },
          {
                "question": "Wann ist ein geologisches Bodengutachten zwingend erforderlich?",
                "answer": "Vor jedem Neubau oder größeren Anbau ist ein Baugrundgutachten dringend anzuraten, um teure Überraschungen wie Torflinsen, Schichtenwasser oder geringe Tragfähigkeit auszuschließen."
          }
    ],
    relatedSlugs: ["fundament-rechner","betonrechner","aushub-erdarbeiten-rechner"],
  },
  {
    id: "holz-balken-durchbiegung-rechner",
    slug: "holz-balken-durchbiegung-rechner",
    name: "Holzbalken-Durchbiegungs-Rechner (Dimensionierung nach Eurocode 5)",
    shortName: "Holzbalken-Rechner",
    category: "bauen-renovieren",
    subcategory: "Rohbau & Boden",
    metaTitle: "Holzbalken Durchbiegung Rechner – Balken dimensionieren nach Eurocode 5",
    metaDescription: "Berechnen Sie die Durchbiegung von Holzdeckenbalken (C24 Nadelholz) nach Spannweite, Balkenbreite, Balkenhöhe und Last nach DIN EN 1995-1-1.",
    h1: "Holzbalken Rechner – Balkenquerschnitt & Durchbiegung prüfen",
    shortDescription: "Berechnet die Durchbiegung von Holzbalken und prüft Grenzwerte nach DIN.",
    searchKeywords: ["holzbalken durchbiegung rechner","holzbalkendecke dimensionierung spanne","traegheitsmoment holzbalken b h3 12","eurocode 5 holz durchbiegung l 300"],
    inputs: [
          {
                "id": "spanMeters",
                "label": "Spannweite des Balkens",
                "type": "number",
                "defaultValue": 4,
                "min": 1,
                "max": 10,
                "step": 0.1,
                "unit": "m"
          },
          {
                "id": "beamWidthCm",
                "label": "Balkenbreite (b)",
                "type": "number",
                "defaultValue": 10,
                "min": 4,
                "max": 40,
                "step": 1,
                "unit": "cm"
          },
          {
                "id": "beamHeightCm",
                "label": "Balkenhöhe (h)",
                "type": "number",
                "defaultValue": 20,
                "min": 6,
                "max": 60,
                "step": 1,
                "unit": "cm"
          },
          {
                "id": "beamSpacingM",
                "label": "Balkenabstand (Achsmaß)",
                "type": "number",
                "defaultValue": 0.65,
                "min": 0.3,
                "max": 1.5,
                "step": 0.05,
                "unit": "m"
          },
          {
                "id": "totalLoadKnM2",
                "label": "Gesamtflächenlast (Eigengewicht + Verkehrslast)",
                "type": "number",
                "defaultValue": 2.5,
                "min": 0.5,
                "max": 10,
                "step": 0.1,
                "unit": "kN/m²"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const lM = Number(inputs.spanMeters) || 0;
      const bCm = Number(inputs.beamWidthCm) || 0;
      const hCm = Number(inputs.beamHeightCm) || 0;
      const eM = Number(inputs.beamSpacingM) || 0.65;
      const qM2 = Number(inputs.totalLoadKnM2) || 2.5;
      
      // Linienlast q in N/mm: q = qM2 (kN/m²) * eM (m) = kN/m = N/mm
      const qNmm = qM2 * eM;
      const lMm = lM * 1000;
      const bMm = bCm * 10;
      const hMm = hCm * 10;
      
      // Flächenträgheitsmoment I = (b * h^3) / 12 in mm^4:
      const iMoment = (bMm * Math.pow(hMm, 3)) / 12;
      const eModul = 11000;
      const fMm = (iMoment > 0) ? ((5 * qNmm * Math.pow(lMm, 4)) / (384 * eModul * iMoment)) : 0;
      const limitMm = lMm / 300;
      const isCompliant = fMm <= limitMm;
      
      return {
        primary: { id: 'deflection', label: 'Berechnete Durchbiegung f', value: fMm, formattedValue: formatNumber(fMm, 1) + ' mm', highlight: true },
        secondary: [
          { id: 'limit', label: 'Zulässiger Grenzwert (L / 300)', value: limitMm, formattedValue: formatNumber(limitMm, 1) + ' mm (' + (isCompliant ? 'eingehalten' : 'zu stark!') + ')' },
          { id: 'ratio', label: 'Verhältnis f / L', value: limitMm > 0 ? (fMm / limitMm) * 100 : 0, formattedValue: formatNumber((fMm / limitMm) * 100, 1) + ' % des Limits' },
          { id: 'iMoment', label: 'Flächenträgheitsmoment I', value: iMoment / 10000, formattedValue: formatNumber(iMoment / 10000, 0) + ' cm⁴' },
        ],
        summaryText: 'Unter Last biegt sich der Balken um ' + formatNumber(fMm, 1) + ' mm durch. Grenzwert nach Eurocode 5 (L/300 = ' + formatNumber(limitMm, 1) + ' mm) ist ' + (isCompliant ? 'vollständig erfüllt.' : 'überschritten! Bitte Balkenhöhe vergrößern.'),
      };
    },
    formula: "f = (5 × q × L⁴) / (384 × E × I); I = (b × h³) / 12",
    formulaExplanation: "Die Balkenhöhe h geht in der dritten Potenz (h³) in das Trägheitsmoment ein. Eine Verdoppelung der Balkenhöhe verachtfacht die Steifigkeit!",
    workedExample: {
          "title": "Beispiel: Balken 10×20 cm, 4 m Spannweite, 65 cm Abstand bei 2,5 kN/m²",
          "inputValues": [
                {
                      "label": "Spanne",
                      "value": "4 m"
                },
                {
                      "label": "Querschnitt",
                      "value": "10 × 20 cm"
                },
                {
                      "label": "Last",
                      "value": "2,5 kN/m²"
                }
          ],
          "steps": [
                "I = (100 × 200³) / 12 = 66.666.667 mm⁴",
                "q = 2,5 × 0,65 = 1,625 N/mm",
                "f = (5 × 1,625 × 4000⁴) / (384 × 11000 × 66,67 Mio) = 7,37 mm",
                "Limit L/300 = 4000 / 300 = 13,33 mm"
          ],
          "result": "7,4 mm Durchbiegung (weit unter dem Limit 13,3 mm)"
    },
    faqs: [
          {
                "question": "Was ist wichtiger für die Tragfähigkeit: Breite oder Höhe?",
                "answer": "Eindeutig die Höhe! Die Höhe geht hoch 3 in die Steifigkeit ein. Ein 12×24 cm Balken ist fast doppelt so steif wie ein 16×20 cm Balken bei gleichem Holzverbrauch."
          },
          {
                "question": "Was bedeutet Konstruktionsvollholz C24?",
                "answer": "C24 ist die in Mitteleuropa gängigste Güteklasse für Nadelholz (Fichte/Tanne) im konstruktiven Holzbau mit einer Biegefestigkeit von 24 N/mm²."
          }
    ],
    relatedSlugs: ["dachflaeche-rechner","daemmung-u-wert-rechner","fundament-rechner"],
  },
  {
    id: "beton-mischungsverhaeltnis-rechner",
    slug: "beton-mischungsverhaeltnis-rechner",
    name: "Beton-Mischungsverhältnis-Rechner (Zement, Sand, Kies & Wasser)",
    shortName: "Beton mischen",
    category: "bauen-renovieren",
    subcategory: "Rohbau & Boden",
    metaTitle: "Beton mischen Rechner – Mischungsverhältnis Zement & Kies nach Schaufeln",
    metaDescription: "Berechnen Sie das optimale Mischungsverhältnis für Beton (1:4 Regel) in Schaufeln, Litern und kg Zement, Betonkies (0/16 oder 0/32) und Anmachwasser (w/z-Wert).",
    h1: "Beton mischen Rechner – Mischverhältnis in Schaufeln & kg",
    shortDescription: "Berechnet Schaufeln und Gewichte für das Selbstanmischen von Beton.",
    searchKeywords: ["beton mischungsverhaeltnis schaufeln rechner","beton selber mischen verhaeltnis 1 zu 4","zement kies wasser rechner","w z wert beton anmachwasser"],
    inputs: [
          {
                "id": "desiredM3",
                "label": "Benötigtes Fertigbeton-Volumen",
                "type": "number",
                "defaultValue": 0.5,
                "min": 0.05,
                "max": 5,
                "step": 0.05,
                "unit": "m³"
          },
          {
                "id": "mixRatio",
                "label": "Festigkeitsklasse & Mischungsverhältnis",
                "type": "select",
                "defaultValue": "standard",
                "options": [
                      {
                            "value": "standard",
                            "label": "Standardbeton C20/25 (Mischung 1 : 4 Zement zu Kies)"
                      },
                      {
                            "value": "strong",
                            "label": "Hochfester Beton C25/30 (Mischung 1 : 3 Zement zu Kies)"
                      },
                      {
                            "value": "lean",
                            "label": "Magerbeton / Sauberkeitsschicht (Mischung 1 : 6 bis 1 : 8)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const m3 = Number(inputs.desiredM3) || 0;
      
      let cementKgPerM3 = 300;
      let gravelKgPerM3 = 1800;
      let waterLitersPerM3 = 165;
      let shovelsGravelPerCement = 4;
      
      if (inputs.mixRatio === 'strong') {
        cementKgPerM3 = 350;
        gravelKgPerM3 = 1750;
        waterLitersPerM3 = 175;
        shovelsGravelPerCement = 3;
      } else if (inputs.mixRatio === 'lean') {
        cementKgPerM3 = 180;
        gravelKgPerM3 = 1950;
        waterLitersPerM3 = 140;
        shovelsGravelPerCement = 7;
      }
      
      const totalCementKg = Math.round(m3 * cementKgPerM3);
      const totalGravelKg = Math.round(m3 * gravelKgPerM3);
      const totalWaterL = Math.round(m3 * waterLitersPerM3);
      const cementSacks25 = Math.ceil(totalCementKg / 25);
      
      return {
        primary: { id: 'cementSacks', label: 'Zementbedarf (25-kg-Säcke)', value: cementSacks25, formattedValue: cementSacks25 + ' Säcke (' + totalCementKg + ' kg)', highlight: true },
        secondary: [
          { id: 'gravelKg', label: 'Betonkies / Sand-Kies-Gemisch (0-16 mm)', value: totalGravelKg, formattedValue: formatNumber(totalGravelKg, 0) + ' kg (' + formatNumber(totalGravelKg / 1000, 2) + ' t)' },
          { id: 'waterL', label: 'Anmachwasser ca.', value: totalWaterL, formattedValue: totalWaterL + ' Liter (w/z ca. 0,55)' },
          { id: 'shovelRatio', label: 'Praxis-Faustformel in Schaufeln', value: shovelsGravelPerCement, formattedValue: '1 Schaufel Zement auf ' + shovelsGravelPerCement + ' Schaufeln Kies' },
        ],
        summaryText: 'Für ' + m3 + ' m³ Beton benötigen Sie ' + cementSacks25 + ' Säcke Zement (' + totalCementKg + ' kg), ca. ' + formatNumber(totalGravelKg / 1000, 2) + ' Tonnen Kies und rund ' + totalWaterL + ' Liter Wasser.',
      };
    },
    formula: "Standardbeton C20/25: ca. 300 kg Zement + 1.800 kg Betonkies + 165 l Wasser je m³",
    formulaExplanation: "Der Wasser-Zement-Wert (w/z) sollte für optimale Festigkeit zwischen 0,50 und 0,60 liegen. Zu viel Wasser schwächt den Beton und fördert Risse.",
    workedExample: {
          "title": "Beispiel: 0,5 m³ Beton für Gartenmauer-Fundament",
          "inputValues": [
                {
                      "label": "Volumen",
                      "value": "0,5 m³"
                },
                {
                      "label": "Güte",
                      "value": "C20/25 (1:4)"
                }
          ],
          "steps": [
                "Zement: 0,5 × 300 kg = 150 kg -> 6 Säcke à 25 kg",
                "Kies: 0,5 × 1.800 kg = 900 kg (ca. 0,9 Tonnen)",
                "Wasser: 0,5 × 165 l = 82,5 Liter"
          ],
          "result": "6 Säcke Zement, 900 kg Kies, 83 l Wasser"
    },
    faqs: [
          {
                "question": "Welche Körnung hat Betonkies üblicherweise?",
                "answer": "Für Standardbeton im Hoch- und Gartenbau wird Fertigbetonkies der Körnung 0/16 mm oder 0/32 mm verwendet, der bereits die ideale Sieblinie aus Sand und Steinen enthält."
          },
          {
                "question": "Wie lange muss Beton feucht gehalten werden?",
                "answer": "In den ersten Tagen nach dem Gießen muss Beton vor schnellem Austrocknen durch Sonne oder Wind geschützt werden (Nachbehandlung mit Folie oder Befeuchten), um Schwindrisse zu verhindern."
          }
    ],
    relatedSlugs: ["betonrechner","fundament-rechner","estrich-rechner"],
  },
  {
    id: "dreieck-flaeche-rechner",
    slug: "dreieck-flaeche-rechner",
    name: "Dreieck-Rechner (Fläche, Umfang & Heron-Formel)",
    shortName: "Dreieck-Rechner",
    category: "geometrie",
    subcategory: "Ebene Figuren",
    metaTitle: "Dreieck Rechner – Fläche berechnen nach Grundseite/Höhe & 3 Seiten",
    metaDescription: "Berechnen Sie die Dreiecksfläche über Grundseite und Höhe (A = 1/2 g h) oder über alle 3 Seiten nach dem Satz des Heron inklusive Umfang.",
    h1: "Dreieck Rechner – Flächeninhalt & Umfang für jedes Dreieck",
    shortDescription: "Berechnet Flächeninhalt und Umfang für beliebige Dreiecke.",
    searchKeywords: ["dreieck flaeche rechner","heron formel rechner 3 seiten","dreiecksflaeche berechnen grundseite hoehe","dreieck umfang formel"],
    inputs: [
          {
                "id": "calcMethod",
                "label": "Berechnungsmethode",
                "type": "select",
                "defaultValue": "baseHeight",
                "options": [
                      {
                            "value": "baseHeight",
                            "label": "Grundseite (g) & Höhe (h)"
                      },
                      {
                            "value": "threeSides",
                            "label": "3 Seiten (a, b, c nach Heron)"
                      }
                ]
          },
          {
                "id": "sideA",
                "label": "Grundseite g / Seite a",
                "type": "number",
                "defaultValue": 10,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "sideB_or_h",
                "label": "Höhe h / Seite b",
                "type": "number",
                "defaultValue": 6,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "sideC",
                "label": "Seite c (nur bei 3 Seiten)",
                "type": "number",
                "defaultValue": 8,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const method = inputs.calcMethod;
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
      };
    },
    formula: "A = 1/2 × g × h bzw. A = √(s × (s - a) × (s - b) × (s - c)) mit s = (a + b + c) / 2",
    formulaExplanation: "Der Satz des Heron ermöglicht die exakte Flächenberechnung eines Dreiecks allein aus der Kenntnis seiner drei Seitenlängen, ohne vorherige Höhenberechnung.",
    workedExample: {
          "title": "Beispiel: Dreieck mit a = 10 cm, b = 6 cm, c = 8 cm (rechtwinklig)",
          "inputValues": [
                {
                      "label": "a",
                      "value": "10 cm"
                },
                {
                      "label": "b",
                      "value": "6 cm"
                },
                {
                      "label": "c",
                      "value": "8 cm"
                }
          ],
          "steps": [
                "s = (10 + 6 + 8) / 2 = 12 cm",
                "A = √(12 × (12-10) × (12-6) × (12-8)) = √(12 × 2 × 6 × 4) = √576 = 24 cm²"
          ],
          "result": "24 cm² Fläche"
    },
    faqs: [
          {
                "question": "Wann gilt die Dreiecksungleichung?",
                "answer": "Drei Strecken bilden nur dann ein Dreieck, wenn die Summe zweier beliebiger Seiten stets strikt größer ist als die dritte Seite (a + b > c)."
          },
          {
                "question": "Wie berechnet man die Höhe im gleichseitigen Dreieck?",
                "answer": "Im gleichseitigen Dreieck mit Seitenlänge a gilt: h = (a / 2) × √3 ≈ 0,866 × a."
          }
    ],
    relatedSlugs: ["kreisrechner","rechteckrechner","satz-des-pythagoras-rechner"],
  },
  {
    id: "kreis-umfang-rechner",
    slug: "kreis-umfang-rechner",
    name: "Kreisumfang-Rechner (Umfang, Radius, Durchmesser & Fläche)",
    shortName: "Kreisumfang-Rechner",
    category: "geometrie",
    subcategory: "Ebene Figuren",
    metaTitle: "Kreisumfang Rechner – Umfang U = 2πr, Durchmesser d & Kreisfläche",
    metaDescription: "Berechnen Sie Kreisumfang, Kreisfläche, Radius und Durchmesser mit der Kreiszahl Pi (π). Sofortige Umrechnung bei Eingabe einer beliebigen Größe.",
    h1: "Kreisumfang Rechner – Umfang U = 2 · π · r & Durchmesser ermitteln",
    shortDescription: "Berechnet Kreisumfang, Durchmesser und Fläche aus dem Radius.",
    searchKeywords: ["kreisumfang rechner formel","umfang kreis durchmesser pi","kreisumfang u 2 pi r berechnen","kreis flaeche umfang umrechnen"],
    inputs: [
          {
                "id": "inputType",
                "label": "Eingegebene Größe",
                "type": "select",
                "defaultValue": "radius",
                "options": [
                      {
                            "value": "radius",
                            "label": "Radius (r)"
                      },
                      {
                            "value": "diameter",
                            "label": "Durchmesser (d)"
                      },
                      {
                            "value": "circumference",
                            "label": "Umfang (U)"
                      }
                ]
          },
          {
                "id": "inputValue",
                "label": "Wert der gewählten Größe",
                "type": "number",
                "defaultValue": 10,
                "min": 0.01,
                "max": 10000,
                "step": 0.1,
                "unit": "cm"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const type = inputs.inputType;
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
      };
    },
    formula: "U = 2 × π × r = π × d; A = π × r²",
    formulaExplanation: "Die Kreiszahl Pi (π ≈ 3,14159) beschreibt das feste Verhältnis zwischen dem Umfang eines jeden Kreises und seinem Durchmesser.",
    workedExample: {
          "title": "Beispiel: Kreis mit Durchmesser d = 10 cm",
          "inputValues": [
                {
                      "label": "Durchmesser",
                      "value": "10 cm"
                }
          ],
          "steps": [
                "Radius r = 10 / 2 = 5 cm",
                "Umfang U = π × 10 cm ≈ 31,42 cm",
                "Fläche A = π × 5² ≈ 78,54 cm²"
          ],
          "result": "U = 31,42 cm, A = 78,54 cm²"
    },
    faqs: [
          {
                "question": "Wie berechnet man den Durchmesser aus dem Umfang?",
                "answer": "Teilen Sie den Umfang einfach durch Pi: d = U / π. Bei einem Umfang von 31,4 cm ist der Durchmesser genau 10 cm."
          },
          {
                "question": "Was ist der Unterschied zwischen Radius und Durchmesser?",
                "answer": "Der Radius reicht vom Mittelpunkt bis zum Kreisrand. Der Durchmesser ist die längste Sehne durch den Mittelpunkt und genau doppelt so lang wie der Radius (d = 2r)."
          }
    ],
    relatedSlugs: ["kreisrechner","kugel-oberflaeche-rechner","kreissegment-rechner"],
  },
  {
    id: "kegel-volumen-rechner",
    slug: "kegel-volumen-rechner",
    name: "Kegel-Rechner (Volumen, Mantelfläche & Oberfläche)",
    shortName: "Kegel-Rechner",
    category: "geometrie",
    subcategory: "Körper",
    metaTitle: "Kegel Rechner – Volumen V = 1/3πr²h, Mantelfläche & Oberfläche berechnen",
    metaDescription: "Berechnen Sie das Volumen eines Kreiskegels (V = 1/3 · π · r² · h), die Mantellinie s, die Mantelfläche M und die Gesamtoberfläche O nach Radius und Höhe.",
    h1: "Kegel Rechner – Volumen, Mantellinie & Oberfläche ermitteln",
    shortDescription: "Berechnet Volumen, Mantelfläche und Gesamtoberfläche eines Kegels.",
    searchKeywords: ["kegel rechner volumen formel","kegel mantelflaeche oberflaeche berechnen","mantellinie s kegel pythagoras","kreiskegel volumen 1 drittel pi r2 h"],
    inputs: [
          {
                "id": "radius",
                "label": "Grundkreis-Radius (r)",
                "type": "number",
                "defaultValue": 6,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "height",
                "label": "Kegelhöhe (h)",
                "type": "number",
                "defaultValue": 8,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const r = Number(inputs.radius) || 0;
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
      };
    },
    formula: "V = 1/3 × π × r² × h; s = √(r² + h²); M = π × r × s; O = π × r × (r + s)",
    formulaExplanation: "Ein Kegel hat exakt ein Drittel des Volumens eines Zylinders mit gleichem Radius und gleicher Höhe.",
    workedExample: {
          "title": "Beispiel: Kegel mit r = 6 cm und h = 8 cm",
          "inputValues": [
                {
                      "label": "Radius",
                      "value": "6 cm"
                },
                {
                      "label": "Höhe",
                      "value": "8 cm"
                }
          ],
          "steps": [
                "s = √(6² + 8²) = √(36 + 64) = √100 = 10 cm",
                "V = 1/3 × π × 36 × 8 = 96 × π ≈ 301,59 cm³",
                "M = π × 6 × 10 = 60 × π ≈ 188,50 cm²",
                "O = π × 6 × (6 + 10) = 96 × π ≈ 301,59 cm²"
          ],
          "result": "V = 301,59 cm³, O = 301,59 cm²"
    },
    faqs: [
          {
                "question": "Wie verhält sich das Kegelvolumen zum Zylindervolumen?",
                "answer": "Das Kegelvolumen ist genau 1/3 des Zylindervolumens mit gleicher Grundfläche und Höhe. Drei gefüllte Kegel passen exakt in einen Zylinder."
          },
          {
                "question": "Was ist ein schiefer Kegel?",
                "answer": "Bei einem schiefen Kegel steht die Spitze nicht senkrecht über dem Mittelpunkt des Grundkreises. Die Volumenformel V = 1/3 · G · h (nach dem Prinzip von Cavalieri) gilt jedoch unverändert!"
          }
    ],
    relatedSlugs: ["zylinderrechner","kugel-oberflaeche-rechner","pyramide-volumen-rechner"],
  },
  {
    id: "hohlzylinder-rohr-rechner",
    slug: "hohlzylinder-rohr-rechner",
    name: "Hohlzylinder- & Rohr-Rechner (Volumen, Wandstärke & Materialgewicht)",
    shortName: "Rohr & Hohlzylinder",
    category: "geometrie",
    subcategory: "Körper",
    metaTitle: "Hohlzylinder Rechner – Rohr-Volumen, Wandstärke & Gewicht in kg",
    metaDescription: "Berechnen Sie das Materialvolumen, Innen-/Außenvolumen und Gewicht eines Hohlzylinders oder Metallrohrs nach Außendurchmesser, Wandstärke, Länge und Materialdichte.",
    h1: "Hohlzylinder Rechner – Rohrvolumen & Gewicht berechnen",
    shortDescription: "Ermittelt Materialvolumen und Gewicht von Rohren und zylindrischen Hülsen.",
    searchKeywords: ["hohlzylinder rechner volumen formel","rohr gewicht berechnen stahl kupfer","wandstaerke hohlzylinder pi r2","rohrvolumen berechnen"],
    inputs: [
          {
                "id": "outerDiameterMm",
                "label": "Außendurchmesser (D)",
                "type": "number",
                "defaultValue": 60,
                "min": 1,
                "max": 2000,
                "step": 1,
                "unit": "mm"
          },
          {
                "id": "wallThicknessMm",
                "label": "Wandstärke (s)",
                "type": "number",
                "defaultValue": 5,
                "min": 0.1,
                "max": 500,
                "step": 0.5,
                "unit": "mm"
          },
          {
                "id": "lengthM",
                "label": "Rohrlänge (L)",
                "type": "number",
                "defaultValue": 2,
                "min": 0.01,
                "max": 50,
                "step": 0.1,
                "unit": "m"
          },
          {
                "id": "material",
                "label": "Material & Dichte",
                "type": "select",
                "defaultValue": "steel",
                "options": [
                      {
                            "value": "steel",
                            "label": "Stahl / Eisen (ca. 7,85 kg/dm³)"
                      },
                      {
                            "value": "stainless",
                            "label": "Edelstahl V2A / V4A (ca. 7,95 kg/dm³)"
                      },
                      {
                            "value": "aluminum",
                            "label": "Aluminium (ca. 2,70 kg/dm³)"
                      },
                      {
                            "value": "copper",
                            "label": "Kupfer (ca. 8,96 kg/dm³)"
                      },
                      {
                            "value": "pvc",
                            "label": "PVC Kunststoff (ca. 1,40 kg/dm³)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const D_mm = Number(inputs.outerDiameterMm) || 0;
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
      };
    },
    formula: "V_Material = π × (R² - r²) × L; Masse = V_Material × Dichte; Innendurchmesser d = D - 2s",
    formulaExplanation: "Das Materialvolumen eines Hohlzylinders ergibt sich durch Subtraktion des inneren Zylinderhohlraums vom äußeren Gesamtzylinder.",
    workedExample: {
          "title": "Beispiel: Stahlrohr Ø 60,3 mm, Wand 3,2 mm, 6 Meter lang",
          "inputValues": [
                {
                      "label": "Außen-Ø",
                      "value": "60,3 mm"
                },
                {
                      "label": "Wand",
                      "value": "3,2 mm"
                },
                {
                      "label": "Länge",
                      "value": "6 m"
                }
          ],
          "steps": [
                "Innen-Ø = 60,3 - 6,4 = 53,9 mm",
                "Fläche = π × (3,015² - 2,695²) = 5,74 cm²",
                "Volumen = 5,74 × 600 cm = 3.444 cm³ = 3,44 dm³",
                "Gewicht = 3,44 dm³ × 7,85 kg/dm³ = 27,04 kg"
          ],
          "result": "27,04 kg (4,51 kg pro Meter)"
    },
    faqs: [
          {
                "question": "Wie berechnet man das Metergewicht eines Stahlrohrs?",
                "answer": "Faustformel für Stahlrohre: Metergewicht (kg/m) ≈ (Außendurchmesser in mm - Wandstärke in mm) × Wandstärke in mm × 0,02466."
          },
          {
                "question": "Wie viel Wasser passt in ein Heizungsrohr?",
                "answer": "Das Füllvolumen pro Meter beträgt: V = π × (Innendurchmesser in dm / 2)² × 10 Liter. Ein 22-mm-Rohr mit 1 mm Wand (20 mm innen) fasst ca. 0,31 Liter Wasser pro Meter."
          }
    ],
    relatedSlugs: ["zylinderrechner","kegel-volumen-rechner","quader-volumen-rechner"],
  },
  {
    id: "pyramide-volumen-rechner",
    slug: "pyramide-volumen-rechner",
    name: "Pyramide-Rechner (Volumen, Mantelfläche & Kantenlänge)",
    shortName: "Pyramide-Rechner",
    category: "geometrie",
    subcategory: "Körper",
    metaTitle: "Pyramide Rechner – Volumen V = 1/3a²h, Mantelfläche & Oberfläche berechnen",
    metaDescription: "Berechnen Sie das Volumen einer regelmäßigen quadratischen Pyramide (V = 1/3 · a² · h), die Seitenhöhe h_a, die Kantenlänge s und die Mantelfläche M.",
    h1: "Pyramide Rechner – Quadratische Pyramide berechnen",
    shortDescription: "Berechnet Volumen, Seitenkante, Mantelfläche und Gesamtoberfläche.",
    searchKeywords: ["pyramide rechner volumen formel","quadratische pyramide oberflaeche berechnen","seitenhoehe ha pyramide pythagoras","kantenlaenge s pyramide berechnen"],
    inputs: [
          {
                "id": "baseA",
                "label": "Grundkante (a)",
                "type": "number",
                "defaultValue": 10,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "heightH",
                "label": "Körperhöhe (h)",
                "type": "number",
                "defaultValue": 12,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const a = Number(inputs.baseA) || 0;
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
      };
    },
    formula: "V = 1/3 × a² × h; h_a = √(h² + (a/2)²); M = 2 × a × h_a; O = a² + M",
    formulaExplanation: "Genau wie beim Kegel beträgt das Volumen einer Pyramide exakt ein Drittel des umschriebenen Quaders (V = 1/3 · Grundfläche · Höhe).",
    workedExample: {
          "title": "Beispiel: Pyramide mit Grundkante a = 10 cm und Höhe h = 12 cm",
          "inputValues": [
                {
                      "label": "Grundkante a",
                      "value": "10 cm"
                },
                {
                      "label": "Höhe h",
                      "value": "12 cm"
                }
          ],
          "steps": [
                "V = 1/3 × 10² × 12 = 400 cm³",
                "h_a = √(12² + 5²) = √(144 + 25) = √169 = 13 cm",
                "M = 2 × 10 × 13 = 260 cm²",
                "O = 100 + 260 = 360 cm²"
          ],
          "result": "V = 400 cm³, O = 360 cm²"
    },
    faqs: [
          {
                "question": "Wie groß sind die Maße der Cheops-Pyramide?",
                "answer": "Die Cheops-Pyramide in Gizeh hatte ursprünglich eine Basiskante von ca. 230,3 Metern und eine Höhe von ca. 146,6 Metern, was einem Volumen von fast 2,6 Millionen m³ entspricht."
          },
          {
                "question": "Was ist ein regelmäßiges Tetraeder?",
                "answer": "Ein Tetraeder ist eine dreiseitige Pyramide, deren vier Flächen aus identischen gleichseitigen Dreiecken bestehen. Alle Kanten sind gleich lang."
          }
    ],
    relatedSlugs: ["kegel-volumen-rechner","quader-volumen-rechner","dreieck-flaeche-rechner"],
  },
  {
    id: "trapez-flaeche-rechner",
    slug: "trapez-flaeche-rechner",
    name: "Trapez-Rechner (Flächeninhalt, Mittellinie & Umfang)",
    shortName: "Trapez-Rechner",
    category: "geometrie",
    subcategory: "Ebene Figuren",
    metaTitle: "Trapez Rechner – Fläche A = ((a+c)/2) · h & Mittellinie m berechnen",
    metaDescription: "Berechnen Sie den Flächeninhalt eines Trapezes über die parallelen Grundseiten a und c, die Höhe h und die Mittellinie m = (a + c) / 2 inklusive Umfang.",
    h1: "Trapez Rechner – Flächeninhalt & Mittellinie für jedes Trapez",
    shortDescription: "Berechnet Flächeninhalt und Mittellinie für beliebige Trapeze.",
    searchKeywords: ["trapez rechner flaeche formel","trapezflaeche berechnen a c 2 mal h","mittellinie m trapez formel","trapez umfang berechnen"],
    inputs: [
          {
                "id": "sideA",
                "label": "Längere Grundseite (a)",
                "type": "number",
                "defaultValue": 12,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "sideC",
                "label": "Kürzere parallele Seite (c)",
                "type": "number",
                "defaultValue": 8,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "heightH",
                "label": "Höhe zwischen a und c (h)",
                "type": "number",
                "defaultValue": 5,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "sideB",
                "label": "Schenkel links (b – für Umfang)",
                "type": "number",
                "defaultValue": 6,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "sideD",
                "label": "Schenkel rechts (d – für Umfang)",
                "type": "number",
                "defaultValue": 6,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const a = Number(inputs.sideA) || 0;
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
      };
    },
    formula: "A = ((a + c) / 2) × h = m × h; m = (a + c) / 2; U = a + b + c + d",
    formulaExplanation: "Ein Trapez lässt sich gedanklich durch Halbieren und Umklappen in ein flächengleiches Rechteck der Länge m = (a+c)/2 und der Höhe h verwandeln.",
    workedExample: {
          "title": "Beispiel: Trapez mit a = 12 cm, c = 8 cm und Höhe h = 5 cm",
          "inputValues": [
                {
                      "label": "a",
                      "value": "12 cm"
                },
                {
                      "label": "c",
                      "value": "8 cm"
                },
                {
                      "label": "h",
                      "value": "5 cm"
                }
          ],
          "steps": [
                "m = (12 + 8) / 2 = 10 cm",
                "A = 10 cm × 5 cm = 50 cm²"
          ],
          "result": "50 cm² Flächeninhalt"
    },
    faqs: [
          {
                "question": "Wann ist ein Trapez gleichschenklig?",
                "answer": "Ein Trapez ist gleichschenklig, wenn die beiden nicht-parallelen Schenkel b und d gleich lang sind. Dann sind auch die Basiswinkel und die beiden Diagonalen exakt gleich groß."
          },
          {
                "question": "Was ist ein rechtwinkliges Trapez?",
                "answer": "In einem rechtwinkligen Trapez steht einer der beiden Schenkel senkrecht auf den Grundseiten a und c, sodass dieser Schenkel identisch mit der Höhe h ist."
          }
    ],
    relatedSlugs: ["parallelogramm-rechner","dreieck-flaeche-rechner","rechteckrechner"],
  },
  {
    id: "parallelogramm-rechner",
    slug: "parallelogramm-rechner",
    name: "Parallelogramm-Rechner (Fläche, Umfang & Höhen)",
    shortName: "Parallelogramm-Rechner",
    category: "geometrie",
    subcategory: "Ebene Figuren",
    metaTitle: "Parallelogramm Rechner – Fläche A = a · h_a, Umfang & Winkel berechnen",
    metaDescription: "Berechnen Sie den Flächeninhalt eines Parallelogramms (A = a · h_a = a · b · sin(α)), den Umfang (U = 2a + 2b) und die Diagonalen e und f.",
    h1: "Parallelogramm Rechner – Flächeninhalt, Umfang & Diagonalen",
    shortDescription: "Berechnet Flächeninhalt, Umfang und Diagonalen eines Parallelogramms.",
    searchKeywords: ["parallelogramm rechner flaeche formel","parallelogramm umfang 2a plus 2b","parallelogramm flaeche a mal ha","diagonalen parallelogramm kosinussatz"],
    inputs: [
          {
                "id": "sideA",
                "label": "Grundseite (a)",
                "type": "number",
                "defaultValue": 10,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "sideB",
                "label": "Zweite Seite (b)",
                "type": "number",
                "defaultValue": 6,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "angleDeg",
                "label": "Innenwinkel Alpha (α)",
                "type": "number",
                "defaultValue": 60,
                "min": 1,
                "max": 179,
                "step": 1,
                "unit": "°"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const a = Number(inputs.sideA) || 0;
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
      };
    },
    formula: "A = a × h_a = a × b × sin(α); U = 2 × (a + b); h_a = b × sin(α)",
    formulaExplanation: "Gegenüberliegende Seiten und Winkel in einem Parallelogramm sind exakt gleich groß. Die beiden benachbarten Winkel ergänzen sich immer zu 180°.",
    workedExample: {
          "title": "Beispiel: Parallelogramm a = 10 cm, b = 6 cm, α = 60°",
          "inputValues": [
                {
                      "label": "a",
                      "value": "10 cm"
                },
                {
                      "label": "b",
                      "value": "6 cm"
                },
                {
                      "label": "α",
                      "value": "60°"
                }
          ],
          "steps": [
                "h_a = 6 × sin(60°) = 6 × 0,866 = 5,196 cm",
                "A = 10 × 5,196 = 51,96 cm²",
                "U = 2 × (10 + 6) = 32 cm"
          ],
          "result": "A = 51,96 cm², U = 32 cm"
    },
    faqs: [
          {
                "question": "Was ist die Parallelogrammgleichung?",
                "answer": "Die Parallelogrammgleichung besagt, dass die Summe der Quadrate über den vier Seiten gleich der Summe der Quadrate der beiden Diagonalen ist: 2(a² + b²) = e² + f²."
          },
          {
                "question": "Ist jedes Rechteck ein Parallelogramm?",
                "answer": "Ja, ein Rechteck ist ein spezielles Parallelogramm, bei dem alle vier Innenwinkel genau 90° betragen."
          }
    ],
    relatedSlugs: ["trapez-flaeche-rechner","rhombus-raute-rechner","rechteckrechner"],
  },
  {
    id: "rhombus-raute-rechner",
    slug: "rhombus-raute-rechner",
    name: "Raute-Rechner (Rhombus-Fläche nach Diagonalen e & f)",
    shortName: "Raute-Rechner",
    category: "geometrie",
    subcategory: "Ebene Figuren",
    metaTitle: "Raute Rechner – Rhombus Fläche A = (e · f) / 2, Umfang & Seite berechnen",
    metaDescription: "Berechnen Sie Flächeninhalt einer Raute (A = (e · f) / 2), die Seitenlänge a, den Umfang (U = 4a) und den Inkreisradius aus den Diagonalen e und f.",
    h1: "Raute Rechner – Flächeninhalt, Seitenlänge & Umfang eines Rhombus",
    shortDescription: "Berechnet Fläche, Umfang und Seitenlänge einer Raute aus den Diagonalen.",
    searchKeywords: ["raute rechner flaeche diagonalen e f","rhombus flaeche formel 1 halbe e mal f","seitenlaenge raute berechnen pythagoras","umfang raute 4a"],
    inputs: [
          {
                "id": "diagE",
                "label": "Erste Diagonale (e)",
                "type": "number",
                "defaultValue": 12,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "diagF",
                "label": "Zweite Diagonale (f)",
                "type": "number",
                "defaultValue": 8,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const e = Number(inputs.diagE) || 0;
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
      };
    },
    formula: "A = (e × f) / 2; a = √((e/2)² + (f/2)²); U = 4 × a; r_In = (e × f) / (4 × a)",
    formulaExplanation: "In einer Raute stehen die beiden Diagonalen senkrecht aufeinander und halbieren sich gegenseitig. Dadurch zerlegen sie die Raute in vier kongruente rechtwinklige Dreiecke.",
    workedExample: {
          "title": "Beispiel: Raute mit Diagonalen e = 12 cm und f = 8 cm",
          "inputValues": [
                {
                      "label": "e",
                      "value": "12 cm"
                },
                {
                      "label": "f",
                      "value": "8 cm"
                }
          ],
          "steps": [
                "A = (12 × 8) / 2 = 48 cm²",
                "a = √(6² + 4²) = √(36 + 16) = √52 ≈ 7,21 cm",
                "U = 4 × 7,21 = 28,84 cm"
          ],
          "result": "A = 48 cm², a = 7,21 cm"
    },
    faqs: [
          {
                "question": "Stehen die Diagonalen in jeder Raute senkrecht aufeinander?",
                "answer": "Ja, das ist das zentrale geometrische Kennzeichen jeder Raute: e und f schneiden sich stets im 90°-Winkel und halbieren zugleich die Innenwinkel."
          },
          {
                "question": "Ist ein Quadrat auch eine Raute?",
                "answer": "Ja, ein Quadrat ist eine spezielle Raute, bei der alle vier Innenwinkel 90° betragen (und somit beide Diagonalen exakt gleich lang sind)."
          }
    ],
    relatedSlugs: ["parallelogramm-rechner","trapez-flaeche-rechner","dreieck-flaeche-rechner"],
  },
  {
    id: "kugel-oberflaeche-rechner",
    slug: "kugel-oberflaeche-rechner",
    name: "Kugel-Rechner (Volumen V = 4/3πr³ & Oberfläche O = 4πr²)",
    shortName: "Kugel-Rechner",
    category: "geometrie",
    subcategory: "Körper",
    metaTitle: "Kugel Rechner – Kugelvolumen V = 4/3πr³ & Kugeloberfläche berechnen",
    metaDescription: "Berechnen Sie Kugelvolumen (V = 4/3 · π · r³), Kugeloberfläche (O = 4 · π · r²), Durchmesser und Kreisumfang nach Radius oder Durchmesser.",
    h1: "Kugel Rechner – Kugelvolumen & Kugeloberfläche berechnen",
    shortDescription: "Berechnet Kugelvolumen, Oberfläche und Umfang aus dem Radius.",
    searchKeywords: ["kugel rechner volumen formel 4 drittel pi r3","kugeloberflaeche berechnen 4 pi r2","kugel volumen radius durchmesser","kugelumfang grosskreis berechnen"],
    inputs: [
          {
                "id": "inputType",
                "label": "Eingegebene Dimension",
                "type": "select",
                "defaultValue": "radius",
                "options": [
                      {
                            "value": "radius",
                            "label": "Radius (r)"
                      },
                      {
                            "value": "diameter",
                            "label": "Durchmesser (d)"
                      },
                      {
                            "value": "volume",
                            "label": "Volumen (V)"
                      }
                ]
          },
          {
                "id": "inputValue",
                "label": "Wert",
                "type": "number",
                "defaultValue": 10,
                "min": 0.1,
                "max": 10000,
                "step": 0.1,
                "unit": "cm bzw. cm³"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const type = inputs.inputType;
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
      };
    },
    formula: "V = 4/3 × π × r³; O = 4 × π × r² = π × d²; U = 2 × π × r",
    formulaExplanation: "Die Kugel besitzt von allen dreidimensionalen Körpern die kleinste Oberfläche bei gegebenem Volumen, weshalb Wassertropfen und Seifenblasen von Natur aus Kugelform annehmen.",
    workedExample: {
          "title": "Beispiel: Kugel mit Radius r = 10 cm",
          "inputValues": [
                {
                      "label": "Radius",
                      "value": "10 cm"
                }
          ],
          "steps": [
                "V = 4/3 × π × 10³ = 4.188,79 cm³ (ca. 4,19 Liter)",
                "O = 4 × π × 10² = 1.256,64 cm²",
                "U = 2 × π × 10 = 62,83 cm"
          ],
          "result": "V = 4.188,79 cm³, O = 1.256,64 cm²"
    },
    faqs: [
          {
                "question": "Wie verhält sich das Kugelvolumen bei Verdopplung des Radius?",
                "answer": "Da der Radius in der dritten Potenz (r³) steht, verachtfacht (2³ = 8) sich das Kugelvolumen bei einer Verdoppelung des Radius! Die Oberfläche vervierfacht (2² = 4) sich."
          },
          {
                "question": "Wer entdeckte die Kugelformeln?",
                "answer": "Archimedes von Syrakus bewies im 3. Jahrhundert v. Chr., dass das Volumen und die Oberfläche einer Kugel genau 2/3 des umbeschriebenen Zylinders betragen."
          }
    ],
    relatedSlugs: ["kreisrechner","kegel-volumen-rechner","zylinderrechner"],
  },
  {
    id: "quader-volumen-rechner",
    slug: "quader-volumen-rechner",
    name: "Quader-Rechner (Volumen, Oberfläche & Raumdiagonale)",
    shortName: "Quader-Rechner",
    category: "geometrie",
    subcategory: "Körper",
    metaTitle: "Quader Rechner – Volumen V = a · b · c, Oberfläche & Raumdiagonale",
    metaDescription: "Berechnen Sie das Quadervolumen (V = a · b · c), die Gesamtoberfläche (O = 2(ab + bc + ca)) und die 3D-Raumdiagonale d = √(a² + b² + c²) nach den Kantenlängen.",
    h1: "Quader Rechner – Volumen, Oberfläche & Raumdiagonale berechnen",
    shortDescription: "Berechnet Volumen, Oberfläche und Raumdiagonale eines Quaders.",
    searchKeywords: ["quader rechner volumen a b c","quader oberflaeche formel berechnen","raumdiagonale quader pythagoras 3d","quader kantenlaenge volumen"],
    inputs: [
          {
                "id": "lengthA",
                "label": "Länge (a)",
                "type": "number",
                "defaultValue": 10,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "widthB",
                "label": "Breite (b)",
                "type": "number",
                "defaultValue": 6,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "heightC",
                "label": "Höhe (c)",
                "type": "number",
                "defaultValue": 4,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const a = Number(inputs.lengthA) || 0;
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
      };
    },
    formula: "V = a × b × c; O = 2 × (ab + bc + ca); d = √(a² + b² + c²)",
    formulaExplanation: "Die Raumdiagonale verbindet zwei gegenüberliegende Ecken durch das Innere des Quaders und lässt sich über den doppelten Satz des Pythagoras ermitteln.",
    workedExample: {
          "title": "Beispiel: Quader mit a = 10 cm, b = 6 cm, c = 4 cm",
          "inputValues": [
                {
                      "label": "a",
                      "value": "10 cm"
                },
                {
                      "label": "b",
                      "value": "6 cm"
                },
                {
                      "label": "c",
                      "value": "4 cm"
                }
          ],
          "steps": [
                "V = 10 × 6 × 4 = 240 cm³",
                "O = 2 × (60 + 24 + 40) = 2 × 124 = 248 cm²",
                "d = √(100 + 36 + 16) = √152 ≈ 12,33 cm"
          ],
          "result": "V = 240 cm³, O = 248 cm², d = 12,33 cm"
    },
    faqs: [
          {
                "question": "Wann ist ein Quader ein Würfel?",
                "answer": "Ein Quader ist ein Würfel (Hexaeder), wenn alle drei Kantenlängen gleich lang sind (a = b = c). Dann gilt V = a³ und O = 6a²."
          },
          {
                "question": "Wie viele Ecken, Kanten und Flächen hat ein Quader?",
                "answer": "Ein Quader besitzt genau 8 rechtwinklige Ecken, 12 Kanten und 6 paarweise zueinander parallele und kongruente Rechteckflächen."
          }
    ],
    relatedSlugs: ["rechteckrechner","pyramide-volumen-rechner","zylinderrechner"],
  },
  {
    id: "prisma-volumen-rechner",
    slug: "prisma-volumen-rechner",
    name: "Prisma-Rechner (Volumen, Mantelfläche & Dreiecksprisma)",
    shortName: "Prisma-Rechner",
    category: "geometrie",
    subcategory: "Körper",
    metaTitle: "Prisma Rechner – Prisma Volumen V = G · h & Gesamtoberfläche berechnen",
    metaDescription: "Berechnen Sie das Volumen eines geraden Dreiecksprismas oder allgemeinen Prismas (V = Grundfläche · Höhe), die Mantelfläche und die Gesamtoberfläche O = 2G + M.",
    h1: "Prisma Rechner – Volumen & Oberfläche für Dreiecksprismen",
    shortDescription: "Berechnet Volumen, Mantelfläche und Oberfläche von geraden Prismen.",
    searchKeywords: ["prisma rechner volumen formel grundflaeche hoehe","dreiecksprisma volumen berechnen","prisma oberflaeche 2g plus m","mantelflaeche prisma berechnen"],
    inputs: [
          {
                "id": "baseAreaG",
                "label": "Grundfläche des Prismas (G)",
                "type": "number",
                "defaultValue": 25,
                "min": 0.1,
                "max": 10000,
                "step": 0.1,
                "unit": "cm²"
          },
          {
                "id": "perimeterU",
                "label": "Umfang der Grundfläche (U)",
                "type": "number",
                "defaultValue": 22,
                "min": 0.1,
                "max": 10000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "heightH",
                "label": "Körperhöhe des Prismas (h)",
                "type": "number",
                "defaultValue": 15,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const g = Number(inputs.baseAreaG) || 0;
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
      };
    },
    formula: "V = G × h; M = U × h; O = 2 × G + M",
    formulaExplanation: "Ein gerades Prisma entsteht durch das Verschieben einer beliebigen ebenen Grundfläche G entlang einer Höhe h senkrecht zur Grundfläche.",
    workedExample: {
          "title": "Beispiel: Dreiecksprisma mit G = 25 cm², U = 22 cm und Höhe h = 15 cm",
          "inputValues": [
                {
                      "label": "G",
                      "value": "25 cm²"
                },
                {
                      "label": "U",
                      "value": "22 cm"
                },
                {
                      "label": "h",
                      "value": "15 cm"
                }
          ],
          "steps": [
                "V = 25 × 15 = 375 cm³",
                "M = 22 × 15 = 330 cm²",
                "O = 2 × 25 + 330 = 50 + 330 = 380 cm²"
          ],
          "result": "V = 375 cm³, O = 380 cm²"
    },
    faqs: [
          {
                "question": "Was ist der Unterschied zwischen Zylinder und Prisma?",
                "answer": "Ein Zylinder hat einen Kreis als Grundfläche, während ein Prisma ein beliebiges Vieleck (Dreieck, Viereck, Sechseck etc.) als Grundfläche besitzt. Die Volumenformel V = G · h ist für beide identisch!"
          },
          {
                "question": "Gilt die Formel V = G · h auch für schiefe Prismen?",
                "answer": "Ja, nach dem Prinzip von Cavalieri gilt V = G · h für alle Prismen, solange h der senkrechte Abstand zwischen Grund- und Deckfläche ist."
          }
    ],
    relatedSlugs: ["zylinderrechner","quader-volumen-rechner","dreieck-flaeche-rechner"],
  },
  {
    id: "sechseck-polygon-rechner",
    slug: "sechseck-polygon-rechner",
    name: "Sechseck-Rechner (Regelmäßiges Hexagon, Fläche & Inkreis)",
    shortName: "Sechseck-Rechner",
    category: "geometrie",
    subcategory: "Ebene Figuren",
    metaTitle: "Sechseck Rechner – Regelmäßiges Hexagon Fläche A, Umfang & Inkreis",
    metaDescription: "Berechnen Sie die Fläche eines regelmäßigen Sechsecks (A = (3√3 / 2) · a²), den Umfang (U = 6a), den Inkreisradius r_i und den Umkreisradius r_u = a.",
    h1: "Sechseck Rechner – Hexagon Flächeninhalt & Inkreis berechnen",
    shortDescription: "Berechnet Fläche, Umfang, Inkreis- und Umkreisradius eines Sechsecks.",
    searchKeywords: ["sechseck rechner flaeche formel hexagon","regelmaessiges sechseck inkreisradius umkreisradius","flaecheninhalt sechseck 3 wurzel 3 halbe a2","hexagon umfang 6a"],
    inputs: [
          {
                "id": "sideA",
                "label": "Seitenlänge des Sechsecks (a)",
                "type": "number",
                "defaultValue": 8,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const a = Number(inputs.sideA) || 0;
      
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
      };
    },
    formula: "A = (3 × √3 / 2) × a² ≈ 2,598 × a²; U = 6 × a; r_i = (√3 / 2) × a; r_u = a",
    formulaExplanation: "Ein regelmäßiges Sechseck besteht aus exakt sechs lückenlos aneinandergereihten, gleichseitigen Dreiecken mit Seitenlänge a.",
    workedExample: {
          "title": "Beispiel: Regelmäßiges Sechseck mit Seite a = 8 cm",
          "inputValues": [
                {
                      "label": "Seitenlänge a",
                      "value": "8 cm"
                }
          ],
          "steps": [
                "A = (3 × 1,732 / 2) × 8² = 2,598 × 64 = 166,28 cm²",
                "U = 6 × 8 = 48 cm",
                "Inkreisradius r_i = (√3 / 2) × 8 ≈ 6,93 cm"
          ],
          "result": "A = 166,28 cm², U = 48 cm, r_i = 6,93 cm"
    },
    faqs: [
          {
                "question": "Warum bauen Bienen sechseckige Waben?",
                "answer": "Das Sechseck ist mathematisch die geometrische Figur, die eine Fläche mit dem geringstmöglichen Umfang lückenlos parkettiert. Dadurch sparen Bienen maximal Wachs und Energie."
          },
          {
                "question": "Was ist die Schlüsselweite bei einer Sechskantschraube?",
                "answer": "Die Schlüsselweite (SW) ist der parallele Abstand zweier gegenüberliegender Seiten des Sechskants und entspricht exakt dem doppelten Inkreisradius: SW = a · √3."
          }
    ],
    relatedSlugs: ["dreieck-flaeche-rechner","kreis-umfang-rechner","rechteckrechner"],
  },
  {
    id: "ellipse-flaeche-rechner",
    slug: "ellipse-flaeche-rechner",
    name: "Ellipse-Rechner (Fläche A = π · a · b & Ramanujan-Umfang)",
    shortName: "Ellipse-Rechner",
    category: "geometrie",
    subcategory: "Ebene Figuren",
    metaTitle: "Ellipse Rechner – Ellipsenfläche A = πab & Umfang nach Ramanujan",
    metaDescription: "Berechnen Sie die Fläche einer Ellipse (A = π · a · b), den präzisen Umfang nach der Ramanujan-Formel und die lineare Exzentrizität aus den Halbachsen a und b.",
    h1: "Ellipse Rechner – Ellipsenfläche, Umfang & Brennpunkte",
    shortDescription: "Berechnet Flächeninhalt, Umfang und Brennpunkte einer Ellipse.",
    searchKeywords: ["ellipse rechner flaeche formel pi a b","ellipsenumfang ramanujan naeherung","halbachsen a b ellipse berechnen","lineare exzentrizitaet brennpunkt ellipse"],
    inputs: [
          {
                "id": "axisA",
                "label": "Große Halbachse (a)",
                "type": "number",
                "defaultValue": 10,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "axisB",
                "label": "Kleine Halbachse (b)",
                "type": "number",
                "defaultValue": 6,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const a = Math.max(Number(inputs.axisA) || 0, Number(inputs.axisB) || 0);
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
      };
    },
    formula: "A = π × a × b; U ≈ π(a+b)(1 + 3h / (10 + √(4 - 3h))) mit h = (a-b)²/(a+b)²",
    formulaExplanation: "Während die Fläche einer Ellipse exakt berechnet werden kann, lässt sich der Umfang einer Ellipse nicht durch elementare Funktionen, sondern nur über elliptische Integrale oder hochpräzise Näherungen (Ramanujan) ermitteln.",
    workedExample: {
          "title": "Beispiel: Ellipse mit a = 10 cm und b = 6 cm",
          "inputValues": [
                {
                      "label": "a",
                      "value": "10 cm"
                },
                {
                      "label": "b",
                      "value": "6 cm"
                }
          ],
          "steps": [
                "A = π × 10 × 6 = 60 × π ≈ 188,50 cm²",
                "e = √(10² - 6²) = √(100 - 36) = √64 = 8 cm",
                "Umfang nach Ramanujan ≈ 51,05 cm"
          ],
          "result": "A = 188,50 cm², U = 51,05 cm"
    },
    faqs: [
          {
                "question": "Wo liegen die Brennpunkte einer Ellipse?",
                "answer": "Die beiden Brennpunkte F1 und F2 liegen symmetrisch auf der Hauptachse im Abstand e = √(a² - b²) vom Zentrum. Für jeden Punkt auf der Ellipse ist die Summe der Abstände zu den beiden Brennpunkten konstant 2a."
          },
          {
                "question": "Was besagt das 1. Keplersche Gesetz?",
                "answer": "Die Planeten unseres Sonnensystems bewegen sich auf elliptischen Bahnen um die Sonne, wobei die Sonne in einem der beiden Brennpunkte steht."
          }
    ],
    relatedSlugs: ["kreis-umfang-rechner","kreisrechner","rechteckrechner"],
  },
  {
    id: "kreissegment-rechner",
    slug: "kreissegment-rechner",
    name: "Kreissektor- & Kreissegment-Rechner (Bogenlänge, Sehne & Fläche)",
    shortName: "Kreissektor & Segment",
    category: "geometrie",
    subcategory: "Ebene Figuren",
    metaTitle: "Kreissektor & Segment Rechner – Bogenlänge, Sehnenlänge & Fläche",
    metaDescription: "Berechnen Sie Kreissektor (Tortenstück), Bogenlänge b = (α/180)·π·r, Sehnenlänge s = 2r·sin(α/2) und die Kreissegment-Fläche aus Radius und Mittelpunktswinkel.",
    h1: "Kreissektor & Kreissegment Rechner – Bogenlänge & Teilflächen",
    shortDescription: "Berechnet Kreissektor, Kreissegment, Bogenlänge und Sehnenlänge.",
    searchKeywords: ["kreissektor rechner flaeche bogenlaenge","kreissegment berechnen radius sehne","bogenlaenge b alpha 180 pi r","sehnenlaenge kreis berechnen formel"],
    inputs: [
          {
                "id": "radius",
                "label": "Kreisradius (r)",
                "type": "number",
                "defaultValue": 10,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "angleAlpha",
                "label": "Mittelpunktswinkel Alpha (α)",
                "type": "number",
                "defaultValue": 60,
                "min": 1,
                "max": 360,
                "step": 1,
                "unit": "°"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const r = Number(inputs.radius) || 0;
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
      };
    },
    formula: "b = (α / 180°) × π × r; A_Sektor = (α / 360°) × π × r²; s = 2r × sin(α/2); A_Segment = A_Sektor - A_Dreieck",
    formulaExplanation: "Ein Kreissektor entspricht einem Kuchenstück vom Mittelpunkt bis zum Rand. Ein Kreissegment entsteht, wenn man die beiden Endpunkte des Bogens durch eine gerade Sehne verbindet.",
    workedExample: {
          "title": "Beispiel: r = 10 cm, Winkel α = 60° (gleichseitiges Dreieck)",
          "inputValues": [
                {
                      "label": "Radius",
                      "value": "10 cm"
                },
                {
                      "label": "Winkel",
                      "value": "60°"
                }
          ],
          "steps": [
                "Bogenlänge b = (60 / 180) × π × 10 = (1/3) × 31,42 = 10,47 cm",
                "Sektor A = (60 / 360) × π × 100 = 52,36 cm²",
                "Sehne s = 2 × 10 × sin(30°) = 20 × 0,5 = 10,00 cm",
                "Segment = 52,36 - (0,5 × 100 × sin(60°)) = 52,36 - 43,30 = 9,06 cm²"
          ],
          "result": "b = 10,47 cm, Sektor = 52,36 cm², Segment = 9,06 cm²"
    },
    faqs: [
          {
                "question": "Was ist der Unterschied zwischen Sektor und Segment?",
                "answer": "Der Sektor wird vom Kreisbogen und zwei Radien begrenzt (wie ein Stück Pizza). Das Segment wird vom Kreisbogen und der geraden Sehne begrenzt (wie die abgeschnittene Kappe eines Kreises)."
          },
          {
                "question": "Wie berechnet man den Bogen im Bogenmaß (Radiant)?",
                "answer": "Im Bogenmaß gilt einfach b = r · φ (Winkel im Radiant). Es ist keine Umrechnung über 180° oder Pi nötig."
          }
    ],
    relatedSlugs: ["kreis-umfang-rechner","kreisrechner","dreieck-flaeche-rechner"],
  },
  {
    id: "bogenmass-grad-rechner",
    slug: "bogenmass-grad-rechner",
    name: "Winkelumrechner (Grad, Bogenmaß Radiant & Neugrad Gon)",
    shortName: "Winkelumrechner",
    category: "geometrie",
    subcategory: "Ebene Figuren",
    metaTitle: "Winkelumrechner – Grad [°], Bogenmaß [rad] & Neugrad [gon] umrechnen",
    metaDescription: "Rechnen Sie Winkel sekundenschnell um zwischen Altgrad (0°-360°), Bogenmaß Radiant (0-2π rad) und Neugrad Gon (0-400 gon) inklusive Sinus- und Kosinus-Werten.",
    h1: "Winkelumrechner – Grad, Radiant & Gon präzise umrechnen",
    shortDescription: "Konvertiert Winkel zwischen Grad (°), Radiant (rad) und Neugrad (gon).",
    searchKeywords: ["winkel umrechnen grad rad radiant","bogenmass in grad umrechnen pi","neugrad gon grad rechner","sinus kosinus winkel berechnen"],
    inputs: [
          {
                "id": "angleVal",
                "label": "Winkelwert",
                "type": "number",
                "defaultValue": 180,
                "min": -3600,
                "max": 3600,
                "step": 1,
                "unit": "Winkel"
          },
          {
                "id": "unit",
                "label": "Eingegebene Einheit",
                "type": "select",
                "defaultValue": "deg",
                "options": [
                      {
                            "value": "deg",
                            "label": "Altgrad / Grad (360° Vollkreis)"
                      },
                      {
                            "value": "rad",
                            "label": "Bogenmaß / Radiant (2π rad Vollkreis)"
                      },
                      {
                            "value": "gon",
                            "label": "Neugrad / Gon (400 gon Vollkreis)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const val = Number(inputs.angleVal) || 0;
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
        summaryText: val + ' ' + String(unit || 'DEG').toUpperCase() + ' entsprechen genau ' + formatNumber(deg, 2) + ' Grad, ' + formatNumber(rad, 4) + ' Radiant (' + formatNumber(piMultiple, 2) + ' π) und ' + formatNumber(gon, 2) + ' Gon.',
      };
    },
    formula: "rad = deg × (π / 180°); deg = rad × (180° / π); gon = deg / 0,9",
    formulaExplanation: "Ein Vollkreis hat 360 Altgrad, 400 Gon (Neugrad) und 2π Radiant (ca. 6,283 rad). Radiant ist die offizielle SI-Einheit für ebene Winkel in der Mathematik.",
    workedExample: {
          "title": "Beispiel: 90 Grad (rechter Winkel)",
          "inputValues": [
                {
                      "label": "Grad",
                      "value": "90°"
                }
          ],
          "steps": [
                "Radiant = 90 × (π / 180) = π / 2 ≈ 1,5708 rad",
                "Gon = 90 / 0,9 = 100 gon"
          ],
          "result": "1,5708 rad = 100 gon"
    },
    faqs: [
          {
                "question": "Warum nutzt die höhere Mathematik das Bogenmaß?",
                "answer": "Im Bogenmaß entsprechen Ableitungen trigonometrischer Funktionen einfachen Ausdrücken ohne Umrechnungsfaktoren: d/dx sin(x) = cos(x) gilt exakt nur, wenn x im Radiant gemessen wird."
          },
          {
                "question": "Wo wird Neugrad (Gon) verwendet?",
                "answer": "Neugrad wird vor allem im Vermessungswesen (Geodäsie) verwendet, da der rechte Winkel genau 100 Gon beträgt und Dezimalrechnungen stark vereinfacht."
          }
    ],
    relatedSlugs: ["kreissegment-rechner","dreieck-flaeche-rechner","kreis-umfang-rechner"],
  },
  {
    id: "satz-des-pythagoras-rechner",
    slug: "satz-des-pythagoras-rechner",
    name: "Satz-des-Pythagoras-Rechner (a² + b² = c² & Kathetensatz)",
    shortName: "Pythagoras-Rechner",
    category: "geometrie",
    subcategory: "Ebene Figuren",
    metaTitle: "Satz des Pythagoras Rechner – a² + b² = c² Katheten & Hypotenuse",
    metaDescription: "Berechnen Sie Hypotenuse c oder Kathete a/b im rechtwinkligen Dreieck nach dem Satz des Pythagoras a² + b² = c² inklusive Höhen- und Kathetensatz.",
    h1: "Satz des Pythagoras Rechner – a² + b² = c² sofort berechnen",
    shortDescription: "Berechnet Hypotenuse oder Kathete im rechtwinkligen Dreieck.",
    searchKeywords: ["satz des pythagoras rechner formel","a2 plus b2 gleich c2 rechner","hypotenuse berechnen rechtwinkliges dreieck","kathete a b pythagoras formel"],
    inputs: [
          {
                "id": "calcMode",
                "label": "Gesuchte Seite",
                "type": "select",
                "defaultValue": "c",
                "options": [
                      {
                            "value": "c",
                            "label": "Hypotenuse c gesucht (Katheten a und b gegeben)"
                      },
                      {
                            "value": "a",
                            "label": "Kathete a gesucht (Kathete b und Hypotenuse c gegeben)"
                      },
                      {
                            "value": "b",
                            "label": "Kathete b gesucht (Kathete a und Hypotenuse c gegeben)"
                      }
                ]
          },
          {
                "id": "val1",
                "label": "Erster gegebener Wert",
                "type": "number",
                "defaultValue": 3,
                "min": 0.1,
                "max": 10000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "val2",
                "label": "Zweiter gegebener Wert",
                "type": "number",
                "defaultValue": 4,
                "min": 0.1,
                "max": 10000,
                "step": 0.1,
                "unit": "cm"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const mode = inputs.calcMode;
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
      };
    },
    formula: "c = √(a² + b²); a = √(c² - b²); b = √(c² - a²)",
    formulaExplanation: "In jedem rechtwinkligen Dreieck ist die Summe der Flächeninhalte der beiden Kathetenquadrate gleich dem Flächeninhalt des Hypotenusenquadrats.",
    workedExample: {
          "title": "Beispiel: Klassisches pythagoreisches Tripel (3, 4, 5)",
          "inputValues": [
                {
                      "label": "Kathete a",
                      "value": "3 cm"
                },
                {
                      "label": "Kathete b",
                      "value": "4 cm"
                }
          ],
          "steps": [
                "c² = 3² + 4² = 9 + 16 = 25",
                "c = √25 = 5 cm"
          ],
          "result": "c = 5 cm Hypotenuse"
    },
    faqs: [
          {
                "question": "Was sind pythagoreische Tripel?",
                "answer": "Das sind ganzzahlige Lösungen der Gleichung a² + b² = c². Bekannte Tripel sind (3, 4, 5), (5, 12, 13), (8, 15, 17) und (7, 24, 25) sowie deren Vielfache."
          },
          {
                "question": "Gilt der Satz des Pythagoras auch bei stumpfwinkligen Dreiecken?",
                "answer": "Nein, der Satz des Pythagoras gilt streng nur bei Dreiecken mit genau einem 90°-Winkel. Für allgemeine Dreiecke gilt der verallgemeinerte Kosinussatz c² = a² + b² - 2ab·cos(γ)."
          }
    ],
    relatedSlugs: ["dreieck-flaeche-rechner","sinussatz-kosinussatz-rechner","rechteckrechner"],
  },
  {
    id: "sinussatz-kosinussatz-rechner",
    slug: "sinussatz-kosinussatz-rechner",
    name: "Sinussatz- & Kosinussatz-Rechner (Allgemeines Dreieck lösen)",
    shortName: "Sinus- & Kosinussatz",
    category: "geometrie",
    subcategory: "Ebene Figuren",
    metaTitle: "Sinussatz & Kosinussatz Rechner – Dreiecksberechnung Seiten & Winkel",
    metaDescription: "Lösen Sie beliebige Dreiecke mit dem Sinussatz (a/sin(α) = b/sin(β)) und Kosinussatz (c² = a² + b² - 2ab·cos(γ)) nach SSS, SWS, WSW oder SSW.",
    h1: "Sinussatz & Kosinussatz Rechner – Allgemeines Dreieck berechnen",
    shortDescription: "Berechnet Seiten und Winkel in beliebigen Dreiecken.",
    searchKeywords: ["sinussatz rechner dreieck a sin alpha","kosinussatz rechner c2 a2 b2","dreieck aufloesen sws sss","innenwinkel dreieck trigonometrie"],
    inputs: [
          {
                "id": "sideA",
                "label": "Seite a",
                "type": "number",
                "defaultValue": 8,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "sideB",
                "label": "Seite b",
                "type": "number",
                "defaultValue": 10,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "angleGamma",
                "label": "Eingeschlossener Winkel Gamma (γ)",
                "type": "number",
                "defaultValue": 50,
                "min": 1,
                "max": 178,
                "step": 1,
                "unit": "°"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const a = Number(inputs.sideA) || 0;
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
      };
    },
    formula: "c² = a² + b² - 2ab × cos(γ); a / sin(α) = b / sin(β) = c / sin(γ)",
    formulaExplanation: "Der Kosinussatz ist die Verallgemeinerung des Satzes des Pythagoras für alle Dreiecke. Er kommt zum Einsatz, wenn zwei Seiten und der eingeschlossene Winkel bekannt sind.",
    workedExample: {
          "title": "Beispiel: a = 8 cm, b = 10 cm, γ = 50°",
          "inputValues": [
                {
                      "label": "a",
                      "value": "8 cm"
                },
                {
                      "label": "b",
                      "value": "10 cm"
                },
                {
                      "label": "γ",
                      "value": "50°"
                }
          ],
          "steps": [
                "c² = 8² + 10² - 2 × 8 × 10 × cos(50°) = 64 + 100 - 160 × 0,6428 = 61,15",
                "c = √61,15 ≈ 7,82 cm"
          ],
          "result": "c = 7,82 cm"
    },
    faqs: [
          {
                "question": "Wann verwendet man den Sinussatz und wann den Kosinussatz?",
                "answer": "Den Kosinussatz verwendet man bei SSS (drei Seiten bekannt) und SWS (zwei Seiten und der eingeschlossene Winkel). Den Sinussatz verwendet man bei WSW (eine Seite und zwei Winkel) sowie SSW."
          },
          {
                "question": "Was ist der mehrdeutige Fall beim Sinussatz?",
                "answer": "Wenn zwei Seiten und ein der kleineren Seite gegenüberliegender Winkel gegeben sind (Ssw), kann es zwei verschiedene Dreiecke (spitzwinklig oder stumpfwinklig) geben."
          }
    ],
    relatedSlugs: ["satz-des-pythagoras-rechner","dreieck-flaeche-rechner","bogenmass-grad-rechner"],
  },
  {
    id: "vektor-skalarprodukt-rechner",
    slug: "vektor-skalarprodukt-rechner",
    name: "Vektor-Skalarprodukt-Rechner (3D-Vektoren & Schnittwinkel)",
    shortName: "Skalarprodukt-Rechner",
    category: "geometrie",
    subcategory: "Vektorrechnung",
    metaTitle: "Skalarprodukt Rechner – Vektoren 3D, Skalarprodukt & Winkel berechnen",
    metaDescription: "Berechnen Sie das Skalarprodukt zweier 3D-Vektoren (a · b = ax·bx + ay·by + az·bz), deren Beträge (Längen) und den eingeschlossenen Schnittwinkel in Grad.",
    h1: "Skalarprodukt Rechner – Skalarprodukt, Vektorbetrag & Schnittwinkel",
    shortDescription: "Berechnet Skalarprodukt, Betrag und Schnittwinkel zweier 3D-Vektoren.",
    searchKeywords: ["skalarprodukt rechner 3d vektoren","vektor schnittwinkel berechnen cosinus","betrag vektor laenge sqrt ax2 ay2 az2","orthogonale vektoren skalarprodukt null"],
    inputs: [
          {
                "id": "ax",
                "label": "Vektor a_x",
                "type": "number",
                "defaultValue": 2,
                "min": -1000,
                "max": 1000,
                "step": 0.1,
                "unit": ""
          },
          {
                "id": "ay",
                "label": "Vektor a_y",
                "type": "number",
                "defaultValue": 3,
                "min": -1000,
                "max": 1000,
                "step": 0.1,
                "unit": ""
          },
          {
                "id": "az",
                "label": "Vektor a_z",
                "type": "number",
                "defaultValue": -1,
                "min": -1000,
                "max": 1000,
                "step": 0.1,
                "unit": ""
          },
          {
                "id": "bx",
                "label": "Vektor b_x",
                "type": "number",
                "defaultValue": 4,
                "min": -1000,
                "max": 1000,
                "step": 0.1,
                "unit": ""
          },
          {
                "id": "by",
                "label": "Vektor b_y",
                "type": "number",
                "defaultValue": -2,
                "min": -1000,
                "max": 1000,
                "step": 0.1,
                "unit": ""
          },
          {
                "id": "bz",
                "label": "Vektor b_z",
                "type": "number",
                "defaultValue": 2,
                "min": -1000,
                "max": 1000,
                "step": 0.1,
                "unit": ""
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const ax = Number(inputs.ax) || 0;
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
      };
    },
    formula: "a · b = a_x b_x + a_y b_y + a_z b_z; cos(φ) = (a · b) / (|a| · |b|)",
    formulaExplanation: "Ist das Skalarprodukt zweier von Null verschiedener Vektoren genau null (a · b = 0), so stehen die beiden Vektoren orthogonal (im 90°-Winkel) zueinander.",
    workedExample: {
          "title": "Beispiel: a = (2, 3, -1) und b = (4, -2, 2)",
          "inputValues": [
                {
                      "label": "Vektor a",
                      "value": "(2, 3, -1)"
                },
                {
                      "label": "Vektor b",
                      "value": "(4, -2, 2)"
                }
          ],
          "steps": [
                "a · b = (2 × 4) + (3 × -2) + (-1 × 2) = 8 - 6 - 2 = 0",
                "Da a · b = 0, ist cos(φ) = 0 -> φ = 90°"
          ],
          "result": "Skalarprodukt = 0 (orthogonale Vektoren)"
    },
    faqs: [
          {
                "question": "Was ist der Unterschied zwischen Skalarprodukt und Kreuzprodukt?",
                "answer": "Das Skalarprodukt liefert eine einfache Zahl (einen Skalar). Das Kreuzprodukt (Vektorprodukt) liefert einen neuen Vektor, der senkrecht auf beiden Ausgangsvektoren steht."
          },
          {
                "question": "Welche physikalische Bedeutung hat das Skalarprodukt?",
                "answer": "In der Physik entspricht mechanische Arbeit dem Skalarprodukt aus Kraft- und Wegvektor: W = F · s = |F| · |s| · cos(α)."
          }
    ],
    relatedSlugs: ["satz-des-pythagoras-rechner","sinussatz-kosinussatz-rechner","quader-volumen-rechner"],
  },
  {
    id: "torus-volumen-rechner",
    slug: "torus-volumen-rechner",
    name: "Torus-Rechner (Volumen & Oberfläche eines Kreisrings)",
    shortName: "Torus-Rechner",
    category: "geometrie",
    subcategory: "Körper",
    metaTitle: "Torus Rechner – Donut Volumen V = 2π²Rr² & Oberfläche berechnen",
    metaDescription: "Berechnen Sie das Volumen eines Torus (V = 2 · π² · R · r²) und seine Oberfläche (O = 4 · π² · R · r) nach dem großen Ringradius R und dem kleinen Rohrradius r.",
    h1: "Torus Rechner – Volumen & Oberfläche eines Rings ermitteln",
    shortDescription: "Berechnet Volumen und Oberfläche eines Torus (Kreisrings/Donuts).",
    searchKeywords: ["torus rechner volumen formel 2 pi2 r r2","donut oberflaeche berechnen 4 pi2 r r","torus grosser kleiner radius","guldinsche regel torus"],
    inputs: [
          {
                "id": "majorRadiusR",
                "label": "Hauptradius Ringzentrum bis Rohrmitte (R)",
                "type": "number",
                "defaultValue": 10,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "minorRadiusR",
                "label": "Querschnitts-Radius des Rohrs (r)",
                "type": "number",
                "defaultValue": 3,
                "min": 0.05,
                "max": 500,
                "step": 0.1,
                "unit": "cm"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const R = Number(inputs.majorRadiusR) || 0;
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
      };
    },
    formula: "V = 2π² × R × r²; O = 4π² × R × r (nach den Guldinschen Regeln)",
    formulaExplanation: "Ein Torus entsteht durch Rotation eines Kreises mit Radius r um eine in der Kreisebene liegende Achse im Abstand R vom Kreismittelpunkt.",
    workedExample: {
          "title": "Beispiel: Donut mit R = 10 cm und r = 3 cm",
          "inputValues": [
                {
                      "label": "R (Hauptradius)",
                      "value": "10 cm"
                },
                {
                      "label": "r (Rohrradius)",
                      "value": "3 cm"
                }
          ],
          "steps": [
                "V = 2 × π² × 10 × 3² = 180 × π² ≈ 1.776,53 cm³",
                "O = 4 × π² × 10 × 3 = 120 × π² ≈ 1.184,35 cm²"
          ],
          "result": "V = 1.776,53 cm³, O = 1.184,35 cm²"
    },
    faqs: [
          {
                "question": "Was sind die Guldinschen Regeln?",
                "answer": "Die Guldinschen Regeln (nach Paul Guldin) besagen, dass das Volumen eines Rotationskörpers gleich dem Produkt aus erzeugender Fläche und der Länge der Schwerpunktbahn ist: V = A · 2πR."
          },
          {
                "question": "Was passiert, wenn r = R ist?",
                "answer": "Wenn r = R ist, berührt sich der Innenrand im Zentrum im Nullpunkt (Horn-Torus). Ist r > R, schneidet sich die Geometrie selbst (Spindeltorus)."
          }
    ],
    relatedSlugs: ["kugel-oberflaeche-rechner","zylinderrechner","hohlzylinder-rohr-rechner"],
  },
  {
    id: "stumpf-kegel-rechner",
    slug: "stumpf-kegel-rechner",
    name: "Kegelstumpf-Rechner (Volumen, Mantelfläche & Eimerinhalt)",
    shortName: "Kegelstumpf-Rechner",
    category: "geometrie",
    subcategory: "Körper",
    metaTitle: "Kegelstumpf Rechner – Volumen V = 1/3πh(R²+Rr+r²) & Mantelfläche",
    metaDescription: "Berechnen Sie das Volumen eines Kegelstumpfs (V = 1/3 · π · h · (R² + Rr + r²)), die Mantellinie m und die Mantelfläche M für Eimer, Schalen und Trichter.",
    h1: "Kegelstumpf Rechner – Volumen & Mantelfläche berechnen",
    shortDescription: "Berechnet Volumen, Mantelfläche und Mantellinie eines Kegelstumpfs.",
    searchKeywords: ["kegelstumpf rechner volumen formel","eimervolumen berechnen kegelstumpf","mantelflaeche kegelstumpf pi m r r","kegelstumpf hoehe radien"],
    inputs: [
          {
                "id": "radiusBottomR",
                "label": "Großer Radius unten/oben (R)",
                "type": "number",
                "defaultValue": 12,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "radiusTopR",
                "label": "Kleiner Radius oben/unten (r)",
                "type": "number",
                "defaultValue": 8,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "heightH",
                "label": "Höhe des Kegelstumpfs (h)",
                "type": "number",
                "defaultValue": 15,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const R = Number(inputs.radiusBottomR) || 0;
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
      };
    },
    formula: "V = 1/3 × π × h × (R² + Rr + r²); m = √(h² + (R - r)²); M = π × (R + r) × m",
    formulaExplanation: "Ein Kegelstumpf entsteht, wenn man von einem großen Kegel die obere Spitze durch einen parallel zur Grundfläche verlaufenden Schnitt abtrennt.",
    workedExample: {
          "title": "Beispiel: 10-Liter-Putzeimer mit R = 14 cm, r = 10 cm, h = 22 cm",
          "inputValues": [
                {
                      "label": "R (oben)",
                      "value": "14 cm"
                },
                {
                      "label": "r (Boden)",
                      "value": "10 cm"
                },
                {
                      "label": "h",
                      "value": "22 cm"
                }
          ],
          "steps": [
                "V = 1/3 × π × 22 × (14² + 14×10 + 10²) = (22/3) × π × (196 + 140 + 100) = (22/3) × π × 436 ≈ 10.045 cm³",
                "Entspricht ca. 10,05 Litern"
          ],
          "result": "10,05 Liter Eimerinhalt"
    },
    faqs: [
          {
                "question": "Wie misst man das Volumen eines Eimers am besten?",
                "answer": "Da Eimer meist Kegelstümpfe sind, messen Sie den Durchmesser oben, den Durchmesser am Boden (jeweils durch 2 für den Radius) und die senkrechte Eimerhöhe."
          },
          {
                "question": "Was passiert, wenn R = r ist?",
                "answer": "Wenn oberer und unterer Radius identisch sind (R = r), wird der Kegelstumpf zu einem geraden Zylinder mit V = π · r² · h."
          }
    ],
    relatedSlugs: ["kegel-volumen-rechner","zylinderrechner","kugel-oberflaeche-rechner"],
  },
  {
    id: "dreiecks-hoehen-rechner",
    slug: "dreiecks-hoehen-rechner",
    name: "Dreiecks-Höhen-Rechner (Höhen h_a, h_b, h_c & Inkreisradius)",
    shortName: "Dreiecks-Höhen-Rechner",
    category: "geometrie",
    subcategory: "Ebene Figuren",
    metaTitle: "Dreiecks Höhen Rechner – Höhen h_a, h_b, h_c & Inkreis berechnen",
    metaDescription: "Berechnen Sie alle 3 Höhen eines Dreiecks (h_a, h_b, h_c), den Inkreisradius r und den Umkreisradius R aus den drei Seitenlängen a, b und c.",
    h1: "Dreiecks Höhen Rechner – Alle 3 Höhen, Inkreis & Umkreis ermitteln",
    shortDescription: "Berechnet alle 3 Höhen sowie Inkreis und Umkreis aus 3 Seiten.",
    searchKeywords: ["hoehen dreieck rechner ha hb hc","inkreisradius dreieck berechnen formel","umkreisradius dreieck 3 seiten","dreieckshoehen berechnen heron"],
    inputs: [
          {
                "id": "sideA",
                "label": "Seite a",
                "type": "number",
                "defaultValue": 6,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "sideB",
                "label": "Seite b",
                "type": "number",
                "defaultValue": 8,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          },
          {
                "id": "sideC",
                "label": "Seite c",
                "type": "number",
                "defaultValue": 10,
                "min": 0.1,
                "max": 1000,
                "step": 0.1,
                "unit": "cm"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const a = Number(inputs.sideA) || 0;
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
      };
    },
    formula: "h_a = 2A / a; h_b = 2A / b; h_c = 2A / c; r_In = A / s; R_Um = abc / (4A)",
    formulaExplanation: "Da die Dreiecksfläche A = 1/2 · a · h_a = 1/2 · b · h_b = 1/2 · c · h_c ist, verhalten sich die Höhen umgekehrt proportional zu den Seitenlängen.",
    workedExample: {
          "title": "Beispiel: Rechtwinkliges Dreieck a = 6 cm, b = 8 cm, c = 10 cm",
          "inputValues": [
                {
                      "label": "a",
                      "value": "6 cm"
                },
                {
                      "label": "b",
                      "value": "8 cm"
                },
                {
                      "label": "c",
                      "value": "10 cm"
                }
          ],
          "steps": [
                "Fläche A = 1/2 × 6 × 8 = 24 cm²",
                "h_a = 2 × 24 / 6 = 8 cm (= Kathete b)",
                "h_b = 2 × 24 / 8 = 6 cm (= Kathete a)",
                "h_c = 2 × 24 / 10 = 4,80 cm"
          ],
          "result": "h_a = 8 cm, h_b = 6 cm, h_c = 4,80 cm"
    },
    faqs: [
          {
                "question": "Schneiden sich die drei Höhenlinien in einem Punkt?",
                "answer": "Ja, die drei Höhen (bzw. deren Verlängerungen) schneiden sich immer in genau einem Punkt, dem Höhenschnittpunkt H des Dreiecks."
          },
          {
                "question": "Wo liegt der Höhenschnittpunkt bei einem stumpfwinkligen Dreieck?",
                "answer": "Bei einem stumpfwinkligen Dreieck liegt der Höhenschnittpunkt außerhalb des Dreiecks, da zwei Höhen außerhalb der Dreiecksfläche auf die verlängerten Seiten treffen."
          }
    ],
    relatedSlugs: ["dreieck-flaeche-rechner","satz-des-pythagoras-rechner","sinussatz-kosinussatz-rechner"],
  },
  {
    id: "goldener-schnitt-rechner",
    slug: "goldener-schnitt-rechner",
    name: "Goldener-Schnitt-Rechner (Major a, Minor b & Phi = 1,618)",
    shortName: "Goldener Schnitt",
    category: "geometrie",
    subcategory: "Ebene Figuren",
    metaTitle: "Goldener Schnitt Rechner – Major, Minor & Phi (Φ = 1,618) berechnen",
    metaDescription: "Berechnen Sie die Streckenteilung nach dem Goldenen Schnitt: Gesamtlänge, Major (a = ca. 61,8 %) und Minor (b = ca. 38,2 %) mit der Zahl Phi Φ ≈ 1,6180339.",
    h1: "Goldener Schnitt Rechner – Harmonische Proportionen & Teilung",
    shortDescription: "Berechnet Major, Minor und Gesamtstrecke nach dem Goldenen Schnitt.",
    searchKeywords: ["goldener schnitt rechner formel phi","major minor berechnen 61 8 prozent","goldene proportion architektur kunst","goldener schnitt zahl phi 1 618"],
    inputs: [
          {
                "id": "calcMode",
                "label": "Gegebene Größe",
                "type": "select",
                "defaultValue": "total",
                "options": [
                      {
                            "value": "total",
                            "label": "Gesamtstrecke (a + b) gegeben"
                      },
                      {
                            "value": "major",
                            "label": "Längeres Teilstück Major (a) gegeben"
                      },
                      {
                            "value": "minor",
                            "label": "Kürzeres Teilstück Minor (b) gegeben"
                      }
                ]
          },
          {
                "id": "inputLength",
                "label": "Länge / Maß",
                "type": "number",
                "defaultValue": 100,
                "min": 0.01,
                "max": 100000,
                "step": 0.1,
                "unit": "cm/px"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const val = Number(inputs.inputLength) || 0;
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
      };
    },
    formula: "a / b = (a + b) / a = Φ = (1 + √5) / 2 ≈ 1,6180339887...",
    formulaExplanation: "Zwei Teile stehen im Goldenen Schnitt zueinander, wenn sich der größere Teil zum kleineren Teil genauso verhält wie das Ganze zum größeren Teil.",
    workedExample: {
          "title": "Beispiel: Bildbreite 1000 Pixel im Goldenen Schnitt teilen",
          "inputValues": [
                {
                      "label": "Gesamtbreite",
                      "value": "1.000 px"
                }
          ],
          "steps": [
                "Major a = 1.000 / 1,61803 = 618,03 px",
                "Minor b = 1.000 - 618,03 = 381,97 px"
          ],
          "result": "Major = 618 px, Minor = 382 px"
    },
    faqs: [
          {
                "question": "Wie hängen der Goldene Schnitt und die Fibonacci-Folge zusammen?",
                "answer": "Teilt man aufeinanderfolgende Fibonacci-Zahlen (1, 1, 2, 3, 5, 8, 13, 21, 34...), konvergiert das Verhältnis gegen Phi: 34/21 ≈ 1,619, 55/34 ≈ 1,6176, 89/55 ≈ 1,61818."
          },
          {
                "question": "Wo begegnet uns der Goldene Schnitt in der Praxis?",
                "answer": "In der Fotografie (goldene Spirale / Drittelregel), in Webdesigns (Rasteraufteilung), im Kreditkartenformat (Verhältnis 85,6 mm zu 53,98 mm ≈ 1,586) und in der Natur (Sonnenblumenkerne)."
          }
    ],
    relatedSlugs: ["rechteckrechner","kreisrechner","dreieck-flaeche-rechner"],
  },
];
