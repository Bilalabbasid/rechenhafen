import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';
import { RETIRED_CALCULATORS } from '@/data/seo/retired-calculators';
import { calculateGramsToMl } from '@/lib/calculators/kochen';
import type { CalculatorDefinition, CalculationResult } from '@/types/calculator';

/**
 * Zusammenführung doppelter Rechner (Nov 2026):
 * - stromkosten-geraete-rechner ← fernseher-, kuehlschrank-, klimaanlage-stromkosten-rechner, standby-kosten-rechner
 * - vorfaelligkeitsentschaedigung-baufinanzierung-rechner ← vorfaelligkeitsentschaedigung-rechner (Ratenkredit, § 502 BGB)
 * - umsatzrentabilitaet-rechner ← eigenkapitalrentabilitaet-rechner, gesamtkapitalrentabilitaet-rechner
 * - binaer-hex-dezimal-umrechner ← hexadezimal-rechner
 * - essloeffel-teeloeffel-gramm-rechner ← gramm-in-ml-rechner
 * Alle Erwartungswerte sind unabhängig von Hand nachgerechnet.
 */

const TARGETS = [
  'stromkosten-geraete-rechner',
  'vorfaelligkeitsentschaedigung-baufinanzierung-rechner',
  'umsatzrentabilitaet-rechner',
  'binaer-hex-dezimal-umrechner',
  'essloeffel-teeloeffel-gramm-rechner',
] as const;

const calcOf = (slug: string): CalculatorDefinition => {
  const c = getCalculatorBySlug(slug);
  if (!c) throw new Error(`Rechner ${slug} fehlt im Live-Register`);
  return c;
};

const defaultsOf = (c: CalculatorDefinition): Record<string, any> =>
  Object.fromEntries(c.inputs.map((i) => [i.id, i.defaultValue]));

const run = (slug: string, overrides: Record<string, any> = {}): CalculationResult => {
  const c = calcOf(slug);
  return c.calculate({ ...defaultsOf(c), ...overrides });
};

const sec = (r: CalculationResult, id: string) => r.secondary?.find((s) => s.id === id);
// Intl formatiert Währungen mit geschütztem Leerzeichen
const nb = (s: string | undefined) => String(s).replace(/ /g, ' ');

const annuityInterest = (debt: number, months: number, ratePct: number) => {
  const i = ratePct / 100 / 12;
  if (i === 0) return 0;
  const rate = (debt * i) / (1 - Math.pow(1 + i, -months));
  return rate * months - debt;
};

describe('Gemeinsame Qualitätskriterien der zusammengeführten Rechner', () => {
  const forbidden = [/präzise Formelberechnung/i, /verlässliche(n)? Ergebnisse?(n)?/i, /für Ihre Planung/i, /umfassend/i, /ultimativ/i, /im Handumdrehen/i];

  for (const slug of TARGETS) {
    describe(slug, () => {
      const c = calcOf(slug);

      it('ist live und nicht als retired markiert', () => {
        expect(RETIRED_CALCULATORS[slug]).toBeUndefined();
      });

      it('hat SEO-Metadaten in den Längengrenzen', () => {
        expect(c.metaTitle.length).toBeLessThanOrEqual(60);
        expect(c.metaTitle).not.toMatch(/RechenHafen/);
        expect(c.metaDescription.length).toBeLessThanOrEqual(155);
        expect(c.metaDescription).toMatch(/kostenlos/);
        expect(c.metaDescription).toMatch(/[.!?)]$/);
        expect(c.h1.length).toBeGreaterThan(10);
      });

      it('hat mindestens 2 Rechenbeispiele, 4–6 FAQs und 2–4 Abschnitte', () => {
        expect((c.workedExamples ?? []).length).toBeGreaterThanOrEqual(2);
        expect(c.faqs.length).toBeGreaterThanOrEqual(4);
        expect(c.faqs.length).toBeLessThanOrEqual(6);
        expect((c.content?.sections ?? []).length).toBeGreaterThanOrEqual(2);
        expect((c.content?.sections ?? []).length).toBeLessThanOrEqual(4);
      });

      it('enthält keine verbotenen Floskeln und keine Du-Form', () => {
        const text = JSON.stringify({ m: c.metaDescription, s: c.shortDescription, f: c.formulaExplanation, c: c.content, q: c.faqs, w: c.workedExamples, i: c.inputs.map((i) => [i.label, i.helpText]) });
        for (const re of forbidden) expect(text).not.toMatch(re);
        expect(text).not.toMatch(/\b(Dein|Deine|dein|deine|du)\b/);
      });

      it('verlinkt nur live Rechner (relatedSlugs und Inhaltslinks)', () => {
        const linked = new Set<string>(c.relatedSlugs);
        const text = JSON.stringify({ c: c.content, q: c.faqs });
        for (const m of text.matchAll(/\]\(\/rechner\/([a-z0-9-]+)\/\)/g)) linked.add(m[1]);
        expect(linked.size).toBeGreaterThan(0);
        for (const s of linked) {
          expect(RETIRED_CALCULATORS[s], `${slug} verlinkt retired ${s}`).toBeUndefined();
          expect(getCalculatorBySlug(s), `${slug} verlinkt unbekannt ${s}`).toBeDefined();
        }
        expect(linked.has(slug)).toBe(false);
      });

      it('dependsOn verweist auf vorhandene Felder und gültige Optionswerte', () => {
        for (const inp of c.inputs) {
          if (!inp.dependsOn) continue;
          const parent = c.inputs.find((p) => p.id === inp.dependsOn!.field);
          expect(parent, `${inp.id} → ${inp.dependsOn.field}`).toBeDefined();
          const values = Array.isArray(inp.dependsOn.value) ? inp.dependsOn.value : [inp.dependsOn.value];
          for (const v of values) expect(parent!.options?.some((o) => o.value === v), `${inp.id}: ${v}`).toBe(true);
        }
      });

      it('rechnet mit Standardwerten ohne Fehler und alle Rechenbeispiele laufen', () => {
        const res = c.calculate(defaultsOf(c));
        expect(res.error).toBeUndefined();
        expect(Number.isFinite(res.primary.value as number)).toBe(true);
        for (const ex of c.workedExamples ?? []) {
          const r = c.calculate({ ...defaultsOf(c), ...(ex.inputs ?? {}) });
          expect(r.error, ex.title).toBeUndefined();
        }
      });

      it('wirft bei leeren, fehlenden oder unsinnigen Eingaben nie', () => {
        const empty = Object.fromEntries(c.inputs.map((i) => [i.id, '']));
        const garbage = Object.fromEntries(c.inputs.map((i) => [i.id, i.type === 'select' ? 'gibt-es-nicht' : 'abc']));
        for (const variant of [{}, empty, garbage]) {
          expect(() => c.calculate(variant)).not.toThrow();
          const r = c.calculate(variant);
          expect(String(r.primary.value)).not.toMatch(/NaN|Infinity/);
        }
        // jede Option jedes Select-Felds mit Standardwerten
        // (Ausnahme: Zahlensystem-Auswahl – die Standardzahl ist nicht in jeder Basis gültig)
        for (const sel of c.inputs.filter((i) => i.type === 'select')) {
          for (const opt of sel.options ?? []) {
            const r = c.calculate({ ...defaultsOf(c), [sel.id]: opt.value });
            if (!['inputBase', 'arithBase'].includes(sel.id)) expect(r.error, `${sel.id}=${opt.value}`).toBeUndefined();
            expect(String(r.primary.value)).not.toMatch(/NaN|Infinity/);
          }
        }
      });
    });
  }

  it('übernimmt die Suchbegriffe der zusammengeführten Rechner', () => {
    const kw = (slug: string) => calcOf(slug).searchKeywords.join(' | ');
    for (const term of ['fernseher stromverbrauch', 'kühlschrank stromkosten', 'standby kosten', 'klimaanlage stromverbrauch']) {
      expect(kw('stromkosten-geraete-rechner')).toContain(term);
    }
    expect(kw('vorfaelligkeitsentschaedigung-baufinanzierung-rechner')).toContain('vorfälligkeitsentschädigung ratenkredit');
    expect(kw('umsatzrentabilitaet-rechner')).toContain('eigenkapitalrentabilität berechnen');
    expect(kw('umsatzrentabilitaet-rechner')).toContain('gesamtkapitalrentabilität berechnen');
    expect(kw('binaer-hex-dezimal-umrechner')).toContain('hexadezimal umrechnen');
    expect(kw('essloeffel-teeloeffel-gramm-rechner')).toContain('gramm in ml');
  });
});

describe('stromkosten-geraete-rechner', () => {
  const S = 'stromkosten-geraete-rechner';

  it('Standard: eigenes Gerät 150 W, 4 h, 365 Tage, 36 ct = 219 kWh / 78,84 €', () => {
    const r = run(S);
    expect(r.primary.id).toBe('costPeriod');
    expect(r.primary.value).toBeCloseTo(219 * 0.36, 6);
    expect(sec(r, 'totalKwhPeriod')!.value).toBeCloseTo(219, 6);
    expect(sec(r, 'costPerMonth')!.value).toBeCloseTo(78.84 / 12, 6);
  });

  it('eigenes Gerät: Heizlüfter 2.000 W, 2 h, 30 Tage, 35 ct = 42,00 € und 0,70 €/Std.', () => {
    const r = run(S, { device: 'custom', powerWatts: 2000, hoursPerDay: 2, usageDays: 30, electricityPrice: 35 });
    expect(r.primary.value).toBeCloseTo(42, 6);
    expect(sec(r, 'costPerHour')!.value).toBeCloseTo(0.7, 6);
    expect(sec(r, 'costPerDay')!.value).toBeCloseTo(1.4, 6);
  });

  it('eigenes Gerät: 0 W ergibt 0 € ohne Fehler, leere Nutzungstage = 365', () => {
    expect(run(S, { powerWatts: 0 }).primary.value).toBe(0);
    const r = run(S, { usageDays: '' });
    expect(r.error).toBeUndefined();
    expect(r.primary.value).toBeCloseTo(78.84, 6);
  });

  it('Fernseher: 120 W × 4 h + 1 W Standby × 20 h = 182,5 kWh / 65,70 €', () => {
    const r = run(S, { device: 'tv', tvWatts: 120, tvHoursPerDay: 4, tvStandbyWatts: 1, electricityPrice: 36 });
    const kwh = (120 * 4 * 365) / 1000 + (1 * 20 * 365) / 1000; // 175,2 + 7,3
    expect(kwh).toBeCloseTo(182.5, 9);
    expect(r.primary.value).toBeCloseTo(65.7, 6);
    expect(sec(r, 'kwhYear')!.value).toBeCloseTo(182.5, 6);
    expect(sec(r, 'standbyCost')!.value).toBeCloseTo(7.3 * 0.36, 6);
    expect(sec(r, 'costMonth')!.value).toBeCloseTo(65.7 / 12, 6);
    expect(sec(r, 'costPerHour')!.value).toBeCloseTo(0.0432, 6);
  });

  it('Fernseher 24 h Betrieb hat keine Standby-Stunden', () => {
    const r = run(S, { device: 'tv', tvWatts: 100, tvHoursPerDay: 24, tvStandbyWatts: 5, electricityPrice: 30 });
    expect(sec(r, 'standbyCost')!.value).toBe(0);
    expect(r.primary.value).toBeCloseTo(876 * 0.3, 6);
  });

  it('Kühlschrank: 220 kWh/Jahr × 36 ct = 79,20 €, Ø 25,1 W', () => {
    const r = run(S, { device: 'fridge', fridgeKwhYear: 220, electricityPrice: 36 });
    expect(r.primary.value).toBeCloseTo(79.2, 6);
    expect(sec(r, 'avgWatts')!.value).toBeCloseTo(220000 / 8760, 6);
    expect(sec(r, 'costDay')!.value).toBeCloseTo(79.2 / 365, 6);
  });

  it('Kühlschrank-Vergleich: 320 vs. 115 kWh, 650 € → 73,80 €/Jahr, 8,8 Jahre', () => {
    const r = run(S, { device: 'fridgeCompare', fridgeKwhYear: 320, fridgeNewKwhYear: 115, fridgeNewPrice: 650, electricityPrice: 36 });
    expect(r.primary.id).toBe('yearlySaving');
    expect(r.primary.value).toBeCloseTo(73.8, 6);
    expect(sec(r, 'oldCost')!.value).toBeCloseTo(115.2, 6);
    expect(sec(r, 'newCost')!.value).toBeCloseTo(41.4, 6);
    expect(sec(r, 'amortYears')!.value).toBeCloseTo(650 / 73.8, 6);
    expect(sec(r, 'amortYears')!.formattedValue).toContain('8,8');
  });

  it('Kühlschrank-Vergleich: Neugerät verbraucht mehr → Warnung, keine Amortisation', () => {
    const r = run(S, { device: 'fridgeCompare', fridgeKwhYear: 100, fridgeNewKwhYear: 150 });
    expect(r.error).toBeUndefined();
    expect(r.warning).toBeDefined();
    expect(r.primary.value).toBeLessThan(0);
    expect(sec(r, 'amortYears')!.formattedValue).toContain('Keine Amortisation');
  });

  it('Klimaanlage Split 600 W / mobil 1.200 W, 6 h an 35 Tagen = 45,36 € / 90,72 €', () => {
    const split = run(S, { device: 'acSplit', acSplitWatts: 600, acHoursPerDay: 6, acDays: 35, electricityPrice: 36 });
    expect(split.primary.value).toBeCloseTo(0.6 * 6 * 35 * 0.36, 6);
    expect(split.primary.value).toBeCloseTo(45.36, 6);
    expect(sec(split, 'kwhYear')!.value).toBeCloseTo(126, 6);
    expect(sec(split, 'costPerHotDay')!.value).toBeCloseTo(0.6 * 6 * 0.36, 9); // 1,296 €
    const mobile = run(S, { device: 'acMobile', acMobileWatts: 1200, acHoursPerDay: 6, acDays: 35, electricityPrice: 36 });
    expect(mobile.primary.value).toBeCloseTo(90.72, 6);
    expect(sec(mobile, 'costPerHour')!.value).toBeCloseTo(0.432, 6);
  });

  it('Standby: 35 W × 20 h × 365 = 255,5 kWh / 91,98 €; 0 W = 0 €', () => {
    const r = run(S, { device: 'standby', standbyWatts: 35, standbyHoursPerDay: 20, electricityPrice: 36 });
    expect(sec(r, 'kwhYear')!.value).toBeCloseTo(255.5, 6);
    expect(r.primary.value).toBeCloseTo(91.98, 6);
    expect(sec(r, 'costMonth')!.value).toBeCloseTo(7.665, 6);
    const zero = run(S, { device: 'standby', standbyWatts: 0 });
    expect(zero.error).toBeUndefined();
    expect(zero.primary.value).toBe(0);
  });

  it('Beispieltabelle im Seitentext stimmt mit dem Rechner überein', () => {
    const table = calcOf(S).content!.sections![0].content;
    const router = run(S, { device: 'custom', powerWatts: 10, hoursPerDay: 24, usageDays: 365, electricityPrice: 36 });
    expect(nb(router.primary.formattedValue)).toBe('31,54 €');
    const pc = run(S, { device: 'custom', powerWatts: 300, hoursPerDay: 3, usageDays: 365, electricityPrice: 36 });
    expect(nb(pc.primary.formattedValue)).toBe('118,26 €');
    for (const v of ['31,54 €', '65,70 €', '79,20 €', '91,98 €', '118,26 €', '45,36 €', '87,6 kWh', '328,5 kWh']) expect(table).toContain(v);
  });

  it('liefert klare Fehler für leere, negative und unmögliche Werte', () => {
    expect(run(S, { powerWatts: '' }).error).toMatch(/Leistungsaufnahme/);
    expect(run(S, { powerWatts: -5 }).error).toMatch(/negativ/);
    expect(run(S, { hoursPerDay: 25 }).error).toMatch(/24 Stunden/);
    expect(run(S, { usageDays: 0 }).error).toMatch(/größer als 0/);
    expect(run(S, { electricityPrice: 'abc' }).error).toMatch(/gültige Zahl/);
    expect(run(S, { device: 'tv', tvHoursPerDay: 30 }).error).toMatch(/24 Stunden/);
    expect(run(S, { device: 'fridge', fridgeKwhYear: '' }).error).toMatch(/Jahresverbrauch/);
    expect(run(S, { device: 'acSplit', acDays: 400 }).error).toMatch(/366/);
    expect(run(S, { device: 'standby', standbyHoursPerDay: -1 }).error).toMatch(/negativ/);
  });

  it('verarbeitet sehr große Werte endlich und unbekannte Geräte wie „eigenes Gerät“', () => {
    const big = run(S, { powerWatts: 1e12 });
    expect(Number.isFinite(big.primary.value as number)).toBe(true);
    const unknown = run(S, { device: 'toaster' });
    expect(unknown.primary.id).toBe('costPeriod');
    expect(unknown.primary.value).toBeCloseTo(78.84, 6);
  });
});

describe('vorfaelligkeitsentschaedigung-baufinanzierung-rechner', () => {
  const V = 'vorfaelligkeitsentschaedigung-baufinanzierung-rechner';

  it('Baufinanzierung (Standard, bisherige Methode): 180.000 €, 4,2 % / 2,4 %, 4 Jahre = 10.692 €', () => {
    const r = run(V);
    expect(r.primary.value).toBeCloseTo(180000 * 0.0165 * 4 * 0.9, 6);
    expect(r.primary.value).toBeCloseTo(10692, 6);
    // ohne loanType (alte Links) weiterhin Baufinanzierung
    const legacy = calcOf(V).calculate({ remainingDebt: 180000, contractRate: 4.2, reinvestmentRate: 2.4, remainingYears: 4 });
    expect(legacy.primary.value).toBeCloseTo(10692, 6);
  });

  it('Baufinanzierung: Wiederanlagezins über Vertragszins → 0 €', () => {
    const r = run(V, { contractRate: 2, reinvestmentRate: 3 });
    expect(r.primary.value).toBe(0);
  });

  it('Ratenkredit: 12.000 €, 24 Monate, 6,5 % → 1-%-Grenze 120 € (Zinsen 829,32 €)', () => {
    const r = run(V, { loanType: 'ratenkredit', consumerDebt: 12000, consumerMonths: 24, consumerRate: 6.5 });
    const interest = annuityInterest(12000, 24, 6.5);
    expect(interest).toBeCloseTo(829.32, 2);
    expect(r.primary.value).toBeCloseTo(120, 9);
    expect(sec(r, 'capRate')!.value).toBe(1);
    expect(sec(r, 'remainingInterest')!.value).toBeCloseTo(interest, 6);
    expect(sec(r, 'totalPayoff')!.value).toBeCloseTo(12120, 6);
    expect(sec(r, 'netSaving')!.value).toBeCloseTo(interest - 120, 6);
  });

  it('Ratenkredit: Grenze 0,5 % bei genau 12 Monaten, 1 % ab 13 Monaten', () => {
    expect(run(V, { loanType: 'ratenkredit', consumerDebt: 12000, consumerMonths: 12, consumerRate: 6.5 }).primary.value).toBeCloseTo(60, 9);
    expect(run(V, { loanType: 'ratenkredit', consumerDebt: 12000, consumerMonths: 13, consumerRate: 6.5 }).primary.value).toBeCloseTo(120, 9);
  });

  it('Ratenkredit: restliche Sollzinsen begrenzen (3.000 €, 2 Monate, 2,9 % → 10,88 €)', () => {
    const r = run(V, { loanType: 'ratenkredit', consumerDebt: 3000, consumerMonths: 2, consumerRate: 2.9 });
    const interest = annuityInterest(3000, 2, 2.9);
    expect(interest).toBeLessThan(15);
    expect(r.primary.value).toBeCloseTo(interest, 9);
    expect(nb(r.primary.formattedValue)).toBe('10,88 €');
    expect(r.summaryText).toMatch(/greift nicht/);
  });

  it('Ratenkredit: 0 % Sollzins oder 0 € Restschuld → keine Entschädigung', () => {
    expect(run(V, { loanType: 'ratenkredit', consumerRate: 0 }).primary.value).toBe(0);
    expect(run(V, { loanType: 'ratenkredit', consumerDebt: 0 }).primary.value).toBe(0);
  });

  it('Ratenkredit: Fehler bei leeren und ungültigen Werten', () => {
    expect(run(V, { loanType: 'ratenkredit', consumerDebt: '' }).error).toMatch(/Betrag/);
    expect(run(V, { loanType: 'ratenkredit', consumerMonths: 0 }).error).toMatch(/mindestens 1 Monat/);
    expect(run(V, { loanType: 'ratenkredit', consumerRate: -1 }).error).toMatch(/negativ/);
    expect(run(V, { loanType: 'ratenkredit', consumerDebt: -100 }).error).toMatch(/negativ/);
    const huge = run(V, { loanType: 'ratenkredit', consumerDebt: 1e12, consumerMonths: 1200, consumerRate: 99 });
    expect(Number.isFinite(huge.primary.value as number)).toBe(true);
    expect(huge.primary.value).toBeCloseTo(1e10, 0);
  });
});

describe('umsatzrentabilitaet-rechner', () => {
  const U = 'umsatzrentabilitaet-rechner';

  it('Standard: Umsatzrendite 8 %, EK-Rendite 20 %, GK-Rendite 10,4 %, FK-Zins 4 %, positiver Leverage', () => {
    const r = run(U);
    expect(r.primary.id).toBe('ros');
    expect(r.primary.value).toBeCloseTo(8, 9);
    expect(sec(r, 'roe')!.value).toBeCloseTo(20, 9);
    expect(sec(r, 'roa')!.value).toBeCloseTo(10.4, 9);
    expect(sec(r, 'debtRate')!.value).toBeCloseTo(4, 9);
    expect(sec(r, 'leverage')!.value).toBeGreaterThan(0);
    expect(sec(r, 'leverage')!.formattedValue).toMatch(/^Positiv/);
    expect(sec(r, 'capitalTurnover')!.value).toBeCloseTo(1, 9);
    // Leverage-Formel: EKR = GKR + (GKR − i) × FK/EK
    expect(10.4 + (10.4 - 4) * (600000 / 400000)).toBeCloseTo(20, 9);
  });

  it('negativer Leverage-Effekt: GKR 5,8 % < Zins 6 % → EKR 5 %', () => {
    const r = run(U, { profit: 10000, revenue: 2000000, equity: 200000, debt: 800000, interestExpense: 48000 });
    expect(r.primary.value).toBeCloseTo(0.5, 9);
    expect(sec(r, 'roa')!.value).toBeCloseTo(5.8, 9);
    expect(sec(r, 'debtRate')!.value).toBeCloseTo(6, 9);
    expect(sec(r, 'roe')!.value).toBeCloseTo(5, 9);
    expect(sec(r, 'leverage')!.formattedValue).toMatch(/^Negativ/);
  });

  it('frühere Einzelrechner: EK 250.000 € / 40.000 € = 16 %; GK 1 Mio. €, 60.000 € + 20.000 € = 8 %', () => {
    const ek = run(U, { profit: 40000, revenue: 0, equity: 250000, debt: 0, interestExpense: 0 });
    expect(ek.primary.id).toBe('roe');
    expect(ek.primary.value).toBeCloseTo(16, 9);
    const gk = run(U, { profit: 60000, revenue: 0, equity: 400000, debt: 600000, interestExpense: 20000 });
    expect(sec(gk, 'roa')!.value).toBeCloseTo(8, 9);
  });

  it('nur Umsatzrendite, wenn Kapital 0 ist (Optionale Felder)', () => {
    const r = run(U, { profit: 45000, revenue: 900000, equity: 0, debt: 0, interestExpense: 0 });
    expect(r.primary.value).toBeCloseTo(5, 9);
    expect(sec(r, 'roe')).toBeUndefined();
    expect(sec(r, 'roa')).toBeUndefined();
    expect(r.qualifications!.join(' ')).toMatch(/Eigenkapitalrentabilität nicht berechnet/);
  });

  it('negatives Eigenkapital: EK-Rendite nicht aussagekräftig, GK-Rendite bleibt', () => {
    const r = run(U, { profit: 10000, revenue: 500000, equity: -50000, debt: 300000, interestExpense: 15000 });
    expect(sec(r, 'roe')).toBeUndefined();
    expect(sec(r, 'roa')!.value).toBeCloseTo((25000 / 250000) * 100, 9);
    expect(r.qualifications!.join(' ')).toMatch(/negativ/);
  });

  it('Bestandsverhalten: Break-Even und Umsatz 0 €', () => {
    const be = calcOf(U).calculate({ revenue: 1000000, profit: 0 });
    expect(be.primary.value).toBe(0);
    expect(sec(be, 'rating')!.formattedValue).toContain('Break-Even');
    const zero = calcOf(U).calculate({ revenue: 0, profit: 5000 });
    expect(Number.isFinite(zero.primary.value as number)).toBe(true);
    expect(zero.summaryText).toContain('größer als 0 €');
  });

  it('Fehler bei fehlendem Gewinn und negativen Beträgen', () => {
    expect(run(U, { profit: '' }).error).toMatch(/Gewinn/);
    expect(run(U, { revenue: -1 }).error).toMatch(/Umsatz/);
    expect(run(U, { debt: -1 }).error).toMatch(/Fremdkapital/);
    expect(run(U, { interestExpense: -1 }).error).toMatch(/zinsen/i);
    expect(run(U, { revenue: 0, equity: 0, debt: 0 }).error).toMatch(/größer als 0 €/);
  });
});

describe('binaer-hex-dezimal-umrechner', () => {
  const H = 'binaer-hex-dezimal-umrechner';

  it('Standard: Dezimal 255 → FF, 1111 1111, 377', () => {
    const r = run(H);
    expect(r.primary.formattedValue).toBe('FF');
    expect(r.primary.value).toBe(255);
    expect(sec(r, 'binary')!.formattedValue).toBe('1111 1111');
    expect(sec(r, 'octal')!.formattedValue).toBe('377');
    expect(sec(r, 'bitsCount')!.value).toBe(8);
  });

  it('Eingabe in jeder Basis (2, 8, 10, 16) inkl. Präfixen und Leerzeichen', () => {
    const hex = run(H, { inputBase: '16', numberValue: '1A3' });
    expect(hex.primary.formattedValue).toBe('419'); // 1·256 + 10·16 + 3
    expect(sec(hex, 'binary')!.formattedValue).toBe('0001 1010 0011');
    expect(sec(hex, 'octal')!.formattedValue).toBe('643');
    expect(run(H, { inputBase: '16', numberValue: '0x7f' }).primary.value).toBe(127);
    expect(run(H, { inputBase: '2', numberValue: '1111 1111' }).primary.value).toBe(255);
    expect(run(H, { inputBase: '2', numberValue: '0b101' }).primary.value).toBe(5);
    expect(run(H, { inputBase: '8', numberValue: '755' }).primary.value).toBe(7 * 64 + 5 * 8 + 5);
    expect(run(H, { inputBase: '10', numberValue: '1000000' }).primary.formattedValue).toBe('F4240');
    expect(sec(run(H, { inputBase: '16', numberValue: '10000' }), 'decimal')).toBeUndefined();
    expect(run(H, { inputBase: '16', numberValue: '10000' }).primary.formattedValue).toBe('65.536');
  });

  it('negative Zahlen mit Vorzeichen und 0', () => {
    expect(run(H, { numberValue: '-255' }).primary.formattedValue).toBe('−FF');
    const zero = run(H, { numberValue: '0' });
    expect(zero.primary.formattedValue).toBe('0');
    expect(sec(zero, 'bitsCount')!.value).toBe(1);
  });

  it('ungültige Ziffern, leere Eingabe und zu große Zahlen ergeben klare Fehler', () => {
    expect(run(H, { inputBase: '16', numberValue: 'G1' }).error).toMatch(/„G“.*Hexadezimalsystem/);
    expect(run(H, { inputBase: '2', numberValue: '102' }).error).toMatch(/„2“.*Binärsystem/);
    expect(run(H, { inputBase: '8', numberValue: '9' }).error).toMatch(/Oktalsystem/);
    expect(run(H, { inputBase: '10', numberValue: '12,5' }).error).toMatch(/Dezimalsystem/);
    expect(run(H, { numberValue: '' }).error).toMatch(/Zahl/);
    const max = run(H, { inputBase: '16', numberValue: 'F'.repeat(64) });
    expect(max.error).toBeUndefined();
    expect(Number.isFinite(max.primary.value as number)).toBe(true);
    expect(sec(max, 'bitsCount')!.value).toBe(256);
    expect(run(H, { inputBase: '16', numberValue: '1' + '0'.repeat(64) }).error).toMatch(/256 Bit/);
  });

  it('alte Links mit decimalNumber funktionieren weiter', () => {
    expect(calcOf(H).calculate({ decimalNumber: 255 }).primary.formattedValue).toBe('FF');
  });

  it('Hex-Rechnen: FF + 1A = 119 (281), Subtraktion, Multiplikation, Division mit Rest', () => {
    const add = run(H, { mode: 'arithmetic', arithBase: '16', numberA: 'FF', operator: 'add', numberB: '1A' });
    expect(add.primary.formattedValue).toBe('119');
    expect(add.primary.value).toBe(281);
    expect(sec(add, 'decimal')!.formattedValue).toBe('281');
    const sub = run(H, { mode: 'arithmetic', arithBase: '16', numberA: '1A', operator: 'sub', numberB: 'FF' });
    expect(sub.primary.value).toBe(26 - 255);
    expect(sub.primary.formattedValue).toBe('−E5');
    const mul = run(H, { mode: 'arithmetic', arithBase: '16', numberA: 'FF', operator: 'mul', numberB: 'FF' });
    expect(mul.primary.value).toBe(65025);
    expect(mul.primary.formattedValue).toBe('FE01');
    const div = run(H, { mode: 'arithmetic', arithBase: '16', numberA: 'FF', operator: 'div', numberB: '10' });
    expect(div.primary.value).toBe(15);
    expect(div.primary.formattedValue).toBe('F Rest F');
    expect(sec(div, 'remainder')!.value).toBe(15);
  });

  it('Bitoperationen und Binär-Rechnen', () => {
    expect(run(H, { mode: 'arithmetic', arithBase: '16', numberA: 'FF', operator: 'and', numberB: '0F' }).primary.value).toBe(15);
    expect(run(H, { mode: 'arithmetic', arithBase: '16', numberA: 'F0', operator: 'or', numberB: '0F' }).primary.value).toBe(255);
    expect(run(H, { mode: 'arithmetic', arithBase: '16', numberA: 'FF', operator: 'xor', numberB: '0F' }).primary.value).toBe(240);
    const bin = run(H, { mode: 'arithmetic', arithBase: '2', numberA: '1010', operator: 'add', numberB: '0110' });
    expect(bin.primary.value).toBe(16);
    expect(bin.primary.formattedValue).toBe('0001 0000');
  });

  it('Rechnen: Fehler bei Division durch 0, negativen Bitoperanden und falschen Ziffern', () => {
    expect(run(H, { mode: 'arithmetic', numberA: 'FF', operator: 'div', numberB: '0' }).error).toMatch(/Division durch 0/);
    expect(run(H, { mode: 'arithmetic', numberA: '-1', operator: 'and', numberB: 'F' }).error).toMatch(/nicht-negative/);
    expect(run(H, { mode: 'arithmetic', arithBase: '2', numberA: '12', operator: 'add', numberB: '1' }).error).toMatch(/Binärsystem/);
    expect(run(H, { mode: 'arithmetic', numberB: '' }).error).toMatch(/zweite Zahl/);
  });

  it('Farbcodes: #FF8000 → rgb(255, 128, 0), #F80 → #FF8800, RGB → Hex', () => {
    const c1 = run(H, { mode: 'color', colorValue: '#FF8000' });
    expect(c1.primary.formattedValue).toBe('rgb(255, 128, 0)');
    expect(sec(c1, 'red')!.value).toBe(255);
    expect(sec(c1, 'green')!.value).toBe(128);
    expect(sec(c1, 'blue')!.value).toBe(0);
    expect(sec(c1, 'colorDecimal')!.value).toBe(0xff8000);
    expect(sec(run(H, { mode: 'color', colorValue: 'f80' }), 'hexColor')!.formattedValue).toBe('#FF8800');
    expect(run(H, { mode: 'color', colorValue: '255, 128, 0' }).primary.formattedValue).toBe('#FF8000');
    expect(run(H, { mode: 'color', colorValue: 'rgb(0, 0, 0)' }).primary.formattedValue).toBe('#000000');
    expect(run(H, { mode: 'color', colorValue: '300, 0, 0' }).error).toMatch(/0 und 255/);
    expect(run(H, { mode: 'color', colorValue: '#GG0000' }).error).toMatch(/Farbformat/);
    expect(run(H, { mode: 'color', colorValue: '' }).error).toMatch(/Farbcode/);
  });
});

describe('essloeffel-teeloeffel-gramm-rechner', () => {
  const E = 'essloeffel-teeloeffel-gramm-rechner';

  it('Löffel: Standard 3 gehäufte EL Zucker = 60 g; Beispiele 45 g Mehl und 12 g Salz', () => {
    expect(run(E).primary.value).toBe(60);
    expect(run(E, { spoonsCount: 3, spoonType: 'elHeaped', ingredient: 'flour' }).primary.value).toBe(45);
    const salt = run(E, { spoonsCount: 2, spoonType: 'tlLevel', ingredient: 'salt' });
    expect(salt.primary.value).toBe(12);
    expect(sec(salt, 'mlVol')!.value).toBe(10);
  });

  it('Gramm in ml: 200 g Mehl = 377,4 ml; 142 g Honig = 100 ml; 250 g Wasser = 250 ml', () => {
    const flour = run(E, { mode: 'gramsToMl', amountGrams: 200, densityIngredient: 'flour' });
    expect(flour.primary.value).toBeCloseTo(200 / 0.53, 9);
    expect(flour.primary.formattedValue).toBe('377,4 ml');
    expect(sec(flour, 'tablespoons')!.value).toBeCloseTo(200 / 0.53 / 15, 9);
    expect(run(E, { mode: 'gramsToMl', amountGrams: 142, densityIngredient: 'honey' }).primary.value).toBeCloseTo(100, 9);
    expect(run(E, { mode: 'gramsToMl', amountGrams: 250, densityIngredient: 'water' }).primary.value).toBe(250);
  });

  it('ml in Gramm: 250 ml Milch = 257,5 g; 100 ml Öl = 92 g', () => {
    expect(run(E, { mode: 'mlToGrams', amountMl: 250, densityIngredient: 'milk' }).primary.value).toBeCloseTo(257.5, 9);
    expect(run(E, { mode: 'mlToGrams', amountMl: 100, densityIngredient: 'oil' }).primary.value).toBeCloseTo(92, 9);
  });

  it('nutzt dieselben Dichten wie der frühere Gramm-in-ml-Rechner', () => {
    for (const key of ['water', 'flour', 'sugar', 'icingSugar', 'oil', 'butter', 'honey', 'rice', 'oats']) {
      const legacy = calculateGramsToMl({ grams: 300, ingredient: key }).primary.value as number;
      const merged = run(E, { mode: 'gramsToMl', amountGrams: 300, densityIngredient: key }).primary.value as number;
      expect(merged, key).toBeCloseTo(legacy, 9);
    }
  });

  it('0 ergibt 0, negative oder leere Werte und unbekannte Zutaten ergeben Fehler', () => {
    expect(run(E, { mode: 'gramsToMl', amountGrams: 0 }).primary.value).toBe(0);
    expect(run(E, { mode: 'mlToGrams', amountMl: 0 }).primary.value).toBe(0);
    expect(run(E, { spoonsCount: 0 }).primary.value).toBe(0);
    expect(run(E, { spoonsCount: -1 }).error).toMatch(/negativ/);
    expect(run(E, { spoonsCount: '' }).error).toMatch(/Anzahl/);
    expect(run(E, { mode: 'gramsToMl', amountGrams: -5 }).error).toMatch(/negativ/);
    expect(run(E, { mode: 'mlToGrams', amountMl: '' }).error).toMatch(/Milliliter/);
    expect(run(E, { mode: 'gramsToMl', densityIngredient: 'sand' }).error).toMatch(/Zutat/);
    expect(Number.isFinite(run(E, { mode: 'gramsToMl', amountGrams: 1e15 }).primary.value as number)).toBe(true);
  });

  it('Tabellen im Seitentext stammen aus denselben Werten wie der Rechner', () => {
    const text = calcOf(E).content!.sections!.map((s) => s.content).join('\n');
    expect(text).toContain('| Weizenmehl | 10 g | 15 g | 3,5 g | 6 g |');
    expect(text).toContain('| Weizenmehl | 0,53 g/ml | 189 ml | 53 g |');
    expect(text).toContain('| Milch | 1,03 g/ml | 97 ml | 103 g |');
  });
});
