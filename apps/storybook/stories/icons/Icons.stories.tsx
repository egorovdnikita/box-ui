import { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
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
import {
  Caption,
  Code,
  Count,
  Counts,
  Empty,
  Grid,
  Page,
  ResetFilters,
  Search,
  Section,
  Select,
  ShareLink,
  counted,
  demoSurface,
  matches,
  useCopy,
} from '../_ui';

const meta: Meta = {
  // `id` is pinned so translating the title does not change the story URLs.
  id: 'icons-ui-icons',
  title: 'Иконки/UI Icons',
  parameters: {
    docs: {
      description: {
        component: `Все ${catalog.icons.length} иконок из ${catalog.categories.length} категорий, одной сеткой. Шесть стилей — это варианты \`Style\` компонент-сета в Figma, которыми управляет переменная \`icon-style\`; размеры берутся из токенов \`size/base/*\`, поэтому слушаются и моды Device.`,
      },
    },
  },
};
export default meta;

type Story = StoryObj;

const PREVIEW = [
  'home-smile',
  'user-rounded',
  'settings',
  'bell',
  'magnifer',
  'heart',
  'cart-large-2',
  'card',
  'chat-round-dots',
  'calendar',
  'folder-with-files',
  'bolt',
];

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
      style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 68px' }}
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

export const Gallery: Story = {
  name: 'Галерея',
  // Filters live in args, so Storybook keeps them in the URL and a link to a
  // filtered gallery survives being pasted to someone else.
  args: GALLERY_DEFAULTS,
  render: (args, { globals }) => {
    const [, updateArgs] = useArgs();
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
        title="Галерея иконок"
        lead={
          <>
            Стиль следует за переключателем <strong>Icon style</strong> на панели — сейчас{' '}
            <strong>{ICON_STYLE_LABELS[style]}</strong>. Клик по иконке копирует её имя.
          </>
        }
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
              label="Токен размера"
              value={size}
              onChange={(value) => set({ size: value })}
              options={ICON_SIZES.map((s) => ({ value: s, label: `size/base/${s}` }))}
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
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, height: 28, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => set({ onlyAvailable: e.target.checked })}
              />
              <Caption>Только этот стиль</Caption>
            </label>
            <Counts>
              <Count>{counted(filtered.length, ['иконка', 'иконки', 'иконок'])}</Count>
              {missing > 0 && (
                <Count tone="warning">
                  {missing} нет в стиле {ICON_STYLE_LABELS[style]}
                </Count>
              )}
              {dirty && <ResetFilters onReset={() => set(GALLERY_DEFAULTS)} />}
              <ShareLink />
            </Counts>
          </>
        }
      >
        {filtered.length === 0 ? (
          <Empty query={query || category} onClear={() => set(GALLERY_DEFAULTS)} />
        ) : (
          <Grid min={128} gap={6}>
            {filtered.map((icon) => (
              <IconTile key={icon.name} icon={icon} style={style} size={size} copyAs={copyAs} />
            ))}
          </Grid>
        )}
      </Page>
    );
  },
};

export const Styles: Story = {
  name: 'Варианты стилей',
  render: () => (
    <Page
      title="Варианты стилей"
      lead="В коллекции `Icon` в Figma ровно эти шесть мод, и каждая — отдельный вариант `Style` у каждого компонент-сета."
    >
      <Section
        title="Одни и те же двенадцать иконок во всех стилях"
        description="Прочерк означает, что Solar просто не рисует это сочетание — все шесть стилей есть у 1247 иконок из 1301."
        aside={<Count>{counted(ICON_STYLES.length, ['стиль', 'стиля', 'стилей'])}</Count>}
      >
        <div className="sb-scroller">
          <table className="sb-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th className="sb-table__lead">
                  <span className="sb-label">Иконка</span>
                </th>
                {ICON_STYLES.map((style) => (
                  <th key={style} style={{ textAlign: 'center' }}>
                    <span className="sb-label">{ICON_STYLE_LABELS[style]}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PREVIEW.map((name) => {
                const drawn = catalog.icons.find((icon) => icon.name === name)?.styles ?? [];
                return (
                  <tr key={name}>
                    <td className="sb-table__lead">
                      <Code copyable={name}>{name}</Code>
                    </td>
                    {ICON_STYLES.map((style) => (
                      <td key={style} style={{ textAlign: 'center' }}>
                        {drawn.includes(style) ? (
                          <Icon name={name} iconStyle={style} size="s" style={{ margin: '0 auto' }} />
                        ) : (
                          // Solar has gaps; an empty cell would read as a broken table.
                          <span
                            title={`Solar не рисует ${name} в стиле ${ICON_STYLE_LABELS[style]}`}
                            style={{ color: 'var(--sb-text-muted)', opacity: 0.5 }}
                          >
                            —
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>
    </Page>
  ),
};

export const Sizes: Story = {
  name: 'Размеры',
  render: () => (
    <Page
      title="Размеры иконок"
      lead="Размеры — это токены `size/base/*`, а не зашитые пиксели: переключите Device на Mobile, и боксы поедут за коллекцией Grid."
    >
      <Section
        title="Все токены размеров"
        aside={<Count>{counted(ICON_SIZES.length, ['токен', 'токена', 'токенов'])}</Count>}
      >
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {ICON_SIZES.map((size) => (
            <div key={size} style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
              <Icon name="star" size={size} />
              <Caption>{size}</Caption>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Цвет"
        description="Иконки красятся `currentColor`, поэтому наследуют тот токен `--box-content-*`, который задан контейнером. Это токены контента Box UI, и лежат они на поверхности Box UI — переключите Theme на панели, и карточка поедет целиком."
      >
        <div
          style={{ ...demoSurface, display: 'flex', gap: 20, flexWrap: 'wrap', padding: 'var(--box-spacing-base-m)' }}
        >
          {[
            ['primary', 'var(--box-content-base-primary)'],
            ['secondary', 'var(--box-content-base-secondary)'],
            ['sentiment/primary', 'var(--box-content-sentiment-primary)'],
            ['positive', 'var(--box-content-sentiment-positive)'],
            ['warning', 'var(--box-content-sentiment-warning)'],
            ['negative', 'var(--box-content-sentiment-negative)'],
          ].map(([label, color]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', color }}>
              <Icon name="shield-check" size="l" />
              <span style={{ fontSize: 11 }}>{label}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Использование">
        <Code>{`<Icon name="shield-check" size="l" iconStyle="bold" title="Verified" />`}</Code>
      </Section>
    </Page>
  ),
};
