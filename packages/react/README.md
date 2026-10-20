# @box-ui/react

Намеренно небольшой набор React-примитивов, единственная задача которых — доказать, что
граф токенов работает: в [`src/styles.css`](src/styles.css) нет ни одного литерального
цвета, радиуса, размера или кегля.

```tsx
import '@box-ui/react/styles.css';
import { Badge, BoxUIProvider, Button, Card, Input, Stack, Text } from '@box-ui/react';

<BoxUIProvider theme="dark" accent="bright" radius="high" device="mobile" iconStyle="bold">
  <Card>
    <Text variant="h4">Оплата</Text>
    <Badge family="status" status="positive">
      Активна
    </Badge>
    <Button>Обновить</Button>
  </Card>
</BoxUIProvider>;
```

`BoxUIProvider` выставляет атрибуты `data-*` для мод Figma. `target="local"` (по умолчанию)
кладёт их на обёрточный `<div>`, поэтому на одной странице могут сосуществовать несколько
тем; `target="root"` пишет их на `<html>` и восстанавливает прежние значения при размонтировании.

Все пути — из коллекций System · Theme, System · Responsive и Controls · State;
CSS-имя каждой переменной — её Web code syntax (`spacing/base/m` → `--spacing-m`).

| Компонент | На какие токены опирается                                                                                                                                                                                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Text`    | `typography/*` из System · Responsive; цвет — `surface/base/content/*`, `accent/content/on-soft/default`, `status/content/on-surface/default`, `interaction/disabled/content`                                                                                                                                       |
| `Stack`   | `spacing/base/*` (проп `gap`)                                                                                                                                                                                                                                                                                       |
| `Card`    | `surface/base/fill/raised`, `surface/base/fill/layer-subtle`, `surface/base/border/default`, `surface/base/content/strong`, `rounding/base/l`, `spacing/base/m`                                                                                                                                                     |
| `Button`  | `control/*` из Controls · State, `size/base/*`, `spacing/base/*`, `rounding/base/s`, `typography/body/*`, `typography/caption/l`; фокус — `accent/border/default`                                                                                                                                                   |
| `Badge`   | `control/*` (пропы `family` / `appearance` / `status`), `size/base/2xs`, `spacing/base/4xs`, `rounding/base/min`, `typography/caption/l`                                                                                                                                                                            |
| `Input`   | `surface/base/border/default`, `surface/base/border/strong`, `surface/base/fill/raised`, `surface/base/content/*`, `size/base/xl`, `rounding/base/s`; фокус — `accent/border/default`, `accent/fill/solid`; ошибка — `status/fill/solid`, `status/content/on-surface/default`; выключено — `interaction/disabled/*` |
