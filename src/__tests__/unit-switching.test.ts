import { describe, it, expect } from 'vitest';
import { ALL_CALCULATORS, getCalculatorBySlug } from '@/data/calculators';
import {
  resolveFieldUnit,
  resolveFieldRange,
  convertFieldValue,
} from '@/components/calculator/CalculatorRunner';
import { formatMeasure } from '@/lib/formatters';

const defaultsOf = (slug: string) => {
  const c = getCalculatorBySlug(slug)!;
  const d: Record<string, any> = {};
  for (const i of c.inputs) d[i.id] = i.defaultValue;
  return { c, d };
};

describe('unit-linked inputs: site-wide guard', () => {
  it('every unitFromField has a unit for every option of its select', () => {
    const problems: string[] = [];
    for (const c of ALL_CALCULATORS) {
      for (const inp of c.inputs) {
        if (!inp.unitFromField) continue;
        const ctrl = c.inputs.find((i) => i.id === inp.unitFromField!.field);
        if (!ctrl) { problems.push(`${c.slug}.${inp.id}: control ${inp.unitFromField.field} missing`); continue; }
        for (const o of ctrl.options ?? []) {
          if (!inp.unitFromField.units[o.value]) problems.push(`${c.slug}.${inp.id}: no unit for ${ctrl.id}=${o.value}`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it('every convertOnChange covers all options and keeps the default valid after switching', () => {
    const problems: string[] = [];
    for (const c of ALL_CALCULATORS) {
      const convertible = c.inputs.filter((i) => i.convertOnChange);
      if (!convertible.length) continue;
      const fields = [...new Set(convertible.map((i) => i.convertOnChange!.field))];
      for (const field of fields) {
        const ctrl = c.inputs.find((i) => i.id === field)!;
        const base: Record<string, any> = {};
        for (const i of c.inputs) base[i.id] = i.defaultValue;
        for (const o of ctrl.options ?? []) {
          const next: Record<string, any> = { ...base, [field]: o.value };
          for (const dep of convertible.filter((i) => i.convertOnChange!.field === field)) {
            if (!(o.value in dep.convertOnChange!.factors)) problems.push(`${c.slug}.${dep.id}: no factor for ${o.value}`);
            next[dep.id] = convertFieldValue(dep, base[dep.id], String(base[field]), o.value);
            const range = resolveFieldRange(dep, next);
            const v = Number(next[dep.id]);
            if ((range.min !== undefined && v < range.min) || (range.max !== undefined && v > range.max)) {
              problems.push(`${c.slug}.${dep.id}=${v} outside ${range.min}–${range.max} for ${o.value}`);
            }
          }
          const r = c.calculate(next);
          if (r.error) problems.push(`${c.slug} ${field}=${o.value}: ${r.error}`);
        }
      }
    }
    expect(problems).toEqual([]);
  });
});

describe('BMI metric <-> imperial', () => {
  it('converts 78 kg / 180 cm to 172 lbs / 70.9 in and gives the same BMI', () => {
    const { c, d } = defaultsOf('bmi-rechner');
    const weight = c.inputs.find((i) => i.id === 'weight')!;
    const height = c.inputs.find((i) => i.id === 'height')!;
    const w = convertFieldValue(weight, 78, 'metric', 'imperial');
    const h = convertFieldValue(height, 180, 'metric', 'imperial');
    expect(w).toBe(172);
    expect(h).toBe(70.9);
    const metric = Number(c.calculate({ ...d, weight: 78, height: 180 }).primary.value);
    const imperial = Number(c.calculate({ ...d, unitSystem: 'imperial', weight: w, height: h }).primary.value);
    expect(imperial).toBeCloseTo(metric, 1);
    // and back
    expect(convertFieldValue(weight, w, 'imperial', 'metric')).toBe(78);
  });

  it('shows lbs / Zoll and scales the allowed range', () => {
    const { c } = defaultsOf('bmi-rechner');
    const height = c.inputs.find((i) => i.id === 'height')!;
    expect(resolveFieldUnit(height, { unitSystem: 'imperial' })).toBe('Zoll');
    expect(resolveFieldUnit(height, { unitSystem: 'metric' })).toBe('cm');
    const r = resolveFieldRange(height, { unitSystem: 'imperial' });
    expect(r.max).toBeCloseTo(260 * 0.393701, 1);
  });
});

describe('converters show the chosen unit, not a generic word', () => {
  it.each([
    ['gewicht-masse-umrechner', 'inputValue', 'inputUnit', 'lbs', 'lbs'],
    ['druck-umrechner', 'inputValue', 'inputUnit', 'psi', 'PSI'],
    ['geschwindigkeit-umrechner', 'inputValue', 'inputUnit', 'mph', 'mph'],
    ['zeit-umrechner', 'value', 'fromUnit', 'minutes', 'min'],
    ['co2-auto-rechner', 'consumption', 'fuelType', 'electric', 'kWh/100 km'],
    ['gaskostenrechner', 'pricePerKwh', 'priceUnit', 'ct', 'ct/kWh'],
  ])('%s.%s with %s=%s shows "%s"', (slug, field, ctrl, option, unit) => {
    const { c, d } = defaultsOf(slug);
    const def = c.inputs.find((i) => i.id === field)!;
    expect(resolveFieldUnit(def, { ...d, [ctrl]: option }, c.inputs)).toBe(unit);
  });

  it('Gaskosten: 0,10 €/kWh becomes 10 ct/kWh and the cost stays the same', () => {
    const { c, d } = defaultsOf('gaskostenrechner');
    const price = c.inputs.find((i) => i.id === 'pricePerKwh')!;
    const ct = convertFieldValue(price, 0.1, 'eur', 'ct');
    expect(ct).toBe(10);
    const eur = c.calculate({ ...d }).primary.value;
    const cents = c.calculate({ ...d, priceUnit: 'ct', pricePerKwh: ct }).primary.value;
    expect(cents).toBe(eur);
  });
});

describe('formatMeasure keeps tiny values visible', () => {
  it('never shows a non-zero value as 0', () => {
    expect(formatMeasure(0.000025, 4)).toBe('0,000025');
    expect(formatMeasure(0.0476, 0)).toBe('0,048');
    expect(formatMeasure(12.3456, 2)).toBe('12,35');
    expect(formatMeasure(0, 2)).toBe('0');
  });

  it('converters no longer report 0 for small inputs', () => {
    const cases: [string, Record<string, any>][] = [
      ['druck-umrechner', { inputValue: 2.5, inputUnit: 'pa' }],
      ['energie-arbeit-umrechner', { inputValue: 100, inputUnit: 'j' }],
      ['gewicht-masse-umrechner', { inputValue: 10, inputUnit: 'mg' }],
    ];
    for (const [slug, inputs] of cases) {
      const { c, d } = defaultsOf(slug);
      const r = c.calculate({ ...d, ...inputs });
      expect(r.primary.formattedValue, slug).not.toMatch(/^0 /);
    }
  });
});

describe('answer sentences use German decimals and real unit symbols', () => {
  it('normalizeResultText fixes decimals and upper-cased codes but keeps dates and thousands', async () => {
    const { normalizeResultText } = await import('@/lib/resultText');
    const { c } = defaultsOf('druck-umrechner');
    const r = normalizeResultText(
      { primary: { label: 'x', value: 1 }, summaryText: '2.5 PA entsprechen 0,000025 bar. Am 01.03.2026 und 01.03. kosten 10.000 € je 1.5 Std.' },
      c.inputs,
    );
    expect(r.summaryText).toBe('2,5 Pa entsprechen 0,000025 bar. Am 01.03.2026 und 01.03. kosten 10.000 € je 1,5 Std.');
  });

  it('no calculator answer sentence shows an English decimal point after clean-up', async () => {
    const { normalizeResultText } = await import('@/lib/resultText');
    const offenders: string[] = [];
    for (const c of ALL_CALCULATORS) {
      const nums = c.inputs.filter((i) => i.type === 'number');
      if (!nums.length) continue;
      const d: Record<string, any> = {};
      for (const i of c.inputs) d[i.id] = i.defaultValue;
      d[nums[0].id] = (Number(d[nums[0].id]) || 1) + 0.5;
      let r;
      try { r = c.calculate(d); } catch { continue; }
      if (r.error) continue;
      const text = [normalizeResultText(r, c.inputs).summaryText, normalizeResultText(r, c.inputs).directAnswer].join(' ');
      if (/(^|[^\d.,])\d+\.\d{1,2}(?![\d.])/.test(text)) offenders.push(`${c.slug}: ${text.slice(0, 80)}`);
    }
    expect(offenders).toEqual([]);
  });
});
