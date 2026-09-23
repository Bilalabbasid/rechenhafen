import { describe, it, expect } from 'vitest';
import { calculateWorkdaysAndHolidays, calculateDateDifference } from '@/lib/calculators/datumZeit';
import { calculateFuelCost, calculateCommuterAllowance, calculateTravelTime } from '@/lib/calculators/auto';
import { calculateCompoundInterest } from '@/lib/calculators/finanzen';
import { calculateInstallmentLoan } from '@/lib/calculators/kredit';
import { calculateBMI, calculateCalorieNeeds } from '@/lib/calculators/gesundheit';
import { calculatePropertyPurchaseFees } from '@/lib/calculators/wohnen';
import { calculatePaintAmount } from '@/lib/calculators/bauen';
import { calculateElectricityCost } from '@/lib/calculators/haushalt';
import { calculatePercentage } from '@/lib/calculators/mathematik';

describe('Calculators Meaningful Options Test Suite', () => {
  // 1. Werktage & Arbeitstage
  describe('Werktage-Rechner Options', () => {
    it('calculates Mo-Fr Arbeitstage vs Mo-Sa Werktage for Feb 2026', () => {
      // February 2026 (28 days, starts on Sunday Feb 1, ends Saturday Feb 28)
      // Sundays: Feb 1, 8, 15, 22 (4 Sundays)
      // Saturdays: Feb 7, 14, 21, 28 (4 Saturdays)
      // Mo-Fr days = 28 - 4 - 4 = 20 Arbeitstage
      // Mo-Sa days = 28 - 4 = 24 Werktage
      const resMoFr = calculateWorkdaysAndHolidays({
        startDate: '2026-02-01',
        endDate: '2026-02-28',
        workweek: 'mo-fr',
        excludeHolidays: false,
      });
      expect(resMoFr.primary.value).toBe(20);
      expect(resMoFr.primary.label).toContain('Arbeitstage');

      const resMoSa = calculateWorkdaysAndHolidays({
        startDate: '2026-02-01',
        endDate: '2026-02-28',
        workweek: 'mo-sa',
        excludeHolidays: false,
      });
      expect(resMoSa.primary.value).toBe(24);
      expect(resMoSa.primary.label).toContain('Werktage');
    });

    it('prevents double-subtraction when a holiday falls on a weekend', () => {
      // 03.10.2026 (Tag der Deutschen Einheit) falls on Saturday
      // Period: 2026-10-01 to 2026-10-07 (7 days: Thu, Fri, Sat, Sun, Mon, Tue, Wed)
      // Weekdays: Thu, Fri, Mon, Tue, Wed = 5 days
      // Under Mo-Fr schedule: Saturday is ALREADY free. Holiday on Sat must NOT subtract another day.
      const resMoFr = calculateWorkdaysAndHolidays({
        startDate: '2026-10-01',
        endDate: '2026-10-07',
        workweek: 'mo-fr',
        excludeHolidays: true,
        federalState: 'BY',
      });
      expect(resMoFr.primary.value).toBe(5);

      // Under Mo-Sa schedule: Saturday is normally a Werktag, so holiday DOES subtract it.
      const resMoSa = calculateWorkdaysAndHolidays({
        startDate: '2026-10-01',
        endDate: '2026-10-07',
        workweek: 'mo-sa',
        excludeHolidays: true,
        federalState: 'BY',
      });
      // 7 days - 1 Sunday - 1 Holiday on Saturday = 5 Werktage (instead of 6)
      expect(resMoSa.primary.value).toBe(5);
    });

    it('handles boundary date inclusion correctly', () => {
      // 2026-02-02 (Mon) to 2026-02-06 (Fri) = 5 days
      const resBoth = calculateWorkdaysAndHolidays({
        startDate: '2026-02-02',
        endDate: '2026-02-06',
        workweek: 'mo-fr',
        includeBoundary: 'both',
      });
      expect(resBoth.primary.value).toBe(5);

      const resStartOnly = calculateWorkdaysAndHolidays({
        startDate: '2026-02-02',
        endDate: '2026-02-06',
        workweek: 'mo-fr',
        includeBoundary: 'startOnly',
      });
      expect(resStartOnly.primary.value).toBe(4);

      const resNeither = calculateWorkdaysAndHolidays({
        startDate: '2026-02-02',
        endDate: '2026-02-06',
        workweek: 'mo-fr',
        includeBoundary: 'neither',
      });
      expect(resNeither.primary.value).toBe(3);
    });
  });

  // 2. Date Difference Options
  describe('Datumsdifferenz Options', () => {
    it('outputs date difference in selected units', () => {
      const resDays = calculateDateDifference({
        startDate: '2026-01-01',
        endDate: '2026-01-15',
        outputUnit: 'days',
      });
      expect(resDays.primary.value).toBe(14);

      const resWeeks = calculateDateDifference({
        startDate: '2026-01-01',
        endDate: '2026-01-15',
        outputUnit: 'weeks',
      });
      expect(resWeeks.primary.value).toBe(2);

      const resDetailed = calculateDateDifference({
        startDate: '2026-01-01',
        endDate: '2027-02-15',
        outputUnit: 'detailed',
      });
      expect(resDetailed.primary.formattedValue).toContain('Jahr');
    });
  });

  // 3. Fuel Cost & Commuter Allowance
  describe('Mobility Calculators Options', () => {
    it('calculates single trip vs roundtrip and passenger splitting', () => {
      // 100 km, 6 l/100km, 2 €/l => 6 liters, 12 € for single trip
      const singleRes = calculateFuelCost({
        distance: 100,
        consumption: 6,
        pricePerLiter: 2,
        tripType: 'single',
        passengers: 1,
      });
      expect(singleRes.primary.value).toBe(12);

      // Roundtrip => 200 km, 12 liters, 24 €
      const roundRes = calculateFuelCost({
        distance: 100,
        consumption: 6,
        pricePerLiter: 2,
        tripType: 'roundtrip',
        passengers: 1,
      });
      expect(roundRes.primary.value).toBe(24);

      // 4 passengers => 6 € per person
      const carpoolRes = calculateFuelCost({
        distance: 100,
        consumption: 6,
        pricePerLiter: 2,
        tripType: 'roundtrip',
        passengers: 4,
      });
      expect(carpoolRes.primary.value).toBe(24);
      const perPerson = carpoolRes.secondary?.find(s => s.id === 'costPerPerson');
      expect(perPerson?.value).toBe(6);
    });

    it('calculates commuter allowance with car (uncapped) vs public transport (4.500 € cap)', () => {
      // 80 km single trip, 220 workdays
      // Per day: 20 * 0.30 + 60 * 0.38 = 6.00 + 22.80 = 28.80 €
      // Total year: 28.80 * 220 = 6.336 €
      const carRes = calculateCommuterAllowance({
        distanceKm: 80,
        workdays: 220,
        transportMode: 'car',
      });
      expect(carRes.primary.value).toBe(6336);

      // Public transport capped at 4.500 €
      const publicRes = calculateCommuterAllowance({
        distanceKm: 80,
        workdays: 220,
        transportMode: 'public',
      });
      expect(publicRes.primary.value).toBe(4500);

      // Home office days deduction
      const homeOfficeRes = calculateCommuterAllowance({
        distanceKm: 80,
        workdays: 220,
        homeOfficeDays: 20, // 200 days * 28.80 = 5.760 €
        transportMode: 'car',
      });
      expect(homeOfficeRes.primary.value).toBe(5760);
    });
  });

  // 4. Financial Calculators: Compound Interest & Dynamic Savings
  describe('Zinseszins & Sparrechner Options', () => {
    it('handles compounding intervals (monthly vs yearly)', () => {
      // 10.000 € at 10% for 1 year, no contributions
      // Yearly compounding: 10.000 * 1.10 = 11.000 €
      const yearlyRes = calculateCompoundInterest({
        initialAmount: 10000,
        monthlyContribution: 0,
        annualRate: 10,
        years: 1,
        compoundFrequency: '1',
      });
      expect(Math.round(yearlyRes.primary.value as number)).toBe(11000);

      // Monthly compounding: 10.000 * (1 + 0.10/12)^12 = 11.047,13 €
      const monthlyRes = calculateCompoundInterest({
        initialAmount: 10000,
        monthlyContribution: 0,
        annualRate: 10,
        years: 1,
        compoundFrequency: '12',
      });
      expect(Math.round(monthlyRes.primary.value as number)).toBe(11047);
    });

    it('handles deposit timing (vorschüssig start vs nachschüssig end)', () => {
      // 100 € monthly, 6% annual rate, 1 year
      const endRes = calculateCompoundInterest({
        initialAmount: 0,
        monthlyContribution: 100,
        annualRate: 6,
        years: 1,
        depositTiming: 'end',
      });

      const startRes = calculateCompoundInterest({
        initialAmount: 0,
        monthlyContribution: 100,
        annualRate: 6,
        years: 1,
        depositTiming: 'start',
      });

      // Vorschüssig produces higher end capital than nachschüssig
      expect(startRes.primary.value as number).toBeGreaterThan(endRes.primary.value as number);
    });
  });

  // 5. Loan Calculator Options
  describe('Kreditrechner Options', () => {
    it('supports term in months and term in years', () => {
      const resMonths = calculateInstallmentLoan({
        loanAmount: 10000,
        annualInterest: 5,
        term: 60,
        termUnit: 'months',
      });

      const resYears = calculateInstallmentLoan({
        loanAmount: 10000,
        annualInterest: 5,
        term: 5,
        termUnit: 'years',
      });

      expect(resMonths.primary.value).toBeCloseTo(resYears.primary.value as number, 2);
    });

    it('accelerates loan repayment with Sondertilgung', () => {
      const normalLoan = calculateInstallmentLoan({
        loanAmount: 20000,
        annualInterest: 5,
        term: 60,
        termUnit: 'months',
        sondertilgung: 0,
      });

      const loanWithExtra = calculateInstallmentLoan({
        loanAmount: 20000,
        annualInterest: 5,
        term: 60,
        termUnit: 'months',
        sondertilgung: 3000,
      });

      // Sondertilgung reduces total interest paid and saves months
      const interestNormal = normalLoan.secondary?.find(s => s.id === 'totalInterest')?.value as number;
      const interestWithExtra = loanWithExtra.secondary?.find(s => s.id === 'totalInterest')?.value as number;
      expect(interestWithExtra).toBeLessThan(interestNormal);

      const timeSaved = loanWithExtra.secondary?.find(s => s.id === 'timeSaved');
      expect(timeSaved?.value).toBeGreaterThan(0);
    });
  });

  // 6. Health: BMI & Calorie Needs
  describe('Gesundheits-Rechner Options', () => {
    it('calculates BMI in metric and imperial unit systems', () => {
      // 80 kg, 180 cm -> BMI ~ 24.69
      const metricRes = calculateBMI({
        weight: 80,
        height: 180,
        unitSystem: 'metric',
      });
      expect(metricRes.primary.value as number).toBeCloseTo(24.69, 1);

      // Imperial: 176.37 lbs, 70.866 inches (~80 kg, ~180 cm)
      const imperialRes = calculateBMI({
        weight: 176.37,
        height: 70.866,
        unitSystem: 'imperial',
      });
      expect(imperialRes.primary.value as number).toBeCloseTo(24.69, 1);
    });

    it('adapts calorie needs according to formula and personal goal', () => {
      const maintainRes = calculateCalorieNeeds({
        gender: 'male',
        weight: 80,
        height: 180,
        age: 30,
        activityLevel: '1.4',
        goal: 'maintain',
        formula: 'mifflin',
      });

      const loseRes = calculateCalorieNeeds({
        gender: 'male',
        weight: 80,
        height: 180,
        age: 30,
        activityLevel: '1.4',
        goal: 'lose',
        formula: 'mifflin',
      });

      // Lose goal subtracts 500 kcal deficit
      expect((maintainRes.primary.value as number) - (loseRes.primary.value as number)).toBe(500);

      // Harris-Benedict formula works
      const hbRes = calculateCalorieNeeds({
        gender: 'male',
        weight: 80,
        height: 180,
        age: 30,
        activityLevel: '1.4',
        formula: 'harris_benedict',
      });
      expect(hbRes.primary.value).toBeGreaterThan(1500);
    });
  });

  // 7. Housing: Kaufnebenkosten by Bundesland & Realtor
  describe('Kaufnebenkosten-Rechner Options', () => {
    it('applies correct statutory Grunderwerbsteuer per Bundesland', () => {
      // 400.000 € purchase price
      // Bayern (3.5% tax)
      const byRes = calculatePropertyPurchaseFees({
        purchasePrice: 400000,
        federalState: 'BY',
        realtorOption: 'none',
        notaryRate: 1.5,
        landRegistryRate: 0.5,
      });
      // 3.5% + 1.5% + 0.5% = 5.5% = 22.000 €
      expect(byRes.primary.value).toBe(22000);

      // NRW (6.5% tax)
      const nrwRes = calculatePropertyPurchaseFees({
        purchasePrice: 400000,
        federalState: 'NW',
        realtorOption: 'none',
        notaryRate: 1.5,
        landRegistryRate: 0.5,
      });
      // 6.5% + 1.5% + 0.5% = 8.5% = 34.000 €
      expect(nrwRes.primary.value).toBe(34000);
    });
  });

  // 8. Construction: Farbrechner Options
  describe('Farbmengen-Rechner Options', () => {
    it('includes ceiling and applies waste reserve percentage', () => {
      // Room: 5m x 4m x 2.5m = Wall area 45m²
      // Ceiling area = 20m²
      // Deduct openings = 5m²
      // Net walls only = 40m². 2 coats = 80m². 7 m²/l = 11.43 l * 1.0 (0% reserve)
      const wallsOnly = calculatePaintAmount({
        roomLength: 5,
        roomWidth: 4,
        roomHeight: 2.5,
        includeCeiling: 'no',
        deductOpenings: 'yes',
        openingDeductionSqm: 5,
        coats: 2,
        coveragePerLiter: 7,
        wasteReservePercent: '0',
      });
      expect(wallsOnly.primary.value as number).toBeCloseTo(11.43, 1);

      // With ceiling (40 + 20 = 60m²). 2 coats = 120m². / 7 = 17.14 l
      const withCeiling = calculatePaintAmount({
        roomLength: 5,
        roomWidth: 4,
        roomHeight: 2.5,
        includeCeiling: 'yes',
        deductOpenings: 'yes',
        openingDeductionSqm: 5,
        coats: 2,
        coveragePerLiter: 7,
        wasteReservePercent: '0',
      });
      expect(withCeiling.primary.value as number).toBeCloseTo(17.14, 1);
    });
  });

  // 9. Household: Electricity Usage Time Units
  describe('Stromkostenrechner Options', () => {
    it('scales accurately between hours/day, minutes/day, and hours/week', () => {
      // 100 Watt, 0.40 €/kWh
      // 1 hour per day = 36.5 kWh/year = 14.60 €/year
      const perDayRes = calculateElectricityCost({
        watts: 100,
        usageTime: 1,
        usageTimeUnit: 'hoursPerDay',
        pricePerKwh: 0.40,
      });
      expect(perDayRes.primary.value as number).toBeCloseTo(14.60, 2);

      // 60 minutes per day = same 14.60 €/year
      const minPerDayRes = calculateElectricityCost({
        watts: 100,
        usageTime: 60,
        usageTimeUnit: 'minutesPerDay',
        pricePerKwh: 0.40,
      });
      expect(minPerDayRes.primary.value as number).toBeCloseTo(14.60, 2);

      // 7 hours per week = same 14.60 €/year
      const perWeekRes = calculateElectricityCost({
        watts: 100,
        usageTime: 7,
        usageTimeUnit: 'hoursPerWeek',
        pricePerKwh: 0.40,
      });
      expect(perWeekRes.primary.value as number).toBeCloseTo(14.60, 2);
    });
  });

  // 10. Mathematics: Percentage Modes
  describe('Prozentrechner Modes', () => {
    it('supports partOf, increase, decrease, and shareOf modes', () => {
      // partOf: 19% of 200 = 38
      const partOf = calculatePercentage({
        calculationMode: 'partOf',
        percent: 19,
        base: 200,
      });
      expect(partOf.primary.value).toBe(38);

      // increase: 200 + 19% = 238
      const increase = calculatePercentage({
        calculationMode: 'increase',
        percent: 19,
        base: 200,
      });
      expect(increase.primary.value).toBe(238);

      // decrease: 200 - 19% = 162
      const decrease = calculatePercentage({
        calculationMode: 'decrease',
        percent: 19,
        base: 200,
      });
      expect(decrease.primary.value).toBe(162);

      // shareOf: 50 is what percent of 200? = 25%
      const shareOf = calculatePercentage({
        calculationMode: 'shareOf',
        percent: 50,
        base: 200,
      });
      expect(shareOf.primary.value).toBe(25);
    });
  });
});
