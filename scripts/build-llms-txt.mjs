/**
 * Emits `apps/storybook/public/llms.txt` — the machine-readable summary of the
 * design system, served at the root of the published site.
 *
 * Every number in it is counted from the generated model and catalogues rather
 * than written down, so the file cannot drift from the tokens it describes.
 * Run by `npm run build`; `tests/llms.test.ts` asserts it is in sync.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const json = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));

const SITE = 'https://egorovdnikita.github.io/box-ui';
const REPO = 'https://github.com/egorovdnikita/box-ui';

export function render(model, catalog, families) {
  const c = model.collections;
  const primitives = ['palette', 'spacing', 'rounding', 'size', 'opacity', 'type-scale']
    .map((id) => c[id].variables.length)
    .reduce((a, b) => a + b, 0);
  const semantic = ['accent', 'mode', 'radius', 'font', 'grid']
    .map((id) => c[id].variables.length)
    .reduce((a, b) => a + b, 0);

  const switches = Object.entries(c)
    .filter(([, collection]) => collection.attribute)
    .map(([, collection]) => {
      const values = collection.modes.map((m) => m.slug).join(' | ');
      return `- \`${collection.attribute}\`: ${values} (default \`${collection.defaultMode}\`) — Figma collection “${collection.figmaName}”`;
    })
    .join('\n');

  return `# Box UI

Design tokens and icons generated from the Box UI Figma libraries. Every Figma
Variable mode — colour theme, accent, rounding density, typeface and device — is a
switch on an HTML attribute, and the whole alias chain re-resolves under it.

- Live documentation: ${SITE}
- Source: ${REPO}
- Licence: MIT (code), CC BY 4.0 (Solar icons, © 480 Design)

## Tokens

${primitives} primitive values and ${semantic} semantic tokens, emitted as CSS custom
properties prefixed \`--box-\`. A Figma alias becomes a \`var()\` hop, so nothing is
duplicated per theme.

\`\`\`
npm i @box-ui/tokens
\`\`\`

\`\`\`js
import '@box-ui/tokens/css';        // primitives + every mode block
import { model, attributes, defaults } from '@box-ui/tokens';
\`\`\`

### Switches

${switches}

Set all five on one element to resolve a whole theme locally; a custom property is
substituted where it is declared, so overriding one attribute deeper in the tree cannot
reach a token an ancestor already resolved.

### Collections

${Object.entries(c)
  .map(
    ([id, collection]) =>
      `- \`${id}\` — ${collection.variables.length} variables, ${collection.modes.length} mode(s), from “${collection.figmaName}”`,
  )
  .join('\n')}

## Icons

${catalog.icons.length} icons in ${catalog.categories.length} categories, in ${catalog.styles.length} styles
(${catalog.styles.map((s) => s.figma).join(', ')}). All 24×24, painted with
\`currentColor\`, sized with \`size/base/*\` tokens.

\`\`\`jsx
import { Icon, IconStyleProvider } from '@box-ui/icons';

<IconStyleProvider style="bold-duotone">
  <Icon name="home-smile" size="l" title="Home" />
</IconStyleProvider>
\`\`\`

Not every icon is drawn in every style — \`catalog.icons[].styles\` lists the ones that
are.

### Other families

${Object.entries(families)
  .map(
    ([id, meta]) =>
      `- \`${id}\` — ${meta.total} entries from the “${meta.figmaPage}” Figma page, ${meta.resolved} with bundled artwork`,
  )
  .join('\n')}

## Pages

- [Introduction](${SITE}/?path=/docs/introduction--docs): the variable graph and how a token resolves
- [Getting started](${SITE}/?path=/docs/getting-started--docs): install, wire up the modes, use the tokens
- [Colours](${SITE}/?path=/story/foundations-colors--palette): the palette, the accent modes, the semantic tokens in Light and Dark
- [Scales](${SITE}/?path=/story/foundations-scales--spacing): spacing, rounding, sizes, opacity
- [Typography](${SITE}/?path=/story/foundations-typography--ramp): the type ramp and the four typefaces
- [UI Icons](${SITE}/?path=/story/icons-ui-icons--gallery): the searchable gallery
- [Figma families](${SITE}/?path=/story/icons-figma-families--flags): flags, payments, brands
`;
}

/**
 * Guarded so importing `render` for the sync test does not rewrite the very file
 * the test is comparing against — a check that regenerates its own fixture can
 * never fail.
 */
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const model = (await import(join(root, 'packages/tokens/dist/model.js'))).default;
  const text = render(model, json('packages/icons/src/catalog.json'), json('packages/icons/src/families.json'));

  writeFileSync(join(root, 'apps/storybook/public/llms.txt'), text);
  console.log(`llms.txt written (${text.split('\n').length} lines)`);
}
