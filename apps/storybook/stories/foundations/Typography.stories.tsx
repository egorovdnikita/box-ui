import type { Meta, StoryObj } from '@storybook/react-vite';
import { model } from '@box-ui/tokens';
import { Text, type TextVariant } from '@box-ui/react';
import { Caption, Code, Count, ModeGlobals, Page, Scope, Section, demoSurface } from '../_ui';

const meta: Meta = { title: 'Foundations/Typography' };
export default meta;

type Story = StoryObj;

const grid = model.collections.grid;
const font = model.collections.font;

const RAMP: { variant: TextVariant; token: string; sample: string }[] = [
  { variant: 'display-l', token: 'typography/display/l', sample: 'Display L' },
  { variant: 'display-m', token: 'typography/display/m', sample: 'Display M' },
  { variant: 'display-s', token: 'typography/display/s', sample: 'Display S' },
  { variant: 'h1', token: 'typography/heading/H1', sample: 'Heading 1' },
  { variant: 'h2', token: 'typography/heading/H2', sample: 'Heading 2' },
  { variant: 'h3', token: 'typography/heading/H3', sample: 'Heading 3' },
  { variant: 'h4', token: 'typography/heading/H4', sample: 'Heading 4' },
  { variant: 'h5', token: 'typography/heading/H5', sample: 'Heading 5' },
  { variant: 'body-l', token: 'typography/body/l', sample: 'Body L — the quick brown fox jumps over the lazy dog' },
  { variant: 'body-m', token: 'typography/body/m', sample: 'Body M — the quick brown fox jumps over the lazy dog' },
  { variant: 'caption-l', token: 'typography/caption/l', sample: 'Caption L — supporting copy' },
  { variant: 'caption-m', token: 'typography/caption/m', sample: 'Caption M — supporting copy' },
];

function sizesFor(token: string) {
  const size = grid.variables.find((v) => v.path === `${token}/font-size`);
  const line = grid.variables.find((v) => v.path === `${token}/line-height`);
  return {
    desktop: `${size?.values.desktop?.alias} / ${line?.values.desktop?.alias}`,
    mobile: `${size?.values.mobile?.alias} / ${line?.values.mobile?.alias}`,
  };
}

export const Ramp: Story = {
  name: 'Type ramp',
  render: () => (
    <Page
      title="Type ramp"
      lead="Twelve type styles from the “Grid” collection. Every step has its own Desktop and Mobile value — switch “Device” in the toolbar to see the ramp compress."
    >
      <Section
        title="Steps"
        description="Each row shows the Figma token, what it resolves to on either device, and the style itself."
        aside={<Count>{RAMP.length} styles</Count>}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {RAMP.map(({ variant, token, sample }) => {
            const sizes = sizesFor(token);
            const responsive = sizes.desktop !== sizes.mobile;
            return (
              <div
                key={variant}
                className="sb-row"
                style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 6px' }}
              >
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <Code copyable={token}>{token}</Code>
                  <Caption>
                    {sizes.desktop}
                    {responsive && ` · mobile ${sizes.mobile}`}
                  </Caption>
                  {responsive && <Count>responsive</Count>}
                </div>
                <Text variant={variant} as="div" style={{ color: 'var(--sb-text)' }}>
                  {sample}
                </Text>
              </div>
            );
          })}
        </div>
      </Section>
    </Page>
  ),
};

export const Typefaces: Story = {
  name: 'Typeface modes',
  render: (_args, { globals }) => (
    <Page
      title="Typeface modes"
      lead="The “Typography” collection swaps the font family behind `typography/font-family/*`. All four modes render below at once; the toolbar control changes the one the rest of the Storybook uses."
    >
      {font.modes.map((m) => (
        <Section key={m.slug} title={m.name} aside={<Code>{`[data-font="${m.slug}"]`}</Code>}>
          <Scope
            globals={globals as unknown as ModeGlobals}
            font={m.slug}
            style={{ ...demoSurface, display: 'flex', flexDirection: 'column', gap: 'var(--box-spacing-base-4xs)' }}
          >
            <Text variant="h3" as="div">
              Box UI — {m.name}
            </Text>
            <Text variant="body-m" as="div" tone="secondary">
              The quick brown fox jumps over the lazy dog · 0123456789
            </Text>
          </Scope>
        </Section>
      ))}
      <Section
        title="Fallbacks"
        description="Only the family name comes from Figma. The generated CSS appends `var(--box-font-fallback)` so an unavailable family degrades to the system stack instead of to a serif default."
      >
        <Code>--box-type-font-family-heading: "Inter Display", var(--box-font-fallback);</Code>
      </Section>
    </Page>
  ),
};
