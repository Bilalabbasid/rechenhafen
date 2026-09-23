import { describe, it, expect } from 'vitest';
import {
  computeEStSingle,
  computeMarginalTaxRate,
  computeSolZ,
  calculateEinkommensteuer,
  calculateBruttoNetto,
  calculateNettoBrutto,
  calculateGrenzsteuersatz,
  calculateSolidaritaetszuschlag,
  calculateKirchensteuer,
  calculateSozialabgaben,
  calculateArbeitgeberkosten,
  calculateMinijob,
  calculateMidijob,
  calculateBonusNetto,
  calculateAbfindung,
  calculateRenteBruttoNetto,
  calculateMwSt,
} from '@/lib/calculators/steuernGehalt';
import { getTaxConfig, TAX_CONFIG_2025, TAX_CONFIG_2026 } from '@/data/regulated/tax';

describe('Steuern & Gehalt — German Statutory Tax & Payroll Engine', () => {
  describe('1. Einkommensteuer § 32a EStG Statutory Formulas', () => {
    it('returns 0 € tax under the Grundfreibetrag in 2025 and 2026', () => {
      // 2025: Grundfreibetrag 12.096 €
      expect(computeEStSingle(12096, TAX_CONFIG_2025)).toBe(0);
      expect(computeEStSingle(10000, TAX_CONFIG_2025)).toBe(0);
      expect(computeEStSingle(0, TAX_CONFIG_2025)).toBe(0);

      // 2026: Grundfreibetrag 12.348 €
      expect(computeEStSingle(12348, TAX_CONFIG_2026)).toBe(0);
      expect(computeEStSingle(11000, TAX_CONFIG_2026)).toBe(0);
    });

    it('calculates Zone 2 and Zone 3 progressive tax accurately for 2026', () => {
      // Zone 2: 15.000 € (zwischen 12.349 € und 17.799 €)
      const est15k = computeEStSingle(15000, TAX_CONFIG_2026);
      expect(est15k).toBeGreaterThan(0);
      expect(est15k).toBeLessThan(1000);

      // Zone 3: 45.000 € (zwischen 17.800 € und 69.878 €)
      const est45k = computeEStSingle(45000, TAX_CONFIG_2026);
      expect(est45k).toBeGreaterThan(8000);
      expect(est45k).toBeLessThan(9000);
    });

    it('calculates Zone 4 Spitzensteuersatz (42 %) for 2026', () => {
      // 100.000 €: Formel 0,42 * 100.000 - 11.135,63 = 42.000 - 11.135,63 = 30.864,37 -> Math.floor = 30.864 €
      const est100k = computeEStSingle(100000, TAX_CONFIG_2026);
      expect(est100k).toBe(30864);
    });

    it('calculates Zone 5 Reichensteuer (45 %) for 2026', () => {
      // 300.000 €: Formel 0,45 * 300.000 - 19.470,38 = 135.000 - 19.470,38 = 115.529,62 -> Math.floor = 115.529 €
      const est300k = computeEStSingle(300000, TAX_CONFIG_2026);
      expect(est300k).toBe(115529);
    });

    it('handles Splittingtarif correctly', () => {
      const resSingle = calculateEinkommensteuer({
        taxableIncome: 60000,
        taxYear: '2026',
        tariffType: 'single',
      });
      const resSplitting = calculateEinkommensteuer({
        taxableIncome: 60000,
        taxYear: '2026',
        tariffType: 'splitting',
      });

      // Splittingtarif auf 60.000 € entspricht 2x Steuer auf 30.000 €, was durch Progression spürbar günstiger ist
      expect(Number(resSplitting.primary.value)).toBeLessThan(Number(resSingle.primary.value));
    });
  });

  describe('2. Grenzsteuersatz & Durchschnittssteuersatz', () => {
    it('computes correct marginal rates across progression zones', () => {
      // Grundfreibetrag: 0 %
      expect(computeMarginalTaxRate(10000, TAX_CONFIG_2026)).toBe(0);

      // Zone 2 Start: ca. 14 %
      const rateStart = computeMarginalTaxRate(12350, TAX_CONFIG_2026);
      expect(rateStart).toBeCloseTo(14.0, 0);

      // Zone 4: exakt 42 %
      expect(computeMarginalTaxRate(80000, TAX_CONFIG_2026)).toBe(42);

      // Zone 5: exakt 45 %
      expect(computeMarginalTaxRate(300000, TAX_CONFIG_2026)).toBe(45);
    });

    it('calculates full Grenzsteuersatz analysis', () => {
      const res = calculateGrenzsteuersatz({ taxableIncome: 50000, taxYear: '2026' });
      expect(Number(res.primary.value)).toBeGreaterThan(30);
      expect(Number(res.primary.value)).toBeLessThan(42);
      expect(Number(res.secondary?.find((s) => s.id === 'avgRate')?.value)).toBeLessThan(Number(res.primary.value));
    });
  });

  describe('3. Solidaritätszuschlag & Freigrenzen', () => {
    it('applies 0 € SolZ below the Freigrenze in 2026', () => {
      expect(computeSolZ(19100, false, TAX_CONFIG_2026)).toBe(0);
      expect(computeSolZ(15000, false, TAX_CONFIG_2026)).toBe(0);
    });

    it('calculates Milderungszone above Freigrenze', () => {
      // 20.000 € ESt (900 € über Freigrenze 19.100 €): 11,9 % von 900 € = 107,10 € (weniger als 5,5 % von 20.000 = 1.100 €)
      const solz = computeSolZ(20000, false, TAX_CONFIG_2026);
      expect(solz).toBeCloseTo(107.1, 1);
    });

    it('caps SolZ at full 5,5 % at high income tax', () => {
      const solz = computeSolZ(100000, false, TAX_CONFIG_2026);
      expect(solz).toBe(5500); // 5,5 % von 100.000
    });
  });

  describe('4. Kirchensteuer & Sonderausgabenabzug', () => {
    it('calculates 8 % in Bayern/BW and 9 % elsewhere', () => {
      const res9 = calculateKirchensteuer({ incomeTax: 10000, churchTaxRate: '9' });
      expect(res9.primary.value).toBe(900);

      const res8 = calculateKirchensteuer({ incomeTax: 10000, churchTaxRate: '8' });
      expect(res8.primary.value).toBe(800);
    });

    it('accounts for Sonderausgaben deduction savings', () => {
      const res = calculateKirchensteuer({ incomeTax: 10000, churchTaxRate: '9', marginalRate: 35 });
      const net = res.secondary?.find((s) => s.id === 'netKirchensteuer')?.value;
      expect(net).toBe(900 - 900 * 0.35); // 585 €
    });
  });

  describe('5. Brutto-Netto Payroll Calculation', () => {
    it('computes realistic net salary for a standard 3.800 € gross income', () => {
      const res = calculateBruttoNetto({
        grossSalary: 3800,
        period: 'month',
        taxClass: '1',
        children: '0',
        age: 30,
        taxYear: '2026',
      });

      const net = Number(res.primary.value);
      expect(net).toBeGreaterThan(2300);
      expect(net).toBeLessThan(2600);

      // Verify all social security components are present
      const rv = Number(res.secondary?.find((s) => s.id === 'rentenversicherung')?.value);
      const kv = Number(res.secondary?.find((s) => s.id === 'krankenversicherung')?.value);
      const pv = Number(res.secondary?.find((s) => s.id === 'pflegeversicherung')?.value);
      const alv = Number(res.secondary?.find((s) => s.id === 'arbeitslosenversicherung')?.value);

      expect(rv).toBeCloseTo(3800 * 0.093, 1);
      expect(alv).toBeCloseTo(3800 * 0.013, 1);
      expect(kv).toBeGreaterThan(0);
      expect(pv).toBeGreaterThan(0);
    });

    it('respects Beitragsbemessungsgrenzen for high incomes', () => {
      // 10.000 €/Monat: übersteigt KV/PV BBG (5.812,50 €) und RV/AV BBG (8.450 €) in 2026
      const res = calculateBruttoNetto({
        grossSalary: 10000,
        period: 'month',
        taxClass: '1',
        taxYear: '2026',
      });

      const rv = Number(res.secondary?.find((s) => s.id === 'rentenversicherung')?.value);
      const kv = Number(res.secondary?.find((s) => s.id === 'krankenversicherung')?.value);

      // RV gedeckelt bei 8.450 * 9,3 % = 785,85 €
      expect(rv).toBeCloseTo(8450 * 0.093, 1);
      // KV gedeckelt bei 5.812,50 * 8,55 % = 496,97 €
      expect(kv).toBeCloseTo(5812.5 * 0.0855, 1);
    });

    it('applies Pflegeversicherung Kinderlosenzuschlag only for age >= 23 with 0 kids', () => {
      const resYoung = calculateBruttoNetto({
        grossSalary: 3000,
        taxClass: '1',
        children: '0',
        age: 20, // unter 23 -> kein Zuschlag
        taxYear: '2026',
      });
      const resOlder = calculateBruttoNetto({
        grossSalary: 3000,
        taxClass: '1',
        children: '0',
        age: 30, // ab 23 -> +0,6 % Kinderlosenzuschlag
        taxYear: '2026',
      });

      const pvYoung = resYoung.secondary?.find((s) => s.id === 'pflegeversicherung')?.value || 0;
      const pvOlder = resOlder.secondary?.find((s) => s.id === 'pflegeversicherung')?.value || 0;

      expect(Number(pvOlder)).toBeGreaterThan(Number(pvYoung));
    });

    it('applies Sachsen special rule for Pflegeversicherung', () => {
      const resStandard = calculateBruttoNetto({
        grossSalary: 3000,
        taxClass: '1',
        federalState: 'other',
        taxYear: '2026',
      });
      const resSachsen = calculateBruttoNetto({
        grossSalary: 3000,
        taxClass: '1',
        federalState: 'sachsen',
        taxYear: '2026',
      });

      const pvStandard = resStandard.secondary?.find((s) => s.id === 'pflegeversicherung')?.value || 0;
      const pvSachsen = resSachsen.secondary?.find((s) => s.id === 'pflegeversicherung')?.value || 0;

      // In Sachsen zahlt AN 2,3 % statt regulär 1,8 %
      expect(Number(pvSachsen)).toBeGreaterThan(Number(pvStandard));
    });
  });

  describe('6. Netto-Brutto Inversion', () => {
    it('inverts net salary back to gross accurately within 2 cents', () => {
      const desiredNet = 2500;
      const invRes = calculateNettoBrutto({
        desiredNet,
        period: 'month',
        taxClass: '1',
        taxYear: '2026',
      });

      const reqGross = Number(invRes.primary.value);
      const forwardRes = calculateBruttoNetto({
        grossSalary: reqGross,
        period: 'month',
        taxClass: '1',
        taxYear: '2026',
      });

      expect(Math.abs(Number(forwardRes.primary.value) - desiredNet)).toBeLessThanOrEqual(0.05);
    });
  });

  describe('7. Minijob & Midijob', () => {
    it('handles Minijob 556 € in 2026 with RV opt-out (100 % Netto)', () => {
      const res = calculateMinijob({ earnings: 556, rvOptOut: true, taxYear: '2026' });
      expect(res.primary.value).toBe(556);
    });

    it('deducts 3,6 % RV contribution without opt-out', () => {
      const res = calculateMinijob({ earnings: 556, rvOptOut: false, taxYear: '2026' });
      expect(Number(res.primary.value)).toBeCloseTo(556 - 556 * 0.036, 1);
    });

    it('calculates Midijob reduced contributions in transition zone', () => {
      const res = calculateMidijob({ earnings: 1200, taxYear: '2026' });
      expect(Number(res.primary.value)).toBeGreaterThan(900);
      expect(Number(res.primary.value)).toBeLessThan(1100);

      // Reduced base must be lower than 1200 €
      const redBase = res.secondary?.find((s) => s.id === 'reducedBase')?.value || 0;
      expect(Number(redBase)).toBeLessThan(1200);
      expect(Number(redBase)).toBeGreaterThan(556);
    });
  });

  describe('8. Abfindungsrechner Fünftelregelung § 34 EStG', () => {
    it('calculates significant tax savings via Fünftelregelung', () => {
      const res = calculateAbfindung({
        regularIncome: 45000,
        abfindung: 30000,
        taxYear: '2026',
      });

      const taxSavings = res.secondary?.find((s) => s.id === 'taxSavings')?.value || 0;
      expect(taxSavings).toBeGreaterThan(500); // Progressionsvorteil
      expect(Number(res.primary.value)).toBeGreaterThan(19000);
    });
  });

  describe('9. Mehrwertsteuer / Umsatzsteuer', () => {
    it('converts gross to net with 19 % VAT', () => {
      const res = calculateMwSt({ amount: 119, mode: 'grossToNet', rate: 19 });
      expect(res.primary.value).toBe(100);
      expect(res.secondary?.find((s) => s.id === 'taxAmount')?.value).toBe(19);
    });

    it('converts net to gross with 7 % reduced VAT', () => {
      const res = calculateMwSt({ amount: 100, mode: 'netToGross', rate: 7 });
      expect(res.primary.value).toBe(107);
    });
  });
});
