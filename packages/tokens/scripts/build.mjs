/**
 * Builds @box-ui/tokens from the Figma Variables dumps.
 *
 *   tokens/figma/*.txt  ->  dist/css/*.css + dist/index.js + dist/index.d.ts + dist/tokens.json
 *
 * The Figma variable graph is preserved 1:1: every alias becomes a `var()`
 * reference, so switching a mode on an element re-resolves the whole chain
 * exactly the way switching a mode does in Figma.
 *
 *   ◉ Primitives            raw literals, one "Value" mode
 *     ^-- ◑ System · Color       named ramps over the palette
 *          ^-- ◑ System · Status      [data-status]      Positive Warning Negative Information
 *     ^-- ☯︎ Brand · Color        [data-accent]      Indigo Lime Yellow Pink Monochrome
 *          ^-- ◑ System · Theme       [data-theme]       Light Dark
 *               ^-- ◑ System · Controls · Appearance  [data-appearance]  Solid Soft Outline
 *                    ^-- ◑ System · Controls · State  [data-state]       Default Hover Active Disabled
 *     ^-- ☯︎ Brand · Rounding     [data-radius]      Low Medium High
 *     ^-- ☯︎ Brand · Typography   [data-font]        Inter, Inter Display, Inter Tight, Inter Variable
 *     ^-- ☯︎ Brand · Icon         [data-icon-style]  Bold … Outline
 *          ^-- ◑ System · Responsive  [data-device]      Desktop Mobile
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { aliasesIn, parseDumps } from './parse-figma.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const pkg = join(here, '..');
const repo = join(pkg, '..', '..');
const dist = join(pkg, 'dist');

const PREFIX = '--box';
const SOURCE = 'https://www.figma.com/design/gbgGmuUBQ7sIfL256KaDXX/Box-UI--Components';

/**
 * How each collection is rendered.
 *   varPrefix — inserted between `--box-` and the slugified variable path
 *   strip     — leading path segment removed before slugifying
 *   switch    — the HTML attribute that selects a mode, plus its default mode
 *   fontStack — string values get the fallback font stack appended
 *
 * The prefixes exist to keep names unique: the same path now lives in several
 * collections, so `varName` asserts uniqueness and the build fails if a future
 * Figma edit introduces a clash.
 */
const LAYERS = {
  'prim-color': { varPrefix: 'palette', strip: 'color', label: 'Палитра' },
  'prim-spacing': { label: 'Отступы' },
  'prim-rounding': { label: 'Скругления' },
  'prim-size': { label: 'Размеры' },
  'prim-type': { varPrefix: 'scale', strip: 'typography', label: 'Типографическая шкала' },

  'sys-color': { varPrefix: 'color', strip: 'color', label: 'Именованные шкалы' },

  'brand-color': {
    varPrefix: 'brand',
    strip: 'color',
    label: 'Акцент',
    switch: { attr: 'data-accent', default: 'Indigo' },
  },
  'brand-rounding': {
    varPrefix: 'radius',
    strip: 'rounding',
    label: 'Скругления',
    switch: { attr: 'data-radius', default: 'Low' },
  },
  'brand-type': {
    varPrefix: 'font',
    strip: 'font-family',
    label: 'Гарнитура',
    fontStack: true,
    switch: { attr: 'data-font', default: 'Inter' },
  },
  'brand-icon': { label: 'Стиль иконок', switch: { attr: 'data-icon-style', default: 'Bold' } },

  'sys-theme': { label: 'Тема', switch: { attr: 'data-theme', default: 'Light' } },
  'sys-responsive': { label: 'Устройство', switch: { attr: 'data-device', default: 'Desktop' } },
  'sys-status': {
    varPrefix: 'status',
    label: 'Статус',
    switch: { attr: 'data-status', default: 'Positive' },
  },
  'sys-appearance': {
    varPrefix: 'control',
    label: 'Вид контрола',
    switch: { attr: 'data-appearance', default: 'Solid' },
  },
  'sys-state': {
    varPrefix: 'state',
    label: 'Состояние контрола',
    switch: { attr: 'data-state', default: 'Default' },
  },
};

/** Emission order. `var()` resolves at use time, so this is for readability. */
const ORDER = [
  'prim-color',
  'prim-spacing',
  'prim-rounding',
  'prim-size',
  'prim-type',
  'sys-color',
  'brand-color',
  'brand-rounding',
  'brand-type',
  'brand-icon',
  'sys-status',
  'sys-theme',
  'sys-responsive',
  'sys-appearance',
  'sys-state',
];

const UNITLESS = /font-weight\//;

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');

// ---------------------------------------------------------------------------

const collections = parseDumps(join(repo, 'tokens', 'figma'));
const byId = Object.fromEntries(collections.map((c) => [c.id, c]));

for (const id of Object.keys(LAYERS)) if (!byId[id]) throw new Error(`No dump for collection "${id}"`);
for (const c of collections) if (!LAYERS[c.id]) throw new Error(`Dump "${c.id}" has no entry in LAYERS`);
if (ORDER.length !== collections.length) throw new Error('ORDER does not cover every collection');

/** css var name -> "<collection>/<path>", so a clash is a build failure. */
const owners = new Map();

function varName(collectionId, path) {
  const layer = LAYERS[collectionId];
  const cleaned = layer.strip ? path.replace(new RegExp(`^${layer.strip}/`), '') : path;
  const name = [PREFIX, layer.varPrefix, slug(cleaned)].filter(Boolean).join('-');
  const owner = `${collectionId}/${path}`;
  const existing = owners.get(name);
  if (existing && existing !== owner) throw new Error(`"${name}" is claimed by both ${existing} and ${owner}`);
  owners.set(name, owner);
  return name;
}

// Name everything up front so a clash fails before any file is written.
for (const id of ORDER) for (const path of Object.keys(byId[id].variables)) varName(id, path);

for (const c of collections)
  for (const [path, v] of Object.entries(c.variables))
    for (const value of Object.values(v.values))
      for (const alias of aliasesIn(value))
        if (!byId[alias.collection].variables[alias.ref])
          throw new Error(`${c.id}/${path} aliases "${alias.collection}:${alias.ref}", which does not exist`);

function cssValue(collectionId, path, value) {
  switch (value.type) {
    case 'color':
      return value.value;
    case 'number':
      return UNITLESS.test(path) ? String(value.value) : `${value.value}px`;
    case 'string':
      return LAYERS[collectionId].fontStack ? `"${value.value}", var(${PREFIX}-font-fallback)` : `"${value.value}"`;
    case 'alias':
      return `var(${varName(value.collection, value.ref)})`;
    case 'alpha':
      // Figma stores "this colour, at N% opacity"; color-mix() is the CSS spelling.
      return `color-mix(in srgb, ${cssValue(collectionId, path, value.base)} ${value.opacity}%, transparent)`;
    default:
      throw new Error(`Unsupported value type "${value.type}" in ${collectionId}/${path}`);
  }
}

const declaration = (collectionId, path, value) =>
  `  ${varName(collectionId, path)}: ${cssValue(collectionId, path, value)};`;

const block = (selectors, lines) => `${selectors.join(',\n')} {\n${lines.join('\n')}\n}\n`;

const modeSlug = (m) => slug(m);

const header = (title) =>
  `/* ${title}\n * Generated by packages/tokens/scripts/build.mjs from tokens/figma/*.txt.\n * Do not edit by hand — edit the Figma Variables, re-export the dumps and re-run\n * \`npm run build -w @box-ui/tokens\`. See tokens/figma/README.md.\n */\n\n`;

// --- primitives.css: every collection with a single "Value" mode ------------

const primitiveCss = [header('Box UI — примитивы и именованные шкалы')];
const primitiveLines = [`  ${PREFIX}-font-fallback: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;`];

for (const id of ORDER) {
  const c = byId[id];
  if (LAYERS[id].switch) continue;
  primitiveLines.push(`\n  /* ${c.figmaName} */`);
  for (const [path, v] of Object.entries(c.variables)) primitiveLines.push(declaration(id, path, v.values[c.modes[0]]));
}
primitiveCss.push(block([':root'], primitiveLines));

// --- theme.css: one block per Figma mode ------------------------------------

const themeCss = [header('Box UI — переключаемые коллекции, по блоку на моду Figma')];

for (const id of ORDER) {
  const c = byId[id];
  const layer = LAYERS[id];
  if (!layer.switch) continue;

  themeCss.push(`/* ${c.figmaName} — [${layer.switch.attr}] */\n`);

  for (const mode of c.modes) {
    const lines = Object.entries(c.variables).map(([path, v]) => declaration(id, path, v.values[mode]));
    const selectors = [`[${layer.switch.attr}="${modeSlug(mode)}"]`];
    // The default mode also lands on :root, at zero specificity so that an
    // explicit attribute anywhere in the tree always wins.
    if (mode === layer.switch.default) selectors.unshift(':where(:root)');
    themeCss.push(block(selectors, lines));
  }
}

// --- controls.css: the State collection, driven by CSS instead of attributes -

const stateCss = [
  header('Box UI — состояния контролов через псевдоклассы'),
  `/* The Figma "State" collection is a mode, so [data-state] switches it. CSS cannot
 * set an attribute on hover, so this file maps the same modes onto the matching
 * pseudo-classes for any element carrying [data-box-control]. Opt in with:
 *   @import "@box-ui/tokens/css/controls.css";
 */\n`,
];
{
  const c = byId['sys-state'];
  const lines = (mode) =>
    Object.entries(c.variables).map(([path, v]) => declaration('sys-state', path, v.values[mode]));
  const enabled = ':not(:disabled):not([aria-disabled="true"])';
  stateCss.push(
    `@media (hover: hover) {\n${block(
      [`  [data-box-control]:hover${enabled}`],
      lines('Hover').map((l) => `  ${l}`),
    )}}\n`,
  );
  stateCss.push(block([`[data-box-control]:active${enabled}`], lines('Active')));
  stateCss.push(block([`[data-box-control]:disabled`, `[data-box-control][aria-disabled="true"]`], lines('Disabled')));
}

/*
 * Status is the one collection Figma varies per *instance* — `Button/Status` is
 * a component set whose Status mode the designer picks on each button. In CSS
 * that does not work by itself: System · Status sits below System · Theme, so
 * every hop from a status token up to a control token is declared inside a
 * `[data-theme]` block and is therefore substituted on whichever ancestor
 * carries `data-theme`. A control that sets only `data-status` would keep the
 * value its ancestor already resolved.
 *
 * So the theme-layer variables that reach System · Status are re-declared here,
 * per theme, on every control — which puts the substitution back on the element
 * that owns the status. The set is the transitive closure computed from the
 * graph, not a hand-written list, so a new status token in Figma is picked up
 * without touching this file.
 */
{
  const theme = byId['sys-theme'];
  const reaches = new Set();
  for (let grew = true; grew;) {
    grew = false;
    for (const [path, v] of Object.entries(theme.variables)) {
      if (reaches.has(path)) continue;
      const hit = Object.values(v.values).some((value) =>
        [...aliasesIn(value)].some(
          (a) => a.collection === 'sys-status' || (a.collection === 'sys-theme' && reaches.has(a.ref)),
        ),
      );
      if (hit) {
        reaches.add(path);
        grew = true;
      }
    }
  }

  const crossings = [...reaches].sort();
  if (!crossings.length) throw new Error('No System · Theme variable reaches System · Status');

  stateCss.push(
    `/* ${crossings.length} переменных «System · Theme», ведущих в «System · Status» —\n * переобъявлены на контроле, чтобы его собственный [data-status] имел смысл. */\n`,
  );
  for (const mode of theme.modes) {
    const lines = crossings.map((path) => declaration('sys-theme', path, theme.variables[path].values[mode]));
    const selectors = [`[data-theme="${modeSlug(mode)}"] [data-box-control]`];
    if (mode === LAYERS['sys-theme'].switch.default) selectors.unshift(':where(:root) [data-box-control]');
    stateCss.push(block(selectors, lines));
  }
}

// --- adaptive.css: let the platform pick a mode when the author has not ------

const adaptive = [header('Box UI — автоматический выбор моды (подключается отдельно)')];
{
  const dark = Object.entries(byId['sys-theme'].variables).map(([p, v]) => declaration('sys-theme', p, v.values.Dark));
  adaptive.push(
    `@media (prefers-color-scheme: dark) {\n${block(
      ['  :root:not([data-theme="light"])'],
      dark.map((l) => `  ${l}`),
    )}}\n`,
  );

  const mobile = Object.entries(byId['sys-responsive'].variables).map(([p, v]) =>
    declaration('sys-responsive', p, v.values.Mobile),
  );
  adaptive.push(
    `@media (max-width: 767px) {\n${block(
      ['  :root:not([data-device="desktop"])'],
      mobile.map((l) => `  ${l}`),
    )}}\n`,
  );
}

const indexCss = `${header('Box UI — все токены')}@import "./primitives.css";\n@import "./theme.css";\n`;

// --- JS / TS ----------------------------------------------------------------

const model = { $source: { figma: SOURCE }, collections: {} };

for (const id of ORDER) {
  const c = byId[id];
  const layer = LAYERS[id];
  model.collections[id] = {
    figmaName: c.figmaName,
    label: layer.label,
    attribute: layer.switch?.attr ?? null,
    defaultMode: layer.switch ? modeSlug(layer.switch.default) : null,
    modes: c.modes.map((m) => ({ name: m, slug: modeSlug(m) })),
    variables: Object.entries(c.variables).map(([path, v]) => ({
      path,
      cssVar: varName(id, path),
      values: Object.fromEntries(
        c.modes.map((m) => {
          const value = v.values[m];
          if (value.type === 'alias')
            return [
              modeSlug(m),
              { alias: `${value.collection}:${value.ref}`, cssVar: varName(value.collection, value.ref) },
            ];
          if (value.type === 'alpha') {
            const base = value.base;
            return [
              modeSlug(m),
              base.type === 'alias'
                ? {
                    alias: `${base.collection}:${base.ref}`,
                    cssVar: varName(base.collection, base.ref),
                    opacity: value.opacity,
                  }
                : { value: base.value, opacity: value.opacity },
            ];
          }
          return [modeSlug(m), { value: value.value }];
        }),
      ),
    })),
  };
}

const switchable = Object.entries(model.collections).filter(([, c]) => c.attribute);
const modeLists = Object.fromEntries(switchable.map(([id, c]) => [id, c.modes.map((m) => m.slug)]));

/** `surface/base/fill/page` -> `tokens.surface.base.fill.page` */
function nest(id) {
  const tree = {};
  for (const v of model.collections[id].variables) {
    const parts = (LAYERS[id].strip ? v.path.replace(new RegExp(`^${LAYERS[id].strip}/`), '') : v.path).split('/');
    let node = tree;
    parts.forEach((part, i) => {
      const key = part.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (i === parts.length - 1) node[key] = `var(${v.cssVar})`;
      else node = node[key] ??= {};
    });
  }
  return tree;
}

const TREES = {
  palette: 'sys-color',
  theme: 'sys-theme',
  accent: 'brand-color',
  status: 'sys-status',
  control: 'sys-appearance',
  state: 'sys-state',
  layout: 'sys-responsive',
  radius: 'brand-rounding',
  typeface: 'brand-type',
};

const js = `${header('Box UI — API токенов')}export const modes = ${JSON.stringify(modeLists, null, 2)};

export const attributes = ${JSON.stringify(Object.fromEntries(switchable.map(([id, c]) => [id, c.attribute])), null, 2)};

export const defaults = ${JSON.stringify(Object.fromEntries(switchable.map(([id, c]) => [id, c.defaultMode])), null, 2)};

/** Токены как готовые \`var()\`-ссылки. */
${Object.entries(TREES)
  .map(([name, id]) => `export const ${name} = ${JSON.stringify(nest(id), null, 2)};`)
  .join('\n\n')}

/** Полный граф переменных Figma — для документации и инструментов. */
export { default as model } from './model.js';
`;

const dts = `${header('Box UI — API токенов')}export declare const modes: {
${Object.entries(modeLists)
  .map(([k, v]) => `  "${k}": ${v.map((m) => `"${m}"`).join(' | ')}[];`)
  .join('\n')}
};
${Object.entries(modeLists)
  .map(
    ([k, v]) =>
      `export type ${k.replace(/(^|-)([a-z])/g, (_, __, ch) => ch.toUpperCase())}Mode = ${v.map((m) => `"${m}"`).join(' | ')};`,
  )
  .join('\n')}

export declare const attributes: Record<string, string>;
export declare const defaults: Record<string, string>;

type TokenTree = { [key: string]: string | TokenTree };
${Object.keys(TREES)
  .map((name) => `export declare const ${name}: TokenTree;`)
  .join('\n')}

export interface TokenVariable {
  path: string;
  cssVar: string;
  values: Record<string, { value?: string | number; alias?: string; cssVar?: string; opacity?: number }>;
}
export interface TokenCollection {
  figmaName: string;
  label: string;
  attribute: string | null;
  defaultMode: string | null;
  modes: { name: string; slug: string }[];
  variables: TokenVariable[];
}
export declare const model: { $source: Record<string, string>; collections: Record<string, TokenCollection> };
`;

// --- write ------------------------------------------------------------------

mkdirSync(join(dist, 'css'), { recursive: true });
writeFileSync(join(dist, 'css', 'primitives.css'), primitiveCss.join(''));
writeFileSync(join(dist, 'css', 'theme.css'), themeCss.join(''));
writeFileSync(join(dist, 'css', 'controls.css'), stateCss.join(''));
writeFileSync(join(dist, 'css', 'adaptive.css'), adaptive.join(''));
writeFileSync(join(dist, 'css', 'index.css'), indexCss);
writeFileSync(join(dist, 'tokens.json'), `${JSON.stringify(model, null, 2)}\n`);
writeFileSync(
  join(dist, 'model.js'),
  `${header('Box UI — граф переменных Figma')}export default ${JSON.stringify(model, null, 2)};\n`,
);
writeFileSync(join(dist, 'index.js'), js);
writeFileSync(join(dist, 'index.d.ts'), dts);

console.log(
  `@box-ui/tokens built — ${collections.length} коллекций, ${owners.size} переменных\n  ` +
    ORDER.map((id) => {
      const c = byId[id];
      const attr = LAYERS[id].switch ? ` [${LAYERS[id].switch.attr}]` : '';
      return `${c.figmaName}${attr}: ${Object.keys(c.variables).length} × ${c.modes.length}`;
    }).join('\n  '),
);
