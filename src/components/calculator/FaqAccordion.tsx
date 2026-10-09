import React from 'react';
import { FAQItem } from '@/types/calculator';
import styles from '@/styles/components.module.css';
import { stripMarkdown, renderInlineMarkdown } from '@/components/common/FormattedContent';

interface Props {
  faqs: FAQItem[];
}

export default function FaqAccordion({ faqs }: Props) {
  if (!faqs || faqs.length === 0) return null;

  // Schema.org FAQPage Struktur mit sauberem Volltext
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripMarkdown(faq.answer),
      },
    })),
  };

  return (
    <section className={styles.faqSection} aria-labelledby="faq-heading">
      <h2 id="faq-heading" className={styles.sectionTitle}>
        Häufig gestellte Fragen (FAQ)
      </h2>

      <div className={styles.faqList}>
        {faqs.map((faq, index) => (
          <details key={index} className={styles.faqItem} open={index === 0}>
            <summary className={styles.faqQuestion}>
              <span>{faq.question}</span>
            </summary>
            <div className={styles.faqAnswer}>
              <p>{renderInlineMarkdown(faq.answer)}</p>
            </div>
          </details>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
    </section>
  );
}
