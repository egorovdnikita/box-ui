# Box UI

Дизайн-токены, иконки и React-примитивы, собранные из файла Figma Foundation – Core: в Storybook каждую моду переменных Figma — тему, акцент, скругления, гарнитуру, устройство, статус, вид и состояние контрола — можно переключить вживую.

**→ [Открыть Storybook](https://egorovdnikita.github.io/box-ui/)** · [Файл Figma](https://www.figma.com/design/gbgGmuUBQ7sIfL256KaDXX/Foundation---Core)

## Что умеет

- **Токены из Figma.** 1118 переменных в 15 коллекциях — CSS-переменные и типизированный JS-API, собранные из дословных дампов Figma.
- **Граф как в Figma.** Алиас Figma становится переходом `var()`, поэтому смена моды заново разрешает всё, что ниже. Ни одна тема не продублирована в коде компонентов.
- **Моды — атрибуты.** `data-theme` · `data-accent` · `data-radius` · `data-font` · `data-device` · `data-status` · `data-appearance` · `data-state` · `data-icon-style` свободно сочетаются, в том числе для части страницы.
- **Иконки.** 1253 UI-иконки в 6 стилях под именами и категориями Figma, плюс 197 флагов, 676 платёжных знаков и 24 бренда.
- **React-примитивы.** Button · Badge · Card · Input · Text · Stack — ни одного литерального значения.
- **Storybook.** Страницы токенов повторяют документацию Figma: значение в каждой моде, Code syntax, переход по алиасам, поиск и фильтры в адресе, `var(--…)` копируется по клику.
- **llms.txt.** Вся система одной машиночитаемой страницей; генерируется из модели токенов и поэтому не устаревает.

## Запуск

Нужен Node 20+.

```bash
npm install      # заодно собирает токены и иконки
npm run storybook
```

Storybook откроется на <http://localhost:6006>. Все проверки — `npm run check`: typecheck, lint, format, 46 тестов и сборка Storybook; тот же набор запускает CI.

## Стек

TypeScript · React · CSS custom properties · Storybook · Vite · Vitest · SVGO

## Устройство

Коллекции разложены на три слоя: `◉ Primitives` — сырые литералы, `☯︎ Brand` — то, что меняет бренд, `◑ System` — то, из чего собираются компоненты.

| Пакет                               | Содержимое                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------- |
| [`@box-ui/tokens`](packages/tokens) | CSS-переменные и типизированный JS-API токенов, сгенерированные из дампов Figma |
| [`@box-ui/icons`](packages/icons)   | UI-иконки × 6 стилей и семейства «Флаги / Платежи / Бренды»                     |
| [`@box-ui/react`](packages/react)   | Примитивы, доказывающие граф токенов                                            |
| [`tokens/figma`](tokens/figma)      | Дословные дампы переменных Figma — источник сборки                              |
| [`apps/storybook`](apps/storybook)  | Сайт документации                                                               |

```tsx
import '@box-ui/tokens/css';
import { Button, Card, Text } from '@box-ui/react';
import { Icon } from '@box-ui/icons';

<Card>
  <Text variant="h4">Готово</Text>
  <Button startIcon={<Icon name="check-circle" size="2xs" />}>Продолжить</Button>
</Card>;
```

## Документация

- [Паспорт проекта и правила для агентов](CLAUDE.md)
- [Граф переменных и переключатели мод](docs/variable-graph.md)
- [Пакеты](docs/packages.md)
- [Иконки](docs/icons.md)
- [Storybook и его публикация](docs/storybook.md)
- [Пересборка из Figma, проверки и работа с Claude](docs/development.md)
- [Перевыгрузка дампов Figma](tokens/figma/README.md)
- [Журнал аудитов](docs/AUDIT_LOG.md)
- [Аудит: состояние, решения и открытые пункты](docs/audits/2026-10-21-foundation-core.md)
- [Как вносить изменения](CONTRIBUTING.md)

## Лицензия

MIT. Набор иконок Solar — © 480 Design, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
