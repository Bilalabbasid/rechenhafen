import fs from 'fs';
import path from 'path';
import { ALL_CALCULATORS } from '../src/data/calculators';
import { CATEGORIES } from '../src/data/categories';
import seoMap from '../src/data/seo-map.json';

// ---------------------------------------------------------------------------
// 1. Map SEO primary keywords
// ---------------------------------------------------------------------------
const seoKeywordMap = new Map<string, any>();
for (const entry of (seoMap as any).keywordMap) {
  seoKeywordMap.set(entry.slug, entry);
}

// Check cannibalization overrides
const CANNIBALIZATION_DIFFERENTIATIONS: Record<string, {
  primaryKeyword: string;
  metaTitle: string;
  h1: string;
  metaDescription: string;
  shortDescription: string;
}> = {
  'autokreditrechner': {
    primaryKeyword: 'autokreditrechner',
    metaTitle: 'Autokreditrechner – Monatsrate für Kfz-Kredit berechnen',
    h1: 'Autokreditrechner – Kfz-Ratenkredit berechnen',
    metaDescription: 'Berechnen Sie die Monatsrate für Ihren Autokredit mit Kaufpreis, Anzahlung und Laufzeit. Inklusive Gesamtzinsen und Tilgungsverlauf.',
    shortDescription: 'Berechnet die monatliche Kreditrate für Ihren Autokauf unter Berücksichtigung von Anzahlung und Zinsen nach deutschem Standard.',
  },
  'autokredit-rechner': {
    primaryKeyword: 'ballonfinanzierung rechner',
    metaTitle: 'Ballonfinanzierung Rechner – Autokredit mit Schlussrate',
    h1: 'Ballonfinanzierung Rechner – Kfz-Kredit mit Schlussrate',
    metaDescription: 'Berechnen Sie Ihre Kfz-Ballonfinanzierung: Niedrige Monatsraten während der Laufzeit und transparente Schlussrate im Zinsvergleich.',
    shortDescription: 'Ermittelt Ratenhöhe und Gesamtkosten für eine Kfz-Ballonfinanzierung mit vereinbarter Schlussrate im Vergleich zum Ratenkredit.',
  },
  'sparzielrechner': {
    primaryKeyword: 'sparzielrechner',
    metaTitle: 'Sparzielrechner – Monatliche Sparrate für Ihr Ziel berechnen',
    h1: 'Sparzielrechner – Sparrate für Wunschkapital ermitteln',
    metaDescription: 'Ermitteln Sie die exakte monatliche Sparrate, um Ihr Wunschkapital termingerecht mit Verzinsung und Zinseszins aufzubauen.',
    shortDescription: 'Ermittelt die exakte monatliche Sparrate für Ihr persönliches finanzielles Sparziel unter Einbezug von Zins und Zinseszins.',
  },
  'sparziel-rechner': {
    primaryKeyword: 'sparrate rechner sparziel',
    metaTitle: 'Sparrate Rechner – Vermögensaufbau & Zielhorizont berechnen',
    h1: 'Sparrate Rechner – Vermögensziel & Anlagedauer ermitteln',
    metaDescription: 'Berechnen Sie den Sparaufwand für Ihr Sparziel: Erforderliche Einzahlungen, Zinseszinseffekt und Anlagehorizont im genauen Detail.',
    shortDescription: 'Berechnet die notwendige monatliche Einzahlung und Anlagedauer, um ein Wunschvermögen mit Zinseszins aufzubauen.',
  },
  'datumsdifferenz': {
    primaryKeyword: 'datumsdifferenz',
    metaTitle: 'Datumsdifferenz Rechner – Tage, Wochen & Monate berechnen',
    h1: 'Datumsdifferenz Rechner – Abstand zweier Daten ermitteln',
    metaDescription: 'Berechnen Sie die genaue Differenz zwischen zwei Kalenderdaten in Tagen, Wochen, Monaten und Jahren schnell und exakt.',
    shortDescription: 'Ermittelt die exakte Zeitspanne zwischen zwei Kalenderdaten in Tagen, Wochen, vollen Monaten und Jahren.',
  },
  'tage-zwischen-zwei-daten': {
    primaryKeyword: 'arbeitstage rechner',
    metaTitle: 'Tage zwischen zwei Daten – Werktage & Kalendertage Rechner',
    h1: 'Tage zwischen zwei Daten – Arbeitstage & Zeitspannen',
    metaDescription: 'Berechnen Sie Kalendertage und Arbeitstage zwischen zwei Stichtagen mit Wochenendabzug für Projektplanung und Fristen.',
    shortDescription: 'Berechnet Werktage und Kalendertage zwischen zwei Datumsangaben für die präzise Arbeits- und Fristenplanung.',
  },
  'geburtstagsrechner': {
    primaryKeyword: 'geburtstagsrechner',
    metaTitle: 'Geburtstagsrechner – Exaktes Alter & Wochentag der Geburt',
    h1: 'Geburtstagsrechner – Alter & Geburtswochentag ermitteln',
    metaDescription: 'Erfahren Sie Ihr genaues Alter in Tagen, den Wochentag Ihrer Geburt und spannende Meilensteine mit dem Geburtstagsrechner.',
    shortDescription: 'Ermittelt Ihr exaktes Alter in Tagen und Stunden sowie den Wochentag Ihrer Geburt und kommende runde Jubiläen.',
  },
  'tage-bis-geburtstag': {
    primaryKeyword: 'tage bis zum geburtstag',
    metaTitle: 'Tage bis zum Geburtstag – Countdown & Schlafeinheiten',
    h1: 'Geburtstags-Countdown – Tage bis zum nächsten Geburtstag',
    metaDescription: 'Wie viele Tage sind es noch bis zum Geburtstag? Berechnen Sie verbleibende Tage, Wochen und Stunden mit dem Countdown-Rechner.',
    shortDescription: 'Zählt die verbleibenden Tage, Wochen und Schlafeinheiten bis zum nächsten Geburtstag für Vorfreude und Eventplanung.',
  },
  'inflationsrechner': {
    primaryKeyword: 'inflationsrechner',
    metaTitle: 'Inflationsrechner – Kaufkraftverlust & Teuerung berechnen',
    h1: 'Inflationsrechner – Historische & zukünftige Geldentwertung',
    metaDescription: 'Berechnen Sie den Kaufkraftverlust Ihres Geldes durch Inflation über beliebige Zeiträume anhand der Verbraucherpreisindizes.',
    shortDescription: 'Berechnet den realen Kaufkraftverlust Ihres Geldes über vergangene und zukünftige Jahre anhand realistischer Inflationsraten.',
  },
  'kaufkraftverlust-rechner': {
    primaryKeyword: 'kaufkraftverlust ersparnisse',
    metaTitle: 'Kaufkraftverlust Rechner – Realwert von Ersparnissen',
    h1: 'Kaufkraftverlust Rechner – Reale Rendite nach Inflation',
    metaDescription: 'Ermitteln Sie den realen Wertverlust von Sparvermögen, Tagesgeld und Festgeld unter Berücksichtigung von Zins und Inflationsrate.',
    shortDescription: 'Berechnet den inflationsbereinigten Realwert Ihrer Ersparnisse und Festgelder nach Abzug der jährlichen Teuerungsrate.',
  },
  'notgroschen-rechner': {
    primaryKeyword: 'notgroschen rechner',
    metaTitle: 'Notgroschen Rechner – Finanzpolster nach Monatsausgaben',
    h1: 'Notgroschen Rechner – Die 3-Monats-Faustformel berechnen',
    metaDescription: 'Berechnen Sie Ihre ideale Notgroschen-Höhe nach der bewährten Faustformel von 3 bis 6 Monatsausgaben für finanzielle Sicherheit.',
    shortDescription: 'Ermittelt die empfohlene Höhe Ihrer eisernen Reserve basierend auf Ihren monatlichen Fixkosten und Lebenshaltungsausgaben.',
  },
  'liquiditaetsreserve-rechner': {
    primaryKeyword: 'liquiditaetsreserve rechner',
    metaTitle: 'Liquiditätsreserve Rechner für Selbstständige & Haushalte',
    h1: 'Liquiditätsreserve Rechner – Puffer für Steuern & Fixkosten',
    metaDescription: 'Berechnen Sie die notwendige Liquiditätsreserve für Selbstständige und Unternehmer zur Absicherung von Steuern und Fixkosten.',
    shortDescription: 'Kalkuliert die erforderliche Liquiditätsreserve für Freiberufler und Gewerbetreibende zur Absicherung von Steuerrücklagen.',
  },
  'standardabweichung-rechner': {
    primaryKeyword: 'standardabweichung rechner',
    metaTitle: 'Standardabweichung Rechner – Grundgesamtheit (Population σ)',
    h1: 'Standardabweichung Rechner – Populationsstreuung berechnen',
    metaDescription: 'Berechnen Sie Varianz σ² und Standardabweichung σ für die Grundgesamtheit mit Schritt-für-Schritt-Rechenweg und Datenreihe.',
    shortDescription: 'Berechnet Varianz und Standardabweichung einer vollständigen Population (N) mit detailliertem Rechenweg und Mittelwert.',
  },
  'varianz-standardabweichung-stichprobe-rechner': {
    primaryKeyword: 'stichprobenvarianz rechner',
    metaTitle: 'Stichprobenvarianz Rechner – Standardabweichung s (n-1)',
    h1: 'Stichprobenvarianz Rechner – Bessel-Korrektur (n-1) nutzen',
    metaDescription: 'Ermitteln Sie die erwartungstreue Stichprobenvarianz s² und Standardabweichung s mit Bessel-Korrektur (n-1) für empirische Studien.',
    shortDescription: 'Ermittelt die empirische Stichprobenvarianz und Standardabweichung mit Bessel-Korrektur (n-1) für wissenschaftliche Datensätze.',
  },
  'kreisrechner': {
    primaryKeyword: 'kreisrechner',
    metaTitle: 'Kreisrechner – Radius, Durchmesser, Fläche & Umfang',
    h1: 'Kreisrechner – Alle Kreiswerte aus einer Angabe berechnen',
    metaDescription: 'Berechnen Sie Radius, Durchmesser, Kreisfläche und Kreisumfang aus einem beliebigen bekannten Wert mit Formel und Rechenweg.',
    shortDescription: 'Ermittelt Radius, Durchmesser, Flächeninhalt und Kreisumfang aus einer einzigen beliebigen Eingabegröße mit Rechenweg.',
  },
  'kreis-umfang-rechner': {
    primaryKeyword: 'kreisumfang rechner',
    metaTitle: 'Kreisumfang Rechner – Umfang berechnen mit U = 2·π·r',
    h1: 'Kreisumfang Rechner – Exakten Umfang aus Radius berechnen',
    metaDescription: 'Berechnen Sie den Kreisumfang direkt aus Radius oder Durchmesser nach der Formel U = 2·π·r mit präzisen Einheiten.',
    shortDescription: 'Berechnet den genauen Umfang eines Kreises aus Radius oder Durchmesser nach der mathematischen Formel U = 2·π·r.',
  },
  'kreditrechner': {
    primaryKeyword: 'kreditrechner',
    metaTitle: 'Kreditrechner – Ratenkredit, Monatsrate & Zinskosten',
    h1: 'Kreditrechner – Monatliche Rate & Zinskosten berechnen',
    metaDescription: 'Berechnen Sie die Monatsrate, Gesamtzinskosten und Tilgungsverlauf für Ihren Ratenkredit transparent und werbefrei online.',
    shortDescription: 'Ermittelt Monatsrate, Zinsaufwand und Tilgungsplan für Raten- und Konsumentenkredite mit festem Zinssatz.',
  },
  'privatkredit-rechner': {
    primaryKeyword: 'privatkredit rechner',
    metaTitle: 'Privatkredit Rechner – Konsumentenkredit zur freien Verwendung',
    h1: 'Privatkredit Rechner – Konsumentenkredit online planen',
    metaDescription: 'Ermitteln Sie Monatsrate und Kreditkosten für einen Privatkredit zur freien Verwendung für Möbel, Renovierung oder Anschaffungen.',
    shortDescription: 'Kalkuliert die monatliche Kreditbelastung für freie Privatdarlehen ohne Zweckbindung mit flexiblen Laufzeiten.',
  },
  'tilgungsrechner': {
    primaryKeyword: 'tilgungsrechner',
    metaTitle: 'Tilgungsrechner – Tilgungsplan für Baufinanzierung erstellen',
    h1: 'Tilgungsrechner – Darlehenstilgung mit Zinsbindung planen',
    metaDescription: 'Erstellen Sie Ihren Tilgungsplan mit Anfangstilgung, Sollzinsbindung und Restschuld für Ihre Baufinanzierung oder Hypothek.',
    shortDescription: 'Erstellt einen vollständigen Tilgungsplan für Annuitätendarlehen mit Anfangstilgung, Zinsbindungsdauer und Restschuld.',
  },
  'baufinanzierung-rechner': {
    primaryKeyword: 'baufinanzierung rechner',
    metaTitle: 'Baufinanzierungsrechner – Immobilienkredit & Nebenkosten',
    h1: 'Baufinanzierungsrechner – Gesamte Immobilienfinanzierung',
    metaDescription: 'Berechnen Sie Ihre Immobilienfinanzierung inklusive Kaufpreis, Nebenkosten, Eigenkapitalquote und monatlicher Annuitätenrate.',
    shortDescription: 'Kalkuliert die ganzheitliche Baufinanzierung inklusive Kaufnebenkosten, Eigenkapitaleinsatz und monatlicher Finanzierungsrate.',
  },
  'spritkosten-rechner': {
    primaryKeyword: 'spritkostenrechner',
    metaTitle: 'Spritkostenrechner – Fahrtkosten für Strecken berechnen',
    h1: 'Spritkostenrechner – Benzin- & Dieselkosten je Fahrt',
    metaDescription: 'Berechnen Sie die Spritkosten für jede Fahrtstrecke nach Distanz, Durchschnittsverbrauch und aktuellem Kraftstoffpreis je Liter.',
    shortDescription: 'Berechnet die Kraftstoffkosten einer Autofahrt basierend auf Streckenlänge, Durchschnittsverbrauch und aktuellem Spritpreis.',
  },
  'spritverbrauch-rechner': {
    primaryKeyword: 'spritverbrauch rechner',
    metaTitle: 'Spritverbrauch Rechner – Verbrauch auf 100 km ermitteln',
    h1: 'Spritverbrauch Rechner – Durchschnittsverbrauch auf 100 km',
    metaDescription: 'Berechnen Sie den exakten Kraftstoffverbrauch Ihres Fahrzeugs auf 100 Kilometer aus gefahrenen Kilometern und getankten Litern.',
    shortDescription: 'Ermittelt den tatsächlichen Durchschnittsverbrauch Ihres Fahrzeugs auf 100 Kilometer anhand getankter Liter und Kilometerstand.',
  },
  'bmi-rechner': {
    primaryKeyword: 'bmi rechner',
    metaTitle: 'BMI Rechner – Body-Mass-Index nach WHO online berechnen',
    h1: 'BMI Rechner – Body-Mass-Index mit Alter & Geschlecht',
    metaDescription: 'Berechnen Sie Ihren Body-Mass-Index (BMI) nach den offiziellen Standards der WHO inklusive Alters- und Geschlechtseinstufung.',
    shortDescription: 'Ermittelt Ihren Body-Mass-Index (BMI) nach WHO-Klassifikation mit personalisierter Interpretation für Erwachsene.',
  },
  'idealgewicht-rechner': {
    primaryKeyword: 'idealgewicht rechner',
    metaTitle: 'Idealgewicht Rechner – Nach Broca, Lorenz & Creff berechnen',
    h1: 'Idealgewicht Rechner – Normal- & Idealgewicht ermitteln',
    metaDescription: 'Berechnen Sie Ihr optimales Körpergewicht nach anerkannten wissenschaftlichen Formeln (Broca, Lorenz, Creff) im direkten Vergleich.',
    shortDescription: 'Vergleicht Ihr Normal- und Idealgewicht nach den klassischen Berechnungsverfahren von Broca, Lorenz und Creff.',
  },
  'vorfaelligkeitsentschaedigung-rechner': {
    primaryKeyword: 'vorfaelligkeitsentschaedigung ratenkredit',
    metaTitle: 'Vorfälligkeitsentschädigung Ratenkredit (§ 502 BGB)',
    h1: 'Vorfälligkeitsentschädigung Ratenkredit – Kosten berechnen',
    metaDescription: 'Berechnen Sie die gesetzliche Vorfälligkeitsentschädigung für Ratenkredite nach § 502 BGB mit maximal 1 % bzw. 0,5 % Deckelung.',
    shortDescription: 'Berechnet die gesetzliche Obergrenze der Vorfälligkeitsentschädigung bei vorzeitiger Rückzahlung eines Ratenkredits (§ 502 BGB).',
  },
  'vorfaelligkeitsentschaedigung-baufinanzierung-rechner': {
    primaryKeyword: 'vorfaelligkeitsentschaedigung baufinanzierung',
    metaTitle: 'Vorfälligkeitsentschädigung Baufinanzierung Rechner',
    h1: 'Vorfälligkeitsentschädigung Baufinanzierung – BGH-Methode',
    metaDescription: 'Berechnen Sie die Vorfälligkeitsentschädigung für Immobiliardarlehen nach der BGH Aktiv-Passiv-Methode bei vorzeitiger Kündigung.',
    shortDescription: 'Schätzt die Bankenentschädigung bei vorzeitiger Kündigung eines Immobilienkredits nach der anerkannten Aktiv-Passiv-Methode.',
  },
  'arbeitstage-rechner': {
    primaryKeyword: 'arbeitstage rechner bundesland',
    metaTitle: 'Arbeitstage Rechner – Arbeitstage pro Jahr nach Bundesland',
    h1: 'Arbeitstage Rechner – Arbeitstage im Kalenderjahr ermitteln',
    metaDescription: 'Berechnen Sie die gesetzlichen Arbeitstage pro Jahr und Monat für alle 16 Bundesländer inklusive gesetzlicher Feiertage.',
    shortDescription: 'Ermittelt die exakte Anzahl der Arbeitstage im Jahr oder Monat für alle deutschen Bundesländer mit Feiertagsberechnung.',
  },
  'tage-zwischen-zwei-daten': {
    primaryKeyword: 'tage zwischen zwei daten rechner',
    metaTitle: 'Tage zwischen zwei Daten – Werktage & Kalendertage Rechner',
    h1: 'Tage zwischen zwei Daten – Zeitspannen exakt berechnen',
    metaDescription: 'Berechnen Sie Kalendertage und Werktage zwischen zwei Stichtagen mit Wochenendabzug für Projektplanung und Fristen.',
    shortDescription: 'Berechnet Werktage und Kalendertage zwischen zwei Datumsangaben für die präzise Fristen- und Projektplanung.',
  },
  'restschuld-rechner': {
    primaryKeyword: 'restschuld rechner baufinanzierung',
    metaTitle: 'Restschuld Rechner – Restschuld nach Zinsbindung berechnen',
    h1: 'Restschuld Rechner – Verbleibende Darlehensschuld ermitteln',
    metaDescription: 'Berechnen Sie die verbleibende Restschuld Ihres Kredits am Ende der Zinsbindungsfrist mit Tilgungsplan und Zinseszins.',
    shortDescription: 'Ermittelt die verbleibende Darlehensrestschuld zum Ende der Zinsbindung für eine fundierte Anschlussfinanzierung.',
  },
  'kredit-restschuld-stichtag-rechner': {
    primaryKeyword: 'restschuld stichtag rechner',
    metaTitle: 'Restschuld zum Stichtag Rechner – Exakte Kreditschuld ermitteln',
    h1: 'Restschuld zum Stichtag Rechner – Kreditsaldo taggenau berechnen',
    metaDescription: 'Ermitteln Sie die exakte Darlehensrestschuld zu einem beliebigen Wunsch-Stichtag für Kündigung, Ablösung oder Sondertilgung.',
    shortDescription: 'Berechnet den exakten Kreditsaldo zu einem individuellen Kalenderstichtag für Umschuldung oder vorzeitige Darlehensablösung.',
  },
  'regenwasser-zisterne-rechner': {
    primaryKeyword: 'regenwasser zisterne rechner',
    metaTitle: 'Zisternen Rechner – Ideales Tankvolumen für Regenwasser',
    h1: 'Zisternen Rechner – Tankvolumen für Regenwassernutzung',
    metaDescription: 'Berechnen Sie die optimale Zisternengröße nach Dachfläche, Bedachungsart, Niederschlag und Nutzung (Garten, WC, Haushalt).',
    shortDescription: 'Berechnet das empfohlene Speichervolumen einer Regenwasserzisterne nach DIN 1989 für Gartenbewässerung und Haustechnik.',
  }
};

function countWords(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

// ---------------------------------------------------------------------------
// 2. Title Shortening & Optimization
// ---------------------------------------------------------------------------
function optimizeTitle(calc: any): string {
  if (CANNIBALIZATION_DIFFERENTIATIONS[calc.slug]) {
    return CANNIBALIZATION_DIFFERENTIATIONS[calc.slug].metaTitle;
  }

  let title = calc.metaTitle;
  if (title.length <= 62 && title.length >= 35) {
    return title;
  }

  // Remove common verbose filler
  title = title
    .replace(/\s+online berechnen/gi, '')
    .replace(/\s+online ermitteln/gi, '')
    .replace(/\s+schnell & einfach berechnen/gi, '')
    .replace(/\s+exakt berechnen/gi, '')
    .replace(/\s+berechnen & vergleichen/gi, '')
    .replace(/\s+berechnen & planen/gi, '')
    .replace(/\s+berechnen & prüfen/gi, '')
    .replace(/\s+online kalkulieren/gi, '')
    .trim();

  // If still > 62, shorten subtitles or parentheticals
  if (title.length > 62 && title.includes(' – ')) {
    const parts = title.split(' – ');
    const main = parts[0];
    let sub = parts.slice(1).join(' – ');
    // shorten sub
    if (sub.includes('(')) {
      sub = sub.replace(/\s*\([^)]*\)/g, '').trim();
    }
    if (sub.includes('&')) {
      const subParts = sub.split('&').map((s: string) => s.trim());
      if (subParts.length > 1) {
        sub = subParts[0];
      }
    }
    title = `${main} – ${sub}`.trim();
  }

  if (title.length > 62 && title.includes('(')) {
    title = title.replace(/\s*\([^)]*\)/g, '').trim();
  }

  if (title.length > 62) {
    title = title.slice(0, 59).replace(/[\s–,-]+$/, '') + '...';
  }

  // If too short (< 35)
  if (title.length < 35) {
    title = `${title} – RechenHafen`;
  }

  return title;
}

// ---------------------------------------------------------------------------
// 3. Meta Description Optimization
// ---------------------------------------------------------------------------
function optimizeDescription(calc: any): string {
  if (CANNIBALIZATION_DIFFERENTIATIONS[calc.slug]) {
    return CANNIBALIZATION_DIFFERENTIATIONS[calc.slug].metaDescription;
  }

  let desc = calc.metaDescription.trim();

  // If > 155
  if (desc.length > 155) {
    // try to shorten
    if (desc.includes(' nach §') || desc.includes(' gemäß §')) {
      desc = desc.replace(/\s+(?:nach|gemäß)\s+§\s*[^:]+:/gi, ':');
    }
    desc = desc
      .replace(/\s+schnell und einfach\b/gi, '')
      .replace(/\s+Schritt für Schritt\b/gi, '')
      .replace(/\s+nach offiziellen Richtlinien\b/gi, '')
      .replace(/\s+gemäß aktuellem Kraftfahrzeugsteuergesetz \(KraftStG\)/gi, '')
      .trim();

    if (desc.length > 155) {
      // Cut at last punctuation or clause before 155
      const truncated = desc.slice(0, 152);
      const lastPeriod = truncated.lastIndexOf('.');
      const lastComma = truncated.lastIndexOf(',');
      const cutPoint = lastPeriod > 100 ? lastPeriod + 1 : (lastComma > 115 ? lastComma : -1);
      if (cutPoint !== -1) {
        desc = desc.slice(0, cutPoint).trim();
      } else {
        const lastSpace = truncated.lastIndexOf(' ');
        desc = (lastSpace > 110 ? desc.slice(0, lastSpace) : truncated).trim() + '.';
      }
    }
  }

  // If < 118
  if (desc.length < 118) {
    if (!desc.endsWith('.')) desc += '.';
    const additions = [
      ' Inklusive exakter Formel und übersichtlichem Rechenbeispiel.',
      ' Mit praxisnaher Formelerklärung und schnellem Ergebnis.',
      ' Transparent, verlässlich und kostenfrei auf RechenHafen.',
    ];
    for (const add of additions) {
      if (desc.length + add.length <= 155) {
        desc += add;
        break;
      }
    }
  }

  return desc;
}

// ---------------------------------------------------------------------------
// 4. Short Description (Opening paragraph) Optimization
// ---------------------------------------------------------------------------
function optimizeShortDescription(calc: any): string {
  if (CANNIBALIZATION_DIFFERENTIATIONS[calc.slug]) {
    return CANNIBALIZATION_DIFFERENTIATIONS[calc.slug].shortDescription;
  }

  let sd = calc.shortDescription.trim();
  const words = sd.split(/\s+/);
  if (words.length >= 10 && words.length <= 30) {
    return sd;
  }

  if (words.length < 10) {
    // Expand brief descriptions
    const base = sd.replace(/\.$/, '');
    sd = `${base} mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.`;
  }

  return sd;
}

// ---------------------------------------------------------------------------
// 5. Editorial Content Generator
// ---------------------------------------------------------------------------
function getEditorialContent(calc: any): { intro: string; details: string } {
  const name = calc.name.replace(/\s*\([^)]*\)/g, '').trim();
  const cat = CATEGORIES.find(c => c.slug === calc.category);
  const catName = cat?.name || calc.category;

  let intro = calc.content?.intro || '';
  let details = calc.content?.details || '';

  if (!intro) {
    intro = `Mit dem ${name} ermitteln Sie wichtige Kennzahlen und Ergebnisse im Bereich ${catName} schnell und methodisch fundiert. Das Tool führt die mathematische Berechnung transparent durch und erleichtert fundierte Entscheidungen.`;
  }

  if (!details) {
    details = `Achten Sie bei der Eingabe auf konsistente Einheiten und realistische Ausgangswerte. Die Berechnung basiert auf anerkannten fachlichen Formeln und bietet eine verlässliche Orientierung für Alltag und Praxis.`;
  }

  const totalWords = countWords(intro) + countWords(details);
  if (totalWords < 28) {
    if (!intro.endsWith('.')) intro += '.';
    intro += ` Alle Berechnungen erfolgen deterministisch und basieren auf anerkannten mathematischen Standards.`;
    if (!details.endsWith('.')) details += '.';
    details += ` Vergleichen Sie verschiedene Szenarien, um die optimale Entscheidung für Ihr Vorhaben zu treffen.`;
  }

  return { intro, details };
}

// ---------------------------------------------------------------------------
// 6. FAQ Enrichment
// ---------------------------------------------------------------------------
function enrichFaqs(calc: any): Array<{ question: string; answer: string }> {
  const existing = calc.faqs ? [...calc.faqs] : [];
  if (existing.length >= 2) return existing;

  const name = calc.name.replace(/\s*\([^)]*\)/g, '').trim();

  // Add relevant second FAQ
  const secondFaq = {
    question: `Welche Eingabewerte sind für den ${name} besonders wichtig?`,
    answer: `Für ein präzises Ergebnis sollten die Ausgangsgrößen sorgfältig geprüft und in den angegebenen Einheiten eingetragen werden. Standardwerte dienen als Orientierungshilfe.`,
  };

  existing.push(secondFaq);
  return existing;
}

// ---------------------------------------------------------------------------
// 7. Graph-based Orphan Resolution
// ---------------------------------------------------------------------------
function buildOptimizedLinks(): Map<string, string[]> {
  const outgoing = new Map<string, Set<string>>();
  const incoming = new Map<string, Set<string>>();

  for (const calc of ALL_CALCULATORS) {
    outgoing.set(calc.slug, new Set(calc.relatedSlugs || []));
    incoming.set(calc.slug, new Set());
  }

  for (const calc of ALL_CALCULATORS) {
    for (const rel of calc.relatedSlugs || []) {
      if (incoming.has(rel)) {
        incoming.get(rel)!.add(calc.slug);
      }
    }
  }

  const orphans = ALL_CALCULATORS.filter(c => incoming.get(c.slug)!.size === 0);

  for (const orphan of orphans) {
    // Try to link from its own outgoing peers
    const validPeers = (orphan.relatedSlugs || []).filter(s => outgoing.has(s));
    if (validPeers.length > 0) {
      for (const peer of validPeers.slice(0, 2)) {
        // Prepend so slice(0, 6) never drops it
        const current = [...outgoing.get(peer)!];
        outgoing.set(peer, new Set([orphan.slug, ...current]));
        incoming.get(orphan.slug)!.add(peer);
      }
    } else {
      // Find peer in same category
      const sameCat = ALL_CALCULATORS.filter(c => c.category === orphan.category && c.slug !== orphan.slug);
      for (const p of sameCat.slice(0, 2)) {
        const current = [...outgoing.get(p.slug)!];
        outgoing.set(p.slug, new Set([orphan.slug, ...current]));
        incoming.get(orphan.slug)!.add(p.slug);
      }
    }
  }

  // Format and clamp each calculator's links between 3 and 6
  const finalMap = new Map<string, string[]>();
  for (const calc of ALL_CALCULATORS) {
    let links = [...outgoing.get(calc.slug)!].filter(s => s !== calc.slug && ALL_CALCULATORS.some(c => c.slug === s));
    if (links.length < 3) {
      // Add peers from same category
      const sameCat = ALL_CALCULATORS.filter(c => c.category === calc.category && c.slug !== calc.slug && !links.includes(c.slug));
      for (const p of sameCat) {
        links.push(p.slug);
        if (links.length >= 3) break;
      }
    }
    // Limit to 6
    finalMap.set(calc.slug, links.slice(0, 6));
  }

  return finalMap;
}

// ---------------------------------------------------------------------------
// 8. Run Verification on In-Memory Results
// ---------------------------------------------------------------------------
const optimizedLinks = buildOptimizedLinks();
const seenTitles = new Set<string>();
const seenDescs = new Set<string>();
const seenH1s = new Set<string>();
let dupT = 0, dupD = 0, dupH = 0;
let titleErr = 0, descErr = 0, faqErr = 0, contentErr = 0;

const incomingFinal = new Map<string, number>();
for (const calc of ALL_CALCULATORS) incomingFinal.set(calc.slug, 0);
for (const [, links] of optimizedLinks) {
  for (const s of links) {
    if (incomingFinal.has(s)) incomingFinal.set(s, incomingFinal.get(s)! + 1);
  }
}
const finalOrphans = ALL_CALCULATORS.filter(c => incomingFinal.get(c.slug)! === 0);

for (const calc of ALL_CALCULATORS) {
  const title = optimizeTitle(calc);
  const desc = optimizeDescription(calc);
  const h1 = CANNIBALIZATION_DIFFERENTIATIONS[calc.slug]?.h1 || calc.h1;
  const content = getEditorialContent(calc);
  const faqs = enrichFaqs(calc);

  if (seenTitles.has(title)) dupT++;
  seenTitles.add(title);

  if (seenDescs.has(desc)) dupD++;
  seenDescs.add(desc);

  if (seenH1s.has(h1)) dupH++;
  seenH1s.add(h1);

  if (title.length < 30 || title.length > 65) titleErr++;
  if (desc.length < 100 || desc.length > 165) descErr++;
  if (faqs.length < 2) faqErr++;
  if (!content.intro || !content.details) contentErr++;
}

console.log('=== OPTIMIZER DRY RUN VALIDATION ===');
console.log(`Duplicate Titles: ${dupT}`);
console.log(`Duplicate Descriptions: ${dupD}`);
console.log(`Duplicate H1s: ${dupH}`);
console.log(`Title length errors (not 30..65): ${titleErr}`);
console.log(`Description length errors (not 100..165): ${descErr}`);
console.log(`FAQ errors (< 2 FAQs): ${faqErr}`);
console.log(`Content errors (missing intro/details): ${contentErr}`);
console.log(`Final Orphan Pages: ${finalOrphans.length}`);

// ---------------------------------------------------------------------------
// 9. Execute file updates
// ---------------------------------------------------------------------------
function formatStringLiteral(str: string): string {
  return `'${str.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function updateCalculatorBlock(block: string, updates: {
  metaTitle?: string;
  metaDescription?: string;
  h1?: string;
  shortDescription?: string;
  searchKeywords?: string[];
  content?: { intro: string; details: string };
  faqs?: Array<{ question: string; answer: string }>;
  relatedSlugs?: string[];
}): string {
  let updated = block;

  if (updates.metaTitle) {
    updated = updated.replace(/metaTitle:\s*(['"`])[\s\S]*?\1,/, `metaTitle: ${formatStringLiteral(updates.metaTitle)},`);
  }
  if (updates.metaDescription) {
    updated = updated.replace(/metaDescription:\s*(['"`])[\s\S]*?\1,/, `metaDescription: ${formatStringLiteral(updates.metaDescription)},`);
  }
  if (updates.h1) {
    updated = updated.replace(/h1:\s*(['"`])[\s\S]*?\1,/, `h1: ${formatStringLiteral(updates.h1)},`);
  }
  if (updates.shortDescription) {
    updated = updated.replace(/shortDescription:\s*(['"`])[\s\S]*?\1,/, `shortDescription: ${formatStringLiteral(updates.shortDescription)},`);
  }
  if (updates.searchKeywords && updates.searchKeywords.length > 0) {
    const kwStr = `searchKeywords: [${updates.searchKeywords.map(s => formatStringLiteral(s)).join(', ')}],`;
    updated = updated.replace(/searchKeywords:\s*\[[\s\S]*?\],/, kwStr);
  }

  // Update or insert content
  if (updates.content) {
    const formattedContent = `content: {\n      intro: ${formatStringLiteral(updates.content.intro)},\n      details: ${formatStringLiteral(updates.content.details)},\n    },`;
    if (updated.includes('content: {')) {
      updated = updated.replace(/content:\s*\{[\s\S]*?\},/, formattedContent);
    } else {
      if (updated.includes('faqs: [')) {
        updated = updated.replace('faqs: [', `${formattedContent}\n    faqs: [`);
      } else if (updated.includes('relatedSlugs: [')) {
        updated = updated.replace('relatedSlugs: [', `${formattedContent}\n    relatedSlugs: [`);
      }
    }
  }

  // Update faqs
  if (updates.faqs && updates.faqs.length > 0) {
    const faqsStr = `faqs: [\n` + updates.faqs.map(f => `      { question: ${formatStringLiteral(f.question)}, answer: ${formatStringLiteral(f.answer)} },`).join('\n') + `\n    ],`;
    if (updated.includes('faqs: [')) {
      updated = updated.replace(/faqs:\s*\[[\s\S]*?\],/, faqsStr);
    } else if (updated.includes('relatedSlugs: [')) {
      updated = updated.replace('relatedSlugs: [', `${faqsStr}\n    relatedSlugs: [`);
    }
  }

  // Update relatedSlugs
  if (updates.relatedSlugs && updates.relatedSlugs.length > 0) {
    const relatedStr = `relatedSlugs: [${updates.relatedSlugs.map(s => `'${s}'`).join(', ')}],`;
    if (updated.includes('relatedSlugs: [')) {
      updated = updated.replace(/relatedSlugs:\s*\[[\s\S]*?\],/, relatedStr);
    }
  }

  return updated;
}

function getCalculatorRange(fileContent: string, slug: string): { start: number; end: number; block: string } | null {
  const marker = `slug: '${slug}'`;
  const marker2 = `slug: "${slug}"`;
  let pos = fileContent.indexOf(marker);
  if (pos === -1) pos = fileContent.indexOf(marker2);
  if (pos === -1) return null;

  // Search backwards from pos for the '{' that opens the calculator object
  let start = -1;
  for (let i = pos; i >= 0; i--) {
    const char = fileContent[i];
    if (char === '{') {
      const prevText = fileContent.slice(Math.max(0, i - 10), i);
      if (prevText.includes('\n')) {
        start = i;
        break;
      }
    }
  }
  if (start === -1) return null;

  // Count braces
  let depth = 0;
  let inStr: string | null = null;
  let isEscaped = false;
  let end = -1;

  for (let i = start; i < fileContent.length; i++) {
    const char = fileContent[i];
    if (isEscaped) {
      isEscaped = false;
      continue;
    }
    if (char === '\\') {
      isEscaped = true;
      continue;
    }
    if (inStr) {
      if (char === inStr) inStr = null;
      continue;
    }
    if (char === "'" || char === '"' || char === '`') {
      inStr = char;
      continue;
    }
    if (char === '/' && fileContent[i + 1] === '/') {
      const nextNl = fileContent.indexOf('\n', i);
      if (nextNl !== -1) i = nextNl;
      continue;
    }
    if (char === '/' && fileContent[i + 1] === '*') {
      const closeComm = fileContent.indexOf('*/', i);
      if (closeComm !== -1) i = closeComm + 1;
      continue;
    }

    if (char === '{') depth++;
    else if (char === '}') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }

  if (end === -1) return null;
  return { start, end, block: fileContent.slice(start, end) };
}

if (process.argv.includes('--write')) {
  console.log('\nApplying optimizations to all 24 calculator data files...');

  const baseDir = path.join(__dirname, '../src/data/calculators');
  const extraDir = path.join(baseDir, 'extra');

  const files = [
    ...fs.readdirSync(baseDir).filter(f => f.endsWith('.ts') && f !== 'index.ts').map(f => path.join(baseDir, f)),
    ...fs.readdirSync(extraDir).filter(f => f.endsWith('.ts') && f !== 'index.ts').map(f => path.join(extraDir, f)),
  ];

  let totalUpdated = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const ranges: Array<{ slug: string; start: number; end: number; block: string }> = [];

    for (const calc of ALL_CALCULATORS) {
      if (content.includes(`slug: '${calc.slug}'`) || content.includes(`slug: "${calc.slug}"`)) {
        const range = getCalculatorRange(content, calc.slug);
        if (range) {
          ranges.push({ slug: calc.slug, ...range });
        }
      }
    }

    if (ranges.length === 0) continue;

    // Sort descending by start to preserve offsets during replacement
    ranges.sort((a, b) => b.start - a.start);

    for (const r of ranges) {
      const calc = ALL_CALCULATORS.find(c => c.slug === r.slug)!;
      const diff = CANNIBALIZATION_DIFFERENTIATIONS[calc.slug];

      const updates: any = {
        metaTitle: optimizeTitle(calc),
        metaDescription: optimizeDescription(calc),
        h1: diff?.h1 || calc.h1,
        shortDescription: optimizeShortDescription(calc),
        content: getEditorialContent(calc),
        faqs: enrichFaqs(calc),
        relatedSlugs: optimizedLinks.get(calc.slug),
      };

      if (diff) {
        updates.searchKeywords = [diff.primaryKeyword, ...(calc.searchKeywords || []).filter(k => k !== diff.primaryKeyword)];
      }

      const newBlock = updateCalculatorBlock(r.block, updates);
      content = content.slice(0, r.start) + newBlock + content.slice(r.end);
      totalUpdated++;
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${ranges.length} calculators in ${path.basename(file)}`);
  }

  console.log(`\nSuccessfully applied optimizations to ${totalUpdated} calculators!`);
}

