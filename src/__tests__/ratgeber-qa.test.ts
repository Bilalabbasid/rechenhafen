import { describe, it, expect } from 'vitest';
import { getAllArticles, getArticleBySlug } from '@/data/ratgeber/articles';
import { getCalculatorBySlug } from '@/data/calculators';
import sitemap from '@/app/sitemap';

describe('RechenHafen Ratgeber / Blog QA Verification', () => {
  const articles = getAllArticles();

  it('contains published articles with unique valid slugs', () => {
    expect(articles.length).toBe(10);
    const slugs = new Set<string>();

    for (const a of articles) {
      expect(a.slug).toMatch(/^[a-z0-9-]+$/);
      expect(slugs.has(a.slug)).toBe(false);
      slugs.add(a.slug);
    }
  });

  it('has valid metadata (unique metaTitle, metaDescription, h1)', () => {
    const titles = new Set<string>();
    const h1s = new Set<string>();

    for (const a of articles) {
      expect(a.metaTitle.length).toBeGreaterThan(10);
      expect(a.metaDescription.length).toBeGreaterThan(40);
      expect(a.h1.length).toBeGreaterThan(5);

      expect(titles.has(a.metaTitle)).toBe(false);
      titles.add(a.metaTitle);

      expect(h1s.has(a.h1)).toBe(false);
      h1s.add(a.h1);

      expect(new Date(a.publishedAt).toString()).not.toBe('Invalid Date');
      expect(new Date(a.updatedAt).toString()).not.toBe('Invalid Date');
      expect(a.readingTimeMin).toBeGreaterThan(0);
    }
  });

  it('links every article to an existing, verified working calculator', () => {
    for (const a of articles) {
      expect(a.primaryCalculator).toBeDefined();
      expect(a.primaryCalculator.slug.length).toBeGreaterThan(0);

      const targetCalc = getCalculatorBySlug(a.primaryCalculator.slug);
      expect(targetCalc).toBeDefined();
      expect(targetCalc?.name).toBeDefined();

      if (a.secondaryCalculators) {
        for (const sec of a.secondaryCalculators) {
          const secCalc = getCalculatorBySlug(sec.slug);
          expect(secCalc).toBeDefined();
        }
      }
    }
  });

  it('has valid internal links in relatedArticleSlugs', () => {
    for (const a of articles) {
      for (const relSlug of a.relatedArticleSlugs) {
        const found = getArticleBySlug(relSlug);
        expect(found).toBeDefined();
      }
    }
  });

  it('has complete content structure (takeaways, worked example, FAQs)', () => {
    for (const a of articles) {
      expect(a.keyTakeaways.length).toBeGreaterThanOrEqual(3);
      expect(a.sections.length).toBeGreaterThanOrEqual(2);

      expect(a.workedExample).toBeDefined();
      expect(a.workedExample.formula.length).toBeGreaterThan(0);
      expect(a.workedExample.steps.length).toBeGreaterThanOrEqual(2);
      expect(a.workedExample.resultSummary.length).toBeGreaterThan(0);

      expect(a.faqs.length).toBeGreaterThanOrEqual(2);
      for (const faq of a.faqs) {
        expect(faq.question.length).toBeGreaterThan(5);
        expect(faq.answer.length).toBeGreaterThan(10);
      }
    }
  });

  it('includes all ratgeber URLs in sitemap.ts', () => {
    const sitemapEntries = sitemap();
    const urls = new Set(sitemapEntries.map((e) => e.url));

    expect(urls.has('https://rechenhafen.de/ratgeber/')).toBe(true);

    for (const a of articles) {
      expect(urls.has(`https://rechenhafen.de/ratgeber/${a.slug}/`)).toBe(true);
    }
  });
});
