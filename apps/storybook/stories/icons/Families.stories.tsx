import { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import {
  FAMILY_SHAPE_LABELS,
  FamilyIcon,
  ICON_SIZES,
  familyIndex,
  useFamily,
  type BrandTone,
  type FamilyIconEntry,
  type FamilyShape,
  type IconFamily,
  type IconSizeToken,
} from '@box-ui/icons';
import {
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
  matches,
  useCopy,
} from '../_ui';

const meta: Meta = {
  // `id` is pinned so translating the title does not change the story URLs.
  id: 'icons-figma-families',
  title: 'Иконки/Семейства Figma',
  parameters: {
    docs: {
      description: {
        component:
          'Кроме Solar UI Icons в `Box UI | Icons` лежат ещё три семейства. Состав и свойства вариантов считаны из файла Figma; сама графика берётся из канонических открытых поставок тех же знаков.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

interface FamilyArgs {
  query: string;
  shape: FamilyShape;
  tone: BrandTone;
  size: IconSizeToken;
}

const SOURCE_NOTE: Record<IconFamily, string> = {
  flags: 'flag-icons (MIT) — флаги стран 4:3 по ISO 3166-1.',
  payments: '@web3icons/core (MIT) и cryptocurrency-icons (CC0) — логотипы токенов по тикеру.',
  brands: 'simple-icons (CC0) — фирменные знаки в их официальном цвете.',
};

/** One roster tile. Below `<Page>`, so it can reach the copy context. */
function FamilyTile({
  item,
  shape,
  tone,
  size,
}: {
  item: FamilyIconEntry;
  shape: FamilyShape;
  tone: BrandTone;
  size: IconSizeToken;
}) {
  const copy = useCopy();
  const detail = [item.ticker, item.code?.toUpperCase()].filter(Boolean).join(' · ');

  return (
    <button
      type="button"
      className={item.body ? 'sb-cell' : 'sb-cell sb-cell--muted'}
      title={`${item.name}${detail ? ` · ${detail}` : ''}${item.body ? '' : ' — графика не поставляется'}`}
      onClick={() => copy(item.slug)}
      style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 96px' }}
    >
      <FamilyIcon entry={item} shape={shape} tone={tone} size={size} />
      <span className="sb-cell__label">{item.name}</span>
    </button>
  );
}

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
  const { query, shape, tone, size } = args;

  const items = useMemo(
    () => (data ? data.items.filter((item) => matches(query, item.name, item.slug, item.ticker, item.code)) : []),
    [data, query],
  );

  const monograms = meta.total - meta.resolved;
  const dirty = (Object.keys(defaults) as (keyof FamilyArgs)[]).some((key) => args[key] !== defaults[key]);

  return (
    <Page
      title={meta.figmaPage}
      lead={
        <>
          {counted(meta.total, ['запись', 'записи', 'записей'])} со страницы <Code>{meta.figmaPage}</Code>, именование{' '}
          <Code>{meta.figmaNaming}</Code>. Клик по плитке копирует её slug. {meta.note}
        </>
      }
      toolbar={
        <>
          <Search
            value={query}
            onChange={(value) => set({ query: value })}
            placeholder={id === 'payments' ? 'bitcoin, BTC…' : 'фильтр…'}
          />
          {shapes.length > 1 && (
            <Select
              label={id === 'brands' ? 'Circle Shape' : 'Стиль'}
              value={shape}
              onChange={(value) => set({ shape: value })}
              options={shapes.map((s) => ({
                value: s,
                label: id === 'brands' ? (s === 'circle' ? 'True' : 'False') : FAMILY_SHAPE_LABELS[s],
              }))}
            />
          )}
          {id === 'brands' && (
            <Select
              label="Стиль"
              value={tone}
              onChange={(value) => set({ tone: value })}
              options={[
                { value: 'original' as BrandTone, label: 'Original' },
                { value: 'solid' as BrandTone, label: 'Solid' },
              ]}
            />
          )}
          <Select
            label="Токен размера"
            value={size}
            onChange={(value) => set({ size: value })}
            options={ICON_SIZES.map((s) => ({ value: s, label: `size/base/${s}` }))}
          />
          <Counts>
            <Count>показано: {items.length}</Count>
            {monograms > 0 && <Count tone="warning">монограммой: {monograms}</Count>}
            {dirty && <ResetFilters onReset={() => set(defaults)} />}
            <ShareLink />
          </Counts>
        </>
      }
    >
      {!data ? (
        <p className="sb-lead">Загружаем {meta.figmaPage.toLowerCase()}…</p>
      ) : items.length === 0 ? (
        <Empty query={query} onClear={() => set(defaults)} />
      ) : (
        <Grid min={148} gap={6}>
          {items.map((item) => (
            <FamilyTile key={item.slug} item={item} shape={shape} tone={tone} size={size} />
          ))}
        </Grid>
      )}

      <Section
        title="Откуда берётся графика"
        description="Состав задаёт файл Figma; геометрия берётся из канонического открытого набора — так же, как UI Icons берут Solar из `@iconify-json/solar`."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p className="sb-lead">
            {SOURCE_NOTE[id]}{' '}
            {monograms > 0 &&
              `Для ${monograms} записей соответствия в источнике нет — они рисуются плиткой-монограммой.`}
          </p>
          <p className="sb-lead">
            Чтобы заменить всё это дословными экспортами из Figma, запустите скрипт с токеном Figma:
          </p>
          <Code
            copyable={`npm run icons:figma -- --family ${id}`}
          >{`FIGMA_TOKEN=figd_xxx npm run icons:figma -- --family ${id}`}</Code>
        </div>
      </Section>
    </Page>
  );
}

/**
 * Filters live in args so Storybook keeps them in the URL — `useArgs` has to be
 * called from the story's own render, not from a component nested inside it.
 */
function story(id: IconFamily, shapes: FamilyShape[]): Story {
  const defaults: FamilyArgs = { query: '', shape: shapes[0], tone: 'original', size: 'max' };
  return {
    args: defaults,
    render: (args) => {
      const [, updateArgs] = useArgs();
      return (
        <Family
          id={id}
          shapes={shapes}
          args={args as unknown as FamilyArgs}
          defaults={defaults}
          set={(patch) => updateArgs(patch)}
        />
      );
    },
  };
}

export const Flags = { ...story('flags', ['natural', 'rounded', 'circle']), name: 'Флаги' };
export const Payments = { ...story('payments', ['natural']), name: 'Платежи' };
export const Brands = { ...story('brands', ['natural', 'circle']), name: 'Бренды' };
