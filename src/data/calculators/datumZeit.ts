import { CalculatorDefinition } from '@/types/calculator';
import {
  calculateAge,
  calculateAgeInDays,
  calculateDateDifference,
  calculateWorkdays,
  calculateDateAdd,
  calculateLeapYear,
  calculateTimeDifference,
  calculateAgeDifference,
  calculateBirthdayWeekday,
  calculateISOWeek,
} from '@/lib/calculators/datumZeit';
import { formatNumber, formatDateDe } from '@/lib/formatters';

export const DATUM_ZEIT_CALCULATORS: CalculatorDefinition[] = [
  {
    id: 'altersrechner',
    slug: 'altersrechner',
    name: 'Altersrechner',
    shortName: 'Alter berechnen',
    category: 'datum-zeit',
    subcategory: 'Alter & Geburtstag',
    metaTitle: 'Altersrechner – Alter genau in Jahren, Monaten & Tagen berechnen',
    metaDescription: 'Berechnen Sie Ihr exaktes Alter auf den Tag genau in Jahren, Monaten, Tagen, Stunden und Minuten. Inklusive Countdown zum nächsten Geburtstag.',
    h1: 'Altersrechner – Exaktes Alter berechnen',
    shortDescription: 'Ermittelt Ihr genaues Alter in Jahren, Monaten, Tagen, gelebten Wochen und Stunden inklusive nächstem Geburtstag.',
    searchKeywords: ['altersrechner', 'alter berechnen', 'wie alt bin ich', 'geburtsdatum rechner', 'alter in jahren monaten tagen'],
    inputs: [
      { id: 'birthDate', label: 'Geburtsdatum', type: 'date', defaultValue: '1990-01-01' },
      { id: 'targetDate', label: 'Stichtag (Vergleichsdatum)', type: 'date', defaultValue: '2026-01-01', helpText: 'Standardmäßig das heutige Datum' },
    ],
    calculate: calculateAge,
    formula: 'Alter = Stichtag - Geburtsdatum (unter Berücksichtigung von Schaltjahren und Monatslängen)',
    formulaExplanation: 'Vom Stichtag werden Jahre, Monate und Tage des Geburtsdatums subtrahiert. Wenn der Tag des Stichtags kleiner ist als der Geburtstag, werden die Tage des Vormonats addiert und ein Monat abgezogen.',
    workedExample: {
      title: 'Beispiel: Geboren am 01.01.1990 zum Stichtag 01.01.2026',
      description: 'Exakt 36 Jahre, 0 Monate und 0 Tage vergangen.',
      inputs: { birthDate: '1990-01-01', targetDate: '2026-01-01' },
      resultSummary: '36 Jahre (13.149 Tage)',
    },
    content: {
      intro: 'Mit unserem präzisen Altersrechner bestimmen Sie Ihr Alter oder das Alter beliebiger Personen auf den Tag genau. Der Rechner berücksichtigt automatisch alle Schaltjahre.',
      details: 'Neben den vollendeten Lebensjahren zeigt Ihnen das Tool auch die bisher gelebten Gesamttage, Wochen, Monate und Stunden an. Ebenso erfahren Sie, wie viele Tage bis zu Ihrem nächsten Geburtstag verbleiben.',
      tips: [
        'Nutzen Sie den Stichtag, um Ihr Alter zu einem bestimmten historischen oder zukünftigen Ereignis zu ermitteln.',
        'Schaltjahre wie 2024 oder 2028 werden exakt mit 366 Tagen einberechnet.',
      ],
    },
    faqs: [
      { question: 'Wie werden Schaltjahre beim Altersrechner berücksichtigt?', answer: 'Der Rechner nutzt echte Kalenderarithmetik. Alle vier Jahre (mit den gregorianischen Ausnahmen für Säkularjahre) wird der 29. Februar als vollwertiger Tag in die Tageszählung einbezogen.' },
      { question: 'Wann hat jemand Geburtstag, der am 29. Februar geboren wurde?', answer: 'In Nicht-Schaltjahren wird nach deutschem Recht (§ 187 Abs. 2 BGB) der Geburtstag rechtlich am 1. März vollendet.' },
    ],
    relatedSlugs: ['alter-in-tagen', 'alter-in-wochen', 'altersunterschied', 'geburtstagsrechner', 'datumsdifferenz'],
  },
  {
    id: 'alter-in-tagen',
    slug: 'alter-in-tagen',
    name: 'Alter-in-Tagen-Rechner',
    shortName: 'Alter in Tagen',
    category: 'datum-zeit',
    subcategory: 'Alter & Geburtstag',
    metaTitle: 'Alter in Tagen Rechner – Wie viele Tage lebe ich schon?',
    metaDescription: 'Berechnen Sie, wie viele Tage Sie bereits auf der Welt sind. Finden Sie heraus, wann Ihr 10.000ster Tag oder 20.000ster Lebenstag ist.',
    h1: 'Alter in Tagen berechnen',
    shortDescription: 'Berechnet die genaue Anzahl der Lebenstage seit der Geburt inklusive gelebter Stunden und Minuten.',
    searchKeywords: ['alter in tagen', 'wie viele tage lebe ich', 'lebenstage rechner', 'alter in stunden'],
    inputs: [
      { id: 'birthDate', label: 'Geburtsdatum', type: 'date', defaultValue: '1995-05-15' },
      { id: 'targetDate', label: 'Stichtag', type: 'date', defaultValue: '2026-01-01' },
    ],
    calculate: calculateAgeInDays,
    formula: 'Tage = (Stichtag - Geburtsdatum) / 86.400 Sekunden',
    formulaExplanation: 'Die Zeitdifferenz zwischen beiden Zeitpunkten wird in Millisekunden ermittelt und durch die Anzahl der Millisekunden eines Tages (86.400.000 ms) geteilt.',
    workedExample: {
      title: 'Beispiel: Geburt am 15.05.1995 bis 01.01.2026',
      description: 'Zeitspanne von über 30 Jahren.',
      inputs: { birthDate: '1995-05-15', targetDate: '2026-01-01' },
      resultSummary: '11.189 Lebenstage',
    },
    content: {
      intro: 'Haben Sie sich schon einmal gefragt, wie viele Tage Sie bereits auf der Welt sind? Dieser Rechner ermittelt die exakte Tagesanzahl seit Ihrer Geburt.',
      details: 'Viele Menschen feiern besondere Tage-Jubiläen, wie etwa den 10.000. Tag (ca. mit 27,4 Jahren) oder den 20.000. Tag (ca. mit 54,7 Jahren).',
    },
    faqs: [
      { question: 'Wann feiert man seinen 10.000sten Lebenstag?', answer: 'Im Durchschnitt erreicht ein Mensch seinen 10.000. Lebenstag im Alter von 27 Jahren und etwa 137 Tagen (abhängig von der Anzahl der durchlebten Schaltjahre).' },
    ],
    relatedSlugs: ['altersrechner', 'alter-in-wochen', 'alter-in-monaten', 'lebenszeit-in-stunden'],
  },
  {
    id: 'lebenszeit-in-stunden',
    slug: 'lebenszeit-in-stunden',
    name: 'Lebenszeit-in-Stunden-Rechner',
    shortName: 'Lebenszeit in Stunden',
    category: 'datum-zeit',
    subcategory: 'Alter & Geburtstag',
    metaTitle: 'Lebenszeit in Stunden Rechner – Gelebte Stunden & Herzschläge',
    metaDescription: 'Wie viele Stunden haben Sie bisher gelebt? Berechnen Sie Ihre gelebten Stunden, geschätzten Herzschläge und Atemzüge.',
    h1: 'Lebenszeit in Stunden berechnen',
    shortDescription: 'Ermittelt die exakte Stundenzahl seit der Geburt und schätzt die Anzahl der Herzschläge.',
    searchKeywords: ['lebenszeit in stunden', 'wie viele stunden lebe ich', 'herzschläge im leben rechner'],
    inputs: [
      { id: 'birthDate', label: 'Geburtsdatum', type: 'date', defaultValue: '1990-01-01' },
    ],
    calculate: (inputs) => {
      const b = new Date(inputs.birthDate || '1990-01-01');
      const now = new Date();
      const diffMs = now.getTime() - b.getTime();
      const hours = Math.max(0, Math.floor(diffMs / 3600000));
      const days = Math.floor(hours / 24);
      const heartbeats = hours * 60 * 70; // ca. 70 Schläge pro Minute
      const breaths = hours * 60 * 14; // ca. 14 Atemzüge pro Minute
      return {
        primary: { id: 'hours', label: 'Gelebte Stunden', value: hours, formattedValue: `${formatNumber(hours, 0)} Stunden`, highlight: true },
        secondary: [
          { id: 'heart', label: 'Geschätzte Herzschläge (~70/min)', value: heartbeats, formattedValue: `ca. ${formatNumber(heartbeats, 0)} Schläge` },
          { id: 'breath', label: 'Geschätzte Atemzüge (~14/min)', value: breaths, formattedValue: `ca. ${formatNumber(breaths, 0)} Atemzüge` },
          { id: 'days', label: 'Tage', value: days, formattedValue: `${formatNumber(days, 0)} Tage` },
        ],
        summaryText: `Seit Ihrer Geburt sind ${formatNumber(hours, 0)} Stunden vergangen. In dieser Zeit hat Ihr Herz geschätzte ${formatNumber(heartbeats, 0)} Mal geschlagen.`,
      };
    },
    formula: 'Stunden = Lebenstage × 24',
    formulaExplanation: 'Umrechnung der vergangenen Lebenstage in Stunden.',
    workedExample: {
      title: 'Beispiel: 30 Jahre gelebt',
      description: 'Ca. 262.800 Stunden und über 1,1 Milliarden Herzschläge.',
      inputs: { birthDate: '1990-01-01' },
      resultSummary: 'ca. 262.800 Stunden',
    },
    content: {
      intro: 'Betrachten Sie Ihre Lebensspanne aus einer neuen Perspektive: In Stunden gemessen wird Zeit greifbar und faszinierend.',
      details: 'Das Tool berechnet auch physiologische Schätzwerte wie die Anzahl der getätigten Atemzüge.',
    },
    faqs: [
      { question: 'Wie oft schlägt ein menschliches Herz im Leben?', answer: 'Im Laufe eines durchschnittlichen Lebens von 80 Jahren schlägt das Herz etwa 2,5 bis 3 Milliarden Mal ununterbrochen.' },
    ],
    relatedSlugs: ['alter-in-tagen', 'altersrechner'],
  },
  {
    id: 'alter-in-wochen',
    slug: 'alter-in-wochen',
    name: 'Alter-in-Wochen-Rechner',
    shortName: 'Alter in Wochen',
    category: 'datum-zeit',
    subcategory: 'Alter & Geburtstag',
    metaTitle: 'Alter in Wochen Rechner – Wie viele Lebenswochen haben Sie?',
    metaDescription: 'Rechnen Sie Ihr Alter oder das Alter Ihres Babys in volle Lebenswochen um. Ideal für Entwicklungsschritte und Meilensteine.',
    h1: 'Alter in Wochen berechnen',
    shortDescription: 'Ermittelt das exakte Alter in abgeschlossenen Wochen und zusätzlichen Tagen.',
    searchKeywords: ['alter in wochen', 'lebenswochen rechner', 'baby alter in wochen'],
    inputs: [
      { id: 'birthDate', label: 'Geburtsdatum', type: 'date', defaultValue: '2025-06-01' },
      { id: 'targetDate', label: 'Stichtag', type: 'date', defaultValue: '2026-01-01' },
    ],
    calculate: (inputs) => {
      const b = new Date(inputs.birthDate || '2025-06-01');
      const t = new Date(inputs.targetDate || '2026-01-01');
      const diffMs = t.getTime() - b.getTime();
      const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      const weeks = Math.floor(days / 7);
      const remDays = days % 7;
      return {
        primary: { id: 'weeks', label: 'Alter in Wochen', value: weeks, formattedValue: `${formatNumber(weeks, 0)} Wochen und ${remDays} Tage`, highlight: true },
        secondary: [
          { id: 'totalDays', label: 'Gesamte Tage', value: days, formattedValue: `${formatNumber(days, 0)} Tage` },
          { id: 'totalMonths', label: 'Ungefähre Monate', value: days / 30.4375, formattedValue: `ca. ${formatNumber(days / 30.4375, 1)} Monate` },
        ],
        summaryText: `Das Alter beträgt genau ${weeks} volle Wochen und ${remDays} Tage (${days} Tage insgesamt).`,
      };
    },
    formula: 'Wochen = Abrunden(Tage / 7)',
    formulaExplanation: 'Die Gesamtzahl der Lebenstage wird ganzzahlig durch 7 dividiert. Der Divisionsrest ergibt die zusätzlichen Tage.',
    workedExample: {
      title: 'Beispiel: Geburt vor 214 Tagen',
      description: '214 geteilt durch 7 ergibt 30 Wochen und 4 Tage.',
      inputs: { birthDate: '2025-06-01', targetDate: '2026-01-01' },
      resultSummary: '30 Wochen, 4 Tage',
    },
    content: {
      intro: 'Vor allem bei Neugeborenen und Kleinkindern wird das Alter häufig in Lebenswochen angegeben, da sich die motorische und geistige Entwicklung rasant vollzieht.',
      details: 'Dieser Rechner wandelt jedes Geburtsdatum zuverlässig in volle Lebenswochen um.',
    },
    faqs: [
      { question: 'Ab wann gibt man das Alter eher in Monaten an?', answer: 'In der Kinderheilkunde wird das Alter meist bis zur 12. Woche in Lebenswochen und danach bis zum 2. Geburtstag in Lebensmonaten angegeben.' },
    ],
    relatedSlugs: ['altersrechner', 'alter-in-tagen', 'alter-in-monaten', 'geburtstermin-rechner'],
  },
  {
    id: 'alter-in-monaten',
    slug: 'alter-in-monaten',
    name: 'Alter-in-Monaten-Rechner',
    shortName: 'Alter in Monaten',
    category: 'datum-zeit',
    subcategory: 'Alter & Geburtstag',
    metaTitle: 'Alter in Monaten Rechner – Lebensmonate exakt berechnen',
    metaDescription: 'Wie viele Monate alt sind Sie oder Ihr Kind? Berechnen Sie volle Monate und verbleibende Tage schnell und unkompliziert.',
    h1: 'Alter in Monaten berechnen',
    shortDescription: 'Berechnet die vollendeten Lebensmonate zwischen Geburtsdatum und Stichtag.',
    searchKeywords: ['alter in monaten', 'lebensmonate berechnen', 'wie viele monate alt'],
    inputs: [
      { id: 'birthDate', label: 'Geburtsdatum', type: 'date', defaultValue: '2024-03-10' },
      { id: 'targetDate', label: 'Stichtag', type: 'date', defaultValue: '2026-01-10' },
    ],
    calculate: (inputs) => {
      const b = new Date(inputs.birthDate || '2024-03-10');
      const t = new Date(inputs.targetDate || '2026-01-10');
      let years = t.getFullYear() - b.getFullYear();
      let months = t.getMonth() - b.getMonth();
      let days = t.getDate() - b.getDate();
      if (days < 0) {
        months--;
        const prevMonth = new Date(t.getFullYear(), t.getMonth(), 0).getDate();
        days += prevMonth;
      }
      if (months < 0) {
        years--;
        months += 12;
      }
      const totalMonths = Math.max(0, years * 12 + months);
      return {
        primary: { id: 'months', label: 'Alter in Monaten', value: totalMonths, formattedValue: `${totalMonths} Monate, ${days} Tage`, highlight: true },
        secondary: [
          { id: 'years', label: 'In Jahren', value: totalMonths / 12, formattedValue: `${formatNumber(totalMonths / 12, 1)} Jahre` },
          { id: 'totalDays', label: 'Gesamttage', value: Math.floor((t.getTime() - b.getTime()) / 86400000), formattedValue: `${formatNumber(Math.floor((t.getTime() - b.getTime()) / 86400000), 0)} Tage` },
        ],
        summaryText: `Das Alter beläuft sich auf ${totalMonths} vollendete Monate und ${days} Tage.`,
      };
    },
    formula: 'Monate = (Jahre × 12) + Monatsdifferenz',
    formulaExplanation: 'Zunächst wird die Anzahl ganzer Jahre mit 12 multipliziert und um die überzähligen Monate ergänzt.',
    workedExample: {
      title: 'Beispiel: 22 Monate',
      description: 'Zwischen März 2024 und Januar 2026 liegen genau 22 Monate.',
      inputs: { birthDate: '2024-03-10', targetDate: '2026-01-10' },
      resultSummary: '22 Monate',
    },
    content: {
      intro: 'Berechnen Sie das Alter in Lebensmonaten – besonders hilfreich für Eltern bei der U-Untersuchung von Babys oder für die Feststellung von Altersgrenzen.',
      details: 'Der Rechner beachtet unterschiedliche Monatslängen (28, 29, 30 oder 31 Tage) taggenau.',
    },
    faqs: [
      { question: 'Wie viele Tage hat ein durchschnittlicher Monat?', answer: 'Im gregorianischen Kalender hat ein durchschnittlicher Monat 30,4375 Tage (365,2425 Tage geteilt durch 12).' },
    ],
    relatedSlugs: ['altersrechner', 'alter-in-wochen', 'alter-in-tagen'],
  },
  {
    id: 'altersunterschied',
    slug: 'altersunterschied',
    name: 'Altersunterschieds-Rechner',
    shortName: 'Altersunterschied',
    category: 'datum-zeit',
    subcategory: 'Alter & Geburtstag',
    metaTitle: 'Altersunterschied Rechner – Abstand zweier Geburtsdaten',
    metaDescription: 'Ermitteln Sie den genauen Altersunterschied zwischen zwei Personen in Jahren, Monaten, Tagen und Wochen.',
    h1: 'Altersunterschied zwischen zwei Personen berechnen',
    shortDescription: 'Vergleicht zwei Geburtsdaten und berechnet die exakte zeitliche Differenz.',
    searchKeywords: ['altersunterschied rechner', 'altersabstand berechnen', 'wer ist älter', 'differenz geburtsdatum'],
    inputs: [
      { id: 'datePerson1', label: 'Geburtsdatum Person 1', type: 'date', defaultValue: '1988-04-12' },
      { id: 'datePerson2', label: 'Geburtsdatum Person 2', type: 'date', defaultValue: '1992-09-25' },
    ],
    calculate: calculateAgeDifference,
    formula: 'Differenz = |Geburtsdatum 1 - Geburtsdatum 2|',
    formulaExplanation: 'Das spätere Datum wird vom früheren Datum subtrahiert. Die Differenz wird in Jahre, Monate und Tage aufgeteilt.',
    workedExample: {
      title: 'Beispiel: 12.04.1988 und 25.09.1992',
      description: 'Person 1 ist 4 Jahre, 5 Monate und 13 Tage älter als Person 2.',
      inputs: { datePerson1: '1988-04-12', datePerson2: '1992-09-25' },
      resultSummary: '4 Jahre, 5 Monate, 13 Tage',
    },
    content: {
      intro: 'Ob zwischen Geschwistern, Partnern oder Freunden: Mit diesem Rechner erfahren Sie auf den Tag genau, wie groß der Altersabstand ist.',
      details: 'Neben der Angabe in Jahren und Monaten liefert der Rechner auch die absolute Tagesdifferenz.',
    },
    faqs: [
      { question: 'Gibt es eine Faustformel für den Altersunterschied in Partnerschaften?', answer: 'In der Popkultur existiert die sogenannte Halb-dein-Alter-plus-7-Regel, sie besitzt jedoch keinerlei wissenschaftliche oder rechtliche Relevanz.' },
    ],
    relatedSlugs: ['altersrechner', 'datumsdifferenz', 'geburtstagsrechner'],
  },
  {
    id: 'geburtstagsrechner',
    slug: 'geburtstagsrechner',
    name: 'Geburtstagsrechner',
    shortName: 'Geburtstagsrechner',
    category: 'datum-zeit',
    subcategory: 'Alter & Geburtstag',
    metaTitle: 'Geburtstagsrechner – Wochentag der Geburt & nächster Geburtstag',
    metaDescription: 'An welchem Wochentag wurden Sie geboren? Wann ist Ihr nächster Geburtstag und wie viele Tage verbleiben noch? Jetzt online berechnen.',
    h1: 'Geburtstagsrechner – Wochentag & Countdown',
    shortDescription: 'Berechnet den Wochentag der Geburt, den Wochentag des nächsten Geburtstags sowie die verbleibenden Tage.',
    searchKeywords: ['geburtstagsrechner', 'an welchem wochentag geboren', 'wochentag geburtstag', 'tage bis geburtstag'],
    inputs: [
      { id: 'birthDate', label: 'Ihr Geburtsdatum', type: 'date', defaultValue: '1992-08-14' },
    ],
    calculate: calculateBirthdayWeekday,
    formula: 'Wochentag nach Zellers Kongruenz / Doomsday-Algorithmus',
    formulaExplanation: 'Anhand der Kalenderrechnung wird der genaue Wochentag (Montag bis Sonntag) bestimmt.',
    workedExample: {
      title: 'Beispiel: 14. August 1992',
      description: 'Der 14.08.1992 war ein Freitag.',
      inputs: { birthDate: '1992-08-14' },
      resultSummary: 'Freitag',
    },
    content: {
      intro: 'Wussten Sie, an welchem Wochentag Sie das Licht der Welt erblickt haben? Finden Sie es heraus und sehen Sie zugleich, auf welchen Wochentag Ihr nächster Geburtstag fällt.',
      details: 'Das Tool zeigt Ihnen auch die exakte Tagesanzahl, die Sie noch bis zur nächsten Geburtstagsfeier warten müssen.',
    },
    faqs: [
      { question: 'Wiederholt sich der Wochentag des Geburtstags in einem festen Rhythmus?', answer: 'Aufgrund der Schaltjahre verschiebt sich der Wochentag in Normaljahren um 1 Tag und nach einem Schaltjahr um 2 Tage nach vorn. Im Schnitt wiederholt sich der exakte Rhythmus alle 5, 6 oder 11 Jahre (nach 28 Jahren wiederholt sich der Sonnenzyklus exakt).' },
    ],
    relatedSlugs: ['altersrechner', 'tage-bis-geburtstag', 'schaltjahr-rechner'],
  },
  {
    id: 'tage-bis-geburtstag',
    slug: 'tage-bis-geburtstag',
    name: 'Tage-bis-zum-Geburtstag-Rechner',
    shortName: 'Tage bis Geburtstag',
    category: 'datum-zeit',
    subcategory: 'Alter & Geburtstag',
    metaTitle: 'Tage bis zum Geburtstag Rechner – Exakter Countdown',
    metaDescription: 'Wie viele Tage sind es noch bis zu Ihrem Geburtstag? Berechnen Sie die verbleibenden Tage, Wochen und Stunden bis zum Ehrentag.',
    h1: 'Tage bis zum nächsten Geburtstag berechnen',
    shortDescription: 'Countdown zum nächsten Geburtstag in Tagen, Stunden und Wochen.',
    searchKeywords: ['tage bis geburtstag', 'geburtstag countdown', 'wann habe ich wieder geburtstag'],
    inputs: [
      { id: 'birthDate', label: 'Geburtstag (Tag & Monat)', type: 'date', defaultValue: '1996-10-24' },
    ],
    calculate: (inputs) => {
      const b = new Date(inputs.birthDate || '1996-10-24');
      const today = new Date();
      const currentYear = today.getFullYear();
      let next = new Date(currentYear, b.getMonth(), b.getDate());
      if (next < today) {
        next = new Date(currentYear + 1, b.getMonth(), b.getDate());
      }
      const diffMs = next.getTime() - today.getTime();
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(days / 7);
      const remDays = days % 7;
      return {
        primary: { id: 'days', label: 'Verbleibende Tage', value: days, formattedValue: `${days} Tage`, highlight: true },
        secondary: [
          { id: 'nextDate', label: 'Datum des nächsten Geburtstags', value: formatDateDe(next), formattedValue: formatDateDe(next) },
          { id: 'weeks', label: 'In Wochen', value: weeks, formattedValue: `${weeks} Wochen und ${remDays} Tage` },
          { id: 'hours', label: 'In Stunden (ca.)', value: days * 24, formattedValue: `ca. ${days * 24} Stunden` },
        ],
        summaryText: `Bis zu Ihrem nächsten Geburtstag am ${formatDateDe(next)} sind es noch genau ${days} Tage (${weeks} Wochen und ${remDays} Tage).`,
      };
    },
    formula: 'Tage = Nächster Geburtstag - Heutiges Datum',
    formulaExplanation: 'Liegt der Geburtstag im aktuellen Kalenderjahr bereits in der Vergangenheit, wird der Geburtstag des Folgejahres als Zielzeitpunkt angesetzt.',
    workedExample: {
      title: 'Beispiel: Nächster Geburtstag in 45 Tagen',
      description: 'Es verbleiben 6 Wochen und 3 Tage.',
      inputs: { birthDate: '1996-10-24' },
      resultSummary: '45 Tage',
    },
    content: {
      intro: 'Starten Sie den Countdown: Dieser Rechner verrät Ihnen, wie oft Sie noch schlafen müssen, bis Ihr nächstes Wiegenfest ansteht.',
      details: 'Ideal für die Planung von Geburtstagsfeiern, Einladungen und Geschenken.',
    },
    faqs: [
      { question: 'Wie viele Geburtstage feiert ein Mensch im Durchschnitt?', answer: 'In Deutschland liegt die durchschnittliche Lebenserwartung bei ca. 81 Jahren, sodass Menschen im Mittel 80 bis 82 Geburtstage erleben.' },
    ],
    relatedSlugs: ['geburtstagsrechner', 'altersrechner', 'countdown-rechner'],
  },
  {
    id: 'datumsdifferenz',
    slug: 'datumsdifferenz',
    name: 'Datumsdifferenz-Rechner',
    shortName: 'Datumsdifferenz',
    category: 'datum-zeit',
    subcategory: 'Datumsdifferenz',
    metaTitle: 'Datumsdifferenz Rechner – Abstand zweier Daten genau berechnen',
    metaDescription: 'Berechnen Sie die exakte Zeitspanne zwischen zwei beliebigen Daten in Tagen, Wochen, Monaten und Jahren. Kostenlos & sekundenschnell.',
    h1: 'Datumsdifferenz berechnen',
    shortDescription: 'Ermittelt die genaue Distanz zwischen einem Start- und Enddatum in allen Zeiteinheiten.',
    searchKeywords: ['datumsdifferenz rechner', 'zeitspanne zwischen zwei daten', 'tage zwischen zwei daten', 'abstand zwischen daten'],
    inputs: [
      { id: 'startDate', label: 'Startdatum', type: 'date', defaultValue: '2026-01-01' },
      { id: 'endDate', label: 'Enddatum', type: 'date', defaultValue: '2026-12-31' },
    ],
    calculate: calculateDateDifference,
    formula: 'Tagesdifferenz = (Enddatum - Startdatum) / 86.400.000 ms',
    formulaExplanation: 'Die Kalendertage werden unter Berücksichtigung von Monatslängen und Schaltjahren exakt ermittelt.',
    workedExample: {
      title: 'Beispiel: 01.01.2026 bis 31.12.2026',
      description: 'Ein komplettes Gemeinjahr mit 365 Tagen.',
      inputs: { startDate: '2026-01-01', endDate: '2026-12-31' },
      resultSummary: '364 Tage (exklusive Endtag) bzw. 365 Tage',
    },
    content: {
      intro: 'Mit dem Datumsdifferenz-Rechner ermitteln Sie in Sekundenschnelle die Zeitdauer zwischen zwei beliebigen Kalenderdaten.',
      details: 'Perfekt für Fristenberechnungen, Verträge, Kündigungsfristen, Projektlaufzeiten oder Urlaubsreisen.',
    },
    faqs: [
      { question: 'Zählt der Anfangstag bei Fristen mit?', answer: 'Nach deutschem Zivilrecht (§ 187 Abs. 1 BGB) wird bei Ereignisfristen der Tag des auslösenden Ereignisses bei der Fristberechnung nicht mitgerechnet.' },
    ],
    relatedSlugs: ['tage-zwischen-zwei-daten', 'arbeitstage-rechner', 'kalendertage-rechner'],
  },
  {
    id: 'wochen-zwischen-daten',
    slug: 'wochen-zwischen-daten',
    name: 'Wochen-zwischen-zwei-Daten-Rechner',
    shortName: 'Wochen zwischen Daten',
    category: 'datum-zeit',
    subcategory: 'Datumsdifferenz',
    metaTitle: 'Wochen zwischen zwei Daten Rechner – Zeitspanne in Wochen',
    metaDescription: 'Berechnen Sie die genaue Anzahl voller Wochen und verbleibender Tage zwischen zwei Kalenderdaten online.',
    h1: 'Wochen zwischen zwei Daten berechnen',
    shortDescription: 'Ermittelt die exakte Wochenanzahl und Resttage zwischen Start- und Enddatum.',
    searchKeywords: ['wochen zwischen zwei daten', 'wochen rechner zeitspanne', 'wieviele wochen zwischen'],
    inputs: [
      { id: 'startDate', label: 'Startdatum', type: 'date', defaultValue: '2026-01-01' },
      { id: 'endDate', label: 'Enddatum', type: 'date', defaultValue: '2026-06-30' },
    ],
    calculate: (inputs) => {
      const res = calculateDateDifference(inputs);
      const weeksItem = res.secondary?.find((s) => s.id === 'weeks');
      return {
        primary: { id: 'weeks', label: 'Volle Wochen', value: weeksItem?.value || 0, formattedValue: String(weeksItem?.formattedValue || ''), highlight: true },
        secondary: res.secondary,
        summaryText: res.summaryText,
      };
    },
    formula: 'Wochen = Abrunden(Kalendertage / 7)',
    formulaExplanation: 'Division der Gesamttage durch 7 Tage pro Woche.',
    workedExample: {
      title: 'Beispiel: 01.01.2026 bis 30.06.2026',
      description: '180 Tage = 25 Wochen und 5 Tage.',
      inputs: { startDate: '2026-01-01', endDate: '2026-06-30' },
      resultSummary: '25 Wochen, 5 Tage',
    },
    content: {
      intro: 'Ermitteln Sie die Spanne zwischen zwei Terminen in Wochen – ideal für Projektplanungen, Schwangerschaften oder Semesterzeiten.',
      details: 'Der Rechner gibt sowohl die vollen Wochen als auch die verbleibenden Resttage aus.',
    },
    faqs: [
      { question: 'Wie viele Wochen hat ein Halbjahr?', answer: 'Ein Halbjahr umfasst ca. 26 Wochen (ein volles Jahr hat 52 Wochen und 1 bis 2 Tage).' },
    ],
    relatedSlugs: ['datumsdifferenz', 'monate-zwischen-daten', 'kalendertage-rechner'],
  },
  {
    id: 'monate-zwischen-daten',
    slug: 'monate-zwischen-daten',
    name: 'Monate-zwischen-zwei-Daten-Rechner',
    shortName: 'Monate zwischen Daten',
    category: 'datum-zeit',
    subcategory: 'Datumsdifferenz',
    metaTitle: 'Monate zwischen zwei Daten Rechner – Kalendermonate ermitteln',
    metaDescription: 'Berechnen Sie die vollendeten Monate und Tage zwischen zwei Terminen. Perfekt für Kündigungsfristen und Mietverträge.',
    h1: 'Monate zwischen zwei Daten berechnen',
    shortDescription: 'Berechnet die Anzahl ganzer Kalendermonate und verbleibender Tage.',
    searchKeywords: ['monate zwischen zwei daten', 'anzahl monate berechnen', 'monatsdifferenz rechner'],
    inputs: [
      { id: 'startDate', label: 'Startdatum', type: 'date', defaultValue: '2026-01-15' },
      { id: 'endDate', label: 'Enddatum', type: 'date', defaultValue: '2026-10-15' },
    ],
    calculate: (inputs) => {
      const s = new Date(inputs.startDate || '2026-01-15');
      const e = new Date(inputs.endDate || '2026-10-15');
      let years = e.getFullYear() - s.getFullYear();
      let months = e.getMonth() - s.getMonth();
      let days = e.getDate() - s.getDate();
      if (days < 0) {
        months--;
        const prevMonth = new Date(e.getFullYear(), e.getMonth(), 0).getDate();
        days += prevMonth;
      }
      if (months < 0) {
        years--;
        months += 12;
      }
      const totalMonths = years * 12 + months;
      return {
        primary: { id: 'm', label: 'Differenz in Monaten', value: totalMonths, formattedValue: `${totalMonths} Monate und ${days} Tage`, highlight: true },
        secondary: [
          { id: 'daysTotal', label: 'In Gesamttagen', value: Math.floor((e.getTime() - s.getTime()) / 86400000), formattedValue: `${Math.floor((e.getTime() - s.getTime()) / 86400000)} Tage` },
        ],
        summaryText: `Zwischen beiden Daten liegen ${totalMonths} Monate und ${days} Tage.`,
      };
    },
    formula: 'Monate = (Jahre × 12) + Monatsdifferenz',
    formulaExplanation: 'Berücksichtigung der Kalendermonatsgrenzen.',
    workedExample: {
      title: 'Beispiel: 15.01. bis 15.10.2026',
      description: 'Genau 9 Monate.',
      inputs: { startDate: '2026-01-15', endDate: '2026-10-15' },
      resultSummary: '9 Monate',
    },
    content: {
      intro: 'Für Verträge, Kündigungen oder Probezeiten ist oft die Monatsanzahl maßgeblich.',
      details: 'Berechnen Sie hier die genaue Monatsdistanz zwischen zwei Kalenderdaten.',
    },
    faqs: [
      { question: 'Gilt bei Mietverträgen der Monatsanfang?', answer: 'Kündigungen von Wohnraummietverträgen müssen bis zum dritten Werktag eines Monats beim Vermieter eingehen, damit der Monat noch zur 3-monatigen Kündigungsfrist zählt.' },
    ],
    relatedSlugs: ['wochen-zwischen-daten', 'datumsdifferenz', 'kalendertage-rechner'],
  },
  {
    id: 'kalendertage-rechner',
    slug: 'kalendertage-rechner',
    name: 'Kalendertage-Rechner',
    shortName: 'Kalendertage berechnen',
    category: 'datum-zeit',
    subcategory: 'Datumsdifferenz',
    metaTitle: 'Kalendertage Rechner – Anzahl aller Kalendertage ermitteln',
    metaDescription: 'Berechnen Sie alle Kalendertage eines Zeitraums inklusive Sonn- und Feiertage. Einfach & zuverlässig.',
    h1: 'Kalendertage berechnen',
    shortDescription: 'Zählt alle Kalendertage zwischen Start- und Enddatum ohne Ausnahme.',
    searchKeywords: ['kalendertage rechner', 'anzahl kalendertage', 'tage zählen kalender'],
    inputs: [
      { id: 'startDate', label: 'Startdatum', type: 'date', defaultValue: '2026-01-01' },
      { id: 'endDate', label: 'Enddatum', type: 'date', defaultValue: '2026-03-31' },
    ],
    calculate: calculateDateDifference,
    formula: 'Tage = (Ende - Anfang) / 86.400.000 ms',
    formulaExplanation: 'Zählt alle Tage fortlaufend durch.',
    workedExample: {
      title: 'Beispiel: 1. Quartal 2026 (Jan bis März)',
      description: '31 + 28 + 31 = 90 Kalendertage.',
      inputs: { startDate: '2026-01-01', endDate: '2026-03-31' },
      resultSummary: '89 bzw. 90 Kalendertage',
    },
    content: {
      intro: 'Zählen Sie die absolute Anzahl der Tage in einem beliebigen Zeitraum.',
      details: 'Wichtig für Hotelübernachtungen, Reisedauern oder tägliche Pauschalen.',
    },
    faqs: [
      { question: 'Wie viele Tage hat das Jahr 2026?', answer: 'Genau 365 Kalendertage.' },
    ],
    relatedSlugs: ['arbeitstage-rechner', 'werktage-rechner', 'datumsdifferenz'],
  },
  {
    id: 'arbeitszeitrechner',
    slug: 'arbeitszeitrechner',
    name: 'Arbeitszeitrechner (Stempeluhr & Pausen)',
    shortName: 'Arbeitszeit erfassen',
    category: 'datum-zeit',
    subcategory: 'Arbeitstage & Werktage',
    metaTitle: 'Arbeitszeitrechner – Tägliche Arbeitszeit & Pausen online berechnen',
    metaDescription: 'Erfassen Sie Ihre tägliche Arbeitszeit: Beginn, Ende und Pause eingeben und sofort Netto-Arbeitszeit und Industriestunden berechnen.',
    h1: 'Arbeitszeitrechner – Zeiterfassung & Pausen',
    shortDescription: 'Berechnet die tägliche Netto-Arbeitszeit nach Abzug der gesetzlichen Pausen.',
    searchKeywords: ['arbeitszeitrechner', 'zeiterfassung rechner', 'arbeitszeit berechnen pause', 'stempeluhr rechner'],
    inputs: [
      { id: 'startTime', label: 'Kommen (Arbeitsbeginn)', type: 'select', defaultValue: '08:00', options: generateTimeOptions() },
      { id: 'endTime', label: 'Gehen (Arbeitsende)', type: 'select', defaultValue: '16:30', options: generateTimeOptions() },
      { id: 'pauseMinutes', label: 'Pausendauer in Minuten', type: 'number', defaultValue: 30, unit: 'Min.' },
    ],
    calculate: calculateTimeDifference,
    formula: 'Nettoarbeitszeit = (Gehen - Kommen) - Pause',
    formulaExplanation: 'Berechnung der reinen Arbeitszeit nach § 4 Arbeitszeitgesetz (ArbZG).',
    workedExample: {
      title: 'Beispiel: 08:00 bis 16:30 Uhr mit 30 Min. Pause',
      description: '8 Stunden und 0 Minuten Netto-Arbeitszeit (8,00 Industriestunden).',
      inputs: { startTime: '08:00', endTime: '16:30', pauseMinutes: 30 },
      resultSummary: '8 Std. 0 Min.',
    },
    content: {
      intro: 'Nach dem ArbZG müssen bei einer Arbeitszeit von mehr als 6 Stunden mindestens 30 Minuten und bei mehr als 9 Stunden mindestens 45 Minuten Pause eingelegt werden.',
      details: 'Dieser Rechner ermittelt sofort, ob Sie Ihre Soll-Arbeitszeit erreicht haben.',
    },
    faqs: [
      { question: 'Wann ist eine Pause gesetzlich Pflicht?', answer: 'Nach § 4 ArbZG ist die Arbeit bei mehr als 6 bis zu 9 Stunden durch mindestens 30 Minuten Pause zu unterbrechen. Bei mehr als 9 Stunden Gesamtarbeitszeit sind mindestens 45 Minuten Pause vorgeschrieben.' },
    ],
    relatedSlugs: ['stundenrechner', 'arbeitstage-rechner', 'stundenlohnrechner'],
  },
  {
    id: 'tage-zwischen-zwei-daten',
    slug: 'tage-zwischen-zwei-daten',
    name: 'Tage-zwischen-zwei-Daten-Rechner',
    shortName: 'Tage zwischen Daten',
    category: 'datum-zeit',
    subcategory: 'Datumsdifferenz',
    metaTitle: 'Tage zwischen zwei Daten Rechner – Kalendertage ermitteln',
    metaDescription: 'Wie viele Tage liegen zwischen zwei Terminen? Schnelle Berechnung von Kalendertagen inklusive oder exklusive Enddatum.',
    h1: 'Tage zwischen zwei Daten berechnen',
    shortDescription: 'Berechnet die absolute Anzahl der Tage zwischen zwei Zeitpunkten.',
    searchKeywords: ['tage zwischen zwei daten', 'anzahl tage berechnen', 'wieviele tage zwischen', 'kalendertage rechner'],
    inputs: [
      { id: 'startDate', label: 'Erstes Datum', type: 'date', defaultValue: '2026-06-01' },
      { id: 'endDate', label: 'Zweites Datum', type: 'date', defaultValue: '2026-08-31' },
    ],
    calculate: calculateDateDifference,
    formula: 'Tage = |Datum B - Datum A| in Tagen',
    formulaExplanation: 'Subtraktion zweier Kalenderdaten auf Tagesbasis.',
    workedExample: {
      title: 'Beispiel: Sommerferien-Zeitraum (01.06. bis 31.08.2026)',
      description: 'Genau 91 Tage.',
      inputs: { startDate: '2026-06-01', endDate: '2026-08-31' },
      resultSummary: '91 Tage',
    },
    content: {
      intro: 'Ermitteln Sie die exakte Anzahl der Tage zwischen zwei Terminen.',
      details: 'Hilfreich bei Mietverträgen, Zinsberechnungen nach deutscher oder internationaler Zinsmethode und Reiseplanungen.',
    },
    faqs: [
      { question: 'Gibt es einen Unterschied zwischen Kalendertagen und Werktagen?', answer: 'Ja. Kalendertage umfassen jeden Tag der Woche (Montag bis Sonntag). Werktage schließen Sonn- und Feiertage aus (Samstag ist rechtlich ein Werktag, sofern nicht anders vereinbart).' },
    ],
    relatedSlugs: ['datumsdifferenz', 'arbeitstage-rechner', 'kalendertage-rechner'],
  },
  {
    id: 'arbeitstage-rechner',
    slug: 'arbeitstage-rechner',
    name: 'Arbeitstage-Rechner',
    shortName: 'Arbeitstage berechnen',
    category: 'datum-zeit',
    subcategory: 'Arbeitstage & Werktage',
    metaTitle: 'Arbeitstage Rechner – Arbeitstage Mo–Fr genau berechnen',
    metaDescription: 'Berechnen Sie die Anzahl der Arbeitstage (Montag bis Freitag) in einem beliebigen Zeitraum. Ideal für Urlaubsplanung und Lohnabrechnung.',
    h1: 'Arbeitstage berechnen (Mo–Fr)',
    shortDescription: 'Zählt alle regulären Arbeitstage (Montag bis Freitag) unter Ausschluss von Samstagen und Sonntagen.',
    searchKeywords: ['arbeitstage rechner', 'arbeitstage berechnen', 'werktage mo fr rechner', 'arbeitstage monat'],
    inputs: [
      { id: 'startDate', label: 'Startdatum', type: 'date', defaultValue: '2026-01-01' },
      { id: 'endDate', label: 'Enddatum', type: 'date', defaultValue: '2026-01-31' },
      { id: 'hoursPerDay', label: 'Arbeitsstunden pro Tag', type: 'number', defaultValue: 8, unit: 'Std.' },
    ],
    calculate: calculateWorkdays,
    formula: 'Arbeitstage = Summe aller Tage mit Wochentag 1 bis 5 (Mo bis Fr)',
    formulaExplanation: 'Jeder Tag der Periode wird geprüft. Samstage (Wochentag 6) und Sonntage (Wochentag 0) werden abgezogen.',
    workedExample: {
      title: 'Beispiel: Januar 2026 (31 Kalendertage)',
      description: 'Enthält 22 Arbeitstage und 9 Wochenendtage.',
      inputs: { startDate: '2026-01-01', endDate: '2026-01-31', hoursPerDay: 8 },
      resultSummary: '22 Arbeitstage (176 Arbeitsstunden)',
    },
    content: {
      intro: 'Wie viele Arbeitstage hat ein Monat oder ein Quartal? Unser Arbeitstage-Rechner filtert alle Wochenenden heraus.',
      details: 'Dies ist die unverzichtbare Grundlage für die Berechnung von Soll-Arbeitsstunden, Monatsgehältern und Urlaubsanträgen.',
    },
    faqs: [
      { question: 'Wie viele Arbeitstage hat ein Jahr in Deutschland im Durchschnitt?', answer: 'In einer 5-Tage-Woche (Mo–Fr) hat ein Jahr durchschnittlich ca. 250 bis 252 Arbeitstage (nach Abzug von Wochenenden und bundesweiten Feiertagen).' },
    ],
    relatedSlugs: ['werktage-rechner', 'stundenrechner', 'arbeitszeitrechner', 'datumsdifferenz'],
  },
  {
    id: 'werktage-rechner',
    slug: 'werktage-rechner',
    name: 'Werktage-Rechner',
    shortName: 'Werktage berechnen',
    category: 'datum-zeit',
    subcategory: 'Arbeitstage & Werktage',
    metaTitle: 'Werktage Rechner – Werktage (Mo–Sa) nach BGB berechnen',
    metaDescription: 'Ermitteln Sie die Anzahl der gesetzlichen Werktage (Montag bis Samstag) für Mietzahlungen, Kündigungsfristen und BGB-Fristen.',
    h1: 'Werktage berechnen (Montag bis Samstag)',
    shortDescription: 'Zählt alle gesetzlichen Werktage inklusive Samstage gemäß deutschem Recht.',
    searchKeywords: ['werktage rechner', 'werktage bgb', 'werktage berechnen samstag', 'miete 3 werktage'],
    inputs: [
      { id: 'startDate', label: 'Startdatum', type: 'date', defaultValue: '2026-02-01' },
      { id: 'endDate', label: 'Enddatum', type: 'date', defaultValue: '2026-02-28' },
    ],
    calculate: (inputs) => {
      const s = new Date(inputs.startDate || '2026-02-01');
      const e = new Date(inputs.endDate || '2026-02-28');
      let werktage = 0;
      let sonntage = 0;
      let total = 0;
      const cur = new Date(s);
      while (cur <= e) {
        const day = cur.getDay();
        if (day === 0) {
          sonntage++;
        } else {
          werktage++;
        }
        total++;
        cur.setDate(cur.getDate() + 1);
      }
      return {
        primary: { id: 'werktage', label: 'Gesetzliche Werktage (Mo–Sa)', value: werktage, formattedValue: `${werktage} Werktage`, highlight: true },
        secondary: [
          { id: 'totalDays', label: 'Kalendertage', value: total, formattedValue: `${total} Tage` },
          { id: 'sundays', label: 'Sonntage', value: sonntage, formattedValue: `${sonntage} Tage` },
        ],
        summaryText: `Im Zeitraum von ${total} Kalendertagen gibt es ${werktage} gesetzliche Werktage (inklusive Samstagen) und ${sonntage} Sonntage.`,
      };
    },
    formula: 'Werktage = Alle Tage außer Sonntagen (und Feiertagen)',
    formulaExplanation: 'Nach ständiger Rechtsprechung und § 3 BUrlG gilt der Samstag gesetzlich als Werktag.',
    workedExample: {
      title: 'Beispiel: Februar 2026 (28 Tage)',
      description: '24 Werktage und 4 Sonntage.',
      inputs: { startDate: '2026-02-01', endDate: '2026-02-28' },
      resultSummary: '24 Werktage',
    },
    content: {
      intro: 'Nach deutschem Recht (§ 3 Bundesurlaubsgesetz, BGB) sind Werktage alle Kalendertage, die nicht Sonn- oder gesetzliche Feiertage sind. Das schließt den Samstag ein!',
      details: 'Besonders wichtig bei der Mietzahlung: Gemäß § 556b Abs. 1 BGB ist die Miete spätestens am 3. Werktag des Monats fällig.',
    },
    faqs: [
      { question: 'Ist der Samstag ein Werktag?', answer: 'Ja, nach § 3 Abs. 2 BUrlG sind Werktage alle Kalendertage, die nicht Sonn- oder gesetzliche Feiertage sind. Somit ist der Samstag gesetzlich ein Werktag.' },
    ],
    relatedSlugs: ['arbeitstage-rechner', 'datumsdifferenz', 'kalendertage-rechner'],
  },
  {
    id: 'datum-plus-tage',
    slug: 'datum-plus-tage',
    name: 'Datum-plus-Tage-Rechner',
    shortName: 'Datum + Tage',
    category: 'datum-zeit',
    subcategory: 'Datumsdifferenz',
    metaTitle: 'Datum plus Tage Rechner – Welches Datum ist in X Tagen?',
    metaDescription: 'Addieren Sie Tage zu einem Datum und erfahren Sie sofort das Zieldatum, den Wochentag und die Kalenderwoche.',
    h1: 'Datum plus Tage berechnen',
    shortDescription: 'Addiert eine beliebige Anzahl von Tagen zu einem Ausgangsdatum.',
    searchKeywords: ['datum plus tage', 'datum addieren', 'welches datum ist in 30 tagen', 'tage dazurechnen'],
    inputs: [
      { id: 'startDate', label: 'Ausgangsdatum', type: 'date', defaultValue: '2026-03-01' },
      { id: 'days', label: 'Hinzuzufügende Tage', type: 'number', defaultValue: 14, min: 0, unit: 'Tage' },
    ],
    calculate: (inputs) => calculateDateAdd({ ...inputs, operation: 'add' }),
    formula: 'Zieldatum = Ausgangsdatum + n Tage',
    formulaExplanation: 'Kalendarische Addition unter Berücksichtigung von Monatsüberläufen.',
    workedExample: {
      title: 'Beispiel: 01.03.2026 plus 14 Tage',
      description: 'Ergibt Sonntag, den 15.03.2026.',
      inputs: { startDate: '2026-03-01', days: 14 },
      resultSummary: '15.03.2026',
    },
    content: {
      intro: 'Müssen Sie eine Frist berechnen (z.B. Zahlungsziel in 14 Tagen oder Widerspruchsfrist in 30 Tagen)? Dieser Rechner gibt Ihnen das genaue Zieldatum.',
      details: 'Gleichzeitig wird der Wochentag ermittelt, sodass Sie sofort sehen, ob die Frist auf ein Wochenende fällt.',
    },
    faqs: [
      { question: 'Was passiert, wenn eine Frist am Sonntag endet?', answer: 'Nach § 193 BGB tritt an die Stelle eines Sonntags, Feiertags oder Samstags der nächste Werktag als Fristende.' },
    ],
    relatedSlugs: ['datum-minus-tage', 'datumsdifferenz', 'arbeitstage-rechner'],
  },
  {
    id: 'datum-minus-tage',
    slug: 'datum-minus-tage',
    name: 'Datum-minus-Tage-Rechner',
    shortName: 'Datum - Tage',
    category: 'datum-zeit',
    subcategory: 'Datumsdifferenz',
    metaTitle: 'Datum minus Tage Rechner – Welches Datum war vor X Tagen?',
    metaDescription: 'Ziehen Sie Tage von einem Datum ab. Finden Sie schnell heraus, welches Datum vor 14, 30 oder 90 Tagen war.',
    h1: 'Datum minus Tage berechnen',
    shortDescription: 'Subtrahiert Tage von einem Datum in die Vergangenheit.',
    searchKeywords: ['datum minus tage', 'datum subtrahieren', 'welches datum war vor 30 tagen'],
    inputs: [
      { id: 'startDate', label: 'Ausgangsdatum', type: 'date', defaultValue: '2026-05-01' },
      { id: 'days', label: 'Abzuziehende Tage', type: 'number', defaultValue: 30, min: 0, unit: 'Tage' },
    ],
    calculate: (inputs) => calculateDateAdd({ ...inputs, operation: 'subtract' }),
    formula: 'Zieldatum = Ausgangsdatum - n Tage',
    formulaExplanation: 'Rückwärtige kalendarische Verschiebung über Monatsgrenzen hinweg.',
    workedExample: {
      title: 'Beispiel: 01.05.2026 minus 30 Tage',
      description: 'Ergibt Mittwoch, den 01.04.2026.',
      inputs: { startDate: '2026-05-01', days: 30 },
      resultSummary: '01.04.2026',
    },
    content: {
      intro: 'Ermitteln Sie ganz einfach ein Datum in der Vergangenheit, indem Sie eine beliebige Anzahl von Tagen subtrahieren.',
      details: 'Nützlich bei rückwirkenden Fristen, Quarantänezeiten oder Verjährungsfristen.',
    },
    faqs: [
      { question: 'Berücksichtigt der Rechner Schaltjahre?', answer: 'Ja, auch bei der Rückwärtsrechnung wird der Februar im Schaltjahr mit 29 Tagen einbezogen.' },
    ],
    relatedSlugs: ['datum-plus-tage', 'datumsdifferenz', 'kalendertage-rechner'],
  },
  {
    id: 'schaltjahr-rechner',
    slug: 'schaltjahr-rechner',
    name: 'Schaltjahr-Rechner',
    shortName: 'Schaltjahr prüfen',
    category: 'datum-zeit',
    subcategory: 'Uhrzeit & Zeiteinheiten',
    metaTitle: 'Schaltjahr Rechner – Ist ein Jahr ein Schaltjahr? (Regeln & Prüfung)',
    metaDescription: 'Prüfen Sie jedes beliebige Jahr auf die Schaltjahr-Eigenschaft nach gregorianischem Kalender. Inklusive einfacher Erklärung der 400-Jahre-Regel.',
    h1: 'Schaltjahr Rechner – Ist das Jahr ein Schaltjahr?',
    shortDescription: 'Prüft, ob ein Kalenderjahr 365 oder 366 Tage hat und begründet die gregorianische Schaltregel.',
    searchKeywords: ['schaltjahr rechner', 'ist 2026 ein schaltjahr', 'wann ist das nächste schaltjahr', 'schaltjahr regel'],
    inputs: [
      { id: 'year', label: 'Kalenderjahr', type: 'number', defaultValue: 2026, min: 1, max: 9999 },
    ],
    calculate: calculateLeapYear,
    formula: 'Schaltjahr = (Jahr mod 4 == 0 AND Jahr mod 100 != 0) OR (Jahr mod 400 == 0)',
    formulaExplanation: 'Ein Jahr ist ein Schaltjahr, wenn es durch 4 teilbar ist. Ist es jedoch auch durch 100 teilbar, ist es KEIN Schaltjahr – es sei denn, es ist zugleich durch 400 teilbar.',
    workedExample: {
      title: 'Beispiel: Jahr 2026',
      description: '2026 ist nicht durch 4 teilbar -> Gemeinjahr mit 365 Tagen.',
      inputs: { year: 2026 },
      resultSummary: 'Nein (365 Tage)',
    },
    content: {
      intro: 'Ein Sonnenjahr dauert ca. 365 Tage, 5 Stunden, 48 Minuten und 46 Sekunden. Um die Differenz zum 365-Tage-Kalender auszugleichen, schuf Papst Gregor XIII. 1582 die moderne Schaltjahrregel.',
      details: 'Unser Rechner prüft jedes Jahr zwischen 1 und 9999 nach den offiziellen astronomischen Kalenderregeln.',
    },
    faqs: [
      { question: 'War das Jahr 2000 ein Schaltjahr?', answer: 'Ja, denn 2000 ist durch 400 teilbar. Das Jahr 1900 war dagegen kein Schaltjahr, da es zwar durch 100, aber nicht durch 400 teilbar ist.' },
      { question: 'Wann ist das nächste Schaltjahr nach 2026?', answer: 'Das nächste Schaltjahr nach 2026 ist das Jahr 2028.' },
    ],
    relatedSlugs: ['altersrechner', 'wochenrechner', 'kalendertage-rechner'],
  },
  {
    id: 'wochenrechner',
    slug: 'wochenrechner',
    name: 'Wochenrechner & Kalenderwoche (KW)',
    shortName: 'Kalenderwoche',
    category: 'datum-zeit',
    subcategory: 'Uhrzeit & Zeiteinheiten',
    metaTitle: 'Kalenderwoche Rechner – Aktuelle KW & Datum nach DIN ISO 8601',
    metaDescription: 'Ermitteln Sie die genaue Kalenderwoche (KW) für jedes Datum nach der europäischen Norm DIN ISO 8601. Inklusive Quartal und Jahrestag.',
    h1: 'Kalenderwoche Rechner (nach DIN ISO 8601)',
    shortDescription: 'Bestimmt die Kalenderwoche (KW), das Quartal und den Tag des Jahres für jedes Datum.',
    searchKeywords: ['kalenderwoche rechner', 'welche kw haben wir', 'iso 8601 kalenderwoche', 'kw rechner'],
    inputs: [
      { id: 'date', label: 'Datum auswählen', type: 'date', defaultValue: '2026-09-19' },
    ],
    calculate: calculateISOWeek,
    formula: 'KW nach ISO 8601: Die erste Woche des Jahres ist diejenige, die mindestens 4 Tage des neuen Jahres enthält.',
    formulaExplanation: 'Nach DIN ISO 8601 beginnt die Woche stets am Montag. Die Woche 1 eines Jahres ist die erste Woche mit einem Donnerstag im neuen Jahr.',
    workedExample: {
      title: 'Beispiel: 19. September 2026',
      description: 'Liegt in der Kalenderwoche KW 38.',
      inputs: { date: '2026-09-19' },
      resultSummary: 'KW 38',
    },
    content: {
      intro: 'In der deutschen Wirtschaft, Logistik und Projektplanung ist die Kalenderwoche (KW) die zentrale Zeiteinheit. Dieser Rechner ermittelt die offizielle KW nach DIN ISO 8601.',
      details: 'Zusätzlich sehen Sie das Quartal (Q1 bis Q4) sowie den Tag des Jahres.',
    },
    faqs: [
      { question: 'Kann ein Datum im Januar zur KW 52 oder 53 des Vorjahres gehören?', answer: 'Ja. Wenn der 1. Januar auf einen Freitag, Samstag oder Sonntag fällt, gehört er zur letzten Kalenderwoche des vorherigen Jahres.' },
    ],
    relatedSlugs: ['arbeitstage-rechner', 'datumsdifferenz', 'schaltjahr-rechner'],
  },
  {
    id: 'zeitdifferenz-rechner',
    slug: 'zeitdifferenz-rechner',
    name: 'Zeitdifferenz-Rechner (Stunden & Minuten)',
    shortName: 'Zeitdifferenz',
    category: 'datum-zeit',
    subcategory: 'Uhrzeit & Zeiteinheiten',
    metaTitle: 'Zeitdifferenz Rechner – Stunden & Minuten zwischen zwei Uhrzeiten',
    metaDescription: 'Berechnen Sie die Zeitspanne zwischen zwei Uhrzeiten abzüglich Pausen. Perfekt für Arbeitszeiterfassung und Industriestunden.',
    h1: 'Zeitdifferenz zwischen zwei Uhrzeiten berechnen',
    shortDescription: 'Berechnet die genaue Dauer zwischen Start- und Endzeitpunkt inklusive Pausenabzug und Dezimalstunden.',
    searchKeywords: ['zeitdifferenz rechner', 'stunden berechnen zwischen uhrzeiten', 'dauer uhrzeit rechner', 'industriestunden rechner'],
    inputs: [
      { id: 'startTime', label: 'Startzeit (von)', type: 'select', defaultValue: '08:00', options: generateTimeOptions() },
      { id: 'endTime', label: 'Endzeit (bis)', type: 'select', defaultValue: '16:30', options: generateTimeOptions() },
      { id: 'pauseMinutes', label: 'Pause in Minuten', type: 'number', defaultValue: 30, min: 0, step: 5, unit: 'Min.' },
    ],
    calculate: calculateTimeDifference,
    formula: 'Nettozeit = (Endzeit - Startzeit) - Pausenzeit',
    formulaExplanation: 'Die Zeitspanne wird in Minuten berechnet, die Pause abgezogen und das Ergebnis in Stunden + Minuten sowie in Dezimal-Industriestunden ausgegeben.',
    workedExample: {
      title: 'Beispiel: 08:00 bis 16:30 Uhr mit 30 Min. Pause',
      description: '8,5 Stunden brutto abzüglich 0,5 Stunden Pause ergeben 8,0 Stunden netto.',
      inputs: { startTime: '08:00', endTime: '16:30', pauseMinutes: 30 },
      resultSummary: '8 Std. 0 Min. (8,00 Industriestunden)',
    },
    content: {
      intro: 'Ob für den Arbeitszeitnachweis, Handwerkerrechnungen oder Sport: Dieser Rechner ermittelt exakt die verflossene Zeit zwischen zwei Uhrzeiten.',
      details: 'Das Ergebnis wird sowohl im Format Stunden:Minuten als auch in Dezimalstunden (z.B. 7,75 Std.) angezeigt, wie es in der Lohnabrechnung Standard ist.',
    },
    faqs: [
      { question: 'Funktioniert der Rechner auch über Mitternacht?', answer: 'Ja. Wenn die Endzeit vor der Startzeit liegt (z.B. Nachtschicht von 22:00 bis 06:00 Uhr), wird der Tageswechsel automatisch berücksichtigt.' },
    ],
    relatedSlugs: ['arbeitstage-rechner', 'stundenrechner', 'arbeitszeitrechner'],
  },
  {
    id: 'stundenrechner',
    slug: 'stundenrechner',
    name: 'Stundenrechner',
    shortName: 'Stundenrechner',
    category: 'datum-zeit',
    subcategory: 'Uhrzeit & Zeiteinheiten',
    metaTitle: 'Stundenrechner – Arbeitsstunden & Zeiten zusammenrechnen',
    metaDescription: 'Rechnen Sie Arbeitszeiten und Stunden schnell zusammen. Wandeln Sie Minuten in Dezimalstunden um.',
    h1: 'Stundenrechner – Arbeitszeit & Dauer',
    shortDescription: 'Addiert Stunden und Minuten und wandelt sie in Industriestunden um.',
    searchKeywords: ['stundenrechner', 'arbeitsstunden zusammenrechnen', 'minuten in stunden umrechnen'],
    inputs: [
      { id: 'startTime', label: 'Arbeitsbeginn', type: 'select', defaultValue: '07:30', options: generateTimeOptions() },
      { id: 'endTime', label: 'Arbeitsende', type: 'select', defaultValue: '16:15', options: generateTimeOptions() },
      { id: 'pauseMinutes', label: 'Pause', type: 'number', defaultValue: 45, unit: 'Min.' },
    ],
    calculate: calculateTimeDifference,
    formula: 'Arbeitszeit = (Ende - Beginn) - Pause',
    formulaExplanation: 'Subtraktion von Startzeit und Pause von der Endzeit.',
    workedExample: {
      title: 'Beispiel: 07:30 bis 16:15 Uhr, 45 Min. Pause',
      description: '8 Stunden und 0 Minuten.',
      inputs: { startTime: '07:30', endTime: '16:15', pauseMinutes: 45 },
      resultSummary: '8 Std. 0 Min.',
    },
    content: {
      intro: 'Erfassen Sie Ihre täglichen Arbeitsstunden schnell und fehlerfrei.',
      details: 'Ideal zur Überprüfung der eigenen Stempeluhr oder Zeiterfassung.',
    },
    faqs: [
      { question: 'Wie rechnet man Minuten in Industrieminuten (Dezimal) um?', answer: 'Teilen Sie die Minutenanzahl durch 60. Beispiel: 15 Minuten / 60 = 0,25 Stunden; 30 Minuten / 60 = 0,5 Stunden; 45 Minuten / 60 = 0,75 Stunden.' },
    ],
    relatedSlugs: ['zeitdifferenz-rechner', 'arbeitstage-rechner', 'arbeitszeitrechner'],
  },
  {
    id: 'countdown-rechner',
    slug: 'countdown-rechner',
    name: 'Countdown-Rechner',
    shortName: 'Countdown',
    category: 'datum-zeit',
    subcategory: 'Uhrzeit & Zeiteinheiten',
    metaTitle: 'Countdown Rechner – Tage, Stunden & Minuten bis zum Event',
    metaDescription: 'Erstellen Sie einen genauen Countdown zu jedem beliebigen Zieldatum (Hochzeit, Urlaub, Rente, Neujahr).',
    h1: 'Countdown Rechner zu jedem Zieldatum',
    shortDescription: 'Zählt die Tage, Stunden und Minuten bis zu einem zukünftigen Ereignis.',
    searchKeywords: ['countdown rechner', 'tage bis countdown', 'tage bis urlaub rechner', 'tage bis silvester'],
    inputs: [
      { id: 'targetDate', label: 'Zieldatum', type: 'date', defaultValue: '2026-12-31' },
      { id: 'eventName', label: 'Bezeichnung des Ereignisses', type: 'number', defaultValue: 0, helpText: 'z.B. Silvester / Urlaub' },
    ],
    calculate: (inputs) => {
      const target = new Date(inputs.targetDate || '2026-12-31');
      const now = new Date();
      const diffMs = target.getTime() - now.getTime();
      if (diffMs <= 0) {
        return {
          primary: { id: 'over', label: 'Status', value: 'Erreicht', formattedValue: 'Ereignis bereits erreicht!', highlight: true },
          summaryText: 'Das gewählte Datum liegt bereits in der Vergangenheit.',
        };
      }
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const weeks = Math.floor(days / 7);
      return {
        primary: { id: 'time', label: 'Verbleibende Zeit', value: days, formattedValue: `${days} Tage und ${hours} Stunden`, highlight: true },
        secondary: [
          { id: 'weeks', label: 'In Wochen', value: weeks, formattedValue: `${weeks} Wochen und ${days % 7} Tage` },
          { id: 'totalHours', label: 'Gesamtstunden', value: Math.floor(diffMs / 3600000), formattedValue: `${formatNumber(Math.floor(diffMs / 3600000), 0)} Stunden` },
        ],
        summaryText: `Bis zum ${formatDateDe(target)} verbleiben noch ${days} Tage und ${hours} Stunden.`,
      };
    },
    formula: 'Verbleibende Zeit = Zieldatum - Jetzt',
    formulaExplanation: 'Differenz in Millisekunden umgerechnet in Tage, Stunden und Wochen.',
    workedExample: {
      title: 'Beispiel: Countdown bis Jahresende 2026',
      description: 'Zählt die verbleibenden Kalendertage bis zum 31.12.2026.',
      inputs: { targetDate: '2026-12-31' },
      resultSummary: 'Exakte Tages- und Stundenzahl',
    },
    content: {
      intro: 'Ob Vorfreude auf den Sommerurlaub, die eigene Hochzeit, den Rentenbeginn oder den Jahreswechsel: Unser Countdown-Rechner zählt die Zeit für Sie herunter.',
      details: 'Geben Sie einfach Ihr Wunschdatum ein und sehen Sie auf einen Blick die verbleibende Spanne.',
    },
    faqs: [
      { question: 'Wie viele Tage hat das Jahr 2026?', answer: 'Das Jahr 2026 ist ein Gemeinjahr und hat genau 365 Tage (52 Wochen und 1 Tag).' },
    ],
    relatedSlugs: ['tage-bis-geburtstag', 'datumsdifferenz', 'wochenrechner'],
  },
];

function generateTimeOptions() {
  const opts = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hh = h < 10 ? `0${h}` : `${h}`;
      const mm = m < 10 ? `0${m}` : `${m}`;
      opts.push({ value: `${hh}:${mm}`, label: `${hh}:${mm} Uhr` });
    }
  }
  return opts;
}
