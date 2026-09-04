# @box-ui/storybook

Сайт документации — <https://egorovdnikita.github.io/box-ui/>.

```bash
npm run storybook          # дев-сервер
npm run build:storybook    # статическая сборка в storybook-static/
npm run deploy:storybook   # собрать и опубликовать в ветку gh-pages
```

## Устройство

```
.storybook/main.ts          какие истории собирать, аддон docs, staticDirs
.storybook/manager.ts       брендирование сайдбара: имя, версия, ссылка на репозиторий
.storybook/preview.tsx      переключатели, атрибуты мод, переменные оформления Storybook
.storybook/preview.css      все стили документации, написаны на --sb-*
stories/_lib.ts             чистые хелперы, покрыты тестами в tests/
stories/_ui.tsx             набор для документации: Page, Toolbar, Search, Swatch, Row, Callout…
stories/Introduction.mdx    граф переменных
stories/GettingStarted.mdx  установка и применение
stories/foundations/        Цвета, Шкалы, Типографика
stories/icons/              UI Icons, семейства Figma
public/llms.txt             генерируется, отдаётся из корня сайта
```

`public/` копируется в корень сборки — так `llms.txt` и оказывается по адресу `/llms.txt`.
Его пишет `scripts/build-llms-txt.mjs` из модели токенов, поэтому каждое число в нём
посчитано, а не набрано руками; `tests/llms.test.ts` падает, если файл разъедется.

## Две палитры, и это намеренно

The chrome — background, type, borders, radius, accent — is **Storybook's own**, read
out of `storybook/theming` at preview boot and published as `--sb-*` custom properties.
It follows `prefers-color-scheme` exactly as the manager does, so the canvas can never
drift from the toolbar above it. Write documentation UI against `--sb-*`.

**Box UI tokens paint only what is being documented.** Any demo that uses them must carry
its own background _and_ foreground — `demoSurface` in `_ui.tsx` does this — otherwise a
Light-theme demo disappears against a dark canvas. That is a real bug this repo has
already shipped twice.

## Глобальные переключатели

`theme`, `accent`, `radius`, `font` и `device` пишутся на `<html>` как атрибуты `data-*`;
`iconStyle` идёт через `<IconStyleProvider>`. История читает их из второго аргумента
`render`:

```tsx
render: (_args, { globals }) => <Family id="flags" globals={globals as ModeGlobals} />;
```

To resolve two modes side by side on one page, use `<Scope>` — and set _all five_
attributes, for the reason spelled out in the root README.

## Фильтры живут в args, а не в `useState`

Anything the reader can change on a page — a search, a select, a checkbox — is a
Storybook **arg**. Storybook keeps args in the URL, so a filtered view is a link
someone can paste to a colleague, and the _Copy link_ button in each toolbar hands
it over.

`useArgs` reads Storybook's own hook context, so it has to be called from the story's
`render` and the values passed down — calling it from a component nested inside does
not work.

```tsx
const DEFAULTS = { query: '', category: 'All' };

export const Gallery: StoryObj = {
  args: DEFAULTS,
  render: (args) => {
    const [, updateArgs] = useArgs();
    …
  },
};
```

То, что панель Controls скрыта, ни на что здесь не влияет — args всё равно ходят через
адрес в обе стороны.

## Иконки интерфейса прибиты к одному стилю

`<ChromeIcon>` in `_ui.tsx` always renders Linear. Documentation UI must not follow the
reader's _Icon style_ choice, and Solar does not draw every icon in every style —
`magnifer` has no Bold Duotone or Line Duotone, which once emptied the search field on
those two settings. Use it for anything that is part of the interface rather than part
of the subject.

## Как добавить страницу

```tsx
const meta: Meta = { title: 'Foundations/Elevation' };
export default meta;

export const Shadows: StoryObj = {
  render: () => (
    <Page title="Elevation" lead="…" toolbar={<Search … />}>
      <Section title="Steps" aside={<Count>6 steps</Count>}>…</Section>
    </Page>
  ),
};
```

`<Page>` предоставляет контекст копирования, поэтому `useCopy()` работает только **внутри**
него — вызов в самой функции `render` истории молча вернёт пустышку.

Разделы здесь — страницы документации, а не компоненты с args, поэтому панель аддонов
скрыта глобально (`options.showPanel: false`). Порядок разделов задаётся в `storySort`.

Заголовки разделов и историй русские, а `id` у каждой meta закреплён по-английски — чтобы
перевод названий не менял адреса страниц.
