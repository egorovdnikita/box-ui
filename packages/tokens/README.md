# @box-ui/tokens

Дизайн-токены, сгенерированные из переменных Figma «Box UI | Components» — 1118 переменных
в 15 коллекциях.

```bash
npm run build -w @box-ui/tokens
```

`tokens/figma/*.txt` → `packages/tokens/dist/`:

| Файл                      | Содержимое                                                                    |
| ------------------------- | ----------------------------------------------------------------------------- |
| `dist/css/primitives.css` | 825 фиксированных значений (`◉ Primitives` и `◑ System ・ Color`), на `:root` |
| `dist/css/theme.css`      | по блоку на каждую моду Figma, выбираются атрибутами `data-*`                 |
| `dist/css/controls.css`   | состояния контролов через `:hover` / `:active` / `:disabled`                  |
| `dist/css/adaptive.css`   | необязательный: `prefers-color-scheme` → тёмная, `max-width: 767px` → mobile  |
| `dist/css/index.css`      | `primitives.css` + `theme.css`                                                |
| `dist/index.js` / `.d.ts` | `modes`, `attributes`, `defaults` и вложенные карты `var()`                   |
| `dist/tokens.json`        | полный граф переменных Figma — для документации и инструментов                |

## CSS

```css
@import '@box-ui/tokens/css';
/* необязательно */
@import '@box-ui/tokens/css/controls.css';
@import '@box-ui/tokens/css/adaptive.css';
```

Имена переменных повторяют пути Figma, но у каждого слоя свой префикс — чтобы коллекции,
переиспользующие один и тот же путь, не сталкивались:

| Figma                                                    | CSS                                     |
| -------------------------------------------------------- | --------------------------------------- |
| Primitives ・ Color · `color/indigo/solid/500`           | `--box-palette-indigo-solid-500`        |
| Primitives ・ Spacing · `spacing/16`                     | `--box-spacing-16`                      |
| Primitives ・ Rounding · `rounding/24`                   | `--box-rounding-24`                     |
| Primitives ・ Typography · `typography/font-size/14`     | `--box-scale-font-size-14`              |
| System ・ Color · `color/neutral/500`                    | `--box-color-neutral-500`               |
| Brand ・ Color · `color/solid/500`                       | `--box-brand-solid-500`                 |
| Brand ・ Rounding · `rounding/m`                         | `--box-radius-m`                        |
| System ・ Theme · `surface/base/fill/page`               | `--box-surface-base-fill-page`          |
| System ・ Status · `color/solid/base`                    | `--box-status-color-solid-base`         |
| Controls ・ Appearance · `accent/fill/default`           | `--box-control-accent-fill-default`     |
| Controls ・ State · `accent/fill`                        | `--box-state-accent-fill`               |
| System ・ Responsive · `rounding/base/m`                 | `--box-rounding-base-m`                 |
| System ・ Responsive · `typography/heading/H1/font-size` | `--box-typography-heading-h1-font-size` |

Префиксы не косметика: `rounding/base/m` в `System ・ Responsive` ссылается на `rounding/m`
в `Brand ・ Rounding`, а `color/alpha/16` существует и в `Brand ・ Color`, и в
`System ・ Status`. Сборка строит таблицу владельцев имён и падает, если два пути
претендуют на одно имя CSS-переменной, — так что столкновение после правки в Figma не
пройдёт незамеченным.

Единицы: длины получают `px`, `font-weight` остаётся безразмерным. Семейства шрифтов
выводятся с запасным вариантом: `"Inter", var(--box-font-fallback)`. Прозрачные ступени
Figma хранит как «эта шкала на N%», и в CSS они выводятся через
`color-mix(in srgb, … N%, transparent)`, а не схлопываются в отдельный hex, — поэтому
правка базовой шкалы двигает за собой и все её полупрозрачные производные.

## Состояния контролов

`Controls ・ State` — такая же мода, как остальные, и её выбирает `data-state`. Но CSS не
умеет менять атрибут по наведению, поэтому `controls.css` отображает те же моды на
`:hover`, `:active` и `:disabled` для любого элемента с `data-box-control`.

Там же переобъявляются 18 переменных `System ・ Theme`, ведущих в `System ・ Status`:
кастомное свойство подставляется там, где объявлено, поэтому контрол, выставивший только
`data-status`, иначе читал бы значение, которое предок уже разрешил под своей тональностью.
Набор вычисляется из графа, а не выписан руками.

## JavaScript

```ts
import { layout, modes, model, theme } from '@box-ui/tokens';

theme.surface.base.fill.page; // 'var(--box-surface-base-fill-page)'
layout.spacing.base.m; // 'var(--box-spacing-base-m)'
modes['brand-color']; // ['indigo', 'lime', 'yellow', 'pink', 'monochrome']
model.collections['sys-theme'].variables; // каждый токен и его алиас в каждой моде
```

Доступные деревья: `palette`, `theme`, `accent`, `status`, `control`, `state`, `layout`,
`radius`, `typeface`.

Из `model` рендерится документация в Storybook, поэтому она не может разъехаться с файлом
Figma.
