import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug, getCalculatorDefinitionBySlug } from '@/data/calculators';
import { isCalculatorRetired, RETIRED_CALCULATORS } from '@/data/seo/retired-calculators';
import { calculateCircle } from '@/lib/calculators/geometrie';
import { calculatePercentage, calculateRoot, calculateTriangle } from '@/lib/calculators/mathematik';
import type { CalculationResult, CalculatorDefinition } from '@/types/calculator';

/**
 * Konsolidierung Mathe/Geometrie: Die Zielrechner übernehmen die Funktionen der stillgelegten Quellrechner.
 * Alle Sollwerte werden unabhängig (Heron, Kosinus-/Sinussatz, Kreisformeln, Potenzprobe) nachgerechnet.
 */

const MERGES: Record<string, { sources: string[]; keywords: string[] }> = {
  dreieckrechner: {
    sources: ['dreieck-flaeche-rechner', 'dreiecks-hoehen-rechner'],
    keywords: ['dreieck fläche berechnen', 'höhe dreieck berechnen', 'heron formel', 'inkreisradius dreieck berechnen', 'umkreisradius dreieck'],
  },
  prozentrechner: {
    sources: ['grundwert-rechner'],
    keywords: ['grundwert berechnen', 'grundwert rechner', 'prozentwert berechnen', 'prozentsatz berechnen'],
  },
  'quadratwurzel-rechner': {
    sources: ['n-te-wurzel-rechner'],
    keywords: ['quadratwurzel rechner', 'n-te wurzel', 'n-te wurzel rechner', 'wurzel ziehen'],
  },
  kreisrechner: {
    sources: ['kreis-umfang-rechner'],
    keywords: ['kreisumfang berechnen', 'kreisumfang rechner', 'durchmesser aus umfang berechnen', 'kreisfläche berechnen'],
  },
};

const FORBIDDEN = [
  /präzise Formelberechnung/i,
  /verlässliche(n)? Ergebnisse?n?/i,
  /für Ihre Planung/i,
  /umfassend/i,
  /ultimativ/i,
  /im Handumdrehen/i,
];

function calc(slug: string): CalculatorDefinition {
  const c = getCalculatorBySlug(slug);
  if (!c) throw new Error(`${slug} ist nicht live`);
  return c;
}

function sec(res: CalculationResult, id: string) {
  const item = res.secondary?.find((s) => s.id === id);
  if (!item) throw new Error(`Ergebnis ${id} fehlt`);
  return item;
}

const num = (res: CalculationResult, id: string) => Number(sec(res, id).value);

function defaults(c: CalculatorDefinition): Record<string, any> {
  return Object.fromEntries(c.inputs.map((i) => [i.id, i.defaultValue]));
}

function textOf(c: CalculatorDefinition): string {
  return JSON.stringify({
    metaTitle: c.metaTitle,
    metaDescription: c.metaDescription,
    h1: c.h1,
    shortDescription: c.shortDescription,
    formulaExplanation: c.formulaExplanation,
    content: c.content,
    faqs: c.faqs,
    workedExamples: c.workedExamples,
  });
}

describe('Merge Mathe/Geometrie – Seiten und Weiterleitungen', () => {
  for (const [target, { sources, keywords }] of Object.entries(MERGES)) {
    describe(target, () => {
      const c = calc(target);

      it('ist live, die Quellen sind stillgelegt und leiten per 301 auf das Ziel', () => {
        expect(isCalculatorRetired(target)).toBe(false);
        for (const source of sources) {
          expect(isCalculatorRetired(source)).toBe(true);
          expect(RETIRED_CALCULATORS[source]).toBe(`/rechner/${target}/`);
          expect(getCalculatorBySlug(source)).toBeUndefined();
        }
      });

      it('hat Meta-Daten in der vorgegebenen Länge und Form', () => {
        expect(c.metaTitle.length).toBeLessThanOrEqual(60);
        expect(c.metaTitle).not.toMatch(/RechenHafen/i);
        expect(c.metaDescription.length).toBeLessThanOrEqual(155);
        expect(c.metaDescription).toMatch(/kostenlos/i);
        expect(c.h1.length).toBeGreaterThan(10);
        expect(c.shortDescription.length).toBeGreaterThan(40);
      });

      it('enthält die Suchbegriffe der Quellrechner', () => {
        const kw = c.searchKeywords.map((k) => k.toLowerCase());
        for (const k of keywords) expect(kw, k).toContain(k);
      });

      it('hat Inhalt im geforderten Umfang ohne Floskeln', () => {
        expect(c.content?.intro?.length ?? 0).toBeGreaterThan(150);
        const sections = c.content?.sections ?? [];
        // Die Kategorie-Anreicherung hängt eigene Abschnitte an, daher nur die Untergrenze prüfen.
        expect(sections.length).toBeGreaterThanOrEqual(2);
        expect((c.workedExamples ?? []).length).toBeGreaterThanOrEqual(2);
        const raw = getCalculatorDefinitionBySlug(target)!;
        expect(raw.faqs.length).toBeGreaterThanOrEqual(4);
        for (const faq of raw.faqs) {
          expect(faq.question.endsWith('?')).toBe(true);
          expect(faq.answer.length).toBeGreaterThan(80);
        }
        const text = textOf(c);
        for (const re of FORBIDDEN) expect(text, String(re)).not.toMatch(re);
      });

      it('verlinkt nur auf live Rechner (relatedSlugs und Links im Text)', () => {
        const raw = getCalculatorDefinitionBySlug(target)!;
        for (const slug of raw.relatedSlugs) {
          expect(getCalculatorBySlug(slug), slug).toBeDefined();
          expect(isCalculatorRetired(slug), slug).toBe(false);
          expect(slug).not.toBe(target);
        }
        const links = [...textOf(raw).matchAll(/\]\(\/rechner\/([a-z0-9-]+)\/\)/g)].map((m) => m[1]);
        expect(links.length).toBeGreaterThan(0);
        for (const slug of links) {
          expect(getCalculatorBySlug(slug), slug).toBeDefined();
          expect(isCalculatorRetired(slug), slug).toBe(false);
        }
      });

      it('liefert mit den Standardwerten sofort ein Ergebnis', () => {
        const res = c.calculate(defaults(c));
        expect(res.error).toBeUndefined();
        expect(Number.isFinite(Number(res.primary.value))).toBe(true);
        expect(res.calculationSteps?.length ?? 0).toBeGreaterThan(0);
      });

      it('rechnet alle Beispielrechnungen ohne Fehler nach', () => {
        for (const ex of c.workedExamples ?? []) {
          const res = c.calculate({ ...defaults(c), ...ex.inputs });
          expect(res.error, ex.title).toBeUndefined();
        }
      });

      it('wirft bei leeren oder unsinnigen Eingaben nie und liefert kein NaN', () => {
        const variants: Record<string, any>[] = [{}];
        for (const inp of c.inputs) {
          for (const bad of ['', 'abc', 0, -5, 1e300, null]) {
            variants.push({ ...defaults(c), [inp.id]: bad });
          }
          for (const opt of inp.options ?? []) {
            for (const bad of ['', 0, -1]) {
              const base = { ...defaults(c), [inp.id]: opt.value };
              for (const other of c.inputs) if (other.type === 'number') variants.push({ ...base, [other.id]: bad });
            }
          }
        }
        for (const v of variants) {
          let res: CalculationResult | undefined;
          expect(() => {
            res = c.calculate(v);
          }).not.toThrow();
          expect(String(res!.primary.value)).not.toMatch(/NaN|Infinity/);
          expect(String(res!.primary.formattedValue)).not.toMatch(/NaN|Infinity/);
        }
      });
    });
  }
});

describe('Dreieck-Rechner', () => {
  const tri = calc('dreieckrechner');
  const deg = (rad: number) => (rad * 180) / Math.PI;
  const rad = (d: number) => (d * Math.PI) / 180;

  it('Standard (6, 8, 10): alle Werte wie von Hand gerechnet', () => {
    const res = tri.calculate(defaults(tri));
    expect(res.primary.value).toBeCloseTo(24, 10); // √(12·6·4·2) = √576
    expect(res.primary.formattedValue).toBe('24 cm²');
    expect(num(res, 'perimeter')).toBeCloseTo(24, 10);
    expect(num(res, 'ha')).toBeCloseTo(8, 10);
    expect(num(res, 'hb')).toBeCloseTo(6, 10);
    expect(num(res, 'hc')).toBeCloseTo(4.8, 10);
    expect(sec(res, 'hc').formattedValue).toBe('4,8 cm');
    expect(num(res, 'alpha')).toBeCloseTo(deg(Math.atan2(6, 8)), 8); // 36,87°
    expect(num(res, 'beta')).toBeCloseTo(deg(Math.atan2(8, 6)), 8); // 53,13°
    expect(num(res, 'gamma')).toBeCloseTo(90, 8);
    expect(num(res, 'inradius')).toBeCloseTo(2, 10); // (6 + 8 − 10) / 2
    expect(num(res, 'circumradius')).toBeCloseTo(5, 10); // halbe Hypotenuse
    expect(sec(res, 'type').formattedValue).toContain('rechtwinklig (rechter Winkel bei C)');
    expect(sec(res, 'type').formattedValue).toContain('ungleichseitig');
  });

  it('allgemeines Dreieck (7, 8, 9): Heron, Sinussatz und Höhen unabhängig geprüft', () => {
    const [a, b, c] = [7, 8, 9];
    const res = tri.calculate({ given: 'threeSides', sideA: a, sideB: b, sideC: c, unit: 'cm' });
    const s = 12;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c)); // √720
    expect(res.primary.value).toBeCloseTo(area, 10);
    const alpha = rad(num(res, 'alpha'));
    const beta = rad(num(res, 'beta'));
    const gamma = rad(num(res, 'gamma'));
    expect(num(res, 'alpha') + num(res, 'beta') + num(res, 'gamma')).toBeCloseTo(180, 10);
    // Sinussatz: a / sin α = b / sin β = c / sin γ = 2R
    const twoR = 2 * num(res, 'circumradius');
    expect(a / Math.sin(alpha)).toBeCloseTo(twoR, 8);
    expect(b / Math.sin(beta)).toBeCloseTo(twoR, 8);
    expect(c / Math.sin(gamma)).toBeCloseTo(twoR, 8);
    // Höhen über Winkel: h_a = b · sin γ, h_b = c · sin α, h_c = a · sin β
    expect(num(res, 'ha')).toBeCloseTo(b * Math.sin(gamma), 8);
    expect(num(res, 'hb')).toBeCloseTo(c * Math.sin(alpha), 8);
    expect(num(res, 'hc')).toBeCloseTo(a * Math.sin(beta), 8);
    expect(num(res, 'inradius')).toBeCloseTo(area / s, 10);
    expect(sec(res, 'type').formattedValue).toBe('spitzwinklig, ungleichseitig');
  });

  it('stumpfwinklig, gleichseitig und gleichschenklig werden erkannt', () => {
    const obtuse = tri.calculate({ given: 'threeSides', sideA: 3, sideB: 4, sideC: 6 });
    expect(num(obtuse, 'gamma')).toBeCloseTo(deg(Math.acos(-11 / 24)), 8); // ≈ 117,28°
    expect(sec(obtuse, 'type').formattedValue).toContain('stumpfwinklig (stumpfer Winkel bei C)');

    const equi = tri.calculate({ given: 'threeSides', sideA: 2, sideB: 2, sideC: 2 });
    expect(equi.primary.value).toBeCloseTo(Math.sqrt(3), 10);
    expect(num(equi, 'inradius')).toBeCloseTo(1 / Math.sqrt(3), 10);
    expect(num(equi, 'circumradius')).toBeCloseTo(2 / Math.sqrt(3), 10);
    expect(num(equi, 'alpha')).toBeCloseTo(60, 8);
    expect(sec(equi, 'type').formattedValue).toContain('gleichseitig');

    const iso = tri.calculate({ given: 'threeSides', sideA: 5, sideB: 5, sideC: 6 });
    expect(iso.primary.value).toBeCloseTo(12, 10); // √(8·3·3·2)
    expect(sec(iso, 'type').formattedValue).toBe('spitzwinklig, gleichschenklig');
  });

  it('Grundseite und Höhe (Quelle dreieck-flaeche-rechner): A = ½ · g · h, auch ohne Modus', () => {
    const res = tri.calculate({ given: 'baseHeight', baseG: 6, heightH: 4, unit: 'm' });
    expect(res.primary.value).toBe(12);
    expect(res.primary.formattedValue).toBe('12 m²');
    expect(num(res, 'isoLeg')).toBeCloseTo(5, 10); // √(3² + 4²)
    expect(num(res, 'isoPerimeter')).toBeCloseTo(16, 10);
    // gleiche Fläche wie über Heron für das gleichschenklige Dreieck 5, 5, 6
    expect(tri.calculate({ given: 'threeSides', sideA: 5, sideB: 5, sideC: 6 }).primary.value).toBeCloseTo(12, 10);
    // ältere Aufrufer ohne Modusfeld
    expect(tri.calculate({ baseG: 10, heightH: 6 }).primary.value).toBe(30);
  });

  it('zwei Seiten und eingeschlossener Winkel: Kosinussatz und ½ab·sin γ', () => {
    const res = tri.calculate({ given: 'twoSidesAngle', sideA: 5, sideB: 7, angleGamma: 60, unit: 'm' });
    const c = Math.sqrt(25 + 49 - 2 * 5 * 7 * Math.cos(rad(60))); // √39
    expect(num(res, 'sideC')).toBeCloseTo(Math.sqrt(39), 10);
    expect(res.primary.value).toBeCloseTo(0.5 * 5 * 7 * Math.sin(rad(60)), 10);
    expect(res.primary.formattedValue).toBe('15,16 m²');
    expect(num(res, 'gamma')).toBe(60);
    // identisch mit dem Weg über drei Seiten
    const viaSides = tri.calculate({ given: 'threeSides', sideA: 5, sideB: 7, sideC: c });
    expect(res.primary.value).toBeCloseTo(Number(viaSides.primary.value), 10);
    for (const id of ['alpha', 'beta', 'ha', 'hb', 'hc', 'inradius', 'circumradius']) {
      expect(num(res, id)).toBeCloseTo(num(viaSides, id), 8);
    }
    // rechter Winkel → Pythagoras
    const right = tri.calculate({ given: 'twoSidesAngle', sideA: 3, sideB: 4, angleGamma: 90 });
    expect(num(right, 'sideC')).toBeCloseTo(5, 10);
    expect(sec(right, 'type').formattedValue).toContain('rechtwinklig');
  });

  it('Dreiecksungleichung und ungültige Eingaben ergeben klare deutsche Fehlermeldungen', () => {
    const impossible = tri.calculate({ given: 'threeSides', sideA: 3, sideB: 4, sideC: 8 });
    expect(impossible.error).toContain('Dreiecksungleichung');
    expect(impossible.error).toContain('3 + 4 = 7');
    expect(tri.calculate({ given: 'threeSides', sideA: 3, sideB: 4, sideC: 7 }).error).toContain('kein Dreieck');
    expect(tri.calculate({ given: 'threeSides', sideA: 0, sideB: 4, sideC: 5 }).error).toBe('Die Seite a muss größer als 0 sein.');
    expect(tri.calculate({ given: 'threeSides', sideA: 3, sideB: -4, sideC: 5 }).error).toBe('Die Seite b muss größer als 0 sein.');
    expect(tri.calculate({ given: 'threeSides', sideA: 3, sideB: 4, sideC: '' }).error).toBe('Bitte geben Sie die Seite c ein.');
    expect(tri.calculate({ given: 'baseHeight', baseG: 'x', heightH: 4 }).error).toContain('gültige Zahl');
    for (const g of [0, 180, 200, -10]) {
      expect(tri.calculate({ given: 'twoSidesAngle', sideA: 3, sideB: 4, angleGamma: g }).error).toContain('0° und kleiner als 180°');
    }
    const huge = tri.calculate({ given: 'threeSides', sideA: 1e200, sideB: 1e200, sideC: 1e200 });
    expect(huge.error).toBeDefined();
    expect(huge.primary.value).toBe(0);
  });

  it('kleine Dreiecke und Kommazahlen funktionieren', () => {
    const res = tri.calculate({ given: 'threeSides', sideA: '0,3', sideB: '0,4', sideC: '0,5', unit: 'mm' });
    expect(res.error).toBeUndefined();
    expect(res.primary.value).toBeCloseTo(0.06, 12);
    expect(res.primary.formattedValue).toBe('0,06 mm²');
  });
});

describe('Prozentrechner – alle drei Grundaufgaben', () => {
  const pr = calc('prozentrechner');
  const run = (inputs: Record<string, any>) => pr.calculate({ ...defaults(pr), ...inputs });

  it('Standardwerte bilden ein stimmiges Dreieck aus G, W und p', () => {
    expect(run({ calculationMode: 'partOf' }).primary.value).toBe(50); // 20 % von 250
    expect(run({ calculationMode: 'shareOf' }).primary.value).toBe(20); // 50 von 250
    expect(run({ calculationMode: 'baseOf' }).primary.value).toBe(250); // 50 sind 20 %
  });

  it('Prozentwert, Prozentsatz und Grundwert sind zueinander invers', () => {
    const cases = [
      { G: 380, p: 12.5 },
      { G: 1234.56, p: 7 },
      { G: 0.8, p: 250 },
      { G: 99, p: 33 },
    ];
    for (const { G, p } of cases) {
      const W = (G * p) / 100;
      expect(run({ calculationMode: 'partOf', percent: p, base: G }).primary.value).toBeCloseTo(W, 10);
      expect(run({ calculationMode: 'shareOf', part: W, base: G }).primary.value).toBeCloseTo(p, 10);
      expect(run({ calculationMode: 'baseOf', part: W, percent: p }).primary.value).toBeCloseTo(G, 10);
    }
  });

  it('Grundwert wie im Quellrechner: 45 sind 15 % von 300', () => {
    const res = run({ calculationMode: 'baseOf', part: 45, percent: 15 });
    expect(res.primary.value).toBe(300);
    expect(res.primary.formattedValue).toBe('300');
    expect(num(res, 'onePercent')).toBe(3);
    expect(res.calculationSteps?.join(' ')).toContain('1 % ≙');
  });

  it('Ursprungswert vor Erhöhung oder Rabatt (vermehrter/verminderter Grundwert)', () => {
    expect(run({ calculationMode: 'baseFromIncreased', finalValue: 119, percent: 19 }).primary.value).toBeCloseTo(100, 10);
    expect(run({ calculationMode: 'baseFromDecreased', finalValue: 80, percent: 20 }).primary.value).toBeCloseTo(100, 10);
    const r = run({ calculationMode: 'baseFromDecreased', finalValue: 60, percent: 25 });
    expect(r.primary.value).toBeCloseTo(80, 10);
    expect(num(r, 'change')).toBeCloseTo(-20, 10);
  });

  it('Aufschlag und Rabatt bleiben unverändert', () => {
    expect(run({ calculationMode: 'increase', percent: 19, base: 200 }).primary.value).toBe(238);
    expect(run({ calculationMode: 'decrease', percent: 19, base: 200 }).primary.value).toBe(162);
    // ältere Aufrufer übergeben beim Prozentsatz den Anteil im Feld percent
    expect(calculatePercentage({ calculationMode: 'shareOf', percent: 50, base: 200 }).primary.value).toBe(25);
  });

  it('Komma-Eingaben und negative Prozentsätze', () => {
    expect(run({ calculationMode: 'partOf', percent: '19,5', base: '200' }).primary.value).toBeCloseTo(39, 10);
    expect(run({ calculationMode: 'partOf', percent: -20, base: 250 }).primary.value).toBe(-50);
    expect(run({ calculationMode: 'partOf', percent: 0.1, base: 1 }).primary.formattedValue).toBe('0,001');
  });

  it('Division durch 0 und unmögliche Rückrechnungen ergeben Fehler', () => {
    expect(run({ calculationMode: 'shareOf', part: 5, base: 0 }).error).toContain('Grundwert G darf nicht 0');
    expect(run({ calculationMode: 'baseOf', part: 5, percent: 0 }).error).toContain('nicht 0 %');
    expect(run({ calculationMode: 'baseFromDecreased', finalValue: 50, percent: 100 }).error).toContain('100 % oder mehr');
    expect(run({ calculationMode: 'baseFromDecreased', finalValue: 50, percent: 150 }).error).toBeDefined();
    expect(run({ calculationMode: 'baseFromIncreased', finalValue: 50, percent: -100 }).error).toContain('−100 %');
    expect(run({ calculationMode: 'partOf', percent: '', base: 100 }).error).toBe('Bitte geben Sie den Prozentsatz p ein.');
    expect(run({ calculationMode: 'baseOf', part: 'abc', percent: 10 }).error).toContain('gültige Zahl');
    expect(run({ calculationMode: 'partOf', percent: 1e308, base: 1e308 }).error).toContain('zu groß');
  });
});

describe('Quadratwurzel-Rechner mit n-ter Wurzel', () => {
  const wr = calc('quadratwurzel-rechner');
  const root = (value: any, degree?: any) => wr.calculate(degree === undefined ? { value } : { value, degree });

  it('Standard √144 = 12 exakt', () => {
    const res = wr.calculate(defaults(wr));
    expect(res.primary.value).toBe(12);
    expect(res.primary.formattedValue).toBe('12');
    expect(sec(res, 'type').formattedValue).toContain('Exakt');
  });

  it('irrationale Wurzeln: Rundung, Einschachteln und teilweises Wurzelziehen', () => {
    const r50 = root(50);
    expect(r50.primary.value).toBeCloseTo(Math.sqrt(50), 14);
    expect(r50.primary.formattedValue).toBe('7,071068');
    expect(sec(r50, 'between').formattedValue).toBe('7 und 8');
    expect(sec(r50, 'simplified').formattedValue).toBe('5 · √2');
    expect(sec(root(72), 'simplified').formattedValue).toBe('6 · √2');
    expect(sec(root(54, 3), 'simplified').formattedValue).toBe('3 · ∛2');
    expect(sec(root(2), 'type').formattedValue).toContain('Irrational');
    expect(root(2).primary.value).toBeCloseTo(Math.SQRT2, 15);
    // Vereinfachung unabhängig prüfen: außen² · innen = Radikand
    for (const x of [8, 12, 18, 98, 200, 1000, 4096 * 3]) {
      const simp = root(x).secondary?.find((s) => s.id === 'simplified');
      if (!simp) continue;
      const [out, inner] = String(simp.formattedValue).split(' · √').map(Number);
      expect(out * out * inner).toBe(x);
    }
  });

  it('n-te Wurzel (Quelle n-te-wurzel-rechner): exakte ganze Ergebnisse ohne Rundungsfehler', () => {
    expect(root(16, 4).primary.value).toBe(2);
    expect(root(81, 4).primary.value).toBe(3);
    expect(root(64, 3).primary.value).toBe(4);
    expect(root(1024, 10).primary.value).toBe(2);
    expect(root(3125, 5).primary.value).toBe(5);
    expect(root(10, 1).primary.value).toBe(10);
    // Probe: y^n = x
    const r = root(7, 6);
    expect(Math.pow(Number(r.primary.value), 6)).toBeCloseTo(7, 12);
    expect(sec(r, 'power').formattedValue).toBe('7^(1/6)');
    // gebrochener Exponent: 32^(1/2,5) = 2^(5/2,5) = 4
    expect(root(32, 2.5).primary.value).toBeCloseTo(4, 12);
    // Wurzelexponent leer → Quadratwurzel
    expect(root(49, '').primary.value).toBe(7);
  });

  it('negative Radikanden: ungerade Wurzeln negativ, gerade Wurzeln Fehler', () => {
    expect(root(-32, 5).primary.value).toBe(-2);
    expect(root(-27, 3).primary.value).toBe(-3);
    expect(root(-2, 3).primary.value).toBeCloseTo(-Math.cbrt(2), 14);
    const neg = root(-16, 2);
    expect(neg.error).toContain('keine reelle Quadratwurzel');
    expect(neg.error).toContain('±4 · i');
    expect(root(-81, 4).error).toContain('keine reelle 4. Wurzel');
    expect(root(-8, 1.5).error).toContain('ungeraden');
  });

  it('ungültige Eingaben und Grenzwerte', () => {
    expect(root(16, 0).error).toContain('positive Zahl');
    expect(root(16, -2).error).toBeDefined();
    expect(root(16, 'x').error).toBeDefined();
    expect(root('').error).toContain('Radikand');
    expect(root('abc').error).toContain('gültige Zahl');
    expect(root(0).primary.value).toBe(0);
    expect(root(1e300).primary.value).toBeCloseTo(1e150, -140);
    expect(root(2, 0.0001).error).toContain('zu groß');
    expect(root('6,25').primary.value).toBe(2.5);
  });

  it('bestehende Engine-Aufrufer bleiben gültig', () => {
    expect(calculateRoot({ value: 16, degree: 2 }).primary.value).toBe(4);
    expect(calculateRoot({ value: 27, degree: 3 }).primary.value).toBe(3);
  });
});

describe('Kreisrechner – Start mit Radius, Durchmesser, Umfang oder Fläche', () => {
  const kr = calc('kreisrechner');
  const run = (givenType: string, givenValue: any, unit = 'cm') => kr.calculate({ givenType, givenValue, unit });

  it('Radius 5 cm: Fläche als Hauptergebnis, Umfang 10π', () => {
    const res = run('radius', 5);
    expect(res.primary.id).toBe('area');
    expect(res.primary.value).toBeCloseTo(25 * Math.PI, 12);
    expect(res.primary.formattedValue).toBe('78,54 cm²');
    expect(num(res, 'circumference')).toBeCloseTo(10 * Math.PI, 12);
    expect(sec(res, 'circumference').formattedValue).toBe('31,42 cm');
    expect(num(res, 'diameter')).toBe(10);
  });

  it('Kreisumfang aus Radius und Durchmesser wie im Quellrechner kreis-umfang-rechner', () => {
    expect(num(run('radius', 7), 'circumference')).toBeCloseTo(2 * Math.PI * 7, 10);
    expect(sec(run('radius', 7), 'circumference').formattedValue).toBe('43,98 cm');
    const d = run('diameter', 20);
    expect(d.primary.id).toBe('circumference');
    expect(d.primary.value).toBeCloseTo(Math.PI * 20, 10);
    expect(d.primary.formattedValue).toBe('62,83 cm');
  });

  it('Rückwärts: Durchmesser aus Umfang, Radius aus Fläche', () => {
    const u = run('circumference', 94.2);
    expect(u.primary.id).toBe('diameter');
    expect(u.primary.value).toBeCloseTo(94.2 / Math.PI, 10);
    expect(u.primary.formattedValue).toBe('29,98 cm');
    const a = run('area', 50, 'm');
    expect(a.primary.id).toBe('radius');
    expect(a.primary.value).toBeCloseTo(Math.sqrt(50 / Math.PI), 12);
    expect(a.primary.formattedValue).toBe('3,99 m');
    expect(num(a, 'area')).toBe(50);
    expect(sec(a, 'area').formattedValue).toBe('50 m²');
  });

  it('jeder Startwert führt zum selben Kreis', () => {
    const r = 7.3;
    const fromValues: Record<string, number> = {
      radius: r,
      diameter: 2 * r,
      circumference: 2 * Math.PI * r,
      area: Math.PI * r * r,
    };
    for (const [type, value] of Object.entries(fromValues)) {
      const res = run(type, value);
      const all: Record<string, number> = { [String(res.primary.id)]: Number(res.primary.value) };
      for (const s of res.secondary ?? []) if (typeof s.value === 'number') all[String(s.id)] = s.value;
      expect(all.radius, type).toBeCloseTo(r, 10);
      expect(all.diameter, type).toBeCloseTo(2 * r, 10);
      expect(all.circumference, type).toBeCloseTo(2 * Math.PI * r, 10);
      expect(all.area, type).toBeCloseTo(Math.PI * r * r, 10);
    }
  });

  it('Einheiten, Kommazahlen und Fehler', () => {
    expect(run('radius', 2, 'mm').primary.formattedValue).toBe('12,57 mm²');
    expect(run('diameter', '0,5', 'm').primary.formattedValue).toBe('1,57 m');
    expect(run('radius', 0).error).toBe('Der Radius muss größer als 0 sein.');
    expect(run('area', -3).error).toBe('Die Fläche muss größer als 0 sein.');
    expect(run('diameter', '').error).toBe('Bitte geben Sie den Durchmesser ein.');
    expect(run('circumference', 'abc').error).toContain('gültige Zahl');
    expect(run('radius', 1e200).error).toContain('zu groß');
  });

  it('bisherige Engine-Aufrufe nur mit radius bleiben unverändert', () => {
    const res = calculateCircle({ radius: 10 });
    expect(res.primary.value).toBeCloseTo(314.159, 2);
    expect(res.primary.formattedValue).toBe('314,16 cm²');
    expect(calculateCircle({}).error).toBeDefined();
  });
});

describe('Engine-Funktion calculateTriangle direkt', () => {
  it('ist ohne Eingaben mit den Standardwerten nutzbar', () => {
    expect(calculateTriangle({}).primary.value).toBeCloseTo(24, 10);
  });
});
