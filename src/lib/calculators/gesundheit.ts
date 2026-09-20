import { CalculationResult } from '@/types/calculator';
import { formatNumber } from '@/lib/formatters';

export function calculateBMI(inputs: Record<string, any>): CalculationResult {
  const weight = parseFloat(inputs.weight) || 75;
  const heightCm = parseFloat(inputs.height) || 178;

  if (weight <= 0 || heightCm <= 0) {
    return {
      primary: { id: 'bmi', label: 'BMI', value: 0, formattedValue: '0' },
      error: 'Bitte positive Werte für Gewicht und Körpergröße eingeben.',
    };
  }

  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);

  // WHO Klassifikation
  let category = 'Normalgewicht';
  let color = 'green';

  if (bmi < 18.5) {
    category = 'Untergewicht';
    color = 'blue';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Normalgewicht';
    color = 'green';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Übergewicht (Präadipositas)';
    color = 'orange';
  } else if (bmi >= 30 && bmi < 35) {
    category = 'Adipositas Grad I';
    color = 'red';
  } else if (bmi >= 35 && bmi < 40) {
    category = 'Adipositas Grad II';
    color = 'red';
  } else {
    category = 'Adipositas Grad III (starke Adipositas)';
    color = 'red';
  }

  // Normalgewichtsbereich nach WHO (BMI 18.5 bis 24.9)
  const minNormalWeight = 18.5 * (heightM * heightM);
  const maxNormalWeight = 24.9 * (heightM * heightM);

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
      { id: 'normalRange', label: `Normalgewichtsbereich (bei ${formatNumber(heightCm, 0)} cm)`, value: minNormalWeight, formattedValue: `${formatNumber(minNormalWeight, 1)} kg – ${formatNumber(maxNormalWeight, 1)} kg` },
      { id: 'formula', label: 'Verwendete Formel', value: 'kg / m²', formattedValue: 'Gewicht in kg / (Größe in m)²' },
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
  const pal = parseFloat(inputs.activityLevel) || 1.4; // PAL (Physical Activity Level) 1.2 sitzend, 1.4 leicht, 1.6 mäßig, 1.8 schwer

  if (weight <= 0 || heightCm <= 0 || age <= 0) {
    return {
      primary: { id: 'tdee', label: 'Kalorienbedarf', value: 0, formattedValue: '0 kcal' },
      error: 'Bitte vollständige und positive Angaben machen.',
    };
  }

  // Mifflin-St Jeor Formel:
  // BMR = 10 * Gewicht (kg) + 6.25 * Größe (cm) - 5 * Alter (Jahre) + s
  // s = +5 für Männer, -161 für Frauen
  const s = gender === 'male' ? 5 : -161;
  const bmr = 10 * weight + 6.25 * heightCm - 5 * age + s;
  const tdee = bmr * pal; // Gesamtenergieumsatz

  // Ziele:
  const deficit = Math.max(1200, tdee - 500); // Gesundes Abnehmen ca. 500 kcal Defizit
  const surplus = tdee + 300; // Moderater Muskelaufbau

  return {
    primary: {
      id: 'tdee',
      label: 'Gesamtenergiebedarf (TDEE)',
      value: tdee,
      formattedValue: `${formatNumber(tdee, 0)} kcal / Tag`,
      highlight: true,
    },
    secondary: [
      { id: 'bmr', label: 'Grundumsatz (BMR bei völliger Ruhe)', value: bmr, formattedValue: `${formatNumber(bmr, 0)} kcal / Tag` },
      { id: 'deficit', label: 'Kalorienziel zum gesunden Abnehmen (-500 kcal)', value: deficit, formattedValue: `${formatNumber(deficit, 0)} kcal` },
      { id: 'surplus', label: 'Kalorienziel zum Muskelaufbau (+300 kcal)', value: surplus, formattedValue: `${formatNumber(surplus, 0)} kcal` },
      { id: 'formula', label: 'Wissenschaftliche Berechnung', value: 'Mifflin-St Jeor', formattedValue: 'Mifflin-St Jeor Formel' },
    ],
    summaryText: `Ihr täglicher Grundumsatz beträgt ${formatNumber(bmr, 0)} kcal. Unter Berücksichtigung Ihres Aktivitätslevels (PAL ${pal}) liegt Ihr Gesamtumsatz (TDEE) bei ${formatNumber(tdee, 0)} kcal pro Tag.`,
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
