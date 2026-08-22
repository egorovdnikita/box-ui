import { useEffect, useSyncExternalStore } from 'react';
import type { IconSet, IconStyle } from './types';

/**
 * One JSON payload per Figma `Style` mode, loaded on demand: switching the
 * style in Storybook (or in an app) pulls in only the set being displayed.
 */
const loaders: Record<IconStyle, () => Promise<{ default: IconSet } | IconSet>> = {
  bold: () => import('./data/bold.json'),
  'bold-duotone': () => import('./data/bold-duotone.json'),
  broken: () => import('./data/broken.json'),
  'line-duotone': () => import('./data/line-duotone.json'),
  linear: () => import('./data/linear.json'),
  outline: () => import('./data/outline.json'),
};

const cache = new Map<IconStyle, IconSet>();
const inflight = new Map<IconStyle, Promise<IconSet>>();
const listeners = new Set<() => void>();

/**
 * The set most recently displayed. Switching style pulls a payload of roughly a
 * megabyte, and until it arrives the requested set is simply absent — every icon
 * on screen would render as an empty box for that frame. Holding the last one
 * lets the old geometry stay up until the new geometry can replace it, which is
 * how an icon font behaves.
 */
let previous: IconSet | null = null;

function emit() {
  for (const listener of listeners) listener();
}

/** Loads (and caches) one style's icon bodies. Safe to call repeatedly. */
export function loadIconStyle(style: IconStyle): Promise<IconSet> {
  const cached = cache.get(style);
  if (cached) return Promise.resolve(cached);

  let pending = inflight.get(style);
  if (!pending) {
    pending = loaders[style]().then((module) => {
      const set = ('default' in module ? module.default : module) as IconSet;
      cache.set(style, set);
      previous = set;
      inflight.delete(style);
      emit();
      return set;
    });
    inflight.set(style, pending);
  }
  return pending;
}

export function getLoadedIconStyle(style: IconStyle): IconSet | null {
  return cache.get(style) ?? null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The last set that finished loading, whichever style it belongs to. */
export function getLastLoadedIconSet(): IconSet | null {
  return previous;
}

export interface IconSetState {
  /** The requested style's bodies, or the last loaded set while it arrives. */
  set: IconSet | null;
  /** True while `set` is standing in for a style that has not arrived yet. */
  pending: boolean;
}

/**
 * Returns the icon bodies for `style`. While that style is still loading it
 * hands back the previous set rather than nothing, so a style switch never
 * blanks the page.
 */
export function useIconSet(style: IconStyle): IconSetState {
  const set = useSyncExternalStore(
    subscribe,
    () => cache.get(style) ?? null,
    () => null,
  );

  useEffect(() => {
    void loadIconStyle(style);
  }, [style]);

  if (set) return { set, pending: false };
  return { set: previous, pending: true };
}
