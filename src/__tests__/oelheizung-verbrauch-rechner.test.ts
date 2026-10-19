import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';
import { formatCurrency } from '@/lib/formatters';

describe('Heizölverbrauch-Rechner (oelheizung-verbrauch-rechner)', () => {
  const calc = getCalculatorBySlug('oelheizung-verbrauch-rechner')!;

  it('exists with correct slug and metadata', () => {
    expect(calc).toBeDefined();
    expect(calc.slug).toBe('oelheizung-verbrauch-rechner');
    expect(calc.name).toBe('Heizölverbrauch schätzen: Wohnfläche und Dämmzustand');
    expect(calc.metaTitle).toBe('Heizölverbrauch berechnen: Liter & Kosten pro Jahr');
    expect(calc.h1).toBe('Heizölverbrauch berechnen: Liter & Kosten pro Jahr');
    expect(calc.metaDescription).toBe(
      'Heizölbedarf anhand von Wohnfläche und Dämmzustand schätzen. Liter pro Jahr und Kosten mit Ihrem eigenen Heizölpreis kostenlos berechnen.'
    );
  });

  it('calculates standard example correctly (140 m², standard 14 l/m²a, 1.05 €/l)', () => {
    const res = calc.calculate({
      livingArea: 140,
      insulationStandard: 'standard',
      oilPricePerLiter: 1.05,
    });

    expect(res.error).toBeUndefined();
    // 140 m² * 14 l/m² = 1,960 liters
    // 1,960 liters * 1.05 €/l = 2,058.00 €
    expect(res.primary.value).toBe(2058);
    expect(res.primary.formattedValue).toBe(formatCurrency(2058));

    const totalLitersItem = res.secondary?.find((s) => s.id === 'totalLiters');
    expect(totalLitersItem?.value).toBe(1960);
    expect(totalLitersItem?.formattedValue).toBe('ca. 1.960 Liter');

    const monthlyCostItem = res.secondary?.find((s) => s.id === 'monthlyCost');
    expect(monthlyCostItem?.value).toBeCloseTo(171.5);
    expect(monthlyCostItem?.formattedValue).toBe(formatCurrency(171.5));
  });

  it('calculates modern insulation correctly (8 l/m²a)', () => {
    const res = calc.calculate({
      livingArea: 100,
      insulationStandard: 'modern',
      oilPricePerLiter: 1.10,
    });

    // 100 m² * 8 l = 800 liters; 800 * 1.10 = 880.00 €
    expect(res.primary.value).toBe(880);
    expect(res.primary.formattedValue).toBe(formatCurrency(880));
  });

  it('calculates unrenovated insulation correctly (22 l/m²a)', () => {
    const res = calc.calculate({
      livingArea: 150,
      insulationStandard: 'unrenovated',
      oilPricePerLiter: 1.00,
    });

    // 150 m² * 22 l = 3,300 liters; 3,300 * 1.00 = 3,300.00 €
    expect(res.primary.value).toBe(3300);
    expect(res.primary.formattedValue).toBe(formatCurrency(3300));
  });

  it('ensures zero stays zero for living area and oil price', () => {
    // Zero living area
    const resZeroArea = calc.calculate({
      livingArea: 0,
      insulationStandard: 'standard',
      oilPricePerLiter: 1.05,
    });
    expect(resZeroArea.error).toBeUndefined();
    expect(resZeroArea.primary.value).toBe(0);
    expect(resZeroArea.primary.formattedValue).toBe(formatCurrency(0));
    const litersZero = resZeroArea.secondary?.find((s) => s.id === 'totalLiters');
    expect(litersZero?.value).toBe(0);

    // Zero oil price
    const resZeroPrice = calc.calculate({
      livingArea: 140,
      insulationStandard: 'standard',
      oilPricePerLiter: 0,
    });
    expect(resZeroPrice.error).toBeUndefined();
    expect(resZeroPrice.primary.value).toBe(0);
    expect(resZeroPrice.primary.formattedValue).toBe(formatCurrency(0));
    const litersStandard = resZeroPrice.secondary?.find((s) => s.id === 'totalLiters');
    expect(litersStandard?.value).toBe(1960);
  });

  it('rejects empty inputs and explains errors instead of silently calculating defaults', () => {
    // Empty living area
    const resEmptyArea = calc.calculate({
      livingArea: '',
      insulationStandard: 'standard',
      oilPricePerLiter: 1.05,
    });
    expect(resEmptyArea.error).toBe('Bitte geben Sie die beheizte Wohnfläche in Quadratmetern ein.');
    expect(resEmptyArea.primary.formattedValue).toBe('-');

    // Empty oil price
    const resEmptyPrice = calc.calculate({
      livingArea: 140,
      insulationStandard: 'standard',
      oilPricePerLiter: '',
    });
    expect(resEmptyPrice.error).toBe('Bitte geben Sie den Heizölpreis in Euro pro Liter ein.');
    expect(resEmptyPrice.primary.formattedValue).toBe('-');
  });

  it('rejects negative numbers with clear error explanation', () => {
    const resNegArea = calc.calculate({
      livingArea: -50,
      insulationStandard: 'standard',
      oilPricePerLiter: 1.05,
    });
    expect(resNegArea.error).toBe('Die beheizte Wohnfläche darf nicht negativ sein.');

    const resNegPrice = calc.calculate({
      livingArea: 140,
      insulationStandard: 'standard',
      oilPricePerLiter: -0.8,
    });
    expect(resNegPrice.error).toBe('Der Heizölpreis darf nicht negativ sein.');
  });

  it('consistently distinguishes fuel energy (Heizwert Hi) from useful heat and avoids false exact promises', () => {
    const res = calc.calculate({
      livingArea: 140,
      insulationStandard: 'standard',
      oilPricePerLiter: 1.05,
    });
    const kwhItem = res.secondary?.find((s) => s.id === 'kwhEquivalent');
    expect(kwhItem?.label).toContain('Heizwert Hi');

    expect(calc.formulaExplanation).toContain('Brennstoff-Energiegehalt (Heizwert Hi)');
    expect(calc.formulaExplanation).toContain('ohne Kesselwirkungsgrad');

    const tankstandSection = calc.content?.sections?.find((s) => s.title.includes('Tankstände'));
    expect(tankstandSection?.content).not.toContain('exakt ermitteln');
    expect(tankstandSection?.content).toContain('präzisen Ablesung');
  });

  it('renders a complete worked example with narrative description and mathematical steps', () => {
    expect(calc.workedExample).toBeDefined();
    expect(calc.workedExample.title).toBe('Beispiel: 140 m² Wohnfläche bei 14 Liter/m²a und 1,05 €/Liter');
    expect(calc.workedExample.description).toBeDefined();
    expect(calc.workedExample.description).toContain('140 m²');
    expect(calc.workedExample.description).toContain('14 Litern');
    expect(calc.workedExample.description).toContain('1.960 Liter');
    expect(calc.workedExample.description).toContain('2.058,00 €');
    expect(calc.workedExample.description).toContain('171,50 €');
    expect(calc.workedExample.description).toContain('Modellschätzung');

    expect(calc.workedExample.steps).toBeDefined();
    expect(Array.isArray(calc.workedExample.steps)).toBe(true);
    expect(calc.workedExample.steps).toHaveLength(3);
    expect(calc.workedExample.steps[0]).toContain('140 m² × 14 Liter/m²/Jahr = 1.960 Liter/Jahr');
    expect(calc.workedExample.steps[1]).toContain('1.960 Liter × 1,05 €/Liter = 2.058,00 €/Jahr');
    expect(calc.workedExample.steps[2]).toContain('2.058,00 € ÷ 12 Monate = 171,50 €/Monat');

    expect(calc.workedExample.result).toContain('2.058,00 €');
    expect(calc.workedExample.result).toContain('171,50 €/Monat');

    // Tank balance guide accessible near the calculator
    expect(calc.content?.intro).toContain('/ratgeber/heizoelverbrauch-aus-tankstand-berechnen/');
  });
});
