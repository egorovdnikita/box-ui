/**
 * Parses the verbatim Figma Variables dumps in `tokens/figma/*.txt`
 * into a normalised token model.
 *
 * Dump grammar
 * ------------
 *   # collection: <internal id>      one file per Figma collection
 *   # figma: <collection name as it reads in Figma>
 *   # modes: <Mode>, <Mode>, ...
 *
 *   single-mode collection:   <path>=<value>
 *   multi-mode collection:    <path> :: <Mode>=<value> | <Mode>=<value> | ...
 *
 * Values
 * ------
 *   #rrggbb[aa]                     literal colour
 *   <number>                        literal number
 *   "<string>"                      literal string
 *   @<collection>:<path>            alias to a variable in that collection
 *   alpha(<pct>, <value>)           that value re-published at <pct> opacity,
 *                                   which is how Figma stores a colour alias
 *                                   carrying an opacity override
 *
 * Aliases carry their target collection because the same path now exists in
 * more than one collection — `color/alpha/16` is a real variable in both
 * `brand-color` and `sys-status`, and only the prefix tells them apart.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const NUMBER = /^-?\d+(\.\d+)?$/;
const ALPHA = /^alpha\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(.+?)\s*\)$/;

function parseValue(raw, where) {
  const v = raw.trim();

  const alpha = ALPHA.exec(v);
  if (alpha) return { type: 'alpha', opacity: Number(alpha[1]), base: parseValue(alpha[2], where) };

  if (v.startsWith('@')) {
    const colon = v.indexOf(':');
    if (colon < 0) throw new Error(`Alias "${v}" in ${where} is missing its "<collection>:" prefix`);
    return { type: 'alias', collection: v.slice(1, colon), ref: v.slice(colon + 1) };
  }
  if (v.startsWith('#')) return { type: 'color', value: v };
  if (v.startsWith('"')) return { type: 'string', value: v.slice(1, -1) };
  if (NUMBER.test(v)) return { type: 'number', value: Number(v) };
  return { type: 'string', value: v };
}

/**
 * @returns {Array<{id:string,figmaName:string,modes:string[],variables:Record<string,{values:Record<string,object>}>}>}
 */
export function parseDumps(dir) {
  const out = [];

  for (const file of readdirSync(dir)
    .filter((f) => f.endsWith('.txt'))
    .sort()) {
    let current = null;

    for (const [index, line] of readFileSync(join(dir, file), 'utf8').split('\n').entries()) {
      const text = line.trim();
      if (!text) continue;
      const where = `${file}:${index + 1}`;

      if (text.startsWith('#')) {
        const collection = /^#\s*collection:\s*(.+)$/.exec(text);
        if (collection) {
          current = { id: collection[1].trim(), figmaName: '', modes: [], variables: {} };
          out.push(current);
          continue;
        }
        if (!current) continue;
        const figma = /^#\s*figma:\s*(.+)$/.exec(text);
        if (figma) current.figmaName = figma[1].trim();
        const modes = /^#\s*modes:\s*(.+)$/.exec(text);
        if (modes) current.modes = modes[1].split(',').map((m) => m.trim());
        continue;
      }

      if (!current) throw new Error(`Value before any "# collection:" header at ${where}: ${text}`);

      if (text.includes('::')) {
        const [name, rest] = text.split('::');
        const values = {};
        for (const chunk of rest.split('|')) {
          const eq = chunk.indexOf('=');
          values[chunk.slice(0, eq).trim()] = parseValue(chunk.slice(eq + 1), where);
        }
        current.variables[name.trim()] = { values };
      } else {
        const eq = text.indexOf('=');
        current.variables[text.slice(0, eq).trim()] = {
          values: { [current.modes[0]]: parseValue(text.slice(eq + 1), where) },
        };
      }
    }
  }

  const ids = new Set(out.map((c) => c.id));

  for (const c of out) {
    if (!c.figmaName) throw new Error(`Collection "${c.id}" has no "# figma:" header`);
    if (!c.modes.length) throw new Error(`Collection "${c.id}" has no "# modes:" header`);

    for (const [name, v] of Object.entries(c.variables)) {
      const missing = c.modes.filter((m) => !(m in v.values));
      if (missing.length) throw new Error(`${c.id}/${name} is missing modes: ${missing.join(', ')}`);

      for (const value of Object.values(v.values)) {
        for (const alias of aliasesIn(value)) {
          if (!ids.has(alias.collection))
            throw new Error(`${c.id}/${name} aliases unknown collection "${alias.collection}"`);
        }
      }
    }
  }

  return out;
}

/** Every alias reachable from a value, looking through `alpha()` wrappers. */
export function* aliasesIn(value) {
  if (value.type === 'alias') yield value;
  else if (value.type === 'alpha') yield* aliasesIn(value.base);
}
