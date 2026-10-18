import { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { model } from '@box-ui/tokens';
import {
  Count,
  Counts,
  Empty,
  Grid,
  JumpNav,
  ModeGlobals,
  Page,
  Scope,
  ResetFilters,
  Search,
  Section,
  ShareLink,
  Swatch,
  counted,
  matches,
  useCopy,
  useResolved,
} from '../_ui';

const meta: Meta = {
  // `id` is pinned so translating the title does not change the story URLs.
  id: 'foundations-colors',
  title: 'Основы/Цвета',
  parameters: {
    docs: {
      description: {
        component:
          'Цветовые переменные из `Foundation – Core` наглядно: палитра и семантика в обеих темах. Полные таблицы — в разделе «Токены».',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

/**
 * Every path in `Primitives · Color` starts with `color/`. Dropping that prefix
 * makes the first segment the ramp family, which is what the grouping below
 * and the swatch labels are built on.
 */
const palette = {
  ...model.collections['prim-color'],
  variables: model.collections['prim-color'].variables.map((v) => ({ ...v, path: v.path.replace(/^color\//, '') })),
};
const mode = model.collections['sys-theme'];

/** Palette entries are either a literal hex or "<pct>% of another ramp step". */
function paletteMeta(value?: { value?: string | number; alias?: string; opacity?: number }) {
  if (value?.value !== undefined) return String(value.value);
  if (value?.opacity === undefined) return '';
  const base = value.alias?.split(':')[1]?.replace(/^color\//, '') ?? '';
  return `${value.opacity}% · ${base}`;
}

const anchor = (name: string) => `group-${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;

/** Groups variables by the leading segments of their Figma path. */
function groupBy<T extends { path: string }>(variables: T[], depth: number) {
  const groups = new Map<string, T[]>();
  for (const variable of variables) {
    const key = variable.path.split('/').slice(0, depth).join(' / ');
    const list = groups.get(key) ?? [];
    list.push(variable);
    groups.set(key, list);
  }
  return [...groups];
}

export const Palette: Story = {
  name: 'Примитивы — палитра',
  args: { query: '' },
  render: (args) => {
    const [, updateArgs] = useArgs();
    const query = (args as { query: string }).query;
    const setQuery = (value: string) => updateArgs({ query: value });

    const groups = useMemo(() => {
      const q = query.trim().toLowerCase();
      const matched = q ? palette.variables.filter((v) => matches(query, v.path)) : palette.variables;
      return groupBy(matched, 1);
    }, [query]);

    const total = groups.reduce((sum, [, list]) => sum + list.length, 0);

    return (
      <Page
        title="Цветовая палитра"
        lead={`${palette.variables.length} сырых цветовых переменных из коллекции «◉ Primitives · Color». Они не меняются ни в одной моде — всё остальное указывает на них. Прозрачные ступени Figma хранит как «эта шкала на N%», и в CSS они становятся \u0060color-mix()\u0060. Клик по образцу копирует CSS-переменную.`}
        toolbar={
          <>
            <Search value={query} onChange={setQuery} placeholder="blue, alpha, 500…" />
            <Counts>
              <Count>{counted(total, ['образец', 'образца', 'образцов'])}</Count>
              <Count>{counted(groups.length, ['семейство', 'семейства', 'семейств'])}</Count>
              {query && <ResetFilters onReset={() => setQuery('')} />}
              <ShareLink />
            </Counts>
            {!query && (
              <div style={{ flexBasis: '100%' }}>
                <JumpNav items={groups.map(([family]) => ({ id: anchor(family), label: family }))} />
              </div>
            )}
          </>
        }
      >
        {total === 0 ? (
          <Empty query={query} onClear={() => setQuery('')} />
        ) : (
          groups.map(([family, variables]) => (
            <Section key={family} id={anchor(family)} title={family} aside={<Count>{variables.length}</Count>}>
              <Grid min={124}>
                {variables.map((v) => (
                  <Swatch
                    key={v.cssVar}
                    cssVar={v.cssVar}
                    name={v.path.split('/').slice(1).join(' / ')}
                    meta={paletteMeta(v.values.value)}
                  />
                ))}
              </Grid>
            </Section>
          ))
        )}
      </Page>
    );
  },
};

/**
 * The same token under both Mode values at once. Each half re-declares all five
 * mode attributes, which is what lets two themes resolve side by side on one
 * page — see the note in `Scope`.
 */
function SplitSwatch({ cssVar, name, globals }: { cssVar: string; name: string; globals: ModeGlobals }) {
  const copy = useCopy();
  const resolved = useResolved(cssVar, 'color');

  return (
    <button
      type="button"
      className="sb-tile"
      onClick={() => copy(`var(${cssVar})`, cssVar)}
      title={`Copy var(${cssVar})`}
      style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
    >
      <span
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          height: 52,
          overflow: 'hidden',
          borderRadius: 'var(--sb-radius)',
          border: '1px solid var(--sb-border)',
        }}
      >
        {(['light', 'dark'] as const).map((theme) => (
          <Scope key={theme} globals={globals} theme={theme} style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', inset: 0, background: `var(${cssVar})` }} />
            <span
              style={{
                position: 'absolute',
                insetInline: 0,
                bottom: 0,
                padding: '1px 4px',
                background: 'var(--surface-base-fill-page)',
                color: 'var(--surface-base-content-subtle)',
                fontSize: 9,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                textAlign: 'center',
                opacity: 0.9,
              }}
            >
              {theme}
            </span>
          </Scope>
        ))}
        <span className="sb-tile__hint" style={{ gridColumn: '1 / -1' }} />
      </span>
      <span style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
      <span className="sb-code" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {resolved} · {globals.theme}
      </span>
    </button>
  );
}

export const Semantic: Story = {
  name: 'Семантика — светлая и тёмная',
  args: { query: '', compare: true },
  render: (args, { globals }) => {
    const [, updateArgs] = useArgs();
    const { query, compare } = args as unknown as { query: string; compare: boolean };
    const setQuery = (value: string) => updateArgs({ query: value });
    const setCompare = (value: boolean) => updateArgs({ compare: value });

    const groups = useMemo(() => {
      const q = query.trim().toLowerCase();
      const matched = q ? mode.variables.filter((v) => matches(query, v.path)) : mode.variables;
      return groupBy(matched, 2);
    }, [query]);

    const total = groups.reduce((sum, [, list]) => sum + list.length, 0);

    return (
      <Page
        title="Семантические цвета"
        lead={`${mode.variables.length} токенов в коллекции «◑ System · Theme». Каждый разрешается через «Brand · Color», «System · Color» или «System · Status», поэтому они слушаются сразу нескольких переключателей на панели.`}
        toolbar={
          <>
            <Search value={query} onChange={setQuery} placeholder="background, border, control…" />
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, height: 28, cursor: 'pointer' }}>
              <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} />
              <span className="sb-caption">Светлая и тёмная рядом</span>
            </label>
            <Counts>
              <Count>{counted(total, ['токен', 'токена', 'токенов'])}</Count>
              {query && <ResetFilters onReset={() => setQuery('')} />}
              <ShareLink />
            </Counts>
            {!query && (
              <div style={{ flexBasis: '100%' }}>
                <JumpNav items={groups.map(([group]) => ({ id: anchor(group), label: group }))} />
              </div>
            )}
          </>
        }
      >
        {total === 0 ? (
          <Empty query={query} onClear={() => setQuery('')} />
        ) : (
          groups.map(([group, variables]) => (
            <Section key={group} id={anchor(group)} title={group} aside={<Count>{variables.length}</Count>}>
              <Grid min={190}>
                {variables.map((v) =>
                  compare ? (
                    <SplitSwatch
                      key={v.cssVar}
                      cssVar={v.cssVar}
                      name={v.path.split('/').slice(2).join('/')}
                      globals={globals as unknown as ModeGlobals}
                    />
                  ) : (
                    <Swatch key={v.cssVar} cssVar={v.cssVar} name={v.path.split('/').slice(2).join('/')} live />
                  ),
                )}
              </Grid>
            </Section>
          ))
        )}
      </Page>
    );
  },
};
