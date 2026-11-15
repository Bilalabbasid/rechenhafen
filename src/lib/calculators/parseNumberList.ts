/**
 * Parses a list of numbers typed by German users.
 *
 * Separators: semicolon, line break, whitespace, and a comma followed by a space ("12, 25").
 * A comma between digits is a decimal comma ("1,5" = 1.5), so "2,3; 1,7" gives [2.3, 1.7].
 * A token with several commas and no spaces ("10,20,30") is read as a comma-separated list.
 * Dots work as decimal points too; "1.234,5" (thousands dot plus decimal comma) gives 1234.5.
 */
export function parseNumberList(raw: string): number[] {
  const tokens = String(raw)
    .split(/[;\n\s]+|,\s+/)
    .flatMap((t) => ((t.match(/,/g) || []).length > 1 ? t.split(',') : [t]))
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
  return tokens
    .map((t) => (t.includes(',') ? t.replace(/\./g, '').replace(',', '.') : t))
    .map(Number)
    .filter((n) => Number.isFinite(n));
}
