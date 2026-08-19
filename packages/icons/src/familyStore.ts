import { useEffect, useSyncExternalStore } from 'react';
import type { FamilyData, IconFamily } from './families';

/**
 * One JSON payload per family, loaded on demand — the flag set alone is over a
 * megabyte, so nothing is pulled in until a story actually renders it.
 */
// The generated JSON widens `family` to `string`, so the payload is cast on arrival.
const loaders: Record<IconFamily, () => Promise<unknown>> = {
  flags: () => import('./data/families/flags.json'),
  payments: () => import('./data/families/payments.json'),
  brands: () => import('./data/families/brands.json'),
};

const cache = new Map<IconFamily, FamilyData>();
const inflight = new Map<IconFamily, Promise<FamilyData>>();
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function loadFamily(family: IconFamily): Promise<FamilyData> {
  const cached = cache.get(family);
  if (cached) return Promise.resolve(cached);

  let pending = inflight.get(family);
  if (!pending) {
    pending = loaders[family]().then((module) => {
      const payload = module as { default?: unknown };
      const data = (payload.default ?? module) as FamilyData;
      cache.set(family, data);
      inflight.delete(family);
      emit();
      return data;
    });
    inflight.set(family, pending);
  }
  return pending;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Returns a family's entries, or `null` until they have loaded. */
export function useFamily(family: IconFamily): FamilyData | null {
  const data = useSyncExternalStore(
    subscribe,
    () => cache.get(family) ?? null,
    () => null,
  );

  useEffect(() => {
    void loadFamily(family);
  }, [family]);

  return data;
}
