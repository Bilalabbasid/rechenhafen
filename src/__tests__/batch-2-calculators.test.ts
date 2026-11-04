import { describe, it, expect } from 'vitest';
import { getCalculatorDefinitionBySlug } from '@/data/calculators';

export const BATCH_2_SLUGS = [
  'zinseszinsrechner',
  'etf-sparplan-rechner',
  'sparrechner',
  'sparzielrechner',
  'inflationsrechner',
  'renditerechner',
  'notgroschen-rechner',
  'kreditrechner',
  'ratenkreditrechner',
  'autokreditrechner',
  'tilgungsrechner',
  'sondertilgungsrechner',
  'restschuld-rechner',
  'cashflow-rechner',
  'ebit-ebitda-rechner',
  'eigenkapitalrentabilitaet-rechner',
  'gesamtkapitalrentabilitaet-rechner',
  'liquiditaetsgrad-rechner',
  'working-capital-rechner',
  'ballonfinanzierung-rechner',
  'depotgebuehren-rechner',
  'dispozins-rechner',
  'dividendenrendite-rechner',
  'effektivzins-kredit-rechner',
  'ewige-rente-rechner',
  'festgeld-rechner',
  'finanzielle-freiheit-rechner',
  'forward-darlehen-rechner',
  'freistellungsauftrag-rechner',
  'gesamtzinsbelastung-rechner',
  'gold-rendite-rechner',
  'kapitalertragsteuer-rechner',
  'kaufkraftverlust-rechner',
  'kreditlaufzeit-rechner',
  'kreditvergleich-rechner',
  'maximaler-kredit-rechner',
  'modernisierungskredit-rechner',
  'realzins-rechner',
  'rentenluecke-rechner',
  'spardauer-rechner',
  'sparrate-rechner',
  'tagesgeld-rechner',
  'thesaurierend-vs-ausschuettend-rechner',
  'umschuldung-rechner',
  'verdopplungszeit-rechner',
  'vorfaelligkeitsentschaedigung-rechner',
];

describe('Batch 2 Calculators Comprehensive QA Suite (50 Calculators)', () => {
  it('contains exactly 46 calculators assigned to Batch 2', () => {
    expect(BATCH_2_SLUGS.length).toBe(46);
  });

  describe('1. Registry Resolution & Metadata Quality', () => {
    for (const slug of BATCH_2_SLUGS) {
      it(`resolves ${slug} with valid metadata and calculation function`, () => {
        const calc = getCalculatorDefinitionBySlug(slug);
        expect(calc).toBeDefined();
        if (!calc) return;
        expect(calc.id).toBe(slug);
        expect(calc.slug).toBe(slug);
        expect(calc.name.length).toBeGreaterThan(3);
        expect(calc.metaTitle.length).toBeGreaterThan(5);
        expect(calc.metaDescription.length).toBeGreaterThan(20);
        expect(calc.h1.length).toBeGreaterThan(3);
        expect(calc.inputs.length).toBeGreaterThan(0);
        expect(typeof calc.calculate).toBe('function');
      });
    }
  });

  describe('2. Default Calculation Execution & German Formatting', () => {
    for (const slug of BATCH_2_SLUGS) {
      it(`calculates valid default outputs without NaN for ${slug}`, () => {
        const calc = getCalculatorDefinitionBySlug(slug);
        expect(calc).toBeDefined();
        if (!calc) return;

        const defaultInputs: Record<string, any> = {};
        for (const input of calc.inputs) {
          defaultInputs[input.id] = input.defaultValue;
        }

        const result = calc.calculate(defaultInputs);
        expect(result).toBeDefined();
        expect(result.primary).toBeDefined();
        expect(typeof result.primary.value).toBe('number');
        expect(Number.isNaN(result.primary.value)).toBe(false);
        expect(Number.isFinite(result.primary.value)).toBe(true);
        expect(result.primary.formattedValue).toBeDefined();
        expect(result.primary.formattedValue).not.toContain('NaN');
        expect(result.primary.formattedValue).not.toContain('undefined');

        if (result.secondary) {
          for (const sec of result.secondary) {
            expect(sec.formattedValue).not.toContain('NaN');
            expect(sec.formattedValue).not.toContain('undefined');
          }
        }
      });
    }
  });

  describe('3. High-Confidence Audit Findings & Zero-Value Preservation', () => {
    it('sondertilgungsrechner preserves yearlySpecialRepayment = 0 without false fallback to 5000', () => {
      const calc = getCalculatorDefinitionBySlug('sondertilgungsrechner')!;
      const resZero = calc.calculate({
        loanAmount: 200000,
        interestRate: 3.5,
        repaymentRate: 2.0,
        yearlySpecialRepayment: 0,
        specialRepaymentStartYear: 1,
      });
      const resDefault = calc.calculate({
        loanAmount: 200000,
        interestRate: 3.5,
        repaymentRate: 2.0,
        yearlySpecialRepayment: 5000,
        specialRepaymentStartYear: 1,
      });
      // 0 special repayment must save 0 € in interest, whereas 5000 saves > 0 €
      expect(resZero.primary.value).toBe(0);
      expect(resDefault.primary.value).toBeGreaterThan(0);
    });

    it('zinseszinsrechner preserves 0 € initial amount and 0 € dynamic increase', () => {
      const calc = getCalculatorDefinitionBySlug('zinseszinsrechner')!;
      const result = calc.calculate({
        initialAmount: 0,
        monthlyContribution: 250,
        years: 10,
        annualRate: 6.0,
        compoundFrequency: '12',
        dynamicIncrease: 0,
      });
      expect(result.primary.value).toBeGreaterThan(0);
      expect(result.secondary?.find((s) => s.id === 'totalDeposits')?.value).toBe(250 * 12 * 10);
    });

    it('finanzielle-freiheit-rechner preserves 0 € currentAssets (FIRE start from scratch)', () => {
      const calc = getCalculatorDefinitionBySlug('finanzielle-freiheit-rechner')!;
      const resZero = calc.calculate({ monthlyExpenses: 2000, withdrawalRate: 4.0, currentAssets: 0 });
      const resExisting = calc.calculate({ monthlyExpenses: 2000, withdrawalRate: 4.0, currentAssets: 100000 });
      expect(resZero.primary.value).toBe(600000); // 24000 / 0.04
      expect(resZero.secondary?.find((s) => s.id === 'gap')?.value).toBe(600000);
      expect(resExisting.secondary?.find((s) => s.id === 'gap')?.value).toBe(500000);
    });

    it('working-capital-rechner handles 0 liabilities gracefully without division by zero', () => {
      const calc = getCalculatorDefinitionBySlug('working-capital-rechner')!;
      const result = calc.calculate({ currentAssets: 50000, currentLiabilities: 0 });
      expect(result.error).toBeDefined();
      expect(result.primary.value).toBe(0);

      const resZeroAssets = calc.calculate({ currentAssets: 0, currentLiabilities: 50000 });
      expect(resZeroAssets.primary.value).toBe(-50000);
      expect(resZeroAssets.secondary?.find((s) => s.id === 'ratio')?.value).toBe(0);
    });

    it('liquiditaetsgrad-rechner handles 0 liabilities gracefully without division by zero', () => {
      const calc = getCalculatorDefinitionBySlug('liquiditaetsgrad-rechner')!;
      const result = calc.calculate({
        cashAndBanks: 10000,
        shortTermReceivables: 5000,
        inventories: 15000,
        shortTermLiabilities: 0,
      });
      expect(result.error).toBeDefined();
      expect(result.primary.value).toBe(0);
    });

    it('eigenkapitalrentabilitaet-rechner and gesamtkapitalrentabilitaet-rechner protect against zero capital division', () => {
      const ekCalc = getCalculatorDefinitionBySlug('eigenkapitalrentabilitaet-rechner')!;
      const ekRes = ekCalc.calculate({ netIncome: 50000, equity: 0 });
      expect(ekRes.error).toBeDefined();

      const gkCalc = getCalculatorDefinitionBySlug('gesamtkapitalrentabilitaet-rechner')!;
      const gkRes = gkCalc.calculate({ netIncome: 50000, interestExpenses: 5000, totalCapital: 0 });
      expect(gkRes.error).toBeDefined();
    });

    it('ebit-ebitda-rechner handles valid zero interest, taxes, and depreciation', () => {
      const calc = getCalculatorDefinitionBySlug('ebit-ebitda-rechner')!;
      const result = calc.calculate({
        revenue: 100000,
        materialExpense: 0,
        personnelExpense: 0,
        otherOperatingExpenses: 0,
        depreciation: 0,
      });
      expect(result.primary.value).toBe(100000);
      expect(result.secondary?.find((s) => s.id === 'ebit')?.value).toBe(100000);
    });

    it('autokreditrechner preserves 0 € down payment without falling back to 5000', () => {
      const calc = getCalculatorDefinitionBySlug('autokreditrechner')!;
      const resZero = calc.calculate({ carPrice: 30000, downPayment: 0, termMonths: 48, annualInterest: 4.5 });
      const resDown = calc.calculate({ carPrice: 30000, downPayment: 6000, termMonths: 48, annualInterest: 4.5 });
      expect(resZero.secondary?.find((s) => s.id === 'loanNeeded')?.value).toBe(30000);
      expect(resDown.secondary?.find((s) => s.id === 'loanNeeded')?.value).toBe(24000);
      expect(Number(resZero.primary.value)).toBeGreaterThan(Number(resDown.primary.value));
    });

    it('kreditrechner and tilgungsrechner correctly calculate with 0 % interest rate', () => {
      const kCalc = getCalculatorDefinitionBySlug('kreditrechner')!;
      const kRes = kCalc.calculate({ loanAmount: 12000, annualInterest: 0, termMonths: 12 });
      expect(kRes.primary.value).toBe(1000); // 12000 / 12 months = 1000 €/month
      expect(kRes.secondary?.find((s) => s.id === 'totalInterest')?.value).toBe(0);

      const tCalc = getCalculatorDefinitionBySlug('tilgungsrechner')!;
      const tRes = tCalc.calculate({ loanAmount: 120000, annualInterest: 0, initialRepayment: 2.0, fixedYears: 10 });
      expect(tRes.primary.value).toBe(200); // 120000 * 2% / 12 = 200 €/month
    });

    it('freistellungsauftrag-rechner handles 0 € annual gains without falling back to 1500', () => {
      const calc = getCalculatorDefinitionBySlug('freistellungsauftrag-rechner')!;
      const result = calc.calculate({ annualGains: 0, status: 'single', churchTax: false });
      expect(result.primary.value).toBe(0);
      expect(result.secondary?.find((s) => s.id === 'taxable')?.value).toBe(0);
    });

    it('sparrate-rechner handles 0 € monthly savings without falling back to 640', () => {
      const calc = getCalculatorDefinitionBySlug('sparrate-rechner')!;
      const result = calc.calculate({ netIncome: 3000, monthlySavings: 0 });
      expect(result.primary.value).toBe(0);
      expect(result.primary.formattedValue).toBe('0 %');
    });

    it('thesaurierend-vs-ausschuettend-rechner protects against 0 % total return division', () => {
      const calc = getCalculatorDefinitionBySlug('thesaurierend-vs-ausschuettend-rechner')!;
      const result = calc.calculate({ monthlyRate: 200, years: 10, growthRate: 0, dividendRate: 0 });
      expect(result.primary.value).toBe(24000); // 200 * 120
      expect(result.secondary?.find((s) => s.id === 'profit')?.value).toBe(0);
    });

    it('privatkredit-rechner (merged to ratenkreditrechner) handles 0 % interest (family loan) cleanly', () => {
      const calc = getCalculatorDefinitionBySlug('ratenkreditrechner')!;
      const result = calc.calculate({ loanAmount: 12000, annualInterest: 0, termMonths: 24 });
      expect(result.primary.value).toBe(500); // 12000 / 24
      expect(result.secondary?.find((s) => s.id === 'totalInterest')?.value).toBe(0);
    });

    it('schuldentilgungsdauer-rechner (merged to kreditlaufzeit-rechner) handles already debt-free state (0 € debt)', () => {
      const calc = getCalculatorDefinitionBySlug('kreditlaufzeit-rechner')!;
      const result = calc.calculate({ loan: 0, monthlyRate: 300, interestRate: 5 });
      expect(result.primary.value).toBe(0);
      expect(result.primary.formattedValue).toBe('0 Monate');
    });

    it('dispozins-rechner handles 0 € overdraft or 0 days without NaN or false fallback', () => {
      const calc = getCalculatorDefinitionBySlug('dispozins-rechner')!;
      const resZeroAmount = calc.calculate({ overdraftAmount: 0, dispoRate: 12, days: 30 });
      expect(resZeroAmount.primary.value).toBe(0);

      const resZeroDays = calc.calculate({ overdraftAmount: 1000, dispoRate: 12, days: 0 });
      expect(resZeroDays.primary.value).toBe(0);
      expect(resZeroDays.secondary?.find((s) => s.id === 'perDay')?.value).toBe(0);
    });

    it('verdopplungszeit-rechner returns error for non-positive interest rate', () => {
      const calc = getCalculatorDefinitionBySlug('verdopplungszeit-rechner')!;
      const result = calc.calculate({ interestRate: 0, initialAmount: 10000 });
      expect(result.error).toBeDefined();
      expect(result.primary.formattedValue).toBe('Nie');
    });

    it('maximaler-kredit-rechner validates termYears and returns error if <= 0', () => {
      const calc = getCalculatorDefinitionBySlug('maximaler-kredit-rechner')!;
      const result = calc.calculate({ netIncome: 3500, fixedExpenses: 1800, termYears: 0 });
      expect(result.error).toBeDefined();
      expect(result.primary.value).toBe(0);
    });
  });
});
