import { describe, it, expect, vi } from 'vitest';

// The search bar needs the Next.js app router, which is not mounted in a unit test.
vi.mock('@/components/common/SearchBar', () => ({ default: () => null }));
import { renderToStaticMarkup } from 'react-dom/server';
import HomePage, { metadata } from '@/app/page';
import { ALL_CALCULATORS } from '@/data/calculators';
import { LEGAL_VALUES_2026 } from '@/legal/de';
import { POPULAR_CALCULATOR_SLUGS } from '@/data/popularSearches';
import sitemap from '@/app/sitemap';
import {
  SITE_LAST_UPDATED,
  LEGAL_VALUES_CHECKED_AT,
  OFFICIAL_SOURCES,
  formatGermanDate,
  getHomeFaqs,
} from '@/data/home';

const html = renderToStaticMarkup(HomePage());

function jsonLd(type: string) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]));
  return blocks.find((b) => b['@type'] === type);
}

describe('homepage: title, freshness and structured data', () => {
  it('has a keyword-first title with the year, within 60 characters', () => {
    const title = (metadata.title as { absolute: string }).absolute;
    expect(title).toContain('2026');
    expect(title.length).toBeLessThanOrEqual(60);
    expect(metadata.description).toContain(String(ALL_CALCULATORS.length));
  });

  it('update dates are real ISO dates, not in the future, and the legal date comes from the data', () => {
    for (const d of [SITE_LAST_UPDATED, LEGAL_VALUES_CHECKED_AT]) {
      expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(d).getTime()).toBeLessThanOrEqual(Date.now());
    }
    const checked = Object.values(LEGAL_VALUES_2026)
      .filter((v): v is { checkedAt: string } => !!v && typeof v === 'object' && 'checkedAt' in v)
      .map((v) => v.checkedAt);
    expect(checked).toContain(LEGAL_VALUES_CHECKED_AT);
    expect(SITE_LAST_UPDATED >= LEGAL_VALUES_CHECKED_AT).toBe(true);
    expect(formatGermanDate('2026-11-13')).toBe('13. November 2026');
  });

  it('shows the update date and uses it in the sitemap', () => {
    expect(html).toContain(`<time dateTime="${SITE_LAST_UPDATED}">${formatGermanDate(SITE_LAST_UPDATED)}</time>`);
    const home = sitemap().find((e) => e.url === 'https://rechenhafen.de/');
    expect((home!.lastModified as Date).toISOString().slice(0, 10)).toBe(SITE_LAST_UPDATED);
  });

  it('marks up the popular calculators as an ItemList with live URLs', () => {
    const page = jsonLd('CollectionPage');
    expect(page.dateModified).toBe(SITE_LAST_UPDATED);
    const items = page.mainEntity.itemListElement as { position: number; url: string }[];
    expect(items.length).toBe(POPULAR_CALCULATOR_SLUGS.length);
    const live = new Set(ALL_CALCULATORS.map((c) => `https://rechenhafen.de/rechner/${c.slug}/`));
    items.forEach((it, i) => {
      expect(it.position).toBe(i + 1);
      expect(live.has(it.url), it.url).toBe(true);
    });
  });

  it('renders the FAQ visibly and as FAQPage schema with the same questions', () => {
    const faqs = getHomeFaqs(ALL_CALCULATORS.length);
    const schema = jsonLd('FAQPage');
    expect(schema.mainEntity.map((q: { name: string }) => q.name)).toEqual(faqs.map((f) => f.question));
    for (const f of faqs) expect(html).toContain(f.question);
    expect(faqs[2].answer).toContain(`${LEGAL_VALUES_2026.grundfreibetrag.value.toLocaleString('de-DE')} €`);
  });

  it('links to official sources over https', () => {
    for (const src of OFFICIAL_SOURCES) {
      expect(src.url).toMatch(/^https:\/\//);
      expect(html).toContain(`href="${src.url}"`);
    }
  });
});
