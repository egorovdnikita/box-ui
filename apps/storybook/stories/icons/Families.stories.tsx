import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { families } from '@box-ui/icons';
import { Badge, Card, Input, Stack, Text } from '@box-ui/react';
import { Code, Grid, Page, Section } from '../_ui';

const meta: Meta = {
  title: 'Icons/Figma families',
  parameters: {
    docs: {
      description: {
        component:
          'Besides the Solar UI Icons, `Box UI | Icons` carries three more families. Their names and variant properties are catalogued here; their geometry is exported on demand with `npm run icons:figma`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

function Family({ id }: { id: keyof typeof families.families }) {
  const family = families.families[id];
  const [query, setQuery] = useState('');
  const items = family.items.filter((item) => item.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <Page title={family.figmaPage} lead={family.note ?? `Figma naming: ${family.figmaNaming}`}>
      <Card padding="2xs">
        <Stack direction="row" gap="2xs" wrap align="flex-end">
          <div style={{ minWidth: 260, flex: 1 }}>
            <Input label="Search" placeholder="filter…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Badge>{items.length} of {family.items.length}</Badge>
          {family.variants?.map((variant) => (
            <Badge key={variant} sentiment="primary">
              Style = {variant}
            </Badge>
          ))}
          {family.variantProperties &&
            Object.entries(family.variantProperties).map(([property, values]) => (
              <Badge key={property} sentiment="primary">
                {property} = {values.join(' | ')}
              </Badge>
            ))}
        </Stack>
      </Card>

      <Grid min={200} gap="4xs">
        {items.map((item) => (
          <div
            key={item}
            style={{
              padding: 'var(--box-spacing-base-3xs)',
              background: 'var(--box-background-base-secondary)',
              border: '1px solid var(--box-border-base-neutral)',
              borderRadius: 'var(--box-rounding-base-s)',
            }}
          >
            <Text variant="caption-l" as="span">
              {item}
            </Text>
          </div>
        ))}
      </Grid>

      <Section title="Exporting the geometry">
        <Stack gap="4xs">
          <Text variant="body-m" tone="secondary" as="div">
            These are not bundled: the SVGs live only in the Figma file. Pull them with a Figma token and they land in{' '}
            <Code>packages/icons/src/data/{id}/</Code>.
          </Text>
          <Code>{`FIGMA_TOKEN=figd_xxx npm run icons:figma -- --family ${id}`}</Code>
        </Stack>
      </Section>
    </Page>
  );
}

export const Flags: Story = { render: () => <Family id="flags" /> };
export const Payments: Story = { render: () => <Family id="payments" /> };
export const Brands: Story = { render: () => <Family id="brands" /> };
