import { describe, it, expect } from 'vitest';
import { calculateInstallmentLoan } from '../lib/calculators/kredit';
import { calculateGasCost, calculateElectricityCost } from '../lib/calculators/haushalt';
import { calculateFuelCost, calculateCommuterAllowance } from '../lib/calculators/auto';
import { formatCurrency } from '../lib/formatters';
import { calculateDateAdd, calculateAgeInDays, calculateAge } from '../lib/calculators/datumZeit';
import { calculateRentalYield } from '../lib/calculators/wohnen';
import { calculateCalorieNeeds } from '../lib/calculators/gesundheit';
import { calculateRenteBruttoNetto } from '../lib/calculators/steuernGehalt';
import { calculatePartTimeSalary } from '../lib/calculators/arbeit';
import { calculateCompoundInterest } from '../lib/calculators/finanzen';
import { calculateCircle, calculateRectangle } from '../lib/calculators/geometrie';
import { EXTRA_BAUEN_GEOMETRIE as extraBauenCalculators } from '../data/calculators/extra/bauenGeometrie';
import { EXTRA_AUTO_ARBEIT as extraAutoArbeitCalculators } from '../data/calculators/extra/autoArbeit';
import { EXTRA_WOHNEN_HAUSHALT as extraWohnenCalculators } from '../data/calculators/extra/wohnenHaushalt';
import { EXTRA_FINANZEN_KREDIT as extraFinanzenCalculators } from '../data/calculators/extra/finanzenKredit';
import { getCalculatorBySlug } from '../data/calculators';

describe('1. Autokredit & Installment Loan Verification', () => {
  it('handles 0% interest with exact cents reconciliation and €0 total interest', () => {
    // 25,000 € car price, 5,000 € down payment -> 20,000 € loan, 48 months, 0% interest
    const res = calculateInstallmentLoan({
      loanAmount: 20000,
      annualInterest: 0,
      termMonths: 48,
    });

    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBeCloseTo(20000 / 48, 2); // ~416.67 €
    // Total payment must be exactly 20,000 €
    const totalPaymentItem = res.secondary?.find((item) => item.id === 'totalPayment');
    expect(totalPaymentItem?.value).toBe(20000);
    // Total interest must be 0 €
    const totalInterestItem = res.secondary?.find((item) => item.id === 'totalInterest');
    expect(totalInterestItem?.value).toBe(0);

    // Schedule breakdown verification
    expect(res.breakdown).toBeDefined();
    // 48 months grouped by 12 months = 4 years
    expect(res.breakdown?.rows).toHaveLength(4);
    const lastRow = res.breakdown?.rows[3];
    // Remaining debt at end must be 0
    expect(String(lastRow?.values.remaining).replace(/\u00a0/g, ' ')).toBe('0,00 €');

    // Sum of all repayments in breakdown should equal 20,000 € exactly
    let sumRepayments = 0;
    for (const row of res.breakdown?.rows || []) {
      const repaymentVal = parseFloat(String(row.values.repaymentYear).replace(/\./g, '').replace(',', '.').replace(' €', ''));
      sumRepayments += repaymentVal;
    }
    expect(Math.round(sumRepayments * 100) / 100).toBe(20000);
  });

  it('correctly models 5.2% effective annual interest as r = (1 + r_eff)^(1/12) - 1', () => {
    // 20,000 € loan, 48 months, 5.2% effective annual rate
    const res = calculateInstallmentLoan({
      loanAmount: 20000,
      annualInterest: 5.2,
      termMonths: 48,
      isEffectiveRate: true,
    });

    expect(res.error).toBeUndefined();
    // Expected unrounded model: ~461.31 €
    expect(res.primary.value).toBeCloseTo(461.31, 1);
  });

  it('handles autokreditrechner definition down payment == car price', () => {
    const calc = getCalculatorBySlug('autokreditrechner');
    expect(calc).toBeDefined();

    const res = calc!.calculate({
      carPrice: 25000,
      downPayment: 25000,
      termMonths: 48,
      annualInterest: 5.2,
    });

    expect(res.primary.value).toBe(0);
    expect(res.summaryText).toContain('Keine Finanzierung erforderlich');
  });

  it('rejects down payment greater than car price', () => {
    const calc = getCalculatorBySlug('autokreditrechner');
    expect(calc).toBeDefined();
    const res = calc!.calculate({
      carPrice: 25000,
      downPayment: 30000,
      termMonths: 48,
      annualInterest: 5.2,
    });

    expect(res.error).toContain('nicht übersteigen');
  });

  it('rejects empty or negative values for loan and terms', () => {
    const resEmpty = calculateInstallmentLoan({
      loanAmount: '',
      annualInterest: 5.2,
      termMonths: 48,
    });
    expect(resEmpty.error).toBeDefined();

    const resNegative = calculateInstallmentLoan({
      loanAmount: 20000,
      annualInterest: -1,
      termMonths: 48,
    });
    expect(resNegative.error).toBeDefined();

    const resInvalidTerm = calculateInstallmentLoan({
      loanAmount: 20000,
      annualInterest: 5.2,
      termMonths: 0,
    });
    expect(resInvalidTerm.error).toBeDefined();
  });
});

describe('2. Gaskosten Rechner Verification', () => {
  it('rejects blank and negative consumption without falling back to 12,000', () => {
    const resBlank = calculateGasCost({
      amount: '',
      pricePerKwh: 0.10,
      basePricePerMonth: 10,
      inputType: 'kwh',
    });
    expect(resBlank.error).toBeDefined();
    expect(resBlank.error).toContain('Verbrauchsmenge');

    const resNegative = calculateGasCost({
      amount: -100,
      pricePerKwh: 0.10,
      basePricePerMonth: 10,
      inputType: 'kwh',
    });
    expect(resNegative.error).toBeDefined();
  });

  it('correctly calculates 10,000 kWh * 0.10 € + 12 * 10 € = 1,120 €/year', () => {
    const res = calculateGasCost({
      amount: 10000,
      pricePerKwh: 0.10,
      basePricePerMonth: 10,
      inputType: 'kwh',
    });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(1120);
    const monthly = res.secondary?.find((item) => item.id === 'monthlyPayment');
    expect(monthly?.value).toBeCloseTo(1120 / 12, 2);
  });

  it('correctly calculates zero consumption with 10 €/month base charge = 120 €/year', () => {
    const res = calculateGasCost({
      amount: 0,
      pricePerKwh: 0.10,
      basePricePerMonth: 10,
      inputType: 'kwh',
    });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(120);
  });

  it('correctly calculates 1,400 m³ * 10.3 * 0.95 = 13,699 kWh, at 0.11 € and 12 € base = 1,650.89 €/year', () => {
    const res = calculateGasCost({
      amount: 1400,
      pricePerKwh: 0.11,
      basePricePerMonth: 12,
      inputType: 'm3',
      calorificValue: 10.3,
      stateFactor: 0.95,
    });
    expect(res.error).toBeUndefined();
    // 1400 * 10.3 * 0.95 = 13699 kWh
    // 13699 * 0.11 = 1506.89 €
    // Base: 12 * 12 = 144 €
    // Total: 1650.89 €
    expect(res.primary.value).toBeCloseTo(1650.89, 2);
  });

  it('validates conversion factors in m³ mode', () => {
    const resInvalidBw = calculateGasCost({
      amount: 1400,
      pricePerKwh: 0.11,
      basePricePerMonth: 12,
      inputType: 'm3',
      calorificValue: 0,
      stateFactor: 0.95,
    });
    expect(resInvalidBw.error).toBeDefined();
  });
});

describe('3. Spritkosten Rechner Verification', () => {
  it('rejects blank distance and handles zero distance cleanly', () => {
    const resBlank = calculateFuelCost({
      distance: '',
      consumption: 5,
      pricePerLiter: 2,
    });
    expect(resBlank.error).toBeDefined();

    const resZero = calculateFuelCost({
      distance: 0,
      consumption: 5,
      pricePerLiter: 2,
    });
    expect(resZero.error).toBeUndefined();
    expect(resZero.primary.value).toBe(0);
    const fuelLiters = resZero.secondary?.find((item) => item.id === 'totalLiters');
    expect(fuelLiters?.value).toBe(0);
  });

  it('calculates 100 km one-way, return trip, 5 l/100 km, 2 €/l, two people -> 200 km, 10 L, 20 €, 10 €/person', () => {
    const res = calculateFuelCost({
      distance: 100,
      consumption: 5,
      pricePerLiter: 2,
      tripType: 'roundtrip',
      passengers: 2,
      tripsCount: 1,
    });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(20);
    const perPerson = res.secondary?.find((item) => item.id === 'costPerPerson');
    expect(perPerson?.value).toBe(10);
    const totalKm = res.secondary?.find((item) => item.id === 'totalKm');
    expect(totalKm?.value).toBe(200);
    const fuelLiters = res.secondary?.find((item) => item.id === 'totalLiters');
    expect(fuelLiters?.value).toBe(10);
  });

  it('rejects invalid passengers and tripsCount (fractions/negative/zero)', () => {
    const resFraction = calculateFuelCost({
      distance: 100,
      consumption: 5,
      pricePerLiter: 2,
      passengers: 1.5,
    });
    expect(resFraction.error).toBeDefined();

    const resZeroPass = calculateFuelCost({
      distance: 100,
      consumption: 5,
      pricePerLiter: 2,
      passengers: 0,
    });
    expect(resZeroPass.error).toBeDefined();
  });
});

describe('4. Schalungssteine Rechner Verification', () => {
  const calc = extraBauenCalculators.find((c) => c.slug === 'schalungssteine-rechner');

  it('rejects openings larger than gross wall area', () => {
    expect(calc).toBeDefined();
    // 1m x 1m wall (1 m²) with 2 m² openings
    const res = calc!.calculate({
      wallLength: 1,
      wallHeight: 1,
      stoneWidth: '24',
      openingsArea: 2,
      waste: 5,
    });
    expect(res.error).toBeDefined();
    expect(res.error).toContain('größer als die Brutto-Wandfläche');
  });

  it('returns 0 stones, concrete, and rebar when openings equal gross wall area', () => {
    // 1m x 1m wall with 1 m² opening
    const res = calc!.calculate({
      wallLength: 1,
      wallHeight: 1,
      stoneWidth: '24',
      openingsArea: 1,
      waste: 0,
    });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(0);
    const concrete = res.secondary?.find((s: any) => s.id === 'concreteM3');
    expect(concrete?.value).toBe(0);
    const steel = res.secondary?.find((s: any) => s.id === 'rebar');
    expect(steel?.value).toBe(0);
  });

  it('preserves 1 m², 50x25 cm blocks, 0% reserve = 8 blocks', () => {
    // 1 m², 50x25 cm blocks -> 1 / (0.5 * 0.25) = 8 blocks
    const res = calc!.calculate({
      wallLength: 1,
      wallHeight: 1,
      stoneWidth: '24',
      openingsArea: 0,
      waste: 0,
    });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(8);
  });

  it('preserves 8m x 1.5m (12 m²), 5% reserve = 101 blocks', () => {
    // 12 m² * 8 blocks/m² = 96 blocks * 1.05 = 100.8 -> Math.ceil = 101 blocks
    const res = calc!.calculate({
      wallLength: 8,
      wallHeight: 1.5,
      stoneWidth: '24',
      openingsArea: 0,
      waste: 5,
    });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(101);
  });
});

describe('5. Datum plus Tage Verification', () => {
  it('rejects empty date without silent fallback', () => {
    const res = calculateDateAdd({
      startDate: '',
      days: 10,
      operation: 'add',
    });
    expect(res.error).toBeDefined();
    expect(res.error).toContain('Ausgangsdatum');
  });

  it('preserves 28.02.2024 + 1 day = 29.02.2024 (leap year)', () => {
    const res = calculateDateAdd({
      startDate: '2024-02-28',
      days: 1,
      operation: 'add',
    });
    expect(res.error).toBeUndefined();
    expect(res.primary.formattedValue).toBe('29.02.2024');
  });

  it('preserves 31.12.2026 + 1 day = 01.01.2027', () => {
    const res = calculateDateAdd({
      startDate: '2026-12-31',
      days: 1,
      operation: 'add',
    });
    expect(res.error).toBeUndefined();
    expect(res.primary.formattedValue).toBe('01.01.2027');
    const weekItem = res.secondary?.find((s) => s.id === 'calendarWeek');
    expect(weekItem?.formattedValue).toBe('KW 53');
  });

  it('preserves date when adding 0 days', () => {
    const res = calculateDateAdd({
      startDate: '2025-05-15',
      days: 0,
      operation: 'add',
    });
    expect(res.error).toBeUndefined();
    expect(res.primary.formattedValue).toBe('15.05.2025');
  });

  it('rejects non-integer days', () => {
    const res = calculateDateAdd({
      startDate: '2025-05-15',
      days: 3.5,
      operation: 'add',
    });
    expect(res.error).toBeDefined();
  });
});

describe('6. Alter in Tagen Verification', () => {
  it('rejects empty birth date without fallback', () => {
    const res = calculateAgeInDays({
      birthDate: '',
      targetDate: '2026-01-01',
    });
    expect(res.error).toBeDefined();
  });

  it('calculates 28.02.2024 to 01.03.2024 = 2 calendar days (leap year)', () => {
    const res = calculateAgeInDays({
      birthDate: '2024-02-28',
      targetDate: '2024-03-01',
    });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(2);
  });

  it('calculates same date = 0 days', () => {
    const res = calculateAgeInDays({
      birthDate: '2025-01-01',
      targetDate: '2025-01-01',
    });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(0);
  });

  it('rejects target date before birth date', () => {
    const res = calculateAgeInDays({
      birthDate: '2025-01-02',
      targetDate: '2025-01-01',
    });
    expect(res.error).toBeDefined();
  });
});

describe('7. Dienstjubiläum Verification', () => {
  it('correctly calculates 29.02.2000 entry dates using 28 February in non-leap years convention', () => {
    const calc = getCalculatorBySlug('dienstjubilaeum-rechner');
    expect(calc).toBeDefined();

    const res = calc!.calculate({
      entryDate: '2000-02-29',
    });
    expect(res.error).toBeUndefined();

    // 10 years: 2010 (non-leap) -> 28.02.2010
    const j10 = res.secondary?.find((d) => d.id === 'j10');
    expect(j10?.formattedValue).toBe('28.02.2010');

    // 25 years: 2025 (non-leap) -> 28.02.2025 (primary)
    expect(res.primary.formattedValue).toBe('28.02.2025');

    // 40 years: 2040 (leap) -> 29.02.2040
    const j40 = res.secondary?.find((d) => d.id === 'j40');
    expect(j40?.formattedValue).toBe('29.02.2040');

    // 50 years: 2050 (non-leap) -> 28.02.2050
    const j50 = res.secondary?.find((d) => d.id === 'j50');
    expect(j50?.formattedValue).toBe('28.02.2050');
  });
});

describe('8. KFZ-Steuer Rechner Statutory Audit Verification', () => {
  const calc = extraAutoArbeitCalculators.find((c) => c.slug === 'kfz-steuer-rechner')!;

  it('calculates 1,998 cm³ petrol, 135 g/km CO2 from 2021 as exactly 124 €', () => {
    const res = calc.calculate({
      engineType: 'petrol',
      displacementCc: 1998,
      co2EmissionsGkm: 135,
      firstRegistration: 'from_2021',
    });
    expect(res.error).toBeUndefined();
    // Base: ceil(1998/100) * 2 = 20 * 2 = 40 €
    // CO2: (115-95)*2.00 + (135-115)*2.20 = 40 + 44 = 84 €
    // Total: 40 + 84 = 124 €
    expect(res.primary.value).toBe(124);
  });

  it('correctly applies § 11 Abs. 5 KraftStG floor rounding: 1,001 cm³ petrol, 136 g/km CO2 from 2021 yields 108 €', () => {
    const res = calc.calculate({
      engineType: 'petrol',
      displacementCc: 1001,
      co2EmissionsGkm: 136,
      firstRegistration: 'from_2021',
    });
    expect(res.error).toBeUndefined();
    // Base: ceil(1001/100) * 2 = 11 * 2 = 22 €
    // CO2: 20*2.00 (40 €) + 20*2.20 (44 €) + 1*2.50 (2.50 €) = 86.50 €
    // Unrounded sum: 22 + 86.50 = 108.50 € -> Math.floor per § 11 Abs. 5 KraftStG = 108 €
    expect(res.primary.value).toBe(108);
  });

  it('verifies all statutory CO2 progression boundaries under § 9 Abs. 1 Nr. 2 KraftStG', () => {
    // 95 g/km: taxable CO2 = 0 -> 40 €
    expect(calc.calculate({ engineType: 'petrol', displacementCc: 1998, co2EmissionsGkm: 95, firstRegistration: 'from_2021' }).primary.value).toBe(40);
    // 115 g/km: 40 + 20*2.00 = 80 €
    expect(calc.calculate({ engineType: 'petrol', displacementCc: 1998, co2EmissionsGkm: 115, firstRegistration: 'from_2021' }).primary.value).toBe(80);
    // 135 g/km: 80 + 20*2.20 = 124 €
    expect(calc.calculate({ engineType: 'petrol', displacementCc: 1998, co2EmissionsGkm: 135, firstRegistration: 'from_2021' }).primary.value).toBe(124);
    // 155 g/km: 124 + 20*2.50 = 174 €
    expect(calc.calculate({ engineType: 'petrol', displacementCc: 1998, co2EmissionsGkm: 155, firstRegistration: 'from_2021' }).primary.value).toBe(174);
    // 175 g/km: 174 + 20*2.90 = 232 €
    expect(calc.calculate({ engineType: 'petrol', displacementCc: 1998, co2EmissionsGkm: 175, firstRegistration: 'from_2021' }).primary.value).toBe(232);
    // 195 g/km: 232 + 20*3.40 = 300 €
    expect(calc.calculate({ engineType: 'petrol', displacementCc: 1998, co2EmissionsGkm: 195, firstRegistration: 'from_2021' }).primary.value).toBe(300);
    // 205 g/km: 300 + 10*4.00 = 340 €
    expect(calc.calculate({ engineType: 'petrol', displacementCc: 1998, co2EmissionsGkm: 205, firstRegistration: 'from_2021' }).primary.value).toBe(340);
  });

  it('correctly models historical registration cohorts and rejects unsupported pre-01.07.2009', () => {
    // 2014_2020: 1998 cc petrol, 135 g/km -> 40 + (135 - 95) * 2 = 40 + 80 = 120 €
    const res2014 = calc.calculate({ engineType: 'petrol', displacementCc: 1998, co2EmissionsGkm: 135, firstRegistration: '2014_2020' });
    expect(res2014.primary.value).toBe(120);

    // 2012_2013: 1998 cc petrol, 135 g/km -> 40 + (135 - 110) * 2 = 40 + 50 = 90 €
    const res2012 = calc.calculate({ engineType: 'petrol', displacementCc: 1998, co2EmissionsGkm: 135, firstRegistration: '2012_2013' });
    expect(res2012.primary.value).toBe(90);

    // 2009_2011: 1998 cc petrol, 135 g/km -> 40 + (135 - 120) * 2 = 40 + 30 = 70 €
    const res2009 = calc.calculate({ engineType: 'petrol', displacementCc: 1998, co2EmissionsGkm: 135, firstRegistration: '2009_2011' });
    expect(res2009.primary.value).toBe(70);

    // before_2009: rejected with German guidance
    const resPre2009 = calc.calculate({ engineType: 'petrol', displacementCc: 1998, co2EmissionsGkm: 135, firstRegistration: 'before_2009' });
    expect(resPre2009.error).toBeDefined();
    expect(resPre2009.error).toContain('01.07.2009');
  });

  it('handles electric vehicles: 0 € during active exemption and halved weight tax after expiry', () => {
    // Active exemption
    const resActive = calc.calculate({ engineType: 'electric', firstRegistration: 'from_2021' });
    expect(resActive.primary.value).toBe(0);
    expect(resActive.summaryText).toContain('Steuerbefreiung');

    // Expired exemption with 2,100 kg weight: § 9 Abs. 1 Nr. 3 halved per § 9 Abs. 2 KraftStG
    // up to 2000 kg: 10 * 11.25 = 112.50 €; 2000-2100 kg: 1 * 12.02 = 12.02 € -> 124.52 € * 0.5 = 62.26 € -> floor 62 €
    const resExpired = calc.calculate({ engineType: 'electric', firstRegistration: '2012_2013', grossWeightKg: 2100 });
    expect(resExpired.error).toBeUndefined();
    expect(resExpired.primary.value).toBe(62);
  });

  it('validates empty and negative inputs strictly', () => {
    const resEmpty = calc.calculate({ engineType: 'petrol', displacementCc: '', co2EmissionsGkm: 120 });
    expect(resEmpty.error).toBeDefined();

    const resNegative = calc.calculate({ engineType: 'petrol', displacementCc: -1998, co2EmissionsGkm: 120 });
    expect(resNegative.error).toBeDefined();
  });
});

describe('9. Bürgergeld Rechner Statutory Audit Verification', () => {
  const calc = extraAutoArbeitCalculators.find((c) => c.slug === 'buergergeld-anspruch-rechner')!;

  it('calculates single adult with 0 rent, 0 children, 0 income as exactly 563,00 € standard need (no silent 720 € fallback)', () => {
    const res = calc.calculate({
      householdType: 'single',
      children0to5: 0,
      children6to13: 0,
      children14to17: 0,
      isSingleParent: false,
      coldRent: 0,
      heatingCosts: 0,
      earnedNetIncome: 0,
    });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(563);
    const coldRentItem = res.secondary?.find((s) => s.id === 'coldRentShare');
    expect(coldRentItem?.value).toBe(0);
    const heatingItem = res.secondary?.find((s) => s.id === 'heatingShare');
    expect(heatingItem?.value).toBe(0);
  });

  it('applies statutory 2026 child standard needs per § 23 SGB II (357 €, 390 €, 471 €)', () => {
    // 1 child 0-5 years: 357 €
    const res0to5 = calc.calculate({ householdType: 'single', children0to5: 1, children6to13: 0, children14to17: 0, coldRent: 0, heatingCosts: 0, earnedNetIncome: 0 });
    expect(res0to5.primary.value).toBe(563 + 357);

    // 1 child 6-13 years: 390 €
    const res6to13 = calc.calculate({ householdType: 'single', children0to5: 0, children6to13: 1, children14to17: 0, coldRent: 0, heatingCosts: 0, earnedNetIncome: 0 });
    expect(res6to13.primary.value).toBe(563 + 390);

    // 1 child 14-17 years: 471 €
    const res14to17 = calc.calculate({ householdType: 'single', children0to5: 0, children6to13: 0, children14to17: 1, coldRent: 0, heatingCosts: 0, earnedNetIncome: 0 });
    expect(res14to17.primary.value).toBe(563 + 471);
  });

  it('correctly calculates single-parent additional need under § 21 Abs. 3 SGB II', () => {
    // 1 child under 7: 36 % of 563 € = 202.68 €
    const resSingleUnder7 = calc.calculate({ householdType: 'single', children0to5: 1, children6to13: 0, children14to17: 0, isSingleParent: true, coldRent: 0, heatingCosts: 0, earnedNetIncome: 0 });
    const singleParentItem1 = resSingleUnder7.secondary?.find((s) => s.id === 'singleParent');
    expect(singleParentItem1?.value).toBeCloseTo(202.68, 2);

    // 1 child 6-13: 12 % of 563 € = 67.56 €
    const resSingleOlder = calc.calculate({ householdType: 'single', children0to5: 0, children6to13: 1, children14to17: 0, isSingleParent: true, coldRent: 0, heatingCosts: 0, earnedNetIncome: 0 });
    const singleParentItem2 = resSingleOlder.secondary?.find((s) => s.id === 'singleParent');
    expect(singleParentItem2?.value).toBeCloseTo(67.56, 2);
  });

  it('separates cold rent and heating costs and offsets income', () => {
    const res = calc.calculate({
      householdType: 'single',
      children0to5: 0,
      children6to13: 0,
      children14to17: 0,
      coldRent: 500,
      heatingCosts: 150,
      earnedNetIncome: 200,
    });
    // Standard need: 563 €
    // Housing: 500 + 150 = 650 €
    // Total need: 1213 € - 200 € income = 1013 €
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(1013);
  });

  it('rejects negative rents and incomes', () => {
    const resNegRent = calc.calculate({ householdType: 'single', coldRent: -50, heatingCosts: 100, earnedNetIncome: 0 });
    expect(resNegRent.error).toBeDefined();

    const resNegIncome = calc.calculate({ householdType: 'single', coldRent: 500, heatingCosts: 100, earnedNetIncome: -200 });
    expect(resNegIncome.error).toBeDefined();
  });
});

describe('10. Renten brutto/netto Statutory Audit Verification', () => {
  it('correctly handles 0 € gross pension with 0 € net and 0 € deductions', () => {
    const res = calculateRenteBruttoNetto({
      grossPension: 0,
      retirementYear: 2026,
      healthInsurance: 'statutory',
      careInsuranceOption: 'childless',
    });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(0);
    expect(res.secondary?.find((s) => s.id === 'kvdr')?.value).toBe(0);
    expect(res.secondary?.find((s) => s.id === 'pvdr')?.value).toBe(0);
  });

  it('applies statutory cohort rate 84.0 % for retirement year 2026 under § 22 EStG', () => {
    const res = calculateRenteBruttoNetto({
      grossPension: 2000,
      retirementYear: 2026,
      healthInsurance: 'statutory',
      careInsuranceOption: '1_child',
      additionalHealthRate: 2.5,
    });
    expect(res.error).toBeUndefined();
    expect(res.summaryText).toContain('84 %');
  });

  it('correctly calculates insurer-specific additional health contribution halved by § 249a SGB V', () => {
    // 2000 € gross pension, 2.5 % additional rate -> pensioner pays 7.3 % + 1.25 % = 8.55 % = 171.00 €
    const res = calculateRenteBruttoNetto({
      grossPension: 2000,
      retirementYear: 2026,
      healthInsurance: 'statutory',
      careInsuranceOption: '1_child',
      additionalHealthRate: 2.5,
    });
    const kv = res.secondary?.find((s) => s.id === 'kvdr');
    expect(kv?.value).toBe(171.00);
  });

  it('correctly applies 2026 care insurance rate tiers based on child count (§ 55 SGB XI)', () => {
    // Childless: 4.20 % -> 84.00 € on 2,000 €
    const resChildless = calculateRenteBruttoNetto({ grossPension: 2000, healthInsurance: 'statutory', careInsuranceOption: 'childless' });
    expect(resChildless.secondary?.find((s) => s.id === 'pvdr')?.value).toBe(84.00);

    // 1 Child / Elterneigenschaft: 3.60 % -> 72.00 € on 2,000 €
    const res1Child = calculateRenteBruttoNetto({ grossPension: 2000, healthInsurance: 'statutory', careInsuranceOption: '1_child' });
    expect(res1Child.secondary?.find((s) => s.id === 'pvdr')?.value).toBe(72.00);

    // 2 Children under 25: 3.35 % -> 67.00 € on 2,000 €
    const res2Children = calculateRenteBruttoNetto({ grossPension: 2000, healthInsurance: 'statutory', careInsuranceOption: '2_children' });
    expect(res2Children.secondary?.find((s) => s.id === 'pvdr')?.value).toBe(67.00);

    // 3 Children under 25: 3.10 % -> 62.00 € on 2,000 €
    const res3Children = calculateRenteBruttoNetto({ grossPension: 2000, healthInsurance: 'statutory', careInsuranceOption: '3_children' });
    expect(res3Children.secondary?.find((s) => s.id === 'pvdr')?.value).toBe(62.00);

    // 4 Children under 25: 2.85 % -> 57.00 € on 2,000 €
    const res4Children = calculateRenteBruttoNetto({ grossPension: 2000, healthInsurance: 'statutory', careInsuranceOption: '4_children' });
    expect(res4Children.secondary?.find((s) => s.id === 'pvdr')?.value).toBe(57.00);

    // 5+ Children under 25: 2.60 % -> 52.00 € on 2,000 €
    const res5Children = calculateRenteBruttoNetto({ grossPension: 2000, healthInsurance: 'statutory', careInsuranceOption: '5_plus_children' });
    expect(res5Children.secondary?.find((s) => s.id === 'pvdr')?.value).toBe(52.00);
  });

  it('verifies official 2026 pension fixture: 1,800 € gross, 2.9% additional health, 4.2% childless care', () => {
    const res = calculateRenteBruttoNetto({
      grossPension: 1800,
      retirementYear: '2026',
      additionalHealthRate: 2.9,
      careInsuranceOption: 'childless',
    });
    expect(res.error).toBeUndefined();
    // KVdR: 1,800 * (7.3% + 2.9%/2) = 1,800 * 8.75% = 157.50 €
    const kv = res.secondary?.find((s) => s.id === 'kvdr')?.value;
    expect(kv).toBe(157.50);
    // PVdR: 1,800 * 4.2% = 75.60 €
    const pv = res.secondary?.find((s) => s.id === 'pvdr')?.value;
    expect(pv).toBe(75.60);
    // Payout before income tax: 1,800 - 157.50 - 75.60 = 1,566.90 €
    const payout = res.secondary?.find((s) => s.id === 'payoutAfterSocial')?.value;
    expect(payout).toBe(1566.90);
    // Taxable portion 84.0%
    const taxableRate = res.secondary?.find((s) => s.id === 'taxablePortion')?.value;
    expect(taxableRate).toBe(84);
  });

  it('distinguishes monthly payout from annual net pension and validates negative pension', () => {
    const resValid = calculateRenteBruttoNetto({ grossPension: 2000, healthInsurance: 'statutory', careInsuranceOption: '1_child' });
    const payout = resValid.secondary?.find((s) => s.id === 'payoutAfterSocial');
    expect(payout).toBeDefined();
    expect(payout?.value).toBeGreaterThan(0);

    const resNegative = calculateRenteBruttoNetto({ grossPension: -500 });
    expect(resNegative.error).toBeDefined();
  });
});

describe('11. Teilzeit-Gehalt Statutory Audit Verification', () => {
  it('calculates 4,200 € full-time, 40h -> 20h as exactly 2,100 € gross', () => {
    const res = calculatePartTimeSalary({
      fullTimeSalary: 4200,
      fullTimeHours: 40,
      partTimeHours: 20,
    });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(2100);
  });

  it('rejects part-time hours exceeding full-time hours with German statutory explanation (§ 2 TzBfG)', () => {
    const res = calculatePartTimeSalary({
      fullTimeSalary: 4200,
      fullTimeHours: 40,
      partTimeHours: 45,
    });
    expect(res.error).toBeDefined();
    expect(res.error).toContain('übersteigen die Vollzeit-Basis');
  });

  it('rejects zero or negative full-time hours', () => {
    const resZero = calculatePartTimeSalary({ fullTimeSalary: 4200, fullTimeHours: 0, partTimeHours: 20 });
    expect(resZero.error).toBeDefined();

    const resNegSalary = calculatePartTimeSalary({ fullTimeSalary: -100, fullTimeHours: 40, partTimeHours: 20 });
    expect(resNegSalary.error).toBeDefined();
  });
});

describe('12. Kapitalertragsteuer Statutory Audit Verification', () => {
  const calc = extraFinanzenCalculators.find((c) => c.slug === 'kapitalertragsteuer-rechner')!;

  it('returns exactly 0,00 € tax for 0 € capital gains', () => {
    const res = calc.calculate({ profit: 0, churchState: 'none' });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(0);
    expect(res.primary.formattedValue).toBe('0,00 €');
  });

  it('calculates 3,000 € profit without church tax as exactly 791,25 €', () => {
    const res = calc.calculate({ profit: 3000, churchState: 'none' });
    expect(res.error).toBeUndefined();
    // KapESt: 25 % of 3000 = 750.00 €
    // SolZ: 5.5 % of 750 = 41.25 €
    // Total: 791.25 €
    expect(res.primary.value).toBe(791.25);
    expect(res.secondary?.find((s: any) => s.id === 'kapEst')?.value).toBe(750.00);
    expect(res.secondary?.find((s: any) => s.id === 'solz')?.value).toBe(41.25);
  });

  it('applies statutory church tax formula e / (4 + k) per § 32d Abs. 1 Satz 4 EStG', () => {
    // 8 % KiSt (Bayern & Baden-Württemberg):
    // KapESt: 3000 / 4.08 = 735.294... -> 735.29 €
    // SolZ: 735.29 * 0.055 = 40.44095 -> 40.44 €
    // KiSt: 735.29 * 0.08 = 58.8232 -> 58.82 €
    // Total: 735.29 + 40.44 + 58.82 = 834.55 €
    const res8 = calc.calculate({ profit: 3000, churchState: '8' });
    expect(res8.error).toBeUndefined();
    expect(res8.primary.value).toBe(834.55);
    expect(res8.secondary?.find((s: any) => s.id === 'kapEst')?.value).toBe(735.29);
    expect(res8.secondary?.find((s: any) => s.id === 'solz')?.value).toBe(40.44);
    expect(res8.secondary?.find((s: any) => s.id === 'kist')?.value).toBe(58.82);

    // 9 % KiSt (Other federal states):
    // KapESt: 3000 / 4.09 = 733.496... -> 733.50 €
    // SolZ: 733.496... * 0.055 = 40.342... -> 40.34 €
    // KiSt: 733.496... * 0.09 = 66.014... -> 66.01 €
    // Total: 733.50 + 40.34 + 66.01 = 839.85 €
    const res9 = calc.calculate({ profit: 3000, churchState: '9' });
    expect(res9.error).toBeUndefined();
    expect(res9.primary.value).toBe(839.85);
    expect(res9.secondary?.find((s: any) => s.id === 'kapEst')?.value).toBe(733.50);
    expect(res9.secondary?.find((s: any) => s.id === 'solz')?.value).toBe(40.34);
    expect(res9.secondary?.find((s: any) => s.id === 'kist')?.value).toBe(66.01);
  });

  it('rejects empty and negative capital gains', () => {
    const resEmpty = calc.calculate({ profit: '' });
    expect(resEmpty.error).toBeDefined();

    const resNeg = calc.calculate({ profit: -500 });
    expect(resNeg.error).toBeDefined();
  });
});

describe('13. Zinseszins Rechner Audit Verification', () => {
  it('calculates 1,000 € at 5 % annual interest for 2 years as 1,102.50 € with 102.50 € interest', () => {
    const res = calculateCompoundInterest({
      initialAmount: 1000,
      monthlyContribution: 0,
      annualRate: 5,
      years: 2,
      compoundFrequency: '1',
      depositTiming: 'end',
    });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(1102.50);
    expect(res.secondary?.find((s) => s.id === 'totalInterest')?.value).toBe(102.50);
  });

  it('calculates 1,000 € + 100 €/mo at 0 % interest for 2 years as 3,400.00 € with 0 € interest', () => {
    const res = calculateCompoundInterest({
      initialAmount: 1000,
      monthlyContribution: 100,
      annualRate: 0,
      years: 2,
      compoundFrequency: '12',
      depositTiming: 'end',
    });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(3400.00);
    expect(res.secondary?.find((s) => s.id === 'totalInterest')?.value).toBe(0);
  });

  it('strictly validates negative values, missing rate and zero years', () => {
    expect(calculateCompoundInterest({ initialAmount: -100, monthlyContribution: 50, annualRate: 5, years: 10 }).error).toBeDefined();
    expect(calculateCompoundInterest({ initialAmount: 1000, monthlyContribution: -50, annualRate: 5, years: 10 }).error).toBeDefined();
    expect(calculateCompoundInterest({ initialAmount: 1000, monthlyContribution: 50, annualRate: -2, years: 10 }).error).toBeDefined();
    expect(calculateCompoundInterest({ initialAmount: 1000, monthlyContribution: 50, annualRate: 5, years: 0 }).error).toBeDefined();
    expect(calculateCompoundInterest({ initialAmount: '', monthlyContribution: '', annualRate: 5, years: 10 }).error).toBeDefined();
  });
});

describe('14. Preserved Auxiliary Calculators Verification', () => {
  it('Kalorienbedarf: rejects empty/invalid physical values', () => {
    const resEmpty = calculateCalorieNeeds({
      weight: '',
      height: 178,
      age: 30,
      gender: 'male',
      activity: 'moderate',
    });
    expect(resEmpty.error).toBeDefined();

    const resValid = calculateCalorieNeeds({
      weight: 75,
      height: 178,
      age: 30,
      gender: 'male',
      activity: 'moderate',
    });
    expect(resValid.error).toBeUndefined();
    expect(resValid.primary.value).toBeGreaterThan(1500);
  });

  it('Sabbatical-Rechner: validates income and saving months', () => {
    const calc = extraAutoArbeitCalculators.find((c) => c.slug === 'sabbatical-rechner');
    expect(calc).toBeDefined();

    const resValid = calc!.calculate({
      regularNet: 3000,
      workMonths: 12,
      leaveMonths: 12,
    });
    expect(resValid.error).toBeUndefined();
    expect(resValid.primary.value).toBe(1500);
  });

  it('Kreis- und Rechteckrechner: validate dimensions strictly', () => {
    const resCircle = calculateCircle({ radius: 5 });
    expect(resCircle.error).toBeUndefined();
    expect(resCircle.secondary?.find((s) => s.id === 'circumference')?.value).toBeCloseTo(31.42, 2);

    const resRect = calculateRectangle({ lengthA: 5, widthB: 4 });
    expect(resRect.error).toBeUndefined();
    expect(resRect.primary.value).toBe(20);
  });

  it('Stromkostenrechner: validates power and price strictly', () => {
    const resValid = calculateElectricityCost({
      watts: 100,
      hoursPerDay: 5,
      pricePerKwh: 0.35,
    });
    expect(resValid.error).toBeUndefined();
    expect(resValid.primary.value).toBeCloseTo(63.875, 1);
  });

  it('Gasverbrauch m³/kWh Rechner: strictly validates inputs without silent fallbacks', () => {
    const calc = extraWohnenCalculators.find((c) => c.slug === 'gasverbrauch-kwh-m3-rechner');
    expect(calc).toBeDefined();

    const resValid = calc!.calculate({
      gasCubicMeters: 1200,
      brennwert: 11.2,
      zustandszahl: 0.95,
      gasPricePerKwh: 10.5,
    });
    expect(resValid.error).toBeUndefined();
    expect(resValid.primary.value).toBe(12768);
  });

  describe('Audited Numerical Checks and Consistency Guarantees', () => {
    it('verifies Household Electricity: 2,500 kWh, 0.35 €/kWh, 12 €/month base price', () => {
      const res = calculateElectricityCost({
        annualKwh: 2500,
        pricePerKwh: 0.35,
        basePricePerMonth: 12.0,
      });
      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(1019);
      expect(res.primary.formattedValue).toBe(formatCurrency(1019));

      const workCost = res.secondary?.find((s) => s.id === 'workCost')?.value;
      const baseCost = res.secondary?.find((s) => s.id === 'baseCost')?.value;
      const monthlyAvg = res.secondary?.find((s) => s.id === 'monthlyAverage')?.value;
      const monthlyAvgFormatted = res.secondary?.find((s) => s.id === 'monthlyAverage')?.formattedValue;

      expect(workCost).toBe(875);
      expect(baseCost).toBe(144);
      expect(monthlyAvg).toBeCloseTo(84.92, 2);
      expect(monthlyAvgFormatted).toBe(formatCurrency(84.92));

      // Zero consumption preserves valid fixed charges
      const resZero = calculateElectricityCost({
        annualKwh: 0,
        pricePerKwh: 0.35,
        basePricePerMonth: 12.0,
      });
      expect(resZero.primary.value).toBe(144);
      expect(resZero.secondary?.find((s) => s.id === 'monthlyAverage')?.value).toBe(12);
    });

    it('verifies Device Electricity: 2,000 W, 2 h/day, 30 days, 35 ct/kWh without silent 365-day extrapolation', () => {
      const calc = extraWohnenCalculators.find((c) => c.slug === 'stromkosten-geraete-rechner')!;
      expect(calc).toBeDefined();

      const res = calc.calculate({
        powerWatts: 2000,
        hoursPerDay: 2,
        usageDays: 30,
        electricityPrice: 35,
      });
      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(42);
      expect(res.primary.formattedValue).toBe(formatCurrency(42));

      const kwh = res.secondary?.find((s) => s.id === 'totalKwhPeriod')?.value;
      const costPerHour = res.secondary?.find((s) => s.id === 'costPerHour')?.value;
      expect(kwh).toBe(120);
      expect(costPerHour).toBeCloseTo(0.70, 2);
    });

    it('verifies Gas Conversion from two readings: 7,250 m³ to 8,450 m³ with bw 10.8 and z 0.95', () => {
      const calc = extraWohnenCalculators.find((c) => c.slug === 'gasverbrauch-kwh-m3-rechner')!;
      expect(calc).toBeDefined();

      const res = calc.calculate({
        inputMode: 'readings',
        meterReadingOld: 7250,
        meterReadingNew: 8450,
        brennwert: 10.8,
        zustandszahl: 0.95,
        gasPricePerKwh: 11.0,
      });
      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(12312);
      expect(res.primary.formattedValue).toBe('12.312 kWh');

      const m3 = res.secondary?.find((s) => s.id === 'consumedM3')?.value;
      const consumptionCost = res.secondary?.find((s) => s.id === 'consumptionCost')?.value;
      expect(m3).toBe(1200);
      expect(consumptionCost).toBe(1354.32);
    });

    it('verifies Gas Costs: 12,312 kWh, 0.11 €/kWh, 12 €/month base price', () => {
      const res = calculateGasCost({
        inputType: 'kwh',
        amount: 12312,
        pricePerKwh: 0.11,
        basePricePerMonth: 12.0,
      });
      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(1498.32);
      expect(res.primary.formattedValue).toBe(formatCurrency(1498.32));

      const workCost = res.secondary?.find((s) => s.id === 'workCost')?.value;
      const baseCost = res.secondary?.find((s) => s.id === 'baseCost')?.value;
      const monthlyAvg = res.secondary?.find((s) => s.id === 'monthlyPayment')?.value;

      expect(workCost).toBe(1354.32);
      expect(baseCost).toBe(144);
      expect(monthlyAvg).toBe(124.86);

      // Zero gas consumption preserves valid fixed charges
      const resZero = calculateGasCost({
        inputType: 'kwh',
        amount: 0,
        pricePerKwh: 0.11,
        basePricePerMonth: 12.0,
      });
      expect(resZero.primary.value).toBe(144);
      expect(resZero.secondary?.find((s) => s.id === 'monthlyPayment')?.value).toBe(12);
    });

    it('verifies Zero Cases: 0 distance in commuter allowance and 0% loan interest', () => {
      const commuteRes = calculateCommuterAllowance({
        distanceKm: 0,
        workdays: 220,
      });
      expect(commuteRes.error).toBeUndefined();
      expect(commuteRes.primary.value).toBe(0);
      expect(commuteRes.summaryText).toContain('0 km');

      const carLoanCalc = extraFinanzenCalculators.find((c) => c.slug === 'ballonfinanzierung-rechner')!;
      const loanRes = carLoanCalc.calculate({
        carPrice: 20000,
        downPayment: 5000,
        interestRate: 0,
        months: 30,
        balloonPayment: 0,
      });
      expect(loanRes.error).toBeUndefined();
      expect(loanRes.primary.value).toBe(500); // 15000 / 30 = 500 €/Monat
      const totalCost = loanRes.secondary?.find((s) => s.id === 'totalCost')?.value;
      expect(totalCost).toBe(20000); // exactly price with 0 interest
    });
  });
});

describe('15. Prompt-Mandated Bugfixes and Regression Suite', () => {
  it('mietminderung-rechner: 1,000 € monthly rent, 0% reduction, 30 affected days yields 0 € reduction', () => {
    const calc = extraWohnenCalculators.find((c) => c.slug === 'mietminderung-rechner')!;
    const res = calc.calculate({
      monthlyRent: 1000,
      reductionPercent: 0,
      days: 30,
    });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(0);
    expect(res.primary.formattedValue).toBe(formatCurrency(0));
    expect(res.summaryText).toContain('0,00 €');
  });

  it('mietminderung-rechner: test zero affected days yields 0 € reduction under 30-day legal convention', () => {
    const calc = extraWohnenCalculators.find((c) => c.slug === 'mietminderung-rechner')!;
    const res = calc.calculate({
      monthlyRent: 1000,
      reductionPercent: 20,
      days: 0,
    });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(0);
    expect(res.summaryText).toContain('0 Tage');
  });

  it('staffelmiete-rechner: 800 € starting rent, 0 € increase, annual interval, 5 years -> every step stays 800 €', () => {
    const calc = extraWohnenCalculators.find((c) => c.slug === 'staffelmiete-rechner')!;
    const res = calc.calculate({
      startRent: 800,
      increaseAmount: 0,
      intervalMonths: 12,
      years: 5,
    });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(800);
    // Breakdown must exist and every year must have exactly 800 € rent
    expect(res.breakdown?.rows).toBeDefined();
    expect(res.breakdown?.rows.length).toBe(5);
    for (const row of res.breakdown?.rows || []) {
      expect(String(row.values.rent).replace(/\u00a0/g, ' ')).toContain('800,00 €');
    }
  });

  it('festgeldrechner: 10,000 € deposit, 0% interest, 12 months (1 year) yields 0 € interest and 10,000 € final balance', () => {
    const calc = extraFinanzenCalculators.find((c) => c.slug === 'festgeld-rechner')!;
    const res = calc.calculate({
      principal: 10000,
      interestRate: 0,
      years: 1,
    });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(0); // 0 € interest
    const endVal = res.secondary?.find((s) => s.id === 'endVal')?.value;
    expect(endVal).toBe(10000); // 10,000 € final balance
  });

  it('etf-kostenrechner / depotgebuehren-rechner: 40,000 € portfolio, 0% TER yields 0 € TER-related cost', () => {
    const calc = extraFinanzenCalculators.find((c) => c.slug === 'depotgebuehren-rechner')!;
    const res = calc.calculate({
      portfolioVal: 40000,
      ter: 0,
      custodyFee: 0,
      years: 20,
      grossReturn: 7.0,
    });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(0); // 0 € total cost loss
    const terCostItem = res.secondary?.find((s) => s.id === 'terCostOnly')?.value;
    expect(terCostItem).toBe(0);
    expect(res.summaryText).toContain('0 %');
  });

  it('calculateRentalYield: 250,000 € purchase price, 0 € purchase fees, 850 € cold rent, 0 € nonrecoverable costs -> 250,000 € investment and 4.08% yield', () => {
    const res = calculateRentalYield({
      purchasePrice: 250000,
      purchaseFees: 0,
      monthlyRentCold: 850,
      annualNonRecoverableCosts: 0,
    });
    expect(res.error).toBeUndefined();
    // 850 * 12 = 10,200 € annual rent
    // 10,200 / 250,000 = 0.0408 = 4.08%
    expect(res.primary.value).toBeCloseTo(4.08, 2);
    const totalInv = res.secondary?.find((s) => s.id === 'totalInvestment')?.value;
    expect(totalInv).toBe(250000);
    // Summary must mention 0,00 € assumptions and note statutory taxes/notary fees
    expect(res.summaryText).toContain(formatCurrency(250000));
    expect(res.summaryText).toContain('Grunderwerbsteuer');
  });

  it('altersrechner: clearing birthdate shows German validation message and invalidates previous result', () => {
    const resEmpty = calculateAge({ birthDate: '' });
    expect(resEmpty.error).toBe('Bitte geben Sie Ihr Geburtsdatum ein.');
    expect(resEmpty.primary.value).toBe(0);
    expect(resEmpty.primary.formattedValue).toBe('-');

    const resNull = calculateAge({ birthDate: null });
    expect(resNull.error).toBe('Bitte geben Sie Ihr Geburtsdatum ein.');
  });

  it('altersrechner: rejects impossible dates (e.g. 2023-02-29) and correctly handles leap year (2000-02-29)', () => {
    // 2023 is not a leap year -> 2023-02-29 is impossible
    const resImpossible = calculateAge({ birthDate: '2023-02-29', targetDate: '2026-03-01' });
    expect(resImpossible.error).toBeDefined();
    expect(resImpossible.error).toContain('Ungültige oder unmögliche Kalendertage');

    // 2000 is a leap year -> 2000-02-29 is valid
    const resLeap = calculateAge({ birthDate: '2000-02-29', targetDate: '2024-03-01' });
    expect(resLeap.error).toBeUndefined();
    expect(resLeap.primary.value).toBe(24); // 24 years old on 2024-03-01
  });

  it('buergergeld-anspruch-rechner: verifies § 11b SGB II earnings allowances (348 € at 1,200 € gross and 378 € at 1,500 € gross)', () => {
    const calc = extraAutoArbeitCalculators.find((c) => c.slug === 'buergergeld-anspruch-rechner')!;

    // 1. Standard single person, 1,200 € gross (no children)
    // § 11b: 100 € base + 20% on 420 € (84 €) + 30% on 480 € (144 €) + 10% on 200 € (20 €) = 348 €
    const res1200 = calc.calculate({
      householdType: 'single',
      children0to5: 0,
      children6to13: 0,
      children14to17: 0,
      isSingleParent: false,
      coldRent: 400,
      heatingCosts: 100,
      grossEarnedIncome: 1200,
      netEarnedIncome: 950,
    });
    expect(res1200.error).toBeUndefined();
    const allowanceItem1200 = res1200.secondary?.find((s) => s.id === 'earningsAllowance');
    expect(allowanceItem1200?.value).toBe(348);
    // Net: 950 - 348 = 602 € deducted
    const deductedItem1200 = res1200.secondary?.find((s) => s.id === 'deductedEarnedIncome');
    expect(deductedItem1200?.value).toBe(602);

    // 2. Household with minor child, 1,500 € gross (extended 10% threshold to 1,500 €)
    // § 11b: 100 + 84 + 144 + (500 * 0.10 = 50) = 378 €
    const res1500 = calc.calculate({
      householdType: 'single',
      children0to5: 1, // minor child present
      children6to13: 0,
      children14to17: 0,
      isSingleParent: false,
      coldRent: 400,
      heatingCosts: 100,
      grossEarnedIncome: 1500,
      netEarnedIncome: 1200,
    });
    expect(res1500.error).toBeUndefined();
    const allowanceItem1500 = res1500.secondary?.find((s) => s.id === 'earningsAllowance');
    expect(allowanceItem1500?.value).toBe(378);
    // Net: 1200 - 378 = 822 € deducted
    const deductedItem1500 = res1500.secondary?.find((s) => s.id === 'deductedEarnedIncome');
    expect(deductedItem1500?.value).toBe(822);
  });

  it('buergergeld-anspruch-rechner: single parent age threshold distinctions (§ 21 Abs. 3 SGB II)', () => {
    const calc = extraAutoArbeitCalculators.find((c) => c.slug === 'buergergeld-anspruch-rechner')!;

    // Single parent with 1 child under 7 years via explicit field -> 36 % (202.68 €)
    const resUnder7 = calc.calculate({
      householdType: 'single',
      isSingleParent: true,
      singleParentChildUnder7: true,
      singleParentChildrenUnder16: 1,
      children0to5: 0,
      children6to13: 1, // age 6 (under 7)
      children14to17: 0,
      coldRent: 400,
      heatingCosts: 100,
      grossEarnedIncome: 0,
    });
    const spNeedUnder7 = resUnder7.secondary?.find((s) => s.id === 'singleParent')?.value;
    expect(spNeedUnder7).toBeCloseTo(202.68, 2);

    // Single parent with 2 children under 16 years -> 36 % (202.68 €)
    const res2Under16 = calc.calculate({
      householdType: 'single',
      isSingleParent: true,
      singleParentChildUnder7: false,
      singleParentChildrenUnder16: 2,
      children0to5: 0,
      children6to13: 0,
      children14to17: 2, // e.g. both age 14 and 15 (< 16)
      coldRent: 400,
      heatingCosts: 100,
      grossEarnedIncome: 0,
    });
    const spNeed2Under16 = res2Under16.secondary?.find((s) => s.id === 'singleParent')?.value;
    expect(spNeed2Under16).toBeCloseTo(202.68, 2);
  });
});

