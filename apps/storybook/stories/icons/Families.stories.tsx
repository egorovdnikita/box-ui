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
  matches,
  useCopy,
} from '../_ui';

const meta: Meta = {
  title: 'Icons/Figma families',
  parameters: {
    docs: {
      description: {
        component:
          'Besides the Solar UI Icons, `Box UI | Icons` carries three more families. The roster and the variant properties are read off the Figma file; the artwork comes from the canonical open distributions of the same marks.',
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
  flags: 'flag-icons (MIT) — 4:3 country flags by ISO 3166-1.',
  payments: '@web3icons/core (MIT) and cryptocurrency-icons (CC0) — token logos by ticker.',
  brands: 'simple-icons (CC0) — brand marks with their official colour.',
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
      title={`${item.name}${detail ? ` · ${detail}` : ''}${item.body ? '' : ' — no bundled artwork'}`}
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
          {meta.total} entries from the <Code>{meta.figmaPage}</Code> page, named <Code>{meta.figmaNaming}</Code>. Click a
          tile to copy its slug. {meta.note}
        </>
      }
      toolbar={
        <>
          <Search
            value={query}
            onChange={(value) => set({ query: value })}
            placeholder={id === 'payments' ? 'bitcoin, BTC…' : 'filter…'}
          />
          {shapes.length > 1 && (
            <Select
              label={id === 'brands' ? 'Circle Shape' : 'Style'}
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
              label="Style"
              value={tone}
              onChange={(value) => set({ tone: value })}
              options={[
                { value: 'original' as BrandTone, label: 'Original' },
                { value: 'solid' as BrandTone, label: 'Solid' },
              ]}
            />
          )}
          <Select
            label="Size token"
            value={size}
            onChange={(value) => set({ size: value })}
            options={ICON_SIZES.map((s) => ({ value: s, label: `size/base/${s}` }))}
          />
          <Counts>
            <Count>{items.length} shown</Count>
            {monograms > 0 && <Count tone="warning">{monograms} as monogram</Count>}
            {dirty && <ResetFilters onReset={() => set(defaults)} />}
            <ShareLink />
          </Counts>
        </>
      }
    >
      {!data ? (
        <p className="sb-lead">Loading {meta.figmaPage.toLowerCase()}…</p>
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
        title="Where the artwork comes from"
        description="The Figma file defines the roster; the geometry is taken from the canonical open set, the same way UI Icons takes Solar from `@iconify-json/solar`."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p className="sb-lead">
            {SOURCE_NOTE[id]} {monograms > 0 && `${monograms} entries have no upstream match and render as a monogram tile.`}
          </p>
          <p className="sb-lead">To replace all of it with verbatim Figma exports, run the export script with a Figma token:</p>
          <Code copyable={`npm run icons:figma -- --family ${id}`}>{`FIGMA_TOKEN=figd_xxx npm run icons:figma -- --family ${id}`}</Code>
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

export const Flags = story('flags', ['natural', 'rounded', 'circle']);
export const Payments = story('payments', ['natural']);
export const Brands = story('brands', ['natural', 'circle']);
