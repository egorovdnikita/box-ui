# Box UI

Дизайн-токены и иконки, сгенерированные из файла Figma **Box UI**. В Storybook каждую
**моду переменных** Figma — тему, акцент, плотность скруглений, гарнитуру, устройство,
статус, вид контрола и его состояние — можно переключить вживую.

| Файл Figma                                                                                     | Что даёт                                                                                         |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [Box UI \| Components](https://www.figma.com/design/gbgGmuUBQ7sIfL256KaDXX/Box-UI--Components) | 1118 переменных в 15 коллекциях, UI Icons (Solar) в 6 стилях, «Флаги / Платежи / Бренды», Button |

Коллекции разложены на три слоя: `◉ Primitives` — сырые литералы, `☯︎ Brand` — то, что
меняет бренд, `◑ System` — то, из чего собираются компоненты.

**→ [Живой Storybook](https://egorovdnikita.github.io/box-ui/)**

```bash
npm install      # заодно собирает токены и иконки
npm run storybook
```

---

## Граф переменных

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
    ├─ ☯︎ Brand · Color        47   [data-accent]  Indigo · Lime · Yellow · Pink · Monochrome
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
--box-accent-fill-solid                   [data-theme]   System · Theme
  └─ var(--box-brand-solid-500)           [data-accent]  Brand · Color
       └─ var(--box-palette-indigo-solid-500)            Primitives · Color (фиксировано)
            └─ #6366f1
```

Кнопка добавляет к этой цепочке ещё два переключаемых слоя — и ни один из них не описан
в CSS компонента повторно:

```
--box-state-accent-fill                             [data-state]       Controls · State
  └─ var(--box-control-accent-fill-default)          [data-appearance]  Controls · Appearance
       └─ var(--box-interaction-accent-solid-fill-default)  [data-theme]  System · Theme
            └─ var(--box-accent-fill-solid)
                 └─ var(--box-brand-solid-500)       [data-accent]      Brand · Color
                      └─ var(--box-palette-indigo-solid-500)            → #6366f1
```

Радиус проходит через два переключаемых слоя:

```
--box-rounding-base-xl           [data-device]  System · Responsive  Desktop → xl · Mobile → l
  └─ var(--box-radius-xl)        [data-radius]  Brand · Rounding     Low 20 · Medium 24 · High 32
       └─ var(--box-rounding-20)                Primitives · Rounding
            └─ 20px
```

### Переключатели

| Атрибут           | Коллекция Figma       | Значения                                                         | По умолчанию |
| ----------------- | --------------------- | ---------------------------------------------------------------- | ------------ |
| `data-theme`      | System · Theme        | `light` `dark`                                                   | `light`      |
| `data-accent`     | Brand · Color         | `indigo` `lime` `yellow` `pink` `monochrome`                     | `indigo`     |
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
<html data-theme="dark" data-accent="pink" data-radius="high" data-device="mobile">
```

### Переключение для части страницы

Кастомное свойство подставляется **там, где объявлено**, а не там, где прочитано:
`--box-accent-fill-solid: var(--box-brand-solid-500)` разрешается на том
элементе, который его объявил. Поэтому переопределение одного лишь `data-accent` у потомка
не дотянется до токена Mode, который `<html>` уже разрешил.

Значит, переключая моды для поддерева, ставьте **все атрибуты на один элемент**.
Тогда каждый слой переобъявляется здесь же и вся цепочка разрешается локально — именно так
две темы уживаются на одной странице.

<!-- prettier-ignore -->
```html
<!-- работает: вся цепочка переобъявляется здесь -->
<div data-theme="dark" data-accent="pink" data-radius="high" data-font="inter" data-device="desktop"
     data-status="positive" data-appearance="solid" data-state="default">

<!-- не работает: токены System · Theme уже разрешены выше -->
<div data-accent="pink">
```

`@box-ui/tokens/css/adaptive.css` необязателен: он берёт тёмную тему из
`prefers-color-scheme`, а Mobile — ниже 768px, но только когда документ сам не выставил эти
атрибуты.

Прозрачные ступени палитры Figma хранит не как отдельный цвет, а как «вот эта ступень, на
N%». В CSS это выводится через `color-mix(in srgb, … N%, transparent)`, поэтому правка
базовой шкалы двигает за собой и все её полупрозрачные производные.

---

## Пакеты

| Пакет                               | Содержимое                                                                                                      |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [`@box-ui/tokens`](packages/tokens) | CSS-переменные и типизированный JS-API токенов, сгенерированные из дампов Figma                                 |
| [`@box-ui/icons`](packages/icons)   | 1301 иконка Solar × 6 стилей, плюс семейства «Флаги / Платежи / Бренды»                                         |
| [`@box-ui/react`](packages/react)   | Button, Badge, Card, Input, Text, Stack — примитивы, доказывающие граф токенов: ни одного литерального значения |
| [`tokens/figma`](tokens/figma)      | Дословные дампы переменных Figma и [инструкция по перевыгрузке](tokens/figma/README.md)                         |
| [`apps/storybook`](apps/storybook)  | Сайт документации — см. ниже                                                                                    |

```tsx
import '@box-ui/tokens/css';
import { Button, Card, Text } from '@box-ui/react';
import { Icon } from '@box-ui/icons';

<Card>
  <Text variant="h4">Готово</Text>
  <Button startIcon={<Icon name="check-circle" size="2xs" />}>Продолжить</Button>
</Card>;
```

---

## Storybook

<https://egorovdnikita.github.io/box-ui/>

Девять переключателей на панели управляют модами Figma, и каждая страница реагирует на все
сразу. Что страницы дают сверх списка имён:

- **Живые значения.** Токен показывает, во что он _разрешается_ при текущих модах, а не
  только алиас, на который указывает: `spacing/base/s` читается как `20px` на Desktop и
  `16px` на Mobile, семантические цвета показывают свой hex. Обратное чтение кастомного
  свойства всегда возвращает лишь его объявление, поэтому значение снимается с элемента-зонда
  и перечитывается при смене любой моды.
- **Светлая против тёмной.** Семантические цвета делят каждый образец пополам и разрешают
  обе темы на одной странице.
- **Клик копирует** везде: образцы и строки шкал копируют `var(--box-…)`, иконки — своё имя
  или готовый `<Icon …/>`.
- **Поиск на каждой странице**, `/` ставит в него фокус, группировка Figma сохранена в виде
  быстрых ссылок. Фильтры живут в адресе, поэтому отфильтрованный вид можно переслать.
- **[Начало работы](https://egorovdnikita.github.io/box-ui/?path=/docs/getting-started--docs)** —
  установка, подключение мод-атрибутов, использование токенов и иконок.
- **[llms.txt](https://egorovdnikita.github.io/box-ui/llms.txt)** — вся система одной
  машиночитаемой страницей, генерируется из модели токенов и поэтому не устаревает.

Оформление документации намеренно взято у самого Storybook — его палитра, шрифт и рамки
читаются из `storybook/theming`, чтобы канвас не разъезжался с окружающим интерфейсом.
Токены Box UI красят только то, что документируется, и каждая демонстрационная поверхность
несёт собственные фон и цвет текста, поэтому светлое демо читается на тёмном канвасе.

---

## Иконки

В коллекции `Icon` в Figma одна переменная, `icon-style`, с шестью модами — это шесть
вариантов `Style` у всех 1253 компонент-сетов UI Icons. Набор
[Solar](https://www.figma.com/community/file/1166831539721848736) авторства 480 Design
(CC BY 4.0), поэтому геометрия берётся из канонической поставки Solar
(`@iconify-json/solar`) и на сборке разрезается по стилям:

```
packages/icons/src/data/{bold,bold-duotone,broken,line-duotone,linear,outline}.json
```

Каждый стиль грузится по требованию, все иконки 24×24 и красятся `currentColor`, а размеры
— токены `size/base/*`, поэтому иконка слушается и моды устройства.

```tsx
<IconStyleProvider style="bold-duotone">
  <Icon name="home-smile" size="l" title="Home" />
</IconStyleProvider>
```

### Флаги, платежи и бренды

Три остальных семейства файла Figma тоже поставляются — 197 флагов, 675 платёжных знаков и
24 бренда, со свойствами вариантов, которые задаёт файл:

```tsx
import { FamilyIcon, useFamily } from '@box-ui/icons';

const flags = useFamily('flags');
<FamilyIcon entry={flags.items[0]} shape="circle" size="max" />;
```

Состав задаёт файл Figma; графика берётся из канонической открытой поставки тех же знаков —
ровно так же, как UI Icons берут Solar из `@iconify-json/solar`: `flag-icons` (MIT),
`@web3icons/core` (MIT) вместе с `cryptocurrency-icons` (CC0) и `simple-icons` (CC0).
Записи без соответствия в источнике (134 токена, 3 бренда) рисуются плиткой-монограммой, а
не пустотой.

Чтобы заменить всё это дословными экспортами из Figma:

```bash
FIGMA_TOKEN=figd_xxx npm run icons:figma                      # флаги + платежи + бренды
FIGMA_TOKEN=figd_xxx npm run icons:figma -- --family flags     # одно семейство
```

Токен со скоупом `file_content:read` создаётся на
[figma.com/developers/api](https://www.figma.com/developers/api#access-tokens).

---

## Пересборка из Figma

`tokens/figma/*.txt` — дословные дампы переменных Figma: коллекция, моды и по строке на
переменную, `@` помечает алиас. В этом репозитории они и есть источник истины, сборка их
только преобразует.

```bash
npm run build:tokens   # tokens/figma/*.txt -> packages/tokens/dist/
npm run build:icons    # Solar + три семейства -> packages/icons/src/data/
npm run build:storybook
```

---

## Проверки

```bash
npm run check   # typecheck + lint + format:check + тесты + сборка Storybook
```

Части запускаются и по отдельности: `typecheck`, `lint` (`lint:fix`), `format`
(`format:check`), `test` (`test:watch`).

32 теста — про то, что может тихо испортиться:

- **Конвейер токенов.** Каждый `var()` в сгенерированном CSS обязан попасть в существующую
  переменную: переход, ведущий в никуда, — это прозрачный цвет или схлопнутая длина, и до
  открытия страницы этого никто не заметит. Тот же набор проверяет, что каждый алиас Figma
  разрешается, что ни одна переменная не осталась без моды и что написание `Hight`
  по-прежнему принимается.
- **Данные иконок.** Каталог и шесть постилевых наборов обязаны сходиться в обе стороны:
  у каждого заявленного стиля должна быть геометрия, а каждая геометрия должна быть заявлена.
  Зашитый `fill="#…"` запрещён — он игнорировал бы токен `--box-content-*` вокруг.
- **`llms.txt`** сравнивается со свежим рендером, поэтому не может устареть незаметно.

Плюс матчер поиска и вывод цвета — чистые функции с неочевидными правилами.

---

## Публикация Storybook

Опубликованный сайт лежит в ветке `gh-pages` и отдаётся по адресу
<https://egorovdnikita.github.io/box-ui/>.

```bash
npm run deploy:storybook   # собрать и запушить снапшот в gh-pages
```

Чтобы вместо этого деплоить автоматически на каждый пуш в `main`, положите готовый воркфлоу
на место — после того как у git-доступа появится скоуп `workflow`:

```bash
gh auth refresh -s workflow
mkdir -p .github/workflows && cp docs/storybook-pages-workflow.yml .github/workflows/storybook.yml
```

Затем переключите источник Pages на _GitHub Actions_ в настройках репозитория.

Когда библиотеки Figma меняются, обновите дампы (тот же формат печатают MCP-сервер Figma и
REST API) и пересоберите. Больше ничего трогать не нужно.

### Особенности, унаследованные из Figma

Воспроизведены буквально, а не исправлены молча — чините в Figma и пересобирайте:

- В коллекции **Color** мода `Teal` указывает на шкалу _green_, `Cyan` — на _pink_, а
  `Yellow` — на _rose_. Storybook говорит об этом на странице _Основы → Цвета → Акцентные
  моды_, выводя список из модели токенов, так что заметка исчезнет сама, когда Figma починят.
- Самая сильная мода **Rounding** написана в Figma как `Hight`. Сгенерированный CSS использует
  `data-radius="high"` и дополнительно принимает `data-radius="hight"`.
- `background/base/primary` и `background/base/tertiary` в светлой теме совпадают.
- На странице Payments четыре имени компонентов повторяются, поэтому её 679 компонентов —
  это 675 различимых записей.

---

## Лицензии

Код в этом репозитории — MIT. Набор иконок Solar — © 480 Design,
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
