import { TaxYearConfig } from './types';
import { LEGAL_VALUES_2025 } from '@/legal/de/2025';

/**
 * Steuerliche und sozialversicherungsrechtliche Rechengrößen für Deutschland 2025.
 * Gespeist aus dem zentralen Rechtswerte-Modul src/legal/de/.
 */
export const TAX_CONFIG_2025: TaxYearConfig = {
  year: 2025,
  effectiveFrom: LEGAL_VALUES_2025.grundfreibetrag.validFrom,
  source: 'Bundesministerium der Finanzen (BMF) / BMAS',
  sourceUrl: 'https://www.bundesfinanzministerium.de',
  lastVerified: LEGAL_VALUES_2025.grundfreibetrag.checkedAt,

  // Einkommensteuertarif 2025 (§ 32a Abs. 1 EStG)
  grundfreibetrag: LEGAL_VALUES_2025.grundfreibetrag.value,
  zone2Limit: LEGAL_VALUES_2025.zone2Limit.value,
  zone3Limit: LEGAL_VALUES_2025.zone3Limit.value,
  zone4Limit: LEGAL_VALUES_2025.zone4Limit.value,
  zone5Limit: LEGAL_VALUES_2025.zone5Limit.value,

  // § 32a Abs. 1 EStG 2025 Formel-Parameter
  zone2Coeff: LEGAL_VALUES_2025.zone2Coeff.value,
  zone2Base: LEGAL_VALUES_2025.zone2Base.value,
  zone3Coeff: LEGAL_VALUES_2025.zone3Coeff.value,
  zone3Base: LEGAL_VALUES_2025.zone3Base.value,
  zone3Offset: LEGAL_VALUES_2025.zone3Offset.value,
  zone4Rate: LEGAL_VALUES_2025.zone4Rate.value,
  zone4Offset: LEGAL_VALUES_2025.zone4Offset.value,
  zone5Rate: LEGAL_VALUES_2025.zone5Rate.value,
  zone5Offset: LEGAL_VALUES_2025.zone5Offset.value,

  // Solidaritätszuschlag 2025
  solzFreigrenzeSingle: LEGAL_VALUES_2025.solzFreigrenzeSingle.value,
  solzFreigrenzeMarried: LEGAL_VALUES_2025.solzFreigrenzeMarried.value,
  solzRate: LEGAL_VALUES_2025.solzRate.value,
  solzMilderungRate: LEGAL_VALUES_2025.solzMilderungRate.value,

  // Freibeträge & Kindergeld
  kinderfreibetragGesamt: LEGAL_VALUES_2025.kinderfreibetragGesamt.value,
  kindergeldMonat: LEGAL_VALUES_2025.kindergeldMonat.value,

  // Sozialversicherung Beitragsbemessungsgrenzen 2025
  bbgRentenversicherungMonat: LEGAL_VALUES_2025.bbgRentenversicherungMonat.value,
  bbgRentenversicherungJahr: LEGAL_VALUES_2025.bbgRentenversicherungJahr.value,
  bbgKrankenversicherungMonat: LEGAL_VALUES_2025.bbgKrankenversicherungMonat.value,
  bbgKrankenversicherungJahr: LEGAL_VALUES_2025.bbgKrankenversicherungJahr.value,
  jaegKrankenversicherungMonat: LEGAL_VALUES_2025.jaegKrankenversicherungMonat.value,
  jaegKrankenversicherungJahr: LEGAL_VALUES_2025.jaegKrankenversicherungJahr.value,

  // Sozialversicherung Beitragssätze 2025
  beitragssatzRentenversicherung: LEGAL_VALUES_2025.beitragssatzRentenversicherung.value,
  beitragssatzArbeitslosenversicherung: LEGAL_VALUES_2025.beitragssatzArbeitslosenversicherung.value,
  beitragssatzKrankenversicherungAllgemein: LEGAL_VALUES_2025.beitragssatzKrankenversicherungAllgemein.value,
  zusatzbeitragKrankenversicherungDurchschnitt: LEGAL_VALUES_2025.zusatzbeitragKrankenversicherungDurchschnitt.value,
  beitragssatzPflegeversicherung: LEGAL_VALUES_2025.beitragssatzPflegeversicherung.value,
  pflegeZuschlagKinderlos: LEGAL_VALUES_2025.pflegeZuschlagKinderlos.value,
  pflegeAbschlagKind: LEGAL_VALUES_2025.pflegeAbschlagKind.value,

  pflegeSachsenAnteilAN: LEGAL_VALUES_2025.pflegeSachsenAnteilAN.value,
  pflegeSachsenAnteilAG: LEGAL_VALUES_2025.pflegeSachsenAnteilAG.value,

  // Minijob & Midijob 2025
  minijobGrenze: LEGAL_VALUES_2025.minijobGrenze.value,
  midijobObergrenze: LEGAL_VALUES_2025.midijobObergrenze.value,
  midijobFaktorF: LEGAL_VALUES_2025.midijobFaktorF.value,

  // Arbeitgeber-Umlagen
  umlageU1: LEGAL_VALUES_2025.umlageU1.value,
  umlageU2: LEGAL_VALUES_2025.umlageU2.value,
  umlageU3Insolvenzgeld: LEGAL_VALUES_2025.umlageU3Insolvenzgeld.value,
  berufsgenossenschaftDurchschnitt: LEGAL_VALUES_2025.berufsgenossenschaftDurchschnitt.value,

  // Gewerbliche Minijobs 2025
  minijobPauschaleKv: LEGAL_VALUES_2025.minijobPauschaleKv.value,
  minijobPauschaleRv: LEGAL_VALUES_2025.minijobPauschaleRv.value,
  minijobPauschsteuer: LEGAL_VALUES_2025.minijobPauschsteuer.value,
  minijobRvEigenanteil: LEGAL_VALUES_2025.minijobRvEigenanteil.value,
  minijobUmlageU1: LEGAL_VALUES_2025.minijobUmlageU1.value,
  minijobUmlageU2: LEGAL_VALUES_2025.minijobUmlageU2.value,
  minijobInsolvenzgeldumlage: LEGAL_VALUES_2025.minijobInsolvenzgeldumlage.value,
};
