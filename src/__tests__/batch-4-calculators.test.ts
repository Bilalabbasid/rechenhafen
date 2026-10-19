import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';

export const BATCH_4_SLUGS = [
  // Group 1: Core Bauen & Bodenbeläge (3)
  'farbmengen-rechner',
  'bodenbelag-rechner',
  'betonrechner',

  // Group 2: Core Geometrie (3)
  'kreisrechner',
  'zylinderrechner',
  'rechteckrechner',

  // Group 3: Core Einheiten (1)
  'laengen-umrechner',

  // Group 4: Extra Einheiten & Formate (5)
  'flaeche-umrechner',
  'volumen-umrechner',
  'zoll-in-cm-rechner',
  'papierformat-din-rechner',
  'dichte-umrechner',

  // Group 5: Extra Bauen & Renovieren (16)
  'estrich-rechner',
  'dachflaeche-rechner',
  'bausteine-mauerwerk-rechner',
  'fliesenkleber-rechner',
  'aushub-erdarbeiten-rechner',
  'pflastersteine-rechner',
  'trockenbau-gipskarton-rechner',
  'fundament-rechner',
  'fassadenfarbe-rechner',
  'parkett-laminat-rechner',
  'tapetenrollen-rechner',
  'putz-rechner',
  'zaun-pfosten-rechner',
  'treppen-stufen-rechner',
  'holz-balken-durchbiegung-rechner',
  'beton-mischungsverhaeltnis-rechner',

  // Group 6: Extra Geometrie (22)
  'dreieck-flaeche-rechner',
  'kreis-umfang-rechner',
  'kegel-volumen-rechner',
  'hohlzylinder-rohr-rechner',
  'pyramide-volumen-rechner',
  'trapez-flaeche-rechner',
  'parallelogramm-rechner',
  'rhombus-raute-rechner',
  'kugel-oberflaeche-rechner',
  'quader-volumen-rechner',
  'prisma-volumen-rechner',
  'sechseck-polygon-rechner',
  'ellipse-flaeche-rechner',
  'kreissegment-rechner',
  'bogenmass-grad-rechner',
  'satz-des-pythagoras-rechner',
  'sinussatz-kosinussatz-rechner',
  'vektor-skalarprodukt-rechner',
  'torus-volumen-rechner',
  'stumpf-kegel-rechner',
  'dreiecks-hoehen-rechner',
  'goldener-schnitt-rechner',
];

describe('Batch 4 Calculators Comprehensive QA Suite (50 Calculators)', () => {
  it('contains exactly 50 calculators assigned to Batch 4', () => {
    expect(BATCH_4_SLUGS.length).toBe(50);
  });

  describe('1. Registry Resolution & Metadata Quality', () => {
    for (const slug of BATCH_4_SLUGS) {
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
    for (const slug of BATCH_4_SLUGS) {
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
            if (typeof sec.value === 'number') {
              expect(Number.isNaN(sec.value)).toBe(false);
              expect(Number.isFinite(sec.value)).toBe(true);
            }
            expect(sec.formattedValue).not.toContain('NaN');
            expect(sec.formattedValue).not.toContain('undefined');
          }
        }
      });
    }
  });

  describe('3. High-Confidence Audit Findings & Zero-Value Preservation', () => {
    // Finding: bausteine-mauerwerk-rechner (High Confidence finding in audit report)
    it('bausteine-mauerwerk-rechner preserves openingsArea = 0 and validates non-positive dimensions', () => {
      const calc = getCalculatorBySlug('bausteine-mauerwerk-rechner')!;
      // Zero openings
      const resZeroOpen = calc.calculate({
        wallLength: 6,
        wallHeight: 2.5,
        openingsArea: 0,
        stoneFormat: 'plan24',
        waste: 0,
      });
      // 6 * 2.5 = 15 m² gross and net area
      expect(resZeroOpen.primary.value).toBe(120); // 15 m² * 8 = 120
      expect(resZeroOpen.secondary?.find((s) => s.id === 'netArea')?.value).toBe(15);
      expect(resZeroOpen.error).toBeUndefined();

      // Zero dimensions
      const resZeroDim = calc.calculate({ wallLength: 0, wallHeight: 2.5 });
      expect(resZeroDim.error).toBeDefined();
      expect(resZeroDim.primary.value).toBe(0);
    });

    // farbmengen-rechner: zero deduction & zero reserve preserved
    it('farbmengen-rechner preserves openingDeductionSqm = 0 and wasteReservePercent = 0', () => {
      const calc = getCalculatorBySlug('farbmengen-rechner')!;
      const resZero = calc.calculate({
        roomLength: 5,
        roomWidth: 4,
        roomHeight: 2.5,
        openingDeductionSqm: 0,
        wasteReservePercent: 0,
        coats: 1,
        coveragePerLiter: 9,
      });
      // Wall area: 2 * (5 + 4) * 2.5 = 45 m²; 45 / 9 = 5 Liters
      expect(resZero.primary.value).toBe(5);
      expect(resZero.error).toBeUndefined();

      const resInvalid = calc.calculate({ roomLength: 0, roomWidth: 4, roomHeight: 2.5 });
      expect(resInvalid.error).toBeDefined();
      expect(resInvalid.primary.value).toBe(0);
    });

    // bodenbelag-rechner: wastePercent = 0 preserved
    it('bodenbelag-rechner preserves wastePercent = 0 and validates dimensions', () => {
      const calc = getCalculatorBySlug('bodenbelag-rechner')!;
      const resExact = calc.calculate({ length: 5, width: 4, wastePercent: 0, packSizeSqm: 2 });
      // 5 * 4 = 20 m²
      expect(resExact.primary.value).toBe(20);
      expect(resExact.secondary?.find((s) => s.id === 'packs')?.value).toBe(10);
      expect(resExact.error).toBeUndefined();

      const resZero = calc.calculate({ length: 0, width: 4 });
      expect(resZero.error).toBeDefined();
      expect(resZero.primary.value).toBe(0);
    });

    // betonrechner: validates dimensions
    it('betonrechner handles invalid dimensions gracefully', () => {
      const calc = getCalculatorBySlug('betonrechner')!;
      const resInvalid = calc.calculate({ lengthM: 0, widthM: 3, depthCm: 15 });
      expect(resInvalid.error).toBeDefined();
      expect(resInvalid.primary.value).toBe(0);

      const resValid = calc.calculate({ lengthM: 4, widthM: 3, depthCm: 15, bagWeightKg: 25 });
      expect(resValid.error).toBeUndefined();
      expect(resValid.primary.value).toBeCloseTo(1.8, 1);
    });

    // laengen-umrechner: value = 0 yields 0 (not 1)
    it('laengen-umrechner converts 0 meters to 0 feet without defaulting to 1', () => {
      const calc = getCalculatorBySlug('laengen-umrechner')!;
      const resZero = calc.calculate({ value: 0, fromUnit: 'm', toUnit: 'ft' });
      expect(resZero.primary.value).toBe(0);
      expect(resZero.primary.formattedValue).toContain('0');
      expect(resZero.summaryText).toContain('0');
    });

    // papierformat-din-rechner: sheetCount = 0 yields 0 weight
    it('papierformat-din-rechner preserves sheetCount = 0', () => {
      const calc = getCalculatorBySlug('papierformat-din-rechner')!;
      const resZero = calc.calculate({ dinFormat: 'a4', grammage: 80, sheetCount: 0 });
      expect(resZero.secondary?.find((s) => s.id === 'totalWeight')?.value).toBe(0);
      expect(resZero.primary.value).toBe(210); // A4 width
    });

    // treppen-stufen-rechner: floorHeight = 0 does not produce NaN
    it('treppen-stufen-rechner guards against division-by-zero on floorHeight = 0', () => {
      const calc = getCalculatorBySlug('treppen-stufen-rechner')!;
      const resZero = calc.calculate({ floorHeight: 0, idealStepHeight: 17.5, stepFormulaConstant: 63 });
      expect(resZero.error).toBeDefined();
      expect(resZero.primary.value).toBe(0);
      expect(resZero.secondary?.find((s) => s.id === 'stepHeight')?.value).toBe(0);
      expect(resZero.secondary?.find((s) => s.id === 'pitchAngle')?.value).toBe(0);
      expect(resZero.secondary?.find((s) => s.id === 'stepHeight')?.formattedValue).not.toContain('NaN');
    });

    // ellipse-flaeche-rechner: axisA = 0 does not produce NaN
    it('ellipse-flaeche-rechner guards against division-by-zero on axis = 0', () => {
      const calc = getCalculatorBySlug('ellipse-flaeche-rechner')!;
      const resZero = calc.calculate({ axisA: 0, axisB: 0 });
      expect(resZero.error).toBeDefined();
      expect(resZero.primary.value).toBe(0);
      expect(resZero.secondary?.find((s) => s.id === 'perimeter')?.value).toBe(0);
      expect(resZero.secondary?.find((s) => s.id === 'perimeter')?.formattedValue).not.toContain('NaN');
    });

    // sinussatz-kosinussatz-rechner: sideB = 0 does not produce NaN
    it('sinussatz-kosinussatz-rechner guards against division-by-zero when side is 0', () => {
      const calc = getCalculatorBySlug('sinussatz-kosinussatz-rechner')!;
      const resZero = calc.calculate({ sideA: 8, sideB: 0, angleGamma: 50 });
      expect(resZero.error).toBeDefined();
      expect(resZero.primary.value).toBe(0);
      expect(resZero.secondary?.find((s) => s.id === 'angleAlpha')?.value).toBe(0);
      expect(resZero.secondary?.find((s) => s.id === 'angleAlpha')?.formattedValue).not.toContain('NaN');
    });

    // holz-balken-durchbiegung-rechner: spanMeters = 0 does not produce NaN
    it('holz-balken-durchbiegung-rechner guards against division-by-zero when span is 0', () => {
      const calc = getCalculatorBySlug('holz-balken-durchbiegung-rechner')!;
      const resZero = calc.calculate({ spanMeters: 0, beamWidthCm: 10, beamHeightCm: 20 });
      expect(resZero.error).toBeDefined();
      expect(resZero.primary.value).toBe(0);
      expect(resZero.secondary?.find((s) => s.id === 'limit')?.value).toBe(0);
      expect(resZero.secondary?.find((s) => s.id === 'ratio')?.formattedValue).not.toContain('NaN');
    });

    // satz-des-pythagoras-rechner: validates hypotenuse > kathete
    it('satz-des-pythagoras-rechner validates hypotenuse greater than kathete', () => {
      const calc = getCalculatorBySlug('satz-des-pythagoras-rechner')!;
      const resInvalid = calc.calculate({ calcMode: 'a', val1: 10, val2: 8 }); // c = 8, b = 10 -> impossible
      expect(resInvalid.error).toBeDefined();
      expect(resInvalid.primary.value).toBe(0);

      const resValid = calc.calculate({ calcMode: 'c', val1: 3, val2: 4 });
      expect(resValid.primary.value).toBe(5);
      expect(resValid.error).toBeUndefined();
    });

    // dreiecks-hoehen-rechner: validates triangle inequality
    it('dreiecks-hoehen-rechner validates triangle inequality and provides dynamic summary', () => {
      const calc = getCalculatorBySlug('dreiecks-hoehen-rechner')!;
      const resDegenerate = calc.calculate({ sideA: 1, sideB: 2, sideC: 10 });
      expect(resDegenerate.error).toBeDefined();
      expect(resDegenerate.primary.value).toBe(0);

      const resValid = calc.calculate({ sideA: 6, sideB: 8, sideC: 10 });
      expect(resValid.error).toBeUndefined();
      expect(resValid.primary.value).toBeCloseTo(4.8, 1);
      expect(resValid.summaryText).toContain('6, 8, 10 cm');
    });

    // dachflaeche-rechner: validates pitch < 89
    it('dachflaeche-rechner rejects pitch >= 89 and 0 dimensions', () => {
      const calc = getCalculatorBySlug('dachflaeche-rechner')!;
      const res90 = calc.calculate({ houseLength: 10, houseWidth: 8, roofPitchDeg: 90 });
      expect(res90.error).toBeDefined();
      expect(res90.primary.value).toBe(0);

      const resValid = calc.calculate({ houseLength: 10, houseWidth: 8, roofPitchDeg: 45, overhang: 0, roofType: 'saddle' });
      expect(resValid.error).toBeUndefined();
      expect(resValid.primary.value).toBeGreaterThan(0);
    });

    // parkett-laminat-rechner: validates room dimensions
    it('parkett-laminat-rechner rejects 0 room dimensions', () => {
      const calc = getCalculatorBySlug('parkett-laminat-rechner')!;
      const resZero = calc.calculate({ roomLength: 0, roomWidth: 4 });
      expect(resZero.error).toBeDefined();
      expect(resZero.primary.value).toBe(0);
    });

    // tapetenrollen-rechner: rejects 0 room perimeter
    it('tapetenrollen-rechner rejects 0 perimeter and preserves 0 openings', () => {
      const calc = getCalculatorBySlug('tapetenrollen-rechner')!;
      const resZeroPerim = calc.calculate({ perimeter: 0, roomHeight: 2.5 });
      expect(resZeroPerim.error).toBeDefined();
      expect(resZeroPerim.primary.value).toBe(0);

      const resZeroOpen = calc.calculate({ perimeter: 16, roomHeight: 2.5, openingsCount: 0, patternRepeat: 0 });
      expect(resZeroOpen.error).toBeUndefined();
      expect(resZeroOpen.primary.value).toBeGreaterThan(0);
    });
  });
});
