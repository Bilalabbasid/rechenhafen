import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import FormattedContent, { renderInlineMarkdown, stripMarkdown } from '@/components/common/FormattedContent';
import { ALL_CALCULATORS, getCalculatorBySlug } from '@/data/calculators';

describe('FormattedContent & Markdown Rendering QA', () => {
  it('renders bold, links, inline code and lists without raw symbols', () => {
    const rawContent = `Die Kosten setzen sich wie folgt zusammen:
- **Verbrauchskosten**: Ihr Energieverbrauch in kWh.
- **Grundpreis**: Eine monatliche Pauschale von \`12,00 €\`.
- **Weitere Infos**: Siehe [Ratgeber](/ratgeber/test/).

Mathematische Formel:
\`Gesamtkosten = kWh × Preis + Grundpreis\`

1. **Schritt 1**: Zählerstand ablesen.
2. **Schritt 2**: Differenz berechnen.`;

    const html = renderToStaticMarkup(<FormattedContent content={rawContent} />);

    // Must NOT contain raw literal markdown symbols
    expect(html).not.toContain('**');
    expect(html).not.toContain('`');
    expect(html).not.toMatch(/<p>[^<]*[-•]\s+/); // No raw bullet inside paragraph
    expect(html).not.toMatch(/<p>[^<]*\d+\.\s+/); // No raw numbered step inside paragraph

    // Must contain semantic HTML elements
    expect(html).toContain('Verbrauchskosten</strong>');
    expect(html).toContain('Grundpreis</strong>');
    expect(html).toContain('12,00 €</code>');
    expect(html).toContain('href="/ratgeber/test');
    expect(html).toContain('<ul');
    expect(html).toContain('<li');
    expect(html).toContain('<ol');
  });

  it('renders Markdown tables cleanly as semantic table elements', () => {
    const tableMarkdown = `| Kirchensteuerstatus | KapESt-Satz | Soli-Satz |
| --- | --- | --- |
| Ohne Kirchensteuer | 25,00 % | 1,375 % |
| Mit Kirchensteuer | 24,51 % | 1,348 % |`;

    const html = renderToStaticMarkup(<FormattedContent content={tableMarkdown} />);

    expect(html).toContain('<table');
    expect(html).toContain('Kirchensteuerstatus</th>');
    expect(html).toContain('Ohne Kirchensteuer</td>');
    expect(html).toContain('25,00 %</td>');
  });

  it('stripMarkdown strips all markdown syntax for clean schema output', () => {
    const input = 'Hier ist **wichtiger Text** mit [`Link`](/url/) und *Kursiv* sowie - Aufzählung.';
    const stripped = stripMarkdown(input);
    expect(stripped).toBe('Hier ist wichtiger Text mit Link und Kursiv sowie Aufzählung.');
  });

  it('verifies that /rechner/gaskostenrechner/ renders without visible raw markdown syntax', () => {
    const calc = getCalculatorBySlug('gaskostenrechner');
    expect(calc).toBeDefined();

    if (calc && calc.content) {
      if (calc.content.intro) {
        const introHtml = renderToStaticMarkup(<FormattedContent content={calc.content.intro} />);
        expect(introHtml).not.toContain('**');
        expect(introHtml).not.toContain('`');
      }

      if (calc.content.sections) {
        for (const sec of calc.content.sections) {
          const secHtml = renderToStaticMarkup(<FormattedContent content={sec.content} />);
          expect(secHtml).not.toContain('**');
          expect(secHtml).not.toContain('`');
          // No unparsed bullets or numbered items inside a paragraph
          expect(secHtml).not.toMatch(/<p>[^<]*\n\s*[-•]/);
        }
      }

      if (calc.content.details) {
        const detailsHtml = renderToStaticMarkup(<FormattedContent content={calc.content.details} />);
        expect(detailsHtml).not.toContain('**');
        expect(detailsHtml).not.toContain('`');
      }
    }
  });

  it('verifies that /rechner/dienstfahrrad-jobrad-rechner/ renders without visible raw markdown syntax', () => {
    const calc = getCalculatorBySlug('dienstfahrrad-jobrad-rechner');
    expect(calc).toBeDefined();

    if (calc && calc.content) {
      if (calc.content.intro) {
        const introHtml = renderToStaticMarkup(<FormattedContent content={calc.content.intro} />);
        expect(introHtml).not.toContain('**');
        expect(introHtml).not.toContain('`');
      }

      if (calc.content.sections) {
        for (const sec of calc.content.sections) {
          const secHtml = renderToStaticMarkup(<FormattedContent content={sec.content} />);
          expect(secHtml).not.toContain('**');
          expect(secHtml).not.toContain('`');
          expect(secHtml).not.toMatch(/<p>[^<]*\n\s*[-•]/);
        }
      }

      if (calc.content.details) {
        const detailsHtml = renderToStaticMarkup(<FormattedContent content={calc.content.details} />);
        expect(detailsHtml).not.toContain('**');
        expect(detailsHtml).not.toContain('`');
      }
    }
  });

  it('automated audit: fails if ANY calculator long-form content renders literal ** or accidental backticks', () => {
    const violations: { slug: string; field: string; sample: string }[] = [];

    for (const calc of ALL_CALCULATORS) {
      if (!calc.content) continue;

      if (calc.content.intro) {
        const html = renderToStaticMarkup(<FormattedContent content={calc.content.intro} />);
        if (html.includes('**') || html.includes('`')) {
          violations.push({ slug: calc.slug, field: 'intro', sample: html.slice(0, 100) });
        }
      }

      if (calc.content.sections) {
        calc.content.sections.forEach((sec, idx) => {
          const html = renderToStaticMarkup(<FormattedContent content={sec.content} />);
          if (html.includes('**') || html.includes('`')) {
            violations.push({ slug: calc.slug, field: `section[${idx}]: ${sec.title}`, sample: html.slice(0, 100) });
          }
        });
      }

      if (calc.content.details) {
        const html = renderToStaticMarkup(<FormattedContent content={calc.content.details} />);
        if (html.includes('**') || html.includes('`')) {
          violations.push({ slug: calc.slug, field: 'details', sample: html.slice(0, 100) });
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
