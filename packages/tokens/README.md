# @box-ui/tokens

Design tokens generated from the Box UI Figma Variables.

```bash
npm run build -w @box-ui/tokens
```

`tokens/figma/*.txt` → `packages/tokens/dist/`:

| Output | Contents |
| --- | --- |
| `dist/css/primitives.css` | the 777 fixed values from `Box UI \| Primitives`, on `:root` |
| `dist/css/theme.css` | one block per Figma mode, selected by `data-*` attributes |
| `dist/css/adaptive.css` | optional: `prefers-color-scheme` → dark, `max-width: 767px` → mobile |
| `dist/css/index.css` | `primitives.css` + `theme.css` |
| `dist/index.js` / `.d.ts` | `modes`, `attributes`, `defaults`, and nested `var()` maps |
| `dist/tokens.json` | the full Figma variable graph, for docs and tooling |

## CSS

```css
@import "@box-ui/tokens/css";
/* optional */
@import "@box-ui/tokens/css/adaptive.css";
```

Variable names follow the Figma paths, with one prefix per layer so that collections
which reuse a path do not collide:

| Figma | CSS |
| --- | --- |
| Color Palette · `blue/solid/500` | `--box-color-blue-solid-500` |
| Spacing · `spacing/16` | `--box-spacing-16` |
| Rounding (primitive) · `rounding/24` | `--box-rounding-24` |
| Typography (primitive) · `font-size/14` | `--box-font-size-14` |
| Color · `colors/brand/primary` | `--box-colors-brand-primary` |
| Mode · `background/base/primary` | `--box-background-base-primary` |
| Typography · `font-size/72` | `--box-type-font-size-72` |
| Rounding · `rounding/base/m` | `--box-radius-base-m` |
| Grid · `rounding/base/m` | `--box-rounding-base-m` |
| Grid · `typography/heading/H1/font-size` | `--box-typography-heading-h1-font-size` |

The last two rows are the reason for the `--box-radius-*` prefix: `Grid` re-aliases the
`Rounding` collection under the same Figma path, and the two layers need distinct names
for the cascade to resolve rather than loop.

Units: lengths get `px`, `font-weight` stays unitless, and the `Opacity` collection is
emitted as a ratio (`opacity/40` → `0.4`). Font families are emitted with a fallback:
`"Inter", var(--box-font-fallback)`.

## JavaScript

```ts
import { color, layout, modes, model } from '@box-ui/tokens';

color.background.base.primary;  // 'var(--box-background-base-primary)'
layout.spacing.base.m;          // 'var(--box-spacing-base-m)'
modes.accent;                   // ['blue', 'sky', 'teal', …]

model.collections.mode.variables // every token with its per-mode alias target
```

`model` is what the Storybook docs render from, so the documentation cannot drift from
the Figma file.
