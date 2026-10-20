#!/usr/bin/env node
/**
 * Exports the non-Solar icon families of Foundation – Core (Flags, Payments,
 * Brands — and optionally the full UI Icons set) straight from Figma as SVG.
 *
 *   FIGMA_TOKEN=figd_xxx node scripts/export-figma-icons.mjs
 *   FIGMA_TOKEN=figd_xxx node scripts/export-figma-icons.mjs --family flags --family brands
 *   FIGMA_TOKEN=figd_xxx node scripts/export-figma-icons.mjs --family ui-icons   # 7.5k nodes, slow
 *
 * Create the token at https://www.figma.com/developers/api#access-tokens with
 * the `file_content:read` scope. Output, committed — `build-families.mjs` reads
 * it:
 *
 *   packages/icons/figma/<family>/<slug>.svg
 *   packages/icons/figma/<family>/manifest.json
 *
 * Every SVG goes through SVGO, and its ids get a per-file prefix so that many
 * icons can sit inline on one page. A file still over BUDGET after that is
 * left out and listed under `overBudget` in the manifest; the build then falls
 * back to open-source artwork for it.
 *
 * The UI Icons set does not need this script — `npm run build:icons` generates
 * it from the canonical Solar distribution.
 */

import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { optimize } from 'svgo';

const FILE_KEY = 'gbgGmuUBQ7sIfL256KaDXX';
const API = 'https://api.figma.com/v1';
const BATCH = 80;
/** Largest optimised SVG we ship; a handful of flags with full coats of arms run to megabytes. */
const BUDGET = 50_000;

const FAMILIES = {
  flags: { page: 'Flags', strip: /^Flags\// },
  payments: { page: 'Payments' },
  brands: { page: 'Brands' },
  'ui-icons': { page: 'System', strip: /^UI icons \// },
};

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const token = process.env.FIGMA_TOKEN;

if (!token) {
  console.error('FIGMA_TOKEN is not set. Create one at https://www.figma.com/developers/api#access-tokens');
  process.exit(1);
}

const requested = process.argv.reduce((acc, arg, i, all) => {
  if (arg === '--family' && all[i + 1]) acc.push(all[i + 1]);
  return acc;
}, []);
const selected = requested.length ? requested : ['flags', 'payments', 'brands'];

for (const name of selected) {
  if (!FAMILIES[name]) {
    console.error(`Unknown family "${name}". Known: ${Object.keys(FAMILIES).join(', ')}`);
    process.exit(1);
  }
}

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/\s*\(([^)]*)\)\s*$/, '-$1')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

async function figma(path) {
  const response = await fetch(`${API}${path}`, { headers: { 'X-Figma-Token': token } });
  if (!response.ok) throw new Error(`Figma ${path} -> ${response.status} ${await response.text()}`);
  return response.json();
}

/** Fetches a rendered SVG, retrying the occasional dropped connection. */
async function download(url, attempts = 4) {
  for (let i = 1; ; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${response.status}`);
      return await response.text();
    } catch (error) {
      if (i >= attempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * i));
    }
  }
}

/**
 * SVGO with short, file-unique ids. A few Figma exports trip `mergePaths` /
 * `convertPathData`; those are retried without the two plugins.
 */
function minify(svg, prefix) {
  const run = (overrides) =>
    optimize(svg, {
      multipass: true,
      floatPrecision: 2,
      plugins: [
        { name: 'preset-default', params: { overrides } },
        { name: 'prefixIds', params: { prefix } },
      ],
    }).data;
  try {
    return run({});
  } catch {
    return run({ mergePaths: false, convertPathData: false });
  }
}

const chunk = (items, size) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, (i + 1) * size));

/** Collect every COMPONENT under a page, flattening COMPONENT_SET variants. */
function collect(node, family, out, setName = null) {
  if (node.type === 'COMPONENT') {
    const variant = setName ? node.name.replace(/^[^=]+=/, '') : null;
    const base = (setName ?? node.name).replace(family.strip ?? /^$/, '').trim();
    // Service components, not icons: `Master` and the `Wrapper` every page carries.
    if (['master', 'wrapper'].includes(base.toLowerCase())) return;
    out.push({ id: node.id, base, variant, name: variant ? `${base} / ${variant}` : base });
    return;
  }
  const nextSet = node.type === 'COMPONENT_SET' ? node.name : setName;
  for (const child of node.children ?? []) collect(child, family, out, nextSet);
}

console.log(`Reading ${FILE_KEY} …`);
// The whole file is far past what one response can hold (Node caps a string at
// 512 MB), so read the page list first and then only the pages we export.
// Geometry is not needed here: the SVG comes from the images endpoint.
const { document } = await figma(`/files/${FILE_KEY}?depth=1`);

for (const familyName of selected) {
  const family = FAMILIES[familyName];
  const stub = document.children.find((p) => p.name.trim() === family.page);
  if (!stub) {
    console.warn(`  page "${family.page}" not found, skipping ${familyName}`);
    continue;
  }
  const page = (await figma(`/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(stub.id)}`)).nodes[stub.id].document;

  const nodes = [];
  collect(page, family, nodes);
  console.log(`${familyName}: ${nodes.length} components on page “${family.page}”`);

  const outDir = join(root, 'packages', 'icons', 'figma', familyName);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const manifest = [];
  const overBudget = [];
  let done = 0;

  // Names that differ only in case or punctuation land on one file; say so
  // rather than let one overwrite the other unnoticed.
  const slugOf = (node) => [slugify(node.base), node.variant && slugify(node.variant)].filter(Boolean).join('--');
  const bySlug = Map.groupBy(nodes, slugOf);
  for (const [slug, same] of bySlug)
    if (same.length > 1)
      console.warn(`  ${slug}.svg: ${same.map((n) => `“${n.name}”`).join(', ')} — one file overwrites the other`);

  for (const batch of chunk(nodes, BATCH)) {
    const ids = batch.map((n) => n.id).join(',');
    const { images } = await figma(
      `/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=svg&svg_outline_text=true`,
    );

    // The rendered SVGs live on S3; a whole batch at once times out, so fetch
    // a few at a time.
    for (const group of chunk(batch, 8)) {
      await Promise.all(
        group.map(async (node) => {
          const url = images[node.id];
          if (!url) return;
          const slug = slugOf(node);
          const svg = minify(await download(url), `${familyName}-${slug}`);
          if (svg.length > BUDGET) {
            overBudget.push({ slug, name: node.name, bytes: svg.length, figmaId: node.id });
            return;
          }
          await writeFile(join(outDir, `${slug}.svg`), svg);
          manifest.push({ slug, name: node.name, base: node.base, variant: node.variant, figmaId: node.id });
        }),
      );
    }

    done += batch.length;
    process.stdout.write(`  ${done}/${nodes.length}\r`);
  }

  manifest.sort((a, b) => a.slug.localeCompare(b.slug));
  overBudget.sort((a, b) => a.slug.localeCompare(b.slug));
  await writeFile(
    join(outDir, 'manifest.json'),
    `${JSON.stringify({ family: familyName, figmaPage: family.page, budget: BUDGET, icons: manifest, overBudget }, null, 2)}\n`,
  );
  console.log(`  wrote ${manifest.length} files to packages/icons/figma/${familyName}/`);
  if (overBudget.length) console.log(`  ${overBudget.length} over ${BUDGET / 1000} KB left out`);
}
