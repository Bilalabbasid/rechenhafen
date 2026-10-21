/**
 * RechenHafen Shared, Versioned Emissions-Factor Registry
 * 
 * Sourced from official publications:
 * - Umweltbundesamt (UBA): Spezifische Treibhausgas-Emissionen des deutschen Strommix (März 2026 Schätzung für 2025)
 * - Umweltbundesamt (UBA): Vergleich der durchschnittlichen Emissionen einzelner Verkehrsmittel im Personenverkehr (Tremod 2024)
 * - Deutsche Emissionshandelsstelle (DEHSt) / Emissionsberichterstattungsverordnung (EBeV 2030)
 * - Brennstoffemissionshandelsgesetz (BEHG) & Kohlendioxidkostenaufteilungsgesetz (CO2KostAufG)
 */

export type EmissionBoundary = 
  | 'direct_combustion'  // Scope 1: Direkte Emissionen am Entstehungsort / Auspuff / Kessel
  | 'energy_generation'  // Scope 2: Emissionen der Energie- & Stromerzeugung im Inlandsnetz
  | 'lifecycle';          // Well-to-Wheel / Lebenszyklus: Inklusive Vorkette (Gewinnung, Transport, Infrastruktur)

export type EmissionGasType = 'CO2' | 'CO2e';

export type EmissionFactorStatus = 'estimated' | 'provisional' | 'final';

export interface EmissionFactor {
  key: string;
  name: string;
  value: number;
  unit: string;
  geographicCoverage: string;
  referenceYear: number;
  sourceUrl: string;
  sourcePublication: string;
  sourceSection: string;
  gasType: EmissionGasType;
  boundary: EmissionBoundary;
  status: EmissionFactorStatus;
  verificationDate: string;
  notes: string;
}

export const EMISSION_FACTORS: Record<string, EmissionFactor> = {
  // --- Strom (Elektrizität) ---
  strom_mix_de_generation_2025: {
    key: 'strom_mix_de_generation_2025',
    name: 'Deutscher Strommix 2025 (Erzeugung in Inlandskraftwerken)',
    value: 344, // g CO2/kWh
    unit: 'g/kWh',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2025,
    sourceUrl: 'https://www.umweltbundesamt.de/themen/co2-emissionen-pro-kilowattstunde-strom-2025-nur',
    sourcePublication: 'Umweltbundesamt (UBA): Entwicklung der spezifischen Treibhausgas-Emissionen des deutschen Strommix',
    sourceSection: 'Tabelle Strommix Deutschland vorläufige Schätzung 2025 (veröffentlicht März 2026)',
    gasType: 'CO2',
    boundary: 'energy_generation',
    status: 'estimated',
    verificationDate: '2026-03-15',
    notes: 'Reine direkte CO2-Emissionen der Stromerzeugung im deutschen Stromnetz ohne vorgelagerte Ketten. Nicht mit Lebenszyklus-CO2e verwechseln.',
  },
  strom_mix_de_lifecycle_2025: {
    key: 'strom_mix_de_lifecycle_2025',
    name: 'Deutscher Strommix 2025 (Lebenszyklus inkl. Vorkette)',
    value: 410, // g CO2e/kWh
    unit: 'g/kWh',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2025,
    sourceUrl: 'https://www.umweltbundesamt.de/themen/klima-energie/energieversorgung/strom-waermeversorgung-in-zahlen',
    sourcePublication: 'Umweltbundesamt (UBA) / GEMIS Datenbank',
    sourceSection: 'Lebenswegbilanz Strommix Deutschland',
    gasType: 'CO2e',
    boundary: 'lifecycle',
    status: 'estimated',
    verificationDate: '2026-03-15',
    notes: 'Enthält Vorketten der Brennstoffbereitstellung (Förderung, Raffinerie, Transport) und Leitungsverluste.',
  },
  strom_oekostrom_lifecycle: {
    key: 'strom_oekostrom_lifecycle',
    name: 'Ökostrom aus Neuanlagen (Lebenszyklus PV / Wind)',
    value: 25, // g CO2e/kWh
    unit: 'g/kWh',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2025,
    sourceUrl: 'https://www.umweltbundesamt.de/themen/klima-energie/erneuerbare-energien/erneuerbare-energien-in-zahlen',
    sourcePublication: 'Umweltbundesamt (UBA) GEMIS-Datensätze',
    sourceSection: 'Ökobilanzierung regenerativer Energieträger (Wind Onshore ca. 9–11 g, PV-Aufdach ca. 40–50 g)',
    gasType: 'CO2e',
    boundary: 'lifecycle',
    status: 'estimated',
    verificationDate: '2026-01-20',
    notes: 'Im Betrieb emissionsfrei (0 g direkte Verbrennung). Dieser Lebenszyklusfaktor bildet Herstellung, Installation, Wartung und Rückbau der Anlagen ab.',
  },

  // --- Personenverkehr & Pendeln (UBA Tremod 2024) ---
  verkehr_pkw_durchschnitt: {
    key: 'verkehr_pkw_durchschnitt',
    name: 'Pkw Durchschnitt (deutscher Flottenmix)',
    value: 164, // g CO2e / Pkm
    unit: 'g/Pkm',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2024,
    sourceUrl: 'https://www.umweltbundesamt.de/themen/verkehr/emissionsdaten',
    sourcePublication: 'Umweltbundesamt (UBA): Vergleich der durchschnittlichen Emissionen einzelner Verkehrsmittel im Personenverkehr',
    sourceSection: 'Tabelle Durchschnittswerte Personenverkehr (Tremod 2024)',
    gasType: 'CO2e',
    boundary: 'lifecycle',
    status: 'final',
    verificationDate: '2026-02-10',
    notes: 'Bereits bezogen auf einen durchschnittlichen Besetzungsgrad von ca. 1,4 bis 1,5 Personen pro Fahrzeug. Darf nicht nochmals durch die Insassen geteilt werden.',
  },
  verkehr_bahn_fernverkehr: {
    key: 'verkehr_bahn_fernverkehr',
    name: 'Eisenbahn Fernverkehr (ICE, IC)',
    value: 44, // g CO2e / Pkm
    unit: 'g/Pkm',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2024,
    sourceUrl: 'https://www.umweltbundesamt.de/themen/verkehr/emissionsdaten',
    sourcePublication: 'Umweltbundesamt (UBA): Tremod 2024',
    sourceSection: 'Fernverkehr Bahn Personenkilometer',
    gasType: 'CO2e',
    boundary: 'lifecycle',
    status: 'final',
    verificationDate: '2026-02-10',
    notes: 'Fährt im Fernverkehr der Deutschen Bahn mit zertifiziertem Bahnstrom aus 100% erneuerbaren Energien; die 44 g CO2e bilden Netzverluste, Bereitstellung und Fahrzeugherstellung ab.',
  },
  verkehr_bahn_nahverkehr: {
    key: 'verkehr_bahn_nahverkehr',
    name: 'Eisenbahn Nahverkehr (Regionalbahn, S-Bahn)',
    value: 79, // g CO2e / Pkm
    unit: 'g/Pkm',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2024,
    sourceUrl: 'https://www.umweltbundesamt.de/themen/verkehr/emissionsdaten',
    sourcePublication: 'Umweltbundesamt (UBA): Tremod 2024',
    sourceSection: 'Schienenpersonennahverkehr (SPNV)',
    gasType: 'CO2e',
    boundary: 'lifecycle',
    status: 'final',
    verificationDate: '2026-02-10',
    notes: 'Mix aus elektrischen Regionalzügen und Dieseltriebwagen im Nahverkehr.',
  },
  verkehr_linienbus: {
    key: 'verkehr_linienbus',
    name: 'Linienbus (ÖPNV Durchschnitt)',
    value: 108, // g CO2e / Pkm
    unit: 'g/Pkm',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2024,
    sourceUrl: 'https://www.umweltbundesamt.de/themen/verkehr/emissionsdaten',
    sourcePublication: 'Umweltbundesamt (UBA): Tremod 2024',
    sourceSection: 'Öffentlicher Straßenpersonenverkehr',
    gasType: 'CO2e',
    boundary: 'lifecycle',
    status: 'final',
    verificationDate: '2026-02-10',
    notes: 'Durchschnittliche Busflotte im Linienverkehr bei typischer Nahverkehrsauslastung.',
  },
  verkehr_ebike: {
    key: 'verkehr_ebike',
    name: 'Pedelec / E-Bike (25 km/h)',
    value: 4, // g CO2e / Pkm
    unit: 'g/Pkm',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2024,
    sourceUrl: 'https://www.umweltbundesamt.de/themen/verkehr/emissionsdaten',
    sourcePublication: 'Umweltbundesamt (UBA)',
    sourceSection: 'Mikromobilität und Fahrradverkehr',
    gasType: 'CO2e',
    boundary: 'lifecycle',
    status: 'estimated',
    verificationDate: '2026-02-10',
    notes: 'Direkt 0 g; ca. 4 g CO2e für Stromverbrauch und Batterieherstellung pro Personenkilometer.',
  },
  verkehr_fahrrad_fuss: {
    key: 'verkehr_fahrrad_fuss',
    name: 'Fahrrad & Fußverkehr',
    value: 0,
    unit: 'g/Pkm',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2024,
    sourceUrl: 'https://www.umweltbundesamt.de/themen/verkehr/emissionsdaten',
    sourcePublication: 'Umweltbundesamt (UBA)',
    sourceSection: 'Nichtmotorisierter Individualverkehr (NMIV)',
    gasType: 'CO2',
    boundary: 'direct_combustion',
    status: 'final',
    verificationDate: '2026-02-10',
    notes: 'Vollständig emissionsfreie Fortbewegung im direkten Betrieb.',
  },

  // --- Kraftstoffe & Brennstoffe (Direktverbrennung Scope 1) ---
  brennstoff_benzin_direkt: {
    key: 'brennstoff_benzin_direkt',
    name: 'Superbenzin (E10 / Super 95 direkte Verbrennung)',
    value: 2.37, // kg CO2 / Liter
    unit: 'kg/Liter',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2026,
    sourceUrl: 'https://www.gesetze-im-internet.de/ebev_2030/',
    sourcePublication: 'DEHSt / Emissionsberichterstattungsverordnung (EBeV 2030)',
    sourceSection: 'Standard-Emissionsfaktoren flüssige Brennstoffe',
    gasType: 'CO2',
    boundary: 'direct_combustion',
    status: 'final',
    verificationDate: '2026-01-10',
    notes: 'Reine Verbrennungsemission (Tank-to-Wheel). Inklusive Vorkette (Well-to-Wheel) betragen die Emissionen ca. 2,82 kg CO2e/l.',
  },
  brennstoff_benzin_lifecycle: {
    key: 'brennstoff_benzin_lifecycle',
    name: 'Superbenzin (Well-to-Wheel Lebenszyklus)',
    value: 2.82,
    unit: 'kg/Liter',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2026,
    sourceUrl: 'https://www.umweltbundesamt.de/themen/verkehr/emissionsdaten',
    sourcePublication: 'UBA Tremod',
    sourceSection: 'Well-to-Wheel Kraftstoffe',
    gasType: 'CO2e',
    boundary: 'lifecycle',
    status: 'final',
    verificationDate: '2026-01-10',
    notes: '2,37 kg Verbrennung + ca. 0,45 kg Vorkette (Förderung, Raffinerie, Transport).',
  },
  brennstoff_diesel_direkt: {
    key: 'brennstoff_diesel_direkt',
    name: 'Dieselkraftstoff (direkte Verbrennung)',
    value: 2.65, // kg CO2 / Liter
    unit: 'kg/Liter',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2026,
    sourceUrl: 'https://www.gesetze-im-internet.de/ebev_2030/',
    sourcePublication: 'DEHSt / EBeV 2030',
    sourceSection: 'Standard-Emissionsfaktoren flüssige Brennstoffe',
    gasType: 'CO2',
    boundary: 'direct_combustion',
    status: 'final',
    verificationDate: '2026-01-10',
    notes: 'Reine Verbrennungsemission. Inklusive Vorkette betragen die Emissionen ca. 3,24 kg CO2e/l.',
  },
  brennstoff_diesel_lifecycle: {
    key: 'brennstoff_diesel_lifecycle',
    name: 'Dieselkraftstoff (Well-to-Wheel Lebenszyklus)',
    value: 3.24,
    unit: 'kg/Liter',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2026,
    sourceUrl: 'https://www.umweltbundesamt.de/themen/verkehr/emissionsdaten',
    sourcePublication: 'UBA Tremod',
    sourceSection: 'Well-to-Wheel Kraftstoffe',
    gasType: 'CO2e',
    boundary: 'lifecycle',
    status: 'final',
    verificationDate: '2026-01-10',
    notes: '2,65 kg Verbrennung + ca. 0,59 kg Vorkette.',
  },
  brennstoff_erdgas_direkt: {
    key: 'brennstoff_erdgas_direkt',
    name: 'Erdgas (Brennwertbezogen Ho / Abrechnungsbasis)',
    value: 0.182, // kg CO2 / kWh Ho
    unit: 'kg/kWh',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2026,
    sourceUrl: 'https://www.gesetze-im-internet.de/ebev_2030/',
    sourcePublication: 'DEHSt / EBeV 2030 & CO2KostAufG',
    sourceSection: 'Standardfaktoren gasförmige Brennstoffe bezogen auf Brennwert Ho (56,1 t CO2/TJ bezogen auf Heizwert Hu = ca. 0,201 kg/kWh Hu bzw. 0,182 kg/kWh Ho)',
    gasType: 'CO2',
    boundary: 'direct_combustion',
    status: 'final',
    verificationDate: '2026-01-15',
    notes: 'Reine Verbrennungsemission bezogen auf die Kilowattstunde Brennwert laut Gasrechnung. Inklusive Vorkette ca. 0,240 kg CO2e/kWh.',
  },
  brennstoff_erdgas_lifecycle: {
    key: 'brennstoff_erdgas_lifecycle',
    name: 'Erdgas (Lebenszyklus inkl. Vorkette & Methanschlupf)',
    value: 0.240, // kg CO2e / kWh
    unit: 'kg/kWh',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2026,
    sourceUrl: 'https://www.umweltbundesamt.de',
    sourcePublication: 'UBA GEMIS',
    sourceSection: 'Brennstoffvorkette Erdgas',
    gasType: 'CO2e',
    boundary: 'lifecycle',
    status: 'estimated',
    verificationDate: '2026-01-15',
    notes: 'Beinhaltet Vorkettenverluste, Pipeline-Transport und flüchtige Methanemissionen.',
  },
  brennstoff_heizoel_direkt: {
    key: 'brennstoff_heizoel_direkt',
    name: 'Heizöl EL (direkte Verbrennung)',
    value: 2.66, // kg CO2 / Liter
    unit: 'kg/Liter',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2026,
    sourceUrl: 'https://www.gesetze-im-internet.de/ebev_2030/',
    sourcePublication: 'DEHSt / EBeV 2030',
    sourceSection: 'Standard-Emissionsfaktor leichtes Heizöl (74,1 t CO2/TJ)',
    gasType: 'CO2',
    boundary: 'direct_combustion',
    status: 'final',
    verificationDate: '2026-01-15',
    notes: 'Reine Verbrennungsemission. Pro Liter Heizöl entstehen 2,66 kg CO2 (entspricht ca. 0,266 kg CO2/kWh bei 10 kWh/l Heizwert).',
  },
  brennstoff_heizoel_lifecycle: {
    key: 'brennstoff_heizoel_lifecycle',
    name: 'Heizöl EL (Well-to-Tank Lebenszyklus)',
    value: 3.10, // kg CO2e / Liter
    unit: 'kg/Liter',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2026,
    sourceUrl: 'https://www.umweltbundesamt.de/themen/verkehr/emissionsdaten',
    sourcePublication: 'UBA GEMIS',
    sourceSection: 'Lebenszyklus flüssige Brennstoffe',
    gasType: 'CO2e',
    boundary: 'lifecycle',
    status: 'estimated',
    verificationDate: '2026-01-15',
    notes: '2,66 kg direkte Verbrennung + ca. 0,44 kg Vorkettenaufwand.',
  },
  brennstoff_lpg_direkt: {
    key: 'brennstoff_lpg_direkt',
    name: 'Flüssiggas / Autogas (LPG Propan/Butan)',
    value: 1.65, // kg CO2 / Liter
    unit: 'kg/Liter',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2026,
    sourceUrl: 'https://www.gesetze-im-internet.de/ebev_2030/',
    sourcePublication: 'DEHSt / EBeV 2030',
    sourceSection: 'Flüssiggas gem. BEHG Anlage 1',
    gasType: 'CO2',
    boundary: 'direct_combustion',
    status: 'final',
    verificationDate: '2026-01-15',
    notes: 'Direkte Verbrennungsemission von 1 Liter Flüssiggas.',
  },
  brennstoff_holzpellets_lifecycle: {
    key: 'brennstoff_holzpellets_lifecycle',
    name: 'Holzpellets (Lebenszyklus Vorkette)',
    value: 0.027, // kg CO2e / kWh
    unit: 'kg/kWh',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2026,
    sourceUrl: 'https://www.umweltbundesamt.de',
    sourcePublication: 'Umweltbundesamt GEMIS Datensätze / GEG',
    sourceSection: 'Holzartige Biomasse Vorkette',
    gasType: 'CO2e',
    boundary: 'lifecycle',
    status: 'final',
    verificationDate: '2026-01-15',
    notes: 'Das bei der Verbrennung freigesetzte CO2 gilt im Rahmen des natürlichen Kohlenstoffkreislaufs als klimaneutral; der Faktor beziffert die fossile Vorkette (Waldwirtschaft, Trocknung, Pressung, Transport).',
  },
  brennstoff_fernwaerme_mix: {
    key: 'brennstoff_fernwaerme_mix',
    name: 'Fernwärme (deutscher Durchschnittsmix)',
    value: 0.160, // kg CO2e / kWh
    unit: 'kg/kWh',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2025,
    sourceUrl: 'https://www.agfw.de',
    sourcePublication: 'AGFW Energieeffizienzverband für Wärme, Kälte und KWK / GEG Standardwerte',
    sourceSection: 'Spezifische Emissionsfaktoren Wärmenetze Deutschland',
    gasType: 'CO2e',
    boundary: 'energy_generation',
    status: 'estimated',
    verificationDate: '2026-01-15',
    notes: 'Durchschnittswert für Fernwärmenetze mit hohem KWK-Anteil (Kraft-Wärme-Kopplung) und Erdgas/Biomasse. Individuelle Netze weichen lokal erheblich ab (vom Versorger auszuweisen).',
  },

  // --- CO2-Preise nach BEHG (§ 10 Abs. 2) ---
  co2_preis_behg_2024: {
    key: 'co2_preis_behg_2024',
    name: 'Nationaler CO2-Festpreis 2024 (§ 10 BEHG)',
    value: 45.0,
    unit: '€/t CO2',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2024,
    sourceUrl: 'https://www.gesetze-im-internet.de/behg/__10.html',
    sourcePublication: 'Brennstoffemissionshandelsgesetz (BEHG)',
    sourceSection: '§ 10 Abs. 2 Satz 1 Nr. 4 BEHG',
    gasType: 'CO2',
    boundary: 'direct_combustion',
    status: 'final',
    verificationDate: '2026-01-01',
    notes: 'Gesetzlicher Festpreis für Emissionszertifikate im nEHS (45 € je Tonne CO2 zzgl. MwSt.).',
  },
  co2_preis_behg_2025: {
    key: 'co2_preis_behg_2025',
    name: 'Nationaler CO2-Festpreis 2025 (§ 10 BEHG)',
    value: 55.0,
    unit: '€/t CO2',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2025,
    sourceUrl: 'https://www.gesetze-im-internet.de/behg/__10.html',
    sourcePublication: 'Brennstoffemissionshandelsgesetz (BEHG)',
    sourceSection: '§ 10 Abs. 2 Satz 1 Nr. 5 BEHG',
    gasType: 'CO2',
    boundary: 'direct_combustion',
    status: 'final',
    verificationDate: '2026-01-01',
    notes: 'Gesetzlicher Festpreis für Emissionszertifikate im nEHS (55 € je Tonne CO2 zzgl. MwSt.).',
  },
  co2_preis_behg_2026_default: {
    key: 'co2_preis_behg_2026_default',
    name: 'Nationaler CO2-Preis 2026 (Gesetzlicher Preiskorridor 55–65 €/t)',
    value: 55.0,
    unit: '€/t CO2',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2026,
    sourceUrl: 'https://www.gesetze-im-internet.de/behg/__10.html',
    sourcePublication: 'Brennstoffemissionshandelsgesetz (BEHG)',
    sourceSection: '§ 10 Abs. 2 Satz 2 BEHG: Versteigerung im Preiskorridor von mind. 55 € bis max. 65 € pro Tonne',
    gasType: 'CO2',
    boundary: 'direct_combustion',
    status: 'provisional',
    verificationDate: '2026-01-01',
    notes: 'Ab 2026 werden die Zertifikate im nEHS versteigert. Das Gesetz begrenzt den Preis auf einen Mindestpreis von 55 € und einen Höchstpreis von 65 € je Tonne CO2.',
  },
};

export function getFactor(key: string): EmissionFactor | undefined {
  return EMISSION_FACTORS[key];
}

