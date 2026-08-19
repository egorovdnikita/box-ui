# Box UI

Design tokens and icons generated from the **Box UI** Figma libraries, with a Storybook
in which every Figma **Variable mode** — colour theme, accent, rounding density, typeface
and device — can be switched live.

| Figma file | What it contributes |
| --- | --- |
| [Box UI \| Primitives](https://www.figma.com/design/gbgGmuUBQ7sIfL256KaDXX/Box-UI--Primitives) | 777 raw values: colour palette, spacing, rounding, size, opacity, type scale |
| [Box UI \| Tokens](https://www.figma.com/design/ccLFzQtw3AuTuHWoHYf2dS/Box-UI--Tokens) | 234 semantic tokens across 5 switchable collections |
| [Box UI \| Icons](https://www.figma.com/design/9pupgeWag4Ssc7jdAYvXMt/Box-UI--Icons) | UI Icons (Solar) in 6 styles, plus Flags / Payments / Brands |

**→ [Live Storybook](https://egorovdnikita.github.io/box-ui/)**

```bash
npm install      # also builds tokens and icons
npm run storybook
```

---

## The variable graph

The Figma files are not flat token lists — they are a chain of collections where each
layer aliases the one below it. That chain is preserved 1:1 in CSS: every Figma alias
becomes a `var()` hop, so switching a mode re-resolves everything below it exactly the
way it does in Figma. No theme is duplicated in component code.

```
Box UI | Primitives                        Box UI | Tokens
──────────────────────                     ───────────────
Color Palette  584 ──┐
Spacing         29 ──┼── Grid      [data-device]   Desktop · Mobile
Rounding        31 ──┤     ▲
Size            29 ──┘     ├── Rounding  [data-radius]   Low · Medium · High
Opacity         29         └── Typography[data-font]     Inter · Display · Tight · Variable
Typography      75
       ▲
       └────────────── Color     [data-accent]  Blue Sky Teal Emerald Orange
                          ▲                     Amber Violet Purple Cyan Yellow
                          └───── Mode      [data-theme]   Light · Dark
```

A single colour, end to end:

```
--box-background-sentiment-primary        [data-theme]   Mode
  └─ var(--box-colors-brand-primary)      [data-accent]  Color
       └─ var(--box-color-blue-solid-500)                Color Palette (fixed)
            └─ #3b82f6
```

A radius, which passes through two switchable layers:

```
--box-rounding-base-xl        [data-device]  Grid      Desktop → base/xl · Mobile → base/l
  └─ var(--box-radius-base-xl)[data-radius]  Rounding  Low 20 · Medium 24 · High 32
       └─ var(--box-rounding-24)                       Rounding (primitive)
            └─ 24px
```

### Switches

| Attribute | Figma collection | Values | Default |
| --- | --- | --- | --- |
| `data-theme` | Mode | `light` `dark` | `light` |
| `data-accent` | Color | `blue` `sky` `teal` `emerald` `orange` `amber` `violet` `purple` `cyan` `yellow` | `blue` |
| `data-radius` | Rounding | `low` `medium` `high` | `medium` |
| `data-font` | Typography | `inter` `inter-display` `inter-tight` `inter-variable` | `inter` |
| `data-device` | Grid | `desktop` `mobile` | `desktop` |

They compose freely:

```html
<html data-theme="dark" data-accent="violet" data-radius="high" data-device="mobile">
```

### Scoping to part of a page

A custom property is substituted **where it is declared**, not where it is read:
`--box-background-sentiment-primary: var(--box-colors-brand-primary)` is resolved on the
element that declares it. Overriding only `data-accent` on a descendant therefore cannot
reach a Mode token that `<html>` already resolved.

So when you scope modes to a subtree, put **all five attributes on that one element**.
Every layer is then re-declared there and the whole chain resolves locally — which is how
two themes can sit side by side on one page.

```html
<!-- works: the whole chain re-declares here -->
<div data-theme="dark" data-accent="violet" data-radius="high" data-font="inter" data-device="desktop">

<!-- does not: Mode tokens were already resolved higher up -->
<div data-accent="violet">
```

`@box-ui/tokens/css/adaptive.css` is optional and picks Dark from `prefers-color-scheme`
and Mobile below 768px whenever the document has not set those attributes itself.

---

## Packages

| Package | Contents |
| --- | --- |
| [`@box-ui/tokens`](packages/tokens) | CSS custom properties + a typed JS token API, generated from the Figma dumps |
| [`@box-ui/icons`](packages/icons) | 1 301 Solar icons × 6 styles, plus the Flags / Payments / Brands families |
| [`@box-ui/react`](packages/react) | Button, Badge, Card, Input, Text, Stack — token-only primitives used by the docs |
| [`apps/storybook`](apps/storybook) | The documentation site |

```tsx
import '@box-ui/tokens/css';
import { Button, Card, Text } from '@box-ui/react';
import { Icon } from '@box-ui/icons';

<Card>
  <Text variant="h4">Ready</Text>
  <Button startIcon={<Icon name="check-circle" size="2xs" />}>Continue</Button>
</Card>;
```

---

## Icons

The `Icon` collection in Figma holds one variable, `icon-style`, with six modes — the six
`Style` variants of all 1 253 UI Icon component sets. Those are the [Solar](https://www.figma.com/community/file/1166831539721848736)
set by 480 Design (CC BY 4.0), so the geometry comes from the canonical Solar
distribution (`@iconify-json/solar`) and is split per style at build time:

```
packages/icons/src/data/{bold,bold-duotone,broken,line-duotone,linear,outline}.json
```

Each style loads on demand, all icons are 24×24 and paint with `currentColor`, and sizes
are `size/base/*` tokens — so an icon also follows the device mode.

```tsx
<IconStyleProvider style="bold-duotone">
  <Icon name="home-smile" size="l" title="Home" />
</IconStyleProvider>
```

### Flags, Payments and Brands

The other three families of the Figma file ship too — 197 flags, 675 payment marks and
24 brands, with the variant properties the file gives them:

```tsx
import { FamilyIcon, useFamily } from '@box-ui/icons';

const flags = useFamily('flags');
<FamilyIcon entry={flags.items[0]} shape="circle" size="max" />
```

The Figma file is the source of truth for the roster; the artwork comes from the
canonical open distribution of the same marks, exactly the way UI Icons takes Solar
from `@iconify-json/solar` — `flag-icons` (MIT), `@web3icons/core` (MIT) plus
`cryptocurrency-icons` (CC0), and `simple-icons` (CC0). Entries with no upstream match
(134 tokens, 3 brands) render as a monogram tile rather than a blank.

To replace all of it with verbatim Figma exports:

```bash
FIGMA_TOKEN=figd_xxx npm run icons:figma                      # flags + payments + brands
FIGMA_TOKEN=figd_xxx npm run icons:figma -- --family flags     # one family
```

Create a token with the `file_content:read` scope at
[figma.com/developers/api](https://www.figma.com/developers/api#access-tokens).

---

## Regenerating from Figma

`tokens/figma/*.txt` are verbatim dumps of the Figma Variables — collection, modes, and
one line per variable, with `@` marking an alias. They are the source of truth in this
repo; the build only transforms them.

```bash
npm run build:tokens   # tokens/figma/*.txt -> packages/tokens/dist/
npm run build:icons    # Solar + the three families -> packages/icons/src/data/
npm run typecheck
npm run build:storybook
```

---

## Deploying the Storybook

The published site lives on the `gh-pages` branch and is served at
<https://egorovdnikita.github.io/box-ui/>.

```bash
npm run deploy:storybook   # build + force-push the snapshot to gh-pages
```

To deploy automatically on every push to `main` instead, move the ready-made workflow
into place once your git credentials carry the `workflow` scope:

```bash
gh auth refresh -s workflow
mkdir -p .github/workflows && cp docs/storybook-pages-workflow.yml .github/workflows/storybook.yml
```

Then switch the Pages source to *GitHub Actions* in the repository settings.

When the Figma libraries change, update the dumps (the Figma MCP server or the REST API
can print the same shape) and re-run the build. Nothing else needs to be touched.

### Known quirks carried over from Figma

These are reproduced exactly rather than silently corrected — fix them in Figma and rebuild:

- In the **Color** collection the `Teal` mode points at the *green* ramp, `Cyan` at *pink*,
  and `Yellow` at *rose*.
- The strongest **Rounding** mode is spelled `Hight` in Figma. The generated CSS uses
  `data-radius="high"` and also accepts `data-radius="hight"`.
- `background/base/primary` and `background/base/tertiary` are the same value in Light.
- The Payments page contains a few duplicated component names.

---

## Licence

The code in this repository is MIT. The Solar icon set is © 480 Design, licensed
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
