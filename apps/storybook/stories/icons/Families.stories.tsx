import { useMemo, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  FAMILY_SHAPE_LABELS,
  FamilyIcon,
  familyIndex,
  useFamily,
  type BrandTone,
  type FamilyShape,
  type IconFamily,
  type IconSizeToken,
  ICON_SIZES,
} from '@box-ui/icons';
import { Badge, Card, Input, Stack, Text } from '@box-ui/react';
import { Code, Grid, Page, Section } from '../_ui';

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

const selectStyle = {
  height: 'var(--box-size-base-m)',
  borderRadius: 'var(--box-rounding-base-s)',
  border: '1px solid var(--box-border-base-neutral)',
  background: 'var(--box-background-base-secondary)',
  color: 'var(--box-content-base-primary)',
  paddingInline: 'var(--box-spacing-base-3xs)',
  fontSize: 'var(--box-typography-body-m-font-size)',
} as const;

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--box-spacing-base-min)' }}>
      <Text variant="caption-l" tone="secondary" as="span">
        {label}
      </Text>
      {children}
    </label>
  );
}

const SOURCE_NOTE: Record<IconFamily, string> = {
  flags: 'flag-icons (MIT) — 4:3 country flags by ISO 3166-1.',
  payments: '@web3icons/core (MIT) and cryptocurrency-icons (CC0) — token logos by ticker.',
  brands: 'simple-icons (CC0) — brand marks with their official colour.',
};

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
          {meta.total} entries from the <Code>{meta.figmaPage}</Code> page, named <Code>{meta.figmaNaming}</Code>.{' '}
          {meta.note}
        </>
      }
    >
      <Card padding="2xs">
        <Stack direction="row" gap="2xs" wrap align="flex-end">
          <div style={{ minWidth: 240, flex: 1 }}>
            <Input label="Search" placeholder="filter…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          {shapes.length > 1 && (
            <Field label={id === 'brands' ? 'Circle Shape' : 'Style'}>
              <select value={shape} onChange={(e) => setShape(e.target.value as FamilyShape)} style={selectStyle}>
                {shapes.map((s) => (
                  <option key={s} value={s}>
                    {id === 'brands' ? (s === 'circle' ? 'True' : 'False') : FAMILY_SHAPE_LABELS[s]}
                  </option>
                ))}
              </select>
            </Field>
          )}
          {id === 'brands' && (
            <Field label="Style">
              <select value={tone} onChange={(e) => setTone(e.target.value as BrandTone)} style={selectStyle}>
                <option value="original">Original</option>
                <option value="solid">Solid</option>
              </select>
            </Field>
          )}
          <Field label="Size token">
            <select value={size} onChange={(e) => setSize(e.target.value as IconSizeToken)} style={selectStyle}>
              {ICON_SIZES.map((s) => (
                <option key={s} value={s}>
                  size/base/{s}
                </option>
              ))}
            </select>
          </Field>
          <Badge>{items.length} shown</Badge>
          {monograms > 0 && <Badge sentiment="warning">{monograms} as monogram</Badge>}
        </Stack>
      </Card>

      {!data ? (
        <Text variant="body-m" tone="secondary">
          Loading {meta.figmaPage.toLowerCase()}…
        </Text>
      ) : (
        <Grid min={148} gap="4xs">
          {items.map((item) => (
            <div
              key={item.slug}
              title={`${item.name}${item.ticker ? ` · ${item.ticker}` : ''}${item.code ? ` · ${item.code.toUpperCase()}` : ''}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--box-spacing-base-4xs)',
                padding: 'var(--box-spacing-base-3xs)',
                background: 'var(--box-background-base-secondary)',
                border: '1px solid var(--box-border-base-neutral)',
                borderRadius: 'var(--box-rounding-base-s)',
                color: 'var(--box-content-base-primary)',
                minWidth: 0,
              }}
            >
              <FamilyIcon entry={item} shape={shape} tone={tone} size={size} />
              <span
                style={{
                  fontSize: 'var(--box-typography-caption-m-font-size)',
                  lineHeight: 'var(--box-typography-caption-m-line-height)',
                  color: 'var(--box-content-base-secondary)',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.name}
              </span>
            </div>
          ))}
        </Grid>
      )}

      <Section
        title="Where the artwork comes from"
        description="The Figma file defines the roster; the geometry is taken from the canonical open set, the same way UI Icons takes Solar from `@iconify-json/solar`."
      >
        <Stack gap="4xs">
          <Text variant="body-m" tone="secondary" as="div">
            {SOURCE_NOTE[id]} {monograms > 0 && `${monograms} entries have no upstream match and render as a monogram tile.`}
          </Text>
          <Text variant="body-m" tone="secondary" as="div">
            To replace all of it with verbatim Figma exports, run the export script with a Figma token:
          </Text>
          <Code>{`FIGMA_TOKEN=figd_xxx npm run icons:figma -- --family ${id}`}</Code>
        </Stack>
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
