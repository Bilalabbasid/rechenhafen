import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { CategoryGuide as CategoryGuideData } from '@/data/category-guides';
import FaqAccordion from '@/components/calculator/FaqAccordion';

interface Props {
  guide: CategoryGuideData;
  categoryName: string;
  /** slug -> display name of the live calculators, so links never point to retired pages */
  calculatorNames: Record<string, string>;
}

const boxStyle: React.CSSProperties = {
  margin: 'var(--space-8) 0',
  padding: 'var(--space-6)',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
};
const h2Style: React.CSSProperties = { fontSize: '1.25rem', fontWeight: 700, margin: '0 0 var(--space-4)', color: 'var(--color-text-primary)' };

export default function CategoryGuide({ guide, categoryName, calculatorNames }: Props) {
  const questions = guide.questions.filter((q) => calculatorNames[q.slug]);

  return (
    <>
      {questions.length > 0 && (
        <section style={boxStyle} aria-labelledby="category-guide-questions">
          <h2 id="category-guide-questions" style={h2Style}>
            Welcher Rechner passt zu Ihrer Frage?
          </h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '10px' }}>
            {questions.map((q) => (
              <li
                key={q.question}
                style={{ padding: '10px 12px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
              >
                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.4 }}>{q.question}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                  <Link
                    href={`/rechner/${q.slug}/`}
                    style={{ color: 'var(--color-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    {calculatorNames[q.slug]} <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                  {q.hint && <span> – {q.hint}</span>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {guide.keyFacts && guide.keyFacts.rows.length > 0 && (
        <section style={boxStyle} aria-labelledby="category-guide-facts">
          <h2 id="category-guide-facts" style={h2Style}>
            {guide.keyFacts.title}
          </h2>
          {guide.keyFacts.intro && (
            <p style={{ margin: '0 0 var(--space-4)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{guide.keyFacts.intro}</p>
          )}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
              <tbody>
                {guide.keyFacts.rows.map((row) => (
                  <tr key={row.label} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th scope="row" style={{ textAlign: 'left', padding: '8px 10px 8px 0', fontWeight: 600, color: 'var(--color-text-primary)', verticalAlign: 'top' }}>
                      {row.label}
                    </th>
                    <td style={{ padding: '8px 10px', whiteSpace: 'nowrap', color: 'var(--color-text-primary)', verticalAlign: 'top' }}>{row.value}</td>
                    <td style={{ padding: '8px 0 8px 10px', color: 'var(--color-text-secondary)', verticalAlign: 'top' }}>{row.note || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {guide.keyFacts.source && (
            <p style={{ margin: 'var(--space-3) 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Quelle: {guide.keyFacts.source}</p>
          )}
        </section>
      )}

      {guide.faqs.length > 0 && (
        <section style={{ margin: 'var(--space-8) 0' }} aria-labelledby="category-guide-faq">
          <h2 id="category-guide-faq" style={h2Style}>
            Häufige Fragen zu {categoryName}
          </h2>
          <FaqAccordion faqs={guide.faqs} />
        </section>
      )}
    </>
  );
}
