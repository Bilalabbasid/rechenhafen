import { CategoryGuideMap } from './types';

/*
 * Guides for: datum-zeit, mathematik, geometrie, einheiten, kochen-backen, statistik-wissenschaft.
 * No legal amounts here: calendar facts, formulas and exact unit factors only.
 * Calendar numbers (Arbeitstage 2026/2027, KW 53/2026, Werktage 2027) were checked against the
 * calculator engines (arbeitstage-rechner, wochenrechner, schaltjahr-rechner) on 17.11.2026.
 */
export const MATHE_KUECHE_GUIDES: CategoryGuideMap = {
  'datum-zeit': {
    questions: [
      {
        question: 'Wie viele Tage sind es noch bis zu meinem Termin?',
        slug: 'tage-zwischen-zwei-daten',
        hint: 'zählt Kalendertage, wahlweise mit Starttag, und rechnet sie in Wochen und Monate um',
      },
      {
        question: 'Wie viele Arbeitstage hat 2027 in meinem Bundesland?',
        slug: 'arbeitstage-rechner',
        hint: 'zieht Wochenenden und die Feiertage des gewählten Landes ab, auch für eine Sechstagewoche',
      },
      {
        question: 'Welches Datum ist heute in 90 Tagen?',
        slug: 'datum-plus-tage',
        hint: 'nennt Zieldatum, Wochentag und Kalenderwoche – rückwärts geht es ebenso',
      },
      {
        question: 'In welcher Kalenderwoche liegt der 1. Januar 2027?',
        slug: 'wochenrechner',
        hint: 'ermittelt die KW nach ISO 8601, dazu Quartal und laufenden Tag des Jahres',
      },
      {
        question: 'Wie lange habe ich gearbeitet: 7:45 bis 16:30 Uhr mit 45 Minuten Pause?',
        slug: 'zeitdifferenz-rechner',
        hint: 'ergibt 8 Std. bzw. 8,0 Dezimalstunden; Nachtschichten über Mitternacht klappen auch',
      },
      {
        question: 'Wie alt bin ich genau in Jahren, Monaten und Tagen?',
        slug: 'altersrechner',
        hint: 'rechnet bis heute oder bis zu einem frei gewählten Stichtag',
      },
      {
        question: 'Wann beginnt meine Regelaltersrente, wenn ich im Mai 1962 geboren bin?',
        slug: 'renteneintritt-rechner',
        hint: 'leitet aus Geburtsjahr und -monat Ihre Regelaltersgrenze und den ersten Rentenmonat ab',
      },
      {
        question: 'Ist 2028 ein Schaltjahr?',
        slug: 'schaltjahr-rechner',
        hint: 'prüft jedes Jahr und nennt die Teilbarkeitsregel, die den Ausschlag gibt',
      },
      {
        question: 'Wann feiere ich 25 Jahre im Betrieb?',
        slug: 'dienstjubilaeum-rechner',
        hint: 'listet die Jubiläumsdaten ab Ihrem Eintrittsdatum auf',
      },
    ],
    keyFacts: {
      title: 'Kalenderfakten für 2026 und 2027',
      intro: 'Diese Regeln und Zahlen stecken hinter den Datumsrechnern. Die Arbeitstage gelten für Montag bis Freitag mit den bundesweiten Feiertagen.',
      rows: [
        { label: 'Schaltjahr-Regel', value: 'durch 4 teilbar', note: 'Ausnahme: volle Jahrhunderte, die nur mit Teilbarkeit durch 400 Schaltjahre sind (2000 ja, 2100 nein)' },
        { label: '2026 und 2027', value: 'je 365 Tage', note: 'keine Schaltjahre; der nächste 29. Februar folgt 2028' },
        { label: 'Kalenderwoche 1 (ISO 8601)', value: 'Woche mit dem ersten Donnerstag', note: 'enthält immer den 4. Januar; jede Woche beginnt am Montag' },
        { label: 'Wochen im Jahr 2026', value: '53', note: 'der 1. bis 3. Januar 2027 gehört noch zur KW 53/2026, die KW 1/2027 beginnt am 4. Januar' },
        { label: 'Arbeitstage 2026', value: '254', note: 'Mo–Fr, nur bundesweite Feiertage abgezogen; mit Landesfeiertagen weniger' },
        { label: 'Arbeitstage 2027', value: '256', note: '1. Mai, 3. Oktober und beide Weihnachtstage fallen 2027 auf ein Wochenende' },
        { label: 'Bundesweite gesetzliche Feiertage', value: '9', note: 'hinzu kommen Feiertage einzelner Länder, etwa Fronleichnam oder der Reformationstag' },
      ],
      source: 'Gregorianischer Kalender; ISO 8601; Feiertagsgesetze der Länder. Arbeitstage mit dem Arbeitstage-Rechner (bundesweit) ermittelt.',
    },
    faqs: [
      {
        question: 'Kalendertage, Werktage, Arbeitstage: Welcher Rechner zählt was?',
        answer:
          'Kalendertage sind alle Tage ohne Ausnahme; die zählt der Tagerechner. Werktage sind nach § 3 Abs. 2 BUrlG Montag bis Samstag, soweit kein gesetzlicher Feiertag ist. Arbeitstage sind die Tage, an denen Sie tatsächlich arbeiten müssen, bei einer Fünftagewoche also Montag bis Freitag. Der Arbeitstage-Rechner kann beides: Für 2027 kommt er bundesweit auf 256 Arbeitstage (Mo–Fr) und 306 Werktage (Mo–Sa). Mit den Feiertagen Ihres Bundeslandes sinken beide Zahlen.',
      },
      {
        question: 'Berechnet „Datum plus Tage“ eine gesetzliche Frist?',
        answer:
          'Nur den rechnerischen Teil. Der Rechner addiert Kalendertage zum Ausgangsdatum. Bei Fristen nach dem BGB zählt der Tag des Ereignisses nicht mit (§ 187 Abs. 1 BGB), und fällt das Ende auf einen Samstag, Sonntag oder Feiertag, endet die Frist erst mit dem nächsten Werktag (§ 193 BGB). Diese Verschiebung nimmt der Rechner nicht vor. Beispiel: Zugang am Samstag, 21.11.2026, plus 14 Tage ergibt Samstag, 05.12.2026; das Fristende ist dann Montag, 07.12.2026. Bei Behörden- oder Gerichtsfristen ist die Auskunft der zuständigen Stelle maßgeblich.',
      },
      {
        question: 'Warum zeigt mein Kalender eine andere Kalenderwoche an?',
        answer:
          'In Deutschland gilt die Zählung nach ISO 8601: Die Woche beginnt am Montag, und KW 1 ist die Woche mit dem ersten Donnerstag des Jahres. Deshalb liegt Freitag, der 1. Januar 2027, noch in KW 53 des Jahres 2026. Kalender-Apps mit US-Einstellungen beginnen die Woche oft am Sonntag und zählen die Woche mit dem 1. Januar als Woche 1. Dann weicht die Nummer um eine Woche ab. Prüfen Sie in den Einstellungen den Wochenbeginn und die Regel für die erste Woche.',
      },
    ],
  },

  mathematik: {
    questions: [
      {
        question: 'Wie viel sind 15 Prozent von 80 €?',
        slug: 'prozentrechner',
        hint: '12 € – derselbe Rechner löst auch nach Prozentsatz oder Grundwert auf',
      },
      {
        question: 'Um wie viel Prozent ist die Miete von 750 € auf 810 € gestiegen?',
        slug: 'prozentualer-unterschied-rechner',
        hint: 'um 8 %; bei Prozentsätzen zeigt er zusätzlich die Differenz in Prozentpunkten',
      },
      {
        question: 'Wenn 3 kg Äpfel 7,50 € kosten, was kosten dann 5 kg?',
        slug: 'dreisatzrechner',
        hint: '12,50 € über den Preis je Kilo; antiproportionale Aufgaben gehen ebenfalls',
      },
      {
        question: 'Was ergibt 3/4 plus 2/3?',
        slug: 'bruchrechner',
        hint: '17/12 bzw. 1 5/12, auf den Hauptnenner gebracht und gekürzt',
      },
      {
        question: 'Wie schreibe ich 0,375 als Bruch?',
        slug: 'dezimal-in-bruch-rechner',
        hint: '3/8 – auch periodische Zahlen wie 0,(3) werden erkannt',
      },
      {
        question: 'Wie löse ich die Gleichung x² − 5x + 6 = 0?',
        slug: 'pq-formel-rechner',
        hint: 'x₁ = 3 und x₂ = 2, mit Diskriminante und Scheitelpunkt der Parabel',
      },
      {
        question: 'Was ist die Wurzel aus 50?',
        slug: 'quadratwurzel-rechner',
        hint: 'rund 7,071 oder exakt 5 · √2; höhere Wurzeln lassen sich ebenso ziehen',
      },
      {
        question: 'Ist 221 eine Primzahl?',
        slug: 'teiler-vielfache-rechner',
        hint: 'nein: Die Teilermenge 1, 13, 17, 221 verrät die Zerlegung 13 · 17',
      },
      {
        question: 'Welcher Hauptnenner passt für 1/12 und 1/18?',
        slug: 'kgv-rechner',
        hint: 'das kgV 36, den ggT 6 gibt es gleich mit dazu',
      },
    ],
    keyFacts: {
      title: 'Formeln der Prozentrechnung',
      intro: 'G steht für den Grundwert, W für den Prozentwert und p für den Prozentsatz.',
      rows: [
        { label: 'Prozentwert', value: 'W = G · p / 100', note: '15 % von 80 = 12' },
        { label: 'Prozentsatz', value: 'p = W / G · 100', note: '12 von 80 sind 15 %' },
        { label: 'Grundwert', value: 'G = W · 100 / p', note: '12 sind 15 % von 80' },
        { label: 'Wert vor einer Erhöhung', value: 'G = Endwert / (1 + p/100)', note: '110 nach 10 % Aufschlag: vorher 100' },
        { label: 'Veränderung in Prozent', value: '(neu − alt) / alt · 100', note: '80 → 100 sind +25 %, zurück aber nur −20 %' },
        { label: 'Prozentpunkte', value: 'neuer Satz − alter Satz', note: 'von 2 % auf 3 %: +1 Prozentpunkt, relativ +50 %' },
        { label: 'Promille', value: '1 ‰ = 0,1 %', note: '3 ‰ von 2.000 = 6' },
      ],
    },
    faqs: [
      {
        question: 'Prozentrechner oder Dreisatz – welcher passt zu meiner Aufgabe?',
        answer:
          'Beide rechnen mit Verhältnissen. Steht in der Aufgabe ein Prozentsatz, ist der Prozentrechner der kürzere Weg, weil er Grundwert, Prozentwert und Prozentsatz direkt zuordnet. Der Dreisatz passt für alle anderen Verhältnisse, etwa Preis je Kilo, Benzin je 100 km oder Zutaten pro Person. Nur er kann antiproportional rechnen: Brauchen 4 Maler 6 Tage, brauchen 3 Maler 8 Tage.',
      },
      {
        question: 'Warum bringen +25 % und danach −25 % nicht den Ausgangswert zurück?',
        answer:
          'Weil sich die Basis ändert. 100 plus 25 % sind 125; davon 25 % abgezogen bleiben 93,75. Um von 125 wieder auf 100 zu kommen, reichen 20 %. Dasselbe passiert bei Rabatten und Kursen: Ein Verlust von 50 % braucht danach ein Plus von 100 %, um ausgeglichen zu sein. Der Rechner zur prozentualen Veränderung zeigt deshalb immer auch den Rückweg.',
      },
      {
        question: 'Wann spricht man von Prozentpunkten statt von Prozent?',
        answer:
          'Sobald zwei Prozentsätze verglichen werden. Steigt ein Bauzins von 3 % auf 3,5 %, ist er um 0,5 Prozentpunkte gestiegen, relativ aber um rund 16,7 %. Beide Aussagen stimmen, sie meinen nur Unterschiedliches. Kreuzen Sie im Rechner zur prozentualen Veränderung an, dass beide Werte Prozentsätze sind, dann erhalten Sie beide Zahlen nebeneinander.',
      },
      {
        question: 'Wie genau sind Ergebnisse mit Wurzeln und Dezimalzahlen?',
        answer:
          'Brüche, Teiler, ggT und kgV sind exakt. Wurzeln wie √2 sind irrationale Zahlen und lassen sich nur gerundet als Dezimalzahl zeigen; der Quadratwurzel-Rechner gibt deshalb zusätzlich die exakte Form wie 5 · √2 an. Umgekehrt hat 1/3 keine endliche Dezimaldarstellung: 0,333… ist periodisch. Wer mit gerundeten Zwischenwerten weiterrechnet, erhält kleine Abweichungen, daher erst am Ende runden.',
      },
    ],
  },

  geometrie: {
    questions: [
      {
        question: 'Wie groß ist die Fläche eines runden Tisches mit 3 m Durchmesser?',
        slug: 'kreisrechner',
        hint: 'rund 7,07 m², dazu ein Umfang von 9,42 m',
      },
      {
        question: 'Wie viel Quadratmeter hat ein Zimmer von 4,20 × 3,50 m?',
        slug: 'rechteckrechner',
        hint: '14,7 m²; der Umfang von 15,4 m hilft bei der Fußleiste',
      },
      {
        question: 'Wie viele Liter fasst eine Regentonne mit 60 cm Durchmesser und 90 cm Höhe?',
        slug: 'zylinderrechner',
        hint: 'mit Radius 30 cm etwa 254 Liter; Maße in Zentimetern eingeben',
      },
      {
        question: 'Wie viel Erde passt in ein Hochbeet von 200 × 100 × 80 cm?',
        slug: 'quader-volumen-rechner',
        hint: '1.600 Liter bzw. 1,6 m³, dazu Oberfläche und Raumdiagonale',
      },
      {
        question: 'Wie berechne ich die Fläche eines trapezförmigen Grundstücks?',
        slug: 'trapez-flaeche-rechner',
        hint: 'aus beiden parallelen Seiten und dem Abstand dazwischen',
      },
      {
        question: 'Wie schwer ist ein Meter Stahlrohr mit 60 mm Außendurchmesser und 3 mm Wand?',
        slug: 'hohlzylinder-rohr-rechner',
        hint: 'etwa 4,22 kg; auch für Edelstahl, Aluminium, Kupfer und PVC',
      },
      {
        question: 'Wie viel Volumen hat eine Kugel mit 30 cm Durchmesser?',
        slug: 'kugel-oberflaeche-rechner',
        hint: 'gut 14 Liter; aus einem Volumen lässt sich auch der Radius bestimmen',
      },
      {
        question: 'Wie lang ist der Bogen eines 60°-Kreisausschnitts mit 10 cm Radius?',
        slug: 'kreissegment-rechner',
        hint: '10,47 cm, außerdem Sehne sowie Sektor- und Segmentfläche',
      },
      {
        question: 'Wie viel sind 45 Grad im Bogenmaß?',
        slug: 'bogenmass-grad-rechner',
        hint: 'π/4 ≈ 0,7854 rad oder 50 gon',
      },
    ],
    keyFacts: {
      title: 'Die wichtigsten Flächen- und Volumenformeln',
      intro: 'r ist der Radius, h die Höhe; alle Längen müssen in derselben Einheit vorliegen.',
      rows: [
        { label: 'Kreis', value: 'A = π · r²', note: 'Umfang U = 2 · π · r; π ≈ 3,14159' },
        { label: 'Rechteck', value: 'A = a · b', note: 'Umfang U = 2 · (a + b)' },
        { label: 'Dreieck', value: 'A = g · h / 2', note: 'g ist die Grundseite, h die Höhe darauf' },
        { label: 'Trapez', value: 'A = (a + c) / 2 · h', note: 'a und c sind die parallelen Seiten' },
        { label: 'Zylinder', value: 'V = π · r² · h', note: 'Mantelfläche M = 2 · π · r · h' },
        { label: 'Kegel', value: 'V = π · r² · h / 3', note: 'ein Drittel des Zylinders mit gleicher Grundfläche' },
        { label: 'Kugel', value: 'V = 4/3 · π · r³', note: 'Oberfläche O = 4 · π · r²' },
        { label: 'Volumen in Litern', value: '1 dm³ = 1 l', note: '1 m³ = 1.000 l; 1.000 cm³ = 1 l' },
      ],
    },
    faqs: [
      {
        question: 'Warum wächst die Fläche so viel stärker als der Durchmesser?',
        answer:
          'Flächen hängen vom Quadrat der Länge ab, Volumen von der dritten Potenz. Ein Kreis mit 1 m Durchmesser hat rund 0,79 m², einer mit 2 m schon 3,14 m², also das Vierfache. Bei der Kugel ist es noch deutlicher: 30 cm Durchmesser fassen gut 14 Liter, 15 cm nur knapp 1,8 Liter, ein Achtel davon. Schätzungen nach Augenmaß liegen deshalb oft weit daneben.',
      },
      {
        question: 'Welche Einheit muss ich eingeben?',
        answer:
          'Alle Maße einer Rechnung brauchen dieselbe Einheit. Der häufigste Fehler ist eine Mischung aus Metern und Zentimetern. Der Kreisrechner lässt Sie zwischen mm, cm, dm, m und km wählen; Zylinder-, Quader- und Trapezrechner erwarten Zentimeter. Zum Umrechnen: cm² geteilt durch 10.000 ergibt m², cm³ geteilt durch 1.000 ergibt Liter.',
      },
      {
        question: 'Wie berechne ich eine unregelmäßige Fläche, etwa ein L-förmiges Zimmer?',
        answer:
          'Zerlegen Sie die Fläche in Rechtecke, Dreiecke oder Trapeze, berechnen Sie jedes Stück einzeln und addieren Sie die Ergebnisse. Ein L-Zimmer aus 5 × 4 m und einem Erker von 2 × 1,5 m hat 20 + 3 = 23 m². Bei Wohnflächen wird oft die Wohnflächenverordnung angewendet; danach zählen Flächen unter Dachschrägen mit weniger als 2 m Höhe zählen nur zur Hälfte, unter 1 m gar nicht.',
      },
      {
        question: 'Zylinder- oder Rohrrechner: Was nehme ich für ein Rohr?',
        answer:
          'Das hängt davon ab, was Sie wissen wollen. Für den Inhalt eines Rohres oder Tanks zählt der Innenraum: Den rechnet der Zylinderrechner mit dem Innenradius. Der Hohlzylinder- und Rohr-Rechner bestimmt dagegen das Material der Wand und daraus das Gewicht, zeigt aber zusätzlich das Füllvolumen an. Ein Meter Rohr mit 60 mm außen und 3 mm Wand fasst innen etwa 2,29 Liter.',
      },
    ],
  },

  einheiten: {
    questions: [
      {
        question: 'Wie viele Kilometer sind 26,2 Meilen?',
        slug: 'laengen-umrechner',
        hint: '42,16 km – die Marathondistanz, umgerechnet mit 1,609344 km je Meile',
      },
      {
        question: 'Wie viel Zoll hat ein Fernseher mit 140 cm Bildschirmdiagonale?',
        slug: 'zoll-in-cm-rechner',
        hint: 'rund 55 Zoll; Breite und Höhe bei 16:9 werden mitgeliefert',
      },
      {
        question: 'Wie viel Grad Celsius sind 350 °F im Backofen?',
        slug: 'temperatur-umrechner',
        hint: 'knapp 177 °C, also praktisch 175 bis 180 °C',
      },
      {
        question: 'Wie viel Kilogramm sind 150 Pfund?',
        slug: 'gewicht-masse-umrechner',
        hint: 'rund 68 kg, gemeint ist das englische Pfund (lbs)',
      },
      {
        question: 'Wie viel PS hat ein Auto mit 110 kW?',
        slug: 'leistung-umrechner',
        hint: 'knapp 150 PS; die US-Angabe in hp liegt etwas darunter',
      },
      {
        question: 'Warum zeigt Windows bei einer 1-TB-Festplatte nur 931 GB an?',
        slug: 'daten-speicher-umrechner',
        hint: 'stellt dezimale Gigabyte und binäre Gibibyte gegenüber',
      },
      {
        question: 'Wie lange dauert ein Download von 50 GB mit 100 Mbit/s?',
        slug: 'datenrate-bandbreite-umrechner',
        hint: 'ohne Verluste gut 1 Stunde 6 Minuten bei 12,5 MB/s; Overhead lässt sich einrechnen',
      },
      {
        question: 'Wie viel bar sind 32 PSI Reifendruck?',
        slug: 'druck-umrechner',
        hint: 'etwa 2,2 bar, außerdem hPa, MPa und Torr',
      },
      {
        question: 'Wie viele Kilowattstunden stecken in 2.000 kcal?',
        slug: 'energie-arbeit-umrechner',
        hint: 'rund 2,32 kWh, gerechnet mit 1 kcal = 4,184 kJ',
      },
      {
        question: 'Welche US-Schuhgröße entspricht EU 42?',
        slug: 'schuhe-kleidergroessen-umrechner',
        hint: 'rechnet über die Fußlänge in cm; Herstellertabellen können abweichen',
      },
    ],
    keyFacts: {
      title: 'Exakte Umrechnungsfaktoren',
      intro: 'Die angloamerikanischen Einheiten sind seit 1959 über metrische Werte festgelegt. Diese Faktoren sind deshalb exakt, nicht gerundet.',
      rows: [
        { label: '1 Zoll (inch)', value: '2,54 cm', note: '1 Fuß = 12 Zoll = 30,48 cm' },
        { label: '1 Meile', value: '1,609344 km', note: 'internationale Landmeile' },
        { label: '1 Seemeile', value: '1,852 km', note: '1 Knoten = 1,852 km/h' },
        { label: '1 Pfund (lb)', value: '0,45359237 kg', note: 'das deutsche Pfund im Alltag sind 500 g' },
        { label: '1 PS', value: '735,49875 W', note: '1 kW ≈ 1,35962 PS' },
        { label: '1 bar', value: '100.000 Pa', note: '= 1.000 hPa' },
        { label: 'Celsius → Fahrenheit', value: '°F = °C · 1,8 + 32', note: 'Kelvin: K = °C + 273,15' },
        { label: '1 GB / 1 GiB', value: '10⁹ / 2³⁰ Byte', note: '1 GiB = 1.073.741.824 Byte ≈ 1,074 GB' },
      ],
      source: 'Internationales Einheitensystem (SI, BIPM); internationale Yard-and-Pound-Vereinbarung von 1959; IEC 80000-13 für Binärpräfixe.',
    },
    faqs: [
      {
        question: 'Sind die Ergebnisse exakt oder gerundet?',
        answer:
          'Bei Zoll, Fuß, Meile, Pfund und Seemeile ist der Faktor exakt definiert; gerundet wird nur die Anzeige. Bei der Gallone kommt es darauf an, welche gemeint ist: Die US-Gallone hat 3,785411784 Liter, die britische 4,54609 Liter. Temperaturen lassen sich nicht mit einem einzigen Faktor umrechnen, weil die Skalen unterschiedliche Nullpunkte haben: 20 °C sind 68 °F, 40 °C aber nicht 136 °F, sondern 104 °F.',
      },
      {
        question: 'Mbit/s oder MB/s: Warum ist mein Download langsamer als der Tarif?',
        answer:
          'Internetanbieter geben Megabit pro Sekunde an, Browser und Download-Manager meist Megabyte pro Sekunde. Ein Byte hat 8 Bit, also schafft eine 100-Mbit/s-Leitung höchstens 12,5 MB/s. Dazu kommen Protokoll-Overhead, WLAN-Verluste und die Geschwindigkeit des Servers. Im Downloadzeit-Rechner können Sie dafür einen Verlust in Prozent einstellen.',
      },
      {
        question: 'Warum kann ich Cups und Esslöffel hier nicht in Gramm umrechnen?',
        answer:
          'Weil das keine reine Einheitenfrage ist. Ein Volumen lässt sich nur mit der Dichte der jeweiligen Zutat in ein Gewicht umrechnen: Ein US-Cup Mehl wiegt etwa 125 g, ein Cup Zucker etwa 200 g. Der Volumen-Umrechner wandelt deshalb nur Volumen in Volumen um, etwa Gallonen in Liter. Für Rezeptangaben gibt es eigene Rechner im Bereich Kochen & Backen.',
      },
      {
        question: 'Pfund, Zentner, Doppelzentner: Was ist was?',
        answer:
          'Im deutschen Alltag ist ein Pfund 500 g, ein Zentner 50 kg und ein Doppelzentner 100 kg. Das englische Pound (lb) ist mit 453,59237 g etwas leichter. In Österreich und der Schweiz steht der Zentner dagegen meist für 100 kg. Bei Angaben aus amerikanischen Quellen ist mit „lb“ immer das englische Pound gemeint.',
      },
    ],
  },

  'kochen-backen': {
    questions: [
      {
        question: 'Wie viel brauche ich, wenn das Rezept für 4 Personen ist und 6 mitessen?',
        slug: 'portionsrechner',
        hint: 'Faktor 1,5 für jede Zutat, aus 300 g werden 450 g',
      },
      {
        question: 'Das Rezept ist für eine 26er-Springform, ich habe nur 20 cm – wie viel Teig?',
        slug: 'backform-umrechner',
        hint: 'Faktor 0,59, also gut 40 % weniger, weil die Bodenfläche zählt',
      },
      {
        question: 'Wie viel Trockenhefe ersetzt einen Würfel frische Hefe?',
        slug: 'hefe-umrechner',
        hint: '42 g frische Hefe entsprechen 14 g, also zwei Päckchen Trockenhefe',
      },
      {
        question: 'Wie viel Gramm Mehl sind 1 Cup?',
        slug: 'cups-in-gramm-rechner',
        hint: 'etwa 125 g bei einem US-Cup; Zucker wiegt pro Cup rund 200 g',
      },
      {
        question: 'Wie viel Gramm wiegt ein Esslöffel Zucker?',
        slug: 'essloeffel-teeloeffel-gramm-rechner',
        hint: 'gestrichen etwa 15 g, gehäuft eher 20 g – je Zutat verschieden',
      },
      {
        question: 'Welche Temperatur nehme ich bei Umluft statt 180 °C Ober-/Unterhitze?',
        slug: 'backzeit-temperatur-umluft-oberhitze-rechner',
        hint: 'rund 160 °C und etwa 10 % kürzere Backzeit als Faustregel',
      },
      {
        question: 'Wie viel Erythrit nehme ich statt 100 g Zucker?',
        slug: 'zucker-ersatz-rechner',
        hint: 'etwa 143 g, um die geringere Süßkraft auszugleichen',
      },
      {
        question: 'Welche Kerntemperatur muss ein Hähnchen erreichen?',
        slug: 'fleisch-kerntemperatur-garzeit-rechner',
        hint: 'nennt Zieltemperatur, Ofentemperatur und grobe Garzeit je Fleischart',
      },
      {
        question: 'Wie viele Nudeln koche ich für 4 Personen?',
        slug: 'nudeln-rohmaerk-gewicht-rechner',
        hint: 'als Hauptgericht rund 440 g trocken; die Portionsgröße lässt sich anpassen',
      },
    ],
    keyFacts: {
      title: 'Typische Küchenmaße',
      intro: 'Die Volumen der Löffel und Cups sind feste Konventionen. Die Gewichte sind typische Durchschnittswerte, wie sie auch die Rechner verwenden; Ihre Zutaten können abweichen.',
      rows: [
        { label: '1 Esslöffel (EL)', value: '15 ml', note: 'gestrichen typisch: Zucker 15 g, Mehl 10 g, Salz 18 g' },
        { label: '1 Teelöffel (TL)', value: '5 ml', note: 'gestrichen typisch: Zucker 5 g, Salz 6 g' },
        { label: '1 US-Cup', value: '236,6 ml', note: 'typisch: Mehl 125 g, Zucker 200 g' },
        { label: '1 Würfel frische Hefe', value: '42 g', note: '≈ 14 g Trockenhefe (2 Päckchen à 7 g), Richtwert für etwa 1 kg Mehl' },
        { label: 'Backform wechseln', value: 'Faktor = (d neu / d alt)²', note: 'von 26 auf 20 cm: × 0,59' },
        { label: 'Umluft statt Ober-/Unterhitze', value: 'etwa 20 °C weniger', note: 'Faustregel; Hinweise des Ofenherstellers gehen vor' },
        { label: 'Geflügel durchgaren', value: '70 °C im Kern', note: 'mindestens 2 Minuten lang (Empfehlung des BfR)' },
        { label: 'Hackfleisch von der Theke', value: 'am Einkaufstag', note: 'verarbeiten; verpacktes Hack bis zum Verbrauchsdatum (BZfE)' },
      ],
      source: 'Küchenmaße: übliche Konventionen und Durchschnittswerte; Hygiene: Bundesinstitut für Risikobewertung (BfR), Bundeszentrum für Ernährung (BZfE).',
    },
    faqs: [
      {
        question: 'Was ändert sich außer der Teigmenge, wenn ich die Backform wechsle?',
        answer:
          'Eine 20-cm-Form hat nur 314 cm² Boden, eine 26-cm-Form 531 cm². Füllen Sie den vollen Teig in die kleine Form, wird der Kuchen fast 1,7-mal so hoch und braucht innen deutlich länger; machen Sie gegen Ende die Stäbchenprobe. Rechnen Sie den Teig herunter, werden aus 4 Eiern rechnerisch 2,4: Verquirlen Sie dann 3 Eier und wiegen Sie den passenden Anteil ab. Eckige Formen deckt der Rechner nicht ab; dort rechnen Sie mit Länge mal Breite.',
      },
      {
        question: 'Cups, Löffel oder Waage – was ist genauer?',
        answer:
          'Die Küchenwaage. Wie viel Mehl in einen Cup oder Löffel passt, hängt davon ab, ob es gesiebt, locker eingefüllt oder angedrückt ist, und das macht spürbar etwas aus. Die Rechner nutzen deshalb Durchschnittswerte. Bei Wasser und Milch ist das unkritisch, weil ein Milliliter etwa ein Gramm wiegt. Honig wiegt dagegen rund 1,4 g pro Milliliter.',
      },
      {
        question: 'Kann ich jedes Rezept einfach hochrechnen?',
        answer:
          'Die Zutaten ja, vieles andere nicht. Salz, Gewürze und Backtriebmittel sollten Sie beim Vervielfachen zunächst sparsamer dosieren und abschmecken. Garzeiten steigen nicht im gleichen Verhältnis: Ein doppelt so schwerer Braten braucht länger, aber nicht doppelt so lange, und ein höherer Kuchen backt anders als zwei flache. Prüfen Sie außerdem, ob Topf, Form und Ofen die größere Menge fassen.',
      },
      {
        question: 'Was können die Rechner bei Lebensmittelsicherheit nicht leisten?',
        answer:
          'Sie geben Richtwerte, keine Garantie. Ob Fleisch durchgegart ist, zeigt nur ein Thermometer an der dicksten Stelle; Garzeiten pro Kilo sind Schätzungen. Haltbarkeitsangaben setzen eine Kühlschranktemperatur von 2 bis 7 °C und einwandfreie Ware voraus. Steht auf der Packung „zu verbrauchen bis“, gilt dieses Datum, nicht der Rechner. Das Mindesthaltbarkeitsdatum ist dagegen kein Verfallsdatum: Danach Aussehen, Geruch und Geschmack prüfen.',
      },
    ],
  },

  'statistik-wissenschaft': {
    questions: [
      {
        question: 'Wie berechne ich die Standardabweichung meiner Messwerte?',
        slug: 'standardabweichung-rechner',
        hint: 'liefert s mit n − 1 für Stichproben und σ mit n für die Grundgesamtheit',
      },
      {
        question: 'Was sind Mittelwert und Median von 1, 2, 3 und 100?',
        slug: 'durchschnittsrechner',
        hint: 'Mittelwert 26,5, Median 2,5 – der Ausreißer zieht nur den Mittelwert',
      },
      {
        question: 'Ab welchem Wert gehört ein Ergebnis zu den besten 10 Prozent?',
        slug: 'perzentil-rechner',
        hint: 'bestimmt das 90. Perzentil aus sechs Werten mit linearer Interpolation',
      },
      {
        question: 'Wie wahrscheinlich ist mindestens eine Sechs mit vier Würfeln?',
        slug: 'wahrscheinlichkeit-wuerfel-muenze-rechner',
        hint: '51,77 %, berechnet über die Gegenwahrscheinlichkeit 1 − (5/6)⁴',
      },
      {
        question: 'Wie groß ist der prozentuale Unterschied zwischen zwei Messwerten?',
        slug: 'prozentualer-unterschied-rechner',
        hint: 'zeigt Veränderung und symmetrischen Unterschied, wenn keiner der Werte die Basis ist',
      },
      {
        question: 'Wie schreibe ich 0,000045 in wissenschaftlicher Notation?',
        slug: 'zehnerpotenzen-rechner',
        hint: '4,5 · 10⁻⁵, zerlegt in Mantisse und Exponent',
      },
      {
        question: 'Welcher Strom fließt bei 230 V durch einen Widerstand von 46 Ω?',
        slug: 'ohmsches-gesetz-rechner',
        hint: '5 A nach I = U / R, dazu eine Leistung von 1.150 W',
      },
      {
        question: 'Welchem Schalldruck entsprechen 80 dB?',
        slug: 'dezibel-schalldruck-umrechner',
        hint: '0,2 Pa, mit einer vergleichbaren Lärmquelle zur Einordnung',
      },
    ],
    keyFacts: {
      title: 'Formeln der beschreibenden Statistik',
      intro: 'xᵢ sind die einzelnen Werte, n ist ihre Anzahl, x̄ der Mittelwert der Stichprobe und μ der Mittelwert der Grundgesamtheit.',
      rows: [
        { label: 'Arithmetisches Mittel', value: 'x̄ = Σxᵢ / n', note: 'Summe aller Werte geteilt durch ihre Anzahl' },
        { label: 'Median', value: 'mittlerer Wert der sortierten Reihe', note: 'bei gerader Anzahl der Mittelwert der beiden mittleren Werte' },
        { label: 'Varianz einer Stichprobe', value: 's² = Σ(xᵢ − x̄)² / (n − 1)', note: 'wenn die Daten nur einen Teil einer größeren Menge abbilden' },
        { label: 'Varianz der Grundgesamtheit', value: 'σ² = Σ(xᵢ − μ)² / n', note: 'wenn wirklich alle Elemente erfasst sind' },
        { label: 'Standardabweichung', value: 's = √s² bzw. σ = √σ²', note: 'hat dieselbe Einheit wie die Messwerte' },
        { label: 'Mindestens ein Treffer', value: 'P = 1 − (1 − p)ⁿ', note: 'Würfel: 1 − (5/6)ⁿ' },
        { label: 'Ohmsches Gesetz', value: 'U = R · I', note: 'Leistung P = U · I' },
      ],
    },
    faqs: [
      {
        question: 'Stichprobe oder Grundgesamtheit: Welche Standardabweichung brauche ich?',
        answer:
          'Haben Sie alle Elemente erfasst, die Sie beschreiben wollen, etwa die Noten genau dieser einen Klasse, gilt σ mit dem Nenner n. Stehen Ihre Daten dagegen für eine größere Menge, zum Beispiel 50 befragte Kunden für alle Kunden, nehmen Sie s mit dem Nenner n − 1. Weil der Mittelwert aus denselben Daten geschätzt wird, fallen die Abweichungen sonst im Schnitt zu klein aus; mit n − 1 ist die Varianz s² erwartungstreu (Bessel-Korrektur). Für 2, 4, 4, 4, 5, 5, 7, 9 ist σ = 2, s ≈ 2,14. Mit wachsendem n wird der Unterschied kleiner.',
      },
      {
        question: 'Wann ist der Median aussagekräftiger als der Mittelwert?',
        answer:
          'Wenn einzelne Extremwerte vorkommen. Fünf Monatsgehälter von 2.800, 3.000, 3.200, 3.400 und 12.000 € ergeben einen Mittelwert von 4.880 €, obwohl vier von fünf Personen weniger als 3.500 € verdienen. Der Median liegt bei 3.200 € und beschreibt die typische Person besser. Deshalb werden Einkommen und Mieten meist als Median angegeben. Bei symmetrisch verteilten Messwerten liegen beide Kennzahlen dagegen nah beieinander.',
      },
      {
        question: 'Warum liefern Programme für dasselbe Perzentil verschiedene Werte?',
        answer:
          'Für Perzentile gibt es mehrere gebräuchliche Definitionen, die sich vor allem bei wenigen Werten unterscheiden. Der Perzentil-Rechner interpoliert linear mit dem Index p · (n − 1); das entspricht der Excel-Funktion QUANTIL.INKL. Für 10, 25, 40, 55, 70 und 85 ergibt das ein 90. Perzentil von 77,5. QUANTIL.EXKL rechnet mit (n + 1) und kommt bei so wenigen Werten zu einem anderen Ergebnis. Geben Sie bei Auswertungen deshalb die Methode an.',
      },
      {
        question: 'Wie berechne ich Wahrscheinlichkeiten, die der Würfelrechner nicht abdeckt?',
        answer:
          'Der Rechner beantwortet eine bestimmte Frage: die Chance auf mindestens eine Sechs mit bis zu zehn Würfeln. Das Prinzip dahinter lässt sich übertragen, solange die Versuche unabhängig sind: Die Chance auf mindestens einen Treffer ist 1 minus die Chance auf keinen. Fällt ein Bauteil mit 2 % Wahrscheinlichkeit aus, liegt die Chance auf mindestens einen Ausfall unter 20 Bauteilen bei 1 − 0,98²⁰ ≈ 33 %. Signifikanztests oder Konfidenzintervalle bieten die Rechner nicht.',
      },
    ],
  },
};
