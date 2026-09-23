import { CalcContent } from './types';

export const KREDIT_CONTENT: Record<string, CalcContent> = {
  kreditrechner: {
    intro: 'Die Monatsrate eines klassischen Kredits setzt sich aus Tilgung und Zinsen zusammen. Da mit jeder Tilgung die Restschuld sinkt, sinkt auch der Zinsanteil, während der Tilgungsanteil steigt.',
    details: 'Nach der Preisangabenverordnung (PAngV) ist stets der Effektivzinssatz für den Kostenvergleich heranzuziehen. Längere Laufzeiten senken die monatliche Rate, erhöhen jedoch die über die Gesamtlaufzeit gezahlten Zinsen deutlich.',
    faqs: [
      { question: 'Was ist das Annuitätenprinzip?', answer: 'Bei einem Annuitätendarlehen bleibt die monatliche Gesamtüberweisung (Rate) über die gesamte Zinsbindungsfrist hinweg konstant, während sich die Anteile von Zins und Tilgung Monat für Monat verschieben.' },
      { question: 'Kann ein Konsumentenkredit jederzeit vorzeitig getilgt werden?', answer: 'Ja, nach § 500 Abs. 2 BGB haben Verbraucher das Recht, Verbraucherdarlehen jederzeit ganz oder teilweise vorzeitig zurückzuzahlen.' }
    ]
  },
  ratenkreditrechner: {
    intro: 'Der Ratenkredit ist die gebräuchlichste Finanzierungsform für Anschaffungen wie Möbel, Elektronik oder unvorhergesehene Reparaturen mit fester monatlicher Belastung.',
    details: 'Typische Nettodarlehensbeträge liegen zwischen 1.000 € und 50.000 € bei Laufzeiten von 12 bis 84 Monaten. Vorsicht ist bei freiwilligen Restschuldversicherungen (RSV) geboten, da diese die Gesamtkosten spürbar in die Höhe treiben.',
    faqs: [
      { question: 'Ist eine Restschuldversicherung (RSV) gesetzlich vorgeschrieben?', answer: 'Nein, der Abschluss einer Restkreditversicherung ist vollkommen freiwillig und darf von der Bank nicht zur Bedingung für eine Kreditvergabe gemacht werden.' },
      { question: 'Wie beeinflusst die Schufa den Kreditzins?', answer: 'Bei bonitätsabhängigen Zinsen erhalten Kreditnehmer mit hohem Schufa-Score (wenig Ausfallrisiko) den günstigsten Zinssatz, während schwächere Bonität zu höheren Zinssätzen führt.' }
    ]
  },
  autokreditrechner: {
    intro: 'Ein zweckgebundener Standard-Autokredit bietet im Vergleich zum freien Ratenkredit oft Zinsvorteile, da das finanzierte Fahrzeug der Bank als Kreditsicherheit dient.',
    details: 'Der Kredit finanziert den Kaufpreis abzüglich einer optionalen Anzahlung gleichmäßig über 24 bis 84 Monate ab. Am Ende der Vertragslaufzeit ist das Fahrzeug vollständig schuldenfrei in Ihrem Besitz.',
    faqs: [
      { question: 'Was ist der Vorteil eines unabhängigen Autokredits gegenüber der Händlerfinanzierung?', answer: 'Mit einer Kreditzusage einer unabhängigen Bank treten Sie beim Händler als Barzahler auf und können oft 5 bis 15 Prozent Barzahler-Rabatt auf den Fahrzeugpreis aushandeln.' },
      { question: 'Muss die Zulassungsbescheinigung Teil II (Kfz-Brief) bei der Bank hinterlegt werden?', answer: 'Viele klassische Autobanken verlangen die Hinterlegung des Kfz-Briefs; moderne Direktbanken verzichten zunehmend darauf und verlangen lediglich die Kopie des Kaufvertrags.' }
    ]
  },
  tilgungsrechner: {
    intro: 'Die anfängliche Tilgung (üblich sind 1,5 bis 3 Prozent) bestimmt bei der Baufinanzierung maßgeblich die Gesamtlaufzeit und die verbleibende Restschuld nach Ende der Sollzinsbindung.',
    details: 'Monatliche Rate = Darlehensbetrag · (Sollzins + Anfangstilgung) / 1200. Bei niedrigem Zinsniveau dauert die Entschuldung bei geringer Tilgung unverhältnismäßig lange, weshalb Tilgungsraten von mindestens 2–3 % ratsam sind.',
    faqs: [
      { question: 'Warum sollte die Tilgungsrate bei niedrigen Zinsen höher gewählt werden?', answer: 'Weil die Zinsersparnis pro Monat geringer ist und der Tilgungsanteil dadurch langsamer wächst. Bei 1 % Zins und 1 % Tilgung würde die Rückzahlung über 60 Jahre dauern.' },
      { question: 'Gibt es ein gesetzliches Sonderkündigungsrecht nach 10 Jahren?', answer: 'Ja, nach § 489 Abs. 1 Nr. 2 BGB kann jedes Festzinsdarlehen nach Ablauf von 10 Jahren nach vollständiger Auszahlung mit einer Frist von 6 Monaten ohne Vorfälligkeitsentschädigung gekündigt werden.' }
    ]
  },
  sondertilgungsrechner: {
    intro: 'Sondertilgungen sind zusätzliche, außerplanmäßige Rückzahlungen, die direkt von der verbleibenden Restschuld abgezogen werden und die Zinslast massiv reduzieren.',
    details: 'Bereits eine einmalige Sondertilgung von 5.000 € zu Beginn eines Darlehens kann über eine 15-jährige Laufzeit Zinskosten im vierstelligen Bereich einsparen und die Entschuldung um viele Monate beschleunigen.',
    faqs: [
      { question: 'Wie viel Prozent Sondertilgung sind bei Baufinanzierungen üblich?', answer: 'Die meisten Kreditinstitute gewähren heute 5 Prozent der ursprünglichen Kreditsumme pro Kalenderjahr als kostenfreie Sondertilgungsoption.' },
      { question: 'Verringert eine Sondertilgung die Monatsrate oder die Laufzeit?', answer: 'Bei klassischen Annuitätendarlehen bleibt die vertragliche Monatsrate konstant, wodurch sich die Restschuld am Ende der Zinsbindung drastisch reduziert und die Gesamtlaufzeit verkürzt.' }
    ]
  },
  'restschuld-rechner': {
    intro: 'Dieser Rechner prognostiziert die verbleibende Restschuld eines Kredits nach Ablauf einer festgelegten Zinsbindungsfrist (z. B. nach 10 oder 15 Jahren).',
    details: 'Die Restschuld ist der Betrag, für den zum Fristende eine Anschlussfinanzierung (Prolongation, Umschuldung oder Forward-Darlehen) abgeschlossen werden muss.',
    faqs: [
      { question: 'Was geschieht mit der Restschuld am Ende der Zinsbindung?', answer: 'Die finanzierende Bank unterbreitet ein Angebot zur Verlängerung (Prolongation); alternativ kann der Betrag auf eine günstigere Fremdbank umgeschuldet oder bar getilgt werden.' },
      { question: 'Welches Risiko birgt eine hohe Restschuld?', answer: 'Das Zinsänderungsrisiko: Liegen die Marktzinsen am Ende der Zinsbindung höher als bei Abschluss, steigt die künftige Monatsbelastung für die Anschlussfinanzierung spürbar.' }
    ]
  },
  'baufinanzierung-rechner': {
    intro: 'Der Baufinanzierungsrechner ermittelt die monatliche Darlehensrate, Zinskosten und den Zins- und Tilgungsverlauf für Immobilienkauf oder Hausbau.',
    details: 'Neben dem Kaufpreis müssen Kaufnebenkosten (Grunderwerbsteuer je nach Bundesland 3,5–6,5 %, Notar- und Grundbuchkosten ca. 1,5–2 %, Maklerprovision bis 3,57 %) durch Eigenkapital abgedeckt werden.',
    faqs: [
      { question: 'Wie viel Eigenkapital sollte man in eine Baufinanzierung einbringen?', answer: 'Banken empfehlen, mindestens die Kaufnebenkosten (ca. 10 bis 15 Prozent des Kaufpreises) sowie idealerweise weitere 10 bis 20 Prozent als Eigenkapital mitzubringen.' },
      { question: 'Welche Zinsbindung ist bei Baufinanzierungen ratsam?', answer: 'In Niedrigzinsphasen empfiehlt sich eine lange Zinsbindung von 15 bis 20 Jahren zur Planungssicherheit; bei hohen Zinsen bieten 10-jährige Laufzeiten mehr Flexibilität.' }
    ]
  },
  'autokredit-rechner': {
    intro: 'Die Ballonfinanzierung (Schlussratenfinanzierung) kombiniert niedrige monatliche Raten während der Vertragslaufzeit mit einer vorab vereinbarten, hohen Schlussrate.',
    details: 'Da die hohe Schlussrate während der gesamten Laufzeit mitverzinst werden muss, liegen die kumulierten Gesamtzinskosten einer Ballonfinanzierung spürbar über denen eines Standardkredits.',
    faqs: [
      { question: 'Was passiert, wenn der Fahrzeugwert am Ende unter der Schlussrate liegt?', answer: 'Reicht der Verkaufserlös des Autos nicht zur Begleichung der Schlussrate aus, muss die Differenz aus eigenen Mitteln beglichen oder per Ratenkredit weiterfinanziert werden.' },
      { question: 'Für wen ist ein Autokredit mit Schlussrate sinnvoll?', answer: 'Für Personen, die während der Laufzeit geringe monatliche Belastungen wünschen und sicher wissen, dass zum Laufzeitende eine größere Summe (z. B. aus Fälligkeit einer Anlage) bereitsteht.' }
    ]
  },
  'umschuldung-rechner': {
    intro: 'Eine Umschuldung löst bestehende, teure Kredite oder den Dispositionskredit durch ein neues Darlehen mit spürbar günstigeren Konditionen ab.',
    details: 'Der Rechner vergleicht die verbleibenden Restzinsen des Altkredits mit den Zinskosten des Neukredits abzüglich eventuell anfallender Vorfälligkeitsentschädigungen (§ 502 BGB).',
    faqs: [
      { question: 'Wann lohnt sich eine Kreditumschuldung besonders?', answer: 'Besonders bei älteren Ratenkrediten mit hohen Zinssätzen, bei der Zusammenfassung mehrerer kleiner Kredite zu einer übersichtlichen Rate oder bei dauerhafter Nutzung des teuren Girokontodispos.' },
      { question: 'Fallen bei der Ablösung von Ratenkrediten Kosten an?', answer: 'Die Bank darf nach § 502 BGB maximal 1 Prozent der vorzeitig zurückgezahlten Restsumme (bei Restlaufzeit unter einem Jahr maximal 0,5 Prozent) als Vorfälligkeitsentschädigung verlangen.' }
    ]
  },
  'dispozins-rechner': {
    intro: 'Der Dispositionskredit (Dispo) auf dem Girokonto ist flexibel, gehört mit durchschnittlich 10 bis 14 Prozent Effektivzins jedoch zu den teuersten Kreditformen in Deutschland.',
    details: 'Dispozinsen werden taggenau auf den beanspruchten Überziehungsbetrag berechnet: Zinsen = Überziehungsbetrag · (Dispozinssatz / 100) · (Tage / 360).',
    faqs: [
      { question: 'Was ist der Unterschied zwischen Dispo- und Überziehungszins?', answer: 'Der Dispozinssatz gilt innerhalb des vereinbarten Rahmens (z. B. bis 3 Monatsgehälter). Wird dieser Rahmen noch weiter überzogen (geduldete Überziehung), verlangen Banken oft zusätzliche Strafzinsen.' },
      { question: 'Ab wann sollte ein Dispositionskredit umgeschuldet werden?', answer: 'Sobald das Konto länger als zwei bis drei Monate im Minus verharrt, ist ein günstiger Ratenkredit rechnerisch fast immer die wirtschaftlichere Wahl.' }
    ]
  },
  'maximaler-kredit-rechner': {
    intro: 'Dieser Budgetrechner ermittelt anhand Ihrer monatlichen Haushaltsrechnung (Nettoeinkommen abzüglich Lebenshaltungskosten und Pauschalen), welchen Kreditbetrag Sie maximal stemmen können.',
    details: 'Banken setzen bei der Haushaltsrechnung Pauschalen für Lebenshaltung (ca. 800–1.200 € für die erste Person, ca. 300–400 € je weitere Person) an. Die tragbare Rate sollte höchstens 35–40 % des Haushaltsnettoeinkommens betragen.',
    faqs: [
      { question: 'Welche Ausgaben fließen in die Haushaltsrechnung der Bank ein?', answer: 'Kranken- und Sachversicherungen, PKW-Kostenpauschalen, Unterhaltsverpflichtungen, bestehende Kredite sowie pauschale Lebenshaltungskosten.' },
      { question: 'Werden Mieteinnahmen oder Boni voll als Einkommen anerkannt?', answer: 'Mieteinnahmen werden meist mit einem Sicherheitsabschlag von 15 bis 25 Prozent angesetzt; unregelmäßige Boni und Überstundenvergütungen werden oft nur teilweise gewertet.' }
    ]
  },
  'zinsbindung-rechner': {
    intro: 'Dieser Zinsbindungsvergleich stellt die Vor- und Nachteile von 5-, 10-, 15- oder 20-jährigen Zinsbindungen gegenüber.',
    details: 'Längere Zinsbindungen verlangen von der Bank einen Zinsaufschlag (Liquiditäts- und Risikoprämie), bieten dem Kreditnehmer dafür aber absolute Zinssicherheit vor steigenden Marktzinsen.',
    faqs: [
      { question: 'Wann sollte man eine 10-jährige und wann eine 20-jährige Zinsbindung wählen?', answer: 'Bei historisch niedrigen Zinsen und knappem Budget ist eine lange Zinsbindung (15–20 Jahre) sicherer. Bei hohen Zinsen lohnt sich eine 10-jährige Frist, um später günstig umschulden zu können.' },
      { question: 'Gilt das Kündigungsrecht nach § 489 BGB auch bei 20-jähriger Bindung?', answer: 'Ja, Darlehensnehmer können auch einen 20-Jahres-Kredit nach 10 Jahren mit einer 6-monatigen Frist kostenfrei kündigen – die Bank hingegen bleibt die vollen 20 Jahre an den Zinssatz gebunden.' }
    ]
  },
  'volltilger-darlehen-rechner': {
    intro: 'Ein Volltilgerdarlehen ist so konzipiert, dass die Kreditsumme bis zum Ende der vertraglich vereinbarten Zinsbindung auf exakt null Euro getilgt wird.',
    details: 'Da keine Restschuld verbleibt, entfällt jedes Zinsänderungsrisiko für eine Anschlussfinanzierung. Dafür verlangt das Volltilgerdarlehen eine überdurchschnittlich hohe monatliche Tilgungsleistung.',
    faqs: [
      { question: 'Welche Vorteile bieten Banken für Volltilgerdarlehen?', answer: 'Weil für die Bank das Ausfallrisiko am Laufzeitende entfällt, gewähren viele Kreditinstitute Zinsrabatte von 0,1 bis 0,3 Prozentpunkten auf den regulären Sollzins.' },
      { question: 'Gibt es Nachteile bei einem Volltilgerdarlehen?', answer: 'Die monatliche Belastung ist starr und hoch; vorzeitige Sondertilgungen sind vertraglich oft eingeschränkt oder ausgeschlossen.' }
    ]
  },
  'modernisierungskredit-rechner': {
    intro: 'Modernisierungs- und Sanierungskredite finanzieren energetische Maßnahmen (Wärmepumpe, Fenster, Dämmung, PV-Anlage) oder Renovierungen an Bestandsimmobilien.',
    details: 'Kredite bis 50.000 € werden von vielen Banken als sogenannte Blankodarlehen ohne teure Grundbucheintragung vergeben. Zudem können staatliche Förderungen der KfW oder des BAFA kombiniert werden.',
    faqs: [
      { question: 'Was ist der Unterschied zwischen Modernisierungskredit und freiem Ratenkredit?', answer: 'Durch den wohnwirtschaftlichen Verwendungsnachweis bieten Modernisierungskredite deutlich günstigere Zinssätze als herkömmliche Ratenkredite zur freien Verfügung.' },
      { question: 'Welche KfW-Programme unterstützen energetische Sanierungen?', answer: 'Insbesondere das Programm KfW 261 (Wohngebäude-Kredit) mit zinsgünstigen Krediten und hohen Tilgungszuschüssen für Effizienzhäuser.' }
    ]
  },
  'kreditvergleich-rechner': {
    intro: 'Dieser Vergleichsrechner analysiert zwei konkurrierende Kreditangebote auf Zinsunterschiede, monatliche Ratenhöhe und die über die Laufzeit anfallenden Gesamtkosten.',
    details: 'Bereits ein minimaler Unterschied von 0,25 Prozentpunkten beim effektiven Jahreszins summiert sich bei einer Baufinanzierung über 300.000 € auf viele tausend Euro Mehrkosten.',
    faqs: [
      { question: 'Warum ist der Effektivzins wichtiger als der gebundene Sollzins?', answer: 'Der Sollzins beziffert nur die Netto-Verzinsung; erst der Effektivzins nach PAngV enthält Verrechnungsfristen und Nebenkosten und ermöglicht so einen echten Marktvergleich.' },
      { question: 'Sollte man zwei Kredite mit unterschiedlicher Laufzeit vergleichen?', answer: 'Vergleichen Sie vorrangig Angebote mit identischer Laufzeit und Zinsbindung, um eine verzerrungsfreie Entscheidungsgrundlage zu erhalten.' }
    ]
  },
  'gesamtzinsbelastung-rechner': {
    intro: 'Dieser Rechner summiert alle über die gesamte Kreditlaufzeit anfallenden Zinszahlungen und stellt sie dem geliehenen Nettodarlehensbetrag gegenüber.',
    details: 'Zinsbelastung = (Monatsrate · Monate) - Kreditsumme. Bei langen Laufzeiten oder geringer Tilgung kann die kumulierte Zinslast die ursprüngliche Kreditsumme erreichen oder sogar übersteigen.',
    faqs: [
      { question: 'Wie kann man die Gesamtzinsbelastung am wirksamsten senken?', answer: 'Durch eine Erhöhung der anfänglichen Tilgung, die Vereinbarung von kostenfreien Sondertilgungsrechten und die Wahl einer möglichst kurzen realistischen Gesamtlaufzeit.' },
      { question: 'Zählt die Zinsbelastung bei vermieteten Immobilien als Werbungskosten?', answer: 'Ja, Kreditzinsen für fremdvermietete Immobilien können in voller Höhe steuerlich als Werbungskosten bei den Einkünften aus Vermietung und Verpachtung geltend gemacht werden.' }
    ]
  },
  'vorfaelligkeitsentschaedigung-rechner': {
    intro: 'Kündigen Verbraucher einen Ratenkredit vorzeitig oder leisten eine Gesamttilgung, darf die Bank nach § 502 BGB einen pauschalierten Zinsschaden verlangen.',
    details: 'Beträgt die Restlaufzeit mehr als 12 Monate, ist die Entschädigung gesetzlich auf höchstens 1,0 Prozent des vorzeitig getilgten Betrags gedeckelt; bei Restlaufzeiten von 12 Monaten oder weniger auf 0,5 Prozent.',
    faqs: [
      { question: 'Gilt die 1-Prozent-Grenze auch bei vorzeitiger Kündigung von Baufinanzierungen?', answer: 'Nein, für Immobiliendarlehen gilt § 502 BGB nicht in dieser Pauschalform; dort darf die Bank den tatsächlichen Zinsschaden nach der BGH-Aktiv-Passiv-Methode abrechnen.' },
      { question: 'Muss die Bank vertragliche Sondertilgungsrechte berücksichtigen?', answer: 'Ja, nach ständiger BGH-Rechtsprechung müssen vereinbarte, noch nicht genutzte Sondertilgungen schadensmindernd in die Entschädigungsberechnung einfließen.' }
    ]
  },
  'schuldentilgungsdauer-rechner': {
    intro: 'Dieser Entschuldungsrechner ermittelt die verbleibende Zeitdauer in Jahren und Monaten, bis bestehende Verbindlichkeiten bei einer festgelegten Monatsrate vollständig getilgt sind.',
    details: 'Formel: Laufzeit n = -ln(1 - (Kreditsumme · Monatszins) / Rate) / ln(1 + Monatszins). Reicht die gewählte Monatsrate nicht einmal zur Deckung der Zinsen aus, tritt eine theoretisch unendliche Verschuldung ein.',
    faqs: [
      { question: 'Was ist die Mindestrate zur Vermeidung einer Zinsfalle?', answer: 'Die Monatsrate muss zwingend höher sein als die monatlich auflaufenden Zinsen (Kreditsumme × Jahreszins / 12), da der Schuldenstand andernfalls Monat für Monat anwächst.' },
      { question: 'Welche Methode empfiehlt sich bei mehreren Krediten (Schneeball vs. Lawine)?', answer: 'Die Lawinen-Methode tilgt zuerst den Kredit mit dem höchsten Zinssatz (finanziell optimal); die Schneeball-Methode tilgt zuerst den kleinsten Betrag (schnelle psychologische Erfolge).' }
    ]
  },
  'forward-darlehen-rechner': {
    intro: 'Ein Forward-Darlehen sichert das aktuelle Zinsniveau für eine künftige Anschlussfinanzierung bis zu 36 bis 60 Monate im Voraus ab.',
    details: 'Für jeden Monat Vorlaufzeit (Forward-Periode) verlangen Banken einen Forward-Aufschlag auf den aktuellen Marktzins (typischerweise 0,01 bis 0,03 Prozentpunkte pro Monat Vorlauf).',
    faqs: [
      { question: 'Wann lohnt sich der Abschluss eines Forward-Darlehens?', answer: 'Wenn Sie mit spürbar steigenden Zinsen bis zum Ende Ihrer aktuellen Zinsbindung rechnen und das Risiko höherer Monatsraten verbindlich ausschließen möchten.' },
      { question: 'Ist ein Forward-Darlehen bindend?', answer: 'Ja, ein Forward-Darlehen ist ein verbindlicher Darlehensvertrag. Sinken die Zinsen unerwartet weiter, muss der Vertrag dennoch zu den vereinbarten Konditionen abgenommen werden (Nichtabnahmeentschädigung).' }
    ]
  },
  'kreditlaufzeit-rechner': {
    intro: 'Der Kreditlaufzeitrechner kalkuliert die genaue Monats- und Jahresanzahl zur vollständigen Tilgung eines Kredits bei vorgegebener Wunschrate.',
    details: 'Durch die Variation der Monatsrate lässt sich der exakte Zeitpunkt der vollständigen Entschuldung interaktiv planen.',
    faqs: [
      { question: 'Wie wirkt sich eine Erhöhung der Monatsrate um 50 € aus?', answer: 'Bei einem 20.000-€-Kredit zu 6 % Zinsen verkürzt eine Erhöhung der Rate von 300 € auf 350 € die Gesamtlaufzeit um mehr als 14 Monate und spart hunderte Euro Zinsen.' },
      { question: 'Welche Laufzeit ist für Konsumentenkredite wirtschaftlich sinnvoll?', answer: 'Die Laufzeit sollte die Lebensdauer des finanzierten Konsumguts keinesfalls überschreiten (z. B. Smartphone maximal 24 Monate, Auto maximal 60 Monate).' }
    ]
  },
  'kredit-restschuld-stichtag-rechner': {
    intro: 'Dieser Stichtagsrechner beziffert die exakte verbleibende Kreditschuld zu einem ganz bestimmten Kalenderdatum in der Zukunft.',
    details: 'Wichtig für Steuererklärungen, Vermögensaufstellungen, Scheidungsvereinbarungen oder Verhandlungen über vorzeitige Sondertilgungen.',
    faqs: [
      { question: 'Wie berechnet man den Zins- und Tilgungsanteil zu einem bestimmten Monat?', answer: 'Der Monatszins errechnet sich aus der Restschuld des Vormonats mal Monatszinssatz; die Differenz zur vereinbarten festen Monatsrate ist die Tilgung dieses Monats.' },
      { question: 'Woher erhält man den offiziellen Restschuldsaldo für das Finanzamt?', answer: 'Banken versenden zu Jahresbeginn eine gesetzlich vorgeschriebene Jahresbescheinigung mit dem Restschuldsaldo zum 31. Dezember des Vorjahres.' }
    ]
  },
  'kreditrechner-ohne-eigenkapital': {
    intro: 'Eine 100%- oder 110%-Baufinanzierung (Vollfinanzierung) finanziert den vollen Kaufpreis oder zusätzlich auch alle Kaufnebenkosten ohne Eigenkapitaleinsatz.',
    details: 'Wegen des erhöhten Ausfallrisikos für die Bank (Kreditsumme übersteigt den Beleihungswert der Immobilie) verlangen Kreditinstitute deutliche Zinsaufschläge von oft 0,5 bis 1,5 Prozentpunkten.',
    faqs: [
      { question: 'Welche Voraussetzungen müssen für eine 110%-Finanzierung erfüllt sein?', answer: 'Ein überdurchschnittlich hohes, unbefristetes Einkommen, ein einwandfreier Schufa-Score sowie eine Immobilie in sehr guter Lage mit stabiler Werterwartung.' },
      { question: 'Was ist das größte Risiko einer Vollfinanzierung?', answer: 'Die Gefahr einer Überschuldung bei vorzeitigem Verkauf: Sinkt der Immobilienwert leicht, reicht der Verkaufserlös nicht aus, um das Darlehen vollständig abzulösen.' }
    ]
  },
  'effektivzins-kredit-rechner': {
    intro: 'Der effektive Jahreszins nach der Preisangabenverordnung (PAngV) fasst Sollzins, Auszahlungskurs, Zinsverrechnungstermine und Bearbeitungskosten in einer einheitlichen Vergleichskennzahl zusammen.',
    details: 'Nach europäischem Recht ermittelt die mathematische Annäherungsformel den internen Zinsfuß (Internal Rate of Return), der die Zahlungsströme exakt auf den Nettodarlehensbetrag abzinst.',
    faqs: [
      { question: 'Dürfen Banken Bearbeitungsgebühren in den Kredit einrechnen?', answer: 'Nein, nach ständiger Rechtsprechung des Bundesgerichtshofs (BGH, Az. XI ZR 170/13) sind gesonderte laufzeitunabhängige Bearbeitungsentgelte bei Verbraucherkrediten unzulässig.' },
      { question: 'Warum weicht der Effektivzins vom Sollzins ab?', answer: 'Weil Zinsen meist monatlich nachschüssig verrechnet werden (unterjährige Zinsverrechnung) und eventuelle Nebenkosten oder Disagios eingerechnet werden.' }
    ]
  },
  'privatkredit-rechner': {
    intro: 'Ein privater Darlehensvertrag zwischen Verwandten, Freunden oder Geschäftspartnern schafft rechtliche Klarheit bei Zinsen, Rückzahlung und Fälligkeiten.',
    details: 'Aus steuerlicher Sicht (§ 7 Abs. 1 Nr. 1 ErbStG) kann ein zinsloses oder extrem niedrig verzinstes Darlehen vom Finanzamt als steuerpflichtige Schenkung gewertet werden, wenn es den marktüblichen Zinssatz unterschreitet.',
    faqs: [
      { question: 'Welcher Mindestzinssatz schützt bei Privatkrediten vor Schenkungsteuer?', answer: 'Die Finanzverwaltung verlangt nach § 15 BewG in der Regel eine Verzinsung von mindestens 5,5 Prozent p.a., wenn kein anderer marktüblicher Zins nachgewiesen wird.' },
      { question: 'Sollte ein Darlehen unter Verwandten schriftlich fixiert werden?', answer: 'Unbedingt: Ein schriftlicher Darlehensvertrag mit exakter Kreditsumme, Zinssatz, Tilgungsplan und Kündigungsmodalitäten verhindert familiäre Streitigkeiten und dient als Nachweis gegenüber dem Finanzamt.' }
    ]
  },
  'zwischenfinanzierung-rechner': {
    intro: 'Eine Zwischenfinanzierung überbrückt kurzfristige Liquiditätsengpässe beim Immobilienkauf, bis sichere Mittel (z. B. aus dem Verkauf der bisherigen Immobilie oder Zuteilung eines Bausparvertrags) bereitstehen.',
    details: 'Es handelt sich um ein endfälliges Darlehen: Während der Laufzeit (meist 6 bis 24 Monate) werden ausschließlich Zinsen gezahlt; die Tilgung erfolgt auf einen Schlag bei Fälligkeit der erwarteten Mittel.',
    faqs: [
      { question: 'Wie hoch sind die Zinsen bei einer Zwischenfinanzierung?', answer: 'Da Banken Zwischenkredite flexibel und kurzfristig bereitstellen, liegen die Zinssätze meist 1 bis 2 Prozentpunkte über den Konditionen langfristiger Festzinsdarlehen.' },
      { question: 'Kann eine Zwischenfinanzierung vorzeitig ohne Vorfälligkeitsentschädigung abgelöst werden?', answer: 'Ja, Zwischenfinanzierungen werden üblicherweise mit variabler Verzinsung oder flexibler Rückzahlungsoption vereinbart, sodass sie bei Geldeingang sofort getilgt werden können.' }
    ]
  }
};
