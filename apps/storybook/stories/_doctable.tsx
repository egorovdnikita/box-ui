import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { addons } from 'storybook/preview-api';
import { SELECT_STORY } from 'storybook/internal/core-events';
import { Icon, ICON_STYLES, type IconStyle } from '@box-ui/icons';
import { Text, type TextVariant } from '@box-ui/react';
import { model, type TokenCollection, type TokenVariable } from '@box-ui/tokens';
import figmaGroups from '../../../tokens/figma/docs.json';
import {
  Counts,
  Empty,
  MultiSelect,
  Page,
  ResetFilters,
  Scope,
  Search,
  Segmented,
  Select,
  ShareLink,
  ToolbarButton,
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
 * own chrome; only the swatches and previews are Box UI.
 */

type Value = TokenVariable['values'][string];
export type Kind = 'color' | 'number' | 'string';

export const collections = model.collections as Record<string, TokenCollection>;

/** Which `Scope` prop pins a collection's mode on a single cell. */
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

/** The story that documents each collection, for links between pages. */
export const STORY_OF: Record<string, string> = {
  'prim-color': 'tokens-primitives--color',
  'prim-type': 'tokens-primitives--typography',
  'prim-rounding': 'tokens-primitives--rounding',
  'prim-spacing': 'tokens-primitives--spacing',
  'prim-size': 'tokens-primitives--size',
  'brand-type': 'tokens-brand--typography',
  'brand-rounding': 'tokens-brand--rounding',
  'brand-color': 'tokens-brand--color',
  'brand-icon': 'tokens-brand--icon',
  'sys-color': 'tokens-system--color',
  'sys-status': 'tokens-system--status',
  'sys-theme': 'tokens-system--themes',
  'sys-appearance': 'tokens-system--appearance',
  'sys-state': 'tokens-system--state',
  'sys-responsive': 'tokens-system--responsive',
};

/** Collections in the order of the sidebar: Primitives, Brand, System. */
export const COLLECTION_ORDER = Object.keys(STORY_OF);

function find(alias: string): { collection: string; variable: TokenVariable } | null {
  const [collection, path] = [alias.slice(0, alias.indexOf(':')), alias.slice(alias.indexOf(':') + 1)];
  const variable = collections[collection]?.variables.find((v) => v.path === path);
  return variable ? { collection, variable } : null;
}

/** Follows aliases down to a literal to learn what kind of value a variable holds. */
export function kindOf(variable: TokenVariable, depth = 0): Kind {
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

/** The literal a variable lands on in `mode`, following aliases across collections. */
function resolveLiteral(variable: TokenVariable, mode: string): string | number | undefined {
  let value: Value | undefined = variable.values[mode] ?? Object.values(variable.values)[0];
  for (let depth = 0; value?.alias && depth < 12; depth++) {
    const target: TokenVariable | undefined = find(value.alias)?.variable;
    value = target && (target.values[mode] ?? Object.values(target.values)[0]);
  }
  return value?.value;
}

export const KIND_ICON: Record<Kind, string> = { color: 'palette-round', number: 'ruler', string: 'text-square' };
const KIND_LABEL: Record<Kind, string> = { color: 'цвет', number: 'число', string: 'строка' };

const slug = (parts: string[]) =>
  parts
    .join('-')
    .replace(/[^a-z0-9-]+/gi, '-')
    .toLowerCase();
const groupId = (path: string[]) => `group-${slug(path)}`;
const rowId = (cssVar: string) => `row-${cssVar.replace(/^--/, '')}`;

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

// --- moving between tokens ---------------------------------------------------

/**
 * Switching stories keeps the preview iframe, so the token to land on can wait
 * here while the manager loads the page that documents it.
 */
let pending: string | null = null;
const openPages = new Map<string, (path: string) => void>();

/** Opens the page of `collection:path` and scrolls to that variable. */
export function goToToken(alias: string) {
  const collection = alias.slice(0, alias.indexOf(':'));
  const path = aliasPath(alias);
  const here = openPages.get(collection);
  if (here) return here(path);
  pending = alias;
  addons.getChannel().emit(SELECT_STORY, { storyId: STORY_OF[collection] });
}

/** Opens a collection's page at the top. */
export function goToCollection(collection: string) {
  pending = null;
  addons.getChannel().emit(SELECT_STORY, { storyId: STORY_OF[collection] });
}

// --- previews ----------------------------------------------------------------

/** `typography/heading/h1` -> `h1`, `typography/body/l` -> `body-l`. */
function textVariant(group: string[]): TextVariant | null {
  const [root, kind, step] = group;
  if (root !== 'typography' || !step) return null;
  const variant = kind === 'heading' ? step.toLowerCase() : `${kind}-${step}`;
  return /^(display-[lms]|h[1-5]|body-[lm]|caption-[lm])$/.test(variant) ? (variant as TextVariant) : null;
}

/**
 * What a value looks like, drawn from the variable itself so it resolves in the
 * cell's own mode. Kept to the height of a row: bars for lengths, a corner for
 * radii, "Aa" for weights and families, the glyph for the icon style.
 */
function Preview({ variable, kind, mode }: { variable: TokenVariable; kind: Kind; mode: string }) {
  const path = variable.path;
  const v = `var(${variable.cssVar})`;
  if (kind === 'string' && path === 'icon-style') {
    const style = (ICON_STYLES as string[]).includes(mode) ? (mode as IconStyle) : 'linear';
    return (
      <span className="sb-doc__preview">
        <Icon name="star" size={16} iconStyle={style} />
      </span>
    );
  }
  if (/font-family/.test(path)) {
    return (
      <span className="sb-doc__preview sb-doc__aa" style={{ fontFamily: v }}>
        Aa
      </span>
    );
  }
  if (/font-weight/.test(path)) {
    return (
      <span className="sb-doc__preview sb-doc__aa" style={{ fontWeight: v }}>
        Aa
      </span>
    );
  }
  if (kind !== 'number') return null;
  if (/(^|\/)rounding\//.test(path)) {
    return (
      <span className="sb-doc__preview">
        <span className="sb-doc__corner" style={{ borderTopLeftRadius: v }} />
      </span>
    );
  }
  if (/(^|\/)(spacing|size)\//.test(path)) {
    return (
      <span className="sb-doc__preview sb-doc__preview--bar">
        <span className="sb-doc__bar" style={{ width: v }} />
      </span>
    );
  }
  return null;
}

// --- cells -------------------------------------------------------------------

/** A path that may wrap after each `/` (or `-` in a code) instead of being cut. */
function Breakable({ text, at = '/' }: { text: string; at?: string }) {
  const parts = text.split(at);
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <>
              {at}
              <wbr />
            </>
          )}
        </Fragment>
      ))}
    </>
  );
}

/** One mode of one variable, the way Figma's value column reads. */
function ValueCell({
  variable,
  value,
  kind,
  mode,
  scoped,
}: {
  variable: TokenVariable;
  value?: Value;
  kind: Kind;
  mode: string;
  /** Wraps a swatch or preview so it resolves in this column's mode, not the page's. */
  scoped: (node: ReactNode) => ReactNode;
}) {
  if (!value) return <span className="sb-doc__muted">—</span>;

  const swatch =
    kind === 'color'
      ? scoped(<span className="sb-doc__swatch" style={{ '--swatch': `var(${variable.cssVar})` } as CSSProperties} />)
      : null;
  const preview = kind === 'color' ? null : <Preview variable={variable} kind={kind} mode={mode} />;
  const after = preview && scoped(preview);

  // Alias (optionally at an opacity): a chip naming the variable it points at.
  if (value.alias) {
    const target = aliasPath(value.alias);
    const alias = value.alias;
    return (
      <>
        <button
          type="button"
          className="sb-doc__chip"
          title={`${alias} · перейти к переменной`}
          onClick={() => goToToken(alias)}
        >
          {swatch ?? <Icon name={KIND_ICON[kind]} size={14} iconStyle="linear" />}
          <span className="sb-doc__chip-label">
            <Breakable text={target} />
          </span>
          {value.opacity !== undefined && <span className="sb-doc__opacity">{value.opacity} %</span>}
        </button>
        {after}
      </>
    );
  }

  // Literal colour: swatch, hex, and the opacity when there is one.
  if (kind === 'color') {
    const { hex, opacity } = splitHex(String(value.value));
    // The last step of an alpha scale is stored opaque; it still reads as a step.
    const shown = value.opacity ?? opacity ?? (/\/alpha\//.test(variable.path) ? 100 : null);
    return (
      <span className="sb-doc__literal">
        {swatch}
        <span className="sb-doc__mono">{hex}</span>
        {shown !== null && shown !== undefined && <span className="sb-doc__opacity">{shown} %</span>}
      </span>
    );
  }

  return (
    <>
      <span className="sb-doc__mono">{literal(value.value, variable.path)}</span>
      {after}
    </>
  );
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
      <span className="sb-doc__code-label">
        <Breakable text={actual} at="-" />
      </span>
      {differs && <span className="sb-doc__flag">≠ Figma</span>}
    </button>
  );
}

/** Path segments: every part dimmed, the last one bright — as in the Figma headings. */
function GroupHeading({
  path,
  count,
  collapsed,
  onToggle,
}: {
  path: string[];
  count: number;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="sb-doc__heading"
      id={groupId(path)}
      aria-expanded={!collapsed}
      onClick={onToggle}
      title={collapsed ? 'Развернуть группу' : 'Свернуть группу'}
    >
      {/* Pinned to the left edge, so the heading stays in view in a table scrolled sideways. */}
      <span className="sb-doc__heading-inner">
        <span className="sb-doc__chevron" data-collapsed={collapsed}>
          <Icon name="alt-arrow-down" size={14} iconStyle="linear" />
        </span>
        {path.map((part, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="sb-doc__sep">/</span>}
            <span className={i === path.length - 1 ? 'sb-doc__strong' : undefined}>{part}</span>
          </Fragment>
        ))}
        <span className="sb-doc__heading-count">{count}</span>
      </span>
    </button>
  );
}

/**
 * A text style at table size — "Aa" and its size / line height — with the real
 * thing in a popover on hover or focus, so a 72px display style does not blow
 * up the row it sits in.
 */
function Specimen({
  group,
  variant,
  mode,
  scoped,
}: {
  group: DocGroup;
  variant: TextVariant;
  mode: string;
  scoped: (node: ReactNode) => ReactNode;
}) {
  const anchor = useRef<HTMLButtonElement>(null);
  const [at, setAt] = useState<{ left: number; top: number } | null>(null);
  const metric = (leaf: string) => {
    const v = group.variables.find((x) => x.path.endsWith(`/${leaf}`));
    return v ? resolveLiteral(v, mode) : undefined;
  };
  const show = () => {
    const rect = anchor.current?.getBoundingClientRect();
    if (rect) setAt({ left: rect.left, top: rect.bottom + 6 });
  };

  return (
    <>
      <button
        ref={anchor}
        type="button"
        className="sb-doc__specimen"
        onMouseEnter={show}
        onMouseLeave={() => setAt(null)}
        onFocus={show}
        onBlur={() => setAt(null)}
        aria-label={`Образец ${variant}`}
      >
        <span className="sb-doc__aa">Aa</span>
        <span className="sb-doc__mono sb-doc__muted">
          {metric('font-size')} / {metric('line-height')}
        </span>
      </button>
      {at &&
        createPortal(
          <div className="sb-popover" style={{ left: at.left, top: at.top }} role="tooltip">
            {scoped(
              <Text variant={variant} as="div" style={{ color: 'var(--sb-text)' }}>
                {/^(display|h)/.test(variant) ? 'Съешь ещё булок' : 'Съешь же ещё этих мягких французских булок'}
              </Text>,
            )}
          </div>,
          document.body,
        )}
    </>
  );
}

// --- table -------------------------------------------------------------------

export interface DocGroup {
  path: string[];
  variables: TokenVariable[];
  /** The group's description from the Figma table; null where Figma describes each row. */
  description: string | null;
}

/**
 * The groups of each documentation table in Figma — heading path and the one
 * description written for the group — in the order the Figma page has them.
 * Exported from the file next to the value dumps (tokens/figma/docs.json).
 */
const FIGMA_GROUPS = figmaGroups as unknown as Record<string, [string, string | null][]>;

/**
 * Groups variables the way the Figma table does: each one goes to the deepest
 * Figma group whose heading is a prefix of its path, groups keep Figma's order,
 * rows keep the variables' order.
 */
export function groupVariables(collectionId: string, variables: TokenVariable[]): DocGroup[] {
  const defs = FIGMA_GROUPS[collectionId] ?? [];
  const groups = defs.map(([path, description]) => ({
    path: path.split('/'),
    variables: [] as TokenVariable[],
    description,
  }));
  for (const v of variables) {
    let best = -1;
    defs.forEach(([path], i) => {
      if ((v.path === path || v.path.startsWith(`${path}/`)) && (best < 0 || path.length > defs[best][0].length))
        best = i;
    });
    if (best >= 0) groups[best].variables.push(v);
  }
  return groups.filter((g) => g.variables.length);
}

/** A row's name relative to its group heading, e.g. `static/content/default` under `color`. */
const nameIn = (group: DocGroup, v: TokenVariable) => {
  const head = group.path.join('/');
  return v.path === head ? v.path.split('/').pop()! : v.path.slice(head.length + 1);
};

/**
 * Lets a table scroll sideways only when it is wider than its canvas, so the
 * header keeps sticking to the page whenever it fits. Marks the scroller with
 * `data-overflow`, plus `data-scrolled` / `data-end` for the pinned name
 * column's shadow and the fade at the far edge.
 */
function useSideScroll(layout: string) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!node) return;
    const table = node.firstElementChild as HTMLElement | null;
    const edges = () => {
      const wide = node.hasAttribute('data-overflow');
      node.toggleAttribute('data-scrolled', wide && node.scrollLeft > 0);
      node.toggleAttribute('data-end', !wide || node.scrollLeft + node.clientWidth >= node.scrollWidth - 1);
    };
    const measure = () => {
      // Measured in the normal layout: the scrolling one is wider by design and
      // would never let go. An overflowing grid still reports its full width.
      node.removeAttribute('data-overflow');
      node.toggleAttribute('data-overflow', (table?.scrollWidth ?? 0) > node.clientWidth + 1);
      edges();
    };
    measure();
    // The header cells change width whenever a column does, even when the
    // table as a whole keeps its width.
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    for (const head of table?.querySelectorAll('.sb-doc__head') ?? []) observer.observe(head);
    node.addEventListener('scroll', edges, { passive: true });
    return () => {
      observer.disconnect();
      node.removeEventListener('scroll', edges);
    };
  }, [node, layout]);
  return setNode;
}

/**
 * Column widths shared by every token table, in px — sized so a two-mode table
 * (Theme) still fits a laptop canvas beside the sidebar.
 */
const COLUMN = { name: 160, mode: 200, code: 300, description: 200 };

/** The narrowest canvas a table with this many mode columns fits without scrolling. */
const tableWidth = (modes: number) => COLUMN.name + modes * COLUMN.mode + COLUMN.code + COLUMN.description;

export function DocTable({
  collectionId,
  groups,
  globals,
  modes,
  collapsed,
  onToggle,
  focused,
}: {
  collectionId: string;
  groups: DocGroup[];
  globals: ModeGlobals;
  /** The mode columns to show, in the collection's order. */
  modes: TokenCollection['modes'];
  collapsed: Set<string>;
  onToggle: (key: string) => void;
  /** cssVar of the row to flash after landing on it. */
  focused: string | null;
}) {
  const collection = collections[collectionId];
  const multi = collection.modes.length > 1;
  const scopeProp = SCOPE_PROP[collectionId];
  // A kind icon on every row says nothing when every row is the same kind.
  // Decided by the whole collection, so filtering never makes it come and go.
  const mixed = useMemo(() => new Set(collection.variables.map(kindOf)).size > 1, [collection]);

  // One fixed grid on every page, whatever the rows hold, so columns neither
  // differ between tables nor jump while filtering. Long names and alias
  // paths wrap after a `/`, long codes after a `-`; the description takes
  // what is left; a table wider than its canvas scrolls sideways.
  const columns = [
    `${COLUMN.name}px`,
    `repeat(${modes.length}, ${COLUMN.mode}px)`,
    `${COLUMN.code}px`,
    // Pinned to its minimum while the table scrolls (preview.css), or one line
    // of prose would set its width.
    `var(--sb-doc-description, minmax(${COLUMN.description}px, 1fr))`,
  ].join(' ');
  const scroller = useSideScroll(modes.map((m) => m.slug).join());

  const scopedIn = (mode: string) => (node: ReactNode) =>
    multi && scopeProp ? (
      <Scope globals={globals} {...{ [scopeProp]: mode }} style={{ display: 'contents' }}>
        {node}
      </Scope>
    ) : (
      node
    );

  return (
    <div className="sb-doc__scroller" ref={scroller}>
      <div className="sb-doc" style={{ gridTemplateColumns: columns }} role="table">
        <div className="sb-doc__head">Name</div>
        {modes.map((m) => (
          <div key={m.slug} className="sb-doc__head">
            {multi ? m.name : 'Value'}
          </div>
        ))}
        <div className="sb-doc__head">Code syntax</div>
        <div className="sb-doc__head">Description</div>

        {groups.map((group) => {
          const key = group.path.join('/');
          const isCollapsed = collapsed.has(key);
          // Figma writes one description per group; where it describes rows
          // one by one instead, each row shows its variable's own.
          const shared = group.description !== null;
          const variant = textVariant(group.path);
          const rows = (variant ? 1 : 0) + group.variables.length;
          // A shared description spans the group; either kind wraps in full and,
          // if it needs more room than its rows, makes them taller.
          const description = (row: number, text: string) =>
            shared && rows > 1 ? (
              row === 0 && (
                <div
                  className="sb-doc__cell sb-doc__description sb-doc__description--group"
                  style={{ gridRow: `span ${rows}` }}
                >
                  <span>{group.description}</span>
                </div>
              )
            ) : (
              <div className="sb-doc__cell sb-doc__description">
                <span>{text}</span>
              </div>
            );

          return (
            <Fragment key={key}>
              <GroupHeading
                path={group.path}
                count={group.variables.length}
                collapsed={isCollapsed}
                onToggle={() => onToggle(key)}
              />
              {!isCollapsed && (
                <>
                  {variant && (
                    <>
                      <div className="sb-doc__cell sb-doc__name sb-doc__muted">
                        <Icon name="eye" size={16} iconStyle="linear" />
                        <span>образец</span>
                      </div>
                      {modes.map((m) => (
                        <div key={m.slug} className="sb-doc__cell">
                          <Specimen group={group} variant={variant} mode={m.slug} scoped={scopedIn(m.slug)} />
                        </div>
                      ))}
                      <div className="sb-doc__cell sb-doc__muted">
                        <span className="sb-doc__mono">{`.box-text--${variant}`}</span>
                      </div>
                      {description(0, '')}
                    </>
                  )}
                  {group.variables.map((v, i) => {
                    const kind = kindOf(v);
                    const flash = focused === v.cssVar ? ' sb-doc__cell--focused' : '';
                    return (
                      <Fragment key={v.cssVar}>
                        <div
                          id={rowId(v.cssVar)}
                          className={`sb-doc__cell sb-doc__name${flash}`}
                          title={`${v.path} · ${KIND_LABEL[kind]}`}
                        >
                          {mixed && <Icon name={KIND_ICON[kind]} size={16} iconStyle="linear" />}
                          <span className="sb-doc__name-label">
                            <Breakable text={nameIn(group, v)} />
                          </span>
                        </div>
                        {modes.map((m) => (
                          <div key={m.slug} className={`sb-doc__cell${flash}`}>
                            <ValueCell
                              variable={v}
                              value={v.values[m.slug]}
                              kind={kind}
                              mode={m.slug}
                              scoped={scopedIn(m.slug)}
                            />
                          </div>
                        ))}
                        <div className={`sb-doc__cell${flash}`}>
                          <CodeCell variable={v} />
                        </div>
                        {description(i + (variant ? 1 : 0), group.description ?? v.description)}
                      </Fragment>
                    );
                  })}
                </>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

// --- outline -----------------------------------------------------------------

/**
 * The groups beside the table, in the table's order and spelled like its
 * headings — one line each, the path dimmed and its last segment bright —
 * under a label for each section. The group in view is highlighted.
 */
function Outline({
  groups,
  depth,
  onJump,
}: {
  groups: DocGroup[];
  /** Path depth that names the sections, from the section filter. */
  depth: number | null;
  onJump: (group: DocGroup) => void;
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const headings = groups.map((g) => document.getElementById(groupId(g.path))).filter(Boolean) as HTMLElement[];
    if (!headings.length) return;
    const update = () => {
      const top = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sb-sticky-top')) || 0;
      let current = headings[0].id;
      for (const h of headings) {
        if (h.getBoundingClientRect().top - top - 48 <= 0) current = h.id;
        else break;
      }
      setActive(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [groups]);

  // Keep the highlighted item in view inside a long outline.
  useEffect(() => {
    if (!active) return;
    document.querySelector(`[data-outline="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const items: ReactNode[] = [];
  let section: string | null = null;
  for (const group of groups) {
    const cut = depth !== null && group.path.length > depth + 1 ? depth + 1 : 0;
    const name = group.path.slice(0, cut).join(' / ');
    if (cut && name !== section) {
      items.push(
        <button key={`${name}#section`} type="button" className="sb-outline__section" onClick={() => onJump(group)}>
          {name}
        </button>,
      );
    }
    section = cut ? name : null;
    const rest = group.path.slice(cut);
    const id = groupId(group.path);
    items.push(
      <button
        key={id}
        type="button"
        data-outline={id}
        className="sb-outline__item"
        aria-current={active === id ? 'true' : undefined}
        title={group.path.join(' / ')}
        onClick={() => onJump(group)}
      >
        <span className="sb-outline__path">
          {rest.slice(0, -1).map((part, i) => (
            <span key={i} className="sb-outline__muted">
              {part} /{' '}
            </span>
          ))}
          {rest[rest.length - 1]}
        </span>
        <span className="sb-outline__count">{group.variables.length}</span>
      </button>,
    );
  }

  return (
    <nav className="sb-outline" aria-label="Группы на странице">
      <div className="sb-label sb-outline__title">На странице</div>
      <div className="sb-outline__list">{items}</div>
    </nav>
  );
}

/** Previous and next collection, in the sidebar's order. */
function Pager({ collectionId }: { collectionId: string }) {
  const index = COLLECTION_ORDER.indexOf(collectionId);
  const links = [
    { id: COLLECTION_ORDER[index - 1], label: 'Предыдущая', icon: 'alt-arrow-left' },
    { id: COLLECTION_ORDER[index + 1], label: 'Следующая', icon: 'alt-arrow-right' },
  ];
  return (
    <nav className="sb-pager" aria-label="Соседние коллекции">
      {links.map((link, i) =>
        link.id ? (
          <button
            key={link.label}
            type="button"
            className={`sb-pager__link${i ? ' sb-pager__link--next' : ''}`}
            onClick={() => goToCollection(link.id)}
          >
            <span className="sb-caption">{link.label}</span>
            <span className="sb-pager__name">
              {i === 0 && <Icon name={link.icon} size={14} iconStyle="linear" />}
              {collections[link.id].figmaName}
              {i === 1 && <Icon name={link.icon} size={14} iconStyle="linear" />}
            </span>
          </button>
        ) : (
          <span key={link.label} />
        ),
      )}
    </nav>
  );
}

// --- page --------------------------------------------------------------------

/** The path depth at which a collection first branches, for the section filter. */
function sectionDepth(variables: TokenVariable[]): number | null {
  for (let depth = 0; depth < 4; depth++) {
    if (!variables.every((v) => v.path.split('/').length > depth + 1)) return null;
    if (new Set(variables.map((v) => v.path.split('/')[depth])).size > 1) return depth;
  }
  return null;
}

const OUTLINE_WIDTH = 220;

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export interface TokenFilters {
  query: string;
  section: string;
  kind: string;
}

/**
 * A whole collection as one page: what the Figma page says about it, filters,
 * an outline of its groups, and the table.
 */
export function TokenPage({
  collectionId,
  title,
  lead,
  globals,
  filters,
  onFilters,
  children,
}: {
  collectionId: string;
  title: string;
  lead: ReactNode;
  globals: ModeGlobals;
  filters: TokenFilters;
  onFilters: (next: Partial<TokenFilters>) => void;
  /** Anything worth saying above the table. */
  children?: ReactNode;
}) {
  const collection = collections[collectionId];
  const { query, section, kind } = filters;

  const depth = useMemo(() => sectionDepth(collection.variables), [collection]);
  const sections = useMemo(() => {
    if (depth === null) return [];
    const counts = new Map<string, number>();
    for (const v of collection.variables) {
      const part = v.path.split('/')[depth];
      counts.set(part, (counts.get(part) ?? 0) + 1);
    }
    return [...counts];
  }, [collection, depth]);
  const kinds = useMemo(() => {
    const counts = new Map<Kind, number>();
    for (const v of collection.variables) counts.set(kindOf(v), (counts.get(kindOf(v)) ?? 0) + 1);
    return [...counts];
  }, [collection]);

  const [hiddenModes, setHiddenModes] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [focused, setFocused] = useState<string | null>(null);

  const modes = collection.modes.filter((m) => !hiddenModes.has(m.slug));

  const groups = useMemo(() => {
    const q = query.trim();
    const variables = collection.variables.filter(
      (v) =>
        (!q || matches(q, `${v.path} ${v.cssVar} ${v.description}`)) &&
        (!section || depth === null || v.path.split('/')[depth] === section) &&
        (!kind || kindOf(v) === kind),
    );
    return groupVariables(collectionId, variables);
  }, [collection, collectionId, query, section, kind, depth]);
  const total = groups.reduce((n, g) => n + g.variables.length, 0);
  const filtered = Boolean(query || section || kind || hiddenModes.size);

  const reveal = (group: DocGroup) => {
    const key = group.path.join('/');
    setCollapsed((prev) => {
      if (!prev.has(key)) return prev;
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
    requestAnimationFrame(() => scrollTo(groupId(group.path)));
  };

  // Landing on a variable: clear whatever hides it, open its group, flash it.
  const land = (path: string) => {
    const variable = collection.variables.find((v) => v.path === path);
    if (!variable) return;
    if (query || section || kind) onFilters({ query: '', section: '', kind: '' });
    setHiddenModes(new Set());
    setCollapsed(new Set());
    setFocused(variable.cssVar);
    // Instant, and twice: the story re-renders with the cleared filters, and
    // Storybook resets the scroll of a freshly selected story after mounting it.
    const jump = () =>
      document.getElementById(rowId(variable.cssVar))?.scrollIntoView({ behavior: 'instant', block: 'center' });
    setTimeout(jump, 50);
    setTimeout(jump, 350);
  };

  useEffect(() => {
    openPages.set(collectionId, land);
    if (pending?.startsWith(`${collectionId}:`)) {
      const path = aliasPath(pending);
      pending = null;
      land(path);
    }
    return () => {
      openPages.delete(collectionId);
    };
  });

  useEffect(() => {
    if (!focused) return;
    const timer = setTimeout(() => setFocused(null), 2400);
    return () => clearTimeout(timer);
  }, [focused]);

  const toggle = (key: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  const allCollapsed = groups.length > 0 && groups.every((g) => collapsed.has(g.path.join('/')));

  // The outline goes beside the table only when both fit; otherwise the
  // toolbar carries a "go to group" select instead.
  const layout = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const node = layout.current;
    if (!node) return;
    const observer = new ResizeObserver(() => setWidth(node.clientWidth));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  // Widths at which nothing in the table needs cutting, not its minimums.
  const tableComfort = tableWidth(modes.length);
  const navigable = groups.length > 3;
  const outline = navigable && width >= tableComfort + OUTLINE_WIDTH + 24;

  return (
    <Page
      title={title}
      lead={lead}
      toolbar={
        <>
          <Search value={query} onChange={(value) => onFilters({ query: value })} placeholder="Имя или var(--…)" />
          {sections.length > 1 && (
            <Select
              label="Раздел"
              value={section}
              onChange={(value) => onFilters({ section: value })}
              options={[
                { value: '', label: 'все' },
                ...sections.map(([name, count]) => ({ value: name, label: `${name} · ${count}` })),
              ]}
            />
          )}
          {kinds.length > 1 && (
            <Segmented
              label="Тип"
              value={kind}
              onChange={(value) => onFilters({ kind: value })}
              options={[
                { value: '', label: 'все' },
                ...kinds.map(([k]) => ({ value: k, label: KIND_LABEL[k], icon: KIND_ICON[k] })),
              ]}
            />
          )}
          {collection.modes.length > 1 && (
            <MultiSelect
              label="Колонки"
              options={collection.modes.map((m) => ({ value: m.slug, label: m.name }))}
              hidden={hiddenModes}
              onChange={setHiddenModes}
            />
          )}
          {navigable && !outline && (
            <Select
              label="Перейти"
              value=""
              onChange={(value) => {
                const group = groups.find((g) => groupId(g.path) === value);
                if (group) reveal(group);
              }}
              options={[
                { value: '', label: 'к группе…' },
                ...groups.map((g) => ({ value: groupId(g.path), label: g.path.join(' / ') })),
              ]}
            />
          )}
          <Counts>
            <span className="sb-caption">
              {counted(total, ['переменная', 'переменные', 'переменных'])}
              {collection.attribute && ` · [${collection.attribute}]`}
            </span>
            {groups.length > 1 && (
              <ToolbarButton
                icon={allCollapsed ? 'alt-arrow-down' : 'alt-arrow-up'}
                onClick={() => setCollapsed(allCollapsed ? new Set() : new Set(groups.map((g) => g.path.join('/'))))}
                title={allCollapsed ? 'Развернуть все группы' : 'Свернуть все группы'}
              />
            )}
            {/* With nothing found, the empty state carries the one reset. */}
            {filtered && total > 0 && (
              <ResetFilters
                onReset={() => {
                  onFilters({ query: '', section: '', kind: '' });
                  setHiddenModes(new Set());
                }}
              />
            )}
            <ShareLink />
          </Counts>
        </>
      }
    >
      {children}
      {total === 0 ? (
        <Empty query={query} onClear={() => onFilters({ query: '', section: '', kind: '' })} />
      ) : (
        <div
          ref={layout}
          className="sb-doc-layout"
          style={{ gridTemplateColumns: outline ? `minmax(0, 1fr) ${OUTLINE_WIDTH}px` : 'minmax(0, 1fr)' }}
        >
          <DocTable
            collectionId={collectionId}
            groups={groups}
            globals={globals}
            modes={modes}
            collapsed={collapsed}
            onToggle={toggle}
            focused={focused}
          />
          {outline && <Outline groups={groups} depth={depth} onJump={reveal} />}
        </div>
      )}
      <Pager collectionId={collectionId} />
    </Page>
  );
}
