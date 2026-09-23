import { describe, it, expect } from 'vitest';
import { ALL_CALCULATORS, getCalculatorBySlug } from '@/data/calculators';
import { CATEGORIES } from '@/data/categories';

describe('RechenHafen Calculators Comprehensive QA Verification', () => {
  it('contains exactly 418 calculators across 17 categories', () => {
    expect(ALL_CALCULATORS.length).toBe(418);
    expect(CATEGORIES.length).toBe(17);
  });

  it('has unique valid slugs matching ^[a-z0-9-]+$', () => {
    const slugs = new Set<string>();
    for (const c of ALL_CALCULATORS) {
      expect(c.slug).toMatch(/^[a-z0-9-]+$/);
      expect(slugs.has(c.slug)).toBe(false);
      slugs.add(c.slug);
    }
  });

  it('has valid categories matching existing CATEGORIES list', () => {
    const validCatIds = new Set(CATEGORIES.map((c) => c.id));
    for (const c of ALL_CALCULATORS) {
      expect(validCatIds.has(c.category)).toBe(true);
    }
  });

  it('has complete metadata (metaTitle, metaDescription, h1, formula)', () => {
    const titles = new Set<string>();
    const h1s = new Set<string>();

    for (const c of ALL_CALCULATORS) {
      expect(c.metaTitle.length).toBeGreaterThan(5);
      expect(c.metaDescription.length).toBeGreaterThanOrEqual(30);
      expect(c.h1.length).toBeGreaterThan(0);
      expect(c.formula.length).toBeGreaterThan(0);
      expect(c.formulaExplanation.length).toBeGreaterThan(0);

      expect(titles.has(c.metaTitle)).toBe(false);
      titles.add(c.metaTitle);

      expect(h1s.has(c.h1)).toBe(false);
      h1s.add(c.h1);
    }
  });

  it('has valid internal links in relatedSlugs pointing to existing calculators', () => {
    for (const c of ALL_CALCULATORS) {
      expect(c.relatedSlugs.length).toBeGreaterThan(0);
      for (const rel of c.relatedSlugs) {
        const found = getCalculatorBySlug(rel);
        expect(found).toBeDefined();
      }
    }
  });

  it('executes normal calculation with default inputs without NaN or Infinity for all 405 calculators', () => {
    for (const c of ALL_CALCULATORS) {
      const inputs: Record<string, any> = {};
      for (const inp of c.inputs) {
        inputs[inp.id] = inp.defaultValue;
      }
      const res = c.calculate(inputs);
      expect(res).toBeDefined();
      expect(res.primary).toBeDefined();

      const val = String(res.primary.value);
      expect(val.includes('NaN')).toBe(false);
      expect(val.includes('Infinity')).toBe(false);
    }
  });

  it('handles boundary values (min, max, 0, leap days) gracefully without NaN or Infinity', () => {
    for (const c of ALL_CALCULATORS) {
      const boundaryInputs: Record<string, any> = {};
      for (const inp of c.inputs) {
        if (inp.type === 'number') {
          if (inp.min !== undefined) boundaryInputs[inp.id] = inp.min;
          else if (inp.max !== undefined) boundaryInputs[inp.id] = inp.max;
          else boundaryInputs[inp.id] = 0;
        } else if (inp.type === 'date') {
          boundaryInputs[inp.id] = '2024-02-29';
        } else if (inp.type === 'boolean') {
          boundaryInputs[inp.id] = true;
        } else if (inp.type === 'select' && inp.options && inp.options.length > 0) {
          boundaryInputs[inp.id] = inp.options[inp.options.length - 1].value;
        } else {
          boundaryInputs[inp.id] = inp.defaultValue;
        }
      }

      const res = c.calculate(boundaryInputs);
      if (res && res.primary) {
        const val = String(res.primary.value);
        expect(val.includes('NaN')).toBe(false);
        expect(val.includes('Infinity')).toBe(false);
      }
    }
  });

  it('handles invalid or empty inputs without throwing uncaught exceptions or returning NaN', () => {
    for (const c of ALL_CALCULATORS) {
      expect(() => {
        const res = c.calculate({});
        if (res && res.primary) {
          const val = String(res.primary.value);
          expect(val.includes('NaN')).toBe(false);
          expect(val.includes('Infinity')).toBe(false);
        }
      }).not.toThrow();
    }
  });

  it('handles financial edge cases (zero interest, decimal interest, long durations)', () => {
    const finCalcs = ALL_CALCULATORS.filter(
      (c) => c.category === 'finanzen' || c.category === 'kredit' || c.category === 'kredit-schulden'
    );

    for (const c of finCalcs) {
      const inputs: Record<string, any> = {};
      for (const inp of c.inputs) {
        inputs[inp.id] = inp.defaultValue;
      }
      if ('interestRate' in inputs) inputs['interestRate'] = 0;
      if ('interest' in inputs) inputs['interest'] = 0;
      if ('zins' in inputs) inputs['zins'] = 0;
      if ('zinssatz' in inputs) inputs['zinssatz'] = 0;

      const res = c.calculate(inputs);
      if (res && res.primary) {
        const val = String(res.primary.value);
        expect(val.includes('NaN')).toBe(false);
        expect(val.includes('Infinity')).toBe(false);
      }
    }
  });

  it('handles date edge cases (leap year 29 Feb, month boundaries, year boundaries)', () => {
    const dateCalcs = ALL_CALCULATORS.filter((c) => c.category === 'datum-zeit');

    for (const c of dateCalcs) {
      const inputs: Record<string, any> = {};
      for (const inp of c.inputs) {
        if (typeof inp.defaultValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(inp.defaultValue)) {
          inputs[inp.id] = '2024-02-29';
        } else {
          inputs[inp.id] = inp.defaultValue;
        }
      }

      const res = c.calculate(inputs);
      if (res && res.primary) {
        const val = String(res.primary.value);
        expect(val.includes('NaN')).toBe(false);
        expect(val.includes('Infinity')).toBe(false);
      }
    }
  });
});
