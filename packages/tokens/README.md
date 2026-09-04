# @box-ui/tokens

Дизайн-токены, сгенерированные из переменных Figma «Box UI».

```bash
npm run build -w @box-ui/tokens
```

`tokens/figma/*.txt` → `packages/tokens/dist/`:

| Файл                      | Содержимое                                                                   |
| ------------------------- | ---------------------------------------------------------------------------- |
| `dist/css/primitives.css` | 777 фиксированных значений из `Box UI \| Primitives`, на `:root`             |
| `dist/css/theme.css`      | по блоку на каждую моду Figma, выбираются атрибутами `data-*`                |
| `dist/css/adaptive.css`   | необязательный: `prefers-color-scheme` → тёмная, `max-width: 767px` → mobile |
| `dist/css/index.css`      | `primitives.css` + `theme.css`                                               |
| `dist/index.js` / `.d.ts` | `modes`, `attributes`, `defaults` и вложенные карты `var()`                  |
| `dist/tokens.json`        | полный граф переменных Figma — для документации и инструментов               |

## CSS

```css
@import '@box-ui/tokens/css';
/* необязательно */
@import '@box-ui/tokens/css/adaptive.css';
```

Имена переменных повторяют пути Figma, но у каждого слоя свой префикс — чтобы коллекции,
переиспользующие один и тот же путь, не сталкивались:

| Figma                                    | CSS                                     |
| ---------------------------------------- | --------------------------------------- |
| Color Palette · `blue/solid/500`         | `--box-color-blue-solid-500`            |
| Spacing · `spacing/16`                   | `--box-spacing-16`                      |
| Rounding (примитив) · `rounding/24`      | `--box-rounding-24`                     |
| Typography (примитив) · `font-size/14`   | `--box-font-size-14`                    |
| Color · `colors/brand/primary`           | `--box-colors-brand-primary`            |
| Mode · `background/base/primary`         | `--box-background-base-primary`         |
| Typography · `font-size/72`              | `--box-type-font-size-72`               |
| Rounding · `rounding/base/m`             | `--box-radius-base-m`                   |
| Grid · `rounding/base/m`                 | `--box-rounding-base-m`                 |
| Grid · `typography/heading/H1/font-size` | `--box-typography-heading-h1-font-size` |

Последние две строки и есть причина префикса `--box-radius-*`: `Grid` заново ссылается на
коллекцию `Rounding` по тому же пути Figma, и двум слоям нужны разные имена, иначе каскад
зациклится вместо того, чтобы разрешиться.

Единицы: длины получают `px`, `font-weight` остаётся безразмерным, а коллекция `Opacity`
выводится долей (`opacity/40` → `0.4`). Семейства шрифтов выводятся с запасным вариантом:
`"Inter", var(--box-font-fallback)`.

## JavaScript

```ts
import { color, layout, modes, model } from '@box-ui/tokens';

color.background.base.primary; // 'var(--box-background-base-primary)'
layout.spacing.base.m; // 'var(--box-spacing-base-m)'
modes.accent; // ['blue', 'sky', 'teal', …]
model.collections.mode.variables; // каждый токен и его алиас в каждой моде
```

Из `model` рендерится документация в Storybook, поэтому она не может разъехаться с файлом
Figma.
