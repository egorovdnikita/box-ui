/**
 * Builds the non-Solar icon families of `Box UI | Icons` — Flags, Payments and
 * Brands.
 *
 * The Figma file is the source of truth for *what* belongs to each family: the
 * names and variant properties in `src/figma-families.json` were read straight
 * off the canvas. The geometry comes from the canonical open distributions of
 * the same artwork, exactly the way the UI Icons set takes Solar from
 * `@iconify-json/solar`:
 *
 *   flags     flag-icons (MIT)              — 4x3 country flags by ISO 3166-1
 *   payments  @web3icons/core (MIT) +       — token logos by ticker
 *             cryptocurrency-icons (CC0)
 *   brands    simple-icons (CC0)            — brand marks by slug, with brand colour
 *
 * Emits src/data/families/<family>.json. Items with no upstream match keep
 * their Figma name and get `body: null`, which the UI renders as a monogram —
 * run `npm run icons:figma` to replace the whole set with verbatim Figma SVGs.
 */

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const pkg = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(pkg, 'src', 'data', 'families');
const figma = JSON.parse(readFileSync(join(pkg, 'src', 'figma-families.json'), 'utf8'));

const nodeModules = (...parts) => join(pkg, '..', '..', 'node_modules', ...parts);
const normalise = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/\s*\(([^)]*)\)\s*$/, ' $1')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Pulls the viewBox and inner markup out of an `<svg>` document. */
function unwrap(svg) {
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 24 24';
  const body = svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>[\s\S]*$/, '')
    .replace(/<title>[\s\S]*?<\/title>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return { viewBox, body };
}

// --- Flags -------------------------------------------------------------------

/** Figma spellings that `Intl.DisplayNames` does not resolve on its own. */
const FLAG_ALIASES = {
  'antigua and barbuda': 'ag',
  'bosnia and herzegovina': 'ba',
  'cabo verde': 'cv',
  'congo democratic': 'cd',
  'congo republic': 'cg',
  "cote d'lvoire": 'ci',
  'czech republic': 'cz',
  dijbouti: 'dj',
  myanmar: 'mm',
  palestine: 'ps',
  'saint kitts and nevis': 'kn',
  'saint lucia': 'lc',
  'saint vincent and the grenadines': 'vc',
  'sao tome and principe': 'st',
  'trinidad and tobago': 'tt',
  turkey: 'tr',
  'united states of america': 'us',
  vatican: 'va',
};

function buildFlags() {
  const dir = nodeModules('flag-icons', 'flags', '4x3');
  const codes = readdirSync(dir)
    .filter((f) => f.endsWith('.svg'))
    .map((f) => f.replace('.svg', ''));

  const byName = {};
  const display = new Intl.DisplayNames(['en'], { type: 'region' });
  for (const code of codes) {
    const region = code.toUpperCase();
    let name;
    try {
      name = display.of(region);
    } catch {
      continue;
    }
    if (name && name !== region) byName[normalise(name)] ??= code;
  }
  for (const [name, code] of Object.entries(FLAG_ALIASES)) byName[normalise(name)] = code;

  return figma.families.flags.items.map((name) => {
    const code = byName[normalise(name)] ?? null;
    if (!code) return { slug: slugify(name), name, code: null, viewBox: null, body: null };
    const { viewBox, body } = unwrap(readFileSync(join(dir, `${code}.svg`), 'utf8'));
    return { slug: slugify(name), name, code, viewBox, body };
  });
}

// --- Payments ----------------------------------------------------------------

function buildPayments() {
  const web3Dir = nodeModules('@web3icons', 'core', 'dist', 'svgs', 'tokens', 'branded');
  const web3 = new Map();
  for (const file of readdirSync(web3Dir)) {
    if (!file.endsWith('.svg.js')) continue;
    web3.set(file.replace('.svg.js', '').toLowerCase(), join(web3Dir, file));
  }

  const cryptoDir = nodeModules('cryptocurrency-icons', 'svg', 'color');
  const crypto = new Map();
  for (const file of readdirSync(cryptoDir)) {
    if (file.endsWith('.svg')) crypto.set(file.replace('.svg', '').toLowerCase(), join(cryptoDir, file));
  }

  const seen = new Set();
  const items = [];

  for (const label of figma.families.payments.items) {
    const ticker = label.match(/\(([^)]*)\)\s*$/)?.[1]?.trim() ?? null;
    const name = label.replace(/\s*\([^)]*\)\s*$/, '').trim();
    const slug = slugify(label);
    if (seen.has(slug)) continue;
    seen.add(slug);

    const key = ticker?.toLowerCase();
    let svg = null;
    let source = null;

    if (key && web3.has(key)) {
      // `var TICKER = '<svg …>'` — take the string literal.
      const raw = readFileSync(web3.get(key), 'utf8');
      const literal = raw.match(/'([\s\S]*?)'\s*\n\nexport/) ?? raw.match(/=\s*\n?\s*'([\s\S]*)'/);
      if (literal) {
        svg = literal[1].replace(/\\n/g, '\n').replace(/\\'/g, "'");
        source = 'web3icons';
      }
    }
    if (!svg && key && crypto.has(key)) {
      svg = readFileSync(crypto.get(key), 'utf8');
      source = 'cryptocurrency-icons';
    }

    if (!svg) {
      items.push({ slug, name, ticker, viewBox: null, body: null, source: null });
      continue;
    }
    const { viewBox, body } = unwrap(svg);
    items.push({ slug, name, ticker, viewBox, body, source });
  }

  return items;
}

// --- Brands ------------------------------------------------------------------

/** Figma brand name -> simple-icons slug, where they differ. */
const BRAND_ALIASES = {
  Twitter: 'x',
  Github: 'github',
  imo: null,
  Signal: 'signal',
  'Facebook Messenger': 'messenger',
};

function buildBrands() {
  const si = require('simple-icons');
  const bySlug = new Map();
  for (const icon of Object.values(si)) {
    if (icon && typeof icon === 'object' && icon.slug) bySlug.set(icon.slug, icon);
  }

  return figma.families.brands.items.map((name) => {
    const slug = slugify(name);
    const target = name in BRAND_ALIASES ? BRAND_ALIASES[name] : slug;
    const icon = target ? bySlug.get(target) : null;
    if (!icon) return { slug, name, viewBox: null, body: null, color: null };
    const { viewBox, body } = unwrap(icon.svg);
    return { slug, name, viewBox, body, color: `#${icon.hex}` };
  });
}

// --- Emit --------------------------------------------------------------------

const builders = { flags: buildFlags, payments: buildPayments, brands: buildBrands };

mkdirSync(out, { recursive: true });
const index = {};

for (const [family, build] of Object.entries(builders)) {
  const items = build();
  const meta = figma.families[family];
  const resolved = items.filter((i) => i.body).length;

  writeFileSync(
    join(out, `${family}.json`),
    `${JSON.stringify({ family, viewBoxDefault: '0 0 24 24', items }, null, 0)}\n`,
  );

  index[family] = {
    figmaPage: meta.figmaPage,
    figmaNaming: meta.figmaNaming,
    variantProperty: meta.variantProperty ?? null,
    variants: meta.variants ?? null,
    variantProperties: meta.variantProperties ?? null,
    note: meta.note ?? null,
    total: items.length,
    resolved,
  };

  console.log(`${family.padEnd(9)} ${resolved}/${items.length} with geometry`);
}

writeFileSync(join(pkg, 'src', 'families.json'), `${JSON.stringify(index, null, 2)}\n`);
