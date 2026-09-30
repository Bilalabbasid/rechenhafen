'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getConsentStatus,
  setConsentStatus,
  subscribeToConsentChanges,
  ConsentStatus,
} from '@/lib/analytics/consent';
import { ShieldCheck } from 'lucide-react';

export default function CookieConsentBanner() {
  const [status, setStatus] = useState<ConsentStatus>('pending');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStatus(getConsentStatus());

    const unsubscribe = subscribeToConsentChanges((newStatus) => {
      setStatus(newStatus);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Do not render during SSR or if consent has already been determined
  if (!mounted || status !== 'pending') {
    return null;
  }

  const handleAcceptAll = () => {
    setConsentStatus('granted');
  };

  const handleDecline = () => {
    setConsentStatus('denied');
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Datenschutz- und Cookie-Einstellungen"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
        padding: 'var(--space-4) var(--space-4)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-content-width)',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: '1 1 500px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'inline-flex',
              flexShrink: 0,
              marginTop: '2px',
            }}
            aria-hidden="true"
          >
            <ShieldCheck size={20} />
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: '0.9rem',
                lineHeight: 1.5,
                color: 'var(--color-text-secondary)',
              }}
            >
              <strong style={{ color: 'var(--color-text-primary)' }}>Datenschutz & Reichweitenmessung:</strong>{' '}
              Wir verwenden Google Analytics 4 zur datenschutzkonformen Analyse der Websitenutzung. Es werden
              weder persönliche Daten, Werbeprofile noch Ihre Rechner-Eingaben oder -Ergebnisse übermittelt.
              Weitere Informationen finden Sie in unserer{' '}
              <Link
                href="/datenschutz/"
                style={{
                  color: 'var(--color-primary)',
                  textDecoration: 'underline',
                  fontWeight: 600,
                }}
              >
                Datenschutzerklärung
              </Link>
              .
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={handleDecline}
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'transparent',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            Nur essenzielle Cookies
          </button>
          <button
            type="button"
            onClick={handleAcceptAll}
            style={{
              padding: '8px 18px',
              fontSize: '0.85rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'var(--color-primary)',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(2, 132, 199, 0.3)',
              transition: 'background-color 0.2s',
            }}
          >
            Einverstanden
          </button>
        </div>
      </div>
    </div>
  );
}
