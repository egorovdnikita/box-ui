# @box-ui/icons

The icon set of `Box UI | Icons`, with the six Figma `Style` modes switchable at runtime.

```tsx
import { Icon, IconStyleProvider } from '@box-ui/icons';

<IconStyleProvider style="bold-duotone">
  <Icon name="home-smile" size="l" title="Home" />
</IconStyleProvider>;
```

| Prop | Type | Default |
| --- | --- | --- |
| `name` | Solar icon name — `arrow-up`, `home-smile`, `card-transfer`, … | required |
| `iconStyle` | `bold` `bold-duotone` `broken` `line-duotone` `linear` `outline` | nearest provider, else `linear` |
| `size` | `min` `2xs` `xs` `s` `m` `l` `xl` `2xl` `max`, or a number | `xs` |
| `title` | accessible name; without it the icon is `aria-hidden` | — |

Sizes are the `size/base/*` tokens from the Grid collection, so icons follow
`data-device` like everything else. Geometry paints with `currentColor`, so colour comes
from the surrounding `--box-content-*`.

## UI Icons

The 1 253 UI Icon component sets in the Figma file are the [Solar](https://www.figma.com/community/file/1166831539721848736)
set by 480 Design. `scripts/build.mjs` takes the geometry from the canonical Solar
distribution (`@iconify-json/solar`), splits it by style and writes:

```
src/data/bold.json          1 280 icons
src/data/bold-duotone.json  1 247
src/data/broken.json        1 288
src/data/line-duotone.json  1 277
src/data/linear.json        1 288
src/data/outline.json       1 292
src/catalog.json            1 301 icons in 38 categories
src/names.ts                the IconName union
```

Each style is a separate dynamic `import()`, so an app ships only the styles it renders.

## Flags, Payments, Brands

`src/figma-families.json` catalogues the other three families of the Figma file —
names and variant properties, read straight from the file:

| Family | Figma page | Count | Variants |
| --- | --- | --- | --- |
| Flags | Flags | 197 | `Style` = Circle · Rounded · Shape |
| Payments | Payments | 679 | none |
| Brands | Brands | 24 | `Style` = Original · Solid, `Circle Shape` = True · False |

Their geometry is not vendored. Export it from Figma when you need it:

```bash
FIGMA_TOKEN=figd_xxx npm run icons:figma -- --family flags
```

Files land in `src/data/<family>/<slug>.svg` alongside a `manifest.json`.

## Licence

Code MIT. The Solar icons are © 480 Design, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
