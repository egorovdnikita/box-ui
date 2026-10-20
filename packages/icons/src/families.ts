import familiesIndex from './families.json';

/** The three non-Solar families of Foundation – Core. */
export type IconFamily = 'flags' | 'payments' | 'brands';

export const ICON_FAMILIES: IconFamily[] = ['flags', 'payments', 'brands'];

export const ICON_FAMILY_LABELS: Record<IconFamily, string> = {
  flags: 'Flags',
  payments: 'Payments',
  brands: 'Brands',
};

/** How a family icon is masked — the `Style` variant of the Figma component. */
export type FamilyShape = 'natural' | 'rounded' | 'circle';

export const FAMILY_SHAPE_LABELS: Record<FamilyShape, string> = {
  natural: 'Shape',
  rounded: 'Rounded',
  circle: 'Circle',
};

/** Brands carry a second variant property: the mark's colour treatment. */
export type BrandTone = 'original' | 'solid';

/** One drawn variant: an `<svg>`'s viewBox and inner markup. */
export interface FamilyArtwork {
  viewBox: string | null;
  body: string;
}

export interface FamilyIconEntry {
  slug: string;
  name: string;
  /** ISO 3166-1 alpha-2, flags only. */
  code?: string | null;
  /** Ticker, payments only. */
  ticker?: string | null;
  /** Brand colour, brands only. */
  color?: string | null;
  /**
   * Every Figma variant, when the entry is drawn from the Figma export: flags
   * by `FamilyShape`, brands by `${tone}` / `${tone}-circle`.
   */
  variants?: Record<string, FamilyArtwork> | null;
  viewBox: string | null;
  /**
   * The one artwork of an entry without variants: a Payments mark from Figma,
   * or a fallback from an open distribution that is masked into the requested
   * shape. `null` (with no `variants`) when the entry is drawn nowhere.
   */
  body: string | null;
  /** `figma`, or the open distribution the fallback came from. */
  source?: string | null;
}

/** Whether an entry has any artwork, or renders as a monogram. */
export const hasArtwork = (entry: FamilyIconEntry): boolean => Boolean(entry.variants ?? entry.body);

export interface FamilyData {
  family: IconFamily;
  viewBoxDefault: string;
  items: FamilyIconEntry[];
}

export interface FamilyMeta {
  figmaPage: string;
  figmaNaming: string;
  variantProperty: string | null;
  variants: string[] | null;
  variantProperties: Record<string, string[]> | null;
  note: string | null;
  /** Entries in the Figma file. */
  total: number;
  /** Entries that ship with geometry; the rest render as monograms. */
  resolved: number;
  /** Entries drawn from the Figma export rather than a fallback. */
  fromFigma: number;
}

/** Per-family counts and variant properties, read off the Figma file. */
export const familyIndex = familiesIndex as unknown as Record<IconFamily, FamilyMeta>;
