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
import { Icon, type IconProps } from '@box-ui/icons';

export { matches, counted, plural } from './_lib';

/*
 * The docs chrome is Storybook's own look — its palette, its type, its 4px
 * radius, exposed as the `--sb-*` variables that preview.tsx reads out of
 * `storybook/theming`. Box UI tokens appear only inside demos, which always
 * carry both a background and a foreground so they read on any chrome.
 */

/**
 * An icon belonging to the documentation UI rather than to the documentation.
 *
 * Pinned to Linear: chrome must not follow the reader's Icon style choice, and
 * Solar does not draw every icon in every style — `magnifer` has no Bold Duotone
 * or Line Duotone, so the search field lost its magnifier on those two.
 */
function ChromeIcon(props: IconProps) {
  return <Icon iconStyle="linear" {...props} />;
}

// --- copy-to-clipboard -------------------------------------------------------

const CopyContext = createContext<(value: string, label?: string) => void>(() => {});

/** Copies a token name and raises the page toast. Available inside any `<Page>`. */
export function useCopy() {
  return useContext(CopyContext);
}

function Toast({ message }: { message: string | null }) {
  return (
    <div className="sb-toast" data-visible={message ? 'true' : 'false'} aria-live="polite">
      <ChromeIcon name="copy" size={14} />
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
    <button
      type="button"
      className="sb-code sb-code-button"
      onClick={() => copy(copyable)}
      title={`Скопировать ${copyable}`}
    >
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

  // Sticky things below the toolbar (table headers, the outline) start where it ends.
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = document.documentElement;
    const node = bar.current;
    if (!node) {
      root.style.setProperty('--sb-sticky-top', '0px');
      return;
    }
    const observer = new ResizeObserver(() =>
      root.style.setProperty(
        '--sb-sticky-top',
        getComputedStyle(node).position === 'sticky' ? `${node.offsetHeight}px` : '0px',
      ),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

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

        {toolbar && (
          <div className="sb-toolbar" ref={bar}>
            {toolbar}
          </div>
        )}

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
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap }}>
      {children}
    </div>
  );
}

// --- form controls -----------------------------------------------------------

/**
 * A select with its label inside the control, so every toolbar is one 28px
 * row whatever it holds.
 */
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
    <label className="sb-control sb-select">
      <span className="sb-select__label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/**
 * Several independent on/off options behind one 28px control — a menu of
 * checkboxes, so it never reads as a segmented control that picks one.
 * At least one option always stays on.
 */
export function MultiSelect({
  label,
  options,
  hidden,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  /** Values switched off. */
  hidden: Set<string>;
  onChange: (hidden: Set<string>) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (event instanceof KeyboardEvent ? event.key === 'Escape' : !root.current?.contains(event.target as Node))
        setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  const shown = options.length - hidden.size;
  const toggle = (value: string) => {
    const next = new Set(hidden);
    if (next.has(value)) next.delete(value);
    else if (shown > 1) next.add(value);
    onChange(next);
  };

  return (
    <div className="sb-menu" ref={root}>
      <button
        type="button"
        className="sb-control sb-select"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className="sb-select__label">{label}</span>
        <span>{hidden.size === 0 ? 'все' : `${shown} из ${options.length}`}</span>
        <ChromeIcon name="alt-arrow-down" size={12} />
      </button>
      {open && (
        <div className="sb-menu__popover" role="menu">
          {options.map((option) => {
            const on = !hidden.has(option.value);
            return (
              <button
                key={option.value}
                type="button"
                role="menuitemcheckbox"
                aria-checked={on}
                className="sb-menu__item"
                disabled={on && shown === 1}
                onClick={() => toggle(option.value)}
              >
                <span className="sb-menu__check" aria-hidden="true" />
                {option.label}
              </button>
            );
          })}
          {hidden.size > 0 && (
            <button type="button" className="sb-menu__item sb-menu__item--action" onClick={() => onChange(new Set())}>
              Показать все
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** Search box; `/` focuses it from anywhere on the page, Esc clears it. */
export function Search({
  value,
  onChange,
  placeholder = 'Поиск…',
  label = 'Поиск',
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
    <label aria-label={label} style={{ display: 'flex' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: 220 }}>
        <span
          style={{
            position: 'absolute',
            left: 8,
            display: 'flex',
            color: 'var(--sb-text-muted)',
            pointerEvents: 'none',
          }}
        >
          <ChromeIcon name="magnifer" size={14} />
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
              borderRadius: 'var(--sb-radius-inner)',
              fontSize: 10,
              pointerEvents: 'none',
            }}
          >
            /
          </kbd>
        )}
      </div>
    </label>
  );
}

/**
 * Copies the address of the page as the reader sees it — the manager URL, with
 * the toolbar globals and every filter on it, not the bare iframe.
 */
export function ShareLink() {
  const copy = useCopy();

  const share = () => {
    let href = window.location.href;
    try {
      // Same origin, so the manager URL is readable; fall back to the iframe's.
      href = window.parent?.location.href ?? href;
    } catch {
      /* cross-origin — the iframe URL is still a working link */
    }
    copy(href, 'ссылка на этот вид');
  };

  return (
    <ToolbarButton icon="link-round" onClick={share} title="Скопировать ссылку на эту страницу вместе с фильтрами" />
  );
}

/** Clears every filter back to the story's defaults. */
export function ResetFilters({ onReset }: { onReset: () => void }) {
  return (
    <ToolbarButton icon="restart" onClick={onReset} title="Сбросить все фильтры">
      Сбросить
    </ToolbarButton>
  );
}

/** A toolbar action; without children it is a square icon button labelled by its title. */
export function ToolbarButton({
  icon,
  title,
  onClick,
  children,
}: {
  icon: string;
  title: string;
  onClick: () => void;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      className={children ? 'sb-control sb-button' : 'sb-control sb-button sb-button--icon'}
      onClick={onClick}
      title={title}
      aria-label={children ? undefined : title}
    >
      <ChromeIcon name={icon} size={14} />
      {children}
    </button>
  );
}

/** A row of mutually exclusive options, for short filters. */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string; icon?: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="sb-segmented" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          className="sb-segmented__item"
          onClick={() => onChange(option.value)}
        >
          {option.icon && <ChromeIcon name={option.icon} size={14} />}
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Count({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'warning' }) {
  return <span className={tone === 'warning' ? 'sb-count sb-count--warning' : 'sb-count'}>{children}</span>;
}

/** Right-aligned group of counts inside a toolbar. */
export function Counts({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 28, marginLeft: 'auto' }}>{children}</div>
  );
}

/** An aside about the data itself — a Figma quirk, a caveat, a heads-up. */
export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="sb-callout">
      <span className="sb-callout__icon">
        <ChromeIcon name="info-circle" size={16} />
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
      <ChromeIcon name="magnifer" size={28} />
      <div>Ничего не найдено по запросу «{query}»</div>
      <button type="button" onClick={onClear} className="sb-link">
        Очистить поиск
      </button>
    </div>
  );
}

// --- mode scoping ------------------------------------------------------------

export type ModeGlobals = {
  theme: string;
  accent: string;
  radius: string;
  font: string;
  device: string;
  status: string;
  appearance: string;
  state: string;
};

/**
 * Scopes Box UI modes to a subtree.
 *
 * A custom property is substituted where it is *declared*, not where it is
 * read: `--accent-fill-solid: var(--brand-color-solid-500)` is resolved on
 * the element that declares it. So overriding only `data-accent` deeper in the
 * tree cannot reach a Theme token that `<html>` already resolved. Setting every
 * mode attribute together re-declares all eight layers on this one element, and
 * the whole chain resolves locally.
 */
export function Scope({
  globals,
  theme,
  accent,
  radius,
  font,
  device,
  status,
  appearance,
  state,
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
      data-status={status ?? globals.status}
      data-appearance={appearance ?? globals.appearance}
      data-state={state ?? globals.state}
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
  background: 'var(--surface-base-fill-raised)',
  color: 'var(--surface-base-content-strong)',
  border: '1px solid var(--surface-base-border-default)',
  borderRadius: 'var(--rounding-m)',
  padding: 'var(--spacing-3xs)',
};
