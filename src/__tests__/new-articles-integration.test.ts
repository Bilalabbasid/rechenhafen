import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getArticleBySlug } from '@/data/ratgeber/articles';
import { getCalculatorBySlug } from '@/data/calculators';
import sitemap from '@/app/sitemap';

describe('3 New German Ratgeber Articles Integration & SEO Tests', () => {
  const newSlugs = [
    'e-auto-kosten-100-km',
    'laminat-bedarf-gewicht-verschnitt',
    'gasverbrauch-m3-kwh-kosten',
  ] as const;

  it('all 3 new articles exist and have complete metadata', () => {
    for (const slug of newSlugs) {
      const article = getArticleBySlug(slug);
      expect(article, `Article ${slug} should exist`).toBeDefined();
      expect(article?.slug).toBe(slug);
      expect(article?.title.length).toBeGreaterThan(15);
      expect(article?.metaTitle.length).toBeGreaterThan(15);
      expect(article?.metaDescription.length).toBeGreaterThan(50);
      expect(article?.h1.length).toBeGreaterThan(15);
      expect(article?.category).toMatch(/^(auto-verkehr|bauen-renovieren|haushalt-energie)$/);
      expect(article?.keyTakeaways.length).toBeGreaterThanOrEqual(4);
      expect(article?.sections.length).toBeGreaterThanOrEqual(5);
      expect(article?.faqs.length).toBeGreaterThanOrEqual(5);
      expect(article?.workedExample.steps.length).toBeGreaterThanOrEqual(3);
      expect(article?.officialSources.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('verifies all 6 image assets exist on disk in public directory', () => {
    const publicDir = path.resolve(process.cwd(), 'public');

    const expectedImages = [
      'images/ratgeber/e-auto-kosten-100-km-wallbox.webp',
      'images/ratgeber/e-auto-kosten-100-km-infografik.svg',
      'images/ratgeber/laminat-bedarf-verlegen-wohnung.webp',
      'images/ratgeber/laminat-bedarf-verschnitt-infografik.svg',
      'images/ratgeber/gasverbrauch-m3-kwh-heizung.webp',
      'images/ratgeber/gasverbrauch-m3-kwh-kosten-infografik.svg',
    ];

    for (const relPath of expectedImages) {
      const fullPath = path.join(publicDir, relPath);
      expect(fs.existsSync(fullPath), `Image file ${relPath} must exist on disk`).toBe(true);
      const stats = fs.statSync(fullPath);
      expect(stats.size, `Image ${relPath} should not be empty`).toBeGreaterThan(1000);
    }
  });

  it('verifies articles reference their respective cover and section images', () => {
    const eAuto = getArticleBySlug('e-auto-kosten-100-km')!;
    expect(eAuto.coverIllustration?.src).toBe('/images/ratgeber/e-auto-kosten-100-km-wallbox.webp');
    expect(eAuto.sections[0].illustration?.src).toBe('/images/ratgeber/e-auto-kosten-100-km-infografik.svg');

    const laminat = getArticleBySlug('laminat-bedarf-gewicht-verschnitt')!;
    expect(laminat.coverIllustration?.src).toBe('/images/ratgeber/laminat-bedarf-verlegen-wohnung.webp');
    expect(laminat.sections[0].illustration?.src).toBe('/images/ratgeber/laminat-bedarf-verschnitt-infografik.svg');

    const gas = getArticleBySlug('gasverbrauch-m3-kwh-kosten')!;
    expect(gas.coverIllustration?.src).toBe('/images/ratgeber/gasverbrauch-m3-kwh-heizung.webp');
    expect(gas.sections[0].illustration?.src).toBe('/images/ratgeber/gasverbrauch-m3-kwh-kosten-infografik.svg');
  });

  it('all 3 new articles are included in the XML sitemap', () => {
    const entries = sitemap();
    const urls = new Set(entries.map((e) => e.url));

    for (const slug of newSlugs) {
      const expectedUrl = `https://rechenhafen.de/ratgeber/${slug}/`;
      expect(urls.has(expectedUrl), `Sitemap must contain ${expectedUrl}`).toBe(true);
    }
  });

  it('verifies contextual backlinks on existing calculator pages', () => {
    const evCalc = getCalculatorBySlug('elektroauto-ladekosten-rechner')!;
    expect(evCalc.content?.intro).toContain('/ratgeber/e-auto-kosten-100-km/');

    const laminateCalc = getCalculatorBySlug('bodenbelag-rechner')!;
    expect(laminateCalc.content?.intro).toContain('/ratgeber/laminat-bedarf-gewicht-verschnitt/');

    const gasCalc = getCalculatorBySlug('gasverbrauch-kwh-m3-rechner')!;
    expect(gasCalc.content?.intro).toContain('/ratgeber/gasverbrauch-m3-kwh-kosten/');
  });
});
