import { CalculatorDefinition } from '@/types/calculator';
import {
  calculateFuelCost,
  calculateCommuterAllowance,
  calculateEVCharging,
  calculateTravelTime,
  calculateCarCO2,
} from '@/lib/calculators/auto';
import { formatNumber, formatCurrency } from '@/lib/formatters';
import { GERMAN_DATA_2026 } from '@/data/regulated/2026';

export const AUTO_CALCULATORS: CalculatorDefinition[] = [
  {
    id: 'spritkostenrechner',
    slug: 'spritkostenrechner',
    name: 'Spritkostenrechner',
    shortName: 'Spritkosten berechnen',
    category: 'auto-verkehr',
    subcategory: 'Sprit & Verbrauch',
    metaTitle: 'Spritkostenrechner – Benzin- & Dieselkosten pro Fahrt und km',
    metaDescription: 'Berechnen Sie die Spritkosten für jede Fahrt, den täglichen Arbeitsweg sowie Monat und Jahr. Inklusive Verbrauch in Litern und Kosten pro Kilometer.',
    h1: 'Spritkostenrechner – Kraftstoffkosten genau ermitteln',
    shortDescription: 'Berechnet Kraftstoffkosten, Literbedarf und Kosten pro Kilometer für Einzelfahrten und Pendelstrecken.',
    searchKeywords: ['spritkostenrechner', 'spritkosten berechnen', 'benzinkosten rechner', 'fahrtkosten benzin', 'spritverbrauch rechner'],
    inputs: [
      { id: 'distance', label: 'Fahrstrecke in Kilometern', type: 'number', defaultValue: 50, min: 1, step: 1, unit: 'km' },
      {
        id: 'tripType',
        label: 'Fahrtart',
        type: 'select',
        defaultValue: 'single',
        options: [
          { value: 'single', label: 'Einfache Fahrt' },
          { value: 'roundtrip', label: 'Hin- und Rückfahrt' },
        ],
      },
      { id: 'consumption', label: 'Verbrauch auf 100 km', type: 'number', defaultValue: 6.8, min: 1, step: 0.1, unit: 'l/100km' },
      { id: 'pricePerLiter', label: 'Kraftstoffpreis pro Liter', type: 'number', defaultValue: 1.78, min: 0.5, step: 0.01, unit: '€/Liter' },
      { id: 'tripsCount', label: 'Anzahl der Fahrten', type: 'number', defaultValue: 1, min: 1, step: 1, helpText: 'z.B. 1 für Einzelfahrt oder mehr bei regelmäßigen Touren' },
      { id: 'passengers', label: 'Anzahl Personen (Fahrgemeinschaft)', type: 'number', defaultValue: 1, min: 1, max: 9, step: 1, helpText: 'Teilt die Kosten auf alle Mitfahrer auf' },
    ],
    calculate: calculateFuelCost,
    formula: 'Spritkosten = (Strecke in km / 100) × Verbrauch in l × Literpreis in €',
    formulaExplanation: 'Der Durchschnittsverbrauch wird auf die gefahrene Distanz umgerechnet und mit dem aktuellen Literpreis multipliziert.',
    workedExample: {
      title: 'Beispiel: 50 km Strecke bei 6,8 l/100 km und 1,78 €/l',
      description: 'Kraftstoffbedarf: 3,40 Liter. Kosten für die Fahrt: 6,05 € (0,121 € pro km).',
      inputs: { distance: 50, consumption: 6.8, pricePerLiter: 1.78, tripsCount: 1 },
      resultSummary: '6,05 € pro Fahrt',
    },
    content: {
      intro: 'Der Spritkostenrechner ermittelt die reinen Treibstoffausgaben für Einzelfahrten, Urlaubsreisen oder tägliche Pendelstrecken auf den Cent genau.',
      details: 'Die Berechnung multipliziert die gefahrene Strecke mit dem Durchschnittsverbrauch auf 100 km und dem aktuellen Literpreis: Spritkosten = (Distanz / 100) · Verbrauch · Literpreis. Bei Fahrgemeinschaften teilt man die Gesamtsumme einfach durch die Mitfahrerzahl.',
    },
    faqs: [
      { question: 'Wie teilt man Spritkosten bei einer Fahrgemeinschaft fair auf?', answer: 'Geben Sie die gesamte Hin- und Rückfahrt ein (Anzahl Fahrten = 2). Teilen Sie den berechneten Gesamtwert einfach durch die Anzahl der mitfahrenden Personen.' },
      { question: 'Berücksichtigt der Spritkostenrechner auch Verschleiß und Wertverlust?', answer: 'Nein, dieser Rechner kalkuliert ausschließlich die reinen Kraftstoffkosten an der Zapfsäule; für Vollkosten inklusive Wertverlust nutzen Sie unseren Auto-Gesamtkosten-Rechner.' },
    ],
    relatedSlugs: ['kraftstoffverbrauch-rechner', 'fahrtkostenrechner', 'pendlerpauschale-rechner', 'auto-gesamtkosten-rechner', 'autobahn-maut-rechner-vignette', 'lkw-maut-deutschland-rechner'],
  },
  {
    id: 'kraftstoffverbrauch-rechner',
    slug: 'kraftstoffverbrauch-rechner',
    name: 'Kraftstoffverbrauchs-Rechner (Liter pro 100 km)',
    shortName: 'Verbrauch l/100km',
    category: 'auto-verkehr',
    subcategory: 'Sprit & Verbrauch',
    metaTitle: 'Kraftstoffverbrauch Rechner – Liter auf 100 km genau ermitteln',
    metaDescription: 'Berechnen Sie den echten Durchschnittsverbrauch Ihres Autos nach dem Tanken: Getankte Liter geteilt durch gefahrene Kilometer.',
    h1: 'Kraftstoffverbrauch berechnen (l/100 km)',
    shortDescription: 'Ermittelt den realen Spritverbrauch Ihres Autos aus getankter Menge und Tageskilometerstand.',
    searchKeywords: ['kraftstoffverbrauch rechner', 'liter pro 100 km berechnen', 'benzinverbrauch rechner', 'auto verbrauch formel'],
    inputs: [
      { id: 'distanceKm', label: 'Gefahrene Kilometer seit letztem Volltanken', type: 'number', defaultValue: 620, min: 1, unit: 'km' },
      { id: 'litersFueled', label: 'Nachgetankte Liter (voll)', type: 'number', defaultValue: 42.5, min: 0.1, step: 0.1, unit: 'Liter' },
    ],
    calculate: (inputs) => {
      const dist = parseFloat(inputs.distanceKm) || 600;
      const liters = parseFloat(inputs.litersFueled) || 40;
      if (dist <= 0 || liters <= 0) {
        return { primary: { id: 'cons', label: 'Verbrauch', value: 0, formattedValue: '0 l/100km' }, error: 'Ungültige Werte.' };
      }
      const consumption = (liters / dist) * 100;
      return {
        primary: { id: 'cons', label: 'Durchschnittsverbrauch', value: consumption, formattedValue: `${formatNumber(consumption, 2)} l/100 km`, highlight: true },
        secondary: [
          { id: 'kmPerLiter', label: 'Reichweite pro Liter Kraftstoff', value: dist / liters, formattedValue: `${formatNumber(dist / liters, 2)} km/l` },
          { id: 'distance', label: 'Gefahrene Strecke', value: dist, formattedValue: `${formatNumber(dist, 0)} km` },
        ],
        summaryText: `Ihr Fahrzeug verbraucht real ${formatNumber(consumption, 2)} Liter auf 100 Kilometer. Mit einem Liter Kraftstoff kommen Sie ${formatNumber(dist / liters, 2)} km weit.`,
      };
    },
    formula: 'Verbrauch (l/100 km) = (Getankte Liter / Gefahrene Kilometer) × 100',
    formulaExplanation: 'Die getankte Kraftstoffmenge wird durch die seit dem letzten Volltanken gefahrenen Kilometer dividiert und mit 100 multipliziert.',
    workedExample: {
      title: 'Beispiel: 42,5 Liter auf 620 km getankt',
      description: '(42,5 / 620) × 100 = 6,85 l/100 km.',
      inputs: { distanceKm: 620, litersFueled: 42.5 },
      resultSummary: '6,85 l/100 km',
    },
    content: {
      intro: 'Bordcomputer zeigen im Alltag häufig geschönte Verbrauchswerte an. Mit der klassischen Zapfsäulen-Methode ermitteln Sie den echten Durchschnittsdurst Ihres Fahrzeugs.',
      details: 'Methode: Voll tanken, Tageskilometerzähler auf 0 stellen, beim nächsten Volltanken die getankten Liter notieren und durch die gefahrenen Kilometer teilen: (Getankte Liter / Gefahrene km) · 100.',
    },
    faqs: [
      { question: 'Warum weicht der reale Verbrauch von den Herstellerangaben (WLTP) ab?', answer: 'Der WLTP-Zyklus wird auf Prüfständen bei 23 °C ohne Klimaanlage und mit minimaler Zuladung ermittelt; im Realverkehr treiben Kaltstarts, Heizung, Kurzstrecken und Fahrstil den Verbrauch nach oben.' },
      { question: 'Wie wirkt sich vorausschauendes Fahren auf den Verbrauch aus?', answer: 'Durch frühzeitiges Hochschalten (bei ca. 2.000 U/min), Nutzung der Schubabschaltung und Vermeidung unnötigen Bremsens lassen sich 15 bis 25 Prozent Kraftstoff einsparen.' },
    ],
    relatedSlugs: ['spritkostenrechner', 'fahrtkostenrechner', 'auto-gesamtkosten-rechner', 'kraftstoffverbrauch-umrechner', 'co2-auto-rechner'],
  },
  {
    id: 'pendlerpauschale-rechner',
    slug: 'pendlerpauschale-rechner',
    name: 'Pendlerpauschale-Rechner (Entfernungspauschale)',
    shortName: 'Pendlerpauschale',
    category: 'auto-verkehr',
    subcategory: 'Pendeln & Arbeitsweg',
    metaTitle: 'Pendlerpauschale Rechner – Steuerliche Absetzbarkeit prüfen',
    metaDescription: 'Berechnen Sie Ihre Entfernungspauschale: 0,30 € für die ersten 20 km und 0,38 € ab dem 21. km. Offizielle BMF-Regeln Stand 2026.',
    h1: 'Pendlerpauschale Rechner (Entfernungspauschale)',
    shortDescription: 'Berechnet die steuerliche Entfernungspauschale für den Weg zur ersten Tätigkeitsstätte.',
    searchKeywords: ['pendlerpauschale rechner', 'entfernungspauschale rechner', 'arbeitsweg steuer absetzen', 'pendlerpauschale 2026'],
    inputs: [
      { id: 'distanceKm', label: 'Einfache Entfernung zur Arbeitsstätte', type: 'number', defaultValue: 28, min: 1, step: 1, unit: 'km' },
      { id: 'workdays', label: 'Arbeitstage im Kalenderjahr', type: 'number', defaultValue: 220, min: 1, max: 365, step: 1, unit: 'Tage' },
      { id: 'homeOfficeDays', label: 'Davon Homeoffice-Tage (werden abgezogen)', type: 'number', defaultValue: 0, min: 0, max: 365, step: 1, unit: 'Tage', helpText: 'An Tagen im Homeoffice kann für dieselbe Strecke keine Pendlerpauschale angesetzt werden' },
      {
        id: 'transportMode',
        label: 'Verkehrsmittel',
        type: 'select',
        defaultValue: 'car',
        options: [
          { value: 'car', label: 'Eigener PKW (unbegrenzt absetzbar)' },
          { value: 'public', label: 'ÖPNV / Fahrrad / Mitfahrer (max. 4.500 € Höchstgrenze/Jahr)' },
        ],
      },
    ],
    calculate: calculateCommuterAllowance,
    formula: 'Pauschale = (min(20, km) × 0,30 € + max(0, km - 20) × 0,38 €) × Arbeitstage',
    formulaExplanation: 'Nach § 9 Abs. 1 Nr. 4 EStG werden für die ersten 20 Kilometer 0,30 € je vollem Entfernungskilometer angesetzt, ab dem 21. Kilometer gilt die erhöhte Pauschale von 0,38 €.',
    workedExample: {
      title: 'Beispiel: 28 km einfache Strecke bei 220 Arbeitstagen',
      description: '(20 × 0,30 € + 8 × 0,38 €) = 6,00 € + 3,04 € = 9,04 € pro Tag. 9,04 € × 220 Tage = 1.988,80 € jährlich.',
      inputs: { distanceKm: 28, workdays: 220 },
      resultSummary: '1.988,80 € Werbungskosten',
    },
    content: {
      intro: 'Die Pendlerpauschale (Entfernungspauschale nach § 9 Abs. 1 Nr. 4 EStG) mindert als Werbungskosten das zu versteuernde Einkommen von Arbeitnehmern für den Weg zur ersten Tätigkeitsstätte.',
      details: 'In Deutschland gilt: 0,30 € für die ersten 20 Entfernungskilometer (einfache Wegstrecke, nicht Hin- und Rückweg) und 0,38 € ab dem 21. Kilometer. Sie gilt verkehrsmittelunabhängig (Auto, Fahrrad, Fußgänger oder ÖPNV).',
    },
    faqs: [
      { question: 'Gilt die Entfernungspauschale für Hin- und Rückfahrt?', answer: 'Nein, das Steuerrecht erkennt grundsätzlich nur die einfache Entfernung (kürzeste Straßenverbindung) zwischen Wohnung und Arbeitsstätte an.' },
      { question: 'Gibt es einen Höchstbetrag bei der Pendlerpauschale?', answer: 'Für Fahrten mit dem eigenen PKW gilt keine Obergrenze; für alle anderen Verkehrsmittel (ÖPNV, Fahrrad, Fahrgemeinschaft als Mitfahrer) ist der Abzug auf maximal 4.500 € im Kalenderjahr gedeckelt.' },
    ],
    relatedSlugs: ['fahrtkostenrechner', 'spritkostenrechner', 'auto-gesamtkosten-rechner', 'dienstfahrrad-jobrad-rechner', 'arbeitstage-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: GERMAN_DATA_2026.pendlerpauschale_standard.year,
      source: GERMAN_DATA_2026.pendlerpauschale_standard.source,
      sourceUrl: GERMAN_DATA_2026.pendlerpauschale_standard.sourceUrl,
      lastVerified: GERMAN_DATA_2026.pendlerpauschale_standard.lastVerified,
    },
  },
  {
    id: 'fahrtkostenrechner',
    slug: 'fahrtkostenrechner',
    name: 'Fahrtkostenrechner',
    shortName: 'Fahrtkosten berechnen',
    category: 'auto-verkehr',
    subcategory: 'Fahrtkosten & Reise',
    metaTitle: 'Fahrtkostenrechner – Gesamte Autokosten einer Reise kalkuli...',
    metaDescription: 'Berechnen Sie die Fahrtkosten einer Reise oder Dienstreise: Kraftstoff, Maut, Parkgebühren und Verschleißpauschale.',
    h1: 'Fahrtkostenrechner für Reisen & Dienstreisen',
    shortDescription: 'Ermittelt die Gesamtkosten von Autofahrten inklusive Nebenkosten und Mitfahreraufteilung mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['fahrtkostenrechner', 'fahrtkosten berechnen dienstreise', 'reisekosten auto rechner', 'mitfahrer kosten teilen'],
    inputs: [
      { id: 'distance', label: 'Gesamte Reisedistanz (Hin & Rück)', type: 'number', defaultValue: 450, unit: 'km' },
      { id: 'consumption', label: 'Verbrauch l/100km', type: 'number', defaultValue: 6.5, unit: 'l/100km' },
      { id: 'pricePerLiter', label: 'Kraftstoffpreis', type: 'number', defaultValue: 1.75, unit: '€/l' },
      { id: 'passengers', label: 'Anzahl Reisende (zur Kostenaufteilung)', type: 'number', defaultValue: 3, min: 1, step: 1 },
    ],
    calculate: (inputs) => {
      const res = calculateFuelCost(inputs);
      const persons = Math.max(1, parseInt(inputs.passengers || '1', 10));
      const totalFuel = res.primary.value as number;
      const perPerson = totalFuel / persons;
      return {
        primary: { id: 'perPerson', label: `Kosten pro Person (${persons} Mitfahrer)`, value: perPerson, formattedValue: formatCurrency(perPerson), highlight: true },
        secondary: [
          { id: 'totalFuel', label: 'Gesamte Kraftstoffkosten der Fahrt', value: totalFuel, formattedValue: formatCurrency(totalFuel) },
          { id: 'fuelNeeded', label: 'Benötigter Sprit', value: res.secondary?.[1]?.value || 0, formattedValue: String(res.secondary?.[1]?.formattedValue || '') },
        ],
        summaryText: `Für die ${inputs.distance} km lange Fahrt entstehen Gesamtspritkosten von ${formatCurrency(totalFuel)}. Bei ${persons} Reisenden zahlt jede Person ${formatCurrency(perPerson)}.`,
      };
    },
    formula: 'Kosten pro Person = Gesamtspritkosten / Anzahl Personen',
    formulaExplanation: 'Gerechte Kostenumlage der reinen Kraftstoffausgaben.',
    workedExample: {
      title: 'Beispiel: 450 km Wochenendausflug zu dritt',
      description: 'Gesamtspritkosten: ca. 51,19 €. Pro Person: ca. 17,06 €.',
      inputs: { distance: 450, consumption: 6.5, pricePerLiter: 1.75, passengers: 3 },
      resultSummary: '17,06 € pro Person',
    },
    content: {
      intro: 'Dieser Rechner ermittelt die vollständigen Fahrtkosten für Dienstreisen oder private Fahrten nach der gesetzlichen Kilometerpauschale oder individuellen Kilometersätzen.',
      details: 'Arbeitgeber können Dienstreisen mit dem privaten PKW nach § 9 Abs. 1 Nr. 4a EStG mit 0,30 € pro gefahrenem Kilometer (Hin- und Rückweg!) steuerfrei erstatten.',
    },
    faqs: [
      { question: 'Was ist der Unterschied zwischen Pendlerpauschale und Reisekostenpauschale?', answer: 'Die Pendlerpauschale gilt nur für die einfache Strecke zur ersten Tätigkeitsstätte. Bei Dienstreisen (Reisekosten) dürfen alle tatsächlich gefahrenen Kilometer (Hin- und Rückfahrt) abgerechnet werden.' },
      { question: 'Darf der Arbeitgeber mehr als 0,30 € steuerfrei zahlen?', answer: 'Nein, Beträge über 0,30 € pro Kilometer sind für den Arbeitnehmer steuer- und sozialversicherungspflichtiger Arbeitslohn, es sei denn, höhere tatsächliche Fahrzeugkosten werden lückenlos nachgewiesen.' },
    ],
    relatedSlugs: ['spritkostenrechner', 'kraftstoffverbrauch-rechner', 'pendlerpauschale-rechner', 'auto-gesamtkosten-rechner', 'autobahn-maut-rechner-vignette', 'lkw-maut-deutschland-rechner'],
  },
  {
    id: 'elektroauto-ladekosten-rechner',
    slug: 'elektroauto-ladekosten-rechner',
    name: 'Elektroauto-Ladekosten-Rechner',
    shortName: 'E-Auto Ladekosten',
    category: 'auto-verkehr',
    subcategory: 'Elektromobilität',
    metaTitle: 'Elektroauto Ladekosten Rechner – Stromkosten pro 100 km',
    metaDescription: 'Berechnen Sie die Ladekosten Ihres Elektroautos zu Hause (Wallbox) oder an der öffentlichen Ladesäule. Kosten pro 100 km und Vollladung.',
    h1: 'Elektroauto Ladekosten Rechner',
    shortDescription: 'Berechnet Ladekosten, Kosten pro 100 km und Reichweite für E-Autos.',
    searchKeywords: ['elektroauto ladekosten rechner', 'e auto stromkosten pro 100 km', 'ladekosten wallbox berechnen', 'stromkosten elektroauto'],
    inputs: [
      { id: 'distance', label: 'Gewünschte Fahrstrecke', type: 'number', defaultValue: 100, unit: 'km' },
      { id: 'consumptionKwh', label: 'Verbrauch in kWh / 100 km', type: 'number', defaultValue: 17.5, min: 10, max: 35, step: 0.5, unit: 'kWh/100km' },
      { id: 'pricePerKwh', label: 'Strompreis pro kWh', type: 'number', defaultValue: GERMAN_DATA_2026.strompreis_durchschnitt.value, min: 0.1, step: 0.01, unit: '€/kWh' },
      { id: 'batterySize', label: 'Nettobatteriegröße des Autos', type: 'number', defaultValue: 64, unit: 'kWh' },
    ],
    calculate: calculateEVCharging,
    formula: 'Kosten/100 km = (Verbrauch in kWh / 100) × Strompreis je kWh × 100',
    formulaExplanation: 'Multiplikation des durchschnittlichen Stromverbrauchs mit dem jeweiligen Stromtarif an der Wallbox oder Schnellladesäule.',
    workedExample: {
      title: 'Beispiel: 17,5 kWh/100 km bei 0,38 €/kWh Strompreis',
      description: 'Kosten pro 100 km: 6,65 €. Volle Ladung eines 64-kWh-Akkus: 24,32 € (Reichweite ca. 365 km).',
      inputs: { distance: 100, consumptionKwh: 17.5, pricePerKwh: 0.38, batterySize: 64 },
      resultSummary: '6,65 € / 100 km',
    },
    content: {
      intro: 'Dieser Rechner vergleicht die Ladekosten eines Elektroautos an der heimischen Wallbox mit den Kosten an öffentlichen AC- und DC-Schnellladesäulen.',
      details: 'Ladekosten = (Verbrauch in kWh/100 km / 100) · Distanz · Strompreis pro kWh · (1 + Ladeverlustfaktor). Typische Ladeverluste betragen an der Wallbox etwa 8 bis 12 Prozent, an der Haushaltssteckdose bis zu 20 Prozent.',
    },
    faqs: [
      { question: 'Was kostet das Laden an öffentlichen Schnellladern (DC)?', answer: 'Während Haushaltsstrom meist um 30–36 Cent/kWh kostet, liegen die Preise an Autobahn-Schnellladern (HPC) ohne Vertrag oder Grundgebühr oft bei 60 bis 85 Cent/kWh.' },
      { question: 'Wie berechnet man den realen Stromverbrauch inklusive Ladeverlusten?', answer: 'Messen Sie den Strombezug am Stromzähler vor der Wallbox: Wenn 50 kWh im Akku ankommen, wurden meist ca. 55 kWh aus dem Netz bezogen.' },
    ],
    relatedSlugs: ['thg-quote-rechner', 'spritkostenrechner', 'co2-auto-rechner', 'stromkostenrechner', 'hybrid-auto-kosten-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: GERMAN_DATA_2026.strompreis_durchschnitt.year,
      source: GERMAN_DATA_2026.strompreis_durchschnitt.source,
      sourceUrl: GERMAN_DATA_2026.strompreis_durchschnitt.sourceUrl,
      lastVerified: GERMAN_DATA_2026.strompreis_durchschnitt.lastVerified,
    },
  },
  {
    id: 'fahrzeit-rechner',
    slug: 'fahrzeit-rechner',
    name: 'Fahrzeit-Rechner (Reisedauer & Ankunftszeit)',
    shortName: 'Fahrzeit berechnen',
    category: 'auto-verkehr',
    subcategory: 'Fahrtkosten & Reise',
    metaTitle: 'Fahrzeit Rechner – Fahrtdauer aus Distanz & Tempo berechnen',
    metaDescription: 'Ermitteln Sie die genaue Reisezeit aus Entfernung und Durchschnittsgeschwindigkeit inklusive Pausenzeiten.',
    h1: 'Fahrzeit & Reisedauer berechnen',
    shortDescription: 'Berechnet die Fahrzeit und Ankunftszeit anhand von Strecke, Tempo und Pausen.',
    searchKeywords: ['fahrzeit rechner', 'reisedauer auto berechnen', 'wie lange fahre ich für 500 km', 'durchschnittsgeschwindigkeit fahrzeit'],
    inputs: [
      { id: 'distance', label: 'Fahrtstrecke in Kilometern', type: 'number', defaultValue: 420, unit: 'km' },
      { id: 'speed', label: 'Angenommene Durchschnittsgeschwindigkeit', type: 'number', defaultValue: 105, unit: 'km/h' },
      { id: 'breakMinutes', label: 'Geplante Pausen insgesamt', type: 'number', defaultValue: 30, unit: 'Min.' },
    ],
    calculate: calculateTravelTime,
    formula: 'Gesamtzeit = (Strecke in km / Geschwindigkeit in km/h) + Pausenzeit',
    formulaExplanation: 'Division von Distanz durch Geschwindigkeit liefert die reine Fahrzeit.',
    workedExample: {
      title: 'Beispiel: 420 km Autobahnfahrt bei 105 km/h und 30 Min. Pause',
      description: 'Reine Fahrzeit: 4 Stunden. Gesamte Reisedauer: 4 Std. 30 Min.',
      inputs: { distance: 420, speed: 105, breakMinutes: 30 },
      resultSummary: '4 Std. 30 Min.',
    },
    content: {
      intro: 'Der Fahrzeitrechner kalkuliert die reine Reisezeit aus gefahrener Distanz und Durchschnittsgeschwindigkeit und integriert geplante Pausenzeiten.',
      details: 'Reisezeit = (Distanz / Geschwindigkeit) + Pausenzeiten. Bei Autobahnfahrten sinkt die reale Durchschnittsgeschwindigkeit durch Baustellen, Tempolimits und LKW-Überholmanöver meist auf 100–115 km/h.',
    },
    faqs: [
      { question: 'Welche Pausenregelung gilt für gewerbliche Berufskraftfahrer?', answer: 'Nach EU-Verordnung 561/2006 müssen LKW- und Busfahrer nach spätestens 4,5 Stunden Lenkzeit eine ununterbrochene Fahrtunterbrechung von mindestens 45 Minuten einlegen.' },
      { question: 'Wie viel Zeit spart man, wenn man 160 km/h statt 120 km/h fährt?', answer: 'Auf einer Strecke von 100 km sinkt die theoretische Fahrzeit von 50 Minuten auf 37,5 Minuten (Zeitersparnis: 12,5 Minuten) – bei drastisch überproportionalem Kraftstoffverbrauch.' },
    ],
    relatedSlugs: ['spritkostenrechner', 'fahrtkostenrechner', 'kraftstoffverbrauch-rechner'],
  },
  {
    id: 'co2-auto-rechner',
    slug: 'co2-auto-rechner',
    name: 'CO2-Rechner für Autofahrten',
    shortName: 'Auto CO2-Ausstoß',
    category: 'auto-verkehr',
    subcategory: 'Sprit & Verbrauch',
    metaTitle: 'CO2 Rechner Auto – Emissionen pro km & Jahr berechnen',
    metaDescription: 'Berechnen Sie den CO2-Ausstoß Ihres Autos pro gefahrenem Kilometer und für das gesamte Jahr. Benzin, Diesel & Elektro im Vergleich.',
    h1: 'CO2-Rechner für Auto- und Mobilitätsemissionen',
    shortDescription: 'Berechnet Treibhausgasemissionen basierend auf Umweltbundesamt-Faktoren mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['co2 rechner auto', 'co2 ausstoß auto berechnen', 'co2 pro km rechner', 'emissionen benzin diesel'],
    inputs: [
      { id: 'distanceKm', label: 'Jährliche Fahrleistung', type: 'number', defaultValue: 15000, unit: 'km' },
      {
        id: 'fuelType',
        label: 'Antriebsart',
        type: 'select',
        defaultValue: 'benzin',
        options: [
          { value: 'benzin', label: 'Benziner (E10 / Super 95)' },
          { value: 'diesel', label: 'Diesel' },
          { value: 'electric', label: 'Elektroauto (deutscher Strommix)' },
        ],
      },
      { id: 'consumption', label: 'Verbrauch (l/100km bzw. kWh/100km)', type: 'number', defaultValue: 7.0, step: 0.1 },
    ],
    calculate: calculateCarCO2,
    formula: 'CO2 = Kraftstoffmenge × Spezifischer UBA-Emissionsfaktor',
    formulaExplanation: 'Berechnung mit offiziellen Emissionsfaktoren des Umweltbundesamtes (Benzin: 2,37 kg/l, Diesel: 2,65 kg/l, Strommix: 0,38 kg/kWh).',
    workedExample: {
      title: 'Beispiel: 15.000 km im Benziner bei 7,0 l/100 km',
      description: 'Kraftstoff: 1.050 Liter. Emission: ca. 2,49 Tonnen CO2 (166 g/km).',
      inputs: { distanceKm: 15000, fuelType: 'benzin', consumption: 7.0 },
      resultSummary: 'ca. 2,49 Tonnen CO2/Jahr',
    },
    content: {
      intro: 'Dieser Emissionsrechner beziffert den CO₂-Ausstoß Ihres Fahrzeugs pro Kilometer, Einzelfahrt und Jahr basierend auf dem realen Kraftstoffverbrauch.',
      details: 'Die chemischen Emissionsfaktoren lauten: Bei der Verbrennung von 1 Liter Benzin entstehen ca. 2,37 kg CO₂, bei 1 Liter Diesel ca. 2,65 kg CO₂ (aufgrund der höheren Kohlenstoffdichte von Diesel).',
    },
    faqs: [
      { question: 'Warum stößt 1 Liter Diesel mehr CO₂ aus als 1 Liter Benzin?', answer: 'Dieselkraftstoff hat eine höhere Dichte (ca. 0,83 kg/l) und einen höheren Kohlenstoffanteil pro Liter als Superbenzin (ca. 0,74 kg/l).' },
      { question: 'Wie schneidet ein E-Auto beim deutschen Strommix ab?', answer: 'Bei einem Strommix von ca. 380 g CO₂/kWh und 18 kWh/100 km Verbrauch stößt ein E-Auto indirekt ca. 68 g CO₂/km aus – etwa halb so viel wie ein moderner Benziner.' },
    ],
    relatedSlugs: ['spritkostenrechner', 'kraftstoffverbrauch-rechner', 'elektroauto-ladekosten-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: GERMAN_DATA_2026.co2_faktor_benzin.year,
      source: GERMAN_DATA_2026.co2_faktor_benzin.source,
      sourceUrl: GERMAN_DATA_2026.co2_faktor_benzin.sourceUrl,
      lastVerified: GERMAN_DATA_2026.co2_faktor_benzin.lastVerified,
    },
  },
];
