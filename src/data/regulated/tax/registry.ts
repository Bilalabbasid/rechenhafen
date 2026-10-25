/**
 * Wartungsregister für regulierte deutsche Steuer- und Gehaltsparameter
 * Ermöglicht die jährliche Überprüfung und Aktualisierung für RechenHafen.
 */

export interface RegulatedMaintenanceItem {
  id: string;
  category: 'tax' | 'social_security' | 'statutory_wage' | 'indirect_tax';
  name: string;
  currentYear: number;
  lastVerified: string;
  nextReviewDate: string;
  sourceAuthority: string;
  sourceUrl: string;
  configFile: string;
  keyParameters: string[];
}

export const REGULATED_TAX_REGISTRY: RegulatedMaintenanceItem[] = [
  {
    id: 'estg-32a',
    category: 'tax',
    name: 'Einkommensteuertarif (§ 32a EStG)',
    currentYear: 2026,
    lastVerified: '2026-01-15',
    nextReviewDate: '2026-11-01',
    sourceAuthority: 'Bundesministerium der Finanzen (BMF)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    configFile: 'src/data/regulated/tax/2026.ts',
    keyParameters: ['Grundfreibetrag', 'Progressionszonen 1 & 2', 'Spitzensteuersatz', 'Reichensteuer'],
  },
  {
    id: 'solzg-3-4',
    category: 'tax',
    name: 'Solidaritätszuschlag (§ 3, § 4 SolzG)',
    currentYear: 2026,
    lastVerified: '2026-10-25', // Freigrenze 20.350 € / 40.700 € (BGBl. 2024 I Nr. 449)
    nextReviewDate: '2026-11-01',
    sourceAuthority: 'Bundesministerium der Finanzen (BMF)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    configFile: 'src/data/regulated/tax/2026.ts',
    keyParameters: ['Freigrenze Single/Verheiratet', 'Milderungszone 11,9%'],
  },
  {
    id: 'sgb-bbg',
    category: 'social_security',
    name: 'Beitragsbemessungsgrenzen (Sozialversicherungs-Rechengrößenverordnung)',
    currentYear: 2026,
    lastVerified: '2026-01-15',
    nextReviewDate: '2026-10-15',
    sourceAuthority: 'Bundesministerium für Arbeit und Soziales (BMAS)',
    sourceUrl: 'https://www.bmas.de',
    configFile: 'src/data/regulated/tax/2026.ts',
    keyParameters: ['BBG Rentenversicherung', 'BBG Krankenversicherung', 'JAEG'],
  },
  {
    id: 'minijob-midijob',
    category: 'statutory_wage',
    name: 'Geringfügigkeits- und Übergangsbereich (§ 8, § 20 SGB IV)',
    currentYear: 2026,
    lastVerified: '2026-10-25',
    nextReviewDate: '2026-12-01', // 2027: Mindestlohn 14,60 € → Minijob-Grenze 633 €, neuer Faktor F
    sourceAuthority: 'Minijob-Zentrale / BMAS',
    sourceUrl: 'https://www.minijob-zentrale.de',
    configFile: 'src/data/regulated/tax/2026.ts',
    keyParameters: ['Minijob-Grenze', 'Midijob-Gleitzone', 'Faktor F', 'Minijob-Umlagen U1/U2/Insolvenzgeldumlage'],
  },
  {
    id: 'gkv-zusatzbeitrag',
    category: 'social_security',
    name: 'Durchschnittlicher Zusatzbeitragssatz der GKV (§ 242a SGB V)',
    currentYear: 2026,
    lastVerified: '2026-10-25', // 2,9 %, BMG-Bekanntmachung vom 07.11.2025, BAnz AT 10.11.2025 B7
    nextReviewDate: '2026-11-15', // Bekanntmachung für 2027 nach dem Schätzerkreis im Oktober
    sourceAuthority: 'Bundesministerium für Gesundheit (BMG)',
    sourceUrl: 'https://www.bundesanzeiger.de/pub/publication/oUJYVk8GYRXybnb9Y4h/content/oUJYVk8GYRXybnb9Y4h/BAnz%20AT%2010.11.2025%20B7.pdf',
    configFile: 'src/data/regulated/tax/2026.ts',
    keyParameters: ['Ø-Zusatzbeitrag', 'Gesamtsozialversicherungsbeitragssatz (Basis Faktor F)'],
  },
  {
    id: 'kindergeld-kinderfreibetrag',
    category: 'tax',
    name: 'Kindergeld und Kinderfreibetrag (§ 66, § 32 Abs. 6 EStG)',
    currentYear: 2026,
    lastVerified: '2026-10-25', // 259 € / 9.756 € (Steuerfortentwicklungsgesetz, BGBl. 2024 I Nr. 449)
    nextReviewDate: '2026-12-01',
    sourceAuthority: 'Bundeszentralamt für Steuern (BZSt) / Familienkasse der Bundesagentur für Arbeit',
    sourceUrl: 'https://www.arbeitsagentur.de/familie-und-kinder',
    configFile: 'src/data/regulated/tax/2026.ts',
    keyParameters: ['Kindergeld je Kind', 'Kinderfreibetrag + BEA'],
  },
  {
    id: 'umlagen',
    category: 'social_security',
    name: 'Insolvenzgeldumlage (§ 360 SGB III)',
    currentYear: 2026,
    lastVerified: '2026-10-25', // 0,15 %, keine abweichende Verordnung nach § 361 SGB III für 2026
    nextReviewDate: '2026-12-01',
    sourceAuthority: 'Bundesministerium für Arbeit und Soziales (BMAS)',
    sourceUrl: 'https://www.gesetze-im-internet.de/sgb_3/__360.html',
    configFile: 'src/data/regulated/tax/2026.ts',
    keyParameters: ['Insolvenzgeldumlage'],
  },
  {
    id: 'pflege-kinder',
    category: 'social_security',
    name: 'Pflegeversicherung Kinder-Staffelung (PUEG / § 55 SGB XI)',
    currentYear: 2026,
    lastVerified: '2026-01-15',
    nextReviewDate: '2026-11-01',
    sourceAuthority: 'GKV-Spitzenverband / BMG',
    sourceUrl: 'https://www.bundesgesundheitsministerium.de',
    configFile: 'src/data/regulated/tax/2026.ts',
    keyParameters: ['Kinderlosenzuschlag 0,6%', 'Kinderabschläge je 0,25%', 'Sachsen-Verteilung'],
  },
  {
    id: 'ustg-12',
    category: 'indirect_tax',
    name: 'Umsatzsteuersätze (§ 12 UStG)',
    currentYear: 2026,
    lastVerified: '2026-01-15',
    nextReviewDate: '2026-12-01',
    sourceAuthority: 'Bundesministerium der Finanzen (BMF)',
    sourceUrl: 'https://www.gesetze-im-internet.de/ustg_1980/__12.html',
    configFile: 'src/data/regulated/tax/2026.ts',
    keyParameters: ['Regulär 19%', 'Ermäßigt 7%'],
  },
];
