import catalogJson from './catalog.json';
import familiesJson from './figma-families.json';
import type { IconStyle } from './types';

export interface IconCatalogEntry {
  name: string;
  category: string;
  styles: IconStyle[];
}

export interface IconCatalog {
  source: {
    set: string;
    author: string;
    authorUrl: string;
    license: string;
    licenseUrl: string;
    figma: string;
  };
  viewBox: string;
  styles: { slug: IconStyle; figma: string }[];
  categories: string[];
  icons: IconCatalogEntry[];
}

/** Every Solar icon in `Box UI | Icons`, with its category and available styles. */
export const catalog = catalogJson as unknown as IconCatalog;

/**
 * The Flags / Payments / Brands families of the Figma file. Names and variant
 * properties only — see the package README for exporting their geometry.
 */
export const families = familiesJson as {
  $note: string;
  source: string;
  families: Record<
    string,
    {
      figmaPage: string;
      figmaNaming: string;
      variantProperty?: string;
      variants?: string[];
      variantProperties?: Record<string, string[]>;
      note?: string;
      items: string[];
    }
  >;
};
