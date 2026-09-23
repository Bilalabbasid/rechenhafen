import { CalcContent } from './types';

export const KOCHEN_CONTENT: Record<string, CalcContent> = {
  portionsrechner: {
    intro: 'Dieser Portionsrechner skaliert alle Rezeptzutaten linear auf jede gewünschte Personenanzahl oder Tellerportion.',
    details: 'Menge neu = Originalmenge · (Neue Portionen / Originalportionen). Bei Gewürzen, Salz und Schärfe (Chili) empfiehlt sich ein leicht unterproportionaler Faktor, um ein Überwürzen großer Mengen zu verhindern.',
    faqs: [
      { question: 'Muss man Garzeiten verdoppeln, wenn man für doppelt so viele Personen kocht?', answer: 'Nein! Garzeiten hängen von der Dicke des Garguts und der Temperatur ab, nicht von der Gesamtmenge im Topf (sofern der Topf groß genug ist).' },
      { question: 'Wie skaliert man Eier bei ungeraden Portionszahlen (z. B. 1,5 Eier)?', answer: 'Verquirlen Sie ein ganzes Ei mit der Gabel in einer Tasse und wiegen Sie die Hälfte des verquirlten Eies ab (ein Ei Gr. M wiegt ca. 50 g ohne Schale).' }
    ]
  },
  'backform-umrechner': {
    intro: 'Dieser Backform-Umrechner skaliert Zutatenmengen quadratisch anhand des Durchmessers runder Springformen oder rechteckiger Backbleche.',
    details: 'Umrechnungsfaktor = Neue Grundfläche / Alte Grundfläche = (d_neu / d_alt)². Der Wechsel von einer 26-cm-Springform auf eine 28-cm-Form verlangt ca. 16 Prozent mehr Teig; der Wechsel von 26 cm auf 20 cm spart 41 Prozent Teig.',
    faqs: [
      { question: 'Wie ändert sich die Backzeit bei einer kleineren oder größeren Backform?', answer: 'Wird der Teig in einer größeren Form flacher, verkürzt sich die Backzeit um ca. 15 bis 20 %; wird der Kuchen in einer kleineren Form dicker, verlängert sich die Backzeit bei evtl. leicht reduzierter Hitze.' },
      { question: 'Welchem Springform-Durchmesser entspricht ein normales Backblech (ca. 40 × 30 cm)?', answer: 'Ein Backblech hat ca. 1.200 cm² Fläche; das entspricht exakt dem Teigvolumen von zwei 28-cm-Springformen (je ca. 615 cm²).' }
    ]
  },
  'gramm-in-ml-rechner': {
    intro: 'Dieser Küchenumrechner transformiert Gramm in Milliliter und umgekehrt unter Berücksichtigung der physikalischen Schütt- und Flüssigkeitsdichte der Zutat.',
    details: 'Volumen in ml = Masse in Gramm / Dichte in g/ml. Während 100 ml Wasser exakt 100 g wiegen, wiegen 100 ml Pflanzenöl nur ca. 92 g, 100 ml Bienenhonig ca. 142 g und 100 ml Mehl locker geschüttet nur rund 60 g.',
    faqs: [
      { question: 'Warum kann man Mehl auf dem Messbecher nicht millimetergenau ablesen?', answer: 'Weil Mehl kompressibel ist: Gesiebtes oder locker geschüttetes Mehl hat eine Dichte von ca. 0,55 g/ml; fest gerütteltes Mehl bis zu 0,75 g/ml (Präzisionsbacken erfordert eine Küchenwaage).' },
      { question: 'Wie viel wiegt 1 Liter Vollmilch?', answer: 'Aufgrund des Gehalts an Milchzucker, Proteinen und Mineralstoffen wiegt 1 Liter Milch ca. 1.030 Gramm.' }
    ]
  },
  'hefe-umrechner': {
    intro: 'Dieser Hefe-Konverter rechnet zwischen frischer Hefe (Hefewürfel), Trockenhefe und langer kalter Teigführung um.',
    details: 'Verhältnis: 1 Würfel Frischhefe (42 Gramm) entspricht exakt 2 Päckchen Trockenhefe (je 7 Gramm). 1 Päckchen Trockenhefe reicht für 500 g Weizenmehl.',
    faqs: [
      { question: 'Kann man Hefe durch längere Gehzeit drastisch reduzieren?', answer: 'Ja, bei langer kalter Teigführung über Nacht im Kühlschrank (18 bis 24 Stunden) reichen oft 1 bis 2 Gramm Frischhefe auf 500 g Mehl für bekömmliche, aromatische Teige.' },
      { question: 'Wie testet man, ob alte Frischhefe noch Triebkraft besitzt?', answer: 'Lösen Sie die Hefe in etwas lauwarmem Wasser mit einer Prise Zucker auf: Bilden sich nach 10 Minuten deutliche Schaumbläschen, ist die Hefe vital und backfähig.' }
    ]
  },
  'essloeffel-teeloeffel-gramm-rechner': {
    intro: 'Dieser Löffelrechner transformiert gestrichene und gehäufte Esslöffel (EL) und Teelöffel (TL) in exakte Gramm-Gewichte für Salz, Zucker, Mehl, Öl und Backpulver.',
    details: 'Volumina nach DIN: 1 gestrichener TL fasst ca. 5 ml; 1 gestrichener EL fasst ca. 15 ml. 1 gestrichener TL Salz wiegt ca. 5 g, Zucker ca. 4 g, Mehl ca. 3 g. 1 EL Öl wiegt ca. 12 g, Honig ca. 20 g.',
    faqs: [
      { question: 'Wie viel wiegt ein gehäufter Esslöffel Mehl?', answer: 'Ein gehäufter EL Mehl bringt etwa 12 bis 15 Gramm auf die Waage (etwa das Doppelte eines glatt gestrichenen Löffels).' },
      { question: 'Wie viel Gramm Backpulver enthält ein normales Tütchen?', answer: 'Ein handelsüblicher Beutel Backpulver in Deutschland wiegt exakt 15 bis 16 Gramm und reicht für 500 g Mehl.' }
    ]
  },
  'cups-in-gramm-rechner': {
    intro: 'Dieser US-Backrechner übersetzt amerikanische Cup-Volumenmaße in Gramm für Mehl, braunen Zucker, Butter und Haferflocken.',
    details: '1 US Legal Cup = 240 ml (Customary Cup = 236,6 ml). 1 Cup Mehl (All-Purpose Flour) wiegt ca. 125 g; 1 Cup Kristallzucker wiegt 200 g; 1 Cup Butter wiegt 227 g (exakt 2 Sticks à 1/2 Cup).',
    faqs: [
      { question: 'Warum scheitern US-Rezepte oft, wenn man Cups mit dem Messbecher abmisst?', answer: 'Weil Mehl im Cup "gescoopt" (geschaufelt) bis zu 150 g wiegen kann, gelöffelt und abgestrichen aber nur 120 g (Abweichung bis zu 25 % Trockenmasse).' },
      { question: 'Was wiegt 1 Stick Butter in US-Rezepten?', answer: '1 Stick Butter entspricht exakt 1/2 Cup bzw. 8 US-Esslöffeln und wiegt genau 113,4 Gramm.' }
    ]
  },
  'zucker-ersatz-rechner': {
    intro: 'Dieser Süßungsrechner konvertiert Haushaltszucker (Saccharose) in kalorienarme Alternativen wie Erythrit, Xylit (Birkenzucker), Stevia, Agavendicksaft und Honig.',
    details: 'Süßkraftfaktoren bezogen auf Haushaltszucker (100 %): Xylit 100 % (1:1 Austausch), Erythrit ca. 70 % (benötigt ca. 130 bis 140 g Erythrit für 100 g Zucker), Honig ca. 120 % Süßkraft (80 g Honig ersetzen 100 g Zucker, Flüssigkeit im Teig leicht reduzieren).',
    faqs: [
      { question: 'Welche Nebenwirkungen können Erythrit und Xylit haben?', answer: 'Zuckeralkohole können bei übermäßigem Verzehr abführend wirken; Xylit ist zudem für Hunde und Katzen hochgradig lebensgefährlich giftig.' },
      { question: 'Karadellisiert Erythrit beim Backen wie normaler Zucker?', answer: 'Nein, Erythrit karamellisiert nicht und neigt beim Abkühlen zum Auskristallisieren ("kühler Schmelzeffekt" auf der Zunge).' }
    ]
  },
  'backzeit-temperatur-umluft-oberhitze-rechner': {
    intro: 'Dieser Ofenrechner rechnet Backtemperaturen und Backzeiten zwischen Umluft (Heißluft) und Ober-/Unterhitze verlässlich um.',
    details: 'Faustregel: Umluft = Ober-/Unterhitze minus 20 °C (z. B. 200 °C Ober-/Unterhitze entsprechen 180 °C Umluft). Durch den beschleunigten Wärmetransport per Gebläse verkürzt sich die Backzeit oft zusätzlich um 10 bis 15 Prozent.',
    faqs: [
      { question: 'Wann sollte man Ober-/Unterhitze statt Umluft wählen?', answer: 'Für empfindliche Teige (Biskuit, Soufflés, Brot), da das Umluftgebläse die Teigoberfläche vorzeitig austrocknet und das Aufgehen behindern kann.' },
      { question: 'Kann man bei Umluft mehrere Bleche gleichzeitig backen?', answer: 'Ja, das ist der Hauptvorteil von Umluft: Da die heiße Luft zirkuliert, können 2 bis 3 Bleche auf verschiedenen Einschubebenen gleichmäßig gebacken werden.' }
    ]
  },
  'fleisch-kerntemperatur-garzeit-rechner': {
    intro: 'Dieser Garzeitrechner ermittelt die Ziel-Kerntemperaturen für Rind, Schwein, Geflügel und Lamm mit Einstichthermometer für das perfekte Garergebnis (Rare, Medium, Well Done).',
    details: 'Rindermedaillons Medium: 54–56 °C (Rosa). Schweinefilet: 58–62 °C. Geflügel (Hähnchen, Pute): Aus Hygienegründen (Salmonellen-Abtötung) zwingend durchgaren auf mindestens 72–75 °C Kerntemperatur.',
    faqs: [
      { question: 'Steigt die Kerntemperatur während der Ruhephase nach dem Braten noch an?', answer: 'Ja, durch den Temperaturausgleich zwischen heißer Fleischkruste und dem Kern steigt die Temperatur beim Ruhen in Alufolie noch um 2 bis 4 °C an (vorher aus der Pfanne nehmen!).' },
      { question: 'Wo sticht man das Fleischthermometer korrekt ein?', answer: 'Immer an der dicksten Stelle des Fleischstücks, ohne Knochen oder größere Fettpolster zu berühren, da Knochen Hitze schneller leiten und Messwerte verfälschen.' }
    ]
  },
  'pizza-teig-rechner': {
    intro: 'Dieser Teigrechner berechnet die neapolitanische Pizza nach Bäckerprozenten (Hydratation 60–70 %, Mehl Tipo 00, Hefe und Meersalz).',
    details: 'Hydratation = (Wassermenge / Mehlmenge) · 100. Für eine echte Pizza Napoletana werden ca. 60–65 % Wasser, 2,8–3,0 % Salz und minimale Hefemengen (0,1–0,2 % bei 24 Std. Teigruhe) verwendet. Ein Teigling wiegt idealerweise 250 bis 280 Gramm.',
    faqs: [
      { question: 'Warum ist Mehl mit hohem W-Wert (z. B. Caputo Cuoco W > 300) für Pizza wichtig?', answer: 'Der W-Wert misst die Glutenstärke: Nur mehlstarke Weizenmehle können lange Gärzeiten von 24 bis 48 Stunden aushalten, ohne dass das Klebergerüst reißt.' },
      { question: 'Warum gehört in echten neapolitanischen Pizzateig kein Olivenöl?', answer: 'Bei extrem heißen Pizzaöfen (450–500 °C) verbrennt Öl und macht den Teig speckig; Öl wird nur bei Haushaltsöfen (250 °C) für mürbere Krusten empfohlen.' }
    ]
  },
  'brot-backen-baeckermass-rechner': {
    intro: 'Die Bäckerprozente (Baker\'s Percentage) setzen alle Rezeptzutaten (Wasser, Salz, Hefe, Sauerteig) ins prozentuale Verhältnis zur Gesamtmehlmenge (Mehl = 100 %).',
    details: 'Beispiel: 1.000 g Mehl (100 %) mit 70 % Hydratation (700 g Wasser), 2 % Salz (20 g Salz) und 20 % Sauerteig (200 g Sauerteig) ergeben 1.920 g Gesamtteigmasse.',
    faqs: [
      { question: 'Was ist der Vorteil von Bäckerprozenten?', answer: 'Rezepte lassen sich blitzschnell auf jedes beliebige Teiggewicht skalieren, und der Bäcker erkennt sofort an den Prozentwerten die Teigausbeute und Teigkonsistenz.' },
      { question: 'Was bedeutet die Teigausbeute (TA)?', answer: 'TA = (Gesamtteiggewicht / Mehlmenge) · 100. Bei 1.000 g Mehl und 650 g Wasser beträgt die TA genau 165 (feste Teige TA 150–160, weiche Teige TA 170–185).' }
    ]
  },
  'alkohol-verkochungs-rechner': {
    intro: 'Entgegen der Annahme verkocht Alkohol beim Kochen und Schmoren von Wein- oder Biersaucen nur langsam und bleibt über längere Zeit nachweisbar.',
    details: 'Untersuchungen des US Department of Agriculture (USDA): Nach kurzem Aufkochen (Flambieren) verbleiben ca. 75 % Alkohol; nach 30 Minuten Köcheln noch ca. 35 %; erst nach 2,5 bis 3 Stunden Schmoren sinkt der Restalkohol auf unter 5 Prozent.',
    faqs: [
      { question: 'Dürfen Kinder Gerichte essen, die mit Rotwein abgelöscht wurden?', answer: 'Da auch nach einer Stunde Kochen noch ca. 25 % des Alkohols in der Sauce enthalten sind, sollten Speisen für Kinder, Schwangere oder trockene Alkoholiker alkoholfrei zubereitet werden (z. B. Traubensaft mit Balsamico).' },
      { question: 'Warum verdampft Alkohol im Wasser-Gemisch nicht komplett bei 78 °C?', answer: 'Weil Wasser und Ethanol ein azeotropes Gemisch bilden, dessen Siedepunkt zwischen 78 °C und 100 °C liegt; der Alkohol entweicht nur kontinuierlich gemeinsam mit dem Wasserdampf.' }
    ]
  },
  'eiweiss-eigelb-ersatz-rechner': {
    intro: 'Dieser Rezeptrechner kalkuliert die Aufteilung und den Ersatz von Hühnereiern (Größe M ca. 50 g: 30 g Eiklar, 20 g Eidotter) oder vegane Alternativen (Aquafaba, Leinsamen, Apfelmus).',
    details: '1 ganzes Ei lässt sich beim Backen durch 1 EL geschrotete Leinsamen in 3 EL Wasser (Leinsamen-Ei), 60 g Apfelmus oder eine halbe reife Banane ersetzen. Eischnee lässt sich 1:1 durch aufgeschlagenes Kichererbsenwasser (Aquafaba) ersetzen.',
    faqs: [
      { question: 'Was kann man mit übrig gebliebenem Eiklar machen?', answer: 'Baisers (Meringue), Macarons, Eiweiß-Omelettes zubereiten oder portionsweise in Eiswürfelbehältern einfrieren (aufgetaut normal aufschlagbar).' },
      { question: 'Warum schlägt sich Eischnee nicht steif, wenn Spuren von Eigelb hineingelangen?', answer: 'Das Fett im Eigelb stört die Bildung des stabilen Proteingitters an den Luftbläschen; Schüssel und Rührbesen müssen absolut fettfrei sein.' }
    ]
  },
  'wasser-reis-verhaeltnis-rechner': {
    intro: 'Die Quellmethode gart Reis ohne Nährstoffverlust im geschlossenen Topf mit dem exakt passenden Verhältnis von Reis zu Wasser.',
    details: 'Richtwerte: Weißer Langkornreis (Basmati, Jasmin) = 1 Teil Reis auf 1,5 Teile Wasser. Rundkornreis (Milchreis, Sushi) = 1 : 1,75 bis 2,0. Naturreis (Vollkornreis) = 1 : 2,25 bei ca. 35 bis 45 Minuten Garzeit.',
    faqs: [
      { question: 'Muss man Reis vor dem Kochen waschen?', answer: 'Ja, gründliches Waschen im Sieb spült überschüssige Stärke ab (verhindert klebrigen Matschreis) und reduziert eventuelle anorganische Arsen-Rückstände.' },
      { question: 'Darf man während der Quellmethode den Topfdeckel öffnen?', answer: 'Nein, der heiße Wasserdampf entweicht sofort, wodurch die Temperatur abfällt und das Wasser-Verdampfungsverhältnis gestört wird.' }
    ]
  },
  'nudeln-rohmaerk-gewicht-rechner': {
    intro: 'Dieser Mengenkalkulator berechnet das Trockengewicht von Roh-Nudeln und das fertige Serviergewicht nach dem Kochen im Salzwasser.',
    details: 'Getrocknete Hartweizennudeln nehmen beim Kochen Wasser auf und verdoppeln bis verdreifachen ihr Gewicht (Faktor 2,2 bis 2,5): Aus 100 g trockener Pasta entstehen ca. 220 bis 250 g gekochte Nudeln. Portionsgröße: 80–100 g trocken als Hauptgericht.',
    faqs: [
      { question: 'Wie viel Wasser und Salz benötigt man zum Nudelkochen?', answer: 'Klassische italienische Faustregel: 10-100-1000: 10 Gramm Salz auf 100 Gramm Pasta in 1.000 Milliliter (1 Liter) kochendem Wasser.' },
      { question: 'Wie viel wiegen frische Eierteig-Nudeln nach dem Kochen?', answer: 'Frische Pasta enthält bereits Eigenfeuchte und quillt nur um ca. 50 bis 70 Prozent (Faktor 1,5 bis 1,7); eine Hauptgericht-Portion frische Nudeln beträgt ca. 130 bis 150 Gramm.' }
    ]
  },
  'sauerteig-anstellgut-rechner': {
    intro: 'Dieser Sauerteigrechner steuert die dreistufige oder einstufige Sauerteigführung (Anstellgut, Mehl, Wasser) für Roggen- und Weizensauerteige.',
    details: 'Formel: Sauerteig-Hydratation = (Wasser / Mehl) · 100. Standard-Sauerteig wird meist mit TA 200 (100 % Hydratation, 1:1 Mehl zu Wasser) geführt. Der Sauerteiganteil am Gesamtrezept liegt üblicherweise bei 15 bis 35 Prozent des Gesamtmehls.',
    faqs: [
      { question: 'Wie oft muss man Anstellgut im Kühlschrank füttern?', answer: 'Ein gesundes Anstellgut sollte mindestens alle 7 bis 10 Tage mit gleichen Teilen Mehl und lauwarmem Wasser (z. B. 50 g Mehl + 50 g Wasser auf 10–20 g Anstellgut) aufgefrischt werden.' },
      { question: 'Woran erkennt man, dass der Sauerteig backreif ist?', answer: 'Er hat sein Volumen verdoppelt, riecht angenehm fruchtig-säuerlich und schwimmt beim Wassertest oben auf der Wasseroberfläche (Float-Test).' }
    ]
  },
  'marmelade-geliermittel-rechner': {
    intro: 'Dieser Einkochrechner kalkuliert die Frucht- und Zuckermengen für Konfitüren und Gelees bei 1:1, 2:1 oder 3:1 Gelierzucker.',
    details: 'Beim 2:1-Gelierzucker kommen auf 1.000 g vorbereitete Früchte exakt 500 g Gelierzucker. 3:1 verwendet nur 333 g Gelierzucker auf 1 kg Frucht (fruchtiger, aber kürzere Haltbarkeit nach dem Öffnen).',
    faqs: [
      { question: 'Warum benötigt man Zitronensaft beim Marmeladekochen?', answer: 'Pektin benötigt ein saures Milieu (pH-Wert ca. 3,0 bis 3,3), um sein stabiles Geliermolekülgitter auszubilden; zudem intensiviert Säure die Fruchtfarben.' },
      { question: 'Wie funktioniert die Gelierprobe?', answer: 'Geben Sie nach 4 Minuten Kochen einen Teelöffel heiße Marmelade auf einen eiskalten Teller: Wird die Masse innerhalb von 1 bis 2 Minuten fest, ist die Konfitüre fertig.' }
    ]
  },
  'kaffee-wasser-verhaeltnis-rechner': {
    intro: 'Das Brew-Ratio (Brühverhältnis) nach den Standards der Specialty Coffee Association (SCA) garantiert die optimale Extraktion von Aromastoffen ohne Bitterkeit.',
    details: 'Goldener SCA-Standard: 60 Gramm gemahlener Röstkaffee auf 1.000 Gramm (1 Liter) Wasser (Verhältnis 1:16,6). Für Espresso in der Siebträgermaschine gilt ein Brühverhältnis von 1:2 bis 1:2,5 (z. B. 18 g Kaffeemehl ergeben 36 g flüssigen Espresso in 25–30 Sekunden).',
    faqs: [
      { question: 'Welche Wassertemperatur ist für Filterkaffee optimal?', answer: 'Zwischen 92 °C und 96 °C; kochendes Wasser (100 °C) verbrennt Kaffeebestandteile und löst bittere Gerbstoffe, zu kaltes Wasser (< 90 °C) führt zu säuerlichem, unterextrahiertem Kaffee.' },
      { question: 'Warum wiegt man Kaffee in Gramm statt Esslöffeln?', answer: 'Weil verschiedene Röstungen (helle vs. dunkle Röstung) und Bohnengrößen stark unterschiedliche Schüttdichten aufweisen.' }
    ]
  },
  'cocktail-alkoholgehalt-rechner': {
    intro: 'Dieser Mischungsrechner ermittelt den resultierenden Gesamt-Alkoholgehalt in Volumenprozent (Vol.-%) und die reine Alkoholmasse eines Cocktails.',
    details: 'Alkoholgehalt = Summe(Menge in ml · Vol.-% / 100) / Gesamtvolumen des Drinks. Durch das Schütteln auf Eis schmilzt Schmelzwasser (ca. 25–35 ml Schmelzwasserverdünnung), was den Alkoholgehalt sensorisch abrundet.',
    faqs: [
      { question: 'Wie viel Alkohol hat ein klassischer Gin Tonic?', answer: '40 ml Gin (40 Vol.-%) gemischt mit 160 ml Tonic Water ergibt ca. 8,0 Vol.-% Alkohol im 200-ml-Glas.' },
      { question: 'Was ist der Unterschied zwischen Shaken und Rühren (Stirring)?', answer: 'Klare Spirituosen-Cocktails (Martini, Manhattan) werden gerührt, um die Textur klar und samtig ohne Trübung zu halten; Cocktails mit Zitrussäften oder Sahne werden kräftig geschüttelt.' }
    ]
  },
  'salz-lake-poekel-rechner': {
    intro: 'Dieser Pökelrechner ermittelt die exakte Salzkonzentration (Grad Baumé / Prozent) für Nasspökellaken zur Haltbarmachung von Fleisch, Fisch und Käse.',
    details: 'Salzgehalt in % = (Salzgewicht / Gesamtgewicht aus Wasser + Salz) · 100. Für Schinken und Pastrami werden Laken mit 8 bis 12 % Salzgehalt verwendet; bei Nitritpökelsalz (NPS mit 0,5 % NaNO2) schützt das Nitrit vor Clostridium botulinum.',
    faqs: [
      { question: 'Wie lange muss Fleisch in der Lake reifen?', answer: 'Als Richtwert gilt ca. 1 Tag Pökelzeit pro Zentimeter Fleischdicke an der dicksten Stelle bei konstanter Kühlschranktemperatur von 4 bis 6 °C.' },
      { question: 'Wie viel Salz benötigt man für eine 10-prozentige Pökellake mit 5 Litern Wasser?', answer: 'Auf 5.000 g Wasser kommen 555 Gramm Salz (denn 555 / 5555 ≈ 10,0 %).' }
    ]
  },
  'frittieroel-temperatur-rauchpunkt-rechner': {
    intro: 'Dieser Frittier-Ratgeber vergleicht die Rauchpunkte verschiedener Speiseöle und Fette und bestimmt die optimale Frittiertemperatur.',
    details: 'Die ideale Frittiertemperatur liegt bei 160 °C bis 175 °C. Oberhalb von 180 °C entsteht bei stärkehaltigen Lebensmitteln (Pommes) gesundheitsschädliches Acrylamid; bei Erreichen des Rauchpunkts zersetzt sich das Öl in giftiges Acrolein.',
    faqs: [
      { question: 'Welche Öle haben den höchsten Rauchpunkt zum Frittieren?', answer: 'Raffiniertes Erdnussöl (ca. 230 °C), raffiniertes Rapsöl (ca. 220 °C) und Kokosfett; kaltgepresste native Öle und Butter eignen sich wegen früher Rauchbildung (< 160 °C) nicht zum Frittieren.' },
      { question: 'Wie erkennt man ohne Thermometer, ob das Frittieröl heiß genug ist?', answer: 'Halten Sie den Stiel eines Holzkochlöffels ins heiße Fett: Steigen sofort gleichmäßige, kleine Bläschen am Holz auf, ist die Temperatur von ca. 170 °C erreicht.' }
    ]
  },
  'fondue-raclette-mengen-rechner': {
    intro: 'Dieser Mengenplaner kalkuliert Fleisch-, Käse-, Kartoffel- und Beilagenmengen für gesellige Fondue- und Raclette-Abende ohne Reste oder Engpässe.',
    details: 'Pro erwachsener Person kalkuliert man: Käsefondue ca. 200 bis 250 g Käse; Fleischfondue (Chinoise/Fett) ca. 250 bis 300 g Fleisch; Raclette ca. 200 bis 250 g Raclettekäse plus 200 g Kartoffeln und 150 g Beilagen.',
    faqs: [
      { question: 'Welche Käsesorten eignen sich für das klassische Schweizer Fondue Moitié-Moitié?', answer: 'Traditionell zu gleichen Teilen (50/50) reifer Vacherin Fribourgeois AOP und Gruyère AOP, geschmolzen in trockenem Weißwein mit einem Schuss Kirschwasser.' },
      { question: 'Was verhindert, dass Käsefondue gerinnt oder sich Fett absetzt?', answer: 'Ausreichend Säure aus dem Weißwein oder ein Spritzer Zitronensaft sowie ein Teelöffel Speisestärke, die die Emulsion stabil binden.' }
    ]
  },
  'kuehlschrank-haltbarkeit-rechner': {
    intro: 'Dieser Frischeplaner bestimmt die sichere Haltbarkeit von geöffneten Lebensmitteln, Fleisch, Fisch und Speiseresten bei 4 °C bis 7 °C Kühlschranktemperatur.',
    details: 'Roher Fisch und Hackfleisch müssen am Tag des Einkaufs verzehrt werden. Gekochte Speisereste halten 2 bis 3 Tage in dichten Behältern; geöffnete H-Milch 4 bis 5 Tage; Hartkäse am Stück mehrere Wochen.',
    faqs: [
      { question: 'Welche Zone im Kühlschrank ist die kälteste?', answer: 'Die Glasplatte direkt über dem Gemüsefach (ca. 2 bis 3 °C); hier gehören leicht verderblicher Fisch und Fleisch hin; ganz oben und in der Tür ist es mit 7 bis 9 °C am wärmsten.' },
      { question: 'Darf man heiße Speisen direkt in den Kühlschrank stellen?', answer: 'Nein, heiße Töpfe erwärmen den gesamten Kühlschrankinnenraum und gefährden andere Lebensmittel; Speisen zuerst im kalten Wasserbad auf Raumtemperatur abkühlen lassen.' }
    ]
  },
  'tee-ziehzeit-temperatur-rechner': {
    intro: 'Dieser Teerechner optimiert Wassertemperatur und Ziehdauer für Grüntee, Schwarztee, Weißen Tee, Oolong und Kräuteraufgüsse.',
    details: 'Grüner Tee (Sencha, Gyokuro) verlangt 60 °C bis 75 °C und 1,5 bis 2 Minuten Ziehzeit (kochendes Wasser macht ihn bitter). Schwarzer Tee benötigt 95 °C bis 100 °C für 3 bis 4 Minuten. Kräuter- und Früchtetees müssen zwingend mit sprudelnd kochendem Wasser (100 °C) für 8 bis 10 Minuten aufgegossen werden (Keimabtötung).',
    faqs: [
      { question: 'Warum darf man Früchtetee nicht mit 70 °C aufgießen?', answer: 'Kräuter und Trockenfrüchte sind Naturprodukte, die Sporen enthalten können; das Bundesinstitut für Risikobewertung (BfR) empfiehlt sprudelnd kochendes Wasser zur Keimsicherheit.' },
      { question: 'Wirkt schwarzer Tee nach 5 Minuten Ziehzeit beruhigend?', answer: 'Koffein löst sich in den ersten 2 Minuten vollkommen; danach lösen sich vermehrt Gerbstoffe (Tannine), die das Koffein im Magen-Darm-Trakt langsamer resorbieren lassen und den Geschmack herb machen.' }
    ]
  },
  'kalorien-rezept-rechner': {
    intro: 'Dieser Nährwertrechner summiert alle Zutaten eines Rezepts und ermittelt Gesamtkalorien, Makronährstoffe und die Nährwerttabelle pro 100 Gramm und pro Portion.',
    details: 'Formel: Nährwert pro 100 g = (Gesamtnährwert aller Zutaten / Fertiges Gesamtgewicht) · 100. Berücksichtigt den typischen Feuchtigkeits- und Wasserverlust beim Backen und Schmoren.',
    faqs: [
      { question: 'Warum wiegt das fertige Gericht weniger als die Summe der rohen Zutaten?', answer: 'Beim Braten und Backen verdampft Wasser; die Kalorienkonzentration pro 100 Gramm Fertiggericht steigt dadurch an, während die Gesamtkalorienzahl unverändert bleibt.' },
      { question: 'Müssen Gewürze bei der Kalorienberechnung mitgezählt werden?', answer: 'Salz, Pfeffer und getrocknete Kräuter in üblichen Haushaltsmengen haben vernachlässigbar geringe Kalorienwerte; Bratfette und Zucker müssen jedoch grammgenau erfasst werden.' }
    ]
  },
  'schokolade-temperieren-rechner': {
    intro: 'Das Temperieren von Kuvertüre schmilzt Schokolade kontrolliert, um stabile Kristallformen (Form-V-Kristalle) für knackigen Bruch und seidigen Glanz ohne grauen Fettreif zu erzeugen.',
    details: 'Drei-Stufen-Methode (Zartbitter): 1. Schmelzen auf 45–48 °C (alle alten Kristalle lösen); 2. Abkühlen unter Rühren (Impfen) auf 27–28 °C (Kristallkeime bilden); 3. Wiedererwärmen auf Arbeitstemperatur 31–32 °C (Vollmilch: 29–30 °C, Weiß: 28–29 °C).',
    faqs: [
      { question: 'Was passiert, wenn nur ein einziger Wassertropfen in die geschmolzene Schokolade gelangt?', answer: 'Die Schokolade "stockt" augenblicklich zu einem zähen, klumpigen Teig: Der Zucker löst sich im Wasser und trennt sich vom Kakaofett.' },
      { question: 'Was ist die Impfmethode beim Temperieren?', answer: 'Zwei Drittel der Kuvertüre im Wasserbad schmelzen, von der Hitze nehmen und das restliche feingehackte Drittel kalte Kuvertüre unterrühren, bis die perfekte Arbeitstemperatur erreicht ist.' }
    ]
  }
};
