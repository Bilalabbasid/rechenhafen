import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';
import { getArticleBySlug } from '@/data/ratgeber/articles';
import { GAS_CLUSTER_CONFIG } from '@/components/calculator/GasClusterLinks';
import { DATE_CLUSTER_CONFIG } from '@/components/calculator/DateClusterLinks';

describe('SEO Clusters Verification (Gas Cluster & Date Cluster)', () => {
  const GAS_CLUSTER_CALCS = [
    'gaskostenrechner',
    'gasverbrauch-kwh-m3-rechner',
    'heizkostenvergleich-rechner',
    'stromkostenrechner',
    'oelheizung-verbrauch-rechner',
  ];

  const GAS_CLUSTER_ARTICLES = [
    'gaszaehler-m3-in-kwh-umrechnen',
    'gaskosten-berechnen',
  ];

  const DATE_CLUSTER_CALCS = [
    'dienstjubilaeum-rechner',
    'alter-in-tagen',
    'datum-plus-tage',
    'tage-zwischen-zwei-daten',
  ];

  describe('1. Entity Existence & Valid Internal Slugs', () => {
    it('all 5 gas calculators exist in registry', () => {
      for (const slug of GAS_CLUSTER_CALCS) {
        const calc = getCalculatorBySlug(slug);
        expect(calc, `Calculator ${slug} should exist`).toBeDefined();
        expect(calc?.slug).toBe(slug);
      }
    });

    it('all 2 gas ratgeber articles exist in registry', () => {
      for (const slug of GAS_CLUSTER_ARTICLES) {
        const article = getArticleBySlug(slug);
        expect(article, `Article ${slug} should exist`).toBeDefined();
        expect(article?.slug).toBe(slug);
      }
    });

    it('all 4 date calculators exist in registry', () => {
      for (const slug of DATE_CLUSTER_CALCS) {
        const calc = getCalculatorBySlug(slug);
        expect(calc, `Calculator ${slug} should exist`).toBeDefined();
        expect(calc?.slug).toBe(slug);
      }
    });
  });

  describe('2. Gas Cluster Link Integrity & Dual-Intent Verification', () => {
    it('has context-specific configuration for all 7 gas pages', () => {
      const allPages = [...GAS_CLUSTER_CALCS, ...GAS_CLUSTER_ARTICLES];
      for (const page of allPages) {
        const config = GAS_CLUSTER_CONFIG[page];
        expect(config, `Gas cluster config for ${page} must exist`).toBeDefined();
        expect(config.links.length).toBeGreaterThanOrEqual(4);
      }
    });

    it('every link in GasClusterLinks points to an existing calculator or ratgeber and has trailing slash', () => {
      for (const [pageSlug, config] of Object.entries(GAS_CLUSTER_CONFIG)) {
        const seenHrefs = new Set<string>();

        for (const link of config.links) {
          // Trailing slash requirement (no 301 redirects)
          expect(link.href.startsWith('/')).toBe(true);
          expect(link.href.endsWith('/')).toBe(true);

          // No self-links
          expect(link.href).not.toContain(`/${pageSlug}/`);

          // No duplicates in same section
          expect(seenHrefs.has(link.href), `Duplicate link ${link.href} on page ${pageSlug}`).toBe(false);
          seenHrefs.add(link.href);

          // Must resolve to 200
          if (link.href.startsWith('/rechner/')) {
            const targetSlug = link.href.replace('/rechner/', '').replace('/', '');
            const target = getCalculatorBySlug(targetSlug);
            expect(target, `Target calculator ${targetSlug} should exist`).toBeDefined();
          } else if (link.href.startsWith('/ratgeber/')) {
            const targetSlug = link.href.replace('/ratgeber/', '').replace('/', '');
            const target = getArticleBySlug(targetSlug);
            expect(target, `Target ratgeber ${targetSlug} should exist`).toBeDefined();
          }

          // Natural anchor text & reason without raw Markdown
          expect(link.anchorText.length).toBeGreaterThan(5);
          expect(link.reason.length).toBeGreaterThan(15);
          expect(link.anchorText).not.toContain('**');
          expect(link.anchorText).not.toContain('`');
          expect(link.reason).not.toContain('**');
          expect(link.reason).not.toContain('`');
        }
      }
    });

    it('gaskostenrechner routes cleanly to both m3 converter and kWh guides', () => {
      const gaskostenLinks = GAS_CLUSTER_CONFIG['gaskostenrechner'].links;
      const hrefs = gaskostenLinks.map((l) => l.href);
      expect(hrefs).toContain('/ratgeber/gaszaehler-m3-in-kwh-umrechnen/');
      expect(hrefs).toContain('/rechner/gasverbrauch-kwh-m3-rechner/');
      expect(hrefs).toContain('/ratgeber/gaskosten-berechnen/');
      expect(hrefs).toContain('/rechner/heizkostenvergleich-rechner/');
      expect(hrefs).toContain('/rechner/oelheizung-verbrauch-rechner/');
    });

    it('preserves rechnerischer Monatsdurchschnitt terminology on gaskostenrechner', () => {
      const calc = getCalculatorBySlug('gaskostenrechner')!;
      const text = JSON.stringify(calc);
      expect(text.toLowerCase()).toContain('monatsdurchschnitt');
      expect(text.toLowerCase()).toContain('rechnerisch');
      // Must not promise a guaranteed supplier Abschlag
      expect(text).not.toContain('garantierter Abschlag');
    });
  });

  describe('3. Date Cluster Distinct Intent Verification', () => {
    it('has context-specific configuration for all 4 date calculators', () => {
      for (const slug of DATE_CLUSTER_CALCS) {
        const config = DATE_CLUSTER_CONFIG[slug];
        expect(config, `Date cluster config for ${slug} must exist`).toBeDefined();
        expect(config.links.length).toBe(3); // Exactly the other 3 calculators in the cluster
      }
    });

    it('every link in DateClusterLinks points to an existing calculator and has trailing slash', () => {
      for (const [pageSlug, config] of Object.entries(DATE_CLUSTER_CONFIG)) {
        const seenHrefs = new Set<string>();

        for (const link of config.links) {
          // Trailing slash requirement (no 301 redirects)
          expect(link.href.startsWith('/rechner/')).toBe(true);
          expect(link.href.endsWith('/')).toBe(true);

          // No self-links
          expect(link.href).not.toContain(`/${pageSlug}/`);

          // No duplicates in same section
          expect(seenHrefs.has(link.href), `Duplicate link ${link.href} on page ${pageSlug}`).toBe(false);
          seenHrefs.add(link.href);

          const targetSlug = link.href.replace('/rechner/', '').replace('/', '');
          const target = getCalculatorBySlug(targetSlug);
          expect(target, `Target calculator ${targetSlug} should exist`).toBeDefined();

          // Natural anchor text & reason without raw Markdown
          expect(link.anchorText.length).toBeGreaterThan(5);
          expect(link.reason.length).toBeGreaterThan(15);
          expect(link.anchorText).not.toContain('**');
          expect(link.anchorText).not.toContain('`');
          expect(link.reason).not.toContain('**');
          expect(link.reason).not.toContain('`');
        }
      }
    });

    it('dienstjubilaeum-rechner links to tage-zwischen-zwei-daten, datum-plus-tage and alter-in-tagen', () => {
      const calc = getCalculatorBySlug('dienstjubilaeum-rechner')!;
      expect(calc.relatedSlugs).toContain('tage-zwischen-zwei-daten');
      expect(calc.relatedSlugs).toContain('datum-plus-tage');
      expect(calc.relatedSlugs).toContain('alter-in-tagen');
    });

    it('alter-in-tagen links to tage-zwischen-zwei-daten, datum-plus-tage and dienstjubilaeum-rechner', () => {
      const calc = getCalculatorBySlug('alter-in-tagen')!;
      expect(calc.relatedSlugs).toContain('tage-zwischen-zwei-daten');
      expect(calc.relatedSlugs).toContain('datum-plus-tage');
      expect(calc.relatedSlugs).toContain('dienstjubilaeum-rechner');
    });

    it('datum-plus-tage links to tage-zwischen-zwei-daten, dienstjubilaeum-rechner and alter-in-tagen', () => {
      const calc = getCalculatorBySlug('datum-plus-tage')!;
      expect(calc.relatedSlugs).toContain('tage-zwischen-zwei-daten');
      expect(calc.relatedSlugs).toContain('dienstjubilaeum-rechner');
      expect(calc.relatedSlugs).toContain('alter-in-tagen');
    });

    it('tage-zwischen-zwei-daten links to datum-plus-tage, dienstjubilaeum-rechner and alter-in-tagen', () => {
      const calc = getCalculatorBySlug('tage-zwischen-zwei-daten')!;
      expect(calc.relatedSlugs).toContain('datum-plus-tage');
      expect(calc.relatedSlugs).toContain('dienstjubilaeum-rechner');
      expect(calc.relatedSlugs).toContain('alter-in-tagen');
    });
  });
});
