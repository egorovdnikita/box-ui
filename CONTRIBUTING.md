# Как вносить изменения

Box UI собирается из файла Figma [Foundation – Core](https://www.figma.com/design/gbgGmuUBQ7sIfL256KaDXX/Foundation---Core):
токены — из дампов переменных в `tokens/figma/`, иконки — из экспорта в `packages/icons/figma/`.
Поэтому правка токена или иконки начинается в Figma, а не в коде.

- **Правила и протокол правки** — [`CLAUDE.md`](CLAUDE.md): карта коллекций, конвенции имён,
  что считается breaking.
- **Перевыгрузка из Figma** — [`tokens/figma/README.md`](tokens/figma/README.md) и раздел
  «Иконки» в [`README.md`](README.md).
- **Открытые пункты** — [`docs/audit.md`](docs/audit.md).

```bash
npm install
npm run check      # то же, что проверяет CI
npm run storybook
```

Нашли расхождение с Figma или ошибку — заведите issue по шаблону.
