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
