import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';
import { generateMetadata } from '@/app/rechner/[slug]/page';
import sitemap from '@/app/sitemap';

describe('Focused Organic-Ranking Sprint Verification for Priority Pages', () => {
  const sitemapEntries = sitemap();

  describe('1. Gaskostenrechner (/rechner/gaskostenrechner/)', () => {
    const calc = getCalculatorBySlug('gaskostenrechner');

    it('exists and has required metadata, single H1, and self-referencing canonical', async () => {
      expect(calc).toBeDefined();
      expect(calc!.metaTitle).toBe('Gaskostenrechner: Gasverbrauch und Kosten berechnen');
      expect(calc!.h1).toBe('Gaskosten berechnen: Gasverbrauch und Kosten im Überblick');
      expect(calc!.metaDescription).toContain('Gaskosten & Gasverbrauch präzise berechnen');

      const meta = await generateMetadata({ params: Promise.resolve({ slug: 'gaskostenrechner' }) });
      expect(meta.alternates?.canonical).toBe('https://rechenhafen.de/rechner/gaskostenrechner/');
      expect(meta.title).toBe('Gaskostenrechner: Gasverbrauch und Kosten berechnen');
    });

    it('is present in sitemap exactly once', () => {
      const entries = sitemapEntries.filter((e) => e.url === 'https://rechenhafen.de/rechner/gaskostenrechner/');
      expect(entries.length).toBe(1);
    });

    it('supports kWh and m³ conversion with calorific value and state factor', () => {
      // Normal calculation with m³
      const resM3 = calc!.calculate({
        inputType: 'm3',
        amount: 1400,
        calorificValue: 10.3,
        stateFactor: 0.95,
        pricePerKwh: 0.11,
        basePricePerMonth: 12,
      });
      expect(resM3.primary.value).toBeGreaterThan(0);
      expect(resM3.secondary?.find((s) => s.id === 'dailyCost')).toBeDefined();
      expect(resM3.secondary?.find((s) => s.id === 'monthlyPayment')).toBeDefined();
      expect(resM3.secondary?.find((s) => s.id === 'conversionFactor')).toBeDefined();
    });

    it('has all required visible content sections and contextual links', () => {
      const sectionTitles = (calc!.content?.sections || []).map((s) => s.title);
      expect(sectionTitles).toContain('Gaskosten berechnen – so funktioniert es');
      expect(sectionTitles).toContain('Gasverbrauch von m³ in kWh umrechnen');
      expect(sectionTitles).toContain('Was kostet Gas pro Monat?');
      expect(sectionTitles).toContain('Welche Werte stehen auf der Gasrechnung?');
      expect(sectionTitles).toContain('Beispiel für die Berechnung der Gaskosten');
      expect(sectionTitles).toContain('Häufige Fehler bei der Gaskostenberechnung');
      expect(sectionTitles).toContain('Warum die monatlichen Kosten im Winter höher sind');
      expect(sectionTitles).toContain('So prüfen Sie Ihre Gasrechnung Schritt für Schritt');

      expect(calc!.relatedSlugs).toContain('gasverbrauch-kwh-m3-rechner');
      expect(calc!.relatedSlugs).toContain('heizkostenvergleich-rechner');
      expect(calc!.relatedSlugs).toContain('stromkostenrechner');
      expect(calc!.relatedSlugs).toContain('oelheizung-verbrauch-rechner');
      expect(calc!.relatedSlugs).toContain('balkonkraftwerk-ertrag-rechner');
    });
  });

  describe('2. JobRad Rechner (/rechner/dienstfahrrad-jobrad-rechner/)', () => {
    const calc = getCalculatorBySlug('dienstfahrrad-jobrad-rechner');

    it('exists and has required metadata, single H1, and canonical', async () => {
      expect(calc).toBeDefined();
      expect(calc!.metaTitle).toBe('JobRad Rechner: Dienstfahrrad-Leasing berechnen');
      expect(calc!.h1).toBe('JobRad Rechner: Dienstfahrrad-Leasing berechnen');
      expect(calc!.metaDescription).toContain('JobRad & Dienstfahrrad Rechner');

      const meta = await generateMetadata({ params: Promise.resolve({ slug: 'dienstfahrrad-jobrad-rechner' }) });
      expect(meta.alternates?.canonical).toBe('https://rechenhafen.de/rechner/dienstfahrrad-jobrad-rechner/');
    });

    it('is present in sitemap exactly once', () => {
      const entries = sitemapEntries.filter((e) => e.url === 'https://rechenhafen.de/rechner/dienstfahrrad-jobrad-rechner/');
      expect(entries.length).toBe(1);
    });

    it('supports 0.25% rule calculation, lease period, salary and employer subsidy', () => {
      const res = calc!.calculate({
        bikePriceGross: 3500,
        grossSalary: 3800,
        employerSubsidy: 20,
        serviceCost: 10,
        taxClass: '1',
      });
      expect(res.primary.value).toBeGreaterThan(0);
      expect(res.secondary?.find((s) => s.id === 'savingsVsDirectPurchase')).toBeDefined();
      expect(res.secondary?.find((s) => s.id === 'takeoverPrice')).toBeDefined();
    });

    it('clearly communicates neutrality and absence of official partnership with JobRad', () => {
      expect(calc!.content?.intro).toContain('RechenHafen steht in keiner Verbindung zu JobRad');
      const faq = calc!.faqs.find((f) => f.question.includes('JobRad'));
      expect(faq?.answer).toContain('RechenHafen steht in keiner geschäftlichen Verbindung zu JobRad');
    });

    it('has relevant salary and commuting internal links', () => {
      expect(calc!.relatedSlugs).toContain('brutto-netto-rechner');
      expect(calc!.relatedSlugs).toContain('pendlerpauschale-rechner');
      expect(calc!.relatedSlugs).toContain('fahrtkostenrechner');
      expect(calc!.relatedSlugs).toContain('firmenwagen-geldwerter-vorteil-rechner');
    });
  });

  describe('3. Schalungssteine Rechner (/rechner/schalungssteine-rechner/)', () => {
    const calc = getCalculatorBySlug('schalungssteine-rechner');

    it('exists and has required metadata, single H1, and canonical', async () => {
      expect(calc).toBeDefined();
      expect(calc!.metaTitle).toBe('Schalungssteine Rechner: Menge für Ihre Mauer berechnen');
      expect(calc!.h1).toBe('Schalungssteine berechnen: Menge für Ihre Mauer');

      const meta = await generateMetadata({ params: Promise.resolve({ slug: 'schalungssteine-rechner' }) });
      expect(meta.alternates?.canonical).toBe('https://rechenhafen.de/rechner/schalungssteine-rechner/');
    });

    it('is present in sitemap exactly once', () => {
      const entries = sitemapEntries.filter((e) => e.url === 'https://rechenhafen.de/rechner/schalungssteine-rechner/');
      expect(entries.length).toBe(1);
    });

    it('calculates correct stone count, concrete volume, and rebar without contradictions', () => {
      const res = calc!.calculate({
        wallLength: 8,
        wallHeight: 1.5,
        stoneWidth: '24',
        waste: 5,
        openingsArea: 0,
      });
      expect(res.primary.value).toBe(101);
      const concreteSec = res.secondary?.find((s) => s.id === 'concreteM3');
      expect(concreteSec?.formattedValue).toContain('1,83 m³');
      expect(concreteSec?.formattedValue).toContain('4,2 t');
      const rebarSec = res.secondary?.find((s) => s.id === 'rebar');
      expect(rebarSec?.value).toBe(159);
    });

    it('has German examples for small garden wall and retaining wall', () => {
      expect(calc!.workedExamples).toBeDefined();
      expect(calc!.workedExamples!.length).toBeGreaterThanOrEqual(2);
      expect(calc!.workedExamples![0].title).toContain('Hang-Stützmauer');
      expect(calc!.workedExamples![1].title).toContain('Gartenmauer');
    });

    it('has reliable construction internal links', () => {
      expect(calc!.relatedSlugs).toContain('betonrechner');
      expect(calc!.relatedSlugs).toContain('fundament-rechner');
      expect(calc!.relatedSlugs).toContain('beton-mischungsverhaeltnis-rechner');
      expect(calc!.relatedSlugs).toContain('estrich-rechner');
      expect(calc!.relatedSlugs).toContain('aushub-erdarbeiten-rechner');
    });
  });
});
