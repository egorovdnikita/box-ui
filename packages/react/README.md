# @box-ui/react

Намеренно небольшой набор React-примитивов, единственная задача которых — доказать, что
граф токенов работает: в [`src/styles.css`](src/styles.css) нет ни одного литерального
цвета, радиуса, размера или кегля.

```tsx
import '@box-ui/react/styles.css';
import { Badge, BoxUIProvider, Button, Card, Input, Stack, Text } from '@box-ui/react';

<BoxUIProvider theme="dark" accent="violet" radius="high" device="mobile" iconStyle="bold">
  <Card>
    <Text variant="h4">Оплата</Text>
    <Badge sentiment="positive">Активна</Badge>
    <Button>Обновить</Button>
  </Card>
</BoxUIProvider>;
```

`BoxUIProvider` выставляет атрибуты `data-*` для мод Figma. `target="local"` (по умолчанию)
кладёт их на обёрточный `<div>`, поэтому на одной странице могут сосуществовать несколько
тем; `target="root"` пишет их на `<html>` и восстанавливает прежние значения при размонтировании.

| Компонент | На какие токены опирается                                            |
| --------- | -------------------------------------------------------------------- |
| `Text`    | текстовая шкала `typography/*` из Grid                               |
| `Stack`   | `spacing/base/*`                                                     |
| `Card`    | `background/base/*`, `border/base/*`, `rounding/base/l`              |
| `Button`  | `control/*`, `size/base/*`, `rounding/base/s`, `border/focus/base`   |
| `Badge`   | `background/sentiment/*`, `content/sentiment/*`                      |
| `Input`   | `border/base/*`, `border/sentiment/negative`, `interactive/disabled` |
