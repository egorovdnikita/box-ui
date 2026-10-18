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

/**
 * Russian plural agreement: `plural(1301, ['иконка', 'иконки', 'иконок'])`.
 *
 * The counts in the toolbars are data-driven, so they land on every form —
 * 1 301 takes the singular, 22 the paucal, 15 the genitive plural. Getting this
 * wrong is the sort of thing that reads as machine translation.
 */
export function plural(count: number, forms: [string, string, string]): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

/** `count(5, [...])` -> `"5 иконок"`. */
export function counted(count: number, forms: [string, string, string]): string {
  return `${count} ${plural(count, forms)}`;
}
