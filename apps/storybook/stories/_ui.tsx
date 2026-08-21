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
import { Text } from '@box-ui/react';

// --- copy-to-clipboard -------------------------------------------------------

const CopyContext = createContext<(value: string, label?: string) => void>(() => {});

/** Copies a token name and raises the page toast. Available inside any `<Page>`. */
export function useCopy() {
  return useContext(CopyContext);
}

function Toast({ message }: { message: string | null }) {
  return (
    <div
      aria-live="polite"
      style={{
        position: 'fixed',
        left: '50%',
        bottom: message ? 'var(--box-spacing-base-m)' : 'calc(-1 * var(--box-size-base-max))',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--box-spacing-base-4xs)',
        padding: 'var(--box-spacing-base-4xs) var(--box-spacing-base-2xs)',
        borderRadius: 'var(--box-rounding-base-full)',
        background: 'var(--box-content-base-primary)',
        color: 'var(--box-background-base-secondary)',
        fontSize: 'var(--box-typography-caption-l-font-size)',
        fontFamily: 'var(--box-typography-font-family-body)',
        boxShadow: '0 8px 24px var(--box-colors-black-alpha-16)',
        opacity: message ? 1 : 0,
        transition: 'bottom 160ms ease, opacity 160ms ease',
        pointerEvents: 'none',
        zIndex: 20,
        maxWidth: '90vw',
      }}
    >
      <Icon name="copy" size="min" />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{message}</span>
    </div>
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
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1180 }}>
        <header
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--box-spacing-base-3xs)',
            paddingBottom: toolbar ? 'var(--box-spacing-base-2xs)' : 'var(--box-spacing-base-l)',
          }}
        >
          <Text variant="h3">{title}</Text>
          {lead && (
            <Text variant="body-l" tone="secondary" style={{ maxWidth: '68ch' }}>
              {lead}
            </Text>
          )}
        </header>

        {toolbar && <Toolbar>{toolbar}</Toolbar>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--box-spacing-base-xl)' }}>{children}</div>
      </div>
      <Toast message={message} />
    </CopyContext.Provider>
  );
}

/** Sticky filter bar. Blurs the content passing underneath it. */
function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        gap: 'var(--box-spacing-base-2xs)',
        marginBottom: 'var(--box-spacing-base-l)',
        padding: 'var(--box-spacing-base-3xs)',
        borderRadius: 'var(--box-rounding-base-m)',
        border: '1px solid var(--box-border-base-neutral)',
        background: 'var(--box-background-base-secondary)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 16px var(--box-colors-black-alpha-8)',
      }}
    >
      {children}
    </div>
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
    <section
      id={id}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--box-spacing-base-2xs)', scrollMarginTop: 80 }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--box-spacing-base-2xs)' }}>
        <Text variant="h5">{title}</Text>
        {aside}
      </div>
      {description && (
        <Text variant="body-m" tone="secondary" style={{ maxWidth: '68ch' }}>
          {description}
        </Text>
      )}
      <div style={{ marginTop: 'var(--box-spacing-base-4xs)' }}>{children}</div>
    </section>
  );
}

export function Grid({ min = 200, gap = '2xs', children }: { min?: number; gap?: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
        gap: `var(--box-spacing-base-${gap})`,
      }}
    >
      {children}
    </div>
  );
}

// --- form controls -----------------------------------------------------------

const controlStyle: CSSProperties = {
  height: 'var(--box-size-base-m)',
  borderRadius: 'var(--box-rounding-base-s)',
  border: '1px solid var(--box-border-base-neutral)',
  background: 'var(--box-background-base-primary)',
  color: 'var(--box-content-base-primary)',
  paddingInline: 'var(--box-spacing-base-3xs)',
  fontSize: 'var(--box-typography-body-m-font-size)',
  fontFamily: 'var(--box-typography-font-family-body)',
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--box-spacing-base-min)' }}>
      <Text variant="caption-m" tone="tertiary" as="span" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </Text>
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
      <select value={value} onChange={(e) => onChange(e.target.value as T)} style={controlStyle}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

/** Search box with a clear button; `/` focuses it from anywhere on the page. */
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
        <span style={{ position: 'absolute', left: 'var(--box-spacing-base-4xs)', display: 'flex', color: 'var(--box-content-base-tertiary)', pointerEvents: 'none' }}>
          <Icon name="magnifer" size="min" />
        </span>
        <input
          ref={input}
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={{
            ...controlStyle,
            width: '100%',
            paddingLeft: 'calc(var(--box-size-base-min) + var(--box-spacing-base-2xs))',
            paddingRight: value ? 'var(--box-size-base-xs)' : undefined,
          }}
        />
        {!value && (
          <kbd
            style={{
              position: 'absolute',
              right: 'var(--box-spacing-base-4xs)',
              padding: '1px 6px',
              borderRadius: 'var(--box-rounding-base-min)',
              border: '1px solid var(--box-border-base-neutral)',
              color: 'var(--box-content-base-tertiary)',
              fontSize: 'var(--box-typography-caption-m-font-size)',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
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
    <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--box-spacing-base-min)', alignItems: 'center' }}>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          style={{
            padding: '2px var(--box-spacing-base-4xs)',
            borderRadius: 'var(--box-rounding-base-full)',
            border: '1px solid var(--box-border-base-neutral)',
            color: 'var(--box-content-base-secondary)',
            fontSize: 'var(--box-typography-caption-m-font-size)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function Count({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'warning' }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 'var(--box-size-base-xs)',
        padding: '0 var(--box-spacing-base-4xs)',
        borderRadius: 'var(--box-rounding-base-full)',
        background: tone === 'warning' ? 'var(--box-background-sentiment-warning-subtle)' : 'var(--box-control-neutral-secondary)',
        color: tone === 'warning' ? 'var(--box-content-sentiment-warning)' : 'var(--box-content-base-secondary)',
        fontSize: 'var(--box-typography-caption-l-font-size)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

export function Empty({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--box-spacing-base-3xs)',
        padding: 'var(--box-spacing-base-max) var(--box-spacing-base-m)',
        borderRadius: 'var(--box-rounding-base-m)',
        border: '1px dashed var(--box-border-base-neutral-hover)',
        color: 'var(--box-content-base-secondary)',
        textAlign: 'center',
      }}
    >
      <Icon name="magnifer" size="l" style={{ color: 'var(--box-content-base-tertiary)' }} />
      <Text variant="body-l" as="div">
        Nothing matches “{query}”
      </Text>
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

// --- token display -----------------------------------------------------------

export function Code({ children, copyable }: { children: ReactNode; copyable?: string }) {
  const copy = useCopy();
  const style: CSSProperties = {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: 'var(--box-typography-caption-l-font-size)',
    color: 'var(--box-content-base-secondary)',
    wordBreak: 'break-all',
  };

  if (!copyable) return <code style={style}>{children}</code>;
  return (
    <button type="button" className="sb-code-button" onClick={() => copy(copyable)} title={`Copy ${copyable}`} style={style}>
      {children}
    </button>
  );
}

/**
 * One colour token. The whole tile is a button — clicking copies the CSS
 * variable, which is the thing you actually paste into code.
 */
export function Swatch({ cssVar, name, meta }: { cssVar: string; name: string; meta?: ReactNode }) {
  const copy = useCopy();
  return (
    <button
      type="button"
      className="sb-tile"
      onClick={() => copy(`var(${cssVar})`, cssVar)}
      title={`Copy var(${cssVar})`}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--box-spacing-base-min)', padding: 0, border: 0, background: 'none', textAlign: 'left' }}
    >
      <span
        style={{
          position: 'relative',
          display: 'block',
          height: 52,
          overflow: 'hidden',
          borderRadius: 'var(--box-rounding-base-xs)',
          border: '1px solid var(--box-border-base-neutral)',
        }}
      >
        {/* checkerboard, so alpha tokens read as translucent */}
        <span
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(45deg, var(--box-control-neutral-primary) 25%, transparent 25%, transparent 75%, var(--box-control-neutral-primary) 75%), linear-gradient(45deg, var(--box-control-neutral-primary) 25%, transparent 25%, transparent 75%, var(--box-control-neutral-primary) 75%)',
            backgroundSize: '12px 12px',
            backgroundPosition: '0 0, 6px 6px',
          }}
        />
        <span style={{ position: 'absolute', inset: 0, background: `var(${cssVar})` }} />
        <span className="sb-tile__hint">
          <Icon name="copy" size="min" />
        </span>
      </span>
      <Text variant="caption-l" as="span" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {name}
      </Text>
      {meta && (
        <Text variant="caption-m" tone="tertiary" as="span" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {meta}
        </Text>
      )}
    </button>
  );
}

/** One row of a scale: token name, what it resolves to, and the drawn value. */
export function Row({ label, value, children }: { label: string; value?: ReactNode; children?: ReactNode }) {
  const copy = useCopy();
  return (
    <div
      className="sb-row"
      onClick={() => copy(`var(${label})`, label)}
      title={`Copy var(${label})`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(180px, 260px) minmax(140px, 200px) 1fr',
        gap: 'var(--box-spacing-base-2xs)',
        alignItems: 'center',
        padding: 'var(--box-spacing-base-4xs) var(--box-spacing-base-4xs)',
        borderRadius: 'var(--box-rounding-base-xs)',
        borderBottom: '1px solid var(--box-border-base-neutral)',
        cursor: 'pointer',
      }}
    >
      <Code>{label}</Code>
      <Text variant="caption-l" tone="tertiary" as="span">
        {value}
      </Text>
      <div>{children}</div>
    </div>
  );
}

