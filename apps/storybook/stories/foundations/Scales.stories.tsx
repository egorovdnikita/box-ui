import type { Meta, StoryObj } from '@storybook/react-vite';
import { model } from '@box-ui/tokens';
import { Code, Count, Grid, ModeGlobals, Page, Row, Scope, Section, counted, demoSurface } from '../_ui';

// `id` is pinned so translating the title does not change the story URLs.
const meta: Meta = { id: 'foundations-scales', title: 'Основы/Шкалы' };
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

const RESPONSIVE_HINT =
  'Строки, где значения расходятся, на Mobile сжимаются — переключите «Device» на панели и посмотрите, как они меняются.';

export const Spacing: Story = {
  name: 'Отступы',
  render: () => (
    <Page
      title="Отступы"
      lead="`spacing/base/*` живёт в коллекции «Grid»: тринадцать ступеней, у каждой значение для Desktop и для Mobile. Начиная с `s` мобильная версия спускается на одну ступень примитивной шкалы."
    >
      <Section
        title="Ступени"
        description={RESPONSIVE_HINT}
        aside={<Count>{counted(semantic('spacing').length, ['ступень', 'ступени', 'ступеней'])}</Count>}
      >
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
  name: 'Скругления',
  render: (_args, { globals }) => (
    <Page
      title="Скругления"
      lead="Здесь складываются две коллекции. «Rounding» сопоставляет каждой ступени примитивный радиус для своей плотности (Low / Medium / High), а «Grid» переназначает ступени ещё раз для Mobile — `xl` на Desktop разрешается в значение `l` на Mobile."
    >
      <Section
        title="Моды плотности"
        description="Все три плотности рядом; переключатель «Radius» на панели управляет остальным Storybook."
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

      <Section
        title="Ступени"
        description={RESPONSIVE_HINT}
        aside={<Count>{counted(semantic('rounding').length, ['ступень', 'ступени', 'ступеней'])}</Count>}
      >
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
  name: 'Размеры',
  render: () => (
    <Page title="Размеры" lead="`size/base/*` из коллекции «Grid» — высоты контролов, боксы иконок, аватары.">
      <Section
        title="Ступени"
        aside={<Count>{counted(semantic('size').length, ['ступень', 'ступени', 'ступеней'])}</Count>}
      >
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
  name: 'Прозрачность',
  render: () => (
    <Page
      title="Прозрачность"
      lead="Примитивная коллекция «Opacity», выводится безразмерными долями (`opacity/40` → `0.4`)."
    >
      <Section
        title="Ступени"
        aside={<Count>{counted(model.collections.opacity.variables.length, ['ступень', 'ступени', 'ступеней'])}</Count>}
      >
        <Grid min={112}>
          {model.collections.opacity.variables.map((v) => (
            <div
              key={v.cssVar}
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--box-spacing-base-min)' }}
            >
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
