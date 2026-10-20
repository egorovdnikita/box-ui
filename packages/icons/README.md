# @box-ui/icons

Набор иконок из Foundation – Core; шесть мод `Style` из Figma переключаются на лету.

```tsx
import { Icon, IconStyleProvider } from '@box-ui/icons';

<IconStyleProvider style="bold-duotone">
  <Icon name="home-smile" size="l" title="Home" />
</IconStyleProvider>;
```

| Свойство    | Тип                                                              | По умолчанию                        |
| ----------- | ---------------------------------------------------------------- | ----------------------------------- |
| `name`      | имя иконки Solar — `arrow-up`, `home-smile`, `card-transfer`, …  | обязательно                         |
| `iconStyle` | `bold` `bold-duotone` `broken` `line-duotone` `linear` `outline` | ближайший провайдер, иначе `linear` |
| `size`      | `min` `2xs` `xs` `s` `m` `l` `xl` `2xl` `max` или число          | `xs`                                |
| `title`     | доступное имя; без него иконка получает `aria-hidden`            | —                                   |

Размеры — токены `size/base/*` из коллекции Grid, поэтому иконки слушаются `data-device`
наравне со всем остальным. Геометрия красится `currentColor`, так что цвет приходит из
окружающего `--surface-base-content-*`.

## UI Icons

1253 компонент-сета UI Icons в файле Figma — это набор
[Solar](https://www.figma.com/community/file/1166831539721848736) авторства 480 Design.
`scripts/build.mjs` берёт геометрию из канонической поставки Solar
(`@iconify-json/solar`), разрезает её по стилям и пишет:

```
src/data/bold.json          1280 иконок
src/data/bold-duotone.json  1247
src/data/broken.json        1288
src/data/line-duotone.json  1277
src/data/linear.json        1288
src/data/outline.json       1292
src/catalog.json            1301 иконка в 38 категориях
src/names.ts                объединение IconName
```

Каждый стиль — отдельный динамический `import()`, поэтому приложение везёт только те
стили, которые рисует. Не каждая иконка существует во всех стилях: доступные перечислены
в `catalog.icons[].styles`, все шесть есть у 1247 из 1301.

Переключение стиля тянет около мегабайта, и всё это время у нового стиля нет геометрии
вообще. Вместо того чтобы на этот момент погасить все иконки на экране, хранилище
продолжает отдавать последний загруженный набор:

```tsx
const { set, pending } = useIconSet('bold-duotone');
```

`pending` истинно, пока `set` подменяет стиль, который ещё летит; `<Icon>` пробрасывает это
как `data-icon-pending`, если промежуточное состояние хочется оформить. Отступать некуда
только на самой первой загрузке.

## Флаги, платежи, бренды

В `src/figma-families.json` лежит состав трёх остальных семейств, считанный прямо из файла
Figma, а в `figma/<family>/` — их графика, выгруженная оттуда же и пропущенная через SVGO.
`scripts/build-families.mjs` берёт каждую запись из Figma со всеми её вариантами; если
вариант тяжелее 50 КБ и экспорт его отбросил, подставляется открытая поставка того же знака:

| Семейство | Страница Figma | Записей | Из Figma | Запасная графика  | Варианты                                                  |
| --------- | -------------- | ------- | -------- | ----------------- | --------------------------------------------------------- |
| Flags     | Flags          | 197     | 179      | `flag-icons` (18) | `Style` = Circle · Rounded · Shape                        |
| Payments  | Payments       | 678     | 677      | `@web3icons` (1)  | нет                                                       |
| Brands    | Brands         | 24      | 24       | —                 | `Style` = Original · Solid, `Circle Shape` = True · False |

Монохромные знаки брендов в Figma залиты `surface/base/content/strong`; сборка возвращает им
`currentColor`, и `FamilyIcon` красит их этим токеном, так что они следуют теме.

```tsx
import { FamilyIcon, familyIndex, useFamily } from '@box-ui/icons';

function Flag({ country }: { country: string }) {
  const flags = useFamily('flags');
  const entry = flags?.items.find((i) => i.slug === country);
  return entry ? <FamilyIcon entry={entry} shape="circle" size="m" /> : null;
}
```

Каждое семейство — отдельный динамический `import()`: один только набор флагов весит около
трёх мегабайт, поэтому ничего не грузится, пока это не понадобится для отрисовки. Запись,
для которой графики нет нигде, сохраняет своё имя из Figma и рисуется монограммой.

После правок в Figma:

```bash
FIGMA_TOKEN=figd_xxx npm run icons:figma   # → figma/<family>/<slug>.svg и manifest.json
npm run build:icons
```

Запасные источники: `flag-icons` (MIT), `@web3icons/core` (MIT) и `cryptocurrency-icons`
(CC0), `simple-icons` (CC0).

## Лицензии

Код — MIT. Иконки Solar — © 480 Design,
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
