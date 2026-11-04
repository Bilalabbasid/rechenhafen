import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug, getCalculatorDefinitionBySlug } from '@/data/calculators';
import { RETIRED_CALCULATORS } from '@/data/seo/retired-calculators';
import { calculateCompoundInterest, calculateSavingsTarget } from '@/lib/calculators/finanzen';
import type { CalculationResult, CalculatorDefinition } from '@/types/calculator';

// ---------------------------------------------------------------------------
// Unabhängige Referenzformeln (bewusst nicht aus der Engine importiert)
// ---------------------------------------------------------------------------
const annuity = (loan: number, r: number, n: number, balloon = 0) =>
  r === 0 ? (loan - balloon) / n : ((loan - balloon * Math.pow(1 + r, -n)) * r) / (1 - Math.pow(1 + r, -n));
const effMonthly = (pct: number) => Math.pow(1 + pct / 100, 1 / 12) - 1;
const restschuld = (loan: number, r: number, payment: number, months: number) =>
  r === 0 ? loan - payment * months : loan * Math.pow(1 + r, months) - (payment * (Math.pow(1 + r, months) - 1)) / r;
const savingsFV = (start: number, monthly: number, r: number, n: number, timing: 'end' | 'start' = 'end') => {
  const q = Math.pow(1 + r, n);
  if (r === 0) return start + monthly * n;
  return start * q + monthly * ((q - 1) / r) * (timing === 'start' ? 1 + r : 1);
};

/** formatCurrency trennt „€“ mit einem geschützten Leerzeichen ab; für Vergleiche normalisieren. */
const nb = (v: unknown) => String(v).replace(/\u00a0/g, ' ');
const sec = (res: CalculationResult, id: string) => res.secondary?.find((s) => s.id === id);
const secVal = (res: CalculationResult, id: string) => Number(sec(res, id)?.value);
const calc = (slug: string): CalculatorDefinition => {
  const c = getCalculatorBySlug(slug);
  expect(c, slug).toBeDefined();
  return c!;
};
const source = (slug: string): CalculatorDefinition => getCalculatorDefinitionBySlug(slug)!;
const defaults = (c: CalculatorDefinition) => Object.fromEntries(c.inputs.map((i) => [i.id, i.defaultValue]));

const expectError = (res: CalculationResult) => {
  expect(res.error, JSON.stringify(res.primary)).toBeTruthy();
  expect(res.primary.value).toBe(0);
  expect(String(res.primary.formattedValue)).not.toMatch(/NaN|Infinity|undefined/);
};

// ===========================================================================
// 1. Ratenkreditrechner ← kreditrechner, kreditlaufzeit, gesamtzinsbelastung,
//    ballonfinanzierung, modernisierungskredit
// ===========================================================================
describe('ratenkreditrechner (merged)', () => {
  const rk = calc('ratenkreditrechner');

  it('defaults give the monthly rate immediately (effective rate, 48 months)', () => {
    const res = rk.calculate(defaults(rk));
    expect(res.error).toBeUndefined();
    const expected = annuity(10000, effMonthly(4.9), 48);
    expect(res.primary.id).toBe('monthlyRate');
    expect(res.primary.value as number).toBeCloseTo(expected, 8);
    expect(nb(res.primary.formattedValue)).toBe('229,36 €');
    expect(secVal(res, 'totalInterest')).toBeCloseTo(expected * 48 - 10000, 6);
    expect(secVal(res, 'totalPayment')).toBeCloseTo(expected * 48, 6);
    expect(res.breakdown?.rows.length).toBe(4);
  });

  it('nominal Sollzins: matches the annuity formula and the retired kreditrechner', () => {
    const res = rk.calculate({ mode: 'rate', loanAmount: 10000, annualInterest: 4.9, rateType: 'nominal', termMonths: 48 });
    const expected = annuity(10000, 0.049 / 12, 48);
    expect(res.primary.value as number).toBeCloseTo(expected, 8);
    expect(nb(res.primary.formattedValue)).toBe('229,84 €');
    const old = source('kreditrechner').calculate({ loanAmount: 10000, annualInterest: 4.9, term: 48, termUnit: 'months', sondertilgung: 0 });
    expect(res.primary.value as number).toBeCloseTo(old.primary.value as number, 8);
    expect(secVal(res, 'totalInterest')).toBeCloseTo(secVal(old, 'totalInterest'), 6);
  });

  it('total interest (gesamtzinsbelastung): 100.000 € / 4 % / 10 Jahre', () => {
    const res = rk.calculate({ mode: 'rate', loanAmount: 100000, annualInterest: 4, rateType: 'nominal', termMonths: 120 });
    const pmt = annuity(100000, 0.04 / 12, 120);
    expect(res.primary.value as number).toBeCloseTo(pmt, 8);
    expect(nb(res.primary.formattedValue)).toBe('1.012,45 €');
    expect(secVal(res, 'totalInterest')).toBeCloseTo(pmt * 120 - 100000, 6);
    expect(secVal(res, 'interestShare')).toBeCloseTo(((pmt * 120 - 100000) / 100000) * 100, 6);
    const old = source('gesamtzinsbelastung-rechner').calculate({ loan: 100000, rate: 4, years: 10 });
    expect(secVal(res, 'totalInterest')).toBeCloseTo(old.primary.value as number, 4);
  });

  it('term mode (kreditlaufzeit): 30.000 € / 4,9 % / 450 € → 78 Raten', () => {
    const res = rk.calculate({ mode: 'laufzeit', loanAmount: 30000, annualInterest: 4.9, rateType: 'nominal', monthlyPayment: 450 });
    expect(res.error).toBeUndefined();
    const r = 0.049 / 12;
    const nExact = -Math.log(1 - (30000 * r) / 450) / Math.log(1 + r);
    expect(res.primary.id).toBe('term');
    expect(res.primary.value).toBe(Math.ceil(nExact));
    expect(res.primary.value).toBe(78);
    expect(nb(res.primary.formattedValue)).toBe('6 Jahre und 6 Monate (78 Monate)');
    const old = source('kreditlaufzeit-rechner').calculate({ loan: 30000, interestRate: 4.9, monthlyRate: 450 });
    expect(secVal(old, 'months')).toBe(78);
    // Letzte Rate = Restschuld nach 77 Raten inkl. Zinsen
    const lastExpected = restschuld(30000, r, 450, 77) * (1 + r);
    expect(secVal(res, 'lastPayment')).toBeCloseTo(lastExpected, 6);
    expect(secVal(res, 'totalInterest')).toBeCloseTo(77 * 450 + lastExpected - 30000, 6);
    expect(secVal(res, 'totalPayment') - 30000).toBeCloseTo(secVal(res, 'totalInterest'), 6);
  });

  it('balloon (ballonfinanzierung): Rate wie die alte Seite, Schlussrate und Mehrzinsen ausgewiesen', () => {
    const inputs = { mode: 'rate', loanAmount: 28000, annualInterest: 5.5, rateType: 'nominal', termMonths: 48, showExtras: true, downPayment: 5000, balloonPayment: 8000, sondertilgung: 0 };
    const res = rk.calculate(inputs);
    const r = 0.055 / 12;
    const pmt = annuity(23000, r, 48, 8000);
    expect(res.primary.value as number).toBeCloseTo(pmt, 8);
    const old = source('ballonfinanzierung-rechner').calculate({ carPrice: 28000, downPayment: 5000, interestRate: 5.5, months: 48, balloonPayment: 8000 });
    expect(res.primary.value as number).toBeCloseTo(old.primary.value as number, 8);
    expect(secVal(res, 'loanAmount')).toBe(23000);
    expect(secVal(res, 'balloon')).toBe(8000);
    expect(secVal(res, 'totalPayment')).toBeCloseTo(pmt * 48 + 8000, 6);
    expect(secVal(res, 'totalInterest')).toBeCloseTo(pmt * 48 + 8000 - 23000, 6);
    const noBalloon = annuity(23000, r, 48);
    expect(secVal(res, 'rateWithoutBalloon')).toBeCloseTo(noBalloon, 8);
    expect(secVal(res, 'balloonExtraInterest')).toBeCloseTo(pmt * 48 + 8000 - noBalloon * 48, 6);
    expect(secVal(res, 'balloonExtraInterest')).toBeGreaterThan(0);
    expect(res.breakdown?.rows.at(-1)?.period).toContain('Schlussrate');
  });

  it('effective-rate balloon example on the page: 383,71 € and 810,07 € Mehrzinsen', () => {
    const res = rk.calculate({ mode: 'rate', loanAmount: 28000, annualInterest: 5.5, rateType: 'effective', termMonths: 48, showExtras: true, downPayment: 5000, balloonPayment: 8000 });
    expect(nb(res.primary.formattedValue)).toBe('383,71 €');
    expect(nb(sec(res, 'balloonExtraInterest')?.formattedValue)).toBe('810,07 €');
  });

  it('modernisierungskredit: same rate as the retired page (35.000 € / 4,8 % / 8 Jahre)', () => {
    const res = rk.calculate({ mode: 'rate', loanAmount: 35000, annualInterest: 4.8, rateType: 'nominal', termMonths: 96 });
    const old = source('modernisierungskredit-rechner').calculate({ amount: 35000, interestRate: 4.8, termYears: 8 });
    expect(res.primary.value as number).toBeCloseTo(old.primary.value as number, 8);
    expect(secVal(res, 'totalInterest')).toBeCloseTo(secVal(old, 'interest'), 4);
  });

  it('special repayment shortens the term and saves interest', () => {
    const res = rk.calculate({ mode: 'rate', loanAmount: 15000, annualInterest: 5.5, rateType: 'nominal', termMonths: 60, showExtras: true, sondertilgung: 1000 });
    expect(secVal(res, 'actualTerm')).toBe(48);
    expect(secVal(res, 'timeSaved')).toBe(12);
    expect(secVal(res, 'interestSaved')).toBeGreaterThan(0);
    const plain = rk.calculate({ mode: 'rate', loanAmount: 15000, annualInterest: 5.5, rateType: 'nominal', termMonths: 60 });
    expect(secVal(plain, 'totalInterest') - secVal(res, 'totalInterest')).toBeCloseTo(secVal(res, 'interestSaved'), 6);
  });

  it('ignores hidden extra fields while "Weitere Optionen" is off', () => {
    const on = rk.calculate({ loanAmount: 20000, annualInterest: 5, termMonths: 60, showExtras: true, downPayment: 5000, balloonPayment: 3000, sondertilgung: 1000 });
    const off = rk.calculate({ loanAmount: 20000, annualInterest: 5, termMonths: 60, showExtras: false, downPayment: 5000, balloonPayment: 3000, sondertilgung: 1000 });
    expect(off.primary.value as number).toBeCloseTo(annuity(20000, effMonthly(5), 60), 8);
    expect(on.primary.value).not.toBe(off.primary.value);
    expect(sec(off, 'balloon')).toBeUndefined();
  });

  it('0 % interest (family loan) in both modes', () => {
    const rate = rk.calculate({ loanAmount: 12000, annualInterest: 0, termMonths: 24 });
    expect(rate.primary.value).toBe(500);
    expect(secVal(rate, 'totalInterest')).toBe(0);
    const term = rk.calculate({ mode: 'laufzeit', loanAmount: 12000, annualInterest: 0, monthlyPayment: 500 });
    expect(term.primary.value).toBe(24);
    expect(secVal(term, 'totalInterest')).toBe(0);
    const balloon0 = rk.calculate({ loanAmount: 12000, annualInterest: 0, termMonths: 24, showExtras: true, balloonPayment: 2400 });
    expect(balloon0.primary.value).toBe(400);
  });

  it('very long terms stay finite; beyond 50 years returns a clear error', () => {
    const long = rk.calculate({ loanAmount: 50000, annualInterest: 6, termMonths: 600 });
    expect(long.error).toBeUndefined();
    expect(Number.isFinite(long.primary.value as number)).toBe(true);
    expectError(rk.calculate({ loanAmount: 50000, annualInterest: 6, termMonths: 601 }));
    expectError(rk.calculate({ mode: 'laufzeit', loanAmount: 100000, annualInterest: 0, monthlyPayment: 100 }));
  });

  it('invalid input returns German errors and never throws', () => {
    const cases: Record<string, any>[] = [
      {},
      { loanAmount: '' , annualInterest: 5, termMonths: 12 },
      { loanAmount: 0, annualInterest: 5, termMonths: 12 },
      { loanAmount: -1000, annualInterest: 5, termMonths: 12 },
      { loanAmount: 'abc', annualInterest: 5, termMonths: 12 },
      { loanAmount: 1000, annualInterest: -1, termMonths: 12 },
      { loanAmount: 1000, annualInterest: '', termMonths: 12 },
      { loanAmount: 1000, annualInterest: 5, termMonths: 0 },
      { loanAmount: 1000, annualInterest: 5, termMonths: 1.5 },
      { loanAmount: 1000, annualInterest: 5, termMonths: '' },
      { mode: 'laufzeit', loanAmount: 10000, annualInterest: 5, monthlyPayment: 0 },
      { mode: 'laufzeit', loanAmount: 10000, annualInterest: 12, rateType: 'nominal', monthlyPayment: 100 },
      { loanAmount: 10000, annualInterest: 5, termMonths: 12, showExtras: true, balloonPayment: 10000 },
      { loanAmount: 10000, annualInterest: 5, termMonths: 12, showExtras: true, downPayment: 10000 },
      { loanAmount: 10000, annualInterest: 5, termMonths: 12, showExtras: true, downPayment: -1 },
      { loanAmount: 10000, annualInterest: 5, termMonths: 12, showExtras: true, sondertilgung: -5 },
    ];
    for (const inputs of cases) {
      expect(() => rk.calculate(inputs), JSON.stringify(inputs)).not.toThrow();
      expectError(rk.calculate(inputs));
    }
    expect(rk.calculate({ mode: 'laufzeit', loanAmount: 10000, annualInterest: 12, rateType: 'nominal', monthlyPayment: 100 }).error).toContain('Zinsen');
  });
});

// ===========================================================================
// 2. Tilgungsrechner ← baufinanzierung, volltilger, ohne Eigenkapital, restschuld
// ===========================================================================
describe('tilgungsrechner (merged)', () => {
  const tr = calc('tilgungsrechner');

  it('defaults: 300.000 € / 3,6 % / 2 % / 10 Jahre → 1.400 € und Restschuld per Formel', () => {
    const res = tr.calculate(defaults(tr));
    expect(res.error).toBeUndefined();
    expect(res.primary.value as number).toBeCloseTo(1400, 10);
    const expectedRest = restschuld(300000, 0.036 / 12, 1400, 120);
    expect(secVal(res, 'remainingDebt')).toBeCloseTo(expectedRest, 6);
    expect(nb(sec(res, 'remainingDebt')?.formattedValue)).toBe('227.907,14 €');
    expect(secVal(res, 'repaid')).toBeCloseTo(300000 - expectedRest, 6);
    expect(secVal(res, 'interest')).toBeCloseTo(1400 * 120 - (300000 - expectedRest), 6);
    expect(res.breakdown?.rows.length).toBe(10);
  });

  it('restschuld-rechner and baufinanzierung-rechner give the same Restschuld', () => {
    const res = tr.calculate({ loanAmount: 200000, annualInterest: 3.5, initialRepayment: 2, fixedYears: 10 });
    const old = source('restschuld-rechner').calculate({ loanAmount: 200000, annualInterest: 3.5, initialRepayment: 2, fixedYears: 10 });
    expect(secVal(res, 'remainingDebt')).toBeCloseTo(old.primary.value as number, 6);
    const res15 = tr.calculate({ loanAmount: 300000, annualInterest: 3.6, initialRepayment: 2, fixedYears: 15 });
    const bau = source('baufinanzierung-rechner').calculate({ loanAmount: 300000, interestRate: 3.6, initialRepayment: 2, fixedYears: 15 });
    expect(res15.primary.value as number).toBeCloseTo(bau.primary.value as number, 8);
    expect(secVal(res15, 'remainingDebt')).toBeCloseTo(secVal(bau, 'rest'), 6);
    expect(secVal(res15, 'interest')).toBeCloseTo(secVal(bau, 'interest'), 6);
  });

  it('total term to payoff matches the closed form', () => {
    const res = tr.calculate({ loanAmount: 300000, annualInterest: 3.6, initialRepayment: 2, fixedYears: 10 });
    const r = 0.036 / 12;
    const n = Math.ceil(-Math.log(1 - (300000 * r) / 1400) / Math.log(1 + r));
    expect(secVal(res, 'totalTerm')).toBe(n);
    expect(nb(sec(res, 'totalTerm')?.formattedValue)).toBe('28 Jahre und 8 Monate');
  });

  it('Volltilger: rate, required Tilgung and 0 € Restschuld like the retired page', () => {
    const res = tr.calculate({ tilgungMode: 'volltilger', loanAmount: 200000, annualInterest: 3.5, fixedYears: 20, initialRepayment: 2 });
    const pmt = annuity(200000, 0.035 / 12, 240);
    expect(res.primary.value as number).toBeCloseTo(pmt, 8);
    expect(nb(res.primary.formattedValue)).toBe('1.159,92 €');
    expect(secVal(res, 'remainingDebt')).toBe(0);
    expect(secVal(res, 'initialRepaymentPct')).toBeCloseTo(((pmt * 12) / 200000) * 100 - 3.5, 8);
    expect(secVal(res, 'interest')).toBeCloseTo(pmt * 240 - 200000, 4);
    const old = source('volltilger-darlehen-rechner').calculate({ loanAmount: 200000, interestRate: 3.5, years: 20 });
    expect(res.primary.value as number).toBeCloseTo(old.primary.value as number, 8);
    expect(secVal(res, 'initialRepaymentPct')).toBeCloseTo(secVal(old, 'tilgung'), 8);
    // Volltilger bei 0 %
    const zero = tr.calculate({ tilgungMode: 'volltilger', loanAmount: 120000, annualInterest: 0, fixedYears: 10 });
    expect(zero.primary.value).toBe(1000);
    expect(secVal(zero, 'remainingDebt')).toBe(0);
  });

  it('Kaufpreis & Eigenkapital: Darlehen = Kaufpreis + Nebenkosten − Eigenkapital', () => {
    const res = tr.calculate({ useFinancing: true, purchasePrice: 400000, sideCostsPct: 10, equity: 80000, annualInterest: 3.6, initialRepayment: 2, fixedYears: 10, loanAmount: 999 });
    expect(secVal(res, 'loanAmount')).toBe(360000);
    expect(secVal(res, 'sideCosts')).toBe(40000);
    expect(secVal(res, 'loanToPrice')).toBeCloseTo(90, 10);
    expect(res.primary.value as number).toBeCloseTo(360000 * 0.056 / 12, 8);
    expect(res.warning).toBeUndefined();
  });

  it('110-%-Finanzierung (kreditrechner-ohne-eigenkapital): same rate, plus surcharge warning', () => {
    const res = tr.calculate({ useFinancing: true, purchasePrice: 300000, sideCostsPct: 10, equity: 0, annualInterest: 4.1, initialRepayment: 2, fixedYears: 15 });
    const old = source('kreditrechner-ohne-eigenkapital').calculate({ purchasePrice: 300000, incidentalFeesPct: 10, baseRate: 3.5, riskMarkup: 0.6 });
    expect(secVal(res, 'loanAmount')).toBeCloseTo(330000, 6);
    expect(res.primary.value as number).toBeCloseTo(old.primary.value as number, 8);
    expect(nb(res.primary.formattedValue)).toBe('1.677,50 €');
    expect(secVal(res, 'loanToPrice')).toBeCloseTo(110, 8);
    expect(res.warning).toContain('Zinsaufschlag');
  });

  it('0 % Zins and very long payoff stay finite and warn', () => {
    const res = tr.calculate({ loanAmount: 120000, annualInterest: 0, initialRepayment: 2.0, fixedYears: 10 });
    expect(res.primary.value).toBe(200);
    expect(secVal(res, 'remainingDebt')).toBeCloseTo(96000, 6);
    expect(secVal(res, 'totalTerm')).toBe(600);
    expect(res.warning).toContain('40 Jahre');
    const never = tr.calculate({ loanAmount: 300000, annualInterest: 0, initialRepayment: 0.1, fixedYears: 40 });
    expect(never.error).toBeUndefined();
    expect(nb(sec(never, 'totalTerm')?.formattedValue)).toBe('über 100 Jahre');
    expect(sec(never, 'totalInterestAll')).toBeUndefined();
    for (const s of never.secondary ?? []) expect(String(s.formattedValue)).not.toMatch(/NaN|Infinity/);
  });

  it('high Tilgung pays off within the Zinsbindung: Restschuld 0', () => {
    const res = tr.calculate({ loanAmount: 100000, annualInterest: 3, initialRepayment: 20, fixedYears: 10 });
    expect(secVal(res, 'remainingDebt')).toBe(0);
    expect(secVal(res, 'totalTerm')).toBeLessThan(120);
  });

  it('invalid input returns German errors and never throws', () => {
    const base = { loanAmount: 200000, annualInterest: 3.5, initialRepayment: 2, fixedYears: 10 };
    const cases: Record<string, any>[] = [
      {},
      { ...base, loanAmount: '' },
      { ...base, loanAmount: 0 },
      { ...base, loanAmount: -5 },
      { ...base, annualInterest: -1 },
      { ...base, annualInterest: '' },
      { ...base, initialRepayment: 0 },
      { ...base, initialRepayment: '' },
      { ...base, fixedYears: 0 },
      { ...base, fixedYears: 1.5 },
      { ...base, fixedYears: 51 },
      { ...base, useFinancing: true, purchasePrice: '', sideCostsPct: 10, equity: 0 },
      { ...base, useFinancing: true, purchasePrice: 300000, sideCostsPct: -1, equity: 0 },
      { ...base, useFinancing: true, purchasePrice: 300000, sideCostsPct: 10, equity: -1 },
      { ...base, useFinancing: true, purchasePrice: 300000, sideCostsPct: 10, equity: 330000 },
    ];
    for (const inputs of cases) {
      expect(() => tr.calculate(inputs), JSON.stringify(inputs)).not.toThrow();
      expectError(tr.calculate(inputs));
    }
  });
});

// ===========================================================================
// 3. Sparrechner ← sparzielrechner, spardauer-rechner, sparrate-rechner
// ===========================================================================
describe('sparrechner (merged)', () => {
  const sp = calc('sparrechner');
  const r35 = 0.035 / 12;
  const r4 = 0.04 / 12;

  it('defaults (Endkapital) match the closed form and the unchanged compound engine', () => {
    const res = sp.calculate(defaults(sp));
    expect(res.error).toBeUndefined();
    expect(res.primary.value as number).toBeCloseTo(savingsFV(2500, 200, r35, 120), 6);
    expect(nb(res.primary.formattedValue)).toBe('32.232,36 €');
    const engine = calculateCompoundInterest({ initialAmount: 2500, monthlyContribution: 200, annualRate: 3.5, years: 10, compoundFrequency: '12', depositTiming: 'end' });
    expect(res.primary.value).toBe(engine.primary.value);
    expect(sec(res, 'savingsQuote')).toBeUndefined();
  });

  it('Endkapital vorschüssig', () => {
    const res = sp.calculate({ mode: 'endkapital', initialAmount: 0, monthlyContribution: 100, annualRate: 3.5, years: 10, depositTiming: 'start' });
    expect(res.primary.value as number).toBeCloseTo(savingsFV(0, 100, r35, 120, 'start'), 6);
  });

  it('Sparrate (sparzielrechner): 50.000 € in 10 Jahren, 5.000 € Start, 4 %', () => {
    const res = sp.calculate({ mode: 'sparrate', targetAmount: 50000, initialAmount: 5000, annualRate: 4, years: 10, depositTiming: 'end', monthlyContribution: 999 });
    const q = Math.pow(1 + r4, 120);
    const expected = ((50000 - 5000 * q) * r4) / (q - 1);
    expect(res.primary.id).toBe('monthlyRate');
    expect(res.primary.value as number).toBeCloseTo(expected, 8);
    expect(nb(res.primary.formattedValue)).toBe('288,94 €');
    expect(savingsFV(5000, res.primary.value as number, r4, 120)).toBeCloseTo(50000, 6);
    const old = calculateSavingsTarget({ targetAmount: 50000, initialAmount: 5000, annualRate: 4, years: 10 });
    expect(res.primary.value as number).toBeCloseTo(old.primary.value as number, 8);
    expect(secVal(res, 'endBalance')).toBeCloseTo(50000, 6);
    expect(secVal(res, 'totalDeposits') + secVal(res, 'interestGain')).toBeCloseTo(50000, 6);
  });

  it('Sparrate vorschüssig and 0 %', () => {
    const start = sp.calculate({ mode: 'sparrate', targetAmount: 30000, initialAmount: 0, annualRate: 3, years: 8, depositTiming: 'start' });
    expect(savingsFV(0, start.primary.value as number, 0.03 / 12, 96, 'start')).toBeCloseTo(30000, 6);
    const zero = sp.calculate({ mode: 'sparrate', targetAmount: 50000, initialAmount: 5000, annualRate: 0, years: 10 });
    expect(zero.primary.value).toBe(375);
    expect(secVal(zero, 'interestGain')).toBeCloseTo(0, 8);
  });

  it('Sparrate is 0 € when the start capital alone reaches the goal', () => {
    const res = sp.calculate({ mode: 'sparrate', targetAmount: 10000, initialAmount: 9000, annualRate: 4, years: 5 });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBe(0);
    expect(res.summaryText).toContain('ohne weitere Sparrate');
  });

  it('Spardauer (spardauer-rechner): 25.000 €, 350 €/Monat, 2.000 € Start, 4 % → 59 Monate', () => {
    const res = sp.calculate({ mode: 'dauer', targetAmount: 25000, monthlyContribution: 350, initialAmount: 2000, annualRate: 4, years: 1 });
    const nExact = Math.log((25000 * r4 + 350) / (2000 * r4 + 350)) / Math.log(1 + r4);
    expect(res.primary.id).toBe('duration');
    expect(res.primary.value).toBe(Math.ceil(nExact));
    expect(res.primary.value).toBe(59);
    expect(nb(res.primary.formattedValue)).toBe('4 Jahre und 11 Monate (59 Monate)');
    expect(savingsFV(2000, 350, r4, 58)).toBeLessThan(25000);
    expect(savingsFV(2000, 350, r4, 59)).toBeGreaterThanOrEqual(25000);
    expect(secVal(res, 'endBalance')).toBeCloseTo(savingsFV(2000, 350, r4, 59), 6);
    const old = source('spardauer-rechner').calculate({ targetAmount: 25000, monthlyContribution: 350, initialCapital: 2000, expectedReturn: 4 });
    expect(res.primary.value).toBe(old.primary.value);
  });

  it('Spardauer edge cases: 0 %, goal already reached, no savings, > 100 years', () => {
    const zero = sp.calculate({ mode: 'dauer', targetAmount: 25000, monthlyContribution: 350, initialAmount: 2000, annualRate: 0 });
    expect(zero.primary.value).toBe(Math.ceil(23000 / 350));
    const reached = sp.calculate({ mode: 'dauer', targetAmount: 1000, monthlyContribution: 50, initialAmount: 1000, annualRate: 2 });
    expect(reached.error).toBeUndefined();
    expect(reached.primary.value).toBe(0);
    const onlyInterest = sp.calculate({ mode: 'dauer', targetAmount: 10000, monthlyContribution: 0, initialAmount: 5000, annualRate: 2.5 });
    expect(onlyInterest.error).toBeUndefined();
    expect(onlyInterest.primary.value).toBe(Math.ceil(Math.log(2) / Math.log(1 + 0.025 / 12)));
    expectError(sp.calculate({ mode: 'dauer', targetAmount: 10000, monthlyContribution: 0, initialAmount: 5000, annualRate: 0 }));
    expectError(sp.calculate({ mode: 'dauer', targetAmount: 1e9, monthlyContribution: 1, initialAmount: 0, annualRate: 1 }));
  });

  it('Sparquote (sparrate-rechner): 640 € von 3.200 € = 20 %, also for the computed rate', () => {
    const res = sp.calculate({ mode: 'endkapital', initialAmount: 0, monthlyContribution: 640, annualRate: 3, years: 5, netIncome: 3200 });
    expect(secVal(res, 'savingsQuote')).toBeCloseTo(20, 10);
    const old = source('sparrate-rechner').calculate({ netIncome: 3200, monthlySavings: 640 });
    expect(secVal(res, 'savingsQuote')).toBeCloseTo(old.primary.value as number, 10);
    expect(nb(sec(res, 'savingsQuoteRating')?.formattedValue)).toContain('50-30-20');
    expect(secVal(res, 'annualSavings')).toBe(7680);

    const goal = sp.calculate({ mode: 'sparrate', targetAmount: 50000, initialAmount: 5000, annualRate: 4, years: 10, netIncome: 3200 });
    expect(secVal(goal, 'savingsQuote')).toBeCloseTo(((goal.primary.value as number) / 3200) * 100, 10);
    expect(nb(sec(goal, 'savingsQuoteRating')?.formattedValue)).toBe('unter 10 %');

    const none = sp.calculate({ mode: 'endkapital', initialAmount: 0, monthlyContribution: 640, annualRate: 3, years: 5, netIncome: 0 });
    expect(sec(none, 'savingsQuote')).toBeUndefined();
    const tooMuch = sp.calculate({ mode: 'dauer', targetAmount: 5000, monthlyContribution: 2000, initialAmount: 0, annualRate: 0, netIncome: 1500 });
    expect(tooMuch.warning).toBeTruthy();
    expectError(sp.calculate({ mode: 'endkapital', initialAmount: 0, monthlyContribution: 640, annualRate: 3, years: 5, netIncome: -1 }));
  });

  it('invalid input returns German errors and never throws', () => {
    const cases: Record<string, any>[] = [
      {},
      { mode: 'endkapital', initialAmount: 0, monthlyContribution: 0, annualRate: 3, years: 10 },
      { mode: 'endkapital', initialAmount: 100, monthlyContribution: 50, annualRate: -1, years: 10 },
      { mode: 'sparrate', targetAmount: '', initialAmount: 0, annualRate: 3, years: 10 },
      { mode: 'sparrate', targetAmount: 0, initialAmount: 0, annualRate: 3, years: 10 },
      { mode: 'sparrate', targetAmount: 10000, initialAmount: -1, annualRate: 3, years: 10 },
      { mode: 'sparrate', targetAmount: 10000, initialAmount: 0, annualRate: '', years: 10 },
      { mode: 'sparrate', targetAmount: 10000, initialAmount: 0, annualRate: 3, years: 0 },
      { mode: 'sparrate', targetAmount: 10000, initialAmount: 0, annualRate: 3, years: 2.5 },
      { mode: 'dauer', targetAmount: 10000, initialAmount: 0, annualRate: 3, monthlyContribution: -50 },
      { mode: 'dauer', targetAmount: -5, initialAmount: 0, annualRate: 3, monthlyContribution: 50 },
    ];
    for (const inputs of cases) {
      expect(() => sp.calculate(inputs), JSON.stringify(inputs)).not.toThrow();
      expectError(sp.calculate(inputs));
    }
    const long = sp.calculate({ mode: 'sparrate', targetAmount: 1000000, initialAmount: 0, annualRate: 5, years: 60 });
    expect(Number.isFinite(long.primary.value as number)).toBe(true);
  });
});

// ===========================================================================
// 4. Seiteninhalt: Metadaten, Beispiele, FAQs, Links
// ===========================================================================
describe('merged page content', () => {
  const TARGETS = ['ratenkreditrechner', 'tilgungsrechner', 'sparrechner'];
  const FORBIDDEN = ['präzise formelberechnung', 'verlässliche', 'für ihre planung', 'umfassend', 'ultimativ', 'im handumdrehen'];

  for (const slug of TARGETS) {
    it(`${slug}: metadata, examples, FAQs and links meet the bar`, () => {
      const c = calc(slug);
      expect(c.metaTitle.length).toBeLessThanOrEqual(60);
      expect(c.metaTitle).not.toMatch(/RechenHafen/i);
      expect(c.metaDescription.length).toBeLessThanOrEqual(155);
      expect(c.metaDescription.toLowerCase()).toContain('kostenlos');

      const ownFaqs = c.faqs.filter((f) => !f.question.includes('verbindlich'));
      expect(ownFaqs.length).toBeGreaterThanOrEqual(4);
      expect(ownFaqs.length).toBeLessThanOrEqual(6);
      expect(c.content?.sections?.length).toBeGreaterThanOrEqual(2);
      expect(c.content?.sections?.length).toBeLessThanOrEqual(4);

      const examples = c.workedExamples ?? [];
      expect(examples.length).toBeGreaterThanOrEqual(2);
      for (const ex of [c.workedExample, ...examples]) {
        const res = c.calculate(ex.inputs!);
        expect(res.error, ex.title).toBeUndefined();
        const shown = nb(res.primary.formattedValue).split(' (')[0];
        expect(ex.resultSummary, ex.title).toContain(shown);
      }

      const text = JSON.stringify(c).toLowerCase();
      for (const phrase of FORBIDDEN) expect(text, phrase).not.toContain(phrase);

      for (const rel of c.relatedSlugs) {
        expect(RETIRED_CALCULATORS[rel], rel).toBeUndefined();
        expect(getCalculatorBySlug(rel), rel).toBeDefined();
      }
      const links = [...JSON.stringify(c).matchAll(/\]\(\/rechner\/([^/)]+)\/\)/g)].map((m) => m[1]);
      expect(links.length).toBeGreaterThan(0);
      for (const l of links) {
        expect(RETIRED_CALCULATORS[l], l).toBeUndefined();
        expect(getCalculatorBySlug(l), l).toBeDefined();
      }
    });
  }

  it('keeps the main search terms of the retired sources', () => {
    const kw = (slug: string) => calc(slug).searchKeywords;
    expect(kw('ratenkreditrechner')).toEqual(expect.arrayContaining(['kreditrechner', 'kreditlaufzeit berechnen', 'ballonfinanzierung rechner', 'gesamtzinsen kredit berechnen', 'modernisierungskredit rechner']));
    expect(kw('tilgungsrechner')).toEqual(expect.arrayContaining(['baufinanzierung rechner', 'volltilger rechner', 'restschuld rechner', 'kredit ohne eigenkapital rechner']));
    expect(kw('sparrechner')).toEqual(expect.arrayContaining(['sparziel rechner', 'spardauer berechnen', 'sparquote berechnen', 'sparrate rechner']));
  });

  it('mode-specific inputs are only shown for their mode', () => {
    const dep = (slug: string, id: string) => calc(slug).inputs.find((i) => i.id === id)?.dependsOn;
    expect(dep('ratenkreditrechner', 'termMonths')).toEqual({ field: 'mode', value: 'rate' });
    expect(dep('ratenkreditrechner', 'monthlyPayment')).toEqual({ field: 'mode', value: 'laufzeit' });
    expect(dep('ratenkreditrechner', 'balloonPayment')).toEqual({ field: 'showExtras', value: true });
    expect(dep('tilgungsrechner', 'initialRepayment')).toEqual({ field: 'tilgungMode', value: 'anfangstilgung' });
    expect(dep('tilgungsrechner', 'purchasePrice')).toEqual({ field: 'useFinancing', value: true });
    expect(dep('tilgungsrechner', 'loanAmount')).toEqual({ field: 'useFinancing', value: false });
    expect(dep('sparrechner', 'targetAmount')).toEqual({ field: 'mode', value: ['sparrate', 'dauer'] });
    expect(dep('sparrechner', 'years')).toEqual({ field: 'mode', value: ['endkapital', 'sparrate'] });
  });
});
