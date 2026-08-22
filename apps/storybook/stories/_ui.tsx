import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { Icon } from '@box-ui/icons';

/*
 * The docs chrome is Storybook's own look — its palette, its type, its 4px
 * radius, exposed as the `--sb-*` variables that preview.tsx reads out of
 * `storybook/theming`. Box UI tokens appear only inside demos, which always
 * carry both a background and a foreground so they read on any chrome.
 */

// --- copy-to-clipboard -------------------------------------------------------

const CopyContext = createContext<(value: string, label?: string) => void>(() => {});

/** Copies a token name and raises the page toast. Available inside any `<Page>`. */
export function useCopy() {
  return useContext(CopyContext);
}

function Toast({ message }: { message: string | null }) {
  return (
    <div className="sb-toast" data-visible={message ? 'true' : 'false'} aria-live="polite">
      <Icon name="copy" size={14} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{message ?? ''}</span>
    </div>
  );
}

// --- type --------------------------------------------------------------------

export function Caption({ children }: { children: ReactNode }) {
  return <span className="sb-caption">{children}</span>;
}

export function Code({ children, copyable }: { children: ReactNode; copyable?: string }) {
  const copy = useCopy();
  if (!copyable) return <code className="sb-code">{children}</code>;
  return (
    <button type="button" className="sb-code sb-code-button" onClick={() => copy(copyable)} title={`Copy ${copyable}`}>
      {children}
    </button>
  );
}

// --- page scaffolding --------------------------------------------------------

export function Page({
  title,
  lead,
  toolbar,
  children,
}: {
  title: string;
  lead?: ReactNode;
  /** Filters and counts. Sticks to the top of the viewport while the page scrolls. */
  toolbar?: ReactNode;
  children: ReactNode;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback((value: string, label?: string) => {
    void navigator.clipboard?.writeText(value);
    setMessage(label ?? value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 1600);
  }, []);

  useEffect(() => () => (timer.current ? clearTimeout(timer.current) : undefined), []);

  return (
    <CopyContext.Provider value={copy}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <header
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            paddingBottom: toolbar ? 16 : 28,
          }}
        >
          <h1 className="sb-title">{title}</h1>
          {lead && <p className="sb-lead">{lead}</p>}
        </header>

        {toolbar && <div className="sb-toolbar">{toolbar}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>{children}</div>
      </div>
      <Toast message={message} />
    </CopyContext.Provider>
  );
}

export function Section({
  id,
  title,
  description,
  aside,
  children,
}: {
  id?: string;
  title: string;
  description?: ReactNode;
  /** Right-aligned slot for counts or legends. */
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} style={{ display: 'flex', flexDirection: 'column', gap: 10, scrollMarginTop: 72 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <h2 className="sb-heading">{title}</h2>
        {aside}
      </div>
      {description && <p className="sb-lead">{description}</p>}
      <div style={{ marginTop: 2 }}>{children}</div>
    </section>
  );
}

export function Grid({ min = 200, gap = 8, children }: { min?: number; gap?: number; children: ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap }}>{children}</div>
  );
}

// --- form controls -----------------------------------------------------------

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span className="sb-label">{label}</span>
      {children}
    </label>
  );
}

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <Field label={label}>
      <select className="sb-control" value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

/** Search box; `/` focuses it from anywhere on the page, Esc clears it. */
export function Search({
  value,
  onChange,
  placeholder = 'Search…',
  label = 'Search',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}) {
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
      if (event.key === '/' && !typing) {
        event.preventDefault();
        input.current?.focus();
      }
      if (event.key === 'Escape' && target === input.current) onChange('');
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onChange]);

  return (
    <Field label={label}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: 240 }}>
        <span style={{ position: 'absolute', left: 8, display: 'flex', color: 'var(--sb-text-muted)', pointerEvents: 'none' }}>
          <Icon name="magnifer" size={14} />
        </span>
        <input
          ref={input}
          className="sb-control"
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: '100%', paddingLeft: 28, paddingRight: value ? 8 : 26 }}
        />
        {!value && (
          <kbd
            className="sb-code"
            style={{
              position: 'absolute',
              right: 6,
              padding: '1px 5px',
              border: '1px solid var(--sb-border)',
              borderRadius: 3,
              fontSize: 10,
              pointerEvents: 'none',
            }}
          >
            /
          </kbd>
        )}
      </div>
    </Field>
  );
}

/** Anchor chips for pages made of many groups. */
export function JumpNav({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
      {items.map((item) => (
        <a key={item.id} className="sb-chip" href={`#${item.id}`}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function Count({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'warning' }) {
  return <span className={tone === 'warning' ? 'sb-count sb-count--warning' : 'sb-count'}>{children}</span>;
}

/** Right-aligned group of counts inside a toolbar. */
export function Counts({ children }: { children: ReactNode }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 28, marginLeft: 'auto' }}>{children}</div>;
}

/** An aside about the data itself — a Figma quirk, a caveat, a heads-up. */
export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="sb-callout">
      <span className="sb-callout__icon">
        <Icon name="info-circle" size={16} />
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <strong style={{ fontSize: 13 }}>{title}</strong>
        <div className="sb-lead" style={{ margin: 0 }}>
          {children}
        </div>
      </div>
    </aside>
  );
}

export function Empty({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="sb-empty">
      <Icon name="magnifer" size={28} />
      <div>Nothing matches “{query}”</div>
      <button type="button" onClick={onClear} className="sb-link">
        Clear the search
      </button>
    </div>
  );
}

// --- mode scoping ------------------------------------------------------------

export type ModeGlobals = { theme: string; accent: string; radius: string; font: string; device: string };

/**
 * Scopes Box UI modes to a subtree.
 *
 * A custom property is substituted where it is *declared*, not where it is
 * read: `--box-background-sentiment-primary: var(--box-colors-brand-primary)`
 * is resolved on the element that declares it. So overriding only
 * `data-accent` deeper in the tree cannot reach a Mode token that `<html>`
 * already resolved. Setting all five attributes together re-declares every
 * layer on this one element, and the whole chain resolves locally.
 */
export function Scope({
  globals,
  theme,
  accent,
  radius,
  font,
  device,
  style,
  children,
}: Partial<ModeGlobals> & { globals: ModeGlobals; style?: CSSProperties; children: ReactNode }) {
  return (
    <div
      data-theme={theme ?? globals.theme}
      data-accent={accent ?? globals.accent}
      data-radius={radius ?? globals.radius}
      data-font={font ?? globals.font}
      data-device={device ?? globals.device}
      style={style}
    >
      {children}
    </div>
  );
}

/**
 * A Box UI surface inside the Storybook chrome. Carries both a background and a
 * foreground token, so a demo of the Light theme still reads on a dark canvas.
 */
export const demoSurface: CSSProperties = {
  background: 'var(--box-background-base-secondary)',
  color: 'var(--box-content-base-primary)',
  border: '1px solid var(--box-border-base-neutral)',
  borderRadius: 'var(--box-rounding-base-m)',
  padding: 'var(--box-spacing-base-3xs)',
};

// --- live token resolution ---------------------------------------------------

/**
 * `getPropertyValue` on a custom property hands back the declaration
 * (`var(--box-color-blue-solid-500)`), not the value it lands on. Assigning it
 * to a real property on a probe element and reading *that* back is what forces
 * the whole alias chain to resolve.
 */
let probe: HTMLElement | null = null;

function resolve(cssVar: string, kind: 'color' | 'length'): string {
  if (!cssVar || typeof document === 'undefined') return '';
  if (!probe) {
    probe = document.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;top:-9999px';
    document.body.appendChild(probe);
  }
  if (kind === 'color') {
    probe.style.backgroundColor = '';
    probe.style.backgroundColor = `var(${cssVar})`;
    return toHex(getComputedStyle(probe).backgroundColor);
  }
  probe.style.width = '';
  probe.style.width = `var(${cssVar})`;
  const width = getComputedStyle(probe).width;
  return width === 'auto' ? '' : `${Math.round(parseFloat(width) * 100) / 100}px`;
}

/** `rgb(59 130 246 / 0.4)` and `rgb(59, 130, 246)` alike -> `#3b82f6` (+ alpha). */
function toHex(value: string): string {
  const parts = value.match(/[\d.]+/g);
  if (!parts || parts.length < 3) return value;
  const hex = parts
    .slice(0, 3)
    .map((part) => Math.round(Number(part)).toString(16).padStart(2, '0'))
    .join('');
  const alpha = parts[3] !== undefined ? Math.round(Number(parts[3]) * 255).toString(16).padStart(2, '0') : '';
  return `#${hex}${alpha === 'ff' ? '' : alpha}`;
}

/** Re-reads whenever a mode attribute on `<html>` changes. */
export function useResolved(cssVar: string, kind: 'color' | 'length'): string {
  const [value, setValue] = useState(() => resolve(cssVar, kind));

  useEffect(() => {
    const read = () => setValue(resolve(cssVar, kind));
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-accent', 'data-radius', 'data-font', 'data-device'],
    });
    return () => observer.disconnect();
  }, [cssVar, kind]);

  return value;
}

// --- token display -----------------------------------------------------------

/**
 * One colour token. The whole tile is a button — clicking copies the CSS
 * variable, which is the thing you actually paste into code.
 */
export function Swatch({
  cssVar,
  name,
  meta,
  /** Show what the alias chain resolves to right now, for this set of modes. */
  live,
}: {
  cssVar: string;
  name: string;
  meta?: ReactNode;
  live?: boolean;
}) {
  const copy = useCopy();
  const resolved = useResolved(live ? cssVar : '', 'color');
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
          position: 'relative',
          display: 'block',
          height: 52,
          overflow: 'hidden',
          borderRadius: 'var(--sb-radius)',
          border: '1px solid var(--sb-border)',
        }}
      >
        {/* checkerboard, so alpha tokens read as translucent */}
        <span
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(45deg, var(--sb-hover) 25%, transparent 25%, transparent 75%, var(--sb-hover) 75%), linear-gradient(45deg, var(--sb-hover) 25%, transparent 25%, transparent 75%, var(--sb-hover) 75%)',
            backgroundSize: '12px 12px',
            backgroundPosition: '0 0, 6px 6px',
            backgroundColor: 'var(--sb-raised-bg)',
          }}
        />
        <span style={{ position: 'absolute', inset: 0, background: `var(${cssVar})` }} />
        <span className="sb-tile__hint">
          <Icon name="copy" size={14} />
        </span>
      </span>
      <span style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
      {(live || meta) && (
        <span className="sb-code" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {live ? resolved : meta}
        </span>
      )}
    </button>
  );
}

/** One row of a scale: token name, what it resolves to, and the drawn value. */
export function Row({
  label,
  value,
  /** Also show the px the token resolves to under the current modes. */
  live,
  children,
}: {
  label: string;
  value?: ReactNode;
  live?: boolean;
  children?: ReactNode;
}) {
  const copy = useCopy();
  const resolved = useResolved(live ? label : '', 'length');

  return (
    <button
      type="button"
      className="sb-row"
      onClick={() => copy(`var(${label})`, label)}
      title={`Copy var(${label})`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(200px, 280px) minmax(150px, 210px) 1fr',
        gap: 12,
        alignItems: 'center',
        width: '100%',
        padding: '8px 6px',
        border: 0,
        borderBottom: '1px solid var(--sb-border)',
        background: 'none',
        font: 'inherit',
        textAlign: 'left',
        cursor: 'pointer',
      }}
    >
      <Code>{label}</Code>
      <Caption>
        {value}
        {live && resolved && <span style={{ opacity: 0.75 }}> · {resolved}</span>}
      </Caption>
      <div>{children}</div>
    </button>
  );
}
