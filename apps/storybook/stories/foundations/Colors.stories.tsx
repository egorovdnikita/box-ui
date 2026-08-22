import { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { model } from '@box-ui/tokens';
import {
  Callout,
  Code,
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
  matches,
  useCopy,
  useResolved,
} from '../_ui';

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
        title="Colour palette"
        lead={`${palette.variables.length} raw colour variables from the “Color Palette” collection. These never change with a mode — every semantic token points at one of them. Click a swatch to copy its CSS variable.`}
        toolbar={
          <>
            <Search value={query} onChange={setQuery} placeholder="blue, alpha, 500…" />
            <Counts>
              <Count>{total} swatches</Count>
              <Count>{groups.length} families</Count>
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

/**
 * A mode is "off" when its `brand/primary` does not point at the ramp the mode
 * is named after. Computed rather than hard-coded, so the callout disappears by
 * itself once the Figma file is corrected.
 */
const mismatchedModes = accent.modes
  .map((m) => {
    const brand = accent.variables.find((v) => v.path === 'colors/brand/primary');
    const family = brand?.values[m.slug]?.alias?.split('/')[0];
    return family && family !== m.slug ? { mode: m.name, family } : null;
  })
  .filter((entry): entry is { mode: string; family: string } => entry !== null);

export const Accents: Story = {
  name: 'Accent modes — Color',
  args: { query: '' },
  render: (args) => {
    const [, updateArgs] = useArgs();
    const query = (args as { query: string }).query;
    const setQuery = (value: string) => updateArgs({ query: value });
    const rows = useMemo(() => {
      const q = query.trim().toLowerCase();
      return q ? accent.variables.filter((v) => matches(query, v.path)) : accent.variables;
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
              {query && <ResetFilters onReset={() => setQuery('')} />}
              <ShareLink />
            </Counts>
          </>
        }
      >
        {mismatchedModes.length > 0 && (
          <Callout title="Some modes point at another ramp">
            {mismatchedModes.map((entry, index) => (
              <span key={entry.mode}>
                {index > 0 && ', '}
                <strong>{entry.mode}</strong> resolves to the <strong>{entry.family}</strong> ramp
              </span>
            ))}
            . That is how the Figma file is wired today, and it is reproduced here verbatim rather than quietly
            corrected — fix it in <Code>Box UI | Tokens</Code> and rebuild.
          </Callout>
        )}

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
                background: 'var(--box-background-base-primary)',
                color: 'var(--box-content-base-tertiary)',
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
  name: 'Semantic — Light / Dark',
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
        title="Semantic colours"
        lead={`${mode.variables.length} tokens in the “Mode” collection. Every one of them resolves through the “Color” collection, so they follow both the Theme and the Accent toolbar controls.`}
        toolbar={
          <>
            <Search value={query} onChange={setQuery} placeholder="background, border, control…" />
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, height: 28, cursor: 'pointer' }}>
              <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} />
              <span className="sb-caption">Compare Light / Dark</span>
            </label>
            <Counts>
              <Count>{total} tokens</Count>
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
