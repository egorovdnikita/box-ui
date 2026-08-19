import type { CSSProperties } from 'react';
import type { BrandTone, FamilyIconEntry, FamilyShape } from './families';
import type { IconSize } from './types';

export interface FamilyIconProps {
  /** One entry of a family payload — see `useFamily`. */
  entry: FamilyIconEntry;
  /** `Style` variant: `Shape`, `Rounded` or `Circle` in Figma. */
  shape?: FamilyShape;
  /** Brands only — `Original` paints the brand colour, `Solid` uses `currentColor`. */
  tone?: BrandTone;
  /** `size/base/*` token, or a raw pixel number. */
  size?: IconSize;
  className?: string;
  style?: CSSProperties;
}

function dimension(size: IconSize): string {
  return typeof size === 'number' ? `${size}px` : `var(--box-size-base-${size})`;
}

const RADIUS: Record<FamilyShape, string> = {
  natural: 'var(--box-rounding-base-none)',
  rounded: 'var(--box-rounding-base-xs)',
  circle: 'var(--box-rounding-base-full)',
};

/**
 * Relative luminance of a `#rrggbb` brand colour, per WCAG.
 *
 * Several marks are officially pure black (Apple, X, GitHub, TikTok). Painting
 * those literally makes them vanish on a dark surface, so the near-black and
 * near-white ones defer to `content/base/primary`, which flips with the theme.
 */
function luminance(hex: string): number {
  const value = hex.replace('#', '');
  if (value.length !== 6) return 0.5;
  const channel = (offset: number) => {
    const part = parseInt(value.slice(offset, offset + 2), 16) / 255;
    return part <= 0.03928 ? part / 12.92 : ((part + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

function paint(color: string | null | undefined): string {
  if (!color) return 'currentColor';
  const l = luminance(color);
  return l < 0.06 || l > 0.94 ? 'var(--box-content-base-primary)' : color;
}

/** Two letters, so an entry without upstream artwork still reads as itself. */
function monogram(entry: FamilyIconEntry): string {
  const source = entry.ticker ?? entry.name;
  const words = source.split(/[\s-]+/).filter(Boolean);
  if (entry.ticker) return source.slice(0, 3).toUpperCase();
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

/**
 * Renders one Flags / Payments / Brands entry.
 *
 * Flags are 4:3 artwork, so `circle` and `rounded` crop them the way the Figma
 * variants do; `natural` keeps the full rectangle. Entries with no geometry
 * fall back to a monogram tile rather than an empty box.
 */
export function FamilyIcon({ entry, shape = 'natural', tone = 'original', size = 'm', className, style }: FamilyIconProps) {
  const box = dimension(size);
  const wide = shape === 'natural' && entry.code != null;

  const frame: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 'none',
    width: wide ? `calc(${box} * 4 / 3)` : box,
    height: box,
    borderRadius: RADIUS[shape],
    overflow: 'hidden',
    ...style,
  };

  if (!entry.body) {
    return (
      <span
        className={className}
        title={`${entry.name} — no bundled artwork`}
        style={{
          ...frame,
          background: 'var(--box-control-neutral-secondary)',
          color: 'var(--box-content-base-secondary)',
          border: '1px dashed var(--box-border-base-neutral-hover)',
          fontSize: `calc(${box} * 0.3)`,
          fontWeight: 600,
          letterSpacing: '-0.02em',
        }}
      >
        {monogram(entry)}
      </span>
    );
  }

  const brandColor = tone === 'original' ? paint(entry.color) : 'currentColor';

  return (
    <span className={className} style={frame}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={entry.viewBox ?? '0 0 24 24'}
        width="100%"
        height="100%"
        preserveAspectRatio={shape === 'natural' ? 'xMidYMid meet' : 'xMidYMid slice'}
        role="img"
        aria-label={entry.name}
        focusable="false"
        data-family-icon={entry.slug}
        style={{ display: 'block', color: brandColor, fill: brandColor }}
        // The bodies come from the generated data files, not from user input.
        dangerouslySetInnerHTML={{ __html: entry.body }}
      />
    </span>
  );
}
