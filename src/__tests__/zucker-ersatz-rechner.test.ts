import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';

describe('Zucker in Erythrit Umrechner (zucker-ersatz-rechner)', () => {
  const calc = getCalculatorBySlug('zucker-ersatz-rechner')!;

  it('exists and has the exact required metadata', () => {
    expect(calc).toBeDefined();
    expect(calc.slug).toBe('zucker-ersatz-rechner');
    expect(calc.metaTitle).toBe('Zucker in Erythrit umrechnen: Rechner & Tabelle');
    expect(calc.metaDescription).toBe(
      'Zucker in Erythrit und Erythrit in Zucker umrechnen: kostenloser Rechner mit Tabellen für beide Richtungen und Hinweisen zur Süßkraft.'
    );
    expect(calc.h1).toBe('Zucker in Erythrit umrechnen: Rechner & Tabelle');
  });

  it('calculates the exact required conversion table values for sugar -> erythrit (70% sweetness assumption)', () => {
    const tableCases = [
      { sugar: 50, expectedErythrit: 71 },
      { sugar: 100, expectedErythrit: 143 },
      { sugar: 120, expectedErythrit: 171 },
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

    // Verify forward table in content contains 120 g row
    const forwardSection = calc.content?.sections?.find((s) => s.title.includes('Umrechnungstabelle') && !s.title.includes('Rückrechnung'));
    expect(forwardSection?.content).toContain('| 120 g | 171 g |');
  });

  it('calculates the exact required reverse conversion values for erythrit -> sugar (70% sweetness assumption)', () => {
    const reverseCases = [
      { erythrit: 50, expectedSugar: 35 },
      { erythrit: 60, expectedSugar: 42 },
      { erythrit: 80, expectedSugar: 56 },
      { erythrit: 100, expectedSugar: 70 },
      { erythrit: 120, expectedSugar: 84 },
      { erythrit: 150, expectedSugar: 105 },
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

    // Honig at 120 % sweetness: 100 / 1.20 = 83.33 -> 83 g
    const resHoney = calc.calculate({
      direction: 'sugar_to_sub',
      sugarGrams: 100,
      substitute: 'honey',
    });
    expect(resHoney.primary.value).toBe(83);
    const honeyLiquid = resHoney.secondary?.find((s) => s.id === 'liquidTip');
    expect(honeyLiquid?.formattedValue).toContain('Richtwert: Teigflüssigkeit um ca.');

    // Agave at 125 % sweetness: 100 / 1.25 = 80 g
    const resAgave = calc.calculate({
      direction: 'sugar_to_sub',
      sugarGrams: 100,
      substitute: 'agave',
    });
    expect(resAgave.primary.value).toBe(80);
    const agaveLiquid = resAgave.secondary?.find((s) => s.id === 'liquidTip');
    expect(agaveLiquid?.formattedValue).toContain('Richtwert: Teigflüssigkeit um ca.');

    // Reines Erythrit liquid limitation
    const resErythrit = calc.calculate({
      direction: 'sugar_to_sub',
      sugarGrams: 100,
      substitute: 'erythrit',
    });
    const eryLiquid = resErythrit.secondary?.find((s) => s.id === 'liquidTip');
    expect(eryLiquid?.formattedValue).toBe('Der Rechner berechnet keine Anpassung der Teigflüssigkeit. Beachten Sie die Hinweise Ihres Rezepts.');
  });

  it('provides consistent and transparent option labels without misleading names', () => {
    const dirInput = calc.inputs.find((i) => i.id === 'direction');
    expect(dirInput?.options?.[0].label).toBe('Zucker durch eine Alternative ersetzen (Zucker → Alternative)');
    expect(dirInput?.options?.[1].label).toBe('Erythrit in Zucker-Süßkraft umrechnen (Erythrit → Zucker)');

    const subInput = calc.inputs.find((i) => i.id === 'substitute');
    const agaveOpt = subInput?.options?.find((o) => o.value === 'agave');
    expect(agaveOpt?.label).toBe('Agavendicksaft (ca. 125 % Süßkraft – ca. 80 g je 100 g Zucker)');

    const honeyOpt = subInput?.options?.find((o) => o.value === 'honey');
    expect(honeyOpt?.label).toBe('Honig (ca. 120 % Süßkraft – ca. 83 g je 100 g Zucker)');
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

  it('provides reverse-conversion table for 60, 80, 100, 120, 125 and 150 g Erythrit and explains tablespoon volume distinction', () => {
    // 60 g -> 42 g
    expect(calc.calculate({ direction: 'erythrit_to_sugar', erythritGrams: 60 }).primary.value).toBe(42);
    // 80 g -> 56 g
    expect(calc.calculate({ direction: 'erythrit_to_sugar', erythritGrams: 80 }).primary.value).toBe(56);
    // 100 g -> 70 g
    expect(calc.calculate({ direction: 'erythrit_to_sugar', erythritGrams: 100 }).primary.value).toBe(70);
    // 120 g -> 84 g
    expect(calc.calculate({ direction: 'erythrit_to_sugar', erythritGrams: 120 }).primary.value).toBe(84);
    // 125 g -> 88 g (Math.round(125 * 0.70))
    expect(calc.calculate({ direction: 'erythrit_to_sugar', erythritGrams: 125 }).primary.value).toBe(88);
    // 150 g -> 105 g
    expect(calc.calculate({ direction: 'erythrit_to_sugar', erythritGrams: 150 }).primary.value).toBe(105);

    // Section table check
    const reverseSection = calc.content?.sections?.find((s) => s.title.includes('Rückrechnung & Tabelle'));
    expect(reverseSection).toBeDefined();
    expect(reverseSection?.content).toContain('| 60 g | 42 g Zucker |');
    expect(reverseSection?.content).toContain('| 80 g | 56 g Zucker |');
    expect(reverseSection?.content).toContain('| 100 g | 70 g Zucker |');
    expect(reverseSection?.content).toContain('| 120 g | 84 g Zucker |');
    expect(reverseSection?.content).toContain('| 125 g | 87,5 g Zucker');
    expect(reverseSection?.content).toContain('| 150 g | 105 g Zucker |');

    // Tablespoon volume/weight distinction check
    const tbSection = calc.content?.sections?.find((s) => s.title.includes('Esslöffel'));
    expect(tbSection).toBeDefined();
    expect(tbSection?.content).toContain('Hohlmaß für das Volumen');
    expect(tbSection?.content).toContain('keine universelle Gramm-pro-Esslöffel-Umrechnung');
    expect(tbSection?.content).toContain('Küchenwaage');
  });
});

