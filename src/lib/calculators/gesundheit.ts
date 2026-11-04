import { CalculationResult } from '@/types/calculator';
import { formatNumber } from '@/lib/formatters';

export function calculateBMI(inputs: Record<string, any>): CalculationResult {
  const unitSystem = inputs.unitSystem || 'metric'; // 'metric' (kg, cm) vs 'imperial' (lbs, inch)
  let rawWeight = inputs.weight !== undefined && inputs.weight !== null && String(inputs.weight).trim() !== ''
    ? parseFloat(inputs.weight)
    : 75;
  let rawHeight = inputs.height !== undefined && inputs.height !== null && String(inputs.height).trim() !== ''
    ? parseFloat(inputs.height)
    : 178;

  let weightKg = rawWeight;
  let heightCm = rawHeight;

  if (unitSystem === 'imperial') {
    // rawWeight in lbs, rawHeight in inches
    weightKg = rawWeight * 0.45359237;
    heightCm = rawHeight * 2.54;
  }

  if (!Number.isFinite(weightKg) || !Number.isFinite(heightCm) || weightKg <= 0 || heightCm <= 0) {
    return {
      primary: { id: 'bmi', label: 'BMI', value: 0, formattedValue: '0' },
      error: 'Bitte positive Werte für Gewicht und Körpergröße eingeben.',
    };
  }
  if (heightCm < 100 || heightCm > 250) {
    return {
      primary: { id: 'bmi', label: 'BMI', value: 0, formattedValue: '-' },
      error: unitSystem === 'imperial'
        ? 'Bitte eine Körpergröße zwischen 40 und 98 Zoll eingeben (entspricht ca. 100 bis 250 cm).'
        : 'Bitte eine Körpergröße zwischen 100 und 250 cm eingeben.',
    };
  }
  if (weightKg < 20 || weightKg > 350) {
    return {
      primary: { id: 'bmi', label: 'BMI', value: 0, formattedValue: '-' },
      error: unitSystem === 'imperial'
        ? 'Bitte ein Körpergewicht zwischen 45 und 770 lbs eingeben (entspricht ca. 20 bis 350 kg).'
        : 'Bitte ein Körpergewicht zwischen 20 und 350 kg eingeben.',
    };
  }

  // Optionales Alter (für Idealgewicht nach Creff und den Hinweis für ältere Erwachsene).
  // Fehlt es, entfallen nur diese Zusatzangaben; der BMI selbst wird weiter berechnet.
  const hasAge = inputs.age !== undefined && inputs.age !== null && String(inputs.age).trim() !== '';
  const age = hasAge ? parseFloat(inputs.age) : NaN;
  if (hasAge && (!Number.isFinite(age) || age < 18 || age > 120)) {
    return {
      primary: { id: 'bmi', label: 'BMI', value: 0, formattedValue: '-' },
      error: Number.isFinite(age) && age >= 0 && age < 18
        ? 'Der Rechner gilt für Erwachsene ab 18 Jahren. Bei Kindern und Jugendlichen wird der BMI mit alters- und geschlechtsspezifischen Perzentilkurven bewertet – sprechen Sie dazu mit der Kinderarztpraxis.'
        : 'Bitte ein Alter zwischen 18 und 120 Jahren eingeben.',
    };
  }
  const bodyFrame: 'small' | 'medium' | 'large' =
    inputs.bodyFrame === 'small' || inputs.bodyFrame === 'large' ? inputs.bodyFrame : 'medium';

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  // WHO Klassifikation
  let category = 'Normalgewicht';

  if (bmi < 18.5) {
    category = 'Untergewicht';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Normalgewicht';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Übergewicht (Präadipositas)';
  } else if (bmi >= 30 && bmi < 35) {
    category = 'Adipositas Grad I';
  } else if (bmi >= 35 && bmi < 40) {
    category = 'Adipositas Grad II';
  } else {
    category = 'Adipositas Grad III (starke Adipositas)';
  }

  // Normalgewichtsbereich nach WHO (BMI 18.5 bis 24.9)
  const minNormalKg = 18.5 * (heightM * heightM);
  const maxNormalKg = 24.9 * (heightM * heightM);

  const isImperial = unitSystem === 'imperial';
  const KG_TO_LBS = 2.20462;
  const fmtWeight = (kg: number, digits = 1) =>
    isImperial ? `${formatNumber(kg * KG_TO_LBS, digits)} lbs` : `${formatNumber(kg, digits)} kg`;

  const normalRangeText = `${fmtWeight(minNormalKg)} – ${fmtWeight(maxNormalKg)}`;

  // Abstand zum Normalgewichtsbereich
  let distanceText = 'Ihr Gewicht liegt im Normalgewichtsbereich.';
  let distanceKg = 0;
  if (weightKg < minNormalKg) {
    distanceKg = minNormalKg - weightKg;
    distanceText = `${fmtWeight(distanceKg)} unter der Untergrenze (BMI 18,5)`;
  } else if (weightKg > maxNormalKg) {
    distanceKg = weightKg - maxNormalKg;
    distanceText = `${fmtWeight(distanceKg)} über der Obergrenze (BMI 24,9)`;
  }

  const secondary: CalculationResult['secondary'] = [
    { id: 'category', label: 'WHO-Klassifikation', value: category, formattedValue: category },
    { id: 'normalRange', label: `Normalgewichtsbereich (bei ${formatNumber(rawHeight, 0)} ${isImperial ? 'Zoll' : 'cm'})`, value: minNormalKg, formattedValue: normalRangeText },
    { id: 'distanceToRange', label: 'Abstand zum Normalgewicht', value: distanceKg, formattedValue: distanceText },
  ];

  const calculationSteps: string[] = [
    isImperial
      ? `Umrechnung: ${formatNumber(rawWeight, 1)} lbs = ${formatNumber(weightKg, 1)} kg, ${formatNumber(rawHeight, 1)} Zoll = ${formatNumber(heightCm, 1)} cm`
      : `Größe in Metern: ${formatNumber(heightCm, 0)} cm = ${formatNumber(heightM, 2)} m`,
    `BMI = ${formatNumber(weightKg, 1)} kg / (${formatNumber(heightM, 2)} m)² = ${formatNumber(bmi, 1)}`,
    `Normalgewicht = 18,5 × ${formatNumber(heightM, 2)}² bis 24,9 × ${formatNumber(heightM, 2)}² = ${formatNumber(minNormalKg, 1)} bis ${formatNumber(maxNormalKg, 1)} kg`,
  ];

  let creffKg: number | undefined;
  let ageNote: string | undefined;
  if (hasAge) {
    // Creff-Formel: [(Größe in cm − 100) + Alter / 10] × 0,9 × Körperbau-Faktor (0,9 / 1 / 1,1)
    const frameFactor = bodyFrame === 'small' ? 0.9 : bodyFrame === 'large' ? 1.1 : 1;
    creffKg = ((heightCm - 100) + age / 10) * 0.9 * frameFactor;
    const frameLabel = bodyFrame === 'small' ? 'schmaler' : bodyFrame === 'large' ? 'kräftiger' : 'normaler';
    secondary.push({
      id: 'creffIdealWeight',
      label: `Idealgewicht nach Creff (${frameLabel} Körperbau)`,
      value: creffKg,
      formattedValue: `ca. ${fmtWeight(creffKg)}`,
    });
    calculationSteps.push(
      `Creff: [(${formatNumber(heightCm, 0)} − 100) + ${formatNumber(age, 0)} / 10] × 0,9${frameFactor !== 1 ? ` × ${formatNumber(frameFactor, 1)}` : ''} = ${formatNumber(creffKg, 1)} kg`,
    );

    if (age >= 65) {
      ageNote = 'Ab etwa 65 Jahren gilt ein BMI im oberen Normalbereich oft als günstig. Die GLIM-Kriterien (2019) werten einen BMI unter 20 (unter 70 Jahren) bzw. unter 22 (ab 70 Jahren) als möglichen Hinweis auf Mangelernährung. Ungewollter Gewichtsverlust gehört ärztlich abgeklärt.';
      secondary.push({ id: 'ageNote', label: 'Hinweis für ältere Erwachsene', value: 'Hinweis', formattedValue: ageNote });
    }
  }

  // Broca-Normalgewicht (Größe in cm − 100) als historischer Vergleichswert
  const brocaKg = heightCm - 100;
  secondary.push({ id: 'brocaNormal', label: 'Normalgewicht nach Broca (Größe − 100)', value: brocaKg, formattedValue: fmtWeight(brocaKg, 0) });
  secondary.push({ id: 'disclaimer', label: 'Medizinischer Hinweis', value: 'Hinweis', formattedValue: 'Dient der Orientierung, ersetzt keine ärztliche Diagnose.' });

  let warning: string | undefined;
  if (bmi < 17 || bmi >= 35) {
    warning = 'Ihr BMI liegt deutlich außerhalb des Normalbereichs. Lassen Sie Gewicht und mögliche Ursachen bitte hausärztlich abklären.';
  }

  const creffSentence = creffKg !== undefined ? ` Das Idealgewicht nach Creff liegt bei ca. ${fmtWeight(creffKg)}.` : '';

  return {
    primary: {
      id: 'bmi',
      label: 'Body-Mass-Index (BMI)',
      value: bmi,
      formattedValue: formatNumber(bmi, 1),
      highlight: true,
    },
    secondary,
    calculationSteps,
    ...(warning ? { warning } : {}),
    summaryText: `Ihr Body-Mass-Index beträgt ${formatNumber(bmi, 1)}. Nach der Klassifikation der Weltgesundheitsorganisation (WHO) entspricht dies der Kategorie „${category}“. Normalgewicht wäre bei Ihrer Größe ${normalRangeText}.${creffSentence}`,
  };
}

/** PAL-Werte nach DGE-Referenzwerten (Energie) mit Alltagsbeispielen. */
export const PAL_DESCRIPTIONS: Record<string, string> = {
  '1.2': 'ausschließlich sitzend oder liegend',
  '1.4': 'sitzende Tätigkeit, kaum Bewegung in der Freizeit',
  '1.6': 'sitzend, zeitweise gehend oder stehend',
  '1.8': 'überwiegend gehend oder stehend',
  '2.0': 'körperlich schwere Arbeit',
};

export function calculateCalorieNeeds(inputs: Record<string, any>): CalculationResult {
  const gender = inputs.gender === 'female' ? 'female' : 'male';
  // 'mifflin' | 'harris_benedict' | 'known' (eigener, z. B. gemessener Grundumsatz)
  const formula = inputs.formula === 'harris_benedict' || inputs.formula === 'known' ? inputs.formula : 'mifflin';
  const goal = inputs.goal === 'lose' || inputs.goal === 'gain' ? inputs.goal : 'maintain';
  const isEmpty = (v: any) => v === undefined || v === null || String(v).trim() === '';
  const fail = (error: string): CalculationResult => ({
    primary: { id: 'targetCal', label: 'Kalorienbedarf', value: 0, formattedValue: '-' },
    error,
  });

  let bmr = 0;
  let formulaName = '';
  let bmrStep = '';
  let comparisonBmr: number | undefined;
  let comparisonName = '';

  if (formula === 'known') {
    if (isEmpty(inputs.bmrKnown)) {
      return fail('Bitte geben Sie Ihren bekannten Grundumsatz in kcal pro Tag ein.');
    }
    const known = parseFloat(inputs.bmrKnown);
    if (!Number.isFinite(known) || known < 800 || known > 4000) {
      return fail('Bitte geben Sie einen Grundumsatz zwischen 800 und 4.000 kcal pro Tag ein.');
    }
    bmr = known;
    formulaName = 'Eigener Grundumsatz (eingegeben)';
    bmrStep = `Schritt 1 – Grundumsatz: ${formatNumber(bmr, 0)} kcal (eigener Wert)`;
  } else {
    if (isEmpty(inputs.weight)) {
      return fail('Bitte geben Sie Ihr Körpergewicht in kg ein.');
    }
    const weight = parseFloat(inputs.weight);
    if (isNaN(weight) || weight <= 0) {
      return fail('Bitte geben Sie ein gültiges Körpergewicht größer als 0 kg an.');
    }
    if (weight < 30 || weight > 300) {
      return fail('Bitte geben Sie ein Körpergewicht zwischen 30 und 300 kg an.');
    }

    if (isEmpty(inputs.height)) {
      return fail('Bitte geben Sie Ihre Körpergröße in cm ein.');
    }
    const heightCm = parseFloat(inputs.height);
    if (isNaN(heightCm) || heightCm <= 0) {
      return fail('Bitte geben Sie eine gültige Körpergröße größer als 0 cm an.');
    }
    if (heightCm < 120 || heightCm > 250) {
      return fail('Bitte geben Sie eine Körpergröße zwischen 120 und 250 cm an.');
    }

    if (isEmpty(inputs.age)) {
      return fail('Bitte geben Sie Ihr Alter in Jahren ein.');
    }
    const age = parseFloat(inputs.age);
    if (isNaN(age) || age <= 0 || !Number.isInteger(age)) {
      return fail('Bitte geben Sie ein gültiges Alter in vollen Jahren an.');
    }
    if (age < 14 || age > 110) {
      return fail(age < 14
        ? 'Die Formeln gelten erst ab 14 Jahren. Den Energiebedarf von Kindern bespricht man am besten mit der Kinderarztpraxis.'
        : 'Bitte geben Sie ein Alter zwischen 14 und 110 Jahren an.');
    }

    // Mifflin-St Jeor (Mifflin et al. 1990): 10 × kg + 6,25 × cm − 5 × Alter + s (s = +5 Männer, −161 Frauen)
    const s = gender === 'male' ? 5 : -161;
    const bmrMifflin = 10 * weight + 6.25 * heightCm - 5 * age + s;
    // Revidierte Harris-Benedict-Formel (Roza & Shizgal 1984)
    const bmrHarris = gender === 'male'
      ? 88.362 + (13.397 * weight) + (4.799 * heightCm) - (5.677 * age)
      : 447.593 + (9.247 * weight) + (3.098 * heightCm) - (4.330 * age);

    if (formula === 'harris_benedict') {
      bmr = bmrHarris;
      formulaName = 'Revidierte Harris-Benedict-Formel';
      comparisonBmr = bmrMifflin;
      comparisonName = 'Mifflin-St Jeor';
      bmrStep = gender === 'male'
        ? `Schritt 1 – Grundumsatz (Harris-Benedict): 88,362 + 13,397 × ${formatNumber(weight, 1)} + 4,799 × ${formatNumber(heightCm, 0)} − 5,677 × ${age} = ${formatNumber(bmr, 0)} kcal`
        : `Schritt 1 – Grundumsatz (Harris-Benedict): 447,593 + 9,247 × ${formatNumber(weight, 1)} + 3,098 × ${formatNumber(heightCm, 0)} − 4,330 × ${age} = ${formatNumber(bmr, 0)} kcal`;
    } else {
      bmr = bmrMifflin;
      formulaName = 'Mifflin-St Jeor Formel';
      comparisonBmr = bmrHarris;
      comparisonName = 'Harris-Benedict';
      bmrStep = `Schritt 1 – Grundumsatz (Mifflin-St Jeor): 10 × ${formatNumber(weight, 1)} + 6,25 × ${formatNumber(heightCm, 0)} − 5 × ${age} ${s > 0 ? '+ 5' : '− 161'} = ${formatNumber(bmr, 0)} kcal`;
    }
  }

  const palRaw = parseFloat(inputs.activityLevel);
  const pal = Number.isFinite(palRaw) && palRaw >= 1 && palRaw <= 2.5 ? palRaw : 1.4;
  const sportRaw = isEmpty(inputs.sportKcalPerDay) ? 0 : parseFloat(inputs.sportKcalPerDay);
  if (!Number.isFinite(sportRaw) || sportRaw < 0 || sportRaw > 3000) {
    return fail('Bitte geben Sie für den zusätzlichen Sport einen Wert zwischen 0 und 3.000 kcal pro Tag ein.');
  }
  const sportKcal = sportRaw;

  const tdee = bmr * pal + sportKcal; // Gesamtumsatz
  const activityKcal = tdee - bmr; // Leistungsumsatz (Alltag + Sport)
  const deficit = Math.max(1200, tdee - 500); // Moderates Defizit, nicht unter 1.200 kcal
  const surplus = tdee + 300; // Moderater Überschuss

  let targetCalories = tdee;
  let primaryLabel = 'Gesamtenergiebedarf (Gewicht halten)';
  if (goal === 'lose') {
    targetCalories = deficit;
    primaryLabel = 'Zielkalorien zum gesunden Abnehmen (-500 kcal)';
  } else if (goal === 'gain') {
    targetCalories = surplus;
    primaryLabel = 'Zielkalorien zum Muskelaufbau (+300 kcal)';
  }

  const palKey = pal.toFixed(1);
  const palDescription = PAL_DESCRIPTIONS[palKey];
  const palText = `PAL ${formatNumber(pal, 1)}${palDescription ? ` (${palDescription})` : ''}`;

  const calculationSteps = [
    bmrStep,
    `Schritt 2 – Alltag: ${formatNumber(bmr, 0)} kcal × ${formatNumber(pal, 1)} = ${formatNumber(bmr * pal, 0)} kcal`,
    sportKcal > 0
      ? `Schritt 3 – Gesamtumsatz: ${formatNumber(bmr * pal, 0)} kcal + ${formatNumber(sportKcal, 0)} kcal Sport = ${formatNumber(tdee, 0)} kcal`
      : `Schritt 3 – Gesamtumsatz: ${formatNumber(tdee, 0)} kcal (ohne zusätzliche Sportkalorien)`,
    goal === 'lose'
      ? `Schritt 4 – Ziel Abnehmen: ${formatNumber(tdee, 0)} − 500 = ${formatNumber(tdee - 500, 0)} kcal${tdee - 500 < 1200 ? ' → auf 1.200 kcal angehoben' : ''}`
      : goal === 'gain'
        ? `Schritt 4 – Ziel Zunehmen: ${formatNumber(tdee, 0)} + 300 = ${formatNumber(surplus, 0)} kcal`
        : 'Schritt 4 – Ziel Gewicht halten: Kalorienziel = Gesamtumsatz',
  ];

  const secondary: CalculationResult['secondary'] = [
    { id: 'bmr', label: 'Grundumsatz (BMR bei völliger Ruhe)', value: bmr, formattedValue: `${formatNumber(bmr, 0)} kcal / Tag` },
    { id: 'pal', label: 'PAL-Wert (Aktivität im Alltag)', value: pal, formattedValue: palText },
    { id: 'activityKcal', label: 'Leistungsumsatz (Alltag + Sport)', value: activityKcal, formattedValue: `${formatNumber(activityKcal, 0)} kcal / Tag` },
    { id: 'tdee', label: 'Täglicher Erhaltungsbedarf (TDEE)', value: tdee, formattedValue: `${formatNumber(tdee, 0)} kcal / Tag` },
    { id: 'deficit', label: 'Abnehm-Ziel (-500 kcal Defizit)', value: deficit, formattedValue: `${formatNumber(deficit, 0)} kcal / Tag` },
    { id: 'surplus', label: 'Aufbau-Ziel (+300 kcal Überschuss)', value: surplus, formattedValue: `${formatNumber(surplus, 0)} kcal / Tag` },
  ];
  if (comparisonBmr !== undefined) {
    secondary.push({ id: 'bmrComparison', label: `Grundumsatz zum Vergleich (${comparisonName})`, value: comparisonBmr, formattedValue: `${formatNumber(comparisonBmr, 0)} kcal / Tag` });
  }
  secondary.push(
    { id: 'bmrPerHour', label: 'Grundumsatz pro Stunde', value: bmr / 24, formattedValue: `${formatNumber(bmr / 24, 1)} kcal / Std.` },
    { id: 'tdeeKj', label: 'Gesamtumsatz in Kilojoule', value: tdee * 4.184, formattedValue: `${formatNumber(tdee * 4.184, 0)} kJ / Tag` },
    { id: 'formulaUsed', label: 'Berechnungsmethode', value: formulaName, formattedValue: formulaName },
  );

  let warning: string | undefined;
  if (goal === 'lose' && targetCalories < bmr) {
    warning = 'Das Kalorienziel liegt unter Ihrem Grundumsatz. Ein so großes Defizit sollten Sie nur nach ärztlicher oder ernährungstherapeutischer Beratung einplanen.';
  }

  const goalText = goal === 'lose' ? 'Abnehmen' : goal === 'gain' ? 'Muskelaufbau' : 'Gewicht halten';

  return {
    primary: {
      id: 'targetCal',
      label: primaryLabel,
      value: targetCalories,
      formattedValue: `${formatNumber(targetCalories, 0)} kcal / Tag`,
      highlight: true,
    },
    secondary,
    calculationSteps,
    ...(warning ? { warning } : {}),
    summaryText: `Ihr täglicher Grundumsatz beträgt ${formatNumber(bmr, 0)} kcal (${formulaName}). Mit ${palText}${sportKcal > 0 ? ` und ${formatNumber(sportKcal, 0)} kcal Sport` : ''} liegt Ihr Gesamtumsatz bei ${formatNumber(tdee, 0)} kcal/Tag. Für Ihr Ziel (${goalText}) ergeben sich ${formatNumber(targetCalories, 0)} kcal pro Tag.`,
  };
}

export function calculateWaterIntake(inputs: Record<string, any>): CalculationResult {
  const weight = inputs.weight !== undefined && inputs.weight !== null && String(inputs.weight).trim() !== ''
    ? parseFloat(inputs.weight)
    : 75;
  const sportsMinutes = inputs.sportsMinutes !== undefined && inputs.sportsMinutes !== null && String(inputs.sportsMinutes).trim() !== ''
    ? Math.max(0, parseFloat(inputs.sportsMinutes) || 0)
    : 30; // Sportminuten pro Tag
  const isHotWeather = inputs.isHotWeather === true || inputs.isHotWeather === 'true';

  if (weight <= 0) {
    return {
      primary: { id: 'water', label: 'Wasserbedarf', value: 0, formattedValue: '0 Liter' },
      error: 'Bitte Körpergewicht eingeben.',
    };
  }

  // Faustformel der Deutschen Gesellschaft für Ernährung (DGE):
  // Ca. 35 ml pro kg Körpergewicht
  let baseMl = weight * 35;

  // Zusätzlicher Bedarf bei Sport: ca. 10 ml pro Minute Sport
  baseMl += sportsMinutes * 10;

  // Hitze-Zuschlag: ca. 500 ml
  if (isHotWeather) {
    baseMl += 500;
  }

  const liters = baseMl / 1000;
  const glasses = Math.round(baseMl / 250); // 250ml Gläser

  return {
    primary: {
      id: 'liters',
      label: 'Empfohlene Trinkmenge pro Tag',
      value: liters,
      formattedValue: `${formatNumber(liters, 2)} Liter`,
      highlight: true,
    },
    secondary: [
      { id: 'glasses', label: 'Anzahl Standardgläser (250 ml)', value: glasses, formattedValue: `ca. ${glasses} Gläser` },
      { id: 'base', label: 'Grundbedarf ohne Sport', value: (weight * 35) / 1000, formattedValue: `${formatNumber((weight * 35) / 1000, 2)} Liter` },
      { id: 'sportsPlus', label: 'Zusatzbedarf durch Sport', value: (sportsMinutes * 10) / 1000, formattedValue: `+${formatNumber((sportsMinutes * 10) / 1000, 2)} Liter` },
    ],
    summaryText: `Für ein Körpergewicht von ${formatNumber(weight, 0)} kg und ${sportsMinutes} Min. Aktivität empfiehlt sich eine tägliche Flüssigkeitsaufnahme von ca. ${formatNumber(liters, 2)} Litern (etwa ${glasses} Gläser Wasser).`,
  };
}

export function calculateRunningPace(inputs: Record<string, any>): CalculationResult {
  const distanceKm = inputs.distanceKm !== undefined && inputs.distanceKm !== null && String(inputs.distanceKm).trim() !== ''
    ? parseFloat(inputs.distanceKm)
    : 10;
  const hours = inputs.hours !== undefined && inputs.hours !== null && String(inputs.hours).trim() !== ''
    ? Math.max(0, parseInt(String(inputs.hours), 10) || 0)
    : 0;
  const minutes = inputs.minutes !== undefined && inputs.minutes !== null && String(inputs.minutes).trim() !== ''
    ? Math.max(0, parseInt(String(inputs.minutes), 10) || 0)
    : 50;
  const seconds = inputs.seconds !== undefined && inputs.seconds !== null && String(inputs.seconds).trim() !== ''
    ? Math.max(0, parseInt(String(inputs.seconds), 10) || 0)
    : 0;

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  if (distanceKm <= 0 || totalSeconds <= 0) {
    return {
      primary: { id: 'pace', label: 'Laufpace', value: 0, formattedValue: '0:00 min/km' },
      error: 'Bitte Distanz und gelaufene Zeit eingeben.',
    };
  }

  const secPerKm = totalSeconds / distanceKm;
  const paceMinutes = Math.floor(secPerKm / 60);
  const paceSeconds = Math.round(secPerKm % 60);
  const speedKmh = distanceKm / (totalSeconds / 3600);

  const paceStr = `${paceMinutes}:${paceSeconds < 10 ? '0' : ''}${paceSeconds} min/km`;

  return {
    primary: {
      id: 'pace',
      label: 'Durchschnittliche Pace',
      value: secPerKm,
      formattedValue: paceStr,
      highlight: true,
    },
    secondary: [
      { id: 'speed', label: 'Durchschnittsgeschwindigkeit', value: speedKmh, formattedValue: `${formatNumber(speedKmh, 2)} km/h` },
      { id: 'halfMarathon', label: 'Hochrechnung Halbmarathon (21,1 km)', value: (secPerKm * 21.0975) / 60, formattedValue: formatTimeFromSeconds(secPerKm * 21.0975) },
      { id: 'marathon', label: 'Hochrechnung Marathon (42,2 km)', value: (secPerKm * 42.195) / 60, formattedValue: formatTimeFromSeconds(secPerKm * 42.195) },
    ],
    summaryText: `Für ${formatNumber(distanceKm, 2)} km in ${hours > 0 ? `${hours} Std. ` : ''}${minutes} Min. ${seconds} Sek. beträgt Ihre Pace genau ${paceStr} (${formatNumber(speedKmh, 2)} km/h).`,
  };
}

function formatTimeFromSeconds(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.round(totalSec % 60);
  return `${h > 0 ? `${h}h ` : ''}${m}m ${s < 10 ? '0' : ''}${s}s`;
}
