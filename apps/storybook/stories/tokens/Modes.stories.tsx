import type { Meta, StoryObj } from '@storybook/react-vite';
import { model } from '@box-ui/tokens';
import { Badge, Button, Card, Input, Stack, Text } from '@box-ui/react';
import { Icon } from '@box-ui/icons';
import { Code, Grid, ModeGlobals, Page, Scope, Section } from '../_ui';

const meta: Meta = {
  title: 'Tokens/Modes',
  parameters: {
    docs: {
      description: {
        component:
          'Every switchable collection in `Box UI | Tokens`, rendered as CSS custom properties under a `data-*` attribute. Nothing is duplicated per theme in component code — a mode switch re-resolves the same variable chain.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

const asGlobals = (globals: Record<string, unknown>) => globals as unknown as ModeGlobals;

function Sample({ label }: { label: string }) {
  return (
    <Card>
      <Stack gap="2xs">
        <Stack direction="row" gap="3xs" align="center" justify="space-between">
          <Text variant="h5" as="div">
            {label}
          </Text>
          <Badge sentiment="primary">Live</Badge>
        </Stack>
        <Text variant="body-m" tone="secondary" as="div">
          Background, border, radius, spacing and type all come from tokens.
        </Text>
        <Input label="Workspace" placeholder="box-ui" />
        <Stack direction="row" gap="3xs" wrap>
          <Button size="s" startIcon={<Icon name="check-circle" size="min" />}>
            Save
          </Button>
          <Button size="s" variant="secondary">
            Cancel
          </Button>
          <Button size="s" variant="subtle" iconOnly aria-label="More" startIcon={<Icon name="menu-dots" size="min" title="More" />} />
        </Stack>
      </Stack>
    </Card>
  );
}

const panel = {
  padding: 'var(--box-spacing-base-xs)',
  borderRadius: 'var(--box-rounding-base-l)',
  background: 'var(--box-background-base-primary)',
};

export const Theme: Story = {
  name: 'Theme — Light / Dark',
  render: (_args, { globals }) => (
    <Page title="Theme" lead={<Code>Figma: Tokens → Mode → [data-theme]</Code>}>
      <Grid min={320}>
        {model.collections.mode.modes.map((m) => (
          <Scope key={m.slug} globals={asGlobals(globals)} theme={m.slug} style={panel}>
            <Sample label={m.name} />
          </Scope>
        ))}
      </Grid>
    </Page>
  ),
};

export const Accent: Story = {
  name: 'Accent — 10 colour modes',
  render: (_args, { globals }) => (
    <Page title="Accent" lead={<Code>Figma: Tokens → Color → [data-accent]</Code>}>
      <Section
        title="Every mode"
        description="In the Figma file the Teal mode points at the green ramp, Cyan at pink and Yellow at rose. The generated CSS mirrors the file exactly — fix it in Figma and re-run the build."
      >
        <Grid min={260}>
          {model.collections.accent.modes.map((m) => (
            <Scope key={m.slug} globals={asGlobals(globals)} accent={m.slug}>
              <Sample label={m.name} />
            </Scope>
          ))}
        </Grid>
      </Section>
    </Page>
  ),
};

export const Radius: Story = {
  name: 'Radius — density',
  render: (_args, { globals }) => (
    <Page title="Rounding density" lead={<Code>Figma: Tokens → Rounding → [data-radius]</Code>}>
      <Grid min={280}>
        {model.collections.radius.modes.map((m) => (
          <Scope key={m.slug} globals={asGlobals(globals)} radius={m.slug}>
            <Sample label={m.name} />
          </Scope>
        ))}
      </Grid>
    </Page>
  ),
};

export const Device: Story = {
  name: 'Device — Desktop / Mobile',
  render: (_args, { globals }) => (
    <Page title="Device" lead={<Code>Figma: Tokens → Grid → [data-device]</Code>}>
      <Section title="Same markup, two devices" description="Mobile compresses the type ramp, tightens spacing from `s` up and steps rounding down from `l` up.">
        <Grid min={300}>
          {model.collections.grid.modes.map((m) => (
            <Scope key={m.slug} globals={asGlobals(globals)} device={m.slug}>
              <Stack gap="2xs">
                <Text variant="h3" as="div">
                  {m.name}
                </Text>
                <Sample label={`${m.name} card`} />
              </Stack>
            </Scope>
          ))}
        </Grid>
      </Section>
    </Page>
  ),
};

export const Matrix: Story = {
  name: 'Theme × Accent × Radius',
  render: (_args, { globals }) => (
    <Page title="Combined" lead="Modes are independent: each collection sets its own attribute, and they compose.">
      {model.collections.mode.modes.map((theme) => (
        <Section key={theme.slug} title={`Theme: ${theme.name}`}>
          <Scope globals={asGlobals(globals)} theme={theme.slug} style={panel}>
            <Grid min={200}>
              {model.collections.accent.modes.slice(0, 5).map((accent) =>
                model.collections.radius.modes.map((radius) => (
                  <Scope
                    key={`${accent.slug}-${radius.slug}`}
                    globals={asGlobals(globals)}
                    theme={theme.slug}
                    accent={accent.slug}
                    radius={radius.slug}
                  >
                    <Card padding="2xs">
                      <Stack gap="4xs">
                        <Text variant="caption-l" tone="secondary" as="div">
                          {accent.name} · {radius.name}
                        </Text>
                        <Button size="s">Button</Button>
                      </Stack>
                    </Card>
                  </Scope>
                )),
              )}
            </Grid>
          </Scope>
        </Section>
      ))}
    </Page>
  ),
};

export const Chain: Story = {
  name: 'Alias chain',
  render: () => {
    const token = model.collections.mode.variables.find((v) => v.path === 'background/sentiment/primary')!;
    const accentToken = model.collections.accent.variables.find((v) => v.path === 'colors/brand/primary')!;

    return (
      <Page
        title="How one token resolves"
        lead="`background/sentiment/primary` never holds a colour of its own — it is three `var()` hops from a hex value, and each hop is switchable."
      >
        <Section title="The chain">
          <Stack gap="3xs">
            <Code>{`${token.cssVar}  →  var(${token.values.light?.cssVar})            [data-theme]`}</Code>
            <Code>{`${accentToken.cssVar}  →  var(${accentToken.values.blue?.cssVar})   [data-accent]`}</Code>
            <Code>{`--box-color-blue-solid-500  →  #3b82f6                          (primitive, fixed)`}</Code>
          </Stack>
        </Section>
        <Section title="Resolved right now">
          <div style={{ height: 72, borderRadius: 'var(--box-rounding-base-m)', background: `var(${token.cssVar})` }} />
        </Section>
        <Section
          title="Scoping a subtree"
          description="A custom property is substituted where it is declared, not where it is read. To switch modes for part of a page, set every attribute on that one element — then all layers re-declare there and the chain resolves locally."
        >
          <Stack gap="3xs">
            <Code>{`<div data-theme="dark" data-accent="violet" data-radius="high" data-font="inter" data-device="mobile">`}</Code>
            <Text variant="body-m" tone="secondary" as="div">
              Setting only <Code>data-accent</Code> deeper in the tree would not reach a Mode token that an ancestor already resolved.
            </Text>
          </Stack>
        </Section>
      </Page>
    );
  },
};
