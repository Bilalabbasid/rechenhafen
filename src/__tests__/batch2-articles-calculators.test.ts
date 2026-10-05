import { describe, it, expect } from 'vitest';
import { getArticleBySlug } from '@/data/ratgeber/articles';
import { getCalculatorBySlug } from '@/data/calculators';
import { generateMetadata as generateRatgeberMetadata } from '@/app/ratgeber/[slug]/page';
import sitemap from '@/app/sitemap';
import fs from 'fs';
import path from 'path';

describe('Batch 2: Ratgeber Articles & Calculator Corrections QA', () => {
  describe('Article 1: 1 Cup Milch in Gramm (/ratgeber/1-cup-milch-in-gramm/)', () => {
    const slug = '1-cup-milch-in-gramm';
    const article = getArticleBySlug(slug);

    it('exists with correct slug, category, and timestamps', () => {
      expect(article).toBeDefined();
      expect(article!.slug).toBe(slug);
      expect(article!.category).toBe('kochen-backen');
      expect(article!.publishedAt).toBe('2026-10-03');
      expect(article!.updatedAt).toBe('2026-10-03');
    });

    it('matches exact SEO requirements (title, h1, metaDescription)', async () => {
      expect(article!.title).toBe('1 Cup Milch in Gramm: Umrechnung und Tabelle');
      expect(article!.metaTitle).toBe('1 Cup Milch in Gramm: Umrechnung und Tabelle');
      expect(article!.h1).toBe('Wie viel Gramm sind 1 Cup Milch?');
      expect(article!.metaDescription).toBe(
        '1 Cup Milch in Gramm umrechnen: Unterschiede zwischen US-Cup und 250-ml-Cup, Tabelle für typische Mengen und Tipps für amerikanische Rezepte.'
      );

      const metadata = await generateRatgeberMetadata({ params: Promise.resolve({ slug }) });
      expect(metadata.alternates?.canonical).toBe(`https://rechenhafen.de/ratgeber/${slug}/`);
      expect(metadata.openGraph?.url).toBe(`https://rechenhafen.de/ratgeber/${slug}/`);
    });

    it('has verified primary calculator and secondary tools', () => {
      expect(article!.primaryCalculator.slug).toBe('cups-in-gramm-rechner');
      const calc = getCalculatorBySlug('cups-in-gramm-rechner');
      expect(calc).toBeDefined();

      expect(article!.secondaryCalculators).toBeDefined();
      expect(article!.secondaryCalculators!.some((c) => c.slug === 'gramm-in-ml-rechner')).toBe(true);
      const secCalc = getCalculatorBySlug('gramm-in-ml-rechner');
      expect(secCalc).toBeDefined();
    });

    it('has original SVGs that exist on disk with accessible markup', () => {
      expect(article!.coverIllustration).toBeDefined();
      const coverPath = path.join(process.cwd(), 'public', article!.coverIllustration!.src);
      expect(fs.existsSync(coverPath)).toBe(true);
      const coverContent = fs.readFileSync(coverPath, 'utf-8');
      expect(coverContent).toContain('<svg');
      expect(coverContent).toContain('236,6 ml');
      expect(coverContent).toContain('240');
      expect(coverContent).toContain('250');
      expect(coverContent).toContain('Schematisch');

      const sectionWithDiagram = article!.sections.find((s) => s.illustration);
      expect(sectionWithDiagram).toBeDefined();
      const diagPath = path.join(process.cwd(), 'public', sectionWithDiagram!.illustration!.src);
      expect(fs.existsSync(diagPath)).toBe(true);
      const diagContent = fs.readFileSync(diagPath, 'utf-8');
      expect(diagContent).toContain('354,9 ml');
      expect(diagContent).toContain('366 Gramm');
      expect(diagContent).toContain('1,03 g/ml');
    });

    it('has complete worked example matching the substantive numbers', () => {
      expect(article!.workedExample.formula).toContain('236,588');
      expect(article!.workedExample.steps.length).toBeGreaterThanOrEqual(3);
      expect(article!.workedExample.resultSummary).toContain('366 Gramm');
      expect(article!.workedExample.resultSummary).toContain('355 ml');
    });

    it('includes verified official sources', () => {
      expect(article!.officialSources.some((s) => s.url?.includes('nist.gov'))).toBe(true);
      expect(article!.officialSources.some((s) => s.url?.includes('tetrapak.com'))).toBe(true);
    });
  });

  describe('Article 2: Schalungssteine Betonbedarf (/ratgeber/schalungssteine-betonbedarf-berechnen/)', () => {
    const slug = 'schalungssteine-betonbedarf-berechnen';
    const article = getArticleBySlug(slug);

    it('exists with correct slug, category, and timestamps', () => {
      expect(article).toBeDefined();
      expect(article!.slug).toBe(slug);
      expect(article!.category).toBe('bauen-renovieren');
      expect(article!.publishedAt).toBe('2026-10-03');
      expect(article!.updatedAt).toBe('2026-10-03');
    });

    it('matches exact SEO requirements (title, h1, metaDescription)', async () => {
      expect(article!.title).toBe('Schalungssteine: Betonbedarf berechnen mit Beispiel');
      expect(article!.metaTitle).toBe('Schalungssteine: Betonbedarf berechnen mit Beispiel');
      expect(article!.h1).toBe('Wie viel Beton brauche ich für Schalungssteine?');
      expect(article!.metaDescription).toBe(
        'Betonbedarf für Schalungssteine berechnen: Herstellerwerte in Liter pro m² oder Stein, Beispiel für eine 12-m²-Mauer und getrennte Materialreserven.'
      );

      const metadata = await generateRatgeberMetadata({ params: Promise.resolve({ slug }) });
      expect(metadata.alternates?.canonical).toBe(`https://rechenhafen.de/ratgeber/${slug}/`);
      expect(metadata.openGraph?.url).toBe(`https://rechenhafen.de/ratgeber/${slug}/`);
    });

    it('has verified primary calculator and secondary tools', () => {
      expect(article!.primaryCalculator.slug).toBe('schalungssteine-rechner');
      const calc = getCalculatorBySlug('schalungssteine-rechner');
      expect(calc).toBeDefined();

      expect(article!.secondaryCalculators).toBeDefined();
      expect(article!.secondaryCalculators!.some((c) => c.slug === 'betonrechner')).toBe(true);
      const secCalc = getCalculatorBySlug('betonrechner');
      expect(secCalc).toBeDefined();
    });

    it('has original SVGs that exist on disk with accessible markup', () => {
      expect(article!.coverIllustration).toBeDefined();
      const coverPath = path.join(process.cwd(), 'public', article!.coverIllustration!.src);
      expect(fs.existsSync(coverPath)).toBe(true);
      const coverContent = fs.readFileSync(coverPath, 'utf-8');
      expect(coverContent).toContain('<svg');
      expect(coverContent).toContain('8,00 m');
      expect(coverContent).toContain('1,50 m');
      expect(coverContent).toContain('12,0 m²');
      expect(coverContent).toContain('50 × 25 cm');

      const sectionWithDiagram = article!.sections.find((s) => s.illustration);
      expect(sectionWithDiagram).toBeDefined();
      const diagPath = path.join(process.cwd(), 'public', sectionWithDiagram!.illustration!.src);
      expect(fs.existsSync(diagPath)).toBe(true);
      const diagContent = fs.readFileSync(diagPath, 'utf-8');
      expect(diagContent).toContain('1.560 l');
      expect(diagContent).toContain('1,56 m³');
      expect(diagContent).toContain('1,638 m³');
    });

    it('has complete worked example matching the substantive numbers', () => {
      expect(article!.workedExample.formula).toContain('Füllmenge');
      expect(article!.workedExample.steps.length).toBeGreaterThanOrEqual(4);
      expect(article!.workedExample.resultSummary).toContain('101');
      expect(article!.workedExample.resultSummary).toContain('1,56 m³');
      expect(article!.workedExample.resultSummary).toContain('1,64 m³');
    });

    it('includes verified official sources citing Delfing, Beyhl, and Jasto', () => {
      expect(article!.officialSources.some((s) => s.url?.includes('delfing.de'))).toBe(true);
      expect(article!.officialSources.some((s) => s.url?.includes('beyhl.de'))).toBe(true);
      expect(article!.officialSources.some((s) => s.url?.includes('jasto.de'))).toBe(true);
    });
  });

  describe('Calculator Corrections: Cups-in-Gramm-Rechner', () => {
    const calc = getCalculatorBySlug('cups-in-gramm-rechner')!;

    it('links back to the new guide in content.intro', () => {
      expect(calc.content?.intro).toContain('/ratgeber/1-cup-milch-in-gramm/');
    });

    it('validates blank and negative quantities while preserving valid zero', () => {
      const blankRes = calc.calculate({ cupsAmount: '' });
      expect(blankRes.error).toBeDefined();

      const negRes = calc.calculate({ cupsAmount: -1 });
      expect(negRes.error).toBeDefined();

      const zeroRes = calc.calculate({ cupsAmount: 0 });
      expect(zeroRes.error).toBeUndefined();
      expect(zeroRes.primary.value).toBe(0);
      expect(zeroRes.primary.formattedValue).toBe('0 g');
    });

    it('separates ingredients and calculates milk with 1.03 g/ml density model', () => {
      // 1 US customary cup milk (236.588 ml * 1.03 ≈ 243.69 g -> formatted 243,7 g)
      const res1 = calc.calculate({ cupsAmount: 1, ingredient: 'milk', cupType: 'usCustomary' });
      expect(res1.primary.value).toBeCloseTo(243.69, 1);
      expect(res1.secondary?.find((s) => s.id === 'perCup')?.formattedValue).toContain('243,7');

      // 1.5 US customary cups milk -> ~365.5 g (354.9 ml)
      const res15 = calc.calculate({ cupsAmount: 1.5, ingredient: 'milk', cupType: 'usCustomary' });
      expect(res15.primary.value).toBeCloseTo(365.53, 1);
      expect(res15.secondary?.find((s) => s.id === 'volumeMl')?.formattedValue).toContain('354,9 ml');

      // 1 Metric cup milk (250 ml * 1.03 = 257.5 g)
      const resMetric = calc.calculate({ cupsAmount: 1, ingredient: 'milk', cupType: 'metric' });
      expect(resMetric.primary.value).toBeCloseTo(257.5, 1);

      // Water (density 1.0) and oil (density 0.92) are distinct
      const resWater = calc.calculate({ cupsAmount: 1, ingredient: 'water', cupType: 'usCustomary' });
      const resOil = calc.calculate({ cupsAmount: 1, ingredient: 'oil', cupType: 'usCustomary' });
      expect(resWater.primary.value).toBeCloseTo(236.59, 1);
      expect(resOil.primary.value).toBeCloseTo(217.66, 1);
      expect(resWater.primary.value).not.toEqual(resOil.primary.value);
    });

    it('labels g/Cup as Gewicht je Cup and volume as Volumen', () => {
      const res = calc.calculate({ cupsAmount: 1, ingredient: 'flour' });
      const perCupItem = res.secondary?.find((s) => s.id === 'perCup');
      expect(perCupItem?.label).toBe('Gewicht je Cup');
      const volItem = res.secondary?.find((s) => s.id === 'volumeMl');
      expect(volItem?.label).toBe('Volumen (ml)');
    });
  });

  describe('Calculator Corrections: Schalungssteine-Rechner', () => {
    const calc = getCalculatorBySlug('schalungssteine-rechner')!;

    it('links back to the new guide in content.intro', () => {
      expect(calc.content?.intro).toContain('/ratgeber/schalungssteine-betonbedarf-berechnen/');
    });

    it('executes the exact independent acceptance fixture', () => {
      // 8 m × 1.5 m, no openings, 8 stones/m², 130 l/m², stone reserve 5%, concrete reserve 0%:
      // 96 base stones, 101 stones including reserve, 1.56 m³ fill concrete.
      const res0 = calc.calculate({
        wallLength: 8,
        wallHeight: 1.5,
        openingsArea: 0,
        fillMode: 'preset_delfing24',
        stoneReserve: 5,
        concreteReserve: 0,
      });

      expect(res0.primary.value).toBe(101);
      const baseStones = res0.secondary?.find((s) => s.id === 'baseStones');
      expect(baseStones?.value).toBe(96);
      const concreteSec0 = res0.secondary?.find((s) => s.id === 'concreteM3');
      expect(concreteSec0?.value).toBe(1.56);
      expect(concreteSec0?.formattedValue).toBe('1,56 m³');

      // With concrete reserve 5%: 1.638 m³ concrete before display rounding
      const res5 = calc.calculate({
        wallLength: 8,
        wallHeight: 1.5,
        openingsArea: 0,
        fillMode: 'preset_delfing24',
        stoneReserve: 5,
        concreteReserve: 5,
      });
      const concreteSec5 = res5.secondary?.find((s) => s.id === 'concreteM3');
      expect(concreteSec5?.value).toBeCloseTo(1.638, 3);
      expect(concreteSec5?.formattedValue).toBe('1,64 m³');
    });

    it('rejects openings larger than gross wall area', () => {
      const res = calc.calculate({
        wallLength: 8,
        wallHeight: 1.5,
        openingsArea: 13,
      });
      expect(res.error).toBeDefined();
      expect(res.error).toContain('darf nicht größer als die Brutto-Wandfläche');
    });

    it('ensures zero net area produces no positive wall-material quantities', () => {
      const res = calc.calculate({
        wallLength: 8,
        wallHeight: 1.5,
        openingsArea: 12,
      });
      expect(res.error).toBeUndefined();
      expect(res.primary.value).toBe(0);
      expect(res.primary.formattedValue).toBe('0 Stück');
      const concreteSec = res.secondary?.find((s) => s.id === 'concreteM3');
      expect(concreteSec?.value).toBe(0);
      expect(concreteSec?.formattedValue).toBe('0,00 m³');
    });

    it('validates blank and negative input fields', () => {
      expect(calc.calculate({ wallLength: '' }).error).toBeDefined();
      expect(calc.calculate({ wallHeight: '' }).error).toBeDefined();
      expect(calc.calculate({ wallLength: -5 }).error).toBeDefined();
      expect(calc.calculate({ wallHeight: -2 }).error).toBeDefined();
      expect(calc.calculate({ wallLength: 8, wallHeight: 1.5, openingsArea: -1 }).error).toBeDefined();
      expect(calc.calculate({ wallLength: 8, wallHeight: 1.5, stoneReserve: -2 }).error).toBeDefined();
      expect(calc.calculate({ wallLength: 8, wallHeight: 1.5, concreteReserve: -3 }).error).toBeDefined();
    });

    it('supports custom manufacturer fill quantities in l/m² and l/stone', () => {
      // Custom 140 l/m² on 10 m² wall -> 1.4 m³
      const resM2 = calc.calculate({
        wallLength: 5,
        wallHeight: 2,
        openingsArea: 0,
        fillMode: 'customM2',
        customFillValue: 140,
        stoneReserve: 0,
        concreteReserve: 0,
      });
      const concreteM2 = resM2.secondary?.find((s) => s.id === 'concreteM3');
      expect(concreteM2?.value).toBeCloseTo(1.4, 2);

      // Custom 20 l/Stein (8 stones/m² -> 160 l/m²) on 10 m² wall -> 1.6 m³
      const resStone = calc.calculate({
        wallLength: 5,
        wallHeight: 2,
        openingsArea: 0,
        fillMode: 'customStone',
        customFillValue: 20,
        stoneReserve: 0,
        concreteReserve: 0,
      });
      const concreteStone = resStone.secondary?.find((s) => s.id === 'concreteM3');
      expect(concreteStone?.value).toBe(1.6);
    });
  });

  describe('Sitemap & Navigation QA', () => {
    it('includes both new article URLs in sitemap with real modification dates', () => {
      const sitemapEntries = sitemap();
      const urls = new Map(sitemapEntries.map((e) => [e.url, e.lastModified]));

      expect(urls.has('https://rechenhafen.de/ratgeber/1-cup-milch-in-gramm/')).toBe(true);
      expect(urls.has('https://rechenhafen.de/ratgeber/schalungssteine-betonbedarf-berechnen/')).toBe(true);

      const d1 = urls.get('https://rechenhafen.de/ratgeber/1-cup-milch-in-gramm/');
      const d2 = urls.get('https://rechenhafen.de/ratgeber/schalungssteine-betonbedarf-berechnen/');
      expect(new Date(d1!).toISOString()).toContain('2026-10-03');
      expect(new Date(d2!).toISOString()).toContain('2026-10-03');
    });
  });
});
