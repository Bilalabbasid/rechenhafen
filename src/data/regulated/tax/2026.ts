import { TaxYearConfig } from './types';
import { LEGAL_VALUES_2026 } from '@/legal/de/2026';

/**
 * Steuerliche und sozialversicherungsrechtliche Rechengrößen für Deutschland 2026.
 * Gespeist aus dem zentralen Rechtswerte-Modul src/legal/de/.
 */
export const TAX_CONFIG_2026: TaxYearConfig = {
  year: 2026,
  effectiveFrom: LEGAL_VALUES_2026.grundfreibetrag.validFrom,
  source: 'Bundesfinanzministerium (BMF) / Bundesministerium für Arbeit und Soziales (BMAS)',
  sourceUrl: 'https://www.bundesfinanzministerium.de',
  lastVerified: LEGAL_VALUES_2026.grundfreibetrag.checkedAt,

  // Einkommensteuertarif 2026 (§ 32a Abs. 1 EStG)
  grundfreibetrag: LEGAL_VALUES_2026.grundfreibetrag.value,
  zone2Limit: LEGAL_VALUES_2026.zone2Limit.value,
  zone3Limit: LEGAL_VALUES_2026.zone3Limit.value,
  zone4Limit: LEGAL_VALUES_2026.zone4Limit.value,
  zone5Limit: LEGAL_VALUES_2026.zone5Limit.value,

  // Formel-Parameter (§ 32a Abs. 1 EStG 2026)
  zone2Coeff: LEGAL_VALUES_2026.zone2Coeff.value,
  zone2Base: LEGAL_VALUES_2026.zone2Base.value,
  zone3Coeff: LEGAL_VALUES_2026.zone3Coeff.value,
  zone3Base: LEGAL_VALUES_2026.zone3Base.value,
  zone3Offset: LEGAL_VALUES_2026.zone3Offset.value,
  zone4Rate: LEGAL_VALUES_2026.zone4Rate.value,
  zone4Offset: LEGAL_VALUES_2026.zone4Offset.value,
  zone5Rate: LEGAL_VALUES_2026.zone5Rate.value,
  zone5Offset: LEGAL_VALUES_2026.zone5Offset.value,

  // Solidaritätszuschlag 2026
  solzFreigrenzeSingle: LEGAL_VALUES_2026.solzFreigrenzeSingle.value,
  solzFreigrenzeMarried: LEGAL_VALUES_2026.solzFreigrenzeMarried.value,
  solzRate: LEGAL_VALUES_2026.solzRate.value,
  solzMilderungRate: LEGAL_VALUES_2026.solzMilderungRate.value,

  // Freibeträge & Kindergeld 2026
  kinderfreibetragGesamt: LEGAL_VALUES_2026.kinderfreibetragGesamt.value,
  kindergeldMonat: LEGAL_VALUES_2026.kindergeldMonat.value,

  // Sozialversicherung Beitragsbemessungsgrenzen 2026
  bbgRentenversicherungMonat: LEGAL_VALUES_2026.bbgRentenversicherungMonat.value,
  bbgRentenversicherungJahr: LEGAL_VALUES_2026.bbgRentenversicherungJahr.value,
  bbgKrankenversicherungMonat: LEGAL_VALUES_2026.bbgKrankenversicherungMonat.value,
  bbgKrankenversicherungJahr: LEGAL_VALUES_2026.bbgKrankenversicherungJahr.value,
  jaegKrankenversicherungMonat: LEGAL_VALUES_2026.jaegKrankenversicherungMonat.value,
  jaegKrankenversicherungJahr: LEGAL_VALUES_2026.jaegKrankenversicherungJahr.value,

  // Sozialversicherung Beitragssätze 2026
  beitragssatzRentenversicherung: LEGAL_VALUES_2026.beitragssatzRentenversicherung.value,
  beitragssatzArbeitslosenversicherung: LEGAL_VALUES_2026.beitragssatzArbeitslosenversicherung.value,
  beitragssatzKrankenversicherungAllgemein: LEGAL_VALUES_2026.beitragssatzKrankenversicherungAllgemein.value,
  zusatzbeitragKrankenversicherungDurchschnitt: LEGAL_VALUES_2026.zusatzbeitragKrankenversicherungDurchschnitt.value,
  beitragssatzPflegeversicherung: LEGAL_VALUES_2026.beitragssatzPflegeversicherung.value,
  pflegeZuschlagKinderlos: LEGAL_VALUES_2026.pflegeZuschlagKinderlos.value,
  pflegeAbschlagKind: LEGAL_VALUES_2026.pflegeAbschlagKind.value,

  pflegeSachsenAnteilAN: LEGAL_VALUES_2026.pflegeSachsenAnteilAN.value,
  pflegeSachsenAnteilAG: LEGAL_VALUES_2026.pflegeSachsenAnteilAG.value,

  // Minijob & Midijob 2026
  minijobGrenze: LEGAL_VALUES_2026.minijobGrenze.value,
  midijobObergrenze: LEGAL_VALUES_2026.midijobObergrenze.value,
  midijobFaktorF: LEGAL_VALUES_2026.midijobFaktorF.value,

  // Arbeitgeber-Umlagen
  umlageU1: LEGAL_VALUES_2026.umlageU1.value,
  umlageU2: LEGAL_VALUES_2026.umlageU2.value,
  umlageU3Insolvenzgeld: LEGAL_VALUES_2026.umlageU3Insolvenzgeld.value,
  berufsgenossenschaftDurchschnitt: LEGAL_VALUES_2026.berufsgenossenschaftDurchschnitt.value,

  // Gewerbliche Minijobs 2026
  minijobPauschaleKv: LEGAL_VALUES_2026.minijobPauschaleKv.value,
  minijobPauschaleRv: LEGAL_VALUES_2026.minijobPauschaleRv.value,
  minijobPauschsteuer: LEGAL_VALUES_2026.minijobPauschsteuer.value,
  minijobRvEigenanteil: LEGAL_VALUES_2026.minijobRvEigenanteil.value,
  minijobUmlageU1: LEGAL_VALUES_2026.minijobUmlageU1.value,
  minijobUmlageU2: LEGAL_VALUES_2026.minijobUmlageU2.value,
  minijobInsolvenzgeldumlage: LEGAL_VALUES_2026.minijobInsolvenzgeldumlage.value,
};
