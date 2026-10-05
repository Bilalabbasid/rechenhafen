import { describe, it, expect } from 'vitest';
import { calculateAge, calculateDateDifference, calculateLeapYear, calculateWorkdays } from '@/lib/calculators/datumZeit';
import { calculatePercentage, calculatePercentChange, calculateRuleOfThree, calculatePythagoras, calculateGcdLcm } from '@/lib/calculators/mathematik';
import { calculateCompoundInterest, calculateSavingsTarget, calculateInflation } from '@/lib/calculators/finanzen';
import { calculateInstallmentLoan, calculateAnnuity, calculateSpecialRepayment } from '@/lib/calculators/kredit';
import { calculateFuelCost, calculateCommuterAllowance, calculateEVCharging } from '@/lib/calculators/auto';
import { calculateRentBurden, calculatePropertyPurchaseFees } from '@/lib/calculators/wohnen';
import { calculateElectricityCost, calculateLedSavings, calculateGasCost } from '@/lib/calculators/haushalt';
import { calculateHourlyWage, calculatePartTimeSalary, calculateVacationDays } from '@/lib/calculators/arbeit';
import { calculateBMI, calculateCalorieNeeds, calculateRunningPace } from '@/lib/calculators/gesundheit';
import { calculatePregnancyDueDate } from '@/lib/calculators/familie';
import { calculatePaintAmount, calculateFlooring } from '@/lib/calculators/bauen';
import { calculateCircle, calculateRectangle } from '@/lib/calculators/geometrie';
import { calculateLengthConversion, calculateTemperatureConversion } from '@/lib/calculators/einheiten';
import { calculatePortions, calculateBakingPan, calculateGramsToMl } from '@/lib/calculators/kochen';
import { calculateMargin, calculateVat, calculateBreakEven } from '@/lib/calculators/business';
import { calculateGradeAverage, calculateOhmsLaw } from '@/lib/calculators/statistik';
import { calculateRentalYield } from '@/lib/calculators/wohnen';
import { calculateRenteBruttoNetto } from '@/lib/calculators/steuernGehalt';
import { EXTRA_WOHNEN_HAUSHALT } from '@/data/calculators/extra/wohnenHaushalt';
import { EXTRA_FINANZEN_KREDIT } from '@/data/calculators/extra/finanzenKredit';
import { EXTRA_AUTO_ARBEIT } from '@/data/calculators/extra/autoArbeit';
import { EXTRA_BAUEN_GEOMETRIE } from '@/data/calculators/extra/bauenGeometrie';

describe('RechenHafen Calculation Engines', () => {
  describe('Datum & Zeit', () => {
    it('calculates age correctly', () => {
      const res = calculateAge({ birthDate: '2000-01-01', targetDate: '2026-01-01' });
      expect(res.primary.value).toBe(26);
      expect(res.error).toBeUndefined();
    });

    it('identifies leap years accurately', () => {
      expect(calculateLeapYear({ year: '2024' }).primary.value).toBe('Ja');
      expect(calculateLeapYear({ year: '2026' }).primary.value).toBe('Nein');
      expect(calculateLeapYear({ year: '1900' }).primary.value).toBe('Nein');
      expect(calculateLeapYear({ year: '2000' }).primary.value).toBe('Ja');
    });

    it('computes workdays excluding weekends', () => {
      // 2026-01-01 (Do) to 2026-01-07 (Mi) = 7 days, 5 workdays (without holiday deduction), 2 weekend days
      const res = calculateWorkdays({ startDate: '2026-01-01', endDate: '2026-01-07', workweek: 'mo-fr', excludeHolidays: false });
      expect(res.primary.value).toBe(5);
    });
  });

  describe('Mathematik & Prozent', () => {
    it('calculates percentage of base correctly', () => {
      const res = calculatePercentage({ percent: 15, base: 200 });
      expect(res.primary.value).toBe(30);
    });

    it('calculates percent change correctly', () => {
      const res = calculatePercentChange({ oldValue: 100, newValue: 125 });
      expect(res.primary.value).toBe(25);
    });

    it('calculates rule of three correctly', () => {
      const res = calculateRuleOfThree({ a1: 2, b1: 10, a2: 5, type: 'direct' });
      expect(res.primary.value).toBe(25);
    });

    it('calculates pythagoras theorem', () => {
      const res = calculatePythagoras({ sideA: 3, sideB: 4, target: 'c' });
      expect(res.primary.value).toBe(5);
    });

    it('finds gcd and lcm', () => {
      const res = calculateGcdLcm({ num1: 12, num2: 18 });
      expect(res.primary.value).toBe(6);
    });
  });

  describe('Finanzen & Sparen', () => {
    it('calculates compound interest deterministically', () => {
      const res = calculateCompoundInterest({
        initialAmount: 10000,
        monthlyContribution: 100,
        annualRate: 5,
        years: 10,
        compoundFreq: 12,
      });
      expect(res.primary.value).toBeGreaterThan(25000);
      expect(res.error).toBeUndefined();
    });

    it('calculates savings target accurately', () => {
      const res = calculateSavingsTarget({
        targetAmount: 50000,
        initialAmount: 10000,
        annualRate: 4,
        years: 5,
      });
      expect(res.primary.value).toBeGreaterThan(0);
      expect(res.error).toBeUndefined();
    });
  });

  describe('Kredite & Finanzierung', () => {
    it('calculates installment loan monthly payment', () => {
      const res = calculateInstallmentLoan({
        loanAmount: 10000,
        annualInterest: 5,
        termMonths: 48,
      });
      expect(res.primary.value).toBeCloseTo(230.29, 1);
    });

    it('calculates mortgage annuity', () => {
      const res = calculateAnnuity({
        loanAmount: 200000,
        annualInterest: 3.5,
        initialRepayment: 2.0,
        fixedYears: 10,
      });
      // 200.000 * 5.5% / 12 = 916.67
      expect(res.primary.value).toBeCloseTo(916.67, 1);
    });

    it('calculates maximum loan affordability from household budget', () => {
      const maximalKredit = EXTRA_FINANZEN_KREDIT.find((c) => c.slug === 'maximaler-kredit-rechner');
      const res = maximalKredit?.calculate({
        netIncome: 3500,
        fixedExpenses: 1600,
        existingLoans: 0,
        safetyBuffer: 200,
        interestRate: 3.5,
        termYears: 25,
        equity: 30000,
      });
      expect(res?.primary.value).toBeGreaterThan(300000);
      const availableRate = res?.secondary?.find((s) => s.id === 'availableRate');
      expect(availableRate?.value).toBe(1700);
    });
  });

  describe('Auto & Mobilität', () => {
    it('calculates fuel costs per trip and km', () => {
      const res = calculateFuelCost({
        distance: 100,
        consumption: 7.0,
        pricePerLiter: 1.80,
        tripsCount: 1,
      });
      expect(res.primary.value).toBeCloseTo(12.60, 2);
    });

    it('applies German 2026 commuter allowance tiers', () => {
      // 25 km: First 20 km @ 0.30, next 5 km @ 0.38 = 6.00 + 1.90 = 7.90 per day
      // 220 workdays = 1738.00 €
      const res = calculateCommuterAllowance({ distanceKm: 25, workdays: 220 });
      expect(res.primary.value).toBeCloseTo(1738.0, 1);
    });
  });

  describe('Wohnen, Energie & Haushalt', () => {
    it('calculates rent burden accurately', () => {
      const res = calculateRentBurden({ netIncome: 3000, warmRent: 900 });
      expect(res.primary.value).toBe(30);
    });

    it('calculates electricity costs for household devices', () => {
      const res = calculateElectricityCost({ watts: 1000, hoursPerDay: 1, pricePerKwh: 0.40 });
      // 1 kWh/day * 365 = 365 kWh * 0.40 = 146 €
      expect(res.primary.value).toBeCloseTo(146, 1);
    });

    it('calculates gas costs with kWh and meter reading modes', () => {
      const resKwh = calculateGasCost({ inputType: 'kwh', annualKwh: 12000, pricePerKwh: 0.10, basePrice: 10, basePricePeriod: 'monthly' });
      expect(resKwh.primary.value).toBe(1320);

      const resM3 = calculateGasCost({ inputType: 'm3', meterOld: 10000, meterNew: 11400, calorificValue: 10.3, stateFactor: 0.95, pricePerKwh: 0.11, basePrice: 12, basePricePeriod: 'monthly' });
      expect(resM3.primary.value).toBeGreaterThan(1600);
    });

    it('calculates warm rent from cold rent, operating and heating components', () => {
      const warmmiete = EXTRA_WOHNEN_HAUSHALT.find((c) => c.slug === 'warmmiete-zu-kaltmiete-rechner');
      const res = warmmiete?.calculate({
        calculationMode: 'warm_from_components',
        coldRentInput: 850,
        operatingCosts: 170,
        heatingCosts: 130,
        livingAreaMode1: 75,
      });
      expect(res?.primary.value).toBe(1150);
      expect(res?.primary.label).toContain('Warmmiete');
    });
  });

  describe('Arbeit & Gehalt', () => {
    it('calculates hourly wage using official 13-week formula', () => {
      // 40h/week -> 40 * 13 / 3 = 173.333 hours/month
      // 3000 / 173.333 = 17.3076 €/h
      const res = calculateHourlyWage({ monthlySalary: 3000, weeklyHours: 40 });
      expect(res.primary.value).toBeCloseTo(17.31, 1);
    });

    it('calculates vacation entitlement according to § 3 BUrlG', () => {
      // 30 days full-time (5 days) -> 3 days/week = 30 / 5 * 3 = 18 days
      const res = calculateVacationDays({ standardDays: 30, workdaysPerWeek: 3, standardWeekDays: 5 });
      expect(res.primary.value).toBe(18);
    });
  });

  describe('Gesundheit & Fitness', () => {
    it('calculates BMI and classification correctly', () => {
      // 70 kg, 175 cm -> 70 / 1.75^2 = 22.86 (Normalgewicht)
      const res = calculateBMI({ weight: 70, height: 175 });
      expect(res.primary.value).toBeCloseTo(22.86, 1);
    });
  });

  describe('Bauen, Renovieren & Geometrie', () => {
    it('calculates circle area and circumference', () => {
      const res = calculateCircle({ radius: 10 });
      expect(res.primary.value).toBeCloseTo(314.16, 1);
    });

    it('calculates rectangular room area and perimeter', () => {
      const res = calculateRectangle({ lengthA: 5, widthB: 4 });
      expect(res.primary.value).toBe(20);
    });

    it('calculates concrete and stone count for Schalungssteine', () => {
      const schalungssteine = EXTRA_BAUEN_GEOMETRIE.find((c) => c.slug === 'schalungssteine-rechner');
      const res = schalungssteine?.calculate({
        wallLength: 8,
        wallHeight: 1.5,
        fillMode: 'preset_delfing24',
        stoneReserve: 5,
        concreteReserve: 5,
        openingsArea: 0,
      });
      expect(res?.primary.value).toBe(101);
      const concreteSec = res?.secondary?.find((s) => s.id === 'concreteM3');
      expect(concreteSec?.value).toBeCloseTo(1.638, 3);
    });
  });

  describe('Business & Finanzen', () => {
    it('calculates margin and markup', () => {
      // Buy 50, Sell 100 -> Margin 50%, Markup 100%
      const res = calculateMargin({ purchasePrice: 50, sellingPrice: 100 });
      expect(res.primary.value).toBe(50);
    });

    it('calculates German 19% VAT from net to gross', () => {
      const res = calculateVat({ amount: 100, vatRate: 19, direction: 'netToGross' });
      expect(res.primary.value).toBeCloseTo(119.00, 2);
    });

    it('calculates break even units', () => {
      // Fixed 1000, Price 20, Var 10 -> CM = 10 -> BreakEven = 100 units
      const res = calculateBreakEven({ fixedCosts: 1000, pricePerUnit: 20, variableCostPerUnit: 10 });
      expect(res.primary.value).toBe(100);
    });
  });

  describe('Kochen & Zutaten', () => {
    it('accounts for ingredient density in grams to ml', () => {
      // Flour density 0.53 -> 100g flour is ~188 ml, NOT 100 ml!
      const res = calculateGramsToMl({ grams: 100, ingredient: 'flour' });
      expect(res.primary.value).toBeCloseTo(188.68, 1);
    });
  });

  describe('Statistik & Wissenschaft', () => {
    it('calculates German grade average', () => {
      const res = calculateGradeAverage({ grades: '1; 2; 3' });
      expect(res.primary.value).toBe(2.0);
    });

    it('calculates weighted ECTS grade average', () => {
      const res = calculateGradeAverage({
        calculationMode: 'weighted',
        weightedGrades: '1,0 * 5; 2,0 * 10',
      });
      expect(res.primary.value).toBeCloseTo(1.67, 2);
    });

    it('calculates Ohms law voltage from current and resistance', () => {
      const res = calculateOhmsLaw({ current: 2, resistance: 50, target: 'voltage' });
      expect(res.primary.value).toBe(100);
    });
  });

  describe('Statutory & Hidden-Default Regression Checks', () => {
    it('handles leap day birthdates and rejects invalid dates in calculateAge', () => {
      const leapAge = calculateAge({ birthDate: '2000-02-29', targetDate: '2026-02-28' });
      expect(leapAge.primary.value).toBe(25);
      const invalidAge = calculateAge({ birthDate: '2023-02-29', targetDate: '2026-01-01' });
      expect(invalidAge.error).toBeDefined();
    });

    it('calculates rental yield preserving zero ancillary costs', () => {
      const res = calculateRentalYield({
        purchasePrice: 250000,
        purchaseFees: 0,
        monthlyRentCold: 850,
        annualNonRecoverableCosts: 0,
      });
      expect(res.primary.value).toBe(4.08);
      const totalInv = res.secondary?.find((s) => s.id === 'totalInvestment');
      expect(totalInv?.value).toBe(250000);
    });

    it('preserves valid zero in Mietminderung and Staffelmiete', () => {
      const mietminderung = EXTRA_WOHNEN_HAUSHALT.find((c) => c.slug === 'mietminderung-rechner');
      const mmRes = mietminderung?.calculate({ warmRent: 950, reductionPercent: 0, days: 10 });
      expect(mmRes?.primary.value).toBe(0);

      const staffelmiete = EXTRA_WOHNEN_HAUSHALT.find((c) => c.slug === 'staffelmiete-rechner');
      const smRes = staffelmiete?.calculate({ startRent: 800, increaseAmount: 0, intervalMonths: 12, totalYears: 5 });
      expect(smRes?.primary.value).toBe(800);
      expect(smRes?.breakdown?.rows).toHaveLength(5);
    });

    it('preserves 0% in Festgeld and Depotgebühren', () => {
      const festgeld = EXTRA_FINANZEN_KREDIT.find((c) => c.slug === 'festgeld-rechner');
      const fgRes = festgeld?.calculate({ depositAmount: 10000, interestRate: 0, termMonths: 12 });
      expect(fgRes?.primary.value).toBe(0);

      const depot = EXTRA_FINANZEN_KREDIT.find((c) => c.slug === 'depotgebuehren-rechner');
      const dpRes = depot?.calculate({ portfolioValue: 40000, custodyFee: 0, ter: 0, tradesPerYear: 0, orderVolume: 0 });
      expect(dpRes?.primary.value).toBe(0);
    });

    it('calculates 2026 pension deductions accurately', () => {
      const res = calculateRenteBruttoNetto({
        grossPension: 1800,
        careInsuranceOption: 'childless',
        additionalHealthRate: 2.9,
        retirementYear: '2026',
      });
      const kv = res.secondary?.find((s) => s.id === 'kvdr');
      const pv = res.secondary?.find((s) => s.id === 'pvdr');
      const payout = res.secondary?.find((s) => s.id === 'payoutAfterSocial');
      expect(kv?.value).toBe(157.50);
      expect(pv?.value).toBe(75.60);
      expect(payout?.value).toBe(1566.90);
    });

    it('calculates Bürgergeld § 11b SGB II allowances', () => {
      const buergergeld = EXTRA_AUTO_ARBEIT.find((c) => c.slug === 'buergergeld-anspruch-rechner');
      const bgRes = buergergeld?.calculate({
        householdType: 'single',
        coldRent: 400,
        heatingCosts: 100,
        grossEarnedIncome: 1200,
        netEarnedIncome: 950,
      });
      const allowance = bgRes?.secondary?.find((s) => s.id === 'earningsAllowance');
      expect(allowance?.value).toBe(348);
    });
  });
});
