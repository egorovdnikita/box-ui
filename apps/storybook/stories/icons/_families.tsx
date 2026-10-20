/* The Figma icon families — flags, payments, brands — one story each. */
import { useMemo } from 'react';
import type { StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import {
  FAMILY_SHAPE_LABELS,
  FamilyIcon,
  ICON_SIZES,
  ICON_SIZE_PX,
  familyIndex,
  hasArtwork,
  useFamily,
  type BrandTone,
  type FamilyShape,
  type IconFamily,
  type IconSizeToken,
} from '@box-ui/icons';
import { Counts, Empty, Page, ResetFilters, Search, Select, ShareLink, counted, matches } from '../_ui';
import { IconGrid, IconTile, Inspector } from './_browser';

interface FamilyArgs {
  query: string;
  shape: FamilyShape;
  tone: BrandTone;
  size: IconSizeToken;
  /** The entry open in the inspector, by slug. */
  icon: string;
}

/** Each lead is the text of the page's card in Figma, verbatim. */
const LEAD: Record<IconFamily, string> = {
  flags: 'Набор иконок флагов стран для использования в интерфейсе.',
  payments: 'Набор иконок платёжных систем и сервисов для использования в интерфейсе.',
  brands: 'Набор иконок популярных брендов и продуктов для использования в интерфейсе.',
};

/** Page titles, as in the sidebar. */
const TITLE: Record<IconFamily, string> = { flags: 'Флаги', payments: 'Платежи', brands: 'Бренды' };

const NOUN: Record<IconFamily, [string, string, string]> = {
  flags: ['флаг', 'флага', 'флагов'],
  payments: ['знак', 'знака', 'знаков'],
  brands: ['знак', 'знака', 'знаков'],
};

function Family({
  id,
  shapes,
  args,
  defaults,
  set,
}: {
  id: IconFamily;
  shapes: FamilyShape[];
  args: FamilyArgs;
  defaults: FamilyArgs;
  set: (patch: Partial<FamilyArgs>) => void;
}) {
  const meta = familyIndex[id];
  const data = useFamily(id);
  const { query, shape, tone, size, icon: picked } = args;

  const items = useMemo(
    () => (data ? data.items.filter((item) => matches(query, item.name, item.slug, item.ticker, item.code)) : []),
    [data, query],
  );
  const monograms = items.filter((item) => !hasArtwork(item)).length;
  const selected = data?.items.find((item) => item.slug === picked);
  const dirty = (Object.keys(defaults) as (keyof FamilyArgs)[]).some(
    (key) => key !== 'icon' && args[key] !== defaults[key],
  );

  return (
    <Page
      title={TITLE[id]}
      lead={LEAD[id]}
      toolbar={
        <>
          <Search
            value={query}
            onChange={(value) => set({ query: value })}
            placeholder={id === 'payments' ? 'Название или тикер' : 'Название'}
          />
          {shapes.length > 1 && (
            <Select
              label="Форма"
              value={shape}
              onChange={(value) => set({ shape: value })}
              options={shapes.map((s) => ({ value: s, label: FAMILY_SHAPE_LABELS[s] }))}
            />
          )}
          {id === 'brands' && (
            <Select
              label="Цвет"
              value={tone}
              onChange={(value) => set({ tone: value })}
              options={[
                { value: 'original' as BrandTone, label: 'оригинальный' },
                { value: 'solid' as BrandTone, label: 'монохром' },
              ]}
            />
          )}
          <Select
            label="Размер"
            value={size}
            onChange={(value) => set({ size: value })}
            options={ICON_SIZES.map((s) => ({ value: s, label: `${s} · ${ICON_SIZE_PX[s]}px` }))}
          />
          <Counts>
            <span className="sb-caption">
              {counted(items.length, NOUN[id])}
              {monograms > 0 && (
                <span className="sb-warning" title="Графики для них нет в источнике, поэтому рисуется монограмма">
                  {' '}
                  · {monograms} монограммой
                </span>
              )}
            </span>
            {dirty && <ResetFilters onReset={() => set({ ...defaults, icon: picked })} />}
            <ShareLink />
          </Counts>
        </>
      }
    >
      {!data ? (
        <p className="sb-lead">Загружаем {TITLE[id].toLowerCase()}…</p>
      ) : items.length === 0 ? (
        <Empty query={query} onClear={() => set(defaults)} />
      ) : (
        <IconGrid>
          {items.map((item) => (
            <IconTile
              key={item.slug}
              label={item.name}
              title={[item.name, item.ticker, item.code?.toUpperCase()].filter(Boolean).join(' · ')}
              selected={item.slug === picked}
              muted={!hasArtwork(item)}
              onSelect={() => set({ icon: item.slug === picked ? '' : item.slug })}
            >
              <FamilyIcon entry={item} shape={shape} tone={tone} size={size} />
            </IconTile>
          ))}
        </IconGrid>
      )}

      {selected && (
        <Inspector
          title={selected.name}
          meta={
            [
              selected.ticker,
              selected.code?.toUpperCase(),
              hasArtwork(selected) ? null : 'монограмма: графики нет в источнике',
              // Over the export's size budget in Figma, so drawn from an open set for now.
              selected.source && selected.source !== 'figma' ? `графика из ${selected.source}` : null,
            ]
              .filter(Boolean)
              .join(' · ') || `Figma: ${meta.figmaNaming}`
          }
          preview={<FamilyIcon entry={selected} shape={shape} tone={tone} size="max" />}
          actions={[
            { label: 'Slug', value: selected.slug },
            { label: 'Название', value: selected.name },
          ]}
          onClose={() => set({ icon: '' })}
        />
      )}
    </Page>
  );
}

/**
 * Filters live in args so Storybook keeps them in the URL — `useArgs` has to be
 * called from the story's own render, not from a component nested inside it.
 */
export function familyStory(id: IconFamily, shapes: FamilyShape[]): StoryObj<FamilyArgs> {
  // Same default size as the system icons, so every icon page reads alike.
  const defaults: FamilyArgs = { query: '', shape: shapes[0], tone: 'original', size: 'xs', icon: '' };
  return {
    args: defaults,
    render: function Render(args) {
      const [, updateArgs] = useArgs<FamilyArgs>();
      return <Family id={id} shapes={shapes} args={args} defaults={defaults} set={(patch) => updateArgs(patch)} />;
    },
  };
}
