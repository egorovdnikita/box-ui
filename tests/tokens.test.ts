import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { aliasesIn, parseDumps } from '../packages/tokens/scripts/parse-figma.mjs';

const root = join(import.meta.dirname, '..');
const css = (name: string) => readFileSync(join(root, 'packages/tokens/dist/css', name), 'utf8');

const DEFINITION = /^\s*(--box-[a-z0-9-]+)\s*:/gim;
const REFERENCE = /var\(\s*(--box-[a-z0-9-]+)/gi;

/** Every attribute the generated CSS is expected to switch on. */
const ATTRIBUTES = [
  'data-theme',
  'data-accent',
  'data-radius',
  'data-font',
  'data-device',
  'data-status',
  'data-appearance',
  'data-state',
  'data-icon-style',
];

const names = (source: string, pattern: RegExp) => {
  const found = new Set<string>();
  for (const match of source.matchAll(pattern)) found.add(match[1]);
  return found;
};

describe('generated CSS', () => {
  const all = css('primitives.css') + css('theme.css') + css('controls.css');

  it('resolves every var() it references', () => {
    // The whole point of the pipeline is that a Figma alias becomes a var()
    // hop. A hop that lands nowhere is a silently transparent colour or a
    // collapsed length, which is invisible until someone looks at the page.
    const defined = names(all, DEFINITION);
    const referenced = names(all, REFERENCE);
    const dangling = [...referenced].filter((name) => !defined.has(name));

    // Guard the guard: a regex that matched nothing would pass silently.
    expect(defined.size).toBeGreaterThan(1000);
    expect(referenced.size).toBeGreaterThan(400);
    expect(dangling).toEqual([]);
  });

  it('defines every primitive on :root, with no mode attribute', () => {
    const primitives = css('primitives.css');
    expect(primitives).toContain(':root');
    expect(primitives).not.toMatch(new RegExp(`\\[(${ATTRIBUTES.join('|')})`));
  });

  it('emits a block for every mode of every switchable collection', () => {
    const theme = css('theme.css');
    for (const attribute of ATTRIBUTES) {
      expect(theme, `${attribute} has no block`).toContain(`[${attribute}=`);
    }
  });

  it('puts the default mode on :root at zero specificity', () => {
    // `:where(:root)` so an explicit attribute deeper in the tree always wins,
    // whichever order the two rules happen to be emitted in.
    expect(css('theme.css')).toContain(':where(:root),\n[data-theme="light"]');
  });

  it('spells an opacity override as color-mix rather than a flattened hex', () => {
    // Figma stores these as "that ramp step, at N%". Flattening them would
    // break the alias chain: changing the ramp would no longer move the tint.
    expect(css('primitives.css')).toContain(
      '--box-palette-neutral-alpha-16: color-mix(in srgb, var(--box-palette-neutral-solid-500) 16%, transparent);',
    );
  });

  it('re-declares the theme hops that reach Status on every control', () => {
    // Status is the one collection Figma varies per instance. Those hops are
    // declared inside the [data-theme] blocks, so without this a control that
    // sets its own [data-status] would silently keep its ancestor's sentiment.
    const controls = css('controls.css');
    for (const selector of [
      ':where(:root) [data-box-control]',
      '[data-theme="light"] [data-box-control]',
      '[data-theme="dark"] [data-box-control]',
    ]) {
      expect(controls, `${selector} is missing`).toContain(selector);
    }
    expect(controls).toContain('--box-status-fill-solid: var(--box-status-color-solid-base);');
    expect(controls).toContain('--box-status-fill-solid: var(--box-status-color-solid-low);');
  });

  it('drives control states from pseudo-classes as well as the attribute', () => {
    // CSS cannot set an attribute on hover, so the State collection would be
    // unreachable without this bridge.
    const controls = css('controls.css');
    expect(controls).toContain('[data-box-control]:hover');
    expect(controls).toContain('[data-box-control]:active');
    expect(controls).toContain('[data-box-control]:disabled');
  });
});

describe('Figma dumps', () => {
  const collections = parseDumps(join(root, 'tokens/figma'));
  const byId = Object.fromEntries(collections.map((c) => [c.id, c]));

  it('parses every collection in the Figma file', () => {
    expect(collections.map((c) => c.id).sort()).toEqual([
      'brand-color',
      'brand-icon',
      'brand-rounding',
      'brand-type',
      'prim-color',
      'prim-rounding',
      'prim-size',
      'prim-spacing',
      'prim-type',
      'sys-appearance',
      'sys-color',
      'sys-responsive',
      'sys-state',
      'sys-status',
      'sys-theme',
    ]);
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

  it('points every alias at a variable that exists in the collection it names', () => {
    // `color/alpha/16` is a real variable in both brand-color and sys-status,
    // so an alias is only resolvable together with its collection prefix.
    const broken: string[] = [];
    for (const collection of collections) {
      for (const [path, variable] of Object.entries(collection.variables)) {
        for (const value of Object.values(variable.values)) {
          for (const alias of aliasesIn(value)) {
            if (!byId[alias.collection]?.variables[alias.ref])
              broken.push(`${collection.id}/${path} -> @${alias.collection}:${alias.ref}`);
          }
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it('has at least one path that two collections both use', () => {
    // Guards the reason aliases carry a collection at all: if this ever stops
    // being true, the prefix is no longer load-bearing and the test above is
    // not testing what it claims to.
    const owners = new Map<string, string[]>();
    for (const collection of collections) {
      for (const path of Object.keys(collection.variables)) {
        owners.set(path, [...(owners.get(path) ?? []), collection.id]);
      }
    }
    const shared = [...owners].filter(([, ids]) => ids.length > 1);
    expect(shared.length).toBeGreaterThan(0);
  });
});
