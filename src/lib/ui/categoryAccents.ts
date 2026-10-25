/**
 * Accent colour per calculator category, shared by CalculatorCard (client) and
 * CategoryCard (server). `fg` is used for icons and small badge text (WCAG AA on `bg`),
 * `bg` for soft icon tiles and badges.
 */
export interface CategoryAccent {
  fg: string;
  bg: string;
}

export const CATEGORY_ACCENTS: Record<string, CategoryAccent> = {
  'steuern-gehalt': { fg: '#0369a1', bg: '#e0f2fe' },
  'arbeit-gehalt': { fg: '#4338ca', bg: '#e0e7ff' },
  finanzen: { fg: '#047857', bg: '#d1fae5' },
  'kredit-schulden': { fg: '#0f766e', bg: '#ccfbf1' },
  'wohnen-immobilien': { fg: '#b45309', bg: '#fef3c7' },
  'haushalt-energie': { fg: '#c2410c', bg: '#ffedd5' },
  'auto-verkehr': { fg: '#1d4ed8', bg: '#dbeafe' },
  'datum-zeit': { fg: '#6d28d9', bg: '#ede9fe' },
  mathematik: { fg: '#0e7490', bg: '#cffafe' },
  'gesundheit-fitness': { fg: '#be123c', bg: '#ffe4e6' },
  'familie-schwangerschaft': { fg: '#be185d', bg: '#fce7f3' },
  'bauen-renovieren': { fg: '#57534e', bg: '#f5f5f4' },
  geometrie: { fg: '#4d7c0f', bg: '#ecfccb' },
  einheiten: { fg: '#334155', bg: '#f1f5f9' },
  'kochen-backen': { fg: '#a16207', bg: '#fef9c3' },
  business: { fg: '#a21caf', bg: '#fae8ff' },
  'statistik-wissenschaft': { fg: '#15803d', bg: '#dcfce7' },
};

export const DEFAULT_ACCENT: CategoryAccent = { fg: '#0369a1', bg: '#e0f2fe' };

export function resolveAccent(category?: string): CategoryAccent {
  return (category && CATEGORY_ACCENTS[category]) || DEFAULT_ACCENT;
}

/** Inline style that exposes the accent as CSS custom properties. */
export function accentStyle(category?: string): Record<string, string> {
  const a = resolveAccent(category);
  return { '--card-accent': a.fg, '--card-accent-bg': a.bg };
}
