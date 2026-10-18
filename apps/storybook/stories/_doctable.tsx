import { Fragment, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { addons } from 'storybook/preview-api';
import { SELECT_STORY } from 'storybook/internal/core-events';
import { Icon, ICON_STYLES, type IconStyle } from '@box-ui/icons';
import { Text, type TextVariant } from '@box-ui/react';
import { model, type TokenCollection, type TokenVariable } from '@box-ui/tokens';
import {
  Counts,
  Empty,
  Page,
  ResetFilters,
  Scope,
  Search,
  Segmented,
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

export const KIND_ICON: Record<Kind, string> = { color: 'palette-round', number: 'ruler', string: 'text-square' };
const KIND_LABEL: Record<Kind, string> = { color: 'Цвет', number: 'Число', string: 'Строка' };

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

/** `typography/heading/H1` -> `h1`, `typography/body/l` -> `body-l`. */
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
          title={`${alias}\nКлик — перейти к переменной`}
          onClick={() => goToToken(alias)}
        >
          {swatch ?? <Icon name={KIND_ICON[kind]} size={14} iconStyle="linear" />}
          <span className="sb-doc__chip-label">{target}</span>
          {value.opacity !== undefined && <span className="sb-doc__opacity">{value.opacity} %</span>}
        </button>
        {after}
      </>
    );
  }

  // Literal colour: swatch, hex, and the opacity when there is one.
  if (kind === 'color') {
    const { hex, opacity } = splitHex(String(value.value));
    const shown = value.opacity ?? opacity;
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
      <span className="sb-doc__code-label">{actual}</span>
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
    </button>
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

const leafOf = (v: TokenVariable) => (v.path.includes('/') ? v.path.split('/').pop()! : v.path);

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

  const columns = [
    'minmax(120px, 0.7fr)',
    `repeat(${modes.length}, minmax(${multi ? 150 : 180}px, 1fr))`,
    'minmax(220px, 1.3fr)',
    'minmax(160px, 1fr)',
  ].join(' ');

  const scopedIn = (mode: string) => (node: ReactNode) =>
    multi && scopeProp ? (
      <Scope globals={globals} {...{ [scopeProp]: mode }} style={{ display: 'contents' }}>
        {node}
      </Scope>
    ) : (
      node
    );

  return (
    <div className="sb-doc__scroller">
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
          const descriptions = [...new Set(group.variables.map((v) => v.description))];
          const shared = descriptions.length === 1;
          const variant = textVariant(group.path);
          const rows = (variant ? 1 : 0) + group.variables.length;
          // A shared description spans the group and may wrap as far as its rows
          // allow; a row's own stays on one line. Neither makes a row taller.
          const description = (row: number, text: string) =>
            shared && rows > 1 ? (
              row === 0 && (
                <div
                  className="sb-doc__cell sb-doc__description sb-doc__description--group"
                  style={{ gridRow: `span ${rows}`, WebkitLineClamp: rows * 2 - 1 } as CSSProperties}
                  title={descriptions[0]}
                >
                  <span>{descriptions[0]}</span>
                </div>
              )
            ) : (
              <div className="sb-doc__cell sb-doc__description" title={text}>
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
                        <div key={m.slug} className="sb-doc__cell sb-doc__specimen">
                          {scopedIn(m.slug)(
                            <Text variant={variant} as="span" style={{ color: 'var(--sb-text)' }}>
                              Aa Бб
                            </Text>,
                          )}
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
                          title={`${v.path} · ${KIND_LABEL[kind].toLowerCase()}`}
                        >
                          <Icon name={KIND_ICON[kind]} size={16} iconStyle="linear" />
                          <span className="sb-doc__name-label">{leafOf(v)}</span>
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
                        {description(i + (variant ? 1 : 0), v.description)}
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
 * The groups as a tree, sticky beside the table: the headings Figma has down
 * the page, one click from anywhere. The group in view is highlighted.
 */
function Outline({ groups, onJump }: { groups: DocGroup[]; onJump: (group: DocGroup) => void }) {
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

  let previous: string[] = [];
  const items: ReactNode[] = [];
  for (const group of groups) {
    const shared = group.path.findIndex((part, i) => previous[i] !== part);
    const from = shared === -1 ? group.path.length - 1 : shared;
    for (let depth = from; depth < group.path.length - 1; depth++) {
      items.push(
        <div
          key={`${group.path.slice(0, depth + 1).join('/')}#label`}
          className="sb-outline__label"
          style={{ paddingLeft: 8 + depth * 12 }}
        >
          {group.path[depth]}
        </div>,
      );
    }
    const id = groupId(group.path);
    items.push(
      <button
        key={id}
        type="button"
        data-outline={id}
        className="sb-outline__item"
        aria-current={active === id ? 'true' : undefined}
        style={{ paddingLeft: 8 + (group.path.length - 1) * 12 }}
        onClick={() => onJump(group)}
      >
        <span>{group.path[group.path.length - 1]}</span>
        <span className="sb-outline__count">{group.variables.length}</span>
      </button>,
    );
    previous = group.path;
  }

  return (
    <nav className="sb-outline" aria-label="Группы на странице">
      <div className="sb-label sb-outline__title">На странице</div>
      <div className="sb-outline__list">{items}</div>
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
    return groupVariables(variables);
  }, [collection, query, section, kind, depth]);
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
  const toggleModes = (mode: string) =>
    setHiddenModes((prev) => {
      const next = new Set(prev);
      if (next.has(mode)) next.delete(mode);
      else if (collection.modes.length - next.size > 1) next.add(mode);
      return next;
    });

  const outline = groups.length > 3;

  return (
    <Page
      title={title}
      lead={lead}
      toolbar={
        <>
          <Search
            value={query}
            onChange={(value) => onFilters({ query: value })}
            placeholder="Имя, var(--…), описание"
          />
          {sections.length > 1 && (
            <select
              className="sb-control"
              aria-label="Раздел"
              value={section}
              onChange={(e) => onFilters({ section: e.target.value })}
            >
              <option value="">Все разделы</option>
              {sections.map(([name, count]) => (
                <option key={name} value={name}>
                  {name} · {count}
                </option>
              ))}
            </select>
          )}
          {kinds.length > 1 && (
            <Segmented
              label="Тип"
              value={kind}
              onChange={(value) => onFilters({ kind: value })}
              options={[
                { value: '', label: 'Все' },
                ...kinds.map(([k]) => ({ value: k, label: KIND_LABEL[k], icon: KIND_ICON[k] })),
              ]}
            />
          )}
          {collection.modes.length > 1 && (
            <div className="sb-segmented" role="group" aria-label="Колонки мод">
              {collection.modes.map((m) => (
                <button
                  key={m.slug}
                  type="button"
                  className="sb-segmented__item"
                  aria-pressed={!hiddenModes.has(m.slug)}
                  onClick={() => toggleModes(m.slug)}
                  title={hiddenModes.has(m.slug) ? `Показать колонку ${m.name}` : `Скрыть колонку ${m.name}`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          )}
          {outline && (
            <select
              className="sb-control sb-outline-select"
              aria-label="Перейти к группе"
              value=""
              onChange={(e) => {
                const group = groups.find((g) => groupId(g.path) === e.target.value);
                if (group) reveal(group);
              }}
            >
              <option value="">Перейти к группе…</option>
              {groups.map((g) => (
                <option key={groupId(g.path)} value={groupId(g.path)}>
                  {g.path.join(' / ')}
                </option>
              ))}
            </select>
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
              >
                {allCollapsed ? 'Развернуть' : 'Свернуть'}
              </ToolbarButton>
            )}
            {filtered && (
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
        <Empty query={query || 'с этими фильтрами'} onClear={() => onFilters({ query: '', section: '', kind: '' })} />
      ) : (
        <div className={outline ? 'sb-doc-layout' : undefined}>
          <DocTable
            collectionId={collectionId}
            groups={groups}
            globals={globals}
            modes={modes}
            collapsed={collapsed}
            onToggle={toggle}
            focused={focused}
          />
          {outline && <Outline groups={groups} onJump={reveal} />}
        </div>
      )}
    </Page>
  );
}
