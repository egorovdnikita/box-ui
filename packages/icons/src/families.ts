import familiesIndex from './families.json';

/** The three non-Solar families of `Box UI | Icons`. */
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

export interface FamilyIconEntry {
  slug: string;
  name: string;
  /** ISO 3166-1 alpha-2, flags only. */
  code?: string | null;
  /** Ticker, payments only. */
  ticker?: string | null;
  /** Brand colour, brands only. */
  color?: string | null;
  viewBox: string | null;
  /** `null` when the family has no upstream artwork for this entry. */
  body: string | null;
  source?: string | null;
}

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
}

/** Per-family counts and variant properties, read off the Figma file. */
export const familyIndex = familiesIndex as unknown as Record<IconFamily, FamilyMeta>;
