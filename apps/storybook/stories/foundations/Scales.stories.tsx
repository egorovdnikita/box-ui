import type { Meta, StoryObj } from '@storybook/react-vite';
import { model } from '@box-ui/tokens';
import { Count, Grid, ModeGlobals, Page, Row, Scope, Section, counted, demoSurface } from '../_ui';

// `id` is pinned so translating the title does not change the story URLs.
const meta: Meta = { id: 'foundations-scales', title: 'Основы/Шкалы' };
export default meta;

type Story = StoryObj;

const responsive = model.collections['sys-responsive'];
const radius = model.collections['brand-rounding'];

const semantic = (prefix: string) => responsive.variables.filter((v) => v.path.startsWith(`${prefix}/`));

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
      lead="`spacing/base/*` живёт в коллекции «◑ System · Responsive»: тринадцать ступеней, у каждой значение для Desktop и для Mobile. Начиная с `s` мобильная версия спускается на одну ступень примитивной шкалы."
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
                background: 'var(--accent-fill-solid)',
                borderRadius: 'var(--rounding-min)',
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
      lead="Здесь складываются две коллекции. «☯︎ Brand · Rounding» сопоставляет каждой ступени примитивный радиус для своей плотности (Low / Medium / High), а «◑ System · Responsive» переназначает ступени ещё раз для Mobile — `xl` на Desktop разрешается в значение `l` на Mobile."
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
              style={{ ...demoSurface, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3xs)' }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 'var(--type-caption-l-font-size)' }}>{m.name}</span>
                <code
                  className="sb-code"
                  style={{ color: 'var(--surface-base-content-muted)' }}
                >{`[data-radius="${m.slug}"]`}</code>
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-4xs)', flexWrap: 'wrap' }}>
                {['xs', 's', 'm', 'l', 'xl', '2xl'].map((step) => (
                  <div
                    key={step}
                    title={`rounding/base/${step}`}
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      width: 46,
                      height: 46,
                      background: 'var(--accent-fill-soft)',
                      border: '1px solid var(--accent-content-on-soft-default)',
                      borderRadius: `var(--rounding-${step})`,
                      color: 'var(--accent-content-on-soft-default)',
                      fontSize: 'var(--type-caption-m-font-size)',
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
                background: 'var(--accent-fill-soft)',
                border: '1px solid var(--accent-content-on-soft-default)',
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
    <Page
      title="Размеры"
      lead="`size/base/*` из коллекции «◑ System · Responsive» — высоты контролов, боксы иконок, аватары."
    >
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
                background: 'var(--interaction-neutral-grayscale-solid-fill-default)',
                borderRadius: 'var(--rounding-2xs)',
                color: 'var(--surface-base-content-muted)',
                fontSize: 'var(--type-caption-m-font-size)',
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
