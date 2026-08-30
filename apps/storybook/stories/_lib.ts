/**
 * Pure helpers behind the docs pages. Kept free of React and of the icon data
 * so they can be exercised on their own — importing `_ui.tsx` would pull in
 * several megabytes of generated JSON.
 */

/**
 * Every whitespace-separated term has to appear somewhere in the record.
 *
 * Icon names are hyphenated, so a plain substring test fails the most natural
 * query there is: "arrow up" does not occur in `alt-arrow-up`. Separators are
 * flattened to spaces on both sides, and the terms are matched independently so
 * word order does not matter either.
 */
export function matches(query: string, ...fields: (string | null | undefined)[]): boolean {
  const terms = query
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean);
  if (terms.length === 0) return true;

  const haystack = fields
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replace(/[-_/]+/g, ' ');

  return terms.every((term) => haystack.includes(term.replace(/[-_/]+/g, ' ')));
}

/** `rgb(59 130 246 / 0.4)` and `rgb(59, 130, 246)` alike -> `#3b82f6` (+ alpha). */
export function toHex(value: string): string {
  const parts = value.match(/[\d.]+/g);
  if (!parts || parts.length < 3) return value;
  const hex = parts
    .slice(0, 3)
    .map((part) => Math.round(Number(part)).toString(16).padStart(2, '0'))
    .join('');
  const alpha =
    parts[3] !== undefined
      ? Math.round(Number(parts[3]) * 255)
          .toString(16)
          .padStart(2, '0')
      : '';
  return `#${hex}${alpha === 'ff' ? '' : alpha}`;
}
