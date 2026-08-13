import type { Meta, StoryObj } from '@storybook/react-vite';
import { model } from '@box-ui/tokens';
import { Text } from '@box-ui/react';
import { Code, Grid, Page, Section, Swatch } from '../_ui';

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: { docs: { description: { component: 'Colour variables from `Box UI | Primitives` and `Box UI | Tokens`.' } } },
};
export default meta;

type Story = StoryObj;

const palette = model.collections.palette;
const accent = model.collections.accent;
const mode = model.collections.mode;

/** `blue/solid/500` -> family `blue`, shade `solid/500` */
function groupPalette() {
  const groups = new Map<string, typeof palette.variables>();
  for (const variable of palette.variables) {
    const family = variable.path.split('/')[0];
    const list = groups.get(family) ?? [];
    list.push(variable);
    groups.set(family, list);
  }
  return [...groups];
}

export const Palette: Story = {
  name: 'Primitives — palette',
  render: () => (
    <Page
      title="Colour palette"
      lead={`${palette.variables.length} raw colour variables from the “Color Palette” collection. These never change with a mode — every semantic token points at one of them.`}
    >
      {groupPalette().map(([family, variables]) => (
        <Section key={family} title={family}>
          <Grid min={120}>
            {variables.map((v) => (
              <Swatch
                key={v.cssVar}
                cssVar={v.cssVar}
                name={v.path.split('/').slice(1).join(' / ')}
                meta={String(v.values.value?.value ?? '')}
              />
            ))}
          </Grid>
        </Section>
      ))}
    </Page>
  ),
};

export const Accents: Story = {
  name: 'Accent modes — Color',
  render: () => (
    <Page
      title="Accent colour modes"
      lead="The “Color” collection has ten modes. Switch “Accent” in the toolbar and every brand token below re-points at a different primitive ramp — the semantic names never change."
    >
      <Section title="Every token × every mode" description="Rows are tokens, columns are the ten Figma modes. The swatch renders the value that mode resolves to.">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', fontSize: 'var(--box-typography-caption-l-font-size)' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8, position: 'sticky', left: 0, background: 'var(--box-background-base-primary)' }}>
                  <Text variant="caption-l" tone="secondary">
                    token
                  </Text>
                </th>
                {accent.modes.map((m) => (
                  <th key={m.slug} style={{ padding: 8 }}>
                    <Text variant="caption-l" tone="secondary">
                      {m.name}
                    </Text>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accent.variables.map((v) => (
                <tr key={v.cssVar}>
                  <td style={{ padding: 8, position: 'sticky', left: 0, background: 'var(--box-background-base-primary)' }}>
                    <Code>{v.path}</Code>
                  </td>
                  {accent.modes.map((m) => (
                    <td key={m.slug} style={{ padding: 8 }}>
                      <div
                        title={v.values[m.slug]?.alias}
                        style={{
                          width: 40,
                          height: 24,
                          borderRadius: 'var(--box-rounding-base-min)',
                          border: '1px solid var(--box-border-base-neutral)',
                          background: `var(${v.values[m.slug]?.cssVar})`,
                        }}
                      />
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

export const Semantic: Story = {
  name: 'Semantic — Light / Dark',
  render: () => {
    const groups = new Map<string, typeof mode.variables>();
    for (const variable of mode.variables) {
      const group = variable.path.split('/').slice(0, 2).join(' / ');
      const list = groups.get(group) ?? [];
      list.push(variable);
      groups.set(group, list);
    }

    return (
      <Page
        title="Semantic colours"
        lead={`${mode.variables.length} tokens in the “Mode” collection. Every one of them resolves through the “Color” collection, so they follow both the Theme and the Accent toolbar controls.`}
      >
        {[...groups].map(([group, variables]) => (
          <Section key={group} title={group}>
            <Grid min={180}>
              {variables.map((v) => (
                <Swatch key={v.cssVar} cssVar={v.cssVar} name={v.path.split('/').slice(2).join('/')} meta={<Code>{v.cssVar}</Code>} />
              ))}
            </Grid>
          </Section>
        ))}
      </Page>
    );
  },
};
