import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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
import { Code, Count, Counts, Empty, Grid, Page, Search, Section, Select, useCopy } from '../_ui';

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

function Family({ id, shapes }: { id: IconFamily; shapes: FamilyShape[] }) {
  const meta = familyIndex[id];
  const data = useFamily(id);
  const [query, setQuery] = useState('');
  const [shape, setShape] = useState<FamilyShape>(shapes[0]);
  const [tone, setTone] = useState<BrandTone>('original');
  const [size, setSize] = useState<IconSizeToken>('max');

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!data) return [];
    if (!q) return data.items;
    return data.items.filter(
      (item) => item.name.toLowerCase().includes(q) || item.slug.includes(q) || item.ticker?.toLowerCase().includes(q),
    );
  }, [data, query]);

  const monograms = meta.total - meta.resolved;

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
          <Search value={query} onChange={setQuery} placeholder={id === 'payments' ? 'bitcoin, BTC…' : 'filter…'} />
          {shapes.length > 1 && (
            <Select
              label={id === 'brands' ? 'Circle Shape' : 'Style'}
              value={shape}
              onChange={setShape}
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
              onChange={setTone}
              options={[
                { value: 'original' as BrandTone, label: 'Original' },
                { value: 'solid' as BrandTone, label: 'Solid' },
              ]}
            />
          )}
          <Select
            label="Size token"
            value={size}
            onChange={setSize}
            options={ICON_SIZES.map((s) => ({ value: s, label: `size/base/${s}` }))}
          />
          <Counts>
            <Count>{items.length} shown</Count>
            {monograms > 0 && <Count tone="warning">{monograms} as monogram</Count>}
          </Counts>
        </>
      }
    >
      {!data ? (
        <p className="sb-lead">Loading {meta.figmaPage.toLowerCase()}…</p>
      ) : items.length === 0 ? (
        <Empty query={query} onClear={() => setQuery('')} />
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

export const Flags: Story = {
  render: () => <Family id="flags" shapes={['natural', 'rounded', 'circle']} />,
};
export const Payments: Story = {
  render: () => <Family id="payments" shapes={['natural']} />,
};
export const Brands: Story = {
  render: () => <Family id="brands" shapes={['natural', 'circle']} />,
};
