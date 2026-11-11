# Как вносить изменения

box-ui собирается из файла Figma [Foundation – Core](https://www.figma.com/design/gbgGmuUBQ7sIfL256KaDXX/Foundation---Core):
токены — из дампов переменных в `tokens/figma/`, иконки — из экспорта в `packages/icons/figma/`.
Поэтому правка токена или иконки начинается в Figma, а не в коде.

- **Правила и протокол правки** — [`CLAUDE.md`](CLAUDE.md): карта коллекций, конвенции имён,
  что считается breaking.
- **Перевыгрузка из Figma** — [`tokens/figma/README.md`](tokens/figma/README.md) и
  [`docs/icons.md`](docs/icons.md).
- **Открытые пункты** — [`docs/audits/2026-10-21-foundation-core.md`](docs/audits/2026-10-21-foundation-core.md).

```bash
npm install
npm run check      # то же, что проверяет CI
npm run storybook
```

Нашли расхождение с Figma или ошибку — заведите issue по шаблону.
