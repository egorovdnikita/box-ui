# Box UI

Дизайн-токены и иконки, сгенерированные из файла Figma **Box UI**. В Storybook каждую
**моду переменных** Figma — тему, акцент, плотность скруглений, гарнитуру, устройство,
статус, вид контрола и его состояние — можно переключить вживую.

| Файл Figma                                                                                 | Что даёт                                                                                         |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| [Foundation – Core](https://www.figma.com/design/gbgGmuUBQ7sIfL256KaDXX/Foundation---Core) | 1118 переменных в 15 коллекциях, UI Icons (Solar) в 6 стилях, «Флаги / Платежи / Бренды», Button |

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

### Переключатели

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

### Переключение для части страницы

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

Страницы токенов повторяют страницы документации в Figma: те же группы и их описания,
значение в каждой моде, Code syntax. Что они дают сверх файла:

- **Моды.** Кнопка «Моды» на панели переключает все коллекции сразу, тема перекрашивает и
  саму документацию. В таблицах каждая колонка показывает свою моду независимо от выбранной.
- **Навигация.** Клик по алиасу ведёт к переменной, на которую он ссылается; оглавление
  групп, фильтры по разделу, типу и колонкам, поиск по имени, `var(--…)` и описанию. Фильтры
  живут в адресе, поэтому отфильтрованный вид можно переслать.
- **Клик копирует** `var(--…)` — то же имя, что Code syntax в Figma; у иконок — имя или
  готовый `<Icon …/>`.
- **[Обзор](https://egorovdnikita.github.io/box-ui/?path=/story/introduction--docs)** —
  что такое Box UI, что в этом Storybook, установка и подключение мод-атрибутов.
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

Три остальных семейства файла Figma тоже поставляются — 197 флагов, 678 платёжных знаков и
24 бренда, со свойствами вариантов, которые задаёт файл:

```tsx
import { FamilyIcon, useFamily } from '@box-ui/icons';

const flags = useFamily('flags');
<FamilyIcon entry={flags.items[0]} shape="circle" size="max" />;
```

И состав, и графику задаёт файл Figma: экспорт лежит в `packages/icons/figma/<семейство>/`,
пропущенный через SVGO, каждый вариант — как в Figma. Иконку тяжелее 50 КБ экспорт не
берёт, и для неё сборка подставляет открытую поставку того же знака: сейчас это 18 флагов с
детальными гербами (`flag-icons`, MIT) и Curve DAO Token (`@web3icons/core`, MIT). Список
лежит в `overBudget` манифеста; когда герб в Figma упростят, флаг перейдёт на Figma при
следующей выгрузке.

Обновить экспорт после правок в Figma:

```bash
FIGMA_TOKEN=figd_xxx npm run icons:figma                      # флаги + платежи + бренды
FIGMA_TOKEN=figd_xxx npm run icons:figma -- --family flags     # одно семейство
npm run build:icons
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
  разрешается и что ни одна переменная не осталась без моды.
- **Данные иконок.** Каталог и шесть постилевых наборов обязаны сходиться в обе стороны:
  у каждого заявленного стиля должна быть геометрия, а каждая геометрия должна быть заявлена.
  Зашитый `fill="#…"` запрещён — он игнорировал бы токен `--surface-base-content-*` вокруг.
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

---

## Работа с Claude

Figma и этот репозиторий ведёт один агент в Claude Code: правит переменные и документацию в
Figma через Figma MCP и в той же сессии синхронизирует код, проверяет и публикует Storybook.

- [`CLAUDE.md`](CLAUDE.md) — правила: источники, карта коллекций, конвенции переменных,
  протокол любой правки и что считается breaking.
- [`docs/audit.md`](docs/audit.md) — текущее состояние, принятые решения и открытые пункты.
- [`.claude/skills/sync-variable-documentation`](.claude/skills/sync-variable-documentation/SKILL.md)
  — скилл синхронизации таблиц документации в Figma с Variables.

---

## Лицензии

Код в этом репозитории — MIT. Набор иконок Solar — © 480 Design,
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
