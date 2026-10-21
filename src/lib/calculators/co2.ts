import { CalculationResult, ResultItem } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';
import { EMISSION_FACTORS } from '@/data/emissions';

/**
 * 1. CO2-Strom-Rechner Engine
 */
export function calculateElectricityCO2(inputs: Record<string, any>): CalculationResult {
  if (inputs.consumptionKwh === undefined || inputs.consumptionKwh === null || String(inputs.consumptionKwh).trim() === '') {
    return {
      primary: { id: 'co2', label: 'CO2-Emissionen Strom', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie Ihren Stromverbrauch in Kilowattstunden (kWh) an.',
    };
  }

  const kwh = parseFloat(String(inputs.consumptionKwh).replace(',', '.'));
  if (isNaN(kwh) || kwh < 0) {
    return {
      primary: { id: 'co2', label: 'CO2-Emissionen Strom', value: 0, formattedValue: '-' },
      error: 'Der Stromverbrauch darf nicht negativ sein (0 kWh ist zulässig).',
    };
  }

  const period = String(inputs.period || 'year'); // 'year' | 'month' | 'single'
  const tariffType = String(inputs.tariffType || 'grid_2025');

  let factorGrams = EMISSION_FACTORS.strom_mix_de_generation_2025.value; // 344 g/kWh
  let factorLabel = 'Deutscher Strommix 2025 (UBA-Schätzung: 344 g CO₂/kWh Inlandserzeugung)';
  let gasType: 'CO2' | 'CO2e' = 'CO2';
  let boundaryText = 'Direkte Erzeugungsemissionen im Inland (Scope 2, ohne Vorkette)';

  if (tariffType === 'grid_lifecycle') {
    factorGrams = EMISSION_FACTORS.strom_mix_de_lifecycle_2025.value; // 410 g/kWh
    factorLabel = 'Deutscher Strommix 2025 Lebenszyklus (410 g CO₂e/kWh inkl. Vorkette)';
    gasType = 'CO2e';
    boundaryText = 'Well-to-Wheel / Lebenszyklus inkl. Brennstoffvorkette und Leitungsverluste';
  } else if (tariffType === 'green_lifecycle') {
    factorGrams = EMISSION_FACTORS.strom_oekostrom_lifecycle.value; // 25 g/kWh
    factorLabel = 'Zertifizierter Ökostrom aus Neuanlagen (25 g CO₂e/kWh Lebenszyklus)';
    gasType = 'CO2e';
    boundaryText = 'Lebenszyklus PV / Wind (Herstellung, Wartung & Rückbau)';
  } else if (tariffType === 'custom') {
    const rawCustom = inputs.customFactorGrams !== undefined && inputs.customFactorGrams !== null && String(inputs.customFactorGrams).trim() !== ''
      ? parseFloat(String(inputs.customFactorGrams).replace(',', '.'))
      : 344;
    factorGrams = isNaN(rawCustom) || rawCustom < 0 ? 344 : rawCustom;
    factorLabel = `Benutzerdefinierter Emissionsfaktor (${formatNumber(factorGrams, 0)} g/kWh)`;
    boundaryText = 'Individuell eingegebener Faktor';
  }

  const totalKg = (kwh * factorGrams) / 1000;
  const totalTonnes = totalKg / 1000;

  // Perioden-Bezeichnung
  let periodSuffix = '';
  let periodLabel = 'Gesamtausstoß';
  if (period === 'year') {
    periodSuffix = ' im Jahr';
    periodLabel = 'Jährlicher CO2-Ausstoß';
  } else if (period === 'month') {
    periodSuffix = ' im Monat';
    periodLabel = 'Monatlicher CO2-Ausstoß';
  } else {
    periodLabel = 'CO2-Ausstoß des Verbrauchs';
  }

  // Ökostrom-Vergleich
  const greenKg = (kwh * EMISSION_FACTORS.strom_oekostrom_lifecycle.value) / 1000;
  const avoidedKg = Math.max(0, totalKg - greenKg);

  const formattedPrimary = totalTonnes >= 1
    ? `${formatNumber(totalTonnes, 2)} Tonnen ${gasType}${periodSuffix}`
    : `${formatNumber(totalKg, 1)} kg ${gasType}${periodSuffix}`;

  const secondary: ResultItem[] = [
    {
      id: 'totalKg',
      label: 'Emissionen in Kilogramm',
      value: totalKg,
      formattedValue: `${formatNumber(totalKg, 1)} kg ${gasType}`,
      highlight: true,
      helpText: `${formatNumber(kwh, 0)} kWh × ${formatNumber(factorGrams, 0)} g/kWh ÷ 1.000`,
    },
    {
      id: 'factorUsed',
      label: 'Angewendeter Emissionsfaktor',
      value: factorGrams,
      formattedValue: `${formatNumber(factorGrams, 0)} g ${gasType}/kWh`,
      helpText: factorLabel,
    },
  ];

  if (period === 'year') {
    secondary.push({
      id: 'monthlyAverage',
      label: 'Monatlicher Durchschnitt',
      value: totalKg / 12,
      formattedValue: `${formatNumber(totalKg / 12, 1)} kg ${gasType}/Monat`,
    });
  }

  if (tariffType !== 'green_lifecycle' && avoidedKg > 0) {
    secondary.push({
      id: 'savingsWithGreen',
      label: 'Minderungspotenzial mit Ökostrom',
      value: avoidedKg,
      formattedValue: avoidedKg >= 1000
        ? `ca. ${formatNumber(avoidedKg / 1000, 2)} t ${gasType} Vermeidung`
        : `ca. ${formatNumber(avoidedKg, 0)} kg ${gasType} Vermeidung`,
      helpText: `Verglichen mit Neuanlagen-Ökostrom (25 g CO₂e/kWh Lebenszyklus statt ${formatNumber(factorGrams, 0)} g/kWh).`,
    });
  }

  return {
    primary: {
      id: 'co2Primary',
      label: periodLabel,
      value: totalTonnes >= 1 ? totalTonnes : totalKg,
      formattedValue: formattedPrimary,
      highlight: true,
    },
    secondary,
    directAnswer: `Ein Stromverbrauch von ${formatNumber(kwh, 0)} kWh verursacht mit dem gewählten Faktor ca. ${totalTonnes >= 1 ? `${formatNumber(totalTonnes, 2)} Tonnen` : `${formatNumber(totalKg, 1)} kg`} ${gasType}${periodSuffix}.`,
    summaryText: `Bei einem Stromverbrauch von ${formatNumber(kwh, 0)} kWh und dem Faktor von ${formatNumber(factorGrams, 0)} g ${gasType}/kWh entstehen ${totalTonnes >= 1 ? `${formatNumber(totalTonnes, 2)} Tonnen` : `${formatNumber(totalKg, 1)} kg`} ${gasType}${periodSuffix}.`,
    basisSummary: [
      { label: 'Stromverbrauch', value: `${formatNumber(kwh, 0)} kWh` },
      { label: 'Zeitraum', value: period === 'year' ? '1 Kalenderjahr' : (period === 'month' ? '1 Monat' : 'Einmaliger Verbrauch') },
      { label: 'Emissionsfaktor', value: `${formatNumber(factorGrams, 0)} g ${gasType}/kWh` },
      { label: 'Bilanzgrenze', value: boundaryText },
    ],
    calculationSteps: [
      `Formel: Stromverbrauch (kWh) × Emissionsfaktor (g/kWh) ÷ 1.000 = kg ${gasType}`,
      `Berechnung: ${formatNumber(kwh, 0)} kWh × ${formatNumber(factorGrams, 0)} g/kWh ÷ 1.000 = ${formatNumber(totalKg, 2)} kg ${gasType}`,
      totalTonnes >= 1
        ? `Umrechnung in Tonnen: ${formatNumber(totalKg, 2)} kg ÷ 1.000 = ${formatNumber(totalTonnes, 3)} t ${gasType}`
        : `Ergebnis in Kilogramm: ${formatNumber(totalKg, 1)} kg ${gasType}`,
    ],
    qualifications: [
      'Der Standardwert von 344 g CO₂/kWh basiert auf der offiziellen UBA-Schätzung für den deutschen Strommix 2025 (veröffentlicht im März 2026). Er erfasst die direkte Stromerzeugung im Kraftwerkspark (Scope 2).',
      'Ökostrom ist im direkten Betrieb emissionsfrei, verursacht aber im Lebenszyklus (Herstellung von Windrädern und Solarmodulen) ca. 20 bis 30 g CO₂e/kWh.',
      'Dieser Rechner ermittelt ausschließlich strombezogene Treibhausgasemissionen und stellt keine vollständige persönliche Klimabilanz dar.',
    ],
  };
}

/**
 * 2. CO2-Pendeln-Rechner Engine
 */
export function calculateCommutingCO2(inputs: Record<string, any>): CalculationResult {
  if (inputs.oneWayDistanceKm === undefined || inputs.oneWayDistanceKm === null || String(inputs.oneWayDistanceKm).trim() === '') {
    return {
      primary: { id: 'emissions', label: 'Pendel-Emissionen', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die einfache Entfernung zum Arbeitsplatz in Kilometern an.',
    };
  }

  const oneWay = parseFloat(String(inputs.oneWayDistanceKm).replace(',', '.'));
  if (isNaN(oneWay) || oneWay <= 0) {
    return {
      primary: { id: 'emissions', label: 'Pendel-Emissionen', value: 0, formattedValue: '-' },
      error: 'Die einfache Entfernung muss größer als 0 km sein.',
    };
  }

  const tripStyle = String(inputs.tripStyle || 'roundtrip');
  const distanceMultiplier = tripStyle === 'roundtrip' ? 2 : 1;
  const days = inputs.commutingDays !== undefined && inputs.commutingDays !== null && String(inputs.commutingDays).trim() !== ''
    ? Math.max(1, parseInt(String(inputs.commutingDays), 10) || 180)
    : 180;

  const totalKmYear = oneWay * distanceMultiplier * days;

  // Primary mode
  const primaryMode = String(inputs.primaryMode || 'car_average');
  let primaryFactor = EMISSION_FACTORS.verkehr_pkw_durchschnitt.value; // 164 g/Pkm
  let primaryLabel = 'Pkw Flottendurchschnitt Deutschland (164 g CO₂e/Pkm)';

  if (primaryMode === 'car_diesel') {
    const cons = parseFloat(String(inputs.carConsumption || '5.5').replace(',', '.')) || 5.5;
    const occ = Math.max(1, parseInt(String(inputs.carOccupancy || '1'), 10) || 1);
    // Well-to-Wheel Diesel: 3.24 kg CO2e / l
    primaryFactor = ((cons * 3.24 * 1000) / 100) / occ;
    primaryLabel = `Eigener Diesel-Pkw (${formatNumber(cons, 1)} l/100 km, ${occ} ${occ === 1 ? 'Person' : 'Personen'})`;
  } else if (primaryMode === 'car_petrol') {
    const cons = parseFloat(String(inputs.carConsumption || '6.8').replace(',', '.')) || 6.8;
    const occ = Math.max(1, parseInt(String(inputs.carOccupancy || '1'), 10) || 1);
    // Well-to-Wheel Benzin: 2.82 kg CO2e / l
    primaryFactor = ((cons * 2.82 * 1000) / 100) / occ;
    primaryLabel = `Eigener Benzin-Pkw (${formatNumber(cons, 1)} l/100 km, ${occ} ${occ === 1 ? 'Person' : 'Personen'})`;
  } else if (primaryMode === 'car_electric') {
    const cons = parseFloat(String(inputs.carConsumption || '18.0').replace(',', '.')) || 18.0;
    const occ = Math.max(1, parseInt(String(inputs.carOccupancy || '1'), 10) || 1);
    // Strommix 2025 Lebenszyklus: 410 g CO2e / kWh
    primaryFactor = ((cons * 0.410 * 1000) / 100) / occ;
    primaryLabel = `Eigener Elektro-Pkw (${formatNumber(cons, 1)} kWh/100 km, Strommix 2025)`;
  }

  // Comparison mode
  const comparisonMode = String(inputs.comparisonMode || 'train_long');
  let compFactor = EMISSION_FACTORS.verkehr_bahn_fernverkehr.value; // 44 g/Pkm
  let compLabel = 'Eisenbahn Fernverkehr (ICE/IC – 44 g CO₂e/Pkm)';

  if (comparisonMode === 'train_regional') {
    compFactor = EMISSION_FACTORS.verkehr_bahn_nahverkehr.value; // 79
    compLabel = 'Eisenbahn Nahverkehr (Regionalbahn/S-Bahn – 79 g CO₂e/Pkm)';
  } else if (comparisonMode === 'bus_transit') {
    compFactor = EMISSION_FACTORS.verkehr_linienbus.value; // 108
    compLabel = 'Öffentlicher Linienbus (108 g CO₂e/Pkm)';
  } else if (comparisonMode === 'bike_foot') {
    compFactor = EMISSION_FACTORS.verkehr_fahrrad_fuss.value; // 0
    compLabel = 'Fahrrad & Fußverkehr (0 g CO₂e/Pkm)';
  }

  // Abweichende Streckenlänge für Vergleichsmittel (z. B. Bahnlinie ist länger als Autobahn)
  const hasDiffDist = Boolean(inputs.differentComparisonDistance);
  const compOneWay = hasDiffDist && inputs.comparisonDistanceKm !== undefined && inputs.comparisonDistanceKm !== ''
    ? Math.max(1, parseFloat(String(inputs.comparisonDistanceKm).replace(',', '.')) || oneWay)
    : oneWay;

  const compTotalKmYear = compOneWay * distanceMultiplier * days;

  const primaryKgYear = (totalKmYear * primaryFactor) / 1000;
  const compKgYear = (compTotalKmYear * compFactor) / 1000;
  const savingsKg = primaryKgYear - compKgYear;

  // Homeoffice Minderungspotenzial (z. B. 1 Tag/Woche = ca. 45 Tage/Jahr)
  const hoDaysPerWeek = inputs.homeofficeDaysPerWeek !== undefined && inputs.homeofficeDaysPerWeek !== null && String(inputs.homeofficeDaysPerWeek).trim() !== ''
    ? Math.min(5, Math.max(0, parseInt(String(inputs.homeofficeDaysPerWeek), 10) || 0))
    : 1;
  const hoDaysYear = Math.round((hoDaysPerWeek / 5) * days);
  const hoAvoidedKm = oneWay * distanceMultiplier * hoDaysYear;
  const hoSavedKg = (hoAvoidedKm * primaryFactor) / 1000;

  const secondary: ResultItem[] = [
    {
      id: 'compEmissions',
      label: `Emissionen mit ${compLabel.split('(')[0].trim()}`,
      value: compKgYear,
      formattedValue: compKgYear >= 1000 ? `${formatNumber(compKgYear / 1000, 2)} t CO₂e/Jahr` : `${formatNumber(compKgYear, 1)} kg CO₂e/Jahr`,
      highlight: true,
      helpText: `${formatNumber(compTotalKmYear, 0)} Pkm × ${formatNumber(compFactor, 0)} g/Pkm ÷ 1.000`,
    },
    {
      id: 'savings',
      label: savingsKg >= 0 ? 'Jährliche Ersparnis' : 'Mehr-Emissionen',
      value: Math.abs(savingsKg),
      formattedValue: Math.abs(savingsKg) >= 1000
        ? `${formatNumber(Math.abs(savingsKg) / 1000, 2)} t CO₂e/Jahr (${formatPercent((Math.abs(savingsKg) / Math.max(1, primaryKgYear)) * 100, 0)})`
        : `${formatNumber(Math.abs(savingsKg), 1)} kg CO₂e/Jahr (${formatPercent((Math.abs(savingsKg) / Math.max(1, primaryKgYear)) * 100, 0)})`,
      highlight: true,
      helpText: savingsKg >= 0 ? 'Treibhausgas-Vermeidung durch Wechsel des Verkehrsmittels.' : 'Zusätzlicher Ausstoß.',
    },
    {
      id: 'totalKm',
      label: 'Jährliche Pendelstrecke',
      value: totalKmYear,
      formattedValue: `${formatNumber(totalKmYear, 0)} km/Jahr`,
      helpText: `${formatNumber(oneWay, 0)} km × ${distanceMultiplier} Fahrten/Tag × ${days} Tage`,
    },
  ];

  if (hoDaysPerWeek > 0 && hoSavedKg > 0) {
    secondary.push({
      id: 'homeofficeSaving',
      label: `Zusätzliche Ersparnis durch ${hoDaysPerWeek} Tag Homeoffice/Woche`,
      value: hoSavedKg,
      formattedValue: hoSavedKg >= 1000 ? `${formatNumber(hoSavedKg / 1000, 2)} t CO₂e weniger` : `${formatNumber(hoSavedKg, 1)} kg CO₂e weniger`,
      helpText: `Entfällt ${hoDaysYear} Arbeitstage/Jahr das Pendeln (${formatNumber(hoAvoidedKm, 0)} km Einsparung).`,
    });
  }

  return {
    primary: {
      id: 'primaryEmissions',
      label: `CO2-Ausstoß Pendeln (${primaryLabel.split('(')[0].trim()})`,
      value: primaryKgYear >= 1000 ? primaryKgYear / 1000 : primaryKgYear,
      formattedValue: primaryKgYear >= 1000 ? `${formatNumber(primaryKgYear / 1000, 2)} Tonnen CO₂e/Jahr` : `${formatNumber(primaryKgYear, 1)} kg CO₂e/Jahr`,
      highlight: true,
    },
    secondary,
    directAnswer: `Bei ${formatNumber(oneWay, 0)} km einfacher Strecke und ${days} Pendeltagen entstehen mit dem Pkw ca. ${formatNumber(primaryKgYear, 1)} kg CO₂e/Jahr. Mit der Bahn (${compLabel.split('(')[0].trim()}) sind es nur ca. ${formatNumber(compKgYear, 1)} kg CO₂e (spart ca. ${formatNumber(savingsKg, 1)} kg CO₂e bzw. ${formatPercent((savingsKg / primaryKgYear) * 100, 0)}).`,
    summaryText: `Für ${formatNumber(totalKmYear, 0)} Jahres-Pendelkilometer verursacht Ihr aktuelles Verkehrsmittel ca. ${primaryKgYear >= 1000 ? `${formatNumber(primaryKgYear / 1000, 2)} Tonnen` : `${formatNumber(primaryKgYear, 1)} kg`} CO₂e pro Jahr. Durch den Umstieg sparen Sie rund ${Math.abs(savingsKg) >= 1000 ? `${formatNumber(Math.abs(savingsKg) / 1000, 2)} Tonnen` : `${formatNumber(Math.abs(savingsKg), 1)} kg`} CO₂e jährlich.`,
    basisSummary: [
      { label: 'Einfache Distanz', value: `${formatNumber(oneWay, 0)} km` },
      { label: 'Pendeltage', value: `${days} Tage/Jahr` },
      { label: 'Jahresstrecke Basis', value: `${formatNumber(totalKmYear, 0)} Personenkilometer` },
      { label: 'Basis-Verkehrsmittel', value: primaryLabel },
      { label: 'Vergleichsmittel', value: compLabel },
    ],
    calculationSteps: [
      `Jahresstrecke: ${formatNumber(oneWay, 0)} km × ${distanceMultiplier} Fahrten × ${days} Pendeltage = ${formatNumber(totalKmYear, 0)} Personenkilometer (Pkm)`,
      `Ausstoß ${primaryLabel.split('(')[0].trim()}: ${formatNumber(totalKmYear, 0)} Pkm × ${formatNumber(primaryFactor, 1)} g/Pkm ÷ 1.000 = ${formatNumber(primaryKgYear, 1)} kg CO₂e`,
      `Ausstoß ${compLabel.split('(')[0].trim()}: ${formatNumber(compTotalKmYear, 0)} Pkm × ${formatNumber(compFactor, 1)} g/Pkm ÷ 1.000 = ${formatNumber(compKgYear, 1)} kg CO₂e`,
      `Differenz: ${formatNumber(primaryKgYear, 1)} kg − ${formatNumber(compKgYear, 1)} kg = ${formatNumber(savingsKg, 1)} kg CO₂e/Jahr (${formatPercent((savingsKg / Math.max(1, primaryKgYear)) * 100, 1)} Einsparung)`,
    ],
    qualifications: [
      'Die Verkehrsmittelvergleiche basieren auf den offiziellen Tremod-2024-Durchschnittswerten des Umweltbundesamtes (UBA) pro Personenkilometer (Well-to-Wheel CO₂e).',
      'Der Pkw-Durchschnittsfaktor (164 g CO₂e/Pkm) berücksichtigt bereits die mittlere Fahrzeugauslastung von ca. 1,4 bis 1,5 Personen in Deutschland.',
      'Eisenbahn-Fernverkehr (44 g CO₂e/Pkm) fährt im Netz der Deutschen Bahn mit 100 % Ökostrom; die verbleibenden Emissionen resultieren aus Netzverlusten, Fahrzeugherstellung und Trassenbereitstellung.',
    ],
  };
}

/**
 * 3. CO2-Preis-Rechner Engine (BEHG / EBeV / CO2KostAufG)
 */
export function calculateCarbonPrice(inputs: Record<string, any>): CalculationResult {
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
      error: 'Die Verbrauchsmenge darf nicht negativ sein.',
    };
  }

  const fuel = String(inputs.fuel || 'gas');
  const priceYear = String(inputs.priceYear || '2026_corridor_55');
  const includeVat = inputs.includeVat !== undefined ? Boolean(inputs.includeVat) : true;
  const vatMultiplier = includeVat ? 1.19 : 1.0;

  // Gesetzlicher CO2-Preis pro Tonne nach BEHG
  let pricePerTonne = 55.0; // Standard 2026 / 2025
  let priceNote = '2026 Gesetzlicher Preiskorridor (55 €/t Mindestpreis)';

  if (priceYear === '2026_corridor_60') {
    pricePerTonne = 60.0;
    priceNote = '2026 Gesetzlicher Preiskorridor (60 €/t Mittelwert)';
  } else if (priceYear === '2026_corridor_65') {
    pricePerTonne = 65.0;
    priceNote = '2026 Gesetzlicher Preiskorridor (65 €/t Höchstpreis gem. § 10 Abs. 2 BEHG)';
  } else if (priceYear === '2025_festpreis') {
    pricePerTonne = 55.0;
    priceNote = '2025 Gesetzlicher Festpreis (§ 10 Abs. 2 Satz 1 Nr. 5 BEHG: 55 €/t)';
  } else if (priceYear === '2024_festpreis') {
    pricePerTonne = 45.0;
    priceNote = '2024 Gesetzlicher Festpreis (§ 10 Abs. 2 Satz 1 Nr. 4 BEHG: 45 €/t)';
  } else if (priceYear === 'custom') {
    const rawCustom = inputs.customPricePerTonne !== undefined && inputs.customPricePerTonne !== null && String(inputs.customPricePerTonne).trim() !== ''
      ? parseFloat(String(inputs.customPricePerTonne).replace(',', '.'))
      : 80;
    pricePerTonne = isNaN(rawCustom) || rawCustom < 0 ? 80 : rawCustom;
    priceNote = `Benutzerdefiniertes Preisszenario (${formatCurrency(pricePerTonne)}/t CO₂)`;
  }

  // EBeV Standardfaktoren (kg CO2 pro Abrechnungseinheit)
  let factorPerUnit = 0.182; // kg CO2 / kWh Ho
  let unit = 'kWh';
  let fuelName = 'Erdgas';

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

  // Gesamtemissionen
  const totalCo2Kg = amount * factorPerUnit;
  const totalCo2Tonnes = totalCo2Kg / 1000;

  // CO2-Kosten
  const costNet = totalCo2Tonnes * pricePerTonne;
  const costGross = costNet * vatMultiplier;

  // Spezifischer Aufschlag pro Einheit
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
      label: `CO2-Kosten ${includeVat ? 'brutto (inkl. 19% MwSt.)' : 'netto'}`,
      value: costGross,
      formattedValue: formatCurrency(costGross),
      highlight: true,
      helpText: `Reiner CO₂-Zertifikateaufschlag auf den Brennstoffpreis.`,
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
        helpText: `Mehrwertsteuer (19 %): ${formatCurrency(costNet * 0.19)}`,
      },
    ],
    directAnswer: `Für ${formatNumber(amount, 0)} ${unit} ${fuelName} beträgt der CO₂-Preisaufschlag bei ${formatCurrency(pricePerTonne)}/t CO₂ ca. ${formatCurrency(costGross)} ${includeVat ? 'brutto' : 'netto'} (Aufschlag: ${unitSurchargeText}).`,
    summaryText: `Bei einem CO₂-Preis von ${formatCurrency(pricePerTonne)} je Tonne und einem Verbrauch von ${formatNumber(amount, 0)} ${unit} ${fuelName} belaufen sich die CO₂-Zertifikatskosten auf ${formatCurrency(costGross)} ${includeVat ? 'inkl. 19 % MwSt.' : 'netto'}.`,
    basisSummary: [
      { label: 'Brennstoff', value: fuelName },
      { label: 'Verbrauchsmenge', value: `${formatNumber(amount, 0)} ${unit}` },
      { label: 'CO2-Zertifikatspreis', value: `${formatCurrency(pricePerTonne)} pro Tonne CO₂` },
      { label: 'EBeV-Emissionsfaktor', value: `${formatNumber(factorPerUnit, 3)} kg CO₂ pro ${unit}` },
      { label: 'Mehrwertsteuer (19 %)', value: includeVat ? 'Einbezogen (Bruttobetrag)' : 'Ausgeschlossen (Nettobetrag)' },
    ],
    calculationSteps: [
      `CO2-Menge: ${formatNumber(amount, 0)} ${unit} × ${formatNumber(factorPerUnit, 3)} kg/${unit} = ${formatNumber(totalCo2Kg, 1)} kg CO₂ (${formatNumber(totalCo2Tonnes, 3)} Tonnen)`,
      `CO2-Kosten netto: ${formatNumber(totalCo2Tonnes, 3)} t × ${formatCurrency(pricePerTonne)}/t = ${formatCurrency(costNet)}`,
      includeVat
        ? `Mehrwertsteuer (19 % nach UStG): ${formatCurrency(costNet)} × 1,19 = ${formatCurrency(costGross)}`
        : `Nettobetrag: ${formatCurrency(costNet)}`,
      `Spezifischer Aufschlag: ${formatCurrency(costGross)} ÷ ${formatNumber(amount, 0)} ${unit} = ${unitSurchargeText}`,
    ],
    qualifications: [
      'WICHTIGER HINWEIS: Dieser Betrag ist der gesetzliche CO₂-Aufschlag und NICHT Ihre gesamte Heiz- oder Spritrechnung.',
      'In gängigen Endkundenpreisen (an Tankstellen und in Heizgastarifen) ist der CO₂-Preis im ausgewiesenen Brutto-Liter- bzw. Kilowattstundenpreis bereits enthalten. Rechnen Sie diesen Betrag nicht doppelt auf bestehende Bruttopreise hinzu!',
      'Gesetzliche Grundlage sind das Brennstoffemissionshandelsgesetz (BEHG) und die Emissionsberichterstattungsverordnung 2030 (EBeV 2030). Ab 2027 ist der Übergang in das europäische System ETS-2 vorgesehen, in dem sich Preise über Versteigerungen bilden.',
    ],
  };
}
