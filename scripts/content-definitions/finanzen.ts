import { CalcContent } from './types';

export const FINANZEN_CONTENT: Record<string, CalcContent> = {
  zinseszinsrechner: {
    intro: 'Der Zinseszinseffekt beschreibt das exponentielle Vermögenswachstum, wenn erwirtschaftete Zinsen oder Dividenden wiederangelegt werden und in den Folgejahren selbst Erträge abwerfen.',
    details: 'Die finanzmathematische Zinseszinsformel lautet Kn = K0 · (1 + p/100)^n. Über lange Zeithorizonte von 20 oder 30 Jahren übersteigt der kumulierte Zinsertrag bei soliden Marktrenditen häufig die Summe aller selbst eingezahlten Sparbeiträge.',
    faqs: [
      { question: 'Was ist die 72er-Regel für den Zinseszins?', answer: 'Teilt man 72 durch den jährlichen Zinssatz, erhält man näherungsweise die Jahre bis zur Verdopplung des Kapitals (z. B. bei 6 % p.a.: 72 / 6 = 12 Jahre).' },
      { question: 'Wie wirkt sich die Häufigkeit der Zinsgutschrift aus?', answer: 'Je häufiger Zinsen gutgeschrieben werden (monatlich oder quartalsweise statt jährlich), desto schneller entfaltet der Zinseszins seine Wirkung (effektiver Jahreszins steigt leicht).' }
    ]
  },
  'etf-sparplan-rechner': {
    intro: 'Ein breit diversifizierter ETF-Sparplan (z. B. auf den MSCI World oder FTSE All-World) ermöglicht langfristigen Vermögensaufbau über regelmäßige monatliche Sparraten.',
    details: 'Der Rechner berücksichtigt die Gesamtkostenquote (TER), erwartete Marktrenditen und den Cost-Average-Effekt. Bei historisch langfristigen Aktienmarktrenditen von real ca. 6 bis 8 % p.a. bildet der Sparplan einen Kernbaustein der privaten Altersvorsorge.',
    faqs: [
      { question: 'Was bedeutet die Gesamtkostenquote (TER)?', answer: 'Die Total Expense Ratio (TER) beziffert die laufenden jährlichen Fondskosten (Management, Verwaltung), die direkt dem Fondsvermögen entnommen werden (typisch 0,07 % bis 0,25 % bei Standard-ETFs).' },
      { question: 'Gilt bei ETFs die steuerliche Teilfreistellung?', answer: 'Ja, nach § 20 InvStG sind bei Aktienfonds mit mindestens 51 % Aktienquote 30 Prozent aller Gewinne und Ausschüttungen von der Abgeltungsteuer freigestellt.' }
    ]
  },
  sparrechner: {
    intro: 'Dieser Sparrechner simuliert planbaren Kapitalaufbau mit festem Anfangsvermögen und regelmäßigen monatlichen Einzahlungen.',
    details: 'Die Berechnung trennt übersichtlich zwischen den reinen Eigenleistungen (Summe aller Einzahlungen) und den durch Zinsen erwirtschafteten Erträgen.',
    faqs: [
      { question: 'Warum ist ein früher Sparbeginn so wirksam?', answer: 'Weil die Zinseszins-Kurve exponentiell verläuft: Die letzten 10 Jahre eines 30-jährigen Sparplans bringen oft mehr Zinsertrag als die ersten 20 Jahre zusammen.' },
      { question: 'Sollte man Sparraten dynamisch anpassen?', answer: 'Ja, eine jährliche Dynamisierung der Sparrate um z. B. 2 bis 3 Prozent gleicht den schleichenden Kaufkraftverlust der Einzahlungsbeträge durch Inflation aus.' }
    ]
  },
  sparzielrechner: {
    intro: 'Dieser Rechner ermittelt die exakte monatliche Sparrate, die Sie bei gegebener Anlagedauer und Rendite investieren müssen, um ein fest definiertes Vermögensziel zu erreichen.',
    details: 'Die Berechnung basiert auf der finanzmathematischen Rentenbarwert- bzw. Rentenendwertrechnung. Wer beispielsweise in 10 Jahren 50.000 € Eigenkapital aufbauen möchte, benötigt bei 5 % Rendite eine Monatsrate von rund 322 €.',
    faqs: [
      { question: 'Wie beeinflusst die Anlagedauer die nötige Monatsrate?', answer: 'Eine Verdopplung der Ansparzeit senkt die nötige Sparrate meist um mehr als die Hälfte, da der Zinseszins über längere Zeiträume einen immer größeren Teil des Kapitals selbst erwirtschaftet.' },
      { question: 'Was passiert, wenn die tatsächliche Rendite niedriger ausfällt?', answer: 'Bleibt die Rendite unter den Erwartungen, muss entweder die monatliche Sparrate nachjustiert oder die Laufzeit um einige Monate verlängert werden.' }
    ]
  },
  inflationsrechner: {
    intro: 'Die Inflation misst die prozentuale Teuerung von Waren und Dienstleistungen anhand des Verbraucherpreisindex (VPI) des Statistischen Bundesamtes.',
    details: 'Formel für künftige Preise: Endpreis = Startpreis · (1 + Inflation/100)^Jahre. Bei einer durchschnittlichen Inflation von 2,5 % pro Jahr verdoppeln sich die Lebenshaltungskosten in knapp 29 Jahren.',
    faqs: [
      { question: 'Was ist der Unterschied zwischen gefühlter und statistischer Inflation?', answer: 'Der offizielle VPI basiert auf einem repräsentativen Warenkorb. Produkte des täglichen Bedarfs (Lebensmittel, Energie), die häufig gekauft werden, prägen die gefühlte Inflation stärker als langlebige Güter.' },
      { question: 'Wie schützt man sein Erspartes vor Inflation?', answer: 'Sachwerte wie Aktien, ETFs und Immobilien bieten langfristig historisch den besten Schutz, da Unternehmensgewinne und Mieten tendenziell mit den Preisen steigen.' }
    ]
  },
  renditerechner: {
    intro: 'Die Gesamtrendite (Total Return) beziffert den jährlichen prozentualen Anlageerfolg unter Einbeziehung von Kursgewinnen, Dividenden, Zinsen und Kosten.',
    details: 'Man unterscheidet zwischen der einfachen Nominalrendite und der jährlichen geometrischen Rendite (CAGR = Compound Annual Growth Rate): CAGR = (Endwert / Anfangswert)^(1 / Jahre) - 1.',
    faqs: [
      { question: 'Warum ist die durchschnittliche arithmetische Rendite irreführend?', answer: 'Macht ein Portfolio im ersten Jahr +100 % und im zweiten Jahr -50 %, ist der arithmetische Durchschnitt +25 %, das reale Kapital liegt jedoch wieder exakt beim Ausgangswert (reale CAGR = 0 %).' },
      { question: 'Was ist der Unterschied zwischen Brutto- und Nettorendite?', answer: 'Die Bruttorendite ignoriert Steuern und Handelskosten; erst die Nettorendite nach Abzug von Abgeltungsteuer, Solidaritätszuschlag und Depotgebühren zeigt den echten Zuwachs.' }
    ]
  },
  'notgroschen-rechner': {
    intro: 'Ein solider Notgroschen schützt Sie vor teuren Dispokrediten oder dem vorzeitigen Notverkauf von Wertpapieren bei unvorhergesehenen Ausgaben.',
    details: 'Verbraucherzentralen empfehlen eine liquide Rücklage von 3 bis 6 monatlichen Netto-Lebenshaltungskosten (Fixkosten plus Mindest-Lebensbedarf), sicher geparkt auf einem täglich verfügbaren Tagesgeldkonto.',
    faqs: [
      { question: 'Gehören Notgroschen-Gelder in ETFs oder Aktien?', answer: 'Nein, der Notgroschen muss zu 100 % vor Kursschwankungen geschützt und innerhalb von 1–2 Werktagen uneingeschränkt verfügbar sein (Tagesgeld).' },
      { question: 'Wann reichen 3 Monatsausgaben, wann braucht man 6?', answer: 'Angestellte mit Kündigungsschutz und gesichertem Einkommen genügen oft 3 Monatsausgaben; Selbstständige, Freiberufler oder Familien mit Eigenheim und älteren Autos sollten 6 Monatsausgaben vorhalten.' }
    ]
  },
  'tagesgeld-rechner': {
    intro: 'Tagesgeld bietet tägliche Verfügbarkeit bei voller Einlagensicherung bis 100.000 € je Kunde und Bank nach EU-Recht.',
    details: 'Zinsertrag = Anlagebetrag · (Zinssatz / 100) · (Tage / 360) nach deutscher Zinsmethode. Bei vierteljährlicher oder monatlicher Zinsgutschrift entsteht ein spürbarer Zinseszinseffekt.',
    faqs: [
      { question: 'Wie sicher ist Tagesgeld bei Banken in der EU?', answer: 'Über die gesetzliche Einlagensicherung (EdB in Deutschland) sind Einlagen bis 100.000 € pro Person und Kreditinstitut gesetzlich garantiert abgesichert.' },
      { question: 'Was ist der Unterschied zwischen Aktionszins und Bestandskundenzins?', answer: 'Banken locken Neukunden oft mit zeitlich befristeten Zinsgarantien (z. B. für 3 bis 6 Monate); danach fällt der Zins auf das variable Niveau für Bestandskunden zurück.' }
    ]
  },
  'festgeld-rechner': {
    intro: 'Festgeld garantiert einen festen Zinssatz über eine fest vereinbarte Laufzeit (z. B. 6, 12, 24 oder 36 Monate) ohne Zinsänderungsrisiko.',
    details: 'Da das Kapital während der Laufzeit unkündbar gebunden ist, belohnen Banken Festgeld typischerweise mit planbaren Zinsen, die unabhängig von EZB-Zinssenkungen konstant bleiben.',
    faqs: [
      { question: 'Kann man ein Festgeldkonto vor Ablauf der Laufzeit vorzeitig kündigen?', answer: 'Grundsätzlich nein. Nur in extremen Härtefällen (§ 314 BGB) stimmen Banken einer vorzeitigen Auflösung zu, meist unter vollständigem Verlust aller aufgelaufenen Zinsen.' },
      { question: 'Was ist die Festgeld-Treppen-Strategie?', answer: 'Man teilt das Sparvermögen auf mehrere Festgelder mit gestaffelten Laufzeiten (1, 2, 3 Jahre) auf; so wird jedes Jahr ein Teilbetrag fällig und liquide wiederanlegbar.' }
    ]
  },
  'sparziel-rechner': {
    intro: 'Dieser Rechner veranschaulicht, welches Endkapital bei einer vorgegebenen monatlichen Sparrate unter dem Einfluss von Anlagedauer und Zinseszins entsteht.',
    details: 'Er verdeutlicht, wie durch das Zusammenspiel von monatlichen Einzahlungen und Rendite auch moderate Sparraten über Jahrzehnte zu substanziellem Vermögen anwachsen.',
    faqs: [
      { question: 'Was bringt ein Sparplan von nur 50 € im Monat?', answer: 'Bei 7 % Jahresrendite über 30 Jahre wachsen 50 € monatlich (18.000 € Einzahlung) auf rund 61.000 € an – mehr als das Dreifache der Einzahlungen.' },
      { question: 'Wann sollte man die Sparrate reduzieren oder erhöhen?', answer: 'Bei Gehaltserhöhungen empfiehlt es sich, mindestens 50 % des Gehaltsplus dauerhaft in den Sparplan umzuleiten (Lifestyle-Inflation vermeiden).' }
    ]
  },
  'kaufkraftverlust-rechner': {
    intro: 'Der Kaufkraftverlust berechnet, wie viel ein heute vorhandener Geldbetrag bei gegebener Inflationsrate in Zukunft real noch wert sein wird.',
    details: 'Kaufkraft = Nominalbetrag / (1 + Inflation/100)^Jahre. Bei 3 % Inflation sinkt die reale Kaufkraft von 10.000 € nach 10 Jahren auf ca. 7.441 € und nach 20 Jahren auf rund 5.537 €.',
    faqs: [
      { question: 'Warum verliert Bargeld auf dem Girokonto kontinuierlich an Wert?', answer: 'Weil ein unverzinstes Girokonto keine Erträge abwirft, während steigende Konsumentenpreise dafür sorgen, dass man für denselben Euro-Betrag jedes Jahr weniger Güter kaufen kann.' },
      { question: 'Wie gleicht man den Kaufkraftverlust bei der Altersvorsorge aus?', answer: 'Indem man die künftig benötigte Rentensumme um die erwartete Teuerungsrate erhöht oder gezielt in ertragsstarke Anlageklassen investiert.' }
    ]
  },
  'realzins-rechner': {
    intro: 'Der Realzins drückt den tatsächlichen Vermögenszuwachs nach Bereinigung um die Inflationsrate aus (Fisher-Gleichung).',
    details: 'Exakte Formel: (1 + Nominalzins) / (1 + Inflation) - 1. Näherungsweise gilt: Realzins ≈ Nominalzins - Inflationsrate. Liegt der Sparzins bei 3 % und die Inflation bei 4 %, ist der Realzins mit ca. -1 % negativ.',
    faqs: [
      { question: 'Was bedeutet finanzielle Repression?', answer: 'Ein Zustand, in dem die Zinsen für sichere Sparanlagen bewusst dauerhaft unterhalb der Inflationsrate gehalten werden, sodass Sparer real schleichend entwertet werden.' },
      { question: 'Kann der Realzins auch positiv sein?', answer: 'Ja, sobald der Zinsertrag oder die Rendite einer Geldanlage die laufende Teuerungsrate übersteigt, wächst das reale Vermögen (Kaufkraftzuwachs).' }
    ]
  },
  'dividendenrendite-rechner': {
    intro: 'Die Dividendenrendite misst die laufende Ausschüttung einer Aktie bezogen auf ihren aktuellen Börsenkurs.',
    details: 'Dividendenrendite = (Dividende je Aktie / Aktienkurs) · 100. Eine Aktie mit 3 € Dividende bei 60 € Kurs hat eine Dividendenrendite von 5,0 %. Reinvestierte Dividenden tragen historisch maßgeblich zum Gesamterfolg von Aktienportfolios bei.',
    faqs: [
      { question: 'Wann wird die Dividende in Deutschland ausgezahlt?', answer: 'Bei deutschen Aktiengesellschaften (AG) wird die Dividende einmal jährlich am dritten Werktag nach der ordentlichen Hauptversammlung (§ 58 Abs. 4 AktG) gutgeschrieben.' },
      { question: 'Ist eine extrem hohe Dividendenrendite immer ein gutes Zeichen?', answer: 'Nicht zwingend: Eine ungewöhnlich hohe Dividendenrendite (> 8 %) entsteht oft durch einen drastischen Kurseinbruch der Aktie wegen operativer Krisen, was Vorbote einer Dividendenkürzung sein kann.' }
    ]
  },
  'ewige-rente-rechner': {
    intro: 'Die ewige Rente bezeichnet eine Auszahlungsform, bei der das Grundkapital unberührt bleibt und die Auszahlungen ausschließlich aus den Zinsen oder Dividenden bestritten werden.',
    details: 'Formel: Notwendiges Kapital = Jährliche Wunschrente / (Zinssatz / 100). Um beispielsweise bei 4 % Ertrag jährlich 24.000 € (2.000 € monatlich) ewig zu entnehmen, wird ein Kapitalstock von 600.000 € benötigt.',
    faqs: [
      { question: 'Berücksichtigt die klassische ewige Rente die Inflation?', answer: 'Die Basisformel ignoriert die Inflation. Um den realen Auszahlungsbetrag kaufkraftbereinigt konstant zu halten, muss die Entnahmerate um die Inflationsrate gekürzt werden (Netto-Kapitalerhalt).' },
      { question: 'Welche Ertragsquellen eignen sich für eine ewige Rente?', answer: 'Breit gestreute Dividenden-ETFs, Mietüberschüsse aus schuldenfreien Immobilien sowie Anleihekupons.' }
    ]
  },
  'finanzielle-freiheit-rechner': {
    intro: 'Dieser FIRE-Rechner (Financial Independence, Retire Early) kalkuliert das Zielvermögen, ab dem Erträge aus dem Kapitalstock die gesamten Lebenshaltungskosten decken.',
    details: 'Basierend auf der Trinity-Studie gilt eine sichere Entnahmerate (Safe Withdrawal Rate, SWR) von 3,5 bis 4,0 Prozent p.a. Das FIRE-Vermögen entspricht dem 25- bis 28-Fachen der jährlichen Gesamtausgaben.',
    faqs: [
      { question: 'Was besagt die bekannte 4-Prozent-Regel?', answer: 'Wer im ersten Ruhestandsjahr 4 % seines Aktien/Anleihen-Portfolios entnimmt und den Betrag in den Folgejahren inflationsbereinigt anpasst, hatte in den letzten 100 Jahren eine 95-prozentige Wahrscheinlichkeit, dass das Geld 30 Jahre lang reichte.' },
      { question: 'Was ist Lean-FIRE vs. Fat-FIRE?', answer: 'Lean-FIRE zielt auf finanzielle Freiheit bei sehr sparsamem Lebensstil ab; Fat-FIRE kalkuliert mit großzügigen Budgets von 4.000 € oder mehr pro Monat im Ruhestand.' }
    ]
  },
  'freistellungsauftrag-rechner': {
    intro: 'Mit dem Freistellungsauftrag schöpfen Sparer und Anleger den gesetzlichen Sparer-Pauschbetrag aus, um Kapitalerträge ohne Steuerabzug zu erhalten.',
    details: 'Nach § 20 Abs. 9 EStG beträgt der Sparer-Pauschbetrag 1.000 € für Alleinstehende und 2.000 € für zusammenveranlagte Ehegatten. Ersparnis: Bis zu 263,75 € (Single) bzw. 527,50 € (Verheiratete) pro Jahr.',
    faqs: [
      { question: 'Kann man den Freistellungsauftrag auf mehrere Banken aufteilen?', answer: 'Ja, Sie können Ihren Freibetrag beliebig auf verschiedene Banken und Broker verteilen, solange die Gesamtsumme 1.000 € bzw. 2.000 € nicht übersteigt.' },
      { question: 'Was passiert, wenn man keinen Freistellungsauftrag erteilt hat?', answer: 'Die Bank führt 25 % Abgeltungsteuer plus Solidaritätszuschlag automatisch an das Finanzamt ab. Sie können sich das Geld über die Anlage KAP der Einkommensteuererklärung zurückholen.' }
    ]
  },
  'kapitalertragsteuer-rechner': {
    intro: 'Die Abgeltungsteuer auf Kapitalerträge (Zinsen, Dividenden, realisierte Kursgewinne) beträgt in Deutschland pauschal 25 Prozent zuzüglich Solidaritätszuschlag und Kirchensteuer.',
    details: 'Der reguläre Steuersatz beträgt 26,375 % (25 % Abgeltungsteuer + 5,5 % Soli darauf). Bei Kirchensteuerpflicht sinkt die Abgeltungsteuerformel leicht auf 24,45 % (bei 9 % KiSt in Bayern/Baden-Württemberg: 24,51 %).',
    faqs: [
      { question: 'Wann lohnt sich die Günstigerprüfung in der Steuererklärung?', answer: 'Wenn Ihr persönlicher Grenzsteuersatz unter 25 % liegt (zu versteuerndes Einkommen unter ca. 20.000 €), werden Kapitalerträge mit Ihrem niedrigeren individuellen Tarif besteuert.' },
      { question: 'Werden Verluste aus Aktienverkäufen mit Zinserträgen verrechnet?', answer: 'Nein, nach deutschem Steuerrecht (§ 20 Abs. 6 EStG) dürfen Aktienverluste nur mit Gewinnen aus anderen Aktienverkäufen verrechnet werden (separater Verlustverrechnungstopf).' }
    ]
  },
  'depotgebuehren-rechner': {
    intro: 'Dieser Kostenrechner quantifiziert, wie stark prozentuale Depotgebühren, Orderkosten und Fonds-TER das Endvermögen über die Jahre schmälern.',
    details: 'Laufende Gebühren mindern nicht nur den unmittelbaren Barwert, sondern entziehen dem Depot kontinuierlich künftiges Zinseszins-Potenzial. 1 % Mehrkosten pro Jahr kann über 30 Jahre rund 25 % des Endkapitals vernichten.',
    faqs: [
      { question: 'Warum sind Neobroker oft so viel günstiger als Filialbanken?', answer: 'Moderne Neobroker verzichten auf Filialnetze, wickeln Orders rein digital ab und erhalten Rückvergütungen (Payment for Order Flow) von Handelsplätzen.' },
      { question: 'Wie wirken sich Ausgabeaufschläge bei aktiv gemanagten Fonds aus?', answer: 'Ein Ausgabeaufschlag von 5 % bedeutet, dass von 10.000 € Einzahlung nur 9.524 € investiert werden; der Fonds muss zunächst rund 5,3 % Rendite erwirtschaften, nur um die Anfangskosten auszugleichen.' }
    ]
  },
  'sparrate-rechner': {
    intro: 'Die Sparquote beziffert den prozentualen Anteil des Nettoeinkommens, der monatlich für Vermögensaufbau, Tilgung oder Altersvorsorge zurückgelegt wird.',
    details: 'Sparquote = (Monatliche Ersparnis / Nettoeinkommen) · 100. Während der Bundesdurchschnitt in Deutschland bei rund 10–11 % liegt, streben FIRE-Anhänger Quoten von 30 bis 60 % an.',
    faqs: [
      { question: 'Zählt die Tilgung eines Immobilienkredits zur Sparrate?', answer: 'Ja, der reine Tilgungsanteil der monatlichen Kreditrate baut Nettovermögen auf und zählt zur Ersparnis; der Zinsanteil hingegen ist Aufwand (Wohnkosten).' },
      { question: 'Wie viel Prozent seines Gehalts sollte man mindestens sparen?', answer: 'Finanzexperten empfehlen als Faustregel die 50/30/20-Regel: 50 % für Fixkosten, 30 % für Freizeit und Konsum, mindestens 20 % für Sparen und Vermögensaufbau.' }
    ]
  },
  'liquiditaetsreserve-rechner': {
    intro: 'Die Liquiditätsreserve ermittelt den optimalen Puffer auf Giro- und Tagesgeldkonten zur Abdeckung fixer Zahlungsverpflichtungen und kurzfristiger Risiken.',
    details: 'Zur Berechnung werden alle regelmäßigen Fixkosten (Miete, Versicherungen, Kredite, Abos) erfasst. Eine gesunde Reserve verhindert teure Rücklastschriften und Verzugszinsen.',
    faqs: [
      { question: 'Wie viel Geld sollte maximal auf dem Girokonto verbleiben?', answer: 'Empfohlen wird ein Puffer von 1 bis 1,5 Monatsgehältern auf dem Girokonto; alle darüber hinausgehenden Beträge gehören aufs verzinste Tagesgeld oder in Anlageprodukte.' },
      { question: 'Warum schadet eine zu große Liquiditätsreserve dem Vermögensaufbau?', answer: 'Überschüssige Barbestände unterliegen der Cash-Drag: Das Geld verliert real durch Inflation an Kaufkraft, statt an den Ertragschancen der Kapitalmärkte teilzuhaben.' }
    ]
  },
  'verdopplungszeit-rechner': {
    intro: 'Die Verdopplungszeit beziffert die exakte Dauer in Jahren, bis sich eine Kapitalanlage bei konstanter jährlicher Rendite verdoppelt.',
    details: 'Exakte Formel: t = ln(2) / ln(1 + p/100). Bei 7 % Jahresrendite verdoppelt sich das Kapital nach ca. 10,24 Jahren. Bei 3 % Zinsen dauert es hingegen rund 23,45 Jahre.',
    faqs: [
      { question: 'Wie präzise ist die 72er-Faustformel?', answer: 'Sehr präzise im Bereich von 4 % bis 10 % Rendite: Bei 8 % ergibt 72 / 8 = 9,0 Jahre (exakter Wert: 9,01 Jahre).' },
      { question: 'Wie lange dauert eine Vervierfachung des Kapitals?', answer: 'Genau zwei Verdopplungszyklen: Bei 7 % Rendite vervierfacht sich das Startkapital nach rund 20,5 Jahren.' }
    ]
  },
  'thesaurierend-vs-ausschuettend-rechner': {
    intro: 'Dieser Rechner vergleicht die Steuer- und Vermögensentwicklung von wiederanlegenden (thesaurierenden) und auszahlenden (ausschüttenden) Investmentfonds.',
    details: 'Seit der Investmentsteuerreform 2018 unterliegen thesaurierende Fonds der jährlichen Vorabpauschale nach dem Basiszins der Bundesbank. Ausschütter nutzen den Sparer-Pauschbetrag durch direkte Dividendenzahlungen oft einfacher aus.',
    faqs: [
      { question: 'Was ist die Vorabpauschale bei thesaurierenden ETFs?', answer: 'Eine fiktive Mindestertragsbesteuerung zu Jahresbeginn: Sie errechnet sich aus Basisertrag (70 % des Basiszinses × Portfoliowert) abzüglich tatsächlicher Ausschüttungen, gedeckelt auf den tatsächlichen Wertzuwachs.' },
      { question: 'Wann lohnt sich ein ausschüttender ETF mehr als ein Thesaurierer?', answer: 'Solange der Sparer-Pauschbetrag (1.000 € / 2.000 €) noch nicht anderweitig voll ausgeschöpft ist, lassen sich Dividenden bis zu dieser Grenze steuerfrei vereinnahmen und sofort wiederanlegen.' }
    ]
  },
  'rentenluecke-rechner': {
    intro: 'Die Rentenlücke ist die Differenz zwischen Ihrem gewünschten Nettoeinkommen im Ruhestand und der voraussichtlichen gesetzlichen Nettorente.',
    details: 'Die gesetzliche Rente liegt für Standardrentner (Eckrentner mit 45 Beitragsjahren) vor Steuern bei rund 48 Prozent des Durchschnittsentgelts. Nach Abzug von Kranken- und Pflegeversicherungsbeiträgen (ca. 11–12 %) und Einkommensteuer verbleibt eine erhebliche Deckungslücke.',
    faqs: [
      { question: 'Wie viel Prozent des letzten Nettoeinkommens benötigt man im Ruhestand?', answer: 'Finanzplaner kalkulieren in der Regel mit 75 bis 85 Prozent des letzten Nettoeinkommens, da Berufsaufwendungen (Pendeln, Arbeitskleidung) entfallen, aber Gesundheits- und Freizeitkosten steigen können.' },
      { question: 'Wird die gesetzliche Rente in voller Höhe versteuert?', answer: 'Für Neurentner steigt der Besteuerungsanteil der Rente jährlich schrittweise an; ab dem Jahrgang 2058 (bzw. nach geplanten Reformen 2040) wird die Rente zu 100 % der Einkommensteuer unterliegen.' }
    ]
  },
  'gold-rendite-rechner': {
    intro: 'Gold dient seit Jahrtausenden als Wertspeicher und Absicherung gegen Währungskrisen, wirft jedoch selbst weder Zinsen noch Dividenden ab.',
    details: 'Gewinne aus physischem Gold (Münzen, Barren) sind in Deutschland nach § 23 Abs. 1 Nr. 2 EStG nach einer Haltedauer von mehr als einem Jahr vollkommen steuerfrei (keine Abgeltungsteuer).',
    faqs: [
      { question: 'Gilt die Steuerfreiheit nach 1 Jahr auch für Gold-ETCs wie Xetra-Gold oder Euwax Gold?', answer: 'Ja, nach ständiger BFH-Rechtsprechung sind physisch hinterlegte Gold-Inhaberschuldverschreibungen mit Lieferanspruch nach 1 Jahr Haltedauer steuerfrei veräußerbar.' },
      { question: 'Wie hoch sind die typischen Ankauf-Verkauf-Spannen (Spread) bei Goldmünzen?', answer: 'Bei gängigen 1-Unzen-Anlagemünzen (Krügerrand, Maple Leaf) liegt der Spread oft bei 2 bis 4 %; bei kleinen Stückelungen (1 Gramm) kann er über 15 % betragen.' }
    ]
  },
  'kirchensteuer-rechner': {
    intro: 'Die Kirchensteuer wird in Deutschland als Zuschlag zur Einkommensteuer von den Finanzämtern für die anerkannten Religionsgemeinschaften erhoben.',
    details: 'Der Kirchensteuersatz beträgt in Bayern und Baden-Württemberg 8 Prozent, in allen übrigen 14 Bundesländern 9 Prozent der festgesetzten Einkommensteuer. Kirchensteuer kann in der Steuererklärung unbegrenzt als Sonderausgabe abgesetzt werden (§ 10 Abs. 1 Nr. 4 EStG).',
    faqs: [
      { question: 'Wird die Kirchensteuer vom Bruttoeinkommen oder von der Steuer berechnet?', answer: 'Die Kirchensteuer bemisst sich nicht nach dem Bruttoeinkommen, sondern ist ein prozentualer Zuschlag (8 % bzw. 9 %) auf die tatsächlich zu zahlende Einkommensteuer.' },
      { question: 'Gibt es eine Obergrenze bei der Kirchensteuer (Kappung)?', answer: 'Ja, viele Landeskirchen bieten auf Antrag eine Kappung an: Die Kirchensteuer wird dann auf 2,75 % bis 3,5 % des zu versteuernden Einkommens begrenzt, was Spitzenverdienern zugutekommt.' }
    ]
  }
};
