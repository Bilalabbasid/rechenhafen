import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug, getCalculatorDefinitionBySlug } from '@/data/calculators';
import { RETIRED_CALCULATORS } from '@/data/seo/retired-calculators';
import { dateToDayNumber, dayNumberToDate, formatDateGerman, getBerlinTodayString, parseDateParts } from '@/lib/calculators/dateMath';
import type { CalculationResult, CalculatorDefinition } from '@/types/calculator';

const sec = (r: CalculationResult, id: string) => r.secondary?.find((s) => s.id === id);

const defaultsOf = (calc: CalculatorDefinition) =>
  Object.fromEntries(calc.inputs.map((i) => [i.id, i.defaultValue]));

const MERGES: Array<{ target: string; sources: string[]; keywords: string[] }> = [
  { target: 'bmi-rechner', sources: ['idealgewicht-creff-rechner'], keywords: ['idealgewicht berechnen'] },
  { target: 'kalorienbedarf-rechner', sources: ['grundumsatz-bmr-rechner', 'leistungsumsatz-pal-rechner'], keywords: ['grundumsatz berechnen', 'pal wert'] },
  { target: 'puls-trainingszonen-rechner', sources: ['maximalpuls-hfmax-rechner'], keywords: ['maximalpuls berechnen'] },
  { target: 'waist-to-hip-ratio-rechner', sources: ['waist-to-height-ratio-rechner'], keywords: ['waist to height ratio'] },
  { target: 'zykluslaenge-eisprung-rechner', sources: ['fruchtbare-tage-rechner'], keywords: ['fruchtbare tage berechnen'] },
  { target: 'erstausstattung-baby-rechner', sources: ['windelbudget-rechner'], keywords: ['windeln kosten baby'] },
];

const FORBIDDEN = [
  'präzise Formelberechnung',
  'verlässliche Ergebnisse',
  'verlässlichen Ergebnissen',
  'für Ihre Planung',
  'umfassend',
  'ultimativ',
  'im Handumdrehen',
];

describe('Gesundheit/Familie merges: page quality and redirects', () => {
  for (const { target, sources, keywords } of MERGES) {
    describe(target, () => {
      const calc = getCalculatorBySlug(target)!;

      it('is live and every source is retired and redirects here', () => {
        expect(calc).toBeDefined();
        for (const s of sources) {
          expect(getCalculatorBySlug(s)).toBeUndefined();
          expect(RETIRED_CALCULATORS[s]).toBe(`/rechner/${target}/`);
        }
      });

      it('meets the SEO and content bar', () => {
        expect(calc.metaTitle.length).toBeLessThanOrEqual(60);
        expect(calc.metaTitle).not.toContain('RechenHafen');
        expect(calc.metaDescription.length).toBeLessThanOrEqual(155);
        expect(calc.metaDescription.toLowerCase()).toContain('kostenlos');
        for (const kw of keywords) expect(calc.searchKeywords).toContain(kw);
        expect((calc.workedExamples ?? []).length).toBeGreaterThanOrEqual(2);
        const ownFaqs = calc.faqs.filter((f) => !f.question.includes('verbindlich'));
        expect(ownFaqs.length).toBeGreaterThanOrEqual(4);
        expect(ownFaqs.length).toBeLessThanOrEqual(6);
        const sections = calc.content?.sections ?? [];
        expect(sections.length).toBeGreaterThanOrEqual(2);
        expect(sections.length).toBeLessThanOrEqual(4);

        const text = JSON.stringify([calc.metaTitle, calc.metaDescription, calc.h1, calc.shortDescription, calc.content, calc.faqs, calc.workedExamples, calc.formulaExplanation]);
        for (const phrase of FORBIDDEN) expect(text.includes(phrase), `${target}: "${phrase}"`).toBe(false);
      });

      it('links only to live calculators', () => {
        const def = getCalculatorDefinitionBySlug(target)!;
        for (const rel of def.relatedSlugs) {
          expect(RETIRED_CALCULATORS[rel], `${target} relatedSlug ${rel}`).toBeUndefined();
          expect(getCalculatorBySlug(rel), `${target} relatedSlug ${rel}`).toBeDefined();
        }
        const text = JSON.stringify([def.content, def.faqs, def.workedExamples]);
        for (const m of text.matchAll(/\]\(\/rechner\/([a-z0-9-]+)\/\)/g)) {
          expect(RETIRED_CALCULATORS[m[1]], `${target} links to ${m[1]}`).toBeUndefined();
          expect(getCalculatorBySlug(m[1]), `${target} links to ${m[1]}`).toBeDefined();
        }
      });

      it('gives a result for the default inputs and never throws on empty input', () => {
        const r = calc.calculate(defaultsOf(calc));
        expect(r.error).toBeUndefined();
        expect(String(r.primary.value)).not.toMatch(/NaN|Infinity/);
        expect(() => calc.calculate({})).not.toThrow();
      });
    });
  }
});

describe('BMI-Rechner absorbs Idealgewicht (Creff)', () => {
  const calc = getCalculatorBySlug('bmi-rechner')!;

  it('defaults: 78 kg, 180 cm, 35 Jahre → BMI 24,1, Normalgewicht 59,9–80,7 kg, Creff 75,15 kg', () => {
    const r = calc.calculate(defaultsOf(calc));
    expect(Number(r.primary.value)).toBeCloseTo(78 / 1.8 ** 2, 6);
    expect(sec(r, 'category')?.formattedValue).toBe('Normalgewicht');
    expect(sec(r, 'normalRange')?.formattedValue).toBe('59,9 kg – 80,7 kg');
    expect(Number(sec(r, 'creffIdealWeight')?.value)).toBeCloseTo((80 + 3.5) * 0.9, 6);
    expect(sec(r, 'ageNote')).toBeUndefined();
  });

  it('Creff body-frame factors 0,9 / 1,0 / 1,1 match the published formula', () => {
    const base = (h: number, a: number) => ((h - 100) + a / 10) * 0.9;
    for (const [frame, f] of [['small', 0.9], ['medium', 1], ['large', 1.1]] as const) {
      const r = calc.calculate({ unitSystem: 'metric', weight: 72, height: 165, age: 70, bodyFrame: frame });
      expect(Number(sec(r, 'creffIdealWeight')?.value)).toBeCloseTo(base(165, 70) * f, 6);
    }
  });

  it('matches the retired Idealgewicht-Creff calculator', () => {
    const source = getCalculatorDefinitionBySlug('idealgewicht-creff-rechner')!;
    const s = source.calculate({ heightCm: 172, ageYears: 41, bodyFrame: 'large' });
    const r = calc.calculate({ unitSystem: 'metric', weight: 70, height: 172, age: 41, bodyFrame: 'large' });
    expect(Number(sec(r, 'creffIdealWeight')?.value)).toBeCloseTo(Number(s.primary.value), 6);
    expect(Number(sec(r, 'brocaNormal')?.value)).toBe(72);
  });

  it('shows the distance to the healthy range and the age note from 65 years', () => {
    const r = calc.calculate({ unitSystem: 'metric', weight: 72, height: 165, age: 70, bodyFrame: 'small' });
    expect(Number(r.primary.value)).toBeCloseTo(72 / 1.65 ** 2, 6);
    expect(sec(r, 'category')?.formattedValue).toContain('Übergewicht');
    expect(Number(sec(r, 'distanceToRange')?.value)).toBeCloseTo(72 - 24.9 * 1.65 ** 2, 6);
    expect(sec(r, 'ageNote')?.formattedValue).toContain('GLIM');
  });

  it('keeps old callers without age working (no Creff, no error)', () => {
    const r = calc.calculate({ weight: 70, height: 175 });
    expect(r.error).toBeUndefined();
    expect(Number(r.primary.value)).toBeCloseTo(22.857, 2);
    expect(sec(r, 'creffIdealWeight')).toBeUndefined();
  });

  it('works in imperial units', () => {
    const r = calc.calculate({ unitSystem: 'imperial', weight: 176.37, height: 70.866, age: 40, bodyFrame: 'medium' });
    expect(Number(r.primary.value)).toBeCloseTo(24.69, 1);
    expect(sec(r, 'normalRange')?.formattedValue).toContain('lbs');
    expect(sec(r, 'creffIdealWeight')?.formattedValue).toContain('lbs');
  });

  it('rejects implausible input with German errors', () => {
    expect(calc.calculate({ weight: 0, height: 175, age: 30 }).error).toBeTruthy();
    expect(calc.calculate({ weight: -5, height: 175, age: 30 }).error).toBeTruthy();
    expect(calc.calculate({ weight: 70, height: 300, age: 30 }).error).toContain('Körpergröße');
    expect(calc.calculate({ weight: 70, height: 50, age: 30 }).error).toContain('Körpergröße');
    expect(calc.calculate({ weight: 70, height: 175, age: 5 }).error).toContain('Perzentil');
    expect(calc.calculate({ weight: 70, height: 175, age: 150 }).error).toContain('Alter');
    expect(calc.calculate({ weight: 'abc', height: 175, age: 30 }).error).toBeTruthy();
  });

  it('flags a BMI far outside the normal range', () => {
    expect(calc.calculate({ weight: 130, height: 175, age: 40 }).warning).toBeTruthy();
    expect(calc.calculate({ weight: 70, height: 175, age: 40 }).warning).toBeUndefined();
  });
});

describe('Kalorienbedarf-Rechner absorbs Grundumsatz and PAL-Leistungsumsatz', () => {
  const calc = getCalculatorBySlug('kalorienbedarf-rechner')!;

  it('Mifflin-St Jeor (Mifflin et al. 1990): Mann 32 J, 75 kg, 178 cm, PAL 1,4', () => {
    const r = calc.calculate(defaultsOf(calc));
    const bmr = 10 * 75 + 6.25 * 178 - 5 * 32 + 5;
    expect(Number(sec(r, 'bmr')?.value)).toBeCloseTo(bmr, 6);
    expect(Number(r.primary.value)).toBeCloseTo(bmr * 1.4, 6);
    expect(Number(sec(r, 'activityKcal')?.value)).toBeCloseTo(bmr * 0.4, 6);
    expect(Number(sec(r, 'pal')?.value)).toBe(1.4);
    expect(r.calculationSteps?.length).toBe(4);
  });

  it('Harris-Benedict (Roza & Shizgal 1984) with goal "lose" and Mifflin comparison', () => {
    const r = calc.calculate({ formula: 'harris_benedict', gender: 'female', age: 45, weight: 68, height: 165, activityLevel: '1.6', sportKcalPerDay: 0, goal: 'lose' });
    const hb = 447.593 + 9.247 * 68 + 3.098 * 165 - 4.33 * 45;
    expect(Number(sec(r, 'bmr')?.value)).toBeCloseTo(hb, 6);
    expect(Number(sec(r, 'tdee')?.value)).toBeCloseTo(hb * 1.6, 6);
    expect(Number(r.primary.value)).toBeCloseTo(hb * 1.6 - 500, 6);
    expect(Number(sec(r, 'bmrComparison')?.value)).toBeCloseTo(10 * 68 + 6.25 * 165 - 5 * 45 - 161, 6);
  });

  it('own measured BMR + PAL 1,8 + sport + goal "gain" (ported Leistungsumsatz logic)', () => {
    const r = calc.calculate({ formula: 'known', bmrKnown: 1650, activityLevel: '1.8', sportKcalPerDay: 250, goal: 'gain' });
    expect(r.error).toBeUndefined();
    expect(Number(sec(r, 'tdee')?.value)).toBeCloseTo(1650 * 1.8 + 250, 6);
    expect(Number(r.primary.value)).toBeCloseTo(1650 * 1.8 + 250 + 300, 6);
    expect(sec(r, 'bmrComparison')).toBeUndefined();
  });

  it('matches the retired Grundumsatz and Leistungsumsatz calculators', () => {
    const bmrSource = getCalculatorDefinitionBySlug('grundumsatz-bmr-rechner')!.calculate({ gender: 'female', weightKg: 68, heightCm: 168, ageYears: 32 });
    const r1 = calc.calculate({ formula: 'mifflin', gender: 'female', age: 32, weight: 68, height: 168, activityLevel: '1.4', goal: 'maintain' });
    expect(Number(sec(r1, 'bmr')?.value)).toBeCloseTo(Number(bmrSource.primary.value), 6);
    expect(Number(sec(r1, 'bmrComparison')?.value)).toBeCloseTo(Number(bmrSource.secondary?.find((s) => s.id === 'bmrHarris')?.value), 6);

    const palSource = getCalculatorDefinitionBySlug('leistungsumsatz-pal-rechner')!.calculate({ bmrKcal: 1450, palLevel: 'heavy', sportKcalPerDay: 200 });
    const r2 = calc.calculate({ formula: 'known', bmrKnown: 1450, activityLevel: '2.0', sportKcalPerDay: 200, goal: 'maintain' });
    expect(Number(r2.primary.value)).toBeCloseTo(Number(palSource.primary.value), 6);
    expect(Number(sec(r2, 'activityKcal')?.value)).toBeCloseTo(Number(palSource.secondary?.find((s) => s.id === 'leistungsumsatz')?.value), 6);
  });

  it('offers all five DGE PAL levels', () => {
    const pal = calc.inputs.find((i) => i.id === 'activityLevel')!;
    expect(pal.options?.map((o) => o.value)).toEqual(['1.2', '1.4', '1.6', '1.8', '2.0']);
  });

  it('keeps the 1.200-kcal floor and warns when the target is below the BMR', () => {
    const small = calc.calculate({ formula: 'mifflin', gender: 'female', age: 80, weight: 40, height: 150, activityLevel: '1.2', goal: 'lose' });
    expect(Number(small.primary.value)).toBe(1200);
    const big = calc.calculate({ formula: 'mifflin', gender: 'male', age: 30, weight: 120, height: 190, activityLevel: '1.2', goal: 'lose' });
    expect(big.warning).toContain('Grundumsatz');
  });

  it('rejects implausible input', () => {
    const base = { formula: 'mifflin', gender: 'male', age: 30, weight: 80, height: 180, activityLevel: '1.4', goal: 'maintain' };
    expect(calc.calculate({ ...base, age: 5 }).error).toContain('14 Jahren');
    expect(calc.calculate({ ...base, height: 300 }).error).toContain('Körpergröße');
    expect(calc.calculate({ ...base, weight: 0 }).error).toBeTruthy();
    expect(calc.calculate({ ...base, weight: '' }).error).toBeTruthy();
    expect(calc.calculate({ ...base, sportKcalPerDay: -100 }).error).toContain('Sport');
    expect(calc.calculate({ formula: 'known', bmrKnown: '', activityLevel: '1.4' }).error).toContain('Grundumsatz');
    expect(calc.calculate({ formula: 'known', bmrKnown: 300, activityLevel: '1.4' }).error).toContain('800');
  });
});

describe('Puls-Trainingszonen-Rechner absorbs Maximalpuls (HFmax)', () => {
  const calc = getCalculatorBySlug('puls-trainingszonen-rechner')!;

  it('defaults: Tanaka (208 − 0,7 × 35 ≈ 184 bpm), Zone 2 = 110–129 bpm', () => {
    const r = calc.calculate(defaultsOf(calc));
    expect(Number(sec(r, 'hfMax')?.value)).toBe(184);
    expect(r.primary.formattedValue).toBe('110 - 129 bpm');
    expect(Number(sec(r, 'hfMaxComparison')?.value)).toBe(185);
  });

  it('Tanaka et al. 2001 and 220 − Alter over the adult age range', () => {
    for (const age of [20, 35, 50, 65, 80]) {
      const t = calc.calculate({ hfMaxMethod: 'tanaka', ageYears: age, zoneMethod: 'hfmax' });
      expect(Number(sec(t, 'hfMax')?.value)).toBe(Math.round(208 - 0.7 * age));
      const f = calc.calculate({ hfMaxMethod: 'fox', ageYears: age, zoneMethod: 'hfmax' });
      expect(Number(sec(f, 'hfMax')?.value)).toBe(220 - age);
    }
  });

  it('Karvonen: Ruhepuls + (HFmax − Ruhepuls) × Intensität', () => {
    const r = calc.calculate({ hfMaxMethod: 'tanaka', ageYears: 35, zoneMethod: 'karvonen', restingHeartRate: 62 });
    expect(Number(sec(r, 'hrr')?.value)).toBe(122);
    expect(r.primary.formattedValue).toBe(`${Math.round(62 + 122 * 0.6)} - ${Math.round(62 + 122 * 0.7)} bpm`); // 135 - 147
    expect(sec(r, 'z5')?.formattedValue).toBe(`${Math.round(62 + 122 * 0.9)} - 184 bpm`);
  });

  it('measured HFmax and legacy links with only maxHeartRate', () => {
    const r = calc.calculate({ hfMaxMethod: 'measured', maxHeartRate: 192, zoneMethod: 'hfmax' });
    expect(sec(r, 'z4')?.formattedValue).toBe('154 - 173 bpm');
    expect(sec(r, 'hfMaxComparison')).toBeUndefined();
    const legacy = calc.calculate({ maxHeartRate: 185 });
    expect(legacy.error).toBeUndefined();
    expect(legacy.primary.formattedValue).toBe('111 - 130 bpm');
  });

  it('matches HFmax of the retired Maximalpuls calculator', () => {
    const source = getCalculatorDefinitionBySlug('maximalpuls-hfmax-rechner')!;
    for (const formulaType of ['tanaka', 'classic']) {
      const s = source.calculate({ ageYears: 47, restingHeartRate: 60, formulaType });
      const r = calc.calculate({ hfMaxMethod: formulaType === 'tanaka' ? 'tanaka' : 'fox', ageYears: 47, zoneMethod: 'hfmax' });
      expect(Number(sec(r, 'hfMax')?.value)).toBe(Number(s.primary.value));
    }
  });

  it('rejects implausible input', () => {
    expect(calc.calculate({ hfMaxMethod: 'tanaka', ageYears: 5, zoneMethod: 'hfmax' }).error).toContain('14 Jahren');
    expect(calc.calculate({ hfMaxMethod: 'tanaka', ageYears: 150, zoneMethod: 'hfmax' }).error).toBeTruthy();
    expect(calc.calculate({ hfMaxMethod: 'tanaka', ageYears: '', zoneMethod: 'hfmax' }).error).toBeTruthy();
    expect(calc.calculate({ hfMaxMethod: 'measured', maxHeartRate: 300, zoneMethod: 'hfmax' }).error).toBeTruthy();
    expect(calc.calculate({ hfMaxMethod: 'measured', maxHeartRate: 0, zoneMethod: 'hfmax' }).error).toBeTruthy();
    expect(calc.calculate({ hfMaxMethod: 'tanaka', ageYears: 35, zoneMethod: 'karvonen', restingHeartRate: 175 }).error).toContain('Ruhepuls');
    expect(calc.calculate({ hfMaxMethod: 'tanaka', ageYears: 35, zoneMethod: 'karvonen', restingHeartRate: -5 }).error).toBeTruthy();
  });
});

describe('WHR-Rechner absorbs Waist-to-Height-Ratio', () => {
  const calc = getCalculatorBySlug('waist-to-hip-ratio-rechner')!;

  it('defaults: Frau 74/96 cm, 168 cm → WHR 0,77, WHtR 0,44', () => {
    const r = calc.calculate(defaultsOf(calc));
    expect(Number(r.primary.value)).toBeCloseTo(74 / 96, 6);
    expect(Number(sec(r, 'whtr')?.value)).toBeCloseTo(74 / 168, 6);
    expect(sec(r, 'whtrStatus')?.formattedValue).toContain('kein erhöhtes');
    expect(Number(sec(r, 'maxWaist')?.value)).toBe(84);
    expect(r.warning).toBeUndefined();
  });

  it('applies the WHO cut-offs 0,85 (Frauen) and 0,90 (Männer) inclusively', () => {
    expect(Number(sec(calc.calculate({ gender: 'female', waistCm: 85, hipCm: 100, includeHeight: false }), 'risk')?.value)).toBe(1);
    expect(Number(sec(calc.calculate({ gender: 'female', waistCm: 84, hipCm: 100, includeHeight: false }), 'risk')?.value)).toBe(0);
    expect(Number(sec(calc.calculate({ gender: 'male', waistCm: 90, hipCm: 100, includeHeight: false }), 'risk')?.value)).toBe(1);
    expect(Number(sec(calc.calculate({ gender: 'male', waistCm: 89, hipCm: 100, includeHeight: false }), 'risk')?.value)).toBe(0);
  });

  it('Mann 52 J, 98/100 cm, 178 cm: WHR and WHtR above the limits, waist "erhöht", age note', () => {
    const r = calc.calculate({ gender: 'male', waistCm: 98, hipCm: 100, includeHeight: true, heightCm: 178, ageYears: 52 });
    expect(Number(r.primary.value)).toBeCloseTo(0.98, 6);
    expect(sec(r, 'shape')?.formattedValue).toContain('Apfeltyp');
    expect(Number(sec(r, 'whtr')?.value)).toBeCloseTo(98 / 178, 6);
    expect(sec(r, 'whtrStatus')?.formattedValue).toContain('0,5 bis 0,59');
    expect(sec(r, 'waistRisk')?.formattedValue).toContain('Erhöht');
    expect(sec(r, 'ageNote')).toBeDefined();
    expect(r.warning).toBeTruthy();
  });

  it('WHtR bands follow the 0,5 rule (NICE: 0,5 / 0,6)', () => {
    const band = (waist: number) => sec(calc.calculate({ gender: 'female', waistCm: waist, hipCm: 110, includeHeight: true, heightCm: 170, ageYears: 30 }), 'whtrStatus')?.formattedValue;
    expect(band(84)).toContain('kein erhöhtes'); // 0,494
    expect(band(85)).toContain('erhöhtes'); // 0,5
    expect(band(102)).toContain('hohes'); // 0,6
    expect(band(65)).toContain('Unter 0,4'); // 0,38
  });

  it('matches the retired WHtR calculator value and skips WHtR when switched off', () => {
    const s = getCalculatorDefinitionBySlug('waist-to-height-ratio-rechner')!.calculate({ waistCm: 82, heightCm: 178, ageYears: 34 });
    const r = calc.calculate({ gender: 'male', waistCm: 82, hipCm: 98, includeHeight: true, heightCm: 178, ageYears: 34 });
    expect(Number(sec(r, 'whtr')?.value)).toBeCloseTo(Number(s.primary.value), 6);
    const off = calc.calculate({ gender: 'male', waistCm: 82, hipCm: 98, includeHeight: false, heightCm: 178 });
    expect(sec(off, 'whtr')).toBeUndefined();
    const legacy = calc.calculate({ gender: 'female', waistCm: 75, hipCm: 95 });
    expect(legacy.error).toBeUndefined();
    expect(sec(legacy, 'whtr')).toBeUndefined();
  });

  it('rejects implausible input', () => {
    expect(calc.calculate({ gender: 'female', waistCm: 75, hipCm: 0 }).error).toContain('Hüftumfang');
    expect(calc.calculate({ gender: 'female', waistCm: -10, hipCm: 95 }).error).toContain('Taillenumfang');
    expect(calc.calculate({ gender: 'female', waistCm: 300, hipCm: 95 }).error).toBeTruthy();
    expect(calc.calculate({ gender: 'female', waistCm: 75, hipCm: 190 }).error).toContain('prüfen');
    expect(calc.calculate({ gender: 'female', waistCm: 75, hipCm: 95, includeHeight: true, heightCm: 300, ageYears: 30 }).error).toContain('Körpergröße');
    expect(calc.calculate({ gender: 'female', waistCm: 75, hipCm: 95, includeHeight: true, heightCm: 160, ageYears: 5 }).error).toContain('18 Jahren');
  });
});

describe('Zyklusrechner absorbs Fruchtbare-Tage-Rechner', () => {
  const calc = getCalculatorBySlug('zykluslaenge-eisprung-rechner')!;
  const today = parseDateParts(getBerlinTodayString())!;
  const todayNo = dateToDayNumber(today.year, today.month, today.day);
  const iso = (dayNo: number) => {
    const p = dayNumberToDate(dayNo);
    return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`;
  };
  const de = (dayNo: number) => formatDateGerman(dayNumberToDate(dayNo));
  // Letzte Periode vor 10 Tagen → deterministisch unabhängig vom Testdatum
  const lmp = todayNo - 10;

  it('regular cycle: ovulation on cycle day 14 = LMP + 13, fertile window LMP + 8 … LMP + 14', () => {
    const r = calc.calculate({ mode: 'dates', lastPeriodDate: iso(lmp), cycleType: 'regular', cycleLengthDays: 28, lutealPhaseDays: 14 });
    expect(r.error).toBeUndefined();
    expect(r.primary.formattedValue).toBe(de(lmp + 13));
    expect(sec(r, 'fertileWindow')?.formattedValue).toBe(`${de(lmp + 8)} bis ${de(lmp + 14)}`);
    expect(sec(r, 'nextPeriod')?.formattedValue).toBe(de(lmp + 28));
    expect(r.warning).toBeUndefined();
  });

  it('shows the next three cycles', () => {
    const r = calc.calculate({ mode: 'dates', lastPeriodDate: iso(lmp), cycleType: 'regular', cycleLengthDays: 30, lutealPhaseDays: 14 });
    expect(r.breakdown?.rows).toHaveLength(3);
    r.breakdown!.rows.forEach((row, k) => {
      expect(row.values.periodStart).toBe(de(lmp + 30 * k));
      expect(row.values.ovulation).toBe(de(lmp + 30 * k + 15)); // Zyklustag 16
      expect(row.values.fertile).toBe(`${de(lmp + 30 * k + 10)} bis ${de(lmp + 30 * k + 16)}`);
    });
  });

  it('worked example dates (02.11.2026, 28 Tage) are correct', () => {
    const r = calc.calculate({ mode: 'dates', lastPeriodDate: '2026-11-02', cycleType: 'regular', cycleLengthDays: 28, lutealPhaseDays: 14 });
    if (r.error) return; // nur relevant, solange das Datum nicht in der Zukunft liegt
    expect(r.primary.formattedValue).toBe('15.11.2026');
    expect(sec(r, 'fertileWindow')?.formattedValue).toBe('10.11.2026 bis 16.11.2026');
    expect(r.breakdown?.rows[1].values.ovulation).toBe('13.12.2026');
  });

  it('irregular cycle uses shortest and longest cycle', () => {
    const r = calc.calculate({ mode: 'dates', lastPeriodDate: iso(lmp), cycleType: 'irregular', shortestCycleDays: 26, longestCycleDays: 33, lutealPhaseDays: 14 });
    expect(r.primary.formattedValue).toBe(`${de(lmp + 11)} bis ${de(lmp + 18)}`);
    expect(sec(r, 'fertileWindow')?.formattedValue).toBe(`${de(lmp + 6)} bis ${de(lmp + 19)}`);
    expect(sec(r, 'ovulationCycleDay')?.formattedValue).toBe('Zyklustag 12 bis 19');
    expect(r.warning).toBeUndefined();
    const wide = calc.calculate({ mode: 'dates', lastPeriodDate: iso(lmp), cycleType: 'irregular', shortestCycleDays: 24, longestCycleDays: 38, lutealPhaseDays: 14 });
    expect(wide.warning).toContain('schwankt um 14 Tage');
  });

  it('cycle-day mode (no date) and legacy inputs keep the old behaviour', () => {
    const r = calc.calculate({ mode: 'days', cycleType: 'regular', cycleLengthDays: 32, lutealPhaseDays: 14 });
    expect(r.primary.formattedValue).toBe('18. Zyklustag');
    expect(sec(r, 'fertileWindow')?.formattedValue).toBe('Zyklustag 13 bis 19');
    const legacy = calc.calculate({ cycleLengthDays: 28, lutealPhaseDays: 12 });
    expect(legacy.error).toBeUndefined();
    expect(legacy.primary.value).toBe(16);
  });

  it('has the same 7-day fertile window as the retired Fruchtbare-Tage-Rechner', () => {
    const r = calc.calculate({ mode: 'days', cycleType: 'regular', cycleLengthDays: 35, lutealPhaseDays: 14 });
    expect(sec(r, 'fertileWindow')?.formattedValue).toBe('Zyklustag 16 bis 22');
    expect(getCalculatorDefinitionBySlug('fruchtbare-tage-rechner')!.formulaExplanation).toContain('5 Tage vor bis 1 Tag nach');
  });

  it('warns if the last period is more than 90 days ago', () => {
    const r = calc.calculate({ mode: 'dates', lastPeriodDate: iso(todayNo - 120), cycleType: 'regular', cycleLengthDays: 28, lutealPhaseDays: 14 });
    expect(r.error).toBeUndefined();
    expect(r.warning).toContain('90 Tage');
  });

  it('rejects implausible input', () => {
    const base = { mode: 'dates', lastPeriodDate: iso(lmp), cycleType: 'regular', cycleLengthDays: 28, lutealPhaseDays: 14 };
    expect(calc.calculate({ ...base, cycleLengthDays: 15 }).error).toContain('21 und 45');
    expect(calc.calculate({ ...base, cycleLengthDays: 60 }).error).toContain('21 und 45');
    expect(calc.calculate({ ...base, cycleLengthDays: -3 }).error).toBeTruthy();
    expect(calc.calculate({ ...base, lutealPhaseDays: 20 }).error).toContain('Lutealphase');
    expect(calc.calculate({ ...base, lastPeriodDate: 'abc' }).error).toContain('Datum');
    expect(calc.calculate({ ...base, lastPeriodDate: iso(todayNo + 10) }).error).toContain('Zukunft');
    expect(calc.calculate({ ...base, cycleType: 'irregular', shortestCycleDays: 34, longestCycleDays: 28 }).error).toContain('kürzeste');
  });
});

describe('Erstausstattung-Rechner absorbs Windelbudget', () => {
  const calc = getCalculatorBySlug('erstausstattung-baby-rechner')!;

  it('defaults: Mix 1.650 € − 500 € + 7 × 365 × 0,24 € Windeln = 1.763,20 €', () => {
    const r = calc.calculate(defaultsOf(calc));
    expect(r.primary.id).toBe('totalBudget');
    expect(Number(r.primary.value)).toBeCloseTo(1150 + 2555 * 0.24, 6);
    expect(Number(sec(r, 'totalDiapers')?.value)).toBe(2555);
    expect(Number(sec(r, 'equipmentOwnCost')?.value)).toBe(1150);
  });

  it('36 months reproduces the retired Windelbudget-Rechner', () => {
    const s = getCalculatorDefinitionBySlug('windelbudget-rechner')!.calculate({ diapersPerDayYear1: 8, diapersPerDayYear2to3: 4, costPerDiaper: 0.27 });
    const r = calc.calculate({ equipmentStandard: 'used_thrifty', hasPresentsBudget: 200, includeDiapers: true, diaperMonths: '36', diapersPerDayYear1: 8, diapersPerDayYear2to3: 4, costPerDiaper: 0.27 });
    expect(Number(sec(r, 'diaperCost')?.value)).toBeCloseTo(Number(s.primary.value), 6);
    expect(Number(sec(r, 'totalDiapers')?.value)).toBe(Number(s.secondary?.find((x) => x.id === 'totalDiapers')?.value));
    expect(Number(sec(r, 'diaperMonthly')?.value)).toBeCloseTo(Number(s.secondary?.find((x) => x.id === 'monthlyAvg')?.value), 6);
    expect(Number(r.primary.value)).toBeCloseTo(550 + Number(s.primary.value), 6);
  });

  it('worked example 2: sparsam, 36 Monate, 0,20 € → 1.791 €, Stoffwindel-Vorteil 791 €', () => {
    const r = calc.calculate({ equipmentStandard: 'used_thrifty', hasPresentsBudget: 200, includeDiapers: true, diaperMonths: '36', diapersPerDayYear1: 7, diapersPerDayYear2to3: 5, costPerDiaper: 0.2 });
    expect(Number(sec(r, 'totalDiapers')?.value)).toBe(6205);
    expect(Number(r.primary.value)).toBeCloseTo(1791, 6);
    expect(Number(sec(r, 'clothSaving')?.value)).toBeCloseTo(791, 6);
  });

  it('24 months = first year + one more year', () => {
    const r = calc.calculate({ equipmentStandard: 'smart_mix', hasPresentsBudget: 0, includeDiapers: true, diaperMonths: '24', diapersPerDayYear1: 7, diapersPerDayYear2to3: 5, costPerDiaper: 0.24 });
    expect(Number(sec(r, 'totalDiapers')?.value)).toBe(7 * 365 + 5 * 365);
  });

  it('without diapers only the equipment counts (legacy behaviour)', () => {
    const r = calc.calculate({ equipmentStandard: 'premium_new', hasPresentsBudget: 1000, includeDiapers: false });
    expect(r.primary.id).toBe('ownCost');
    expect(Number(r.primary.value)).toBe(2200);
    expect(Number(calc.calculate({ equipmentStandard: 'smart_mix', hasPresentsBudget: '0' }).primary.value)).toBe(1650);
    expect(Number(calc.calculate({ equipmentStandard: 'smart_mix', hasPresentsBudget: 5000, includeDiapers: false }).primary.value)).toBe(0);
  });

  it('rejects implausible input', () => {
    const base = { equipmentStandard: 'smart_mix', hasPresentsBudget: 500, includeDiapers: true, diaperMonths: '12', diapersPerDayYear1: 7, diapersPerDayYear2to3: 5, costPerDiaper: 0.24 };
    expect(calc.calculate({ ...base, hasPresentsBudget: -10 }).error).toContain('Geschenke');
    expect(calc.calculate({ ...base, diapersPerDayYear1: 20 }).error).toContain('Windeln pro Tag');
    expect(calc.calculate({ ...base, diapersPerDayYear1: -1 }).error).toBeTruthy();
    expect(calc.calculate({ ...base, costPerDiaper: 5 }).error).toContain('Preis');
    expect(calc.calculate({ ...base, costPerDiaper: 'abc' }).error).toBeTruthy();
  });
});
