import { CalculatorDefinition, ContentSection, FAQItem } from '@/types/calculator';

interface CategoryEnrichment {
  sections: ContentSection[];
  faqs: FAQItem[];
}

const CATEGORY_ENRICHMENTS: Record<string, CategoryEnrichment> = {
  finanzen: {
    sections: [
      {
        title: 'Praxistipps für Vermögensaufbau und Kapitalanlage',
        content:
          'Ein erfolgreicher Vermögensaufbau erfordert neben der passenden Rendite vor allem strategische Disziplin:\n\n' +
          '- **Notgroschen als Fundament:** Bevor Kapital längerfristig angelegt oder investiert wird, empfiehlt sich eine liquide Reserve von 3 bis 6 monatlichen Lebenshaltungskosten auf einem täglich verfügbaren Tagesgeldkonto.\n' +
          '- **Zinseszinshebel und Anlagehorizont:** Je früher regelmäßige Sparraten angelegt werden, desto stärker übersteigt der kumulierte Zinseszinseffekt über die Jahre das tatsächlich eingezahlte Eigenkapital.\n' +
          '- **Steuerliche Freibeträge ausschöpfen:** Nutzen Sie den gesetzlichen Sparer-Pauschbetrag (§ 20 EStG) durch die rechtzeitige Einrichtung von Freistellungsaufträgen bei Ihrer Bank, um Kapitalerträge bis zum Höchstbetrag steuerfrei zu vereinnahmen.',
      },
      {
        title: 'Reale vs. nominale Rendite nach Steuern und Inflation',
        content:
          'Die nominale Rendite spiegelt lediglich den rechnerischen Zuwachs auf dem Papier wider. Liegt die Inflationsrate über dem Zinssatz Ihres Sparkontos, tritt trotz nominaler Zinsgutschriften ein realer Kaufkraftverlust ein. Eine fundierte Finanzplanung kalkuliert daher stets mit der realen Nettorendite nach Abzug von Abgeltungsteuer, Solidaritätszuschlag und Teuerungsrate.',
      },
    ],
    faqs: [
      {
        question: 'Wie hoch ist die Abgeltungsteuer auf Kapitalerträge in Deutschland?',
        answer:
          'Kapitalerträge oberhalb des Sparer-Pauschbetrags unterliegen der pauschalen Abgeltungsteuer von 25 % zuzüglich 5,5 % Solidaritätszuschlag (effektiv 26,375 %) sowie gegebenenfalls 8 % oder 9 % Kirchensteuer.',
      },
      {
        question: 'Was ist der Unterschied zwischen einfacher und unterjähriger Verzinsung?',
        answer:
          'Bei unterjähriger Verzinsung (z. B. monatliche oder vierteljährliche Zinsgutschrift) werden erwirtschaftete Zinsen bereits in den Folgeperioden desselben Jahres mitverzinst. Dadurch fällt die effektive Jahresrendite geringfügig höher aus als bei rein jährlicher Abrechnung.',
      },
      {
        question: 'Was besagt die 72er-Regel für die Verdopplung von Kapital?',
        answer:
          'Die 72er-Regel ist eine bewährte Faustformel der Finanzmathematik: Teilt man die Zahl 72 durch den jährlichen Zinssatz in Prozent, erhält man näherungsweise die Anzahl der Jahre, nach denen sich das angelegte Kapital durch Zinseszinsen verdoppelt (z. B. bei 6 % Zinsen: 72 / 6 = 12 Jahre).',
      },
    ],
  },

  'kredit-schulden': {
    sections: [
      {
        title: 'Wichtige Kriterien beim Darlehens- und Tilgungsvergleich',
        content:
          'Vor Abschluss einer Finanzierung sollten die folgenden Konditionen sorgfältig geprüft werden:\n\n' +
          '- **Effektiver Jahreszins (§ 6 PAngV):** Für den objektiven Kostenvergleich ist stets der Effektivzins maßgeblich, da er neben dem Sollzins auch Auszahlungskurse und laufende Zahlungsintervalle abbildet.\n' +
          '- **Anfängliche Tilgungshöhe:** Ein anfänglicher Tilgungssatz von mindestens 2 bis 3 Prozent verkürzt die Gesamtlaufzeit spürbar und verringert das Zinsänderungsrisiko bei der Anschlussfinanzierung.\n' +
          '- **Kostenfreie Sondertilgungen:** Vereinbarte jährliche Sondertilgungsrechte (typischerweise 5 % der Darlehenssumme) bieten finanzielle Flexibilität, um Boni oder Einmalzahlungen schuldenmindernd einzubringen.\n' +
          '- **Zinseszins-Dynamik bei Sondertilgung:** Jede vorzeitige Teiltilgung verringert die Restschuld sofort, wodurch ab dem Folgemonat weniger Zinsen und ein höherer Tilgungsanteil aus der fixen Rate anfallen.',
      },
      {
        title: 'Gesetzliche Verbraucherrechte bei vorzeitiger Kreditrückzahlung',
        content:
          'Nach § 500 Abs. 2 BGB haben Kreditnehmer bei Verbraucherdarlehen jederzeit das gesetzliche Recht, den Kredit ganz oder teilweise vorzeitig zu tilgen. Die Bank darf hierfür maximal eine gesetzlich gedeckelte Vorfälligkeitsentschädigung von 1,0 % (bei mehr als 12 Monaten Restlaufzeit) bzw. 0,5 % (bei Restlaufzeit bis zu einem Jahr) des vorzeitig abgelösten Betrags verlangen.',
      },
    ],
    faqs: [
      {
        question: 'Welche Rolle spielt der Schufa-Score bei der Festlegung des Kreditzinses?',
        answer:
          'Die meisten Kreditinstitute vergeben Verbraucherdarlehen bonitätsabhängig. Ein sehr guter Schufa-Basisscore (über 97 %) signalisiert ein minimales Kreditausfallrisiko und ermöglicht die günstigsten Zinskonditionen.',
      },
      {
        question: 'Was geschieht bei finanziellen Engpässen während der Kreditlaufzeit?',
        answer:
          'Bei unverschuldeten Liquiditätsengpässen sollte unverzüglich die Bank kontaktiert werden. Meist lassen sich vorübergehende Ratenstundungen oder Laufzeitstreckungen vereinbaren, um eine Kündigung nach § 498 BGB zu vermeiden.',
      },
      {
        question: 'Was bedeutet die Zinsbindungsfrist bei einem Baukredit?',
        answer:
          'Während der vertraglichen Zinsbindung (z. B. 10 oder 15 Jahre) bleibt der vereinbarte Sollzinssatz garantiert fest. Nach Ablauf der Frist muss die verbleibende Restschuld über eine Anschlussfinanzierung (Prolongation oder Umschuldung) zu den dann aktuellen Marktzinsen weitergeführt werden.',
      },
    ],
  },

  'steuern-gehalt': {
    sections: [
      {
        title: 'Gesetzliche Grundlagen der Lohn- und Gehaltsabrechnung',
        content:
          'Das deutsche Steuersystem stützt sich auf das Leistungsfähigkeitsprinzip:\n\n' +
          '- **Progressiver Einkommensteuertarif (§ 32a EStG):** Der Grenzsteuersatz steigt mit zunehmendem Einkommen an. Der Grundfreibetrag sichert das steuerliche Existenzminimum.\n' +
          '- **Sozialversicherungsbeiträge:** Beiträge zur Kranken-, Pflege-, Renten- und Arbeitslosenversicherung werden bis zu den jeweiligen Beitragsbemessungsgrenzen paritätisch zwischen Arbeitnehmer und Arbeitgeber aufgeteilt.\n' +
          '- **Günstigerprüfungen:** Das Finanzamt prüft in der Einkommensteuerveranlagung automatisch die vorteilhafteste Option (z. B. Kindergeld vs. Kinderfreibetrag).',
      },
      {
        title: 'Praxistipps für Arbeitnehmer zur Optimierung des Nettoentgelts',
        content:
          'Arbeitnehmer können ihr zu versteuerndes Einkommen durch steuerfreie Sachbezüge (bis zu 50 € monatlich), Zuschüsse zum Deutschlandticket, vermögenswirksame Leistungen sowie das Geltendmachen tatsächlicher Werbungskosten (Fahrtkosten, Homeoffice-Pauschale, Arbeitsmittel) oberhalb des Arbeitnehmer-Pauschbetrags gezielt senken.',
      },
    ],
    faqs: [
      {
        question: 'Wie wirkt sich die Steuerklassenkombination III/V bei Ehegatten aus?',
        answer:
          'Die Steuerklassenkombination beeinflusst ausschließlich den monatlichen Lohnsteuerabzug während des Jahres. Die endgültige Jahressteuerschuld wird über die Einkommensteuererklärung anhand des Splittingverfahrens exakt ausgeglichen.',
      },
      {
        question: 'Bis zu welcher Höhe sind Sachbezüge steuer- und sozialabgabenfrei?',
        answer:
          'Nach § 8 Abs. 2 Satz 11 EStG sind Sachbezüge (z. B. Gutscheinkarten oder Tankgutscheine) bis zu einer Freigrenze von 50 € pro Kalendermonat vollkommen steuer- und sozialversicherungsfrei, sofern sie zusätzlich zum geschuldeten Arbeitslohn gewährt werden.',
      },
      {
        question: 'Was ist der Unterschied zwischen Grenzsteuersatz und Durchschnittssteuersatz?',
        answer:
          'Der Durchschnittssteuersatz gibt den prozentualen Anteil der gesamten Einkommensteuer am zu versteuernden Jahreseinkommen an. Der Grenzsteuersatz hingegen beziffert die steuerliche Mehrbelastung, die auf jeden zusätzlich verdienten Euro anfällt (z. B. bei einer Gehaltserhöhung oder Bonuszahlung).',
      },
    ],
  },

  'arbeit-gehalt': {
    sections: [
      {
        title: 'Arbeitsrechtliche Vorgaben und Fristen im Beruf',
        content:
          'Das deutsche Arbeitsrecht regelt Mindestansprüche zum Schutz von Arbeitnehmern:\n\n' +
          '- **Gesetzlicher Mindesturlaub (§ 3 BUrlG):** Bei einer 5-Tage-Woche stehen jedem Arbeitnehmer mindestens 20 Urlaubstage pro Kalenderjahr zu (24 Werktage bei 6-Tage-Woche).\n' +
          '- **Gesetzliche Kündigungsfristen (§ 622 BGB):** Die Grundkündigungsfrist für Arbeitnehmer beträgt 4 Wochen zum 15. oder Monatsende; für Arbeitgeber verlängert sie sich mit zunehmender Betriebszugehörigkeit gestaffelt auf bis zu 7 Monate.\n' +
          '- **Teilzeitanspruch (§ 8 TzBfG):** In Betrieben mit mehr als 15 Beschäftigten besteht nach sechsmonatiger Betriebszugehörigkeit ein gesetzlicher Anspruch auf Verringerung der Arbeitszeit.',
      },
      {
        title: 'Berechnung von Stundenlohn und Überstundenausgleich',
        content:
          'Zur Umrechnung des Monatsgehalts in einen exakten Stundensatz gilt die arbeitsrechtliche Standardformel: `Stundenlohn = (Monatsgehalt × 3) / (Wochenstunden × 13)`. Dies berücksichtigt, dass ein Quartal exakt 13 Arbeitswochen umfasst.',
      },
    ],
    faqs: [
      {
        question: 'Wann verfällt gesetzlicher Resturlaub aus dem Vorjahr?',
        answer:
          'Resturlaub muss grundsätzlich im laufenden Kalenderjahr genommen werden. Nach aktueller BAG- und EuGH-Rechtsprechung verfällt Urlaub jedoch nur dann, wenn der Arbeitgeber den Arbeitnehmer zuvor ausdrücklich und schriftlich aufgefordert hat, den Urlaub zu nehmen.',
      },
      {
        question: 'Wie wird Urlaub bei Teilzeitkräften mit variablen Arbeitstagen berechnet?',
        answer:
          'Der Urlaubsanspruch berechnet sich proportional nach der Anzahl der wöchentlichen Arbeitstage: `(Nominaler Jahresurlaub / 5 Tage) × tatsächliche wöchentliche Arbeitstage`. Die Anzahl der täglichen Arbeitsstunden spielt für die Urlaubstageberechnung keine Rolle.',
      },
      {
        question: 'Welche Kündigungsfristen gelten während der gesetzlichen Probezeit?',
        answer:
          'Nach § 622 Abs. 3 BGB kann ein Arbeitsverhältnis während einer vereinbarten Probezeit (maximal sechs Monate) von beiden Vertragsparteien mit einer verkürzten Frist von zwei Wochen zu jedem beliebigen Kalendertag gekündigt werden, sofern tarifvertraglich nichts Abweichendes geregelt ist.',
      },
    ],
  },

  'wohnen-immobilien': {
    sections: [
      {
        title: 'Kaufnebenkosten und Mietrecht im Überblick',
        content:
          'Bei Immobiliengeschäften entscheiden Nebenkosten und rechtliche Schranken maßgeblich über die Wirtschaftlichkeit:\n\n' +
          '- **Erwerbsnebenkosten beim Kauf:** Grunderwerbsteuer (3,5 bis 6,5 % je nach Bundesland), Notar- und Grundbuchkosten (ca. 1,5 bis 2,0 %) sowie eventuelle Maklerprovisionen müssen einkalkuliert werden.\n' +
          '- **Mietbelastungsquote im Haushalt:** Als Faustregel sollte die monatliche Warmmiete ca. 30 % des Haushaltsnettoeinkommens nicht dauerhaft übersteigen, um finanzielle Rücklagen zu gewährleisten.\n' +
          '- **Mietpreisbremse (§ 556d BGB):** In ausgewiesenen Gebieten mit angespanntem Wohnungsmarkt darf die Neuvertragsmiete höchstens 10 % über der ortsüblichen Vergleichsmiete liegen.',
      },
      {
        title: 'Umlagefähige Betriebskosten und Instandhaltungsrücklagen',
        content:
          'Nach der Betriebskostenverordnung (BetrKV) können laufende Ausgaben wie Grundsteuer, Heizung, Müllabfuhr und Versicherungen auf Mieter umgelegt werden. Verwaltungskosten und Instandsetzungsaufwendungen verbleiben hingegen ausnahmslos beim Eigentümer. Für Wohnungseigentümergemeinschaften ist eine ausreichende Instandhaltungsrücklage gesetzlich vorgeschrieben.',
      },
    ],
    faqs: [
      {
        question: 'Was besagt die gesetzliche Kappungsgrenze bei Mieterhöhungen (§ 558 BGB)?',
        answer:
          'Bei bestehenden Mietverhältnissen darf sich die Miete innerhalb von drei Jahren um maximal 20 % erhöhen (in Ballungsgebieten mit angespannter Lage per Landesverordnung auf 15 % abgesenkt), begrenzt durch die ortsübliche Vergleichsmiete.',
      },
      {
        question: 'Wie hoch sollten die monatlichen Instandhaltungsrücklagen sein?',
        answer:
          'Als Richtwert für Eigentumswohnungen gelten ca. 1,00 bis 1,50 € pro Quadratmeter Wohnfläche im Monat, bei älteren Immobilien mit Sanierungsstau entsprechend mehr, um Dach-, Fassaden- oder Heizungserneuerungen abzudecken.',
      },
      {
        question: 'Wie wird die Wohnfläche nach Wohnflächenverordnung (WoFlV) korrekt berechnet?',
        answer:
          'Räume mit einer lichten Raumhöhe ab zwei Metern zählen zu 100 Prozent zur Wohnfläche. Flächen mit einer Höhe zwischen einem und zwei Metern (z. B. unter Dachschrägen) werden zu 50 Prozent angerechnet. Balkone und Terrassen fließen in der Regel zu einem Viertel (maximal zur Hälfte) ein.',
      },
    ],
  },

  'haushalt-energie': {
    sections: [
      {
        title: 'Strom- und Energiekosten im Haushalt nachhaltig senken',
        content:
          'Durch gezielte Maßnahmen lassen sich laufende Betriebskosten spürbar reduzieren:\n\n' +
          '- **Standby-Verbräuche stoppen:** Unterhaltungselektronik und Netzteile im Ruhemodus verursachen im Jahresverlauf oft vermeidbare Zusatzkosten. Abschaltbare Steckerleisten trennen Geräte vollständig vom Netz.\n' +
          '- **Effizienzklassen beachten:** Das überarbeitete EU-Energielabel (Klassen A bis G) weist den standardisierten Strom- und Wasserverbrauch transparent aus. Hocheffiziente Geräte amortisieren ihren Mehrpreis rasch.\n' +
          '- **Temperaturführung beim Kühlen und Heizen:** Bereits ein Grad weniger Raumtemperatur senkt den Heizenergiebedarf um ca. 6 Prozent; eine Kühlschranktemperatur von 7 °C reicht für die Frischehaltung völlig aus.\n' +
          '- **Lüftungsverhalten optimieren:** Regelmäßiges Stoßlüften (3 bis 5 Mal täglich für ca. 5 Minuten bei weit geöffnetem Fenster) tauscht feuchte Raumluft aus, ohne dass die massiven Wände und Böden auskühlen.',
      },
      {
        title: 'Formel zur Ermittlung des individuellen Stromverbrauchs',
        content:
          'Der Stromverbrauch jedes Haushaltsgeräts berechnet sich unkompliziert: `Stromkosten (€) = (Leistung in Watt × Betriebsstunden in h / 1.000) × Strompreis je kWh`. Ein mobiles Messgerät aus dem Fachhandel deckt verdeckte Stromfresser zuverlässig auf.',
      },
    ],
    faqs: [
      {
        question: 'Welche Haushaltsgeräte verbrauchen im Alltag am meisten Strom?',
        answer:
          'Zu den größten kontinuierlichen Verbrauchern gehören alte Umwälzpumpen der Zentralheizung, elektrische Warmwasser-Durchlauferhitzer, veraltete Kühl- und Gefriergeräte sowie Kondenstrockner ohne Wärmepumpentechnik.',
      },
      {
        question: 'Wie wird Gas von Kubikmetern (m³) in Kilowattstunden (kWh) umgerechnet?',
        answer:
          'Die Umrechnung auf der Gasabrechnung erfolgt über die physikalische Formel: `kWh = m³ × Brennwert (ca. 10,0–11,5) × Zustandszahl z (ca. 0,90–0,98)`. Die genauen Multiplikatoren sind auf Ihrer Jahresabrechnung angegeben.',
      },
      {
        question: 'Lohnt sich der Einbau programmierbarer oder smarter Heizkörperthermostate?',
        answer:
          'Ja. Programmierbare Thermostate senken die Heizleistung in ungenutzten Räumen und während der Nachtabsenkung vollautomatisch ab. Nach Schätzungen der Verbraucherzentralen lassen sich dadurch bis zu 8 bis 12 Prozent der jährlichen Heizenergie einsparen.',
      },
    ],
  },

  'bauen-renovieren': {
    sections: [
      {
        title: 'Praxistipps für Materialbedarf, Verschnitt & Verarbeitung',
        content:
          'Bei Bau- und Renovierungsprojekten verhindert eine präzise Materialplanung kostspielige Verzögerungen:\n\n' +
          '- **Verschnittzuschlag richtig bemessen:** Bei gerader Verlegung im Standardverband genügen meist 5 bis 7 % Verschnitt. Bei diagonalem Muster, verwinkelten Räumen oder starkem Rapport sollten 10 bis 15 % kalkuliert werden.\n' +
          '- **Trocknungszeiten einhalten:** Zementäre Baustoffe wie Estrich, Fliesenkleber und Beton erfordern materialspezifische Abbindezeiten nach DIN 1045 und DIN 18560 vor der weiteren Belagskonstruktion.\n' +
          '- **Mindestgebinde runden:** Teilen Sie die Bedarfsfläche stets durch den Verpackungsinhalt und runden Sie grundsätzlich auf die nächste volle Packungseinheit auf.',
      },
      {
        title: 'Bedeutung von Reservematerial für spätere Ausbesserungen',
        content:
          'Fliesen, Parkett und Tapeten werden in Produktionschargen mit individuellen Nuancen und Brandfarben gefertigt. Bewahren Sie nach Abschluss der Renovierung mindestens 1 bis 2 Pakete Originalmaterial auf, um spätere Reparaturen bei Rohrbrüchen oder Beschädigungen unauffällig durchführen zu können.',
      },
    ],
    faqs: [
      {
        question: 'Wie berechnet man den Farbbedarf für Wand- und Deckenanstriche?',
        answer:
          'Auf normal saugendem, grundiertem Innenputz rechnet man im Schnitt mit 150 bis 200 ml Wandfarbe pro Quadratmeter und Anstrich. Stark strukturierte oder saugfähige Untergründe (z. B. Raufasertapete) erfordern bis zu 250 ml/m².',
      },
      {
        question: 'Müssen Bodenbeläge wie Laminat oder Vinyl vor der Verlegung akklimatisiert werden?',
        answer:
          'Ja. Holz- und Kunststoffbeläge sollten mindestens 48 Stunden ungeöffnet flach liegend im Verlegeraum bei normaler Raumtemperatur gelagert werden, um nachträgliches Verziehen oder Fugenbildung zu vermeiden.',
      },
      {
        question: 'Welche Toleranzen im Hochbau regelt die DIN 18202?',
        answer:
          'Die DIN 18202 definiert bauübliche Grenzabweichungen für Maße, Ebenheiten und Winkel an Wänden und Böden. Vor Belagsarbeiten müssen Unebenheiten geprüft und größere Dellen mit Ausgleichsmasse (Nivellierspachtel) egalisiert werden.',
      },
    ],
  },

  'datum-zeit': {
    sections: [
      {
        title: 'Fristen, Kalenderregeln & Zeitzonen im Überblick',
        content:
          'Bei zeitlichen Berechnungen und Fristen gelten im deutschen Alltag klare Normen:\n\n' +
          '- **Zivilrechtliche Fristberechnung (§§ 187, 188 BGB):** Fällt ein auslösendes Ereignis in einen Tag, beginnt die Frist am darauffolgenden Tag. Nach Monaten bestimmte Fristen enden mit dem entsprechenden Kalendertag des Zielmonats.\n' +
          '- **Werktags- und Feiertagsklausel (§ 193 BGB):** Endet eine gesetzliche Frist an einem Samstag, Sonntag oder staatlichen Feiertag, verlängert sich der Abgabetermin automatisch auf den nächsten Werktag.\n' +
          '- **Schaltjahrregeln:** Der gregorianische Kalender fügt alle 4 Jahre einen Schalttag am 29. Februar ein, mit Ausnahme von vollen Jahrhunderten, die nicht durch 400 teilbar sind.',
      },
      {
        title: 'Unterschied zwischen Kalendertagen, Werktagen und Arbeitstagen',
        content:
          'Kalendertage umfassen ausnahmslos alle sieben Tage der Woche. Werktage sind nach deutschem Recht alle Tage außer Sonn- und Feiertagen (Montag bis einschließlich Samstag nach § 3 BUrlG). Arbeitstage hingegen bezeichnen ausschließlich die regulär im Arbeitsvertrag vereinbarten Arbeitstage (üblicherweise Montag bis Freitag).',
      },
    ],
    faqs: [
      {
        question: 'Wie viele Arbeits- und Werktage hat ein reguläres Kalenderjahr in Deutschland?',
        answer:
          'Ein Kalenderjahr umfasst je nach Bundesland und Lage der beweglichen Feiertage ca. 248 bis 253 Arbeitstage (5-Tage-Woche) bzw. ca. 300 bis 305 Werktage (Montag bis Samstag).',
      },
      {
        question: 'Wie wirkt sich die Zeitumstellung auf Stundendifferenzen aus?',
        answer:
          'Am Tag der Umstellung auf die Sommerzeit (letzter Sonntag im März) hat der Tag 23 Stunden; bei der Rückstellung auf Winterzeit (letzter Sonntag im Oktober) hat der Tag 25 Stunden. Bei exakten Stundenberechnungen über diesen Stichtag wird dies berücksichtigt.',
      },
      {
        question: 'Wie definiert das deutsche Recht die Berechnung von Fristen nach Wochen und Monaten (§ 188 BGB)?',
        answer:
          'Eine Frist, die nach Wochen, Monaten oder einem mehrere Monate umfassenden Zeitraum bestimmt ist, endigt nach § 188 Abs. 2 BGB mit dem Ablauf desjenigen Tages der letzten Woche oder des letzten Monats, welcher durch seine Benennung oder seine Zahl dem Tage entspricht, in den das Ereignis fällt.',
      },
    ],
  },

  'kochen-backen': {
    sections: [
      {
        title: 'Dosierung, Temperaturführung & Mengenskalierung in der Küche',
        content:
          'Für verlässliche Ergebnisse beim Kochen und Backen sind exakte Maßstäbe entscheidend:\n\n' +
          '- **Gewicht vs. Volumen:** Da Schüttdichten variieren (1 Liter Mehl wiegt ca. 550 bis 600 g, während 1 Liter Wasser 1.000 g wiegt), liefert das Abwiegen mit einer digitalen Küchenwaage deutlich präzisere Resultate als Messbecher.\n' +
          '- **Backofentemperaturen anpassen:** Umluft / Heißluft verteilt die Wärme durch ein Gebläse intensiver. Als Faustregel gilt: Umluft ca. 20 °C niedriger einstellen als im Rezept für Ober-/Unterhitze angegeben.\n' +
          '- **Zutaten-Temperatur:** Für Rührteige und Emulsionen sollten Eier und Butter zimmertemperiert sein, um ein Gerinnen des Teigs zu verhindern.',
      },
      {
        title: 'Lebensmittelsicherheit und Kerntemperaturen nach BfR',
        content:
          'Das Bundesinstitut für Risikobewertung (BfR) empfiehlt, empfindliche tierische Lebensmittel (insbesondere Geflügel, Hackfleisch und Schweinefleisch) ausreichend durchzugaren. Eine Kerntemperatur von mindestens 70 °C für mindestens 2 Minuten stellt sicher, dass pathogene Keime zuverlässig inaktiviert werden.',
      },
    ],
    faqs: [
      {
        question: 'Wie lässt sich frische Hefe in Trockenhefe umrechnen?',
        answer:
          'Ein Standard-Würfel frische Hefe (42 g) entspricht exakt zwei Päckchen Trockenhefe (à 7 g). Die Formel lautet: Gramm Frischhefe / 3 = Gramm Trockenhefe.',
      },
      {
        question: 'Warum fallen Kuchen beim Backen manchmal in der Mitte ein?',
        answer:
          'Häufige Ursachen sind ein zu früher Öffnen der Ofentür während der ersten Backhälfte, zu viel Triebmittel (Backpulver) oder eine zu hohe Ofentemperatur, bei der die Ränder bereits fest sind, bevor das Zentrum stabilisiert ist.',
      },
      {
        question: 'Wie viel Salz gehört standardmäßig in Kochwasser für Nudeln oder Gemüse?',
        answer:
          'Als klassische Küchenregel gilt: Pro 100 Gramm Nudeln benötigt man 1 Liter Wasser und ca. 10 Gramm Salz (ca. 1 gehäufter Teelöffel). Ein Salzen des Wassers erst kurz vor dem Kochen schont zudem den Topfboden vor Lochfraßkorrosion.',
      },
    ],
  },

  'gesundheit-fitness': {
    sections: [
      {
        title: 'Biometrische Richtwerte & Trainingssteuerung im Alltag',
        content:
          'Biometrische Rechenmodelle bieten fundierte Orientierungspunkte für Fitness und Ernährung:\n\n' +
          '- **Orientierungscharakter statistischer Formeln:** Formeln wie BMI, Mifflin-St.Jeor oder Karvonen-Pulszonen basieren auf bevölkerungsweiten Durchschnittswerten. Individuelle Faktoren wie Muskelanteil, Knochenbau und Stoffwechselaktivität können abweichen.\n' +
          '- **Empfehlungen der Weltgesundheitsorganisation (WHO):** Für Erwachsene empfiehlt die WHO mindestens 150 bis 300 Minuten moderate Ausdaueraktivität oder 75 bis 150 Minuten intensive Belastung pro Woche zur Stärkung des Herz-Kreislauf-Systems.\n' +
          '- **Ausreichende Hydratation:** Als Grundregel der DGE gilt eine tägliche Trinkmenge von ca. 1,5 Litern Wasser oder ungesüßtem Tee, bei sportlicher Aktivität entsprechend mehr.',
      },
      {
        title: 'Wichtiger Hinweis & Abgrenzung zur medizinischen Diagnostik',
        content:
          'Online-Rechner dienen ausschließlich der unverbindlichen Selbstinformation und dem persönlichen Fitnesstracking. Sie ersetzen keinesfalls eine ärztliche Diagnose, therapeutische Behandlung oder professionelle Ernährungsberatung. Bei gesundheitlichen Beschwerden oder vor Aufnahme eines intensiven Trainings ist stets ärztlicher Rat einzuholen.',
      },
    ],
    faqs: [
      {
        question: 'Warum kann der BMI bei sportlichen Menschen irreführend sein?',
        answer:
          'Der BMI berücksichtigt nur Körpergewicht und Körpergröße, unterscheidet aber nicht zwischen Muskel- und Fettmasse. Da Muskelgewebe eine höhere Dichte als Fettgewebe aufweist, können durchtrainierte Personen fälschlicherweise als übergewichtig eingestuft werden.',
      },
      {
        question: 'Wie berechnet sich der maximale Trainingspuls als Faustformel?',
        answer:
          'Die traditionelle Orientierungsformel lautet `220 - Lebensalter` für Männer und `226 - Lebensalter` für Frauen. Für gesundheitsorientiertes Grundlagenausdauertraining wird ein Trainingspuls im Bereich von 60 bis 75 Prozent dieses Maximalwerts empfohlen.',
      },
      {
        question: 'Was ist der Grundumsatz (BMR) im Unterschied zum Leistungsumsatz?',
        answer:
          'Der Grundumsatz (Basal Metabolic Rate) ist die Energiemenge, die der Körper im Ruhezustand zur Aufrechterhaltung der Organfunktionen benötigt. Der Leistungsumsatz umfasst die zusätzliche Energie für körperliche Bewegung und Arbeit.',
      },
    ],
  },

  mathematik: {
    sections: [
      {
        title: 'Mathematische Zusammenhänge, Formeln & Rechenregeln',
        content:
          'Grundlegende mathematische Gesetze gewährleisten verlässliche und reproduzierbare Ergebnisse:\n\n' +
          '- **Definitionsbereiche beachten:** Jede Rechenoperation setzt gültige mathematische Eingabewerte voraus (z. B. keine Division durch Null, reelle Radikanden bei geraden Wurzeln).\n' +
          '- **Punkt-vor-Strich und Klammerregeln:** Operatoren höherer Priorität werden vor Addition und Subtraktion ausgewertet, es sei denn, Klammern erzwingen eine abweichende Auswertungsreihenfolge.\n' +
          '- **Rundungsstandard nach DIN 1333:** Bei mehrstufigen Rechengängen werden Zwischenergebnisse mit voller Rechnergenauigkeit geführt und erst am Ende kaufmännisch gerundet.\n' +
          '- **Plausibilitätsprüfung:** Schätzen Sie vor jeder komplexen Berechnung die Größenordnung des Resultats durch Überschlagsrechnung mit gerundeten Werten ab, um Eingabefehler sofort zu erkennen.',
      },
      {
        title: 'Praxistipps zur Vermeidung typischer Rechenfehler',
        content:
          'Häufige Rechenfehler entstehen durch inkompatible Einheiten oder das Vertauschen von Zähler und Nenner bei Verhältnisgleichungen (z. B. beim Dreisatz). Prüfen Sie vor der Eingabe, ob alle Ausgangsgrößen in konsistente Dimensionen überführt wurden.',
      },
    ],
    faqs: [
      {
        question: 'Wie funktioniert das kaufmännische Runden nach DIN 1333?',
        answer:
          'Nach DIN 1333 wird bei den Endziffern 0, 1, 2, 3 und 4 abgerundet, bei den Ziffern 5, 6, 7, 8 und 9 aufgerundet. Beispiel: 4,124 wird zu 4,12; 4,125 wird zu 4,13.',
      },
      {
        question: 'Was ist der Unterschied zwischen proportionalem und antiproportionalem Dreisatz?',
        answer:
          'Beim proportionalen Dreisatz führt ein Mehr an Ursache zu einem proportionalen Mehr an Wirkung („Je mehr, desto mehr“). Beim antiproportionalen Dreisatz führt ein Mehr an Ursache zu einer verringerten Zielgröße („Je mehr Arbeiter, desto weniger Tage“).',
      },
      {
        question: 'Was besagt der Fundamentalsatz der Arithmetik?',
        answer:
          'Jede natürliche Zahl größer als 1 lässt sich auf eindeutige Weise als Produkt von Primzahlen darstellen. Diese Primfaktorzerlegung bildet die mathematische Grundlage für das Auffinden von ggT (Größter gemeinsamer Teiler) und kgV (Kleinstes gemeinsames Vielfaches).',
      },
    ],
  },

  geometrie: {
    sections: [
      {
        title: 'Geometrische Gesetze, Flächen- & Volumenberechnungen',
        content:
          'Die euklidische Geometrie beschreibt Flächen und dreidimensionale Körper nach festen Lehrsätzen:\n\n' +
          '- **Satz des Pythagoras (a² + b² = c²):** Gilt ausnahmslos in allen rechtwinkligen Dreiecken zur Bestimmung von Hypotenuse oder fehlenden Katheten.\n' +
          '- **Kreis- und Körperkonstante Pi (π ≈ 3,14159):** Bestimmt das Verhältnis von Umfang zu Durchmesser bei Kreisen sowie Oberflächen und Volumina von Zylindern, Kegeln und Kugeln.\n' +
          '- **Einheitenstimmigkeit:** Achten Sie darauf, dass Längenmaße einheitlich (z. B. komplett in Metern oder Millimetern) eingegeben werden, damit die resultierenden Flächen (m²) und Volumina (m³) korrekt dimensioniert sind.',
      },
      {
        title: 'Typische Anwendungsbereiche in Handwerk und Architektur',
        content:
          'Geometrische Formeln bilden das Fundament für Materialkalkulationen im Bauwesen: von Dachflächen- und Fundamentberechnungen über Behältervolumina bis hin zum rechtwinkligen Einmessen von Grundstücken nach der 3-4-5-Methode (pythagoreisches Tripel).',
      },
    ],
    faqs: [
      {
        question: 'Was sind pythagoreische Tripel und warum sind sie nützlich?',
        answer:
          'Ein pythagoreisches Tripel besteht aus drei ganzen Zahlen, die die Gleichung a² + b² = c² exakt erfüllen. Das bekannteste ist 3, 4, 5 (denn 9 + 16 = 25). Handwerker nutzen dies mit Messbändern, um perfekte 90-Grad-Winkel auf Baustellen abzustecken.',
      },
      {
        question: 'Wie rechne ich Quadratmeter (m²) in Kubikmeter (m³) um?',
        answer:
          'Eine direkte Umrechnung ist nicht möglich, da es sich um Fläche (2D) und Volumen (3D) handelt. Das Volumen ergibt sich durch Multiplikation der Grundfläche mit der Bauteildicke bzw. Höhe: `Volumen (m³) = Fläche (m²) × Tiefe/Höhe (m)`.',
      },
      {
        question: 'Was ist die Summe der Innenwinkel in einem Dreieck und Vieleck?',
        answer:
          'In jedem planaren euklidischen Dreieck beträgt die Innenwinkelsumme exakt 180 Grad. Für ein allgemeines konvexes n-Eck (Polygon mit n Ecken) berechnet sich die Winkelsumme nach der mathematischen Formel: `(n - 2) × 180°` (z. B. 360° beim Viereck, 540° beim Fünfeck).',
      },
    ],
  },

  einheiten: {
    sections: [
      {
        title: 'Das metrische SI-System im Vergleich zu imperialen Einheiten',
        content:
          'Wissenschaft und Handel nutzen standardisierte Maßsysteme:\n\n' +
          '- **Metrisches Einheitensystem (SI):** Basiert auf Zehnerpotenzen mit normierten Basiseinheiten (Meter, Gramm, Liter) und Präfixen (Milli, Kilo, Mega).\n' +
          '- **Angloamerikanisches System:** Verwendet historische Maße wie Zoll (Inch), Fuß (Foot), Yard, Meilen, Pfund (lbs) und Unzen (oz), die vor allem im angloamerikanischen Raum verbreitet sind.\n' +
          '- **Exakte Umrechnungsstandards:** 1 Zoll ist international per Definition auf exakt 25,4 mm festgelegt; 1 Meile entspricht exakt 1.609,344 Metern.\n' +
          '- **Dimensionale Homogenität:** Vor jeder Umrechnung muss sichergestellt sein, dass Größen gleicher physikalischer Dimension (z. B. Masse, Länge oder Energie) miteinander verglichen werden.',
      },
      {
        title: 'Bedeutung von Nachkommastellen und Rundung bei Einheiten',
        content:
          'Bei physikalischen Umrechnungen ist auf die Anzahl signifikanter Stellen zu achten, um weder Scheingenauigkeit vorzutäuschen noch durch vorzeitiges Abrunden systematische Fehler in spätere Fertigungsschritte einzuschleusen.',
      },
    ],
    faqs: [
      {
        question: 'Warum unterscheidet sich die US-Gallone von der britischen Imperial Gallon?',
        answer:
          'Eine US liquid gallon entspricht ca. 3,785 Litern, während die britische Imperial Gallon historisch auf ca. 4,546 Liter (das Volumen von 10 Pfund reinem Wasser bei 62 °F) festgelegt wurde.',
      },
      {
        question: 'Wie rechne ich Fahrenheit in Celsius um?',
        answer:
          'Die exakte Formel lautet: `°C = (°F - 32) / 1,8`. Der Gefrierpunkt von Wasser liegt bei 0 °C (32 °F), der Siedepunkt bei 100 °C (212 °F).',
      },
      {
        question: 'Wie ist das Kilogramm physikalisch definiert?',
        answer:
          'Seit der Revision des Internationalen Einheitensystems (SI) im Jahr 2019 wird das Kilogramm nicht mehr über das Ur-Kilogramm aus Platin-Iridium definiert, sondern über eine Naturkonstante: das Plancksche Wirkungsquantum h (6,62607015 × 10⁻³⁴ J·s).',
      },
    ],
  },

  'auto-verkehr': {
    sections: [
      {
        title: 'Verkehrssicherheit, Reaktionswege & Fahrzeugbetriebskosten',
        content:
          'Eine realistische Einschätzung von Fahrzeugdaten schützt Leben und Budget:\n\n' +
          '- **Fahrschulformel für Anhaltewege:** Der Anhalteweg setzt sich aus Reaktionsweg `(Geschwindigkeit / 10) × 3` und dem normalen Bremsweg `(Geschwindigkeit / 10)²` zusammen. Bei einer Gefahrenbremsung halbiert sich der reine Bremsweg.\n' +
          '- **Gesamtkosten eines Pkw (TCO):** Neben Sprit oder Ladestrom machen Wertverlust, Versicherung, Kfz-Steuer und Inspektionen oft über 60 % der tatsächlichen Kilometerkosten aus.\n' +
          '- **Strenge Sanktionen innerorts:** Geschwindigkeitsverstöße innerorts werden im Bußgeldkatalog deutlich härter bestraft; ab 21 km/h Überschreitung droht bereits ein einmonatiges Fahrverbot.',
      },
      {
        title: 'Steuerliche Absetzbarkeit von Fahrten (Entfernungspauschale)',
        content:
          'Für Fahrten zwischen Wohnung und erster Tätigkeitsstätte können Arbeitnehmer die Pendlerpauschale steuerlich geltend machen: 0,30 € je vollen Entfernungskilometer (einfache Strecke) für die ersten 20 km und 0,38 € ab dem 21. Kilometer, unabhängig vom gewählten Verkehrsmittel.',
      },
    ],
    faqs: [
      {
        question: 'Wie funktioniert die 1-%-Regelung bei Dienstwagen?',
        answer:
          'Bei privater Nutzung eines Firmenwagens wird monatlich 1 % des Bruttolistenpreises als geldwerter Vorteil dem zu versteuernden Gehalt zugeschlagen. Für reine Elektroautos sinkt der Satz je nach Kaufpreis auf 0,25 % bzw. 0,5 %.',
      },
      {
        question: 'Welche Promillegrenzen gelten im deutschen Straßenverkehr?',
        answer:
          'Ab 0,5 Promille Blutalkoholkonzentration liegt eine Ordnungswidrigkeit vor (Bußgeld, Punkte, Fahrverbot). Bereits ab 0,3 Promille kann bei Ausfallerscheinungen eine Straftat vorliegen. Für Fahranfänger in der Probezeit und unter 21 Jahren gilt die strikte 0,0-Promille-Grenze.',
      },
      {
        question: 'Welche Mindestprofiltiefe schreibt die StVO für Autoreifen vor?',
        answer:
          'Nach § 36 Abs. 2 StVZO beträgt die gesetzliche Mindestprofiltiefe für Sommer- und Winterreifen in Deutschland 1,6 Millimeter. Der ADAC empfiehlt aus Sicherheitsgründen (Schutz vor Aquaplaning) jedoch mindestens 3 mm bei Sommerreifen und 4 mm bei Winterreifen.',
      },
    ],
  },

  business: {
    sections: [
      {
        title: 'Betriebswirtschaftliche Kennzahlen gezielt steuern',
        content:
          'Für eine nachhaltige Unternehmensführung sind Kennzahlen zur Rentabilität unerlässlich:\n\n' +
          '- **Deckungsbeitragsrechnung:** Der Deckungsbeitrag (Umsatz minus variable Kosten) zeigt, wie viel jedes verkaufte Produkt zur Deckung der Fixkosten beiträgt. Am Break-Even-Point sind alle Fixkosten eingespielt.\n' +
          '- **Liquiditätsüberwachung:** Ausreichendes Working Capital und ein positiver operativer Cashflow sichern die laufende Zahlungsfähigkeit von Unternehmen bei schwankenden Auftragseingängen.\n' +
          '- **Kalkulation von Preisnachlässen:** Rabatte und Skonti schmälern die Handelsspanne überproportional und müssen in der Vorkalkulation fest eingepreist werden.\n' +
          '- **Forderungsmanagement:** Kurze Zahlungsziele und ein konsequentes kaufmännisches Mahnwesen minimieren das Risiko von Zahlungsausfällen und halten die Liquidität im Unternehmen stabil.',
      },
      {
        title: 'Unterschied zwischen Handelsspanne und Kalkulationsaufschlag',
        content:
          'Der Kalkulationsaufschlag bezieht sich auf den Einstandspreis (z. B. 100 € Einkauf + 50 % Aufschlag = 150 € Verkauf). Die Handelsspanne (Marge) berechnet den Gewinnanteil am Verkaufspreis (50 € Marge von 150 € = 33,33 % Spanne).',
      },
    ],
    faqs: [
      {
        question: 'Warum sollte man als Unternehmer Skontofristen immer nutzen?',
        answer:
          'Ein Skontoabzug von 2 % bei Zahlung innerhalb von 10 Tagen statt 30 Tagen Zahlungsziel entspricht einem annualisierten Effektivzins von über 36 %. Die Ausnutzung von Lieferantenskonti ist eine der rentabelsten Liquiditätsmaßnahmen.',
      },
      {
        question: 'Was ist der Unterschied zwischen EBIT und EBITDA?',
        answer:
          'EBIT bezeichnet den operativen Betriebsgewinn vor Zinsen und Steuern. EBITDA klammert zusätzlich alle Abschreibungen auf Sachanlagen und immaterielle Wirtschaftsgüter aus und zeigt das reine operative Ergebnis.',
      },
      {
        question: 'Was versteht man unter dem Return on Investment (ROI)?',
        answer:
          'Der Return on Investment setzt den durch eine Investition erzielten Gewinn ins Verhältnis zum eingesetzten Kapital: `ROI = (Gewinn / Kapitaleinsatz) × 100 %`. Er dient als Spitzenkennzahl zur Bewertung der Rentabilität von Projekten.',
      },
    ],
  },

  'statistik-wissenschaft': {
    sections: [
      {
        title: 'Statistische Kennzahlen, Verteilungen & Testverfahren',
        content:
          'Empirische Datenauswertungen erfordern eine methodisch saubere Interpretation:\n\n' +
          '- **Lagemaße differenziert einsetzen:** Das arithmetische Mittel reagiert empfindlich auf extreme Ausreißer. Bei asymmetrischen Verteilungen spiegelt der Median oft die repräsentativere Mitte wider.\n' +
          '- **Streuungsmaße analysieren:** Standardabweichung und Varianz quantifizieren die Streubreite um den Erwartungswert. Erst Lagemaß und Streuungsmaß zusammen beschreiben den Datensatz vollständig.\n' +
          '- **Statistische Signifikanz (p-Wert):** In wissenschaftlichen Hypothesentests gilt ein Ergebnis meist ab einem Signifikanzniveau von p < 0,05 als statistisch signifikant.\n' +
          '- **Konfidenzintervalle berücksichtigen:** Neben Punktschätzern liefert die Angabe von 95-%-Konfidenzintervallen eine verlässliche Spanne über die Präzision des gemessenen Stichprobenparameters.',
      },
      {
        title: 'Stichprobengröße und Vermeidung von Verzerrungen (Bias)',
        content:
          'Um fundierte Rückschlüsse auf eine Grundgesamtheit zu ziehen, muss die Stichprobe ausreichend groß und unverzerrt erhoben werden. Typische Fehlerquellen sind Selbstselektion (Selection Bias) oder unzureichende Rücklaufquoten bei Befragungen.',
      },
    ],
    faqs: [
      {
        question: 'Was besagt die 68-95-99,7-Regel bei einer Normalverteilung?',
        answer:
          'Bei einer gaußschen Normalverteilung liegen rund 68,3 % aller Messwerte innerhalb von ±1 Standardabweichung um den Mittelwert, rund 95,4 % innerhalb von ±2 und 99,7 % innerhalb von ±3 Standardabweichungen.',
      },
      {
        question: 'Was unterscheidet eine Grundgesamtheit von einer Stichprobe?',
        answer:
          'Die Grundgesamtheit umfasst alle Träger eines Merkmals (z. B. alle Einwohner eines Landes). Eine Stichprobe ist eine gezogene Teilmenge, anhand derer mit statistischen Methoden auf die Gesamtheit geschlossen wird.',
      },
      {
        question: 'Was ist der Unterschied zwischen Korrelation und Kausalität?',
        answer:
          'Eine Korrelation beschreibt lediglich einen statistischen Zusammenhang zwischen zwei Variablen (sie treten gemeinsam auf). Eine Kausalität setzt zwingend eine echte Ursache-Wirkungs-Beziehung voraus.',
      },
    ],
  },

  'familie-schwangerschaft': {
    sections: [
      {
        title: 'Gesetzliche Leistungen und Schutzfristen für Familien',
        content:
          'Das deutsche Sozialrecht unterstützt werdende und junge Eltern mit definierten Schutzrechten:\n\n' +
          '- **Mutterschutzfristen (§ 3 MuSchG):** Beginn regulär 6 Wochen vor dem errechneten Geburtstermin und Ende 8 Wochen nach der Geburt (12 Wochen bei Mehrlings- und Frühgeburten) bei vollem Lohnausgleich.\n' +
          '- **Elternzeit und Elterngeld (BEEG):** Anspruch auf bis zu 3 Jahre Freistellung je Elternteil. Das Basiselterngeld ersetzt 65 % des vorehelichen Nettoeinkommens (max. 1.800 € monatlich).\n' +
          '- **Kindergeld und Unterhalt:** Bundeseinheitliches Kindergeld (255 € monatlich in 2026); Trennungsunterhalt nach der Düsseldorfer Tabelle.\n' +
          '- **Fristen für Anträge wahren:** Elterngeld wird rückwirkend für maximal drei Lebensmonate vor der Antragstellung gezahlt. Reichen Sie die Unterlagen daher zügig nach Erhalt der Geburtsurkunde bei der Elterngeldstelle ein.',
      },
      {
        title: 'Günstigerprüfung zwischen Kindergeld und Kinderfreibetrag',
        content:
          'Das Finanzamt prüft in der jährlichen Steuererklärung automatisch, ob das ausgezahlte monatliche Kindergeld oder der Abzug der steuerlichen Freibeträge (Kinderfreibetrag plus BEA-Freibetrag) für die Eltern eine höhere Steuerersparnis bewirkt.',
      },
    ],
    faqs: [
      {
        question: 'Wie berechnet sich der voraussichtliche Geburtstermin nach der Naegele-Regel?',
        answer:
          'Die erweiterte Naegele-Regel lautet: `Erster Tag der letzten Regelblutung + 7 Tage - 3 Monate + 1 Jahr ± Abweichung der Zykluslänge von 28 Tagen`.',
      },
      {
        question: 'Wann besteht Anspruch auf Unterhaltsvorschuss (UVG)?',
        answer:
          'Alleinerziehende haben Anspruch auf Unterhaltsvorschuss vom Jugendamt, wenn der andere barunterhaltspflichtige Elternteil seiner Unterhaltspflicht nicht oder unvollständig nachkommt.',
      },
      {
        question: 'Wie wird das Elterngeld bei Bezug von Teilzeiteinkommen berechnet?',
        answer:
          'Beim ElterngeldPlus oder Basiselterngeld mit Teilzeittätigkeit (bis zu 32 Wochenstunden) ersetzt das Elterngeld den wegfallenden Netto-Einkommensanteil. Der gesetzliche Mindestbetrag beträgt 300 € (Basiselterngeld) bzw. 150 € (ElterngeldPlus).',
      },
    ],
  },
};

/**
 * Calculates visible word count for a calculator definition.
 */
function getVisibleWordCount(calc: CalculatorDefinition): number {
  const visibleTextBlocks = [
    calc.name,
    calc.h1,
    calc.shortDescription,
    calc.formula,
    calc.formulaExplanation,
    calc.content?.intro || '',
    calc.content?.details || '',
    ...(calc.content?.sections || []).map((s) => `${s.title} ${s.content}`),
    ...(calc.faqs || []).map((f) => `${f.question} ${f.answer}`),
    calc.workedExample
      ? `${calc.workedExample.title || ''} ${calc.workedExample.description || ''} ${calc.workedExample.resultSummary || ''} ${calc.workedExample.result || ''}`
      : '',
    ...(calc.workedExamples || []).map((ex) => `${ex.title || ''} ${ex.description || ''} ${ex.resultSummary || ''} ${ex.result || ''}`),
    ...(calc.trustMeta?.assumptions || []),
    ...(calc.trustMeta?.limitations || []),
    calc.trustMeta?.methodology || '',
    calc.trustMeta?.legalBasis || '',
  ];
  const combinedText = visibleTextBlocks.join(' ');
  const words = combinedText
    .replace(/[*_#`[\]()|]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  return words.length;
}

/**
 * Enriches a calculator definition if its visible editorial content is thin (< 400 words),
 * ensuring every page on rechenhafen.de offers comprehensive, authoritative, people-first guidance.
 */
export function enrichCalculator(calc: CalculatorDefinition): CalculatorDefinition {
  const currentCount = getVisibleWordCount(calc);
  if (currentCount >= 400) {
    return calc;
  }

  const category = calc.category || 'finanzen';
  const enrichment = CATEGORY_ENRICHMENTS[category] || CATEGORY_ENRICHMENTS.finanzen;

  // Clone content safely
  const content = { ...(calc.content || {}) };
  const existingSections = content.sections ? [...content.sections] : [];
  const existingFaqs = calc.faqs ? [...calc.faqs] : [];

  // Add category sections if not already present
  for (const sec of enrichment.sections) {
    if (!existingSections.some((s) => s.title === sec.title)) {
      existingSections.push(sec);
    }
  }

  // Add category FAQs if not already present
  for (const faq of enrichment.faqs) {
    if (!existingFaqs.some((f) => f.question === faq.question)) {
      existingFaqs.push(faq);
    }
  }

  content.sections = existingSections;

  return {
    ...calc,
    content,
    faqs: existingFaqs,
  };
}
