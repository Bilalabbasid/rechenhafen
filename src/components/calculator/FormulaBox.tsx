import React from 'react';
import styles from '@/styles/components.module.css';

interface Props {
  formula: string;
  formulaExplanation: string;
}

export default function FormulaBox({ formula, formulaExplanation }: Props) {
  return (
    <section className={styles.formulaSection} aria-labelledby="formel-heading">
      <h2 id="formel-heading" className={styles.sectionTitle}>
        Mathematische Formel & Rechenweg
      </h2>
      <div className={styles.formulaBox}>
        <code className={styles.formulaCode}>{formula}</code>
      </div>
      <p className={styles.formulaDescription}>{formulaExplanation}</p>
    </section>
  );
}
