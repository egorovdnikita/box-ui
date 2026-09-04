import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { render } from '../scripts/build-llms-txt.mjs';
import model from '../packages/tokens/dist/model.js';
import catalog from '../packages/icons/src/catalog.json';
import families from '../packages/icons/src/families.json';

const root = join(import.meta.dirname, '..');
const published = readFileSync(join(root, 'apps/storybook/public/llms.txt'), 'utf8');

describe('llms.txt', () => {
  it('is in sync with the model it describes', () => {
    // It ships as a static file, so nothing else would notice it going stale.
    expect(published).toBe(render(model, catalog, families));
  });

  it('counts icons and families rather than repeating a number', () => {
    expect(published).toContain(`${catalog.icons.length} icons`);
    expect(published).toContain(`${families.flags.total} entries`);
  });

  it('lists every switchable attribute', () => {
    for (const attribute of ['data-theme', 'data-accent', 'data-radius', 'data-font', 'data-device']) {
      expect(published).toContain(attribute);
    }
  });
});
