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
    // A hard-coded fill would ignore the --box-content-* token around it.
    const baked = Object.entries(sets.linear)
      .filter(([, body]) => /fill="#|stroke="#/.test(body))
      .map(([name]) => name);
    expect(baked).toEqual([]);
  });
});

describe('family data', () => {
  it('reports counts that match the Figma roster', () => {
    expect(families.flags.total).toBe(197);
    expect(families.brands.total).toBe(24);
    // 679 components on the page, four of them repeats.
    expect(families.payments.total).toBe(675);
  });

  it('never claims more artwork than it holds', () => {
    for (const [name, meta] of Object.entries(families)) {
      expect(meta.resolved, name).toBeLessThanOrEqual(meta.total);
      expect(meta.resolved, name).toBeGreaterThan(0);
    }
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
