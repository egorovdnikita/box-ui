# Иконки

В коллекции `Icon` в Figma одна переменная, `icon-style`, с шестью модами — это шесть
вариантов `Style` у всех 1253 иконок страницы `System`. Состав и имена берутся из Figma
(`packages/icons/src/figma-ui-icons.json`), а геометрия — из набора
[Solar](https://www.figma.com/community/file/1166831539721848736) авторства 480 Design
(CC BY 4.0), на котором он нарисован: из канонической поставки `@iconify-json/solar`. Иконки,
которых в Solar нет, берутся из экспорта Figma. На сборке всё разрезается по стилям:

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

## Флаги, платежи и бренды

Три остальных семейства файла Figma тоже поставляются — 197 флагов, 676 платёжных знаков и
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
