import { CalcContent } from './types';

export const DATUM_ZEIT_CONTENT: Record<string, CalcContent> = {
  altersrechner: {
    intro: 'Die exakte Altersbestimmung erfordert die präzise Subtraktion von Geburtsjahr, -monat und -tag vom Stichtag unter Berücksichtigung der unterschiedlichen Monatslängen und Schaltjahre.',
    details: 'Im deutschen Recht (§ 187 Abs. 2 Satz 2 BGB) beginnt das Lebensjahr mit dem Beginn des Geburtstages. Wer am 29. Februar geboren wurde, vollendet in Gemeinjahren sein Lebensjahr gemäß § 188 BGB mit Ablauf des 28. Februars bzw. mit Beginn des 1. März.',
    faqs: [
      { question: 'Wann vollenden am 29. Februar Geborene in Nicht-Schaltjahren ihr Lebensjahr?', answer: 'Nach deutschem Zivilrecht (§ 188 Abs. 3 BGB) gilt das Lebensjahr mit Ablauf des 28. Februars (24:00 Uhr) als vollendet, sodass der Geburtstag am 1. März gefeiert wird.' },
      { question: 'Wie berechnet man das Alter auf den Tag genau im Kopf?', answer: 'Man zieht zunächst das Geburtsjahr vom aktuellen Jahr ab. Liegt der Geburtstag im laufenden Jahr noch in der Zukunft, zieht man ein ganzes Jahr ab und berechnet die verbleibenden Monate und Resttage zum Vormonat.' }
    ]
  },
  'alter-in-tagen': {
    intro: 'Die Zählung des Lebensalters in Tagen ermittelt die absolute Anzahl an Kalendertagen zwischen der Geburt und einem Zielzeitpunkt.',
    details: 'Jedes Normaljahr steuert exakt 365 Tage bei, während Schaltjahre 366 Tage umfassen. Ein Mensch erreicht seinen 10.000sten Lebenstag typischerweise im Alter von 27 Jahren und etwa vier Monaten.',
    faqs: [
      { question: 'Werden Schalttage bei der Tageszählung vollständig berücksichtigt?', answer: 'Ja, alle 29. Februare, die zwischen dem Geburtsdatum und dem Stichtag liegen, werden voll als Einzeltage mitgezählt.' },
      { question: 'Wird der Geburtstag selbst als ganzer Tag mitgezählt?', answer: 'In der Zeitrechnung zählt der Geburtstag als Tag 0; nach Vollendung von 24 Stunden ist der erste Lebenstag abgeschlossen.' }
    ]
  },
  'lebenszeit-in-stunden': {
    intro: 'Die Umrechnung des Lebensalters in Stunden verdeutlicht die tatsächlich erlebte Zeitspanne und bietet eine greifbare Grundlage für biologische Vergleiche.',
    details: 'Ein durchschnittliches Menschenleben von 80 Jahren umfasst rund 700.000 Stunden. Rund ein Drittel davon (etwa 230.000 Stunden) verbringt der Mensch im Schlaf, während das menschliche Herz dabei über 2,8 Milliarden Schläge ausführt.',
    faqs: [
      { question: 'Werden Sommer- und Winterzeit bei der Gesamtstundenzahl berücksichtigt?', answer: 'Für astronomische Lebenszeitberechnungen wird der standardmäßige 24-Stunden-Schnitt pro Kalendertag verwendet, da sich Sommer- und Winterzeit im Jahresverlauf gegenseitig aufheben.' },
      { question: 'Wie rechnet man Lebenstage manuell in Stunden um?', answer: 'Multiplizieren Sie die Gesamtanzahl der absoluten Lebenstage einfach mit dem Faktor 24.' }
    ]
  },
  'alter-in-wochen': {
    intro: 'Vor allem in der Säuglingsentwicklung, bei kinderärztlichen U-Untersuchungen und in der Schwangerschaftsmedizin ist die Angabe des Alters in vollendeten Wochen der maßgebliche Standard.',
    details: 'Die Berechnung dividiert die Gesamtzahl der Lebenstage ganzzahlig durch 7. Der verbleibende Divisionsrest stellt die zusätzlichen Einzeltage dar (z. B. 12 Wochen und 4 Tage).',
    faqs: [
      { question: 'Warum wird das Alter von Babys meist in Wochen statt Monaten angegeben?', answer: 'In den ersten Lebensmonaten verläuft die motorische und neuronale Entwicklung in rasanten Schüben, die sich in Wochenschritten wesentlich genauer beurteilen lassen als in ungleich langen Monaten.' },
      { question: 'Wie viele Wochen hat ein durchschnittliches Kalenderjahr?', answer: 'Ein Gemeinjahr hat 52 Wochen plus einen Tag (365 / 7 = 52,14), ein Schaltjahr 52 Wochen plus zwei Tage.' }
    ]
  },
  'alter-in-monaten': {
    intro: 'Für Verträge, Kündigungsfristen, Garantielaufzeiten sowie entwicklungspsychologische Stufen ist das Alter in vollen Monaten plus Resttagen eine wichtige Zeiteinheit.',
    details: 'Da Kalendermonate zwischen 28 und 31 Tagen schwanken, basiert die Monatszählung auf dem kalendarischen Monatssprung vom Ausgangstag zum gleichen Tag des Folgemonats.',
    faqs: [
      { question: 'Wie wird gerechnet, wenn der Ausgangstag im Zielmonat nicht existiert (z. B. 31. Januar auf Februar)?', answer: 'Nach § 188 Abs. 3 BGB endet die Monatsfrist in solchen Fällen mit dem Ablauf des letzten Tages des Monats (also am 28. bzw. 29. Februar).' },
      { question: 'Wie viele Monate hat ein Kleinkind mit 2,5 Jahren?', answer: 'Zweieinhalb Lebensjahre entsprechen exakt 30 Kalendermonaten (2 × 12 + 6).' }
    ]
  },
  altersunterschied: {
    intro: 'Der chronologische Altersabstand zweier Personen drückt die zeitliche Distanz zwischen ihren Geburtstagen in Jahren, Monaten und Tagen sowie als absolute Tagesdifferenz aus.',
    details: 'Bei der Differenzbildung wird der zeitliche Abstand zwischen beiden Geburtszeitpunkten ermittelt. In Partnerschaften, Erbfolgen oder im Sport (Altersklassen) bildet dieser Wert die objektive Vergleichsbasis.',
    faqs: [
      { question: 'Verändert sich der Altersabstand in Tagen jemals?', answer: 'Nein, die Anzahl der Kalendertage zwischen zwei Geburtszeitpunkten bleibt das gesamte Leben über unveränderlich konstant.' },
      { question: 'Wie wird der relative Altersunterschied mit zunehmendem Alter wahrgenommen?', answer: 'Psychologisch und prozentual schrumpft der Abstand: Ein Unterschied von 5 Jahren macht bei 15-Jährigen 33 % der Lebensspanne aus, bei 50-Jährigen nur noch 10 %.' }
    ]
  },
  geburtstagsrechner: {
    intro: 'Dieser Geburtstagsplaner ermittelt den Wochentag der Geburt, das genaue Alter und den Wochentag künftiger runder Jubiläen.',
    details: 'Da ein Gemeinjahr 365 Tage hat (52 Wochen plus 1 Tag), verschiebt sich der Geburtstag in jedem Folgejahr um genau einen Wochentag nach vorne; nach einem Schaltjahr springt er um zwei Wochentage weiter.',
    faqs: [
      { question: 'Warum wandert der Geburtstag jedes Jahr auf einen anderen Wochentag?', answer: 'Weil 365 geteilt durch 7 den Rest 1 ergibt; jeder Geburtstag rückt daher im Folgejahr um einen Wochentag weiter (Schaltjahre überspringen zwei Tage).' },
      { question: 'Wie viele Geburtstage fallen statistisch auf das Wochenende?', answer: 'Über einen Lebenszyklus von mehreren Jahrzehnten fallen im Schnitt ca. 28,5 Prozent (2/7) aller Geburtstage auf einen Samstag oder Sonntag.' }
    ]
  },
  'tage-bis-geburtstag': {
    intro: 'Dieser Countdown berechnet die exakt verbleibenden Kalendertage und Stunden bis zu Ihrem nächsten Geburtstag.',
    details: 'Er berücksichtigt automatisch, ob der Geburtstag im laufenden Kalenderjahr bereits verstrichen ist (in diesem Fall wird auf das Folgejahr berechnet) und bezieht eventuelle Schalttage nahtlos ein.',
    faqs: [
      { question: 'Wann schaltet der Rechner auf das nächste Lebensjahr um?', answer: 'Exakt um 00:00 Uhr des Geburtstages; an Ihrem Ehrentag selbst zeigt der Countdown "Heute ist Ihr Geburtstag!" an.' },
      { question: 'Wie viele Tage hat das persönliche Lebensjahr?', answer: '365 Tage, es sei denn, in den 12 Monaten bis zum nächsten Geburtstag liegt ein 29. Februar (dann sind es 366 Tage).' }
    ]
  },
  datumsdifferenz: {
    intro: 'Die Kalendertagsberechnung zwischen zwei Fixdaten ermittelt die genaue Tageszahl wahlweise inklusive oder exklusive des Endtages.',
    details: 'Im deutschen Rechtsverkehr schließt die Fristberechnung nach § 187 Abs. 1 BGB den Tag des Ereignisses nicht mit ein; die Frist beginnt am Folgetag und endet mit Ablauf des letzten Tages.',
    faqs: [
      { question: 'Was ist der Unterschied zwischen inklusiver und exklusiver Tageszählung?', answer: 'Bei exklusiver Zählung ergibt der Zeitraum 01. Mai bis 02. Mai genau 1 Tag. Bei inklusiver Zählung (beide Tage voll mitgerechnet) sind es 2 Tage.' },
      { question: 'Welche Methode wenden deutsche Banken bei Zinstagen an?', answer: 'Die deutsche Zinsmethode (30/360) rechnet jeden vollen Monat mit 30 Tagen und das Jahr mit 360 Tagen, während die Eurozinsmethode (act/360) kalendergenaue Tage nutzt.' }
    ]
  },
  'wochen-zwischen-daten': {
    intro: 'Die Wochenzählung zwischen zwei Stichtagen vereinfacht die Planung von Bauvorhaben, Probezeiten, Elternzeiten oder Semestern.',
    details: 'Die absolute Tagesdifferenz wird durch 7 geteilt. So lässt sich unmittelbar ablesen, wie viele volle Arbeits- und Ruhewochen für das Vorhaben zur Verfügung stehen.',
    faqs: [
      { question: 'Wie viele Wochen liegen zwischen Jahresanfang und Jahresmitte?', answer: 'Zwischen dem 1. Januar und dem 1. Juli liegen in einem Gemeinjahr exakt 181 Tage bzw. 25 Wochen und 6 Tage.' },
      { question: 'Wie rechnet man Wochen schnell in Monate um?', answer: 'Multiplizieren Sie die Wochenzahl mit 7 und teilen Sie durch 30,4 (mittlere Monatslänge), oder rechnen Sie mit der Faustformel: 4,33 Wochen ergeben einen vollen Monat.' }
    ]
  },
  'monate-zwischen-daten': {
    intro: 'Die genaue Monatsdistanz zwischen zwei Kalenderdaten ist entscheidend für Kündigungsfristen von Mietverträgen, Kreditzinsbindungen und Beschäftigungszeiten.',
    details: 'Die Berechnung ermittelt volle abgelaufene Monate unter Würdigung der Monatsenden (§ 188 BGB) und weist verbleibende Resttage separat aus.',
    faqs: [
      { question: 'Wie wirkt sich ein Monatsende auf die Berechnung aus (z. B. 28. Februar bis 31. März)?', answer: 'Geht ein Zeitraum vom letzten Tag eines kurzen Monats bis zum letzten Tag eines längeren Monats, gilt der Monat rechtlich als vollendet.' },
      { question: 'Wie viele Monate Kündigungsfrist hat ein Wohnungsmietvertrag?', answer: 'Für Mieter beträgt die Frist gesetzlich stets 3 Monate (§ 573c BGB). Für Vermieter verlängert sie sich nach 5 und 8 Jahren Mietdauer auf 6 bzw. 9 Monate.' }
    ]
  },
  'kalendertage-rechner': {
    intro: 'Dieser Zähler ermittelt die reine Anzahl an Kalendertagen eines Monats, Quartals oder frei wählbaren Zeitintervalls.',
    details: 'Kalendertage umfassen ausnahmslos alle 24-Stunden-Tage (Montag bis Sonntag inklusive aller gesetzlichen Feiertage). Dies ist die gesetzliche Basis für Verzugszinsen und Mietzinsberechnungen.',
    faqs: [
      { question: 'Wie viele Kalendertage hat ein Quartal?', answer: 'Q1 hat 90 Tage (Schaltjahr: 91); Q2 hat 91 Tage; Q3 hat 92 Tage; Q4 hat 92 Tage.' },
      { question: 'Wann rechnen Gerichte nach Kalendertagen statt Werktagen?', answer: 'Fristen, die nach Wochen, Monaten oder Jahren bestimmt sind (§ 188 BGB), laufen nach Kalendertagen; nur der letzte Fristtag verlängert sich bei Samstagen/Sonntagen auf den Werktag (§ 193 BGB).' }
    ]
  },
  arbeitszeitrechner: {
    intro: 'Dieser Arbeitszeitrechner erfasst tägliche Arbeitsbeginn- und Endzeiten, zieht gesetzliche Pausenzeiten nach § 4 ArbZG ab und ermittelt Über- oder Minusstunden.',
    details: 'Nach § 4 Arbeitszeitgesetz ist bei einer Arbeitszeit von 6 bis 9 Stunden eine Ruhepause von mindestens 30 Minuten, bei mehr als 9 Stunden von mindestens 45 Minuten zwingend vorgeschrieben.',
    faqs: [
      { question: 'Darf die gesetzliche Ruhepause aufgespalten werden?', answer: 'Ja, die Ruhepause kann in Zeitabschnitte von jeweils mindestens 15 Minuten aufgeteilt werden; kürzere Unterbrechungen gelten rechtlich nicht als Pause.' },
      { question: 'Zählt der Weg zur Arbeit als Arbeitszeit?', answer: 'Die normale Fahrt zur ersten Tätigkeitsstätte gilt als private Lebensführung; Dienstreisen oder Fahrten zwischen Kunden gelten hingegen in vollem Umfang als vergütungspflichtige Arbeitszeit.' }
    ]
  },
  'tage-zwischen-zwei-daten': {
    intro: 'Ermittelt die astronomisch exakte Anzahl von Kalendertagen zwischen Start- und Zieldatum unter Berücksichtigung aller zwischenliegenden Schaltjahre.',
    details: 'Die Berechnung basiert auf der Differenz der julianischen Tageszahlen oder Unix-Millisekunden, geteilt durch 86.400.000 Millisekunden pro Tag.',
    faqs: [
      { question: 'Wie viele Tage liegen exakt zwischen Weihnachten (25.12.) und Silvester (31.12.)?', answer: 'Exklusiv des Starttages liegen exakt 6 Kalendertage dazwischen; zählt man beide Grenztage mit, sind es 7 Tage.' },
      { question: 'Wie wird ein Schalttag zwischen zwei Terminen gewertet?', answer: 'Liegt der 29. Februar innerhalb des gewählten Intervalls, erhöht sich die berechnete Tagesanzahl automatisch um genau 1.' }
    ]
  },
  'arbeitstage-rechner': {
    intro: 'Die Ermittlung der tatsächlichen Arbeitstage bildet das Fundament für die Pendlerpauschale in der Einkommensteuererklärung sowie für Urlaubs- und Arbeitszeitplanungen.',
    details: 'Ein typisches Kalenderjahr hat bei einer 5-Tage-Woche (Montag bis Freitag) zwischen 250 und 252 potenzielle Arbeitstage. Nach Abzug von durchschnittlich 30 Urlaubstagen und Feiertagen verbleiben meist 210 bis 225 tatsächliche Arbeitstage.',
    faqs: [
      { question: 'Wie viele Arbeitstage erkennt das Finanzamt bei einer 5-Tage-Woche pauschal an?', answer: 'Die meisten Finanzämter akzeptieren ohne gesonderte Einzelnachweise 220 bis 230 Arbeitstage pro Jahr für die Entfernungspauschale.' },
      { question: 'Müssen Krankheitstage von den Arbeitstagen für die Steuer abgezogen werden?', answer: 'Ja, an Tagen mit Arbeitsunfähigkeit oder Homeoffice ist keine Fahrt zur ersten Tätigkeitsstätte erfolgt, weshalb die Fahrtpauschale für diese Tage entfällt.' }
    ]
  },
  'werktage-rechner': {
    intro: 'Werktage sind alle Kalendertage, die nicht auf einen Sonntag oder gesetzlichen Feiertag fallen. Nach deutschem Recht (§ 3 Bundesurlaubsgesetz) zählt auch der Samstag regulär als Werktag.',
    details: 'Zur Bestimmung der Werktage werden von den Kalendertagen alle Sonntage sowie die im jeweiligen Bundesland geltenden gesetzlichen Feiertage subtrahiert. Bei reinen Fünftage-Bürowochen spricht man präziser von Arbeitstagen.',
    faqs: [
      { question: 'Ist der Samstag rechtlich immer ein Werktag?', answer: 'Ja, nach dem BGB und dem BUrlG gilt der Samstag ausdrücklich als Werktag, es sei denn, ein Vertrag oder Tarifvertrag definiert abweichend reine Arbeitstage (Mo–Fr).' },
      { question: 'Zählen regionale Feiertage wie Fronleichnam oder Allerheiligen als Werktage?', answer: 'In den Bundesländern, in denen diese Tage gesetzliche Feiertage sind (z. B. Bayern, NRW, Baden-Württemberg), gelten sie arbeitsrechtlich nicht als Werktage.' }
    ]
  },
  'datum-plus-tage': {
    intro: 'Dieser Zukunftsrechner addiert eine beliebige Anzahl von Tagen zu einem Ausgangsdatum und ermittelt das exakte Zieldatum samt Wochentag.',
    details: 'Berücksichtigt präzise Monatsgrenzen (28, 29, 30 oder 31 Tage) und Schaltjahre. Ideal zur Bestimmung von Zahlungszielen (z. B. "zahlbar innerhalb von 14 Tagen") oder Lieferfristen.',
    faqs: [
      { question: 'Wie berechnet man eine 14-tägige Frist nach BGB?', answer: 'Nach § 187 Abs. 1 BGB zählt der Tag des Zugangs nicht mit; die Frist beginnt am darauffolgenden Tag und endet mit Ablauf des 14. Tages.' },
      { question: 'Fällt das Ergebnis bei Addition von Vielfachen von 7 immer auf denselben Wochentag?', answer: 'Ja, jede Addition von 7, 14, 21, 28 etc. Tagen landet exakt auf demselben Wochentag wie das Startdatum.' }
    ]
  },
  'datum-minus-tage': {
    intro: 'Dieser Rückrechner subtrahiert eine vorgegebene Anzahl von Kalendertagen von einem Stichtag zur Feststellung von Vorlauffristen oder Kündigungsterminen.',
    details: 'Die Subtraktion erfolgt taggenau rückwärts über Monats- und Jahresgrenzen hinweg. Unverzichtbar für Vorbereitungszeiten bei Veranstaltungen, Hochzeiten oder Bauprojekten.',
    faqs: [
      { question: 'Wie ermittelt man den spätesten Absendetermin bei einer 4-wöchigen Kündigungsfrist?', answer: 'Subtrahieren Sie 28 Kalendertage vom Monatsende und rechnen Sie 2 bis 3 Tage Postlaufzeit als Puffer ein.' },
      { question: 'Was geschieht bei Subtraktion über einen Schalttag hinweg?', answer: 'Fällt der 29. Februar in das Rückwärts-Intervall, zieht der Rechner diesen Tag vollautomatisch als vollwertigen Tag ab.' }
    ]
  },
  'schaltjahr-rechner': {
    intro: 'Schaltjahre gleichen die Differenz zwischen dem bürgerlichen Kalenderjahr (365 Tage) und dem astronomischen Sonnenjahr (ca. 365,2422 Tage) durch das Einfügen eines 366. Tages aus.',
    details: 'Die gregorianische Schaltregel lautet: Ein Jahr ist ein Schaltjahr, wenn die Jahreszahl durch 4 teilbar ist – es sei denn, sie ist durch 100 teilbar. Ist sie jedoch auch durch 400 teilbar, handelt es sich dennoch um ein Schaltjahr (daher war 2000 ein Schaltjahr, 1900 keines).',
    faqs: [
      { question: 'Warum reicht es nicht aus, einfach alle 4 Jahre einen Schalttag einzufügen?', answer: 'Ein Sonnenjahr dauert 365 Tage, 5 Stunden, 48 Minuten und 45 Sekunden. Ein Schalttag alle 4 Jahre würde den Kalender um etwa 11 Minuten pro Jahr überkompensieren; die 100- und 400-Jahre-Regeln korrigieren diesen Fehler.' },
      { question: 'Wann ist das nächste Jahrhundert-Schaltjahr?', answer: 'Das nächste glatte Jahrhundert, das ein Schaltjahr sein wird, ist das Jahr 2400. Die Jahre 2100, 2200 und 2300 werden reguläre Gemeinjahre sein.' }
    ]
  },
  wochenrechner: {
    intro: 'Dieser Rechner führt Additionen und Subtraktionen von Kalenderwochen und Tagen zu einem vorgegebenen Ausgangsdatum durch.',
    details: 'Wichtig für Bauzeitenpläne, Schwangerschaftswochen (SSW) und Lieferfristen im Handel, bei denen Fristen üblicherweise in vollen Arbeits- oder Kalenderwochen formuliert sind.',
    faqs: [
      { question: 'Wie addiert man 6 Wochen zu einem Datum im Kopf?', answer: '6 Wochen entsprechen genau 42 Kalendertagen. Addieren Sie einen vollen Monat (ca. 30 Tage) plus 12 weitere Tage.' },
      { question: 'Fällt das Ergebnis nach Addition ganzer Wochen immer auf denselben Wochentag?', answer: 'Ja, da eine Woche genau 7 Tage hat, fällt das Zieldatum bei der Addition voller Wochen ausnahmslos auf denselben Wochentag wie das Ausgangsdatum.' }
    ]
  },
  'zeitdifferenz-rechner': {
    intro: 'Die Ermittlung der Zeitdifferenz zwischen zwei Uhrzeiten ist unverzichtbar für Stundenzettel, Gleitzeitkonten, Schichtpläne und Reisezeiten.',
    details: 'Liegt die Endzeit numerisch vor der Anfangszeit, hat ein Tageswechsel stattgefunden: In diesem Fall werden zur Endzeit 24 Stunden hinzuaddiert, bevor die Startzeit abgezogen wird.',
    faqs: [
      { question: 'Wie wird ein Schichtdienst über Mitternacht berechnet?', answer: 'Beginnt eine Schicht um 22:00 Uhr und endet um 06:00 Uhr morgens, rechnet man (06:00 + 24:00) - 22:00 = 30:00 - 22:00 = 8 Stunden Arbeitsdauer.' },
      { question: 'Wie wandelt man Minuten in Dezimalstunden für die Lohnabrechnung um?', answer: 'Teilen Sie die Minutenzahl durch 60: 15 Minuten entsprechen 0,25 Stunden, 30 Minuten 0,5 Stunden und 45 Minuten 0,75 Stunden.' }
    ]
  },
  stundenrechner: {
    intro: 'Dieser Zeiterfassungsrechner addiert und subtrahiert Arbeitsstunden und Minuten über mehrere Tage für die Erstellung lückenloser Stundennachweise.',
    details: 'Summiert Bruttozeiten, zieht Pausenblöcke ab und weist das Endergebnis in Stunden und Minuten (hh:mm) sowie als Dezimalstunde (Industrieminute) aus.',
    faqs: [
      { question: 'Wie rechnet man 7 Stunden und 45 Minuten in Dezimalstunden um?', answer: '7 + (45 / 60) = 7 + 0,75 = 7,75 Dezimalstunden.' },
      { question: 'Ist die Erfassung der Arbeitszeit in Deutschland gesetzlich verpflichtend?', answer: 'Ja, nach dem BAG-Urteil von 2022 (Az. 1 ABR 22/21) und dem EuGH-Urteil sind Arbeitgeber in Deutschland verpflichtet, ein verlässliches System zur Erfassung der täglichen Arbeitszeit einzurichten.' }
    ]
  },
  'countdown-rechner': {
    intro: 'Dieser Countdown-Timer misst die verbleibende Restzeit bis zu einem festen Stichtag sekundengenau herunter.',
    details: 'Rechnet die Zeitdifferenz in Tage, Stunden, Minuten und Sekunden um. Nützlich für Produkt-Launches, Neujahr, Jubiläen oder Projekt-Deadlines.',
    faqs: [
      { question: 'Wie viele Sekunden hat ein Tag?', answer: 'Ein regulärer Kalendertag hat exakt 24 × 60 × 60 = 86.400 Sekunden.' },
      { question: 'Was passiert mit dem Countdown bei Zeitumstellung?', answer: 'Bei Zeitstempeln mit lokaler Zeitzone verschiebt sich die Stundendifferenz am Tag der Zeitumstellung um genau 1 Stunde.' }
    ]
  },
  'renteneintritt-rechner': {
    intro: 'Die Feststellung des regulären Renteneintrittsalters nach dem Sechsten Buch Sozialgesetzbuch (SGB VI) richtet sich präzise nach dem Geburtsjahrgang des Versicherten.',
    details: 'Nach § 35 und § 235 SGB VI wird die Regelaltersgrenze für Versicherte der Geburtsjahrgänge 1947 bis 1963 schrittweise von 65 auf 67 Jahre angehoben. Für alle ab dem 1. Januar 1964 Geborenen gilt ausnahmslos das vollendete 67. Lebensjahr.',
    faqs: [
      { question: 'Wann kann man abschlagsfrei vor der Regelaltersgrenze in Rente gehen?', answer: 'Als besonders langjährig Versicherter mit mindestens 45 Beitragsjahren kann man bis zu zwei Jahre vor der Regelaltersgrenze ohne Rentenabschläge in den Ruhestand treten.' },
      { question: 'Wie hoch ist der Rentenabschlag bei vorzeitigem Rentenbeginn?', answer: 'Der Abschlag beträgt 0,3 Prozent für jeden Monat, den die Rente vor Erreichen der persönlichen Regelaltersgrenze in Anspruch genommen wird (max. 14,4 % bei 4 Jahren früher).' }
    ]
  },
  'dienstjubilaeum-rechner': {
    intro: 'Dieser Jubiläumsrechner ermittelt die exakten Stichtage für 10-, 25-, 40- und 50-jährige Dienst- und Firmenjubiläen im Arbeitsverhältnis.',
    details: 'Nach deutschem Tarifrecht (z. B. TVöD § 23) wird die Dienstzeit ab dem offiziellen Tag des Diensteintritts berechnet. Unterbrechungen (wie Elternzeit oder Sonderurlaub) können je nach Tarifvertrag ausgenommen sein.',
    faqs: [
      { question: 'Welche Jubiläumszuwendungen sind im öffentlichen Dienst tariflich vorgesehen?', answer: 'Nach dem TVöD erhalten Beschäftigte bei Vollendung einer 25-jährigen Dienstzeit ein Jubiläumsgeld von 350 Euro, bei 40 Jahren 500 Euro sowie einen freien Tag.' },
      { question: 'Zählt die Ausbildungszeit zur Dienstzeit für das Jubiläum?', answer: 'Im öffentlichen Dienst zählt die Ausbildung beim selben Dienstherrn voll zur Dienstzeit; in der Privatwirtschaft hängt dies von der jeweiligen Betriebsvereinbarung ab.' }
    ]
  }
};
