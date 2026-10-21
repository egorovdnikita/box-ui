/**
 * Builds @box-ui/icons.
 *
 * The roster of the UI Icons set — categories and names, in page order — is
 * `src/figma-ui-icons.json`, read from the `System` page of Foundation – Core.
 * Each icon has six `Style` variants (Bold, Bold Duotone, Broken, Line Duotone,
 * Linear, Outline). Geometry comes from the Figma export in
 * `figma/ui-icons/` where there is one, and otherwise from the canonical Solar
 * distribution (`@iconify-json/solar`, CC BY 4.0) the set is drawn from: the
 * Solar icon of the same name, or the one the roster names in `solar` where
 * the file calls it something else. Emits:
 *
 *   src/data/<style>.json   { "<icon>": "<svg body>" }   — one file per Figma Style mode
 *   src/catalog.json        { styles, categories, icons } — the gallery index
 *
 * Every icon is 24×24 and paints with `currentColor`, so it inherits
 * `--surface-base-content-*` like any other Box UI surface.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const pkg = join(here, '..');

/** Figma `Style` variant -> Solar file suffix. Order matches the Figma variant order. */
export const STYLES = [
  { slug: 'bold', figma: 'Bold', suffix: '-bold' },
  { slug: 'bold-duotone', figma: 'Bold Duotone', suffix: '-bold-duotone' },
  { slug: 'broken', figma: 'Broken', suffix: '-broken' },
  { slug: 'line-duotone', figma: 'Line Duotone', suffix: '-line-duotone' },
  { slug: 'linear', figma: 'Linear', suffix: '-linear' },
  { slug: 'outline', figma: 'Outline', suffix: '-outline' },
];

// Longest suffix first so `-bold-duotone` is never mistaken for `-bold`.
const MATCHERS = [...STYLES].sort((a, b) => b.suffix.length - a.suffix.length);

const iconSet = require('@iconify-json/solar/icons.json');
const info = require('@iconify-json/solar/info.json');

/** Resolve iconify aliases down to a concrete body. */
function bodyOf(name, seen = new Set()) {
  if (iconSet.icons[name]) return iconSet.icons[name].hidden ? null : iconSet.icons[name].body;
  const alias = iconSet.aliases?.[name];
  if (!alias || seen.has(name)) return null;
  seen.add(name);
  return bodyOf(alias.parent, seen);
}

/**
 * Solar renamed some icons and keeps the old name as an alias — but only for
 * the styles that existed then. Old base name -> new base name, so every style
 * resolves.
 */
const renamed = {};
for (const [name, alias] of Object.entries(iconSet.aliases ?? {})) {
  const from = split(name);
  const to = split(alias.parent);
  if (from && to && from.base !== to.base) renamed[from.base] = to.base;
}

/** Solar geometry for an icon in one style, following a rename if needed. */
function solarBody(base, style) {
  return bodyOf(`${base}${style.suffix}`) ?? (renamed[base] ? bodyOf(`${renamed[base]}${style.suffix}`) : null);
}

export function split(name) {
  for (const style of MATCHERS) {
    if (name.endsWith(style.suffix)) return { base: name.slice(0, -style.suffix.length), style: style.slug };
  }
  return null;
}

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** An exported Figma SVG as an inline body: no wrapper, painted with currentColor. */
function figmaBody(file) {
  return readFileSync(file, 'utf8')
    .replace(/^[\s\S]*?<svg[^>]*>|<\/svg>\s*$/g, '')
    .replace(/#fafafa/gi, 'currentColor')
    .trim();
}

/**
 * Reads the Figma roster and writes the per-style payloads.
 *
 * Guarded so the module can be imported for `STYLES` and `split()` without
 * rebuilding anything as a side effect — a test that regenerates the fixtures
 * it is checking proves nothing.
 */
export function build() {
  const roster = JSON.parse(readFileSync(join(pkg, 'src', 'figma-ui-icons.json'), 'utf8'));
  const exported = join(pkg, 'figma', 'ui-icons');

  const data = Object.fromEntries(STYLES.map((s) => [s.slug, {}]));
  const icons = [];
  const fromFigma = new Set();

  for (const category of roster.categories) {
    for (const item of category.icons) {
      const { name: figmaName, solar } = typeof item === 'string' ? { name: item, solar: undefined } : item;
      const name = slugify(figmaName);
      const file = slugify(`${category.name} / ${figmaName}`);
      const styles = [];
      for (const style of STYLES) {
        const svg = join(exported, `${file}--${style.slug}.svg`);
        let body = null;
        if (existsSync(svg)) {
          body = figmaBody(svg);
          fromFigma.add(name);
        } else if (solar !== null) {
          body = solarBody(solar ?? name, style);
        }
        if (!body) continue;
        data[style.slug][name] = body;
        styles.push(style.slug);
      }
      if (!styles.length) throw new Error(`${category.name} / ${figmaName}: no geometry in Figma export or Solar`);
      icons.push({ name, category: category.name, styles });
    }
  }

  const catalog = {
    source: {
      set: info.name,
      author: info.author.name,
      authorUrl: info.author.url,
      license: info.license.title,
      licenseUrl: info.license.url,
      figma: roster.source,
    },
    viewBox: `0 0 ${iconSet.width ?? 24} ${iconSet.height ?? 24}`,
    styles: STYLES.map(({ slug, figma }) => ({ slug, figma })),
    categories: roster.categories.map((c) => c.name),
    icons: icons.sort((a, b) => a.name.localeCompare(b.name)),
  };

  mkdirSync(join(pkg, 'src', 'data'), { recursive: true });
  for (const style of STYLES) {
    writeFileSync(join(pkg, 'src', 'data', `${style.slug}.json`), `${JSON.stringify(data[style.slug])}\n`);
  }
  writeFileSync(join(pkg, 'src', 'catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`);

  // Named exports keep `import { ArrowUp } from '@box-ui/icons/names'` honest in TS.
  const names = catalog.icons.map((i) => i.name);
  writeFileSync(
    join(pkg, 'src', 'names.ts'),
    `// Generated by scripts/build.mjs — do not edit.\nexport type IconName =\n${names.map((n) => `  | '${n}'`).join('\n')};\n\nexport const iconNames: IconName[] = ${JSON.stringify(names)};\n`,
  );

  const perStyle = STYLES.map((s) => `${s.figma}: ${Object.keys(data[s.slug]).length}`).join(', ');
  console.log(
    `@box-ui/icons built\n  ${catalog.icons.length} icons in ${catalog.categories.length} categories, ${fromFigma.size} drawn from the Figma export\n  ${perStyle}`,
  );

  // Flags / Payments / Brands are built by build-families.mjs from their own roster.
  const families = JSON.parse(readFileSync(join(pkg, 'src', 'figma-families.json'), 'utf8'));
  console.log(
    `  families: ${Object.entries(families.families)
      .map(([k, v]) => `${k} ${v.items.length}`)
      .join(', ')}`,
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) build();
