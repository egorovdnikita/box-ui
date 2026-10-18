import { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs, useGlobals } from 'storybook/preview-api';
import {
  Icon,
  ICON_SIZES,
  ICON_STYLES,
  ICON_STYLE_LABELS,
  catalog,
  type IconCatalogEntry,
  type IconSizeToken,
  type IconStyle,
} from '@box-ui/icons';
import { Counts, Empty, Grid, Page, ResetFilters, Search, Select, ShareLink, counted, matches, useCopy } from '../_ui';

const meta: Meta = {
  // `id` is pinned so translating the title does not change the story URLs.
  id: 'icons-system',
  title: 'Иконки/Системные',
};
export default meta;

type Story = StoryObj;

type CopyAs = 'name' | 'jsx';

/** What lands on the clipboard when a tile is clicked. */
function snippet(as: CopyAs, name: string, style: IconStyle, size: IconSizeToken): string {
  return as === 'name' ? name : `<Icon name="${name}" iconStyle="${style}" size="${size}" />`;
}

/** One gallery tile. Below `<Page>`, so it can reach the copy context. */
function IconTile({
  icon,
  style,
  size,
  copyAs,
}: {
  icon: IconCatalogEntry;
  style: IconStyle;
  size: IconSizeToken;
  copyAs: CopyAs;
}) {
  const copy = useCopy();
  const drawn = icon.styles.includes(style);

  return (
    <button
      type="button"
      className={drawn ? 'sb-cell' : 'sb-cell sb-cell--muted'}
      title={
        drawn
          ? `${icon.name} · ${icon.category}`
          : `${icon.name} · ${icon.category} — не нарисована в стиле ${ICON_STYLE_LABELS[style]}`
      }
      onClick={() => copy(snippet(copyAs, icon.name, drawn ? style : icon.styles[0], size), icon.name)}
      style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 60px' }}
    >
      <Icon
        name={icon.name}
        iconStyle={drawn ? style : icon.styles[0]}
        size={size}
        style={drawn ? undefined : { opacity: 0.32 }}
      />
      <span className="sb-cell__label">{icon.name}</span>
    </button>
  );
}

/** The catalogue's own category names stay as Solar spells them. */
const ALL_CATEGORIES = 'All';

interface GalleryArgs {
  query: string;
  category: string;
  size: IconSizeToken;
  onlyAvailable: boolean;
  copyAs: CopyAs;
}

const GALLERY_DEFAULTS: GalleryArgs = {
  query: '',
  category: ALL_CATEGORIES,
  size: 'xs',
  onlyAvailable: false,
  copyAs: 'name',
};

export const System: Story = {
  name: 'Системные',
  // Filters live in args, so Storybook keeps them in the URL and a link to a
  // filtered gallery survives being pasted to someone else.
  args: GALLERY_DEFAULTS,
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    // The style is the "Иконки" mode, so choosing it here switches it everywhere.
    const [globals, updateGlobals] = useGlobals();
    const current = args as unknown as GalleryArgs;
    const { query, category, size, onlyAvailable, copyAs } = current;
    const set = (patch: Partial<GalleryArgs>) => updateArgs(patch);
    const dirty = (Object.keys(GALLERY_DEFAULTS) as (keyof GalleryArgs)[]).some(
      (key) => current[key] !== GALLERY_DEFAULTS[key],
    );

    const style = (globals.iconStyle as IconStyle) ?? 'linear';

    const filtered = useMemo(
      () =>
        catalog.icons.filter(
          (icon) =>
            (category === ALL_CATEGORIES || icon.category === category) &&
            matches(query, icon.name, icon.category) &&
            (!onlyAvailable || icon.styles.includes(style)),
        ),
      [query, category, onlyAvailable, style],
    );

    // Solar does not draw every icon in every style; the gallery shows the whole
    // roster and marks the gaps rather than silently dropping them.
    const missing = filtered.filter((icon) => !icon.styles.includes(style)).length;

    return (
      <Page
        title="Системные иконки"
        lead={`${catalog.icons.length} иконок Solar в ${catalog.categories.length} категориях. Стиль — это мода «Brand · Icon», размеры — токены size/base/*, поэтому иконки слушаются и Device. Клик копирует имя или JSX.`}
        toolbar={
          <>
            <Search value={query} onChange={(value) => set({ query: value })} placeholder="arrow up, shield, social…" />
            <Select
              label="Категория"
              value={category}
              onChange={(value) => set({ category: value })}
              options={[
                { value: ALL_CATEGORIES, label: 'Все' },
                ...catalog.categories.map((c) => ({ value: c, label: c })),
              ]}
            />
            <Select
              label="Стиль"
              value={style}
              onChange={(value) => updateGlobals({ iconStyle: value })}
              options={ICON_STYLES.map((s) => ({ value: s, label: ICON_STYLE_LABELS[s] }))}
            />
            <Select
              label="Размер"
              value={size}
              onChange={(value) => set({ size: value })}
              options={ICON_SIZES.map((s) => ({ value: s, label: s }))}
            />
            <Select
              label="Клик копирует"
              value={copyAs}
              onChange={(value) => set({ copyAs: value })}
              options={[
                { value: 'name' as CopyAs, label: 'имя' },
                { value: 'jsx' as CopyAs, label: '<Icon …/>' },
              ]}
            />
            <label className="sb-control sb-check">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => set({ onlyAvailable: e.target.checked })}
              />
              Только в этом стиле
            </label>
            <Counts>
              <span className="sb-caption">
                {counted(filtered.length, ['иконка', 'иконки', 'иконок'])}
                {missing > 0 && (
                  <span className="sb-warning">
                    {' '}
                    · {missing} нет в стиле {ICON_STYLE_LABELS[style]}
                  </span>
                )}
              </span>
              {dirty && <ResetFilters onReset={() => set(GALLERY_DEFAULTS)} />}
              <ShareLink />
            </Counts>
          </>
        }
      >
        {filtered.length === 0 ? (
          <Empty query={query || category} onClear={() => set(GALLERY_DEFAULTS)} />
        ) : (
          <Grid min={96} gap={4}>
            {filtered.map((icon) => (
              <IconTile key={icon.name} icon={icon} style={style} size={size} copyAs={copyAs} />
            ))}
          </Grid>
        )}
      </Page>
    );
  },
};
