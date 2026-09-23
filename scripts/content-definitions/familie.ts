import { CalcContent } from './types';

export const FAMILIE_CONTENT: Record<string, CalcContent> = {
  'geburtstermin-rechner': {
    intro: 'Die erweiterte Naegele-Regel berechnet den voraussichtlichen Entbindungstermin (ET) ausgehend vom ersten Tag der letzten Periode und der individuellen Zyklusdauer.',
    details: 'Klassische Naegele-Formel: Erster Tag der letzten Periode + 7 Tage - 3 Monate + 1 Jahr. Weicht der Zyklus von 28 Tagen ab, wird die Differenz (Zykluslänge - 28) taggenau addiert oder subtrahiert. Nur ca. 4 Prozent aller Babys kommen exakt am errechneten Termin zur Welt.',
    faqs: [
      { question: 'Wie berechnet man den Termin bei bekanntem Empfängnisdatum (Zeugungstag)?', answer: 'Bei bekanntem Eisprung oder Inseminationstag rechnet man: Empfängnistag + 266 Tage (38 Wochen reale Tragzeit).' },
      { question: 'Ab wann gilt ein Baby medizinisch als termingerecht geboren?', answer: 'Alle Geburten zwischen der vollendeten 37. Schwangerschaftswoche (37+0 SSW) und der 42. Woche (41+6 SSW) gelten als voll ausgetragene Reifgeburten.' }
    ]
  },
  'fruchtbare-tage-rechner': {
    intro: 'Dieser Fruchtbarkeitskalender grenzt das fruchtbare Zeitfenster rund um den Eisprung (Ovulation) für den optimalen Empfängniszeitpunkt ein.',
    details: 'Männliche Samenzellen können im weiblichen Genitaltrakt bis zu 5 Tage überleben; die Eizelle ist nach dem Eisprung etwa 12 bis 24 Stunden befruchtungsfähig. Das hochfruchtbare Fenster umfasst somit ca. 6 Tage (5 Tage vor bis 1 Tag nach dem Eisprung).',
    faqs: [
      { question: 'Wann findet der Eisprung bei unregelmäßigem Zyklus statt?', answer: 'Der Eisprung findet biologisch recht stabil 14 Tage vor dem Einsetzen der nächsten Menstruation (Lutealphase) statt; variiert die Zykluslänge, verschiebt sich die Follikelphase vor dem Eisprung.' },
      { question: 'Welche Körpersymptome bestätigen die fruchtbaren Tage (NFP)?', answer: 'Spinnbarer, glasiger Zervixschleim, ein Anstieg der Basaltemperatur um ca. 0,2 °C nach dem Eisprung und ein weicher, leicht geöffneter Muttermund.' }
    ]
  },
  'elterngeld-basis-plus-rechner': {
    intro: 'Dieser Rechner vergleicht das Basiselterngeld mit dem ElterngeldPlus nach dem Bundeselterngeld- und Elternzeitgesetz (BEEG) zur optimalen Budget- und Monatsplanung.',
    details: 'Basiselterngeld ersetzt 65 Prozent des vorgeburtlichen Nettoeinkommens (max. 1.800 € / Monat, min. 300 €). ElterngeldPlus zahlt den halben Betrag über die doppelte Bezugsdauer und ermöglicht anrechnungsfreie Teilzeiteinkommen bis zur Kappungsgrenze.',
    faqs: [
      { question: 'Was ist der Partnerschaftsbonus beim Elterngeld?', answer: 'Arbeiten beide Elternteile gleichzeitig für 2 bis 4 aufeinanderfolgende Monate in Teilzeit (24 bis 32 Wochenstunden), erhält jeder Elternteil bis zu 4 zusätzliche ElterngeldPlus-Monate.' },
      { question: 'Welche Monate zählen für das Bemessungseinkommen vor der Geburt?', answer: 'Die letzten 12 Kalendermonate vor der Geburt (bei Angestellten vor dem Monat des Mutterschutzbeginns); Monate mit Elterngeldbezug für ältere Kinder können ausgeklammert werden.' }
    ]
  },
  'kindergeld-rechner-2026': {
    intro: 'Das gesetzliche Kindergeld nach § 66 EStG sichert die steuerliche Freistellung des sächlichen Existenzminimums eines Kindes für alle anspruchsberechtigten Eltern in Deutschland.',
    details: 'Das Kindergeld wird ab dem ersten Kind in einheitlicher Höhe pro Monat ausgezahlt. Es wird bis zum 18. Lebensjahr gezahlt, in der Erstausbildung oder im Studium bis zum vollendeten 25. Lebensjahr.',
    faqs: [
      { question: 'Was ist die Günstigerprüfung zwischen Kindergeld und Kinderfreibetrag?', answer: 'Das Finanzamt prüft in der Einkommensteuererklärung automatisch, ob das ausgezahlte Kindergeld oder der steuerliche Kinderfreibetrag für die Eltern zu einer geringeren Steuer führt.' },
      { question: 'Wann erlischt der Kindergeldanspruch bei Volljährigen?', answer: 'Mit Vollendung des 25. Lebensjahres; bei Arbeitslosigkeit des Kindes bereits mit dem 21. Lebensjahr; bei Kindern mit Behinderung (vor dem 25. Lebensjahr eingetreten) kann es lebenslang gezahlt werden.' }
    ]
  },
  'kinderzuschlag-kiz-rechner': {
    intro: 'Der Kinderzuschlag (KiZ nach § 6a BKGG) unterstützt Familien mit geringem Erwerbseinkommen, damit diese keinen Bürgergeld-Anspruch geltend machen müssen.',
    details: 'Voraussetzung: Die Eltern verfügen über ein Mindesteinkommen (900 € für Paare, 600 € für Alleinerziehende), das jedoch nicht für die gesamte Familie ausreicht. Der KiZ beträgt bis zu 292 € monatlich je Kind.',
    faqs: [
      { question: 'Welche Zusatzleistungen schaltet die Bewilligung des Kinderzuschlags frei?', answer: 'Automatische Befreiung von den Kita-Gebühren sowie Anspruch auf Leistungen für Bildung und Teilhabe (BuT: kostenloses Schulmittagessen, 195 € Schulbedarfspaket, Klassenfahrten).' },
      { question: 'Wo wird der Kinderzuschlag beantragt?', answer: 'Online bei der zuständigen Familienkasse der Bundesagentur für Arbeit über das Portal Arbeitsagentur.de.' }
    ]
  },
  'unterhaltsvorschuss-rechner': {
    intro: 'Der Unterhaltsvorschuss nach dem UVG springt ein, wenn der barunterhaltspflichtige Elternteil keinen oder unregelmäßigen Unterhalt für das Kind leistet.',
    details: 'Die Höhe richtet sich nach dem gesetzlichen Mindestunterhalt abzüglich des vollen Kindergeldes für ein erstes Kind und staffelt sich in drei Altersstufen (0–5 Jahre, 6–11 Jahre, 12–17 Jahre).',
    faqs: [
      { question: 'Bis zu welchem Alter wird Unterhaltsvorschuss gezahlt?', answer: 'Bis zum 18. Lebensjahr des Kindes; für Kinder von 12 bis 17 Jahren jedoch nur, wenn das Kind nicht auf Bürgergeld angewiesen ist oder der alleinerziehende Elternteil mind. 600 € brutto verdient.' },
      { question: 'Muss der säumige Elternteil den Unterhaltsvorschuss zurückzahlen?', answer: 'Ja, das Jugendamt nimmt den unterhaltspflichtigen Elternteil im Wege des Regresses in voller Höhe in Regress und fordert die verauslagten Gelder konsequent zurück.' }
    ]
  },
  'duesseldorfer-tabelle-rechner': {
    intro: 'Die Düsseldorfer Tabelle ist die bundesweit von allen Familiengerichten anerkannte Richtlinie zur Bemessung des Kindesunterhalts bei Trennung und Scheidung.',
    details: 'Der Unterhaltsbetrag bestimmt sich aus dem bereinigten Nettoeinkommen des Unterhaltspflichtigen (15 Einkommensgruppen) und dem Alter des Kindes (4 Altersstufen). Das hälftige Kindergeld wird bedarfsmindernd abgezogen.',
    faqs: [
      { question: 'Was ist der Selbstbehalt (Eigenbedarf) des Unterhaltspflichtigen?', answer: 'Der notwendige Eigenbedarf schützt das Existenzminimum des Barunterhaltspflichtigen: Er beträgt für erwerbstätige Unterhaltspflichtige gegenüber minderjährigen Kindern derzeit 1.450 € monatlich.' },
      { question: 'Wie wird das bereinigte Nettoeinkommen ermittelt?', answer: 'Vom Brutto werden Steuern, Sozialabgaben, berufsbedingte Aufwendungen (pauschal 5 % bis max. 150 €) und vorrangige berücksichtigungsfähige Verbindlichkeiten abgezogen.' }
    ]
  },
  'ehegattenunterhalt-trennungsunterhalt-rechner': {
    intro: 'Dieser Rechner kalkuliert den Anspruch auf Trennungsunterhalt (§ 1361 BGB) für das Trennungsjahr sowie den nachehelichen Unterhalt nach Rechtskraft der Scheidung.',
    details: 'Berechnung nach dem Halbteilungsgrundsatz (3/7- bzw. 45-%-Regel): Der bedürftige Partner erhält 45 Prozent der Differenz der bereinigten Erwerbseinkommen beider Eheleute (nach Erwerbstätigenbonus).',
    faqs: [
      { question: 'Kann auf Trennungsunterhalt vorab vertraglich verzichtet werden?', answer: 'Nein, nach § 1361 Abs. 4 Satz 4 BGB ist ein Verzicht auf Trennungsunterhalt für die Zukunft im Voraus absolut unwirksam, um Sozialhilfebedürftigkeit zu verhindern.' },
      { question: 'Wann entfällt der nacheheliche Unterhalt?', answer: 'Wenn der geschiedene Partner wieder heiratet (§ 1586 BGB), in einer verfestigten neuen Lebensgemeinschaft lebt (§ 1579 BGB) oder seinen Lebensbedarf aus eigenen Einkünften decken kann.' }
    ]
  },
  'schwangerschaftswoche-ssw-rechner': {
    intro: 'Dieser Schwangerschaftsrechner ermittelt die exakte Schwangerschaftswoche im Format SSW + Tage (z. B. 12+4) und ordnet sie dem jeweiligen Trimester zu.',
    details: 'Die Zählung beginnt rechnerisch am ersten Tag der letzten Periode (vor der eigentlichen Befruchtung). Eine Schwangerschaft dauert nominal 40 Schwangerschaftswochen (280 Tage bzw. 10 Mondmonate zu je 28 Tagen).',
    faqs: [
      { question: 'Was bedeutet die Angabe "13+2 SSW"?', answer: 'Es bedeutet, dass 13 volle Schwangerschaftswochen plus 2 Tage abgeschlossen sind; die Schwangere befindet sich somit in der 14. Schwangerschaftswoche.' },
      { question: 'Wann beginnt das zweite und das dritte Trimester?', answer: 'Das 1. Trimester umfasst SSW 1 bis 13; das 2. Trimester reicht von SSW 14 bis 27; das 3. Trimester beginnt mit SSW 28 und endet mit der Geburt.' }
    ]
  },
  'mutterschutzfristen-rechner': {
    intro: 'Die gesetzlichen Mutterschutzfristen nach dem Mutterschutzgesetz (MuSchG) schützen die Gesundheit von Mutter und Kind vor und nach der Entbindung.',
    details: 'Die Schutzfrist beginnt 6 Wochen vor dem errechneten Entbindungstermin und endet regulär 8 Wochen nach der Geburt (bei Früh- und Mehrlingsgeburten oder Behinderung des Kindes 12 Wochen nach der Geburt).',
    faqs: [
      { question: 'Darf eine Frau während der Schutzfrist vor der Entbindung arbeiten?', answer: 'Vor der Entbindung darf sie freiwillig arbeiten, wenn sie sich ausdrücklich dazu bereit erklärt (jederzeit widerrufbar); nach der Entbindung gilt ein absolutes Beschäftigungsverbot.' },
      { question: 'Was passiert mit der Schutzfrist, wenn das Baby später als errechnet zur Welt kommt?', answer: 'Die Schutzfrist vor der Entbindung verlängert sich automatisch bis zum tatsächlichen Geburtstermin; die 8-wöchige Schutzfrist nach der Geburt bleibt in voller Länge erhalten.' }
    ]
  },
  'zykluslaenge-eisprung-rechner': {
    intro: 'Dieser Menstruationsrechner analysiert die Schwankungen Ihrer Zykluslänge zur Bestimmung der fruchtbaren Phase und der voraussichtlichen nächsten Periode.',
    details: 'Ein regulärer Menstruationszyklus dauert 21 bis 35 Tage (Mittelwert: 28 Tage). Die zweite Zyklushälfte (Gelbkörperphase / Lutealphase) ist mit 12 bis 16 Tagen biologisch stabil; zeitliche Verschiebungen betreffen fast immer die Eireifungsphase.',
    faqs: [
      { question: 'Wie berechnet man die Zykluslänge exakt?', answer: 'Zählen Sie die Tage vom ersten Tag der Periodenblutung (Tag 1) bis zum letzten Tag vor dem Einsetzen der nächsten Blutung.' },
      { question: 'Ab welcher Schwankungsbreite gilt ein Zyklus als unregelmäßig?', answer: 'Schwankungen von bis zu 4 Tagen gelten als vollkommen normal; variiert die Zyklusdauer um mehr als 8 bis 10 Tage, empfiehlt sich eine gynäkologische Hormonabklärung.' }
    ]
  },
  'chinesischer-empfaengniskalender-rechner': {
    intro: 'Der traditionelle chinesische Empfängniskalender prognostiziert das Geschlecht des ungeborenen Kindes anhand des Mondalters der Mutter und des Empfängnismonats.',
    details: 'Die astrologische Berechnung basiert auf dem chinesischen Mondkalender: Das Mondalter der Mutter liegt oft 1 bis 2 Jahre über dem westlichen Kalenderalter. Wissenschaftlich betrachtet liegt die Trefferquote bei exakt den statistischen 50 Prozent.',
    faqs: [
      { question: 'Gibt es eine wissenschaftliche Bestätigung für den chinesischen Kalender?', answer: 'Nein, große epidemiologische Studien (u. a. in Schweden mit über 2,8 Millionen Geburten) konnten keinerlei statistische Korrelation nachweisen; das Geschlecht wird rein durch das X- oder Y-Chromosom des Spermiums bestimmt.' },
      { question: 'Ab welcher Schwangerschaftswoche lässt sich das Geschlecht im Ultraschall sicher erkennen?', answer: 'Ab etwa der 14. bis 16. Schwangerschaftswoche; nach § 15 GenDG darf der Arzt das Geschlecht den Eltern erst nach Ablauf der 12. Schwangerschaftswoche (14. SSW p.m.) offiziell mitteilen.' }
    ]
  },
  'kindes-endgroesse-rechner': {
    intro: 'Die Zielgrößenformel nach Tanner prognostiziert die statistische Erwachsenengröße eines Kindes auf Basis der biologischen Elterngrößen.',
    details: 'Jungen: [(Größe Vater + Größe Mutter + 13 cm) / 2] ± 5 cm. Mädchen: [(Größe Vater + Größe Mutter - 13 cm) / 2] ± 5 cm. Die Spanne von ± 5 cm deckt normale genetische Streuungen ab.',
    faqs: [
      { question: 'Welche Umweltfaktoren beeinflussen die Endgröße neben den Genen?', answer: 'Ausgewogene Ernährung (Protein, Kalzium, Zink, Vitamin D), ausreichender Schlaf (Wachstumshormon Somatotropin wird überwiegend im Tiefschlaf ausgeschüttet) und das Ausbleiben schwerer chronischer Krankheiten.' },
      { question: 'Wie lässt sich die Endgröße medizinisch exakter bestimmen?', answer: 'Über ein Röntgenbild der linken Handwurzelknochen: Ein Radiologe oder Endokrinologe beurteilt den Verknöcherungsgrad der Wachstumsfugen (Epiphysenfugen).' }
    ]
  },
  'kindersitz-groesse-i-size-rechner': {
    intro: 'Die europäische Kindersitznorm UN R129 (i-Size) teilt Autokindersitze nach der Körpergröße des Kindes in Zentimetern statt nach Gewicht ein.',
    details: 'Die Norm schreibt vor, dass Babys bis zum Alter von mindestens 15 Monaten und 76 cm zwingend rückwärtsgerichtet (Reboarder) transportiert werden müssen, um die empfindliche Halswirbelsäule bei einem Frontalaufprall optimal zu stützen.',
    faqs: [
      { question: 'Bis zu welchem Alter oder welcher Größe ist ein Kindersitz in Deutschland Pflicht?', answer: 'Nach § 21 Abs. 1a StVO müssen Kinder bis zum vollendeten 12. Lebensjahr oder bis zu einer Körpergröße von 150 cm in einem amtlich genehmigten Kindersitz gesichert werden.' },
      { question: 'Warum sind Reboarder-Sitze sicherer?', answer: 'Bei einem Frontalaufprall wird das Kind in die Sitzschale gedrückt; die Aufprallkräfte verteilen sich großflächig über den Rücken, statt den Kopf ungeschützt nach vorne zu schleudern.' }
    ]
  },
  'windelbudget-rechner': {
    intro: 'Dieser Budgetkalkulator ermittelt den Windelbedarf und die Gesamtkosten für Einwegwindeln über die gesamte Wickelzeit von Geburt bis zum Trockenwerden.',
    details: 'Ein Baby verbraucht in den ersten 3 Jahren im Schnitt rund 5.000 bis 6.000 Windeln. Die Kosten summieren sich bei Markenwindeln auf 1.200 bis 1.800 Euro; Stoffwindel-Systeme können die Kosten auf 400 bis 600 Euro senken.',
    faqs: [
      { question: 'Wie viele Windeln benötigt ein Neugeborenes pro Tag?', answer: 'In den ersten Lebenswochen werden durchschnittlich 7 bis 10 Windeln in 24 Stunden benötigt; ab dem 6. Monat sinkt der Bedarf auf ca. 4 bis 6 Windeln täglich.' },
      { question: 'Gibt es von manchen Gemeinden Zuschüsse für Windeln?', answer: 'Ja, viele Städte und Landkreise zahlen Familien einen Windelzuschuss oder geben kostenlose Müllsäcke (Windelsäcke) für die Windelentsorgung aus.' }
    ]
  },
  'erstausstattung-baby-rechner': {
    intro: 'Dieser Budgetplaner kalkuliert die Gesamtkosten für die Baby-Erstausstattung in den Bereichen Kinderwagen, Babyzimmer, Kleidung, Wickeln und Transport.',
    details: 'Eine solide Erstausstattung kostet im Neukauf zwischen 1.200 und 3.000 Euro. Durch gezielten Gebrauchtkauf (Second-Hand-Basare) lassen sich 50 bis 70 Prozent der Anschaffungskosten einsparen.',
    faqs: [
      { question: 'Welche Posten der Erstausstattung sind unverzichtbar?', answer: 'Babyschale fürs Auto (zwingend für die Entlassung aus der Klinik), Beistellbett, Schlafsack (keine Kissen oder Decken wegen SIDS-Risiko), Wickelauflage und Kleidung in Größe 50/56.' },
      { question: 'Gibt es staatliche Hilfen für die Baby-Erstausstattung?', answer: 'Schwangere mit geringem Einkommen oder Bürgergeld-Bezug können bei der Bundesstiftung Mutter und Kind oder beim Jobcenter nach § 24 SGB II einen Zuschuss zur Erstausstattung beantragen.' }
    ]
  },
  'kita-gebuehren-rechner': {
    intro: 'Die Elternbeiträge für Krippe, Kindergarten und Hort variieren in Deutschland extrem je nach Bundesland, Kommune und elterlichem Jahreseinkommen.',
    details: 'Einige Bundesländer (z. B. Berlin, Hamburg, Hessen teilweise) haben die Kita-Gebühren für Kinder ab 3 Jahren komplett abgeschafft; in anderen Kommunen staffeln sich die Beiträge nach Einkommen bis zu 600 € monatlich.',
    faqs: [
      { question: 'Sind Geschwisterkinder von Kita-Beiträgen befreit?', answer: 'In den allermeisten kommunalen Satzungen ist das zweite Kind beitragsermäßigt (meist 50 % Ersparnis) und das dritte Kind vollkommen gebührenfrei.' },
      { question: 'Kann man Kita-Kosten von der Steuer absetzen?', answer: 'Ja, nach § 10 Abs. 1 Nr. 5 EStG können zwei Drittel der reinen Betreuungskosten (ohne Verpflegung), maximal 4.000 € pro Kind und Jahr, als Sonderausgaben geltend gemacht werden.' }
    ]
  },
  'betreuungsgeld-familiengeld-rechner': {
    intro: 'Dieser Rechner ermittelt Landesfamilienleistungen wie das bayerische Familiengeld oder Landeserziehungsgelder nach Ablauf des regulären Elterngeldes.',
    details: 'Im Freistaat Bayern erhalten Eltern für jedes Kind im 2. und 3. Lebensjahr (vom 13. bis zum 36. Lebensmonat) 250 Euro monatlich (ab dem 3. Kind 300 Euro), unabhängig von Erwerbstätigkeit oder Betreuungsform.',
    faqs: [
      { question: 'Wird das bayerische Familiengeld auf das Bürgergeld angerechnet?', answer: 'Nein, nach ständiger Rechtsprechung und Landesgesetz ist das Familiengeld eine zweckgebundene Förderleistung und wird nicht bedarfsmindernd auf Bürgergeld angerechnet.' },
      { question: 'Gibt es das frühere Bundesbetreuungsgeld ("Herdprämie") noch?', answer: 'Nein, das bundesweite Betreuungsgeld wurde 2015 vom Bundesverfassungsgericht für verfassungswidrig erklärt, da dem Bund die Gesetzgebungskompetenz fehlte.' }
    ]
  },
  'taschengeld-empfehlung-rechner': {
    intro: 'Dieser Taschengeldrechner basiert auf den offiziellen Empfehlungen der Jugendämter und des Deutschen Jugendinstituts (DJI) nach Alter des Kindes.',
    details: 'Empfehlung: Bis zum 9. Lebensjahr wöchentliche Auszahlung (ca. 1,50 bis 3,50 €), ab dem 10. Lebensjahr monatliche Überweisung (ca. 16 bis 20 € mit 10 Jahren, bis zu 70 bis 85 € mit 17 Jahren).',
    faqs: [
      { question: 'Wofür sollte das reguläre Taschengeld verwendet werden?', answer: 'Für persönliche Freizeitwünsche (Süßigkeiten, Zeitschriften, Spielzeug); notwendige Schulsachen, Grundkleidung und Hauptmahlzeiten müssen zwingend die Eltern bezahlen.' },
      { question: 'Darf Taschengeld als Strafe gekürzt oder gestrichen werden?', answer: 'Pädagogen und Jugendämter raten dringend davon ab: Taschengeld ist ein pädagogisches Lernmittel für den Umgang mit Geld und sollte nicht als Erziehungsstrafe instrumentalisiert werden.' }
    ]
  },
  'schulbedarfspaket-bu-t-rechner': {
    intro: 'Das Schulbedarfspaket nach dem Bildungs- und Teilhabepaket (§ 28 Abs. 3 SGB II) unterstützt einkommensschwache Familien bei der Anschaffung von Schulmaterialien.',
    details: 'Für jedes schulpflichtige Kind wird eine jährliche Pauschale (195 Euro im Schuljahr) ausgezahlt: 130 Euro zum 1. August für das erste Schulhalbjahr und 65 Euro zum 1. Februar für das zweite Schulhalbjahr.',
    faqs: [
      { question: 'Wer hat Anspruch auf das Schulbedarfspaket?', answer: 'Kinder, deren Eltern Bürgergeld, Sozialhilfe, Kinderzuschlag (KiZ), Wohngeld oder Asylbewerberleistungen beziehen.' },
      { question: 'Muss man für das Schulbedarfspaket Kassenbons vorlegen?', answer: 'In der Regel nein, es handelt sich um eine zweckgebundene Pauschale; bei Kindern ab 15 Jahren verlangt das Amt jedoch eine aktuelle Schulbescheinigung.' }
    ]
  },
  'kinderkrankentage-kinderkrankengeld-rechner': {
    intro: 'Das Kinderkrankengeld nach § 45 SGB V gleicht den Verdienstausfall aus, wenn Eltern wegen der Pflege eines erkrankten Kindes nicht arbeiten können.',
    details: 'Die Krankenkasse zahlt in der Regel 90 Prozent des ausgefallenen Nettoarbeitsentgelts. Gesetzlich versicherten Eltern stehen pro Kind jährlich eine festgelegte Anzahl an Arbeitstagen zur Verfügung (Alleinstehende erhalten die doppelte Anzahl).',
    faqs: [
      { question: 'Bis zu welchem Alter des Kindes besteht Anspruch auf Kinderkrankengeld?', answer: 'Bis zum vollendeten 12. Lebensjahr des Kindes; für Kinder mit Behinderung, die auf Hilfe angewiesen sind, gilt die Altersgrenze nicht.' },
      { question: 'Benötigt man ab dem ersten Tag ein ärztliches Attest?', answer: 'Ja, für den Bezug von Kinderkrankengeld muss der Kinderarzt ab Tag 1 eine "Ärztliche Bescheinigung für den Bezug von Krankengeld bei Erkrankung eines Kindes" ausstellen.' }
    ]
  },
  'grosselternzeit-rechner': {
    intro: 'Dieser Ratgeber kalkuliert Möglichkeiten und Freistellungsansprüche von Großeltern zur Betreuung von Enkelkindern nach dem BEEG.',
    details: 'Großeltern können nach § 15 Abs. 1a BEEG Elternzeit beanspruchen, wenn ein Elternteil minderjährig ist oder sich in Ausbildung befindet und mit dem Kind im gemeinsamen Haushalt lebt.',
    faqs: [
      { question: 'Erhalten Großeltern während der Großelternzeit Elterngeld?', answer: 'Nein, ein Anspruch auf staatliches Elterngeld steht ausschließlich den leiblichen Eltern oder Adoptiveltern zu; die Freistellung für Großeltern ist unbezahlt.' },
      { question: 'Haben Großeltern während der Freistellung Kündigungsschutz?', answer: 'Ja, bei berechtigter Inanspruchnahme der Großelternzeit gilt der gleiche gesetzliche Sonderkündigungsschutz wie für Eltern nach § 18 BEEG.' }
    ]
  },
  'unterhalt-volljaehrige-kinder-rechner': {
    intro: 'Mit Vollendung des 18. Lebensjahres erlischt der Betreuungsunterhalt: Beide Elternteile haften nun anteilig als Barunterhaltspflichtige nach ihren Einkommensverhältnissen.',
    details: 'Volljährige Kinder in eigener Wohnung haben nach der Düsseldorfer Tabelle einen festen Gesamtunterhaltsbedarf (derzeit 930 € monatlich). Das volle Kindergeld (250 €) wird bedarfsmindernd abgezogen; die verbleibende Lücke teilen die Eltern nach Einkommensquote auf.',
    faqs: [
      { question: 'Wann sind Eltern verpflichtet, für volljährige Kinder Unterhalt zu zahlen?', answer: 'Solange sich das Kind in der allgemeinen Schulausbildung oder einer ersten berufsqualifizierenden Ausbildung bzw. einem Erststudium befindet (§ 1610 Abs. 2 BGB).' },
      { question: 'Was sind privilegierte Volljährige nach § 1603 Abs. 2 BGB?', answer: 'Volljährige Kinder unter 21 Jahren, die unverheiratet sind, im Haushalt eines Elternteils leben und die allgemeine Schulausbildung absolvieren; sie sind minderjährigen Kindern rechtlich gleichgestellt.' }
    ]
  },
  'ausbildungsunterhalt-bedarfskontrollbetrag-rechner': {
    intro: 'Dieser Rechner ermittelt den Unterhaltsanspruch von Auszubildenden unter Anrechnung der eigenen Ausbildungsvergütung.',
    details: 'Von der Brutto-Ausbildungsvergütung werden Steuern, Sozialabgaben und eine berufsbedingte Ausbildungspauschale (100 €) abgezogen; der verbleibende Nettobetrag mindert den Unterhaltsanspruch gegenüber den Eltern vollständig.',
    faqs: [
      { question: 'Dürfen Eltern den Unterhalt verweigern, wenn das Kind die Ausbildung abbricht?', answer: 'Eltern müssen eine angemessene Orientierungsphase zugestehen; bei wiederholten, unbegründeten Ausbildungsabbrüchen oder Bummelstudium kann der Unterhaltsanspruch jedoch verwirken.' },
      { question: 'Wie wirkt sich ein Nebenjob während des Studiums auf den Unterhalt aus?', answer: 'Einkünfte aus Nebentätigkeiten während des Studiums werden in der Regel nur teilweise angerechnet (überobligatorische Leistung), sofern sie das Studium nicht ungebührlich verzögern.' }
    ]
  },
  'kinderbetreuungskosten-absetzen-rechner': {
    intro: 'Erwerbsbedingte Kinderbetreuungskosten können nach § 10 Abs. 1 Nr. 5 EStG steuermindernd als Sonderausgaben in der Einkommensteuererklärung geltend gemacht werden.',
    details: 'Steuerlich anerkannt werden zwei Drittel (66,6 %) der tatsächlichen Aufwendungen für Kindertagesstätte, Krippe, Tagesmutter oder Babysitter, maximal bis zu einem Höchstbetrag von 4.000 Euro je Kind und Kalenderjahr.',
    faqs: [
      { question: 'Können Verpflegungskosten (Essen in der Kita) abgesetzt werden?', answer: 'Nein, Aufwendungen für Mahlzeiten, Spiel- oder Bastelgeld sowie Musikunterricht und Sportvereine sind gesetzlich ausdrücklich vom Steuerabzug ausgeschlossen.' },
      { question: 'Ist Barzahlung an die Tagesmutter steuerlich zulässig?', answer: 'Nein, Voraussetzung für den steuerlichen Abzug ist zwingend eine ordnungsgemäße Rechnung oder ein Gebührenbescheid und die unbare Überweisung auf das Konto des Betreibers.' }
    ]
  }
};
