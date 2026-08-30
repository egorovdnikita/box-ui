import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseDumps, COLLECTIONS } from '../packages/tokens/scripts/parse-figma.mjs';

const root = join(import.meta.dirname, '..');
const css = (name: string) => readFileSync(join(root, 'packages/tokens/dist/css', name), 'utf8');

const DEFINITION = /^\s*(--box-[a-z0-9-]+)\s*:/gim;
const REFERENCE = /var\(\s*(--box-[a-z0-9-]+)/gi;

const names = (source: string, pattern: RegExp) => {
  const found = new Set<string>();
  for (const match of source.matchAll(pattern)) found.add(match[1]);
  return found;
};

describe('generated CSS', () => {
  const all = css('primitives.css') + css('theme.css');

  it('resolves every var() it references', () => {
    // The whole point of the pipeline is that a Figma alias becomes a var()
    // hop. A hop that lands nowhere is a silently transparent colour or a
    // collapsed length, which is invisible until someone looks at the page.
    const defined = names(all, DEFINITION);
    const referenced = names(all, REFERENCE);
    const dangling = [...referenced].filter((name) => !defined.has(name));

    // Guard the guard: a regex that matched nothing would pass silently.
    expect(defined.size).toBeGreaterThan(500);
    expect(referenced.size).toBeGreaterThan(100);
    expect(dangling).toEqual([]);
  });

  it('defines every primitive on :root, with no mode attribute', () => {
    const primitives = css('primitives.css');
    expect(primitives).toContain(':root');
    expect(primitives).not.toMatch(/\[data-(theme|accent|radius|font|device)/);
  });

  it('emits a block for every mode of every switchable collection', () => {
    const theme = css('theme.css');
    for (const attribute of ['data-theme', 'data-accent', 'data-radius', 'data-font', 'data-device']) {
      expect(theme, `${attribute} has no block`).toContain(`[${attribute}=`);
    }
  });

  it('accepts the Figma spelling of the strongest rounding mode', () => {
    // "Hight" is a typo in the Figma file that the CSS deliberately tolerates.
    expect(css('theme.css')).toMatch(/data-radius="?hight"?/);
  });
});

describe('Figma dumps', () => {
  const collections = parseDumps(join(root, 'tokens/figma'));

  it('parses every collection the mapping declares', () => {
    expect(collections.map((c) => c.id).sort()).toEqual([...new Set(Object.values(COLLECTIONS))].sort());
  });

  it('gives every variable a value in every mode of its collection', () => {
    const gaps: string[] = [];
    for (const collection of collections) {
      for (const [path, variable] of Object.entries(collection.variables)) {
        for (const mode of collection.modes) {
          if (variable.values[mode] === undefined) gaps.push(`${collection.id}/${path} has no ${mode}`);
        }
      }
    }
    expect(gaps).toEqual([]);
  });

  it('points every alias at a variable that exists', () => {
    const known = new Set<string>();
    for (const collection of collections) {
      for (const path of Object.keys(collection.variables)) known.add(path);
    }

    const broken: string[] = [];
    for (const collection of collections) {
      for (const [path, variable] of Object.entries(collection.variables)) {
        for (const value of Object.values(variable.values)) {
          if (value && typeof value === 'object' && 'type' in value && value.type === 'alias') {
            const ref = (value as { ref: string }).ref;
            if (!known.has(ref)) broken.push(`${collection.id}/${path} -> @${ref}`);
          }
        }
      }
    }
    expect(broken).toEqual([]);
  });
});
