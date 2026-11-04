'use client';

import { useEffect } from 'react';
import { EMBED_HEIGHT_MESSAGE } from '@/data/embed';

/** Tells the embedding page how tall the calculator is, so the iframe can grow without scrollbars. */
export default function EmbedHeightReporter({ slug }: { slug: string }) {
  useEffect(() => {
    if (window.parent === window) return;
    let last = 0;
    const send = () => {
      const height = Math.ceil(document.documentElement.scrollHeight);
      if (height === last) return;
      last = height;
      window.parent.postMessage({ type: EMBED_HEIGHT_MESSAGE, slug, height }, '*');
    };
    send();
    const observer = new ResizeObserver(send);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, [slug]);
  return null;
}
