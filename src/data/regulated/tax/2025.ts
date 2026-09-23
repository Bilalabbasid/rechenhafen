import { TaxYearConfig } from './types';

/**
 * Offizielle steuerliche und sozialversicherungsrechtliche Rechengrößen für Deutschland 2025
 * Quellen:
 * - Gesetz zur steuerlichen Freistellung des Existenzminimums 2024 / Steuerfortentwicklungsgesetz
 * - § 32a Einkommensteuergesetz (EStG) Veranlagungszeitraum 2025
 * - Sozialversicherungs-Rechengrößenverordnung 2025 (BGBl.)
 * - Solidaritätszuschlaggesetz (§ 3, § 4 SolzG)
 */
export const TAX_CONFIG_2025: TaxYearConfig = {
  year: 2025,
  effectiveFrom: '2025-01-01',
  source: 'Bundesministerium der Finanzen (BMF) / BMAS',
  sourceUrl: 'https://www.bundesfinanzministerium.de',
  lastVerified: '2025-01-15',

  // Einkommensteuertarif 2025 (§ 32a Abs. 1 EStG)
  grundfreibetrag: 12096,
  zone2Limit: 17443,
  zone3Limit: 68480,
  zone4Limit: 277825,
  zone5Limit: 277826,

  // § 32a Abs. 1 EStG 2025 Formel-Parameter:
  // Zone 2 (12.097 bis 17.443 €): (932,30 * y + 1.400) * y
  zone2Coeff: 932.30,
  zone2Base: 1400,
  // Zone 3 (17.444 bis 68.480 €): (176,64 * z + 2.397) * z + 1.015,13
  zone3Coeff: 176.64,
  zone3Base: 2397,
  zone3Offset: 1015.13,
  // Zone 4 (68.481 bis 277.825 €): 0,42 * zvE - 10.911,92
  zone4Rate: 0.42,
  zone4Offset: 10911.92,
  // Zone 5 (ab 277.826 €): 0,45 * zvE - 19.246,67
  zone5Rate: 0.45,
  zone5Offset: 19246.67,

  // Solidaritätszuschlag 2025
  solzFreigrenzeSingle: 18720,
  solzFreigrenzeMarried: 37440,
  solzRate: 0.055,
  solzMilderungRate: 0.119,

  // Freibeträge & Kindergeld
  kinderfreibetragGesamt: 9540, // 6.612 € Kinderfreibetrag + 2.928 € BEA-Freibetrag
  kindergeldMonat: 255,

  // Sozialversicherung Beitragsbemessungsgrenzen 2025 (bundeseinheitlich)
  bbgRentenversicherungMonat: 8050.00,
  bbgRentenversicherungJahr: 96600.00,
  bbgKrankenversicherungMonat: 5512.50,
  bbgKrankenversicherungJahr: 66150.00,
  jaegKrankenversicherungMonat: 6150.00,
  jaegKrankenversicherungJahr: 73800.00,

  // Sozialversicherung Beitragssätze 2025
  beitragssatzRentenversicherung: 0.186, // 18,6 % (AN 9,3 %, AG 9,3 %)
  beitragssatzArbeitslosenversicherung: 0.026, // 2,6 % (AN 1,3 %, AG 1,3 %)
  beitragssatzKrankenversicherungAllgemein: 0.146, // 14,6 % (AN 7,3 %, AG 7,3 %)
  zusatzbeitragKrankenversicherungDurchschnitt: 0.025, // 2,5 % (AN 1,25 %, AG 1,25 %)
  beitragssatzPflegeversicherung: 0.036, // 3,6 % (Standard)
  pflegeZuschlagKinderlos: 0.006, // 0,6 % (AN allein)
  pflegeAbschlagKind: 0.0025, // 0,25 % pro Kind ab 2. bis 5. Kind

  pflegeSachsenAnteilAN: 0.023, // 2,3 % in Sachsen
  pflegeSachsenAnteilAG: 0.013, // 1,3 % in Sachsen

  // Minijob & Midijob 2025
  minijobGrenze: 538.00,
  midijobObergrenze: 2000.00,
  midijobFaktorF: 0.6865, // Gesetzlicher Faktor F nach § 20 Abs. 2 SGB IV für 2025

  // Arbeitgeber-Umlagen (Standard-Schätzwerte für 2025)
  umlageU1: 0.011, // ca. 1,1 %
  umlageU2: 0.0035, // 0,35 % Mutterschutz
  umlageU3Insolvenzgeld: 0.0006, // 0,06 %
  berufsgenossenschaftDurchschnitt: 0.013, // 1,3 %
};
