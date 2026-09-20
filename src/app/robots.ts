import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://rechenhafen.de/sitemap.xml',
    host: 'https://rechenhafen.de',
  };
}
