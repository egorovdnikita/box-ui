import type { CSSProperties } from 'react';
import { paint } from './color';
import type { BrandTone, FamilyArtwork, FamilyIconEntry, FamilyShape } from './families';
import type { IconSize } from './types';

export interface FamilyIconProps {
  /** One entry of a family payload — see `useFamily`. */
  entry: FamilyIconEntry;
  /** `Style` variant: `Shape`, `Rounded` or `Circle` in Figma. */
  shape?: FamilyShape;
  /** Brands only — `Original` or `Solid`; monochrome marks paint with `currentColor`. */
  tone?: BrandTone;
  /** `size/base/*` token, or a raw pixel number. */
  size?: IconSize;
  className?: string;
  style?: CSSProperties;
}

function dimension(size: IconSize): string {
  return typeof size === 'number' ? `${size}px` : `var(--size-${size})`;
}

const RADIUS: Record<FamilyShape, string> = {
  natural: 'var(--rounding-none)',
  rounded: 'var(--rounding-xs)',
  circle: 'var(--rounding-full)',
};

/**
 * The Figma artwork for a shape and tone: flags key their variants by shape,
 * brands by tone (+ `-circle`), and a Payments mark has just the one.
 */
function variantOf(entry: FamilyIconEntry, shape: FamilyShape, tone: BrandTone): FamilyArtwork | null {
  const variants = entry.variants;
  if (!variants) return entry.source === 'figma' && entry.body ? { viewBox: entry.viewBox, body: entry.body } : null;
  if (variants.natural) return variants[shape] ?? variants.natural;
  return variants[shape === 'circle' ? `${tone}-circle` : tone] ?? null;
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
 * Entries drawn from Figma carry every variant, already in its shape, and are
 * shown as exported. Fallback artwork is masked instead: a 4:3 flag sits in the
 * square as Figma draws it — whole for `natural`, with rounded corners for
 * `rounded`, cropped to a disc for `circle`. Entries with no
 * geometry fall back to a monogram tile rather than an empty box.
 */
export function FamilyIcon({
  entry,
  shape = 'natural',
  tone = 'original',
  size = 'm',
  className,
  style,
}: FamilyIconProps) {
  const box = dimension(size);
  const drawn = variantOf(entry, shape, tone);

  if (drawn) {
    return (
      <span
        className={className}
        style={{
          display: 'inline-flex',
          flex: 'none',
          width: box,
          height: box,
          // Monochrome brand marks paint with currentColor — Figma's surface/base/content/strong.
          color: 'var(--surface-base-content-strong)',
          ...style,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={drawn.viewBox ?? '0 0 24 24'}
          width="100%"
          height="100%"
          fill="none"
          role="img"
          aria-label={entry.name}
          focusable="false"
          data-family-icon={entry.slug}
          style={{ display: 'block' }}
          // The bodies come from the generated data files, not from user input.
          dangerouslySetInnerHTML={{ __html: drawn.body }}
        />
      </span>
    );
  }

  // A fallback flag keeps the Figma geometry: Shape and Rounded are a 4:3 flag
  // centred in the square, Circle fills it.
  const flat = entry.code != null && shape !== 'circle';

  const frame: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 'none',
    width: box,
    height: flat ? `calc(${box} * 3 / 4)` : box,
    marginBlock: flat ? `calc(${box} / 8)` : undefined,
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
          background: 'var(--interaction-neutral-grayscale-soft-fill-default)',
          color: 'var(--surface-base-content-muted)',
          border: '1px dashed var(--surface-base-border-strong)',
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
        preserveAspectRatio={shape === 'natural' && !flat ? 'xMidYMid meet' : 'xMidYMid slice'}
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
