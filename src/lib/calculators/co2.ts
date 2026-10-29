import { CalculationResult, ResultItem } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';
import { EMISSION_FACTORS, CO2_PRICE_2026_CORRIDOR } from '@/data/emissions';

function isBlank(v: unknown): boolean {
  return v === undefined || v === null || String(v).trim() === '';
}

function parseDe(v: unknown): number {
  return parseFloat(String(v).replace(',', '.'));
}

/**
 * 1. CO2-Strom-Rechner Engine
 *
 * - kWh-Eingabe, Zeitraum (Monat / Jahr / eigener Zeitraum)
 * - Standardfaktor: UBA-Schätzung Datenjahr 2025 = 344 g CO₂/kWh (CO₂ bei der Stromerzeugung)
 * - Optional eigener Faktor (g/kWh)
 * - Optionaler Vergleichsverbrauch im selben Zeitraum
 * - Formel: kg CO₂ = kWh × g CO₂/kWh ÷ 1.000; Tonnen = kg ÷ 1.000
 *
 * Lebenszyklus- oder Ökostrom-Voreinstellungen sind bewusst NICHT enthalten, weil keine
 * amtliche Quelle mit passender Bilanzgrenze belegt ist (siehe REMOVED_UNVERIFIED_FACTORS).
 */
export function calculateElectricityCO2(inputs: Record<string, any>): CalculationResult {
  if (isBlank(inputs.consumptionKwh)) {
    return {
      primary: { id: 'co2', label: 'CO₂-Ausstoß', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie Ihren Stromverbrauch in Kilowattstunden (kWh) an.',
    };
  }

  const kwh = parseDe(inputs.consumptionKwh);
  if (isNaN(kwh) || kwh < 0) {
    return {
      primary: { id: 'co2', label: 'CO₂-Ausstoß', value: 0, formattedValue: '-' },
      error: 'Der Stromverbrauch darf nicht negativ sein (0 kWh ist zulässig).',
    };
  }

  const periodKey = String(inputs.period || 'year'); // 'year' | 'month' | 'custom'
  let periodText = 'Jahr';
  if (periodKey === 'month') periodText = 'Monat';
  else if (periodKey === 'custom') periodText = 'gewählter Zeitraum';

  const uba = EMISSION_FACTORS.strom_mix_de_generation_2025;
  const factorSelection = String(inputs.factorType || inputs.tariffType || 'uba_2025');

  let factorGrams = uba.value; // 344 g CO₂/kWh
  let factorLabel = 'Deutschland, Datenjahr 2025: 344 g CO₂/kWh (UBA-Schätzung; CO₂ bei der Stromerzeugung)';
  let dataYear = String(uba.referenceYear);
  let statusText = 'UBA-Schätzung (veröffentlicht 23.03.2026)';
  let boundaryText =
    'CO₂ bei der Stromerzeugung je kWh des in Deutschland verbrauchten Stroms (ohne Vorketten, ohne Anlagenherstellung, ohne weitere Treibhausgase)';

  if (factorSelection === 'custom') {
    const rawCustom = !isBlank(inputs.customFactor)
      ? parseDe(inputs.customFactor)
      : !isBlank(inputs.customFactorGrams)
        ? parseDe(inputs.customFactorGrams)
        : NaN;
    if (isNaN(rawCustom) || rawCustom < 0) {
      return {
        primary: { id: 'co2', label: 'CO₂-Ausstoß', value: 0, formattedValue: '-' },
        error: 'Bitte geben Sie einen eigenen Emissionsfaktor in g CO₂/kWh an (0 oder größer).',
      };
    }
    factorGrams = rawCustom;
    factorLabel = `Eigener Faktor: ${formatNumber(factorGrams, 1)} g/kWh (Quelle, Datenjahr und Bilanzgrenze liegen in Ihrer Verantwortung)`;
    dataYear = !isBlank(inputs.customYear) ? String(inputs.customYear) : 'nicht angegeben';
    statusText = 'Eigene Eingabe (nicht geprüft)';
    boundaryText = 'Wie von Ihrer Quelle definiert (nicht geprüft)';
  }

  const gasUnit = 'CO₂';
  const totalKg = (kwh * factorGrams) / 1000;
  const totalTonnes = totalKg / 1000;

  // Optionaler Vergleichsverbrauch
  let compareKg: number | null = null;
  let diffKg: number | null = null;
  let diffText = '';
  let compKwhValue = 0;

  if (!isBlank(inputs.compareConsumptionKwh)) {
    const compKwh = parseDe(inputs.compareConsumptionKwh);
    if (!isNaN(compKwh) && compKwh >= 0) {
      compKwhValue = compKwh;
      compareKg = (compKwh * factorGrams) / 1000;
      diffKg = compareKg - totalKg;

      if (totalKg === 0) {
        diffText =
          diffKg >= 0
            ? `Der Vergleichsverbrauch ergibt ${formatNumber(diffKg, 1)} kg ${gasUnit} (Basiswert: 0 kg).`
            : `Der Vergleichsverbrauch ergibt ${formatNumber(Math.abs(diffKg), 1)} kg ${gasUnit} weniger.`;
      } else {
        const pctChange = (diffKg / totalKg) * 100;
        if (diffKg > 0) {
          diffText = `Vergleichsszenario: +${formatNumber(diffKg, 1)} kg ${gasUnit} (+${formatPercent(pctChange, 1)}).`;
        } else if (diffKg < 0) {
          diffText = `Vergleichsszenario: −${formatNumber(Math.abs(diffKg), 1)} kg ${gasUnit} (−${formatPercent(Math.abs(pctChange), 1)}).`;
        } else {
          diffText = 'Beide Verbrauchswerte ergeben dieselbe CO₂-Menge.';
        }
      }
    }
  }

  const formattedKg = formatNumber(totalKg, totalKg < 10 && totalKg > 0 ? 2 : 1);
  const directAnswerText = `Für ${formatNumber(kwh, 0)} kWh (Zeitraum: ${periodText}) ergeben sich mit dem gewählten Faktor rechnerisch ${formattedKg} kg ${gasUnit}. Verwendet wurden ${formatNumber(factorGrams, 0)} g ${gasUnit} je kWh, Datenjahr ${dataYear}.`;

  const secondary: ResultItem[] = [
    {
      id: 'totalKg',
      label: `Emissionen (${periodText})`,
      value: totalKg,
      formattedValue: `${formattedKg} kg ${gasUnit}`,
      highlight: true,
      helpText: `${formatNumber(kwh, 0)} kWh × ${formatNumber(factorGrams, 0)} g/kWh ÷ 1.000`,
    },
    {
      id: 'totalTonnes',
      label: 'Emissionen in Tonnen',
      value: totalTonnes,
      formattedValue: `${formatNumber(totalTonnes, 3)} t ${gasUnit}`,
      helpText: `${formattedKg} kg ÷ 1.000`,
    },
    {
      id: 'factorUsed',
      label: 'Angewendeter Emissionsfaktor',
      value: factorGrams,
      formattedValue: `${formatNumber(factorGrams, 0)} g ${gasUnit}/kWh`,
      helpText: factorLabel,
    },
  ];

  if (compareKg !== null && diffKg !== null) {
    secondary.push({
      id: 'comparisonResult',
      label: `Vergleichsverbrauch (${formatNumber(compKwhValue, 0)} kWh)`,
      value: compareKg,
      formattedValue: `${formatNumber(compareKg, 1)} kg ${gasUnit}`,
      helpText: diffText,
      highlight: true,
    });
  }

  return {
    primary: {
      id: 'co2Primary',
      label: `CO₂-Ausstoß (${periodText})`,
      value: totalTonnes >= 1 ? totalTonnes : totalKg,
      formattedValue: totalTonnes >= 1 ? `${formatNumber(totalTonnes, 2)} Tonnen ${gasUnit}` : `${formattedKg} kg ${gasUnit}`,
      highlight: true,
    },
    secondary,
    directAnswer: directAnswerText,
    summaryText: directAnswerText,
    basisSummary: [
      { label: 'Stromverbrauch', value: `${formatNumber(kwh, 0)} kWh` },
      { label: 'Zeitraum', value: periodText },
      { label: 'Datenjahr', value: dataYear },
      { label: 'Faktor', value: `${formatNumber(factorGrams, 0)} g ${gasUnit}/kWh` },
      { label: 'Status', value: statusText },
      { label: 'Bilanzgrenze', value: boundaryText },
    ],
    calculationSteps: [
      `Formel: Stromverbrauch in kWh × Emissionsfaktor in g/kWh ÷ 1.000 = kg ${gasUnit}`,
      `Berechnung: ${formatNumber(kwh, 0)} kWh × ${formatNumber(factorGrams, 0)} g/kWh ÷ 1.000 = ${formattedKg} kg ${gasUnit}`,
      totalTonnes >= 1
        ? `Umrechnung in Tonnen: ${formattedKg} kg ÷ 1.000 = ${formatNumber(totalTonnes, 3)} t ${gasUnit}`
        : `Ergebnis in Kilogramm: ${formattedKg} kg ${gasUnit}`,
      diffText ? `Vergleich: ${diffText}` : '',
    ].filter(Boolean),
    qualifications: [
      'Das Ergebnis beschreibt nur die vom gewählten Faktor erfassten Emissionen. Es ist weder ein vollständiger CO₂-Fußabdruck eines Haushalts noch ein Lebenszyklus-Ergebnis.',
      'Der Standardwert von 344 g CO₂/kWh ist die UBA-Schätzung für das Datenjahr 2025 (veröffentlicht am 23.03.2026) und bezieht sich auf CO₂ bei der Stromerzeugung. Vorketten, Anlagenherstellung und weitere Treibhausgase sind darin nicht enthalten.',
      'Ihr tatsächlicher Stromtarif (z. B. Ökostrom) kann nach Stromkennzeichnung abweichen. Für einen eigenen Faktor nutzen Sie die Option „Eigener Emissionsfaktor“ und prüfen Sie dessen Bilanzgrenze.',
    ],
  };
}

/**
 * 2. CO2-Pendeln-Rechner Engine
 *
 * Faktoren: UBA, Vergleich der durchschnittlichen Emissionen einzelner Verkehrsmittel im
 * Personenverkehr in Deutschland 2024 (TREMOD 6.71B, 10/2025), g CO₂e je Personenkilometer.
 * Die Werte beziehen sich bereits auf eine Person – es wird NICHT erneut durch Mitfahrende geteilt.
 * Enthalten: direkte Emissionen + Bereitstellung/Umwandlung der Energieträger.
 * Nicht enthalten: Infrastruktur und Fahrzeugbereitstellung.
 */
export const COMMUTING_MODES: Record<string, { factorKey: string; label: string; shortLabel: string }> = {
  car_average: { factorKey: 'verkehr_pkw_durchschnitt', label: 'Pkw Durchschnitt', shortLabel: 'Pkw' },
  train_long: { factorKey: 'verkehr_bahn_fernverkehr', label: 'Eisenbahn Fernverkehr', shortLabel: 'Bahn Fernverkehr' },
  bus_long: { factorKey: 'verkehr_bus_fernverkehr', label: 'Linienbus Fernverkehr', shortLabel: 'Fernbus' },
  train_local: { factorKey: 'verkehr_bahn_nahverkehr', label: 'Eisenbahn Nahverkehr', shortLabel: 'Bahn Nahverkehr' },
  bus_local: { factorKey: 'verkehr_bus_nahverkehr', label: 'Linienbus Nahverkehr', shortLabel: 'Bus Nahverkehr' },
  tram_metro: { factorKey: 'verkehr_strassenbahn_ubahn', label: 'Straßen-, Stadt- und U-Bahn', shortLabel: 'Tram/U-Bahn' },
  pedelec: { factorKey: 'verkehr_pedelec', label: 'Pedelec', shortLabel: 'Pedelec' },
  ebike: { factorKey: 'verkehr_pedelec', label: 'Pedelec', shortLabel: 'Pedelec' },
  bike_walk: { factorKey: 'verkehr_fahrrad_fuss', label: 'Fahrrad / zu Fuß (Rechenannahme 0)', shortLabel: 'Fahrrad/zu Fuß' },
};

export function getCommutingFactor(modeKey: string): { value: number; label: string } | null {
  const mode = COMMUTING_MODES[modeKey];
  if (!mode) return null;
  const value = EMISSION_FACTORS[mode.factorKey].value;
  return { value, label: `${mode.label} (${formatNumber(value, 0)} g CO₂e/Pkm)` };
}

export function calculateCommutingCO2(inputs: Record<string, any>): CalculationResult {
  if (isBlank(inputs.oneWayDistanceKm)) {
    return {
      primary: { id: 'emissions', label: 'Pendel-Emissionen', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die einfache Entfernung zum Arbeitsplatz in Kilometern an.',
    };
  }

  const oneWayA = parseDe(inputs.oneWayDistanceKm);
  if (isNaN(oneWayA) || oneWayA < 0) {
    return {
      primary: { id: 'emissions', label: 'Pendel-Emissionen', value: 0, formattedValue: '-' },
      error: 'Die einfache Entfernung darf nicht negativ sein (0 km ist zulässig).',
    };
  }

  const daysA = !isBlank(inputs.commutingDays) ? Math.max(0, parseInt(String(inputs.commutingDays), 10) || 0) : 180;

  // Jahres-Personenkilometer Variante A (Hin- und Rückweg)
  const annualKmA = oneWayA * 2 * daysA;

  const modeKeyA = String(inputs.transportMode || inputs.primaryMode || 'car_average');
  const modeA = getCommutingFactor(modeKeyA);
  if (!modeA) {
    return {
      primary: { id: 'emissions', label: 'Pendel-Emissionen', value: 0, formattedValue: '-' },
      error: 'Unbekanntes Verkehrsmittel. Bitte wählen Sie eines der angebotenen Verkehrsmittel.',
    };
  }
  const factorA = modeA.value;
  const labelA = modeA.label;

  const emissionsKgA = (annualKmA * factorA) / 1000;
  const emissionsTonnesA = emissionsKgA / 1000;

  const formattedEmissionA = formatNumber(emissionsKgA, emissionsKgA < 10 && emissionsKgA > 0 ? 1 : 0);
  const directAnswerA = `Bei ${formatNumber(oneWayA, 0)} km einfacher Strecke und ${daysA} Pendeltagen legen Sie einschließlich Rückweg ${formatNumber(annualKmA, 0)} Personenkilometer im Jahr zurück. Mit dem UBA-Durchschnittswert von ${formatNumber(factorA, 0)} g CO₂e/Pkm ergibt das rund ${formattedEmissionA} kg CO₂e pro Person und Jahr.`;

  // Variante B
  const hasScenarioB = Boolean(
    inputs.enableScenarioB ||
      inputs.comparisonMode ||
      !isBlank(inputs.comparisonDistanceKm) ||
      inputs.differentComparisonDistance,
  );

  let oneWayB = oneWayA;
  if (!isBlank(inputs.comparisonDistanceKm)) {
    oneWayB = Math.max(0, parseDe(inputs.comparisonDistanceKm) || 0);
  }

  let daysB = daysA;
  if (!isBlank(inputs.comparisonDays)) {
    daysB = Math.max(0, parseInt(String(inputs.comparisonDays), 10) || 0);
  }

  const modeKeyB = String(inputs.comparisonMode || 'train_local');
  const modeB = getCommutingFactor(modeKeyB) ?? getCommutingFactor('train_local')!;
  const factorB = modeB.value;
  const labelB = modeB.label;

  const annualKmB = oneWayB * 2 * daysB;
  const emissionsKgB = (annualKmB * factorB) / 1000;
  const diffKg = emissionsKgA - emissionsKgB; // positiv = Einsparung mit B

  const secondary: ResultItem[] = [
    {
      id: 'totalKm',
      label: 'Jahresstrecke (inkl. Rückweg)',
      value: annualKmA,
      formattedValue: `${formatNumber(annualKmA, 0)} Pkm/Jahr`,
      helpText: `${formatNumber(oneWayA, 0)} km × 2 × ${daysA} Pendeltage = ${formatNumber(annualKmA, 0)} Personenkilometer`,
    },
    {
      id: 'emissionsKg',
      label: 'Emissionen in Kilogramm',
      value: emissionsKgA,
      formattedValue: `${formattedEmissionA} kg CO₂e/Jahr`,
      highlight: true,
      helpText: `${formatNumber(annualKmA, 0)} Pkm × ${formatNumber(factorA, 0)} g/Pkm ÷ 1.000`,
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
        helpText:
          diffKg >= 0
            ? `Einsparung von ${formatNumber(diffKg, 0)} kg CO₂e (${formatPercent((diffKg / Math.max(1, emissionsKgA)) * 100, 0)} Minderung).`
            : `Mehrausstoß von ${formatNumber(Math.abs(diffKg), 0)} kg CO₂e.`,
      },
    );
  }

  // Homeoffice-Effekt
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
      helpText: `Entfällt an ${hoSavedDays} Tagen das Pendeln (${formatNumber(hoSavedKm, 0)} Pkm). Hinweis: Zusätzlicher Strom- oder Heizverbrauch zu Hause ist nicht berechnet.`,
    });
  }

  return {
    primary: {
      id: 'primaryEmissions',
      label: 'CO₂e-Emissionen Arbeitsweg',
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
      { label: 'Jahresleistung', value: `${formatNumber(annualKmA, 0)} Personenkilometer (Pkm)` },
      { label: 'Verkehrsmittel Variante A', value: labelA },
      ...(hasScenarioB
        ? [
            { label: 'Strecke Variante B', value: `${formatNumber(oneWayB, 0)} km` },
            { label: 'Pendeltage Variante B', value: `${daysB} Tage/Jahr` },
            { label: 'Verkehrsmittel Variante B', value: labelB },
          ]
        : []),
      { label: 'Datenquelle', value: 'UBA, TREMOD 6.71B (10/2025), Bezugsjahr 2024' },
      { label: 'Bilanzgrenze', value: 'Direkte Emissionen + Bereitstellung/Umwandlung der Energieträger; ohne Infrastruktur und Fahrzeugbereitstellung' },
    ],
    calculationSteps: [
      `Jahresstrecke: ${formatNumber(oneWayA, 0)} km × 2 × ${daysA} Tage = ${formatNumber(annualKmA, 0)} Personenkilometer (Pkm)`,
      `CO₂e Variante A: ${formatNumber(annualKmA, 0)} Pkm × ${formatNumber(factorA, 0)} g/Pkm ÷ 1.000 = ${formattedEmissionA} kg CO₂e`,
      ...(hasScenarioB
        ? [
            `Jahresstrecke Variante B: ${formatNumber(oneWayB, 0)} km × 2 × ${daysB} Tage = ${formatNumber(annualKmB, 0)} Pkm`,
            `CO₂e Variante B: ${formatNumber(annualKmB, 0)} Pkm × ${formatNumber(factorB, 0)} g/Pkm ÷ 1.000 = ${formatNumber(emissionsKgB, 1)} kg CO₂e`,
            `Unterschied: ${formattedEmissionA} kg − ${formatNumber(emissionsKgB, 0)} kg = ${formatNumber(Math.abs(diffKg), 0)} kg CO₂e`,
          ]
        : []),
    ],
    qualifications: [
      'Modellvergleich auf Basis veröffentlichter Durchschnittswerte (UBA, TREMOD 6.71B, Bezugsjahr 2024); keine individuelle Fahrzeug- oder Streckenmessung.',
      'Die Faktoren gelten je Personenkilometer. Beim Pkw ist der durchschnittliche Besetzungsgrad (1,4 Personen je Pkw) bereits eingerechnet; der Wert darf nicht noch einmal durch Mitfahrende geteilt werden.',
      'Enthalten sind direkte Emissionen und die Bereitstellung der Energieträger. Infrastruktur und Fahrzeugbereitstellung sind laut UBA gesondert zu betrachten und hier nicht enthalten.',
      'Wird eine Variante mit weniger Pendeltagen (z. B. Homeoffice) berechnet, werden ausschließlich Arbeitsweg-Emissionen verglichen. Zusätzlicher Strom- oder Heizenergieverbrauch zu Hause ist nicht enthalten.',
    ],
  };
}

/**
 * 3. CO2-Preis-Rechner Engine
 *
 * Modus A: Bekannte Emissionsmenge + Preis je Tonne (z. B. 2.000 kg × 60 €/t = 120 €)
 * Modus B: Brennstoffmenge × EBeV-2030-Standardfaktor × CO₂-Preis je Tonne
 *
 * EBeV-Faktoren werden aus Dichte × Heizwert × Emissionsfaktor (Anlage 2 Teil 4) abgeleitet und
 * mit voller interner Genauigkeit verwendet. Flüssiggas wird nur in Kilogramm angeboten, weil die
 * EBeV keine Liter-Dichte enthält.
 */
export const CARBON_PRICE_FUELS: Record<string, { factorKey: string; unit: string; name: string; decimals: number }> = {
  gas: { factorKey: 'brennstoff_erdgas_ebev', unit: 'kWh', name: 'Erdgas (kWh Brennwert)', decimals: 4 },
  heizoel: { factorKey: 'brennstoff_heizoel_el_ebev', unit: 'Liter', name: 'Heizöl EL', decimals: 3 },
  benzin: { factorKey: 'brennstoff_benzin_ebev', unit: 'Liter', name: 'Benzin', decimals: 3 },
  diesel: { factorKey: 'brennstoff_diesel_ebev', unit: 'Liter', name: 'Diesel', decimals: 3 },
  lpg: { factorKey: 'brennstoff_lpg_ebev_kg', unit: 'kg', name: 'Flüssiggas (LPG, in Kilogramm)', decimals: 3 },
};

export function calculateCarbonPrice(inputs: Record<string, any>): CalculationResult {
  const isModeA = inputs.calculationMode === 'by_emissions' || (inputs.emissionsAmount !== undefined && inputs.amount === undefined);

  if (isModeA) {
    // -------------------------------------------------------------
    // MODUS A: Bekannte CO₂-Menge + Preis je Tonne
    // -------------------------------------------------------------
    if (isBlank(inputs.emissionsAmount)) {
      return {
        primary: { id: 'carbonCost', label: 'CO₂-Kosten', value: 0, formattedValue: '-' },
        error: 'Bitte geben Sie die CO₂-Emissionsmenge ein.',
      };
    }

    const rawAmount = parseDe(inputs.emissionsAmount);
    if (isNaN(rawAmount) || rawAmount < 0) {
      return {
        primary: { id: 'carbonCost', label: 'CO₂-Kosten', value: 0, formattedValue: '-' },
        error: 'Die Emissionsmenge darf nicht negativ sein (0 ist zulässig).',
      };
    }

    const unit = String(inputs.emissionsUnit || 'kg'); // 'kg' | 'tonnes'
    const tonnes = unit === 'tonnes' ? rawAmount : rawAmount / 1000;
    const kg = unit === 'tonnes' ? rawAmount * 1000 : rawAmount;

    const rawPrice = !isBlank(inputs.pricePerTonne) ? parseDe(inputs.pricePerTonne) : CO2_PRICE_2026_CORRIDOR.midpoint;
    const pricePerTonne = isNaN(rawPrice) || rawPrice < 0 ? CO2_PRICE_2026_CORRIDOR.midpoint : rawPrice;

    const taxStatus = String(inputs.priceTaxStatus || 'user_basis'); // 'user_basis' | 'add_vat'
    let vatMultiplier = 1.0;
    let taxLabel = 'Preisbasis gemäß Eingabe (kein automatischer MwSt-Aufschlag)';

    if (taxStatus === 'add_vat') {
      vatMultiplier = 1.19;
      taxLabel = 'zzgl. 19 % Mehrwertsteuer';
    }

    const totalCost = tonnes * pricePerTonne * vatMultiplier;

    const directAnswer = `Bei ${formatNumber(kg, 0)} kg CO₂ (${formatNumber(tonnes, 2)} Tonnen) und einem Preis von ${formatCurrency(pricePerTonne)} je Tonne ergeben sich rechnerisch ${formatCurrency(totalCost)}.`;

    return {
      primary: {
        id: 'carbonCostTotal',
        label: 'Rechnerischer CO₂-Kostenbetrag',
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
          label: 'Angesetzter CO₂-Preis',
          value: pricePerTonne,
          formattedValue: `${formatCurrency(pricePerTonne)} / Tonne CO₂`,
          helpText: taxLabel,
        },
      ],
      directAnswer,
      summaryText: directAnswer,
      basisSummary: [
        { label: 'Berechnungsmodus', value: 'Modus A: Bekannte CO₂-Menge' },
        { label: 'Eingegebene Menge', value: `${formatNumber(rawAmount, 0)} ${unit === 'tonnes' ? 't' : 'kg'}` },
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
  if (isBlank(inputs.amount)) {
    return {
      primary: { id: 'carbonCost', label: 'CO₂-Kosten', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die Verbrauchsmenge an.',
    };
  }

  const amount = parseDe(inputs.amount);
  if (isNaN(amount) || amount < 0) {
    return {
      primary: { id: 'carbonCost', label: 'CO₂-Kosten', value: 0, formattedValue: '-' },
      error: 'Die Verbrauchsmenge darf nicht negativ sein (0 ist zulässig).',
    };
  }

  const fuelKey = String(inputs.fuel || 'gas');
  const fuelDef = CARBON_PRICE_FUELS[fuelKey] ?? CARBON_PRICE_FUELS.gas;
  const fuelFactor = EMISSION_FACTORS[fuelDef.factorKey];
  const factorPerUnit = fuelFactor.value; // ungerundet
  const unit = fuelDef.unit;
  const fuelName = fuelDef.name;

  const priceYear = String(inputs.priceYear || '2026_corridor_60');
  const includeVat = inputs.includeVat !== undefined ? Boolean(inputs.includeVat) : true;
  const vatMultiplier = includeVat ? 1.19 : 1.0;

  let pricePerTonne: number = CO2_PRICE_2026_CORRIDOR.midpoint;
  let priceNote = '2026: Mittelwert des gesetzlichen Korridors (rechnerisch 60 €/t; Modellpreis nach § 4 CO2KostAufG)';
  let isStatutoryFixed = false;

  if (priceYear === '2026_corridor_55') {
    pricePerTonne = CO2_PRICE_2026_CORRIDOR.min;
    priceNote = '2026: Untergrenze des gesetzlichen Preiskorridors (§ 10 Abs. 2 BEHG)';
  } else if (priceYear === '2026_corridor_65') {
    pricePerTonne = CO2_PRICE_2026_CORRIDOR.max;
    priceNote = '2026: Obergrenze des gesetzlichen Preiskorridors (§ 10 Abs. 2 BEHG)';
  } else if (priceYear === '2025_festpreis') {
    pricePerTonne = EMISSION_FACTORS.co2_preis_behg_2025.value;
    priceNote = '2025: gesetzlicher Festpreis (§ 10 Abs. 2 BEHG)';
    isStatutoryFixed = true;
  } else if (priceYear === '2024_festpreis') {
    pricePerTonne = EMISSION_FACTORS.co2_preis_behg_2024.value;
    priceNote = '2024: gesetzlicher Festpreis (§ 10 Abs. 2 BEHG)';
    isStatutoryFixed = true;
  } else if (priceYear === 'custom') {
    const rawCustom = !isBlank(inputs.customPricePerTonne) ? parseDe(inputs.customPricePerTonne) : CO2_PRICE_2026_CORRIDOR.midpoint;
    pricePerTonne = isNaN(rawCustom) || rawCustom < 0 ? CO2_PRICE_2026_CORRIDOR.midpoint : rawCustom;
    priceNote = `Frei gewähltes Preisszenario (${formatCurrency(pricePerTonne)}/t CO₂)`;
  }

  const totalCo2Kg = amount * factorPerUnit;
  const totalCo2Tonnes = totalCo2Kg / 1000;

  const costNet = totalCo2Tonnes * pricePerTonne;
  const costGross = costNet * vatMultiplier;

  const surchargePerUnitNet = (factorPerUnit * pricePerTonne) / 1000;
  const surchargePerUnitGross = surchargePerUnitNet * vatMultiplier;

  const unitSurchargeText =
    unit === 'kWh'
      ? `${formatNumber(surchargePerUnitGross * 100, 2)} Cent pro kWh`
      : `${formatNumber(surchargePerUnitGross * 100, 1)} Cent pro ${unit === 'kg' ? 'kg' : 'Liter'}`;

  const factorDisplay = `${formatNumber(factorPerUnit, fuelDef.decimals)} kg CO₂/${unit}`;

  return {
    primary: {
      id: 'carbonCostTotal',
      label: `CO₂-Kostenanteil ${includeVat ? 'brutto (inkl. 19 % MwSt.)' : 'netto'}`,
      value: costGross,
      formattedValue: formatCurrency(costGross),
      highlight: true,
      helpText: 'Rechnerischer CO₂-Kostenbestandteil, nicht die gesamte Brennstoffrechnung.',
    },
    secondary: [
      {
        id: 'surchargePerUnit',
        label: `CO₂-Aufschlag je ${unit}`,
        value: surchargePerUnitGross,
        formattedValue: unitSurchargeText,
        highlight: true,
        helpText: `Entspricht netto ${formatNumber(surchargePerUnitNet * 100, 2)} ct/${unit} bei ${formatCurrency(pricePerTonne)}/t CO₂.`,
      },
      {
        id: 'totalEmissions',
        label: 'Verursachte CO₂-Emissionen (direkt, Verbrennung)',
        value: totalCo2Tonnes,
        formattedValue: totalCo2Tonnes >= 1 ? `${formatNumber(totalCo2Tonnes, 2)} Tonnen CO₂` : `${formatNumber(totalCo2Kg, 1)} kg CO₂`,
        helpText: `${formatNumber(amount, 0)} ${unit} × ${factorDisplay}`,
      },
      {
        id: 'costNet',
        label: 'CO₂-Kosten netto (ohne MwSt.)',
        value: costNet,
        formattedValue: formatCurrency(costNet),
        helpText: `Umsatzsteuer (19 %): ${formatCurrency(costNet * 0.19)}`,
      },
    ],
    directAnswer: `Für ${formatNumber(amount, 0)} ${unit} ${fuelName} beträgt der rechnerische CO₂-Kostenanteil bei ${formatCurrency(pricePerTonne)}/t CO₂ ca. ${formatCurrency(costGross)} ${includeVat ? 'brutto' : 'netto'} (Aufschlag: ${unitSurchargeText}).`,
    summaryText: `Bei einem CO₂-Preis von ${formatCurrency(pricePerTonne)} je Tonne und einem Verbrauch von ${formatNumber(amount, 0)} ${unit} ${fuelName} beläuft sich der rechnerische CO₂-Kostenanteil auf ${formatCurrency(costGross)} ${includeVat ? 'inkl. 19 % MwSt.' : 'netto'}.`,
    basisSummary: [
      { label: 'Berechnungsmodus', value: 'Modus B: Brennstoffverbrauch & EBeV-Faktor' },
      { label: 'Brennstoff', value: fuelName },
      { label: 'Verbrauchsmenge', value: `${formatNumber(amount, 0)} ${unit}` },
      { label: 'CO₂-Preis', value: `${formatCurrency(pricePerTonne)} pro Tonne CO₂ (${priceNote})` },
      { label: 'Emissionsfaktor (aus EBeV 2030 Anlage 2 abgeleitet)', value: factorDisplay },
      { label: 'Ableitung', value: fuelFactor.notes },
      { label: 'Mehrwertsteuer (19 %)', value: includeVat ? 'Einbezogen (brutto)' : 'Ausgeschlossen (netto)' },
    ],
    calculationSteps: [
      `CO₂-Menge: ${formatNumber(amount, 0)} ${unit} × ${factorDisplay} = ${formatNumber(totalCo2Kg, 1)} kg CO₂ (${formatNumber(totalCo2Tonnes, 3)} Tonnen)`,
      `CO₂-Kosten netto: ${formatNumber(totalCo2Tonnes, 3)} t × ${formatCurrency(pricePerTonne)}/t = ${formatCurrency(costNet)}`,
      includeVat ? `Mehrwertsteuer (19 %): ${formatCurrency(costNet)} × 1,19 = ${formatCurrency(costGross)}` : `Nettobetrag: ${formatCurrency(costNet)}`,
      `Spezifischer Aufschlag: ${formatCurrency(costGross)} ÷ ${formatNumber(amount, 0)} ${unit} = ${unitSurchargeText}`,
    ],
    qualifications: [
      'Das Ergebnis zeigt nur den rechnerischen CO₂-Preisbestandteil (NICHT Ihre gesamte Heiz- oder Spritrechnung). Beschaffung, Netzentgelte, Steuern und Abgaben sind darin nicht enthalten.',
      'Wenn Sie bereits mit einem Endpreis aus Ihrem Vertrag oder von der Tankstelle rechnen, dürfen Sie einen darin enthaltenen CO₂-Kostenanteil nicht nochmals hinzurechnen. Der tatsächlich berechnete Preisbestandteil Ihres Lieferanten kann vom Modellwert abweichen.',
      'Die Faktoren sind aus den Standardwerten der EBeV 2030 (Anlage 2 Teil 4: Dichte × Heizwert × Emissionsfaktor) abgeleitet. Die EBeV nennt die Literwerte nicht unmittelbar; die Ableitung stammt von RechenHafen.',
      ...(fuelKey === 'lpg'
        ? ['Flüssiggas wird in Kilogramm berechnet, weil die EBeV für Flüssiggas keine Liter-Dichte enthält. Rechnen Sie Liter nur mit einer dokumentierten Dichteangabe Ihres Lieferanten um.']
        : []),
      isStatutoryFixed
        ? 'Der gewählte Preis ist ein gesetzlicher Festpreis nach § 10 Abs. 2 BEHG.'
        : priceYear === 'custom'
          ? 'Mit einem selbst gewählten Preis können Sie Annahmen untersuchen. Solche Ergebnisse sind Szenarien und keine Vorhersage von Energiepreisen.'
          : 'Für 2026 legt § 10 Abs. 2 BEHG einen Preiskorridor von 55 bis 65 €/t fest. 55 und 65 sind die gesetzlichen Korridorgrenzen; 60 ist deren rechnerischer Mittelwert, nicht ein dritter „offizieller Preis“.',
    ],
  };
}

/**
 * 4. CO2-Auto-Rechner Engine
 *
 * Drei klar getrennte Rechenwege (nicht vermischen):
 *
 * A. method = 'direct', Benzin/Diesel: direkte CO₂-Emissionen der Kraftstoffverbrennung
 *    (EBeV-2030-Standardwerte, von RechenHafen zu kg/Liter abgeleitet; ohne Vorkette).
 * B. method = 'direct', Elektro: Stromnetz-Faktor – UBA-Schätzung Datenjahr 2025, 344 g CO₂/kWh
 *    (CO₂ bei der Stromerzeugung). Das sind KEINE Herstellungsemissionen des Fahrzeugs.
 * C. method = 'tremod': UBA-TREMOD-Durchschnittswert je Personenkilometer (Bezugsjahr 2024,
 *    inkl. Bereitstellung der Energieträger, ohne Fahrzeug-/Infrastrukturbereitstellung).
 *    Unabhängig vom eigenen Verbrauch; der Wert enthält 1,4 Personen/Pkw bereits.
 */
export function calculateCarCO2(inputs: Record<string, any>): CalculationResult {
  if (isBlank(inputs.distanceKm)) {
    return {
      primary: { id: 'co2', label: 'CO₂-Ausstoß', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die Fahrstrecke in Kilometern an.',
    };
  }

  const distanceKm = parseDe(inputs.distanceKm);
  if (isNaN(distanceKm) || distanceKm <= 0) {
    return {
      primary: { id: 'co2', label: 'CO₂-Ausstoß', value: 0, formattedValue: '-' },
      error: 'Die Fahrstrecke muss eine positive Zahl größer als 0 km sein.',
    };
  }

  const fuelType = String(inputs.fuelType || 'benzin'); // 'benzin' | 'diesel' | 'electric'
  const tripMode = String(inputs.tripMode || 'annual'); // 'annual' | 'single_trip'
  const method = String(inputs.method || 'direct'); // 'direct' | 'tremod'
  const isElectric = fuelType === 'electric';
  const isAnnual = tripMode === 'annual';

  const labelPrefix = isAnnual ? 'Jährlicher CO₂-Ausstoß' : 'CO₂-Ausstoß der Einzelfahrt';
  const perTripText = (totalKg: number, gas: string) => {
    const tonnes = totalKg / 1000;
    return isAnnual
      ? tonnes >= 1
        ? `${formatNumber(tonnes, 2)} Tonnen ${gas}`
        : `${formatNumber(totalKg, 1)} kg ${gas}`
      : totalKg >= 1000
        ? `${formatNumber(tonnes, 2)} Tonnen ${gas} (${formatNumber(totalKg, 0)} kg)`
        : `${formatNumber(totalKg, 1)} kg ${gas}`;
  };

  // ------------------------------------------------------------------
  // C. UBA TREMOD-Durchschnitt je Personenkilometer
  // ------------------------------------------------------------------
  if (method === 'tremod') {
    const tremodKey = fuelType === 'diesel' ? 'verkehr_pkw_diesel' : isElectric ? 'verkehr_pkw_elektro' : 'verkehr_pkw_benzin';
    const f = EMISSION_FACTORS[tremodKey];
    const totalKg = (distanceKm * f.value) / 1000;
    const tonnes = totalKg / 1000;
    const driveName = fuelType === 'diesel' ? 'Diesel-Pkw' : isElectric ? 'Elektro-Pkw' : 'Benzin-Pkw';

    return {
      primary: {
        id: 'co2Total',
        label: `${labelPrefix} (Szenario C: UBA-Durchschnitt)`,
        value: isAnnual ? tonnes : totalKg,
        formattedValue: perTripText(totalKg, 'CO₂e'),
        highlight: true,
      },
      secondary: [
        {
          id: 'co2PerKm',
          label: 'Faktor je Personenkilometer',
          value: f.value,
          formattedValue: `${formatNumber(f.value, 0)} g CO₂e/Pkm`,
          highlight: true,
          helpText: `UBA TREMOD 6.71B, Bezugsjahr 2024: Durchschnitt aller ${driveName} bei 1,4 Personen je Pkw.`,
        },
        {
          id: 'factorUsed',
          label: 'Angewandter Emissionsfaktor',
          value: f.value,
          formattedValue: `${formatNumber(f.value, 0)} g CO₂e/Pkm`,
          helpText: f.name,
        },
      ],
      directAnswer: `Szenario C (UBA-Durchschnitt): ${formatNumber(distanceKm, 0)} Personenkilometer im ${driveName} ergeben rechnerisch rund ${formatNumber(totalKg, 0)} kg CO₂e (${formatNumber(f.value, 0)} g CO₂e/Pkm, inkl. Bereitstellung der Energieträger).`,
      summaryText: `Mit dem UBA-Durchschnittswert für ${driveName} (${formatNumber(f.value, 0)} g CO₂e/Pkm, Bezugsjahr 2024) ergeben ${formatNumber(distanceKm, 0)} Personenkilometer rund ${formatNumber(totalKg, 0)} kg CO₂e.`,
      basisSummary: [
        { label: 'Rechenweg', value: 'C: UBA-TREMOD-Durchschnitt je Personenkilometer' },
        { label: 'Fahrtart', value: isAnnual ? 'Jährliche Gesamtfahrleistung' : 'Einzelfahrt' },
        { label: 'Strecke', value: `${formatNumber(distanceKm, 0)} km (als Personenkilometer einer Person)` },
        { label: 'Datenquelle', value: 'UBA, TREMOD 6.71B (10/2025), Bezugsjahr 2024' },
        { label: 'Bilanzgrenze', value: 'Direkte Emissionen + Bereitstellung/Umwandlung der Energieträger; ohne Fahrzeug- und Infrastrukturbereitstellung' },
      ],
      calculationSteps: [
        `CO₂e: ${formatNumber(distanceKm, 0)} Pkm × ${formatNumber(f.value, 0)} g/Pkm ÷ 1.000 = ${formatNumber(totalKg, 1)} kg CO₂e`,
        'Der Faktor enthält den durchschnittlichen Besetzungsgrad (1,4 Personen/Pkw) bereits und darf nicht nochmals durch Mitfahrende geteilt werden.',
      ],
      qualifications: [
        'Dieses Szenario verwendet einen Durchschnittswert aller Fahrzeuge der gewählten Antriebsart – es nutzt Ihren eigenen Verbrauch nicht. Für verbrauchsbasierte Werte wählen Sie Rechenweg A/B.',
        'Die Werte aus Rechenweg A/B (nur direkte Emissionen) und C (inkl. Bereitstellung der Energieträger) haben unterschiedliche Bilanzgrenzen und dürfen nicht gegeneinander verglichen werden.',
        'Beim Elektro-Pkw basiert der UBA-Wert auf dem durchschnittlichen deutschen Strommix; Fahrzeugherstellung ist nicht enthalten.',
      ],
    };
  }

  // ------------------------------------------------------------------
  // A / B. Verbrauchsbasiert, direkte Emissionen
  // ------------------------------------------------------------------
  let defaultConsumption = 6.8;
  if (fuelType === 'diesel') defaultConsumption = 5.5;
  else if (isElectric) defaultConsumption = 18.0;

  const rawConsumption = !isBlank(inputs.consumption) ? parseDe(inputs.consumption) : defaultConsumption;

  if (isNaN(rawConsumption) || rawConsumption <= 0) {
    return {
      primary: { id: 'co2', label: 'CO₂-Ausstoß', value: 0, formattedValue: '-' },
      error: 'Der Kraftstoff- bzw. Stromverbrauch muss eine positive Zahl sein.',
    };
  }

  const unit = isElectric ? 'kWh' : 'Liter';
  let factor: number;
  let factorName: string;
  let routeLabel: string;
  let boundaryText: string;
  let boundaryQualification: string;

  if (isElectric) {
    factor = EMISSION_FACTORS.strom_mix_de_generation_2025.value / 1000; // kg CO₂/kWh
    factorName = 'Deutscher Strommix, Datenjahr 2025: 344 g CO₂/kWh (UBA-Schätzung, CO₂ bei der Stromerzeugung)';
    routeLabel = 'B: Stromnetz-Faktor (Datenjahr 2025)';
    boundaryText = 'CO₂ bei der Stromerzeugung im Netz (Datenjahr 2025, UBA-Schätzung); kein Lebenszyklus, keine Fahrzeugherstellung';
    boundaryQualification =
      'Rechenweg B: Für das Elektroauto wird der deutsche Strommix des Datenjahres 2025 (UBA-Schätzung, 344 g CO₂/kWh, CO₂ bei der Stromerzeugung) verwendet. Das ist ein Netzfaktor – keine Herstellungsemissionen des Fahrzeugs und kein Lebenszyklus-Wert. Am Auspuff entstehen keine Emissionen.';
  } else if (fuelType === 'diesel') {
    factor = EMISSION_FACTORS.brennstoff_diesel_ebev.value;
    factorName = `Diesel, EBeV-abgeleitet: ${formatNumber(factor, 3)} kg CO₂/l (direkte Verbrennung)`;
    routeLabel = 'A: Direkte Kraftstoffverbrennung (EBeV-abgeleitet)';
    boundaryText = 'Direkte CO₂-Emissionen der Verbrennung (EBeV-2030-Standardwerte); ohne Vorkette';
    boundaryQualification =
      'Rechenweg A: Reine direkte Verbrennungsemission des Kraftstoffs (EBeV-2030-Standardwerte, von RechenHafen zu kg/Liter abgeleitet). Vorketten wie Förderung, Raffination und Transport sind nicht enthalten.';
  } else {
    factor = EMISSION_FACTORS.brennstoff_benzin_ebev.value;
    factorName = `Benzin, EBeV-abgeleitet: ${formatNumber(factor, 3)} kg CO₂/l (direkte Verbrennung)`;
    routeLabel = 'A: Direkte Kraftstoffverbrennung (EBeV-abgeleitet)';
    boundaryText = 'Direkte CO₂-Emissionen der Verbrennung (EBeV-2030-Standardwerte); ohne Vorkette';
    boundaryQualification =
      'Rechenweg A: Reine direkte Verbrennungsemission des Kraftstoffs (EBeV-2030-Standardwerte, von RechenHafen zu kg/Liter abgeleitet). Vorketten wie Förderung, Raffination und Transport sind nicht enthalten.';
  }

  const gas = 'CO₂';
  const totalFuel = (distanceKm * rawConsumption) / 100;
  const totalCO2Kg = totalFuel * factor;
  const co2PerKmGrams = (totalCO2Kg / distanceKm) * 1000;
  const co2Tonnes = totalCO2Kg / 1000;

  const secondary: ResultItem[] = [
    {
      id: 'co2PerKm',
      label: 'Spezifische Emissionen pro Kilometer',
      value: co2PerKmGrams,
      formattedValue: `${formatNumber(co2PerKmGrams, 0)} g ${gas}/km`,
      highlight: true,
      helpText: 'Berechnete Emissionen geteilt durch die gefahrene Wegstrecke (je Fahrzeugkilometer).',
    },
    {
      id: 'totalFuel',
      label: isAnnual ? `Jahresbedarf an ${unit}` : 'Bedarf für diese Fahrt',
      value: totalFuel,
      formattedValue: `${formatNumber(totalFuel, 1)} ${unit}`,
      helpText: `Berechnet aus ${formatNumber(distanceKm, 0)} km bei ${formatNumber(rawConsumption, 1)} ${unit}/100 km.`,
    },
    {
      id: 'factorUsed',
      label: 'Angewandter Emissionsfaktor',
      value: factor,
      formattedValue: `${formatNumber(factor, 3)} kg ${gas} pro ${unit}`,
      helpText: factorName,
    },
  ];

  if (isAnnual) {
    secondary.push({
      id: 'monthlyAverage',
      label: 'Monatlicher Durchschnitt',
      value: totalCO2Kg / 12,
      formattedValue: `${formatNumber(totalCO2Kg / 12, 1)} kg ${gas}/Monat`,
    });
  }

  return {
    primary: {
      id: 'co2Total',
      label: labelPrefix,
      value: isAnnual ? co2Tonnes : totalCO2Kg,
      formattedValue: perTripText(totalCO2Kg, gas),
      highlight: true,
    },
    secondary,
    directAnswer: isAnnual
      ? `Rechenweg ${routeLabel}: Bei ${formatNumber(distanceKm, 0)} km Fahrleistung und ${formatNumber(rawConsumption, 1)} ${unit}/100 km ergeben sich jährlich rund ${formatNumber(co2Tonnes, 2)} Tonnen ${gas} (rund ${formatNumber(co2PerKmGrams, 0)} g/km).`
      : `Rechenweg ${routeLabel}: Für eine Einzelfahrt über ${formatNumber(distanceKm, 0)} km ergeben sich rund ${formatNumber(totalCO2Kg, 1)} kg ${gas} (rund ${formatNumber(co2PerKmGrams, 0)} g/km).`,
    summaryText: `Rechenweg ${routeLabel}: ${formatNumber(distanceKm, 0)} km bei ${formatNumber(rawConsumption, 1)} ${unit}/100 km ergeben rund ${formatNumber(totalCO2Kg, 1)} kg ${gas} (rund ${formatNumber(co2PerKmGrams, 0)} g/km).`,
    basisSummary: [
      { label: 'Rechenweg', value: routeLabel },
      { label: 'Fahrtart', value: isAnnual ? 'Jährliche Gesamtfahrleistung' : 'Einzelfahrt' },
      { label: 'Strecke', value: `${formatNumber(distanceKm, 0)} km` },
      { label: 'Verbrauch (eigene Angabe)', value: `${formatNumber(rawConsumption, 1)} ${unit}/100 km` },
      { label: 'Bilanzgrenze', value: boundaryText },
      { label: 'Faktor', value: `${formatNumber(factor, 3)} kg ${gas}/${unit}` },
    ],
    calculationSteps: [
      `Bedarf: (${formatNumber(distanceKm, 0)} km × ${formatNumber(rawConsumption, 1)} ${unit}) ÷ 100 = ${formatNumber(totalFuel, 2)} ${unit}`,
      `${gas}-Ausstoß: ${formatNumber(totalFuel, 2)} ${unit} × ${formatNumber(factor, 3)} kg/${unit} = ${formatNumber(totalCO2Kg, 1)} kg ${gas}`,
      `Spezifische Emission: (${formatNumber(totalCO2Kg, 1)} kg × 1.000) ÷ ${formatNumber(distanceKm, 0)} km = ${formatNumber(co2PerKmGrams, 1)} g ${gas}/km`,
    ],
    qualifications: [
      boundaryQualification,
      'Benzin/Diesel (nur Verbrennung) und Strom (nur Erzeugung im Netz) sind beide ohne Vorketten gerechnet, entstehen aber an unterschiedlichen Orten. Der Vergleich ist ein vereinfachtes Modell – kein Lebenszyklus-Vergleich. Fahrzeugbau, Batterieherstellung, Reifenabrieb und Entsorgung sind nicht eingerechnet.',
      'Verbrauchswerte sind Ihre eigenen Angaben bzw. ein Rechenbeispiel. Den UBA-Durchschnitt je Personenkilometer (inkl. Bereitstellung der Energieträger) finden Sie im Rechenweg C.',
    ],
  };
}

/**
 * 5. CO₂-Kostenaufteilung Vermieter / Mieter nach CO2KostAufG
 *
 * Gesetzliche Grundlagen:
 * - § 5 Abs. 1 & Anlage CO2KostAufG: 10-Stufen-Modell für Wohngebäude
 * - § 5 Abs. 1 Satz 4 CO2KostAufG: Bei unterjährigen Zeiträumen anteilige Kürzung der Tabellengrenzwerte
 * - § 9 Abs. 1 CO2KostAufG: Hälftige Kürzung des Vermieteranteils bei Hindernissen für Sanierung ODER Wärmeversorgung
 * - § 9 Abs. 2 CO2KostAufG: Keine Aufteilung nach dem regulären Modell, wenn Hindernisse für BEIDE Bereiche vorliegen
 */

export interface StatutoryStep {
  step: number;
  annualMin: number;
  annualMax: number | null;
  landlordPct: number;
  tenantPct: number;
  description: string;
}

export const CO2KOSTAUFG_STEPS: StatutoryStep[] = [
  { step: 1, annualMin: 0, annualMax: 12, landlordPct: 0.00, tenantPct: 1.00, description: '< 12 kg CO₂/m²a' },
  { step: 2, annualMin: 12, annualMax: 17, landlordPct: 0.10, tenantPct: 0.90, description: '12 bis < 17 kg CO₂/m²a' },
  { step: 3, annualMin: 17, annualMax: 22, landlordPct: 0.20, tenantPct: 0.80, description: '17 bis < 22 kg CO₂/m²a' },
  { step: 4, annualMin: 22, annualMax: 27, landlordPct: 0.30, tenantPct: 0.70, description: '22 bis < 27 kg CO₂/m²a' },
  { step: 5, annualMin: 27, annualMax: 32, landlordPct: 0.40, tenantPct: 0.60, description: '27 bis < 32 kg CO₂/m²a' },
  { step: 6, annualMin: 32, annualMax: 37, landlordPct: 0.50, tenantPct: 0.50, description: '32 bis < 37 kg CO₂/m²a' },
  { step: 7, annualMin: 37, annualMax: 42, landlordPct: 0.60, tenantPct: 0.40, description: '37 bis < 42 kg CO₂/m²a' },
  { step: 8, annualMin: 42, annualMax: 47, landlordPct: 0.70, tenantPct: 0.30, description: '42 bis < 47 kg CO₂/m²a' },
  { step: 9, annualMin: 47, annualMax: 52, landlordPct: 0.80, tenantPct: 0.20, description: '47 bis < 52 kg CO₂/m²a' },
  { step: 10, annualMin: 52, annualMax: null, landlordPct: 0.95, tenantPct: 0.05, description: '≥ 52 kg CO₂/m²a' },
];

export function calculateLandlordTenantCO2(inputs: Record<string, any>): CalculationResult {
  // 1. Validierung der Kosten
  if (isBlank(inputs.co2CostTotal)) {
    return {
      primary: { id: 'landlordShare', label: 'Kostenanteil Vermieter', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie den CO₂-Kostenbetrag für den Abrechnungszeitraum an.',
    };
  }
  const totalCost = parseDe(inputs.co2CostTotal);
  if (isNaN(totalCost) || totalCost < 0) {
    return {
      primary: { id: 'landlordShare', label: 'Kostenanteil Vermieter', value: 0, formattedValue: '-' },
      error: 'Die CO₂-Kosten dürfen nicht negativ sein (0 € ist zulässig).',
    };
  }

  // 2. Validierung der Wohnfläche
  if (isBlank(inputs.livingArea)) {
    return {
      primary: { id: 'landlordShare', label: 'Kostenanteil Vermieter', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die maßgebliche Wohnfläche in m² an.',
    };
  }
  const livingArea = parseDe(inputs.livingArea);
  if (isNaN(livingArea) || livingArea <= 0) {
    return {
      primary: { id: 'landlordShare', label: 'Kostenanteil Vermieter', value: 0, formattedValue: '-' },
      error: 'Die maßgebliche Wohnfläche muss eine Zahl größer als 0 m² sein.',
    };
  }

  // 3. Validierung der Abrechnungsdauer (in Monaten)
  const billingMonthsRaw = !isBlank(inputs.billingMonths) ? parseDe(inputs.billingMonths) : 12;
  const billingMonths = Math.round(billingMonthsRaw);
  if (isNaN(billingMonths) || billingMonths < 1 || billingMonths > 12) {
    return {
      primary: { id: 'landlordShare', label: 'Kostenanteil Vermieter', value: 0, formattedValue: '-' },
      error: 'Die Dauer des Abrechnungszeitraums muss zwischen 1 und 12 Monaten liegen.',
    };
  }

  // 4. CO₂-Emissionsmenge ermitteln (bevorzugt: Gesamt-kg des Zeitraums; abwärtskompatibel: kg/m² wenn kg fehlt)
  let periodEmissionsKg: number;
  let specificEmission: number; // kg CO₂/m² im Abrechnungszeitraum

  if (!isBlank(inputs.co2EmissionsKg)) {
    periodEmissionsKg = parseDe(inputs.co2EmissionsKg);
    if (isNaN(periodEmissionsKg) || periodEmissionsKg < 0) {
      return {
        primary: { id: 'landlordShare', label: 'Kostenanteil Vermieter', value: 0, formattedValue: '-' },
        error: 'Die CO₂-Emissionsmenge darf nicht negativ sein (0 kg ist zulässig).',
      };
    }
    specificEmission = periodEmissionsKg / livingArea;
  } else if (!isBlank(inputs.co2EmissionKgPerSqm)) {
    // Rückfall-Unterstützung für Altaufrufe
    const rawSpecific = parseDe(inputs.co2EmissionKgPerSqm);
    if (isNaN(rawSpecific) || rawSpecific < 0) {
      return {
        primary: { id: 'landlordShare', label: 'Kostenanteil Vermieter', value: 0, formattedValue: '-' },
        error: 'Der spezifische CO₂-Ausstoß darf nicht negativ sein.',
      };
    }
    // Wenn als Jahreswert übergeben und Abrechnung unterjährig: in Zeitraum-Emission umrechnen
    specificEmission = billingMonths < 12 && inputs.annualizedInput ? (rawSpecific * billingMonths) / 12 : rawSpecific;
    periodEmissionsKg = specificEmission * livingArea;
  } else {
    return {
      primary: { id: 'landlordShare', label: 'Kostenanteil Vermieter', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die CO₂-Emissionen des Abrechnungszeitraums in Kilogramm (kg) an.',
    };
  }

  // 5. Grenzwerte nach § 5 Abs. 1 Satz 4 anteilig kürzen
  // Skalierungsfaktor: N / 12
  const scale = billingMonths / 12;
  const scaledAnnualThresholds = [12, 17, 22, 27, 32, 37, 42, 47, 52].map((t) => t * scale);

  // Stufeneinordnung gegen die proportional reduzierten Grenzwerte:
  let stepIndex = 0;
  if (specificEmission < scaledAnnualThresholds[0]) {
    stepIndex = 0;
  } else if (specificEmission < scaledAnnualThresholds[1]) {
    stepIndex = 1;
  } else if (specificEmission < scaledAnnualThresholds[2]) {
    stepIndex = 2;
  } else if (specificEmission < scaledAnnualThresholds[3]) {
    stepIndex = 3;
  } else if (specificEmission < scaledAnnualThresholds[4]) {
    stepIndex = 4;
  } else if (specificEmission < scaledAnnualThresholds[5]) {
    stepIndex = 5;
  } else if (specificEmission < scaledAnnualThresholds[6]) {
    stepIndex = 6;
  } else if (specificEmission < scaledAnnualThresholds[7]) {
    stepIndex = 7;
  } else if (specificEmission < scaledAnnualThresholds[8]) {
    stepIndex = 8;
  } else {
    stepIndex = 9;
  }

  const matchedStep = CO2KOSTAUFG_STEPS[stepIndex];
  const baseLandlordPct = matchedStep.landlordPct;
  const baseTenantPct = matchedStep.tenantPct;

  // Formatierter Schwellenwert-Bereich für den Zeitraum
  const periodMin = stepIndex === 0 ? 0 : scaledAnnualThresholds[stepIndex - 1];
  const periodMax = stepIndex === 9 ? null : scaledAnnualThresholds[stepIndex];
  const stepPeriodRange =
    stepIndex === 0
      ? `< ${formatNumber(scaledAnnualThresholds[0], 2)} kg/m²`
      : stepIndex === 9
        ? `≥ ${formatNumber(scaledAnnualThresholds[8], 2)} kg/m²`
        : `${formatNumber(periodMin, 2)} bis < ${formatNumber(periodMax!, 2)} kg/m²`;

  // 6. Prüfung auf § 9 CO2KostAufG
  const exemptionRaw = String(inputs.statutoryExemption || 'none');
  let isSingleRestriction = exemptionRaw === 'single_restriction' || exemptionRaw === 'heritage' || exemptionRaw === 'district_mandate';
  let isBothRestrictions = exemptionRaw === 'both_restrictions';

  // Fall § 9 Abs. 2: Beide Kategorien verhindert -> keine Aufteilung nach regulärem Stufenmodell
  if (isBothRestrictions) {
    const specialText = 'Keine Aufteilung nach dem regulären Stufenmodell gemäß § 9 Abs. 2 CO2KostAufG';
    const explanation =
      'Stehen öffentlich-rechtliche Vorgaben sowohl einer wesentlichen energetischen Verbesserung des Gebäudes als auch einer wesentlichen Verbesserung der Wärme- und Warmwasserversorgung entgegen, findet nach § 9 Abs. 2 CO2KostAufG keine Aufteilung nach dem Stufenmodell statt. Die Kosten verbleiben in der vertraglichen Tragung, sofern keine andere Regelung greift.';

    return {
      primary: {
        id: 'landlordShare',
        label: 'Gesetzliche Kostenaufteilung',
        value: 0,
        formattedValue: specialText,
        highlight: true,
        helpText: 'Öffentlich-rechtliche Beschränkungen betreffen beide Sanierungsbereiche kumulativ.',
      },
      secondary: [
        {
          id: 'stepClassification',
          label: 'Theoretische Stufe nach Gebäudeemission',
          value: matchedStep.step,
          formattedValue: `Stufe ${matchedStep.step} von 10 (${formatPercent(baseLandlordPct * 100, 0)} Vermieterbasis)`,
          helpText: `Spezifischer Zeitraum-Ausstoß: ${formatNumber(specificEmission, 2)} kg CO₂/m² (${stepPeriodRange})`,
        },
        {
          id: 'statutoryExemptionApplied',
          label: 'Angewandte Sonderregelung',
          value: 2,
          formattedValue: '§ 9 Abs. 2 CO2KostAufG',
          helpText: 'Voraussetzung: Vermieter muss beide Hinderungsgründe nachweisen können (§ 9 Abs. 3).',
        },
        {
          id: 'totalCostInput',
          label: 'Gesamte CO₂-Kosten des Zeitraums',
          value: totalCost,
          formattedValue: formatCurrency(totalCost),
        },
      ],
      directAnswer: `${specialText}. Da nach Ihrer Eingabe öffentlich-rechtliche Vorgaben sowohl die Gebäudesanierung als auch die Heizungsverbesserung verhindern, entfällt die reguläre Stufenaufteilung.`,
      summaryText: explanation,
      basisSummary: [
        { label: 'CO₂-Kosten', value: formatCurrency(totalCost) },
        { label: 'CO₂-Emissionen', value: `${formatNumber(periodEmissionsKg, 1)} kg` },
        { label: 'Wohnfläche', value: `${formatNumber(livingArea, 1)} m²` },
        { label: 'Abrechnungsdauer', value: `${billingMonths} Monate` },
        { label: 'Spezifische Zeitraum-Emission', value: `${formatNumber(specificEmission, 2)} kg CO₂/m²` },
        { label: 'Gesetzliche Ausnahme', value: '§ 9 Abs. 2 (beide Sanierungsbereiche rechtlich blockiert)' },
      ],
      calculationSteps: [
        `Spezifischer Zeitraum-Ausstoß: ${formatNumber(periodEmissionsKg, 1)} kg CO₂ ÷ ${formatNumber(livingArea, 1)} m² = ${formatNumber(specificEmission, 2)} kg CO₂/m²`,
        billingMonths < 12
          ? `Grenzwerte anteilig gekürzt (${billingMonths}/12): ${stepPeriodRange} entspricht Stufe ${matchedStep.step} (theoretisch ${formatPercent(baseLandlordPct * 100, 0)} Vermieter / ${formatPercent(baseTenantPct * 100, 0)} Mieter).`
          : `Einordnung in Anlage zu § 5: Stufe ${matchedStep.step} (${matchedStep.description}).`,
        'Rechtsfolge nach § 9 Abs. 2: Keine Aufteilung der Kohlendioxidkosten nach dem regulären Stufenmodell.',
      ],
      qualifications: [
        'Der Rechner dient zur rechnerischen Orientierung anhand der eingegebenen Daten und des gesetzlichen Stufenmodells. Sonderfälle und die rechtliche Einordnung öffentlich-rechtlicher Beschränkungen können eine individuelle Prüfung erfordern. Keine Rechtsberatung.',
        'Der Vermieter kann sich auf § 9 nur berufen, wenn er dem Mieter die Umstände nachweist (§ 9 Abs. 3 CO2KostAufG).',
        'Gilt für Wohngebäude. Bei Nichtwohngebäuden gilt nach § 8 CO2KostAufG eine gesetzliche 50:50-Aufteilung.',
      ],
    };
  }

  // Fall § 9 Abs. 1 (Halbierung) oder regulär (keine Ausnahme)
  let effectiveLandlordPct = baseLandlordPct;
  let exemptionNote = '';

  if (isSingleRestriction) {
    effectiveLandlordPct = baseLandlordPct * 0.5;
    exemptionNote = 'Vermieteranteil nach § 9 Abs. 1 CO2KostAufG um die Hälfte gekürzt (eine Kategorie rechtlich gehindert, z. B. Denkmalschutz oder Anschlusszwang).';
  }

  const effectiveTenantPct = 1 - effectiveLandlordPct;
  const landlordCost = totalCost * effectiveLandlordPct;
  const tenantCost = totalCost - landlordCost;

  // Breakdown Table mit allen 10 Stufen (inkl. dynamisch skalierter Grenzwerte)
  const breakdownRows = CO2KOSTAUFG_STEPS.map((s, idx) => {
    const sMin = idx === 0 ? 0 : scaledAnnualThresholds[idx - 1];
    const sMax = idx === 9 ? null : scaledAnnualThresholds[idx];
    const rangeText =
      idx === 0
        ? `< ${formatNumber(scaledAnnualThresholds[0], 2)}`
        : idx === 9
          ? `≥ ${formatNumber(scaledAnnualThresholds[8], 2)}`
          : `${formatNumber(sMin, 2)} bis < ${formatNumber(sMax!, 2)}`;

    return {
      period: s.step,
      values: {
        step: `Stufe ${s.step}${idx === stepIndex ? ' (Ihre Stufe)' : ''}`,
        periodThreshold: `${rangeText} kg/m²`,
        annualThreshold: s.description,
        landlordShare: formatPercent(s.landlordPct * 100, 0),
        tenantShare: formatPercent(s.tenantPct * 100, 0),
      },
    };
  });

  const formattedLandlordCost = formatCurrency(landlordCost);
  const formattedTenantCost = formatCurrency(tenantCost);
  const formattedLandlordPct = formatPercent(effectiveLandlordPct * 100, 1);
  const formattedTenantPct = formatPercent(effectiveTenantPct * 100, 1);

  return {
    primary: {
      id: 'landlordShare',
      label: 'Kostenanteil Vermieter',
      value: landlordCost,
      formattedValue: formattedLandlordCost,
      highlight: true,
      helpText: `Entspricht ${formattedLandlordPct} von ${formatCurrency(totalCost)} Gesamtkosten.`,
    },
    secondary: [
      {
        id: 'tenantShare',
        label: 'Kostenanteil Mieter',
        value: tenantCost,
        formattedValue: formattedTenantCost,
        helpText: `Entspricht ${formattedTenantPct} von ${formatCurrency(totalCost)}.`,
      },
      {
        id: 'landlordPct',
        label: 'Vermieteranteil (Prozent)',
        value: effectiveLandlordPct * 100,
        formattedValue: formattedLandlordPct,
      },
      {
        id: 'tenantPct',
        label: 'Mieteranteil (Prozent)',
        value: effectiveTenantPct * 100,
        formattedValue: formattedTenantPct,
      },
      {
        id: 'stepClassification',
        label: 'Gesetzliche Einstufung',
        value: matchedStep.step,
        formattedValue: `Stufe ${matchedStep.step} von 10 (${formatPercent(baseLandlordPct * 100, 0)} Basisanteil)`,
        helpText: `Grenzwerte für ${billingMonths} Monate: ${stepPeriodRange}`,
      },
      {
        id: 'specificEmissionDisplay',
        label: `Spezifischer Ausstoß (${billingMonths} Mon.)`,
        value: specificEmission,
        formattedValue: `${formatNumber(specificEmission, 2)} kg CO₂/m²`,
        helpText: `${formatNumber(periodEmissionsKg, 1)} kg ÷ ${formatNumber(livingArea, 1)} m²`,
      },
      ...(isSingleRestriction
        ? [
            {
              id: 'exemptionEffect',
              label: 'Auswirkung § 9 Abs. 1',
              value: effectiveLandlordPct * 100,
              formattedValue: `${formatPercent(baseLandlordPct * 100, 0)} → ${formattedLandlordPct} Vermieter`,
              helpText: exemptionNote,
            },
          ]
        : []),
    ],
    breakdown: {
      columns: [
        { key: 'step', label: 'Stufe' },
        { key: 'periodThreshold', label: `Grenzwert (${billingMonths} Monate)` },
        { key: 'annualThreshold', label: 'Grenzwert (Jahresbasis)' },
        { key: 'landlordShare', label: 'Vermieter' },
        { key: 'tenantShare', label: 'Mieter' },
      ],
      rows: breakdownRows,
    },
    directAnswer: `Von den ${formatCurrency(totalCost)} CO₂-Kosten entfallen nach CO2KostAufG ${formattedLandlordCost} (${formattedLandlordPct}) auf den Vermieter und ${formattedTenantCost} (${formattedTenantPct}) auf den Mieter.`,
    summaryText: `Bei ${formatNumber(specificEmission, 2)} kg CO₂/m² im Abrechnungszeitraum (${billingMonths} Monate) ist das Gebäude in Stufe ${matchedStep.step} eingestuft. Der Vermieter trägt ${formattedLandlordCost} (${formattedLandlordPct}) und der Mieter ${formattedTenantCost} (${formattedTenantPct}) der CO₂-Kosten.`,
    basisSummary: [
      { label: 'CO₂-Kosten', value: formatCurrency(totalCost) },
      { label: 'CO₂-Emissionen des Zeitraums', value: `${formatNumber(periodEmissionsKg, 1)} kg` },
      { label: 'Maßgebliche Wohnfläche', value: `${formatNumber(livingArea, 1)} m²` },
      { label: 'Dauer des Abrechnungszeitraums', value: `${billingMonths} Monate` },
      { label: 'Spezifischer Zeitraum-Ausstoß', value: `${formatNumber(specificEmission, 2)} kg CO₂/m²` },
      { label: 'Gesetzliche Stufe', value: `Stufe ${matchedStep.step} von 10` },
      { label: 'Öffentlich-rechtliche Beschränkung', value: isSingleRestriction ? '§ 9 Abs. 1 (Vermieteranteil halbiert)' : 'Keine (reguläre Aufteilung)' },
    ],
    calculationSteps: [
      `1. Spezifische Zeitraum-Emission: ${formatNumber(periodEmissionsKg, 1)} kg CO₂ ÷ ${formatNumber(livingArea, 1)} m² = ${formatNumber(specificEmission, 2)} kg CO₂/m²`,
      billingMonths < 12
        ? `2. Proportionale Grenzwertkürzung (§ 5 Abs. 1 Satz 4): Jahresgrenzwerte × (${billingMonths} ÷ 12). Grenzwerte dieser Stufe: ${stepPeriodRange} → Stufe ${matchedStep.step} (Basis: ${formatPercent(baseLandlordPct * 100, 0)} Vermieter / ${formatPercent(baseTenantPct * 100, 0)} Mieter).`
        : `2. Stufenzuordnung (§ 5 Abs. 1 & Anlage): ${stepPeriodRange} → Stufe ${matchedStep.step} (Basis: ${formatPercent(baseLandlordPct * 100, 0)} Vermieter / ${formatPercent(baseTenantPct * 100, 0)} Mieter).`,
      isSingleRestriction
        ? `3. Anwendung § 9 Abs. 1 CO2KostAufG: Vermieteranteil wird halbiert: ${formatPercent(baseLandlordPct * 100, 0)} × 0,5 = ${formattedLandlordPct}; Mieteranteil = 100 % − ${formattedLandlordPct} = ${formattedTenantPct}.`
        : `3. Anwendbare Anteile: Vermieter ${formattedLandlordPct}, Mieter ${formattedTenantPct}.`,
      `4. Kostenaufteilung: Vermieter = ${formatCurrency(totalCost)} × ${formattedLandlordPct} = ${formattedLandlordCost}; Mieter = ${formatCurrency(totalCost)} − ${formattedLandlordCost} = ${formattedTenantCost}.`,
    ],
    qualifications: [
      'Der Rechner dient zur rechnerischen Orientierung anhand der eingegebenen Daten und des gesetzlichen Stufenmodells. Sonderfälle und die rechtliche Einordnung öffentlich-rechtlicher Beschränkungen können eine individuelle Prüfung erfordern. Keine Rechtsberatung.',
      'Abrechnungsgrundlage: Verwenden Sie vorrangig die auf Ihrer Brennstoff- oder Heizkostenabrechnung nach § 3 CO2KostAufG ausgewiesenen CO₂-Kosten und Emissionsmengen.',
      'Der Vermieter kann sich auf § 9 nur berufen, wenn er dem Mieter die berechtigenden Umstände nachweist (§ 9 Abs. 3 CO2KostAufG). Ein Fernwärmeanschluss führt nicht automatisch zum Wegfall des Vermieteranteils.',
      'Für Nichtwohngebäude (Gewerberäume) gilt nach § 8 CO2KostAufG eine gesetzliche 50:50-Halbteilung.',
    ],
  };
}
