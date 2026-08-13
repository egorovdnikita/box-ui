import type { Meta, StoryObj } from '@storybook/react-vite';
import { model } from '@box-ui/tokens';
import { Text } from '@box-ui/react';
import { Code, Grid, ModeGlobals, Page, Row, Scope, Section } from '../_ui';

const meta: Meta = { title: 'Foundations/Scales' };
export default meta;

type Story = StoryObj;

const grid = model.collections.grid;
const radius = model.collections.radius;

const semantic = (prefix: string) => grid.variables.filter((v) => v.path.startsWith(`${prefix}/`));

export const Spacing: Story = {
  render: () => (
    <Page
      title="Spacing"
      lead="`spacing/base/*` lives in the “Grid” collection: thirteen steps that each carry a Desktop and a Mobile value. From `s` upwards Mobile drops one step of the primitive scale."
    >
      <Section title="Steps">
        {semantic('spacing').map((v) => (
          <Row key={v.cssVar} label={v.cssVar} value={`${v.values.desktop?.alias} · mobile ${v.values.mobile?.alias}`}>
            <div style={{ height: 12, width: `var(${v.cssVar})`, background: 'var(--box-background-sentiment-primary)', borderRadius: 2 }} />
          </Row>
        ))}
      </Section>
    </Page>
  ),
};

export const Rounding: Story = {
  render: (_args, { globals }) => (
    <Page
      title="Rounding"
      lead="Two collections stack here. “Rounding” maps each step to a primitive radius per density (Low / Medium / High), then “Grid” re-maps the steps again for Mobile — `xl` on Desktop resolves to the `l` value on Mobile."
    >
      <Section title="Density modes" description="All three densities side by side; the toolbar “Radius” control drives the rest of the Storybook.">
        <Grid min={220}>
          {radius.modes.map((m) => (
            <Scope
              key={m.slug}
              globals={globals as unknown as ModeGlobals}
              radius={m.slug}
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--box-spacing-base-4xs)' }}
            >
              <Text variant="caption-l" tone="secondary">
                {m.name}
              </Text>
              <div style={{ display: 'flex', gap: 'var(--box-spacing-base-4xs)', flexWrap: 'wrap' }}>
                {['xs', 's', 'm', 'l', 'xl', '2xl'].map((step) => (
                  <div
                    key={step}
                    title={step}
                    style={{
                      width: 44,
                      height: 44,
                      background: 'var(--box-background-sentiment-primary-subtle)',
                      border: '1px solid var(--box-content-sentiment-primary)',
                      borderRadius: `var(--box-rounding-base-${step})`,
                    }}
                  />
                ))}
              </div>
            </Scope>
          ))}
        </Grid>
      </Section>

      <Section title="Steps">
        {semantic('rounding').map((v) => (
          <Row key={v.cssVar} label={v.cssVar} value={`${v.values.desktop?.alias} · mobile ${v.values.mobile?.alias}`}>
            <div
              style={{
                width: 72,
                height: 40,
                borderRadius: `var(${v.cssVar})`,
                background: 'var(--box-background-sentiment-primary-subtle)',
                border: '1px solid var(--box-content-sentiment-primary)',
              }}
            />
          </Row>
        ))}
      </Section>
    </Page>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Page title="Sizes" lead="`size/base/*` from the “Grid” collection — control heights, icon boxes, avatars.">
      <Section title="Steps">
        {semantic('size').map((v) => (
          <Row key={v.cssVar} label={v.cssVar} value={v.values.desktop?.alias}>
            <div
              style={{
                width: `var(${v.cssVar})`,
                height: `var(${v.cssVar})`,
                background: 'var(--box-control-neutral-primary)',
                borderRadius: 'var(--box-rounding-base-2xs)',
              }}
            />
          </Row>
        ))}
      </Section>
    </Page>
  ),
};

export const Opacity: Story = {
  render: () => (
    <Page title="Opacity" lead="The primitive “Opacity” collection, emitted as unitless ratios (`opacity/40` → `0.4`).">
      <Grid min={110}>
        {model.collections.opacity.variables.map((v) => (
          <div key={v.cssVar} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--box-spacing-base-min)' }}>
            <div
              style={{
                height: 44,
                borderRadius: 'var(--box-rounding-base-xs)',
                background: 'var(--box-background-sentiment-primary)',
                opacity: `var(${v.cssVar})`,
              }}
            />
            <Code>{v.path}</Code>
          </div>
        ))}
      </Grid>
    </Page>
  ),
};
