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

    it('calculates correct stone count and concrete volume matching acceptance fixture', () => {
      // Acceptance fixture: 8 m × 1.5 m, no openings, 8 stones/m², 130 l/m², stone reserve 5%, concrete reserve 0%:
      // 96 base stones, 101 stones including reserve, 1.56 m³ fill concrete.
      const res0 = calc!.calculate({
        wallLength: 8,
        wallHeight: 1.5,
        fillMode: 'preset_delfing24',
        stoneReserve: 5,
        concreteReserve: 0,
        openingsArea: 0,
      });
      expect(res0.primary.value).toBe(101);
      const baseStones0 = res0.secondary?.find((s) => s.id === 'baseStones');
      expect(baseStones0?.value).toBe(96);
      const concreteSec0 = res0.secondary?.find((s) => s.id === 'concreteM3');
      expect(concreteSec0?.value).toBe(1.56);
      expect(concreteSec0?.formattedValue).toContain('1,56 m³');

      // With concrete reserve 5%: 1.638 m³ concrete before display rounding
      const res5 = calc!.calculate({
        wallLength: 8,
        wallHeight: 1.5,
        fillMode: 'preset_delfing24',
        stoneReserve: 5,
        concreteReserve: 5,
        openingsArea: 0,
      });
      const concreteSec5 = res5.secondary?.find((s) => s.id === 'concreteM3');
      expect(concreteSec5?.value).toBeCloseTo(1.638, 3);
      expect(concreteSec5?.formattedValue).toContain('1,64 m³');
    });

    it('has German worked examples with explicit manufacturer assumptions', () => {
      expect(calc!.workedExamples).toBeDefined();
      expect(calc!.workedExamples!.length).toBeGreaterThanOrEqual(2);
      expect(calc!.workedExamples![0].title).toContain('12 m² Mauer');
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

  describe('4. Maximaler Kredit Rechner (/rechner/maximaler-kredit-rechner/)', () => {
    const calc = getCalculatorBySlug('maximaler-kredit-rechner');

    it('exists and satisfies search intent "wie viel kredit bekomme ich"', async () => {
      expect(calc).toBeDefined();
      expect(calc!.metaTitle).toBe('Wie viel Kredit bekomme ich? Maximaler Kredit Rechner');
      expect(calc!.h1).toBe('Wie viel Kredit bekomme ich? – Maximaler Kredit Rechner');

      const meta = await generateMetadata({ params: Promise.resolve({ slug: 'maximaler-kredit-rechner' }) });
      expect(meta.alternates?.canonical).toBe('https://rechenhafen.de/rechner/maximaler-kredit-rechner/');
    });

    it('calculates realistic loan affordability based on household budget', () => {
      // 3.500 € net income, 1.600 € fixed, 200 € safety buffer, 3.5% interest, 25 years
      // Available rate = 3500 - 1600 - 200 = 1700 €/month
      const res = calc!.calculate({
        netIncome: 3500,
        fixedExpenses: 1600,
        existingLoans: 0,
        safetyBuffer: 200,
        interestRate: 3.5,
        termYears: 25,
        equity: 30000,
      });

      expect(res.primary.value).toBeGreaterThan(300000);
      const availableRate = res.secondary?.find((s) => s.id === 'availableRate');
      expect(availableRate?.value).toBe(1700);
      const totalBudget = res.secondary?.find((s) => s.id === 'totalBudget');
      expect(totalBudget?.value).toBeGreaterThan(res.primary.value as number);
      expect(res.basisSummary).toBeDefined();
      expect(res.notes?.[0].toLowerCase()).toContain('unverbindliche orientierung');
    });
  });

  describe('5. Warmmiete Rechner (/rechner/warmmiete-zu-kaltmiete-rechner/)', () => {
    const calc = getCalculatorBySlug('warmmiete-zu-kaltmiete-rechner');

    it('exists and answers "warmmiete berechnen"', async () => {
      expect(calc).toBeDefined();
      expect(calc!.metaTitle).toContain('Warmmiete berechnen');
      expect(calc!.h1).toContain('Warmmiete berechnen');

      const meta = await generateMetadata({ params: Promise.resolve({ slug: 'warmmiete-zu-kaltmiete-rechner' }) });
      expect(meta.alternates?.canonical).toBe('https://rechenhafen.de/rechner/warmmiete-zu-kaltmiete-rechner/');
    });

    it('calculates Warmmiete = Kaltmiete + Betriebskosten + Heizkosten cleanly', () => {
      const res = calc!.calculate({
        calculationDirection: 'warm_from_components',
        coldRentInput: 850,
        operatingCosts: 170,
        heatingCosts: 130,
        livingAreaMode1: 75,
      });

      expect(res.primary.value).toBe(1150);
      expect(res.primary.label).toContain('Warmmiete');
      const kalt = res.secondary?.find((s) => s.id === 'coldRent');
      expect(kalt?.value).toBe(850);
      const neben = res.secondary?.find((s) => s.id === 'operatingCosts');
      expect(neben?.value).toBe(170);
      const heiz = res.secondary?.find((s) => s.id === 'heatingCosts');
      expect(heiz?.value).toBe(130);
      expect(res.basisSummary).toBeDefined();
    });
  });

  describe('6. Notendurchschnitt Rechner (/rechner/notendurchschnitt-rechner/)', () => {
    const calc = getCalculatorBySlug('notendurchschnitt-rechner');

    it('exists and targets "notendurchschnitt berechnen"', async () => {
      expect(calc).toBeDefined();
      expect(calc!.metaTitle).toContain('Notendurchschnitt berechnen');
      expect(calc!.h1).toContain('Notendurchschnitt berechnen');

      const meta = await generateMetadata({ params: Promise.resolve({ slug: 'notendurchschnitt-rechner' }) });
      expect(meta.alternates?.canonical).toBe('https://rechenhafen.de/rechner/notendurchschnitt-rechner/');
    });

    it('calculates both simple arithmetic and weighted averages', () => {
      // Simple arithmetic
      const resSimple = calc!.calculate({
        calculationMode: 'simple',
        grades: '1,0; 2,0; 3,0',
      });
      expect(resSimple.primary.value).toBe(2.0);

      // Weighted (ECTS)
      // 1.0 (5 ECTS) + 2.0 (10 ECTS) = 5 + 20 = 25 / 15 = 1.6666...
      const resWeighted = calc!.calculate({
        calculationMode: 'weighted',
        weightedGrades: '1,0 * 5; 2,0 * 10',
      });
      expect(resWeighted.primary.value).toBeCloseTo(1.67, 2);
      expect(resWeighted.basisSummary).toBeDefined();
      expect(resWeighted.breakdown).toBeDefined();
    });
  });
});
