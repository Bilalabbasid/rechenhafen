/**
 * generate-seo-map.ts
 * ---------------------------------------------------------------------------
 * Generates src/data/seo-map.json — the central SEO keyword map.
 *
 * METHODOLOGY
 * -----------
 * 1. Primary/secondary/long-tail keywords are derived from the existing
 *    searchKeywords arrays plus editorial enrichment based on German market
 *    research (Sep 2026).
 * 2. Tier classification (1–5) is based on:
 *    - Qualitative SERP signals from Ahrefs blog, SimilarWeb, SEMrush public
 *      content, and direct Google search observation (Sep 2026).
 *    - YMYL classification (Google Your Money/Your Life policy).
 *    - Number of established competitors in the German market.
 *    - Category importance in German online search behaviour.
 * 3. Volume/KD/CPC are ALL NOT VERIFIED (no paid tool subscription used).
 *    Only qualitative SERP signals are recorded.
 * 4. Cannibalization risks documented for pages with overlapping intents.
 * 5. A seoGaps section lists HIGH-PRIORITY missing calculators whose primary
 *    keywords are not served by any existing page.
 *
 * TIER DEFINITIONS
 * ----------------
 * Tier 1: Very high volume (est. 50k+/mo DE), very high competition.
 *         Dominant players: banks, government, established portals.
 * Tier 2: High volume (est. 10k–50k/mo DE), high-moderate competition.
 *         Winnable with strong content + topical depth.
 * Tier 3: Medium volume (est. 2k–10k/mo DE), moderate competition.
 * Tier 4: Lower volume (est. 500–2k/mo DE), low-moderate competition.
 * Tier 5: Long-tail (est. <500/mo DE), minimal competition.
 */

import fs from 'fs';
import path from 'path';
import { ALL_CALCULATORS } from '../src/data/calculators';
import { CATEGORIES } from '../src/data/categories';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SerpSignal {
  tier: 1 | 2 | 3 | 4 | 5;
  intent: 'transactional' | 'informational' | 'navigational' | 'mixed';
  serpType: 'calculator' | 'article' | 'government' | 'commercial' | 'comparison' | 'mixed';
  ymyl: boolean;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  longtailKeywords?: string[];
  questionKeywords?: string[];
  serpCompetitors?: string[];
  cannibalizationRisk?: string;
  seoNotes?: string;
  volumeDeMonthlyEstimate: 'NOT VERIFIED' | string;
  volumeSource?: string;
  kd: 'NOT VERIFIED' | string;
  cpcEur: 'NOT VERIFIED' | string;
}

// ---------------------------------------------------------------------------
// Manual SERP signals — sourced from public Ahrefs blog, SimilarWeb,
// Google search observations (Sep 2026). See seo-research-notes.md.
// ---------------------------------------------------------------------------
const MANUAL_SIGNALS: Record<string, SerpSignal> = {

  // =========================================================================
  // KREDIT & SCHULDEN — Tier 1
  // =========================================================================
  'kreditrechner': {
    tier: 1,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: true,
    primaryKeyword: 'kreditrechner',
    secondaryKeywords: ['kredit berechnen', 'ratenkredit rechner', 'darlehensrechner'],
    longtailKeywords: [
      'kreditrechner monatliche rate',
      'kredit 10000 euro monatliche rate berechnen',
      'privatkredit rechner',
      'autokredit rechner',
      'kleinkreditrechner',
    ],
    questionKeywords: [
      'wie hoch ist die monatliche rate bei 10000 euro kredit',
      'wie berechnet man die kreditrate',
      'welchen kredit kann ich mir leisten',
    ],
    serpCompetitors: ['verivox.de', 'check24.de', 'ing.de', 'dkb.de', 'smava.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
    seoNotes: 'Dominated by banks and comparison portals with high affiliate CPC budgets. YMYL — very high competition. Target long-tail loan amounts/durations. Key differentiator: Gesamtzinsbelastung anzeigen.',
  },
  'tilgungsrechner': {
    tier: 1,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: true,
    primaryKeyword: 'tilgungsrechner',
    secondaryKeywords: ['tilgungsplan rechner', 'hypothek tilgung berechnen', 'baufinanzierung rechner'],
    longtailKeywords: [
      'tilgungsrechner mit sondertilgung',
      'tilgungsplan erstellen',
      'tilgungsrechner immobilienkredit',
      'tilgung berechnen hypothek',
      'tilgungsrate berechnen',
    ],
    questionKeywords: [
      'wie hoch sollte die tilgung bei einem immobilienkredit sein',
      'wie lange dauert tilgung bei 1 prozent',
      'was ist eine angemessene tilgung',
    ],
    serpCompetitors: ['drklein.de', 'interhyp.de', 'sparkasse.de', 'ing.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
    seoNotes: 'Key differentiator: Sondertilgung modelling, annual repayment schedule download. YMYL — accuracy critical.',
  },

  // =========================================================================
  // MATHEMATIK — Tier 1
  // =========================================================================
  'prozentrechner': {
    tier: 1,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'prozentrechner',
    secondaryKeywords: ['prozent berechnen', 'prozentwert rechner', 'prozentwert grundwert prozentsatz'],
    longtailKeywords: [
      'prozent von prozent rechner',
      'prozentuale änderung berechnen',
      'rabatt prozent rechner',
      'wie viel prozent sind x von y',
      'prozentwert aus grundwert und prozentsatz',
    ],
    questionKeywords: [
      'wie berechne ich prozent',
      'wie viel prozent sind 15 von 60',
      'wie rechnet man prozentwert aus',
    ],
    serpCompetitors: ['smart-rechner.de', 'rechneronline.de', 'matheretter.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
    seoNotes: 'Evergreen high-volume query. Differentiate with all 3 calculation directions (Prozentwert, Grundwert, Prozentsatz) in one page.',
  },

  // =========================================================================
  // BUSINESS — Tier 1
  // =========================================================================
  'mwst-rechner': {
    tier: 1,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'mehrwertsteuer rechner',
    secondaryKeywords: ['mwst rechner', 'umsatzsteuer rechner', 'ust rechner'],
    longtailKeywords: [
      'mehrwertsteuer berechnen 19 prozent',
      'mehrwertsteuer herausrechnen',
      'mwst 7 prozent rechner',
      'netto in brutto umrechnen',
      'brutto in netto umrechnen mehrwertsteuer',
    ],
    questionKeywords: [
      'wie berechnet man die mehrwertsteuer',
      'wie viel mehrwertsteuer auf 100 euro',
      'wie berechnet man netto aus brutto',
    ],
    serpCompetitors: ['smart-rechner.de', 'finanztip.de', 'lexware.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
    seoNotes: 'High professional intent. Freelancers, SMEs, e-commerce. Toggle 19%/7%/custom is key differentiator.',
  },

  // =========================================================================
  // FINANZEN — Tier 1/2
  // =========================================================================
  'zinseszinsrechner': {
    tier: 1,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: true,
    primaryKeyword: 'zinseszins rechner',
    secondaryKeywords: ['zinseszins berechnen', 'zinseszinsrechner online', 'kapitalwachstum rechner'],
    longtailKeywords: [
      'zinseszins rechner mit einzahlung',
      'zinseszins monatlich berechnen',
      'zinseszins etf rechner',
      'zinseszinsrechner 10 jahre',
      'wie viel wird aus 10000 euro in 10 jahren',
    ],
    questionKeywords: [
      'was ist zinseszins',
      'wie funktioniert zinseszins',
      'wie viel wird aus 10000 euro in 20 jahren',
    ],
    serpCompetitors: ['finanzfluss.de', 'zinsguru.de', 'finanztip.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
    seoNotes: 'Primary investment/savings intent. Key differentiator: chart visualisation, monthly contributions modelling.',
  },
  'sparrechner': {
    tier: 2,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: true,
    primaryKeyword: 'sparrechner',
    secondaryKeywords: ['sparplan rechner', 'ersparnisse berechnen', 'monatlich sparen rechner'],
    longtailKeywords: ['sparrechner mit zinseszins', 'wie viel muss ich sparen', '10 jahre sparen rechner'],
    questionKeywords: ['wie viel muss ich monatlich sparen um x euro zu erreichen'],
    serpCompetitors: ['finanzfluss.de', 'tagesgeldvergleich.net', 'finanztip.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
    cannibalizationRisk: 'zinseszinsrechner — intent overlap; differentiate: sparrechner=monthly savings goal, zinseszinsrechner=compound growth visualisation',
  },
  'etf-sparplan-rechner': {
    tier: 2,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: true,
    primaryKeyword: 'etf sparplan rechner',
    secondaryKeywords: ['etf rechner', 'etf rendite rechner', 'sparplan rechner etf'],
    longtailKeywords: [
      'etf sparplan rechner 30 jahre',
      'etf rechner mit kosten',
      'etf sparplan monatlich rechner',
      'wie viel etf monatlich sparen',
    ],
    questionKeywords: [
      'wie viel werde ich mit einem etf sparplan verdienen',
      'lohnt sich ein etf sparplan',
    ],
    serpCompetitors: ['finanzfluss.de', 'finanztip.de', 'justetf.com'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },
  'inflationsrechner': {
    tier: 2,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'inflationsrechner',
    secondaryKeywords: ['inflation rechner', 'kaufkraftverlust rechner', 'inflation berechnen'],
    longtailKeywords: ['inflationsrechner 2024 2025', 'kaufkraftverlust euro berechnen', 'was hat x damals gekostet rechner'],
    questionKeywords: ['wie viel kaufkraft habe ich noch', 'wie berechnet man den kaufkraftverlust'],
    serpCompetitors: ['destatis.de', 'bundesbank.de', 'finanztip.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },
  'rentenluecke-rechner': {
    tier: 2,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: true,
    primaryKeyword: 'rentenlücke rechner',
    secondaryKeywords: ['altersvorsorge rechner', 'vorsorgebedarf berechnen', 'rente berechnen'],
    longtailKeywords: ['rentenlücke berechnen online', 'wie groß ist meine rentenlücke', 'altersrente berechnen netto'],
    questionKeywords: ['wie hoch ist meine rentenlücke', 'wie viel muss ich für die rente vorsorgen'],
    serpCompetitors: ['drv.de', 'finanztip.de', 'dvag.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },

  // =========================================================================
  // GESUNDHEIT & FITNESS — Tier 1/2
  // =========================================================================
  'bmi-rechner': {
    tier: 1,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: true,
    primaryKeyword: 'bmi rechner',
    secondaryKeywords: ['body mass index rechner', 'bmi berechnen', 'bmi rechner erwachsene'],
    longtailKeywords: [
      'bmi rechner frau',
      'bmi rechner mann',
      'bmi rechner kind',
      'normalgewicht berechnen',
      'idealgewicht und bmi rechner',
    ],
    questionKeywords: [
      'was ist ein normaler bmi',
      'wie berechne ich meinen bmi',
      'ab wann ist man übergewichtig bmi',
    ],
    serpCompetitors: ['aok.de', 'barmer.de', 'netdoktor.de', 'gesundheit.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
    seoNotes: 'YMYL health. Dominated by statutory health insurers (Krankenkassen) with extremely high domain authority. Differentiate with age-adjusted interpretation, children mode.',
  },
  'kalorienbedarf-rechner': {
    tier: 1,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: true,
    primaryKeyword: 'kalorienbedarf rechner',
    secondaryKeywords: ['kalorienrechner', 'kalorien berechnen', 'grundumsatz rechner', 'tdee rechner'],
    longtailKeywords: [
      'kalorienbedarf rechner frau',
      'täglichen kalorienbedarf berechnen',
      'kalorienbedarf berechnen abnehmen',
      'wie viele kalorien brauche ich täglich',
      'grundumsatz berechnen mifflin',
    ],
    questionKeywords: [
      'wie viele kalorien brauche ich am tag',
      'wie berechnet man den kalorienbedarf',
      'wie viele kalorien zum abnehmen',
    ],
    serpCompetitors: ['barmer.de', 'netdoktor.de', 'fddb.info', 'myfitnesspal.com'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
    cannibalizationRisk: 'bmi-rechner — related health tools; differentiate: BMI=weight classification, Kalorienbedarf=daily energy needs',
  },
  'idealgewicht-rechner': {
    tier: 2,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: true,
    primaryKeyword: 'idealgewicht rechner',
    secondaryKeywords: ['normalgewicht berechnen', 'sollgewicht rechner', 'wunschgewicht rechner'],
    longtailKeywords: [
      'idealgewicht frau rechner',
      'idealgewicht mann rechner',
      'wie viel sollte ich wiegen',
      'idealgewicht nach broca',
    ],
    questionKeywords: ['was ist mein idealgewicht', 'wie berechnet man das idealgewicht'],
    serpCompetitors: ['aok.de', 'netdoktor.de', 'barmer.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
    cannibalizationRisk: 'bmi-rechner — intent overlap; differentiate: BMI=index/category, Idealgewicht=specific target weight',
  },

  // =========================================================================
  // AUTO & VERKEHR — Tier 2
  // =========================================================================
  'kfz-steuer-rechner': {
    tier: 2,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'kfz steuer rechner',
    secondaryKeywords: ['kraftfahrzeugsteuer berechnen', 'autosteuer rechner'],
    longtailKeywords: [
      'kfz steuer rechner 2026',
      'kfz steuer diesel rechner',
      'kfz steuer elektroauto berechnen',
      'kfz steuer nach hubraum berechnen',
    ],
    questionKeywords: [
      'wie hoch ist meine kfz steuer',
      'wie wird kfz steuer berechnet',
      'kfz steuer elektroauto wie viel',
    ],
    serpCompetitors: ['check24.de', 'verivox.de', 'kfz-steuer.de', 'adac.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },
  'spritkosten-rechner': {
    tier: 2,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'spritkosten rechner',
    secondaryKeywords: ['kraftstoffkosten berechnen', 'benzinkosten rechner', 'fahrtkosten rechner'],
    longtailKeywords: [
      'spritkosten rechner strecke',
      'spritkosten pro km berechnen',
      'fahrtkosten diesel rechner',
      'spritkosten pro 100 km',
    ],
    questionKeywords: [
      'wie viel kostet eine fahrt x km',
      'wie berechne ich die spritkosten',
    ],
    serpCompetitors: ['autoscout24.de', 'spritmonitor.de', 'spritkostenrechner.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
    cannibalizationRisk: 'spritverbrauch-rechner — differentiate: spritkosten=trip cost, spritverbrauch=efficiency measurement',
  },
  'spritverbrauch-rechner': {
    tier: 2,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'spritverbrauch rechner',
    secondaryKeywords: ['kraftstoffverbrauch berechnen', 'verbrauch l 100 km rechner'],
    longtailKeywords: [
      'spritverbrauch berechnen diesel',
      'durchschnittsverbrauch auto rechner',
      'wie berechne ich den verbrauch',
    ],
    questionKeywords: ['wie berechne ich den spritverbrauch meines autos'],
    serpCompetitors: ['spritmonitor.de', 'autoscout24.de', 'adac.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
    cannibalizationRisk: 'spritkosten-rechner — related; spritverbrauch=L/100km efficiency, spritkosten=Euros for a journey',
  },

  // =========================================================================
  // ARBEIT & GEHALT — Tier 2
  // =========================================================================
  'stundenlohnrechner': {
    tier: 2,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: true,
    primaryKeyword: 'stundenlohn rechner',
    secondaryKeywords: ['monatslohn in stundenlohn', 'stundensatz berechnen'],
    longtailKeywords: [
      'stundenlohn aus monatsgehalt berechnen',
      'jahresgehalt in stundenlohn',
      'mindestlohn stunden rechner',
    ],
    questionKeywords: ['wie berechnet man den stundenlohn', 'wie viel pro stunde bei 2000 euro monatlich'],
    serpCompetitors: ['rechneronline.de', 'smart-rechner.de', 'finanztip.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },
  'kurzarbeitergeld-rechner': {
    tier: 2,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: true,
    primaryKeyword: 'kurzarbeitergeld rechner',
    secondaryKeywords: ['kug rechner', 'kurzarbeit berechnen', 'kurzarbeitergeld berechnen'],
    longtailKeywords: ['kurzarbeitergeld rechner 2026', 'wie hoch ist kurzarbeitergeld', 'kug 60 67 prozent rechner'],
    questionKeywords: ['wie viel kurzarbeitergeld bekomme ich', 'wie berechnet sich kurzarbeitergeld'],
    serpCompetitors: ['bundesagentur-fuer-arbeit.de', 'finanztip.de', 'lohnsteuer.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
    seoNotes: 'Demand spikes during economic downturns / short-time work legislation changes.',
  },
  'urlaubstage-rechner': {
    tier: 2,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'urlaubstage rechner',
    secondaryKeywords: ['urlaubsanspruch rechner', 'jahresurlaub berechnen', 'urlaub teilzeit rechner'],
    longtailKeywords: ['urlaubsanspruch bei kündigung rechner', 'urlaubstage bei teilzeit berechnen'],
    questionKeywords: ['wie viele urlaubstage habe ich anspruch', 'wie berechnet man urlaub bei teilzeit'],
    serpCompetitors: ['arbeitsrechte.de', 'finanztip.de', 'anwalt.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },

  // =========================================================================
  // DATUM & ZEIT — Tier 2/3
  // =========================================================================
  'altersrechner': {
    tier: 2,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'altersrechner',
    secondaryKeywords: ['alter berechnen', 'wie alt bin ich', 'geburtsdatum rechner'],
    longtailKeywords: [
      'alter in tagen berechnen',
      'genaues alter in jahren monaten tagen',
      'altersrechner mit geburtszeit',
    ],
    questionKeywords: ['wie alt bin ich heute', 'wie berechnet man das genaue alter'],
    serpCompetitors: ['rechneronline.de', 'smart-rechner.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },
  'arbeitstage-rechner': {
    tier: 2,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'arbeitstage rechner',
    secondaryKeywords: ['werktage berechnen', 'arbeitstage zwischen zwei daten'],
    longtailKeywords: [
      'arbeitstage 2026 deutschland',
      'urlaub arbeitstage rechner',
      'werktage rechner nrw',
      'arbeitstage berechnen mit feiertagen',
    ],
    questionKeywords: ['wie viele arbeitstage hat 2026', 'wie viele werktage zwischen datum'],
    serpCompetitors: ['arbeitstage.net', 'smart-rechner.de', 'rechneronline.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },

  // =========================================================================
  // EINHEITEN — Tier 2/3
  // =========================================================================
  'laengen-umrechner': {
    tier: 2,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'längenumrechner',
    secondaryKeywords: ['längen umrechnen', 'cm in meter umrechnen', 'einheiten umrechner länge'],
    longtailKeywords: ['meilen in km rechner', 'yard in meter', 'zoll in cm rechner'],
    questionKeywords: ['wie viele cm sind ein zoll', 'wie viele meter sind eine meile'],
    serpCompetitors: ['unitconverters.net', 'rechneronline.de', 'smart-rechner.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },
  'temperatur-umrechner': {
    tier: 2,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'temperatur umrechner',
    secondaryKeywords: ['celsius fahrenheit umrechner', 'celsius in fahrenheit'],
    longtailKeywords: [
      '100 fahrenheit in celsius',
      '37 grad celsius in fahrenheit',
      'kelvin in celsius umrechner',
    ],
    questionKeywords: ['wie viel celsius sind 72 fahrenheit', 'wie rechne ich fahrenheit in celsius um'],
    serpCompetitors: ['rechneronline.de', 'unitconverters.net', 'smart-rechner.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },
  'zoll-in-cm-rechner': {
    tier: 3,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'zoll in cm',
    secondaryKeywords: ['inch in cm', 'zoll umrechner', 'zoll zentimeter rechner'],
    longtailKeywords: ['65 zoll in cm', '75 zoll in cm', '32 zoll in cm tv', '55 zoll in cm'],
    questionKeywords: ['wie viele cm sind x zoll', 'wie groß ist 65 zoll in cm'],
    serpCompetitors: ['rechneronline.de', 'smart-rechner.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
    seoNotes: 'High long-tail potential for TV screen size queries in Germany.',
  },

  // =========================================================================
  // HAUSHALT & ENERGIE — Tier 2
  // =========================================================================
  'energiekostenrechner': {
    tier: 2,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'stromkosten rechner',
    secondaryKeywords: ['energiekosten rechner', 'strom verbrauch kosten berechnen'],
    longtailKeywords: [
      'stromkosten gerät berechnen',
      'wie viel strom verbraucht kühlschrank pro jahr',
      'stromkosten im monat rechner',
      'strom kwh kosten berechnen',
    ],
    questionKeywords: ['wie viel kostet 1 kwh strom', 'wie hoch sind meine stromkosten'],
    serpCompetitors: ['verivox.de', 'check24.de', 'stromvergleich.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },

  // =========================================================================
  // WOHNEN & IMMOBILIEN — Tier 2
  // =========================================================================
  'kaufnebenkosten-rechner': {
    tier: 2,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: true,
    primaryKeyword: 'kaufnebenkosten rechner',
    secondaryKeywords: ['nebenkosten beim hauskauf berechnen', 'grunderwerbsteuer rechner'],
    longtailKeywords: [
      'kaufnebenkosten haus rechner',
      'welche nebenkosten beim hauskauf',
      'notar kosten rechner hauskauf',
      'hauskauf nebenkosten berechnen',
    ],
    questionKeywords: [
      'wie hoch sind die kaufnebenkosten',
      'wie viel notar beim hauskauf',
      'wie viel prozent kaufnebenkosten',
    ],
    serpCompetitors: ['drklein.de', 'interhyp.de', 'sparkasse.de', 'immobilienscout24.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },
  'immobilienrendite-rechner': {
    tier: 2,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: true,
    primaryKeyword: 'immobilienrendite rechner',
    secondaryKeywords: ['mietrendite rechner', 'rendite immobilien berechnen', 'bruttomietrendite rechner'],
    longtailKeywords: [
      'nettomietrendite rechner',
      'eigenkapitalrendite immobilien berechnen',
      'ist die immobilie rentabel rechner',
    ],
    questionKeywords: [
      'wie berechnet man die rendite einer immobilie',
      'was ist eine gute mietrendite',
    ],
    serpCompetitors: ['immobilienscout24.de', 'immowelt.de', 'finanztip.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },

  // =========================================================================
  // STATISTIK & WISSENSCHAFT — Tier 3/4
  // =========================================================================
  'notendurchschnitt-rechner': {
    tier: 2,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'notendurchschnitt rechner',
    secondaryKeywords: ['noten berechnen', 'zeugnisnote berechnen', 'notenschnitt berechnen'],
    longtailKeywords: [
      'notendurchschnitt abitur rechner',
      'abschlussnote berechnen',
      'gewichteter notendurchschnitt rechner',
      'nc berechnen',
    ],
    questionKeywords: ['wie berechnet man den notendurchschnitt', 'wie wird die abschlussnote berechnet'],
    serpCompetitors: ['notenrechner.net', 'rechneronline.de', 'matheretter.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },
  'standardabweichung-rechner': {
    tier: 4,
    intent: 'informational',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'standardabweichung rechner',
    secondaryKeywords: ['standardabweichung berechnen', 'varianz rechner'],
    longtailKeywords: ['standardabweichung online berechnen', 'standardabweichung formel beispiel'],
    questionKeywords: ['wie berechnet man standardabweichung', 'was ist die standardabweichung'],
    serpCompetitors: ['rechneronline.de', 'statista.com', 'matheretter.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },

  // =========================================================================
  // BUSINESS — Tier 2/3
  // =========================================================================
  'roi-rechner': {
    tier: 2,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'roi rechner',
    secondaryKeywords: ['return on investment rechner', 'rendite berechnen investition'],
    longtailKeywords: [
      'roi berechnen marketing',
      'roi rechner investition',
      'roi formel beispiel online',
    ],
    questionKeywords: ['wie berechnet man den roi', 'was ist ein guter roi'],
    serpCompetitors: ['finanztip.de', 'gruendung.de', 'lexware.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },
  'break-even-rechner': {
    tier: 3,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'break even rechner',
    secondaryKeywords: ['gewinnschwelle rechner', 'break even analyse'],
    longtailKeywords: [
      'break even point berechnen',
      'break even rechner online',
      'gewinnschwelle formel rechner',
    ],
    questionKeywords: ['was ist der break even point', 'wie berechnet man den break even'],
    serpCompetitors: ['gruendung.de', 'ikhk.de', 'lexware.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },
  'marge-rechner': {
    tier: 3,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'margenrechner',
    secondaryKeywords: ['marge berechnen', 'handelsspanne rechner', 'aufschlag vs marge'],
    longtailKeywords: ['marge und aufschlag rechner', 'deckungsbeitragsmarge berechnen'],
    questionKeywords: ['wie berechnet man die marge', 'was ist der unterschied zwischen marge und aufschlag'],
    serpCompetitors: ['gruendung.de', 'lexware.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },
  'brutto-stundensatz-freiberufler-rechner': {
    tier: 3,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'stundensatz rechner freiberufler',
    secondaryKeywords: ['stundensatz berechnen selbstständig', 'honorar berechnen freiberufler'],
    longtailKeywords: [
      'stundensatz freelancer berechnen',
      'wie hoch soll mein stundensatz sein',
      'stundensatz kalkulation vorlage',
    ],
    questionKeywords: ['wie berechne ich meinen stundensatz als freiberufler'],
    serpCompetitors: ['freiberufler.de', 'freelancermap.de', 'lexware.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },

  // =========================================================================
  // MATHEMATIK — Tier 3
  // =========================================================================
  'dreisatzrechner': {
    tier: 3,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'dreisatz rechner',
    secondaryKeywords: ['dreisatz berechnen', 'direkter dreisatz rechner'],
    longtailKeywords: ['indirekter dreisatz rechner', 'dreisatz aufgaben löser', 'proportionaler dreisatz'],
    questionKeywords: ['wie löse ich einen dreisatz', 'wie berechnet man dreisatz'],
    serpCompetitors: ['rechneronline.de', 'matheretter.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },
  'pythagoras-rechner': {
    tier: 3,
    intent: 'informational',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'pythagoras rechner',
    secondaryKeywords: ['satz des pythagoras berechnen', 'hypotenuse rechner'],
    longtailKeywords: ['pythagoras formel rechner online', 'hypotenuse aus katheten berechnen'],
    questionKeywords: ['wie berechnet man den satz des pythagoras', 'pythagoras formel anwenden'],
    serpCompetitors: ['rechneronline.de', 'matheretter.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },

  // =========================================================================
  // GEOMETRIE — Tier 3/4
  // =========================================================================
  'kreisrechner': {
    tier: 3,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'kreisrechner',
    secondaryKeywords: ['kreisfläche berechnen', 'kreisumfang berechnen', 'radius berechnen kreis'],
    longtailKeywords: ['kreis fläche umfang rechner', 'kreisradius aus umfang berechnen'],
    questionKeywords: ['wie berechnet man die kreisfläche', 'wie berechnet man den kreisumfang'],
    serpCompetitors: ['rechneronline.de', 'matheretter.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
    cannibalizationRisk: 'kreis-umfang-rechner — merge or clearly differentiate (Kreisrechner = all-in-one; Kreisumfang = just circumference)',
  },

  // =========================================================================
  // KOCHEN & BACKEN — Tier 3/4
  // =========================================================================
  'portionsrechner': {
    tier: 3,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'portionsrechner rezept',
    secondaryKeywords: ['rezept umrechnen portionen', 'zutaten berechnen portionen'],
    longtailKeywords: ['rezept auf x portionen umrechnen', 'mengenangaben rezept anpassen'],
    questionKeywords: ['wie rechne ich ein rezept für mehr personen um'],
    serpCompetitors: ['chefkoch.de', 'lecker.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },
  'backform-umrechner': {
    tier: 4,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'backform umrechner',
    secondaryKeywords: ['backform größe umrechnen', 'springform umrechner'],
    longtailKeywords: ['backform rund auf eckig umrechnen', '26 auf 20 cm backform umrechnen'],
    questionKeywords: ['wie rechne ich eine runde in eine eckige backform um'],
    serpCompetitors: ['chefkoch.de', 'kuechengoetter.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },
  'cups-in-gramm-rechner': {
    tier: 4,
    intent: 'transactional',
    serpType: 'calculator',
    ymyl: false,
    primaryKeyword: 'cups in gramm',
    secondaryKeywords: ['amerikanische maße umrechnen', '1 cup in gramm'],
    longtailKeywords: ['1 cup mehl in gramm', '1 cup zucker in gramm', 'cups umrechner deutsch'],
    questionKeywords: ['wie viel gramm sind ein cup'],
    serpCompetitors: ['chefkoch.de', 'springlane.de', 'lecker.de'],
    volumeDeMonthlyEstimate: 'NOT VERIFIED',
    kd: 'NOT VERIFIED',
    cpcEur: 'NOT VERIFIED',
  },
};

// ---------------------------------------------------------------------------
// Cannibalization risk pairs (slug → competing slugs)
// ---------------------------------------------------------------------------
const CANNIBALIZATION_MAP: Record<string, string[]> = {
  'kreditrechner': ['ratenkreditrechner', 'autokreditrechner', 'privatkredit-rechner'],
  'ratenkreditrechner': ['kreditrechner', 'autokreditrechner'],
  'autokreditrechner': ['kreditrechner', 'autokredit-rechner'],
  'autokredit-rechner': ['autokreditrechner'],
  'sparrechner': ['zinseszinsrechner', 'etf-sparplan-rechner', 'sparzielrechner', 'sparziel-rechner'],
  'sparzielrechner': ['sparrechner', 'sparziel-rechner'],
  'sparziel-rechner': ['sparzielrechner'],
  'zinseszinsrechner': ['sparrechner'],
  'spritkosten-rechner': ['spritverbrauch-rechner'],
  'spritverbrauch-rechner': ['spritkosten-rechner'],
  'bmi-rechner': ['idealgewicht-rechner'],
  'idealgewicht-rechner': ['bmi-rechner'],
  'kalorienbedarf-rechner': ['bmi-rechner'],
  'standardabweichung-rechner': ['varianz-standardabweichung-stichprobe-rechner'],
  'varianz-standardabweichung-stichprobe-rechner': ['standardabweichung-rechner'],
  'kreisrechner': ['kreis-umfang-rechner'],
  'kreis-umfang-rechner': ['kreisrechner'],
  'kaufkraftverlust-rechner': ['inflationsrechner'],
  'inflationsrechner': ['kaufkraftverlust-rechner'],
  'brutto-stundensatz-freiberufler-rechner': ['stundenlohnrechner'],
};

// ---------------------------------------------------------------------------
// Tier/intent defaults by actual category slug
// ---------------------------------------------------------------------------
function defaultTierByCategory(category: string): 1 | 2 | 3 | 4 | 5 {
  const map: Record<string, 1 | 2 | 3 | 4 | 5> = {
    'arbeit-gehalt': 2,
    'auto-verkehr': 3,
    'bauen-renovieren': 3,
    'business': 3,
    'datum-zeit': 3,
    'einheiten': 3,
    'familie-schwangerschaft': 3,
    'finanzen': 2,
    'geometrie': 4,
    'gesundheit-fitness': 3,
    'haushalt-energie': 3,
    'kochen-backen': 4,
    'kredit-schulden': 2,
    'mathematik': 3,
    'statistik-wissenschaft': 4,
    'wohnen-immobilien': 3,
  };
  return map[category] ?? 4;
}

function defaultIntent(category: string): 'transactional' | 'informational' | 'mixed' {
  return ['statistik-wissenschaft', 'geometrie'].includes(category)
    ? 'informational'
    : 'transactional';
}

function ymylByCategory(category: string): boolean {
  return ['arbeit-gehalt', 'finanzen', 'kredit-schulden', 'wohnen-immobilien', 'gesundheit-fitness', 'familie-schwangerschaft'].includes(category);
}

// ---------------------------------------------------------------------------
// Build keyword map
// ---------------------------------------------------------------------------
const calculatorMap = ALL_CALCULATORS.map(calc => {
  const override = MANUAL_SIGNALS[calc.slug];
  const cat = CATEGORIES.find(c => c.slug === calc.category);
  const existing: string[] = calc.searchKeywords || [];
  const primary = override?.primaryKeyword ?? (existing[0] ?? calc.slug.replace(/-/g, ' '));
  const secondary = override?.secondaryKeywords ?? existing.slice(1, 4);
  const longtail = override?.longtailKeywords ?? existing.slice(4);
  const questions = override?.questionKeywords ?? [];
  const cannibalizes = CANNIBALIZATION_MAP[calc.slug] ?? [];

  return {
    slug: calc.slug,
    name: calc.name,
    url: `/rechner/${calc.slug}/`,
    category: calc.category,
    categoryName: cat?.name ?? calc.category,
    tier: override?.tier ?? defaultTierByCategory(calc.category),
    intent: override?.intent ?? defaultIntent(calc.category),
    serpType: override?.serpType ?? 'calculator',
    ymyl: override?.ymyl ?? ymylByCategory(calc.category),
    primaryKeyword: primary,
    secondaryKeywords: secondary,
    longtailKeywords: longtail,
    questionKeywords: questions,
    allKeywords: [...new Set([primary, ...secondary, ...longtail, ...questions, ...existing])].filter(Boolean),
    serpCompetitors: override?.serpCompetitors ?? [],
    volumeDeMonthlyEstimate: override?.volumeDeMonthlyEstimate ?? 'NOT VERIFIED',
    volumeSource: override?.volumeSource ?? null,
    kd: override?.kd ?? 'NOT VERIFIED',
    cpcEur: override?.cpcEur ?? 'NOT VERIFIED',
    cannibalizationRisk: cannibalizes.length > 0 ? cannibalizes : null,
    cannibalizationNote: override?.cannibalizationRisk ?? null,
    seoNotes: override?.seoNotes ?? null,
  };
});

// ---------------------------------------------------------------------------
// Keyword overlap detection (automated cannibalization check)
// ---------------------------------------------------------------------------
const kwToSlugs: Record<string, string[]> = {};
for (const entry of calculatorMap) {
  for (const kw of entry.allKeywords) {
    const norm = kw.toLowerCase().trim();
    if (!norm) continue;
    if (!kwToSlugs[norm]) kwToSlugs[norm] = [];
    if (!kwToSlugs[norm].includes(entry.slug)) kwToSlugs[norm].push(entry.slug);
  }
}
const autoDetectedOverlaps = Object.entries(kwToSlugs)
  .filter(([, slugs]) => slugs.length > 1)
  .map(([keyword, competingPages]) => ({ keyword, competingPages }))
  .sort((a, b) => b.competingPages.length - a.competingPages.length);

// ---------------------------------------------------------------------------
// SEO Gaps — high-priority missing calculators
// ---------------------------------------------------------------------------
const SEO_GAPS = [
  {
    priority: 'CRITICAL',
    missingCalculator: 'Brutto-Netto-Rechner (Gehaltsrechner)',
    suggestedSlug: 'brutto-netto-rechner',
    suggestedCategory: 'arbeit-gehalt',
    primaryKeyword: 'brutto netto rechner',
    rationale: 'The most searched German financial calculator. Top competitor brutto-netto-rechner.info reportedly receives ~1.5M monthly visits (source: Ahrefs blog, 2024 — NOT VERIFIED independently). Requires live 2026 tax/SV data. Without this page, RechenHafen.de cannot compete for the most valuable single query in the German calculator market.',
    competitors: ['brutto-netto-rechner.info', 'nettolohn.de', 'finanztip.de', 'bmf-steuerrechner.de'],
  },
  {
    priority: 'CRITICAL',
    missingCalculator: 'Lohnsteuerrechner',
    suggestedSlug: 'lohnsteuer-rechner',
    suggestedCategory: 'arbeit-gehalt',
    primaryKeyword: 'lohnsteuerrechner',
    rationale: 'Closely related to Brutto-Netto but focused on the Lohnsteuer component specifically. High search volume. Could be built as a dedicated view of the same engine or a separate page.',
    competitors: ['bmf-steuerrechner.de', 'lohnsteuer.de'],
  },
  {
    priority: 'HIGH',
    missingCalculator: 'Einkommensteuerrechner',
    suggestedSlug: 'einkommensteuer-rechner',
    suggestedCategory: 'arbeit-gehalt',
    primaryKeyword: 'einkommensteuer rechner',
    rationale: 'Distinct from Lohnsteuer (includes self-employed, capital income). Very high YMYL authority query.',
    competitors: ['bmf-steuerrechner.de', 'finanztip.de', 'steuertipps.de'],
  },
  {
    priority: 'HIGH',
    missingCalculator: 'Einfacher Zinsrechner (Einfache Zinsen)',
    suggestedSlug: 'zinsrechner',
    suggestedCategory: 'finanzen',
    primaryKeyword: 'zinsrechner',
    rationale: 'Simple interest calculator (not compound). Distinct intent from zinseszinsrechner. Many users want to calculate bank/savings interest without compounding. Currently not served — creates gap and potential missing long-tail traffic.',
    competitors: ['finanztip.de', 'finanzfluss.de'],
  },
  {
    priority: 'MEDIUM',
    missingCalculator: 'Rentenrechner (Gesetzliche Rente)',
    suggestedSlug: 'rentenrechner',
    suggestedCategory: 'arbeit-gehalt',
    primaryKeyword: 'rentenrechner',
    rationale: 'High volume query. Site has rentenlücke-rechner but not a straightforward pension estimate calculator.',
    competitors: ['drv.de', 'finanztip.de'],
  },
  {
    priority: 'MEDIUM',
    missingCalculator: 'Pendlerpauschale-Rechner',
    suggestedSlug: 'pendlerpauschale-rechner',
    suggestedCategory: 'arbeit-gehalt',
    primaryKeyword: 'pendlerpauschale rechner',
    rationale: 'Very common query especially around tax return season. Site has no commuter/travel cost deduction calculator.',
    competitors: ['finanzfluss.de', 'lexware.de', 'steuertipps.de'],
  },
];

// ---------------------------------------------------------------------------
// Assemble output
// ---------------------------------------------------------------------------
const output = {
  meta: {
    title: 'RechenHafen.de – Zentraler SEO-Keyword-Plan',
    generated: new Date().toISOString().split('T')[0],
    version: '1.1.0',
    totalCalculators: calculatorMap.length,
    target: 'Deutschland · Google · Deutsch',
    methodology: [
      'Tier-Klassifikation basierend auf qualitativen SERP-Signalen aus Ahrefs-Blog, SimilarWeb-Publiziertem, SEMrush-Public-Content und direkten Google-Beobachtungen (Sep 2026).',
      'Primär-/Sekundär-Keywords aus bestehenden searchKeywords-Arrays plus redaktioneller Anreicherung.',
      'Long-tail-Keywords aus bekannten Nutzerintentionsmustern des deutschen Marktes abgeleitet.',
      'Alle Volumen/KD/CPC-Metriken sind NICHT VERIFIZIERT — kein bezahltes Tool-Abonnement wurde verwendet.',
      'Kanibalisierungsrisiken durch semantische Intent-Überschneidungsanalyse identifiziert.',
    ],
    dataSources: [
      { source: 'Ahrefs Blog (öffentlich, Sep 2026)', note: '~1,5 Mio. monatliche Besuche bei brutto-netto-rechner.info zitiert — NICHT unabhängig verifiziert.' },
      { source: 'Google-Suche / SERP-Beobachtung (Sep 2026)', note: 'Qualitative Wettbewerbsbeobachtung.' },
      { source: 'Google Trends (qualitativ, Sep 2026)', note: 'Nur relative Interesse-Trends, keine absoluten Zahlen.' },
      { source: 'SimilarWeb / SEMrush öffentliche Artikel', note: 'Keine API-Abfrage, nur publizierte Inhalte.' },
    ],
    WICHTIGER_HINWEIS: 'ALLE volumeDeMonthlyEstimate-, kd- und cpcEur-Felder sind "NOT VERIFIED". Diese Datei ist ein qualitativer Ausgangspunkt. Vor der Strategieentscheidung bitte mit Google Keyword Planner, Ahrefs oder SEMrush (Zielmarkt: Deutschland) verifizieren.',
  },
  tierDefinitions: {
    '1': { label: 'Tier 1 – Sehr hohes Volumen', volumeEstimate: 'Est. 50.000+/Monat DE', serpDifficulty: 'Sehr hoch (KD 70+)', description: 'Dominiert von Banken, Versicherungen, Behörden und großen Portalen. Nur mit ausgezeichneter Qualität, Vertrauenssignalen und Backlink-Profil wettbewerbsfähig.' },
    '2': { label: 'Tier 2 – Hohes Volumen', volumeEstimate: 'Est. 10.000–50.000/Monat DE', serpDifficulty: 'Hoch (KD 50–70)', description: 'Wettbewerbsfähig mit guter Inhaltsqualität, technischer Exzellenz und topischer Tiefe.' },
    '3': { label: 'Tier 3 – Mittleres Volumen', volumeEstimate: 'Est. 2.000–10.000/Monat DE', serpDifficulty: 'Mittel (KD 30–50)', description: 'Gute Opportunität mit fokussiertem Content.' },
    '4': { label: 'Tier 4 – Niedrigeres Volumen', volumeEstimate: 'Est. 500–2.000/Monat DE', serpDifficulty: 'Niedrig (KD 15–30)', description: 'Nischen-Autorität. Trägt zu topischer Vollständigkeit und E-E-A-T bei.' },
    '5': { label: 'Tier 5 – Long-Tail', volumeEstimate: 'Est. <500/Monat DE', serpDifficulty: 'Sehr niedrig (KD <15)', description: 'Minimaler Wettbewerb. Topische Vollständigkeit; stärkt Cluster-Autorität.' },
  },
  seoGaps: SEO_GAPS,
  cannibalizationRisks: {
    description: 'Keyword-Überschneidungen, die zu Kannibalisierung führen können. Jede Seite sollte einen klar differenzierten primären Intent bedienen.',
    manuallyIdentified: Object.entries(CANNIBALIZATION_MAP).map(([slug, competing]) => ({ slug, competing })),
    autoDetected: autoDetectedOverlaps,
  },
  keywordMap: calculatorMap,
};

// ---------------------------------------------------------------------------
// Write output
// ---------------------------------------------------------------------------
const outPath = path.join(process.cwd(), 'src', 'data', 'seo-map.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');

// Summary
const tierCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
for (const e of calculatorMap) tierCounts[e.tier] = (tierCounts[e.tier] || 0) + 1;

const tier1Slugs = calculatorMap.filter(e => e.tier === 1).map(e => e.slug);

console.log('=== SEO Keyword Map Generated ===');
console.log(`Output: ${outPath}`);
console.log(`Dateigröße: ${(fs.statSync(outPath).size / 1024).toFixed(1)} KB`);
console.log(`Gesamt Rechner: ${calculatorMap.length}`);
console.log('\nTier-Verteilung:');
for (const [t, c] of Object.entries(tierCounts)) console.log(`  Tier ${t}: ${c} Rechner`);
console.log('\nTier 1 Rechner:', tier1Slugs.join(', '));
console.log(`\nKannibalisierungsrisiken (auto): ${autoDetectedOverlaps.length}`);
console.log(`SEO-Lücken (fehlende Rechner): ${SEO_GAPS.length}`);
console.log('\n⚠️  WICHTIG: Alle Volumen/KD/CPC-Angaben sind NOT VERIFIED.');
console.log('Bitte mit Ahrefs, SEMrush oder Google Keyword Planner (Zielmarkt: Deutschland) verifizieren.');
