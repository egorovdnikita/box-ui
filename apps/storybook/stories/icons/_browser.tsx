import { useEffect, type ReactNode } from 'react';
import { Icon } from '@box-ui/icons';
import { useCopy } from '../_ui';

/*
 * The parts every icon page shares, so Системные, Флаги, Платежи and Бренды
 * look and behave alike: one tile size, one grid, and an inspector that opens
 * on the icon you pick — a large preview and the things worth copying — rather
 * than a click that silently copies.
 */

export function IconGrid({ children }: { children: ReactNode }) {
  return <div className="sb-icons">{children}</div>;
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

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
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
          onClick={onClose}
          title="Закрыть (Esc)"
          aria-label="Закрыть"
        >
          <Icon name="close-circle" size={14} iconStyle="linear" />
        </button>
      </div>
    </aside>
  );
}
