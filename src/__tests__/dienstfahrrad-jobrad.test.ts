import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';

describe('Dienstfahrrad / JobRad Rechner QA & Legal Compliance', () => {
  const calc = getCalculatorBySlug('dienstfahrrad-jobrad-rechner');
  if (!calc) throw new Error('dienstfahrrad-jobrad-rechner not found in registry');

  it('calculates 3.500 € UVP correctly to 8,00 € taxable monthly benefit', () => {
    // UVP 3.500 € -> 3.500 / 4 = 875 € -> abgerundet 800 € -> 1 % = 8,00 €
    const res = calc.calculate({
      bikePriceGross: 3500,
      grossSalary: 3800,
      employerSubsidy: 0,
      serviceCost: 10,
      taxClass: '1',
    });

    const benefitItem = res.secondary?.find((s) => s.id === 'benefit');
    expect(benefitItem).toBeDefined();
    expect(benefitItem?.value).toBe(8);
    expect(benefitItem?.formattedValue).toBe('8,00\u00a0€');
  });

  it('proves rounding happens AFTER quartering (e.g. 3.100 € and 3.300 €)', () => {
    // UVP 3.100 €:
    // 1. Vierteln: 3.100 / 4 = 775 €
    // 2. Abrunden auf volle 100 €: 700 € (nicht 775 €)
    // 3. 1 % davon: 7,00 €
    const res3100 = calc.calculate({
      bikePriceGross: 3100,
      grossSalary: 3800,
      employerSubsidy: 0,
      serviceCost: 10,
      taxClass: '1',
    });
    const benefit3100 = res3100.secondary?.find((s) => s.id === 'benefit');
    expect(benefit3100?.value).toBe(7);

    // UVP 3.300 €:
    // 1. Vierteln: 3.300 / 4 = 825 €
    // 2. Abrunden auf volle 100 €: 800 €
    // 3. 1 % davon: 8,00 €
    const res3300 = calc.calculate({
      bikePriceGross: 3300,
      grossSalary: 3800,
      employerSubsidy: 0,
      serviceCost: 10,
      taxClass: '1',
    });
    const benefit3300 = res3300.secondary?.find((s) => s.id === 'benefit');
    expect(benefit3300?.value).toBe(8);
  });

  it('handles zero employer subsidy correctly', () => {
    const res = calc.calculate({
      bikePriceGross: 3500,
      grossSalary: 3800,
      employerSubsidy: 0,
      serviceCost: 10,
      taxClass: '1',
    });

    const grossDeduction = res.secondary?.find((s) => s.id === 'grossDeduction');
    // Leasingrate (3500 * 0.029 = 101.50) + 10 service - 0 subsidy = 111.50 €
    expect(grossDeduction?.value).toBeCloseTo(111.5, 2);
  });

  it('handles positive employer subsidy correctly', () => {
    const res = calc.calculate({
      bikePriceGross: 3500,
      grossSalary: 3800,
      employerSubsidy: 40,
      serviceCost: 10,
      taxClass: '1',
    });

    const grossDeduction = res.secondary?.find((s) => s.id === 'grossDeduction');
    // Leasingrate (101.50) + 10 service - 40 subsidy = 71.50 €
    expect(grossDeduction?.value).toBeCloseTo(71.5, 2);
  });

  it('handles missing or zero optional insurance value correctly without falling back to default', () => {
    // Explizit 0 € Versicherung
    const resZero = calc.calculate({
      bikePriceGross: 3500,
      grossSalary: 3800,
      employerSubsidy: 0,
      serviceCost: 0,
      taxClass: '1',
    });
    const grossDeductionZero = resZero.secondary?.find((s) => s.id === 'grossDeduction');
    expect(grossDeductionZero?.value).toBeCloseTo(101.5, 2);

    // Fehlender Wert (undefined) -> wird als 0 € behandelt
    const resMissing = calc.calculate({
      bikePriceGross: 3500,
      grossSalary: 3800,
      employerSubsidy: 0,
      taxClass: '1',
    });
    const grossDeductionMissing = resMissing.secondary?.find((s) => s.id === 'grossDeduction');
    expect(grossDeductionMissing?.value).toBeCloseTo(101.5, 2);
  });

  it('verifies legal footnotes and BMF source link are present', () => {
    expect(calc.legalFootnotes).toBeDefined();
    expect(calc.legalFootnotes?.length).toBeGreaterThan(0);

    const bmfFootnote = calc.legalFootnotes?.find((fn) =>
      fn.url?.includes('bundesfinanzministerium.de/lsth/2025/B-Anhaenge/Anhang-24/IV/IV-4/inhalt.html')
    );
    expect(bmfFootnote).toBeDefined();
    expect(bmfFootnote?.text).toContain('abgerundeten Viertels');

    expect(calc.timeSensitiveMeta?.sourceUrl).toBe(
      'https://amtliche-handbuecher.bundesfinanzministerium.de/lsth/2025/B-Anhaenge/Anhang-24/IV/IV-4/inhalt.html'
    );
    expect(calc.timeSensitiveMeta?.lastVerified).toBe('2026-10-09');
  });

  it('verifies explanatory copy explicitly states S-Pedelec exceptions and RechenHafen independence', () => {
    const fullText = JSON.stringify(calc.content) + ' ' + JSON.stringify(calc.faqs);
    expect(fullText).toContain('S-Pedelec');
    expect(fullText).toContain('RechenHafen steht in kein');
  });
});
