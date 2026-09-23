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
    lastVerified: '2026-01-15',
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
    lastVerified: '2026-01-15',
    nextReviewDate: '2026-10-15',
    sourceAuthority: 'Minijob-Zentrale / BMAS',
    sourceUrl: 'https://www.minijob-zentrale.de',
    configFile: 'src/data/regulated/tax/2026.ts',
    keyParameters: ['Minijob-Grenze', 'Midijob-Gleitzone', 'Faktor F'],
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
