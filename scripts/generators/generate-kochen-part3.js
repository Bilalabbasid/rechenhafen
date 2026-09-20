const fs = require('fs');
const path = require('path');

const calcs = [
  {
    id: 'salz-lake-poekel-rechner',
    slug: 'salz-lake-poekel-rechner',
    name: 'Salzlake & Pökel Rechner (Lakegehalt in % & Nasspökeln)',
    shortName: 'Salzlake Rechner',
    category: 'kochen-backen',
    subcategory: 'Einkochen & Haltbarkeit',
    metaTitle: 'Salzlake Rechner – Salzgehalt in % für Räuchern, Fermentieren & Pökeln',
    metaDescription: 'Berechnen Sie die exakte Salzmenge in Gramm nach Wasservolumen (Liter) und gewünschter Lakekonzentration (z. B. 2-3 % Fermentation, 5-8 % Räucherfisch, 10-15 % Schinken).',
    h1: 'Salzlake Rechner – Exakte Salzmenge für Lake & Fermentation',
    shortDescription: 'Berechnet Salzmenge nach Wasservolumen und Prozentgehalt der Lake.',
    searchKeywords: ['salzlake rechner gramm salz pro liter wasser', 'poekellake prozent berechnen schinken', 'forelle raeuchern salzlake 5 bis 7 prozent', 'gemuese fermentieren salzgehalt 2 prozent'],
    inputs: [
      { id: 'waterLiters', label: 'Wassermenge', type: 'number', defaultValue: 3, min: 0.5, max: 50, step: 0.5, unit: 'Liter' },
      {
        id: 'purpose',
        label: 'Verwendungszweck & Konzentration',
        type: 'select',
        defaultValue: 'fishSmoke',
        options: [
          { value: 'ferment', label: 'Gemüse fermentieren (Sauerkraut, Kimchi – ca. 2,0 bis 2,5 %)' },
          { value: 'brinePoultry', label: 'Wet Brining Geflügel / Grillfleisch (ca. 4,0 bis 5,0 %)' },
          { value: 'fishSmoke', label: 'Forelle / Fisch räuchern (ca. 6,0 bis 7,0 % – ca. 12 Std.)' },
          { value: 'fishQuick', label: 'Fisch Schnell-Lake (ca. 10,0 % – ca. 2 Std.)' },
          { value: 'porkCure', label: 'Schinken / Kasseler nasspökeln (ca. 12,0 bis 14,0 %)' },
        ],
      },
      { id: 'customPercent', label: 'Exakte Salzkonzentration (in %)', type: 'number', defaultValue: 6.0, min: 0.5, max: 25.0, step: 0.5, unit: '%' },
    ],
    calculateCode: `const waterL = Number(inputs.waterLiters) || 1;
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
};`,
    formula: 'Salz (g) = Wasservolumen (ml) × (Konzentration % / 100)',
    formulaExplanation: 'Für eine 6%-ige Lake lösen Sie genau 60 Gramm Salz pro 1 Liter Wasser auf. Bei unjodiertem Meersalz oder Steinsalz löst sich das Salz rückstandsfrei auf.',
    workedExample: {
      title: 'Beispiel: 3 Liter 6%-ige Salzlake zum Forellenräuchern',
      inputValues: [{ label: 'Wasser', value: '3 Liter' }, { label: 'Lake', value: '6 %' }],
      steps: ['Salz = 3.000 ml × 0,06 = 180 g Salz', 'Forellen ca. 10 bis 12 Stunden vollständig bedeckt in die kühle Lake einlegen'],
      result: '180 g Salz (ca. 10 Esslöffel)',
    },
    faqs: [
      { question: 'Welches Salz eignet sich am besten zum Pökeln und Räuchern?', answer: 'Reines Steinsalz oder Meersalz ohne Jod, Fluorid und Rieselhilfen. Rieselhilfen können die Lake trüben und dem Räuchergut einen bitteren Beigeschmack verleihen.' },
      { question: 'Was bewirkt das Brining (Einlegen in Salzlake) bei Hähnchen oder Pute?', answer: 'Das Salz verändert durch Osmose die Proteinstruktur im Fleisch, sodass das Geflügel beim Braten oder Grillen bis zu 40 % mehr Fleischsaft bindet und extrem saftig bleibt.' },
    ],
    relatedSlugs: ['fleisch-kerntemperatur-garzeit-rechner', 'kuehlschrank-haltbarkeit-rechner', 'portionsrechner'],
  },

  {
    id: 'frittieroel-temperatur-rauchpunkt-rechner',
    slug: 'frittieroel-temperatur-rauchpunkt-rechner',
    name: 'Frittieröl & Rauchpunkt Rechner (Öl-Hitzebeständigkeit & Braten)',
    shortName: 'Rauchpunkt & Öl',
    category: 'kochen-backen',
    subcategory: 'Kochen & Garen',
    metaTitle: 'Rauchpunkt Rechner – Speiseöle, Rauchpunkt (°C) & Frittiertemperatur',
    metaDescription: 'Finden Sie den Rauchpunkt und die maximale Erhitzbarkeit für Rapsöl, Olivenöl, Butterschmalz, Sonnenblumenöl, Kokosöl und Erdnussöl für Braten und Frittieren.',
    h1: 'Rauchpunkt Rechner – Welches Speiseöl eignet sich zum Braten?',
    shortDescription: 'Ermittelt den Rauchpunkt und die Hitzestabilität von Speiseölen.',
    searchKeywords: ['rauchpunkt speiseoele tabelle rechner', 'welches oel zum scharfen anbraten rapsolivenoel', 'frittieroel temperatur 175 grad acrylarmid', 'butterschmalz rauchpunkt grad'],
    inputs: [
      {
        id: 'oilType',
        label: 'Speiseöl / Speisefett',
        type: 'select',
        defaultValue: 'ghee',
        options: [
          { value: 'ghee', label: 'Butterschmalz / Ghee (Rauchpunkt ca. 205 °C – Ideal zum Braten)' },
          { value: 'refinedRapeseed', label: 'Raffiniertes Rapsöl (Rauchpunkt ca. 204 °C – Geschmacksneutral)' },
          { value: 'virginOlive', label: 'Natives Olivenöl extra (Rauchpunkt ca. 160 bis 180 °C – Sanftes Dünsten)' },
          { value: 'refinedOlive', label: 'Raffiniertes Olivenöl (Rauchpunkt ca. 210 °C – Mediterranes Braten)' },
          { value: 'peanut', label: 'Erdnussöl raffiniert (Rauchpunkt ca. 230 °C – Ideal für Wok & Fritteuse)' },
          { value: 'coconut', label: 'Kokosfett / Kokosöl nativ (Rauchpunkt ca. 185 bis 200 °C)' },
          { value: 'butter', label: 'Klassische Butter (Rauchpunkt ca. 150 °C – Geringe Hitze)' },
        ],
      },
      { id: 'plannedTemp', label: 'Geplante Gar- / Pfannentemperatur', type: 'number', defaultValue: 180, min: 100, max: 280, step: 5, unit: '°C' },
    ],
    calculateCode: `const oil = inputs.oilType;
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
};`,
    formula: 'Sicherer Bereich: Pfannentemperatur < Rauchpunkt; Acrylamid-Prävention: Fritteuse max. 175 °C',
    formulaExplanation: 'Wird der Rauchpunkt überschritten, zersetzen sich die Fettsäuren und es entsteht giftiges, stechend riechendes Acrolein (Glycerin-Abbauprodukt). Rauch in der Pfanne ist immer ein Warnsignal!',
    workedExample: {
      title: 'Beispiel: Steak scharf anbraten bei 200 °C mit nativem Olivenöl vs. Butterschmalz',
      inputValues: [{ label: 'Temperatur', value: '200 °C' }],
      steps: ['Natives Olivenöl raucht bereits ab ca. 175 °C (ungeeignet)', 'Butterschmalz raucht erst ab 205 °C (perfekt sicher)'],
      result: 'Butterschmalz oder Erdnussöl verwenden',
    },
    faqs: [
      { question: 'Warum verbrennt normale Butter so schnell in der Pfanne?', answer: 'Butter besteht zu ca. 16 % aus Wasser und enthält Milcheiweiß und Milchzucker. Das Eiweiß verbrennt bereits ab ca. 150 °C und wird schwarz und bitter. Butterschmalz ist geklärtes, reines Butterfett und verträgt 205 °C!' },
      { question: 'Wie entsorgt man altes Frittieröl umweltgerecht?', answer: 'Niemals in den Abfluss oder die Toilette gießen, da das Fett erkaltet und Rohre verstopft! Füllen Sie erkaltetes Öl in eine alte Plastikflasche und werfen Sie diese in den Restmüll.' },
    ],
    relatedSlugs: ['backzeit-temperatur-umluft-oberhitze-rechner', 'fleisch-kerntemperatur-garzeit-rechner', 'temperatur-umrechner'],
  },

  {
    id: 'fondue-raclette-mengen-rechner',
    slug: 'fondue-raclette-mengen-rechner',
    name: 'Raclette & Fondue Mengen Rechner (Käse, Fleisch & Beilagen p.P.)',
    shortName: 'Raclette & Fondue',
    category: 'kochen-backen',
    subcategory: 'Kochen & Garen',
    metaTitle: 'Raclette & Fondue Rechner – Käse- & Fleischmenge pro Person berechnen',
    metaDescription: 'Berechnen Sie die perfekten Mengen für Silvester & Feiern: Raclettekäse (200 bis 250 g p.P.), Fleisch (200 bis 250 g p.P.), Pellkartoffeln, Baguette und Dips nach Gästeanzahl.',
    h1: 'Raclette & Fondue Rechner – Einkaufsmenge für Party & Silvester',
    shortDescription: 'Ermittelt Käse-, Fleisch- und Beilagenmengen pro Person.',
    searchKeywords: ['raclette mengen rechner wieviel kaese pro person 200g', 'fondue fleischmenge pro person 250g', 'raclette zutaten einkaufsliste berechnen silvester', 'kartoffeln baguette pro person raclette'],
    inputs: [
      { id: 'adultsCount', label: 'Anzahl Erwachsene', type: 'number', defaultValue: 6, min: 1, max: 50, step: 1, unit: 'Erwachsene' },
      { id: 'kidsCount', label: 'Anzahl Kinder (essen ca. halbe Portion)', type: 'number', defaultValue: 2, min: 0, max: 20, step: 1, unit: 'Kinder' },
      {
        id: 'eventStyle',
        label: 'Menü-Typ',
        type: 'select',
        defaultValue: 'racletteClassic',
        options: [
          { value: 'racletteClassic', label: 'Klassisches Raclette (viel Käse ca. 220 g p.P. + Beilagen)' },
          { value: 'racletteMeat', label: 'Raclette mit Tischgrill (ca. 180 g Käse + 150 g Fleisch p.P.)' },
          { value: 'meatFondue', label: 'Fleisch-Fondue Fett/Brühe (ca. 250 g Fleisch p.P.)' },
          { value: 'cheeseFondue', label: 'Schweizer Käsefondue (ca. 220 g Käse + 200 g Brot p.P.)' },
        ],
      },
    ],
    calculateCode: `const adults = Number(inputs.adultsCount) || 1;
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
};`,
    formula: 'Käse = Portionen × 200 bis 250 g; Fleisch = Portionen × 200 bis 250 g; Kartoffeln = Portionen × 150 bis 200 g',
    formulaExplanation: 'Bei reinen Käse-Events plant man 200 bis 250 g Käse pro Erwachsenem. Bei kombiniertem Tischgrill teilt sich die Menge gleichmäßig auf Käse und Fleisch auf.',
    workedExample: {
      title: 'Beispiel: 6 Erwachsene zum klassischen Raclette-Abend',
      inputValues: [{ label: 'Personen', value: '6 Erwachsene' }, { label: 'Menü', value: 'Klassisches Raclette' }],
      steps: ['Käse = 6 × 220 g = 1.320 g Raclettekäse', 'Kartoffeln = 6 × 200 g = 1.200 g Pellkartoffeln', 'Brot = 6 × 100 g = 600 g Baguette (ca. 2-3 Stangen)'],
      result: 'ca. 1,3 kg Käse, 1,2 kg Kartoffeln, 3 Baguettes',
    },
    faqs: [
      { question: 'Wie viele Scheiben Raclettekäse sind 200 Gramm?', answer: 'Eine Standardscheibe abgepackter Raclettekäse wiegt etwa 25 bis 30 Gramm. 200 Gramm entsprechen somit ca. 7 bis 8 Käsescheiben pro Person.' },
      { question: 'Welcher Käse eignet sich neben original Schweizer Raclettekäse?', answer: 'Gouda mittelalt, milder Bergkäse, Cheddar oder Gorgonzola eignen sich hervorragend für Pfännchen-Variationen, da sie ebenfalls wunderbar schmelzen.' },
    ],
    relatedSlugs: ['portionsrechner', 'fleisch-kerntemperatur-garzeit-rechner', 'nudeln-rohmaerk-gewicht-rechner'],
  },

  {
    id: 'kuehlschrank-haltbarkeit-rechner',
    slug: 'kuehlschrank-haltbarkeit-rechner',
    name: 'Kühlschrank Haltbarkeit Rechner (Lagerdauer geöffneter Lebensmittel)',
    shortName: 'Kühlschrank Haltbarkeit',
    category: 'kochen-backen',
    subcategory: 'Einkochen & Haltbarkeit',
    metaTitle: 'Kühlschrank Haltbarkeit Rechner – Wie lange halten geöffnete Lebensmittel?',
    metaDescription: 'Finden Sie die empfohlene Kühlschrank-Haltbarkeit in Tagen für Hackfleisch, Geflügel, geöffnete Milch, gekochte Reste, Eier und angebrochene Gläser.',
    h1: 'Kühlschrank Haltbarkeit Rechner – Haltbarkeitsdauer & Lagertipps',
    shortDescription: 'Ermittelt Haltbarkeitstage im Kühlschrank (2-7 °C) und Einfrierzeiten.',
    searchKeywords: ['kuehlschrank haltbarkeit rechner geoffnet tage', 'hackfleisch wie lange haltbar kuehlschrank 1 tag', 'gekochte reste wieviele tage im kuehlschrank', 'haltbarkeit milch geoffnet verbrauchen'],
    inputs: [
      {
        id: 'foodType',
        label: 'Lebensmittelkategorie',
        type: 'select',
        defaultValue: 'cookedLeftovers',
        options: [
          { value: 'mincedMeat', label: 'Rohes Hackfleisch / Mett (Sehr leicht verderblich)' },
          { value: 'rawPoultry', label: 'Rohes Geflügelfleisch (Hähnchen, Pute)' },
          { value: 'rawBeef', label: 'Rohes Rindfleisch / Braten am Stück' },
          { value: 'cookedLeftovers', label: 'Gekochte Essensreste (Suppen, Pasta, Auflauf)' },
          { value: 'openedMilk', label: 'Geöffnete Milch / Pflanzendrink' },
          { value: 'openedJam', label: 'Geöffnete Marmelade / Konfitüre' },
          { value: 'rawEggs', label: 'Frische rohe Eier (mit Schale)' },
        ],
      },
    ],
    calculateCode: `const food = inputs.foodType;

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
};`,
    formula: 'Lagerung bei 2 °C bis 7 °C; Kälteste Zone = Glasplatte direkt über dem Gemüsefach (ca. 2 °C)',
    formulaExplanation: 'Warme Luft steigt im Kühlschrank nach oben: Das oberste Fach hat ca. 8 °C, die Glasplatte über dem Gemüsefach nur ca. 2 °C. Leicht verderbliche Fleisch- und Fischwaren gehören zwingend ganz nach unten.',
    workedExample: {
      title: 'Beispiel: Gekochte Nudeln oder Suppenreste aufbewahren',
      inputValues: [{ label: 'Lebensmittel', value: 'Gekochte Reste' }],
      steps: ['Reste innerhalb von 2 Stunden nach dem Kochen abkühlen lassen', 'In einer verschlossenen Glas- oder Frischhaltedose im mittleren Fach lagern', 'Binnen 2 bis maximal 3 Tagen aufbrauchen'],
      result: 'ca. 3 Tage Haltbarkeit',
    },
    faqs: [
      { question: 'Wie erkennt man, ob ein Ei noch frisch ist?', answer: 'Der Wassertest: Legen Sie das Ei in ein Glas kaltes Wasser. Bleibt es am Boden liegen, ist es frisch. Richtet es sich schräg auf, ist es älter aber essbar. Schwimmt es an der Oberfläche, hat sich zu viel Fäulnisgas gebildet -> nicht mehr essen!' },
      { question: 'Darf man heiße Speisen direkt in den Kühlschrank stellen?', answer: 'Nein, heiße Speisen erwärmen das gesamte Kühlschrankinnere und gefährden andere Lebensmittel. Lassen Sie Töpfe erst auf Zimmertemperatur abkühlen.' },
    ],
    relatedSlugs: ['marmelade-geliermittel-rechner', 'fleisch-kerntemperatur-garzeit-rechner', 'salz-lake-poekel-rechner'],
  },

  {
    id: 'tee-ziehzeit-temperatur-rechner',
    slug: 'tee-ziehzeit-temperatur-rechner',
    name: 'Tee Ziehzeit & Temperatur Rechner (Grüner, Schwarzer & Kräutertee)',
    shortName: 'Tee Ziehzeit Rechner',
    category: 'kochen-backen',
    subcategory: 'Getränke',
    metaTitle: 'Tee Ziehzeit Rechner – Wassertemperatur (°C) & Ziehdauer nach Teesorte',
    metaDescription: 'Finden Sie die perfekte Wassertemperatur und Ziehzeit für Grünen Tee (70-80 °C, 2 Min.), Schwarzen Tee (95 °C, 3 Min.), Weißen Tee, Kräutertee und Früchtetee (100 °C, 8 Min.).',
    h1: 'Tee Ziehzeit Rechner – Temperatur & Ziehdauer für besten Geschmack',
    shortDescription: 'Ermittelt Wassertemperatur und Ziehzeit nach Teesorte.',
    searchKeywords: ['tee ziehzeit rechner wassertemperatur grad', 'gruener tee temperatur 70 grad nicht bitter', 'schwarzer tee ziehzeit 3 minuten anregend', 'kraeutertee sprudelnd kochend ziehen lassen'],
    inputs: [
      {
        id: 'teaType',
        label: 'Teesorte',
        type: 'select',
        defaultValue: 'green',
        options: [
          { value: 'green', label: 'Grüner Tee (Sencha, Bancha – 70 bis 80 °C, ca. 2 Min.)' },
          { value: 'matcha', label: 'Matcha / Gyokuro (Sehr edel – 60 bis 65 °C)' },
          { value: 'white', label: 'Weißer Tee (Pai Mu Tan – 75 bis 80 °C, ca. 3-4 Min.)' },
          { value: 'black', label: 'Schwarzer Tee (Darjeeling, Earl Grey – 90 bis 95 °C, ca. 3-4 Min.)' },
          { value: 'oolong', label: 'Oolong Tee (halbfermentiert – 80 bis 90 °C, ca. 3 Min.)' },
          { value: 'herbal', label: 'Kräutertee / Kamille / Minze (100 °C sprudelnd kochend, 6-8 Min.)' },
          { value: 'fruit', label: 'Früchtetee (100 °C sprudelnd kochend, 8-10 Min.)' },
        ],
      },
      { id: 'waterAmountMl', label: 'Wassermenge', type: 'number', defaultValue: 250, min: 100, max: 2000, step: 50, unit: 'ml' },
    ],
    calculateCode: `const tea = inputs.teaType;
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
};`,
    formula: 'Tee (g) = (Wasservolumen / 1.000) × 12 g; Echte Tees (Camellia sinensis): 60 bis 90 °C; Kräuter/Früchte: 100 °C',
    formulaExplanation: 'Grüner und weißer Tee enthalten empfindliche Aminosäuren und Polyphenole, die bei über 80 °C zerstört werden und den Tee extrem bitter machen.',
    workedExample: {
      title: 'Beispiel: Eine Kanne Grüner Tee (750 ml)',
      inputValues: [{ label: 'Wasser', value: '750 ml' }, { label: 'Tee', value: 'Grüner Tee' }],
      steps: ['Wasser nach dem Kochen ca. 6 bis 8 Minuten auf 75 °C abkühlen lassen', 'Teemenge = 0,75 × 12 g = 9 g Teeblätter (ca. 3-4 Teelöffel)', 'Genau 2 Minuten ziehen lassen'],
      result: '75 °C Wassertemperatur, 2 Minuten Ziehzeit',
    },
    faqs: [
      { question: 'Wie lange dauert es, bis kochendes Wasser auf 80 °C abkühlt?', answer: 'Ein frisch gekochter Wasserkocher (1 Liter Wasser mit geöffnetem Deckel) benötigt bei Zimmertemperatur etwa 6 bis 8 Minuten, um von 100 °C auf ca. 75-80 °C abzukühlen.' },
      { question: 'Warum muss Kräutertee mit kochendem Wasser aufgegossen werden?', answer: 'Kräuter- und Früchtetees sind getrocknete Naturprodukte, die Sporen und Keime enthalten können. Nur sprudelnd kochendes Wasser (100 °C) und mindestens 5 Minuten Ziehzeit garantieren mikrobiologische Sicherheit.' },
    ],
    relatedSlugs: ['kaffee-wasser-verhaeltnis-rechner', 'temperatur-umrechner', 'zeit-umrechner'],
  },

  {
    id: 'kalorien-rezept-rechner',
    slug: 'kalorien-rezept-rechner',
    name: 'Rezept Kalorien Rechner (Gesamtkalorien & Makros pro Portion)',
    shortName: 'Rezept Kalorien Rechner',
    category: 'kochen-backen',
    subcategory: 'Ernährung & Diät',
    metaTitle: 'Rezept Kalorien Rechner – kcal & Makronährstoffe pro Portion berechnen',
    metaDescription: 'Berechnen Sie die Gesamtkalorien (kcal) und Makronährstoffe (Kohlenhydrate, Eiweiß, Fett) eines Rezepts nach Hauptzutaten und Portionen.',
    h1: 'Rezept Kalorien Rechner – Nährwerte & Makros pro Portion ermitteln',
    shortDescription: 'Berechnet Kalorien und Makros pro Portion für eigene Rezepte.',
    searchKeywords: ['rezept kalorien rechner kcal pro portion berechnen', 'makros rezept kohlenhydrate eiweiss fett gramm', 'rezept naehrwerte selbst berechnen online', 'kalorien pro teller mahlzeit rechner'],
    inputs: [
      { id: 'carbsG', label: 'Kohlenhydrate gesamt im Rezept', type: 'number', defaultValue: 120, min: 0, max: 2000, step: 5, unit: 'g KH' },
      { id: 'proteinG', label: 'Eiweiß / Protein gesamt', type: 'number', defaultValue: 60, min: 0, max: 1000, step: 5, unit: 'g Eiweiß' },
      { id: 'fatG', label: 'Fett gesamt (Öl, Butter, Nüsse)', type: 'number', defaultValue: 30, min: 0, max: 1000, step: 5, unit: 'g Fett' },
      { id: 'portionsCount', label: 'Anzahl Portionen des Rezepts', type: 'number', defaultValue: 3, min: 1, max: 20, step: 1, unit: 'Portionen' },
    ],
    calculateCode: `const carbs = Number(inputs.carbsG) || 0;
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
};`,
    formula: 'kcal = (Kohlenhydrate × 4,1) + (Eiweiß × 4,1) + (Fett × 9,3); kcal p.P. = Gesamtkalorien / Portionen',
    formulaExplanation: 'Fett hat mit über 9 kcal pro Gramm mehr als doppelt so viel Energie wie Kohlenhydrate und Proteine (je ca. 4,1 kcal/g).',
    workedExample: {
      title: 'Beispiel: Pasta mit Lachs für 2 Personen (160 g KH, 50 g Eiweiß, 25 g Fett)',
      inputValues: [{ label: 'KH', value: '160 g' }, { label: 'Eiweiß', value: '50 g' }, { label: 'Fett', value: '25 g' }, { label: 'Portionen', value: '2' }],
      steps: ['Gesamt = (160 × 4,1) + (50 × 4,1) + (25 × 9,3) = 656 + 205 + 232,5 = 1.093,5 kcal', 'Pro Portion = 1.093,5 / 2 ≈ 547 kcal'],
      result: '547 kcal pro Portion',
    },
    faqs: [
      { question: 'Wie rechnet man Kilokalorien in Kilojoule um?', answer: 'Multiplizieren Sie die Kalorienzahl mit 4,184: 1 kcal = 4,184 kJ. 500 kcal entsprechen rund 2.092 kJ.' },
      { question: 'Verändern sich die Kalorien von Nudeln oder Reis beim Kochen?', answer: 'Nein, das Nahrungsmittel saugt nur kalorienfreies Wasser auf. 100 g trockene Nudeln (ca. 350 kcal) ergeben gekocht ca. 230 g Pasta, die zusammen immer noch exakt dieselben 350 kcal enthalten.' },
    ],
    relatedSlugs: ['portionsrechner', 'nudeln-rohmaerk-gewicht-rechner', 'zucker-ersatz-rechner'],
  },
  {
    id: 'schokolade-temperieren-rechner',
    slug: 'schokolade-temperieren-rechner',
    name: 'Schokolade Temperieren Rechner (Impfmethode & Kuvertüre-Temperaturen)',
    shortName: 'Schokolade temperieren',
    category: 'kochen-backen',
    subcategory: 'Backzutaten',
    metaTitle: 'Schokolade temperieren Rechner – Impfmethode, Kuvertüre & Gradzahlen',
    metaDescription: 'Berechnen Sie die exakten Temperaturen und Impfmengen (2/3 schmelzen bei 45 °C, 1/3 Impfschokolade bei 27 °C zugeben) für Zartbitter-, Vollmilch- und weiße Kuvertüre.',
    h1: 'Schokolade temperieren Rechner – Perfekter Glanz & Knack nach Impfmethode',
    shortDescription: 'Ermittelt Impfmengen und Arbeitstemperaturen für Kuvertüre.',
    searchKeywords: ['schokolade temperieren rechner impfmethode', 'kuvertuere schmelzen temperatur zartbitter vollmilch weiss', 'schokolade impfen mengenverhaeltnis 2 drittel 1 drittel', 'pralinen schokolade glanz knack beta kristalle'],
    inputs: [
      { id: 'totalChocolateG', label: 'Gesamtmenge Schokolade / Kuvertüre', type: 'number', defaultValue: 300, min: 50, max: 5000, step: 25, unit: 'g' },
      {
        id: 'chocType',
        label: 'Schokoladensorte',
        type: 'select',
        defaultValue: 'dark',
        options: [
          { value: 'dark', label: 'Zartbitter-Kuvertüre (Schmelzen 45-50 °C, Kühlen 28 °C, Arbeiten 31-32 °C)' },
          { value: 'milk', label: 'Vollmilch-Kuvertüre (Schmelzen 45 °C, Kühlen 27 °C, Arbeiten 29-30 °C)' },
          { value: 'white', label: 'Weiße Kuvertüre (Schmelzen 40-45 °C, Kühlen 26 °C, Arbeiten 28-29 °C)' },
        ],
      },
    ],
    calculateCode: `const totalG = Number(inputs.totalChocolateG) || 300;
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
};`,
    formula: 'Schmelzanteil = 2/3 des Gesamtgewichts; Impfanteil = 1/3 des Gesamtgewichts',
    formulaExplanation: 'Richtiges Vorkristallisieren bildet stabile Beta-V-Kakaobutterkristalle. Dadurch zieht sich die Schokolade beim Erkalten leicht zusammen, löst sich perfekt aus der Form und bekommt einen seidigen Glanz ohne grauen Fettreif.',
    workedExample: {
      title: 'Beispiel: 300 g Zartbitterkuvertüre für Pralinen temperieren',
      inputValues: [{ label: 'Menge', value: '300 g' }, { label: 'Sorte', value: 'Zartbitter' }],
      steps: ['200 g (2/3) im warmen Wasserbad auf 48 °C schmelzen', '100 g (1/3) feingehackt unterrühren, bis alles geschmolzen ist und 28 °C erreicht sind', 'Ganz kurz erwärmen auf 31-32 °C Arbeitstemperatur'],
      result: '200 g schmelzen, 100 g impfen (31-32 °C)',
    },
    faqs: [
      { question: 'Was tun, wenn auch nur ein Tropfen Wasser in die geschmolzene Schokolade gelangt?', answer: 'Wasser ist der Feind geschmolzener Schokolade! Schon ein kleiner Wassertropfen lässt die Schokolade sofort "gerinnen" und zu einer festen, klumpigen Masse erstarren.' },
      { question: 'Was ist der Unterschied zwischen Kuvertüre und normaler Tafelschokolade?', answer: 'Kuvertüre enthält gesetzlich mindestens 31 % Kakaobutter (Tafelschokolade meist nur 18-25 %). Durch den höheren Fettgehalt ist Kuvertüre flüssiger und bildet einen viel dünneren, knackigen Überzug.' },
    ],
    relatedSlugs: ['backzeit-temperatur-umluft-oberhitze-rechner', 'temperatur-umrechner', 'cups-in-gramm-rechner'],
  },
];

console.log('Building kochen part 3 with', calcs.length, 'calculators');
fs.writeFileSync(path.join(__dirname, 'calcs-kochen-part3.json'), JSON.stringify(calcs, null, 2), 'utf8');
console.log('Saved calcs-kochen-part3.json');
