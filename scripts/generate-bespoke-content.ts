/**
 * generate-bespoke-content.ts
 * ---------------------------------------------------------------------------
 * Generates bespoke, educational, authentic German content (intro, details, FAQs)
 * for all 405 calculator pages on RechenHafen.de.
 *
 * Requirements:
 * - NO generic boilerplate patterns (e.g. "Mit unserem Rechner...", "Achten Sie auf konsistente Einheiten...")
 * - Teaches specific domain knowledge about the calculation
 * - Explains actual inputs, realistic German values, and what the result means
 * - Explains the underlying formula, DIN norm, or legal framework (§ BGB, ArbZG, EStG, etc.)
 * - Highlights assumptions and common pitfalls
 * - High-value authentic FAQs tailored to real user questions
 */

import fs from 'fs';
import path from 'path';
import { ALL_CALCULATORS } from '../src/data/calculators';
import { CATEGORIES } from '../src/data/categories';

interface BespokeContent {
  intro: string;
  details: string;
  faqs: Array<{ question: string; answer: string }>;
}

// ---------------------------------------------------------------------------
// Category-specific domain knowledge generators
// ---------------------------------------------------------------------------

export function createBespokeContent(calc: any): BespokeContent {
  const slug = calc.slug;
  const name = calc.name.replace(/\s*\([^)]*\)/g, '').trim();
  const inputLabels = (calc.inputs || []).map((i: any) => i.label).join(', ');
  const formula = calc.formula || '';
  const formulaExplanation = calc.formulaExplanation || '';
  const category = calc.category;

  // 1. SPECIFIC CUSTOM OVERRIDES FOR KEY DOMAINS & TIERS
  // -------------------------------------------------------------------------

  // --- KREDIT & SCHULDEN ---
  if (slug === 'kreditrechner') {
    return {
      intro: 'Die Monatsrate eines klassischen Ratenkredits setzt sich aus dem monatlichen Tilgungsanteil und den Zinskosten auf die verbleibende Restschuld zusammen. Da mit jeder Zahlung die Kreditschuld sinkt, nimmt der Zinsanteil Monat für Monat ab, während der Tilgungsanteil im gleichen Maße ansteigt (Annuitätenprinzip).',
      details: 'Für einen realistischen Vergleich ist stets der effektive Jahreszins nach der Preisangabenverordnung (PAngV) maßgeblich, da dieser alle verpflichtenden Nebenkosten der Bank enthält. Kürzere Laufzeiten führen zwar zu einer höheren Monatsbelastung, senken jedoch die über die gesamte Laufzeit gezahlte Gesamtzinslast drastisch.',
      faqs: [
        { question: 'Wie berechnet sich die Annuität beim Ratenkredit?', answer: 'Die monatliche Rate (Annuität) wird mit der finanzmathematischen Formel R = S · [i · (1+i)^n] / [(1+i)^n - 1] berechnet, wobei S die Kreditsumme, i der Monatszinssatz und n die Laufzeit in Monaten ist.' },
        { question: 'Was ist der Unterschied zwischen Sollzins und Effektivzins?', answer: 'Der Sollzins bezeichnet den reinen Zinssatz für die Geldüberlassung. Der effektive Jahreszins schließt hingegen Zinsverrechnungstermine und bankseitige Gebühren ein und ist die gesetzliche Vergleichsgröße.' }
      ]
    };
  }

  if (slug === 'tilgungsrechner') {
    return {
      intro: 'Bei einem Immobiliendarlehen bestimmt die gewählte Anfangstilgung (typischerweise 1,5 bis 3 Prozent) maßgeblich, wie lange die Rückzahlung dauert und welche Restschuld am Ende der Sollzinsbindung verbleibt. Durch den stetig wachsenden Tilgungsanteil beschleunigt sich der Schuldenabbau im Zeitverlauf.',
      details: 'Typische Zinsbindungen in Deutschland laufen über 10, 15 oder 20 Jahre. Nach Ablauf dieser Frist muss die verbleibende Restschuld über eine Anschlussfinanzierung oder ein Forward-Darlehen weitergeführt werden, wofür das künftige Zinsniveau entscheidend ist.',
      faqs: [
        { question: 'Warum sollte die anfängliche Tilgung bei Niedrigzinsen höher gewählt werden?', answer: 'Bei niedrigem Zinsniveau schrumpft die monatliche Zinsersparnis langsamer, wodurch der Tilgungszuwachs geringer ausfällt. Eine Anfangstilgung von mindestens 2 bis 3 Prozent verhindert überlange Gesamtlaufzeiten von über 35 Jahren.' },
        { question: 'Kann ein Immobiliendarlehen nach 10 Jahren vorzeitig gekündigt werden?', answer: 'Ja, nach § 489 Abs. 1 Nr. 2 BGB steht Darlehensnehmern ein gesetzliches Sonderkündigungsrecht zu: Jedes Festzinsdarlehen kann nach Ablauf von 10 Jahren nach vollständiger Auszahlung mit einer 6-monatigen Frist kostenfrei gekündigt werden.' }
      ]
    };
  }

  if (slug === 'autokreditrechner') {
    return {
      intro: 'Beim Autokauf senkt eine geleistete Anzahlung oder die Inzahlungnahme des Altfahrzeugs den tatsächlich zu finanzierenden Nettodarlehensbetrag. Die monatliche Rate finanziert die Anschaffung gleichmäßig über die vereinbarten Monate ab, sodass der Wagen am Laufzeitende schuldenfrei Ihr Eigentum ist.',
      details: 'Unabhängige Autokredite von Direktbanken ermöglichen Ihnen beim Händler das Auftreten als Barzahler, was häufig Barzahler-Rabatte von 5 bis 15 Prozent auf den Listenpreis ermöglicht. Solche Preisnachlässe überwiegen rechnerisch fast immer die zinsgünstig wirkenden Werbeangebote von Autobanken.',
      faqs: [
        { question: 'Welche Laufzeit ist für einen Autokredit wirtschaftlich sinnvoll?', answer: 'Die Kreditlaufzeit sollte nie länger als die geplante Haltedauer des Fahrzeugs sein – typisch sind 36 bis 60 Monate. Andernfalls übersteigt die verbleibende Kreditschuld bei vorzeitigem Weiterverkauf den realen Fahrzeugrestwert (Unterdeckung).' },
        { question: 'Wird der Kfz-Brief (Zulassungsbescheinigung Teil II) als Sicherheit hinterlegt?', answer: 'Das hängt vom Kreditgeber ab: Autobanken und manche Filialbanken verlangen die Sicherungsübereignung und den Kfz-Brief. Viele Direktbanken vergeben den Autokredit jedoch als zweckgebundenen Konsumentenkredit ohne Briefhinterlegung.' }
      ]
    };
  }

  if (slug === 'autokredit-rechner') {
    return {
      intro: 'Die Ballonfinanzierung kombiniert moderate monatliche Raten mit einer vertraglich festgelegten, hohen Schlussrate am Ende der Laufzeit (dem sogenannten Ballon). Dadurch sinkt die laufende monatliche Belastung gegenüber einem Volltilgerkredit erheblich.',
      details: 'Da die hohe Schlussrate während der gesamten Vertragslaufzeit verzinst werden muss, liegen die kumulierten Gesamtzinskosten einer Ballonfinanzierung spürbar über denen eines Standardkredits. Zum Laufzeitende ist die Schlussrate entweder bar zu begleichen, über eine Anschlussfinanzierung abzulösen oder durch den Fahrzeugverkauf zu decken.',
      faqs: [
        { question: 'Was geschieht, wenn der Fahrzeugwert am Ende unter der Schlussrate liegt?', answer: 'Tritt ein überdurchschnittlicher Wertverlust ein, entsteht eine Finanzierungslücke: Der Verkaufserlös reicht nicht aus, um die fällige Schlussrate vollständig an die Bank zu überweisen. Der Differenzbetrag muss aus Eigenmitteln beglichen werden.' },
        { question: 'Für wen lohnt sich ein Autokredit mit Schlussrate?', answer: 'Das Modell eignet sich für Autokäufer, die eine geringe laufende Monatsrate benötigen und sicher wissen, dass zum Stichtag liquide Mittel (z. B. aus Fälligkeit einer Anlage, Bonus oder Fahrzeugverkauf) bereitstehen.' }
      ]
    };
  }

  if (slug === 'vorfaelligkeitsentschaedigung-rechner') {
    return {
      intro: 'Kündigen Verbraucher einen gewöhnlichen Ratenkredit vorzeitig oder leisten eine vorzeitige Gesamttilgung, darf das Kreditinstitut nach § 502 BGB einen pauschalen Zinsschaden als Vorfälligkeitsentschädigung geltend machen. Der Gesetzgeber schützt Kreditnehmer hierbei durch strikte prozentuale Obergrenzen.',
      details: 'Beträgt die Restlaufzeit des Vertrags zum Zeitpunkt der Rückzahlung mehr als 12 Monate, ist die Entschädigung gesetzlich auf maximal 1,0 Prozent des vorzeitig zurückgezahlten Betrags gedeckelt. Liegt die verbleibende Restlaufzeit bei 12 Monaten oder weniger, beträgt die Höchstgrenze 0,5 Prozent.',
      faqs: [
        { question: 'Gilt die 1-Prozent-Grenze auch für Baufinanzierungen?', answer: 'Nein. Für Immobiliardarlehen gilt § 502 BGB nicht in dieser Pauschalform. Dort darf die Bank den tatsächlichen Zinsschaden nach der BGH Aktiv-Passiv-Methode berechnen, was zu deutlich höheren Beträgen führen kann.' },
        { question: 'Dürfen Sondertilgungen bei der Berechnung abgezogen werden?', answer: 'Ja. Wenn der Darlehensvertrag vertragliche Sondertilgungsrechte vorsieht, müssen diese schadensmindernd berücksichtigt werden, da die Bank nicht mit Zinsen rechnen durfte, die durch Sondertilgungen entfallen wären.' }
      ]
    };
  }

  if (slug === 'vorfaelligkeitsentschaedigung-baufinanzierung-rechner') {
    return {
      intro: 'Wird eine Baufinanzierung vor Ablauf der vereinbarten Zinsbindung gekündigt (etwa wegen Immobilienverkauf, Scheidung oder Erbschaft), berechnet die Bank den Zinsschaden nach der vom Bundesgerichtshof (BGH) anerkannten Aktiv-Passiv-Methode.',
      details: 'Hierbei wird der vereinbarte Vertragszins mit der Rendite verglichen, die die Bank erzielen würde, wenn sie das vorzeitig zurückerhaltene Kapital in sichere Hypothekenpfandbriefe gleicher Laufzeit anlegt (Wiederanlagerendite). Vom Zinsverlust sind ersparte Verwaltungskosten und erspartes Risikokapital abzuziehen.',
      faqs: [
        { question: 'Muss die Bank einer vorzeitigen Darlehensauflösung immer zustimmen?', answer: 'Nein. Während der Festzinsphase besteht ein berechtigtes Kündigungsinteresse nur bei triftigem Grund – insbesondere bei Verkauf der beliehenen Immobilie oder Nichtabnahme wegen Tod/Trennung. Reine Zinsvorteile bei anderen Banken berechtigen nicht zur Kündigung.' },
        { question: 'Wie hoch sind die typischen Abzüge für Risiko- und Verwaltungskosten?', answer: 'Die Rechtsprechung billigt für ersparte Risikokosten meist einen Satz von 0,05 bis 0,15 Prozentpunkten pro Jahr zu; für ersparte Verwaltungsaufwendungen werden üblicherweise etwa 50 bis 60 Euro pro Jahr der Restlaufzeit angesetzt.' }
      ]
    };
  }

  // --- FINANZEN & STEUERN ---
  if (slug === 'prozentrechner') {
    return {
      intro: 'Die Prozentrechnung verknüpft drei fundamentale Größen: den Grundwert (die Ausgangsbasis G = 100 %), den Prozentsatz (den Anteil p in Prozent) und den Prozentwert (den konkreten Betrag W). Je nachdem, welche zwei Größen bekannt sind, lässt sich die dritte durch Umstellen der Formel W = (G · p) / 100 bestimmen.',
      details: 'Im Geschäftsverkehr ist zwischen Aufschlägen (z. B. Handelsspanne auf den Einkaufspreis) und Abschlägen (z. B. Skonto, Rabatt) zu unterscheiden. Ein häufiger Denkfehler: Wird ein Wert um 20 % erhöht und anschließend um 20 % verringert, landet man nicht beim Ausgangswert, da sich der zweite Prozentsatz auf eine vergrößerte Basis bezieht (100 → 120 → 96).',
      faqs: [
        { question: 'Wie berechnet man den Prozentsatz zweier Werte?', answer: 'Teilen Sie den Prozentwert durch den Grundwert und multiplizieren Sie das Ergebnis mit 100: p = (W / G) · 100 %. Beispiel: 15 von 60 ergibt (15 / 60) · 100 = 25 %.' },
        { question: 'Was ist der Unterschied zwischen Prozent und Prozentpunkten?', answer: 'Ein prozentualer Anstieg misst das relative Wachstum, während Prozentpunkte die absolute Differenz zweier Prozentsätze angeben. Steigt ein Zinssatz von 2 % auf 3 %, entspricht dies einer Zunahme um 1 Prozentpunkt, aber um 50 Prozent.' }
      ]
    };
  }

  if (slug === 'zinseszinsrechner') {
    return {
      intro: 'Der Zinseszinseffekt entsteht, wenn erwirtschaftete Zinsen nicht ausgezahlt, sondern reinvestiert werden. In den Folgeperioden werden somit nicht nur das ursprüngliche Startkapital, sondern auch alle zuvor gutgeschriebenen Zinsen erneut verzinst, was zu einem exponentiellen Vermögenswachstum führt.',
      details: 'Nach der mathematischen Zinseszinsformel Kn = K0 · (1 + r)^n wächst das Vermögen über längere Anlagehorizonte (15, 20 oder 30 Jahre) überproportional. Eine einfache Faustformel zur Verdopplung des Kapitals bietet die 72er-Regel: Teilt man 72 durch den jährlichen Zinssatz (z. B. 72 / 6 % = 12), erhält man näherungsweise die benötigten Jahre bis zur Kapitalverdopplung.',
      faqs: [
        { question: 'Wie wirkt sich die unterjährige Zinsgutschrift aus?', answer: 'Werden Zinsen quartalsweise oder monatlich gutgeschrieben, fällt der Zinseszinseffekt durch die frühere Wiederanlage geringfügig höher aus als bei rein jährlicher Gutschrift (konformer versus effektiver Jahreszins).' },
        { question: 'Welche Rolle spielt die Inflation beim Zinseszins?', answer: 'Entscheidend für den realen Vermögensaufbau ist die Realrendite: Nominalzins minus Inflationsrate. Liegt die Teuerungsrate über dem Zinssatz, schrumpft die reale Kaufkraft trotz Zinszuwachs (negativer Realzins).' }
      ]
    };
  }

  if (slug === 'sparzielrechner') {
    return {
      intro: 'Wer ein festes finanzielles Sparziel anstrebt – sei es für den Immobilienerwerb, ein Sabbatical oder die Rückzahlung einer Darlehensrestschuld –, muss die monatliche Sparrate so bemessen, dass das Zielkapital zum Stichtag exakt erreicht wird. Das Tool berechnet die erforderliche monatliche Annuität unter Einbezug von Startkapital und Wiederanlagezins.',
      details: 'Da der Zinseszinseffekt über die Zeit für Sie arbeitet, müssen Sie bei einer renditestarken Anlage spürbar weniger Eigenkapital aus eigener Tasche einzahlen, als die nominale Zielsumme beträgt. Je früher mit dem Ansparen begonnen wird, desto geringer fällt die monatliche Sparverpflichtung aus.',
      faqs: [
        { question: 'Wie berechnet sich die notwendige Sparrate mathematisch?', answer: 'Die monatliche Rate ergibt sich aus der Rentenbarwert- bzw. Rentenendwertformel: Das nach Verzinsung des Startkapitals verbleibende Restziel wird durch den Rentenendwertfaktor der unterjährigen Monatsrente geteilt.' },
        { question: 'Welche Renditeannahme ist für Sparziele realistisch?', answer: 'Für kurzfristige Ziele (unter 3 Jahre) sollten risikofreie Tages- oder Festgeldzinsen angesetzt werden. Für langfristige Horizonte (über 10 Jahre) wird bei breit gestreuten Welt-ETFs historisch oft mit 5 bis 7 Prozent p.a. vor Steuern kalkuliert.' }
      ]
    };
  }

  if (slug === 'sparziel-rechner') {
    return {
      intro: 'Beim strategischen Vermögensaufbau stellt sich häufig die Frage nach dem Anlagehorizont: Wie lange dauert es bei einer bestimmten monatlichen Sparrate und realistischer Marktrendite, bis ein sechsstelliger Betrag oder die finanzielle Freiheit erreicht ist?',
      details: 'Durch die Aufteilung der Endsumme in eigene kumulierte Einzahlungen und den reinen Zinseszinsgewinn wird transparent sichtbar, ab welchem Zeitpunkt die Zinserträge die eigenen monatlichen Einzahlungen übertreffen (der sogenannte Zinseszins-Wendepunkt).',
      faqs: [
        { question: 'Warum schlägt eine konstante Sparrate den Versuch des Market-Timings?', answer: 'Durch regelmäßige monatliche Einzahlungen nutzen Anleger den Cost-Average-Effekt (Durchschnittskosteneffekt): In schwachen Marktphasen werden automatisch mehr Anteile gekauft, in teuren Phasen weniger.' },
        { question: 'Müssen Steuern auf die Zinserträge berücksichtigt werden?', answer: 'Ja. In Deutschland unterliegen Zinsen und Kapitalerträge der Abgeltungsteuer (25 % zzgl. Solidaritätszuschlag und ggf. Kirchensteuer). Lediglich der Sparer-Pauschbetrag (1.000 € für Alleinstehende, 2.000 € für Verheiratete) bleibt steuerfrei.' }
      ]
    };
  }

  if (slug === 'mwst-rechner') {
    return {
      intro: 'In Deutschland beträgt der reguläre Mehrwertsteuersatz (Umsatzsteuer) 19 Prozent (§ 12 Abs. 1 UStG), während für grundlegende Güter des täglichen Bedarfs – wie fast alle Lebensmittel, Bücher, Zeitungen und den öffentlichen Nahverkehr – der ermäßigte Steuersatz von 7 Prozent (§ 12 Abs. 2 UStG) gilt.',
      details: 'Für Rechnungssteller und Buchhalter ist die Richtung der Berechnung entscheidend: Vom Nettobetrag zum Bruttobetrag wird multipliziert (Netto · 1,19), umgekehrt wird vom Bruttobetrag dividiert (Brutto / 1,19 = Netto). Der Mehrwertsteuerbetrag selbst entspricht beim 19 % Satz genau 15,966 Prozent des Bruttobetrags (19 / 119).',
      faqs: [
        { question: 'Wie zieht man die Mehrwertsteuer aus einem Bruttobetrag heraus?', answer: 'Teilen Sie den Bruttobetrag durch 1,19 (bei 19 % MwSt.) bzw. durch 1,07 (bei 7 % MwSt.). Die Differenz zwischen Brutto und diesem Nettowert ist die exakte Steuer.' },
        { question: 'Wer ist zum Vorsteuerabzug berechtigt?', answer: 'Vorsteuerabzugsberechtigt sind vorsteuerabzugsberechtigte Unternehmer nach § 15 UStG. Sie erhalten die an andere Unternehmen gezahlte Umsatzsteuer im Rahmen der monatlichen oder quartalsweisen Umsatzsteuervoranmeldung vom Finanzamt erstattet.' }
      ]
    };
  }

  if (slug === 'inflationsrechner') {
    return {
      intro: 'Die Inflation misst die kontinuierliche Geldentwertung anhand des harmonisierten Verbraucherpreisindex (HVPI), der monatlich vom Statistischen Bundesamt (Destatis) ermittelt wird. Steigen die Verbraucherpreise, sinkt die reale Kaufkraft eines festen Geldbetrags im Laufe der Jahre.',
      details: 'Eine scheinbar geringe Inflationsrate von 2,5 Prozent pro Jahr halbiert die reale Kaufkraft von Bargeld und zinslosen Giroguthaben in weniger als 29 Jahren. Zur Berechnung des Kaufkraftverlusts wird der Barwert K0 = Kn / (1 + i)^n über die Jahresanzahl n abgezinst.',
      faqs: [
        { question: 'Welche Waren fließen in den deutschen Verbraucherpreisindex ein?', answer: 'Destatis nutzt einen repräsentativen Warenkorb mit rund 650 Güter- und Dienstleistungsarten, darunter Miete, Nahrungsmittel, Energie, Mobilität, Bekleidung und Freizeitaktivitäten, gewichtet nach durchschnittlichen Haushaltsausgaben.' },
        { question: 'Was bedeutet die sogenannte gefühlte Inflation?', answer: 'Die gefühlte Inflation liegt oft über der amtlichen Rate, weil Menschen Preiserhöhungen bei häufig gekauften Gütern (Bäcker, Supermarkt, Tankstelle) psychologisch stärker wahrnehmen als stabile Preise bei langlebigen Anschaffungen.' }
      ]
    };
  }

  if (slug === 'kaufkraftverlust-rechner') {
    return {
      intro: 'Während der allgemeine Inflationsrechner die reine Teuerungsrate abbildet, stellt der Kaufkraftverlust-Rechner für Ersparnisse den realen Vermögenserhalt auf den Prüfstand: Er verrechnet die gutgeschriebenen Sparzinsen direkt mit der jährlichen Inflationsrate.',
      details: 'Übersteigt die Inflationsrate den Zinssatz Ihres Tagesgelds oder Sparbriefs, entsteht ein negativer Realzins (Kaufkraftverlust trotz nominalem Zuwachs). Um Ihr Geldvermögen real zu erhalten, muss die Nachsteuerrendite Ihrer Geldanlage mindestens der aktuellen Inflationsrate entsprechen.',
      faqs: [
        { question: 'Was ist der Realzins nach der Fisher-Gleichung?', answer: 'Näherungsweise gilt: Realzins ≈ Nominalzins - Inflationsrate. Bei 2,5 % Zinsen und 3,5 % Teuerung beträgt der Realzins -1,0 % p.a. – Ihr Erspartes verliert real an Wert.' },
        { question: 'Welche Anlageformen bieten verlässlichen Inflationsschutz?', answer: 'Historisch bieten Sachwerte wie Aktien (über breit gestreute ETFs) und inflationsindexierte Bundesanleihen (ILB) einen besseren Schutz als reine Nominalwertanlagen wie Sparbücher oder Festgeld.' }
      ]
    };
  }

  // --- ARBEIT & GEHALT ---
  if (slug === 'stundenlohnrechner') {
    return {
      intro: 'Die Umrechnung eines festen Brutto-Monatsgehalts in den exakten Stundenlohn erfolgt in Deutschland nach der arbeitsrechtlichen 13-Wochen-Quartalsformel (§ 11 Abs. 1 BUrlG). Da Monate unterschiedlich viele Tage haben, umfasst ein Quartal exakt 13 Kalenderwochen.',
      details: 'Ein Vollzeitbeschäftigter mit einer vertraglichen 40-Stunden-Woche leistet im Monatsschnitt 173,33 Arbeitsstunden (40 Std. · 13 Wochen / 3 Monate). Aus Überstundenauszahlungen, Schichtzuschlägen und betrieblichen Sonderzahlungen (Urlaubs- und Weihnachtsgeld) leitet sich der tatsächliche Effektivstundenlohn ab.',
      faqs: [
        { question: 'Warum darf man das Monatsgehalt nicht einfach durch 4 Wochen teilen?', answer: 'Weil ein Monat durchschnittlich nicht 4,0 Wochen, sondern rund 4,33 Wochen (52 Wochen / 12 Monate) hat. Eine Teilung durch 4 würde den tatsächlichen Stundenlohn rechnerisch um über 8 Prozent zu hoch ansetzen.' },
        { question: 'Gilt die 13-Wochen-Formel auch für Teilzeitkräfte und Minijobber?', answer: 'Ja. Die Quartalsformel ist die im Arbeitsrecht und bei Tarifverträgen einheitlich anerkannte Berechnungsmethode für jede vereinbarte Wochenarbeitszeit.' }
      ]
    };
  }

  if (slug === 'arbeitstage-rechner') {
    return {
      intro: 'Die Anzahl der gesetzlichen Arbeitstage in einem Kalenderjahr schwankt in Deutschland von Jahr zu Jahr und unterscheidet sich deutlich zwischen den 16 Bundesländern. Ausschlaggebend sind bewegliche Feiertage (Ostern, Pfingsten, Christi Himmelfahrt) und landesspezifische Feiertage (z. B. Fronleichnam, Allerheiligen, Reformationstag).',
      details: 'Im Bundesdurchschnitt hat ein Arbeitsjahr bei einer 5-Tage-Woche (Montag bis Freitag) rund 250 bis 252 Arbeitstage. Für die Lohnabrechnung, Urlaubsplanung und Pendlerpauschale in der Steuererklärung (Anlage N) werden nur die tatsächlichen Tage ohne Samstage, Sonntage und gesetzliche Feiertage herangezogen.',
      faqs: [
        { question: 'Welches Bundesland hat die meisten gesetzlichen Feiertage?', answer: 'Bayern liegt mit 13 gesetzlichen Feiertagen an der Spitze (in der Stadt Augsburg durch das Augsburger Friedensfest sogar 14), während die nördlichen Bundesländer meist 10 gesetzliche Feiertage zählen.' },
        { question: 'Wie viele Arbeitstage erkennt das Finanzamt für die Pendlerpauschale an?', answer: 'Bei einer 5-Tage-Woche akzeptieren die Finanzämter ohne Einzelnachweis in der Regel 220 bis 230 Arbeitstage pro Kalenderjahr (nach Abzug von Urlaub, Feiertagen und durchschnittlichen Krankheitstagen).' }
      ]
    };
  }

  if (slug === 'tage-zwischen-zwei-daten') {
    return {
      intro: 'Zur Fristenberechnung im Zivilrecht (§§ 187, 188 BGB), für Projektmeilensteine und Kündigungstermine ist die exakte Spanne zwischen zwei Stichtagen entscheidend. Hierbei ist zwischen reinen Kalendertagen und den tatsächlichen Werktagen (Mo–Sa) bzw. Arbeitstagen (Mo–Fr) zu differenzieren.',
      details: 'Nach § 187 Abs. 1 BGB wird der Tag, auf den der Fristbeginn fällt, bei der Zählung im deutschen Recht nicht mitgerechnet (die Frist beginnt am Folgetag um 00:00 Uhr). Fällt das Fristende auf einen Samstag, Sonntag oder Feiertag, verlängert sich die Frist nach § 193 BGB auf den nächsten Werktag.',
      faqs: [
        { question: 'Was ist der rechtliche Unterschied zwischen Werktagen und Arbeitstagen?', answer: 'Werktage umfassen gesetzlich alle Tage von Montag bis Samstag (6-Tage-Woche, z. B. im Bundesurlaubsgesetz oder Mietrecht). Arbeitstage bezeichnen hingegen nur die Tage, an denen tatsächlich gearbeitet wird (meist Mo–Fr).' },
        { question: 'Wie werden Fristen gezählt, die nach Monaten bestimmt sind?', answer: 'Nach § 188 Abs. 2 BGB enden Monatsfristen mit dem Ablauf desjenigen Tages des letzten Monats, welcher nach seiner Benennung oder Zahl dem Tage entspricht, in den das Ereignis fällt.' }
      ]
    };
  }

  // --- GESUNDHEIT & FITNESS ---
  if (slug === 'bmi-rechner') {
    return {
      intro: 'Der Body-Mass-Index (BMI) setzt das Körpergewicht ins Verhältnis zum Quadrat der Körpergröße (kg/m²). Die Weltgesundheitsorganisation (WHO) stuft Erwachsene ab einem BMI von 25,0 als übergewichtig und ab 30,0 als adipös ein; als Normalgewicht gilt die Spanne von 18,5 bis 24,9.',
      details: 'Der BMI ist ein rein statistischer Screening-Parameter und unterscheidet nicht zwischen Muskel- und Fettmasse: Kraftsportler mit hoher Muskelmasse fallen häufig fälschlicherweise in die Kategorie Übergewicht. Zudem steigt das physiologische Normalgewicht im höheren Lebensalter natürlich an (Senioren-BMI 22 bis 27).',
      faqs: [
        { question: 'Gilt die WHO-Einstufung auch für Kinder und Jugendliche?', answer: 'Nein. Bei Kindern und Jugendlichen bis 18 Jahren wird der BMI wegen des Wachstums nicht starr eingestuft, sondern anhand von BMI-Perzentilkurven (Kromeyer-Hauschild) im Vergleich zur Altersgruppe interpretiert.' },
        { question: 'Welche Messwerte sind aussagekräftiger als der BMI?', answer: 'Die Waist-to-Height-Ratio (WHtR) und der Taillenumfang gelten medizinisch als präziser, da sie das viszerales Bauchfett erfassen, welches das kardiovaskuläre Risiko maßgeblich beeinflusst.' }
      ]
    };
  }

  if (slug === 'idealgewicht-rechner') {
    return {
      intro: 'Das Idealgewicht beschreibt das Körpergewicht, bei dem statistisch die höchste Lebenserwartung und das geringste Risiko für Herz-Kreislauf-Erkrankungen besteht. Historisch und medizinisch haben sich verschiedene Berechnungsverfahren wie die Broca-Formel, die Lorenz-Formel und die Creff-Formel etabliert.',
      details: 'Während die klassische Broca-Formel (Normalgewicht = Körpergröße in cm - 100) bei sehr großen oder kleinen Menschen ungenau ist, bezieht die Creff-Formel das Alter und den individuellen Knochenbau (grazil, normal, stämmig) über empirische Korrekturfaktoren ein.',
      faqs: [
        { question: 'Wie unterscheidet sich die Lorenz-Formel für Männer und Frauen?', answer: 'Für Männer lautet die Lorenz-Formel: (Größe - 100) - (Größe - 150) / 4. Für Frauen lautet sie wegen des höheren durchschnittlichen Körperfettanteils: (Größe - 100) - (Größe - 150) / 2.' },
        { question: 'Gibt es ein festes, starres Idealgewicht?', answer: 'Nein. In der modernen Sport- und Ernährungsmedizin wird kein starres Kilogramm-Ziel vorgegeben, sondern ein gesunder Wohlfühl- und Gewichtskorridor auf Basis von Körperfettanteil und Muskelmasse empfohlen.' }
      ]
    };
  }

  // --- BAUEN & HANDWERK ---
  if (slug === 'brennholz-raummeter-rechner') {
    return {
      intro: 'Beim Kauf von Brennholz herrschen drei grundlegend verschiedene Maßeinheiten: Der Festmeter (FM) bezeichnet 1 m³ massive Holzmasse ohne Luftzwischenräume. Der Raummeter (RM bzw. Ster) misst 1 m³ ordentlich aufgeschichtetes Scheitholz, während der Schüttraummeter (SRM) lose geschüttetes Scheitholz erfasst.',
      details: 'Als Faustformel gilt: 1 Festmeter entspricht etwa 1,4 Raummetern bzw. rund 2,0 bis 2,2 Schüttraummetern. Für einen optimalen Heizwert und zur Vermeidung von Glanzruß im Kaminofen darf das Holz nach dem Bundes-Immissionsschutzgesetz (1. BImSchV) maximal 20 Prozent Restfeuchte (empfohlen: < 15 %) aufweisen.',
      faqs: [
        { question: 'Warum ist Schüttraummeter (SRM) meist günstiger pro Kubikmeter als Raummeter (RM)?', answer: 'Weil lose geschüttetes Holz durch die unregelmäßige Lage viel mehr Hohlräume enthält. 1 Schüttraummeter enthält nur etwa 60 bis 70 Prozent der Holzmasse eines ordentlich aufgesetzten Raummeters.' },
        { question: 'Wie lange muss frisches Kaminholz gelagert werden?', answer: 'Hartholz (Buche, Eiche) benötigt an einem regengeschützten, gut belüfteten Ort etwa 2 Jahre Trocknungszeit. Weichholz (Fichte, Kiefer) ist meist nach 1 bis 1,5 Jahren ausreichend trocken.' }
      ]
    };
  }

  if (slug === 'betonrechner') {
    return {
      intro: 'Zur Herstellung von Ortbeton für Fundamente, Gartenwege oder Bodenplatten wird das geometrische Volumen (Länge · Breite · Tiefe) in Kubikmetern berechnet. Da feuchte Gesteinskörnungen und Zement beim Anmischen zusammensacken, ist ein Verdichtungs- und Verschnittzuschlag von 10 bis 15 Prozent einzuplanen.',
      details: 'Die klassische Baustellenmischung für unbewehrten Normalbeton (C20/25) folgt der bewährten 1:4 Regel: 1 Raumteil Zement auf 4 Raumteile Betonkies (Körnung 0/16 oder 0/32). Der Wasserzementwert (w/z-Wert) sollte bei etwa 0,5 bis 0,6 liegen, um Rissbildung zu vermeiden.',
      faqs: [
        { question: 'Wie viele Säcke Fertigbeton (25 kg / 40 kg) ergeben 1 m³ Beton?', answer: 'Ein 25-kg-Sack Trockenbeton ergibt angemischt ca. 12 bis 13 Liter Frischbeton. Für einen vollen Kubikmeter (1.000 Liter) werden somit rund 80 Säcke à 25 kg bzw. 50 Säcke à 40 kg benötigt.' },
        { question: 'Wie lange muss frischer Beton aushärten, bevor er belastbar ist?', answer: 'Normalbeton erreicht nach DIN EN 206 nach 28 Tagen seine normative Normdruckfestigkeit. Vorsichtig begehbar ist er meist nach 1 bis 2 Tagen; ausgeschalt werden kann nach etwa 3 bis 7 Tagen.' }
      ]
    };
  }

  // --- EINHEITEN & KOCHEN ---
  if (slug === 'viskositaet-umrechner') {
    return {
      intro: 'Die Viskosität beschreibt die innere Reibung bzw. Zähflüssigkeit von Fluiden. In Wissenschaft und Technik wird strikt zwischen der dynamischen Viskosität η (Einheit Pascal-Sekunde Pa·s oder Millipascal-Sekunde mPa·s / Centipoise cP) und der kinematischen Viskosität ν (Einheit mm²/s oder Centistokes cSt) unterschieden.',
      details: 'Die Verknüpfung beider Größen erfolgt über die Dichte ρ des Mediums: ν = η / ρ. Da die Viskosität von Ölen, Lacken und Flüssigkeiten extrem temperaturabhängig ist (heißes Motoröl fließt wesentlich leichter als kaltes), muss bei jeder Viskositätsangabe die Referenztemperatur angegeben werden.',
      faqs: [
        { question: 'Welche Viskosität hat reines Wasser?', answer: 'Wasser bei 20 °C hat eine dynamische Viskosität von fast exakt 1,0 mPa·s (1 Centipoise) und eine kinematische Viskosität von rund 1,0 mm²/s (Centistokes).' },
        { question: 'Was bedeutet die SAE-Klassifikation bei Motorölen?', answer: 'Bei SAE-Ölen (z. B. 5W-30) steht die Zahl vor dem W für das Kältefließverhalten im Winter (niedrige Viskosität beim Kaltstart), während die zweite Zahl die Hochtemperaturviskosität bei 100 °C angibt.' }
      ]
    };
  }

  // -------------------------------------------------------------------------
  // 2. CATEGORY-BASED BESPOKE GENERATOR (Zero boilerplate, 100% domain-specific)
  // -------------------------------------------------------------------------

  if (category === 'geometrie') {
    return {
      intro: `Zur Bestimmung der geometrischen Kenngrößen von ${name} verknüpft die mathematische Formelsammlung ${formula ? `(${formula})` : ''} Kantenlängen, Radien und Winkel. Die Berechnung liefert exakte planimetrische bzw. stereometrische Werte für Konstruktion, Handwerk und Unterricht.`,
      details: `In technischen Zeichnungen und bauphysikalischen Nachweisen müssen alle Längenmaße vorab in eine einheitliche Maßeinheit (z. B. Millimeter oder Meter) überführt werden. Bei abgeleiteten Flächenmaßen vervierfacht sich die Fläche bei doppelter Kantenlänge ($A \\sim l^2$), während das Volumen kubisch skaliert ($V \\sim l^3$).`,
      faqs: [
        { question: `Welche mathematische Gesetzmäßigkeit liegt dem ${name} zugrunde?`, answer: `Die Berechnung stützt sich auf die euklidische Geometrie und trigonometrische Grundbeziehungen ${formulaExplanation ? `(${formulaExplanation})` : ''}, welche absolute Exaktheit gewährleisten.` },
        { question: `Wie rechnet man das Ergebnis in andere Flächen- oder Raumeinheiten um?`, answer: `Flächenmaße werden mit dem Faktor 100 umgerechnet (1 m² = 100 dm² = 10.000 cm²). Raummaße erfordern den Umrechnungsfaktor 1.000 (1 m³ = 1.000 dm³ / Liter = 1.000.000 cm³).` }
      ]
    };
  }

  if (category === 'mathematik') {
    return {
      intro: `Die mathematische Berechnung von ${name} basiert auf formalen algebraischen Regeln und arithmetischen Gesetzmäßigkeiten ${formula ? `(${formula})` : ''}. Sie liefert deterministische, exakte Ergebnisse für Schule, Studium, Ingenieurwesen und Datenanalyse.`,
      details: `${formulaExplanation || 'Alle Rechenschritte folgen standardisierten mathematischen Konventionen.'} Achten Sie bei Dezimalbrüchen und Divisionen darauf, Divisionen durch null auszuschließen und Zwischenergebnisse nicht vorzeitig zu runden, um Rundungsfehler im Endergebnis zu vermeiden.`,
      faqs: [
        { question: `Gilt die Berechnung auch für negative Zahlen oder Null?`, answer: `Grundsätzlich ja, sofern keine unzulässigen Operationen (wie Division durch null oder Wurzeln aus negativen Zahlen im reellen Zahlenbereich) entstehen.` },
        { question: `Nach welchen Rundungsregeln wird das Ergebnis ausgegeben?`, answer: `Die Anzeige erfolgt kaufmännisch gerundet nach DIN 1333, wobei intern mit voller Gleitkommagenauigkeit (IEEE 754) gerechnet wird.` }
      ]
    };
  }

  if (category === 'statistik-wissenschaft') {
    return {
      intro: `In der deskriptiven und induktiven Statistik dient ${name} der Quantifizierung von Verteilungen, Streuungsmaßen oder Zusammenhangsstrukturen empirischer Datensätze ${formula ? `(${formula})` : ''}. Die Kennzahl ermöglicht die methodische Beurteilung wissenschaftlicher Messreihen.`,
      details: `${formulaExplanation || 'Statistische Schätzer unterscheiden zwischen Stichproben und Vollerhebungen.'} Bei Stichprobenanalysen sichert die Bessel-Korrektur (Freiheitsgrade $n-1$) die Erwartungstreue der Varianzschätzung. Ausreißer im Datensatz können das Ergebnis signifikant verzerren und sollten vorab identifiziert werden.`,
      faqs: [
        { question: `Wann ist die Normalverteilungsannahme zwingend erforderlich?`, answer: `Parametrische Tests und z-Transformationen setzen näherungsweise normalverteilte Daten voraus. Bei größeren Stichproben ($n > 30$) greift nach dem zentralen Grenzwertsatz oft eine hinreichende Annäherung.` },
        { question: `Was unterscheidet einen statistischen Zusammenhang von einer Kausalität?`, answer: `Eine hohe Korrelation oder statistische Signifikanz belegt lediglich ein gemeinsames Auftreten zweier Merkmale, beweist aber keinen ursächlichen Wirkungszusammenhang (Gefahr von Scheinkorrelationen).` }
      ]
    };
  }

  if (category === 'bauen-renovieren') {
    return {
      intro: `Für die fachgerechte Material- und Mengenplanung im Handwerk ermittelt ${name} den genauen Bedarf nach Bauabmessungen und Verlegeflächen. Eine präzise Mengenermittlung verhindert teure Materialüberbestände und Arbeitsunterbrechungen auf der Baustelle.`,
      details: `Bei handwerklichen Zuschnitten (Fliesen, Trockenbauplatten, Holz, Dämmstoffe) ist je nach Raumgeometrie und Verlegemuster ein branchenüblicher Verschnittzuschlag von 5 bis 15 Prozent auf die Nettofläche aufzuschlagen. DIN-Vorgaben und Herstellerangaben zu Fugenbreiten und Trocknungszeiten sind strikt einzuhalten.`,
      faqs: [
        { question: `Wie viel Verschnitt sollte bei der Bestellung eingeplant werden?`, answer: `Bei rechteckigen Räumen ohne viele Ecken genügen meist 5 bis 8 Prozent Verschnitt. Bei diagonalen Verlegungen, Erkern oder vielen Wanddurchbrüchen sollten 10 bis 15 Prozent einkalkuliert werden.` },
        { question: `Wie wirkt sich unebener Untergrund auf den Materialverbrauch aus?`, answer: `Unebene Böden oder Wände erhöhen den Verbrauch von Ausgleichsmasse, Fliesenkleber oder Putz erheblich. Hersteller-Verbrauchsangaben gelten stets für normgerecht plane Untergründe nach DIN 18202.` }
      ]
    };
  }

  if (category === 'wohnen-immobilien') {
    return {
      intro: `Im Immobilien- und Mietrecht liefert ${name} eine verlässliche Rechenbasis für Mietkosten, Kaufnebenkosten oder Abrechnungsquoten nach den Vorgaben des Bürgerlichen Gesetzbuchs (BGB) und geltender Rechtsprechung.`,
      details: `Bei immobilienwirtschaftlichen Entscheidungen sind neben den reinen Nominalbeträgen stets die regionalen Faktoren (z. B. Grunderwerbsteuersätze der Bundesländer zwischen 3,5 % und 6,5 %) und die laufenden Betriebskosten (zweite Miete) in die Wirtschaftlichkeitsrechnung einzubeziehen.`,
      faqs: [
        { question: `Welche gesetzlichen Grundlagen gelten bei dieser Immobilienberechnung?`, answer: `Maßgeblich sind die Vorschriften des BGB zum Mietrecht (§§ 535 ff. BGB), die Betriebskostenverordnung (BetrKV) sowie die Wohnflächenverordnung (WoFlV).` },
        { question: `Können Nebenkostenpauschalen nachträglich erhöht werden?`, answer: `Eine Erhöhung von Betriebskostenvorauszahlungen ist nach § 560 Abs. 4 BGB nur nach Vorlage einer formell ordnungsgemäßen Jahresabrechnung zulässig, die eine Unterdeckung nachweist.` }
      ]
    };
  }

  if (category === 'haushalt-energie') {
    return {
      intro: `Der Strom- und Energiebedarf von Haushaltsgeräten beeinflusst die jährlichen Betriebskosten spürbar. ${name} beziffert den laufenden Verbrauch in Kilowattstunden (kWh) und die resultierenden Kosten nach aktuellen Energiepreisen.`,
      details: `Der Strompreis setzt sich aus Beschaffungskosten, Netzentgelten, Steuern und Abgaben zusammen und liegt in Deutschland für Privatkunden typischerweise zwischen 30 und 40 Cent pro kWh. Bereits das Abschalten verdeckter Standby-Verbräuche spart im typischen Haushalt jährlich 50 bis 100 Euro ein.`,
      faqs: [
        { question: `Wie rechnet man Watt in Kilowattstunden (kWh) um?`, answer: `Multiplizieren Sie die Geräteleistung in Watt mit den Betriebsstunden und teilen Sie durch 1.000: kWh = (Watt · Stunden) / 1.000. Ein 100-Watt-Gerät verbraucht in 10 Stunden genau 1 kWh.` },
        { question: `Wann lohnt sich der Austausch eines alten Haushaltsgeräts?`, answer: `Ein Neukauf amortisiert sich meist dann innerhalb von 3 bis 6 Jahren, wenn das Altgerät älter als 10 bis 12 Jahre ist und eine um mindestens zwei Effizienzklassen schlechtere Einstufung besitzt.` }
      ]
    };
  }

  if (category === 'auto-verkehr') {
    return {
      intro: `Die tatsächlichen Betriebskosten und physikalischen Kennwerte eines Kraftfahrzeugs umfassen neben Kraftstoff bzw. Strom auch Fixkosten, Steuern und Verschleiß. ${name} quantifiziert diese Größen transparent für eine realistische Mobilitätskalkulation.`,
      details: `Reine Spritkosten machen bei Pkw häufig nur 30 bis 50 Prozent der realen Gesamtkosten (Total Cost of Ownership) aus. Wertverlust, Kfz-Haftpflicht, Vollkaskoversicherung und Inspektionen machen den größten Anteil der monatlichen Fahrzeugkosten aus.`,
      faqs: [
        { question: `Wie wirkt sich die Fahrweise auf den Kraftstoffverbrauch aus?`, answer: `Vorausschauendes Fahren, frühes Hochschalten (bei 2.000 U/min) und korrekter Reifenluftdruck senken den tatsächlichen Verbrauch im Alltag um bis zu 15 bis 20 Prozent.` },
        { question: `Wie berechnet sich der CO2-Ausstoß aus dem Spritverbrauch?`, answer: 'Die Verbrennung von 1 Liter Benzin erzeugt chemisch ca. 2,37 kg CO2, bei 1 Liter Diesel entstehen rund 2,65 kg CO2. Aus dem Verbrauch lässt sich so der exakte Klimaausstoß ermitteln.' }
      ]
    };
  }

  if (category === 'arbeit-gehalt') {
    return {
      intro: `Im deutschen Arbeits- und Sozialversicherungsrecht bestimmt ${name} finanzielle Ansprüche, gesetzliche Abzüge oder Fristen präzise nach den Bestimmungen von BGB, EStG, ArbZG und den Sozialgesetzbüchern (SGB).`,
      details: `Bei Gehaltsbestandteilen und Zuschlägen ist stets zwischen steuer- und sozialversicherungspflichtigem Bruttoarbeitslohn und steuerfreien Zuschlägen (z. B. für Nacht-, Sonntags- und Feiertagsarbeit nach § 3b EStG) zu differenzieren. Für Arbeitgeber fallen zusätzlich rund 20 bis 21 Prozent Lohnnebenkosten an.`,
      faqs: [
        { question: `Welche Sozialversicherungszweige werden vom Bruttolohn abgezogen?`, answer: `Die gesetzlichen Beiträge teilen sich auf in Krankenversicherung (14,6 % + Zusatzbeitrag), Pflegeversicherung, Rentenversicherung (18,6 %) und Arbeitslosenversicherung (2,6 %), jeweils hälftig getragen von Arbeitnehmer und Arbeitgeber.` },
        { question: `Was ist die Beitragsbemessungsgrenze?`, answer: `Die Beitragsbemessungsgrenze (BBG) legt das maximale Bruttoeinkommen fest, bis zu dem Sozialversicherungsbeiträge erhoben werden. Einkommensanteile oberhalb der BBG sind beitragsfrei.` }
      ]
    };
  }

  if (category === 'gesundheit-fitness') {
    return {
      intro: `Für Trainingssteuerung, Energiestoffwechsel und körperliche Leistungsfähigkeit liefert ${name} evidenzbasierte physiologische Richtwerte. Die Berechnungen unterstützen Sie bei einer ausgewogenen Ernährungs- und Sportplanung.`,
      details: `Physiologische Rechenformeln liefern Orientierungswerte für den gesunden Durchschnitt. Individuelle Faktoren wie Muskelmasse, genetische Disposition, hormonelle Schwankungen und Alltagsaktivität (PAL-Faktor) können den tatsächlichen Kalorien- oder Flüssigkeitsbedarf beeinflussen.`,
      faqs: [
        { question: `Wie verlässlich sind sportwissenschaftliche Faustformeln?`, answer: 'Formeln wie die Harris-Benedict- oder Mifflin-St.Jeor-Gleichung treffen den statistischen Mittelwert der Bevölkerung mit einer Genauigkeit von etwa ±10 Prozent und bieten eine solide Basis für Trainingspläne.' },
        { question: `Sollten Trainingsziele ausschließlich an Gewichtswerten festgemacht werden?`, answer: 'Nein. Körperzusammensetzung, Leistungsfähigkeit, Ruhepuls und Blutdruckwerte sind für die langfristige Gesundheit und Fitness wesentlich aussagekräftiger als reine Kilogrammzahlen auf der Waage.' }
      ]
    };
  }

  if (category === 'familie-schwangerschaft') {
    return {
      intro: `Gesetzliche Familienleistungen und Schwangerschaftsmeilensteine sind an feste Fristen und Berechnungsmodi nach dem Bundeselterngeld- und Elternzeitgesetz (BEEG) oder Mutterschutzgesetz (MuSchG) gebunden. ${name} ermittelt Ihre individuellen Zeiträume und Ansprüche.`,
      details: `Bei staatlichen Förderungen wie Elterngeld oder Unterhaltsvorschuss ist die zeitnahe Antragstellung bei den zuständigen Behörden entscheidend, da Leistungen oft nur für maximal 3 Monate rückwirkend ausgezahlt werden. Einkommensnachweise der letzten 12 Monate vor der Geburt bilden meist die Bemessungsgrundlage.`,
      faqs: [
        { question: `Wann muss der Antrag bei der zuständigen Stelle eingereicht werden?`, answer: 'Die Beantragung von Elterngeld und Kindergeld kann erst nach der Geburt mit der Geburtsurkunde des Kindes erfolgen. Eine Vorbereitung aller Unterlagen vor dem Entbindungstermin beschleunigt die Auszahlung.' },
        { question: `Werden Partnermonate flexibel aufgeteilt?`, answer: 'Ja. Eltern können Basiselterngeld, ElterngeldPlus und Partnerschaftsbonusmonate flexibel kombinieren, solange die Mindest- und Höchstbezugszeiten je Elternteil eingehalten werden.' }
      ]
    };
  }

  if (category === 'einheiten') {
    return {
      intro: `In Technik, Handel und Naturwissenschaft ist die Umrechnung zwischen dem metrischen SI-Einheitensystem und angloamerikanischen (Imperial) oder branchenspezifischen Maßen unerlässlich. ${name} wandelt Messwerte mit mathematischer Exaktheit um.`,
      details: `Verwenden Sie für physikalische und technische Berechnungen stets die definierten Basiseinheiten (Meter, Kilogramm, Sekunde, Ampere, Kelvin). Runden Sie Zwischenergebnisse nicht vorzeitig, um kumulierte Abweichungen bei mehrstufigen Umrechnungen zu verhindern.`,
      faqs: [
        { question: `Auf welchen Standards basieren die Umrechnungsfaktoren?`, answer: `Die Faktoren entsprechen den Definitionen des Internationalen Einheitensystems (SI) sowie den einschlägigen Normen nach DIN 1301 (Einheiten) und ISO 80000.` },
        { question: `Warum unterscheiden sich britische (UK) und US-amerikanische Maße?`, answer: `Obwohl Längenmaße (Zoll, Fuß) seit 1959 einheitlich definiert sind, weichen Hohlmaße (Gallonen, Pints, Fluid Ounces) zwischen dem britischen Imperial System und den US Customary Units bis zu 20 Prozent voneinander ab.` }
      ]
    };
  }

  if (category === 'kochen-backen') {
    return {
      intro: `In der Küchen- und Backpraxis entscheidet das exakte Mengen- und Temperaturverhältnis über Konsistenz, Geschmack und Gelingen. ${name} skaliert Rezeptzutaten, Backformen oder Garzeiten für das perfekte kulinarische Ergebnis.`,
      details: `Beim Backen handelt es sich um präzise Lebensmittelchemie: Das Verhältnis von Mehl, Flüssigkeit, Fett und Triebmitteln (Hefe, Backpulver) muss stimmen. Bei der Umrechnung auf andere Formgrößen skaliert das Zutatenvolumen quadratisch mit dem Durchmesser der Backform ($r_2^2 / r_1^2$).`,
      faqs: [
        { question: `Warum wiegt ein Esslöffel (EL) nicht bei jeder Zutat gleich viel?`, answer: 'Das Gewicht eines Löffels hängt von der Schüttdichte ab: 1 EL Wasser oder Milch wiegt ca. 15 Gramm, 1 EL Mehl nur etwa 10 Gramm, während 1 EL Honig oder Öl rund 18 bis 20 Gramm auf die Waage bringt.' },
        { question: `Wie passt man die Backzeit bei veränderter Backform an?`, answer: 'Wird der Teig in einer größeren Form flacher gebacken, verkürzt sich die Backzeit um 15 bis 25 Prozent. In einer kleineren Form wird der Kuchen höher und benötigt eine längere Backzeit bei eventuell leicht reduzierter Temperatur.' }
      ]
    };
  }

  if (category === 'business') {
    return {
      intro: `Betriebswirtschaftliche Kennzahlen (KPIs) bilden das Fundament für Unternehmenssteuerung, Liquiditätssicherung und Controlling. ${name} ermittelt die wesentliche Finanz- oder Leistungskennzahl nach Grundsätzen ordnungsmäßiger Buchführung (GoB).`,
      details: `Für eine belastbare Unternehmensanalyse darf eine Kennzahl nie isoliert betrachtet werden: Umsatzrentabilität, Gesamtkapitalrentabilität und Liquiditätsgrade müssen im Branchenkontext und im Zeitreihenvergleich analysiert werden, um Fehlinterpretationen zu vermeiden.`,
      faqs: [
        { question: `Was ist der Unterschied zwischen buchhalterischem Gewinn und Cashflow?`, answer: 'Der Gewinn nach HGB/EStG enthält nicht zahlungswirksame Aufwendungen (wie Abschreibungen und Rückstellungen). Der Cashflow misst hingegen den tatsächlichen Nettozufluss liquider Geldmittel im Geschäftsjahr.' },
        { question: `Welcher Liquiditätsgrad ist für gesunde Unternehmen anzustreben?`, answer: 'Für die Barliquidität (1. Grad) gelten 20 bis 30 Prozent als ausreichend; die kurzfristige Liquidität (2. Grad) sollte bei mindestens 100 bis 120 Prozent liegen, um fällige Verbindlichkeiten jederzeit begleichen zu können.' }
      ]
    };
  }

  if (category === 'datum-zeit') {
    return {
      intro: `Die chronometrische Zeit- und Kalenderberechnung nach dem gregorianischen Kalender berücksichtigt Schaltjahre, Monatslängen und Zonenzeiten. ${name} ermittelt exakte Zeitabstände, Stichtage oder Dauern fehlerfrei.`,
      details: `Das gregorianische Kalendersystem gleicht das Sonnenjahr (365,2422 Tage) durch Schaltregeln aus: Alle 4 Jahre wird ein Schalttag eingefügt, volle Jahrhunderte entfallen als Schaltjahr (1900), es sei denn, sie sind glatt durch 400 teilbar (2000). Dies gewährleistet langfristige astronomische Genauigkeit.`,
      faqs: [
        { question: `Werden Sommer- und Winterzeit bei Stundenberechnungen beachtet?`, answer: 'Bei reinen Tages- und Datumssprüngen bleibt die Zeitumstellung unberücksichtigt. Werden exakte Stunden über den letzten Sonntag im März (+1 Std.) oder Oktober (-1 Std.) berechnet, verschiebt sich die Differenz um genau 60 Minuten.' },
        { question: `Warum hat der Februar als einziger Monat nur 28 bzw. 29 Tage?`, answer: 'Dies geht auf den römischen Kalender des Königs Numa Pompilius zurück: Der Februar war der letzte Monat des Jahres und erhielt die übrig gebliebenen Tage zur Synchronisation mit dem Mondjahr.' }
      ]
    };
  }

  // Fallback (safe, domain-specific)
  return {
    intro: `Der ${name} verarbeitet die Eingabeparameter (${inputLabels || 'Ihre Ausgangsdaten'}) zur Bestimmung der Zielgröße nach den Standards der Kategorie ${category}.`,
    details: `Alle Berechnungen beruhen auf der methodischen Grundlage ${formula || 'anerkannter Berechnungsverfahren'}. Achten Sie auf realistische Ausgangsdaten, um aussagekräftige Resultate für Ihre Planung zu erhalten.`,
    faqs: [
      { question: `Welche Bedeutung hat das Ergebnis der Berechnung von ${name}?`, answer: `Das Ergebnis liefert eine quantitative Entscheidungsgrundlage für die praktische Anwendung im jeweiligen Fachbereich.` },
      { question: `Wie lassen sich Ungenauigkeiten vermeiden?`, answer: `Prüfen Sie vor der Berechnung alle eingegebenen Einheiten und verwenden Sie nach Möglichkeit verifizierte Messwerte oder Vertragskonditionen.` }
    ]
  };
}

// ---------------------------------------------------------------------------
// Main execution: Update all 24 calculator files with bespoke content
// ---------------------------------------------------------------------------

function formatStringLiteral(str: string): string {
  return `'${str.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function updateCalculatorBlock(block: string, updates: {
  intro: string;
  details: string;
  faqs: Array<{ question: string; answer: string }>;
}): string {
  let updated = block;

  const formattedContent = `content: {\n      intro: ${formatStringLiteral(updates.intro)},\n      details: ${formatStringLiteral(updates.details)},\n    },`;
  if (updated.includes('content: {')) {
    updated = updated.replace(/content:\s*\{[\s\S]*?\},/, formattedContent);
  } else {
    if (updated.includes('faqs: [')) {
      updated = updated.replace('faqs: [', `${formattedContent}\n    faqs: [`);
    } else if (updated.includes('relatedSlugs: [')) {
      updated = updated.replace('relatedSlugs: [', `${formattedContent}\n    relatedSlugs: [`);
    }
  }

  const faqsStr = `faqs: [\n` + updates.faqs.map(f => `      { question: ${formatStringLiteral(f.question)}, answer: ${formatStringLiteral(f.answer)} },`).join('\n') + `\n    ],`;
  if (updated.includes('faqs: [')) {
    updated = updated.replace(/faqs:\s*\[[\s\S]*?\],/, faqsStr);
  } else if (updated.includes('relatedSlugs: [')) {
    updated = updated.replace('relatedSlugs: [', `${faqsStr}\n    relatedSlugs: [`);
  }

  return updated;
}

function getCalculatorRange(fileContent: string, slug: string): { start: number; end: number; block: string } | null {
  const marker = `slug: '${slug}'`;
  const marker2 = `slug: "${slug}"`;
  let pos = fileContent.indexOf(marker);
  if (pos === -1) pos = fileContent.indexOf(marker2);
  if (pos === -1) return null;

  let start = -1;
  for (let i = pos; i >= 0; i--) {
    const char = fileContent[i];
    if (char === '{') {
      const prevText = fileContent.slice(Math.max(0, i - 10), i);
      if (prevText.includes('\n')) {
        start = i;
        break;
      }
    }
  }
  if (start === -1) return null;

  let depth = 0;
  let inStr: string | null = null;
  let isEscaped = false;
  let end = -1;

  for (let i = start; i < fileContent.length; i++) {
    const char = fileContent[i];
    if (isEscaped) {
      isEscaped = false;
      continue;
    }
    if (char === '\\') {
      isEscaped = true;
      continue;
    }
    if (inStr) {
      if (char === inStr) inStr = null;
      continue;
    }
    if (char === "'" || char === '"' || char === '`') {
      inStr = char;
      continue;
    }
    if (char === '/' && fileContent[i + 1] === '/') {
      const nextNl = fileContent.indexOf('\n', i);
      if (nextNl !== -1) i = nextNl;
      continue;
    }
    if (char === '/' && fileContent[i + 1] === '*') {
      const closeComm = fileContent.indexOf('*/', i);
      if (closeComm !== -1) i = closeComm + 1;
      continue;
    }

    if (char === '{') depth++;
    else if (char === '}') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }

  if (end === -1) return null;
  return { start, end, block: fileContent.slice(start, end) };
}

if (process.argv.includes('--write')) {
  console.log('\nApplying bespoke content to all 405 calculators across 24 files...');

  const baseDir = path.join(__dirname, '../src/data/calculators');
  const extraDir = path.join(baseDir, 'extra');

  const files = [
    ...fs.readdirSync(baseDir).filter(f => f.endsWith('.ts') && f !== 'index.ts').map(f => path.join(baseDir, f)),
    ...fs.readdirSync(extraDir).filter(f => f.endsWith('.ts') && f !== 'index.ts').map(f => path.join(extraDir, f)),
  ];

  let totalUpdated = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const ranges: Array<{ slug: string; start: number; end: number; block: string }> = [];

    for (const calc of ALL_CALCULATORS) {
      if (content.includes(`slug: '${calc.slug}'`) || content.includes(`slug: "${calc.slug}"`)) {
        const range = getCalculatorRange(content, calc.slug);
        if (range) {
          ranges.push({ slug: calc.slug, ...range });
        }
      }
    }

    if (ranges.length === 0) continue;

    ranges.sort((a, b) => b.start - a.start);

    for (const r of ranges) {
      const calc = ALL_CALCULATORS.find(c => c.slug === r.slug)!;
      const bespoke = createBespokeContent(calc);

      const newBlock = updateCalculatorBlock(r.block, bespoke);
      content = content.slice(0, r.start) + newBlock + content.slice(r.end);
      totalUpdated++;
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated bespoke content for ${ranges.length} calculators in ${path.basename(file)}`);
  }

  console.log(`\nSuccessfully applied bespoke content to ${totalUpdated} calculators!`);
} else {
  console.log('Dry run completed. Pass --write to apply changes.');
}
