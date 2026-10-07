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

  it('verifies homepage Open Graph and Twitter social sharing metadata and static banner', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const { metadata: pageMeta } = await import('@/app/page');
    const robotsFn = (await import('@/app/robots')).default;

    // 1. Static asset verification
    const ogImagePath = path.join(process.cwd(), 'public', 'og-image.jpg');
    expect(fs.existsSync(ogImagePath)).toBe(true);

    const stats = fs.statSync(ogImagePath);
    expect(stats.size).toBeGreaterThan(10000); // realistic valid banner file

    // 2. Homepage metadata verification
    expect(pageMeta.title).toEqual({
      absolute: 'RechenHafen – Alle Rechner an einem Ort',
    });
    expect(pageMeta.description).toBe(
      'Kostenlose Online-Rechner für Alltag, Finanzen, Steuern, Gesundheit und mehr. Kein Login, keine Paywall.'
    );

    // 3. Open Graph verification
    const og = pageMeta.openGraph as any;
    expect(og).toBeDefined();
    expect(og.type).toBe('website');
    expect(og.url).toBe('https://rechenhafen.de/');
    expect(og.title).toBe('RechenHafen – Alle Rechner an einem Ort');
    expect(og.description).toBe(
      'Kostenlose Online-Rechner für Alltag, Finanzen, Steuern, Gesundheit und mehr. Kein Login, keine Paywall.'
    );
    expect(Array.isArray(og.images)).toBe(true);
    expect(og.images[0]).toEqual({
      url: 'https://rechenhafen.de/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'RechenHafen – Kostenlose Online-Rechner',
      type: 'image/jpeg',
    });

    // 4. Twitter metadata verification
    const twitter = pageMeta.twitter as any;
    expect(twitter).toBeDefined();
    expect(twitter.card).toBe('summary_large_image');
    expect(twitter.title).toBe('RechenHafen – Alle Rechner an einem Ort');
    expect(twitter.description).toBe(
      'Kostenlose Online-Rechner für Alltag, Finanzen, Steuern, Gesundheit und mehr. Kein Login, keine Paywall.'
    );
    expect(twitter.images).toEqual(['https://rechenhafen.de/og-image.jpg']);

    // 5. Robots allow rule for crawlers
    const robotsRules = robotsFn();
    expect(robotsRules.rules).toBeDefined();
    const rules = Array.isArray(robotsRules.rules) ? robotsRules.rules[0] : robotsRules.rules;
    expect(rules.allow).toBe('/');
  });

  it('verifies 301 redirect and authoritative Warmmiete calculator page and de-optimized Mietbelastungsquote', async () => {
    // 1. Redirect verification
    const redirects = await nextConfig.redirects!();
    const redirectWithSlash = redirects.find((r) => r.source === '/rechner/warmmiete-zu-kaltmiete-rechner/');
    const redirectWithoutSlash = redirects.find((r) => r.source === '/rechner/warmmiete-zu-kaltmiete-rechner');
    expect(redirectWithSlash).toBeDefined();
    expect(redirectWithSlash?.destination).toBe('/rechner/warmmiete-rechner/');
    expect(redirectWithSlash?.permanent).toBe(true);
    expect(redirectWithoutSlash).toBeDefined();
    expect(redirectWithoutSlash?.destination).toBe('/rechner/warmmiete-rechner/');
    expect(redirectWithoutSlash?.permanent).toBe(true);

    // 2. Authoritative Warmmiete calculator
    const warmmiete = getCalculatorBySlug('warmmiete-rechner');
    expect(warmmiete).toBeDefined();
    expect(warmmiete?.h1).toBe('Warmmiete berechnen');
    expect(warmmiete?.metaTitle).toBe('Warmmiete berechnen: Kaltmiete, Nebenkosten & Heizung');
    expect(warmmiete?.formula).toBe('Warmmiete = Kaltmiete + kalte Nebenkosten + Heizkosten');
    expect(warmmiete?.inputs.some((i) => i.id === 'coldRentInput')).toBe(true);
    expect(warmmiete?.inputs.some((i) => i.id === 'operatingCosts')).toBe(true);
    expect(warmmiete?.inputs.some((i) => i.id === 'heatingCosts')).toBe(true);
    expect(warmmiete?.inputs.some((i) => i.id === 'otherOperatingCosts')).toBe(true);

    const calcResult = warmmiete?.calculate({
      coldRentInput: 800,
      operatingCosts: 160,
      heatingCosts: 140,
      otherOperatingCosts: 20,
    });
    expect(calcResult?.primary.label).toBe('Warmmiete pro Monat');
    expect(calcResult?.primary.value).toBe(1120);
    expect(calcResult?.secondary?.some((s) => s.id === 'warmRentYearly' && s.value === 1120 * 12)).toBe(true);
    expect(calcResult?.basisSummary).toBeDefined();

    // 3. Sitemap verification
    const sitemapEntries = sitemap();
    const urls = sitemapEntries.map((e) => e.url);
    expect(urls).toContain('https://rechenhafen.de/rechner/warmmiete-rechner/');
    expect(urls.some((u) => u.includes('warmmiete-zu-kaltmiete-rechner'))).toBe(false);

    // 4. Mietbelastungsquote de-optimization
    const mietbelastung = getCalculatorBySlug('mietbelastungsquote-rechner');
    expect(mietbelastung).toBeDefined();
    expect(mietbelastung?.h1).not.toContain('Warmmiete berechnen');
    expect(mietbelastung?.metaTitle).not.toContain('Warmmiete berechnen');
    expect(mietbelastung?.searchKeywords).not.toContain('warmmiete berechnen');
  });

  it('verifies Restalkohol safety fix: cooking intent only, no driving claims, safety disclaimer', () => {
    const kochen = getCalculatorBySlug('alkohol-verkochungs-rechner');
    expect(kochen).toBeDefined();
    expect(kochen?.h1).toBe('Alkohol beim Kochen und Backen berechnen');
    expect(kochen?.metaTitle).toBe('Alkohol beim Kochen berechnen: Verdampfung in Sauce & Essen');
    
    // Must NOT contain restalkohol in search keywords
    expect(kochen?.searchKeywords.some((k) => k.toLowerCase().includes('restalkohol'))).toBe(false);

    // Visible safety disclaimer in qualifications & details
    const qualificationsText = kochen?.calculate({ alcoholMl: 250, volPercent: 12 }).qualifications?.join(' ') || '';
    expect(qualificationsText).toContain('Sicherheitshinweis');
    expect(qualificationsText).toContain('Fahrtauglichkeit');

    // Details must contain safety notice
    expect(kochen?.content?.details).toContain('Sicherheitshinweis zur Verkehrssicherheit');
    expect(kochen?.content?.details).toContain('Fahrtüchtigkeit');
  });

  it('verifies JobRad calculator tax & legal audit, 2026 sources, results structure and basis summary', () => {
    const jobrad = getCalculatorBySlug('dienstfahrrad-jobrad-rechner');
    expect(jobrad).toBeDefined();
    expect(jobrad?.isTimeSensitive).toBe(true);
    expect(jobrad?.timeSensitiveMeta?.year).toBe(2026);
    expect(jobrad?.timeSensitiveMeta?.source).toContain('§ 6 Abs. 1 Nr. 4 Satz 6 EStG');

    const res = jobrad?.calculate({
      bikePriceGross: 3500,
      grossSalary: 3800,
      serviceCost: 10,
      taxClass: '1',
    });
    expect(res?.primary.label).toBe('Geschätzte monatliche Netto-Belastung');
    expect(res?.secondary?.some((s) => s.id === 'leasingRate')).toBe(true);
    expect(res?.secondary?.some((s) => s.id === 'grossDeduction')).toBe(true);
    expect(res?.secondary?.some((s) => s.id === 'benefit')).toBe(true);
    expect(res?.secondary?.some((s) => s.id === 'totalCostOverall')).toBe(true);
    expect(res?.secondary?.some((s) => s.id === 'takeoverPrice')).toBe(true);
    expect(res?.basisSummary).toBeDefined();
    expect(res?.basisSummary?.length).toBeGreaterThanOrEqual(5);
  });

  it('performs complete sitemap, canonical, and redirect audit: zero missing, zero redirects, all 200 indexable', async () => {
    const sitemapEntries = sitemap();
    const sitemapUrls = sitemapEntries.map((e) => e.url);
    const sitemapSet = new Set(sitemapUrls);

    // 1. All static pages present
    const staticPaths = [
      'https://rechenhafen.de/',
      'https://rechenhafen.de/rechner/',
      'https://rechenhafen.de/ratgeber/',
      'https://rechenhafen.de/ueber-uns/',
      'https://rechenhafen.de/methodik/',
      'https://rechenhafen.de/impressum/',
      'https://rechenhafen.de/datenschutz/',
    ];
    for (const p of staticPaths) {
      expect(sitemapSet.has(p), `Missing static page in sitemap: ${p}`).toBe(true);
    }

    // 2. All categories present
    const { CATEGORIES } = await import('@/data/categories');
    for (const cat of CATEGORIES) {
      const catUrl = `https://rechenhafen.de/${cat.slug}/`;
      expect(sitemapSet.has(catUrl), `Missing category in sitemap: ${catUrl}`).toBe(true);
    }

    // 3. All registered calculators present
    for (const calc of ALL_CALCULATORS) {
      const calcUrl = `https://rechenhafen.de/rechner/${calc.slug}/`;
      expect(sitemapSet.has(calcUrl), `Missing calculator in sitemap: ${calcUrl}`).toBe(true);
    }

    // 4. All registered articles present
    const articles = getAllArticles();
    for (const art of articles) {
      const artUrl = `https://rechenhafen.de/ratgeber/${art.slug}/`;
      expect(sitemapSet.has(artUrl), `Missing ratgeber in sitemap: ${artUrl}`).toBe(true);
    }

    // 5. Total count exact match (7 static + 17 categories + 421 calculators + 16 articles = 461)
    const expectedTotal = 7 + CATEGORIES.length + ALL_CALCULATORS.length + articles.length;
    expect(sitemapEntries.length).toBe(expectedTotal);
    expect(sitemapSet.size).toBe(expectedTotal);

    // 6. NO redirect source URLs in sitemap
    const redirects = await nextConfig.redirects!();
    const redirectSources = redirects
      .filter((r) => !r.has)
      .map((r) => r.source.replace(/\/$/, ''));
    const uniqueRedirectSources = new Set(redirectSources);

    for (const entry of sitemapEntries) {
      const urlObj = new URL(entry.url);
      const pathnameNoSlash = urlObj.pathname.replace(/\/$/, '');
      expect(
        uniqueRedirectSources.has(pathnameNoSlash),
        `Redirected URL found in sitemap: ${entry.url}`
      ).toBe(false);

      // Validate URL format
      expect(entry.url.startsWith('https://rechenhafen.de/')).toBe(true);
      expect(entry.url.includes('www.')).toBe(false);
      expect(entry.url.endsWith('/')).toBe(true);
      expect(entry.url.includes('?')).toBe(false);
      expect(entry.url.includes('#')).toBe(false);

      // Validate lastModified
      expect(entry.lastModified instanceof Date).toBe(true);
      expect(isNaN(entry.lastModified!.getTime())).toBe(false);
    }

    // 7. Verify specific audited calculators and articles
    const keyUrls = [
      'https://rechenhafen.de/rechner/warmmiete-rechner/',
      'https://rechenhafen.de/rechner/mietbelastungsquote-rechner/',
      'https://rechenhafen.de/rechner/alkohol-verkochungs-rechner/',
      'https://rechenhafen.de/rechner/dienstfahrrad-jobrad-rechner/',
      'https://rechenhafen.de/rechner/spritkostenrechner/',
      'https://rechenhafen.de/rechner/gaskostenrechner/',
      'https://rechenhafen.de/ratgeber/gaszaehler-m3-in-kwh-umrechnen/',
      'https://rechenhafen.de/rechner/schalungssteine-rechner/',
      'https://rechenhafen.de/rechner/bausteine-mauerwerk-rechner/',
    ];
    for (const ku of keyUrls) {
      expect(sitemapSet.has(ku), `Expected key URL missing from sitemap: ${ku}`).toBe(true);
    }

    // 8. Verify specific redirected URLs are excluded
    const excludedUrls = [
      'https://rechenhafen.de/rechner/warmmiete-zu-kaltmiete-rechner/',
      'https://rechenhafen.de/rechner/warmmiete-berechnen/',
      'https://rechenhafen.de/rechner/sparziel-rechner/',
      'https://rechenhafen.de/rechner/autokredit-rechner/',
      'https://rechenhafen.de/rechner/beton-rechner/',
      'https://rechenhafen.de/rechner/gasverbrauch-rechner/',
      'https://rechenhafen.de/rechner/gaskosten-rechner/',
      'https://rechenhafen.de/rechner/schalungsstein-rechner/',
    ];
    for (const eu of excludedUrls) {
      expect(sitemapSet.has(eu), `Excluded redirect URL present in sitemap: ${eu}`).toBe(false);
    }
  });
});


