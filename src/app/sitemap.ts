import { MetadataRoute } from 'next';
import { ALL_CALCULATORS } from '@/data/calculators';
import { CATEGORIES } from '@/data/categories';
import { getAllArticles } from '@/data/ratgeber/articles';
import { isCalculatorIndexable } from '@/data/seo/indexable-calculators';
import { SITE_LAST_UPDATED } from '@/data/home';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rechenhafen.de';
  // Stable release date of the current platform redesign
  const platformUpdateDate = new Date('2026-09-24T00:00:00.000Z');

  // Statische Kernseiten
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(`${SITE_LAST_UPDATED}T00:00:00.000Z`),
    },
    {
      url: `${baseUrl}/rechner/`,
      lastModified: platformUpdateDate,
    },
    {
      url: `${baseUrl}/ratgeber/`,
      lastModified: platformUpdateDate,
    },
    {
      url: `${baseUrl}/ueber-uns/`,
      lastModified: platformUpdateDate,
    },
    {
      url: `${baseUrl}/methodik/`,
      lastModified: platformUpdateDate,
    },
    {
      url: `${baseUrl}/impressum/`,
      lastModified: platformUpdateDate,
    },
    {
      url: `${baseUrl}/datenschutz/`,
      lastModified: platformUpdateDate,
    },
    {
      url: `${baseUrl}/rechner-einbinden/`,
      lastModified: new Date('2026-11-05T00:00:00.000Z'),
    },
  ];

  // 17 Kategorieseiten
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/${cat.slug}/`,
    lastModified: platformUpdateDate,
  }));

  // Nur indexierbare Rechnerseiten (noindex-Seiten gehören nicht in die Sitemap, siehe indexable-calculators.ts)
  const calculatorPages: MetadataRoute.Sitemap = ALL_CALCULATORS.filter((calc) =>
    isCalculatorIndexable(calc.slug),
  ).map((calc) => {
    const lastRev = calc.trustMeta?.lastReviewed || calc.timeSensitiveMeta?.lastVerified;
    return {
      url: `${baseUrl}/rechner/${calc.slug}/`,
      lastModified: lastRev ? new Date(lastRev) : platformUpdateDate,
    };
  });

  // Ratgeberseiten
  const ratgeberPages: MetadataRoute.Sitemap = getAllArticles().map((article) => ({
    url: `${baseUrl}/ratgeber/${article.slug}/`,
    lastModified: new Date(article.updatedAt),
  }));

  return [...staticPages, ...categoryPages, ...calculatorPages, ...ratgeberPages];
}

