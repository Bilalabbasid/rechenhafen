const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../../src/data/calculators/extra/gesundheitFamilie.ts');

const parts = [];

parts.push(`import { CalculatorDefinition } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';

export const EXTRA_GESUNDHEIT_FAMILIE: CalculatorDefinition[] = [
  // ==================== GESUNDHEIT & FITNESS (21 ZUSÄTZLICHE) ====================
  {
    id: 'grundumsatz-bmr-rechner',
    slug: 'grundumsatz-bmr-rechner',
    name: 'Grundumsatz Rechner (BMR nach Mifflin-St. Jeor & Harris-Benedict)',
    shortName: 'Grundumsatz BMR',
    category: 'gesundheit-fitness',
    subcategory: 'Ernährung & Kalorien',
    metaTitle: 'Grundumsatz Rechner – BMR Kalorienbedarf in Ruhe berechnen',
    metaDescription: 'Berechnen Sie Ihren Grundumsatz (BMR) exakt nach der wissenschaftlich präzisen Mifflin-St. Jeor-Formel und Harris-Benedict nach Alter, Größe und Gewicht.',
    h1: 'Grundumsatz Rechner – Kalorienverbrauch im Ruhezustand (BMR)',
    shortDescription: 'Ermittelt die Mindestkalorienmenge, die der Körper in völliger Ruhe zur Aufrechterhaltung der Organfunktionen benötigt.',
    searchKeywords: ['grundumsatz rechner bmr', 'mifflin st jeor formel grundumsatz', 'kalorienbedarf in ruhe berechnen', 'grundumsatz frau mann tabelle'],
    inputs: [
      { id: 'gender', label: 'Biologisches Geschlecht', type: 'select', defaultValue: 'female', options: [
        { value: 'female', label: 'Weiblich' },
        { value: 'male', label: 'Männlich' },
      ]},
      { id: 'weightKg', label: 'Körpergewicht in kg', type: 'number', defaultValue: 68, min: 35, max: 250, step: 0.5, unit: 'kg' },
      { id: 'heightCm', label: 'Körpergröße in cm', type: 'number', defaultValue: 168, min: 120, max: 230, step: 1, unit: 'cm' },
      { id: 'ageYears', label: 'Alter in Jahren', type: 'number', defaultValue: 32, min: 14, max: 100, step: 1, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const isMale = inputs.gender === 'male';
      const w = parseFloat(inputs.weightKg) || 68;
      const h = parseFloat(inputs.heightCm) || 168;
      const a = parseFloat(inputs.ageYears) || 32;

      // Mifflin-St. Jeor Formel:
      // BMR = 10 × Gewicht (kg) + 6.25 × Größe (cm) - 5 × Alter (Jahre) + (m: +5, w: -161)
      const bmrMifflin = (10 * w) + (6.25 * h) - (5 * a) + (isMale ? 5 : -161);
      // Harris-Benedict (revidiert):
      const bmrHarris = isMale
        ? 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a)
        : 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);

      return {
        primary: { id: 'bmrMifflin', label: 'Grundumsatz pro Tag (Mifflin-St. Jeor)', value: bmrMifflin, formattedValue: \`\${formatNumber(bmrMifflin, 0)} kcal/Tag\`, highlight: true },
        secondary: [
          { id: 'bmrPerHour', label: 'Verbrauch pro Ruhestunde', value: bmrMifflin / 24, formattedValue: \`\${formatNumber(bmrMifflin / 24, 1)} kcal/Std.\` },
          { id: 'bmrHarris', label: 'Vergleich nach Harris-Benedict', value: bmrHarris, formattedValue: \`\${formatNumber(bmrHarris, 0)} kcal/Tag\` },
          { id: 'kilojoule', label: 'Energie in Kilojoule (kJ)', value: bmrMifflin * 4.184, formattedValue: \`\${formatNumber(bmrMifflin * 4.184, 0)} kJ/Tag\` },
        ],
        summaryText: \`Ihr Körper verbraucht in völliger Ruhe ca. \${formatNumber(bmrMifflin, 0)} kcal täglich zur Aufrechterhaltung lebenswichtiger Funktionen wie Atmung, Herzschlag und Stoffwechsel.\`,
      };
    },
    formula: 'BMR = 10 × kg + 6,25 × cm - 5 × Jahre + s (s = +5 für Männer, -161 für Frauen)',
    formulaExplanation: 'Die Mifflin-St. Jeor-Formel gilt in der modernen Ernährungswissenschaft als der Goldstandard zur Schätzung des Ruheenergiebedarfs.',
    workedExample: {
      title: 'Beispiel: Frau, 68 kg, 168 cm, 32 Jahre alt',
      inputValues: [{ label: 'Geschlecht', value: 'Weiblich' }, { label: 'Gewicht', value: '68 kg' }, { label: 'Größe', value: '168 cm' }, { label: 'Alter', value: '32 Jahre' }],
      steps: ['10 × 68 = 680', '6,25 × 168 = 1.050', '5 × 32 = 160', 'BMR = 680 + 1.050 - 160 - 161 = 1.409 kcal'],
      result: '1.409 kcal Grundumsatz pro Tag',
    },
    faqs: [
      { question: 'Darf man bei einer Diät weniger als den Grundumsatz essen?', answer: 'Dauerhaft sollte man den Grundumsatz nicht unterschreiten, da der Körper sonst den Stoffwechsel herunterfährt und Muskelmasse abbaut (Hungerstoffwechsel / Jojo-Effekt).' },
      { question: 'Wie steigert man den Grundumsatz?', answer: 'Durch den Aufbau von Muskelmasse durch Krafttraining. Muskelgewebe verbraucht selbst in Ruhe deutlich mehr Kalorien als Fettgewebe.' },
    ],
    relatedSlugs: ['kalorienbedarf-rechner', 'leistungsumsatz-pal-rechner', 'bmi-rechner'],
  },

  {
    id: 'leistungsumsatz-pal-rechner',
    slug: 'leistungsumsatz-pal-rechner',
    name: 'Leistungsumsatz & PAL-Faktor Rechner (Gesamtenergiebedarf)',
    shortName: 'Leistungsumsatz PAL',
    category: 'gesundheit-fitness',
    subcategory: 'Ernährung & Kalorien',
    metaTitle: 'Leistungsumsatz Rechner – PAL-Faktor & Kalorien-Gesamtumsatz berechnen',
    metaDescription: 'Berechnen Sie Leistungsumsatz und Gesamtkalorienbedarf mit dem Physical Activity Level (PAL-Faktor): Büroarbeit, Handwerk, Sport und Freizeitaktivität.',
    h1: 'Leistungsumsatz Rechner – PAL-Faktor & Tages-Kalorienbedarf',
    shortDescription: 'Ermittelt den zusätzlichen Kalorienverbrauch durch körperliche Bewegung und Beruf.',
    searchKeywords: ['leistungsumsatz rechner pal faktor', 'gesamtenergiebedarf tdee berechnen', 'pal wert tabelle buerotag', 'wie viele kalorien verbrauche ich am tag'],
    inputs: [
      { id: 'bmrKcal', label: 'Ihr täglicher Grundumsatz (BMR) in kcal', type: 'number', defaultValue: 1450, min: 800, max: 3000, step: 25, unit: 'kcal' },
      {
        id: 'palLevel',
        label: 'Berufliche & alltägliche Aktivität (PAL-Wert)',
        type: 'select',
        defaultValue: 'office',
        options: [
          { value: 'sedentary', label: 'Nur sitzend / liegend (Bettlägerig, ältere Menschen: PAL 1,2)' },
          { value: 'office', label: 'Ausschließlich sitzende Bürotätigkeit mit wenig Bewegung (PAL 1,4)' },
          { value: 'mixed', label: 'Sitzend mit zeitweiliger Geh- / Stehtätigkeit (Laborant, Student: PAL 1,6)' },
          { value: 'standing', label: 'Überwiegend stehende / gehende Tätigkeit (Verkäufer, Kellner: PAL 1,8)' },
          { value: 'heavy', label: 'Körperlich schwere Arbeit (Handwerker, Bauarbeiter, Landwirt: PAL 2,0)' },
        ],
      },
      { id: 'sportKcalPerDay', label: 'Zusätzlicher Sport-Kalorienverbrauch im Schnitt pro Tag', type: 'number', defaultValue: 200, min: 0, max: 2000, step: 50, unit: 'kcal' },
    ],
    calculate: (inputs) => {
      const bmr = parseFloat(inputs.bmrKcal) || 1450;
      const type = inputs.palLevel || 'office';
      const sport = parseFloat(inputs.sportKcalPerDay) || 200;

      const pals: Record<string, number> = {
        sedentary: 1.2,
        office: 1.4,
        mixed: 1.6,
        standing: 1.8,
        heavy: 2.0,
      };
      const pal = pals[type] || 1.4;
      const totalDailyEnergy = (bmr * pal) + sport;
      const leistungsumsatz = totalDailyEnergy - bmr;

      return {
        primary: { id: 'totalDailyEnergy', label: 'Gesamtenergiebedarf pro Tag (TDEE)', value: totalDailyEnergy, formattedValue: \`\${formatNumber(totalDailyEnergy, 0)} kcal/Tag\`, highlight: true },
        secondary: [
          { id: 'leistungsumsatz', label: 'Davon reiner Leistungsumsatz (Aktivität + Sport)', value: leistungsumsatz, formattedValue: \`\${formatNumber(leistungsumsatz, 0)} kcal/Tag\` },
          { id: 'bmr', label: 'Davon Grundumsatz (BMR)', value: bmr, formattedValue: \`\${formatNumber(bmr, 0)} kcal/Tag\` },
          { id: 'deficitWeightLoss', label: 'Empfohlenes Kalorienziel zur Gewichtsabnahme (-500 kcal)', value: totalDailyEnergy - 500, formattedValue: \`\${formatNumber(totalDailyEnergy - 500, 0)} kcal/Tag\` },
        ],
        summaryText: \`Bei einem PAL-Wert von \${pal} und \${sport} kcal Sport beträgt Ihr Gesamtkalorienbedarf ca. \${formatNumber(totalDailyEnergy, 0)} kcal pro Tag. Um 0,5 kg Fett pro Woche abzunehmen, sollten Sie ca. \${formatNumber(totalDailyEnergy - 500, 0)} kcal täglich zuführen.\`,
      };
    },
    formula: 'Gesamtumsatz = Grundumsatz × PAL-Faktor + Sportkalorien',
    formulaExplanation: 'Der PAL-Wert (Physical Activity Level) beziffert nach den Referenzwerten der DGE (Deutsche Gesellschaft für Ernährung) das Maß der körperlichen Aktivität als Vielfaches des Grundumsatzes.',
    workedExample: {
      title: 'Beispiel: 1.450 kcal Grundumsatz bei Bürojob (PAL 1,4) + 200 kcal Sport',
      inputValues: [{ label: 'Grundumsatz', value: '1.450 kcal' }, { label: 'PAL-Wert', value: '1,4' }, { label: 'Sport', value: '200 kcal' }],
      steps: ['Bedarf Alltag = 1.450 × 1,4 = 2.030 kcal', 'Gesamtumsatz = 2.030 + 200 = 2.230 kcal pro Tag'],
      result: '2.230 kcal Gesamtkalorienbedarf',
    },
    faqs: [
      { question: 'Wie groß sollte das Kaloriendefizit zum Abnehmen sein?', answer: 'Ein moderates Defizit von 300 bis 500 kcal pro Tag ist ideal, um gesund und ohne Muskelverlust ca. 1 bis 2 kg Fett pro Monat abzubauen.' },
      { question: 'Was bedeutet TDEE?', answer: 'TDEE steht für Total Daily Energy Expenditure und bezeichnet den gesamten täglichen Kalorienverbrauch aus Grundumsatz, Alltagsbewegung und Sport.' },
    ],
    relatedSlugs: ['grundumsatz-bmr-rechner', 'kalorienbedarf-rechner', 'makronaehrstoff-verteilung-rechner'],
  },

  {
    id: 'makronaehrstoff-verteilung-rechner',
    slug: 'makronaehrstoff-verteilung-rechner',
    name: 'Makronährstoff Rechner (Gramm Eiweiß, Kohlenhydrate & Fette)',
    shortName: 'Makro Rechner',
    category: 'gesundheit-fitness',
    subcategory: 'Ernährung & Kalorien',
    metaTitle: 'Makronährstoff Rechner – Gramm Eiweiß, Fett & Kohlenhydrate berechnen',
    metaDescription: 'Berechnen Sie Ihre optimale Makronährstoff-Verteilung (Makros) in Gramm und Prozent für Abnehmen, Muskelaufbau, Low Carb, Keto oder ausgewogene Ernährung.',
    h1: 'Makronährstoff Rechner – Eiweiß, Kohlenhydrate & Fette in Gramm',
    shortDescription: 'Teilt Ihren täglichen Kalorienbedarf in Gramm für Protein, Kohlenhydrate und Fett auf.',
    searchKeywords: ['makronaehrstoff rechner gramm', 'makros berechnen muskelaufbau abnehmen', 'wie viel eiweiss kohlenhydrate fett pro tag', 'iifym rechner deutsch'],
    inputs: [
      { id: 'targetCalories', label: 'Tägliches Kalorienziel in kcal', type: 'number', defaultValue: 2000, min: 1000, max: 5000, step: 50, unit: 'kcal' },
      {
        id: 'dietGoal',
        label: 'Ernährungsform & Ziel',
        type: 'select',
        defaultValue: 'balanced',
        options: [
          { value: 'balanced', label: 'Ausgewogen (50 % Kohlenhydrate, 25 % Protein, 25 % Fett)' },
          { value: 'muscle', label: 'Muskelaufbau / High Protein (40 % Kohlenhydrate, 35 % Protein, 25 % Fett)' },
          { value: 'lowcarb', label: 'Low Carb (20 % Kohlenhydrate, 40 % Protein, 40 % Fett)' },
          { value: 'keto', label: 'Ketogen / Keto (5 % Kohlenhydrate, 25 % Protein, 70 % Fett)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const kcal = parseFloat(inputs.targetCalories) || 2000;
      const type = inputs.dietGoal || 'balanced';

      // Kalorienwerte: Protein = 4,1 kcal/g, Kohlenhydrate = 4,1 kcal/g, Fett = 9,3 kcal/g
      let carbPct = 0.50;
      let protPct = 0.25;
      let fatPct = 0.25;

      if (type === 'muscle') { carbPct = 0.40; protPct = 0.35; fatPct = 0.25; }
      if (type === 'lowcarb') { carbPct = 0.20; protPct = 0.40; fatPct = 0.40; }
      if (type === 'keto') { carbPct = 0.05; protPct = 0.25; fatPct = 0.70; }

      const carbGrams = (kcal * carbPct) / 4.1;
      const protGrams = (kcal * protPct) / 4.1;
      const fatGrams = (kcal * fatPct) / 9.3;

      return {
        primary: { id: 'protGrams', label: 'Tägliches Eiweiß (Protein)', value: protGrams, formattedValue: \`\${formatNumber(protGrams, 0)} Gramm (\${formatPercent(protPct * 100, 0)})\`, highlight: true },
        secondary: [
          { id: 'carbGrams', label: 'Kohlenhydrate', value: carbGrams, formattedValue: \`\${formatNumber(carbGrams, 0)} Gramm (\${formatPercent(carbPct * 100, 0)})\` },
          { id: 'fatGrams', label: 'Fette (gesunde Fette)', value: fatGrams, formattedValue: \`\${formatNumber(fatGrams, 0)} Gramm (\${formatPercent(fatPct * 100, 0)})\` },
          { id: 'targetKcal', label: 'Gesamtkalorien', value: kcal, formattedValue: \`\${formatNumber(kcal, 0)} kcal\` },
        ],
        summaryText: \`Bei \${formatNumber(kcal, 0)} kcal sollten Sie täglich ca. \${formatNumber(protGrams, 0)} g Eiweiß, \${formatNumber(carbGrams, 0)} g Kohlenhydrate und \${formatNumber(fatGrams, 0)} g Fett zu sich nehmen.\`,
      };
    },
    formula: 'Gramm = (Gesamtkalorien × Makro-Anteil in %) / Energiegehalt pro Gramm (Protein/Carbs: 4,1 kcal; Fett: 9,3 kcal)',
    formulaExplanation: 'Eiweiß und Kohlenhydrate liefern rund 4,1 kcal pro Gramm, während Fett mit 9,3 kcal pro Gramm mehr als doppelt so kalorienreich ist.',
    workedExample: {
      title: 'Beispiel: 2.000 kcal bei ausgewogener Ernährung',
      inputValues: [{ label: 'Kalorien', value: '2.000 kcal' }, { label: 'Ziel', value: 'Ausgewogen' }],
      steps: ['Kohlenhydrate (50 % = 1.000 kcal) = 244 g', 'Protein (25 % = 500 kcal) = 122 g', 'Fett (25 % = 500 kcal) = 54 g'],
      result: '122 g Protein, 244 g Kohlenhydrate, 54 g Fett',
    },
    faqs: [
      { question: 'Wie viel Eiweiß braucht man für Muskelaufbau?', answer: 'Sportwissenschaftler empfehlen für Kraftsportler und Muskelaufbau ca. 1,6 bis 2,2 Gramm Protein pro Kilogramm Körpergewicht pro Tag.' },
      { question: 'Macht Fett beim Essen automatisch dick?', answer: 'Nein, gesunde Fette (Omega-3, einfach ungesättigte Fettsäuren) sind lebensnotwendig für Hormone und Zellwände. Entscheidend für das Körpergewicht ist stets die Kalorienbilanz.' },
    ],
    relatedSlugs: ['kalorienbedarf-rechner', 'proteinbedarf-sportler-rechner', 'leistungsumsatz-pal-rechner'],
  },

  {
    id: 'ideal好gewicht-creff-rechner',
    slug: 'idealgewicht-creff-rechner',
    name: 'Idealgewicht Rechner (nach Creff-Formel & Broca-Index)',
    shortName: 'Idealgewicht Creff',
    category: 'gesundheit-fitness',
    subcategory: 'Gewicht & Körper',
    metaTitle: 'Idealgewicht Rechner – Creff-Formel & Broca nach Körperbau und Alter',
    metaDescription: 'Berechnen Sie Ihr persönliches Idealgewicht nach der wissenschaftlichen Creff-Formel unter Berücksichtigung von Körperbau (schmal, normal, kräftig) und Alter.',
    h1: 'Idealgewicht Rechner – Individuelles Wohlfühlgewicht berechnen',
    shortDescription: 'Ermittelt das Idealgewicht angepasst an Knochenbau und Alter anstelle starrer BMI-Grenzen.',
    searchKeywords: ['idealgewicht rechner creff formel', 'broca index rechner normalgewicht', 'idealgewicht berechnen koerperbau', 'wie viel sollte ich wiegen'],
    inputs: [
      { id: 'heightCm', label: 'Körpergröße in cm', type: 'number', defaultValue: 175, min: 130, max: 220, step: 1, unit: 'cm' },
      { id: 'ageYears', label: 'Alter in Jahren', type: 'number', defaultValue: 35, min: 18, max: 99, step: 1, unit: 'Jahre' },
      {
        id: 'bodyFrame',
        label: 'Körperbau / Knochenbau (Morphologie)',
        type: 'select',
        defaultValue: 'medium',
        options: [
          { value: 'small', label: 'Schmaler / zierlicher Knochenbau (-10 %)' },
          { value: 'medium', label: 'Mittlerer / normaler Körperbau' },
          { value: 'large', label: 'Kräftiger / breiter Knochenbau (+10 %)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const h = parseFloat(inputs.heightCm) || 175;
      const a = parseInt(inputs.ageYears, 10) || 35;
      const frame = inputs.bodyFrame || 'medium';

      // Creff-Formel:
      // Normal: [(Größe - 100) + (Alter / 10)] × 0,9
      // Zierlich: [(Größe - 100) + (Alter / 10)] × 0,9 × 0,9
      // Kräftig: [(Größe - 100) + (Alter / 10)] × 0,9 × 1,1
      const baseCreff = ((h - 100) + (a / 10)) * 0.9;
      let idealWeight = baseCreff;
      if (frame === 'small') idealWeight = baseCreff * 0.9;
      if (frame === 'large') idealWeight = baseCreff * 1.1;

      // Broca-Index zum Vergleich:
      // Normalgewicht = Größe - 100; Idealgewicht = Normalgewicht × 0,9 (Männer) bzw 0,85 (Frauen)
      const brocaNormal = h - 100;
      const brocaIdeal = brocaNormal * 0.90;

      return {
        primary: { id: 'idealWeight', label: 'Individuelles Idealgewicht (Creff)', value: idealWeight, formattedValue: \`ca. \${formatNumber(idealWeight, 1)} kg\`, highlight: true },
        secondary: [
          { id: 'brocaNormal', label: 'Normalgewicht nach Broca', value: brocaNormal, formattedValue: \`\${formatNumber(brocaNormal, 0)} kg\` },
          { id: 'healthyRange', label: 'Gesunder BMI-Gewichtsbereich (18,5 - 24,9)', value: 0, formattedValue: \`\${formatNumber(18.5 * Math.pow(h / 100, 2), 1)} bis \${formatNumber(24.9 * Math.pow(h / 100, 2), 1)} kg\` },
        ],
        summaryText: \`Für eine Körpergröße von \${h} cm mit \${frame === 'small' ? 'zierlichem' : frame === 'large' ? 'kräftigem' : 'normalem'} Körperbau liegt Ihr optimales Idealgewicht nach Creff bei ca. \${formatNumber(idealWeight, 1)} kg.\`,
      };
    },
    formula: 'Idealgewicht (Creff) = [(Körpergröße in cm - 100) + (Alter / 10)] × 0,9 × Morphologiefaktor',
    formulaExplanation: 'Die Creff-Formel verfeinert den starren Broca-Index, indem sie Alter und individuellen Knochenbau mit einbezieht.',
    workedExample: {
      title: 'Beispiel: 175 cm, 35 Jahre, normaler Körperbau',
      inputValues: [{ label: 'Größe', value: '175 cm' }, { label: 'Alter', value: '35 Jahre' }],
      steps: ['(175 - 100) + (35 / 10) = 75 + 3,5 = 78,5', '78,5 × 0,9 = 70,65 kg'],
      result: 'ca. 70,7 kg Idealgewicht',
    },
    faqs: [
      { question: 'Wie bestimme ich meinen Knochenbau?', answer: 'Umfassen Sie Ihr Handgelenk mit Daumen und Mittelfinger der anderen Hand: Überlappen sich die Finger, haben Sie einen zierlichen Knochenbau; berühren sie sich knapp, ist er mittel; berühren sie sich nicht, ist er kräftig.' },
      { question: 'Warum ist der BMI oft ungenau?', answer: 'Weil der BMI nicht zwischen schwerer Muskelmasse und Fettgewebe unterscheidet. Sportler gelten beim BMI oft fälschlich als übergewichtig.' },
    ],
    relatedSlugs: ['bmi-rechner', 'koerperfettanteil-navy-rechner', 'waist-to-height-ratio-rechner'],
  },

  {
    id: 'koerperfettanteil-navy-rechner',
    slug: 'koerperfettanteil-navy-rechner',
    name: 'Körperfettanteil Rechner (US Navy KFA-Methode)',
    shortName: 'KFA Rechner US Navy',
    category: 'gesundheit-fitness',
    subcategory: 'Gewicht & Körper',
    metaTitle: 'Körperfettanteil Rechner (KFA) – US Navy Formel mit Maßband berechnen',
    metaDescription: 'Berechnen Sie Ihren Körperfettanteil (KFA) in Prozent und reine Fettmasse mit der wissenschaftlich validierten US-Navy-Umfangsmethode (Hals, Taille, Hüfte).',
    h1: 'Körperfettanteil Rechner – KFA nach US Navy Methode ermitteln',
    shortDescription: 'Schätzt den Körperfettanteil präzise ohne Caliper oder teure DEXA-Scans.',
    searchKeywords: ['koerperfettanteil rechner kfa', 'us navy kfa rechner formel', 'koerperfett messen mit massband', 'fettfreie masse berechnen'],
    inputs: [
      { id: 'gender', label: 'Biologisches Geschlecht', type: 'select', defaultValue: 'male', options: [
        { value: 'male', label: 'Männlich' },
        { value: 'female', label: 'Weiblich' },
      ]},
      { id: 'heightCm', label: 'Körpergröße in cm', type: 'number', defaultValue: 180, min: 130, max: 220, step: 1, unit: 'cm' },
      { id: 'neckCm', label: 'Halsumfang in cm (unterhalb des Kehlkopfs)', type: 'number', defaultValue: 39, min: 25, max: 60, step: 0.5, unit: 'cm' },
      { id: 'waistCm', label: 'Taillenumfang in cm (Männer: auf Nabelhöhe, Frauen: schmalste Stelle)', type: 'number', defaultValue: 86, min: 50, max: 160, step: 0.5, unit: 'cm' },
      { id: 'hipCm', label: 'Hüftumfang in cm (nur bei Frauen: breiteste Stelle des Gesäßes)', type: 'number', defaultValue: 98, min: 60, max: 160, step: 0.5, unit: 'cm' },
      { id: 'weightKg', label: 'Aktuelles Körpergewicht in kg', type: 'number', defaultValue: 82, min: 40, max: 200, step: 0.5, unit: 'kg' },
    ],
    calculate: (inputs) => {
      const isMale = inputs.gender === 'male';
      const h = parseFloat(inputs.heightCm) || 180;
      const neck = parseFloat(inputs.neckCm) || 39;
      const waist = parseFloat(inputs.waistCm) || 86;
      const hip = parseFloat(inputs.hipCm) || 98;
      const weight = parseFloat(inputs.weightKg) || 82;

      let kfa = 15;
      if (isMale) {
        // Männer Formel: 495 / (1.0324 - 0.19077 × log10(waist - neck) + 0.15456 × log10(height)) - 450
        const diff = Math.max(1, waist - neck);
        kfa = (495 / (1.0324 - (0.19077 * Math.log10(diff)) + (0.15456 * Math.log10(h)))) - 450;
      } else {
        // Frauen Formel: 495 / (1.29579 - 0.35004 × log10(waist + hip - neck) + 0.22100 × log10(height)) - 450
        const sumDiff = Math.max(1, waist + hip - neck);
        kfa = (495 / (1.29579 - (0.35004 * Math.log10(sumDiff)) + (0.22100 * Math.log10(h)))) - 450;
      }

      const safeKfa = Math.max(3, Math.min(60, kfa));
      const fatMassKg = weight * (safeKfa / 100);
      const leanMassKg = weight - fatMassKg;

      let category = 'Normalbereich';
      if (isMale) {
        if (safeKfa < 6) category = 'Essentielles Fett / Extrem niedrig';
        else if (safeKfa <= 13) category = 'Athlet / Sehr durchtrainiert';
        else if (safeKfa <= 17) category = 'Fitness / Schlank';
        else if (safeKfa <= 24) category = 'Normalbereich';
        else category = 'Erhöhter Körperfettanteil / Übergewicht';
      } else {
        if (safeKfa < 14) category = 'Essentielles Fett / Zu niedrig';
        else if (safeKfa <= 20) category = 'Athletin / Sehr sportlich';
        else if (safeKfa <= 24) category = 'Fitness / Schlank';
        else if (safeKfa <= 31) category = 'Normalbereich';
        else category = 'Erhöhter Körperfettanteil / Übergewicht';
      }

      return {
        primary: { id: 'kfa', label: 'Geschätzter Körperfettanteil (KFA)', value: safeKfa, formattedValue: formatPercent(safeKfa, 1), highlight: true },
        secondary: [
          { id: 'fatMass', label: 'Reine Fettmasse', value: fatMassKg, formattedValue: \`\${formatNumber(fatMassKg, 1)} kg\` },
          { id: 'leanMass', label: 'Fettfreie Masse (Muskeln, Knochen, Wasser)', value: leanMassKg, formattedValue: \`\${formatNumber(leanMassKg, 1)} kg\` },
          { id: 'category', label: 'Einstufung', value: 0, formattedValue: category },
        ],
        summaryText: \`Ihr geschätzter Körperfettanteil beträgt \${formatPercent(safeKfa, 1)} (\${category}). Bei \${weight} kg entspricht das \${formatNumber(fatMassKg, 1)} kg reinem Körperfett und \${formatNumber(leanMassKg, 1)} kg fettfreier Magermasse.\`,
      };
    },
    formula: 'US Navy Formel auf Basis logarithmischer Umfangsmessungen',
    formulaExplanation: 'Die US-Navy-Methode wurde vom Militär entwickelt und korreliert zu über 90 % mit professionellen hydrostatischen Wiegungen.',
    workedExample: {
      title: 'Beispiel: Mann, 180 cm, Hals 39 cm, Bauch 86 cm, 82 kg',
      inputValues: [{ label: 'Größe', value: '180 cm' }, { label: 'Taille-Hals', value: '47 cm Differenz' }],
      steps: ['Logarithmische Berechnung nach US Navy Männer-Formel', 'Errechneter KFA ≈ 15,8 %', 'Fettmasse = 82 kg × 0,158 ≈ 13,0 kg'],
      result: '15,8 % KFA (13 kg Fettmasse)',
    },
    faqs: [
      { question: 'Wie genau ist die US-Navy-Methode im Vergleich zu Körperfettwaagen?', answer: 'Häufig zuverlässiger als günstige Bioimpedanz-Waagen, da Waagen stark durch den täglichen Wasserhaushalt (z. B. nach dem Trinken) verfälscht werden.' },
      { question: 'Wann sollte man messen?', answer: 'Morgens direkt nach dem Aufstehen und dem Gang zur Toilette auf nüchternen Magen, um Magen-Darm-Schwankungen zu minimieren.' },
    ],
    relatedSlugs: ['waist-to-height-ratio-rechner', 'waist-to-hip-ratio-rechner', 'bmi-rechner'],
  },

  {
    id: 'waist-to-hip-ratio-rechner',
    slug: 'waist-to-hip-ratio-rechner',
    name: 'WHR Rechner (Taille-Hüft-Verhältnis & Bauchfett-Risiko)',
    shortName: 'WHR Rechner',
    category: 'gesundheit-fitness',
    subcategory: 'Gewicht & Körper',
    metaTitle: 'WHR Rechner – Taille-Hüft-Verhältnis (Waist-to-Hip-Ratio) berechnen',
    metaDescription: 'Ermitteln Sie Ihr Taille-zu-Hüfte-Verhältnis (WHR) zur Bestimmung des viszeralen Bauchfetts und des kardiovaskulären Risikos (Apfel- vs. Birnenform).',
    h1: 'WHR Rechner – Taille-Hüft-Verhältnis & Gesundheitsrisiko',
    shortDescription: 'Misst das Verhältnis von Taillenumfang zu Hüftumfang zur Beurteilung der Fettverteilung.',
    searchKeywords: ['whr rechner taille huefte verhaeltnis', 'waist to hip ratio berechnen who', 'bauchfett risiko apfelform birnenform', 'viszerales fett messen'],
    inputs: [
      { id: 'gender', label: 'Biologisches Geschlecht', type: 'select', defaultValue: 'female', options: [
        { value: 'female', label: 'Frau (Normalwert unter 0,85)' },
        { value: 'male', label: 'Mann (Normalwert unter 0,90)' },
      ]},
      { id: 'waistCm', label: 'Taillenumfang in cm (schmalste Stelle)', type: 'number', defaultValue: 74, min: 45, max: 160, step: 0.5, unit: 'cm' },
      { id: 'hipCm', label: 'Hüftumfang in cm (breiteste Stelle)', type: 'number', defaultValue: 96, min: 60, max: 180, step: 0.5, unit: 'cm' },
    ],
    calculate: (inputs) => {
      const isMale = inputs.gender === 'male';
      const waist = parseFloat(inputs.waistCm) || 74;
      const hip = parseFloat(inputs.hipCm) || 96;
      const whr = waist / hip;

      let risk = 'Normal / Geringes Risiko (Birnenform)';
      if (isMale) {
        if (whr >= 1.0) risk = 'Stark erhöhtes Herz-Kreislauf-Risiko (ausgeprägte Apfelform)';
        else if (whr >= 0.90) risk = 'Mäßig erhöhtes Risiko';
      } else {
        if (whr >= 0.85) risk = 'Stark erhöhtes Herz-Kreislauf-Risiko (ausgeprägte Apfelform)';
        else if (whr >= 0.80) risk = 'Mäßig erhöhtes Risiko';
      }

      return {
        primary: { id: 'whr', label: 'Taille-Hüft-Verhältnis (WHR)', value: whr, formattedValue: formatNumber(whr, 2), highlight: true },
        secondary: [
          { id: 'risk', label: 'Gesundheitliche Bewertung (WHO)', value: 0, formattedValue: risk },
          { id: 'shape', label: 'Fettverteilungstyp', value: 0, formattedValue: whr > (isMale ? 0.95 : 0.85) ? 'Apfeltyp (Bauchbetont)' : 'Birnentyp (Hüftbetont)' },
        ],
        summaryText: \`Ihr WHR-Wert liegt bei \${formatNumber(whr, 2)} (\${risk}).\`,
      };
    },
    formula: 'WHR = Taillenumfang (cm) / Hüftumfang (cm)',
    formulaExplanation: 'Nach Vorgaben der Weltgesundheitsorganisation (WHO) gilt bei Frauen ein WHR ab 0,85 und bei Männern ab 0,90 als Grenze für viszerales Bauchfett und erhöhtes Herzinfarktrisiko.',
    workedExample: {
      title: 'Beispiel: Frau mit 74 cm Taille und 96 cm Hüfte',
      inputValues: [{ label: 'Taille', value: '74 cm' }, { label: 'Hüfte', value: '96 cm' }],
      steps: ['WHR = 74 / 96 ≈ 0,77', 'Wert liegt unter 0,80 = Idealer Normalbereich'],
      result: 'WHR 0,77 (Birnentyp / Optimal)',
    },
    faqs: [
      { question: 'Warum ist Bauchfett gefährlicher als Hüftfett?', answer: 'Viszerales Bauchfett umhüllt die inneren Organe, ist stoffwechselaktiv und schüttet entzündungsfördernde Botenstoffe aus, die Arteriosklerose und Typ-2-Diabetes begünstigen.' },
      { question: 'Wo genau misst man die Taille?', answer: 'An der schmalsten Stelle des Rumpfes, meist etwa 2 bis 3 cm oberhalb des Bauchnabels bei entspannter Ausatmung.' },
    ],
    relatedSlugs: ['waist-to-height-ratio-rechner', 'koerperfettanteil-navy-rechner', 'bmi-rechner'],
  },

  {
    id: 'waist-to-height-ratio-rechner',
    slug: 'waist-to-height-ratio-rechner',
    name: 'WHtR Rechner (Taille zu Körpergröße & Bauchumfang)',
    shortName: 'WHtR Rechner',
    category: 'gesundheit-fitness',
    subcategory: 'Gewicht & Körper',
    metaTitle: 'WHtR Rechner – Waist-to-Height Ratio & Bauchumfang berechnen',
    metaDescription: 'Berechnen Sie Ihr Taille-zu-Größe-Verhältnis (WHtR): Der moderne wissenschaftliche Nachfolger des BMI zur präzisen Bewertung von Bauchfett nach Alter.',
    h1: 'WHtR Rechner – Waist-to-Height-Ratio nach Alter bestimmen',
    shortDescription: 'Ermittelt das Verhältnis von Taillenumfang zu Körpergröße unter Berücksichtigung des Alters.',
    searchKeywords: ['whtr rechner waist to height ratio', 'taille zu koerpergroesse rechner', 'whtr altersgrenzen tabelle', 'whtr statt bmi vorteile'],
    inputs: [
      { id: 'waistCm', label: 'Taillenumfang in cm (auf Nabelhöhe gemessen)', type: 'number', defaultValue: 82, min: 45, max: 160, step: 0.5, unit: 'cm' },
      { id: 'heightCm', label: 'Körpergröße in cm', type: 'number', defaultValue: 178, min: 120, max: 230, step: 1, unit: 'cm' },
      { id: 'ageYears', label: 'Lebensalter in Jahren', type: 'number', defaultValue: 34, min: 15, max: 99, step: 1, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const waist = parseFloat(inputs.waistCm) || 82;
      const height = parseFloat(inputs.heightCm) || 178;
      const age = parseInt(inputs.ageYears, 10) || 34;
      const whtr = waist / height;

      // Altersabhängige Grenzwerte:
      // Unter 40 Jahre: 0,40 bis 0,50 ideal
      // 40 bis 50 Jahre: 0,40 bis 0,55 ideal
      // Über 50 Jahre: 0,40 bis 0,60 ideal
      let maxHealthy = 0.50;
      if (age >= 50) maxHealthy = 0.60;
      else if (age >= 40) maxHealthy = 0.55;

      let status = 'Optimalgewicht / Kein Bauchfett-Risiko';
      if (whtr < 0.40) status = 'Untergewicht / Zu geringer Bauchumfang';
      else if (whtr > maxHealthy + 0.05) status = 'Deutliches Übergewicht / Stark erhöhtes Gesundheitsrisiko';
      else if (whtr > maxHealthy) status = 'Leichtes Übergewicht';

      return {
        primary: { id: 'whtr', label: 'Waist-to-Height-Ratio (WHtR)', value: whtr, formattedValue: formatNumber(whtr, 2), highlight: true },
        secondary: [
          { id: 'status', label: 'Medizinische Einstufung', value: 0, formattedValue: status },
          { id: 'maxAllowedWaist', label: \`Maximal empfohlener Taillenumfang (für Alter \${age})\`, value: height * maxHealthy, formattedValue: \`\${formatNumber(height * maxHealthy, 1)} cm\` },
        ],
        summaryText: \`Mit einem WHtR von \${formatNumber(whtr, 2)} liegen Sie im Bereich: \${status}. Als Faustregel sollte der Taillenumfang weniger als die halbe Körpergröße betragen (unter \${formatNumber(height * 0.5, 0)} cm).\`,
      };
    },
    formula: 'WHtR = Taillenumfang (cm) / Körpergröße (cm)',
    formulaExplanation: 'Die einfache Faustformel lautet: Der Taillenumfang sollte höchstens die Hälfte der Körpergröße betragen (WHtR < 0,50).',
    workedExample: {
      title: 'Beispiel: 82 cm Taille bei 178 cm Größe (34 Jahre)',
      inputValues: [{ label: 'Taille', value: '82 cm' }, { label: 'Größe', value: '178 cm' }],
      steps: ['WHtR = 82 / 178 ≈ 0,46', 'Wert unter 0,50 = Optimaler Gesundheitsbereich'],
      result: 'WHtR 0,46 (Optimal)',
    },
    faqs: [
      { question: 'Warum gilt der WHtR als besser als der BMI?', answer: 'Weil der WHtR die gefährliche Fettansammlung am Bauch erfasst, während der BMI schwere Muskeln fälschlich als Fett einstuft.' },
      { question: 'Gilt die Grenze 0,5 für alle Altersgruppen?', answer: 'Ab dem 40. Lebensjahr verschiebt sich die tolerierte Grenze pro Lebensjahrzehnt um ca. 0,01 nach oben, sodass bei über 50-Jährigen Werte bis 0,60 als normal gelten.' },
    ],
    relatedSlugs: ['waist-to-hip-ratio-rechner', 'koerperfettanteil-navy-rechner', 'bmi-rechner'],
  },

  {
    id: 'maximalpuls-hfmax-rechner',
    slug: 'maximalpuls-hfmax-rechner',
    name: 'Maximalpuls Rechner (HFmax & Herzfrequenzzonen nach Karvonen)',
    shortName: 'Maximalpuls Rechner',
    category: 'gesundheit-fitness',
    subcategory: 'Training & Sport',
    metaTitle: 'Maximalpuls Rechner – HFmax & Trainingszonen nach Alter & Ruhepuls',
    metaDescription: 'Berechnen Sie Ihre maximale Herzfrequenz (HFmax) und die 5 Trainings-Herzfrequenzzonen (Fettverbrennung, aerob, anaerob) nach der präzisen Karvonen-Formel.',
    h1: 'Maximalpuls Rechner – HFmax & Pulszonen für Ausdauersport',
    shortDescription: 'Ermittelt die maximale Herzfrequenz und individuelle Trainingspulszonen.',
    searchKeywords: ['maximalpuls rechner hfmax', 'herzfrequenzzonen berechnen karvonen', 'fettverbrennungspuls rechner', 'ausdauertraining puls zonen'],
    inputs: [
      { id: 'ageYears', label: 'Alter in Jahren', type: 'number', defaultValue: 35, min: 14, max: 90, step: 1, unit: 'Jahre' },
      { id: 'restingHeartRate', label: 'Ruhepuls am Morgen in Schlägen pro Minute (bpm)', type: 'number', defaultValue: 62, min: 40, max: 100, step: 1, unit: 'bpm' },
      {
        id: 'formulaType',
        label: 'Berechnungsformel HFmax',
        type: 'select',
        defaultValue: 'tanaka',
        options: [
          { value: 'tanaka', label: 'Tanaka-Formel (208 - 0,7 × Alter, moderner Standard)' },
          { value: 'classic', label: 'Klassische Faustformel (220 - Alter)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const a = parseInt(inputs.ageYears, 10) || 35;
      const rhr = parseFloat(inputs.restingHeartRate) || 62;
      const isTanaka = inputs.formulaType === 'tanaka';

      const hfMax = isTanaka ? Math.round(208 - (0.7 * a)) : Math.round(220 - a);
      // Karvonen-Formel: Trainingspuls = Ruhepuls + (HFmax - Ruhepuls) × Intensität
      const hrr = hfMax - rhr; // Herzfrequenzreserve

      const zone1 = Math.round(rhr + (hrr * 0.55)); // Regeneration (50-60%)
      const zone2 = Math.round(rhr + (hrr * 0.65)); // Fettverbrennung / Grundlagenausdauer 1 (60-70%)
      const zone3 = Math.round(rhr + (hrr * 0.75)); // Aerobe Ausdauer (70-80%)
      const zone4 = Math.round(rhr + (hrr * 0.85)); // Anaerobe Schwelle (80-90%)
      const zone5 = Math.round(rhr + (hrr * 0.95)); // Maximalbereich (90-100%)

      return {
        primary: { id: 'hfMax', label: 'Geschätzte maximale Herzfrequenz (HFmax)', value: hfMax, formattedValue: \`\${hfMax} bpm\`, highlight: true },
        secondary: [
          { id: 'zone2', label: 'Zone 2: Grundlagenausdauer & Fettstoffwechsel (60-70 %)', value: zone2, formattedValue: \`ca. \${zone2} bpm\` },
          { id: 'zone3', label: 'Zone 3: Aerobes Ausdauertraining (70-80 %)', value: zone3, formattedValue: \`ca. \${zone3} bpm\` },
          { id: 'zone4', label: 'Zone 4: Anaerobe Schwelle (80-90 %)', value: zone4, formattedValue: \`ca. \${zone4} bpm\` },
        ],
        summaryText: \`Ihre maximale Herzfrequenz liegt bei ca. \${hfMax} bpm. Für optimales Grundlagentraining und Fettstoffwechsel (Zone 2) sollten Sie bei ca. \${zone2} bpm trainieren.\`,
      };
    },
    formula: 'HFmax = 208 - (0,7 × Alter); Trainingspuls = Ruhepuls + (HFmax - Ruhepuls) × Intensität (Karvonen)',
    formulaExplanation: 'Die Karvonen-Formel bezieht den individuellen Ruhepuls ein und ist dadurch wesentlich aussagekräftiger als bloße Prozentwerte vom Maximalpuls.',
    workedExample: {
      title: 'Beispiel: 35 Jahre alt mit Ruhepuls 62 bpm',
      inputValues: [{ label: 'Alter', value: '35 Jahre' }, { label: 'Ruhepuls', value: '62 bpm' }],
      steps: ['HFmax = 208 - (0,7 × 35) = 183,5 ≈ 184 bpm', 'Reserve: 184 - 62 = 122 bpm', 'Zone 2 (65 %): 62 + (122 × 0,65) ≈ 141 bpm'],
      result: 'HFmax 184 bpm (Zone 2 bei ca. 141 bpm)',
    },
    faqs: [
      { question: 'Wie misst man den Ruhepuls am verlässlichsten?', answer: 'Morgens unmittelbar nach dem Aufwachen noch im Liegen im Bett mit Pulsuhr oder manuellem Zählen am Handgelenk über 60 Sekunden.' },
      { question: 'Was ist die Zone-2-Trainingsmethode?', answer: 'Training in Zone 2 (unterhalb der Laktatschwelle) trainiert die Mitochondriendichte und den Fettstoffwechsel optimal und bildet die Basis im Profisport.' },
    ],
    relatedSlugs: ['laufpace-rechner', 'vo2max-cooper-test-rechner', 'puls-trainingszonen-rechner'],
  },

  {
    id: 'vo2max-cooper-test-rechner',
    slug: 'vo2max-cooper-test-rechner',
    name: 'VO2max Rechner (Cooper-Test 12-Minuten-Lauf)',
    shortName: 'VO2max Cooper-Test',
    category: 'gesundheit-fitness',
    subcategory: 'Training & Sport',
    metaTitle: 'VO2max Rechner – Maximale Sauerstoffaufnahme aus Cooper-Test',
    metaDescription: 'Ermitteln Sie Ihre aerobe Ausdauerleistungsfähigkeit (VO2max in ml/kg/min) anhand der gelaufenen Strecke im 12-Minuten-Cooper-Test.',
    h1: 'VO2max Rechner – Sauerstoffaufnahme aus dem Cooper-Test berechnen',
    shortDescription: 'Schätzt die kardiorespiratorische Fitness (VO2max) aus der Laufdistanz in 12 Minuten.',
    searchKeywords: ['vo2max rechner cooper test', 'cooper test tabelle meter ausdauer', 'maximale sauerstoffaufnahme berechnen laufen', 'vo2max bewertung tabelle'],
    inputs: [
      { id: 'distanceMeters', label: 'Im 12-Minuten-Lauf zurückgelegte Distanz in Metern', type: 'number', defaultValue: 2600, min: 800, max: 4500, step: 50, unit: 'Meter' },
      { id: 'ageYears', label: 'Alter in Jahren', type: 'number', defaultValue: 30, min: 14, max: 80, step: 1, unit: 'Jahre' },
      { id: 'gender', label: 'Biologisches Geschlecht', type: 'select', defaultValue: 'male', options: [
        { value: 'male', label: 'Männlich' },
        { value: 'female', label: 'Weiblich' },
      ]},
    ],
    calculate: (inputs) => {
      const d = parseFloat(inputs.distanceMeters) || 2600;
      // Formel nach Dr. Kenneth H. Cooper:
      // VO2max = (Distanz in Metern - 504.9) / 44.73
      const vo2max = Math.max(10, (d - 504.9) / 44.73);

      let fitness = 'Gut / Überdurchschnittlich';
      if (vo2max < 30) fitness = 'Sehr schwach / Trainingsbedarf';
      else if (vo2max < 38) fitness = 'Durchschnittlich';
      else if (vo2max < 48) fitness = 'Gut / Sportlich';
      else if (vo2max < 56) fitness = 'Sehr gut / Leistungssportlich';
      else fitness = 'Exzellent / Spitzensportler-Niveau';

      return {
        primary: { id: 'vo2max', label: 'Geschätzte VO2max', value: vo2max, formattedValue: \`\${formatNumber(vo2max, 1)} ml/kg/min\`, highlight: true },
        secondary: [
          { id: 'fitness', label: 'Ausdauer-Einstufung', value: 0, formattedValue: fitness },
          { id: 'avgPace', label: 'Gelaufene Durchschnittspace', value: 12 / (d / 1000), formattedValue: \`\${formatNumber(12 / (d / 1000), 2)} min/km\` },
          { id: 'speedKmh', label: 'Durchschnittsgeschwindigkeit', value: (d / 1000) / (12 / 60), formattedValue: \`\${formatNumber((d / 1000) / (12 / 60), 1)} km/h\` },
        ],
        summaryText: \`Mit \${formatNumber(d, 0)} Metern in 12 Minuten erreichen Sie eine VO2max von ca. \${formatNumber(vo2max, 1)} ml/kg/min (\${fitness}).\`,
      };
    },
    formula: 'VO2max = (Distanz in Metern - 504,9) / 44,73',
    formulaExplanation: 'Die maximale Sauerstoffaufnahme (VO2max) gilt in der Sportmedizin als das wichtigste Bruttokriterium für die Ausdauerleistungsfähigkeit eines Menschen.',
    workedExample: {
      title: 'Beispiel: 2.600 Meter im 12-Minuten-Lauf',
      inputValues: [{ label: 'Distanz', value: '2.600 m' }],
      steps: ['2.600 - 504,9 = 2.095,1', '2.095,1 / 44,73 ≈ 46,84 ml/kg/min'],
      result: '46,8 ml/kg/min (Gute Ausdauer)',
    },
    faqs: [
      { question: 'Was bedeutet die Einheit ml/kg/min?', answer: 'Sie gibt an, wie viele Milliliter Sauerstoff der Körper pro Kilogramm Körpergewicht in einer Minute bei maximaler Belastung verwerten kann.' },
      { question: 'Welche VO2max haben Elitesportler?', answer: 'Männliche Marathonläufer oder Radprofis erreichen oft Werte von 70 bis 85 ml/kg/min, Skilangläufer teils bis über 90 ml/kg/min.' },
    ],
    relatedSlugs: ['laufpace-rechner', 'maximalpuls-hfmax-rechner', 'schritt-distanz-kalorien-rechner'],
  },

  {
    id: 'one-rep-max-rechner',
    slug: 'one-rep-max-rechner',
    name: '1RM Rechner (One-Rep-Maximalgewicht nach Epley & Brzycki)',
    shortName: '1RM Rechner',
    category: 'gesundheit-fitness',
    subcategory: 'Training & Sport',
    metaTitle: '1RM Rechner – One Rep Max Maximalgewicht Krafttraining berechnen',
    metaDescription: 'Berechnen Sie Ihr Einer-Wiederholungs-Maximum (1RM) für Bankdrücken, Kniebeugen oder Kreuzheben nach Epley, Brzycki und Lombardi ohne Verletzungsrisiko.',
    h1: '1RM Rechner – Maximalgewicht im Kraftsport berechnen',
    shortDescription: 'Schätzt das 1-Rep-Maximum aus Wiederholungen mit submaximalem Trainingsgewicht.',
    searchKeywords: ['1rm rechner kraftsport', 'one rep max berechnen epley brzycki', 'maximalgewicht bankdruecken rechner', 'prozent maximalgewicht tabelle'],
    inputs: [
      { id: 'liftedWeightKg', label: 'Bewältigtes Trainingsgewicht in kg', type: 'number', defaultValue: 80, min: 5, max: 500, step: 2.5, unit: 'kg' },
      { id: 'repsCount', label: 'Saubere Wiederholungen (ideal 2 bis 10)', type: 'number', defaultValue: 6, min: 1, max: 20, step: 1 },
    ],
    calculate: (inputs) => {
      const w = parseFloat(inputs.liftedWeightKg) || 80;
      const r = parseInt(inputs.repsCount, 10) || 6;

      if (r === 1) {
        return {
          primary: { id: 'rm1', label: 'Ihr One-Rep-Max (1RM)', value: w, formattedValue: \`\${formatNumber(w, 1)} kg\`, highlight: true },
          secondary: [
            { id: 'rm5', label: '5RM (ca. 87 %)', value: w * 0.87, formattedValue: \`\${formatNumber(w * 0.87, 1)} kg\` },
            { id: 'rm10', label: '10RM (ca. 75 %)', value: w * 0.75, formattedValue: \`\${formatNumber(w * 0.75, 1)} kg\` },
          ],
          summaryText: \`Ihr 1RM beträgt exakt \${formatNumber(w, 1)} kg.\`,
        };
      }

      // Epley-Formel: 1RM = Gewicht × (1 + r / 30)
      const epley = w * (1 + (r / 30));
      // Brzycki-Formel: 1RM = Gewicht / (1.0278 - 0.0278 × r)
      const brzycki = w / (1.0278 - (0.0278 * r));
      const avg1Rm = (epley + brzycki) / 2;

      return {
        primary: { id: 'avg1Rm', label: 'Geschätztes One-Rep-Max (1RM)', value: avg1Rm, formattedValue: \`ca. \${formatNumber(avg1Rm, 1)} kg\`, highlight: true },
        secondary: [
          { id: 'epley', label: 'Nach Epley-Formel', value: epley, formattedValue: \`\${formatNumber(epley, 1)} kg\` },
          { id: 'brzycki', label: 'Nach Brzycki-Formel', value: brzycki, formattedValue: \`\${formatNumber(brzycki, 1)} kg\` },
          { id: 'reps75', label: 'Trainingsgewicht für 10 Wdh. (75 %)', value: avg1Rm * 0.75, formattedValue: \`ca. \${formatNumber(avg1Rm * 0.75, 1)} kg\` },
        ],
        summaryText: \`Aus \${r} Wiederholungen mit \${w} kg errechnet sich ein geschätztes 1RM von ca. \${formatNumber(avg1Rm, 1)} kg. Ihr Hypertrophie-Trainingsgewicht (10 Wdh. bei 75 %) liegt bei ca. \${formatNumber(avg1Rm * 0.75, 1)} kg.\`,
      };
    },
    formula: '1RM = Gewicht × (1 + Wiederholungen / 30) [Epley-Formel]',
    formulaExplanation: 'Die Schätzung schont Sehnen und Gelenke, da echte Maximalkraftversuche (Singles) ein hohes Verletzungsrisiko bergen.',
    workedExample: {
      title: 'Beispiel: 6 Wiederholungen mit 80 kg Bankdrücken',
      inputValues: [{ label: 'Gewicht', value: '80 kg' }, { label: 'Wiederholungen', value: '6' }],
      steps: ['Epley: 80 × (1 + 6/30) = 80 × 1,2 = 96,0 kg', 'Brzycki: 80 / (1,0278 - 0,0278 × 6) ≈ 92,9 kg', 'Mittelwert ≈ 94,5 kg'],
      result: 'ca. 94,5 kg Maximalgewicht',
    },
    faqs: [
      { question: 'Bis zu wie vielen Wiederholungen ist der 1RM-Rechner genau?', answer: 'Am genauesten sind Berechnungen aus 3 bis 8 Wiederholungen. Bei mehr als 10 bis 12 Wiederholungen spielt die Kraftausdauer eine zu große Rolle.' },
      { question: 'In welchem Prozentbereich trainiert man für Muskelaufbau?', answer: 'Für Hypertrophie (Muskelaufbau) trainiert man üblicherweise mit 65 % bis 85 % des 1RM (ca. 6 bis 12 Wiederholungen).' },
    ],
    relatedSlugs: ['proteinbedarf-sportler-rechner', 'makronaehrstoff-verteilung-rechner', 'maximalpuls-hfmax-rechner'],
  },

  {
    id: 'schritt-distanz-kalorien-rechner',
    slug: 'schritt-distanz-kalorien-rechner',
    name: 'Schritte Rechner (Schrittlänge, Kilometer & Kalorien)',
    shortName: 'Schritte Rechner',
    category: 'gesundheit-fitness',
    subcategory: 'Training & Sport',
    metaTitle: 'Schritte in km & Kalorien Rechner – 10.000 Schritte umrechnen',
    metaDescription: 'Rechnen Sie Ihre Schritte in Kilometer und verbrannte Kalorien um: Individuelle Schrittlänge nach Körpergröße und Kalorienverbrauch beim Gehen.',
    h1: 'Schritte Rechner – Schritte in Kilometer & Kalorien umrechnen',
    shortDescription: 'Wandelt gezählte Schritte anhand der Körpergröße in exakte Distanz und Kalorienverbrauch um.',
    searchKeywords: ['schritte in km umrechnen rechner', '10000 schritte wie viele kilometer kalorien', 'schrittlaenge berechnen groesse', 'schrittzaehler kalorienverbrauch'],
    inputs: [
      { id: 'stepsCount', label: 'Anzahl der Schritte (z. B. 10.000 Schritte)', type: 'number', defaultValue: 10000, min: 500, max: 80000, step: 500, unit: 'Schritte' },
      { id: 'heightCm', label: 'Ihre Körpergröße in cm', type: 'number', defaultValue: 175, min: 120, max: 220, step: 1, unit: 'cm' },
      { id: 'weightKg', label: 'Körpergewicht in kg', type: 'number', defaultValue: 75, min: 40, max: 200, step: 1, unit: 'kg' },
    ],
    calculate: (inputs) => {
      const steps = parseInt(inputs.stepsCount, 10) || 10000;
      const h = parseFloat(inputs.heightCm) || 175;
      const w = parseFloat(inputs.weightKg) || 75;

      // Durchschnittliche Schrittlänge beim normalen Gehen ≈ Körpergröße × 0,42 (Frauen) bis 0,43 (Männer)
      const stepLengthMeters = (h * 0.425) / 100; // z. B. 175 cm -> 0,744 m
      const distanceKm = (steps * stepLengthMeters) / 1000;
      // Kalorienverbrauch beim Gehen ca. 0,5 kcal pro kg Körpergewicht und Kilometer
      const burnedKcal = distanceKm * w * 0.52;

      return {
        primary: { id: 'distanceKm', label: 'Zurückgelegte Distanz', value: distanceKm, formattedValue: \`\${formatNumber(distanceKm, 2)} km\`, highlight: true },
        secondary: [
          { id: 'burnedKcal', label: 'Verbrannte Kalorien', value: burnedKcal, formattedValue: \`ca. \${formatNumber(burnedKcal, 0)} kcal\` },
          { id: 'stepLengthCm', label: 'Berechnete Schrittlänge', value: stepLengthMeters * 100, formattedValue: \`\${formatNumber(stepLengthMeters * 100, 1)} cm\` },
          { id: 'stepsPerKm', label: 'Schritte für 1 Kilometer', value: 1000 / stepLengthMeters, formattedValue: \`ca. \${formatNumber(1000 / stepLengthMeters, 0)} Schritte\` },
        ],
        summaryText: \`\${formatNumber(steps, 0)} Schritte entsprechen bei Ihrer Schrittlänge von \${formatNumber(stepLengthMeters * 100, 1)} cm einer Distanz von \${formatNumber(distanceKm, 2)} km und verbrennen ca. \${formatNumber(burnedKcal, 0)} kcal.\`,
      };
    },
    formula: 'Distanz (km) = (Schritte × Körpergröße × 0,425) / 100.000; Kalorien ≈ Distanz × Gewicht × 0,52',
    formulaExplanation: 'Die Schrittlänge hängt direkt von der Beinlänge und Körpergröße ab. Beim zügigen Gehen verbrennt ein Erwachsener rund 40 bis 50 kcal pro 1.000 Schritte.',
    workedExample: {
      title: 'Beispiel: 10.000 Schritte bei 175 cm und 75 kg',
      inputValues: [{ label: 'Schritte', value: '10.000' }, { label: 'Größe', value: '175 cm' }, { label: 'Gewicht', value: '75 kg' }],
      steps: ['Schrittlänge = 175 × 0,425 = 74,4 cm = 0,744 m', 'Distanz = 10.000 × 0,744 m = 7,44 km', 'Kalorien = 7,44 km × 75 kg × 0,52 ≈ 290 kcal'],
      result: '7,44 km & ca. 290 kcal',
    },
    faqs: [
      { question: 'Müssen es wirklich 10.000 Schritte pro Tag sein?', answer: 'Neuere wissenschaftliche Studien zeigen, dass bereits ab 6.000 bis 8.000 Schritten pro Tag das Risiko für Herz-Kreislauf-Erkrankungen und vorzeitige Sterblichkeit drastisch sinkt.' },
      { question: 'Wie viele Schritte sind 1 Kilometer?', answer: 'Im Durchschnitt benötigt ein Erwachsener zwischen 1.250 und 1.450 Schritte für einen Kilometer.' },
    ],
    relatedSlugs: ['laufpace-rechner', 'kalorienbedarf-rechner', 'vo2max-cooper-test-rechner'],
  },

  {
    id: 'schlafbedarfs-rechner',
    slug: 'schlafbedarfs-rechner',
    name: 'Schlafzyklen & Schlafbedarfs Rechner (90-Minuten-Zyklen)',
    shortName: 'Schlafbedarfs Rechner',
    category: 'gesundheit-fitness',
    subcategory: 'Erholung & Vitalität',
    metaTitle: 'Schlafbedarfs Rechner – Optimale Aufstehzeit nach 90-Minuten-Schlafzyklen',
    metaDescription: 'Berechnen Sie die perfekte Einschlafzeit und Weckzeit nach natürlichen 90-Minuten-Schlafzyklen, um erholt und ohne Müdigkeit aufzuwachen.',
    h1: 'Schlafbedarfs Rechner – Perfekte Einschlaf- & Weckzeit ermitteln',
    shortDescription: 'Berechnet Aufstehzeiten passend zum Ende vollständiger 90-minütiger Schlafzyklen.',
    searchKeywords: ['schlafbedarfs rechner aufstehzeit', '90 minuten schlafzyklus rechner', 'wann muss ich ins bett gehen', 'schlafrechner aufwachen erholt'],
    inputs: [
      { id: 'wakeHour', label: 'Gewünschte Aufstehzeit (Stunde 0 - 23)', type: 'number', defaultValue: 6, min: 0, max: 23, step: 1 },
      { id: 'wakeMinute', label: 'Gewünschte Aufstehzeit (Minute 0 - 59)', type: 'number', defaultValue: 30, min: 0, max: 59, step: 5 },
      { id: 'fallAsleepMinutes', label: 'Durchschnittliche Einschlafdauer in Minuten (Standard: 15 Min.)', type: 'number', defaultValue: 15, min: 5, max: 60, step: 5, unit: 'Minuten' },
    ],
    calculate: (inputs) => {
      const h = parseInt(inputs.wakeHour, 10) || 6;
      const m = parseInt(inputs.wakeMinute, 10) || 30;
      const fallAsleep = parseInt(inputs.fallAsleepMinutes, 10) || 15;

      const wakeTotalMins = (h * 60) + m;

      // 5 Zyklen (7,5 h Schlaf) = 450 min + Einschlafzeit
      const mins5Cycles = wakeTotalMins - (450 + fallAsleep);
      // 6 Zyklen (9,0 h Schlaf) = 540 min + Einschlafzeit
      const mins6Cycles = wakeTotalMins - (540 + fallAsleep);
      // 4 Zyklen (6,0 h Schlaf) = 360 min + Einschlafzeit
      const mins4Cycles = wakeTotalMins - (360 + fallAsleep);

      const formatTime = (totalM: number) => {
        let normalized = totalM;
        while (normalized < 0) normalized += 1440;
        normalized = normalized % 1440;
        const hh = Math.floor(normalized / 60);
        const mm = normalized % 60;
        return \`\${hh < 10 ? '0' + hh : hh}:\${mm < 10 ? '0' + mm : mm} Uhr\`;
      };

      return {
        primary: { id: 'idealBedtime', label: 'Empfohlene Bettzeit (5 Zyklen = 7,5 Std. Schlaf)', value: 0, formattedValue: formatTime(mins5Cycles), highlight: true },
        secondary: [
          { id: 'longBedtime', label: 'Langer Schlaf (6 Zyklen = 9,0 Std.)', value: 0, formattedValue: formatTime(mins6Cycles) },
          { id: 'shortBedtime', label: 'Kurzer Schlaf (4 Zyklen = 6,0 Std.)', value: 0, formattedValue: formatTime(mins4Cycles) },
          { id: 'cycleLength', label: 'Dauer eines Schlafzyklus', value: 90, formattedValue: '90 Minuten' },
        ],
        summaryText: \`Um um \${h < 10 ? '0' + h : h}:\${m < 10 ? '0' + m : m} Uhr erholt aufzuwachen, sollten Sie um \${formatTime(mins5Cycles)} (5 Zyklen) oder um \${formatTime(mins6Cycles)} (6 Zyklen) einschlafen.\`,
      };
    },
    formula: 'Aufstehzeit = Bettgehzeit + Einschlafdauer + (Anzahl Zyklen × 90 Minuten)',
    formulaExplanation: 'Ein gesunder Schlaf besteht aus ca. 90-minütigen Zyklen von Leichtschlaf, Tiefschlaf und REM-Traumschlaf. Wer am Ende eines Zyklus erwacht, fühlt sich frisch und energiegeladen.',
    workedExample: {
      title: 'Beispiel: Aufstehen um 06:30 Uhr mit 15 Minuten Einschlafzeit',
      inputValues: [{ label: 'Aufstehzeit', value: '06:30 Uhr' }, { label: 'Zyklen', value: '5 Zyklen (7,5 h)' }],
      steps: ['06:30 Uhr - 7,5 Stunden = 23:00 Uhr', 'Abzüglich 15 Minuten Einschlafen = 22:45 Uhr'],
      result: '22:45 Uhr ins Bett gehen',
    },
    faqs: [
      { question: 'Warum fühlt man sich manchmal nach 8 Stunden müder als nach 7,5 Stunden?', answer: 'Weil ein Wecker nach 8 Stunden mitten in der Tiefschlafphase klingelt (Schlafträgheit / Sleep Inertia), während 7,5 Stunden genau 5 vollständigen Zyklen entsprechen.' },
      { question: 'Wie viele Stunden Schlaf braucht ein Erwachsener?', answer: 'Die National Sleep Foundation empfiehlt für Erwachsene zwischen 18 und 64 Jahren 7 bis 9 Stunden Schlaf pro Nacht.' },
    ],
    relatedSlugs: ['koffein-halbwertszeit-rechner', 'intervallfasten-16-8-rechner', 'wasserbedarf-rechner'],
  },

  {
    id: 'nikotin-rauchstopp-ersparnis-rechner',
    slug: 'nikotin-rauchstopp-ersparnis-rechner',
    name: 'Rauchstopp Rechner (Geldersparnis & Gewonnene Lebenszeit)',
    shortName: 'Rauchstopp Rechner',
    category: 'gesundheit-fitness',
    subcategory: 'Erholung & Vitalität',
    metaTitle: 'Rauchstopp Rechner – Ersparnis & gewonnene Lebenszeit berechnen',
    metaDescription: 'Berechnen Sie, wie viel Tausende Euro Geld und wie viele Tage Lebenszeit Sie durch den Rauchstopp nach 1, 5 und 10 Jahren Nichtrauchen gewinnen.',
    h1: 'Rauchstopp Rechner – Geldersparnis & Gesundheit durch Nichtrauchen',
    shortDescription: 'Ermittelt die finanzielle Ersparnis und gesundheitliche Vorteile beim Aufhören mit dem Rauchen.',
    searchKeywords: ['rauchstopp rechner ersparnis', 'nichtraucher rechner geld lebenszeit', 'was spare ich wenn ich mit rauchen aufhoere', 'zigarettenkosten pro jahr'],
    inputs: [
      { id: 'cigsPerDay', label: 'Zigaretten pro Tag bisher', type: 'number', defaultValue: 19, min: 1, max: 100, step: 1, unit: 'Zigaretten' },
      { id: 'packPrice', label: 'Preis pro Schachtel (z. B. 20 Zigaretten)', type: 'number', defaultValue: 8.50, min: 4, max: 20, step: 0.5, unit: '€' },
      { id: 'cigsPerPack', label: 'Zigarettenanzahl in einer Schachtel', type: 'number', defaultValue: 20, min: 10, max: 60, step: 1, unit: 'Stück' },
    ],
    calculate: (inputs) => {
      const cigs = parseInt(inputs.cigsPerDay, 10) || 19;
      const price = parseFloat(inputs.packPrice) || 8.50;
      const perPack = parseInt(inputs.cigsPerPack, 10) || 20;

      const costPerCig = price / perPack;
      const dailyCost = cigs * costPerCig;
      const yearlyCost = dailyCost * 365;
      const cost5Years = yearlyCost * 5;
      const cost10Years = yearlyCost * 10;

      // Wissenschaftliche Schätzung: Jede gerauchte Zigarette kostet durchschnittlich ca. 11 bis 14 Minuten Lebenszeit
      const minutesSavedPerDay = cigs * 12;
      const daysGainedPerYear = (minutesSavedPerDay * 365) / (60 * 24);

      return {
        primary: { id: 'yearlyCost', label: 'Jährliche Geldersparnis', value: yearlyCost, formattedValue: formatCurrency(yearlyCost), highlight: true },
        secondary: [
          { id: 'cost10Years', label: 'Ersparnis nach 10 Jahren Nichtrauchen', value: cost10Years, formattedValue: formatCurrency(cost10Years) },
          { id: 'cost5Years', label: 'Ersparnis nach 5 Jahren', value: cost5Years, formattedValue: formatCurrency(cost5Years) },
          { id: 'daysGained', label: 'Gewonnene Lebenszeit pro Jahr Nichtrauchen', value: daysGainedPerYear, formattedValue: \`ca. \${formatNumber(daysGainedPerYear, 0)} Tage\` },
        ],
        summaryText: \`Durch den Rauchstopp sparen Sie jährlich \${formatCurrency(yearlyCost)} (\${formatCurrency(dailyCost)} pro Tag). Nach 10 Jahren haben Sie rund \${formatCurrency(cost10Years)} mehr auf dem Konto und gewinnen wertvolle Lebensjahre!\`,
      };
    },
    formula: 'Ersparnis = Zigaretten/Tag × (Schachtelpreis / Schachtelinhalt) × 365',
    formulaExplanation: 'Rauchen ist einer der teuersten Lebensgewohnheiten. Bei einer Schachtel täglich fließen über 3.000 Euro pro Jahr sprichwörtlich in Rauch auf.',
    workedExample: {
      title: 'Beispiel: 1 Schachtel (19 Zigaretten à 8,50 €) täglich',
      inputValues: [{ label: 'Konsum', value: '19 Zigaretten/Tag' }, { label: 'Preis', value: '8,50 € / 20er Pack' }],
      steps: ['Kosten pro Zigarette = 0,425 €', 'Täglich = 8,075 €', 'Jährlich = 8,075 € × 365 ≈ 2.947,38 €', '10 Jahre = fast 30.000 €'],
      result: 'ca. 2.947,38 € Ersparnis jedes Jahr',
    },
    faqs: [
      { question: 'Wie schnell erholt sich der Körper nach dem Rauchstopp?', answer: 'Bereits nach 20 Minuten sinken Puls und Blutdruck, nach 48 Stunden verbessern sich Geruchs- und Geschmackssinn, und nach 1 Jahr halbiert sich das Risiko für eine koronare Herzkrankheit.' },
      { question: 'Was passiert mit dem gesparten Geld im ETF-Sparplan?', answer: 'Wer 250 € monatlich in einen weltweiten Aktien-ETF bei 7 % Rendite anlegt, besitzt nach 10 Jahren über 43.000 € und nach 20 Jahren über 130.000 € Vermögen.' },
    ],
    relatedSlugs: ['sparplanrechner', 'koffein-halbwertszeit-rechner', 'lebensmittelbudget-rechner'],
  },

  {
    id: 'koffein-halbwertszeit-rechner',
    slug: 'koffein-halbwertszeit-rechner',
    name: 'Koffein Rechner (Halbwertszeit, Kaffee & Schlafenszeit)',
    shortName: 'Koffein Rechner',
    category: 'gesundheit-fitness',
    subcategory: 'Erholung & Vitalität',
    metaTitle: 'Koffein Rechner – Halbwertszeit & verbleibendes Koffein zur Schlafenszeit',
    metaDescription: 'Berechnen Sie den Koffeinabbau in Ihrem Körper: Wie viel mg Koffein aus Kaffee, Espresso, Cola oder Energy Drinks ist zur Schlafenszeit noch aktiv?',
    h1: 'Koffein Rechner – Halbwertszeit & Koffeinabbau berechnen',
    shortDescription: 'Ermittelt den Restkoffeingehalt im Blut zur Schlafenszeit nach Kaffeekonsum.',
    searchKeywords: ['koffein rechner halbwertszeit', 'kaffee halbwertszeit schlaf', 'koffeinabbau stunden rechner', 'wie viel koffein espresso red bull'],
    inputs: [
      {
        id: 'drinkType',
        label: 'Koffeingetränk',
        type: 'select',
        defaultValue: 'filter_coffee',
        options: [
          { value: 'filter_coffee', label: 'Tasse Filterkaffee (200 ml, ca. 90 mg Koffein)' },
          { value: 'espresso', label: 'Einfacher Espresso (30 ml, ca. 65 mg Koffein)' },
          { value: 'double_espresso', label: 'Doppelter Espresso / Cappuccino (ca. 130 mg Koffein)' },
          { value: 'energy_drink', label: 'Energy Drink Dose (250 ml, ca. 80 mg Koffein)' },
          { value: 'cola', label: 'Glas Cola (330 ml, ca. 35 mg Koffein)' },
        ],
      },
      { id: 'servingsCount', label: 'Anzahl Portionen / Tassen', type: 'number', defaultValue: 2, min: 1, max: 10, step: 1 },
      { id: 'hoursUntilBed', label: 'Stunden zwischen Konsum und geplantem Schlafengehen', type: 'number', defaultValue: 6, min: 1, max: 24, step: 1, unit: 'Stunden' },
    ],
    calculate: (inputs) => {
      const type = inputs.drinkType || 'filter_coffee';
      const count = parseInt(inputs.servingsCount, 10) || 2;
      const hours = parseFloat(inputs.hoursUntilBed) || 6;

      const mgTable: Record<string, number> = {
        filter_coffee: 90,
        espresso: 65,
        double_espresso: 130,
        energy_drink: 80,
        cola: 35,
      };
      const initialMg = (mgTable[type] || 90) * count;

      // Biologische Halbwertszeit von Koffein bei gesunden Erwachsenen ca. 5 Stunden
      const halfLife = 5.0;
      const remainingMg = initialMg * Math.pow(0.5, hours / halfLife);

      let sleepImpact = 'Kein spürbarer Einfluss / Unbedenklich';
      if (remainingMg > 100) sleepImpact = 'Starke Schlafstörung sehr wahrscheinlich! Tiefschlaf stark vermindert.';
      else if (remainingMg > 50) sleepImpact = 'Spürbarer Einfluss auf Einschlafzeit und REM-Schlafqualität.';
      else if (remainingMg > 25) sleepImpact = 'Leichter Einfluss bei koffeinempfindlichen Menschen.';

      return {
        primary: { id: 'remainingMg', label: 'Verbleibendes Koffein im Körper zur Schlafenszeit', value: remainingMg, formattedValue: \`ca. \${formatNumber(remainingMg, 0)} mg\`, highlight: true },
        secondary: [
          { id: 'sleepImpact', label: 'Auswirkung auf den Schlaf', value: 0, formattedValue: sleepImpact },
          { id: 'initialMg', label: 'Aufgenommenes Koffein gesamt', value: initialMg, formattedValue: \`\${initialMg} mg\` },
          { id: 'halfLifeHours', label: 'Angenommene Halbwertszeit', value: 5, formattedValue: 'ca. 5,0 Stunden' },
        ],
        summaryText: \`Nach \${hours} Stunden sind von ursprünglich \${initialMg} mg Koffein immer noch ca. \${formatNumber(remainingMg, 0)} mg in Ihrem Blutkreislauf aktiv (\${sleepImpact}).\`,
      };
    },
    formula: 'Restkoffein = Anfangsmenge × (0,5)^(Stunden / 5)',
    formulaExplanation: 'Koffein blockiert die Adenosin-Rezeptoren im Gehirn, die für das natürliche Müdigkeitsgefühl sorgen. Durch die Halbwertszeit von ca. 5 Stunden zirkuliert nach 10 Stunden noch immer ein Viertel der Dosis im Körper.',
    workedExample: {
      title: 'Beispiel: 2 Tassen Kaffee (180 mg Koffein) 6 Stunden vor dem Schlafen',
      inputValues: [{ label: 'Menge', value: '180 mg' }, { label: 'Zeitabstand', value: '6 Stunden' }],
      steps: ['Halbwertszeit: 5 Stunden', 'Restmenge = 180 × 0,5^(6/5) = 180 × 0,435 ≈ 78 mg'],
      result: 'ca. 78 mg Restkoffein (entspricht fast einer Tasse Kaffee im Blut!)',
    },
    faqs: [
      { question: 'Wann sollte man den letzten Kaffee des Tages trinken?', answer: 'Schlafforscher empfehlen, den letzten Kaffee mindestens 8 bis 10 Stunden vor dem geplanten Zubettgehen zu trinken (spätestens um 14:00 Uhr bei Nachtruhe um 23:00 Uhr).' },
      { question: 'Wie viel Koffein gilt pro Tag als unbedenklich?', answer: 'Die Europäische Behörde für Lebensmittelsicherheit (EFSA) stuft für gesunde Erwachsene Einzeldosen bis 200 mg und Tagesmengen bis 400 mg als gesundheitlich unbedenklich ein.' },
    ],
    relatedSlugs: ['schlafbedarfs-rechner', 'wasserbedarf-rechner', 'promillerechner-widmark'],
  },

  {
    id: 'alkohol-abbau-rechner',
    slug: 'alkohol-abbau-rechner',
    name: 'Alkoholabbau & Leberstoffwechsel Rechner',
    shortName: 'Alkoholabbau Rechner',
    category: 'gesundheit-fitness',
    subcategory: 'Erholung & Vitalität',
    metaTitle: 'Alkoholabbau Rechner – Wie lange braucht die Leber für Bier & Wein?',
    metaDescription: 'Berechnen Sie den genauen zeitlichen Verlauf des Alkoholabbaus in der Leber nach getrunkenen Gläsern Bier, Wein oder Schnaps bis zu 0,0 Promille.',
    h1: 'Alkoholabbau Rechner – Restalkohol & Nüchterntimer ermitteln',
    shortDescription: 'Berechnet die Stunden bis zum vollständigen Abbau von Alkohol im Körper.',
    searchKeywords: ['alkohol abbau rechner', 'wie lange dauert es bis bier abgebaut ist', 'leber alkoholabbau gramm pro stunde', 'restalkohol am naechsten morgen'],
    inputs: [
      { id: 'pureAlcoholGrams', label: 'Getrunkene Alkoholmenge in Gramm (z. B. 2 Halbe Bier = ca. 40 g)', type: 'number', defaultValue: 48, min: 5, max: 250, step: 4, unit: 'Gramm' },
      {
        id: 'gender',
        label: 'Biologisches Geschlecht',
        type: 'select',
        defaultValue: 'male',
        options: [
          { value: 'male', label: 'Männlich (Abbau ca. 0,10 - 0,15 ‰ bzw. ca. 8 - 10 g pro Stunde)' },
          { value: 'female', label: 'Weiblich (Abbau ca. 0,08 - 0,12 ‰ bzw. ca. 6 - 8 g pro Stunde)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const g = parseFloat(inputs.pureAlcoholGrams) || 48;
      const isMale = inputs.gender === 'male';
      // Abbaugeschwindigkeit: Männer ca. 9 Gramm/Std, Frauen ca. 7 Gramm/Std
      const degradationRatePerHour = isMale ? 9.0 : 7.0;
      const hoursNeeded = g / degradationRatePerHour;

      return {
        primary: { id: 'hoursNeeded', label: 'Benötigte Zeit bis zum vollständigen Abbau', value: hoursNeeded, formattedValue: \`ca. \${formatNumber(hoursNeeded, 1)} Stunden\`, highlight: true },
        secondary: [
          { id: 'rate', label: 'Abbaugeschwindigkeit der Leber', value: degradationRatePerHour, formattedValue: \`ca. \${degradationRatePerHour} Gramm/Stunde\` },
          { id: 'beersEquivalent', label: 'Entspricht etwa', value: g / 20, formattedValue: \`ca. \${formatNumber(g / 20, 1)} Halbe Bier (0,5 l)\` },
        ],
        summaryText: \`Für den Abbau von \${g} Gramm Reinalkohol benötigt Ihre Leber rund \${formatNumber(hoursNeeded, 1)} Stunden. Der Prozess kann biologisch nicht beschleunigt werden.\`,
      };
    },
    formula: 'Abbauzeit (Stunden) = Reinalkohol in Gramm / Abbaukapazität pro Stunde (ca. 7 - 9 g/h)',
    formulaExplanation: 'Das Enzym Alkoholdehydrogenase (ADH) in der Leber arbeitet mit einer konstanten Geschwindigkeit (Nullter Ordnung).',
    workedExample: {
      title: 'Beispiel: 48 Gramm Alkohol (ca. 2,5 Gläser Bier oder 0,5 l Wein)',
      inputValues: [{ label: 'Alkohol', value: '48 Gramm' }, { label: 'Geschlecht', value: 'Mann' }],
      steps: ['Abbaukapazität Mann: ca. 9 g pro Stunde', 'Zeit = 48 g / 9 g/h ≈ 5,33 Stunden'],
      result: 'ca. 5 Stunden und 20 Minuten Abbauzeit',
    },
    faqs: [
      { question: 'Kann man den Alkoholabbau durch Schlaf oder Duschen beschleunigen?', answer: 'Nein, weder Bewegung noch Schlaf, Schwitzen, kaltes Duschen oder Energy Drinks beschleunigen die chemische Zerlegung von Alkohol in der Leber.' },
      { question: 'Wann sollte man nach einer Feier wieder Auto fahren?', answer: 'Erst wenn nachweislich 0,0 Promille erreicht sind. Viele Autofahrer unterschätzen den Restalkohol am nächsten Morgen erheblich.' },
    ],
    relatedSlugs: ['promillerechner-widmark', 'koffein-halbwertszeit-rechner', 'schlafbedarfs-rechner'],
  },

  {
    id: 'intervallfasten-16-8-rechner',
    slug: 'intervallfasten-16-8-rechner',
    name: 'Intervallfasten Rechner (16:8 Fastenfenster & Essenszeiten)',
    shortName: 'Intervallfasten 16:8',
    category: 'gesundheit-fitness',
    subcategory: 'Ernährung & Kalorien',
    metaTitle: 'Intervallfasten Rechner 16:8 – Essensfenster & Fastenzeiten berechnen',
    metaDescription: 'Berechnen Sie Ihre optimalen Essens- und Fastenzeiten für das 16:8-Intervallfasten (Autophagie, Insulinsensitivität und Fettverbrennung).',
    h1: 'Intervallfasten Rechner – 16:8 Essens- und Fastenfenster planen',
    shortDescription: 'Plant Beginn und Ende des 8-stündigen Essens- und 16-stündigen Fastenfensters.',
    searchKeywords: ['intervallfasten rechner 16 8', '16 8 methode essenszeiten plan', 'fastenfenster berechnen autophagie', 'intermittierendes fasten uhrzeiten'],
    inputs: [
      { id: 'firstMealHour', label: 'Uhrzeit der ersten Mahlzeit (z. B. 12:00 Uhr)', type: 'number', defaultValue: 12, min: 6, max: 20, step: 1, unit: 'Uhr' },
      {
        id: 'fastingRatio',
        label: 'Fastenmethode',
        type: 'select',
        defaultValue: '16_8',
        options: [
          { value: '16_8', label: '16:8 (16 Stunden Fasten, 8 Stunden Essen - Klassiker)' },
          { value: '14_10', label: '14:10 (14 Stunden Fasten, 10 Stunden Essen - Sanfter Einstieg)' },
          { value: '18_6', label: '18:6 (18 Stunden Fasten, 6 Stunden Essen - Fortgeschritten)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const startH = parseInt(inputs.firstMealHour, 10) || 12;
      const type = inputs.fastingRatio || '16_8';

      let eatingHours = 8;
      let fastingHours = 16;
      if (type === '14_10') { eatingHours = 10; fastingHours = 14; }
      if (type === '18_6') { eatingHours = 6; fastingHours = 18; }

      const lastMealH = (startH + eatingHours) % 24;

      const formatH = (hh: number) => \`\${hh < 10 ? '0' + hh : hh}:00 Uhr\`;

      return {
        primary: { id: 'eatingWindow', label: 'Tägliches Essensfenster', value: 0, formattedValue: \`\${formatH(startH)} bis \${formatH(lastMealH)}\`, highlight: true },
        secondary: [
          { id: 'fastingWindow', label: 'Tägliches Fastenfenster', value: 0, formattedValue: \`\${formatH(lastMealH)} bis \${formatH(startH)} (\${fastingHours} Std.)\` },
          { id: 'eatingHoursCount', label: 'Dauer der Nahrungsaufnahme', value: eatingHours, formattedValue: \`\${eatingHours} Stunden\` },
        ],
        summaryText: \`Bei Mahlzeitenbeginn um \${formatH(startH)} endet Ihr Essensfenster um \${formatH(lastMealH)}. Danach fasten Sie für \${fastingHours} Stunden bis zum nächsten Tag.\`,
      };
    },
    formula: 'Letzte Mahlzeit = Erste Mahlzeit + Essensfenster (z. B. 8 Stunden)',
    formulaExplanation: 'In der 16-stündigen Fastenphase sinkt der Insulinspiegel auf ein Minimum, wodurch der Körper von der Kohlenhydratspeicherung auf intensive Fettverbrennung und zelluläre Selbstreinigung (Autophagie) umschaltet.',
    workedExample: {
      title: 'Beispiel: Erste Mahlzeit um 12:00 Uhr (16:8 Methode)',
      inputValues: [{ label: 'Erste Mahlzeit', value: '12:00 Uhr' }, { label: 'Methode', value: '16:8' }],
      steps: ['Essensfenster: 12:00 Uhr bis 20:00 Uhr (8 Stunden)', 'Fastenphase: 20:00 Uhr bis 12:00 Uhr am Folgetag (16 Stunden)'],
      result: 'Essen von 12:00 bis 20:00 Uhr',
    },
    faqs: [
      { question: 'Darf man während der Fastenzeit Kaffee oder Tee trinken?', answer: 'Ja, ungesüßter schwarzer Kaffee, ungesüßter Tee und Wasser brechen das Fasten nicht und regen sogar die Autophagie an.' },
      { question: 'Muss man das Frühstück oder das Abendessen ausfallen lassen?', answer: 'Beides ist möglich. Die meisten Menschen lassen das Frühstück aus und essen von 12 bis 20 Uhr; andere frühstücken um 8 Uhr und beenden das Essen um 16 Uhr.' },
    ],
    relatedSlugs: ['kalorienbedarf-rechner', 'makronaehrstoff-verteilung-rechner', 'schlafbedarfs-rechner'],
  },

  {
    id: 'proteinbedarf-sportler-rechner',
    slug: 'proteinbedarf-sportler-rechner',
    name: 'Proteinbedarf Rechner (Eiweißmenge nach Sportart & Ziel)',
    shortName: 'Proteinbedarf Rechner',
    category: 'gesundheit-fitness',
    subcategory: 'Ernährung & Kalorien',
    metaTitle: 'Proteinbedarf Rechner – Täglicher Eiweißbedarf für Sportler & Muskelaufbau',
    metaDescription: 'Berechnen Sie Ihren optimalen täglichen Eiweißbedarf in Gramm nach Körpergewicht, Sportart (Ausdauer, Krafttraining, Diät) und Fitnessziel.',
    h1: 'Proteinbedarf Rechner – Täglicher Eiweißbedarf in Gramm',
    shortDescription: 'Kalkuliert die empfohlene Proteinmenge auf Basis des Körpergewichts und Trainingsziels.',
    searchKeywords: ['proteinbedarf rechner muskelaufbau', 'wie viel eiweiss pro kg koerpergewicht', 'eiweissbedarf sportler tabelle dge', 'proteinmenge diaet erhalt'],
    inputs: [
      { id: 'bodyWeightKg', label: 'Aktuelles Körpergewicht in kg', type: 'number', defaultValue: 78, min: 40, max: 200, step: 1, unit: 'kg' },
      {
        id: 'activityType',
        label: 'Sportart & Zielsetzung',
        type: 'select',
        defaultValue: 'hypertrophy',
        options: [
          { value: 'sedentary', label: 'Normal / Kein regelmäßiger Sport (DGE-Empfehlung: 0,8 g/kg)' },
          { value: 'endurance', label: 'Ausdauersportler / Laufen / Radfahren (1,2 - 1,4 g/kg)' },
          { value: 'hypertrophy', label: 'Kraftsport & Muskelaufbau (1,6 - 2,0 g/kg)' },
          { value: 'diet_cut', label: 'Diät / Fettabbau mit Muskelschutz (2,0 - 2,4 g/kg)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const w = parseFloat(inputs.bodyWeightKg) || 78;
      const type = inputs.activityType || 'hypertrophy';

      let factorMin = 1.6;
      let factorMax = 2.0;

      if (type === 'sedentary') { factorMin = 0.8; factorMax = 1.0; }
      if (type === 'endurance') { factorMin = 1.2; factorMax = 1.4; }
      if (type === 'hypertrophy') { factorMin = 1.6; factorMax = 2.0; }
      if (type === 'diet_cut') { factorMin = 2.0; factorMax = 2.4; }

      const minG = w * factorMin;
      const maxG = w * factorMax;
      const avgG = (minG + maxG) / 2;

      return {
        primary: { id: 'avgG', label: 'Empfohlene tägliche Eiweißmenge', value: avgG, formattedValue: \`ca. \${formatNumber(avgG, 0)} Gramm/Tag\`, highlight: true },
        secondary: [
          { id: 'range', label: 'Optimaler Bereich', value: 0, formattedValue: \`\${formatNumber(minG, 0)} bis \${formatNumber(maxG, 0)} g/Tag\` },
          { id: 'perMeal', label: 'Empfohlene Menge auf 4 Mahlzeiten verteilt', value: avgG / 4, formattedValue: \`ca. \${formatNumber(avgG / 4, 0)} g / Mahlzeit\` },
        ],
        summaryText: \`Für Ihr Körpergewicht von \${w} kg sollten Sie täglich \${formatNumber(minG, 0)} bis \${formatNumber(maxG, 0)} Gramm Protein zu sich nehmen (ca. \${formatNumber(avgG / 4, 0)} g pro Hauptmahlzeit).\`,
      };
    },
    formula: 'Proteinbedarf (g) = Körpergewicht (kg) × Eiweißfaktor (0,8 bis 2,4 g/kg)',
    formulaExplanation: 'Während die DGE für Nicht-Sportler 0,8 g/kg empfiehlt, benötigen aktive Sportler zur Regeneration und zum Muskelaufbau mindestens 1,6 g/kg.',
    workedExample: {
      title: 'Beispiel: 78 kg Kraftsportler für Muskelaufbau (1,6 - 2,0 g/kg)',
      inputValues: [{ label: 'Gewicht', value: '78 kg' }, { label: 'Ziel', value: 'Muskelaufbau' }],
      steps: ['Minimum: 78 × 1,6 = 124,8 g', 'Maximum: 78 × 2,0 = 156,0 g', 'Mittelwert ≈ 140 Gramm pro Tag'],
      result: 'ca. 140 Gramm Protein pro Tag',
    },
    faqs: [
      { question: 'Kann zu viel Protein den Nieren schaden?', answer: 'Bei gesunden Menschen mit gesunden Nieren sind Mengen bis zu 2,5 g/kg nachweislich unbedenklich, sofern ausreichend Wasser getrunken wird.' },
      { question: 'Welche Lebensmittel liefern besonders viel Eiweiß?', answer: 'Magerquark (12 g/100g), Hähnchenbrust (23 g/100g), Eier (7 g/Stück), Tofu (15 g/100g), Linsen (24 g/100g trocken) und Proteinpulver (ca. 75-80 g/100g).' },
    ],
    relatedSlugs: ['makronaehrstoff-verteilung-rechner', 'one-rep-max-rechner', 'kalorienbedarf-rechner'],
  },

  {
    id: 'blutdruck-klassifikation-rechner',
    slug: 'blutdruck-klassifikation-rechner',
    name: 'Blutdruck Rechner (Einstufung nach WHO & Hochdruckliga)',
    shortName: 'Blutdruck Einstufung',
    category: 'gesundheit-fitness',
    subcategory: 'Erholung & Vitalität',
    metaTitle: 'Blutdruck Rechner – Systolisch & Diastolisch nach WHO einstufen',
    metaDescription: 'Stufen Sie Ihre gemessenen Blutdruckwerte (systolisch und diastolisch in mmHg) nach den offiziellen Leitlinien der Deutschen Hochdruckliga und WHO ein.',
    h1: 'Blutdruck Rechner – Blutdruckwerte nach WHO klassifizieren',
    shortDescription: 'Ordnet Blutdruckmessungen in Optimal, Normal, Hoch-Normal oder Hypertonie (Stufe 1 bis 3) ein.',
    searchKeywords: ['blutdruck rechner who tabelle', 'blutdruckwerte einstufung tabelle mmhg', 'hypertonie stufe 1 2 3 werte', 'ab wann hoher blutdruck gefährlich'],
    inputs: [
      { id: 'systolicMmHg', label: 'Systolischer Blutdruck (oberer Wert in mmHg)', type: 'number', defaultValue: 125, min: 70, max: 260, step: 1, unit: 'mmHg' },
      { id: 'diastolicMmHg', label: 'Diastolischer Blutdruck (unterer Wert in mmHg)', type: 'number', defaultValue: 82, min: 40, max: 160, step: 1, unit: 'mmHg' },
    ],
    calculate: (inputs) => {
      const sys = parseInt(inputs.systolicMmHg, 10) || 125;
      const dia = parseInt(inputs.diastolicMmHg, 10) || 82;

      let category = 'Normaler Blutdruck';
      let advice = 'Alles im grünen Bereich. Regelmäßige Kontrollen genügen.';

      if (sys < 120 && dia < 80) {
        category = 'Optimaler Blutdruck';
        advice = 'Hervorragender Wert! Herz und Gefäße werden minimal belastet.';
      } else if (sys <= 129 && dia <= 84) {
        category = 'Normaler Blutdruck';
        advice = 'Gesunder Normalwert.';
      } else if (sys <= 139 || dia <= 89) {
        category = 'Hoch-normaler Blutdruck (Prähypertonie)';
        advice = 'Grenzwertig erhöht. Empfehlung: Salzkonsum reduzieren, Ausdauersport und Gewichtsreduktion.';
      } else if (sys <= 159 || dia <= 99) {
        category = 'Hypertonie Grad 1 (Leichter Bluthochdruck)';
        advice = 'Ärztliche Abklärung empfohlen. Lebensstiländerung und evtl. Medikation erforderlich.';
      } else if (sys <= 179 || dia <= 109) {
        category = 'Hypertonie Grad 2 (Mittelschwerer Bluthochdruck)';
        advice = 'Zwingend behandlungsbedürftig. Bitte zeitnah einen Arzt konsultieren.';
      } else {
        category = 'Hypertonie Grad 3 (Schwerer Bluthochdruck)';
        advice = 'Warnung: Sehr hohe Werte. Hohes Risiko für Gefäßschäden und Schlaganfall. Sofortige ärztliche Behandlung!';
      }

      return {
        primary: { id: 'category', label: 'Offizielle Blutdruck-Kategorie', value: 0, formattedValue: category, highlight: true },
        secondary: [
          { id: 'pulsePressure', label: 'Pulsdruck (Blutdruckamplitude)', value: sys - dia, formattedValue: \`\${sys - dia} mmHg\` },
          { id: 'advice', label: 'Empfehlung', value: 0, formattedValue: advice },
        ],
        summaryText: \`Ihre Werte von \${sys}/\${dia} mmHg fallen in die Kategorie: \${category} (\${advice}).\`,
      };
    },
    formula: 'Klassifikation nach Leitlinien der European Society of Hypertension (ESH) & DHL',
    formulaExplanation: 'Maßgeblich für die Einstufung ist immer der jeweils höhere Einzelwert (Systole oder Diastole).',
    workedExample: {
      title: 'Beispiel: Messung 135 / 85 mmHg',
      inputValues: [{ label: 'Systolisch', value: '135 mmHg' }, { label: 'Diastolisch', value: '85 mmHg' }],
      steps: ['Systolisch 135 liegt zwischen 130 und 139 mmHg', 'Einstufung = Hoch-normaler Blutdruck'],
      result: 'Hoch-normaler Blutdruck',
    },
    faqs: [
      { question: 'Wie misst man den Blutdruck richtig?', answer: 'Vor der Messung 5 Minuten ruhig sitzen, Manschette auf Herzhöhe anlegen, nicht sprechen und Füße flach nebeneinander auf den Boden stellen.' },
      { question: 'Was bedeutet der Pulsdruck?', answer: 'Die Differenz zwischen oberem und unterem Wert (Pulsdruck) sollte idealerweise zwischen 40 und 50 mmHg liegen. Werte über 60 mmHg deuten auf versteifte Arterien hin.' },
    ],
    relatedSlugs: ['maximalpuls-hfmax-rechner', 'bmi-rechner', 'waist-to-height-ratio-rechner'],
  },

  {
    id: 'puls-trainingszonen-rechner',
    slug: 'puls-trainingszonen-rechner',
    name: 'Puls-Trainingszonen Rechner (Fettverbrennung & Cardio)',
    shortName: 'Puls Trainingszonen',
    category: 'gesundheit-fitness',
    subcategory: 'Training & Sport',
    metaTitle: 'Puls-Trainingszonen Rechner – Fettverbrennung, aerob & anaerob',
    metaDescription: 'Berechnen Sie die 5 Herzfrequenz-Trainingsbereiche für Ihr Ausdauertraining: Von aktiver Regeneration über Fettverbrennung bis zum Schwellentraining.',
    h1: 'Puls-Trainingszonen Rechner – Herzfrequenzzonen für Ausdauertraining',
    shortDescription: 'Berechnet die 5 Herzfrequenzzonen für gezieltes Lauftraining und Radsport.',
    searchKeywords: ['puls trainingszonen rechner', 'herzfrequenz zonen rechner ausdauer', 'fettverbrennungszone puls berechnen', 'aerobe schwelle herzfrequenz berechnen'],
    inputs: [
      { id: 'maxHeartRate', label: 'Ihre maximale Herzfrequenz (HFmax) in bpm', type: 'number', defaultValue: 185, min: 140, max: 225, step: 1, unit: 'bpm' },
    ],
    calculate: (inputs) => {
      const hf = parseFloat(inputs.maxHeartRate) || 185;

      const z1Min = Math.round(hf * 0.50);
      const z1Max = Math.round(hf * 0.60);
      const z2Min = Math.round(hf * 0.60);
      const z2Max = Math.round(hf * 0.70);
      const z3Min = Math.round(hf * 0.70);
      const z3Max = Math.round(hf * 0.80);
      const z4Min = Math.round(hf * 0.80);
      const z4Max = Math.round(hf * 0.90);
      const z5Min = Math.round(hf * 0.90);
      const z5Max = hf;

      return {
        primary: { id: 'z2', label: 'Zone 2: Fettstoffwechsel / Grundlagenausdauer (60 - 70 %)', value: z2Max, formattedValue: \`\${z2Min} - \${z2Max} bpm\`, highlight: true },
        secondary: [
          { id: 'z1', label: 'Zone 1: Regeneration (50 - 60 %)', value: z1Max, formattedValue: \`\${z1Min} - \${z1Max} bpm\` },
          { id: 'z3', label: 'Zone 3: Aerobes Tempo / Cardio (70 - 80 %)', value: z3Max, formattedValue: \`\${z3Min} - \${z3Max} bpm\` },
          { id: 'z4', label: 'Zone 4: Anaerobe Schwelle (80 - 90 %)', value: z4Max, formattedValue: \`\${z4Min} - \${z4Max} bpm\` },
          { id: 'z5', label: 'Zone 5: Maximalleistung / VO2max (90 - 100 %)', value: z5Max, formattedValue: \`\${z5Min} - \${z5Max} bpm\` },
        ],
        summaryText: \`Bei einer HFmax von \${hf} bpm trainieren Sie in Zone 2 (Fettverbrennung & Grundlagenausdauer) im Bereich von \${z2Min} bis \${z2Max} Schlägen pro Minute.\`,
      };
    },
    formula: 'Zone = HFmax × Prozentsatz (50 % bis 100 %)',
    formulaExplanation: 'Das standardisierte 5-Zonen-Modell wird von Sportuhren und Ausdauertrainern weltweit genutzt, um Trainingsreize präzise zu steuern.',
    workedExample: {
      title: 'Beispiel: HFmax 185 bpm',
      inputValues: [{ label: 'HFmax', value: '185 bpm' }],
      steps: ['Zone 2 (60-70 %): 185 × 0,60 = 111 bpm bis 185 × 0,70 = 130 bpm', 'Zone 4 (80-90 %): 148 bis 167 bpm'],
      result: 'Zone 2: 111 - 130 bpm',
    },
    faqs: [
      { question: 'Verbrennt man in Zone 2 mehr Fett als bei Vollgas?', answer: 'In Zone 2 ist der prozentuale Anteil der Fettverbrennung an der Energiebereitstellung am höchsten. Bei hoher Intensität verbrennt man zwar absolut mehr Kalorien, jedoch fast ausschließlich aus Kohlenhydraten.' },
      { question: 'Wie viel des Trainings sollte in Zone 2 stattfinden?', answer: 'Nach dem bewährten 80/20-Prinzip sollten Ausdauersportler rund 80 % ihres Trainingsvolumens im lockeren Zone-2-Bereich absolvieren.' },
    ],
    relatedSlugs: ['maximalpuls-hfmax-rechner', 'laufpace-rechner', 'vo2max-cooper-test-rechner'],
  },

  {
    id: 'schwimmen-kalorienverbrauch-rechner',
    slug: 'schwimmen-kalorienverbrauch-rechner',
    name: 'Schwimmen Kalorienverbrauch Rechner (nach Schwimmstil & Bahnen)',
    shortName: 'Schwimmen Kalorien',
    category: 'gesundheit-fitness',
    subcategory: 'Training & Sport',
    metaTitle: 'Schwimmen Kalorienverbrauch Rechner – Brust, Kraul, Bahnen & Dauer',
    metaDescription: 'Berechnen Sie den Kalorienverbrauch beim Schwimmen: Kraulen, Brustschwimmen, Rückenschwimmen und Delphin nach Körpergewicht, Bahnen und Schwimmdauer.',
    h1: 'Schwimmen Kalorienverbrauch Rechner – Kalorien beim Schwimmen ermitteln',
    shortDescription: 'Kalkuliert den Kalorienverbrauch für verschiedene Schwimmstile.',
    searchKeywords: ['schwimmen kalorienverbrauch rechner', 'wie viele kalorien verbrennt kraulen brustschwimmen', 'bahnen schwimmen kalorien', 'schwimmen abnehmen kalorienbedarf'],
    inputs: [
      { id: 'bodyWeightKg', label: 'Körpergewicht in kg', type: 'number', defaultValue: 72, min: 40, max: 200, step: 1, unit: 'kg' },
      { id: 'durationMinutes', label: 'Schwimmdauer in Minuten', type: 'number', defaultValue: 45, min: 10, max: 180, step: 5, unit: 'Minuten' },
      {
        id: 'strokeStyle',
        label: 'Schwimmstil & Intensität',
        type: 'select',
        defaultValue: 'breaststroke_moderate',
        options: [
          { value: 'breaststroke_moderate', label: 'Brustschwimmen moderat (MET 6,0)' },
          { value: 'breaststroke_fast', label: 'Brustschwimmen zügig / sportlich (MET 8,0)' },
          { value: 'freestyle_moderate', label: 'Kraulschwimmen / Freistil moderat (MET 8,0)' },
          { value: 'freestyle_fast', label: 'Kraulschwimmen schnell (MET 10,0)' },
          { value: 'backstroke', label: 'Rückenschwimmen (MET 7,0)' },
          { value: 'butterfly', label: 'Schmetterling / Delphin (MET 13,0)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const w = parseFloat(inputs.bodyWeightKg) || 72;
      const mins = parseFloat(inputs.durationMinutes) || 45;
      const style = inputs.strokeStyle || 'breaststroke_moderate';

      const metTable: Record<string, number> = {
        breaststroke_moderate: 6.0,
        breaststroke_fast: 8.0,
        freestyle_moderate: 8.0,
        freestyle_fast: 10.0,
        backstroke: 7.0,
        butterfly: 13.0,
      };
      const met = metTable[style] || 6.0;
      // Formel: Kalorien = MET × Gewicht in kg × Dauer in Stunden
      const burnedKcal = met * w * (mins / 60);

      return {
        primary: { id: 'burnedKcal', label: 'Verbrannte Kalorien', value: burnedKcal, formattedValue: \`ca. \${formatNumber(burnedKcal, 0)} kcal\`, highlight: true },
        secondary: [
          { id: 'kcalPerHour', label: 'Kalorienverbrauch pro Stunde', value: met * w, formattedValue: \`\${formatNumber(met * w, 0)} kcal/Std.\` },
          { id: 'met', label: 'Intensitätsfaktor (MET-Wert)', value: met, formattedValue: formatNumber(met, 1) },
        ],
        summaryText: \`Bei \${mins} Minuten Schwimmen verbrennen Sie mit Ihrem Körpergewicht (\${w} kg) ca. \${formatNumber(burnedKcal, 0)} kcal.\`,
      };
    },
    formula: 'Kalorien (kcal) = MET × Körpergewicht (kg) × Zeit (Stunden)',
    formulaExplanation: 'Schwimmen beansprucht fast alle Muskelgruppen des Körpers gleichzeitig und ist dank des Wasserauftriebs extrem gelenkschonend.',
    workedExample: {
      title: 'Beispiel: 45 Minuten moderates Brustschwimmen bei 72 kg (MET 6,0)',
      inputValues: [{ label: 'Gewicht', value: '72 kg' }, { label: 'Dauer', value: '45 Min (0,75 h)' }],
      steps: ['Kalorien = 6,0 × 72 × 0,75 = 324 kcal'],
      result: '324 kcal verbrannt',
    },
    faqs: [
      { question: 'Verbrennt Kraulen mehr Kalorien als Brustschwimmen?', answer: 'Ja, Kraulen erfordert bei hohem Tempo mehr Vortrieb und Muskelarbeit und verbrennt pro Stunde ca. 15 % bis 25 % mehr Kalorien als gemütliches Brustschwimmen.' },
      { question: 'Warum hat man nach dem Schwimmen oft so großen Hunger?', answer: 'Das kühlere Wasser entzieht dem Körper Wärme, wodurch der Organismus verstärkt Appetitsignale aussendet, um den Wärmeverlust auszugleichen.' },
    ],
    relatedSlugs: ['laufpace-rechner', 'schritt-distanz-kalorien-rechner', 'kalorienbedarf-rechner'],
  },

  {
    id: 'radfahren-kalorien-watt-rechner',
    slug: 'radfahren-kalorien-watt-rechner',
    name: 'Radfahren Kalorien & Watt Rechner (Fahrrad & Ergometer)',
    shortName: 'Radfahren Kalorien',
    category: 'gesundheit-fitness',
    subcategory: 'Training & Sport',
    metaTitle: 'Radfahren Kalorien & Watt Rechner – Kalorienverbrauch Fahrrad & Heimtrainer',
    metaDescription: 'Berechnen Sie den Kalorienverbrauch beim Radfahren nach Geschwindigkeit, Steigung oder getretenen Watt auf dem Ergometer / Rennrad.',
    h1: 'Radfahren Kalorien Rechner – Kalorienverbrauch auf dem Fahrrad berechnen',
    shortDescription: 'Ermittelt den Energieverbrauch beim Radeln nach Tempo oder Watt-Leistung.',
    searchKeywords: ['radfahren kalorien rechner', 'watt in kalorien fahrrad umrechnen', 'kalorienverbrauch fahrrad 20 kmh', 'ergometer kalorienverbrauch berechnen'],
    inputs: [
      { id: 'bodyWeightKg', label: 'Körpergewicht in kg', type: 'number', defaultValue: 75, min: 40, max: 200, step: 1, unit: 'kg' },
      { id: 'durationMinutes', label: 'Fahrzeit in Minuten', type: 'number', defaultValue: 60, min: 10, max: 300, step: 5, unit: 'Minuten' },
      {
        id: 'cyclingIntensity',
        label: 'Fahrgeschwindigkeit / Gelände',
        type: 'select',
        defaultValue: 'moderate',
        options: [
          { value: 'leisure', label: 'Gemütlich / Stadtverkehr (ca. 15 km/h, MET 4,0)' },
          { value: 'moderate', label: 'Moderat / Alltagstempo (ca. 20 km/h, MET 6,8)' },
          { value: 'fast', label: 'Zügig / Sportlich (ca. 25 km/h, MET 10,0)' },
          { value: 'racing', label: 'Rennrad schnell (ca. 30 km/h, MET 12,0)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const w = parseFloat(inputs.bodyWeightKg) || 75;
      const mins = parseFloat(inputs.durationMinutes) || 60;
      const type = inputs.cyclingIntensity || 'moderate';

      const metTable: Record<string, number> = {
        leisure: 4.0,
        moderate: 6.8,
        fast: 10.0,
        racing: 12.0,
      };
      const met = metTable[type] || 6.8;
      const burnedKcal = met * w * (mins / 60);

      return {
        primary: { id: 'burnedKcal', label: 'Verbrannte Kalorien', value: burnedKcal, formattedValue: \`ca. \${formatNumber(burnedKcal, 0)} kcal\`, highlight: true },
        secondary: [
          { id: 'burnedPerHour', label: 'Kalorien pro Stunde', value: met * w, formattedValue: \`\${formatNumber(met * w, 0)} kcal/Std.\` },
          { id: 'fatBurnGramEquivalent', label: 'Entspricht reinem Körperfett', value: burnedKcal / 7.7, formattedValue: \`ca. \${formatNumber(burnedKcal / 7.7, 0)} g Fett\` },
        ],
        summaryText: \`Bei \${mins} Minuten Radfahren verbrennen Sie mit \${w} kg Körpergewicht ca. \${formatNumber(burnedKcal, 0)} kcal.\`,
      };
    },
    formula: 'Kalorien = MET × Körpergewicht (kg) × Stunden',
    formulaExplanation: 'Radfahren ist optimal für langes Grundlagenausdauertraining, da die Gelenke das eigene Körpergewicht nicht tragen müssen.',
    workedExample: {
      title: 'Beispiel: 60 Minuten moderates Radeln (20 km/h) bei 75 kg',
      inputValues: [{ label: 'Gewicht', value: '75 kg' }, { label: 'Tempo', value: '20 km/h (MET 6,8)' }],
      steps: ['Kalorien = 6,8 × 75 kg × 1,0 h = 510 kcal'],
      result: '510 kcal pro Stunde',
    },
    faqs: [
      { question: 'Wie rechnet man Watt auf dem Ergometer in Kalorien um?', answer: 'Da der menschliche Wirkungsgrad beim Radfahren bei ca. 24 % liegt, gilt die praktische Daumenregel: Durchschnittliche Watt × Stunden × 3,6 ≈ verbrannte kcal.' },
      { question: 'Ist Radfahren zum Abnehmen geeignet?', answer: 'Ja, Radfahren ermöglicht lange Trainingseinheiten ohne Gelenkschmerzen und verbrennt bei sportlichem Tempo 500 bis 800 kcal pro Stunde.' },
    ],
    relatedSlugs: ['laufpace-rechner', 'schritt-distanz-kalorien-rechner', 'schwimmen-kalorienverbrauch-rechner'],
  },
`);

fs.writeFileSync('scripts/generators/generate-gesundheit-familie-part1.js', parts.join('\n'), 'utf-8');
console.log('Written part 1 (gesundheit)');
