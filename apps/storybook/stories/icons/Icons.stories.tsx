import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, ICON_SIZES, ICON_STYLES, ICON_STYLE_LABELS, catalog, type IconSizeToken, type IconStyle } from '@box-ui/icons';
import { Badge, Button, Card, Input, Stack, Text } from '@box-ui/react';
import { Code, Grid, Page, Section } from '../_ui';

const meta: Meta = {
  title: 'Icons/UI Icons',
  parameters: {
    docs: {
      description: {
        component: `${catalog.icons.length} icons across ${catalog.categories.length} categories. The six styles are the \`Style\` variants of the Figma component set, driven by the \`icon-style\` variable; sizes are \`size/base/*\` tokens, so they follow the Device mode too.`,
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

export const Gallery: Story = {
  render: (_args, { globals }) => {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [size, setSize] = useState<IconSizeToken>('xs');
    const [limit, setLimit] = useState(240);
    const [copied, setCopied] = useState<string | null>(null);

    const style = (globals.iconStyle as IconStyle) ?? 'linear';

    const filtered = useMemo(() => {
      const q = query.trim().toLowerCase();
      return catalog.icons.filter(
        (icon) => (category === 'All' || icon.category === category) && (!q || icon.name.includes(q)),
      );
    }, [query, category]);

    const shown = filtered.slice(0, limit);

    return (
      <Page
        title="Icon gallery"
        lead={
          <>
            Style follows the <strong>Icon style</strong> control in the toolbar — currently{' '}
            <strong>{ICON_STYLE_LABELS[style]}</strong>. Click an icon to copy its name.
          </>
        }
      >
        <Card padding="2xs">
          <Stack direction="row" gap="2xs" wrap align="flex-end">
            <div style={{ minWidth: 240, flex: 1 }}>
              <Input label="Search" placeholder="arrow, user, card…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--box-spacing-base-min)' }}>
              <Text variant="caption-l" tone="secondary" as="span">
                Category
              </Text>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  height: 'var(--box-size-base-m)',
                  borderRadius: 'var(--box-rounding-base-s)',
                  border: '1px solid var(--box-border-base-neutral)',
                  background: 'var(--box-background-base-secondary)',
                  color: 'var(--box-content-base-primary)',
                  paddingInline: 'var(--box-spacing-base-3xs)',
                  fontSize: 'var(--box-typography-body-m-font-size)',
                }}
              >
                {['All', ...catalog.categories].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--box-spacing-base-min)' }}>
              <Text variant="caption-l" tone="secondary" as="span">
                Size token
              </Text>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as IconSizeToken)}
                style={{
                  height: 'var(--box-size-base-m)',
                  borderRadius: 'var(--box-rounding-base-s)',
                  border: '1px solid var(--box-border-base-neutral)',
                  background: 'var(--box-background-base-secondary)',
                  color: 'var(--box-content-base-primary)',
                  paddingInline: 'var(--box-spacing-base-3xs)',
                  fontSize: 'var(--box-typography-body-m-font-size)',
                }}
              >
                {ICON_SIZES.map((s) => (
                  <option key={s} value={s}>
                    size/base/{s}
                  </option>
                ))}
              </select>
            </label>
            <Badge>{filtered.length} icons</Badge>
            {copied && <Badge sentiment="positive">copied “{copied}”</Badge>}
          </Stack>
        </Card>

        <Grid min={132} gap="4xs">
          {shown.map((icon) => (
            <button
              key={icon.name}
              type="button"
              title={`${icon.name} · ${icon.category}`}
              onClick={() => {
                void navigator.clipboard?.writeText(icon.name);
                setCopied(icon.name);
              }}
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
                cursor: 'pointer',
                minWidth: 0,
              }}
            >
              <Icon name={icon.name} size={size} />
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
                {icon.name}
              </span>
            </button>
          ))}
        </Grid>

        {shown.length < filtered.length && (
          <Button variant="secondary" onClick={() => setLimit((l) => l + 480)}>
            Show more ({filtered.length - shown.length} left)
          </Button>
        )}
      </Page>
    );
  },
};

export const Styles: Story = {
  name: 'Style variants',
  render: () => (
    <Page
      title="Style variants"
      lead="The `Icon` collection in Figma has exactly these six modes, and each one is a separate `Style` variant of every component set."
    >
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: 'var(--box-spacing-base-3xs)', textAlign: 'left' }}>
                <Text variant="caption-l" tone="secondary" as="span">
                  icon
                </Text>
              </th>
              {ICON_STYLES.map((style) => (
                <th key={style} style={{ padding: 'var(--box-spacing-base-3xs)' }}>
                  <Text variant="caption-l" tone="secondary" as="span">
                    {ICON_STYLE_LABELS[style]}
                  </Text>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PREVIEW.map((name) => (
              <tr key={name}>
                <td style={{ padding: 'var(--box-spacing-base-3xs)' }}>
                  <Code>{name}</Code>
                </td>
                {ICON_STYLES.map((style) => (
                  <td key={style} style={{ padding: 'var(--box-spacing-base-3xs)', textAlign: 'center' }}>
                    <Icon name={name} iconStyle={style} size="s" style={{ margin: '0 auto' }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Page
      title="Icon sizes"
      lead="Sizes are the `size/base/*` tokens, not hard-coded pixels — switch Device to Mobile and the boxes follow the Grid collection."
    >
      <Section title="Every size token">
        <Stack direction="row" gap="s" align="flex-end" wrap>
          {ICON_SIZES.map((size) => (
            <Stack key={size} gap="4xs" align="center">
              <Icon name="star" size={size} />
              <Text variant="caption-m" tone="tertiary" as="span">
                {size}
              </Text>
            </Stack>
          ))}
        </Stack>
      </Section>
      <Section title="Colour" description="Icons paint with `currentColor`, so they inherit whichever `--box-content-*` token their container uses.">
        <Stack direction="row" gap="s" wrap>
          {[
            ['primary', 'var(--box-content-base-primary)'],
            ['secondary', 'var(--box-content-base-secondary)'],
            ['sentiment/primary', 'var(--box-content-sentiment-primary)'],
            ['positive', 'var(--box-content-sentiment-positive)'],
            ['warning', 'var(--box-content-sentiment-warning)'],
            ['negative', 'var(--box-content-sentiment-negative)'],
          ].map(([label, color]) => (
            <Stack key={label} gap="4xs" align="center" style={{ color }}>
              <Icon name="shield-check" size="l" />
              <Text variant="caption-m" as="span">
                {label}
              </Text>
            </Stack>
          ))}
        </Stack>
      </Section>
      <Section title="Usage">
        <Code>{`<Icon name="shield-check" size="l" iconStyle="bold" title="Verified" />`}</Code>
      </Section>
    </Page>
  ),
};
