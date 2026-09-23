import { CalcContent } from './types';

export const HAUSHALT_CONTENT: Record<string, CalcContent> = {
  stromkostenrechner: {
    intro: 'Dieser Stromkostenrechner kalkuliert die jährlichen Gesamtstromkosten eines Haushalts aus Grundpreis, Arbeitspreis und Jahresverbrauch in Kilowattstunden (kWh).',
    details: 'Gesamtkosten = (Verbrauch in kWh · Arbeitspreis/kWh) + (12 · monatlicher Grundpreis). Ein 2-Personen-Haushalt in Deutschland verbraucht im Schnitt ca. 2.500 bis 3.000 kWh Strom pro Jahr.',
    faqs: [
      { question: 'Was ist der Unterschied zwischen Arbeitspreis und Grundpreis?', answer: 'Der Arbeitspreis bezahlt jede tatsächlich verbrauchte Kilowattstunde (ct/kWh); der Grundpreis ist eine verbrauchsunabhängige monatliche Fixgebühr für Netzanschluss, Zähler und Messstellenbetrieb.' },
      { question: 'Wie viel Strom verbraucht ein 1-Personen-Haushalt durchschnittlich?', answer: 'Ein Single-Haushalt verbraucht im Mehrfamilienhaus ca. 1.300 bis 1.500 kWh pro Jahr; erfolgt die Warmwasserbereitung elektrisch (Durchlauferhitzer), steigt der Bedarf auf ca. 1.800 bis 2.000 kWh.' }
    ]
  },
  'standby-kosten-rechner': {
    intro: 'Elektrische Geräte im Bereitschaftsmodus (Standby) verbrauchen rund um die Uhr heimlich Strom, was sich auf 80 bis 150 Euro unnötige Kosten pro Jahr summieren kann.',
    details: 'Jahreskosten = (Leistung in Watt · 8.760 Jahresstunden / 1.000) · Strompreis. Ein einziges Gerät mit permanent 5 Watt Standby-Aufnahme kostet bei 35 Cent/kWh bereits über 15 Euro pro Jahr.',
    faqs: [
      { question: 'Welche Geräte haben die höchsten heimlichen Standby-Verbräuche?', answer: 'Ältere Fernseher, Spielekonsolen im Schnellstart-Modus, AV-Receiver, WLAN-Verstärker, Espressomaschinen und ältere PC-Netzteile.' },
      { question: 'Wie lassen sich Standby-Verluste am einfachsten abstellen?', answer: 'Durch abschaltbare Steckdosenleisten, smarte Zwischenstecker mit Zeitschaltuhr oder Master-Slave-Steckdosen, die Peripheriegeräte automatisch vom Netz trennen.' }
    ]
  },
  gaskostenrechner: {
    intro: 'Der Gaskostenrechner ermittelt die Heiz- und Warmwasserkosten bei Erdgasheizungen unter Berücksichtigung von Arbeitspreis, Grundpreis und CO₂-Abgabe.',
    details: 'Gesamtkosten = (Verbrauch in kWh · Arbeitspreis) + Grundpreis + CO₂-Kosten. Ein typisches Einfamilienhaus (140 m²) benötigt pro Jahr etwa 16.000 bis 22.000 kWh Erdgas.',
    faqs: [
      { question: 'Wie liest man den Gaszähler ab (m³ in kWh)?', answer: 'Der Gaszähler zählt Kubikmeter (m³); die Rechnung erfolgt in Kilowattstunden (kWh). Multiplizieren Sie die Kubikmeter mit dem Brennwert (ca. 10,2 bis 11,5) und der Zustandszahl (ca. 0,95) Ihres Netzbetreibers.' },
      { question: 'Wie hoch ist die gesetzliche CO₂-Abgabe auf Erdgas?', answer: 'Auf Erdgas fällt nach dem Brennstoffemissionshandelsgesetz (BEHG) eine CO₂-Abgabe an, die den Kilowattstundenpreis um etwa 0,6 bis 1,0 Cent verteuert.' }
    ]
  },
  'led-ersparnis-rechner': {
    intro: 'Der Austausch herkömmlicher Glüh- und Halogenlampen gegen moderne LED-Leuchtmittel senkt den Strombedarf für Beleuchtung um bis zu 85 bis 90 Prozent.',
    details: 'Eine klassische 60-Watt-Glühbirne erzeugt denselben Lichtstrom (ca. 800 Lumen) wie eine moderne LED mit nur 8 Watt Leistungsaufnahme. Die Amortisationszeit neuer LED-Lampen liegt oft bei weniger als 6 Monaten.',
    faqs: [
      { question: 'Wie vergleicht man die Helligkeit alter Glühbirnen mit LEDs?', answer: 'Über den Lichtstrom in Lumen (lm): 25 W Glühbirne ≈ 250 lm; 40 W ≈ 470 lm; 60 W ≈ 806 lm; 100 W ≈ 1.521 lm.' },
      { question: 'Wie lange hält eine LED-Lampe im Vergleich zur Glühbirne?', answer: 'Glühlampen hielten ca. 1.000 Stunden; hochwertige LEDs erreichen 15.000 bis 25.000 Betriebsstunden (bei 3 Stunden täglicher Nutzung entspricht das über 15 bis 20 Jahren Lebensdauer).' }
    ]
  },
  'stromkosten-geraete-rechner': {
    intro: 'Dieser Gerätekostenrechner beziffert die laufenden Kosten einzelner Verbraucher (Waschmaschine, PC, Backofen, Heizlüfter) pro Nutzung, Tag, Monat und Jahr.',
    details: 'Kosten = (Leistung in Watt / 1.000) · Betriebsstunden · Strompreis je kWh. Ein Heizlüfter mit 2.000 Watt verursacht bei 35 Cent/kWh pro Betriebsstunde bereits 0,70 Euro Stromkosten.',
    faqs: [
      { question: 'Welches Haushaltsgerät verbraucht im Jahr am meisten Strom?', answer: 'In der Regel Kühl- und Gefriergeräte (durch den Dauerbetrieb 24/7), gefolgt von elektrischer Warmwasserbereitung, Wäschetrocknern und Gaming-PCs.' },
      { question: 'Wie misst man den echten Stromverbrauch einzelner Geräte?', answer: 'Mit einem digitalen Energiekosten-Messgerät für die Steckdose, das die tatsächliche Leistungsaufnahme über mehrere Tage und Betriebszyklen aufzeichnet.' }
    ]
  },
  'gasverbrauch-kwh-m3-rechner': {
    intro: 'Dieser Umrechner transformiert den auf dem Gaszähler abgelesenen Verbrauch in Kubikmetern (m³) in abrechnungsrelevante Kilowattstunden (kWh).',
    details: 'Formel nach DVGW-Arbeitsblatt G 685: Energie (kWh) = Volumen (m³) · Brennwert (Hs) · Zustandszahl (z). Als Faustwert gilt: 1 m³ Erdgas entspricht ca. 10 bis 10,5 kWh Wärmeenergie.',
    faqs: [
      { question: 'Was bedeutet die Zustandszahl (z)?', answer: 'Die Zustandszahl beschreibt das Verhältnis des Gasvolumens im Zähler (abhängig von lokaler Temperatur und barometrischem Höhendruck) zum Normzustand.' },
      { question: 'Wo findet man Brennwert und Zustandszahl?', answer: 'Beide Werte stehen auf jeder jährlichen Gasabrechnung und können auf der Website des örtlichen Gasnetzbetreibers tagesaktuell eingesehen werden.' }
    ]
  },
  'balkonkraftwerk-ertrag-rechner': {
    intro: 'Ein Balkonkraftwerk (Stecker-Solargerät bis 800 Watt Wechselrichterleistung) erzeugt direkt nutzbaren Solarstrom für den eigenen Haushaltsbedarf.',
    details: 'Ertrag = Modulleistung in kWp · Globalstrahlung · Ausrichtungsfaktor. Eine 800-Watt-Anlage erzeugt in Deutschland je nach Ausrichtung ca. 600 bis 850 kWh Strom pro Jahr und spart bei hoher Eigenverbrauchsquote 200 bis 300 Euro Stromkosten.',
    faqs: [
      { question: 'Darf man ein Balkonkraftwerk ohne Genehmigung des Vermieters installieren?', answer: 'Nach dem Solarpaket I und der BGB-Mietrechtsreform 2024 gehört die Errichtung eines Balkonkraftwerks zu den privilegierten Maßnahmen: Vermieter dürfen die Zustimmung nur noch aus triftigen Gründen verweigern.' },
      { question: 'Muss ein Balkonkraftwerk beim Netzbetreiber angemeldet werden?', answer: 'Seit dem Solarpaket I genügt eine unbürokratische Registrierung im Marktstammdatenregister der Bundesnetzagentur; eine separate Anmeldung beim Netzbetreiber entfällt.' }
    ]
  },
  'photovoltaik-amortisation-rechner': {
    intro: 'Dieser Wirtschaftlichkeitsrechner berechnet die Amortisationsdauer einer Dachanlagen-Photovoltaik inklusive Batteriespeicher, Eigenverbrauch und Einspeisevergütung nach dem EEG.',
    details: 'Amortisationszeit = Anschaffungskosten / jährliche Gesamtersparnis (eingesparte Netzstromkosten + EEG-Einspeisevergütung). Eine typische 10-kWp-Anlage mit Speicher amortisiert sich nach etwa 8 bis 12 Jahren.',
    faqs: [
      { question: 'Wie hoch ist die EEG-Einspeisevergütung für Überschusseinspeisung?', answer: 'Für Neuanlagen bis 10 kWp liegt die gesetzliche Einspeisevergütung bei rund 8 Cent je kWh, garantiert fest über 20 Kalenderjahre plus Inbetriebnahmejahr.' },
      { question: 'Gilt auf Photovoltaikanlagen die Mehrwertsteuerbefreiung?', answer: 'Ja, nach § 12 Abs. 3 UStG gilt für den Kauf und die Installation von PV-Anlagen und Heimspeichern auf Wohngebäuden ein Nullsteuersatz (0 % Mehrwertsteuer).' }
    ]
  },
  'waermepumpe-stromkosten-rechner': {
    intro: 'Die Stromkosten einer Wärmepumpe hängen direkt vom Gebäude-Wärmebedarf und der Jahresarbeitszahl (JAZ) der Anlage ab.',
    details: 'Strombedarf = Heizwärmebedarf in kWh / Jahresarbeitszahl (JAZ). Bei 15.000 kWh Wärmebedarf und einer JAZ von 3,8 benötigt die Wärmepumpe rund 3.947 kWh Strom pro Jahr. Spezielle Wärmepumpentarife mit Sperrzeiten bieten oft günstigere Kilowattstundenpreise.',
    faqs: [
      { question: 'Was ist der Unterschied zwischen COP und JAZ?', answer: 'Der COP (Coefficient of Performance) ist ein theoretischer Prüfstandswert bei festen Temperaturen (z. B. A2/W35); die JAZ misst die tatsächliche Effizienz der gesamten Anlage über das reale Betriebsjahr.' },
      { question: 'Lohnt sich eine Wärmepumpe auch im ungedämmten Altbau?', answer: 'Ja, sofern die Vorlauftemperatur der Heizkörper an kalten Tagen 55 °C nicht übersteigen muss; eventuell müssen einzelne Heizkörper durch Niedertemperatur-Heizkörper ersetzt werden.' }
    ]
  },
  'heizkostenvergleich-rechner': {
    intro: 'Dieser Systemvergleich stellt die Vollkosten verschiedener Heizsysteme (Wärmepumpe, Gasbrennwert, Pelletheizung, Fernwärme) inklusive Brennstoff, CO₂-Preis und Wartung gegenüber.',
    details: 'Der Rechner normiert die Brennstoffpreise auf Kosten pro Kilowattstunde Nutzwärme unter Berücksichtigung des feuerungstechnischen Nutzungsgrads der jeweiligen Kessel- und Pumpentechnik.',
    faqs: [
      { question: 'Warum steigen die Heizkosten für fossile Brennstoffe in Zukunft weiter?', answer: 'Durch den gesetzlich steigenden nationalen CO₂-Preis (BEHG) und die künftige Einbindung in das europäische Emissionshandelssystem ETS-2 ab 2027 verteuern sich Gas und Heizöl kontinuierlich.' },
      { question: 'Wie viel Prozent Förderung gibt es für den Heizungstausch?', answer: 'Über die Bundesförderung für effiziente Gebäude (KfW-Programm 458) erhalten selbstnutzende Eigentümer eine Grundförderung von 30 % plus Geschwindigkeitsbonus und Einkommensbonus bis zu maximal 70 % der förderfähigen Kosten.' }
    ]
  },
  'warmwasserkosten-rechner': {
    intro: 'Die Warmwasserbereitung macht in deutschen Haushalten etwa 12 bis 18 Prozent des gesamten häuslichen Energiebedarfs aus.',
    details: 'Zur Erwärmung von 1 Liter Wasser um 1 Kelvin werden 1,16 Wattstunden Energie benötigt. Um 100 Liter Wasser von 10 °C auf 45 °C Duschtemperatur zu erhitzen, fallen exakt 4,06 kWh Energie an.',
    faqs: [
      { question: 'Ist Duschen mit Durchlauferhitzer teurer als mit Zentralheizung?', answer: 'Ja, da Haushaltsstrom (ca. 35 ct/kWh) etwa drei- bis viermal so viel kostet wie Erdgas oder Wärmepumpenstrom (ca. 9 bis 12 ct/kWh Nutzwärme).' },
      { question: 'Wie viel Energie spart ein Sparduschkopf?', answer: 'Ein wassersparender Duschkopf reduziert den Durchfluss von 12–15 Liter/Minute auf 6–8 Liter/Minute und halbiert damit die Warmwasserkosten beim Duschen ohne Komfortverlust.' }
    ]
  },
  'kuehlschrank-stromkosten-rechner': {
    intro: 'Kühl- und Gefriergeräte laufen ununterbrochen an 365 Tagen im Jahr und gehören daher zu den kontinuierlichen Grundlast-Verbrauchern im Haushalt.',
    details: 'Alte Kühlgeräte der früheren Klasse A oder B verbrauchen oft 250 bis 350 kWh pro Jahr, während moderne Neugeräte der aktuellen Klasse B oder C mit 90 bis 130 kWh auskommen (Einsparung: ca. 60–80 € jährlich).',
    faqs: [
      { question: 'Welche Temperatur ist für den Kühlschrank optimal?', answer: '7 °C im oberen Fach (mittlere Einstellung Stufe 2 oder 3) reicht für optimale Haltbarkeit vollkommen aus; jedes Grad kälter steigert den Stromverbrauch um rund 6 Prozent.' },
      { question: 'Warum treibt Vereisung im Eisfach den Stromverbrauch nach oben?', answer: 'Die Eisschicht wirkt wie eine Isolierung: Der Kältekompressor muss wesentlich länger und härter arbeiten, um die Wärme abzutransportieren (regelmäßiges Abtauen spart bare Münze).' }
    ]
  },
  'waschmaschine-kosten-rechner': {
    intro: 'Dieser Kostenrechner erfasst die Ausgaben pro Waschgang aus Stromverbrauch, Frisch- und Abwasserkosten sowie dem Waschmittel.',
    details: 'Kosten pro Waschgang = (Stromverbrauch in kWh · Strompreis) + (Wasserverbrauch in m³ · Wasserpreis) + Waschmittelpreis (ca. 0,15–0,25 €). Ein 60°C-Waschgang verbraucht fast doppelt so viel Strom wie ein 40°C-Waschgang.',
    faqs: [
      { question: 'Wie viel Strom spart das Eco-40-60-Programm?', answer: 'Eco-Programme waschen mit niedrigerer Temperatur über eine längere Zeitdauer (Aufweicheffekt) und sparen so rund 30 bis 50 Prozent der Heizenergie im Vergleich zum Normalprogramm.' },
      { question: 'Wie viel kostet ein durchschnittlicher Waschgang in Deutschland?', answer: 'Bei modernen Waschmaschinen (Klasse A) kostet eine Ladung Buntwäsche inklusive Strom, Wasser und Waschmittel etwa 0,40 bis 0,60 Euro.' }
    ]
  },
  'trockner-kosten-rechner': {
    intro: 'Wäschetrockner gehören zu den energieintensivsten Haushaltsgeräten; moderne Wärmepumpentrockner verbrauchen jedoch nur einen Bruchteil alter Kondenstrockner.',
    details: 'Ein herkömmlicher Kondenstrockner verbraucht pro Trocknung ca. 3,5 bis 4,5 kWh Strom (ca. 1,30–1,60 €), ein effizienter Wärmepumpentrockner nur ca. 1,2 bis 1,5 kWh (ca. 0,45–0,55 €).',
    faqs: [
      { question: 'Wie funktioniert ein Wärmepumpentrockner?', answer: 'Er nutzt ein geschlossenes Kältemittelsystem: Die Wärme der feuchten Abluft wird nicht an den Raum abgegeben, sondern über die Wärmepumpe zurückgewonnen und erneut zum Heizen genutzt.' },
      { question: 'Wie viel Geld spart man pro Jahr durch den Umstieg auf einen Wärmepumpentrockner?', answer: 'Bei 160 Trocknungszyklen im Jahr spart ein Wärmepumpentrockner rund 120 bis 160 Euro Stromkosten pro Jahr; die Mehrkosten beim Kauf haben sich nach 2 bis 3 Jahren amortisiert.' }
    ]
  },
  'spuelmaschine-kosten-rechner': {
    intro: 'Dieser Rechner vergleicht die Gesamtkosten eines Geschirrspülers pro Spülgang mit dem manuellen Abwaschen von Hand im Spülbecken.',
    details: 'Entgegen landläufiger Meinung verbraucht ein moderner Geschirrspüler im Eco-Modus nur 9 bis 11 Liter Wasser und ca. 0,8 kWh Strom – von Hand benötigt man für dieselbe Geschirrmenge meist über 30 bis 40 Liter Warmwasser.',
    faqs: [
      { question: 'Muss man Geschirr vor dem Einräumen unter fließendem Wasser vorspülen?', answer: 'Nein, das Vorspülen verschwendet unnötig warmes Trinkwasser; es genügt vollkommen, grobe Speisereste mit der Gabel in den Müll zu streifen.' },
      { question: 'Warum dauert das Eco-Programm bei der Spülmaschine so lange?', answer: 'Um Strom zu sparen, wird das Wasser weniger stark erhitzt; das Spülmittel benötigt bei niedrigeren Temperaturen mehr Einwirkzeit, um Fette und Eiweiße enzymatisch zu lösen.' }
    ]
  },
  'fernseher-stromkosten-rechner': {
    intro: 'Dieser Rechner ermittelt die jährlichen Stromkosten Ihres Fernsehgeräts abhängig von Bildschirmdiagonale, Display-Technologie (OLED, QLED, LED) und Bildhelligkeit (HDR).',
    details: 'Stromverbrauch = Leistung in Watt · tägliche Sehdauer in Stunden · 365 Tage · Strompreis. Ein 65-Zoll-Fernseher mit 120 Watt Leistungsaufnahme verursacht bei 4 Stunden täglichem Betrieb rund 60 Euro Stromkosten pro Jahr.',
    faqs: [
      { question: 'Verbraucht HDR (High Dynamic Range) mehr Strom als Standard-Inhalte (SDR)?', answer: 'Ja, bei HDR-Wiedergabe regeln Hintergrundbeleuchtung und OLED-Pixel auf Spitzenhelligkeiten hoch, was die Leistungsaufnahme oft um 30 bis 60 Prozent steigert.' },
      { question: 'Welche Display-Technologie ist am energieeffizientesten?', answer: 'Standard-LED-LCDs sind meist etwas sparsamer als OLEDs bei hellen Bildern; OLEDs sind hingegen bei dunklen Filmszenen extrem sparsam, da schwarze Pixel komplett abgeschaltet werden.' }
    ]
  },
  'led-sparrechner': {
    intro: 'Dieser Rechner quantifiziert die Strom- und Kostenersparnis beim Austausch eines gesamten Leuchtenbestands im Haus oder Unternehmen gegen LED-Leuchtmittel.',
    details: 'Er berechnet die kumulierte Energieeinsparung, die vermiedenen CO₂-Emissionen und die exakte Amortisationszeit der neuen Leuchtmittel inklusive Beschaffungskosten.',
    faqs: [
      { question: 'Lohnt sich der Austausch von funktionierenden Energiesparlampen gegen LED?', answer: 'Ja, moderne LEDs verbrauchen nochmals etwa 50 % weniger Strom als alte Kompaktleuchtstofflampen, leuchten sofort mit voller Helligkeit und enthalten kein giftiges Quecksilber.' },
      { question: 'Welche Lichtfarbe eignet sich für Wohnräume?', answer: 'Für Wohn- und Schlafzimmer empfiehlt sich Warmweiß (2.700 bis 3.000 Kelvin); für Arbeitszimmer, Küche und Bad Neutralweiß (4.000 Kelvin) zur Steigerung der Konzentration.' }
    ]
  },
  'wasserverbrauch-haushalt-rechner': {
    intro: 'Der durchschnittliche Wasserverbrauch liegt in Deutschland bei rund 125 Litern Trinkwasser pro Person und Tag für Duschen, Toilettenspülung, Wäsche und Kochen.',
    details: 'Gesamtwasserkosten setzen sich aus dem Frischwasserbezug und der Abwassergebühr zusammen (bundesweiter Schnitt: ca. 4,00 bis 5,50 € pro Kubikmeter). Ein 3-Personen-Haushalt verbraucht ca. 120 bis 140 m³ Wasser pro Jahr.',
    faqs: [
      { question: 'Welcher Bereich verbraucht im Haushalt das meiste Wasser?', answer: 'Körperpflege (Baden und Duschen) macht rund 36 % des Verbrauchs aus, dicht gefolgt von der Toilettenspülung mit etwa 27 %.' },
      { question: 'Wie viel Wasser spart eine Spartaste an der Toilette?', answer: 'Eine moderne 2-Mengen-Spülung benötigt für das kleine Geschäft nur 3 Liter statt 6 bis 9 Liter beim Vollspülgang – das spart pro Person rund 6.000 bis 8.000 Liter Wasser jährlich.' }
    ]
  },
  'oelheizung-verbrauch-rechner': {
    intro: 'Dieser Rechner kalkuliert den jährlichen Heizölverbrauch, Füllstandskosten und die anfallende CO₂-Abgabe für ölbeheizte Wohngebäude.',
    details: '1 Liter leichtes Heizöl (EL) besitzt einen Brennwert von rund 10,0 kWh. Bei einem jährlichen Wärmebedarf von 20.000 kWh werden im Schnitt etwa 2.000 bis 2.200 Liter Heizöl verbraucht.',
    faqs: [
      { question: 'Wie hoch ist die CO₂-Abgabe pro Liter Heizöl?', answer: 'Auf Heizöl fällt nach dem BEHG eine CO₂-Abgabe an, die den Literpreis um derzeit rund 10 bis 13 Cent verteuert.' },
      { question: 'Wann dürfen alte Ölheizungen nach dem GEG noch betrieben werden?', answer: 'Bestehende Ölheizungen dürfen weiter betrieben und repariert werden; Standard-Heizkessel (keine Brennwert- oder Niedertemperaturtechnik) müssen jedoch nach 30 Jahren Betrieb stillgelegt werden (§ 72 GEG).' }
    ]
  },
  'pelletheizung-verbrauch-rechner': {
    intro: 'Holzpellets sind ein regenerativer Festbrennstoff aus gepressten Holzspänen mit hohem Energiegehalt und stabiler Verbrennungseffizienz.',
    details: '2 Kilogramm genormte Holzpellets (ENplus A1) entsprechen dem Energiegehalt von exakt 1 Liter Heizöl oder 1 m³ Erdgas (ca. 4,9 kWh/kg Heizwert). Pellets unterliegen nicht der nationalen fossilen CO₂-Abgabe.',
    faqs: [
      { question: 'Wie viel Lagerraum benötigt ein Jahresvorrat an Holzpellets?', answer: 'Für ein typisches Einfamilienhaus mit 4 bis 5 Tonnen Jahresbedarf wird ein trockener Lagerraum oder Gewebetank mit ca. 8 bis 10 Kubikmetern Raumvolumen benötigt.' },
      { question: 'Wie stabil ist der Pelletpreis im Vergleich zu Öl und Gas?', answer: 'Da Pellets als Nebenprodukt der regionalen Holzwirtschaft entstehen, sind sie von fossilen Krisen unabhängiger, unterliegen aber witterungs- und baubedingten Marktschwankungen.' }
    ]
  },
  'klimaanlage-stromkosten-rechner': {
    intro: 'Dieser Rechner ermittelt die Stromkosten von mobilen Klimageräten und fest installierten Split-Klimaanlagen während sommerlicher Hitzeperioden.',
    details: 'Split-Klimaanlagen erreichen eine Arbeitszahl (SEER) von 6 bis 8 und kühlen hocheffizient (ca. 0,3 bis 0,6 kWh pro Stunde). Mobile Monoblock-Geräte mit Abluftschlauch erreichen nur SEER-Werte um 2,5 und verbrauchen bis zu dreimal so viel Strom.',
    faqs: [
      { question: 'Warum sind mobile Monoblock-Klimageräte mit Schlauch so ineffizient?', answer: 'Der Schlauch transportiert warme Luft durch das gekippte Fenster nach außen; dadurch strömt permanent heiße Außenluft durch Tür- und Fensterspalten in das Zimmer nach.' },
      { question: 'Kann eine moderne Split-Klimaanlage im Winter auch heizen?', answer: 'Ja, moderne Split-Klimageräte sind Luft-Luft-Wärmepumpen: Durch Umkehr des Kältekreislaufs können sie im Übergangsmonaten hocheffizient und kostengünstig heizen.' }
    ]
  },
  'e-auto-ladekosten-zuhause-rechner': {
    intro: 'Dieser Rechner vergleicht die Kosten für das Laden des Elektroautos an der eigenen Wallbox mit einer Photovoltaik-Eigenverbrauchsanlage und dem Netzstromtarif.',
    details: 'Wer Solarstrom vom eigenen Dach lädt (Gestehungskosten ca. 8 bis 11 Cent/kWh), fährt für rund 1,50 bis 2,00 Euro pro 100 Kilometer – bei reinem Netzstrombezug liegen die Kosten bei ca. 5,00 bis 6,50 Euro.',
    faqs: [
      { question: 'Muss eine 11-kW-Wallbox beim Netzbetreiber genehmigt werden?', answer: 'Eine Wallbox mit bis zu 11 kW Ladeleistung ist nach § 19 NAV beim Netzbetreiber anmeldepflichtig, bedarf aber keiner Genehmigung. Erst ab 22 kW ist eine vorherige Genehmigung erforderlich.' },
      { question: 'Was ist PV-Überschussladen?', answer: 'Ein intelligentes Ladesystem regelt die Ladeleistung dynamisch so, dass das Auto nur dann geladen wird, wenn die Solaranlage mehr Strom erzeugt, als das Haus im selben Moment verbraucht.' }
    ]
  },
  'co2-abgabe-vermieter-mieter-rechner': {
    intro: 'Das Kohlendioxidkostenaufteilungsgesetz (CO2KostAufG) teilt die CO₂-Kosten für Heizöl, Gas und Fernwärme nach einem 10-Stufen-Modell zwischen Vermieter und Mieter auf.',
    details: 'Je schlechter der energetische Zustand des Gebäudes (hoher CO₂-Ausstoß je m² Wohnfläche), desto höher ist der prozentuale Anteil, den der Vermieter selbst tragen muss (bis zu 95 %). Bei Passivhäusern trägt der Mieter die Kosten zu 100 % allein.',
    faqs: [
      { question: 'Wie ermittelt der Vermieter die CO₂-Einstufung des Gebäudes?', answer: 'Anhand der CO₂-Menge aus der Brennstoffrechnung geteilt durch die Wohnfläche. Die Stufentabelle im CO2KostAufG weist den genauen prozentualen Verteilungsschlüssel aus.' },
      { question: 'Darf der Vermieter seinen CO₂-Anteil auf den Mieter abwälzen?', answer: 'Nein, vertragliche Vereinbarungen, die dem Mieter einen höheren CO₂-Kostenanteil auferlegen als gesetzlich vorgeschrieben, sind nach § 3 CO2KostAufG unwirksam.' }
    ]
  },
  'lebensmittelbudget-rechner': {
    intro: 'Dieser Haushaltsbudgetrechner ermittelt die monatlichen und wöchentlichen Ausgaben für Ernährung, Supermarkteinkäufe und Drogeriewaren basierend auf der Haushaltsgröße.',
    details: 'Statistisches Bundesamt: Ein Single gibt in Deutschland im Schnitt rund 220 bis 300 € monatlich für Nahrungsmittel und Getränke aus; bei sparsamer Wirtschaftsweise reichen oft 160 bis 200 €.',
    faqs: [
      { question: 'Welche Faustregel gilt für das Wocheneinkaufsbudget pro Person?', answer: 'Als Faustformel gelten ca. 45 bis 65 Euro pro erwachsener Person und Woche für einen ausgewogenen, selbstgekochten Speiseplan.' },
      { question: 'Wie spart man beim Lebensmitteleinkauf am effektivsten?', answer: 'Wochenplan schreiben, zielgerichtet nach Einkaufszettel einkaufen, Saisonware bevorzugen und Lebensmittelverschwendung durch gezieltes Reste-Kochen vermeiden.' }
    ]
  },
  'energieeffizienzklasse-rechner': {
    intro: 'Der Energieeffizienzklasse-Rechner ordnet ein Wohngebäude anhand seines Endenergiebedarfs in kWh/(m²·a) den Klassen A+ bis H des Gebäudeenergiegesetzes (GEG) zu.',
    details: 'Klasse A+ entspricht < 30 kWh/(m²·a), A < 50 kWh/(m²·a), B < 75 kWh/(m²·a). Ab Klasse F (> 160 kWh/(m²·a)) bis H (> 250 kWh/(m²·a)) liegt gravierender Sanierungsbedarf vor.',
    faqs: [
      { question: 'Wo findet man die Energieeffizienzklasse einer Immobilie?', answer: 'Auf Seite 1 des offiziellen Energieausweises (Bedarfs- oder Verbrauchsausweis), der bei Verkauf oder Neuvermietung gesetzlich vorgelegt werden muss.' },
      { question: 'Welche Effizienzklassen drohen bei künftigen EU-Sanierungsvorgaben (EPBD)?', answer: 'Die EU-Gebäuderichtlinie zielt darauf ab, Gebäude mit den schlechtesten Effizienzklassen G und H schrittweise über Sanierungsfahrpläne auf höhere Standards anzuheben.' }
    ]
  }
};
