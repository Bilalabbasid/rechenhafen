import { CalcContent } from './types';

export const GESUNDHEIT_CONTENT: Record<string, CalcContent> = {
  'bmi-rechner': {
    intro: 'Der Body-Mass-Index (BMI) ist die international von der Weltgesundheitsorganisation (WHO) anerkannte Maßzahl zur Ersteinstufung des Körpergewichts bei Erwachsenen.',
    details: 'Formel: BMI = Körpergewicht in kg / (Körpergröße in m)². Klassifikation: Untergewicht (< 18,5), Normalgewicht (18,5–24,9), Übergewicht (25,0–29,9) und Adipositas (Grad I ab 30,0). Der BMI unterscheidet nicht zwischen Muskel- und Fettmasse.',
    faqs: [
      { question: 'Warum ist der BMI für Kraftsportler oft ungeeignet?', answer: 'Da Muskelgewebe eine deutlich höhere Dichte als Fettgewebe aufweist, stuft der BMI muskulöse Sportler häufig fälschlicherweise als übergewichtig oder gar adipös ein.' },
      { question: 'Gilt der Standard-BMI auch für Kinder und Jugendliche?', answer: 'Nein, bei Kindern und Jugendlichen wird der BMI anhand von alters- und geschlechtsspezifischen BMI-Perzentilkurven (KIGGS-Daten des Robert Koch-Instituts) beurteilt.' }
    ]
  },
  'kalorienbedarf-rechner': {
    intro: 'Der tägliche Gesamtkalorienbedarf (Total Daily Energy Expenditure, TDEE) setzt sich aus Grundumsatz und Leistungsumsatz zusammen.',
    details: 'Gesamtumsatz = Grundumsatz · PAL-Faktor (Physical Activity Level). Für eine gezielte Gewichtsabnahme empfiehlt sich ein moderates Kaloriendefizit von 300 bis 500 kcal pro Tag, um den gefürchteten Jojo-Effekt zu verhindern.',
    faqs: [
      { question: 'Wie viel Kaloriendefizit entspricht einem Kilogramm reinem Körperfett?', answer: 'Ein Kilogramm menschliches Fettgewebe speichert rund 7.000 Kilokalorien (kcal) verwertbare Energie; ein tägliches Defizit von 500 kcal führt rechnerisch zu ca. 0,5 kg Fettverlust pro Woche.' },
      { question: 'Was passiert mit dem Stoffwechsel bei zu extremem Hungern?', answer: 'Bei zu drastischen Defiziten (> 1.000 kcal) drosselt der Körper den Grundumsatz (adaptive Thermogenese), baut wertvolle Muskelmasse ab und reduziert Schilddrüsenhormone.' }
    ]
  },
  'wasserbedarf-rechner': {
    intro: 'Dieser Flüssigkeitsrechner ermittelt die empfohlene tägliche Trinkmenge nach den Richtwerten der Deutschen Gesellschaft für Ernährung (DGE).',
    details: 'Richtwert: ca. 35 ml Wasser pro Kilogramm Körpergewicht bei Erwachsenen. Bei sportlicher Betätigung, Hitze oder Fieber steigt der Bedarf um 0,5 bis 1 Liter pro Stunde körperlicher Aktivität.',
    faqs: [
      { question: 'Zählen Kaffee und Tee zur täglichen Flüssigkeitsbilanz?', answer: 'Ja, nach aktuellem Stand der Ernährungswissenschaft zählen Kaffee und ungesüßter Tee vollwertig zur Flüssigkeitszufuhr; die angebliche entwässernde Wirkung bei moderatem Konsum ist ein Mythos.' },
      { question: 'Woran erkennt man eine ausreichende Flüssigkeitsversorgung im Alltag?', answer: 'Am einfachsten an der Farbe des Urins: Ein heller, blassgelber Farbton signalisiert optimale Hydratation; dunkler Urin weist auf Flüssigkeitsmangel hin.' }
    ]
  },
  'laufpace-rechner': {
    intro: 'Die Lauf-Pace beziffert die benötigte Zeit in Minuten und Sekunden für einen gelaufenen Kilometer (min/km) und ist die Standard-Kenngröße im Laufsport.',
    details: 'Pace = Gelaufene Zeit in Minuten / Distanz in km. Eine Geschwindigkeit von 10 km/h entspricht exakt einer Pace von 6:00 min/km. 12 km/h entsprechen 5:00 min/km.',
    faqs: [
      { question: 'Welche Pace benötigt man für einen Halbmarathon unter 2 Stunden?', answer: 'Für einen Halbmarathon (21,0975 km) in unter 2:00:00 Stunden muss eine konstante Durchschnittspace von mindestens 5:41 min/km gelaufen werden.' },
      { question: 'Wie rechnet man km/h im Kopf in min/km um?', answer: 'Teilen Sie 60 durch die Geschwindigkeit: 60 / 12 km/h = 5,00 min/km; 60 / 10 km/h = 6,00 min/km; 60 / 8 km/h = 7,5 min/km (7:30 min/km).' }
    ]
  },
  'grundumsatz-bmr-rechner': {
    intro: 'Der Grundumsatz (Basal Metabolic Rate, BMR) ist die Energiemenge, die der Körper bei völliger Ruhe zur Aufrechterhaltung lebenswichtiger Organfunktionen (Atmung, Herz, Gehirn) benötigt.',
    details: 'Berechnung nach der modernen Mifflin-St.Jeor-Formel: BMR = (10 · kg) + (6,25 · cm) - (5 · Alter) + 5 (Männer) bzw. - 161 (Frauen). Das Gehirn und die Leber verbrauchen zusammen fast die Hälfte des Grundumsatzes.',
    faqs: [
      { question: 'Darf man bei einer Diät weniger Kalorien als den Grundumsatz essen?', answer: 'Dauerhaft keinesfalls: Eine Kalorienzufuhr unterhalb des Grundumsatzes signalisiert dem Körper akute Hungersnot, schädigt das Immunsystem und forciert Muskelabbau.' },
      { question: 'Wie kann man seinen Grundumsatz langfristig steigern?', answer: 'Durch gezielten Muskelaufbau (Krafttraining): Jedes Kilogramm aktive Muskelmasse verbrennt auch im Ruhezustand kontinuierlich mehr Energie als Fettgewebe.' }
    ]
  },
  'leistungsumsatz-pal-rechner': {
    intro: 'Der Leistungsumsatz erfasst alle Kalorien, die durch körperliche Bewegung, Beruf, Hausarbeit und Sport über den Grundumsatz hinaus verbrannt werden.',
    details: 'Der PAL-Wert (Physical Activity Level) stuft Aktivitäten ein: Büroarbeit (1,4–1,5), stehende Berufe wie Verkäufer (1,8–1,9), schwere körperliche Arbeit wie Bauarbeiter (2,0–2,4). Sport wird mit 0,3 bis 0,5 PAL-Punkten addiert.',
    faqs: [
      { question: 'Welcher PAL-Wert passt zu einem typischen Bürojob mit 2x Sport pro Woche?', answer: 'Ein PAL-Wert von 1,4 bis 1,5 für den sitzenden Arbeitstag plus ca. 0,1 Zuschlag für die sportlichen Einheiten (Gesamt-PAL: ca. 1,55).' },
      { question: 'Was ist NEAT (Non-Exercise Activity Thermogenesis)?', answer: 'Die Kalorienverbrennung durch alltägliche Spontanbewegungen wie Treppensteigen, Zappeln, Gehen beim Telefonieren und Stehen; NEAT macht oft mehr Kalorienverbrauch aus als eine Stunde Sport.' }
    ]
  },
  'makronaehrstoff-verteilung-rechner': {
    intro: 'Dieser Makronährstoffrechner teilt Ihren täglichen Kalorienbedarf optimal in Proteine, Kohlenhydrate und Fette auf.',
    details: 'Physiologische Brennwerte: 1 g Protein = 4,1 kcal, 1 g Kohlenhydrate = 4,1 kcal, 1 g Fett = 9,3 kcal. Gängige Aufteilungen sind High-Carb (50/30/20), moderat (40/30/30) oder Low-Carb/Keto (20/35/45).',
    faqs: [
      { question: 'Wie viel Gramm Protein benötigt man beim Muskelaufbau?', answer: 'Sportmediziner und Ernährungsgesellschaften empfehlen für Trainierende 1,6 bis 2,2 Gramm Protein pro Kilogramm Körpergewicht am Tag.' },
      { question: 'Warum sind Fette für den Hormonhaushalt unverzichtbar?', answer: 'Essenzielle Fettsäuren bilden die molekulare Grundsubstanz für körpereigene Steroidhormone (Testosteron, Östrogen) und ermöglichen die Aufnahme fettlöslicher Vitamine (A, D, E, K).' }
    ]
  },
  'idealgewicht-creff-rechner': {
    intro: 'Die Creff-Formel verfeinert die klassische Broca-Formel, indem sie den individuellen Körperbau (schmal, normal, breitknochig) und das Alter berücksichtigt.',
    details: 'Formel für normalen Körperbau: [(Größe in cm - 100) + (Alter / 10)] · 0,9. Bei zierlichem Körperbau wird der Faktor 0,81 angewendet, bei stämmigem, breitem Skelettbau der Faktor 0,99.',
    faqs: [
      { question: 'Wie bestimmt man den eigenen Skelettbau (Handgelenk-Umfang)?', answer: 'Messen Sie den Handgelenksumfang an der schmalsten Stelle: Bei Männern gilt unter 16,5 cm als schmal, über 19 cm als breitknochig; bei Frauen unter 14 cm als schmal, über 16,5 cm als breit.' },
      { question: 'Warum steigt das Idealgewicht nach Creff mit dem Alter leicht an?', answer: 'Weil ein moderater BMI-Anstieg im höheren Alter (BMI 24–27 bei Senioren) statistisch mit einer geringeren Gesamtmortalität und besseren Überlebenschancen bei Krankheiten einhergeht.' }
    ]
  },
  'koerperfettanteil-navy-rechner': {
    intro: 'Die US-Navy-Methode schätzt den Körperfettanteil (KFA) präzise anhand von Körpergröße und einfachen Maßband-Umfängen von Nacken, Taille und Hüfte.',
    details: 'Formel basiert auf logarithmischen Gleichungen nach Hodgdon und Beckett. Die Methode ist deutlich unempfindlicher gegenüber Wasserhaushaltsschwankungen als handelsübliche Bioimpedanz-Körperfettwaagen.',
    faqs: [
      { question: 'Wo genau muss das Maßband für den Navy-Test angelegt werden?', answer: 'Taille: Bei Männern auf Nabelhöhe, bei Frauen an der schmalsten Stelle; Nacken: Direkt unterhalb des Kehlkopfs; Hüfte (nur Frauen): An der breitesten Stelle des Gesäßes.' },
      { question: 'Welcher Körperfettanteil gilt als gesund und sportlich?', answer: 'Bei Männern: 10 bis 14 % (sportlich/definiert), 15 bis 19 % (normal/gesund); bei Frauen: 18 bis 22 % (sportlich), 23 bis 27 % (normal/gesund).' }
    ]
  },
  'waist-to-hip-ratio-rechner': {
    intro: 'Das Taille-Hüft-Verhältnis (Waist-to-Hip Ratio, WHR) beurteilt die Fettverteilung und unterscheidet zwischen der gefährlichen Apfelform (viszerales Bauchfett) und der Birnenform.',
    details: 'WHR = Taillenumfang / Hüftumfang. Die WHO definiert ein erhöhtes kardiovaskuläres Risiko ab einem WHR von 0,90 bei Männern und ab 0,85 bei Frauen.',
    faqs: [
      { question: 'Warum ist Bauchfett (viszerales Fett) so viel gefährlicher als Unterhautfett?', answer: 'Viszerales Fett umhüllt innere Organe und ist hochgradig stoffwechselaktiv: Es schüttet entzündungsfördernde Botenstoffe aus, fördert Arteriosklerose, Bluthochdruck und Typ-2-Diabetes.' },
      { question: 'Wie misst man den Taillenumfang korrekt?', answer: 'Morgens vor dem Frühstück stehend, entspannt ausgeatmet, genau in der Mitte zwischen dem unteren Rippenbogen und der Oberkante des Beckenkamms.' }
    ]
  },
  'waist-to-height-ratio-rechner': {
    intro: 'Das Taille-zu-Größe-Verhältnis (Waist-to-Height Ratio, WHtR) gilt in der modernen Kardiologie als überlegener Indikator gegenüber dem BMI für kardiovaskuläre Risiken.',
    details: 'WHtR = Taillenumfang in cm / Körpergröße in cm. Faustregel: Der Taillenumfang sollte weniger als die Hälfte der Körpergröße betragen (WHtR < 0,50 bei Personen unter 40 Jahren).',
    faqs: [
      { question: 'Wie verschieben sich die gesunden WHtR-Grenzwerte im Alter?', answer: 'Zwischen 40 und 50 Jahren gilt ein WHtR bis 0,60 als unbedenklich; ab dem 50. Lebensjahr wird ein Wert bis 0,60 als moderater Normalwert toleriert.' },
      { question: 'Warum ist der WHtR aussagekräftiger als der BMI?', answer: 'Weil er gezielt das metabolisch schädliche Bauchfett ins Verhältnis zur Körperlänge setzt, statt Muskelmasse fälschlicherweise als Übergewicht zu werten.' }
    ]
  },
  'maximalpuls-hfmax-rechner': {
    intro: 'Die maximale Herzfrequenz (HFmax) ist die höchste Schlagzahl pro Minute, die das Herz bei maximaler körperlicher Ausbelastung erreichen kann.',
    details: 'Moderne Formel nach Tanaka: HFmax = 208 - (0,7 · Alter) (präziser als die veraltete Faustformel 220 - Alter). Die HFmax ist genetisch vorgegeben und lässt sich durch Training kaum steigern, dient aber als Basis für Trainingszonen.',
    faqs: [
      { question: 'Bedeutet eine niedrigere Maximalpuls-Zahl schlechtere Fitness?', answer: 'Nein, die HFmax ist eine individuelle biologische Konstante; erst der Ruhepuls (z. B. 45–55 bpm bei Ausdauersportlern) signalisiert ein vergrößertes Schlagvolumen und hohe Fitness.' },
      { question: 'Wie ermittelt man die HFmax sportmedizinisch exakt?', answer: 'Über eine professionelle Leistungsdiagnostik mit Stufentest auf dem Fahrradergometer oder Laufband bis zur willentlichen Erschöpfung (Spiroergometrie).' }
    ]
  },
  'vo2max-cooper-test-rechner': {
    intro: 'Die maximale Sauerstoffaufnahme (VO₂max in ml/kg/min) ist das internationale Goldstandard-Maß für die kardiorespiratorische Ausdauerleistungsfähigkeit.',
    details: 'Im 12-Minuten-Cooper-Test laufen Probanden in 12 Minuten die maximal mögliche Strecke auf ebener Bahn: VO₂max = (Distanz in Metern - 504,9) / 44,73.',
    faqs: [
      { question: 'Welche VO₂max-Werte haben trainierte Ausdauersportler?', answer: 'Untrainierte Erwachsene liegen meist bei 30 bis 40 ml/kg/min; ambitionierte Hobbyläufer erreichen 45 bis 55 ml/kg/min; Weltklasse-Marathonläufer und Skilangläufer erzielen 75 bis 85+ ml/kg/min.' },
      { question: 'Lässt sich die VO₂max durch Training steigern?', answer: 'Ja, hochintensives Intervalltraining (HIIT) im Bereich von 90–95 % der HFmax kann die VO₂max innerhalb weniger Monate um 10 bis 20 Prozent verbessern.' }
    ]
  },
  'one-rep-max-rechner': {
    intro: 'Das One-Repetition-Maximum (1RM) ist das maximale Gewicht, das bei einer Kraftübung (z. B. Bankdrücken, Kniebeugen) für genau eine saubere Wiederholung bewältigt werden kann.',
    details: 'Berechnung nach der Brzycki-Formel: 1RM = Gewicht / (1,0278 - (0,0278 · Wiederholungen)) für 2 bis 10 Wiederholungen. Dies schützt Sehnen und Gelenke vor den Verletzungsrisiken echter Maximalversuche.',
    faqs: [
      { question: 'Bis zu wie vielen Wiederholungen ist die 1RM-Berechnung zuverlässig?', answer: 'Am genauesten sind 3 bis 6 Wiederholungen; ab mehr als 10 Wiederholungen verfälscht die einsetzende Kraftausdauer die Vorhersage des Maximalkraftwerts.' },
      { question: 'In welchem Prozentbereich des 1RM trainiert man für Hypertrophie (Muskelaufbau)?', answer: 'Für Muskelwachstum gilt der Bereich von 65 bis 80 Prozent des 1RM bei 8 bis 12 Wiederholungen als optimaler Trainingsreiz.' }
    ]
  },
  'schritt-distanz-kalorien-rechner': {
    intro: 'Dieser Schrittrechner transformiert gezählte Schritte in gelaufene Kilometer und den resultierenden Kalorienverbrauch.',
    details: 'Schrittlänge ≈ Körpergröße in cm · 0,415. 10.000 Schritte entsprechen bei durchschnittlicher Schrittlänge rund 6,5 bis 7,5 Kilometern und einem Zusatzverbrauch von etwa 300 bis 450 Kilokalorien.',
    faqs: [
      { question: 'Sind 10.000 Schritte am Tag medizinisch notwendig?', answer: 'Aktuelle kardiologische Studien zeigen, dass bereits ab 6.000 bis 8.000 Schritten täglich das Risiko für Herz-Kreislauf-Erkrankungen und Frühsterblichkeit signifikant sinkt.' },
      { question: 'Wie misst man seine eigene Schrittlänge exakt aus?', answer: 'Gehen Sie 10 normale Schritte, messen Sie die Gesamtstrecke mit dem Maßband und teilen Sie die Zentimeter durch 10.' }
    ]
  },
  'schlafbedarfs-rechner': {
    intro: 'Dieser Schlafphasen-Rechner optimiert Aufsteh- und Einschlafzeiten anhand der natürlichen 90-minütigen Ultradian-Schlafzyklen.',
    details: 'Ein vollständiger Schlafzyklus (Leichtschlaf, Tiefschlaf, REM-Schlaf) dauert ca. 90 Minuten. Wer am Ende eines Zyklus aufwacht, fühlt sich erfrischt; ein Wecker mitten in der Tiefschlafphase führt zu Schlaftrunkenheit.',
    faqs: [
      { question: 'Wie viele Schlafzyklen benötigt ein Erwachsener pro Nacht?', answer: 'In der Regel 5 bis 6 Zyklen, was einer optimalen Schlafzeit von 7,5 bis 9 Stunden entspricht; weniger als 6 Stunden führt langfristig zu kognitiven Defiziten.' },
      { question: 'Wie lange braucht ein gesunder Mensch im Schnitt zum Einschlafen?', answer: 'Die normale Einschlaflatenz liegt bei 10 bis 20 Minuten; diese Zeitspanne wird bei der Rückwärtsplanung der Schlafenszeit addiert.' }
    ]
  },
  'nikotin-rauchstopp-ersparnis-rechner': {
    intro: 'Dieser Nichtraucher-Rechner beziffert die enorme finanzielle und gesundheitliche Ersparnis nach dem Rauchstopp über Tage, Monate und Jahrzehnte.',
    details: 'Ersparnis = Nicht gerauchte Schachteln · Schachtelpreis. Wer eine Schachtel pro Tag (ca. 8,50 €) aufgibt, spart im Jahr über 3.100 Euro und nach 10 Jahren mehr als 31.000 Euro netto (ohne Zinseszins).',
    faqs: [
      { question: 'Wie schnell erholt sich der Körper nach der letzten Zigarette?', answer: 'Bereits nach 20 Minuten sinken Puls und Blutdruck; nach 24 Stunden sinkt das Herzinfarktrisiko; nach 1 bis 9 Monaten lassen Hustenanfälle nach und die Flimmerhärchen der Lunge regenerieren sich.' },
      { question: 'Wie viel Endkapital entsteht, wenn man das gesparte Rauchgeld in einen ETF investiert?', answer: 'Wer 250 Euro Monatsersparnis zu 7 % Rendite anlegt, besitzt nach 20 Jahren ein Vermögen von über 130.000 Euro.' }
    ]
  },
  'koffein-halbwertszeit-rechner': {
    intro: 'Dieser Rechner modelliert den Abbau von Koffein im Blutkreislauf und ermittelt die optimale Zeitspanne für ungestörten Nachtschlaf.',
    details: 'Die biologische Halbwertszeit von Koffein beträgt bei gesunden Erwachsenen durchschnittlich 4 bis 6 Stunden: Nach einer Tasse Kaffee mit 100 mg Koffein um 16:00 Uhr zirkulieren um 22:00 Uhr noch immer 50 mg Koffein im Körper.',
    faqs: [
      { question: 'Ab welcher Uhrzeit sollte man keinen Kaffee mehr trinken?', answer: 'Schlafmediziner empfehlen, mindestens 8 bis 10 Stunden vor dem geplanten Einschlafen auf koffeinhaltige Getränke (Kaffee, Cola, Energy Drinks) zu verzichten.' },
      { question: 'Welche Faktoren verlangsamen den Koffeinabbau in der Leber?', answer: 'Schwangerschaft (Halbwertszeit verlängert sich auf bis zu 10–15 Stunden), hormonelle Verhütungsmittel (Pille) und bestimmte Medikamente verlangsamen den Abbau durch das Enzym CYP1A2.' }
    ]
  },
  'alkohol-abbau-rechner': {
    intro: 'Dieser Abbau-Rechner ermittelt anhand des erreichten Promillewerts den exakten Zeitpunkt der vollständigen Nüchternheit (0,0 ‰).',
    details: 'Die menschliche Leber baut Alkohol mit einer konstanten Rate von etwa 0,10 bis 0,15 Promille pro Stunde ab (Nullter-Ordnung-Kinetik). Restalkohol am nächsten Morgen führt häufig zu unbewusstem Fahren unter Alkoholeinfluss.',
    faqs: [
      { question: 'Wann darf man nach einer durchzechten Nacht wieder sicher Auto fahren?', answer: 'Wer um 02:00 Uhr nachts 1,2 Promille hat, baut bis 08:00 Uhr morgens nur ca. 0,6 bis 0,9 Promille ab und hat beim Losfahren immer noch 0,3 bis 0,6 Promille im Blut.' },
      { question: 'Hilft fettiges Katerfrühstück beim schnelleren Alkoholabbau?', answer: 'Nein, Nahrung im Magen verzögert lediglich die Aufnahme ins Blut, beschleunigt aber den hepatischen Abbauprozess in der Leber in keiner Weise.' }
    ]
  },
  'intervallfasten-16-8-rechner': {
    intro: 'Der 16:8-Intervallfasten-Rechner strukturiert das tägliche Fasten- und Essensfenster zur Aktivierung von Zellerneuerungsprozessen (Autophagie).',
    details: 'Methode: 16 Stunden Fastenzeit (z. B. von 20:00 Uhr abends bis 12:00 Uhr mittags) gefolgt von einem 8-stündigen Zeitfenster für Mahlzeiten. Während der Fastenphase sind nur Wasser, ungesüßter Tee und schwarzer Kaffee erlaubt.',
    faqs: [
      { question: 'Was ist Autophagie und ab wann setzt sie ein?', answer: 'Autophagie ist die körpereigene Müllabfuhr der Zellen: Geschädigte Zellbestandteile und Fehlfaltungen werden abgebaut und recycelt; dieser Prozess intensiviert sich ab ca. 14 bis 16 Stunden Fastendauer.' },
      { question: 'Bricht ein Schluck Milch im Kaffee das Fasten?', answer: 'Ja, bereits geringe Mengen Kalorien oder Proteine stimulieren Insulin und mTOR und unterbrechen den reinen Fastenstoffwechsel und die Autophagie.' }
    ]
  },
  'proteinbedarf-sportler-rechner': {
    intro: 'Dieser Bedarfsrechner ermittelt die optimale tägliche Proteinmenge in Gramm gestaffelt nach Sportart, Trainingsziel (Erhalt, Hypertrophie, Diät) und fettfreier Körpermasse.',
    details: 'Für Ausdauersportler gelten 1,2 bis 1,4 g/kg, für Kraftsportler im Aufbau 1,6 bis 2,0 g/kg und während einer kalorienreduzierten Diät zum Muskelschutz 2,0 bis 2,4 g/kg fettfreier Masse.',
    faqs: [
      { question: 'Kann der Körper mehr als 30 Gramm Protein pro Mahlzeit verwerten?', answer: 'Ja, die anabole Muskelproteinsynthese wird zwar bei rund 30 bis 40 g Protein maximal stimuliert, größere Proteinmengen werden im Magen-Darm-Trakt jedoch langsamer verdaut und über Stunden vollständig resorbiert.' },
      { question: 'Schadet eine hohe Proteinzufuhr den Nieren?', answer: 'Bei nierengesunden Menschen zeigen Studien bei bis zu 2,5 g/kg keine negativen Auswirkungen auf die Nierenfunktion; eine ausreichende Flüssigkeitszufuhr zur Harnsäureausscheidung ist jedoch Pflicht.' }
    ]
  },
  'blutdruck-klassifikation-rechner': {
    intro: 'Dieser Rechner ordnet Ihre gemessenen systolischen und diastolischen Blutdruckwerte nach den Leitlinien der European Society of Cardiology (ESC/ESH) ein.',
    details: 'Optimal: < 120 / < 80 mmHg; Normal: 120–129 / 80–84 mmHg; Hoch-normal: 130–139 / 85–89 mmHg. Ab 140 mmHg systolisch oder 90 mmHg diastolisch liegt arterielle Hypertonie (Grad 1) vor.',
    faqs: [
      { question: 'Was bedeutet der systolische und der diastolische Wert?', answer: 'Der obere (systolische) Wert misst den maximalen Druck beim Zusammenziehen des Herzmuskels; der untere (diastolische) Wert misst den Dauerdruck in den Gefäßen während der Entspannungsphase.' },
      { question: 'Was ist der Weißkitteleffekt?', answer: 'Ein nervositätsbedingter Anstieg des Blutdrucks ausschließlich in der Arztpraxis; Abhilfe schafft die häusliche Selbstmessung oder eine 24-Stunden-Langzeit-Blutdruckmessung.' }
    ]
  },
  'puls-trainingszonen-rechner': {
    intro: 'Dieser Trainingszonenrechner teilt Ihre Herzfrequenz nach der Karvonen-Methode oder prozentualer HFmax in die fünf Ausdauerbereiche (Zone 1 bis 5) ein.',
    details: 'Zone 1 (50–60 % Rekompensation), Zone 2 (60–70 % Grundlagenausdauer / Fettstoffwechsel), Zone 3 (70–80 % aerob), Zone 4 (80–90 % anaerobe Schwelle), Zone 5 (90–100 % Maximalbereich).',
    faqs: [
      { question: 'Warum ist Zone-2-Training für Ausdauersportler so fundamental?', answer: 'Zone 2 maximiert die Bildung neuer Mitochondrien ("Kraftwerke der Zelle") und trainiert die Muskulatur, Fett effizient als primäre Energiequelle bei submaximaler Belastung zu verbrennen.' },
      { question: 'Wie funktioniert die Karvonen-Formel mit Herzfrequenzreserve?', answer: 'Trainingspuls = Ruhepuls + ((HFmax - Ruhepuls) · Intensität in %). Sie bezieht den individuellen Fitnesszustand über den Ruhepuls direkt in die Zonenberechnung ein.' }
    ]
  },
  'schwimmen-kalorienverbrauch-rechner': {
    intro: 'Schwimmen beansprucht nahezu alle großen Muskelgruppen des Körpers gleichzeitig bei minimaler Gelenkbelastung durch den statischen Auftrieb des Wassers.',
    details: 'Kalorienverbrauch = MET-Wert · Körpergewicht in kg · Dauer in Stunden. Kraulschwimmen zügig (MET ca. 10) verbrennt bei 80 kg Körpergewicht rund 800 kcal pro Stunde; Brustschwimmen moderat ca. 500 kcal/h.',
    faqs: [
      { question: 'Warum schont Schwimmen Sehnen und Gelenke besonders?', answer: 'Weil das Wasser das effektive Körpergewicht um rund 90 Prozent reduziert; Stoßbelastungen auf Knie, Hüfte und Wirbelsäule wie beim Laufen entfallen vollständig.' },
      { question: 'Welcher Schwimmstil verbrennt am meisten Kalorien?', answer: 'Schmetterling (Delfin) mit bis zu 900 kcal pro Stunde, gefolgt von schnellem Kraulschwimmen und zügigem Brustschwimmen.' }
    ]
  },
  'radfahren-kalorien-watt-rechner': {
    intro: 'Auf dem Fahrrad lässt sich der Kalorienverbrauch über die mechanische Tretleistung in Watt (Powermeter) physikalisch exakt ermitteln.',
    details: 'Formel: Energie (kcal) = (Durchschnittsleistung in Watt · Dauer in Stunden · 3,6) / Wirkungsgrad des menschlichen Körpers (ca. 0,24). Bei konstanten 200 Watt über eine Stunde werden exakt ca. 750 kcal Energie verbrannt.',
    faqs: [
      { question: 'Warum ist die Kalorienberechnung mit Wattmessung genauer als über den Puls?', answer: 'Weil ein Powermeter die echte physikalische Arbeit an der Kurbel misst; der Puls schwankt hingegen stark durch Temperatur, Koffein, Schlafmangel oder Dehydration.' },
      { question: 'Wie viel Prozent der Tretenergie kommt am Pedal als Vortrieb an?', answer: 'Der menschliche Muskelwirkungsgrad liegt bei rund 20 bis 25 Prozent; die restlichen 75 bis 80 Prozent der verbrauchten Energie werden als Körperwärme abgegeben.' }
    ]
  }
};
