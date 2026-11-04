/**
 * Calculators that other websites may embed via iframe (/embed/<slug>/).
 *
 * The embed code shown on /rechner-einbinden/ puts a normal, visible credit link *below* the
 * iframe. That link is what counts as a backlink – links inside an iframe belong to
 * rechenhafen.de, not to the embedding site. The anchor text is the brand ("RechenHafen.de"),
 * not a keyword, so the widget does not look like a link scheme to Google.
 */
export const EMBEDDABLE_CALCULATORS = [
  {
    slug: 'schalungssteine-rechner',
    audience: 'Heimwerker-, Hausbau- und Gartenblogs',
    height: 980,
  },
  {
    slug: 'zucker-ersatz-rechner',
    audience: 'Back-, Rezept- und Low-Carb-Blogs',
    height: 900,
  },
  {
    slug: 'alkohol-verkochungs-rechner',
    audience: 'Koch- und Rezeptblogs',
    height: 860,
  },
] as const;

export type EmbeddableSlug = (typeof EMBEDDABLE_CALCULATORS)[number]['slug'];

export const EMBED_ORIGIN = 'https://rechenhafen.de';
export const EMBED_HEIGHT_MESSAGE = 'rechenhafen:embed-height';

export function isEmbeddable(slug: string): slug is EmbeddableSlug {
  return EMBEDDABLE_CALCULATORS.some((c) => c.slug === slug);
}

/** HTML snippet a blogger pastes into their page. */
export function buildEmbedSnippet(slug: string, calculatorName: string, height: number): string {
  const src = `${EMBED_ORIGIN}/embed/${slug}/`;
  const page = `${EMBED_ORIGIN}/rechner/${slug}/`;
  return [
    `<iframe src="${src}" title="${calculatorName}" width="100%" height="${height}" style="border:0;max-width:760px;width:100%;" loading="lazy"></iframe>`,
    `<p style="font-size:14px;margin:4px 0 0;">${calculatorName} von <a href="${page}">RechenHafen.de</a></p>`,
    `<script>window.addEventListener("message",function(e){if(e.origin!=="${EMBED_ORIGIN}"||!e.data||e.data.type!=="${EMBED_HEIGHT_MESSAGE}")return;document.querySelectorAll('iframe[src^="${EMBED_ORIGIN}/embed/'+e.data.slug+'/"]').forEach(function(f){f.style.height=e.data.height+"px";});});</script>`,
  ].join('\n');
}
