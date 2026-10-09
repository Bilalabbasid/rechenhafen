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
    expect(monthlyPayment?.helpText).toContain('Der Wert ist Jahreskosten ÷ 12. Ihr tatsächlicher Versorgerabschlag kann abweichen.');

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
    expect(monthly?.helpText).toBe('Der Wert ist Jahreskosten ÷ 12. Ihr tatsächlicher Versorgerabschlag kann abweichen.');

    expect(result.qualifications?.[0]).toContain('Der Wert ist Jahreskosten ÷ 12. Ihr tatsächlicher Versorgerabschlag kann abweichen');
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
});
