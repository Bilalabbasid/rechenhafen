import { CalcContent } from './types';

export const BUSINESS_CONTENT: Record<string, CalcContent> = {
  'marge-rechner': {
    intro: 'Dieser Margenrechner unterscheidet strikt zwischen Handelsspanne (Bruttomarge auf den Verkaufspreis) und dem prozentualen Kalkulationsaufschlag auf den Einkaufspreis.',
    details: 'Handelsspanne (Marge) = (Verkaufspreis - Einkaufspreis) / Verkaufspreis · 100. Kalkulationszuschlag = (Verkaufspreis - Einkaufspreis) / Einkaufspreis · 100. Ein Aufschlag von 100 % (Verdopplung) entspricht exakt einer Marge von 50 %.',
    faqs: [
      { question: 'Warum verwechseln viele Gründer Marge und Aufschlag?', answer: 'Weil die Euro-Differenz identisch ist, sich der Prozentsatz aber auf unterschiedliche Basen bezieht: 50 € Gewinn bei 100 € Einkaufspreis sind 50 % Aufschlag, aber nur 33,3 % Marge vom 150 € Verkaufspreis.' },
      { question: 'Was ist die Rohertragsmarge (Gross Profit Margin)?', answer: 'Der prozentuale Anteil des Umsatzerlöses, der nach Abzug der direkten Herstellungskosten (COGS) zur Deckung der Fixkosten verbleibt.' }
    ]
  },
  'mwst-rechner': {
    intro: 'Dieser Mehrwertsteuerrechner ermittelt Vorsteuer, Umsatzsteuer und Nettobeträge für den regulären Steuersatz von 19 % und den ermäßigten Satz von 7 % nach § 12 UStG.',
    details: 'Aus Brutto zu Netto: Netto = Brutto / 1,19 (bei 19 %) bzw. Brutto / 1,07 (bei 7 %). Niemals darf man 19 % vom Bruttobetrag abziehen, da die 19 % auf den 100-Prozent-Nettobetrag aufgeschlagen wurden (19/119 ≈ 15,966 %).',
    faqs: [
      { question: 'Welche Produkte unterliegen in Deutschland dem ermäßigten Steuersatz von 7 %?', answer: 'Grundnahrungsmittel (Milch, Brot, Fleisch, Gemüse), Bücher, Zeitungen, Fahrkarten im Nahverkehr und Übernachtungen in Hotels.' },
      { question: 'Was ist der Unterschied zwischen Vorsteuer und Umsatzsteuer?', answer: 'Umsatzsteuer nimmt der Unternehmer von seinen Kunden ein; Vorsteuer zahlt er selbst auf Einkäufe an andere Firmen; an das Finanzamt wird nur die Zahllast (Umsatzsteuer minus Vorsteuer) überwiesen.' }
    ]
  },
  'break-even-rechner': {
    intro: 'Die Gewinnschwellenanalyse (Break-Even-Point) berechnet die exakte Absatzmenge und den Mindestumsatz, ab dem ein Unternehmen alle Fixkosten und variablen Kosten deckt.',
    details: 'Break-Even-Menge = Fixkosten / Deckungsbeitrag pro Stück (Verkaufspreis - variable Stückkosten). Jedes darüber hinaus verkaufte Stück erwirtschaftet reinen Unternehmensgewinn.',
    faqs: [
      { question: 'Wie kann man den Break-Even-Point senken?', answer: 'Durch Senkung der fixen Gemeinkosten (Miete, Gehälter), Verhandlung günstigerer Einkaufspreise (Senkung variabler Kosten) oder Preiserhöhungen beim Verkaufspreis.' },
      { question: 'Was ist die Sicherheitsmarge (Margin of Safety)?', answer: 'Der prozentuale Puffer, um den der aktuelle Absatz einbrechen darf, bevor das Unternehmen in die Verlustzone rutscht: (Ist-Umsatz - Break-Even-Umsatz) / Ist-Umsatz · 100.' }
    ]
  },
  rabattrechner: {
    intro: 'Dieser Rabattrechner ermittelt den reduzierten Endpreis, die absolute Ersparnis in Euro und kumulierte Staffelrabatte im Handel.',
    details: 'Endpreis = Ausgangspreis · (1 - Rabattprozentsatz / 100). Bei aufeinanderfolgenden Rabatten (z. B. 20 % Sale plus 10 % Treuerabatt) werden die Prozente multiplikativ verknüpft: 0,80 · 0,90 = 0,72 (Gesamtrabatt: 28 %).',
    faqs: [
      { question: 'Warum schadet übermäßiges Rabattieren der Marge überproportional?', answer: 'Bei 20 % Marge vernichtet ein Preisnachlass von 10 % genau die Hälfte des gesamten Gewinns: Um denselben Deckungsbeitrag zu erzielen, muss der Absatz verdoppelt werden.' },
      { question: 'Was ist ein Naturalrabatt (Zugabe oder Draufgabe)?', answer: 'Bei Draufgabe erhält der Kunde bei Kauf von z. B. 10 Stück 2 Stück kostenlos dazu; bei Zugabe erhält er 10 Stück, zahlt aber nur 8 (entspricht rechnerisch 20 % Rabatt).' }
    ]
  },
  skontorechner: {
    intro: 'Skonto ist ein prozentualer Preisnachlass (meist 2 bis 3 Prozent), den Lieferanten für eine vorfristige Rechnungsbegleichung (z. B. innerhalb von 10 bis 14 Tagen) gewähren.',
    details: 'Zahlbetrag = Rechnungsbruttobetrag · (1 - Skontosatz / 100). Das Ziehen von Skonto entspricht auf das Jahr hochgerechnet oft einer extrem lukrativen Rendite von über 30 bis 50 Prozent p.a.',
    faqs: [
      { question: 'Darf man Skonto vom Brutto- oder Nettobetrag abziehen?', answer: 'In der kaufmännischen Praxis wird Skonto vom Bruttorechnungsbetrag abgezogen; buchhalterisch mindert das Skonto nachträglich auch die abzugsfähige Vorsteuer anteilig.' },
      { question: 'Lohnt es sich, für das Skontoziehen den Kontokorrentkredit (Dispo) zu nutzen?', answer: 'Fast immer ja! Die Skontoersparnis (oft 2–3 % für 20 Tage Fristvorteil) entspricht rechnerisch einem Jahreszins von 36–54 %; der Kontokorrentkredit kostet meist nur 9–14 % Zinsen p.a.' }
    ]
  },
  'deckungsbeitrag-rechner': {
    intro: 'Der Deckungsbeitrag (DB) ist der Geldbetrag, der nach Abzug der variablen Kosten vom Umsatzerlös zur Deckung der fixen Unternehmenskosten verbleibt.',
    details: 'Deckungsbeitrag I = Umsatzerlöse - variable Kosten. Deckungsbeitrag in % (Deckungsbeitragsquote) = (DB / Umsatz) · 100. Produkte mit negativem Deckungsbeitrag verursachen bei jedem Verkauf Verluste und müssen eliminiert werden.',
    faqs: [
      { question: 'Was ist die mehrstufige Deckungsbeitragsrechnung?', answer: 'Sie spaltet die Fixkosten hierarchisch auf: Zuerst Erzeugnisfixkosten, dann Produktgruppenfixkosten, Bereichsfixkosten und schließlich Unternehmensfixkosten, um echte Verlustbringer aufzudecken.' },
      { question: 'Was bedeutet die absolute Preisuntergrenze?', answer: 'Die kurzfristige Preisuntergrenze entspricht genau den variablen Stückkosten (DB = 0); zu diesem Preis darf ein Zusatzauftrag bei freien Kapazitäten kurzfristig angenommen werden.' }
    ]
  },
  'roas-rechner': {
    intro: 'Der Return on Advertising Spend (ROAS) misst die Rentabilität bezahlter Werbekampagnen (Google Ads, Meta Ads) im E-Commerce und Online-Marketing.',
    details: 'ROAS = (Durch Werbung generierter Bruttoumsatz / Werbekosten) · 100. Ein ROAS von 400 % bedeutet, dass jeder investierte Werbeeuro 4,00 Euro Umsatz generiert.',
    faqs: [
      { question: 'Was ist der Break-Even-ROAS?', answer: 'Der Mindest-ROAS, ab dem die Kampagne nach Abzug der Wareneinsatzkosten profitabel ist: Break-Even-ROAS = 1 / Bruttomarge (bei 25 % Marge liegt der Break-Even-ROAS bei 400 %).' },
      { question: 'Was unterscheidet ROAS von ROI?', answer: 'Der ROAS betrachtet isoliert den generierten Umsatz im Verhältnis zum reinen Ad-Spend; der ROI bezieht alle Kosten (Wareneinsatz, Personal, Software) ein und misst den tatsächlichen Nettogewinn.' }
    ]
  },
  'roi-rechner': {
    intro: 'Der Return on Investment (ROI nach dem DuPont-Kennzahlensystem) misst die Gesamtkapitalrentabilität einer Investition oder unternehmerischen Maßnahme.',
    details: 'ROI = (Nettogewinn der Investition / Gesamte Investitionskosten) · 100 = Umsatzrentabilität · Kapitalumschlag. Ein positiver ROI signalisiert echten Kapitalzuwachs.',
    faqs: [
      { question: 'Welcher ROI gilt in der Industrie als benchmarkfähig?', answer: 'In der produzierenden Industrie wird häufig ein ROI von mindestens 12 bis 15 Prozent angestrebt, um Kapitalkosten (WACC) zu übertreffen und Risiken abzudecken.' },
      { question: 'Welche Schwachstelle hat die statische ROI-Betrachtung?', answer: 'Sie ignoriert den zeitlichen Anfall der Zahlungsströme (Zeitwert des Geldes); für mehrjährige Großprojekte ist die dynamische Kapitalwertmethode (NPV) vorzuziehen.' }
    ]
  },
  'ebit-ebitda-rechner': {
    intro: 'EBIT (operatives Betriebsergebnis) und EBITDA (Ergebnis vor Zinsen, Steuern und Abschreibungen) messen die reine Ertragskraft des operativen Kerngeschäfts.',
    details: 'EBIT = Jahresüberschuss + Ertragsteuern + Finanzergebnis. EBITDA = EBIT + Abschreibungen auf Sachanlagen (Depreciation) + Abschreibungen auf immaterielle Vermögensgegenstände (Amortization).',
    faqs: [
      { question: 'Warum schätzen internationale Investoren das EBITDA so sehr?', answer: 'Weil es die operative Ertragskraft unabhängig von nationalen Steuersystemen, Finanzierungsstrukturen (Fremdkapitalanteil) und willkürlichen Abschreibungsmethoden vergleichbar macht.' },
      { question: 'Was ist das Problem beim EBITDA?', answer: 'Es ignoriert reale Reinvestitionskosten: Maschinen und Software veralten und müssen zwingend ersetzt werden (Warren Buffett bezeichnet EBITDA daher oft als geschönte Größe).' }
    ]
  },
  'cashflow-rechner': {
    intro: 'Der operative Cashflow (Mittelzufluss aus laufender Geschäftstätigkeit) beziffert die tatsächliche Innenfinanzierungskraft und Liquiditätsgenerierung eines Unternehmens.',
    details: 'Praktikerkennzahl (indirekte Methode): Jahresüberschuss + Abschreibungen + Zuführung zu Rückstellungen = Cashflow. Der Cashflow kann durch buchhalterische Gestaltungstricks kaum manipuliert werden ("Profit is an opinion, cash is a fact").',
    faqs: [
      { question: 'Was ist der Free Cashflow (FCF)?', answer: 'Der freie Cashflow ist der operative Cashflow abzüglich der notwendigen Investitionen in Sachanlagen (CapEx); dieses Geld steht frei für Dividendenzahlungen oder Schuldentilgung bereit.' },
      { question: 'Kann ein hochprofitables Unternehmen mit positivem Gewinn insolvent werden?', answer: 'Ja, wenn die Gewinne nur auf dem Papier in offenen Kundenforderungen (Forderungen aus L.u.L.) gebunden sind, aber kein reales Geld auf dem Bankkonto zur Begleichung fälliger Gehälter vorhanden ist.' }
    ]
  },
  'liquiditaetsgrad-rechner': {
    intro: 'Die Liquiditätsgrade (1., 2. und 3. Grades) analysieren die Fähigkeit eines Unternehmens, seinen kurzfristigen Zahlungsverpflichtungen jederzeit pünktlich nachzukommen.',
    details: 'Barliquidität (1. Grad, Cash Ratio) = Flüssige Mittel / kurzfristige Verbindlichkeiten (Ziel: 20–30 %). Einzugsbedingte Liquidität (2. Grad, Quick Ratio) = (Flüssige Mittel + Forderungen) / Verbindlichkeiten (Ziel: 100–120 %).',
    faqs: [
      { question: 'Was misst die Current Ratio (Liquidität 3. Grades)?', answer: 'Current Ratio = Gesamtes Umlaufvermögen (inkl. Vorräte) / kurzfristige Verbindlichkeiten; sie sollte mindestens 150 bis 200 Prozent betragen.' },
      { question: 'Warum zählt man das Warenlager beim Quick Ratio (2. Grad) nicht mit?', answer: 'Weil Vorräte und Rohstoffe nicht sofort zu Geld gemacht werden können und bei Notverkäufen erhebliche Wertabschläge drohen.' }
    ]
  },
  'working-capital-rechner': {
    intro: 'Das Net Working Capital (Nettoumlaufvermögen) ist das zinslos gebundene Betriebskapital, das die laufende Produktion und Lieferfähigkeit finanziert.',
    details: 'Formel: Working Capital = Umlaufvermögen - kurzfristige unverzinsliche Verbindlichkeiten. Ein positives Working Capital signalisiert, dass das Umlaufvermögen die kurzfristigen Schulden übersteigt und Liquiditätssicherheit besteht.',
    faqs: [
      { question: 'Kann ein negatives Working Capital auch vorteilhaft sein?', answer: 'Ja, bei Geschäftsmodellen wie Discountern oder E-Commerce (z. B. Amazon): Kunden zahlen sofort bar oder per Kreditkarte, während Lieferanten erst nach 60 bis 90 Tagen bezahlt werden (Lieferantenkredit finanziert das Wachstum).' },
      { question: 'Wie optimiert man das Working Capital (Working Capital Management)?', answer: 'Durch stringentes Mahnwesen (kürzere Zahlungsziele für Kunden), Just-in-Time-Lagerhaltung (geringere Vorräte) und Verhandlung längerer Zahlungsziele bei Lieferanten.' }
    ]
  },
  'umsatzrentabilitaet-rechner': {
    intro: 'Die Umsatzrentabilität (Umsatzrendite / Return on Sales, ROS) beziffert den Gewinnanteil, den ein Unternehmen mit jedem umgesetzten Euro erwirtschaftet.',
    details: 'ROS = (Jahresüberschuss / Umsatzerlöse) · 100. Eine Umsatzrendite von 8 % bedeutet, dass nach Begleichung aller Material-, Personal-, Verwaltungs- und Steuerkosten von 100 € Umsatz genau 8 € Reingewinn verbleiben.',
    faqs: [
      { question: 'Welche Branchen haben traditionell niedrige, welche hohe Umsatzrenditen?', answer: 'Der Lebensmitteleinzelhandel operiert oft mit extrem niedrigen Margen von 1,5 bis 3 Prozent (hohe Umschlagshäufigkeit); Software- und Pharmaunternehmen erzielen oft 20 bis 35 Prozent Umsatzrendite.' },
      { question: 'Was ist die operative Umsatzrendite (EBIT-Marge)?', answer: 'EBIT / Umsatz · 100; sie misst die reine operative Leistung vor Zinsaufwendungen und Steuern.' }
    ]
  },
  'eigenkapitalrentabilitaet-rechner': {
    intro: 'Die Eigenkapitalrentabilität (Return on Equity, ROE) misst die Verzinsung des von den Unternehmensinhabern bzw. Aktionären eingesetzten Eigenkapitals.',
    details: 'ROE = (Jahresüberschuss / Eigenkapital) · 100. Liegt der ROE dauerhaft unter dem Zinssatz für sichere Bundesanleihen, lohnt sich das unternehmerische Risiko für die Anteilseigner betriebswirtschaftlich nicht.',
    faqs: [
      { question: 'Wie kann ein Unternehmen seine Eigenkapitalrendite künstlich aufblähen?', answer: 'Über den Leverage-Effekt: Durch Aufnahme von billigem Fremdkapital wird die Eigenkapitalbasis verkleinert; dies steigert den ROE, erhöht aber gleichzeitig das Insolvenzrisiko massiv.' },
      { question: 'Welcher ROE gilt für gesunde Mittelständler als solide?', answer: 'Werte zwischen 10 und 18 Prozent gelten im deutschen Mittelstand als solide und krisenfest.' }
    ]
  },
  'gesamtkapitalrentabilitaet-rechner': {
    intro: 'Die Gesamtkapitalrentabilität (Return on Assets, ROA) misst die Effizienz, mit der das gesamte im Unternehmen arbeitende Kapital (Eigen- und Fremdkapital) eingesetzt wird.',
    details: 'ROA = [(Jahresüberschuss + Fremdkapitalzinsen) / Gesamtkapital (Bilanzsumme)] · 100. Die Fremdkapitalzinsen werden hinzuaddiert, da sie die Ertragsleistung des Fremdkapitals darstellen.',
    faqs: [
      { question: 'Warum werden die Fremdkapitalzinsen zum Gewinn hinzuaddiert?', answer: 'Weil die Gesamtkapitalrentabilität messen soll, wie produktiv das gesamte Vermögen gewirtschaftet hat, unabhängig davon, ob es von Banken oder Aktionären finanziert wurde.' },
      { question: 'Welche Bedingung muss für einen positiven Hebeleffekt (Leverage) gelten?', answer: 'Die Gesamtkapitalrentabilität muss zwingend höher sein als der Fremdkapitalzinssatz; liegt sie darunter, vernichtet jede Kreditaufnahme Eigenkapital (negativer Leverage).' }
    ]
  },
  'kundengewinnungskosten-cac-rechner': {
    intro: 'Die Customer Acquisition Cost (CAC) beziffern die durchschnittlichen Gesamtvertriebs- und Marketingkosten zur Gewinnung eines einzigen neuen zahlenden Kunden.',
    details: 'CAC = (Gesamte Marketing- und Vertriebsausgaben inklusive Gehälter) / Anzahl der Neukunden. Wichtig: Die Kosten müssen alle Werbebudgets, Gehälter der Sales-Mitarbeiter und CRM-Softwarelizenzen einschließen.',
    faqs: [
      { question: 'In welchem Verhältnis sollten CAC und Customer Lifetime Value (CLV) stehen?', answer: 'Die goldene Faustregel im SaaS- und Digitalbusiness lautet: CLV zu CAC sollte mindestens 3:1 betragen; liegt das Verhältnis unter 1:1, verbrennt das Unternehmen mit jedem Neukunden Geld.' },
      { question: 'Was ist die CAC Payback Period?', answer: 'Die Zeitspanne in Monaten, die ein Kunde benötigt, um über seine Bruttomargenbeiträge die für ihn aufgewendeten Akquisitionskosten vollständig zu refinanzieren (ideal: < 12 Monate).' }
    ]
  },
  'customer-lifetime-value-clv-rechner': {
    intro: 'Der Customer Lifetime Value (CLV) prognostiziert den kumulierten Deckungsbeitrag, den ein Kunde über die gesamte Dauer seiner Kundenbeziehung für das Unternehmen generiert.',
    details: 'CLV = Durchschnittlicher Bestellwert · Kauffrequenz pro Jahr · Kundenlebensdauer in Jahren · Bruttomarge in %. Bei Abomodellen: (Monatlicher Deckungsbeitrag pro Kunde) / Churn-Rate.',
    faqs: [
      { question: 'Warum ist Kundenbindung fast immer günstiger als Neukundengewinnung?', answer: 'Bestehende Kunden haben bereits Vertrauen gefasst, verursachen keine erneuten Akquisekosten, kaufen oft häufiger und reagieren weniger preissensibel auf Upgrades.' },
      { question: 'Wie beeinflusst die Kündigungsquote (Churn) den CLV?', answer: 'Eine Halbierung der Churn-Rate verdoppelt die durchschnittliche Kundenlebensdauer und verdoppelt damit direkt den gesamten Customer Lifetime Value.' }
    ]
  },
  'churn-rate-rechner': {
    intro: 'Die Churn-Rate (Kundenabwanderungsquote) beziffert den prozentualen Verlust von Abonnenten oder Kunden innerhalb eines festgelegten Abrechnungszeitraums.',
    details: 'Churn-Rate = (Verlorene Kunden während der Periode / Kundenbestand zu Periodenbeginn) · 100. Eine monatliche Churn-Rate von 5 % bedeutet, dass über das Jahr gerechnet fast die Hälfte des Kundenstamms ersetzt werden muss.',
    faqs: [
      { question: 'Was ist der Unterschied zwischen Customer Churn und Revenue Churn?', answer: 'Customer Churn misst die Anzahl der abgesprungenen Kunden; Revenue Churn misst den verlorenen monatlich wiederkehrenden Umsatz (MRR); durch Upgrades bestehender Kunden kann Net Revenue Churn sogar negativ sein (starkes Wachstum!).' },
      { question: 'Was ist eine gesunde Churn-Rate im B2B-SaaS-Bereich?', answer: 'Im Enterprise-B2B-Sektor gilt eine jährliche Churn-Rate von unter 5 bis 7 Prozent als hervorragend; im B2C-Geschäft liegen Monats-Churn-Raten oft bei 3 bis 7 Prozent.' }
    ]
  },
  'lead-conversion-rate-rechner': {
    intro: 'Die Lead Conversion Rate misst den prozentualen Anteil von Interessenten (Leads), die zu aktiven Käufern oder Vertragsabschlüssen konvertiert werden.',
    details: 'Conversion Rate = (Erfolgreiche Abschlüsse / Gesamtzahl der generierten Leads) · 100. Die Conversion Rate analysiert Schwachstellen in den einzelnen Stufen des Marketing- und Vertriebs-Funnels.',
    faqs: [
      { question: 'Welche Conversion Rates sind im deutschen E-Commerce typisch?', answer: 'Die durchschnittliche E-Commerce-Conversion-Rate im Online-Handel liegt in Deutschland bei ca. 1,5 bis 3,0 Prozent aller Website-Besucher.' },
      { question: 'Wie lässt sich die Conversion Rate im Checkout optimieren?', answer: 'Durch Anbieten beliebter lokaler Bezahlmethoden (PayPal, Klarna, Kauf auf Rechnung), Verzicht auf erzwungene Kundenkonto-Registrierung (Gast-Checkout) und transparente Versandkosten.' }
    ]
  },
  'abschreibung-linear-degressiv-rechner': {
    intro: 'Dieser AfA-Rechner kalkuliert die steuerliche Abschreibung betrieblicher Wirtschaftsgüter nach den amtlichen AfA-Tabellen des Bundesfinanzministeriums.',
    details: 'Lineare AfA = Anschaffungskosten / Nutzungsdauer in Jahren. Degressive AfA (nach § 7 Abs. 2 EStG bei befristeter Zulassung) wendet einen festen Prozentsatz auf den jeweiligen Restbuchwert an; der Wechsel zur linearen AfA erfolgt, sobald die lineare Rest-AfA höher ausfällt.',
    faqs: [
      { question: 'Was sind geringwertige Wirtschaftsgüter (GWG nach § 6 Abs. 2 EStG)?', answer: 'Bewegliche, selbstständig nutzbare Wirtschaftsgüter bis zu 800 Euro Netto-Anschaffungskosten können im Jahr der Anschaffung sofort zu 100 % als Betriebsausgabe voll abgeschrieben werden.' },
      { question: 'Wie lang ist die offizielle Nutzungsdauer eines Laptops für die Steuer?', answer: 'Nach dem BMF-Schreiben von 2021 können Computer, Laptops und Software steuerlich über eine betriebsgewöhnliche Nutzungsdauer von nur 1 Jahr voll abgeschrieben werden.' }
    ]
  },
  'skonto-jahreszins-rechner': {
    intro: 'Dieser Zinsrechner ermittelt den effektiven Jahreszinssatz, der sich hinter einer Skontovereinbarung (z. B. 2 % Skonto bei Zahlung binnen 10 Tagen statt 30 Tagen netto) verbirgt.',
    details: 'Effektiver Jahreszins ≈ [Skontosatz / (100 - Skontosatz)] · [360 / (Nettozahlungsziel - Skontofrist)]. Ein Skonto von 2 % bei 20 Tagen Fristvorteil entspricht einem atemberaubenden Jahreszins von über 36,7 Prozent!',
    faqs: [
      { question: 'Warum gewähren Lieferanten so teures Skonto?', answer: 'Weil Lieferanten dadurch sofortige Liquidität erhalten, Mahnverfahren und Ausfallrisiken (Delkredere) drastisch reduzieren und Buchhaltungskosten sparen.' },
      { question: 'Was sollte man tun, wenn die Bank keine Kreditlinie für Skonto gewährt?', answer: 'Verhandeln Sie mit der Hausbank: Banken finanzieren Skontolinien gerne, da sie die wirtschaftliche Rentabilität für das Unternehmen unmittelbar einsehen.' }
    ]
  },
  'wareneinsatzquote-rechner': {
    intro: 'Die Wareneinsatzquote (Cost of Goods Sold Ratio, COGS-Quote) beziffert das prozentuale Verhältnis der eingekauften Rohstoffe und Handelswaren zum Umsatzerlös.',
    details: 'Wareneinsatzquote = (Wareneinsatz / Umsatzerlöse) · 100. In der Gastronomie gilt traditionell die Faustformel: Wareneinsatz ca. 25 bis 30 %, Personalkosten ca. 30 bis 35 %, Gemeinkosten ca. 20 bis 25 %, Gewinnmarge ca. 10 %.',
    faqs: [
      { question: 'Wie berechnet man den Wareneinsatz der Periode?', answer: 'Anfangsbestand an Vorräten + Wareneinkäufe der Periode - Endbestand laut Inventur = tatsächlicher Wareneinsatz.' },
      { question: 'Was signalisiert ein plötzlicher Anstieg der Wareneinsatzquote?', answer: 'Steigende Einkaufspreise der Lieferanten, erhöhten Verderb/Bruch, Diebstahl im Lager oder verdeckte Rabatte beim Verkauf.' }
    ]
  },
  'lagerumschlagshaeufigkeit-rechner': {
    intro: 'Die Lagerumschlagshäufigkeit misst, wie oft der durchschnittliche Lagerbestand innerhalb eines Geschäftsjahres vollständig verkauft und ersetzt wird.',
    details: 'Umschlagshäufigkeit = Wareneinsatz / durchschnittlicher Lagerbestand zu Einstandspreisen. Durchschnittliche Lagerdauer in Tagen = 360 / Lagerumschlagshäufigkeit.',
    faqs: [
      { question: 'Welche Vorteile hat eine hohe Lagerumschlagshäufigkeit?', answer: 'Geringere Kapitalbindung im Lager, niedrigere Lagerhaltungs- und Versicherungskosten, geringeres Risiko von Veralterung, Verderb und Abschreibungen auf Ladenhüter.' },
      { question: 'Welche Gefahr birgt ein zu schneller Lagerumschlag?', answer: 'Die Gefahr von Lieferengpässen (Stockouts): Wenn Sicherheitsbestände zu knapp bemessen sind, führen minimale Lieferverzögerungen sofort zu Umsatzausfällen.' }
    ]
  },
  'stundensatz-kalkulation-freiberufler-rechner': {
    intro: 'Dieser betriebswirtschaftliche Stundensatzkalkulator ermittelt den erforderlichen Netto-Verrechnungssatz pro Stunde für Freiberufler, Berater und Agenturen.',
    details: 'Kalkulation: (Privater Lebensunterhalt + Vorsorgeaufwand + betriebliche Fixkosten + Risikogewinnaufschlag) / (Verfügbare Jahresarbeitstage · fakturierbare Stunden pro Tag).',
    faqs: [
      { question: 'Wie viele Stunden pro Tag kann ein Dienstleister durchschnittlich fakturieren?', answer: 'In der Realität selten mehr als 5 bis 6 Stunden pro Tag; die restliche Zeit entfällt zwingend auf Akquise, Kundenberatung, Buchhaltung, Weiterbildung und Büroorganisation.' },
      { question: 'Warum führt die Formel "Gehalt durch 160 Stunden" bei Selbstständigen in den Ruin?', answer: 'Weil sie ignoriert, dass Selbstständige keinen Arbeitgeberzuschuss zur Kranken- und Rentenversicherung erhalten, Urlaub und Feiertage unbezahlt sind und administrative Zeiten nicht abgerechnet werden können.' }
    ]
  }
};
