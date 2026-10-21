import { describe, expect, it } from 'vitest';
import { split, STYLES } from '../packages/icons/scripts/build.mjs';
import { luminance, paint } from '../packages/icons/src/color';
import catalog from '../packages/icons/src/catalog.json';
import families from '../packages/icons/src/families.json';
import bold from '../packages/icons/src/data/bold.json';
import boldDuotone from '../packages/icons/src/data/bold-duotone.json';
import broken from '../packages/icons/src/data/broken.json';
import lineDuotone from '../packages/icons/src/data/line-duotone.json';
import linear from '../packages/icons/src/data/linear.json';
import outline from '../packages/icons/src/data/outline.json';
import brandData from '../packages/icons/src/data/families/brands.json';
import flagData from '../packages/icons/src/data/families/flags.json';
import paymentData from '../packages/icons/src/data/families/payments.json';
import flagExport from '../packages/icons/figma/flags/manifest.json';
import uiRoster from '../packages/icons/src/figma-ui-icons.json';

const sets: Record<string, Record<string, string>> = {
  bold,
  'bold-duotone': boldDuotone,
  broken,
  'line-duotone': lineDuotone,
  linear,
  outline,
};

describe('Solar style suffixes', () => {
  it('prefers the longest suffix', () => {
    // `-bold-duotone` also ends with… nothing else, but `bold-duotone` would be
    // read as `bold` if the suffixes were tried in declaration order.
    expect(split('home-bold-duotone')).toEqual({ base: 'home', style: 'bold-duotone' });
    expect(split('home-line-duotone')).toEqual({ base: 'home', style: 'line-duotone' });
    expect(split('home-bold')).toEqual({ base: 'home', style: 'bold' });
  });

  it('keeps hyphenated names intact', () => {
    expect(split('arrow-to-down-left-linear')).toEqual({ base: 'arrow-to-down-left', style: 'linear' });
  });

  it('ignores names carrying no style', () => {
    expect(split('home-smile')).toBeNull();
  });

  it('covers exactly the six Figma modes', () => {
    expect(STYLES.map((s) => s.slug)).toEqual(['bold', 'bold-duotone', 'broken', 'line-duotone', 'linear', 'outline']);
  });
});

describe('icon data', () => {
  it('backs every catalogue entry with geometry in each style it claims', () => {
    const missing: string[] = [];
    for (const icon of catalog.icons) {
      for (const style of icon.styles) {
        if (!sets[style]?.[icon.name]) missing.push(`${icon.name} claims ${style}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('claims every style it actually has geometry for', () => {
    const unlisted: string[] = [];
    for (const [style, set] of Object.entries(sets)) {
      for (const name of Object.keys(set)) {
        const entry = catalog.icons.find((icon) => icon.name === name);
        if (!entry) unlisted.push(`${name} (${style}) is not in the catalogue`);
        else if (!entry.styles.includes(style as never)) unlisted.push(`${name} has ${style} but does not claim it`);
      }
    }
    expect(unlisted).toEqual([]);
  });

  it('leaves no icon without a single style', () => {
    expect(catalog.icons.filter((icon) => icon.styles.length === 0)).toEqual([]);
  });

  it('paints with currentColor rather than a baked fill', () => {
    // A hard-coded fill would ignore the --surface-base-content-* token around it.
    const baked = Object.entries(sets.linear)
      .filter(([, body]) => /fill="#|stroke="#/.test(body))
      .map(([name]) => name);
    expect(baked).toEqual([]);
  });
});

describe('UI icons follow the Figma page', () => {
  const slug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  const roster = uiRoster.categories.flatMap((c) =>
    c.icons.map((item) => (typeof item === 'string' ? { name: item, solar: undefined } : item)),
  );

  it('ships exactly the icons of the Figma page, under their Figma names', () => {
    expect(catalog.icons.length).toBe(1253);
    expect(catalog.icons.map((i) => i.name).sort()).toEqual(roster.map((i) => slug(i.name)).sort());
  });

  it('keeps the Figma categories, in page order', () => {
    expect(catalog.categories).toEqual(uiRoster.categories.map((c) => c.name));
  });

  it('gives every icon a name of its own', () => {
    const names = roster.map((i) => slug(i.name));
    expect(names.filter((n, i) => names.indexOf(n) !== i)).toEqual([]);
  });

  it('draws every icon in all six styles', () => {
    expect(catalog.icons.filter((icon) => icon.styles.length !== 6).map((i) => i.name)).toEqual([]);
  });

  it('takes the icons drawn only in Figma from the Figma export', () => {
    const own = roster.filter((i) => i.solar === null).map((i) => slug(i.name));
    expect(own.length).toBeGreaterThan(0);
    for (const name of own) expect(sets.linear[name], name).toMatch(/currentColor/);
  });
});

describe('family data', () => {
  it('reports counts that match the Figma roster', () => {
    expect(families.flags.total).toBe(197);
    expect(families.brands.total).toBe(24);
    expect(families.payments.total).toBe(676);
  });

  it('never claims more artwork than it holds', () => {
    for (const [name, meta] of Object.entries(families)) {
      expect(meta.resolved, name).toBeLessThanOrEqual(meta.total);
      expect(meta.resolved, name).toBeGreaterThan(0);
      expect(meta.fromFigma, name).toBeLessThanOrEqual(meta.resolved);
    }
  });
});

describe('family artwork from Figma', () => {
  type Artwork = { viewBox: string | null; body: string };
  type Entry = { slug: string; source?: string | null; body: string | null; variants?: Record<string, Artwork> | null };
  const drawn = (items: Entry[], family: string) =>
    items
      .filter((item) => item.source === 'figma')
      .flatMap((item) =>
        (item.variants ? Object.values(item.variants) : [item as Artwork]).map((art) => ({ family, item, art })),
      );
  const all = [
    ...drawn(flagData.items as Entry[], 'flags'),
    ...drawn(paymentData.items as Entry[], 'payments'),
    ...drawn(brandData.items as Entry[], 'brands'),
  ];

  it('draws most entries from the Figma export', () => {
    expect(families.payments.fromFigma).toBeGreaterThan(670);
    expect(families.brands.fromFigma).toBe(24);
    expect(families.flags.fromFigma).toBeGreaterThan(170);
  });

  it('gives every variant its own ids, so icons can share a page', () => {
    // SVGO shortens ids to "a", "b", …; without the per-file prefix two flags
    // on one page would clip each other.
    const bare = all.flatMap(({ family, item, art }) =>
      [...art.body.matchAll(/\bid="([^"]+)"/g)]
        .filter(([, id]) => !id.startsWith(`${family}-${item.slug}--`) && !id.startsWith(`${family}-${item.slug}__`))
        .map(([, id]) => `${item.slug}: ${id}`),
    );
    expect(bare).toEqual([]);
  });

  it('hands monochrome brand marks back to the theme', () => {
    const baked = (brandData.items as Entry[]).filter((item) => JSON.stringify(item.variants).match(/#fafafa/i));
    expect(baked.map((item) => item.slug)).toEqual([]);
  });

  it('leaves flags over the size budget to the fallback', () => {
    const over = new Set(flagExport.overBudget.map((o) => o.slug.split('--')[0]));
    const shipped = (flagData.items as Entry[]).filter((item) => over.has(item.slug) && item.source === 'figma');
    expect(shipped.map((item) => item.slug)).toEqual([]);
  });
});

describe('brand mark colours', () => {
  it('hands pure black and pure white back to the surface', () => {
    expect(paint('#000000')).toBe('currentColor');
    expect(paint('#181717')).toBe('currentColor'); // GitHub
    expect(paint('#ffffff')).toBe('currentColor');
    expect(paint(null)).toBe('currentColor');
  });

  it('keeps a colour that reads on either theme', () => {
    expect(paint('#0866FF')).toBe('#0866FF'); // Facebook
    expect(paint('#1ED760')).toBe('#1ED760'); // Spotify
    expect(paint('#F24E1E')).toBe('#F24E1E'); // Figma
  });

  it('measures luminance on the WCAG scale', () => {
    expect(luminance('#000000')).toBe(0);
    expect(luminance('#ffffff')).toBeCloseTo(1, 5);
    expect(luminance('not-a-colour')).toBe(0.5);
  });
});
