import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { Icon } from '@box-ui/icons';
import { useCopy } from '../_ui';

/*
 * The parts every icon page shares, so Системные, Флаги, Платежи and Бренды
 * look and behave alike: one tile size, one grid, and an inspector that opens
 * on the icon you pick — a large preview and the things worth copying — rather
 * than a click that silently copies.
 */

const tilesIn = (grid: HTMLElement | null) => [...(grid?.querySelectorAll<HTMLElement>('.sb-icon-tile') ?? [])];

/** The tile the inspector belongs to, so closing it hands focus back there. */
const pickedTile = () => document.querySelector<HTMLElement>('.sb-icon-tile[aria-pressed="true"]');

/**
 * One Tab stop for the whole grid — arrows, Home and End move inside it — so
 * the inspector after it is a single Tab away rather than a thousand.
 */
export function IconGrid({ children }: { children: ReactNode }) {
  const grid = useRef<HTMLDivElement>(null);
  const current = useRef<HTMLElement | null>(null);

  // Re-runs on every render: filtering swaps the tiles under the grid.
  useEffect(() => {
    const tiles = tilesIn(grid.current);
    const active =
      tiles.find((tile) => tile === current.current) ??
      tiles.find((tile) => tile.getAttribute('aria-pressed') === 'true') ??
      tiles[0];
    for (const tile of tiles) tile.tabIndex = tile === active ? 0 : -1;
    current.current = active ?? null;
  });

  const moveTo = (tile: HTMLElement | undefined) => {
    if (!tile) return;
    if (current.current) current.current.tabIndex = -1;
    tile.tabIndex = 0;
    tile.focus();
    current.current = tile;
  };

  const onKeyDown = (event: ReactKeyboardEvent) => {
    const tiles = tilesIn(grid.current);
    const at = tiles.indexOf(event.target as HTMLElement);
    if (at < 0) return;
    // Columns of the grid as laid out right now: tiles sharing the first row's top.
    const columns = tiles.filter((tile) => tile.offsetTop === tiles[0].offsetTop).length || 1;
    const step: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: columns,
      ArrowUp: -columns,
      Home: -at,
      End: tiles.length - 1 - at,
    };
    if (!(event.key in step)) return;
    event.preventDefault();
    moveTo(tiles[Math.min(tiles.length - 1, Math.max(0, at + step[event.key]))]);
  };

  return (
    <div
      ref={grid}
      className="sb-icons"
      role="group"
      aria-label="Иконки: стрелки — выбор, Enter — открыть"
      onKeyDown={onKeyDown}
      onFocus={(event) => {
        if ((event.target as HTMLElement).classList.contains('sb-icon-tile'))
          current.current = event.target as HTMLElement;
      }}
    >
      {children}
    </div>
  );
}

export function IconTile({
  label,
  title,
  selected,
  muted,
  onSelect,
  children,
}: {
  label: string;
  title: string;
  selected: boolean;
  /** Drawn from a fallback (another style, a monogram). */
  muted?: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className="sb-icon-tile"
      data-muted={muted || undefined}
      aria-pressed={selected}
      title={title}
      onClick={onSelect}
    >
      <span className="sb-icon-tile__art">{children}</span>
      <span className="sb-icon-tile__label">{label}</span>
    </button>
  );
}

/** The grid's shape while a family loads, with the loading said for screen readers. */
export function IconGridSkeleton({ label }: { label: string }) {
  return (
    <div className="sb-icons" role="status" aria-label={label}>
      {Array.from({ length: 24 }, (_, i) => (
        <div key={i} className="sb-icon-tile sb-icon-tile--skeleton" aria-hidden="true">
          <span className="sb-icon-tile__art" />
          <span className="sb-icon-tile__label" />
        </div>
      ))}
    </div>
  );
}

export interface CopyAction {
  label: string;
  value: string;
}

/** The picked icon, pinned to the bottom of the page until closed with × or Esc. */
export function Inspector({
  preview,
  title,
  meta,
  actions,
  children,
  onClose,
}: {
  preview: ReactNode;
  title: string;
  meta: ReactNode;
  actions: CopyAction[];
  /** Extra row, e.g. the same icon in every style. */
  children?: ReactNode;
  onClose: () => void;
}) {
  const copy = useCopy();

  // Closing hands focus back to the tile it was opened from.
  const close = () => {
    const tile = pickedTile();
    onClose();
    tile?.focus();
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const tile = pickedTile();
      onClose();
      tile?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <aside className="sb-inspector" aria-label={title}>
      <div className="sb-inspector__preview">{preview}</div>
      <div className="sb-inspector__body">
        <div className="sb-inspector__title">{title}</div>
        <div className="sb-caption">{meta}</div>
        {children}
      </div>
      <div className="sb-inspector__actions">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className="sb-control sb-button"
            onClick={() => copy(action.value)}
            title={action.value}
          >
            <Icon name="copy" size={14} iconStyle="linear" />
            {action.label}
          </button>
        ))}
        <button
          type="button"
          className="sb-control sb-button sb-button--icon"
          onClick={close}
          title="Закрыть (Esc)"
          aria-label="Закрыть"
        >
          <Icon name="close-circle" size={14} iconStyle="linear" />
        </button>
      </div>
    </aside>
  );
}
