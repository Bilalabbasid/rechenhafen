import { CalculationResult } from '@/types/calculator';
import { formatNumber } from '@/lib/formatters';

export function calculateGradeAverage(inputs: Record<string, any>): CalculationResult {
  const mode = inputs.calculationMode || 'simple'; // 'simple' | 'weighted'

  if (mode === 'weighted') {
    const rawWeighted = String(inputs.weightedGrades || inputs.grades || '1,7 * 5; 2,3 * 10; 1,3 * 6; 2,0 * 5');
    // Split entries by semicolon, comma-followed-by-number, or newline
    const entries = rawWeighted
      .split(/[;\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const parsedItems: { grade: number; weight: number; product: number; raw: string }[] = [];

    for (const entry of entries) {
      // Formats supported:
      // "1,7 * 5", "1.7 x 5", "1,7 (5)", "1,7:5", "Note: 1,7 / Gewicht: 5", "1,7" (defaults to weight 1)
      const clean = entry.replace(/ECTS|CP|Credits|Punkte|Gewicht/gi, '').trim();
      const match = clean.match(/^([0-9]+[.,]?[0-9]*)\s*[*xX:(]?\s*([0-9]+[.,]?[0-9]*)?\)?$/);

      if (match) {
        const gradeVal = parseFloat(match[1].replace(',', '.'));
        const weightVal = match[2] ? parseFloat(match[2].replace(',', '.')) : 1.0;

        if (Number.isFinite(gradeVal) && gradeVal >= 0.7 && gradeVal <= 6.0 && Number.isFinite(weightVal) && weightVal > 0) {
          parsedItems.push({
            grade: gradeVal,
            weight: weightVal,
            product: gradeVal * weightVal,
            raw: entry,
          });
        }
      }
    }

    if (parsedItems.length === 0) {
      return {
        primary: { id: 'averageGrade', label: 'Notendurchschnitt (gewichtet)', value: 0, formattedValue: '-' },
        error: 'Bitte mindestens eine gültige Note (1,0 bis 6,0) mit Gewichtung (z. B. „1,7 * 5 ECTS“ oder „2,0 (10)“) eingeben.',
      };
    }

    const totalWeight = parsedItems.reduce((acc, item) => acc + item.weight, 0);
    const totalWeightedPoints = parsedItems.reduce((acc, item) => acc + item.product, 0);
    const weightedAvg = totalWeightedPoints / totalWeight;
    const gradesOnly = parsedItems.map((i) => i.grade);
    const best = Math.min(...gradesOnly);
    const worst = Math.max(...gradesOnly);

    return {
      primary: {
        id: 'averageGrade',
        label: 'Gewichteter Notendurchschnitt',
        value: weightedAvg,
        formattedValue: formatNumber(weightedAvg, 2),
        highlight: true,
      },
      secondary: [
        { id: 'modeLabel', label: 'Berechnungsverfahren', value: 0, formattedValue: 'Gewichtetes Mittel (z. B. nach ECTS / Modul-Credits)' },
        { id: 'count', label: 'Anzahl gewichteter Noten', value: parsedItems.length, formattedValue: `${parsedItems.length} Module / Fächer` },
        { id: 'totalWeight', label: 'Gesamtsumme Gewichte (ECTS / Credits)', value: totalWeight, formattedValue: formatNumber(totalWeight, 1) },
        { id: 'totalWeightedPoints', label: 'Summe der Produkte (Note × Gewicht)', value: totalWeightedPoints, formattedValue: formatNumber(totalWeightedPoints, 2) },
        { id: 'best', label: 'Beste Einzelnote', value: best, formattedValue: formatNumber(best, 1) },
        { id: 'worst', label: 'Schlechteste Einzelnote', value: worst, formattedValue: formatNumber(worst, 1) },
      ],
      basisSummary: [
        { label: 'Eingabemodus', value: 'Gewichteter Notendurchschnitt' },
        { label: 'Berücksichtigte Einträge', value: parsedItems.map((p) => `${formatNumber(p.grade, 1)} (Gewicht: ${formatNumber(p.weight, 1)})`).join('; ') },
        { label: 'Gesamtgewicht (ECTS/Faktoren)', value: formatNumber(totalWeight, 1) },
        { label: 'Summe Note × Gewicht', value: formatNumber(totalWeightedPoints, 2) },
      ],
      breakdown: {
        columns: [
          { key: 'subject', label: 'Fach / Eintrag' },
          { key: 'grade', label: 'Note' },
          { key: 'weight', label: 'Gewicht / ECTS' },
          { key: 'product', label: 'Gewichtetes Produkt' },
        ],
        rows: parsedItems.map((p, idx) => ({
          period: `Modul / Fach ${idx + 1}`,
          values: {
            subject: `Modul / Fach ${idx + 1}`,
            grade: formatNumber(p.grade, 1),
            weight: formatNumber(p.weight, 1),
            product: formatNumber(p.product, 2),
          },
        })),
      },
      calculationSteps: [
        `Schritt 1 (Gewichtung): Noten mit ECTS/Gewicht multiplizieren → Gesamtsumme der Produkte = ${formatNumber(totalWeightedPoints, 2)}`,
        `Schritt 2 (Mittelwert): Summe der Produkte durch Gesamtgewicht teilen → ${formatNumber(totalWeightedPoints, 2)} ÷ ${formatNumber(totalWeight, 1)} = ${formatNumber(weightedAvg, 2)}`,
      ],
      summaryText: `Aus ${parsedItems.length} Modulen mit insgesamt ${formatNumber(totalWeight, 1)} Credit Points / Gewichtungseinheiten ergibt sich ein gewichteter Notenschnitt von ${formatNumber(weightedAvg, 2)}.`,
      notes: [
        'Hinweis zu Prüfungsordnungen (PO): Viele Universitäten und Hochschulen runden erst das Endergebnis oder schneiden Dezimalstellen nach der ersten oder zweiten Nachkommastelle ungerundet ab. Unbenotete Studienleistungen (z. B. bestanden / unbenotet) fließen nicht in den Notenschnitt ein.',
      ],
    };
  }

  // Simple arithmetic average (default)
  const gradesInput = String(inputs.grades || '2; 1; 3; 2; 1.5; 2.7');
  const grades = gradesInput
    .split(/[;, \n]+/)
    .map((s) => s.trim().replace(',', '.'))
    .filter((s) => s.length > 0)
    .map(Number)
    .filter((n) => Number.isFinite(n) && n >= 0.7 && n <= 6.0);

  if (grades.length === 0) {
    return {
      primary: { id: 'averageGrade', label: 'Notendurchschnitt', value: 0, formattedValue: '-' },
      error: 'Bitte mindestens eine gültige Schulnote zwischen 1,0 und 6,0 eingeben.',
    };
  }

  const sum = grades.reduce((acc, g) => acc + g, 0);
  const avg = sum / grades.length;
  const best = Math.min(...grades);
  const worst = Math.max(...grades);

  return {
    primary: {
      id: 'averageGrade',
      label: 'Notendurchschnitt (arithmetisch)',
      value: avg,
      formattedValue: formatNumber(avg, 2),
      highlight: true,
    },
    secondary: [
      { id: 'modeLabel', label: 'Berechnungsverfahren', value: 0, formattedValue: 'Einfaches arithmetisches Mittel (gleiche Gewichtung)' },
      { id: 'count', label: 'Anzahl eingetragener Noten', value: grades.length, formattedValue: `${grades.length} Noten` },
      { id: 'best', label: 'Beste Note', value: best, formattedValue: formatNumber(best, 1) },
      { id: 'worst', label: 'Schlechteste Note', value: worst, formattedValue: formatNumber(worst, 1) },
      { id: 'sum', label: 'Notensumme', value: sum, formattedValue: formatNumber(sum, 2) },
    ],
    basisSummary: [
      { label: 'Berechnungsmodus', value: 'Einfacher Durchschnitt (gleichwertige Fächer)' },
      { label: 'Eingetragene Noten', value: grades.map((g) => formatNumber(g, 1)).join(', ') },
      { label: 'Anzahl Noten', value: `${grades.length}` },
      { label: 'Notensumme', value: formatNumber(sum, 2) },
    ],
    calculationSteps: [
      `Schritt 1: Noten aufsummieren → Summe = ${formatNumber(sum, 2)}`,
      `Schritt 2: Notensumme durch Anzahl der Noten dividieren → ${formatNumber(sum, 2)} ÷ ${grades.length} = ${formatNumber(avg, 2)}`,
    ],
    summaryText: `Aus ${grades.length} eingetragenen Noten ergibt sich ein arithmetischer Notenschnitt von ${formatNumber(avg, 2)}.`,
    notes: [
      'Gleichgewichtung: Jedes Fach zählt hier exakt gleich viel. Wenn Fächer wie Hauptfächer, Leistungskurse oder Uni-Module unterschiedlich gewichtet werden sollen, wechseln Sie auf die Option „Gewichteter Durchschnitt (ECTS / Gewichtung)“.',
    ],
  };
}

export function calculateStandardDeviation(inputs: Record<string, any>): CalculationResult {
  const rawInput = String(inputs.values || '12; 15; 18; 11; 19; 14; 16');
  const vals = rawInput
    .split(/[;, \n]+/)
    .map((s) => s.trim().replace(',', '.'))
    .filter((s) => s.length > 0)
    .map(Number)
    .filter((n) => Number.isFinite(n));

  if (vals.length < 2) {
    return {
      primary: { id: 'sd', label: 'Standardabweichung', value: 0, formattedValue: '0' },
      error: 'Zur Berechnung der Stichproben-Standardabweichung werden mindestens zwei Zahlenwerte benötigt.',
    };
  }

  const n = vals.length;
  const mean = vals.reduce((a, b) => a + b, 0) / n;
  // Empirische Stichprobenvarianz (Bessel-Korrektur n-1)
  const sumSquaredDiffs = vals.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  const sampleVariance = sumSquaredDiffs / (n - 1);
  const sampleSd = Math.sqrt(sampleVariance);

  // Populations-Standardabweichung (Teilung durch n)
  const populationVariance = sumSquaredDiffs / n;
  const populationSd = Math.sqrt(populationVariance);

  return {
    primary: {
      id: 'sampleSd',
      label: 'Stichproben-Standardabweichung (s)',
      value: sampleSd,
      formattedValue: formatNumber(sampleSd, 4),
      highlight: true,
    },
    secondary: [
      { id: 'mean', label: 'Arithmetischer Mittelwert (x̄)', value: mean, formattedValue: formatNumber(mean, 4) },
      { id: 'sampleVar', label: 'Stichproben-Varianz (s²)', value: sampleVariance, formattedValue: formatNumber(sampleVariance, 4) },
      { id: 'popSd', label: 'Populations-Standardabweichung (σ)', value: populationSd, formattedValue: formatNumber(populationSd, 4) },
      { id: 'count', label: 'Stichprobenumfang (n)', value: n, formattedValue: `${n} Werte` },
    ],
    summaryText: `Für die ${n} Werte beträgt der Mittelwert ${formatNumber(mean, 2)}, die Standardabweichung der Stichprobe s = ${formatNumber(sampleSd, 4)} und die Varianz s² = ${formatNumber(sampleVariance, 4)}.`,
  };
}

export function calculateOhmsLaw(inputs: Record<string, any>): CalculationResult {
  const target = inputs.target || 'voltage'; // 'voltage' (U), 'current' (I), 'resistance' (R), 'power' (P)
  const u = parseFloat(inputs.voltage) || 230; // Volt
  const i = parseFloat(inputs.current) || 10;  // Ampere
  const r = parseFloat(inputs.resistance) || 23; // Ohm

  let voltage = u;
  let current = i;
  let resistance = r;

  if (target === 'voltage') {
    voltage = current * resistance;
  } else if (target === 'current') {
    current = resistance > 0 ? voltage / resistance : 0;
  } else if (target === 'resistance') {
    resistance = current > 0 ? voltage / current : 0;
  }

  const powerWatts = voltage * current; // P = U * I

  return {
    primary: {
      id: 'primaryResult',
      label: target === 'voltage' ? 'Elektrische Spannung (U)' : (target === 'current' ? 'Stromstärke (I)' : 'Elektrischer Widerstand (R)'),
      value: target === 'voltage' ? voltage : (target === 'current' ? current : resistance),
      formattedValue: target === 'voltage' ? `${formatNumber(voltage, 2)} V` : (target === 'current' ? `${formatNumber(current, 3)} A` : `${formatNumber(resistance, 2)} Ω`),
      highlight: true,
    },
    secondary: [
      { id: 'power', label: 'Elektrische Leistung (P = U · I)', value: powerWatts, formattedValue: `${formatNumber(powerWatts, 2)} W (${formatNumber(powerWatts / 1000, 3)} kW)` },
      { id: 'v', label: 'Spannung (U)', value: voltage, formattedValue: `${formatNumber(voltage, 2)} Volt` },
      { id: 'c', label: 'Stromstärke (I)', value: current, formattedValue: `${formatNumber(current, 3)} Ampere` },
      { id: 'r', label: 'Widerstand (R)', value: resistance, formattedValue: `${formatNumber(resistance, 2)} Ohm` },
    ],
    summaryText: `Nach dem Ohmschen Gesetz (U = R · I) beträgt die elektrische Leistung ${formatNumber(powerWatts, 2)} Watt bei ${formatNumber(voltage, 2)} V und ${formatNumber(current, 3)} A.`,
  };
}
