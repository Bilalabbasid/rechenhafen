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
  calculateArbeitszeit,
  calculateAgeDifference,
  calculateBirthdayWeekday,
  calculateISOWeek,
  calculateTagerechner,
  calculateTageBisWeihnachten,
} from '@/lib/calculators/datumZeit';
import { formatNumber, formatDateDe } from '@/lib/formatters';
import { getBerlinTodayString, calculateTageBisGeburtstag } from '@/lib/calculators/dateMath';

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
    relatedSlugs: ['alter-in-tagen', 'geburtstagsrechner', 'tage-zwischen-zwei-daten', 'arbeitstage-rechner', 'altersunterschied', 'lebenszeit-in-stunden', 'alter-in-monaten'],
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
      { id: 'targetDate', label: 'Stichtag', type: 'date', defaultValue: getBerlinTodayString(), helpText: 'Referenzdatum (Zeitzone Europe/Berlin; standardmäßig heute)' },
    ],
    calculate: calculateAgeInDays,
    formula: 'Tage = Stichtag - Geburtsdatum (kalendertägliche Differenz)',
    formulaExplanation: 'Exakte kalendarische Zählung der Kalendertage zwischen Geburtsdatum und Stichtag unter Berücksichtigung aller Schaltjahre. Stunden und Minuten werden als rechnerische Tagesäquivalente (24 Stunden bzw. 1.440 Minuten je vollem Kalendertag) ausgewiesen.',
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
    relatedSlugs: ['tage-zwischen-zwei-daten', 'datum-plus-tage', 'dienstjubilaeum-rechner', 'altersrechner', 'geburtstagsrechner', 'altersunterschied'],
  },
  {
    id: 'lebenszeit-in-stunden',
    slug: 'lebenszeit-in-stunden',
    name: 'Lebenszeit-in-Stunden-Rechner',
    shortName: 'Lebenszeit in Stunden',
    category: 'datum-zeit',
    subcategory: 'Alter & Geburtstag',
    metaTitle: 'Lebenszeit in Stunden Rechner – Gelebte Lebenszeit',
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
    name: 'Alter-in-Monaten-Rechner (Vollendete & laufende Monate)',
    shortName: 'Alter in Monaten',
    category: 'datum-zeit',
    subcategory: 'Alter & Geburtstag',
    metaTitle: 'Alter in Monaten Rechner – Lebensmonate exakt berechnen',
    metaDescription: 'Wie viele Monate alt ist Ihr Kind oder ein Vertrag? Berechnen Sie vollendete Lebensmonate, Resttage und den laufenden Lebensmonat kalendergenau nach BGB.',
    h1: 'Alter in Monaten & Lebensmonate berechnen',
    shortDescription: 'Ermittelt die vollendeten Lebensmonate, verbleibende Resttage und den laufenden Lebensmonat zwischen Geburtsdatum und Stichtag kalendergenau.',
    searchKeywords: [
      'alter in monaten',
      'lebensmonate berechnen',
      'laufender lebensmonat rechner',
      'vollendete lebensmonate baby',
      'wie viele monate alt',
      'monate zwischen zwei daten berechnen',
    ],
    inputs: [
      { id: 'birthDate', label: 'Geburtsdatum', type: 'date', defaultValue: '2024-03-15' },
      { id: 'targetDate', label: 'Stichtag', type: 'date', defaultValue: '2026-03-15' },
    ],
    calculate: (inputs) => {
      const bStr = String(inputs.birthDate || '2024-03-15');
      const tStr = String(inputs.targetDate || '2026-03-15');

      const bParts = bStr.split('-').map(Number);
      const tParts = tStr.split('-').map(Number);

      if (bParts.length !== 3 || tParts.length !== 3 || bParts.some(isNaN) || tParts.some(isNaN)) {
        return {
          primary: { id: 'completedMonths', label: 'Vollendete Lebensmonate', value: 0, formattedValue: '-' },
          error: 'Bitte geben Sie ein gültiges Geburtsdatum und einen Stichtag ein.',
        };
      }

      const [bY, bM, bD] = bParts;
      const [tY, tM, tD] = tParts;

      const birthUtc = Date.UTC(bY, bM - 1, bD);
      const targetUtc = Date.UTC(tY, tM - 1, tD);

      if (targetUtc < birthUtc) {
        return {
          primary: { id: 'completedMonths', label: 'Vollendete Lebensmonate', value: 0, formattedValue: '-' },
          error: 'Das Geburtsdatum darf nicht nach dem Stichtag liegen.',
        };
      }

      // Kalendermonate schrittweise vorwärts zählen
      let completedMonths = 0;
      let curY = bY;
      let curM = bM - 1; // 0-indexed

      while (true) {
        let nextM = curM + 1;
        let nextY = curY;
        if (nextM > 11) {
          nextM = 0;
          nextY++;
        }

        // Monatsende-Regel nach § 188 Abs. 2/3 BGB (z. B. 31. Januar -> 28./29. Februar)
        const daysInNextM = new Date(nextY, nextM + 1, 0).getDate();
        const annD = Math.min(bD, daysInNextM);
        const annUtc = Date.UTC(nextY, nextM, annD);

        if (targetUtc >= annUtc) {
          completedMonths++;
          curY = nextY;
          curM = nextM;
        } else {
          break;
        }
      }

      const daysInCurM = new Date(curY, curM + 1, 0).getDate();
      const lastAnnD = Math.min(bD, daysInCurM);
      const lastAnnUtc = Date.UTC(curY, curM, lastAnnD);

      const restDays = Math.round((targetUtc - lastAnnUtc) / 86400000);
      const totalDays = Math.round((targetUtc - birthUtc) / 86400000);
      const runningMonth = completedMonths + 1;
      const totalWeeks = Math.floor(totalDays / 7);
      const restWeekDays = totalDays % 7;

      const formatD = (y: number, m: number, d: number) =>
        `${String(d).padStart(2, '0')}.${String(m).padStart(2, '0')}.${y}`;

      const bFormatted = formatD(bY, bM, bD);
      const tFormatted = formatD(tY, tM, tD);

      return {
        primary: {
          id: 'completedMonths',
          label: 'Vollendete Lebensmonate',
          value: completedMonths,
          formattedValue: `${completedMonths} Monate, ${restDays} Tage`,
          highlight: true,
        },
        secondary: [
          {
            id: 'runningMonth',
            label: 'Laufender Lebensmonat',
            value: runningMonth,
            formattedValue: `${runningMonth}. Lebensmonat`,
          },
          {
            id: 'restDays',
            label: 'Verbleibende Resttage',
            value: restDays,
            formattedValue: `${restDays} ${restDays === 1 ? 'Tag' : 'Tage'}`,
          },
          {
            id: 'totalWeeks',
            label: 'Alter in Wochen',
            value: totalWeeks,
            formattedValue: `${totalWeeks} Wochen, ${restWeekDays} Tage`,
          },
          {
            id: 'totalDays',
            label: 'Gesamte Lebenstage',
            value: totalDays,
            formattedValue: `${formatNumber(totalDays, 0)} Tage`,
          },
        ],
        summaryText: `Vom ${bFormatted} bis zum ${tFormatted} sind ${completedMonths} volle Lebensmonate und ${restDays} Tage vergangen. Die Person befindet sich im ${runningMonth}. Lebensmonat.`,
      };
    },
    formula: 'Vollendete Monate = Anzahl voller Monatssprünge (anniversary days); Laufender Lebensmonat = Vollendete Monate + 1',
    formulaExplanation: 'Ein Lebensmonat ist jeweils mit Erreichen des gleichen Monatstages im Folgemonat vollendet (z. B. Geburt 15. Januar -> 15. Februar = 1 vollendeter Monat). Existiert der Tag im Zielmonat nicht (z. B. 31. Januar auf Februar), endet der Lebensmonat am letzten Kalendertag dieses Monats (28. bzw. 29. Februar). Division durch 30 wird vermieden, da Kalendermonate unterschiedlich lang sind.',
    workedExample: {
      title: 'Beispiel: Geburt am 15. Januar, Stichtag 15. März',
      description: 'Genau 2 Kalendersprünge: 15. Feb (1. Monat vollendet), 15. März (2. Monat vollendet).',
      inputs: { birthDate: '2026-01-15', targetDate: '2026-03-15' },
      resultSummary: '2 vollendete Lebensmonate, 0 Tage (Beginn des 3. Lebensmonats)',
    },
    workedExamples: [
      {
        title: 'Beispiel 1: Stichtag genau am Monatstag (15. Jan bis 15. März)',
        description: 'Exakt 2 vollendete Monate, 0 Resttage; Beginn des 3. Lebensmonats.',
        inputs: { birthDate: '2026-01-15', targetDate: '2026-03-15' },
        resultSummary: '2 Monate, 0 Tage (3. Lebensmonat)',
      },
      {
        title: 'Beispiel 2: Stichtag vor dem Monatstag (15. Jan bis 14. März)',
        description: '1 vollendeter Monat und 27 Resttage; die Person ist noch im 2. Lebensmonat.',
        inputs: { birthDate: '2026-01-15', targetDate: '2026-03-14' },
        resultSummary: '1 Monat, 27 Tage (2. Lebensmonat)',
      },
      {
        title: 'Beispiel 3: Monatsende-Regel (31. Jan bis 28. Feb)',
        description: 'Da der Februar keinen 31. Tag hat, vollendet sich der Monat am 28. Februar (bzw. 29. Feb im Schaltjahr).',
        inputs: { birthDate: '2025-01-31', targetDate: '2025-02-28' },
        resultSummary: '1 Monat, 0 Tage (2. Lebensmonat)',
      },
    ],
    content: {
      intro: 'Dieser Rechner ermittelt das kalendarische Alter in vollendeten Monaten, Resttagen und dem aktuell laufenden Lebensmonat – unverzichtbar für Elternzeit, U-Untersuchungen, Beikost und Entwicklungsstufen.',
      sections: [
        {
          title: 'Vollendete Lebensmonate vs. laufender Lebensmonat: Der Unterschied',
          content: 'Im Alltag kommt es häufig zu Missverständnissen:\n\n- **Vollendete Lebensmonate:** Beschreibt das bereits abgeschlossene Alter. Ein Baby, das am 15. Januar geboren wurde, vollendet am 15. März seinen 2. Lebensmonat (Alter: genau 2 Monate).\n- **Laufender Lebensmonat:** Beschreibt den Zählmonat, in dem sich das Kind gerade befindet. Bereits ab dem Tag nach der Geburt (16. Januar) befindet sich das Neugeborene im 1. Lebensmonat. Ab dem 15. März beginnt somit der **3. Lebensmonat**.\n\nAusführliche Beispiele, Vergleichstabellen und rechtliche Hintergründe finden Sie in unserem Ratgeber [Lebensmonate berechnen: Vollendete Monate und laufender Lebensmonat](/ratgeber/lebensmonate-berechnen/).',
        },
        {
          title: 'Warum 4 Wochen kein Kalendermonat sind',
          content: 'Vier Wochen haben exakt 28 Tage (4 × 7 Tage). Ein durchschnittlicher Kalendermonat hat jedoch **30,44 Tage** (365 Tage ÷ 12 Monate). Ein Kind mit 12 Wochen ist somit noch nicht 3 Monate alt, sondern erst rund 2 Monate und 3 Wochen (84 Tage vs. ca. 91–92 Tage bei 3 Kalendermonaten). Berechnen Sie Lebensmonate deshalb nie durch Division der Tage durch 30 oder 28.',
        },
        {
          title: 'Monatsende-Konvention bei Geburt am 29., 30. oder 31.',
          content: 'Wurde eine Person an einem Tag geboren, der im Folgemonat nicht existiert (z. B. 31. Januar), greift die bürgerlich-rechtliche Monatsende-Regel (§ 188 Abs. 3 BGB analog): Der Lebensmonat vollendet sich mit Ablauf des letzten Kalendertages dieses Monats (also am 28. Februar, im Schaltjahr am 29. Februar).',
        },
      ],
      details: 'Dieser Rechner führt eine reine kalendarische Frist- und Datumsarithmetik durch. Er ersetzt keine individuelle medizinische Terminplanung (z. B. für kinderärztliche Früherkennungsuntersuchungen U1 bis U9) oder behördliche Fristbescheide bei Elterngeld und Elternzeit.',
    },
    faqs: [
      {
        question: 'Wann beginnt der 1. Lebensmonat und wann ist er vollendet?',
        answer: 'Der 1. Lebensmonat beginnt am Tag der Geburt. Er ist genau an dem Tag des Folgemonats vollendet, der dem Geburtstag entspricht (z. B. Geburt am 10. Mai -> 1. Lebensmonat vollendet am 10. Juni).',
      },
      {
        question: 'Warum rechnet dieser Rechner nicht einfach Tage ÷ 30?',
        answer: 'Weil Kalendermonate zwischen 28 und 31 Tagen schwanken. Eine pauschale 30-Tage-Division würde bei Geburtstagen im Februar, Juli oder August zu Verschiebungen von mehreren Tagen führen. Unser Rechner zählt echte Monatstage.',
      },
      {
        question: 'Ist ein 6 Monate altes Baby im 6. oder im 7. Lebensmonat?',
        answer: 'Hat das Baby seinen 6-Monats-Geburtstag erreicht, hat es 6 Monate vollendet und befindet sich ab diesem Tag im laufenden 7. Lebensmonat.',
      },
    ],
    relatedSlugs: ['altersrechner', 'alter-in-wochen', 'alter-in-tagen', 'geburtstermin-rechner'],
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
      intro: 'Der chronologische Altersabstand zweier Personen drückt die zeitliche Distanz zwischen ihren Geburtstagen in Jahren, Monaten und Tagen sowie als absolute Tagesdifferenz aus.',
      details: 'Bei der Differenzbildung wird der zeitliche Abstand zwischen beiden Geburtszeitpunkten ermittelt. In Partnerschaften, Erbfolgen oder im Sport (Altersklassen) bildet dieser Wert die objektive Vergleichsbasis.',
    },
    faqs: [
      { question: 'Verändert sich der Altersabstand in Tagen jemals?', answer: 'Nein, die Anzahl der Kalendertage zwischen zwei Geburtszeitpunkten bleibt das gesamte Leben über unveränderlich konstant.' },
      { question: 'Wie wird der relative Altersunterschied mit zunehmendem Alter wahrgenommen?', answer: 'Psychologisch und prozentual schrumpft der Abstand: Ein Unterschied von 5 Jahren macht bei 15-Jährigen 33 % der Lebensspanne aus, bei 50-Jährigen nur noch 10 %.' },
    ],
    relatedSlugs: ['altersrechner', 'tage-zwischen-zwei-daten', 'geburtstagsrechner', 'alter-in-tagen', 'arbeitstage-rechner'],
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
    relatedSlugs: ['altersrechner', 'alter-in-tagen', 'tage-zwischen-zwei-daten', 'tage-bis-geburtstag', 'arbeitstage-rechner'],
  },
  {
    id: 'tage-bis-geburtstag',
    slug: 'tage-bis-geburtstag',
    name: 'Geburtstagsrechner: Tage bis zum Geburtstag',
    shortName: 'Tage bis Geburtstag',
    category: 'datum-zeit',
    subcategory: 'Alter & Geburtstag',
    metaTitle: 'Tage bis Geburtstag: Countdown, Wochentag & Alter',
    metaDescription: 'Wie viele Tage noch bis zum Geburtstag? Kostenlos berechnen – mit Wochentag, neuem Alter, Wochentag Ihrer Geburt und nächstem runden Geburtstag.',
    h1: 'Tage bis zum Geburtstag berechnen – mit Wochentag und Alter',
    shortDescription: 'Zählt die Tage bis zu Ihrem nächsten Geburtstag und zeigt Wochentag, neues Alter, den Wochentag Ihrer Geburt und Ihren nächsten runden Geburtstag.',
    searchKeywords: [
      'tage bis zum geburtstag',
      'tage bis geburtstag',
      'geburtstag countdown',
      'wann habe ich wieder geburtstag',
      'geburtstagsrechner',
      'geburtstag rechner',
      'an welchem wochentag geboren',
      'wochentag geburtstag',
      'auf welchen wochentag fällt mein geburtstag',
      'wie alt werde ich',
      'runder geburtstag berechnen',
    ],
    inputs: [
      {
        id: 'birthDate',
        label: 'Ihr Geburtsdatum',
        type: 'date',
        defaultValue: '1996-10-24',
        helpText: 'Mit Geburtsjahr, damit Alter und Wochentag der Geburt stimmen.',
      },
    ],
    calculate: calculateTageBisGeburtstag,
    formula: 'Tage = nächster Geburtstag − heute | Neues Alter = Jahr des nächsten Geburtstags − Geburtsjahr',
    formulaExplanation: 'Liegt der Geburtstag in diesem Jahr schon hinter Ihnen, zählt der Rechner bis zum Geburtstag im nächsten Jahr. Die Wochentage ergeben sich aus dem gregorianischen Kalender. Wer am 29. Februar geboren ist, bekommt in Nicht-Schaltjahren den 28. Februar angezeigt und zusätzlich den 1. März, ab dem das neue Alter rechtlich gilt.',
    workedExample: {
      title: 'Beispiel 1: Geburtstag am 24.10.1996 (Stand 05.11.2026)',
      description: 'Der Geburtstag 2026 ist vorbei, also zählt der Rechner bis zum 24.10.2027. Das sind 353 Tage oder 50 Wochen und 3 Tage. Der Tag ist ein Sonntag, Sie werden 31. Geboren wurden Sie an einem Donnerstag. Der nächste runde Geburtstag ist der 40. am Freitag, 24.10.2036.',
      inputs: { birthDate: '1996-10-24' },
      resultSummary: '353 Tage bis Sonntag, 24.10.2027 (31. Geburtstag)',
    },
    workedExamples: [
      {
        title: 'Beispiel 1: Geburtstag am 24.10.1996 (Stand 05.11.2026)',
        description: 'Der Geburtstag 2026 ist vorbei, also zählt der Rechner bis zum 24.10.2027. Das sind 353 Tage oder 50 Wochen und 3 Tage. Der Tag ist ein Sonntag, Sie werden 31. Geboren wurden Sie an einem Donnerstag. Der nächste runde Geburtstag ist der 40. am Freitag, 24.10.2036.',
        inputs: { birthDate: '1996-10-24' },
        resultSummary: '353 Tage bis Sonntag, 24.10.2027 (31. Geburtstag)',
      },
      {
        title: 'Beispiel 2: Geboren am 29.02.2000 (Stand 05.11.2026)',
        description: '2027 ist kein Schaltjahr. Der Rechner zeigt deshalb Sonntag, den 28.02.2027: noch 115 Tage oder 16 Wochen und 3 Tage bis zum 27. Geburtstag. Rechtlich gilt das neue Alter ab Montag, 01.03.2027. Geboren wurden Sie an einem Dienstag.',
        inputs: { birthDate: '2000-02-29' },
        resultSummary: '115 Tage bis 28.02.2027 (rechtlich neues Alter ab 01.03.2027)',
      },
      {
        title: 'Beispiel 3: Heute ist Geburtstag (05.11.1986, Stand 05.11.2026)',
        description: 'Fällt der Geburtstag auf heute, zeigt der Rechner „Heute ist Ihr Geburtstag!“. Sie werden 40, das ist zugleich Ihr runder Geburtstag. Der 05.11.1986 war ein Mittwoch.',
        inputs: { birthDate: '1986-11-05' },
        resultSummary: 'Heute ist Ihr Geburtstag – 40 Jahre',
      },
    ],
    content: {
      intro: 'Dieser Rechner zählt die Tage bis zu Ihrem nächsten Geburtstag. Er zeigt außerdem, auf welchen Wochentag der Tag fällt, wie alt Sie werden, an welchem Wochentag Sie geboren sind und wann Ihr nächster runder Geburtstag ansteht. Sie geben dafür nur Ihr Geburtsdatum ein.',
      sections: [
        {
          title: 'So zählt der Geburtstags-Countdown',
          content: 'Gezählt wird von heute (deutsche Zeit) bis zum nächsten Geburtstag. Ist er in diesem Jahr schon vorbei, nimmt der Rechner den Geburtstag im nächsten Jahr. Am Geburtstag selbst erscheint „Heute ist Ihr Geburtstag!“.\n- **Tage und Wochen**: z. B. 353 Tage = 50 Wochen und 3 Tage.\n- **Wochentag des Geburtstags**: Der 24.10.2027 ist ein Sonntag.\n- **Neues Alter**: Geburtsjahr 1996, Geburtstag 2027 → 31 Jahre.\n- **Runder Geburtstag**: der nächste 10er-Geburtstag mit Datum, Wochentag und Tagen bis dahin.',
        },
        {
          title: 'Wochentag der Geburt und Wochentag des Geburtstags',
          content: 'Ein normales Jahr hat 365 Tage, das sind 52 Wochen und 1 Tag. Deshalb rückt Ihr Geburtstag jedes Jahr um einen Wochentag weiter, nach einem 29. Februar um zwei. Fällt der 14.08. im Jahr 2026 auf einen Freitag, ist er 2027 ein Samstag. Den Wochentag Ihrer Geburt zeigt der Rechner ebenfalls: Der 14.08.1992 war ein Freitag, der 24.10.1996 ein Donnerstag.',
        },
        {
          title: 'Geburtstag am 29. Februar',
          content: 'In Schaltjahren wie 2028 fällt der Geburtstag auf den 29.02. In den übrigen Jahren zeigt der Rechner den 28.02. Rechtlich vollendet sich das Lebensjahr mit Ablauf des 28. Februar (§ 187 Abs. 2, § 188 Abs. 2 BGB). Das neue Alter gilt also ab dem 1. März, auch dieses Datum steht im Ergebnis.\n\nIhr genaues Alter in Jahren, Monaten und Tagen berechnet der [Altersrechner](/rechner/altersrechner/), die Tage seit Ihrer Geburt der Rechner [Alter in Tagen](/rechner/alter-in-tagen/). Einen Countdown zu jedem anderen Datum bietet der [Tagerechner](/rechner/tage-zwischen-zwei-daten/).',
        },
      ],
    },
    faqs: [
      {
        question: 'Wie viele Tage sind es noch bis zu meinem Geburtstag?',
        answer: 'Geben Sie Ihr Geburtsdatum ein, der Rechner zählt ab heute bis zum nächsten Geburtstag. Ist er in diesem Jahr schon vorbei, zählt er bis zum Geburtstag im nächsten Jahr. Wer am 24.10. Geburtstag hat, wartet am 05.11.2026 noch 353 Tage.',
      },
      {
        question: 'An welchem Wochentag wurde ich geboren?',
        answer: 'Der Rechner zeigt den Wochentag Ihrer Geburt direkt im Ergebnis. Der 14.08.1992 war zum Beispiel ein Freitag, der 29.02.2000 ein Dienstag. Grundlage ist der gregorianische Kalender.',
      },
      {
        question: 'Auf welchen Wochentag fällt mein Geburtstag nächstes Jahr?',
        answer: 'In der Regel auf den folgenden Wochentag, weil 365 Tage 52 Wochen und 1 Tag sind. Liegt ein 29. Februar dazwischen, springt der Geburtstag um zwei Wochentage. Der Rechner zeigt den Wochentag Ihres nächsten Geburtstags automatisch an.',
      },
      {
        question: 'Wie alt werde ich an meinem nächsten Geburtstag?',
        answer: 'Ziehen Sie das Geburtsjahr vom Jahr des nächsten Geburtstags ab. Wer 1996 geboren ist und am 24.10.2027 Geburtstag hat, wird 31. Der Rechner nennt außerdem Datum und Wochentag Ihres nächsten runden Geburtstags.',
      },
      {
        question: 'Wann haben am 29. Februar Geborene in Nicht-Schaltjahren Geburtstag?',
        answer: 'Der Rechner zeigt in Nicht-Schaltjahren den 28. Februar, an dem viele feiern. Rechtlich vollendet sich das Lebensjahr mit Ablauf des 28. Februar, das neue Alter gilt ab dem 1. März. Beide Daten stehen im Ergebnis.',
      },
    ],
    relatedSlugs: ['altersrechner', 'alter-in-tagen', 'tage-zwischen-zwei-daten', 'altersunterschied', 'tage-bis-weihnachten', 'schaltjahr-rechner'],
  },  {
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
    relatedSlugs: ['tage-zwischen-zwei-daten', 'monate-zwischen-daten', 'tage-zwischen-zwei-daten'],
  },
  {
    id: 'monate-zwischen-daten',
    slug: 'monate-zwischen-daten',
    name: 'Monate-zwischen-zwei-Daten-Rechner',
    shortName: 'Monate zwischen Daten',
    category: 'datum-zeit',
    subcategory: 'Datumsdifferenz',
    metaTitle: 'Monate zwischen Daten Rechner – Kalendermonate ermitteln',
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
      intro: 'Die genaue Monatsdistanz zwischen zwei Kalenderdaten ist entscheidend für Kündigungsfristen von Mietverträgen, Kreditzinsbindungen und Beschäftigungszeiten.',
      details: 'Die Berechnung ermittelt volle abgelaufene Monate unter Würdigung der Monatsenden (§ 188 BGB) und weist verbleibende Resttage separat aus.',
    },
    faqs: [
      { question: 'Wie wirkt sich ein Monatsende auf die Berechnung aus (z. B. 28. Februar bis 31. März)?', answer: 'Geht ein Zeitraum vom letzten Tag eines kurzen Monats bis zum letzten Tag eines längeren Monats, gilt der Monat rechtlich als vollendet.' },
      { question: 'Wie viele Monate Kündigungsfrist hat ein Wohnungsmietvertrag?', answer: 'Für Mieter beträgt die Frist gesetzlich stets 3 Monate (§ 573c BGB). Für Vermieter verlängert sie sich nach 5 und 8 Jahren Mietdauer auf 6 bzw. 9 Monate.' },
    ],
    relatedSlugs: ['wochen-zwischen-daten', 'tage-zwischen-zwei-daten', 'tage-zwischen-zwei-daten'],
  },  {
    id: 'arbeitszeitrechner',
    slug: 'arbeitszeitrechner',
    name: 'Arbeitszeitrechner (Stempeluhr & Pausen)',
    shortName: 'Arbeitszeit erfassen',
    category: 'datum-zeit',
    subcategory: 'Arbeitstage & Werktage',
    metaTitle: 'Arbeitszeitrechner – Arbeitszeit, Pausen & Überstunden',
    metaDescription: 'Berechnen Sie Ihre tägliche Arbeitszeit: Beginn, Ende und flexible Pausen eingeben und sofort Netto-Arbeitszeit, Industriestunden und Überstunden ermitteln.',
    h1: 'Arbeitszeitrechner – Tägliche Arbeitszeit, Pausen & Überstunden berechnen',
    shortDescription: 'Berechnet die tägliche Netto-Arbeitszeit nach Abzug der gesetzlichen Pausen mit Überstunden- und Nachtschichtberechnung.',
    searchKeywords: ['arbeitszeitrechner', 'zeiterfassung rechner', 'arbeitszeit berechnen pause', 'stempeluhr rechner', 'arbeitszeit nachtschicht berechnen'],
    inputs: [
      { id: 'startTime', label: 'Arbeitsbeginn (Kommen)', type: 'select', defaultValue: '08:00', options: generateTimeOptions() },
      { id: 'endTime', label: 'Arbeitsende (Gehen)', type: 'select', defaultValue: '16:30', options: generateTimeOptions() },
      { id: 'pauseMinutes', label: 'Pausendauer in Minuten', type: 'number', defaultValue: 30, min: 0, max: 360, step: 5, unit: 'Min.' },
      { id: 'targetHours', label: 'Tägliche Sollarbeitszeit', type: 'number', defaultValue: 8, min: 0, max: 24, step: 0.25, unit: 'Std.', helpText: 'Vertragliche Arbeitszeit zur Ermittlung von Über- oder Minusstunden (z. B. 8,0)' },
    ],
    calculate: calculateArbeitszeit,
    formula: 'Nettoarbeitszeit = (Gehen - Kommen) - Pausen | Über-/Minusstunden = Nettoarbeitszeit - Sollarbeitszeit',
    formulaExplanation: 'Berechnung der Brutto- und Nettoarbeitszeit nach Abzug der Ruhepausen gemäß § 4 ArbZG sowie Abgleich mit der vertraglichen Sollarbeitszeit. Nachtschichten über Mitternacht werden automatisch tagesübergreifend berechnet.',
    workedExample: {
      title: 'Beispiel 1: Tagesschicht (08:00–16:30 Uhr mit 60 Min. Pause)',
      description: 'Bei Arbeitsbeginn um 08:00 Uhr und Arbeitsende um 16:30 Uhr beträgt die Bruttoarbeitszeit 8 Std. 30 Min. Nach Abzug von 60 Minuten Pause verbleiben 7 Std. 30 Min. Nettoarbeitszeit (7,50 Industriestunden). Bei einer Sollarbeitszeit von 8,00 Stunden ergibt sich ein Saldo von -0,50 Minusstunden.',
      inputs: { startTime: '08:00', endTime: '16:30', pauseMinutes: 60, targetHours: 8 },
      resultSummary: '7 Std. 30 Min. Netto (7,50 Std. | -0,50 Minusstunden)',
    },
    workedExamples: [
      {
        title: 'Beispiel 1: Tagesschicht (08:00–16:30 Uhr mit 60 Min. Pause)',
        description: 'Bei Arbeitsbeginn um 08:00 Uhr und Arbeitsende um 16:30 Uhr beträgt die Bruttoarbeitszeit 8 Std. 30 Min. Nach Abzug von 60 Minuten Pause verbleiben 7 Std. 30 Min. Nettoarbeitszeit (7,50 Industriestunden). Bei einer Sollarbeitszeit von 8,00 Stunden ergibt sich ein Saldo von -0,50 Minusstunden.',
        inputs: { startTime: '08:00', endTime: '16:30', pauseMinutes: 60, targetHours: 8 },
        resultSummary: '7 Std. 30 Min. Netto (7,50 Std. | -0,50 Minusstunden)',
      },
      {
        title: 'Beispiel 2: Nachtschicht über Mitternacht (22:00–06:30 Uhr mit 30 Min. Pause)',
        description: 'Bei Schichtbeginn um 22:00 Uhr und Schichtende am Folgetag um 06:30 Uhr beträgt die Bruttoanwesenheit 8 Std. 30 Min. Nach Abzug von 30 Minuten Ruhepause verbleiben genau 8 Std. 0 Min. Nettoarbeitszeit (8,00 Industriestunden). Das Zeitsaldo zur 8-Stunden-Sollzeit ist mit 0,00 Stunden ausgeglichen.',
        inputs: { startTime: '22:00', endTime: '06:30', pauseMinutes: 30, targetHours: 8 },
        resultSummary: '8 Std. 0 Min. Netto (8,00 Std. | Ausgeglichen)',
      },
    ],
    content: {
      intro: 'Mit unserem kostenlosen Arbeitszeitrechner erfassen Sie Arbeitsbeginn, Arbeitsende und Pausenzeiten für jeden Arbeitstag präzise auf die Minute. Der Rechner ermittelt automatisch Ihre Brutto- und Nettoarbeitszeit in Stunden und Industriestunden, berücksichtigt Nachtschichten über Mitternacht und vergleicht das Ergebnis mit Ihrer vereinbarten Sollarbeitszeit.',
      sections: [
        {
          title: 'So funktioniert der Arbeitszeitrechner',
          content: 'Tragen Sie unter „Arbeitsbeginn“ und „Arbeitsende“ Ihre Kommen- und Gehen-Zeiten ein. Über die dynamische Pausenfunktion können Sie bis zu vier getrennte Pausenabschnitte hinterlegen (z. B. Frühstückspause, Mittagspause und Nachmittagsunterbrechung).\n\nDer Rechner zeigt Ihnen unmittelbar alle relevanten Kennzahlen aufgeschlüsselt an:\n- **Bruttoarbeitszeit**: Die gesamte zeitliche Anwesenheit im Betrieb.\n- **Gesamte Pausenzeit**: Summe aller genommenen Ruhepausen.\n- **Nettoarbeitszeit**: Die tatsächlich vergütungspflichtige Arbeitszeit, formatiert in Stunden und Minuten sowie als dezimale Industriestunden (z. B. 7,50 Std. für 7 Std. 30 Min.).\n- **Überstunden / Minusstunden**: Differenz zwischen geleisteter Nettozeit und Ihrer täglichen Sollarbeitszeit.\n\nZur weiteren Gehaltsberechnung können Sie die ermittelten Industriestunden direkt in unserem [Stundenlohnrechner](/rechner/stundenlohnrechner/) oder im [Teilzeitrechner](/rechner/teilzeit-gehaltsrechner/) verwenden. Für die Monats- und Jahresplanung hilft Ihnen unser [Arbeitstage-Rechner](/rechner/arbeitstage-rechner/).',
        },
        {
          title: 'Arbeitszeit über Mitternacht berechnen',
          content: 'Wenn Sie im Schichtdienst arbeiten und Ihre Schicht über die Tagesgrenze hinweg verläuft (z. B. Beginn um 22:00 Uhr abends und Ende um 06:30 Uhr morgens), erkennt das Tool dies automatisch: Liegt die Endzeit vor oder auf der Startzeit, wird die Endzeit als Folgetag (+1 Tag) gewertet.\n\nEin gesonderter Hinweis („Nachtschicht: Schichtende am Folgetag“) signalisiert Ihnen, dass die Nachtstunden über Mitternacht hinweg lückenlos mit 24-Stunden-Tagesumsprung addiert wurden.',
        },
        {
          title: 'Pausenregelung in Deutschland nach § 4 ArbZG',
          content: 'Das deutsche Arbeitszeitgesetz (ArbZG) schreibt zum Gesundheitsschutz der Beschäftigten verbindliche Mindestpausen vor:\n- **Mehr als 6 bis 9 Stunden Arbeitszeit**: Mindestens 30 Minuten Ruhepause sind gesetzlich vorgeschrieben.\n- **Mehr als 9 Stunden Arbeitszeit**: Mindestens 45 Minuten Ruhepause müssen gewährt werden.\n- **Mindestdauer pro Pause**: Ruhepausen können in Zeitblöcke aufgeteilt werden, allerdings muss jeder Block mindestens 15 Minuten umfassen. Kürzere Bildschirmpausen oder Toilettengänge gelten nicht als gesetzliche Ruhepause.\n- **Höchstarbeitszeit (§ 3 ArbZG)**: Die werktägliche Arbeitszeit darf 8 Stunden grundsätzlich nicht überschreiten; sie kann auf bis zu 10 Stunden verlängert werden, wenn innerhalb von 6 Kalendermonaten im Schnitt 8 Stunden werktäglich nicht überschritten werden.\n\n*Wichtiger Hinweis zur Orientierung, keine Rechtsberatung*: Tarifverträge, Betriebsvereinbarungen oder kirchliche Arbeitsrechtsregelungen können günstigere Pausen- oder Gleitzeitregeln vorsehen.',
        },
      ],
      details: 'Gesetzliche Grundlage: § 3 und § 4 Arbeitszeitgesetz (ArbZG). Für Jugendliche unter 18 Jahren gelten die strengeren Schutzvorschriften des Jugendarbeitsschutzgesetzes (JArbSchG: 30 Min. bei 4,5 bis 6 Std., 60 Min. bei mehr als 6 Std. Arbeitszeit).',
    },
    faqs: [
      { question: 'Wie viele Pausenminuten sind gesetzlich nach § 4 ArbZG vorgeschrieben?', answer: 'Bei einer Arbeitszeit von mehr als 6 bis zu 9 Stunden müssen mindestens 30 Minuten Pause genommen werden. Bei einer Arbeitszeit von mehr als 9 Stunden erhöht sich die Mindestpause auf 45 Minuten. Kürzere Unterbrechungen unter 15 Minuten zählen arbeitsrechtlich nicht als Ruhepause.' },
      { question: 'Werden Nachtschichten über Mitternacht (z. B. 22:00 bis 06:30 Uhr) korrekt berechnet?', answer: 'Ja. Wenn die Endzeit vor oder auf der Startzeit liegt (z. B. 22:00 bis 06:30 Uhr), rechnet das Tool automatisch über die Mitternachtsgrenze hinweg. Bei 8,5 Stunden Anwesenheit und 30 Minuten Pause verbleiben genau 8,0 Stunden Netto-Arbeitszeit.' },
      { question: 'Wie funktioniert die Überstunden- und Minusstundenberechnung?', answer: 'Geben Sie im Feld „Tägliche Sollarbeitszeit“ Ihre vereinbarten Sollstunden ein (z. B. 8,00 Stunden bei einer 40-Stunden-Woche). Der Rechner vergleicht die geleistete Nettoarbeitszeit mit Ihrem Sollwert und weist Überstunden mit Pluszeichen sowie Minusstunden mit Minuszeichen präzise aus.' },
      { question: 'Was sind Industriestunden und wie rechnet man sie um?', answer: 'Industriestunden teilen eine Stunde in 100 Dezimalminuten statt in 60 Zeitminuten auf. 15 Minuten entsprechen 0,25 Industriestunden, 30 Minuten 0,50 und 45 Minuten 0,75 Industriestunden. Multiplizieren Sie einfach die Zeitminuten mit dem Faktor 1/60.' },
      { question: 'Darf die gesetzliche Ruhepause auf mehrere Pausen aufgeteilt werden?', answer: 'Ja, nach § 4 ArbZG darf die Gesamte Ruhepause in Teilpausen von jeweils mindestens 15 Minuten aufgeteilt werden (z. B. 2 × 15 Minuten bei einer 8-Stunden-Schicht).' },
    ],
    relatedSlugs: ['stundenlohnrechner', 'arbeitstage-rechner', 'teilzeit-gehaltsrechner', 'stundensatz-kalkulation-freiberufler-rechner'],
    trustMeta: {
      legalBasis: '§ 3 & § 4 Arbeitszeitgesetz (ArbZG)',
      sourceName: 'Bundesministerium für Arbeit und Soziales (BMAS)',
      sourceUrl: 'https://www.gesetze-im-internet.de/arbzg/',
      lastReviewed: '2026-02-01',
    },
  },
  {
    id: 'tage-zwischen-zwei-daten',
    slug: 'tage-zwischen-zwei-daten',
    name: 'Tagerechner: Tage zwischen zwei Daten berechnen',
    shortName: 'Tagerechner',
    category: 'datum-zeit',
    subcategory: 'Datumsdifferenz',
    metaTitle: 'Tagerechner: Tage, Wochen & Monate zwischen zwei Daten',
    metaDescription: 'Kostenloser Tagerechner: Tage, Wochen und Monate zwischen zwei Daten zählen – auch bis oder seit heute, mit Countdown in Stunden und Minuten.',
    h1: 'Tagerechner: Tage zwischen zwei Daten berechnen',
    shortDescription: 'Zählt die Kalendertage zwischen zwei Daten und zeigt das Ergebnis zusätzlich in Wochen, Monaten und Jahren. Mit Countdown bis zu einem Termin und Zählung seit einem Stichtag.',
    searchKeywords: [
      'tagerechner',
      'tage zwischen zwei daten',
      'tage zwischen zwei daten berechnen',
      'wochen zwischen zwei daten',
      'wie viele wochen zwischen zwei daten',
      'monate zwischen zwei daten',
      'monate zwischen zwei daten berechnen',
      'anzahl monate berechnen',
      'monatsdifferenz rechner',
      'countdown rechner',
      'countdown bis datum',
      'tage bis datum',
      'tage seit datum',
      'wieviele tage bis',
      'tage bis urlaub',
      'tage bis silvester',
      'tage zählen',
      'kalendertage rechner',
      'zeitspanne berechnen',
    ],
    inputs: [
      {
        id: 'mode',
        label: 'Berechnungsmodus',
        type: 'select',
        defaultValue: 'between',
        options: [
          { value: 'between', label: 'Tage zwischen zwei Daten' },
          { value: 'until', label: 'Tage bis zu einem Datum (Countdown)' },
          { value: 'since', label: 'Tage seit einem Datum (Vergangene Zeit)' },
        ],
      },
      { id: 'startDate', label: 'Startdatum', type: 'date', defaultValue: '1960-03-01' },
      { id: 'endDate', label: 'Enddatum', type: 'date', defaultValue: '2026-12-31' },
      {
        id: 'targetTime',
        label: 'Uhrzeit am Zieltag (für den Countdown)',
        type: 'select',
        defaultValue: '00:00',
        options: generateTimeOptions(),
        helpText: 'Für die Restzeit in Stunden und Minuten ab jetzt (deutsche Zeit).',
        dependsOn: { field: 'mode', value: 'until' },
      },
      {
        id: 'includeStartDay',
        label: 'Starttag mitzählen (+1 Tag)',
        type: 'boolean',
        defaultValue: false,
        helpText: 'Aktivieren, wenn Start- und Endtag beide voll zählen sollen (z. B. Urlaub von Montag bis Freitag = 5 Tage).',
      },
    ],
    calculate: calculateTagerechner,
    formula: 'Tage = Enddatum − Startdatum (+1 bei Starttag-Zählung) | Wochen = Tage ÷ 7 | Monate = volle Kalendermonate ab dem Startdatum + Resttage',
    formulaExplanation: 'Der Rechner wandelt beide Daten in fortlaufende Tagesnummern um und bildet die Differenz. Monatslängen von 28 bis 31 Tagen und alle Schalttage sind damit automatisch richtig. Monate zählt er ab dem Startdatum; fehlt der Starttag im Zielmonat (z. B. der 31.), gilt der letzte Tag dieses Monats.',
    workedExample: {
      title: 'Beispiel 1: Historischer Zeitraum (01.03.1960 bis heute)',
      description: 'Modus „Tage seit einem Datum“: Vom 01.03.1960 bis zum 05.11.2026 sind es 24.355 Tage. Das sind 3.479 Wochen und 2 Tage oder 66 Jahre, 8 Monate und 4 Tage. Der Wert steigt jeden Tag um 1.',
      inputs: { mode: 'since', startDate: '1960-03-01', includeStartDay: false },
      resultSummary: '24.355 Tage (Stand 05.11.2026)',
    },
    workedExamples: [
      {
        title: 'Beispiel 1: Historischer Zeitraum (01.03.1960 bis heute)',
        description: 'Modus „Tage seit einem Datum“: Vom 01.03.1960 bis zum 05.11.2026 sind es 24.355 Tage. Das sind 3.479 Wochen und 2 Tage oder 66 Jahre, 8 Monate und 4 Tage. Der Wert steigt jeden Tag um 1.',
        inputs: { mode: 'since', startDate: '1960-03-01', includeStartDay: false },
        resultSummary: '24.355 Tage (Stand 05.11.2026)',
      },
      {
        title: 'Beispiel 2: Countdown (heute bis zum 05.10.2050)',
        description: 'Modus „Tage bis zu einem Datum“: Am 05.11.2026 liegen bis zum 05.10.2050 noch 8.735 Tage. Das sind 1.247 Wochen und 6 Tage oder 23 Jahre und 11 Monate. Mit Uhrzeit zeigt der Rechner zusätzlich die Restzeit in Stunden und Minuten ab jetzt.',
        inputs: { mode: 'until', endDate: '2050-10-05', targetTime: '00:00', includeStartDay: false },
        resultSummary: '8.735 Tage (Stand 05.11.2026)',
      },
      {
        title: 'Beispiel 3: Wochen und Monate (01.01.2026 bis 30.06.2026)',
        description: 'Zwischen dem 01.01.2026 und dem 30.06.2026 liegen 180 Tage. 180 ÷ 7 ergibt 25 Wochen und 5 Tage. Kalendarisch sind es 5 Monate (bis 01.06.2026) und 29 Tage.',
        inputs: { mode: 'between', startDate: '2026-01-01', endDate: '2026-06-30', includeStartDay: false },
        resultSummary: '180 Tage = 25 Wochen und 5 Tage = 5 Monate und 29 Tage',
      },
      {
        title: 'Beispiel 4: Monatsende (31.01.2026 bis 01.03.2026)',
        description: 'Der Februar 2026 hat nur 28 Tage. Ein Monat ab dem 31.01.2026 endet deshalb am 28.02.2026. Bis zum 01.03.2026 sind es 29 Tage, also 1 Monat und 1 Tag.',
        inputs: { mode: 'between', startDate: '2026-01-31', endDate: '2026-03-01', includeStartDay: false },
        resultSummary: '29 Tage = 1 Monat und 1 Tag',
      },
      {
        title: 'Beispiel 5: Gleicher Tag (Same-Day mit und ohne Starttag)',
        description: 'Liegen Start- und Enddatum auf demselben Tag (15.05.2026 bis 15.05.2026), beträgt die Differenz 0 Tage. Mit „Starttag mitzählen“ zählt der Tag selbst, das Ergebnis ist 1 Tag.',
        inputs: { mode: 'between', startDate: '2026-05-15', endDate: '2026-05-15', includeStartDay: false },
        resultSummary: '0 Tage (ohne Starttag) bzw. 1 Tag (mit Starttag)',
      },
      {
        title: 'Beispiel 6: Schaltjahr (28.02.2024 bis 01.03.2024)',
        description: '2024 ist ein Schaltjahr, der 29. Februar liegt dazwischen. Die Differenz beträgt 2 Tage, mit Starttag 3 Tage. Im Jahr 2026 wären es nur 1 bzw. 2 Tage.',
        inputs: { mode: 'between', startDate: '2024-02-28', endDate: '2024-03-01', includeStartDay: false },
        resultSummary: '2 Tage (bzw. 3 Tage mit Starttag)',
      },
    ],
    content: {
      intro: 'Der Tagerechner zählt die Kalendertage zwischen zwei Daten und rechnet sie sofort in Wochen, Monate und Jahre um. Wählen Sie oben, ob Sie eine freie Zeitspanne berechnen, die Tage bis zu einem Termin herunterzählen oder die Tage seit einem Stichtag ermitteln möchten. Schaltjahre und unterschiedliche Monatslängen sind immer eingerechnet.',
      sections: [
        {
          title: 'Tage, Wochen und Monate zwischen zwei Daten',
          content: 'Das Ergebnis erscheint in mehreren Einheiten:\n- **Kalendertage**: die reine Differenz, z. B. 180 Tage vom 01.01.2026 bis 30.06.2026.\n- **Wochen und Tage**: 180 ÷ 7 = 25 Wochen und 5 Tage.\n- **Monate und Tage**: volle Kalendermonate ab dem Startdatum plus Resttage, hier 5 Monate und 29 Tage.\n- **Jahre, Monate und Tage**: für lange Zeiträume, etwa 90 Jahre, 7 Monate und 4 Tage vom 01.03.1960 bis 05.10.2050.\n- **Stunden und Minuten**: 24 Stunden je Kalendertag, z. B. 4.320 Stunden für 180 Tage.\n\nWochen ergeben sich direkt aus der Tageszahl. Monate zählt der Rechner kalendergenau: Ein Monat ist voll, sobald derselbe Tag im Folgemonat erreicht ist.',
        },
        {
          title: 'Countdown: Wie viele Tage noch bis zu einem Datum?',
          content: 'Im Modus **Tage bis zu einem Datum** beginnt die Zählung automatisch heute (deutsche Zeit). Sie geben nur das Zieldatum ein, etwa den ersten Urlaubstag oder eine Abgabefrist. Mit der optionalen Uhrzeit sehen Sie zusätzlich die Restzeit ab jetzt in Tagen, Stunden und Minuten. Die Umstellung zwischen Sommer- und Winterzeit ist dabei eingerechnet.\n\nÜber die Schnellwahl springen Sie direkt zu Heiligabend, Silvester, Neujahr oder Ostern. Im Modus **Tage seit einem Datum** zählt der Rechner umgekehrt bis heute, z. B. seit der Hochzeit oder dem Arbeitsbeginn. Für Weihnachten gibt es den Rechner [Tage bis Weihnachten](/rechner/tage-bis-weihnachten/), für Ihren nächsten Geburtstag den Rechner [Tage bis Geburtstag](/rechner/tage-bis-geburtstag/).',
        },
        {
          title: 'Monate zählen: Was gilt am Monatsende?',
          content: 'Nicht jeder Monat hat einen 30. oder 31. Tag. Fehlt der Starttag im Zielmonat, nimmt der Rechner den letzten Tag dieses Monats:\n- 15.01.2026 bis 15.10.2026 = genau 9 Monate (273 Tage).\n- 31.01.2026 bis 28.02.2026 = 1 Monat, weil der Februar 2026 am 28. endet.\n- 31.01.2026 bis 01.03.2026 = 1 Monat und 1 Tag (29 Tage).\n\nDamit gilt immer: Startdatum plus die angezeigten Monate plus die Resttage ergibt genau das Enddatum. Verträge können für Kündigungs- oder Mietfristen eine eigene Zählweise festlegen.',
        },
        {
          title: 'Starttag mitzählen oder nicht?',
          content: 'Standardmäßig zeigt der Rechner die Differenz: Vom 15.05. bis zum 15.05. sind es 0 Tage. Das entspricht der Fristberechnung nach **§ 187 Abs. 1 BGB**, bei der der Tag des Ereignisses nicht mitzählt. Bei Urlaub, Klinikaufenthalten oder Veranstaltungen zählen dagegen meist beide Tage. Setzen Sie dann das Häkchen bei „Starttag mitzählen“: Montag bis Freitag ergibt 5 statt 4 Tage. Nur Arbeitstage ohne Wochenenden und Feiertage zählt der [Arbeitstage-Rechner](/rechner/arbeitstage-rechner/).',
        },
      ],
      details: 'Alle Berechnungen laufen tagesgenau nach dem gregorianischen Kalender. Schalttage wie der 29.02.2024 oder der 29.02.2028 zählen als normale Kalendertage. Ein Datum um eine bestimmte Zahl von Tagen verschieben Sie mit [Datum plus Tage](/rechner/datum-plus-tage/). Ihr genaues Alter zeigt der [Altersrechner](/rechner/altersrechner/), ob ein Jahr ein Schaltjahr ist, prüft der [Schaltjahr-Rechner](/rechner/schaltjahr-rechner/).',
    },
    faqs: [
      {
        question: 'Wie viele Wochen liegen zwischen zwei Daten?',
        answer: 'Teilen Sie die Zahl der Tage durch 7, der Rest sind die übrigen Tage. Vom 01.01.2026 bis 30.06.2026 sind es 180 Tage, also 25 Wochen und 5 Tage. Der Rechner zeigt Wochen und Resttage automatisch an.',
      },
      {
        question: 'Wie berechne ich die Monate zwischen zwei Daten?',
        answer: 'Zählen Sie vom Startdatum aus volle Kalendermonate und addieren Sie die übrigen Tage. Vom 15.01.2026 bis 15.10.2026 sind es genau 9 Monate. Eine Faustformel mit 30 Tagen pro Monat liefert bei langen Zeiträumen falsche Werte.',
      },
      {
        question: 'Wie viele Tage sind es noch bis zu einem bestimmten Datum?',
        answer: 'Wählen Sie „Tage bis zu einem Datum“ und tragen Sie das Zieldatum ein. Der Rechner zählt ab heute und zeigt Tage, Wochen und die Restzeit in Stunden und Minuten. Am 05.11.2026 sind es zum Beispiel 56 Tage bis Silvester.',
      },
      {
        question: 'Zählt der erste Tag mit, wenn man Tage zwischen zwei Daten berechnet?',
        answer: 'Standardmäßig nicht: Der Rechner zeigt die Differenz, wie bei Fristen nach § 187 BGB. Sollen beide Tage zählen, etwa bei einem Urlaub von Montag bis Freitag, aktivieren Sie „Starttag mitzählen“. Dann ergeben sich 5 statt 4 Tage.',
      },
      {
        question: 'Wie lange ist ein Monat, wenn das Startdatum der 31. ist?',
        answer: 'Hat der Zielmonat weniger Tage, gilt sein letzter Tag als Monatsende. Vom 31.01.2026 bis 28.02.2026 ist daher 1 Monat vergangen, bis zum 01.03.2026 sind es 1 Monat und 1 Tag. So geht die Rechnung Startdatum plus Monate plus Tage immer genau auf.',
      },
      {
        question: 'Werden Schaltjahre beim Tagezählen berücksichtigt?',
        answer: 'Ja. Jeder 29. Februar im Zeitraum zählt als eigener Tag. Vom 28.02.2024 bis 01.03.2024 sind es deshalb 2 Tage, im Jahr 2026 wäre es nur 1 Tag.',
      },
    ],
    relatedSlugs: [
      'datum-plus-tage',
      'arbeitstage-rechner',
      'tage-bis-weihnachten',
      'tage-bis-geburtstag',
      'altersrechner',
      'alter-in-tagen',
      'dienstjubilaeum-rechner',
      'schaltjahr-rechner',
    ],
  },
  {
    id: 'tage-bis-weihnachten',
    slug: 'tage-bis-weihnachten',
    name: 'Tage bis Weihnachten: Countdown bis Heiligabend',
    shortName: 'Tage bis Weihnachten',
    category: 'datum-zeit',
    subcategory: 'Datumsdifferenz',
    metaTitle: 'Wie viele Tage bis Weihnachten? Countdown & Wochen',
    metaDescription: 'Wie lange noch bis Weihnachten? Tage und Wochen bis Heiligabend oder zum 25. Dezember berechnen – mit Datum und Wochentag.',
    h1: 'Wie viele Tage sind es bis Weihnachten?',
    shortDescription: 'Ermittelt tagesgenau die verbleibenden Kalendertage, vollen Wochen und den Wochentag bis zum nächsten Heiligabend oder ersten Weihnachtstag.',
    searchKeywords: [
      'tage bis weihnachten',
      'wie viele tage bis weihnachten',
      'countdown heiligabend',
      'tage bis heiligabend',
      'weihnachten countdown rechner',
      'tage bis weihnachten rechner',
      'wann ist weihnachten',
    ],
    inputs: [
      {
        id: 'christmasTarget',
        label: 'Ziel-Festtag auswählen',
        type: 'select',
        defaultValue: 'heiligabend',
        options: [
          { value: 'heiligabend', label: 'Heiligabend – 24. Dezember' },
          { value: 'weihnachten', label: '1. Weihnachtstag – 25. Dezember' },
        ],
      },
    ],
    calculate: calculateTageBisWeihnachten,
    formula: 'Verbleibende Tage = Kalendertag(Nächstes Fest) - Kalendertag(Heute in Berlin)',
    formulaExplanation: 'Berechnet die exakte Tagesdifferenz vom heutigen Kalendertag (Referenz: Zeitzone Europe/Berlin) bis zum 24. bzw. 25. Dezember. Liegt der Festtag im aktuellen Jahr bereits in der Vergangenheit, rolliert die Berechnung automatisch auf das Folgejahr.',
    workedExample: {
      title: 'Beispiel: Countdown bis zum nächsten Heiligabend',
      description: 'Ermittelt die exakt verbleibenden Kalendertage, Wochen und den Ziel-Wochentag für den 24. Dezember.',
      inputs: { christmasTarget: 'heiligabend' },
      resultSummary: 'Verbleibende Tage und Wochen bis zum Fest',
    },
    workedExamples: [
      {
        title: 'Beispiel: Countdown bis zum nächsten Heiligabend',
        description: 'Ermittelt die exakt verbleibenden Kalendertage, Wochen und den Ziel-Wochentag für den 24. Dezember.',
        inputs: { christmasTarget: 'heiligabend' },
        resultSummary: 'Verbleibende Tage und Wochen bis zum Fest',
      },
      {
        title: 'Beispiel: Countdown zum 1. Weihnachtstag (25. Dezember)',
        description: 'Berechnet die Spanne bis zum ersten bundesweiten gesetzlichen Weihnachtsfeiertag.',
        inputs: { christmasTarget: 'weihnachten' },
        resultSummary: 'Verbleibende Tage bis zum 25. Dezember',
      },
    ],
    content: {
      intro: 'Wie viele Tage sind es noch bis Weihnachten? Unser Weihnachts-Countdown ermittelt für Sie tagesaktuell, wie viele Kalendertage und volle Wochen noch bis Heiligabend (24. Dezember) oder dem ersten Weihnachtstag (25. Dezember) verbleiben.',
      sections: [
        {
          title: 'Wie viele Samstage sind es noch bis Weihnachten?',
          content: 'Wer Geschenke oder gemeinsame Termine plant, möchte oft die verbleibenden Wochenenden kennen. Die Zahl der Samstage ist nicht immer gleich der Zahl voller Wochen: Entscheidend ist, auf welchen Wochentag Start- und Zieldatum fallen.\n\nGezählt werden Samstage nach heute bis einschließlich des gewählten Zieldatums.\n\nFür die Planung von arbeitsfreien Tagen und Brückentagen im Büro oder Betrieb beachten Sie bitte den Unterschied zwischen Kalendertagen und regulären Arbeitswochen: Nutzen Sie dafür unseren spezialisierten [Arbeitstage- und Werktage-Rechner](/rechner/arbeitstage-rechner/).',
        },
      ],
      details: '### Wann sind Heiligabend und die Weihnachtsfeiertage?\n\nIm deutschsprachigen Raum beginnt das Weihnachtsfest traditionell am Abend des **24. Dezembers (Heiligabend)** mit der Bescherung. Gesetzliche Feiertage nach den Feiertagsgesetzen aller 16 Bundesländer sind der **1. Weihnachtstag (25. Dezember)** und der **2. Weihnachtstag (26. Dezember)**.\n\nHeiligabend selbst ist in Deutschland kein gesetzlicher Feiertag, sondern ein regulärer Werktag (oft als Bankfeiertag oder tariflicher halber Arbeitstag geregelt).\n\n### Wie wird der Countdown berechnet?\n\nDie Berechnung erfolgt tagesgenau unter Berücksichtigung der mitteleuropäischen Zeitzone (*Europe/Berlin*). Der Rechner zieht das heutige Datum vom Zieldatum ab und schlüsselt das Ergebnis in Kalendertage, ganze Wochen und verbleibende Einzeltage auf. Zudem erfahren Sie direkt, auf welchen Wochentag das nächste Weihnachtsfest fällt.\n\n### Warum schaltet der Rechner nach Weihnachten automatisch um?\n\nSobald der 24. bzw. 25. Dezember des aktuellen Kalenderjahres verstrichen ist, blickt der Rechner automatisch nach vorne: Er kalkuliert nahtlos den Countdown für das Weihnachtsfest des kommenden Kalenderjahres. So bleibt die Seite das ganze Jahr über aktuell und verlässlich.\n\nWenn Sie wissen möchten, wie viele Arbeitstage bis zum Jahresende verbleiben, nutzen Sie unseren [Arbeitstage-Rechner](/rechner/arbeitstage-rechner/). Für beliebige andere Zeitspannen steht Ihnen der allgemeine [Tagerechner: Tage zwischen zwei Daten](/rechner/tage-zwischen-zwei-daten/) zur Verfügung. Weitere Zeitzähler und Hilfen finden Sie in unserer Themenwelt [Datum & Zeit](/datum-zeit/) sowie beim [Tage bis Geburtstag](/rechner/tage-bis-geburtstag/).',
    },
    faqs: [
      {
        question: 'Wie viele Tage sind es noch bis Weihnachten?',
        answer: 'Der Rechner ermittelt automatisch anhand des aktuellen Datums in Berlin die exakte Tageszahl bis zum nächsten 24. Dezember (Heiligabend) oder 25. Dezember (1. Weihnachtstag).',
      },
      {
        question: 'Ist Heiligabend (24. Dezember) ein gesetzlicher Feiertag?',
        answer: 'Nein, Heiligabend ist in Deutschland kein gesetzlicher Feiertag. Viele Tarifverträge und Arbeitgeber regeln jedoch, dass ab 12:00 oder 14:00 Uhr arbeitsfrei ist oder nur ein halber Urlaubstag genommen werden muss.',
      },
      {
        question: 'Warum stellt der Countdown nach dem 25. Dezember automatisch auf das Folgejahr um?',
        answer: 'Sobald das Weihnachtsfest des laufenden Jahres vorbei ist, ermittelt der Rechner automatisch die Tage bis zum Fest im nächsten Jahr, sodass der Zähler immer aktuell bleibt.',
      },
      {
        question: 'Auf welchen Wochentag fällt das nächste Weihnachtsfest?',
        answer: 'Der Rechner weist den genauen Wochentag für Heiligabend und den 1. Weihnachtstag im jeweiligen Zieljahr direkt in der Ergebnisübersicht aus.',
      },
    ],
    relatedSlugs: [
      'tage-zwischen-zwei-daten',
      'arbeitstage-rechner',
      'countdown-rechner',
      'schaltjahr-rechner',
      'tage-bis-geburtstag',
      'werktage-rechner',
    ],
  },
  {
    id: 'arbeitstage-rechner',
    slug: 'arbeitstage-rechner',
    name: 'Arbeitstage-Rechner',
    shortName: 'Arbeitstage berechnen',
    category: 'datum-zeit',
    subcategory: 'Arbeitstage & Werktage',
    metaTitle: 'Arbeitstage & Werktage Rechner – nach Bundesland',
    metaDescription: 'Arbeitstage (Mo–Fr) und Werktage (Mo–Sa) kostenlos berechnen – für jedes Bundesland mit Feiertagen, pro Monat, Jahr oder beliebigem Zeitraum.',
    h1: 'Arbeitstage und Werktage berechnen – mit Feiertagen je Bundesland',
    shortDescription: 'Zählt die Arbeitstage (5-Tage-Woche) oder Werktage (Montag bis Samstag) in einem Zeitraum – mit den gesetzlichen Feiertagen Ihres Bundeslandes.',
    searchKeywords: ['arbeitstage rechner bundesland', 'arbeitstage rechner', 'arbeitstage berechnen', 'werktage rechner', 'werktage berechnen', 'werktage zwischen zwei daten', 'ist samstag ein werktag', 'arbeitstage monat'],
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
    workedExamples: [
      {
        title: 'Beispiel: Januar 2026 (31 Kalendertage, Bundesweit)',
        description: 'Enthält 21 Arbeitstage (nach Abzug von 1 Feiertag an Neujahr und 9 Wochenendtagen) sowie 168 Arbeitsstunden.',
        inputs: { startDate: '2026-01-01', endDate: '2026-01-31', workweek: 'mo-fr', excludeHolidays: true, hoursPerDay: 8 },
        resultSummary: '21 Arbeitstage (168 Arbeitsstunden)',
      },
      {
        title: 'Beispiel: Werktage im Februar 2026 (Montag bis Samstag)',
        description: 'Der Februar 2026 hat 28 Tage und 4 Sonntage, Feiertage fallen nicht hinein. Es bleiben 24 Werktage – wichtig etwa für Fristen wie die Mietzahlung bis zum dritten Werktag.',
        inputs: { startDate: '2026-02-01', endDate: '2026-02-28', workweek: 'mo-sa', excludeHolidays: true, hoursPerDay: 8 },
        resultSummary: '24 Werktage',
      },
    ],
    content: {
      intro: 'Die Ermittlung der tatsächlichen Arbeitstage bildet das Fundament für die Pendlerpauschale in der Einkommensteuererklärung sowie für Urlaubs- und Arbeitszeitplanungen.',
      details: 'Ein typisches Kalenderjahr hat bei einer 5-Tage-Woche (Montag bis Freitag) zwischen 250 und 252 potenzielle Arbeitstage. Nach Abzug von Feiertagen und Urlaub verbleiben meist 200 bis 220 tatsächliche Arbeitstage.\n\n### Unterschied zwischen Arbeitstagen und Werktagen\n\nIm deutschen Arbeits- und Zivilrecht gilt eine zentrale Unterscheidung:\n- **Arbeitstage**: Tage, an denen im Rahmen des individuellen Arbeitsverhältnisses tatsächlich Dienst geleistet werden muss. Im modernen Büro- und Verwaltungsalltag ist dies typischerweise die 5-Tage-Woche von **Montag bis Freitag**.\n- **Werktage**: Gesetzlich definierte Tage nach § 3 Abs. 2 Bundesurlaubsgesetz (BUrlG) und dem Bürgerlichen Gesetzbuch (BGB). Hierzu zählen alle Tage von **Montag bis einschließlich Samstag** (6-Tage-Woche), sofern kein gesetzlicher Feiertag vorliegt. Relevanz besitzt dieser Begriff bei Kündigungsfristen, Mietzahlungen (§ 556b Abs. 1 BGB) und Ladenschlussgesetzen.\n\nFür Fristen auf 6-Tage-Basis wählen Sie oben die Option „Montag bis Samstag“. Für beliebige Zeitspannen zwischen zwei Daten steht Ihnen unser [Tagerechner: Tage zwischen zwei Daten](/rechner/tage-zwischen-zwei-daten/) zur Verfügung.',
    },
    faqs: [
      { question: 'Wie viele Arbeitstage erkennt das Finanzamt bei einer 5-Tage-Woche pauschal an?', answer: 'Die meisten Finanzämter akzeptieren ohne gesonderte Einzelnachweise 220 bis 230 Arbeitstage pro Jahr für die Entfernungspauschale.' },
      { question: 'Müssen Feiertage am Wochenende abgezogen werden?', answer: 'Nein, Feiertage, die ohnehin auf einen Samstag oder Sonntag fallen, mindern die reguläre Arbeitszeit nicht zusätzlich.' },
      { question: 'Ist der Samstag ein Werktag?', answer: 'Ja. Nach § 3 Abs. 2 Bundesurlaubsgesetz und für Fristen im BGB zählt der Samstag als Werktag, Sonn- und Feiertage dagegen nicht. Wählen Sie oben „Montag bis Samstag“, um Werktage statt Arbeitstage zu zählen.' },
      { question: 'Zählen regionale Feiertage wie Fronleichnam als Werktage?', answer: 'Nein, nicht in den Bundesländern, in denen sie gesetzliche Feiertage sind – etwa Fronleichnam in Bayern oder NRW. Wählen Sie Ihr Bundesland, dann zieht der Rechner genau diese Feiertage ab.' },
    ],
    relatedSlugs: ['tage-zwischen-zwei-daten', 'werktage-rechner', 'tage-bis-weihnachten', 'tage-zwischen-zwei-daten', 'altersrechner', 'arbeitszeitrechner', 'urlaubstage-rechner'],
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
      details: 'Zur Bestimmung der Werktage werden von den Kalendertagen alle Sonntage sowie die im jeweiligen Bundesland geltenden gesetzlichen Feiertage subtrahiert. Bei reinen Fünftage-Bürowochen spricht man präziser von Arbeitstagen.\n\n### Werktage vs. Arbeitstage nach deutschem Recht\n\n- **Werktag (Mo–Sa)**: Nach § 3 Abs. 2 BUrlG gelten alle Kalendertage, die nicht Sonn- oder gesetzliche Feiertage sind, als Werktage – mithin auch der **Samstag**. Fristen im BGB (z. B. Mietzahlungsfrist nach § 556b Abs. 1 BGB: Schonfrist bis zum 3. Werktag des Monats) bemessen sich standardmäßig nach Werktagen.\n- **Arbeitstag (typisch Mo–Fr)**: Bezeichnet die Tage, an denen vertraglich eine Arbeitspflicht besteht. Wenn Ihr Arbeitsverhältnis eine 5-Tage-Woche vorsieht, schalten Sie die Option oben einfach auf *Montag bis Freitag* um oder nutzen Sie direkt unseren [Arbeitstage-Rechner](/rechner/arbeitstage-rechner/).\n\nFür allgemeine Tages- und Kalenderzeitspannen steht Ihnen zudem unser übergeordneter [Tagerechner: Tage zwischen zwei Daten](/rechner/tage-zwischen-zwei-daten/) zur Seite.',
    },
    faqs: [
      { question: 'Ist der Samstag rechtlich immer ein Werktag?', answer: 'Ja, nach dem BGB und dem BUrlG gilt der Samstag ausdrücklich als Werktag, es sei denn, ein Vertrag oder Tarifvertrag definiert abweichend reine Arbeitstage (Mo–Fr).' },
      { question: 'Zählen regionale Feiertage wie Fronleichnam oder Allerheiligen als Werktage?', answer: 'In den Bundesländern, in denen diese Tage gesetzliche Feiertage sind (z. B. Bayern, NRW, Baden-Württemberg), gelten sie arbeitsrechtlich nicht als Werktage.' },
      { question: 'Was passiert, wenn ein Feiertag auf einen Samstag fällt?', answer: 'Bei einer 5-Tage-Woche (Mo–Fr) mindert ein Samstagsfeiertag das Ergebnis nicht doppelt, da der Samstag ohnehin arbeitsfrei ist.' },
    ],
    relatedSlugs: ['tage-zwischen-zwei-daten', 'arbeitstage-rechner', 'tage-bis-weihnachten', 'tage-zwischen-zwei-daten', 'tage-zwischen-zwei-daten', 'schaltjahr-rechner'],
  },
  {
    id: 'datum-plus-tage',
    slug: 'datum-plus-tage',
    name: 'Datum-plus-Tage-Rechner',
    shortName: 'Datum + Tage',
    category: 'datum-zeit',
    subcategory: 'Datumsdifferenz',
    metaTitle: 'Datum plus/minus Tage – Welches Datum ist in X Tagen?',
    metaDescription: 'Tage zu einem Datum addieren oder abziehen: Zieldatum, Wochentag und Kalenderwoche sofort berechnen – kostenlos und ohne Anmeldung.',
    h1: 'Datum plus oder minus Tage berechnen',
    shortDescription: 'Addiert oder subtrahiert eine beliebige Anzahl von Tagen zu einem Ausgangsdatum.',
    searchKeywords: ['datum plus tage', 'datum addieren', 'welches datum ist in 30 tagen', 'tage dazurechnen', 'datum minus tage', 'datum subtrahieren', 'welches datum war vor 30 tagen'],
    inputs: [
      {
        id: 'operation',
        label: 'Rechenart',
        type: 'select',
        defaultValue: 'add',
        options: [
          { value: 'add', label: 'Tage addieren (in die Zukunft)' },
          { value: 'subtract', label: 'Tage abziehen (in die Vergangenheit)' },
        ],
      },
      { id: 'startDate', label: 'Ausgangsdatum', type: 'date', defaultValue: '2026-03-01' },
      { id: 'days', label: 'Anzahl Tage', type: 'number', defaultValue: 14, min: 0, unit: 'Tage' },
    ],
    calculate: (inputs) =>
      calculateDateAdd({ ...inputs, operation: inputs.operation === 'subtract' ? 'subtract' : 'add' }),
    formula: 'Zieldatum = Ausgangsdatum ± n Tage',
    formulaExplanation: 'Kalendarische Addition unter Berücksichtigung von Monatsüberläufen.',
    workedExample: {
      title: 'Beispiel: 01.03.2026 plus 14 Tage',
      description: 'Ergibt Sonntag, den 15.03.2026.',
      inputs: { startDate: '2026-03-01', days: 14 },
      resultSummary: '15.03.2026',
    },
    workedExamples: [
      {
        title: 'Beispiel: 01.03.2026 plus 14 Tage',
        description: 'Ergibt Sonntag, den 15.03.2026 – etwa das Ende eines Zahlungsziels „zahlbar innerhalb von 14 Tagen“.',
        inputs: { operation: 'add', startDate: '2026-03-01', days: 14 },
        resultSummary: '15.03.2026',
      },
      {
        title: 'Beispiel: 01.05.2026 minus 30 Tage',
        description: 'Mit „Tage abziehen“ ergibt sich Mittwoch, der 01.04.2026 – praktisch, um eine Vorlauffrist rückwärts zu bestimmen.',
        inputs: { operation: 'subtract', startDate: '2026-05-01', days: 30 },
        resultSummary: '01.04.2026',
      },
    ],
    content: {
      intro: 'Dieser Rechner addiert Tage zu einem Datum oder zieht sie ab und ermittelt das exakte Zieldatum samt Wochentag – etwa für Zahlungsziele, Lieferfristen oder Vorlaufzeiten.',
      details: 'Berücksichtigt präzise Monatsgrenzen (28, 29, 30 oder 31 Tage) und Schaltjahre. Ideal zur Bestimmung von Zahlungszielen (z. B. "zahlbar innerhalb von 14 Tagen") oder Lieferfristen.',
    },
    faqs: [
      { question: 'Wie berechnet man eine 14-tägige Frist nach BGB?', answer: 'Nach § 187 Abs. 1 BGB zählt der Tag des Zugangs nicht mit; die Frist beginnt am darauffolgenden Tag und endet mit Ablauf des 14. Tages.' },
      { question: 'Fällt das Ergebnis bei Addition von Vielfachen von 7 immer auf denselben Wochentag?', answer: 'Ja, jede Addition von 7, 14, 21, 28 etc. Tagen landet exakt auf demselben Wochentag wie das Startdatum.' },
      { question: 'Wie ermittelt man den spätesten Absendetermin bei einer 4-wöchigen Kündigungsfrist?', answer: 'Wählen Sie „Tage abziehen“, ziehen Sie 28 Kalendertage vom Fristende ab und rechnen Sie 2 bis 3 Tage Postlaufzeit als Puffer ein.' },
      { question: 'Was geschieht beim Abziehen über einen Schalttag hinweg?', answer: 'Fällt der 29. Februar in den Zeitraum, wird er automatisch als vollwertiger Tag mitgezählt.' },
    ],
    relatedSlugs: ['tage-zwischen-zwei-daten', 'dienstjubilaeum-rechner', 'alter-in-tagen', 'arbeitstage-rechner'],
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
      intro: 'Dieser Rückrechner subtrahiert eine vorgegebene Anzahl von Kalendertagen von einem Stichtag zur Feststellung von Vorlauffristen oder Kündigungsterminen.',
      details: 'Die Subtraktion erfolgt taggenau rückwärts über Monats- und Jahresgrenzen hinweg. Unverzichtbar für Vorbereitungszeiten bei Veranstaltungen, Hochzeiten oder Bauprojekten.',
    },
    faqs: [
      { question: 'Wie ermittelt man den spätesten Absendetermin bei einer 4-wöchigen Kündigungsfrist?', answer: 'Subtrahieren Sie 28 Kalendertage vom Monatsende und rechnen Sie 2 bis 3 Tage Postlaufzeit als Puffer ein.' },
      { question: 'Was geschieht bei Subtraktion über einen Schalttag hinweg?', answer: 'Fällt der 29. Februar in das Rückwärts-Intervall, zieht der Rechner diesen Tag vollautomatisch als vollwertigen Tag ab.' },
    ],
    relatedSlugs: ['datum-plus-tage', 'tage-zwischen-zwei-daten', 'tage-zwischen-zwei-daten'],
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
    relatedSlugs: ['altersrechner', 'wochenrechner', 'tage-zwischen-zwei-daten'],
  },
  {
    id: 'wochenrechner',
    slug: 'wochenrechner',
    name: 'Wochenrechner & Kalenderwoche (KW)',
    shortName: 'Kalenderwoche',
    category: 'datum-zeit',
    subcategory: 'Uhrzeit & Zeiteinheiten',
    metaTitle: 'Kalenderwoche Rechner – Aktuelle KW & Datum DIN ISO',
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
    relatedSlugs: ['arbeitstage-rechner', 'tage-zwischen-zwei-daten', 'schaltjahr-rechner'],
  },
  {
    id: 'zeitdifferenz-rechner',
    slug: 'zeitdifferenz-rechner',
    name: 'Zeitdifferenz-Rechner (Stunden & Minuten)',
    shortName: 'Zeitdifferenz',
    category: 'datum-zeit',
    subcategory: 'Uhrzeit & Zeiteinheiten',
    metaTitle: 'Zeitdifferenz Rechner – Stunden & Minuten online berechnen',
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
    metaDescription: 'Erstellen Sie einen sekundengenauen Countdown zu jedem beliebigen Zieldatum (Hochzeit, Urlaub, Rente, Neujahr) mit Aufschlüsselung in Tage, Wochen und Stunden.',
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
    formula: 'Verbleibende Zeit = Zieldatum (UTC) - Aktueller Zeitpunkt (UTC)',
    formulaExplanation: 'Die Zeitdifferenz wird millisekundengenau ermittelt und hierarchisch in volle Wochen, verbleibende Tage und Stunden zerlegt.',
    workedExample: {
      title: 'Beispiel: Countdown bis Jahresende 2026',
      description: 'Zählt die verbleibenden Kalendertage und Stunden bis zum Stichtag 31.12.2026 um 00:00 Uhr.',
      inputs: { targetDate: '2026-12-31' },
      resultSummary: 'Verbleibende Kalendertage, Wochen und Gesamtstunden',
    },
    content: {
      intro: 'Dieser Countdown-Timer misst die verbleibende Restzeit bis zu einem festen Stichtag sekundengenau herunter.',
      details: 'Ein Countdown berechnet die exakte Differenz zwischen dem aktuellen Systemzeitpunkt und einem definierten Zieltermin. Die Differenz wird standardmäßig auf Basis der koordinierten Weltzeit (UTC) ermittelt und anschließend in Tage, volle Wochen und verbleibende Stunden zerlegt. Dies erleichtert die Fristenkontrolle bei behördlichen Abgabeterminen, geschäftlichen Projektmeilensteinen, Produkt-Launches oder persönlichen Anlässen wie runden Geburtstagen, Urlaubsreisen und Hochzeiten. Bei Zeiträumen über mehrere Monate hinweg fließen dabei auch Kalenderschwankungen wie Schaltjahre präzise in die Berechnung ein.',
      sections: [
        {
          title: 'Typische Einsatzbereiche für Stichtags-Countdowns',
          content: 'Countdowns kommen im Berufs- und Alltagsleben bei vielen Gelegenheiten zum Einsatz:\n\n- **Fristenüberwachung:** Gesetzliche Kündigungsfristen, Steuerabgabetermine und gerichtliche Einspruchsfristen.\n- **Projektmanagement:** Sprint-Deadlines, Release-Termine und vertragliche Lieferdaten.\n- **Private Ereignisse:** Urlaubsantritt, Geburts- und Jubiläumstage, Hochzeiten oder Renteneintritt.\n\nDurch die modulare Aufteilung in Tage, Wochen und Stunden erhalten Sie jederzeit eine klare zeitliche Orientierung.',
        },
        {
          title: 'Praxistipps für präzise Frist- und Terminberechnungen',
          content: 'Beachten Sie bei der Planung von Fristen und wichtigen Ereignissen folgende Besonderheiten:\n\n- **Kalendertage vs. Werktage:** Ein Countdown zählt alle fortlaufenden 24-Stunden-Tage. Für gesetzliche Kündigungsfristen oder Bankarbeitstage nutzen Sie bitte unseren [Werktage-Rechner](/rechner/werktage-rechner/).\n- **Zeitzonendifferenzen:** Bei internationalen Events richtet sich der Countdown stets nach der Systemzeit Ihres Endgeräts.\n- **Schaltjahre:** Der 29. Februar in Schaltjahren wird von unserem Kalenderalgorithmus vollautomatisch als vollwertiger 86.400-Sekunden-Tag eingerechnet.',
        },
      ],
    },
    faqs: [
      { question: 'Wie viele Sekunden hat ein regulärer Kalendertag?', answer: 'Ein regulärer Kalendertag hat exakt 24 Stunden × 60 Minuten × 60 Sekunden = 86.400 Sekunden.' },
      { question: 'Was passiert mit dem Countdown bei einer Zeitumstellung?', answer: 'Bei Zeitstempeln mit lokaler Zeitzone verschiebt sich die Stundendifferenz am Tag der Umstellung zwischen Winterzeit (MEZ) und Sommerzeit (MESZ) um genau eine Stunde.' },
      { question: 'Wie werden Fristen rechtlich in Deutschland gezählt (§ 187 BGB)?', answer: 'Im deutschen Zivilrecht (§ 187 Abs. 1 BGB) wird der Tag, in den das fristauslösende Ereignis fällt, bei der Fristberechnung grundsätzlich nicht mitgezählt. Die Frist beginnt erst mit dem darauffolgenden Tag. Fällt das Fristende auf einen Samstag, Sonntag oder gesetzlichen Feiertag, verlängert sich die Frist nach § 193 BGB auf den nächsten Werktag.' },
      { question: 'Wie beeinflussen unterschiedliche Zeitzonen einen Countdown?', answer: 'Wenn das Zieldatum in einer anderen Zeitzone liegt (z. B. Silvester in Sydney oder New York), muss die Zeitverschiebung gegenüber der mitteleuropäischen Zeit berücksichtigt werden. Unser Rechner orientiert sich an Ihrer lokalen Systemuhrzeit.' },
    ],
    relatedSlugs: ['tage-bis-geburtstag', 'tage-zwischen-zwei-daten', 'wochenrechner'],
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
