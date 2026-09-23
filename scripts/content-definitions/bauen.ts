import { CalcContent } from './types';

export const BAUEN_CONTENT: Record<string, CalcContent> = {
  'farbmengen-rechner': {
    intro: 'Dieser Farbrechner kalkuliert den genauen Farbbedarf in Litern für Wand- und Deckenanstriche aus Raummaßen, Deckkraft und Untergrundsaugfähigkeit.',
    details: 'Wandfläche = 2 · (Länge + Breite) · Raumhöhe abzüglich Fenster- und Türöffnungen. Bei durchschnittlicher Ergiebigkeit (ca. 6 bis 7 m² pro Liter) und stark saugendem Untergrund (Putz, Raufaser) sind meist zwei Anstriche erforderlich.',
    faqs: [
      { question: 'Wie viel Prozent Verschnitt bzw. Sicherheitsreserve sollte man bei Farbe einplanen?', answer: 'Planen Sie ca. 10 bis 15 Prozent Reserve für Ecken, Kanten, Walzenverluste und spätere Ausbesserungsarbeiten ein.' },
      { question: 'Was bedeuten die Deckkraftklassen (Klasse 1 bis 4 nach DIN EN 13300)?', answer: 'Klasse 1 deckt bei vorgegebener Ergiebigkeit mindestens 99,5 % des Untergrunds ab (oft reicht 1 Anstrich); Klasse 2 deckt 98 bis 99,5 %; Klasse 3 und 4 erfordern fast immer Mehrfachanstrich.' }
    ]
  },
  'bodenbelag-rechner': {
    intro: 'Dieser Mengenrechner bestimmt den Quadratmeterbedarf für Laminat, Parkett, Vinyl oder Fliesen inklusive maßgeschneidertem Verschnittaufschlag.',
    details: 'Raumfläche = Länge · Breite. Für rechtwinklige Räume im Standardverband genügen ca. 5 bis 7 Prozent Verschnitt; bei diagonalem Verlegemuster, unregelmäßigen Winkeln oder Erkern sollten 10 bis 12 Prozent eingerechnet werden.',
    faqs: [
      { question: 'Muss Bodenbelag vor der Verlegung akklimatisiert werden?', answer: 'Ja, Parkett, Laminat und Klick-Vinyl sollten mindestens 48 Stunden ungeöffnet flach liegend im Verlegeraum bei normaler Raumtemperatur gelagert werden.' },
      { question: 'Wie rechnet man die benötigte Paketanzahl aus?', answer: 'Teilen Sie die Gesamtfläche inklusive Verschnitt durch den m²-Inhalt eines Pakets und runden Sie immer auf die nächste volle Packung auf.' }
    ]
  },
  betonrechner: {
    intro: 'Dieser Betonmengenrechner ermittelt das benötigte Raumvolumen in Kubikmetern (m³) und das Fertiggewicht in Tonnen für Fundamente, Bodenplatten und Stützen.',
    details: 'Normalbeton (Klasse C20/25 oder C25/30) hat eine Rohdichte von ca. 2,3 bis 2,4 Tonnen pro Kubikmeter. 1 m³ Frischbeton benötigt ca. 300 kg Zement, 1.850 kg Zuschlag (Kies/Sand) und 150 bis 170 Liter Anmachwasser.',
    faqs: [
      { question: 'Wie viel Verdichtungszuschlag muss bei Frischbeton eingerechnet werden?', answer: 'Rechnen Sie mit etwa 5 bis 8 Prozent Volumenschwund durch das Rütteln/Verdichten und Unebenheiten im Erdreich.' },
      { question: 'Wann lohnt sich Transportbeton (Fahrmischer) statt selber mischen?', answer: 'Ab einem Volumen von ca. 1,0 bis 1,5 Kubikmetern ist Transportbeton wirtschaftlicher, körperlich schonender und garantiert gleichmäßige Festigkeitsklassen nach DIN EN 206.' }
    ]
  },
  'estrich-rechner': {
    intro: 'Dieser Estrichrechner kalkuliert den Materialbedarf (Estrichsand, Zement oder Fertig-Trockenestrich in Säcken) basierend auf Raumfläche und Einbaustärke.',
    details: 'Volumen = Fläche in m² · Estrichdicke in Metern. Bei schwimmendem Zementestrich auf Dämmung nach DIN 18560 ist eine Mindestnenndicke von 40 bis 45 mm (bei Fußbodenheizung meist 45 bis 65 mm Rohrüberdeckung) vorgeschrieben.',
    faqs: [
      { question: 'Wie lange muss Zementestrich vor dem Belegen mit Fliesen oder Parkett trocknen?', answer: 'Als Faustregel gilt: Mindestens 1 Woche pro Zentimeter Dicke bis 4 cm, danach 2 Wochen pro weiterem Zentimeter; vor der Belegreife ist eine CM-Feuchtigkeitsmessung Pflicht.' },
      { question: 'Wie viele 25-kg-Säcke Fertigestrich benötigt man für 1 m² bei 5 cm Dicke?', answer: 'Bei ca. 20 kg Trockenmörtel pro m² und Zentimeter Schichtdicke werden 100 kg Material (exakt 4 Säcke zu je 25 kg) pro Quadratmeter benötigt.' }
    ]
  },
  'daemmung-u-wert-rechner': {
    intro: 'Der Wärmedurchgangskoeffizient (U-Wert in W/(m²·K)) beziffert den Wärmeverlust durch ein Bauteil nach den Anforderungen des Gebäudeenergiegesetzes (GEG).',
    details: 'Formel: U = 1 / (Rsi + Summe(d / lambda) + Rse), wobei d die Schichtdicke in Metern und lambda die Wärmeleitfähigkeit des Dämmstoffs (z. B. 0,032 bis 0,040 W/(m·K)) ist. Je kleiner der U-Wert, desto besser die Dämmung.',
    faqs: [
      { question: 'Welche U-Werte fordert das GEG für Dach und Fassade bei Sanierung?', answer: 'Das GEG verlangt bei Erneuerung für Außenwände maximal 0,24 W/(m²·K) und für Steildächer bzw. oberste Geschossdecken maximal 0,14 bzw. 0,24 W/(m²·K).' },
      { question: 'Was ist der Unterschied zwischen Wärmeleitstufe (WLS) und U-Wert?', answer: 'Die WLS (z. B. 035) beschreibt die Materialeigenschaft des Dämmstoffs; der U-Wert ist die Gesamteigenschaft des fertigen Bauteils inklusive Schichtdicke.' }
    ]
  },
  'dachflaeche-rechner': {
    intro: 'Dieser Geometrierechner ermittelt die reale Schrägdachfläche von Satteldächern, Pultdächern und Walmdächern aus Grundrissmaß und Dachneigung.',
    details: 'Wahre Dachlänge = Horizontale Sparrenlänge / cos(Dachneigung in Grad). Hinzu kommen die Dachüberstände an Traufe und Ortgang. Bei 45° Neigung ist die Dachfläche um den Faktor 1,414 größer als die überbaute Grundfläche.',
    faqs: [
      { question: 'Wie berechnet man die Anzahl benötigter Dachziegel?', answer: 'Multiplizieren Sie die berechnete Dachfläche mit dem Stückbedarf pro Quadratmeter laut Datenblatt des Ziegelherstellers (typisch ca. 9,5 bis 15 Ziegel/m²) plus 5 % Verschnitt.' },
      { question: 'Ab welcher Dachneigung ist ein regensicheres Unterdach Pflicht?', answer: 'Unterschreitet die Dachneigung die Regeldachneigung des Ziegels (oft 22°), müssen nach den Fachregeln des ZVDH regensichere oder wasserdichte Unterdächer ausgeführt werden.' }
    ]
  },
  'bausteine-mauerwerk-rechner': {
    intro: 'Dieser Baustoffkalkulator berechnet die Stückzahl von Mauersteinen (Kalksandstein, Porenbeton, Ziegel) und den Mörtelbedarf pro Quadratmeter Wandfläche.',
    details: 'Bedarf = Wandfläche / (Steinlänge + Stoßfuge) · (Steinhöhe + Lagerfuge). Bei Dünnbettmörtel entfällt die Dicke der Lagerfuge (nur ca. 1 bis 2 mm Fuge), was den Steinbedarf exakt auf das Nennmaß abstimmt.',
    faqs: [
      { question: 'Was bedeutet das Mauerwerksmaß nach DIN 4172 (Achtelmeter)?', answer: 'Das deutsche Bauraster basiert auf dem Modul von 12,5 cm (Achtelmeter: 12,5 cm, 25 cm, 37,5 cm etc.), um Bauten ohne aufwendiges Zerschneiden von Steinen zu planen.' },
      { question: 'Wie viel Mörtel benötigt man für 1 m² Mauerwerk?', answer: 'Bei Dickbettmörtel ca. 30 bis 40 Liter Mörtel pro m² Wand; bei Plansteinen mit Dünnbettmörtel werden nur rund 3 bis 5 kg Trockenkleber benötigt.' }
    ]
  },
  'fliesenkleber-rechner': {
    intro: 'Dieser Verbrauchsrechner ermittelt die benötigte Menge an Fliesenkleber in Kilogramm basierend auf Fliesenformat, Zahnspachtelgröße und Untergrund.',
    details: 'Formel: Verbrauch = Fläche in m² · Kleberverbrauch (kg/m²). Richtwerte: 6-mm-Zahnung ca. 2,0–2,5 kg/m²; 8-mm-Zahnung ca. 3,0–3,5 kg/m²; 10- bis 12-mm-Zahnung für Großformate ca. 4,5–6,0 kg/m².',
    faqs: [
      { question: 'Welche Zahnung benötigt man für Fliesen ab 60 × 60 cm?', answer: 'Für großformatige Fliesen empfiehlt sich mindestens eine 10-mm- oder 12-mm-Zahnung sowie das Floating-Buttering-Verfahren (Kleber auf Untergrund und Fliesenrückseite).' },
      { question: 'Welcher Fliesenkleber eignet sich für Fußbodenheizungen?', answer: 'Zwingend ein flexibler Kleber (Klassifizierung C2 TE S1 nach DIN EN 12004), der thermische Spannungen und Dehnungen des Estrichs rissfrei ausgleicht.' }
    ]
  },
  'aushub-erdarbeiten-rechner': {
    intro: 'Dieser Erdbau-Rechner kalkuliert das Aushubvolumen für Baugruben, Streifenfundamente oder Pools und berücksichtigt den Auflockerungsfaktor des Bodens.',
    details: 'Festes Bodenvolumen = Länge · Breite · Tiefe. Durch das Ausgraben lockert sich Erdreich auf: Der Auflockerungsfaktor beträgt je nach Bodenklasse 1,2 (Sand/Kies) bis 1,4 (bindiger Ton/Lehm). Das Abfuhrvolumen ist entsprechend größer.',
    faqs: [
      { question: 'Warum benötigt man für den Erdaushub einen Böschungswinkel?', answer: 'Nach DIN 4124 dürfen Baugruben ab 1,25 m Tiefe nicht senkrecht abgegraben werden: Bei nichtbindigen Böden ist ein Böschungswinkel von max. 45° einzuhalten, um Einsturzgefahr zu verhindern.' },
      { question: 'Wie viele LKW-Ladungen entsprechen 50 m³ festem Aushub?', answer: 'Bei einem Auflockerungsfaktor von 1,3 entstehen 65 m³ loses Schüttgut. Ein 4-Achs-Kipper fasst ca. 10 m³, sodass etwa 7 LKW-Fuhren erforderlich sind.' }
    ]
  },
  'pflastersteine-rechner': {
    intro: 'Dieser Mengenrechner ermittelt die Quadratmeter an Pflastersteinen, die Randeinfassungen und den Unterbau (Schottertragschicht und Pflastersplitt).',
    details: 'Pflasterfläche = Länge · Breite. Für befahrbare PKW-Einfahrten ist ein Unterbau aus mindestens 20 bis 30 cm verdichtetem Frostschutz-Schotter (Körnung 0/32) plus 3 bis 5 cm Pflasterbettung (Splitt 2/5 mm) nach RStO vorgeschrieben.',
    faqs: [
      { question: 'Wie stark müssen Pflastersteine für eine PKW-Einfahrt sein?', answer: 'Für normale PKW-Nutzung genügen 6 cm Steindicke; bei häufigem Rangieren oder gelegentlichem Befahren mit schweren Fahrzeugen sind 8 cm Steindicke erforderlich.' },
      { question: 'Welches Gefälle sollte eine gepflasterte Fläche aufweisen?', answer: 'Mindestens 2 bis 2,5 Prozent Gefälle vom Haus weg, damit Regenwasser zügig abfließt und nicht ins Mauerwerk oder die Hausdämmung eindringt.' }
    ]
  },
  'trockenbau-gipskarton-rechner': {
    intro: 'Dieser Materialrechner kalkuliert die Anzahl der Gipskartonplatten, UW- und CW-Ständerprofile, Dämmwolle und Schnellbauschrauben für Ständerwände und Decken.',
    details: 'Wandfläche = Länge · Raumhöhe. Bei beidseitiger Doppelbeplankung (Standard für optimalen Schall- und Brandschutz nach DIN 4102) wird die vierfache Wandfläche an Platten benötigt. Profilabstand: typisch 62,5 cm (halbes Plattenmaß).',
    faqs: [
      { question: 'Welche Plattenart gehört in Feuchträume (Bad)?', answer: 'Immer imprägnierte Gipskartonplatten (grün, Typ GKBI / DIN EN 520 Typ H2), die Feuchtigkeitsaufnahme und Schimmelbildung hemmen.' },
      { question: 'Wie viele Schrauben benötigt man pro Quadratmeter Gipskarton?', answer: 'Bei einfacher Beplankung ca. 15 bis 20 Schnellbauschrauben pro m²; bei Doppelbeplankung ca. 30 Schrauben pro m² mit versetzten Fugen.' }
    ]
  },
  'fundament-rechner': {
    intro: 'Dieser Fundamentplaner berechnet das Betonvolumen für Punktfundamente (Zaun, Carport), Streifenfundamente (Gartenmauer) oder durchgehende Fundamentplatten.',
    details: 'Streifenfundament = Länge · Breite · frostfreie Tiefe (in Deutschland nach DIN 1054 mindestens 80 bis 100 cm unter Geländeoberkante, um Frosthebungen sicher auszuschließen).',
    faqs: [
      { question: 'Warum muss ein Fundament frostfrei gegründet werden?', answer: 'Wasser im gefrierenden Boden dehnt sich um ca. 9 % aus. Liegt das Fundament oberhalb der Frostgrenze, hebt der gefrierende Boden das Bauwerk im Winter an, was zu schweren Rissen führt.' },
      { question: 'Muss ein Fundament mit Stahl bewehrt werden?', answer: 'Für schwere Lasten oder ungleichmäßige Baugrundverhältnisse sind Baustahlmatten (z. B. Q188) oder Bewehrungskörbe aus Betonstahl zwingend erforderlich.' }
    ]
  },
  'schalungssteine-rechner': {
    intro: 'Schalungssteine (Hohlblocksteine aus Beton) werden trocken im Verband aufgestellt, bewehrt und anschließend mit flüssigem Beton verfüllt.',
    details: 'Steinbedarf = Wandfläche in m² · Steine pro m² (typisch 8 Stück bei Standardmaßen 50 × 25 cm). Der Betonfüllbedarf beträgt je nach Steinbreite (17,5 bis 30 cm) ca. 100 bis 180 Liter Beton pro Quadratmeter Wand.',
    faqs: [
      { question: 'Wie viel Armierungsstahl gehört in Schalungssteine?', answer: 'In der Regel werden horizontal 2 Stäbe Betonstahl (z. B. 10 mm) pro Steinreihe in die Aussparungen gelegt und vertikal alle 25 bis 50 cm Stäbe ins Fundament eingesteckt.' },
      { question: 'Wie hoch darf man Schalungssteine vor dem Betonieren aufstellen?', answer: 'Um ein Platzen der Steine durch den hydrostatischen Betondruck zu verhindern, sollten maximal 3 bis 4 Steinreihen (ca. 75 bis 100 cm) in einem Guss verfüllt werden.' }
    ]
  },
  'fassadenfarbe-rechner': {
    intro: 'Dieser Fassadenrechner ermittelt die benötigte Menge an Außenwandfarbe (Silikonharz, Silikat, Acryl) unter Berücksichtigung von Strukturputz und Witterungsschutz.',
    details: 'Fassadenfläche = 2 · (Hauslänge + Hausbreite) · Traufhöhe + Giebeldreiecke abzüglich Fensteröffnungen. Raue Putzstrukturen (Reibeputz, Kratzputz) erhöhen den Farbverbrauch um 25 bis 40 Prozent gegenüber glatten Wänden.',
    faqs: [
      { question: 'Welche Fassadenfarbe ist am besten gegen Algen und Pilze geschützt?', answer: 'Silikonharzfarben mit Abperleffekt (Lotuseffekt) oder mineralische Silikatfarben, die durch ihre hohe Alkalität (pH-Wert) Algenbildung natürlich hemmen.' },
      { question: 'Muss die Fassade vor dem Anstrich grundiert werden?', answer: 'Ja, ein Tiefengrund festigt sandende Bestandsputze, egalisiert die Saugfähigkeit und verhindert streifige Farbunterschiede.' }
    ]
  },
  'parkett-laminat-rechner': {
    intro: 'Dieser Rechner plant den Bedarf an Parkett-, Laminat- oder Korkdielen, Trittschalldämmung und Fußleisten für Ihre Wohnräume.',
    details: 'Fläche = Raumlänge · Raumbreite plus 5 bis 8 % Verschnitt. Bei Verlegung auf mineralischem Untergrund (Estrich) ist nach DIN 18202 zwingend eine Dampfbremsfolie (PE-Folie mit SD-Wert > 100 m) vorgeschrieben.',
    faqs: [
      { question: 'Wie berechnet man die laufenden Meter für Sockelleisten?', answer: 'Umfang des Raumes = 2 · (Länge + Breite) abzüglich aller Türöffnungen plus ca. 10 Prozent Verschnitt für Gehrungsschnitte.' },
      { question: 'Warum ist eine Dehnungsfuge an den Wänden unverzichtbar?', answer: 'Holz und Laminat dehnen sich bei feuchter Raumluft aus; ohne Dehnungsfuge von mindestens 10 bis 15 mm zu Wänden und Rohren wölbt sich der Boden auf.' }
    ]
  },
  'tapetenrollen-rechner': {
    intro: 'Dieser Tapetenrechner kalkuliert die Anzahl der Euro-Rollen (Eurorolle: 10,05 m Länge × 0,53 m Breite) inklusive Wandhöhe und Musterversatz (Rapport).',
    details: 'Formel ohne Rapport: Raumumfang geteilt durch 0,53 m ergibt die Bahnenanzahl; aus einer Rolle erhält man bei 2,50 m Raumhöhe exakt 3 bis 4 Bahnen. Bei Musterversatz fällt für jede Bahn der Rapport-Abfall an.',
    faqs: [
      { question: 'Was bedeutet die Angabe "Versetzter Ansatz 64/32 cm" auf der Tapete?', answer: 'Das Muster wiederholt sich alle 64 cm und muss bei jeder zweiten Bahn um 32 cm in der Höhe versetzt geklebt werden; dies erfordert ca. 1 bis 2 Rollen Mehrbedarf.' },
      { question: 'Werden Fenster und Türen von der Tapetenfläche abgezogen?', answer: 'Bei Standardfenstern und Türen zieht man die Flächen meist nicht ab, da die Abschnitte über und unter Fenstern aus den Rollenresten geschnitten werden.' }
    ]
  },
  'brennholz-raummeter-rechner': {
    intro: 'Dieser Holzumrechner transformiert die forstwirtschaftlichen Maße Festmeter (FM), Raummeter (RM) und Schüttraummeter (SRM) deterministisch ineinander.',
    details: '1 Festmeter (1 m³ massives Holz ohne Luft) entspricht ca. 1,4 bis 1,5 Raummetern (geschichtetes Scheitholz mit Luft) und ca. 2,3 bis 2,5 Schüttraummetern (lose geschüttete Scheite im Container).',
    faqs: [
      { question: 'Welcher Brennwertunterschied besteht zwischen Buche und Fichte?', answer: 'Buchenholz liefert rund 2.100 kWh pro Raummeter und brennt ruhig mit langanhaltender Glut; Fichtenholz liefert nur ca. 1.500 kWh/RM, brennt schnell an und eignet sich ideal als Anzündholz.' },
      { question: 'Wie trocken muss Kaminholz nach Bundes-Immissionsschutzgesetz (BImSchV) sein?', answer: 'Nach § 3 Abs. 1 Nr. 4 der 1. BImSchV darf der Feuchtegehalt von Brennholz maximal 25 Prozent (entspricht einem Wassergehalt unter 20 %) betragen.' }
    ]
  },
  'putz-rechner': {
    intro: 'Dieser Mörtelrechner ermittelt den Trockenmörtelbedarf in Kilogramm und Säcken für Grundputz, Unterputz und mineralischen Oberputz.',
    details: 'Menge in kg = Wandfläche in m² · Schichtdicke in mm · spezifischer Materialverbrauch (typisch ca. 1,3 bis 1,5 kg pro m² und mm Schichtdicke). Ein 25-kg-Sack reicht bei 10 mm Dicke für rund 1,7 m² Wandfläche.',
    faqs: [
      { question: 'Wie dick muss Innenputz auf Mauerwerk aufgetragen werden?', answer: 'Nach DIN V 18550 beträgt die durchschnittliche Mindestputzdicke bei einlagigem Innenputz 10 mm, um Unebenheiten des Mauerwerks auszugleichen.' },
      { question: 'Wann benötigt man ein Armierungsgewebe im Putz?', answer: 'Zwingend bei Materialwechseln im Untergrund (z. B. Übergang von Beton auf Ziegel), über Rollladenkästen und bei Wärmedämmverbundsystemen (WDVS).' }
    ]
  },
  'zaun-pfosten-rechner': {
    intro: 'Dieser Zaunrechner kalkuliert die Anzahl der Zaunpfosten, Zaunmatten (Doppelstabmatten) und Pfostenfundamente entlang der Grundstücksgrenze.',
    details: 'Pfostenanzahl = Abrunden(Zaunlänge / Pfostenabstand) + 1 (für den Endpfosten) plus Zusatzpfosten für Tore und Ecken. Standard-Doppelstabmatten haben eine Breite von exakt 2,50 Metern.',
    faqs: [
      { question: 'Wie tief müssen Zaunpfosten einbetoniert werden?', answer: 'Mindestens 60 bis 80 cm tief, um eine frostfreie und sturmsichere Verankerung gegen Hebelkräfte bei Windlast zu gewährleisten.' },
      { question: 'Was ist der Unterschied zwischen 6/5/6 und 8/6/8 Doppelstabmatten?', answer: 'Die Zahlen beziffern den Drahtdurchmesser in Millimetern (waagerecht/senkrecht/waagerecht): 8/6/8 mm ist die schwere Gewerbeausführung, 6/5/6 mm die leichtere Privatausführung.' }
    ]
  },
  'regenwasser-zisterne-rechner': {
    intro: 'Dieser Dimensionierungsrechner ermittelt das optimale Speichervolumen einer Regenwasserzisterne nach DIN 1989-1 aus Dachfläche, Standort und Wasserbedarf.',
    details: 'Zisternengröße = Min(Jährlicher Regenertrag, Jährlicher Betriebswasserbedarf) · 0,06 (für 21 bis 22 Tage Sicherheitsreserve bei Trockenheit). Typische Behältergrößen liegen zwischen 3.000 und 6.000 Litern.',
    faqs: [
      { question: 'Welche Verbraucher im Haus dürfen mit Zisternenwasser betrieben werden?', answer: 'Nach der Trinkwasserverordnung darf Regenwasser für Toilettenspülung, Waschmaschine und Gartenbewässerung genutzt werden; eine Verwechslung mit Trinkwasserleitungen muss ausgeschlossen sein.' },
      { question: 'Wie viel Prozent Trinkwasser spart eine Zisterne im Einfamilienhaus?', answer: 'Bis zu 50 Prozent des gesamten häuslichen Trinkwasserbedarfs können durch Regenwassernutzung für WC, Garten und Waschmaschine eingespart werden.' }
    ]
  },
  'treppen-stufen-rechner': {
    intro: 'Die Schrittmaßformel nach DIN 18065 (2 · Steigung + Auftritt = 63 cm) gewährleistet die bequeme und ergonomisch sichere Begehbarkeit von Treppen.',
    details: 'Stufenanzahl = Geschosshöhe / Steigungshöhe (ideal: 17 bis 18 cm). Der Auftritt (Stufentiefe) sollte 27 bis 29 cm betragen. Das Schrittmaß 2s + a muss im Intervall von 59 bis 65 cm liegen.',
    faqs: [
      { question: 'Welche Mindest-Durchgangshöhe schreibt die DIN 18065 für Treppen vor?', answer: 'Die lichte Durchgangshöhe senkrecht über der Stufenvorderkante muss über den gesamten Treppenlauf mindestens 2,00 Meter betragen.' },
      { question: 'Was ist der Treppensteigungswinkel?', answer: 'Das Verhältnis von Steigung zu Auftritt; für normale Wohnungstreppen gilt ein Neigungswinkel von 30° bis 37° als optimal.' }
    ]
  },
  'kies-splitt-rechner': {
    intro: 'Dieser Schüttgutrechner transformiert Flächenmaße und Schütthöhen in benötigte Kubikmeter und das Transportgewicht in Tonnen.',
    details: 'Gewicht in Tonnen = Fläche in m² · Schütthöhe in Metern · Schüttdichte (ca. 1,5 bis 1,8 t/m³ je nach Körnung und Feuchte). Für Gartenwege und Zierbeete reicht eine Schütthöhe von 5 cm (ca. 80 kg/m²).',
    faqs: [
      { question: 'Welcher Unterschied besteht zwischen Kies und Splitt?', answer: 'Kies besteht aus rund gewaschenen Flusskiesen; Splitt besteht aus scharfkantig gebrochenem Naturstein, der sich unter Belastung verkeilt und kaum rollt.' },
      { question: 'Warum sollte man unter Zierkies ein Unkrautvlies verlegen?', answer: 'Das Geotextil-Vlies verhindert, dass sich Steine mit dem feuchten Erdreich vermischen, und hemmt das Durchwachsen von Wurzelunkräutern.' }
    ]
  },
  'drainage-gefaelle-rechner': {
    intro: 'Dieser Neigungsrechner kalkuliert den Höhenunterschied und das Mindestgefälle für Drainagerohre und Abwasserleitungen nach DIN EN 12056 und DIN 4095.',
    details: 'Gefälle in % = (Höhenunterschied / Rohrlänge) · 100. Für erdverlegte Abwasserleitungen gilt ein Mindestgefälle von 1,0 bis 2,0 Prozent (1 bis 2 cm pro Meter), um Ablagerungen und Verstopfungen zu vermeiden.',
    faqs: [
      { question: 'Kann ein Gefälle bei Abwasserrohren auch zu steil sein?', answer: 'Ja, bei über 5 Prozent Gefälle fließt das Abwasser zu schnell ab und lässt feste Bestandteile zurück; dies führt paradoxerweise zu Verstopfungen.' },
      { question: 'Wie wird ein Ringdrainagerohr an der Fundamentsohle verlegt?', answer: 'Mit mindestens 0,5 Prozent Gefälle, umgeben von einem Filterkiesbett (Körnung 8/16 oder 16/32) und vollständig umhüllt von filterstabilem Geotextilvlies.' }
    ]
  },
  'baugrund-tragfaehigkeit-rechner': {
    intro: 'Die zulässige Bodenpressung nach DIN 1054 bestimmt, welche Lasten das Fundament auf den anstehenden Baugrund übertragen darf, ohne dass Grundbruch oder schädliche Setzungen drohen.',
    details: 'Vorhandene Bodenpressung = Bauwerkslast / Fundamentfläche. Feste Sande und Kiese tragen typischerweise 200 bis 300 kN/m²; weiche Tone oder organische Böden oft unter 100 kN/m².',
    faqs: [
      { question: 'Wann ist ein geotechnisches Baugrundgutachten Pflicht?', answer: 'Vor jedem Neubau: Das Gutachten ermittelt Bodenarten, Schichtenaufbau, Tragfähigkeit und den maßgeblichen Bemessungswasserstand (Grundwasser).' },
      { question: 'Was sind ungleichmäßige Setzungen?', answer: 'Wenn sich verschiedene Gebäudeteile wegen inhomogenen Bodens unterschiedlich stark senken; dies führt zu schweren diagonalen Rissen im Tragwerk.' }
    ]
  },
  'holz-balken-durchbiegung-rechner': {
    intro: 'Die statische Vorbemessung nach Eurocode 5 (DIN EN 1995-1-1) prüft die Durchbiegung von Decken- und Dachbalken unter Gleichlast im Grenzzustand der Gebrauchstauglichkeit.',
    details: 'Zulässige Durchbiegung: w_max ≤ Stützweite L / 300 für charakteristische Lasten (bzw. L / 200 für Enddurchbiegung). Die Steifigkeit hängt in der vierten Potenz von der Balkenhöhe h ab (Flächenträgheitsmoment I = (b · h³) / 12).',
    faqs: [
      { question: 'Warum ist die Balkenhöhe so viel wichtiger als die Balkenbreite?', answer: 'Weil die Höhe mit der dritten Potenz in die Biegesteifigkeit einfließt: Ein doppelt so hoher Balken biegt sich bei gleicher Belastung um den Faktor 8 weniger durch.' },
      { question: 'Welche Holzart wird für Deckenbalken im Neubau verwendet?', answer: 'Konstruktionsvollholz (KVH, meist Fichte Nadelholz C24) oder Brettschichtholz (BSH/Leimholz) für verzugsarme, rissminimierte Bauteile.' }
    ]
  },
  'beton-mischungsverhaeltnis-rechner': {
    intro: 'Dieser Mischungsrechner ermittelt die exakten Schaufel- und Gewichtsanteile von Zement, Betonkies (0/16 mm) und Wasser für selbst angemischten Baustellenbeton.',
    details: 'Klassisches Volumen-Mischungsverhältnis für Normalbeton: 1 Teil Zement zu 4 Teilen Betonkies (z. B. 1 Schaufel Zement auf 4 Schaufeln Kies). Der Wasser-Zement-Wert (w/z) sollte für hohe Druckfestigkeit zwischen 0,50 und 0,60 liegen.',
    faqs: [
      { question: 'Was passiert, wenn man beim Betonmischen zu viel Wasser zugibt?', answer: 'Ein zu hoher Wasser-Zement-Wert (> 0,65) schwächt das Zementkristallgitter drastisch: Die Druckfestigkeit sinkt massiv, und der Beton neigt zum "Bluten" und Reißen.' },
      { question: 'Wie viele 25-kg-Säcke Zement benötigt man für 1 m³ selbst gemischten Beton?', answer: 'Für 1 Kubikmeter fertigen Beton der Festigkeitsklasse C20/25 werden rund 300 kg Zement benötigt (entspricht genau 12 Säcken zu je 25 kg).' }
    ]
  }
};
