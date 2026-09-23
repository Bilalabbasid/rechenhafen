import { CalcContent } from './types';

export const WOHNEN_CONTENT: Record<string, CalcContent> = {
  'mietbelastungsquote-rechner': {
    intro: 'Die Mietbelastungsquote beziffert den prozentualen Anteil des monatlichen Haushaltsnettoeinkommens, der für die Warmmiete aufgewendet wird.',
    details: 'Mietbelastungsquote = (Warmmiete / Nettoeinkommen) · 100. Als Faustregel gilt ein Höchstwert von 30 bis maximal 35 Prozent, um ausreichend finanziellen Spielraum für Lebenshaltung, Mobilität und Rücklagen zu gewährleisten.',
    faqs: [
      { question: 'Gilt die 30-Prozent-Regel für Warm- oder Kaltmiete?', answer: 'Vermieter und Banken prüfen stets die Warmmiete (Gesamtwohnkosten inklusive Heizung und Nebenkosten), da dieser Gesamtbetrag monatlich vom Konto abfließt.' },
      { question: 'Was fordern Vermieter typischerweise an Mindesteinkommen?', answer: 'Viele Vermieter verlangen, dass das monatliche Nettoeinkommen mindestens das Dreifache der Warmmiete beträgt (entspricht einer Mietbelastung von ca. 33 %).' }
    ]
  },
  'kaufnebenkosten-rechner': {
    intro: 'Beim Immobilienkauf fallen neben dem reinen Kaufpreis erhebliche Kaufnebenkosten an, die typischerweise 8 bis 15 Prozent des Kaufpreises ausmachen.',
    details: 'Die Nebenkosten setzen sich aus Grunderwerbsteuer (3,5 bis 6,5 % je nach Bundesland), Notar- und Grundbuchkosten (ca. 1,5 bis 2,0 %) sowie der Maklerprovision (bis zu 3,57 % für den Käufer) zusammen. Banken verlangen meist, diese Nebenkosten aus Eigenkapital zu bezahlen.',
    faqs: [
      { question: 'Welches Bundesland hat die niedrigste Grunderwerbsteuer?', answer: 'Bayern hat mit 3,5 Prozent den bundesweit niedrigsten Steuersatz; die meisten anderen Bundesländer liegen bei 5,0 bis 6,5 Prozent.' },
      { question: 'Können Kaufnebenkosten steuerlich abgesetzt werden?', answer: 'Bei selbstgenutzten Immobilien nicht; bei vermieteten Objekten werden Grunderwerbsteuer, Notar und Makler anteilig auf Gebäude und Grund und Boden verteilt und über die Gebäude-AfA abgeschrieben.' }
    ]
  },
  'immobilienrendite-rechner': {
    intro: 'Dieser Renditerechner ermittelt die Brutto- und Nettomietrendite sowie die Eigenkapitalrendite (Cash-on-Cash Return) von Miet- und Anlageimmobilien.',
    details: 'Während die Bruttorendite nur Kaltmiete und Kaufpreis ins Verhältnis setzt, berücksichtigt die Nettomietrendite alle Kaufnebenkosten, nicht umlagefähige Verwaltungskosten und die Instandhaltungsrücklage: Jahresnettokaltmiete / Gesamtinvestitionskosten · 100.',
    faqs: [
      { question: 'Ab welcher Nettomietrendite gilt eine Immobilie als lohnende Kapitalanlage?', answer: 'In Großstädten gelten 3,5 bis 4,5 Prozent als solide; in B- und C-Lagen werden wegen des höheren Leerstands- und Wiedervermietungsrisikos oft 5 bis 6 Prozent Rendite angestrebt.' },
      { question: 'Was ist der Leverage-Effekt (Hebeleffekt) beim Immobilienkauf?', answer: 'Liegt die Gesamtrendite der Immobilie über dem Kreditzinssatz, erhöht der Einsatz von Fremdkapital die Rendite auf das eingesetzte Eigenkapital überproportional.' }
    ]
  },
  'quadratmeterpreis-rechner': {
    intro: 'Der Quadratmeterpreis normiert Kauf- und Mietpreise auf die Wohnfläche und ermöglicht den objektiven Vergleich von Immobilienangeboten.',
    details: 'Quadratmeterpreis = Gesamtpreis / Wohnfläche in m². Die exakte Wohnflächenermittlung nach der Wohnflächenverordnung (WoFlV) ist entscheidend, da Terrassen und Balkone nur anteilig einfließen dürfen.',
    faqs: [
      { question: 'Welcher Unterschied besteht zwischen Wohnfläche und Nutzfläche?', answer: 'Wohnfläche umfasst alle beheizten, bewohnbaren Räume; Nutzfläche schließt Keller, Dachböden, Garagen und gewerbliche Flächen ein.' },
      { question: 'Wie beeinflusst das Baujahr den Quadratmeterpreis?', answer: 'Neubauten nach aktuellen Effizienzhaus-Standards (KfW 40) erzielen meist 20 bis 40 Prozent höhere Quadratmeterpreise als unrenovierte Bestandsbauten mit hohem Energiebedarf.' }
    ]
  },
  'mietbudget-rechner': {
    intro: 'Dieser Budgetrechner ermittelt die maximal leistbare Kalt- und Warmmiete auf Basis Ihres Haushaltsnettoeinkommens.',
    details: 'Die Berechnung staffelt das Budget nach der konservativen 30-%-Regel und der tolerierbaren 40-%-Belastungsgrenze abzüglich typischer Nebenkostenpauschalen.',
    faqs: [
      { question: 'Wie hoch sind die Nebenkosten pro Quadratmeter im Durchschnitt?', answer: 'Nach dem Betriebskostenspiegel des Deutschen Mieterbundes betragen die Gesamtwarmnebenkosten (Heizung, Wasser, Müll, Hausmeister etc.) durchschnittlich 2,80 bis 3,50 € pro Quadratmeter Wohnfläche.' },
      { question: 'Was tun, wenn die Wunschwohnung über 40 % des Einkommens kostet?', answer: 'In solchen Fällen fordern Vermieter häufig eine Mietbürgschaft (z. B. der Eltern) oder die Aufnahme eines zweiten solventen Hauptmieters in den Mietvertrag.' }
    ]
  },
  'mietminderung-rechner': {
    intro: 'Bei erheblichen Mängeln der Mietsache (z. B. Heizungsausfall im Winter, Schimmelbefall, Baulärm) haben Mieter nach § 536 BGB ein gesetzliches Recht zur Mietminderung.',
    details: 'Die Minderung errechnet sich taggenau aus der Warmmiete (Bruttomiete inklusive Vorauszahlungen): Minderung = (Warmmiete / 30 Tage) · Minderungsquote · Ausfalltage.',
    faqs: [
      { question: 'Wird die Minderung von der Kaltmiete oder Warmmiete berechnet?', answer: 'Nach ständiger Rechtsprechung des Bundesgerichtshofs (BGH, Az. XII ZR 225/03) ist die Bruttomiete (Warmmiete inklusive Nebenkostenvorauszahlungen) die zwingende Bemessungsgrundlage.' },
      { question: 'Darf man die Miete ohne Mängelanzeige sofort kürzen?', answer: 'Nein, nach § 536c BGB muss der Mangel dem Vermieter unverzüglich schriftlich angezeigt und eine angemessene Frist zur Beseitigung gesetzt werden; erst ab Zugang der Anzeige darf gemindert werden.' }
    ]
  },
  'staffelmiete-rechner': {
    intro: 'Eine Staffelmiete (§ 557a BGB) legt künftige Mieterhöhungen bereits im Mietvertrag mit festen Geldbeträgen und Zeitpunkten verbindlich fest.',
    details: 'Zwischen zwei Erhöhungsschritten muss mindestens ein Jahr liegen. Während der Laufzeit einer Staffelmiete sind reguläre Mieterhöhungen bis zur ortsüblichen Vergleichsmiete oder wegen Modernisierung gesetzlich ausgeschlossen.',
    faqs: [
      { question: 'Darf die Staffelmiete prozentual formuliert sein?', answer: 'Nein, nach § 557a Abs. 1 BGB muss der jeweilige Erhöhungsbetrag in Euro und Cent beziffert sein; eine Klausel wie "jährlich 3 % mehr" ist unwirksam.' },
      { question: 'Gilt die Mietpreisbremse auch bei Staffelmietverträgen?', answer: 'Ja, jede einzelne Mietstaffel muss bei ihrer Fälligkeit die zu diesem Zeitpunkt geltende Obergrenze der Mietpreisbremse (ortsübliche Vergleichsmiete + max. 10 %) einhalten.' }
    ]
  },
  'indexmiete-rechner': {
    intro: 'Bei einer Indexmiete (§ 557b BGB) ist die Entwicklung der Kaltmiete an den Verbraucherpreisindex (VPI) des Statistischen Bundesamtes gekoppelt.',
    details: 'Formel: Neue Miete = Alte Miete · (Neuer VPI / Alter VPI). Steigt der Index um 5,2 %, darf der Vermieter die Kaltmiete mit einer schriftlichen Erklärung und einmonatiger Ankündigungsfrist um exakt 5,2 % anheben.',
    faqs: [
      { question: 'Kann die Miete bei einer Indexmiete auch sinken?', answer: 'Ja, sollte der Verbraucherpreisindex in einer Deflationsphase fallen, hat der Mieter nach dem Gesetz einen Rechtsanspruch auf Absenkung der Kaltmiete.' },
      { question: 'Darf der Vermieter neben der Indexerhöhung Modernisierungskosten umlegen?', answer: 'Nur dann, wenn die Modernisierung gesetzlich zwingend vorgeschrieben war (z. B. nach dem Gebäudeenergiegesetz); freiwillige Modernisierungen dürfen bei Indexmiete nicht umgelegt werden.' }
    ]
  },
  'wohnflaeche-din-rechner': {
    intro: 'Die Wohnflächenverordnung (WoFlV) regelt in Deutschland rechtssicher, welche Grundflächen von Räumen, Dachschrägen, Balkonen und Terrassen zur offiziellen Wohnfläche zählen.',
    details: 'Flächen mit lichter Raumhöhe ab 2,00 Metern zählen zu 100 %, Höhen zwischen 1,00 und 1,99 Metern zu 50 %, Flächen unter 1,00 Meter Höhe zu 0 %. Balkone und Terrassen werden im Regelfall mit 25 Prozent (in Ausnahmefällen 50 Prozent) angerechnet.',
    faqs: [
      { question: 'Was passiert, wenn die tatsächliche Wohnfläche kleiner ist als im Mietvertrag angegeben?', answer: 'Weicht die Wohnfläche um mehr als 10 Prozent nach unten ab, liegt ein erheblicher Mangel vor: Der Mieter darf die Miete dauerhaft kürzen und zu viel gezahlte Miete der Vorjahre zurückfordern.' },
      { question: 'Zählen Treppen und Abstellräume außerhalb der Wohnung zur Wohnfläche?', answer: 'Nein, Treppen mit mehr als 3 Steigungen sowie Keller-, Wasch- und Trockenräume außerhalb der abgeschlossenen Wohnung zählen nach § 2 WoFlV nicht zur Wohnfläche.' }
    ]
  },
  'grundsteuer-reform-rechner': {
    intro: 'Die Grundsteuerreform bewertet ab 2025 alle Grundstücke neu, nachdem das Bundesverfassungsgericht die alten Einheitswerte für verfassungswidrig erklärt hat.',
    details: 'Berechnung im Bundesmodell: Grundsteuer = Grundsteuerwert (festgestellt vom Finanzamt) · Steuermesszahl (z. B. 0,31 ‰ für Wohnen) · Hebesatz der Gemeinde / 100. Manche Länder (Bayern, BW, Hessen) nutzen abweichende Flächen- oder Faktormodelle.',
    faqs: [
      { question: 'Wer legt die Höhe der Grundsteuer letztlich fest?', answer: 'Die jeweilige Stadt oder Gemeinde über ihren kommunalen Hebesatz; sie kann den Hebesatz autonom nach oben oder unten anpassen.' },
      { question: 'Darf die Grundsteuer auf den Mieter umgelegt werden?', answer: 'Ja, nach § 2 Nr. 1 der Betriebskostenverordnung (BetrKV) gehört die laufende Grundsteuer zu den umlagefähigen Betriebskosten und kann in der Nebenkostenabrechnung aufgeführt werden.' }
    ]
  },
  'spekulationssteuer-immobilien-rechner': {
    intro: 'Gewinne aus dem Verkauf privater Immobilien sind nach § 23 EStG steuerpflichtig, wenn zwischen Anschaffung und Veräußerung weniger als 10 Jahre liegen (Spekulationsfrist).',
    details: 'Verkaufsgewinn = Verkaufspreis - Anschaffungskosten - Notar/Makler - Renovierungskosten der ersten 3 Jahre. Der Gewinn wird mit dem individuellen persönlichen Einkommensteuersatz versteuert.',
    faqs: [
      { question: 'Wann entfällt die 10-Jahres-Frist bei Eigennutzung?', answer: 'Wurde die Immobilie im Jahr des Verkaufs und den beiden vorangegangenen Kalenderjahren durchgehend selbst bewohnt, ist der Verkaufsgewinn auch vor Ablauf von 10 Jahren steuerfrei.' },
      { question: 'Gilt die Spekulationsfrist auch für geerbte Immobilien?', answer: 'Bei einer Erbschaft wird die Haltedauer des Erblassers voll angerechnet: Besaß der Erblasser die Immobilie bereits länger als 10 Jahre, kann der Erbe sofort steuerfrei verkaufen.' }
    ]
  },
  'maklerprovision-rechner': {
    intro: 'Seit dem Gesetz über die Verteilung der Maklerkosten beim Verkauf von Wohnungen und Einfamilienhäusern (§ 656c BGB) gilt das gesetzliche Halbteilungskonsens.',
    details: 'Wird der Makler von beiden Parteien beauftragt, zahlen Käufer und Verkäufer exakt denselben Provisionsanteil. In der Praxis beträgt die Courtage meist je 3,57 Prozent inklusive 19 % Mehrwertsteuer (Gesamtprovision: 7,14 %).',
    faqs: [
      { question: 'Gilt das Bestellerprinzip auch beim Immobilienkauf?', answer: 'Nein, das reine Bestellerprinzip (wer bestellt, zahlt komplett) gilt seit 2015 nur bei der Vermietung von Wohnraum; beim Kauf gilt die 50/50-Kostenteilung nach § 656c BGB.' },
      { question: 'Darf der Makler mit dem Käufer eine höhere Provision vereinbaren als mit dem Verkäufer?', answer: 'Nein, Vereinbarungen, die den Käufer zu einer höheren Provisionszahlung verpflichten als den Verkäufer, sind nach § 656c BGB gesetzlich unwirksam.' }
    ]
  },
  'grunderwerbsteuer-rechner': {
    intro: 'Die Grunderwerbsteuer fällt beim Erwerb von Grundstücken und Immobilien an und wird von den Bundesländern eigenständig festgesetzt.',
    details: 'Die Steuersätze reichen von 3,5 % (Bayern) über 5,0 % (z. B. Niedersachsen, Baden-Württemberg) bis zu 6,5 % (z. B. NRW, Saarland, Brandenburg). Steuer = Beurkundeter Kaufpreis · Steuersatz.',
    faqs: [
      { question: 'Können Einbauküchen und Möbel die Grunderwerbsteuer senken?', answer: 'Ja, bewegliches Zubehör (Einbauküche, Sauna, Möbel), das im Notarvertrag mit realistischem Zeitwert separat ausgewiesen wird, unterliegt nicht der Grunderwerbsteuer.' },
      { question: 'Wann wird die Grunderwerbsteuer fällig?', answer: 'Das Finanzamt stellt den Steuerbescheid meist 4 bis 8 Wochen nach dem Notartermin zu; die Steuer ist innerhalb eines Monats nach Bekanntgabe fällig. Erst nach Zahlung ergeht die Unbedenklichkeitsbescheinigung für das Grundbuchamt.' }
    ]
  },
  'notar-grundbuch-kosten-rechner': {
    intro: 'Notar- und Grundbuchgebühren sind nach dem Gerichts- und Notarkostengesetz (GNotKG) bundesweit gesetzlich einheitlich geregelt.',
    details: 'Für Kaufvertragsentwurf, Beurkundung, Grundbucheintragung (Auflassungsvormerkung und Eigentumsumschreibung) sowie die Eintragung einer Grundschuld fallen in der Summe rund 1,5 bis 2,0 Prozent des Kaufpreises an.',
    faqs: [
      { question: 'Sind Notargebühren verhandelbar?', answer: 'Nein, Notare sind nach § 17 BNotO gesetzlich verpflichtet, exakt die Gebühren nach dem GNotKG abzurechnen; Rabatte oder Gebührenübernahmen sind strafbar.' },
      { question: 'Wer zahlt üblicherweise die Notarkosten beim Immobilienkauf?', answer: 'Nach den Gepflogenheiten im Kaufvertrag trägt der Käufer alle Notar- und Grundbuchkosten des Kaufs und der Grundschuld; der Verkäufer trägt nur Kosten für die Löschung alter, eigener Belastungen.' }
    ]
  },
  'instandhaltungsruecklage-rechner': {
    intro: 'Die Instandhaltungsrücklage (Erhaltungsrücklage nach § 19 WEG) sichert Wohnungseigentümergemeinschaften gegen künftige Reparaturen an Dach, Fassade, Heizung und Fenstern ab.',
    details: 'Berechnung nach Petersscher Formel: Jährliche Rücklage = 1,5 · Herstellungskosten/m² · 70 % / 80 Jahre. Das Gesetz über die Wohnungsförderung (§ 28 II. BV) sieht je nach Gebäudealter 7,10 € bis 11,50 € pro m² und Jahr vor.',
    faqs: [
      { question: 'Was geschieht mit der Rücklage bei Verkauf der Wohnung?', answer: 'Der angesparte Anteil der Rücklage geht automatisch auf den Käufer über; er kann dem Verkäufer nicht bar ausgezahlt werden, wird im Kaufvertrag aber gesondert ausgewiesen (grunderwerbsteuerfrei!).' },
      { question: 'Was droht bei einer zu geringen Instandhaltungsrücklage?', answer: 'Steht eine größere Sanierung (z. B. neues Dach für 100.000 €) an, müssen die Eigentümer eine oft schmerzhafte Sonderumlage aus eigenen liquiden Mitteln nachschießen.' }
    ]
  },
  'modernisierungsumlage-rechner': {
    intro: 'Nach § 559 BGB dürfen Vermieter nach baulichen Maßnahmen, die den Gebrauchswert nachhaltig erhöhen oder Endenergie einsparen, einen Teil der Kosten auf die Jahresmiete umlegen.',
    details: 'Der Umlagesatz beträgt maximal 8 Prozent der auf die Wohnung entfallenden Modernisierungskosten pro Jahr. Die monatliche Mieterhöhung ist innerhalb von 6 Jahren auf maximal 3,00 €/m² (bei Mieten unter 7,00 €/m² auf max. 2,00 €/m²) gedeckelt.',
    faqs: [
      { question: 'Dürfen reine Instandhaltungskosten umgelegt werden?', answer: 'Nein, reine Reparatur- und Instandhaltungskosten (Erhaltungsaufwand, der ohnehin fällig gewesen wäre) müssen vor der Umlageberechnung sauber abgezogen werden.' },
      { question: 'Müssen staatliche Fördermittel abgezogen werden?', answer: 'Ja, nach § 559a BGB müssen Zuschüsse (z. B. von BAFA oder KfW) zwingend von den Modernisierungskosten abgezogen werden, bevor der 8-%-Umlagesatz berechnet wird.' }
    ]
  },
  'mietkaution-zinsen-rechner': {
    intro: 'Vermieter sind nach § 551 Abs. 3 BGB gesetzlich verpflichtet, die Mietkaution getrennt von ihrem eigenen Vermögen bei einer Bank zu dem für Spareinlagen mit dreimonatiger Kündigungsfrist üblichen Zinssatz anzulegen.',
    details: 'Zinsen und Zinseszinsen stehen in voller Höhe dem Mieter zu und erhöhen den Kautionsbetrag, der am Ende des Mietverhältnisses zurückgezahlt werden muss.',
    faqs: [
      { question: 'Wie hoch darf die Mietkaution maximal sein?', answer: 'Nach § 551 Abs. 1 BGB darf die Kaution maximal drei Nettokaltmieten betragen; Nebenkostenvorauszahlungen dürfen nicht eingerechnet werden.' },
      { question: 'Wie lange darf der Vermieter die Kaution nach Auszug einbehalten?', answer: 'Dem Vermieter steht eine angemessene Prüfungs- und Überlegungsfrist von in der Regel 3 bis 6 Monaten zu; ein angemessener Teilbetrag darf bis zur nächsten Nebenkostenabrechnung einbehalten werden.' }
    ]
  },
  'hausgeld-rechner': {
    intro: 'Das Hausgeld ist der monatliche Vorschuss, den Eigentümer einer Eigentumswohnung an die WEG-Verwaltung für Bewirtschaftung, Nebenkosten und Instandhaltungsrücklage zahlen.',
    details: 'Es unterteilt sich in umlagefähige Betriebskosten (Heizung, Müll, Hausmeister, die an den Mieter weitergereicht werden können) und nicht umlagefähige Verwaltungskosten sowie Zuführungen zur Erhaltungsrücklage.',
    faqs: [
      { question: 'Welche Teile des Hausgelds kann der Eigentümer auf Mieter umlegen?', answer: 'Nur die Kosten nach der Betriebskostenverordnung (§ 2 BetrKV); Verwaltergebühren, Kontoführungsgebühren und die Instandhaltungsrücklage verbleiben immer beim Eigentümer.' },
      { question: 'Wie hoch ist das durchschnittliche Hausgeld pro Quadratmeter?', answer: 'In Deutschland liegt das Hausgeld meist zwischen 3,00 € und 4,50 € pro Quadratmeter Wohnfläche im Monat, abhängig von Gebäudealter, Aufzug und Heizsystem.' }
    ]
  },
  'abschreibung-immobilien-rechner': {
    intro: 'Die Absetzung für Abnutzung (AfA nach § 7 Abs. 4 EStG) mindert das steuerpflichtige Einkommen von Vermietern durch die steuerliche Abschreibung des Gebäudewerts.',
    details: 'Seit 2023 fertiggestellte Wohngebäude werden mit linear 3,0 % jährlich abgeschrieben. Für ältere Bestandsbauten (Fertigstellung nach 1924) gilt der Steuersatz von 2,0 % über 50 Jahre. Wichtig: Der Grundstücksanteil (Bodenwert) darf nicht abgeschrieben werden.',
    faqs: [
      { question: 'Wie ermittelt man den Gebäudeanteil für die AfA?', answer: 'Über die offizielle Arbeitshilfe des Bundesfinanzministeriums zur Kaufpreisaufteilung auf Gebäude und Grund und Boden anhand von Bodenrichtwerten und Gebäudeherstellungskosten.' },
      { question: 'Gibt es für energieeffiziente Neubauten eine Sonder-AfA?', answer: 'Ja, für Neubauten mit Effizienzhaus-Standard 40 mit Qualitätssiegel Nachhaltiges Gebäude (QNG) existiert eine degressive AfA bzw. Sonder-AfA nach § 7b EStG.' }
    ]
  },
  'mietrendite-brutto-netto-rechner': {
    intro: 'Dieser Vergleichsrechner stellt die simple Bruttomietrendite der realistischen Nettomietrendite gegenüber, um Scheingewinne bei Immobilienangeboten aufzudecken.',
    details: 'Bruttomietrendite = (Jahreskaltmiete / Kaufpreis) · 100. Nettomietrendite = (Jahreskaltmiete - nicht umlagefähige Kosten) / (Kaufpreis + Kaufnebenkosten) · 100. Die Nettorendite liegt typischerweise 1,0 bis 1,5 Prozentpunkte unter der Bruttorendite.',
    faqs: [
      { question: 'Warum preisen Makler fast immer die Bruttomietrendite an?', answer: 'Weil die Bruttorendite deutlich höher wirkt, da sie Kaufnebenkosten (Grunderwerbsteuer, Notar, Makler) und laufende Instandhaltungsaufwendungen verschweigt.' },
      { question: 'Welche Kosten müssen von der Kaltmiete für die Nettorendite abgezogen werden?', answer: 'Verwaltergebühren, Instandhaltungsrücklage, Mietausfallwagnis (typisch 2 %) und Reparaturkosten.' }
    ]
  },
  'vorfaelligkeitsentschaedigung-baufinanzierung-rechner': {
    intro: 'Kündigen Eigentümer ein Festzinsdarlehen vor Ablauf der Zinsbindung wegen Immobilienverkaufs, berechnet die Bank ihren Zinsschaden nach der vom Bundesgerichtshof (BGH) anerkannten Aktiv-Passiv-Methode.',
    details: 'Die Bank vergleicht die vertraglich vereinbarten Zinsen mit der Wiederanlage der Restsumme in sicheren Pfandbriefen über die Restlaufzeit. Ersparte Verwaltungskosten und Risikoabschläge müssen abgezogen werden.',
    faqs: [
      { question: 'Kann die Vorfälligkeitsentschädigung bei Immobilienverkauf vermieden werden?', answer: 'Ja, wenn der Käufer der Immobilie das bestehende Darlehen zu den alten Konditionen übernimmt (Schuldnerwechsel) und die Bank zustimmt.' },
      { question: 'Darf die Bank nach 10 Jahren noch eine Entschädigung verlangen?', answer: 'Nein, nach § 489 Abs. 1 Nr. 2 BGB steht Darlehensnehmern nach Ablauf von 10 Jahren ein gesetzliches, gebührenfreies Kündigungsrecht mit 6 Monaten Frist zu.' }
    ]
  },
  'abstandszahlung-rechner': {
    intro: 'Dieser Wertermittler kalkuliert den angemessenen Zeitwert von Möbeln oder Einbauküchen, die vom Vormieter an den Nachmieter übergeben werden.',
    details: 'Nach § 4a Wohnungsvermittlungsgesetz (WoVermG) sind Vereinbarungen unwirksam, wenn das Entgelt in einem auffälligen Missverhältnis zum Wert der Einrichtung steht (mehr als 50 % über dem tatsächlichen Zeitwert).',
    faqs: [
      { question: 'Wie berechnet man den Zeitwert einer Einbauküche fair?', answer: 'Nach der linearen Abschreibung: Anschaffungspreis abzüglich ca. 24 % Wertverlust im ersten Jahr und danach jährlich ca. 8 % über eine Gesamtnutzungsdauer von 10 Jahren.' },
      { question: 'Darf der Vormieter den Mietvertrag an eine Abstandsübernahme koppeln?', answer: 'Nein, nur der Vermieter entscheidet über den Mietvertragsabschluss; Koppelungsgeschäfte durch Vormieter sind rechtlich unzulässig.' }
    ]
  },
  'warmmiete-zu-kaltmiete-rechner': {
    intro: 'Dieser Rechner trennt die reine Grundmiete (Kaltmiete) von den kalten Betriebskosten und Heizkostenvorauszahlungen der Warmmiete.',
    details: 'Kaltmiete = Warmmiete - Heizkosten - kalte Betriebskosten. Die Kaltmiete bildet die rechtliche Vergleichsgröße für Mietspiegel und die Begrenzungen der Mietpreisbremse.',
    faqs: [
      { question: 'Darf der Vermieter bei gestiegenen Energiepreisen die Vorauszahlungen anheben?', answer: 'Nach § 560 Abs. 4 BGB darf jede Partei nach einer Abrechnung durch schriftliche Erklärung eine Anpassung der Vorauszahlungen auf eine angemessene Höhe vornehmen.' },
      { question: 'Welche Posten gehören zu den kalten Nebenkosten?', answer: 'Grundsteuer, Wasser/Abwasser, Müllabfuhr, Gebäudeversicherung, Straßenreinigung, Hausmeister, Gartenpflege und Beleuchtung.' }
    ]
  },
  'untermiete-rechner': {
    intro: 'Dieser Rechner kalkuliert den fairen Mietanteil und die Nebenkostenumlage bei der Untervermietung einzelner Zimmer an Mitbewohner oder Zwischenmieter.',
    details: 'Kostenanteil = Warmmiete · (Zimmerfläche + anteilige Gemeinschaftsfläche) / Gesamtwohnfläche. Für möblierte Zimmer kann ein angemessener Möblierungszuschlag erhoben werden.',
    faqs: [
      { question: 'Benötigt man für die Untervermietung die Erlaubnis des Vermieters?', answer: 'Ja, nach § 553 BGB muss die Erlaubnis eingeholt werden. Bei berechtigtem Interesse (z. B. finanzielle Entlastung, Auslandsaufenthalt) hat der Mieter jedoch einen Rechtsanspruch auf Genehmigung.' },
      { question: 'Müssen Mieteinnahmen aus Untervermietung versteuert werden?', answer: 'Einnahmen aus Untervermietung müssen in der Steuererklärung angegeben werden; die eigene gezahlte Miete für das Zimmer kann jedoch als Werbungskosten voll gegengerechnet werden.' }
    ]
  },
  'erbbaurecht-erbbauzins-rechner': {
    intro: 'Beim Erbbaurecht (Erbbaurechtsgesetz, ErbbauRG) erwerben Sie ein Gebäude auf einem fremden Grundstück und zahlen dem Grundstückseigentümer dafür einen laufenden Erbbauzins.',
    details: 'Erbbauzins = Grundstückswert · Zinssatz (üblich 3 bis 5 Prozent p.a.). Typische Vertragslaufzeiten betragen 75 bis 99 Jahre. Der Zinssatz ist in der Regel über Wertsicherungsklauseln an den Verbraucherpreisindex gekoppelt.',
    faqs: [
      { question: 'Was geschieht bei Ablauf des Erbbaurechtsvertrags (Heimfall)?', answer: 'Das Eigentum am Gebäude geht auf den Grundstückseigentümer über; dieser muss dem Erbbaurechtsnehmer nach § 27 ErbbauRG eine angemessene Entschädigung (meist mind. 2/3 des Gebäudewerts) zahlen.' },
      { question: 'Warum sind Erbbaurecht-Immobilien im Kaufpreis günstiger?', answer: 'Weil Sie das teure Grundstück nicht kaufen, sondern nur pachten; dadurch sinkt der anfängliche Kaufpreis erheblich, dafür fallen jedoch dauerhafte monatliche Zinsen an.' }
    ]
  },
  'kaufpreis-faktor-rechner': {
    intro: 'Der Kaufpreisfaktor (Vervielfältiger) beziffert das Verhältnis von Kaufpreis zu jährlicher Nettokaltmiete und gibt an, nach wie vielen Jahren sich die Immobilie refinanziert.',
    details: 'Faktor = Kaufpreis / Jahresnettokaltmiete. Ein Faktor von 20 entspricht einer Bruttorendite von 5,0 % (100 / Faktor). Faktoren unter 20 gelten als günstig, zwischen 20 und 25 als marktgerecht, über 30 als teuer.',
    faqs: [
      { question: 'Wie rechnet man den Kaufpreisfaktor in Bruttorendite um?', answer: 'Teilen Sie 100 durch den Faktor: Faktor 25 entspricht 100 / 25 = 4,0 % Rendite; Faktor 33 entspricht 100 / 33 = 3,03 % Rendite.' },
      { question: 'Welcher Faktor ist für deutsche Großstädte wie München oder Berlin typisch?', answer: 'In Top-Lagen der Metropolen lagen die Faktoren in den letzten Jahren oft bei 30 bis 38, während in soliden Mittelstädten Faktoren von 18 bis 24 üblich sind.' }
    ]
  }
};
