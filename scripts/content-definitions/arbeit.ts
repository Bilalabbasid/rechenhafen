import { CalcContent } from './types';

export const ARBEIT_CONTENT: Record<string, CalcContent> = {
  stundenlohnrechner: {
    intro: 'Kennen Sie Ihren wahren Stundenlohn? Dieser Rechner ermittelt nach der in Deutschland arbeitsrechtlich maßgeblichen Quartalsformel Ihren genauen Stundenverdienst.',
    details: 'Da Monate unterschiedlich viele Tage haben, darf man das Monatsgehalt nicht einfach durch 4 Wochen teilen (ein Monat hat im Schnitt 4,33 Wochen). Gesetzliche Formel: Stundenlohn = (Monatsgehalt · 3 Monate) / (13 Wochen · Wochenstunden).',
    faqs: [
      { question: 'Wie viele Arbeitsstunden hat ein Monat im Durchschnitt bei 40 Stunden?', answer: 'Bei einer 40-Stunden-Woche hat ein Monat im Jahresdurchschnitt genau 173,33 Arbeitsstunden (40 × 13 / 3).' },
      { question: 'Wie hoch ist der gesetzliche Mindestlohn in Deutschland?', answer: 'In Deutschland gilt das Mindestlohngesetz (MiLoG); der gesetzliche Mindestlohn wird regelmäßig durch die Mindestlohnkommission überprüft und angepasst.' }
    ]
  },
  'teilzeit-gehaltsrechner': {
    intro: 'Planen Sie den Umstieg auf eine 4-Tage-Woche oder eine Reduzierung Ihrer Wochenarbeitszeit? Mit diesem Rechner sehen Sie sofort Ihr neues Bruttoeinkommen.',
    details: 'Durch die Steuerprogression fällt das Nettogehalt bei einer Reduzierung oft prozentual deutlich weniger stark ab als das Bruttogehalt. Neues Brutto = Vollzeitgehalt · (Teilzeitstunden / Vollzeitstunden).',
    faqs: [
      { question: 'Habe ich einen gesetzlichen Anspruch auf Teilzeit?', answer: 'Ja, nach § 8 TzBfG haben Arbeitnehmer in Betrieben mit mehr als 15 Beschäftigten nach sechsmonatiger Betriebszugehörigkeit einen Anspruch auf Reduzierung der Arbeitszeit, sofern keine dringenden betrieblichen Gründe entgegenstehen.' },
      { question: 'Was ist die Brückenteilzeit nach § 9a TzBfG?', answer: 'Das Recht, die Arbeitszeit für einen im Voraus bestimmten Zeitraum von einem bis fünf Jahren zu verringern und danach automatisch zur ursprünglichen Vollzeit zurückzukehren.' }
    ]
  },
  'gehaltserhoehung-rechner': {
    intro: 'Gehen Sie optimal vorbereitet in Ihre nächste Gehaltsverhandlung. Sehen Sie genau, wie viel eine Steigerung um 3 %, 5 % oder 8 % in Euro ausmacht.',
    details: 'Geben Sie auch Sonderzahlungen wie Urlaubs- oder Weihnachtsgeld ein, um das Jahresplus zu ermitteln. Bei Gehaltserhöhungen greift der persönliche Grenzsteuersatz, weshalb vom Bruttozuwachs netto meist 50 bis 60 % ankommen.',
    faqs: [
      { question: 'Wie viel Prozent Gehaltserhöhung sind in Verhandlungen üblich?', answer: 'Bei normalen Leistungsbeurteilungen sind in Deutschland 3 % bis 5 % üblich. Bei einem Wechsel der Position, Beförderung oder erweiterten Aufgaben sind 8 % bis 15 % verhandelbar.' },
      { question: 'Was bedeutet die kalte Progression?', answer: 'Steigt das Bruttogehalt nur um die Inflationsrate, rutscht man durch den progressiven Steuertarif in einen höheren Steuersatz, sodass die reale Kaufkraft trotz Lohnerhöhung sinken kann.' }
    ]
  },
  'urlaubstage-rechner': {
    intro: 'Wie viele Urlaubstage stehen Ihnen zu, wenn Sie nicht an allen 5 Tagen der Woche arbeiten? Entscheidend ist allein die Anzahl der Tage, an denen Sie arbeiten – nicht die Stundenzahl.',
    details: 'Der Rechner ermittelt Ihren Anspruch nach der offiziellen Formel des Bundesurlaubsgesetzes (§ 3 BUrlG): Urlaubstage = Vereinbarte Jahresurlaubstage · (Tatsächliche Arbeitstage pro Woche / Reguläre Wochenarbeitstage).',
    faqs: [
      { question: 'Habe ich bei Teilzeit weniger Wochen Urlaub?', answer: 'Nein! Wer z.B. 3 Tage pro Woche arbeitet und 18 Urlaubstage hat, kann genauso 6 ganze Wochen Urlaub nehmen wie ein Vollzeitmitarbeiter mit 30 Urlaubstagen bei einer 5-Tage-Woche (30/5 = 6 Wochen; 18/3 = 6 Wochen).' },
      { question: 'Wie hoch ist der gesetzliche Mindesturlaub in Deutschland?', answer: 'Nach § 3 BUrlG beträgt der Mindesturlaub 24 Werktage bei einer 6-Tage-Woche bzw. 20 Arbeitstage bei einer 5-Tage-Woche (entspricht jeweils 4 vollen Kalenderwochen).' }
    ]
  },
  'kurzarbeitergeld-rechner': {
    intro: 'Das Kurzarbeitergeld (KUG nach § 105 SGB III) gleicht Verdienstausfälle aus, wenn in Betrieben vorübergehend und unvermeidbar die Arbeitszeit reduziert werden muss.',
    details: 'Die Bundesagentur für Arbeit zahlt 60 Prozent des pauschalierten Nettoentgelts für die ausgefallenen Arbeitsstunden; für Arbeitnehmer mit mindestens einem kindergeldberechtigten Kind erhöht sich der Satz auf 67 Prozent.',
    faqs: [
      { question: 'Werden während der Kurzarbeit Sozialversicherungsbeiträge fällig?', answer: 'Ja, für das tatsächlich erzielte Entgelt tragen Arbeitgeber und Arbeitnehmer die Beiträge normal; für den Ausfall zahlt der Arbeitgeber Beiträge auf Basis von 80 Prozent des ausgefallenen Entgelts.' },
      { question: 'Unterliegt das Kurzarbeitergeld dem Progressionsvorbehalt?', answer: 'Ja, Kurzarbeitergeld selbst ist steuerfrei, wird aber dem zu versteuernden Einkommen zur Ermittlung des Steuersatzes hinzugerechnet (§ 32b EStG); dies führt zur Abgabepflicht der Steuererklärung.' }
    ]
  },
  'abfindung-fuenftelregelung-rechner': {
    intro: 'Die steuerliche Fünftelregelung (§ 34 EStG) mildert die Progression ab, wenn eine Abfindung nach Beendigung des Arbeitsverhältnisses in einer Summe ausgezahlt wird.',
    details: 'Steuer = 5 · [Einkommensteuer(Reguläres Einkommen + Abfindung / 5) - Einkommensteuer(Reguläres Einkommen)]. Voraussetzung ist, dass es sich um eine echte Zusammenballung von Einkünften handelt.',
    faqs: [
      { question: 'Gibt es einen gesetzlichen Anspruch auf eine Abfindung bei Kündigung?', answer: 'Grundsätzlich nein; ein Anspruch besteht nur bei Vereinbarung im Aufhebungsvertrag, nach § 1a KSchG bei betriebsbedingter Kündigung oder im Rahmen eines gerichtlichen Vergleichs.' },
      { question: 'Wie hoch ist die übliche Regelabfindung nach Kündigungsschutzgesetz?', answer: 'Als Faustformel gilt nach § 1a Abs. 2 KSchG ein halbes Bruttomonatsgehalt pro vollem Beschäftigungsjahr (Faktor 0,5).' }
    ]
  },
  'minijob-midijob-rechner': {
    intro: 'Dieser Rechner ermittelt Abgaben und Nettobeträge im Minijob (bis 538 € monatlich) und im Übergangsbereich (Midijob von 538,01 € bis 2.000 €).',
    details: 'Im Minijob zahlt der Arbeitnehmer bei Befreiung von der Rentenversicherungspflicht keine Abgaben (538 € brutto = netto). Im Midijob steigen die Arbeitnehmer-Sozialabgaben gleitend von rund 12 % auf die regulären ca. 20 % an.',
    faqs: [
      { question: 'Lohnt sich die Befreiung von der Rentenversicherungspflicht im Minijob?', answer: 'Der Eigenanteil beträgt nur 3,6 % (ca. 19,37 € im Monat); dafür sichern Sie sich vollwertige Beitragsmonate für Reha-Ansprüche, Erwerbsminderungsrente und frühere Altersrenten.' },
      { question: 'Wie viele Stunden darf man im Minijob beim gesetzlichen Mindestlohn arbeiten?', answer: 'Teilen Sie die Minijob-Grenze durch den Mindestlohn: Bei 538 € und z. B. 12,82 € Mindestlohn liegt die Höchstarbeitszeit bei knapp 42 Stunden pro Kalendermonat.' }
    ]
  },
  'arbeitgeberanteil-sozialversicherung-rechner': {
    intro: 'Die Lohnnebenkosten (Arbeitgeberbrutto) erfassen alle gesetzlichen Sozialversicherungsbeiträge und Umlagen, die der Arbeitgeber zusätzlich zum Bruttolohn trägt.',
    details: 'Zu den rund 20–21 % Arbeitgeberanteil (Kranken-, Pflege-, Renten- und Arbeitslosenversicherung) kommen die Umlagen U1 (Lohnfortzahlung bei Krankheit), U2 (Mutterschutz), U3 (Insolvenzgeld) und der Unfallversicherungsbeitrag zur Berufsgenossenschaft.',
    faqs: [
      { question: 'Wie viel kostet ein Mitarbeiter den Arbeitgeber insgesamt?', answer: 'Als Faustregel gilt: Das Arbeitgeberbrutto liegt ca. 20 bis 23 Prozent über dem vereinbarten Bruttogehalt des Mitarbeiters.' },
      { question: 'Wer zahlt die Umlage U1?', answer: 'Nur Betriebe mit in der Regel nicht mehr als 30 Vollzeitbeschäftigten; größere Unternehmen tragen das Entgeltfortzahlungsrisiko im Krankheitsfall komplett selbst.' }
    ]
  },
  'kuendigungsfrist-arbeitnehmer-rechner': {
    intro: 'Die gesetzlichen Kündigungsfristen nach § 622 BGB staffeln sich für Arbeitgeber nach der Dauer der Betriebszugehörigkeit des Mitarbeiters.',
    details: 'Während der Probezeit (max. 6 Monate) gilt eine 2-Wochen-Frist zu jedem Tag. Für Arbeitnehmer beträgt die Grundkündigungsfrist 4 Wochen zum 15. oder zum Monatsende; für Arbeitgeber verlängert sie sich nach 2 Jahren auf 1 Monat und nach 20 Jahren auf bis zu 7 Monate zum Monatsende.',
    faqs: [
      { question: 'Gilt die verlängerte Kündigungsfrist automatisch auch für den Arbeitnehmer?', answer: 'Nein, nach § 622 Abs. 2 BGB gilt die Staffelung nur für Kündigungen durch den Arbeitgeber, es sei denn, im Arbeitsvertrag wurde ausdrücklich dieselbe Verlängerung für beide Seiten vereinbart.' },
      { question: 'Bis wann muss eine Kündigung zugehen?', answer: 'Die Kündigung muss dem Empfänger spätestens am letzten Tag vor Beginn der Kündigungsfrist nachweisbar zugegangen sein (Schriftformerfordernis mit Originalunterschrift, § 623 BGB).' }
    ]
  },
  'ueberstunden-auszahlung-rechner': {
    intro: 'Dieser Rechner ermittelt den Brutto- und Nettoauszahlungsbetrag für geleistete Überstunden inklusive vertraglicher Überstundenzuschläge.',
    details: 'Überstundenvergütung = Stundenlohn · Überstundenanzahl · (1 + Zuschlag in %). Überstundenvergütungen unterliegen als sonstiger Bezug in voller Höhe der Lohnsteuer und den Sozialversicherungsbeiträgen.',
    faqs: [
      { question: 'Darf der Arbeitgeber Überstunden mit dem Grundgehalt pauschal abgelten?', answer: 'Pauschale Klauseln wie "Überstunden sind mit dem Gehalt abgegolten" sind nach ständiger BAG-Rechtsprechung unwirksam, wenn keine genaue Obergrenze (z. B. bis zu 10 % der Monatsarbeitszeit) vereinbart ist.' },
      { question: 'Sind Zuschläge für Überstunden steuerfrei?', answer: 'Reine Mehrarbeitszuschläge sind voll steuerpflichtig; nur Zuschläge für tatsächliche Sonntags-, Feiertags- oder Nachtarbeit sind nach § 3b EStG unter bestimmten Bedingungen steuerfrei.' }
    ]
  },
  'firmenwagen-geldwerter-vorteil-rechner': {
    intro: 'Dieser Rechner quantifiziert die steuerlichen Auswirkungen der Dienstwagennutzung auf Ihr monatliches Nettoeinkommen.',
    details: 'Der geldwerte Vorteil (1-%-Regel plus 0,03 % pro Entfernungskilometer) erhöht das steuerpflichtige Bruttogehalt, wird nach Abzug der Steuern jedoch als Sachbezug wieder netto einbehalten.',
    faqs: [
      { question: 'Warum sinkt das monatliche Netto durch einen Firmenwagen?', answer: 'Weil Sie Steuern und Sozialabgaben auf den Sachbezug zahlen müssen, der Wagen selbst aber kein Bargeld ist, sondern Ihnen als Sachleistung zur Verfügung steht.' },
      { question: 'Kann man eigene Zuzahlungen zum Dienstwagen steuermindernd geltend machen?', answer: 'Ja, Eigenbeteiligungen an den Anschaffungskosten oder laufende monatliche Zuzahlungen zur Leasingrate mindern den zu versteuernden geldwerten Vorteil Euro für Euro.' }
    ]
  },
  'krankengeld-rechner': {
    intro: 'Das Krankengeld nach § 47 SGB V sichert Arbeitnehmer finanziell ab, wenn die 6-wöchige Entgeltfortzahlung des Arbeitgebers bei längerer Erkrankung ausläuft.',
    details: 'Das Krankengeld beträgt 70 Prozent des Bruttoentgelts, höchstens jedoch 90 Prozent des Nettoentgelts (gedeckelt auf die Beitragsbemessungsgrenze). Vom Bruttokrankengeld werden Beiträge zur Renten-, Arbeitslosen- und Pflegeversicherung abgezogen.',
    faqs: [
      { question: 'Wie lange zahlt die gesetzliche Krankenkasse Krankengeld?', answer: 'Krankengeld wird wegen derselben Krankheit für maximal 78 Wochen innerhalb eines Zeitraums von drei Jahren (Rahmenfrist) gezahlt (inklusive der 6 Wochen Lohnfortzahlung).' },
      { question: 'Unterliegt Krankengeld der Einkommensteuer?', answer: 'Krankengeld ist steuerfrei, unterliegt aber dem steuerlichen Progressionsvorbehalt (§ 32b EStG) und muss in der Einkommensteuererklärung deklariert werden.' }
    ]
  },
  'mutterschaftsgeld-rechner': {
    intro: 'Das Mutterschaftsgeld sichert das Einkommen werdender Mütter während der gesetzlichen Mutterschutzfristen (6 Wochen vor und 8 Wochen nach der Geburt).',
    details: 'Gesetzlich versicherte Arbeitnehmerinnen erhalten von der Krankenkasse maximal 13 Euro pro Kalendertag. Übersteigt der kalendertägliche Nettolohn 13 Euro, ist der Arbeitgeber nach § 20 MuSchG verpflichtet, den Differenzbetrag als Arbeitgeberzuschuss auszuzahlen.',
    faqs: [
      { question: 'Verlängert sich die Schutzfrist bei Früh- oder Mehrlingsgeburten?', answer: 'Ja, bei Mehrlings- und Frühgeburten verlängert sich die Mutterschutzfrist nach der Entbindung auf 12 Wochen.' },
      { question: 'Erhält der Arbeitgeber den Zuschuss zum Mutterschaftsgeld erstattet?', answer: 'Ja, über das U2-Umlageverfahren der gesetzlichen Krankenkassen erhält der Arbeitgeber den gezahlten Zuschuss zu 100 Prozent erstattet.' }
    ]
  },
  'elternzeit-teilzeit-rechner': {
    intro: 'Während der Elternzeit haben Arbeitnehmer nach § 15 BEEG einen Rechtsanspruch auf Teilzeitarbeit im Umfang von 24 bis maximal 32 Wochenstunden.',
    details: 'Dieser Rechner ermittelt den Teilzeitverdienst während der Elternzeit und kalkuliert eventuelle Anrechnungen auf das Basiselterngeld bzw. ElterngeldPlus.',
    faqs: [
      { question: 'Welche Elterngeld-Variante lohnt sich bei Teilzeit besonders?', answer: 'Das ElterngeldPlus: Es wurde speziell für Eltern geschaffen, die während des Elterngeldbezugs in Teilzeit arbeiten, und wird doppelt so lange ausgezahlt wie das Basiselterngeld.' },
      { question: 'Gilt während der Teilzeit in Elternzeit ein Kündigungsschutz?', answer: 'Ja, während der gesamten Elternzeit und der darin ausgeübten Teilzeitbeschäftigung besteht nach § 18 BEEG ein strikter gesetzlicher Sonderkündigungsschutz.' }
    ]
  },
  'sabbatical-rechner': {
    intro: 'Ein Sabbatical (berufliche Auszeit) lässt sich über ein Langzeitarbeitszeitkonto oder ein Teilzeitmodell mit Gehaltsverzicht sozialversichert finanzieren.',
    details: 'Modell: Sie arbeiten z. B. 2 Jahre lang Vollzeit (100 %), erhalten aber nur 75 % des Gehalts ausgezahlt; im 3. Jahr werden Sie für 8 Monate bezahlt freigestellt, während die Sozialversicherung lückenlos weiterläuft.',
    faqs: [
      { question: 'Bleibt man während eines Sabbaticals krankenversichert?', answer: 'Bei Nutzung eines Wertguthaben- oder Teilzeitmodells bleibt das Beschäftigungsverhältnis rechtlich bestehen; Kranken-, Pflege- und Rentenversicherung laufen uneingeschränkt weiter.' },
      { question: 'Was passiert bei einer unbezahlten Freistellung?', answer: 'Bei unbezahltem Urlaub endet der Sozialversicherungsschutz nach genau einem Monat (§ 7 Abs. 3 SGB IV); danach müssen Sie sich freiwillig gesetzlich oder privat krankenversichern.' }
    ]
  },
  'nachtzuschlag-sonntagszuschlag-rechner': {
    intro: 'Zuschläge für Nacht-, Sonntags- und Feiertagsarbeit sind nach § 3b EStG unter Einhaltung gesetzlicher Höchstgrenzen von der Lohnsteuer und den Sozialabgaben befreit.',
    details: 'Steuerfreie Höchstsätze bezogen auf den Grundlohn (max. 50 €/Std.): Nachtarbeit 25 % (zwischen 0:00 und 4:00 Uhr 40 %), Sonntagsarbeit 50 %, Feiertagsarbeit 125 % (an besonderen Feiertagen wie 1. Mai oder Weihnachten 150 %).',
    faqs: [
      { question: 'Ab welcher Uhrzeit gilt Arbeit als Nachtarbeit?', answer: 'Arbeitszeitrechtlich (§ 2 ArbZG) und steuerlich (§ 3b EStG) gilt die Zeit von 23:00 bis 06:00 Uhr (in Bäckereien ab 22:00 Uhr) als Nachtzeit.' },
      { question: 'Können Sonntags- und Nachtzuschläge gleichzeitig gezahlt werden?', answer: 'Ja, fallen Sonntags- und Nachtarbeit zusammen, dürfen beide steuerfreien Zuschläge nebeneinander gewährt werden (z. B. 50 % Sonntag + 25 % Nacht = 75 % steuerfrei).' }
    ]
  },
  'vermoegenswirksame-leistungen-rechner': {
    intro: 'Vermögenswirksame Leistungen (VL) sind freiwillige oder tarifliche Arbeitgeberzuschüsse von bis zu 40 Euro monatlich für Sparpläne oder Bausparen.',
    details: 'Liegt das zu versteuernde Einkommen unter den gesetzlichen Einkommensgrenzen (seit 2024 einheitlich 40.000 € für Singles und 80.000 € für Verheiratete), zahlt der Staat eine Arbeitnehmer-Sparzulage von 20 % auf Aktien-ETFs (max. 80 €/Jahr).',
    faqs: [
      { question: 'Kann man VL-Sparen auch ohne Arbeitgeberzuschuss nutzen?', answer: 'Ja, Sie können die 40 Euro monatlich aus eigenem Gehalt per Gehaltsumwandlung einzahlen und sich so die staatliche Sparzulage von 20 % sichern.' },
      { question: 'Welche Anlageformen sind für vermögenswirksame Leistungen zugelassen?', answer: 'Aktien- und ETF-Fondssparpläne (beste Renditechancen), Bausparverträge, Tilgung von Baukrediten oder betriebliche Sparformen.' }
    ]
  },
  'betriebliche-altersvorsorge-rechner': {
    intro: 'Die betriebliche Altersvorsorge (bAV via Direktversicherung) nutzt die Entgeltumwandlung aus dem Bruttogehalt zur Einsparung von Steuern und Sozialabgaben.',
    details: 'Seit 2022 müssen Arbeitgeber nach § 1a Abs. 1a BetrAVG einen verpflichtenden Zuschuss von 15 Prozent zur Entgeltumwandlung zahlen, wenn sie dadurch Sozialversicherungsbeiträge einsparen.',
    faqs: [
      { question: 'Bis zu welchem Betrag ist die Entgeltumwandlung abgabenfrei?', answer: 'Nach § 3 Nr. 63 EStG können jährlich bis zu 8 Prozent der Beitragsbemessungsgrenze der Rentenversicherung steuerfrei und bis zu 4 Prozent sozialversicherungsfrei eingezahlt werden.' },
      { question: 'Müssen bAV-Renten im Alter versteuert und verbeitragt werden?', answer: 'Ja, Betriebsrenten unterliegen der nachgelagerten vollen Einkommensteuer sowie den Beiträgen zur gesetzlichen Kranken- und Pflegeversicherung (nach Abzug des monatlichen Freibetrags).' }
    ]
  },
  'jahresgehalt-in-monatsgehalt-rechner': {
    intro: 'Dieser Umrechner schlüsselt das vertragliche Gesamtjahresgehalt unter Berücksichtigung von 12, 13 oder 14 Monatsgehältern und variablen Boni präzise auf.',
    details: 'Monatsgehalt = Jahresgehalt / Anzahl der Monatsgehälter. Wichtig für Gehaltsvergleiche: Ein scheinbar hohes Monatsgehalt bei 12 Zahlungen kann einem geringeren Grundgehalt mit Weihnachts- und Urlaubsgeld entsprechen.',
    faqs: [
      { question: 'Welcher Unterschied besteht zwischen Zielgehalt (OTE) und Fixgehalt?', answer: 'Das Fixgehalt ist garantiert; das Zielgehalt (On-Target Earnings) beinhaltet erfolgsabhängige Variablen und Provisionen, die nur bei 100-prozentiger Zielerreichung voll fließen.' },
      { question: 'Sind Sonderzahlungen wie Weihnachtsgeld pfändbar?', answer: 'Nach § 850a ZPO ist Weihnachtsgeld bis zur gesetzlichen Obergrenze (halber monatlicher Freibetrag) unpfändbar.' }
    ]
  },
  'brutto-stundensatz-freiberufler-rechner': {
    intro: 'Dieser Kalkulator ermittelt den kostendeckenden Mindeststundensatz für Selbstständige, Freelancer und Freiberufler.',
    details: 'Ein Freiberufler muss aus seinem Stundensatz alle privaten Ausgaben, Krankenversicherung (100 % allein!), Altersvorsorge, Betriebsausgaben, unbezahlte Urlaubs- und Krankheitstage sowie Akquisezeiten erwirtschaften. Formel: Stundensatz = Jahresgesamtkosten / abrechenbare Jahresstunden.',
    faqs: [
      { question: 'Wie viele Stunden im Jahr kann ein Freelancer tatsächlich abrechnen?', answer: 'Bei rund 220 Arbeitstagen und Abzug von Urlaub, Krankheit, Buchhaltung und Vertrieb können die meisten Freiberufler nur rund 1.000 bis 1.200 Stunden pro Jahr fakturieren.' },
      { question: 'Warum reicht ein Stundensatz von 50 Euro für Freelancer in Deutschland meist nicht aus?', answer: 'Nach Abzug von ca. 18 % Kranken/Pflegeversicherung, 20 % Altersvorsorge, Büro- und Softwarekosten sowie Einkommensteuer bleibt netto oft weniger als der Mindestlohn eines Festangestellten übrig.' }
    ]
  },
  'urlaubsabgeltung-rechner': {
    intro: 'Können Urlaubstage wegen Beendigung des Arbeitsverhältnisses (Kündigung, Fristablauf) nicht mehr genommen werden, sind sie nach § 7 Abs. 4 BUrlG finanziell abzugelten.',
    details: 'Berechnung nach § 11 BUrlG: Urlaubsabgeltung pro Tag = (Gesamtbruttoverdienst der letzten 13 Wochen / 65 Tage bei 5-Tage-Woche) · offene Resturlaubstage.',
    faqs: [
      { question: 'Darf der Arbeitgeber verlangen, dass der Urlaub vor dem Austritt genommen wird?', answer: 'Ja, der Arbeitgeber kann den Mitarbeiter unter Anrechnung auf die verbleibenden Urlaubstage unwiderruflich von der Arbeit freistellen; die Barabgeltung greift nur für unverbrauchte Tage.' },
      { question: 'Unterliegt die Urlaubsabgeltung der Steuer- und Sozialversicherungspflicht?', answer: 'Ja, als sonstiger Bezug wird die Urlaubsabgeltung wie ein Einmalbezug voll lohnsteuer- und beitragspflichtig abgerechnet.' }
    ]
  },
  'arbeitslosengeld-1-rechner': {
    intro: 'Das Arbeitslosengeld I (ALG I nach § 136 SGB III) sichert Beschäftigte nach unverschuldetem Arbeitsplatzverlust auf Basis ihres vorherigen Beitragslohns ab.',
    details: 'ALG I beträgt 60 Prozent des pauschalierten täglichen Nettoentgelts; für Arbeitslose mit mindestens einem Kind erhöht sich der Leistungssatz auf 67 Prozent. Voraussetzung ist die Erfüllung der Anwartschaftszeit (mind. 12 Monate versicherungspflichtige Beschäftigung in den letzten 30 Monaten).',
    faqs: [
      { question: 'Wie lange wird Arbeitslosengeld 1 gezahlt?', answer: 'Je nach Dauer der Beitragszahlung und Lebensalter: Unter 50 Jahren maximal 12 Monate; ab 58 Jahren bei mindestens 48 Beitragsmonaten bis zu maximal 24 Monate.' },
      { question: 'Wann droht eine 12-wöchige Sperrzeit beim ALG 1?', answer: 'Wenn das Beschäftigungsverhältnis durch eigene Kündigung oder Abschluss eines Aufhebungsvertrags ohne wichtigen Grund beendet wurde (§ 159 SGB III).' }
    ]
  },
  'buergergeld-anspruch-rechner': {
    intro: 'Das Bürgergeld (Grundsicherung für Arbeitsuchende nach dem SGB II) sichert das soziokulturelle Existenzminimum für erwerbsfähige Hilfebedürftige und ihre Familien.',
    details: 'Der Gesamtanspruch setzt sich aus dem monatlichen Regelbedarf (für Alleinstehende, Partner und Kinder) sowie den tatsächlichen, angemessenen Kosten der Unterkunft und Heizung (KdU) abzüglich anrechenbaren Einkommens und Vermögens zusammen.',
    faqs: [
      { question: 'Wie viel Schonvermögen ist beim Bürgergeld geschützt?', answer: 'In der einjährigen Karenzzeit gilt ein Schonvermögen von 40.000 € für die erste Person und 15.000 € für jede weitere Person; danach gilt ein Vermögensfreibetrag von 15.000 € pro Person.' },
      { question: 'Wie werden Einkommen aus Erwerbstätigkeit auf das Bürgergeld angerechnet?', answer: 'Die ersten 100 € sind voll anrechnungsfrei (Grundabsetzbetrag); darüber hinausgehende Erwerbseinkommen bleiben gestaffelt zu 20 bis 30 Prozent anrechnungsfrei (Erwerbstätigenfreibetrag).' }
    ]
  },
  'dienstjubilaeum-steuerfrei-rechner': {
    intro: 'Dieser Rechner ermittelt die steuerlichen und tariflichen Freibeträge bei Geldzuwendungen oder Geschenken anlässlich eines Betriebs- oder Dienstjubiläums.',
    details: 'Nach Wegfall des früheren Jubiläumsfreibetrags sind Barzuwendungen voll steuer- und sozialversicherungspflichtig, können aber unter bestimmten Voraussetzungen nach der Fünftelregelung (§ 34 EStG) als Vergütung für mehrjährige Tätigkeiten ermäßigt besteuert werden.',
    faqs: [
      { question: 'Können Sachgeschenke zum Dienstjubiläum steuerfrei übergeben werden?', answer: 'Ja, als Aufmerksamkeit zu einem persönlichen Ereignis können Sachgeschenke (kein Bargeld!) bis zu einem Wert von 60 Euro inklusive Mehrwertsteuer vollkommen steuerfrei gewährt werden (R 19.6 LStR).' },
      { question: 'Welche Jubiläen gelten nach Tarifverträgen (z. B. TVöD) als meilensteinfähig?', answer: 'Im öffentlichen Dienst und vielen Tarifverträgen sind 25-jährige und 40-jährige Dienstjubiläen mit tariflichen Jubiläumsgeldern und Sonderurlaubstagen hinterlegt.' }
    ]
  },
  'dienstaufwandsentschaedigung-rechner': {
    intro: 'Dieser Rechner kalkuliert steuerfreie Aufwandsentschädigungen für ehrenamtliche Tätigkeiten (Ehrenamtspauschale und Übungsleiterpauschale nach dem Einkommensteuergesetz).',
    details: 'Nach § 3 Nr. 26 EStG können Übungsleiter, Trainer und Ausbilder bis zu 3.000 Euro pro Kalenderjahr steuer- und sozialversicherungsfrei erhalten. Die allgemeine Ehrenamtspauschale nach § 3 Nr. 26a EStG beträgt bis zu 840 Euro jährlich.',
    faqs: [
      { question: 'Können Übungsleiterpauschale und Ehrenamtspauschale kombiniert werden?', answer: 'Ja, aber nur für unterschiedliche Tätigkeiten: Wer im selben Verein als Vorstand (Ehrenamt: bis 840 €) und als Jugendtrainer (Übungsleiter: bis 3.000 €) arbeitet, kann beide Freibeträge nebeneinander ausschöpfen.' },
      { question: 'Müssen Einnahmen unterhalb des Freibetrags in der Steuererklärung angegeben werden?', answer: 'Ja, sie gehören in die Anlage N oder S, werden dort jedoch über die Steuerbefreiung nach § 3 Nr. 26/26a EStG steuerlich wieder neutralisiert.' }
    ]
  }
};
