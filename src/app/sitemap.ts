import { MetadataRoute } from 'next';
import { ALL_CALCULATORS } from '@/data/calculators';
import { CATEGORIES } from '@/data/categories';
import { getAllArticles } from '@/data/ratgeber/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rechenhafen.de';
  const now = new Date();

  // Statische Kernseiten
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/rechner/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ratgeber/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ueber-uns/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/methodik/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/impressum/`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/datenschutz/`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // 16 Kategorieseiten
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/${cat.slug}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Rechnerseiten
  const calculatorPages: MetadataRoute.Sitemap = ALL_CALCULATORS.map((calc) => ({
    url: `${baseUrl}/rechner/${calc.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Ratgeberseiten
  const ratgeberPages: MetadataRoute.Sitemap = getAllArticles().map((article) => ({
    url: `${baseUrl}/ratgeber/${article.slug}/`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...calculatorPages, ...ratgeberPages];
}

