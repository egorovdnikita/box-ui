import { Fragment, useMemo, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '@box-ui/icons';
import { model, type TokenCollection, type TokenVariable } from '@box-ui/tokens';
import {
  Count,
  Counts,
  Empty,
  JumpNav,
  Page,
  ResetFilters,
  Scope,
  Search,
  ShareLink,
  counted,
  matches,
  useCopy,
} from './_ui';
import type { ModeGlobals } from './_ui';

/*
 * A token table in the spirit of the documentation pages in Figma: a heading
 * per variable group with the path dimmed and its last segment bright, a name
 * column with the variable's type, one value column per mode, the Web code
 * syntax, and one description for the whole group. It is drawn in Storybook's
 * own chrome; only the swatches are Box UI.
 */

type Value = TokenVariable['values'][string];
type Kind = 'color' | 'number' | 'string';

const collections = model.collections as Record<string, TokenCollection>;

/** Which `Scope` prop pins a collection's mode on a single swatch. */
const SCOPE_PROP: Record<string, keyof ModeGlobals> = {
  'brand-color': 'accent',
  'brand-rounding': 'radius',
  'brand-type': 'font',
  'sys-theme': 'theme',
  'sys-status': 'status',
  'sys-appearance': 'appearance',
  'sys-state': 'state',
  'sys-responsive': 'device',
};

function find(alias: string): { collection: string; variable: TokenVariable } | null {
  const [collection, path] = [alias.slice(0, alias.indexOf(':')), alias.slice(alias.indexOf(':') + 1)];
  const variable = collections[collection]?.variables.find((v) => v.path === path);
  return variable ? { collection, variable } : null;
}

/** Follows aliases down to a literal to learn what kind of value a variable holds. */
function kindOf(variable: TokenVariable, depth = 0): Kind {
  const first = Object.values(variable.values)[0];
  if (!first) return 'string';
  if (first.alias && depth < 12) {
    const target = find(first.alias);
    return target ? kindOf(target.variable, depth + 1) : 'string';
  }
  if (first.opacity !== undefined) return 'color';
  if (typeof first.value === 'number') return 'number';
  return typeof first.value === 'string' && first.value.startsWith('#') ? 'color' : 'string';
}

const KIND_ICON: Record<Kind, string> = { color: 'palette-round', number: 'ruler', string: 'text-square' };
const KIND_LABEL: Record<Kind, string> = { color: 'цвет', number: 'число', string: 'строка' };

const anchor = (path: string[]) =>
  `group-${path
    .join('-')
    .replace(/[^a-z0-9-]+/gi, '-')
    .toLowerCase()}`;

const aliasPath = (alias?: string) => (alias ? alias.slice(alias.indexOf(':') + 1) : '');

/** `#00000014` -> `{ hex: '000000', opacity: 8 }` */
function splitHex(value: string) {
  const hex = value.replace('#', '').toUpperCase();
  const alpha = hex.length === 8 ? Math.round((parseInt(hex.slice(6), 16) / 255) * 100) : null;
  return { hex: hex.slice(0, 6), opacity: alpha };
}

function literal(value: string | number | undefined, path: string) {
  if (typeof value === 'number') return /font-weight\//.test(path) ? String(value) : `${value}px`;
  return String(value ?? '—');
}

// --- cells -------------------------------------------------------------------

/** One mode of one variable, the way Figma's value column reads. */
function ValueCell({
  variable,
  value,
  kind,
  scoped,
}: {
  variable: TokenVariable;
  value?: Value;
  kind: Kind;
  /** Wraps a swatch so it resolves in this column's mode, not the page's. */
  scoped: (node: ReactNode) => ReactNode;
}) {
  const copy = useCopy();
  if (!value) return <span className="sb-doc__muted">—</span>;

  const swatch =
    kind === 'color'
      ? scoped(<span className="sb-doc__swatch" style={{ '--swatch': `var(${variable.cssVar})` } as CSSProperties} />)
      : null;

  // Literal colour: swatch, hex, and the opacity when there is one.
  if (kind === 'color' && typeof value.value === 'string' && value.opacity === undefined) {
    const { hex, opacity } = splitHex(value.value);
    return (
      <span className="sb-doc__literal">
        {swatch}
        <span className="sb-doc__mono">{hex}</span>
        {opacity !== null && <span className="sb-doc__opacity">{opacity} %</span>}
      </span>
    );
  }

  // Alias (optionally at an opacity): a chip naming the variable it points at.
  if (value.alias) {
    const target = aliasPath(value.alias);
    return (
      <button
        type="button"
        className="sb-doc__chip"
        title={`${value.alias} — клик копирует имя`}
        onClick={() => copy(target)}
      >
        {swatch ?? <Icon name={KIND_ICON[kind]} size={14} iconStyle="linear" />}
        <span>{target}</span>
        {value.opacity !== undefined && <span className="sb-doc__opacity">{value.opacity} %</span>}
      </button>
    );
  }

  // Literal tint of a literal colour, e.g. `alpha(16, #000000)`.
  if (value.opacity !== undefined) {
    return (
      <span className="sb-doc__literal">
        {swatch}
        <span className="sb-doc__mono">{splitHex(String(value.value)).hex}</span>
        <span className="sb-doc__opacity">{value.opacity} %</span>
      </span>
    );
  }

  return <span className="sb-doc__mono">{literal(value.value, variable.path)}</span>;
}

function CodeCell({ variable }: { variable: TokenVariable }) {
  const copy = useCopy();
  const actual = `var(${variable.cssVar})`;
  const differs = actual !== variable.codeSyntax;
  return (
    <button
      type="button"
      className="sb-doc__code"
      onClick={() => copy(actual)}
      title={
        differs
          ? `В Figma указано ${variable.codeSyntax}, но это имя уже занято другой переменной — в CSS она называется ${actual}.`
          : `Скопировать ${actual}`
      }
    >
      {actual}
      {differs && <span className="sb-doc__flag">≠ Figma</span>}
    </button>
  );
}

/** Path segments: every part dimmed, the last one bright — as in the Figma headings. */
function GroupHeading({ path }: { path: string[] }) {
  return (
    <div className="sb-doc__heading" id={anchor(path)}>
      {path.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="sb-doc__sep">/</span>}
          <span className={i === path.length - 1 ? 'sb-doc__strong' : undefined}>{part}</span>
        </Fragment>
      ))}
    </div>
  );
}

// --- table -------------------------------------------------------------------

export interface DocGroup {
  path: string[];
  variables: TokenVariable[];
}

/** Groups variables by every path segment but the last, keeping Figma's order. */
export function groupVariables(variables: TokenVariable[]): DocGroup[] {
  const groups = new Map<string, DocGroup>();
  for (const v of variables) {
    const parts = v.path.split('/');
    const path = parts.length > 1 ? parts.slice(0, -1) : parts;
    const key = path.join('/');
    if (!groups.has(key)) groups.set(key, { path, variables: [] });
    groups.get(key)!.variables.push(v);
  }
  return [...groups.values()];
}

export function DocTable({
  collectionId,
  groups,
  globals,
}: {
  collectionId: string;
  groups: DocGroup[];
  globals: ModeGlobals;
}) {
  const collection = collections[collectionId];
  const modes = collection.modes;
  const multi = modes.length > 1;
  const scopeProp = SCOPE_PROP[collectionId];

  const columns = `minmax(150px, 0.8fr) repeat(${modes.length}, minmax(${multi ? 170 : 200}px, 1fr)) minmax(220px, 1fr) minmax(220px, 1.1fr)`;

  return (
    <div className="sb-doc__scroller">
      <div className="sb-doc" style={{ gridTemplateColumns: columns }}>
        <div className="sb-doc__head">Name</div>
        {modes.map((m) => (
          <div key={m.slug} className="sb-doc__head">
            {multi ? m.name : 'Value'}
          </div>
        ))}
        <div className="sb-doc__head">Code syntax</div>
        <div className="sb-doc__head">Description</div>

        {groups.map((group) => {
          const descriptions = [...new Set(group.variables.map((v) => v.description))];
          const shared = descriptions.length === 1;
          const leafOf = (v: TokenVariable) => (v.path.split('/').length > 1 ? v.path.split('/').pop()! : v.path);

          return (
            <Fragment key={group.path.join('/')}>
              <GroupHeading path={group.path} />
              {group.variables.map((v, row) => {
                const kind = kindOf(v);
                return (
                  <Fragment key={v.cssVar}>
                    <div className="sb-doc__cell sb-doc__name" title={`${v.path} · ${KIND_LABEL[kind]}`}>
                      <Icon name={KIND_ICON[kind]} size={16} iconStyle="linear" />
                      <span>{leafOf(v)}</span>
                    </div>
                    {modes.map((m) => (
                      <div key={m.slug} className="sb-doc__cell">
                        <ValueCell
                          variable={v}
                          value={v.values[m.slug]}
                          kind={kind}
                          scoped={(node) =>
                            multi && scopeProp ? (
                              <Scope globals={globals} {...{ [scopeProp]: m.slug }} style={{ display: 'contents' }}>
                                {node}
                              </Scope>
                            ) : (
                              node
                            )
                          }
                        />
                      </div>
                    ))}
                    <div className="sb-doc__cell">
                      <CodeCell variable={v} />
                    </div>
                    {shared ? (
                      row === 0 && (
                        <div
                          className="sb-doc__cell sb-doc__description"
                          style={{ gridRow: `span ${group.variables.length}` }}
                        >
                          {descriptions[0]}
                        </div>
                      )
                    ) : (
                      <div className="sb-doc__cell sb-doc__description">{v.description}</div>
                    )}
                  </Fragment>
                );
              })}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

// --- page --------------------------------------------------------------------

/**
 * A whole collection as one page: what the Figma page says about it, a search,
 * jump links to its groups, and the table.
 */
export function TokenPage({
  collectionId,
  title,
  lead,
  globals,
  query,
  onQuery,
  children,
}: {
  collectionId: string;
  title: string;
  lead: ReactNode;
  globals: ModeGlobals;
  query: string;
  onQuery: (value: string) => void;
  /** Anything worth saying above the table. */
  children?: ReactNode;
}) {
  const collection = collections[collectionId];
  const groups = useMemo(() => {
    const q = query.trim();
    const variables = q
      ? collection.variables.filter((v) => matches(q, `${v.path} ${v.cssVar} ${v.description}`))
      : collection.variables;
    return groupVariables(variables);
  }, [collection, query]);
  const total = groups.reduce((n, g) => n + g.variables.length, 0);

  return (
    <Page
      title={title}
      lead={lead}
      toolbar={
        <>
          <Search value={query} onChange={onQuery} placeholder="имя, var(--…), описание" />
          <Counts>
            <Count>{counted(total, ['переменная', 'переменные', 'переменных'])}</Count>
            <Count>{counted(collection.modes.length, ['мода', 'моды', 'мод'])}</Count>
            {collection.attribute && <Count>{`[${collection.attribute}]`}</Count>}
            {query && <ResetFilters onReset={() => onQuery('')} />}
            <ShareLink />
          </Counts>
          {!query && groups.length > 4 && (
            <div style={{ flexBasis: '100%' }}>
              <JumpNav items={groups.map((g) => ({ id: anchor(g.path), label: g.path.join(' / ') }))} />
            </div>
          )}
        </>
      }
    >
      {children}
      {total === 0 ? (
        <Empty query={query} onClear={() => onQuery('')} />
      ) : (
        <DocTable collectionId={collectionId} groups={groups} globals={globals} />
      )}
    </Page>
  );
}
