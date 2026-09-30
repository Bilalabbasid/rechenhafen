'use client';

import React from 'react';
import { setConsentStatus, CONSENT_CHANGED_EVENT } from '@/lib/analytics/consent';
import styles from '@/styles/layout.module.css';

export default function CookieSettingsButton() {
  const handleOpenSettings = () => {
    try {
      window.localStorage.removeItem('rechenhafen_consent_analytics');
      window.dispatchEvent(
        new CustomEvent(CONSENT_CHANGED_EVENT, {
          detail: { status: 'pending' },
        })
      );
    } catch {
      // Ignore
    }
  };

  return (
    <button
      type="button"
      onClick={handleOpenSettings}
      className={styles.footerLink}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        font: 'inherit',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      Cookie-Einstellungen
    </button>
  );
}
