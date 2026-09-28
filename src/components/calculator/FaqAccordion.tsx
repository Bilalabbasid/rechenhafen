import React from 'react';
import Link from 'next/link';
import { FAQItem } from '@/types/calculator';
import styles from '@/styles/components.module.css';

interface Props {
  faqs: FAQItem[];
}

function stripMarkdown(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

function renderFormattedText(text: string) {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  if (!regex.test(text)) return text;

  const elements: (string | React.ReactNode)[] = [];
  let lastIndex = 0;
  regex.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }
    const [, label, href] = match;
    elements.push(
      <Link key={match.index} href={href} style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
        {label}
      </Link>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }
  return elements;
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
              <p>{renderFormattedText(faq.answer)}</p>
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
