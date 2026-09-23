import React from 'react';
import styles from '@/styles/ratgeber.module.css';
import { RatgeberSection } from '@/types/ratgeber';

interface Props {
  sections: RatgeberSection[];
}

export default function TableOfContents({ sections }: Props) {
  if (!sections || sections.length === 0) return null;

  return (
    <nav className={styles.tocCard} aria-label="Inhaltsverzeichnis">
      <div className={styles.tocTitle}>Inhalt dieser Seite</div>
      <ul className={styles.tocList}>
        {sections.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`} className={styles.tocLink}>
              {section.title}
            </a>
          </li>
        ))}
        <li>
          <a href="#rechenbeispiel" className={styles.tocLink}>
            Praxis-Rechenbeispiel
          </a>
        </li>
        <li>
          <a href="#ratgeber-faq-heading" className={styles.tocLink}>
            Häufige Fragen (FAQ)
          </a>
        </li>
      </ul>
    </nav>
  );
}
