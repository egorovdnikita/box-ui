# Граф переменных

Файлы Figma — не плоские списки токенов, а цепочка коллекций, где каждый слой ссылается на
нижний. Эта цепочка сохранена в CSS один в один: алиас Figma становится переходом `var()`,
поэтому переключение моды заново разрешает всё, что ниже, ровно как в Figma. Ни одна тема
не продублирована в коде компонентов.

```
◉ Primitives · Color       585 ─┐
◉ Primitives · Spacing      29  │
◉ Primitives · Rounding     31  ├─ сырые литералы, одна мода «Value»
◉ Primitives · Size         29  │
◉ Primitives · Typography   75 ─┘
    │
    ├─ ◑ System · Color       76   именованные роли над палитрой
    │      │
    │      └─ ◑ System · Status    11  [data-status]  Positive · Warning · Negative · Information
    │               │
    ├─ ☯︎ Brand · Color        47   [data-accent]  Deep · Bright · Monochrome
    │      │        │
    │      └────────┴─ ◑ System · Theme   96  [data-theme]  Light · Dark
    │                        │
    │                        └─ ◑ Controls · Appearance  36  [data-appearance]  Solid · Soft · Outline
    │                                   │
    │                                   └─ ◑ Controls · State  16  [data-state]
    │                                            Default · Hover · Active · Disabled
    ├─ ☯︎ Brand · Rounding     11   [data-radius]      Low · Medium · High
    ├─ ☯︎ Brand · Typography    2   [data-font]        Inter · Display · Tight · Variable
    ├─ ☯︎ Brand · Icon          1   [data-icon-style]  Bold … Outline
    │
    └─ ◑ System · Responsive  73   [data-device]      Desktop · Mobile
```

Один цвет от начала до конца:

```
--accent-fill-solid                   [data-theme]   System · Theme
  └─ var(--brand-color-solid-500)           [data-accent]  Brand · Color
       └─ var(--color-indigo-500)            Primitives · Color (фиксировано)
            └─ #6366f1
```

Кнопка добавляет к этой цепочке ещё два переключаемых слоя — и ни один из них не описан
в CSS компонента повторно:

```
--control-accent-fill                             [data-state]       Controls · State
  └─ var(--control-appearance-accent-fill-default)          [data-appearance]  Controls · Appearance
       └─ var(--interaction-accent-solid-fill-default)  [data-theme]  System · Theme
            └─ var(--accent-fill-solid)
                 └─ var(--brand-color-solid-500)       [data-accent]      Brand · Color
                      └─ var(--color-indigo-500)            → #6366f1
```

Радиус проходит через два переключаемых слоя:

```
--rounding-xl           [data-device]  System · Responsive  Desktop → xl · Mobile → l
  └─ var(--brand-rounding-xl)        [data-radius]  Brand · Rounding     Low 20 · Medium 24 · High 32
       └─ var(--rounding-20)                Primitives · Rounding
            └─ 20px
```

## Переключатели

| Атрибут           | Коллекция Figma       | Значения                                                         | По умолчанию |
| ----------------- | --------------------- | ---------------------------------------------------------------- | ------------ |
| `data-theme`      | System · Theme        | `light` `dark`                                                   | `light`      |
| `data-accent`     | Brand · Color         | `deep` `bright` `monochrome`                                     | `deep`       |
| `data-radius`     | Brand · Rounding      | `low` `medium` `high`                                            | `low`        |
| `data-font`       | Brand · Typography    | `inter` `inter-display` `inter-tight` `inter-variable`           | `inter`      |
| `data-device`     | System · Responsive   | `desktop` `mobile`                                               | `desktop`    |
| `data-status`     | System · Status       | `positive` `warning` `negative` `information`                    | `positive`   |
| `data-appearance` | Controls · Appearance | `solid` `soft` `outline`                                         | `solid`      |
| `data-state`      | Controls · State      | `default` `hover` `active` `disabled`                            | `default`    |
| `data-icon-style` | Brand · Icon          | `bold` `bold-duotone` `broken` `line-duotone` `linear` `outline` | `bold`       |

`data-state` руками обычно не выставляют: `@box-ui/tokens/css/controls.css` отображает моды
этой коллекции на `:hover`, `:active` и `:disabled` для любого элемента с атрибутом
`data-box-control`. Выставить его вручную полезно, чтобы показать все состояния разом.

Они свободно сочетаются:

<!-- prettier-ignore -->
```html
<html data-theme="dark" data-accent="bright" data-radius="high" data-device="mobile">
```

## Переключение для части страницы

Кастомное свойство подставляется **там, где объявлено**, а не там, где прочитано:
`--accent-fill-solid: var(--brand-color-solid-500)` разрешается на том
элементе, который его объявил. Поэтому переопределение одного лишь `data-accent` у потомка
не дотянется до токена Mode, который `<html>` уже разрешил.

Значит, переключая моды для поддерева, ставьте **все атрибуты на один элемент**.
Тогда каждый слой переобъявляется здесь же и вся цепочка разрешается локально — именно так
две темы уживаются на одной странице.

<!-- prettier-ignore -->
```html
<!-- работает: вся цепочка переобъявляется здесь -->
<div data-theme="dark" data-accent="bright" data-radius="high" data-font="inter" data-device="desktop"
     data-status="positive" data-appearance="solid" data-state="default">

<!-- не работает: токены System · Theme уже разрешены выше -->
<div data-accent="bright">
```

`@box-ui/tokens/css/adaptive.css` необязателен: он берёт тёмную тему из
`prefers-color-scheme`, а Mobile — ниже 768px, но только когда документ сам не выставил эти
атрибуты.

Прозрачные ступени палитры Figma хранит не как отдельный цвет, а как «вот эта ступень, на
N%». В CSS это выводится через `color-mix(in srgb, … N%, transparent)`, поэтому правка
базовой шкалы двигает за собой и все её полупрозрачные производные.
