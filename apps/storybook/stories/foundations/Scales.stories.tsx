import type { Meta, StoryObj } from '@storybook/react-vite';
import { model } from '@box-ui/tokens';
import { Code, Count, Grid, ModeGlobals, Page, Row, Scope, Section, demoSurface } from '../_ui';

const meta: Meta = { title: 'Foundations/Scales' };
export default meta;

type Story = StoryObj;

const grid = model.collections.grid;
const radius = model.collections.radius;

const semantic = (prefix: string) => grid.variables.filter((v) => v.path.startsWith(`${prefix}/`));

/** Desktop / Mobile aliases as a compact, readable pair. */
function deviceValue(v: { values: Record<string, { alias?: string } | undefined> }) {
  const desktop = v.values.desktop?.alias?.split('/').pop();
  const mobile = v.values.mobile?.alias?.split('/').pop();
  return desktop === mobile ? desktop : `${desktop} · mobile ${mobile}`;
}

const RESPONSIVE_HINT = 'Rows where the two differ compress on Mobile — switch “Device” in the toolbar to watch them move.';

export const Spacing: Story = {
  render: () => (
    <Page
      title="Spacing"
      lead="`spacing/base/*` lives in the “Grid” collection: thirteen steps that each carry a Desktop and a Mobile value. From `s` upwards Mobile drops one step of the primitive scale."
    >
      <Section title="Steps" description={RESPONSIVE_HINT} aside={<Count>{semantic('spacing').length} steps</Count>}>
        {semantic('spacing').map((v) => (
          <Row key={v.cssVar} label={v.cssVar} value={deviceValue(v)} live>
            <div
              style={{
                height: 14,
                width: `var(${v.cssVar})`,
                background: 'var(--box-background-sentiment-primary)',
                borderRadius: 'var(--box-rounding-base-min)',
              }}
            />
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
      <Section
        title="Density modes"
        description="All three densities side by side; the toolbar “Radius” control drives the rest of the Storybook."
      >
        <Grid min={230}>
          {radius.modes.map((m) => (
            <Scope
              key={m.slug}
              globals={globals as unknown as ModeGlobals}
              radius={m.slug}
              style={{ ...demoSurface, display: 'flex', flexDirection: 'column', gap: 'var(--box-spacing-base-3xs)' }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 'var(--box-typography-caption-l-font-size)' }}>{m.name}</span>
                <code
                  className="sb-code"
                  style={{ color: 'var(--box-content-base-secondary)' }}
                >{`[data-radius="${m.slug}"]`}</code>
              </div>
              <div style={{ display: 'flex', gap: 'var(--box-spacing-base-4xs)', flexWrap: 'wrap' }}>
                {['xs', 's', 'm', 'l', 'xl', '2xl'].map((step) => (
                  <div
                    key={step}
                    title={`rounding/base/${step}`}
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      width: 46,
                      height: 46,
                      background: 'var(--box-background-sentiment-primary-subtle)',
                      border: '1px solid var(--box-content-sentiment-primary)',
                      borderRadius: `var(--box-rounding-base-${step})`,
                      color: 'var(--box-content-sentiment-primary)',
                      fontSize: 'var(--box-typography-caption-m-font-size)',
                    }}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </Scope>
          ))}
        </Grid>
      </Section>

      <Section title="Steps" description={RESPONSIVE_HINT} aside={<Count>{semantic('rounding').length} steps</Count>}>
        {semantic('rounding').map((v) => (
          <Row key={v.cssVar} label={v.cssVar} value={deviceValue(v)} live>
            <div
              style={{
                width: 76,
                height: 42,
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
      <Section title="Steps" aside={<Count>{semantic('size').length} steps</Count>}>
        {semantic('size').map((v) => (
          <Row key={v.cssVar} label={v.cssVar} value={deviceValue(v)} live>
            <div
              style={{
                display: 'grid',
                placeItems: 'center',
                width: `var(${v.cssVar})`,
                height: `var(${v.cssVar})`,
                background: 'var(--box-control-neutral-primary)',
                borderRadius: 'var(--box-rounding-base-2xs)',
                color: 'var(--box-content-base-secondary)',
                fontSize: 'var(--box-typography-caption-m-font-size)',
              }}
            >
              {v.path.split('/').pop()}
            </div>
          </Row>
        ))}
      </Section>
    </Page>
  ),
};

export const Opacity: Story = {
  render: () => (
    <Page title="Opacity" lead="The primitive “Opacity” collection, emitted as unitless ratios (`opacity/40` → `0.4`).">
      <Section title="Steps" aside={<Count>{model.collections.opacity.variables.length} steps</Count>}>
        <Grid min={112}>
          {model.collections.opacity.variables.map((v) => (
            <div key={v.cssVar} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--box-spacing-base-min)' }}>
              <div
                style={{
                  height: 46,
                  borderRadius: 'var(--box-rounding-base-xs)',
                  border: '1px solid var(--box-border-base-neutral)',
                  background: 'var(--box-background-sentiment-primary)',
                  opacity: `var(${v.cssVar})`,
                }}
              />
              <Code copyable={`var(${v.cssVar})`}>{v.path}</Code>
            </div>
          ))}
        </Grid>
      </Section>
    </Page>
  ),
};
