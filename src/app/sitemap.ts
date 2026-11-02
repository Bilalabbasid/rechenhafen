import { MetadataRoute } from 'next';
import { ALL_CALCULATORS } from '@/data/calculators';
import { CATEGORIES } from '@/data/categories';
import { getAllArticles } from '@/data/ratgeber/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rechenhafen.de';
  // Stable release date of the current platform redesign
  const platformUpdateDate = new Date('2026-09-24T00:00:00.000Z');

  // Statische Kernseiten
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: platformUpdateDate,
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
  ];

  // 17 Kategorieseiten
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/${cat.slug}/`,
    lastModified: platformUpdateDate,
  }));

  // 408 Rechnerseiten (schließt die 16 auf 301-Weiterleitung gesetzten Duplikate automatisch aus)
  const calculatorPages: MetadataRoute.Sitemap = ALL_CALCULATORS.map((calc) => {
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

