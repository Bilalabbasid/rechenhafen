'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * Renders its children everywhere except on embed pages (/embed/...).
 * Embedded calculators run inside other people's websites, so they must not show the site
 * header/footer, the cookie banner, analytics or ad scripts.
 */
export default function SiteOnly({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/embed/')) return null;
  return <>{children}</>;
}
