import { ALL_CALCULATORS } from '../src/data/calculators';
import fs from 'fs';
import path from 'path';

console.log('Auditing and repairing all German titles with space before Rechner...');

// Function to convert unnatural "[Term] Rechner" into proper German "[Term]-Rechner"
function naturalizeGermanTitle(title: string): string {
  // If already hyphenated or no " Rechner", keep
  if (!/\s+Rechner\b/.test(title)) return title;

  // Pattern like: "Kurzarbeitergeld Rechner (KUG...)" -> "Kurzarbeitergeld-Rechner (KUG...)"
  // Pattern like: "Minijob & Midijob Rechner (Übergangsbereich...)" -> "Minijob- & Midijob-Rechner (Übergangsbereich...)"
  // Pattern like: "Überstunden Auszahlung Rechner (...)" -> "Überstunden-Auszahlungs-Rechner (...)"

  let updated = title;

  // Specific high-frequency cases
  const specificMap: Record<string, string> = {
    "Plug-in-Hybrid Rechner": "Plug-in-Hybrid-Rechner",
    "Fahrgemeinschaft Rechner": "Fahrgemeinschafts-Rechner",
    "Motorrad Unterhaltskosten Rechner": "Motorrad-Unterhaltskosten-Rechner",
    "LKW-Maut Rechner Deutschland": "LKW-Maut-Rechner Deutschland",
    "Kurzarbeitergeld Rechner": "Kurzarbeitergeld-Rechner",
    "Minijob & Midijob Rechner": "Minijob- & Midijob-Rechner",
    "Arbeitgeber-Gesamtkosten Rechner": "Arbeitgeber-Gesamtkosten-Rechner",
    "Kündigungsfrist Rechner": "Kündigungsfrist-Rechner",
    "Überstunden Auszahlung Rechner": "Überstunden-Auszahlungs-Rechner",
    "Firmenwagen Geldwerter Vorteil Rechner": "Firmenwagen-Rechner (Geldwerter Vorteil)",
    "Krankengeld Rechner": "Krankengeld-Rechner",
    "Mutterschaftsgeld Rechner": "Mutterschaftsgeld-Rechner",
    "Elternzeit Teilzeit Rechner": "Elternzeit-Teilzeit-Rechner",
    "Sabbatical Rechner": "Sabbatical-Rechner",
    "Zuschläge Rechner": "Zuschläge-Rechner",
    "VL Rechner": "VL-Rechner",
    "Betriebliche Altersvorsorge Rechner": "Betriebliche-Altersvorsorge-Rechner (bAV)",
    "Jahresgehalt in Monatsgehalt Rechner": "Jahresgehalt-in-Monatsgehalt-Rechner",
    "Stundensatz Rechner für Freiberufler & Selbstständige": "Stundensatz-Rechner für Freiberufler & Selbstständige",
    "Urlaubsabgeltung Rechner": "Urlaubsabgeltungs-Rechner",
    "Arbeitslosengeld 1 Rechner": "Arbeitslosengeld-1-Rechner (ALG I)",
    "Bürgergeld Rechner": "Bürgergeld-Rechner",
    "Sachbezug & Jubiläumsgeschenk Rechner": "Sachbezug- & Jubiläumsgeschenk-Rechner",
    "Ehrenamtspauschale & Übungsleiterpauschale Rechner": "Ehrenamts- & Übungsleiterpauschalen-Rechner",
    "Grundumsatz Rechner": "Grundumsatz-Rechner (BMR)",
    "Leistungsumsatz & PAL-Faktor Rechner": "Leistungsumsatz- & PAL-Faktor-Rechner",
    "Makronährstoff Rechner": "Makronährstoff-Rechner",
    "Idealgewicht Rechner": "Idealgewicht-Rechner",
    "Körperfettanteil Rechner": "Körperfettanteil-Rechner (KFA)",
    "WHR Rechner": "WHR-Rechner (Taille-Hüft-Verhältnis)",
    "WHtR Rechner": "WHtR-Rechner (Taille zu Körpergröße)",
    "Maximalpuls Rechner": "Maximalpuls-Rechner (HFmax)",
    "VO2max Rechner": "VO2max-Rechner (Cooper-Test)",
    "1RM Rechner": "1RM-Rechner (One-Rep-Maximalgewicht)",
    "Schritte Rechner": "Schritte-Rechner (Schritte in km & Kalorien)",
    "Schlafzyklen & Schlafbedarfs Rechner": "Schlafzyklen- & Schlafbedarfs-Rechner",
    "Rauchstopp Rechner": "Rauchstopp-Rechner (Ersparnis & Gesundheit)",
    "Koffein Rechner": "Koffein-Rechner (Halbwertszeit & Wirkung)",
    "Alkoholabbau & Leberstoffwechsel Rechner": "Alkoholabbau-Rechner",
    "Intervallfasten Rechner": "Intervallfasten-Rechner (16:8-Methode)",
    "Proteinbedarf Rechner": "Proteinbedarf-Rechner (Eiweißmenge)",
    "Blutdruck Rechner": "Blutdruck-Rechner (WHO-Klassifikation)",
    "Puls-Trainingszonen Rechner": "Puls-Trainingszonen-Rechner",
    "Schwimmen Kalorienverbrauch Rechner": "Schwimm-Kalorienrechner",
    "Radfahren Kalorien & Watt Rechner": "Radfahr-Kalorien- & Watt-Rechner",
    "Elterngeld Rechner": "Elterngeld-Rechner (Basiselterngeld & Elterngeld Plus)",
    "Kindergeld & Kinderfreibetrag Rechner": "Kindergeld- & Kinderfreibetrag-Rechner",
    "Kinderzuschlag Rechner": "Kinderzuschlag-Rechner (KiZ)",
    "Unterhaltsvorschuss Rechner": "Unterhaltsvorschuss-Rechner (UVG)",
    "Düsseldorfer Tabelle Rechner": "Düsseldorfer-Tabelle-Rechner (Kindesunterhalt)",
    "Trennungsunterhalt Rechner": "Trennungsunterhalt-Rechner",
    "SSW Rechner": "SSW-Rechner (Schwangerschaftswoche & Trimester)",
    "Mutterschutz Rechner": "Mutterschutzfristen-Rechner",
    "Kindes-Endgröße Rechner": "Kindes-Endgrößen-Rechner",
    "Kindersitz Rechner": "Kindersitz-Rechner (i-Size & Normgruppen)",
    "Windel Rechner": "Windel-Budget-Rechner",
    "Erstausstattung Baby Rechner": "Baby-Erstausstattungs-Rechner",
    "Kita-Gebühren Rechner": "Kita-Gebühren-Rechner",
    "Familiengeld Rechner": "Familiengeld-Rechner",
    "Taschengeld Rechner": "Taschengeld-Rechner (Jugendamts-Empfehlung)",
    "Schulbedarfspaket Rechner": "Schulbedarfspaket-Rechner (BuT)",
    "Kinderkrankengeld Rechner": "Kinderkrankengeld-Rechner",
    "Großelternzeit Rechner": "Großelternzeit-Rechner",
    "Unterhalt volljährige Kinder Rechner": "Unterhalt-für-volljährige-Kinder-Rechner",
    "Ausbildungsvergütung Anrechnung Rechner": "Ausbildungsvergütung-Anrechnungs-Rechner",
    "Kinderbetreuungskosten Rechner": "Kinderbetreuungskosten-Rechner",
    "Estrich Rechner": "Estrich-Bedarfsrechner",
    "Dämmung U-Wert Rechner": "Dämmung-U-Wert-Rechner",
    "Dachfläche Rechner": "Dachflächen-Rechner",
    "Mauersteine Rechner": "Mauerstein-Bedarfsrechner",
    "Fliesenkleber & Fugenmörtel Rechner": "Fliesenkleber- & Fugenmörtel-Rechner",
    "Aushub & Erdarbeiten Rechner": "Aushub- & Erdarbeiten-Rechner",
    "Pflastersteine Rechner": "Pflasterstein-Rechner",
    "Trockenbau Gipskarton Rechner": "Trockenbau-Gipskarton-Rechner",
    "Fundament Rechner": "Fundament-Beton-Rechner",
    "Schalungssteine Rechner": "Schalungsstein-Rechner",
    "Fassadenfarbe Rechner": "Fassadenfarben-Rechner",
    "Parkett & Laminat Rechner": "Parkett- & Laminat-Rechner",
    "Tapeten Rechner": "Tapeten-Bedarfsrechner",
    "Brennholz Rechner": "Brennholz- & Raummeter-Rechner",
    "Putz Rechner": "Putz- & Mörtel-Rechner",
    "Zaun & Pfosten Rechner": "Zaun- & Pfosten-Rechner",
    "Regenwasser Zisterne Rechner": "Regenwasser-Zisternen-Rechner",
    "Treppenstufen Rechner": "Treppenstufen-Rechner (DIN 18065)",
    "Kies & Splitt Rechner": "Kies- & Splitt-Rechner",
    "Drainage & Gefälle Rechner": "Drainage- & Gefälle-Rechner",
    "Baugrund & Bodenpressung Rechner": "Baugrund- & Bodenpressungs-Rechner",
    "Holzbalken Durchbiegung Rechner": "Holzbalken-Durchbiegungs-Rechner",
    "Beton Mischungsverhältnis Rechner": "Beton-Mischungsverhältnis-Rechner",
  };

  for (const [k, v] of Object.entries(specificMap)) {
    if (updated.includes(k)) {
      updated = updated.replace(k, v);
      return updated;
    }
  }

  // Fallback regex replacement: replace " Rechner" with "-Rechner"
  return updated.replace(/(\S+)\s+Rechner\b/, '$1-Rechner');
}

const ALL_DATA_FILES = [
  'src/data/calculators/extra/autoArbeit.ts',
  'src/data/calculators/extra/wohnenHaushalt.ts',
  'src/data/calculators/extra/gesundheitFamilie.ts',
  'src/data/calculators/extra/bauenGeometrie.ts',
  'src/data/calculators/extra/einheitenKochen.ts',
  'src/data/calculators/extra/businessStatistik.ts',
  'src/data/calculators/extra/finanzenKredit.ts',
  'src/data/calculators/extra/datumMath.ts',
];

let totalRenamed = 0;

for (const relPath of ALL_DATA_FILES) {
  const filePath = path.resolve(relPath);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Find all name: "..." or name: '...' lines with " Rechner"
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

  // Also adjust corresponding shortName: "..."
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

console.log(`Finished! Total titles naturalized: ${totalRenamed}`);
