# @box-ui/icons

Набор иконок из `Box UI | Icons`; шесть мод `Style` из Figma переключаются на лету.

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
окружающего `--box-content-*`.

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
Figma; `scripts/build-families.mjs` подбирает каждой записи графику:

| Семейство | Страница Figma | Записей | С графикой | Варианты                                                  |
| --------- | -------------- | ------- | ---------- | --------------------------------------------------------- |
| Flags     | Flags          | 197     | 197        | `Style` = Circle · Rounded · Shape                        |
| Payments  | Payments       | 675     | 541        | нет                                                       |
| Brands    | Brands         | 24      | 21         | `Style` = Original · Solid, `Circle Shape` = True · False |

```tsx
import { FamilyIcon, familyIndex, useFamily } from '@box-ui/icons';

function Flag({ country }: { country: string }) {
  const flags = useFamily('flags');
  const entry = flags?.items.find((i) => i.slug === country);
  return entry ? <FamilyIcon entry={entry} shape="circle" size="m" /> : null;
}
```

Каждое семейство — отдельный динамический `import()`: один только набор флагов весит больше
мегабайта, поэтому ничего не грузится, пока это не понадобится для отрисовки. Записи без
соответствия в источнике сохраняют своё имя из Figma и `body: null`; `FamilyIcon` рисует их
монограммой.

Источники: `flag-icons` (MIT), `@web3icons/core` (MIT) и `cryptocurrency-icons` (CC0),
`simple-icons` (CC0). Чтобы подставить вместо них дословные экспорты из Figma:

```bash
FIGMA_TOKEN=figd_xxx npm run icons:figma -- --family flags
```

Файлы окажутся в `src/data/<family>/<slug>.svg` рядом с `manifest.json`.

## Лицензии

Код — MIT. Иконки Solar — © 480 Design,
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
