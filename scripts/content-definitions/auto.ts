import { CalcContent } from './types';

export const AUTO_CONTENT: Record<string, CalcContent> = {
  spritkostenrechner: {
    intro: 'Der Spritkostenrechner ermittelt die reinen Treibstoffausgaben für Einzelfahrten, Urlaubsreisen oder tägliche Pendelstrecken auf den Cent genau.',
    details: 'Die Berechnung multipliziert die gefahrene Strecke mit dem Durchschnittsverbrauch auf 100 km und dem aktuellen Literpreis: Spritkosten = (Distanz / 100) · Verbrauch · Literpreis. Bei Fahrgemeinschaften teilt man die Gesamtsumme einfach durch die Mitfahrerzahl.',
    faqs: [
      { question: 'Wie teilt man Spritkosten bei einer Fahrgemeinschaft fair auf?', answer: 'Geben Sie die gesamte Hin- und Rückfahrt ein (Anzahl Fahrten = 2). Teilen Sie den berechneten Gesamtwert einfach durch die Anzahl der mitfahrenden Personen.' },
      { question: 'Berücksichtigt der Spritkostenrechner auch Verschleiß und Wertverlust?', answer: 'Nein, dieser Rechner kalkuliert ausschließlich die reinen Kraftstoffkosten an der Zapfsäule; für Vollkosten inklusive Wertverlust nutzen Sie unseren Auto-Gesamtkosten-Rechner.' }
    ]
  },
  'kraftstoffverbrauch-rechner': {
    intro: 'Bordcomputer zeigen im Alltag häufig geschönte Verbrauchswerte an. Mit der klassischen Zapfsäulen-Methode ermitteln Sie den echten Durchschnittsdurst Ihres Fahrzeugs.',
    details: 'Methode: Voll tanken, Tageskilometerzähler auf 0 stellen, beim nächsten Volltanken die getankten Liter notieren und durch die gefahrenen Kilometer teilen: (Getankte Liter / Gefahrene km) · 100.',
    faqs: [
      { question: 'Warum weicht der reale Verbrauch von den Herstellerangaben (WLTP) ab?', answer: 'Der WLTP-Zyklus wird auf Prüfständen bei 23 °C ohne Klimaanlage und mit minimaler Zuladung ermittelt; im Realverkehr treiben Kaltstarts, Heizung, Kurzstrecken und Fahrstil den Verbrauch nach oben.' },
      { question: 'Wie wirkt sich vorausschauendes Fahren auf den Verbrauch aus?', answer: 'Durch frühzeitiges Hochschalten (bei ca. 2.000 U/min), Nutzung der Schubabschaltung und Vermeidung unnötigen Bremsens lassen sich 15 bis 25 Prozent Kraftstoff einsparen.' }
    ]
  },
  'pendlerpauschale-rechner': {
    intro: 'Die Pendlerpauschale (Entfernungspauschale nach § 9 Abs. 1 Nr. 4 EStG) mindert als Werbungskosten das zu versteuernde Einkommen von Arbeitnehmern für den Weg zur ersten Tätigkeitsstätte.',
    details: 'In Deutschland gilt: 0,30 € für die ersten 20 Entfernungskilometer (einfache Wegstrecke, nicht Hin- und Rückweg) und 0,38 € ab dem 21. Kilometer. Sie gilt verkehrsmittelunabhängig (Auto, Fahrrad, Fußgänger oder ÖPNV).',
    faqs: [
      { question: 'Gilt die Entfernungspauschale für Hin- und Rückfahrt?', answer: 'Nein, das Steuerrecht erkennt grundsätzlich nur die einfache Entfernung (kürzeste Straßenverbindung) zwischen Wohnung und Arbeitsstätte an.' },
      { question: 'Gibt es einen Höchstbetrag bei der Pendlerpauschale?', answer: 'Für Fahrten mit dem eigenen PKW gilt keine Obergrenze; für alle anderen Verkehrsmittel (ÖPNV, Fahrrad, Fahrgemeinschaft als Mitfahrer) ist der Abzug auf maximal 4.500 € im Kalenderjahr gedeckelt.' }
    ]
  },
  fahrtkostenrechner: {
    intro: 'Dieser Rechner ermittelt die vollständigen Fahrtkosten für Dienstreisen oder private Fahrten nach der gesetzlichen Kilometerpauschale oder individuellen Kilometersätzen.',
    details: 'Arbeitgeber können Dienstreisen mit dem privaten PKW nach § 9 Abs. 1 Nr. 4a EStG mit 0,30 € pro gefahrenem Kilometer (Hin- und Rückweg!) steuerfrei erstatten.',
    faqs: [
      { question: 'Was ist der Unterschied zwischen Pendlerpauschale und Reisekostenpauschale?', answer: 'Die Pendlerpauschale gilt nur für die einfache Strecke zur ersten Tätigkeitsstätte. Bei Dienstreisen (Reisekosten) dürfen alle tatsächlich gefahrenen Kilometer (Hin- und Rückfahrt) abgerechnet werden.' },
      { question: 'Darf der Arbeitgeber mehr als 0,30 € steuerfrei zahlen?', answer: 'Nein, Beträge über 0,30 € pro Kilometer sind für den Arbeitnehmer steuer- und sozialversicherungspflichtiger Arbeitslohn, es sei denn, höhere tatsächliche Fahrzeugkosten werden lückenlos nachgewiesen.' }
    ]
  },
  'elektroauto-ladekosten-rechner': {
    intro: 'Dieser Rechner vergleicht die Ladekosten eines Elektroautos an der heimischen Wallbox mit den Kosten an öffentlichen AC- und DC-Schnellladesäulen.',
    details: 'Ladekosten = (Verbrauch in kWh/100 km / 100) · Distanz · Strompreis pro kWh · (1 + Ladeverlustfaktor). Typische Ladeverluste betragen an der Wallbox etwa 8 bis 12 Prozent, an der Haushaltssteckdose bis zu 20 Prozent.',
    faqs: [
      { question: 'Was kostet das Laden an öffentlichen Schnellladern (DC)?', answer: 'Während Haushaltsstrom meist um 30–36 Cent/kWh kostet, liegen die Preise an Autobahn-Schnellladern (HPC) ohne Vertrag oder Grundgebühr oft bei 60 bis 85 Cent/kWh.' },
      { question: 'Wie berechnet man den realen Stromverbrauch inklusive Ladeverlusten?', answer: 'Messen Sie den Strombezug am Stromzähler vor der Wallbox: Wenn 50 kWh im Akku ankommen, wurden meist ca. 55 kWh aus dem Netz bezogen.' }
    ]
  },
  'fahrzeit-rechner': {
    intro: 'Der Fahrzeitrechner kalkuliert die reine Reisezeit aus gefahrener Distanz und Durchschnittsgeschwindigkeit und integriert geplante Pausenzeiten.',
    details: 'Reisezeit = (Distanz / Geschwindigkeit) + Pausenzeiten. Bei Autobahnfahrten sinkt die reale Durchschnittsgeschwindigkeit durch Baustellen, Tempolimits und LKW-Überholmanöver meist auf 100–115 km/h.',
    faqs: [
      { question: 'Welche Pausenregelung gilt für gewerbliche Berufskraftfahrer?', answer: 'Nach EU-Verordnung 561/2006 müssen LKW- und Busfahrer nach spätestens 4,5 Stunden Lenkzeit eine ununterbrochene Fahrtunterbrechung von mindestens 45 Minuten einlegen.' },
      { question: 'Wie viel Zeit spart man, wenn man 160 km/h statt 120 km/h fährt?', answer: 'Auf einer Strecke von 100 km sinkt die theoretische Fahrzeit von 50 Minuten auf 37,5 Minuten (Zeitersparnis: 12,5 Minuten) – bei drastisch überproportionalem Kraftstoffverbrauch.' }
    ]
  },
  'co2-auto-rechner': {
    intro: 'Dieser Emissionsrechner beziffert den CO₂-Ausstoß Ihres Fahrzeugs pro Kilometer, Einzelfahrt und Jahr basierend auf dem realen Kraftstoffverbrauch.',
    details: 'Die chemischen Emissionsfaktoren lauten: Bei der Verbrennung von 1 Liter Benzin entstehen ca. 2,37 kg CO₂, bei 1 Liter Diesel ca. 2,65 kg CO₂ (aufgrund der höheren Kohlenstoffdichte von Diesel).',
    faqs: [
      { question: 'Warum stößt 1 Liter Diesel mehr CO₂ aus als 1 Liter Benzin?', answer: 'Dieselkraftstoff hat eine höhere Dichte (ca. 0,83 kg/l) und einen höheren Kohlenstoffanteil pro Liter als Superbenzin (ca. 0,74 kg/l).' },
      { question: 'Wie schneidet ein E-Auto beim deutschen Strommix ab?', answer: 'Bei einem Strommix von ca. 380 g CO₂/kWh und 18 kWh/100 km Verbrauch stößt ein E-Auto indirekt ca. 68 g CO₂/km aus – etwa halb so viel wie ein moderner Benziner.' }
    ]
  },
  'kfz-steuer-rechner': {
    intro: 'Die deutsche Kraftfahrzeugsteuer nach § 8 KraftStG bemisst sich bei Erstzulassungen ab 2021 nach Hubraum und dem linearen CO₂-Ausstoß.',
    details: 'Benziner zahlen 2,00 € je angefangene 100 cm³ Hubraum, Diesel 9,50 €. Hinzu kommt ein progressiver CO₂-Zuschlag ab 95 g/km von 2,00 € bis zu 4,00 € pro Gramm über 195 g/km. Reine Elektroautos sind bis Ende 2030 steuerbefreit.',
    faqs: [
      { question: 'Warum zahlen Diesel-Fahrzeuge deutlich höhere Hubraumsteuern als Benziner?', answer: 'Weil die Mineralölsteuer auf Dieselkraftstoff an der Tankstelle steuerlich subventioniert wird; der Gesetzgeber gleicht diesen Steuervorteil über die höhere Kfz-Steuer aus.' },
      { question: 'Bis wann sind Elektrofahrzeuge von der Kfz-Steuer befreit?', answer: 'Reine E-Autos mit Erstzulassung bis 31.12.2025 sind für bis zu 10 Jahre, längstens jedoch bis zum 31.12.2030, vollständig von der Kraftfahrzeugsteuer befreit.' }
    ]
  },
  'dienstwagen-1-prozent-rechner': {
    intro: 'Die 1-Prozent-Regelung (§ 6 Abs. 1 Nr. 4 EStG) versteuert die private Nutzung eines Firmenwagens pauschal als geldwerten Vorteil.',
    details: 'Monatlich wird 1 % des Bruttolistenpreises (UVP bei Erstzulassung inklusive Sonderausstattung, gerundet auf volle 100 €) dem steuerpflichtigen Bruttogehalt hinzugerechnet. Für Fahrten zwischen Wohnung und Arbeitsstätte kommen 0,03 % je Entfernungskilometer hinzu.',
    faqs: [
      { question: 'Welche Steuervergünstigung gilt für Elektro- und Hybrid-Dienstwagen?', answer: 'Für reine Elektroautos mit Bruttolistenpreis bis 70.000 € gilt die 0,25-%-Regel; für teurere E-Autos und qualifizierte Plug-in-Hybride (mind. 80 km elektrische Reichweite) gilt die 0,5-%-Regelung.' },
      { question: 'Gilt der Rabatt des Händlers auch für den Bruttolistenpreis?', answer: 'Nein, maßgeblich ist ausnahmslos die offizielle unverbindliche Preisempfehlung (UVP) des Herstellers zum Zeitpunkt der Erstzulassung, selbst wenn der Wagen mit 30 % Rabatt erworben wurde.' }
    ]
  },
  'fahrtenbuch-vs-1-prozent-rechner': {
    intro: 'Dieser Vergleichsrechner analysiert, ob die pauschale 1-%-Besteuerung oder ein ordnungsgemäßes Fahrtenbuch zu einer geringeren Steuerlast führt.',
    details: 'Ein Fahrtenbuch lohnt sich besonders dann, wenn der Firmenwagen einen hohen Bruttolistenpreis hat, wenig privat genutzt wird oder das Fahrzeug bereits älter und steuerlich weitgehend abgeschrieben ist.',
    faqs: [
      { question: 'Welche Anforderungen stellt das Finanzamt an ein ordnungsgemäßes Fahrtenbuch?', answer: 'Es muss zeitnah, fortlaufend und in geschlossener Form geführt werden. Datum, Kilometerstand vor und nach der Fahrt, Reiseziel, Zweck und aufgesuchte Geschäftspartner müssen lückenlos notiert werden.' },
      { question: 'Kann man während des Kalenderjahres von der 1-%-Regel zum Fahrtenbuch wechseln?', answer: 'Nein, die Methode darf für dasselbe Fahrzeug nur zu Beginn des Kalenderjahres oder bei einem Fahrzeugwechsel unterjährig geändert werden.' }
    ]
  },
  'leasingfaktor-rechner': {
    intro: 'Der Leasingfaktor normiert Leasingraten auf den Bruttolistenpreis und ermöglicht den objektiven Vergleich von Leasingangeboten unabhängig vom Fahrzeugmodell.',
    details: 'Leasingfaktor = (Monatliche Rate / Bruttolistenpreis) · 100. Bei Sonderzahlungen ermittelt der Gesamtkosten-Leasingfaktor: [(Rate + (Sonderzahlung / Laufzeit)) / Listenpreis] · 100. Werte unter 0,7 gelten als Schnäppchen, über 1,1 als teuer.',
    faqs: [
      { question: 'Was ist ein guter Leasingfaktor für Privatkunden?', answer: 'Ein Leasingfaktor unter 0,8 gilt als gutes Angebot, unter 0,6 als echtes Top-Schnäppchen. Werte über 1,0 entsprechen dem regulären Marktstandard ohne besondere Rabatte.' },
      { question: 'Was bedeutet Kilometerleasing vs. Restwertleasing?', answer: 'Privatkunden sollten immer Kilometerleasing wählen: Hier tragen Sie kein Restwertrisiko am Laufzeitende, sondern zahlen nur eventuelle Mehrkilometer und echte Schäden.' }
    ]
  },
  'auto-gesamtkosten-rechner': {
    intro: 'Die realen Vollkosten eines Autos (Total Cost of Ownership) erfassen neben dem Kraftstoff den massiven Wertverlust, Versicherung, Kfz-Steuer, Inspektionen und Verschleiß.',
    details: 'Der ADAC beziffert die realen Gesamtkosten eines Mittelklassewagens typischerweise auf 50 bis 80 Cent pro gefahrenem Kilometer. Der Wertverlust macht dabei in den ersten Jahren über 40 % der Gesamtkosten aus.',
    faqs: [
      { question: 'Welcher Kostenfaktor wird beim Autokauf am häufigsten unterschätzt?', answer: 'Der Wertverlust: Ein Neuwagen verliert im ersten Jahr im Schnitt 20 bis 25 Prozent seines Listenpreises, ohne dass dafür eine Rechnung im Briefkasten landet.' },
      { question: 'Wie hoch sind die durchschnittlichen Werkstatt- und Reifenkosten pro Jahr?', answer: 'Für Inspektionen, Ölwechsel, Verschleißteile (Bremsen, Scheibenwischer) und Reifenwechsel fallen bei durchschnittlicher Fahrleistung 600 bis 1.200 € jährlich an.' }
    ]
  },
  'auto-wertverlust-rechner': {
    intro: 'Der Wertverlust ist der größte Einzelkostenblock bei Neu- und jungen Gebrauchtwagen in den ersten fünf Betriebsjahren.',
    details: 'Faustformel für den Wertverlust: ca. 25 % im ersten Jahr, danach jährlich etwa 5 bis 8 % des Restwerts. Nach fünf Jahren ist ein Fahrzeug typischerweise nur noch rund 40 bis 45 % des ursprünglichen Listenpreises wert.',
    faqs: [
      { question: 'Welche Faktoren beschleunigen den Wertverlust eines Autos?', answer: 'Hohe jährliche Kilometerleistung, unpopuläre Farben, Raucherfahrzeuge, fehlende lückenlose Scheckheftpflege sowie drohende Fahrverbote oder Modellwechsel.' },
      { question: 'Wann ist der optimale Zeitpunkt für den Gebrauchtwagenkauf?', answer: 'Im Alter von 3 bis 4 Jahren (z. B. als Leasingrückläufer): Der steilste Wertverlust ist bereits vom Vorbesitzer bezahlt, während Technik und Zustand meist noch sehr gut sind.' }
    ]
  },
  'bremsweg-rechner': {
    intro: 'Die Fahrschulformeln berechnen Reaktionsweg, Bremsweg und den gesamten Anhalteweg bei Normal- und Gefahrenbremsungen.',
    details: 'Reaktionsweg = (Geschwindigkeit / 10) · 3. Bremsweg (Normal) = (v / 10) · (v / 10). Bei einer Gefahrenbremsung halbiert sich der Bremsweg: [(v/10)²] / 2. Anhalteweg = Reaktionsweg + Bremsweg.',
    faqs: [
      { question: 'Warum vervierfacht sich der Bremsweg bei Verdopplung der Geschwindigkeit?', answer: 'Weil die kinetische Bewegungsenergie quadratisch mit der Geschwindigkeit wächst (E_kin = 1/2 · m · v²); doppelte Geschwindigkeit erfordert die vierfache Bremsarbeit.' },
      { question: 'Wie lang ist der Anhalteweg bei Tempo 100 km/h (Normalbremsung)?', answer: 'Reaktionsweg (30 m) + Bremsweg (100 m) = 130 Meter Anhalteweg.' }
    ]
  },
  'bussgeld-rechner-geschwindigkeit': {
    intro: 'Dieser Bußgeldrechner ermittelt die Sanktionen nach dem bundeseinheitlichen Bußgeldkatalog für Geschwindigkeitsüberschreitungen innerorts und außerorts.',
    details: 'Die Strafen unterscheiden strikt zwischen Verstößen innerhalb geschlossener Ortschaften (höheres Gefährdungspotenzial) und außerorts. Ab 21 km/h zu viel droht ein Punkt in Flensburg, ab 26 km/h bzw. 31 km/h ein Fahrverbot.',
    faqs: [
      { question: 'Wie hoch ist der Toleranzabzug bei Geschwindigkeitsmessungen?', answer: 'Bei stationären und mobilen Blitzern werden bei Geschwindigkeiten bis 100 km/h in der Regel 3 km/h abgezogen; bei über 100 km/h werden 3 Prozent der gemessenen Geschwindigkeit toleriert.' },
      { question: 'Was ist die Wiederholungstäter-Regel beim Fahrverbot?', answer: 'Wer innerhalb eines Jahres zweimal mit einer Geschwindigkeitsüberschreitung von 26 km/h oder mehr geblitzt wird, erhält nach § 4 Abs. 2 BKatV in der Regel ein einmonatiges Fahrverbot.' }
    ]
  },
  'promillerechner-widmark': {
    intro: 'Die Widmark-Formel berechnet die theoretische Blutalkoholkonzentration (BAK) in Promille anhand von getrunkener Alkoholmenge, Körpergewicht und Geschlecht.',
    details: 'Formel: c = A / (p · r), wobei A die reine Alkoholmasse in Gramm ist, p das Körpergewicht und r der Reduktionsfaktor (0,70 bei Männern, 0,60 bei Frauen wegen höherem Körperfettanteil). Der biologische Abbau beträgt ca. 0,10 bis 0,15 ‰ pro Stunde.',
    faqs: [
      { question: 'Kann man den Alkoholabbau durch Kaffee, Duschen oder Sport beschleunigen?', answer: 'Nein, die Leber baut Alkohol mit einer konstanten Rate von etwa 0,1 bis 0,15 Promille pro Stunde über das Enzym Alkoholdehydrogenase (ADH) ab; dieser biologische Prozess lässt sich nicht beschleunigen.' },
      { question: 'Wie viel Gramm reiner Alkohol enthält eine Flasche Wein (0,75 l mit 12 Vol.-%)?', answer: '0,75 Liter × 0,12 = 0,09 Liter Alkohol. Bei einer Dichte von 0,8 g/ml entspricht dies genau 72 Gramm reinem Alkohol.' }
    ]
  },
  'anhaenger-stuetzlast-rechner': {
    intro: 'Die Stützlast ist die vertikale Kraft, die die Anhängerdeichsel auf die Anhängerkupplung des Zugfahrzeugs ausübt, und ist essenziell für die Fahrstabilität.',
    details: 'Die gesetzliche Mindeststützlast nach § 44 StVZO beträgt 4 Prozent des tatsächlichen Anhängergewichts (mindestens 25 kg). Weder die maximale Stützlast des PKW noch die des Anhängers darf überschritten werden.',
    faqs: [
      { question: 'Was passiert bei zu geringer oder negativer Stützlast?', answer: 'Der Anhänger neigt schon bei geringen Geschwindigkeiten zum gefährlichen Schlingern und Ausbrechen, da die Hinterachse des Zugfahrzeugs entlastet wird.' },
      { question: 'Wie misst man die Stützlast ohne Spezialwaage?', answer: 'Stellen Sie eine handelsübliche Personenwaage unter das Stützrad oder unter ein senkrecht in die Kupplung eingepasstes Kantholz auf Höhe der Kugelkupplung.' }
    ]
  },
  'reifen-abrollumfang-rechner': {
    intro: 'Beim Wechsel auf alternative Felgen- und Reifengrößen ermittelt dieser Rechner die Abweichung des Abrollumfangs und die resultierende Tachoabweichung.',
    details: 'Nach ECE-Regelung 39 darf der Tacho niemals zu wenig anzeigen (Gefahr unbemerkter Geschwindigkeitsüberschreitung) und maximal um 10 % + 4 km/h nach oben abweichen. Bei Umfangsdifferenzen über -2,5 % oder +1,5 % ist meist eine Tachoangleichung Pflicht.',
    faqs: [
      { question: 'Wie liest man eine Reifengröße wie 205/55 R16 ab?', answer: '205 ist die Reifenbreite in mm; 55 ist das Flankenverhältnis in Prozent der Breite (112,75 mm); R steht für Radialbauweise; 16 ist der Felgendurchmesser in Zoll.' },
      { question: 'Welche Auswirkung hat ein größerer Abrollumfang auf die Beschleunigung?', answer: 'Ein größerer Umfang verlängert die Gesamtübersetzung: Die Höchstgeschwindigkeit kann steigen, die Beschleunigungskraft an den Rädern sinkt jedoch spürbar.' }
    ]
  },
  'thg-quote-rechner': {
    intro: 'Halter reiner batterieelektrischer Fahrzeuge (BEV) können über die Treibhausgasminderungsquote (THG-Quote nach § 37a BImSchG) jährlich eine Prämie für eingespartes CO₂ erhalten.',
    details: 'Mineralölkonzerne sind gesetzlich verpflichtet, ihre CO₂-Emissionen zu senken. Halter von E-Autos können ihr pauschaliertes CO₂-Einsparpotenzial an Zwischenhändler (Quotenvermittler) verkaufen.',
    faqs: [
      { question: 'Müssen Privatpersonen die THG-Quote versteuern?', answer: 'Nein, nach Verfügung des Bundesfinanzministeriums (BMF) sind Einnahmen aus der Veräußerung der THG-Quote bei im Privatvermögen gehaltenen Elektroautos vollkommen steuerfrei.' },
      { question: 'Kann man die THG-Prämie auch für geleaste E-Autos beantragen?', answer: 'Ja, berechtigt ist derjenige, der im Fahrzeugschein (Zulassungsbescheinigung Teil I) als Fahrzeughalter eingetragen ist – bei Leasingverträgen ist das fast immer der Leasingnehmer.' }
    ]
  },
  'dienstfahrrad-jobrad-rechner': {
    intro: 'Das Dienstrad-Leasing (JobRad-Modell) nutzt die steuerliche Gehaltsumwandlung für Fahrräder und E-Bikes nach der 0,25-Prozent-Regel.',
    details: 'Die Leasingrate wird vom Bruttogehalt abgezogen, was Lohnsteuer und Sozialabgaben mindert. Der geldwerte Vorteil für die private Nutzung wird monatlich mit nur 0,25 % eines auf volle 100 € abgerundeten Viertels der UVP versteuert.',
    faqs: [
      { question: 'Wie hoch ist die typische Ersparnis gegenüber dem Direktkauf?', answer: 'Durch die Ersparnis bei Einkommensteuer und Sozialversicherungsbeiträgen liegt die Gesamtersparnis meist bei 25 bis 40 Prozent gegenüber dem privaten Barkauf.' },
      { question: 'Was geschieht mit dem Dienstrad bei Ablauf des 36-Monats-Leasings?', answer: 'Die Leasinggesellschaft bietet dem Mitarbeiter meist die Übernahme des Rads zum günstigen Restwert an (typischerweise ca. 15 bis 18 Prozent des ursprünglichen Kaufpreises).' }
    ]
  },
  'hybrid-auto-kosten-rechner': {
    intro: 'Dieser Kostenrechner ermittelt die realen Betriebskosten eines Plug-in-Hybriden (PHEV) bei unterschiedlichen Anteilen von rein elektrischem Fahren und Benzinbetrieb.',
    details: 'Kosten = (E-Anteil · Stromkosten/100 km) + (Benzin-Anteil · Spritkosten/100 km). Plug-in-Hybride sind wirtschaftlich nur dann sinnvoll, wenn sie regelmäßig an der heimischen Steckdose geladen und überwiegend im E-Modus bewegt werden.',
    faqs: [
      { question: 'Warum verbrauchen Plug-in-Hybride auf Langstrecken oft mehr als reine Verbrenner?', answer: 'Weil auf der Autobahn nach Entleerung des Akkus das hohe Zusatzgewicht der Batterie (oft 200 bis 400 kg) permanent mit dem Verbrennungsmotor mitgeschleppt werden muss.' },
      { question: 'Wann qualifiziert sich ein Plug-in-Hybrid für das E-Kennzeichen?', answer: 'Er muss entweder maximal 50 Gramm CO₂ pro Kilometer ausstoßen oder eine rein elektrische Mindestreichweite von mindestens 80 Kilometern aufweisen.' }
    ]
  },
  'fahrgemeinschaft-sprit-rechner': {
    intro: 'Dieser Kostenverteiler teilt Kraftstoff- und Abnutzungskosten von Fahrgemeinschaften unter Berücksichtigung von Umwegen und wechselnden Mitfahrern auf.',
    details: 'Kosten pro Mitfahrer = Gesamtkosten / Personenanzahl. Rechtlich gilt: Das Mitnehmen von Kollegen gegen reine Kostenbeteiligung stellt keinen gewerblichen Personentransport nach dem Personenbeförderungsgesetz (PBefG) dar.',
    faqs: [
      { question: 'Sind Mitfahrer in einer Fahrgemeinschaft bei Unfällen versichert?', answer: 'Ja, Mitfahrer sind über die gesetzliche Kfz-Haftpflichtversicherung des Fahrers geschützt. Auf dem direkten Arbeitsweg greift zudem die gesetzliche Unfallversicherung (Berufsgenossenschaft).' },
      { question: 'Darf der Fahrer mehr Geld verlangen, als der Sprit kostet?', answer: 'Eine Kostenbeteiligung an Sprit und Verschleiß (z. B. 0,20 bis 0,30 € pro Personenkilometer) ist zulässig; ein Gewinn darf jedoch nicht erzielt werden, da sonst der Versicherungsschutz erlöschen kann.' }
    ]
  },
  'autobahn-maut-rechner-vignette': {
    intro: 'Dieser Reiseplaner kalkuliert die Kosten für Vignetten, Streckenmauten und Tunnelgebühren in den beliebtesten Reiseländern (Österreich, Schweiz, Italien, Frankreich).',
    details: 'In Österreich und der Schweiz gilt das zeitbasierte Vignettenprinzip (z. B. 1-Tages-, 10-Tages-, 2-Monats- oder Jahresvignette); in Frankreich und Italien wird die Maut streckenbezogen an Mautstationen pro Kilometer abgerechnet.',
    faqs: [
      { question: 'Was ist die Streckenmaut (Sondermaut) in Österreich?', answer: 'Bestimmte Alpenübergänge wie Brennerautobahn (A13), Tauernautobahn (A10) oder Arlbergtunnel kosten extra und sind nicht durch die reguläre Autobahnvignette abgedeckt.' },
      { question: 'Was droht beim Befahren von Schweizer Autobahnen ohne Vignette?', answer: 'In der Schweiz wird das Fahren ohne gültige E-Vignette oder Klebevignette mit einer Buße von 200 Schweizer Franken plus den Kosten für eine reguläre Jahresvignette geahndet.' }
    ]
  },
  'motorrad-unterhaltskosten-rechner': {
    intro: 'Dieser Rechner kalkuliert die jährlichen Fix- und Betriebskosten eines Motorrads inklusive Saisonkennzeichen, Haftpflicht, Teilkasko, Reifenverschleiß und Service.',
    details: 'Motorradreifen haben durch die weicheren Gummimischungen eine deutlich kürzere Lebensdauer als Autoreifen (oft nur 4.000 bis 8.000 km), was die kilometerabhängigen Kosten dominiert.',
    faqs: [
      { question: 'Wie viel spart ein Saisonkennzeichen beim Motorrad?', answer: 'Bei Zulassung von z. B. April bis Oktober (7 Monate) zahlen Sie genau 7/12 der jährlichen Kfz-Steuer und Versicherungsprämie; in den Ruhemonaten besteht beitragsfreie Ruheversicherung.' },
      { question: 'Wie berechnet sich die Kfz-Steuer für Motorräder?', answer: 'Nach § 8 KraftStG zahlen Motorräder über 125 cm³ Hubraum 1,84 € je angefangene 25 cm³ Hubraum pro vollem Kalenderjahr.' }
    ]
  },
  'lkw-maut-deutschland-rechner': {
    intro: 'Die deutsche LKW-Maut nach dem Bundesfernstraßenmautgesetz (BFStrMG) erhebt streckenbezogene Gebühren gestaffelt nach Gewichtsklasse, Achszahl, Schadstoffklasse und CO₂-Emissionsklasse.',
    details: 'Seit 2023/2024 gilt ein CO₂-Aufschlag von 200 € pro Tonne CO₂. Die Mautpflicht gilt für alle Nutzfahrzeuge ab 3,5 Tonnen technisch zulässiger Gesamtmasse auf allen Bundesautobahnen und Bundesstraßen.',
    faqs: [
      { question: 'Welche Ausnahmen gelten von der LKW-Maut ab 3,5 Tonnen?', answer: 'Handwerkerfahrzeuge unter 7,5 Tonnen sind über die Handwerkerprivileg-Regelung von der Maut befreit, wenn das Fahrzeug Material oder Güter für eigene handwerkliche Tätigkeiten transportiert.' },
      { question: 'Sind emissionsfreie LKW (z. B. Elektro-LKW) mautbefreit?', answer: 'Ja, rein batterieelektrische und wasserstoffbetriebene LKW sind bis Ende 2025 vollständig von der LKW-Maut befreit und zahlen ab 2026 nur einen reduzierten Mautsatz für die Infrastruktur.' }
    ]
  }
};
