import { CalculationResult } from '@/types/calculator';
import { formatNumber } from '@/lib/formatters';

export function calculateBMI(inputs: Record<string, any>): CalculationResult {
  const unitSystem = inputs.unitSystem || 'metric'; // 'metric' (kg, cm) vs 'imperial' (lbs, inch)
  let rawWeight = parseFloat(inputs.weight) || 75;
  let rawHeight = parseFloat(inputs.height) || 178;

  let weightKg = rawWeight;
  let heightCm = rawHeight;

  if (unitSystem === 'imperial') {
    // rawWeight in lbs, rawHeight in inches
    weightKg = rawWeight * 0.45359237;
    heightCm = rawHeight * 2.54;
  }

  if (weightKg <= 0 || heightCm <= 0) {
    return {
      primary: { id: 'bmi', label: 'BMI', value: 0, formattedValue: '0' },
      error: 'Bitte positive Werte für Gewicht und Körpergröße eingeben.',
    };
  }

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

  const normalRangeText = unitSystem === 'imperial'
    ? `${formatNumber(minNormalKg * 2.20462, 1)} lbs – ${formatNumber(maxNormalKg * 2.20462, 1)} lbs`
    : `${formatNumber(minNormalKg, 1)} kg – ${formatNumber(maxNormalKg, 1)} kg`;

  return {
    primary: {
      id: 'bmi',
      label: 'Body-Mass-Index (BMI)',
      value: bmi,
      formattedValue: formatNumber(bmi, 1),
      highlight: true,
    },
    secondary: [
      { id: 'category', label: 'WHO-Klassifikation', value: category, formattedValue: category },
      { id: 'normalRange', label: `Normalgewichtsbereich (bei ${formatNumber(rawHeight, 0)} ${unitSystem === 'imperial' ? 'Zoll' : 'cm'})`, value: minNormalKg, formattedValue: normalRangeText },
      { id: 'formula', label: 'Verwendete Formel', value: 'kg / m²', formattedValue: unitSystem === 'imperial' ? '703 × Gewicht (lbs) / Größe (in)²' : 'Gewicht in kg / (Größe in m)²' },
      { id: 'disclaimer', label: 'Medizinischer Hinweis', value: 'Hinweis', formattedValue: 'Dient der Orientierung, ersetzt keine ärztliche Diagnose.' },
    ],
    summaryText: `Ihr Body-Mass-Index beträgt ${formatNumber(bmi, 1)}. Nach der Klassifikation der Weltgesundheitsorganisation (WHO) entspricht dies der Kategorie „${category}“.`,
  };
}

export function calculateCalorieNeeds(inputs: Record<string, any>): CalculationResult {
  const gender = inputs.gender || 'male'; // 'male' or 'female'
  const weight = parseFloat(inputs.weight) || 75;
  const heightCm = parseFloat(inputs.height) || 178;
  const age = parseInt(inputs.age || '30', 10);
  const pal = parseFloat(inputs.activityLevel) || 1.4; // PAL
  const formula = inputs.formula || 'mifflin'; // 'mifflin' vs 'harris_benedict'
  const goal = inputs.goal || 'maintain'; // 'maintain', 'lose', 'gain'

  if (weight <= 0 || heightCm <= 0 || age <= 0) {
    return {
      primary: { id: 'tdee', label: 'Kalorienbedarf', value: 0, formattedValue: '0 kcal' },
      error: 'Bitte vollständige und positive Angaben machen.',
    };
  }

  let bmr = 0;
  let formulaName = 'Mifflin-St Jeor Formel';

  if (formula === 'harris_benedict') {
    // Revidierte Harris-Benedict-Formel (Roza und Shizgal, 1984):
    // Männer: BMR = 88.362 + (13.397 × kg) + (4.799 × cm) - (5.677 × Alter)
    // Frauen: BMR = 447.593 + (9.247 × kg) + (3.098 × cm) - (4.330 × Alter)
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * heightCm) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * heightCm) - (4.330 * age);
    }
    formulaName = 'Revidierte Harris-Benedict-Formel';
  } else {
    // Mifflin-St Jeor Formel:
    const s = gender === 'male' ? 5 : -161;
    bmr = 10 * weight + 6.25 * heightCm - 5 * age + s;
    formulaName = 'Mifflin-St Jeor Formel (Goldstandard)';
  }

  const tdee = bmr * pal; // Gesamtenergieumsatz
  const deficit = Math.max(1200, tdee - 500); // Gesundes Abnehmen ca. 500 kcal Defizit
  const surplus = tdee + 300; // Moderater Muskelaufbau

  let targetCalories = tdee;
  let primaryLabel = 'Gesamtenergiebedarf (Gewicht halten)';
  if (goal === 'lose') {
    targetCalories = deficit;
    primaryLabel = 'Zielkalorien zum gesunden Abnehmen (-500 kcal)';
  } else if (goal === 'gain') {
    targetCalories = surplus;
    primaryLabel = 'Zielkalorien zum Muskelaufbau (+300 kcal)';
  }

  return {
    primary: {
      id: 'targetCal',
      label: primaryLabel,
      value: targetCalories,
      formattedValue: `${formatNumber(targetCalories, 0)} kcal / Tag`,
      highlight: true,
    },
    secondary: [
      { id: 'tdee', label: 'Täglicher Erhaltungsbedarf (TDEE)', value: tdee, formattedValue: `${formatNumber(tdee, 0)} kcal / Tag` },
      { id: 'bmr', label: 'Grundumsatz (BMR bei völliger Ruhe)', value: bmr, formattedValue: `${formatNumber(bmr, 0)} kcal / Tag` },
      { id: 'deficit', label: 'Abnehm-Ziel (-500 kcal Defizit)', value: deficit, formattedValue: `${formatNumber(deficit, 0)} kcal / Tag` },
      { id: 'surplus', label: 'Aufbau-Ziel (+300 kcal Überschuss)', value: surplus, formattedValue: `${formatNumber(surplus, 0)} kcal / Tag` },
      { id: 'formulaUsed', label: 'Berechnungsmethode', value: formulaName, formattedValue: formulaName },
    ],
    summaryText: `Ihr täglicher Grundumsatz beträgt ${formatNumber(bmr, 0)} kcal (${formulaName}). Mit Ihrem Aktivitätslevel (PAL ${pal}) liegt Ihr Erhaltungsbedarf bei ${formatNumber(tdee, 0)} kcal/Tag. Für Ihr gewähltes Ziel (${goal === 'lose' ? 'Abnehmen' : goal === 'gain' ? 'Muskelaufbau' : 'Gewicht halten'}) werden täglich ${formatNumber(targetCalories, 0)} kcal empfohlen.`,
  };
}

export function calculateWaterIntake(inputs: Record<string, any>): CalculationResult {
  const weight = parseFloat(inputs.weight) || 75;
  const sportsMinutes = parseFloat(inputs.sportsMinutes) || 30; // Sportminuten pro Tag
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
  const distanceKm = parseFloat(inputs.distanceKm) || 10;
  const hours = parseInt(inputs.hours || '0', 10);
  const minutes = parseInt(inputs.minutes || '50', 10);
  const seconds = parseInt(inputs.seconds || '0', 10);

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
