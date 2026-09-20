const fs = require('fs');
const path = require('path');

const slugReplacements = {
  'prozentuale-veraenderung-rechner': 'prozentuale-veraenderung',
  'dreisatz-rechner': 'dreisatzrechner',
  'ggt-kgv-rechner': 'ggt-rechner',
  'wurzel-rechner': 'quadratwurzel-rechner',
  'potenz-rechner': 'zehnerpotenzen-rechner',
  'logarithmus-rechner': 'zehnerpotenzen-rechner',
  'binaer-dezimal-rechner': 'binaer-hex-dezimal-umrechner',
  'primzahl-rechner': 'teiler-vielfache-rechner',
  'fakultaet-rechner': 'kombinatorik-n-ueber-k-rechner',
  'roemische-zahlen-rechner': 'binaer-hex-dezimal-umrechner',
  'sparplanrechner': 'etf-sparplan-rechner',
  'auszahlplan-rechner': 'ewige-rente-rechner',
  '72er-regel-rechner': 'zinseszinsrechner',
  'eigenkapitalquote-rechner': 'kaufnebenkosten-rechner',
  'brutto-netto-rechner': 'teilzeit-gehaltsrechner',
  'einkommensteuerrechner': 'kapitalertragsteuer-rechner',
  'abgeltungsteuer-rechner': 'kapitalertragsteuer-rechner',
  'mietpreisbremse-rechner': 'mietbelastungsquote-rechner',
  'mietkaution-rechner': 'mietkaution-zinsen-rechner',
  'mietrendite-rechner': 'mietrendite-brutto-netto-rechner',
  'kauf-vs-miete-rechner': 'mietbudget-rechner',
  'stromkosten-rechner': 'stromkostenrechner',
  'heizkostenrechner': 'heizkostenvergleich-rechner',
  'gasverbrauchsrechner': 'gaskostenrechner',
  'reifen-rechner': 'reifen-abrollumfang-rechner',
  'spritrechner': 'spritkostenrechner',
};

const extraDir = path.join(__dirname, '../src/data/calculators/extra');
const files = fs.readdirSync(extraDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

for (const file of files) {
  const filePath = path.join(extraDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix the duplicate slug in wohnenHaushalt.ts specifically
  if (file === 'wohnenHaushalt.ts') {
    if (content.includes("id: 'vorfaelligkeitsentschaedigung-rechner'")) {
      content = content.replace("id: 'vorfaelligkeitsentschaedigung-rechner'", "id: 'vorfaelligkeitsentschaedigung-baufinanzierung-rechner'");
      content = content.replace("slug: 'vorfaelligkeitsentschaedigung-rechner'", "slug: 'vorfaelligkeitsentschaedigung-baufinanzierung-rechner'");
      content = content.replace("name: 'Vorfälligkeitsentschädigung Rechner (Aktiv-Passiv-Methode)'", "name: 'Vorfälligkeitsentschädigung Baufinanzierung Rechner (Aktiv-Passiv-Methode)'");
      content = content.replace("shortName: 'Vorfälligkeitsentschädigung'", "shortName: 'Vorfälligkeitsentschädigung Baufinanzierung'");
      modified = true;
      console.log('Fixed duplicate slug in wohnenHaushalt.ts');
    }
  }

  for (const [from, to] of Object.entries(slugReplacements)) {
    const pattern = new RegExp(`'${from}'`, 'g');
    if (pattern.test(content)) {
      content = content.replace(pattern, `'${to}'`);
      modified = true;
    }
    const patternDbl = new RegExp(`"${from}"`, 'g');
    if (patternDbl.test(content)) {
      content = content.replace(patternDbl, `"${to}"`);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
console.log('Done updating related slugs.');
