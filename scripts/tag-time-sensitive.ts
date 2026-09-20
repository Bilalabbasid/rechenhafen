import fs from 'fs';
import path from 'path';
import { ALL_CALCULATORS } from '../src/data/calculators';

// Define the authoritative list of German regulated/time-sensitive calculators
const TIME_SENSITIVE_REGISTRY: Record<string, {
  year: number;
  source: string;
  sourceUrl: string;
  lastVerified: string;
  note: string;
}> = {
  'pendlerpauschale-rechner': {
    year: 2026,
    source: 'Bundesfinanzministerium (BMF) – § 9 Abs. 1 Nr. 4 EStG',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    lastVerified: '2026-01-15',
    note: '0,30 € bis km 20; 0,38 € ab km 21 (Fernpendler)'
  },
  'kirchensteuer-rechner': {
    year: 2026,
    source: 'Kirchensteuergesetze der Bundesländer (KiStG)',
    sourceUrl: 'https://www.finanzamt.de',
    lastVerified: '2026-01-15',
    note: '8 % in Bayern und Baden-Württemberg, 9 % in den übrigen 14 Bundesländern'
  },
  'minijob-midijob-rechner': {
    year: 2026,
    source: 'Minijob-Zentrale / BMAS (§ 8, § 20 SGB IV)',
    sourceUrl: 'https://www.minijob-zentrale.de',
    lastVerified: '2026-01-15',
    note: 'Minijob-Grenze 556 €/Monat, Übergangsbereich (Midijob) bis 2.000 €/Monat'
  },
  'mindestlohn-rechner': {
    year: 2026,
    source: 'Mindestlohnkommission / BMAS (MiLoG)',
    sourceUrl: 'https://www.bmas.de',
    lastVerified: '2026-01-15',
    note: 'Gesetzlicher Mindestlohn 12,82 €/h'
  },
  'mwst-rechner': {
    year: 2026,
    source: 'Umsatzsteuergesetz (§ 12 UStG)',
    sourceUrl: 'https://www.gesetze-im-internet.de/ustg_1980/__12.html',
    lastVerified: '2026-01-15',
    note: 'Regulärer Steuersatz 19 %, ermäßigter Steuersatz 7 %'
  },
  'buergergeld-anspruch-rechner': {
    year: 2026,
    source: 'Bundesministerium für Arbeit und Soziales (§ 20 SGB II)',
    sourceUrl: 'https://www.bmas.de',
    lastVerified: '2026-01-15',
    note: 'Regelbedarfsstufe 1: 563 € für Alleinstehende'
  },
  'arbeitslosengeld-1-rechner': {
    year: 2026,
    source: 'Bundesagentur für Arbeit (§ 149, § 151 SGB III)',
    sourceUrl: 'https://www.arbeitsagentur.de',
    lastVerified: '2026-01-15',
    note: '60 % des pauschalierten Nettoentgelts (67 % mit mindestens 1 Kind)'
  },
  'kurzarbeitergeld-rechner': {
    year: 2026,
    source: 'Bundesagentur für Arbeit (§ 105 SGB III)',
    sourceUrl: 'https://www.arbeitsagentur.de',
    lastVerified: '2026-01-15',
    note: '60 % Nettoentgeltdifferenz (67 % mit Kindern)'
  },
  'mutterschaftsgeld-rechner': {
    year: 2026,
    source: 'Mutterschutzgesetz (§ 19 MuSchG) / GKV-Spitzenverband',
    sourceUrl: 'https://www.bmfsfj.de',
    lastVerified: '2026-01-15',
    note: 'Max. 13 €/Tag Krankenkasse zzgl. Arbeitgeberzuschuss zum Nettolohn'
  },
  'krankengeld-rechner': {
    year: 2026,
    source: 'Sozialgesetzbuch Fünftes Buch (§ 47 SGB V)',
    sourceUrl: 'https://www.gkv-spitzenverband.de',
    lastVerified: '2026-01-15',
    note: '70 % vom Regelbrutto, maximal 90 % vom Netto'
  },
  'elternzeit-teilzeit-rechner': {
    year: 2026,
    source: 'Bundeselterngeld- und Elternzeitgesetz (§ 15 BEEG)',
    sourceUrl: 'https://www.bmfsfj.de',
    lastVerified: '2026-01-15',
    note: 'Zulässige Teilzeitarbeit bis zu 32 Wochenstunden während der Elternzeit'
  },
  'elterngeld-basis-plus-rechner': {
    year: 2026,
    source: 'Bundeselterngeld- und Elternzeitgesetz (§ 1 bis § 4d BEEG)',
    sourceUrl: 'https://www.familienportal.de',
    lastVerified: '2026-01-15',
    note: 'Basiselterngeld 300 € bis 1.800 € (65–67 % Ersatzrate)'
  },
  'kindergeld-rechner-2026': {
    year: 2026,
    source: 'Familienkasse / Einkommensteuergesetz (§ 66 EStG)',
    sourceUrl: 'https://www.arbeitsagentur.de/familie-und-kinder',
    lastVerified: '2026-01-15',
    note: 'Einheitliches Kindergeld pro Kind'
  },
  'duesseldorfer-tabelle-rechner': {
    year: 2026,
    source: 'Oberlandesgericht Düsseldorf (Düsseldorfer Tabelle)',
    sourceUrl: 'https://www.olg-duesseldorf.nrw.de',
    lastVerified: '2026-01-15',
    note: 'Kindesunterhalts-Leitlinien und Einkommensgruppen'
  },
  'unterhaltsvorschuss-rechner': {
    year: 2026,
    source: 'Unterhaltsvorschussgesetz (UVG) / BMFSFJ',
    sourceUrl: 'https://www.bmfsfj.de',
    lastVerified: '2026-01-15',
    note: 'Staffelung nach Altersstufen (0-5, 6-11, 12-17 Jahre)'
  },
  'schulbedarfspaket-bu-t-rechner': {
    year: 2026,
    source: 'Bundesministerium für Arbeit und Soziales (§ 28 Abs. 3 SGB II)',
    sourceUrl: 'https://www.bmas.de',
    lastVerified: '2026-01-15',
    note: '195 € pro Schuljahr (130 € im 1. Halbjahr, 65 € im 2. Halbjahr)'
  },
  'grundsteuer-reform-rechner': {
    year: 2026,
    source: 'Grundsteuer-Reformgesetze (Bundesmodell & Ländermodelle)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    lastVerified: '2026-01-15',
    note: 'Berechnung aus Grundsteuerwert × Steuermesszahl × Hebesatz'
  },
  'grunderwerbsteuer-rechner': {
    year: 2026,
    source: 'Grunderwerbsteuergesetze der 16 Bundesländer (GrEStG)',
    sourceUrl: 'https://www.finanzverwaltung.nrw.de',
    lastVerified: '2026-01-15',
    note: 'Länderspezifische Steuersätze von 3,5 % (Bayern) bis 6,5 % (NRW, Saarland etc.)'
  },
  'notar-grundbuch-kosten-rechner': {
    year: 2026,
    source: 'Gerichts- und Notarkostengesetz (GNotKG)',
    sourceUrl: 'https://www.gesetze-im-internet.de/gnotkg/',
    lastVerified: '2026-01-15',
    note: 'Gebührentabelle B des GNotKG für Kaufvertragsbeurkundung und Grundschuldeintragung'
  },
  'abfindung-fuenftelregelung-rechner': {
    year: 2026,
    source: 'Einkommensteuergesetz (§ 34 EStG Außerordentliche Einkünfte)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    lastVerified: '2026-01-15',
    note: 'Steuerbegünstigung nach der Fünftelregelung zur Milderung der Steuerprogression'
  },
  'kapitalertragsteuer-rechner': {
    year: 2026,
    source: 'Einkommensteuergesetz (§ 32d, § 43a EStG, § 4 SolzG)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    lastVerified: '2026-01-15',
    note: '25 % Abgeltungsteuer + 5,5 % Soli = 26,375 % zzgl. Kirchensteuer'
  },
  'dienstwagen-1-prozent-rechner': {
    year: 2026,
    source: 'Einkommensteuergesetz (§ 6 Abs. 1 Nr. 4 EStG, § 8 Abs. 2 EStG)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    lastVerified: '2026-01-15',
    note: '1 % Bruttolistenpreis (0,25 % für BEV, 0,5 % für PHEV) + 0,03 % pro Entfernungskilometer'
  },
  'fahrtenbuch-vs-1-prozent-rechner': {
    year: 2026,
    source: 'Einkommensteuergesetz (§ 6 Abs. 1 Nr. 4 Satz 3 EStG)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    lastVerified: '2026-01-15',
    note: 'Vergleich der Pauschalversteuerung mit den tatsächlichen Fahrzeugvollkosten'
  },
  'firmenwagen-geldwerter-vorteil-rechner': {
    year: 2026,
    source: 'Einkommensteuergesetz (§ 8 Abs. 2 EStG)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    lastVerified: '2026-01-15',
    note: 'Geldwerter Vorteil für Privatnutzung und Arbeitsweg'
  },
  'dienstfahrrad-jobrad-rechner': {
    year: 2026,
    source: 'Einkommensteuergesetz (§ 6 Abs. 1 Nr. 4 Satz 6 EStG / Erlass der obersten Finanzbehörden)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    lastVerified: '2026-01-15',
    note: '0,25 % geldwerter Vorteil auf die geviertelte UVP bei Gehaltsumwandlung'
  },
  'dienstjubilaeum-steuerfrei-rechner': {
    year: 2026,
    source: 'Einkommensteuergesetz (§ 8 Abs. 2 Satz 11 EStG, R 19.6 LStR)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    lastVerified: '2026-01-15',
    note: 'Monatliche Sachbezugsfreigrenze 50 €; 60 € Aufmerksamkeiten aus persönlichem Anlass'
  },
  'dienstaufwandsentschaedigung-rechner': {
    year: 2026,
    source: 'Einkommensteuergesetz (§ 3 Nr. 26, Nr. 26a EStG)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    lastVerified: '2026-01-15',
    note: 'Ehrenamtspauschale 840 €/Jahr, Übungsleiterfreibetrag 3.000 €/Jahr'
  },
  'co2-abgabe-vermieter-mieter-rechner': {
    year: 2026,
    source: 'Kohlendioxidkostenaufteilungsgesetz (CO2KostAufG Stufenmodell)',
    sourceUrl: 'https://www.bmwk.de',
    lastVerified: '2026-01-15',
    note: '10-stufiges Aufteilungsmodell der CO2-Kosten zwischen Vermieter und Mieter'
  },
  'daemmung-u-wert-rechner': {
    year: 2026,
    source: 'Gebäudeenergiegesetz (GEG § 48 und Anlage 7)',
    sourceUrl: 'https://www.bmwsb.bund.de',
    lastVerified: '2026-01-15',
    note: 'Maximaler U-Wert für Außenwände bei Sanierung: 0,24 W/(m²K)'
  },
  'vorfaelligkeitsentschaedigung-baufinanzierung-rechner': {
    year: 2026,
    source: 'BGH-Rechtsprechung zur Aktiv-Passiv-Methode (XI ZR 197/00) & Deutsche Bundesbank',
    sourceUrl: 'https://www.bundesbank.de',
    lastVerified: '2026-01-15',
    note: 'Wiederanlage in Hypothekenpfandbriefen der Deutschen Bundesbank'
  },
  'kfz-steuer-rechner': {
    year: 2026,
    source: 'Kraftfahrzeugsteuergesetz (§ 8, § 9 KraftStG)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    lastVerified: '2026-01-15',
    note: 'Hubraumsockel (2,00 € Benzin / 9,50 € Diesel je 100 cm³) + CO2-Stufentarif ab 95 g/km'
  },
  'stromkosten-geraete-rechner': {
    year: 2026,
    source: 'BDEW Bundesverband der Energie- und Wasserwirtschaft',
    sourceUrl: 'https://www.bdew.de',
    lastVerified: '2026-01-20',
    note: 'Durchschnittlicher Strompreis von ca. 0,38 €/kWh'
  },
  'waermepumpe-stromkosten-rechner': {
    year: 2026,
    source: 'BDEW / Bundesverband Wärmepumpe (BWP)',
    sourceUrl: 'https://www.waermepumpe.de',
    lastVerified: '2026-01-20',
    note: 'Wärmepumpentarife und Jahresarbeitszahl (JAZ)'
  },
  'balkonkraftwerk-ertrag-rechner': {
    year: 2026,
    source: 'Solarpaket I / VDE 0100-551-1 / EEG',
    sourceUrl: 'https://www.bmwk.de',
    lastVerified: '2026-01-15',
    note: 'Zulässige Wechselrichter-Einspeiseleistung bis 800 Watt (Modulleistung bis 2.000 Wp)'
  },
  'photovoltaik-amortisation-rechner': {
    year: 2026,
    source: 'Erneuerbare-Energien-Gesetz (EEG Vergütungssätze) / Bundesnetzagentur',
    sourceUrl: 'https://www.bundesnetzagentur.de',
    lastVerified: '2026-01-15',
    note: 'Feste Einspeisevergütung für Dachanlagen bis 10 kWp'
  }
};

console.log(`Configured ${Object.keys(TIME_SENSITIVE_REGISTRY).length} regulated calculators.`);

// Count how many match calculators in ALL_CALCULATORS
let matched = 0;
for (const slug of Object.keys(TIME_SENSITIVE_REGISTRY)) {
  const calc = ALL_CALCULATORS.find(c => c.slug === slug);
  if (calc) {
    matched++;
  } else {
    console.warn(`Registry slug not found in ALL_CALCULATORS: ${slug}`);
  }
}
console.log(`Matched ${matched} / ${Object.keys(TIME_SENSITIVE_REGISTRY).length} calculators.`);
