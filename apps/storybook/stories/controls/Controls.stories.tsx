import { Fragment, type CSSProperties, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { model } from '@box-ui/tokens';
import { Button, type ButtonSize, type ControlAppearance, type ControlFamily, type ControlState } from '@box-ui/react';
import { Code, Count, Counts, Page, Section, ShareLink, counted, demoSurface } from '../_ui';

// `id` is pinned so translating the title does not change the story URLs.
const meta: Meta = { id: 'controls-controls', title: 'Контролы/Кнопки' };
export default meta;

type Story = StoryObj;

const appearance = model.collections['sys-appearance'];
const state = model.collections['sys-state'];

/** `Controls · Appearance` has one group of tokens per control family. */
const FAMILIES: { id: ControlFamily; label: string; figma: string }[] = [
  { id: 'accent', label: 'Accent', figma: 'Button/Priority' },
  { id: 'status', label: 'Status', figma: 'Button/Status' },
  { id: 'static', label: 'Static', figma: 'Button/Static' },
  { id: 'neutral', label: 'Neutral', figma: 'Button/Neutral' },
  { id: 'ghost', label: 'Ghost', figma: '—' },
];

const APPEARANCES = appearance.modes.map((m) => m.slug as ControlAppearance);
const SIZES: ButtonSize[] = ['xs', 's', 'm', 'l', 'xl'];

/**
 * A Box UI island. Everything inside is coloured by Box UI tokens, including
 * the labels: Storybook's own chrome classes would paint near-white text here,
 * and this surface is white in the Light theme.
 */
function Surface({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ ...demoSurface, padding: 'var(--box-spacing-base-m)', ...style }}>{children}</div>;
}

const labelStyle: CSSProperties = {
  color: 'var(--box-surface-base-content-muted)',
  fontFamily: 'var(--box-typography-font-family-body)',
  fontSize: 'var(--box-typography-caption-l-font-size)',
  lineHeight: 'var(--box-typography-caption-l-line-height)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  whiteSpace: 'nowrap',
};

/** Rows of controls with a label column and one labelled column per mode. */
function ModeGrid({
  columns,
  rows,
  trailing,
}: {
  columns: { key: string; label: string }[];
  rows: { key: string; label: string; cells: ReactNode[]; trailing?: ReactNode }[];
  trailing?: string;
}) {
  const template = `max-content repeat(${columns.length}, max-content)${trailing ? ' max-content' : ''}`;
  return (
    <Surface style={{ overflowX: 'auto' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: template,
          gap: 'var(--box-spacing-base-2xs) var(--box-spacing-base-m)',
          alignItems: 'center',
          width: 'max-content',
        }}
      >
        <span style={labelStyle}>Семейство</span>
        {columns.map((c) => (
          <span key={c.key} style={labelStyle}>
            {c.label}
          </span>
        ))}
        {trailing && <span style={labelStyle}>{trailing}</span>}

        {rows.map((row) => (
          <Fragment key={row.key}>
            <span style={labelStyle}>{row.label}</span>
            {row.cells.map((cell, i) => (
              <div key={columns[i].key}>{cell}</div>
            ))}
            {trailing && <span style={{ ...labelStyle, textTransform: 'none' }}>{row.trailing}</span>}
          </Fragment>
        ))}
      </div>
    </Surface>
  );
}

export const Matrix: Story = {
  name: 'Вид × семейство',
  render: () => (
    <Page
      title="Кнопки"
      lead="Семейство выбирает группу токенов, «Вид контрола» — моду, под которой эта группа разрешается. Ни одна комбинация ниже не описана в CSS отдельно: кнопка читает три переменные, а остальное делают моды Figma."
      toolbar={
        <Counts>
          <Count>{counted(FAMILIES.length, ['семейство', 'семейства', 'семейств'])}</Count>
          <Count>{counted(APPEARANCES.length, ['вид', 'вида', 'видов'])}</Count>
          <ShareLink />
        </Counts>
      }
    >
      <Section
        title="Каждое семейство × каждый вид"
        description="Наведите курсор или нажмите — состояния ведёт `controls.css`, а не React."
      >
        <ModeGrid
          columns={appearance.modes.map((m) => ({ key: m.slug, label: m.name }))}
          trailing="Figma"
          rows={FAMILIES.map((family) => ({
            key: family.id,
            label: family.label,
            trailing: family.figma,
            cells: APPEARANCES.map((mode) => (
              <Button key={mode} family={family.id} appearance={mode}>
                Кнопка
              </Button>
            )),
          }))}
        />
      </Section>

      <Section
        title="Состояния"
        description="Те же кнопки с принудительно выставленным `data-state`. Так видно коллекцию «Controls · State» целиком, не ловя курсором каждое состояние."
      >
        <ModeGrid
          columns={state.modes.map((m) => ({ key: m.slug, label: m.name }))}
          rows={FAMILIES.map((family) => ({
            key: family.id,
            label: family.label,
            cells: state.modes.map((m) => (
              <Button key={m.slug} family={family.id} state={m.slug as ControlState} disabled={m.slug === 'disabled'}>
                Кнопка
              </Button>
            )),
          }))}
        />
      </Section>

      <Section
        title="Размеры"
        description="Пять вариантов из Figma: XS (32), S (36), M (40), L (44), XL (48). Высота приходит из `size/base/*`, поэтому на Mobile шкала пересчитывается."
      >
        <Surface
          style={{
            display: 'flex',
            gap: 'var(--box-spacing-base-xs)',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {SIZES.map((size) => (
            <Button key={size} size={size}>
              {size.toUpperCase()}
            </Button>
          ))}
        </Surface>
      </Section>

      <Section
        title="Как это разрешается"
        description="Один переход `var()` на каждый слой Figma — ровно та же цепочка, что в файле."
      >
        <Code>{`--box-state-accent-fill        ← Controls · State       [data-state]
  --box-control-accent-fill-default  ← Controls · Appearance  [data-appearance]
    --box-interaction-accent-solid-fill-default  ← System · Theme  [data-theme]
      --box-accent-fill-solid
        --box-brand-solid-500        ← Brand · Color          [data-accent]
          --box-palette-indigo-solid-500   ← Primitives · Color`}</Code>
      </Section>
    </Page>
  ),
};

export const Statuses: Story = {
  name: 'Статусные кнопки',
  render: () => (
    <Page
      title="Статусные кнопки"
      lead="Семейство `status` читает те же три переменные, но под модой коллекции «System · Status». Статус живёт на самой кнопке: `controls.css` переобъявляет на контроле те переменные темы, что ведут в «System · Status», поэтому четыре тональности уживаются на одной странице."
    >
      {APPEARANCES.map((mode) => (
        <Section key={mode} title={mode}>
          <Surface
            style={{
              display: 'flex',
              gap: 'var(--box-spacing-base-xs)',
              flexWrap: 'wrap',
            }}
          >
            {(['positive', 'warning', 'negative', 'information'] as const).map((status) => (
              <Button key={status} family="status" appearance={mode} status={status}>
                {status}
              </Button>
            ))}
          </Surface>
        </Section>
      ))}
    </Page>
  ),
};
