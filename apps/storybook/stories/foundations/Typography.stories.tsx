import type { Meta, StoryObj } from '@storybook/react-vite';
import { model } from '@box-ui/tokens';
import { Text, type TextVariant } from '@box-ui/react';
import { Caption, Code, Count, ModeGlobals, Page, Scope, Section, counted, demoSurface } from '../_ui';

// `id` is pinned so translating the title does not change the story URLs.
const meta: Meta = { id: 'foundations-typography', title: 'Основы/Типографика' };
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
  name: 'Шкала текста',
  render: () => (
    <Page
      title="Шкала текста"
      lead="Двенадцать текстовых стилей из коллекции «Grid». У каждой ступени своё значение для Desktop и для Mobile — переключите «Device» на панели, и шкала сожмётся."
    >
      <Section
        title="Ступени"
        description="В строке — токен Figma, во что он разрешается на каждом устройстве, и сам стиль."
        aside={<Count>{counted(RAMP.length, ['стиль', 'стиля', 'стилей'])}</Count>}
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
                  {responsive && <Count>адаптивный</Count>}
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
  name: 'Моды гарнитур',
  render: (_args, { globals }) => (
    <Page
      title="Моды гарнитур"
      lead="Коллекция «Typography» подменяет семейство за `typography/font-family/*`. Ниже сразу все четыре моды; переключатель на панели меняет ту, которой пользуется остальной Storybook."
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
        title="Запасные шрифты"
        description="Из Figma приходит только имя семейства. Сгенерированный CSS дописывает `var(--box-font-fallback)`, чтобы недоступная гарнитура падала в системный стек, а не в засечный шрифт по умолчанию."
      >
        <Code>--box-type-font-family-heading: "Inter Display", var(--box-font-fallback);</Code>
      </Section>
    </Page>
  ),
};
