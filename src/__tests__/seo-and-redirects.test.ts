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
    expect(calc?.metaTitle).toBe('Gasverbrauch berechnen: m³ in kWh & Gaskosten Rechner');
    expect(calc?.h1).toBe('Gasverbrauch berechnen: m³ in kWh & Gaskosten Rechner');
    expect(calc?.formula).toContain('kWh');
    expect(calc?.workedExample.description).toBeDefined();
  });

  it('verifies Maximaler Kredit Rechner intent and caveats', () => {
    const calc = getCalculatorBySlug('maximaler-kredit-rechner');
    expect(calc).toBeDefined();
    expect(calc?.metaTitle).toBe('Wie viel Kredit bekomme ich? Maximaler Kredit Rechner');
    expect(calc?.h1).toBe('Wie viel Kredit bekomme ich? – Maximaler Kredit Rechner');
    expect(calc?.content?.details).toContain('verbindliche Kreditzusage');
    expect(calc?.content?.details).toContain('Bonitätsentscheidung');
  });

  it('verifies Gewinnschwelle / Break-Even Rechner owns the queries without duplicate URL', () => {
    const calc = getCalculatorBySlug('break-even-rechner');
    expect(calc).toBeDefined();
    expect(calc?.slug).toBe('break-even-rechner');
    expect(calc?.metaTitle).toBe('Gewinnschwelle berechnen: Break-Even-Rechner & Formel');
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

  it('verifies top prioritized calculators (KFZ-Steuer, Bürgergeld, Spritkosten, Kreisumfang, etc.) have rich SEO metadata, workedExample descriptions, and visible FAQs', () => {
    // 1. KFZ-Steuer
    const kfz = getCalculatorBySlug('kfz-steuer-rechner');
    expect(kfz?.metaTitle).toBe('KFZ-Steuer-Rechner 2026: Autosteuer nach Hubraum & CO2 berechnen');
    expect(kfz?.h1).toBe('KFZ-Steuer-Rechner 2026 – Autosteuer für Benziner, Diesel & Elektro berechnen');
    expect(kfz?.workedExample.description).toBeDefined();
    expect(kfz?.faqs.length).toBeGreaterThanOrEqual(4);
    expect(kfz?.trustMeta?.legalBasis).toContain('Kraftfahrzeugsteuergesetz');

    // 2. Bürgergeld
    const bg = getCalculatorBySlug('buergergeld-anspruch-rechner');
    expect(bg?.metaTitle).toBe('Bürgergeld Rechner 2026: Anspruch, Regelsatz & Wohnkosten berechnen');
    expect(bg?.h1).toBe('Bürgergeld-Rechner 2026 – Gesetzlichen Anspruch nach SGB II ermitteln');
    expect(bg?.workedExample.description).toBeDefined();
    expect(bg?.faqs.length).toBeGreaterThanOrEqual(4);
    expect(bg?.trustMeta?.legalBasis).toContain('SGB II');

    // 3. Spritkosten
    const sprit = getCalculatorBySlug('spritkostenrechner');
    expect(sprit?.metaTitle).toBe('Spritkostenrechner: Fahrtkosten, Spritverbrauch & Kosten pro km berechnen');
    expect(sprit?.h1).toBe('Spritkostenrechner – Benzin- & Dieselkosten pro Fahrt, km & Mitfahrer berechnen');
    expect(sprit?.workedExample.description).toBeDefined();
    expect(sprit?.faqs.length).toBeGreaterThanOrEqual(4);

    // 4. Kreisumfang
    const kreis = getCalculatorBySlug('kreis-umfang-rechner');
    expect(kreis?.metaTitle).toBe('Kreisumfang berechnen: Rechner & Formel (U = 2·π·r = π·d)');
    expect(kreis?.h1).toBe('Kreisumfang Rechner – Exakten Umfang aus Radius oder Durchmesser berechnen');
    expect(kreis?.workedExample.description).toBeDefined();
    expect(kreis?.faqs.length).toBeGreaterThanOrEqual(4);

    // 5. Renten-Brutto-Netto
    const rente = getCalculatorBySlug('renten-brutto-netto-rechner');
    expect(rente?.metaTitle).toBe('Renten-Brutto-Netto-Rechner 2026: Wie viel Netto-Rente bleibt übrig?');
    expect(rente?.h1).toBe('Renten-Brutto-Netto-Rechner 2026 – Gesetzliche Altersrente nach Abzügen berechnen');
    expect(rente?.workedExample.description).toBeDefined();
    expect(rente?.faqs.length).toBeGreaterThanOrEqual(4);

    // 6. Autokredit
    const auto = getCalculatorBySlug('autokreditrechner');
    expect(auto?.metaTitle).toBe('Autokreditrechner: Kfz-Monatsrate & Autofinanzierung berechnen');
    expect(auto?.h1).toBe('Autokreditrechner – Monatliche Rate für Ihren Autokauf berechnen');
    expect(auto?.content?.details).toContain('Ballonfinanzierung');
    expect(auto?.workedExample.description).toBeDefined();
    expect(auto?.faqs.length).toBeGreaterThanOrEqual(4);

    // 7. Geschwindigkeit
    const speed = getCalculatorBySlug('geschwindigkeit-umrechner');
    expect(speed?.metaTitle).toBe('Geschwindigkeit Umrechner: km/h in m/s, mph & Knoten umrechnen');
    expect(speed?.h1).toBe('Geschwindigkeit Umrechner – km/h, m/s, mph & Knoten präzise umrechnen');
    expect(speed?.workedExample.description).toBeDefined();
    expect(speed?.faqs.length).toBeGreaterThanOrEqual(4);

    // 8. Schalungssteine
    const stein = getCalculatorBySlug('schalungssteine-rechner');
    expect(stein?.metaTitle).toBe('Schalungssteine Rechner: Menge für Ihre Mauer berechnen');
    expect(stein?.h1).toBe('Schalungssteine berechnen: Menge für Ihre Mauer');
    expect(stein?.workedExample.description).toBeDefined();
    expect(stein?.faqs.length).toBeGreaterThanOrEqual(4);
  });
});
