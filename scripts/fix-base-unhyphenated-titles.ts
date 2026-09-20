import fs from 'fs';
import path from 'path';

console.log('Auditing and repairing all remaining German titles with space before Rechner...');

function naturalizeGermanTitle(title: string): string {
  if (!/\s+Rechner\b/.test(title)) return title;

  const baseMap: Record<string, string> = {
    "Alter in Tagen Rechner": "Alter-in-Tagen-Rechner",
    "Lebenszeit in Stunden Rechner": "Lebenszeit-in-Stunden-Rechner",
    "Alter in Wochen Rechner": "Alter-in-Wochen-Rechner",
    "Alter in Monaten Rechner": "Alter-in-Monaten-Rechner",
    "Altersunterschied Rechner": "Altersunterschieds-Rechner",
    "Tage bis zum Geburtstag Rechner": "Tage-bis-zum-Geburtstag-Rechner",
    "Datumsdifferenz Rechner": "Datumsdifferenz-Rechner",
    "Wochen zwischen zwei Daten Rechner": "Wochen-zwischen-zwei-Daten-Rechner",
    "Monate zwischen zwei Daten Rechner": "Monate-zwischen-zwei-Daten-Rechner",
    "Kalendertage Rechner": "Kalendertage-Rechner",
    "Tage zwischen zwei Daten Rechner": "Tage-zwischen-zwei-Daten-Rechner",
    "Arbeitstage Rechner": "Arbeitstage-Rechner",
    "Werktage Rechner": "Werktage-Rechner",
    "Datum plus Tage Rechner": "Datum-plus-Tage-Rechner",
    "Datum minus Tage Rechner": "Datum-minus-Tage-Rechner",
    "Schaltjahr Rechner": "Schaltjahr-Rechner",
    "Zeitdifferenz Rechner": "Zeitdifferenz-Rechner",
    "Countdown Rechner": "Countdown-Rechner",
    "Prozentuale Veränderung Rechner": "Prozentuale-Veränderung-Rechner",
    "Grundwert Rechner": "Grundwert-Rechner",
    "Verhältnis Rechner": "Verhältnis-Rechner",
    "Dreieck Rechner": "Dreieck-Rechner",
    "Satz des Pythagoras Rechner": "Satz-des-Pythagoras-Rechner",
    "ggT Rechner": "ggT-Rechner",
    "kgV Rechner": "kgV-Rechner",
    "ETF-Sparplan Rechner": "ETF-Sparplan-Rechner",
    "Notgroschen Rechner": "Notgroschen-Rechner",
    "Restschuld Rechner": "Restschuld-Rechner",
    "Kraftstoffverbrauch Rechner": "Kraftstoffverbrauchs-Rechner",
    "Pendlerpauschale Rechner": "Pendlerpauschale-Rechner",
    "Elektroauto Ladekosten Rechner": "Elektroauto-Ladekosten-Rechner",
    "Fahrzeit Rechner": "Fahrzeit-Rechner",
    "CO2 Rechner für Autofahrten": "CO2-Rechner für Autofahrten",
    "Mietbelastungsquote Rechner": "Mietbelastungsquoten-Rechner",
    "Kaufnebenkosten Rechner": "Kaufnebenkosten-Rechner",
    "Immobilienrendite Rechner": "Immobilienrendite-Rechner",
    "Quadratmeterpreis Rechner": "Quadratmeterpreis-Rechner",
    "Mietbudget Rechner": "Mietbudget-Rechner",
    "Standby-Kosten Rechner": "Standby-Kosten-Rechner",
    "LED Ersparnis Rechner": "LED-Ersparnis-Rechner",
    "Gehaltserhöhung Rechner": "Gehaltserhöhungs-Rechner",
    "Urlaubstage Rechner": "Urlaubstage-Rechner",
    "BMI Rechner": "BMI-Rechner",
    "Kalorienbedarf Rechner": "Kalorienbedarf-Rechner",
    "Wasserbedarf Rechner": "Wasserbedarf-Rechner",
    "Laufpace Rechner": "Laufpace-Rechner",
    "Geburtstermin Rechner": "Geburtstermin-Rechner",
    "Fruchtbare Tage Rechner": "Fruchtbare-Tage-Rechner",
    "Farbmengen Rechner": "Farbmengen-Rechner",
    "Zylinder Rechner": "Zylinder-Rechner",
    "Rechteck Rechner": "Rechteck-Rechner",
    "Gramm in Milliliter Rechner": "Gramm-in-Milliliter-Rechner",
    "Marge & Handelsspanne Rechner": "Marge- & Handelsspannen-Rechner",
    "Mehrwertsteuer Rechner": "Mehrwertsteuer-Rechner",
    "Break-Even Rechner": "Break-Even-Rechner",
    "Notendurchschnitt Rechner": "Notendurchschnitt-Rechner",
    "Standardabweichung & Varianz Rechner": "Standardabweichung- & Varianz-Rechner",
    "Ohmsches Gesetz Rechner": "Ohmsches-Gesetz-Rechner",
  };

  for (const [k, v] of Object.entries(baseMap)) {
    if (title.includes(k)) {
      return title.replace(k, v);
    }
  }

  return title.replace(/(\S+)\s+Rechner\b/, '$1-Rechner');
}

const ALL_DATA_FILES = [
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
];

let totalRenamed = 0;

for (const relPath of ALL_DATA_FILES) {
  const filePath = path.resolve(relPath);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  const regex = /name:\s*(["'])(.+?\s+Rechner.*?)\1/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const quote = match[1];
    const oldName = match[2];
    const newName = naturalizeGermanTitle(oldName);
    if (newName !== oldName) {
      const fullMatch = `name: ${quote}${oldName}${quote}`;
      const fullReplace = `name: ${quote}${newName}${quote}`;
      content = content.replace(fullMatch, fullReplace);
      modified = true;
      totalRenamed++;
      console.log(`Renamed: "${oldName}" -> "${newName}"`);
    }
  }

  const shortRegex = /shortName:\s*(["'])(.+?\s+Rechner.*?)\1/g;
  while ((match = shortRegex.exec(content)) !== null) {
    const quote = match[1];
    const oldShort = match[2];
    const newShort = naturalizeGermanTitle(oldShort);
    if (newShort !== oldShort) {
      const fullMatch = `shortName: ${quote}${oldShort}${quote}`;
      const fullReplace = `shortName: ${quote}${newShort}${quote}`;
      content = content.replace(fullMatch, fullReplace);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Saved changes to ${relPath}`);
  }
}

console.log(`Finished base files! Total titles naturalized: ${totalRenamed}`);
