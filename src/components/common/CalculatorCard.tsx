'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Baby,
  BatteryCharging,
  Bike,
  Binary,
  Box,
  BrickWall,
  Briefcase,
  Building2,
  Cake,
  Calculator,
  CalendarDays,
  Candy,
  Car,
  ChartColumn,
  Circle,
  Clock,
  Coffee,
  CookingPot,
  CreditCard,
  Divide,
  Droplets,
  Dumbbell,
  Flame,
  Fuel,
  Gift,
  HandCoins,
  Hammer,
  Heart,
  HeartPulse,
  House,
  Landmark,
  Leaf,
  LucideIcon,
  Maximize2,
  Moon,
  Paintbrush,
  Percent,
  PiggyBank,
  Radical,
  Receipt,
  Ruler,
  Scale,
  Shuffle,
  Sigma,
  Sun,
  Thermometer,
  TrendingDown,
  TrendingUp,
  Triangle,
  Truck,
  Users,
  Utensils,
  Wallet,
  Wheat,
  Wine,
  Zap,
} from 'lucide-react';
import styles from '@/styles/cards.module.css';
import { trackRelatedCalculatorClicked } from '@/lib/analytics/ga4';
import { accentStyle } from '@/lib/ui/categoryAccents';

interface CalculatorCardProps {
  slug: string;
  name: string;
  shortName?: string;
  shortDescription: string;
  category?: string;
  categoryName?: string;
  fromSlug?: string;
}

/**
 * Specific icon per calculator topic, checked in order (most specific first).
 * Anything not matched falls back to the icon of its category.
 */
const ICON_RULES: Array<[RegExp, LucideIcon]> = [
  [/mietrendite|immobilienrendite/, House],
  [/motorrad|wohnmobil|wohnwagen/, Car],
  [/kaffee/, Coffee],
  [/wasser-reis|reis-wasser/, CookingPot],
  [/brutto-netto|netto-brutto|nettolohn/, Wallet],
  [/stundenlohn|stundensatz/, Clock],
  [/abfindung/, HandCoins],
  [/rente|renten|altersvorsorge/, PiggyBank],
  [/prozent|promillerechner|rabatt|skonto/, Percent],
  [/inflation|kaufkraft/, TrendingDown],
  [/zinseszins|rendite|etf|sparplan|dividende|thesaurierend/, TrendingUp],
  [/kredit|darlehen|tilgung|finanzierung|umschuldung|schulden|zinsbindung/, Landmark],
  [/spar|tagesgeld|festgeld/, PiggyBank],
  [/steuer|soli|mwst|afa|abschreibung/, Receipt],
  [/gehalt|lohn|bonus|ueberstunden|minijob|midijob|elterngeld|krankengeld|arbeitslosengeld|buergergeld/, Wallet],
  [/weihnachten|ostern|silvester/, Gift],
  [/alter|geburtstag|lebenszeit|jubilaeum/, Cake],
  [/tage|datum|woche|werktag|arbeitstag|feiertag|monat|kalender/, CalendarDays],
  [/uhrzeit|zeitrechner|stunden|minuten|zeitzone/, Clock],
  [/maut|lkw/, Truck],
  [/e-auto|ladekosten|ladesaeule|wallbox/, BatteryCharging],
  [/fahrrad|jobrad|dienstfahrrad/, Bike],
  [/sprit|benzin|diesel|tank|kraftstoff/, Fuel],
  [/photovoltaik|balkonkraftwerk|solar|pv-/, Sun],
  [/frittier/, CookingPot],
  [/gas|heiz|oel|pellet|waerme/, Flame],
  [/strom|kwh|watt|led|standby|klimaanlage|trockner|spuelmaschine|waschmaschine/, Zap],
  [/wasser/, Droplets],
  [/co2|thg/, Leaf],
  [/auto|kfz|fahrzeug|pendler|fahrt|fahrzeit|anhaenger|reifen/, Car],
  [/blutdruck|puls|herz/, HeartPulse],
  [/bmi|gewicht|koerperfett|taille/, Scale],
  [/one-rep|1rm|kraft|muskel/, Dumbbell],
  [/kalorien|schwimmen|laufen|schritte|sport|grundumsatz/, Activity],
  [/schlaf/, Moon],
  [/alkohol|cocktail|promille/, Wine],
  [/fieber|temperatur/, Thermometer],
  [/schwanger|ssw|geburtstermin|baby|eisprung|zyklus|mutterschutz|empfaengnis|stillen/, Baby],
  [/unterhalt|kindergeld|taschengeld|eltern|grosseltern|schulbedarf/, Users],
  [/miete|miet|nebenkosten|wohnflaeche|immobil|grunderwerb|makler|kaufneben|grundsteuer|erbbau|kaufpreis/, House],
  [/farbe|tapete|lack|anstrich|fassade/, Paintbrush],
  [/beton|estrich|fliesen|putz|mauer|stein|pflaster|kies|splitt|ziegel|moertel|schalung/, BrickWall],
  [/holz|dach|treppe|balken|daemm|laminat|parkett|zaun/, Hammer],
  [/kaffee|tee-/, Coffee],
  [/brot|teig|hefe|mehl|pizza|backen|sauerteig/, Wheat],
  [/zucker|erythrit|suess|marmelade|schokolade/, Candy],
  [/nudel|reis|kochen|garzeit|portion|rezept|fleisch|ei-|eier|frittier|kuehlschrank|lake/, CookingPot],
  [/dreieck|pythagoras|trigonometrie/, Triangle],
  [/kreis|kugel|zylinder|kegel/, Circle],
  [/quader|wuerfel|volumen|pyramide/, Box],
  [/flaeche|umfang|rechteck|quadrat|trapez|parallelogramm|winkel|bogenmass/, Ruler],
  [/binaer|hex|dezimal-|roemisch/, Binary],
  [/wurzel|potenz|logarithmus|exponent/, Radical],
  [/bruch|dreisatz|division|modulo|verhaeltnis/, Divide],
  [/ggt|kgv|prim|teiler|quersumme|fakultaet|fibonacci|zahlen/, Sigma],
  [/statistik|mittel|median|standardabweichung|varianz|wahrscheinlich|korrelation|chi-|bayes|stichprobe|noten/, ChartColumn],
  [/umrechner|einheit|in-cm|zoll|in-gramm|in-ml|cups|meter|liter|dezibel|viskositaet|drehzahl/, Shuffle],
  [/umsatz|gewinn|marge|cashflow|roas|break-even|kapital|working-capital|liquiditaet|preis/, Building2],
];

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'datum-zeit': CalendarDays,
  mathematik: Percent,
  finanzen: TrendingUp,
  'kredit-schulden': CreditCard,
  'wohnen-immobilien': House,
  'haushalt-energie': Zap,
  'auto-verkehr': Car,
  'arbeit-gehalt': Briefcase,
  'steuern-gehalt': Receipt,
  'gesundheit-fitness': Activity,
  'familie-schwangerschaft': Heart,
  'bauen-renovieren': Hammer,
  geometrie: Maximize2,
  einheiten: Shuffle,
  'kochen-backen': Utensils,
  business: Building2,
  'statistik-wissenschaft': ChartColumn,
};

export function resolveIcon(slug: string, category?: string): LucideIcon {
  const s = slug.toLowerCase();
  for (const [pattern, icon] of ICON_RULES) {
    if (pattern.test(s)) return icon;
  }
  return (category && CATEGORY_ICONS[category]) || Calculator;
}

export default function CalculatorCard({
  slug,
  name,
  shortName,
  shortDescription,
  category,
  categoryName,
  fromSlug,
}: CalculatorCardProps) {
  const Icon = resolveIcon(slug, category);
  const displayName = shortName || name;

  const handleClick = () => {
    if (fromSlug) {
      trackRelatedCalculatorClicked(fromSlug, slug);
    }
  };

  return (
    <Link
      href={`/rechner/${slug}/`}
      className={styles.calcCard}
      title={`${displayName} öffnen`}
      onClick={handleClick}
      style={accentStyle(category) as React.CSSProperties}
    >
      <div className={styles.calcCardHeader}>
        <div className={styles.iconWrapper} aria-hidden="true">
          <Icon size={22} strokeWidth={2} />
        </div>
        <h3 className={styles.calcTitle}>{displayName}</h3>
      </div>

      <p className={styles.calcDesc}>{shortDescription}</p>

      <div className={styles.cardFooter}>
        <span className={styles.categoryBadge}>
          {categoryName || category || 'Rechner'}
        </span>
        <span className={styles.actionIndicator} aria-hidden="true">
          <ArrowRight size={16} strokeWidth={2.25} className={styles.actionArrow} />
        </span>
      </div>
    </Link>
  );
}
