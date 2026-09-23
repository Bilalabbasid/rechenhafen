import { CalcContent } from './types';

export const STATISTIK_CONTENT: Record<string, CalcContent> = {
  'notendurchschnitt-rechner': {
    intro: 'Dieser Schul- und Unirechner ermittelt den arithmetischen und ECTS-gewichteten Notendurchschnitt für Zeugnisse, Abitur und Bachelor-/Masterabschlüsse.',
    details: 'Gewichteter Notendurchschnitt = Summe(Note · ECTS-Punkte oder Gewichtungsfaktor) / Gesamtsumme der ECTS-Punkte. Bei einfacher Zeugnisberechnung wird die Summe aller Noten schlicht durch die Anzahl der Schulfächer geteilt.',
    faqs: [
      { question: 'Wie rechnet man MSS-Punkte der Oberstufe (0 bis 15 Punkte) in Schulnoten um?', answer: 'Formel der KMK: Note = (17 - Punktzahl) / 3 (z. B. 15 Punkte = 0,66 -> 1+; 14 Punkte = 1,0; 10 Punkte = 2,3; 5 Punkte = 4,0).' },
      { question: 'Zählen unbenotete Studienleistungen (Pass/Fail) in den Notenschnitt?', answer: 'Nein, Module mit "bestanden" ohne Note werden bei der Durchschnittsberechnung komplett ignoriert; sie steuern nur ECTS-Credits zum Studienabschluss bei.' }
    ]
  },
  'standardabweichung-rechner': {
    intro: 'Die Standardabweichung (Sigma s) misst die typische Streubreite einzelner Messwerte um ihren gemeinsamen arithmetischen Mittelwert.',
    details: 'Formel für die empirische Standardabweichung der Stichprobe (Bessel-Korrektur mit n-1): s = Wurzel[ (1 / (n-1)) · Summe(x_i - Mittelwert)² ]. Je kleiner die Standardabweichung, desto homogener und präziser liegen die Daten beieinander.',
    faqs: [
      { question: 'Warum teilt man bei Stichproben durch n-1 statt durch n?', answer: 'Die Bessel-Korrektur gleicht den systematischen Schätzfehler (Bias) aus, da der Mittelwert der Stichprobe bereits einen Freiheitsgrad verbraucht hat.' },
      { question: 'Was besagt die 68-95-99,7-Regel bei Normalverteilung?', answer: 'Bei normalverteilten Daten liegen rund 68,3 % aller Messwerte innerhalb von ±1 Standardabweichung um den Mittelwert; 95,4 % innerhalb von ±2 Sigma und 99,7 % innerhalb von ±3 Sigma.' }
    ]
  },
  'ohmsches-gesetz-rechner': {
    intro: 'Das Ohmsche Gesetz (U = R · I) beschreibt die fundamentale lineare Beziehung zwischen elektrischer Spannung (Volt), Stromstärke (Ampere) und Widerstand (Ohm).',
    details: 'Formeln im URI-Dreieck: U = R · I; I = U / R; R = U / I. Elektrische Leistung P = U · I = I² · R = U² / R (Leistung wächst quadratisch mit der Spannung).',
    faqs: [
      { question: 'Wie viel Strom fließt durch einen 2.000-Watt-Wasserkocher an 230 Volt?', answer: 'Stromstärke I = P / U = 2.000 Watt / 230 Volt ≈ 8,70 Ampere.' },
      { question: 'Was ist der Innenwiderstand einer Leitung?', answer: 'Jedes Kupferkabel besitzt einen spezifischen Widerstand; bei langen Kabeln und hohen Strömen führt dies zu spürbarem Spannungsabfall und Erwärmung der Leitung.' }
    ]
  },
  'mittelwert-median-modus-rechner': {
    intro: 'Dieser Lagemaß-Rechner ermittelt die drei klassischen Kennzahlen einer Verteilung: arithmetisches Mittel, Median (Zentralwert) und Modus (häufigster Wert).',
    details: 'Der Median halbiert die sortierte Datenreihe exakt: 50 % der Werte liegen darunter, 50 % darüber. Bei schiefen Verteilungen (z. B. Gehälter oder Vermögen) ist der Median extrem robust gegenüber Milliardärs-Ausreißern.',
    faqs: [
      { question: 'Wann sind Mittelwert und Median exakt identisch?', answer: 'Bei perfekt symmetrischen Verteilungen, wie beispielsweise der Gaußschen Glockenkurve (Normalverteilung).' },
      { question: 'Was ist ein multimodaler Datensatz?', answer: 'Ein Datensatz, bei dem zwei oder mehr verschiedene Werte gleich oft mit der höchsten Häufigkeit auftreten (z. B. bimodal mit zwei Peaks).' }
    ]
  },
  'varianz-standardabweichung-stichprobe-rechner': {
    intro: 'Dieser Streumaßrechner berechnet die Varianz (mittlere quadratische Abweichung) und Standardabweichung für Grundgesamtheiten (Teilung durch N) und Stichproben (Teilung durch n-1).',
    details: 'Varianz s² = (1 / (n-1)) · Summe(x_i - Mittelwert)². Die Varianz hat die quadrierte Einheit der Messgröße (z. B. Euro²); erst das Ziehen der Quadratwurzel liefert die Standardabweichung in der ursprünglichen Maßeinheit (z. B. Euro).',
    faqs: [
      { question: 'Warum quadriert man die Differenzen bei der Varianz?', answer: 'Damit sich positive und negative Abweichungen vom Mittelwert nicht gegenseitig zu null aufheben und größere Ausreißer mathematisch stärker gewichtet werden.' },
      { question: 'Was misst die empirische Varianz im Portfolio-Management?', answer: 'Die Volatilität (Schwankungsintensität) der Kursrenditen und bildet das fundamentale Risikomaß in der modernen Portfoliotheorie nach Markowitz.' }
    ]
  },
  'korrelationskoeffizient-rechner': {
    intro: 'Der Pearson-Korrelationskoeffizient (r) quantifiziert die Stärke und Richtung eines linearen Zusammenhangs zwischen zwei metrischen Merkmalen X und Y.',
    details: 'Wertebereich: -1,0 ≤ r ≤ +1,0. Ein Wert von +1 bedeutet perfekten positiven linearen Zusammenhang; 0 bedeutet keinen linearen Zusammenhang; -1 bedeutet perfekten gegenläufigen Zusammenhang. Korrelation impliziert niemals automatisch Kausalität!',
    faqs: [
      { question: 'Was ist Scheinkorrelation (Spurious Correlation)?', answer: 'Wenn zwei Variablen statistisch hoch korrelieren, ohne inhaltlich ursächlich verknüpft zu sein (z. B. Storchenpopulation und Geburtenrate korrelieren scheinbar, weil beide von ländlicher Struktur abhängen).' },
      { question: 'Ab welchem r-Wert spricht man von starker Korrelation?', answer: 'Nach Cohen gilt: |r| ab 0,10 als schwacher, ab 0,30 als mittlerer und ab 0,50 als starker linearer Zusammenhang.' }
    ]
  },
  'z-score-normalverteilung-rechner': {
    intro: 'Der Z-Score (Standardwert) normiert Messwerte auf eine Standardnormalverteilung mit Mittelwert mu = 0 und Standardabweichung sigma = 1.',
    details: 'Formel: z = (x - mu) / sigma. Ein Z-Score von +2,0 besagt, dass der individuelle Messwert genau zwei Standardabweichungen über dem Mittelwert der Gesamtstichprobe liegt (Perzentil ca. 97,7 %).',
    faqs: [
      { question: 'Wie liest man Wahrscheinlichkeiten aus der Z-Tabelle ab?', answer: 'Die Standardnormalverteilungstabelle (Phi(z)) gibt die Wahrscheinlichkeit an, dass eine Standardnormalvariable einen Wert kleiner oder gleich z annimmt.' },
      { question: 'Welchem IQ-Wert entspricht ein Z-Score von +1,0?', answer: 'Bei Standard-IQ-Tests (Mittelwert 100, Standardabweichung 15) entspricht z = +1,0 einem IQ von genau 115 (überdurchschnittlich).' }
    ]
  },
  'p-wert-hypothesentest-rechner': {
    intro: 'Der p-Wert beziffert die Wahrscheinlichkeit, die beobachteten Daten (oder noch extremere) zu erhalten, wenn die Nullhypothese H0 in Wahrheit zutrifft.',
    details: 'Liegt der p-Wert unter dem vorab festgelegten Signifikanzniveau alpha (typisch alpha = 0,05 oder 0,01), wird die Nullhypothese verworfen und das Ergebnis gilt als statistisch signifikant.',
    faqs: [
      { question: 'Bedeutet ein p-Wert von 0,03, dass die Hypothese zu 97 % wahr ist?', answer: 'Nein, das ist der häufigste Fehlschluss: Der p-Wert ist nicht die Wahrscheinlichkeit der Hypothese, sondern P(Daten | H0), also die Wahrscheinlichkeit der Daten unter der Annahme, H0 stimme.' },
      { question: 'Was ist ein Fehler 1. Art (Alpha-Fehler)?', answer: 'Die irrtümliche Ablehnung einer in Wahrheit richtigen Nullhypothese (falsch-positiver Befund); die Wahrscheinlichkeit dafür wird durch das Signifikanzniveau alpha gedeckelt.' }
    ]
  },
  't-test-rechner': {
    intro: 'Der Student-t-Test prüft, ob sich die Mittelwerte zweier Stichproben statistisch signifikant voneinander unterscheiden.',
    details: 'Man unterscheidet den unverbundenen (zweistichproben-) t-Test für unabhängige Gruppen (z. B. Kontrollgruppe vs. Medikamentengruppe) und den gepaarten t-Test für Messwiederholungen an denselben Probanden (Vorher-Nachher-Vergleich).',
    faqs: [
      { question: 'Wann nutzt man den t-Test statt des Z-Tests?', answer: 'Immer dann, wenn die wahre Varianz der Grundgesamtheit unbekannt ist und aus den Daten der Stichprobe geschätzt werden muss (insbesondere bei kleineren Stichprobengrößen n < 30).' },
      { question: 'Was ist der Welch-t-Test?', answer: 'Eine robuste Variante des unverbundenen t-Tests, die angewendet wird, wenn die Varianzen beider Gruppen ungleich sind (Varianzheterogenität).' }
    ]
  },
  'konfidenzintervall-rechner': {
    intro: 'Ein Konfidenzintervall (Vertrauensbereich, meist 95 % CI) grenzt den Bereich ein, der den wahren, unbekannten Parameter der Grundgesamtheit mit hoher Wahrscheinlichkeit überdeckt.',
    details: '95 % Konfidenzintervall = Stichprobenmittelwert ± z_(1 - alpha/2) · (s / Wurzel(n)). Bei Verzehnfachung der Stichprobengröße n halbiert sich die Breite des Fehlerbereichs (Wurzel-n-Gesetz).',
    faqs: [
      { question: 'Was bedeutet ein 95-%-Konfidenzintervall wissenschaftlich korrekt?', answer: 'Würde man das Experiment unendlich oft wiederholen und jedes Mal ein Intervall berechnen, würden 95 Prozent aller berechneten Intervalle den wahren Populationsmittelwert enthalten.' },
      { question: 'Wie beeinflusst die Streuung s das Intervall?', answer: 'Je größer die Streuung in den Daten, desto ungenauer ist die Schätzung und desto breiter muss das Konfidenzintervall sein.' }
    ]
  },
  'stichprobengroesse-rechner': {
    intro: 'Dieser Stichprobenplaner kalkuliert den mathematisch notwendigen Stichprobenumfang n für empirische Studien, Umfragen und A/B-Tests bei vorgegebener Fehlertoleranz.',
    details: 'Formel nach Cochran: n = [z² · p · (1-p)] / e², wobei z das Konfidenzniveau (1,96 für 95 %), e die maximale Fehlermarge (z. B. 3 %) und p der erwartete Anteil (0,5 für konservatives Maximum) ist.',
    faqs: [
      { question: 'Wie viele Teilnehmer benötigt eine repräsentative Wahlumfrage in Deutschland?', answer: 'Für eine Fehlermarge von ca. ±2,5 bis 3 Prozent bei 95 % Konfidenz genügen ca. 1.000 bis 1.500 repräsentativ ausgewählte Personen – unabhängig davon, ob die Gesamtbevölkerung 1 Million oder 84 Millionen beträgt!' },
      { question: 'Was ist die Endlichkeitskorrektur?', answer: 'Macht die Stichprobe mehr als 5 Prozent der gesamten Grundgesamtheit aus (z. B. bei Befragung aller Mitarbeiter einer Firma), verringert die Endlichkeitskorrektur die benötigte Probandenzahl.' }
    ]
  },
  'quartile-box-plot-rechner': {
    intro: 'Dieser Rechner ermittelt Minimum, 1. Quartil (Q1), Median (Q2), 3. Quartil (Q3) und Maximum (Fünf-Punkte-Zusammenfassung) für Box-Plot-Diagramme.',
    details: 'Der Interquartilsabstand (IQR = Q3 - Q1) umfasst die mittleren 50 Prozent aller Messwerte. Nach der Tukey-Regel gelten Werte außerhalb von [Q1 - 1,5·IQR; Q3 + 1,5·IQR] als statistische Ausreißer.',
    faqs: [
      { question: 'Was zeigt die "Box" in einem Box-Plot?', answer: 'Die Box visualisiert den Interquartilsabstand (IQR): Der untere Rand ist das 25-%-Quartil, der Strich in der Mitte der Median und der obere Rand das 75-%-Quartil.' },
      { question: 'Was sind die Whiskers (Antennen) am Box-Plot?', answer: 'Die Linien reichen bis zum kleinsten bzw. größten Datenwert, der noch kein extremer Ausreißer ist (maximal 1,5-facher IQR).' }
    ]
  },
  'binomialverteilung-rechner': {
    intro: 'Die Binomialverteilung B(n, p) modelliert die Wahrscheinlichkeit für exakt k Erfolge in n unabhängigen Bernoulli-Versuchen mit konstanter Erfolgswahrscheinlichkeit p.',
    details: 'Formel nach Bernoulli: P(X = k) = (n über k) · p^k · (1 - p)^(n - k). Erwartungswert E(X) = n · p; Varianz Var(X) = n · p · (1 - p). Typisch für Qualitätskontrollen und Münzwürfe.',
    faqs: [
      { question: 'Wie hoch ist die Wahrscheinlichkeit für genau 3 Sechsen bei 5 Würfelwürfen?', answer: 'n = 5, k = 3, p = 1/6: (5 über 3) · (1/6)³ · (5/6)² = 10 · (1/216) · (25/36) ≈ 3,22 Prozent.' },
      { question: 'Wann lässt sich die Binomialverteilung durch die Normalverteilung approximieren?', answer: 'Wenn die Laplace-Bedingung erfüllt ist: Varianz sigma² = n · p · (1 - p) > 9 (Satz von Moivre-Laplace mit Stetigkeitskorrektur ±0,5).' }
    ]
  },
  'poisson-verteilung-rechner': {
    intro: 'Die Poisson-Verteilung modelliert seltene, unabhängig voneinander auftretende Ereignisse in einem festen Zeit- oder Raumintervall mit bekannter Durchschnittsrate Lambda.',
    details: 'Formel: P(X = k) = (Lambda^k · e^(-Lambda)) / k!. Erwartungswert und Varianz sind bei der Poisson-Verteilung identisch: E(X) = Var(X) = Lambda. Typisch für Server-Anfragen pro Sekunde oder Notrufeinteilungen.',
    faqs: [
      { question: 'Welche Voraussetzungen müssen für einen Poisson-Prozess gelten?', answer: 'Die Ereignisse müssen unabhängig voneinander auftreten, die durchschnittliche Rate Lambda muss konstant sein und zwei Ereignisse dürfen nicht exakt im selben winzigen Moment stattfinden.' },
      { question: 'Wie hängen Poisson-Verteilung und Exponentialverteilung zusammen?', answer: 'Die Poisson-Verteilung zählt die Anzahl der Ereignisse in fester Zeit; die Exponentialverteilung modelliert die kontinuierliche Wartezeit zwischen zwei aufeinanderfolgenden Ereignissen.' }
    ]
  },
  'kombinatorik-n-ueber-k-rechner': {
    intro: 'Der Binomialkoeffizient "n über k" ermittelt die Anzahl der Möglichkeiten, k Elemente aus einer Menge von n Elementen ohne Zurücklegen und ohne Beachtung der Reihenfolge auszuwählen.',
    details: 'Formel: (n über k) = n! / [k! · (n - k)!]. Im Lotto "6 aus 49" gibt es exakt (49 über 6) = 13.983.816 mögliche Zahlenkombinationen.',
    faqs: [
      { question: 'Was ist der Unterschied zwischen Permutation und Kombination?', answer: 'Bei Permutationen spielt die Reihenfolge eine Rolle (z. B. PIN-Codes oder Zieleinlauf); bei Kombinationen ist die Reihenfolge der gezogenen Elemente irrelevant (z. B. Handkarten beim Poker).' },
      { question: 'Warum gilt immer (n über k) = (n über n-k)?', answer: 'Wegen der Symmetrie: Die Auswahl von k Elementen, die man mitnimmt, ist mathematisch vollkommen identisch mit der Auswahl der (n - k) Elemente, die man zurücklässt.' }
    ]
  },
  'lineare-regression-rechner': {
    intro: 'Die lineare Einfachregression (Methode der kleinsten Quadrate, OLS) legt die bestmögliche Trendgerade y = a · x + b durch eine Punktewolke von Messwerten.',
    details: 'Steigung a = Kovarianz(X,Y) / Varianz(X); Achsenabschnitt b = Mittelwert(Y) - a · Mittelwert(X). Das Bestimmtheitsmaß R² (0 ≤ R² ≤ 1) beziffert den Anteil der durch das Modell erklärten Varianz.',
    faqs: [
      { question: 'Was bedeutet ein Bestimmtheitsmaß von R² = 0,85?', answer: 'Es bedeutet, dass 85 Prozent der beobachteten Streuung der Zielgröße Y durch den linearen Zusammenhang mit der Variablen X statistisch erklärt werden.' },
      { question: 'Was sind Residuen in der Regression?', answer: 'Die vertikalen Differenzen zwischen den real gemessenen Y-Werten und den durch die Regressionsgerade prognostizierten Werten (Residuum = y_i - y_dach).' }
    ]
  },
  'kovarianz-rechner': {
    intro: 'Die Kovarianz misst den gemeinsamen monotonen Trend zweier metrischer Zufallsvariablen X und Y.',
    details: 'Formel: Cov(X,Y) = (1 / (n-1)) · Summe[ (x_i - x_quer) · (y_i - y_quer) ]. Eine positive Kovarianz zeigt an, dass überdurchschnittliche Werte von X tendenziell mit überdurchschnittlichen Werten von Y einhergehen.',
    faqs: [
      { question: 'Warum lässt sich die Stärke des Zusammenhangs an der Kovarianz allein schwer ablesen?', answer: 'Weil die Kovarianz nicht normiert ist und von den Einheiten der Messdaten abhängt; teilt man die Kovarianz durch das Produkt der Standardabweichungen, erhält man den normierten Pearson-Korrelationskoeffizienten r.' },
      { question: 'Was ist eine Kovarianzmatrix?', answer: 'Eine quadratische Matrix im multivariaten Datenraum, die alle paarweisen Kovarianzen zwischen mehreren Variablen systematisch anordnet (Hauptdiagonale = Varianzen).' }
    ]
  },
  'variationskoeffizient-rechner': {
    intro: 'Der Variationskoeffizient (CV, relative Standardabweichung) setzt die Standardabweichung ins Verhältnis zum arithmetischen Mittelwert.',
    details: 'Formel: CV = (s / Mittelwert) · 100 %. Als dimensionslose Prozentzahl ermöglicht der Variationskoeffizient den direkten Vergleich von Streuungen zwischen Datensätzen mit völlig unterschiedlichen Größenordnungen oder Einheiten.',
    faqs: [
      { question: 'Kann man die Streuung von Elefanten- und Mäusegewichten fair vergleichen?', answer: 'Ja, über den Variationskoeffizienten: Während die absolute Standardabweichung bei Elefanten in hunderten Kilogramm und bei Mäusen in Gramm gemessen wird, zeigt der CV das relative Risiko unabhängig vom Maßstab.' },
      { question: 'Wann darf der Variationskoeffizient nicht angewendet werden?', answer: 'Er ist nur für verhältnisskalierte Daten mit absolutem Nullpunkt sinnvoll; bei Intervallskalen (wie Celsius-Temperaturen, wo der Nullpunkt willkürlich ist) verliert der CV seine mathematische Gültigkeit.' }
    ]
  },
  'geometrisches-mittel-rechner': {
    intro: 'Das geometrische Mittel ist der einzig mathematisch exakte Mittelwert für proportionale Wachstumsraten, Zinseszinsen, Inflationsreihen und Indexziffern.',
    details: 'Formel: Geometrisches Mittel = n-te Wurzel aus dem Produkt aller Werte (x1 · x2 · ... · xn). Liegen Wachstumsfaktoren vor (z. B. +10 % und +30 %), rechnet man mit den Faktoren 1,10 und 1,30.',
    faqs: [
      { question: 'Warum ist das geometrische Mittel immer kleiner oder gleich dem arithmetischen Mittel?', answer: 'Dies besagt die fundamentale Ungleichung vom arithmetischen und geometrischen Mittel (AM-GM-Ungleichung); beide sind nur dann exakt gleich, wenn alle Einzelwerte identisch sind.' },
      { question: 'Wie berechnet man die durchschnittliche jährliche Aktienrendite bei +50 % im 1. Jahr und -50 % im 2. Jahr?', answer: 'Wachstumsfaktoren: 1,50 und 0,50. Produkt = 0,75. Quadratwurzel(0,75) ≈ 0,866. Reale jährliche Durchschnittsrendite: -13,4 % p.a. (das arithmetische Mittel von 0 % wäre trügerisch!).' }
    ]
  },
  'harmonisches-mittel-rechner': {
    intro: 'Das harmonische Mittel ist der zwingend vorgeschriebene Mittelwert für Verhältnisgrößen und Quotienten wie Geschwindigkeiten (km/h) oder Preise pro Einheit.',
    details: 'Formel: H = n / Summe(1 / x_i). Fährt man eine feste Strecke mit 100 km/h hin und dieselbe Strecke mit 50 km/h zurück, beträgt die Durchschnittsgeschwindigkeit exakt 2 / (1/100 + 1/50) = 66,67 km/h (nicht 75 km/h!).',
    faqs: [
      { question: 'Warum versagt das arithmetische Mittel bei Durchschnittsgeschwindigkeiten auf fester Distanz?', answer: 'Weil man bei niedriger Geschwindigkeit mehr Zeit auf der Strecke verbringt und die langsame Phase daher zeitlich überproportional stark ins Gewicht fällt.' },
      { question: 'Wann verwendet man das harmonische Mittel in der Finanzwelt?', answer: 'Beim Berechnen des durchschnittlichen Kurs-Gewinn-Verhältnisses (KGV) eines Aktienindex (P/E-Ratio), um Verzerrungen durch extrem hohe Einzelwerte zu eliminieren.' }
    ]
  },
  'bayes-theorem-rechner': {
    intro: 'Der Satz von Bayes berechnet die bedingte Wahrscheinlichkeit eines Ereignisses unter Berücksichtigung von neuem Vorwissen oder Testergebnissen (A-posteriori-Wahrscheinlichkeit).',
    details: 'Formel: P(A|B) = [P(B|A) · P(A)] / P(B). Fundamental in der Medizin: Selbst bei einem zu 99 % zuverlässigen Test ist ein positives Testergebnis bei seltenen Krankheiten (niedrige Prävalenz P(A)) oft zu über 80 % ein Fehlalarm!',
    faqs: [
      { question: 'Was ist der Base-Rate-Fallacy (Prävalenzfehler)?', answer: 'Die menschliche Neigung, die extrem niedrige Grundwahrscheinlichkeit (Basisrate) einer seltenen Erkrankung in der Bevölkerung zu ignorieren und die Aussagekraft eines positiven Tests drastisch zu überschätzen.' },
      { question: 'Wo wird Bayes-Theorem in der Informatik eingesetzt?', answer: 'In selbstlernenden Spam-Filtern (Bayes-Filter), künstlicher Intelligenz (Bayessche Netze) und prädiktiver Text- und Spracherkennung.' }
    ]
  },
  'wahrscheinlichkeit-wuerfel-muenze-rechner': {
    intro: 'Dieser Stochastik-Rechner ermittelt Eintrittswahrscheinlichkeiten, Augensummen und Trefferfolgen bei fairen Münzen und mehrfachen Würfelwürfen.',
    details: 'Klassische Laplace-Wahrscheinlichkeit: P(E) = Günstige Ergebnisse / Mögliche Ergebnisse. Bei zwei 6-seitigen Würfeln gibt es 6² = 36 mögliche Würfelpaare; die Augensumme 7 ist mit 6 günstigen Paaren (Wahrscheinlichkeit 6/36 = 16,67 %) am wahrscheinlichsten.',
    faqs: [
      { question: 'Wie hoch ist die Wahrscheinlichkeit, bei 10 Münzwürfen mindestens einmal "Kopf" zu werfen?', answer: 'Über das Gegenereignis: 1 - P(zehnmal Zahl) = 1 - (0,5)¹⁰ = 1 - (1/1024) ≈ 99,90 Prozent.' },
      { question: 'Was ist der Spielerfehlschluss (Gambler\'s Fallacy)?', answer: 'Der Irrglaube, dass nach einer langen Serie von "Rot" beim Roulette die Chance auf "Schwarz" gestiegen sei; die Kugel hat kein Gedächtnis, jede Runde bleibt stochastisch unabhängig.' }
    ]
  },
  'perzentil-rechner': {
    intro: 'Das p-te Perzentil teilt eine sortierte Stichprobe so, dass mindestens p Prozent der Messwerte kleiner oder gleich diesem Schwellenwert sind.',
    details: 'Das 50. Perzentil ist der Median. Das 90. Perzentil markiert den Wert, den 90 % der Probanden unterschreiten und nur 10 % übertreffen (Standardmaß bei Gehaltstabellen, Server-Antwortzeiten und Kinderperzentilen).',
    faqs: [
      { question: 'Was bedeuten Perzentilkurven im gelben Kinderuntersuchungsheft (U-Heft)?', answer: 'Liegt das Körpergewicht eines Babys auf der 75. Perzentilkurve, wiegen genau 75 Prozent aller gesunden gleichaltrigen Kinder weniger und 25 Prozent wiegen mehr.' },
      { question: 'Was ist die 95th-Percentile-Regel bei Internet-Providern?', answer: 'Provider schneiden die obersten 5 Prozent der monatlichen Datenverkehrsspitzen ab und rechnen die verbleibende maximale Bandbreite ab, um kurzzeitige Lastspitzen fair zu behandeln.' }
    ]
  },
  'effektstaerke-cohens-d-rechner': {
    intro: 'Cohens d misst die praktische Relevanz und relative Effektstärke eines Unterschieds zwischen zwei Gruppen unabhängig von der reinen Stichprobengröße.',
    details: 'Formel: d = (Mittelwert1 - Mittelwert2) / gepoolte Standardabweichung. Da bei riesigen Stichproben selbst minimale, irrelevante Unterschiede statistisch signifikant werden (p < 0,05), ist Cohens d unverzichtbar zur Beurteilung echter wissenschaftlicher Wirksamkeit.',
    faqs: [
      { question: 'Wie interpretiert man Cohens d nach Standardkonventionen?', answer: 'd = 0,20 gilt als kleiner Effekt; d = 0,50 als mittlerer Effekt; ab d = 0,80 spricht man von einem starken Effekt.' },
      { question: 'Was bedeutet Cohens d = 1,0 ganz anschaulich?', answer: 'Dass sich die beiden Verteilungen um eine volle Standardabweichung unterscheiden; rund 84 Prozent der Behandlungsgruppe liegen über dem Mittelwert der Kontrollgruppe.' }
    ]
  },
  'chi-quadrat-unabhaengigkeitstest-rechner': {
    intro: 'Der Chi-Quadrat-Unabhängigkeitstest (Chi²-Test) prüft in einer Kontingenztafel, ob zwei kategoriale Merkmale (z. B. Geschlecht und Wahlpräferenz) stochastisch unabhängig sind.',
    details: 'Teststatistik: Chi² = Summe[ (Beobachtete Häufigkeit f_o - Erwartete Häufigkeit f_e)² / f_e ]. Erwartete Häufigkeit f_e = (Zeilensumme · Spaltensumme) / Gesamtstichprobe. Freiheitsgrade df = (Zeilen - 1) · (Spalten - 1).',
    faqs: [
      { question: 'Welche Mindesthäufigkeit verlangt der Chi-Quadrat-Test?', answer: 'In jeder Zelle der Kontingenztafel sollte die erwartete Häufigkeit f_e mindestens 5 betragen; bei kleineren Zahlen greift der exakte Fisher-Test.' },
      { question: 'Was ist der Unterschied zwischen Chi²-Unabhängigkeitstest und Chi²-Anpassungstest?', answer: 'Der Anpassungstest prüft, ob eine beobachtete Häufigkeitsverteilung einer theoretischen Verteilung (z. B. den Mendelschen Vererbungsregeln) folgt; der Unabhängigkeitstest prüft den Zusammenhang zweier Merkmale.' }
    ]
  }
};
