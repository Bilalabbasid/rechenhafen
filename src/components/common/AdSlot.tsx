import React from 'react';
import styles from '@/styles/adslot.module.css';

interface AdSlotProps {
  format: 'top-banner' | 'in-content';
  slotId: string;
  className?: string;
}

export default function AdSlot({ format, slotId, className }: AdSlotProps) {
  const containerClass = format === 'top-banner' ? styles.topBanner : styles.inContent;

  return (
    <div
      className={`${styles.adWrapper} ${className || ''}`}
      aria-label="Werbebereich"
      id={`ad-slot-${slotId}`}
    >
      <span className={styles.adLabel}>Anzeige</span>
      <div className={containerClass}>
        <span className={styles.adPlaceholderText}>RechenHafen Werbefläche</span>
      </div>
    </div>
  );
}
