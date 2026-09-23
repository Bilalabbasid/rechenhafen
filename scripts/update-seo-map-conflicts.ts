import fs from 'fs';
import path from 'path';

const seoMapPath = path.join(__dirname, '../src/data/seo-map.json');
const seoMap = JSON.parse(fs.readFileSync(seoMapPath, 'utf8'));

// 1. Update keywordMap
for (const entry of seoMap.keywordMap) {
  if (entry.slug === 'sparziel-rechner') {
    entry.slug = 'spardauer-rechner';
    entry.name = 'Spardauer-Rechner (Dauer bis zum Sparziel)';
    entry.url = '/rechner/spardauer-rechner/';
    entry.primaryKeyword = 'spardauer rechner';
    entry.secondaryKeywords = [
      'spardauer berechnen',
      'wie lange muss ich sparen',
      'dauer bis sparziel',
    ];
    entry.longtailKeywords = ['sparzeit bis wunschsumme rechner'];
    entry.questionKeywords = ['wie lange muss ich monatlich sparen'];
    entry.allKeywords = [
      'spardauer rechner',
      'spardauer berechnen',
      'wie lange muss ich sparen',
      'dauer bis sparziel',
      'sparzeit berechnen',
    ];
    entry.cannibalizationRisk = ['sparzielrechner', 'sparrechner'];
    entry.seoNotes = 'Inverse calculation to Sparzielrechner: determines duration in years and months for a given monthly savings rate.';
  } else if (entry.slug === 'autokredit-rechner') {
    entry.slug = 'ballonfinanzierung-rechner';
    entry.name = 'Ballonfinanzierung Rechner (Kfz-Kredit mit Schlussrate)';
    entry.url = '/rechner/ballonfinanzierung-rechner/';
    entry.primaryKeyword = 'ballonfinanzierung rechner';
    entry.secondaryKeywords = [
      'autokredit mit schlussrate',
      'kfz finanzierung monatsrate',
      'ballonfinanzierung rechner schlussrate',
      'schlussratenfinanzierung auto',
    ];
    entry.longtailKeywords = ['autokauf kredit schlussrate vergleich'];
    entry.allKeywords = [
      'ballonfinanzierung rechner',
      'autokredit mit schlussrate',
      'kfz finanzierung monatsrate',
      'ballonfinanzierung rechner schlussrate',
      'schlussratenfinanzierung auto',
    ];
    entry.cannibalizationRisk = ['autokreditrechner'];
    entry.seoNotes = 'Focused on vehicle balloon loans with large final payment (Schlussrate). Differentiated from standard amortizing autokreditrechner.';
  } else if (entry.slug === 'sparzielrechner') {
    entry.cannibalizationRisk = entry.cannibalizationRisk.filter((s: string) => s !== 'sparziel-rechner');
    entry.cannibalizationRisk.push('spardauer-rechner');
  } else if (entry.slug === 'autokreditrechner') {
    entry.cannibalizationRisk = entry.cannibalizationRisk.filter((s: string) => s !== 'autokredit-rechner');
    entry.cannibalizationRisk.push('ballonfinanzierung-rechner');
  } else if (entry.slug === 'sparrechner') {
    entry.cannibalizationRisk = entry.cannibalizationRisk.filter((s: string) => s !== 'sparziel-rechner');
    entry.cannibalizationRisk.push('spardauer-rechner');
  }
}

// 2. Update cannibalizationRisks section
if (seoMap.cannibalizationRisks) {
  let str = JSON.stringify(seoMap.cannibalizationRisks);
  str = str.replace(/"autokredit-rechner"/g, '"ballonfinanzierung-rechner"');
  str = str.replace(/"sparziel-rechner"/g, '"spardauer-rechner"');
  seoMap.cannibalizationRisks = JSON.parse(str);
}

fs.writeFileSync(seoMapPath, JSON.stringify(seoMap, null, 2), 'utf8');
console.log('Successfully updated src/data/seo-map.json');
