import fs from 'fs';
import path from 'path';

const REGISTRY: Record<string, { year: number; source: string; sourceUrl: string; lastVerified: string; }> = {
  'kirchensteuer-rechner': {
    year: 2026,
    source: 'Kirchensteuergesetze der Bundesländer (KiStG)',
    sourceUrl: 'https://www.finanzamt.de',
    lastVerified: '2026-01-15',
  },
  'minijob-midijob-rechner': {
    year: 2026,
    source: 'Minijob-Zentrale / BMAS (§ 8, § 20 SGB IV)',
    sourceUrl: 'https://www.minijob-zentrale.de',
    lastVerified: '2026-01-15',
  },
  'buergergeld-anspruch-rechner': {
    year: 2026,
    source: 'Bundesministerium für Arbeit und Soziales (§ 20 SGB II)',
    sourceUrl: 'https://www.bmas.de',
    lastVerified: '2026-01-15',
  },
  'arbeitslosengeld-1-rechner': {
    year: 2026,
    source: 'Bundesagentur für Arbeit (§ 149, § 151 SGB III)',
    sourceUrl: 'https://www.arbeitsagentur.de',
    lastVerified: '2026-01-15',
  },
  'kurzarbeitergeld-rechner': {
    year: 2026,
    source: 'Bundesagentur für Arbeit (§ 105 SGB III)',
    sourceUrl: 'https://www.arbeitsagentur.de',
    lastVerified: '2026-01-15',
  },
  'mutterschaftsgeld-rechner': {
    year: 2026,
    source: 'Mutterschutzgesetz (§ 19 MuSchG) / GKV-Spitzenverband',
    sourceUrl: 'https://www.bmfsfj.de',
    lastVerified: '2026-01-15',
  },
  'krankengeld-rechner': {
    year: 2026,
    source: 'Sozialgesetzbuch Fünftes Buch (§ 47 SGB V)',
    sourceUrl: 'https://www.gkv-spitzenverband.de',
    lastVerified: '2026-01-15',
  },
  'elternzeit-teilzeit-rechner': {
    year: 2026,
    source: 'Bundeselterngeld- und Elternzeitgesetz (§ 15 BEEG)',
    sourceUrl: 'https://www.bmfsfj.de',
    lastVerified: '2026-01-15',
  },
  'elterngeld-basis-plus-rechner': {
    year: 2026,
    source: 'Bundeselterngeld- und Elternzeitgesetz (§ 1 bis § 4d BEEG)',
    sourceUrl: 'https://www.familienportal.de',
    lastVerified: '2026-01-15',
  },
  'kindergeld-rechner-2026': {
    year: 2026,
    source: 'Familienkasse / Einkommensteuergesetz (§ 66 EStG)',
    sourceUrl: 'https://www.arbeitsagentur.de/familie-und-kinder',
    lastVerified: '2026-01-15',
  },
  'duesseldorfer-tabelle-rechner': {
    year: 2026,
    source: 'Oberlandesgericht Düsseldorf (Düsseldorfer Tabelle)',
    sourceUrl: 'https://www.olg-duesseldorf.nrw.de',
    lastVerified: '2026-01-15',
  },
  'unterhaltsvorschuss-rechner': {
    year: 2026,
    source: 'Unterhaltsvorschussgesetz (UVG) / BMFSFJ',
    sourceUrl: 'https://www.bmfsfj.de',
    lastVerified: '2026-01-15',
  },
  'schulbedarfspaket-bu-t-rechner': {
    year: 2026,
    source: 'Bundesministerium für Arbeit und Soziales (§ 28 Abs. 3 SGB II)',
    sourceUrl: 'https://www.bmas.de',
    lastVerified: '2026-01-15',
  },
  'grundsteuer-reform-rechner': {
    year: 2026,
    source: 'Grundsteuer-Reformgesetze (Bundesmodell & Ländermodelle)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    lastVerified: '2026-01-15',
  },
  'grunderwerbsteuer-rechner': {
    year: 2026,
    source: 'Grunderwerbsteuergesetze der 16 Bundesländer (GrEStG)',
    sourceUrl: 'https://www.finanzverwaltung.nrw.de',
    lastVerified: '2026-01-15',
  },
  'notar-grundbuch-kosten-rechner': {
    year: 2026,
    source: 'Gerichts- und Notarkostengesetz (GNotKG)',
    sourceUrl: 'https://www.gesetze-im-internet.de/gnotkg/',
    lastVerified: '2026-01-15',
  },
  'abfindung-fuenftelregelung-rechner': {
    year: 2026,
    source: 'Einkommensteuergesetz (§ 34 EStG Außerordentliche Einkünfte)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    lastVerified: '2026-01-15',
  },
  'kapitalertragsteuer-rechner': {
    year: 2026,
    source: 'Einkommensteuergesetz (§ 32d, § 43a EStG, § 4 SolzG)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    lastVerified: '2026-01-15',
  },
  'dienstwagen-1-prozent-rechner': {
    year: 2026,
    source: 'Einkommensteuergesetz (§ 6 Abs. 1 Nr. 4 EStG, § 8 Abs. 2 EStG)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    lastVerified: '2026-01-15',
  },
  'fahrtenbuch-vs-1-prozent-rechner': {
    year: 2026,
    source: 'Einkommensteuergesetz (§ 6 Abs. 1 Nr. 4 Satz 3 EStG)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    lastVerified: '2026-01-15',
  },
  'firmenwagen-geldwerter-vorteil-rechner': {
    year: 2026,
    source: 'Einkommensteuergesetz (§ 8 Abs. 2 EStG)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    lastVerified: '2026-01-15',
  },
  'dienstfahrrad-jobrad-rechner': {
    year: 2026,
    source: 'Einkommensteuergesetz (§ 6 Abs. 1 Nr. 4 Satz 6 EStG / Erlass der obersten Finanzbehörden)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    lastVerified: '2026-01-15',
  },
  'dienstjubilaeum-steuerfrei-rechner': {
    year: 2026,
    source: 'Einkommensteuergesetz (§ 8 Abs. 2 Satz 11 EStG, R 19.6 LStR)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    lastVerified: '2026-01-15',
  },
  'dienstaufwandsentschaedigung-rechner': {
    year: 2026,
    source: 'Einkommensteuergesetz (§ 3 Nr. 26, Nr. 26a EStG)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    lastVerified: '2026-01-15',
  },
  'co2-abgabe-vermieter-mieter-rechner': {
    year: 2026,
    source: 'Kohlendioxidkostenaufteilungsgesetz (CO2KostAufG Stufenmodell)',
    sourceUrl: 'https://www.bmwk.de',
    lastVerified: '2026-01-15',
  },
  'daemmung-u-wert-rechner': {
    year: 2026,
    source: 'Gebäudeenergiegesetz (GEG § 48 und Anlage 7)',
    sourceUrl: 'https://www.bmwsb.bund.de',
    lastVerified: '2026-01-15',
  },
  'vorfaelligkeitsentschaedigung-baufinanzierung-rechner': {
    year: 2026,
    source: 'BGH-Rechtsprechung zur Aktiv-Passiv-Methode (XI ZR 197/00) & Deutsche Bundesbank',
    sourceUrl: 'https://www.bundesbank.de',
    lastVerified: '2026-01-15',
  },
  'kfz-steuer-rechner': {
    year: 2026,
    source: 'Kraftfahrzeugsteuergesetz (§ 8, § 9 KraftStG)',
    sourceUrl: 'https://www.bundesfinanzministerium.de',
    lastVerified: '2026-01-15',
  },
  'stromkosten-geraete-rechner': {
    year: 2026,
    source: 'BDEW Bundesverband der Energie- und Wasserwirtschaft',
    sourceUrl: 'https://www.bdew.de',
    lastVerified: '2026-01-20',
  },
  'waermepumpe-stromkosten-rechner': {
    year: 2026,
    source: 'BDEW / Bundesverband Wärmepumpe (BWP)',
    sourceUrl: 'https://www.waermepumpe.de',
    lastVerified: '2026-01-20',
  },
  'balkonkraftwerk-ertrag-rechner': {
    year: 2026,
    source: 'Solarpaket I / VDE 0100-551-1 / EEG',
    sourceUrl: 'https://www.bmwk.de',
    lastVerified: '2026-01-15',
  },
  'photovoltaik-amortisation-rechner': {
    year: 2026,
    source: 'Erneuerbare-Energien-Gesetz (EEG Vergütungssätze) / Bundesnetzagentur',
    sourceUrl: 'https://www.bundesnetzagentur.de',
    lastVerified: '2026-01-15',
  }
};

const targetFiles = [
  'src/data/calculators/extra/autoArbeit.ts',
  'src/data/calculators/extra/bauenGeometrie.ts',
  'src/data/calculators/extra/finanzenKredit.ts',
  'src/data/calculators/extra/gesundheitFamilie.ts',
  'src/data/calculators/extra/wohnenHaushalt.ts'
];

for (const filePath of targetFiles) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let fileModified = false;

  for (const [slug, meta] of Object.entries(REGISTRY)) {
    // Check if slug exists in file
    const slugPattern1 = `slug: '${slug}'`;
    const slugPattern2 = `slug: "${slug}"`;
    let slugIdx = content.indexOf(slugPattern1);
    if (slugIdx === -1) slugIdx = content.indexOf(slugPattern2);
    if (slugIdx === -1) continue;

    // Search window up to 8000 characters
    const windowEnd = Math.min(content.length, slugIdx + 8000);
    const snippet = content.slice(slugIdx, windowEnd);

    if (snippet.includes('isTimeSensitive: true')) {
      continue;
    }

    // Find relatedSlugs in this snippet
    const relMatch = snippet.match(/relatedSlugs:\s*\[[^\]]*\]/);
    if (!relMatch) {
      console.log(`Could not find relatedSlugs for ${slug}`);
      continue;
    }

    const relFull = relMatch[0];
    const injection = `${relFull},
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: ${meta.year},
      source: '${meta.source}',
      sourceUrl: '${meta.sourceUrl}',
      lastVerified: '${meta.lastVerified}',
    }`;

    // Replace the first occurrence of relFull in snippet
    const snippetUpdated = snippet.replace(relFull, injection);
    content = content.slice(0, slugIdx) + snippetUpdated + content.slice(windowEnd);
    fileModified = true;
    console.log(`Successfully tagged ${slug} in ${filePath}`);
  }

  if (fileModified) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}
