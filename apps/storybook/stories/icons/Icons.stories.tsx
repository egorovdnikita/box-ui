import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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
import { Text } from '@box-ui/react';
import { Code, Count, Empty, Grid, Page, Search, Section, Select, useCopy } from '../_ui';

const meta: Meta = {
  title: 'Icons/UI Icons',
  parameters: {
    docs: {
      description: {
        component: `All ${catalog.icons.length} icons across ${catalog.categories.length} categories, rendered in one grid. The six styles are the \`Style\` variants of the Figma component set, driven by the \`icon-style\` variable; sizes are \`size/base/*\` tokens, so they follow the Device mode too.`,
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

/** One gallery tile. Below `<Page>`, so it can reach the copy context. */
function IconTile({ icon, style, size }: { icon: IconCatalogEntry; style: IconStyle; size: IconSizeToken }) {
  const copy = useCopy();
  const drawn = icon.styles.includes(style);

  return (
    <button
      type="button"
      className="sb-cell"
      title={drawn ? `${icon.name} · ${icon.category}` : `${icon.name} · ${icon.category} — not drawn in ${ICON_STYLE_LABELS[style]}`}
      onClick={() => copy(icon.name)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--box-spacing-base-4xs)',
        padding: 'var(--box-spacing-base-3xs)',
        background: 'var(--box-background-base-secondary)',
        border: drawn ? '1px solid var(--box-border-base-neutral)' : '1px dashed var(--box-border-base-neutral-hover)',
        borderRadius: 'var(--box-rounding-base-s)',
        color: 'var(--box-content-base-primary)',
        minWidth: 0,
        contentVisibility: 'auto',
        containIntrinsicSize: 'auto 68px',
      }}
    >
      <Icon
        name={icon.name}
        iconStyle={drawn ? style : icon.styles[0]}
        size={size}
        style={drawn ? undefined : { opacity: 0.32 }}
      />
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
  );
}

export const Gallery: Story = {
  render: (_args, { globals }) => {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [size, setSize] = useState<IconSizeToken>('xs');
    const [onlyAvailable, setOnlyAvailable] = useState(false);

    const style = (globals.iconStyle as IconStyle) ?? 'linear';

    const filtered = useMemo(() => {
      const q = query.trim().toLowerCase();
      return catalog.icons.filter(
        (icon) =>
          (category === 'All' || icon.category === category) &&
          (!q || icon.name.includes(q)) &&
          (!onlyAvailable || icon.styles.includes(style)),
      );
    }, [query, category, onlyAvailable, style]);

    // Solar does not draw every icon in every style; the gallery shows the whole
    // roster and marks the gaps rather than silently dropping them.
    const missing = filtered.filter((icon) => !icon.styles.includes(style)).length;

    return (
      <Page
        title="Icon gallery"
        lead={
          <>
            Style follows the <strong>Icon style</strong> control in the toolbar — currently{' '}
            <strong>{ICON_STYLE_LABELS[style]}</strong>. Click any icon to copy its name.
          </>
        }
        toolbar={
          <>
            <Search value={query} onChange={setQuery} placeholder="arrow, user, card…" />
            <Select
              label="Category"
              value={category}
              onChange={setCategory}
              options={['All', ...catalog.categories].map((c) => ({ value: c, label: c }))}
            />
            <Select
              label="Size token"
              value={size}
              onChange={setSize}
              options={ICON_SIZES.map((s) => ({ value: s, label: `size/base/${s}` }))}
            />
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--box-spacing-base-4xs)',
                height: 'var(--box-size-base-m)',
                cursor: 'pointer',
              }}
            >
              <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} />
              <Text variant="caption-l" tone="secondary" as="span">
                Only this style
              </Text>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--box-spacing-base-4xs)', height: 'var(--box-size-base-m)', marginLeft: 'auto' }}>
              <Count>{filtered.length} icons</Count>
              {missing > 0 && <Count tone="warning">{missing} not in {ICON_STYLE_LABELS[style]}</Count>}
            </div>
          </>
        }
      >
        {filtered.length === 0 ? (
          <Empty query={query || category} onClear={() => { setQuery(''); setCategory('All'); setOnlyAvailable(false); }} />
        ) : (
          <Grid min={128} gap="4xs">
            {filtered.map((icon) => (
              <IconTile key={icon.name} icon={icon} style={style} size={size} />
            ))}
          </Grid>
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
      <Section title="The same twelve icons in every style">
        <div className="sb-scroller">
          <table className="sb-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th className="sb-table__lead">
                  <Text variant="caption-m" tone="tertiary" as="span">
                    ICON
                  </Text>
                </th>
                {ICON_STYLES.map((style) => (
                  <th key={style} style={{ textAlign: 'center' }}>
                    <Text variant="caption-m" tone="tertiary" as="span">
                      {ICON_STYLE_LABELS[style]}
                    </Text>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PREVIEW.map((name) => (
                <tr key={name}>
                  <td className="sb-table__lead">
                    <Code copyable={name}>{name}</Code>
                  </td>
                  {ICON_STYLES.map((style) => (
                    <td key={style} style={{ textAlign: 'center' }}>
                      <Icon name={name} iconStyle={style} size="s" style={{ margin: '0 auto' }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </Page>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Page
      title="Icon sizes"
      lead="Sizes are the `size/base/*` tokens, not hard-coded pixels — switch Device to Mobile and the boxes follow the Grid collection."
    >
      <Section title="Every size token" aside={<Count>{ICON_SIZES.length} tokens</Count>}>
        <div style={{ display: 'flex', gap: 'var(--box-spacing-base-s)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {ICON_SIZES.map((size) => (
            <div key={size} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--box-spacing-base-4xs)', alignItems: 'center' }}>
              <Icon name="star" size={size} />
              <Text variant="caption-m" tone="tertiary" as="span">
                {size}
              </Text>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Colour"
        description="Icons paint with `currentColor`, so they inherit whichever `--box-content-*` token their container uses."
      >
        <div style={{ display: 'flex', gap: 'var(--box-spacing-base-s)', flexWrap: 'wrap' }}>
          {[
            ['primary', 'var(--box-content-base-primary)'],
            ['secondary', 'var(--box-content-base-secondary)'],
            ['sentiment/primary', 'var(--box-content-sentiment-primary)'],
            ['positive', 'var(--box-content-sentiment-positive)'],
            ['warning', 'var(--box-content-sentiment-warning)'],
            ['negative', 'var(--box-content-sentiment-negative)'],
          ].map(([label, color]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--box-spacing-base-4xs)', alignItems: 'center', color }}>
              <Icon name="shield-check" size="l" />
              <Text variant="caption-m" as="span">
                {label}
              </Text>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Usage">
        <Code>{`<Icon name="shield-check" size="l" iconStyle="bold" title="Verified" />`}</Code>
      </Section>
    </Page>
  ),
};
