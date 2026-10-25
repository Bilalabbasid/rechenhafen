import { describe, it, expect, vi } from 'vitest';
import { getCalc, secondary, expectScopedSitemapLastmod } from './seo-ctr-helpers';

/**
 * Regression tests for the Unterhalt calculators, verified on 2026-10-25. Expected numbers are literal values
 * from the official publications, not from the config:
 *  - OLG Düsseldorf, Düsseldorfer Tabelle Stand 01.01.2026, Anhang „Tabelle Zahlbeträge“ (Kindergeld 259 €)
 *  - Mindestunterhalt 2026: 486 / 558 / 653 € (§ 1 MUV i. d. F. vom 15.11.2024, BGBl. 2024 I Nr. 359)
 *  - Unterhaltsvorschuss 2026: 227 / 299 / 394 € (BMBFSFJ, Leistungen für Alleinerziehende 2026)
 *  - DT 2026 Anm. A.IV: 990 € Bedarf bei eigenem Haushalt; Anm. A.VII: Selbstbehalt 1.450 / 1.200 / 1.750 €
 *  - Leitlinien NRW 2026 Nr. 10.2.3: 100 € Ausbildungsaufwand; Nr. 12.2: hälftige Anrechnung bei Minderjährigen
 */
const UNTERHALT_SLUGS = [
  'unterhaltsvorschuss-rechner',
  'duesseldorfer-tabelle-rechner',
  'unterhalt-volljaehrige-kinder-rechner',
  'ausbildungsunterhalt-bedarfskontrollbetrag-rechner',
];

const normalize = (s: string) => s.replace(/\s/g, ' ');

// Anhang „Tabelle Zahlbeträge“ der Düsseldorfer Tabelle 2026: [Obergrenze Netto, 0–5, 6–11, 12–17, ab 18]
const ZAHLBETRAEGE_2026: [number, number, number, number, number][] = [
  [2100, 356.5, 428.5, 523.5, 439],
  [2500, 381.5, 456.5, 556.5, 474],
  [2900, 405.5, 484.5, 589.5, 509],
  [3300, 429.5, 512.5, 621.5, 544],
  [3700, 454.5, 540.5, 654.5, 579],
  [4100, 493.5, 585.5, 706.5, 635],
  [4500, 531.5, 629.5, 759.5, 691],
  [4900, 570.5, 674.5, 811.5, 747],
  [5300, 609.5, 719.5, 863.5, 802],
  [5700, 648.5, 763.5, 915.5, 858],
  [6400, 687.5, 808.5, 968.5, 914],
  [7200, 726.5, 853.5, 1020.5, 970],
  [8200, 765.5, 897.5, 1072.5, 1026],
  [9700, 804.5, 942.5, 1124.5, 1082],
  [11200, 842.5, 986.5, 1176.5, 1137],
];

const dt = (netIncomeAdjusted: number, childAgeCategory: string, payerEmployed = 'yes') =>
  getCalc('duesseldorfer-tabelle-rechner').calculate({ netIncomeAdjusted: String(netIncomeAdjusted), childAgeCategory, payerEmployed });

describe('Düsseldorfer Tabelle 2026 calculator', () => {
  it('reproduces every Zahlbetrag of the official 2026 Zahlbetragstabelle (15 groups × 4 age stages)', () => {
    ZAHLBETRAEGE_2026.forEach(([net, ...zahlbetraege], i) => {
      ['group1', 'group2', 'group3', 'group4'].forEach((group, j) => {
        const res = dt(net, group);
        expect(secondary(res, 'einkommensgruppe')?.value, `${net} ${group}`).toBe(i + 1);
        expect(secondary(res, 'zahlbetragTabelle')?.value, `${net} ${group}`).toBeCloseTo(zahlbetraege[j], 2);
      });
    });
  });

  it('uses the Mindestunterhalt 2026 (486 / 558 / 653 €, ab 18: 698 €) as Tabellenbetrag of group 1', () => {
    expect(secondary(dt(2100, 'group1'), 'tabellenbetrag')?.value).toBe(486);
    expect(secondary(dt(2100, 'group2'), 'tabellenbetrag')?.value).toBe(558);
    expect(secondary(dt(2100, 'group3'), 'tabellenbetrag')?.value).toBe(653);
    // 4. Altersstufe = 125 % der 2. Altersstufe: 558 × 1,25 = 697,50 → 698 €
    expect(secondary(dt(2100, 'group4'), 'tabellenbetrag')?.value).toBe(698);
  });

  it('rounds the Tabellenbetrag up to full euros and avoids float artefacts at 200 %', () => {
    // 558 × 110 % = 613,80 → 614 € (früher kaufmännisch auf 606 € gerundet und mit 551 € Basis gerechnet)
    expect(secondary(dt(2700, 'group2'), 'tabellenbetrag')?.value).toBe(614);
    // 653 × 200 % = 1.306 € exakt
    expect(secondary(dt(11200, 'group3'), 'tabellenbetrag')?.value).toBe(1306);
  });

  it('switches income groups exactly at the 2026 limits and caps at group 15', () => {
    expect(secondary(dt(2100, 'group2'), 'einkommensgruppe')?.value).toBe(1);
    expect(secondary(dt(2101, 'group2'), 'einkommensgruppe')?.value).toBe(2);
    expect(secondary(dt(4101, 'group2'), 'einkommensgruppe')?.value).toBe(7);
    expect(secondary(dt(15000, 'group2'), 'einkommensgruppe')?.value).toBe(15);
    expect(secondary(dt(2900, 'group2'), 'bedarfskontrollbetrag')?.value).toBe(1850);
    expect(secondary(dt(11200, 'group2'), 'bedarfskontrollbetrag')?.value).toBe(5050);
  });

  it('deducts half the 2026 Kindergeld (259 € ÷ 2 = 129,50 €) for minors and the full 259 € for adults', () => {
    for (const group of ['group1', 'group2', 'group3']) {
      expect(secondary(dt(3000, group), 'kindergeldDeduction')?.value).toBe(129.5);
    }
    expect(secondary(dt(3000, 'group4'), 'kindergeldDeduction')?.value).toBe(259);
  });

  it('limits the Zahlbetrag to income above the Selbstbehalt (1.450 € / 1.200 € / 1.750 €)', () => {
    // Tabelle 523,50 €, aber 1.600 € − 1.450 € = 150 €
    expect(dt(1600, 'group3').primary.value).toBe(150);
    // nicht erwerbstätig: 1.600 € − 1.200 € = 400 €
    expect(dt(1600, 'group3', 'no').primary.value).toBe(400);
    // volljährig (angemessener Selbstbehalt): Tabelle 439 €, aber 2.100 € − 1.750 € = 350 €
    expect(dt(2100, 'group4').primary.value).toBe(350);
    // ausreichend leistungsfähig: voller Tabellen-Zahlbetrag
    expect(dt(2700, 'group2').primary.value).toBe(484.5);
  });

  it('keeps the worked example in sync with the calculator (2.700 €, 8 Jahre → 484,50 €)', () => {
    const calc = getCalc('duesseldorfer-tabelle-rechner');
    const res = calc.calculate({ netIncomeAdjusted: '2700', childAgeCategory: 'group2' });
    expect(res.primary.value).toBe(484.5);
    expect(calc.workedExample?.result).toContain(normalize(res.primary.formattedValue ?? ''));
  });
});

describe('Unterhaltsvorschuss 2026', () => {
  const uvg = (childAgeGroup: string, partialPayment = '0') =>
    getCalc('unterhaltsvorschuss-rechner').calculate({ childAgeGroup, partialPayment });

  it('pays Mindestunterhalt minus full Kindergeld: 227 / 299 / 394 €', () => {
    expect(uvg('age0_5').primary.value).toBe(486 - 259);
    expect(uvg('age0_5').primary.value).toBe(227);
    expect(uvg('age6_11').primary.value).toBe(299);
    expect(uvg('age12_17').primary.value).toBe(394);
    expect(uvg('age6_11', '100').primary.value).toBe(199);
  });

  it('shows the 2026 amounts in the select labels and the worked example', () => {
    const calc = getCalc('unterhaltsvorschuss-rechner');
    const labels = calc.inputs[0].options!.map((o) => o.label).join(' | ');
    expect(labels).toContain('227 €');
    expect(labels).toContain('299 €');
    expect(labels).toContain('394 €');
    expect(calc.workedExample?.result).toBe('299,00 € monatlich');
  });
});

describe('Unterhalt volljährige Kinder 2026', () => {
  const vk = (livingArrangement: string, childOwnIncome = '0', parentsCombinedNet = '3000') =>
    getCalc('unterhalt-volljaehrige-kinder-rechner').calculate({ livingArrangement, childOwnIncome, parentsCombinedNet });

  it('uses the 990 € Bedarf for an own household minus 259 € Kindergeld', () => {
    expect(vk('own_household').primary.value).toBe(990 - 259);
    expect(vk('own_household', '300').primary.value).toBe(431);
    expect(vk('own_household', '900').primary.value).toBe(0);
  });

  it('uses the 4. Altersstufe of the combined parental income when living at home', () => {
    // Gruppe 1: 698 − 259 = 439 € (amtlicher Zahlbetrag); Gruppe 4 (3.000 €): 803 − 259 = 544 €
    expect(vk('with_parents', '0', '2100').primary.value).toBe(439);
    expect(vk('with_parents', '0', '3000').primary.value).toBe(544);
    expect(vk('with_parents', '0', '11200').primary.value).toBe(1137);
  });

  it('keeps the worked example in sync (731,00 €)', () => {
    expect(getCalc('unterhalt-volljaehrige-kinder-rechner').workedExample?.result).toBe('731,00 € monatlicher Elternunterhalt');
  });
});

describe('Ausbildungsunterhalt 2026', () => {
  const au = (netApprenticeSalary: string, baseChildSupport: string, childSituation?: string) =>
    getCalc('ausbildungsunterhalt-bedarfskontrollbetrag-rechner').calculate({ netApprenticeSalary, baseChildSupport, ...(childSituation ? { childSituation } : {}) });

  it('deducts the 100 € Ausbildungsaufwand and credits adults fully (default unchanged)', () => {
    expect(au('750', '620').primary.value).toBe(0);
    expect(au('500', '620', 'adult_at_home').primary.value).toBe(620 - 400);
  });

  it('credits a minor living with a parent only half', () => {
    // (750 − 100) ÷ 2 = 325 € → 620 − 325 = 295 €
    expect(au('750', '620', 'minor_at_home').primary.value).toBe(295);
  });

  it('applies no extra allowance for an own household (already in the 990 € Bedarf)', () => {
    expect(au('500', '620', 'adult_own_household').primary.value).toBe(120);
  });
});

describe('Kindergeld comes from getTaxConfig(2026)', () => {
  it('propagates a changed kindergeldMonat into all Unterhalt calculators', async () => {
    vi.resetModules();
    vi.doMock('@/data/regulated/tax', async (importOriginal) => {
      const actual = await importOriginal<typeof import('@/data/regulated/tax')>();
      return { ...actual, getTaxConfig: (year?: number | string) => ({ ...actual.getTaxConfig(year), kindergeldMonat: 300 }) };
    });
    const { EXTRA_GESUNDHEIT_FAMILIE } = await import('@/data/calculators/extra/gesundheitFamilie');
    const find = (slug: string) => EXTRA_GESUNDHEIT_FAMILIE.find((c) => c.slug === slug)!;

    const dtRes = find('duesseldorfer-tabelle-rechner').calculate({ netIncomeAdjusted: '2700', childAgeCategory: 'group2' });
    expect(secondary(dtRes, 'kindergeldDeduction')?.value).toBe(150);
    expect(dtRes.primary.value).toBe(614 - 150);
    expect(find('unterhaltsvorschuss-rechner').calculate({ childAgeGroup: 'age6_11', partialPayment: '0' }).primary.value).toBe(558 - 300);
    expect(find('unterhalt-volljaehrige-kinder-rechner').calculate({ livingArrangement: 'own_household', childOwnIncome: '0' }).primary.value).toBe(990 - 300);

    vi.doUnmock('@/data/regulated/tax');
    vi.resetModules();
  });
});

describe('Unterhalt pages: sources, freshness and no stale 2024/2025 values', () => {
  it('cites the verification date and an official source on every page', () => {
    for (const slug of UNTERHALT_SLUGS) {
      const calc = getCalc(slug);
      expect(calc.isTimeSensitive, slug).toBe(true);
      expect(calc.timeSensitiveMeta?.lastVerified, slug).toBe('2026-10-25');
      expect(calc.timeSensitiveMeta?.sourceUrl, slug).toMatch(/^https:\/\/www\.(olg-duesseldorf\.nrw\.de|bmbfsfj\.bund\.de)\//);
    }
  });

  it('no longer mentions the old table values in copy, FAQs or labels', () => {
    for (const slug of UNTERHALT_SLUGS) {
      const text = normalize(JSON.stringify(getCalc(slug)));
      expect(text, slug).not.toMatch(/(?<![\d.,])(480|551|645|689|930|230|301|395) ?€/);
      expect(text, slug).not.toMatch(/(?<![\d.,])(125|250) ?€/);
      expect(text, slug).not.toMatch(/150 €\)/);
    }
  });

  it('bumps the sitemap lastmod for exactly these re-verified pages', () => {
    expectScopedSitemapLastmod(UNTERHALT_SLUGS);
  });
});
