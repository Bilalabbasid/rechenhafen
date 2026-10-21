import { CalculationResult, ResultItem } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';
import { EMISSION_FACTORS } from '@/data/emissions';

/**
 * 1. CO2-Strom-Rechner Engine
 * 
 * Supports:
 * - kWh, selected period (Monat / Jahr / eigener Zeitraum)
 * - Verified UBA dataset (344 g CO2/kWh 2025 inland generation) or custom factor
 * - Optional comparison consumption for the same period
 * - Formula: kg CO2 = kWh × g CO2/kWh ÷ 1,000; tonnes CO2 = kg CO2 ÷ 1,000
 */
export function calculateElectricityCO2(inputs: Record<string, any>): CalculationResult {
  if (inputs.consumptionKwh === undefined || inputs.consumptionKwh === null || String(inputs.consumptionKwh).trim() === '') {
    return {
      primary: { id: 'co2', label: 'CO2-Ausstoß', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie Ihren Stromverbrauch in Kilowattstunden (kWh) an.',
    };
  }

  const kwh = parseFloat(String(inputs.consumptionKwh).replace(',', '.'));
  if (isNaN(kwh) || kwh < 0) {
    return {
      primary: { id: 'co2', label: 'CO2-Ausstoß', value: 0, formattedValue: '-' },
      error: 'Der Stromverbrauch darf nicht negativ sein (0 kWh ist zulässig).',
    };
  }

  const periodKey = String(inputs.period || 'year'); // 'year' | 'month' | 'custom'
  let periodText = 'Jahr';
  if (periodKey === 'month') periodText = 'Monat';
  else if (periodKey === 'custom') periodText = 'gewählten Zeitraum';

  const factorSelection = String(inputs.factorType || inputs.tariffType || 'uba_2025');

  let factorGrams = EMISSION_FACTORS.strom_mix_de_generation_2025.value; // 344 g/kWh
  let factorLabel = 'Deutschland, Datenjahr 2025: 344 g CO₂/kWh (UBA-Schätzung; Stromerzeugung)';
  let dataYear = 2025;
  let boundaryText = 'Direkte Stromerzeugung in Inlandskraftwerken (Scope 2, ohne Vorkette)';
  let gasType: 'CO2' | 'CO2e' = 'CO2';

  if (factorSelection === 'grid_lifecycle') {
    factorGrams = EMISSION_FACTORS.strom_mix_de_lifecycle_2025.value; // 410 g/kWh
    factorLabel = 'Deutschland, Datenjahr 2025: 410 g CO₂e/kWh (UBA/GEMIS Lebenszyklus inkl. Vorkette)';
    dataYear = 2025;
    gasType = 'CO2e';
    boundaryText = 'Well-to-Wheel / Lebenszyklus inkl. Brennstoffvorkette und Leitungsverluste';
  } else if (factorSelection === 'green_lifecycle') {
    factorGrams = EMISSION_FACTORS.strom_oekostrom_lifecycle.value; // 25 g/kWh
    factorLabel = 'Zertifizierter Ökostrom aus Neuanlagen: 25 g CO₂e/kWh (Lebenszyklus PV/Wind)';
    dataYear = 2025;
    gasType = 'CO2e';
    boundaryText = 'Lebenszyklus PV / Wind (Herstellung, Montage, Wartung & Rückbau)';
  } else if (factorSelection === 'custom') {
    const rawCustom = inputs.customFactor !== undefined && inputs.customFactor !== null && String(inputs.customFactor).trim() !== ''
      ? parseFloat(String(inputs.customFactor).replace(',', '.'))
      : (inputs.customFactorGrams !== undefined && String(inputs.customFactorGrams).trim() !== ''
          ? parseFloat(String(inputs.customFactorGrams).replace(',', '.'))
          : 344);
    factorGrams = isNaN(rawCustom) || rawCustom < 0 ? 344 : rawCustom;
    factorLabel = `Benutzerdefinierter Faktor: ${formatNumber(factorGrams, 0)} g CO₂/kWh`;
    dataYear = inputs.customYear ? parseInt(String(inputs.customYear), 10) : 2025;
    boundaryText = 'Benutzerdefinierte Eingabe';
  }

  const totalKg = (kwh * factorGrams) / 1000;
  const totalTonnes = totalKg / 1000;

  // Comparison scenario (optional)
  let compareKg: number | null = null;
  let diffKg: number | null = null;
  let diffText = '';

  const hasCompare = inputs.compareConsumptionKwh !== undefined && inputs.compareConsumptionKwh !== null && String(inputs.compareConsumptionKwh).trim() !== '';
  if (hasCompare) {
    const compKwh = parseFloat(String(inputs.compareConsumptionKwh).replace(',', '.'));
    if (!isNaN(compKwh) && compKwh >= 0) {
      compareKg = (compKwh * factorGrams) / 1000;
      diffKg = compareKg - totalKg;

      if (totalKg === 0) {
        diffText = diffKg >= 0
          ? `Vergleichsverbrauch erzeugt +${formatNumber(diffKg, 1)} kg CO₂ mehr (Basiswert: 0 kg).`
          : `Vergleichsverbrauch erzeugt ${formatNumber(Math.abs(diffKg), 1)} kg CO₂ weniger.`;
      } else {
        const pctChange = (diffKg / totalKg) * 100;
        if (diffKg > 0) {
          diffText = `Mehrausstoß im Vergleichsszenario: +${formatNumber(diffKg, 1)} kg CO₂ (+${formatPercent(pctChange, 1)} Zunahme).`;
        } else if (diffKg < 0) {
          diffText = `Minderung im Vergleichsszenario: -${formatNumber(Math.abs(diffKg), 1)} kg CO₂ (-${formatPercent(Math.abs(pctChange), 1)} Einsparung).`;
        } else {
          diffText = 'Beide Verbrauchswerte erzeugen identische CO₂-Emissionen.';
        }
      }
    }
  }

  // Exact template per prompt:
  // "Für {verbrauch} kWh im Zeitraum {zeitraum} ergeben sich mit dem gewählten Faktor rechnerisch {kg} kg CO₂. Verwendet wurden {faktor} g CO₂ je kWh aus dem Datenjahr {jahr}."
  const formattedKg = formatNumber(totalKg, totalKg < 10 && totalKg > 0 ? 2 : 1);
  const directAnswerText = `Für ${formatNumber(kwh, 0)} kWh im Zeitraum ${periodText} ergeben sich mit dem gewählten Faktor rechnerisch ${formattedKg} kg ${gasType}. Verwendet wurden ${formatNumber(factorGrams, 0)} g ${gasType} je kWh aus dem Datenjahr ${dataYear}.`;

  const secondary: ResultItem[] = [
    {
      id: 'totalKg',
      label: `Emissionen (${periodText})`,
      value: totalKg,
      formattedValue: `${formattedKg} kg ${gasType}`,
      highlight: true,
      helpText: `${formatNumber(kwh, 0)} kWh × ${formatNumber(factorGrams, 0)} g/kWh ÷ 1.000`,
    },
    {
      id: 'totalTonnes',
      label: 'Emissionen in Tonnen',
      value: totalTonnes,
      formattedValue: `${formatNumber(totalTonnes, 3)} t ${gasType}`,
      helpText: `${formattedKg} kg ÷ 1.000`,
    },
    {
      id: 'factorUsed',
      label: 'Angewendeter Emissionsfaktor',
      value: factorGrams,
      formattedValue: `${formatNumber(factorGrams, 0)} g ${gasType}/kWh`,
      helpText: factorLabel,
    },
  ];

  if (compareKg !== null && diffKg !== null) {
    secondary.push({
      id: 'comparisonResult',
      label: `Vergleichsverbrauch (${formatNumber(parseFloat(String(inputs.compareConsumptionKwh)), 0)} kWh)`,
      value: compareKg,
      formattedValue: `${formatNumber(compareKg, 1)} kg ${gasType}`,
      helpText: diffText,
      highlight: true,
    });
  }

  return {
    primary: {
      id: 'co2Primary',
      label: `CO2-Ausstoß (${periodText})`,
      value: totalTonnes >= 1 ? totalTonnes : totalKg,
      formattedValue: totalTonnes >= 1 ? `${formatNumber(totalTonnes, 2)} Tonnen ${gasType}` : `${formattedKg} kg ${gasType}`,
      highlight: true,
    },
    secondary,
    directAnswer: directAnswerText,
    summaryText: directAnswerText,
    basisSummary: [
      { label: 'Stromverbrauch', value: `${formatNumber(kwh, 0)} kWh` },
      { label: 'Zeitraum', value: periodText },
      { label: 'Emissionsfaktor', value: `${formatNumber(factorGrams, 0)} g ${gasType}/kWh` },
      { label: 'Datenjahr', value: String(dataYear) },
      { label: 'Bilanzgrenze', value: boundaryText },
    ],
    calculationSteps: [
      `Formel: Stromverbrauch in kWh × Emissionsfaktor in g/kWh ÷ 1.000 = kg ${gasType}`,
      `Berechnung: ${formatNumber(kwh, 0)} kWh × ${formatNumber(factorGrams, 0)} g/kWh ÷ 1.000 = ${formattedKg} kg ${gasType}`,
      totalTonnes >= 1
        ? `Umrechnung in Tonnen: ${formattedKg} kg ÷ 1.000 = ${formatNumber(totalTonnes, 3)} t ${gasType}`
        : `Ergebnis in Kilogramm: ${formattedKg} kg ${gasType}`,
      diffText ? `Vergleich: ${diffText}` : '',
    ].filter(Boolean),
    qualifications: [
      'Das Ergebnis beschreibt die vom gewählten Faktor erfassten Emissionen. Es ist keine vollständige Klimabilanz Ihres Haushalts.',
      'Der Standardwert von 344 g CO₂/kWh basiert auf der UBA-Schätzung für den deutschen Strommix im Datenjahr 2025 (publiziert März 2026) und erfasst Emissionen der Stromerzeugung (Scope 2).',
      'Andere Bereiche wie Heizung, Mobilität, Ernährung oder Konsum sowie Herstellung und Entsorgung elektrischer Haushaltsgeräte sind darin nicht enthalten.',
    ],
  };
}

/**
 * 2. CO2-Pendeln-Rechner Engine
 * 
 * Supports:
 * - Scenario A: one-way distance (km), actual commuting days, transport mode
 * - Scenario B (optional): independent distance, days, and transport mode
 * - Formula: annual passenger-km = one-way distance × 2 × commuting days
 *            kg CO2e = passenger-km × g CO2e/passenger-km ÷ 1,000
 * - UBA 2024 TREMOD averages per passenger-km (strictly no double dividing by passengers)
 */
export function calculateCommutingCO2(inputs: Record<string, any>): CalculationResult {
  if (inputs.oneWayDistanceKm === undefined || inputs.oneWayDistanceKm === null || String(inputs.oneWayDistanceKm).trim() === '') {
    return {
      primary: { id: 'emissions', label: 'Pendel-Emissionen', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die einfache Entfernung zum Arbeitsplatz in Kilometern an.',
    };
  }

  const oneWayA = parseFloat(String(inputs.oneWayDistanceKm).replace(',', '.'));
  if (isNaN(oneWayA) || oneWayA < 0) {
    return {
      primary: { id: 'emissions', label: 'Pendel-Emissionen', value: 0, formattedValue: '-' },
      error: 'Die einfache Entfernung darf nicht negativ sein (0 km ist zulässig).',
    };
  }

  const daysA = inputs.commutingDays !== undefined && inputs.commutingDays !== null && String(inputs.commutingDays).trim() !== ''
    ? Math.max(0, parseInt(String(inputs.commutingDays), 10) || 0)
    : 180;

  // Annual passenger-km Scenario A (always doubled for return trip)
  const annualKmA = oneWayA * 2 * daysA;

  // Mode factors (UBA TREMOD 2024 Well-to-Wheel CO2e per passenger-km)
  const modeFactors: Record<string, { value: number; label: string }> = {
    car_average: { value: 164, label: 'Pkw Durchschnitt (164 g CO₂e/Pkm)' },
    car_solo: { value: 164, label: 'Pkw Alleinfahrt (164 g CO₂e/Pkm)' },
    train_long: { value: 44, label: 'Eisenbahn Fernverkehr (ICE/IC – 44 g CO₂e/Pkm)' },
    train_local: { value: 79, label: 'Eisenbahn Nahverkehr (Regionalbahn/S-Bahn – 79 g CO₂e/Pkm)' },
    bus_local: { value: 108, label: 'Linienbus ÖPNV (108 g CO₂e/Pkm)' },
    tram_metro: { value: 79, label: 'Straßenbahn / U-Bahn (79 g CO₂e/Pkm)' },
    bike_walk: { value: 0, label: 'Fahrrad / zu Fuß (0 g CO₂e/Pkm)' },
    ebike: { value: 4, label: 'Pedelec / E-Bike (4 g CO₂e/Pkm)' },
  };

  const modeKeyA = String(inputs.transportMode || inputs.primaryMode || 'car_average');
  let factorA = modeFactors[modeKeyA]?.value ?? 164;
  let labelA = modeFactors[modeKeyA]?.label ?? 'Pkw Durchschnitt (164 g CO₂e/Pkm)';

  // Support vehicle-based custom model if specified
  if (modeKeyA === 'car_diesel') {
    const cons = parseFloat(String(inputs.carConsumption || '5.5').replace(',', '.')) || 5.5;
    const occ = Math.max(1, parseInt(String(inputs.carOccupancy || '1'), 10) || 1);
    // Well-to-Wheel Diesel: 3.24 kg CO2e / l
    factorA = ((cons * 3.24 * 1000) / 100) / occ;
    labelA = `Eigener Diesel-Pkw (${formatNumber(cons, 1)} l/100 km, ${occ} ${occ === 1 ? 'Person' : 'Personen'})`;
  } else if (modeKeyA === 'car_petrol') {
    const cons = parseFloat(String(inputs.carConsumption || '6.8').replace(',', '.')) || 6.8;
    const occ = Math.max(1, parseInt(String(inputs.carOccupancy || '1'), 10) || 1);
    // Well-to-Wheel Benzin: 2.82 kg CO2e / l
    factorA = ((cons * 2.82 * 1000) / 100) / occ;
    labelA = `Eigener Benzin-Pkw (${formatNumber(cons, 1)} l/100 km, ${occ} ${occ === 1 ? 'Person' : 'Personen'})`;
  } else if (modeKeyA === 'car_electric') {
    const cons = parseFloat(String(inputs.carConsumption || '18.0').replace(',', '.')) || 18.0;
    const occ = Math.max(1, parseInt(String(inputs.carOccupancy || '1'), 10) || 1);
    // Strommix 2025 Lebenszyklus: 410 g CO2e / kWh
    factorA = ((cons * 0.410 * 1000) / 100) / occ;
    labelA = `Eigener Elektro-Pkw (${formatNumber(cons, 1)} kWh/100 km)`;
  }

  const emissionsKgA = (annualKmA * factorA) / 1000;
  const emissionsTonnesA = emissionsKgA / 1000;

  // Exact template per prompt:
  // "Bei {distanz} km einfacher Strecke und {tage} Pendeltagen legen Sie einschließlich Rückweg {jahresstrecke} km im Jahr zurück. Mit dem gewählten Durchschnittsfaktor ergibt das rund {emissionen} kg CO₂e pro Person."
  const formattedEmissionA = formatNumber(emissionsKgA, emissionsKgA < 10 && emissionsKgA > 0 ? 1 : 0);
  const directAnswerA = `Bei ${formatNumber(oneWayA, 0)} km einfacher Strecke und ${daysA} Pendeltagen legen Sie einschließlich Rückweg ${formatNumber(annualKmA, 0)} km im Jahr zurück. Mit dem gewählten Durchschnittsfaktor ergibt das rund ${formattedEmissionA} kg CO₂e pro Person.`;

  // Scenario B (comparison)
  const hasScenarioB = Boolean(
    inputs.enableScenarioB ||
    inputs.comparisonMode ||
    inputs.comparisonDistanceKm !== undefined ||
    inputs.differentComparisonDistance
  );

  let oneWayB = oneWayA;
  if (inputs.comparisonDistanceKm !== undefined && inputs.comparisonDistanceKm !== null && String(inputs.comparisonDistanceKm).trim() !== '') {
    oneWayB = Math.max(0, parseFloat(String(inputs.comparisonDistanceKm).replace(',', '.')) || 0);
  }

  let daysB = daysA;
  if (inputs.comparisonDays !== undefined && inputs.comparisonDays !== null && String(inputs.comparisonDays).trim() !== '') {
    daysB = Math.max(0, parseInt(String(inputs.comparisonDays), 10) || 0);
  }

  const modeKeyB = String(inputs.comparisonMode || 'train_long');
  const factorB = modeFactors[modeKeyB]?.value ?? 44;
  const labelB = modeFactors[modeKeyB]?.label ?? 'Eisenbahn Fernverkehr (ICE/IC – 44 g CO₂e/Pkm)';

  const annualKmB = oneWayB * 2 * daysB;
  const emissionsKgB = (annualKmB * factorB) / 1000;
  const diffKg = emissionsKgA - emissionsKgB; // positive = savings with B

  const secondary: ResultItem[] = [
    {
      id: 'totalKm',
      label: 'Jahresstrecke (inkl. Rückweg)',
      value: annualKmA,
      formattedValue: `${formatNumber(annualKmA, 0)} km/Jahr`,
      helpText: `${formatNumber(oneWayA, 0)} km × 2 × ${daysA} Pendeltage = ${formatNumber(annualKmA, 0)} Personenkilometer`,
    },
    {
      id: 'emissionsKg',
      label: 'Emissionen in Kilogramm',
      value: emissionsKgA,
      formattedValue: `${formattedEmissionA} kg CO₂e/Jahr`,
      highlight: true,
      helpText: `${formatNumber(annualKmA, 0)} Pkm × ${formatNumber(factorA, 1)} g/Pkm ÷ 1.000`,
    },
  ];

  if (hasScenarioB) {
    secondary.push(
      {
        id: 'compEmissions',
        label: `Emissionen Variante B (${labelB.split('(')[0].trim()})`,
        value: emissionsKgB,
        formattedValue: `${formatNumber(emissionsKgB, emissionsKgB < 10 && emissionsKgB > 0 ? 1 : 0)} kg CO₂e/Jahr`,
        highlight: true,
        helpText: `${formatNumber(annualKmB, 0)} Pkm × ${formatNumber(factorB, 0)} g/Pkm ÷ 1.000`,
      },
      {
        id: 'savings',
        label: diffKg >= 0 ? 'Rechnerische Minderung mit Variante B' : 'Zusätzliche Emissionen Variante B',
        value: Math.abs(diffKg),
        formattedValue: `${formatNumber(Math.abs(diffKg), 0)} kg CO₂e/Jahr`,
        highlight: true,
        helpText: diffKg >= 0
          ? `Einsparung von ${formatNumber(diffKg, 0)} kg CO₂e (${formatPercent((diffKg / Math.max(1, emissionsKgA)) * 100, 0)} Minderung).`
          : `Mehrausstoß von ${formatNumber(Math.abs(diffKg), 0)} kg CO₂e.`,
      }
    );
  }

  // Homeoffice impact helper if specified
  if (inputs.homeofficeDaysPerWeek && parseInt(String(inputs.homeofficeDaysPerWeek), 10) > 0) {
    const hoDaysPerW = Math.min(5, Math.max(1, parseInt(String(inputs.homeofficeDaysPerWeek), 10)));
    const hoSavedDays = Math.round((hoDaysPerW / 5) * daysA);
    const hoSavedKm = oneWayA * 2 * hoSavedDays;
    const hoSavedKg = (hoSavedKm * factorA) / 1000;
    secondary.push({
      id: 'homeofficeSaving',
      label: `Homeoffice-Effekt (${hoDaysPerW} Tag/Woche)`,
      value: hoSavedKg,
      formattedValue: `${formatNumber(hoSavedKg, 0)} kg CO₂e Minderung`,
      helpText: `Entfällt an ${hoSavedDays} Tagen das Pendeln (${formatNumber(hoSavedKm, 0)} km). Hinweis: Zusätzlicher Strom- oder Heizverbrauch zu Hause ist nicht berechnet.`,
    });
  }

  return {
    primary: {
      id: 'primaryEmissions',
      label: 'CO2e-Emissionen Arbeitsweg',
      value: emissionsTonnesA >= 1 ? emissionsTonnesA : emissionsKgA,
      formattedValue: emissionsTonnesA >= 1 ? `${formatNumber(emissionsTonnesA, 2)} Tonnen CO₂e/Jahr` : `${formattedEmissionA} kg CO₂e/Jahr`,
      highlight: true,
    },
    secondary,
    directAnswer: directAnswerA,
    summaryText: directAnswerA,
    basisSummary: [
      { label: 'Einfache Strecke', value: `${formatNumber(oneWayA, 0)} km` },
      { label: 'Tatsächliche Pendeltage', value: `${daysA} Tage/Jahr` },
      { label: 'Jahres-Fahrleistung', value: `${formatNumber(annualKmA, 0)} Personenkilometer (Pkm)` },
      { label: 'Verkehrsmittel Variante A', value: labelA },
      ...(hasScenarioB ? [
        { label: 'Strecke Variante B', value: `${formatNumber(oneWayB, 0)} km` },
        { label: 'Pendeltage Variante B', value: `${daysB} Tage/Jahr` },
        { label: 'Verkehrsmittel Variante B', value: labelB },
      ] : []),
    ],
    calculationSteps: [
      `Jahresstrecke: ${formatNumber(oneWayA, 0)} km × 2 × ${daysA} Tage = ${formatNumber(annualKmA, 0)} Personenkilometer (Pkm)`,
      `CO₂e-Ausstoß Variante A: ${formatNumber(annualKmA, 0)} Pkm × ${formatNumber(factorA, 1)} g/Pkm ÷ 1.000 = ${formattedEmissionA} kg CO₂e`,
      ...(hasScenarioB ? [
        `Jahresstrecke Variante B: ${formatNumber(oneWayB, 0)} km × 2 × ${daysB} Tage = ${formatNumber(annualKmB, 0)} Pkm`,
        `CO₂e-Ausstoß Variante B: ${formatNumber(annualKmB, 0)} Pkm × ${formatNumber(factorB, 0)} g/Pkm ÷ 1.000 = ${formatNumber(emissionsKgB, 0)} kg CO₂e`,
        `Unterschied: ${formattedEmissionA} kg − ${formatNumber(emissionsKgB, 0)} kg = ${formatNumber(Math.abs(diffKg), 0)} kg CO₂e`,
      ] : []),
    ],
    qualifications: [
      'Modellvergleich auf Basis veröffentlichter Durchschnittsfaktoren (UBA/TREMOD, Bezugsjahr 2024); keine individuelle Fahrzeugmessung.',
      'Faktoren je Personenkilometer beziehen Emissionen bereits auf eine Person und dürfen nicht nochmals durch Mitfahrer geteilt werden.',
      'Wird eine Variante mit weniger Pendeltagen (z. B. Homeoffice) berechnet, werden ausschließlich Arbeitsweg-Emissionen verglichen. Zusätzlicher Strom- oder Heizenergieverbrauch zu Hause ist nicht enthalten.',
    ],
  };
}

/**
 * 3. CO2-Preis-Rechner Engine
 * 
 * Clean separation of two modes:
 * Mode A: Known emissions in kg or tonnes + explicit price per tonne (e.g., 2,000 kg × 60 €/t = 120 €)
 * Mode B: Fuel consumption + verified fuel factor + statutory/preset price per tonne
 */
export function calculateCarbonPrice(inputs: Record<string, any>): CalculationResult {
  const isModeA = inputs.calculationMode === 'by_emissions' || (inputs.emissionsAmount !== undefined && inputs.amount === undefined);

  if (isModeA) {
    // -------------------------------------------------------------
    // MODUS A: Bekannte CO2-Menge + Preis je Tonne
    // -------------------------------------------------------------
    if (inputs.emissionsAmount === undefined || inputs.emissionsAmount === null || String(inputs.emissionsAmount).trim() === '') {
      return {
        primary: { id: 'carbonCost', label: 'CO2-Kosten', value: 0, formattedValue: '-' },
        error: 'Bitte geben Sie die CO₂-Emissionsmenge ein.',
      };
    }

    const rawAmount = parseFloat(String(inputs.emissionsAmount).replace(',', '.'));
    if (isNaN(rawAmount) || rawAmount < 0) {
      return {
        primary: { id: 'carbonCost', label: 'CO2-Kosten', value: 0, formattedValue: '-' },
        error: 'Die Emissionsmenge darf nicht negativ sein (0 ist zulässig).',
      };
    }

    const unit = String(inputs.emissionsUnit || 'kg'); // 'kg' | 'tonnes'
    const tonnes = unit === 'tonnes' ? rawAmount : rawAmount / 1000;
    const kg = unit === 'tonnes' ? rawAmount * 1000 : rawAmount;

    const rawPrice = inputs.pricePerTonne !== undefined && inputs.pricePerTonne !== null && String(inputs.pricePerTonne).trim() !== ''
      ? parseFloat(String(inputs.pricePerTonne).replace(',', '.'))
      : 60.0;
    const pricePerTonne = isNaN(rawPrice) || rawPrice < 0 ? 60.0 : rawPrice;

    // Pure custom scenario preserves user price basis without silently adding VAT
    const taxStatus = String(inputs.priceTaxStatus || 'user_basis'); // 'user_basis' | 'add_vat' | 'none'
    let vatMultiplier = 1.0;
    let taxLabel = 'Preisbasis gemäß Eingabe (ohne automatischen MwSt-Aufschlag)';

    if (taxStatus === 'add_vat') {
      vatMultiplier = 1.19;
      taxLabel = 'zzgl. 19 % Mehrwertsteuer';
    }

    const totalCost = tonnes * pricePerTonne * vatMultiplier;

    const directAnswer = `Bei ${formatNumber(kg, 0)} kg CO₂ (${formatNumber(tonnes, 2)} Tonnen) und einem Preis von ${formatCurrency(pricePerTonne)} je Tonne ergeben sich rechnerisch ${formatCurrency(totalCost)}.`;

    return {
      primary: {
        id: 'carbonCostTotal',
        label: 'Rechnerischer CO2-Kostenbetrag',
        value: totalCost,
        formattedValue: formatCurrency(totalCost),
        highlight: true,
      },
      secondary: [
        {
          id: 'tonnesEmissions',
          label: 'Emissionsmenge in Tonnen',
          value: tonnes,
          formattedValue: `${formatNumber(tonnes, 3)} t CO₂`,
          helpText: `${formatNumber(kg, 0)} kg ÷ 1.000 = ${formatNumber(tonnes, 3)} Tonnen`,
        },
        {
          id: 'appliedPrice',
          label: 'Angesetzter CO2-Preis',
          value: pricePerTonne,
          formattedValue: `${formatCurrency(pricePerTonne)} / Tonne CO₂`,
          helpText: taxLabel,
        },
      ],
      directAnswer,
      summaryText: directAnswer,
      basisSummary: [
        { label: 'Berechnungsmodus', value: 'Modus A: Bekannte CO₂-Menge' },
        { label: 'Eingegebene Menge', value: `${formatNumber(rawAmount, 0)} ${unit}` },
        { label: 'CO₂-Menge in Tonnen', value: `${formatNumber(tonnes, 3)} t` },
        { label: 'Preis je Tonne', value: `${formatCurrency(pricePerTonne)}/t` },
        { label: 'Umsatzsteuer-Behandlung', value: taxLabel },
      ],
      calculationSteps: [
        unit === 'kg'
          ? `Umrechnung in Tonnen: ${formatNumber(kg, 0)} kg ÷ 1.000 = ${formatNumber(tonnes, 3)} t CO₂`
          : `Emissionsmenge: ${formatNumber(tonnes, 3)} Tonnen CO₂`,
        `Kostenrechnung: ${formatNumber(tonnes, 3)} t × ${formatCurrency(pricePerTonne)}/t = ${formatCurrency(tonnes * pricePerTonne)}`,
        taxStatus === 'add_vat' ? `Inklusive 19 % MwSt.: ${formatCurrency(tonnes * pricePerTonne)} × 1,19 = ${formatCurrency(totalCost)}` : '',
      ].filter(Boolean),
      qualifications: [
        'Dieses Beispiel erklärt ausschließlich die rechnerische Multiplikation (Emissionsmenge × Preis). Es ist keine Aussage über den verbindlichen Preis Ihrer Abrechnung.',
        'Das Ergebnis zeigt nur den rechnerischen CO₂-Preisbestandteil. Wenn Sie bereits mit einem Endkunden-Bruttopreis rechnen (z. B. an der Tankstelle oder auf der Gasrechnung), ist der CO₂-Preis darin bereits enthalten und darf nicht nochmals hinzugerechnet werden.',
        'Dieser Rechner ermittelt keine Vermieter-Mieter-Kostenaufteilung nach CO2KostAufG. Nutzen Sie dafür unseren spezialisierten CO₂-Kostenaufteilungsrechner.',
      ],
    };
  }

  // -------------------------------------------------------------
  // MODUS B: Brennstoffmenge + EBeV-Faktor + Preis je Tonne
  // -------------------------------------------------------------
  if (inputs.amount === undefined || inputs.amount === null || String(inputs.amount).trim() === '') {
    return {
      primary: { id: 'carbonCost', label: 'CO2-Kosten', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die Verbrauchsmenge an.',
    };
  }

  const amount = parseFloat(String(inputs.amount).replace(',', '.'));
  if (isNaN(amount) || amount < 0) {
    return {
      primary: { id: 'carbonCost', label: 'CO2-Kosten', value: 0, formattedValue: '-' },
      error: 'Die Verbrauchsmenge darf nicht negativ sein (0 ist zulässig).',
    };
  }

  const fuel = String(inputs.fuel || 'gas');
  const priceYear = String(inputs.priceYear || '2026_corridor_55');
  const includeVat = inputs.includeVat !== undefined ? Boolean(inputs.includeVat) : true;
  const vatMultiplier = includeVat ? 1.19 : 1.0;

  // Gesetzlicher CO2-Preis nach BEHG
  let pricePerTonne = 55.0;
  let priceNote = '2026 Gesetzlicher Preiskorridor (55 €/t Mindestpreis)';
  let isStatutory = true;

  if (priceYear === '2026_corridor_60') {
    pricePerTonne = 60.0;
    priceNote = '2026 Preiskorridor Mittelwert (60 €/t)';
  } else if (priceYear === '2026_corridor_65') {
    pricePerTonne = 65.0;
    priceNote = '2026 Preiskorridor Höchstpreis (§ 10 Abs. 2 BEHG: 65 €/t)';
  } else if (priceYear === '2025_festpreis') {
    pricePerTonne = 55.0;
    priceNote = '2025 Gesetzlicher Festpreis (§ 10 BEHG: 55 €/t)';
  } else if (priceYear === '2024_festpreis') {
    pricePerTonne = 45.0;
    priceNote = '2024 Gesetzlicher Festpreis (§ 10 BEHG: 45 €/t)';
  } else if (priceYear === 'custom') {
    const rawCustom = inputs.customPricePerTonne !== undefined && inputs.customPricePerTonne !== null && String(inputs.customPricePerTonne).trim() !== ''
      ? parseFloat(String(inputs.customPricePerTonne).replace(',', '.'))
      : 60;
    pricePerTonne = isNaN(rawCustom) || rawCustom < 0 ? 60 : rawCustom;
    priceNote = `Frei gewähltes Preisszenario (${formatCurrency(pricePerTonne)}/t CO₂)`;
    isStatutory = false;
  }

  // EBeV Standardfaktoren (kg CO2 pro Abrechnungseinheit)
  let factorPerUnit = 0.182; // kg CO2 / kWh Ho
  let unit = 'kWh';
  let fuelName = 'Erdgas (Brennwertbezug Ho)';

  if (fuel === 'heizoel') {
    factorPerUnit = 2.66; // kg CO2 / Liter
    unit = 'Liter';
    fuelName = 'Heizöl EL';
  } else if (fuel === 'benzin') {
    factorPerUnit = 2.37; // kg CO2 / Liter
    unit = 'Liter';
    fuelName = 'Superbenzin';
  } else if (fuel === 'diesel') {
    factorPerUnit = 2.65; // kg CO2 / Liter
    unit = 'Liter';
    fuelName = 'Dieselkraftstoff';
  } else if (fuel === 'lpg') {
    factorPerUnit = 1.65; // kg CO2 / Liter
    unit = 'Liter';
    fuelName = 'Flüssiggas (LPG)';
  }

  const totalCo2Kg = amount * factorPerUnit;
  const totalCo2Tonnes = totalCo2Kg / 1000;

  const costNet = totalCo2Tonnes * pricePerTonne;
  const costGross = costNet * vatMultiplier;

  const surchargePerUnitNet = (factorPerUnit * pricePerTonne) / 1000;
  const surchargePerUnitGross = surchargePerUnitNet * vatMultiplier;

  let unitSurchargeText = '';
  if (unit === 'kWh') {
    unitSurchargeText = `${formatNumber(surchargePerUnitGross * 100, 2)} Cent pro kWh`;
  } else {
    unitSurchargeText = `${formatNumber(surchargePerUnitGross * 100, 1)} Cent pro Liter`;
  }

  return {
    primary: {
      id: 'carbonCostTotal',
      label: `CO2-Kostenanteil ${includeVat ? 'brutto (inkl. 19% MwSt.)' : 'netto'}`,
      value: costGross,
      formattedValue: formatCurrency(costGross),
      highlight: true,
      helpText: 'Reiner CO₂-Kostenbestandteil, nicht die gesamte Brennstoffrechnung.',
    },
    secondary: [
      {
        id: 'surchargePerUnit',
        label: `CO2-Aufschlag je ${unit}`,
        value: surchargePerUnitGross,
        formattedValue: unitSurchargeText,
        highlight: true,
        helpText: `Entspricht netto ${formatNumber(surchargePerUnitNet * 100, 2)} ct/${unit} bei ${formatCurrency(pricePerTonne)}/t CO₂.`,
      },
      {
        id: 'totalEmissions',
        label: 'Verursachte CO2-Emissionen',
        value: totalCo2Tonnes,
        formattedValue: totalCo2Tonnes >= 1 ? `${formatNumber(totalCo2Tonnes, 2)} Tonnen CO₂` : `${formatNumber(totalCo2Kg, 1)} kg CO₂`,
        helpText: `${formatNumber(amount, 0)} ${unit} × ${formatNumber(factorPerUnit, 3)} kg CO₂/${unit}`,
      },
      {
        id: 'costNet',
        label: 'CO2-Kosten netto (ohne MwSt.)',
        value: costNet,
        formattedValue: formatCurrency(costNet),
        helpText: `Umsatzsteuer (19 %): ${formatCurrency(costNet * 0.19)}`,
      },
    ],
    directAnswer: `Für ${formatNumber(amount, 0)} ${unit} ${fuelName} beträgt der rechnerische CO₂-Kostenanteil bei ${formatCurrency(pricePerTonne)}/t CO₂ ca. ${formatCurrency(costGross)} ${includeVat ? 'brutto' : 'netto'} (Aufschlag: ${unitSurchargeText}).`,
    summaryText: `Bei einem CO₂-Preis von ${formatCurrency(pricePerTonne)} je Tonne und einem Verbrauch von ${formatNumber(amount, 0)} ${unit} ${fuelName} belaufen sich die CO₂-Zertifikatskosten auf ${formatCurrency(costGross)} ${includeVat ? 'inkl. 19 % MwSt.' : 'netto'}.`,
    basisSummary: [
      { label: 'Berechnungsmodus', value: 'Modus B: Brennstoffverbrauch & EBeV-Faktor' },
      { label: 'Brennstoff', value: fuelName },
      { label: 'Verbrauchsmenge', value: `${formatNumber(amount, 0)} ${unit}` },
      { label: 'CO2-Zertifikatspreis', value: `${formatCurrency(pricePerTonne)} pro Tonne CO₂ (${priceNote})` },
      { label: 'EBeV-Emissionsfaktor', value: `${formatNumber(factorPerUnit, 3)} kg CO₂ pro ${unit}` },
      { label: 'Mehrwertsteuer (19 %)', value: includeVat ? 'Einbezogen (Brutto)' : 'Ausgeschlossen (Netto)' },
    ],
    calculationSteps: [
      `CO2-Menge: ${formatNumber(amount, 0)} ${unit} × ${formatNumber(factorPerUnit, 3)} kg/${unit} = ${formatNumber(totalCo2Kg, 1)} kg CO₂ (${formatNumber(totalCo2Tonnes, 3)} Tonnen)`,
      `CO2-Kosten netto: ${formatNumber(totalCo2Tonnes, 3)} t × ${formatCurrency(pricePerTonne)}/t = ${formatCurrency(costNet)}`,
      includeVat
        ? `Mehrwertsteuer (19 %): ${formatCurrency(costNet)} × 1,19 = ${formatCurrency(costGross)}`
        : `Nettobetrag: ${formatCurrency(costNet)}`,
      `Spezifischer Aufschlag: ${formatCurrency(costGross)} ÷ ${formatNumber(amount, 0)} ${unit} = ${unitSurchargeText}`,
    ],
    qualifications: [
      'Das Ergebnis zeigt nur den rechnerischen CO₂-Preisbestandteil (NICHT Ihre gesamte Heiz- oder Spritrechnung). Weitere Preisbestandteile wie Beschaffung, Netzentgelte, Steuern und Abgaben sind darin nicht enthalten.',
      'Wenn Sie bereits mit einem Endpreis aus Ihrem Vertrag oder von der Tankstelle rechnen, dürfen Sie einen darin enthaltenen CO₂-Kostenanteil nicht nochmals hinzurechnen.',
      isStatutory
        ? 'Gesetzliche Grundlage sind das Brennstoffemissionshandelsgesetz (BEHG) und die Emissionsberichterstattungsverordnung (EBeV 2030).'
        : 'Mit einem selbst gewählten Preis können Sie untersuchen, wie sich andere Annahmen auswirken würden. Solche Ergebnisse sind Szenarien und keine Vorhersage künftiger Energiepreise.',
    ],
  };
}
