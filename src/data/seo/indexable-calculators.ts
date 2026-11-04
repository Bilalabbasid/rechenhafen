/**
 * Calculators that stay indexable while the site recovers from the 23 Oct 2026 sitewide drop.
 *
 * Source: Google Search Console export, Web search, 6 Oct – 2 Nov 2026 (last 28 days).
 * Rule: a calculator is kept in the index if it earned >= 50 impressions in that window
 * (impressions of a redirected old URL count for its target), or if it is in the small
 * hand-verified core set below.
 * Every other calculator stays live and linked, but gets `noindex, follow` and is left out
 * of the sitemap, so Google judges the site on its strongest pages only.
 *
 * To promote a calculator back into the index, add its slug here – ideally only after
 * it has unique, hand-checked content (own examples, sources, a real reason to exist).
 */

/** Calculators with >= 50 impressions in the GSC window. */
const BY_SEARCH_DEMAND = [
  'abfindungsrechner', // 254 impr., 0 clicks (via old URL /abfindung-fuenftelregelung-rechner/); 222 impr., 0 clicks
  'abschreibung-immobilien-rechner', // 51 impr., 0 clicks
  'abstandszahlung-rechner', // 75 impr., 2 clicks
  'alkohol-abbau-rechner', // 217 impr., 2 clicks
  'alkohol-verkochungs-rechner', // 262 impr., 11 clicks
  'alter-in-monaten', // 71 impr., 0 clicks
  'alter-in-tagen', // 147 impr., 0 clicks
  'anhaenger-stuetzlast-rechner', // 122 impr., 0 clicks
  'arbeitgeberkosten-rechner', // 50 impr., 0 clicks (via old URL /arbeitgeberanteil-sozialversicherung-rechner/)
  'auto-gesamtkosten-rechner', // 92 impr., 0 clicks
  'autobahn-maut-rechner-vignette', // 192 impr., 0 clicks
  'backzeit-temperatur-umluft-oberhitze-rechner', // 57 impr., 0 clicks
  'balkonkraftwerk-ertrag-rechner', // 59 impr., 0 clicks
  'bausteine-mauerwerk-rechner', // 142 impr., 0 clicks
  'betonrechner', // 114 impr., 0 clicks
  'betriebliche-altersvorsorge-rechner', // 93 impr., 0 clicks
  'binaer-hex-dezimal-umrechner', // 84 impr., 0 clicks
  'bodenbelag-rechner', // 86 impr., 0 clicks (via old URL /parkett-laminat-rechner/)
  'bonus-netto-rechner', // 64 impr., 0 clicks
  'brutto-netto-rechner', // 401 impr., 0 clicks
  'co2-auto-rechner', // 137 impr., 0 clicks
  'datenrate-bandbreite-umrechner', // 104 impr., 1 clicks
  'dezibel-schalldruck-umrechner', // 54 impr., 0 clicks
  'dienstfahrrad-jobrad-rechner', // 65 impr., 0 clicks
  'dienstjubilaeum-rechner', // 181 impr., 11 clicks
  'dienstwagen-1-prozent-rechner', // 74 impr., 0 clicks (via old URL /firmenwagen-geldwerter-vorteil-rechner/)
  'drehzahl-umfangsgeschwindigkeit-rechner', // 113 impr., 0 clicks
  'durchschnittsrechner', // 55 impr., 0 clicks
  'eiweiss-eigelb-ersatz-rechner', // 77 impr., 0 clicks
  'elektroauto-ladekosten-rechner', // 78 impr., 0 clicks (via old URL /e-auto-ladekosten-zuhause-rechner/)
  'essloeffel-teeloeffel-gramm-rechner', // 76 impr., 0 clicks
  'etf-sparplan-rechner', // 108 impr., 0 clicks
  'ewige-rente-rechner', // 50 impr., 0 clicks
  'fahrgemeinschaft-sprit-rechner', // 54 impr., 0 clicks
  'fahrtkostenrechner', // 196 impr., 0 clicks
  'fahrzeit-rechner', // 362 impr., 0 clicks
  'flaeche-umrechner', // 125 impr., 0 clicks
  'fondue-raclette-mengen-rechner', // 83 impr., 0 clicks
  'gaskostenrechner', // 1257 impr., 0 clicks
  'gasverbrauch-kwh-m3-rechner', // 189 impr., 0 clicks
  'gewerbesteuer-rechner', // 68 impr., 0 clicks
  'gewicht-masse-umrechner', // 169 impr., 0 clicks
  'ggt-rechner', // 290 impr., 0 clicks
  'gold-rendite-rechner', // 68 impr., 2 clicks
  'goldener-schnitt-rechner', // 74 impr., 0 clicks
  'grenzsteuersatz-rechner', // 63 impr., 0 clicks
  'grundsteuer-reform-rechner', // 54 impr., 0 clicks
  'hefe-umrechner', // 120 impr., 0 clicks
  'hybrid-auto-kosten-rechner', // 163 impr., 6 clicks
  'kgv-rechner', // 80 impr., 0 clicks
  'kies-splitt-rechner', // 317 impr., 0 clicks
  'kinderzuschlag-kiz-rechner', // 129 impr., 0 clicks
  'kindes-endgroesse-rechner', // 59 impr., 0 clicks
  'kita-gebuehren-rechner', // 78 impr., 1 clicks
  'kraft-umrechner', // 97 impr., 0 clicks
  'kraftstoffverbrauch-rechner', // 69 impr., 0 clicks
  'kreisrechner', // 124 impr., 0 clicks
  'kubikwurzel-rechner', // 83 impr., 0 clicks
  'lebensmittelbudget-rechner', // 65 impr., 0 clicks
  'lebenszeit-in-stunden', // 162 impr., 7 clicks
  'leistung-umrechner', // 306 impr., 0 clicks
  'lkw-maut-deutschland-rechner', // 348 impr., 0 clicks
  'marmelade-geliermittel-rechner', // 302 impr., 1 clicks
  'mieterhoehung-rechner', // 56 impr., 0 clicks
  'minijob-rechner', // 134 impr., 0 clicks (via old URL /minijob-midijob-rechner/)
  'modulo-rechner', // 77 impr., 0 clicks
  'netto-brutto-rechner', // 51 impr., 0 clicks
  'notar-grundbuch-kosten-rechner', // 65 impr., 0 clicks
  'nudeln-rohmaerk-gewicht-rechner', // 1432 impr., 3 clicks
  'oelheizung-verbrauch-rechner', // 1847 impr., 0 clicks
  'pelletheizung-verbrauch-rechner', // 121 impr., 0 clicks
  'pendlerpauschale-rechner', // 68 impr., 0 clicks
  'photovoltaik-amortisation-rechner', // 57 impr., 0 clicks
  'pizza-teig-rechner', // 61 impr., 0 clicks
  'promillerechner', // 257 impr., 0 clicks
  'promillerechner-widmark', // 141 impr., 0 clicks
  'quadratwurzel-rechner', // 100 impr., 0 clicks
  'quersumme-rechner', // 131 impr., 0 clicks
  'ratenkreditrechner', // 80 impr., 0 clicks (via old URL /privatkredit-rechner/); 52 impr., 0 clicks
  'regenwasser-zisterne-rechner', // 58 impr., 0 clicks
  'sabbatical-rechner', // 56 impr., 2 clicks
  'salz-lake-poekel-rechner', // 89 impr., 0 clicks
  'schalungssteine-rechner', // 455 impr., 11 clicks
  'schritt-distanz-kalorien-rechner', // 121 impr., 0 clicks
  'schuhe-kleidergroessen-umrechner', // 82 impr., 0 clicks
  'schwimmen-kalorienverbrauch-rechner', // 202 impr., 0 clicks
  'spritkostenrechner', // 330 impr., 0 clicks
  'spuelmaschine-kosten-rechner', // 87 impr., 0 clicks
  'stromkosten-geraete-rechner', // 59 impr., 0 clicks
  'stromkostenrechner', // 110 impr., 0 clicks
  'stundensatz-kalkulation-freiberufler-rechner', // 53 impr., 0 clicks (via old URL /brutto-stundensatz-freiberufler-rechner/)
  'tage-bis-weihnachten', // 101 impr., 0 clicks
  'tage-zwischen-zwei-daten', // 125 impr., 0 clicks (via old URL /kalendertage-rechner/)
  'teiler-vielfache-rechner', // 78 impr., 0 clicks
  'tilgungsrechner', // 82 impr., 0 clicks
  'treppen-stufen-rechner', // 69 impr., 0 clicks
  'unterhalt-volljaehrige-kinder-rechner', // 58 impr., 0 clicks
  'unterhaltsvorschuss-rechner', // 73 impr., 0 clicks
  'verdopplungszeit-rechner', // 52 impr., 0 clicks
  'viskositaet-umrechner', // 114 impr., 0 clicks
  'volumen-umrechner', // 53 impr., 0 clicks
  'waist-to-hip-ratio-rechner', // 57 impr., 0 clicks
  'waschmaschine-kosten-rechner', // 56 impr., 0 clicks
  'wasser-reis-verhaeltnis-rechner', // 220 impr., 1 clicks
  'wasserverbrauch-haushalt-rechner', // 428 impr., 0 clicks
  'zehnerpotenzen-rechner', // 272 impr., 1 clicks
  'zoll-in-cm-rechner', // 633 impr., 0 clicks
  'zucker-ersatz-rechner', // 1632 impr., 4 clicks
  'zwischenfinanzierung-rechner', // 130 impr., 0 clicks
  'zykluslaenge-eisprung-rechner', // 172 impr., 0 clicks
  'zylinderrechner', // 71 impr., 0 clicks
];

/** Hand-verified pages (sources checked Oct 2026, protected by their own regression tests). */
const HAND_VERIFIED_CORE = [
  'duesseldorfer-tabelle-rechner',
  'unterhaltsvorschuss-rechner',
  'unterhalt-volljaehrige-kinder-rechner',
  'ausbildungsunterhalt-bedarfskontrollbetrag-rechner',
  'kapitalertragsteuer-rechner',
  'warmmiete-rechner',
  'kalorienbedarf-rechner',
  'tage-zwischen-zwei-daten',
  'tage-bis-weihnachten',
  'co2-strom-rechner',
  'co2-pendeln-rechner',
  'co2-preis-rechner',
  'co2-auto-rechner',
  'co2-abgabe-vermieter-mieter-rechner',
  'heizkostenvergleich-rechner',
];

export const INDEXABLE_CALCULATOR_SLUGS: ReadonlySet<string> = new Set([...BY_SEARCH_DEMAND, ...HAND_VERIFIED_CORE]);

export function isCalculatorIndexable(slug: string): boolean {
  return INDEXABLE_CALCULATOR_SLUGS.has(slug);
}
