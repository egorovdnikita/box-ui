import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Button, Card, Input, Stack, Text, type ButtonVariant, type Sentiment } from '@box-ui/react';
import { Icon } from '@box-ui/icons';
import { Grid, Page, Section } from '../_ui';

const meta: Meta = {
  title: 'Components/Overview',
  parameters: {
    docs: {
      description: {
        component:
          'A deliberately small set of primitives. Their only job is to prove the token graph: none of them contains a literal colour, radius, size or font size.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'outline', 'subtle', 'ghost', 'danger'];
const SENTIMENTS: Sentiment[] = ['primary', 'informative', 'positive', 'warning', 'negative', 'neutral'];

export const Buttons: Story = {
  render: () => (
    <Page title="Button" lead="Height comes from `size/base/*`, padding from `spacing/base/*`, corners from `rounding/base/s`, colour from `control/*`.">
      <Section title="Variants">
        <Stack direction="row" gap="3xs" wrap align="center">
          {VARIANTS.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </Stack>
      </Section>
      <Section title="Sizes">
        <Stack direction="row" gap="3xs" wrap align="center">
          {(['s', 'm', 'l'] as const).map((size) => (
            <Button key={size} size={size} startIcon={<Icon name="bolt" size="min" />}>
              Size {size}
            </Button>
          ))}
        </Stack>
      </Section>
      <Section title="With icons">
        <Stack direction="row" gap="3xs" wrap align="center">
          <Button startIcon={<Icon name="add-circle" size="2xs" />}>Create</Button>
          <Button variant="secondary" endIcon={<Icon name="alt-arrow-right" size="2xs" />}>
            Continue
          </Button>
          <Button variant="outline" iconOnly aria-label="Settings" startIcon={<Icon name="settings" size="2xs" title="Settings" />} />
          <Button disabled>Disabled</Button>
        </Stack>
      </Section>
    </Page>
  ),
};

export const Badges: Story = {
  render: () => (
    <Page title="Badge" lead="Sentiment tokens from the Mode collection — solid and subtle pairs.">
      <Section title="Subtle">
        <Stack direction="row" gap="3xs" wrap>
          {SENTIMENTS.map((sentiment) => (
            <Badge key={sentiment} sentiment={sentiment}>
              {sentiment}
            </Badge>
          ))}
        </Stack>
      </Section>
      <Section title="Solid">
        <Stack direction="row" gap="3xs" wrap>
          {SENTIMENTS.map((sentiment) => (
            <Badge key={sentiment} sentiment={sentiment} variant="solid">
              {sentiment}
            </Badge>
          ))}
        </Stack>
      </Section>
    </Page>
  ),
};

export const Fields: Story = {
  render: () => (
    <Page title="Input" lead="Field chrome uses `border/base/*` and `border/focus/base`; the invalid state uses `border/sentiment/negative`.">
      <Grid min={260}>
        <Input label="Project" placeholder="box-ui" />
        <Input label="Email" placeholder="you@example.com" hint="We never share it." />
        <Input label="Slug" defaultValue="box ui" error="Lowercase letters and dashes only." />
        <Input label="Disabled" placeholder="Not editable" disabled />
      </Grid>
    </Page>
  ),
};

export const Cards: Story = {
  render: () => (
    <Page title="Card" lead="`background/base/secondary` on `border/base/neutral`, rounded with `rounding/base/l`.">
      <Grid min={240}>
        {(['raised', 'flat', 'outline'] as const).map((variant) => (
          <Card key={variant} variant={variant}>
            <Stack gap="4xs">
              <Text variant="h5" as="div">
                {variant}
              </Text>
              <Text variant="body-m" tone="secondary" as="div">
                Switch theme, accent, radius or device — this card follows all four.
              </Text>
            </Stack>
          </Card>
        ))}
      </Grid>
    </Page>
  ),
};

export const KitchenSink: Story = {
  name: 'Kitchen sink',
  render: () => (
    <Page title="Everything at once" lead="One layout that exercises the whole token graph.">
      <Grid min={320}>
        <Card>
          <Stack gap="2xs">
            <Stack direction="row" justify="space-between" align="center">
              <Text variant="h4" as="div">
                Billing
              </Text>
              <Badge sentiment="positive">Active</Badge>
            </Stack>
            <Text variant="body-m" tone="secondary" as="div">
              Your workspace renews on the 1st of every month.
            </Text>
            <Stack direction="row" gap="3xs" align="center">
              <Icon name="card" size="s" />
              <Text variant="body-m" as="span">
                •••• 4242
              </Text>
            </Stack>
            <Stack direction="row" gap="3xs">
              <Button size="s">Update</Button>
              <Button size="s" variant="ghost">
                History
              </Button>
            </Stack>
          </Stack>
        </Card>

        <Card>
          <Stack gap="2xs">
            <Text variant="h4" as="div">
              Invite people
            </Text>
            <Input label="Email" placeholder="teammate@example.com" />
            <Stack direction="row" gap="3xs" wrap>
              {SENTIMENTS.slice(0, 4).map((sentiment) => (
                <Badge key={sentiment} sentiment={sentiment}>
                  {sentiment}
                </Badge>
              ))}
            </Stack>
            <Button startIcon={<Icon name="user-plus" size="2xs" />}>Send invite</Button>
          </Stack>
        </Card>

        <Card variant="flat">
          <Stack gap="2xs">
            <Text variant="h4" as="div">
              Storage
            </Text>
            <div style={{ height: 8, borderRadius: 'var(--box-rounding-base-full)', background: 'var(--box-control-neutral-secondary)' }}>
              <div style={{ width: '64%', height: '100%', borderRadius: 'var(--box-rounding-base-full)', background: 'var(--box-background-sentiment-primary)' }} />
            </div>
            <Text variant="caption-l" tone="secondary" as="div">
              64 GB of 100 GB used
            </Text>
          </Stack>
        </Card>
      </Grid>
    </Page>
  ),
};
