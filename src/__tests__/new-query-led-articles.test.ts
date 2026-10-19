import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getArticleBySlug, getAllArticles } from '@/data/ratgeber/articles';
import { ALL_CALCULATORS } from '@/data/calculators';

describe('New Query-Led Articles & Bidirectional Linking QA', () => {
  it('registers splitt-2-5-gewicht-schuettdichte article with complete metadata and honest authorship', () => {
    const article = getArticleBySlug('splitt-2-5-gewicht-schuettdichte');
    expect(article).toBeDefined();
    expect(article?.slug).toBe('splitt-2-5-gewicht-schuettdichte');
    expect(article?.category).toBe('bauen-renovieren');
    expect(article?.author.name).toBe('Redaktion RechenHafen');
    expect(article?.reviewer?.name).toBe('Redaktion RechenHafen');
    expect(article?.publishedAt).toBe('2026-10-18');
    expect(article?.updatedAt).toBe('2026-10-18');

    // Primary calculator must exist
    const calc = ALL_CALCULATORS.find((c) => c.slug === article?.primaryCalculator.slug);
    expect(calc).toBeDefined();
    expect(calc?.slug).toBe('kies-splitt-rechner');

    // SVG illustration must exist on disk
    if (article?.coverIllustration?.src) {
      const publicPath = path.join(process.cwd(), 'public', article.coverIllustration.src);
      expect(fs.existsSync(publicPath)).toBe(true);
    }

    // Bidirectional link from calculator to article
    const calcText = JSON.stringify(calc?.content || {});
    expect(calcText).toContain('/ratgeber/splitt-2-5-gewicht-schuettdichte/');
  });

  it('registers lebensmonate-berechnen article with complete metadata and honest authorship', () => {
    const article = getArticleBySlug('lebensmonate-berechnen');
    expect(article).toBeDefined();
    expect(article?.slug).toBe('lebensmonate-berechnen');
    expect(article?.category).toBe('datum-zeit');
    expect(article?.author.name).toBe('Redaktion RechenHafen');
    expect(article?.reviewer?.name).toBe('Redaktion RechenHafen');
    expect(article?.publishedAt).toBe('2026-10-18');
    expect(article?.updatedAt).toBe('2026-10-18');

    // Primary calculator must exist
    const calc = ALL_CALCULATORS.find((c) => c.slug === article?.primaryCalculator.slug);
    expect(calc).toBeDefined();
    expect(calc?.slug).toBe('alter-in-monaten');

    // SVG illustration must exist on disk
    if (article?.coverIllustration?.src) {
      const publicPath = path.join(process.cwd(), 'public', article.coverIllustration.src);
      expect(fs.existsSync(publicPath)).toBe(true);
    }

    // Bidirectional link from calculator to article
    const calcText = JSON.stringify(calc?.content || {});
    expect(calcText).toContain('/ratgeber/lebensmonate-berechnen/');
  });

  it('includes both new articles in getAllArticles() for sitemap and hub listing', () => {
    const all = getAllArticles();
    const splitt = all.find((a) => a.slug === 'splitt-2-5-gewicht-schuettdichte');
    const monate = all.find((a) => a.slug === 'lebensmonate-berechnen');
    expect(splitt).toBeDefined();
    expect(monate).toBeDefined();
  });
});
