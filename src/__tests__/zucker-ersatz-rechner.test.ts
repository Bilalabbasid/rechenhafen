import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';

describe('Zucker in Erythrit Umrechner (zucker-ersatz-rechner)', () => {
  const calc = getCalculatorBySlug('zucker-ersatz-rechner')!;

  it('exists and has the exact required metadata', () => {
    expect(calc).toBeDefined();
    expect(calc.slug).toBe('zucker-ersatz-rechner');
    expect(calc.metaTitle).toBe('Zucker in Erythrit umrechnen: Rechner & Tabelle');
    expect(calc.metaDescription).toBe(
      'Wie viel Erythrit statt Zucker? Mengen kostenlos umrechnen, Beispiele nachschlagen und Süßkraft mit Xylit vergleichen. Hinweise fürs Backen inklusive.'
    );
    expect(calc.h1).toBe('Zucker in Erythrit umrechnen: Rechner & Tabelle');
  });

  it('calculates the exact required conversion table values for sugar -> erythrit (70% sweetness assumption)', () => {
    const tableCases = [
      { sugar: 50, expectedErythrit: 71 },
      { sugar: 100, expectedErythrit: 143 },
      { sugar: 150, expectedErythrit: 214 },
      { sugar: 200, expectedErythrit: 286 },
      { sugar: 250, expectedErythrit: 357 },
    ];

    for (const { sugar, expectedErythrit } of tableCases) {
      const res = calc.calculate({
        direction: 'sugar_to_sub',
        sugarGrams: sugar,
        substitute: 'erythrit',
      });
      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(expectedErythrit);
      expect(res.primary.formattedValue).toBe(`${expectedErythrit} g`);
    }
  });

  it('calculates the exact required reverse conversion values for erythrit -> sugar (70% sweetness assumption)', () => {
    const reverseCases = [
      { erythrit: 50, expectedSugar: 35 },
      { erythrit: 80, expectedSugar: 56 },
      { erythrit: 100, expectedSugar: 70 },
    ];

    for (const { erythrit, expectedSugar } of reverseCases) {
      const res = calc.calculate({
        direction: 'erythrit_to_sugar',
        erythritGrams: erythrit,
      });
      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(expectedSugar);
      expect(res.primary.formattedValue).toBe(`${expectedSugar} g Zucker`);
    }
  });

  it('preserves other sweeteners and distinct assumptions in forward direction', () => {
    // Xylit 1:1
    const resXylit = calc.calculate({
      direction: 'sugar_to_sub',
      sugarGrams: 100,
      substitute: 'xylit',
    });
    expect(resXylit.primary.value).toBe(100);

    // Honig ca. 80 g
    const resHoney = calc.calculate({
      direction: 'sugar_to_sub',
      sugarGrams: 100,
      substitute: 'honey',
    });
    expect(resHoney.primary.value).toBe(80);

    // Agave ca. 75 g
    const resAgave = calc.calculate({
      direction: 'sugar_to_sub',
      sugarGrams: 100,
      substitute: 'agave',
    });
    expect(resAgave.primary.value).toBe(75);
  });

  it('ensures zero stays zero for sugar and erythrit directions', () => {
    const resZero = calc.calculate({
      direction: 'sugar_to_sub',
      sugarGrams: 0,
      substitute: 'erythrit',
    });
    expect(resZero.error).toBeUndefined();
    expect(resZero.primary.value).toBe(0);
    expect(resZero.primary.formattedValue).toBe('0 g');

    const resReverseZero = calc.calculate({
      direction: 'erythrit_to_sugar',
      erythritGrams: 0,
    });
    expect(resReverseZero.error).toBeUndefined();
    expect(resReverseZero.primary.value).toBe(0);
    expect(resReverseZero.primary.formattedValue).toBe('0 g Zucker');
  });

  it('rejects empty and negative inputs with clear error explanations', () => {
    // Empty sugar grams
    const resEmptySugar = calc.calculate({
      direction: 'sugar_to_sub',
      sugarGrams: '',
      substitute: 'erythrit',
    });
    expect(resEmptySugar.error).toBe('Bitte geben Sie die Zuckermenge im Rezept in Gramm ein.');
    expect(resEmptySugar.primary.formattedValue).toBe('-');

    // Empty erythrit grams
    const resEmptyEry = calc.calculate({
      direction: 'erythrit_to_sugar',
      erythritGrams: '',
    });
    expect(resEmptyEry.error).toBe('Bitte geben Sie die Erythritmenge in Gramm ein.');
    expect(resEmptyEry.primary.formattedValue).toBe('-');

    // Negative values
    const resNegSugar = calc.calculate({
      direction: 'sugar_to_sub',
      sugarGrams: -50,
      substitute: 'erythrit',
    });
    expect(resNegSugar.error).toBe('Die Zuckermenge darf nicht negativ sein.');

    const resNegEry = calc.calculate({
      direction: 'erythrit_to_sugar',
      erythritGrams: -30,
    });
    expect(resNegEry.error).toBe('Die Erythritmenge darf nicht negativ sein.');
  });

  it('has corrected typos and accurate animal-safety FAQ', () => {
    const faqs = calc.faqs || [];
    const caramFaq = faqs.find((f) => f.question.includes('Karamellisiert'));
    expect(caramFaq).toBeDefined();
    expect(JSON.stringify(calc)).not.toContain('Karadellisiert');

    const petFaq = faqs.find((f) => f.question.includes('Haustiere'));
    expect(petFaq).toBeDefined();
    expect(petFaq?.answer).toContain('Xylit');
    expect(petFaq?.answer).toContain('Hunde');
    expect(petFaq?.answer).not.toContain('Gewichtsverlust garantiert');
  });
});
