/**
 * Colour maths for the family marks.
 *
 * Several brands are officially pure black — Apple, X, GitHub, TikTok, Medium.
 * Painting those literally makes them disappear on a dark surface, so the
 * near-black and near-white ones defer to `currentColor` and follow whatever
 * they are placed on.
 */

/** Relative luminance of a `#rrggbb` colour, per WCAG. */
export function luminance(hex: string): number {
  const value = hex.replace('#', '');
  if (value.length !== 6) return 0.5;
  const channel = (offset: number) => {
    const part = parseInt(value.slice(offset, offset + 2), 16) / 255;
    return part <= 0.03928 ? part / 12.92 : ((part + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

/** The fill for a brand mark: its own colour, unless that would vanish. */
export function paint(color: string | null | undefined): string {
  if (!color) return 'currentColor';
  const l = luminance(color);
  return l < 0.06 || l > 0.94 ? 'currentColor' : color;
}
