import { CalcContent } from './types';

export const GEOMETRIE_CONTENT: Record<string, CalcContent> = {
  kreisrechner: {
    intro: 'Dieser Kreisrechner berechnet Flächeninhalt, Umfang, Durchmesser und Radius eines ebenen Kreises über die Kreiszahl Pi (pi ≈ 3,14159265).',
    details: 'Fundamentale Formeln: Fläche A = pi · r², Umfang U = 2 · pi · r = pi · d. Wird der Radius eines Kreises verdoppelt, vervierfacht sich dessen Flächeninhalt.',
    faqs: [
      { question: 'Wie berechnet man den Radius, wenn nur die Fläche bekannt ist?', answer: 'Man teilt den Flächeninhalt durch Pi und zieht aus dem Zwischenergebnis die Quadratwurzel: r = Wurzel(A / pi).' },
      { question: 'Woher stammt die Kreiszahl Pi?', answer: 'Pi ist das konstante Verhältnis des Umfangs eines beliebigen Kreises zu seinem Durchmesser, eine irrationale und transzendente mathematische Konstante.' }
    ]
  },
  zylinderrechner: {
    intro: 'Der Zylinderrechner ermittelt Rauminhalt (Volumen), Mantelfläche und gesamte Oberfläche gerader Kreiszylinder (Tanks, Rohre, Dosen).',
    details: 'Volumen V = pi · r² · h. Mantelfläche M = 2 · pi · r · h. Gesamtoberfläche O = 2 · pi · r² + 2 · pi · r · h. 1 Kubikdezimeter (dm³) Zylindervolumen entspricht exakt einem Liter Flüssigkeit.',
    faqs: [
      { question: 'Wie berechnet man das Fassungsvermögen einer Regentonne in Litern?', answer: 'Messen Sie Innenradius r und Füllhöhe h in Dezimetern (dm): Das berechnete Volumen in dm³ entspricht direkt der Literzahl (z. B. r=3 dm, h=8 dm -> V ≈ 226 Liter).' },
      { question: 'Was ist ein gleichseitiger Zylinder?', answer: 'Ein Zylinder, dessen Höhe h exakt seinem Durchmesser d (h = 2r) entspricht; er besitzt das minimale Oberflächen-zu-Volumen-Verhältnis aller Kreiszylinder.' }
    ]
  },
  rechteckrechner: {
    intro: 'Dieser Rechteckrechner ermittelt Flächeninhalt, Umfang und die Diagonale (Satz des Pythagoras) rechtwinkliger Vierecke.',
    details: 'Fläche A = a · b; Umfang U = 2 · (a + b); Diagonale d = Wurzel(a² + b²). Das Rechteck mit dem größten Flächeninhalt bei gegebenem Umfang ist stets das regelmäßige Quadrat (a = b).',
    faqs: [
      { question: 'Wie berechnet man die Diagonale eines 4 × 3 Meter großen Raumes?', answer: 'd = Wurzel(4² + 3²) = Wurzel(16 + 9) = Wurzel(25) = 5,00 Meter (klassisches 3-4-5-Dreieck zur Prüfung rechter Winkel auf Baustellen).' },
      { question: 'Wie rechnet man Quadratmeter in Hektar um?', answer: 'Ein Hektar umfasst genau 10.000 Quadratmeter (z. B. ein quadratisches Grundstück mit 100 × 100 Metern Seitenlänge).' }
    ]
  },
  'dreieck-flaeche-rechner': {
    intro: 'Dieser Flächenrechner bestimmt den Flächeninhalt beliebiger Dreiecke wahlweise über Grundseite und Höhe, über zwei Seiten und Zwischenwinkel oder über die drei Seitenlängen.',
    details: 'Standardformel: A = 1/2 · g · h. Satz von Heron bei drei bekannten Seiten: A = Wurzel[s · (s-a) · (s-b) · (s-c)] mit dem halben Umfang s = (a+b+c)/2.',
    faqs: [
      { question: 'Gilt die Formel A = 1/2 · g · h auch bei stumpfwinkligen Dreiecken?', answer: 'Ja, uneingeschränkt: Bei stumpfwinkligen Dreiecken liegt der Höhenfußpunkt außerhalb des Dreiecks auf der verlängerten Grundlinie.' },
      { question: 'Wie lautet die Trigonometrie-Formel für die Dreiecksfläche?', answer: 'A = 1/2 · a · b · sin(gamma). Sie benötigt lediglich zwei Seitenlängen und den von ihnen eingeschlossenen Innenwinkel.' }
    ]
  },
  'kreis-umfang-rechner': {
    intro: 'Dieser Rechner ermittelt den Umfang eines Kreises aus Radius oder Durchmesser und dient der Dimensionierung von Rundstrecken, Rohren und Baumstämmen.',
    details: 'Umfang U = pi · d = 2 · pi · r. In der Forstwirtschaft wird der Stammumfang in Brusthöhe (1,30 m) gemessen und durch Pi geteilt, um den Stammdurchmesser (BHD) ohne Fällung zu bestimmen.',
    faqs: [
      { question: 'Wie lang ist die Umlaufbahn der Erde um die Sonne näherungsweise?', answer: 'Bei einem mittleren Sonnenabstand von ca. 149,6 Mio. km beträgt der Erdumfang U ≈ 2 · pi · 149,6 Mio. km ≈ 940 Millionen Kilometer pro Jahr.' },
      { question: 'Wie viel Zaun benötigt man für ein rundes Beet mit 4 m Durchmesser?', answer: 'U = pi · 4 m ≈ 12,57 Meter Zaunlänge.' }
    ]
  },
  'kegel-volumen-rechner': {
    intro: 'Dieser Kegelrechner ermittelt Rauminhalt, Mantelfläche und Mantellinie s gerader Kreiskegel (Silotrichter, Schüttkegel, Hütchen).',
    details: 'Volumen V = 1/3 · pi · r² · h. Ein Kegel hat exakt ein Drittel des Volumens eines Zylinders mit gleicher Grundfläche und Höhe. Mantellinie s = Wurzel(r² + h²).',
    faqs: [
      { question: 'Wie berechnet man das Volumen eines aufgeschütteten Sandkegels?', answer: 'Messen Sie den Bodenumfang zur Bestimmung des Radius r und die Höhe h des Schüttkegels an der Spitze: V = 1/3 · pi · r² · h.' },
      { question: 'Wie lautet die Formel für die gekrümmte Mantelfläche des Kegels?', answer: 'Mantelfläche M = pi · r · s, wobei s die schräge Mantellinie von der Grundkreiskante bis zur Spitze ist.' }
    ]
  },
  'hohlzylinder-rohr-rechner': {
    intro: 'Dieser Rohrrechner berechnet das Materialvolumen, Wandstärken und das Rohrgewicht von metallischen oder Kunststoff-Hohlzylindern.',
    details: 'Materialvolumen V = pi · (r_aussen² - r_innen²) · h. Das Gewicht ergibt sich durch Multiplikation des Materialvolumens mit der Materialdichte (z. B. Stahl 7,85 g/cm³, Kupfer 8,96 g/cm³).',
    faqs: [
      { question: 'Wie berechnet man die Wandstärke eines Rohres?', answer: 'Wandstärke s = (Außendurchmesser - Innendurchmesser) / 2.' },
      { question: 'Wie berechnet man das Füllvolumen (Wasserinhalt) eines Rohres?', answer: 'Das Innenvolumen entspricht einem Vollzylinder mit dem Innenradius: V_innen = pi · r_innen² · Länge.' }
    ]
  },
  'pyramide-volumen-rechner': {
    intro: 'Dieser Pyramidenrechner bestimmt Rauminhalt, Mantelfläche und Gesamtoberfläche gerader Pyramiden mit quadratischer oder rechteckiger Grundfläche.',
    details: 'Volumen V = 1/3 · Grundfläche G · Körperhöhe h. Die Cheops-Pyramide in Ägypten hatte ursprünglich eine Grundseite von ca. 230 m und eine Höhe von 146,6 m (Volumen: ca. 2,58 Millionen m³).',
    faqs: [
      { question: 'Warum lautet der Vorfaktor bei Spitzkörpern immer 1/3?', answer: 'Weil sich jeder dreidimensionale Körper mit linear zur Spitze hin abnehmendem Querschnitt mathematisch über die Integralrechnung auf exakt ein Drittel des Prismas summiert.' },
      { question: 'Wie berechnet man die Seitenhöhe einer quadratischen Pyramide?', answer: 'Über den Satz des Pythagoras: Seitenhöhe h_s = Wurzel[h² + (a/2)²].' }
    ]
  },
  'trapez-flaeche-rechner': {
    intro: 'Ein Trapez ist ein ebenes Viereck mit zwei zueinander parallelen Seiten a und c.',
    details: 'Fläche A = [(a + c) / 2] · h = Mittellinie m · Höhe h. Die Höhe h ist der senkrechte Abstand zwischen den beiden parallelen Grundseiten.',
    faqs: [
      { question: 'Was ist ein gleichschenkliges Trapez?', answer: 'Ein Trapez, bei dem die beiden nicht-parallelen Schenkel b und d exakt gleich lang sind; es ist spiegelsymmetrisch und besitzt gleich große Basiswinkel.' },
      { question: 'Wie berechnet man den Flächeninhalt von Grundstücken mit Trapezform?', answer: 'Messen Sie die beiden parallelen Grundstücksgrenzen a und c, addieren Sie beide, teilen Sie durch 2 und multiplizieren Sie mit dem senkrechten Grenzabstand h.' }
    ]
  },
  'parallelogramm-rechner': {
    intro: 'Ein Parallelogramm (Raute/Rhomboid) ist ein Viereck, bei dem die jeweils gegenüberliegenden Seiten parallel und gleich lang sind.',
    details: 'Fläche A = Grundseite a · Höhe h_a = a · b · sin(alpha). Umfang U = 2 · (a + b). Gegenüberliegende Innenwinkel sind exakt gleich groß; benachbarte Winkel ergänzen sich zu 180°.',
    faqs: [
      { question: 'Warum darf man für die Fläche nicht einfach Seite a mal Seite b rechnen?', answer: 'Weil a · b nur bei einem rechtwinkligen Rechteck die Fläche ergibt; bei schiefen Winkeln ist die senkrechte Höhe h_a stets kürzer als die Schenkelseite b (h_a = b · sin(alpha)).' },
      { question: 'Halbieren sich die Diagonalen im Parallelogramm gegenseitig?', answer: 'Ja, in jedem Parallelogramm schneiden sich die beiden Diagonalen e und f exakt in ihren jeweiligen Mittelpunkten.' }
    ]
  },
  'rhombus-raute-rechner': {
    intro: 'Ein Rhombus (Raute) ist ein Parallelogramm mit vier gleich langen Seiten, dessen Diagonalen sich senkrecht schneiden.',
    details: 'Fläche A = a · h = (e · f) / 2, wobei e und f die Längen der beiden senkrecht aufeinander stehenden Diagonalen sind. Umfang U = 4 · a.',
    faqs: [
      { question: 'Was ist der Unterschied zwischen Rhombus und Quadrat?', answer: 'Jedes Quadrat ist ein Rhombus mit rechten Winkeln (90°); ein allgemeiner Rhombus besitzt schiefe Innenwinkel ungleich 90°.' },
      { question: 'Wie berechnet man die Seitenlänge a aus den Diagonalen?', answer: 'Über den Satz des Pythagoras im Teildreieck: a = Wurzel[(e/2)² + (f/2)²].' }
    ]
  },
  'kugel-oberflaeche-rechner': {
    intro: 'Dieser Kugelrechner bestimmt Rauminhalt (Volumen) und Kugeloberfläche nach den klassischen Gesetzen des Archimedes.',
    details: 'Volumen V = 4/3 · pi · r³. Oberfläche O = 4 · pi · r² = pi · d². Die Kugel besitzt von allen geometrischen Körpern das kleinste Oberflächen-zu-Volumen-Verhältnis (minimale Wärmeverluste).',
    faqs: [
      { question: 'Welches Volumen hat die Erdkugel näherungsweise?', answer: 'Bei einem mittleren Erdradius von r ≈ 6.371 km beträgt das Erdvolumen ca. 1,083 Billionen Kubikkilometer (1,083 · 10¹² km³).' },
      { question: 'Wie verhält sich die Oberfläche einer Kugel zu ihrem Großkreis?', answer: 'Die Oberfläche einer Kugel entspricht exakt der vierfachen Fläche ihres größten Schnittkreises (4 · pi · r²).' }
    ]
  },
  'quader-volumen-rechner': {
    intro: 'Der Quaderrechner berechnet Rauminhalt, Gesamtoberfläche, Kantenlänge und Raumdiagonale rechtwinkliger Schachteln, Räume und Container.',
    details: 'Volumen V = a · b · c. Oberfläche O = 2 · (ab + bc + ac). Raumdiagonale d = Wurzel(a² + b² + c²). 1 m³ entspricht genau 1.000 Litern Rauminhalt.',
    faqs: [
      { question: 'Passt eine 2,50 m lange Latte in einen Karton mit 2 × 1 × 1 Meter?', answer: 'Raumdiagonale d = Wurzel(2² + 1² + 1²) = Wurzel(4 + 1 + 1) = Wurzel(6) ≈ 2,45 Meter. Nein, die Latte ist ca. 5 cm zu lang.' },
      { question: 'Wie viele 20-Fuß-Seecontainer (ca. 33 m³ Innenvolumen) benötigt man für 100 m³ Frachtgut?', answer: '100 / 33 = 3,03; es werden mindestens 4 Container benötigt.' }
    ]
  },
  'prisma-volumen-rechner': {
    intro: 'Ein gerades Prisma ist ein geometrischer Körper mit zwei kongruenten Vielecken als Grund- und Deckfläche und rechteckigen Mantelflächen.',
    details: 'Volumen V = Grundfläche G · Höhe h. Gesamtoberfläche O = 2 · G + Mantelfläche M (wobei M = Umfang der Grundfläche · Höhe).',
    faqs: [
      { question: 'Gilt die Formel V = G · h für jedes Prisma unabhängig von der Grundflächenform?', answer: 'Ja, völlig universell: Egal ob die Grundfläche ein Dreieck, Fünfeck oder unregelmäßiges Trapez ist, das Volumen ist immer Grundfläche mal Höhe.' },
      { question: 'Was ist ein optisches Prisma in der Physik?', answer: 'Ein dreiseitiges Glasprisma, das weißes Sonnenlicht durch wellenlängenabhängige Lichtbrechung (Dispersion) in seine Spektralfarben auffächert.' }
    ]
  },
  'sechseck-polygon-rechner': {
    intro: 'Das regelmäßige Sechseck (Hexagon) besteht aus sechs lückenlos aneinandergefügten, gleichseitigen Dreiecken und kommt häufig in der Natur (Bienenwaben, Schneeflocken) vor.',
    details: 'Fläche A = (3 · Wurzel(3) / 2) · a² ≈ 2,598 · a². Umfang U = 6 · a. Der Inkreisradius entspricht r_i = (Wurzel(3) / 2) · a, der Umkreisradius r_u ist exakt gleich der Seitenlänge a.',
    faqs: [
      { question: 'Warum bauen Bienen ihre Waben sechseckig?', answer: 'Das Sechseck ist die mathematisch effizienteste Form für lückenlose Parkettierungen: Es maximiert das Speichervolumen bei minimalem Wachs-Umfang (Bienenwaben-Satz).' },
      { question: 'Welche Schlüsselweite (SW) hat eine Sechskantschraube mit Seitenlänge 10 mm?', answer: 'Die Schlüsselweite entspricht dem doppelten Inkreisradius: SW = Wurzel(3) · a ≈ 1,732 · 10 mm ≈ 17,32 mm (Standard M10 nutzt typisch SW 16 oder 17).' }
    ]
  },
  'ellipse-flaeche-rechner': {
    intro: 'Eine Ellipse ist eine gestreckte Kreisform mit einer großen Halbachse a und einer kleinen Halbachse b.',
    details: 'Flächeninhalt A = pi · a · b. Sind beide Halbachsen gleich groß (a = b = r), geht die Ellipsenformel direkt in die Kreisflächenformel pi · r² über.',
    faqs: [
      { question: 'Warum lässt sich der Umfang einer Ellipse nicht mit einer einfachen Formel exakt berechnen?', answer: 'Der Umfang einer Ellipse erfordert elliptische Integrale zweiter Art; in der Praxis nutzt man sehr genaue Näherungsformeln von Ramanujan: U ≈ pi · [3(a+b) - Wurzel((3a+b)(a+3b))].' },
      { question: 'Was besagt das 1. Keplersche Gesetz über Planetenbahnen?', answer: 'Alle Planeten unseres Sonnensystems bewegen sich auf elliptischen Bahnen um die Sonne, wobei die Sonne in einem der beiden Brennpunkte der Ellipse steht.' }
    ]
  },
  'kreissegment-rechner': {
    intro: 'Ein Kreissegment (Kreisabschnitt) ist die Fläche zwischen einer Kreissehne und dem dazugehörigen Kreisbogen.',
    details: 'Fläche A = 1/2 · r² · (alpha_rad - sin(alpha)). Segmenthöhe h = r · (1 - cos(alpha / 2)). Wichtig für die Füllstandsberechnung liegender zylindrischer Tanks.',
    faqs: [
      { question: 'Wie berechnet man den Füllstand in einem liegenden Öltank?', answer: 'Über die Kreissegmentfläche des Tankquerschnitts multipliziert mit der Tanklänge; das Segment ändert sein Volumen nicht-linear zur Füllhöhe.' },
      { question: 'Was ist der Unterschied zwischen Kreissektor und Kreissegment?', answer: 'Ein Kreissektor (Tortenstück) reicht bis zum Kreismittelpunkt; ein Kreissegment ist nur der abgeschnittene Bogenbereich jenseits der Sehne.' }
    ]
  },
  'bogenmass-grad-rechner': {
    intro: 'Dieser Winkelumrechner transformiert ebene Winkel zwischen dem bürgerlichen Gradmaß (360° Vollkreis) und dem mathematischen Bogenmaß (Radiant, 2pi Vollkreis).',
    details: 'Umrechnungsformeln: Radiant = Grad · (pi / 180°); Grad = Radiant · (180° / pi). 1 Radiant entspricht ca. 57,2958° (Winkel, bei dem die Bogenlänge exakt dem Radius entspricht).',
    faqs: [
      { question: 'Warum rechnen Naturwissenschaften und Programmiersprachen bevorzugt in Radiant?', answer: 'Weil sich trigonometrische Ableitungen (z. B. d/dx sin(x) = cos(x)) und Taylor-Reihen nur im Bogenmaß ohne störende Korrekturfaktoren wie pi/180 formulieren lassen.' },
      { question: 'Welchem Bogenmaß entsprechen 90° und 180°?', answer: '90° entsprechen exakt pi/2 Radiant (ca. 1,5708 rad); 180° entsprechen exakt pi Radiant (ca. 3,1416 rad).' }
    ]
  },
  'satz-des-pythagoras-rechner': {
    intro: 'Dieser Geometrierechner berechnet Katheten und Hypotenuse rechtwinkliger Dreiecke und prüft Dreiecke auf Rechtwinkligkeit (Kehrsatz des Pythagoras).',
    details: 'Hypotenuse c = Wurzel(a² + b²); Kathete a = Wurzel(c² - b²). Gilt a² + b² = c², ist der eingeschlossene Winkel gamma garantiert exakt 90 Grad.',
    faqs: [
      { question: 'Wie prüften schon die alten Ägypter rechte Winkel auf Feldern?', answer: 'Mit einer Zwölfknotenschnur mit den Knotenabständen 3, 4 und 5 Einheiten; aufgespannt bildet sie zwingend einen perfekten 90-Grad-Winkel.' },
      { question: 'Welche Kathetenlänge hat ein gleichschenklig-rechtwinkliges Dreieck mit c = 10 cm?', answer: 'a = b = c / Wurzel(2) = 10 / 1,4142 ≈ 7,07 cm.' }
    ]
  },
  'sinussatz-kosinussatz-rechner': {
    intro: 'Sinussatz und Kosinussatz berechnen unbekannte Seiten und Winkel in beliebigen schiefwinkligen Dreiecken ohne rechten Winkel.',
    details: 'Sinussatz: a / sin(alpha) = b / sin(beta) = c / sin(gamma) = 2R (Umkreisdurchmesser). Kosinussatz: c² = a² + b² - 2ab · cos(gamma) (Verallgemeinerung des Satzes des Pythagoras).',
    faqs: [
      { question: 'Wann wendet man den Sinussatz und wann den Kosinussatz an?', answer: 'Kosinussatz: Wenn alle drei Seiten (SSS) oder zwei Seiten und der eingeschlossene Winkel (SWS) gegeben sind. Sinussatz: Wenn eine Seite und zwei Winkel (WSW/SWW) oder zwei Seiten und der Gegenwinkel gegeben sind.' },
      { question: 'Was ist der mehrdeutige Fall (SSW) beim Sinussatz?', answer: 'Wenn der gegebene Winkel der kleineren der beiden Seiten gegenüberliegt; in diesem Fall kann es zwei mathematisch gültige Dreiecke (spitz- und stumpfwinklig) geben.' }
    ]
  },
  'vektor-skalarprodukt-rechner': {
    intro: 'Das Skalarprodukt zweier Vektoren multipliziert einander entsprechende Komponenten und verknüpft Vektorgeometrie mit Winkelmessungen.',
    details: 'Skalarprodukt a · b = a1·b1 + a2·b2 + a3·b3 = |a| · |b| · cos(phi). Stehen zwei Vektoren senkrecht (orthogonal) aufeinander, ist ihr Skalarprodukt exakt null (da cos(90°) = 0).',
    faqs: [
      { question: 'Wie berechnet man den Schnittwinkel zwischen zwei Vektoren?', answer: 'cos(phi) = (a · b) / (|a| · |b|). Man teilt das Skalarprodukt durch das Produkt der beiden Vektorlängen (Beträge) und wendet den Arkuskosinus (arccos) an.' },
      { question: 'Was ist der Unterschied zwischen Skalarprodukt und Kreuzprodukt?', answer: 'Das Skalarprodukt liefert als Ergebnis eine reelle Zahl (Skalar); das Vektorprodukt (Kreuzprodukt) liefert einen neuen dreidimensionalen Vektor, der senkrecht auf beiden Ausgangsvektoren steht.' }
    ]
  },
  'torus-volumen-rechner': {
    intro: 'Ein Torus ist ein dreidimensionaler Rotationskörper in Gestalt eines Schwimmreifens oder Donuts, der durch Rotation eines Kreises um eine externe Achse entsteht.',
    details: 'Nach den Guldinschen Regeln: Volumen V = 2 · pi² · R · r². Oberfläche O = 4 · pi² · R · r, wobei R der Abstand vom Mittelpunkt zum Rohrzentrum und r der Radius des Rohres ist.',
    faqs: [
      { question: 'Welche Abmessungen müssen für einen Torus gelten?', answer: 'Der Torusmittelpunktsradius R muss größer oder gleich dem Rohrradius r sein (R ≥ r); ist R = r, berührt sich das Innenloch in einem einzigen Punkt (Horn-Torus).' },
      { question: 'Wo werden Tori in der Hochtechnologie eingesetzt?', answer: 'In Fusionsreaktoren vom Typ Tokamak und Stellarator, um extrem heißes Plasma über kreisförmige Magnetfelder berührungslos einzuschließen.' }
    ]
  },
  'stumpf-kegel-rechner': {
    intro: 'Ein Kegelstumpf entsteht, wenn die Spitze eines geraden Kreiskegels durch einen ebenen Schnitt parallel zur Grundfläche abgetrennt wird (Eimer, Lampenschirm, Blumentopf).',
    details: 'Volumen V = 1/3 · pi · h · (R² + R·r + r²). Mantelfläche M = pi · (R + r) · s mit der Mantellinie s = Wurzel[(R - r)² + h²].',
    faqs: [
      { question: 'Wie berechnet man das Fassungsvermögen eines Standard-Baueimers?', answer: 'Messen Sie oberen Innenradius R, unteren Innenradius r und Füllhöhe h in Dezimetern: Das berechnete Volumen entspricht direkt den Litern Inhalt.' },
      { question: 'Wie verhält sich das Volumen, wenn der obere Radius r gegen 0 geht?', answer: 'Setzt man r = 0, geht die Kegelstumpfformel exakt in die normale Kegelvolumenformel V = 1/3 · pi · h · R² über.' }
    ]
  },
  'dreiecks-hoehen-rechner': {
    intro: 'Dieser Höhenrechner ermittelt die drei senkrechten Höhen h_a, h_b und h_c eines Dreiecks aus den Seitenlängen über den Flächeninhalt.',
    details: 'Formeln: h_a = (2 · A) / a; h_b = (2 · A) / b; h_c = (2 · A) / c. Die drei Höhenlinien eines Dreiecks schneiden sich stets in einem gemeinsamen Punkt, dem Höhenschnittpunkt H.',
    faqs: [
      { question: 'Wann liegt der Höhenschnittpunkt außerhalb des Dreiecks?', answer: 'Bei jedem stumpfwinkligen Dreieck liegt der Höhenschnittpunkt H im Außenbereich jenseits der stumpfen Ecke.' },
      { question: 'Wo liegt der Höhenschnittpunkt bei einem rechtwinkligen Dreieck?', answer: 'Exakt im Scheitelpunkt des rechten 90-Grad-Winkels, da die beiden Katheten gleichzeitig als Höhen aufeinander fungieren.' }
    ]
  },
  'goldener-schnitt-rechner': {
    intro: 'Der Goldene Schnitt (Phi ≈ 1,6180339887) beschreibt das harmonische Teilungsverhältnis (a+b)/a = a/b, das seit der Antike Architektur, Kunst und Fotografie prägt.',
    details: 'Teilt man eine Gesamtstrecke im Goldenen Schnitt (Major a und Minor b), macht der größere Teil rund 61,8 % und der kleinere Teil ca. 38,2 % der Gesamtstrecke aus. Phi lässt sich exakt ausdrücken als (1 + Wurzel(5)) / 2.',
    faqs: [
      { question: 'Welcher Zusammenhang besteht zwischen dem Goldenen Schnitt und der Fibonacci-Folge?', answer: 'Der Quotient zweier aufeinanderfolgender Fibonacci-Zahlen (1, 1, 2, 3, 5, 8, 13, 21, 34...) nähert sich mit wachsenden Zahlen immer präziser der Zahl Phi des Goldenen Schnitts an.' },
      { question: 'Was ist die Drittel-Regel in der Fotografie?', answer: 'Eine praktische Vereinfachung des Goldenen Schnitts: Das Bild wird durch je zwei horizontale und vertikale Linien in 9 gleiche Felder geteilt; Hauptmotive platziert man auf den Schnittpunkten.' }
    ]
  }
};
