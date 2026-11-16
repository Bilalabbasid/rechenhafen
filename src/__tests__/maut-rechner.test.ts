import { describe, it, expect } from 'vitest';
import { ALL_CALCULATORS } from '@/data/calculators';

describe('Mautrechner Alpen (autobahn-maut-rechner-vignette)', () => {
  const calc = ALL_CALCULATORS.find((c) => c.slug === 'autobahn-maut-rechner-vignette')!;

  it('exists in the registry with valid metadata and single truth sources', () => {
    expect(calc).toBeDefined();
    expect(calc.slug).toBe('autobahn-maut-rechner-vignette');
    expect(calc.timeSensitiveMeta?.sourceUrl).toContain('asfinag.at');
    expect(calc.timeSensitiveMeta?.lastVerified).toBe('2026-11-16');
  });

  it('calculates Austrian 1-day vignette accurately with official 2026 ASFINAG rate (9,60 €)', () => {
    const res = calc.calculate({ countryRoute: 'at_1day' });
    expect(res.primary.value).toBe(9.60);
    expect(res.primary.formattedValue).toBe('9,60 €');

    const vignetteItem = res.secondary?.find((s) => s.id === 'vignettePart');
    const routeTollItem = res.secondary?.find((s) => s.id === 'routeTollPart');
    expect(vignetteItem?.value).toBe(9.60);
    expect(routeTollItem?.value).toBe(0.00);
  });

  it('calculates Austrian 10-day vignette accurately with official 2026 ASFINAG rate (12,80 €)', () => {
    const res = calc.calculate({ countryRoute: 'at_10days' });
    expect(res.primary.value).toBe(12.80);
    expect(res.primary.formattedValue).toBe('12,80 €');

    const vignetteItem = res.secondary?.find((s) => s.id === 'vignettePart');
    const routeTollItem = res.secondary?.find((s) => s.id === 'routeTollPart');
    expect(vignetteItem?.value).toBe(12.80);
    expect(routeTollItem?.value).toBe(0.00);
  });

  // Streckenmaut 2026 (ASFINAG, Pkw-Einzelfahrt): A13 Brenner 12,50 € (2025: 12,00 €), A10 Tauern 15,00 € (2025: 14,50 €)
  it('calculates 10-day vignette plus Brenner A13 roundtrip (12,80 € + 25,00 € = 37,80 €)', () => {
    const res = calc.calculate({ countryRoute: 'at_brenner' });
    expect(res.primary.value).toBeCloseTo(37.80, 10);
    expect(res.primary.formattedValue).toBe('37,80 €');

    const vignetteItem = res.secondary?.find((s) => s.id === 'vignettePart');
    const routeTollItem = res.secondary?.find((s) => s.id === 'routeTollPart');
    expect(vignetteItem?.value).toBe(12.80);
    expect(routeTollItem?.value).toBe(25.00);
  });

  it('calculates 10-day vignette plus Tauern A10 roundtrip (12,80 € + 30,00 € = 42,80 €)', () => {
    const res = calc.calculate({ countryRoute: 'at_tauern' });
    expect(res.primary.value).toBeCloseTo(42.80, 10);
    expect(res.primary.formattedValue).toBe('42,80 €');

    const vignetteItem = res.secondary?.find((s) => s.id === 'vignettePart');
    const routeTollItem = res.secondary?.find((s) => s.id === 'routeTollPart');
    expect(vignetteItem?.value).toBe(12.80);
    expect(routeTollItem?.value).toBe(30.00);
  });

  it('accurately specifies Swiss statutory 40 CHF vignette and Italian A22 route toll', () => {
    const chRes = calc.calculate({ countryRoute: 'ch_year' });
    expect(chRes.primary.value).toBe(42.00);
    expect(chRes.summaryText).toContain('40,00 CHF');

    const itRes = calc.calculate({ countryRoute: 'it_brenner_gardasee' });
    expect(itRes.primary.value).toBe(33.60);
    const routeTollItem = itRes.secondary?.find((s) => s.id === 'routeTollPart');
    expect(routeTollItem?.value).toBe(33.60);
  });

  it('does not overpromise Europe-wide or France routing', () => {
    expect(calc.content?.intro).not.toContain('Frankreich');
    expect(calc.content?.details).toContain('kein europaweiter Routenplaner');
  });
});
