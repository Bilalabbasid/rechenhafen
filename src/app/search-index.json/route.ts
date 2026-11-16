import { getSearchEntries } from '@/lib/search/searchEngine';

// Built once at build time; the search box loads it on first use instead of bundling the registry.
export const dynamic = 'force-static';

export function GET() {
  return new Response(JSON.stringify(getSearchEntries()), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'noindex',
    },
  });
}
