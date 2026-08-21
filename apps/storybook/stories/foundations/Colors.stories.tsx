import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { model } from '@box-ui/tokens';
import { Code, Count, Counts, Empty, Grid, JumpNav, Page, Search, Section, Swatch, useCopy } from '../_ui';

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: { docs: { description: { component: 'Colour variables from `Box UI | Primitives` and `Box UI | Tokens`.' } } },
};
export default meta;

type Story = StoryObj;

const palette = model.collections.palette;
const accent = model.collections.accent;
const mode = model.collections.mode;

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
  name: 'Primitives — palette',
  render: () => {
    const [query, setQuery] = useState('');

    const groups = useMemo(() => {
      const q = query.trim().toLowerCase();
      const matched = q ? palette.variables.filter((v) => v.path.toLowerCase().includes(q)) : palette.variables;
      return groupBy(matched, 1);
    }, [query]);

    const total = groups.reduce((sum, [, list]) => sum + list.length, 0);

    return (
      <Page
        title="Colour palette"
        lead={`${palette.variables.length} raw colour variables from the “Color Palette” collection. These never change with a mode — every semantic token points at one of them. Click a swatch to copy its CSS variable.`}
        toolbar={
          <>
            <Search value={query} onChange={setQuery} placeholder="blue, alpha, 500…" />
            <Counts>
              <Count>{total} swatches</Count>
              <Count>{groups.length} families</Count>
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
                    meta={String(v.values.value?.value ?? '')}
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

/** A single mode cell. Lives below `<Page>`, so it can reach the copy context. */
function AccentCell({ mode: m, value }: { mode: { slug: string; name: string }; value?: { cssVar?: string; alias?: string } }) {
  const copy = useCopy();
  return (
    <button
      type="button"
      title={`${m.name} → ${value?.alias ?? ''} · click to copy`}
      onClick={() => value?.alias && copy(value.alias, value.alias)}
      style={{
        display: 'block',
        width: 44,
        height: 26,
        padding: 0,
        cursor: 'pointer',
        borderRadius: 3,
        border: '1px solid var(--sb-border)',
        background: `var(${value?.cssVar})`,
      }}
    />
  );
}

export const Accents: Story = {
  name: 'Accent modes — Color',
  render: () => {
    const [query, setQuery] = useState('');
    const rows = useMemo(() => {
      const q = query.trim().toLowerCase();
      return q ? accent.variables.filter((v) => v.path.toLowerCase().includes(q)) : accent.variables;
    }, [query]);

    return (
      <Page
        title="Accent colour modes"
        lead="The “Color” collection has ten modes. Switch “Accent” in the toolbar and every brand token below re-points at a different primitive ramp — the semantic names never change."
        toolbar={
          <>
            <Search value={query} onChange={setQuery} placeholder="brand, neutral, positive…" />
            <Counts>
              <Count>
                {rows.length} tokens × {accent.modes.length} modes
              </Count>
            </Counts>
          </>
        }
      >
        {rows.length === 0 ? (
          <Empty query={query} onClear={() => setQuery('')} />
        ) : (
          <Section
            title="Every token × every mode"
            description="Rows are tokens, columns are the ten Figma modes. Each cell renders what that mode resolves to — hover for the primitive it aliases, click to copy it."
          >
            <div className="sb-scroller">
              <table className="sb-table">
                <thead>
                  <tr>
                    <th className="sb-table__lead">
                      <span className="sb-label">Token</span>
                    </th>
                    {accent.modes.map((m) => (
                      <th key={m.slug}>
                        <span className="sb-label">{m.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((v) => (
                    <tr key={v.cssVar}>
                      <td className="sb-table__lead">
                        <Code copyable={`var(${v.cssVar})`}>{v.path}</Code>
                      </td>
                      {accent.modes.map((m) => (
                        <td key={m.slug}>
                          <AccentCell mode={m} value={v.values[m.slug]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}
      </Page>
    );
  },
};

export const Semantic: Story = {
  name: 'Semantic — Light / Dark',
  render: () => {
    const [query, setQuery] = useState('');

    const groups = useMemo(() => {
      const q = query.trim().toLowerCase();
      const matched = q ? mode.variables.filter((v) => v.path.toLowerCase().includes(q)) : mode.variables;
      return groupBy(matched, 2);
    }, [query]);

    const total = groups.reduce((sum, [, list]) => sum + list.length, 0);

    return (
      <Page
        title="Semantic colours"
        lead={`${mode.variables.length} tokens in the “Mode” collection. Every one of them resolves through the “Color” collection, so they follow both the Theme and the Accent toolbar controls.`}
        toolbar={
          <>
            <Search value={query} onChange={setQuery} placeholder="background, border, control…" />
            <Counts>
              <Count>{total} tokens</Count>
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
                {variables.map((v) => (
                  <Swatch
                    key={v.cssVar}
                    cssVar={v.cssVar}
                    name={v.path.split('/').slice(2).join('/')}
                    meta={v.cssVar.replace('--box-', '')}
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
