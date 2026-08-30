#!/usr/bin/env node
/**
 * Exports the non-Solar icon families of `Box UI | Icons` (Flags, Payments,
 * Brands — and optionally the full UI Icons set) straight from Figma as SVG.
 *
 *   FIGMA_TOKEN=figd_xxx node scripts/export-figma-icons.mjs
 *   FIGMA_TOKEN=figd_xxx node scripts/export-figma-icons.mjs --family flags --family brands
 *   FIGMA_TOKEN=figd_xxx node scripts/export-figma-icons.mjs --family ui-icons   # 7.5k nodes, slow
 *
 * Create the token at https://www.figma.com/developers/api#access-tokens with
 * the `file_content:read` scope. Output:
 *
 *   packages/icons/src/data/<family>/<slug>.svg
 *   packages/icons/src/data/<family>/manifest.json
 *
 * The UI Icons set does not need this script — `npm run build:icons` generates
 * it from the canonical Solar distribution.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FILE_KEY = '9pupgeWag4Ssc7jdAYvXMt';
const API = 'https://api.figma.com/v1';
const BATCH = 80;

const FAMILIES = {
  flags: { page: 'Flags', strip: /^Flags\// },
  payments: { page: 'Payments' },
  brands: { page: 'Brands' },
  'ui-icons': { page: 'Icon', strip: /^UI icons \// },
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

const chunk = (items, size) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, (i + 1) * size));

/** Collect every COMPONENT under a page, flattening COMPONENT_SET variants. */
function collect(node, family, out, setName = null) {
  if (node.type === 'COMPONENT') {
    const variant = setName ? node.name.replace(/^[^=]+=/, '') : null;
    const base = (setName ?? node.name).replace(family.strip ?? /^$/, '').trim();
    if (base.toLowerCase() === 'master') return;
    out.push({ id: node.id, base, variant, name: variant ? `${base} / ${variant}` : base });
    return;
  }
  const nextSet = node.type === 'COMPONENT_SET' ? node.name : setName;
  for (const child of node.children ?? []) collect(child, family, out, nextSet);
}

console.log(`Reading ${FILE_KEY} …`);
const file = await figma(`/files/${FILE_KEY}?geometry=paths`);

for (const familyName of selected) {
  const family = FAMILIES[familyName];
  const page = file.document.children.find((p) => p.name === family.page);
  if (!page) {
    console.warn(`  page "${family.page}" not found, skipping ${familyName}`);
    continue;
  }

  const nodes = [];
  collect(page, family, nodes);
  console.log(`${familyName}: ${nodes.length} components on page “${family.page}”`);

  const outDir = join(root, 'packages', 'icons', 'src', 'data', familyName);
  await mkdir(outDir, { recursive: true });

  const manifest = [];
  let done = 0;

  for (const batch of chunk(nodes, BATCH)) {
    const ids = batch.map((n) => n.id).join(',');
    const { images } = await figma(
      `/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=svg&svg_outline_text=true`,
    );

    await Promise.all(
      batch.map(async (node) => {
        const url = images[node.id];
        if (!url) return;
        const svg = await (await fetch(url)).text();
        const slug = [slugify(node.base), node.variant && slugify(node.variant)].filter(Boolean).join('--');
        await writeFile(join(outDir, `${slug}.svg`), svg);
        manifest.push({ slug, name: node.name, base: node.base, variant: node.variant, figmaId: node.id });
      }),
    );

    done += batch.length;
    process.stdout.write(`  ${done}/${nodes.length}\r`);
  }

  manifest.sort((a, b) => a.slug.localeCompare(b.slug));
  await writeFile(
    join(outDir, 'manifest.json'),
    `${JSON.stringify({ family: familyName, figmaPage: family.page, icons: manifest }, null, 2)}\n`,
  );
  console.log(`  wrote ${manifest.length} files to packages/icons/src/data/${familyName}/`);
}
