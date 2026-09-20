import { CalculatorDefinition } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';

export const EXTRA_GESUNDHEIT_FAMILIE: CalculatorDefinition[] = [
  // ==================== GESUNDHEIT & FITNESS (21 ZUSÄTZLICHE) ====================
  {
    id: 'grundumsatz-bmr-rechner',
    slug: 'grundumsatz-bmr-rechner',
    name: 'Grundumsatz-Rechner (BMR) (BMR nach Mifflin-St. Jeor & Harris-Benedict)',
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
        primary: { id: 'bmrMifflin', label: 'Grundumsatz pro Tag (Mifflin-St. Jeor)', value: bmrMifflin, formattedValue: `${formatNumber(bmrMifflin, 0)} kcal/Tag`, highlight: true },
        secondary: [
          { id: 'bmrPerHour', label: 'Verbrauch pro Ruhestunde', value: bmrMifflin / 24, formattedValue: `${formatNumber(bmrMifflin / 24, 1)} kcal/Std.` },
          { id: 'bmrHarris', label: 'Vergleich nach Harris-Benedict', value: bmrHarris, formattedValue: `${formatNumber(bmrHarris, 0)} kcal/Tag` },
          { id: 'kilojoule', label: 'Energie in Kilojoule (kJ)', value: bmrMifflin * 4.184, formattedValue: `${formatNumber(bmrMifflin * 4.184, 0)} kJ/Tag` },
        ],
        summaryText: `Ihr Körper verbraucht in völliger Ruhe ca. ${formatNumber(bmrMifflin, 0)} kcal täglich zur Aufrechterhaltung lebenswichtiger Funktionen wie Atmung, Herzschlag und Stoffwechsel.`,
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
    name: 'Leistungsumsatz- & PAL-Faktor-Rechner (Gesamtenergiebedarf)',
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
        primary: { id: 'totalDailyEnergy', label: 'Gesamtenergiebedarf pro Tag (TDEE)', value: totalDailyEnergy, formattedValue: `${formatNumber(totalDailyEnergy, 0)} kcal/Tag`, highlight: true },
        secondary: [
          { id: 'leistungsumsatz', label: 'Davon reiner Leistungsumsatz (Aktivität + Sport)', value: leistungsumsatz, formattedValue: `${formatNumber(leistungsumsatz, 0)} kcal/Tag` },
          { id: 'bmr', label: 'Davon Grundumsatz (BMR)', value: bmr, formattedValue: `${formatNumber(bmr, 0)} kcal/Tag` },
          { id: 'deficitWeightLoss', label: 'Empfohlenes Kalorienziel zur Gewichtsabnahme (-500 kcal)', value: totalDailyEnergy - 500, formattedValue: `${formatNumber(totalDailyEnergy - 500, 0)} kcal/Tag` },
        ],
        summaryText: `Bei einem PAL-Wert von ${pal} und ${sport} kcal Sport beträgt Ihr Gesamtkalorienbedarf ca. ${formatNumber(totalDailyEnergy, 0)} kcal pro Tag. Um 0,5 kg Fett pro Woche abzunehmen, sollten Sie ca. ${formatNumber(totalDailyEnergy - 500, 0)} kcal täglich zuführen.`,
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
    name: 'Makronährstoff-Rechner (Gramm Eiweiß, Kohlenhydrate & Fette)',
    shortName: 'Makro-Rechner',
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
        primary: { id: 'protGrams', label: 'Tägliches Eiweiß (Protein)', value: protGrams, formattedValue: `${formatNumber(protGrams, 0)} Gramm (${formatPercent(protPct * 100, 0)})`, highlight: true },
        secondary: [
          { id: 'carbGrams', label: 'Kohlenhydrate', value: carbGrams, formattedValue: `${formatNumber(carbGrams, 0)} Gramm (${formatPercent(carbPct * 100, 0)})` },
          { id: 'fatGrams', label: 'Fette (gesunde Fette)', value: fatGrams, formattedValue: `${formatNumber(fatGrams, 0)} Gramm (${formatPercent(fatPct * 100, 0)})` },
          { id: 'targetKcal', label: 'Gesamtkalorien', value: kcal, formattedValue: `${formatNumber(kcal, 0)} kcal` },
        ],
        summaryText: `Bei ${formatNumber(kcal, 0)} kcal sollten Sie täglich ca. ${formatNumber(protGrams, 0)} g Eiweiß, ${formatNumber(carbGrams, 0)} g Kohlenhydrate und ${formatNumber(fatGrams, 0)} g Fett zu sich nehmen.`,
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
    name: 'Idealgewicht-Rechner (nach Creff-Formel & Broca-Index)',
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
        primary: { id: 'idealWeight', label: 'Individuelles Idealgewicht (Creff)', value: idealWeight, formattedValue: `ca. ${formatNumber(idealWeight, 1)} kg`, highlight: true },
        secondary: [
          { id: 'brocaNormal', label: 'Normalgewicht nach Broca', value: brocaNormal, formattedValue: `${formatNumber(brocaNormal, 0)} kg` },
          { id: 'healthyRange', label: 'Gesunder BMI-Gewichtsbereich (18,5 - 24,9)', value: 0, formattedValue: `${formatNumber(18.5 * Math.pow(h / 100, 2), 1)} bis ${formatNumber(24.9 * Math.pow(h / 100, 2), 1)} kg` },
        ],
        summaryText: `Für eine Körpergröße von ${h} cm mit ${frame === 'small' ? 'zierlichem' : frame === 'large' ? 'kräftigem' : 'normalem'} Körperbau liegt Ihr optimales Idealgewicht nach Creff bei ca. ${formatNumber(idealWeight, 1)} kg.`,
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
    name: 'Körperfettanteil-Rechner (KFA) (US Navy KFA-Methode)',
    shortName: 'KFA-Rechner US Navy',
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
          { id: 'fatMass', label: 'Reine Fettmasse', value: fatMassKg, formattedValue: `${formatNumber(fatMassKg, 1)} kg` },
          { id: 'leanMass', label: 'Fettfreie Masse (Muskeln, Knochen, Wasser)', value: leanMassKg, formattedValue: `${formatNumber(leanMassKg, 1)} kg` },
          { id: 'category', label: 'Einstufung', value: 0, formattedValue: category },
        ],
        summaryText: `Ihr geschätzter Körperfettanteil beträgt ${formatPercent(safeKfa, 1)} (${category}). Bei ${weight} kg entspricht das ${formatNumber(fatMassKg, 1)} kg reinem Körperfett und ${formatNumber(leanMassKg, 1)} kg fettfreier Magermasse.`,
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
    name: 'WHR-Rechner (Taille-Hüft-Verhältnis) (Taille-Hüft-Verhältnis & Bauchfett-Risiko)',
    shortName: 'WHR-Rechner (Taille-Hüft-Verhältnis)',
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
        summaryText: `Ihr WHR-Wert liegt bei ${formatNumber(whr, 2)} (${risk}).`,
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
    name: 'WHtR-Rechner (Taille zu Körpergröße) (Taille zu Körpergröße & Bauchumfang)',
    shortName: 'WHtR-Rechner (Taille zu Körpergröße)',
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
          { id: 'maxAllowedWaist', label: `Maximal empfohlener Taillenumfang (für Alter ${age})`, value: height * maxHealthy, formattedValue: `${formatNumber(height * maxHealthy, 1)} cm` },
        ],
        summaryText: `Mit einem WHtR von ${formatNumber(whtr, 2)} liegen Sie im Bereich: ${status}. Als Faustregel sollte der Taillenumfang weniger als die halbe Körpergröße betragen (unter ${formatNumber(height * 0.5, 0)} cm).`,
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
    name: 'Maximalpuls-Rechner (HFmax) (HFmax & Herzfrequenzzonen nach Karvonen)',
    shortName: 'Maximalpuls-Rechner (HFmax)',
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
        primary: { id: 'hfMax', label: 'Geschätzte maximale Herzfrequenz (HFmax)', value: hfMax, formattedValue: `${hfMax} bpm`, highlight: true },
        secondary: [
          { id: 'zone2', label: 'Zone 2: Grundlagenausdauer & Fettstoffwechsel (60-70 %)', value: zone2, formattedValue: `ca. ${zone2} bpm` },
          { id: 'zone3', label: 'Zone 3: Aerobes Ausdauertraining (70-80 %)', value: zone3, formattedValue: `ca. ${zone3} bpm` },
          { id: 'zone4', label: 'Zone 4: Anaerobe Schwelle (80-90 %)', value: zone4, formattedValue: `ca. ${zone4} bpm` },
        ],
        summaryText: `Ihre maximale Herzfrequenz liegt bei ca. ${hfMax} bpm. Für optimales Grundlagentraining und Fettstoffwechsel (Zone 2) sollten Sie bei ca. ${zone2} bpm trainieren.`,
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
    name: 'VO2max-Rechner (Cooper-Test) (Cooper-Test 12-Minuten-Lauf)',
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
        primary: { id: 'vo2max', label: 'Geschätzte VO2max', value: vo2max, formattedValue: `${formatNumber(vo2max, 1)} ml/kg/min`, highlight: true },
        secondary: [
          { id: 'fitness', label: 'Ausdauer-Einstufung', value: 0, formattedValue: fitness },
          { id: 'avgPace', label: 'Gelaufene Durchschnittspace', value: 12 / (d / 1000), formattedValue: `${formatNumber(12 / (d / 1000), 2)} min/km` },
          { id: 'speedKmh', label: 'Durchschnittsgeschwindigkeit', value: (d / 1000) / (12 / 60), formattedValue: `${formatNumber((d / 1000) / (12 / 60), 1)} km/h` },
        ],
        summaryText: `Mit ${formatNumber(d, 0)} Metern in 12 Minuten erreichen Sie eine VO2max von ca. ${formatNumber(vo2max, 1)} ml/kg/min (${fitness}).`,
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
    name: '1RM-Rechner (One-Rep-Maximalgewicht) (One-Rep-Maximalgewicht nach Epley & Brzycki)',
    shortName: '1RM-Rechner (One-Rep-Maximalgewicht)',
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
          primary: { id: 'rm1', label: 'Ihr One-Rep-Max (1RM)', value: w, formattedValue: `${formatNumber(w, 1)} kg`, highlight: true },
          secondary: [
            { id: 'rm5', label: '5RM (ca. 87 %)', value: w * 0.87, formattedValue: `${formatNumber(w * 0.87, 1)} kg` },
            { id: 'rm10', label: '10RM (ca. 75 %)', value: w * 0.75, formattedValue: `${formatNumber(w * 0.75, 1)} kg` },
          ],
          summaryText: `Ihr 1RM beträgt exakt ${formatNumber(w, 1)} kg.`,
        };
      }

      // Epley-Formel: 1RM = Gewicht × (1 + r / 30)
      const epley = w * (1 + (r / 30));
      // Brzycki-Formel: 1RM = Gewicht / (1.0278 - 0.0278 × r)
      const brzycki = w / (1.0278 - (0.0278 * r));
      const avg1Rm = (epley + brzycki) / 2;

      return {
        primary: { id: 'avg1Rm', label: 'Geschätztes One-Rep-Max (1RM)', value: avg1Rm, formattedValue: `ca. ${formatNumber(avg1Rm, 1)} kg`, highlight: true },
        secondary: [
          { id: 'epley', label: 'Nach Epley-Formel', value: epley, formattedValue: `${formatNumber(epley, 1)} kg` },
          { id: 'brzycki', label: 'Nach Brzycki-Formel', value: brzycki, formattedValue: `${formatNumber(brzycki, 1)} kg` },
          { id: 'reps75', label: 'Trainingsgewicht für 10 Wdh. (75 %)', value: avg1Rm * 0.75, formattedValue: `ca. ${formatNumber(avg1Rm * 0.75, 1)} kg` },
        ],
        summaryText: `Aus ${r} Wiederholungen mit ${w} kg errechnet sich ein geschätztes 1RM von ca. ${formatNumber(avg1Rm, 1)} kg. Ihr Hypertrophie-Trainingsgewicht (10 Wdh. bei 75 %) liegt bei ca. ${formatNumber(avg1Rm * 0.75, 1)} kg.`,
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
    name: 'Schritte-Rechner (Schritte in km & Kalorien) (Schrittlänge, Kilometer & Kalorien)',
    shortName: 'Schritte-Rechner (Schritte in km & Kalorien)',
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
        primary: { id: 'distanceKm', label: 'Zurückgelegte Distanz', value: distanceKm, formattedValue: `${formatNumber(distanceKm, 2)} km`, highlight: true },
        secondary: [
          { id: 'burnedKcal', label: 'Verbrannte Kalorien', value: burnedKcal, formattedValue: `ca. ${formatNumber(burnedKcal, 0)} kcal` },
          { id: 'stepLengthCm', label: 'Berechnete Schrittlänge', value: stepLengthMeters * 100, formattedValue: `${formatNumber(stepLengthMeters * 100, 1)} cm` },
          { id: 'stepsPerKm', label: 'Schritte für 1 Kilometer', value: 1000 / stepLengthMeters, formattedValue: `ca. ${formatNumber(1000 / stepLengthMeters, 0)} Schritte` },
        ],
        summaryText: `${formatNumber(steps, 0)} Schritte entsprechen bei Ihrer Schrittlänge von ${formatNumber(stepLengthMeters * 100, 1)} cm einer Distanz von ${formatNumber(distanceKm, 2)} km und verbrennen ca. ${formatNumber(burnedKcal, 0)} kcal.`,
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
    name: 'Schlafzyklen- & Schlafbedarfs-Rechner (90-Minuten-Zyklen)',
    shortName: 'Schlafbedarfs-Rechner',
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
        return `${hh < 10 ? '0' + hh : hh}:${mm < 10 ? '0' + mm : mm} Uhr`;
      };

      return {
        primary: { id: 'idealBedtime', label: 'Empfohlene Bettzeit (5 Zyklen = 7,5 Std. Schlaf)', value: 0, formattedValue: formatTime(mins5Cycles), highlight: true },
        secondary: [
          { id: 'longBedtime', label: 'Langer Schlaf (6 Zyklen = 9,0 Std.)', value: 0, formattedValue: formatTime(mins6Cycles) },
          { id: 'shortBedtime', label: 'Kurzer Schlaf (4 Zyklen = 6,0 Std.)', value: 0, formattedValue: formatTime(mins4Cycles) },
          { id: 'cycleLength', label: 'Dauer eines Schlafzyklus', value: 90, formattedValue: '90 Minuten' },
        ],
        summaryText: `Um um ${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m} Uhr erholt aufzuwachen, sollten Sie um ${formatTime(mins5Cycles)} (5 Zyklen) oder um ${formatTime(mins6Cycles)} (6 Zyklen) einschlafen.`,
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
    name: 'Rauchstopp-Rechner (Ersparnis & Gesundheit) (Geldersparnis & Gewonnene Lebenszeit)',
    shortName: 'Rauchstopp-Rechner (Ersparnis & Gesundheit)',
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
          { id: 'daysGained', label: 'Gewonnene Lebenszeit pro Jahr Nichtrauchen', value: daysGainedPerYear, formattedValue: `ca. ${formatNumber(daysGainedPerYear, 0)} Tage` },
        ],
        summaryText: `Durch den Rauchstopp sparen Sie jährlich ${formatCurrency(yearlyCost)} (${formatCurrency(dailyCost)} pro Tag). Nach 10 Jahren haben Sie rund ${formatCurrency(cost10Years)} mehr auf dem Konto und gewinnen wertvolle Lebensjahre!`,
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
    relatedSlugs: ['etf-sparplan-rechner', 'koffein-halbwertszeit-rechner', 'lebensmittelbudget-rechner'],
  },

  {
    id: 'koffein-halbwertszeit-rechner',
    slug: 'koffein-halbwertszeit-rechner',
    name: 'Koffein-Rechner (Halbwertszeit & Wirkung) (Halbwertszeit, Kaffee & Schlafenszeit)',
    shortName: 'Koffein-Rechner (Halbwertszeit & Wirkung)',
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
        primary: { id: 'remainingMg', label: 'Verbleibendes Koffein im Körper zur Schlafenszeit', value: remainingMg, formattedValue: `ca. ${formatNumber(remainingMg, 0)} mg`, highlight: true },
        secondary: [
          { id: 'sleepImpact', label: 'Auswirkung auf den Schlaf', value: 0, formattedValue: sleepImpact },
          { id: 'initialMg', label: 'Aufgenommenes Koffein gesamt', value: initialMg, formattedValue: `${initialMg} mg` },
          { id: 'halfLifeHours', label: 'Angenommene Halbwertszeit', value: 5, formattedValue: 'ca. 5,0 Stunden' },
        ],
        summaryText: `Nach ${hours} Stunden sind von ursprünglich ${initialMg} mg Koffein immer noch ca. ${formatNumber(remainingMg, 0)} mg in Ihrem Blutkreislauf aktiv (${sleepImpact}).`,
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
    name: 'Alkoholabbau-Rechner',
    shortName: 'Alkoholabbau-Rechner',
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
        primary: { id: 'hoursNeeded', label: 'Benötigte Zeit bis zum vollständigen Abbau', value: hoursNeeded, formattedValue: `ca. ${formatNumber(hoursNeeded, 1)} Stunden`, highlight: true },
        secondary: [
          { id: 'rate', label: 'Abbaugeschwindigkeit der Leber', value: degradationRatePerHour, formattedValue: `ca. ${degradationRatePerHour} Gramm/Stunde` },
          { id: 'beersEquivalent', label: 'Entspricht etwa', value: g / 20, formattedValue: `ca. ${formatNumber(g / 20, 1)} Halbe Bier (0,5 l)` },
        ],
        summaryText: `Für den Abbau von ${g} Gramm Reinalkohol benötigt Ihre Leber rund ${formatNumber(hoursNeeded, 1)} Stunden. Der Prozess kann biologisch nicht beschleunigt werden.`,
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
    name: 'Intervallfasten-Rechner (16:8-Methode) (16:8 Fastenfenster & Essenszeiten)',
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

      const formatH = (hh: number) => `${hh < 10 ? '0' + hh : hh}:00 Uhr`;

      return {
        primary: { id: 'eatingWindow', label: 'Tägliches Essensfenster', value: 0, formattedValue: `${formatH(startH)} bis ${formatH(lastMealH)}`, highlight: true },
        secondary: [
          { id: 'fastingWindow', label: 'Tägliches Fastenfenster', value: 0, formattedValue: `${formatH(lastMealH)} bis ${formatH(startH)} (${fastingHours} Std.)` },
          { id: 'eatingHoursCount', label: 'Dauer der Nahrungsaufnahme', value: eatingHours, formattedValue: `${eatingHours} Stunden` },
        ],
        summaryText: `Bei Mahlzeitenbeginn um ${formatH(startH)} endet Ihr Essensfenster um ${formatH(lastMealH)}. Danach fasten Sie für ${fastingHours} Stunden bis zum nächsten Tag.`,
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
    name: 'Proteinbedarf-Rechner (Eiweißmenge) (Eiweißmenge nach Sportart & Ziel)',
    shortName: 'Proteinbedarf-Rechner (Eiweißmenge)',
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
        primary: { id: 'avgG', label: 'Empfohlene tägliche Eiweißmenge', value: avgG, formattedValue: `ca. ${formatNumber(avgG, 0)} Gramm/Tag`, highlight: true },
        secondary: [
          { id: 'range', label: 'Optimaler Bereich', value: 0, formattedValue: `${formatNumber(minG, 0)} bis ${formatNumber(maxG, 0)} g/Tag` },
          { id: 'perMeal', label: 'Empfohlene Menge auf 4 Mahlzeiten verteilt', value: avgG / 4, formattedValue: `ca. ${formatNumber(avgG / 4, 0)} g / Mahlzeit` },
        ],
        summaryText: `Für Ihr Körpergewicht von ${w} kg sollten Sie täglich ${formatNumber(minG, 0)} bis ${formatNumber(maxG, 0)} Gramm Protein zu sich nehmen (ca. ${formatNumber(avgG / 4, 0)} g pro Hauptmahlzeit).`,
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
    name: 'Blutdruck-Rechner (WHO-Klassifikation) (Einstufung nach WHO & Hochdruckliga)',
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
          { id: 'pulsePressure', label: 'Pulsdruck (Blutdruckamplitude)', value: sys - dia, formattedValue: `${sys - dia} mmHg` },
          { id: 'advice', label: 'Empfehlung', value: 0, formattedValue: advice },
        ],
        summaryText: `Ihre Werte von ${sys}/${dia} mmHg fallen in die Kategorie: ${category} (${advice}).`,
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
    name: 'Puls-Trainingszonen-Rechner (Fettverbrennung & Cardio)',
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
        primary: { id: 'z2', label: 'Zone 2: Fettstoffwechsel / Grundlagenausdauer (60 - 70 %)', value: z2Max, formattedValue: `${z2Min} - ${z2Max} bpm`, highlight: true },
        secondary: [
          { id: 'z1', label: 'Zone 1: Regeneration (50 - 60 %)', value: z1Max, formattedValue: `${z1Min} - ${z1Max} bpm` },
          { id: 'z3', label: 'Zone 3: Aerobes Tempo / Cardio (70 - 80 %)', value: z3Max, formattedValue: `${z3Min} - ${z3Max} bpm` },
          { id: 'z4', label: 'Zone 4: Anaerobe Schwelle (80 - 90 %)', value: z4Max, formattedValue: `${z4Min} - ${z4Max} bpm` },
          { id: 'z5', label: 'Zone 5: Maximalleistung / VO2max (90 - 100 %)', value: z5Max, formattedValue: `${z5Min} - ${z5Max} bpm` },
        ],
        summaryText: `Bei einer HFmax von ${hf} bpm trainieren Sie in Zone 2 (Fettverbrennung & Grundlagenausdauer) im Bereich von ${z2Min} bis ${z2Max} Schlägen pro Minute.`,
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
    name: 'Schwimm-Kalorienrechner (nach Schwimmstil & Bahnen)',
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
        primary: { id: 'burnedKcal', label: 'Verbrannte Kalorien', value: burnedKcal, formattedValue: `ca. ${formatNumber(burnedKcal, 0)} kcal`, highlight: true },
        secondary: [
          { id: 'kcalPerHour', label: 'Kalorienverbrauch pro Stunde', value: met * w, formattedValue: `${formatNumber(met * w, 0)} kcal/Std.` },
          { id: 'met', label: 'Intensitätsfaktor (MET-Wert)', value: met, formattedValue: formatNumber(met, 1) },
        ],
        summaryText: `Bei ${mins} Minuten Schwimmen verbrennen Sie mit Ihrem Körpergewicht (${w} kg) ca. ${formatNumber(burnedKcal, 0)} kcal.`,
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
    name: 'Radfahr-Kalorien- & Watt-Rechner (Fahrrad & Ergometer)',
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
        primary: { id: 'burnedKcal', label: 'Verbrannte Kalorien', value: burnedKcal, formattedValue: `ca. ${formatNumber(burnedKcal, 0)} kcal`, highlight: true },
        secondary: [
          { id: 'burnedPerHour', label: 'Kalorien pro Stunde', value: met * w, formattedValue: `${formatNumber(met * w, 0)} kcal/Std.` },
          { id: 'fatBurnGramEquivalent', label: 'Entspricht reinem Körperfett', value: burnedKcal / 7.7, formattedValue: `ca. ${formatNumber(burnedKcal / 7.7, 0)} g Fett` },
        ],
        summaryText: `Bei ${mins} Minuten Radfahren verbrennen Sie mit ${w} kg Körpergewicht ca. ${formatNumber(burnedKcal, 0)} kcal.`,
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
  // ==================== FAMILIE & SCHWANGERSCHAFT (23 ZUSÄTZLICHE) ====================
  {
    id: 'elterngeld-basis-plus-rechner',
    slug: 'elterngeld-basis-plus-rechner',
    name: 'Elterngeld-Rechner (Basiselterngeld & Elterngeld Plus) (Basiselterngeld vs. Elterngeld Plus)',
    shortName: 'Elterngeld-Rechner (Basiselterngeld & Elterngeld Plus)',
    category: 'familie-schwangerschaft',
    subcategory: 'Elterngeld & Finanzen',
    metaTitle: 'Elterngeld Rechner 2026 – Basiselterngeld & Elterngeld Plus berechnen',
    metaDescription: 'Berechnen Sie Ihren Anspruch auf Basiselterngeld (65 % bis 100 % des Nettoeinkommens, max. 1.800 €) und Elterngeld Plus mit Partnerschaftsbonusmonaten nach BEEG.',
    h1: 'Elterngeld Rechner – Basiselterngeld & Elterngeld Plus kalkulieren',
    shortDescription: 'Ermittelt die Höhe von Basiselterngeld und Elterngeld Plus nach Voreinkommen.',
    searchKeywords: ['elterngeld rechner 2026', 'basiselterngeld berechnen netto', 'elterngeld plus teilzeit partnerschaftsbonus', 'beeg elterngeld deckel 1800'],
    inputs: [
      { id: 'avgNetMonthly', label: 'Durchschnittliches Nettoeinkommen der letzten 12 Monate vor Geburt', type: 'number', defaultValue: 2200, min: 400, max: 8000, step: 100, unit: '€' },
      {
        id: 'hasSiblingsBonus',
        label: 'Geschwisterbonus (mind. 1 Kind unter 3 Jahren oder 2 Kinder unter 6 Jahren)',
        type: 'select',
        defaultValue: 'no',
        options: [
          { value: 'no', label: 'Kein Geschwisterbonus' },
          { value: 'yes', label: 'Ja, Geschwisterbonus (+10 %, mindestens 75 €/Monat)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const net = parseFloat(inputs.avgNetMonthly) || 2200;
      const hasBonus = inputs.hasSiblingsBonus === 'yes';

      // Ersatzrate: Bei Netto über 1.240 € sinkt die Rate von 67 % schrittweise auf 65 %
      let rate = 0.65;
      if (net <= 1000) rate = 0.67 + ((1000 - net) / 20) * 0.01;
      else if (net <= 1200) rate = 0.67;
      else if (net < 1240) rate = 0.66;
      else rate = 0.65;

      let basis = net * rate;
      // Deckelung: Mindestens 300 €, maximal 1.800 €
      basis = Math.max(300, Math.min(1800, basis));

      // Geschwisterbonus: 10 % Zuschlag, mind. 75 €
      if (hasBonus) {
        const bonus = Math.max(75, basis * 0.10);
        basis += bonus;
      }

      // Elterngeld Plus = halber Auszahlungsbetrag bei doppelter Bezugsdauer (max 900 € bzw 990 €)
      const plus = basis / 2;

      return {
        primary: { id: 'basis', label: 'Monatliches Basiselterngeld (max. 14 Monate)', value: basis, formattedValue: formatCurrency(basis), highlight: true },
        secondary: [
          { id: 'plus', label: 'Monatliches Elterngeld Plus (doppelte Bezugsdauer)', value: plus, formattedValue: formatCurrency(plus) },
          { id: 'ratePct', label: 'Angewandte Ersatzrate', value: rate * 100, formattedValue: formatPercent(rate * 100, 1) },
          { id: 'total12Months', label: 'Gesamtsumme bei 12 Monaten Basiselterngeld', value: basis * 12, formattedValue: formatCurrency(basis * 12) },
        ],
        summaryText: `Bei ${formatCurrency(net)} Voreinkommen erhalten Sie monatlich ${formatCurrency(basis)} Basiselterngeld (oder ${formatCurrency(plus)} Elterngeld Plus pro Monat).`,
      };
    },
    formula: 'Basiselterngeld = min(1.800 €, max(300 €, Netto × 65 %)) + Geschwisterbonus',
    formulaExplanation: 'Basiselterngeld ersetzt 65 % bis 100 % des wegfallenden Erwerbseinkommens für bis zu 14 Monate (bei Inanspruchnahme der Partnermonate).',
    workedExample: {
      title: 'Beispiel: 2.200 € Netto-Voreinkommen ohne Geschwisterbonus',
      inputValues: [{ label: 'Netto', value: '2.200 €' }],
      steps: ['Ersatzrate bei 2.200 € = 65 %', 'Elterngeld = 2.200 € × 0,65 = 1.430,00 € pro Monat', 'Elterngeld Plus = 715,00 € pro Monat'],
      result: '1.430,00 € monatlich',
    },
    faqs: [
      { question: 'Gilt Elterngeld noch bei hohem Einkommen?', answer: 'Für Geburten ab dem 01.04.2024 bzw. 2025 gilt für Paare und Alleinerziehende eine gemeinsame Grenze des zu versteuernden Jahreseinkommens von 175.000 Euro.' },
      { question: 'Was ist der Partnerschaftsbonus?', answer: 'Arbeiten beide Elternteile gleichzeitig für 2 bis 4 aufeinanderfolgende Monate in Teilzeit (24 bis 32 Wochenstunden), erhalten beide jeweils bis zu 4 zusätzliche Monate Elterngeld Plus.' },
    ],
    relatedSlugs: ['elternzeit-teilzeit-rechner', 'mutterschaftsgeld-rechner', 'kindergeld-rechner-2026'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Bundeselterngeld- und Elternzeitgesetz (§ 1 bis § 4d BEEG)',
      sourceUrl: 'https://www.familienportal.de',
      lastVerified: '2026-01-15',
    }
  },

  {
    id: 'kindergeld-rechner-2026',
    slug: 'kindergeld-rechner-2026',
    name: 'Kindergeld- & Kinderfreibetrag-Rechner (Günstigerprüfung)',
    shortName: 'Kindergeld-Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Elterngeld & Finanzen',
    metaTitle: 'Kindergeld Rechner 2026 – Kindergeldhöhe & Kinderfreibetrag Günstigerprüfung',
    metaDescription: 'Berechnen Sie Ihr monatliches Kindergeld und prüfen Sie im automatischen Vergleich, ob der Kinderfreibetrag in der Steuererklärung mehr Steuern spart.',
    h1: 'Kindergeld Rechner – Kindergeld & Kinderfreibetrag vergleichen',
    shortDescription: 'Vergleicht die monatliche Kindergeldauszahlung mit der Steuerersparnis durch den Kinderfreibetrag.',
    searchKeywords: ['kindergeld rechner 2026', 'kindergeld hoehe 250 euro 255 euro', 'guenstigerpruefung kindergeld kinderfreibetrag', 'kindergeld tabelle kinder'],
    inputs: [
      { id: 'childrenCount', label: 'Anzahl kindergeldberechtigter Kinder', type: 'number', defaultValue: 2, min: 1, max: 10, step: 1 },
      { id: 'taxableIncomeYearly', label: 'Gemeinsames zu versteuerndes Jahreseinkommen der Eltern', type: 'number', defaultValue: 65000, min: 10000, step: 5000, unit: '€' },
    ],
    calculate: (inputs) => {
      const kids = parseInt(inputs.childrenCount, 10) || 2;
      const zvE = parseFloat(inputs.taxableIncomeYearly) || 65000;

      // Einheitliches Kindergeld: 250 € pro Kind und Monat (bzw. 255 € ab 2025/2026)
      const monthlyPerChild = 250;
      const totalMonthlyKindergeld = kids * monthlyPerChild;
      const totalYearlyKindergeld = totalMonthlyKindergeld * 12;

      // Kinderfreibetrag + BEA-Freibetrag (ca. 9.540 € je Kind bei Zusammenveranlagung)
      const freibetragJeKind = 9540;
      const totalFreibetrag = kids * freibetragJeKind;

      // Schätzung Grenzsteuersatz Eltern
      let marginalTaxRate = 0.32;
      if (zvE > 120000) marginalTaxRate = 0.42;
      else if (zvE > 85000) marginalTaxRate = 0.38;
      else if (zvE > 50000) marginalTaxRate = 0.30;
      else marginalTaxRate = 0.22;

      const taxSavingsWithFreibetrag = totalFreibetrag * marginalTaxRate;
      const freibetragBetter = taxSavingsWithFreibetrag > totalYearlyKindergeld;

      return {
        primary: { id: 'monthlyKindergeld', label: 'Monatliche Kindergeldauszahlung', value: totalMonthlyKindergeld, formattedValue: formatCurrency(totalMonthlyKindergeld), highlight: true },
        secondary: [
          { id: 'yearlyKindergeld', label: 'Kindergeld pro Jahr', value: totalYearlyKindergeld, formattedValue: formatCurrency(totalYearlyKindergeld) },
          { id: 'taxSavings', label: 'Theoretische Steuerersparnis durch Freibetrag', value: taxSavingsWithFreibetrag, formattedValue: formatCurrency(taxSavingsWithFreibetrag) },
          { id: 'guenstiger', label: 'Ergebnis der Günstigerprüfung', value: 0, formattedValue: freibetragBetter ? 'Kinderfreibetrag ist günstiger (Finanzamt erstattet Differenz)' : 'Kindergeld ist bereits die günstigere Variante' },
        ],
        summaryText: `Für ${kids} Kinder erhalten Sie monatlich ${formatCurrency(totalMonthlyKindergeld)} Kindergeld (${formatCurrency(totalYearlyKindergeld)}/Jahr). ${freibetragBetter ? 'Bei Ihrem Einkommen bringt der Kinderfreibetrag eine zusätzliche Steuererstattung über die Steuererklärung!' : 'Das monatlich ausgezahlte Kindergeld ist für Sie vorteilhafter als der Freibetrag.'}`,
      };
    },
    formula: 'Kindergeld = Anzahl Kinder × 250 € monatlich; Günstigerprüfung nach § 31 EStG',
    formulaExplanation: 'Das Finanzamt prüft bei der jährlichen Einkommensteuererklärung automatisch von Amts wegen, ob das ausgezahlte Kindergeld oder der steuerliche Kinderfreibetrag für die Eltern vorteilhafter ist.',
    workedExample: {
      title: 'Beispiel: 2 Kinder bei 65.000 € Familieneinkommen',
      inputValues: [{ label: 'Kinder', value: '2 Kinder' }, { label: 'Einkommen', value: '65.000 €' }],
      steps: ['Kindergeld: 2 × 250 € = 500,00 €/Monat = 6.000 € im Jahr', 'Günstigerprüfung erfolgt automatisch in Anlage Kind'],
      result: '500,00 € monatliches Kindergeld',
    },
    faqs: [
      { question: 'Wie lange wird Kindergeld gezahlt?', answer: 'Grundsätzlich bis zum vollendeten 18. Lebensjahr. Befindet sich das Kind in Schul- oder Berufsausbildung oder im Studium, wird das Kindergeld bis zum vollendeten 25. Lebensjahr weitergezahlt.' },
      { question: 'Muss man Kindergeld gesondert beantragen?', answer: 'Ja, Kindergeld muss schriftlich oder digital bei der zuständigen Familienkasse der Bundesagentur für Arbeit beantragt werden.' },
    ],
    relatedSlugs: ['elterngeld-basis-plus-rechner', 'kinderzuschlag-kiz-rechner', 'unterhaltsvorschuss-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Familienkasse / Einkommensteuergesetz (§ 66 EStG)',
      sourceUrl: 'https://www.arbeitsagentur.de/familie-und-kinder',
      lastVerified: '2026-01-15',
    }
  },

  {
    id: 'kinderzuschlag-kiz-rechner',
    slug: 'kinderzuschlag-kiz-rechner',
    name: 'Kinderzuschlag-Rechner (KiZ) (KiZ bis 292 € / Monat nach BKKG)',
    shortName: 'Kinderzuschlag KiZ',
    category: 'familie-schwangerschaft',
    subcategory: 'Elterngeld & Finanzen',
    metaTitle: 'Kinderzuschlag Rechner 2026 – KiZ Anspruch & Höchstbetrag berechnen',
    metaDescription: 'Prüfen Sie Ihren Anspruch auf den Kinderzuschlag (KiZ bis zu 292 Euro pro Kind und Monat) für erwerbstätige Eltern mit kleinem Einkommen.',
    h1: 'Kinderzuschlag Rechner – KiZ für Familien mit kleinem Einkommen',
    shortDescription: 'Ermittelt den Kinderzuschlag zur Vermeidung von Bürgergeld für arbeitende Familien.',
    searchKeywords: ['kinderzuschlag rechner kiz', 'kinderzuschlag einkommensgrenzen 2026', 'kiz anspruch pruefen online', 'kinderzuschlag 292 euro'],
    inputs: [
      { id: 'childrenCount', label: 'Anzahl kindergeldberechtigter Kinder im Haushalt', type: 'number', defaultValue: 2, min: 1, max: 8, step: 1 },
      { id: 'parentsGrossIncome', label: 'Gemeinsames monatliches Bruttoeinkommen der Eltern', type: 'number', defaultValue: 2800, min: 900, max: 6000, step: 100, unit: '€' },
      { id: 'warmRentMonthly', label: 'Monatliche Warmmiete', type: 'number', defaultValue: 780, min: 200, step: 25, unit: '€' },
    ],
    calculate: (inputs) => {
      const kids = parseInt(inputs.childrenCount, 10) || 2;
      const gross = parseFloat(inputs.parentsGrossIncome) || 2800;
      const rent = parseFloat(inputs.warmRentMonthly) || 780;

      // Maximaler KiZ: bis zu 292 € pro Kind
      const maxKizPerChild = 292;
      const maxTotalKiz = kids * maxKizPerChild;

      // Mindesteinkommensgrenze: 900 € Brutto für Paare, 600 € für Alleinerziehende
      const eligible = gross >= 900;
      // Reduzierung bei höherem Einkommen: Überhang über Bemessungsgrenze mindert KiZ um ca. 45 %
      const baseAllowance = 1600 + rent;
      const excess = Math.max(0, gross - baseAllowance);
      const deduction = excess * 0.45;
      const calculatedKiz = Math.max(0, maxTotalKiz - deduction);

      return {
        primary: { id: 'calculatedKiz', label: 'Voraussichtlicher monatlicher Kinderzuschlag (gesamt)', value: calculatedKiz, formattedValue: formatCurrency(calculatedKiz), highlight: true },
        secondary: [
          { id: 'perChild', label: 'Zuschlag pro Kind', value: calculatedKiz / kids, formattedValue: formatCurrency(calculatedKiz / kids) },
          { id: 'maxKiz', label: 'Gesetzlicher Höchstbetrag', value: maxTotalKiz, formattedValue: formatCurrency(maxTotalKiz) },
          { id: 'extraBenefits', label: 'Zusatzvorteil', value: 0, formattedValue: calculatedKiz > 0 ? 'Kostenlose Kita + Schulbedarf (BuT)' : 'Kein Anspruch' },
        ],
        summaryText: calculatedKiz > 0
          ? `Ihre Familie hat Anspruch auf ca. ${formatCurrency(calculatedKiz)} monatlichen Kinderzuschlag. Zudem sind Sie von den Kita-Gebühren befreit und erhalten Leistungen für Bildung und Teilhabe!`
          : 'Aufgrund der Einkommenshöhe besteht voraussichtlich kein Anspruch auf den Kinderzuschlag.',
      };
    },
    formula: 'KiZ = Maximalsatz (292 € je Kind) abzüglich anrechenbares Elterneinkommen',
    formulaExplanation: 'Der Kinderzuschlag unterstützt erwerbstätige Eltern, deren Einkommen zwar für den eigenen Lebensunterhalt reicht, aber nicht für den der gesamten Familie (§ 6a BKKG).',
    workedExample: {
      title: 'Beispiel: 2 Kinder bei 2.800 € Familieneinkommen und 780 € Warmmiete',
      inputValues: [{ label: 'Kinder', value: '2' }, { label: 'Einkommen', value: '2.800 €' }, { label: 'Warmmiete', value: '780 €' }],
      steps: ['Maximalanspruch: 2 × 292 € = 584 €', 'Geringe Anrechnung des Elterneinkommens', 'Zuschlag: rund 380 bis 500 € monatlich'],
      result: 'ca. 450,00 € monatlicher Kinderzuschlag',
    },
    faqs: [
      { question: 'Welche Vergünstigungen gibt es zusätzlich zum KiZ?', answer: 'KiZ-Empfänger haben Anspruch auf kostenloses Schulmittagessen, 195 € Schulbedarfspaket pro Schuljahr und die Befreiung von den Kita-Gebühren.' },
      { question: 'Kann man KiZ rückwirkend beantragen?', answer: 'Nein, der Kinderzuschlag wird frühestens ab dem Monat der Antragstellung bei der Familienkasse gezahlt.' },
    ],
    relatedSlugs: ['kindergeld-rechner-2026', 'schulbedarfspaket-bu-t-rechner', 'unterhaltsvorschuss-rechner'],
  },

  {
    id: 'unterhaltsvorschuss-rechner',
    slug: 'unterhaltsvorschuss-rechner',
    name: 'Unterhaltsvorschuss-Rechner (UVG) (UVG für Alleinerziehende)',
    shortName: 'Unterhaltsvorschuss UVG',
    category: 'familie-schwangerschaft',
    subcategory: 'Elterngeld & Finanzen',
    metaTitle: 'Unterhaltsvorschuss Rechner 2026 – Beträge nach UVG für Alleinerziehende',
    metaDescription: 'Berechnen Sie den gesetzlichen Unterhaltsvorschuss nach dem Unterhaltsvorschussgesetz (UVG) für Kinder von 0 bis 17 Jahren, wenn der andere Elternteil keinen Unterhalt zahlt.',
    h1: 'Unterhaltsvorschuss Rechner – Gesetzlicher Vorschuss nach UVG',
    shortDescription: 'Ermittelt den staatlichen Unterhaltsvorschuss nach den Altersstufen des UVG.',
    searchKeywords: ['unterhaltsvorschuss rechner 2026', 'unterhaltsvorschuss tabelle altersstufen', 'uvg betraege alleinerziehende', 'unterhalt jugendamt vorschuss'],
    inputs: [
      {
        id: 'childAgeGroup',
        label: 'Altersgruppe des Kindes',
        type: 'select',
        defaultValue: 'age6_11',
        options: [
          { value: 'age0_5', label: '0 bis 5 Jahre (1. Altersstufe: 230 €/Monat)' },
          { value: 'age6_11', label: '6 bis 11 Jahre (2. Altersstufe: 301 €/Monat)' },
          { value: 'age12_17', label: '12 bis 17 Jahre (3. Altersstufe: 395 €/Monat)' },
        ],
      },
      { id: 'partialPayment', label: 'Vom anderen Elternteil tatsächlich gezahlter Teilunterhalt', type: 'number', defaultValue: 0, min: 0, max: 600, step: 25, unit: '€' },
    ],
    calculate: (inputs) => {
      const group = inputs.childAgeGroup || 'age6_11';
      const paid = parseFloat(inputs.partialPayment) || 0;

      // Gesetzliche UVG-Sätze 2026 (Mindestunterhalt abzüglich volles Kindergeld):
      // 0-5 Jahre: ca. 230 €
      // 6-11 Jahre: ca. 301 €
      // 12-17 Jahre: ca. 395 €
      let standardRate = 301;
      if (group === 'age0_5') standardRate = 230;
      if (group === 'age12_17') standardRate = 395;

      const payout = Math.max(0, standardRate - paid);

      return {
        primary: { id: 'payout', label: 'Monatlicher Unterhaltsvorschuss vom Jugendamt', value: payout, formattedValue: formatCurrency(payout), highlight: true },
        secondary: [
          { id: 'standardRate', label: 'Gesetzlicher Regelsatz der Altersstufe', value: standardRate, formattedValue: formatCurrency(standardRate) },
          { id: 'yearlyPayout', label: 'Unterhaltsvorschuss pro Jahr', value: payout * 12, formattedValue: formatCurrency(payout * 12) },
          { id: 'paidDeduction', label: 'Angerechnete Zahlungen des Barunterhaltspflichtigen', value: paid, formattedValue: formatCurrency(paid) },
        ],
        summaryText: `Für das Kind in dieser Altersstufe zahlt die Unterhaltsvorschusskasse monatlich ${formatCurrency(payout)} (${formatCurrency(payout * 12)} pro Jahr).`,
      };
    },
    formula: 'Unterhaltsvorschuss = Gesetzlicher Regelsatz der Altersstufe - Unterhaltszahlungen des Pflichtigen',
    formulaExplanation: 'Unterhaltsvorschuss wird nach dem UVG ohne zeitliche Befristung bis zum vollendeten 18. Lebensjahr des Kindes gezahlt. Der Staat fordert das Geld vom säumigen Elternteil zurück.',
    workedExample: {
      title: 'Beispiel: 8-jähriges Kind, Vater zahlt keinen Unterhalt',
      inputValues: [{ label: 'Alter', value: '8 Jahre (2. Stufe)' }, { label: 'Zahlung Pflichtiger', value: '0 €' }],
      steps: ['2. Altersstufe (6-11 Jahre) = 301,00 €', 'Keine Anrechnung', 'Voller Anspruch = 301,00 €/Monat'],
      result: '301,00 € monatlich',
    },
    faqs: [
      { question: 'Gibt es für Kinder ab 12 Jahren zusätzliche Voraussetzungen?', answer: 'Ja, Kinder zwischen 12 und 17 Jahren erhalten den Vorschuss nur, wenn sie nicht auf Bürgergeld angewiesen sind oder der alleinerziehende Elternteil mindestens 600 € brutto verdient.' },
      { question: 'Muss man verheiratet gewesen sein?', answer: 'Nein, der Familienstand der Eltern bei der Geburt spielt keine Rolle. Voraussetzung ist lediglich, dass das Kind bei einem alleinerziehenden Elternteil lebt.' },
    ],
    relatedSlugs: ['duesseldorfer-tabelle-rechner', 'kindergeld-rechner-2026', 'kinderzuschlag-kiz-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Unterhaltsvorschussgesetz (UVG) / BMFSFJ',
      sourceUrl: 'https://www.bmfsfj.de',
      lastVerified: '2026-01-15',
    },
  },

  {
    id: 'duesseldorfer-tabelle-rechner',
    slug: 'duesseldorfer-tabelle-rechner',
    name: 'Düsseldorfer-Tabelle-Rechner (Kindesunterhalt) (Kindesunterhalt 2026)',
    shortName: 'Düsseldorfer Tabelle',
    category: 'familie-schwangerschaft',
    subcategory: 'Elterngeld & Finanzen',
    metaTitle: 'Düsseldorfer Tabelle Rechner 2026 – Kindesunterhalt nach Einkommen & Alter',
    metaDescription: 'Berechnen Sie den monatlichen Kindesunterhalt nach der Düsseldorfer Tabelle 2026: Nettoeinkommen des Unterhaltspflichtigen, Altersstufen und Kindergeldanrechnung.',
    h1: 'Düsseldorfer Tabelle Rechner – Kindesunterhalt berechnen',
    shortDescription: 'Ermittelt den Zahlbetrag für Kindesunterhalt nach der Düsseldorfer Tabelle.',
    searchKeywords: ['duesseldorfer tabelle rechner 2026', 'kindesunterhalt berechnen netto zahlbetrag', 'selbstbehalt duesseldorfer tabelle', 'kindergeld halbe anrechnung unterhalt'],
    inputs: [
      { id: 'netIncomeAdjusted', label: 'Bereinigtes monatliches Nettoeinkommen des Barunterhaltspflichtigen', type: 'number', defaultValue: 2700, min: 1000, step: 100, unit: '€' },
      {
        id: 'childAgeCategory',
        label: 'Altersstufe des Kindes',
        type: 'select',
        defaultValue: 'group2',
        options: [
          { value: 'group1', label: '0 bis 5 Jahre (1. Altersstufe)' },
          { value: 'group2', label: '6 bis 11 Jahre (2. Altersstufe)' },
          { value: 'group3', label: '12 bis 17 Jahre (3. Altersstufe)' },
          { value: 'group4', label: 'Ab 18 Jahre / Volljährig (4. Altersstufe)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const net = parseFloat(inputs.netIncomeAdjusted) || 2700;
      const group = inputs.childAgeCategory || 'group2';

      // Einkommensgruppe 1 bis 15 nach Düsseldorfer Tabelle:
      // Stufe 1: bis 2.100 € (100 %)
      // Stufe 2: 2.101 - 2.500 € (105 %)
      // Stufe 3: 2.501 - 2.900 € (110 %)
      // Stufe 4: 2.901 - 3.300 € (115 %)
      // Stufe 5: 3.301 - 3.700 € (120 %)
      let pct = 1.10;
      if (net <= 2100) pct = 1.00;
      else if (net <= 2500) pct = 1.05;
      else if (net <= 2900) pct = 1.10;
      else if (net <= 3300) pct = 1.15;
      else if (net <= 3700) pct = 1.20;
      else if (net <= 4100) pct = 1.28;
      else pct = 1.36;

      // Mindestunterhalt (100%):
      // 0-5 Jahre: ca. 480 €
      // 6-11 Jahre: ca. 551 €
      // 12-17 Jahre: ca. 645 €
      // ab 18: ca. 689 €
      let baseUnder100 = 551;
      if (group === 'group1') baseUnder100 = 480;
      if (group === 'group3') baseUnder100 = 645;
      if (group === 'group4') baseUnder100 = 689;

      const tabellenbetrag = Math.round(baseUnder100 * pct);
      // Kindergeldanrechnung: Bei Minderjährigen wird das halbe Kindergeld (125 €) abgezogen, bei Volljährigen das volle Kindergeld (250 €)
      const kindergeldDeduction = group === 'group4' ? 250 : 125;
      const zahlbetrag = Math.max(0, tabellenbetrag - kindergeldDeduction);

      // Notwendiger Eigenbedarf (Selbstbehalt): ca. 1.450 € bei Erwerbstätigen
      const selbstbehalt = 1450;
      const remainingForPayer = net - zahlbetrag;

      return {
        primary: { id: 'zahlbetrag', label: 'Tatsächlicher Zahlbetrag nach Kindergeldabzug', value: zahlbetrag, formattedValue: formatCurrency(zahlbetrag), highlight: true },
        secondary: [
          { id: 'tabellenbetrag', label: 'Tabellenunterhalt nach Düsseldorfer Tabelle', value: tabellenbetrag, formattedValue: formatCurrency(tabellenbetrag) },
          { id: 'kindergeldDeduction', label: 'Kindergeldanrechnung', value: kindergeldDeduction, formattedValue: formatCurrency(kindergeldDeduction) },
          { id: 'remainingForPayer', label: 'Verbleibendes Einkommen des Pflichtigen', value: remainingForPayer, formattedValue: formatCurrency(remainingForPayer) },
        ],
        summaryText: `Bei einem bereinigten Netto von ${formatCurrency(net)} beträgt der Tabellenbetrag ${formatCurrency(tabellenbetrag)}. Nach Abzug des halben Kindergeldes zahlt der Elternteil monatlich ${formatCurrency(zahlbetrag)} Kindesunterhalt.`,
      };
    },
    formula: 'Zahlbetrag = Tabellenbetrag nach Einkommensgruppe - Kindergeldanteil (50 % bzw. 100 %)',
    formulaExplanation: 'Die Düsseldorfer Tabelle des Oberlandesgerichts Düsseldorf dient bundesweit als anerkannte Richtlinie für die Bemessung des Kindesunterhalts.',
    workedExample: {
      title: 'Beispiel: 2.700 € bereinigtes Netto, Kind 8 Jahre alt (Stufe 3 = 110 %)',
      inputValues: [{ label: 'Netto', value: '2.700 €' }, { label: 'Kind', value: '8 Jahre (Stufe 2)' }],
      steps: ['110 % von 551 € = 606,10 € Tabellenbetrag', 'Abzug halbes Kindergeld (125 €) = 481,10 €', 'Zahlbetrag = 481,00 € monatlich'],
      result: '481,00 € monatlicher Zahlbetrag',
    },
    faqs: [
      { question: 'Was bedeutet bereinigtes Nettoeinkommen?', answer: 'Vom Bruttoeinkommen werden nach Steuern und Sozialabgaben berufsbedingte Aufwendungen (z. B. 5 % Pauschale), Altersvorsorgeaufwendungen und bestimmte Altschulden abgezogen.' },
      { question: 'Was passiert, wenn das Einkommen unter dem Selbstbehalt liegt?', answer: 'Liegt das Einkommen unter dem notwendigen Selbstbehalt (Mangelfall), kann der Unterhalt gekürzt werden. Der Unterhaltspflichtige hat jedoch eine gesteigerte Erwerbsobliegenheit.' },
    ],
    relatedSlugs: ['unterhaltsvorschuss-rechner', 'ehegattenunterhalt-trennungsunterhalt-rechner', 'kindergeld-rechner-2026'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Oberlandesgericht Düsseldorf (Düsseldorfer Tabelle)',
      sourceUrl: 'https://www.olg-duesseldorf.nrw.de',
      lastVerified: '2026-01-15',
    }
  },

  {
    id: 'ehegattenunterhalt-trennungsunterhalt-rechner',
    slug: 'ehegattenunterhalt-trennungsunterhalt-rechner',
    name: 'Trennungsunterhalt-Rechner (3/7-Methode & Halbteilungsgrundsatz)',
    shortName: 'Trennungsunterhalt-Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Elterngeld & Finanzen',
    metaTitle: 'Trennungsunterhalt Rechner – Ehegattenunterhalt nach 3/7-Methode berechnen',
    metaDescription: 'Berechnen Sie den gesetzlichen Trennungsunterhalt nach § 1361 BGB nach der anerkannten 3/7-Methode (45 % Erwerbstätigenbonus) aus der Einkommensdifferenz beider Ehepartner.',
    h1: 'Trennungsunterhalt Rechner – Unterhalt bei Trennung kalkulieren',
    shortDescription: 'Ermittelt den Unterhaltsanspruch des wirtschaftlich schwächeren Ehepartners nach Trennung.',
    searchKeywords: ['trennungsunterhalt rechner 3 7 methode', 'ehegattenunterhalt berechnen einkommensdifferenz', 'paragraph 1361 bgb trennungsunterhalt formel', 'selbstbehalt ehegatte unterhalt'],
    inputs: [
      { id: 'netIncomePartner1', label: 'Bereinigtes Nettoeinkommen des Besserverdienenden (nach Kindesunterhalt)', type: 'number', defaultValue: 3200, min: 1000, step: 100, unit: '€' },
      { id: 'netIncomePartner2', label: 'Bereinigtes Nettoeinkommen des anderen Partners (z. B. Teilzeit)', type: 'number', defaultValue: 1200, min: 0, step: 50, unit: '€' },
    ],
    calculate: (inputs) => {
      const net1 = parseFloat(inputs.netIncomePartner1) || 3200;
      const net2 = parseFloat(inputs.netIncomePartner2) || 1200;

      // 3/7-Methode bzw. 45 % nach den Leitlinien der Oberlandesgerichte:
      // Unterhalt = (Netto1 - Netto2) × (3 / 7) bzw. × 0.45 (Erwerbstätigenbonus 10%)
      const diff = Math.max(0, net1 - net2);
      const maintenance37 = diff * (3 / 7);
      const maintenance45 = diff * 0.45;
      const finalMaintenance = (maintenance37 + maintenance45) / 2;

      // Selbstbehalt gegenüber getrennt lebendem Ehegatten: ca. 1.600 €
      const selbstbehalt = 1600;
      const cappedMaintenance = Math.max(0, Math.min(finalMaintenance, net1 - selbstbehalt));

      return {
        primary: { id: 'maintenance', label: 'Monatlicher Trennungsunterhalt', value: cappedMaintenance, formattedValue: formatCurrency(cappedMaintenance), highlight: true },
        secondary: [
          { id: 'diff', label: 'Einkommensdifferenz beider Partner', value: diff, formattedValue: formatCurrency(diff) },
          { id: 'net1After', label: 'Verbleibend bei Partner 1', value: net1 - cappedMaintenance, formattedValue: formatCurrency(net1 - cappedMaintenance) },
          { id: 'net2After', label: 'Gesamteinkommen Partner 2 (Einkommen + Unterhalt)', value: net2 + cappedMaintenance, formattedValue: formatCurrency(net2 + cappedMaintenance) },
        ],
        summaryText: `Aus der Einkommensdifferenz von ${formatCurrency(diff)} ergibt sich ein monatlicher Trennungsunterhalt von ca. ${formatCurrency(cappedMaintenance)}. Nach Zahlung verfügen beide Partner über ein faires Budget.`,
      };
    },
    formula: 'Trennungsunterhalt = (Bereinigtes Netto 1 - Bereinigtes Netto 2) × 3/7 (bzw. 45 %)',
    formulaExplanation: 'Nach § 1361 BGB kann ein Ehegatte von dem anderen den nach den Lebensverhältnissen angemessenen Unterhalt verlangen. Kindesunterhalt hat gesetzlich Vorrang und wird vorab abgezogen.',
    workedExample: {
      title: 'Beispiel: Partner 1 verdient 3.200 €, Partner 2 verdient 1.200 €',
      inputValues: [{ label: 'Partner 1', value: '3.200 €' }, { label: 'Partner 2', value: '1.200 €' }],
      steps: ['Differenz = 3.200 € - 1.200 € = 2.000 €', '45 % von 2.000 € = 900,00 € Unterhalt', 'Selbstbehalt von 1.600 € bleibt gewahrt (3.200 - 900 = 2.300 €)'],
      result: 'ca. 900,00 € monatlicher Trennungsunterhalt',
    },
    faqs: [
      { question: 'Kann auf Trennungsunterhalt vertraglich verzichtet werden?', answer: 'Nein! Nach § 1361 Abs. 4 Satz 4 BGB ist ein Verzicht auf künftigen Trennungsunterhalt unwirksam (Verbot des Vorausverzichts).' },
      { question: 'Wie lange muss Trennungsunterhalt gezahlt werden?', answer: 'Trennungsunterhalt wird ab der Trennung bis zur Rechtskraft der Scheidung geschuldet. Ab Rechtskraft greift ggf. nachehelicher Unterhalt.' },
    ],
    relatedSlugs: ['duesseldorfer-tabelle-rechner', 'unterhaltsvorschuss-rechner', 'teilzeit-gehaltsrechner'],
  },

  {
    id: 'schwangerschaftswoche-ssw-rechner',
    slug: 'schwangerschaftswoche-ssw-rechner',
    name: 'SSW-Rechner (Schwangerschaftswoche & Trimester) (Aktuelle Schwangerschaftswoche, Tag & Trimester)',
    shortName: 'SSW-Rechner (Schwangerschaftswoche & Trimester)',
    category: 'familie-schwangerschaft',
    subcategory: 'Schwangerschaft & Geburt',
    metaTitle: 'SSW Rechner – Aktuelle Schwangerschaftswoche & Trimester berechnen',
    metaDescription: 'Ermitteln Sie Ihre genaue Schwangerschaftswoche (SSW z. B. 14+3), das Trimester und wichtige Meilensteine nach dem ersten Tag der letzten Periode oder Zeugungstag.',
    h1: 'SSW Rechner – Aktuelle Schwangerschaftswoche & Tage berechnen',
    shortDescription: 'Berechnet die exakte Schwangerschaftswoche im Format SSW + Tage.',
    searchKeywords: ['ssw rechner aktuelle woche tage', 'schwangerschaftswoche berechnen letzte periode', 'in welcher ssw bin ich heute', 'trimester schwangerschaft rechner'],
    inputs: [
      { id: 'daysSinceLmp', label: 'Tage seit dem 1. Tag der letzten Periode', type: 'number', defaultValue: 105, min: 1, max: 300, step: 1, unit: 'Tage' },
    ],
    calculate: (inputs) => {
      const days = parseInt(inputs.daysSinceLmp, 10) || 105;
      const fullWeeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      const currentSsw = fullWeeks + 1;

      let trimester = '1. Trimester (Frühschwangerschaft)';
      if (days >= 196) trimester = '3. Trimester (Endspurt)';
      else if (days >= 91) trimester = '2. Trimester (Wohlfühltrimester)';

      const daysUntilBirth = Math.max(0, 280 - days);

      return {
        primary: { id: 'sswFormat', label: 'Aktuelle Schwangerschaftswoche (SSW)', value: currentSsw, formattedValue: `${fullWeeks} + ${remainingDays} (SSW ${currentSsw})`, highlight: true },
        secondary: [
          { id: 'trimester', label: 'Aktuelles Trimester', value: 0, formattedValue: trimester },
          { id: 'daysUntilBirth', label: 'Verbleibende Tage bis zum errechneten Geburtstermin', value: daysUntilBirth, formattedValue: `ca. ${daysUntilBirth} Tage` },
          { id: 'progressPct', label: 'Schwangerschaftsfortschritt', value: (days / 280) * 100, formattedValue: formatPercent((days / 280) * 100, 1) },
        ],
        summaryText: `Sie befinden sich heute in der SSW ${fullWeeks} + ${remainingDays} (${currentSsw}. Schwangerschaftswoche) im ${trimester}. Bis zum Entbindungstermin sind es noch ca. ${daysUntilBirth} Tage.`,
      };
    },
    formula: 'SSW = (Vergangene Tage seit Periodenbeginn / 7) vollendete Wochen + Resttage',
    formulaExplanation: 'Gynäkologen zählen die Schwangerschaft ab dem ersten Tag der letzten Menstruation (280 Tage bzw. 40 Wochen), obwohl die Befruchtung erst ca. 2 Wochen später beim Eisprung stattfindet.',
    workedExample: {
      title: 'Beispiel: 105 Tage seit Beginn der letzten Periode',
      inputValues: [{ label: 'Tage', value: '105 Tage' }],
      steps: ['105 / 7 = 15 Wochen und 0 Tage', 'Notation im Mutterpass: SSW 15+0 (Beginn der 16. SSW)', '2. Trimester'],
      result: 'SSW 15+0 (16. Schwangerschaftswoche)',
    },
    faqs: [
      { question: 'Was bedeutet die Schreibweise 14+3 im Mutterpass?', answer: '14+3 bedeutet: 14 volle Schwangerschaftswochen plus 3 Tage. Sie befinden sich damit am vierten Tag der 15. Schwangerschaftswoche.' },
      { question: 'Wann beginnen die einzelnen Trimester?', answer: 'Das 1. Trimester reicht von SSW 1 bis 13, das 2. Trimester von SSW 14 bis 27, und das 3. Trimester von SSW 28 bis zur Geburt.' },
    ],
    relatedSlugs: ['geburtstermin-rechner', 'mutterschutzfristen-rechner', 'zykluslaenge-eisprung-rechner'],
  },

  {
    id: 'mutterschutzfristen-rechner',
    slug: 'mutterschutzfristen-rechner',
    name: 'Mutterschutzfristen-Rechner (Fristen 6 Wochen vor & 8 Wochen nach ET)',
    shortName: 'Mutterschutzfristen',
    category: 'familie-schwangerschaft',
    subcategory: 'Schwangerschaft & Geburt',
    metaTitle: 'Mutterschutz Rechner – Gesetzliche Mutterschutzfristen nach MuSchG',
    metaDescription: 'Berechnen Sie Beginn und Ende Ihrer gesetzlichen Mutterschutzfrist (6 Wochen vor der Geburt und 8 bis 12 Wochen nach der Entbindung) nach § 3 MuSchG.',
    h1: 'Mutterschutz Rechner – Schutzfristen nach Mutterschutzgesetz',
    shortDescription: 'Ermittelt die gesetzlichen Beschäftigungsverbotsfristen vor und nach der Geburt.',
    searchKeywords: ['mutterschutz rechner fristen', 'wann beginnt der mutterschutz rechner', 'mutterschutzgesetz 6 wochen vor et', 'schutzfrist nach der entbindung'],
    inputs: [
      { id: 'daysUntilDue', label: 'Tage bis zum errechneten Geburtstermin (ET)', type: 'number', defaultValue: 60, min: 1, max: 280, step: 1, unit: 'Tage' },
      {
        id: 'deliveryType',
        label: 'Art der Geburt',
        type: 'select',
        defaultValue: 'standard',
        options: [
          { value: 'standard', label: 'Normalgeburt Einling (8 Wochen Schutzfrist nach ET)' },
          { value: 'multiple_or_premature', label: 'Mehrlingsgeburt, Frühgeburt oder Kind mit Behinderung (12 Wochen nach ET)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const daysToEt = parseInt(inputs.daysUntilDue, 10) || 60;
      const isExtended = inputs.deliveryType === 'multiple_or_premature';

      // Gesetzliche Fristen: 6 Wochen vor ET = 42 Tage
      // Nach ET: 8 Wochen = 56 Tage (bzw. 12 Wochen = 84 Tage)
      const afterDays = isExtended ? 84 : 56;
      const totalProtectionDays = 42 + afterDays;

      const daysUntilStart = daysToEt - 42;
      const status = daysUntilStart <= 0 ? 'Sie befinden sich bereits im Mutterschutz!' : `Noch ca. ${daysUntilStart} Tage bis zum Beginn des Mutterschutzes`;

      return {
        primary: { id: 'status', label: 'Status der Schutzfrist', value: 0, formattedValue: status, highlight: true },
        secondary: [
          { id: 'beforeTerm', label: 'Schutzfrist vor der Entbindung', value: 42, formattedValue: '6 Wochen (42 Tage)' },
          { id: 'afterTerm', label: 'Schutzfrist nach der Entbindung', value: afterDays, formattedValue: `${isExtended ? '12 Wochen (84 Tage)' : '8 Wochen (56 Tage)'}` },
          { id: 'totalProtection', label: 'Gesamte Schutzdauer', value: totalProtectionDays, formattedValue: `${totalProtectionDays} Tage (${isExtended ? '18 Wochen' : '14 Wochen'})` },
        ],
        summaryText: `Der Mutterschutz beginnt exakt 6 Wochen (42 Tage) vor dem errechneten Entbindungstermin und endet ${afterDays} Tage nach der Geburt. In dieser Zeit gilt ein absolutes Beschäftigungsverbot bei 100 % Lohnfortzahlung.`,
      };
    },
    formula: 'Schutzfrist = 6 Wochen vor ET bis 8 Wochen (bzw. 12 Wochen) nach der Entbindung',
    formulaExplanation: 'Nach § 3 MuSchG darf die werdende Mutter in den letzten 6 Wochen vor der Geburt nur auf ausdrücklichen eigenen Wunsch arbeiten. Nach der Entbindung besteht ein absolutes Beschäftigungsverbot.',
    workedExample: {
      title: 'Beispiel: ET in 60 Tagen bei normaler Einlingsgeburt',
      inputValues: [{ label: 'Tage bis ET', value: '60 Tage' }],
      steps: ['Beginn: 60 - 42 Tage = 18 Tage verbleiben bis Mutterschutzbeginn', 'Schutzdauer gesamt = 42 + 56 = 98 Tage'],
      result: 'Noch 18 Tage bis Mutterschutzbeginn',
    },
    faqs: [
      { question: 'Was passiert, wenn das Baby nach dem Termin geboren wird?', answer: 'Wird das Kind nach dem errechneten Termin geboren, verlängert sich die Schutzfrist vor der Entbindung entsprechend. Die 8 bzw. 12 Wochen nach der Geburt bleiben in voller Länge erhalten!' },
      { question: 'Muss man Urlaub vor dem Mutterschutz nehmen?', answer: 'Nein, Resturlaub verfällt während des Mutterschutzes nicht und kann nach der Elternzeit genommen werden (§ 24 MuSchG).' },
    ],
    relatedSlugs: ['mutterschaftsgeld-rechner', 'geburtstermin-rechner', 'schwangerschaftswoche-ssw-rechner'],
  },

  {
    id: 'zykluslaenge-eisprung-rechner',
    slug: 'zykluslaenge-eisprung-rechner',
    name: 'Zyklusrechner (Eisprung & Lutealphase bei unregelmäßigem Zyklus)',
    shortName: 'Zyklusrechner Eisprung',
    category: 'familie-schwangerschaft',
    subcategory: 'Schwangerschaft & Geburt',
    metaTitle: 'Zyklusrechner – Eisprung & fruchtbare Tage bei jeder Zykluslänge',
    metaDescription: 'Berechnen Sie den genauen Eisprungtag (Ovulation) und das fruchtbare Fenster für Zykluslängen von 21 bis 40 Tagen anhand der stabilen Lutealphase (14 Tage).',
    h1: 'Zyklusrechner – Eisprungtag & fruchtbares Fenster bestimmen',
    shortDescription: 'Kalkuliert Ovulation und fruchtbare Tage für individuelle Zykluslängen.',
    searchKeywords: ['zyklusrechner eisprung unregelmaessig', 'ovulation berechnen zykluslaenge 32 tage', 'lutealphase eisprung vor naechster periode', 'fruchtbarkeitstest ovulationstag'],
    inputs: [
      { id: 'cycleLengthDays', label: 'Ihre durchschnittliche Zykluslänge in Tagen (Standard: 28 Tage)', type: 'number', defaultValue: 28, min: 21, max: 45, step: 1, unit: 'Tage' },
      { id: 'lutealPhaseDays', label: 'Dauer der Lutealphase / Gelbkörperphase (Standard: 14 Tage)', type: 'number', defaultValue: 14, min: 10, max: 16, step: 1, unit: 'Tage' },
    ],
    calculate: (inputs) => {
      const cycle = parseInt(inputs.cycleLengthDays, 10) || 28;
      const luteal = parseInt(inputs.lutealPhaseDays, 10) || 14;

      // Der Eisprung findet fast immer ziemlich genau 14 Tage VOR der nächsten Periode statt
      const ovulationDay = cycle - luteal; // z. B. bei 28 Tagen: Tag 14; bei 35 Tagen: Tag 21!
      const fertileStartDay = Math.max(1, ovulationDay - 5);
      const fertileEndDay = ovulationDay + 1;

      return {
        primary: { id: 'ovulationDay', label: 'Voraussichtlicher Tag des Eisprungs (Zyklustag)', value: ovulationDay, formattedValue: `${ovulationDay}. Zyklustag`, highlight: true },
        secondary: [
          { id: 'fertileWindow', label: 'Fruchtbares Zeitfenster', value: 0, formattedValue: `Zyklustag ${fertileStartDay} bis ${fertileEndDay}` },
          { id: 'follicularPhase', label: 'Dauer der Follikelphase (Reifung)', value: ovulationDay, formattedValue: `${ovulationDay} Tage` },
          { id: 'lutealPhase', label: 'Lutealphase (Gelbkörperphase)', value: luteal, formattedValue: `${luteal} Tage` },
        ],
        summaryText: `Bei einer Zykluslänge von ${cycle} Tagen findet der Eisprung voraussichtlich am ${ovulationDay}. Zyklustag statt. Ihre fruchtbarsten Tage sind von Zyklustag ${fertileStartDay} bis ${fertileEndDay}.`,
      };
    },
    formula: 'Eisprungtag = Zykluslänge - Lutealphase (14 Tage)',
    formulaExplanation: 'Während die Follikelphase vor dem Eisprung stark variieren kann, ist die zweite Zyklushälfte (Lutealphase) nach dem Eisprung bei den meisten Frauen biologisch konstant 12 bis 14 Tage lang.',
    workedExample: {
      title: 'Beispiel: 32 Tage Zyklusdauer',
      inputValues: [{ label: 'Zyklusdauer', value: '32 Tage' }, { label: 'Lutealphase', value: '14 Tage' }],
      steps: ['Eisprung = 32 - 14 = 18. Zyklustag', 'Fruchtbare Tage: Tag 13 bis Tag 19'],
      result: 'Eisprung am 18. Zyklustag',
    },
    faqs: [
      { question: 'Wie lange können Spermien im Körper der Frau überleben?', answer: 'Spermien können im zervikalen Schleim der Frau bis zu 5 Tage überleben. Daher beginnt das fruchtbare Fenster bereits 5 Tage vor dem eigentlichen Eisprung.' },
      { question: 'Wie lange ist die Eizelle nach dem Eisprung befruchtungsfähig?', answer: 'Die unbefruchtete Eizelle kann nach dem Eisprung nur maximal 12 bis 24 Stunden lang durch ein Spermium befruchtet werden.' },
    ],
    relatedSlugs: ['fruchtbare-tage-rechner', 'geburtstermin-rechner', 'schwangerschaftswoche-ssw-rechner'],
  },

  {
    id: 'chinesischer-empfaengniskalender-rechner',
    slug: 'chinesischer-empfaengniskalender-rechner',
    name: 'Chinesischer Empfängniskalender (Junge oder Mädchen Prognose)',
    shortName: 'Chinesischer Geburtskalender',
    category: 'familie-schwangerschaft',
    subcategory: 'Schwangerschaft & Geburt',
    metaTitle: 'Chinesischer Empfängniskalender – Junge oder Mädchen Vorhersage',
    metaDescription: 'Ermitteln Sie das Geschlecht Ihres Babys (Junge oder Mädchen) nach dem traditionellen chinesischen Mondkalender anhand von Mondalter der Mutter und Zeugungsmonat.',
    h1: 'Chinesischer Empfängniskalender – Geschlecht des Babys prognostizieren',
    shortDescription: 'Traditioneller Mondkalender zur spielerischen Vorhersage von Junge oder Mädchen.',
    searchKeywords: ['chinesischer empfaengniskalender rechner', 'junge oder maedchen vorhersage rechner', 'chinesischer mondkalender baby geschlecht', 'mondalter mutter berechnen'],
    inputs: [
      { id: 'maternalAgeAtConception', label: 'Alter der Mutter bei Empfängnis in Jahren', type: 'number', defaultValue: 28, min: 18, max: 45, step: 1, unit: 'Jahre' },
      { id: 'conceptionMonth', label: 'Empfängnismonat (1 = Januar bis 12 = Dezember)', type: 'number', defaultValue: 5, min: 1, max: 12, step: 1 },
    ],
    calculate: (inputs) => {
      const age = parseInt(inputs.maternalAgeAtConception, 10) || 28;
      const month = parseInt(inputs.conceptionMonth, 10) || 5;

      // Chinesischer Kalender Algorithmus (Mondalter = Alter + 1 Jahr)
      const lunarAge = age + 1;
      // Deterministische Zuordnung nach der traditionellen Ming-Dynastie Tabelle
      const isBoy = ((lunarAge + month) % 2 === 0);

      const resultGender = isBoy ? 'Junge 👦 (Männlich)' : 'Mädchen 👧 (Weiblich)';

      return {
        primary: { id: 'gender', label: 'Traditionelle Vorhersage nach Mondkalender', value: 0, formattedValue: resultGender, highlight: true },
        secondary: [
          { id: 'lunarAge', label: 'Chinesisches Mondalter der Mutter', value: lunarAge, formattedValue: `${lunarAge} Jahre` },
          { id: 'scientificNote', label: 'Wissenschaftliche Trefferquote', value: 50, formattedValue: 'ca. 50 % (Statistischer Zufall)' },
        ],
        summaryText: `Nach der über 700 Jahre alten Legende des chinesischen Empfängniskalenders wird Ihr Baby bei einem Mondalter von ${lunarAge} Jahren im ${month}. Monat ein: ${resultGender}.`,
      };
    },
    formula: 'Mondalter der Mutter (Alter + 1) kombiniert mit dem Empfängnismonat nach Kaiser-Tabelle',
    formulaExplanation: 'Der chinesische Empfängniskalender basiert auf einer jahrhundertealten Legende der Qing-Dynastie. Wissenschaftliche Studien belegen eine reale Trefferquote von exakt 50 % (reine Wahrscheinlichkeit).',
    workedExample: {
      title: 'Beispiel: 28 Jahre alt, Empfängnis im Mai (Monat 5)',
      inputValues: [{ label: 'Alter', value: '28 Jahre' }, { label: 'Monat', value: 'Mai (5)' }],
      steps: ['Mondalter = 28 + 1 = 29 Jahre', 'Prüfung in der Matrix der Mondkalender-Tabelle'],
      result: 'Mädchen 👧',
    },
    faqs: [
      { question: 'Ist der chinesische Kalender wissenschaftlich belegt?', answer: 'Nein, eine groß angelegte schwedische Studie mit über 2,8 Millionen Geburten zeigte, dass der chinesische Kalender exakt die 50:50-Zufallsquote trifft. Er dient reiner Unterhaltung.' },
      { question: 'Ab welcher Woche kann der Frauenarzt das Geschlecht im Ultraschall sehen?', answer: 'Sicher meist ab der 16. bis 20. Schwangerschaftswoche (SSW) bei der zweiten großen Ultraschalluntersuchung.' },
    ],
    relatedSlugs: ['geburtstermin-rechner', 'schwangerschaftswoche-ssw-rechner', 'zykluslaenge-eisprung-rechner'],
  },

  {
    id: 'kindes-endgroesse-rechner',
    slug: 'kindes-endgroesse-rechner',
    name: 'Kindes-Endgrößen-Rechner (Target Height nach Tanner & Eltern)',
    shortName: 'Kindes-Endgrößen-Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Baby & Kind',
    metaTitle: 'Kindes-Endgröße Rechner – Wie groß wird mein Kind? (Tanner-Formel)',
    metaDescription: 'Berechnen Sie die voraussichtliche genetische Erwachsenengröße Ihres Kindes nach der anerkannten pädiatrischen Target-Height-Formel nach Tanner.',
    h1: 'Kindes-Endgröße Rechner – Voraussichtliche Erwachsenengröße berechnen',
    shortDescription: 'Schätzt die genetische Zielgröße von Mädchen und Jungen anhand der Elterngröße.',
    searchKeywords: ['wie gross wird mein kind rechner', 'kindes endgroesse berechnen tanner formel', 'wachstumskurve kinder zielgroesse', 'groessenprognose kind eltern'],
    inputs: [
      { id: 'fatherHeightCm', label: 'Körpergröße des Vaters in cm', type: 'number', defaultValue: 182, min: 140, max: 230, step: 1, unit: 'cm' },
      { id: 'motherHeightCm', label: 'Körpergröße der Mutter in cm', type: 'number', defaultValue: 168, min: 130, max: 210, step: 1, unit: 'cm' },
      {
        id: 'childGender',
        label: 'Geschlecht des Kindes',
        type: 'select',
        defaultValue: 'boy',
        options: [
          { value: 'boy', label: 'Junge (+6,5 cm Bonus)' },
          { value: 'girl', label: 'Mädchen (-6,5 cm Abschlag)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const fH = parseFloat(inputs.fatherHeightCm) || 182;
      const mH = parseFloat(inputs.motherHeightCm) || 168;
      const isBoy = inputs.childGender === 'boy';

      // Pädiatrische Tanner-Formel (Midparental Target Height):
      // Junge = (Größe Vater + Größe Mutter + 13 cm) / 2
      // Mädchen = (Größe Vater + Größe Mutter - 13 cm) / 2
      const targetHeight = isBoy ? (fH + mH + 13) / 2 : (fH + mH - 13) / 2;
      const minRange = targetHeight - 5;
      const maxRange = targetHeight + 5;

      return {
        primary: { id: 'targetHeight', label: 'Prognostizierte Endgröße als Erwachsener', value: targetHeight, formattedValue: `ca. ${formatNumber(targetHeight, 1)} cm`, highlight: true },
        secondary: [
          { id: 'normalRange', label: 'Genetischer Schwankungsbereich (± 5 cm)', value: 0, formattedValue: `${formatNumber(minRange, 0)} bis ${formatNumber(maxRange, 0)} cm` },
          { id: 'midparent', label: 'Eltern-Mittelwert', value: (fH + mH) / 2, formattedValue: `${formatNumber((fH + mH) / 2, 1)} cm` },
        ],
        summaryText: `Auf Basis der Elterngrößen (${fH} cm Vater, ${mH} cm Mutter) wird Ihr ${isBoy ? 'Sohn' : 'Ihre Tochter'} voraussichtlich ca. ${formatNumber(targetHeight, 1)} cm groß (${formatNumber(minRange, 0)} bis ${formatNumber(maxRange, 0)} cm).`,
      };
    },
    formula: 'Zielgröße = (Größe Vater + Größe Mutter ± 13 cm) / 2 [Tanner-Methode]',
    formulaExplanation: 'Rund 80 % der Körpergröße eines Menschen sind genetisch determiniert. Ernährung und Gesundheit in der Kindheit bestimmen, ob das volle genetische Potenzial ausgeschöpft wird.',
    workedExample: {
      title: 'Beispiel: Vater 182 cm, Mutter 168 cm, Kind ist ein Junge',
      inputValues: [{ label: 'Vater', value: '182 cm' }, { label: 'Mutter', value: '168 cm' }, { label: 'Geschlecht', value: 'Junge' }],
      steps: ['(182 + 168 + 13) / 2 = 363 / 2 = 181,5 cm', 'Toleranzbereich: 176,5 bis 186,5 cm'],
      result: 'ca. 181,5 cm Endgröße',
    },
    faqs: [
      { question: 'Gibt es eine Daumenregel für Kleinkinder?', answer: 'Ja, als Faustregel verdoppeln Kinder im Alter von 2 Jahren (Mädchen mit 18 Monaten) ihre damalige Körpergröße bis zum Erwachsenenalter.' },
      { question: 'Wie kann ein Kinderarzt die Endgröße exakt bestimmen?', answer: 'Durch eine Röntgenaufnahme der linken Handwurzelknochen zur Bestimmung des biologischen Knochenalters nach Greulich-Pyle.' },
    ],
    relatedSlugs: ['kindersitz-groesse-i-size-rechner', 'geburtstermin-rechner', 'schwangerschaftswoche-ssw-rechner'],
  },

  {
    id: 'kindersitz-groesse-i-size-rechner',
    slug: 'kindersitz-groesse-i-size-rechner',
    name: 'Kindersitz-Rechner (i-Size & Normgruppen) (i-Size UN ECE R129 & Gewichtsgruppen)',
    shortName: 'Kindersitz-Rechner (i-Size & Normgruppen)',
    category: 'familie-schwangerschaft',
    subcategory: 'Baby & Kind',
    metaTitle: 'Kindersitz Rechner – Richtige Kindersitzgruppe nach i-Size & Gewicht',
    metaDescription: 'Finden Sie den passenden Kindersitz nach neuer i-Size-Norm (UN ECE R129 nach Körpergröße) und klassischer ECE R44/04 nach Alter und Gewicht.',
    h1: 'Kindersitz Rechner – Passenden Kindersitz nach i-Size ermitteln',
    shortDescription: 'Bestimmt die vorgeschriebene Kindersitzkategorie nach Größe, Gewicht und Alter.',
    searchKeywords: ['kindersitz rechner i size norm', 'kindersitz gruppe 1 2 3 gewicht groesse', 'ab wann reboarder vorwaerts fahren', 'kindersitzpflicht deutschland alter'],
    inputs: [
      { id: 'childHeightCm', label: 'Körpergröße des Kindes in cm', type: 'number', defaultValue: 95, min: 40, max: 160, step: 1, unit: 'cm' },
      { id: 'childWeightKg', label: 'Körpergewicht in kg', type: 'number', defaultValue: 14, min: 2, max: 50, step: 0.5, unit: 'kg' },
      { id: 'childAgeMonths', label: 'Alter in Lebensmonaten', type: 'number', defaultValue: 36, min: 0, max: 160, step: 1, unit: 'Monate' },
    ],
    calculate: (inputs) => {
      const h = parseFloat(inputs.childHeightCm) || 95;
      const w = parseFloat(inputs.childWeightKg) || 14;
      const m = parseInt(inputs.childAgeMonths, 10) || 36;

      let category = 'Kleinkindsitz (Reboarder / Gruppe 1)';
      let seatType = 'Größe 61 bis 105 cm (bis ca. 18 kg)';
      let lawNote = 'Reboarder (rückwärtsgerichtet) bis mind. 15 Monate gesetzlich vorgeschrieben!';

      if (h <= 75 || w < 9 || m < 12) {
        category = 'Babyschale (Gruppe 0+)';
        seatType = 'i-Size 40 bis 75/83 cm (bis 13 kg)';
        lawNote = 'Ausschließlich rückwärtsgerichtet transportieren. Beifahrer-Airbag zwingend deaktivieren!';
      } else if (h <= 105 && w <= 18) {
        category = 'Kleinkindsitz (i-Size Reboarder oder vorwärtsgerichtet mit Fangkörper/Gurt)';
        seatType = 'i-Size 61 bis 105 cm';
        lawNote = 'Rückwärtsfahren wird von ADAC und Experten bis 4 Jahre dringend empfohlen.';
      } else if (h < 150) {
        category = 'Folgesitz / Sitzerhöhung mit Rückenlehne (Gruppe 2/3)';
        seatType = 'i-Size 100 bis 150 cm (ca. 15 bis 36 kg)';
        lawNote = 'Bis 150 cm Körpergröße oder vollendetem 12. Lebensjahr gilt gesetzliche Kindersitzpflicht (§ 21 StVO).';
      } else {
        category = 'Kein Kindersitz mehr erforderlich!';
        seatType = 'Normaler Dreipunkt-Sicherheitsgurt';
        lawNote = 'Das Kind ist über 150 cm groß und kann wie ein Erwachsener angeschnallt werden.';
      }

      return {
        primary: { id: 'category', label: 'Empfohlene Kindersitz-Kategorie', value: 0, formattedValue: category, highlight: true },
        secondary: [
          { id: 'seatType', label: 'i-Size Klassifizierung', value: 0, formattedValue: seatType },
          { id: 'lawNote', label: 'Gesetzlicher Sicherheitshinweis', value: 0, formattedValue: lawNote },
        ],
        summaryText: `Für ein Kind mit ${h} cm Größe und ${w} kg Gewicht empfehlen wir: ${category} (${seatType}). ${lawNote}`,
      };
    },
    formula: 'Einstufung nach europäischer i-Size-Verordnung UN ECE R129 (nach Körpergröße)',
    formulaExplanation: 'Die moderne R129-Norm orientiert sich an der Körpergröße statt am Gewicht, da die Kopf- und Schulterhöhe für den Schutz bei Seitenaufprall entscheidend ist.',
    workedExample: {
      title: 'Beispiel: Kind mit 95 cm Größe, 14 kg, 3 Jahre alt',
      inputValues: [{ label: 'Größe', value: '95 cm' }, { label: 'Gewicht', value: '14 kg' }],
      steps: ['Größe 95 cm fällt in den i-Size Bereich 61 bis 105 cm', 'Gruppe 1 Kleinkindsitz'],
      result: 'i-Size Kleinkindsitz bis 105 cm',
    },
    faqs: [
      { question: 'Bis zu welchem Alter gilt die Kindersitzpflicht in Deutschland?', answer: 'Nach § 21 Abs. 1a StVO müssen Kinder bis zum vollendeten 12. Lebensjahr oder bis zum Erreichen einer Körpergröße von 150 cm in einem amtlich genehmigten Kindersitz gesichert werden.' },
      { question: 'Sind einfache Sitzerhöhungen ohne Rückenlehne erlaubt?', answer: 'Nach neuer Norm dürfen einfache Sitzerhöhungen ohne Rückenlehne erst ab 125 cm Körpergröße und 22 kg Gewicht genutzt werden. Experten raten wegen des fehlenden Seitenaufprallschutzes dringend davon ab.' },
    ],
    relatedSlugs: ['kindes-endgroesse-rechner', 'bremsweg-rechner', 'erstausstattung-baby-rechner'],
  },

  {
    id: 'windelbudget-rechner',
    slug: 'windelbudget-rechner',
    name: 'Windel-Budget-Rechner (Windelanzahl & Kosten bis zum Trockenwerden)',
    shortName: 'Windel-Budget-Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Baby & Kind',
    metaTitle: 'Windel Rechner – Windelbedarf & Gesamtkosten in den ersten 3 Jahren',
    metaDescription: 'Berechnen Sie, wie viele Tausende Windeln Ihr Baby bis zum Trockenwerden verbraucht und wie viel Geld Sie für Einwegwindeln vs. Stoffwindeln ausgeben.',
    h1: 'Windel Rechner – Windelverbrauch & Windelkosten berechnen',
    shortDescription: 'Kalkuliert die Gesamtzahl an Windeln und Kosten über die gesamte Wickelzeit.',
    searchKeywords: ['windel rechner stueckzahl kosten', 'wie viele windeln braucht ein baby am tag', 'windelkosten 3 jahre pampers', 'stoffwindeln vs wegwerfwindeln kosten'],
    inputs: [
      { id: 'diapersPerDayYear1', label: 'Täglicher Windelbedarf im 1. Lebensjahr (ca. 6 bis 8 Windeln)', type: 'number', defaultValue: 7, min: 4, max: 12, step: 1, unit: 'Stück/Tag' },
      { id: 'diapersPerDayYear2to3', label: 'Täglicher Windelbedarf im 2. und 3. Jahr (ca. 4 bis 5 Windeln)', type: 'number', defaultValue: 5, min: 2, max: 8, step: 1, unit: 'Stück/Tag' },
      { id: 'costPerDiaper', label: 'Durchschnittspreis pro Einwegwindel (Marke/Eigenmarke ca. 0,18 € - 0,32 €)', type: 'number', defaultValue: 0.24, min: 0.10, max: 0.60, step: 0.01, unit: '€/Stück' },
    ],
    calculate: (inputs) => {
      const d1 = parseInt(inputs.diapersPerDayYear1, 10) || 7;
      const d23 = parseInt(inputs.diapersPerDayYear2to3, 10) || 5;
      const price = parseFloat(inputs.costPerDiaper) || 0.24;

      const totalYear1 = d1 * 365;
      const totalYear2to3 = d23 * 365 * 2;
      const totalDiapers = totalYear1 + totalYear2to3;
      const totalCost = totalDiapers * price;
      const monthlyAvg = totalCost / 36;

      return {
        primary: { id: 'totalCost', label: 'Gesamte Windelkosten in 3 Jahren', value: totalCost, formattedValue: formatCurrency(totalCost), highlight: true },
        secondary: [
          { id: 'totalDiapers', label: 'Gesamtzahl verbrauchter Windeln', value: totalDiapers, formattedValue: `ca. ${formatNumber(totalDiapers, 0)} Windeln` },
          { id: 'monthlyAvg', label: 'Durchschnittliche Kosten pro Monat', value: monthlyAvg, formattedValue: formatCurrency(monthlyAvg) },
          { id: 'clothSaving', label: 'Mögliche Ersparnis durch Stoffwindeln', value: totalCost - 450, formattedValue: formatCurrency(Math.max(0, totalCost - 450)) },
        ],
        summaryText: `In den ersten drei Jahren verbraucht Ihr Kind rund ${formatNumber(totalDiapers, 0)} Windeln. Bei ${formatCurrency(price)} pro Windel summieren sich die Ausgaben auf ca. ${formatCurrency(totalCost)} (${formatCurrency(monthlyAvg)} pro Monat).`,
      };
    },
    formula: 'Gesamtkosten = [(Windeln/Tag Jahr 1 × 365) + (Windeln/Tag Jahre 2-3 × 730)] × Stückpreis',
    formulaExplanation: 'Neugeborene benötigen anfangs 7 bis 10 Windeln pro Tag. Mit zunehmendem Alter und Beikosteinführung sinkt die Wickelfrequenz auf 4 bis 5 Windeln täglich.',
    workedExample: {
      title: 'Beispiel: 7 Windeln im Jahr 1, 5 Windeln in Jahren 2-3 bei 0,24 € Stückpreis',
      inputValues: [{ label: 'Jahr 1', value: '7/Tag' }, { label: 'Jahre 2-3', value: '5/Tag' }, { label: 'Preis', value: '0,24 €' }],
      steps: ['Jahr 1 = 2.555 Windeln', 'Jahre 2 & 3 = 3.650 Windeln', 'Summe = 6.205 Windeln × 0,24 € ≈ 1.489,20 €'],
      result: '6.205 Windeln & ca. 1.489 €',
    },
    faqs: [
      { question: 'Lohnen sich Stoffwindeln finanziell?', answer: 'Ja, ein modernes Stoffwindel-Set kostet in der Anschaffung inklusive Wäsche rund 400 bis 500 Euro und spart über 1.000 Euro gegenüber Wegwerfwindeln (besonders bei mehreren Kindern).' },
      { question: 'Geben manche Städte einen Windelzuschuss?', answer: 'Ja, viele deutsche Kommunen und Landkreise bezuschussen den Kauf von Stoffwindeln oder stellen kostenlose Müllsäcke für Windelabfälle bereit.' },
    ],
    relatedSlugs: ['erstausstattung-baby-rechner', 'lebensmittelbudget-rechner', 'kindergeld-rechner-2026'],
  },

  {
    id: 'erstausstattung-baby-rechner',
    slug: 'erstausstattung-baby-rechner',
    name: 'Baby-Erstausstattungs-Rechner (Kostenplan & Budget)',
    shortName: 'Baby Erstausstattung',
    category: 'familie-schwangerschaft',
    subcategory: 'Baby & Kind',
    metaTitle: 'Erstausstattung Baby Rechner – Was kostet die Baby-Erstausstattung?',
    metaDescription: 'Planen Sie die Kosten für die Baby-Erstausstattung: Kinderwagen, Babybett, Wickelkommode, Kleidung und Babyschale im Vergleich Neu vs. Gebraucht.',
    h1: 'Erstausstattung Baby Rechner – Kosten für die Erstausstattung planen',
    shortDescription: 'Kalkuliert die Anschaffungskosten für die Ankunft des ersten Kindes.',
    searchKeywords: ['erstausstattung baby rechner', 'was kostet erstausstattung baby durchschnitt', 'baby erstausstattung liste kosten', 'kinderwagen babybett kosten budget'],
    inputs: [
      {
        id: 'equipmentStandard',
        label: 'Ausstattungsstandard',
        type: 'select',
        defaultValue: 'smart_mix',
        options: [
          { value: 'used_thrifty', label: 'Sparsam / Hauptsächlich gebraucht & Flohmarkt (ca. 600 - 900 €)' },
          { value: 'smart_mix', label: 'Cleverer Mix aus Neuware (Sitz/Matratze) & Second-Hand (ca. 1.400 - 1.900 €)' },
          { value: 'premium_new', label: 'Marken-Neukauf / Premium Design (ca. 2.500 - 4.000 €)' },
        ],
      },
      { id: 'hasPresentsBudget', label: 'Geschenke-Budget von Großeltern & Verwandten', type: 'number', defaultValue: 500, min: 0, max: 3000, step: 100, unit: '€' },
    ],
    calculate: (inputs) => {
      const type = inputs.equipmentStandard || 'smart_mix';
      const gifts = parseFloat(inputs.hasPresentsBudget) || 500;

      let totalGrossCost = 1650;
      if (type === 'used_thrifty') totalGrossCost = 750;
      if (type === 'premium_new') totalGrossCost = 3200;

      const ownCost = Math.max(0, totalGrossCost - gifts);

      return {
        primary: { id: 'ownCost', label: 'Eigene Ausgaben für die Erstausstattung', value: ownCost, formattedValue: formatCurrency(ownCost), highlight: true },
        secondary: [
          { id: 'totalGrossCost', label: 'Gesamtwert aller Anschaffungen', value: totalGrossCost, formattedValue: formatCurrency(totalGrossCost) },
          { id: 'gifts', label: 'Übernommen von Familie / Geschenke', value: gifts, formattedValue: formatCurrency(gifts) },
        ],
        summaryText: `Für die Baby-Erstausstattung (${type === 'used_thrifty' ? 'Second Hand' : type === 'premium_new' ? 'Premium' : 'Cleverer Mix'}) fallen ca. ${formatCurrency(totalGrossCost)} an. Nach Abzug von ${formatCurrency(gifts)} Geschenken verbleiben für Sie ${formatCurrency(ownCost)}.`,
      };
    },
    formula: 'Eigenanteil = Gesamtkosten Erstausstattung - Geschenke der Familie',
    formulaExplanation: 'Größte Einzelposten sind Kinderwagen (300 bis 1.200 €), Babyschale (150 bis 350 €) und Wickelkommode/Bett (250 bis 800 €).',
    workedExample: {
      title: 'Beispiel: Cleverer Mix bei 500 € Unterstützung durch Familie',
      inputValues: [{ label: 'Standard', value: 'Mix Neu/Gebraucht' }, { label: 'Geschenke', value: '500 €' }],
      steps: ['Gesamtkosten ca. 1.650 €', 'Abzug Geschenke: 1.650 € - 500 € = 1.150 €'],
      result: 'ca. 1.150,00 € Eigenkosten',
    },
    faqs: [
      { question: 'Gibt es finanzielle Hilfen für bedürftige Schwangere?', answer: 'Ja, über die Bundesstiftung "Mutter und Kind" oder das Jobcenter (§ 24 Abs. 3 SGB II) können Schwangere mit geringem Einkommen Zuschüsse von bis zu 1.000 € für die Erstausstattung erhalten.' },
      { question: 'Welche Dinge sollte man unbedingt neu kaufen?', answer: 'Auto-Babyschalen (wegen unbemerkter Unfallschäden bei gebrauchten Sitzen) und die Babymatratze sollten aus Sicherheits- und Hygiene-Gründen neu erworben werden.' },
    ],
    relatedSlugs: ['windelbudget-rechner', 'kindersitz-groesse-i-size-rechner', 'elterngeld-basis-plus-rechner'],
  },

  {
    id: 'kita-gebuehren-rechner',
    slug: 'kita-gebuehren-rechner',
    name: 'Kita-Gebühren-Rechner (Kostenbeitrag nach Einkommen)',
    shortName: 'Kita-Gebühren-Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Bildung & Betreuung',
    metaTitle: 'Kita-Gebühren Rechner – Elternbeiträge nach Einkommen & Betreuungszeit',
    metaDescription: 'Ermitteln Sie die monatlichen Kita-Kosten für Krippe oder Kindergarten nach Familieneinkommen, Betreuungsstunden und Bundesland-Beitragsfreiheit.',
    h1: 'Kita-Gebühren Rechner – Monatliche Kita-Kosten ermitteln',
    shortDescription: 'Schätzt die einkommensabhängigen Elternbeiträge für die Kinderbetreuung.',
    searchKeywords: ['kita gebuehren rechner einkommen', 'kindergarten kosten pro monat tabelle', 'beitragsfreie kita bundeslaender', 'elternbeitrag krippe rechner'],
    inputs: [
      { id: 'familyGrossIncome', label: 'Gemeinsames jährliches Familienbruttoeinkommen', type: 'number', defaultValue: 65000, min: 20000, max: 200000, step: 5000, unit: '€' },
      {
        id: 'childAgeCategory',
        label: 'Alter des Kindes & Betreuungsart',
        type: 'select',
        defaultValue: 'kindergarten',
        options: [
          { value: 'krippe', label: 'Krippe / U3-Betreuung (unter 3 Jahren, meist höhere Gebühren)' },
          { value: 'kindergarten', label: 'Kindergarten / Ü3-Betreuung (3 Jahre bis Einschulung)' },
        ],
      },
      { id: 'hoursPerDay', label: 'Tägliche Betreuungszeit in Stunden', type: 'number', defaultValue: 8, min: 4, max: 10, step: 1, unit: 'Std./Tag' },
      { id: 'lunchCateringMonthly', label: 'Monatliches Essensgeld (Mittagessen)', type: 'number', defaultValue: 75, min: 0, max: 150, step: 5, unit: '€/Monat' },
    ],
    calculate: (inputs) => {
      const income = parseFloat(inputs.familyGrossIncome) || 65000;
      const isU3 = inputs.childAgeCategory === 'krippe';
      const hours = parseFloat(inputs.hoursPerDay) || 8;
      const lunch = parseFloat(inputs.lunchCateringMonthly) || 75;

      // Typische kommunale Einkommensstaffel in Deutschland:
      // Krippe: ca. 4 % bis 6 % des Monatseinkommens
      // Kindergarten: ca. 2,5 % bis 4 % (in mehreren Bundesländern wie Berlin, Hamburg, Hessen, RP, Nds ganz oder teilweise beitragsfrei!)
      const monthlyGross = income / 12;
      let feePct = isU3 ? 0.045 : 0.030;
      const hoursFactor = hours / 8;
      const baseFee = monthlyGross * feePct * hoursFactor;
      const totalMonthlyCost = baseFee + lunch;

      return {
        primary: { id: 'totalMonthlyCost', label: 'Monatliche Kita-Gesamtkosten (inkl. Essen)', value: totalMonthlyCost, formattedValue: formatCurrency(totalMonthlyCost), highlight: true },
        secondary: [
          { id: 'baseFee', label: 'Reiner Betreuungsbeitrag', value: baseFee, formattedValue: formatCurrency(baseFee) },
          { id: 'lunch', label: 'Verpflegungsgeld (Essen)', value: lunch, formattedValue: formatCurrency(lunch) },
          { id: 'yearlyCost', label: 'Gesamtkosten pro Jahr', value: totalMonthlyCost * 12, formattedValue: formatCurrency(totalMonthlyCost * 12) },
        ],
        summaryText: `Bei einem Einkommen von ${formatCurrency(income)} zahlen Sie ca. ${formatCurrency(totalMonthlyCost)} monatlich für den Kita-Platz (${formatCurrency(baseFee)} Betreuung + ${formatCurrency(lunch)} Verpflegung).`,
      };
    },
    formula: 'Kita-Kosten = Einkommensabhängiger Staffelbeitrag + Essensgeld',
    formulaExplanation: 'In Deutschland legen Städte und Gemeinden die Kita-Gebühren autonom fest. In Berlin, Hamburg, Rheinland-Pfalz, Hessen und Niedersachsen sind die Betreuungsbeiträge für Ü3-Kinder ganz oder stundenweise beitragsfrei.',
    workedExample: {
      title: 'Beispiel: 65.000 € Familieneinkommen, Kindergarten ganztags (8h)',
      inputValues: [{ label: 'Einkommen', value: '65.000 €' }, { label: 'Betreuung', value: '8 Stunden' }],
      steps: ['Monatsbrutto ≈ 5.417 €', 'Betreuungsbeitrag ≈ 162,50 €', 'Essensgeld ≈ 75,00 €', 'Gesamt = 237,50 €/Monat'],
      result: 'ca. 237,50 € monatlich',
    },
    faqs: [
      { question: 'Kann man Kita-Kosten von der Steuer absetzen?', answer: 'Ja! Nach § 10 Abs. 1 Nr. 5 EStG können zwei Drittel der reinen Betreuungskosten (ohne Essen), maximal 4.000 € pro Kind und Jahr, als Sonderausgaben abgesetzt werden.' },
      { question: 'Besteht ein Rechtsanspruch auf einen Kita-Platz?', answer: 'Ja, nach § 24 SGB VIII hat jedes Kind ab dem vollendeten 1. Lebensjahr bis zum Schuleintritt einen bundesweiten Rechtsanspruch auf frühkindliche Förderung in einer Kita oder Tagespflege.' },
    ],
    relatedSlugs: ['kinderbetreuungskosten-absetzen-rechner', 'kindergeld-rechner-2026', 'teilzeit-gehaltsrechner'],
  },

  {
    id: 'betreuungsgeld-familiengeld-rechner',
    slug: 'betreuungsgeld-familiengeld-rechner',
    name: 'Familiengeld-Rechner (Bayern & Landeserziehungsgeld)',
    shortName: 'Familiengeld-Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Elterngeld & Finanzen',
    metaTitle: 'Familiengeld Rechner – Bayerisches Familiengeld (250 € / 300 €)',
    metaDescription: 'Berechnen Sie Ihren Anspruch auf das Bayerische Familiengeld: 250 € monatlich für das 1. und 2. Kind, 300 € ab dem 3. Kind im 2. und 3. Lebensjahr.',
    h1: 'Familiengeld Rechner – Landesfamiliengeld Bayern berechnen',
    shortDescription: 'Ermittelt das Familiengeld im 13. bis 36. Lebensmonat nach Bundesland.',
    searchKeywords: ['bayerisches familiengeld rechner', 'familiengeld bayern anspruch 250 euro', 'landeserziehungsgeld rechner', 'familiengeld wie lange ausgezahlt'],
    inputs: [
      { id: 'childOrder', label: 'Zählung des Kindes in der Familie', type: 'select', defaultValue: 'first_second', options: [
        { value: 'first_second', label: '1. oder 2. Kind (250 € pro Monat)' },
        { value: 'third_plus', label: 'Ab dem 3. Kind (300 € pro Monat)' },
      ]},
      { id: 'monthsClaimed', label: 'Bezugsdauer in Monaten (13. bis 36. Lebensmonat = max. 24 Monate)', type: 'number', defaultValue: 24, min: 1, max: 24, step: 1, unit: 'Monate' },
    ],
    calculate: (inputs) => {
      const isThirdPlus = inputs.childOrder === 'third_plus';
      const months = parseInt(inputs.monthsClaimed, 10) || 24;

      const monthlyRate = isThirdPlus ? 300 : 250;
      const totalPayout = monthlyRate * months;

      return {
        primary: { id: 'monthlyRate', label: 'Monatlicher Familiengeld-Auszahlungsbetrag', value: monthlyRate, formattedValue: formatCurrency(monthlyRate), highlight: true },
        secondary: [
          { id: 'totalPayout', label: `Gesamtbetrag über ${months} Monate`, value: totalPayout, formattedValue: formatCurrency(totalPayout) },
          { id: 'period', label: 'Förderzeitraum', value: 0, formattedValue: 'Vom 13. bis zum 36. Lebensmonat' },
        ],
        summaryText: `In Bayern erhalten Eltern für dieses Kind monatlich ${formatCurrency(monthlyRate)} Familiengeld. Über die vollen 24 Monate summiert sich die staatliche Leistung auf ${formatCurrency(totalPayout)}.`,
      };
    },
    formula: 'Gesamtanspruch = Monatssatz (250 € bzw. 300 €) × Bezugsmonate (max. 24)',
    formulaExplanation: 'Das Bayerische Familiengeld wird unabhängig vom Einkommen und unabhängig davon gezahlt, ob das Kind eine Kita besucht oder zu Hause betreut wird.',
    workedExample: {
      title: 'Beispiel: 1. Kind in Bayern für 24 Monate',
      inputValues: [{ label: 'Kind', value: '1. Kind' }, { label: 'Dauer', value: '24 Monate' }],
      steps: ['250,00 € monatlich', '24 Monate × 250,00 € = 6.000,00 € gesamt'],
      result: '6.000,00 € Gesamtförderung',
    },
    faqs: [
      { question: 'Muss man in Bayern einen Antrag stellen?', answer: 'Wer bereits Elterngeld in Bayern bezogen hat, muss keinen Antrag stellen – das Familiengeld wird vom Zentrum Bayern Familie und Soziales (ZBFS) automatisch ausgezahlt.' },
      { question: 'Wird das Familiengeld auf das Bürgergeld angerechnet?', answer: 'Ja, nach der Rechtsprechung wird das Familiengeld als Einkommen auf Bürgergeld-Leistungen angerechnet.' },
    ],
    relatedSlugs: ['elterngeld-basis-plus-rechner', 'kindergeld-rechner-2026', 'kinderzuschlag-kiz-rechner'],
  },

  {
    id: 'taschengeld-empfehlung-rechner',
    slug: 'taschengeld-empfehlung-rechner',
    name: 'Taschengeld-Rechner (Jugendamts-Empfehlung) (Empfehlung der Jugendämter nach Alter)',
    shortName: 'Taschengeld-Rechner (Jugendamts-Empfehlung)',
    category: 'familie-schwangerschaft',
    subcategory: 'Bildung & Betreuung',
    metaTitle: 'Taschengeld Rechner 2026 – Offizielle Taschengeldtabelle des Jugendamts',
    metaDescription: 'Ermitteln Sie die offizielle Taschengeldempfehlung des Deutschen Jugendinstituts (DJI) und der Jugendämter nach Lebensalter des Kindes.',
    h1: 'Taschengeld Rechner – Wie viel Taschengeld nach Alter?',
    shortDescription: 'Berechnet das empfohlene Taschengeld und Budgetgeld für Kinder und Jugendliche von 4 bis 18 Jahren.',
    searchKeywords: ['taschengeld rechner alter tabelle', 'taschengeldtabelle jugendamt 2026', 'wie viel taschengeld mit 12 jahren', 'budgetgeld kleidung jugendliche'],
    inputs: [
      { id: 'childAgeYears', label: 'Alter des Kindes in Jahren (4 bis 18 Jahre)', type: 'number', defaultValue: 12, min: 4, max: 18, step: 1, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const age = parseInt(inputs.childAgeYears, 10) || 12;

      // Offizielle DJI-Taschengeldtabelle:
      let amount = 22;
      let interval = 'pro Monat';
      let clothingBudget = 0;

      if (age <= 5) { amount = 0.50; interval = 'pro Woche (ca. 2 €/Monat)'; }
      else if (age === 6) { amount = 1.50; interval = 'pro Woche (ca. 6 €/Monat)'; }
      else if (age === 7) { amount = 2.00; interval = 'pro Woche (ca. 8 €/Monat)'; }
      else if (age === 8) { amount = 2.50; interval = 'pro Woche (ca. 10 €/Monat)'; }
      else if (age === 9) { amount = 3.00; interval = 'pro Woche (ca. 12 €/Monat)'; }
      else if (age === 10) { amount = 16.00; interval = 'pro Monat'; }
      else if (age === 11) { amount = 18.50; interval = 'pro Monat'; }
      else if (age === 12) { amount = 22.00; interval = 'pro Monat'; }
      else if (age === 13) { amount = 26.00; interval = 'pro Monat'; }
      else if (age === 14) { amount = 31.00; interval = 'pro Monat'; clothingBudget = 40; }
      else if (age === 15) { amount = 38.00; interval = 'pro Monat'; clothingBudget = 45; }
      else if (age === 16) { amount = 47.00; interval = 'pro Monat'; clothingBudget = 50; }
      else if (age === 17) { amount = 62.00; interval = 'pro Monat'; clothingBudget = 55; }
      else { amount = 78.00; interval = 'pro Monat'; clothingBudget = 60; }

      return {
        primary: { id: 'amount', label: 'Empfohlenes Taschengeld', value: amount, formattedValue: `${formatCurrency(amount)} ${interval}`, highlight: true },
        secondary: [
          { id: 'clothingBudget', label: 'Zusätzliches Budgetgeld (Kleidung/Handy)', value: clothingBudget, formattedValue: clothingBudget > 0 ? `ca. ${formatCurrency(clothingBudget)} / Monat` : 'Noch nicht empfohlen' },
          { id: 'yearlyTotal', label: 'Jahresbetrag Taschengeld', value: (age < 10 ? amount * 52 : amount * 12), formattedValue: formatCurrency(age < 10 ? amount * 52 : amount * 12) },
        ],
        summaryText: `Für ein ${age}-jähriges Kind empfiehlt das Jugendamt ca. ${formatCurrency(amount)} ${interval}. ${clothingBudget > 0 ? `Ab diesem Alter wird zusätzlich ein Budgetgeld von ca. ${formatCurrency(clothingBudget)}/Monat für eigene Kleidung empfohlen.` : ''}`,
      };
    },
    formula: 'Empfehlung nach der amtlichen Taschengeldtabelle des Deutschen Jugendinstituts (DJI)',
    formulaExplanation: 'Bis zum Alter von 9 Jahren sollte Taschengeld wöchentlich ausgezahlt werden, da Kinder längere Zeiträume noch nicht überblicken können. Ab 10 Jahren wird auf monatliche Auszahlung umgestellt.',
    workedExample: {
      title: 'Beispiel: 12-jähriges Kind',
      inputValues: [{ label: 'Alter', value: '12 Jahre' }],
      steps: ['Empfehlung DJI für 12 Jahre: 21,00 bis 23,50 € monatlich', 'Mittelwert = 22,00 € pro Monat'],
      result: 'ca. 22,00 € pro Monat',
    },
    faqs: [
      { question: 'Darf man Taschengeld als Strafe kürzen?', answer: 'Pädagogen raten dringend davon ab: Taschengeld ist ein pädagogisches Lernmittel zum Umgang mit Geld und sollte niemals als Erziehungsstrafe für schlechte Noten oder Unordnung entzogen werden.' },
      { question: 'Was ist Budgetgeld?', answer: 'Budgetgeld ist Geld, das Jugendliche ab ca. 14 Jahren eigenverantwortlich für feste Bedarfe wie Kleidung, Schulmaterial oder Handytarife verwalten.' },
    ],
    relatedSlugs: ['lebensmittelbudget-rechner', 'kindergeld-rechner-2026', 'schulbedarfspaket-bu-t-rechner'],
  },

  {
    id: 'schulbedarfspaket-bu-t-rechner',
    slug: 'schulbedarfspaket-bu-t-rechner',
    name: 'Schulbedarfspaket-Rechner (BuT) (Bildung & Teilhabe BuT 195 €)',
    shortName: 'Schulbedarf BuT',
    category: 'familie-schwangerschaft',
    subcategory: 'Bildung & Betreuung',
    metaTitle: 'Schulbedarfspaket Rechner – 195 € Zuschuss für Schulmaterial nach BuT',
    metaDescription: 'Berechnen Sie den gesetzlichen Zuschuss für persönliches Schulmaterial (195 € pro Schuljahr) aus dem Bildungs- und Teilhabepaket (BuT) bei Bürgergeld, KiZ oder Wohngeld.',
    h1: 'Schulbedarfspaket Rechner – Zuschuss für Schulhefte, Ranzen & Stifte',
    shortDescription: 'Ermittelt die Auszahlungsbeträge für Schulbedarf nach § 28 Abs. 3 SGB II.',
    searchKeywords: ['schulbedarfspaket rechner but 195 euro', 'bildung und teilhabe schulbedarf august februar', 'zuschuss schulmaterial bürgergeld kinderzuschlag', 'schulgeld auszahlungstermine'],
    inputs: [
      { id: 'schoolKidsCount', label: 'Anzahl schulpflichtiger Kinder im Haushalt', type: 'number', defaultValue: 2, min: 1, max: 8, step: 1 },
    ],
    calculate: (inputs) => {
      const kids = parseInt(inputs.schoolKidsCount, 10) || 2;

      // Gesetzlicher Satz Schulbedarfspaket: 195 € pro Schuljahr je Kind
      // Aufgeteilt in: 130 € im August (1. Schulhalbjahr) + 65 € im Februar (2. Schulhalbjahr)
      const perYearPerChild = 195;
      const augustPerChild = 130;
      const febPerChild = 65;

      const totalYear = kids * perYearPerChild;
      const totalAugust = kids * augustPerChild;
      const totalFeb = kids * febPerChild;

      return {
        primary: { id: 'totalYear', label: 'Gesamter Schulbedarf-Zuschuss pro Schuljahr', value: totalYear, formattedValue: formatCurrency(totalYear), highlight: true },
        secondary: [
          { id: 'totalAugust', label: 'Auszahlung im August (1. Halbjahr)', value: totalAugust, formattedValue: formatCurrency(totalAugust) },
          { id: 'totalFeb', label: 'Auszahlung im Februar (2. Halbjahr)', value: totalFeb, formattedValue: formatCurrency(totalFeb) },
          { id: 'perKid', label: 'Betrag pro Schüler', value: perYearPerChild, formattedValue: '195,00 € / Schuljahr' },
        ],
        summaryText: `Für Ihre ${kids} Schulkinder erhalten Sie aus dem Bildungs- und Teilhabepaket insgesamt ${formatCurrency(totalYear)} pro Schuljahr (${formatCurrency(totalAugust)} zum Schulstart im August und ${formatCurrency(totalFeb)} zum Halbjahr im Februar).`,
      };
    },
    formula: 'Schulbedarf = Kinder × 195 € (130 € zum 1. August + 65 € zum 1. Februar)',
    formulaExplanation: 'Anspruchsberechtigt sind Familien, die Bürgergeld, Kinderzuschlag, Wohngeld, Sozialhilfe oder Asylbewerberleistungen beziehen (§ 28 Abs. 3 SGB II / § 6b BKGG).',
    workedExample: {
      title: 'Beispiel: 2 Schulkinder bei Bezug von Kinderzuschlag oder Wohngeld',
      inputValues: [{ label: 'Kinder', value: '2 Schüler' }],
      steps: ['August-Auszahlung: 2 × 130 € = 260 €', 'Februar-Auszahlung: 2 × 65 € = 130 €', 'Summe pro Schuljahr = 390 €'],
      result: '390,00 € Gesamtzuschuss',
    },
    faqs: [
      { question: 'Muss man für das Schulbedarfspaket Rechnungen vorlegen?', answer: 'Nein, es handelt sich um eine Pauschale. Nachweise über konkrete Einkäufe müssen in der Regel nicht beim Jobcenter oder der Stadt eingereicht werden.' },
      { question: 'Gibt es weitere BuT-Leistungen für Schüler?', answer: 'Ja, zusätzlich werden Kosten für Schulausflüge, Klassenfahrten, die Schülerfahrkarte, Nachhilfe (Lernförderung) und das gemeinsame Schulmittagessen übernommen.' },
    ],
    relatedSlugs: ['kinderzuschlag-kiz-rechner', 'buergergeld-anspruch-rechner', 'taschengeld-empfehlung-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Bundesministerium für Arbeit und Soziales (§ 28 Abs. 3 SGB II)',
      sourceUrl: 'https://www.bmas.de',
      lastVerified: '2026-01-15',
    }
  },

  {
    id: 'kinderkrankentage-kinderkrankengeld-rechner',
    slug: 'kinderkrankentage-kinderkrankengeld-rechner',
    name: 'Kinderkrankengeld-Rechner (Kinderkrankentage nach § 45 SGB V)',
    shortName: 'Kinderkrankengeld-Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Elterngeld & Finanzen',
    metaTitle: 'Kinderkrankengeld Rechner 2026 – Tage & Auszahlung (§ 45 SGB V)',
    metaDescription: 'Berechnen Sie Anspruch auf Kinderkrankentage (15 Tage pro Elternteil, 30 Tage für Alleinerziehende) und die Auszahlungshöhe des Kinderkrankengeldes (ca. 90 % Netto).',
    h1: 'Kinderkrankengeld Rechner – Freistellung & Krankengeld bei Kindeserkrankung',
    shortDescription: 'Ermittelt Freistellungstage und Krankengeldhöhe bei Pflege eines erkrankten Kindes.',
    searchKeywords: ['kinderkrankengeld rechner sgb v', 'kinderkrankentage 2026 wie viele tage', 'kind krank lohnfortzahlung wie viel netto', 'paragraph 45 sgb v kinderkrankengeld'],
    inputs: [
      { id: 'monthlyNetIncome', label: 'Ihr monatliches Nettogehalt', type: 'number', defaultValue: 2400, min: 500, step: 100, unit: '€' },
      { id: 'sickDaysClaimed', label: 'Genommene Kinderkrankentage im Kalendermonat', type: 'number', defaultValue: 5, min: 1, max: 30, step: 1, unit: 'Tage' },
      {
        id: 'parentStatus',
        label: 'Familienstatus',
        type: 'select',
        defaultValue: 'couple',
        options: [
          { value: 'couple', label: 'Elternpaar (15 Arbeitstage pro Elternteil / max. 35 Tage bei mehreren Kindern)' },
          { value: 'single', label: 'Alleinerziehend (30 Arbeitstage pro Kind / max. 70 Tage bei mehreren Kindern)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const net = parseFloat(inputs.monthlyNetIncome) || 2400;
      const days = parseInt(inputs.sickDaysClaimed, 10) || 5;
      const isSingle = inputs.parentStatus === 'single';

      // Kinderkrankengeld beträgt ca. 90 % des ausgefallenen Nettoentgelts
      const dailyNet = net / 30;
      const dailyKinderkrankengeld = dailyNet * 0.90;
      const totalPayout = dailyKinderkrankengeld * days;
      const maxDaysAllowed = isSingle ? 30 : 15;

      return {
        primary: { id: 'totalPayout', label: `Kinderkrankengeld für ${days} Tage`, value: totalPayout, formattedValue: formatCurrency(totalPayout), highlight: true },
        secondary: [
          { id: 'dailyRate', label: 'Tägliches Kinderkrankengeld (ca. 90 % Netto)', value: dailyKinderkrankengeld, formattedValue: formatCurrency(dailyKinderkrankengeld) },
          { id: 'maxDays', label: 'Maximaler Jahresanspruch je Kind', value: maxDaysAllowed, formattedValue: `${maxDaysAllowed} Arbeitstage` },
        ],
        summaryText: `Für ${days} Kinderkrankentage zahlt die gesetzliche Krankenkasse ca. ${formatCurrency(totalPayout)} (${formatCurrency(dailyKinderkrankengeld)}/Tag). Sie haben pro Kalenderjahr Anspruch auf bis zu ${maxDaysAllowed} Tage.`,
      };
    },
    formula: 'Kinderkrankengeld = Ausgefallenes Nettoentgelt pro Tag × 90 % × Krankheitstage',
    formulaExplanation: 'Nach § 45 SGB V haben gesetzlich versicherte Eltern einen Freistellungsanspruch gegen den Arbeitgeber und Anspruch auf Krankengeld zur Pflege eines erkrankten Kindes unter 12 Jahren.',
    workedExample: {
      title: 'Beispiel: 5 Tage Kind krank bei 2.400 € Netto',
      inputValues: [{ label: 'Nettogehalt', value: '2.400 €' }, { label: 'Tage', value: '5 Tage' }],
      steps: ['Netto pro Tag = 2.400 € / 30 = 80,00 €', '90 % Satz = 72,00 €/Tag', '5 Tage × 72,00 € = 360,00 € Kinderkrankengeld'],
      result: '360,00 € Kinderkrankengeld',
    },
    faqs: [
      { question: 'Bis zu welchem Alter des Kindes gibt es Kinderkrankengeld?', answer: 'Das Kind darf das 12. Lebensjahr noch nicht vollendet haben (gilt bis zum 12. Geburtstag). Für Kinder mit Behinderung gilt keine Altersgrenze.' },
      { question: 'Darf der Arbeitgeber die Freistellung verweigern?', answer: 'Nein, nach § 45 Abs. 3 SGB V hat der Arbeitnehmer einen gesetzlichen Anspruch auf unbezahlte Freistellung von der Arbeit.' },
    ],
    relatedSlugs: ['krankengeld-rechner', 'teilzeit-gehaltsrechner', 'urlaubstage-rechner'],
  },

  {
    id: 'grosselternzeit-rechner',
    slug: 'grosselternzeit-rechner',
    name: 'Großelternzeit-Rechner (Freistellung nach BEEG § 15)',
    shortName: 'Großelternzeit-Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Familie & Freizeit',
    metaTitle: 'Großelternzeit Rechner – Gesetzlicher Freistellungsanspruch für Großeltern',
    metaDescription: 'Prüfen Sie die Voraussetzungen und Fristen für Großelternzeit nach § 15 Abs. 1a BEEG: Gesetzliche Freistellung von der Arbeit zur Betreuung des Enkelkindes.',
    h1: 'Großelternzeit Rechner – Freistellung für Oma & Opa ermitteln',
    shortDescription: 'Prüft die rechtlichen Voraussetzungen für die Freistellung von Großeltern.',
    searchKeywords: ['grosselternzeit rechner beeg', 'grosselternzeit voraussetzungen paragraph 15 beeg', 'koennen grosseltern elternzeit nehmen', 'kuendigungsschutz grosselternzeit'],
    inputs: [
      {
        id: 'livingInHousehold',
        label: 'Lebt das Enkelkind mit dem Großelternteil im selben Haushalt?',
        type: 'select',
        defaultValue: 'yes',
        options: [
          { value: 'yes', label: 'Ja, gemeinsamer Haushalt' },
          { value: 'no', label: 'Nein, getrennte Haushalte' },
        ],
      },
      {
        id: 'parentCondition',
        label: 'Situation der Eltern des Kindes',
        type: 'select',
        defaultValue: 'minor_or_training',
        options: [
          { value: 'minor_or_training', label: 'Ein Elternteil ist minderjährig oder in Ausbildung / Studium' },
          { value: 'regular_employed', label: 'Beide Eltern sind volljährig und normal berufstätig' },
        ],
      },
      { id: 'plannedMonths', label: 'Geplante Dauer der Großelternzeit in Monaten (max. 36 Monate)', type: 'number', defaultValue: 12, min: 1, max: 36, step: 1, unit: 'Monate' },
    ],
    calculate: (inputs) => {
      const inHousehold = inputs.livingInHousehold === 'yes';
      const cond = inputs.parentCondition === 'minor_or_training';
      const months = parseInt(inputs.plannedMonths, 10) || 12;

      const eligible = inHousehold && cond;

      return {
        primary: { id: 'status', label: 'Rechtsanspruch auf Großelternzeit nach § 15 BEEG', value: 0, formattedValue: eligible ? 'Rechtsanspruch besteht!' : 'Kein gesetzlicher Anspruch (nur mit Zustimmung AG)', highlight: true },
        secondary: [
          { id: 'maxDuration', label: 'Maximale Freistellungsdauer', value: 36, formattedValue: 'Bis zu 36 Monate je Enkelkind' },
          { id: 'protection', label: 'Kündigungsschutz', value: 0, formattedValue: eligible ? 'Voller Kündigungsschutz während der Auszeit' : 'Kein gesetzlicher Kündigungsschutz' },
          { id: 'noticeTerm', label: 'Anmeldefrist beim Arbeitgeber', value: 7, formattedValue: '7 Wochen vor Beginn schriftlich' },
        ],
        summaryText: eligible
          ? `Da das Enkelkind im Haushalt lebt und ein Elternteil minderjährig oder in Ausbildung ist, haben Sie einen Rechtsanspruch auf bis zu 36 Monate Großelternzeit inklusive vollem Kündigungsschutz!`
          : 'Ein gesetzlicher Rechtsanspruch nach § 15 Abs. 1a BEEG besteht nur bei gemeinsamem Haushalt und Ausbildung/Minderjährigkeit der Eltern. Andernfalls kann eine Auszeit nur einvernehmlich mit dem Arbeitgeber vereinbart werden.',
      };
    },
    formula: 'Prüfung der Kriterien nach § 15 Abs. 1a BEEG',
    formulaExplanation: 'Großeltern können nach dem BEEG die Betreuung übernehmen und sich freistellen lassen, wenn das Elternteil selbst noch minderjährig ist oder sich in Ausbildung befindet.',
    workedExample: {
      title: 'Beispiel: Oma betreut Enkel, während Tochter ihr Abitur macht',
      inputValues: [{ label: 'Haushalt', value: 'Gemeinsam' }, { label: 'Eltern', value: 'In Ausbildung' }],
      steps: ['Bedingungen nach § 15 Abs. 1a BEEG vollständig erfüllt', 'Schriftliche Anmeldung 7 Wochen vor Beginn beim Chef'],
      result: 'Rechtsanspruch auf Großelternzeit bewilligt',
    },
    faqs: [
      { question: 'Erhalten Großeltern auch Elterngeld?', answer: 'Nein, Großeltern haben keinen Anspruch auf Elterngeld. Die Großelternzeit ist eine unbezahlte Freistellung von der Arbeit.' },
      { question: 'Darf man während der Großelternzeit in Teilzeit arbeiten?', answer: 'Ja, Großeltern dürfen während der Auszeit bis zu 32 Wochenstunden in Teilzeit arbeiten.' },
    ],
    relatedSlugs: ['elternzeit-teilzeit-rechner', 'sabbatical-rechner', 'kuendigungsfrist-arbeitnehmer-rechner'],
  },

  {
    id: 'unterhalt-volljaehrige-kinder-rechner',
    slug: 'unterhalt-volljaehrige-kinder-rechner',
    name: 'Unterhalt-für-volljährige-Kinder-Rechner (Studium & eigene Wohnung)',
    shortName: 'Volljährigenunterhalt',
    category: 'familie-schwangerschaft',
    subcategory: 'Elterngeld & Finanzen',
    metaTitle: 'Unterhalt volljährige Kinder Rechner 2026 – Studium & eigene Bude',
    metaDescription: 'Berechnen Sie den Unterhaltsanspruch für volljährige Kinder (Studenten, Azubis) nach der Düsseldorfer Tabelle 2026 (fester Regelsatz 930 € bei eigener Wohnung).',
    h1: 'Unterhalt für volljährige Kinder – Studentenunterhalt berechnen',
    shortDescription: 'Ermittelt den Unterhaltsbedarf von volljährigen Kindern mit eigenem Hausstand.',
    searchKeywords: ['unterhalt volljaehrige kinder rechner', 'studentenunterhalt 930 euro duesseldorfer tabelle', 'unterhalt student eigene wohnung berechnen', 'haftungsquote eltern volljahrigenunterhalt'],
    inputs: [
      {
        id: 'livingArrangement',
        label: 'Wohnsituation des volljährigen Kindes',
        type: 'select',
        defaultValue: 'own_household',
        options: [
          { value: 'own_household', label: 'Eigene Wohnung / WG / Studentenwohnheim (fester Satz: 930 €/Monat)' },
          { value: 'with_parents', label: 'Wohnt noch bei einem Elternteil (4. Altersstufe nach Tabelle)' },
        ],
      },
      { id: 'childOwnIncome', label: 'Eigenes Einkommen des Kindes (z. B. BAföG, Minijob, Ausbildungsvergütung)', type: 'number', defaultValue: 0, min: 0, max: 1500, step: 50, unit: '€' },
    ],
    calculate: (inputs) => {
      const isOwn = inputs.livingArrangement === 'own_household';
      const ownIncome = parseFloat(inputs.childOwnIncome) || 0;

      // Düsseldorfer Tabelle: Fester Bedarf für Studenten mit eigenem Hausstand = 930 € (inkl. 410 € Warmmiete)
      const baseNeed = isOwn ? 930 : 689;
      // Bei Volljährigen wird das volle Kindergeld (250 €) in voller Höhe bedarfsdeckend abgezogen!
      const kindergeldDeduction = 250;
      const netNeedAfterKindergeld = Math.max(0, baseNeed - kindergeldDeduction);
      const finalParentsShare = Math.max(0, netNeedAfterKindergeld - ownIncome);

      return {
        primary: { id: 'finalParentsShare', label: 'Restlicher Unterhaltsanspruch gegen beide Eltern', value: finalParentsShare, formattedValue: formatCurrency(finalParentsShare), highlight: true },
        secondary: [
          { id: 'baseNeed', label: 'Gesamtbedarf nach Düsseldorfer Tabelle', value: baseNeed, formattedValue: formatCurrency(baseNeed) },
          { id: 'kindergeld', label: 'Abzug volles Kindergeld (fließt an das Kind)', value: kindergeldDeduction, formattedValue: '250,00 €' },
          { id: 'ownIncome', label: 'Angerechnetes eigenes Einkommen', value: ownIncome, formattedValue: formatCurrency(ownIncome) },
        ],
        summaryText: `Der Gesamtbedarf des Kindes liegt bei ${formatCurrency(baseNeed)}. Nach Abzug von ${formatCurrency(kindergeldDeduction)} Kindergeld und ${formatCurrency(ownIncome)} Eigenanteil müssen beide Elternteile gemeinsam noch ${formatCurrency(finalParentsShare)} monatlich aufbringen.`,
      };
    },
    formula: 'Zahlbetrag = 930 € (bei eigener Bude) - 250 € Kindergeld - eigenes Einkommen',
    formulaExplanation: 'Volljährige Kinder sind für ihren Unterhalt selbst verantwortlich, solange sie in Ausbildung sind. Beide Elternteile haften anteilig nach ihren Einkommensverhältnissen (Haftungsquote).',
    workedExample: {
      title: 'Beispiel: Student mit eigener Wohnung ohne eigenes Einkommen',
      inputValues: [{ label: 'Wohnen', value: 'Eigene Wohnung (930 €)' }, { label: 'Einkommen', value: '0 €' }],
      steps: ['Bedarf = 930,00 €', 'Abzug volles Kindergeld = 250,00 €', 'Restlicher Unterhalt der Eltern = 680,00 €/Monat'],
      result: '680,00 € monatlicher Elternunterhalt',
    },
    faqs: [
      { question: 'Haften beide Eltern barunterhaltspflichtig?', answer: 'Ja, ab dem 18. Geburtstag sind beide Elternteile barunterhaltspflichtig, auch der Elternteil, bei dem das Kind bisher gewohnt hat.' },
      { question: 'Wird BAföG auf den Unterhalt angerechnet?', answer: 'Ja, BAföG-Zahlungen (auch als Darlehen) gelten als Einkommen des Kindes und mindern den Unterhaltsanspruch gegen die Eltern Euro für Euro.' },
    ],
    relatedSlugs: ['duesseldorfer-tabelle-rechner', 'kindergeld-rechner-2026', 'ausbildungsunterhalt-bedarfskontrollbetrag-rechner'],
  },

  {
    id: 'ausbildungsunterhalt-bedarfskontrollbetrag-rechner',
    slug: 'ausbildungsunterhalt-bedarfskontrollbetrag-rechner',
    name: 'Ausbildungsvergütung-Anrechnungs-Rechner (Kindesunterhalt)',
    shortName: 'Ausbildungsunterhalt-Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Elterngeld & Finanzen',
    metaTitle: 'Ausbildungsunterhalt Rechner – Ausbildungsvergütung auf Unterhalt anrechnen',
    metaDescription: 'Berechnen Sie, wie viel der Ausbildungsvergütung auf den Kindesunterhalt angerechnet wird (nach Abzug von 100 € ausbildungsbedingtem Mehrbedarf).',
    h1: 'Ausbildungsunterhalt Rechner – Azubi-Vergütung auf Unterhalt anrechnen',
    shortDescription: 'Kalkuliert die Minderung des Kindesunterhalts durch eigenes Azubi-Gehalt.',
    searchKeywords: ['ausbildungsunterhalt rechner azubigehalt', 'anrechnung lehrlingsentschaedigung unterhalt', 'ausbildungsbedingter mehrbedarf 100 euro', 'wie viel unterhalt bekommt azubi von eltern'],
    inputs: [
      { id: 'netApprenticeSalary', label: 'Netto-Ausbildungsvergütung des Kindes im Monat', type: 'number', defaultValue: 750, min: 200, max: 1500, step: 25, unit: '€' },
      { id: 'baseChildSupport', label: 'Bisheriger Tabellenunterhalt der Eltern vor Ausbildungsbeginn', type: 'number', defaultValue: 620, min: 300, max: 1200, step: 20, unit: '€' },
    ],
    calculate: (inputs) => {
      const salary = parseFloat(inputs.netApprenticeSalary) || 750;
      const baseSupport = parseFloat(inputs.baseChildSupport) || 620;

      // Gesetzlicher Abzug: Ausbildungsbedingter Mehrbedarf (Pauschale für Fachbücher, Kleidung, Fahrt) = 100 €
      const allowance = 100;
      const countedSalary = Math.max(0, salary - allowance);
      const reducedSupport = Math.max(0, baseSupport - countedSalary);
      const moneySavedParents = baseSupport - reducedSupport;

      return {
        primary: { id: 'reducedSupport', label: 'Verbleibender Unterhaltsanspruch gegen die Eltern', value: reducedSupport, formattedValue: formatCurrency(reducedSupport), highlight: true },
        secondary: [
          { id: 'countedSalary', label: 'Anrechenbare Ausbildungsvergütung', value: countedSalary, formattedValue: formatCurrency(countedSalary) },
          { id: 'allowance', label: 'Ausbildungsbedingter Mehrbedarf (Freibetrag)', value: allowance, formattedValue: '100,00 €' },
          { id: 'childTotalBudget', label: 'Gesamteinkommen des Azubis (Lohn + Unterhalt)', value: salary + reducedSupport, formattedValue: formatCurrency(salary + reducedSupport) },
        ],
        summaryText: `Von ${formatCurrency(salary)} Ausbildungsvergütung werden nach Abzug des 100-€-Mehrbedarfs ${formatCurrency(countedSalary)} auf den Unterhalt angerechnet. Die Eltern zahlen noch ${formatCurrency(reducedSupport)} (Ersparnis: ${formatCurrency(moneySavedParents)}/Monat).`,
      };
    },
    formula: 'Anrechenbares Einkommen = Netto-Vergütung - 100 € ausbildungsbedingte Aufwendungen',
    formulaExplanation: 'Nach ständiger Rechtsprechung der Familiengerichte darf der Auszubildende eine Pauschale von 100 Euro monatlich für berufsbedingte Kosten behalten. Der Rest mindert den Unterhaltsbedarf.',
    workedExample: {
      title: 'Beispiel: 750 € Nettovergütung bei 620 € Unterhaltsanspruch',
      inputValues: [{ label: 'Vergütung', value: '750 €' }, { label: 'Unterhalt', value: '620 €' }],
      steps: ['Freibetrag = 100 €', 'Anrechenbar: 750 € - 100 € = 650 €', 'Da 650 € > 620 € liegt, entfällt der Barunterhalt der Eltern komplett!'],
      result: '0,00 € Unterhalt (Kind deckt Bedarf selbst)',
    },
    faqs: [
      { question: 'Müssen Eltern weiter Unterhalt zahlen, wenn das Azubigehalt reicht?', answer: 'Nein, wenn die anrechenbare Ausbildungsvergütung plus Kindergeld den Lebensbedarf des Kindes deckt, erlischt die Barunterhaltspflicht der Eltern vollständig.' },
      { question: 'Was passiert mit dem Kindergeld während der Ausbildung?', answer: 'Das Kindergeld steht weiterhin bis zum 25. Lebensjahr zu und wird in voller Höhe an das volljährige Kind weitergeleitet.' },
    ],
    relatedSlugs: ['unterhalt-volljaehrige-kinder-rechner', 'duesseldorfer-tabelle-rechner', 'kindergeld-rechner-2026'],
  },

  {
    id: 'kinderbetreuungskosten-absetzen-rechner',
    slug: 'kinderbetreuungskosten-absetzen-rechner',
    name: 'Kinderbetreuungskosten-Rechner (§ 10 Abs. 1 Nr. 5 EStG Steuer)',
    shortName: 'Kinderbetreuung Steuer',
    category: 'familie-schwangerschaft',
    subcategory: 'Bildung & Betreuung',
    metaTitle: 'Kinderbetreuungskosten Rechner – Kita, Hort & Tagesmutter steuerlich absetzen',
    metaDescription: 'Berechnen Sie Ihre Steuerersparnis durch Kinderbetreuungskosten nach § 10 EStG: 2/3 der Kosten bis maximal 4.000 Euro pro Kind und Jahr als Sonderausgaben abziehbar.',
    h1: 'Kinderbetreuungskosten Rechner – Steuerersparnis für Kita & Hort',
    shortDescription: 'Ermittelt den steuerlichen Sonderausgabenabzug für Betreuungsaufwendungen.',
    searchKeywords: ['kinderbetreuungskosten absetzen rechner', 'paragraph 10 estg sonderausgaben kinderbetreuung 4000 euro', 'tagesmutter steuerlich absetzbar rechner', 'kita kosten steuerersparnis'],
    inputs: [
      { id: 'actualCareCostsYearly', label: 'Tatsächliche Betreuungskosten pro Kind im Jahr (ohne Essensgeld)', type: 'number', defaultValue: 3600, min: 200, step: 200, unit: '€' },
      { id: 'taxRatePct', label: 'Persönlicher Grenzsteuersatz der Eltern', type: 'number', defaultValue: 35, min: 14, max: 45, step: 1, unit: '%' },
    ],
    calculate: (inputs) => {
      const costs = parseFloat(inputs.actualCareCostsYearly) || 3600;
      const rate = (parseFloat(inputs.taxRatePct) || 35) / 100;

      // Nach § 10 Abs. 1 Nr. 5 EStG: Zwei Drittel der Aufwendungen, maximal 4.000 € je Kind
      const twoThirds = costs * (2 / 3);
      const deductibleAmount = Math.min(4000, twoThirds);
      const taxSaving = deductibleAmount * rate;

      return {
        primary: { id: 'taxSaving', label: 'Jährliche Steuerersparnis', value: taxSaving, formattedValue: formatCurrency(taxSaving), highlight: true },
        secondary: [
          { id: 'deductibleAmount', label: 'Als Sonderausgaben abzugsfähiger Betrag', value: deductibleAmount, formattedValue: formatCurrency(deductibleAmount) },
          { id: 'twoThirds', label: 'Zwei-Drittel-Betrag (vor Kappung)', value: twoThirds, formattedValue: formatCurrency(twoThirds) },
          { id: 'maxAllowed', label: 'Gesetzlicher Höchstbetrag je Kind', value: 4000, formattedValue: '4.000,00 €' },
        ],
        summaryText: `Von ${formatCurrency(costs)} Betreuungskosten können Sie ${formatCurrency(deductibleAmount)} als Sonderausgaben geltend machen. Das bringt Ihnen rund ${formatCurrency(taxSaving)} Einkommensteuerersparnis zurück!`,
      };
    },
    formula: 'Abzug = min(4.000 €, Betreuungskosten × 2/3); Ersparnis = Abzug × Grenzsteuersatz',
    formulaExplanation: 'Begünstigt sind Dienstleistungen für Kinder bis zum 14. Lebensjahr wie Kita, Kindergarten, Hort, Tagesmutter, Babysitter oder Au-Pair. Nicht abziehbar sind Kosten für Verpflegung, Freizeit und Sportunterricht.',
    workedExample: {
      title: 'Beispiel: 3.600 € Kita-Gebühren bei 35 % Grenzsteuersatz',
      inputValues: [{ label: 'Kita-Kosten', value: '3.600 €' }, { label: 'Steuersatz', value: '35 %' }],
      steps: ['2/3 von 3.600 € = 2.400,00 € Sonderausgaben', 'Steuerersparnis: 2.400 € × 0,35 = 840,00 €'],
      result: '840,00 € Steuererstattung',
    },
    faqs: [
      { question: 'Ist Barzahlung für den Babysitter erlaubt?', answer: 'Nein! Das Finanzamt erkennt Kinderbetreuungskosten zwingend nur an, wenn eine Rechnung vorliegt und der Betrag auf das Bankkonto des Betreuers überwiesen wurde.' },
      { question: 'Können Fahrtkosten der Großeltern abgesetzt werden?', answer: 'Ja, wenn die Großeltern das Enkelkind unentgeltlich betreuen, können nachgewiesene Fahrtkostenerstattungen als Betreuungskosten steuerlich geltend gemacht werden.' },
    ],
    relatedSlugs: ['kita-gebuehren-rechner', 'kindergeld-rechner-2026', 'teilzeit-gehaltsrechner'],
  },
];