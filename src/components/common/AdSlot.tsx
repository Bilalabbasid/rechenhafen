import React from 'react';
import styles from '@/styles/adslot.module.css';

interface AdSlotProps {
  format: 'top-banner' | 'in-content';
  slotId: string;
  className?: string;
}

export default function AdSlot({ format, slotId, className }: AdSlotProps) {
  // Empty ad placeholders are hidden until live to eliminate CLS and maintain clean UX
  return null;
}
