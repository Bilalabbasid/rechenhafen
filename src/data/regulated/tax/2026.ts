import { TaxYearConfig } from './types';

/**
 * Offizielle steuerliche und sozialversicherungsrechtliche Rechengrößen für Deutschland 2026
 * Quellen:
 * - Gesetz zur steuerlichen Freistellung des Existenzminimums / Steuerfortentwicklungsgesetz (BGBl.)
 * - § 32a Einkommensteuergesetz (EStG) Veranlagungszeitraum 2026
 * - Sozialversicherungs-Rechengrößenverordnung 2026 (BMAS)
 * - Solidaritätszuschlaggesetz (§ 3, § 4 SolzG)
 */
export const TAX_CONFIG_2026: TaxYearConfig = {
  year: 2026,
  effectiveFrom: '2026-01-01',
  source: 'Bundesfinanzministerium (BMF) / Bundesministerium für Arbeit und Soziales (BMAS)',
  sourceUrl: 'https://www.bundesfinanzministerium.de',
  lastVerified: '2026-01-15',

  // Einkommensteuertarif 2026 (§ 32a Abs. 1 EStG)
  grundfreibetrag: 12348,
  zone2Limit: 17799,
  zone3Limit: 69878,
  zone4Limit: 277825,
  zone5Limit: 277826,

  // § 32a Abs. 1 EStG 2026 Formel-Parameter:
  // Zone 2 (12.349 bis 17.799 €): (914,51 * y + 1.400) * y
  zone2Coeff: 914.51,
  zone2Base: 1400,
  // Zone 3 (17.800 bis 69.878 €): (173,10 * z + 2.397) * z + 1.034,87
  zone3Coeff: 173.10,
  zone3Base: 2397,
  zone3Offset: 1034.87,
  // Zone 4 (69.879 bis 277.825 €): 0,42 * zvE - 11.135,63
  zone4Rate: 0.42,
  zone4Offset: 11135.63,
  // Zone 5 (ab 277.826 €): 0,45 * zvE - 19.470,38
  zone5Rate: 0.45,
  zone5Offset: 19470.38,

  // Solidaritätszuschlag 2026
  solzFreigrenzeSingle: 19100,
  solzFreigrenzeMarried: 38200,
  solzRate: 0.055,
  solzMilderungRate: 0.119,

  // Freibeträge & Kindergeld
  kinderfreibetragGesamt: 9756, // Angepasster Freibetrag 2026
  kindergeldMonat: 255,

  // Sozialversicherung Beitragsbemessungsgrenzen 2026 (bundeseinheitlich)
  bbgRentenversicherungMonat: 8450.00,
  bbgRentenversicherungJahr: 101400.00,
  bbgKrankenversicherungMonat: 5812.50,
  bbgKrankenversicherungJahr: 69750.00,
  jaegKrankenversicherungMonat: 6450.00,
  jaegKrankenversicherungJahr: 77400.00,

  // Sozialversicherung Beitragssätze 2026
  beitragssatzRentenversicherung: 0.186, // 18,6 % (AN 9,3 %, AG 9,3 %)
  beitragssatzArbeitslosenversicherung: 0.026, // 2,6 % (AN 1,3 %, AG 1,3 %)
  beitragssatzKrankenversicherungAllgemein: 0.146, // 14,6 % (AN 7,3 %, AG 7,3 %)
  zusatzbeitragKrankenversicherungDurchschnitt: 0.025, // 2,5 % (AN 1,25 %, AG 1,25 %)
  beitragssatzPflegeversicherung: 0.036, // 3,6 % (Standard)
  pflegeZuschlagKinderlos: 0.006, // 0,6 % (AN allein)
  pflegeAbschlagKind: 0.0025, // 0,25 % pro Kind ab 2. bis 5. Kind

  pflegeSachsenAnteilAN: 0.023, // 2,3 % in Sachsen
  pflegeSachsenAnteilAG: 0.013, // 1,3 % in Sachsen

  // Minijob & Midijob 2026
  minijobGrenze: 556.00,
  midijobObergrenze: 2000.00,
  midijobFaktorF: 0.6720, // Gesetzlicher Faktor F nach § 20 Abs. 2 SGB IV für 2026

  // Arbeitgeber-Umlagen (Standard-Schätzwerte für 2026)
  umlageU1: 0.011, // ca. 1,1 %
  umlageU2: 0.0035, // 0,35 % Mutterschutz
  umlageU3Insolvenzgeld: 0.0006, // 0,06 %
  berufsgenossenschaftDurchschnitt: 0.013, // 1,3 %
};
