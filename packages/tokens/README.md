# @box-ui/tokens

Дизайн-токены, сгенерированные из переменных Figma «Foundation – Core» — 1118 переменных
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

Имя каждой CSS-переменной — это её **Code syntax (Web) в Figma**, дословно. Что
разработчик видит в Dev Mode, то и объявлено в таблице стилей:

| Figma                                                    | CSS                                        |
| -------------------------------------------------------- | ------------------------------------------ |
| Primitives ・ Color · `color/indigo/solid/500`           | `--color-indigo-500`                       |
| Primitives ・ Spacing · `spacing/16`                     | `--spacing-16`                             |
| Primitives ・ Rounding · `rounding/24`                   | `--rounding-24`                            |
| Primitives ・ Typography · `typography/font-size/14`     | `--font-size-14`                           |
| System ・ Color · `color/neutral/500`                    | `--system-color-neutral-500`               |
| Brand ・ Color · `color/solid/500`                       | `--brand-color-solid-500`                  |
| Brand ・ Rounding · `rounding/m`                         | `--brand-rounding-m`                       |
| System ・ Theme · `surface/base/fill/page`               | `--surface-base-fill-page`                 |
| System ・ Status · `color/solid/base`                    | `--status-color-solid-base`                |
| Controls ・ Appearance · `accent/fill/default`           | `--control-appearance-accent-fill-default` |
| Controls ・ State · `accent/fill`                        | `--control-accent-fill`                    |
| System ・ Responsive · `rounding/base/m`                 | `--rounding-m`                             |
| System ・ Responsive · `typography/heading/H1/font-size` | `--type-h1-font-size`                      |

Сам code syntax лежит в `tokens/figma/meta.json` вместе с описаниями переменных — это такая
же дословная выгрузка, как и дампы значений. Сборка строит таблицу владельцев имён и
падает, если два пути претендуют на одно имя, — так что столкновение после правки в Figma
не пройдёт незамеченным.

Исключений нет: каждое имя в CSS — дословно code syntax из Figma. Полное скругление
примитивов называется `--rounding-9999`, поэтому `--rounding-full` свободно для
семантического `rounding/base/full` из `System ・ Responsive`.

Единицы: длины получают `px`, `font-weight` остаётся безразмерным. Семейства шрифтов
выводятся с запасным вариантом: `"Inter", var(--font-fallback)`. Прозрачные ступени
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

theme.surface.base.fill.page; // 'var(--surface-base-fill-page)'
layout.spacing.base.m; // 'var(--spacing-m)'
modes['brand-color']; // ['deep', 'bright', 'monochrome']
model.collections['sys-theme'].variables; // каждый токен и его алиас в каждой моде
```

Доступные деревья: `palette`, `theme`, `accent`, `status`, `control`, `state`, `layout`,
`radius`, `typeface`.

Из `model` рендерится документация в Storybook, поэтому она не может разъехаться с файлом
Figma.
