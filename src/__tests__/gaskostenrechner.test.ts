import { describe, it, expect } from 'vitest';
import { calculateGasCost } from '../lib/calculators/haushalt';

describe('Gaskostenrechner (calculateGasCost)', () => {
  it('handles 1,000 kWh × 0 € + 0 € base charge = 0 €/year without restoring defaults', () => {
    const result = calculateGasCost({
      inputType: 'kwh',
      annualKwh: 1000,
      pricePerKwh: 0,
      basePrice: 0,
      basePricePeriod: 'monthly',
    });

    expect(result.error).toBeUndefined();
    expect(result.primary.value).toBe(0);
    expect(result.primary.formattedValue).toBe('0,00 €');

    const monthlyPayment = result.secondary?.find((s) => s.id === 'monthlyPayment');
    expect(monthlyPayment?.value).toBe(0);
    expect(monthlyPayment?.helpText).toBe('Jahreskosten ÷ 12. Ihr tatsächlicher Versorgerabschlag kann abweichen.');

    const workCost = result.secondary?.find((s) => s.id === 'workCost');
    expect(workCost?.value).toBe(0);

    const baseCost = result.secondary?.find((s) => s.id === 'baseCost');
    expect(baseCost?.value).toBe(0);
  });

  it('calculates 14,000 kWh × 0.105 € + 12 × 12 € = 1,614 €/year accurately', () => {
    const result = calculateGasCost({
      inputType: 'kwh',
      annualKwh: 14000,
      pricePerKwh: 0.105,
      basePrice: 12,
      basePricePeriod: 'monthly',
    });

    expect(result.error).toBeUndefined();
    // 14,000 * 0.105 = 1,470 € work cost
    // 12 * 12 = 144 € base cost
    // Total = 1,614 €
    expect(result.primary.value).toBe(1614);
    expect(result.primary.formattedValue).toBe('1.614,00 €');

    const monthly = result.secondary?.find((s) => s.id === 'monthlyPayment');
    expect(monthly?.value).toBeCloseTo(1614 / 12, 2); // 134.50 €
    expect(monthly?.label).toBe('Rechnerischer Monatsdurchschnitt (Orientierungswert)');
    expect(monthly?.helpText).toBe('Jahreskosten ÷ 12. Ihr tatsächlicher Versorgerabschlag kann abweichen.');

    expect(result.primary.helpText).toBe('Verbrauchskosten plus Grundpreis für ein Jahr.');
    expect(result.qualifications?.[0]).toContain('Berechnung basiert auf den eingegebenen Bruttopreisen');
    expect(result.qualifications?.[1]).toContain('Der rechnerische Monatsdurchschnitt (Jahreskosten ÷ 12) dient als Orientierungswert');
  });

  it('tests 1 m³ gas cost: 10.8 * 0.95 = 10.26 kWh; 10.26 * 0.11 = 1.1286 -> 1.13 €', () => {
    const calorificValue = 10.8;
    const stateFactor = 0.95;
    const pricePerKwh = 0.11;
    const kwhPerM3 = calorificValue * stateFactor; // 10.26
    expect(kwhPerM3).toBeCloseTo(10.26, 4);

    const costPerM3 = kwhPerM3 * pricePerKwh; // 1.1286
    expect(costPerM3).toBeCloseTo(1.1286, 4);
    const displayedCost = Math.round(costPerM3 * 100) / 100;
    expect(displayedCost).toBe(1.13);
  });

  it('uses physical m³ conversion: kWh = m³ × Brennwert × Zustandszahl', () => {
    // 1,000 m³ with Brennwert 10.3 and Zustandszahl 0.95:
    // kWh = 1000 * 10.3 * 0.95 = 9785 kWh
    const result = calculateGasCost({
      inputType: 'm3',
      meterOld: 10000,
      meterNew: 11000,
      calorificValue: 10.3,
      stateFactor: 0.95,
      pricePerKwh: 0.10,
      basePrice: 10,
      basePricePeriod: 'monthly',
    });

    expect(result.error).toBeUndefined();
    const totalKwh = result.secondary?.find((s) => s.id === 'totalKwh');
    expect(totalKwh?.value).toBeCloseTo(9785, 1);

    // Work cost = 9785 * 0.10 = 978.50 €
    // Base cost = 10 * 12 = 120.00 €
    // Total = 1098.50 €
    expect(result.primary.value).toBeCloseTo(1098.50, 2);

    const conversionFactor = result.secondary?.find((s) => s.id === 'conversionFactor');
    expect(conversionFactor?.value).toBeCloseTo(10.3 * 0.95, 4);
  });

  it('handles yearly base price correctly', () => {
    const result = calculateGasCost({
      inputType: 'kwh',
      annualKwh: 10000,
      pricePerKwh: 0.10,
      basePrice: 120,
      basePricePeriod: 'yearly',
    });

    expect(result.error).toBeUndefined();
    // 10,000 * 0.10 = 1000 € + 120 € = 1120 €
    expect(result.primary.value).toBe(1120);
    const baseCost = result.secondary?.find((s) => s.id === 'baseCost');
    expect(baseCost?.value).toBe(120);
  });

  it('explicitly requires full-year meter readings and clarifies non-suitability of monthly readings in m3 mode', () => {
    const result = calculateGasCost({
      inputType: 'm3',
      meterOld: 12000,
      meterNew: 13400, // 1400 m³
      calorificValue: 10.3,
      stateFactor: 0.95,
      pricePerKwh: 0.11,
      basePrice: 12,
      basePricePeriod: 'monthly',
    });

    expect(result.error).toBeUndefined();
    // Summary text must state the full year requirement
    expect(result.summaryText).toContain('vollständiges Jahr');
    expect(result.summaryText).toContain('Monats- oder Wochenablesungen sind für diese Jahreskostenberechnung nicht geeignet');

    // Qualifications must state the annual period and seasonal winter caveat
    const m3Qual = result.qualifications?.find((q) => q.includes('vollständiges Abrechnungsjahr'));
    expect(m3Qual).toBeDefined();
    expect(m3Qual).toContain('Monats- oder Wochenablesungen sind für diese Jahreskostenberechnung nicht geeignet');
    expect(m3Qual).toContain('Winter');

    // Basis summary must show Betrachtungszeitraum
    const periodBasis = result.basisSummary?.find((b) => b.label === 'Betrachtungszeitraum');
    expect(periodBasis?.value).toContain('1 vollständiges Abrechnungsjahr');
  });

  it('regression: 12,000 kWh × 0.10 € + 120 €/year = 1,320 €/year and 110 €/month', () => {
    const res = calculateGasCost({
      inputType: 'kwh',
      annualKwh: 12000,
      pricePerKwh: 0.10,
      basePrice: 120,
      basePricePeriod: 'yearly',
    });

    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(1320);
    expect(res.primary.formattedValue).toBe('1.320,00 €');

    const monthly = res.secondary?.find((s) => s.id === 'monthlyPayment');
    expect(monthly?.value).toBe(110);
    expect(monthly?.formattedValue).toBe('110,00 €');
    expect(monthly?.label).toBe('Rechnerischer Monatsdurchschnitt (Orientierungswert)');

    const workCost = res.secondary?.find((s) => s.id === 'workCost');
    expect(workCost?.value).toBe(1200);

    const baseCost = res.secondary?.find((s) => s.id === 'baseCost');
    expect(baseCost?.value).toBe(120);
  });

  it('regression: tests equivalent inputs in cents (10 ct) and euros (0.10 €)', () => {
    const resEuro = calculateGasCost({
      inputType: 'kwh',
      annualKwh: 12000,
      priceUnit: 'euro',
      pricePerKwh: 0.10,
      basePrice: 120,
      basePricePeriod: 'yearly',
    });

    const resCt = calculateGasCost({
      inputType: 'kwh',
      annualKwh: 12000,
      priceUnit: 'ct',
      pricePerKwh: 10,
      basePrice: 120,
      basePricePeriod: 'yearly',
    });

    expect(resEuro.primary.value).toBe(resCt.primary.value);
    expect(resEuro.primary.formattedValue).toBe(resCt.primary.formattedValue);
    expect(resCt.primary.value).toBe(1320);
  });

  it('regression: 10 €/month and 120 €/year base charges give identical annual total', () => {
    const resMonthlyBase = calculateGasCost({
      inputType: 'kwh',
      annualKwh: 12000,
      pricePerKwh: 0.10,
      basePrice: 10,
      basePricePeriod: 'monthly',
    });

    const resYearlyBase = calculateGasCost({
      inputType: 'kwh',
      annualKwh: 12000,
      pricePerKwh: 0.10,
      basePrice: 120,
      basePricePeriod: 'yearly',
    });

    expect(resMonthlyBase.primary.value).toBe(1320);
    expect(resYearlyBase.primary.value).toBe(1320);
    expect(resMonthlyBase.primary.value).toBe(resYearlyBase.primary.value);
  });

  it('regression: pauses calculation and returns dash for empty required fields', () => {
    const resEmptyKwh = calculateGasCost({
      inputType: 'kwh',
      annualKwh: '',
      pricePerKwh: 0.10,
      basePrice: 10,
    });
    expect(resEmptyKwh.error).toBeDefined();
    expect(resEmptyKwh.primary.formattedValue).toBe('-');

    const resEmptyPrice = calculateGasCost({
      inputType: 'kwh',
      annualKwh: 12000,
      pricePerKwh: '',
      basePrice: 10,
    });
    expect(resEmptyPrice.error).toBeDefined();
    expect(resEmptyPrice.primary.formattedValue).toBe('-');
  });
});
