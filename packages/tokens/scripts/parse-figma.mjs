/**
 * Parses the verbatim Figma Variables dumps in `tokens/figma/*.txt`
 * into a normalised token model.
 *
 * Dump grammar
 * ------------
 *   # comment / header
 *   # collection: <Name>
 *   # modes: <Mode>, <Mode>, ...
 *
 *   single-mode collection:   <path>=<value>
 *   multi-mode collection:    <path> :: <Mode>=<value> | <Mode>=<value> | ...
 *
 *   values:  #rrggbb[aa]  |  <number>  |  "<string>"  |  @<path>   (@ = alias to another variable)
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/** Figma collection name -> internal collection id. */
export const COLLECTIONS = {
  'primitives.colors:Color Palette': 'palette',
  'primitives.scales:Spacing': 'spacing',
  'primitives.scales:Rounding': 'rounding',
  'primitives.scales:Size': 'size',
  'primitives.scales:Opacity': 'opacity',
  'primitives.scales:Typography': 'type-scale',
  'tokens.color:Color': 'accent',
  'tokens.mode:Mode': 'mode',
  'tokens.rounding:Rounding': 'radius',
  'tokens.typography:Typography': 'font',
  'tokens.grid:Grid': 'grid',
};

const NUMBER = /^-?\d+(\.\d+)?$/;

function parseValue(raw) {
  const v = raw.trim();
  if (v.startsWith('@')) return { type: 'alias', ref: v.slice(1) };
  if (v.startsWith('#')) return { type: 'color', value: v };
  if (v.startsWith('"')) return { type: 'string', value: v.slice(1, -1) };
  if (NUMBER.test(v)) return { type: 'number', value: Number(v) };
  return { type: 'string', value: v };
}

/** @returns {Array<{id:string,figmaName:string,file:string,modes:string[],variables:Record<string,{values:Record<string,object>}>}>} */
export function parseDumps(dir) {
  const out = [];

  for (const file of readdirSync(dir).filter((f) => f.endsWith('.txt')).sort()) {
    const base = file.replace(/\.txt$/, '');
    if (base.startsWith('icons.')) continue; // component catalogue, not variables

    let current = null;

    for (const line of readFileSync(join(dir, file), 'utf8').split('\n')) {
      const text = line.trim();
      if (!text) continue;

      if (text.startsWith('#')) {
        const collection = text.match(/^#\s*collection:\s*(.+)$/);
        if (collection) {
          const figmaName = collection[1].trim();
          const id = COLLECTIONS[`${base}:${figmaName}`];
          if (!id) throw new Error(`Unmapped collection "${figmaName}" in ${file}`);
          current = { id, figmaName, file: base, modes: [], variables: {} };
          out.push(current);
          continue;
        }
        const modes = text.match(/^#\s*modes:\s*(.+)$/);
        if (modes && current) current.modes = modes[1].split(',').map((m) => m.trim());
        continue;
      }

      if (!current) throw new Error(`Value before any "# collection:" header in ${file}: ${text}`);

      if (text.includes('::')) {
        const [name, rest] = text.split('::');
        const values = {};
        for (const chunk of rest.split('|')) {
          const eq = chunk.indexOf('=');
          const mode = chunk.slice(0, eq).trim();
          values[mode] = parseValue(chunk.slice(eq + 1));
        }
        current.variables[name.trim()] = { values };
      } else {
        const eq = text.indexOf('=');
        const mode = current.modes[0];
        current.variables[text.slice(0, eq).trim()] = { values: { [mode]: parseValue(text.slice(eq + 1)) } };
      }
    }
  }

  for (const c of out) {
    for (const [name, v] of Object.entries(c.variables)) {
      const missing = c.modes.filter((m) => !(m in v.values));
      if (missing.length) throw new Error(`${c.figmaName}/${name} is missing modes: ${missing.join(', ')}`);
    }
  }

  return out;
}
