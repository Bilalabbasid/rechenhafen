import fs from 'fs';
import path from 'path';

// Exact mappings of titles from unnatural/anglicized spacing to natural German orthography
const TITLE_REPLACEMENTS: Record<string, string> = {
  // Geometrie & Bauen
  "Dreieck Rechner (Fläche, Umfang & Heron-Formel)": "Dreieck-Rechner (Fläche, Umfang & Heron-Formel)",
  "Kreisumfang Rechner (Umfang, Radius, Durchmesser & Fläche)": "Kreisumfang-Rechner (Umfang, Radius, Durchmesser & Fläche)",
  "Kegel Rechner (Volumen, Mantelfläche & Oberfläche)": "Kegel-Rechner (Volumen, Mantelfläche & Oberfläche)",
  "Hohlzylinder & Rohr Rechner (Volumen, Wandstärke & Materialgewicht)": "Hohlzylinder- & Rohr-Rechner (Volumen, Wandstärke & Materialgewicht)",
  "Pyramide Rechner (Volumen, Mantelfläche & Kantenlänge)": "Pyramide-Rechner (Volumen, Mantelfläche & Kantenlänge)",
  "Trapez Rechner (Flächeninhalt, Mittellinie & Umfang)": "Trapez-Rechner (Flächeninhalt, Mittellinie & Umfang)",
  "Parallelogramm Rechner (Fläche, Umfang & Höhen)": "Parallelogramm-Rechner (Fläche, Umfang & Höhen)",
  "Raute Rechner (Rhombus Fläche nach Diagonalen e & f)": "Raute-Rechner (Rhombus-Fläche nach Diagonalen e & f)",
  "Kugel Rechner (Volumen V = 4/3πr³ & Oberfläche O = 4πr²)": "Kugel-Rechner (Volumen V = 4/3πr³ & Oberfläche O = 4πr²)",
  "Quader Rechner (Volumen, Oberfläche & Raumdiagonale)": "Quader-Rechner (Volumen, Oberfläche & Raumdiagonale)",
  "Prisma Rechner (Volumen, Mantelfläche & Dreiecksprisma)": "Prisma-Rechner (Volumen, Mantelfläche & Dreiecksprisma)",
  "Sechseck Rechner (Regelmäßiges Hexagon Fläche & Inkreis)": "Sechseck-Rechner (Regelmäßiges Hexagon, Fläche & Inkreis)",
  "Ellipse Rechner (Fläche A = π · a · b & Ramanujan-Umfang)": "Ellipse-Rechner (Fläche A = π · a · b & Ramanujan-Umfang)",
  "Kreissektor & Kreissegment Rechner (Bogenlänge, Sehne & Fläche)": "Kreissektor- & Kreissegment-Rechner (Bogenlänge, Sehne & Fläche)",
  "Satz des Pythagoras Rechner (a² + b² = c² & Kathetensatz)": "Satz-des-Pythagoras-Rechner (a² + b² = c² & Kathetensatz)",
  "Sinussatz & Kosinussatz Rechner (Allgemeines Dreieck lösen)": "Sinussatz- & Kosinussatz-Rechner (Allgemeines Dreieck lösen)",
  "Vektor Skalarprodukt Rechner (3D-Vektoren & Schnittwinkel)": "Vektor-Skalarprodukt-Rechner (3D-Vektoren & Schnittwinkel)",
  "Torus Rechner (Volumen & Oberfläche eines Kreisrings / Donuts)": "Torus-Rechner (Volumen & Oberfläche eines Kreisrings)",
  "Kegelstumpf Rechner (Volumen, Mantelfläche & Eimerinhalt)": "Kegelstumpf-Rechner (Volumen, Mantelfläche & Eimerinhalt)",
  "Dreiecks Höhen Rechner (Höhen h_a, h_b, h_c & Inkreisradius)": "Dreiecks-Höhen-Rechner (Höhen h_a, h_b, h_c & Inkreisradius)",
  "Goldener Schnitt Rechner (Major a, Minor b & Phi = 1,618)": "Goldener-Schnitt-Rechner (Major a, Minor b & Phi = 1,618)",

  // Einheiten & Kochen
  "Datenrate & Downloadzeit Rechner (Mbit/s in MB/s & Download-Dauer)": "Datenrate- & Downloadzeit-Rechner (Mbit/s in MB/s & Download-Dauer)",
  "Zoll in cm Rechner (Inch & Diagonale für TV & Smartphones)": "Zoll-in-cm-Rechner (Inch & Diagonale für TV & Smartphones)",
  "Drehzahl & Schnittgeschwindigkeit Rechner (U/min, RPM in m/s & m/min)": "Drehzahl- & Schnittgeschwindigkeits-Rechner (U/min, RPM in m/s & m/min)",
  "Lux & Lumen Rechner (Beleuchtungsstärke für Wohn- & Arbeitsräume)": "Lux- & Lumen-Rechner (Beleuchtungsstärke für Wohn- & Arbeitsräume)",
  "Akku Kapazität & Ladung Rechner (mAh, Ah in Wh & Coulomb)": "Akku-Kapazitäts- & Ladungs-Rechner (mAh, Ah in Wh & Coulomb)",
  "Radioaktivität & Strahlendosis Rechner (Bq, Ci, Sievert & Gray)": "Radioaktivitäts- & Strahlendosis-Rechner (Bq, Ci, Sievert & Gray)",
  "Papierformat DIN Rechner (DIN A0 bis A8 Maße & Blattgewicht in Gramm)": "Papierformat-DIN-Rechner (DIN A0 bis A8 Maße & Blattgewicht in Gramm)",
  "Dezibel & Schalldruck Rechner (dB, Lautstärke & Pascal Pa)": "Dezibel- & Schalldruck-Rechner (dB, Lautstärke & Pascal Pa)",
  "Hefe Rechner (Frische Hefe in Trockenhefe & Vorteig umrechnen)": "Hefe-Rechner (Frische Hefe in Trockenhefe & Vorteig umrechnen)",
  "Esslöffel & Teelöffel in Gramm Rechner (EL, TL in g)": "Esslöffel- & Teelöffel-in-Gramm-Rechner (EL, TL in g)",
  "US Cups in Gramm Rechner (American Baking Cup Converter)": "US-Cups-in-Gramm-Rechner (Amerikanische Cup-Maße in Gramm)",
  "Zuckerersatz Rechner (Erythrit, Xylit, Stevia & Honig)": "Zuckerersatz-Rechner (Erythrit, Xylit, Stevia & Honig)",
  "Fleisch Kerntemperatur & Garzeit Rechner (Rind, Schwein & Geflügel)": "Fleisch-Kerntemperatur- & Garzeit-Rechner (Rind, Schwein & Geflügel)",
  "Pizza Teig Rechner (Hydratation 60–70 %, Mehl, Wasser & Hefe)": "Pizzateig-Rechner (Hydratation 60–70 %, Mehl, Wasser & Hefe)",
  "Bäckerprozente Rechner (Bäckermaß für Brot & Teigausbeute TA)": "Bäckerprozente-Rechner (Bäckermaß für Brot & Teigausbeute TA)",
  "Alkohol Verkochen Rechner (Restalkohol in Saucen & Schmorgerichten)": "Alkohol-Verkochungs-Rechner (Restalkohol in Saucen & Schmorgerichten)",
  "Ei-Ersatz Rechner (Vegane Alternativen für Backen & Kochen)": "Ei-Ersatz-Rechner (Vegane Alternativen für Backen & Kochen)",
  "Reis kochen Rechner (Wasser-Reis-Verhältnis & Garzeit nach Reissorte)": "Reiskoch-Rechner (Wasser-Reis-Verhältnis & Garzeit nach Reissorte)",
  "Nudeln Rechner (Trocken- vs. Gekocht-Gewicht & Portionsgröße)": "Nudelportions-Rechner (Trocken- vs. Gekocht-Gewicht & Portionsgröße)",
  "Sauerteig Rechner (Anstellgut füttern & Sauerteigführung 1:1:1)": "Sauerteig-Rechner (Anstellgut füttern & Sauerteigführung 1:1:1)",
  "Marmelade & Gelierzucker Rechner (1:1, 2:1 & 3:1 Zucker)": "Marmeladen- & Gelierzucker-Rechner (1:1, 2:1 & 3:1 Gelierzucker)",
  "Kaffee Rechner (Golden Cup Ratio Kaffeemehl in g nach Tassenanzahl)": "Kaffee-Rechner (Kaffeemehl nach Tassenanzahl & Brühverhältnis)",
  "Cocktail Alkoholgehalt Rechner (Vol.-% & Gramm reiner Alkohol)": "Cocktail-Alkoholgehalt-Rechner (Vol.-% & Gramm reiner Alkohol)",
  "Salzlake & Pökel Rechner (Lakegehalt in % & Nasspökeln)": "Salzlake- & Pökel-Rechner (Lakegehalt in % & Nasspökeln)",
  "Frittieröl & Rauchpunkt Rechner (Öl-Hitzebeständigkeit & Braten)": "Frittieröl- & Rauchpunkt-Rechner (Öl-Hitzebeständigkeit & Braten)",
  "Raclette & Fondue Mengen Rechner (Käse, Fleisch & Beilagen p.P.)": "Raclette- & Fondue-Mengen-Rechner (Käse, Fleisch & Beilagen p.P.)",
  "Kühlschrank Haltbarkeit Rechner (Lagerdauer geöffneter Lebensmittel)": "Kühlschrank-Haltbarkeits-Rechner (Lagerdauer geöffneter Lebensmittel)",
  "Tee Ziehzeit & Temperatur Rechner (Grüner, Schwarzer & Kräutertee)": "Tee-Ziehzeit- & Temperatur-Rechner (Grüner, Schwarzer & Kräutertee)",
  "Rezept Kalorien Rechner (Gesamtkalorien & Makros pro Portion)": "Rezept-Kalorien-Rechner (Gesamtkalorien & Makros pro Portion)",
  "Schokolade Temperieren Rechner (Impfmethode & Kuvertüre-Temperaturen)": "Schokolade-Temperieren-Rechner (Impfmethode & Kuvertüre-Temperaturen)",

  // Business & Kennzahlen
  "Deckungsbeitrag Rechner (DB I, Stückdeckungsbeitrag & DB-Quote)": "Deckungsbeitrag-Rechner (DB I, Stückdeckungsbeitrag & DB-Quote)",
  "ROAS Rechner (Return on Ad Spend & Break-Even-ROAS Marketing)": "ROAS-Rechner (Return on Ad Spend & Break-Even-ROAS)",
  "ROI Rechner (Return on Investment & Amortisationsdauer)": "ROI-Rechner (Return on Investment & Amortisationsdauer)",
  "EBIT & EBITDA Rechner (Operatives Ergebnis & Marge berechnen)": "EBIT- & EBITDA-Rechner (Operatives Ergebnis & Marge berechnen)",
  "Cashflow Rechner (Operativer Cashflow nach Praktiker-Formel)": "Cashflow-Rechner (Operativer Cashflow nach Praktiker-Formel)",
  "Liquiditätsgrad Rechner (Liquidität 1., 2. & 3. Grades)": "Liquiditätsgrad-Rechner (Liquidität 1., 2. & 3. Grades)",
  "Working Capital Rechner (Nettoumlaufvermögen & Working Capital Ratio)": "Working-Capital-Rechner (Nettoumlaufvermögen & Working Capital Ratio)",
  "Umsatzrentabilität Rechner (Umsatzrendite & Return on Sales ROS)": "Umsatzrentabilitäts-Rechner (Umsatzrendite & Return on Sales ROS)",
  "Eigenkapitalrentabilität Rechner (Return on Equity ROE & Leverage)": "Eigenkapitalrentabilitäts-Rechner (Return on Equity ROE & Leverage)",
  "Gesamtkapitalrentabilität Rechner (Return on Assets ROA & ROI)": "Gesamtkapitalrentabilitäts-Rechner (Return on Assets ROA & ROI)",
  "CAC Rechner (Customer Acquisition Cost & Kundengewinnungskosten)": "CAC-Rechner: Kundengewinnungskosten berechnen",
  "CLV Rechner (Customer Lifetime Value & Kundenwert berechnen)": "CLV-Rechner: Kundenwert berechnen",
  "Churn Rate Rechner (Kundenabwanderungsquote & MRR Churn berechnen)": "Churn-Rate-Rechner: Kundenabwanderungsquote berechnen",
  "Conversion Rate Rechner (Website-Besucher, Leads & Kaufabschlüsse)": "Conversion-Rate-Rechner: Leads & Verkäufe berechnen",
  "AfA Rechner (Lineare & Degressive Abschreibung nach AfA-Tabelle)": "AfA-Rechner: Lineare & degressive Abschreibung",
  "Skonto Jahreszins Rechner (Effektiver Jahreszins & Skonto vs. Kredit)": "Skonto-Jahreszins-Rechner: Effektiver Zins & Skonto-Vergleich",
  "Wareneinsatzquote Rechner (Food Cost & Wareneinsatz in %)": "Wareneinsatzquote-Rechner (Wareneinsatz in %)",
  "Lagerumschlag Rechner (Umschlagshäufigkeit & Lagerdauer in Tagen)": "Lagerumschlag-Rechner: Umschlagshäufigkeit & Lagerdauer",
  "Stundensatz Rechner für Freiberufler & Selbstständige (Kalkulation)": "Stundensatz-Rechner für Freiberufler & Selbstständige",

  // Statistik & Stochastik
  "Mittelwert, Median & Modus Rechner": "Mittelwert-, Median- & Modus-Rechner",
  "Stichprobenvarianz & Populationsvarianz Rechner": "Varianz- & Standardabweichungs-Rechner",
  "Korrelationskoeffizient Rechner (Pearson r)": "Korrelationskoeffizient-Rechner (Pearson r)",
  "Z-Score Rechner (Standardnormalverteilung)": "Z-Score-Rechner (Standardnormalverteilung)",
  "p-Wert Rechner (Z-Test Hypothesentest)": "p-Wert-Rechner (Hypothesentest & Z-Test)",
  "t-Test Rechner (Einstichproben-t-Test)": "t-Test-Rechner (Einstichproben-t-Test)",
  "Konfidenzintervall Rechner (Vertrauensbereich)": "Konfidenzintervall-Rechner (Vertrauensbereich)",
  "Stichprobengröße Rechner (Umfragen & Studien)": "Stichprobengrößen-Rechner (Umfragen & Studien)",
  "Quartile & Box-Plot Rechner (IQR)": "Quartile- & Box-Plot-Rechner (IQR)",
  "Binomialverteilung Rechner (Bernoulli-Kette)": "Binomialverteilungs-Rechner (Bernoulli-Kette)",
  "Poisson-Verteilung Rechner (Ereignisrate λ)": "Poisson-Verteilungs-Rechner (Ereignisrate λ)",
  "Kombinatorik Rechner (n über k & Permutationen)": "Kombinatorik-Rechner (n über k & Permutationen)",
  "Lineare Regression Rechner (y = ax + b & R²)": "Lineare-Regression-Rechner (y = mx + b & R²)",
  "Kovarianz Rechner (Cov(X, Y))": "Kovarianz-Rechner (Cov(X, Y))",
  "Variationskoeffizient Rechner (CV in %)": "Variationskoeffizient-Rechner (CV in %)",
  "Geometrisches Mittel Rechner (Wachstumsraten)": "Geometrisches-Mittel-Rechner (Wachstumsraten)",
  "Harmonisches Mittel Rechner (Geschwindigkeit & Kurse)": "Harmonisches-Mittel-Rechner (Geschwindigkeiten & Kurse)",
  "Bayes-Theorem Rechner (Bedingte Wahrscheinlichkeit)": "Bayes-Theorem-Rechner (Bedingte Wahrscheinlichkeit)",
  "Perzentil Rechner (Rang & Quantil)": "Perzentil-Rechner (Rang & Quantil)",
  "Effektstärke Rechner (Cohen's d)": "Effektstärke-Rechner (Cohen's d)",
  "Chi-Quadrat Rechner (2x2 Kontingenztafel)": "Chi-Quadrat-Rechner (2x2-Kontingenztafel)",
};

const EXTRA_DIR = path.resolve('src/data/calculators/extra');
const files = fs.readdirSync(EXTRA_DIR).filter(f => f.endsWith('.ts') && f !== 'index.ts');

let replacementsCount = 0;

for (const file of files) {
  const filePath = path.join(EXTRA_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let fileModified = false;

  for (const [oldTitle, newTitle] of Object.entries(TITLE_REPLACEMENTS)) {
    // Check both single and double quotes
    const patterns = [
      `name: '${oldTitle}'`,
      `name: "${oldTitle}"`,
      `"name": "${oldTitle}"`,
      `'name': '${oldTitle}'`,
    ];

    for (const pat of patterns) {
      if (content.includes(pat)) {
        const quote = pat.includes('"') ? '"' : "'";
        const key = pat.startsWith('"name"') ? '"name"' : (pat.startsWith("'name'") ? "'name'" : 'name');
        content = content.replace(pat, `${key}: ${quote}${newTitle}${quote}`);
        replacementsCount++;
        fileModified = true;
      }
    }

    // Also update shortName and h1 if they match oldTitle or part of it
    const baseOld = oldTitle.split('(')[0].trim();
    const baseNew = newTitle.split('(')[0].trim().split(':')[0].trim();
    if (baseOld !== baseNew) {
      const shortPat1 = `shortName: "${baseOld}"`;
      const shortPat2 = `shortName: '${baseOld}'`;
      if (content.includes(shortPat1)) {
        content = content.replace(shortPat1, `shortName: "${baseNew}"`);
        fileModified = true;
      }
      if (content.includes(shortPat2)) {
        content = content.replace(shortPat2, `shortName: '${baseNew}'`);
        fileModified = true;
      }
    }
  }

  // Also replace "Download-Rate" with "Download-Geschwindigkeit (Mbit/s)"
  if (content.includes("Internet-Geschwindigkeit (Download-Rate)")) {
    content = content.replace(/Internet-Geschwindigkeit \(Download-Rate\)/g, "Download-Geschwindigkeit (Mbit/s)");
    replacementsCount++;
    fileModified = true;
  }

  if (fileModified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}

console.log(`Successfully completed ${replacementsCount} German title & label updates!`);
