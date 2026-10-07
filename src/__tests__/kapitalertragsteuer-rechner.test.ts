import { describe, it, expect } from 'vitest';
import { EXTRA_FINANZEN_KREDIT } from '@/data/calculators/extra/finanzenKredit';
import sitemap from '@/app/sitemap';
import * as fs from 'fs';
import * as path from 'path';

describe('Kapitalertragsteuer-Rechner (Finding A Audit & Fix)', () => {
  const calc = EXTRA_FINANZEN_KREDIT.find((c) => c.slug === 'kapitalertragsteuer-rechner');

  it('exists with correct slug, category and metadata', () => {
    expect(calc).toBeDefined();
    expect(calc?.id).toBe('kapitalertragsteuer-rechner');
    expect(calc?.slug).toBe('kapitalertragsteuer-rechner');
    expect(calc?.category).toBe('finanzen');
    expect(calc?.isTimeSensitive).toBe(true);
    expect(calc?.timeSensitiveMeta?.year).toBe(2026);
    expect(calc?.legalFootnotes && calc.legalFootnotes.length >= 5).toBe(true);
  });

  it('Test Case 1: Zero income (0 €)', () => {
    const res = calc!.calculate({
      capitalIncome: 0,
      maritalStatus: 'single',
      usedAllowance: 0,
      churchState: 'none',
    });
    expect(res.primary.value).toBe(0);
    expect(res.primary.formattedValue).toBe('0,00 €');
    expect(res.secondary?.find((s) => s.id === 'net')?.value).toBe(0);
    expect(res.secondary?.find((s) => s.id === 'taxFree')?.value).toBe(0);
    expect(res.secondary?.find((s) => s.id === 'taxable')?.value).toBe(0);
  });

  it('Test Case 2: Below allowance (600 € income, single)', () => {
    const res = calc!.calculate({
      capitalIncome: 600,
      maritalStatus: 'single',
      usedAllowance: 0,
      churchState: 'none',
    });
    expect(res.primary.value).toBe(0);
    expect(res.secondary?.find((s) => s.id === 'net')?.value).toBe(600);
    expect(res.secondary?.find((s) => s.id === 'taxFree')?.value).toBe(600);
    expect(res.secondary?.find((s) => s.id === 'taxable')?.value).toBe(0);
    expect(res.secondary?.find((s) => s.id === 'kapEst')?.value).toBe(0);
    expect(res.secondary?.find((s) => s.id === 'solz')?.value).toBe(0);
  });

  it('Test Case 3: Exactly at allowance (1.000 € income, single)', () => {
    const res = calc!.calculate({
      capitalIncome: 1000,
      maritalStatus: 'single',
      usedAllowance: 0,
      churchState: 'none',
    });
    expect(res.primary.value).toBe(0);
    expect(res.secondary?.find((s) => s.id === 'net')?.value).toBe(1000);
    expect(res.secondary?.find((s) => s.id === 'taxFree')?.value).toBe(1000);
    expect(res.secondary?.find((s) => s.id === 'taxable')?.value).toBe(0);
  });

  it('Test Case 4: Above allowance without church tax (3.000 € income, single)', () => {
    const res = calc!.calculate({
      capitalIncome: 3000,
      maritalStatus: 'single',
      usedAllowance: 0,
      churchState: 'none',
    });
    // Taxable: 2000 €
    // KapESt: 500,00 €
    // SolZ: 27,50 €
    // Total Tax: 527,50 €
    // Net: 2472,50 €
    expect(res.secondary?.find((s) => s.id === 'taxFree')?.value).toBe(1000);
    expect(res.secondary?.find((s) => s.id === 'taxable')?.value).toBe(2000);
    expect(res.secondary?.find((s) => s.id === 'kapEst')?.value).toBe(500);
    expect(res.secondary?.find((s) => s.id === 'solz')?.value).toBe(27.5);
    expect(res.primary.value).toBe(527.5);
    expect(res.secondary?.find((s) => s.id === 'net')?.value).toBe(2472.5);
  });

  it('Test Case 5: Joint assessment (3.000 € income, married, 2.000 € allowance)', () => {
    const res = calc!.calculate({
      capitalIncome: 3000,
      maritalStatus: 'married',
      usedAllowance: 0,
      churchState: 'none',
    });
    // Taxable: 1000 €
    // KapESt: 250,00 €
    // SolZ: 13,75 €
    // Total Tax: 263,75 €
    // Net: 2736,25 €
    expect(res.secondary?.find((s) => s.id === 'taxFree')?.value).toBe(2000);
    expect(res.secondary?.find((s) => s.id === 'taxable')?.value).toBe(1000);
    expect(res.secondary?.find((s) => s.id === 'kapEst')?.value).toBe(250);
    expect(res.secondary?.find((s) => s.id === 'solz')?.value).toBe(13.75);
    expect(res.primary.value).toBe(263.75);
    expect(res.secondary?.find((s) => s.id === 'net')?.value).toBe(2736.25);
  });

  it('Test Case 6a: Church tax 8 % (Bayern / Baden-Württemberg)', () => {
    const res = calc!.calculate({
      capitalIncome: 3000,
      maritalStatus: 'single',
      usedAllowance: 0,
      churchState: '8',
    });
    // Taxable: 2000 €
    // Formula § 32d Abs. 1 Satz 4: KapESt = e / (4 + k) = 2000 / 4.08 = 490.196... -> 490.20 €
    // SolZ: 5.5 % of 490.20 = 26.961 -> 26.96 €
    // KiSt: 8 % of 490.20 = 39.216 -> 39.22 €
    // Total Tax: 490.20 + 26.96 + 39.22 = 556.38 €
    // Net: 2443.62 €
    expect(res.secondary?.find((s) => s.id === 'kapEst')?.value).toBe(490.2);
    expect(res.secondary?.find((s) => s.id === 'solz')?.value).toBe(26.96);
    expect(res.secondary?.find((s) => s.id === 'kist')?.value).toBe(39.22);
    expect(res.primary.value).toBe(556.38);
    expect(res.secondary?.find((s) => s.id === 'net')?.value).toBe(2443.62);
  });

  it('Test Case 6b: Church tax 9 % (other 14 Bundesländer)', () => {
    const res = calc!.calculate({
      capitalIncome: 3000,
      maritalStatus: 'single',
      usedAllowance: 0,
      churchState: '9',
    });
    // Taxable: 2000 €
    // Formula § 32d Abs. 1 Satz 4: KapESt = e / (4 + k) = 2000 / 4.09 = 488.9975... -> 489.00 €
    // SolZ: 5.5 % of 489.00 = 26.895 -> 26.90 €
    // KiSt: 9 % of 489.00 = 44.01 €
    // Total Tax: 489.00 + 26.90 + 44.01 = 559.91 €
    // Net: 2440.09 €
    expect(res.secondary?.find((s) => s.id === 'kapEst')?.value).toBe(489.0);
    expect(res.secondary?.find((s) => s.id === 'solz')?.value).toBe(26.9);
    expect(res.secondary?.find((s) => s.id === 'kist')?.value).toBe(44.01);
    expect(res.primary.value).toBe(559.91);
    expect(res.secondary?.find((s) => s.id === 'net')?.value).toBe(2440.09);
  });

  it('Test Case 7: Allowance partially used elsewhere', () => {
    const res = calc!.calculate({
      capitalIncome: 3000,
      maritalStatus: 'single',
      usedAllowance: 600,
      churchState: 'none',
    });
    // Total allowance: 1000 €, 600 € used -> 400 € remaining
    // Taxable: 3000 - 400 = 2600 €
    // KapESt: 25% of 2600 = 650,00 €
    // SolZ: 5.5% of 650 = 35,75 €
    // Total Tax: 685,75 €
    expect(res.secondary?.find((s) => s.id === 'taxFree')?.value).toBe(400);
    expect(res.secondary?.find((s) => s.id === 'taxable')?.value).toBe(2600);
    expect(res.secondary?.find((s) => s.id === 'kapEst')?.value).toBe(650);
    expect(res.secondary?.find((s) => s.id === 'solz')?.value).toBe(35.75);
    expect(res.primary.value).toBe(685.75);
  });

  it('provides comprehensive basisSummary and qualifications', () => {
    const res = calc!.calculate({
      capitalIncome: 3000,
      maritalStatus: 'single',
      usedAllowance: 0,
      churchState: 'none',
    });
    expect(res.basisSummary).toBeDefined();
    expect(res.basisSummary!.length).toBeGreaterThanOrEqual(7);
    expect(res.qualifications).toBeDefined();
    expect(res.qualifications!.length).toBeGreaterThanOrEqual(4);
  });

  it('includes required content sections answering key user questions', () => {
    const sections = calc!.content?.sections;
    expect(sections).toBeDefined();
    expect(sections!.length).toBeGreaterThanOrEqual(5);
    const titles = sections!.map((s) => s.title);
    expect(titles.some((t) => t.includes('Wie hoch ist die Kapitalertragsteuer'))).toBe(true);
    expect(titles.some((t) => t.includes('Sparer-Pauschbetrag'))).toBe(true);
    expect(titles.some((t) => t.includes('Freistellungsauftrag'))).toBe(true);
    expect(titles.some((t) => t.includes('Günstigerprüfung'))).toBe(true);
    expect(titles.some((t) => t.includes('Was dieser Rechner nicht'))).toBe(true);
  });

  it('canonical URL is in sitemap exactly once', () => {
    const items = sitemap();
    const matches = items.filter(
      (item) => item.url === 'https://rechenhafen.de/rechner/kapitalertragsteuer-rechner/'
    );
    expect(matches.length).toBe(1);
  });
});

describe('Finding B: No malformed alternate URL or SearchAction placeholder', () => {
  it('layout.tsx has no SearchAction or search_term_string', () => {
    const layoutPath = path.resolve(process.cwd(), 'src/app/layout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    expect(layoutContent.includes('SearchAction')).toBe(false);
    expect(layoutContent.includes('search_term_string')).toBe(false);
    expect(layoutContent.includes('?q=')).toBe(false);
  });

  it('sitemap contains zero query strings or search templates', () => {
    const items = sitemap();
    for (const item of items) {
      expect(item.url.includes('?')).toBe(false);
      expect(item.url.includes('search_term_string')).toBe(false);
    }
  });

  it('homepage canonical is strictly https://rechenhafen.de/', () => {
    const items = sitemap();
    const homepage = items.find((item) => item.url === 'https://rechenhafen.de/');
    expect(homepage).toBeDefined();
  });
});
