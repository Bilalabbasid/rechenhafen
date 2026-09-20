import fs from 'fs';
import path from 'path';

const files = [
  'src/data/calculators/datumZeit.ts',
  'src/data/calculators/mathematik.ts',
  'src/data/calculators/finanzen.ts',
  'src/data/calculators/kredit.ts',
  'src/data/calculators/auto.ts',
  'src/data/calculators/wohnen.ts',
  'src/data/calculators/haushalt.ts',
  'src/data/calculators/arbeit.ts',
  'src/data/calculators/gesundheit.ts',
  'src/data/calculators/familie.ts',
  'src/data/calculators/bauen.ts',
  'src/data/calculators/geometrie.ts',
  'src/data/calculators/einheiten.ts',
  'src/data/calculators/kochen.ts',
  'src/data/calculators/business.ts',
  'src/data/calculators/statistik.ts',
  'src/data/calculators/extra/autoArbeit.ts',
  'src/data/calculators/extra/bauenGeometrie.ts',
  'src/data/calculators/extra/businessStatistik.ts',
  'src/data/calculators/extra/datumMath.ts',
  'src/data/calculators/extra/einheitenKochen.ts',
  'src/data/calculators/extra/finanzenKredit.ts',
  'src/data/calculators/extra/gesundheitFamilie.ts',
  'src/data/calculators/extra/wohnenHaushalt.ts'
];

const slugs = [
  'kirchensteuer-rechner', 'minijob-midijob-rechner', 'buergergeld-anspruch-rechner',
  'arbeitslosengeld-1-rechner', 'kurzarbeitergeld-rechner', 'mutterschaftsgeld-rechner',
  'krankengeld-rechner', 'elternzeit-teilzeit-rechner', 'elterngeld-basis-plus-rechner',
  'kindergeld-rechner-2026', 'duesseldorfer-tabelle-rechner', 'unterhaltsvorschuss-rechner',
  'schulbedarfspaket-bu-t-rechner', 'grundsteuer-reform-rechner', 'grunderwerbsteuer-rechner',
  'notar-grundbuch-kosten-rechner', 'abfindung-fuenftelregelung-rechner', 'kapitalertragsteuer-rechner',
  'dienstwagen-1-prozent-rechner', 'fahrtenbuch-vs-1-prozent-rechner', 'firmenwagen-geldwerter-vorteil-rechner',
  'dienstfahrrad-jobrad-rechner', 'dienstjubilaeum-steuerfrei-rechner', 'dienstaufwandsentschaedigung-rechner',
  'co2-abgabe-vermieter-mieter-rechner', 'daemmung-u-wert-rechner', 'vorfaelligkeitsentschaedigung-baufinanzierung-rechner',
  'kfz-steuer-rechner', 'stromkosten-geraete-rechner', 'waermepumpe-stromkosten-rechner',
  'balkonkraftwerk-ertrag-rechner', 'photovoltaik-amortisation-rechner'
];

const locations: Record<string, string> = {};

for (const f of files) {
  const content = fs.readFileSync(f, 'utf-8');
  for (const s of slugs) {
    if (content.includes(`slug: '${s}'`) || content.includes(`slug: "${s}"`)) {
      locations[s] = f;
    }
  }
}

for (const s of slugs) {
  console.log(`${s} -> ${locations[s] || 'NOT FOUND'}`);
}
