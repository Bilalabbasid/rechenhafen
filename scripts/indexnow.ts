/**
 * IndexNow: tells Bing (and other IndexNow engines such as Yandex, Seznam, Naver) which URLs
 * changed, so they recrawl them within days instead of weeks. Google does not use IndexNow.
 *
 * The key is the 32-hex-character file in /public (served at https://rechenhafen.de/<key>.txt).
 *
 * Usage:
 *   npm run indexnow -- --dry-run          # list the URLs, send nothing
 *   npm run indexnow                       # all live pages + all retired (redirected) URLs
 *   npm run indexnow -- /rechner/foo/ ...  # only the given paths
 *
 * Only submit URLs that really changed; IndexNow is not a ranking trick, and resubmitting
 * unchanged URLs again and again can get the key throttled.
 */
import fs from 'fs';
import path from 'path';
import { ALL_CALCULATORS } from '../src/data/calculators';
import { CATEGORIES } from '../src/data/categories';
import { getAllArticles } from '../src/data/ratgeber/articles';
import { RETIRED_CALCULATORS } from '../src/data/seo/retired-calculators';

const HOST = 'rechenhafen.de';
const ORIGIN = `https://${HOST}`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const STATIC_PATHS = ['/', '/rechner/', '/ratgeber/', '/ueber-uns/', '/methodik/', '/impressum/', '/datenschutz/', '/rechner-einbinden/'];

function findKey(): string {
  const publicDir = path.join(__dirname, '..', 'public');
  const keys = fs.readdirSync(publicDir).filter((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  if (keys.length !== 1) throw new Error(`Expected exactly one IndexNow key file in public/, found ${keys.length}.`);
  const key = keys[0].replace(/\.txt$/, '');
  const content = fs.readFileSync(path.join(publicDir, keys[0]), 'utf-8').trim();
  if (content !== key) throw new Error('IndexNow key file content does not match its file name.');
  return key;
}

function allPaths(): string[] {
  return [
    ...STATIC_PATHS,
    ...CATEGORIES.map((c) => `/${c.slug}/`),
    ...ALL_CALCULATORS.map((c) => `/rechner/${c.slug}/`),
    ...getAllArticles().map((a) => `/ratgeber/${a.slug}/`),
    // Retired URLs: lets the engine see the 301 to the merged page quickly.
    ...Object.keys(RETIRED_CALCULATORS).map((slug) => `/rechner/${slug}/`),
  ];
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const given = args.filter((a) => a.startsWith('/'));
  const key = findKey();
  const keyLocation = `${ORIGIN}/${key}.txt`;
  const urls = [...new Set((given.length ? given : allPaths()).map((p) => ORIGIN + p))];

  console.log(`${urls.length} URLs, key file ${keyLocation}`);
  if (dryRun) {
    urls.forEach((u) => console.log('  ' + u));
    return;
  }

  const live = await fetch(keyLocation);
  const liveText = (await live.text()).trim();
  if (!live.ok || liveText !== key) {
    throw new Error(`Key file is not live yet (${live.status}). Deploy first, then run again.`);
  }

  // IndexNow accepts up to 10.000 URLs per request.
  for (let i = 0; i < urls.length; i += 10000) {
    const urlList = urls.slice(i, i + 10000);
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key, keyLocation, urlList }),
    });
    const meaning: Record<number, string> = {
      200: 'OK – URLs received',
      202: 'Accepted – key validation pending, URLs received',
      400: 'Bad request – invalid format',
      403: 'Forbidden – key not valid (key file not found or content wrong)',
      422: 'Unprocessable – URLs do not belong to the host or key mismatch',
      429: 'Too many requests – slow down',
    };
    console.log(`Batch ${i / 10000 + 1}: HTTP ${res.status} ${meaning[res.status] ?? ''}`);
    if (res.status >= 400) {
      console.log(await res.text());
      process.exitCode = 1;
    }
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
