import { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs, useGlobals } from 'storybook/preview-api';
import {
  Icon,
  ICON_SIZES,
  ICON_SIZE_PX,
  ICON_STYLES,
  ICON_STYLE_LABELS,
  catalog,
  type IconSizeToken,
  type IconStyle,
} from '@box-ui/icons';
import { Counts, Empty, Page, ResetFilters, Search, Select, ShareLink, counted, matches } from '../_ui';
import { IconGrid, IconTile, Inspector } from './_browser';

const meta: Meta = {
  // `id` is pinned so translating the title does not change the story URLs.
  id: 'icons-system',
  title: 'Иконки/System',
};
export default meta;

/** Category names stay as the Figma page spells them. */
const ALL_CATEGORIES = 'All';

interface GalleryArgs {
  query: string;
  category: string;
  size: IconSizeToken;
  /** The icon open in the inspector — in the URL, so a link can point at one icon. */
  icon: string;
}

const DEFAULTS: GalleryArgs = { query: '', category: ALL_CATEGORIES, size: 'xs', icon: '' };

export const System: StoryObj<GalleryArgs> = {
  name: 'System',
  args: DEFAULTS,
  render: function Render(args) {
    const [, updateArgs] = useArgs<GalleryArgs>();
    // The style is the "Иконки" mode, so choosing it here switches it everywhere.
    const [globals, updateGlobals] = useGlobals();
    const { query, category, size, icon: picked } = args;
    const set = (patch: Partial<GalleryArgs>) => updateArgs(patch);
    const style = (globals.iconStyle as IconStyle) ?? 'bold';
    const dirty = (Object.keys(DEFAULTS) as (keyof GalleryArgs)[]).some(
      (key) => key !== 'icon' && args[key] !== DEFAULTS[key],
    );

    const filtered = useMemo(
      () =>
        catalog.icons.filter(
          (icon) =>
            (category === ALL_CATEGORIES || icon.category === category) &&
            matches(query, icon.name, icon.title, icon.category),
        ),
      [query, category],
    );
    // An icon missing a style is shown dimmed in a style it has rather than dropped.
    const missing = filtered.filter((icon) => !icon.styles.includes(style)).length;
    const selected = catalog.icons.find((icon) => icon.name === picked);

    return (
      <Page
        title="★ Icons ・ System"
        lead="Solar — это большая библиотека иконок, состоящая из пиктограмм, выполненных в современном стиле"
        toolbar={
          <>
            <Search value={query} onChange={(value) => set({ query: value })} placeholder="Имя или категория" />
            <Select
              label="Категория"
              value={category}
              onChange={(value) => set({ category: value })}
              options={[
                { value: ALL_CATEGORIES, label: 'все' },
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
              options={ICON_SIZES.map((s) => ({ value: s, label: `${s} · ${ICON_SIZE_PX[s]}px` }))}
            />
            <Counts>
              <span className="sb-caption">
                {counted(filtered.length, ['иконка', 'иконки', 'иконок'])}
                {missing > 0 && <span className="sb-warning"> · {missing} не нарисованы в этом стиле</span>}
              </span>
              {dirty && filtered.length > 0 && <ResetFilters onReset={() => set({ ...DEFAULTS, icon: picked })} />}
              <ShareLink />
            </Counts>
          </>
        }
      >
        {filtered.length === 0 ? (
          <Empty query={query || category} onClear={() => set(DEFAULTS)} />
        ) : (
          <IconGrid>
            {filtered.map((icon) => {
              const drawn = icon.styles.includes(style);
              return (
                <IconTile
                  key={icon.name}
                  label={icon.title}
                  title={
                    drawn
                      ? `${icon.name} · ${icon.category}`
                      : `${icon.name} · не нарисована в стиле ${ICON_STYLE_LABELS[style]}`
                  }
                  selected={icon.name === picked}
                  muted={!drawn}
                  onSelect={() => set({ icon: icon.name === picked ? '' : icon.name })}
                >
                  <Icon name={icon.name} iconStyle={drawn ? style : icon.styles[0]} size={size} />
                </IconTile>
              );
            })}
          </IconGrid>
        )}

        {selected && (
          <Inspector
            title={selected.title}
            meta={selected.category}
            preview={
              <Icon
                name={selected.name}
                iconStyle={selected.styles.includes(style) ? style : selected.styles[0]}
                size="max"
              />
            }
            actions={[
              { label: 'Имя', value: selected.name },
              { label: 'JSX', value: `<Icon name="${selected.name}" size="${size}" />` },
            ]}
            onClose={() => set({ icon: '' })}
          >
            <div className="sb-inspector__styles" role="radiogroup" aria-label="Стиль">
              {ICON_STYLES.map((s) => {
                const has = selected.styles.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={s === style}
                    disabled={!has}
                    className="sb-inspector__style"
                    title={has ? ICON_STYLE_LABELS[s] : `${ICON_STYLE_LABELS[s]} · не нарисована`}
                    onClick={() => updateGlobals({ iconStyle: s })}
                  >
                    {has ? <Icon name={selected.name} iconStyle={s} size={20} /> : '—'}
                  </button>
                );
              })}
            </div>
          </Inspector>
        )}
      </Page>
    );
  },
};
