# @box-ui/storybook

The documentation site — <https://egorovdnikita.github.io/box-ui/>.

```bash
npm run storybook          # dev server
npm run build:storybook    # static build into storybook-static/
npm run deploy:storybook   # build + publish to the gh-pages branch
```

## Layout

```
.storybook/preview.tsx   toolbar switches, mode attributes, Storybook chrome variables
.storybook/preview.css   every docs style, written against --sb-*
stories/_ui.tsx          the docs kit: Page, Toolbar, Search, Swatch, Row, Callout…
stories/Introduction.mdx the landing page
stories/foundations/     Colors, Scales, Typography
stories/icons/           UI Icons, Figma families
```

## Two palettes, on purpose

The chrome — background, type, borders, radius, accent — is **Storybook's own**, read
out of `storybook/theming` at preview boot and published as `--sb-*` custom properties.
It follows `prefers-color-scheme` exactly as the manager does, so the canvas can never
drift from the toolbar above it. Write documentation UI against `--sb-*`.

**Box UI tokens paint only what is being documented.** Any demo that uses them must carry
its own background *and* foreground — `demoSurface` in `_ui.tsx` does this — otherwise a
Light-theme demo disappears against a dark canvas. That is a real bug this repo has
already shipped twice.

## Toolbar globals

`theme`, `accent`, `radius`, `font` and `device` are written onto `<html>` as `data-*`
attributes; `iconStyle` goes through `<IconStyleProvider>`. A story reads them from the
second render argument:

```tsx
render: (_args, { globals }) => <Family id="flags" globals={globals as ModeGlobals} />
```

To resolve two modes side by side on one page, use `<Scope>` — and set *all five*
attributes, for the reason spelled out in the root README.

## Filters live in args, not in `useState`

Anything the reader can change on a page — a search, a select, a checkbox — is a
Storybook **arg**. Storybook keeps args in the URL, so a filtered view is a link
someone can paste to a colleague, and the *Copy link* button in each toolbar hands
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

The Controls panel being hidden does not affect any of this — args still round-trip
through the URL.

## Chrome icons are pinned

`<ChromeIcon>` in `_ui.tsx` always renders Linear. Documentation UI must not follow the
reader's *Icon style* choice, and Solar does not draw every icon in every style —
`magnifer` has no Bold Duotone or Line Duotone, which once emptied the search field on
those two settings. Use it for anything that is part of the interface rather than part
of the subject.

## Adding a page

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

`<Page>` provides the copy-to-clipboard context, so `useCopy()` only works **below** it —
calling it in the story's own render function silently returns a no-op.

Sections are documentation pages rather than components with args, so the addon panel is
hidden globally (`options.showPanel: false`). Story order lives in `storySort`.
