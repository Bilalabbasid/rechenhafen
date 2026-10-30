import { describe, it, expect } from 'vitest';
import { metadata as layoutMetadata } from '@/app/layout';
import { metadata as homeMetadata } from '@/app/page';
import { metadata as allCalcsMetadata } from '@/app/rechner/page';
import { metadata as ratgeberHubMetadata } from '@/app/ratgeber/page';
import { metadata as ueberUnsMetadata } from '@/app/ueber-uns/page';
import { metadata as methodikMetadata } from '@/app/methodik/page';
import { metadata as impressumMetadata } from '@/app/impressum/page';
import { metadata as datenschutzMetadata } from '@/app/datenschutz/page';
import { metadata as notFoundMetadata } from '@/app/not-found';
import sitemap from '@/app/sitemap';
import { ALL_CALCULATORS } from '@/data/calculators';
import { CATEGORIES } from '@/data/categories';
import { getAllArticles } from '@/data/ratgeber/articles';

describe('Google SEO Starter Guide Compliance & Quality Suite', () => {
  // 1. TITLE LINKS & BRANDING CONSISTENCY
  describe('Page Titles & Brand Template', () => {
    it('verifies root layout title template is configured correctly', () => {
      expect(layoutMetadata.title).toEqual({
        default: 'RechenHafen – Alle Rechner an einem Ort',
        template: '%s | RechenHafen',
      });
    });

    it('verifies all core static pages have unique and descriptive titles', () => {
      const titles = [
        typeof homeMetadata.title === 'object' && 'absolute' in (homeMetadata.title as any)
          ? (homeMetadata.title as any).absolute
          : homeMetadata.title,
        allCalcsMetadata.title,
        ratgeberHubMetadata.title,
        ueberUnsMetadata.title,
        methodikMetadata.title,
        impressumMetadata.title,
        datenschutzMetadata.title,
      ];

      // Each title must be non-empty and unique
      const uniqueTitles = new Set(titles);
      expect(uniqueTitles.size).toBe(titles.length);
      for (const title of titles) {
        expect(typeof title).toBe('string');
        expect((title as string).length).toBeGreaterThanOrEqual(9);
      }
    });
  });

  // 2. SNIPPETS & META DESCRIPTIONS
  describe('Meta Descriptions Quality', () => {
    it('verifies all static core pages have descriptive meta descriptions', () => {
      const descriptions = [
        homeMetadata.description,
        allCalcsMetadata.description,
        ratgeberHubMetadata.description,
        ueberUnsMetadata.description,
        methodikMetadata.description,
        impressumMetadata.description,
        datenschutzMetadata.description,
      ];

      for (const desc of descriptions) {
        expect(desc).toBeDefined();
        expect(typeof desc).toBe('string');
        expect((desc as string).length).toBeGreaterThanOrEqual(40);
        expect((desc as string).length).toBeLessThanOrEqual(250);
      }
    });
  });

  // 3. CANONICAL URLS & SITEMAP INTEGRITY
  describe('Canonical URLs & Sitemap Discovery', () => {
    it('verifies all static pages declare self-referential HTTPS canonicals with trailing slashes', () => {
      const pages = [
        { name: 'home', meta: homeMetadata, expected: 'https://rechenhafen.de/' },
        { name: 'rechner', meta: allCalcsMetadata, expected: 'https://rechenhafen.de/rechner/' },
        { name: 'ratgeber', meta: ratgeberHubMetadata, expected: 'https://rechenhafen.de/ratgeber/' },
        { name: 'ueber-uns', meta: ueberUnsMetadata, expected: 'https://rechenhafen.de/ueber-uns/' },
        { name: 'methodik', meta: methodikMetadata, expected: 'https://rechenhafen.de/methodik/' },
        { name: 'impressum', meta: impressumMetadata, expected: 'https://rechenhafen.de/impressum/' },
        { name: 'datenschutz', meta: datenschutzMetadata, expected: 'https://rechenhafen.de/datenschutz/' },
      ];

      for (const p of pages) {
        const canonical = (p.meta.alternates as any)?.canonical;
        expect(canonical).toBe(p.expected);
      }
    });

    it('verifies sitemap generates comprehensive index for all pages with valid timestamps', () => {
      const entries = sitemap();
      const urls = new Set(entries.map((e) => e.url));

      // Core pages
      expect(urls.has('https://rechenhafen.de/')).toBe(true);
      expect(urls.has('https://rechenhafen.de/rechner/')).toBe(true);
      expect(urls.has('https://rechenhafen.de/ratgeber/')).toBe(true);
      expect(urls.has('https://rechenhafen.de/ueber-uns/')).toBe(true);
      expect(urls.has('https://rechenhafen.de/methodik/')).toBe(true);

      // Categories
      for (const cat of CATEGORIES) {
        expect(urls.has(`https://rechenhafen.de/${cat.slug}/`)).toBe(true);
      }

      // Calculators
      for (const calc of ALL_CALCULATORS) {
        expect(urls.has(`https://rechenhafen.de/rechner/${calc.slug}/`)).toBe(true);
      }

      // Ratgeber
      for (const article of getAllArticles()) {
        expect(urls.has(`https://rechenhafen.de/ratgeber/${article.slug}/`)).toBe(true);
      }

      // Check all have lastModified dates
      for (const e of entries) {
        expect(e.lastModified).toBeInstanceOf(Date);
      }
    });
  });

  // 4. SEARCH APPEARANCE & FAVICON
  describe('Favicon & Visual Identity', () => {
    it('verifies vector favicon and apple-touch-icon are explicitly defined in layout metadata', () => {
      const icons = (layoutMetadata as any).icons;
      expect(icons).toBeDefined();
      expect(icons.icon).toBeDefined();
      expect(icons.apple).toBeDefined();
      expect(icons.icon[0].url).toBe('/icon.svg');
      expect(icons.apple[0].url).toBe('/icon.svg');
    });
  });

  // 5. HELPFUL 404 PAGE
  describe('Helpful 404 Error Handling', () => {
    it('verifies 404 page is excluded from search engine index to preserve crawl budget', () => {
      const robots = notFoundMetadata.robots as any;
      expect(robots).toBeDefined();
      expect(robots.index).toBe(false);
      expect(robots.follow).toBe(false);
    });
  });
});
