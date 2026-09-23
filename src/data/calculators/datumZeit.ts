import { CalculatorDefinition } from '@/types/calculator';
import {
  calculateAge,
  calculateAgeInDays,
  calculateDateDifference,
  calculateWorkdays,
  calculateWorkdaysAndHolidays,
  calculateDateAdd,
  calculateLeapYear,
  calculateTimeDifference,
  calculateAgeDifference,
  calculateBirthdayWeekday,
  calculateISOWeek,
} from '@/lib/calculators/datumZeit';
import { formatNumber, formatDateDe } from '@/lib/formatters';

const FEDERAL_STATE_OPTIONS = [
  { value: 'bundesweit', label: 'Bundesweit (nur 9 einheitliche Feiertage)' },
  { value: 'BW', label: 'Baden-Württemberg' },
  { value: 'BY', label: 'Bayern' },
  { value: 'BE', label: 'Berlin' },
  { value: 'BB', label: 'Brandenburg' },
  { value: 'HB', label: 'Bremen' },
  { value: 'HH', label: 'Hamburg' },
  { value: 'HE', label: 'Hessen' },
  { value: 'MV', label: 'Mecklenburg-Vorpommern' },
  { value: 'NI', label: 'Niedersachsen' },
  { value: 'NW', label: 'Nordrhein-Westfalen' },
  { value: 'RP', label: 'Rheinland-Pfalz' },
  { value: 'SL', label: 'Saarland' },
  { value: 'SN', label: 'Sachsen' },
  { value: 'ST', label: 'Sachsen-Anhalt' },
  { value: 'SH', label: 'Schleswig-Holstein' },
  { value: 'TH', label: 'Thüringen' },
];

const BOUNDARY_OPTIONS = [
  { value: 'both', label: 'Start- und Enddatum mitzählen (Beidseitig inklusive)' },
  { value: 'startOnly', label: 'Nur Startdatum mitzählen' },
  { value: 'endOnly', label: 'Nur Enddatum mitzählen' },
  { value: 'neither', label: 'Start- und Enddatum ausschließen (Exklusiv)' },
];

export const DATUM_ZEIT_CALCULATORS: CalculatorDefinition[] = [
  {
    id: 'altersrechner',
    slug: 'altersrechner',
    name: 'Altersrechner',
    shortName: 'Alter berechnen',
    category: 'datum-zeit',
    subcategory: 'Alter & Geburtstag',
    metaTitle: 'Altersrechner – Alter genau in Jahren, Monaten',
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
      intro: 'Die exakte Altersbestimmung erfordert die präzise Subtraktion von Geburtsjahr, -monat und -tag vom Stichtag unter Berücksichtigung der unterschiedlichen Monatslängen und Schaltjahre.',
      details: 'Im deutschen Recht (§ 187 Abs. 2 Satz 2 BGB) beginnt das Lebensjahr mit dem Beginn des Geburtstages. Wer am 29. Februar geboren wurde, vollendet in Gemeinjahren sein Lebensjahr gemäß § 188 BGB mit Ablauf des 28. Februars bzw. mit Beginn des 1. März.',
    },
    faqs: [
      { question: 'Wann vollenden am 29. Februar Geborene in Nicht-Schaltjahren ihr Lebensjahr?', answer: 'Nach deutschem Zivilrecht (§ 188 Abs. 3 BGB) gilt das Lebensjahr mit Ablauf des 28. Februars (24:00 Uhr) als vollendet, sodass der Geburtstag am 1. März gefeiert wird.' },
      { question: 'Wie berechnet man das Alter auf den Tag genau im Kopf?', answer: 'Man zieht zunächst das Geburtsjahr vom aktuellen Jahr ab. Liegt der Geburtstag im laufenden Jahr noch in der Zukunft, zieht man ein ganzes Jahr ab und berechnet die verbleibenden Monate und Resttage zum Vormonat.' },
    ],
    relatedSlugs: ['alter-in-tagen', 'geburtstagsrechner', 'datumsdifferenz', 'arbeitstage-rechner', 'altersunterschied'],
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
      intro: 'Die Zählung des Lebensalters in Tagen ermittelt die absolute Anzahl an Kalendertagen zwischen der Geburt und einem Zielzeitpunkt.',
      details: 'Jedes Normaljahr steuert exakt 365 Tage bei, während Schaltjahre 366 Tage umfassen. Ein Mensch erreicht seinen 10.000sten Lebenstag typischerweise im Alter von 27 Jahren und etwa vier Monaten.',
    },
    faqs: [
      { question: 'Werden Schalttage bei der Tageszählung vollständig berücksichtigt?', answer: 'Ja, alle 29. Februare, die zwischen dem Geburtsdatum und dem Stichtag liegen, werden voll als Einzeltage mitgezählt.' },
      { question: 'Wird der Geburtstag selbst als ganzer Tag mitgezählt?', answer: 'In der Zeitrechnung zählt der Geburtstag als Tag 0; nach Vollendung von 24 Stunden ist der erste Lebenstag abgeschlossen.' },
    ],
    relatedSlugs: ['altersrechner', 'geburtstagsrechner', 'datumsdifferenz', 'alter-in-wochen', 'alter-in-monaten'],
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
      intro: 'Die Umrechnung des Lebensalters in Stunden verdeutlicht die tatsächlich erlebte Zeitspanne und bietet eine greifbare Grundlage für biologische Vergleiche.',
      details: 'Ein durchschnittliches Menschenleben von 80 Jahren umfasst rund 700.000 Stunden. Rund ein Drittel davon (etwa 230.000 Stunden) verbringt der Mensch im Schlaf, während das menschliche Herz dabei über 2,8 Milliarden Schläge ausführt.',
    },
    faqs: [
      { question: 'Werden Sommer- und Winterzeit bei der Gesamtstundenzahl berücksichtigt?', answer: 'Für astronomische Lebenszeitberechnungen wird der standardmäßige 24-Stunden-Schnitt pro Kalendertag verwendet, da sich Sommer- und Winterzeit im Jahresverlauf gegenseitig aufheben.' },
      { question: 'Wie rechnet man Lebenstage manuell in Stunden um?', answer: 'Multiplizieren Sie die Gesamtanzahl der absoluten Lebenstage einfach mit dem Faktor 24.' },
    ],
    relatedSlugs: ['alter-in-tagen', 'altersrechner', 'alter-in-wochen'],
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
      intro: 'Vor allem in der Säuglingsentwicklung, bei kinderärztlichen U-Untersuchungen und in der Schwangerschaftsmedizin ist die Angabe des Alters in vollendeten Wochen der maßgebliche Standard.',
      details: 'Die Berechnung dividiert die Gesamtzahl der Lebenstage ganzzahlig durch 7. Der verbleibende Divisionsrest stellt die zusätzlichen Einzeltage dar (z. B. 12 Wochen und 4 Tage).',
    },
    faqs: [
      { question: 'Warum wird das Alter von Babys meist in Wochen statt Monaten angegeben?', answer: 'In den ersten Lebensmonaten verläuft die motorische und neuronale Entwicklung in rasanten Schüben, die sich in Wochenschritten wesentlich genauer beurteilen lassen als in ungleich langen Monaten.' },
      { question: 'Wie viele Wochen hat ein durchschnittliches Kalenderjahr?', answer: 'Ein Gemeinjahr hat 52 Wochen plus einen Tag (365 / 7 = 52,14), ein Schaltjahr 52 Wochen plus zwei Tage.' },
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
    shortDescription: 'Berechnet die vollendeten Lebensmonate zwischen Geburtsdatum und Stichtag mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
      intro: 'Für Verträge, Kündigungsfristen, Garantielaufzeiten sowie entwicklungspsychologische Stufen ist das Alter in vollen Monaten plus Resttagen eine wichtige Zeiteinheit.',
      details: 'Da Kalendermonate zwischen 28 und 31 Tagen schwanken, basiert die Monatszählung auf dem kalendarischen Monatssprung vom Ausgangstag zum gleichen Tag des Folgemonats.',
    },
    faqs: [
      { question: 'Wie wird gerechnet, wenn der Ausgangstag im Zielmonat nicht existiert (z. B. 31. Januar auf Februar)?', answer: 'Nach § 188 Abs. 3 BGB endet die Monatsfrist in solchen Fällen mit dem Ablauf des letzten Tages des Monats (also am 28. bzw. 29. Februar).' },
      { question: 'Wie viele Monate hat ein Kleinkind mit 2,5 Jahren?', answer: 'Zweieinhalb Lebensjahre entsprechen exakt 30 Kalendermonaten (2 × 12 + 6).' },
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
    shortDescription: 'Vergleicht zwei Geburtsdaten und berechnet die exakte zeitliche Differenz mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
      intro: 'Der chronologische Altersabstand zweier Personen drückt die zeitliche Distanz zwischen ihren Geburtstagen in Jahren, Monaten und Tagen sowie als absolute Tagesdifferenz aus.',
      details: 'Bei der Differenzbildung wird der zeitliche Abstand zwischen beiden Geburtszeitpunkten ermittelt. In Partnerschaften, Erbfolgen oder im Sport (Altersklassen) bildet dieser Wert die objektive Vergleichsbasis.',
    },
    faqs: [
      { question: 'Verändert sich der Altersabstand in Tagen jemals?', answer: 'Nein, die Anzahl der Kalendertage zwischen zwei Geburtszeitpunkten bleibt das gesamte Leben über unveränderlich konstant.' },
      { question: 'Wie wird der relative Altersunterschied mit zunehmendem Alter wahrgenommen?', answer: 'Psychologisch und prozentual schrumpft der Abstand: Ein Unterschied von 5 Jahren macht bei 15-Jährigen 33 % der Lebensspanne aus, bei 50-Jährigen nur noch 10 %.' },
    ],
    relatedSlugs: ['altersrechner', 'datumsdifferenz', 'geburtstagsrechner', 'alter-in-tagen', 'arbeitstage-rechner'],
  },
  {
    id: 'geburtstagsrechner',
    slug: 'geburtstagsrechner',
    name: 'Geburtstagsrechner',
    shortName: 'Geburtstagsrechner',
    category: 'datum-zeit',
    subcategory: 'Alter & Geburtstag',
    metaTitle: 'Geburtstagsrechner – Exaktes Alter & Wochentag der Geburt',
    metaDescription: 'Erfahren Sie Ihr genaues Alter in Tagen, den Wochentag Ihrer Geburt und spannende Meilensteine mit dem Geburtstagsrechner.',
    h1: 'Geburtstagsrechner – Alter & Geburtswochentag ermitteln',
    shortDescription: 'Ermittelt Ihr exaktes Alter in Tagen und Stunden sowie den Wochentag Ihrer Geburt und kommende runde Jubiläen.',
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
      intro: 'Dieser Geburtstagsplaner ermittelt den Wochentag der Geburt, das genaue Alter und den Wochentag künftiger runder Jubiläen.',
      details: 'Da ein Gemeinjahr 365 Tage hat (52 Wochen plus 1 Tag), verschiebt sich der Geburtstag in jedem Folgejahr um genau einen Wochentag nach vorne; nach einem Schaltjahr springt er um zwei Wochentage weiter.',
    },
    faqs: [
      { question: 'Warum wandert der Geburtstag jedes Jahr auf einen anderen Wochentag?', answer: 'Weil 365 geteilt durch 7 den Rest 1 ergibt; jeder Geburtstag rückt daher im Folgejahr um einen Wochentag weiter (Schaltjahre überspringen zwei Tage).' },
      { question: 'Wie viele Geburtstage fallen statistisch auf das Wochenende?', answer: 'Über einen Lebenszyklus von mehreren Jahrzehnten fallen im Schnitt ca. 28,5 Prozent (2/7) aller Geburtstage auf einen Samstag oder Sonntag.' },
    ],
    relatedSlugs: ['altersrechner', 'alter-in-tagen', 'datumsdifferenz', 'tage-bis-geburtstag', 'arbeitstage-rechner'],
  },
  {
    id: 'tage-bis-geburtstag',
    slug: 'tage-bis-geburtstag',
    name: 'Tage-bis-zum-Geburtstag-Rechner',
    shortName: 'Tage bis Geburtstag',
    category: 'datum-zeit',
    subcategory: 'Alter & Geburtstag',
    metaTitle: 'Tage bis zum Geburtstag – Countdown & Schlafeinheiten',
    metaDescription: 'Wie viele Tage sind es noch bis zum Geburtstag? Berechnen Sie verbleibende Tage, Wochen und Stunden mit dem Countdown-Rechner.',
    h1: 'Geburtstags-Countdown – Tage bis zum nächsten Geburtstag',
    shortDescription: 'Zählt die verbleibenden Tage, Wochen und Schlafeinheiten bis zum nächsten Geburtstag für Vorfreude und Eventplanung.',
    searchKeywords: ['tage bis zum geburtstag', 'tage bis geburtstag', 'geburtstag countdown', 'wann habe ich wieder geburtstag'],
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
      intro: 'Dieser Countdown berechnet die exakt verbleibenden Kalendertage und Stunden bis zu Ihrem nächsten Geburtstag.',
      details: 'Er berücksichtigt automatisch, ob der Geburtstag im laufenden Kalenderjahr bereits verstrichen ist (in diesem Fall wird auf das Folgejahr berechnet) und bezieht eventuelle Schalttage nahtlos ein.',
    },
    faqs: [
      { question: 'Wann schaltet der Rechner auf das nächste Lebensjahr um?', answer: 'Exakt um 00:00 Uhr des Geburtstages; an Ihrem Ehrentag selbst zeigt der Countdown "Heute ist Ihr Geburtstag!" an.' },
      { question: 'Wie viele Tage hat das persönliche Lebensjahr?', answer: '365 Tage, es sei denn, in den 12 Monaten bis zum nächsten Geburtstag liegt ein 29. Februar (dann sind es 366 Tage).' },
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
    metaTitle: 'Datumsdifferenz Rechner – Tage, Wochen & Monate berechnen',
    metaDescription: 'Berechnen Sie die genaue Differenz zwischen zwei Kalenderdaten in Tagen, Wochen, Monaten und Jahren schnell und exakt.',
    h1: 'Datumsdifferenz Rechner – Abstand zweier Daten ermitteln',
    shortDescription: 'Ermittelt die exakte Zeitspanne zwischen zwei Kalenderdaten in Tagen, Wochen, vollen Monaten und Jahren.',
    searchKeywords: ['datumsdifferenz', 'datumsdifferenz rechner', 'zeitspanne zwischen zwei daten', 'tage zwischen zwei daten', 'abstand zwischen daten'],
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
      intro: 'Die Kalendertagsberechnung zwischen zwei Fixdaten ermittelt die genaue Tageszahl wahlweise inklusive oder exklusive des Endtages.',
      details: 'Im deutschen Rechtsverkehr schließt die Fristberechnung nach § 187 Abs. 1 BGB den Tag des Ereignisses nicht mit ein; die Frist beginnt am Folgetag und endet mit Ablauf des letzten Tages.',
    },
    faqs: [
      { question: 'Was ist der Unterschied zwischen inklusiver und exklusiver Tageszählung?', answer: 'Bei exklusiver Zählung ergibt der Zeitraum 01. Mai bis 02. Mai genau 1 Tag. Bei inklusiver Zählung (beide Tage voll mitgerechnet) sind es 2 Tage.' },
      { question: 'Welche Methode wenden deutsche Banken bei Zinstagen an?', answer: 'Die deutsche Zinsmethode (30/360) rechnet jeden vollen Monat mit 30 Tagen und das Jahr mit 360 Tagen, während die Eurozinsmethode (act/360) kalendergenaue Tage nutzt.' },
    ],
    relatedSlugs: ['altersrechner', 'arbeitstage-rechner', 'geburtstagsrechner', 'alter-in-tagen', 'werktage-rechner'],
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
      intro: 'Die Wochenzählung zwischen zwei Stichtagen vereinfacht die Planung von Bauvorhaben, Probezeiten, Elternzeiten oder Semestern.',
      details: 'Die absolute Tagesdifferenz wird durch 7 geteilt. So lässt sich unmittelbar ablesen, wie viele volle Arbeits- und Ruhewochen für das Vorhaben zur Verfügung stehen.',
    },
    faqs: [
      { question: 'Wie viele Wochen liegen zwischen Jahresanfang und Jahresmitte?', answer: 'Zwischen dem 1. Januar und dem 1. Juli liegen in einem Gemeinjahr exakt 181 Tage bzw. 25 Wochen und 6 Tage.' },
      { question: 'Wie rechnet man Wochen schnell in Monate um?', answer: 'Multiplizieren Sie die Wochenzahl mit 7 und teilen Sie durch 30,4 (mittlere Monatslänge), oder rechnen Sie mit der Faustformel: 4,33 Wochen ergeben einen vollen Monat.' },
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
    shortDescription: 'Berechnet die Anzahl ganzer Kalendermonate und verbleibender Tage mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
      intro: 'Die genaue Monatsdistanz zwischen zwei Kalenderdaten ist entscheidend für Kündigungsfristen von Mietverträgen, Kreditzinsbindungen und Beschäftigungszeiten.',
      details: 'Die Berechnung ermittelt volle abgelaufene Monate unter Würdigung der Monatsenden (§ 188 BGB) und weist verbleibende Resttage separat aus.',
    },
    faqs: [
      { question: 'Wie wirkt sich ein Monatsende auf die Berechnung aus (z. B. 28. Februar bis 31. März)?', answer: 'Geht ein Zeitraum vom letzten Tag eines kurzen Monats bis zum letzten Tag eines längeren Monats, gilt der Monat rechtlich als vollendet.' },
      { question: 'Wie viele Monate Kündigungsfrist hat ein Wohnungsmietvertrag?', answer: 'Für Mieter beträgt die Frist gesetzlich stets 3 Monate (§ 573c BGB). Für Vermieter verlängert sie sich nach 5 und 8 Jahren Mietdauer auf 6 bzw. 9 Monate.' },
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
    shortDescription: 'Zählt alle Kalendertage zwischen Start- und Enddatum ohne Ausnahme mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
      intro: 'Dieser Zähler ermittelt die reine Anzahl an Kalendertagen eines Monats, Quartals oder frei wählbaren Zeitintervalls.',
      details: 'Kalendertage umfassen ausnahmslos alle 24-Stunden-Tage (Montag bis Sonntag inklusive aller gesetzlichen Feiertage). Dies ist die gesetzliche Basis für Verzugszinsen und Mietzinsberechnungen.',
    },
    faqs: [
      { question: 'Wie viele Kalendertage hat ein Quartal?', answer: 'Q1 hat 90 Tage (Schaltjahr: 91); Q2 hat 91 Tage; Q3 hat 92 Tage; Q4 hat 92 Tage.' },
      { question: 'Wann rechnen Gerichte nach Kalendertagen statt Werktagen?', answer: 'Fristen, die nach Wochen, Monaten oder Jahren bestimmt sind (§ 188 BGB), laufen nach Kalendertagen; nur der letzte Fristtag verlängert sich bei Samstagen/Sonntagen auf den Werktag (§ 193 BGB).' },
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
    metaTitle: 'Arbeitszeitrechner – Tägliche Arbeitszeit & Pausen',
    metaDescription: 'Erfassen Sie Ihre tägliche Arbeitszeit: Beginn, Ende und Pause eingeben und sofort Netto-Arbeitszeit und Industriestunden berechnen.',
    h1: 'Arbeitszeitrechner – Zeiterfassung & Pausen',
    shortDescription: 'Berechnet die tägliche Netto-Arbeitszeit nach Abzug der gesetzlichen Pausen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
      intro: 'Dieser Arbeitszeitrechner erfasst tägliche Arbeitsbeginn- und Endzeiten, zieht gesetzliche Pausenzeiten nach § 4 ArbZG ab und ermittelt Über- oder Minusstunden.',
      details: 'Nach § 4 Arbeitszeitgesetz ist bei einer Arbeitszeit von 6 bis 9 Stunden eine Ruhepause von mindestens 30 Minuten, bei mehr als 9 Stunden von mindestens 45 Minuten zwingend vorgeschrieben.',
    },
    faqs: [
      { question: 'Darf die gesetzliche Ruhepause aufgespalten werden?', answer: 'Ja, die Ruhepause kann in Zeitabschnitte von jeweils mindestens 15 Minuten aufgeteilt werden; kürzere Unterbrechungen gelten rechtlich nicht als Pause.' },
      { question: 'Zählt der Weg zur Arbeit als Arbeitszeit?', answer: 'Die normale Fahrt zur ersten Tätigkeitsstätte gilt als private Lebensführung; Dienstreisen oder Fahrten zwischen Kunden gelten hingegen in vollem Umfang als vergütungspflichtige Arbeitszeit.' },
    ],
    relatedSlugs: ['brutto-stundensatz-freiberufler-rechner', 'stundenrechner', 'arbeitstage-rechner', 'stundenlohnrechner'],
  },
  {
    id: 'tage-zwischen-zwei-daten',
    slug: 'tage-zwischen-zwei-daten',
    name: 'Tage-zwischen-zwei-Daten-Rechner',
    shortName: 'Tage zwischen Daten',
    category: 'datum-zeit',
    subcategory: 'Datumsdifferenz',
    metaTitle: 'Tage zwischen zwei Daten – Werktage & Kalendertage Rechner',
    metaDescription: 'Berechnen Sie Kalendertage und Werktage zwischen zwei Stichtagen mit Wochenendabzug für Projektplanung und Fristen.',
    h1: 'Tage zwischen zwei Daten – Zeitspannen exakt berechnen',
    shortDescription: 'Berechnet Werktage und Kalendertage zwischen zwei Datumsangaben für die präzise Fristen- und Projektplanung.',
    searchKeywords: ['tage zwischen zwei daten rechner', 'arbeitstage rechner', 'tage zwischen zwei daten', 'anzahl tage berechnen', 'wieviele tage zwischen', 'kalendertage rechner'],
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
      intro: 'Ermittelt die astronomisch exakte Anzahl von Kalendertagen zwischen Start- und Zieldatum unter Berücksichtigung aller zwischenliegenden Schaltjahre.',
      details: 'Die Berechnung basiert auf der Differenz der julianischen Tageszahlen oder Unix-Millisekunden, geteilt durch 86.400.000 Millisekunden pro Tag.',
    },
    faqs: [
      { question: 'Wie viele Tage liegen exakt zwischen Weihnachten (25.12.) und Silvester (31.12.)?', answer: 'Exklusiv des Starttages liegen exakt 6 Kalendertage dazwischen; zählt man beide Grenztage mit, sind es 7 Tage.' },
      { question: 'Wie wird ein Schalttag zwischen zwei Terminen gewertet?', answer: 'Liegt der 29. Februar innerhalb des gewählten Intervalls, erhöht sich die berechnete Tagesanzahl automatisch um genau 1.' },
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
    metaTitle: 'Arbeitstage Rechner – Arbeitstage pro Jahr nach Bundesland',
    metaDescription: 'Berechnen Sie die gesetzlichen Arbeitstage pro Jahr und Monat für alle 16 Bundesländer inklusive gesetzlicher Feiertage.',
    h1: 'Arbeitstage Rechner – Arbeitstage im Kalenderjahr ermitteln',
    shortDescription: 'Ermittelt die exakte Anzahl der Arbeitstage im Jahr oder Monat für alle deutschen Bundesländer mit Feiertagsberechnung.',
    searchKeywords: ['arbeitstage rechner bundesland', 'arbeitstage rechner', 'arbeitstage berechnen', 'werktage mo fr rechner', 'arbeitstage monat'],
    inputs: [
      { id: 'startDate', label: 'Startdatum', type: 'date', defaultValue: '2026-01-01' },
      { id: 'endDate', label: 'Enddatum', type: 'date', defaultValue: '2026-01-31' },
      {
        id: 'workweek',
        label: 'Arbeitswoche',
        type: 'select',
        defaultValue: 'mo-fr',
        options: [
          { value: 'mo-fr', label: 'Montag bis Freitag (Reguläre 5-Tage-Woche)' },
          { value: 'mo-sa', label: 'Montag bis Samstag (6-Tage-Woche / Werktage)' },
          { value: 'custom', label: 'Benutzerdefiniert' },
        ],
      },
      {
        id: 'excludeHolidays',
        label: 'Gesetzliche Feiertage abziehen',
        type: 'boolean',
        defaultValue: true,
        helpText: 'Berücksichtigt die gesetzlichen Feiertage des ausgewählten Bundeslandes',
      },
      {
        id: 'federalState',
        label: 'Bundesland für Feiertagsregelung',
        type: 'select',
        defaultValue: 'bundesweit',
        options: FEDERAL_STATE_OPTIONS,
      },
      { id: 'hoursPerDay', label: 'Arbeitsstunden pro Tag', type: 'number', defaultValue: 8, unit: 'Std.' },
      {
        id: 'includeBoundary',
        label: 'Zählung der Grenztage',
        type: 'select',
        defaultValue: 'both',
        options: BOUNDARY_OPTIONS,
      },
    ],
    calculate: calculateWorkdays,
    formula: 'Arbeitstage = Kalendertage – Wochenendtage – Feiertage (an Arbeitstagen)',
    formulaExplanation: 'Jeder Tag der Periode wird auf den gewählten Wochentagsmodus und Feiertagsstatus geprüft. Feiertage am Wochenende werden nicht doppelt abgezogen.',
    workedExample: {
      title: 'Beispiel: Januar 2026 (31 Kalendertage, Bundesweit)',
      description: 'Enthält 21 Arbeitstage (nach Abzug von 1 Feiertag an Neujahr und 9 Wochenendtagen) sowie 168 Arbeitsstunden.',
      inputs: { startDate: '2026-01-01', endDate: '2026-01-31', workweek: 'mo-fr', excludeHolidays: true, hoursPerDay: 8 },
      resultSummary: '21 Arbeitstage (168 Arbeitsstunden)',
    },
    content: {
      intro: 'Die Ermittlung der tatsächlichen Arbeitstage bildet das Fundament für die Pendlerpauschale in der Einkommensteuererklärung sowie für Urlaubs- und Arbeitszeitplanungen.',
      details: 'Ein typisches Kalenderjahr hat bei einer 5-Tage-Woche (Montag bis Freitag) zwischen 250 und 252 potenzielle Arbeitstage. Nach Abzug von Feiertagen und Urlaub verbleiben meist 200 bis 220 tatsächliche Arbeitstage.',
    },
    faqs: [
      { question: 'Wie viele Arbeitstage erkennt das Finanzamt bei einer 5-Tage-Woche pauschal an?', answer: 'Die meisten Finanzämter akzeptieren ohne gesonderte Einzelnachweise 220 bis 230 Arbeitstage pro Jahr für die Entfernungspauschale.' },
      { question: 'Müssen Feiertage am Wochenende abgezogen werden?', answer: 'Nein, Feiertage, die ohnehin auf einen Samstag oder Sonntag fallen, mindern die reguläre Arbeitszeit nicht zusätzlich.' },
    ],
    relatedSlugs: ['datumsdifferenz', 'werktage-rechner', 'altersrechner', 'arbeitszeitrechner', 'urlaubstage-rechner'],
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
    shortDescription: 'Zählt alle gesetzlichen Werktage inklusive Samstage gemäß deutschem Recht mit präziser Feiertagsprüfung und anpassbarer Arbeitswoche.',
    searchKeywords: ['werktage rechner', 'werktage bgb', 'werktage berechnen samstag', 'miete 3 werktage'],
    inputs: [
      { id: 'startDate', label: 'Startdatum', type: 'date', defaultValue: '2026-02-01' },
      { id: 'endDate', label: 'Enddatum', type: 'date', defaultValue: '2026-02-28' },
      {
        id: 'workweek',
        label: 'Wochenarbeitszeit / Werktagsdefinition',
        type: 'select',
        defaultValue: 'mo-sa',
        options: [
          { value: 'mo-sa', label: 'Montag bis Samstag (Gesetzliche Werktage nach BGB / § 3 BUrlG)' },
          { value: 'mo-fr', label: 'Montag bis Freitag (Reguläre 5-Tage-Arbeitswoche)' },
          { value: 'custom', label: 'Benutzerdefiniert' },
        ],
      },
      {
        id: 'excludeHolidays',
        label: 'Gesetzliche Feiertage ausschließen',
        type: 'boolean',
        defaultValue: true,
        helpText: 'Zieht Feiertage ab (Feiertage an ohnehin freien Tagen werden nicht doppelt abgezogen)',
      },
      {
        id: 'federalState',
        label: 'Bundesland für Feiertage',
        type: 'select',
        defaultValue: 'bundesweit',
        options: FEDERAL_STATE_OPTIONS,
      },
      {
        id: 'includeBoundary',
        label: 'Zählung der Grenztage',
        type: 'select',
        defaultValue: 'both',
        options: BOUNDARY_OPTIONS,
      },
    ],
    calculate: calculateWorkdaysAndHolidays,
    formula: 'Werktage = Kalendertage – Sonntage – Feiertage (an Werktagen)',
    formulaExplanation: 'Nach ständiger Rechtsprechung und § 3 BUrlG gilt der Samstag gesetzlich als Werktag. Bei Umstellung auf Mo–Fr werden Samstage ebenfalls abgezogen.',
    workedExample: {
      title: 'Beispiel: Februar 2026 (28 Tage)',
      description: '24 Werktage (Mo–Sa) und 4 Sonntage.',
      inputs: { startDate: '2026-02-01', endDate: '2026-02-28', workweek: 'mo-sa', excludeHolidays: true },
      resultSummary: '24 Werktage',
    },
    content: {
      intro: 'Werktage sind alle Kalendertage, die nicht auf einen Sonntag oder gesetzlichen Feiertag fallen. Nach deutschem Recht (§ 3 Bundesurlaubsgesetz) zählt auch der Samstag regulär als Werktag.',
      details: 'Zur Bestimmung der Werktage werden von den Kalendertagen alle Sonntage sowie die im jeweiligen Bundesland geltenden gesetzlichen Feiertage subtrahiert. Bei reinen Fünftage-Bürowochen spricht man präziser von Arbeitstagen.',
    },
    faqs: [
      { question: 'Ist der Samstag rechtlich immer ein Werktag?', answer: 'Ja, nach dem BGB und dem BUrlG gilt der Samstag ausdrücklich als Werktag, es sei denn, ein Vertrag oder Tarifvertrag definiert abweichend reine Arbeitstage (Mo–Fr).' },
      { question: 'Zählen regionale Feiertage wie Fronleichnam oder Allerheiligen als Werktage?', answer: 'In den Bundesländern, in denen diese Tage gesetzliche Feiertage sind (z. B. Bayern, NRW, Baden-Württemberg), gelten sie arbeitsrechtlich nicht als Werktage.' },
      { question: 'Was passiert, wenn ein Feiertag auf einen Samstag fällt?', answer: 'Bei einer 5-Tage-Woche (Mo–Fr) mindert ein Samstagsfeiertag das Ergebnis nicht doppelt, da der Samstag ohnehin arbeitsfrei ist.' },
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
    shortDescription: 'Addiert eine beliebige Anzahl von Tagen zu einem Ausgangsdatum mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
      intro: 'Dieser Zukunftsrechner addiert eine beliebige Anzahl von Tagen zu einem Ausgangsdatum und ermittelt das exakte Zieldatum samt Wochentag.',
      details: 'Berücksichtigt präzise Monatsgrenzen (28, 29, 30 oder 31 Tage) und Schaltjahre. Ideal zur Bestimmung von Zahlungszielen (z. B. "zahlbar innerhalb von 14 Tagen") oder Lieferfristen.',
    },
    faqs: [
      { question: 'Wie berechnet man eine 14-tägige Frist nach BGB?', answer: 'Nach § 187 Abs. 1 BGB zählt der Tag des Zugangs nicht mit; die Frist beginnt am darauffolgenden Tag und endet mit Ablauf des 14. Tages.' },
      { question: 'Fällt das Ergebnis bei Addition von Vielfachen von 7 immer auf denselben Wochentag?', answer: 'Ja, jede Addition von 7, 14, 21, 28 etc. Tagen landet exakt auf demselben Wochentag wie das Startdatum.' },
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
    shortDescription: 'Subtrahiert Tage von einem Datum in die Vergangenheit mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
      intro: 'Dieser Rückrechner subtrahiert eine vorgegebene Anzahl von Kalendertagen von einem Stichtag zur Feststellung von Vorlauffristen oder Kündigungsterminen.',
      details: 'Die Subtraktion erfolgt taggenau rückwärts über Monats- und Jahresgrenzen hinweg. Unverzichtbar für Vorbereitungszeiten bei Veranstaltungen, Hochzeiten oder Bauprojekten.',
    },
    faqs: [
      { question: 'Wie ermittelt man den spätesten Absendetermin bei einer 4-wöchigen Kündigungsfrist?', answer: 'Subtrahieren Sie 28 Kalendertage vom Monatsende und rechnen Sie 2 bis 3 Tage Postlaufzeit als Puffer ein.' },
      { question: 'Was geschieht bei Subtraktion über einen Schalttag hinweg?', answer: 'Fällt der 29. Februar in das Rückwärts-Intervall, zieht der Rechner diesen Tag vollautomatisch als vollwertigen Tag ab.' },
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
    metaTitle: 'Schaltjahr Rechner – Ist ein Jahr ein Schaltjahr?',
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
      intro: 'Schaltjahre gleichen die Differenz zwischen dem bürgerlichen Kalenderjahr (365 Tage) und dem astronomischen Sonnenjahr (ca. 365,2422 Tage) durch das Einfügen eines 366. Tages aus.',
      details: 'Die gregorianische Schaltregel lautet: Ein Jahr ist ein Schaltjahr, wenn die Jahreszahl durch 4 teilbar ist – es sei denn, sie ist durch 100 teilbar. Ist sie jedoch auch durch 400 teilbar, handelt es sich dennoch um ein Schaltjahr (daher war 2000 ein Schaltjahr, 1900 keines).',
    },
    faqs: [
      { question: 'Warum reicht es nicht aus, einfach alle 4 Jahre einen Schalttag einzufügen?', answer: 'Ein Sonnenjahr dauert 365 Tage, 5 Stunden, 48 Minuten und 45 Sekunden. Ein Schalttag alle 4 Jahre würde den Kalender um etwa 11 Minuten pro Jahr überkompensieren; die 100- und 400-Jahre-Regeln korrigieren diesen Fehler.' },
      { question: 'Wann ist das nächste Jahrhundert-Schaltjahr?', answer: 'Das nächste glatte Jahrhundert, das ein Schaltjahr sein wird, ist das Jahr 2400. Die Jahre 2100, 2200 und 2300 werden reguläre Gemeinjahre sein.' },
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
      intro: 'Dieser Rechner führt Additionen und Subtraktionen von Kalenderwochen und Tagen zu einem vorgegebenen Ausgangsdatum durch.',
      details: 'Wichtig für Bauzeitenpläne, Schwangerschaftswochen (SSW) und Lieferfristen im Handel, bei denen Fristen üblicherweise in vollen Arbeits- oder Kalenderwochen formuliert sind.',
    },
    faqs: [
      { question: 'Wie addiert man 6 Wochen zu einem Datum im Kopf?', answer: '6 Wochen entsprechen genau 42 Kalendertagen. Addieren Sie einen vollen Monat (ca. 30 Tage) plus 12 weitere Tage.' },
      { question: 'Fällt das Ergebnis nach Addition ganzer Wochen immer auf denselben Wochentag?', answer: 'Ja, da eine Woche genau 7 Tage hat, fällt das Zieldatum bei der Addition voller Wochen ausnahmslos auf denselben Wochentag wie das Ausgangsdatum.' },
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
    metaTitle: 'Zeitdifferenz Rechner – Stunden – RechenHafen',
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
      intro: 'Die Ermittlung der Zeitdifferenz zwischen zwei Uhrzeiten ist unverzichtbar für Stundenzettel, Gleitzeitkonten, Schichtpläne und Reisezeiten.',
      details: 'Liegt die Endzeit numerisch vor der Anfangszeit, hat ein Tageswechsel stattgefunden: In diesem Fall werden zur Endzeit 24 Stunden hinzuaddiert, bevor die Startzeit abgezogen wird.',
    },
    faqs: [
      { question: 'Wie wird ein Schichtdienst über Mitternacht berechnet?', answer: 'Beginnt eine Schicht um 22:00 Uhr und endet um 06:00 Uhr morgens, rechnet man (06:00 + 24:00) - 22:00 = 30:00 - 22:00 = 8 Stunden Arbeitsdauer.' },
      { question: 'Wie wandelt man Minuten in Dezimalstunden für die Lohnabrechnung um?', answer: 'Teilen Sie die Minutenzahl durch 60: 15 Minuten entsprechen 0,25 Stunden, 30 Minuten 0,5 Stunden und 45 Minuten 0,75 Stunden.' },
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
    metaDescription: 'Rechnen Sie Arbeitszeiten und Stunden schnell zusammen. Wandeln Sie Minuten in Dezimalstunden um. Mit praxisnaher Formelerklärung und schnellem Ergebnis.',
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
      intro: 'Dieser Zeiterfassungsrechner addiert und subtrahiert Arbeitsstunden und Minuten über mehrere Tage für die Erstellung lückenloser Stundennachweise.',
      details: 'Summiert Bruttozeiten, zieht Pausenblöcke ab und weist das Endergebnis in Stunden und Minuten (hh:mm) sowie als Dezimalstunde (Industrieminute) aus.',
    },
    faqs: [
      { question: 'Wie rechnet man 7 Stunden und 45 Minuten in Dezimalstunden um?', answer: '7 + (45 / 60) = 7 + 0,75 = 7,75 Dezimalstunden.' },
      { question: 'Ist die Erfassung der Arbeitszeit in Deutschland gesetzlich verpflichtend?', answer: 'Ja, nach dem BAG-Urteil von 2022 (Az. 1 ABR 22/21) und dem EuGH-Urteil sind Arbeitgeber in Deutschland verpflichtet, ein verlässliches System zur Erfassung der täglichen Arbeitszeit einzurichten.' },
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
      intro: 'Dieser Countdown-Timer misst die verbleibende Restzeit bis zu einem festen Stichtag sekundengenau herunter.',
      details: 'Rechnet die Zeitdifferenz in Tage, Stunden, Minuten und Sekunden um. Nützlich für Produkt-Launches, Neujahr, Jubiläen oder Projekt-Deadlines.',
    },
    faqs: [
      { question: 'Wie viele Sekunden hat ein Tag?', answer: 'Ein regulärer Kalendertag hat exakt 24 × 60 × 60 = 86.400 Sekunden.' },
      { question: 'Was passiert mit dem Countdown bei Zeitumstellung?', answer: 'Bei Zeitstempeln mit lokaler Zeitzone verschiebt sich die Stundendifferenz am Tag der Zeitumstellung um genau 1 Stunde.' },
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
