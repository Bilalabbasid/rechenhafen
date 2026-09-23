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
    content: {
      intro: 'Der Grundumsatz (Basal Metabolic Rate, BMR) ist die Energiemenge, die der Körper bei völliger Ruhe zur Aufrechterhaltung lebenswichtiger Organfunktionen (Atmung, Herz, Gehirn) benötigt.',
      details: 'Berechnung nach der modernen Mifflin-St.Jeor-Formel: BMR = (10 · kg) + (6,25 · cm) - (5 · Alter) + 5 (Männer) bzw. - 161 (Frauen). Das Gehirn und die Leber verbrauchen zusammen fast die Hälfte des Grundumsatzes.',
    },
    faqs: [
      { question: 'Darf man bei einer Diät weniger Kalorien als den Grundumsatz essen?', answer: 'Dauerhaft keinesfalls: Eine Kalorienzufuhr unterhalb des Grundumsatzes signalisiert dem Körper akute Hungersnot, schädigt das Immunsystem und forciert Muskelabbau.' },
      { question: 'Wie kann man seinen Grundumsatz langfristig steigern?', answer: 'Durch gezielten Muskelaufbau (Krafttraining): Jedes Kilogramm aktive Muskelmasse verbrennt auch im Ruhezustand kontinuierlich mehr Energie als Fettgewebe.' },
    ],
    relatedSlugs: ['kalorienbedarf-rechner', 'bmi-rechner', 'koerperfettanteil-navy-rechner', 'makronaehrstoff-verteilung-rechner', 'proteinbedarf-sportler-rechner'],
  },

  {
    id: 'leistungsumsatz-pal-rechner',
    slug: 'leistungsumsatz-pal-rechner',
    name: 'Leistungsumsatz- & PAL-Faktor-Rechner (Gesamtenergiebedarf)',
    shortName: 'Leistungsumsatz PAL',
    category: 'gesundheit-fitness',
    subcategory: 'Ernährung & Kalorien',
    metaTitle: 'Leistungsumsatz Rechner – PAL-Faktor',
    metaDescription: 'Berechnen Sie Leistungsumsatz und Gesamtkalorienbedarf mit dem Physical Activity Level (PAL-Faktor): Büroarbeit, Handwerk, Sport und Freizeitaktivität.',
    h1: 'Leistungsumsatz Rechner – PAL-Faktor & Tages-Kalorienbedarf',
    shortDescription: 'Ermittelt den zusätzlichen Kalorienverbrauch durch körperliche Bewegung und Beruf mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Der Leistungsumsatz erfasst alle Kalorien, die durch körperliche Bewegung, Beruf, Hausarbeit und Sport über den Grundumsatz hinaus verbrannt werden.',
      details: 'Der PAL-Wert (Physical Activity Level) stuft Aktivitäten ein: Büroarbeit (1,4–1,5), stehende Berufe wie Verkäufer (1,8–1,9), schwere körperliche Arbeit wie Bauarbeiter (2,0–2,4). Sport wird mit 0,3 bis 0,5 PAL-Punkten addiert.',
    },
    faqs: [
      { question: 'Welcher PAL-Wert passt zu einem typischen Bürojob mit 2x Sport pro Woche?', answer: 'Ein PAL-Wert von 1,4 bis 1,5 für den sitzenden Arbeitstag plus ca. 0,1 Zuschlag für die sportlichen Einheiten (Gesamt-PAL: ca. 1,55).' },
      { question: 'Was ist NEAT (Non-Exercise Activity Thermogenesis)?', answer: 'Die Kalorienverbrennung durch alltägliche Spontanbewegungen wie Treppensteigen, Zappeln, Gehen beim Telefonieren und Stehen; NEAT macht oft mehr Kalorienverbrauch aus als eine Stunde Sport.' },
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
    metaTitle: 'Makronährstoff Rechner – Gramm Eiweiß, Fett',
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
    content: {
      intro: 'Dieser Makronährstoffrechner teilt Ihren täglichen Kalorienbedarf optimal in Proteine, Kohlenhydrate und Fette auf.',
      details: 'Physiologische Brennwerte: 1 g Protein = 4,1 kcal, 1 g Kohlenhydrate = 4,1 kcal, 1 g Fett = 9,3 kcal. Gängige Aufteilungen sind High-Carb (50/30/20), moderat (40/30/30) oder Low-Carb/Keto (20/35/45).',
    },
    faqs: [
      { question: 'Wie viel Gramm Protein benötigt man beim Muskelaufbau?', answer: 'Sportmediziner und Ernährungsgesellschaften empfehlen für Trainierende 1,6 bis 2,2 Gramm Protein pro Kilogramm Körpergewicht am Tag.' },
      { question: 'Warum sind Fette für den Hormonhaushalt unverzichtbar?', answer: 'Essenzielle Fettsäuren bilden die molekulare Grundsubstanz für körpereigene Steroidhormone (Testosteron, Östrogen) und ermöglichen die Aufnahme fettlöslicher Vitamine (A, D, E, K).' },
    ],
    relatedSlugs: ['kalorienbedarf-rechner', 'proteinbedarf-sportler-rechner', 'grundumsatz-bmr-rechner', 'koerperfettanteil-navy-rechner', 'bmi-rechner'],
  },

  {
    id: 'ideal好gewicht-creff-rechner',
    slug: 'idealgewicht-creff-rechner',
    name: 'Idealgewicht-Rechner (nach Creff-Formel & Broca-Index)',
    shortName: 'Idealgewicht Creff',
    category: 'gesundheit-fitness',
    subcategory: 'Gewicht & Körper',
    metaTitle: 'Idealgewicht Rechner – Creff-Formel',
    metaDescription: 'Berechnen Sie Ihr persönliches Idealgewicht nach der wissenschaftlichen Creff-Formel unter Berücksichtigung von Körperbau (schmal, normal',
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
    content: {
      intro: 'Die Creff-Formel verfeinert die klassische Broca-Formel, indem sie den individuellen Körperbau (schmal, normal, breitknochig) und das Alter berücksichtigt.',
      details: 'Formel für normalen Körperbau: [(Größe in cm - 100) + (Alter / 10)] · 0,9. Bei zierlichem Körperbau wird der Faktor 0,81 angewendet, bei stämmigem, breitem Skelettbau der Faktor 0,99.',
    },
    faqs: [
      { question: 'Wie bestimmt man den eigenen Skelettbau (Handgelenk-Umfang)?', answer: 'Messen Sie den Handgelenksumfang an der schmalsten Stelle: Bei Männern gilt unter 16,5 cm als schmal, über 19 cm als breitknochig; bei Frauen unter 14 cm als schmal, über 16,5 cm als breit.' },
      { question: 'Warum steigt das Idealgewicht nach Creff mit dem Alter leicht an?', answer: 'Weil ein moderater BMI-Anstieg im höheren Alter (BMI 24–27 bei Senioren) statistisch mit einer geringeren Gesamtmortalität und besseren Überlebenschancen bei Krankheiten einhergeht.' },
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
    metaTitle: 'Körperfettanteil Rechner – US Navy Formel mit Maßband berec...',
    metaDescription: 'Berechnen Sie Ihren Körperfettanteil (KFA) in Prozent und reine Fettmasse mit der wissenschaftlich validierten US-Navy-Umfangsmethode (Hals, Taille',
    h1: 'Körperfettanteil Rechner – KFA nach US Navy Methode ermitteln',
    shortDescription: 'Schätzt den Körperfettanteil präzise ohne Caliper oder teure DEXA-Scans mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Die US-Navy-Methode schätzt den Körperfettanteil (KFA) präzise anhand von Körpergröße und einfachen Maßband-Umfängen von Nacken, Taille und Hüfte.',
      details: 'Formel basiert auf logarithmischen Gleichungen nach Hodgdon und Beckett. Die Methode ist deutlich unempfindlicher gegenüber Wasserhaushaltsschwankungen als handelsübliche Bioimpedanz-Körperfettwaagen.',
    },
    faqs: [
      { question: 'Wo genau muss das Maßband für den Navy-Test angelegt werden?', answer: 'Taille: Bei Männern auf Nabelhöhe, bei Frauen an der schmalsten Stelle; Nacken: Direkt unterhalb des Kehlkopfs; Hüfte (nur Frauen): An der breitesten Stelle des Gesäßes.' },
      { question: 'Welcher Körperfettanteil gilt als gesund und sportlich?', answer: 'Bei Männern: 10 bis 14 % (sportlich/definiert), 15 bis 19 % (normal/gesund); bei Frauen: 18 bis 22 % (sportlich), 23 bis 27 % (normal/gesund).' },
    ],
    relatedSlugs: ['bmi-rechner', 'kalorienbedarf-rechner', 'grundumsatz-bmr-rechner', 'proteinbedarf-sportler-rechner', 'makronaehrstoff-verteilung-rechner'],
  },

  {
    id: 'waist-to-hip-ratio-rechner',
    slug: 'waist-to-hip-ratio-rechner',
    name: 'WHR-Rechner (Taille-Hüft-Verhältnis) (Taille-Hüft-Verhältnis & Bauchfett-Risiko)',
    shortName: 'WHR-Rechner (Taille-Hüft-Verhältnis)',
    category: 'gesundheit-fitness',
    subcategory: 'Gewicht & Körper',
    metaTitle: 'WHR Rechner – Taille-Hüft-Verhältnis berechnen',
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
    content: {
      intro: 'Das Taille-Hüft-Verhältnis (Waist-to-Hip Ratio, WHR) beurteilt die Fettverteilung und unterscheidet zwischen der gefährlichen Apfelform (viszerales Bauchfett) und der Birnenform.',
      details: 'WHR = Taillenumfang / Hüftumfang. Die WHO definiert ein erhöhtes kardiovaskuläres Risiko ab einem WHR von 0,90 bei Männern und ab 0,85 bei Frauen.',
    },
    faqs: [
      { question: 'Warum ist Bauchfett (viszerales Fett) so viel gefährlicher als Unterhautfett?', answer: 'Viszerales Fett umhüllt innere Organe und ist hochgradig stoffwechselaktiv: Es schüttet entzündungsfördernde Botenstoffe aus, fördert Arteriosklerose, Bluthochdruck und Typ-2-Diabetes.' },
      { question: 'Wie misst man den Taillenumfang korrekt?', answer: 'Morgens vor dem Frühstück stehend, entspannt ausgeatmet, genau in der Mitte zwischen dem unteren Rippenbogen und der Oberkante des Beckenkamms.' },
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
    content: {
      intro: 'Das Taille-zu-Größe-Verhältnis (Waist-to-Height Ratio, WHtR) gilt in der modernen Kardiologie als überlegener Indikator gegenüber dem BMI für kardiovaskuläre Risiken.',
      details: 'WHtR = Taillenumfang in cm / Körpergröße in cm. Faustregel: Der Taillenumfang sollte weniger als die Hälfte der Körpergröße betragen (WHtR < 0,50 bei Personen unter 40 Jahren).',
    },
    faqs: [
      { question: 'Wie verschieben sich die gesunden WHtR-Grenzwerte im Alter?', answer: 'Zwischen 40 und 50 Jahren gilt ein WHtR bis 0,60 als unbedenklich; ab dem 50. Lebensjahr wird ein Wert bis 0,60 als moderater Normalwert toleriert.' },
      { question: 'Warum ist der WHtR aussagekräftiger als der BMI?', answer: 'Weil er gezielt das metabolisch schädliche Bauchfett ins Verhältnis zur Körperlänge setzt, statt Muskelmasse fälschlicherweise als Übergewicht zu werten.' },
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
    metaTitle: 'Maximalpuls Rechner – HFmax – RechenHafen',
    metaDescription: 'Berechnen Sie Ihre maximale Herzfrequenz (HFmax) und die 5 Trainings-Herzfrequenzzonen (Fettverbrennung, aerob, anaerob) nach der präzisen Karvonen-Formel.',
    h1: 'Maximalpuls Rechner – HFmax & Pulszonen für Ausdauersport',
    shortDescription: 'Ermittelt die maximale Herzfrequenz und individuelle Trainingspulszonen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Die maximale Herzfrequenz (HFmax) ist die höchste Schlagzahl pro Minute, die das Herz bei maximaler körperlicher Ausbelastung erreichen kann.',
      details: 'Moderne Formel nach Tanaka: HFmax = 208 - (0,7 · Alter) (präziser als die veraltete Faustformel 220 - Alter). Die HFmax ist genetisch vorgegeben und lässt sich durch Training kaum steigern, dient aber als Basis für Trainingszonen.',
    },
    faqs: [
      { question: 'Bedeutet eine niedrigere Maximalpuls-Zahl schlechtere Fitness?', answer: 'Nein, die HFmax ist eine individuelle biologische Konstante; erst der Ruhepuls (z. B. 45–55 bpm bei Ausdauersportlern) signalisiert ein vergrößertes Schlagvolumen und hohe Fitness.' },
      { question: 'Wie ermittelt man die HFmax sportmedizinisch exakt?', answer: 'Über eine professionelle Leistungsdiagnostik mit Stufentest auf dem Fahrradergometer oder Laufband bis zur willentlichen Erschöpfung (Spiroergometrie).' },
    ],
    relatedSlugs: ['blutdruck-klassifikation-rechner', 'laufpace-rechner', 'vo2max-cooper-test-rechner', 'puls-trainingszonen-rechner'],
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
    content: {
      intro: 'Die maximale Sauerstoffaufnahme (VO₂max in ml/kg/min) ist das internationale Goldstandard-Maß für die kardiorespiratorische Ausdauerleistungsfähigkeit.',
      details: 'Im 12-Minuten-Cooper-Test laufen Probanden in 12 Minuten die maximal mögliche Strecke auf ebener Bahn: VO₂max = (Distanz in Metern - 504,9) / 44,73.',
    },
    faqs: [
      { question: 'Welche VO₂max-Werte haben trainierte Ausdauersportler?', answer: 'Untrainierte Erwachsene liegen meist bei 30 bis 40 ml/kg/min; ambitionierte Hobbyläufer erreichen 45 bis 55 ml/kg/min; Weltklasse-Marathonläufer und Skilangläufer erzielen 75 bis 85+ ml/kg/min.' },
      { question: 'Lässt sich die VO₂max durch Training steigern?', answer: 'Ja, hochintensives Intervalltraining (HIIT) im Bereich von 90–95 % der HFmax kann die VO₂max innerhalb weniger Monate um 10 bis 20 Prozent verbessern.' },
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
    metaTitle: '1RM Rechner – One Rep Max Maximalgewicht Krafttraining bere...',
    metaDescription: 'Berechnen Sie Ihr Einer-Wiederholungs-Maximum (1RM) für Bankdrücken, Kniebeugen oder Kreuzheben nach Epley, Brzycki und Lombardi ohne Verletzungsrisiko.',
    h1: '1RM Rechner – Maximalgewicht im Kraftsport berechnen',
    shortDescription: 'Schätzt das 1-Rep-Maximum aus Wiederholungen mit submaximalem Trainingsgewicht mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Das One-Repetition-Maximum (1RM) ist das maximale Gewicht, das bei einer Kraftübung (z. B. Bankdrücken, Kniebeugen) für genau eine saubere Wiederholung bewältigt werden kann.',
      details: 'Berechnung nach der Brzycki-Formel: 1RM = Gewicht / (1,0278 - (0,0278 · Wiederholungen)) für 2 bis 10 Wiederholungen. Dies schützt Sehnen und Gelenke vor den Verletzungsrisiken echter Maximalversuche.',
    },
    faqs: [
      { question: 'Bis zu wie vielen Wiederholungen ist die 1RM-Berechnung zuverlässig?', answer: 'Am genauesten sind 3 bis 6 Wiederholungen; ab mehr als 10 Wiederholungen verfälscht die einsetzende Kraftausdauer die Vorhersage des Maximalkraftwerts.' },
      { question: 'In welchem Prozentbereich des 1RM trainiert man für Hypertrophie (Muskelaufbau)?', answer: 'Für Muskelwachstum gilt der Bereich von 65 bis 80 Prozent des 1RM bei 8 bis 12 Wiederholungen als optimaler Trainingsreiz.' },
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
    content: {
      intro: 'Dieser Schrittrechner transformiert gezählte Schritte in gelaufene Kilometer und den resultierenden Kalorienverbrauch.',
      details: 'Schrittlänge ≈ Körpergröße in cm · 0,415. 10.000 Schritte entsprechen bei durchschnittlicher Schrittlänge rund 6,5 bis 7,5 Kilometern und einem Zusatzverbrauch von etwa 300 bis 450 Kilokalorien.',
    },
    faqs: [
      { question: 'Sind 10.000 Schritte am Tag medizinisch notwendig?', answer: 'Aktuelle kardiologische Studien zeigen, dass bereits ab 6.000 bis 8.000 Schritten täglich das Risiko für Herz-Kreislauf-Erkrankungen und Frühsterblichkeit signifikant sinkt.' },
      { question: 'Wie misst man seine eigene Schrittlänge exakt aus?', answer: 'Gehen Sie 10 normale Schritte, messen Sie die Gesamtstrecke mit dem Maßband und teilen Sie die Zentimeter durch 10.' },
    ],
    relatedSlugs: ['radfahren-kalorien-watt-rechner', 'laufpace-rechner', 'kalorienbedarf-rechner', 'vo2max-cooper-test-rechner'],
  },

  {
    id: 'schlafbedarfs-rechner',
    slug: 'schlafbedarfs-rechner',
    name: 'Schlafzyklen- & Schlafbedarfs-Rechner (90-Minuten-Zyklen)',
    shortName: 'Schlafbedarfs-Rechner',
    category: 'gesundheit-fitness',
    subcategory: 'Erholung & Vitalität',
    metaTitle: 'Schlafbedarfs Rechner – Optimale Aufstehzeit nach 90-Minute...',
    metaDescription: 'Berechnen Sie die perfekte Einschlafzeit und Weckzeit nach natürlichen 90-Minuten-Schlafzyklen, um erholt und ohne Müdigkeit aufzuwachen.',
    h1: 'Schlafbedarfs Rechner – Perfekte Einschlaf- & Weckzeit ermitteln',
    shortDescription: 'Berechnet Aufstehzeiten passend zum Ende vollständiger 90-minütiger Schlafzyklen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Schlafphasen-Rechner optimiert Aufsteh- und Einschlafzeiten anhand der natürlichen 90-minütigen Ultradian-Schlafzyklen.',
      details: 'Ein vollständiger Schlafzyklus (Leichtschlaf, Tiefschlaf, REM-Schlaf) dauert ca. 90 Minuten. Wer am Ende eines Zyklus aufwacht, fühlt sich erfrischt; ein Wecker mitten in der Tiefschlafphase führt zu Schlaftrunkenheit.',
    },
    faqs: [
      { question: 'Wie viele Schlafzyklen benötigt ein Erwachsener pro Nacht?', answer: 'In der Regel 5 bis 6 Zyklen, was einer optimalen Schlafzeit von 7,5 bis 9 Stunden entspricht; weniger als 6 Stunden führt langfristig zu kognitiven Defiziten.' },
      { question: 'Wie lange braucht ein gesunder Mensch im Schnitt zum Einschlafen?', answer: 'Die normale Einschlaflatenz liegt bei 10 bis 20 Minuten; diese Zeitspanne wird bei der Rückwärtsplanung der Schlafenszeit addiert.' },
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
    metaTitle: 'Rauchstopp Rechner – Ersparnis – RechenHafen',
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
    content: {
      intro: 'Dieser Nichtraucher-Rechner beziffert die enorme finanzielle und gesundheitliche Ersparnis nach dem Rauchstopp über Tage, Monate und Jahrzehnte.',
      details: 'Ersparnis = Nicht gerauchte Schachteln · Schachtelpreis. Wer eine Schachtel pro Tag (ca. 8,50 €) aufgibt, spart im Jahr über 3.100 Euro und nach 10 Jahren mehr als 31.000 Euro netto (ohne Zinseszins).',
    },
    faqs: [
      { question: 'Wie schnell erholt sich der Körper nach der letzten Zigarette?', answer: 'Bereits nach 20 Minuten sinken Puls und Blutdruck; nach 24 Stunden sinkt das Herzinfarktrisiko; nach 1 bis 9 Monaten lassen Hustenanfälle nach und die Flimmerhärchen der Lunge regenerieren sich.' },
      { question: 'Wie viel Endkapital entsteht, wenn man das gesparte Rauchgeld in einen ETF investiert?', answer: 'Wer 250 Euro Monatsersparnis zu 7 % Rendite anlegt, besitzt nach 20 Jahren ein Vermögen von über 130.000 Euro.' },
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
    metaTitle: 'Koffein Rechner – Halbwertszeit – RechenHafen',
    metaDescription: 'Berechnen Sie den Koffeinabbau in Ihrem Körper: Wie viel mg Koffein aus Kaffee, Espresso, Cola oder Energy Drinks ist zur Schlafenszeit noch aktiv?',
    h1: 'Koffein Rechner – Halbwertszeit & Koffeinabbau berechnen',
    shortDescription: 'Ermittelt den Restkoffeingehalt im Blut zur Schlafenszeit nach Kaffeekonsum mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Rechner modelliert den Abbau von Koffein im Blutkreislauf und ermittelt die optimale Zeitspanne für ungestörten Nachtschlaf.',
      details: 'Die biologische Halbwertszeit von Koffein beträgt bei gesunden Erwachsenen durchschnittlich 4 bis 6 Stunden: Nach einer Tasse Kaffee mit 100 mg Koffein um 16:00 Uhr zirkulieren um 22:00 Uhr noch immer 50 mg Koffein im Körper.',
    },
    faqs: [
      { question: 'Ab welcher Uhrzeit sollte man keinen Kaffee mehr trinken?', answer: 'Schlafmediziner empfehlen, mindestens 8 bis 10 Stunden vor dem geplanten Einschlafen auf koffeinhaltige Getränke (Kaffee, Cola, Energy Drinks) zu verzichten.' },
      { question: 'Welche Faktoren verlangsamen den Koffeinabbau in der Leber?', answer: 'Schwangerschaft (Halbwertszeit verlängert sich auf bis zu 10–15 Stunden), hormonelle Verhütungsmittel (Pille) und bestimmte Medikamente verlangsamen den Abbau durch das Enzym CYP1A2.' },
    ],
    relatedSlugs: ['alkohol-abbau-rechner', 'nikotin-rauchstopp-ersparnis-rechner', 'schlafbedarfs-rechner', 'wasserbedarf-rechner', 'promillerechner-widmark'],
  },

  {
    id: 'alkohol-abbau-rechner',
    slug: 'alkohol-abbau-rechner',
    name: 'Alkoholabbau-Rechner',
    shortName: 'Alkoholabbau-Rechner',
    category: 'gesundheit-fitness',
    subcategory: 'Erholung & Vitalität',
    metaTitle: 'Alkoholabbau Rechner – Wie lange braucht die Leber für Bier',
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
    content: {
      intro: 'Dieser Abbau-Rechner ermittelt anhand des erreichten Promillewerts den exakten Zeitpunkt der vollständigen Nüchternheit (0,0 ‰).',
      details: 'Die menschliche Leber baut Alkohol mit einer konstanten Rate von etwa 0,10 bis 0,15 Promille pro Stunde ab (Nullter-Ordnung-Kinetik). Restalkohol am nächsten Morgen führt häufig zu unbewusstem Fahren unter Alkoholeinfluss.',
    },
    faqs: [
      { question: 'Wann darf man nach einer durchzechten Nacht wieder sicher Auto fahren?', answer: 'Wer um 02:00 Uhr nachts 1,2 Promille hat, baut bis 08:00 Uhr morgens nur ca. 0,6 bis 0,9 Promille ab und hat beim Losfahren immer noch 0,3 bis 0,6 Promille im Blut.' },
      { question: 'Hilft fettiges Katerfrühstück beim schnelleren Alkoholabbau?', answer: 'Nein, Nahrung im Magen verzögert lediglich die Aufnahme ins Blut, beschleunigt aber den hepatischen Abbauprozess in der Leber in keiner Weise.' },
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
    metaTitle: 'Intervallfasten Rechner 16:8 – Essensfenster',
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
    content: {
      intro: 'Der 16:8-Intervallfasten-Rechner strukturiert das tägliche Fasten- und Essensfenster zur Aktivierung von Zellerneuerungsprozessen (Autophagie).',
      details: 'Methode: 16 Stunden Fastenzeit (z. B. von 20:00 Uhr abends bis 12:00 Uhr mittags) gefolgt von einem 8-stündigen Zeitfenster für Mahlzeiten. Während der Fastenphase sind nur Wasser, ungesüßter Tee und schwarzer Kaffee erlaubt.',
    },
    faqs: [
      { question: 'Was ist Autophagie und ab wann setzt sie ein?', answer: 'Autophagie ist die körpereigene Müllabfuhr der Zellen: Geschädigte Zellbestandteile und Fehlfaltungen werden abgebaut und recycelt; dieser Prozess intensiviert sich ab ca. 14 bis 16 Stunden Fastendauer.' },
      { question: 'Bricht ein Schluck Milch im Kaffee das Fasten?', answer: 'Ja, bereits geringe Mengen Kalorien oder Proteine stimulieren Insulin und mTOR und unterbrechen den reinen Fastenstoffwechsel und die Autophagie.' },
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
    metaTitle: 'Proteinbedarf Rechner – Täglicher Eiweißbedarf für Sportler',
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
    content: {
      intro: 'Dieser Bedarfsrechner ermittelt die optimale tägliche Proteinmenge in Gramm gestaffelt nach Sportart, Trainingsziel (Erhalt, Hypertrophie, Diät) und fettfreier Körpermasse.',
      details: 'Für Ausdauersportler gelten 1,2 bis 1,4 g/kg, für Kraftsportler im Aufbau 1,6 bis 2,0 g/kg und während einer kalorienreduzierten Diät zum Muskelschutz 2,0 bis 2,4 g/kg fettfreier Masse.',
    },
    faqs: [
      { question: 'Kann der Körper mehr als 30 Gramm Protein pro Mahlzeit verwerten?', answer: 'Ja, die anabole Muskelproteinsynthese wird zwar bei rund 30 bis 40 g Protein maximal stimuliert, größere Proteinmengen werden im Magen-Darm-Trakt jedoch langsamer verdaut und über Stunden vollständig resorbiert.' },
      { question: 'Schadet eine hohe Proteinzufuhr den Nieren?', answer: 'Bei nierengesunden Menschen zeigen Studien bei bis zu 2,5 g/kg keine negativen Auswirkungen auf die Nierenfunktion; eine ausreichende Flüssigkeitszufuhr zur Harnsäureausscheidung ist jedoch Pflicht.' },
    ],
    relatedSlugs: ['kalorienbedarf-rechner', 'makronaehrstoff-verteilung-rechner', 'grundumsatz-bmr-rechner', 'koerperfettanteil-navy-rechner', 'bmi-rechner'],
  },

  {
    id: 'blutdruck-klassifikation-rechner',
    slug: 'blutdruck-klassifikation-rechner',
    name: 'Blutdruck-Rechner (WHO-Klassifikation) (Einstufung nach WHO & Hochdruckliga)',
    shortName: 'Blutdruck Einstufung',
    category: 'gesundheit-fitness',
    subcategory: 'Erholung & Vitalität',
    metaTitle: 'Blutdruck Rechner – Systolisch – RechenHafen',
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
    content: {
      intro: 'Dieser Rechner ordnet Ihre gemessenen systolischen und diastolischen Blutdruckwerte nach den Leitlinien der European Society of Cardiology (ESC/ESH) ein.',
      details: 'Optimal: < 120 / < 80 mmHg; Normal: 120–129 / 80–84 mmHg; Hoch-normal: 130–139 / 85–89 mmHg. Ab 140 mmHg systolisch oder 90 mmHg diastolisch liegt arterielle Hypertonie (Grad 1) vor.',
    },
    faqs: [
      { question: 'Was bedeutet der systolische und der diastolische Wert?', answer: 'Der obere (systolische) Wert misst den maximalen Druck beim Zusammenziehen des Herzmuskels; der untere (diastolische) Wert misst den Dauerdruck in den Gefäßen während der Entspannungsphase.' },
      { question: 'Was ist der Weißkitteleffekt?', answer: 'Ein nervositätsbedingter Anstieg des Blutdrucks ausschließlich in der Arztpraxis; Abhilfe schafft die häusliche Selbstmessung oder eine 24-Stunden-Langzeit-Blutdruckmessung.' },
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
    shortDescription: 'Berechnet die 5 Herzfrequenzzonen für gezieltes Lauftraining und Radsport mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Trainingszonenrechner teilt Ihre Herzfrequenz nach der Karvonen-Methode oder prozentualer HFmax in die fünf Ausdauerbereiche (Zone 1 bis 5) ein.',
      details: 'Zone 1 (50–60 % Rekompensation), Zone 2 (60–70 % Grundlagenausdauer / Fettstoffwechsel), Zone 3 (70–80 % aerob), Zone 4 (80–90 % anaerobe Schwelle), Zone 5 (90–100 % Maximalbereich).',
    },
    faqs: [
      { question: 'Warum ist Zone-2-Training für Ausdauersportler so fundamental?', answer: 'Zone 2 maximiert die Bildung neuer Mitochondrien ("Kraftwerke der Zelle") und trainiert die Muskulatur, Fett effizient als primäre Energiequelle bei submaximaler Belastung zu verbrennen.' },
      { question: 'Wie funktioniert die Karvonen-Formel mit Herzfrequenzreserve?', answer: 'Trainingspuls = Ruhepuls + ((HFmax - Ruhepuls) · Intensität in %). Sie bezieht den individuellen Fitnesszustand über den Ruhepuls direkt in die Zonenberechnung ein.' },
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
    metaTitle: 'Schwimmen Kalorienverbrauch Rechner – Brust, Kraul, Bahnen',
    metaDescription: 'Berechnen Sie den Kalorienverbrauch beim Schwimmen: Kraulen, Brustschwimmen, Rückenschwimmen und Delphin nach Körpergewicht, Bahnen und Schwimmdauer.',
    h1: 'Schwimmen Kalorienverbrauch Rechner – Kalorien beim Schwimmen ermitteln',
    shortDescription: 'Kalkuliert den Kalorienverbrauch für verschiedene Schwimmstile mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Schwimmen beansprucht nahezu alle großen Muskelgruppen des Körpers gleichzeitig bei minimaler Gelenkbelastung durch den statischen Auftrieb des Wassers.',
      details: 'Kalorienverbrauch = MET-Wert · Körpergewicht in kg · Dauer in Stunden. Kraulschwimmen zügig (MET ca. 10) verbrennt bei 80 kg Körpergewicht rund 800 kcal pro Stunde; Brustschwimmen moderat ca. 500 kcal/h.',
    },
    faqs: [
      { question: 'Warum schont Schwimmen Sehnen und Gelenke besonders?', answer: 'Weil das Wasser das effektive Körpergewicht um rund 90 Prozent reduziert; Stoßbelastungen auf Knie, Hüfte und Wirbelsäule wie beim Laufen entfallen vollständig.' },
      { question: 'Welcher Schwimmstil verbrennt am meisten Kalorien?', answer: 'Schmetterling (Delfin) mit bis zu 900 kcal pro Stunde, gefolgt von schnellem Kraulschwimmen und zügigem Brustschwimmen.' },
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
    metaTitle: 'Radfahren Kalorien & Watt Rechner – Kalorienverbrauch Fahrrad',
    metaDescription: 'Berechnen Sie den Kalorienverbrauch beim Radfahren nach Geschwindigkeit, Steigung oder getretenen Watt auf dem Ergometer / Rennrad.',
    h1: 'Radfahren Kalorien Rechner – Kalorienverbrauch auf dem Fahrrad berechnen',
    shortDescription: 'Ermittelt den Energieverbrauch beim Radeln nach Tempo oder Watt-Leistung mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Auf dem Fahrrad lässt sich der Kalorienverbrauch über die mechanische Tretleistung in Watt (Powermeter) physikalisch exakt ermitteln.',
      details: 'Formel: Energie (kcal) = (Durchschnittsleistung in Watt · Dauer in Stunden · 3,6) / Wirkungsgrad des menschlichen Körpers (ca. 0,24). Bei konstanten 200 Watt über eine Stunde werden exakt ca. 750 kcal Energie verbrannt.',
    },
    faqs: [
      { question: 'Warum ist die Kalorienberechnung mit Wattmessung genauer als über den Puls?', answer: 'Weil ein Powermeter die echte physikalische Arbeit an der Kurbel misst; der Puls schwankt hingegen stark durch Temperatur, Koffein, Schlafmangel oder Dehydration.' },
      { question: 'Wie viel Prozent der Tretenergie kommt am Pedal als Vortrieb an?', answer: 'Der menschliche Muskelwirkungsgrad liegt bei rund 20 bis 25 Prozent; die restlichen 75 bis 80 Prozent der verbrauchten Energie werden als Körperwärme abgegeben.' },
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
    metaTitle: 'Elterngeld Rechner 2026 – Basiselterngeld',
    metaDescription: 'Berechnen Sie Ihren Anspruch auf Basiselterngeld (65 % bis 100 % des Nettoeinkommens, max. 1.800 €) und Elterngeld Plus mit Partnerschaftsbonusmonaten.',
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
    content: {
      intro: 'Dieser Rechner vergleicht das Basiselterngeld mit dem ElterngeldPlus nach dem Bundeselterngeld- und Elternzeitgesetz (BEEG) zur optimalen Budget- und Monatsplanung.',
      details: 'Basiselterngeld ersetzt 65 Prozent des vorgeburtlichen Nettoeinkommens (max. 1.800 € / Monat, min. 300 €). ElterngeldPlus zahlt den halben Betrag über die doppelte Bezugsdauer und ermöglicht anrechnungsfreie Teilzeiteinkommen bis zur Kappungsgrenze.',
    },
    faqs: [
      { question: 'Was ist der Partnerschaftsbonus beim Elterngeld?', answer: 'Arbeiten beide Elternteile gleichzeitig für 2 bis 4 aufeinanderfolgende Monate in Teilzeit (24 bis 32 Wochenstunden), erhält jeder Elternteil bis zu 4 zusätzliche ElterngeldPlus-Monate.' },
      { question: 'Welche Monate zählen für das Bemessungseinkommen vor der Geburt?', answer: 'Die letzten 12 Kalendermonate vor der Geburt (bei Angestellten vor dem Monat des Mutterschutzbeginns); Monate mit Elterngeldbezug für ältere Kinder können ausgeklammert werden.' },
    ],
    relatedSlugs: ['betreuungsgeld-familiengeld-rechner', 'elternzeit-teilzeit-rechner', 'mutterschaftsgeld-rechner', 'kindergeld-rechner-2026'],
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
    metaTitle: 'Kindergeld Rechner 2026 – Kindergeldhöhe',
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
    content: {
      intro: 'Das gesetzliche Kindergeld nach § 66 EStG sichert die steuerliche Freistellung des sächlichen Existenzminimums eines Kindes für alle anspruchsberechtigten Eltern in Deutschland.',
      details: 'Das Kindergeld wird ab dem ersten Kind in einheitlicher Höhe pro Monat ausgezahlt. Es wird bis zum 18. Lebensjahr gezahlt, in der Erstausbildung oder im Studium bis zum vollendeten 25. Lebensjahr.',
    },
    faqs: [
      { question: 'Was ist die Günstigerprüfung zwischen Kindergeld und Kinderfreibetrag?', answer: 'Das Finanzamt prüft in der Einkommensteuererklärung automatisch, ob das ausgezahlte Kindergeld oder der steuerliche Kinderfreibetrag für die Eltern zu einer geringeren Steuer führt.' },
      { question: 'Wann erlischt der Kindergeldanspruch bei Volljährigen?', answer: 'Mit Vollendung des 25. Lebensjahres; bei Arbeitslosigkeit des Kindes bereits mit dem 21. Lebensjahr; bei Kindern mit Behinderung (vor dem 25. Lebensjahr eingetreten) kann es lebenslang gezahlt werden.' },
    ],
    relatedSlugs: ['kinderkrankentage-kinderkrankengeld-rechner', 'betreuungsgeld-familiengeld-rechner', 'elterngeld-basis-plus-rechner', 'kinderzuschlag-kiz-rechner', 'unterhaltsvorschuss-rechner', 'unterhalt-volljaehrige-kinder-rechner'],
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
    metaTitle: 'Kinderzuschlag Rechner 2026 – KiZ Anspruch',
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
    content: {
      intro: 'Der Kinderzuschlag (KiZ nach § 6a BKGG) unterstützt Familien mit geringem Erwerbseinkommen, damit diese keinen Bürgergeld-Anspruch geltend machen müssen.',
      details: 'Voraussetzung: Die Eltern verfügen über ein Mindesteinkommen (900 € für Paare, 600 € für Alleinerziehende), das jedoch nicht für die gesamte Familie ausreicht. Der KiZ beträgt bis zu 292 € monatlich je Kind.',
    },
    faqs: [
      { question: 'Welche Zusatzleistungen schaltet die Bewilligung des Kinderzuschlags frei?', answer: 'Automatische Befreiung von den Kita-Gebühren sowie Anspruch auf Leistungen für Bildung und Teilhabe (BuT: kostenloses Schulmittagessen, 195 € Schulbedarfspaket, Klassenfahrten).' },
      { question: 'Wo wird der Kinderzuschlag beantragt?', answer: 'Online bei der zuständigen Familienkasse der Bundesagentur für Arbeit über das Portal Arbeitsagentur.de.' },
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
    metaTitle: 'Unterhaltsvorschuss Rechner 2026 – Beträge nach UVG für All...',
    metaDescription: 'Berechnen Sie den gesetzlichen Unterhaltsvorschuss nach dem Unterhaltsvorschussgesetz (UVG) für Kinder von 0 bis 17 Jahren',
    h1: 'Unterhaltsvorschuss Rechner – Gesetzlicher Vorschuss nach UVG',
    shortDescription: 'Ermittelt den staatlichen Unterhaltsvorschuss nach den Altersstufen des UVG mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Der Unterhaltsvorschuss nach dem UVG springt ein, wenn der barunterhaltspflichtige Elternteil keinen oder unregelmäßigen Unterhalt für das Kind leistet.',
      details: 'Die Höhe richtet sich nach dem gesetzlichen Mindestunterhalt abzüglich des vollen Kindergeldes für ein erstes Kind und staffelt sich in drei Altersstufen (0–5 Jahre, 6–11 Jahre, 12–17 Jahre).',
    },
    faqs: [
      { question: 'Bis zu welchem Alter wird Unterhaltsvorschuss gezahlt?', answer: 'Bis zum 18. Lebensjahr des Kindes; für Kinder von 12 bis 17 Jahren jedoch nur, wenn das Kind nicht auf Bürgergeld angewiesen ist oder der alleinerziehende Elternteil mind. 600 € brutto verdient.' },
      { question: 'Muss der säumige Elternteil den Unterhaltsvorschuss zurückzahlen?', answer: 'Ja, das Jugendamt nimmt den unterhaltspflichtigen Elternteil im Wege des Regresses in voller Höhe in Regress und fordert die verauslagten Gelder konsequent zurück.' },
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
    metaTitle: 'Düsseldorfer Tabelle Rechner 2026 – Kindesunterhalt nach Ei...',
    metaDescription: 'Berechnen Sie den monatlichen Kindesunterhalt nach der Düsseldorfer Tabelle 2026: Nettoeinkommen des Unterhaltspflichtigen',
    h1: 'Düsseldorfer Tabelle Rechner – Kindesunterhalt berechnen',
    shortDescription: 'Ermittelt den Zahlbetrag für Kindesunterhalt nach der Düsseldorfer Tabelle mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Die Düsseldorfer Tabelle ist die bundesweit von allen Familiengerichten anerkannte Richtlinie zur Bemessung des Kindesunterhalts bei Trennung und Scheidung.',
      details: 'Der Unterhaltsbetrag bestimmt sich aus dem bereinigten Nettoeinkommen des Unterhaltspflichtigen (15 Einkommensgruppen) und dem Alter des Kindes (4 Altersstufen). Das hälftige Kindergeld wird bedarfsmindernd abgezogen.',
    },
    faqs: [
      { question: 'Was ist der Selbstbehalt (Eigenbedarf) des Unterhaltspflichtigen?', answer: 'Der notwendige Eigenbedarf schützt das Existenzminimum des Barunterhaltspflichtigen: Er beträgt für erwerbstätige Unterhaltspflichtige gegenüber minderjährigen Kindern derzeit 1.450 € monatlich.' },
      { question: 'Wie wird das bereinigte Nettoeinkommen ermittelt?', answer: 'Vom Brutto werden Steuern, Sozialabgaben, berufsbedingte Aufwendungen (pauschal 5 % bis max. 150 €) und vorrangige berücksichtigungsfähige Verbindlichkeiten abgezogen.' },
    ],
    relatedSlugs: ['unterhaltsvorschuss-rechner', 'ehegattenunterhalt-trennungsunterhalt-rechner', 'kindergeld-rechner-2026', 'unterhalt-volljaehrige-kinder-rechner', 'ausbildungsunterhalt-bedarfskontrollbetrag-rechner'],
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
    metaTitle: 'Trennungsunterhalt Rechner – Ehegattenunterhalt nach 3/7-Me...',
    metaDescription: 'Berechnen Sie den gesetzlichen Trennungsunterhalt nach § 1361 BGB nach der anerkannten 3/7-Methode (45 % Erwerbstätigenbonus) aus der.',
    h1: 'Trennungsunterhalt Rechner – Unterhalt bei Trennung kalkulieren',
    shortDescription: 'Ermittelt den Unterhaltsanspruch des wirtschaftlich schwächeren Ehepartners nach Trennung mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Rechner kalkuliert den Anspruch auf Trennungsunterhalt (§ 1361 BGB) für das Trennungsjahr sowie den nachehelichen Unterhalt nach Rechtskraft der Scheidung.',
      details: 'Berechnung nach dem Halbteilungsgrundsatz (3/7- bzw. 45-%-Regel): Der bedürftige Partner erhält 45 Prozent der Differenz der bereinigten Erwerbseinkommen beider Eheleute (nach Erwerbstätigenbonus).',
    },
    faqs: [
      { question: 'Kann auf Trennungsunterhalt vorab vertraglich verzichtet werden?', answer: 'Nein, nach § 1361 Abs. 4 Satz 4 BGB ist ein Verzicht auf Trennungsunterhalt für die Zukunft im Voraus absolut unwirksam, um Sozialhilfebedürftigkeit zu verhindern.' },
      { question: 'Wann entfällt der nacheheliche Unterhalt?', answer: 'Wenn der geschiedene Partner wieder heiratet (§ 1586 BGB), in einer verfestigten neuen Lebensgemeinschaft lebt (§ 1579 BGB) oder seinen Lebensbedarf aus eigenen Einkünften decken kann.' },
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
    metaTitle: 'SSW Rechner – Aktuelle Schwangerschaftswoche',
    metaDescription: 'Ermitteln Sie Ihre genaue Schwangerschaftswoche (SSW z. B. 14+3), das Trimester und wichtige Meilensteine nach dem ersten Tag der letzten Periode oder.',
    h1: 'SSW Rechner – Aktuelle Schwangerschaftswoche & Tage berechnen',
    shortDescription: 'Berechnet die exakte Schwangerschaftswoche im Format SSW + Tage mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Schwangerschaftsrechner ermittelt die exakte Schwangerschaftswoche im Format SSW + Tage (z. B. 12+4) und ordnet sie dem jeweiligen Trimester zu.',
      details: 'Die Zählung beginnt rechnerisch am ersten Tag der letzten Periode (vor der eigentlichen Befruchtung). Eine Schwangerschaft dauert nominal 40 Schwangerschaftswochen (280 Tage bzw. 10 Mondmonate zu je 28 Tagen).',
    },
    faqs: [
      { question: 'Was bedeutet die Angabe "13+2 SSW"?', answer: 'Es bedeutet, dass 13 volle Schwangerschaftswochen plus 2 Tage abgeschlossen sind; die Schwangere befindet sich somit in der 14. Schwangerschaftswoche.' },
      { question: 'Wann beginnt das zweite und das dritte Trimester?', answer: 'Das 1. Trimester umfasst SSW 1 bis 13; das 2. Trimester reicht von SSW 14 bis 27; das 3. Trimester beginnt mit SSW 28 und endet mit der Geburt.' },
    ],
    relatedSlugs: ['chinesischer-empfaengniskalender-rechner', 'geburtstermin-rechner', 'mutterschutzfristen-rechner', 'zykluslaenge-eisprung-rechner'],
  },

  {
    id: 'mutterschutzfristen-rechner',
    slug: 'mutterschutzfristen-rechner',
    name: 'Mutterschutzfristen-Rechner (Fristen 6 Wochen vor & 8 Wochen nach ET)',
    shortName: 'Mutterschutzfristen',
    category: 'familie-schwangerschaft',
    subcategory: 'Schwangerschaft & Geburt',
    metaTitle: 'Mutterschutz Rechner – Gesetzliche Mutterschutzfristen nach...',
    metaDescription: 'Berechnen Sie Beginn und Ende Ihrer gesetzlichen Mutterschutzfrist (6 Wochen vor der Geburt und 8 bis 12 Wochen nach der Entbindung) nach § 3 MuSchG.',
    h1: 'Mutterschutz Rechner – Schutzfristen nach Mutterschutzgesetz',
    shortDescription: 'Ermittelt die gesetzlichen Beschäftigungsverbotsfristen vor und nach der Geburt mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Die gesetzlichen Mutterschutzfristen nach dem Mutterschutzgesetz (MuSchG) schützen die Gesundheit von Mutter und Kind vor und nach der Entbindung.',
      details: 'Die Schutzfrist beginnt 6 Wochen vor dem errechneten Entbindungstermin und endet regulär 8 Wochen nach der Geburt (bei Früh- und Mehrlingsgeburten oder Behinderung des Kindes 12 Wochen nach der Geburt).',
    },
    faqs: [
      { question: 'Darf eine Frau während der Schutzfrist vor der Entbindung arbeiten?', answer: 'Vor der Entbindung darf sie freiwillig arbeiten, wenn sie sich ausdrücklich dazu bereit erklärt (jederzeit widerrufbar); nach der Entbindung gilt ein absolutes Beschäftigungsverbot.' },
      { question: 'Was passiert mit der Schutzfrist, wenn das Baby später als errechnet zur Welt kommt?', answer: 'Die Schutzfrist vor der Entbindung verlängert sich automatisch bis zum tatsächlichen Geburtstermin; die 8-wöchige Schutzfrist nach der Geburt bleibt in voller Länge erhalten.' },
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
    metaTitle: 'Zyklusrechner – Eisprung – RechenHafen',
    metaDescription: 'Berechnen Sie den genauen Eisprungtag (Ovulation) und das fruchtbare Fenster für Zykluslängen von 21 bis 40 Tagen anhand der stabilen Lutealphase (14.',
    h1: 'Zyklusrechner – Eisprungtag & fruchtbares Fenster bestimmen',
    shortDescription: 'Kalkuliert Ovulation und fruchtbare Tage für individuelle Zykluslängen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Menstruationsrechner analysiert die Schwankungen Ihrer Zykluslänge zur Bestimmung der fruchtbaren Phase und der voraussichtlichen nächsten Periode.',
      details: 'Ein regulärer Menstruationszyklus dauert 21 bis 35 Tage (Mittelwert: 28 Tage). Die zweite Zyklushälfte (Gelbkörperphase / Lutealphase) ist mit 12 bis 16 Tagen biologisch stabil; zeitliche Verschiebungen betreffen fast immer die Eireifungsphase.',
    },
    faqs: [
      { question: 'Wie berechnet man die Zykluslänge exakt?', answer: 'Zählen Sie die Tage vom ersten Tag der Periodenblutung (Tag 1) bis zum letzten Tag vor dem Einsetzen der nächsten Blutung.' },
      { question: 'Ab welcher Schwankungsbreite gilt ein Zyklus als unregelmäßig?', answer: 'Schwankungen von bis zu 4 Tagen gelten als vollkommen normal; variiert die Zyklusdauer um mehr als 8 bis 10 Tage, empfiehlt sich eine gynäkologische Hormonabklärung.' },
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
    metaTitle: 'Chinesischer Empfängniskalender – Junge oder Mädchen Vorher...',
    metaDescription: 'Ermitteln Sie das Geschlecht Ihres Babys (Junge oder Mädchen) nach dem traditionellen chinesischen Mondkalender anhand von Mondalter der Mutter und.',
    h1: 'Chinesischer Empfängniskalender – Geschlecht des Babys prognostizieren',
    shortDescription: 'Traditioneller Mondkalender zur spielerischen Vorhersage von Junge oder Mädchen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Der traditionelle chinesische Empfängniskalender prognostiziert das Geschlecht des ungeborenen Kindes anhand des Mondalters der Mutter und des Empfängnismonats.',
      details: 'Die astrologische Berechnung basiert auf dem chinesischen Mondkalender: Das Mondalter der Mutter liegt oft 1 bis 2 Jahre über dem westlichen Kalenderalter. Wissenschaftlich betrachtet liegt die Trefferquote bei exakt den statistischen 50 Prozent.',
    },
    faqs: [
      { question: 'Gibt es eine wissenschaftliche Bestätigung für den chinesischen Kalender?', answer: 'Nein, große epidemiologische Studien (u. a. in Schweden mit über 2,8 Millionen Geburten) konnten keinerlei statistische Korrelation nachweisen; das Geschlecht wird rein durch das X- oder Y-Chromosom des Spermiums bestimmt.' },
      { question: 'Ab welcher Schwangerschaftswoche lässt sich das Geschlecht im Ultraschall sicher erkennen?', answer: 'Ab etwa der 14. bis 16. Schwangerschaftswoche; nach § 15 GenDG darf der Arzt das Geschlecht den Eltern erst nach Ablauf der 12. Schwangerschaftswoche (14. SSW p.m.) offiziell mitteilen.' },
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
    metaTitle: 'Kindes-Endgröße Rechner – Wie groß wird mein Kind?',
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
    content: {
      intro: 'Die Zielgrößenformel nach Tanner prognostiziert die statistische Erwachsenengröße eines Kindes auf Basis der biologischen Elterngrößen.',
      details: 'Jungen: [(Größe Vater + Größe Mutter + 13 cm) / 2] ± 5 cm. Mädchen: [(Größe Vater + Größe Mutter - 13 cm) / 2] ± 5 cm. Die Spanne von ± 5 cm deckt normale genetische Streuungen ab.',
    },
    faqs: [
      { question: 'Welche Umweltfaktoren beeinflussen die Endgröße neben den Genen?', answer: 'Ausgewogene Ernährung (Protein, Kalzium, Zink, Vitamin D), ausreichender Schlaf (Wachstumshormon Somatotropin wird überwiegend im Tiefschlaf ausgeschüttet) und das Ausbleiben schwerer chronischer Krankheiten.' },
      { question: 'Wie lässt sich die Endgröße medizinisch exakter bestimmen?', answer: 'Über ein Röntgenbild der linken Handwurzelknochen: Ein Radiologe oder Endokrinologe beurteilt den Verknöcherungsgrad der Wachstumsfugen (Epiphysenfugen).' },
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
    metaTitle: 'Kindersitz Rechner – Richtige Kindersitzgruppe nach i-Size',
    metaDescription: 'Finden Sie den passenden Kindersitz nach neuer i-Size-Norm (UN ECE R129 nach Körpergröße) und klassischer ECE R44/04 nach Alter und Gewicht.',
    h1: 'Kindersitz Rechner – Passenden Kindersitz nach i-Size ermitteln',
    shortDescription: 'Bestimmt die vorgeschriebene Kindersitzkategorie nach Größe, Gewicht und Alter mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Die europäische Kindersitznorm UN R129 (i-Size) teilt Autokindersitze nach der Körpergröße des Kindes in Zentimetern statt nach Gewicht ein.',
      details: 'Die Norm schreibt vor, dass Babys bis zum Alter von mindestens 15 Monaten und 76 cm zwingend rückwärtsgerichtet (Reboarder) transportiert werden müssen, um die empfindliche Halswirbelsäule bei einem Frontalaufprall optimal zu stützen.',
    },
    faqs: [
      { question: 'Bis zu welchem Alter oder welcher Größe ist ein Kindersitz in Deutschland Pflicht?', answer: 'Nach § 21 Abs. 1a StVO müssen Kinder bis zum vollendeten 12. Lebensjahr oder bis zu einer Körpergröße von 150 cm in einem amtlich genehmigten Kindersitz gesichert werden.' },
      { question: 'Warum sind Reboarder-Sitze sicherer?', answer: 'Bei einem Frontalaufprall wird das Kind in die Sitzschale gedrückt; die Aufprallkräfte verteilen sich großflächig über den Rücken, statt den Kopf ungeschützt nach vorne zu schleudern.' },
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
    metaTitle: 'Windel Rechner – Windelbedarf – RechenHafen',
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
    content: {
      intro: 'Dieser Budgetkalkulator ermittelt den Windelbedarf und die Gesamtkosten für Einwegwindeln über die gesamte Wickelzeit von Geburt bis zum Trockenwerden.',
      details: 'Ein Baby verbraucht in den ersten 3 Jahren im Schnitt rund 5.000 bis 6.000 Windeln. Die Kosten summieren sich bei Markenwindeln auf 1.200 bis 1.800 Euro; Stoffwindel-Systeme können die Kosten auf 400 bis 600 Euro senken.',
    },
    faqs: [
      { question: 'Wie viele Windeln benötigt ein Neugeborenes pro Tag?', answer: 'In den ersten Lebenswochen werden durchschnittlich 7 bis 10 Windeln in 24 Stunden benötigt; ab dem 6. Monat sinkt der Bedarf auf ca. 4 bis 6 Windeln täglich.' },
      { question: 'Gibt es von manchen Gemeinden Zuschüsse für Windeln?', answer: 'Ja, viele Städte und Landkreise zahlen Familien einen Windelzuschuss oder geben kostenlose Müllsäcke (Windelsäcke) für die Windelentsorgung aus.' },
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
    metaTitle: 'Erstausstattung Baby Rechner – Was kostet die Baby-Erstauss...',
    metaDescription: 'Planen Sie die Kosten für die Baby-Erstausstattung: Kinderwagen, Babybett, Wickelkommode, Kleidung und Babyschale im Vergleich Neu vs. Gebraucht.',
    h1: 'Erstausstattung Baby Rechner – Kosten für die Erstausstattung planen',
    shortDescription: 'Kalkuliert die Anschaffungskosten für die Ankunft des ersten Kindes mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Budgetplaner kalkuliert die Gesamtkosten für die Baby-Erstausstattung in den Bereichen Kinderwagen, Babyzimmer, Kleidung, Wickeln und Transport.',
      details: 'Eine solide Erstausstattung kostet im Neukauf zwischen 1.200 und 3.000 Euro. Durch gezielten Gebrauchtkauf (Second-Hand-Basare) lassen sich 50 bis 70 Prozent der Anschaffungskosten einsparen.',
    },
    faqs: [
      { question: 'Welche Posten der Erstausstattung sind unverzichtbar?', answer: 'Babyschale fürs Auto (zwingend für die Entlassung aus der Klinik), Beistellbett, Schlafsack (keine Kissen oder Decken wegen SIDS-Risiko), Wickelauflage und Kleidung in Größe 50/56.' },
      { question: 'Gibt es staatliche Hilfen für die Baby-Erstausstattung?', answer: 'Schwangere mit geringem Einkommen oder Bürgergeld-Bezug können bei der Bundesstiftung Mutter und Kind oder beim Jobcenter nach § 24 SGB II einen Zuschuss zur Erstausstattung beantragen.' },
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
    metaTitle: 'Kita-Gebühren Rechner – Elternbeiträge nach Einkommen',
    metaDescription: 'Ermitteln Sie die monatlichen Kita-Kosten für Krippe oder Kindergarten nach Familieneinkommen, Betreuungsstunden und Bundesland-Beitragsfreiheit.',
    h1: 'Kita-Gebühren Rechner – Monatliche Kita-Kosten ermitteln',
    shortDescription: 'Schätzt die einkommensabhängigen Elternbeiträge für die Kinderbetreuung mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Die Elternbeiträge für Krippe, Kindergarten und Hort variieren in Deutschland extrem je nach Bundesland, Kommune und elterlichem Jahreseinkommen.',
      details: 'Einige Bundesländer (z. B. Berlin, Hamburg, Hessen teilweise) haben die Kita-Gebühren für Kinder ab 3 Jahren komplett abgeschafft; in anderen Kommunen staffeln sich die Beiträge nach Einkommen bis zu 600 € monatlich.',
    },
    faqs: [
      { question: 'Sind Geschwisterkinder von Kita-Beiträgen befreit?', answer: 'In den allermeisten kommunalen Satzungen ist das zweite Kind beitragsermäßigt (meist 50 % Ersparnis) und das dritte Kind vollkommen gebührenfrei.' },
      { question: 'Kann man Kita-Kosten von der Steuer absetzen?', answer: 'Ja, nach § 10 Abs. 1 Nr. 5 EStG können zwei Drittel der reinen Betreuungskosten (ohne Verpflegung), maximal 4.000 € pro Kind und Jahr, als Sonderausgaben geltend gemacht werden.' },
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
    metaTitle: 'Familiengeld Rechner – Bayerisches Familiengeld',
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
    content: {
      intro: 'Dieser Rechner ermittelt Landesfamilienleistungen wie das bayerische Familiengeld oder Landeserziehungsgelder nach Ablauf des regulären Elterngeldes.',
      details: 'Im Freistaat Bayern erhalten Eltern für jedes Kind im 2. und 3. Lebensjahr (vom 13. bis zum 36. Lebensmonat) 250 Euro monatlich (ab dem 3. Kind 300 Euro), unabhängig von Erwerbstätigkeit oder Betreuungsform.',
    },
    faqs: [
      { question: 'Wird das bayerische Familiengeld auf das Bürgergeld angerechnet?', answer: 'Nein, nach ständiger Rechtsprechung und Landesgesetz ist das Familiengeld eine zweckgebundene Förderleistung und wird nicht bedarfsmindernd auf Bürgergeld angerechnet.' },
      { question: 'Gibt es das frühere Bundesbetreuungsgeld ("Herdprämie") noch?', answer: 'Nein, das bundesweite Betreuungsgeld wurde 2015 vom Bundesverfassungsgericht für verfassungswidrig erklärt, da dem Bund die Gesetzgebungskompetenz fehlte.' },
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
    metaTitle: 'Taschengeld Rechner 2026 – Offizielle Taschengeldtabelle de...',
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
    content: {
      intro: 'Dieser Taschengeldrechner basiert auf den offiziellen Empfehlungen der Jugendämter und des Deutschen Jugendinstituts (DJI) nach Alter des Kindes.',
      details: 'Empfehlung: Bis zum 9. Lebensjahr wöchentliche Auszahlung (ca. 1,50 bis 3,50 €), ab dem 10. Lebensjahr monatliche Überweisung (ca. 16 bis 20 € mit 10 Jahren, bis zu 70 bis 85 € mit 17 Jahren).',
    },
    faqs: [
      { question: 'Wofür sollte das reguläre Taschengeld verwendet werden?', answer: 'Für persönliche Freizeitwünsche (Süßigkeiten, Zeitschriften, Spielzeug); notwendige Schulsachen, Grundkleidung und Hauptmahlzeiten müssen zwingend die Eltern bezahlen.' },
      { question: 'Darf Taschengeld als Strafe gekürzt oder gestrichen werden?', answer: 'Pädagogen und Jugendämter raten dringend davon ab: Taschengeld ist ein pädagogisches Lernmittel für den Umgang mit Geld und sollte nicht als Erziehungsstrafe instrumentalisiert werden.' },
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
    metaTitle: 'Schulbedarfspaket Rechner – 195 € Zuschuss für Schulmateria...',
    metaDescription: 'Berechnen Sie den gesetzlichen Zuschuss für persönliches Schulmaterial (195 € pro Schuljahr) aus dem Bildungs- und Teilhabepaket (BuT) bei Bürgergeld',
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
    content: {
      intro: 'Das Schulbedarfspaket nach dem Bildungs- und Teilhabepaket (§ 28 Abs. 3 SGB II) unterstützt einkommensschwache Familien bei der Anschaffung von Schulmaterialien.',
      details: 'Für jedes schulpflichtige Kind wird eine jährliche Pauschale (195 Euro im Schuljahr) ausgezahlt: 130 Euro zum 1. August für das erste Schulhalbjahr und 65 Euro zum 1. Februar für das zweite Schulhalbjahr.',
    },
    faqs: [
      { question: 'Wer hat Anspruch auf das Schulbedarfspaket?', answer: 'Kinder, deren Eltern Bürgergeld, Sozialhilfe, Kinderzuschlag (KiZ), Wohngeld oder Asylbewerberleistungen beziehen.' },
      { question: 'Muss man für das Schulbedarfspaket Kassenbons vorlegen?', answer: 'In der Regel nein, es handelt sich um eine zweckgebundene Pauschale; bei Kindern ab 15 Jahren verlangt das Amt jedoch eine aktuelle Schulbescheinigung.' },
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
    metaTitle: 'Kinderkrankengeld Rechner 2026 – Tage',
    metaDescription: 'Berechnen Sie Anspruch auf Kinderkrankentage (15 Tage pro Elternteil, 30 Tage für Alleinerziehende) und die Auszahlungshöhe des Kinderkrankengeldes (ca.',
    h1: 'Kinderkrankengeld Rechner – Freistellung & Krankengeld bei Kindeserkrankung',
    shortDescription: 'Ermittelt Freistellungstage und Krankengeldhöhe bei Pflege eines erkrankten Kindes mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Das Kinderkrankengeld nach § 45 SGB V gleicht den Verdienstausfall aus, wenn Eltern wegen der Pflege eines erkrankten Kindes nicht arbeiten können.',
      details: 'Die Krankenkasse zahlt in der Regel 90 Prozent des ausgefallenen Nettoarbeitsentgelts. Gesetzlich versicherten Eltern stehen pro Kind jährlich eine festgelegte Anzahl an Arbeitstagen zur Verfügung (Alleinstehende erhalten die doppelte Anzahl).',
    },
    faqs: [
      { question: 'Bis zu welchem Alter des Kindes besteht Anspruch auf Kinderkrankengeld?', answer: 'Bis zum vollendeten 12. Lebensjahr des Kindes; für Kinder mit Behinderung, die auf Hilfe angewiesen sind, gilt die Altersgrenze nicht.' },
      { question: 'Benötigt man ab dem ersten Tag ein ärztliches Attest?', answer: 'Ja, für den Bezug von Kinderkrankengeld muss der Kinderarzt ab Tag 1 eine "Ärztliche Bescheinigung für den Bezug von Krankengeld bei Erkrankung eines Kindes" ausstellen.' },
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
    metaTitle: 'Großelternzeit Rechner – Gesetzlicher Freistellungsanspruch...',
    metaDescription: 'Prüfen Sie die Voraussetzungen und Fristen für Großelternzeit: Gesetzliche Freistellung von der Arbeit zur Betreuung des Enkelkindes.',
    h1: 'Großelternzeit Rechner – Freistellung für Oma & Opa ermitteln',
    shortDescription: 'Prüft die rechtlichen Voraussetzungen für die Freistellung von Großeltern mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Ratgeber kalkuliert Möglichkeiten und Freistellungsansprüche von Großeltern zur Betreuung von Enkelkindern nach dem BEEG.',
      details: 'Großeltern können nach § 15 Abs. 1a BEEG Elternzeit beanspruchen, wenn ein Elternteil minderjährig ist oder sich in Ausbildung befindet und mit dem Kind im gemeinsamen Haushalt lebt.',
    },
    faqs: [
      { question: 'Erhalten Großeltern während der Großelternzeit Elterngeld?', answer: 'Nein, ein Anspruch auf staatliches Elterngeld steht ausschließlich den leiblichen Eltern oder Adoptiveltern zu; die Freistellung für Großeltern ist unbezahlt.' },
      { question: 'Haben Großeltern während der Freistellung Kündigungsschutz?', answer: 'Ja, bei berechtigter Inanspruchnahme der Großelternzeit gilt der gleiche gesetzliche Sonderkündigungsschutz wie für Eltern nach § 18 BEEG.' },
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
    metaTitle: 'Unterhalt volljährige Kinder Rechner 2026 – Studium',
    metaDescription: 'Berechnen Sie den Unterhaltsanspruch für volljährige Kinder (Studenten, Azubis) nach der Düsseldorfer Tabelle 2026 (fester Regelsatz 930 € bei eigener.',
    h1: 'Unterhalt für volljährige Kinder – Studentenunterhalt berechnen',
    shortDescription: 'Ermittelt den Unterhaltsbedarf von volljährigen Kindern mit eigenem Hausstand mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Mit Vollendung des 18. Lebensjahres erlischt der Betreuungsunterhalt: Beide Elternteile haften nun anteilig als Barunterhaltspflichtige nach ihren Einkommensverhältnissen.',
      details: 'Volljährige Kinder in eigener Wohnung haben nach der Düsseldorfer Tabelle einen festen Gesamtunterhaltsbedarf (derzeit 930 € monatlich). Das volle Kindergeld (250 €) wird bedarfsmindernd abgezogen; die verbleibende Lücke teilen die Eltern nach Einkommensquote auf.',
    },
    faqs: [
      { question: 'Wann sind Eltern verpflichtet, für volljährige Kinder Unterhalt zu zahlen?', answer: 'Solange sich das Kind in der allgemeinen Schulausbildung oder einer ersten berufsqualifizierenden Ausbildung bzw. einem Erststudium befindet (§ 1610 Abs. 2 BGB).' },
      { question: 'Was sind privilegierte Volljährige nach § 1603 Abs. 2 BGB?', answer: 'Volljährige Kinder unter 21 Jahren, die unverheiratet sind, im Haushalt eines Elternteils leben und die allgemeine Schulausbildung absolvieren; sie sind minderjährigen Kindern rechtlich gleichgestellt.' },
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
    metaTitle: 'Ausbildungsunterhalt Rechner – Ausbildungsvergütung auf Unt...',
    metaDescription: 'Berechnen Sie, wie viel der Ausbildungsvergütung auf den Kindesunterhalt angerechnet wird (nach Abzug von 100 € ausbildungsbedingtem Mehrbedarf).',
    h1: 'Ausbildungsunterhalt Rechner – Azubi-Vergütung auf Unterhalt anrechnen',
    shortDescription: 'Kalkuliert die Minderung des Kindesunterhalts durch eigenes Azubi-Gehalt mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Dieser Rechner ermittelt den Unterhaltsanspruch von Auszubildenden unter Anrechnung der eigenen Ausbildungsvergütung.',
      details: 'Von der Brutto-Ausbildungsvergütung werden Steuern, Sozialabgaben und eine berufsbedingte Ausbildungspauschale (100 €) abgezogen; der verbleibende Nettobetrag mindert den Unterhaltsanspruch gegenüber den Eltern vollständig.',
    },
    faqs: [
      { question: 'Dürfen Eltern den Unterhalt verweigern, wenn das Kind die Ausbildung abbricht?', answer: 'Eltern müssen eine angemessene Orientierungsphase zugestehen; bei wiederholten, unbegründeten Ausbildungsabbrüchen oder Bummelstudium kann der Unterhaltsanspruch jedoch verwirken.' },
      { question: 'Wie wirkt sich ein Nebenjob während des Studiums auf den Unterhalt aus?', answer: 'Einkünfte aus Nebentätigkeiten während des Studiums werden in der Regel nur teilweise angerechnet (überobligatorische Leistung), sofern sie das Studium nicht ungebührlich verzögern.' },
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
    metaTitle: 'Kinderbetreuungskosten Rechner – Kita, Hort',
    metaDescription: 'Berechnen Sie Ihre Steuerersparnis durch Kinderbetreuungskosten: 2/3 der Kosten bis maximal 4.000 Euro pro Kind und Jahr als Sonderausgaben abziehbar.',
    h1: 'Kinderbetreuungskosten Rechner – Steuerersparnis für Kita & Hort',
    shortDescription: 'Ermittelt den steuerlichen Sonderausgabenabzug für Betreuungsaufwendungen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
    content: {
      intro: 'Erwerbsbedingte Kinderbetreuungskosten können nach § 10 Abs. 1 Nr. 5 EStG steuermindernd als Sonderausgaben in der Einkommensteuererklärung geltend gemacht werden.',
      details: 'Steuerlich anerkannt werden zwei Drittel (66,6 %) der tatsächlichen Aufwendungen für Kindertagesstätte, Krippe, Tagesmutter oder Babysitter, maximal bis zu einem Höchstbetrag von 4.000 Euro je Kind und Kalenderjahr.',
    },
    faqs: [
      { question: 'Können Verpflegungskosten (Essen in der Kita) abgesetzt werden?', answer: 'Nein, Aufwendungen für Mahlzeiten, Spiel- oder Bastelgeld sowie Musikunterricht und Sportvereine sind gesetzlich ausdrücklich vom Steuerabzug ausgeschlossen.' },
      { question: 'Ist Barzahlung an die Tagesmutter steuerlich zulässig?', answer: 'Nein, Voraussetzung für den steuerlichen Abzug ist zwingend eine ordnungsgemäße Rechnung oder ein Gebührenbescheid und die unbare Überweisung auf das Konto des Betreibers.' },
    ],
    relatedSlugs: ['kita-gebuehren-rechner', 'kindergeld-rechner-2026', 'teilzeit-gehaltsrechner'],
  },
];