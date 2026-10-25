import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';

const BATCH_1_SLUGS = [
  'brutto-netto-rechner',
  'netto-brutto-rechner',
  'einkommensteuerrechner',
  'grenzsteuersatz-rechner',
  'solidaritaetszuschlag-rechner',
  'kirchensteuer-rechner',
  'sozialabgaben-rechner',
  'arbeitgeberkosten-rechner',
  'minijob-rechner',
  'midijob-rechner',
  'bonus-netto-rechner',
  'abfindungsrechner',
  'renten-brutto-netto-rechner',
  'umsatzsteuerrechner',
  'gewerbesteuer-rechner',
  'stundenlohnrechner',
  'teilzeit-gehaltsrechner',
  'gehaltserhoehung-rechner',
  'urlaubstage-rechner',
  'kurzarbeitergeld-rechner',
  'minijob-midijob-rechner',
  'arbeitgeberanteil-sozialversicherung-rechner',
  'kuendigungsfrist-arbeitnehmer-rechner',
  'ueberstunden-auszahlung-rechner',
  'firmenwagen-geldwerter-vorteil-rechner',
  'krankengeld-rechner',
  'mutterschaftsgeld-rechner',
  'elternzeit-teilzeit-rechner',
  'nachtzuschlag-sonntagszuschlag-rechner',
  'vermoegenswirksame-leistungen-rechner',
  'betriebliche-altersvorsorge-rechner',
  'jahresgehalt-in-monatsgehalt-rechner',
  'brutto-stundensatz-freiberufler-rechner',
  'urlaubsabgeltung-rechner',
  'arbeitslosengeld-1-rechner',
  'dienstjubilaeum-steuerfrei-rechner',
  'buergergeld-anspruch-rechner',
  'sabbatical-rechner',
  'dienstaufwandsentschaedigung-rechner',
  'mwst-rechner',
  'rabattrechner',
  'skontorechner',
  'marge-rechner',
  'abschreibung-linear-degressiv-rechner',
  'skonto-jahreszins-rechner',
  'wareneinsatzquote-rechner',
  'lagerumschlagshaeufigkeit-rechner',
  'stundensatz-kalkulation-freiberufler-rechner',
  'umsatzrentabilitaet-rechner',
];

describe('Batch 1 Calculators Comprehensive QA Suite (50 Calculators)', () => {
  it('contains exactly 50 calculators assigned to Batch 1', () => {
    // 50 → 49: abfindung-fuenftelregelung-rechner wurde in abfindungsrechner zusammengeführt (301)
    expect(BATCH_1_SLUGS.length).toBe(49);
  });

  describe('1. Registry Resolution & Metadata Quality', () => {
    for (const slug of BATCH_1_SLUGS) {
      it(`resolves ${slug} with valid metadata and calculation function`, () => {
        const calc = getCalculatorBySlug(slug);
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
    for (const slug of BATCH_1_SLUGS) {
      it(`calculates valid default outputs without NaN for ${slug}`, () => {
        const calc = getCalculatorBySlug(slug);
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

  describe('3. Valid Zero-Value Handling (No False Fallback to Defaults)', () => {
    it('midijob-rechner preserves 0 € gross earnings without fallback to default', () => {
      const calc = getCalculatorBySlug('midijob-rechner')!;
      const result = calc.calculate({ earnings: 0 });
      expect(result.primary.value).toBe(0);
      expect(result.primary.formattedValue).toContain('0,00');
    });

    it('bonus-netto-rechner preserves 0 € bonus and 0 € regular salary', () => {
      const calc = getCalculatorBySlug('bonus-netto-rechner')!;
      const resBonusZero = calc.calculate({ regularGrossYear: 50000, bonus: 0, taxClass: '1' });
      expect(resBonusZero.primary.value).toBe(0);
      expect(resBonusZero.primary.formattedValue).toContain('0,00');

      const resAllZero = calc.calculate({ regularGrossYear: 0, bonus: 0, taxClass: '1' });
      expect(resAllZero.primary.value).toBe(0);
      expect(resAllZero.primary.formattedValue).toContain('0,00');
    });

    it('abfindungsrechner preserves 0 € income during sabbatical/severance year', () => {
      const calc = getCalculatorBySlug('abfindungsrechner')!;
      const result = calc.calculate({ regularIncome: 0, abfindung: 50000, taxClass: '1' });
      expect(result.primary.value).toBeGreaterThan(0);
      expect(result.secondary?.find((s) => s.id === 'taxSavings')?.value).toBeGreaterThan(0);
    });

    it('gehaltserhoehung-rechner preserves 0 % increase (salary freeze)', () => {
      const calc = getCalculatorBySlug('gehaltserhoehung-rechner')!;
      const result = calc.calculate({ currentSalary: 4000, increasePercent: 0, period: 'month' });
      expect(result.primary.value).toBe(4000);
      expect(result.secondary?.find((s) => s.id === 'monthlyPlus')?.value).toBe(0);
    });

    it('urlaubstage-rechner handles 0 workdaysPerWeek without false division', () => {
      const calc = getCalculatorBySlug('urlaubstage-rechner')!;
      const result = calc.calculate({ standardVacationDays: 30, workdaysPerWeek: 0, standardWeekDays: 5 });
      expect(result.primary.value).toBe(0);
      expect(result.primary.formattedValue).toContain('0 Urlaubstage');
    });

    it('skonto-jahreszins-rechner preserves 0 % skonto without fallback to 3.0 %', () => {
      const calc = getCalculatorBySlug('skonto-jahreszins-rechner')!;
      const result = calc.calculate({ invoiceGross: 5000, skontoPercent: 0, skontoDays: 10, netDays: 30, creditInterestPct: 0 });
      expect(result.primary.value).toBe(0);
      expect(result.primary.formattedValue).toContain('0 %');
      expect(result.secondary?.find((s) => s.id === 'savingsEuro')?.value).toBe(0);
    });

    it('stundensatz-kalkulation-freiberufler-rechner preserves 0 € business expenses', () => {
      const calc = getCalculatorBySlug('stundensatz-kalkulation-freiberufler-rechner')!;
      const resultWithZero = calc.calculate({ desiredNetAnnual: 45000, businessExpensesAnnual: 0, vacationAndSickDays: 45, billableRatioPct: 60 });
      const resultWithDefault = calc.calculate({ desiredNetAnnual: 45000, businessExpensesAnnual: 12000, vacationAndSickDays: 45, billableRatioPct: 60 });
      // 0 expenses should produce a lower required rate than 12.000 € expenses
      expect(Number(resultWithZero.primary.value)).toBeLessThan(Number(resultWithDefault.primary.value));
    });

    it('kuendigungsfrist-arbeitnehmer-rechner handles 0 years of tenure (§ 622 Abs. 1 BGB: 4 Wochen)', () => {
      const calc = getCalculatorBySlug('kuendigungsfrist-arbeitnehmer-rechner')!;
      const result = calc.calculate({ yearsEmployed: 0, initiator: 'employer' });
      expect(result.primary.formattedValue).toContain('4 Wochen');
    });

    it('ueberstunden-auszahlung-rechner preserves 0 % overtime bonus', () => {
      const calc = getCalculatorBySlug('ueberstunden-auszahlung-rechner')!;
      const res0 = calc.calculate({ monthlyGross: 3500, weeklyHours: 40, overtimeHours: 10, bonusPct: 0 });
      const res25 = calc.calculate({ monthlyGross: 3500, weeklyHours: 40, overtimeHours: 10, bonusPct: 25 });
      expect(Number(res0.primary.value)).toBeLessThan(Number(res25.primary.value));
    });

    it('nachtzuschlag-sonntagszuschlag-rechner preserves 0 % surcharge', () => {
      const calc = getCalculatorBySlug('nachtzuschlag-sonntagszuschlag-rechner')!;
      const result = calc.calculate({ hourlyWage: 0, workedHours: 8, surchargeType: 'sunday' });
      expect(result.primary.value).toBe(0);
      expect(result.primary.formattedValue).toContain('0,00');
    });

    it('abschreibung-linear-degressiv-rechner handles 0 € asset cost without NaN', () => {
      const calc = getCalculatorBySlug('abschreibung-linear-degressiv-rechner')!;
      const result = calc.calculate({ assetCost: 0, usefulLifeYears: 5, afaMethod: 'linear' });
      expect(result.primary.value).toBe(0);
      expect(result.primary.formattedValue).toContain('0,00');
    });

    it('wareneinsatzquote-rechner handles 0 € cost of goods sold', () => {
      const calc = getCalculatorBySlug('wareneinsatzquote-rechner')!;
      const result = calc.calculate({ revenueNet: 50000, costOfGoods: 0, sectorType: 'gastroFood' });
      expect(result.primary.value).toBe(0);
      expect(result.primary.formattedValue).toContain('0');
    });

    it('lagerumschlagshaeufigkeit-rechner handles 0 € cost of goods sold without NaN', () => {
      const calc = getCalculatorBySlug('lagerumschlagshaeufigkeit-rechner')!;
      const result = calc.calculate({ costOfGoodsSold: 0, avgInventoryValue: 50000 });
      expect(result.primary.value).toBe(0);
      expect(result.primary.formattedValue).toContain('0');
    });

    it('umsatzrentabilitaet-rechner handles 0 € profit cleanly (Break-Even)', () => {
      const calc = getCalculatorBySlug('umsatzrentabilitaet-rechner')!;
      const result = calc.calculate({ revenue: 1000000, profit: 0 });
      expect(result.primary.value).toBe(0);
      expect(result.primary.formattedValue).toContain('0');
      expect(result.secondary?.find((s) => s.id === 'rating')?.formattedValue).toContain('Break-Even');
    });
  });

  describe('4. Division-by-Zero and Boundary Protection', () => {
    it('umsatzrentabilitaet-rechner does not divide by zero when revenue is 0', () => {
      const calc = getCalculatorBySlug('umsatzrentabilitaet-rechner')!;
      const result = calc.calculate({ revenue: 0, profit: 5000 });
      expect(Number.isNaN(result.primary.value)).toBe(false);
      expect(Number.isFinite(result.primary.value)).toBe(true);
      expect(result.summaryText).toContain('größer als 0 €');
    });

    it('wareneinsatzquote-rechner does not divide by zero when revenueNet is 0', () => {
      const calc = getCalculatorBySlug('wareneinsatzquote-rechner')!;
      const result = calc.calculate({ revenueNet: 0, costOfGoods: 1000 });
      expect(Number.isNaN(result.primary.value)).toBe(false);
      expect(Number.isFinite(result.primary.value)).toBe(true);
    });

    it('lagerumschlagshaeufigkeit-rechner does not divide by zero when avgInventoryValue is 0', () => {
      const calc = getCalculatorBySlug('lagerumschlagshaeufigkeit-rechner')!;
      const result = calc.calculate({ costOfGoodsSold: 100000, avgInventoryValue: 0 });
      expect(Number.isNaN(result.primary.value)).toBe(false);
      expect(Number.isFinite(result.primary.value)).toBe(true);
    });

    it('stundenlohnrechner returns error on 0 weekly hours', () => {
      const calc = getCalculatorBySlug('stundenlohnrechner')!;
      const result = calc.calculate({ monthlySalary: 3000, weeklyHours: 0 });
      expect(result.error).toBeDefined();
    });

    it('teilzeit-gehaltsrechner returns error on 0 fullTimeHours', () => {
      const calc = getCalculatorBySlug('teilzeit-gehaltsrechner')!;
      const result = calc.calculate({ fullTimeGross: 4000, fullTimeHours: 0, partTimeHours: 20 });
      expect(result.error).toBeDefined();
    });
  });

  describe('5. Worked Example Consistency', () => {
    for (const slug of BATCH_1_SLUGS) {
      it(`has valid workedExample for ${slug}`, () => {
        const calc = getCalculatorBySlug(slug);
        expect(calc).toBeDefined();
        if (!calc || !calc.workedExample) return;

        const we = calc.workedExample as any;
        if (we?.title) {
          expect(we.title.length).toBeGreaterThan(5);
        }
        if (we?.inputValues) {
          expect(we.inputValues.length).toBeGreaterThan(0);
          expect(we.steps.length).toBeGreaterThan(0);
          expect(we.result.length).toBeGreaterThan(0);
        } else if (we?.inputs) {
          expect(Object.keys(we.inputs).length).toBeGreaterThan(0);
          expect(we.resultSummary.length).toBeGreaterThan(0);
        }
      });
    }
  });
});
