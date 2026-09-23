import { CalcContent } from './types';

export const MATHEMATIK_CONTENT: Record<string, CalcContent> = {
  prozentrechner: {
    intro: 'Der Prozentwert (W) drückt den absoluten Teil eines Ganzen aus, bezogen auf einen Grundwert (G) von 100 Prozent.',
    details: 'Die Grundformel lautet W = G · (p / 100). Im Kopf lässt sich der Prozentwert oft zerlegen: 15 % von 240 € sind 10 % (24 €) plus 5 % (12 €), also 36 €.',
    faqs: [
      { question: 'Wie rechnet man Prozente schnell im Kopf aus?', answer: 'Zerlegen Sie den Prozentsatz in einfache Teilbeträge wie 10 % (Komma um eine Stelle nach links verschieben), 1 % (zwei Stellen) oder 50 % (halbieren).' },
      { question: 'Was ist der Unterschied zwischen Prozentwert und Prozentsatz?', answer: 'Der Prozentsatz (p %) ist die relative Verhältniszahl mit dem Prozentzeichen, während der Prozentwert (W) die konkrete absolute Zahl in Euro, Kilogramm oder Einheiten darstellt.' }
    ]
  },
  'prozentuale-veraenderung': {
    intro: 'Die prozentuale Veränderung quantifiziert relative Zuwächse (Inflation, Gehaltssteigerungen) oder Rückgänge bezogen auf den ursprünglichen Ausgangswert.',
    details: 'Die Formel lautet ((Neu - Alt) / |Alt|) · 100. Eine Preiserhöhung von 100 € auf 125 € entspricht +25 %, die Rückkehr von 125 € auf 100 € ist jedoch ein Rückgang um 20 % (Basiseffekt).',
    faqs: [
      { question: 'Warum sind +50 % und anschließende -50 % nicht wieder der Ausgangswert?', answer: 'Wegen des veränderten Grundwerts: Steigt ein Wert von 100 auf 150 (+50 %) und fällt danach um 50 %, verliert er 75 und landet bei 75, nicht bei 100.' },
      { question: 'Was bedeutet ein negatives Ergebnis bei der prozentualen Veränderung?', answer: 'Ein negatives Vorzeichen signalisiert einen prozentualen Rückgang bzw. Wertverlust gegenüber dem Vergleichszeitraum.' }
    ]
  },
  'grundwert-rechner': {
    intro: 'Die Grundwertberechnung rekonstruiert die 100-Prozent-Basis, wenn lediglich ein prozentualer Teilbetrag und dessen Prozentsatz bekannt sind.',
    details: 'Die Formel lautet G = W / (p / 100). Wenn beispielsweise 45 € Rabatt genau 15 % des ursprünglichen Verkaufspreises ausmachen, lag der Ausgangspreis bei 45 / 0,15 = 300 €.',
    faqs: [
      { question: 'Wie berechnet man den Grundwert bei einem reduzierten Preis?', answer: 'Wurde ein Preis um 20 % auf 80 € reduziert, entsprechen die 80 € 80 % des Grundwerts. Der Grundwert lautet: 80 / 0,80 = 100 €.' },
      { question: 'Wie ermittelt man den Nettopreis aus dem Bruttopreis inklusive 19 % MwSt.?', answer: 'Teilen Sie den Bruttopreis durch 1,19 (den Faktor für 119 %), da der Nettopreis den 100-Prozent-Grundwert darstellt.' }
    ]
  },
  dreisatzrechner: {
    intro: 'Der Dreisatz löst Proportionen in drei Schritten: Ausgangsverhältnis erfassen, auf die Einheit 1 normieren und auf die gesuchte Zielmenge hochrechnen.',
    details: 'Beim proportionalen Dreisatz gilt "Je mehr, desto mehr" (Quotientengleichheit: B1/A1 = B2/A2). Beim antiproportionalen Dreisatz gilt "Je mehr, desto weniger" (Produktgleichheit: A1 · B1 = A2 · B2).',
    faqs: [
      { question: 'Wann liegt ein antiproportionaler Dreisatz vor?', answer: 'Immer dann, wenn das Produkt konstant bleibt: Beispielsweise benötigen 4 Bauarbeiter 10 Tage für eine Mauer (40 Tagewerke); 8 Arbeiter schaffen dieselbe Arbeit in 5 Tagen.' },
      { question: 'Kann man den Dreisatz auch in einer einzigen Formel rechnen?', answer: 'Ja: Gesuchter Wert X = (B1 · A2) / A1 beim direkten Dreisatz. Dies entspricht dem Auflösen einer Verhältnisgleichung über Kreuz.' }
    ]
  },
  'verhaeltnis-rechner': {
    intro: 'Verhältnisrechnungen (Proportionen A:B = C:D) bestimmen unbekannte Dimensionen in Grafikdesign, Modellbau, Mischungsverhältnissen und Seitenformaten.',
    details: 'Durch Kreuzmultiplikation gilt: Das Produkt der Außenglieder entspricht dem Produkt der Innenglieder (A · D = B · C). Aufgelöst nach der Unbekannten X ergibt sich X = (B · C) / A.',
    faqs: [
      { question: 'Wie berechnet man Pixelmaße für das Seitenverhältnis 16:9?', answer: 'Bei gegebener Breite (z. B. 1920 px) rechnet man: Höhe = 1920 · (9 / 16) = 1080 Pixel (Full HD).' },
      { question: 'Wie skaliert man ein Mischungsverhältnis von 1:4 auf 500 ml Gesamtmenge?', answer: '1 Teil Wirkstoff plus 4 Teile Wasser ergeben 5 Teile insgesamt. Pro Teil: 500 ml / 5 = 100 ml Wirkstoff und 400 ml Wasser.' }
    ]
  },
  bruchrechner: {
    intro: 'Dieser Rechner führt die Grundrechenarten für Brüche durch, bestimmt den Hauptnenner (kgV) und kürzt das Endergebnis vollständig über den ggT.',
    details: 'Beim Addieren und Subtrahieren müssen Brüche zunächst auf einen gemeinsamen Nenner erweitert werden. Bei der Multiplikation gilt "Zähler mal Zähler, Nenner mal Nenner", bei der Division wird mit dem Kehrwert multipliziert.',
    faqs: [
      { question: 'Wie findet man den kleinsten gemeinsamen Hauptnenner zweier Brüche?', answer: 'Der Hauptnenner ist das kleinste gemeinsame Vielfache (kgV) der beiden Nenner. Bei 1/4 und 1/6 ist das kgV(4, 6) = 12.' },
      { question: 'Warum wird bei der Division durch einen Bruch mit dem Kehrwert multipliziert?', answer: 'Weil das Teilen durch einen Bruchteil a/b logisch gleichbedeutend ist mit der Multiplikation mit dessen Umkehrwert b/a.' }
    ]
  },
  dreieckrechner: {
    intro: 'Die Dreiecksberechnung bestimmt Flächeninhalt, Umfang und Höhen beliebiger rechtwinkliger, gleichschenkliger oder unregelmäßiger Dreiecke.',
    details: 'Die fundamentale Flächenformel lautet A = (g · h) / 2. Bei rechtwinkligen Dreiecken dienen die beiden Katheten direkt als Grundseite und Höhe: A = (a · b) / 2.',
    faqs: [
      { question: 'Wie berechnet man die Fläche eines Dreiecks ohne gegebene Höhe?', answer: 'Sind alle drei Seitenlängen a, b und c bekannt, liefert der Satz von Heron die Fläche: A = Wurzel aus [s · (s-a) · (s-b) · (s-c)], wobei s der halbe Umfang (a+b+c)/2 ist.' },
      { question: 'Welche Winkelsumme hat jedes ebene Dreieck?', answer: 'Die Summe aller drei Innenwinkel im euklidischen Dreieck beträgt ausnahmslos exakt 180 Grad (alpha + beta + gamma = 180°).' }
    ]
  },
  durchschnittsrechner: {
    intro: 'Das arithmetische Mittel summiert alle Messwerte oder Noten und dividiert die Gesamtsumme durch die Anzahl der Stichproben.',
    details: 'Im Unterschied zum Median (Zentralwert) reagiert das arithmetische Mittel empfindlich auf extreme Ausreißer. Bei gewichteten Durchschnitten (z. B. Uniklausuren mit ECTS-Punkten) werden die Noten mit ihren Leistungspunkten multipliziert.',
    faqs: [
      { question: 'Wann sollte man den Median statt des Durchschnitts verwenden?', answer: 'Bei stark verzerrten Verteilungen wie Gehältern oder Vermögen spiegelt der Median die typische Mitte besser wider, da Milliardäre den Durchschnitt künstlich verzerren.' },
      { question: 'Wie berechnet man einen gewichteten Notendurchschnitt?', answer: 'Multiplizieren Sie jede Note mit ihren ECTS-Punkten, summieren Sie diese Produkte und teilen Sie die Summe durch die Gesamtzahl aller ECTS-Punkte.' }
    ]
  },
  'pythagoras-rechner': {
    intro: 'Der Satz des Pythagoras (a² + b² = c²) beschreibt die geometrische Flächenbeziehung an allen rechtwinkligen Dreiecken der euklidischen Geometrie.',
    details: 'Die Hypotenuse c (die dem rechten 90°-Winkel gegenüberliegende längste Seite) berechnet sich durch c = Wurzel(a² + b²). Zur Bestimmung einer Kathete gilt a = Wurzel(c² - b²).',
    faqs: [
      { question: 'Was sind pythagoreische Tripel?', answer: 'Das sind ganzzahlige Seitenlängen, die den Satz exakt erfüllen. Das bekannteste Tripel ist 3, 4, 5 (denn 9 + 16 = 25), gefolgt von 5, 12, 13.' },
      { question: 'Gilt der Satz des Pythagoras auch bei schiefwinkligen Dreiecken?', answer: 'Nein, für allgemeine Dreiecke ohne rechten Winkel gilt der verallgemeinerte Kosinussatz: c² = a² + b² - 2ab · cos(gamma).' }
    ]
  },
  'ggt-rechner': {
    intro: 'Der größte gemeinsame Teiler (ggT) zweier oder mehrerer ganzer Zahlen ist die größte natürliche Zahl, durch die sich alle Ausgangszahlen ohne Rest teilen lassen.',
    details: 'Der ggT wird historisch und rechnerisch am effizientesten über den Euklidischen Algorithmus (wiederholte Division mit Rest / Modulo) bestimmt und dient dem vollständigen Kürzen von Brüchen.',
    faqs: [
      { question: 'Was bedeutet es, wenn der ggT zweier Zahlen 1 ist?', answer: 'Zwei Zahlen mit ggT = 1 nennt man teilerfremd oder koprim (z. B. 8 und 9 haben außer der 1 keinen gemeinsamen Teiler).' },
      { question: 'Wie funktioniert der Euklidische Algorithmus bei 48 und 18?', answer: '48 mod 18 = 12; 18 mod 12 = 6; 12 mod 6 = 0. Der letzte Rest ungleich 0 ist 6, also ist ggT(48, 18) = 6.' }
    ]
  },
  'kgv-rechner': {
    intro: 'Das kleinste gemeinsame Vielfache (kgV) ist die kleinste positive ganze Zahl, die ein ganzzahliges Vielfaches aller eingegebenen Zahlen darstellt.',
    details: 'Das kgV bildet den optimalen Hauptnenner beim Addieren ungleichnamiger Brüche und verknüpft sich mit dem ggT über den fundamentalen Zusammenhang: kgV(a, b) = (|a · b|) / ggT(a, b).',
    faqs: [
      { question: 'Wie berechnet man das kgV über die Primfaktorzerlegung?', answer: 'Zerlegen Sie alle Zahlen in Primfaktoren und bilden Sie das Produkt aller vorkommenden Primfaktoren in ihrer jeweils höchsten auftretenden Potenz.' },
      { question: 'Wofür wird das kgV in der Praxis benötigt?', answer: 'Zur Taktzeitabstimmung in der Logistik, Ampelschaltungen, Zahnradübersetzungen und zur Bestimmung periodischer Wiederkehrtermine.' }
    ]
  },
  'quadratwurzel-rechner': {
    intro: 'Die Quadratwurzel einer nicht-negativen Zahl x ist diejenige Zahl y ≥ 0, deren Quadrat (y · y) exakt x ergibt.',
    details: 'Wurzeln aus Nicht-Quadratzahlen (wie Wurzel aus 2 oder 3) sind irrationale Zahlen mit unendlich vielen, nicht-periodischen Nachkommastellen. Numerisch lässt sich die Wurzel über das babylonische Heron-Verfahren approximieren.',
    faqs: [
      { question: 'Warum hat eine Quadratwurzel im Reellen keine negativen Ergebnisse?', answer: 'Die Wurzelfunktion ist auf den reellen Zahlen als Hauptwert definiert und liefert per Konvention immer das nicht-negative Ergebnis.' },
      { question: 'Wie zieht man eine Quadratwurzel im Kopf näherungsweise?', answer: 'Suchen Sie die nächste Quadratzahl. Für Wurzel(50): Die nächste Quadratzahl ist 49 (Wurzel 7). Näherung: 7 + (50 - 49) / (2 × 7) = 7 + 1/14 ≈ 7,07.' }
    ]
  },
  'prozentualer-unterschied-rechner': {
    intro: 'Der prozentuale Unterschied vergleicht zwei gleichrangige Größen symmetrisch miteinander, ohne dass eine der beiden a priori als Basis definiert ist.',
    details: 'Die relative Differenz wird durch den Mittelwert beider Zahlen geteilt: |A - B| / ((A + B) / 2) · 100. Dadurch bleibt das prozentuale Ergebnis identisch, egal welche Zahl zuerst genannt wird.',
    faqs: [
      { question: 'Was unterscheidet den prozentualen Unterschied von der prozentualen Veränderung?', answer: 'Die Veränderung bezieht sich strikt auf den alten Ausgangswert (Richtung zählt). Der Unterschied ist richtungsneutral und teilt durch den Mittelwert beider Zahlen.' },
      { question: 'Wann verwendet man die symmetrische Differenz?', answer: 'In Laborvergleichen, Messreihen zweier unabhängiger Sensoren oder beim Preisvergleich zweier Konkurrenzprodukte.' }
    ]
  },
  'prozent-von-prozent-rechner': {
    intro: 'Die Berechnung von Kaskadenprozenten ermittelt den tatsächlichen Gesamtabschlag bei aufeinanderfolgenden Rabatten oder kumulierten Margen.',
    details: 'Weil Folgeprozente auf den bereits reduzierten Zwischenwert angewendet werden, dürfen sie nicht addiert werden: 20 % Rabatt plus 10 % Extrarabatt ergeben nicht 30 %, sondern 1 - (0,80 · 0,90) = 28 % Gesamtrabatt.',
    faqs: [
      { question: 'Warum ergeben 10 % Skonto und 10 % Händlerrabatt nicht 20 %?', answer: 'Weil das Skonto nur vom bereits um 10 % verminderten Nettobetrag abgezogen wird (0,90 × 0,90 = 0,81, also 19 % Gesamtersparnis).' },
      { question: 'Wie lautet die mathematische Formel für Kaskadenprozente?', answer: 'Gesamtfaktor = (1 - p1/100) · (1 - p2/100). Der Gesamtrabatt beträgt (1 - Gesamtfaktor) · 100.' }
    ]
  },
  promillerechner: {
    intro: 'Promille (‰) bezeichnet Teile pro Tausend (1 ‰ = 0,1 % = 0,001) und wird vor allem in der Rechtsmedizin (Blutalkohol), bei Steigungen und Versicherungsprämien verwendet.',
    details: 'Formel: Promillewert = Grundwert · (Promillesatz / 1000). Bei der Blutalkoholkonzentration (BAK nach Widmark) teilt man die aufgenommene reine Alkoholmasse in Gramm durch das reduzierte Körpergewicht.',
    faqs: [
      { question: 'Wie viel Gramm reiner Alkohol sind in einem halben Liter Bier (5 Vol.-%) enthalten?', answer: '500 ml Bier enthalten 25 ml Alkohol. Bei einer Dichte von 0,8 g/ml entspricht dies 20 Gramm reinem Alkohol.' },
      { question: 'Welche Promillegrenzen gelten im deutschen Straßenverkehr?', answer: '0,0 ‰ für Fahranfänger in der Probezeit und unter 21 Jahren (§ 24c StVG); 0,5 ‰ als Ordnungswidrigkeit (§ 24a StVG); ab 1,1 ‰ liegt absolute Fahruntüchtigkeit (§ 316 StGB) vor.' }
    ]
  },
  'antiproportionaler-dreisatz-rechner': {
    intro: 'Der antiproportionale (umgekehrte) Dreisatz modelliert Prozesse, bei denen eine Erhöhung der Ursache zu einer proportionalen Verringerung der Wirkung führt.',
    details: 'Die Multiplikation beider Ausgangsgrößen bildet ein konstantes Produkt (Gesamtleistung = Arbeiter · Zeit). Die gesuchte Zeit lautet X = (Arbeiter1 · Zeit1) / Arbeiter2.',
    faqs: [
      { question: 'Was ist ein typisches Beispiel für antiproportionale Zuordnungen?', answer: 'Pumpen, die ein Becken leeren: 2 Pumpen brauchen 6 Stunden (Produkt = 12). 3 Pumpen schaffen es in 12 / 3 = 4 Stunden.' },
      { question: 'Wann versagt das mathematische Modell in der Praxis?', answer: 'Wenn physikalische Grenzen erreicht werden (z. B. behindern sich zu viele Arbeiter auf engem Raum gegenseitig, Gesetz des abnehmenden Ertrags).' }
    ]
  },
  'bruch-in-dezimal-rechner': {
    intro: 'Die Umwandlung eines Bruchs in eine Dezimalzahl erfolgt durch schriftliche Division des Zählers durch den Nenner.',
    details: 'Ist im vollständig gekürzten Nenner nur die Primfaktoren 2 und 5 enthalten, entsteht eine endliche Dezimalzahl (z. B. 3/8 = 0,375). Treten andere Primfaktoren auf (3, 7, etc.), entsteht eine unendliche periodische Dezimalzahl (1/3 = 0,333...).',
    faqs: [
      { question: 'Wie erkennt man vorab, ob ein Bruch eine endliche Dezimalzahl ergibt?', answer: 'Kürzen Sie den Bruch vollständig. Wenn die Primfaktorzerlegung des Nenners ausschließlich aus Zweien und Fünfen besteht, bricht die Dezimalzahl sicher ab.' },
      { question: 'Wie wandelt man 7/8 im Kopf in eine Dezimalzahl um?', answer: 'Erweitern Sie mit 125 auf Tausendstel: 7 × 125 = 875; 8 × 125 = 1000. 875 / 1000 = 0,875.' }
    ]
  },
  'dezimal-in-bruch-rechner': {
    intro: 'Dieser Rechner transformiert endliche oder periodische Kommazahlen in exakte, vollständig gekürzte Brüche.',
    details: 'Bei endlichen Dezimalzahlen wird die Zahl mit 10 pro Nachkommastelle erweitert (z. B. 0,75 = 75/100 = 3/4). Bei rein periodischen Zahlen wird der Periodenblock durch Neunen geteilt (0,333... = 3/9 = 1/3).',
    faqs: [
      { question: 'Wie wandelt man 0,125 in einen Bruch um?', answer: '0,125 hat drei Nachkommastellen, also 125/1000. Geteilt durch den ggT 125 ergibt das exakt 1/8.' },
      { question: 'Warum entspricht die Periode 0,999... exakt der ganzen Zahl 1?', answer: 'Weil 1/3 = 0,333... ist. Multipliziert man beide Seiten mit 3, folgt 3 × (1/3) = 1 und 3 × 0,333... = 0,999...; daher ist 0,999... = 1.' }
    ]
  },
  'kubikwurzel-rechner': {
    intro: 'Die Kubikwurzel (dritte Wurzel) ermittelt die Kantenlänge eines Würfels aus dessen bekanntem Rauminhalt.',
    details: 'Die Kubikwurzel aus V ist diejenige Zahl a, für die a³ = a · a · a = V gilt. Im Gegensatz zur Quadratwurzel ist die Kubikwurzel im Reellen auch für negative Zahlen eindeutig definiert (z. B. dritte Wurzel aus -8 ist -2).',
    faqs: [
      { question: 'Welche Kantenlänge hat ein Würfel mit 1.000 Litern (1 m³) Volumen?', answer: 'Die Kubikwurzel aus 1 ist 1 Meter (bzw. dritte Wurzel aus 1.000 Litern = 10 Dezimeter = 100 cm).' },
      { question: 'Wie berechnet man Kubikwurzeln auf Taschenrechnern ohne Spezialtaste?', answer: 'Nutzen Sie die Potenzfunktion: Die dritte Wurzel aus x entspricht x hoch (1/3) bzw. x^(0,333333).' }
    ]
  },
  'n-te-wurzel-rechner': {
    intro: 'Die n-te Wurzel verallgemeinert das Wurzelziehen auf beliebige positive ganzzahlige Wurzelexponenten n.',
    details: 'Mathematisch gilt: Die n-te Wurzel aus a ist identisch mit der Potenz a^(1/n). Dies ist fundamental für Zinseszinsberechnungen (Ermittlung des durchschnittlichen geometrischen Wachstums p.a. über n Jahre).',
    faqs: [
      { question: 'Wie berechnet man die jährliche Rendite über 10 Jahre bei Verdopplung des Kapitals?', answer: 'Man zieht die 10. Wurzel aus dem Wachstumsfaktor 2: 2^(1/10) ≈ 1,0718. Das entspricht einer jährlichen Durchschnittsrendite von ca. 7,18 %.' },
      { question: 'Was ist der Unterschied zwischen arithmetischem und geometrischem Mittel?', answer: 'Das geometrische Mittel nutzt das Produkt der Werte unter der n-ten Wurzel und ist das einzig korrekte Maß für Wachstumsraten und Anlagezinsen über Zeit.' }
    ]
  },
  'zehnerpotenzen-rechner': {
    intro: 'Zehnerpotenzen drücken sehr große (Astronomische) oder sehr kleine (Mikrokosmos) Zahlen in kompakter wissenschaftlicher Schreibweise (Scientific Notation) aus.',
    details: 'Positive Exponenten verschieben das Komma nach rechts (10³ = 1.000 Kilo, 10⁶ = 1.000.000 Mega, 10⁹ = Milliarde/Giga). Negative Exponenten verschieben es nach links (10⁻³ = Milli, 10⁻⁶ = Mikro, 10⁻⁹ = Nano).',
    faqs: [
      { question: 'Was bedeutet die Schreibweise 3,5e+06 auf dem Taschenrechner?', answer: 'Das "e+06" steht für "mal 10 hoch 6", also 3,5 × 1.000.000 = 3.500.000.' },
      { question: 'Wie multipliziert man Zahlen in wissenschaftlicher Notation?', answer: 'Multiplizieren Sie die Vorkommazahlen und addieren Sie die Exponenten: (2 · 10⁴) · (3 · 10⁵) = 6 · 10⁹.' }
    ]
  },
  'modulo-rechner': {
    intro: 'Die Modulo-Operation ermittelt den ganzzahligen Rest, der bei der Division zweier natürlicher Zahlen verbleibt.',
    details: 'Mathematisch gilt für a mod b: a = q · b + r mit 0 ≤ r < b. Modulo-Rechnungen steuern die Wochentagsberechnung (mod 7), 24-Stunden-Uhren (mod 24), Kryptographie (RSA) und Prüfziffernverfahren (IBAN mod 97).',
    faqs: [
      { question: 'Was ergibt 29 mod 7 und warum?', answer: '29 geteilt durch 7 ergibt 4 mit Rest 1 (da 4 × 7 = 28 und 29 - 28 = 1). Das Ergebnis ist 1.' },
      { question: 'Wie wird Modulo bei der IBAN-Prüfung verwendet?', answer: 'Die 2-stellige Prüfziffer einer IBAN wird so berechnet, dass die gesamte umgewandelte Ziffernfolge modulo 97 exakt den Rest 1 ergibt.' }
    ]
  },
  'quersumme-rechner': {
    intro: 'Die Quersumme addiert alle einzelnen Ziffern einer Dezimalzahl und liefert mathematische Kriterien für Teilbarkeitsregeln.',
    details: 'Eine Zahl ist genau dann ohne Rest durch 3 teilbar, wenn ihre Quersumme durch 3 teilbar ist. Sie ist durch 9 teilbar, wenn ihre Quersumme durch 9 teilbar ist. Die iterierte Quersumme führt zur einstelligen Quersumme (Neunerrest).',
    faqs: [
      { question: 'Was ist die alternierende Quersumme?', answer: 'Dabei werden die Ziffern von rechts nach links abwechselnd subtrahiert und addiert. Ist das Ergebnis durch 11 teilbar, ist auch die Gesamtzahl durch 11 teilbar.' },
      { question: 'Wie lautet die Quersumme von 48.719?', answer: '4 + 8 + 7 + 1 + 9 = 29. Die einstellige Quersumme (iterierte Quersumme) lautet 2 + 9 = 11 -> 1 + 1 = 2.' }
    ]
  },
  'hexadezimal-rechner': {
    intro: 'Das Hexadezimalsystem (Basis 16) nutzt die Ziffern 0–9 sowie die Buchstaben A–F (für die Dezimalwerte 10–15) zur platzsparenden Darstellung von Binärdaten.',
    details: 'Genau zwei Hexadezimalziffern bilden ein Byte (8 Bit) von 00 bis FF (0 bis 255). Dies ist der weltweite Standard für Web-Farbcodes (#FFFFFF), MAC-Adressen und Speicheradressen in Betriebssystemen.',
    faqs: [
      { question: 'Welchem Dezimalwert entspricht der Hex-Code FF?', answer: 'F hat den Wert 15. Berechnung: (15 × 16¹) + (15 × 16⁰) = 240 + 15 = 255.' },
      { question: 'Wie setzt sich ein HTML-Farbcode wie #FF8000 zusammen?', answer: 'Aus drei 2-stelligen Hex-Werten für Rot, Grün und Blau: FF = 255 Rot (Maximum), 80 = 128 Grün (Mittel), 00 = 0 Blau. Das ergibt ein leuchtendes Orange.' }
    ]
  },
  'teiler-vielfache-rechner': {
    intro: 'Dieser Rechner ermittelt alle echten Teiler einer Zahl, prüft auf Primzahleigenschaften und listet die ersten Vielfachen auf.',
    details: 'Zahlen, deren echte Teiler summiert genau die Zahl selbst ergeben, heißen vollkommene Zahlen (z. B. 6 = 1 + 2 + 3 oder 28 = 1 + 2 + 4 + 7 + 14). Besitzt eine Zahl außer der 1 und sich selbst keine Teiler, ist sie eine Primzahl.',
    faqs: [
      { question: 'Wie viele Teiler hat die Zahl 60?', answer: '60 hat 12 Teiler: 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30 und 60.' },
      { question: 'Bis zu welcher Zahl muss man testen, um alle Teiler zu finden?', answer: 'Es genügt, alle Zahlen bis zur Quadratwurzel der Ausgangszahl zu prüfen, da Teiler immer paarweise auftreten (z. B. bei 36: 4 × 9).' }
    ]
  }
};
