# Пакеты

| Пакет                                  | Содержимое                                                                                                      |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [`@box-ui/tokens`](../packages/tokens) | CSS-переменные и типизированный JS-API токенов, сгенерированные из дампов Figma                                 |
| [`@box-ui/icons`](../packages/icons)   | 1253 UI-иконки × 6 стилей, плюс семейства «Флаги / Платежи / Бренды»                                            |
| [`@box-ui/react`](../packages/react)   | Button, Badge, Card, Input, Text, Stack — примитивы, доказывающие граф токенов: ни одного литерального значения |
| [`tokens/figma`](../tokens/figma)      | Дословные дампы переменных Figma и [инструкция по перевыгрузке](../tokens/figma/README.md)                      |
| [`apps/storybook`](../apps/storybook)  | Сайт документации — см. [Storybook](storybook.md)                                                               |

```tsx
import '@box-ui/tokens/css';
import { Button, Card, Text } from '@box-ui/react';
import { Icon } from '@box-ui/icons';

<Card>
  <Text variant="h4">Готово</Text>
  <Button startIcon={<Icon name="check-circle" size="2xs" />}>Продолжить</Button>
</Card>;
```
