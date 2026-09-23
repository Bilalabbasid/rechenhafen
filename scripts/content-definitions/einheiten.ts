import { CalcContent } from './types';

export const EINHEITEN_CONTENT: Record<string, CalcContent> = {
  'laengen-umrechner': {
    intro: 'Dieser Längenkonverter rechnet Längenmaße zwischen dem metrischen SI-System (Millimeter, Zentimeter, Meter, Kilometer) und dem angloamerikanischen Maßsystem (Inch, Fuß, Yard, Meile) um.',
    details: 'Die offizielle völkerrechtliche Definition lautet seit 1959: 1 Inch (Zoll) = exakt 25,4 Millimeter. 1 Fuß (Foot) = 12 Zoll = 30,48 cm. 1 Yard = 3 Fuß = 91,44 cm. 1 Landmeile = 1.609,344 Meter.',
    faqs: [
      { question: 'Wie lang ist eine Seemeile (Nautische Meile nm)?', answer: 'Eine Seemeile ist völkerrechtlich auf exakt 1.852 Meter definiert; sie entsprach ursprünglich einer Bogenminute (1/60 Grad) auf einem Meridian der Erdkugel.' },
      { question: 'Was ist ein Lichtjahr in Kilometern?', answer: 'Die Distanz, die das Licht im Vakuum in einem tropischen Jahr zurücklegt: ca. 9,461 Billionen Kilometer (9,461 · 10¹² km).' }
    ]
  },
  'temperatur-umrechner': {
    intro: 'Dieser Temperaturrechner transformiert Werte exakt zwischen Grad Celsius (°C), Fahrenheit (°F) und der thermodynamischen Basiseinheit Kelvin (K).',
    details: 'Formeln: Fahrenheit = (Celsius · 1,8) + 32; Celsius = (Fahrenheit - 32) / 1,8; Kelvin = Celsius + 273,15. Am absoluten Nullpunkt bei 0 Kelvin (-273,15 °C) stoppt jede thermische Teilchenbewegung.',
    faqs: [
      { question: 'Bei welcher Temperatur sind Celsius und Fahrenheit zahlenmäßig identisch?', answer: 'Bei exakt -40 Grad: -40 °C entspricht genau -40 °F, da (-40 × 1,8) + 32 = -72 + 32 = -40.' },
      { question: 'Warum nutzt die Wissenschaft die Kelvin-Skala ohne Gradzeichen?', answer: 'Weil Kelvin eine absolute thermodynamische Einheit ist (keine relative Skala wie Celsius mit willkürlichem Gefrierpunkt von Wasser); negative Kelvin-Temperaturen existieren im Reellen nicht.' }
    ]
  },
  'gewicht-masse-umrechner': {
    intro: 'Dieser Massenkonverter rechnet physikalische Massen zwischen Milligramm, Gramm, Kilogramm, Tonnen sowie imperialen Pfund (lb), Unzen (oz) und Steinen (Stone) um.',
    details: 'Seit dem International Avoirdupois Agreement gilt: 1 englisches Pfund (Pound lb) = exakt 0,45359237 kg. 1 Unze (Ounce oz) = 1/16 lb ≈ 28,3495 Gramm. Das deutsche Apotheker- oder Zollpfund wurde historisch auf genau 500 g gerundet.',
    faqs: [
      { question: 'Was ist der Unterschied zwischen einer Feinunze (Troy Ounce) und einer normalen Unze?', answer: 'Gold und Silber werden in Feinunzen (oz. tr.) gehandelt: 1 Feinunze wiegt exakt 31,1034768 Gramm, während eine gewöhnliche Handelsunze nur ca. 28,35 g wiegt.' },
      { question: 'Was ist der physikalische Unterschied zwischen Masse und Gewichtskraft?', answer: 'Die Masse (in kg) ist überall im Universum unveränderlich; die Gewichtskraft (in Newton) hängt von der lokalen Gravitation ab (auf dem Mond wiegt ein Mensch nur 1/6 so viel wie auf der Erde).' }
    ]
  },
  'druck-umrechner': {
    intro: 'Dieser Druckrechner konvertiert Drücke zwischen Pascal (Pa), Bar (bar), technischer Atmosphäre (at), Millimeter Quecksilbersäule (mmHg/Torr) und PSI (Pound-force per square inch).',
    details: '1 bar = 100.000 Pascal = 100 kPa = 1.000 hPa (Standardmaß in der Meteorologie). 1 physikalische Standardatmosphäre (1 atm) = 1.013,25 hPa = 760 mmHg. 1 bar ≈ 14,5038 PSI.',
    faqs: [
      { question: 'Welcher Reifendruck ist in PSI angegeben und was entspricht 32 PSI in Bar?', answer: 'Viele US- und Fahrradreifen nutzen PSI: 32 PSI geteilt durch 14,5038 ergibt ca. 2,21 bar Reifendruck.' },
      { question: 'Was bedeutet der Blutdruckwert "120 zu 80" in echten Druckeinheiten?', answer: 'Es handelt sich um Millimeter Quecksilbersäule (mmHg): 120 mmHg entsprechen ca. 160 hPa oder 0,16 bar Druck.' }
    ]
  },
  'geschwindigkeit-umrechner': {
    intro: 'Dieser Geschwindigkeitsrechner transformiert Werte zwischen km/h, Metern pro Sekunde (m/s), Meilen pro Stunde (mph) und Knoten (Knoten kn, Seemeilen pro Stunde).',
    details: 'Zentrale Faustregel: km/h geteilt durch 3,6 ergibt m/s (z. B. 36 km/h = 10 m/s; 100 km/h ≈ 27,78 m/s). 1 Knoten = 1 Seemeile pro Stunde = 1,852 km/h. 1 mph ≈ 1,609 km/h.',
    faqs: [
      { question: 'Wie schnell ist Mach 1 (Schallgeschwindigkeit)?', answer: 'In trockener Luft bei 20 °C auf Meereshöhe beträgt die Schallgeschwindigkeit ca. 343 m/s bzw. 1.235 km/h.' },
      { question: 'Was bedeutet die Geschwindigkeitsangabe 55 mph auf US-Highways in km/h?', answer: '55 Meilen pro Stunde entsprechen ca. 88,5 km/h.' }
    ]
  },
  'volumen-umrechner': {
    intro: 'Dieser Raummaß-Konverter rechnet Kubikmeter, Liter, Milliliter sowie amerikanische Gallonen (US gal), Pints und Flüssigunzen (fl oz) um.',
    details: '1 Kubikmeter (m³) = 1.000 Kubikdezimeter (dm³) = 1.000 Liter. 1 US-Flüssiggallone (Liquid Gallon) = 3,78541 Liter; 1 britische Imperial Gallon = 4,54609 Liter.',
    faqs: [
      { question: 'Wie viel Liter fasst ein US-Öl-Barrel (bbl)?', answer: 'Ein Standard-Rohöl-Barrel fasst exakt 42 US-Gallonen, was genau 158,9873 Litern entspricht.' },
      { question: 'Wie viele Milliliter sind eine amerikanische Flüssigunze (fl. oz.)?', answer: '1 US fluid ounce entspricht ca. 29,57 ml; eine britische Imperial fl oz misst ca. 28,41 ml.' }
    ]
  },
  'flaeche-umrechner': {
    intro: 'Dieser Flächenumrechner transformiert Flächenmaße zwischen Quadratmillimetern, Quadratzentimetern, Quadratmetern, Ar, Hektar, Quadratkilometern und angloamerikanischen Acres.',
    details: 'Umrechnungsfaktor bei metrischen Flächen ist stets 100: 1 km² = 100 Hektar (ha); 1 ha = 100 Ar (a); 1 a = 100 Quadratmeter (m²). 1 Acre entspricht ca. 4.046,86 m² (ca. 0,405 Hektar).',
    faqs: [
      { question: 'Wie groß ist ein Hektar im Vergleich zu einem Fußballfeld?', answer: 'Ein Hektar misst exakt 10.000 m² (100 × 100 m); ein Standard-FIFA-Fußballfeld (105 × 68 m = 7.140 m²) entspricht ca. 0,71 Hektar.' },
      { question: 'Wie viele Quadratfuß (sq ft) sind ein Quadratmeter?', answer: '1 m² entspricht ca. 10,764 Quadratfuß (oft in US-Immobilienanzeigen als square feet angegeben).' }
    ]
  },
  'energie-arbeit-umrechner': {
    intro: 'Dieser Energierechner konvertiert Energie, Arbeit und Wärmemengen zwischen Joule (J), Kilowattstunden (kWh), Kilokalorien (kcal), Wattsekunden und British Thermal Units (BTU).',
    details: '1 Kilowattstunde (kWh) = 3.600.000 Joule = 3,6 Megajoule (MJ). 1 Kilokalorie (kcal) = exakt 4.186,8 Joule (internationale Kalorie). 1 BTU ≈ 1.055 Joule.',
    faqs: [
      { question: 'Wie viel Kilowattstunden Energie stecken in 1.000 Kilokalorien Nahrung?', answer: '1.000 kcal entsprechen exakt 1,163 Kilowattstunden chemischer Energie.' },
      { question: 'Was ist ein Elektronenvolt (eV)?', answer: 'Eine winzige Energieeinheit der Atom- und Teilchenphysik: 1 eV ≈ 1,602 · 10⁻¹⁹ Joule (die kinetische Energie eines Elektrons beim Durchlaufen von 1 Volt Spannung).' }
    ]
  },
  'leistung-umrechner': {
    intro: 'Dieser Leistungskonverter rechnet mechanische und elektrische Leistung zwischen Watt (W), Kilowatt (kW), Megawatt (MW) und Pferdestärken (PS / hp) um.',
    details: 'In Deutschland gilt nach DIN 66036: 1 metrische PS = exakt 735,49875 Watt ≈ 0,7355 kW. Umgekehrt entspricht 1 kW exakt 1,35962 PS. Die angloamerikanische Mechanical Horsepower (hp) ist mit ca. 745,7 Watt minimal größer.',
    faqs: [
      { question: 'Wie rechnet man kW im Auto-Fahrzeugschein schnell im Kopf in PS um?', answer: 'Multiplizieren Sie die kW-Zahl mit 1,36 (z. B. 110 kW × 1,36 ≈ 150 PS).' },
      { question: 'Was bedeutet die Einheit Gigawatt (GW)?', answer: '1 Gigawatt entspricht 1.000 Megawatt bzw. 1 Milliarde Watt (entspricht der elektrischen Dauerleistung eines typischen Kernkraftwerksblocks).' }
    ]
  },
  'daten-speicher-umrechner': {
    intro: 'Dieser Speichergrößenrechner unterscheidet strikt zwischen binären Präfixen (Kibi-, Mebi-, Gibibyte auf Basis 1024) und dezimalen SI-Präfixen (Kilo-, Mega-, Gigabyte auf Basis 1000).',
    details: 'Festplattenhersteller verkaufen nach Dezimalsystem: 1 TB = 1.000.000.000.000 Byte. Betriebssysteme (Windows) rechnen jedoch binär (1 TiB = 1.024⁴ Byte ≈ 1,0995 · 10¹² Byte). Daher zeigt Windows bei einer 1-TB-Festplatte nur ca. 931 GB an.',
    faqs: [
      { question: 'Was ist der Unterschied zwischen Bit und Byte?', answer: 'Ein Bit ist die kleinste binäre Informationseinheit (0 oder 1); ein Byte besteht aus 8 Bit und kann genau ein ASCII-Schriftzeichen codieren.' },
      { question: 'Was bedeutet GiB vs. GB?', answer: 'GB steht für Gigabyte (10⁹ = 1.000.000.000 Byte nach SI-Standard); GiB steht für Gibibyte (2³⁰ = 1.073.741.824 Byte nach IEC-Norm).' }
    ]
  },
  'datenrate-bandbreite-umrechner': {
    intro: 'Dieser Bandbreitenrechner konvertiert Internet-Übertragungsgeschwindigkeiten zwischen Mbit/s (Megabit pro Sekunde) und realer Downloadgeschwindigkeit in MB/s (Megabyte pro Sekunde).',
    details: 'Da 1 Byte aus 8 Bit besteht, muss die nominelle Leitungsbandbreite durch 8 geteilt werden: Ein Internetanschluss mit 250 Mbit/s lädt Daten maximal mit theoretisch 31,25 Megabyte pro Sekunde (MB/s) herunter.',
    faqs: [
      { question: 'Wie lange dauert der Download eines 50-GB-Spiels bei einer 100-Mbit/s-Leitung?', answer: '100 Mbit/s liefern netto ca. 12,5 MB/s. 50.000 MB geteilt durch 12,5 MB/s = 4.000 Sekunden, also etwa 1 Stunde und 7 Minuten.' },
      { question: 'Warum erreichen Speedtests selten die gebuchte maximale Bandbreite?', answer: 'Durch Netzwerk-Overhead (TCP/IP-Header verbrauchen ca. 5–10 % der Bandbreite), WLAN-Störungen oder Auslastung der Server des Anbieters.' }
    ]
  },
  'drehmoment-umrechner': {
    intro: 'Dieser Drehmomentkonverter rechnet Drehmomente zwischen Newtonmetern (Nm), Kilonewtonmetern (kNm) und imperialen Foot-Pounds (ft-lb) um.',
    details: '1 Newtonmeter (Nm) ist das Drehmoment, das eine Kraft von 1 Newton bei einem Hebelarm von 1 Meter erzeugt. 1 Foot-Pound (ft-lb) entspricht ca. 1,3558 Nm; 1 Nm entspricht ca. 0,7376 ft-lb.',
    faqs: [
      { question: 'Mit wie viel Drehmoment zieht man Alufelgen beim Auto an?', answer: 'Bei den meisten PKW liegt das vorgeschriebene Anzugsdrehmoment mit dem Drehmomentschlüssel zwischen 110 und 130 Newtonmetern (Herstellerangaben im Handbuch beachten!).' },
      { question: 'Wie hängt das Drehmoment mit der Motorleistung zusammen?', answer: 'Leistung in kW = (Drehmoment in Nm · Drehzahl in U/min) / 9549. Bei gleicher Drehzahl erzeugt mehr Drehmoment direkt mehr mechanische Leistung.' }
    ]
  },
  'kraft-umrechner': {
    intro: 'Dieser physikalische Kraftrechner transformiert Einheiten zwischen Newton (N), Kilonewton (kN), Dyn und veralteten Einheiten wie Kilopond (kp) und Pound-force (lbf).',
    details: 'Nach dem 2. Newtonschen Axiom (F = m · a) beschleunigt 1 Newton eine Masse von 1 kg um 1 m/s². 1 Kilopond (kp) entspricht der Gewichtskraft von 1 kg auf der Erde: 1 kp = 9,80665 N.',
    faqs: [
      { question: 'Wie viel Newton Gewichtskraft übt eine Tafel Schokolade (100 g) aus?', answer: 'Auf der Erdoberfläche üben 100 Gramm Masse durch die Erdbeschleunigung (g ≈ 9,81 m/s²) eine Schwerkraft von ziemlich genau 1 Newton (ca. 0,981 N) aus.' },
      { question: 'Was hält ein Kletterkarabiner mit der Angabe 24 kN aus?', answer: '24 Kilonewton entsprechen einer Bruchlast von ca. 2.447 kg Gewichtskraft (statisch fast 2,5 Tonnen).' }
    ]
  },
  'kraftstoffverbrauch-umrechner': {
    intro: 'Dieser Verbrauchsrechner transformiert den europäischen Kraftstoffverbrauch in l/100 km in die angloamerikanischen Einheiten MPG (US Miles per Gallon) und UK MPG.',
    details: 'Aufgrund der inversen Relation (l/100 km misst verbrauchten Sprit pro Distanz; MPG misst Reichweite pro Spritmenge) gilt die reziproke Formel: MPG (US) = 235,215 / (l/100 km). Ein Verbrauch von 5 l/100 km entspricht ca. 47,04 US-MPG.',
    faqs: [
      { question: 'Warum sinkt der MPG-Wert, wenn das Auto mehr Sprit verbraucht?', answer: 'Weil MPG angibt, wie viele Meilen man mit einer einzigen Gallone weit fahren kann: Ein sparsameres Fahrzeug fährt weiter und hat daher einen höheren MPG-Wert.' },
      { question: 'Was entspricht ein Verbrauch von 8 Litern auf 100 km in US-MPG?', answer: '235,215 / 8 = 29,40 US-MPG.' }
    ]
  },
  'roemische-zahlen-umrechner': {
    intro: 'Dieser Zahlenwandler übersetzt arabische Dezimalzahlen (1 bis 3999) in korrekte römische Ziffern (I, V, X, L, C, D, M) und decodiert historische Inschriften.',
    details: 'Die Werte der Grundzeichen lauten: I=1, V=5, X=10, L=50, C=100, D=500, M=1.000. Nach der Subtraktionsregel darf ein kleineres Zeichen vor einem größeren stehen, um 4 (IV), 9 (IX), 40 (XL), 90 (XC), 400 (CD) oder 900 (CM) darzustellen.',
    faqs: [
      { question: 'Wie schreibt man das Jahr 2026 in römischen Zahlen?', answer: 'MMXXVI (M=1000 + M=1000 + X=10 + X=10 + V=5 + I=1 = 2026).' },
      { question: 'Gibt es im römischen Zahlensystem eine Ziffer für die Null?', answer: 'Nein, die antiken Römer kannten kein Zeichen für die Null; das Konzept der Null als Ziffer wurde erst im Mittelalter über das indisch-arabische Zahlensystem in Europa eingeführt.' }
    ]
  },
  'binaer-hex-dezimal-umrechner': {
    intro: 'Dieser Zahlensystem-Konverter transformiert Zahlenwerte synchron zwischen dem Dezimalsystem (Basis 10), Binärsystem (Basis 2), Oktalsystem (Basis 8) und Hexadezimalsystem (Basis 16).',
    details: 'In der Computertechnik entspricht eine Binärstelle einem Bit. Vier Bits (ein Nibble) lassen sich exakt durch eine einzige Hexadezimalziffer (0–9, A–F) darstellen: Die Binärzahl 1111 1111 entspricht im Hexadezimalsystem FF und dezimal 255.',
    faqs: [
      { question: 'Wie rechnet man die Binärzahl 10110 in eine Dezimalzahl um?', answer: 'Von rechts nach links: (0×1) + (1×2) + (1×4) + (0×8) + (1×16) = 0 + 2 + 4 + 0 + 16 = 22.' },
      { question: 'Wofür wird das Oktalsystem (Basis 8) noch heute genutzt?', answer: 'Vor allem in Linux- und Unix-Dateisystemen zur Vergabe von Zugriffsrechten (z. B. chmod 755 oder 644).' }
    ]
  },
  'zoll-in-cm-rechner': {
    intro: 'Dieser Längenrechner wandelt Zollmaße (Inch) in Zentimeter um und berechnet die Abmessungen von Bildschirmen, TV-Geräten, Felgen und Werkzeugen.',
    details: '1 Zoll = exakt 2,54 Zentimeter. Die Bildschirmdiagonale eines 65-Zoll-Fernsehers beträgt exakt 65 · 2,54 = 165,1 cm. Bei einem Seitenverhältnis von 16:9 ist das Display ca. 144 cm breit und 81 cm hoch.',
    faqs: [
      { question: 'Wie viel cm sind ein 15-Zoll-Laptop-Display?', answer: '15 Zoll entsprechen einer Bildschirmdiagonale von 15 × 2,54 = 38,1 cm; ein 13,3-Zoll-Display misst 33,78 cm Diagonale.' },
      { question: 'Wie rechnet man Zentimeter im Kopf schnell in Zoll um?', answer: 'Teilen Sie die Zentimeter durch 2,5 (oder verdoppeln Sie und teilen durch 5): 10 cm / 2,5 = ca. 4 Zoll (exakt 3,94 Zoll).' }
    ]
  },
  'zeit-umrechner': {
    intro: 'Dieser Zeiteinheiten-Konverter rechnet Zeitspannen deterministisch zwischen Nanosekunden, Millisekunden, Sekunden, Minuten, Stunden, Tagen und Kalenderjahren um.',
    details: '1 Tag = 24 Stunden = 1.440 Minuten = 86.400 Sekunden = 86.400.000 Millisekunden. Ein durchschnittliches julianisches Jahr umfasst exakt 31.557.600 Sekunden.',
    faqs: [
      { question: 'Wie viele Sekunden vergehen in einer Arbeitswoche mit 40 Stunden?', answer: '40 Stunden × 3.600 Sekunden/Stunde = exakt 144.000 Sekunden reine Arbeitszeit.' },
      { question: 'Wie schnell vergeht eine Nanosekunde im Computer?', answer: 'Eine Nanosekunde ist ein Milliardstel einer Sekunde (10⁻⁹ s); das Licht legt in einer Nanosekunde im Vakuum eine Strecke von ca. 30 cm zurück.' }
    ]
  },
  'dichte-umrechner': {
    intro: 'Dieser Dichterechner konvertiert Stoffdichten zwischen kg/m³, g/cm³, g/ml, kg/l sowie imperialen pounds per cubic foot (lb/ft³).',
    details: '1 g/cm³ = 1.000 kg/m³ = 1 kg/Liter. Reines flüssiges Wasser besitzt bei 4 °C (Dichteanomalie) seine höchste Dichte von exakt 1.000 kg/m³ (1 g/cm³). Metalle wie Gold erreichen 19,3 g/cm³, Blei 11,3 g/cm³.',
    faqs: [
      { question: 'Warum schwimmt Eis auf flüssigem Wasser?', answer: 'Wegen der Dichteanomalie: Die hexagonale Kristallstruktur von Eis benötigt mehr Raum; Eis hat mit ca. 0,917 g/cm³ eine geringere Dichte als flüssiges Wasser und treibt daher oben.' },
      { question: 'Wie viel wiegt ein 10-Liter-Eimer voll Sand im Vergleich zu Wasser?', answer: 'Wasser wiegt genau 10 kg; trockener Sand hat eine Dichte von ca. 1,6 g/cm³, der Eimer wiegt somit ca. 16 Kilogramm.' }
    ]
  },
  'drehzahl-umfangsgeschwindigkeit-rechner': {
    intro: 'Dieser Rechner verknüpft Rotationsdrehzahl in U/min mit dem Außendurchmesser zur Berechnung der Umfangs- und Schnittgeschwindigkeit in m/s für Sägeblätter, Bohrer und Fräser.',
    details: 'Umfangsgeschwindigkeit v = (pi · d · n) / 60. Ein Trennschleifer (Flex) mit 230-mm-Scheibe bei 6.600 U/min erreicht eine Umfangsgeschwindigkeit von ca. 80 m/s (knapp 290 km/h) an den Schleifkörnern.',
    faqs: [
      { question: 'Warum ist die maximale Schnittgeschwindigkeit bei Werkzeugen strikt begrenzt?', answer: 'Überschreitet die Fliehkraft die Festigkeit der Scheibe, kann sie explosionsartig bersten; die Berufsgenossenschaft begrenzt Trennscheiben typisch auf max. 80 m/s.' },
      { question: 'Wie berechnet man die optimale Drehzahl für einen Bohrer in Metall?', answer: 'Drehzahl n = (Schnittgeschwindigkeit v_c in m/min · 1.000) / (pi · Bohrerdurchmesser d in mm).' }
    ]
  },
  'beleuchtungsstaerke-lux-lumen-rechner': {
    intro: 'Dieser lichttechnische Rechner transformiert den Lichtstrom einer Lampe in Lumen (lm) in die resultierende Beleuchtungsstärke in Lux (lx) auf einer Zielfläche.',
    details: '1 Lux = 1 Lumen pro Quadratmeter (lx = lm / m²). Nach der Arbeitsstättenverordnung (ASR A3.4) sind für normale Büroarbeitsplätze mindestens 500 Lux, für feine technische Zeichnungen mindestens 750 bis 1.000 Lux vorgeschrieben.',
    faqs: [
      { question: 'Wie viel Lux liefert das natürliche Sonnenlicht im Freien?', answer: 'An einem sonnigen Sommertag erreicht die Beleuchtungsstärke bis zu 100.000 Lux; an einem trüben Wintertag ca. 3.000 bis 5.000 Lux; Vollmondlicht liefert nur ca. 0,25 Lux.' },
      { question: 'Wie viele LED-Lumen benötigt man für ein 20 m² großes Wohnzimmer?', answer: 'Für stimmungsvolle Wohnraumbeleuchtung (ca. 150 Lux) werden 150 lx × 20 m² = ca. 3.000 Lumen Gesamtlichtstrom aus verschiedenen Lampen benötigt.' }
    ]
  },
  'elektrische-ladung-kapazitaet-rechner': {
    intro: 'Dieser Elektro-Rechner transformiert Kapazitäten und elektrische Ladungsmengen zwischen Farad (F), Milliamperestunden (mAh), Amperestunden (Ah) und Coulomb (C).',
    details: '1 Coulomb = 1 Amperesekunde (A·s). 1 Amperestunde (Ah) = 3.600 Coulomb. Ein Smartphone-Akku mit 5.000 mAh speichert bei einer Nennspannung von 3,7 Volt eine Energie von 18,5 Wattstunden (Wh).',
    faqs: [
      { question: 'Wie rechnet man mAh in Wattstunden (Wh) für Powerbanks im Flugzeug um?', answer: 'Wattstunden = (Kapazität in mAh · Zellspannung in Volt) / 1.000. Die IATA-Grenze für Handgepäck liegt meist bei 100 Wh (ca. 27.000 mAh bei 3,7 V).' },
      { question: 'Was ist die Einheit Farad bei Kondensatoren?', answer: 'Ein Kondensator hat eine Kapazität von 1 Farad, wenn das Laden mit einer Ladung von 1 Coulomb eine Spannung von 1 Volt erzeugt (C = Q / U).' }
    ]
  },
  'radioaktivitaet-strahlendosis-rechner': {
    intro: 'Dieser Strahlenschutzrechner konvertiert Aktivität in Becquerel (Bq) und biologische Strahlendosen zwischen Sievert (Sv), Millisievert (mSv) und Gray (Gy).',
    details: '1 Becquerel entspricht einem Atomzerfall pro Sekunde. Das Sievert bewertet die biologische Schädigungswirkung auf menschliches Gewebe: Die durchschnittliche natürliche Strahlenbelastung in Deutschland beträgt ca. 2,1 mSv pro Person und Jahr.',
    faqs: [
      { question: 'Wie viel Strahlung verursacht ein Langstreckenflug nach New York?', answer: 'Durch die Höhenstrahlung in 10 bis 12 km Höhe beträgt die Dosis eines Hin- und Rückflugs Frankfurt–New York ca. 0,05 bis 0,10 Millisievert (entspricht etwa einer Röntgenaufnahme der Lunge).' },
      { question: 'Welcher gesetzliche Dosisgrenzwert gilt für beruflich strahlenexponierte Personen?', answer: 'Nach der Strahlenschutzverordnung (StrlSchV) maximal 20 Millisievert pro Kalenderjahr.' }
    ]
  },
  'viskositaet-umrechner': {
    intro: 'Dieser Strömungsrechner transformiert die dynamische Viskosität (Pascal-Sekunden Pa·s, Centipoise cP) und kinematische Viskosität (m²/s, Centistokes cSt) von Fluiden und Schmierölen.',
    details: 'Kinematische Viskosität nu = Dynamische Viskosität eta / Dichte rho. Wasser bei 20 °C besitzt eine dynamische Viskosität von ca. 1,0 mPa·s (1 cP); Motoröl 10W-40 liegt bei ca. 100 bis 200 mPa·s.',
    faqs: [
      { question: 'Wie ändert sich die Viskosität von Flüssigkeiten bei Erwärmung?', answer: 'Bei fast allen Flüssigkeiten sinkt die Viskosität bei Erwärmung drastisch (sie werden dünnflüssiger); bei Gasen steigt die Viskosität hingegen bei höherer Temperatur leicht an.' },
      { question: 'Was bedeuten die Zahlen bei Motoröl wie 5W-30?', answer: 'Die Zahl vor dem W (Winter) gibt das Kaltfließverhalten bei Minustemperaturen an; die hintere Zahl die Hochtemperatur-Viskosität bei 100 °C Betriebstemperatur nach SAE J300.' }
    ]
  },
  'schuhe-kleidergroessen-umrechner': {
    intro: 'Dieser Größenumrechner gleicht internationale Konfektions- und Schuhgrößen zwischen EU (Paris-Stich), US, UK und Fußlänge in Zentimetern (Mondopoint) ab.',
    details: 'Die europäische Schuhgröße basiert auf dem Pariser Stich (1 Stich = 2/3 cm ≈ 6,67 mm): EU-Größe = (Fußlänge in cm + 1,5 cm Abrollzugabe) · 1,5. Eine Fußlänge von 27 cm entspricht EU-Größe 42.',
    faqs: [
      { question: 'Warum fallen Schuhgrößen verschiedener Hersteller so unterschiedlich aus?', answer: 'Weil Hersteller unterschiedliche Leistenformen verwenden und US/UK-Größen oft mit gerundeten Umrechnungsfaktoren in EU-Größen übersetzen.' },
      { question: 'Was ist das Mondopoint-System?', answer: 'Das internationale ISO-9407-Normsystem für Schuhe (z. B. bei Skischuhen und Bundeswehr): Es gibt schlicht die reale Fußlänge und Fußbreite direkt in Millimetern an.' }
    ]
  },
  'papierformat-din-rechner': {
    intro: 'Die deutsche Norm DIN 476 (international ISO 216) definiert die Standard-Papierformate der Reihe A mit dem konstanten Seitenverhältnis 1 zu Wurzel aus 2 (1 : 1,414).',
    details: 'Das Ausgangsformat DIN A0 hat eine Fläche von exakt 1 Quadratmeter (841 × 1.189 mm). Durch mittiges Falten entsteht die jeweils nächstkleinere Größe mit exakt identischem Seitenverhältnis (DIN A4 = 210 × 297 mm).',
    faqs: [
      { question: 'Wie viel wiegt ein DIN-A4-Blatt Normalpapier (80 g/m²)?', answer: 'Aus 1 m² (DIN A0) entstehen durch viermaliges Halbieren genau 16 DIN-A4-Blätter. Ein Blatt wiegt: 80 g / 16 = exakt 5,0 Gramm.' },
      { question: 'Welches Format passt in einen Standard-Briefumschlag DIN lang?', answer: 'Ein zweimal horizontal gefaltetes DIN-A4-Blatt (105 × 210 mm) passt exakt in einen DIN-lang-Umschlag (110 × 220 mm).' }
    ]
  },
  'ringgroesse-umrechner': {
    intro: 'Dieser Schmuckrechner konvertiert Ringmaße zwischen dem deutschen Innenumfang in Millimetern, dem Innendurchmesser sowie US- und UK-Ringgrößen.',
    details: 'Die deutsche Ringgröße entspricht exakt dem inneren Fingerumfang in Millimetern (Ringgröße 54 = 54 mm Innenumfang). Der Innendurchmesser beträgt d = Umfang / pi (bei Größe 54 entspricht das ca. 17,2 mm).',
    faqs: [
      { question: 'Zu welcher Tageszeit sollte man die Ringgröße am besten messen?', answer: 'Am späten Nachmittag oder Abend bei normaler Zimmertemperatur; morgens oder bei Kälte sind die Finger meist etwas dünner, bei Sommerhitze geschwollen.' },
      { question: 'Wie misst man die Ringgröße heimlich für einen Heiratsantrag?', answer: 'Nehmen Sie einen gut sitzenden Ring der Partnerin und messen Sie mit einem präzisen Messschieber den inneren Durchmesser auf den Zehntelmillimeter genau ab.' }
    ]
  },
  'dezibel-schalldruck-umrechner': {
    intro: 'Das Dezibel (dB) ist eine logarithmische Maßeinheit für den Schalldruckpegel bezogen auf die menschliche Hörschwelle (20 Mikropascal bei 1.000 Hz).',
    details: 'Schalldruckpegel L_p = 20 · log10(p / p0). Eine Pegelerhöhung um +6 dB verdoppelt den physikalischen Schalldruck; eine Erhöhung um +10 dB wird vom menschlichen Gehör subjektiv als Verdopplung der Lautstärke empfunden.',
    faqs: [
      { question: 'Ab welcher Lautstärke drohen dauerhafte Gehörschäden?', answer: 'Dauerlärm ab 85 dB(A) am Arbeitsplatz erfordert gesetzlichen Gehörschutz; ab 120 dB(A) (z. B. Flugzeugstart, Clubbox) liegt die Schmerzschwelle und es können akute Knalltraumata entstehen.' },
      { question: 'Was ergibt die Summe von zwei identischen 60-dB-Schallquellen?', answer: 'Wegen der logarithmischen Addition verdoppelt sich die Schallleistung: 60 dB + 60 dB = exakt 63 dB (nicht 120 dB!).' }
    ]
  }
};
