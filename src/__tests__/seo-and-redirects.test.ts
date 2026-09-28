import { describe, it, expect } from 'vitest';
import nextConfig from '../../next.config';
import { ALL_CALCULATORS, getCalculatorBySlug } from '@/data/calculators';
import { getAllArticles, getArticleBySlug } from '@/data/ratgeber/articles';
import sitemap from '@/app/sitemap';

describe('SEO & 301 Redirects Verification', () => {
  it('has configured permanent 301 redirect for old kalorienbedarfrechner URL in next.config.ts', async () => {
    expect(nextConfig.redirects).toBeDefined();
    if (!nextConfig.redirects) throw new Error('redirects not defined');
    const redirects = await nextConfig.redirects();

    const redirectWithTrailingSlash = redirects.find(
      (r) => r.source === '/rechner/kalorienbedarfrechner/'
    );
    const redirectWithoutTrailingSlash = redirects.find(
      (r) => r.source === '/rechner/kalorienbedarfrechner'
    );

    expect(redirectWithTrailingSlash).toBeDefined();
    expect(redirectWithTrailingSlash?.destination).toBe('/rechner/kalorienbedarf-rechner/');
    expect(redirectWithTrailingSlash?.statusCode === 301 || redirectWithTrailingSlash?.permanent === true).toBe(true);

    expect(redirectWithoutTrailingSlash).toBeDefined();
    expect(redirectWithoutTrailingSlash?.destination).toBe('/rechner/kalorienbedarf-rechner/');
    expect(redirectWithoutTrailingSlash?.statusCode === 301 || redirectWithoutTrailingSlash?.permanent === true).toBe(true);
  });

  it('destination /rechner/kalorienbedarf-rechner/ exists and has correct metadata and canonical', () => {
    const calc = getCalculatorBySlug('kalorienbedarf-rechner');
    expect(calc).toBeDefined();
    expect(calc?.slug).toBe('kalorienbedarf-rechner');
    expect(calc?.h1).toContain('Kalorienbedarf Rechner');
    expect(calc?.metaTitle).toContain('Kalorienbedarf Rechner');

    const expectedCanonical = `https://rechenhafen.de/rechner/${calc?.slug}/`;
    expect(expectedCanonical).toBe('https://rechenhafen.de/rechner/kalorienbedarf-rechner/');
  });

  it('sitemap does not contain the old redirect URL and contains canonical indexable URLs only', () => {
    const sitemapEntries = sitemap();
    const urls = sitemapEntries.map((e) => e.url);

    // Old slug must NOT be in sitemap
    for (const url of urls) {
      expect(url.includes('kalorienbedarfrechner')).toBe(false);
      // All URLs must be non-www
      expect(url.startsWith('https://rechenhafen.de/')).toBe(true);
      expect(url.includes('www.')).toBe(false);
      // Trailing slash consistency
      expect(url.endsWith('/')).toBe(true);
    }

    // Destination must be in sitemap
    expect(urls).toContain('https://rechenhafen.de/rechner/kalorienbedarf-rechner/');
    // New guide must be in sitemap
    expect(urls).toContain('https://rechenhafen.de/ratgeber/zahnspachtel-groessen-tabelle-fliesen/');
  });

  it('verifies Teilzeitrechner owns primary keywords and article links contextually', () => {
    const calc = getCalculatorBySlug('teilzeit-gehaltsrechner');
    expect(calc).toBeDefined();
    expect(calc?.metaTitle).toContain('Teilzeitrechner');
    expect(calc?.h1).toContain('Teilzeitrechner');
    expect(calc?.searchKeywords).toContain('teilzeitrechner');
    expect(calc?.searchKeywords).toContain('teilzeit rechner');

    const article = getArticleBySlug('teilzeit-gehalt-berechnen');
    expect(article).toBeDefined();
    expect(article?.primaryCalculator.slug).toBe('teilzeit-gehaltsrechner');
    expect(article?.primaryCalculator.title).toBe('Teilzeitrechner');

    // Contextual link in article prose
    const allProse = article?.sections.flatMap((s) => s.paragraphs || []).join(' ') || '';
    expect(allProse).toContain('/rechner/teilzeit-gehaltsrechner/');
    expect(allProse).toContain('Teilzeitrechner');
  });

  it('verifies Gasverbrauch Rechner updated title and H1', () => {
    const calc = getCalculatorBySlug('gasverbrauch-kwh-m3-rechner');
    expect(calc).toBeDefined();
    expect(calc?.metaTitle).toBe('Gasverbrauch berechnen: m³ in kWh & Gaskosten Rechner | RechenHafen');
    expect(calc?.h1).toBe('Gasverbrauch berechnen: m³ in kWh & Gaskosten Rechner');
    expect(calc?.formula).toContain('kWh');
    expect(calc?.workedExample.description).toBeDefined();
  });

  it('verifies Maximaler Kredit Rechner intent and caveats', () => {
    const calc = getCalculatorBySlug('maximaler-kredit-rechner');
    expect(calc).toBeDefined();
    expect(calc?.metaTitle).toBe('Wie viel Kredit bekomme ich? Maximaler Kredit Rechner | RechenHafen');
    expect(calc?.h1).toBe('Wie viel Kredit bekomme ich? – Maximaler Kredit Rechner');
    expect(calc?.content?.details).toContain('verbindliche Kreditzusage');
    expect(calc?.content?.details).toContain('Bonitätsentscheidung');
  });

  it('verifies Gewinnschwelle / Break-Even Rechner owns the queries without duplicate URL', () => {
    const calc = getCalculatorBySlug('break-even-rechner');
    expect(calc).toBeDefined();
    expect(calc?.slug).toBe('break-even-rechner');
    expect(calc?.metaTitle).toBe('Gewinnschwelle berechnen: Break-Even-Rechner & Formel | RechenHafen');
    expect(calc?.h1).toBe('Gewinnschwelle berechnen – Break-Even-Rechner');
    expect(calc?.content?.intro).toContain('Gewinnschwelle berechnen');

    // Duplicate slug must NOT exist
    const duplicateCalc = getCalculatorBySlug('gewinnschwelle-rechner');
    expect(duplicateCalc).toBeUndefined();

    // Related slugs only to business calculators
    expect(calc?.relatedSlugs).toEqual(['marge-rechner', 'skontorechner', 'rabattrechner', 'mwst-rechner']);
    for (const slug of calc?.relatedSlugs || []) {
      const relCalc = getCalculatorBySlug(slug);
      expect(relCalc).toBeDefined();
      expect(relCalc?.category).toBe('business');
    }
  });

  it('verifies Zahnspachtel Größen Tabelle guide content and reciprocal linking with Fliesenkleber Rechner', () => {
    const guide = getArticleBySlug('zahnspachtel-groessen-tabelle-fliesen');
    expect(guide).toBeDefined();
    expect(guide?.title).toBe('Zahnspachtel Größen Tabelle: Welche Zahnung für welche Fliese?');
    expect(guide?.h1).toBe('Zahnspachtel Größen Tabelle: Welche Zahnung für welche Fliese?');
    expect(guide?.metaTitle).toContain('Zahnspachtel Größen Tabelle');
    expect(guide?.category).toBe('bauen-renovieren');
    expect(guide?.primaryCalculator.slug).toBe('fliesenkleber-rechner');

    // Contextual link from guide to calculator
    const allGuideProse = guide?.sections.flatMap((s) => s.paragraphs || []).join(' ') || '';
    expect(allGuideProse).toContain('/rechner/fliesenkleber-rechner/');

    // Reciprocal link from Fliesenkleber calculator to guide
    const fliesenCalc = getCalculatorBySlug('fliesenkleber-rechner');
    expect(fliesenCalc).toBeDefined();
    expect(fliesenCalc?.content?.intro).toContain('/ratgeber/zahnspachtel-groessen-tabelle-fliesen/');
    const faqAnswers = fliesenCalc?.faqs.map((f) => f.answer).join(' ') || '';
    expect(faqAnswers).toContain('/ratgeber/zahnspachtel-groessen-tabelle-fliesen/');
  });
});
