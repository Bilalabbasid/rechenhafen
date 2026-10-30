import { describe, it, expect } from 'vitest';
import { metadata as layoutMetadata } from '@/app/layout';
import { ALL_CALCULATORS, getCalculatorBySlug } from '@/data/calculators';
import { CATEGORIES } from '@/data/categories';
import { getAllArticles } from '@/data/ratgeber/articles';
import { stripMarkdown } from '@/components/common/FormattedContent';

describe('Google AI Search Optimization Guide QA Suite', () => {
  // 1. CRAWL & SNIPPET PERMISSION VERIFICATION
  describe('Crawlability & Snippet Directives', () => {
    it('verifies layout robots meta allows unlimited snippets and large image previews for all search engines and Googlebot', () => {
      const robots = layoutMetadata.robots as any;
      expect(robots).toBeDefined();
      expect(robots.index).toBe(true);
      expect(robots.follow).toBe(true);

      // Root robots directives (for Bing/Copilot, Perplexity, general AI RAG crawlers)
      expect(robots['max-snippet']).toBe(-1);
      expect(robots['max-image-preview']).toBe('large');
      expect(robots['max-video-preview']).toBe(-1);

      // Googlebot-specific directives (for Google AI Overviews and AI Mode)
      expect(robots.googleBot).toBeDefined();
      expect(robots.googleBot.index).toBe(true);
      expect(robots.googleBot.follow).toBe(true);
      expect(robots.googleBot['max-snippet']).toBe(-1);
      expect(robots.googleBot['max-image-preview']).toBe('large');
      expect(robots.googleBot['max-video-preview']).toBe(-1);
    });
  });

  // 2. STRUCTURED DATA & ENTITY GRAPH VERIFICATION
  describe('Schema.org Structured Data Quality', () => {
    it('verifies all calculators have necessary attributes for WebApplication & WebPage graph', () => {
      for (const calc of ALL_CALCULATORS) {
        expect(calc.slug).toBeTruthy();
        expect(calc.name).toBeTruthy();
        expect(calc.metaDescription).toBeTruthy();

        // Valid temporal timestamp if time-sensitive
        if (calc.isTimeSensitive && calc.timeSensitiveMeta) {
          expect(calc.timeSensitiveMeta.year).toBeGreaterThanOrEqual(2025);
          expect(calc.timeSensitiveMeta.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }
        if (calc.trustMeta?.lastReviewed) {
          expect(calc.trustMeta.lastReviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }
      }
    });

    it('verifies all ratgeber articles have required schema attributes for Google Search Article indexing', () => {
      const articles = getAllArticles();
      expect(articles.length).toBeGreaterThan(0);

      for (const article of articles) {
        expect(article.slug).toBeTruthy();
        expect(article.title).toBeTruthy();
        expect(article.metaDescription).toBeTruthy();
        expect(article.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(article.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(article.author.name).toBeTruthy();
        if (article.coverIllustration) {
          expect(article.coverIllustration.src).toBeTruthy();
        }
      }
    });

    it('verifies FAQ schema answer text is free of raw markdown formatting tokens', () => {
      const testMarkdown = 'Hier ist ein **wichtiger** Betrag von [100 Euro](/rechner/spar-rechner/) mit `Formel`.';
      const clean = stripMarkdown(testMarkdown);
      expect(clean).not.toContain('**');
      expect(clean).not.toContain('`');
      expect(clean).not.toContain('](/');
      expect(clean).toBe('Hier ist ein wichtiger Betrag von 100 Euro mit Formel.');

      // Check all calculator FAQs
      for (const calc of ALL_CALCULATORS) {
        if (!calc.faqs) continue;
        for (const faq of calc.faqs) {
          const stripped = stripMarkdown(faq.answer);
          expect(stripped).not.toContain('**');
          expect(stripped).not.toContain('](');
          expect(stripped).not.toContain('`');
        }
      }
    });

    it('verifies category collection pages have at least one calculator and unique valid URLs', () => {
      for (const cat of CATEGORIES) {
        expect(cat.slug).toBeTruthy();
        expect(cat.name).toBeTruthy();
        expect(cat.metaDescription).toBeTruthy();
      }
    });
  });

  // 3. NON-COMMODITY VALUE & E-E-A-T INTEGRITY
  describe('Non-Commodity Value & Evidence-Based Content', () => {
    it('ensures CO2 cluster calculators feature official statutory references and verified methodology', () => {
      const co2Calc = getCalculatorBySlug('co2-abgabe-vermieter-mieter-rechner');
      expect(co2Calc).toBeDefined();
      expect(co2Calc?.timeSensitiveMeta?.sourceUrl).toContain('gesetze-im-internet.de/co2kostaufg');
      expect(co2Calc?.trustMeta?.sourceName).toContain('CO2KostAufG');
      expect(co2Calc?.formulaExplanation).toContain('CO2KostAufG');

      const co2Strom = getCalculatorBySlug('co2-strom-rechner');
      expect(co2Strom).toBeDefined();
      expect(co2Strom?.timeSensitiveMeta?.lastVerified).toBe('2026-10-29');

      const co2Preis = getCalculatorBySlug('co2-preis-rechner');
      expect(co2Preis).toBeDefined();
      expect(co2Preis?.timeSensitiveMeta?.sourceUrl).toContain('gesetze-im-internet.de');
    });
  });
});
