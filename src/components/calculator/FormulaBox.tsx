import React from 'react';
import styles from '@/styles/components.module.css';
import { renderInlineMarkdown } from '@/components/common/FormattedContent';

interface Props {
  formula: string;
  formulaExplanation: string;
  category?: string;
}

export default function FormulaBox({ formula, formulaExplanation, category }: Props) {
  let heading = 'Berechnungsformel & Rechenweg';
  if (category === 'kochen-backen') {
    heading = 'Zubereitung, Dosierung & Richtwerte';
  } else if (category === 'gesundheit-fitness') {
    heading = 'Biometrische Formel & Rechenmethode';
  } else if (category === 'datum-uhrzeit') {
    heading = 'Kalendarischer Rechenweg & Zeitlogik';
  } else if (category === 'lifestyle-alltag') {
    heading = 'Berechnungsgrundlage & Richtwerte';
  } else if (category === 'mathematik' || category === 'physik') {
    heading = 'Mathematische Formel & Rechenweg';
  } else if (category === 'finanzen' || category === 'kredit-schulden') {
    heading = 'Finanzmathematische Formel & Modell';
  } else if (category === 'steuern-gehalt' || category === 'arbeit-gehalt' || category === 'recht-steuern') {
    heading = 'Gesetzliche Berechnungsgrundlage & Rechenweg';
  } else if (category === 'bauen-renovieren') {
    heading = 'Materialformel & Flächenberechnung';
  }

  return (
    <section className={styles.formulaSection} aria-labelledby="formel-heading">
      <h2 id="formel-heading" className={styles.sectionTitle}>
        {heading}
      </h2>
      <div className={styles.formulaBox}>
        <code className={styles.formulaCode}>{formula}</code>
      </div>
      <p className={styles.formulaDescription}>{renderInlineMarkdown(formulaExplanation)}</p>
    </section>
  );
}
