'use client';

import { useState } from 'react';

/** Read-only box with the embed code and a copy button. */
export default function EmbedCodeBox({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div style={{ margin: 'var(--space-3) 0' }}>
      <textarea
        readOnly
        aria-label={`Einbettungscode für ${label}`}
        value={code}
        onFocus={(e) => e.currentTarget.select()}
        rows={6}
        style={{
          width: '100%',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '0.8rem',
          padding: 'var(--space-3)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-surface-hover, #f8fafc)',
          color: 'var(--color-text-primary)',
          resize: 'vertical',
        }}
      />
      <button
        type="button"
        onClick={copy}
        style={{
          marginTop: 'var(--space-2)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-md)',
          border: 'none',
          background: 'var(--color-primary)',
          color: '#fff',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {copied ? 'Kopiert ✓' : 'Code kopieren'}
      </button>
    </div>
  );
}
