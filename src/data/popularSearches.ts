/**
 * Konfiguration der beliebten Suchanfragen und Schnellzugriff-Chips auf der Startseite.
 * Diese Datei dient als zentrale, editierbare Datenquelle für saisonale und priorisierte Rechner.
 */

export interface PopularChip {
  label: string;
  slug: string;
}

/**
 * Rechner-Slugs für das prominente "Beliebte Rechner"-Raster auf der Startseite.
 * Kann je nach Saison (z. B. Steuererklärung im Frühjahr, Heizkosten im Herbst) angepasst werden.
 */
export const POPULAR_CALCULATOR_SLUGS: string[] = [
  'brutto-netto-rechner',
  'prozentrechner',
  'tage-zwischen-zwei-daten',
  'altersrechner',
  'bmi-rechner',
  'spritkostenrechner',
  'ratenkreditrechner',
  'zinseszinsrechner',
  'stundenlohnrechner',
  'inflationsrechner',
];

/**
 * Schnellauswahl-Chips direkt unter dem zentralen Suchfeld der Startseite.
 */
export const POPULAR_SEARCH_CHIPS: PopularChip[] = [
  { label: 'Brutto-Netto', slug: 'brutto-netto-rechner' },
  { label: 'Tagerechner', slug: 'tage-zwischen-zwei-daten' },
  { label: 'Gaskosten', slug: 'gaskostenrechner' },
  { label: 'JobRad', slug: 'dienstfahrrad-jobrad-rechner' },
  { label: 'Schalungssteine', slug: 'schalungssteine-rechner' },
  { label: 'Prozent', slug: 'prozentrechner' },
  { label: 'Alter', slug: 'altersrechner' },
  { label: 'BMI', slug: 'bmi-rechner' },
  { label: 'Spritkosten', slug: 'spritkostenrechner' },
  { label: 'Kredit', slug: 'ratenkreditrechner' },
  { label: 'Zinseszins', slug: 'zinseszinsrechner' },
  { label: 'Stundenlohn', slug: 'stundenlohnrechner' },
];

