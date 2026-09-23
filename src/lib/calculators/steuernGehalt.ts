import { CalculationResult } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';
import { getTaxConfig, TaxYearConfig } from '@/data/regulated/tax';

/**
 * Pure mathematische Formel für die tarifliche Einkommensteuer nach § 32a Abs. 1 EStG
 * @param zvE Zu versteuerndes Einkommen in Euro (auf vollen Euro abgerundet)
 * @param config Gesetzliche Steuerkonfiguration des Veranlagungszeitraums
 * @returns Tarifliche Einkommensteuer in Euro (abgerundet nach § 32a Abs. 1 Satz 6 EStG)
 */
export function computeEStSingle(zvE: number, config: TaxYearConfig): number {
  const x = Math.max(0, Math.floor(zvE));

  if (x <= config.grundfreibetrag) {
    // Zone 1: Nullzone (Grundfreibetrag)
    return 0;
  }

  if (x <= config.zone2Limit) {
    // Zone 2: Erste Progressionszone
    const y = (x - config.grundfreibetrag) / 10000;
    const est = (config.zone2Coeff * y + config.zone2Base) * y;
    return Math.floor(est);
  }

  if (x <= config.zone3Limit) {
    // Zone 3: Zweite Progressionszone
    const z = (x - config.zone2Limit) / 10000;
    const est = (config.zone3Coeff * z + config.zone3Base) * z + config.zone3Offset;
    return Math.floor(est);
  }

  if (x <= config.zone4Limit) {
    // Zone 4: Proportionalzone (Spitzensteuersatz 42 %)
    const est = config.zone4Rate * x - config.zone4Offset;
    return Math.floor(est);
  }

  // Zone 5: Reichensteuer (45 %)
  const est = config.zone5Rate * x - config.zone5Offset;
  return Math.floor(est);
}

/**
 * Berechnet den Grenzsteuersatz bei einem gegebenen zvE
 */
export function computeMarginalTaxRate(zvE: number, config: TaxYearConfig): number {
  const x = Math.max(0, Math.floor(zvE));
  if (x <= config.grundfreibetrag) return 0;
  if (x <= config.zone2Limit) {
    const y = (x - config.grundfreibetrag) / 10000;
    return (2 * config.zone2Coeff * y + config.zone2Base) / 100;
  }
  if (x <= config.zone3Limit) {
    const z = (x - config.zone2Limit) / 10000;
    return (2 * config.zone3Coeff * z + config.zone3Base) / 100;
  }
  if (x <= config.zone4Limit) {
    return config.zone4Rate * 100;
  }
  return config.zone5Rate * 100;
}

/**
 * Berechnet den Solidaritätszuschlag nach § 3 und § 4 SolzG
 */
export function computeSolZ(est: number, isMarried: boolean, config: TaxYearConfig): number {
  if (est <= 0) return 0;
  const freigrenze = isMarried ? config.solzFreigrenzeMarried : config.solzFreigrenzeSingle;

  if (est <= freigrenze) {
    return 0;
  }

  // Milderungszone (§ 4 SolzG): SolZ darf 11,9 % des Überhangs nicht übersteigen
  const maxSolzMilderung = (est - freigrenze) * config.solzMilderungRate;
  const standardSolz = est * config.solzRate;

  const solz = Math.min(standardSolz, maxSolzMilderung);
  return Math.max(0, Math.round(solz * 100) / 100);
}

/**
 * Berechnet die Kirchensteuer (8 % in BY/BW, sonst 9 %)
 */
export function computeChurchTax(est: number, stateRate: number): number {
  if (est <= 0 || stateRate <= 0) return 0;
  return Math.round(est * (stateRate / 100) * 100) / 100;
}

// ==========================================
// 1. EINKOMMENSTEUERRECHNER
// ==========================================
export function calculateEinkommensteuer(inputs: Record<string, any>): CalculationResult {
  const taxYear = inputs.taxYear || '2026';
  const config = getTaxConfig(taxYear);
  const zvE = Math.max(0, Number(inputs.taxableIncome) || 0);
  const isSplitting = inputs.tariffType === 'splitting';
  const stateRate = inputs.churchTaxRate === '8' ? 8 : inputs.churchTaxRate === '9' ? 9 : 0;

  let est = 0;
  if (isSplitting) {
    est = computeEStSingle(Math.floor(zvE / 2), config) * 2;
  } else {
    est = computeEStSingle(zvE, config);
  }

  const solz = computeSolZ(est, isSplitting, config);
  const kirchensteuer = computeChurchTax(est, stateRate);
  const totalTax = est + solz + kirchensteuer;
  const netIncome = Math.max(0, zvE - totalTax);

  const avgTaxRate = zvE > 0 ? (est / zvE) * 100 : 0;
  const totalAvgRate = zvE > 0 ? (totalTax / zvE) * 100 : 0;
  const marginalRate = isSplitting
    ? computeMarginalTaxRate(Math.floor(zvE / 2), config)
    : computeMarginalTaxRate(zvE, config);

  return {
    primary: {
      id: 'einkommensteuer',
      label: 'Einkommensteuer',
      value: est,
      formattedValue: formatCurrency(est),
    },
    secondary: [
      { id: 'totalTax', label: 'Gesamtsteuer (inkl. SolZ/KiSt)', value: totalTax, formattedValue: formatCurrency(totalTax) },
      { id: 'netIncome', label: 'Verbleibendes Netto-Einkommen', value: netIncome, formattedValue: formatCurrency(netIncome) },
      { id: 'avgTaxRate', label: 'Durchschnittssteuersatz', value: avgTaxRate, formattedValue: formatPercent(avgTaxRate) },
      { id: 'totalAvgRate', label: 'Effektive Gesamtsteuerquote', value: totalAvgRate, formattedValue: formatPercent(totalAvgRate) },
      { id: 'marginalRate', label: 'Grenzsteuersatz', value: marginalRate, formattedValue: formatPercent(marginalRate) },
      { id: 'solz', label: 'Solidaritätszuschlag', value: solz, formattedValue: formatCurrency(solz) },
      { id: 'kirchensteuer', label: 'Kirchensteuer', value: kirchensteuer, formattedValue: formatCurrency(kirchensteuer) },
    ],
  };
}

// ==========================================
// 2. GRENZSTEUERSATZ-RECHNER
// ==========================================
export function calculateGrenzsteuersatz(inputs: Record<string, any>): CalculationResult {
  const taxYear = inputs.taxYear || '2026';
  const config = getTaxConfig(taxYear);
  const zvE = Math.max(0, Number(inputs.taxableIncome) || 0);
  const isSplitting = inputs.tariffType === 'splitting';
  const effectiveZvE = isSplitting ? Math.floor(zvE / 2) : zvE;

  const marginalRate = computeMarginalTaxRate(effectiveZvE, config);
  const est = isSplitting ? computeEStSingle(effectiveZvE, config) * 2 : computeEStSingle(effectiveZvE, config);
  const avgRate = zvE > 0 ? (est / zvE) * 100 : 0;

  // Bestimme Tarifzone
  let zoneName = 'Zone 1: Steuerfreies Existenzminimum (Grundfreibetrag)';
  let nextThreshold = config.grundfreibetrag;
  let distToNext = Math.max(0, config.grundfreibetrag - effectiveZvE);

  if (effectiveZvE > config.grundfreibetrag && effectiveZvE <= config.zone2Limit) {
    zoneName = 'Zone 2: Erste Progressionszone (14 % bis ~24 %)';
    nextThreshold = config.zone2Limit;
    distToNext = config.zone2Limit - effectiveZvE;
  } else if (effectiveZvE > config.zone2Limit && effectiveZvE <= config.zone3Limit) {
    zoneName = 'Zone 3: Zweite Progressionszone (~24 % bis 42 %)';
    nextThreshold = config.zone3Limit;
    distToNext = config.zone3Limit - effectiveZvE;
  } else if (effectiveZvE > config.zone3Limit && effectiveZvE <= config.zone4Limit) {
    zoneName = 'Zone 4: Proportionalzone (Spitzensteuersatz 42 %)';
    nextThreshold = config.zone5Limit;
    distToNext = config.zone5Limit - effectiveZvE;
  } else if (effectiveZvE > config.zone4Limit) {
    zoneName = 'Zone 5: Reichensteuer (Höchstsatz 45 %)';
    nextThreshold = 0;
    distToNext = 0;
  }

  // Steuer auf die nächsten 1.000 € Gehaltserhöhung
  const estPlus1000 = isSplitting
    ? computeEStSingle(Math.floor((zvE + 1000) / 2), config) * 2
    : computeEStSingle(zvE + 1000, config);
  const taxOn1000 = estPlus1000 - est;

  return {
    primary: {
      id: 'marginalRate',
      label: 'Grenzsteuersatz',
      value: marginalRate,
      formattedValue: formatPercent(marginalRate),
    },
    secondary: [
      { id: 'avgRate', label: 'Durchschnittssteuersatz', value: avgRate, formattedValue: formatPercent(avgRate) },
      { id: 'zoneName', label: 'Aktuelle Tarifzone', value: 0, formattedValue: zoneName },
      { id: 'taxOn1000', label: 'Steuer auf die nächsten 1.000 €', value: taxOn1000, formattedValue: formatCurrency(taxOn1000) },
      { id: 'distToNext', label: 'Abstand zur nächsten Tarifstufe', value: distToNext, formattedValue: distToNext > 0 ? formatCurrency(distToNext) : 'Bereits in Höchstzone' },
    ],
  };
}

// ==========================================
// 3. BRUTTO-NETTO-RECHNER (FLAGSHIP PAYROLL)
// ==========================================
export function calculateBruttoNetto(inputs: Record<string, any>): CalculationResult {
  const taxYear = inputs.taxYear || '2026';
  const config = getTaxConfig(taxYear);

  const rawGross = Math.max(0, Number(inputs.grossSalary) || 0);
  const isAnnual = inputs.period === 'year';
  const monthlyGross = isAnnual ? rawGross / 12 : rawGross;
  const annualGross = isAnnual ? rawGross : rawGross * 12;

  const taxClass = String(inputs.taxClass || '1');
  const hasChurchTax = inputs.churchTax === 'yes' || inputs.churchTax === true;
  const state = String(inputs.federalState || 'other');
  const churchTaxRate = hasChurchTax ? (state === 'bayern' || state === 'baden_wuerttemberg' ? 8 : 9) : 0;
  const numChildren = Math.max(0, parseInt(inputs.children || '0', 10));
  const age = Math.max(0, parseInt(inputs.age || '30', 10));
  const isPrivateKv = inputs.healthInsuranceType === 'private';
  const kvZusatz = Math.max(0, Number(inputs.kvZusatzbeitrag ?? config.zusatzbeitragKrankenversicherungDurchschnitt * 100));

  // --- SOZIALVERSICHERUNG (MONATLICH) ---
  let anRv = 0;
  let anAv = 0;
  let anKv = 0;
  let anPv = 0;
  let agRv = 0;
  let agAv = 0;
  let agKv = 0;
  let agPv = 0;

  // Rentenversicherung
  const rvGross = Math.min(monthlyGross, config.bbgRentenversicherungMonat);
  anRv = rvGross * (config.beitragssatzRentenversicherung / 2);
  agRv = anRv;

  // Arbeitslosenversicherung
  const avGross = Math.min(monthlyGross, config.bbgRentenversicherungMonat);
  anAv = avGross * (config.beitragssatzArbeitslosenversicherung / 2);
  agAv = anAv;

  // Krankenversicherung
  const kvGross = Math.min(monthlyGross, config.bbgKrankenversicherungMonat);
  if (!isPrivateKv) {
    const totalKvRate = config.beitragssatzKrankenversicherungAllgemein + kvZusatz / 100;
    anKv = kvGross * (totalKvRate / 2);
    agKv = anKv;
  }

  // Pflegeversicherung
  if (!isPrivateKv) {
    const isSachsen = state === 'sachsen';
    let anPvRate = isSachsen ? config.pflegeSachsenAnteilAN : config.beitragssatzPflegeversicherung / 2;
    agPv = kvGross * (isSachsen ? config.pflegeSachsenAnteilAG : config.beitragssatzPflegeversicherung / 2);

    // Kinderlosenzuschlag: 0,6 % allein von AN ab 23 Jahren
    if (age >= 23 && numChildren === 0) {
      anPvRate += config.pflegeZuschlagKinderlos;
    } else if (numChildren > 1) {
      // Abschlag ab 2. bis 5. Kind je 0,25 %
      const eligibleKids = Math.min(4, numChildren - 1);
      anPvRate = Math.max(0.01, anPvRate - eligibleKids * config.pflegeAbschlagKind);
    }
    anPv = kvGross * anPvRate;
  }

  const monthlySocialAN = anRv + anAv + anKv + anPv;
  const annualSocialAN = monthlySocialAN * 12;

  // --- LOHNSTEUER (JÄHRLICH) ---
  // Gesetzliche Vorsorgepauschale Schätzung für Lohnsteuerabzug
  const vorsorgepauschale = annualSocialAN;
  const werbungskostenpauschale = 1230; // § 9a Satz 1 Nr. 1a EStG
  const sonderausgabenpauschbetrag = 36; // § 10c EStG

  // Ermittlung des fiktiven zu versteuernden Einkommens (zvE) je nach Steuerklasse
  let taxableBase = Math.max(0, annualGross - werbungskostenpauschale - sonderausgabenpauschbetrag - vorsorgepauschale);

  let annualLohnsteuer = 0;
  if (taxClass === '1' || taxClass === '4') {
    annualLohnsteuer = computeEStSingle(taxableBase, config);
  } else if (taxClass === '2') {
    // Entlastungsbetrag für Alleinerziehende (§ 24b EStG): 4.260 €
    const baseWithAlleinerziehend = Math.max(0, taxableBase - 4260);
    annualLohnsteuer = computeEStSingle(baseWithAlleinerziehend, config);
  } else if (taxClass === '3') {
    // Splittingverfahren
    annualLohnsteuer = computeEStSingle(Math.floor(taxableBase / 2), config) * 2;
  } else if (taxClass === '5') {
    // Steuerklasse 5: Hohe Progression (Grundfreibetrag entfällt für AN)
    annualLohnsteuer = computeEStSingle(taxableBase + config.grundfreibetrag, config) * 1.05;
  } else if (taxClass === '6') {
    // Zweitjob ohne Grundfreibetrag
    annualLohnsteuer = computeEStSingle(taxableBase + config.grundfreibetrag, config);
  }

  const monthlyLohnsteuer = annualLohnsteuer / 12;

  // SolZ und Kirchensteuer
  const isMarried = taxClass === '3';
  const annualSolz = computeSolZ(annualLohnsteuer, isMarried, config);
  const monthlySolz = annualSolz / 12;

  const annualChurchTax = computeChurchTax(annualLohnsteuer, churchTaxRate);
  const monthlyChurchTax = annualChurchTax / 12;

  const monthlyTaxTotal = monthlyLohnsteuer + monthlySolz + monthlyChurchTax;
  const annualTaxTotal = annualLohnsteuer + annualSolz + annualChurchTax;

  const monthlyDeductions = monthlySocialAN + monthlyTaxTotal;
  const annualDeductions = annualSocialAN + annualTaxTotal;

  const monthlyNet = Math.max(0, monthlyGross - monthlyDeductions);
  const annualNet = Math.max(0, annualGross - annualDeductions);

  const netQuota = monthlyGross > 0 ? (monthlyNet / monthlyGross) * 100 : 0;
  const taxQuota = monthlyGross > 0 ? (monthlyTaxTotal / monthlyGross) * 100 : 0;
  const socialQuota = monthlyGross > 0 ? (monthlySocialAN / monthlyGross) * 100 : 0;

  // Arbeitgeberkosten
  const agSvTotal = agRv + agAv + agKv + agPv;
  const agUmlagen = monthlyGross * (config.umlageU1 + config.umlageU2 + config.umlageU3Insolvenzgeld + config.berufsgenossenschaftDurchschnitt);
  const monthlyEmployerTotal = monthlyGross + agSvTotal + agUmlagen;

  return {
    primary: {
      id: 'monthlyNet',
      label: 'Netto pro Monat',
      value: monthlyNet,
      formattedValue: formatCurrency(monthlyNet),
    },
    secondary: [
      { id: 'annualNet', label: 'Netto pro Jahr', value: annualNet, formattedValue: formatCurrency(annualNet) },
      { id: 'monthlyGross', label: 'Brutto pro Monat', value: monthlyGross, formattedValue: formatCurrency(monthlyGross) },
      { id: 'totalDeductions', label: 'Gesamtabzüge monatlich', value: monthlyDeductions, formattedValue: formatCurrency(monthlyDeductions) },
      { id: 'lohnsteuer', label: 'Lohnsteuer', value: monthlyLohnsteuer, formattedValue: formatCurrency(monthlyLohnsteuer) },
      { id: 'solz', label: 'Solidaritätszuschlag', value: monthlySolz, formattedValue: formatCurrency(monthlySolz) },
      { id: 'kirchensteuer', label: 'Kirchensteuer', value: monthlyChurchTax, formattedValue: formatCurrency(monthlyChurchTax) },
      { id: 'rentenversicherung', label: 'Rentenversicherung (AN)', value: anRv, formattedValue: formatCurrency(anRv) },
      { id: 'krankenversicherung', label: 'Krankenversicherung (AN)', value: anKv, formattedValue: formatCurrency(anKv) },
      { id: 'pflegeversicherung', label: 'Pflegeversicherung (AN)', value: anPv, formattedValue: formatCurrency(anPv) },
      { id: 'arbeitslosenversicherung', label: 'Arbeitslosenversicherung (AN)', value: anAv, formattedValue: formatCurrency(anAv) },
      { id: 'netQuota', label: 'Nettoquote vom Brutto', value: netQuota, formattedValue: formatPercent(netQuota) },
      { id: 'taxQuota', label: 'Steuerabzugsquote', value: taxQuota, formattedValue: formatPercent(taxQuota) },
      { id: 'socialQuota', label: 'Sozialabgabenquote', value: socialQuota, formattedValue: formatPercent(socialQuota) },
      { id: 'employerTotal', label: 'Arbeitgeber-Gesamtkosten (monatlich)', value: monthlyEmployerTotal, formattedValue: formatCurrency(monthlyEmployerTotal) },
    ],
  };
}

// ==========================================
// 4. NETTO-BRUTTO-RECHNER (INVERSION)
// ==========================================
export function calculateNettoBrutto(inputs: Record<string, any>): CalculationResult {
  const desiredNet = Math.max(0, Number(inputs.desiredNet) || 0);
  const isAnnual = inputs.period === 'year';
  const targetMonthlyNet = isAnnual ? desiredNet / 12 : desiredNet;

  // Numerische Bisektionsmethode zur exakten Ermittlung des erforderlichen Bruttogehalts
  let low = targetMonthlyNet;
  let high = targetMonthlyNet * 3.5 + 5000;
  let requiredMonthlyGross = targetMonthlyNet;

  for (let iter = 0; iter < 45; iter++) {
    const mid = (low + high) / 2;
    const simInputs = {
      ...inputs,
      grossSalary: mid,
      period: 'month',
    };
    const res = calculateBruttoNetto(simInputs);
    const simNet = typeof res.primary.value === 'number' ? res.primary.value : Number(res.primary.value) || 0;

    if (Math.abs(simNet - targetMonthlyNet) < 0.02) {
      requiredMonthlyGross = mid;
      break;
    }
    if (simNet < targetMonthlyNet) {
      low = mid;
    } else {
      high = mid;
    }
    requiredMonthlyGross = mid;
  }

  const requiredAnnualGross = requiredMonthlyGross * 12;
  const verifiedRes = calculateBruttoNetto({ ...inputs, grossSalary: requiredMonthlyGross, period: 'month' });
  const verifiedNet = typeof verifiedRes.primary.value === 'number' ? verifiedRes.primary.value : Number(verifiedRes.primary.value) || 0;

  return {
    primary: {
      id: 'requiredGross',
      label: isAnnual ? 'Erforderliches Jahresbrutto' : 'Erforderliches Monatsbrutto',
      value: isAnnual ? requiredAnnualGross : requiredMonthlyGross,
      formattedValue: formatCurrency(isAnnual ? requiredAnnualGross : requiredMonthlyGross),
    },
    secondary: [
      { id: 'monthlyGross', label: 'Monatliches Brutto', value: requiredMonthlyGross, formattedValue: formatCurrency(requiredMonthlyGross) },
      { id: 'annualGross', label: 'Jährliches Brutto', value: requiredAnnualGross, formattedValue: formatCurrency(requiredAnnualGross) },
      { id: 'desiredNet', label: 'Ziel-Netto', value: desiredNet, formattedValue: formatCurrency(desiredNet) },
      { id: 'totalDeductions', label: 'Darin enthaltene Gesamtabzüge', value: requiredMonthlyGross - targetMonthlyNet, formattedValue: formatCurrency(requiredMonthlyGross - targetMonthlyNet) },
      { id: 'verifiedNet', label: 'Tatsächlich erzieltes Netto', value: verifiedNet, formattedValue: formatCurrency(verifiedNet) },
    ],
  };
}

// ==========================================
// 5. SOLIDARITÄTSZUSCHLAG-RECHNER
// ==========================================
export function calculateSolidaritaetszuschlag(inputs: Record<string, any>): CalculationResult {
  const taxYear = inputs.taxYear || '2026';
  const config = getTaxConfig(taxYear);
  const incomeTax = Math.max(0, Number(inputs.incomeTax) || 0);
  const isMarried = inputs.maritalStatus === 'married';
  const freigrenze = isMarried ? config.solzFreigrenzeMarried : config.solzFreigrenzeSingle;

  const solz = computeSolZ(incomeTax, isMarried, config);
  const isExempt = incomeTax <= freigrenze;
  const isMilderung = !isExempt && solz < incomeTax * config.solzRate;

  let statusText = 'Vollständig befreit (unter Freigrenze)';
  if (!isExempt && isMilderung) statusText = 'In Milderungszone (reduzierter SolZ-Satz)';
  if (!isExempt && !isMilderung) statusText = 'Voller Solidaritätszuschlag (5,5 %)';

  const effectiveRate = incomeTax > 0 ? (solz / incomeTax) * 100 : 0;

  return {
    primary: {
      id: 'solz',
      label: 'Solidaritätszuschlag',
      value: solz,
      formattedValue: formatCurrency(solz),
    },
    secondary: [
      { id: 'statusText', label: 'Status', value: 0, formattedValue: statusText },
      { id: 'freigrenze', label: 'Geltende SolZ-Freigrenze', value: freigrenze, formattedValue: formatCurrency(freigrenze) },
      { id: 'effectiveRate', label: 'Effektiver SolZ-Satz auf Steuer', value: effectiveRate, formattedValue: formatPercent(effectiveRate) },
      { id: 'totalWithSolz', label: 'Steuer inkl. SolZ', value: incomeTax + solz, formattedValue: formatCurrency(incomeTax + solz) },
    ],
  };
}

// ==========================================
// 6. KIRCHENSTEUER-RECHNER
// ==========================================
export function calculateKirchensteuer(inputs: Record<string, any>): CalculationResult {
  const est = Math.max(0, Number(inputs.incomeTax) || 0);
  const stateRate = inputs.churchTaxRate === '8' ? 8 : 9;
  const kirchensteuer = computeChurchTax(est, stateRate);

  // Kirchensteuer ist als Sonderausgabe steuerlich abzugsfähig (§ 10 Abs. 1 Nr. 4 EStG)
  const estimatedMarginalRate = Math.min(42, Math.max(14, Number(inputs.marginalRate || 30)));
  const taxSavingsFromDeduction = kirchensteuer * (estimatedMarginalRate / 100);
  const netKirchensteuer = Math.max(0, kirchensteuer - taxSavingsFromDeduction);

  return {
    primary: {
      id: 'kirchensteuer',
      label: 'Kirchensteuer (Brutto)',
      value: kirchensteuer,
      formattedValue: formatCurrency(kirchensteuer),
    },
    secondary: [
      { id: 'netKirchensteuer', label: 'Tatsächliche Nettobelastung (nach Steuerabzug)', value: netKirchensteuer, formattedValue: formatCurrency(netKirchensteuer) },
      { id: 'taxSavings', label: 'Steuerersparnis durch Sonderausgabenabzug', value: taxSavingsFromDeduction, formattedValue: formatCurrency(taxSavingsFromDeduction) },
      { id: 'rate', label: 'Kirchensteuersatz', value: stateRate, formattedValue: `${stateRate} %` },
    ],
  };
}

// ==========================================
// 7. SOZIALABGABEN-RECHNER
// ==========================================
export function calculateSozialabgaben(inputs: Record<string, any>): CalculationResult {
  const taxYear = inputs.taxYear || '2026';
  const config = getTaxConfig(taxYear);
  const monthlyGross = Math.max(0, Number(inputs.monthlyGross) || 0);
  const state = String(inputs.federalState || 'other');
  const numChildren = Math.max(0, parseInt(inputs.children || '0', 10));
  const age = Math.max(0, parseInt(inputs.age || '30', 10));
  const kvZusatz = Math.max(0, Number(inputs.kvZusatzbeitrag ?? 2.5));

  // Rentenversicherung
  const rvGross = Math.min(monthlyGross, config.bbgRentenversicherungMonat);
  const anRv = rvGross * (config.beitragssatzRentenversicherung / 2);
  const agRv = anRv;

  // Arbeitslosenversicherung
  const anAv = rvGross * (config.beitragssatzArbeitslosenversicherung / 2);
  const agAv = anAv;

  // Krankenversicherung
  const kvGross = Math.min(monthlyGross, config.bbgKrankenversicherungMonat);
  const totalKvRate = config.beitragssatzKrankenversicherungAllgemein + kvZusatz / 100;
  const anKv = kvGross * (totalKvRate / 2);
  const agKv = anKv;

  // Pflegeversicherung
  const isSachsen = state === 'sachsen';
  let anPvRate = isSachsen ? config.pflegeSachsenAnteilAN : config.beitragssatzPflegeversicherung / 2;
  const agPv = kvGross * (isSachsen ? config.pflegeSachsenAnteilAG : config.beitragssatzPflegeversicherung / 2);

  if (age >= 23 && numChildren === 0) {
    anPvRate += config.pflegeZuschlagKinderlos;
  } else if (numChildren > 1) {
    const eligibleKids = Math.min(4, numChildren - 1);
    anPvRate = Math.max(0.01, anPvRate - eligibleKids * config.pflegeAbschlagKind);
  }
  const anPv = kvGross * anPvRate;

  const totalAn = anRv + anAv + anKv + anPv;
  const totalAg = agRv + agAv + agKv + agPv;
  const grandTotal = totalAn + totalAg;

  return {
    primary: {
      id: 'totalAn',
      label: 'Arbeitnehmer-Sozialabgaben',
      value: totalAn,
      formattedValue: formatCurrency(totalAn),
    },
    secondary: [
      { id: 'totalAg', label: 'Arbeitgeber-Sozialabgaben', value: totalAg, formattedValue: formatCurrency(totalAg) },
      { id: 'grandTotal', label: 'Gesamte Sozialversicherungsbeiträge', value: grandTotal, formattedValue: formatCurrency(grandTotal) },
      { id: 'anRv', label: 'Rentenversicherung (AN)', value: anRv, formattedValue: formatCurrency(anRv) },
      { id: 'anKv', label: 'Krankenversicherung (AN)', value: anKv, formattedValue: formatCurrency(anKv) },
      { id: 'anPv', label: 'Pflegeversicherung (AN)', value: anPv, formattedValue: formatCurrency(anPv) },
      { id: 'anAv', label: 'Arbeitslosenversicherung (AN)', value: anAv, formattedValue: formatCurrency(anAv) },
      { id: 'anPercentage', label: 'SV-Belastung Arbeitnehmer', value: monthlyGross > 0 ? (totalAn / monthlyGross) * 100 : 0, formattedValue: formatPercent(monthlyGross > 0 ? (totalAn / monthlyGross) * 100 : 0) },
    ],
  };
}

// ==========================================
// 8. ARBEITGEBERKOSTEN-RECHNER
// ==========================================
export function calculateArbeitgeberkosten(inputs: Record<string, any>): CalculationResult {
  const taxYear = inputs.taxYear || '2026';
  const config = getTaxConfig(taxYear);
  const monthlyGross = Math.max(0, Number(inputs.monthlyGross) || 0);

  // SV-Arbeitgeberanteile
  const rvGross = Math.min(monthlyGross, config.bbgRentenversicherungMonat);
  const kvGross = Math.min(monthlyGross, config.bbgKrankenversicherungMonat);

  const agRv = rvGross * (config.beitragssatzRentenversicherung / 2);
  const agAv = rvGross * (config.beitragssatzArbeitslosenversicherung / 2);
  const agKv = kvGross * ((config.beitragssatzKrankenversicherungAllgemein + config.zusatzbeitragKrankenversicherungDurchschnitt) / 2);
  const agPv = kvGross * (config.beitragssatzPflegeversicherung / 2);

  const agSvTotal = agRv + agAv + agKv + agPv;

  // Umlagen
  const u1 = monthlyGross * config.umlageU1;
  const u2 = monthlyGross * config.umlageU2;
  const u3 = monthlyGross * config.umlageU3Insolvenzgeld;
  const bg = monthlyGross * config.berufsgenossenschaftDurchschnitt;

  const totalUmlagen = u1 + u2 + u3 + bg;
  const totalEmployerCosts = monthlyGross + agSvTotal + totalUmlagen;
  const additionalCostPercentage = monthlyGross > 0 ? ((totalEmployerCosts - monthlyGross) / monthlyGross) * 100 : 0;

  return {
    primary: {
      id: 'totalCosts',
      label: 'Arbeitgeber-Gesamtkosten (monatlich)',
      value: totalEmployerCosts,
      formattedValue: formatCurrency(totalEmployerCosts),
    },
    secondary: [
      { id: 'annualCosts', label: 'Gesamtkosten pro Jahr', value: totalEmployerCosts * 12, formattedValue: formatCurrency(totalEmployerCosts * 12) },
      { id: 'brutto', label: 'Bruttogehalt (Mitarbeiter)', value: monthlyGross, formattedValue: formatCurrency(monthlyGross) },
      { id: 'svTotal', label: 'Gesetzliche SV-Beiträge (AG-Anteil)', value: agSvTotal, formattedValue: formatCurrency(agSvTotal) },
      { id: 'umlagen', label: 'Umlagen U1, U2, U3 & Berufsgenossenschaft', value: totalUmlagen, formattedValue: formatCurrency(totalUmlagen) },
      { id: 'costFactor', label: 'Lohnnebenkosten-Aufschlag', value: additionalCostPercentage, formattedValue: formatPercent(additionalCostPercentage) },
    ],
  };
}

// ==========================================
// 9. MINIJOB-RECHNER
// ==========================================
export function calculateMinijob(inputs: Record<string, any>): CalculationResult {
  const taxYear = inputs.taxYear || '2026';
  const config = getTaxConfig(taxYear);
  const earnings = Math.min(config.minijobGrenze, Math.max(0, Number(inputs.earnings) || config.minijobGrenze));
  const hasRvOptOut = inputs.rvOptOut === 'yes' || inputs.rvOptOut === true;

  // Rentenversicherung Eigenanteil (3,6 %): 18,6 % Mindestbeitrag abzüglich 15 % AG-Pauschale
  const anRv = hasRvOptOut ? 0 : earnings * 0.036;
  const netEarnings = earnings - anRv;

  // AG-Pauschale: 15 % RV + 13 % KV + 2 % Pauschalsteuer + ca. 1,4 % Umlagen = ~31,4 %
  const agRv = earnings * 0.15;
  const agKv = earnings * 0.13;
  const agTax = earnings * 0.02;
  const agUmlagen = earnings * (config.umlageU1 + config.umlageU2 + config.umlageU3Insolvenzgeld);
  const totalAgCosts = earnings + agRv + agKv + agTax + agUmlagen;

  return {
    primary: {
      id: 'netEarnings',
      label: 'Nettoverdienst des Minijobbers',
      value: netEarnings,
      formattedValue: formatCurrency(netEarnings),
    },
    secondary: [
      { id: 'grossEarnings', label: 'Minijob-Verdienst (brutto)', value: earnings, formattedValue: formatCurrency(earnings) },
      { id: 'rvContribution', label: 'RV-Eigenanteil (3,6 %)', value: anRv, formattedValue: formatCurrency(anRv) },
      { id: 'limit', label: 'Aktuelle Geringfügigkeitsgrenze', value: config.minijobGrenze, formattedValue: formatCurrency(config.minijobGrenze) },
      { id: 'agTotalCosts', label: 'Gesamtkosten für Arbeitgeber', value: totalAgCosts, formattedValue: formatCurrency(totalAgCosts) },
      { id: 'agLumpSum', label: 'AG-Pauschalabgaben (~30 %)', value: totalAgCosts - earnings, formattedValue: formatCurrency(totalAgCosts - earnings) },
    ],
  };
}

// ==========================================
// 10. MIDIJOB-RECHNER (ÜBERGANGSBEREICH § 20 SGB IV)
// ==========================================
export function calculateMidijob(inputs: Record<string, any>): CalculationResult {
  const taxYear = inputs.taxYear || '2026';
  const config = getTaxConfig(taxYear);
  const gross = Math.max(config.minijobGrenze + 0.01, Math.min(config.midijobObergrenze, Number(inputs.earnings) || 1200));

  // Gleitzonen-Formel nach § 20 Abs. 2 SGB IV:
  // Faktor F = 0,6720 (2026) bzw. 0,6865 (2025)
  // Beitragsbemessungsgrundlage AN = F * MinijobGrenze + ((2000 - F * MinijobGrenze) / (2000 - MinijobGrenze)) * (Entgelt - MinijobGrenze)
  const F = config.midijobFaktorF;
  const minLimit = config.minijobGrenze;
  const maxLimit = config.midijobObergrenze;

  const reducedBase = F * minLimit + ((maxLimit - F * minLimit) / (maxLimit - minLimit)) * (gross - minLimit);

  // Sozialabgaben berechnet von der reduzierten Bemessungsgrundlage
  const anRateTotal = (config.beitragssatzRentenversicherung + config.beitragssatzArbeitslosenversicherung + config.beitragssatzKrankenversicherungAllgemein + config.zusatzbeitragKrankenversicherungDurchschnitt + config.beitragssatzPflegeversicherung) / 2;
  const anSocial = reducedBase * anRateTotal;

  // Lohnsteuer im Übergangsbereich
  const estAnnual = computeEStSingle(Math.max(0, gross * 12 - anSocial * 12 - 1230), config);
  const monthlyLSt = estAnnual / 12;

  const netEarnings = Math.max(0, gross - anSocial - monthlyLSt);
  const effectiveSocialRate = (anSocial / gross) * 100;

  return {
    primary: {
      id: 'netEarnings',
      label: 'Netto-Verdienst im Midijob',
      value: netEarnings,
      formattedValue: formatCurrency(netEarnings),
    },
    secondary: [
      { id: 'gross', label: 'Midijob-Bruttogehalt', value: gross, formattedValue: formatCurrency(gross) },
      { id: 'anSocial', label: 'Ermäßigte Sozialabgaben (AN)', value: anSocial, formattedValue: formatCurrency(anSocial) },
      { id: 'monthlyLSt', label: 'Lohnsteuer', value: monthlyLSt, formattedValue: formatCurrency(monthlyLSt) },
      { id: 'reducedBase', label: 'Fiktive Beitragsbemessungsgrundlage (§ 20 SGB IV)', value: reducedBase, formattedValue: formatCurrency(reducedBase) },
      { id: 'effectiveRate', label: 'Effektiver Sozialabgabensatz', value: effectiveSocialRate, formattedValue: formatPercent(effectiveSocialRate) },
      { id: 'fullRVPension', label: 'Voller Rentenanspruch trotz reduzierter Beiträge', value: 100, formattedValue: 'Ja (100 % Rentenanspruch)' },
    ],
  };
}

// ==========================================
// 11. BONUS-NETTO-RECHNER (SONSTIGE BEZÜGE)
// ==========================================
export function calculateBonusNetto(inputs: Record<string, any>): CalculationResult {
  const taxYear = inputs.taxYear || '2026';
  const config = getTaxConfig(taxYear);

  const regularGrossYear = Math.max(0, Number(inputs.regularGrossYear) || 50000);
  const bonus = Math.max(0, Number(inputs.bonus) || 5000);

  // BMF-Methode: Steuerberechnung auf Jahresbasis mit und ohne Bonus
  const estWithoutBonus = computeEStSingle(Math.max(0, regularGrossYear - 1230 - regularGrossYear * 0.18), config);
  const estWithBonus = computeEStSingle(Math.max(0, (regularGrossYear + bonus) - 1230 - (regularGrossYear + bonus) * 0.18), config);
  const taxOnBonus = estWithBonus - estWithoutBonus;

  // Sozialabgaben auf Einmalzahlung (Differenz bis BBG)
  const remainingRvCapacity = Math.max(0, config.bbgRentenversicherungJahr - regularGrossYear);
  const bonusRvGross = Math.min(bonus, remainingRvCapacity);
  const svOnBonus = bonusRvGross * (config.beitragssatzRentenversicherung / 2 + config.beitragssatzArbeitslosenversicherung / 2);

  const totalDeductionsOnBonus = taxOnBonus + svOnBonus;
  const netBonus = Math.max(0, bonus - totalDeductionsOnBonus);
  const deductionPercentage = bonus > 0 ? (totalDeductionsOnBonus / bonus) * 100 : 0;

  return {
    primary: {
      id: 'netBonus',
      label: 'Auszahlung (Netto-Bonus)',
      value: netBonus,
      formattedValue: formatCurrency(netBonus),
    },
    secondary: [
      { id: 'grossBonus', label: 'Brutto-Bonus / Einmalzahlung', value: bonus, formattedValue: formatCurrency(bonus) },
      { id: 'taxOnBonus', label: 'Steuer auf Einmalzahlung', value: taxOnBonus, formattedValue: formatCurrency(taxOnBonus) },
      { id: 'svOnBonus', label: 'Sozialabgaben auf Einmalzahlung', value: svOnBonus, formattedValue: formatCurrency(svOnBonus) },
      { id: 'deductionPercentage', label: 'Gesamtabzugsquote vom Bonus', value: deductionPercentage, formattedValue: formatPercent(deductionPercentage) },
    ],
  };
}

// ==========================================
// 12. ABFINDUNGSRECHNER (FÜNFTELREGELUNG § 34 EStG)
// ==========================================
export function calculateAbfindung(inputs: Record<string, any>): CalculationResult {
  const taxYear = inputs.taxYear || '2026';
  const config = getTaxConfig(taxYear);

  const regularIncome = Math.max(0, Number(inputs.regularIncome) || 45000);
  const abfindung = Math.max(0, Number(inputs.abfindung) || 30000);

  // 1. Reguläre Steuer ohne Abfindung
  const estWithout = computeEStSingle(regularIncome, config);

  // 2. Steuer mit 1/5 der Abfindung (§ 34 Abs. 1 EStG)
  const estWithOneFifth = computeEStSingle(regularIncome + abfindung / 5, config);
  const diffOneFifth = estWithOneFifth - estWithout;

  // 3. Steuer auf die gesamte Abfindung nach Fünftelregelung
  const taxFuenftel = diffOneFifth * 5;
  const totalTaxWithPrivilege = estWithout + taxFuenftel;

  // 4. Vergleich: Reguläre Besteuerung ohne Fünftelregelung
  const estRegularTotal = computeEStSingle(regularIncome + abfindung, config);
  const taxRegularAbfindung = estRegularTotal - estWithout;
  const taxSavings = Math.max(0, taxRegularAbfindung - taxFuenftel);

  const netAbfindung = Math.max(0, abfindung - taxFuenftel);

  return {
    primary: {
      id: 'netAbfindung',
      label: 'Netto-Abfindung (nach Fünftelregelung)',
      value: netAbfindung,
      formattedValue: formatCurrency(netAbfindung),
    },
    secondary: [
      { id: 'grossAbfindung', label: 'Brutto-Abfindung', value: abfindung, formattedValue: formatCurrency(abfindung) },
      { id: 'taxFuenftel', label: 'Steuer auf Abfindung (Fünftelregelung)', value: taxFuenftel, formattedValue: formatCurrency(taxFuenftel) },
      { id: 'taxSavings', label: 'Steuerersparnis durch Fünftelregelung', value: taxSavings, formattedValue: formatCurrency(taxSavings) },
      { id: 'taxRegular', label: 'Steuer ohne Fünftelregelung (Vergleich)', value: taxRegularAbfindung, formattedValue: formatCurrency(taxRegularAbfindung) },
      { id: 'effectiveRate', label: 'Effektiver Steuersatz auf Abfindung', value: abfindung > 0 ? (taxFuenftel / abfindung) * 100 : 0, formattedValue: formatPercent(abfindung > 0 ? (taxFuenftel / abfindung) * 100 : 0) },
    ],
  };
}

// ==========================================
// 13. RENTEN-BRUTTO-NETTO-RECHNER
// ==========================================
export function calculateRenteBruttoNetto(inputs: Record<string, any>): CalculationResult {
  const grossPension = Math.max(0, Number(inputs.grossPension) || 1800);
  const retirementYear = Math.max(2005, Math.min(2040, parseInt(inputs.retirementYear || '2026', 10)));
  const config = getTaxConfig('2026');

  // Gesetzlicher Besteuerungsanteil nach Kohortenprinzip (§ 22 EStG)
  // Bis 2005: 50 %, dann bis 2020 je +2 %/Jahr (80 %), danach nach Wachstumschancengesetz je +0,5 %/Jahr
  let taxableRate = 0.50;
  if (retirementYear <= 2005) taxableRate = 0.50;
  else if (retirementYear <= 2020) taxableRate = 0.50 + (retirementYear - 2005) * 0.02;
  else taxableRate = 0.80 + (retirementYear - 2020) * 0.005;
  taxableRate = Math.min(1.0, taxableRate);

  const annualGross = grossPension * 12;
  const taxableAnnualPension = annualGross * taxableRate;

  // KVdR (7,3 % + 1,25 % Zusatzbeitrag) und PVdR (3,6 % + ggf. 0,6 % Kinderlos)
  const kvdrRate = 0.073 + config.zusatzbeitragKrankenversicherungDurchschnitt / 2;
  const isKinderlos = inputs.children === '0' || inputs.children === 0;
  const pvdrRate = config.beitragssatzPflegeversicherung + (isKinderlos ? config.pflegeZuschlagKinderlos : 0);

  const monthlyKvdr = grossPension * kvdrRate;
  const monthlyPvdr = grossPension * pvdrRate;
  const monthlyHealthDeductions = monthlyKvdr + monthlyPvdr;

  // Einkommensteuer auf steuerpflichtigen Rentenanteil (nach Abzug von Vorsorgeaufwendungen)
  const taxableBase = Math.max(0, taxableAnnualPension - (monthlyHealthDeductions * 12) - 102); // 102 € Werbungskostenpauschbetrag
  const annualESt = computeEStSingle(taxableBase, config);
  const monthlyESt = annualESt / 12;

  const monthlyNetPension = Math.max(0, grossPension - monthlyHealthDeductions - monthlyESt);

  return {
    primary: {
      id: 'netPension',
      label: 'Monatliche Netto-Rente',
      value: monthlyNetPension,
      formattedValue: formatCurrency(monthlyNetPension),
    },
    secondary: [
      { id: 'grossPension', label: 'Brutto-Rente', value: grossPension, formattedValue: formatCurrency(grossPension) },
      { id: 'kvdr', label: 'Krankenversicherung der Rentner (KVdR)', value: monthlyKvdr, formattedValue: formatCurrency(monthlyKvdr) },
      { id: 'pvdr', label: 'Pflegeversicherung (PVdR)', value: monthlyPvdr, formattedValue: formatCurrency(monthlyPvdr) },
      { id: 'est', label: 'Einkommensteuer (monatlich geschätzt)', value: monthlyESt, formattedValue: formatCurrency(monthlyESt) },
      { id: 'taxablePortion', label: 'Besteuerungsanteil nach Renteneintritt', value: taxableRate * 100, formattedValue: formatPercent(taxableRate * 100) },
    ],
  };
}

// ==========================================
// 14. MWST-RECHNER (BRUTTO/NETTO)
// ==========================================
export function calculateMwSt(inputs: Record<string, any>): CalculationResult {
  const amount = Math.max(0, Number(inputs.amount) || 100);
  const mode = inputs.mode || 'netToGross'; // 'netToGross' oder 'grossToNet'
  const taxRate = Number(inputs.rate || 19);

  let net = 0;
  let gross = 0;
  let tax = 0;

  if (mode === 'netToGross') {
    net = amount;
    tax = net * (taxRate / 100);
    gross = net + tax;
  } else {
    gross = amount;
    net = gross / (1 + taxRate / 100);
    tax = gross - net;
  }

  return {
    primary: {
      id: 'resultAmount',
      label: mode === 'netToGross' ? 'Bruttobetrag (inkl. MwSt)' : 'Nettobetrag (ohne MwSt)',
      value: mode === 'netToGross' ? gross : net,
      formattedValue: formatCurrency(mode === 'netToGross' ? gross : net),
    },
    secondary: [
      { id: 'taxAmount', label: `Mehrwertsteuerbetrag (${taxRate} %)`, value: tax, formattedValue: formatCurrency(tax) },
      { id: 'netAmount', label: 'Nettobetrag', value: net, formattedValue: formatCurrency(net) },
      { id: 'grossAmount', label: 'Bruttobetrag', value: gross, formattedValue: formatCurrency(gross) },
    ],
  };
}
