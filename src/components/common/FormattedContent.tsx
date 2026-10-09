import React from 'react';
import Link from 'next/link';

/**
 * Strips common Markdown tokens to produce clean plain text for schema.org,
 * meta tags, or accessibility attributes.
 */
export function stripMarkdown(text: string): string {
  if (!text) return '';
  return text
    // Links: [label](url) -> label
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Bold: **text** -> text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    // Italic: *text* -> text
    .replace(/\*([^*]+)\*/g, '$1')
    // Inline code: `code` -> code
    .replace(/`([^`]+)`/g, '$1')
    // Headings: ### Title -> Title
    .replace(/^#{1,6}\s+/gm, '')
    // List bullets / numbers: - item or 1. item -> item
    .replace(/^(\s*[-•*]|\s*\d+\.)\s+/gm, '')
    .replace(/\s+[-•*]\s+/g, ' ')
    .trim();
}

/**
 * Parses inline Markdown into safe React nodes.
 * Supports:
 * - Links: [label](href)
 * - Bold: **text**
 * - Italic: *text*
 * - Inline code/formula: `code`
 * Supports nesting (e.g. bold inside links or links inside bold).
 */
export function renderInlineMarkdown(text: string, keyPrefix = 'inline'): React.ReactNode[] {
  if (!text) return [];

  // Match: code, link, bold, italic
  const inlineRegex = /(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlineRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];
    const itemKey = `${keyPrefix}-${match.index}`;

    if (token.startsWith('`') && token.endsWith('`')) {
      const codeContent = token.slice(1, -1);
      elements.push(
        <code
          key={itemKey}
          style={{
            background: 'var(--color-surface-hover, #f1f5f9)',
            border: '1px solid var(--color-border, #e2e8f0)',
            borderRadius: 'var(--radius-xs, 4px)',
            padding: '2px 6px',
            fontSize: '0.9em',
            fontFamily: 'var(--font-mono, monospace)',
            color: 'var(--color-text-primary, #0f172a)',
          }}
        >
          {codeContent}
        </code>
      );
    } else if (token.startsWith('[') && token.includes('](')) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const isExternal = href.startsWith('http://') || href.startsWith('https://');
        if (isExternal) {
          elements.push(
            <a
              key={itemKey}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-primary, #0284c7)', textDecoration: 'underline' }}
            >
              {renderInlineMarkdown(label, `${itemKey}-lbl`)}
            </a>
          );
        } else {
          elements.push(
            <Link
              key={itemKey}
              href={href}
              style={{ color: 'var(--color-primary, #0284c7)', textDecoration: 'underline' }}
            >
              {renderInlineMarkdown(label, `${itemKey}-lbl`)}
            </Link>
          );
        }
      } else {
        elements.push(token);
      }
    } else if (token.startsWith('**') && token.endsWith('**')) {
      const inner = token.slice(2, -2);
      elements.push(
        <strong key={itemKey} style={{ fontWeight: 700, color: 'var(--color-text-primary, #0f172a)' }}>
          {renderInlineMarkdown(inner, `${itemKey}-b`)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      const inner = token.slice(1, -1);
      elements.push(<em key={itemKey}>{renderInlineMarkdown(inner, `${itemKey}-i`)}</em>);
    } else {
      elements.push(token);
    }

    lastIndex = inlineRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements;
}

export function renderFormattedText(text: string): React.ReactNode {
  return renderInlineMarkdown(text);
}

interface BlockParserProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Full semantic Markdown renderer for long-form content.
 * Parses:
 * - Paragraphs
 * - Bullet lists (- or • or *)
 * - Numbered lists (1. , 2. )
 * - Subheadings (### or ##)
 * - Tables (| a | b |\n| --- | --- |\n| c | d |)
 * - Inline formatting (bold, italic, code, links)
 */
export default function FormattedContent({ content, className, style }: BlockParserProps) {
  if (!content) return null;

  // Split into major chunks by double newline
  const chunks = content.split(/\n\s*\n/);
  const renderedBlocks: React.ReactNode[] = [];

  chunks.forEach((chunk, chunkIdx) => {
    const trimmedChunk = chunk.trim();
    if (!trimmedChunk) return;

    // 1. Check if chunk is a Markdown table
    if (trimmedChunk.includes('|') && trimmedChunk.includes('---')) {
      const lines = trimmedChunk
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.startsWith('|') && l.endsWith('|'));
      if (lines.length >= 2) {
        const headerCols = lines[0]
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim());
        const dataRows = lines.slice(2).map((r) =>
          r
            .slice(1, -1)
            .split('|')
            .map((c) => c.trim())
        );

        renderedBlocks.push(
          <div key={`table-${chunkIdx}`} style={{ overflowX: 'auto', margin: 'var(--space-4, 1rem) 0' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.9rem',
                background: 'var(--color-surface, #ffffff)',
                border: '1px solid var(--color-border, #e2e8f0)',
                borderRadius: 'var(--radius-md, 10px)',
              }}
            >
              <thead>
                <tr style={{ background: 'var(--color-surface-hover, #f1f5f9)', textAlign: 'left' }}>
                  {headerCols.map((col, cIdx) => (
                    <th
                      key={cIdx}
                      style={{
                        padding: '10px 14px',
                        borderBottom: '2px solid var(--color-border, #e2e8f0)',
                        fontWeight: 700,
                        color: 'var(--color-text-primary, #0f172a)',
                      }}
                    >
                      {renderInlineMarkdown(col, `th-${chunkIdx}-${cIdx}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((dRow, rIdx) => (
                  <tr key={rIdx} style={{ borderBottom: '1px solid var(--color-border, #e2e8f0)' }}>
                    {dRow.map((cell, cIdx) => (
                      <td key={cIdx} style={{ padding: '9px 14px' }}>
                        {renderInlineMarkdown(cell, `td-${chunkIdx}-${rIdx}-${cIdx}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        return;
      }
    }

    // 2. Parse lines inside the chunk (could contain heading, lead prose, bullet list, numbered list)
    const lines = trimmedChunk.split('\n').map((l) => l.trim());
    let currentParagraph: string[] = [];
    let currentBulletList: string[] = [];
    let currentNumberedList: string[] = [];

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(' ');
        renderedBlocks.push(
          <p key={`p-${chunkIdx}-${renderedBlocks.length}`} style={{ marginBottom: 'var(--space-3, 0.75rem)', lineHeight: 1.65 }}>
            {renderInlineMarkdown(text, `p-${chunkIdx}-${renderedBlocks.length}`)}
          </p>
        );
        currentParagraph = [];
      }
    };

    const flushBulletList = () => {
      if (currentBulletList.length > 0) {
        renderedBlocks.push(
          <ul
            key={`ul-${chunkIdx}-${renderedBlocks.length}`}
            style={{
              paddingLeft: '1.35rem',
              margin: '0 0 var(--space-4, 1rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {currentBulletList.map((item, itIdx) => (
              <li key={itIdx} style={{ lineHeight: 1.6 }}>
                {renderInlineMarkdown(item, `li-${chunkIdx}-${itIdx}`)}
              </li>
            ))}
          </ul>
        );
        currentBulletList = [];
      }
    };

    const flushNumberedList = () => {
      if (currentNumberedList.length > 0) {
        renderedBlocks.push(
          <ol
            key={`ol-${chunkIdx}-${renderedBlocks.length}`}
            style={{
              paddingLeft: '1.35rem',
              margin: '0 0 var(--space-4, 1rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {currentNumberedList.map((item, itIdx) => (
              <li key={itIdx} style={{ lineHeight: 1.6 }}>
                {renderInlineMarkdown(item, `oli-${chunkIdx}-${itIdx}`)}
              </li>
            ))}
          </ol>
        );
        currentNumberedList = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;

      // Heading 3: ### Heading
      if (/^###\s+/.test(line)) {
        flushParagraph();
        flushBulletList();
        flushNumberedList();
        const headingText = line.replace(/^###\s+/, '');
        renderedBlocks.push(
          <h3
            key={`h3-${chunkIdx}-${i}`}
            style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              margin: 'var(--space-6, 1.5rem) 0 var(--space-2, 0.5rem)',
              color: 'var(--color-text-primary, #0f172a)',
            }}
          >
            {renderInlineMarkdown(headingText, `h3-${chunkIdx}-${i}`)}
          </h3>
        );
        continue;
      }

      // Heading 2: ## Heading
      if (/^##\s+/.test(line)) {
        flushParagraph();
        flushBulletList();
        flushNumberedList();
        const headingText = line.replace(/^##\s+/, '');
        renderedBlocks.push(
          <h3
            key={`h2-${chunkIdx}-${i}`}
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              margin: 'var(--space-6, 1.5rem) 0 var(--space-2, 0.5rem)',
              color: 'var(--color-text-primary, #0f172a)',
            }}
          >
            {renderInlineMarkdown(headingText, `h2-${chunkIdx}-${i}`)}
          </h3>
        );
        continue;
      }

      // Bullet list item: - , • , or * (when not italic)
      if (/^[-•]\s+/.test(line) || /^\*\s+/.test(line)) {
        flushParagraph();
        flushNumberedList();
        currentBulletList.push(line.replace(/^[-•*]\s+/, ''));
        continue;
      }

      // Numbered list item: 1. , 2. , etc.
      if (/^\d+\.\s+/.test(line)) {
        flushParagraph();
        flushBulletList();
        currentNumberedList.push(line.replace(/^\d+\.\s+/, ''));
        continue;
      }

      // Regular prose line
      flushBulletList();
      flushNumberedList();
      currentParagraph.push(line);
    }

    flushParagraph();
    flushBulletList();
    flushNumberedList();
  });

  return (
    <div className={className} style={style}>
      {renderedBlocks}
    </div>
  );
}
