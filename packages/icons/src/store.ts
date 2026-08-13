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

/** Returns the icon bodies for `style`, or `null` until they have loaded. */
export function useIconSet(style: IconStyle): IconSet | null {
  const set = useSyncExternalStore(
    subscribe,
    () => cache.get(style) ?? null,
    () => null,
  );

  useEffect(() => {
    void loadIconStyle(style);
  }, [style]);

  return set;
}
